import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const contacts = [
  { icon: MapPin, label: "Office Address", value: "House 12, Road 5, Block C, Banani, Dhaka 1213, Bangladesh" },
  { icon: Phone, label: "Phone", value: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
  { icon: MessageCircle, label: "WhatsApp", value: "+880 1XXX-XXXXXX", href: "https://wa.me/8801XXXXXXXXX" },
  { icon: Mail, label: "Email", value: "admissions@example.com", href: "mailto:admissions@example.com" },
  { icon: Clock, label: "Working Hours", value: "Sat–Thu: 10:00 AM – 7:00 PM" },
];

const ContactSection = () => (
  <section className="py-16 px-4 bg-secondary" id="contact">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4 text-secondary-foreground">Contact Us</h2>
        <p className="text-secondary-foreground/80 text-lg">Visit our office or reach out — we're here to help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {contacts.map((c) => (
          <div key={c.label} className="flex gap-4 items-start bg-secondary-foreground/5 border border-secondary-foreground/15 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <c.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-secondary-foreground/60 mb-1">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="text-secondary-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">{c.value}</a>
              ) : (
                <p className="text-secondary-foreground">{c.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ContactSection;
