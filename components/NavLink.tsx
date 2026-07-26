"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">,
    Omit<LinkProps, "href"> {
  /** Kept as `to` for API compatibility with the previous react-router NavLink. */
  to: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, end, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = end ? pathname === to : pathname === to || pathname?.startsWith(`${to}/`);

    return (
      <Link
        ref={ref}
        href={to}
        aria-current={isActive ? "page" : undefined}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
