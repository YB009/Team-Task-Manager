// server/src/utils/sessionHelpers.js

/**
 * Clear auth/session cookies (if any).
 * Adjust names here if you add custom cookies later.
 */
export const clearAuthCookies = (res) => {
  res.clearCookie("connect.sid", { path: "/" });
};
