import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth';
import User from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Protect routes - Verify JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    try {
      // Verify token
      const decoded: JWTPayload = verifyToken(token);

      // Get user from database
      const user = await User.findById(decoded.id).select('+password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Token is valid but user no longer exists.',
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'User account is deactivated.',
        });
        return;
      }

      // Update last active
      user.lastActive = new Date();
      await user.save({ validateBeforeSave: false });

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authentication middleware.',
    });
    return;
  }
};

// Authorize user roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.',
      });
      return;
    }

    if (!roles.includes(req.user.userType)) {
      res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.userType} role is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded: JWTPayload = verifyToken(token);
        const user = await User.findById(decoded.id);

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.log('Invalid token in optional auth:', error);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Check if user owns resource
export const checkOwnership = (resourceField: string = 'user') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.',
      });
      return;
    }

    // This will be used in route handlers to check if user owns the resource
    // e.g., checkOwnership('student') for interview resources
    req.ownershipField = resourceField;
    next();
  };
};

// Rate limiting for sensitive operations
export const rateLimitSensitive = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // This is a placeholder for rate limiting
  // In production, use express-rate-limit or redis-based rate limiting
  next();
};

// Verify email middleware
export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Access denied. User not authenticated.',
    });
    return;
  }

  if (!req.user.isVerified) {
    res.status(403).json({
      success: false,
      message: 'Email verification required. Please check your email and verify your account.',
    });
    return;
  }

  next();
};

declare global {
  namespace Express {
    interface Request {
      ownershipField?: string;
    }
  }
}
