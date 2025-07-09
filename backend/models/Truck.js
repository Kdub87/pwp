const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
  truckId: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  loads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Load' }],
  status: { type: String, enum: ['available', 'in-use', 'maintenance', 'out-of-service'], default: 'available' },
  capacity: { type: Number },
  fuelType: { type: String, enum: ['diesel', 'gas', 'electric'], default: 'diesel' },
  mileage: { type: Number, default: 0 },
  lastMaintenance: { type: Date },
  nextMaintenance: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Truck', TruckSchema);
