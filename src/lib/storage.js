import { STORAGE_KEYS } from "./constants";

export const getToken = () => localStorage.getItem(STORAGE_KEYS.token);

export const setToken = (token) => {
  if (token) localStorage.setItem(STORAGE_KEYS.token, token);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.selectedClient);
};

export const getSelectedClient = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.selectedClient);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSelectedClient = (client) => {
  if (client) {
    localStorage.setItem(STORAGE_KEYS.selectedClient, JSON.stringify(client));
  } else {
    localStorage.removeItem(STORAGE_KEYS.selectedClient);
  }
};
