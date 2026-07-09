import { useEffect } from "react";
import { X } from "lucide-react";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

const Modal = ({ open, onClose, title, description, size = "md", children }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={[
          "relative z-10 w-full overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_24px_70px_rgba(13,13,13,0.24)]",
          SIZES[size],
        ].join(" ")}
      >
        <div className="brand-gradient h-1 w-full" />
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            {title && (
              <h3 className="text-lg font-extrabold tracking-tight text-ink">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10"
          >
            <X size={18} strokeWidth={2.3} />
          </button>
        </div>
        <div className="px-6 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
