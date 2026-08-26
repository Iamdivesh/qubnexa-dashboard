"use client";

import { useEffect, useRef } from "react";
import { ButtonPrimary } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cta, process } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/motion-tokens";
import { threeStore } from "@/lib/three-store";

/**
 * Near-native chapter. The timeline path scrub-draws across a short
 * top-anchored trigger; steps highlight sequentially as the path passes them.
 * Horizontal on md+, vertical below. Under reduced motion the path renders
 * fully drawn and every step is active.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const fill = fillRef.current;
    const list = stepsRef.current;
    if (!section || !fill || !list) return;

    if (threeStore.reduced) {
      fill.classList.add("process-fill-done");
      Array.from(list.children).forEach((child) =>
        child.classList.add("process-step-active")
      );
      return;
    }

    const steps = Array.from(list.querySelectorAll("[data-step]"));
    const mm = gsap.matchMedia();
    mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" }, () => {
      const tl = gsap.timeline();
      tl.fromTo(
        fill,
        { scaleX: 0, scaleY: 0 },
        { scaleX: 1, scaleY: 1, duration: 1, ease: "none" }
      );
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "top 15%",
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => {
          steps.forEach((step, i) => {
            step.classList.toggle(
              "process-step-active",
              self.progress >= (i + 0.35) / steps.length
            );
          });
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-title"
      className="relative py-32 md:py-40"
    >
      <p className="sr-only">{process.summary}</p>
      <div className="container-x">
        <SectionHeader
          index={process.index}
          eyebrow={process.eyebrow}
          title={process.title}
          titleId="process-title"
        />
        <p className="mt-6 max-w-[58ch] leading-[1.65] text-text-mid">{process.intro}</p>

        {/* timeline */}
        <ol className="relative mt-16">
          {/* path — vertical below md, horizontal from md */}
          <div
            aria-hidden
            className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px bg-border md:left-0 md:top-[-3px] md:h-px md:w-full"
          />
          <div
            ref={fillRef}
            aria-hidden
            className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-azure md:left-0 md:top-[-3px] md:h-px md:w-full md:origin-left"
          />
          <ul ref={stepsRef} className="grid gap-12 pl-10 md:grid-cols-4 md:gap-8 md:pl-0 md:pt-10" data-steps>
            {process.steps.map((step) => (
              <li key={step.id} data-step className="group relative">
                <span
                  aria-hidden
                  className={`absolute -left-10 top-1 block h-[7px] w-[7px] rounded-full border border-border-strong bg-bg transition-colors duration-300 md:-left-0 md:top-[-13.5px] ${
                    ""
                  } process-step-dot`}
                />
                <h3 className="label-mono text-text-low transition-colors duration-300 group-hover:text-text-hi process-step-label">
                  {step.label}
                </h3>
                <p className="mt-3 max-w-[30ch] text-sm leading-[1.65] text-text-mid">
                  {step.description}
                </p>
                <p className="metadata-mono mt-3 text-text-low">{step.shift}</p>
              </li>
            ))}
          </ul>
        </ol>

        {/* principles band */}
        <div className="mt-24 border-t border-border pt-12">
          <p className="label-mono text-text-mid">{process.principlesEyebrow}</p>
          <ul className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {process.principles.map((principle) => (
              <li key={principle.label}>
                <h3 className="text-[0.9375rem] font-medium text-text-hi">
                  {principle.label}
                </h3>
                <p className="mt-2 max-w-[34ch] text-sm leading-[1.65] text-text-mid">
                  {principle.line}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex justify-center">
          <ButtonPrimary href={cta.mailto} external className="h-12 px-8">
            {cta.primary}
          </ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
