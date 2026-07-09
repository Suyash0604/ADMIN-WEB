import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const LanguageTtsMapPage = () => (
  <ResourceManager resource={aiResources.languageTtsMap} />
);

export default LanguageTtsMapPage;
