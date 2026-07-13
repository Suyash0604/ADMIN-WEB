import {
  llmApi,
  sttApi,
  ttsApi,
  languagesApi,
  providersApi,
  clientProductChannelsApi,
} from "../../api/clientPlatform";
import { toListRows } from "../../lib/apiResponse";
import ApiListSelect from "./ApiListSelect";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import Select from "../ui/Select";
import Spinner from "../ui/Spinner";

const modelLabel = (item) => {
  const provider = item.provider?.provider_name;
  return provider ? `${item.model_name} (${provider})` : item.model_name;
};

export const ProviderSelect = ({ providerType, ...props }) => (
  <ApiListSelect
    {...props}
    api={providersApi}
    getLabel={(item) =>
      item.provider_type
        ? `${item.provider_name} (${item.provider_type})`
        : item.provider_name
    }
    placeholder={providerType ? `Select a ${providerType} provider` : "Select a provider"}
    loadingLabel="Loading providers…"
    emptyMessage={
      providerType
        ? `No ${providerType} providers available. Create one in Providers first.`
        : "No providers available. Create one in Providers first."
    }
    errorMessage="Unable to load providers."
    sortBy={(a, b) => a.provider_name.localeCompare(b.provider_name)}
    filterItem={
      providerType
        ? (item) => item.provider_type?.toLowerCase() === providerType.toLowerCase()
        : undefined
    }
  />
);

export const LlmModelSelect = (props) => (
  <ApiListSelect
    {...props}
    api={llmApi}
    getLabel={modelLabel}
    placeholder="Select an LLM model"
    loadingLabel="Loading LLM models…"
    emptyMessage="No LLM models available."
    errorMessage="Unable to load LLM models."
    sortBy={(a, b) => a.model_name.localeCompare(b.model_name)}
  />
);

export const SttModelSelect = (props) => (
  <ApiListSelect
    {...props}
    api={sttApi}
    getLabel={modelLabel}
    placeholder="Select an STT model"
    loadingLabel="Loading STT models…"
    emptyMessage="No STT models available."
    errorMessage="Unable to load STT models."
    sortBy={(a, b) => a.model_name.localeCompare(b.model_name)}
  />
);

export const TtsModelSelect = (props) => (
  <ApiListSelect
    {...props}
    api={ttsApi}
    getLabel={(item) => {
      const base = modelLabel(item);
      return item.voice ? `${base} · ${item.voice}` : base;
    }}
    placeholder="Select a TTS model"
    loadingLabel="Loading TTS models…"
    emptyMessage="No TTS models available."
    errorMessage="Unable to load TTS models."
    sortBy={(a, b) => a.model_name.localeCompare(b.model_name)}
  />
);

export const LanguageSelect = (props) => (
  <ApiListSelect
    {...props}
    api={languagesApi}
    getValue={(item) => item.code}
    getLabel={(item) => `${item.name} (${item.code})`}
    placeholder="Select a language"
    loadingLabel="Loading languages…"
    emptyMessage="No languages available."
    errorMessage="Unable to load languages."
    sortBy={(a, b) => a.name.localeCompare(b.name)}
  />
);

export const LanguageIdSelect = (props) => (
  <ApiListSelect
    {...props}
    api={languagesApi}
    getLabel={(item) => `${item.name} (${item.code})`}
    placeholder="Select a language"
    loadingLabel="Loading languages…"
    emptyMessage="No languages available. Create one in Languages first."
    errorMessage="Unable to load languages."
    sortBy={(a, b) => a.name.localeCompare(b.name)}
  />
);

const productChannelLabel = (item) => {
  const product = item.product?.name ?? `Product #${item.product_id}`;
  const channel = item.channel?.type ?? `Channel #${item.channel_id}`;
  return `${product} · ${channel}`;
};

export const ClientProductChannelSelect = ({
  id,
  value,
  onChange,
  invalid = false,
  clientId,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clientId == null) {
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    clientProductChannelsApi
      .list({}, { signal: controller.signal })
      .then((data) => setItems(toListRows(data)))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        setError(err.message || "Unable to load product channels.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [clientId]);

  const options = useMemo(
    () =>
      items
        .filter((item) => item.client_id === clientId)
        .sort((a, b) => productChannelLabel(a).localeCompare(productChannelLabel(b))),
    [items, clientId],
  );

  if (clientId == null) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-canvas px-3.5 py-2.5 text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        Select a client first to load product channels.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
        <Spinner size={16} />
        Loading product channels…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">
        <AlertCircle size={14} strokeWidth={2.3} />
        {error}
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-canvas px-3.5 py-2.5 text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        No product channels for this client. Create one in Product Channels first.
      </div>
    );
  }

  return (
    <Select
      id={id}
      value={value ?? ""}
      invalid={invalid}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        Select a product channel
      </option>
      {options.map((item) => (
        <option key={item.id} value={String(item.id)}>
          {productChannelLabel(item)}
        </option>
      ))}
    </Select>
  );
};
