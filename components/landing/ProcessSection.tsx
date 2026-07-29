const steps = [
  { num: "01", title: "Free Consultation", desc: "Talk to our counselors — assess your eligibility and explore programs." },
  { num: "02", title: "Document Preparation", desc: "We review and prepare your academic documents, transcripts, and certificates." },
  { num: "03", title: "University Application", desc: "We submit your application to matched universities and track progress." },
  { num: "04", title: "Scholarship & Admission", desc: "Receive your offer letter and scholarship confirmation." },
  { num: "05", title: "Visa & Pre-Departure", desc: "Visa application support, JW202 guidance, airport pickup, and orientation." },
];

const ProcessSection = () => (
  <section className="py-24 px-4 border-t border-border" id="process">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">A clear, step-by-step process from first contact to campus arrival.</p>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-secondary/30 hidden md:block" />
        <div className="space-y-8">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 relative z-10 shadow-[0_4px_14px_hsl(var(--primary)/0.35)]">
                <span className="text-sm font-bold text-primary-foreground">{s.num}</span>
              </div>
              <div className="pt-1">
                <h3 className="font-display font-bold text-xl mb-1">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
