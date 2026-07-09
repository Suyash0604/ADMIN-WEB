import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { ROUTES } from "../../lib/constants";

const SelectClientPrompt = () => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-hairline bg-surface/60 px-6 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
      <Info size={22} strokeWidth={2.2} />
    </div>
    <div>
      <p className="text-sm font-bold text-ink">Select a client first</p>
      <p className="mt-1 max-w-md text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        Choose a client from your list to manage legal documents, product channels,
        and calling configuration.
      </p>
    </div>
    <Link
      to={ROUTES.client.clients}
      className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(44,119,163,0.28)] transition hover:opacity-95"
    >
      Go to Clients
    </Link>
  </div>
);

export default SelectClientPrompt;
