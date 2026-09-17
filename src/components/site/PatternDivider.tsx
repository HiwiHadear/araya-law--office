import { cn } from "@/lib/utils";

/**
 * Ethiopian tibeb-inspired section divider: a centered geometric
 * diamond band in gold, flanked by fine gold rules.
 */
export function PatternDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4 px-5 lg:px-8", className)}>
      <span className="h-px flex-1 bg-gold/30" />
      <span className="pattern-tibeb w-44 sm:w-64" />
      <span className="h-2.5 w-2.5 rotate-45 border border-gold bg-gold/20" />
      <span className="pattern-tibeb w-44 sm:w-64" />
      <span className="h-px flex-1 bg-gold/30" />
    </div>
  );
}
