// server/src/utils/generateToken.js
import jwt from "jsonwebtoken";

/**
 * Generate our own app JWT from a user record.
 * Only store non-sensitive info.
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    provider: user.provider,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
