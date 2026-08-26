# VEX + LUMINA Rebuild Spec — Light Theme / Thread Motif (v1, static-frame pass)

Companion to `theme-light.md`. Structural DNA of the dark VEX/LUMINA is kept; the media/3D layer is replaced by The Thread rendered in SVG. No production code in this pass — frames live in `preview/`.

## 1. VEX — Hero (chapter 01), rebuilt on light tokens

Layout (unchanged DNA): full-bleed stage, bottom-anchored 2-col grid, left-anchored stacked display headline.

- **Stage:** `bg #F7F9FC` with faint dot-grid (`#0B1E3D @ 0.06`, 24px pitch). Center-right: **Thread opening state** as inline SVG — a sand-tinted halo circle (~420px), an ink stroke (3px) drawing right from a solid azure dot; a single pulse travels the stroke (`2400ms` loop). This replaces the video/3D hero. ONE signature effect.
- **Navbar:** liquid-glass pill, light formula: `backdrop-blur-xl bg-white/[0.55] border-[#0B1E3D]/[0.10] rounded-full`; brand left, mono anchors center, "Book an intro call" accent button right. Enters last (staged fade 3).
- **Eyebrow:** `AI | AUTOMATION | INNOVATION` mono chips on `--sand-tint` with `--sand-deep` text.
- **Headline:** three stacked lines "Build Better. / Automate Smarter. / Grow Faster." — char stagger `30ms`/char within a `500ms` window per line, each char from `translateX(-18px)`, `ease-out-expo`.
- **Supporting line:** ink @ 70%, fade-up `800ms` at offset.
- **CTAs:** primary accent fill "Book an intro call"; secondary ghost ink-border "Explore capabilities". Staged fades `800/1200/1400ms` for headline→supporting→CTA+nav sequence.
- **Tag card:** glass chip bottom-left ("System online" status card re-formulated light: white/[0.55] glass, azure status dot).
- Reduced motion: all elements visible instantly, Thread drawn statically.

## 2. LUMINA — Footer (chapter 09), motif resolution beat

Keep the floating rounded panel + link architecture. Changes:

- **Backdrop:** page base washes into a very light sand tint (`--sand-tint`) so the footer reads as warm closure, not another cold band.
- **Top edge:** the panel's top border IS the resolved Thread — an SVG line running the panel's full width that rises, loops once through a closed ring (echoing chapter 06's ring), and returns to the edge, ending in the original azure dot sitting inside the loop. Static draw-in on scroll entry (`800ms ease-out-expo`); one slow pulse afterward.
- **Panel:** raised glass formula (`white/[0.72]`, border ink/[0.12], larger shadow), rounded-3xl.
- **Content architecture unchanged:** brand + promise column ("Build Better. Automate Smarter. Grow Faster."), nav links, contact CTA ("Book an intro call"), legal row.
- The dot inside the closed loop is the same dot that opened VEX — closing the loop opened in chapter 01.

## 3. Frames delivered

- `preview/vex-frame.html` — composed static hero frame
- `preview/lumina-frame.html` — composed static footer frame
- `preview/motif-map.html` — Thread's 9 evolution states, labeled strip

No changes to `app/`, `components/`, or `globals.css`.
