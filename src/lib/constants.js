export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://dev-rbac-platform.markytics.ai";

export const CLIENT_API_BASE_URL =
  import.meta.env.VITE_CLIENT_API_BASE_URL ??
  "https://dev-client-platform.markytics.ai";

export const DEFAULT_PAGINATION = {
  page: 1,
  page_size: 10,
};

export const STORAGE_KEYS = {
  token: "auth_token",
  user: "auth_user",
  theme: "theme",
  selectedClient: "selected_client",
  rbacClientId: "rbac_client_id",
};

export const ROUTES = {
  login: "/login",
  overview: "/",
  rbac: {
    users: "/rbac/users",
    roles: "/rbac/roles",
    designations: "/rbac/designations",
    designationRoles: "/rbac/designation-roles",
    buLocations: "/rbac/bu-locations",
    mappings: "/rbac/mappings",
  },
  client: {
    clients: "/client/clients",
    legalDocuments: "/client/legal-documents",
    masterDocuments: "/client/master-documents",
    products: "/client/products",
    channels: "/client/channels",
    productChannels: "/client/product-channels",
    callingConfig: "/client/calling-config",
  },
  ai: {
    providers: "/ai/providers",
    llmModels: "/ai/llm-models",
    sttModels: "/ai/stt-models",
    ttsModels: "/ai/tts-models",
    languages: "/ai/languages",
    languageSttMap: "/ai/language-stt-maps",
    languageTtsMap: "/ai/language-tts-maps",
  },
};
