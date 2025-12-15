const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: String,
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            qty: Number,
            image: String
        }
    ],
    total: Number
});

module.exports = mongoose.model("Cart", cartSchema);
