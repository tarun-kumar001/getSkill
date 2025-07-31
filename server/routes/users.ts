import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get all users endpoint', data: [] });
}));

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Get user by ID endpoint', data: {} });
}));

export default router;
