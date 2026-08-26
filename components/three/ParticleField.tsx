"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points, PointsMaterial } from "three";
import { threeStore } from "@/lib/three-store";
import { PALETTE } from "@/lib/scene-data";

/** Deterministic PRNG so the field is stable across renders (pure). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleField() {
  const points = useRef<Points>(null);
  const material = useRef<PointsMaterial>(null);
  const count = threeStore.tier === "low" ? 90 : 300;

  const positions = useMemo(() => {
    const random = mulberry32(20260824);
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = (random() - 0.5) * 20;
      array[i * 3 + 1] = (random() - 0.5) * 11;
      array[i * 3 + 2] = -5 + random() * 6;
    }
    return array;
  }, [count]);

  useFrame((state, delta) => {
    threeStore.ignition *= Math.exp(-1.4 * delta);
    const p = points.current;
    if (!p || threeStore.reduced) return;
    p.rotation.z =
      state.clock.elapsedTime * 0.008 + threeStore.ignition * 0.06;
    if (material.current) {
      material.current.opacity =
        0.45 + threeStore.ignition * 0.2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color={PALETTE.dust}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}
