# 3D System — Q-Orbit

Version 0.3 — Final Design Intelligence · Q-Orbit foundation approved
Tech: three 0.185.1 + @react-three/fiber 9.x + @react-three/drei (helpers only). One persistent scene evolves across the whole page.
Visual tokens: `design-system.md` · chapter triggers: `experience-map.md` · motion mechanics: `animation-system.md`.

## 1. Purpose

Q-Orbit is **a visual representation of how QubNexa connects business systems** — a premium digital operating system, visualized in 3D. It is not an animated logo and not decoration: every formation, connection and convergence on stage mirrors something QubNexa actually does (foundations → systems → automation → intelligence → growth).

The official logo (`logo.png`) remains the **source of truth for geometry**; the story it tells is business.

**Metaphor blacklist (locked):** outer space, planets, solar-system orbits, generic AI imagery, sci-fi, gaming, crypto, random particles. If a motion reads as astronomy, it is wrong.

**Scope note:** the restricted geometry alphabet below applies to the **Three.js world only**. The DOM/UI layer freely uses grids, lines, panels, technical labels, arrows, charts, cards, data structures and interface frames (`design-system.md` §3, §8).

## 2. Logo anatomy → business meaning → geometry

| Logo element | Business meaning | 3D element |
|---|---|---|
| Ribbon ring (navy + azure sweep) | Core / continuity — the operating core | **RibbonRing:** torus-arc swept ribbon, two-tone |
| Blade (diagonal tail) | Direction / execution / growth vector | **Blade:** flat elongated prism on the diagonal |
| Pixel constellation (rounded squares) | Modules / business capabilities / channels | **Pixels:** instanced rounded-square nodes, varied scale |
| Paths | Workflows / connections between systems | **Paths:** directed polylines |
| Pulses | Information / automation / activity | **Pulse:** one traveling particle per active path |
| Reassembled mark | Connected system / convergence | **Mark state:** all elements in lockup position |
| — (environment) | Depth | **Field:** ambient dust points, fog-faded |

The scene uses only these elements. Distinctiveness comes from business choreography, not from adding shapes. The old "Q-Lattice" cube concept is retired history — the mark is ring + blade + pixels.

## 3. Source of truth & pending assets

- Reference: `logo.png` (1536×1024, white matte; no vector master in repo). 3D proportions are taken from the asset at implementation time.
- Rule: the system may stylize — depth, motion, lighting — but never redesign proportions or introduce foreign symbols. At rest, face-on, the composition must read as the official mark.
- Pending brand exports (owner-provided; do not self-draw): transparent PNG, vector/SVG master, dark-background variant, mark-only crop.

## 4. Scene architecture

- Canvas: fixed, full viewport, z-0 behind content (content z-10); transparent clear over page background; fog matched to the navy-black bg.
- One root group (`QOrbit`) persists across all chapters; chapters are **timeline-driven configurations** of the same objects — no remounting.
- Materials: unlit discipline — flat fills and line primitives for pixels, paths, dust. **Brand exception:** RibbonRing carries the logo's navy→azure gradient (vertex colors or shader), because the mark itself is graded. Sky is reserved for intelligence highlights (§6). No bloom/postprocessing — crisp edges over glow.

## 5. Chapter state machine

| Chapter | Geometry state | Camera key (pos → target) | Motion character |
|---|---|---|---|
| 01 HERO "System online" | Boot: field → pixels appear dispersed → converge → ring sweeps closed → blade docks → assembled mark | Slow push-in during boot, settling at (4.6, 3.4, 7.2) → origin, fov 42 | Formation; then idle ring precession ±3°/12s, pixel micro-orbit; ignition pulse on first scroll |
| 02 BUILD "Foundations" | Mark separates into capability module clusters (Websites / Applications / SaaS / Custom software) at asymmetric offsets (≈ (-4.2, 1.4, 0) / (4.4, -0.6, -1) / (0.4, -3.2, 1.5) + one) | Pull back to (0, 0.6, 11) | Scrubbed separation; hover dims non-active clusters ~40% |
| 03 AUTOMATE "Workflows" | Business-system nodes (CRM, sales, marketing, ops, data, finance, support — working set) connect via staged paths: input → processing → action → outcome | Slight orbit, azimuth +12° | Staged connection choreography; azure pulses, deterministic rhythm |
| 04 INTELLIGENCE "Decision layer" | Decision/action nodes attach to existing paths at decision points | Slow lateral track | Decide-then-act signature (§6); sky pulses |
| 05 GROW "Channel network" | Channel pixels (Marketing, Sales, CRM, Operations, Customer, Data, AI — working set) arrange around the core on a ring echoing the mark's ring (radius ≈ 6.5, tilted) | Rise to y+2.5, look-down ≈18° | Radial arrangement in business order; modest density |
| 06 CONNECTED "Convergence" | Everything returns: ring closes, blade docks, pixels lock; mark reassembles | Front-three-quarters, z ≈ 12.5, framing the mark | Convergence scrub → designed hold |
| 07–08 SERVICES / PROCESS "Quiet support" | Mark drifts to upper-right third, scale 0.85, opacity ~25%; dust only | Static | Stillness; pulse acknowledgments fired by service-row interactions |
| 09 FINAL "The mark" | Face-on mark lock; pixels settle to rest | (0, 0, 10) → slow dolly to 8.6 | Slow zoom to rest; oscillation damps to zero |

Camera keys are starting keyframes — tuned during implementation against real content.

## 6. Motion signatures (locked)

| Signature | Color | Rhythm | Used in |
|---|---|---|---|
| **EXECUTE** | azure | constant, deterministic — pulse leaves on beat | AUTOMATE paths, workflow diagrams |
| **DECIDE → ACT** | sky | gather (brief contraction) → fire | INTELLIGENCE nodes, AI service row, AI diagrams |

The pair encodes the locked copy rule "Automation executes the workflow. AI makes it intelligent." and repeats identically in DOM diagrams so the language holds without WebGL.

## 7. Stillness beats (locked)

Stillness is a designed state, not absence of work: the CONNECTED hold, the quiet-support tier across SERVICES/PROCESS, and the gather moment before every decide-act fire. Premium perception depends on these pauses — do not fill them.

## 8. Performance budget

| Item | Desktop (≥lg) | Mobile (<lg) |
|---|---|---|
| Pixels (instanced) | ≤220 | ≤80 |
| Field points | ≤1400 | ≤380 |
| Paths | ≤24 | ≤10 |
| DPR clamp | min(devicePixelRatio, 2) | 1.5 |
| Draw calls target | <40 | <25 |

Lifecycle:
- Stage dynamically imported (`ssr: false`), mounted after hydration + idle.
- **Mobile stage policy:** canvas renders only during the System act (01–06) and Final CTA (09); during SERVICES/PROCESS (07–08) rendering pauses entirely — content leads, battery preserved.
- Render pause also on tab hidden (`visibilitychange`).
- Resize via debounced ResizeObserver (150ms).
- Auto-degrade: sustained FPS <30 for 3s on low tier → freeze to chapter-static frames (documented, not silent).
- Cleanup on unmount/route change: dispose geometries/materials, remove listeners, revert ticker functions; verify via memory snapshot.

## 9. Reduced motion

`store.reduced = true`: one static frame per chapter (the chapter's end-state composition), idle motion off. WebGL unavailable/failed → official logo PNG poster (light surfaces; dark variant pending brand exports).

## 10. Store contract (`lib/three-store.ts`)

Plain mutable module object — zero React re-renders:

```ts
{
  chapter: string      // 'hero' | 'build' | 'automate' | 'intelligence' | 'grow' | 'connected' | 'services' | 'process' | 'cta'
  local: number        // 0..1 chapter-local scrub progress
  global: number       // 0..1 page scroll ratio
  tier: 'high' | 'low' // quality tier
  reduced: boolean     // prefers-reduced-motion
  highlight: string | null // active cluster/track/node id from DOM hover/focus
}
```

Written by: ScrollTrigger callbacks and DOM interaction handlers. Read by: `useFrame`, once per frame. The rail subscribes separately to `global` only.

## 11. Mobile & fallback summary

Low tier counts/DPR per §8; simplified camera keys (fewer waypoints); pointer parallax and magnetic off; canvas retained for the System act with the stage policy, auto-degrade and static-poster escapes defined above.
