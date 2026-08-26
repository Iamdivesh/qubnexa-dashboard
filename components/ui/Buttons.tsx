import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function ButtonPrimary({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-[2px] bg-cta px-6 label-mono text-cta-contrast transition-[background-color,transform] duration-200 ease-out hover:bg-cta-hover active:scale-[0.98]",
        className
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function ButtonSecondary({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-[2px] border border-border-strong px-6 label-mono text-text-hi transition-colors duration-200 ease-out hover:border-azure",
        className
      )}
    >
      {children}
    </a>
  );
}

export function LinkArrow({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 label-mono text-text-mid transition-colors duration-200 hover:text-text-hi",
        className
      )}
    >
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <ArrowRight
        size={16}
        strokeWidth={1.5}
        aria-hidden
        className="text-azure transition-transform duration-200 ease-out group-hover:translate-x-1"
      />
    </a>
  );
}
