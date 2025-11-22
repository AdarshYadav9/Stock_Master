# StockMaster - Inventory Management System

A comprehensive Inventory Management System (IMS) built with React, TypeScript, TailwindCSS, Shadcn/UI, Zustand, MongoDB, and Express.

## Features

### 📦 Products Module
- Product list with search and category filtering
- Create new products with SKU, categories, and reorder rules
- Product detail pages with stock by location
- Low stock alerts

### 🔄 Operations Module
- **Receipts**: Manage incoming stock from suppliers
- **Deliveries**: Handle outgoing stock to customers
- **Internal Transfers**: Move stock between warehouses/locations
- **Inventory Adjustments**: Correct stock discrepancies
- **Move History**: Complete ledger of all stock movements

### 🏭 Settings Module
- Warehouse management with locations
- Product categories
- Units of Measure (UOM)
- User management

### 📊 Dashboard
- KPI cards showing key metrics
- Recent activity table
- Filters for document type, status, and warehouse
- Low stock alerts

### 🔐 Authentication
- **MongoDB-based authentication** with JWT tokens
- Secure password hashing with bcrypt
- OTP-based password reset
- Protected routes
- Auto-redirect to dashboard on login

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Shadcn/UI** for components
- **Zustand** for state management
- **React Hook Form + Zod** for form validation
- **MongoDB** with Mongoose for database
- **Express** for backend API
- **JWT** for authentication
- **bcryptjs** for password hashing
- **React Router** for navigation
- **Sonner** for toast notifications

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:
```bash
cd stock-master-ui
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

4. Start MongoDB:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) and update MONGODB_URI
```

5. Start the development servers:

**Option 1: Run both frontend and backend together**
```bash
npm run dev:all
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend server
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

6. Open [http://localhost:8080](http://localhost:8080) in your browser

## MongoDB Setup

### Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
3. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/stockmaster
   ```

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster
   ```

## Authentication API Endpoints

All endpoints are prefixed with `/api/auth`:

### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

### POST `/api/auth/request-otp`
Request OTP for password reset.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "If the email exists, an OTP has been sent"
}
```

**Note:** OTP is logged to console in development. Check server logs for the OTP code.

### POST `/api/auth/reset-password`
Reset password using OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

## OTP Password Reset Flow

1. User clicks "Forgot Password" on sign-in page
2. User enters email address
3. System generates 6-digit OTP
4. OTP is stored in MongoDB with 10-minute expiry
5. OTP is sent via email (logged to console in dev mode)
6. User enters OTP in the form
7. User enters new password
8. System verifies OTP and updates password
9. User is redirected to sign-in page

**Development Note:** Check your server console for the OTP code. In production, configure SMTP settings in `.env` to send real emails.

## Login → Dashboard Redirect

After successful login or signup:
- User is automatically redirected to `/dashboard`
- JWT token is stored in localStorage
- Token is included in all API requests
- Protected routes check for valid token

## Project Structure

```
src/
  server/              # Backend Express server
    db.ts             # MongoDB connection
    models/
      User.ts         # User Mongoose model
    authController.ts  # Auth handlers
    otpService.ts     # OTP generation & email
    authRoutes.ts     # Auth API routes
    index.ts          # Express server entry
  components/         # React components
  pages/              # Page components
  store/              # Zustand stores
  lib/
    api.ts            # API utility functions
    database.ts       # (Legacy - can be removed)
  mocks/              # Mock data
```

## Available Scripts

- `npm run dev` - Start frontend dev server (port 8080)
- `npm run dev:server` - Start backend API server (port 3001)
- `npm run dev:all` - Run both frontend and backend together
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Run backend server only
- `npm run lint` - Run ESLint

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ OTP expires after 10 minutes
- ✅ Passwords never stored in frontend
- ✅ Protected routes require valid token
- ✅ CORS enabled for API
- ✅ Input validation with Zod

## Testing the Authentication

1. **Create Account:**
   - Go to `/sign-up`
   - Enter name, email, password
   - You'll be redirected to dashboard

2. **Login:**
   - Go to `/sign-in`
   - Enter email and password
   - You'll be redirected to dashboard

3. **Password Reset:**
   - Click "Forgot Password" on sign-in page
   - Enter your email
   - Check server console for OTP (in dev mode)
   - Enter OTP and new password
   - Login with new password

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/stockmaster

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
PORT=3001

# Frontend API URL
VITE_API_URL=http://localhost:3001/api

# Email (Optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@stockmaster.com
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB port (default: 27017)

### API Connection Error
- Ensure backend server is running on port 3001
- Check `VITE_API_URL` in `.env`
- Verify CORS settings

### OTP Not Received
- Check server console logs (OTP is logged in dev mode)
- In production, configure SMTP settings
- Verify email address is correct

## Next Steps

To migrate other data to MongoDB:
1. Create Mongoose models for Products, Warehouses, etc.
2. Update stores to use API calls instead of localStorage
3. Create API routes for CRUD operations
4. Update frontend to use new API endpoints

## License

MIT
