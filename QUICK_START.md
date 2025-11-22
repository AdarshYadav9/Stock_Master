# Quick Start Guide - Fix 404 Error

## Step 1: Create .env File

```bash
cd /Users/apple/Desktop/github/stackmaster/stock-master-ui
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## Step 2: Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Or start manually
mongod
```

## Step 3: Start Backend Server

```bash
npm run dev:server
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3001
📝 API endpoints available at http://localhost:3001/api/auth
```

## Step 4: Start Frontend (in another terminal)

```bash
npm run dev
```

## Step 5: Test Forgot Password

1. Go to http://localhost:8080/sign-in
2. Click "Forgot password?"
3. Enter your email
4. Check the **backend server console** for the OTP code
5. Enter the OTP and new password

## Verify Backend is Running

Open in browser: http://localhost:3001/health

Should show: `{"status":"ok","message":"StockMaster API is running"}`

## Common Issues

### 404 Error Still Appears

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check API endpoint:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/request-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. **Check browser console (F12):**
   - Look for network errors
   - Check the actual URL being called

4. **Verify route is registered:**
   - The `/forgot-password` route has been added to App.tsx
   - Make sure you're using the latest code

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# If not running, start it
mongod
```

### Port Already in Use

If port 3001 is already in use:
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9

# Or change PORT in .env
PORT=3002
```

