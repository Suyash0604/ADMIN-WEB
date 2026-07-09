import ResourceManager from "../../components/rbac/ResourceManager";
import { rbacResources } from "../../config/rbacResources";

const DesignationsPage = () => (
  <ResourceManager resource={rbacResources.designations} />
);

export default DesignationsPage;
