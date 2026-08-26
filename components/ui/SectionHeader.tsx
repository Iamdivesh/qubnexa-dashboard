import { cn } from "@/lib/cn";

export function SectionHeader({
  index,
  eyebrow,
  title,
  titleId,
  className,
}: {
  index: string;
  eyebrow: string;
  title: string;
  titleId?: string;
  className?: string;
}) {
  return (
    <header className={cn("border-t border-border pt-6", className)}>
      <p className="label-mono text-text-mid">
        <span className="text-azure">{index}</span>
        <span className="mx-3 text-text-low" aria-hidden>
          /
        </span>
        {eyebrow}
      </p>
      <h2 id={titleId} className="text-display-lg mt-5 text-text-hi">
        {title}
      </h2>
    </header>
  );
}
