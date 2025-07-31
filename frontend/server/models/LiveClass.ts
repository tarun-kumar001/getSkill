import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveClass extends Document {
  title: string;
  description?: string;
  tutor: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  maxParticipants: number;
  settings: {
    recordingEnabled: boolean;
    cameraRequired: boolean;
    microphoneRequired: boolean;
    attendanceThreshold: number; // percentage of class duration required for attendance
    allowLateJoin: boolean;
    autoMuteOnJoin: boolean;
    enableChat: boolean;
    enableScreenShare: boolean;
    enableWhiteboard: boolean;
    enablePolls: boolean;
  };
  roomId: string; // WebRTC room identifier
  accessToken?: string; // for secure room access
  resources: [{
    type: 'document' | 'link' | 'video';
    title: string;
    url: string;
    uploadedAt: Date;
  }];
  polls: [{
    question: string;
    options: string[];
    isActive: boolean;
    responses: [{
      user: mongoose.Types.ObjectId;
      answer: number; // index of selected option
      timestamp: Date;
    }];
    createdAt: Date;
  }];
  whiteboardData?: any; // JSON data for whiteboard state
  recordingUrl?: string;
  metadata: {
    totalParticipants: number;
    peakConcurrentUsers: number;
    averageAttendanceDuration: number;
    totalMessages: number;
    pollsCreated: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Class title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tutor is required']
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  scheduledStartTime: {
    type: Date,
    required: [true, 'Scheduled start time is required']
  },
  scheduledEndTime: {
    type: Date,
    required: [true, 'Scheduled end time is required']
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  maxParticipants: {
    type: Number,
    default: 50,
    min: [1, 'At least 1 participant is required'],
    max: [500, 'Maximum 500 participants allowed']
  },
  settings: {
    recordingEnabled: {
      type: Boolean,
      default: false
    },
    cameraRequired: {
      type: Boolean,
      default: false
    },
    microphoneRequired: {
      type: Boolean,
      default: false
    },
    attendanceThreshold: {
      type: Number,
      default: 80, // 80% of class duration
      min: [0, 'Threshold cannot be negative'],
      max: [100, 'Threshold cannot exceed 100%']
    },
    allowLateJoin: {
      type: Boolean,
      default: true
    },
    autoMuteOnJoin: {
      type: Boolean,
      default: true
    },
    enableChat: {
      type: Boolean,
      default: true
    },
    enableScreenShare: {
      type: Boolean,
      default: true
    },
    enableWhiteboard: {
      type: Boolean,
      default: true
    },
    enablePolls: {
      type: Boolean,
      default: true
    }
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  accessToken: {
    type: String
  },
  resources: [{
    type: {
      type: String,
      enum: ['document', 'link', 'video'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  polls: [{
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      type: String,
      required: true,
      trim: true
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    responses: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      answer: {
        type: Number,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  whiteboardData: {
    type: Schema.Types.Mixed
  },
  recordingUrl: {
    type: String
  },
  metadata: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    peakConcurrentUsers: {
      type: Number,
      default: 0
    },
    averageAttendanceDuration: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    pollsCreated: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
LiveClassSchema.index({ tutor: 1, scheduledStartTime: 1 });
LiveClassSchema.index({ course: 1, scheduledStartTime: 1 });
LiveClassSchema.index({ status: 1, scheduledStartTime: 1 });
LiveClassSchema.index({ roomId: 1 });
LiveClassSchema.index({ scheduledStartTime: 1, scheduledEndTime: 1 });

// Validate that end time is after start time
LiveClassSchema.pre('save', function(next) {
  if (this.scheduledEndTime <= this.scheduledStartTime) {
    next(new Error('Scheduled end time must be after start time'));
  }
  
  if (this.actualEndTime && this.actualStartTime && this.actualEndTime <= this.actualStartTime) {
    next(new Error('Actual end time must be after actual start time'));
  }
  
  next();
});

// Generate unique room ID if not provided
LiveClassSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

export default mongoose.model<ILiveClass>('LiveClass', LiveClassSchema);
