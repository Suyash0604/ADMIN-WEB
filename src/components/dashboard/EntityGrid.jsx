import { SearchX } from "lucide-react";
import { entities, serviceOrder, clientNavGroups } from "../../data/schema";
import { useAuth } from "../../context/AuthContext";
import EntityCard from "./EntityCard";
import FeatureCard from "./FeatureCard";

const SectionHeader = ({ service, count }) => (
  <div className="mb-3 flex items-center gap-3">
    <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 dark:text-neutral-400">
      {service}
    </h2>
    <span className="text-xs font-semibold text-zinc-900 dark:text-neutral-500">{count}</span>
    <span className="h-px flex-1 bg-hairline" />
  </div>
);

const GroupHeader = ({ label }) => (
  <h3 className="col-span-full mb-1 mt-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-zinc-900/50 dark:text-neutral-500">
    {label}
  </h3>
);

const EntityGrid = ({ search = "" }) => {
  const { canAccessEntity } = useAuth();
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  const accessibleEntities = entities.filter((entity) => canAccessEntity(entity.key));

  const filtered = isSearching
    ? accessibleEntities.filter(
        (e) =>
          e.label.toLowerCase().includes(query) ||
          e.service.toLowerCase().includes(query) ||
          e.clientGroup?.toLowerCase().includes(query),
      )
    : accessibleEntities;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface/60 py-16 text-center">
        <SearchX size={28} strokeWidth={2} className="text-neutral-300 dark:text-neutral-600" />
        <p className="mt-3 text-sm font-semibold text-ink">No records match</p>
        <p className="mt-1 text-xs font-medium text-zinc-900 dark:text-neutral-400">
          Try a different search term.
        </p>
      </div>
    );
  }

  const renderEntityCards = (items) =>
    items.map((entity) => <EntityCard key={entity.key} entity={entity} />);

  const renderClientSection = (group, feature) => {
    const small = feature ? group.filter((e) => e !== feature) : group;
    const clients = small.filter((e) => e.key === "clients");
    const grouped = clientNavGroups
      .filter((navGroup) => navGroup.key !== "client-config")
      .map((navGroup) => ({
        ...navGroup,
        items: small.filter((e) => navGroup.keys.includes(e.key)),
      }));

    if (feature) {
      return (
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <FeatureCard entity={feature} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
            {renderEntityCards(clients)}
            {grouped.map(
              (navGroup) =>
                navGroup.items.length > 0 && (
                  <div key={navGroup.key} className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <GroupHeader label={navGroup.label} />
                    {renderEntityCards(navGroup.items)}
                  </div>
                ),
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {renderEntityCards(clients)}
        {grouped.map(
          (navGroup) =>
            navGroup.items.length > 0 && (
              <div key={navGroup.key} className="contents">
                <GroupHeader label={navGroup.label} />
                {renderEntityCards(navGroup.items)}
              </div>
            ),
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {serviceOrder.map((service, idx) => {
        const group = filtered.filter((e) => e.service === service);
        if (group.length === 0) return null;

        const feature = isSearching ? null : (group.find((e) => e.featured) ?? null);

        return (
          <section key={service}>
            <SectionHeader service={service} count={group.length} />

            {service === "Client service" ? (
              renderClientSection(group, feature)
            ) : feature ? (
              <div className="grid items-stretch gap-4 lg:grid-cols-3">
                {idx % 2 === 0 && (
                  <div className="lg:col-span-1">
                    <FeatureCard entity={feature} />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
                  {renderEntityCards(group.filter((e) => e !== feature))}
                </div>

                {idx % 2 !== 0 && (
                  <div className="lg:col-span-1">
                    <FeatureCard entity={feature} />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {renderEntityCards(group)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default EntityGrid;
