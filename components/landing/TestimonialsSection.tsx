const testimonials = [
  {
    name: "Arafat Hossain",
    program: "MBBS, Wuhan University",
    quote: "I was confused about the whole process, but they guided me from application to visa. Now I'm in my 3rd year of MBBS with a partial scholarship!",
    year: "2023",
  },
  {
    name: "Farhana Begum",
    role: "Parent",
    quote: "As a parent, I needed to trust the agency with my son's future. Their real office in Dhaka and transparent fees gave me confidence. My son is thriving in Beijing now.",
    year: "2024",
  },
  {
    name: "Mahin Rahman",
    program: "MSc Computer Science, Tsinghua University",
    quote: "I applied for a CSC scholarship through them and got it! The application support and document review were incredibly thorough.",
    year: "2024",
  },
];

const TestimonialsSection = () => (
  <section className="py-24 px-4 border-t border-border bg-muted/40" id="testimonials">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Student Success Stories</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">Hear from Bangladeshi students who made it to China with our help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-console-surface border border-border border-t-4 border-t-primary rounded-2xl p-8 flex flex-col shadow-[0_8px_24px_rgba(11,31,58,0.06)]">
            <div className="text-4xl text-primary/60 mb-4">"</div>
            <p className="text-muted-foreground leading-relaxed flex-1">{t.quote}</p>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.program || t.role} · {t.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
