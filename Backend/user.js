const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "vendor", "customer"], default: "customer" },
  approved: { type: Boolean, default: false },
  storeName: String,
  commissionRate: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
