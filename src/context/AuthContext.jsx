import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../api/auth";
import {
  canAccessEntity,
  canAccessRoute,
  getAccessLabel,
  getAccessProfile,
  getDefaultRoute,
  isClientOnboardingUser,
  isRbacUser,
} from "../lib/accessControl";
import { getStoredUser, getToken } from "../lib/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getToken()),
  );

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setUser(getStoredUser());
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      accessProfile: getAccessProfile(user),
      isClientOnboardingUser: isClientOnboardingUser(user),
      isRbacUser: isRbacUser(user),
      accessLabel: getAccessLabel(user),
      canAccessEntity: (entityKey) => canAccessEntity(entityKey, user),
      canAccessRoute: (pathname) => canAccessRoute(pathname, user),
      defaultRoute: getDefaultRoute(user),
    }),
    [user, isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
