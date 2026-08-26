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
 * LUMINA liquid-glass footer: a rounded-3xl glass panel floating over the
 * persistent video stage, with a 12-col link grid and a hairline bottom bar.
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

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      className="container-x mt-32 md:mt-64"
    >
      <div className="liquid-glass rounded-3xl px-6 py-10 md:px-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand column — col-span-5 */}
          <div className="md:col-span-5">
            <a
              href="#hero"
              className="text-xl font-semibold tracking-tight text-white"
            >
              QubNexa
            </a>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-white/70">
              QubNexa connects digital systems, automation and AI to help
              businesses operate better and grow faster.
            </p>
          </div>

          {/* Link columns — col-span-7 */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                  {column.heading}
                </h3>
                <ul className="list-none space-y-2 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs text-white/60 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[0.625rem] uppercase tracking-widest text-white opacity-50">
            © QUBNEXA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-white/50 transition-colors duration-200 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
