/**
 * Single entry point for Meta Pixel events. Nothing else in the app should call
 * `fbq` directly — routing every event through here keeps the event names in one
 * place and makes the whole layer a no-op when no Pixel ID is configured.
 */

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** Meta's standard events. Prefer these over custom names where one fits. */
export type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "CompleteRegistration"
  | "Schedule"
  | "InitiateCheckout"
  | "Purchase";

const STANDARD_EVENTS: ReadonlySet<string> = new Set<StandardEvent>([
  "PageView",
  "ViewContent",
  "Lead",
  "Contact",
  "CompleteRegistration",
  "Schedule",
  "InitiateCheckout",
  "Purchase",
]);

export const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Fires an event. Standard Meta events are sent via `track`, anything else via
 * `trackCustom` — sending a non-standard name through `track` makes Meta treat
 * it as a typo'd standard event.
 *
 * Pass `eventId` whenever the same conversion is also reported server-side via
 * the Conversions API, using the identical id in both places. That is what lets
 * Meta collapse the two reports into one event instead of counting it twice.
 *
 * Never pass document contents, passport numbers, financial details or any
 * other sensitive application data in `params`.
 */
export function trackEvent(
  event: string,
  params?: Record<string, string | number>,
  eventId?: string,
) {
  if (typeof window === "undefined" || !window.fbq) return;
  const method = STANDARD_EVENTS.has(event) ? "track" : "trackCustom";
  window.fbq(method, event, params, eventId ? { eventID: eventId } : undefined);
}
