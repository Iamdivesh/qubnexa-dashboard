import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import type { Tier } from "@/lib/three-store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("out-expo", "0.16,1,0.3,1");
  CustomEase.create("inout", "0.83,0,0.17,1");
}

export { gsap, ScrollTrigger };

export const BOOT = { desktop: 2.4, mobile: 1.5 } as const;

export function bootDuration(tier: Tier): number {
  return tier === "low" ? BOOT.mobile : BOOT.desktop;
}

export const BUILD_TRACK_WINDOWS: [number, number][] = [
  [0.42, 0.55],
  [0.55, 0.68],
  [0.68, 0.81],
  [0.81, 0.97],
];

export const AUTOMATE_STAGE_WINDOWS: [number, number][] = [
  [0.12, 0.38],
  [0.38, 0.58],
  [0.58, 0.78],
  [0.78, 0.94],
];

export const INTEL_NODE_START = 0.3;
export const INTEL_NODE_SPACING = 0.18;
