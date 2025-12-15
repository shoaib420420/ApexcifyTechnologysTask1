sendEmail(
  customer.email,
  "Order Update",
  `<p>Your order status is now <b>${order.status}</b></p>`
);
