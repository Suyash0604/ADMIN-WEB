import ResourceManager from "../../components/rbac/ResourceManager";
import { rbacResources } from "../../config/rbacResources";

const MappingsPage = () => <ResourceManager resource={rbacResources.mappings} />;

export default MappingsPage;
