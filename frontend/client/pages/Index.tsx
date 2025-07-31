import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Code, 
  Database, 
  FileCheck, 
  GraduationCap, 
  MessageSquare, 
  Play, 
  Star, 
  Users, 
  Zap,
  Calendar,
  Target,
  CheckCircle
} from "lucide-react";

export default function Index() {
  const courseCategories = [
    {
      title: "Programming",
      description: "Master coding fundamentals and advanced algorithms",
      icon: <Code className="w-6 h-6" />,
      courses: 156,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Data Science",
      description: "Learn data analysis, ML, and AI technologies",
      icon: <Database className="w-6 h-6" />,
      courses: 89,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Interview Prep",
      description: "Ace technical interviews with AI-powered practice",
      icon: <MessageSquare className="w-6 h-6" />,
      courses: 67,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "System Design",
      description: "Build scalable systems and architectures",
      icon: <Users className="w-6 h-6" />,
      courses: 43,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const featuredCourses = [
    {
      title: "Complete Data Structures & Algorithms",
      tutor: "Dr. Sarah Chen",
      rating: 4.9,
      students: 12847,
      price: 49.99,
      level: "Intermediate",
      duration: "40 hours"
    },
    {
      title: "System Design Masterclass",
      tutor: "Alex Rodriguez",
      rating: 4.8,
      students: 8956,
      price: 79.99,
      level: "Advanced",
      duration: "32 hours"
    },
    {
      title: "Machine Learning Fundamentals",
      tutor: "Prof. Kumar Patel",
      rating: 4.9,
      students: 15632,
      price: 59.99,
      level: "Beginner",
      duration: "48 hours"
    }
  ];

  const aiFeatures = [
    {
      title: "AI Resume ATS Checker",
      description: "Get instant feedback on your resume's ATS compatibility and optimize for job applications",
      icon: <FileCheck className="w-8 h-8" />,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "AI Mock Interviews",
      description: "Practice with AI-powered interviews tailored to your target role and get real-time feedback",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Smart Learning Path",
      description: "AI analyzes your skills and creates personalized learning paths for maximum growth",
      icon: <Target className="w-8 h-8" />,
      gradient: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
              🚀 AI-Powered Learning Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
              Master Skills That
              <br />
              <span className="text-purple-600">Get You Hired</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn from industry experts, practice with AI-powered tools, and land your dream job. 
              Join thousands of students who've transformed their careers with GETSKILL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>
              <Link to="/ai-tools">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Try AI Tools Free
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              AI-Powered Learning Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of education with our advanced AI tools designed to accelerate your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-gray-200">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/ai-tools">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Explore AI Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Explore Learning Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of courses designed by industry experts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200 bg-white">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${category.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {category.courses} Courses
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with our most popular courses trusted by thousands of learners
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Play className="w-12 h-12 text-purple-600" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-100 text-purple-700">
                      {course.level}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight text-gray-900">{course.title}</CardTitle>
                  <p className="text-sm text-gray-500">by {course.tutor}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.students.toLocaleString()} students</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      ${course.price}
                    </span>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful learners who've landed their dream jobs with GETSKILL. 
              Start your journey today with our AI-powered learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/live-classes">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Live Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
