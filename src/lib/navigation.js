import { ROUTES } from "./constants";

/**
 * Maps `data/schema` entity keys to their app routes.
 */
export const entityRouteByKey = {
  users: ROUTES.rbac.users,
  roles: ROUTES.rbac.roles,
  designations: ROUTES.rbac.designations,
  designationRoles: ROUTES.rbac.designationRoles,
  buLocations: ROUTES.rbac.buLocations,
  userAssignments: ROUTES.rbac.mappings,
  clients: ROUTES.client.clients,
  legalDocuments: ROUTES.client.legalDocuments,
  masterDocuments: ROUTES.client.masterDocuments,
  masterProducts: ROUTES.client.products,
  masterChannels: ROUTES.client.channels,
  productChannels: ROUTES.client.productChannels,
  callingConfig: ROUTES.client.callingConfig,
  providers: ROUTES.ai.providers,
  llmModels: ROUTES.ai.llmModels,
  sttModels: ROUTES.ai.sttModels,
  ttsModels: ROUTES.ai.ttsModels,
  languages: ROUTES.ai.languages,
  languageSttMap: ROUTES.ai.languageSttMap,
  languageTtsMap: ROUTES.ai.languageTtsMap,
};

export const routeForEntity = (key) => entityRouteByKey[key] ?? null;
