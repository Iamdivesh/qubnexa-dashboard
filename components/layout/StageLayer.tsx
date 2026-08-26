"use client";

import { useEffect } from "react";
import { bootDuration } from "@/lib/motion-tokens";
import { bootState, threeStore } from "@/lib/three-store";

/**
 * The WebGL ambient stage is RETIRED — The Thread motif replaces it.
 * This layer keeps the threeStore tier bookkeeping alive for consumers
 * (chapter pins, magnetic hovers) and renders nothing visible.
 */
export function StageLayer() {
  useEffect(() => {
    threeStore.tier = window.innerWidth < 1024 ? "low" : "high";
    bootState.duration = bootDuration(threeStore.tier);
  }, []);

  return null;
}
