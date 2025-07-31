import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Headphones
} from 'lucide-react';

interface CameraSetupProps {
  onSetupComplete: (config: {
    hasCamera: boolean;
    hasMicrophone: boolean;
    hasAudio: boolean;
    cameraEnabled: boolean;
    micEnabled: boolean;
    selectedDevices: {
      camera?: string;
      microphone?: string;
      speaker?: string;
    };
  }) => void;
  onCancel: () => void;
  classSettings?: {
    cameraRequired: boolean;
    microphoneRequired: boolean;
  };
}

interface MediaDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

const CameraSetup: React.FC<CameraSetupProps> = ({ 
  onSetupComplete, 
  onCancel, 
  classSettings = { cameraRequired: false, microphoneRequired: false } 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    speaker: false
  });
  const [deviceTests, setDeviceTests] = useState({
    camera: false,
    microphone: false,
    speaker: false
  });
  const [availableDevices, setAvailableDevices] = useState<MediaDevice[]>([]);
  const [selectedDevices, setSelectedDevices] = useState({
    camera: '',
    microphone: '',
    speaker: ''
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [setupErrors, setSetupErrors] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  
  const { toast } = useToast();

  useEffect(() => {
    checkInitialPermissions();
    getAvailableDevices();
    
    return () => {
      cleanupStream();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const checkInitialPermissions = async () => {
    try {
      // Check existing permissions
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setDevicePermissions({
        camera: cameraPermission.state === 'granted',
        microphone: microphonePermission.state === 'granted',
        speaker: true
      });
    } catch (error) {
      console.log('Permission query not supported, will request when needed');
    }
  };

  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mediaDevices: MediaDevice[] = devices.map(device => ({
        deviceId: device.deviceId,
        label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
        kind: device.kind
      }));
      
      setAvailableDevices(mediaDevices);
      
      const firstCamera = mediaDevices.find(d => d.kind === 'videoinput');
      const firstMic = mediaDevices.find(d => d.kind === 'audioinput');
      const firstSpeaker = mediaDevices.find(d => d.kind === 'audiooutput');
      
      setSelectedDevices({
        camera: firstCamera?.deviceId || '',
        microphone: firstMic?.deviceId || '',
        speaker: firstSpeaker?.deviceId || ''
      });
    } catch (error) {
      setSetupErrors(prev => [...prev, 'Failed to enumerate media devices']);
    }
  };

  const requestPermissions = async () => {
    const errors: string[] = [];
    const permissions = { ...devicePermissions };

    try {
      if (!permissions.camera) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { deviceId: selectedDevices.camera ? { exact: selectedDevices.camera } : undefined }
          });
          permissions.camera = true;
          videoStream.getTracks().forEach(track => track.stop());
        } catch (error: any) {
          errors.push(`Camera access denied: ${error.message}`);
          if (classSettings.cameraRequired) {
            throw new Error('Camera access is required for this class');
          }
        }
      }

      if (!permissions.microphone) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: { deviceId: selectedDevices.microphone ? { exact: selectedDevices.microphone } : undefined }
          });
          permissions.microphone = true;
          audioStream.getTracks().forEach(track => track.stop());
        } catch (error: any) {
          errors.push(`Microphone access denied: ${error.message}`);
          if (classSettings.microphoneRequired) {
            throw new Error('Microphone access is required for this class');
          }
        }
      }

      setDevicePermissions(permissions);
      setSetupErrors(errors);
      
      if (errors.length === 0 || (!classSettings.cameraRequired && !classSettings.microphoneRequired)) {
        setCurrentStep(2);
        startDeviceTests();
      }
    } catch (error: any) {
      toast({
        title: 'Permission Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const startDeviceTests = async () => {
    try {
      const constraints: MediaStreamConstraints = {};
      
      if (devicePermissions.camera && selectedDevices.camera) {
        constraints.video = { 
          deviceId: { exact: selectedDevices.camera },
          width: { ideal: 640 },
          height: { ideal: 480 }
        };
      }
      
      if (devicePermissions.microphone && selectedDevices.microphone) {
        constraints.audio = { 
          deviceId: { exact: selectedDevices.microphone },
          echoCancellation: true,
          noiseSuppression: true
        };
      }

      if (Object.keys(constraints).length === 0) {
        setCurrentStep(3);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (constraints.video && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setDeviceTests(prev => ({ ...prev, camera: true }));
      }

      if (constraints.audio) {
        setupAudioAnalysis(mediaStream);
        setDeviceTests(prev => ({ ...prev, microphone: true }));
      }

      setCurrentStep(3);
    } catch (error: any) {
      toast({
        title: 'Device Test Error',
        description: `Failed to access devices: ${error.message}`,
        variant: 'destructive',
      });
      setSetupErrors(prev => [...prev, error.message]);
    }
  };

  const setupAudioAnalysis = (mediaStream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(Math.min(100, (average / 255) * 100));
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Failed to setup audio analysis:', error);
    }
  };

  const testSpeakers = async () => {
    setIsTestingAudio(true);
    
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
      
      setDeviceTests(prev => ({ ...prev, speaker: true }));
      
      setTimeout(() => {
        setIsTestingAudio(false);
        audioContext.close();
      }, 1100);
    } catch (error) {
      setIsTestingAudio(false);
      toast({
        title: 'Speaker Test Failed',
        description: 'Could not test speakers',
        variant: 'destructive',
      });
    }
  };

  const cleanupStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const retrySetup = () => {
    cleanupStream();
    setCurrentStep(1);
    setDevicePermissions({ camera: false, microphone: false, speaker: false });
    setDeviceTests({ camera: false, microphone: false, speaker: false });
    setSetupErrors([]);
    setAudioLevel(0);
    checkInitialPermissions();
    getAvailableDevices();
  };

  const completeSetup = () => {
    cleanupStream();
    
    onSetupComplete({
      hasCamera: devicePermissions.camera,
      hasMicrophone: devicePermissions.microphone,
      hasAudio: devicePermissions.microphone,
      cameraEnabled: deviceTests.camera,
      micEnabled: deviceTests.microphone,
      selectedDevices
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Grant Permissions';
      case 2: return 'Testing Devices';
      case 3: return 'Final Check';
      default: return 'Setup';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Please allow access to your camera and microphone';
      case 2: return 'We are testing your camera and microphone';
      case 3: return 'Review your setup and test your speakers';
      default: return '';
    }
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 0;
    }
  };

  const cameraDevices = availableDevices.filter(d => d.kind === 'videoinput');
  const microphoneDevices = availableDevices.filter(d => d.kind === 'audioinput');
  const speakerDevices = availableDevices.filter(d => d.kind === 'audiooutput');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Camera & Microphone Setup
          </CardTitle>
          <CardDescription>
            {getStepDescription()}
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of 3: {getStepTitle()}</span>
              <span>{getProgressValue()}%</span>
            </div>
            <Progress value={getProgressValue()} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Requirements Alert */}
          {(classSettings.cameraRequired || classSettings.microphoneRequired) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This class requires:
                {classSettings.cameraRequired && ' Camera access'}
                {classSettings.cameraRequired && classSettings.microphoneRequired && ' and'}
                {classSettings.microphoneRequired && ' Microphone access'}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Messages */}
          {setupErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {setupErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Permissions */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        <span>Camera</span>
                      </div>
                      {devicePermissions.camera ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Granted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          Not Granted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {classSettings.cameraRequired ? 'Required for this class' : 'Optional for this class'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="h-5 w-5" />
                        <span>Microphone</span>
                      </div>
                      {devicePermissions.microphone ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Granted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          Not Granted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {classSettings.microphoneRequired ? 'Required for this class' : 'Optional for this class'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={requestPermissions} className="w-full">
                Grant Permissions
              </Button>
            </div>
          )}

          {/* Step 2: Device Testing */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Testing your devices...</p>
              </div>
            </div>
          )}

          {/* Step 3: Final Check */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Camera Preview */}
              {devicePermissions.camera && deviceTests.camera && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Camera Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full max-w-md mx-auto aspect-video object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-green-600 bg-black/50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Working
                        </Badge>
                      </div>
                    </div>
                    
                    {cameraDevices.length > 1 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Camera Device:</label>
                        <select 
                          value={selectedDevices.camera}
                          onChange={(e) => setSelectedDevices(prev => ({ ...prev, camera: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {cameraDevices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Microphone Test */}
              {devicePermissions.microphone && deviceTests.microphone && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      Microphone Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm">Speak to test your microphone:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-100"
                            style={{ width: `${audioLevel}%` }}
                          />
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          <Mic className="h-3 w-3 mr-1" />
                          {audioLevel > 10 ? 'Active' : 'Silent'}
                        </Badge>
                      </div>

                      {microphoneDevices.length > 1 && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Microphone Device:</label>
                          <select 
                            value={selectedDevices.microphone}
                            onChange={(e) => setSelectedDevices(prev => ({ ...prev, microphone: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            {microphoneDevices.map(device => (
                              <option key={device.deviceId} value={device.deviceId}>
                                {device.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Speaker Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Speaker Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Click the button below to test your speakers. You should hear a short beep.
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={testSpeakers}
                        disabled={isTestingAudio}
                        variant="outline"
                      >
                        {isTestingAudio ? (
                          <>
                            <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                            Playing Test Sound...
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Test Speakers
                          </>
                        )}
                      </Button>
                      
                      {deviceTests.speaker && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Tested
                        </Badge>
                      )}
                    </div>

                    {speakerDevices.length > 1 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Speaker Device:</label>
                        <select 
                          value={selectedDevices.speaker}
                          onChange={(e) => setSelectedDevices(prev => ({ ...prev, speaker: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {speakerDevices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>
                              {device.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Setup Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Setup Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      {deviceTests.camera ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <CameraOff className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={deviceTests.camera ? 'text-green-600' : 'text-gray-600'}>
                        Camera {deviceTests.camera ? 'Ready' : 'Not Available'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {deviceTests.microphone ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <MicOff className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={deviceTests.microphone ? 'text-green-600' : 'text-gray-600'}>
                        Microphone {deviceTests.microphone ? 'Ready' : 'Not Available'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {deviceTests.speaker ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <VolumeX className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={deviceTests.speaker ? 'text-green-600' : 'text-gray-600'}>
                        Speakers {deviceTests.speaker ? 'Tested' : 'Not Tested'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <div className="space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button variant="outline" onClick={retrySetup}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Setup
                </Button>
              )}
            </div>
            
            {currentStep === 3 && (
              <Button onClick={completeSetup}>
                Join Class
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraSetup;
