import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getSelectedClient,
  setSelectedClient as persistSelectedClient,
  getRbacClientId,
  setRbacClientId as persistRbacClientId,
} from "../lib/storage";

const ClientContext = createContext(null);

export const ClientProvider = ({ children }) => {
  const { user, isClientOnboardingUser, isAuthenticated } = useAuth();
  const [selectedClient, setSelectedClientState] = useState(() => getSelectedClient());
  const [rbacClientId, setRbacClientIdState] = useState(() => getRbacClientId());

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedClientState(null);
      setRbacClientIdState(null);
      return;
    }

    // Default RBAC filter to the logged-in user's client when none is chosen yet.
    if (rbacClientId == null && user?.client_id != null) {
      setRbacClientIdState(user.client_id);
      persistRbacClientId(user.client_id);
    }
  }, [isAuthenticated, rbacClientId, user?.client_id]);

  const selectClient = useCallback((client) => {
    setSelectedClientState(client);
    persistSelectedClient(client);
  }, []);

  const clearSelectedClient = useCallback(() => {
    setSelectedClientState(null);
    persistSelectedClient(null);
  }, []);

  const setRbacClientId = useCallback((clientId) => {
    const next = clientId == null || clientId === "" ? null : Number(clientId);
    setRbacClientIdState(Number.isFinite(next) ? next : null);
    persistRbacClientId(Number.isFinite(next) ? next : null);
  }, []);

  const activeClientId =
    selectedClient?.client_id ??
    (isClientOnboardingUser ? null : user?.client_id ?? null);

  const value = useMemo(
    () => ({
      selectedClient,
      activeClientId,
      selectClient,
      clearSelectedClient,
      hasSelectedClient: Boolean(selectedClient?.client_id),
      rbacClientId,
      setRbacClientId,
    }),
    [
      selectedClient,
      activeClientId,
      selectClient,
      clearSelectedClient,
      rbacClientId,
      setRbacClientId,
    ],
  );

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientContext must be used within a ClientProvider");
  }
  return context;
};
