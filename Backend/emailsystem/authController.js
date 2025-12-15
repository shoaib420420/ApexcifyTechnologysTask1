import { sendEmail } from "../utils/sendEmail.js";

export const registerVendor = async (req, res) => {
  const { name, email, password, storeName } = req.body;

  // Save vendor in DB (simplified here)

  sendEmail(
    email,
    "Your Vendor Application Submitted",
    `<h2>Hello ${name},</h2>
     <p>Your vendor registration has been received.</p>
     <p>Admin will approve your account soon.</p>`
  );

  res.json({ msg: "Vendor registered, email sent." });
};
