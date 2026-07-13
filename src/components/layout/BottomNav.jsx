import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { buildNavItems } from "../../lib/navItems";
import { useAuth } from "../../context/AuthContext";

const BottomNav = () => {
  const { canAccessEntity, isClientOnboardingUser, isRbacUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sheetItem, setSheetItem] = useState(null);

  const navItems = useMemo(
    () => buildNavItems(canAccessEntity, isClientOnboardingUser, isRbacUser),
    [canAccessEntity, isClientOnboardingUser, isRbacUser],
  );

  useEffect(() => {
    setSheetItem(null);
  }, [pathname]);

  useEffect(() => {
    if (!sheetItem) return undefined;
    const onKey = (e) => e.key === "Escape" && setSheetItem(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheetItem]);

  const isItemActive = (item) => {
    if (item.to) return pathname === item.to;
    if (item.relatedRoutes?.includes(pathname)) return true;
    return item.subItems?.some(
      (sub) => sub.type === "item" && sub.to && pathname === sub.to,
    );
  };

  const handleTap = (item) => {
    const hasSub = item.subItems?.some((s) => s.type === "item" && s.to);
    if (hasSub) {
      setSheetItem(item);
      return;
    }
    if (item.to) navigate(item.to);
  };

  const SheetIcon = sheetItem?.icon;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        aria-label="Primary"
      >
        <div className="flex h-[4.25rem] items-stretch justify-around px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);
            const label = item.shortLabel ?? item.label;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleTap(item)}
                className={[
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 transition",
                  active
                    ? "text-brand"
                    : "text-zinc-600 dark:text-neutral-400",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-brand/12 text-brand"
                      : "bg-transparent",
                  ].join(" ")}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 2.1} />
                </span>
                <span className="max-w-full truncate text-[10px] font-bold tracking-wide">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {sheetItem && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setSheetItem(null)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-hidden rounded-t-3xl border border-hairline bg-surface shadow-[0_-16px_48px_rgba(13,13,13,0.18)] pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  {SheetIcon ? <SheetIcon size={18} strokeWidth={2.2} /> : null}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-ink">
                    {sheetItem.label}
                  </p>
                  <p className="text-[11px] font-medium text-zinc-900/55 dark:text-neutral-500">
                    Choose a section
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSheetItem(null)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-canvas dark:text-neutral-400 dark:hover:bg-white/10"
              >
                <X size={18} strokeWidth={2.3} />
              </button>
            </div>

            <div className="overflow-y-auto px-3 py-3">
              <div className="flex flex-col gap-0.5">
                {sheetItem.subItems.map((sub) => {
                  if (sub.type === "label") {
                    return (
                      <div
                        key={sub.key}
                        className="px-3 pb-1 pt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-900/40 dark:text-neutral-500"
                      >
                        {sub.label}
                      </div>
                    );
                  }

                  const SubIcon = sub.icon;
                  const active = pathname === sub.to;

                  return (
                    <button
                      key={sub.key}
                      type="button"
                      disabled={!sub.to}
                      onClick={() => {
                        if (!sub.to) return;
                        setSheetItem(null);
                        navigate(sub.to);
                      }}
                      className={[
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                        active
                          ? "bg-brand/10 font-semibold text-brand"
                          : "text-ink hover:bg-canvas dark:hover:bg-white/[0.06]",
                        !sub.to ? "cursor-not-allowed opacity-50" : "",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          active
                            ? "bg-brand/15 text-brand"
                            : "bg-canvas text-zinc-600 ring-1 ring-inset ring-hairline dark:bg-white/[0.06] dark:text-neutral-400 dark:ring-white/10",
                        ].join(" ")}
                      >
                        <SubIcon size={17} strokeWidth={2.2} />
                      </span>
                      <span className="flex-1 truncate text-sm font-semibold">
                        {sub.label}
                      </span>
                      {!sub.to && (
                        <span className="text-[10px] font-semibold text-zinc-900/45 dark:text-neutral-500">
                          soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
