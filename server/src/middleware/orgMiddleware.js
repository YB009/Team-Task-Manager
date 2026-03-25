import prisma from "../../prisma/client.js";
import { getCache, setCache } from "../utils/cache.js";

const ORG_MEMBERSHIP_CACHE_TTL_MS = 30 * 1000;

// Ensure the user belongs to the org and cache membership on the request
export const requireOrgAccess = async (req, res, next) => {
  try {
    const orgId = req.params?.orgId || req.body?.orgId || req.query?.orgId;

    if (!orgId) {
      return res.status(400).json({ message: "Organization ID required" });
    }

    const cacheKey = `membership:${req.user.id}:${orgId}`;
    let membership = await getCache(cacheKey);

    if (!membership) {
      membership = await prisma.membership.findFirst({
        where: {
          userId: req.user.id,
          organizationId: orgId
        }
      });

      if (membership) {
        await setCache(cacheKey, membership, ORG_MEMBERSHIP_CACHE_TTL_MS);
      }
    }

    if (!membership) {
      return res.status(403).json({ message: "Access denied to this organization" });
    }

    req.orgId = orgId;
    req.membership = membership;
    next();

  } catch (error) {
    console.error("ORG AUTH ERROR:", error);
    res.status(403).json({ message: "Forbidden" });
  }
};
