import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [],
  total: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending"
  },
  trackingEvents: []
});

export default mongoose.model("Order", orderSchema);
