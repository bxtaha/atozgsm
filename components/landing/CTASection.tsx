const CTASection = () => (
  <section className="py-24 px-4">
    <div className="max-w-3xl mx-auto text-center">
      <div className="bg-console-surface border border-border rounded-3xl p-10 lg:p-16 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border">
            <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">📌 Important</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Fill out the form below and a counselor will reach out within 24 hours. It's 100% free.
          </p>

          <a
            href="#apply"
            className="inline-block px-10 py-4 rounded-full bg-primary text-primary-foreground text-base font-bold tracking-wider uppercase hover:brightness-110 transition-all shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
          >
            Get Free Counseling
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
