import { createApi } from "./resource";

/**
 * RBAC APIs — base: https://dev-rbac-platform.markytics.ai
 *
 * Example (Users):
 *   usersApi.listByClient(1)  →  GET /api/v1/users/?client_id=1
 *   usersApi.create({...})    →  POST /api/v1/users/
 *   usersApi.get(5)           →  GET /api/v1/users/5
 */
export const usersApi = createApi("/api/v1/users/");
export const rolesApi = createApi("/api/v1/roles/");
export const designationsApi = createApi("/api/v1/designation/");
export const buLocationsApi = createApi("/api/v1/bu-location/");
export const designationRolesApi = createApi("/api/v1/designation-role/");
export const mappingsApi = createApi("/api/v1/mapping/");
