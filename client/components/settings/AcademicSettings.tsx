import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Plus, 
  X, 
  Calendar,
  Target,
  BookOpen,
  Award
} from 'lucide-react';
import { api } from '@/services/api';

interface UserData {
  profile: {
    university?: string;
    careerGoals?: string;
    skills: string[];
  };
  preferences: {
    interviewSettings?: {
      language: string;
      domain: string[];
    };
  };
}

interface AcademicSettingsProps {
  userData: UserData;
  onUpdate: () => void;
}

const AcademicSettings: React.FC<AcademicSettingsProps> = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    university: userData.profile.university || '',
    careerGoals: userData.profile.careerGoals || '',
    skills: userData.profile.skills || [],
    interviewSettings: userData.preferences.interviewSettings || {
      language: 'JavaScript',
      domain: ['DSA']
    },
    calendarSync: false,
    studyReminders: true,
    progressTracking: true
  });

  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const programmingLanguages = [
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'TypeScript',
    'Swift',
    'Kotlin'
  ];

  const interviewDomains = [
    'DSA',
    'System Design',
    'Frontend',
    'Backend',
    'Database',
    'ML'
  ];

  const skillSuggestions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'MongoDB',
    'Machine Learning', 'Data Structures', 'Algorithms', 'System Design',
    'Git', 'Docker', 'AWS', 'REST APIs', 'GraphQL', 'TypeScript'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (skill?: string) => {
    const skillToAdd = skill || newSkill.trim();
    if (skillToAdd && !formData.skills.includes(skillToAdd)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillToAdd]
      }));
      if (!skill) setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleInterviewDomainToggle = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      interviewSettings: {
        ...prev.interviewSettings,
        domain: prev.interviewSettings.domain.includes(domain)
          ? prev.interviewSettings.domain.filter(d => d !== domain)
          : [...prev.interviewSettings.domain, domain]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update profile information
      const profileResponse = await api.put('/settings/profile', {
        university: formData.university,
        careerGoals: formData.careerGoals,
        skills: formData.skills
      });

      // Update interview preferences
      const preferencesResponse = await api.put('/settings/preferences', {
        interviewSettings: formData.interviewSettings
      });

      if (profileResponse.data.success && preferencesResponse.data.success) {
        toast({
          title: 'Success',
          description: 'Academic settings updated successfully',
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update academic settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
            <CardDescription>
              Update your educational background and academic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="university">University/Institution</Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                placeholder="Enter your university or institution"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="careerGoals">Career Goals</Label>
              <Textarea
                id="careerGoals"
                value={formData.careerGoals}
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                placeholder="Describe your career aspirations and goals..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-600">
                {formData.careerGoals.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skills Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Skills & Technologies
            </CardTitle>
            <CardDescription>
              Manage your technical skills and competencies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={() => addSkill()} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Add (Popular Skills)</Label>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions
                  .filter(skill => !formData.skills.includes(skill))
                  .slice(0, 8)
                  .map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Skills</Label>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
                {formData.skills.length === 0 && (
                  <p className="text-gray-600 text-sm">No skills added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Interview Preferences
            </CardTitle>
            <CardDescription>
              Configure your AI interview settings and focus areas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Programming Language</Label>
              <Select
                value={formData.interviewSettings.language}
                onValueChange={(value) => 
                  setFormData(prev => ({
                    ...prev,
                    interviewSettings: {
                      ...prev.interviewSettings,
                      language: value
                    }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programmingLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interview Focus Areas</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select the domains you want to focus on during AI interviews
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interviewDomains.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Switch
                      checked={formData.interviewSettings.domain.includes(domain)}
                      onCheckedChange={() => handleInterviewDomainToggle(domain)}
                    />
                    <Label className="text-sm">{domain}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Preferences
            </CardTitle>
            <CardDescription>
              Customize your learning experience and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Label>Calendar Sync</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Sync learning schedule with your calendar
                </p>
              </div>
              <Switch
                checked={formData.calendarSync}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, calendarSync: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Study Reminders</Label>
                <p className="text-sm text-gray-600">
                  Get reminders for study sessions and courses
                </p>
              </div>
              <Switch
                checked={formData.studyReminders}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, studyReminders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Progress Tracking</Label>
                <p className="text-sm text-gray-600">
                  Track your learning progress and milestones
                </p>
              </div>
              <Switch
                checked={formData.progressTracking}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, progressTracking: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Academic Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AcademicSettings;
