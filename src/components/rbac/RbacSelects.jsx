import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { usersApi, designationsApi, buLocationsApi } from "../../api/rbac";
import { toListRows } from "../../lib/apiResponse";
import Select from "../ui/Select";
import Spinner from "../ui/Spinner";

const userLabel = (user) => {
  const name = user.name?.trim();
  const email = user.email?.trim();
  if (name && email) return `${name} (${email})`;
  return name || email || `User #${user.user_id}`;
};

export const UserSelect = ({
  id,
  value,
  onChange,
  invalid = false,
  clientId,
  excludeUserId,
  placeholder = "Select a user",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const fetcher =
      clientId != null
        ? usersApi.listByClient(clientId, { signal: controller.signal })
        : usersApi.list({}, { signal: controller.signal });

    fetcher
      .then((data) => setItems(toListRows(data)))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        setError(err.message || "Unable to load users.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [clientId]);

  const options = useMemo(() => {
    let filtered = items;
    if (excludeUserId != null) {
      filtered = filtered.filter((user) => user.user_id !== excludeUserId);
    }
    return [...filtered].sort((a, b) => userLabel(a).localeCompare(userLabel(b)));
  }, [items, excludeUserId]);

  if (loading) {
    return (
      <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
        <Spinner size={16} />
        Loading users…
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
        No users available for this client.
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
      {options.map((user) => (
        <option key={user.user_id} value={String(user.user_id)}>
          {userLabel(user)}
        </option>
      ))}
    </Select>
  );
};

export const DesignationSelect = ({
  id,
  value,
  onChange,
  invalid = false,
  clientId,
  placeholder = "Select a designation",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clientId == null) {
      setItems([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    designationsApi
      .listByClient(clientId, { signal: controller.signal })
      .then((data) => setItems(toListRows(data)))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        setError(err.message || "Unable to load designations.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [clientId]);

  const options = useMemo(
    () =>
      items
        .filter((item) => !item.is_deleted)
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")),
    [items],
  );

  if (clientId == null) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-canvas px-3.5 py-2.5 text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        Select a client first to load designations.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
        <Spinner size={16} />
        Loading designations…
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
        No designations available for this client.
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
      {options.map((designation) => (
        <option key={designation.designation_id} value={String(designation.designation_id)}>
          {designation.name}
        </option>
      ))}
    </Select>
  );
};

const locationLabel = (item) => {
  const location = item.location?.trim();
  const geography = item.geography?.trim();
  if (location && geography) return `${location} · ${geography}`;
  return location || geography || `Location #${item.location_id}`;
};

export const BuLocationSelect = ({
  id,
  value,
  onChange,
  invalid = false,
  clientId,
  placeholder = "Select a location",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clientId == null) {
      setItems([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    buLocationsApi
      .listByClient(clientId, { signal: controller.signal })
      .then((data) => setItems(toListRows(data)))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        setError(err.message || "Unable to load locations.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [clientId]);

  const options = useMemo(
    () =>
      items
        .filter((item) => !item.is_deleted)
        .sort((a, b) => locationLabel(a).localeCompare(locationLabel(b))),
    [items],
  );

  if (clientId == null) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-canvas px-3.5 py-2.5 text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        Select a client first to load locations.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
        <Spinner size={16} />
        Loading locations…
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
        No locations available for this client.
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
      {options.map((location) => (
        <option key={location.location_id} value={String(location.location_id)}>
          {locationLabel(location)}
        </option>
      ))}
    </Select>
  );
};
