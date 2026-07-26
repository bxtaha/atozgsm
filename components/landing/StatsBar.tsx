const stats = [
  { value: "20,000+", label: "BD Students in China" },
  { value: "92%", label: "Scholarship Success" },
  { value: "97%", label: "Visa Approval Rate" },
  { value: "100+", label: "Partner Universities" },
];

const StatsBar = () => (
  <section className="py-16 px-4 border-b border-border">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-primary">{s.value}</div>
          <div className="text-xs text-muted-foreground tracking-wider uppercase mt-2">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsBar;
