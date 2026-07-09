import { apiClient } from "./client";
import { DEFAULT_PAGINATION } from "../lib/constants";

/**
 * Standard REST client for one resource.
 *
 * RBAC:  listByClient(1) → GET /users/?client_id=1&page=1&page_size=10  (uses PUT for update)
 * Client: list()         → GET /products/?page=1&page_size=10           (uses PATCH for update)
 */
export const createApi = (basePath, { baseUrl, usePatch = false } = {}) => ({
  basePath,

  /** Fetch records (optionally with query params). Always sends page + page_size. */
  list: (params = {}, reqOptions = {}) => {
    const { params: reqParams, ...rest } = reqOptions;
    return apiClient.get(basePath, {
      baseUrl,
      ...rest,
      params: { ...DEFAULT_PAGINATION, ...params, ...reqParams },
    });
  },

  /** RBAC shorthand — GET {basePath}?client_id={clientId}&page=1&page_size=10 */
  listByClient: (clientId, reqOptions = {}) => {
    const { params: reqParams, ...rest } = reqOptions;
    return apiClient.get(basePath, {
      baseUrl,
      ...rest,
      params: {
        ...DEFAULT_PAGINATION,
        client_id: clientId,
        ...reqParams,
      },
    });
  },

  create: (payload, reqOptions) =>
    apiClient.post(basePath, payload, { baseUrl, ...reqOptions }),

  get: (id, reqOptions) =>
    apiClient.get(`${basePath}${id}`, { baseUrl, ...reqOptions }),

  update: (id, payload, reqOptions) => {
    const method = usePatch ? "patch" : "put";
    return apiClient[method](`${basePath}${id}`, payload, {
      baseUrl,
      ...reqOptions,
    });
  },

  remove: (id, reqOptions) =>
    apiClient.del(`${basePath}${id}`, { baseUrl, ...reqOptions }),
});

/** @deprecated use createApi — kept for existing imports */
export const createResource = (basePath, options = {}) =>
  createApi(basePath, options);

/** @deprecated use createApi({ usePatch: true }) */
export const createListResource = (basePath, options = {}) =>
  createApi(basePath, { ...options, usePatch: true });
