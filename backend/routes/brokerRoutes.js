const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const { auth } = require('../middleware/auth');

// GET /loads: Get all loads (read-only for brokers)
router.get('/loads', auth, async (req, res) => {
  try {
    const loads = await Load.find({}, 'loadId pickupLocation deliveryLocation status driver')
      .populate('driver', 'name email phone');
    res.status(200).json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /loads/:id: Get a load by ID
router.get('/loads/:id', auth, async (req, res) => {
  try {
    const load = await Load.findById(req.params.id, 'loadId pickupLocation deliveryLocation status driver')
      .populate('driver', 'name email phone');
    if (!load) return res.status(404).json({ error: 'Load not found' });
    res.status(200).json(load);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
