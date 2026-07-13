import { CLIENT_API_BASE_URL } from "../lib/constants";
import { createListResource } from "./resource";


/**
 * Client platform APIs — base: CLIENT_API_BASE_URL
 * Uses PATCH for updates.
 */
const options = { baseUrl: CLIENT_API_BASE_URL };

// ── Client onboarding / workspace ─────────────────────────────────
export const clientsApi = createListResource("/api/v1/clients/", options);
export const legalDocumentsApi = createListResource(
  "/api/v1/legal-documents/",
  options,
);
export const clientProductChannelsApi = createListResource(
  "/api/v1/client-product-channels/",
  options,
);
export const callingConfigsApi = createListResource(
  "/api/v1/calling-configs/",
  options,
);


// ── Master catalog ────────────────────────────────────────────────
export const masterDocumentsApi = createListResource(
  "/api/v1/documents/",
  options,
);
export const productsApi = createListResource("/api/v1/products/", options);
export const channelsApi = createListResource("/api/v1/channels/", options);



// ── AI services ───────────────────────────────────────────────────
export const providersApi = createListResource("/api/v1/providers/", options);
export const llmApi = createListResource("/api/v1/llm/", options);
export const sttApi = createListResource("/api/v1/stt/", options);
export const ttsApi = createListResource("/api/v1/tts/", options);
export const languagesApi = createListResource("/api/v1/languages/", options);
export const languageSttMapsApi = createListResource(
  "/api/v1/language-stt-maps/",
  options,
);
export const languageTtsMapsApi = createListResource(
  "/api/v1/language-tts-maps/",
  options,
);
