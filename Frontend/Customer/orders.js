window.orders = function () {
  if (!window.orderHistory || window.orderHistory.length === 0) {
    return "<h2>My Orders</h2><p>No orders found.</p>";
  }

  return `
    <h2>Order History</h2>
    <table>
      <thead>
        <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${window.orderHistory.map(o => `
          <tr>
            <td>#${o._id ? o._id.slice(-6).toUpperCase() : o.id}</td>
            <td>${new Date(o.createdAt).toLocaleDateString()}</td>
            <td>$${o.finalTotal || o.total || o.totalAmount}</td>
            <td><span style="padding:4px 8px; border-radius:4px; background:${o.status === 'Pending' ? '#fff3cd' : '#d1fae5'}">${o.status}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
};
