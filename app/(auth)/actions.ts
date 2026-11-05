"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, newId, setSessionCookie, SESSION_COOKIE } from "@/lib/auth/session";

export interface FormState {
  error?: string;
}

const SignupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = SignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;
  const existing = db().prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return { error: "An account with this email already exists. Try logging in instead." };
  }

  const userId = newId();
  db()
    .prepare(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, country, tier, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Bangladesh', 'free', ?)`,
    )
    .run(userId, email, await hashPassword(password), firstName, lastName, phone ?? null, new Date().toISOString());

  db().prepare("INSERT INTO profiles (user_id) VALUES (?)").run(userId);

  const { token, expiresAt } = createSession(userId);
  setSessionCookie(token, expiresAt);
  redirect("/onboarding");
}

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const user = db()
    .prepare("SELECT id, password_hash FROM users WHERE email = ?")
    .get(parsed.data.email) as { id: string; password_hash: string } | undefined;

  // Same message whether the email is unknown or the password is wrong, so this
  // can't be used to discover which emails have accounts.
  const invalid = { error: "Email or password is incorrect." };
  if (!user) return invalid;
  if (!(await verifyPassword(parsed.data.password, user.password_hash))) return invalid;

  const { token, expiresAt } = createSession(user.id);
  setSessionCookie(token, expiresAt);

  const profile = db().prepare("SELECT onboarded_at FROM profiles WHERE user_id = ?").get(user.id) as
    | { onboarded_at: string | null }
    | undefined;

  redirect(profile?.onboarded_at ? "/dashboard" : "/onboarding");
}

export async function logout() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) destroySession(token);
  cookies().delete(SESSION_COOKIE);
  redirect("/");
}
