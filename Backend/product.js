const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: String, // Allow custom string IDs (e.g., 'p1')
  vendor: { type: String, ref: "User" }, // Changed to String to match User._id
  name: String,
  price: Number,
  category: String,
  stock: Number,
  images: [String],
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
