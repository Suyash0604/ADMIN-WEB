const PageHeader = ({ icon: Icon, title, description, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3.5">
      {Icon && (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Icon size={22} strokeWidth={2.1} />
        </span>
      )}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
