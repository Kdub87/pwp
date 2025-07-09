const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');
const { auth, adminOnly } = require('../middleware/auth');

// GET: Get all trucks
router.get('/', auth, async (req, res) => {
  try {
    const trucks = await Truck.find().populate('driver', 'name licenseNumber phone');
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create a truck
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const truck = new Truck(req.body);
    await truck.save();
    res.status(201).json(truck);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update truck
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!truck) return res.status(404).json({ error: 'Truck not found' });
    res.json(truck);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete truck
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) return res.status(404).json({ error: 'Truck not found' });
    res.json({ message: 'Truck deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;