// API utility for HealthMate Frontend
// Centralized API calls with automatic JWT token handling

import axios from 'axios';
import { API_CONFIG } from '../config/api.js';

// Base API configuration
const API_BASE_URL = API_CONFIG.CURRENT;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    // Note: In production, this should be replaced with httpOnly cookies for better security
    const token = localStorage.getItem('healthmate_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS Error:', error.message);
      console.error('This usually means the backend server is not configured to allow requests from this origin.');
      console.error('Frontend origin:', window.location.origin);
      console.error('Backend URL:', API_BASE_URL);
      
      // Show user-friendly error message
      const corsError = new Error('Unable to connect to the server. Please check your internet connection or try again later.');
      corsError.isCorsError = true;
      return Promise.reject(corsError);
    }
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('healthmate_token');
      localStorage.removeItem('healthmate_user');
      window.location.href = '/login';
    }
    
    // Handle other network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      const networkError = new Error('Network error. Please check your internet connection.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/api/auth/profile', userData);
    return response.data;
  },
};

// Files API calls
export const filesAPI = {
  // Upload medical report
  uploadReport: async (file, reportType = 'other', familyMemberId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);
    if (familyMemberId) {
      formData.append('familyMemberId', familyMemberId);
    }

    const response = await api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's reports
  getUserReports: async (page = 1, limit = 10, reportType = null, familyMemberId = null) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (reportType) params.append('reportType', reportType);
    if (familyMemberId) params.append('familyMemberId', familyMemberId);

    const response = await api.get(`/api/files/reports?${params}`);
    return response.data;
  },

  // Get single report with AI analysis
  getReport: async (reportId) => {
    const response = await api.get(`/api/files/reports/${reportId}`);
    return response.data;
  },

  // Delete report
  deleteReport: async (reportId) => {
    const response = await api.delete(`/api/files/reports/${reportId}`);
    return response.data;
  },

  // Retry AI analysis
  retryAnalysis: async (reportId) => {
    const response = await api.post(`/api/files/reports/${reportId}/analyze`);
    return response.data;
  },
};

// Vitals API calls
export const vitalsAPI = {
  // Add vitals entry
  addVitals: async (vitalsData) => {
    const response = await api.post('/api/vitals', vitalsData);
    return response.data;
  },

  // Get user's vitals
  getUserVitals: async (page = 1, limit = 20, startDate = null, endDate = null, familyMemberId = null) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (familyMemberId) params.append('familyMemberId', familyMemberId);

    const response = await api.get(`/api/vitals?${params}`);
    return response.data;
  },

  // Get vitals statistics
  getVitalsStats: async (period = '30d') => {
    const response = await api.get(`/api/vitals/stats?period=${period}`);
    return response.data;
  },

  // Get single vitals entry
  getVitals: async (vitalsId) => {
    const response = await api.get(`/api/vitals/${vitalsId}`);
    return response.data;
  },

  // Update vitals entry
  updateVitals: async (vitalsId, vitalsData) => {
    const response = await api.put(`/api/vitals/${vitalsId}`, vitalsData);
    return response.data;
  },

  // Delete vitals entry
  deleteVitals: async (vitalsId) => {
    const response = await api.delete(`/api/vitals/${vitalsId}`);
    return response.data;
  },
};

// Timeline API calls
export const timelineAPI = {
  // Get health timeline
  getTimeline: async (page = 1, limit = 20, startDate = null, endDate = null, type = null, familyMemberId = null) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (type) params.append('type', type);
    if (familyMemberId) params.append('familyMemberId', familyMemberId);

    const response = await api.get(`/api/timeline?${params}`);
    return response.data;
  },

  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/api/timeline/dashboard');
    return response.data;
  },
};

// Family API calls
export const familyAPI = {
  // Add family member
  addFamilyMember: async (familyMemberData) => {
    const response = await api.post('/api/family', familyMemberData);
    return response.data;
  },

  // Get all family members
  getFamilyMembers: async () => {
    const response = await api.get('/api/family');
    return response.data;
  },

  // Get family overview
  getFamilyOverview: async () => {
    const response = await api.get('/api/family/overview');
    return response.data;
  },

  // Get single family member
  getFamilyMember: async (familyMemberId) => {
    const response = await api.get(`/api/family/${familyMemberId}`);
    return response.data;
  },

  // Update family member
  updateFamilyMember: async (familyMemberId, familyMemberData) => {
    const response = await api.put(`/api/family/${familyMemberId}`, familyMemberData);
    return response.data;
  },

  // Delete family member
  deleteFamilyMember: async (familyMemberId) => {
    const response = await api.delete(`/api/family/${familyMemberId}`);
    return response.data;
  },

  // Get family member health summary
  getFamilyMemberHealthSummary: async (familyMemberId) => {
    const response = await api.get(`/api/family/${familyMemberId}/health-summary`);
    return response.data;
  },
};

// Health check API
export const healthAPI = {
  // Check backend health
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
