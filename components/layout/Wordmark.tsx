/** Matches the logo lockup: "AtoZ" in the brand near-black, "GSM" in orange. */
export const Wordmark = ({ className = "" }: { className?: string }) => (
  <span className={`font-display font-bold tracking-tight ${className}`}>
    <span className="text-secondary dark:text-foreground">AtoZ</span>
    <span className="text-primary">GSM</span>
  </span>
);
