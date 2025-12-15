function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

// Load Pages Dynamically
function loadPage(page) {
    const content = document.getElementById("content");

    // Page templates
    const pages = {
        products: ` <h1>🛍 Product Listing</h1>
        <div class="product-grid">
        <div class="product-card">
            <img src="/images/earphone1.jpg" alt="Product 1">
            <h3>Earphone</h3>
            <p>$25.00</p>
            <button class="btn" onclick="addToCart('P_EAR1', 'Earphone', 25, '/images/earphone1.jpg')">Add to Cart</button>
        </div>

        <div class="product-card">
            <img src="/images/shoes1.jpg" alt="Product 2">
            <h3>Shoes</h3>
            <p>$40.00</p>
            <button class="btn" onclick="addToCart('P_SHOE1', 'Shoes', 40, '/images/shoes1.jpg')">Add to Cart</button>
        </div>

        <div class="product-card">
            <img src="/images/smart.jpg" alt="Product 3">
            <h3>SmartWatch</h3>
            <p>$18.00</p>
            <button class="btn" onclick="addToCart('P_WATCH1', 'SmartWatch', 18, '/images/smart.jpg')">Add to Cart</button>
        </div>

        <div class="product-card">
            <img src="/images/laptop1.jpg" alt="Product 4">
            <h3>Laptop</h3>
            <p>$32.00</p>
            <button class="btn" onclick="addToCart('P_LAP1', 'Laptop', 32, '/images/laptop1.jpg')">Add to Cart</button>
        </div>
        </div>
        `,

        orders: "<h1>📦 Orders</h1><p>Order processing, status updates...</p>",
        vendors: "<h1>🏪 Vendors</h1><p>Vendor profiles, product listings...</p>",
        customers: "<h1>👤 Customers</h1><p>Customer accounts, history...</p>",
        cart: "<h1>🛒 Shopping Cart</h1><p>Items, checkout, payments...</p>", // Note: Use real cart page preferably or load iframe?
        reviews: "<h1>⭐ Customer Reviews</h1><p>Ratings and comments...</p>",
        tracking: "<h1>📍 Order Tracking</h1><p>Live tracking of shipments...</p>",
        notifications: "<h1>🔔 Email Notifications</h1><p>Order alerts, updates...</p>",
    };

    content.innerHTML = pages[page] || "<h1>Page Not Found</h1>";
}

// Global Add to Cart function for Main Page (LocalStorage)
function addToCart(id, name, price, image) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if item exists
        const existingItemIndex = cart.findIndex(item => item.productId === id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].qty += 1;
        } else {
            cart.push({
                productId: id,
                name: name,
                price: parseFloat(price),
                image: image || '',
                qty: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} added to cart!`);
    } catch (err) {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart");
    }
}

// Attach listeners to static HTML buttons
function initCartListeners() {
    const staticButtons = document.querySelectorAll('.product-card .btn10');
    staticButtons.forEach(btn => {
        // Clone to remove old listeners if any (optional but safe)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('p').innerText.replace('£', '');
            const image = card.querySelector('img').getAttribute('src');
            // Generate a simple ID based on name
            const id = 'p_' + name.toLowerCase().replace(/\s/g, '_');

            addToCart(id, name, priceText, image);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCartListeners();
});

// ==========================================
// LIVE SEARCH LOGIC (GRID + DROPDOWN)
// ==========================================

let originalGridContent = '';

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults'); // Dropdown
    const mainGrid = document.getElementById('mainProductGrid');   // Main Grid

    if (mainGrid) {
        originalGridContent = mainGrid.innerHTML;
    }

    if (searchBar) {
        searchBar.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.trim();

            // 1. If query is empty, restore original grid
            if (query.length === 0) {
                if (mainGrid) mainGrid.innerHTML = originalGridContent;
                if (searchResults) {
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                }
                return;
            }

            // 2. Show Loading State in Grid (Simulated)
            if (mainGrid) {
                mainGrid.innerHTML = '<h2 style="text-align:center; width:100%;">Searching...</h2>';
            }

            try {
                // LOCAL DATA SEARCH (No Live API)
                // Define local products matching index.html content
                const localProducts = [
                    { id: 'P_EAR1', title: 'Earphone', price: 25.00, thumbnail: '/images/earphone1.jpg', brand: 'Generic', stock: 50 },
                    { id: 'P_SHOE1', title: 'Shoes', price: 40.00, thumbnail: '/images/shoes1.jpg', brand: 'Nike', stock: 20 },
                    { id: 'P_WATCH1', title: 'SmartWatch', price: 18.00, thumbnail: '/images/smart.jpg', brand: 'Apple', stock: 15 },
                    { id: 'P_LAP1', title: 'Laptop', price: 32.00, thumbnail: '/images/laptop1.jpg', brand: 'Dell', stock: 10 },
                    { id: 'P_EAR3', title: 'EarPhone', price: 32.00, thumbnail: '/images/earphone3.jpg', brand: 'Sony', stock: 30 },
                    { id: 'P_SHOE3', title: 'Shoes', price: 32.00, thumbnail: '/images/shoes3.jpg', brand: 'Adidas', stock: 25 },
                    { id: 'P_SOCK1', title: 'Socks', price: 32.00, thumbnail: '/images/socks.jpg', brand: 'Puma', stock: 100 },
                    { id: 'P_COAT1', title: 'Coat', price: 32.00, thumbnail: '/images/coat.jpg', brand: 'Zara', stock: 5 }
                ];

                // Simulate slight delay for "searching" feel (optional)
                await new Promise(resolve => setTimeout(resolve, 300));

                const lowerQuery = query.toLowerCase();
                const filteredProducts = localProducts.filter(p =>
                    p.title.toLowerCase().includes(lowerQuery) ||
                    p.brand.toLowerCase().includes(lowerQuery)
                );

                // 3. Update Dropdown (Optional, but good for UX)
                if (searchResults) displayDropdownResults(filteredProducts);

                // 4. Update Main Grid
                if (mainGrid) displayGridResults(filteredProducts, mainGrid);

            } catch (error) {
                console.error('Error in local search:', error);
                if (mainGrid) {
                    mainGrid.innerHTML = '<h3 style="text-align:center; color:red; width:100%;">Error loading results. Please try again.</h3>';
                }
            }
        }, 500)); // Increased debounce for grid updates

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (searchResults && !searchBar.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }
});

function displayDropdownResults(products) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (!products || products.length === 0) {
        searchResults.classList.remove('active');
        return;
    }

    // Show top 5 in dropdown
    products.slice(0, 5).forEach(product => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <div class="result-info">
                <h4>${product.title}</h4>
                <p>$${product.price}</p>
            </div>
        `;
        div.addEventListener('click', () => {
            document.getElementById('searchBar').value = product.title;
            // Trigger search? Or just select?
            searchResults.classList.remove('active');
        });
        searchResults.appendChild(div);
    });
    searchResults.classList.add('active');
}

function displayGridResults(products, gridElement) {
    gridElement.innerHTML = '';

    if (!products || products.length === 0) {
        gridElement.innerHTML = '<h3 style="text-align:center; width:100%;">No products found.</h3>';
        return;
    }

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card'; // Reuse existing style
        div.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>£${product.price}</p>
            <button class="btn10" onclick="addToCart('${product.id}', '${product.title}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
        `;
        gridElement.appendChild(div);
    });
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ==========================================
// UNSPLASH LAPTOP SEARCH INTEGRATION
// ==========================================
const ACCESS_KEY = "50942007-3a4eec5410ff38ee3203524e1";

function searchLaptop() {
    const searchInput = document.getElementById("searchBar");
    const query = searchInput.value || "";
    s
    const imageGrid = document.getElementById("imageGrid");
    const heroImage = document.querySelector('.image'); // The big image
    const autoSlider = document.querySelector('.auto-slider'); // The slider

    if (!imageGrid) return;

    // View Switching: Hide Hero content, show Grid
    if (heroImage) heroImage.style.display = 'none';
    if (autoSlider) autoSlider.style.display = 'none';

    imageGrid.style.display = 'grid'; // Enable grid layout
    imageGrid.innerHTML = '<h2 style="width:100%; text-align:center;">Searching Photos...</h2>';

    fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=10&client_id=${ACCESS_KEY}`)
        .then(response => response.json())
        .then(data => {
            imageGrid.innerHTML = '';

            // Add a Header/Back button
            const header = document.createElement('div');
            header.style.gridColumn = "1 / -1";
            header.style.textAlign = "center";
            header.style.marginBottom = "10px";
            header.innerHTML = `
                <h3>Results for "${query}"</h3>
                <button onclick="closeUnsplashSearch()" style="padding:5px 10px; cursor:pointer;">Close</button>
            `;
            imageGrid.appendChild(header);

            if (data.results && data.results.length > 0) {
                data.results.forEach(photo => {
                    const img = document.createElement("img");
                    img.src = photo.urls.small;
                    img.alt = photo.alt_description || "Unsplash Image";
                    imageGrid.appendChild(img);
                });
            } else {
                imageGrid.innerHTML += '<p style="text-align:center; width:100%;">No images found.</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching images:", error);
            imageGrid.innerHTML = '<p style="color:red; text-align:center;">Error fetching images. Check API Key.</p><button onclick="closeUnsplashSearch()">Close</button>';
        });
}

// Restore view function
window.closeUnsplashSearch = function () {
    const heroImage = document.querySelector('.image');
    const autoSlider = document.querySelector('.auto-slider');
    const imageGrid = document.getElementById("imageGrid");

    if (imageGrid) {
        imageGrid.style.display = 'none';
        imageGrid.innerHTML = '';
    }

    if (heroImage) heroImage.style.display = 'block';
    if (autoSlider) autoSlider.style.display = 'block';
}