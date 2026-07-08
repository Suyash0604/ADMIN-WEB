import { summaryTiles } from "../../data/schema";

const OverviewHero = () => {
  return (
    <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {summaryTiles.map((tile) => (
        <div
          key={tile.key}
          className="flex min-h-[132px] flex-col justify-between rounded-2xl border border-brand/20 bg-brand/[0.06] p-6 dark:bg-brand/15"
        >
          <p className="text-[13px] font-medium leading-snug text-zinc-900 dark:text-neutral-400">
            {tile.label}
          </p>
          <p className="flex items-baseline gap-1.5">
            <span className="text-[42px] font-extrabold leading-none tracking-tight text-ink">
              {tile.value}
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-neutral-400">
              {tile.caption}
            </span>
          </p>
        </div>
      ))}
    </section>
  );
};

export default OverviewHero;
