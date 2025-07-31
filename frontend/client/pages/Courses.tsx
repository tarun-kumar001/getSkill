import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search,
  Star, 
  Clock, 
  Users, 
  Play,
  Filter,
  BookOpen,
  Code,
  Database,
  MessageSquare,
  Target
} from "lucide-react";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const courses = [
    {
      id: 1,
      title: "Complete Data Structures & Algorithms",
      instructor: "Dr. Sarah Chen",
      rating: 4.9,
      students: 12847,
      duration: "40 hours",
      level: "Intermediate",
      price: 49.99,
      domain: "Programming",
      description: "Master DSA concepts with practical implementations in Python and Java.",
      skills: ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming"],
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 2,
      title: "System Design Masterclass",
      instructor: "Alex Rodriguez",
      rating: 4.8,
      students: 8956,
      duration: "32 hours",
      level: "Advanced",
      price: 79.99,
      domain: "Programming",
      description: "Learn to design scalable systems like Netflix, Uber, and Amazon.",
      skills: ["Load Balancing", "Microservices", "Databases", "Caching", "Distributed Systems"],
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      instructor: "Prof. Kumar Patel",
      rating: 4.9,
      students: 15632,
      duration: "48 hours",
      level: "Beginner",
      price: 59.99,
      domain: "Data Science",
      description: "Start your ML journey with practical projects and real-world applications.",
      skills: ["Python", "Scikit-learn", "Pandas", "NumPy", "Model Evaluation"],
      icon: <Database className="w-6 h-6" />
    },
    {
      id: 4,
      title: "Interview Preparation Bootcamp",
      instructor: "Sarah Johnson",
      rating: 4.7,
      students: 9876,
      duration: "24 hours",
      level: "Intermediate",
      price: 39.99,
      domain: "Interview Prep",
      description: "Comprehensive interview preparation for top tech companies.",
      skills: ["Coding Questions", "System Design", "Behavioral", "Mock Interviews"],
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      id: 5,
      title: "Full Stack Web Development",
      instructor: "Mike Chen",
      rating: 4.6,
      students: 11234,
      duration: "60 hours",
      level: "Beginner",
      price: 69.99,
      domain: "Programming",
      description: "Build modern web applications from frontend to backend.",
      skills: ["React", "Node.js", "MongoDB", "Express", "REST APIs"],
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 6,
      title: "Data Science with Python",
      instructor: "Dr. Emily Watson",
      rating: 4.8,
      students: 7543,
      duration: "45 hours",
      level: "Intermediate",
      price: 54.99,
      domain: "Data Science",
      description: "Analyze data and build predictive models using Python.",
      skills: ["Data Analysis", "Visualization", "Statistics", "Machine Learning", "Python"],
      icon: <Database className="w-6 h-6" />
    }
  ];

  const domains = [
    { value: "all", label: "All Domains" },
    { value: "Programming", label: "Programming" },
    { value: "Data Science", label: "Data Science" },
    { value: "Interview Prep", label: "Interview Prep" }
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDomain = selectedDomain === "all" || course.domain === selectedDomain;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesDomain && matchesLevel;
  });

  const handleEnroll = (courseId: number, courseTitle: string) => {
    // Simulate enrollment
    alert(`Successfully enrolled in "${courseTitle}"! You can access it from your dashboard.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Explore Our Courses</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from {courses.length} expertly designed courses to advance your career
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses, instructors, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map(domain => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                      {course.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight mb-2">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {course.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="mb-4 leading-relaxed">
                    {course.description}
                  </CardDescription>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">What you'll learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">
                        ${course.price}
                      </span>
                    </div>
                    <Button 
                      onClick={() => handleEnroll(course.id, course.title)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all courses
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDomain("all");
                  setSelectedLevel("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
