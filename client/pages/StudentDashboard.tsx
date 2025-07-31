import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Code,
  Play,
  Target,
  Upload,
  Brain,
  Calendar as CalendarIcon,
  Activity,
  Award,
  CheckCircle,
  Users,
  Video,
  FileText,
  Zap,
  TrendingUp,
  Github,
  ExternalLink,
  BarChart3,
  Star
} from "lucide-react";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [cvText, setCvText] = useState("");
  const [atsScore, setAtsScore] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    // Get user data from localStorage or set default
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Set default user for demo
      setUser({ name: "Alex Johnson", email: "alex@example.com" });
    }
  }, []);

  const enrolledCourses = [
    {
      id: 1,
      title: "Complete Data Structures & Algorithms",
      instructor: "Dr. Sarah Chen",
      progress: 65,
      totalLessons: 40,
      completedLessons: 26,
      nextLesson: "Binary Search Trees",
      nextClass: "Today, 3:00 PM"
    },
    {
      id: 2,
      title: "System Design Masterclass", 
      instructor: "Alex Rodriguez",
      progress: 30,
      totalLessons: 25,
      completedLessons: 8,
      nextLesson: "Load Balancing Strategies",
      nextClass: "Tomorrow, 10:00 AM"
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Michael Park",
      progress: 45,
      totalLessons: 35,
      completedLessons: 16,
      nextLesson: "Neural Networks Intro",
      nextClass: "Friday, 2:00 PM"
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: "Advanced Tree Algorithms",
      instructor: "Dr. Sarah Chen",
      time: "Today, 3:00 PM",
      duration: "90 mins",
      subject: "DSA"
    },
    {
      id: 2,
      title: "System Architecture Patterns",
      instructor: "Alex Rodriguez", 
      time: "Tomorrow, 10:00 AM",
      duration: "120 mins",
      subject: "System Design"
    },
    {
      id: 3,
      title: "Neural Network Implementation",
      instructor: "Dr. Michael Park",
      time: "Friday, 2:00 PM",
      duration: "90 mins",
      subject: "ML"
    }
  ];

  // Mock activity data for calendar
  const activityData = {
    "2024-01-15": { active: true, hours: 3.5, activities: ["Completed DSA lesson", "Practice problems"] },
    "2024-01-16": { active: true, hours: 2.0, activities: ["Live class attended", "Mock interview"] },
    "2024-01-17": { active: false, hours: 0, activities: [] },
    "2024-01-18": { active: true, hours: 4.0, activities: ["System design study", "LeetCode practice"] },
    "2024-01-19": { active: true, hours: 1.5, activities: ["Course review"] },
    "2024-01-20": { active: false, hours: 0, activities: [] },
    "2024-01-21": { active: true, hours: 5.0, activities: ["Project work", "Live class", "Interview prep"] }
  };

  const connectLeetCode = async () => {
    if (!leetcodeUsername) return;
    
    // Simulate API call to fetch LeetCode stats
    setTimeout(() => {
      setLeetcodeStats({
        username: leetcodeUsername,
        totalSolved: 450,
        easy: 180,
        medium: 220,
        hard: 50,
        ranking: 145000,
        acceptanceRate: 65.2,
        streak: 15,
        badges: ["Monthly Badge March 2024", "Problem Solver", "Contest Participant"],
        contestRating: 1654,
        recentActivity: [
          { problem: "Binary Tree Inorder Traversal", difficulty: "Easy", solved: true, date: "2024-01-21" },
          { problem: "Validate Binary Search Tree", difficulty: "Medium", solved: true, date: "2024-01-20" },
          { problem: "Serialize and Deserialize Binary Tree", difficulty: "Hard", solved: false, date: "2024-01-19" }
        ]
      });
    }, 1000);
  };

  const analyzeCV = async () => {
    if (!cvText.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate ATS analysis
    setTimeout(() => {
      setAtsScore({
        overallScore: 78,
        breakdown: {
          keywords: { score: 75, feedback: "Good use of technical keywords, but missing some industry-specific terms" },
          formatting: { score: 85, feedback: "Well-structured and readable format" },
          experience: { score: 70, feedback: "Relevant experience shown, could elaborate more on achievements" },
          skills: { score: 80, feedback: "Strong technical skills section" }
        },
        recommendations: [
          "Add more quantified achievements (e.g., 'Improved performance by 30%')",
          "Include keywords: 'Agile', 'DevOps', 'Cloud Computing'",
          "Add a brief summary section at the top",
          "Include more specific project details"
        ],
        suggestedCourses: [
          { title: "Advanced React Development", match: 85, reason: "Matches your frontend skills" },
          { title: "Cloud Computing with AWS", match: 70, reason: "High-demand skill in your field" },
          { title: "DevOps Fundamentals", match: 75, reason: "Complements your development background" }
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey and track your progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">24h</p>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-gray-600">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-gray-600">Avg. Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="ats-checker">ATS Checker</TabsTrigger>
            <TabsTrigger value="interview">AI Interview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
            <TabsTrigger value="classes">Live Classes</TabsTrigger>
          </TabsList>

          {/* Enrolled Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Enrolled Courses</h2>
              <Link to="/courses">
                <Button variant="outline">Browse More Courses</Button>
              </Link>
            </div>
            
            <div className="grid gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-4">by {course.instructor}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} />
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                            <Badge variant="secondary">Next: {course.nextLesson}</Badge>
                            <Badge variant="outline" className="text-green-600">
                              <Video className="w-3 h-3 mr-1" />
                              {course.nextClass}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col gap-2">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                        <Button variant="outline" size="sm">View Course</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ATS Score Checker Tab */}
          <TabsContent value="ats-checker" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  AI-Based ATS Score Checker
                </CardTitle>
                <CardDescription>
                  Upload your CV and get an instant ATS compatibility score with personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="cv-text">Paste your CV content or upload a file:</Label>
                  <Textarea
                    id="cv-text"
                    placeholder="Paste your CV content here..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={8}
                  />
                  <div className="flex gap-4">
                    <Button onClick={analyzeCV} disabled={!cvText.trim() || isAnalyzing}>
                      {isAnalyzing ? "Analyzing..." : "Analyze CV"}
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload PDF/DOC
                    </Button>
                  </div>
                </div>

                {atsScore && (
                  <div className="space-y-6 pt-6 border-t">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">{atsScore.overallScore}/100</div>
                      <p className="text-gray-600">Overall ATS Score</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Score Breakdown</h3>
                        {Object.entries(atsScore.breakdown).map(([key, data]: [string, any]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="capitalize">{key}</span>
                              <span className="font-medium">{data.score}/100</span>
                            </div>
                            <Progress value={data.score} />
                            <p className="text-sm text-gray-600">{data.feedback}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Recommendations</h3>
                        <ul className="space-y-2">
                          {atsScore.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Suggested Courses</h3>
                      <div className="grid gap-4">
                        {atsScore.suggestedCourses.map((course: any, index: number) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{course.title}</h4>
                                <p className="text-sm text-gray-600">{course.reason}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{course.match}% match</Badge>
                                <Button size="sm">Enroll</Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Interview Tab */}
          <TabsContent value="interview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Live AI Interview System
                </CardTitle>
                <CardDescription>
                  Practice with AI-powered interviews based on your chosen domain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Available Interview Types</h3>
                    <div className="space-y-3">
                      {[
                        { type: "DSA", icon: Code, description: "Data Structures & Algorithms" },
                        { type: "ML", icon: Brain, description: "Machine Learning Concepts" },
                        { type: "OS", icon: Target, description: "Operating Systems" },
                        { type: "DBMS", icon: FileText, description: "Database Management" },
                        { type: "System Design", icon: BarChart3, description: "System Architecture" }
                      ].map((interview) => (
                        <Card key={interview.type} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <interview.icon className="w-5 h-5 text-purple-600" />
                              <div>
                                <h4 className="font-medium">{interview.type}</h4>
                                <p className="text-sm text-gray-600">{interview.description}</p>
                              </div>
                            </div>
                            <Link to={`/interview-room/${interview.type.toLowerCase()}`}>
                              <Button size="sm">Start Interview</Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Interview Performance</h3>
                    <div className="space-y-3">
                      {[
                        { domain: "DSA", score: 85, date: "2024-01-20", feedback: "Strong problem-solving approach" },
                        { domain: "System Design", score: 72, date: "2024-01-18", feedback: "Good architectural thinking" },
                        { domain: "ML", score: 78, date: "2024-01-15", feedback: "Solid understanding of concepts" }
                      ].map((result, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{result.domain} Interview</h4>
                              <p className="text-sm text-gray-600">{result.feedback}</p>
                              <p className="text-xs text-gray-500">{result.date}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">{result.score}</div>
                              <p className="text-xs text-gray-600">Score</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <Link to="/mock-interview">
                      <Button className="w-full">View All Interview Results</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tracker Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Calendar-Based Activity Tracker
                </CardTitle>
                <CardDescription>
                  Track your daily learning activities and maintain your streak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        active: (date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          return activityData[dateStr]?.active || false;
                        }
                      }}
                      modifiersStyles={{
                        active: { backgroundColor: '#9333ea', color: 'white' }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="text-2xl font-bold text-green-600">15</div>
                        <p className="text-sm text-gray-600">Day Streak</p>
                      </Card>
                      <Card className="p-4">
                        <div className="text-2xl font-bold text-blue-600">68%</div>
                        <p className="text-sm text-gray-600">This Month</p>
                      </Card>
                    </div>
                    
                    {selectedDate && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">
                          Activity for {selectedDate.toLocaleDateString()}
                        </h3>
                        {(() => {
                          const dateStr = selectedDate.toISOString().split('T')[0];
                          const dayData = activityData[dateStr];
                          
                          if (!dayData || !dayData.active) {
                            return <p className="text-gray-500">No activity recorded</p>;
                          }
                          
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{dayData.hours} hours studied</span>
                              </div>
                              <div className="space-y-1">
                                {dayData.activities.map((activity: string, index: number) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span>{activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LeetCode Integration Tab */}
          <TabsContent value="leetcode" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  LeetCode Profile Integration
                </CardTitle>
                <CardDescription>
                  Connect your LeetCode profile to track your coding progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!leetcodeStats ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        placeholder="Enter your LeetCode username"
                        value={leetcodeUsername}
                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                      />
                      <Button onClick={connectLeetCode} disabled={!leetcodeUsername}>
                        <Github className="w-4 h-4 mr-2" />
                        Connect Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">@{leetcodeStats.username}</h3>
                      <Badge variant="outline" className="text-green-600">
                        {leetcodeStats.streak} day streak 🔥
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-green-50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{leetcodeStats.totalSolved}</p>
                            <p className="text-sm text-gray-600">Total Solved</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{leetcodeStats.ranking.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Global Ranking</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-purple-50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{leetcodeStats.contestRating}</p>
                            <p className="text-sm text-gray-600">Contest Rating</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-yellow-50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{leetcodeStats.acceptanceRate}%</p>
                            <p className="text-sm text-gray-600">Acceptance Rate</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="bg-green-100">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-700">{leetcodeStats.easy}</p>
                            <p className="text-sm text-gray-600">Easy Problems</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-yellow-100">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-yellow-700">{leetcodeStats.medium}</p>
                            <p className="text-sm text-gray-600">Medium Problems</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-red-100">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-red-700">{leetcodeStats.hard}</p>
                            <p className="text-sm text-gray-600">Hard Problems</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                        <div className="space-y-2">
                          {leetcodeStats.recentActivity.map((activity: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{activity.problem}</p>
                                <p className="text-sm text-gray-600">{activity.date}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={activity.difficulty === 'Easy' ? 'default' : activity.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                                  {activity.difficulty}
                                </Badge>
                                {activity.solved ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Badges & Achievements</h3>
                        <div className="space-y-2">
                          {leetcodeStats.badges.map((badge: string, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                              <Award className="w-5 h-5 text-yellow-600" />
                              <span className="font-medium">{badge}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Full Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upcoming Live Classes</h2>
              <Link to="/live-classes">
                <Button variant="outline">View All Classes</Button>
              </Link>
            </div>
            
            <div className="grid gap-4">
              {upcomingClasses.map((liveClass) => (
                <Card key={liveClass.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{liveClass.title}</h3>
                          <Badge variant="outline">{liveClass.subject}</Badge>
                        </div>
                        <p className="text-gray-600 mb-2">by {liveClass.instructor}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{liveClass.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{liveClass.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Link to={`/live-class/${liveClass.id}`}>
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Video className="w-4 h-4 mr-2" />
                            Join Class
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">Add to Calendar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Class Schedule Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span>Today: 1 class scheduled</span>
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>This Week: 5 classes scheduled</span>
                    </div>
                    <Button size="sm" variant="outline">View Calendar</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span>Next Month: 18 classes scheduled</span>
                    </div>
                    <Button size="sm" variant="outline">View Schedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
