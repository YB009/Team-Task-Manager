// client/src/api/authApi.js
import axios from "./axiosInstance";

/**
 * Send Firebase ID token to backend,
 * backend will verify it and respond with our app JWT + user.
 */
export const loginWithFirebase = async (idToken) => {
  const res = await axios.post("/api/auth/firebase", { idToken });
  return res.data; // { token, user }
};
