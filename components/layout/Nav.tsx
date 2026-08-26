"use client";

import { useLayoutEffect, useRef } from "react";
import { ButtonPrimary } from "@/components/ui/Buttons";
import { cta, nav } from "@/content/site";
import { gsap } from "@/lib/motion-tokens";
import { bootDuration } from "@/lib/motion-tokens";
import { threeStore } from "@/lib/three-store";

export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || threeStore.reduced) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: -12 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "out-expo",
        delay: bootDuration(threeStore.tier) * 0.72,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-20 px-4 pt-4 md:px-8"
    >
      <div className="liquid-glass container-x mx-auto flex h-14 max-w-[1360px] items-center justify-between !rounded-2xl px-5">
        <a
          href="#hero"
          className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-text-hi"
        >
          {nav.brand}
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.9375rem] font-medium tracking-[-0.01em] text-text-mid transition-colors duration-200 hover:text-text-hi"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <ButtonPrimary href={cta.mailto} external className="h-10 rounded-full px-5">
          <span className="md:hidden">{cta.primaryShort}</span>
          <span className="hidden md:inline">{cta.primary}</span>
        </ButtonPrimary>
      </div>
    </header>
  );
}
