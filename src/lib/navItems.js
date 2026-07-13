import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";
import { entities, SERVICES, clientNavGroups } from "../data/schema";
import { ROUTES } from "./constants";
import {
  CLIENT_ONBOARDING_ENTITIES,
  CLIENT_SCOPED_ENTITIES,
  RBAC_ENTITIES,
} from "./accessControl";
import { routeForEntity } from "./navigation";

const withRoutes = (items) =>
  items.map((item) => ({
    ...item,
    type: "item",
    to: routeForEntity(item.key),
    label: item.navLabel ?? item.label,
  }));

const entityByKey = Object.fromEntries(entities.map((e) => [e.key, e]));

const buildClientSubItems = (
  canAccessEntity,
  { hideClientConfig = false } = {},
) => {
  const items = [];

  if (canAccessEntity("clients")) {
    items.push(...withRoutes([entityByKey.clients]));
  }

  clientNavGroups.forEach((group) => {
    if (hideClientConfig && group.key === "client-config") return;

    const groupItems = withRoutes(
      group.keys.map((key) => entityByKey[key]).filter(Boolean),
    ).filter((item) => canAccessEntity(item.key));

    if (groupItems.length === 0) return;

    items.push({ type: "label", key: group.key, label: group.label });
    items.push(...groupItems);
  });

  return items;
};

export const buildNavItems = (
  canAccessEntity,
  isClientOnboardingUser,
  isRbacUser,
) => {
  if (isClientOnboardingUser) {
    return [
      {
        key: "onboarding",
        label: "Client Onboarding",
        icon: Building2,
        subItems: withRoutes(
          CLIENT_ONBOARDING_ENTITIES.map((key) => entityByKey[key]).filter(
            Boolean,
          ),
        ),
      },
    ];
  }

  if (isRbacUser) {
    const rbacSubItems = withRoutes(
      RBAC_ENTITIES.map((key) => entityByKey[key]).filter(Boolean),
    );
    return [
      {
        key: "rbac",
        label: "RBAC",
        icon: ShieldCheck,
        subItems: rbacSubItems,
      },
    ];
  }

  const items = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      to: ROUTES.overview,
    },
  ];

  const clientSubItems = buildClientSubItems(canAccessEntity, {
    hideClientConfig: true,
  });
  if (clientSubItems.length > 0) {
    items.push({
      key: "client",
      label: "Client",
      icon: Building2,
      subItems: clientSubItems,
      relatedRoutes: CLIENT_SCOPED_ENTITIES.map((key) =>
        routeForEntity(key),
      ).filter(Boolean),
    });
  }

  const rbacSubItems = withRoutes(
    entities.filter((e) => e.service === SERVICES.RBAC),
  ).filter((item) => canAccessEntity(item.key));

  if (rbacSubItems.length > 0) {
    items.push({
      key: "rbac",
      label: "RBAC",
      icon: ShieldCheck,
      subItems: rbacSubItems,
    });
  }

  const aiSubItems = withRoutes(
    entities.filter((e) => e.service === SERVICES.AI),
  ).filter((item) => canAccessEntity(item.key));

  if (aiSubItems.length > 0) {
    items.push({
      key: "ai",
      label: "AI Services",
      shortLabel: "AI",
      icon: Sparkles,
      subItems: aiSubItems,
    });
  }

  return items;
};
