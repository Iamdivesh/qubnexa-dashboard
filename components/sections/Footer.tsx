"use client";

import { motion } from "framer-motion";

/** Brand glyphs (lucide-react ≥1.x removed brand icons) — 16px, currentColor. */
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.41z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

/**
 * LUMINA footer (docs/vex-lumina-rebuild.md §2): floating raised-glass panel
 * on a sand wash; the panel's top edge carries The Thread resolved into a
 * closed ring with the azure dot from VEX chapter 01 sitting inside the loop.
 * Link architecture (Services / Company / Legal & Contact) unchanged.
 */

const columns = [
  {
    heading: "Services",
    links: [
      { label: "AI Automation", href: "#services" },
      { label: "Business Automation", href: "#automate" },
      { label: "Web Development", href: "#build" },
      { label: "App Development", href: "#build" },
      { label: "SaaS Development", href: "#build" },
      { label: "Growth Marketing", href: "#intelligence" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#hero" },
      { label: "Insights", href: "#process" },
      { label: "Contact", href: "#cta" },
    ],
  },
  {
    heading: "Legal & Contact",
    links: [
      { label: "hello@qubnexa.com", href: "mailto:hello@qubnexa.com" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedInIcon },
  { label: "X / Twitter", href: "https://x.com/", Icon: XIcon },
  { label: "Instagram", href: "https://www.instagram.com/", Icon: InstagramIcon },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: YoutubeIcon },
];

/**
 * THE THREAD · resolution beat — the line rises from the panel's top edge,
 * loops once through a closed ring, and returns; the azure dot that opened
 * VEX sits inside the loop. Story complete.
 */
function ThreadEdge() {
  return (
    <svg
      className="pointer-events-none absolute -top-[2px] left-6 right-6 h-[120px] w-auto"
      style={{ left: "1.5rem", right: "1.5rem", height: 120, width: "calc(100% - 3rem)" }}
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        className="thread-edge"
        d="M 0 118 H 380 C 470 118 500 20 600 20 C 700 20 730 118 820 118 H 1200"
        fill="none"
        stroke="#0B1E3D"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle className="thread-loop-dot" cx="600" cy="20" r="9" fill="#2F6FED" />
      <circle className="thread-edge-pulse" r="6" fill="#2F6FED" />
    </svg>
  );
}

export function Footer() {
  return (
    <div
      aria-hidden={false}
      style={{
        background:
          "linear-gradient(180deg, var(--bg) 0%, rgba(228,218,198,0.35) 100%)",
      }}
    >
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="container-x pt-24 md:pt-32"
        aria-label="LUMINA footer"
      >
        <div className="relative">
          {/* THE THREAD resolved along the top edge */}
          <ThreadEdge />

          <div className="liquid-glass liquid-glass-raised relative rounded-[28px] px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pl-14 md:pr-14 md:pt-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
              {/* Brand column */}
              <div className="md:col-span-5">
                <a
                  href="#hero"
                  className="text-xl font-semibold tracking-tight text-text-hi"
                >
                  QubNexa
                </a>
                <h2 className="text-heading mt-6 font-bold text-text-hi">
                  Build Better.
                  <br />
                  Automate Smarter.
                  <br />
                  <em className="font-bold not-italic text-accent">Grow Faster.</em>
                </h2>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-text-mid">
                  QubNexa connects digital systems, automation and AI to help
                  businesses operate better and grow faster.
                </p>
              </div>

              {/* Link columns */}
              <nav
                aria-label="Footer links"
                className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7"
              >
                {columns.map((column) => (
                  <div key={column.heading}>
                    <h3 className="metadata-mono mb-4 font-semibold text-sand-deep">
                      {column.heading}
                    </h3>
                    <ul className="list-none space-y-2 p-0">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="text-sm text-text-hi transition-colors duration-200 hover:text-accent"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* CTA card */}
              <div className="flex flex-col items-start justify-between gap-5 rounded-[18px] border border-[rgba(47,111,237,0.2)] bg-accent-tint px-6 py-5 sm:flex-row sm:items-center md:col-span-12 md:mt-2">
                <p className="text-[0.95rem] font-semibold text-text-hi">
                  Have a system to build or a workflow to automate?
                </p>
                <a
                  href="mailto:hello@qubnexa.com?subject=Intro%20call%20%E2%80%94%20QubNexa"
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-strong"
                >
                  Book an intro call
                </a>
              </div>
            </div>

            {/* Legal row */}
            <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-[rgba(11,30,61,0.12)] pt-6 sm:flex-row sm:items-center">
              <p className="metadata-mono text-text-low">
                © QUBNEXA. ALL RIGHTS RESERVED.
              </p>
              <span className="metadata-mono hidden text-text-low md:inline">
                01 → 09 · THE THREAD, CLOSED
              </span>
              <div className="flex items-center gap-4">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="text-text-low transition-colors duration-200 hover:text-accent"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
