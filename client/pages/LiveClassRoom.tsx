import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CameraSetup from '@/components/live-class/CameraSetup';
import LiveClassRoom from '@/components/live-class/LiveClassRoom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { api } from '@/services/api';

interface SetupConfig {
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
}

const LiveClassRoomPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<'loading' | 'setup' | 'classroom'>('loading');
  const [classData, setClassData] = useState<any>(null);
  const [setupConfig, setSetupConfig] = useState<SetupConfig | null>(null);
  const [userType, setUserType] = useState<'student' | 'tutor'>('student');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) {
      setError('Invalid class ID');
      return;
    }

    loadClassData();
    loadUserType();
  }, [classId]);

  const loadClassData = async () => {
    try {
      // Check if user has access to this class
      const response = await api.get(`/live-classes/${classId}`);

      if (response.data.success) {
        setClassData(response.data.data);
        setCurrentStep('setup');
      }
    } catch (error: any) {
      console.log('API call failed, using mock data for demo:', error.message);

      // Fallback to mock data for demo purposes
      const mockClassData = {
        _id: classId,
        title: 'Advanced React Patterns & Performance',
        description: 'Learn advanced React patterns, performance optimization techniques, and best practices.',
        tutor: {
          _id: 'tutor1',
          name: 'Dr. Sarah Chen',
          email: 'sarah@example.com'
        },
        course: {
          _id: 'course1',
          title: 'React Mastery Course',
          description: 'Complete React development course'
        },
        scheduledStartTime: new Date().toISOString(),
        scheduledEndTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
        status: 'live',
        maxParticipants: 50,
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
        roomId: `room_${classId}`,
        metadata: {
          totalParticipants: 12,
          peakConcurrentUsers: 15
        }
      };

      setClassData(mockClassData);
      setCurrentStep('setup');
    }
  };

  const loadUserType = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserType(user.userType || 'student');
    }
  };

  const handleSetupComplete = (config: SetupConfig) => {
    setSetupConfig(config);
    setCurrentStep('classroom');
  };

  const handleSetupCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handleLeaveClass = () => {
    navigate('/'); // Go to dashboard or home
  };

  if (currentStep === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading class information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Go Back
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'setup') {
    return (
      <CameraSetup
        onSetupComplete={handleSetupComplete}
        onCancel={handleSetupCancel}
        classSettings={{
          cameraRequired: classData?.settings?.cameraRequired || false,
          microphoneRequired: classData?.settings?.microphoneRequired || false
        }}
      />
    );
  }

  if (currentStep === 'classroom' && setupConfig && classId) {
    return (
      <LiveClassRoom
        classId={classId}
        userType={userType}
        initialConfig={setupConfig}
        onLeaveClass={handleLeaveClass}
      />
    );
  }

  return null;
};

export default LiveClassRoomPage;
