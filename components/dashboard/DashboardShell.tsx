import Link from "next/link";
import { FileText, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import type { SessionUser } from "@/lib/auth/session";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
];

export const DashboardShell = ({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) => (
  <div className="flex min-h-dvh flex-col">
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-secondary">
          🎓 ATOZ GSM
        </Link>

        <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-1.5 transition-colors hover:text-primary-text">
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
          <Link href="/universities" className="transition-colors hover:text-primary-text">
            Universities
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
            user.tier === "premium" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {user.tier}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </form>
        </div>
      </div>
    </nav>

    <main className="flex-1 px-4 py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  </div>
);
