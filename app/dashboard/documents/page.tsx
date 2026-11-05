import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDocuments, getProfile } from "@/lib/profile";
import { CATEGORY_LABELS, requirementsFor, type RequirementCategory } from "@/lib/requirements";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DocumentRow } from "@/components/dashboard/DocumentRow";

export const metadata: Metadata = {
  title: "Your documents",
  robots: { index: false },
};

const ORDER: RequirementCategory[] = ["identity", "academic", "language", "supporting", "financial"];

const DocumentsPage = () => {
  const user = getCurrentUser();
  if (!user) redirect("/login");

  const profile = getProfile(user.id);
  if (!profile.onboardedAt) redirect("/onboarding");

  const requirements = requirementsFor({ level: profile.studyLevel, language: profile.studyLanguage });
  const documents = getDocuments(user.id);
  const byRequirement = new Map(documents.map((d) => [d.requirementId, d]));

  return (
    <DashboardShell user={user}>
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-secondary lg:text-4xl">
          Your documents
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          This list is built from your study level and teaching language. Every item says who asks for
          it — us, the university, or the visa stage — so you know what is genuinely required.
        </p>
      </header>

      <div className="space-y-10">
        {ORDER.map((category) => {
          const items = requirements.filter((r) => r.category === category);
          if (items.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {CATEGORY_LABELS[category]}
              </h2>
              <ul className="space-y-4">
                {items.map((requirement) => (
                  <div key={requirement.id} id={requirement.id} className="scroll-mt-24">
                    <DocumentRow requirement={requirement} document={byRequirement.get(requirement.id)} />
                  </div>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-10 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
        We check that each file opens, is the right type and is within the size limit. We do not
        automatically verify the contents — a person reviews that. Requirements also differ between
        universities and change over time, so confirm against your target university&apos;s current
        published list.
      </p>
    </DashboardShell>
  );
};

export default DocumentsPage;
