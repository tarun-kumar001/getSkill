import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  liveClass: mongoose.Types.ObjectId;
  joinedAt: Date;
  leftAt?: Date;
  totalDuration: number; // in minutes
  attendancePercentage: number;
  status: 'present' | 'absent' | 'late' | 'left_early';
  deviceInfo: {
    userAgent: string;
    platform: string;
    browser: string;
  };
  participationMetrics: {
    cameraOnDuration: number; // minutes with camera on
    microphoneOnDuration: number; // minutes with microphone on
    messagesPosted: number;
    pollsParticipated: number;
    handsRaised: number;
    screenTimeActive: number; // minutes with active screen/window focus
    whiteboardInteractions: number;
  };
  technicalIssues: [{
    type: 'camera_off' | 'mic_off' | 'connection_lost' | 'left_temporarily';
    timestamp: Date;
    duration?: number; // in minutes
    resolved: boolean;
  }];
  behaviorFlags: {
    frequentDisconnections: boolean;
    longPeriodInactive: boolean;
    multipleDeviceLogins: boolean;
    suspiciousActivity: boolean;
  };
  attendance: {
    markedPresent: boolean;
    markedBy: 'system' | 'tutor';
    markedAt: Date;
    overriddenBy?: mongoose.Types.ObjectId; // tutor who overrode
    overrideReason?: string;
  };
  sessionEvents: [{
    type: 'join' | 'leave' | 'camera_on' | 'camera_off' | 'mic_on' | 'mic_off' | 'message' | 'poll_response' | 'hand_raise';
    timestamp: Date;
    metadata?: any;
  }];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  liveClass: {
    type: Schema.Types.ObjectId,
    ref: 'LiveClass',
    required: [true, 'Live class is required']
  },
  joinedAt: {
    type: Date,
    required: [true, 'Join time is required']
  },
  leftAt: {
    type: Date
  },
  totalDuration: {
    type: Number,
    default: 0,
    min: [0, 'Duration cannot be negative']
  },
  attendancePercentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'left_early'],
    default: 'present'
  },
  deviceInfo: {
    userAgent: {
      type: String,
      default: ''
    },
    platform: {
      type: String,
      default: ''
    },
    browser: {
      type: String,
      default: ''
    }
  },
  participationMetrics: {
    cameraOnDuration: {
      type: Number,
      default: 0
    },
    microphoneOnDuration: {
      type: Number,
      default: 0
    },
    messagesPosted: {
      type: Number,
      default: 0
    },
    pollsParticipated: {
      type: Number,
      default: 0
    },
    handsRaised: {
      type: Number,
      default: 0
    },
    screenTimeActive: {
      type: Number,
      default: 0
    },
    whiteboardInteractions: {
      type: Number,
      default: 0
    }
  },
  technicalIssues: [{
    type: {
      type: String,
      enum: ['camera_off', 'mic_off', 'connection_lost', 'left_temporarily'],
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    duration: {
      type: Number
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  behaviorFlags: {
    frequentDisconnections: {
      type: Boolean,
      default: false
    },
    longPeriodInactive: {
      type: Boolean,
      default: false
    },
    multipleDeviceLogins: {
      type: Boolean,
      default: false
    },
    suspiciousActivity: {
      type: Boolean,
      default: false
    }
  },
  attendance: {
    markedPresent: {
      type: Boolean,
      default: false
    },
    markedBy: {
      type: String,
      enum: ['system', 'tutor'],
      default: 'system'
    },
    markedAt: {
      type: Date
    },
    overriddenBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    overrideReason: {
      type: String,
      trim: true
    }
  },
  sessionEvents: [{
    type: {
      type: String,
      enum: ['join', 'leave', 'camera_on', 'camera_off', 'mic_on', 'mic_off', 'message', 'poll_response', 'hand_raise'],
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per user per class
AttendanceSchema.index({ user: 1, liveClass: 1 }, { unique: true });

// Indexes for better query performance
AttendanceSchema.index({ liveClass: 1, joinedAt: 1 });
AttendanceSchema.index({ user: 1, joinedAt: 1 });
AttendanceSchema.index({ 'attendance.markedPresent': 1 });
AttendanceSchema.index({ status: 1 });

// Calculate attendance percentage based on duration
AttendanceSchema.methods.calculateAttendancePercentage = function(classStartTime: Date, classEndTime: Date) {
  const classDuration = (classEndTime.getTime() - classStartTime.getTime()) / (1000 * 60); // in minutes
  this.attendancePercentage = Math.min(100, (this.totalDuration / classDuration) * 100);
  return this.attendancePercentage;
};

// Update total duration when leftAt is set
AttendanceSchema.pre('save', function(next) {
  if (this.leftAt && this.joinedAt) {
    this.totalDuration = Math.round((this.leftAt.getTime() - this.joinedAt.getTime()) / (1000 * 60));
  } else if (!this.leftAt && this.joinedAt) {
    // If still in class, calculate current duration
    this.totalDuration = Math.round((new Date().getTime() - this.joinedAt.getTime()) / (1000 * 60));
  }
  next();
});

// Auto-mark attendance based on threshold
AttendanceSchema.methods.checkAttendanceThreshold = function(threshold: number = 80) {
  if (this.attendancePercentage >= threshold) {
    this.attendance.markedPresent = true;
    this.attendance.markedBy = 'system';
    this.attendance.markedAt = new Date();
    this.status = 'present';
  } else {
    this.status = this.attendancePercentage > 0 ? 'left_early' : 'absent';
  }
};

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
