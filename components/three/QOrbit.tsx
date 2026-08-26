"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, PerspectiveCamera } from "three";
import { threeStore } from "@/lib/three-store";
import { RibbonRing } from "./RibbonRing";
import { Blade } from "./Blade";
import { Pixels } from "./Pixels";
import { Paths } from "./Paths";
import { ParticleField } from "./ParticleField";

interface CameraKey {
  pos: [number, number, number];
  look: [number, number, number];
  offset: number;
}

const CAMERA_KEYS: Record<string, CameraKey> = {
  hero: { pos: [0, 0.35, 7.8], look: [0, 0.3, 0], offset: 1.15 },
  build: { pos: [0, 0.4, 11.2], look: [0, 0, 0], offset: 0 },
  automate: { pos: [0, 0.3, 10.8], look: [0, 0.1, 0], offset: 0 },
  intelligence: { pos: [0, 0.3, 10.4], look: [0, 0.1, 0], offset: 0 },
};

const lookTarget = new THREE.Vector3(0, 0.3, 0);

export function QOrbit() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const key = CAMERA_KEYS[threeStore.chapter] ?? CAMERA_KEYS.hero;
    const snap = threeStore.reduced;
    const d = snap ? 1 : 1 - Math.exp(-2.6 * delta);
    const time = state.clock.elapsedTime;

    const g = group.current;
    if (g) {
      const mobile = state.size.width < 1024;
      const targetOffset = mobile ? 0 : key.offset;
      const targetScale = mobile ? 0.6 : 1;
      g.position.x += (targetOffset - g.position.x) * d;
      const s = g.scale.x + (targetScale - g.scale.x) * d;
      g.scale.setScalar(s);
    }

    const camera = state.camera as PerspectiveCamera;
    const parallaxX = threeStore.pointerFine ? threeStore.pointerX * 0.22 : 0;
    const parallaxY = threeStore.pointerFine ? -threeStore.pointerY * 0.12 : 0;
    const idleX = threeStore.reduced ? 0 : Math.sin(time * 0.12) * 0.1;
    const idleY = threeStore.reduced ? 0 : Math.cos(time * 0.1) * 0.06;

    camera.position.x += (key.pos[0] + parallaxX + idleX - camera.position.x) * d;
    camera.position.y += (key.pos[1] + parallaxY + idleY - camera.position.y) * d;
    camera.position.z += (key.pos[2] - camera.position.z) * d;

    lookTarget.x += (key.look[0] - lookTarget.x) * d;
    lookTarget.y += (key.look[1] - lookTarget.y) * d;
    camera.lookAt(lookTarget);
  });

  return (
    <group ref={group}>
      <RibbonRing />
      <Blade />
      <Pixels />
      <Paths />
      <ParticleField />
    </group>
  );
}
