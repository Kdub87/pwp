const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const { calculateRoute } = require('../utils/routeCalculator');
const { auth, adminOnly } = require('../middleware/auth');

// POST: Create a new load
router.post('/', auth, async (req, res) => {
  // Simple validation for required fields (customize as needed)
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required.' });
  }
  try {
    const loadData = req.body;
    
    // Calculate route distance if pickup and delivery locations are provided
    if (loadData.pickupLocation && loadData.deliveryLocation) {
      try {
        const routeInfo = await calculateRoute(loadData.pickupLocation, loadData.deliveryLocation);
        loadData.distance = routeInfo.distance;
      } catch (routeError) {
        console.error('Error calculating route:', routeError);
        // Continue without distance if calculation fails
      }
    }
    
    const load = new Load(loadData);
    await load.save();
    res.status(201).json(load);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all loads
router.get('/', auth, async (req, res) => {
  try {
    const loads = await Load.find().populate('driver truck');
    res.json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get a load by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const load = await Load.findById(req.params.id).populate('driver truck');
    if (!load) return res.status(404).json({ error: 'Load not found' });
    res.json(load);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a load
router.put('/:id', auth, async (req, res) => {
  try {
    const load = await Load.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!load) return res.status(404).json({ error: 'Load not found' });
    res.json(load);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH: Assign driver and truck to load
router.patch('/:id/assign', auth, async (req, res) => {
  try {
    const { driverId, truckId } = req.body;
    if (!driverId || !truckId) {
      return res.status(400).json({ error: 'Driver ID and Truck ID are required' });
    }
    
    const load = await Load.findByIdAndUpdate(
      req.params.id, 
      { driver: driverId, truck: truckId, status: 'assigned' },
      { new: true }
    ).populate('driver truck');
    
    if (!load) return res.status(404).json({ error: 'Load not found' });
    res.json(load);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete a load
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const load = await Load.findByIdAndDelete(req.params.id);
    if (!load) return res.status(404).json({ error: 'Load not found' });
    res.json({ message: 'Load deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;