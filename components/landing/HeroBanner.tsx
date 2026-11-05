import heroBanner from "@/assets/hero-banner.jpg";
import { AntiGravityCanvas } from "@/components/ui/particle-effect-for-hero";
import { RotatingWord } from "@/components/landing/RotatingWord";
import { trustStats } from "@/lib/site-config";

const HeroBanner = () => (
  <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-secondary">
    {/* Background image */}
    <img
      src={heroBanner.src}
      alt="Students walking on a modern Chinese university campus at golden hour"
      width={1920}
      height={864}
      loading="eager"
      className="absolute inset-0 w-full h-full object-cover"
    />

    {/* Navy overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-secondary/85 via-secondary/70 to-secondary" />

    {/* Interactive gold particle field — replaces the old static ambient blur glows.
        accentColor/glowColor are Canvas 2D fillStyle values; canvas does not
        resolve CSS custom properties (hsl(var(--primary)) silently fails to
        parse), so these stay as literal RGB/hex — they're the equivalent of
        --primary (46 65% 52%) and must be updated by hand if that token
        changes. See the component-level comment in particle-effect-for-hero.tsx. */}
    <AntiGravityCanvas accentColor="#d4af37" glowColor="212, 175, 55" />

    {/* Content */}
    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-foreground/10 backdrop-blur border border-secondary-foreground/20">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold text-primary tracking-widest uppercase">
          Eligibility: Ages 18–25
        </span>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-secondary-foreground text-balance">
        Your Journey to <RotatingWord /> Starts Here
      </h1>

      <p className="text-secondary-foreground/80 text-base lg:text-xl max-w-2xl mx-auto leading-relaxed">
        Discover the right program, prepare your documents, explore universities and
        scholarships, and get ready for your China journey with professional,
        step-by-step guidance for Bangladeshi students.
      </p>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {["Real office & verified counselors", "Transparent fees", "Fast response within 24 hours"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground/80 bg-secondary-foreground/10 backdrop-blur px-3 py-1.5 rounded-full border border-secondary-foreground/20"
          >
            <span className="text-primary">✓</span> {t}
          </span>
        ))}
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#apply"
          className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-bold tracking-wider uppercase hover:brightness-105 transition-all shadow-lg shadow-primary/25"
        >
          Apply to Study in China
        </a>
        <a
          href="#programs"
          className="px-8 py-3.5 rounded-full border border-secondary-foreground/30 text-sm font-bold tracking-wider uppercase text-secondary-foreground/80 hover:text-secondary-foreground hover:border-primary/50 transition-colors"
        >
          Explore Programs
        </a>
        <a
          href="#apply"
          className="px-8 py-3.5 rounded-full text-sm font-bold tracking-wider uppercase text-secondary-foreground/70 hover:text-primary transition-colors"
        >
          Get Free Guidance →
        </a>
      </div>

      {/* Stats row */}
      <div className="pt-8 flex flex-wrap justify-center gap-8 lg:gap-12">
        {trustStats.slice(0, 3).map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-secondary-foreground/70 tracking-wider uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom fade into the page background */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent" />
  </section>
);

export default HeroBanner;
