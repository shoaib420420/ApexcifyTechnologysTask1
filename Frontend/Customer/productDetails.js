window.productDetails = function () {
  if (!selectedProduct) return "<h3>No product selected.</h3>";

  return `
    <h2>${selectedProduct.name}</h2>
    <img src="${selectedProduct.img}" style="width:250px;border-radius:8px;">
    <p>Price: $${selectedProduct.price}</p>
    <button class="btn" onclick="addToCart(${selectedProduct.id})">Add to Cart</button>
  `;
};
