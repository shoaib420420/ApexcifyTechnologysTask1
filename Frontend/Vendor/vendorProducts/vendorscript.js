let vendorProducts = [
  { id: 1, name: "Bluetooth Speaker", price: 60 },
  { id: 2, name: "Smart Watch", price: 120 },
  { id: 3, name: "Headphones", price: 40 }
];

function loadProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  vendorProducts.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <h3>${p.name}</h3>
        <p>Price: $${p.price}</p>
        <button onclick="editProduct(${p.id})">Edit</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}

function deleteProduct(id) {
  vendorProducts = vendorProducts.filter(p => p.id !== id);
  loadProducts();
}

function editProduct(id) {
  alert("Open edit form for Product ID: " + id);
}

loadProducts();
