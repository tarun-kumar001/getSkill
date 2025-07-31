import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle,
  Download,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Database,
  FileDown
} from 'lucide-react';
import { api } from '@/services/api';

interface AccountSettingsProps {
  userData: any;
  onUpdate: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ userData, onUpdate }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      const response = await api.get('/settings/export-data');

      if (response.data.success) {
        // Create and download the file
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `getskill_data_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);

        toast({
          title: 'Success',
          description: 'Your data has been exported successfully',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to export data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeactivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: 'Password Required',
        description: 'Please enter your password to deactivate your account',
        variant: 'destructive',
      });
      return;
    }

    setIsDeactivating(true);

    try {
      const response = await api.put('/settings/deactivate', { password });

      if (response.data.success) {
        toast({
          title: 'Account Deactivated',
          description: 'Your account has been deactivated successfully',
        });
        
        // Clear local storage and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to deactivate account',
        variant: 'destructive',
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: 'Password Required',
        description: 'Please enter your password to delete your account',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await api.delete('/auth/account', {
        data: { password }
      });

      if (response.data.success) {
        toast({
          title: 'Account Deleted',
          description: 'Your account has been permanently deleted',
        });
        
        // Clear local storage and redirect to home
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Personal Data
          </CardTitle>
          <CardDescription>
            Download a copy of all your personal data (GDPR compliant)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              This will create a downloadable file containing all your personal information, 
              including profile data, course history, and preferences.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Your export will include:</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Personal information (name, email, etc.)</li>
              <li>• Profile data and preferences</li>
              <li>• Course enrollment history</li>
              <li>• Learning statistics and progress</li>
              <li>• Social links and professional profiles</li>
              {userData.personalInfo?.userType === 'tutor' && (
                <li>• Teaching settings and availability</li>
              )}
            </ul>
          </div>

          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full"
          >
            <FileDown className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting Data...' : 'Export My Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Account Deactivation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Deactivate Account
          </CardTitle>
          <CardDescription>
            Temporarily disable your account (can be reactivated)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Deactivating your account will temporarily disable access. You can reactivate 
              it later by contacting support. Your data will be preserved.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleDeactivateAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deactivate-password">
                Enter your password to confirm deactivation
              </Label>
              <div className="relative">
                <Input
                  id="deactivate-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit"
              variant="outline"
              disabled={isDeactivating}
              className="w-full"
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Account Permanently
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action cannot be undone. All your data, 
              including courses, progress, and personal information will be permanently deleted.
            </AlertDescription>
          </Alert>

          {!showDeleteConfirm ? (
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full"
            >
              I want to delete my account
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Are you absolutely sure? This will permanently delete your account and 
                  cannot be recovered. All your learning progress will be lost.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-password" className="text-red-600">
                    Enter your password to confirm permanent deletion
                  </Label>
                  <div className="relative">
                    <Input
                      id="delete-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-red-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Permanently
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Get assistance with your account or platform issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            If you're having issues with your account or have questions about the platform, 
            please contact our support team before deleting your account.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
            <Button variant="outline" size="sm">
              Help Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
