import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const TtsModelsPage = () => <ResourceManager resource={aiResources.ttsModels} />;

export default TtsModelsPage;
