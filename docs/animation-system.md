# Animation System

Version 0.3 — Final Design Intelligence · Q-Orbit foundation approved
Stack (verified installed): gsap 3.15.0 (includes ScrollTrigger and SplitText — free since GSAP 3.13), lenis 1.3.26, framer-motion 13.1.1, three 0.185.1 + @react-three/fiber 9.x.
Principle: **motion communicates the system — formation, connection, progression, intelligence, convergence.** If a motion has no narrative or usability job, it is cut.

## 1. Motion principles (locked)

Motion must communicate: **formation** (things come together), **connection** (systems link), **progression** (stages advance), **intelligence** (decide, then act), **convergence** (return to the mark).

Avoid (locked): bouncing, excessive elastic overshoot (the blade-lock settle is capped at ~4% — the only permitted overshoot), unnecessary parallax, constant movement, animation everywhere.

**Stillness is a designed state:** the CONNECTED hold, the quiet-support tier, and the gather moment before every decide-act fire are intentional pauses. Do not fill them.

## 2. Stack ownership

| Library | Owns | Never does |
|---|---|---|
| Lenis | Smooth scrolling, scroll velocity | DOM animation |
| GSAP + ScrollTrigger | Scroll choreography: pins, scrubbed timelines, chapter progress, text reveals, counters | React state updates |
| Framer Motion | Component-level interaction & mount/unmount: accordions, hover gestures, presence | Anything scroll-scrubbed |
| R3F useFrame | All WebGL per-frame updates | DOM |

**Single RAF rule:** `gsap.ticker` is the only animation loop; Lenis's raf is driven from it; `ScrollTrigger.update` fires on Lenis scroll events. No other `requestAnimationFrame` loops anywhere.

## 3. State bridge

Pinned chapters write `{chapter, local}` into a plain mutable module store (`lib/three-store.ts`); the 3D layer reads it inside `useFrame`. Scroll never triggers React re-renders. Contract: `3d-system.md` §10.

## 4. Initial page load — "a system coming online"

The hero boot is the site's signature moment. Total ≤2.4s desktop / ≤1.5s mobile; instant final state under reduced motion or without JS (no hidden-by-default content).

| Step | t (desktop) | Event |
|---|---|---|
| 1 | 0ms | Dark field; nav skeleton; page paints (no FOUC) |
| 2 | ~200ms | Pixel constellation fades/staggers in at dispersed positions |
| 3 | ~600ms | Pixels converge toward their lockup positions (900ms out-expo) |
| 4 | ~1200ms | Ribbon ring sweeps closed (arc draw, 600ms) |
| 5 | ~1600ms | Blade locks into position (translate + fade, ≤4% settle) |
| 6 | ~1800ms | Mark complete — one full-system acknowledgment pulse |
| 7 | ~2000ms | Brand typography: nav brand + eyebrow appear; headline lines mask-rise, staggered 90ms |
| 8 | ~2400ms | Supporting line + CTAs fade-up; scroll runway opens |

The boot is deliberate poetry: BUILD (chapter 02) later reverses it — separation mirrors convergence.

## 5. Hero ignition

First ~30vh of scroll: system pulse + particle drift. Purpose: teach the visitor that scrolling drives the transformation.

## 6. Text reveals

- Display/headings: SplitText line masks — `yPercent: 110 → 0`, skewY 2° → 0, stagger 0.06–0.09, `out-expo`.
- Body: opacity + 24px rise, short stagger.
- Mono labels: clip-path inset reveal left → right.
- SplitText instances created once, `revert()`-ed on unmount.

## 7. Pinned chapters (beats)

One master timeline per pin (`scrub: 0.6`, `anticipatePin: 1`; lengths per `experience-map.md` §5):

| Pin | Internal beats |
|---|---|
| 02 BUILD | clusters separate along vectors → copy swap ×4 → highlight states |
| 03 AUTOMATE | staged path draw: input → processing → action → outcome; pipeline readout labels sync; node blinks per completion |
| 04 INTELLIGENCE | decision nodes attach sequentially; each performs one decide-then-act cycle (gather → fire) |
| 05 GROW | channels arrange in business order → outcome rows reveal → hold |
| 06 CONNECTED | convergence lerp → mark lock → designed hold |
| 09 FINAL CTA | face-on alignment → dolly settle → form reveal |

Copy swaps inside pins reverse with scrub; reveals outside pins play once.

## 8. Camera movement

Camera keyframes live in `3d-system.md` §5. GSAP timelines animate a proxy `{x,y,z,tx,ty,tz}`; `useFrame` lerps the real camera. The DOM library never touches the Three camera directly.

## 9. Object transformations

- Separation / arrangement / convergence: position lerps eased by chapter-local progress.
- Path drawing: dash/shader progress uniform 0 → 1; pulse particle travels parametric `u`.
- Node spawns: scale 0.6 → 1 back-ease-out, opacity ramp.
- **Decide-then-act signature:** node scale contracts to 0.92 over ~200ms (the "gather"), then fires its pulse with a 1.06 spike settling to 1. Sky pulse color; azure paths keep a constant-beat EXECUTE rhythm. Spec: `3d-system.md` §6.
- Idle life: breathing scale ±0.5% / 6s, ring precession ±3° / 12s — paused under reduced motion.

## 10. Interaction inventory

| Target | Motion |
|---|---|
| Buttons | label y-shift slide (duplicate-label technique), arrow nudge 4px; press scale .98 |
| Panels | border tone step + translateY(-2px), 200ms CSS transition |
| Links | underline draw scaleX, origin-left |
| Magnetic CTA wrapper | ±8px pull, lerp 0.18, `(pointer: fine)` only |
| Service rows | accordion height auto via Framer Motion `AnimatePresence`; index → azure; expanding a row fires a Q-Orbit pulse acknowledgment |
| Counters | tnum count-up 900ms once at 60% visibility — **reserved for real client data only** |
| Rail ticks | active tick scale + azure color |
| Channel tags (GROW) | hover/tap-sync highlight with matching node |
| Form submit success | SVG check path draws (stroke-dashoffset) |

## 11. Mobile — first-class experience (locked)

Mobile is designed, not scaled down.

| Aspect | Behavior |
|---|---|
| Remains animated | Boot (compressed ≤1.5s, fewer pixels), chapter pins (shortened ×~0.6), text reveals, accordion, decide-act pulses (reduced count) |
| Simplified | Q-Orbit low tier (counts/DPR per `3d-system.md` §8), camera keys reduced to essential waypoints, EXECUTE pulses at lower frequency |
| Static | CONNECTED convergence plays once, then holds a static frame; stage rendering fully paused during SERVICES/PROCESS (mobile stage policy) |
| Removed | Pointer parallax, magnetic hover, hover-sync (replaced by tap-sync) |
| Hero | Boot compressed; headline at mobile clamp floors; supporting line shortened; CTAs full-width stacked, primary first |
| Chapter transitions | Same pins, shortened; if perf testing shows jank → documented fallback: unpin BUILD/AUTOMATE/GROW into beat-by-beat reveals (default = keep simplified pins) |
| Service interactions | Tap expands (same accordion); pulse acknowledgment fires on expand, not hover |
| Navigation | Mark + "Book a call" only; anchor links live in the footer; no hamburger menu in v1 |
| CTA | No sticky bars; inline primaries + final CTA carry conversion |

## 12. Reduced motion (`prefers-reduced-motion: reduce`)

Contract, all mandatory:
- Lenis disabled → native scroll.
- Scrubbed timelines replaced by instant end-state application.
- Boot skipped; all content rendered visible.
- 3D renders one static frame per chapter change (`store.reduced = true`); idle motion off.
- Counters (when real data exists) render final values immediately; idle loops off; magnetic off.
- Verified via OS setting + devtools emulation before launch.

## 13. Hygiene rules

- Animate `transform` and `opacity` only (clip-path allowed for label reveals).
- `will-change` scoped to animating elements, removed after.
- Listeners passive; GSAP contexts per component with `revert()` cleanup; SplitText reverted; FM `AnimatePresence` owns exit animations.
- Nothing hidden-by-default without JS gating (SEO + no-JS resilience).

---
**Changelog v0.3:** boot sequence replaces the simple load stagger; motion principles + stillness beats locked; INTELLIGENCE decide-then-act signature added; mobile section expanded into a first-class spec; counters gated on real data.
