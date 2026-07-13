import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { DEFAULT_PAGINATION } from "../lib/constants";
import { filterRecordsBySearch } from "../lib/recordSearch";

/**
 * Loads and manages records for a resource page.
 *
 * Simple flow:
 *   1. Page passes `resource` config + logged-in `clientId`
 *   2. On mount → calls api.list() or api.listByClient(clientId) with pagination
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

const parseListResponse = (payload) => {
  // Support both flat and wrapped list shapes:
  // { items, page, ... }  OR  { message, data: { items, page, ... } }
  const data =
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    payload.data != null &&
    (Array.isArray(payload.data) || Array.isArray(payload.data.items))
      ? payload.data
      : payload;

  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length || DEFAULT_PAGINATION.page_size,
      totalPages: 1,
    };
  }

  const items = Array.isArray(data?.items) ? data.items : [];
  const pageSize = data?.page_size ?? DEFAULT_PAGINATION.page_size;

  return {
    items,
    total: data?.total ?? items.length,
    page: data?.page ?? 1,
    pageSize,
    totalPages:
      data?.total_pages ??
      Math.max(1, Math.ceil((data?.total ?? items.length) / pageSize)),
  };
};

const unwrapRecord = (payload) => {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    payload.data != null &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    !Array.isArray(payload.data.items)
  ) {
    return payload.data;
  }
  return payload;
};

const isAbortError = (error) =>
  axios.isCancel(error) || error?.code === "ERR_CANCELED";

export const useResourceManager = (resource, clientId, { search = "" } = {}) => {
  const {
    key: resourceKey,
    idKey,
    api,
    hasList,
    filterByClient,
    filterClientId,
    columns = [],
  } = resource;

  const searchQuery = search.trim();

  const useClientSideFilter = filterByClient && typeof filterClientId === "function";
  const useServerClientFilter = filterByClient && !useClientSideFilter;

  const canLoad = hasList && (!filterByClient || clientId != null);

  const [rawRecords, setRawRecords] = useState(() =>
    hasList ? [] : readCache(resourceKey),
  );
  const [loading, setLoading] = useState(canLoad);
  const [syncing, setSyncing] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: DEFAULT_PAGINATION.page_size,
    totalPages: 1,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const requestIdRef = useRef(0);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const persist = useCallback(
    (updater) => {
      if (hasList) {
        setRawRecords((prev) =>
          typeof updater === "function" ? updater(prev) : updater,
        );
        return;
      }
      setRawRecords((prev) => {
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

  useEffect(() => {
    setPage(1);
    if (hasList) {
      setRawRecords([]);
      setLoading(canLoad);
    }
  }, [canLoad, clientId, hasList, resourceKey]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // ── Load paginated list ─────────────────────────────────────────
  useEffect(() => {
    if (!hasList) {
      setRawRecords(readCache(resourceKey));
      return undefined;
    }

    if (!canLoad) {
      setLoading(false);
      return undefined;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    const paginationParams = {
      page,
      page_size: DEFAULT_PAGINATION.page_size,
      ...(searchQuery ? { search: searchQuery } : {}),
    };

    setSyncing(true);

    const fetcher = useServerClientFilter
      ? api.listByClient(clientId, {
          signal: controller.signal,
          params: paginationParams,
        })
      : api.list(paginationParams, { signal: controller.signal });

    fetcher
      .then((data) => {
        if (requestId !== requestIdRef.current) return;

        const parsed = parseListResponse(data);
        let rows = parsed.items;

        if (useClientSideFilter && clientId != null) {
          rows = rows.filter((row) => filterClientId(row) === clientId);
        }

        setRawRecords(rows);
        setPagination({
          total: parsed.total,
          pageSize: parsed.pageSize,
          totalPages: parsed.totalPages,
        });
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
  }, [
    api,
    canLoad,
    clientId,
    filterClientId,
    hasList,
    page,
    reloadKey,
    resourceKey,
    searchQuery,
    useClientSideFilter,
    useServerClientFilter,
  ]);

  const records = useMemo(
    () => filterRecordsBySearch(rawRecords, columns, searchQuery),
    [columns, rawRecords, searchQuery],
  );

  const create = useCallback(
    async (payload) => {
      const record = unwrapRecord(await api.create(payload));
      if (hasList) {
        if (page !== 1) setPage(1);
        else reload();
      } else {
        upsert(record);
      }
      return record;
    },
    [api, hasList, page, reload, upsert],
  );

  const update = useCallback(
    async (id, payload) => {
      const record = unwrapRecord(await api.update(id, payload));
      if (hasList) {
        reload();
      } else {
        upsert(record ?? { [idKey]: id, ...payload });
      }
      return record;
    },
    [api, hasList, idKey, reload, upsert],
  );

  const remove = useCallback(
    async (id) => {
      await api.remove(id);
      if (hasList) {
        const nextTotal = Math.max(0, pagination.total - 1);
        const nextTotalPages = Math.max(
          1,
          Math.ceil(nextTotal / pagination.pageSize),
        );
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
        } else {
          reload();
        }
      } else {
        persist((prev) => prev.filter((r) => r[idKey] !== id));
      }
    },
    [api, hasList, idKey, page, pagination.pageSize, pagination.total, persist, reload],
  );

  const fetchById = useCallback(
    async (id) => {
      const record = unwrapRecord(await api.get(id));
      upsert(record);
      return record;
    },
    [api, upsert],
  );

  return {
    records,
    loading,
    syncing,
    page,
    pagination,
    setPage,
    missingClientId: filterByClient && clientId == null,
    create,
    update,
    remove,
    fetchById,
  };
};
