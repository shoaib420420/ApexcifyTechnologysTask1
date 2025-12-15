const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  price: Number,
  category: String,
  stock: Number,
  images: [String],
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
