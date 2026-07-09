import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const LanguagesPage = () => <ResourceManager resource={aiResources.languages} />;

export default LanguagesPage;
