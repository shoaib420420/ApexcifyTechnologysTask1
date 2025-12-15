const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerName: String,
    reason: String,
    status: { type: String, default: "Open" }, // Open, Resolved
    date: { type: Date, default: Date.now }
});
const Dispute = mongoose.model("Dispute", disputeSchema);

// Get All Disputes
router.get("/", async (req, res) => {
    try {
        const disputes = await Dispute.find().sort({ date: -1 });
        res.json(disputes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Resolve Dispute
router.put("/:id/resolve", async (req, res) => {
    try {
        await Dispute.findByIdAndUpdate(req.params.id, { status: "Resolved" });
        res.json({ success: true, message: "Dispute resolved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mock Create (for testing)
router.post("/create", async (req, res) => {
    try {
        const newDispute = new Dispute(req.body);
        await newDispute.save();
        res.json(newDispute);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
