const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ["http://localhost:8080", "http://localhost:3001"],
    credentials: true
  }));
app.use(express.json());

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
    const { email, name } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  
    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000);
  
    try {
      const mailOptions = {
        from: `"StockMaster" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP - StockMaster',
        html: `<h2>Your OTP is: ${otp}</h2>`,
        text: `Your OTP is: ${otp}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      console.log(`OTP ${otp} sent to ${email}`);
  
      // send OTP back (in real app store in DB)
      res.json({
        success: true,
        message: "OTP sent successfully",
        otp, // TEMPORARY — remove in production
      });
  
    } catch (error) {
      console.error("Email send error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });
  

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});