import { trustStats } from "@/lib/site-config";

const StatsBar = () => (
  <section className="py-16 px-4 border-b border-border">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
      {trustStats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-primary-text">{s.value}</div>
          <div className="text-xs text-muted-foreground tracking-wider uppercase mt-2">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsBar;
