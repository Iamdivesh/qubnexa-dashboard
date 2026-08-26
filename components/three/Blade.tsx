"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial } from "three";
import { bootProgress, seg, threeStore } from "@/lib/three-store";
import { PALETTE } from "@/lib/scene-data";

const DOCK: [number, number] = [1.62, -1.62];
const DIR: [number, number] = [Math.SQRT1_2, -Math.SQRT1_2];

export function Blade() {
  const mesh = useRef<Mesh>(null);
  const mat = useRef<MeshBasicMaterial>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const boot = bootProgress(time);
    const { chapter, local } = threeStore;

    const bootIn = seg(boot, 0.62, 0.78);
    let out = (1 - bootIn) * 0.8;
    let dim = 1;

    if (chapter === "build") {
      out += seg(local, 0.05, 0.4) * 1.05;
    }
    if (chapter === "automate" || chapter === "intelligence") {
      dim = 1 - 0.62 * seg(local, 0, 0.3);
    }

    const m = mesh.current;
    if (m) {
      m.position.set(
        DOCK[0] + DIR[0] * out,
        DOCK[1] + DIR[1] * out,
        0.01
      );
    }
    if (mat.current) mat.current.opacity = bootIn * dim;
  });

  return (
    <mesh ref={mesh} rotation={[0, 0, -Math.PI / 4]}>
      <boxGeometry args={[1.5, 0.3, 0.06]} />
      <meshBasicMaterial
        ref={mat}
        color={PALETTE.azure}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
