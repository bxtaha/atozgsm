import { NextResponse } from "next/server";
import { sendCapiEvent } from "@/lib/analytics/meta-capi";

interface LeadBody {
  step?: number;
  eventId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  programLevel?: string;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set — skipping Google Sheets sync");
    return NextResponse.json({ ok: false, reason: "not_configured" });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("Google Sheets webhook error:", res.status, await res.text());
      return NextResponse.json({ ok: false, reason: "webhook_error" }, { status: 502 });
    }
  } catch (err) {
    console.error("Failed to reach Google Sheets webhook:", err);
    return NextResponse.json({ ok: false, reason: "network_error" }, { status: 502 });
  }

  // Only report the conversion once the lead is actually stored, and only for
  // step 1 — step 2 is extra detail on the same lead, not a second conversion.
  // `eventId` is generated in the browser and reused here so Meta can dedupe
  // the browser pixel event against this server-side one.
  if (body.step !== 2 && body.eventId) {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const readCookie = (name: string) =>
      cookieHeader.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1];

    await sendCapiEvent({
      eventName: "Lead",
      eventId: body.eventId,
      eventSourceUrl: req.headers.get("referer") ?? undefined,
      user: {
        email: body.email,
        phone: body.phone,
        city: body.city,
        country: "Bangladesh",
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
        clientIpAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        clientUserAgent: req.headers.get("user-agent") ?? undefined,
      },
      customData: body.programLevel ? { study_level: body.programLevel } : undefined,
    });
  }

  return NextResponse.json({ ok: true });
}
