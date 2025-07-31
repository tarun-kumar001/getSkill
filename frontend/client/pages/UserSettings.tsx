import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Shield, 
  Settings, 
  Briefcase, 
  GraduationCap,
  Clock,
  DollarSign,
  BarChart3,
  FileText,
  Globe,
  Bell,
  Palette,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { api } from '@/services/api';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import PreferencesSettings from '@/components/settings/PreferencesSettings';
import AcademicSettings from '@/components/settings/AcademicSettings';
import ResumeSettings from '@/components/settings/ResumeSettings';
import TeachingSettings from '@/components/settings/TeachingSettings';
import AvailabilitySettings from '@/components/settings/AvailabilitySettings';
import AccountSettings from '@/components/settings/AccountSettings';

interface UserData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    avatar?: string;
  };
  profile: {
    bio?: string;
    university?: string;
    experience?: string;
    skills: string[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      leetcode?: string;
      codeforces?: string;
    };
    resume?: {
      fileName: string;
      fileUrl: string;
      uploadedAt: string;
    };
    careerGoals?: string;
  };
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
  security: {
    twoFactorEnabled: boolean;
    loginHistory: Array<{
      ip: string;
      device: string;
      location?: string;
      timestamp: string;
    }>;
  };
  tutorSettings?: {
    availability: {
      days: string[];
      timeSlots: Array<{
        start: string;
        end: string;
      }>;
    };
    classPreferences: {
      autoRecord: boolean;
      maxStudents: number;
    };
    payoutInfo?: {
      method: string;
      details: any;
    };
  };
}

const UserSettings: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<'student' | 'tutor'>('student');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  useEffect(() => {
    loadUserSettings();
    loadUserType();
  }, []);

  const loadUserSettings = async () => {
    try {
      const response = await api.get('/settings');
      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserType = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUserType(response.data.data.userType);
      }
    } catch (error) {
      console.error('Failed to load user type:', error);
    }
  };

  const getTabConfig = () => {
    const commonTabs = [
      { value: 'profile', label: 'Profile', icon: User },
      { value: 'security', label: 'Security', icon: Shield },
      { value: 'preferences', label: 'Preferences', icon: Settings },
    ];

    const studentTabs = [
      { value: 'academic', label: 'Academic', icon: GraduationCap },
      { value: 'resume', label: 'Resume', icon: FileText },
    ];

    const tutorTabs = [
      { value: 'teaching', label: 'Teaching', icon: Briefcase },
      { value: 'availability', label: 'Availability', icon: Clock },
      { value: 'revenue', label: 'Revenue', icon: DollarSign },
      { value: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return [
      ...commonTabs,
      ...(userType === 'student' ? studentTabs : tutorTabs),
      { value: 'account', label: 'Account', icon: AlertTriangle },
    ];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load user settings. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const tabs = getTabConfig();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {userType === 'student' ? 'Student Account' : 'Tutor Account'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="flex items-center gap-2 text-sm"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings userData={userData} onUpdate={loadUserSettings} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings userData={userData} onUpdate={loadUserSettings} />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesSettings userData={userData} onUpdate={loadUserSettings} />
        </TabsContent>

        {userType === 'student' && (
          <>
            <TabsContent value="academic" className="space-y-6">
              <AcademicSettings userData={userData} onUpdate={loadUserSettings} />
            </TabsContent>

            <TabsContent value="resume" className="space-y-6">
              <ResumeSettings userData={userData} onUpdate={loadUserSettings} />
            </TabsContent>
          </>
        )}

        {userType === 'tutor' && (
          <>
            <TabsContent value="teaching" className="space-y-6">
              <TeachingSettings userData={userData} onUpdate={loadUserSettings} />
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <AvailabilitySettings userData={userData} onUpdate={loadUserSettings} />
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <RevenueSettings userData={userData} onUpdate={loadUserSettings} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsSettings userData={userData} onUpdate={loadUserSettings} />
            </TabsContent>
          </>
        )}

        <TabsContent value="account" className="space-y-6">
          <AccountSettings userData={userData} onUpdate={loadUserSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Placeholder components for each settings section





// Placeholder components for revenue and analytics (to be implemented later)
const RevenueSettings: React.FC<{ userData: UserData; onUpdate: () => void }> = ({ userData, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Revenue & Payouts
      </CardTitle>
      <CardDescription>
        Manage your earnings and payout preferences
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>Revenue settings component will be implemented here</p>
    </CardContent>
  </Card>
);

const AnalyticsSettings: React.FC<{ userData: UserData; onUpdate: () => void }> = ({ userData, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Analytics Preferences
      </CardTitle>
      <CardDescription>
        Configure your analytics dashboard and reporting
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>Analytics settings component will be implemented here</p>
    </CardContent>
  </Card>
);

export default UserSettings;
