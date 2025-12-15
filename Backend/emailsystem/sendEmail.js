import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"MultiVendor Marketplace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: message
    });
    console.log("Email sent");
  } catch (error) {
    console.error("Email error:", error);
  }
};
