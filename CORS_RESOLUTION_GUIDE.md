# CORS Error Resolution Guide

## Understanding the CORS Error

The error you're experiencing is a **Cross-Origin Resource Sharing (CORS)** policy violation. Here's what's happening:

### The Problem
- **Frontend**: `https://final-hackton-frontend.vercel.app`
- **Backend**: `https://final-hackton-one.vercel.app`
- **Issue**: Backend doesn't allow requests from the frontend domain

### Why CORS Exists
CORS is a security feature that prevents websites from making requests to different domains unless explicitly allowed. This prevents malicious websites from accessing your data.

## Solutions Implemented

### 1. ✅ Frontend Configuration
- **Created**: `src/config/api.js` - Centralized API configuration
- **Updated**: `src/utils/api.js` - Better error handling for CORS issues
- **Added**: Development proxy in `vite.config.js` for local development

### 2. ✅ Vercel Configuration
- **Updated**: `vercel.json` - Added CORS headers for API routes
- **Headers Added**:
  - `Access-Control-Allow-Origin`: Allows your frontend domain
  - `Access-Control-Allow-Methods`: Allows HTTP methods
  - `Access-Control-Allow-Headers`: Allows request headers
  - `Access-Control-Allow-Credentials`: Allows cookies/auth

## What You Need to Do

### 🔴 CRITICAL: Backend Configuration Required

The main issue is that **your backend server** (`https://final-hackton-one.vercel.app`) needs to be configured to allow CORS requests from your frontend.

#### Backend CORS Configuration Needed:

```javascript
// In your backend server (Node.js/Express example)
const cors = require('cors');

app.use(cors({
  origin: [
    'https://final-hackton-frontend.vercel.app',
    'http://localhost:5173', // For development
    'http://localhost:3000'  // Alternative dev port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Alternative Solutions

#### Option 1: Use a CORS Proxy (Temporary Fix)
```javascript
// In your frontend, temporarily use a CORS proxy
const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://final-hackton-one.vercel.app';
```

#### Option 2: Deploy Both Frontend and Backend on Same Domain
- Use subdomains: `api.yourdomain.com` and `app.yourdomain.com`
- Or use paths: `yourdomain.com/api` and `yourdomain.com/app`

#### Option 3: Use Vercel Serverless Functions
- Create API routes in your frontend project
- These will be on the same domain, avoiding CORS issues

## Testing the Fix

### 1. Check Browser Network Tab
- Open Developer Tools → Network tab
- Look for OPTIONS requests (preflight requests)
- Check if they return 200 status with proper CORS headers

### 2. Test API Endpoints
```bash
# Test CORS headers
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://final-hackton-one.vercel.app/api/auth/login
```

### 3. Check Response Headers
Look for these headers in the response:
- `Access-Control-Allow-Origin: https://final-hackton-frontend.vercel.app`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

## Development vs Production

### Development (Local)
- Use the proxy configuration in `vite.config.js`
- API calls will be proxied through your dev server
- No CORS issues in development

### Production
- Backend must have proper CORS configuration
- Frontend will make direct requests to backend
- CORS headers must be present in backend responses

## Common CORS Headers

```http
Access-Control-Allow-Origin: https://final-hackton-frontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

## Next Steps

1. **Contact your backend developer** or check your backend repository
2. **Add CORS configuration** to your backend server
3. **Test the API endpoints** after backend changes
4. **Deploy both frontend and backend** with proper CORS configuration

## Emergency Workaround

If you need immediate access, you can temporarily disable CORS in your browser (NOT recommended for production):

```bash
# Chrome (Windows)
chrome.exe --user-data-dir=/tmp/chrome_dev --disable-web-security --disable-features=VizDisplayCompositor

# Chrome (Mac)
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

**⚠️ Warning**: Only use this for development/testing. Never disable CORS in production browsers.
