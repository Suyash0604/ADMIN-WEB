import { apiClient } from "./client";
import { setToken, setStoredUser, clearAuth } from "../lib/storage";

const ENDPOINTS = {
  login: "/api/v1/auth/login",
};

/**
 * Authenticates the user and persists the returned token + profile.
 */
export const login = async (email, password) => {
  const data = await apiClient.post(
    ENDPOINTS.login,
    { email, password },
    { auth: false },
  );

  if (data?.access_token) setToken(data.access_token);
  setStoredUser({
    user_id: data?.user_id,
    name: data?.name,
    email: data?.email,
    client_id: data?.client_id,
    designations: data?.designations ?? [],
    roles: data?.roles ?? [],
    is_superuser: Boolean(data?.is_superuser),
  });

  return data;
};

export const logout = () => {
  clearAuth();
};
