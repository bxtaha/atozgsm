import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern our admission counseling services.",
};

const Terms = () => (
  <div className="min-h-dvh p-4 lg:p-8">
    <div className="max-w-3xl mx-auto bg-console-surface rounded-[2rem] p-8 lg:p-12 ring-1 ring-border">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground">
        <p><strong className="text-foreground">Services:</strong> We provide admission counseling, application support, document review, and visa preparation assistance for students seeking to study in China.</p>
        <p><strong className="text-foreground">No guarantee:</strong> While we strive for the best outcomes, admission and visa decisions are made by universities and embassies respectively. We do not guarantee acceptance or visa approval.</p>
        <p><strong className="text-foreground">Fees:</strong> Our service fees are communicated transparently before engagement. University tuition and visa fees are separate and paid directly to the respective institutions.</p>
        <p><strong className="text-foreground">Accuracy:</strong> You are responsible for providing accurate and truthful information. Misrepresentation may result in application rejection.</p>
        <p><strong className="text-foreground">Limitation of liability:</strong> Our liability is limited to the service fees paid. We are not liable for university or embassy decisions.</p>
        <p className="text-xs text-muted-foreground/60">Last updated: April 2026</p>
      </div>
    </div>
  </div>
);

export default Terms;
