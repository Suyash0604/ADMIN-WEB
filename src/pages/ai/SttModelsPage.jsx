import ResourceManager from "../../components/rbac/ResourceManager";
import { aiResources } from "../../config/aiResources";

const SttModelsPage = () => <ResourceManager resource={aiResources.sttModels} />;

export default SttModelsPage;
