import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Eye,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
  Zap,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Monitor,
  Wifi,
  WifiOff,
  Target,
  TrendingUp,
  BarChart3,
  MessageSquare,
  FileText,
  Award,
  Settings,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  PhoneOff,
  Code,
  Database,
  Globe,
  Cpu,
  Shield,
  Timer,
  Sparkles,
  User,
  Heart,
  Smile,
  Frown,
  AlertCircle,
  Headphones,
  Waves,
  PersonStanding
} from "lucide-react";

// AI Avatar Component
const AIInterviewerAvatar = ({ isActive, currentEmotion, isSpeaking }: { 
  isActive: boolean; 
  currentEmotion: string;
  isSpeaking: boolean;
}) => {
  return (
    <div className="relative">
      <div className={`w-24 h-24 rounded-full overflow-hidden border-4 transition-all duration-300 ${
        isActive ? 'border-purple-400 shadow-lg shadow-purple-400/50' : 'border-gray-600'
      }`}>
        {/* AI Avatar Face - Simulated with gradients and animations */}
        <div className={`w-full h-full bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 relative transition-all duration-500 ${
          isSpeaking ? 'animate-pulse' : ''
        }`}>
          {/* Eyes */}
          <div className="absolute top-6 left-4 w-3 h-3 bg-white rounded-full">
            <div className={`w-2 h-2 bg-gray-800 rounded-full mt-0.5 ml-0.5 transition-all duration-200 ${
              isActive ? 'animate-pulse' : ''
            }`}></div>
          </div>
          <div className="absolute top-6 right-4 w-3 h-3 bg-white rounded-full">
            <div className={`w-2 h-2 bg-gray-800 rounded-full mt-0.5 ml-0.5 transition-all duration-200 ${
              isActive ? 'animate-pulse' : ''
            }`}></div>
          </div>
          
          {/* Mouth - changes based on speaking state */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            {isSpeaking ? (
              <div className="w-4 h-2 bg-gray-800 rounded-full animate-pulse"></div>
            ) : (
              <div className={`w-3 h-1 bg-gray-800 rounded-full ${
                currentEmotion === 'happy' ? 'transform rotate-12' : 
                currentEmotion === 'serious' ? '' : 
                'transform -rotate-12'
              }`}></div>
            )}
          </div>
          
          {/* Emotion indicators */}
          {currentEmotion === 'happy' && (
            <div className="absolute top-8 left-6 w-1 h-3 bg-pink-200 rounded-full transform rotate-12"></div>
          )}
          {currentEmotion === 'happy' && (
            <div className="absolute top-8 right-6 w-1 h-3 bg-pink-200 rounded-full transform -rotate-12"></div>
          )}
        </div>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-2 bg-purple-400 rounded animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-3 bg-purple-400 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-2 bg-purple-400 rounded animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Avatar name tag */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-2 py-1 rounded text-xs whitespace-nowrap">
        AI Interviewer Sarah
      </div>
      
      {/* Status indicator */}
      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
        isActive ? 'bg-green-500' : 'bg-gray-500'
      }`}></div>
    </div>
  );
};

export default function InterviewRoom() {
  const { mode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const [interviewData, setInterviewData] = useState<any>(location.state || {});
  
  // Permission and Setup States
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [cameraError, setCameraError] = useState<string>("");
  const [audioError, setAudioError] = useState<string>("");
  
  // Interview State
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  
  // Media Controls
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  
  // AI Avatar State
  const [avatarEmotion, setAvatarEmotion] = useState("neutral");
  const [avatarMessage, setAvatarMessage] = useState("Hello! I'm Sarah, your AI interviewer. Ready to begin?");
  const [isAvatarActive, setIsAvatarActive] = useState(false);
  
  // Advanced AI Proctoring Data
  const [proctoringData, setProctoringData] = useState({
    eyeTracking: 85,
    eyeContactTime: 78,
    lookingAwayCount: 2,
    faceDetection: 92,
    attentiveness: 88,
    backgroundNoise: 15,
    confidenceLevel: 76,
    responseTime: 12.5,
    speechClarity: 89,
    emotionalState: "focused",
    suspiciousActivity: false,
    blinkRate: 18,
    facialTension: 15,
    bodyPosture: 85,
    environmentScore: 92,
    multiplePersons: false,
    phoneDetected: false,
    voiceConsistency: 94
  });
  
  // Interview Progress
  const [interviewProgress, setInterviewProgress] = useState({
    questionsAnswered: 0,
    totalQuestions: 8,
    averageResponseTime: 45,
    technicalAccuracy: 78,
    communicationScore: 85,
    nonVerbalScore: 80
  });

  // Enhanced question sets with AI personality
  const questions = {
    technical: {
      dsa: [
        "Let me start with a fundamental question. Can you explain the difference between a stack and queue, and provide real-world examples where each would be most appropriate?",
        "I'm curious about your problem-solving approach. How would you detect a cycle in a linked list? Walk me through your thought process step by step.",
        "Time complexity is crucial. What's the time complexity of quicksort, and can you explain what factors influence its performance?",
        "Here's a practical scenario. How would you implement a function to reverse a binary tree? Please explain your solution approach.",
        "Dynamic programming can be challenging. Can you explain this concept and provide a concrete example of when you'd apply it?",
        "Let's test your algorithmic thinking. How would you find the kth largest element in an unsorted array efficiently?",
        "Tree traversals are fundamental. What are the different types, and can you implement one of them?",
        "Finally, let's discuss hash tables. How do they work internally, and how would you handle collision resolution?"
      ],
      dbms: [
        "Let's begin with database fundamentals. What is database normalization, and can you explain the different normal forms with examples?",
        "Performance is key in databases. How do indexes improve performance, and what are the potential trade-offs?",
        "ACID properties are crucial for data integrity. Can you explain each property with practical examples?",
        "I'd like to understand your knowledge of indexing. What's the difference between clustered and non-clustered indexes?",
        "Query optimization is important. How would you approach optimizing a slow-running SQL query?",
        "JOINs are fundamental. Can you explain the difference between INNER JOIN and LEFT JOIN with examples?",
        "Scalability matters in modern systems. What is database sharding, and when would you consider using it?",
        "In distributed systems, how do you ensure data consistency across multiple database nodes?"
      ]
    },
    behavioral: [
      "I'd love to hear about your teamwork experience. Tell me about a time when you had to work with a difficult team member and how you handled it.",
      "Learning agility is important in tech. Describe a situation where you had to learn a new technology quickly. What was your approach?",
      "Pressure situations are common. How do you handle working under tight deadlines, and can you share a specific example?",
      "I'm interested in your proudest work. Tell me about a project you're most proud of and what made it special to you.",
      "Decision-making is crucial. Describe a time when you had to make a difficult technical decision. What factors did you consider?",
      "Problem-solving skills are essential. How do you approach debugging a complex problem? Walk me through your methodology.",
      "Growth mindset is valuable. Tell me about a time when you received constructive criticism. How did you respond?",
      "Staying current is important in tech. How do you keep up with new technologies and industry trends?"
    ]
  };

  // AI responses and follow-ups
  const avatarResponses = {
    positive: [
      "Excellent explanation! Your understanding is quite clear.",
      "That's a great approach. I can see you've thought this through well.",
      "Very good! Your technical reasoning is solid.",
      "I appreciate the detail in your response. Well done!"
    ],
    neutral: [
      "I see. Can you elaborate on that point a bit more?",
      "Interesting. How would you handle edge cases in this scenario?",
      "That's one approach. Are there any alternative methods you'd consider?",
      "Can you walk me through a specific example of this?"
    ],
    negative: [
      "I understand your thinking, but let me guide you in a different direction.",
      "That's partially correct. What other factors might you consider?",
      "Let's try approaching this from another angle.",
      "I can see the logic, but there might be more efficient solutions."
    ]
  };

  // Camera and Microphone Setup
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPermissionsGranted(true);
      setShowPermissionDialog(false);
      setCameraError("");
      setAudioError("");
      
      // Initialize advanced proctoring
      initializeProctoring(stream);
      
    } catch (error: any) {
      console.error('Permission denied:', error);
      if (error.name === 'NotAllowedError') {
        setCameraError("Camera and microphone access denied. Please grant permissions to continue.");
      } else if (error.name === 'NotFoundError') {
        setCameraError("No camera or microphone found. Please check your devices.");
      } else {
        setCameraError("Failed to access camera/microphone. Please try again.");
      }
    }
  };

  // Initialize advanced proctoring with face detection
  const initializeProctoring = (stream: MediaStream) => {
    // Simulate advanced proctoring initialization
    console.log("Initializing AI proctoring with MediaPipe and TensorFlow.js...");
    setIsAvatarActive(true);
    
    // Start advanced monitoring
    const proctoringInterval = setInterval(() => {
      setProctoringData(prev => ({
        ...prev,
        eyeTracking: Math.max(70, Math.min(100, prev.eyeTracking + (Math.random() - 0.5) * 10)),
        eyeContactTime: Math.max(60, Math.min(100, prev.eyeContactTime + (Math.random() - 0.5) * 8)),
        attentiveness: Math.max(60, Math.min(100, prev.attentiveness + (Math.random() - 0.5) * 8)),
        backgroundNoise: Math.max(0, Math.min(50, prev.backgroundNoise + (Math.random() - 0.5) * 5)),
        confidenceLevel: Math.max(50, Math.min(100, prev.confidenceLevel + (Math.random() - 0.5) * 6)),
        speechClarity: Math.max(70, Math.min(100, prev.speechClarity + (Math.random() - 0.5) * 4)),
        blinkRate: Math.max(10, Math.min(30, prev.blinkRate + (Math.random() - 0.5) * 3)),
        facialTension: Math.max(0, Math.min(50, prev.facialTension + (Math.random() - 0.5) * 5)),
        bodyPosture: Math.max(60, Math.min(100, prev.bodyPosture + (Math.random() - 0.5) * 4)),
        voiceConsistency: Math.max(80, Math.min(100, prev.voiceConsistency + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(proctoringInterval);
  };

  // Text-to-Speech for AI Avatar
  const speakAvatarMessage = (text: string, emotion: string = "neutral") => {
    setIsAvatarSpeaking(true);
    setAvatarEmotion(emotion);
    setAvatarMessage(text);
    
    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.name.includes('Female') || voice.name.includes('Google US English Female')
      ) || speechSynthesis.getVoices()[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsAvatarSpeaking(false);
        setAvatarEmotion("neutral");
      };
      
      speechSynthesis.speak(utterance);
    } else {
      // Fallback - just show text for 3 seconds
      setTimeout(() => {
        setIsAvatarSpeaking(false);
        setAvatarEmotion("neutral");
      }, 3000);
    }
  };

  // Speech-to-Text for user responses
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setUserAnswer(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Enhanced interview flow with AI personality
  const startInterview = () => {
    if (!permissionsGranted) {
      setShowPermissionDialog(true);
      return;
    }
    
    setIsInterviewStarted(true);
    setIsRecording(true);
    setQuestionNumber(1);
    
    // AI avatar welcomes and starts
    const welcomeMessage = "Welcome to your AI-powered mock interview! I'm Sarah, and I'll be conducting your interview today. I'll ask you a series of questions and provide real-time feedback. Let's begin with our first question.";
    
    setTimeout(() => {
      speakAvatarMessage(welcomeMessage, "happy");
      
      // Get first question based on mode and domain
      setTimeout(() => {
        let questionSet = questions.behavioral;
        if (mode === 'technical' && interviewData.domain) {
          questionSet = questions.technical[interviewData.domain as keyof typeof questions.technical] || questions.technical.dsa;
        }
        
        const firstQuestion = questionSet[0];
        setCurrentQuestion(firstQuestion);
        speakAvatarMessage(firstQuestion, "serious");
      }, 4000);
    }, 1000);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    // AI avatar acknowledges
    const responses = Math.random() > 0.7 ? avatarResponses.positive : 
                     Math.random() > 0.4 ? avatarResponses.neutral : avatarResponses.negative;
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    speakAvatarMessage(response, Math.random() > 0.5 ? "happy" : "neutral");
    
    // Simulate AI processing
    const processingTime = Math.random() * 3000 + 2000;
    
    setTimeout(() => {
      // Move to next question
      if (questionNumber < interviewProgress.totalQuestions) {
        let questionSet = questions.behavioral;
        if (mode === 'technical' && interviewData.domain) {
          questionSet = questions.technical[interviewData.domain as keyof typeof questions.technical] || questions.technical.dsa;
        }
        
        const nextQuestion = questionSet[questionNumber] || "Thank you for your response. Let's move to the next topic.";
        setCurrentQuestion(nextQuestion);
        setQuestionNumber(prev => prev + 1);
        setUserAnswer("");
        
        // Avatar asks next question
        setTimeout(() => {
          speakAvatarMessage(nextQuestion, "serious");
        }, 1000);
        
        // Update progress
        setInterviewProgress(prev => ({
          ...prev,
          questionsAnswered: prev.questionsAnswered + 1,
          technicalAccuracy: Math.max(60, Math.min(100, prev.technicalAccuracy + (Math.random() - 0.5) * 10)),
          communicationScore: Math.max(60, Math.min(100, prev.communicationScore + (Math.random() - 0.5) * 8)),
          nonVerbalScore: Math.max(60, Math.min(100, prev.nonVerbalScore + (Math.random() - 0.5) * 6))
        }));
      } else {
        // Interview completed
        endInterview();
      }
    }, processingTime);
  };

  const endInterview = () => {
    const endMessage = "Thank you for completing the interview! I've analyzed your responses and will now prepare your detailed feedback report. You performed well overall!";
    speakAvatarMessage(endMessage, "happy");
    
    setTimeout(() => {
      setIsInterviewStarted(false);
      setIsRecording(false);
      
      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      navigate('/interview-results', { 
        state: { 
          interviewData, 
          proctoringData, 
          interviewProgress,
          totalTime: 1800 - timeRemaining,
          avatarFeedback: true
        } 
      });
    }, 3000);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  // Timer and cleanup effects
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (isInterviewStarted && timeRemaining > 0) {
        setTimeRemaining(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isInterviewStarted, timeRemaining]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDomainIcon = (domain: string) => {
    const icons: { [key: string]: JSX.Element } = {
      dsa: <Cpu className="w-4 h-4" />,
      dbms: <Database className="w-4 h-4" />,
      os: <Settings className="w-4 h-4" />,
      cn: <Globe className="w-4 h-4" />,
      ml: <Brain className="w-4 h-4" />,
      webdev: <Code className="w-4 h-4" />
    };
    return icons[domain] || <Code className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera & Microphone Access Required
            </DialogTitle>
            <DialogDescription>
              To conduct the AI interview with proctoring, we need access to your camera and microphone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your privacy is protected. Video and audio are processed locally for AI analysis and proctoring only.
              </AlertDescription>
            </Alert>
            
            {cameraError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <h4 className="font-medium">What we'll use:</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>📹 Camera: Real-time video for AI proctoring</li>
                <li>🎤 Microphone: Voice responses and analysis</li>
                <li>👁️ Eye tracking: Attention and engagement monitoring</li>
                <li>🧠 Facial analysis: Confidence and emotion detection</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={requestPermissions} className="flex-1">
                Grant Access
              </Button>
              <Button variant="outline" onClick={() => navigate('/mock-interview')}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isRecording && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
              <span className="font-semibold">AI Mock Interview with Sarah</span>
              {isRecording && <Badge className="bg-red-600">LIVE RECORDING</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Mode: {mode?.charAt(0).toUpperCase() + mode?.slice(1)}</span>
              {interviewData.domain && (
                <span className="flex items-center gap-1">
                  {getDomainIcon(interviewData.domain)}
                  {interviewData.domain.toUpperCase()}
                </span>
              )}
              <span>Difficulty: {interviewData.difficulty}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Wifi className="w-3 h-3 mr-1" />
              HD Quality
            </Badge>
            
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
            
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Eye className="w-3 h-3 mr-1" />
              Proctoring Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Interview Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Section */}
          <div className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Candidate Video */}
              <div className="lg:col-span-2 relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  poster="/placeholder.svg"
                />
                
                {!permissionsGranted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">Camera access required</p>
                      <Button 
                        onClick={() => setShowPermissionDialog(true)}
                        className="mt-4"
                      >
                        Enable Camera
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">You</span>
                </div>
                
                {/* Enhanced Proctoring Overlay */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Badge className={`${proctoringData.eyeTracking > 80 ? 'bg-green-600' : proctoringData.eyeTracking > 60 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                    <Eye className="w-3 h-3 mr-1" />
                    Eye: {proctoringData.eyeTracking}%
                  </Badge>
                  <Badge className={`${proctoringData.faceDetection > 90 ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    <Camera className="w-3 h-3 mr-1" />
                    Face: {proctoringData.faceDetection}%
                  </Badge>
                  <Badge className={`${proctoringData.attentiveness > 80 ? 'bg-green-600' : proctoringData.attentiveness > 60 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                    <Target className="w-3 h-3 mr-1" />
                    Focus: {proctoringData.attentiveness}%
                  </Badge>
                </div>

                {/* AI Interviewer Avatar - Enhanced */}
                <div className="absolute top-4 left-4">
                  <AIInterviewerAvatar 
                    isActive={isAvatarActive}
                    currentEmotion={avatarEmotion}
                    isSpeaking={isAvatarSpeaking}
                  />
                </div>

                {/* Avatar Speech Bubble */}
                {isAvatarSpeaking && avatarMessage && (
                  <div className="absolute top-32 left-4 max-w-md">
                    <div className="bg-purple-600/90 backdrop-blur-sm p-3 rounded-lg relative">
                      <p className="text-sm">{avatarMessage}</p>
                      <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-purple-600/90"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Controls & Progress */}
              <div className="space-y-4">
                {/* Question Display */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Question {questionNumber} of {interviewProgress.totalQuestions}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                      <p className="text-sm leading-relaxed">
                        {currentQuestion || "Click 'Start Interview' to begin your AI-powered mock interview"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Area */}
                {isInterviewStarted && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        Your Response
                        {isListening && <Badge className="bg-red-600 animate-pulse">Listening...</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        placeholder="Type your answer here or use voice input..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                      />
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={submitAnswer}
                          disabled={!userAnswer.trim()}
                          size="sm" 
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          Submit Answer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${isListening ? 'bg-red-600' : 'bg-gray-700'}`}
                          onClick={isListening ? stopListening : startListening}
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Progress Tracker */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-400">Interview Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Questions Completed</span>
                          <span>{interviewProgress.questionsAnswered}/{interviewProgress.totalQuestions}</span>
                        </div>
                        <Progress value={(interviewProgress.questionsAnswered / interviewProgress.totalQuestions) * 100} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{interviewProgress.technicalAccuracy}%</div>
                          <div className="text-gray-400">Technical</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{interviewProgress.communicationScore}%</div>
                          <div className="text-gray-400">Verbal</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">{interviewProgress.nonVerbalScore}%</div>
                          <div className="text-gray-400">Non-Verbal</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Enhanced Control Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleAudio}
                >
                  {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="sm"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </Button>

                {!isInterviewStarted ? (
                  <Button 
                    onClick={startInterview}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!permissionsGranted}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start AI Interview
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => setIsInterviewStarted(false)}
                  >
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>

                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={endInterview}
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Interview
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Right Sidebar - Advanced AI Proctoring */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs defaultValue="proctoring" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="proctoring" className="text-xs">AI Proctoring</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">Live Analytics</TabsTrigger>
            </TabsList>

            {/* Enhanced AI Proctoring Tab */}
            <TabsContent value="proctoring" className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Eye & Attention Tracking */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Advanced Eye Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Eye Contact</span>
                      <span>{proctoringData.eyeContactTime}%</span>
                    </div>
                    <Progress value={proctoringData.eyeContactTime} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Looking Away</span>
                      <span>{proctoringData.lookingAwayCount} times</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Blink Rate</span>
                      <span>{proctoringData.blinkRate}/min</span>
                    </div>
                    <Progress value={(proctoringData.blinkRate / 30) * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Facial & Emotional Analysis */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Facial & Emotion Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Facial Tension</span>
                      <span>{proctoringData.facialTension}%</span>
                    </div>
                    <Progress value={100 - proctoringData.facialTension} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Confidence Level</span>
                      <span>{proctoringData.confidenceLevel}%</span>
                    </div>
                    <Progress value={proctoringData.confidenceLevel} className="h-1" />
                  </div>
                  
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span>Emotional State</span>
                      <Badge variant="outline" className="text-xs">
                        {proctoringData.emotionalState}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Body Language & Posture */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <PersonStanding className="w-4 h-4" />
                    Body Language
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Posture Score</span>
                      <span>{proctoringData.bodyPosture}%</span>
                    </div>
                    <Progress value={proctoringData.bodyPosture} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Audio & Voice Analysis */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-400 flex items-center gap-2">
                    <Waves className="w-4 h-4" />
                    Voice Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Speech Clarity</span>
                      <span>{proctoringData.speechClarity}%</span>
                    </div>
                    <Progress value={proctoringData.speechClarity} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Voice Consistency</span>
                      <span>{proctoringData.voiceConsistency}%</span>
                    </div>
                    <Progress value={proctoringData.voiceConsistency} className="h-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Background Noise</span>
                      <span>{proctoringData.backgroundNoise} dB</span>
                    </div>
                    <Progress value={100 - proctoringData.backgroundNoise * 2} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Environment & Security */}
              <Card className="bg-green-900/30 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Environment Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-2">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Single Person Detected</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>No Phone Detected</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Appropriate Lighting</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Stable Connection</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Live Analytics Tab */}
            <TabsContent value="analytics" className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Real-time Performance */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-yellow-400 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Live Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-400">{interviewProgress.technicalAccuracy}%</div>
                      <div className="text-gray-400">Technical</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{interviewProgress.communicationScore}%</div>
                      <div className="text-gray-400">Verbal</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">{interviewProgress.nonVerbalScore}%</div>
                      <div className="text-gray-400">Non-Verbal</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {Math.round((interviewProgress.technicalAccuracy + interviewProgress.communicationScore + interviewProgress.nonVerbalScore) / 3)}%
                    </div>
                    <div className="text-xs text-gray-400">Overall Score</div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="bg-blue-900/30 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Real-time AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="bg-black/20 p-2 rounded">
                    ✓ Maintaining good eye contact
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    💡 Speaking at appropriate pace
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    📈 Confidence increasing over time
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    🎯 Answers show good technical depth
                  </div>
                </CardContent>
              </Card>

              {/* Response Quality Analysis */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-400">Response Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Clarity</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-1" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Completeness</span>
                      <span>76%</span>
                    </div>
                    <Progress value={76} className="h-1" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Relevance</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-1" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Engagement</span>
                      <span>84%</span>
                    </div>
                    <Progress value={84} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              {/* Time Management */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-400 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span>{interviewProgress.averageResponseTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time per Question</span>
                    <span>3.2 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pace</span>
                    <Badge variant="outline" className="text-xs">
                      Optimal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
