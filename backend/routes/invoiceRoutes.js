const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Load = require('../models/Load');
const { auth, adminOnly } = require('../middleware/auth');
const { generateInvoice } = require('../utils/invoiceGenerator');

// GET: Generate invoice for a load
router.get('/:loadId', auth, async (req, res) => {
  try {
    const load = await Load.findOne({ loadId: req.params.loadId })
      .populate('driver', 'name email phone')
      .populate('truck', 'truckId licensePlate');
    
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }
    
    // Generate the invoice
    const invoicePath = await generateInvoice(load);
    
    // Set headers for file download
    const filename = path.basename(invoicePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file to the response
    const filestream = fs.createReadStream(invoicePath);
    filestream.pipe(res);
    
    // Update the load to mark invoice as generated
    load.invoiceGenerated = true;
    await load.save();
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Generate invoice with custom details
router.post('/:loadId', auth, adminOnly, async (req, res) => {
  try {
    const load = await Load.findOne({ loadId: req.params.loadId })
      .populate('driver', 'name email phone')
      .populate('truck', 'truckId licensePlate');
    
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }
    
    // Get custom options from request body
    const options = {
      customer: req.body.customer || {},
      additionalCharges: req.body.additionalCharges || []
    };
    
    // Generate the invoice
    const invoicePath = await generateInvoice(load, options);
    
    // Set headers for file download
    const filename = path.basename(invoicePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream the file to the response
    const filestream = fs.createReadStream(invoicePath);
    filestream.pipe(res);
    
    // Update the load to mark invoice as generated
    load.invoiceGenerated = true;
    await load.save();
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;