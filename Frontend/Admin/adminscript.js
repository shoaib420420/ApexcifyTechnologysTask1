
// ============================================
// ADMIN PANEL SCRIPT (LOCAL STORAGE VERSION)
// ============================================

// Initialize Data on Load
document.addEventListener('DOMContentLoaded', () => {
    initMockData();
    // Default load Dashboard or Users
    loadPage('dashboard');
});

function initMockData() {
    // 1. Users
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { _id: 'u1', name: 'Admin User', email: 'admin@example.com', role: 'admin', isActive: true },
            { _id: 'u2', name: 'John Doe', email: 'john@example.com', role: 'customer', isActive: true },
            { _id: 'u3', name: 'Jane Vendor', email: 'jane@store.com', role: 'vendor', isActive: true, storeName: 'Jane\'s Tech' },
            { _id: 'u4', name: 'Suspended User', email: 'bad@actor.com', role: 'customer', isActive: false }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // 2. Products
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            { _id: 'p1', name: 'SmartWatch', price: 18.00, stock: 15, images: ['/images/smart.jpg'] },
            { _id: 'p2', name: 'Shoes', price: 40.00, stock: 20, images: ['/images/shoes1.jpg'] },
            { _id: 'p3', name: 'Laptop', price: 350.00, stock: 5, images: ['/images/laptop1.jpg'] },
            { _id: 'p4', name: 'EarPhone', price: 25.00, stock: 50, images: ['/images/earphone1.jpg'] }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    // 3. Orders
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

// ============================================
// CORE NAVIGATION
// ============================================
async function loadPage(page) {
    const content = document.getElementById("content");
    content.innerHTML = "<h1>Loading...</h1>";

    // Simulate small delay for realism
    await new Promise(r => setTimeout(r, 200));

    try {
        if (page === 'dashboard') renderDashboard(content);
        else if (page === 'users') renderUsers(content);
        else if (page === 'products_control') renderProductControl(content);
        else if (page === 'orders_control') renderOrderControl(content);
        else if (page === 'payments') renderPayments(content);
        else if (page === 'vendors') renderVendors(content);
        else if (page === 'settings') renderSettings(content);
    } catch (err) {
        content.innerHTML = `<h1>Error Loading Page</h1><p>${err.message}</p>`;
    }
}

// ============================================
// 1. DASHBOARD
// ============================================
function renderDashboard(container) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Calculate Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

    container.innerHTML = `
        <h1>Dashboard Overview</h1>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Users</h3>
                <p>${users.length}</p>
            </div>
            <div class="stat-card">
                <h3>Total Products</h3>
                <p>${products.length}</p>
            </div>
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <p class="text-success">$${totalRevenue.toFixed(2)}</p>
            </div>
            <div class="stat-card">
                <h3>Total Orders</h3>
                <p>${orders.length}</p>
            </div>
        </div>
    `;
}

// ============================================
// 2. USER CONTROL
// ============================================
function renderUsers(container) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const suspendedUsers = totalUsers - activeUsers;

    const rows = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role.toUpperCase()}</td>
            <td>${u.isActive ? '<span style="color:green">Active</span>' : '<span style="color:red">Suspended</span>'}</td>
            <td>
                <button class="btn btn-sm" onclick="editUser('${u._id}')" style="background:#f39c12;">Edit</button>
                <button class="btn btn-sm" onclick="toggleUserStatus('${u._id}')" style="background:${u.isActive ? '#e74c3c' : '#2ecc71'};">
                    ${u.isActive ? 'Suspend' : 'Activate'}
                </button>
                <button class="btn btn-sm" onclick="deleteUser('${u._id}')" style="background:#c0392b;">Delete</button>
            </td>
        </tr>
    `).join("");

    container.innerHTML = `
        <h1>User Management</h1>
        <div class="stats-grid">
            <div class="stat-card"><h3>Total</h3><p>${totalUsers}</p></div>
            <div class="stat-card"><h3>Active</h3><p class="text-success">${activeUsers}</p></div>
            <div class="stat-card"><h3>Suspended</h3><p class="text-danger">${suspendedUsers}</p></div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2>All Users</h2>
                <button class="btn btn-primary" onclick="toggleUserForm()">+ Add New User</button>
            </div>
            
            <div id="addUserForm" class="form-container" style="display:none;">
                <h3 id="formTitle">Add New User</h3>
                <input type="hidden" id="uId">
                <div class="grid-2">
                    <div class="form-group"><label>Name</label><input type="text" id="uName"></div>
                    <div class="form-group"><label>Email</label><input type="email" id="uEmail"></div>
                    <div class="form-group"><label>Role</label>
                        <select id="uRole">
                            <option value="customer">Customer</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                <button onclick="saveUser()" class="btn btn-success mt-2">Save User</button>
                <button onclick="toggleUserForm()" class="btn btn-secondary mt-2">Cancel</button>
            </div>

            <div class="table-responsive">
                <table class="table">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;

    // Expose helpers globally
    window.toggleUserForm = () => {
        const form = document.getElementById("addUserForm");
        form.style.display = form.style.display === "none" ? "block" : "none";
        // Convert to Add Mode if it was Edit
        if (form.style.display === "none") {
            document.getElementById("uId").value = "";
            document.getElementById("uName").value = "";
            document.getElementById("uEmail").value = "";
            document.getElementById("formTitle").innerText = "Add New User";
        }
    };
}

window.saveUser = function () {
    const id = document.getElementById("uId").value;
    const name = document.getElementById("uName").value;
    const email = document.getElementById("uEmail").value;
    const role = document.getElementById("uRole").value;

    if (!name || !email) return alert("All fields are required");

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (id) {
        // Edit
        const idx = users.findIndex(u => u._id === id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], name, email, role };
        }
    } else {
        // Add
        const newUser = {
            _id: 'u' + Date.now(),
            name, email, role, isActive: true
        };
        users.push(newUser);
    }

    localStorage.setItem('users', JSON.stringify(users));
    alert("User Saved!");
    loadPage('users');
}

window.deleteUser = function (id) {
    if (!confirm("Delete this user?")) return;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u._id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    loadPage('users');
}

window.editUser = function (id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u._id === id);
    if (!user) return;

    document.getElementById("uId").value = user._id;
    document.getElementById("uName").value = user.name;
    document.getElementById("uEmail").value = user.email;
    document.getElementById("uRole").value = user.role;
    document.getElementById("formTitle").innerText = "Edit User";

    document.getElementById("addUserForm").style.display = "block";
    window.scrollTo(0, 0);
}

window.toggleUserStatus = function (id) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u._id === id);
    if (idx !== -1) {
        users[idx].isActive = !users[idx].isActive;
        localStorage.setItem('users', JSON.stringify(users));
        loadPage('users');
    }
}

// ============================================
// 3. PRODUCT CONTROL
// ============================================
function renderProductControl(container) {
    container.innerHTML = `
        <h1>Product Control</h1>
        <div id="sub-content"></div>
    `;
    renderProducts(document.getElementById('sub-content'));
}

function renderProducts(container) {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const rows = products.map(p => `
        <tr>
            <td>
                 Start
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.images?.[0] || ''}" width="40" height="40" style="object-fit:cover; border-radius:4px;"> 
                    <span>${p.name}</span>
                </div>
            </td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id}')">Delete</button></td>
        </tr>
    `).join("");

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2>Product List</h2>
                <button class="btn btn-primary" onclick="addProductMock()">+ Add Product</button>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
                    <tbody>
                        ${rows.length ? rows : '<tr><td colspan="4" style="text-align:center;">No products.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window.addProductMock = function () {
    const name = prompt("Product Name:");
    if (!name) return;
    const price = prompt("Price:", "10.00");
    const stock = prompt("Stock:", "100");

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({
        _id: 'p' + Date.now(),
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        images: ['/images/laptop1.jpg'] // Default image for mock
    });
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts(document.getElementById('sub-content'));
}

window.deleteProduct = function (id) {
    if (!confirm("Delete product?")) return;
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p._id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts(document.getElementById('sub-content'));
}

// ============================================
// 4. ORDER CONTROL
// ============================================
function renderOrderControl(container) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    const rows = orders.map(o => `
        <tr>
            <td>${o._id}</td>
            <td>${o.customerName}</td>
            <td>$${o.totalAmount}</td>
            <td><span class="badge badge-${o.status === 'Pending' ? 'warning' : 'success'}">${o.status}</span></td>
            <td><button class="btn btn-sm" onclick="viewOrder('${o._id}')" style="background:#3498db;">View / Edit</button></td>
        </tr>
    `).join("");

    container.innerHTML = `
        <h1>Order Control</h1>
        <div class="card">
            <div class="table-responsive">
                <table class="table">
                    <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
        
        <!-- Modal for View/Edit -->
        <div id="orderModal" class="modal-overlay">
            <div class="modal-content">
                <div id="orderModalContent"></div>
                <div style="text-align: right; margin-top: 20px;">
                    <button onclick="document.getElementById('orderModal').style.display='none'" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    `;
}

window.viewOrder = function (id) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o._id === id);
    if (!order) return;

    const modal = document.getElementById("orderModal");
    const content = document.getElementById("orderModalContent");

    content.innerHTML = `
        <h2>Order ${order._id}</h2>
        <p><b>Customer:</b> ${order.customerName}</p>
        <p><b>Items:</b> ${order.items.map(i => i.name).join(", ")}</p>
        <p><b>Total:</b> $${order.totalAmount}</p>
        <hr>
        <label>Update Status:</label>
        <select id="newStatus">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
        <button class="btn btn-success" onclick="updateOrderStatus('${order._id}')">Update</button>
    `;
    modal.style.display = "flex";
}

window.updateOrderStatus = function (id) {
    const status = document.getElementById("newStatus").value;
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const idx = orders.findIndex(o => o._id === id);
    if (idx !== -1) {
        orders[idx].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        alert("Status Updated!");
        loadPage('orders_control');
        document.getElementById("orderModal").style.display = 'none';
    }
}

// ============================================
// 5. OTHER PAGES
// ============================================
function renderPayments(container) {
    container.innerHTML = "<h1>Payments</h1><p>Mock Payment Data...</p>";
}

function renderVendors(container) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const vendors = users.filter(u => u.role === 'vendor');

    container.innerHTML = `<h1>Vendor List</h1><ul>${vendors.map(v => `<li>${v.name} (${v.storeName || 'No Store'}) - ${v.email}</li>`).join('')}</ul>`;
}

function renderSettings(container) {
    container.innerHTML = "<h1>Settings</h1><p>System settings here...</p>";
}
