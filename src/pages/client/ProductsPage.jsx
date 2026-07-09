import ResourceManager from "../../components/rbac/ResourceManager";
import { clientResources } from "../../config/clientResources";

const ProductsPage = () => (
  <ResourceManager resource={clientResources.masterProducts} />
);

export default ProductsPage;
