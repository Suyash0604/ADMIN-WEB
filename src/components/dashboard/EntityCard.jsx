import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { routeForEntity } from "../../lib/navigation";

const EntityCard = ({ entity }) => {
  const { key, label, records, icon: Icon } = entity;
  const navigate = useNavigate();
  const to = routeForEntity(key);

  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      disabled={!to}
      className="group flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-4 text-left shadow-[0_1px_2px_rgba(13,13,13,0.04)] transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_10px_30px_rgba(44,160,163,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:border-hairline disabled:hover:shadow-[0_1px_2px_rgba(13,13,13,0.04)]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
        <Icon size={20} strokeWidth={2.1} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="block truncate text-sm font-bold text-brand">
            {label}
          </span>
          {to && (
            <ArrowUpRight
              size={14}
              strokeWidth={2.6}
              className="shrink-0 text-brand opacity-0 transition group-hover:opacity-100"
            />
          )}
        </span>
        <span className="mt-1 inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-900 dark:bg-white/10 dark:text-neutral-300">
          {to ? "Manage" : `${records} ${records === 1 ? "record" : "records"}`}
        </span>
      </span>
    </button>
  );
};

export default EntityCard;
