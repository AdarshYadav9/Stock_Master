# Troubleshooting Guide

## 404 Error During Forgot Password

If you're getting a 404 error, check the following:

### 1. Backend Server Not Running

**Problem:** The Express server on port 3001 is not running.

**Solution:**
```bash
# Start the backend server
npm run dev:server

# Or run both frontend and backend together
npm run dev:all
```

**Check:** Open http://localhost:3001/health in your browser. You should see:
```json
{"status":"ok","message":"StockMaster API is running"}
```

### 2. Missing .env File

**Problem:** Environment variables are not configured.

**Solution:**
1. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Edit `.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

### 3. MongoDB Not Running

**Problem:** MongoDB connection fails.

**Solution:**
```bash
# Start MongoDB (macOS)
brew services start mongodb-community

# Or check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

### 4. CORS Issues

**Problem:** Browser blocks API requests due to CORS.

**Solution:** The backend already has CORS enabled. If issues persist:
- Check that `VITE_API_URL` in `.env` matches the backend URL
- Ensure backend server is running on port 3001

### 5. API URL Mismatch

**Problem:** Frontend is calling wrong API URL.

**Check:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try forgot password
4. Check the request URL - should be `http://localhost:3001/api/auth/request-otp`

**Fix:** Update `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 6. Route Not Found

**Problem:** The `/forgot-password` route was missing (now fixed).

**Solution:** The route has been added to `App.tsx`. Make sure you're using the latest code.

## Quick Diagnostic Steps

1. **Check Backend:**
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok",...}`

2. **Check API Endpoint:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/request-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```
   Should return: `{"message":"If the email exists, an OTP has been sent"}`

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

4. **Check Server Logs:**
   - Look at the terminal where backend is running
   - Check for MongoDB connection errors
   - Check for route registration messages

## Common Error Messages

### "Cannot connect to server"
- Backend server is not running
- Wrong API URL in `.env`
- Firewall blocking port 3001

### "404 Not Found"
- Route not registered (check App.tsx)
- Wrong API endpoint path
- Backend server not running

### "MongoDB connection error"
- MongoDB not installed or running
- Wrong `MONGODB_URI` in `.env`
- Network issues

### "OTP not found" or "Invalid OTP"
- OTP expired (10 minutes)
- Wrong OTP entered
- OTP not generated (check server logs)

## Still Having Issues?

1. Check all services are running:
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. Verify MongoDB:
   ```bash
   mongosh
   use stockmaster
   db.users.find()
   ```

3. Check environment variables:
   ```bash
   cat .env
   ```

4. Clear browser cache and localStorage:
   - Open DevTools
   - Application > Local Storage
   - Clear all

