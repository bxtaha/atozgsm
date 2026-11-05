import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCurrentUser } from "@/lib/auth/session";
import { signup } from "../actions";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a free ATOZ GSM account to track your China university application, documents and readiness.",
};

const SignupPage = () => {
  if (getCurrentUser()) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-md">
          <header className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-secondary">Create your account</h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Free, and it stays free. Track your documents, see what&apos;s missing, and know how ready
              your application actually is.
            </p>
          </header>
          <AuthForm mode="signup" action={signup} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SignupPage;
