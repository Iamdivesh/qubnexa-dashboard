"use client";

import { useCallback, useRef } from "react";
import { useChapterPin } from "@/components/animation/useChapterPin";
import { connected } from "@/content/site";
import { gsap } from "@/lib/motion-tokens";

export function ConnectedSystems() {
  const innerRef = useRef<HTMLDivElement>(null);

  const buildTimeline = useCallback((tl: gsap.core.Timeline, scope: HTMLElement) => {
    scope.querySelectorAll("[data-thesis]").forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1, ease: "out-expo" },
        0.3 + i * 0.12
      );
    });
    tl.to({}, { duration: 0.35 }); // designed stillness after convergence
  }, []);

  const ref = useChapterPin("connected", innerRef, 120, buildTimeline);

  return (
    <section
      id="connected"
      ref={ref}
      aria-labelledby="connected-title"
      className="chapter"
    >
      <p className="sr-only">{connected.summary}</p>
      <div ref={innerRef} className="container-x flex w-full flex-1 flex-col items-center justify-center text-center">
        <h2 id="connected-title" className="text-display-lg max-w-[18ch] text-text-hi">
          <span data-thesis className="block">{connected.thesis[0]}</span>
          <span data-thesis className="mt-1 block text-azure">
            {connected.thesis[1]}
          </span>
        </h2>
      </div>
    </section>
  );
}
