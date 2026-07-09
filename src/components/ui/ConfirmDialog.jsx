import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  variant = "danger",
}) => (
  <Modal open={open} onClose={loading ? undefined : onClose} size="sm">
    <div className="flex flex-col items-center text-center">
      <span
        className={[
          "flex h-12 w-12 items-center justify-center rounded-full",
          variant === "danger"
            ? "bg-red-500/10 text-red-600 dark:text-red-400"
            : "bg-brand/10 text-brand",
        ].join(" ")}
      >
        <AlertTriangle size={22} strokeWidth={2.2} />
      </span>
      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
        {title}
      </h3>
      {message && (
        <p className="mt-1.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
          {message}
        </p>
      )}
      <div className="mt-6 flex w-full gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant={variant}
          className="flex-1"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
