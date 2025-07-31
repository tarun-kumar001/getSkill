import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped' | 'paused';
  
  progress: {
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
    currentLesson?: number;
    timeSpent: number; // in minutes
    lastAccessedAt?: Date;
  };

  performance: {
    averageScore: number;
    quizScores: {
      lessonId: number;
      score: number;
      completedAt: Date;
    }[];
    assignmentScores: {
      assignmentId: string;
      score: number;
      submittedAt: Date;
    }[];
  };

  analytics: {
    totalTimeSpent: number;
    averageSessionTime: number;
    sessionsCount: number;
    streakDays: number;
    lastActiveDate: Date;
    engagementScore: number;
  };

  feedback: {
    rating?: number;
    review?: string;
    reviewedAt?: Date;
  };

  certificate?: {
    issued: boolean;
    issuedAt?: Date;
    certificateUrl?: string;
    certificateId?: string;
  };

  paymentInfo: {
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paidAt: Date;
    refunded?: boolean;
    refundedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  startedAt: Date,
  completedAt: Date,
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed', 'dropped', 'paused'],
    default: 'enrolled'
  },
  
  progress: {
    completedLessons: {
      type: Number,
      default: 0,
      min: 0
    },
    totalLessons: {
      type: Number,
      default: 0,
      min: 0
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    currentLesson: {
      type: Number,
      min: 0
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    lastAccessedAt: Date
  },

  performance: {
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    quizScores: [{
      lessonId: {
        type: Number,
        required: true
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    assignmentScores: [{
      assignmentId: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      submittedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  analytics: {
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    averageSessionTime: {
      type: Number,
      default: 0,
      min: 0
    },
    sessionsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    streakDays: {
      type: Number,
      default: 0,
      min: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },

  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    reviewedAt: Date
  },

  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateUrl: String,
    certificateId: String
  },

  paymentInfo: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true
    },
    paidAt: {
      type: Date,
      default: Date.now
    },
    refunded: {
      type: Boolean,
      default: false
    },
    refundedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
EnrollmentSchema.index({ student: 1 });
EnrollmentSchema.index({ course: 1 });
EnrollmentSchema.index({ status: 1 });
EnrollmentSchema.index({ enrolledAt: -1 });
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Calculate completion percentage when progress is updated
EnrollmentSchema.pre('save', function(next) {
  if (this.progress.totalLessons > 0) {
    this.progress.completionPercentage = Math.round(
      (this.progress.completedLessons / this.progress.totalLessons) * 100
    );
  }

  // Update status based on progress
  if (this.progress.completionPercentage === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.progress.completedLessons > 0 && this.status === 'enrolled') {
    this.status = 'in-progress';
    this.startedAt = new Date();
  }

  next();
});

// Calculate average score from quiz and assignment scores
EnrollmentSchema.methods.calculateAverageScore = function() {
  const allScores = [
    ...this.performance.quizScores.map((q: any) => q.score),
    ...this.performance.assignmentScores.map((a: any) => a.score)
  ];

  if (allScores.length === 0) return 0;

  const total = allScores.reduce((sum: number, score: number) => sum + score, 0);
  return Math.round(total / allScores.length);
};

// Update analytics when student accesses course
EnrollmentSchema.methods.updateAnalytics = function(sessionTime: number) {
  this.analytics.totalTimeSpent += sessionTime;
  this.analytics.sessionsCount += 1;
  this.analytics.averageSessionTime = Math.round(
    this.analytics.totalTimeSpent / this.analytics.sessionsCount
  );
  this.analytics.lastActiveDate = new Date();
  this.progress.lastAccessedAt = new Date();

  return this.save();
};

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
