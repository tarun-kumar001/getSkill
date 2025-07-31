import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  Video,
  Mic,
  Eye,
  Clock,
  Target,
  Users,
  FileText,
  Play,
  Calendar,
  BarChart3,
  Award,
  Zap,
  Shield,
  Headphones,
  Camera,
  Settings,
  BookOpen,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Bot,
  Cpu,
  Database,
  Globe,
  Code,
  MessageSquare,
  PieChart
} from "lucide-react";

export default function MockInterview() {
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("30");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ name: "Demo User", userType: "student" });
    }
  }, []);

  const interviewModes = [
    {
      id: "technical",
      title: "Technical Interview",
      description: "Coding challenges, system design, and CS fundamentals",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      features: ["Live Coding", "System Design", "Algorithm Questions", "Code Review"],
      duration: "45-90 minutes",
      difficulty: ["Easy", "Medium", "Hard"]
    },
    {
      id: "behavioral",
      title: "Behavioral Interview", 
      description: "HR-style questions focusing on soft skills and experience",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      features: ["STAR Method", "Leadership Scenarios", "Team Collaboration", "Problem Solving"],
      duration: "30-60 minutes",
      difficulty: ["Junior", "Mid", "Senior"]
    },
    {
      id: "group",
      title: "Group Discussion",
      description: "Simulated group discussion with AI participants",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      features: ["Team Dynamics", "Communication", "Leadership", "Conflict Resolution"],
      duration: "20-40 minutes",
      difficulty: ["Basic", "Advanced"]
    },
    {
      id: "mixed",
      title: "Mixed Interview",
      description: "Combination of technical and behavioral rounds",
      icon: <Brain className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      features: ["Complete Assessment", "Multi-Round", "Comprehensive", "Real Experience"],
      duration: "60-120 minutes",
      difficulty: ["Comprehensive"]
    }
  ];

  const technicalDomains = [
    { id: "dsa", name: "Data Structures & Algorithms", icon: <Cpu className="w-5 h-5" /> },
    { id: "dbms", name: "Database Management", icon: <Database className="w-5 h-5" /> },
    { id: "os", name: "Operating Systems", icon: <Settings className="w-5 h-5" /> },
    { id: "cn", name: "Computer Networks", icon: <Globe className="w-5 h-5" /> },
    { id: "ml", name: "Machine Learning", icon: <Brain className="w-5 h-5" /> },
    { id: "webdev", name: "Web Development", icon: <Code className="w-5 h-5" /> }
  ];

  const pastInterviews = [
    {
      id: 1,
      type: "Technical - DSA",
      date: "2 days ago",
      score: 85,
      duration: "45 minutes",
      status: "completed",
      feedback: "Strong algorithmic thinking, needs improvement in optimization"
    },
    {
      id: 2,
      type: "Behavioral - Leadership",
      date: "1 week ago", 
      score: 78,
      duration: "30 minutes",
      status: "completed",
      feedback: "Good communication, work on providing specific examples"
    },
    {
      id: 3,
      type: "Mixed Interview",
      date: "2 weeks ago",
      score: 92,
      duration: "75 minutes",
      status: "completed",
      feedback: "Excellent overall performance, ready for senior roles"
    }
  ];

  const stats = {
    totalInterviews: 12,
    averageScore: 82,
    improvementRate: 15,
    readinessLevel: 88
  };

  const startInterview = () => {
    if (!selectedMode) {
      alert("Please select an interview mode");
      return;
    }
    
    const interviewData = {
      mode: selectedMode,
      domain: selectedDomain,
      difficulty,
      duration
    };
    
    // Navigate to interview room
    navigate(`/interview-room/${selectedMode}`, { 
      state: interviewData 
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                AI Mock Interview System
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice with AI-powered interviews that simulate real-world scenarios. 
              Get instant feedback, proctoring insights, and personalized improvement recommendations.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">{stats.totalInterviews}</div>
                <p className="text-sm text-gray-600">Total Interviews</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600 mb-2">{stats.averageScore}%</div>
                <p className="text-sm text-gray-600">Average Score</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600 mb-2">+{stats.improvementRate}%</div>
                <p className="text-sm text-gray-600">Improvement</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600 mb-2">{stats.readinessLevel}%</div>
                <p className="text-sm text-gray-600">Interview Ready</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="start" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="start">Start Interview</TabsTrigger>
              <TabsTrigger value="history">Interview History</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            </TabsList>

            {/* Start Interview Tab */}
            <TabsContent value="start">
              <div className="space-y-8">
                {/* Interview Mode Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Choose Interview Mode
                    </CardTitle>
                    <CardDescription>
                      Select the type of interview you want to practice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {interviewModes.map((mode) => (
                        <Card 
                          key={mode.id}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedMode === mode.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                          }`}
                          onClick={() => setSelectedMode(mode.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center text-white`}>
                                {mode.icon}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{mode.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{mode.description}</p>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    {mode.duration}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-1">
                                    {mode.features.map((feature, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              {selectedMode === mode.id && (
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration */}
                {selectedMode && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Interview Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedMode === 'technical' && (
                        <div className="space-y-2">
                          <Label>Technical Domain</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {technicalDomains.map((domain) => (
                              <Button
                                key={domain.id}
                                variant={selectedDomain === domain.id ? "default" : "outline"}
                                className="justify-start h-auto p-3"
                                onClick={() => setSelectedDomain(domain.id)}
                              >
                                {domain.icon}
                                <span className="ml-2 text-sm">{domain.name}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Difficulty Level</Label>
                          <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {interviewModes.find(m => m.id === selectedMode)?.difficulty.map((level) => (
                                <SelectItem key={level} value={level.toLowerCase()}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                              <SelectItem value="90">90 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* AI Features Preview */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          AI Features Included
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">AI Proctoring</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Smart AI Interviewer</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                            <span className="text-sm">Real-time Analytics</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span className="text-sm">Detailed Feedback</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={startInterview}
                        size="lg" 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start AI Interview
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Interview History Tab */}
            <TabsContent value="history">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Interview History</h2>
                
                <div className="space-y-4">
                  {pastInterviews.map((interview) => (
                    <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{interview.type}</h3>
                              <Badge 
                                variant={interview.score >= 80 ? 'default' : interview.score >= 60 ? 'secondary' : 'destructive'}
                                className="ml-2"
                              >
                                {interview.score}% Score
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {interview.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {interview.duration}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 italic">"{interview.feedback}"</p>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4 mr-2" />
                              View Report
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="w-4 h-4 mr-2" />
                              Watch Recording
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Performance Analytics Tab */}
            <TabsContent value="analytics">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Progress Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Score Progression
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Technical Skills</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Communication</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Problem Solving</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Confidence Level</span>
                            <span>76%</span>
                          </div>
                          <Progress value={76} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Improvement Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Strengthen DBMS Knowledge</h4>
                          <p className="text-sm text-blue-700 mb-3">Focus on normalization and indexing concepts</p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Take DBMS Course
                          </Button>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Practice Communication</h4>
                          <p className="text-sm text-green-700 mb-3">Work on explaining technical concepts clearly</p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Soft Skills Training
                          </Button>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">System Design Practice</h4>
                          <p className="text-sm text-purple-700 mb-3">More practice with scalability questions needed</p>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            System Design Course
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interview Readiness Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Interview Readiness Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold text-green-600">{stats.readinessLevel}%</div>
                      <div className="text-xl font-semibold text-gray-700">Ready for Senior Roles</div>
                      <Progress value={stats.readinessLevel} className="h-3" />
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Based on your recent interviews, you're well-prepared for senior developer positions. 
                        Continue practicing system design and DBMS concepts to reach expert level.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
