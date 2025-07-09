const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// POST: Create a driver
router.post('/', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().populate('assignedTruck loads');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get a driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedTruck loads');
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a driver
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete a driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
