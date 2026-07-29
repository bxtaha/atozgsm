import { GraduationCap, ShieldCheck, Plane, BadgeDollarSign, BookOpen, Globe } from "lucide-react";

const benefits = [
  { icon: BadgeDollarSign, title: "Scholarship Guidance", desc: "CSC, university-specific, and partial scholarship opportunities curated for you." },
  { icon: ShieldCheck, title: "Visa Support", desc: "End-to-end visa preparation with document checking and interview coaching." },
  { icon: BookOpen, title: "Application Support", desc: "We handle your university applications — from document review to submission." },
  { icon: GraduationCap, title: "Top Universities", desc: "Access 100+ recognized Chinese universities across all degree levels." },
  { icon: Plane, title: "Pre-Departure Help", desc: "Airport pickup coordination, accommodation guidance, and orientation support." },
  { icon: Globe, title: "Global Career Boost", desc: "A Chinese degree opens doors across Asia, the Middle East, and beyond." },
];

const BenefitsSection = () => (
  <section className="py-24 px-4" id="benefits">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need to make studying in China simple, affordable, and stress-free.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b) => (
          <div key={b.title} className="relative overflow-hidden bg-console-surface border border-border rounded-2xl p-8 shadow-[0_8px_24px_rgba(11,31,58,0.06)] hover:shadow-[0_12px_32px_rgba(11,31,58,0.1)] transition-shadow group">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
              <b.icon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">{b.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
