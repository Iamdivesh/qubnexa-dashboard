import { footer, nav } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <a
          href="#hero"
          className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-text-hi"
        >
          {nav.brand}
        </a>
        <nav aria-label="Footer" className="flex items-center gap-6">
          {footer.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="metadata-mono text-text-low transition-colors duration-200 hover:text-text-hi"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="metadata-mono text-text-low">{footer.legal}</p>
      </div>
    </footer>
  );
}
