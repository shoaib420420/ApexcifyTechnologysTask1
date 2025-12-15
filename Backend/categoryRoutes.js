const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Simple Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, unique: true }
});
const Category = mongoose.model("Category", categorySchema);

// Get All Categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Category
router.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name required" });

        const newCat = new Category({ name });
        await newCat.save();
        res.json({ success: true, category: newCat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Category
router.delete("/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
