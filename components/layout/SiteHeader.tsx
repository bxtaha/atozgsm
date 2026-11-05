import Link from "next/link";
import { LayoutDashboard, Video } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Wordmark } from "@/components/layout/Wordmark";

const NAV = [
  { href: "/csca", label: "CSCA Prep" },
  { href: "/chinese", label: "Chinese" },
  { href: "/universities", label: "Universities" },
  { href: "/ai-advisor", label: "AI Advisor" },
  { href: "/blog", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

export const SiteHeader = () => {
  const user = getCurrentUser();
  const accountLinks = user
    ? [{ href: "/dashboard", label: "Dashboard" }]
    : [{ href: "/login", label: "Log in" }, { href: "/signup", label: "Create account" }];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" aria-label="ATOZ GSM home">
          <Wordmark className="text-xl" />
        </Link>

        <div className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider text-muted-foreground md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-primary-text">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground transition-all hover:brightness-125 md:flex"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-text md:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground transition-all hover:brightness-125 md:block"
              >
                Create account
              </Link>
            </>
          )}

          <Link
            href="/#apply"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110"
          >
            <Video className="h-3.5 w-3.5" />
            Book
          </Link>
          <MobileNav links={[...NAV, ...accountLinks]} />
        </div>
      </div>
    </nav>
  );
};
