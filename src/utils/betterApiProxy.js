// Better CORS Proxy Solution
// Uses development proxy for local development and direct backend for production

import axios from 'axios';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Backend URL - your actual backend
const BACKEND_URL = 'https://final-hackton-one.vercel.app';

// Configuration based on environment
const getApiConfig = () => {
  if (isDevelopment) {
    // Use Vite proxy for development (already configured in vite.config.js)
    return {
      baseURL: '/api', // This will be proxied by Vite to your backend
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } else {
    // Use direct backend URL for production
    return {
      baseURL: BACKEND_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://final-hackton-frontend.vercel.app',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
    };
  }
};

// Create axios instance with appropriate configuration
const proxyApi = axios.create(getApiConfig());

// Request interceptor to add JWT token
proxyApi.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
proxyApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healthmate_token');
      localStorage.removeItem('healthmate_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions using the proxy
export const tempAuthAPI = {
  register: async (userData) => {
    const response = await proxyApi.post('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await proxyApi.post('/api/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await proxyApi.get('/api/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await proxyApi.put('/api/auth/profile', userData);
    return response.data;
  },
};

export const tempFilesAPI = {
  uploadReport: async (file, reportType = 'other', familyMemberId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);
    if (familyMemberId) {
      formData.append('familyMemberId', familyMemberId);
    }

    const response = await proxyApi.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserReports: async (page = 1, limit = 10, reportType = null, familyMemberId = null) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (reportType) params.append('reportType', reportType);
    if (familyMemberId) params.append('familyMemberId', familyMemberId);

    const response = await proxyApi.get(`/api/files/reports?${params}`);
    return response.data;
  },

  getReport: async (reportId) => {
    const response = await proxyApi.get(`/api/files/reports/${reportId}`);
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await proxyApi.delete(`/api/files/reports/${reportId}`);
    return response.data;
  },

  retryAnalysis: async (reportId) => {
    const response = await proxyApi.post(`/api/files/reports/${reportId}/analyze`);
    return response.data;
  },
};

export const tempVitalsAPI = {
  addVitals: async (vitalsData) => {
    const response = await proxyApi.post('/api/vitals', vitalsData);
    return response.data;
  },

  getUserVitals: async (page = 1, limit = 20, startDate = null, endDate = null, familyMemberId = null) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (familyMemberId) params.append('familyMemberId', familyMemberId);

    const response = await proxyApi.get(`/api/vitals?${params}`);
    return response.data;
  },

  getVitalsStats: async (period = '30d') => {
    const response = await proxyApi.get(`/api/vitals/stats?period=${period}`);
    return response.data;
  },

  getVitals: async (vitalsId) => {
    const response = await proxyApi.get(`/api/vitals/${vitalsId}`);
    return response.data;
  },

  updateVitals: async (vitalsId, vitalsData) => {
    const response = await proxyApi.put(`/api/vitals/${vitalsId}`, vitalsData);
    return response.data;
  },

  deleteVitals: async (vitalsId) => {
    const response = await proxyApi.delete(`/api/vitals/${vitalsId}`);
    return response.data;
  },
};

export const tempTimelineAPI = {
  getTimeline: async (page = 1, limit = 20, startDate = null, endDate = null, type = null, familyMemberId = null) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (type) params.append('type', type);
    if (familyMemberId) params.append('familyMemberId', familyMemberId);

    const response = await proxyApi.get(`/api/timeline?${params}`);
    return response.data;
  },

  getDashboard: async () => {
    const response = await proxyApi.get('/api/timeline/dashboard');
    return response.data;
  },
};

export const tempFamilyAPI = {
  addFamilyMember: async (familyMemberData) => {
    const response = await proxyApi.post('/api/family', familyMemberData);
    return response.data;
  },

  getFamilyMembers: async () => {
    const response = await proxyApi.get('/api/family');
    return response.data;
  },

  getFamilyOverview: async () => {
    const response = await proxyApi.get('/api/family/overview');
    return response.data;
  },

  getFamilyMember: async (familyMemberId) => {
    const response = await proxyApi.get(`/api/family/${familyMemberId}`);
    return response.data;
  },

  updateFamilyMember: async (familyMemberId, familyMemberData) => {
    const response = await proxyApi.put(`/api/family/${familyMemberId}`, familyMemberData);
    return response.data;
  },

  deleteFamilyMember: async (familyMemberId) => {
    const response = await proxyApi.delete(`/api/family/${familyMemberId}`);
    return response.data;
  },

  getFamilyMemberHealthSummary: async (familyMemberId) => {
    const response = await proxyApi.get(`/api/family/${familyMemberId}/health-summary`);
    return response.data;
  },
};

export const tempHealthAPI = {
  checkHealth: async () => {
    const response = await proxyApi.get('/health');
    return response.data;
  },
};

export default proxyApi;
