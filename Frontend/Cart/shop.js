// -------------------------
// PRODUCTS (Dynamic or from backend later)
// -------------------------
const products = [
    {
        id: "P001",
        name: "Laptop",
        price: 750,
        image: "https://via.placeholder.com/150"
    },
    {
        id: "P002",
        name: "Mouse",
        price: 20,
        image: "https://via.placeholder.com/150"
    },
    {
        id: "P003",
        name: "Keyboard",
        price: 35,
        image: "https://via.placeholder.com/150"
    }
];

// -------------------------
// ADD TO CART (API)
// -------------------------
async function addToCart(product) {
    try {
        const res = await fetch("http://localhost:3000/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            })
        });

        const data = await res.json();
        if (data) {
            alert(`${product.name} added to cart!`);
        }
    } catch (err) {
        console.error("Error adding to cart:", err);
        alert("Failed to add to cart");
    }
}

// -------------------------
// DISPLAY PRODUCTS
// -------------------------
function loadProducts() {
    const list = document.getElementById("product-list");

    if (!list) return;

    products.forEach(p => {
        // Escaping single quotes in JSON.stringify to avoid breaking HTML
        const productData = JSON.stringify(p).replace(/'/g, "&#39;");
        list.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>$${p.price}</p>
                <button onclick='addToCart(${productData})'>Add to Cart</button>
            </div>
        `;
    });
}

loadProducts();
