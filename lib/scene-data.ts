import type { ChapterId, Tier } from "@/lib/three-store";

export type Vec2 = [number, number];

export const PALETTE = {
  azure: 0x1e8ff2,
  azureHover: 0x47acf7,
  azureDeep: 0x0b63c4,
  navy: 0x1b2a6b,
  sky: 0x5fb8f8,
  dust: 0x5e6f9b,
} as const;

export type PixelColor = "azure" | "navy" | "sky";

export const PIXEL_COLORS: Record<PixelColor, number> = {
  azure: PALETTE.azure,
  navy: PALETTE.navy,
  sky: PALETTE.sky,
};

export interface PixelSpot {
  pos: Vec2;
  size: number;
  color: PixelColor;
}

function cluster(center: Vec2, seed: number): PixelSpot[] {
  const spots: PixelSpot[] = [];
  const colors: PixelColor[] = ["azure", "navy", "sky", "azure", "navy", "azure"];
  for (let i = 0; i < 6; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const jitterX = ((seed * (i + 3)) % 7) / 40 - 0.075;
    const jitterY = ((seed * (i + 5)) % 5) / 40 - 0.05;
    spots.push({
      pos: [
        center[0] + (col - 0.5) * 0.62 + jitterX,
        center[1] + (row - 1) * 0.58 + jitterY,
      ],
      size: 0.11 + ((seed + i) % 4) * 0.018,
      color: colors[(i + seed) % 6],
    });
  }
  return spots;
}

export const HERO_CONSTELLATION: PixelSpot[] = [
  { pos: [1.6, 2.2], size: 0.16, color: "azure" },
  { pos: [2.4, 1.7], size: 0.24, color: "navy" },
  { pos: [3.1, 2.5], size: 0.12, color: "sky" },
  { pos: [2.0, 3.0], size: 0.1, color: "azure" },
  { pos: [2.9, 0.9], size: 0.18, color: "azure" },
  { pos: [3.6, 1.6], size: 0.1, color: "navy" },
  { pos: [1.4, 1.5], size: 0.12, color: "sky" },
  { pos: [2.5, 3.3], size: 0.14, color: "azure" },
  { pos: [3.8, 2.9], size: 0.1, color: "azure" },
  { pos: [1.9, 0.8], size: 0.1, color: "navy" },
  { pos: [3.3, 0.6], size: 0.16, color: "sky" },
  { pos: [2.2, 1.2], size: 0.1, color: "azure" },
  { pos: [4.1, 1.9], size: 0.12, color: "navy" },
  { pos: [2.8, 2.2], size: 0.1, color: "azure" },
];

export const BUILD_CLUSTERS: { id: string; center: Vec2; spots: PixelSpot[] }[] = [
  { id: "websites", center: [-3.3, 1.7], spots: cluster([-3.3, 1.7], 1) },
  { id: "applications", center: [3.4, 1.0], spots: cluster([3.4, 1.0], 2) },
  { id: "saas", center: [-1.0, -2.4], spots: cluster([-1.0, -2.4], 3) },
  { id: "custom", center: [2.6, -2.8], spots: cluster([2.6, -2.8], 4) },
];

export const SYSTEM_NODES: { id: string; pos: Vec2 }[] = [
  { id: "marketing", pos: [-3.3, 2.1] },
  { id: "crm", pos: [-3.3, -0.7] },
  { id: "sales", pos: [-0.9, 2.5] },
  { id: "operations", pos: [-0.9, -2.3] },
  { id: "data", pos: [1.5, 1.9] },
  { id: "finance", pos: [1.5, -1.1] },
  { id: "support", pos: [3.5, 0.5] },
];

export type FlowStage = 0 | 1 | 2 | 3;

export interface FlowPath {
  from: Vec2;
  to: Vec2;
  stage: FlowStage;
}

export const FLOW_PATHS: FlowPath[] = [
  { from: SYSTEM_NODES[0].pos, to: SYSTEM_NODES[1].pos, stage: 0 },
  { from: SYSTEM_NODES[3].pos, to: SYSTEM_NODES[1].pos, stage: 0 },
  { from: SYSTEM_NODES[1].pos, to: SYSTEM_NODES[4].pos, stage: 1 },
  { from: SYSTEM_NODES[4].pos, to: SYSTEM_NODES[5].pos, stage: 1 },
  { from: SYSTEM_NODES[1].pos, to: SYSTEM_NODES[2].pos, stage: 2 },
  { from: SYSTEM_NODES[2].pos, to: SYSTEM_NODES[6].pos, stage: 2 },
  { from: SYSTEM_NODES[2].pos, to: SYSTEM_NODES[4].pos, stage: 3 },
  { from: SYSTEM_NODES[6].pos, to: SYSTEM_NODES[4].pos, stage: 3 },
];

export const DECISION_NODES: Vec2[] = [
  midpoint(FLOW_PATHS[2]),
  midpoint(FLOW_PATHS[4]),
  midpoint(FLOW_PATHS[6]),
];

function midpoint(path: FlowPath): Vec2 {
  return [(path.from[0] + path.to[0]) / 2, (path.from[1] + path.to[1]) / 2];
}

export const POOL_SIZE = 48;

export function chapterId(index: number): ChapterId {
  const chapters: ChapterId[] = ["hero", "build", "automate", "intelligence"];
  return chapters[index];
}

export type { Tier };
