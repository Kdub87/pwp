const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const Driver = require('../models/Driver');

// GET /loads: Get all loads (read-only for brokers, no auth required)
router.get('/loads', async (req, res) => {
  try {
    const loads = await Load.find({}, 'loadId pickupLocation deliveryLocation status driver pickupDate deliveryDate')
      .populate('driver', 'name email phone location');
    res.status(200).json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /loads/:id: Get a load by ID or loadId
router.get('/loads/:id', async (req, res) => {
  try {
    // Try to find by MongoDB ID first
    let load = await Load.findById(req.params.id, 'loadId pickupLocation deliveryLocation status driver pickupDate deliveryDate')
      .populate('driver', 'name email phone location');
    
    // If not found, try to find by loadId
    if (!load) {
      load = await Load.findOne({ loadId: req.params.id }, 'loadId pickupLocation deliveryLocation status driver pickupDate deliveryDate')
        .populate('driver', 'name email phone location');
    }
    
    if (!load) return res.status(404).json({ error: 'Load not found' });
    res.status(200).json(load);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /loads/:id/request-update: Request an update for a load
router.post('/loads/:id/request-update', async (req, res) => {
  try {
    // Find the load by ID or loadId
    let load = await Load.findById(req.params.id);
    if (!load) {
      load = await Load.findOne({ loadId: req.params.id });
    }
    
    if (!load) return res.status(404).json({ error: 'Load not found' });
    
    // In a real application, this would send a notification to the driver or admin
    // For now, we'll just log the request and return a success message
    console.log(`Update requested for load ${load.loadId} at ${new Date().toISOString()}`);
    console.log(`Request details: ${JSON.stringify(req.body)}`);
    
    res.status(200).json({ 
      message: 'Update request received', 
      loadId: load.loadId,
      requestTime: new Date().toISOString() 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /drivers: Get all drivers' public information
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find({}, 'name status location');
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
