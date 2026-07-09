import { NavLink } from "react-router-dom";
import { FileText, Cable, PhoneCall } from "lucide-react";
import { ROUTES } from "../../lib/constants";

const tabs = [
  { key: "legalDocuments", label: "Legal Documents", icon: FileText, to: ROUTES.client.legalDocuments },
  { key: "productChannels", label: "Product Channels", icon: Cable, to: ROUTES.client.productChannels },
  { key: "callingConfig", label: "Calling Config", icon: PhoneCall, to: ROUTES.client.callingConfig },
];

const ClientWorkspaceNav = () => (
  <nav className="flex flex-wrap gap-2">
    {tabs.map(({ key, label, icon: Icon, to }) => (
      <NavLink
        key={key}
        to={to}
        className={({ isActive }) =>
          [
            "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition",
            isActive
              ? "bg-brand text-white shadow-[0_8px_20px_rgba(44,119,163,0.28)]"
              : "border border-hairline bg-surface text-zinc-800 hover:border-brand/30 hover:text-brand dark:text-neutral-200",
          ].join(" ")
        }
      >
        <Icon size={14} strokeWidth={2.2} />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default ClientWorkspaceNav;
