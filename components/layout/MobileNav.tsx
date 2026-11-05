"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const MobileNav = ({ links }: { links: { href: string; label: string }[] }) => (
  <Sheet>
    <SheetTrigger asChild>
      <button
        type="button"
        aria-label="Open navigation menu"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
    </SheetTrigger>
    <SheetContent className="overflow-y-auto" aria-describedby={undefined}>
      <SheetTitle className="font-display">AtoZGSM menu</SheetTitle>
      <ul className="mt-5 divide-y divide-border">
        {links.map(({ href, label }) => (
          <li key={href}>
            <SheetClose asChild>
              <Link
                href={href}
                className="flex min-h-11 items-center rounded px-2 py-3 text-sm font-semibold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </Link>
            </SheetClose>
          </li>
        ))}
      </ul>
    </SheetContent>
  </Sheet>
);
