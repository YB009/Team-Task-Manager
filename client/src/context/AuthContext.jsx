// client/src/context/AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../api/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { loginWithFirebase } from "../api/authApi";
import { acceptTeamInvite } from "../api/teamApi";
import axios from "../api/axiosInstance";

// Fix for Safari/Mobile: Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

const INVITE_STORAGE_KEY = "ttm_invite_token";
const ACTIVE_ORG_STORAGE_KEY = "ttm_active_org";
const AVATAR_STORAGE_KEY = "ttm_avatar_url";
const AUTH_CACHE_STORAGE_KEY = "ttm_auth_cache";

const AuthContext = createContext(null);

const readAuthCache = () => {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeAuthCache = (value) => {
  try {
    localStorage.setItem(AUTH_CACHE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
};

const clearAuthCache = () => {
  try {
    localStorage.removeItem(AUTH_CACHE_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
};

export const AuthProvider = ({ children }) => {
  const initialFirebaseUser = auth.currentUser || null;
  const initialCache = readAuthCache();
  const canUseInitialCache = Boolean(
    initialFirebaseUser &&
    initialCache?.firebaseUid === initialFirebaseUser.uid
  );

  const [firebaseUser, setFirebaseUser] = useState(initialFirebaseUser);
  const [appUser, setAppUser] = useState(canUseInitialCache ? initialCache?.user || null : null); // user from our backend (Prisma)
  const [token, setToken] = useState(canUseInitialCache ? initialCache?.token || null : null); // JWT from our backend
  const [loading, setLoading] = useState(!canUseInitialCache);
  const [organizations, setOrganizations] = useState(canUseInitialCache ? initialCache?.organizations || [] : []);
  const [hasOrganization, setHasOrganization] = useState(
    canUseInitialCache ? (initialCache?.organizations || []).length > 0 : false
  );
  const [bootstrapped, setBootstrapped] = useState(canUseInitialCache);
  const [avatarUrl, setAvatarUrl] = useState(
    () => localStorage.getItem(AVATAR_STORAGE_KEY) || ""
  );
  const [activeOrgId, setActiveOrgId] = useState(
    () => localStorage.getItem(ACTIVE_ORG_STORAGE_KEY) || ""
  );

  const setMemberships = useCallback((orgs = []) => {
    const list = Array.isArray(orgs) ? orgs : [];
    setOrganizations(list);
    setHasOrganization(list.length > 0);
    if (list.length === 0) {
      setActiveOrgId("");
      localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
      return;
    }
    const exists = list.some((org) => org.id === activeOrgId);
    if (!exists) {
      const fallbackId = list[0]?.id || "";
      setActiveOrgId(fallbackId);
      if (fallbackId) {
        localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, fallbackId);
      }
    }
  }, [activeOrgId]);

  const setActiveOrganization = useCallback((orgId) => {
    const next = String(orgId || "");
    setActiveOrgId(next);
    if (next) {
      localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, next);
    } else {
      localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
    }
  }, []);

  const setProfileAvatarUrl = useCallback((nextUrl) => {
    const next = String(nextUrl || "");
    setAvatarUrl(next);
    if (next) {
      localStorage.setItem(AVATAR_STORAGE_KEY, next);
    } else {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
    }

    const cached = readAuthCache();
    if (cached) {
      writeAuthCache({ ...cached, avatarUrl: next });
    }
  }, []);

  const activeOrganization = useMemo(() => {
    if (!organizations.length) return null;
    const found = organizations.find((org) => org.id === activeOrgId);
    return found || organizations[0] || null;
  }, [activeOrgId, organizations]);

  const refreshOrganizations = useCallback(async (idTokenOverride) => {
    if (!firebaseUser && !idTokenOverride) return [];
    const authToken = idTokenOverride || (await firebaseUser.getIdToken());
    const res = await axios.get("/api/orgs", {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const orgs = res.data || [];
    setMemberships(orgs);
    return orgs;
  }, [firebaseUser, setMemberships]);

  // Watch Firebase auth state
  useEffect(() => {
    const syncUser = async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setAppUser(null);
        setToken(null);
        setMemberships([]);
        setProfileAvatarUrl("");
        localStorage.removeItem("ttm_token");
        clearAuthCache();
        setLoading(false);
        setBootstrapped(true);
        return;
      }

      setFirebaseUser(user);
      const cached = readAuthCache();
      const canUseCachedState = cached?.firebaseUid === user.uid;

      if (canUseCachedState) {
        setAppUser(cached.user || null);
        setToken(cached.token || null);
        setMemberships(cached.organizations || []);
        setLoading(false);
        setBootstrapped(true);
      } else {
        setLoading(true);
        setBootstrapped(false);
      }

      // Get fresh Firebase ID token
      const idToken = await user.getIdToken();

      try {
        const data = await loginWithFirebase(idToken);
        setToken(data.token);
        setAppUser(data.user);
        setMemberships(data.organizations || []);
        localStorage.setItem("ttm_token", data.token);
        writeAuthCache({
          firebaseUid: user.uid,
          token: data.token,
          user: data.user,
          organizations: data.organizations || [],
          avatarUrl: localStorage.getItem(AVATAR_STORAGE_KEY) || ""
        });

        const inviteToken = localStorage.getItem(INVITE_STORAGE_KEY);
        if (inviteToken) {
          try {
            await acceptTeamInvite({ token: idToken, inviteToken });
            localStorage.removeItem(INVITE_STORAGE_KEY);
            const refreshedOrgs = await refreshOrganizations(idToken);
            writeAuthCache({
              firebaseUid: user.uid,
              token: data.token,
              user: data.user,
              organizations: refreshedOrgs || [],
              avatarUrl: localStorage.getItem(AVATAR_STORAGE_KEY) || ""
            });
          } catch (inviteError) {
            console.error("Invite accept failed:", inviteError);
          }
        }
      } catch (err) {
        console.error("Error syncing with backend:", err);
      } finally {
        setLoading(false);
        setBootstrapped(true);
      }
    };

    const unsub = onAuthStateChanged(auth, async (user) => {
      await syncUser(user);
    });

    return () => unsub();
  }, [refreshOrganizations, setMemberships, setProfileAvatarUrl]);

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    firebaseUser,
    user: appUser,
    token,
    loading,
    organizations,
    hasOrganization,
    activeOrganization,
    activeOrgId,
    setActiveOrganization,
    avatarUrl,
    setAvatarUrl: setProfileAvatarUrl,
    refreshOrganizations,
    bootstrapped,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
