const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: String,
    items: Array,
    subtotal: Number,
    shipping: Number,
    tax: Number,
    finalTotal: Number,
    shippingAddress: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postalCode: String
    },
    status: { type: String, default: "Pending" },
    trackingNumber: String,
    shippingProvider: String,
    paymentMethod: { type: String, default: "Credit Card" },
    customerName: String, // Denormalized for easier search
    history: [
        {
            status: String,
            date: { type: Date, default: Date.now },
            comment: String
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
