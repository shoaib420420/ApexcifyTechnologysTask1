window.shop = function () {
  if (!window.products || window.products.length === 0) {
    return "<h2 class='text-center'>Available Products</h2><p style='text-align:center; margin-top:20px;'>No products available.</p>";
  }

  return `
    <h2 style="text-align:center; margin-bottom:30px;">Available Products</h2>
    <div class="grid">
      ${window.products.map(p => `
        <div class="card">
          <img src="${p.images?.[0] || 'https://via.placeholder.com/200'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
          <h3>${p.name}</h3>
          <p style="color:#166534; font-weight:bold; margin: 10px 0;">$${p.price}</p>
          <button class="btn btn-success" style="width:100%;" onclick="addToCart('${p._id}')">Add to Cart</button>
        </div>
      `).join("")}
    </div>
  `;
};
