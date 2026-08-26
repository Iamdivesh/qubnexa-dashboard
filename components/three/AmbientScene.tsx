"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Points } from "three";
import { threeStore } from "@/lib/three-store";
import { PALETTE } from "@/lib/scene-data";

/**
 * Abstract ambient stage — no logo, no letterforms. A slow field of fine
 * luminous particles plus hairline connection filaments that gently pulse,
 * evoking "connected systems" without ever competing with copy.
 *
 * Per-chapter intensity (lerped in useFrame): brighter only in HERO and
 * CONNECTED SYSTEMS; near-invisible ambience in SERVICES / PROCESS.
 */

const CHAPTER_INTENSITY: Record<string, number> = {
  hero: 1,
  build: 0.62,
  automate: 0.55,
  intelligence: 0.55,
  grow: 0.35,
  connected: 0.92,
  services: 0.14,
  process: 0.12,
  cta: 0.42,
};

/** Deterministic PRNG so the field is stable across renders (pure). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed ^ (seed >>> 15)) * (seed + 0x6d2b79f5);
    seed = (seed ^ (seed >>> 13));
    let t = Math.imul(seed ^ (seed >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^= t >>> 15) >>> 0) / 4294967296;
  };
}

export function AmbientScene() {
  const group = useRef<Group>(null);
  const points = useRef<Points>(null);
  const filaments = useRef<THREE.LineSegments>(null);
  const particleMat = useRef<THREE.PointsMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const intensity = useRef(1);

  const low = threeStore.tier === "low";
  const PARTICLE_COUNT = low ? 110 : 380;
  const FILAMENT_COUNT = low ? 8 : 20;

  const particleData = useMemo(() => {
    const random = mulberry32(20260826);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const azure = new THREE.Color(PALETTE.azure);
    const sky = new THREE.Color(PALETTE.sky);
    const dust = new THREE.Color(PALETTE.dust);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (random() - 0.5) * 22;
      positions[i * 3 + 1] = (random() - 0.5) * 12;
      positions[i * 3 + 2] = -6 + random() * 7;
      const roll = random();
      const c = roll > 0.86 ? azure : roll > 0.66 ? sky : dust;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [PARTICLE_COUNT]);

  const filamentPositions = useMemo(() => {
    const random = mulberry32(20260827);
    // Loose node cloud; filaments connect nearby nodes into a sparse network.
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < FILAMENT_COUNT + 6; i++) {
      nodes.push(
        new THREE.Vector3(
          (random() - 0.5) * 18,
          (random() - 0.5) * 9,
          -5 + random() * 5
        )
      );
    }
    const segments: number[] = [];
    for (let i = 0; i < FILAMENT_COUNT; i++) {
      const a = nodes[i];
      // nearest neighbour keeps lines short and hairline-delicate
      let best = nodes[nodes.length - 1];
      let bestD = Infinity;
      for (let j = i + 1; j < nodes.length; j++) {
        const d = a.distanceTo(nodes[j]);
        if (d < bestD && d > 0.5) {
          bestD = d;
          best = nodes[j];
        }
      }
      segments.push(a.x, a.y, a.z, best.x, best.y, best.z);
    }
    return new Float32Array(segments);
  }, [FILAMENT_COUNT]);

  useFrame((state, delta) => {
    // Ignition pulse decays after the hero scroll moment.
    threeStore.ignition *= Math.exp(-1.4 * delta);
    const target = CHAPTER_INTENSITY[threeStore.chapter] ?? 0.5;
    const d = threeStore.reduced ? 1 : 1 - Math.exp(-2.2 * delta);
    intensity.current += (target - intensity.current) * d;
    const time = state.clock.elapsedTime;

    if (!threeStore.reduced) {
      // Very slow ambient drift — barely perceptible camera-like sway.
      if (group.current) {
        group.current.rotation.z =
          Math.sin(time * 0.02) * 0.04 +
          (threeStore.pointerFine ? threeStore.pointerX * 0.015 : 0);
        group.current.position.y = Math.sin(time * 0.05) * 0.18;
        group.current.position.x =
          threeStore.pointerFine ? threeStore.pointerX * 0.12 : 0;
      }
      if (points.current) {
        points.current.rotation.z = time * 0.004;
      }
    }

    if (particleMat.current) {
      const pulse = threeStore.reduced
        ? 0
        : Math.sin(time * 0.4) * 0.06;
      particleMat.current.opacity = Math.min(
        0.85,
        intensity.current * (0.5 + pulse + threeStore.ignition * 0.25)
      );
    }
    if (lineMat.current) {
      const breathe = threeStore.reduced ? 0 : Math.sin(time * 0.3) * 0.035;
      lineMat.current.opacity = Math.max(
        0.02,
        intensity.current * (0.14 + breathe)
      );
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={particleMat}
          size={low ? 0.028 : 0.034}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[filamentPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMat}
          color={PALETTE.azure}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
