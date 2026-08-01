import { GlowCard } from "@/components/ui/spotlight-card";

const programs = [
  { level: "Foundation", duration: "1 Year", desc: "Chinese language + academic prep for direct university entry.", popular: ["Chinese Language", "Pre-Medicine", "Pre-Engineering"] },
  { level: "Bachelor's", duration: "4–6 Years", desc: "Full undergraduate degrees taught in English or Chinese.", popular: ["MBBS", "Computer Science", "Business Admin", "Engineering"] },
  { level: "Master's", duration: "2–3 Years", desc: "Postgraduate programs with research and scholarship opportunities.", popular: ["MBA", "Public Health", "Civil Engineering", "CS"] },
  { level: "PhD", duration: "3–4 Years", desc: "Doctoral research with full CSC scholarship eligibility.", popular: ["Engineering", "Medicine", "Social Sciences"] },
];

const ProgramsSection = () => (
  <section className="py-24 px-4 border-t border-border" id="programs">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Programs & Services</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">We support all degree levels — from foundation to PhD.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((p) => (
          <GlowCard
            key={p.level}
            customSize
            glowColor="gold"
            backdropColor="hsl(var(--card) / 0.97)"
            radius={16}
            className="p-8 shadow-[0_8px_24px_rgba(11,31,58,0.06)] hover:shadow-[0_12px_32px_rgba(11,31,58,0.1)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl font-bold">{p.level}</h3>
              <span className="text-xs font-bold text-primary-text bg-primary/10 px-4 py-1.5 rounded-full">{p.duration}</span>
            </div>
            <p className="text-muted-foreground mb-5">{p.desc}</p>
            <div className="flex flex-wrap gap-2">
              {p.popular.map((m) => (
                <span key={m} className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">{m}</span>
              ))}
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  </section>
);

export default ProgramsSection;
