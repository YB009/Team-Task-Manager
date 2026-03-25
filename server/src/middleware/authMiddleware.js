import admin from "../config/firebaseAdmin.js";
import prisma from "../../prisma/client.js";
import { getCache, setCache } from "../utils/cache.js";

const AUTH_CACHE_TTL_MS = 60 * 1000;

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const idToken = authHeader.split(" ")[1];
    const cacheKey = `auth:token:${idToken}`;
    const cached = await getCache(cacheKey);

    if (cached?.user) {
      req.user = cached.user;
      req.firebase = cached.decoded || null;
      return next();
    }

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Load user from DB (findFirst because firebaseUid may not be marked unique in older clients)
    const user = await prisma.user.findFirst({
      where: { firebaseUid: decoded.uid }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    req.firebase = decoded;
    await setCache(cacheKey, { user, decoded }, AUTH_CACHE_TTL_MS);
    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
