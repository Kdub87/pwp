const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Load = require('../models/Load');
const { auth, adminOnly } = require('../middleware/auth');

// POST: Generate invoice for a load
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { loadId } = req.body;
    
    if (!loadId) {
      return res.status(400).json({ error: 'Load ID is required' });
    }

    // Find the load
    const load = await Load.findOne({ loadId }).populate('driver', 'name email phone');
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }

    // Create invoices directory if it doesn't exist
    const invoicesDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `invoice-${loadId}-${Date.now()}.pdf`;
    const filepath = path.join(invoicesDir, filename);
    
    // Pipe PDF to file
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Add content to PDF
    doc.fontSize(20).text('PWP Fleet Management', { align: 'center' });
    doc.fontSize(12).text('Peace Way Logistics', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('INVOICE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Load ID: ${load.loadId}`);
    doc.text(`Pickup: ${load.pickupLocation}`);
    doc.text(`Delivery: ${load.deliveryLocation}`);
    doc.text(`Rate: $${load.rate.toFixed(2)}`);
    
    if (load.driver) {
      doc.text(`Driver: ${load.driver.name}`);
    }
    
    doc.moveDown();
    doc.text(`Total Amount: $${load.rate.toFixed(2)}`, { align: 'right' });

    doc.end();

    // Wait for PDF to be written
    stream.on('finish', async () => {
      try {
        // Update load with invoice path
        load.invoices = load.invoices || [];
        load.invoices.push({
          path: filepath,
          createdAt: new Date()
        });
        load.invoiceGenerated = true;
        await load.save();

        // Send file as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
      } catch (error) {
        res.status(500).json({ error: 'Failed to save invoice record' });
      }
    });

    stream.on('error', (error) => {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate invoice' });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: List all invoices for a load
router.get('/load/:loadId', auth, async (req, res) => {
  try {
    const load = await Load.findOne({ loadId: req.params.loadId });
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }

    res.json(load.invoices || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;