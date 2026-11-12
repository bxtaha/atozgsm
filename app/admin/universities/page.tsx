import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageCatalog, listCatalog } from "@/lib/universities/catalog";
import { Editor } from "./Editor";
import { UniversityExplorer } from "./UniversityExplorer";

export const metadata = { title: "Manage university catalog", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function UniversityAdmin() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  if (!canManageCatalog(user.id)) notFound();

  return (
    <DashboardShell user={user}>
      <header className="mb-6 print:hidden">
        <h1 className="font-display text-3xl font-bold text-secondary sm:text-4xl">Universities</h1>
        <p className="mt-2 text-sm text-muted-foreground">Find programmes and scholarships, then build a shortlist for a student.</p>
      </header>
      <UniversityExplorer records={listCatalog()} allowEditing />
      <details className="my-6 rounded-2xl border border-border bg-card p-5 print:hidden">
        <summary className="cursor-pointer text-sm font-semibold">Import catalog</summary>
        <p className="mb-4 mt-3 text-sm text-muted-foreground">Upload a JSON file. A matching university slug updates the existing record.</p>
        <Editor />
      </details>
    </DashboardShell>
  );
}
