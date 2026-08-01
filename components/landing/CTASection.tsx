const CTASection = () => (
  <section className="pt-24 pb-16 px-4 bg-secondary">
    <div className="max-w-3xl mx-auto text-center">
      <div className="relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20">
            <span className="text-xs font-bold tracking-wider uppercase text-secondary-foreground/80">📌 Important</span>
          </div>

          <h2 className="font-display text-3xl lg:text-4xl font-bold text-secondary-foreground">
            Ready to Start Your Journey?
          </h2>
          <p className="text-secondary-foreground/80 text-lg max-w-lg mx-auto">
            Fill out the form below and a counselor will reach out within 24 hours. It's 100% free.
          </p>

          <a
            href="#apply"
            className="inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground text-base font-bold tracking-wider uppercase hover:brightness-105 transition-all shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
          >
            Get Free Counseling
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
