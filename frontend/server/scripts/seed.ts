import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/User';
import Course from '../models/Course';
import Interview from '../models/Interview';
import Enrollment from '../models/Enrollment';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Interview.deleteMany({});
    await Enrollment.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'Alex Johnson',
        email: 'student@example.com',
        password: 'password123',
        userType: 'student',
        isVerified: true,
        profile: {
          bio: 'Computer Science student passionate about AI and full-stack development.',
          university: 'IIT Delhi',
          skills: ['JavaScript', 'Python', 'React', 'Node.js'],
          socialLinks: {
            linkedin: 'https://linkedin.com/in/alexjohnson',
            github: 'https://github.com/alexjohnson'
          }
        },
        stats: {
          coursesEnrolled: 3,
          coursesCompleted: 1,
          totalLearningHours: 45,
          interviewsCompleted: 5,
          averageScore: 78
        },
        leetcodeProfile: {
          username: 'alexcoder',
          totalSolved: 450,
          easy: 180,
          medium: 220,
          hard: 50,
          ranking: 145000,
          acceptanceRate: 65.2,
          streak: 15,
          contestRating: 1654
        }
      },
      {
        name: 'Dr. Sarah Chen',
        email: 'tutor@example.com',
        password: 'password123',
        userType: 'tutor',
        isVerified: true,
        profile: {
          bio: 'Former Google AI researcher with 10+ years in EdTech. Passionate about making AI education accessible.',
          university: 'Stanford University',
          experience: '10+ years in AI/ML and EdTech',
          skills: ['Machine Learning', 'Python', 'TensorFlow', 'Teaching', 'Research'],
          socialLinks: {
            linkedin: 'https://linkedin.com/in/sarahchen',
            twitter: 'https://twitter.com/sarahchen'
          }
        }
      },
      {
        name: 'Maria Garcia',
        email: 'maria@example.com',
        password: 'password123',
        userType: 'student',
        isVerified: true,
        profile: {
          bio: 'Aspiring software engineer with a focus on web development and system design.',
          university: 'BITS Pilani',
          skills: ['Java', 'Spring Boot', 'React', 'MongoDB'],
        },
        stats: {
          coursesEnrolled: 2,
          coursesCompleted: 2,
          totalLearningHours: 67,
          interviewsCompleted: 8,
          averageScore: 85
        }
      }
    ]);

    console.log('👥 Created sample users');

    // Create sample courses
    const courses = await Course.create([
      {
        title: 'Complete Data Structures & Algorithms',
        description: 'Master DSA with hands-on coding practice and real interview questions.',
        instructor: users[1]._id, // Dr. Sarah Chen
        category: 'CSE Core',
        domain: 'dsa',
        level: 'intermediate',
        duration: 40,
        price: 4999,
        thumbnail: 'https://example.com/dsa-course.jpg',
        status: 'published',
        syllabus: [
          {
            title: 'Arrays and Strings',
            description: 'Master array manipulation and string algorithms',
            duration: 120,
            resources: ['Video lectures', 'Practice problems', 'Code examples']
          },
          {
            title: 'Linked Lists',
            description: 'Understand pointer manipulation and linked list operations',
            duration: 90,
            resources: ['Interactive demos', 'Coding exercises']
          },
          {
            title: 'Trees and Graphs',
            description: 'Explore tree traversals and graph algorithms',
            duration: 150,
            resources: ['Visual algorithms', 'Problem sets']
          }
        ],
        tags: ['DSA', 'Algorithms', 'Interview Prep', 'Coding'],
        requirements: ['Basic programming knowledge', 'Familiarity with any programming language'],
        learningOutcomes: [
          'Solve complex algorithmic problems',
          'Ace technical interviews',
          'Understand time and space complexity'
        ],
        ratings: {
          average: 4.8,
          count: 156,
          distribution: { 5: 120, 4: 30, 3: 5, 2: 1, 1: 0 }
        },
        enrollment: { current: 234, capacity: 500 },
        analytics: {
          views: 1500,
          completionRate: 78,
          averageRating: 4.8,
          totalRevenue: 1169766
        }
      },
      {
        title: 'System Design Masterclass',
        description: 'Learn to design scalable systems like Netflix, Uber, and WhatsApp.',
        instructor: users[1]._id,
        category: 'CSE Core',
        domain: 'system-design',
        level: 'advanced',
        duration: 35,
        price: 6999,
        thumbnail: 'https://example.com/system-design.jpg',
        status: 'published',
        syllabus: [
          {
            title: 'System Design Fundamentals',
            description: 'Scalability, reliability, and availability concepts',
            duration: 90,
            resources: ['Theory videos', 'Case studies']
          },
          {
            title: 'Database Design',
            description: 'SQL vs NoSQL, database sharding, and replication',
            duration: 120,
            resources: ['Practical examples', 'Design exercises']
          }
        ],
        tags: ['System Design', 'Scalability', 'Architecture'],
        requirements: ['Programming experience', 'Basic database knowledge'],
        learningOutcomes: [
          'Design large-scale systems',
          'Understand distributed systems',
          'Excel in system design interviews'
        ],
        ratings: {
          average: 4.9,
          count: 89,
          distribution: { 5: 78, 4: 9, 3: 2, 2: 0, 1: 0 }
        },
        enrollment: { current: 156, capacity: 300 }
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Start your AI journey with practical machine learning concepts and implementations.',
        instructor: users[1]._id,
        category: 'AI & ML',
        domain: 'ml',
        level: 'beginner',
        duration: 45,
        price: 7999,
        thumbnail: 'https://example.com/ml-course.jpg',
        status: 'published',
        syllabus: [
          {
            title: 'Introduction to ML',
            description: 'Supervised, unsupervised, and reinforcement learning',
            duration: 60,
            resources: ['Video content', 'Jupyter notebooks']
          },
          {
            title: 'Linear Regression',
            description: 'First ML algorithm with practical implementation',
            duration: 90,
            resources: ['Code examples', 'Datasets']
          }
        ],
        tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
        requirements: ['Basic Python knowledge', 'High school mathematics'],
        learningOutcomes: [
          'Understand ML concepts',
          'Build ML models',
          'Work with real datasets'
        ],
        ratings: {
          average: 4.7,
          count: 67,
          distribution: { 5: 45, 4: 18, 3: 4, 2: 0, 1: 0 }
        },
        enrollment: { current: 89, capacity: 200 }
      }
    ]);

    console.log('📚 Created sample courses');

    // Create sample enrollments
    await Enrollment.create([
      {
        student: users[0]._id, // Alex Johnson
        course: courses[0]._id, // DSA course
        status: 'in-progress',
        progress: {
          completedLessons: 26,
          totalLessons: 40,
          completionPercentage: 65,
          currentLesson: 27,
          timeSpent: 1200
        },
        performance: {
          averageScore: 78,
          quizScores: [
            { lessonId: 1, score: 85, completedAt: new Date() },
            { lessonId: 2, score: 72, completedAt: new Date() }
          ]
        },
        analytics: {
          totalTimeSpent: 1200,
          sessionsCount: 15,
          streakDays: 7,
          engagementScore: 85
        },
        paymentInfo: {
          amount: 4999,
          paymentMethod: 'credit_card',
          transactionId: 'txn_' + Date.now(),
          paidAt: new Date()
        }
      },
      {
        student: users[2]._id, // Maria Garcia
        course: courses[1]._id, // System Design course
        status: 'completed',
        progress: {
          completedLessons: 25,
          totalLessons: 25,
          completionPercentage: 100,
          timeSpent: 2100
        },
        performance: {
          averageScore: 92
        },
        analytics: {
          totalTimeSpent: 2100,
          sessionsCount: 20,
          streakDays: 12,
          engagementScore: 95
        },
        feedback: {
          rating: 5,
          review: 'Excellent course! Really helped me understand system design concepts.',
          reviewedAt: new Date()
        },
        certificate: {
          issued: true,
          issuedAt: new Date(),
          certificateId: 'cert_' + Date.now()
        },
        paymentInfo: {
          amount: 6999,
          paymentMethod: 'upi',
          transactionId: 'txn_' + Date.now(),
          paidAt: new Date()
        }
      }
    ]);

    console.log('📝 Created sample enrollments');

    // Create sample interviews
    await Interview.create([
      {
        student: users[0]._id, // Alex Johnson
        type: 'technical',
        domain: 'dsa',
        difficulty: 'medium',
        duration: 45,
        status: 'completed',
        questions: [
          {
            question: 'Implement a function to reverse a linked list',
            type: 'technical',
            domain: 'dsa',
            difficulty: 'medium',
            timeAllotted: 900,
            userAnswer: 'I would use three pointers: prev, current, and next...',
            score: 85,
            feedback: 'Good understanding of the algorithm, clear explanation',
            answeredAt: new Date()
          }
        ],
        aiAnalysis: {
          overallScore: 82,
          technicalScore: 85,
          communicationScore: 78,
          confidenceLevel: 80,
          breakdown: {
            clarity: 85,
            completeness: 80,
            correctness: 88,
            problemSolving: 82
          },
          proctoring: {
            eyeTracking: 88,
            faceDetection: 95,
            attentiveness: 85,
            backgroundNoise: 10,
            speechClarity: 90,
            suspiciousActivity: false,
            environmentScore: 92
          },
          emotions: {
            confidence: 80,
            stress: 25,
            engagement: 90,
            frustration: 15
          },
          recommendations: [
            'Practice explaining solutions more clearly',
            'Work on edge case handling'
          ],
          strengths: ['Strong algorithmic thinking', 'Good problem-solving approach'],
          improvements: ['Communication clarity', 'Time management']
        },
        results: {
          totalScore: 82,
          passStatus: 'pass',
          percentile: 75,
          timePerQuestion: 12.5,
          completionRate: 100
        },
        feedback: {
          avatarFeedback: 'Great job on the technical aspects! Work on explaining your thought process more clearly.',
          detailedReport: 'Strong performance overall with room for improvement in communication.',
          nextSteps: [
            'Practice mock interviews',
            'Focus on explanation skills'
          ],
          practiceAreas: ['Communication', 'Time management']
        },
        scheduledAt: new Date(Date.now() - 86400000), // Yesterday
        startedAt: new Date(Date.now() - 86400000 + 1800000), // 30 min later
        completedAt: new Date(Date.now() - 86400000 + 4500000) // 75 min later
      }
    ]);

    console.log('🎤 Created sample interviews');

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('Sample users created:');
    console.log('📧 Student: student@example.com (password: password123)');
    console.log('📧 Tutor: tutor@example.com (password: password123)');
    console.log('📧 Student 2: maria@example.com (password: password123)');
    console.log('');
    console.log('🚀 You can now start the server and test the API endpoints!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();
