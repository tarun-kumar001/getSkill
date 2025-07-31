import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  price: number;
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  syllabus: {
    title: string;
    description: string;
    duration: number; // in minutes
    resources: string[];
    isCompleted?: boolean;
  }[];
  tags: string[];
  requirements: string[];
  learningOutcomes: string[];
  ratings: {
    average: number;
    count: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  enrollment: {
    current: number;
    capacity: number;
  };
  analytics: {
    views: number;
    completionRate: number;
    averageRating: number;
    totalRevenue: number;
  };
  liveClasses: [{
    title: string;
    scheduledAt: Date;
    duration: number;
    meetingUrl?: string;
    attendees: mongoose.Types.ObjectId[];
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  }];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['CSE Core', 'AI & ML', 'Career Skills', 'Programming', 'System Design', 'Interview Prep']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: ['dsa', 'dbms', 'os', 'cn', 'ml', 'webdev', 'system-design', 'career']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Level is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 hour']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  syllabus: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    resources: [String],
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  enrollment: {
    current: {
      type: Number,
      default: 0
    },
    capacity: {
      type: Number,
      default: 100
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  liveClasses: [{
    title: {
      type: String,
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    meetingUrl: String,
    attendees: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ domain: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ 'ratings.average': -1 });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ title: 'text', description: 'text' });

// Update analytics when course is viewed
CourseSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

export default mongoose.model<ICourse>('Course', CourseSchema);
