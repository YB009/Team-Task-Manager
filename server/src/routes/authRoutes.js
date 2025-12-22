import express from "express";
import { firebaseAuth } from "../controllers/authController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/firebase", firebaseAuth);

// ✔ Protected route
router.get("/me", verifyAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
