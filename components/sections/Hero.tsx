"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cta, hero } from "@/content/site";
import { scrollToId } from "@/lib/scroll";
import { threeStore } from "@/lib/three-store";
import { usePrefersReducedMotion } from "@/lib/use-motion-preferences";

/**
 * VEX-spec hero: raw full-screen video (no overlay), liquid-glass chrome,
 * character-by-character headline entrance with the exact reference timing,
 * bottom-anchored two-column grid, staged fades at 800/1200/1400ms.
 * Mouse-scrub video seeking (Mainframe touch) kept, desktop only.
 */

const CHAR_DELAY = 30; // ms between characters
const INITIAL_DELAY = 200; // ms before the headline starts

/** VEX FadeIn: opacity 0 → 1 after `delay` ms over `duration` ms. */
function FadeIn({
  delay,
  duration = 1000,
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
      className={`transition-opacity${className ? ` ${className}` : ""}`}
      style={{
        opacity: shown ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
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
      className="mb-4 text-4xl font-normal text-white md:text-5xl lg:text-6xl xl:text-7xl"
      style={{ letterSpacing: "-0.04em" }}
    >
      {lines.map((line, lineIndex) =>
        Array.from(line).map((ch, charIndex) => {
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
                transition: "opacity 500ms ease, transform 500ms ease",
                transitionDelay: `${globalIndex * CHAR_DELAY}ms`,
              }}
            >
              {ch}
            </span>
          );
        })
      )}
    </h1>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  // Mainframe-style pointer scrub: mouse X maps onto the first quarter of
  // the clip, eased each frame. Desktop only.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || window.innerWidth < 1024) return;

    let target = 0;
    let current = 0;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target =
        (event.clientX / window.innerWidth) *
        Math.min((video.duration || 10) * 0.25, 8);
    };
    const tick = () => {
      current += (target - current) * 0.05;
      if (!video.seeking && video.readyState >= 2) {
        const t = Math.min(current, Math.max(video.duration - 0.1, 0));
        if (Math.abs(t - video.currentTime) > 0.12) video.currentTime = t;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

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
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Raw full-screen video — no overlay, no dimming (VEX spec). */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video
          ref={videoRef}
          src="/media/hero-abstract-lines.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="sr-only">{hero.summary}</p>

      {/* Bottom-anchored content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 pb-12 md:px-10 lg:px-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-end">
          {/* Left column — main content */}
          <div>
            <AnimatedHeading lines={hero.lines} />

            <FadeIn delay={800} className="mb-5 max-w-[52ch] text-base text-gray-300 md:text-lg">
              <p>{hero.supporting}</p>
            </FadeIn>

            <FadeIn delay={1200}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={cta.mailto}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white px-8 py-3 text-center font-medium text-black transition-colors duration-200 hover:bg-gray-200"
                >
                  {cta.primary}
                </a>
                <a
                  href="#build"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId("build");
                  }}
                  className="liquid-glass rounded-lg border border-white/20 px-8 py-3 text-center font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  {cta.secondary}
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right column — glass tag card, bottom-right on large screens */}
          <div className="mt-10 flex items-start justify-start lg:mt-0 lg:items-end lg:justify-end">
            <FadeIn delay={1400}>
              <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                <span className="text-lg font-light text-white md:text-xl lg:text-2xl">
                  Technology. Automation. Growth.
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
