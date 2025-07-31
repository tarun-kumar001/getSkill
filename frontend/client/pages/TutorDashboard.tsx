import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  BookOpen, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Send,
  FileText,
  BarChart3,
  Target,
  Trophy,
  Brain,
  Code,
  Activity,
  Award,
  CheckCircle,
  Play,
  Upload,
  Zap,
  Github,
  ExternalLink,
  Settings,
  Bell,
  MessageSquare,
  UserCheck,
  Presentation,
  ChevronRight,
  Camera,
  Mic,
  Monitor,
  PieChart,
  LineChart,
  Calendar as Cal,
  ClockIcon,
  VideoIcon,
  PhoneCall,
  Screen,
  MousePointer,
  Headphones,
  Download,
  Share,
  Filter,
  Search,
  MoreHorizontal,
  AlertTriangle,
  CheckSquare,
  XSquare,
  RefreshCw,
  Globe,
  Smartphone,
  Laptop,
  TabletIcon
} from "lucide-react";

export default function TutorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showScheduleClass, setShowScheduleClass] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ 
        name: "Dr. Sarah Chen", 
        email: "sarah.chen@example.com", 
        userType: "tutor",
        profile: {
          bio: "Former Google AI researcher with 10+ years in EdTech",
          university: "Stanford University",
          experience: "10+ years in AI/ML and EdTech"
        }
      });
    }
  }, []);

  // Mock data for tutor dashboard
  const tutorStats = {
    totalStudents: 479,
    totalRevenue: 234500,
    avgRating: 4.8,
    completionRate: 78,
    monthlyGrowth: 15,
    activeStudents: 342,
    totalCourses: 8,
    totalLiveClasses: 156,
    upcomingClasses: 12,
    pendingReviews: 23
  };

  const myCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      students: 234,
      rating: 4.8,
      revenue: 117000,
      status: "Published",
      lastUpdated: "2 days ago",
      nextClass: "Today, 3:00 PM",
      engagement: 85,
      completionRate: 76,
      totalLessons: 42,
      totalHours: 28,
      difficulty: "Intermediate",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Node.js Masterclass",
      students: 156,
      rating: 4.9,
      revenue: 78000,
      status: "Published", 
      lastUpdated: "1 week ago",
      nextClass: "Tomorrow, 10:00 AM",
      engagement: 92,
      completionRate: 84,
      totalLessons: 35,
      totalHours: 24,
      difficulty: "Advanced",
      category: "Backend Development"
    },
    {
      id: 3,
      title: "Full Stack Development Bootcamp",
      students: 89,
      rating: 4.7,
      revenue: 44500,
      status: "Draft",
      lastUpdated: "3 days ago",
      nextClass: "Friday, 2:00 PM",
      engagement: 78,
      completionRate: 0,
      totalLessons: 67,
      totalHours: 45,
      difficulty: "Beginner to Advanced",
      category: "Full Stack"
    }
  ];

  const liveClasses = [
    {
      id: 1,
      title: "Advanced React Hooks Deep Dive",
      course: "Advanced React Development",
      scheduledAt: "Today, 3:00 PM",
      duration: 90,
      enrolledStudents: 45,
      confirmedAttendees: 38,
      status: "upcoming",
      type: "live",
      zoomLink: "https://zoom.us/j/123456789",
      recordingEnabled: true
    },
    {
      id: 2,
      title: "Async Programming Best Practices",
      course: "Node.js Masterclass",
      scheduledAt: "Tomorrow, 10:00 AM",
      duration: 120,
      enrolledStudents: 32,
      confirmedAttendees: 29,
      status: "upcoming",
      type: "workshop",
      zoomLink: "https://zoom.us/j/987654321",
      recordingEnabled: true
    },
    {
      id: 3,
      title: "Database Integration Masterclass",
      course: "Full Stack Development",
      scheduledAt: "Friday, 2:00 PM",
      duration: 90,
      enrolledStudents: 28,
      confirmedAttendees: 0,
      status: "scheduled",
      type: "live",
      recordingEnabled: false
    }
  ];

  const studentAnalytics = [
    {
      id: 1,
      student: "Alex Johnson",
      course: "Advanced React Development",
      progress: 85,
      lastActive: "2 hours ago",
      performance: "Excellent",
      attendanceRate: 94,
      quizAverage: 88,
      assignmentScores: [92, 85, 90, 87],
      interviewScores: [82, 78, 85],
      engagementLevel: "High",
      riskLevel: "Low"
    },
    {
      id: 2,
      student: "Maria Garcia",
      course: "Node.js Masterclass",
      progress: 72,
      lastActive: "1 day ago",
      performance: "Good",
      attendanceRate: 87,
      quizAverage: 76,
      assignmentScores: [78, 82, 74],
      interviewScores: [75, 79],
      engagementLevel: "Medium",
      riskLevel: "Low"
    },
    {
      id: 3,
      student: "David Chen",
      course: "Full Stack Development",
      progress: 45,
      lastActive: "5 days ago",
      performance: "Needs Attention",
      attendanceRate: 65,
      quizAverage: 58,
      assignmentScores: [65, 52, 71],
      interviewScores: [62],
      engagementLevel: "Low",
      riskLevel: "High"
    }
  ];

  const recentActivity = [
    { type: "enrollment", message: "New student enrolled in React course", time: "2 hours ago" },
    { type: "rating", message: "Course rating updated (4.9/5)", time: "1 day ago" },
    { type: "class", message: "Live class completed successfully", time: "2 days ago" },
    { type: "assignment", message: "Assignment submitted by 15 students", time: "3 days ago" },
    { type: "message", message: "New message from Alex Johnson", time: "1 week ago" }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👨‍🏫</h1>
          <p className="text-gray-600 mt-2">Manage your courses, students, and teaching activities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Students</p>
                  <p className="text-3xl font-bold">{tutorStats.totalStudents}</p>
                  <p className="text-blue-100 text-sm">+{tutorStats.monthlyGrowth}% this month</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{(tutorStats.totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-green-100 text-sm">This year</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Average Rating</p>
                  <p className="text-3xl font-bold">{tutorStats.avgRating}</p>
                  <p className="text-yellow-100 text-sm">Across all courses</p>
                </div>
                <Star className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Live Classes</p>
                  <p className="text-3xl font-bold">{tutorStats.upcomingClasses}</p>
                  <p className="text-purple-100 text-sm">Upcoming</p>
                </div>
                <Video className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="classes">Live Classes</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="interviews" className="hidden lg:block">Interviews</TabsTrigger>
            <TabsTrigger value="settings" className="hidden lg:block">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                    onClick={() => setShowScheduleClass(true)}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Schedule Live Class
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowCreateCourse(true)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create New Course
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowNotificationModal(true)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {liveClasses.filter(c => c.scheduledAt.includes('Today')).map((liveClass) => (
                    <div key={liveClass.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900">{liveClass.title}</h4>
                      <p className="text-sm text-purple-600">{liveClass.scheduledAt}</p>
                      <p className="text-xs text-purple-500">{liveClass.confirmedAttendees} students confirmed</p>
                      <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                        <Video className="w-3 h-3 mr-1" />
                        Join Class
                      </Button>
                    </div>
                  ))}
                  {liveClasses.filter(c => c.scheduledAt.includes('Today')).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No classes scheduled for today</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'enrollment' ? 'bg-green-500' :
                          activity.type === 'rating' ? 'bg-yellow-500' :
                          activity.type === 'class' ? 'bg-blue-500' :
                          activity.type === 'assignment' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Performance Overview */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-600">{course.students} students • {course.rating}⭐</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{(course.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-500">{course.engagement}% engagement</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Students Needing Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentAnalytics.filter(s => s.riskLevel === 'High' || s.engagementLevel === 'Low').map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{student.student}</h4>
                          <p className="text-sm text-gray-600">{student.course}</p>
                          <p className="text-xs text-red-600">Last active: {student.lastActive}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Course Management */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <div className="flex gap-2">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowCreateCourse(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Content
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6">
              {myCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{course.title}</h3>
                          <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Students</p>
                            <p className="font-bold text-blue-600">{course.students}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Rating</p>
                            <p className="font-bold text-yellow-600 flex items-center gap-1">
                              <Star className="w-4 h-4 fill-current" />
                              {course.rating}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-bold text-green-600">₹{(course.revenue / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Engagement</p>
                            <p className="font-bold text-purple-600">{course.engagement}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Completion</p>
                            <p className="font-bold text-indigo-600">{course.completionRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Lessons</p>
                            <p className="font-bold text-gray-800">{course.totalLessons}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Course Progress</span>
                            <span className="text-sm font-medium">{course.completionRate}%</span>
                          </div>
                          <Progress value={course.completionRate} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {course.nextClass && (
                      <Alert className="border-purple-200 bg-purple-50">
                        <Video className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-800">
                          Next live class: <strong>{course.nextClass}</strong>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Classes Management */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Live Class Management</h2>
              <div className="flex gap-2">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowScheduleClass(true)}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Schedule Class
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {liveClasses.map((liveClass) => (
                <Card key={liveClass.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{liveClass.title}</h3>
                          <Badge variant="outline" className={
                            liveClass.status === 'upcoming' ? 'border-green-500 text-green-700' :
                            liveClass.status === 'live' ? 'border-red-500 text-red-700' :
                            'border-gray-500 text-gray-700'
                          }>
                            {liveClass.status.charAt(0).toUpperCase() + liveClass.status.slice(1)}
                          </Badge>
                          <Badge variant="secondary">{liveClass.type}</Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{liveClass.course}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <span>{liveClass.scheduledAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{liveClass.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>{liveClass.enrolledStudents} enrolled</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserCheck className="w-4 h-4 text-gray-500" />
                            <span>{liveClass.confirmedAttendees} confirmed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {liveClass.recordingEnabled ? (
                              <Video className="w-4 h-4 text-green-500" />
                            ) : (
                              <VideoIcon className="w-4 h-4 text-gray-400" />
                            )}
                            <span>{liveClass.recordingEnabled ? 'Recording' : 'No Recording'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {liveClass.status === 'upcoming' && (
                          <Link to={`/live-class/${liveClass.id}`}>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                              <Video className="w-4 h-4 mr-2" />
                              Start Class
                            </Button>
                          </Link>
                        )}
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bell className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Student Analytics */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Student Management & Analytics</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {studentAnalytics.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">{student.student}</h3>
                          <Badge variant={
                            student.performance === 'Excellent' ? 'default' :
                            student.performance === 'Good' ? 'secondary' :
                            'destructive'
                          }>
                            {student.performance}
                          </Badge>
                          <Badge variant="outline" className={
                            student.riskLevel === 'Low' ? 'border-green-500 text-green-700' :
                            student.riskLevel === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                            'border-red-500 text-red-700'
                          }>
                            {student.riskLevel} Risk
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{student.course}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Progress</p>
                            <div className="flex items-center gap-2">
                              <Progress value={student.progress} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{student.progress}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Attendance</p>
                            <p className="font-bold text-blue-600">{student.attendanceRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Quiz Average</p>
                            <p className="font-bold text-green-600">{student.quizAverage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Engagement</p>
                            <p className={`font-bold ${
                              student.engagementLevel === 'High' ? 'text-green-600' :
                              student.engagementLevel === 'Medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {student.engagementLevel}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Last Active: {student.lastActive}</span>
                          <span>Interview Scores: {student.interviewScores.join(', ')}</span>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Progress Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">₹{(tutorStats.totalRevenue / 1000).toFixed(0)}K</div>
                  <p className="text-sm text-gray-600 mb-4">Total earnings this year</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This month</span>
                      <span className="font-medium">₹{(tutorStats.totalRevenue * 0.15 / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last month</span>
                      <span className="font-medium">₹{(tutorStats.totalRevenue * 0.12 / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Student Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{tutorStats.activeStudents}</div>
                  <p className="text-sm text-gray-600 mb-4">Active students</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>New this month</span>
                      <span className="font-medium text-green-600">+{Math.floor(tutorStats.activeStudents * 0.15)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completion rate</span>
                      <span className="font-medium">{tutorStats.completionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Course Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{tutorStats.avgRating}</div>
                  <p className="text-sm text-gray-600 mb-4">Average rating</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total reviews</span>
                      <span className="font-medium">{tutorStats.pendingReviews * 20}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending reviews</span>
                      <span className="font-medium">{tutorStats.pendingReviews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myCourses.map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{course.title}</span>
                          <span className="text-sm text-gray-600">{course.engagement}%</span>
                        </div>
                        <Progress value={course.engagement} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{course.students} students</span>
                          <span>₹{(course.revenue / 1000).toFixed(0)}K revenue</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">78%</div>
                        <div className="text-sm text-green-700">High Engagement</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">18%</div>
                        <div className="text-sm text-yellow-700">Medium Engagement</div>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">4%</div>
                      <div className="text-sm text-red-700">Low Engagement (Need Attention)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Content Management</h2>
              <div className="flex gap-2">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Video className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Video Lectures</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload and manage video content</p>
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Assignments</h3>
                  <p className="text-sm text-gray-600 mb-4">Create and manage assignments</p>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    New Assignment
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Quizzes</h3>
                  <p className="text-sm text-gray-600 mb-4">Design interactive quizzes</p>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Presentation className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold mb-2">Presentations</h3>
                  <p className="text-sm text-gray-600 mb-4">Slide decks and presentations</p>
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Slides
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Code Examples</h3>
                  <p className="text-sm text-gray-600 mb-4">Share code snippets and examples</p>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Download className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="font-semibold mb-2">Resources</h3>
                  <p className="text-sm text-gray-600 mb-4">PDFs, documents, and resources</p>
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interview Monitoring */}
          <TabsContent value="interviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">AI Interview Monitoring</h2>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Interviews</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Score</span>
                      <span className="font-bold text-green-600">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass Rate</span>
                      <span className="font-bold text-blue-600">84%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Improvement Rate</span>
                      <span className="font-bold text-purple-600">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentAnalytics.slice(0, 3).map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{student.student}</p>
                          <p className="text-sm text-gray-600">Technical Interview</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{student.interviewScores[0] || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Strong in problem-solving</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Need improvement in communication</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Good technical knowledge</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Individual Student Interview Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentAnalytics.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{student.student}</h4>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Interview Scores</p>
                          <p className="font-medium">{student.interviewScores.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Average Score</p>
                          <p className="font-medium">{Math.round(student.interviewScores.reduce((a, b) => a + b, 0) / student.interviewScores.length)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Improvement</p>
                          <p className="font-medium text-green-600">+{Math.abs(student.interviewScores[student.interviewScores.length - 1] - student.interviewScores[0])}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Tutor Settings</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Student Enrollments</h4>
                      <p className="text-sm text-gray-600">Get notified when students enroll in your courses</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Class Reminders</h4>
                      <p className="text-sm text-gray-600">Receive reminders before live classes</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Student Messages</h4>
                      <p className="text-sm text-gray-600">Notifications for student messages</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teaching Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Class Duration</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                        <SelectItem value="pst">PST (UTC-8)</SelectItem>
                        <SelectItem value="est">EST (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <Dialog open={showScheduleClass} onOpenChange={setShowScheduleClass}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Live Class</DialogTitle>
              <DialogDescription>
                Create a new live class session for your students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Class Title</Label>
                <Input placeholder="Enter class title" />
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Class description..." />
              </div>
              <Button 
                onClick={() => setShowScheduleClass(false)} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Schedule Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>
                Send a notification to your students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Notification Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="reminder">Class Reminder</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="course">Specific Course</SelectItem>
                    <SelectItem value="individual">Individual Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Notification title" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Your message..." rows={4} />
              </div>
              <Button 
                onClick={() => setShowNotificationModal(false)} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
