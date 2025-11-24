const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: String,
  email: String,
  phone: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
