const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Mock ELD data - in production, this would integrate with Xplore ELD API
const mockEldData = {
  driverId: 'DRV001',
  hoursOfService: {
    remaining: 8.5,
    status: 'On Duty',
    dailyDriving: 6.5,
    weeklyDriving: 45.2
  },
  location: {
    lat: 41.8781,
    lng: -87.6298,
    address: 'Chicago, IL',
    timestamp: new Date().toISOString()
  },
  vehicleStatus: {
    speed: 0,
    engineStatus: 'Off',
    odometer: 125847
  }
};

// GET: Get ELD data for current driver
router.get('/', auth, async (req, res) => {
  try {
    // In production, this would make an API call to Xplore ELD
    // For now, return mock data with some variation
    const eldData = {
      ...mockEldData,
      driverId: req.user.id,
      hoursOfService: {
        ...mockEldData.hoursOfService,
        remaining: Math.max(0, 11 - Math.random() * 5), // Random remaining hours
        dailyDriving: Math.random() * 8,
        weeklyDriving: Math.random() * 60
      },
      location: {
        ...mockEldData.location,
        timestamp: new Date().toISOString()
      }
    };

    res.json(eldData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get ELD data for specific driver (admin only)
router.get('/:driverId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Mock data for specific driver
    const eldData = {
      ...mockEldData,
      driverId: req.params.driverId,
      hoursOfService: {
        ...mockEldData.hoursOfService,
        remaining: Math.max(0, 11 - Math.random() * 5),
        dailyDriving: Math.random() * 8,
        weeklyDriving: Math.random() * 60
      }
    };

    res.json(eldData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;