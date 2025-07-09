const express = require('express');
const router = express.Router();
const Load = require('../models/Load'); // Fixed import to match Load.js

// POST: Create a new load
router.post('/', async (req, res) => {
  // Simple validation for required fields (customize as needed)
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required.' });
  }
  try {
    const load = new Load(req.body);
    await load.save();
    res.status(201).json(load);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all loads
router.get('/', async (req, res) => {
  try {
    const loads = await Load.find().populate('driver');
    res.json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;