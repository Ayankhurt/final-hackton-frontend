// API Configuration Toggle
// Switch between normal API and temporary CORS proxy

import { authAPI, filesAPI, vitalsAPI, timelineAPI, familyAPI, healthAPI } from './api';
import { 
  tempAuthAPI, 
  tempFilesAPI, 
  tempVitalsAPI, 
  tempTimelineAPI, 
  tempFamilyAPI, 
  tempHealthAPI 
} from './betterApiProxy';

// Configuration flag - set to false to use backend directly
const USE_CORS_PROXY = false; // Changed to false to use your backend directly

// Export the appropriate API based on configuration
export const authAPIProxy = USE_CORS_PROXY ? tempAuthAPI : authAPI;
export const filesAPIProxy = USE_CORS_PROXY ? tempFilesAPI : filesAPI;
export const vitalsAPIProxy = USE_CORS_PROXY ? tempVitalsAPI : vitalsAPI;
export const timelineAPIProxy = USE_CORS_PROXY ? tempTimelineAPI : timelineAPI;
export const familyAPIProxy = USE_CORS_PROXY ? tempFamilyAPI : familyAPI;
export const healthAPIProxy = USE_CORS_PROXY ? tempHealthAPI : healthAPI;

// Helper function to check if using proxy
export const isUsingCorsProxy = () => USE_CORS_PROXY;

// Helper function to get current API base URL
export const getCurrentApiUrl = () => {
  if (USE_CORS_PROXY) {
    if (import.meta.env.DEV) {
      return '/api'; // Vite proxy in development
    } else {
      return 'https://final-hackton-one.vercel.app'; // Direct backend URL
    }
  }
  return 'https://final-hackton-one.vercel.app';
};

// Console warning when using proxy
if (USE_CORS_PROXY) {
  console.warn('🚨 USING CORS PROXY - This is temporary! Fix backend CORS configuration.');
  console.warn('Environment:', import.meta.env.DEV ? 'Development' : 'Production');
  console.warn('API URL:', getCurrentApiUrl());
}
