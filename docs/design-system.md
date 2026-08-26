# QubNexa Design System

Version 0.3 — Final Design Intelligence · Q-Orbit foundation approved
Scope: reusable visual foundation for `qubnexa_website`. Implementation target: Tailwind v4 tokens via `@theme` in `app/globals.css`; fonts already wired in `app/layout.tsx`.
Companions: `experience-map.md` (structure) · `animation-system.md` (motion) · `3d-system.md` (WebGL) · `component-system.md` (architecture).

## 1. Brand foundations

| Element | Decision |
|---|---|
| Name logic | **Qub** = the square module / pixel (cubed in depth) · **Nexa** = nexus, connection |
| Logo lockup | Mark (ribbon-ring Q, blade tail, pixel constellation) above the "Qubnexa" wordmark and the descriptor "AI \| Automation \| Innovation" |
| Positioning | **QubNexa connects digital systems, automation and AI to help businesses operate better and grow faster.** Not a web dev agency, automation freelancer, AI consultancy, or generic software company |
| Narrative | BUILD → AUTOMATE → AI/INTELLIGENCE → GROW → reconnected as CONNECTED SYSTEMS |
| Value chain | Digital foundations → Connected systems → Automation → Intelligence → Growth |
| Tagline | Build Better. Automate Smarter. Grow Faster. |
| Voice | Declarative, technical, short sentences. Banned: "revolutionary", "cutting-edge", "next-gen", exclamation marks. |

The name decode drives everything visual: **square modules** (Qub) + **connection** (Nexa) — exactly what the official mark shows: ribbon-ring Q, blade vector, pixel-square constellation. Mark anatomy and asset status: §2 below · 3D derivation: `3d-system.md` §1–2.

### Locked copy rules
- "Automation executes the workflow. AI makes it intelligent." — the AI distinction, reused across chapters, services and diagrams.
- AI is positioned as the intelligence layer inside automation — never a standalone sci-fi product story.

## 2. Brand assets (verified against repo, 2026-08-24)

- **Official logo found:** `logo.png` at the repository root — 1536×1024 PNG, 24-bit RGB, ~1.1 MB, white matte baked in (no alpha channel). No SVG/vector master exists in the repo.
- **Mark anatomy:** a bold Q formed by a two-tone ribbon ring (deep navy + azure sweep) with a sharp diagonal blade as the tail; a constellation of rounded pixel-squares (navy / azure / cyan, varied sizes) disperses from the ring's top-right — the "connected modules" motif.
- **Lockup:** mark above the "Qubnexa" wordmark (geometric sans, navy; the wordmark Q's tail and the x of "nexa" carry azure strokes) and the descriptor line "AI | Automation | Innovation" with light-blue separators. Generous white negative space; the Q counter is large and clean.
- `public/` still contains only create-next-app boilerplate — delete at implementation.
- **Pending production exports (request from brand owner — do not redraw, trace, or modify the mark):** transparent-background PNG, vector/SVG master, dark-background variant, mark-only crop for favicon and 3D reference.
- 3D suitability: the mark's anatomy (ring, blade, squares) maps cleanly to 3D primitives (see `3d-system.md`), but the PNG is a raster reference, not a geometry source.

## 3. Principles → enforceable rules

| Principle | Rule |
|---|---|
| Precise | 1px hairlines, mono micro-labels, grid-snapped alignment; no blurred decoration |
| Geometric | The logo's own alphabet — ring, blade, square pixels, nodes, paths; UI radius ≤ 2px (logo pixels keep their rounded corners) |
| Intelligent | Sections are indexed `01`–`09`; systems shown as labeled diagrams, not metaphors |
| Cinematic | One persistent 3D stage behind all content; controlled camera; dark stage |
| Minimal | One accent color; ≥50% negative space per viewport; zero glassmorphism |
| Technically sophisticated | Mono type for anything machine-related; blueprint linework; tabular numerals |

Anti-pattern blacklist (per brief): SaaS card rows, AI-landing purple gradients, glowing spheres, floating filler cards, neon overload, template sections.

## 4. Color

Dark-first — the cinematic stage needs darkness. The palette is sampled from the official logo: deep navy + azure blues on a navy-black stage. A light theme is supported through identical token names. Values are sampled from `logo.png` (a gradient raster) — confirm exact hexes against the vector master when it exists.

### Tokens

| Token | Dark (default) | Light | Role |
|---|---|---|---|
| `--color-bg` | `#0A0F1E` (navy-black) | `#F5F7FC` (cool paper) | Page / stage background |
| `--color-surface` | `#101731` | `#FBFCFE` | Panels, raised areas |
| `--color-surface-strong` | `#16203F` | `#FFFFFF` | Hover surface, elevated |
| `--color-border` | `rgba(148,178,255,.10)` | `rgba(16,32,79,.10)` | Hairlines |
| `--color-border-strong` | `rgba(148,178,255,.24)` | `rgba(16,32,79,.22)` | Interactive borders |
| `--color-text-hi` | `#EDF2FC` | `#101731` | Headlines, body |
| `--color-text-mid` | `#9FB0D6` | `#3D4C77` | Secondary text (~8.8:1 on dark bg) |
| `--color-text-low` | `#5E6F9B` | `#7C89AD` | Decorative / large text only (<4.5:1) |
| `--color-navy` | `#1B2A6B` | `#1B2A6B` | Brand dark — the logo navy |
| `--color-azure` | `#1E8FF2` | `#1E8FF2` | Primary accent — the logo blue |
| `--color-azure-hover` | `#47ACF7` | `#0E71D6` | Accent hover |
| `--color-azure-deep` | `#0B63C4` | `#0B63C4` | Accent fill carrying white text on light (≈5.8:1) |
| `--color-sky` | `#5FB8F8` | `#0E71D6` | Small accent text on dark (≈8.9:1), secondary highlight |

### Usage rules
- Azure family covers ≤5% of any viewport. Allowed: primary CTA fill, active data paths, focus rings, active index/rail ticks, one highlighted pixel-node per view.
- Signal discipline (locked): azure means **active / connected / intelligent / progressing / CTA** — never headings, body text, or decorative surfaces. If everything is azure, nothing is. Sky is reserved for intelligence highlights (decide-then-act) and small accent text on dark.
- Button math: dark mode = `azure` fill with navy text (≈5.3:1) · light mode = `azure-deep` fill with white text (≈5.8:1). Azure text on white fails contrast — on light surfaces azure is a fill/border only; any azure-toned text on light uses `azure-deep`.
- Chapters are NOT color-coded. BUILD / AUTOMATE / GROW differentiate by geometry and motion, not hue.
- Gradients: flat by default in UI chrome. Gradients are reserved to the mark itself and its 3D derivatives (the ribbon's navy→azure sweep), plus one radial vignette (navy → transparent, ≤12% alpha) behind the hero core.
- Contrast figures are computed targets from the sampled hexes; run an automated audit (axe / Lighthouse) during implementation.

## 5. Typography

Two families, both already loaded via `next/font/google` (`--font-geist-sans`, `--font-geist-mono`). No new fonts.

- **Geist Sans** — display, headings, body, UI.
- **Geist Mono** — eyebrows, section indexes, buttons, stats, data, captions. The machine voice.

### Scale (fluid)

| Token | Size | Weight | Tracking | Leading | Use |
|---|---|---|---|---|---|
| `display-xl` | `clamp(2.5rem, 9vw, 7rem)` | 500 | `-0.04em` | 1.04 | Hero statement only |
| `display-lg` | `clamp(2rem, 5.5vw, 4rem)` | 600 | `-0.03em` | 1.06 | Chapter titles |
| `heading` | `clamp(1.375rem, 3vw, 2.25rem)` | 600 | `-0.02em` | 1.15 | Sub-sections |
| `body-lg` | `1.125rem → 1.25rem` | 400 | 0 | 1.6 | Lead paragraphs |
| `body` | `1rem` | 400 | 0 | 1.65 | Body |
| `small` | `0.875rem` | 400 | 0 | 1.5 | Captions |
| `label-mono` | `0.75rem`, Geist Mono | 500 | `+0.18em`, uppercase | 1 | Eyebrows, indexes |
| `nav` | `0.9375rem`, Geist Sans | 500 | `-0.01em` | 1 | Navigation items |
| `cta-label` | `0.75rem`, Geist Mono | 500 | `+0.18em`, uppercase | 1 | All button labels (constant primary: "Book an intro call") |
| `metadata` | `0.6875rem`, Geist Mono | 400 | `+0.14em`, uppercase | 1.4 | Tech metadata, pipeline readout, captions |

Rules: sentence case headlines (uppercase reserved for mono labels); body measure ≤62ch, display measure ≤20ch; stats use `font-feature-settings: "tnum"` (verify Geist supports it at implementation; graceful fallback acceptable). Mobile floors are built into the clamps — no separate mobile scale.
International readiness: Geist loads with the `latin` subset; non-Latin locales require extending `next/font` subsets and re-checking measures. No copy is baked into images or the 3D canvas, so all text stays translatable.

### Wordmark & lockup treatment
- The wordmark is an **asset from the logo lockup** — never retyped in Geist or any other font.
- Complete lockup (mark + wordmark + descriptor): OG/social images, print, partnership surfaces.
- Mark only: favicon, the 3D convergence state, tight spaces.
- Nav/footer: official lockup asset once transparent/dark variants exist (pending); until then the PNG's white matte limits it to light surfaces.
- Interim (until brand exports arrive): nav/footer show the text brand "QubNexa" in Geist Sans 600 — a word set in the site's typeface, not a recreation of the lockup letterforms; swap to the official mark/lockup assets when delivered.
- The lockup descriptor "AI | Automation | Innovation" belongs to the lockup, not to site copy. The site narrative tagline "Build Better. Automate Smarter. Grow Faster." remains the campaign line — the two coexist (descriptor = category, tagline = promise).

## 6. Spacing & grid

- Base unit 4px (Tailwind default spacing scale).
- Section rhythm: `py-28 md:py-36 lg:py-44`. Pinned chapters manage their own internal height (see `experience-map.md`).
- Containers: full-bleed stage; content container `max-w-[1440px]` with `px-6 md:px-10 lg:px-16`; reading column `max-w-[720px]`.
- Grid: 12-col desktop (24px gutters) / 8-col tablet / 4-col mobile (20px gutters).
- Layout bias: asymmetric editorial splits (7/5, 8/4), content anchored left, 3D focal point right. Never centered symmetric card rows.
- Every chapter opens with a hairline top rule + `label-mono` eyebrow aligned to the container's left edge.

## 7. Surface treatment

- **Radii:** 0 default · 2px inputs and small panels · full round only for node dots and tag pills. No rounded-xl SaaS cards.
- **Borders** do the work shadows normally do. Interactives transition `border` → `border-strong` on hover/focus.
- **Shadows:** none by default; elevation = surface tone step + border. Single exception: soft ambient shadow allowed behind the final CTA panel in light mode.
- **Blueprint layer (optional):** 1px grid lines, 6% alpha, 96px pitch — permitted behind HERO and SERVICES only.

## 8. Core components (visual spec)

### Buttons
| Variant | Spec |
|---|---|
| Primary | azure fill (dark: `azure` + navy text · light: `azure-deep` + white text), `label-mono`, h-12 px-6, radius 2px; hover `azure-hover`; active scale .98 |
| Secondary | transparent, 1px `border-strong`, `text-hi`; hover: border → azure, fill unchanged |
| Link-arrow | `label-mono` + lucide `ArrowRight` (16px); arrow nudges 4px right on hover; underline draws in |

Sizes h-10 (sm) / h-12 (md) / h-14 (lg). Focus-visible everywhere: 2px azure ring, 2px offset.

### Links
Inline text links: 1px underline, 4px offset, `text-mid` → `text-hi` on hover; underline color shifts to azure.

### Panel (the only "card")
Bordered `surface`, radius 2px, padding 24–32, mono index top-right (`01`…). Hover: `border-strong` + translateY(-2px) over 200ms. No shadow, no blur, no icon-in-colored-circle.

### Stat
Hairline top rule → mono numeral at `display-lg` (tnum) → `label-mono` caption below.

### Tag
Full-round outline pill, mono 11px, `text-mid`.

## 9. Iconography & imagery

- Icons: `lucide-react` only — 1.5px stroke, 16/20/24px, `currentColor`. No emoji.
- No stock photography in v1. Visual weight comes from the 3D stage, typography, and SVG diagrams drawn in the hairline style (1px strokes in `text-mid`, azure reserved for active paths).

## 10. Breakpoints & responsiveness

Tailwind defaults: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

Contracts: 3D quality tier drops below `lg` (see `3d-system.md` §8); pinned chapters shorten below `md` (see `animation-system.md` §11); magnetic hover and pointer parallax only under `(pointer: fine)`; grids collapse 12 → 4 columns.

## 11. Motion tokens

| Token | Value | Use |
|---|---|---|
| `instant` | 120ms | State feedback |
| `fast` | 200ms | Hovers, borders |
| `base` | 320ms | Component transitions |
| `slow` | 600ms | Section-level reveals |
| `scrub` | scroll-bound | Camera and chapter timelines |

Easing: default `out-expo` = `cubic-bezier(0.16, 1, 0.3, 1)`; camera moves use `in-out` = `cubic-bezier(0.83, 0, 0.17, 1)`.

## 12. Visual hierarchy & resilience

| Tier | Elements | Rule |
|---|---|---|
| PRIMARY | Typography, composition, brand mark, messaging | The business message must be fully understood from these alone |
| SECONDARY | Motion, 3D (Q-Orbit), interaction | Reinforces the message; never carries unique information |
| TERTIARY | Decorative detail: blueprint grid, micro-labels, readout chrome | Atmosphere; removable without loss |

- **No-WebGL guarantee (locked):** the site must look and work premium with the 3D canvas disabled — every chapter has a designed static composition (its end-state) and all narrative exists as text/DOM. Verified by testing with WebGL off.
- The stage never overpowers the message: quiet-support tiers, stillness beats (`animation-system.md` §1) and the azure ≤5% discipline exist for this reason.

## 13. Accessibility floor

WCAG AA minimum. Visible focus on every interactive element. The 3D canvas is `aria-hidden` with a visually-hidden narrative equivalent per chapter. Reduced-motion contract in `animation-system.md` §12.
