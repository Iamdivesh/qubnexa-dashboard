"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL } from "@/lib/scroll";
import { bootDuration } from "@/lib/motion-tokens";
import { bootState, threeStore } from "@/lib/three-store";
import { MarkSchematic } from "./MarkSchematic";

const StageCanvas = dynamic(() => import("@/components/three/StageCanvas"), {
  ssr: false,
});

export function StageLayer() {
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(false);

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

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden">
      {ready && webgl ? <StageCanvas /> : null}
      {ready && !webgl ? <MarkSchematic /> : null}
    </div>
  );
}
