import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How much does it cost to study in China?", a: "Tuition ranges from $1,500–$8,000/year depending on the program and university. Living costs are roughly $200–$400/month. Many students receive partial or full scholarships through CSC or university grants." },
  { q: "What scholarships are available for Bangladeshi students?", a: "The main options are Chinese Government Scholarship (CSC), Confucius Institute Scholarship, and individual university scholarships. We help you identify and apply for the best fit based on your profile." },
  { q: "What documents do I need?", a: "Typically: passport, academic transcripts, certificates, a personal statement, recommendation letters, health certificate, and passport-sized photos. We provide a complete checklist and review all your documents." },
  { q: "How long does the visa process take?", a: "The X1 student visa typically takes 2–4 weeks. We guide you through the JW202 form, application form, and embassy appointment. Our visa approval rate is over 97%." },
  { q: "Is it safe to study in China?", a: "Yes. China has very low crime rates and most universities have dedicated international student support offices. Many Bangladeshi students are already studying there successfully." },
  { q: "What if I don't know Chinese?", a: "Many programs — especially MBBS, Engineering, and Business — are taught entirely in English. We also help with Chinese language foundation programs if you'd like to learn." },
  { q: "How fast will I hear back after applying?", a: "A counselor will contact you within 24 hours of form submission. University application responses typically take 2–8 weeks." },
];

const FAQSection = () => (
  <section className="py-24 px-4 border-t border-border" id="faq">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg">Still unsure? Ask us — free.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-console-surface border border-border rounded-2xl px-6 data-[state=open]:border-primary/50">
            <AccordionTrigger className="font-bold text-left py-5 text-secondary hover:no-underline hover:text-primary-text">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
