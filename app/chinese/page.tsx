import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToneChart } from "@/components/chinese/ToneChart";
import { VocabularyBrowser } from "@/components/chinese/VocabularyBrowser";
import { getSubject } from "@/lib/csca/syllabus";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Learn Chinese for Study in China",
  description:
    "Mandarin tones, pinyin and academic vocabulary for the CSCA Chinese papers (理科中文 and 文科中文) and for studying at a Chinese university.",
  alternates: { canonical: "/chinese" },
};

const ChinesePage = () => {
  const science = getSubject("chinese-science")!;
  const arts = getSubject("chinese-arts")!;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl space-y-14">
          <header className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-text">Chinese language</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-secondary dark:text-foreground lg:text-5xl">
              Learn Chinese <span lang="zh" className="text-primary">中文</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              If you apply to a Chinese-taught programme you will sit a CSCA Chinese paper. Both
              papers test academic Chinese — whether you can follow a first-year lecture — not
              conversation, so the vocabulary here leans towards subject terminology.
            </p>
          </header>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[science, arts].map((subject) => (
              <article key={subject.id} className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold text-secondary dark:text-foreground">
                  {subject.name} <span lang="zh" className="text-muted-foreground">{subject.nameZh}</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subject.requiredFor}</p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{subject.format.durationMinutes} minutes</span>
                  <span>{subject.format.totalMarks} marks</span>
                  <span>{subject.format.questionType}</span>
                </p>
                <Link
                  href={`/csca/practice?subject=${subject.id}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
                >
                  Practise this paper <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </section>

          <ToneChart />

          <VocabularyBrowser />

          <section className="rounded-3xl bg-secondary p-8 text-center lg:p-10">
            <h2 className="font-display text-2xl font-bold text-secondary-foreground">
              Not sure which paper you need?
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-secondary-foreground/80">
              It depends on whether your programme is taught in Chinese or English, and which track
              it sits in. Tell the advisor what you want to study and it will tell you what applies.
            </p>
            <Link
              href="/ai-advisor"
              className="mt-6 inline-block rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
            >
              Ask the advisor
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ChinesePage;
