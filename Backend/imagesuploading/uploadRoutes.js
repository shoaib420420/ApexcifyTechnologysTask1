import express from "express";
import upload from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/product-image", auth, upload.single("image"), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

export default router;
