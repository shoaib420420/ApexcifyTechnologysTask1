const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Simple Settings Schema (Singleton pattern conceptually)
const settingSchema = new mongoose.Schema({
    key: { type: String, unique: true }, // e.g., 'commission_rate'
    value: mongoose.Schema.Types.Mixed
});
const Setting = mongoose.model("Setting", settingSchema);

// Get Setting
router.get("/:key", async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        res.json({ value: setting ? setting.value : null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update/Set Setting
router.post("/:key", async (req, res) => {
    try {
        const { value } = req.body;
        const setting = await Setting.findOneAndUpdate(
            { key: req.params.key },
            { value },
            { upsert: true, new: true }
        );
        res.json({ success: true, setting });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
