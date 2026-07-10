const SKELETON_ROW_COUNT = 6;

const SkeletonBar = ({ className = "" }) => (
  <div
    className={[
      "h-3 rounded-lg skeleton-shimmer",
      className,
    ].join(" ")}
  />
);

export const TableSkeletonRows = ({ columnCount, rowCount = SKELETON_ROW_COUNT }) =>
  Array.from({ length: rowCount }).map((_, rowIndex) => (
    <tr
      key={`skeleton-${rowIndex}`}
      className={rowIndex % 2 === 0 ? "bg-surface" : "bg-canvas/35"}
    >
      {Array.from({ length: columnCount }).map((__, colIndex) => (
        <td key={colIndex} className="px-4 py-3">
          <SkeletonBar
            className={
              colIndex === 0
                ? "w-10"
                : colIndex === columnCount - 1
                  ? "ml-auto w-16"
                  : colIndex % 3 === 0
                    ? "w-3/4"
                    : colIndex % 3 === 1
                      ? "w-1/2"
                      : "w-2/3"
            }
          />
        </td>
      ))}
    </tr>
  ));

export const TableLoadingOverlay = ({ label = "Loading records…" }) => (
  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-surface/60 backdrop-blur-[2px]">
    <div className="flex items-center gap-3.5 rounded-2xl border border-hairline/80 bg-surface/95 px-5 py-3.5 shadow-[0_12px_40px_rgba(13,13,13,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-brand/15" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand border-r-brand/40 animate-spin" />
        <span className="h-2 w-2 rounded-full bg-brand/80 animate-pulse" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-ink">{label}</span>
        <span className="text-[11px] font-medium text-zinc-900/50 dark:text-neutral-500">
          Please wait a moment
        </span>
      </div>
    </div>
  </div>
);
