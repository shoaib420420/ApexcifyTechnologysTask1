const express = require("express");
const router = express.Router();
const Cart = require("./cartModel.js");
const Order = require("./orderModel.js");

// Create Order
router.post("/create-order", async (req, res) => {
    const { fullName, email, phone, address, city, postalCode } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.json({ success: false, message: "Cart is empty" });

    const tax = cart.total * 0.05;
    const shipping = 10;
    const finalTotal = cart.total + tax + shipping;

    const order = new Order({
        userId: req.user.id,
        items: cart.items,
        subtotal: cart.total,
        shipping,
        tax,
        finalTotal,
        shippingAddress: {
            fullName, email, phone, address, city, postalCode
        }
    });

    await order.save();

    // Clear cart after order placed
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({ success: true, orderId: order._id });
});

// Get My Orders
router.get("/my-orders", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
