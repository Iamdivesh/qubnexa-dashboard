"use client";

import { useCallback, useRef } from "react";
import { useChapterPin } from "@/components/animation/useChapterPin";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { intelligence } from "@/content/site";
import { gsap } from "@/lib/motion-tokens";

export function Intelligence() {
  const innerRef = useRef<HTMLElement>(null);

  const buildTimeline = useCallback((tl: gsap.core.Timeline, scope: HTMLElement) => {
    const principle = scope.querySelectorAll("[data-principle]");
    principle.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.08, ease: "out-expo" },
        0.05 + i * 0.07
      );
    });
    const rows = scope.querySelectorAll("[data-capability]");
    rows.forEach((row, i) => {
      tl.fromTo(
        row,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.07, ease: "out-expo" },
        0.32 + i * 0.065
      );
    });
  }, []);

  const ref = useChapterPin("intelligence", innerRef, 140, buildTimeline);

  return (
    <section
      id="intelligence"
      ref={ref}
      aria-labelledby="intelligence-title"
      className="chapter"
    >
      <p className="sr-only">{intelligence.summary}</p>
      <div className="container-x flex w-full flex-1 flex-col">
        <SectionHeader
          index={intelligence.index}
          eyebrow={intelligence.eyebrow}
          title={intelligence.title}
          titleId="intelligence-title"
        />
        <h3 className="text-display-lg mt-10 max-w-[22ch] text-text-hi">
          <span data-principle className="block">
            {intelligence.principle[0]}
          </span>
          <span data-principle className="mt-1 block text-sky">
            {intelligence.principle[1]}
          </span>
        </h3>
        <p
          data-principle
          className="mt-6 max-w-[58ch] leading-[1.65] text-text-mid"
        >
          {intelligence.intro}
        </p>
        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {intelligence.capabilities.map((capability, i) => (
            <li
              key={capability.name}
              data-capability
              className="flex items-baseline gap-4 border-t border-border py-3"
            >
              <span className="metadata-mono text-text-low">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="text-[0.9375rem] font-medium text-text-hi">
                  {capability.name}
                </span>
                <span className="hidden text-sm leading-[1.5] text-text-mid md:block">
                  {capability.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
