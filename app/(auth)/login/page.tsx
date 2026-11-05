import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCurrentUser } from "@/lib/auth/session";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your ATOZ GSM account.",
};

const LoginPage = () => {
  if (getCurrentUser()) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-md">
          <header className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-secondary">Welcome back</h1>
          </header>
          <AuthForm mode="login" action={login} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LoginPage;
