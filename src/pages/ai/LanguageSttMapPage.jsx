import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const LanguageSttMapPage = () => (
  <ResourceManager resource={aiResources.languageSttMap} />
);

export default LanguageSttMapPage;
