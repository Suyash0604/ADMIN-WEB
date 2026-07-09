import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const ProvidersPage = () => <ResourceManager resource={aiResources.providers} />;

export default ProvidersPage;
