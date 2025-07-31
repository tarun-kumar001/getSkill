import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Contact from "./components/Contact";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TutorRegister from "./pages/TutorRegister";
import AITools from "./pages/AITools";
import Courses from "./pages/Courses";
import LiveClasses from "./pages/LiveClasses";
import LiveClassRoom from "./pages/LiveClassRoom";
import MockInterview from "./pages/MockInterview";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewResults from "./pages/InterviewResults";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import UserSettings from "./pages/UserSettings";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import PlaceholderPage from "./pages/PlaceholderPage";
import FAQ from "./pages/FAQ";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tutor/register" element={<TutorRegister />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/live-classes" element={<LiveClasses />} />
            <Route path="/live-class/:classId" element={<LiveClassRoom />} />
            <Route path="/live-classes/:classId" element={<LiveClassRoom />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/interview-room/:mode" element={<InterviewRoom />} />
            <Route path="/interview-results" element={<InterviewResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy" element={<PlaceholderPage />} />
            <Route path="/terms" element={<PlaceholderPage />} />
            <Route path="/careers" element={<PlaceholderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Contact />
      </div>
    </BrowserRouter>
  );
}

export default App;
