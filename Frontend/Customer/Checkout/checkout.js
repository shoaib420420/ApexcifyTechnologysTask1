async function loadCheckout() {
    const res = await fetch("/api/cart/get");
    const cart = await res.json();

    let orderDiv = document.getElementById("orderItems");
    let subtotal = 0;

    cart.items.forEach(item => {
        subtotal += item.price * item.qty;

        orderDiv.innerHTML += `
            <div>
                <p>${item.name} (x${item.qty})</p>
                <p>$${item.price * item.qty}</p>
            </div>
        `;
    });

    const tax = subtotal * 0.05;   // 5%
    const shipping = 10;
    const final = subtotal + tax + shipping;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("tax").innerText = tax.toFixed(2);
    document.getElementById("finalTotal").innerText = final.toFixed(2);
}

loadCheckout();


async function placeOrder() {
    const userData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postalCode").value
    };

    const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (data.success) {
        alert("Order Placed Successfully!");
        window.location.href = "/order-success.html";
    }
}
