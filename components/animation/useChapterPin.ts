"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion-tokens";
import { threeStore, type ChapterId } from "@/lib/three-store";

/**
 * Pins a chapter section and publishes {chapter, local} into the shared
 * three-store. `buildTimeline` populates the scrubbed timeline that drives
 * the section's DOM choreography (positions are chapter-local 0..1).
 * Under reduced motion no pin is created — content renders in normal flow.
 */
export function useChapterPin(
  id: ChapterId,
  ref: RefObject<HTMLElement | null>,
  lengthVh: number,
  buildTimeline?: (tl: gsap.core.Timeline, scope: HTMLElement) => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || threeStore.reduced) return;

    const mm = gsap.matchMedia();

    mm.add(
      { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        const length = Math.round(lengthVh * (isMobile ? 0.6 : 1));
        const tl = gsap.timeline();
        buildTimeline?.(tl, el);

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: `+=${length}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          animation: tl,
          onToggle: (self) => {
            if (self.isActive) {
              threeStore.chapter = id;
              el.dataset.pinned = "true";
            } else {
              delete el.dataset.pinned;
            }
          },
          onUpdate: (self) => {
            threeStore.chapter = id;
            threeStore.local = self.progress;
          },
        });

        return () => {
          trigger.kill();
          if (el.dataset.pinned) delete el.dataset.pinned;
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, [id, ref, lengthVh, buildTimeline]);

  return ref;
}
