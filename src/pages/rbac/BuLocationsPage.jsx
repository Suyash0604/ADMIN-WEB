import ResourceManager from "../../components/rbac/ResourceManager";
import { rbacResources } from "../../config/rbacResources";

const BuLocationsPage = () => (
  <ResourceManager resource={rbacResources.buLocations} />
);

export default BuLocationsPage;
