const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
  truckId: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true },
  model: { type: String },
  year: { type: Number },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  loads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Load' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Truck', TruckSchema);
