import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import LiveClass from '../models/LiveClass';
import Attendance from '../models/Attendance';
import Course from '../models/Course';
import User from '../models/User';
import { authenticate } from '../middleware/auth';
import { asyncHandler, AppError, handleValidationError } from '../middleware/errorHandler';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Create a new live class
// @route   POST /api/live-classes
// @access  Private (Tutors only)
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('course')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('scheduledStartTime')
    .isISO8601()
    .withMessage('Valid start time is required'),
  body('scheduledEndTime')
    .isISO8601()
    .withMessage('Valid end time is required'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage('Max participants must be between 1 and 500'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const user = await User.findById(req.user.id);
  if (user?.userType !== 'tutor') {
    throw new AppError('Only tutors can create live classes', 403);
  }

  // Verify course exists and tutor has access
  const course = await Course.findById(req.body.course);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Generate unique room ID
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const liveClass = await LiveClass.create({
    ...req.body,
    tutor: req.user.id,
    roomId,
    settings: {
      ...req.body.settings,
      recordingEnabled: req.body.settings?.recordingEnabled || false,
      cameraRequired: req.body.settings?.cameraRequired || false,
      microphoneRequired: req.body.settings?.microphoneRequired || false,
      attendanceThreshold: req.body.settings?.attendanceThreshold || 80,
      allowLateJoin: req.body.settings?.allowLateJoin !== false,
      autoMuteOnJoin: req.body.settings?.autoMuteOnJoin !== false,
      enableChat: req.body.settings?.enableChat !== false,
      enableScreenShare: req.body.settings?.enableScreenShare !== false,
      enableWhiteboard: req.body.settings?.enableWhiteboard !== false,
      enablePolls: req.body.settings?.enablePolls !== false,
    }
  });

  await liveClass.populate('tutor', 'name email');
  await liveClass.populate('course', 'title description');

  res.status(201).json({
    success: true,
    message: 'Live class created successfully',
    data: liveClass
  });
}));

// @desc    Get live classes for user
// @route   GET /api/live-classes
// @access  Private
router.get('/', [
  query('status')
    .optional()
    .isIn(['scheduled', 'live', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const user = await User.findById(req.user.id);
  const { status, date, page = 1, limit = 10 } = req.query;
  
  let filter: any = {};

  if (user?.userType === 'tutor') {
    filter.tutor = req.user.id;
  } else {
    // For students, get classes from enrolled courses
    const enrollments = await require('../models/Enrollment').find({ user: req.user.id });
    const courseIds = enrollments.map((enrollment: any) => enrollment.course);
    filter.course = { $in: courseIds };
  }

  if (status) {
    filter.status = status;
  }

  if (date) {
    const startDate = new Date(date as string);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    filter.scheduledStartTime = {
      $gte: startDate,
      $lt: endDate
    };
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const liveClasses = await LiveClass.find(filter)
    .populate('tutor', 'name email avatar')
    .populate('course', 'title description')
    .sort({ scheduledStartTime: 1 })
    .skip(skip)
    .limit(limitNum);

  const total = await LiveClass.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: liveClasses,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum
    }
  });
}));

// @desc    Get live class by ID
// @route   GET /api/live-classes/:id
// @access  Private
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid class ID')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const liveClass = await LiveClass.findById(req.params.id)
    .populate('tutor', 'name email avatar')
    .populate('course', 'title description');

  if (!liveClass) {
    throw new AppError('Live class not found', 404);
  }

  // Check access permission
  const user = await User.findById(req.user.id);
  if (user?.userType === 'tutor' && liveClass.tutor._id.toString() !== req.user.id) {
    throw new AppError('Access denied', 403);
  }

  res.status(200).json({
    success: true,
    data: liveClass
  });
}));

// @desc    Join live class
// @route   POST /api/live-classes/:id/join
// @access  Private
router.post('/:id/join', [
  param('id').isMongoId().withMessage('Invalid class ID'),
  body('deviceInfo').optional().isObject(),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) {
    throw new AppError('Live class not found', 404);
  }

  // Check if class is accessible
  if (liveClass.status === 'cancelled') {
    throw new AppError('This class has been cancelled', 400);
  }

  if (liveClass.status === 'completed') {
    throw new AppError('This class has already ended', 400);
  }

  // Check if late join is allowed
  const now = new Date();
  if (!liveClass.settings.allowLateJoin && now > liveClass.scheduledStartTime) {
    throw new AppError('Late joining is not allowed for this class', 400);
  }

  // Check enrollment for students
  const user = await User.findById(req.user.id);
  if (user?.userType === 'student') {
    const enrollment = await require('../models/Enrollment').findOne({
      user: req.user.id,
      course: liveClass.course
    });
    
    if (!enrollment) {
      throw new AppError('You are not enrolled in this course', 403);
    }
  }

  // Create or update attendance record
  let attendance = await Attendance.findOne({
    user: req.user.id,
    liveClass: req.params.id
  });

  if (!attendance) {
    attendance = await Attendance.create({
      user: req.user.id,
      liveClass: req.params.id,
      joinedAt: now,
      deviceInfo: req.body.deviceInfo || {},
      sessionEvents: [{
        type: 'join',
        timestamp: now
      }]
    });

    // Update live class metadata
    await LiveClass.findByIdAndUpdate(req.params.id, {
      $inc: { 'metadata.totalParticipants': 1 }
    });
  } else {
    // If rejoining, update join time and add event
    attendance.joinedAt = now;
    attendance.sessionEvents.push({
      type: 'join',
      timestamp: now
    });
    await attendance.save();
  }

  // Start class if it's the tutor joining
  if (user?.userType === 'tutor' && liveClass.tutor.toString() === req.user.id) {
    if (liveClass.status === 'scheduled') {
      liveClass.status = 'live';
      liveClass.actualStartTime = now;
      await liveClass.save();
    }
  }

  res.status(200).json({
    success: true,
    message: 'Joined live class successfully',
    data: {
      roomId: liveClass.roomId,
      accessToken: liveClass.accessToken,
      settings: liveClass.settings,
      attendance: attendance._id
    }
  });
}));

// @desc    Leave live class
// @route   POST /api/live-classes/:id/leave
// @access  Private
router.post('/:id/leave', [
  param('id').isMongoId().withMessage('Invalid class ID')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const attendance = await Attendance.findOne({
    user: req.user.id,
    liveClass: req.params.id
  });

  if (!attendance) {
    throw new AppError('Attendance record not found', 404);
  }

  const now = new Date();
  attendance.leftAt = now;
  attendance.sessionEvents.push({
    type: 'leave',
    timestamp: now
  });

  // Calculate final attendance
  const liveClass = await LiveClass.findById(req.params.id);
  if (liveClass) {
    const classStartTime = liveClass.actualStartTime || liveClass.scheduledStartTime;
    const classEndTime = liveClass.actualEndTime || liveClass.scheduledEndTime;
    
    attendance.calculateAttendancePercentage(classStartTime, classEndTime);
    attendance.checkAttendanceThreshold(liveClass.settings.attendanceThreshold);
  }

  await attendance.save();

  res.status(200).json({
    success: true,
    message: 'Left live class successfully',
    data: {
      duration: attendance.totalDuration,
      attendancePercentage: attendance.attendancePercentage,
      status: attendance.status
    }
  });
}));

// @desc    Update live class status
// @route   PATCH /api/live-classes/:id/status
// @access  Private (Tutor only)
router.patch('/:id/status', [
  param('id').isMongoId().withMessage('Invalid class ID'),
  body('status')
    .isIn(['live', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) {
    throw new AppError('Live class not found', 404);
  }

  // Check if user is the tutor
  if (liveClass.tutor.toString() !== req.user.id) {
    throw new AppError('Only the class tutor can update status', 403);
  }

  const now = new Date();
  
  if (req.body.status === 'live' && liveClass.status === 'scheduled') {
    liveClass.actualStartTime = now;
  } else if (req.body.status === 'completed' && liveClass.status === 'live') {
    liveClass.actualEndTime = now;
    
    // Process all attendance records
    const attendances = await Attendance.find({ liveClass: req.params.id });
    for (const attendance of attendances) {
      if (!attendance.leftAt) {
        attendance.leftAt = now;
      }
      attendance.calculateAttendancePercentage(
        liveClass.actualStartTime || liveClass.scheduledStartTime,
        now
      );
      attendance.checkAttendanceThreshold(liveClass.settings.attendanceThreshold);
      await attendance.save();
    }
  }

  liveClass.status = req.body.status;
  await liveClass.save();

  res.status(200).json({
    success: true,
    message: 'Class status updated successfully',
    data: liveClass
  });
}));

// @desc    Get attendance for a live class
// @route   GET /api/live-classes/:id/attendance
// @access  Private (Tutor only)
router.get('/:id/attendance', [
  param('id').isMongoId().withMessage('Invalid class ID')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) {
    throw new AppError('Live class not found', 404);
  }

  // Check if user is the tutor
  if (liveClass.tutor.toString() !== req.user.id) {
    throw new AppError('Only the class tutor can view attendance', 403);
  }

  const attendances = await Attendance.find({ liveClass: req.params.id })
    .populate('user', 'name email avatar')
    .sort({ joinedAt: 1 });

  const stats = {
    totalParticipants: attendances.length,
    presentCount: attendances.filter(a => a.attendance.markedPresent).length,
    averageAttendance: attendances.reduce((sum, a) => sum + a.attendancePercentage, 0) / attendances.length || 0,
    averageDuration: attendances.reduce((sum, a) => sum + a.totalDuration, 0) / attendances.length || 0
  };

  res.status(200).json({
    success: true,
    data: {
      attendances,
      stats
    }
  });
}));

// @desc    Create poll in live class
// @route   POST /api/live-classes/:id/polls
// @access  Private (Tutor only)
router.post('/:id/polls', [
  param('id').isMongoId().withMessage('Invalid class ID'),
  body('question')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Question is required and cannot exceed 500 characters'),
  body('options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Poll must have 2-6 options')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) {
    throw new AppError('Live class not found', 404);
  }

  if (liveClass.tutor.toString() !== req.user.id) {
    throw new AppError('Only the class tutor can create polls', 403);
  }

  if (!liveClass.settings.enablePolls) {
    throw new AppError('Polls are disabled for this class', 400);
  }

  const poll = {
    question: req.body.question,
    options: req.body.options,
    isActive: true,
    responses: [],
    createdAt: new Date()
  };

  liveClass.polls.push(poll);
  liveClass.metadata.pollsCreated += 1;
  await liveClass.save();

  res.status(201).json({
    success: true,
    message: 'Poll created successfully',
    data: poll
  });
}));

// @desc    Respond to poll
// @route   POST /api/live-classes/:id/polls/:pollIndex/respond
// @access  Private
router.post('/:id/polls/:pollIndex/respond', [
  param('id').isMongoId().withMessage('Invalid class ID'),
  param('pollIndex').isInt().withMessage('Invalid poll index'),
  body('answer')
    .isInt({ min: 0 })
    .withMessage('Valid answer index is required')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) {
    throw new AppError('Live class not found', 404);
  }

  const pollIndex = parseInt(req.params.pollIndex);
  const poll = liveClass.polls[pollIndex];

  if (!poll) {
    throw new AppError('Poll not found', 404);
  }

  if (!poll.isActive) {
    throw new AppError('This poll is no longer active', 400);
  }

  if (req.body.answer >= poll.options.length) {
    throw new AppError('Invalid answer option', 400);
  }

  // Check if user already responded
  const existingResponse = poll.responses.find(r => r.user.toString() === req.user.id);
  if (existingResponse) {
    throw new AppError('You have already responded to this poll', 400);
  }

  poll.responses.push({
    user: req.user.id,
    answer: req.body.answer,
    timestamp: new Date()
  });

  await liveClass.save();

  // Update attendance metrics
  await Attendance.findOneAndUpdate(
    { user: req.user.id, liveClass: req.params.id },
    { $inc: { 'participationMetrics.pollsParticipated': 1 } }
  );

  res.status(200).json({
    success: true,
    message: 'Poll response recorded successfully'
  });
}));

export default router;
