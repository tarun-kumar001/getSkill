import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Star,
  Mic,
  MicOff,
  Play,
  Pause,
  Target,
  ArrowRight
} from "lucide-react";

export default function AITools() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  
  // Mock Interview State
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const mockSkills = ["JavaScript", "React", "Python", "SQL", "Machine Learning", "Data Structures"];
      const mockCourses = [
        { title: "Advanced React Development", match: 95, price: 49.99 },
        { title: "Python for Data Science", match: 88, price: 59.99 },
        { title: "System Design Interview Prep", match: 82, price: 79.99 }
      ];

      setAtsScore(mockScore);
      setExtractedSkills(mockSkills);
      setRecommendedCourses(mockCourses);
      setIsAnalyzing(false);
    }, 3000);
  };

  const startInterview = () => {
    if (!selectedSubject) return;

    const questions = {
      "dsa": [
        "Explain the difference between Array and LinkedList. When would you use each?",
        "How would you detect a cycle in a linked list?",
        "What is the time complexity of different sorting algorithms?"
      ],
      "ml": [
        "What is the difference between supervised and unsupervised learning?",
        "Explain overfitting and how to prevent it.",
        "What are the assumptions of linear regression?"
      ],
      "dbms": [
        "What is database normalization and why is it important?",
        "Explain ACID properties in database transactions.",
        "What is the difference between clustered and non-clustered indexes?"
      ],
      "os": [
        "What is a deadlock and how can it be prevented?",
        "Explain the difference between process and thread.",
        "What are the different CPU scheduling algorithms?"
      ]
    };

    setIsInterviewActive(true);
    setQuestionNumber(1);
    setCurrentQuestion(questions[selectedSubject as keyof typeof questions][0]);
    setUserAnswer("");
    setInterviewFeedback("");
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    // Simulate AI feedback generation
    const mockFeedback = [
      "Good explanation of the concept. Consider adding more examples to strengthen your answer.",
      "Your answer shows understanding of the fundamentals. You could improve by discussing edge cases.",
      "Excellent answer! You demonstrated deep knowledge and provided clear examples.",
      "Partial understanding shown. Review the concept and focus on practical applications."
    ];

    setInterviewFeedback(mockFeedback[Math.floor(Math.random() * mockFeedback.length)]);
    
    // Move to next question after 3 seconds
    setTimeout(() => {
      if (questionNumber < 3) {
        setQuestionNumber(questionNumber + 1);
        // Get next question based on subject
        setCurrentQuestion(`Question ${questionNumber + 1} for ${selectedSubject.toUpperCase()}`);
        setUserAnswer("");
        setInterviewFeedback("");
      } else {
        setIsInterviewActive(false);
        setInterviewFeedback("Interview completed! Overall performance: Good. Focus on practicing more advanced concepts.");
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">AI-Powered Learning Tools</h1>
            <p className="text-xl text-gray-600">
              Experience cutting-edge AI technology designed to accelerate your career growth
            </p>
          </div>

          {/* AI Tools Navigation */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link to="/mock-interview">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-purple-200 hover:border-purple-400 h-full">
                <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">AI Mock Interview</h3>
                    <p className="text-gray-600 mb-4">Practice with AI-powered interviews and real-time proctoring</p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-blue-200 h-full">
              <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Resume ATS Checker</h3>
                  <p className="text-gray-600 mb-4">Get instant feedback on your resume's ATS compatibility</p>
                </div>
                <Button variant="outline" className="w-full">Active Below</Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 h-full">
              <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-600 to-purple-600 flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Learning Path</h3>
                  <p className="text-gray-600 mb-4">AI-powered personalized learning recommendations</p>
                </div>
                <Button variant="outline" className="w-full">Coming Soon</Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ats-checker" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ats-checker">Resume ATS Checker</TabsTrigger>
              <TabsTrigger value="mock-interview">AI Mock Interview</TabsTrigger>
            </TabsList>

            {/* ATS Checker Tab */}
            <TabsContent value="ats-checker">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-600" />
                    AI Resume ATS Checker
                  </CardTitle>
                  <CardDescription>
                    Upload your resume to get an instant ATS compatibility score and personalized course recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="resume-upload">Upload Resume (PDF, DOC, DOCX)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Label htmlFor="resume-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">Click to upload your resume</p>
                        <p className="text-sm text-gray-500">Supports PDF, DOC, and DOCX files</p>
                      </Label>
                    </div>
                    {resumeFile && (
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {resumeFile.name} uploaded successfully
                      </p>
                    )}
                  </div>

                  {isAnalyzing && (
                    <Card className="bg-blue-50">
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                            <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
                          </div>
                          <h3 className="font-semibold">AI is analyzing your resume...</h3>
                          <Progress value={66} className="w-full" />
                          <p className="text-sm text-gray-600">Extracting skills and calculating ATS score</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {atsScore !== null && (
                    <div className="space-y-6">
                      {/* ATS Score */}
                      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">
                              <span className={atsScore >= 80 ? "text-green-600" : atsScore >= 60 ? "text-yellow-600" : "text-red-600"}>
                                {atsScore}%
                              </span>
                            </div>
                            <p className="text-lg font-medium">ATS Compatibility Score</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              {atsScore >= 80 ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <span className="text-green-600">Excellent</span>
                                </>
                              ) : atsScore >= 60 ? (
                                <>
                                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                                  <span className="text-yellow-600">Good</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                  <span className="text-red-600">Needs Improvement</span>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Extracted Skills */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Extracted Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {extractedSkills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Course Recommendations */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recommended Courses</CardTitle>
                          <CardDescription>Based on your skills and market demands</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recommendedCourses.map((course, index) => (
                              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                  <h4 className="font-medium">{course.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-600">{course.match}% match</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-purple-600">${course.price}</div>
                                  <Button size="sm" className="mt-1">Enroll Now</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mock Interview Tab */}
            <TabsContent value="mock-interview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    AI Mock Interview System
                  </CardTitle>
                  <CardDescription>
                    Practice technical interviews with AI-powered questions and real-time feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isInterviewActive ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Interview Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a subject for your interview" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dsa">Data Structures & Algorithms</SelectItem>
                            <SelectItem value="ml">Machine Learning</SelectItem>
                            <SelectItem value="dbms">Database Management Systems</SelectItem>
                            <SelectItem value="os">Operating Systems</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={startInterview} 
                        disabled={!selectedSubject}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Mock Interview
                      </Button>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">What to expect:</h3>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• 3 technical questions based on your selected subject</li>
                          <li>• Real-time AI feedback on your answers</li>
                          <li>• Performance analysis and improvement suggestions</li>
                          <li>• Estimated interview duration: 15-20 minutes</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Question {questionNumber} of 3</h3>
                        <Badge className="bg-green-100 text-green-700">Interview Active</Badge>
                      </div>

                      <Card className="bg-blue-50">
                        <CardContent className="pt-4">
                          <p className="text-lg">{currentQuestion}</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <Label>Your Answer</Label>
                        <Textarea
                          placeholder="Type your answer here..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="min-h-32"
                        />
                      </div>

                      <Button 
                        onClick={submitAnswer} 
                        disabled={!userAnswer.trim()}
                        className="w-full"
                      >
                        Submit Answer
                      </Button>

                      {interviewFeedback && (
                        <Card className="bg-green-50">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">AI Feedback</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{interviewFeedback}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
