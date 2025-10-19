# BACKEND CORS CONFIGURATION - URGENT FIX NEEDED

## The Problem
Your backend server at `https://final-hackton-one.vercel.app` is NOT configured to allow CORS requests from your frontend at `https://final-hackton-frontend.vercel.app`.

## IMMEDIATE SOLUTIONS

### Option 1: Node.js/Express Backend (Most Common)

Add this to your backend server:

```javascript
const cors = require('cors');

// Enable CORS for all routes
app.use(cors({
  origin: [
    'https://final-hackton-frontend.vercel.app',
    'http://localhost:5173',  // For development
    'http://localhost:3000'   // Alternative dev port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());
```

### Option 2: If using Vercel Serverless Functions

Create `vercel.json` in your backend project:

```json
{
  "functions": {
    "api/**/*.js": {
      "headers": {
        "Access-Control-Allow-Origin": "https://final-hackton-frontend.vercel.app",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true"
      }
    }
  }
}
```

### Option 3: Manual CORS Headers (If using raw Node.js)

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://final-hackton-frontend.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## TESTING THE FIX

After implementing the backend CORS configuration, test with:

```bash
# Test CORS headers
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://final-hackton-one.vercel.app/api/auth/login
```

You should see these headers in the response:
- `Access-Control-Allow-Origin: https://final-hackton-frontend.vercel.app`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

## EMERGENCY WORKAROUND (Temporary)

If you need immediate access for testing, you can temporarily use a CORS proxy:

```javascript
// In your frontend, temporarily change the API URL
const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://final-hackton-one.vercel.app';
```

**⚠️ WARNING**: This is only for testing. Never use in production.

## WHAT TO DO RIGHT NOW

1. **Find your backend repository** (the one deployed to `final-hackton-one.vercel.app`)
2. **Add CORS configuration** using one of the options above
3. **Deploy the backend** with CORS changes
4. **Test the API** with the curl command
5. **Try your frontend login** again

## NEXT STEPS

Once CORS is fixed:
1. Remove any temporary CORS proxy URLs
2. Test all API endpoints
3. Verify login/register functionality
4. Check other API calls (reports, vitals, etc.)

The frontend is ready - the issue is 100% on the backend side!
