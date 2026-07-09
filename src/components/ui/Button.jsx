import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-brand text-white shadow-[0_10px_28px_rgba(44,119,163,0.28)] hover:opacity-95 focus-visible:ring-brand/40",
  secondary:
    "border border-hairline bg-surface text-ink hover:bg-neutral-100 dark:hover:bg-white/10 focus-visible:ring-brand/30",
  danger:
    "bg-red-600 text-white shadow-[0_10px_28px_rgba(220,38,38,0.25)] hover:bg-red-700 focus-visible:ring-red-500/40",
  ghost:
    "text-zinc-900 hover:bg-neutral-100 hover:text-ink dark:text-neutral-300 dark:hover:bg-white/10 focus-visible:ring-brand/30",
};

const SIZES = {
  sm: "h-9 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  icon: "h-9 w-9 justify-center",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  type = "button",
  className = "",
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center rounded-xl font-bold transition focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <Spinner size={size === "sm" ? 15 : 17} />
      ) : (
        Icon && <Icon size={size === "sm" ? 15 : 17} strokeWidth={2.3} />
      )}
      {children}
    </button>
  );
};

export default Button;
