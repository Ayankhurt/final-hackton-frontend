// API Configuration
// This file contains the API configuration for different environments

export const API_CONFIG = {
  // Production API URL
  PRODUCTION: 'https://final-hackton-one.vercel.app',
  
  // Development API URL (if you have a local backend)
  DEVELOPMENT: 'http://localhost:3000',
  
  // Current environment
  CURRENT: import.meta.env.VITE_API_URL || 'https://final-hackton-one.vercel.app'
};

// CORS configuration
export const CORS_CONFIG = {
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'https://final-hackton-frontend.vercel.app',
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
  ],
  
  // CORS headers that should be set by the backend
  REQUIRED_HEADERS: [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials'
  ]
};
