const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

/**
 * Generate an invoice PDF for a load
 * @param {Object} load - Load object with all details
 * @param {Object} options - Options for invoice generation
 * @returns {Promise<string>} Path to the generated PDF file
 */
async function generateInvoice(load, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Create invoice directory if it doesn't exist
      const invoiceDir = path.join(__dirname, '../invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }
      
      // Set up the PDF document
      const doc = new PDFDocument({ margin: 50 });
      
      // Set up the file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `invoice-${load.loadId}-${timestamp}.pdf`;
      const filePath = path.join(invoiceDir, fileName);
      
      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      // Company info
      doc.fontSize(20).text('PWP Fleet Management', { align: 'center' });
      doc.fontSize(10).text('Peace Way Logistics', { align: 'center' });
      doc.text('123 Trucking Lane, Logistics City, TX 12345', { align: 'center' });
      doc.text('Phone: (555) 123-4567 | Email: billing@pwp.com', { align: 'center' });
      
      // Invoice header
      doc.moveDown(2);
      doc.fontSize(16).text('INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Invoice details
      doc.fontSize(12);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Invoice #: INV-${load.loadId}`);
      doc.text(`Load ID: ${load.loadId}`);
      doc.moveDown();
      
      // Customer info (if available)
      if (options.customer) {
        doc.text('Bill To:');
        doc.text(options.customer.name || 'Customer');
        if (options.customer.address) doc.text(options.customer.address);
        if (options.customer.email) doc.text(`Email: ${options.customer.email}`);
        doc.moveDown();
      }
      
      // Load details
      doc.text('Load Details:');
      doc.text(`Pickup: ${load.pickupLocation}`);
      doc.text(`Delivery: ${load.deliveryLocation}`);
      doc.text(`Pickup Date: ${new Date(load.pickupDate).toLocaleDateString()}`);
      doc.text(`Delivery Date: ${new Date(load.deliveryDate).toLocaleDateString()}`);
      if (load.distance) doc.text(`Distance: ${load.distance} miles`);
      doc.moveDown();
      
      // Invoice table
      const invoiceTableTop = doc.y;
      doc.font('Helvetica-Bold');
      
      // Table headers
      doc.text('Description', 50, invoiceTableTop);
      doc.text('Amount', 400, invoiceTableTop, { width: 90, align: 'right' });
      doc.moveDown();
      doc.font('Helvetica');
      
      // Line items
      let y = doc.y;
      doc.text(`Freight charges for Load ${load.loadId}`, 50, y);
      doc.text(`$${load.rate.toFixed(2)}`, 400, y, { width: 90, align: 'right' });
      
      // Add additional charges if provided
      let totalAmount = load.rate;
      if (options.additionalCharges && options.additionalCharges.length > 0) {
        options.additionalCharges.forEach(charge => {
          y += 20;
          doc.text(charge.description, 50, y);
          doc.text(`$${charge.amount.toFixed(2)}`, 400, y, { width: 90, align: 'right' });
          totalAmount += charge.amount;
        });
      }
      
      // Total
      y += 30;
      doc.moveTo(50, y).lineTo(500, y).stroke();
      y += 10;
      doc.font('Helvetica-Bold');
      doc.text('Total', 50, y);
      doc.text(`$${totalAmount.toFixed(2)}`, 400, y, { width: 90, align: 'right' });
      
      // Payment terms
      doc.moveDown(2);
      doc.font('Helvetica');
      doc.text('Payment Terms: Net 30 days');
      doc.text('Please make checks payable to Peace Way Logistics');
      doc.text('Thank you for your business!');
      
      // Finalize the PDF
      doc.end();
      
      // When the stream is finished, resolve with the file path
      stream.on('finish', () => {
        resolve(filePath);
      });
      
      // Handle errors
      stream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoice };