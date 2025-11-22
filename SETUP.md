# StockMaster - MongoDB Authentication Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (if not already installed)
# macOS: brew install mongodb-community
# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env` with connection string

### 3. Configure Environment

Create `.env` file in root directory:
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

### 4. Start the Application

**Run both frontend and backend:**
```bash
npm run dev:all
```

This will start:
- Frontend on http://localhost:8080
- Backend API on http://localhost:3001

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

### 5. Test Authentication

1. **Sign Up:**
   - Go to http://localhost:8080/sign-up
   - Create an account
   - You'll be redirected to dashboard

2. **Sign In:**
   - Go to http://localhost:8080/sign-in
   - Login with your credentials
   - You'll be redirected to dashboard

3. **Password Reset:**
   - Click "Forgot Password" on sign-in page
   - Enter your email
   - **Check server console for OTP** (in development)
   - Enter OTP and new password
   - Login with new password

## OTP in Development

In development mode, OTP codes are logged to the server console. Look for:
```
📧 OTP sent to user@example.com: 123456
```

## API Endpoints

All auth endpoints are at `/api/auth`:

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/request-otp` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is accessible

### API Not Responding
- Check backend server is running on port 3001
- Verify `VITE_API_URL` in `.env`
- Check CORS settings

### OTP Not Working
- Check server console for OTP code
- Verify OTP hasn't expired (10 minutes)
- Ensure email matches the one used for request

## Production Setup

For production:
1. Use strong `JWT_SECRET`
2. Configure SMTP for email sending
3. Use MongoDB Atlas or secure MongoDB instance
4. Enable HTTPS
5. Set proper CORS origins

