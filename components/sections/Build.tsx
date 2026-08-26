"use client";

import { useCallback, useRef } from "react";
import { useChapterPin } from "@/components/animation/useChapterPin";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { build } from "@/content/site";
import { BUILD_TRACK_WINDOWS, gsap } from "@/lib/motion-tokens";
import { threeStore } from "@/lib/three-store";

export function Build() {
  const innerRef = useRef<HTMLElement>(null);

  const buildTimeline = useCallback(
    (tl: gsap.core.Timeline, scope: HTMLElement) => {
      const tracks = scope.querySelectorAll("[data-track]");
      BUILD_TRACK_WINDOWS.forEach(([start, end], i) => {
        const el = tracks[i];
        if (!el) return;
        const span = end - start;
        tl.fromTo(
          el,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: span * 0.45, ease: "out-expo" },
          start
        ).to(
          el,
          { opacity: 0, y: -28, duration: span * 0.3, ease: "inout" },
          end - span * 0.3
        );
      });
    },
    []
  );

  const ref = useChapterPin("build", innerRef, 220, buildTimeline);

  return (
    <section
      id="build"
      ref={ref}
      aria-labelledby="build-title"
      className="chapter"
    >
      <p className="sr-only">{build.summary}</p>
      <div className="container-x flex w-full flex-1 flex-col">
        <SectionHeader
          index={build.index}
          eyebrow={build.eyebrow}
          title={build.title}
          titleId="build-title"
        />
        <p className="mt-6 max-w-[58ch] leading-[1.65] text-text-mid">{build.intro}</p>
        <div className="swap mt-10">
          {build.tracks.map((track, i) => (
            <article
              key={track.id}
              data-track
              className="swap-item border-l-2 border-azure/60 pl-6"
              onMouseEnter={() => {
                threeStore.highlight = track.id;
              }}
              onMouseLeave={() => {
                threeStore.highlight = null;
              }}
              onFocus={() => {
                threeStore.highlight = track.id;
              }}
              onBlur={() => {
                threeStore.highlight = null;
              }}
              tabIndex={0}
            >
              <p className="label-mono text-azure">
                {String(i + 1).padStart(2, "0")}
                <span className="mx-3 text-text-low" aria-hidden>
                  /
                </span>
                {track.label}
              </p>
              <h3 className="text-heading mt-4 text-text-hi">{track.headline}</h3>
              <p className="mt-3 max-w-[48ch] leading-[1.65] text-text-mid">
                {track.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
