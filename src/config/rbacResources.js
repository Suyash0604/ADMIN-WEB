import { Users, Shield, BadgeCheck, KeyRound, MapPin, UserCog } from "lucide-react";
import {
  usersApi,
  rolesApi,
  designationsApi,
  buLocationsApi,
  designationRolesApi,
  mappingsApi,
} from "../api/rbac";

/**
 * RBAC list endpoints: GET /api/v1/users/?client_id=1
 * `client_id` comes from the RBAC client dropdown (ClientContext.rbacClientId).
 *
 * field:  { name, label, type, required, placeholder, help, createOnly, clientDefault }
 * column: { key, label, type }   type: "date" | "status" | (default text)
 */

const timestampColumns = [
  { key: "created_at", label: "Created", type: "date" },
  { key: "updated_at", label: "Updated", type: "date" },
  { key: "is_deleted", label: "Status", type: "status" },
];

const rbacListFlags = {
  hasList: true,
  filterByClient: true,
};

export const rbacResources = {
  users: {
    key: "users",
    path: "/rbac/users",
    title: "Users",
    singular: "User",
    description: "People with access to the platform and their profiles.",
    icon: Users,
    api: usersApi,
    idKey: "user_id",
    idLabel: "User ID",
    ...rbacListFlags,
    fields: [
      {
        name: "name",
        label: "Full name",
        type: "text",
        required: true,
        placeholder: "Enter full name",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "name@company.com",
      },
      {
        name: "phone_number",
        label: "Phone number",
        type: "phone",
        placeholder: "10-digit mobile number",
        maxLength: 10,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        createOnly: true,
        placeholder: "Create a secure password",
        help: "Password is set at account creation only.",
      },
      {
        name: "reporting_manager_id",
        label: "Reporting manager",
        type: "user",
        placeholder: "Choose reporting manager",
        getValue: (r) => r?.reporting_manager_id,
      },
      { name: "client_id", label: "Client", type: "client", clientDefault: true },
      {
        name: "designation_id",
        label: "Designation",
        type: "designation",
        required: true,
        placeholder: "Choose designation",
        getValue: (r) =>
          r?.designation_id ?? r?.designations?.[0]?.designation_id,
      },
      {
        name: "location_id",
        label: "Location",
        type: "buLocation",
        required: true,
        placeholder: "Choose work location",
        getValue: (r) =>
          r?.location_id ?? r?.locations?.[0]?.location_id,
      },
    ],
    columns: [
      { key: "user_id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone_number", label: "Phone" },
      { key: "client_id", label: "Client" },
      ...timestampColumns,
    ],
  },

  roles: {
    key: "roles",
    path: "/rbac/roles",
    title: "Roles",
    singular: "Role",
    description: "Named permission sets assigned to designations.",
    icon: Shield,
    api: rolesApi,
    idKey: "role_id",
    idLabel: "Role ID",
    ...rbacListFlags,
    fields: [
      { name: "role_name", label: "Role name", type: "text", required: true, placeholder: "Administrator" },
      { name: "client_id", label: "Client", type: "client", clientDefault: true },
    ],
    columns: [
      { key: "role_id", label: "ID" },
      { key: "role_name", label: "Role name" },
      { key: "client_id", label: "Client" },
      ...timestampColumns,
    ],
  },

  designations: {
    key: "designations",
    path: "/rbac/designations",
    title: "Designations",
    singular: "Designation",
    description: "Job titles that group users and map to roles.",
    icon: BadgeCheck,
    api: designationsApi,
    idKey: "designation_id",
    idLabel: "Designation ID",
    ...rbacListFlags,
    fields: [
      { name: "name", label: "Designation name", type: "text", required: true, placeholder: "Sales Manager" },
      { name: "client_id", label: "Client", type: "client", clientDefault: true },
    ],
    columns: [
      { key: "designation_id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "client_id", label: "Client" },
      ...timestampColumns,
    ],
  },

  designationRoles: {
    key: "designationRoles",
    path: "/rbac/designation-roles",
    title: "Designation Roles",
    singular: "Designation Role",
    description: "Links a designation to the role it is granted.",
    icon: KeyRound,
    api: designationRolesApi,
    idKey: "designation_role_id",
    idLabel: "Mapping ID",
    ...rbacListFlags,
    fields: [
      { name: "designation_id", label: "Designation ID", type: "number", required: true, placeholder: "e.g. 3" },
      { name: "role_id", label: "Role ID", type: "number", required: true, placeholder: "e.g. 1" },
      { name: "client_id", label: "Client", type: "client", clientDefault: true },
    ],
    columns: [
      { key: "designation_role_id", label: "ID" },
      {
        key: "designation",
        label: "Designation",
        accessor: (row) => row.designation_name ?? row.designation_id,
      },
      {
        key: "role",
        label: "Role",
        accessor: (row) => row.role_name ?? row.role_id,
      },
      { key: "client_id", label: "Client" },
      ...timestampColumns,
    ],
  },

  buLocations: {
    key: "buLocations",
    path: "/rbac/bu-locations",
    title: "BU Locations",
    singular: "BU Location",
    description: "Business-unit locations within the organization hierarchy.",
    icon: MapPin,
    api: buLocationsApi,
    idKey: "location_id",
    idLabel: "Location ID",
    ...rbacListFlags,
    fields: [
      { name: "location", label: "Location", type: "text", required: true, placeholder: "Mumbai HQ" },
      { name: "geography", label: "Geography", type: "text", placeholder: "West Zone" },
      { name: "reporting_to", label: "Reporting to", type: "text", placeholder: "National Office" },
      { name: "client_id", label: "Client", type: "client", clientDefault: true },
    ],
    columns: [
      { key: "location_id", label: "ID" },
      { key: "location", label: "Location" },
      { key: "geography", label: "Geography" },
      { key: "reporting_to", label: "Reporting to" },
      { key: "client_id", label: "Client" },
      ...timestampColumns,
    ],
  },

  mappings: {
    key: "mappings",
    path: "/rbac/mappings",
    title: "User Assignments",
    singular: "Assignment",
    description: "Maps a user to a designation at a specific BU location.",
    icon: UserCog,
    api: mappingsApi,
    idKey: "udl_id",
    idLabel: "Assignment ID",
    ...rbacListFlags,
    fields: [
      { name: "user_id", label: "User ID", type: "number", required: true, placeholder: "e.g. 5" },
      { name: "designation_id", label: "Designation ID", type: "number", required: true, placeholder: "e.g. 3" },
      { name: "location_id", label: "Location ID", type: "number", required: true, placeholder: "e.g. 2" },
      { name: "client_id", label: "Client", type: "client", clientDefault: true },
    ],
    columns: [
      { key: "udl_id", label: "ID" },
      {
        key: "user",
        label: "User",
        accessor: (row) => row.user_name ?? row.user_id,
      },
      {
        key: "designation",
        label: "Designation",
        accessor: (row) => row.designation_name ?? row.designation_id,
      },
      {
        key: "location",
        label: "Location",
        accessor: (row) => row.location_name ?? row.location_id,
      },
      { key: "client_id", label: "Client" },
      ...timestampColumns,
    ],
  },
};

export const rbacResourceList = Object.values(rbacResources);
