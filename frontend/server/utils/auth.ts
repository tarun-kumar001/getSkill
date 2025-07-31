import jwt from 'jsonwebtoken';
import { Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || '7';

export interface JWTPayload {
  id: string;
  email: string;
  userType: 'student' | 'tutor';
  iat?: number;
  exp?: number;
}

// Generate JWT Token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Verify JWT Token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Send JWT Token in Cookie
export const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response,
  message: string = 'Success'
) => {
  // Create token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    userType: user.userType,
  });

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        avatar: user.avatar,
        isVerified: user.isVerified,
        profile: user.profile,
        stats: user.stats,
        leetcodeProfile: user.leetcodeProfile,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      },
    });
};

// Generate email verification token
export const generateEmailToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate password reset token
export const generateResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString();
};

// Hash reset token
export const hashToken = (token: string): string => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
};
