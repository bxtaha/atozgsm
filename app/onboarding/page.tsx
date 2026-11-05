import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { completeOnboarding } from "./actions";

export const metadata: Metadata = {
  title: "Set up your application",
  robots: { index: false },
};

const OnboardingPage = () => {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-xl">
          <header className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-text">
              Welcome, {user.firstName}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-secondary">
              Let&apos;s build your document checklist
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Two questions decide which documents you actually need. This takes under a minute.
            </p>
          </header>

          <OnboardingWizard action={completeOnboarding} />
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
