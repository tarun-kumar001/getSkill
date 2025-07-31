import mongoose, { Document, Schema } from 'mongoose';

export interface IInterview extends Document {
  student: mongoose.Types.ObjectId;
  type: 'technical' | 'behavioral' | 'mixed' | 'group';
  domain?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  
  questions: {
    question: string;
    type: 'technical' | 'behavioral';
    domain?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    expectedAnswer?: string;
    timeAllotted: number; // in seconds
    userAnswer?: string;
    audioRecording?: string;
    videoRecording?: string;
    transcript?: string;
    score: number;
    feedback: string;
    answeredAt?: Date;
  }[];

  aiAnalysis: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    confidenceLevel: number;
    
    breakdown: {
      clarity: number;
      completeness: number;
      correctness: number;
      problemSolving: number;
      codeQuality?: number;
    };

    proctoring: {
      eyeTracking: number;
      faceDetection: number;
      attentiveness: number;
      backgroundNoise: number;
      speechClarity: number;
      suspiciousActivity: boolean;
      environmentScore: number;
    };

    emotions: {
      confidence: number;
      stress: number;
      engagement: number;
      frustration: number;
    };

    recommendations: string[];
    strengths: string[];
    improvements: string[];
  };

  results: {
    totalScore: number;
    passStatus: 'pass' | 'fail' | 'borderline';
    percentile: number;
    timePerQuestion: number;
    completionRate: number;
    
    suggestedCourses: {
      courseId: mongoose.Types.ObjectId;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };

  feedback: {
    avatarFeedback: string;
    detailedReport: string;
    nextSteps: string[];
    practiceAreas: string[];
  };

  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'mixed', 'group'],
    required: [true, 'Interview type is required']
  },
  domain: {
    type: String,
    enum: ['dsa', 'dbms', 'os', 'cn', 'ml', 'webdev', 'system-design'],
    required: function(this: IInterview) {
      return this.type === 'technical' || this.type === 'mixed';
    }
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [120, 'Duration cannot exceed 120 minutes']
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['technical', 'behavioral'],
      required: true
    },
    domain: {
      type: String,
      enum: ['dsa', 'dbms', 'os', 'cn', 'ml', 'webdev', 'system-design']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    expectedAnswer: String,
    timeAllotted: {
      type: Number,
      required: true,
      min: 60, // minimum 1 minute
      max: 1800 // maximum 30 minutes
    },
    userAnswer: String,
    audioRecording: String,
    videoRecording: String,
    transcript: String,
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    feedback: String,
    answeredAt: Date
  }],

  aiAnalysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    technicalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    communicationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    confidenceLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    
    breakdown: {
      clarity: { type: Number, min: 0, max: 100, default: 0 },
      completeness: { type: Number, min: 0, max: 100, default: 0 },
      correctness: { type: Number, min: 0, max: 100, default: 0 },
      problemSolving: { type: Number, min: 0, max: 100, default: 0 },
      codeQuality: { type: Number, min: 0, max: 100 }
    },

    proctoring: {
      eyeTracking: { type: Number, min: 0, max: 100, default: 0 },
      faceDetection: { type: Number, min: 0, max: 100, default: 0 },
      attentiveness: { type: Number, min: 0, max: 100, default: 0 },
      backgroundNoise: { type: Number, min: 0, max: 100, default: 0 },
      speechClarity: { type: Number, min: 0, max: 100, default: 0 },
      suspiciousActivity: { type: Boolean, default: false },
      environmentScore: { type: Number, min: 0, max: 100, default: 0 }
    },

    emotions: {
      confidence: { type: Number, min: 0, max: 100, default: 0 },
      stress: { type: Number, min: 0, max: 100, default: 0 },
      engagement: { type: Number, min: 0, max: 100, default: 0 },
      frustration: { type: Number, min: 0, max: 100, default: 0 }
    },

    recommendations: [String],
    strengths: [String],
    improvements: [String]
  },

  results: {
    totalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    passStatus: {
      type: String,
      enum: ['pass', 'fail', 'borderline'],
      default: 'fail'
    },
    percentile: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timePerQuestion: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    
    suggestedCourses: [{
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      },
      reason: {
        type: String,
        required: true
      },
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
      }
    }]
  },

  feedback: {
    avatarFeedback: String,
    detailedReport: String,
    nextSteps: [String],
    practiceAreas: [String]
  },

  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled time is required']
  },
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
InterviewSchema.index({ student: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ type: 1 });
InterviewSchema.index({ domain: 1 });
InterviewSchema.index({ scheduledAt: 1 });
InterviewSchema.index({ createdAt: -1 });
InterviewSchema.index({ 'results.totalScore': -1 });

// Calculate overall score based on questions
InterviewSchema.methods.calculateOverallScore = function() {
  if (this.questions.length === 0) return 0;
  
  const totalScore = this.questions.reduce((sum: number, q: any) => sum + q.score, 0);
  return Math.round(totalScore / this.questions.length);
};

// Update completion status
InterviewSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

export default mongoose.model<IInterview>('Interview', InterviewSchema);
