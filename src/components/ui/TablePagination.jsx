import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const TablePagination = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const safeTotalPages = Math.max(1, totalPages);

  if (total <= 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const showPageControls = safeTotalPages > 1;

  return (
    <div className="flex flex-col gap-3 border-t border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-zinc-900/70 dark:text-neutral-400">
        Showing {start}–{end} of {total}
      </p>

      {showPageControls ? (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            disabled={loading || page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="min-w-[5.5rem] text-center text-xs font-bold text-ink">
            Page {page} of {safeTotalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={loading || page >= safeTotalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight size={15} strokeWidth={2.4} />
          </Button>
        </div>
      ) : (
        <span className="text-xs font-bold text-zinc-900/55 dark:text-neutral-500">
          Page 1 of 1
        </span>
      )}
    </div>
  );
};

export default TablePagination;
