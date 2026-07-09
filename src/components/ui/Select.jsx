import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  ({ className = "", invalid = false, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={[
          "h-11 w-full appearance-none rounded-xl border bg-canvas px-3.5 pr-10 text-sm font-medium text-ink outline-none transition",
          invalid
            ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            : "border-hairline focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2.4}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-900/60 dark:text-neutral-400"
      />
    </div>
  ),
);

Select.displayName = "Select";

export default Select;
