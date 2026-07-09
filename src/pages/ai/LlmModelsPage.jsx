import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const LlmModelsPage = () => <ResourceManager resource={aiResources.llmModels} />;

export default LlmModelsPage;
