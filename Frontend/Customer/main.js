// State
window.products = [];
window.cartData = [];
window.orderHistory = [];
window.selectedProduct = null;

window.selectedProduct = null;

function initMockData() {
  // Ensure Orders Exist
  if (!localStorage.getItem('orders')) {
    const defaultOrders = [
      {
        _id: 'ORD-2023-001',
        createdAt: new Date().toISOString(),
        customerName: 'John Doe',
        shippingAddress: { email: 'john@example.com', fullName: 'John Doe', city: 'New York', address: '123 St' },
        items: [{ name: 'SmartWatch', price: 18, qty: 1 }],
        totalAmount: 18,
        status: 'Pending'
      },
      {
        _id: 'ORD-2023-002',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        customerName: 'Alice Smith',
        shippingAddress: { email: 'alice@example.com', fullName: 'Alice Smith', city: 'London', address: '456 Rd' },
        items: [{ name: 'Laptop', price: 350, qty: 1 }, { name: 'Mouse', price: 20, qty: 1 }],
        totalAmount: 370,
        status: 'Shipped'
      }
    ];
    localStorage.setItem('orders', JSON.stringify(defaultOrders));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initMockData(); // Initialize mock data if missing
  loadPage("shop");
  fetchCart(); // Fetch initial cart state
  updateCartCount();
});

// Router
async function loadPage(pageName) {
  const content = document.getElementById("content");

  // Highlight sidebar
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  const activeLink = document.querySelector(`.sidebar li[onclick="loadPage('${pageName}')"]`);
  if (activeLink) activeLink.classList.add("active");

  content.innerHTML = '<div style="text-align:center; padding:50px;">Loading...</div>';

  // Simulate delay
  await new Promise(r => setTimeout(r, 100));

  try {
    if (pageName === 'shop') {
      await fetchProducts();
      content.innerHTML = window.shop();
    } else if (pageName === 'orders') {
      await fetchOrders();
      content.innerHTML = window.orders();
    } else if (pageName === 'cart') {
      fetchCart(); // Refresh cart data
      content.innerHTML = window.cart();
    } else if (pageName === 'checkout') {
      // For now, redirect to checkout page if it's separate, or render inline if checkout.js supports it
      // Based on previous structure, let's try to render inline if checkout.js has a render function
      // But user likely expects a flow. Let's start with a redirect as safest given previous context.
      window.location.href = "Checkout/checkout.html";
    } else if (pageName === 'productDetails') {
      if (!selectedProduct) { loadPage('shop'); return; }
      content.innerHTML = window.renderProductDetails();
    } else {
      console.error("Unknown page:", pageName);
      content.innerHTML = "<h2>Page not found</h2>";
    }
  } catch (err) {
    console.error("Error loading page:", err);
    content.innerHTML = `<h2 style="color:red">Error loading content</h2><p>${err.message}</p>`;
  }
}

// Local Actions
async function fetchProducts() {
  // Read from same store as Admin
  const localProducts = JSON.parse(localStorage.getItem('products')) || [];
  window.products = localProducts;
}

async function fetchOrders() {
  // Read from same store as Admin
  const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
  // Filter for current mock user if needed, or show all for demo
  window.orderHistory = localOrders;
}

async function fetchCart() {
  const localCart = JSON.parse(localStorage.getItem('cart')) || [];
  window.cartData = localCart;
}

// Global Cart Actions
function addToCart(productId) {
  try {
    const product = window.products.find(p => p._id === productId);
    if (!product) return alert("Product error");

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].qty += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        img: product.images?.[0] || "",
        qty: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    fetchCart(); // Update local state
    alert("Added to cart!");

  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Failed to add to cart");
  }
}

function updateCartCount() {
  // Optional: update a badge if it exists
}

function cartTotal() {
  return window.cartData.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2);
}

function openProduct(productId) {
  window.selectedProduct = window.products.find(p => p._id === productId);
  loadPage("productDetails");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadPage("shop");
  fetchCart(); // Fetch initial cart state
  updateCartCount();
});

// Router
async function loadPage(pageName) {
  const content = document.getElementById("content");

  // Highlight sidebar
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  const activeLink = document.querySelector(`.sidebar li[onclick="loadPage('${pageName}')"]`);
  if (activeLink) activeLink.classList.add("active");

  content.innerHTML = '<div style="text-align:center; padding:50px;">Loading...</div>';

  try {
    if (pageName === 'shop') {
      await fetchProducts();
      content.innerHTML = window.shop();
    } else if (pageName === 'orders') {
      await fetchOrders();
      content.innerHTML = window.orders();
    } else if (pageName === 'cart') {
      content.innerHTML = window.cart();
    } else if (pageName === 'checkout') {
      // Checkout is a separate page/view. 
      // Reuse the layout or just redirect if using separate HTML, 
      // but user navigation expects SPA feel. 
      // Let's use the checkout.js logic but rendered here? 
      // Actually, checkout.html exists. Let's redirect to it for now 
      // OR render it inline. The sidebar links to 'loadPage(checkout)'.
      // Let's render the form inline if possible, or redirect.
      // Given the complexity of checkout.js having its own logic, redirecting is safer 
      // unless we refactor checkout.js to return HTML string.
      // Let's redirect for now as it's a full page flow usually.
      window.location.href = "Checkout/checkout.html";
    } else if (pageName === 'productDetails') {
      if (!selectedProduct) { loadPage('shop'); return; }
      content.innerHTML = window.renderProductDetails(); // renaming function to avoid filename clash
    } else {
      console.error("Unknown page:", pageName);
      content.innerHTML = "<h2>Page not found</h2>";
    }
  } catch (err) {
    console.error("Error loading page:", err);
    content.innerHTML = `<h2 style="color:red">Error loading content</h2><p>${err.message}</p>`;
  }
}

// API Actions
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    window.products = await res.json();
  } catch (err) {
    console.error("Failed to fetch products", err);
    window.products = [];
  }
}

async function fetchOrders() {
  try {
    const res = await fetch(`${API_URL}/checkout/my-orders`);
    window.orderHistory = await res.json();
  } catch (err) {
    console.error("Failed to fetch orders", err);
    window.orderHistory = [];
  }
}

async function fetchCart() {
  try {
    const res = await fetch(`${API_URL}/cart/get`);
    const cart = await res.json();
    if (cart && cart.items) {
      window.cartData = cart.items;
    } else {
      window.cartData = [];
    }
  } catch (err) {
    console.error("Failed to fetch cart", err);
    window.cartData = [];
  }
}

// Global Cart Actions
// Global Cart Actions
async function addToCart(productId) {
  try {
    const product = window.products.find(p => p._id === productId);
    if (!product) return alert("Product error");

    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "654321_mock_user_id", // Using the mock ID from backend/server.js
        productId: product._id,
        name: product.name,
        price: product.price,
        img: product.images?.[0] || ""
      })
    });

    const data = await res.json();
    if (data.success) {
      alert("Added to cart!");
      // Optionally update cart count if we had that API
      window.cartData = data.cart.items; // basic sync
    } else {
      alert("Error adding to cart");
    }
  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Failed to add to cart");
  }
}

function updateCartCount() {
  // Optional: update a badge if it exists
}

function cartTotal() {
  return window.cartData.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function openProduct(productId) {
  window.selectedProduct = window.products.find(p => p._id === productId);
  loadPage("productDetails");
}

window.placeOrder = function () {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) return alert("Cart is empty!");

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const newOrder = {
    _id: 'ORD-' + Date.now(),
    createdAt: new Date().toISOString(),
    customerName: 'Customer', // Mock
    shippingAddress: { fullName: 'Customer', address: 'Model Town, Lahore' }, // Mock
    items: cart, // Cart items structure: { name, price, qty ... }
    totalAmount: total,
    finalTotal: total, // For compatibility
    status: 'Pending'
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.unshift(newOrder); // Add to beginning
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear Cart
  localStorage.setItem('cart', JSON.stringify([])); // Empty array instead of null to be safe
  window.cartData = []; // Update local state

  alert("Order Placed Successfully!");
  loadPage('orders');
};
