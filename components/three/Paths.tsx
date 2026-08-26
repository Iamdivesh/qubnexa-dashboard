"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, MeshBasicMaterial } from "three";
import { seg, threeStore } from "@/lib/three-store";
import { FLOW_PATHS, PALETTE } from "@/lib/scene-data";
import {
  AUTOMATE_STAGE_WINDOWS,
  INTEL_NODE_SPACING,
  INTEL_NODE_START,
} from "@/lib/motion-tokens";

/** Flow paths the decision nodes sit on (indices into FLOW_PATHS). */
const DECISION_PATHS = [2, 4, 6];

function curveFor(from: [number, number], to: [number, number], stage: number) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const nx = -dy;
  const ny = dx;
  const len = Math.hypot(nx, ny) || 1;
  const bow = (stage % 2 === 0 ? 1 : -1) * 0.3;
  const control = new THREE.Vector3(
    (from[0] + to[0]) / 2 + (nx / len) * bow,
    (from[1] + to[1]) / 2 + (ny / len) * bow,
    0
  );
  return new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(from[0], from[1], 0),
    control,
    new THREE.Vector3(to[0], to[1], 0)
  );
}

export function Paths() {
  const curves = useMemo(
    () => FLOW_PATHS.map((p) => curveFor(p.from, p.to, p.stage)),
    []
  );

  const lines = useMemo(
    () =>
      curves.map((curve) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(
          curve.getPoints(24)
        );
        const material = new THREE.LineBasicMaterial({
          color: PALETTE.azure,
          transparent: true,
          opacity: 0,
        });
        return new THREE.Line(geometry, material);
      }),
    [curves]
  );

  const pulses = useRef<Array<Mesh | null>>([]);
  const skyPulses = useRef<Array<Mesh | null>>([]);

  useEffect(() => {
    return () => {
      lines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.LineBasicMaterial).dispose();
      });
    };
  }, [lines]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const { chapter, local } = threeStore;
    const active = chapter === "automate" || chapter === "intelligence";
    const fade = active
      ? chapter === "automate"
        ? seg(local, 0, 0.15)
        : 1
      : 0;

    lines.forEach((line, i) => {
      const stage = FLOW_PATHS[i].stage;
      let progress = 0;
      if (chapter === "intelligence") progress = 1;
      else if (chapter === "automate") {
        const [a, b] = AUTOMATE_STAGE_WINDOWS[stage];
        progress = seg(local, a, b);
      }
      line.geometry.setDrawRange(0, Math.max(0, Math.floor(progress * 25)));
      const material = line.material as THREE.LineBasicMaterial;
      material.opacity = fade * 0.75;
      line.visible = fade > 0.01 && progress > 0;

      const pulse = pulses.current[i];
      if (pulse) {
        if (progress >= 1 && fade > 0.05 && !threeStore.reduced) {
          const u = (time * 0.22 + i * 0.41) % 1;
          const point = curves[i].getPoint(u);
          pulse.position.set(point.x, point.y, 0.01);
          (pulse.material as MeshBasicMaterial).opacity = 0.9 * fade;
          pulse.visible = true;
        } else {
          pulse.visible = false;
        }
      }
    });

    skyPulses.current.forEach((pulse, di) => {
      if (!pulse) return;
      const windowStart = INTEL_NODE_START + di * INTEL_NODE_SPACING;
      const travel = seg(local, windowStart + 0.08, windowStart + 0.2);
      if (chapter === "intelligence" && travel > 0 && travel < 1 && !threeStore.reduced) {
        const curve = curves[DECISION_PATHS[di]];
        const point = curve.getPoint(0.5 + 0.5 * travel);
        pulse.position.set(point.x, point.y, 0.01);
        (pulse.material as MeshBasicMaterial).opacity = (1 - travel) * 0.9;
        pulse.visible = true;
      } else {
        pulse.visible = false;
      }
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
      {FLOW_PATHS.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            pulses.current[i] = el;
          }}
          visible={false}
        >
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial
            color={PALETTE.azureHover}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
      {DECISION_PATHS.map((_, i) => (
        <mesh
          key={`sky-${i}`}
          ref={(el) => {
            skyPulses.current[i] = el;
          }}
          visible={false}
        >
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial
            color={PALETTE.sky}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
