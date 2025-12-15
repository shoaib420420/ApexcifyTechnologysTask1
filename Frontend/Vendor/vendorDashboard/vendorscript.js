
// ============================================
// VENDOR PANEL SCRIPT (LOCAL STORAGE VERSION)
// ============================================

const VENDOR_ID = "654321654321654321654321"; // Keep mock ID

document.addEventListener("DOMContentLoaded", () => {
  // Ensure data exists (in case user came straight to vendor panel)
  initMockData();

  // Render all sections
  loadDashboard();
  renderProducts();
  renderOrders();
  renderPayouts();
});

// Helper: Init Mock Data (Shared with Admin)
function initMockData() {
  if (!localStorage.getItem('products')) {
    const defaultProducts = [
      { _id: 'p1', name: 'SmartWatch', price: 18.00, stock: 15, images: ['/images/smart.jpg'], vendor: VENDOR_ID },
      { _id: 'p2', name: 'Shoes', price: 40.00, stock: 20, images: ['/images/shoes1.jpg'], vendor: VENDOR_ID },
      { _id: 'p3', name: 'Laptop', price: 350.00, stock: 5, images: ['/images/laptop1.jpg'], vendor: "other_vendor" }
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('orders')) {
    const defaultOrders = [
      {
        _id: 'ORD-2023-001',
        customerName: 'John Doe',
        shippingAddress: { address: '123 St', city: 'NY' },
        items: [{ name: 'SmartWatch', price: 18 }],
        totalAmount: 18,
        status: 'Pending'
      }
    ];
    localStorage.setItem('orders', JSON.stringify(defaultOrders));
  }
}

// Switch sections in dashboard
function showSection(id) {
  document.querySelectorAll(".content-section").forEach(sec => sec.classList.add("hide"));
  const activeSection = document.getElementById(id);
  if (activeSection) activeSection.classList.remove("hide");

  if (document.getElementById("sectionTitle")) {
    document.getElementById("sectionTitle").innerText = id.charAt(0).toUpperCase() + id.slice(1);
  }

  // Sidebar class toggle
  document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
  // This simplistic approach assumes the click event target needs active class
  // Checking if event is defined (might not be if called programmatically)
  if (typeof event !== 'undefined' && event.target) {
    if (event.target.tagName === 'LI') event.target.classList.add("active");
  }
}

// ------------------------------------
// 1. DASHBOARD OVERVIEW
// ------------------------------------
function loadDashboard() {
  try {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Filter for this vendor (Mock logic: matches logic or if property missing assume match for demo)
    const myProducts = products.filter(p => p.vendor === VENDOR_ID || !p.vendor);
    // Mock orders: assume all orders containing 'SmartWatch' or generic are ours
    const myOrders = orders;

    // Calculate Earnings (Mock: 90% of order totals)
    const totalEarnings = myOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0) * 0.9;

    const elProd = document.getElementById("totalProducts");
    const elOrd = document.getElementById("totalOrders");
    const elEarn = document.getElementById("totalEarnings");

    if (elProd) elProd.innerText = myProducts.length;
    if (elOrd) elOrd.innerText = myOrders.length;
    if (elEarn) elEarn.innerText = `$${totalEarnings.toFixed(2)}`;

  } catch (err) {
    console.error("Error loading stats:", err);
  }
}

// ------------------------------------
// 2. MY PRODUCTS
// ------------------------------------
function renderProducts() {
  const tableBody = document.getElementById("productTable");
  if (!tableBody) return;

  tableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  try {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    // Filter
    const myProducts = products.filter(p => p.vendor === VENDOR_ID || !p.vendor);

    if (myProducts.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='6'>No products found. Add one!</td></tr>";
      return;
    }

    tableBody.innerHTML = myProducts.map((p, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${p.images?.[0] || 'https://via.placeholder.com/50'}" width="50" height="50" style="object-fit:cover; border-radius:4px;"></td>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td>Active</td>
                <td>
                    <button class="edit-btn" onclick="deleteLocalProduct('${p._id}')" style="background:red; color:white; border:none; padding:5px;">Delete</button>
                </td>
            </tr>
        `).join("");
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan='6'>Error: ${err.message}</td></tr>`;
  }
}

// Add Product Function
window.addProduct = function () {
  const name = prompt("Enter Product Name:");
  if (!name) return;
  const price = prompt("Enter Price:");
  const image = prompt("Enter Image URL (optional):");

  if (name && price) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = {
      _id: 'p' + Date.now(),
      name,
      price: parseFloat(price),
      stock: 10,
      vendor: VENDOR_ID,
      images: image ? [image] : ['/images/laptop1.jpg'],
      description: "Vendor added product"
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    alert("Product Added!");
    renderProducts();
    loadDashboard();
  }
}

window.deleteLocalProduct = function (id) {
  if (!confirm("Delete this product?")) return;
  let products = JSON.parse(localStorage.getItem('products')) || [];
  products = products.filter(p => p._id !== id);
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts();
  loadDashboard();
}

// ------------------------------------
// 3. ORDERS
// ------------------------------------
function renderOrders() {
  const tbody = document.querySelector("#orders tbody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='4'>Loading orders...</td></tr>";

  try {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    // Mock: Show all orders for demo
    const myOrders = orders;

    if (myOrders.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>No orders found yet.</td></tr>";
      return;
    }

    tbody.innerHTML = myOrders.map(order => `
            <tr>
                <td>#${order._id}</td>
                <td>
                    <strong>${order.customerName}</strong><br>
                    <small>${order.shippingAddress?.address || 'N/A'}</small>
                </td>
                <td>$${order.totalAmount}</td>
                <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
            </tr>
        `).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan='4'>Error: ${err.message}</td></tr>`;
  }
}

// ------------------------------------
// 4. PAYOUTS
// ------------------------------------
function renderPayouts() {
  const tbody = document.querySelector("#payouts tbody");
  if (!tbody) return;

  // Mock data static
  tbody.innerHTML = `
        <tr>
            <td>1001</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>$150</td>
            <td>Paid</td>
        </tr>
     `;
}
