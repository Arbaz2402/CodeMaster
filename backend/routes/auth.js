const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    user = new User({ 
      name, 
      email, 
      password,
      confirmationToken,
      confirmationTokenExpires: Date.now() + 3600000 // 1 hour
    });
    
    await user.save();
    
    // Send confirmation email
    const confirmationUrl = `${process.env.FRONTEND_URL || 'https://codemaster-dusky.vercel.app'}/pages/confirm-email.html?token=${confirmationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Confirm your email - CodeMaster',
      html: `
        <h1>Welcome to CodeMaster!</h1>
        <p>Please confirm your email by clicking the link below:</p>
        <a href="${confirmationUrl}" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">Confirm Email</a>
        <p>This link expires in 1 hour.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    // Don't send token - user needs to confirm email first
    res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Confirm email
router.post('/confirm-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await User.findOne({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    user.emailConfirmed = true;
    user.confirmationToken = null;
    user.confirmationTokenExpires = null;
    await user.save();
    
    res.json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend confirmation email (no auth needed, just email)
router.post('/resend-confirmation', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.emailConfirmed) {
      return res.status(400).json({ message: 'Email already confirmed' });
    }
    
    // Generate new confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    user.confirmationToken = confirmationToken;
    user.confirmationTokenExpires = Date.now() + 3600000;
    await user.save();
    
    // Send confirmation email
    const confirmationUrl = `${process.env.FRONTEND_URL || 'https://codemaster-dusky.vercel.app'}/pages/confirm-email.html?token=${confirmationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Confirm your email - CodeMaster',
      html: `
        <h1>Confirm Your Email</h1>
        <p>Please confirm your email by clicking the link below:</p>
        <a href="${confirmationUrl}" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">Confirm Email</a>
        <p>This link expires in 1 hour.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.json({ message: 'Confirmation email resent' });
  } catch (error) {
    console.error('Resend confirmation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (!user.emailConfirmed) {
      return res.status(400).json({ message: 'Please confirm your email first' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailConfirmed: user.emailConfirmed,
        bio: user.bio,
        about: user.about,
        avatar: user.avatar,
        skills: user.skills,
        streak: user.streak,
        totalCourses: user.totalCourses,
        totalHours: user.totalHours,
        points: user.points,
        achievements: user.achievements,
        certificates: user.certificates,
        activityData: user.activityData,
        recentActivity: user.recentActivity
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset your password - CodeMaster',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
