import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { routeForEntity } from "../../lib/navigation";

const FeatureCard = ({ entity }) => {
  const { key, label, records, description, icon: Icon } = entity;
  const navigate = useNavigate();
  const to = routeForEntity(key);

  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      disabled={!to}
      className="group flex h-full w-full flex-col justify-between rounded-2xl border border-brand/20 bg-brand/[0.06] p-5 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/[0.09] hover:shadow-[0_12px_34px_rgba(44,160,163,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-brand/15"
    >
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
          <Icon size={24} strokeWidth={2.1} />
        </span>
        <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
          {label}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-zinc-900 dark:text-neutral-300">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-brand ring-1 ring-brand/15">
          {records} {records === 1 ? "record" : "records"}
        </span>
        <span className="flex items-center gap-1 text-sm font-bold text-brand">
          {to ? "Manage" : "Coming soon"}
          {to && (
            <ArrowUpRight
              size={16}
              strokeWidth={2.4}
              className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </span>
      </div>
    </button>
  );
};

export default FeatureCard;
