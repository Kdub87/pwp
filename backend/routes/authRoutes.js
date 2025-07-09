const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST: Register a user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();
    res.status(201).json({ email, name, role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Use JWT expiration from environment variables or default to 24h
    const expiresIn = process.env.JWT_EXPIRATION || '24h';
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn }
    );
    
    res.json({ 
      token, 
      user: { email: user.email, name: user.name, role: user.role },
      expiresIn
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get current user
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
});

module.exports = router;
