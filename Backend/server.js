const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();

const cartRoutes = require("./cartRoutes");
const checkoutRoutes = require("./checkoutRoutes");
const adminRoutes = require("./adminRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const settingsRoutes = require("./settingsRoutes");

const disputeRoutes = require("./disputeRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: "*",            // allow ALL frontends
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());

// Mock Auth Middleware (Temporary until full Auth is implemented)
// This ensures cart/checkout routes don't crash accessing req.user.id
app.use((req, res, next) => {
    req.user = { id: "654321_mock_user_id" };
    next();
});

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/task1DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/disputes", disputeRoutes);

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, "../Frontend")));

// Fallback to index.html for SPA-like navigation (if needed, or just let static handle it)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
