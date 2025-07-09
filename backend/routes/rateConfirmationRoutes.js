const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseRateConfirmation } = require('../utils/rateConfirmationParser');
const Load = require('../models/Load');
const { auth, adminOnly } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept PDF and text files
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'));
    }
  }
});

// POST: Upload and parse rate confirmation
router.post('/upload', auth, upload.single('rateConfirmation'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase() === '.pdf' ? 'pdf' : 'text';
    
    // Parse the rate confirmation
    const loadData = await parseRateConfirmation(filePath, fileType);
    
    // Return the parsed data
    res.json({ 
      message: 'Rate confirmation parsed successfully',
      loadData
    });
    
    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: Create load from rate confirmation
router.post('/create-load', auth, upload.single('rateConfirmation'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase() === '.pdf' ? 'pdf' : 'text';
    
    // Parse the rate confirmation
    const loadData = await parseRateConfirmation(filePath, fileType);
    
    // Create a new load with the parsed data
    const load = new Load({
      loadId: loadData.loadId,
      pickupLocation: loadData.pickupLocation,
      deliveryLocation: loadData.deliveryLocation,
      rate: loadData.rate,
      pickupDate: loadData.pickupDate || new Date(),
      deliveryDate: loadData.deliveryDate || new Date(Date.now() + 86400000), // Default to next day
      status: 'pending'
    });
    
    await load.save();
    
    // Return the created load
    res.status(201).json({ 
      message: 'Load created from rate confirmation',
      load
    });
    
    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;