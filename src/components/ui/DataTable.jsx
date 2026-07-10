import { Pencil, Trash2, ExternalLink, ChevronRight } from "lucide-react";
import TablePagination from "./TablePagination";
import { TableLoadingOverlay, TableSkeletonRows } from "./TableLoading";

const resolveCell = (row, col) => {
  if (col.accessor) return col.accessor(row);
  return row[col.key];
};

const formatValue = (value, type) => {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "date") {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return String(value);
};

const StatusBadge = ({ active, activeLabel = "Active", inactiveLabel = "Deleted" }) => (
  <span
    className={[
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
      active
        ? "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400"
        : "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400",
    ].join(" ")}
  >
    <span
      className={[
        "h-1.5 w-1.5 rounded-full",
        active ? "bg-red-500" : "bg-emerald-500",
      ].join(" ")}
    />
    {active ? inactiveLabel : activeLabel}
  </span>
);

const BooleanBadge = ({ value }) => (
  <span
    className={[
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
      value
        ? "bg-brand/10 text-brand ring-brand/20"
        : "bg-neutral-100 text-zinc-600 ring-neutral-200/80 dark:bg-white/8 dark:text-neutral-400 dark:ring-white/10",
    ].join(" ")}
  >
    {value ? "Yes" : "No"}
  </span>
);

const IdBadge = ({ value }) => (
  <span className="inline-flex min-w-[2.5rem] items-center justify-center rounded-lg bg-brand/10 px-2 py-0.5 text-xs font-extrabold tabular-nums text-brand ring-1 ring-brand/15">
    {value}
  </span>
);

const DataTable = ({
  columns,
  rows,
  idKey,
  loading = false,
  onEdit,
  onDelete,
  onRowClick,
  clickableColumnKey,
  pagination,
}) => {
  const hasActions = Boolean(onEdit || onDelete);
  const isClickable = Boolean(onRowClick);
  const columnCount = columns.length + (hasActions ? 1 : 0);
  const showSkeleton = loading && rows.length === 0;
  const showOverlay = loading && rows.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_8px_30px_rgba(13,13,13,0.06)]">
      <div
        className={[
          "relative overflow-x-auto",
          showSkeleton ? "min-h-[280px]" : "",
        ].join(" ")}
      >
        {showOverlay && <TableLoadingOverlay />}

        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-canvas/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-900/55 dark:text-neutral-500"
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-2 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-900/55 dark:text-neutral-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-hairline/80">
            {showSkeleton ? (
              <TableSkeletonRows columnCount={columnCount} />
            ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={row[idKey]}
                onClick={isClickable ? () => onRowClick(row) : undefined}
                className={[
                  "group transition duration-150",
                  rowIndex % 2 === 0 ? "bg-surface" : "bg-canvas/35",
                  "hover:bg-brand/[0.04] dark:hover:bg-brand/10",
                  isClickable ? "cursor-pointer" : "",
                ].join(" ")}
              >
                {columns.map((col) => {
                  const value = resolveCell(row, col);
                  const isId = col.key === idKey;
                  const isClickableCell =
                    isClickable && (col.key === clickableColumnKey || col.key === "name");

                  return (
                    <td
                      key={col.key}
                      className={[
                        "whitespace-nowrap px-4 py-2 font-medium text-ink",
                        isId ? "" : "text-zinc-800 dark:text-neutral-200",
                      ].join(" ")}
                    >
                      {col.type === "status" ? (
                        <StatusBadge active={value} />
                      ) : col.type === "boolean" ? (
                        <BooleanBadge value={value} />
                      ) : col.type === "link" && value ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1.5 text-xs font-bold text-brand transition hover:bg-brand/15"
                        >
                          Open
                          <ExternalLink size={13} strokeWidth={2.4} />
                        </a>
                      ) : isId ? (
                        <IdBadge value={value} />
                      ) : isClickableCell ? (
                        <span className="inline-flex max-w-[240px] items-center gap-1.5 truncate font-bold text-brand">
                          <span className="truncate">{formatValue(value, col.type)}</span>
                          <ChevronRight
                            size={14}
                            strokeWidth={2.4}
                            className="shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                          />
                        </span>
                      ) : col.type === "date" ? (
                        <span className="text-xs font-semibold text-zinc-900/70 dark:text-neutral-400">
                          {formatValue(value, col.type)}
                        </span>
                      ) : (
                        <span className="max-w-[240px] truncate block">
                          {formatValue(value, col.type)}
                        </span>
                      )}
                    </td>
                  );
                })}

                {hasActions && (
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end">
                      <div className="inline-flex items-center gap-0.5 rounded-lg border border-hairline bg-canvas/70 p-0.5 opacity-80 transition group-hover:opacity-100 dark:bg-white/5">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            aria-label="Edit"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-700 transition hover:bg-brand hover:text-white dark:text-neutral-300"
                          >
                            <Pencil size={14} strokeWidth={2.2} />
                          </button>
                        )}
                        {onEdit && onDelete && (
                          <span className="h-4 w-px bg-hairline" />
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                            aria-label="Delete"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-700 transition hover:bg-red-500 hover:text-white dark:text-neutral-300"
                          >
                            <Trash2 size={14} strokeWidth={2.2} />
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
      {pagination ? <TablePagination {...pagination} /> : null}
    </div>
  );
};

export default DataTable;
