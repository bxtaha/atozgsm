import campusHero from "@/assets/campus-hero.jpg";

const StatBar = ({ label, value, percentage, color }: { label: string; value: string; percentage: number; color: "mint" | "pink" }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold tracking-wider uppercase">
      <span className="text-secondary-foreground/80">{label}</span>
      <span className={color === "mint" ? "text-primary" : "text-secondary-foreground"}>{value}</span>
    </div>
    <div className="h-2 bg-secondary-foreground/10 rounded-full overflow-hidden p-[1px]">
      <div
        className={`h-full rounded-full animate-bar-fill ${color === "mint" ? "bg-primary" : "bg-secondary-foreground/60"}`}
        style={{ "--bar-width": `${percentage}%`, width: `${percentage}%` } as React.CSSProperties}
      />
    </div>
  </div>
);

const HeroSection = () => (
  <div className="lg:col-span-5 bg-secondary rounded-[2rem] p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold text-primary tracking-widest uppercase">Eligibility: Ages 18–25</span>
      </div>

      <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-5 text-secondary-foreground text-balance">
        Get Admission Support for China Universities — From Bangladesh
      </h1>
      <p className="text-secondary-foreground/80 text-base lg:text-lg max-w-[40ch] leading-relaxed">
        Scholarship guidance, application support, document checking, and visa prep — with a clear, step-by-step process.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {["Real office & verified counselors", "Transparent fees", "Fast response within 24 hours"].map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground/80 bg-secondary-foreground/10 px-3 py-1.5 rounded-full border border-secondary-foreground/20">
            <span className="text-primary">✓</span> {t}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-2xl overflow-hidden ring-1 ring-secondary-foreground/20">
        <img
          src={campusHero.src}
          alt="University campus in China with Bangladeshi students"
          width={1920}
          height={1080}
          loading="eager"
          className="w-full h-40 lg:h-48 object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
        />
      </div>
    </div>

    <div className="mt-8 space-y-4 relative z-10">
      <StatBar label="~20,000 BD Students in China" value="REPORTED" percentage={85} color="mint" />
      <StatBar label="Scholarship Success Rate" value="92%" percentage={92} color="pink" />
      <StatBar label="Visa Approval Rate" value="97%" percentage={97} color="mint" />
    </div>
  </div>
);

export default HeroSection;
