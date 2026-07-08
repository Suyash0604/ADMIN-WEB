import { useState } from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { entities, SERVICES } from "../../data/schema";

const rbacSubItems = entities.filter((e) => e.service === SERVICES.RBAC);
const clientSubItems = entities.filter((e) => e.service === SERVICES.CLIENT);
const aiSubItems = entities.filter((e) => e.service === SERVICES.AI);

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "rbac", label: "RBAC", icon: ShieldCheck, subItems: rbacSubItems },
  { key: "client", label: "Client", icon: Building2, subItems: clientSubItems },
  { key: "ai", label: "AI Services", icon: Sparkles, subItems: aiSubItems },
];

const baseRow =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition";
const inactiveRow =
  "text-zinc-900 hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-ink";
const activeRow = "bg-brand text-white";

const NavItem = ({ item, active, collapsed }) => {
  const { key, label, icon: Icon, subItems } = item;
  const isActive = key === active;
  const hasSub = subItems && subItems.length > 0;
  const [open, setOpen] = useState(false);

  if (collapsed) {
    return (
      <div className="group relative w-full">
        <button
          type="button"
          aria-label={label}
          className={[
            baseRow,
            "justify-center px-0",
            isActive ? activeRow : inactiveRow,
          ].join(" ")}
        >
          <Icon size={19} strokeWidth={2.2} />
        </button>

        {hasSub ? (
          <div className="pointer-events-none absolute left-full top-0 z-30 -translate-x-1 pl-3 opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100">
            <div className="relative min-w-[210px] rounded-2xl border border-hairline bg-surface p-2 shadow-[0_16px_44px_rgba(13,13,13,0.16)]">
              <span className="absolute -left-1.5 top-4 h-3 w-3 rotate-45 border-b border-l border-hairline bg-surface" />

              <div className="flex items-center gap-2.5 px-2 pb-2 pt-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon size={15} strokeWidth={2.2} />
                </span>
                <span className="text-sm font-bold text-ink">{label}</span>
              </div>

              <div className="mx-1 mb-1 h-px bg-hairline" />

              <div className="flex flex-col">
                {subItems.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <button
                      key={sub.key}
                      type="button"
                      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] font-medium text-zinc-900 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-ink"
                    >
                      <SubIcon size={15} strokeWidth={2.1} className="shrink-0" />
                      <span className="flex-1 truncate">{sub.label}</span>
                      <span className="text-[11px] font-semibold text-zinc-900/45 dark:text-neutral-500">
                        {sub.records}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => hasSub && setOpen((prev) => !prev)}
        className={[baseRow, isActive ? activeRow : inactiveRow].join(" ")}
      >
        <Icon size={19} strokeWidth={2.2} />
        <span className="flex-1 text-left">{label}</span>
        {hasSub && (
          <ChevronDown
            size={16}
            strokeWidth={2.4}
            className={["transition", open ? "rotate-180" : ""].join(" ")}
          />
        )}
      </button>

      {hasSub && open && (
        <div className="mt-1 flex flex-col gap-0.5 pl-5">
          {subItems.map((sub) => {
            const SubIcon = sub.icon;
            return (
              <button
                key={sub.key}
                type="button"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-900 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-ink"
              >
                <SubIcon size={16} strokeWidth={2.1} />
                <span className="truncate">{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ active = "overview", collapsed = false }) => {
  return (
    <aside
      className={[
        "relative z-40 flex h-full shrink-0 flex-col bg-transparent pt-6 pb-5 transition-[width] duration-200 ease-out",
        collapsed ? "w-[84px] items-center px-3" : "w-60 overflow-y-auto px-4",
      ].join(" ")}
    >
      <nav className="flex w-full flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            active={active}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
