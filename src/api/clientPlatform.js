import { CLIENT_API_BASE_URL } from "../lib/constants";
import { createListResource } from "./resource";

const clientOptions = { baseUrl: CLIENT_API_BASE_URL };

export const clientsApi = createListResource("/api/v1/clients/", clientOptions);
export const legalDocumentsApi = createListResource(
  "/api/v1/legal-documents/",
  clientOptions,
);

export const masterDocumentsApi = createListResource("/api/v1/documents/", clientOptions);
export const productsApi = createListResource("/api/v1/products/", clientOptions);
export const channelsApi = createListResource("/api/v1/channels/", clientOptions);
export const clientProductChannelsApi = createListResource(
  "/api/v1/client-product-channels/",
  clientOptions,
);
export const callingConfigsApi = createListResource(
  "/api/v1/calling-configs/",
  clientOptions,
);

export const providersApi = createListResource("/api/v1/providers/", clientOptions);
export const llmApi = createListResource("/api/v1/llm/", clientOptions);
export const sttApi = createListResource("/api/v1/stt/", clientOptions);
export const ttsApi = createListResource("/api/v1/tts/", clientOptions);
export const languagesApi = createListResource("/api/v1/languages/", clientOptions);
export const languageSttMapsApi = createListResource(
  "/api/v1/language-stt-maps/",
  clientOptions,
);
export const languageTtsMapsApi = createListResource(
  "/api/v1/language-tts-maps/",
  clientOptions,
);
