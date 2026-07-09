import { forwardRef } from "react";

const Input = forwardRef(({ className = "", invalid = false, ...props }, ref) => (
  <input
    ref={ref}
    className={[
      "h-11 w-full rounded-xl border bg-canvas px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-zinc-900/45 dark:placeholder:text-neutral-500",
      invalid
        ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
        : "border-hairline focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15",
      className,
    ].join(" ")}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
