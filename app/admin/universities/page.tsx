import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-secondary">Manage universities</h1>
        <details className="my-5 rounded-2xl border border-border bg-card p-5">
          <summary className="cursor-pointer text-sm font-semibold">Import catalog</summary>
          <p className="mb-4 mt-3 text-sm text-muted-foreground">Upload a JSON file. A matching university slug updates the existing record.</p>
          <Editor />
        </details>
        <UniversityExplorer entries={listCatalog(true)} />
      </main>
    </div>
  );
}
