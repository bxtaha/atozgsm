import { createHash } from "node:crypto";

/**
 * Meta Conversions API — the server-side half of tracking.
 *
 * Browser events can be lost to ad blockers and tracking prevention, so the
 * same conversion is also reported from here. Both halves send the SAME
 * `event_id`, which is how Meta recognises them as one event instead of two —
 * without that, every conversion is double-counted and the ad optimisation is
 * trained on inflated numbers.
 *
 * The access token is read server-side only and must never be exposed to the
 * browser (no NEXT_PUBLIC_ prefix).
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const API_VERSION = "v21.0";

export interface CapiUserData {
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  /** Meta's browser cookies, when available — these improve match quality. */
  fbp?: string;
  fbc?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
}

/** Meta requires customer-matching fields to be normalised, then SHA-256 hashed. */
const hash = (value: string) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

const hashPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits ? createHash("sha256").update(digits).digest("hex") : undefined;
};

function buildUserData(user: CapiUserData) {
  const data: Record<string, string | string[]> = {};
  if (user.email) data.em = [hash(user.email)];
  const ph = user.phone ? hashPhone(user.phone) : undefined;
  if (ph) data.ph = [ph];
  if (user.city) data.ct = [hash(user.city)];
  if (user.country) data.country = [hash(user.country)];
  if (user.fbp) data.fbp = user.fbp;
  if (user.fbc) data.fbc = user.fbc;
  if (user.clientIpAddress) data.client_ip_address = user.clientIpAddress;
  if (user.clientUserAgent) data.client_user_agent = user.clientUserAgent;
  return data;
}

export const isCapiConfigured = () => Boolean(PIXEL_ID && ACCESS_TOKEN);

export async function sendCapiEvent(params: {
  eventName: string;
  /** Must match the event_id the browser pixel used for the same action. */
  eventId: string;
  eventSourceUrl?: string;
  user: CapiUserData;
  /** Non-sensitive context only — never document contents or financial detail. */
  customData?: Record<string, string | number>;
}): Promise<void> {
  if (!isCapiConfigured()) return;

  const payload = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        event_source_url: params.eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(params.user),
        custom_data: params.customData,
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN!)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      // Log and move on — a tracking failure must never break the lead itself.
      console.error("Meta CAPI rejected event:", res.status, await res.text());
    }
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
  }
}
