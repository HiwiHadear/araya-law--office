import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className={cn("eyebrow", tone === "dark" ? "text-gold" : "text-royal")}>{eyebrow}</p>}
      <h2
        className={cn(
          "mt-4 text-3xl leading-tight sm:text-4xl",
          tone === "dark" ? "text-navy-foreground" : "text-navy",
        )}
      >
        {title}
      </h2>
      <span className={cn("gold-rule mt-6", align === "center" && "mx-auto")} />
      {lead && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed",
            tone === "dark" ? "text-navy-foreground/70" : "text-muted-foreground",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}