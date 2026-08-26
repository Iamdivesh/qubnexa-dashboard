# Design References — Resources for the QubNexa Site

Researched Aug 2026, benchmarked against MotionSites (curated premium AI web-design prompts with exact stack/timing/color specs). Focus: dark navy + azure palette, cinematic video hero, liquid-glass UI, GSAP/Lenis scroll choreography, Three.js scenes.

## 1. Top 10 Resources (ranked)

1. **Aceternity UI** — https://ui.aceternity.com
   Free copy-paste React/Tailwind/Motion components, shadcn-compatible, heavy on hero and background effects. Highest density of "award-caliber" primitives anywhere free: Spotlight, Meteors, Aurora/Beams backgrounds, Bento grids, 3D card effects, infinite moving cards, sticky-scroll reveals. Directly serves: **hero, services cards, bento feature grid, CTA section**.

2. **21st.dev** — https://21st.dev
   12,000+ shadcn-convention components ("Real code, ready to ship"), curated from top designers, plus full landing-page templates and an Inspiration gallery. Ships an MCP server so agents can pull components into a codebase directly. Serves: **everywhere** — navbars, heroes, pricing, footers; best single MotionSites substitute for prompt-style "copy this exact pattern" workflow.

3. **Magic UI** — https://magicui.design
   Open-source animated component library for "design engineers" — Framer Motion + Tailwind + TailwindCSS-based effects: Dot/Orb/Metor patterns, Animated Beam (great for connection diagrams), Marquee, Number Ticker, Blur Fade text reveals. Serves: **hero micro-effects, stats counters, logo marquees, scroll-in reveals**.

4. **Codrops (Tympanus)** — https://tympanus.net/codrops
   The canonical source of advanced motion techniques with fully explained demos: WebGL distortion image transitions, smooth-scroll page transitions, menu hover effects, Lenis/GSAP integrations. Every QubNexa "cinematic" ambition has probably been prototyped here first. Serves: **scroll choreography, page transitions, video/WebGL hero treatments**.

5. **React Bits** — https://reactbits.dev
   Open-source animated/interactive components (46K+ GitHub stars), now with an MCP index for agent consumption. Standouts for a dark techy site: Light Tunnel & particle backgrounds, Halftone Reveal, Masked Heading text animations, Molten glass effects. Serves: **section transitions, headings, ambient backgrounds behind the video hero**.

6. **Godly** — https://godly.website (now godly.design)
   Curated gallery of genuinely interesting web/app/UI work — much higher signal-to-noise than Awwwards' long tail. Filterable by style. Best place to study how real dark-mode agency sites compose video heroes + glass panels. Serves: **overall art direction reference**.

7. **GSAP Showcase + docs demos** — https://gsap.com/showcase/
   Official showcase of production sites built with GSAP, plus ScrollTrigger/Lenis demo pens. The ScrollTrigger docs' example section is effectively a pattern library for pinning, scrubbing, and split-text reveals. Serves: **scroll choreography spec source** (steal exact scrub/pin timings).

8. **cult/ui** — https://www.cult-ui.com
   Motion-rich niche shadcn components (open source, MIT). Smaller library but unusual pieces: multi-step forms with motion, AI/agent-pattern components (fitting for a dev agency's AI-services pitch), animated dialogs/sheets. Serves: **services detail sections, contact flow**.

9. **v0 Community** — https://v0.app/community
   Gallery of thousands of generated Next.js/Tailwind/shadcn pages you can open, remix, and read the source of. Quality varies wildly, but searching for "dark agency", "glassmorphism hero", "video landing" surfaces complete layouts worth mining for structure. Serves: **full-page layout scaffolds**.

10. **tweakcn** — https://tweakcn.com
    Theme editor/generator for shadcn/ui with real-time preview and export of CSS variables. Use it to lock QubNexa's navy/azure palette into a consistent token set that every component library above consumes. Serves: **design tokens across all sections**.

Also noted (honest verdicts):
- **Awwwards** (awwwards.com/websites/sites_of_the_day/) — still the bar for agency-site references (e.g., "Dark Burn"–style creative-agency sites), but browse with intent; most winners are unbuildable one-offs.
- **HeroUI** (heroui.com) — solid polished React+Tailwind kit, but its aesthetic is SaaS-clean rather than cinematic; skip unless you need form/dashboard polish.
- **daisyUI** — theme-based CSS classes; too generic for award-caliber work.
- **shadcn/ui itself** (ui.shadcn.com) — not inspiration, it's the substrate; pair with tweakcn.
- **Lovable showcase / launch pages** (lovable.dev) — useful only as "what AI builds by default" counter-examples; quality below MotionSites bar.
- **land-book.com / lapa.ninja / minimal.gallery / siteinspire / dark.design** — fine for mood boards; land-book and lapa skew marketing-generic, siteinspire skews editorial-minimal. Godly covers this lane better for your use case.

## 2. Specific Patterns Worth Copying (Top 5)

### Aceternity UI
- **Spotlight card** → Services rows: mouse-tracking radial glow following cursor over each service tile (azure spotlight on navy).
- **Aurora Background / Sparkles** → subtle ambience behind the CTA band so it doesn't die after the hero.
- **Bento Grid + 3D Card Effect** → portfolio/case-study grid; tilt-on-hover with glare.
- **Infinite Moving Cards** → client-logo or testimonial marquee.
- **Sticky Scroll Reveal** → process/methodology section.

### 21st.dev
- **Shimmer Button / Magic Button** → primary CTA in hero and footer.
- **Number Ticker** → stats band (projects shipped, years, NPS).
- **Blur Fade list reveals** → staggered service-card entrance (60–80ms per-item delay).
- Their **Landing templates** are the closest thing to MotionSites prompts with real source code attached — reverse-engineer their spacing rhythm (usually `py-24`/`md:py-32` bands).

### Magic UI
- **Animated Beam** → architecture/integration diagrams (perfect for a dev agency "how we build" diagram).
- **Marquee (dual-direction)** → tech-stack strip under the hero.
- **Border Beam** → liquid-glass panels: animated light tracing the glass edge.
- **Meteors / Dot Pattern** → depth layer behind hero copy.

### Codrops
- **WebGL Distortion Image Transition / hover effects** → portfolio thumbnails; also the standard technique for making a poster-frame video hero feel interactive before play.
- **Smooth scrolling + pinned section demos (Lenis + GSAP ScrollTrigger)** → their demos give literal scrub values (`scrub: 1`, pin end `+=100%`) to copy.
- **Menu overlay animations (full-screen reveal, staggered links)** → navbar mobile/desktop menu.

### React Bits
- **Masked Heading text animation** → hero H1 reveal (clip-path wipe, ~800ms, expo.out).
- **Light Tunnel / particle backgrounds** → fallback ambience when the video hero hasn't loaded (critical for LCP).
- **Halftone Reveal** → section-divider moments.

### (bonus) tweakcn + shadcn
- Define tokens once: navy `#0B1220`-family base, azure `#3B82F6`/`#38BDF8` accents, export via tweakcn, then every library above stays on-palette automatically.

## 3. Prompt-Writing Lessons (distilled from MotionSites, 21st.dev templates, Aceternity, Codrops)

The libraries whose prompts/code produce premium output share recurring spec patterns:

1. **Name the easing, not "smooth".** Winners always specify: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for entrances, `power4.inOut` / `expo.inOut` (GSAP) for section transitions, `spring(stiffness: 100, damping: 20)` (Framer Motion) for hovers.
2. **Exact millisecond durations.** Premium specs use concrete numbers: heading reveal 700–900ms, card stagger 60–80ms per item, hover scale 200–300ms, marquee 20–40s loop, background drift 8–15s. Vague "slow/fast" produces generic output.
3. **Hex colors + token names together.** e.g. `bg #0B1220, accent #38BDF8, text #F8FAFC @ 80% opacity`. Also specify opacity layers for glass: `backdrop-blur-xl bg-white/[0.06] border border-white/[0.12]`.
4. **Font stack with weights and tracking.** Not just "Inter" but `Inter, weights 400/600, tracking-tight (-0.02em) on display sizes`; often paired display/mono (e.g., Space Grotesk + JetBrains Mono for a dev agency).
5. **Stack pinned per component.** Every good prompt declares: framework (Next.js App Router), styling (Tailwind v4), animation lib (Framer Motion vs GSAP — not both ad hoc), scroll (Lenis), and 3D (Three.js/R3F) up front.
6. **Choreography beats decoration.** The best specs describe a *timeline*: "video fades from blur-8 to sharp over 1200ms while H1 mask-wipes at 400ms offset; nav slides down last." Sequenced entrances > simultaneous fades.
7. **Interaction states enumerated.** Hover, focus-visible, reduced-motion (`prefers-reduced-motion` fallback), and loading state specified explicitly — this is what separates shipped-quality from demo-quality output.
8. **One signature effect per section.** Top libraries never stack five effects; they pick one hero gesture (spotlight, beam, distortion) and keep everything else quiet.
