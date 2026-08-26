"use client";

import { useEffect, useRef, useState } from "react";
import { cta, hero } from "@/content/site";
import { scrollToId } from "@/lib/scroll";
import { threeStore } from "@/lib/three-store";
import { usePrefersReducedMotion } from "@/lib/use-motion-preferences";

/**
 * VEX hero on light tokens (docs/vex-lumina-rebuild.md §1).
 * The video stage is retired; The Thread opening state (dot + short stroke +
 * traveling pulse) is the single signature effect. Char-stagger headline at
 * 30ms/char within a 500ms window from translateX(-18px); staged fades
 * 800/1200/1400ms for headline → supporting → CTAs + nav.
 */

const CHAR_DELAY = 30; // ms between characters
const INITIAL_DELAY = 200; // ms before the headline starts

/** VEX FadeIn: opacity 0 → 1 after `delay` ms over `duration` ms. */
function FadeIn({
  delay,
  duration = 800,
  className,
  children,
}: {
  delay: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay, reduced]);

  return (
    <div
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition:
          "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)",
        transitionDuration: `${duration}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/** Character-by-character horizontal slide-in per the VEX spec. */
function AnimatedHeading({ lines }: { lines: readonly string[] }) {
  const [on, setOn] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setOn(true);
      return;
    }
    const t = setTimeout(() => setOn(true), INITIAL_DELAY);
    return () => clearTimeout(t);
  }, [reduced]);

  let charCursor = 0;
  return (
    <h1
      id="hero-title"
      aria-label={lines.join(" ")}
      className="mb-4 text-[clamp(2.75rem,7vw,5.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-text-hi"
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {Array.from(line).map((ch, charIndex) => {
            const globalIndex = charCursor++;
            if (ch === " ") return <span key={`${lineIndex}-${charIndex}`}>&nbsp;</span>;
            return (
              <span
                key={`${lineIndex}-${charIndex}`}
                aria-hidden="true"
                className="inline-block"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateX(0)" : "translateX(-18px)",
                  transition:
                    "opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: `${globalIndex * CHAR_DELAY}ms`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/**
 * THE THREAD · chapter 01 ignition state.
 * Azure dot emits a short ink stroke; one pulse travels it (2400ms loop).
 */
function ThreadStage() {
  return (
    <div className="thread-stage" aria-hidden>
      <div className="thread-halo">
        <svg viewBox="0 0 600 600">
          {/* THE THREAD · opening state: dot + short stroke */}
          <circle cx="60" cy="300" r="9" fill="#2F6FED" />
          <path
            className="thread-draw"
            d="M 60 300 H 500"
            fill="none"
            stroke="#0B1E3D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 500 300 h 40"
            stroke="#0B1E3D"
            strokeWidth="3"
            opacity=".18"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <svg viewBox="0 0 600 600" style={{ pointerEvents: "none" }}>
          <circle className="thread-pulse" r="6" fill="#2F6FED" />
        </svg>
      </div>
    </div>
  );
}

/** Eyebrow chips: AI | AUTOMATION | INNOVATION on sand tint. */
function EyebrowChips() {
  return (
    <FadeIn delay={100}>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {hero.eyebrowParts.map((part) => (
          <span
            key={part}
            className="metadata-mono rounded-full border border-[rgba(138,109,59,0.25)] bg-sand-tint px-3.5 py-1.5 text-sand-deep"
          >
            {part}
          </span>
        ))}
      </div>
    </FadeIn>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  // Ignition signal for downstream consumers (rail timing etc.).
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    raf = requestAnimationFrame(() => {
      threeStore.ignition = 1;
    });
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <section
      id="hero"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg"
    >
      {/* Faint dot-grid field (#0B1E3D @ 0.06, 24px pitch). */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 24px 24px, rgba(11,30,61,.06) 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* THE THREAD — signature effect */}
      <ThreadStage />

      <p className="sr-only">{hero.summary}</p>

      {/* Bottom-anchored two-column grid */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 pb-14 md:px-10 lg:px-16 lg:pb-[9vh]">
        <div className="lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-12">
          {/* Left column */}
          <div>
            <EyebrowChips />
            <AnimatedHeading lines={hero.lines} />

            <FadeIn delay={1200} duration={800}>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-text-mid md:text-[1.05rem]">
                {hero.supporting}
              </p>
            </FadeIn>

            <FadeIn delay={1400} duration={800}>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <a
                  href={cta.mailto}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-accent px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(47,111,237,0.5)] transition-colors duration-200 hover:bg-accent-strong"
                >
                  {cta.primary}
                </a>
                <a
                  href="#build"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId("build");
                  }}
                  className="rounded-full border border-[rgba(11,30,61,0.25)] px-6 py-3 text-center text-sm font-semibold text-ink transition-colors duration-200 hover:border-[rgba(11,30,61,0.5)]"
                >
                  {cta.secondary}
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right column — glass tag card, bottom-right on large screens */}
          <div className="mt-10 flex items-start justify-start lg:mt-0 lg:items-end lg:justify-end">
            <FadeIn delay={1550} duration={800}>
              <aside
                aria-label="System status"
                className="liquid-glass w-[240px] rounded-[18px] px-4 py-4"
              >
                <div className="metadata-mono flex items-center gap-2 text-text-low">
                  <span
                    aria-hidden
                    className="block h-[7px] w-[7px] shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_rgba(47,111,237,0.18)]"
                  />
                  SYSTEM ONLINE
                </div>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-text-mid">
                  The Thread is live — one line connecting build, automation and AI.
                </p>
              </aside>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
