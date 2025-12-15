const express = require("express");
const router = express.Router();
const Product = require("./product");
const Order = require("./orderModel");

// Get All Products (Filter by Vendor)
router.get("/", async (req, res) => {
    try {
        const { vendor } = req.query;
        const query = vendor ? { vendor } : {};
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vendor Dashboard Stats
router.get("/vendor_stats/:vendorId", async (req, res) => {
    try {
        const { vendorId } = req.params;
        const products = await Product.find({ vendor: vendorId });
        const productIds = products.map(p => p._id.toString());

        const productCount = products.length;

        // Calculate Orders & Earnings dynamically
        // 1. Fetch all orders
        const allOrders = await Order.find();

        // 2. Filter orders that contain any of the vendor's products
        let vendorOrders = 0;
        let vendorEarnings = 0;

        allOrders.forEach(order => {
            let orderHasVendorProduct = false;
            order.items.forEach(item => {
                // Checkout usually stores: { productId:..., name:..., price:... }
                if (item.productId && productIds.includes(item.productId.toString())) {
                    orderHasVendorProduct = true;
                    vendorEarnings += (item.price * (item.qty || 1));
                }
            });
            if (orderHasVendorProduct) vendorOrders++;
        });

        res.json({
            productCount,
            totalOrders: vendorOrders,
            totalEarnings: vendorEarnings
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get Vendor Specific Orders
router.get("/vendor_orders/:vendorId", async (req, res) => {
    try {
        const { vendorId } = req.params;
        const products = await Product.find({ vendor: vendorId });
        const productIds = products.map(p => p._id.toString());

        const allOrders = await Order.find().sort({ createdAt: -1 });
        const vendorOrderList = [];

        allOrders.forEach(order => {
            let orderTotalForVendor = 0;
            let hasVendorProduct = false;

            order.items.forEach(item => {
                if (item.productId && productIds.includes(item.productId.toString())) {
                    hasVendorProduct = true;
                    orderTotalForVendor += (item.price * (item.qty || 1));
                }
            });

            if (hasVendorProduct) {
                vendorOrderList.push({
                    _id: order._id,
                    customerName: order.shippingAddress ? order.shippingAddress.fullName : "Guest",
                    shippingAddress: order.shippingAddress, // Added shipping info
                    totalAmount: orderTotalForVendor,
                    status: order.status,
                    createdAt: order.createdAt
                });
            }
        });

        res.json(vendorOrderList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Product
router.post("/add", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json({ success: true, product: newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, product: updatedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Product
router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
