import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How we collect, use, and protect your personal information.",
};

const Privacy = () => (
  <div className="min-h-dvh p-4 lg:p-8">
    <div className="max-w-3xl mx-auto bg-console-surface rounded-[2rem] p-8 lg:p-12 ring-1 ring-border">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Privacy Notice</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground">
        <p><strong className="text-foreground">Purpose:</strong> We collect your personal information solely to assess your eligibility, match you with suitable programs, and facilitate your admission and visa application process.</p>
        <p><strong className="text-foreground">Data collected:</strong> Full name, phone number, email, date of birth, education history, and preferences as provided in the application form.</p>
        <p><strong className="text-foreground">How we use it:</strong> Your data is used to contact you, prepare your application, and share relevant details with partner universities and visa processing entities as required for your admission.</p>
        <p><strong className="text-foreground">Who we share with:</strong> Chinese universities you apply to, visa processing partners, and scholarship bodies — only as needed for your application.</p>
        <p><strong className="text-foreground">Retention:</strong> We retain your data for the duration of the admissions process and up to 2 years afterward, unless you request earlier deletion.</p>
        <p><strong className="text-foreground">Your rights:</strong> You may request access to, correction of, or deletion of your personal data by contacting us at admissions@example.com.</p>
        <p><strong className="text-foreground">Cross-border transfers:</strong> Your data may be shared with institutions in China as part of the application process. By consenting, you acknowledge this transfer.</p>
        <p className="text-xs text-muted-foreground/60">Last updated: April 2026</p>
      </div>
    </div>
  </div>
);

export default Privacy;
