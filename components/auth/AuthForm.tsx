"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { FormState } from "@/app/(auth)/actions";

const inputClass =
  "w-full rounded-2xl border border-transparent bg-accent px-5 py-4 text-sm outline-none transition-all focus:border-secondary";

const labelClass = "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground";

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105 disabled:opacity-60"
    >
      {pending ? "Please wait…" : label}
    </button>
  );
};

interface Props {
  mode: "signup" | "login";
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}

export const AuthForm = ({ mode, action }: Props) => {
  const [state, formAction] = useFormState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-5 rounded-3xl border border-border bg-card p-6 lg:p-8">
      {isSignup && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass}>First name</label>
            <input id="firstName" name="firstName" required autoComplete="given-name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last name</label>
            <input id="lastName" name="lastName" required autoComplete="family-name" className={inputClass} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
      </div>

      {isSignup && (
        <div>
          <label htmlFor="phone" className={labelClass}>Phone / WhatsApp (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+880 1XXXXXXXXX" className={inputClass} />
        </div>
      )}

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={isSignup ? "new-password" : "current-password"}
          className={inputClass}
        />
        {isSignup && <p className="mt-2 text-xs text-muted-foreground">At least 8 characters.</p>}
      </div>

      {state.error && (
        <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton label={isSignup ? "Create account" : "Log in"} />

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-bold text-primary-text hover:underline">
          {isSignup ? "Log in" : "Create one"}
        </Link>
      </p>
    </form>
  );
};
