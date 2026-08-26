"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { InstancedMesh } from "three";
import { bootProgress, seg, threeStore } from "@/lib/three-store";
import {
  BUILD_CLUSTERS,
  DECISION_NODES,
  HERO_CONSTELLATION,
  PIXEL_COLORS,
  POOL_SIZE,
  SYSTEM_NODES,
  type PixelSpot,
} from "@/lib/scene-data";
import {
  INTEL_NODE_SPACING,
  INTEL_NODE_START,
} from "@/lib/motion-tokens";

type Kind = "hidden" | "const" | "cluster" | "system" | "decision";

interface Target {
  x: number;
  y: number;
  size: number;
  color: THREE.Color;
  cluster: string | null;
  kind: Kind;
}

const HIDDEN_COLOR = new THREE.Color(0x000000);

function hidden(): Target {
  return { x: 0, y: 0, size: 0, color: HIDDEN_COLOR, cluster: null, kind: "hidden" };
}

function fromSpot(
  spot: PixelSpot,
  kind: Kind,
  cluster: string | null
): Target {
  return {
    x: spot.pos[0],
    y: spot.pos[1],
    size: spot.size,
    color: new THREE.Color(PIXEL_COLORS[spot.color]),
    cluster,
    kind,
  };
}

function heroLayout(): Target[] {
  const out = HERO_CONSTELLATION.map((s) => fromSpot(s, "const", null));
  while (out.length < POOL_SIZE) out.push(hidden());
  return out;
}

function buildLayout(): Target[] {
  const out: Target[] = [];
  for (const group of BUILD_CLUSTERS) {
    for (const spot of group.spots) out.push(fromSpot(spot, "cluster", group.id));
  }
  while (out.length < POOL_SIZE) out.push(hidden());
  return out;
}

function automateLayout(): Target[] {
  const out: Target[] = SYSTEM_NODES.map((node) => ({
    x: node.pos[0],
    y: node.pos[1],
    size: 0.22,
    color: new THREE.Color(PIXEL_COLORS.azure),
    cluster: null,
    kind: "system" as const,
  }));
  while (out.length < POOL_SIZE) out.push(hidden());
  return out;
}

function intelligenceLayout(): Target[] {
  const out = automateLayout().slice(0, SYSTEM_NODES.length);
  for (const pos of DECISION_NODES) {
    out.push({
      x: pos[0],
      y: pos[1],
      size: 0.17,
      color: new THREE.Color(PIXEL_COLORS.sky),
      cluster: null,
      kind: "decision",
    });
  }
  while (out.length < POOL_SIZE) out.push(hidden());
  return out;
}

const LAYOUTS = {
  hero: heroLayout(),
  build: buildLayout(),
  automate: automateLayout(),
  intelligence: intelligenceLayout(),
};

function roundedSquareGeometry(): THREE.ShapeGeometry {
  const s = 0.5;
  const r = 0.12;
  const shape = new THREE.Shape();
  shape.moveTo(-s + r, -s);
  shape.lineTo(s - r, -s);
  shape.quadraticCurveTo(s, -s, s, -s + r);
  shape.lineTo(s, s - r);
  shape.quadraticCurveTo(s, s, s - r, s);
  shape.lineTo(-s + r, s);
  shape.quadraticCurveTo(-s, s, -s, s - r);
  shape.lineTo(-s, -s + r);
  shape.quadraticCurveTo(-s, -s, -s + r, -s);
  return new THREE.ShapeGeometry(shape, 6);
}

export function Pixels() {
  const mesh = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => roundedSquareGeometry(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const baseRot = useMemo(
    () => Array.from({ length: POOL_SIZE }, (_, i) => (((i * 137) % 10) - 5) / 60),
    []
  );

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const t = hidden();
    dummy.position.set(0, 0, 0);
    dummy.scale.setScalar(0);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    for (let i = 0; i < POOL_SIZE; i++) {
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, t.color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    return () => geometry.dispose();
  }, [dummy, geometry]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const time = state.clock.elapsedTime;
    const { chapter, local } = threeStore;
    const boot = bootProgress(time);

    let from = LAYOUTS.hero;
    let to = LAYOUTS.hero;
    let blend = 1;
    if (chapter === "build") {
      from = LAYOUTS.hero;
      to = LAYOUTS.build;
      blend = seg(local, 0.05, 0.4);
    } else if (chapter === "automate") {
      from = LAYOUTS.build;
      to = LAYOUTS.automate;
      blend = seg(local, 0, 0.35);
    } else if (chapter === "intelligence") {
      from = LAYOUTS.automate;
      to = LAYOUTS.intelligence;
      blend = seg(local, 0, 0.3);
    }

    const highlight = threeStore.highlight;
    let decisionIndex = 0;

    for (let i = 0; i < POOL_SIZE; i++) {
      const a = from[i];
      const b = to[i];
      const x = a.x + (b.x - a.x) * blend;
      const y = a.y + (b.y - a.y) * blend;
      const size = a.size + (b.size - a.size) * blend;

      let appear = 1;
      if (chapter === "hero") {
        const stagger = (i % HERO_CONSTELLATION.length) * 0.014;
        appear = seg(boot, 0.05 + stagger, 0.24 + stagger);
      }

      let scaleMod = 1;
      if (b.kind === "decision") {
        const wi = INTEL_NODE_START + decisionIndex * INTEL_NODE_SPACING;
        const gather = seg(local, wi, wi + 0.16);
        const fire = seg(local, wi + 0.16, wi + 0.22);
        scaleMod =
          1 - 0.08 * Math.sin(gather * Math.PI) + 0.06 * Math.sin(fire * Math.PI);
        decisionIndex++;
      }

      if (highlight && b.cluster && b.cluster !== highlight && chapter === "build") {
        scaleMod *= 0.4;
      }

      const bob = threeStore.reduced
        ? 0
        : Math.sin(time * 1.1 + i * 1.7) * 0.02;
      const s = Math.max(0, size * appear * scaleMod);

      dummy.position.set(x, y + bob, 0);
      dummy.scale.setScalar(s);
      dummy.rotation.set(0, 0, baseRot[i]);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      tmpColor.copy(a.color).lerp(b.color, blend);
      m.setColorAt(i, tmpColor);
    }

    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, POOL_SIZE]}>
      <meshBasicMaterial transparent side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}
