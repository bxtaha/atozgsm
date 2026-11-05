import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { Tier } from "@/lib/tier";

export const SESSION_COOKIE = "atozgsm_session";
const SESSION_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tier: Tier;
}

/** Only the hash is stored, so a leaked database can't be used to log in. */
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function createSession(userId: string): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  db()
    .prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .run(hashToken(token), userId, new Date().toISOString(), expiresAt.toISOString());

  return { token, expiresAt };
}

export function setSessionCookie(token: string, expiresAt: Date) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function getCurrentUser(): SessionUser | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = db()
    .prepare(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.tier, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ?`,
    )
    .get(hashToken(token)) as
    | { id: string; email: string; first_name: string; last_name: string; tier: string; expires_at: string }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    destroySession(token);
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    tier: row.tier === "premium" ? "premium" : "free",
  };
}

export function destroySession(token: string) {
  db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
}

export const newId = () => randomUUID();
