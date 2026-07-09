import ResourceManager from "../../components/rbac/ResourceManager";
import { clientResources } from "../../config/clientResources";

const LegalDocumentsPage = () => (
  <ResourceManager resource={clientResources.legalDocuments} />
);

export default LegalDocumentsPage;
