import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Globe, 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Moon,
  Sun,
  Code,
  Brain
} from 'lucide-react';
import { api } from '@/services/api';

interface UserData {
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    theme: 'light' | 'dark';
    language: string;
    interviewSettings?: {
      language: string;
      domain: string[];
    };
  };
}

interface PreferencesSettingsProps {
  userData: UserData;
  onUpdate: () => void;
}

const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({ userData, onUpdate }) => {
  const [preferences, setPreferences] = useState({
    theme: userData.preferences.theme,
    language: userData.preferences.language,
    notifications: userData.preferences.notifications,
    interviewSettings: userData.preferences.interviewSettings || {
      language: 'JavaScript',
      domain: ['DSA']
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ];

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

  const handleNotificationChange = (type: keyof typeof preferences.notifications, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handleInterviewDomainToggle = (domain: string) => {
    setPreferences(prev => ({
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
      const response = await api.put('/settings/preferences', preferences);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Preferences updated successfully',
        });
        onUpdate();
        
        // Apply theme change immediately
        if (preferences.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update preferences',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme & Appearance
            </CardTitle>
            <CardDescription>
              Customize your visual experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value: 'light' | 'dark') => 
                  setPreferences(prev => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your preferred language for the interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language">Interface Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Control how you receive updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label>Email Notifications</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <Label>Push Notifications</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label>SMS Notifications</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Receive important updates via SMS
                </p>
              </div>
              <Switch
                checked={preferences.notifications.sms}
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Interview Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Interview Preferences
            </CardTitle>
            <CardDescription>
              Configure your AI interview settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Preferred Programming Language
              </Label>
              <Select
                value={preferences.interviewSettings.language}
                onValueChange={(value) => 
                  setPreferences(prev => ({
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
                Select the domains you want to focus on during interviews
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interviewDomains.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Switch
                      checked={preferences.interviewSettings.domain.includes(domain)}
                      onCheckedChange={() => handleInterviewDomainToggle(domain)}
                    />
                    <Label className="text-sm">{domain}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesSettings;
