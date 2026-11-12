import Link from "next/link";
import { contactInfo } from "@/lib/site-config";

const LINKS = [
  { href: "/csca", label: "CSCA Prep" },
  { href: "/chinese", label: "Chinese" },
  { href: "/ai-advisor", label: "AI Advisor" },
  { href: "/blog", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy Notice" },
  { href: "/terms", label: "Terms" },
];

export const SiteFooter = () => (
  <footer className="bg-secondary px-4 pb-12 pt-10">
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 border-t border-secondary-foreground/15 pt-10 text-center">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-xs uppercase tracking-wider text-secondary-foreground/70 transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <p className="text-xs tracking-wider text-secondary-foreground/70">
        {contactInfo.email} · {contactInfo.workingHours}
      </p>

      <p className="text-xs tracking-wider text-secondary-foreground/70">
        © {new Date().getFullYear()} ATOZ GSM · All rights reserved
      </p>

      <p className="max-w-2xl text-[10px] leading-relaxed text-secondary-foreground/60">
        ATOZ GSM is a private admissions support service. We are not a government body, embassy,
        visa centre, or an official portal of any university. Requirements for admission,
        scholarships and visas are set by those institutions and can change — always confirm
        against the current official source for your application.
      </p>
    </div>
  </footer>
);
