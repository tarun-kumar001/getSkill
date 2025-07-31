import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { globalErrorHandler, notFound } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import interviewRoutes from './routes/interviews';
import enrollmentRoutes from './routes/enrollments';
import analyticsRoutes from './routes/analytics';
import settingsRoutes from './routes/settings';
import liveClassRoutes from './routes/liveClasses';

class Server {
  public app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    
    this.connectDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async connectDatabase(): Promise<void> {
    await connectDB();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
    });
    this.app.use('/api/', limiter);

    // Strict rate limiting for auth routes
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs for auth
      message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
      },
    });
    this.app.use('/api/auth/login', authLimiter);
    this.app.use('/api/auth/register', authLimiter);

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());

    // Request logging in development
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
      });
    }

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  private initializeRoutes(): void {
    // API Routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/courses', courseRoutes);
    this.app.use('/api/interviews', interviewRoutes);
    this.app.use('/api/enrollments', enrollmentRoutes);
    this.app.use('/api/analytics', analyticsRoutes);
    this.app.use('/api/settings', settingsRoutes);
    this.app.use('/api/live-classes', liveClassRoutes);

    // API Info endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'GETSKILL API v1.0',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          courses: '/api/courses',
          interviews: '/api/interviews',
          enrollments: '/api/enrollments',
          analytics: '/api/analytics',
          settings: '/api/settings',
          liveClasses: '/api/live-classes',
        },
        documentation: '/api/docs',
      });
    });
  }

  private initializeErrorHandling(): void {
    // Handle 404 errors
    this.app.use(notFound);

    // Global error handler
    this.app.use(globalErrorHandler);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err: Error) => {
      console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      process.exit(1);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${this.port}/api`);
      console.log(`📊 Health Check: http://localhost:${this.port}/health`);
    });
  }
}

// Start server
const server = new Server();
server.listen();

export default server.app;
