import ResourceManager from "../../components/rbac/ResourceManager";
import { rbacResources } from "../../config/rbacResources";

const DesignationRolesPage = () => (
  <ResourceManager resource={rbacResources.designationRoles} />
);

export default DesignationRolesPage;
