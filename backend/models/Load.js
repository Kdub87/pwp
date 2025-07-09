const mongoose = require('mongoose');

const LoadSchema = new mongoose.Schema({
  loadId: { type: String, required: true, unique: true },
  pickupLocation: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  rate: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: { type: String, enum: ['pending', 'in-transit', 'delivered'], default: 'pending' },
  invoiceGenerated: { type: Boolean, default: false },
});

module.exports = mongoose.model('Load', LoadSchema);
