import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Play,
  Pause,
  Square,
  Settings,
  AlertTriangle,
  CheckCircle,
  Eye,
  BookOpen
} from 'lucide-react';
import { api } from '@/services/api';

interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  tutor: {
    _id: string;
    name: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    description?: string;
  };
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  maxParticipants: number;
  settings: {
    recordingEnabled: boolean;
    cameraRequired: boolean;
    microphoneRequired: boolean;
    attendanceThreshold: number;
  };
  metadata: {
    totalParticipants: number;
    peakConcurrentUsers: number;
  };
}

const LiveClassesList: React.FC = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [userType, setUserType] = useState<'student' | 'tutor'>('student');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    course: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    maxParticipants: 30,
    cameraRequired: false,
    microphoneRequired: false,
    recordingEnabled: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserType();
    loadLiveClasses();
  }, [activeTab]);

  const loadUserType = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserType(user.userType || 'student');
    }
  };

  const loadLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/live-classes', {
        params: { status: activeTab === 'upcoming' ? 'scheduled' : activeTab }
      });

      if (response.data.success) {
        setLiveClasses(response.data.data);
      }
    } catch (error: any) {
      // If API fails, show mock data
      const mockClasses: LiveClass[] = [
        {
          _id: '1',
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
          scheduledStartTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          scheduledEndTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
          status: activeTab === 'live' ? 'live' : activeTab === 'completed' ? 'completed' : 'scheduled',
          maxParticipants: 50,
          settings: {
            recordingEnabled: true,
            cameraRequired: false,
            microphoneRequired: false,
            attendanceThreshold: 80
          },
          metadata: {
            totalParticipants: 35,
            peakConcurrentUsers: 42
          }
        },
        {
          _id: '2',
          title: 'Database Design & SQL Optimization',
          description: 'Master database design principles and SQL query optimization.',
          tutor: {
            _id: 'tutor2',
            name: 'Prof. Michael Rodriguez',
            email: 'michael@example.com'
          },
          course: {
            _id: 'course2',
            title: 'Database Systems',
            description: 'Comprehensive database course'
          },
          scheduledStartTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          scheduledEndTime: new Date(Date.now() + 90000000).toISOString(),
          status: 'scheduled',
          maxParticipants: 40,
          settings: {
            recordingEnabled: true,
            cameraRequired: true,
            microphoneRequired: false,
            attendanceThreshold: 75
          },
          metadata: {
            totalParticipants: 28,
            peakConcurrentUsers: 28
          }
        }
      ];

      setLiveClasses(mockClasses.filter(cls => {
        if (activeTab === 'upcoming') return cls.status === 'scheduled';
        if (activeTab === 'live') return cls.status === 'live';
        if (activeTab === 'completed') return cls.status === 'completed';
        return true;
      }));
    } finally {
      setLoading(false);
    }
  };

  const joinClass = (classId: string) => {
    navigate(`/live-classes/${classId}`);
  };

  const createClass = async () => {
    try {
      const response = await api.post('/live-classes', createFormData);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Live class created successfully',
        });
        setShowCreateForm(false);
        setCreateFormData({
          title: '',
          description: '',
          course: '',
          scheduledStartTime: '',
          scheduledEndTime: '',
          maxParticipants: 30,
          cameraRequired: false,
          microphoneRequired: false,
          recordingEnabled: false
        });
        loadLiveClasses();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create class',
        variant: 'destructive',
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 animate-pulse">Live</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-600">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequirementsBadges = (settings: LiveClass['settings']) => {
    const badges = [];
    if (settings.cameraRequired) {
      badges.push(<Badge key="camera" variant="outline" className="text-xs">Camera Required</Badge>);
    }
    if (settings.microphoneRequired) {
      badges.push(<Badge key="mic" variant="outline" className="text-xs">Mic Required</Badge>);
    }
    if (settings.recordingEnabled) {
      badges.push(<Badge key="recording" variant="outline" className="text-xs">Recorded</Badge>);
    }
    return badges;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
            <p className="text-gray-600 mt-1">
              Join live interactive sessions with expert instructors
            </p>
          </div>
          
          {userType === 'tutor' && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Live Class
            </Button>
          )}
        </div>
      </div>

      {/* Create Class Form */}
      {showCreateForm && userType === 'tutor' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Live Class</CardTitle>
            <CardDescription>
              Schedule a new live interactive session for your students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title</Label>
                <Input
                  id="title"
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter class title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={createFormData.maxParticipants}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  min="1"
                  max="500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={createFormData.scheduledStartTime}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, scheduledStartTime: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={createFormData.scheduledEndTime}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, scheduledEndTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={createFormData.description}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this class will cover..."
              />
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={createFormData.cameraRequired}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, cameraRequired: e.target.checked }))}
                />
                <span className="text-sm">Camera Required</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={createFormData.microphoneRequired}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, microphoneRequired: e.target.checked }))}
                />
                <span className="text-sm">Microphone Required</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={createFormData.recordingEnabled}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, recordingEnabled: e.target.checked }))}
                />
                <span className="text-sm">Enable Recording</span>
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createClass}>Create Class</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : liveClasses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No {activeTab} classes</h3>
                <p className="text-gray-600">
                  {activeTab === 'upcoming' && 'No upcoming live classes scheduled'}
                  {activeTab === 'live' && 'No classes are currently live'}
                  {activeTab === 'completed' && 'No completed classes to show'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((liveClass) => {
                const startTime = formatDateTime(liveClass.scheduledStartTime);
                const endTime = formatDateTime(liveClass.scheduledEndTime);
                
                return (
                  <Card key={liveClass._id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {liveClass.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            by {liveClass.tutor.name}
                          </CardDescription>
                        </div>
                        {getStatusBadge(liveClass.status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {liveClass.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{startTime.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{startTime.time} - {endTime.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>
                            {liveClass.metadata.totalParticipants} / {liveClass.maxParticipants} participants
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {getRequirementsBadges(liveClass.settings)}
                      </div>
                      
                      <div className="pt-2">
                        {liveClass.status === 'live' && (
                          <Button 
                            onClick={() => joinClass(liveClass._id)}
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Join Live Class
                          </Button>
                        )}
                        
                        {liveClass.status === 'scheduled' && (
                          <Button 
                            onClick={() => joinClass(liveClass._id)}
                            variant="outline" 
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Join Class
                          </Button>
                        )}
                        
                        {liveClass.status === 'completed' && (
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View Recording
                            </Button>
                            <div className="text-xs text-gray-600 text-center">
                              <CheckCircle className="h-3 w-3 inline mr-1" />
                              Completed
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveClassesList;
