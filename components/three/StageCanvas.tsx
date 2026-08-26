"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { QOrbit } from "./QOrbit";
import { threeStore } from "@/lib/three-store";
import { usePrefersReducedMotion } from "@/lib/use-motion-preferences";

function TierSetup() {
  const setDpr = useThree((s) => s.setDpr);
  useEffect(() => {
    setDpr(threeStore.tier === "low" ? 1.5 : Math.min(window.devicePixelRatio, 2));
  }, [setDpr]);
  return null;
}

function RenderGuard() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    if (threeStore.reduced) return;
    const onVisibility = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [setFrameloop]);
  return null;
}

function PointerTrack() {
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    threeStore.pointerFine = mq.matches;
    if (!mq.matches) return;
    const onMove = (event: PointerEvent) => {
      threeStore.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      threeStore.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}

function ReducedStatic() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!threeStore.reduced) return;
    invalidate();
    const timer = window.setTimeout(invalidate, 120);
    return () => window.clearTimeout(timer);
  }, [invalidate]);
  return null;
}

export default function StageCanvas() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0.35, 7.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      onCreated={(state) => {
        state.gl.setClearColor(0x000000, 0);
      }}
    >
      <TierSetup />
      <RenderGuard />
      <PointerTrack />
      <ReducedStatic />
      <QOrbit />
    </Canvas>
  );
}
