import { ROUTES } from "./constants";
import { entityRouteByKey } from "./navigation";

export const ACCESS_PROFILES = {
  FULL: "full",
  CLIENT_ONBOARDING: "client_onboarding",
  RBAC: "rbac",
};

const CLIENT_ONBOARDING_ENTITIES = [
  "clients",
  "legalDocuments",
  "productChannels",
  "callingConfig",
];

const RBAC_ENTITIES = [
  "users",
  "roles",
  "designations",
  "designationRoles",
  "buLocations",
  "userAssignments",
];

export { CLIENT_ONBOARDING_ENTITIES, RBAC_ENTITIES };

export const CLIENT_SCOPED_ENTITIES = [
  "legalDocuments",
  "productChannels",
  "callingConfig",
];

const CLIENT_ONBOARDING_ALIASES = new Set([
  "clientonboarding",
  "clinetonboarding",
]);

const RBAC_ALIASES = new Set(["rbac"]);

const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const matchesClientOnboarding = (user) => {
  const roleMatch = user.roles?.some((role) =>
    CLIENT_ONBOARDING_ALIASES.has(normalize(role.role_name)),
  );
  const designationMatch = user.designations?.some((designation) =>
    CLIENT_ONBOARDING_ALIASES.has(normalize(designation.name)),
  );
  return roleMatch || designationMatch;
};

const matchesRbac = (user) => {
  const roleMatch = user.roles?.some((role) =>
    RBAC_ALIASES.has(normalize(role.role_name)),
  );
  const designationMatch = user.designations?.some((designation) =>
    RBAC_ALIASES.has(normalize(designation.name)),
  );
  return roleMatch || designationMatch;
};

export const getAccessProfile = (user) => {
  if (!user) return ACCESS_PROFILES.FULL;
  if (user.is_superuser) return ACCESS_PROFILES.FULL;
  if (matchesClientOnboarding(user)) return ACCESS_PROFILES.CLIENT_ONBOARDING;
  if (matchesRbac(user)) return ACCESS_PROFILES.RBAC;
  return ACCESS_PROFILES.FULL;
};

export const isClientOnboardingUser = (user) =>
  getAccessProfile(user) === ACCESS_PROFILES.CLIENT_ONBOARDING;

export const isRbacUser = (user) =>
  getAccessProfile(user) === ACCESS_PROFILES.RBAC;

export const getAllowedEntityKeys = (user) => {
  const profile = getAccessProfile(user);
  if (profile === ACCESS_PROFILES.CLIENT_ONBOARDING) {
    return new Set(CLIENT_ONBOARDING_ENTITIES);
  }
  if (profile === ACCESS_PROFILES.RBAC) {
    return new Set(RBAC_ENTITIES);
  }
  return null;
};

export const canAccessEntity = (entityKey, user) => {
  const allowed = getAllowedEntityKeys(user);
  if (!allowed) return true;
  return allowed.has(entityKey);
};

export const canAccessRoute = (pathname, user) => {
  const profile = getAccessProfile(user);

  if (pathname === ROUTES.overview) {
    return profile === ACCESS_PROFILES.FULL;
  }

  const entityKey = Object.entries(entityRouteByKey).find(
    ([, route]) => route === pathname,
  )?.[0];

  if (!entityKey) {
    return profile === ACCESS_PROFILES.FULL;
  }

  return canAccessEntity(entityKey, user);
};

export const getDefaultRoute = (user) => {
  if (isClientOnboardingUser(user)) {
    return ROUTES.client.clients;
  }
  if (isRbacUser(user)) {
    return ROUTES.rbac.users;
  }
  return ROUTES.overview;
};

export const getAccessLabel = (user) => {
  if (isClientOnboardingUser(user)) return "Client Onboarding";
  if (isRbacUser(user)) return "RBAC";
  if (user?.is_superuser) return "Super Admin";
  return "Admin";
};
