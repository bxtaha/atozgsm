"use client";

import { useRouter } from "next/navigation";
import HeroBanner from "@/components/landing/HeroBanner";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ProgramsSection from "@/components/landing/ProgramsSection";
import ProcessSection from "@/components/landing/ProcessSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ApplicationForm from "@/components/landing/ApplicationForm";
import CTASection from "@/components/landing/CTASection";
import FAQSection from "@/components/landing/FAQSection";
import ContactSection from "@/components/landing/ContactSection";
import FooterSection from "@/components/landing/FooterSection";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold tracking-tight text-lg">🎓 ChinaAdmit</span>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-muted-foreground">
            <a href="#benefits" className="hover:text-primary transition-colors">Benefits</a>
            <a href="#programs" className="hover:text-primary transition-colors">Programs</a>
            <a href="#process" className="hover:text-primary transition-colors">Process</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Stories</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <a href="#apply" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all">
            Apply Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <HeroBanner />

      {/* Stats */}
      <StatsBar />

      {/* Content sections */}
      <BenefitsSection />
      <ProgramsSection />
      <ProcessSection />
      <TestimonialsSection />

      {/* Application form — console grid style */}
      <section className="flex items-center justify-center p-4 lg:p-8 relative z-10 py-12 lg:py-20 border-t border-border" id="apply">
        <div className="w-full max-w-6xl bg-console-surface rounded-[2.5rem] p-3 lg:p-4 ring-1 ring-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid lg:grid-cols-12 gap-4 animate-fade-in">
          <HeroSection />
          <div className="lg:col-span-7 bg-background/50 rounded-[2rem] p-5 lg:p-10 flex flex-col justify-center border border-border relative">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Start Your Application</h2>
              <p className="text-sm text-muted-foreground">Complete the form to get free counseling. A counselor will reach out within 24 hours.</p>
            </div>
            <ApplicationForm onSuccess={() => router.push("/thank-you")} />
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
