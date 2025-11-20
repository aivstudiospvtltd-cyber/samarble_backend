const mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', ProductCategorySchema);
