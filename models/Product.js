const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: Number,
  // Support multiple images for products (max 3). Keep `image` for compatibility (first image).
  images: [String],
  image: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
