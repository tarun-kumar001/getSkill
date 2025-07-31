# GETSKILL MERN Stack Setup Guide

This guide will help you set up the complete MERN (MongoDB, Express.js, React, Node.js) stack for the GETSKILL EdTech platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Copy the example environment file and configure:
```bash
cp .env.example .env
```

Edit `.env` with your configurations:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/getskill

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI accordingly
```

### 4. Seed the Database
Run the seeding script to populate with sample data:
```bash
npm run seed
```

This will create:
- 3 sample users (student@example.com, tutor@example.com, maria@example.com)
- Sample courses, interviews, and enrollments
- All with password: `password123`

### 5. Start Development Servers

#### Option A: Start both servers together
```bash
npm run dev:full
```

#### Option B: Start separately
Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/leetcode` - Connect LeetCode profile

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Tutor only)
- `PUT /api/courses/:id` - Update course (Tutor only)
- `DELETE /api/courses/:id` - Delete course (Tutor only)

### Interview Endpoints
- `GET /api/interviews` - Get user's interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews/:id` - Get interview details
- `PUT /api/interviews/:id` - Submit answers
- `POST /api/interviews/:id/complete` - Complete interview

### Enrollment Endpoints
- `GET /api/enrollments` - Get user's enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/:id` - Get enrollment details
- `PUT /api/enrollments/:id/progress` - Update progress

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── hooks/             # Custom hooks
├── server/                # Express.js backend
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── scripts/           # Database scripts
└── shared/                # Shared utilities
```

## 🧪 Testing the Setup

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","userType":"student"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student@example.com","password":"password123"}'
   ```

3. **Visit the frontend at http://localhost:3000 and test:**
   - User registration and login
   - Student and Tutor dashboards
   - Course browsing
   - Mock interview system
   - Profile management

## 🔧 Development Tools

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend development server
- `npm run dev:full` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run seed` - Seed database with sample data
- `npm run typecheck` - Run TypeScript type checking

### Database Management
- MongoDB Compass: Connect to `mongodb://localhost:27017/getskill`
- View collections: users, courses, interviews, enrollments

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-strong-production-secret
CLIENT_URL=https://your-frontend-domain.com
```

### Build and Deploy
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify MongoDB service status

2. **CORS Errors:**
   - Verify CLIENT_URL in backend .env
   - Check if both servers are running on correct ports

3. **Authentication Issues:**
   - Clear browser localStorage
   - Check JWT_SECRET configuration
   - Verify cookie settings

4. **API Not Found:**
   - Ensure backend server is running on port 5000
   - Check API endpoints in network tab
   - Verify VITE_API_URL in frontend .env

## 📞 Support

If you encounter issues:
1. Check the console logs for errors
2. Verify all environment variables
3. Ensure all dependencies are installed
4. Make sure MongoDB is running and accessible

The MERN stack integration is now complete with:
- ✅ MongoDB database with comprehensive models
- ✅ Express.js REST API with authentication
- ✅ React frontend with modern UI
- ✅ Node.js backend with proper error handling
- ✅ JWT authentication system
- ✅ Real-time features ready for Socket.io
- ✅ Production-ready architecture

Happy coding! 🎉
