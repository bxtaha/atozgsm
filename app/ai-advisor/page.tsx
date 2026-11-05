import type { Metadata } from "next";
import { AdvisorForm } from "@/components/advisor/AdvisorForm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "AI Study-in-China Advisor",
  description:
    "Describe your results, budget and the subject you want to study. Get an honest brief on where you stand for studying in China and what to do next.",
};

const AdvisorPage = () => (
  <div className="flex min-h-dvh flex-col">
    <SiteHeader />

    <main className="flex-1 px-4 py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-secondary lg:text-5xl">
            Ask the advisor
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Tell it your results, your budget and what you want to study. You&apos;ll get a short,
            honest read on where you stand and the steps to take next — no sales pitch, and no
            promises anyone can&apos;t keep.
          </p>
        </header>

        <AdvisorForm />
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default AdvisorPage;
