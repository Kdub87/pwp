const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String },
  assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  loads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Load' }],
  status: { type: String, enum: ['available', 'on-duty', 'off-duty', 'maintenance'], default: 'available' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', DriverSchema);
