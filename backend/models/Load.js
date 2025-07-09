const mongoose = require('mongoose');

const LoadSchema = new mongoose.Schema({
  loadId: { type: String, required: true, unique: true },
  pickupLocation: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  rate: { type: Number, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  status: { type: String, enum: ['pending', 'assigned', 'in-transit', 'delivered', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  distance: { type: Number },
  weight: { type: Number },
  invoiceGenerated: { type: Boolean, default: false },
  documents: [{ 
    path: String, 
    name: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now } 
  }],
  invoices: [{ 
    path: String, 
    createdAt: { type: Date, default: Date.now } 
  }],
  updateRequests: [{ 
    requestedAt: { type: Date, default: Date.now },
    message: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LoadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Load', LoadSchema);
