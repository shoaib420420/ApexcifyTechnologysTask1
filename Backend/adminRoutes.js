const express = require("express");
const router = express.Router();
const User = require("./user");
const Product = require("./product");
const Order = require("./orderModel");

// Get Dashboard Stats
router.get("/stats", async (req, res) => {
    try {
        const vendorCount = await User.countDocuments({ role: "vendor" });
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        // Calculate Total Revenue
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + (order.finalTotal || 0), 0);

        res.json({
            vendorCount,
            productCount,
            orderCount,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Vendors (Pending & Approved)
router.get("/vendors", async (req, res) => {
    try {
        const vendors = await User.find({ role: "vendor" });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve/Reject Vendor
router.put("/vendor/:id/status", async (req, res) => {
    const { status } = req.body; // true (approve) or false (reject/ban)
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { approved: status }, { new: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Orders (Enhanced Search & Filter)
router.get("/orders", async (req, res) => {
    try {
        const { q, status } = req.query;
        let query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (q) {
            query.$or = [
                { _id: q }, // Direct ID match (if valid ObjectId, but let's assume loose string match might need better handling or exact ID)
                { customerName: { $regex: q, $options: "i" } },
                { "shippingAddress.email": { $regex: q, $options: "i" } }
            ];
            // If q is valid ObjectId, add it to OR
            // For simplicity in this demo, regex on string fields is fine. 
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Order Status
router.put("/orders/:id/status", async (req, res) => {
    try {
        const { status, comment } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status;
        order.history.push({
            status: status,
            comment: comment || `Status updated to ${status}`
        });

        await order.save();

        // MOCK NOTIFICATION
        console.log(`[NOTIFICATION] Sending Email to ${order.shippingAddress.email}: Order is now ${status}`);

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Tracking Info
router.put("/orders/:id/tracking", async (req, res) => {
    try {
        const { trackingNumber, shippingProvider } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id,
            { trackingNumber, shippingProvider },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ------------------------------------------
// USER CONTROL (Admin)
// ------------------------------------------

// Get All Users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add New User (Admin)
router.post("/users/add", async (req, res) => {
    try {
        const { name, email, password, role, storeName } = req.body;
        // In a real app, hash password here!
        const newUser = new User({ name, email, password, role, storeName });
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User
router.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.put("/users/:id/password", async (req, res) => {
    try {
        const { password } = req.body;
        // In real app, hash here
        await User.findByIdAndUpdate(req.params.id, { password });
        res.json({ success: true, message: "Password updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
