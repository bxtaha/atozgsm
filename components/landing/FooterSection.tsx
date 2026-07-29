import Link from "next/link";

const FooterSection = () => (
  <footer className="pt-10 pb-12 px-4 bg-secondary">
    <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center border-t border-secondary-foreground/15 pt-10">
      <div className="flex gap-6">
        <Link href="/privacy" className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors uppercase tracking-wider">Privacy Notice</Link>
        <Link href="/terms" className="text-xs text-secondary-foreground/70 hover:text-primary transition-colors uppercase tracking-wider">Terms</Link>
      </div>
      <p className="text-xs text-secondary-foreground/70 tracking-wider">
        © {new Date().getFullYear()} ChinaAdmit · All rights reserved
      </p>
      <p className="text-[10px] text-secondary-foreground/40 max-w-2xl">
        Disclaimer: This agency facilitates admissions support and is not directly affiliated with any specific Chinese university. Statistics shown are based on reported data and internal records.
      </p>
    </div>
  </footer>
);

export default FooterSection;
