const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const User = require("./user");
const Product = require("./product");
const Order = require("./orderModel");

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
// Backup API (Injected)
app.post("/api/backup", async (req, res) => {
    try {
        const { users, products, orders } = req.body;
        console.log(`Backup request received: ${users?.length || 0} users, ${products?.length || 0} products, ${orders?.length || 0} orders.`);

        const results = {
            users: { inserted: 0, matched: 0, upserted: 0 },
            products: { inserted: 0, matched: 0, upserted: 0 },
            orders: { inserted: 0, matched: 0, upserted: 0 }
        };

        // 1. Sync Users
        if (users && users.length > 0) {
            const userOps = users.map(user => {
                const filter = user._id ? { _id: user._id } : { email: user.email };
                return {
                    updateOne: {
                        filter: filter,
                        update: { $set: user },
                        upsert: true
                    }
                };
            });
            const userRes = await User.bulkWrite(userOps);
            results.users.inserted = userRes.insertedCount;
            results.users.matched = userRes.matchedCount;
            results.users.upserted = userRes.upsertedCount;
        }

        // 2. Sync Products
        if (products && products.length > 0) {
            const productOps = products.map(product => {
                const filter = product._id ? { _id: product._id } : { name: product.name };
                return {
                    updateOne: {
                        filter: filter,
                        update: { $set: product },
                        upsert: true
                    }
                };
            });
            const productRes = await Product.bulkWrite(productOps);
            results.products.inserted = productRes.insertedCount;
            results.products.matched = productRes.matchedCount;
            results.products.upserted = productRes.upsertedCount;
        }

        // 3. Sync Orders
        if (orders && orders.length > 0) {
            const orderOps = orders.map(order => {
                if (!order._id) return null;
                return {
                    updateOne: {
                        filter: { _id: order._id },
                        update: { $set: order },
                        upsert: true
                    }
                };
            }).filter(op => op !== null);

            if (orderOps.length > 0) {
                const orderRes = await Order.bulkWrite(orderOps);
                results.orders.inserted = orderRes.insertedCount;
                results.orders.matched = orderRes.matchedCount;
                results.orders.upserted = orderRes.upsertedCount;
            }
        }

        res.json({ success: true, message: "Backup completed successfully", results });

    } catch (err) {
        console.error("Backup Error:", err);
        res.status(500).json({ success: false, message: "Backup failed", error: err.message });
    }
});

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
