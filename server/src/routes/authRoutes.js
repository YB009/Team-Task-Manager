import express from "express";
import { firebaseAuth, logout } from "../controllers/authController.js";
import { verifyAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/firebase
router.post("/firebase", firebaseAuth);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me (protected)
router.get("/me", verifyAuth, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/test (public ping)
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

export default router;
