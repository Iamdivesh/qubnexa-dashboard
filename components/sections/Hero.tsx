"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Magnetic } from "@/components/animation/Magnetic";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Buttons";
import { cta, hero } from "@/content/site";
import { gsap, ScrollTrigger, bootDuration } from "@/lib/motion-tokens";
import { scrollToId } from "@/lib/scroll";
import { threeStore } from "@/lib/three-store";
import { usePrefersReducedMotion } from "@/lib/use-motion-preferences";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const dur = bootDuration(threeStore.tier);
      gsap.set("[data-boot='line']", { yPercent: 112 });
      gsap.set("[data-boot='fade']", { opacity: 0, y: 20 });
      gsap
        .timeline({ defaults: { ease: "out-expo" } })
        .to("[data-boot='line']", { yPercent: 0, duration: 0.7, stagger: 0.09 }, dur * 0.76)
        .to(
          "[data-boot='fade']",
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          dur * 0.9
        );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top-=15%",
      once: true,
      onEnter: () => {
        threeStore.ignition = 1;
      },
    });
    return () => trigger.kill();
  }, [reduced]);

  return (
    <section
      id="hero"
      ref={ref}
      aria-labelledby="hero-title"
      className="chapter !min-h-[100svh]"
    >
      <p className="sr-only">{hero.summary}</p>
      <div className="container-x grid w-full gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-boot="fade" className="label-mono text-text-mid">
            {hero.eyebrowParts.map((part, i) => (
              <span key={part}>
                {i > 0 && (
                  <span className="mx-3 text-azure" aria-hidden>
                    |
                  </span>
                )}
                {part}
              </span>
            ))}
          </p>
          <h1 id="hero-title" className="text-display-xl mt-6 text-text-hi">
            {hero.lines.map((line) => (
              <span
                key={line}
                className="block overflow-hidden pb-[0.09em] -mb-[0.09em]"
              >
                <span data-boot="line" className="block will-change-transform">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p
            data-boot="fade"
            className="mt-8 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-text-mid md:text-lg"
          >
            {hero.supporting}
          </p>
          <div
            data-boot="fade"
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <ButtonPrimary href={cta.mailto} external>
                {cta.primary}
              </ButtonPrimary>
            </Magnetic>
            <ButtonSecondary
              href="#build"
              onClick={(event) => {
                event.preventDefault();
                scrollToId("build");
              }}
            >
              {cta.secondary}
            </ButtonSecondary>
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:block" aria-hidden />
      </div>
    </section>
  );
}
