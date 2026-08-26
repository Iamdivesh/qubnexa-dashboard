"use client";

import { useCallback, useRef, useState } from "react";
import { useChapterPin } from "@/components/animation/useChapterPin";
import { LinkArrow } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { grow } from "@/content/site";
import { gsap } from "@/lib/motion-tokens";
import { threeStore } from "@/lib/three-store";

/**
 * Channel tags arranged on a ring around the operating core (DOM echo of the
 * Q-Orbit ring). Hovering/focusing a tag syncs with its node via the shared
 * three-store highlight and dims the sibling tags.
 */
function ChannelRing() {
  const [active, setActive] = useState<string | null>(null);
  const radius = 42; // percentage of container

  const setHighlight = (id: string | null) => {
    setActive(id);
    threeStore.highlight = id;
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      {/* core */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong"
      >
        <div className="h-2 w-2 rounded-full bg-azure" />
      </div>
      {/* ring path */}
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full border border-border"
      />
      <ul className="absolute inset-0" aria-label="Connected channels">
        {grow.channels.map((channel, i) => {
          const angle = (i / grow.channels.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          return (
            <li key={channel} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
              <button
                type="button"
                data-channel={channel}
                onMouseEnter={() => setHighlight(channel.toLowerCase())}
                onMouseLeave={() => setHighlight(null)}
                onFocus={() => setHighlight(channel.toLowerCase())}
                onBlur={() => setHighlight(null)}
                className={`metadata-mono -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[2px] border px-4 py-2.5 transition-all duration-200 ${
                  active === channel
                    ? "border-azure text-text-hi"
                    : "border-border text-text-mid hover:text-text-hi"
                } ${active && active !== channel ? "opacity-40" : ""}`}
              >
                {channel}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Grow() {
  const innerRef = useRef<HTMLDivElement>(null);

  const buildTimeline = useCallback((tl: gsap.core.Timeline, scope: HTMLElement) => {
    const rows = scope.querySelectorAll("[data-outcome]");
    rows.forEach((row, i) => {
      tl.fromTo(
        row,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.06, ease: "out-expo" },
        0.25 + i * 0.065
      );
    });
    tl.fromTo(
      scope.querySelector("[data-grow-link]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.06, ease: "out-expo" },
      0.85
    );
  }, []);

  const ref = useChapterPin("grow", innerRef, 180, buildTimeline);

  return (
    <section id="grow" ref={ref} aria-labelledby="grow-title" className="chapter">
      <p className="sr-only">{grow.summary}</p>
      <div ref={innerRef} className="container-x grid w-full flex-1 items-center gap-16 lg:grid-cols-[1fr_auto]">
        <div>
          <SectionHeader
            index={grow.index}
            eyebrow={grow.eyebrow}
            title={grow.title}
            titleId="grow-title"
          />
          <p className="mt-6 max-w-[52ch] leading-[1.65] text-text-mid">{grow.intro}</p>
          <ul className="mt-10 max-w-xl">
            {grow.outcomes.map((outcome, i) => (
              <li
                key={outcome.label}
                data-outcome
                className="flex items-baseline gap-4 border-t border-border py-3"
              >
                <span className="metadata-mono text-text-low">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-[0.9375rem] font-medium text-text-hi">
                    {outcome.label}
                  </span>
                  <span className="hidden text-sm leading-[1.5] text-text-mid md:block">
                    {outcome.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div data-grow-link className="mt-10">
            <LinkArrow href={grow.link.href}>{grow.link.label}</LinkArrow>
          </div>
        </div>
        <div className="hidden lg:block">
          <ChannelRing />
        </div>
      </div>
    </section>
  );
}
