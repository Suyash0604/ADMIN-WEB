import { summaryTiles } from "../data/schema";

const OverviewHero = () => {
  return (
    <section className="brand-gradient relative overflow-hidden rounded-3xl px-6 py-7 text-white shadow-[0_16px_40px_rgba(15,95,96,0.28)] sm:px-8">
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-white/15">
        {summaryTiles.map((tile, i) => (
          <div key={tile.key} className={i > 0 ? "sm:pl-8" : ""}>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              {tile.label}
            </p>
            <p className="mt-1.5 text-4xl font-extrabold tracking-tight">
              {tile.value}
            </p>
            <p className="mt-1 text-xs font-semibold text-white/80">
              {tile.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OverviewHero;
