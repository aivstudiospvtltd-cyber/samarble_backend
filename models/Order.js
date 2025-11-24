const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  email: String,
  fullName: String,
  phone: String,
  address: String,
  type: { type: String, enum: ['product','service'] },
  productType: String,
  itemName: String,
  size: String,
  details: String,
  status: { type: String, enum: ['new','processed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
