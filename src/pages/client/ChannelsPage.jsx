import ResourceManager from "../../components/rbac/ResourceManager";
import { clientResources } from "../../config/clientResources";

const ChannelsPage = () => (
  <ResourceManager resource={clientResources.masterChannels} />
);

export default ChannelsPage;
