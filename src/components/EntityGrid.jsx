import { SearchX } from "lucide-react";
import { entities, serviceOrder } from "../data/schema";
import EntityCard from "./EntityCard";
import FeatureCard from "./FeatureCard";

const SectionHeader = ({ service, count }) => (
  <div className="mb-3 flex items-center gap-3">
    <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
      {service}
    </h2>
    <span className="text-xs font-semibold text-neutral-400">{count}</span>
    <span className="h-px flex-1 bg-hairline" />
  </div>
);

const EntityGrid = ({ search = "" }) => {
  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  const filtered = isSearching
    ? entities.filter(
        (e) =>
          e.label.toLowerCase().includes(query) ||
          e.service.toLowerCase().includes(query),
      )
    : entities;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface/60 py-16 text-center">
        <SearchX size={28} strokeWidth={2} className="text-neutral-300" />
        <p className="mt-3 text-sm font-semibold text-ink">No records match</p>
        <p className="mt-1 text-xs font-medium text-neutral-400">
          Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {serviceOrder.map((service, idx) => {
        const group = filtered.filter((e) => e.service === service);
        if (group.length === 0) return null;

        const feature = isSearching
          ? null
          : group.find((e) => e.featured) ?? null;
        const small = feature ? group.filter((e) => e !== feature) : group;
        const featureLeft = idx % 2 === 0;

        return (
          <section key={service}>
            <SectionHeader service={service} count={group.length} />

            {feature ? (
              <div className="grid items-stretch gap-4 lg:grid-cols-3">
                {featureLeft && (
                  <div className="lg:col-span-1">
                    <FeatureCard entity={feature} />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
                  {small.map((entity) => (
                    <EntityCard key={entity.key} entity={entity} />
                  ))}
                </div>

                {!featureLeft && (
                  <div className="lg:col-span-1">
                    <FeatureCard entity={feature} />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.map((entity) => (
                  <EntityCard key={entity.key} entity={entity} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default EntityGrid;
