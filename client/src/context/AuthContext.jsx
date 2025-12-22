// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { loginWithFirebase } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null); // user from our backend (Prisma)
  const [token, setToken] = useState(null); // JWT from our backend
  const [loading, setLoading] = useState(true);

  // Watch Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setAppUser(null);
        setToken(null);
        localStorage.removeItem("ttm_token");
        setLoading(false);
        return;
      }

      setFirebaseUser(user);

      // Get fresh Firebase ID token
      const idToken = await user.getIdToken();

      try {
        const data = await loginWithFirebase(idToken);
        setToken(data.token);
        setAppUser(data.user);
        localStorage.setItem("ttm_token", data.token);
      } catch (err) {
        console.error("Error syncing with backend:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    firebaseUser,
    user: appUser,
    token,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
