export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://dev-rbac-platform.markytics.ai";

export const STORAGE_KEYS = {
  token: "auth_token",
  user: "auth_user",
  theme: "theme",
};
