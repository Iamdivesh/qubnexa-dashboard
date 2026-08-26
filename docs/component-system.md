# Component System

Version 0.3 — Final Design Intelligence · Q-Orbit foundation approved
Architecture plan only — nothing is implemented yet. Defines how semantic content, UI, animation, and WebGL stay separated so the cinematic layer can evolve without touching content.
Visual spec: `design-system.md` · behavior specs: `animation-system.md`, `3d-system.md`, `experience-map.md`.

## 1. Layer model & dependency direction

```
app/                    routes, metadata, page composition (semantic)
  └─ components/sections/   chapter semantics + copy composition
       ├─ components/ui/        dumb visual primitives (no animation knowledge)
       ├─ components/animation/ scroll/reveal wrappers (GSAP/Lenis/FM live here)
       └─ components/three/     WebGL stage (only consumer of three/R3F)
              └─ lib/three-store.ts   shared mutable bridge
```

Rules:
1. `ui` imports nothing from `animation` or `three`. Hover feedback = CSS transitions only.
2. `sections` own copy, headings, landmarks, anchors; they compose `ui` primitives and are wrapped by `animation` wrappers.
3. `three` communicates exclusively through `lib/three-store.ts`; it never imports sections or ui.
4. Only `animation`, `three`, and genuinely interactive `ui` are client components.

## 2. Directory plan

```
components/
  ui/          Logo.tsx (official asset), Button.tsx, LinkArrow.tsx, Panel.tsx,
               Stat.tsx, Tag.tsx, SectionHeader.tsx, Field.tsx, Rail.tsx,
               BlueprintGrid.tsx
  sections/    Nav.tsx, Hero.tsx, Build.tsx, Automate.tsx, Grow.tsx,
               ConnectedSystems.tsx, Services.tsx, WhyQubnexa.tsx,
               Outcomes.tsx, Process.tsx, FinalCta.tsx, Footer.tsx
  animation/   SmoothScrollProvider.tsx, Reveal.tsx, TextReveal.tsx,
               ChapterPin.tsx, Counter.tsx, Magnetic.tsx, Parallax.tsx
  three/       StageCanvas.tsx (dynamic import), QOrbit.tsx (scene root),
               RibbonRing.tsx, Blade.tsx, Pixels.tsx, Paths.tsx, ParticleField.tsx
lib/           three-store.ts, motion-tokens.ts,
               usePrefersReducedMotion.ts, usePointerFine.ts
content/       site.ts — typed constants: hero copy, build tracks, automate
               example flows, intelligence capabilities, grow channels +
               qualitative outcomes, services (what/problem/does/get + tech
               metadata), process steps, principles, expectation steps, nav
```

Content rules: stats/counters are gated on real client data (none exists yet) — outcomes ship as qualitative rows; the primary CTA is the constant string "Book an intro call" from `content/site.ts`, never reworded per section.

Copy lives in `content/site.ts`, never hardcoded deep in components — keeps the content phase fast and the sections generic.

## 3. Wrapper contracts (props sketches)

| Wrapper | Props (sketch) | Responsibility |
|---|---|---|
| `SmoothScrollProvider` | children | Lenis setup wired to gsap.ticker; reduced-motion bypass |
| `Reveal` | `as`, `type: 'fade-up' \| 'mask'`, `delay?`, `once?` | Generic enter reveal via ScrollTrigger |
| `TextReveal` | children (heading text) | SplitText line masks; revert on unmount |
| `ChapterPin` | `id`, `lengthVh`, `onProgress?` | Owns pin + scrub timeline; writes `{chapter, local}` to store |
| `Counter` | `to`, `format?`, `duration?` | Count-up once at visibility; final value immediately under reduced motion |
| `Magnetic` | `strength?`, `maxOffset?` | Pointer-fine-only magnetic pull |
| `Parallax` | `speed` | Small translate-on-scroll for DOM accents |

Every wrapper: creates GSAP/FM context in `useEffect`, reverts on unmount, degrades automatically through `usePrefersReducedMotion` / FM `MotionConfig`.

## 4. Three-layer contract

- `StageCanvas`: client-only dynamic import; owns Canvas, DPR clamp, tier detection, resize, pause/resume, cleanup checklist (`3d-system.md` §8).
- `QOrbit`: scene root; reads store per frame; hosts chapter configurations as sub-components (`RibbonRing`, `Blade`, `Pixels`, `Paths`, `ParticleField`) that each dispose their own resources. All geometry derives from the official mark (`3d-system.md` §2).
- **Active architecture (one mental model):** `StageCanvas → QOrbit → {RibbonRing, Blade, Pixels, Paths, ParticleField}`. `ChannelRing` was evaluated and removed — the GROW channel arrangement is `Pixels` positioned along a closed circular `Path`, a configuration rather than a distinct component. No `QLattice`/`Cluster` remnants in the active architecture.
- No React state in the render loop; uniforms/matrices updated directly from store values.

## 5. Accessibility contract

- Exactly one `h1` (hero); one `h2` per chapter; logical heading order.
- Service rows: real `<button>`s with `aria-expanded` / `aria-controls`.
- Rail and canvas: `aria-hidden`; each pinned chapter gets a visually-hidden summary so screen-reader users receive the narrative without pins.
- Skip-link to main content; visible focus everywhere (`design-system.md` §8).
- Form: visible labels, inline error messaging, `aria-live` on submit status.
- No modals in v1 → no focus traps needed.

## 6. Performance contract

- `components/three` loaded via `next/dynamic` with `ssr: false`; three.js never enters the initial bundle.
- No client JS above the fold except providers; sections stay server-rendered.
- Avoid `content-visibility` on pinned/ScrollTrigger-measured regions (it corrupts trigger positions); allowed on plain below-fold blocks if needed.
- Framer Motion imported per consuming file only; GSAP plugins registered once in `lib/motion-tokens.ts`.
- Anchors use stable ids (`#build`, `#automate`, …) matching `data-testid="chapter-*"` roots for verification.

## 7. Conventions

- Components PascalCase named files; lib/content camelCase kebab files; named exports.
- Styling: Tailwind utilities referencing design tokens; no inline style objects for static values.
- No comments unless non-obvious; no `any`; strict TS per existing `tsconfig.json`.
