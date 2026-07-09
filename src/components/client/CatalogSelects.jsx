import { clientsApi, productsApi, channelsApi } from "../../api/clientPlatform";
import ApiListSelect from "./ApiListSelect";

export const ClientSelect = (props) => (
  <ApiListSelect
    {...props}
    api={clientsApi}
    getValue={(item) => item.client_id}
    getLabel={(item) => item.name || item.legal_name || `Client #${item.client_id}`}
    placeholder="Select a client"
    loadingLabel="Loading clients…"
    emptyMessage="No clients available."
    errorMessage="Unable to load clients."
    sortBy={(a, b) =>
      (a.name || a.legal_name || "").localeCompare(b.name || b.legal_name || "")
    }
  />
);

export const ProductSelect = (props) => (
  <ApiListSelect
    {...props}
    api={productsApi}
    getLabel={(item) => item.name}
    placeholder="Select a product"
    loadingLabel="Loading products…"
    emptyMessage="No products available. Ask an admin to add products first."
    errorMessage="Unable to load products."
    sortBy={(a, b) => a.name.localeCompare(b.name)}
  />
);

export const ChannelSelect = (props) => (
  <ApiListSelect
    {...props}
    api={channelsApi}
    getLabel={(item) => item.type}
    placeholder="Select a channel"
    loadingLabel="Loading channels…"
    emptyMessage="No channels available. Ask an admin to add channels first."
    errorMessage="Unable to load channels."
    sortBy={(a, b) => a.type.localeCompare(b.type)}
  />
);
