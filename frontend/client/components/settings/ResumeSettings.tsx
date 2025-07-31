import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye,
  AlertTriangle,
  CheckCircle,
  File,
  Calendar
} from 'lucide-react';
import { api } from '@/services/api';

interface UserData {
  profile: {
    resume?: {
      fileName: string;
      fileUrl: string;
      uploadedAt: string;
    };
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      leetcode?: string;
      codeforces?: string;
    };
  };
}

interface ResumeSettingsProps {
  userData: UserData;
  onUpdate: () => void;
}

const ResumeSettings: React.FC<ResumeSettingsProps> = ({ userData, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [socialLinks, setSocialLinks] = useState(userData.profile.socialLinks || {});
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentResume = userData.profile.resume;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF or Word document',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload a file smaller than 2MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // In a real implementation, you would upload to a cloud storage service
      // For now, we'll simulate the upload with a mock URL
      const formData = new FormData();
      formData.append('resume', file);

      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFileUrl = `https://mock-storage.com/resumes/${Date.now()}-${file.name}`;
      
      const response = await api.post('/settings/resume', {
        fileName: file.name,
        fileUrl: mockFileUrl
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Resume uploaded successfully',
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'Failed to upload resume',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteResume = async () => {
    if (!currentResume) return;

    setDeleting(true);

    try {
      const response = await api.delete('/settings/resume');

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Resume deleted successfully',
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete resume',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSocialLinksUpdate = async () => {
    setIsUpdating(true);

    try {
      const response = await api.put('/settings/profile', {
        socialLinks
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Social links updated successfully',
        });
        onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update social links',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <File className="h-4 w-4 text-red-500" />;
    }
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Resume Upload/Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Management
          </CardTitle>
          <CardDescription>
            Upload and manage your resume for job applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentResume ? (
            // Current Resume Display
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(currentResume.fileName)}
                  <div>
                    <p className="font-medium">{currentResume.fileName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>Uploaded on {formatDate(currentResume.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(currentResume.fileUrl, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = currentResume.fileUrl;
                    link.download = currentResume.fileName;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Replace
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteResume}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ) : (
            // Upload Interface
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No resume uploaded. Upload your resume to improve your job application profile.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your resume or click to browse
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  PDF or Word documents only. Max size: 2MB
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Professional Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Professional Profiles
          </CardTitle>
          <CardDescription>
            Link your professional and coding profiles for better visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                value={socialLinks.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile</Label>
              <Input
                id="github"
                value={socialLinks.github || ''}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leetcode">LeetCode Profile</Label>
              <Input
                id="leetcode"
                value={socialLinks.leetcode || ''}
                onChange={(e) => handleSocialLinkChange('leetcode', e.target.value)}
                placeholder="https://leetcode.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeforces">Codeforces Profile</Label>
              <Input
                id="codeforces"
                value={socialLinks.codeforces || ''}
                onChange={(e) => handleSocialLinkChange('codeforces', e.target.value)}
                placeholder="https://codeforces.com/profile/username"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSocialLinksUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Profiles'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resume Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Tips</CardTitle>
          <CardDescription>
            Best practices for an effective resume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Keep your resume to 1-2 pages maximum</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Use a clean, professional format with consistent styling</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Include relevant technical skills and projects</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Quantify your achievements with specific metrics</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Tailor your resume for each job application</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeSettings;
