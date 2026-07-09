import ResourceManager from "../../components/rbac/ResourceManager";
import { rbacResources } from "../../config/rbacResources";

const UsersPage = () => <ResourceManager resource={rbacResources.users} />;

export default UsersPage;
