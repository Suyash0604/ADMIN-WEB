import { PanelLeft, PanelLeftClose, Search, Bell, ChevronDown } from "lucide-react";

const Topbar = ({ search, onSearchChange, collapsed, onToggleSidebar }) => {
  return (
    <header className="z-50 flex h-16 shrink-0 items-center gap-4 border-b border-hairline bg-surface px-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full brand-gradient text-white">
          <span className="text-sm font-extrabold">V3</span>
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-bold text-ink">PlatformV3</p>
          <p className="text-[11px] font-medium text-neutral-400">Super Admin</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-ink"
      >
        {collapsed ? (
          <PanelLeft size={18} strokeWidth={2.2} />
        ) : (
          <PanelLeftClose size={18} strokeWidth={2.2} />
        )}
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="h-5 w-px bg-hairline" />
        <span className="text-sm font-semibold text-ink">Overview</span>
      </div>

      <div className="relative ml-auto">
        <Search
          size={17}
          strokeWidth={2.2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search records"
          className="h-10 w-56 rounded-lg border border-hairline bg-canvas pl-10 pr-3 text-sm font-medium text-ink outline-none transition placeholder:text-neutral-400 focus:w-72 focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15"
        />
      </div>

      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-ink"
      >
        <Bell size={18} strokeWidth={2.2} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
      </button>

      <span className="h-6 w-px bg-hairline" />

      <button
        type="button"
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-neutral-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient text-xs font-bold text-white">
          SA
        </span>
        <span className="hidden text-sm font-semibold text-ink sm:block">
          Super Admin
        </span>
        <ChevronDown size={16} strokeWidth={2.4} className="text-neutral-400" />
      </button>
    </header>
  );
};

export default Topbar;
