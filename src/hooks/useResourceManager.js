import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

/**
 * Loads and manages records for a resource page.
 *
 * Simple flow:
 *   1. Page passes `resource` config + logged-in `clientId`
 *   2. On mount → calls api.list() or api.listByClient(clientId)
 *   3. Returns records + create/update/remove helpers
 */

const cacheKey = (resourceKey) => `resource_records_${resourceKey}`;

const readCache = (resourceKey) => {
  try {
    const raw = localStorage.getItem(cacheKey(resourceKey));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCache = (resourceKey, records) => {
  try {
    localStorage.setItem(cacheKey(resourceKey), JSON.stringify(records));
  } catch {
    /* storage full — non-fatal */
  }
};

const toRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const isAbortError = (error) =>
  axios.isCancel(error) || error?.code === "ERR_CANCELED";

export const useResourceManager = (resource, clientId) => {
  const {
    key: resourceKey,
    idKey,
    api,
    hasList,
    filterByClient,
    filterClientId,
  } = resource;

  const useClientSideFilter = filterByClient && typeof filterClientId === "function";
  const useServerClientFilter = filterByClient && !useClientSideFilter;

  const canLoad = hasList && (!filterByClient || clientId != null);

  const [records, setRecords] = useState(() =>
    hasList ? [] : readCache(resourceKey),
  );
  const [loading, setLoading] = useState(canLoad);
  const [syncing, setSyncing] = useState(false);
  const requestIdRef = useRef(0);

  const persist = useCallback(
    (updater) => {
      if (hasList) {
        setRecords((prev) =>
          typeof updater === "function" ? updater(prev) : updater,
        );
        return;
      }
      setRecords((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        writeCache(resourceKey, next);
        return next;
      });
    },
    [hasList, resourceKey],
  );

  const upsert = useCallback(
    (record) => {
      persist((prev) => {
        const idx = prev.findIndex((r) => r[idKey] === record[idKey]);
        if (idx === -1) return [record, ...prev];
        const next = [...prev];
        next[idx] = { ...next[idx], ...record };
        return next;
      });
    },
    [idKey, persist],
  );

  // ── Load list on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!hasList) {
      setRecords(readCache(resourceKey));
      return undefined;
    }

    if (!canLoad) {
      setLoading(false);
      return undefined;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    const opts = { signal: controller.signal };

    setLoading(true);
    setSyncing(true);

    const fetcher = useServerClientFilter
      ? api.listByClient(clientId, opts)
      : api.list({}, opts);

    fetcher
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        let rows = toRows(data);
        if (useClientSideFilter && clientId != null) {
          rows = rows.filter((row) => filterClientId(row) === clientId);
        }
        setRecords(rows);
      })
      .catch((error) => {
        if (isAbortError(error) || requestId !== requestIdRef.current) return;
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          setSyncing(false);
          setLoading(false);
        }
      });

    return () => {
      requestIdRef.current += 1;
      controller.abort();
    };
  }, [api, canLoad, clientId, filterByClient, filterClientId, hasList, resourceKey, useClientSideFilter, useServerClientFilter]);

  const create = useCallback(
    async (payload) => {
      const record = await api.create(payload);
      upsert(record);
      return record;
    },
    [api, upsert],
  );

  const update = useCallback(
    async (id, payload) => {
      const record = await api.update(id, payload);
      upsert(record ?? { [idKey]: id, ...payload });
      return record;
    },
    [api, idKey, upsert],
  );

  const remove = useCallback(
    async (id) => {
      await api.remove(id);
      persist((prev) => prev.filter((r) => r[idKey] !== id));
    },
    [api, idKey, persist],
  );

  const fetchById = useCallback(
    async (id) => {
      const record = await api.get(id);
      upsert(record);
      return record;
    },
    [api, upsert],
  );

  return {
    records,
    loading,
    syncing,
    missingClientId: filterByClient && clientId == null,
    create,
    update,
    remove,
    fetchById,
  };
};
