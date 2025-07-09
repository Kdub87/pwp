const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Load = require('../models/Load');
const { auth } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/documents');
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept common document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, images, and text files are allowed.'));
    }
  }
});

// POST: Upload document for a load
router.post('/:id/documents', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const load = await Load.findById(req.params.id);
    if (!load) {
      // Delete the uploaded file if load not found
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      return res.status(404).json({ error: 'Load not found' });
    }

    // Check if user is authorized (admin or the assigned driver)
    const isAdmin = req.user.role === 'admin';
    const isAssignedDriver = load.driver && req.user.id === load.driver.toString();
    
    if (!isAdmin && !isAssignedDriver) {
      // Delete the uploaded file if user is not authorized
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      return res.status(403).json({ error: 'Not authorized to upload documents for this load' });
    }

    // Add document to load
    load.documents.push({
      path: req.file.path,
      name: req.file.originalname,
      type: req.file.mimetype
    });

    await load.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        name: req.file.originalname,
        type: req.file.mimetype,
        uploadedAt: new Date()
      }
    });
  } catch (err) {
    // Delete the uploaded file if there's an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET: Get all documents for a load
router.get('/:id/documents', auth, async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }

    // Check if user is authorized (admin or the assigned driver)
    const isAdmin = req.user.role === 'admin';
    const isAssignedDriver = load.driver && req.user.id === load.driver.toString();
    
    if (!isAdmin && !isAssignedDriver) {
      return res.status(403).json({ error: 'Not authorized to view documents for this load' });
    }

    res.json(load.documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a document
router.delete('/:id/documents/:documentId', auth, async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }

    // Check if user is authorized (admin only)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete documents' });
    }

    // Find the document
    const document = load.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete the file
    fs.unlink(document.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Remove from the array
    load.documents.pull(req.params.documentId);
    await load.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;