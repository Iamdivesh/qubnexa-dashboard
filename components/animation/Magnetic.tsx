"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/motion-tokens";
import { threeStore } from "@/lib/three-store";
import { usePointerFine, usePrefersReducedMotion } from "@/lib/use-motion-preferences";

export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const pointerFine = usePointerFine();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !pointerFine) return;
    const target = el.firstElementChild;
    if (!(target instanceof HTMLElement)) return;

    gsap.set(target, { x: 0, y: 0 });
    const xTo = gsap.quickTo(target, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.3, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      xTo(Math.max(-8, Math.min(8, dx * 0.25)));
      yTo(Math.max(-8, Math.min(8, dy * 0.25)));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(target, { x: 0, y: 0 });
    };
  }, [reduced, pointerFine]);

  if (!pointerFine || reduced) return <>{children}</>;
  if (threeStore.reduced) return <>{children}</>;

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
