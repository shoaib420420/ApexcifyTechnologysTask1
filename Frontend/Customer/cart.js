window.cart = function () {
  let rows = "";

  cartData.forEach(item => {
    rows += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>$${item.price}</td>
        <td>$${item.qty * item.price}</td>
      </tr>
    `;
  });

  return `
    <h2>Your Cart</h2>
    <table>
      <thead>
        <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p><strong>Total: $${cartTotal()}</strong></p>
    <button class="btn" onclick="loadPage('checkout')">Checkout</button>
  `;
};
