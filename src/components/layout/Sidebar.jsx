import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { buildNavItems } from "../../lib/navItems";
import { useAuth } from "../../context/AuthContext";

const baseRow =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-150";
const inactiveRow =
  "text-zinc-700 hover:bg-canvas/90 dark:text-neutral-300 dark:hover:bg-white/[0.06]";
const activeLeafRow =
  "bg-brand text-white shadow-[0_4px_14px_rgba(44,119,163,0.28)]";
const activeParentRow =
  "bg-brand/10 text-brand ring-1 ring-inset ring-brand/20 dark:bg-brand/15";

const collapsedBtn =
  "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold transition duration-150";
const collapsedInactive =
  "bg-canvas text-zinc-700 ring-1 ring-inset ring-hairline hover:bg-neutral-100 dark:bg-white/[0.04] dark:text-neutral-300 dark:ring-white/10 dark:hover:bg-white/10";
const collapsedActive =
  "bg-brand text-white shadow-[0_8px_20px_rgba(44,119,163,0.32)]";

const TopNavIcon = ({ Icon, active, isParentActive }) => (
  <span
    className={[
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition",
      active && !isParentActive
        ? "bg-white/20 text-white"
        : isParentActive
          ? "bg-brand/15 text-brand dark:bg-brand/20"
          : "bg-canvas text-zinc-600 ring-1 ring-inset ring-hairline dark:bg-white/[0.06] dark:text-neutral-400 dark:ring-white/10",
    ].join(" ")}
  >
    <Icon size={17} strokeWidth={2.2} />
  </span>
);

const SubNavLabel = ({ label, compact = false }) => (
  <div
    className={[
      "px-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-900/40 dark:text-neutral-500",
      compact ? "pb-1 pt-2" : "pb-1 pt-2.5",
    ].join(" ")}
  >
    {label}
  </div>
);

const SubNavButton = ({ sub, active, onClick, compact = false }) => {
  const SubIcon = sub.icon;

  return (
    <button
      type="button"
      disabled={!sub.to}
      onClick={onClick}
      className={[
        "relative flex items-center gap-2.5 rounded-lg text-left font-medium transition duration-150",
        compact ? "px-2 py-1.5 text-[13px]" : "px-2.5 py-2 text-[13px]",
        active
          ? "bg-brand/10 font-semibold text-brand"
          : "text-zinc-700 hover:bg-canvas/90 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-neutral-200",
        !sub.to ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {active && (
        <span className="absolute -left-3 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
      )}
      <SubIcon
        size={compact ? 15 : 16}
        strokeWidth={active ? 2.3 : 2.1}
        className={["shrink-0", active ? "text-brand" : "opacity-80"].join(" ")}
      />
      <span className="flex-1 truncate">{sub.label}</span>
      {!sub.to && (
        <span className="text-[10px] font-semibold text-zinc-900/45 dark:text-neutral-500">
          soon
        </span>
      )}
    </button>
  );
};

const NavItem = ({ item, collapsed }) => {
  const { label, icon: Icon, subItems, to, relatedRoutes } = item;
  const hasSub = subItems && subItems.length > 0;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSubActive = (sub) =>
    sub.type === "item" && sub.to && pathname === sub.to;
  const isRelatedActive = relatedRoutes?.includes(pathname);
  const isActive = hasSub
    ? subItems.some(isSubActive) || isRelatedActive
    : to && pathname === to;
  const isParentActive = hasSub && isActive;
  const isLeafActive = isActive && !hasSub;

  const [open, setOpen] = useState(isActive);

  const handleTopClick = () => {
    if (hasSub) {
      const firstRoute = subItems.find((s) => s.type === "item" && s.to)?.to;
      if (collapsed && firstRoute) navigate(firstRoute);
      else setOpen((prev) => !prev);
    } else if (to) {
      navigate(to);
    }
  };

  if (collapsed) {
    return (
      <div className="group relative w-full">
        <button
          type="button"
          aria-label={label}
          onClick={handleTopClick}
          className={[
            collapsedBtn,
            isActive ? collapsedActive : collapsedInactive,
          ].join(" ")}
        >
          <Icon size={19} strokeWidth={2.2} />
        </button>

        {hasSub ? (
          <div className="pointer-events-none absolute left-full top-0 z-30 -translate-x-1 pl-3 opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100">
            <div className="relative min-w-[230px] rounded-2xl border border-hairline bg-surface p-2 shadow-[0_16px_44px_rgba(13,13,13,0.16)]">
              <span className="absolute -left-1.5 top-4 h-3 w-3 rotate-45 border-b border-l border-hairline bg-surface" />

              <div className="flex items-center gap-2.5 px-2 pb-2 pt-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon size={15} strokeWidth={2.2} />
                </span>
                <span className="text-sm font-bold text-ink">{label}</span>
              </div>

              <div className="mx-1 mb-1 h-px bg-hairline" />

              <div className="flex flex-col">
                {subItems.map((sub) =>
                  sub.type === "label" ? (
                    <SubNavLabel key={sub.key} label={sub.label} compact />
                  ) : (
                    <SubNavButton
                      key={sub.key}
                      sub={sub}
                      active={isSubActive(sub)}
                      compact
                      onClick={() => sub.to && navigate(sub.to)}
                    />
                  ),
                )}
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
        onClick={handleTopClick}
        className={[
          baseRow,
          isLeafActive
            ? activeLeafRow
            : isParentActive
              ? activeParentRow
              : inactiveRow,
        ].join(" ")}
      >
        <TopNavIcon
          Icon={Icon}
          active={isLeafActive}
          isParentActive={isParentActive}
        />
        <span className="flex-1 text-left">{label}</span>
        {hasSub && (
          <ChevronDown
            size={16}
            strokeWidth={2.4}
            className={[
              "shrink-0 opacity-70 transition",
              open ? "rotate-180" : "",
              isParentActive ? "text-brand" : "",
            ].join(" ")}
          />
        )}
      </button>

      {hasSub && open && (
        <div className="relative mt-1.5 ml-5 flex flex-col gap-0.5 border-l border-hairline pl-3">
          {subItems.map((sub) =>
            sub.type === "label" ? (
              <SubNavLabel key={sub.key} label={sub.label} />
            ) : (
              <SubNavButton
                key={sub.key}
                sub={sub}
                active={isSubActive(sub)}
                onClick={() => sub.to && navigate(sub.to)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ collapsed = false }) => {
  const { canAccessEntity, isClientOnboardingUser, isRbacUser } = useAuth();
  const navItems = useMemo(
    () => buildNavItems(canAccessEntity, isClientOnboardingUser, isRbacUser),
    [canAccessEntity, isClientOnboardingUser, isRbacUser],
  );

  return (
    <aside
      className={[
        "relative z-40 hidden h-full shrink-0 flex-col bg-surface pt-6 pb-5 transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-[67px] items-center px-3" : "w-60 overflow-y-auto px-4",
      ].join(" ")}
    >
      <nav className="flex w-full flex-col gap-1">
        {navItems.map((item, index) => (
          <div key={item.key}>
            {index > 0 && <div className="my-2 h-px bg-hairline" aria-hidden />}
            <NavItem item={item} collapsed={collapsed} />
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
