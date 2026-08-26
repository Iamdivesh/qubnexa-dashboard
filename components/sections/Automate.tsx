"use client";

import { useCallback, useRef } from "react";
import { useChapterPin } from "@/components/animation/useChapterPin";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { automate } from "@/content/site";
import { AUTOMATE_STAGE_WINDOWS, gsap } from "@/lib/motion-tokens";

export function Automate() {
  const innerRef = useRef<HTMLElement>(null);

  const buildTimeline = useCallback(
    (tl: gsap.core.Timeline, scope: HTMLElement) => {
      const stages = scope.querySelectorAll("[data-stage]");
      AUTOMATE_STAGE_WINDOWS.forEach(([start], i) => {
        const el = stages[i];
        if (!el) return;
        // Enter fully from invisible — a 0.2 resting opacity stacks all four
        // absolutely-positioned stages on top of each other (text overlap).
        tl.fromTo(
          el,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.06, ease: "out-expo" },
          start
        );
        // Exit BEFORE the next stage enters so two stages are never visible
        // at once. The final stage holds until the pin releases.
        const nextStart = AUTOMATE_STAGE_WINDOWS[i + 1]?.[0];
        if (nextStart !== undefined) {
          tl.to(
            el,
            { opacity: 0, y: -14, duration: 0.045, ease: "inout" },
            nextStart - 0.055
          );
        }
      });
      const fill = scope.querySelector("[data-readout-fill]");
      if (fill) {
        tl.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.82, ease: "none" },
          AUTOMATE_STAGE_WINDOWS[0][0]
        );
      }
    },
    []
  );

  const ref = useChapterPin("automate", innerRef, 250, buildTimeline);

  return (
    <section
      id="automate"
      ref={ref}
      aria-labelledby="automate-title"
      className="chapter"
    >
      <p className="sr-only">{automate.summary}</p>
      <div className="container-x flex w-full flex-1 flex-col">
        <SectionHeader
          index={automate.index}
          eyebrow={automate.eyebrow}
          title={automate.title}
          titleId="automate-title"
        />
        <p className="mt-6 max-w-[58ch] leading-[1.65] text-text-mid">
          {automate.intro}
        </p>
        <ul
          className="mt-6 flex flex-wrap gap-2"
          aria-label="Business systems we connect"
        >
          {automate.systems.map((system) => (
            <li
              key={system}
              className="metadata-mono rounded-full border border-border px-3 py-1.5 text-text-mid"
            >
              {system}
            </li>
          ))}
        </ul>
        <div className="swap mt-8 flex-1">
          {automate.stages.map((stage, i) => (
            <article key={stage.id} data-stage className="swap-item">
              <p className="label-mono text-azure">
                {String(i + 1).padStart(2, "0")}
                <span className="mx-3 text-text-low" aria-hidden>
                  /
                </span>
                {stage.label}
              </p>
              <h3 className="text-heading mt-4 max-w-[24ch] text-text-hi">
                {stage.description}
              </h3>
            </article>
          ))}
        </div>
        <div
          className="mt-10 hidden items-center gap-4 md:flex"
          role="img"
          aria-label="Pipeline progress: input, processing, action, outcome"
        >
          {automate.stages.map((stage) => (
            <span key={stage.id} className="metadata-mono text-text-low">
              {stage.label}
            </span>
          ))}
          <span className="relative h-px flex-1 bg-border">
            <span
              data-readout-fill
              className="absolute inset-0 origin-left bg-azure"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
