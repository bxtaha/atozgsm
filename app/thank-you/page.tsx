import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, MessageCircle, Phone, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Received",
  description: "Your application has been received. A counselor will contact you within 24 hours.",
};

const ThankYou = () => (
  <div className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

    <div className="w-full max-w-lg bg-console-surface rounded-[2.5rem] p-8 lg:p-12 ring-1 ring-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold mb-3">Application Received!</h1>
      <p className="text-muted-foreground mb-6">We received your request. A counselor will contact you within <strong className="text-foreground">24 hours</strong>.</p>

      <div className="space-y-3 mb-8">
        <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm hover:bg-primary/20 transition-colors">
          <MessageCircle className="w-4 h-4" /> WhatsApp Us Now
        </a>
        <a href="tel:+8801XXXXXXXXX"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold text-sm hover:bg-secondary/20 transition-colors">
          <Phone className="w-4 h-4" /> Call a Counselor
        </a>
      </div>

      <div className="bg-accent rounded-2xl p-5 text-left mb-6">
        <h3 className="text-sm font-bold mb-2">What happens next?</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>✓ Your application is reviewed by our admissions team</li>
          <li>✓ A counselor calls or messages you to discuss your options</li>
          <li>✓ You receive a personalized program and scholarship recommendation</li>
        </ul>
      </div>

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  </div>
);

export default ThankYou;
