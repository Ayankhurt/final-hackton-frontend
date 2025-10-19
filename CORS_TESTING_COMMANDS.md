# CORS Testing Commands

## Test Backend CORS Configuration

### 1. Test Preflight Request (OPTIONS)
```bash
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     https://final-hackton-one.vercel.app/api/auth/login \
     -v
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: https://final-hackton-frontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
```

### 2. Test Actual Login Request
```bash
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Content-Type: application/json" \
     -X POST \
     https://final-hackton-one.vercel.app/api/auth/login \
     -d '{"email":"test@example.com","password":"Password123"}' \
     -v
```

### 3. Test All API Endpoints
```bash
# Test registration
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Content-Type: application/json" \
     -X POST \
     https://final-hackton-one.vercel.app/api/auth/register \
     -d '{"name":"Test User","email":"test2@example.com","password":"Password123"}' \
     -v

# Test health endpoint
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -X GET \
     https://final-hackton-one.vercel.app/health \
     -v
```

## What to Look For

### ✅ SUCCESS - CORS Headers Present
```
< HTTP/2 200 
< access-control-allow-origin: https://final-hackton-frontend.vercel.app
< access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
< access-control-allow-headers: Content-Type, Authorization, X-Requested-With
< access-control-allow-credentials: true
```

### ❌ FAILURE - No CORS Headers
```
< HTTP/2 200 
< content-type: application/json
< (no CORS headers)
```

## Quick Test Script

Create a file called `test-cors.sh`:

```bash
#!/bin/bash

echo "Testing CORS configuration..."
echo "================================"

echo "1. Testing OPTIONS request..."
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://final-hackton-one.vercel.app/api/auth/login \
     -s -I | grep -i "access-control"

echo ""
echo "2. Testing actual POST request..."
curl -H "Origin: https://final-hackton-frontend.vercel.app" \
     -H "Content-Type: application/json" \
     -X POST \
     https://final-hackton-one.vercel.app/api/auth/login \
     -d '{"email":"test@example.com","password":"Password123"}' \
     -s -I | grep -i "access-control"

echo ""
echo "Test complete!"
```

Run with: `chmod +x test-cors.sh && ./test-cors.sh`

## Browser Testing

1. Open Developer Tools → Network tab
2. Try to login
3. Look for OPTIONS request (preflight)
4. Check if it returns 200 with CORS headers
5. Check if the actual POST request succeeds

## Common Issues

### Issue 1: No OPTIONS Handler
**Problem**: Backend doesn't handle OPTIONS requests
**Solution**: Add `app.options('*', cors());` to your backend

### Issue 2: Wrong Origin
**Problem**: CORS allows different origin
**Solution**: Update origin to match your frontend URL exactly

### Issue 3: Missing Headers
**Problem**: CORS doesn't allow required headers
**Solution**: Add `Authorization` and `Content-Type` to allowed headers

### Issue 4: Credentials Not Allowed
**Problem**: CORS doesn't allow credentials
**Solution**: Set `credentials: true` in CORS config
