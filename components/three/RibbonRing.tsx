"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, MeshBasicMaterial } from "three";
import { bootProgress, seg, threeStore } from "@/lib/three-store";
import { PALETTE } from "@/lib/scene-data";

export function RibbonRing() {
  const arcA = useRef<Mesh>(null);
  const arcB = useRef<Mesh>(null);
  const matA = useRef<MeshBasicMaterial>(null);
  const matB = useRef<MeshBasicMaterial>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const boot = bootProgress(time);
    const { chapter, local } = threeStore;

    const reveal = seg(boot, 0.45, 0.75);
    const sweep = 1 - reveal;
    const pulse = Math.sin(seg(boot, 0.75, 0.9) * Math.PI) * 0.03;

    let sep = 0;
    let rot = 0;
    if (chapter === "build") {
      sep = seg(local, 0.05, 0.4);
      rot = sep * 0.3;
    }

    let backX = 0;
    let backY = 0;
    let backZ = 0;
    let dim = 1;
    let backScale = 1;
    if (chapter === "automate" || chapter === "intelligence") {
      const p = seg(local, 0, 0.3);
      backX = -0.9 * p;
      backY = 0.7 * p;
      backZ = -1.6 * p;
      dim = 1 - 0.62 * p;
      backScale = 1 - 0.12 * p;
    }

    const breathe = threeStore.reduced ? 0 : Math.sin(time * 0.55) * 0.015;
    const scale = (0.75 + 0.25 * reveal + pulse + breathe) * backScale;

    const a = arcA.current;
    const b = arcB.current;
    if (a && b) {
      a.position.set(-0.55 * sep + backX, 0.4 * sep + backY, backZ);
      b.position.set(0.55 * sep + backX, -0.4 * sep + backY, backZ - 0.02);
      a.rotation.z = -0.5 + rot + breathe - sweep * 0.9;
      b.rotation.z = 0.9 - rot - breathe + sweep * 0.7;
      a.scale.setScalar(scale);
      b.scale.setScalar(scale);
    }
    if (matA.current) matA.current.opacity = reveal * dim;
    if (matB.current) matB.current.opacity = reveal * dim;
  });

  return (
    <group>
      <mesh ref={arcA}>
        <torusGeometry args={[2.1, 0.13, 20, 96, Math.PI * 1.35]} />
        <meshBasicMaterial
          ref={matA}
          color={PALETTE.azure}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={arcB}>
        <torusGeometry args={[2.1, 0.13, 20, 96, Math.PI * 1.15]} />
        <meshBasicMaterial
          ref={matB}
          color={PALETTE.navy}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
