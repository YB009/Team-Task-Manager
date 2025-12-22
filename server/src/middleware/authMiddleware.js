// server/src/middleware/authMiddleware.js
import admin from "../config/firebaseAdmin.js";
import prisma from "../../prisma/client.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split(" ")[1];

    if (!idToken) return res.status(401).json({ message: "No token provided" });

    // 1. Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // 2. Find user in database
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
