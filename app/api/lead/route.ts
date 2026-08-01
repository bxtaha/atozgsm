import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to reach Google Sheets webhook:", err);
    return NextResponse.json({ ok: false, reason: "network_error" }, { status: 502 });
  }
}
