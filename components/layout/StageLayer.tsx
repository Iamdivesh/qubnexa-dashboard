"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL } from "@/lib/scroll";
import { bootDuration } from "@/lib/motion-tokens";
import { bootState, threeStore, type ChapterId } from "@/lib/three-store";

const StageCanvas = dynamic(() => import("@/components/three/StageCanvas"), {
  ssr: false,
});

/**
 * Per-chapter stage treatment. The ambient scene supports the copy — it is
 * brightest in the two hero moments (HERO boot, CONNECTED SYSTEMS convergence)
 * and recedes to near-invisible ambience in content-heavy chapters
 * (SERVICES / PROCESS). Interpolated with a slow CSS transition so chapter
 * changes read as a cinematic light shift, never a pop.
 */
const STAGE_TREATMENT: Record<ChapterId, { opacity: number; blur: number }> = {
  hero: { opacity: 1, blur: 0 },
  build: { opacity: 0.8, blur: 0.4 },
  automate: { opacity: 0.68, blur: 0.5 },
  intelligence: { opacity: 0.68, blur: 0.5 },
  grow: { opacity: 0.42, blur: 1 },
  connected: { opacity: 0.92, blur: 0 },
  services: { opacity: 0.16, blur: 1.4 },
  process: { opacity: 0.14, blur: 1.4 },
  cta: { opacity: 0.45, blur: 0.6 },
};

/** No-WebGL fallback: pure CSS ambient gradients, no mark, no letterforms. */
function AmbientFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="ambient-blob absolute -left-[15%] top-[10%] h-[60vmax] w-[60vmax] rounded-full bg-azure/[0.07] blur-[120px]" />
      <div className="ambient-blob absolute -right-[20%] bottom-[5%] h-[50vmax] w-[50vmax] rounded-full bg-sky/[0.05] blur-[110px]" />
    </div>
  );
}

export function StageLayer() {
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threeStore.tier = window.innerWidth < 1024 ? "low" : "high";
    bootState.duration = bootDuration(threeStore.tier);
    // Deferred one frame: avoids sync setState in effect and idle-defers
    // the WebGL mount.
    const frame = requestAnimationFrame(() => {
      setWebgl(hasWebGL());
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    let current = "";
    const tick = () => {
      const chapter = threeStore.chapter;
      if (chapter !== current && stageRef.current) {
        current = chapter;
        const t = STAGE_TREATMENT[chapter];
        const el = stageRef.current;
        el.style.opacity = String(t.opacity);
        el.style.filter = t.blur > 0 ? `blur(${t.blur}px)` : "none";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
      <div
        ref={stageRef}
        data-stage
        className="absolute inset-0 transition-[opacity,filter] duration-[1400ms] ease-out will-change-[opacity,filter]"
      >
        {ready && webgl ? <StageCanvas /> : null}
        {ready && !webgl ? <AmbientFallback /> : null}
      </div>
      {/* Depth vignette + edge dissolve so background elements never render at
          full contrast behind text. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 40%, rgba(10,15,30,0.55) 78%, rgba(10,15,30,0.85) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
