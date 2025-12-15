const express = require("express");
const router = express.Router();
const Cart = require("./cartModel.js");

// Get Cart
router.get("/get", async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart);
});

// Add to Cart
router.post("/add", async (req, res) => {
    const { productId, name, price, img, image } = req.body; // Accept img or image
    const finalImage = img || image || "";

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
        cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existing = cart.items.find(i => i.productId == productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.items.push({ productId, name, price, qty: 1, image: finalImage });
    }

    cart.total = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);

    await cart.save();
    res.json({ success: true, cart });
});

// Update Qty
router.post("/update", async (req, res) => {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });

    const item = cart.items.find(i => i.productId == productId);
    item.qty = qty;

    cart.total = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);

    await cart.save();
    res.json(cart);
});

// Remove Item
router.post("/remove", async (req, res) => {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });

    cart.items = cart.items.filter(i => i.productId != productId);

    cart.total = cart.items.reduce((acc, item) => acc + item.price * item.qty, 0);

    await cart.save();
    res.json(cart);
});

module.exports = router;
