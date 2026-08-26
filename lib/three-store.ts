export type ChapterId =
  | "hero"
  | "build"
  | "automate"
  | "intelligence"
  | "grow"
  | "connected"
  | "services"
  | "process"
  | "cta";

export type Tier = "high" | "low";

interface ThreeStore {
  chapter: ChapterId;
  local: number;
  global: number;
  tier: Tier;
  reduced: boolean;
  pointerFine: boolean;
  pointerX: number;
  pointerY: number;
  ignition: number;
  highlight: string | null;
}

export const threeStore: ThreeStore = {
  chapter: "hero",
  local: 0,
  global: 0,
  tier: "high",
  reduced: false,
  pointerFine: false,
  pointerX: 0,
  pointerY: 0,
  ignition: 0,
  highlight: null,
};

export const bootState = {
  start: -1,
  duration: 2.4,
};

export function bootProgress(time: number): number {
  if (threeStore.reduced) return 1;
  if (bootState.start < 0) bootState.start = time;
  return Math.min(1, (time - bootState.start) / bootState.duration);
}

export function seg(p: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
