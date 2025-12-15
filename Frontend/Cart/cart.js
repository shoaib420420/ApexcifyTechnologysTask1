// -------------------------------
// SERVER-SIDE CART SYSTEM
// -------------------------------

const API_URL = "http://localhost:3000/api";

// Load cart from Server
async function loadCart() {
    try {
        const res = await fetch(`${API_URL} /cart/get`);
        const cart = await res.json();

        displayCart(cart);
    } catch (err) {
        console.error("Error loading cart:", err);
    }
}

// Display cart items
function displayCart(cart) {
    const container = document.getElementById("cartItems");
    const totalBox = document.getElementById("cartTotal");

    if (!container || !totalBox) return;

    container.innerHTML = "";

    // Check if cart is empty or has no items
    if (!cart || !cart.items || cart.items.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalBox.innerText = "Total: £0.00";
        return;
    }

    cart.items.forEach(item => {
        container.innerHTML += `
    < div class="cart-row" >
                <span>${item.name}</span>
                <span>$${item.price}</span>

                <button onclick="decreaseQty('${item.productId}')">-</button>
                <span>${item.qty}</span>
                <button onclick="increaseQty('${item.productId}')">+</button>

                <span>$${item.price * item.qty}</span>

                <button onclick="removeFromCart('${item.productId}')" style="color:red">
                    Remove
                </button>
            </div >
    `;
    });

    totalBox.innerText = "Total: £" + (cart.total || 0).toFixed(2);
}

// Remove item
async function removeFromCart(productId) {
    await fetch(`${API_URL} /cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
    });
    loadCart();
}

// Increase Qty
async function increaseQty(productId) {

    const res = await fetch(`${API_URL} /cart/get`);
    const cart = await res.json();
    const item = cart.items.find(i => i.productId == productId);
    if (item) {
        await updateQty(productId, item.qty + 1);
    }
}

// Decrease Qty
async function decreaseQty(productId) {
    const res = await fetch(`${API_URL} /cart/get`);
    const cart = await res.json();
    const item = cart.items.find(i => i.productId == productId);
    if (item) {
        if (item.qty > 1) {
            await updateQty(productId, item.qty - 1);
        } else {
            await removeFromCart(productId);
        }
    }
}

// Update Qty helper
async function updateQty(productId, qty) {
    await fetch(`${API_URL} /cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty })
    });
    loadCart();
}

// Initial Load
loadCart();

// CHECKOUT FORM
// -------------------------
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Basic Validation could happen here

        const shipping = {
            fullName: document.getElementById("name").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            phone: document.getElementById("phone").value,
            postalCode: "00000" // Added dummy postal if missing or add input
        };

        const res = await fetch(`${API_URL} /checkout/create - order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(shipping)
        });

        const data = await res.json();

        if (data.success) {
            alert("Order placed successfully! Order ID: " + data.orderId);
            loadCart(); // Refresh (should be empty)
            checkoutForm.reset();
        } else {
            alert("Order failed: " + data.message);
        }
    });
}
