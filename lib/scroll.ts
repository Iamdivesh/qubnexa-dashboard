"use client";

import type Lenis from "lenis";
import { threeStore } from "@/lib/three-store";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis && !threeStore.reduced) {
    lenis.scrollTo(el, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: threeStore.reduced ? "auto" : "smooth" });
  }
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}
