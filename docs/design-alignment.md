# Design alignment — VEX / Mainframe / LUMINA

## Why the previous hero fell short

Auditing `components/sections/Hero.tsx` + `app/globals.css` against the VEX
spec (`pastes/paste_4_094236.txt`) and Mainframe spec (`paste_3_094040.txt`):

1. **Video was dimmed twice** — `brightness(0.92)` filter on the video plus a
   heavy `.hero-video-stage::after` overlay (radial vignette at 50% opacity +
   a 85%-opacity bottom linear gradient). The VEX spec says *NO overlay, no
   dimming whatsoever*. The result read as "video behind smoked glass", not
   "raw cinematic footage".
2. **Character animation timing/easing wrong.** Spec: translateX(-18px) → 0,
   500ms transition, 30ms char delay, 200ms initial delay — horizontal slide.
   We had yPercent:115 rise, 800ms duration, 22ms stagger gated behind
   `bootDuration(threeStore.tier) * 0.72`, i.e. an entirely different feel and
   a variable start time.
3. **Layout not bottom-anchored as a 2-col grid.** The glass tag chip
   ("Technology. Automation. Growth.") was missing entirely from the right
   column — instead we stacked four service pills under the buttons, pushing
   content up-center rather than anchoring to the viewport bottom like VEX.
4. **Staged fade choreography off-spec.** VEX: subheading 800ms/1000ms,
   buttons 1200ms/1000ms, tag card 1400ms/1000ms. Ours bundled everything
   into one staggered GSAP tween at ~95% of boot duration.

## Motionsites.ai patterns (premium bar)

From studying the library's top hero prompts (VEX, Lumenvox Atelier,
Wealth Video Hero, Liquid Glass Agency): raw full-screen background video,
large editorial Inter type with tight tracking (-0.04em), strictly staged
entrance choreography in ms-precise delays, liquid-glass chrome built with
backdrop-blur + inset highlight + masked gradient border (`::before` +
mask-composite), and content anchored to the viewport bottom over the video.

## Spec implemented

- Inter via `next/font` (already wired) — kept.
- Raw full-screen video, object-cover, no filter, no overlay scrim.
- Liquid-glass pill navbar using the exact LUMINA `.liquid-glass` CSS.
- Character-by-character headline: 30ms charDelay, 500ms transitions,
  translateX(-18px), line-aware delay `(line*len + i) * 30 + 200`.
- Bottom-anchored `lg:grid lg:grid-cols-2 lg:items-end`; right column holds
  the glass tag card ("Technology. Automation. Growth.") fading at 1400ms.
- Subheading fade 800ms/1000ms; buttons 1200ms/1000ms.
- Mouse-scrub seek kept (Mainframe pattern), desktop only.

## LUMINA footer

Liquid-glass rounded-3xl panel floating over the persistent video stage
(mt-32 md:mt-64), framer-motion entrance {opacity:0,y:40}→{1,0} dur 1
delay .4 easeOut; 12-col grid (5 = brand/description, 7 = three link
columns); bottom bar border-t white/10 with © line and lucide social icons.
