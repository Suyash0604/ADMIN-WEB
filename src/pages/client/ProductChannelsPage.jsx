import ResourceManager from "../../components/rbac/ResourceManager";
import { clientResources } from "../../config/clientResources";

const ProductChannelsPage = () => (
  <ResourceManager resource={clientResources.productChannels} />
);

export default ProductChannelsPage;
