import { isRoleAllowed } from "../utils/permissions.js";

// Requires req.membership to be set (from org middleware) before this runs
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.membership) {
      return res.status(500).json({ message: "Membership context missing for role check" });
    }

    if (!isRoleAllowed(req.membership, roles)) {
      return res.status(403).json({ message: "Insufficient role for this organization" });
    }

    next();
  };
};
