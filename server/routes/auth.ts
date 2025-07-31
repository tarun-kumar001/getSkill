import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { sendTokenResponse } from '../utils/auth';
import { authenticate } from '../middleware/auth';
import { asyncHandler, AppError, handleValidationError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('userType')
    .isIn(['student', 'tutor'])
    .withMessage('User type must be either student or tutor'),
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { name, email, password, userType, university, experience } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    userType,
    profile: {
      university: university || '',
      experience: experience || '',
      skills: []
    }
  });

  sendTokenResponse(user, 201, res, 'User registered successfully');
}));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { email, password } = req.body;

  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact support.', 401);
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password', 401);
  }

  sendTokenResponse(user, 200, res, 'Login successful');
}));

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}));

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticate, [
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
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const allowedFields = ['name', 'bio', 'university', 'experience', 'skills', 'socialLinks'];
  const updateData: any = {};

  // Only include allowed fields
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      if (key === 'bio' || key === 'university' || key === 'experience') {
        updateData[`profile.${key}`] = req.body[key];
      } else if (key === 'skills') {
        updateData['profile.skills'] = req.body[key];
      } else if (key === 'socialLinks') {
        updateData['profile.socialLinks'] = req.body[key];
      } else {
        updateData[key] = req.body[key];
      }
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
}));

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', authenticate, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isCurrentPasswordCorrect = await user!.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user!.password = newPassword;
  await user!.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
}));

// @desc    Connect LeetCode profile
// @route   POST /api/auth/leetcode
// @access  Private
router.post('/leetcode', authenticate, [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('LeetCode username is required'),
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    handleValidationError(errors.array());
  }

  const { username } = req.body;

  // In production, you would fetch real LeetCode stats here
  // For now, we'll simulate the data
  const leetcodeData = {
    username,
    totalSolved: Math.floor(Math.random() * 1000) + 100,
    easy: Math.floor(Math.random() * 400) + 50,
    medium: Math.floor(Math.random() * 400) + 50,
    hard: Math.floor(Math.random() * 200) + 10,
    ranking: Math.floor(Math.random() * 500000) + 10000,
    acceptanceRate: Math.floor(Math.random() * 40) + 60,
    streak: Math.floor(Math.random() * 100) + 1,
    contestRating: Math.floor(Math.random() * 1000) + 1200,
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { leetcodeProfile: leetcodeData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'LeetCode profile connected successfully',
    data: user?.leetcodeProfile,
  });
}));

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', authenticate, [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account'),
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
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

  // Soft delete - deactivate account
  await User.findByIdAndUpdate(req.user.id, { 
    isActive: false,
    email: `deleted_${Date.now()}_${user!.email}` // Prevent email conflicts
  });

  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
}));

export default router;
