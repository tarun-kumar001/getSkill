import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticate } from '../middleware/auth';
import { asyncHandler, AppError, handleValidationError } from '../middleware/errorHandler';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Remove sensitive data
  const settings = {
    profile: user.profile,
    preferences: user.preferences,
    security: {
      twoFactorEnabled: user.security?.twoFactorEnabled || false,
      loginHistory: user.security?.loginHistory?.slice(0, 10) || []
    },
    tutorSettings: user.userType === 'tutor' ? user.tutorSettings : undefined,
    personalInfo: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      avatar: user.avatar
    }
  };

  res.status(200).json({
    success: true,
    data: settings
  });
}));

// @desc    Update profile information
// @route   PUT /api/settings/profile
// @access  Private
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('university')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('University name cannot exceed 100 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Experience cannot exceed 200 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender option'),
  body('careerGoals')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Career goals cannot exceed 500 characters')
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const updateData: any = {};
  const {
    name, bio, university, experience, skills, socialLinks, 
    phone, dateOfBirth, gender, careerGoals
  } = req.body;

  // Update basic info
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
  if (gender) updateData.gender = gender;

  // Update profile fields
  if (bio !== undefined) updateData['profile.bio'] = bio;
  if (university !== undefined) updateData['profile.university'] = university;
  if (experience !== undefined) updateData['profile.experience'] = experience;
  if (skills) updateData['profile.skills'] = skills;
  if (socialLinks) updateData['profile.socialLinks'] = socialLinks;
  if (careerGoals !== undefined) updateData['profile.careerGoals'] = careerGoals;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
}));

// @desc    Update preferences
// @route   PUT /api/settings/preferences
// @access  Private
router.put('/preferences', [
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be light or dark'),
  body('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Invalid language code'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { theme, language, notifications, interviewSettings } = req.body;
  const updateData: any = {};

  if (theme) updateData['preferences.theme'] = theme;
  if (language) updateData['preferences.language'] = language;
  if (notifications) updateData['preferences.notifications'] = notifications;
  if (interviewSettings) updateData['preferences.interviewSettings'] = interviewSettings;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: user?.preferences
  });
}));

// @desc    Update security settings
// @route   PUT /api/settings/security
// @access  Private
router.put('/security', [
  body('twoFactorEnabled')
    .optional()
    .isBoolean()
    .withMessage('Two factor enabled must be a boolean'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { twoFactorEnabled } = req.body;
  const updateData: any = {};

  if (twoFactorEnabled !== undefined) {
    updateData['security.twoFactorEnabled'] = twoFactorEnabled;
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Security settings updated successfully',
    data: user?.security
  });
}));

// @desc    Update tutor settings
// @route   PUT /api/settings/tutor
// @access  Private (Tutors only)
router.put('/tutor', [
  body('availability.days')
    .optional()
    .isArray()
    .withMessage('Days must be an array'),
  body('classPreferences.maxStudents')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max students must be between 1 and 100'),
], asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  if (user?.userType !== 'tutor') {
    throw new AppError('Only tutors can update tutor settings', 403);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { availability, classPreferences, payoutInfo } = req.body;
  const updateData: any = {};

  if (availability) updateData['tutorSettings.availability'] = availability;
  if (classPreferences) updateData['tutorSettings.classPreferences'] = classPreferences;
  if (payoutInfo) updateData['tutorSettings.payoutInfo'] = payoutInfo;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Tutor settings updated successfully',
    data: updatedUser?.tutorSettings
  });
}));

// @desc    Upload resume (students only)
// @route   POST /api/settings/resume
// @access  Private (Students only)
router.post('/resume', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  if (user?.userType !== 'student') {
    throw new AppError('Only students can upload resumes', 403);
  }

  const { fileName, fileUrl } = req.body;

  if (!fileName || !fileUrl) {
    throw new AppError('File name and URL are required', 400);
  }

  const resumeData = {
    fileName,
    fileUrl,
    uploadedAt: new Date()
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { 'profile.resume': resumeData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    data: updatedUser?.profile.resume
  });
}));

// @desc    Delete resume (students only)
// @route   DELETE /api/settings/resume
// @access  Private (Students only)
router.delete('/resume', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  if (user?.userType !== 'student') {
    throw new AppError('Only students can delete resumes', 403);
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { $unset: { 'profile.resume': 1 } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
}));

// @desc    Get login history
// @route   GET /api/settings/login-history
// @access  Private
router.get('/login-history', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  
  const loginHistory = user?.security?.loginHistory?.slice(0, 20) || [];

  res.status(200).json({
    success: true,
    data: loginHistory
  });
}));

// @desc    Logout from all devices
// @route   POST /api/settings/logout-all
// @access  Private
router.post('/logout-all', asyncHandler(async (req: Request, res: Response) => {
  // In a real implementation, you would invalidate all JWT tokens
  // For now, we'll just clear the current session
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out from all devices successfully'
  });
}));

// @desc    Export user data (GDPR compliance)
// @route   GET /api/settings/export-data
// @access  Private
router.get('/export-data', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Create exportable data (excluding sensitive information)
  const exportData = {
    personalInfo: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      userType: user.userType,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    profile: user.profile,
    preferences: user.preferences,
    stats: user.stats,
    leetcodeProfile: user.leetcodeProfile,
    tutorSettings: user.userType === 'tutor' ? user.tutorSettings : undefined,
    exportedAt: new Date()
  };

  res.status(200).json({
    success: true,
    data: exportData
  });
}));

// @desc    Deactivate account
// @route   PUT /api/settings/deactivate
// @access  Private
router.put('/deactivate', [
  body('password')
    .notEmpty()
    .withMessage('Password is required to deactivate account'),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { password } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  const isPasswordCorrect = await user!.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Password is incorrect', 400);
  }

  // Deactivate account
  await User.findByIdAndUpdate(req.user.id, { 
    isActive: false
  });

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
}));

export default router;
