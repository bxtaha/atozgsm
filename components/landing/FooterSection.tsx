import Link from "next/link";

const FooterSection = () => (
  <footer className="py-10 px-4 border-t border-border">
    <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center">
      <div className="flex gap-6">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">Privacy Notice</Link>
        <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">Terms</Link>
      </div>
      <p className="text-xs text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} ChinaAdmit · All rights reserved
      </p>
      <p className="text-[10px] text-muted-foreground/50 max-w-2xl">
        Disclaimer: This agency facilitates admissions support and is not directly affiliated with any specific Chinese university. Statistics shown are based on reported data and internal records.
      </p>
    </div>
  </footer>
);

export default FooterSection;
