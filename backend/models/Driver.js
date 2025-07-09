const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  phone: { type: String },
  email: { type: String },
  assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  loads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Load' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', DriverSchema);
