import ResourceManager from "../../components/rbac/ResourceManager";
import { rbacResources } from "../../config/rbacResources";

const RolesPage = () => <ResourceManager resource={rbacResources.roles} />;

export default RolesPage;
