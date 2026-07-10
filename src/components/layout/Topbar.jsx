import { useState } from "react";
import {
  PanelLeft,
  PanelLeftClose,
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useClientContext } from "../../context/ClientContext";
import markyticsLogo from "../../assets/markytics-logo.png";

const getInitials = (name) => {
  if (!name) return "SA";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "SA";
};

const Topbar = ({ title = "Overview", search, onSearchChange, collapsed, onToggleSidebar }) => {
  const { user, logout, accessLabel, isClientOnboardingUser } = useAuth();
  const { selectedClient } = useClientContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user?.name || "Super Admin";
  const displayEmail = user?.email || "admin@platformv3.com";

  return (
    <header className="z-50 flex h-16 shrink-0 items-center gap-4 border-b border-hairline bg-surface px-5">
      <div className="flex items-center gap-2.5">
        <img
          src={markyticsLogo}
          alt="Markytics"
          className="h-10 w-10 rounded-xl object-contain"
        />
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-bold text-ink">Markytics</p>
          <p className="text-[11px] font-medium text-zinc-900 dark:text-neutral-400">
            {selectedClient
              ? `${accessLabel} · ${selectedClient.name || `Client #${selectedClient.client_id}`}`
              : accessLabel}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10"
      >
        {collapsed ? (
          <PanelLeft size={18} strokeWidth={2.2} />
        ) : (
          <PanelLeftClose size={18} strokeWidth={2.2} />
        )}
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="h-5 w-px bg-hairline" />
        <span className="text-sm font-semibold text-ink">{title}</span>
      </div>

      <div className="relative ml-auto">
        {!isClientOnboardingUser && (
          <>
            <Search
              size={17}
              strokeWidth={2.2}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-900 dark:text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search records"
              className="h-10 w-56 rounded-lg border border-hairline bg-canvas pl-10 pr-3 text-sm font-medium text-ink outline-none transition placeholder:text-zinc-900 dark:placeholder:text-neutral-500 focus:w-72 focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15"
            />
          </>
        )}
      </div>

      <ThemeToggle />



      <span className="h-6 w-px bg-hairline" />

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-neutral-100 dark:hover:bg-white/10"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">
            {getInitials(user?.name)}
          </span>
          <span className="hidden text-sm font-semibold text-ink sm:block">
            {displayName}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={2.4}
            className={[
              "text-zinc-900 transition dark:text-neutral-400",
              menuOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-hairline bg-surface shadow-[0_16px_44px_rgba(13,13,13,0.16)]">
              <div className="border-b border-hairline px-3 py-3">
                <p className="truncate text-sm font-bold text-ink">
                  {displayName}
                </p>
                <p className="truncate text-xs font-medium text-zinc-900 dark:text-neutral-400">
                  {displayEmail}
                </p>
              </div>
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                >
                  <LogOut size={16} strokeWidth={2.2} />
                  Log out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Topbar;
