import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  userType: 'student' | 'tutor';
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  isVerified: boolean;
  isActive: boolean;
  profile: {
    bio?: string;
    university?: string;
    experience?: string;
    skills: string[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      leetcode?: string;
      codeforces?: string;
    };
    resume?: {
      fileName: string;
      fileUrl: string;
      uploadedAt: Date;
    };
    careerGoals?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    theme: 'light' | 'dark';
    language: string;
    interviewSettings?: {
      language: string;
      domain: string[];
    };
  };
  security: {
    twoFactorEnabled: boolean;
    loginHistory: {
      ip: string;
      device: string;
      location?: string;
      timestamp: Date;
    }[];
  };
  tutorSettings?: {
    availability: {
      days: string[];
      timeSlots: {
        start: string;
        end: string;
      }[];
    };
    classPreferences: {
      autoRecord: boolean;
      maxStudents: number;
    };
    payoutInfo?: {
      method: string;
      details: any;
    };
  };
  stats: {
    coursesEnrolled: number;
    coursesCompleted: number;
    totalLearningHours: number;
    interviewsCompleted: number;
    averageScore: number;
  };
  leetcodeProfile?: {
    username: string;
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    ranking: number;
    acceptanceRate: number;
    streak: number;
    contestRating: number;
  };
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  userType: {
    type: String,
    enum: ['student', 'tutor'],
    required: [true, 'User type is required']
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    university: {
      type: String,
      maxlength: [100, 'University name cannot exceed 100 characters']
    },
    experience: {
      type: String,
      maxlength: [200, 'Experience cannot exceed 200 characters']
    },
    skills: [{
      type: String,
      trim: true
    }],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      leetcode: String,
      codeforces: String
    },
    resume: {
      fileName: String,
      fileUrl: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    careerGoals: {
      type: String,
      maxlength: [500, 'Career goals cannot exceed 500 characters']
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    },
    interviewSettings: {
      language: {
        type: String,
        default: 'JavaScript'
      },
      domain: [{
        type: String,
        enum: ['DSA', 'System Design', 'Frontend', 'Backend', 'Database', 'ML']
      }]
    }
  },
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    loginHistory: [{
      ip: String,
      device: String,
      location: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  tutorSettings: {
    availability: {
      days: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }],
      timeSlots: [{
        start: String,
        end: String
      }]
    },
    classPreferences: {
      autoRecord: {
        type: Boolean,
        default: false
      },
      maxStudents: {
        type: Number,
        default: 30
      }
    },
    payoutInfo: {
      method: String,
      details: Schema.Types.Mixed
    }
  },
  stats: {
    coursesEnrolled: {
      type: Number,
      default: 0
    },
    coursesCompleted: {
      type: Number,
      default: 0
    },
    totalLearningHours: {
      type: Number,
      default: 0
    },
    interviewsCompleted: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
  },
  leetcodeProfile: {
    username: String,
    totalSolved: {
      type: Number,
      default: 0
    },
    easy: {
      type: Number,
      default: 0
    },
    medium: {
      type: Number,
      default: 0
    },
    hard: {
      type: Number,
      default: 0
    },
    ranking: {
      type: Number,
      default: 0
    },
    acceptanceRate: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    contestRating: {
      type: Number,
      default: 0
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'security.loginHistory.timestamp': -1 });
UserSchema.index({ phone: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update lastActive on any update
UserSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
  this.set({ lastActive: new Date() });
});

export default mongoose.model<IUser>('User', UserSchema);
