const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface/60 px-6 py-16 text-center">
    {Icon && (
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon size={22} strokeWidth={2.1} />
      </span>
    )}
    <p className="mt-4 text-sm font-bold text-ink">{title}</p>
    {description && (
      <p className="mt-1 max-w-sm text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
