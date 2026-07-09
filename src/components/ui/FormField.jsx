import { AlertCircle } from "lucide-react";

const FormField = ({ label, htmlFor, required, error, help, children }) => (
  <div className="flex flex-col">
    {label && (
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-zinc-900 dark:text-neutral-400"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
        <AlertCircle size={13} strokeWidth={2.4} />
        {error}
      </p>
    ) : (
      help && (
        <p className="mt-1.5 text-xs font-medium text-zinc-900/60 dark:text-neutral-500">
          {help}
        </p>
      )
    )}
  </div>
);

export default FormField;
