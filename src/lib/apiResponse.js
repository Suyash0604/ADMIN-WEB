import { DEFAULT_PAGINATION } from "./constants";

/** Normalize list payloads: array | { items } */
export const toListRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

/** Normalize paginated list payloads for tables. */
export const parseListResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length || DEFAULT_PAGINATION.page_size,
      totalPages: 1,
    };
  }

  const items = toListRows(data);
  const pageSize = data?.page_size ?? DEFAULT_PAGINATION.page_size;
  const total = data?.total ?? items.length;

  return {
    items,
    total,
    page: data?.page ?? 1,
    pageSize,
    totalPages:
      data?.total_pages ?? Math.max(1, Math.ceil(total / pageSize)),
  };
};
