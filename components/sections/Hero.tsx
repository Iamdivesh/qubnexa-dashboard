"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { build, cta, hero } from "@/content/site";
import { scrollToId } from "@/lib/scroll";
import { threeStore } from "@/lib/three-store";
import { usePrefersReducedMotion } from "@/lib/use-motion-preferences";

/**
 * Mainframe-style interactive video hero on QubNexa's light tokens.
 * - Background video: mouse-scrubbed on desktop (≥1024px), autoplay below.
 * - Typewriter headline with blinking cursor.
 * - Multi-select service pills with a live inquiry banner.
 * - The Thread opening state kept as a subtle brand signature near the tag.
 */

const HERO_TEXT = "Build Better.\nAutomate Smarter.\nGrow Faster.";

/** Custom typewriter hook: reveals `text` char by char after `startDelay`. */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const reduced = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(() => (reduced ? text : ""));
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, reduced]);

  return { displayed, done };
}

const VIDEO_SRC = "/media/hero-mainframe.mp4";

/**
 * Desktop mouse scrubbing: horizontal mouse movement scrubs the video
 * timeline; screens < 1024px fall back to normal autoplay playback.
 */
function useMouseScrub(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    // Wait until metadata is available before scrubbing.
    let duration = video.duration;
    const onMeta = () => {
      duration = video.duration;
    };
    video.addEventListener("loadedmetadata", onMeta);

    let targetTime = video.currentTime || 0;
    let previousX: number | null = null;

    const onMouseMove = (event: MouseEvent) => {
      if (!Number.isFinite(duration) || duration <= 0) return;
      if (window.innerWidth < 1024) return;
      const x = event.clientX;
      const delta =
        previousX === null ? 0 : ((x - previousX) / window.innerWidth) * 0.8 * duration;
      previousX = x;
      targetTime = Math.min(duration, Math.max(0, targetTime + delta));
      video.currentTime = targetTime;
    };

    const onSeeked = () => {
      // Keeps tracking smooth as seeks settle.
      targetTime = video.currentTime;
    };

    window.addEventListener("mousemove", onMouseMove);
    video.addEventListener("seeked", onSeeked);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("mousemove", onMouseMove);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [videoRef, enabled]);
}

/** THE THREAD · opening state, compact signature beside the eyebrow tag. */
function ThreadMark() {
  return (
    <svg
      viewBox="0 0 220 24"
      className="h-6 w-[180px]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="12" r="5" fill="#2F6FED" />
      <path
        d="M 18 12 H 170"
        stroke="#0B1E3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M 174 12 h 36" stroke="#0B1E3D" strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
      <circle cx="94" cy="12" r="3.5" fill="#2F6FED">
        <animate
          attributeName="cx"
          values="18;170;18"
          dur="2400ms"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

type PillProps = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

function ServicePill({ label, active, onToggle }: PillProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
        active
          ? "border-accent bg-accent text-white shadow-md"
          : "border-ink bg-white text-ink hover:border-accent hover:text-accent"
      }`}
    >
      <AnimatePresence initial={false}>
        {active && (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex"
          >
            <Check size={16} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
      {label}
    </motion.button>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const { displayed, done } = useTypewriter(HERO_TEXT);
  const [selected, setSelected] = useState<string[]>([]);

  const options = build.tracks.map((track) => track.label);

  const toggle = useCallback((label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  }, []);

  // Scrub only on desktop pointer devices; mobile autoplays instead.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useMouseScrub(videoRef, isDesktop && !reduced);

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

  const bannerVisible = selected.length > 0;

  return (
    <section
      id="hero"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex flex-col overflow-x-hidden overflow-y-hidden bg-bg font-sans text-ink antialiased lg:block lg:min-h-screen"
    >
      {/* BACKGROUND VIDEO — dominant visual */}
      <div
        aria-hidden
        className="pointer-events-none relative z-0 order-last w-full aspect-square overflow-hidden md:aspect-video lg:absolute lg:inset-0 lg:order-none lg:aspect-auto lg:h-full"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-right lg:object-right-bottom"
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          autoPlay={!isDesktop || reduced ? true : false}
        />
      </div>

      <p className="sr-only">{hero.summary}</p>

      {/* CONTENT LAYER */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-12">
        {/* Eyebrow tag + Thread signature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="metadata-mono flex items-center gap-2 text-text-low">
              <span
                aria-hidden
                className="block h-[7px] w-[7px] shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_rgba(47,111,237,0.18)]"
              />
              SYSTEM ONLINE
            </div>
            <ThreadMark />
          </div>
        </motion.div>

        {/* TYPEWRITER HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            id="hero-title"
            aria-label={HERO_TEXT.replace(/\n/g, " ")}
            className="mb-8 whitespace-pre-wrap text-5xl font-normal leading-[1.08] tracking-tight text-text-hi md:text-6xl lg:text-[76px]"
          >
            {displayed}
            {!done && (
              <span
                aria-hidden
                className="ml-1 inline-block w-[2px] align-[-0.1em] h-[1.1em] bg-accent hero-cursor"
              />
            )}
          </h1>
        </motion.div>

        {/* SUPPORTING COPY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-text-mid md:text-xl">
            {hero.supporting}
          </p>
        </motion.div>

        {/* INTERACTIVE MULTI-SELECT SERVICE PILLS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-2 text-2xl font-medium tracking-tight">
            What sort of service?
          </p>
          <p className="mb-8 text-text-mid">Select all that apply</p>
          <div className="flex max-w-xl flex-wrap gap-3">
            {options.map((label) => (
              <ServicePill
                key={label}
                label={label}
                active={selected.includes(label)}
                onToggle={() => toggle(label)}
              />
            ))}
          </div>

          {/* STATUS BANNER */}
          <div className="mt-6 min-h-[64px]">
            <AnimatePresence mode="wait">
              {bannerVisible ? (
                <motion.div
                  key="banner"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white px-5 py-4">
                    <p className="text-sm text-text-mid">
                      Ready to inquire about:{" "}
                      <span className="font-medium text-ink">
                        {selected.join(", ")}
                      </span>
                    </p>
                    <a
                      href="#cta"
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToId("cta");
                      }}
                      className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-strong"
                    >
                      Let&apos;s Go
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs italic opacity-50"
                >
                  Select services to start an inquiry
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* CTAs */}
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
              className="rounded-full border border-[rgba(11,30,61,0.25)] bg-white/60 px-6 py-3 text-center text-sm font-semibold text-ink backdrop-blur-sm transition-colors duration-200 hover:border-[rgba(11,30,61,0.5)]"
            >
              {cta.secondary}
            </a>
          </div>
        </motion.div>
      </main>
    </section>
  );
}
