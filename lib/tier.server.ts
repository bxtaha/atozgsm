import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/session";
import { TIER_COOKIE, type Tier } from "./tier";

/**
 * Resolves the viewer's tier. Server-only — `next/headers` stays out of
 * `lib/tier.ts` so client components can import the cookie name from there.
 *
 * A logged-in account is authoritative. The preview cookie is only consulted
 * for signed-out visitors, so it can never downgrade or upgrade a real account.
 * Remove the fallback (and `components/preview/TierToggle.tsx`) once Premium is
 * actually sold — until then it is how both views get reviewed.
 */
export function getTier(): Tier {
  const user = getCurrentUser();
  if (user) return user.tier;

  return cookies().get(TIER_COOKIE)?.value === "premium" ? "premium" : "free";
}
