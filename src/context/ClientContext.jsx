import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { getSelectedClient, setSelectedClient as persistSelectedClient } from "../lib/storage";

const ClientContext = createContext(null);

export const ClientProvider = ({ children }) => {
  const { user, isClientOnboardingUser, isAuthenticated } = useAuth();
  const [selectedClient, setSelectedClientState] = useState(() => getSelectedClient());

  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedClientState(null);
    }
  }, [isAuthenticated]);

  const selectClient = useCallback((client) => {
    setSelectedClientState(client);
    persistSelectedClient(client);
  }, []);

  const clearSelectedClient = useCallback(() => {
    setSelectedClientState(null);
    persistSelectedClient(null);
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
    }),
    [selectedClient, activeClientId, selectClient, clearSelectedClient],
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
