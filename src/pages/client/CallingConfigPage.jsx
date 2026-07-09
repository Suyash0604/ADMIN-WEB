import ResourceManager from "../../components/rbac/ResourceManager";
import { clientResources } from "../../config/clientResources";

const CallingConfigPage = () => (
  <ResourceManager resource={clientResources.callingConfig} />
);

export default CallingConfigPage;
