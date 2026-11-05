import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { pricing } from "@/lib/site-config";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Pricing — Free and Premium",
  description:
    "Compare the free and Premium plans for studying in China with ATOZ GSM. Free covers costs, locations and document checklists; Premium adds university names, scholarship detail and one-to-one counselling.",
};

const FEATURES: { label: string; free: string | boolean; premium: string | boolean }[] = [
  { label: "Tuition and hostel costs", free: true, premium: true },
  { label: "University location and city", free: true, premium: true },
  { label: "Programmes and study levels offered", free: true, premium: true },
  { label: "Document checklist for your programme", free: true, premium: true },
  { label: "Study-in-China guides and resources", free: true, premium: true },
  { label: "AI course advisor", free: "Basic", premium: "Full" },
  { label: "University names", free: false, premium: true },
  { label: "Which scholarship each university offers", free: false, premium: true },
  { label: "Our written guidance per university", free: false, premium: true },
  { label: "Apply to your chosen subject and university", free: false, premium: true },
  { label: "One-to-one counsellor", free: false, premium: true },
  { label: "Document review before submission", free: false, premium: true },
  { label: "Scholarship strategy for your profile", free: false, premium: true },
  { label: "Support response time", free: "72 hours", premium: "24 hours" },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto h-5 w-5 text-muted-foreground/40" aria-label="Not included" />;
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

const PricingPage = () => (
  <div className="flex min-h-dvh flex-col">
    <SiteHeader />

    <main className="flex-1 px-4 py-12 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-secondary lg:text-5xl">
            Most of ATOZ GSM is free
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Research what studying in China actually costs without paying us anything. Premium is
            for when you want to know exactly which university to apply to, what scholarship it
            offers, and to have someone walk the application with you.
          </p>
        </header>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-bold text-secondary">Free</h2>
            <p className="mt-2 text-sm text-muted-foreground">No account charge, no time limit.</p>
            <p className="mt-6 font-display text-4xl font-bold text-secondary">৳0</p>
            <Link
              href="/universities"
              className="mt-8 block rounded-full border border-border px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-accent"
            >
              Browse the directory
            </Link>
          </div>

          <div className="relative rounded-3xl border-2 border-primary bg-card p-8">
            <span className="absolute -top-3 left-8 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Launch offer
            </span>
            <h2 className="font-display text-2xl font-bold text-secondary">Premium</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Names, scholarships, guidance and a counsellor.
            </p>
            <p className="mt-6 font-display text-4xl font-bold text-secondary">
              ৳{pricing.launchOfferBdt.toLocaleString("en-US")}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                / first {pricing.launchOfferMonths} months
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Then ৳{pricing.premiumAnnualBdt.toLocaleString("en-US")} per year ·{" "}
              {pricing.moneyBackDays}-day money-back guarantee
            </p>
            <Link
              href="/#apply"
              className="mt-8 block rounded-full bg-primary px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105"
            >
              Talk to us about Premium
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[560px] text-left">
            <caption className="sr-only">Feature comparison between the free and Premium plans</caption>
            <thead className="bg-accent text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">What you get</th>
                <th scope="col" className="px-6 py-4 text-center font-bold">Free</th>
                <th scope="col" className="px-6 py-4 text-center font-bold">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {FEATURES.map((f) => (
                <tr key={f.label}>
                  <th scope="row" className="px-6 py-4 text-left text-sm font-normal text-foreground">
                    {f.label}
                  </th>
                  <td className="px-6 py-4 text-center"><Cell value={f.free} /></td>
                  <td className="px-6 py-4 text-center"><Cell value={f.premium} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Premium buys you our research, guidance and time. It does not buy an admission,
          a scholarship or a visa — those decisions belong to the universities and the
          Chinese authorities, and nobody can guarantee them.
        </p>
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default PricingPage;
