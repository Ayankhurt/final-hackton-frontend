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
} from './tempApiProxy';

// Configuration flag - set to true to use CORS proxy
const USE_CORS_PROXY = true; // Change this to false when backend CORS is fixed

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
    return 'https://cors-anywhere.herokuapp.com/https://final-hackton-one.vercel.app';
  }
  return 'https://final-hackton-one.vercel.app';
};

// Console warning when using proxy
if (USE_CORS_PROXY) {
  console.warn('🚨 USING CORS PROXY - This is temporary! Fix backend CORS configuration.');
  console.warn('Backend URL:', 'https://final-hackton-one.vercel.app');
  console.warn('Proxy URL:', 'https://cors-anywhere.herokuapp.com/');
}
