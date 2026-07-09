import ResourceManager from "../../components/rbac/ResourceManager";
import { clientResources } from "../../config/clientResources";

const MasterDocumentsPage = () => (
  <ResourceManager resource={clientResources.masterDocuments} />
);

export default MasterDocumentsPage;
