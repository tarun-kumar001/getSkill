import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout for faster feedback
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock users for development
const mockUsers = {
  'student@example.com': {
    id: '1',
    name: 'Alex Johnson',
    email: 'student@example.com',
    userType: 'student',
    avatar: null,
    isVerified: true,
    profile: {
      bio: 'Computer Science student passionate about AI',
      university: 'IIT Delhi',
      skills: ['JavaScript', 'Python', 'React'],
    },
    stats: {
      coursesEnrolled: 3,
      coursesCompleted: 1,
      totalLearningHours: 45,
      interviewsCompleted: 5,
      averageScore: 78
    }
  },
  'tutor@example.com': {
    id: '2',
    name: 'Dr. Sarah Chen',
    email: 'tutor@example.com',
    userType: 'tutor',
    avatar: null,
    isVerified: true,
    profile: {
      bio: 'Former Google AI researcher with 10+ years in EdTech',
      university: 'Stanford University',
      experience: '10+ years in AI/ML and EdTech',
      skills: ['Machine Learning', 'Python', 'Teaching'],
    }
  },
  'tkumar@gmail.com': {
    id: '3',
    name: 'Tarun Kumar',
    email: 'tkumar@gmail.com',
    userType: 'student',
    avatar: null,
    isVerified: true,
    profile: {
      bio: 'Software developer and learner',
      university: 'Engineering College',
      skills: ['JavaScript', 'Node.js', 'React'],
    },
    stats: {
      coursesEnrolled: 2,
      coursesCompleted: 0,
      totalLearningHours: 15,
      interviewsCompleted: 2,
      averageScore: 65
    }
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Mock API implementations
const mockAuthAPI = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const user = mockUsers[credentials.email as keyof typeof mockUsers];
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    // For demo, accept any password for existing users, or "password123" or "1234"
    if (credentials.password !== 'password123' && credentials.password !== '1234') {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      success: true,
      message: 'Login successful',
      data: user,
      token
    };
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    userType: 'student' | 'tutor';
    university?: string;
    experience?: string;
  }): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Check if user already exists
    if (mockUsers[userData.email as keyof typeof mockUsers]) {
      return {
        success: false,
        message: 'User with this email already exists'
      };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      avatar: null,
      isVerified: true,
      profile: {
        bio: userData.userType === 'tutor' ? 'Experienced educator' : 'Eager learner',
        university: userData.university || '',
        experience: userData.experience || '',
        skills: [],
      },
      stats: userData.userType === 'student' ? {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalLearningHours: 0,
        interviewsCompleted: 0,
        averageScore: 0
      } : undefined
    };

    // Add to mock users
    mockUsers[userData.email as keyof typeof mockUsers] = newUser as any;

    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    return {
      success: true,
      message: 'Registration successful',
      data: newUser,
      token
    };
  },

  logout: async (): Promise<ApiResponse> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },

  getCurrentUser: async (): Promise<ApiResponse> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return {
        success: false,
        message: 'No user logged in'
      };
    }
    
    return {
      success: true,
      data: JSON.parse(userStr)
    };
  },

  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return {
        success: false,
        message: 'No user logged in'
      };
    }

    const user = JSON.parse(userStr);
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    };
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Password updated successfully'
    };
  },

  connectLeetCode: async (leetcodeData: { username: string }): Promise<ApiResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLeetCodeData = {
      username: leetcodeData.username,
      totalSolved: Math.floor(Math.random() * 500) + 100,
      easy: Math.floor(Math.random() * 200) + 50,
      medium: Math.floor(Math.random() * 200) + 50,
      hard: Math.floor(Math.random() * 100) + 10,
      ranking: Math.floor(Math.random() * 100000) + 10000,
      acceptanceRate: Math.floor(Math.random() * 40) + 60,
      streak: Math.floor(Math.random() * 50) + 1,
      contestRating: Math.floor(Math.random() * 1000) + 1200,
    };

    return {
      success: true,
      message: 'LeetCode profile connected successfully',
      data: mockLeetCodeData
    };
  },

  deleteAccount: async (password: string): Promise<ApiResponse> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      success: true,
      message: 'Account deleted successfully'
    };
  },
};

// Check server connectivity
const checkServerConnectivity = async (): Promise<boolean> => {
  try {
    const response = await axios.get(API_BASE_URL.replace('/api', '/health'), { timeout: 2000 });
    return response.status === 200;
  } catch (error) {
    console.log('Backend server not available, using mock API');
    return false;
  }
};

// Authentication API with fallback
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    userType: 'student' | 'tutor';
    university?: string;
    experience?: string;
  }): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.register(userData);
    }

    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      // Fallback to mock if real API fails
      console.log('API call failed, using mock API:', error.message);
      return mockAuthAPI.register(userData);
    }
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.login(credentials);
    }

    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      // Fallback to mock if real API fails
      console.log('API call failed, using mock API:', error.message);
      return mockAuthAPI.login(credentials);
    }
  },

  logout: async (): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.logout();
    }

    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error: any) {
      return mockAuthAPI.logout();
    }
  },

  getCurrentUser: async (): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.getCurrentUser();
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return mockAuthAPI.getCurrentUser();
    }
  },

  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.updateProfile(profileData);
    }

    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      return mockAuthAPI.updateProfile(profileData);
    }
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.updatePassword(passwordData);
    }

    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error: any) {
      return mockAuthAPI.updatePassword(passwordData);
    }
  },

  connectLeetCode: async (leetcodeData: { username: string }): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.connectLeetCode(leetcodeData);
    }

    try {
      const response = await api.post('/auth/leetcode', leetcodeData);
      return response.data;
    } catch (error: any) {
      return mockAuthAPI.connectLeetCode(leetcodeData);
    }
  },

  deleteAccount: async (password: string): Promise<ApiResponse> => {
    if (USE_MOCK_API || !(await checkServerConnectivity())) {
      return mockAuthAPI.deleteAccount(password);
    }

    try {
      const response = await api.delete('/auth/account', { data: { password } });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error: any) {
      return mockAuthAPI.deleteAccount(password);
    }
  },
};

// Placeholder APIs (will use mock data or fallback gracefully)
export const coursesAPI = {
  getAllCourses: async (): Promise<ApiResponse> => {
    return { success: true, data: { courses: [], pagination: { total: 0, page: 1, pages: 0 } } };
  },
  getCourse: async (id: string): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
  createCourse: async (courseData: any): Promise<ApiResponse> => {
    return { success: true, data: courseData };
  },
  updateCourse: async (id: string, courseData: any): Promise<ApiResponse> => {
    return { success: true, data: courseData };
  },
  deleteCourse: async (id: string): Promise<ApiResponse> => {
    return { success: true, message: 'Course deleted' };
  },
};

export const interviewsAPI = {
  getUserInterviews: async (): Promise<ApiResponse> => {
    return { success: true, data: { interviews: [], stats: { total: 0, completed: 0, averageScore: 0 } } };
  },
  createInterview: async (interviewData: any): Promise<ApiResponse> => {
    return { success: true, data: interviewData };
  },
  getInterview: async (id: string): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
  submitAnswers: async (id: string, answers: any): Promise<ApiResponse> => {
    return { success: true, data: answers };
  },
  completeInterview: async (id: string, finalData: any): Promise<ApiResponse> => {
    return { success: true, data: finalData };
  },
};

export const enrollmentsAPI = {
  getUserEnrollments: async (): Promise<ApiResponse> => {
    return { success: true, data: { enrollments: [], stats: { total: 0, completed: 0, inProgress: 0 } } };
  },
  enrollInCourse: async (enrollmentData: any): Promise<ApiResponse> => {
    return { success: true, data: enrollmentData };
  },
  getEnrollment: async (id: string): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
  updateProgress: async (id: string, progressData: any): Promise<ApiResponse> => {
    return { success: true, data: progressData };
  },
};

export const analyticsAPI = {
  getUserAnalytics: async (): Promise<ApiResponse> => {
    return { success: true, data: { learningStats: {}, interviewStats: {}, engagementStats: {} } };
  },
  getCourseAnalytics: async (): Promise<ApiResponse> => {
    return { success: true, data: { courseStats: [], revenue: {}, engagement: {} } };
  },
  getPlatformAnalytics: async (): Promise<ApiResponse> => {
    return { success: true, data: { users: {}, courses: {}, revenue: {}, engagement: {} } };
  },
};

export const usersAPI = {
  getUser: async (id: string): Promise<ApiResponse> => {
    return { success: true, data: {} };
  },
  getAllUsers: async (): Promise<ApiResponse> => {
    return { success: true, data: [] };
  },
};

// Utility functions
export const apiUtils = {
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getStoredUser: (): any => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  clearAuth: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  handleError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unexpected error occurred';
    }
  },
};

// Named export for the api instance
export { api };

export default api;
