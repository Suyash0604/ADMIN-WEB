import { Link } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { ROUTES } from "../../lib/constants";

const SelectedClientBanner = ({ client }) => {
  if (!client) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Building2 size={18} strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
            Onboarding client
          </p>
          <p className="text-sm font-bold text-ink">
            {client.name || client.legal_name || `Client #${client.client_id}`}
          </p>
          <p className="text-xs font-medium text-zinc-900/60 dark:text-neutral-500">
            ID {client.client_id}
            {client.legal_name && client.name ? ` · ${client.legal_name}` : ""}
          </p>
        </div>
      </div>

      <Link
        to={ROUTES.client.clients}
        className="inline-flex items-center gap-1.5 self-start rounded-lg border border-hairline bg-surface px-3 py-2 text-xs font-bold text-brand transition hover:border-brand/30 hover:bg-brand/10 sm:self-center"
      >
        <ArrowLeft size={14} strokeWidth={2.3} />
        Change client
      </Link>
    </div>
  );
};

export default SelectedClientBanner;
