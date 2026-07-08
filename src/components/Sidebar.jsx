import { useRef, useState } from "react";
import { LayoutDashboard, ShieldCheck, Building2, Sparkles } from "lucide-react";
import { entities, SERVICES } from "../data/schema";

const rbacSubItems = entities.filter((e) => e.service === SERVICES.RBAC);
const clientSubItems = entities.filter((e) => e.service === SERVICES.CLIENT);
const aiSubItems = entities.filter((e) => e.service === SERVICES.AI);

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "rbac", label: "RBAC", icon: ShieldCheck, subItems: rbacSubItems },
  { key: "client", label: "Client", icon: Building2, subItems: clientSubItems },
  { key: "ai", label: "AI Services", icon: Sparkles, subItems: aiSubItems },
];

const SubnavFlyout = ({ items, open }) => {
  const startX = 50;
  const spacing = 46;
  const n = items.length;
  const panelWidth = startX + (n - 1) * spacing + 44;

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{ left: 22, top: 22 }}
      aria-hidden={!open}
    >
      {/* invisible hover bridge so the menu stays open across the gap */}
      <div
        className={open ? "pointer-events-auto" : "pointer-events-none"}
        style={{ position: "absolute", left: 0, top: -30, width: panelWidth + 20, height: 60 }}
      />

      {/* frosted backdrop panel */}
      <div
        className={[
          "absolute rounded-full bg-white/45 ring-1 ring-black/5 backdrop-blur-md transition-all duration-200 ease-out",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          left: startX - 27,
          top: -28,
          width: panelWidth,
          height: 56,
          transform: open ? "scale(1)" : "scale(0.9)",
          transformOrigin: "left center",
        }}
      />

      {items.map((item, i) => {
        const x = startX + i * spacing;
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="group/sub absolute transition-all duration-200 ease-out"
            style={{
              transform: open
                ? `translate(calc(-50% + ${x}px), -50%) scale(1)`
                : "translate(-50%, -50%) scale(0.4)",
              opacity: open ? 1 : 0,
              transitionDelay: open ? `${i * 25}ms` : "0ms",
            }}
          >
            <button
              type="button"
              aria-label={item.label}
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full bg-surface text-neutral-500 ring-1 ring-hairline transition hover:bg-brand hover:text-white hover:ring-0",
                open ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
            >
              <Icon size={16} strokeWidth={2.2} />
            </button>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover/sub:opacity-100">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const NavItem = ({ item, active, collapsed }) => {
  const { key, label, icon: Icon, subItems } = item;
  const isActive = key === active;
  const hasSub = subItems && subItems.length > 0;

  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const handleEnter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 220);
  };

  const circle = (
    <span
      className={[
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition",
        isActive
          ? "brand-gradient text-white"
          : "bg-surface text-neutral-400 group-hover:text-ink",
      ].join(" ")}
    >
      <Icon size={19} strokeWidth={2.2} />
    </span>
  );

  return (
    <div
      className={["group relative", collapsed ? "" : "w-full"].join(" ")}
      onMouseEnter={hasSub ? handleEnter : undefined}
      onMouseLeave={hasSub ? handleLeave : undefined}
    >
      <button
        type="button"
        aria-label={label}
        className={collapsed ? "block" : "flex w-full items-center gap-3 text-left"}
      >
        {circle}
        {!collapsed && (
          <span
            className={[
              "text-sm font-semibold transition",
              isActive ? "text-ink" : "text-neutral-500 group-hover:text-ink",
            ].join(" ")}
          >
            {label}
          </span>
        )}
      </button>

      {collapsed && !hasSub && (
        <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
          {label}
        </span>
      )}

      {hasSub && <SubnavFlyout items={subItems} open={open} />}
    </div>
  );
};

const Sidebar = ({ active = "overview", collapsed = false }) => {
  return (
    <aside
      className={[
        "relative z-40 flex h-full shrink-0 flex-col bg-transparent pt-6 pb-5 transition-[width] duration-200 ease-out",
        collapsed ? "w-[84px] items-center px-3" : "w-60 px-4",
      ].join(" ")}
    >
      <nav
        className={[
          "flex flex-col gap-2",
          collapsed ? "w-full items-center" : "",
        ].join(" ")}
      >
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
