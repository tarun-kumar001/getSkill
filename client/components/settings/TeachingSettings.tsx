import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Users, 
  Video, 
  Mic, 
  Camera,
  Volume2,
  Monitor,
  Settings
} from 'lucide-react';
import { api } from '@/services/api';

interface UserData {
  tutorSettings?: {
    classPreferences: {
      autoRecord: boolean;
      maxStudents: number;
    };
  };
}

interface TeachingSettingsProps {
  userData: UserData;
  onUpdate: () => void;
}

const TeachingSettings: React.FC<TeachingSettingsProps> = ({ userData, onUpdate }) => {
  const [settings, setSettings] = useState({
    classPreferences: {
      autoRecord: userData.tutorSettings?.classPreferences?.autoRecord || false,
      maxStudents: userData.tutorSettings?.classPreferences?.maxStudents || 30,
      enableChat: true,
      allowScreenShare: true,
      enableWhiteboard: true,
      recordingQuality: 'HD',
      autoMute: false,
      allowStudentMic: true,
      allowStudentCamera: false,
      sessionTimeout: 120
    },
    teachingPreferences: {
      interactionStyle: 'interactive',
      difficulty: 'intermediate',
      pace: 'moderate',
      feedbackFrequency: 'regular'
    },
    contentSettings: {
      allowDownloads: true,
      shareResources: true,
      enableQuizzes: true,
      trackProgress: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClassPreferenceChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      classPreferences: {
        ...prev.classPreferences,
        [field]: value
      }
    }));
  };

  const handleTeachingPreferenceChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      teachingPreferences: {
        ...prev.teachingPreferences,
        [field]: value
      }
    }));
  };

  const handleContentSettingChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      contentSettings: {
        ...prev.contentSettings,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put('/settings/tutor', {
        classPreferences: settings.classPreferences
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Teaching settings updated successfully',
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update teaching settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Class Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Class Management
            </CardTitle>
            <CardDescription>
              Configure your live class settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Maximum Students per Class</Label>
                <Select
                  value={settings.classPreferences.maxStudents.toString()}
                  onValueChange={(value) => 
                    handleClassPreferenceChange('maxStudents', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 students</SelectItem>
                    <SelectItem value="15">15 students</SelectItem>
                    <SelectItem value="20">20 students</SelectItem>
                    <SelectItem value="25">25 students</SelectItem>
                    <SelectItem value="30">30 students</SelectItem>
                    <SelectItem value="50">50 students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select
                  value={settings.classPreferences.sessionTimeout.toString()}
                  onValueChange={(value) => 
                    handleClassPreferenceChange('sessionTimeout', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                    <SelectItem value="180">180 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Recording Settings</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <Label>Auto-record Sessions</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Automatically record all live classes
                  </p>
                </div>
                <Switch
                  checked={settings.classPreferences.autoRecord}
                  onCheckedChange={(checked) => 
                    handleClassPreferenceChange('autoRecord', checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Recording Quality</Label>
                <Select
                  value={settings.classPreferences.recordingQuality}
                  onValueChange={(value) => 
                    handleClassPreferenceChange('recordingQuality', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SD">Standard Definition (480p)</SelectItem>
                    <SelectItem value="HD">High Definition (720p)</SelectItem>
                    <SelectItem value="FHD">Full HD (1080p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Interaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Interaction
            </CardTitle>
            <CardDescription>
              Control how students can interact during your classes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <Label>Allow Student Microphones</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Students can unmute themselves during class
                </p>
              </div>
              <Switch
                checked={settings.classPreferences.allowStudentMic}
                onCheckedChange={(checked) => 
                  handleClassPreferenceChange('allowStudentMic', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <Label>Allow Student Cameras</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Students can turn on their cameras
                </p>
              </div>
              <Switch
                checked={settings.classPreferences.allowStudentCamera}
                onCheckedChange={(checked) => 
                  handleClassPreferenceChange('allowStudentCamera', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <Label>Allow Screen Sharing</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Students can share their screens
                </p>
              </div>
              <Switch
                checked={settings.classPreferences.allowScreenShare}
                onCheckedChange={(checked) => 
                  handleClassPreferenceChange('allowScreenShare', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-mute on Join</Label>
                <p className="text-sm text-gray-600">
                  Automatically mute students when they join
                </p>
              </div>
              <Switch
                checked={settings.classPreferences.autoMute}
                onCheckedChange={(checked) => 
                  handleClassPreferenceChange('autoMute', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Teaching Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Teaching Preferences
            </CardTitle>
            <CardDescription>
              Set your preferred teaching style and approach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Interaction Style</Label>
                <Select
                  value={settings.teachingPreferences.interactionStyle}
                  onValueChange={(value) => 
                    handleTeachingPreferenceChange('interactionStyle', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture Style</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                    <SelectItem value="discussion">Discussion Based</SelectItem>
                    <SelectItem value="workshop">Workshop Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Teaching Pace</Label>
                <Select
                  value={settings.teachingPreferences.pace}
                  onValueChange={(value) => 
                    handleTeachingPreferenceChange('pace', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow & Detailed</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="fast">Fast Paced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Difficulty Level</Label>
                <Select
                  value={settings.teachingPreferences.difficulty}
                  onValueChange={(value) => 
                    handleTeachingPreferenceChange('difficulty', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="mixed">Mixed Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Feedback Frequency</Label>
                <Select
                  value={settings.teachingPreferences.feedbackFrequency}
                  onValueChange={(value) => 
                    handleTeachingPreferenceChange('feedbackFrequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="frequent">Frequent</SelectItem>
                    <SelectItem value="constant">Constant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle>Content & Resources</CardTitle>
            <CardDescription>
              Manage how students access your course materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Allow Resource Downloads</Label>
                <p className="text-sm text-gray-600">
                  Students can download course materials
                </p>
              </div>
              <Switch
                checked={settings.contentSettings.allowDownloads}
                onCheckedChange={(checked) => 
                  handleContentSettingChange('allowDownloads', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Share Additional Resources</Label>
                <p className="text-sm text-gray-600">
                  Provide extra learning materials to students
                </p>
              </div>
              <Switch
                checked={settings.contentSettings.shareResources}
                onCheckedChange={(checked) => 
                  handleContentSettingChange('shareResources', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Quiz Integration</Label>
                <p className="text-sm text-gray-600">
                  Include quizzes and assessments in classes
                </p>
              </div>
              <Switch
                checked={settings.contentSettings.enableQuizzes}
                onCheckedChange={(checked) => 
                  handleContentSettingChange('enableQuizzes', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Track Student Progress</Label>
                <p className="text-sm text-gray-600">
                  Monitor individual student learning progress
                </p>
              </div>
              <Switch
                checked={settings.contentSettings.trackProgress}
                onCheckedChange={(checked) => 
                  handleContentSettingChange('trackProgress', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Teaching Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeachingSettings;
