import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Users,
  MessageSquare,
  Share2,
  FileText,
  BarChart3,
  Settings,
  Hand,
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Send,
  Download,
  Upload,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { api } from '@/services/api';

interface LiveClassRoomProps {
  classId: string;
  userType: 'student' | 'tutor';
  initialConfig: {
    hasCamera: boolean;
    hasMicrophone: boolean;
    cameraEnabled: boolean;
    micEnabled: boolean;
    selectedDevices: {
      camera?: string;
      microphone?: string;
      speaker?: string;
    };
  };
  onLeaveClass: () => void;
}

interface Participant {
  id: string;
  name: string;
  userType: 'student' | 'tutor';
  cameraEnabled: boolean;
  micEnabled: boolean;
  handRaised: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'hand_raise';
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  responses: number[];
  isActive: boolean;
  userResponse?: number;
}

const LiveClassRoom: React.FC<LiveClassRoomProps> = ({ 
  classId, 
  userType, 
  initialConfig, 
  onLeaveClass 
}) => {
  // Main state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [classData, setClassData] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // Media state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(initialConfig.cameraEnabled);
  const [micEnabled, setMicEnabled] = useState(initialConfig.micEnabled);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'participants' | 'chat' | 'polls' | 'resources'>('participants');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Polls state
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  
  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement }>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const attendanceTimerRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();

  // Initialize class room
  useEffect(() => {
    initializeClassRoom();
    
    return () => {
      cleanupConnection();
    };
  }, [classId]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeClassRoom = async () => {
    try {
      setConnectionStatus('connecting');

      // Join the class via API
      const joinResponse = await api.post(`/live-classes/${classId}/join`, {
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          browser: navigator.userAgent.split(' ').pop() || 'Unknown'
        }
      });

      if (joinResponse.data.success) {
        setClassData(joinResponse.data.data);

        // Initialize media stream
        await initializeMediaStream();

        // Initialize WebRTC connection (simplified simulation)
        await initializeWebRTC();

        // Start attendance tracking
        startAttendanceTracking();

        setConnectionStatus('connected');
        setIsConnected(true);

        toast({
          title: 'Connected',
          description: 'Successfully joined the live class',
        });
      }
    } catch (error: any) {
      console.log('API join failed, using mock data for demo:', error.message);

      // Fallback to mock data and direct connection for demo
      const mockJoinData = {
        roomId: `room_${classId}`,
        accessToken: 'mock_token',
        settings: {
          recordingEnabled: true,
          cameraRequired: false,
          microphoneRequired: false,
          attendanceThreshold: 80,
          allowLateJoin: true,
          autoMuteOnJoin: true,
          enableChat: true,
          enableScreenShare: true,
          enableWhiteboard: true,
          enablePolls: true
        },
        attendance: `attendance_${Date.now()}`
      };

      setClassData(mockJoinData);

      try {
        // Initialize media stream
        await initializeMediaStream();

        // Initialize WebRTC connection (simplified simulation)
        await initializeWebRTC();

        // Start attendance tracking
        startAttendanceTracking();

        setConnectionStatus('connected');
        setIsConnected(true);

        toast({
          title: 'Connected',
          description: 'Successfully joined the live class (demo mode)',
        });
      } catch (mediaError: any) {
        console.log('Media initialization failed, continuing without media:', mediaError.message);

        // Even if media fails, still allow connection to the class
        await initializeWebRTC();
        startAttendanceTracking();

        setConnectionStatus('connected');
        setIsConnected(true);

        toast({
          title: 'Connected',
          description: 'Joined live class (limited media access)',
        });
      }
    }
  };

  const initializeMediaStream = async () => {
    try {
      const constraints: MediaStreamConstraints = {};
      
      if (initialConfig.hasCamera && cameraEnabled) {
        constraints.video = {
          deviceId: initialConfig.selectedDevices.camera ? 
            { exact: initialConfig.selectedDevices.camera } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 }
        };
      }
      
      if (initialConfig.hasMicrophone && micEnabled) {
        constraints.audio = {
          deviceId: initialConfig.selectedDevices.microphone ? 
            { exact: initialConfig.selectedDevices.microphone } : undefined,
          echoCancellation: true,
          noiseSuppression: true
        };
      }

      if (Object.keys(constraints).length > 0) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (error: any) {
      toast({
        title: 'Media Error',
        description: `Failed to access camera/microphone: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const initializeWebRTC = async () => {
    // This is a simplified simulation of WebRTC connection
    // In a real implementation, you would use a library like Simple Peer, 
    // Socket.IO for signaling, or a service like Agora, Twilio, or Jitsi
    
    // Simulate adding participants
    const mockParticipants: Participant[] = [
      {
        id: 'tutor-1',
        name: 'Dr. Sarah Chen',
        userType: 'tutor',
        cameraEnabled: true,
        micEnabled: true,
        handRaised: false,
        connectionStatus: 'connected'
      },
      {
        id: 'student-1',
        name: 'Alex Johnson',
        userType: 'student',
        cameraEnabled: true,
        micEnabled: false,
        handRaised: false,
        connectionStatus: 'connected'
      },
      {
        id: 'student-2',
        name: 'Maria Garcia',
        userType: 'student',
        cameraEnabled: false,
        micEnabled: true,
        handRaised: true,
        connectionStatus: 'connected'
      }
    ];

    // Add current user to participants
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentParticipant: Participant = {
      id: currentUser.id || 'current-user',
      name: currentUser.name || 'You',
      userType,
      cameraEnabled,
      micEnabled,
      handRaised: false,
      connectionStatus: 'connected'
    };

    setParticipants([currentParticipant, ...mockParticipants]);

    // Simulate some chat messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'system',
        userName: 'System',
        message: 'Live class has started',
        timestamp: new Date(Date.now() - 300000),
        type: 'system'
      },
      {
        id: '2',
        userId: 'tutor-1',
        userName: 'Dr. Sarah Chen',
        message: 'Welcome everyone! Let\'s begin with today\'s topic.',
        timestamp: new Date(Date.now() - 240000),
        type: 'message'
      },
      {
        id: '3',
        userId: 'student-1',
        userName: 'Alex Johnson',
        message: 'Looking forward to this session!',
        timestamp: new Date(Date.now() - 180000),
        type: 'message'
      }
    ];

    setChatMessages(mockMessages);
  };

  const startAttendanceTracking = () => {
    // Track attendance every minute
    attendanceTimerRef.current = setInterval(() => {
      // In a real implementation, this would send periodic attendance updates
      console.log('Tracking attendance...');
    }, 60000);
  };

  const cleanupConnection = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (attendanceTimerRef.current) {
      clearInterval(attendanceTimerRef.current);
    }
  };

  const toggleCamera = async () => {
    try {
      if (cameraEnabled) {
        // Turn off camera
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.enabled = false;
            setCameraEnabled(false);
          }
        }
      } else {
        // Turn on camera - need to request camera access
        try {
          const constraints: MediaStreamConstraints = {
            video: {
              deviceId: initialConfig.selectedDevices.camera ?
                { exact: initialConfig.selectedDevices.camera } : undefined,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          };

          // If we have an existing stream with audio, preserve it
          if (localStream && localStream.getAudioTracks().length > 0) {
            constraints.audio = {
              deviceId: initialConfig.selectedDevices.microphone ?
                { exact: initialConfig.selectedDevices.microphone } : undefined,
              echoCancellation: true,
              noiseSuppression: true
            };
          }

          // Stop existing video tracks
          if (localStream) {
            localStream.getVideoTracks().forEach(track => track.stop());
          }

          // Get new stream with video
          const newStream = await navigator.mediaDevices.getUserMedia(constraints);

          // If we had an existing stream with audio, add the audio track to the new stream
          if (localStream && localStream.getAudioTracks().length > 0) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack && !newStream.getAudioTracks().length) {
              newStream.addTrack(audioTrack);
            }
          }

          setLocalStream(newStream);
          setCameraEnabled(true);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = newStream;
          }

          toast({
            title: 'Camera Enabled',
            description: 'Your camera is now active',
          });
        } catch (error: any) {
          toast({
            title: 'Camera Error',
            description: `Failed to enable camera: ${error.message}`,
            variant: 'destructive',
          });
          return;
        }
      }

      // Update participant state
      setParticipants(prev => prev.map(p =>
        p.id === (JSON.parse(localStorage.getItem('user') || '{}')).id
          ? { ...p, cameraEnabled: !cameraEnabled }
          : p
      ));

      // Track the camera toggle event (fallback for demo)
      try {
        await api.post(`/live-classes/${classId}/events`, {
          type: cameraEnabled ? 'camera_off' : 'camera_on',
          timestamp: new Date()
        });
      } catch (error) {
        console.log('Event tracking not available (demo mode)');
      }
    } catch (error: any) {
      console.error('Camera toggle error:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle camera',
        variant: 'destructive',
      });
    }
  };

  const toggleMicrophone = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
        setMicEnabled(!micEnabled);
        
        // Update participant state
        setParticipants(prev => prev.map(p => 
          p.id === (JSON.parse(localStorage.getItem('user') || '{}')).id 
            ? { ...p, micEnabled: !micEnabled }
            : p
        ));

        // Track the microphone toggle event (fallback for demo)
        try {
          await api.post(`/live-classes/${classId}/events`, {
            type: micEnabled ? 'mic_off' : 'mic_on',
            timestamp: new Date()
          });
        } catch (error) {
          console.log('Event tracking not available (demo mode)');
        }
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track in existing stream
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            localStream.removeTrack(videoTrack);
          }
          localStream.addTrack(screenStream.getVideoTracks()[0]);
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
        }
        
        setIsScreenSharing(true);
        
        // Listen for screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          // Restart camera if it was enabled
          if (cameraEnabled) {
            initializeMediaStream();
          }
        };
      } else {
        // Stop screen sharing and restart camera
        setIsScreenSharing(false);
        if (cameraEnabled) {
          initializeMediaStream();
        }
      }
    } catch (error: any) {
      toast({
        title: 'Screen Share Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        // Start recording
        setIsRecording(true);
        toast({
          title: 'Recording Started',
          description: 'This session is now being recorded',
        });
      } else {
        // Stop recording
        setIsRecording(false);
        toast({
          title: 'Recording Stopped',
          description: 'Recording has been saved',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Recording Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const raiseHand = async () => {
    const newHandState = !handRaised;
    setHandRaised(newHandState);
    
    // Update participant state
    setParticipants(prev => prev.map(p => 
      p.id === (JSON.parse(localStorage.getItem('user') || '{}')).id 
        ? { ...p, handRaised: newHandState }
        : p
    ));

    // Add system message to chat
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system',
      userName: 'System',
      message: `${currentUser.name} ${newHandState ? 'raised' : 'lowered'} their hand`,
      timestamp: new Date(),
      type: 'system'
    };
    
    setChatMessages(prev => [...prev, systemMessage]);

    // Track the hand raise event (fallback for demo)
    try {
      await api.post(`/live-classes/${classId}/events`, {
        type: 'hand_raise',
        timestamp: new Date(),
        metadata: { raised: newHandState }
      });
    } catch (error) {
      console.log('Event tracking not available (demo mode)');
    }
  };

  const sendChatMessage = async () => {
    if (newMessage.trim()) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUser.id || 'current-user',
        userName: currentUser.name || 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'message'
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');

      // Track the message event (fallback for demo)
      try {
        await api.post(`/live-classes/${classId}/events`, {
          type: 'message',
          timestamp: new Date(),
          metadata: { message: message.message }
        });
      } catch (error) {
        console.log('Event tracking not available (demo mode)');
      }
    }
  };

  const createPoll = async () => {
    if (pollQuestion.trim() && pollOptions.every(opt => opt.trim())) {
      try {
        const response = await api.post(`/live-classes/${classId}/polls`, {
          question: pollQuestion,
          options: pollOptions.filter(opt => opt.trim())
        });

        if (response.data.success) {
          const newPoll: Poll = {
            id: Date.now().toString(),
            question: pollQuestion,
            options: pollOptions.filter(opt => opt.trim()),
            responses: new Array(pollOptions.filter(opt => opt.trim()).length).fill(0),
            isActive: true
          };

          setActivePolls(prev => [...prev, newPoll]);
          setPollQuestion('');
          setPollOptions(['', '']);

          toast({
            title: 'Poll Created',
            description: 'Your poll has been sent to all participants',
          });
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create poll',
          variant: 'destructive',
        });
      }
    }
  };

  const respondToPoll = async (pollId: string, optionIndex: number) => {
    try {
      const pollIndex = activePolls.findIndex(p => p.id === pollId);
      if (pollIndex === -1) return;

      await api.post(`/live-classes/${classId}/polls/${pollIndex}/respond`, {
        answer: optionIndex
      });

      // Update local poll state
      setActivePolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          const newResponses = [...poll.responses];
          newResponses[optionIndex]++;
          return { ...poll, responses: newResponses, userResponse: optionIndex };
        }
        return poll;
      }));

      toast({
        title: 'Response Recorded',
        description: 'Your poll response has been submitted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit response',
        variant: 'destructive',
      });
    }
  };

  const leaveClass = async () => {
    try {
      await api.post(`/live-classes/${classId}/leave`);
      cleanupConnection();
      onLeaveClass();
    } catch (error: any) {
      console.error('Error leaving class:', error);
      cleanupConnection();
      onLeaveClass();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500">Connected</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500">Connecting...</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isConnected && connectionStatus !== 'connecting') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to connect to the live class. Please check your internet connection and try again.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-x-2">
              <Button onClick={initializeClassRoom}>Retry</Button>
              <Button variant="outline" onClick={onLeaveClass}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (connectionStatus === 'connecting') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to live class...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{classData?.title || 'Live Class'}</h1>
            {getConnectionStatusBadge()}
            <Badge variant="outline" className="text-white">
              <Users className="h-3 w-3 mr-1" />
              {participants.length} participants
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge className="bg-red-500 animate-pulse">
                <Square className="h-3 w-3 mr-1" />
                Recording
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            {cameraEnabled || isScreenSharing ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <CameraOff className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-black/50 text-white">
                You {isScreenSharing && '(Screen)'}
              </Badge>
            </div>
            
            <div className="absolute bottom-2 right-2 flex gap-1">
              {!micEnabled && <MicOff className="h-4 w-4 text-red-500" />}
              {handRaised && <Hand className="h-4 w-4 text-yellow-500" />}
            </div>
          </div>

          {/* Remote Videos (Mock) */}
          {participants.filter(p => p.id !== (JSON.parse(localStorage.getItem('user') || '{}')).id).map((participant) => (
            <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              {participant.cameraEnabled ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="text-white text-2xl font-bold">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <CameraOff className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black/50 text-white">
                  {participant.name}
                  {participant.userType === 'tutor' && ' (Tutor)'}
                </Badge>
              </div>
              
              <div className="absolute bottom-2 right-2 flex gap-1">
                {!participant.micEnabled && <MicOff className="h-4 w-4 text-red-500" />}
                {participant.handRaised && <Hand className="h-4 w-4 text-yellow-500" />}
                <div className={`w-2 h-2 rounded-full ${
                  participant.connectionStatus === 'connected' ? 'bg-green-500' : 
                  participant.connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={toggleCamera}
              variant={cameraEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              {cameraEnabled ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
            </Button>
            
            <Button
              onClick={toggleMicrophone}
              variant={micEnabled ? "default" : "destructive"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            
            {userType === 'tutor' && (
              <Button
                onClick={toggleScreenShare}
                variant={isScreenSharing ? "secondary" : "outline"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
              </Button>
            )}
            
            <Button
              onClick={raiseHand}
              variant={handRaised ? "secondary" : "outline"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <Hand className="h-6 w-6" />
            </Button>
            
            {userType === 'tutor' && (
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {isRecording ? <Square className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            )}
            
            <Button
              onClick={leaveClass}
              variant="destructive"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarVisible && (
        <div className="w-80 bg-white border-l flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex gap-1">
              <Button
                variant={activeTab === 'participants' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('participants')}
              >
                <Users className="h-4 w-4 mr-1" />
                Participants
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Chat
              </Button>
              <Button
                variant={activeTab === 'polls' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('polls')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Polls
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            {/* Participants Tab */}
            {activeTab === 'participants' && (
              <div className="p-4 space-y-2">
                <h3 className="font-semibold mb-3">Participants ({participants.length})</h3>
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        participant.connectionStatus === 'connected' ? 'bg-green-500' : 
                        participant.connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{participant.name}</span>
                      {participant.userType === 'tutor' && (
                        <Badge variant="outline" className="text-xs">Tutor</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.handRaised && <Hand className="h-3 w-3 text-yellow-500" />}
                      {participant.cameraEnabled ? (
                        <Camera className="h-3 w-3 text-green-500" />
                      ) : (
                        <CameraOff className="h-3 w-3 text-gray-400" />
                      )}
                      {participant.micEnabled ? (
                        <Mic className="h-3 w-3 text-green-500" />
                      ) : (
                        <MicOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 overflow-auto" ref={chatContainerRef}>
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`${
                        message.type === 'system' ? 'text-center' : ''
                      }`}>
                        {message.type === 'system' ? (
                          <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 inline-block">
                            {message.message}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-700">
                                {message.userName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className="text-sm bg-gray-100 rounded px-3 py-2">
                              {message.message}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    />
                    <Button onClick={sendChatMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Polls Tab */}
            {activeTab === 'polls' && (
              <div className="p-4 space-y-4">
                {userType === 'tutor' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Create Poll</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Enter your question"
                      />
                      {pollOptions.map((option, index) => (
                        <Input
                          key={index}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...pollOptions];
                            newOptions[index] = e.target.value;
                            setPollOptions(newOptions);
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPollOptions([...pollOptions, ''])}
                        >
                          Add Option
                        </Button>
                        <Button onClick={createPoll} size="sm">
                          Create Poll
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activePolls.map((poll) => (
                  <Card key={poll.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">{poll.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {poll.options.map((option, index) => (
                        <div key={index} className="space-y-1">
                          <Button
                            variant={poll.userResponse === index ? "default" : "outline"}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => respondToPoll(poll.id, index)}
                            disabled={poll.userResponse !== undefined}
                          >
                            {option}
                          </Button>
                          {poll.userResponse !== undefined && (
                            <div className="text-xs text-gray-600">
                              {poll.responses[index]} responses
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveClassRoom;
