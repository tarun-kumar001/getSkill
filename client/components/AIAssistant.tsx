import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { 
  Bot, 
  Brain, 
  Zap, 
  FileText, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Download,
  Share,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  Languages,
  Search
} from "lucide-react";

export function AIAssistant() {
  const [aiQuestion, setAiQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcriptEnabled, setTranscriptEnabled] = useState(true);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [aiResponses, setAiResponses] = useState([
    {
      type: "summary",
      content: "Currently covering React Hooks - specifically useState and useEffect patterns",
      timestamp: "2:08 PM"
    },
    {
      type: "suggestion", 
      content: "Students might benefit from a practical example of custom hooks",
      timestamp: "2:06 PM"
    }
  ]);

  useEffect(() => {
    // Simulate live transcript updates
    const transcriptInterval = setInterval(() => {
      const phrases = [
        "Now let's look at the useEffect hook...",
        "Remember, useEffect runs after every render...",
        "The dependency array is crucial for optimization...",
        "Let me show you a practical example..."
      ];
      
      if (transcriptEnabled) {
        setLiveTranscript(phrases[Math.floor(Math.random() * phrases.length)]);
      }
    }, 3000);

    return () => clearInterval(transcriptInterval);
  }, [transcriptEnabled]);

  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;
    
    // Simulate AI processing
    const newResponse = {
      type: "answer",
      content: `Based on the current discussion about React Hooks: ${aiQuestion}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setAiResponses(prev => [newResponse, ...prev]);
    setAiQuestion("");
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setAiQuestion("What's the difference between useState and useRef?");
        setIsListening(false);
      }, 2000);
    }
  };

  const quickQuestions = [
    "Explain React Hooks",
    "What is useEffect?",
    "Custom hooks best practices",
    "Performance optimization tips",
    "Common React patterns",
    "Error handling in React"
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" }
  ];

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Live AI Summary */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Live Class Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400">React Hooks fundamentals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400">useState implementation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400">useEffect patterns (current)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-gray-400">Custom hooks (upcoming)</span>
            </div>
          </div>
          
          <div className="bg-black/20 p-2 rounded text-xs">
            <strong>Key Concepts:</strong> Functional components, state management, side effects, dependency arrays
          </div>
        </CardContent>
      </Card>

      {/* Live Transcript */}
      {transcriptEnabled && (
        <Card className="bg-gray-700/50 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-green-400" />
                Live Transcript
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setTranscriptEnabled(!transcriptEnabled)}
                >
                  {transcriptEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setTranslationEnabled(!translationEnabled)}
                >
                  <Languages className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/20 p-2 rounded text-xs min-h-[60px] flex items-center">
              <span className="text-gray-300">
                "{liveTranscript}"
              </span>
            </div>
            {translationEnabled && (
              <div className="mt-2">
                <div className="flex gap-1 flex-wrap">
                  {languages.slice(0, 4).map((lang) => (
                    <Badge
                      key={lang.code}
                      variant={selectedLanguage === lang.code ? "default" : "outline"}
                      className="text-xs cursor-pointer"
                      onClick={() => setSelectedLanguage(lang.code)}
                    >
                      {lang.flag} {lang.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs space-y-2">
            <div className="bg-black/20 p-2 rounded">
              💡 Consider showing a live demo of custom hooks
            </div>
            <div className="bg-black/20 p-2 rounded">
              📊 87% of students are following along well
            </div>
            <div className="bg-black/20 p-2 rounded">
              ❓ 3 students have questions about useEffect cleanup
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Quick Ask AI</h4>
        <div className="grid grid-cols-2 gap-1">
          {quickQuestions.slice(0, 4).map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-auto p-2 text-left justify-start"
              onClick={() => setAiQuestion(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* AI Chat Interface */}
      <Card className="bg-gray-700/50 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Ask AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask anything about the current topic..."
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="bg-gray-800 border-gray-600 text-sm resize-none"
              rows={2}
            />
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${isListening ? 'bg-red-600' : ''}`}
                onClick={handleVoiceInput}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <Button onClick={handleAskAI} size="sm" className="w-full h-7">
            <Bot className="w-3 h-3 mr-2" />
            {isListening ? "Listening..." : "Ask AI"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent AI Responses */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Recent AI Insights</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {aiResponses.map((response, index) => (
            <Card key={index} className="bg-gray-700/30 border-gray-600">
              <CardContent className="p-2">
                <div className="flex items-start gap-2">
                  <Bot className="w-3 h-3 mt-1 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-300">{response.content}</p>
                    <span className="text-xs text-gray-500">{response.timestamp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Analytics */}
      <Card className="bg-green-900/30 border-green-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Learning Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Comprehension Score</span>
              <span>89%</span>
            </div>
            <Progress value={89} className="h-1" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="text-sm font-bold text-green-400">94%</div>
              <div className="text-gray-400">Attention</div>
            </div>
            <div>
              <div className="text-sm font-bold text-blue-400">12</div>
              <div className="text-gray-400">Questions</div>
            </div>
            <div>
              <div className="text-sm font-bold text-purple-400">8.7</div>
              <div className="text-gray-400">AI Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
