import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const ACCENTS = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-brand",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (type, message) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
      return id;
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (message) => notify("success", message),
      error: (message) => notify("error", message),
      info: (message) => notify("info", message),
    }),
    [notify],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5">
        {toasts.map(({ id, type, message }) => {
          const Icon = ICONS[type] ?? Info;
          return (
            <div
              key={id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 shadow-[0_16px_44px_rgba(13,13,13,0.18)]"
            >
              <Icon
                size={18}
                strokeWidth={2.3}
                className={["mt-0.5 shrink-0", ACCENTS[type]].join(" ")}
              />
              <p className="flex-1 text-sm font-semibold text-ink">{message}</p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                aria-label="Dismiss"
                className="-mr-1 -mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-900/60 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-500 dark:hover:bg-white/10"
              >
                <X size={14} strokeWidth={2.4} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
