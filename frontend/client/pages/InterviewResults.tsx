import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Clock,
  Eye,
  Volume2,
  BarChart3,
  FileText,
  Video,
  Download,
  Share,
  BookOpen,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Code,
  Database,
  Users,
  Settings,
  Calendar,
  RefreshCw
} from "lucide-react";

export default function InterviewResults() {
  const location = useLocation();
  const [resultData, setResultData] = useState<any>(location.state || {});
  
  // Mock comprehensive results
  const results = {
    overallScore: 84,
    grade: "B+",
    duration: resultData.totalTime || 1620, // 27 minutes
    questionsAnswered: 7,
    totalQuestions: 8,
    
    categoryScores: {
      technical: 87,
      communication: 82,
      problemSolving: 89,
      confidence: 76,
      clarity: 84,
      timeManagement: 78
    },
    
    proctoringAnalysis: {
      attentiveness: 88,
      eyeTracking: 85,
      faceDetection: 92,
      audioQuality: 89,
      environmentSafety: 95,
      suspiciousActivity: 0
    },
    
    strengths: [
      "Strong algorithmic thinking and problem-solving approach",
      "Clear communication of technical concepts",
      "Good understanding of data structures fundamentals",
      "Excellent eye contact and professional demeanor",
      "Well-structured responses using logical flow"
    ],
    
    weaknesses: [
      "Could provide more detailed explanations for edge cases",
      "Time management needs improvement for complex problems",
      "Consider discussing trade-offs more explicitly",
      "Practice explaining optimization techniques better"
    ],
    
    detailedFeedback: [
      {
        question: "Explain the difference between a stack and queue",
        response: "Provided clear explanation with examples",
        score: 92,
        timeSpent: 180,
        feedback: "Excellent foundational understanding. Consider adding real-world use cases.",
        improvements: ["Add practical examples", "Discuss implementation details"]
      },
      {
        question: "How would you detect a cycle in a linked list?",
        response: "Described Floyd's cycle detection algorithm",
        score: 85,
        timeSpent: 240,
        feedback: "Good algorithm choice. Explanation of time complexity was accurate.",
        improvements: ["Visualize the algorithm better", "Discuss alternative approaches"]
      },
      {
        question: "Implement a function to reverse a binary tree",
        response: "Provided recursive solution with explanation",
        score: 78,
        timeSpent: 320,
        feedback: "Correct approach but could be more efficient in explanation.",
        improvements: ["Consider iterative approach", "Discuss space complexity"]
      }
    ],
    
    recommendations: [
      {
        title: "Advanced Data Structures Course",
        description: "Strengthen your knowledge of trees, graphs, and advanced algorithms",
        relevance: 95,
        estimatedTime: "4 weeks",
        priority: "high",
        topics: ["Tree Algorithms", "Graph Theory", "Dynamic Programming"]
      },
      {
        title: "System Design Fundamentals",
        description: "Learn to design scalable systems and discuss trade-offs",
        relevance: 82,
        estimatedTime: "6 weeks", 
        priority: "medium",
        topics: ["Scalability", "Databases", "Microservices"]
      },
      {
        title: "Communication Skills for Developers",
        description: "Improve technical communication and presentation skills",
        relevance: 78,
        estimatedTime: "3 weeks",
        priority: "medium",
        topics: ["Technical Presentations", "Code Reviews", "Documentation"]
      }
    ],
    
    industryComparison: {
      percentile: 78,
      averageScore: 72,
      topPercentile: 92,
      companiesReady: ["Mid-level tech companies", "Startups", "Some FAANG (with improvement)"]
    },
    
    nextSteps: {
      readinessLevel: 82,
      recommendedActions: [
        "Practice 2-3 more mock interviews",
        "Focus on system design questions",
        "Improve time management skills",
        "Study advanced algorithmic patterns"
      ],
      estimatedTimeToReady: "3-4 weeks"
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return "from-green-500 to-green-600";
    if (grade.startsWith('B')) return "from-blue-500 to-blue-600";
    if (grade.startsWith('C')) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
            <p className="text-gray-600">Here's your comprehensive AI-powered performance analysis</p>
          </div>

          {/* Overall Score Card */}
          <Card className="mb-8 bg-gradient-to-r from-white to-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 bg-gradient-to-r ${getGradeColor(results.grade)} bg-clip-text text-transparent`}>
                  {results.overallScore}%
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-4">Grade: {results.grade}</div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{results.questionsAnswered}/{results.totalQuestions}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{formatTime(results.duration)}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{results.industryComparison.percentile}th</div>
                    <div className="text-sm text-gray-600">Percentile</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600">{results.nextSteps.readinessLevel}%</div>
                    <div className="text-sm text-gray-600">Ready</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="proctoring">AI Proctoring</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="actions">Next Steps</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Category Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(results.categoryScores).map(([category, score]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={`font-semibold ${getScoreColor(score as number)}`}>
                            {score}%
                          </span>
                        </div>
                        <Progress value={score as number} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Strengths & Weaknesses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {results.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {results.weaknesses.slice(0, 3).map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Industry Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {results.industryComparison.percentile}th Percentile
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        You performed better than {results.industryComparison.percentile}% of candidates
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Score</span>
                        <span className="font-semibold">{results.overallScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Industry Average</span>
                        <span>{results.industryComparison.averageScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Top 10%</span>
                        <span>{results.industryComparison.topPercentile}%</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Ready for:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {results.industryComparison.companiesReady.map((company, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            {company}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Video className="w-4 h-4 mr-2" />
                      Watch Recording
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share with Mentor
                    </Button>
                    <Link to="/mock-interview">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Practice Again
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Detailed Feedback Tab */}
            <TabsContent value="detailed">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Question-by-Question Analysis</h2>
                
                {results.detailedFeedback.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <Badge className={`${getScoreColor(item.score)} bg-transparent border`}>
                          {item.score}% Score
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium">
                        {item.question}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Response: </span>
                          <span className="font-medium">{item.response}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time Spent: </span>
                          <span className="font-medium">{formatTime(item.timeSpent)}</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">AI Feedback:</h4>
                        <p className="text-blue-800 text-sm">{item.feedback}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Suggested Improvements:</h4>
                        <ul className="space-y-1">
                          {item.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-sm flex items-center gap-2">
                              <ArrowRight className="w-3 h-3 text-purple-600" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI Proctoring Tab */}
            <TabsContent value="proctoring">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">AI Proctoring Analysis</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Attention & Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Attentiveness Score</span>
                          <span className="font-semibold">{results.proctoringAnalysis.attentiveness}%</span>
                        </div>
                        <Progress value={results.proctoringAnalysis.attentiveness} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Eye Tracking</span>
                          <span className="font-semibold">{results.proctoringAnalysis.eyeTracking}%</span>
                        </div>
                        <Progress value={results.proctoringAnalysis.eyeTracking} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Face Detection</span>
                          <span className="font-semibold">{results.proctoringAnalysis.faceDetection}%</span>
                        </div>
                        <Progress value={results.proctoringAnalysis.faceDetection} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5" />
                        Audio & Environment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Audio Quality</span>
                          <span className="font-semibold">{results.proctoringAnalysis.audioQuality}%</span>
                        </div>
                        <Progress value={results.proctoringAnalysis.audioQuality} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Environment Safety</span>
                          <span className="font-semibold">{results.proctoringAnalysis.environmentSafety}%</span>
                        </div>
                        <Progress value={results.proctoringAnalysis.environmentSafety} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Suspicious Activity</span>
                          <span className="font-semibold text-green-600">{results.proctoringAnalysis.suspiciousActivity}%</span>
                        </div>
                        <Progress value={100 - results.proctoringAnalysis.suspiciousActivity} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Proctoring Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>Single person detected throughout</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>No suspicious browser activity</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>Maintained eye contact well</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>Good audio quality maintained</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>Professional environment setup</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>Interview integrity maintained</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Personalized Learning Recommendations</h2>
                
                <div className="grid gap-6">
                  {results.recommendations.map((rec, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-semibold">{rec.title}</h3>
                              <Badge 
                                variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                              >
                                {rec.priority.toUpperCase()} Priority
                              </Badge>
                              <Badge variant="outline">
                                {rec.relevance}% Match
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{rec.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {rec.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-4 h-4" />
                                {rec.relevance}% relevance
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {rec.topics.map((topic, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="ml-6">
                            <Button className="bg-purple-600 hover:bg-purple-700">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Start Learning
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Next Steps Tab */}
            <TabsContent value="actions">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Interview Journey</h2>
                
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Interview Readiness Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {results.nextSteps.readinessLevel}%
                      </div>
                      <p className="text-gray-600">
                        You're {results.nextSteps.estimatedTimeToReady} away from being fully interview-ready
                      </p>
                    </div>
                    <Progress value={results.nextSteps.readinessLevel} className="h-3" />
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recommended Action Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.nextSteps.recommendedActions.map((action, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Quick Wins
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full justify-start" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Take Another Mock Interview
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Recommended Course
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Join Study Group
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Schedule Mentor Session
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">🎯 Your 30-Day Goal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-4">
                      Based on your performance, here's a personalized roadmap to reach 95% interview readiness:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-semibold text-blue-800 mb-1">Week 1-2</div>
                        <div className="text-blue-600">Focus on system design fundamentals and practice 3 mock interviews</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-semibold text-blue-800 mb-1">Week 3</div>
                        <div className="text-blue-600">Strengthen DBMS concepts and work on communication skills</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-semibold text-blue-800 mb-1">Week 4</div>
                        <div className="text-blue-600">Final mock interviews and company-specific preparation</div>
                      </div>
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
