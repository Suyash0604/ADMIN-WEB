import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import Select from "../ui/Select";
import Spinner from "../ui/Spinner";

export const toListRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const ApiListSelect = ({
  id,
  value,
  onChange,
  invalid = false,
  api,
  getLabel,
  getValue = (item) => item.id,
  placeholder = "Select an option",
  loadingLabel = "Loading…",
  emptyMessage = "No options available.",
  errorMessage = "Unable to load options.",
  sortBy,
  filterItem,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    api
      .list({}, { signal: controller.signal })
      .then((data) => setItems(toListRows(data)))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        setError(err.message || errorMessage);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [api, errorMessage]);

  const options = useMemo(() => {
    let filtered = filterItem ? items.filter(filterItem) : items;
    const sorted = [...filtered];
    if (sortBy) {
      sorted.sort(sortBy);
    }
    return sorted;
  }, [items, sortBy, filterItem]);

  if (loading) {
    return (
      <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
        <Spinner size={16} />
        {loadingLabel}
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
        {emptyMessage}
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
        {placeholder}
      </option>
      {options.map((item) => (
        <option key={getValue(item)} value={String(getValue(item))}>
          {getLabel(item)}
        </option>
      ))}
    </Select>
  );
};

export default ApiListSelect;
