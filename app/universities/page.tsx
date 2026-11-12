import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { UniversityExplorer } from "@/app/admin/universities/UniversityExplorer";
import { catalogImport } from "@/lib/universities/catalog-schema";
import catalog from "./AtoZGSM_University_Catalog.json";

export const metadata = {
  title: "University and scholarship search",
  robots: { index: false, follow: false },
};

const records = catalogImport.parse(catalog);

export default function PublicUniversitySearch() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border print:hidden">
        <div className="mx-auto flex max-w-5xl px-4 py-4">
          <Link href="/" aria-label="ATOZ GSM home">
            <Wordmark className="text-xl" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 print:p-0">
        <header className="mb-6 print:hidden">
          <h1 className="font-display text-3xl font-bold text-secondary sm:text-4xl">Universities and scholarships</h1>
          <p className="mt-2 text-sm text-muted-foreground">Search the catalog and save a PDF shortlist of matching universities.</p>
        </header>
        <UniversityExplorer records={records} />
      </main>
    </div>
  );
}
