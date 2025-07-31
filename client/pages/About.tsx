import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  Users,
  Zap,
  Brain,
  Target,
  Award,
  BookOpen,
  Video,
  Calendar,
  Code,
  Database,
  Globe,
  Cpu,
  MessageSquare,
  FileText,
  BarChart3,
  Heart,
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Shield,
  Rocket,
  Building,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Eye,
  Lightbulb,
  Handshake,
  Trophy,
  ChevronRight,
  Quote,
  Camera,
  Mic,
  Activity,
  PieChart,
  Monitor,
  Smartphone,
  Laptop
} from "lucide-react";

// Counter component for animated statistics
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * (end - startCount) + startCount);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

export default function About() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Team data
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & CEO",
      bio: "Former Google AI researcher with 10+ years in EdTech. PhD in Computer Science from Stanford.",
      avatar: "SC",
      skills: ["AI/ML", "Product Strategy", "Education"],
      social: { linkedin: "#", twitter: "#", email: "sarah@getskill.com" }
    },
    {
      name: "Alex Rodriguez",
      role: "CTO & Co-founder",
      bio: "Ex-Microsoft engineer, specialist in scalable learning platforms and real-time systems.",
      avatar: "AR",
      skills: ["System Design", "DevOps", "Backend"],
      social: { linkedin: "#", github: "#", email: "alex@getskill.com" }
    },
    {
      name: "Dr. Priya Sharma",
      role: "Head of AI Research",
      bio: "Leading expert in personalized learning algorithms and natural language processing.",
      avatar: "PS",
      skills: ["AI Research", "NLP", "Data Science"],
      social: { linkedin: "#", twitter: "#", email: "priya@getskill.com" }
    },
    {
      name: "Michael Park",
      role: "Head of Content",
      bio: "Former Netflix content strategist, now revolutionizing educational content delivery.",
      avatar: "MP",
      skills: ["Content Strategy", "Video Production", "UX"],
      social: { linkedin: "#", email: "michael@getskill.com" }
    }
  ];

  // Course offerings
  const offerings = [
    {
      category: "CSE Core Subjects",
      icon: <Code className="w-6 h-6" />,
      courses: ["Data Structures & Algorithms", "Operating Systems", "Database Management", "Computer Networks", "System Design"],
      color: "from-blue-500 to-cyan-500",
      count: "12+ Courses"
    },
    {
      category: "AI & Machine Learning",
      icon: <Brain className="w-6 h-6" />,
      courses: ["Machine Learning Fundamentals", "Deep Learning", "Natural Language Processing", "Computer Vision", "AI Ethics"],
      color: "from-purple-500 to-pink-500",
      count: "8+ Courses"
    },
    {
      category: "Career & Soft Skills",
      icon: <Users className="w-6 h-6" />,
      courses: ["Technical Interview Prep", "Resume Building", "Communication Skills", "Leadership", "Project Management"],
      color: "from-green-500 to-emerald-500",
      count: "15+ Courses"
    },
    {
      category: "AI-Powered Tools",
      icon: <Zap className="w-6 h-6" />,
      courses: ["Resume ATS Checker", "Mock Interview AI", "Coding Assistant", "Learning Path Generator", "Progress Analytics"],
      color: "from-yellow-500 to-orange-500",
      count: "10+ Tools"
    }
  ];

  // Key features
  const keyFeatures = [
    {
      title: "AI-Based Interview Practice",
      description: "Practice with our advanced AI interviewer avatar that provides real-time feedback and coaching.",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Resume ATS Score Checker",
      description: "Get instant ATS compatibility scores with personalized improvement recommendations.",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "LeetCode Integration",
      description: "Sync your coding progress and get personalized practice recommendations.",
      icon: <Code className="w-6 h-6" />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Live Classes with Experts",
      description: "Interactive live sessions with industry professionals and AI-powered assistance.",
      icon: <Video className="w-6 h-6" />,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Activity Tracking",
      description: "Calendar-based learning analytics to track your progress and maintain consistency.",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Dual Learning Portal",
      description: "Seamless experience for both students and tutors with role-specific dashboards.",
      icon: <Users className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Aman Singh",
      role: "Software Engineer at Google",
      university: "IIT Delhi",
      course: "Complete DSA & System Design",
      content: "GETSKILL's AI interview practice was a game-changer. The real-time feedback helped me crack my Google interview!",
      rating: 5,
      avatar: "AS",
      achievement: "₹45 LPA Package"
    },
    {
      name: "Sneha Patel",
      role: "ML Engineer at Microsoft",
      university: "BITS Pilani",
      course: "AI & Machine Learning Track",
      content: "The personalized learning path and LeetCode integration made my preparation so much more efficient. Highly recommend!",
      rating: 5,
      avatar: "SP",
      achievement: "₹38 LPA Package"
    },
    {
      name: "Rahul Kumar",
      role: "Full Stack Developer at Flipkart",
      university: "NIT Warangal",
      course: "Full Stack Development",
      content: "The live classes and resume checker were incredibly helpful. Landed my dream job within 3 months!",
      rating: 5,
      avatar: "RK",
      achievement: "₹28 LPA Package"
    },
    {
      name: "Kavya Reddy",
      role: "Data Scientist at Zomato",
      university: "IIIT Hyderabad",
      course: "Data Science & Analytics",
      content: "The AI-powered tools and expert mentorship provided exactly what I needed to transition into data science.",
      rating: 5,
      avatar: "KR",
      achievement: "₹32 LPA Package"
    }
  ];

  // Statistics
  const stats = [
    { label: "Students Enrolled", value: 25000, suffix: "+" },
    { label: "Courses Delivered", value: 150, suffix: "+" },
    { label: "Hours of Content", value: 12000, suffix: "+" },
    { label: "Mock Interviews", value: 50000, suffix: "+" },
    { label: "Expert Tutors", value: 200, suffix: "+" },
    { label: "Partner Companies", value: 85, suffix: "+" }
  ];

  // Partners
  const partners = [
    { name: "Google", logo: "G" },
    { name: "Microsoft", logo: "M" },
    { name: "Amazon", logo: "A" },
    { name: "Meta", logo: "F" },
    { name: "Netflix", logo: "N" },
    { name: "Spotify", logo: "S" },
    { name: "IIT Delhi", logo: "IIT" },
    { name: "BITS Pilani", logo: "BITS" }
  ];

  // Upcoming features
  const upcomingFeatures = [
    {
      title: "Community Forum",
      description: "Connect with peers, share knowledge, and get help from the community",
      icon: <MessageSquare className="w-5 h-5" />,
      eta: "Q2 2024"
    },
    {
      title: "Hackathon Platform",
      description: "Participate in coding challenges and showcase your skills",
      icon: <Trophy className="w-5 h-5" />,
      eta: "Q3 2024"
    },
    {
      title: "Certification Hub",
      description: "Earn industry-recognized certificates upon course completion",
      icon: <Award className="w-5 h-5" />,
      eta: "Q3 2024"
    },
    {
      title: "Job Matchmaking",
      description: "AI-powered job matching based on your skills and interests",
      icon: <Handshake className="w-5 h-5" />,
      eta: "Q4 2024"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Revolutionizing EdTech with AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              About GETSKILL
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              We're on a mission to democratize quality education through AI-powered learning, 
              making skill development accessible, personalized, and effective for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Join Our Community
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Born from the vision to bridge the gap between traditional education and industry demands, 
              GETSKILL combines cutting-edge AI technology with expert pedagogy to create transformative learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Our Story</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2023 by a team of AI researchers and education experts, GETSKILL was born out of a simple 
                  yet powerful observation: traditional education wasn't keeping pace with the rapidly evolving tech industry.
                </p>
                <p>
                  We saw brilliant students struggling with interviews, professionals lacking practical skills, and a 
                  disconnect between what was taught and what was needed. So we set out to build something different.
                </p>
                <p>
                  Today, we're proud to serve over 25,000 learners worldwide, combining the best of human expertise 
                  with AI-powered personalization to deliver results that matter.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center border-2 border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Vision</h4>
                <p className="text-sm text-gray-600">
                  A world where quality education is accessible to everyone, regardless of background or location.
                </p>
              </Card>
              <Card className="p-6 text-center border-2 border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Mission</h4>
                <p className="text-sm text-gray-600">
                  Empower learners with AI-driven, practical education that leads to real career success.
                </p>
              </Card>
              <Card className="p-6 text-center border-2 border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Values</h4>
                <p className="text-sm text-gray-600">
                  Innovation, accessibility, quality, and student-first approach in everything we do.
                </p>
              </Card>
              <Card className="p-6 text-center border-2 border-yellow-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm text-gray-600">
                  Constantly pushing boundaries with AI and technology to enhance learning outcomes.
                </p>
              </Card>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-12">Meet Our Team</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-purple-100 group-hover:border-purple-200 transition-colors">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {member.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-center gap-2">
                      {member.social.linkedin && (
                        <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.twitter && (
                        <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.github && (
                        <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive learning solutions designed to take you from beginner to industry-ready professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerings.map((offering, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${offering.color}`}></div>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${offering.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                    {offering.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{offering.category}</h3>
                  <Badge variant="secondary" className="mb-4">{offering.count}</Badge>
                  <ul className="space-y-2">
                    {offering.courses.map((course, courseIndex) => (
                      <li key={courseIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {course}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-purple-50 group-hover:text-purple-600 group-hover:border-purple-200">
                    Explore Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Features That Set Us Apart</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary tools and features powered by AI to accelerate your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-purple-200">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Student Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real students who transformed their careers with GETSKILL
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Quote className="w-8 h-8 text-purple-400" />
                </div>
                
                <div className="text-center">
                  <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-16 h-16 mb-4 border-4 border-purple-100">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
                        {testimonials[activeTestimonial].avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-purple-600 font-medium">{testimonials[activeTestimonial].role}</p>
                    <p className="text-gray-600">{testimonials[activeTestimonial].university}</p>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      {testimonials[activeTestimonial].achievement}
                    </Badge>
                  </div>

                  <div className="flex justify-center gap-1 mb-4">
                    {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm text-gray-500">
                    Course: {testimonials[activeTestimonial].course}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact in Numbers</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Every number represents a life changed, a dream achieved, and a future brightened
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborations & Partners Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Collaborations & Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by leading companies and institutions worldwide to provide quality education and career opportunities
            </p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer group"
              >
                <span className="font-bold text-lg md:text-xl text-gray-600 group-hover:text-gray-800">
                  {partner.logo}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              These collaborations enable us to provide real-world projects, internship opportunities, 
              and direct placement pathways for our students.
            </p>
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Handshake className="w-4 h-4 mr-2" />
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* What's Coming Next Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What's Coming Next?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exciting new features and programs in development to make your learning experience even better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-purple-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    {feature.eta}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Rocket className="w-4 h-4 mr-2" />
              Get Early Access
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of successful students who have already transformed their careers with GETSKILL. 
            Your journey to success starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/live-classes">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Calendar className="w-5 h-5 mr-2" />
                Book a Live Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="w-5 h-5 mr-2" />
              Talk to a Mentor
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm opacity-75 mb-4">Connect with us</p>
            <div className="flex justify-center gap-4">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Mail className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                <Github className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Bangalore, India
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                hello@getskill.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 9876543210
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
