# Experience Map — the homepage as one continuous narrative

Version 0.3 — Final Design Intelligence · Q-Orbit foundation approved · copy pending content phase
Positioning (locked): **QubNexa connects digital systems, automation and AI to help businesses operate better and grow faster.** Promise: **Build Better. Automate Smarter. Grow Faster.**
Value chain the page must communicate, in order: **Digital foundations → Connected systems → Automation → Intelligence → Growth.**
The homepage is one scroll-driven story. Q-Orbit (`3d-system.md`) is not an animated logo — it is a visual representation of how QubNexa connects business systems: it boots in the hero, separates into capabilities, connects into workflows, gains intelligence, expands into channels, and converges back into the mark. Motion mechanics: `animation-system.md`; visual tokens: `design-system.md`.

## 1. Global model

| Layer | Z | Content |
|---|---|---|
| Stage | 0 | Fixed full-viewport WebGL canvas (Q-Orbit); transparent over page background |
| Content | 10 | Scrolling chapters |
| Chrome | 20 | Nav, chapter rail, progress |

- **Nav:** official mark + "QubNexa" (interim: text brand in Geist until brand exports arrive — see `design-system.md` §5); mono anchors Build / Automate / Intelligence / Services / Process; primary button "Book an intro call". Below `md`: mark + "Book a call" only; anchors live in the footer. No sticky CTA bars.
- **Chapter rail** (fixed left, ≥lg): mono ticks `01`–`09`, active tick azure + current chapter name. Decorative (`aria-hidden`).
- **Scroll engine:** Lenis + GSAP ScrollTrigger; pins publish `{chapter, local}` to the store. No React state updates during scroll.
- **Conversion spine (locked):** the primary CTA reads "Book an intro call" word-for-word everywhere; max one primary CTA per viewport.

## 2. Chapter map

```
01 HERO ──▶ 02 BUILD ──▶ 03 AUTOMATE ──▶ 04 INTELLIGENCE ──▶ 05 GROW
                 ▲                                           │
                 │                                           ▼
                 └─────────── 06 CONNECTED SYSTEMS ◀─────────┘
                                   │
         FINAL CTA ◀── 08 PROCESS ◀── 07 SERVICES
              │
            footer
```

Acts: **System** (01–06, pinned cinematic: boot → separate → connect → decide → expand → converge) → **Evidence** (07–08, native flow) → **Conversion** (09).

Chapter meanings (locked):
- **BUILD** = digital foundations — the infrastructure businesses operate on (websites, web apps, mobile apps, SaaS, custom software).
- **AUTOMATE** = connected business systems — CRM, sales, marketing, operations, data, finance, support working together; repetitive manual work removed.
- **INTELLIGENCE** = the AI layer inside automation. Locked copy rule: **"Automation executes the workflow. AI makes it intelligent."** AI is a layer, not a standalone product story.
- **GROW** = business outcomes — capacity, speed, experience. No invented metrics.

## 3. Chapters

### 01 HERO — the system comes online
- **Visitor goal:** understand what QubNexa does within 10 seconds; feel premium immediately.
- **Business goal:** credibility; route to "Book an intro call" or into the narrative.
- **Visual concept:** a system booting. Sequence: dark field → pixels appear → pixels converge → ribbon ring forms → blade locks → mark recognizable → brand typography → headline → CTAs (full timing: `animation-system.md` §4). Layout: eyebrow "AI | AUTOMATION | INNOVATION"; headline stacked `display-xl` — Build Better. / Automate Smarter. / Grow Faster. — left-anchored; mark core right-of-center; one supporting line; permitted radial vignette. Nothing else — the hero stays light.
- **Working supporting copy (content phase final):** "QubNexa builds the digital systems your business runs on, automates the workflows that slow it down, and applies AI where it creates practical value."
- **Scroll behavior:** boot plays on load (≤2.4s desktop / ≤1.5s mobile; instant under reduced motion). First ~30vh of scroll = ignition: system pulse + particle drift — teaching that scroll drives transformation.
- **Interaction:** pointer parallax ±1.5° (`pointer: fine` only); magnetic CTAs.
- **Transition to next:** continuous camera drift into BUILD — which deliberately reverses the boot the visitor just watched (separation mirrors convergence).
- **CTA:** primary "Book an intro call" (→ 09) · secondary "Explore capabilities" (→ 02).

### 02 BUILD — digital foundations
- **Visitor goal:** see what QubNexa builds: websites, web applications, mobile applications, SaaS, custom software.
- **Business goal:** establish that QubNexa builds operating infrastructure — not "just a website".
- **Visual concept:** pinned. The mark separates into capability modules — working set of four clusters: Websites / Applications / SaaS / Custom software (final set at content phase). Each cluster: wireframe assembly + mono callout connected by hairline leaders.
- **Scroll behavior:** pin ~220vh; scrub separates clusters along distinct vectors while copy blocks swap per track.
- **Interaction:** hovering/focusing a track highlights its cluster; others dim ~40%.
- **Transition to next:** clusters stay separated — AUTOMATE wires them into business systems.
- **CTA:** per-track link-arrow → SERVICES rows.

### 03 AUTOMATE — connected business systems
- **Visitor goal:** grasp that QubNexa connects existing tools — CRM, sales, marketing, operations, data, finance, support — and removes repetitive manual work.
- **Business goal:** differentiate on systems-integration depth, not tool names.
- **Visual concept:** pinned. Business-system nodes connect through staged workflow paths. Choreography reads as a pipeline: **input → processing → action → outcome** (INTELLIGENCE then inserts the decision step — the arc across 03+04 reads input → processing → intelligence → action → outcome). Working example flows (final paths may stay abstract, but stage order must be legible):
  - Website → Lead → CRM → Qualification → Sales → Follow-up → Analytics
  - Form → Database → Workflow → Notification → CRM → Reporting
  A fixed mono "pipeline readout" (DOM) labels each stage as it completes.
- **Scroll behavior:** pin ~250vh; scrub draws path groups in stage order; each completed path ends with a node acknowledgment blink.
- **Interaction:** hovering a path accelerates its pulse; a keyboard-focusable list mirrors the sequence.
- **Transition to next:** the workflow stays lit — INTELLIGENCE attaches to it.
- **CTA:** secondary "How we work" → 08 PROCESS.

### 04 INTELLIGENCE — the AI layer (short, deliberate beat)
- **Visitor goal:** understand where AI fits — the layer that makes workflows intelligent, not a buzzword cloud.
- **Business goal:** own the "AI where it creates practical value" position; set up the AI services row.
- **Visual concept:** short pin. Decision/action nodes attach onto the existing workflow paths at decision points. Motion signature "decide, then act": a node gathers (brief contraction) → fires a sky pulse outward. Capabilities named in supporting rows (working set): AI agents, AI workflows, AI assistants, document intelligence, classification & extraction, decision support, natural-language interfaces.
- **Scroll behavior:** pin ~140vh; scrub attaches nodes sequentially; each performs one decide-then-act cycle.
- **Interaction:** minimal by design — hovering a node replays its cycle.
- **Transition to next:** the intelligent workflow holds; GROW expands the system outward.
- **CTA:** none inline — the beat stays pure.
- **Design-language rule (locked):** execution pulses = azure with a deterministic rhythm; intelligence pulses = sky with a decide-then-act rhythm. The distinction repeats in SERVICES rows and DOM diagrams.

### 05 GROW — business outcomes
- **Visitor goal:** see growth as engineered: connected channels around one operating core, producing business outcomes.
- **Business goal:** reposition from builder to growth partner.
- **Visual concept:** pinned. Channel pixels arrange around the operating core on a ring echoing the mark's own ring — Marketing, Sales, CRM, Operations, Customer, Data, AI (working set). This is a **channel network around a common operating core — not astronomy**. Outcome rows appear alongside as qualitative statements (working set): faster operations · fewer manual tasks · better customer experience · more efficient teams · scalable processes · better use of data · increased capacity. **No invented numbers** — stat components are reserved for real client data (none available yet).
- **Scroll behavior:** pin ~180vh; scrub arranges channels in business order; outcome rows reveal in DOM.
- **Interaction:** channel tags (DOM) hover/tap-sync with their nodes.
- **Transition to next:** ring holds, then begins converging inward — CONNECTED SYSTEMS arrives.
- **CTA:** tertiary link-arrow "See how we work" → 08 PROCESS.

### 06 CONNECTED SYSTEMS — thesis
- **Visitor goal:** receive the core promise — everything QubNexa builds reconnects into one operating system for the business.
- **Business goal:** brand memorability peak; the visual answer to "what does QubNexa do?".
- **Visual concept:** short pin. Modules, workflows, intelligence nodes and channels converge; the mark reassembles — ring closes, blade docks, pixels lock into their constellation. Centered `display-lg`: "Not services. A connected system." (working copy).
- **Scroll behavior:** pin ~120vh; convergence scrub, then hold (designed stillness).
- **Interaction:** none — rest beat.
- **Transition to next:** stage recedes to quiet support; content leads.
- **CTA:** none.

### 07 SERVICES — the index
- **Visitor goal:** scan services and self-identify relevance.
- **Business goal:** qualification depth; each row answers what/problem/does/get.
- **Visual concept:** editorial numbered rows with hairline dividers (working set, final at content phase): Web platforms / Applications / SaaS & custom software / Business automation / AI integration / Data & integrations. Stage in quiet-support tier (~25% opacity).
- **Content model per row (locked):** **1) What it is · 2) The problem it solves · 3) What QubNexa does · 4) What the business gets.** Technology names appear only as supporting metadata (mono, muted) — never as the headline. Framing example: not "n8n / Make / Zapier" but "Connect your tools and automate repetitive business workflows."
- **Scroll behavior:** native flow; rows reveal on entry.
- **Interaction:** row click/Enter expands detail (accordion); expanding a row sends a pulse to the corresponding Q-Orbit element (quiet-support acknowledgment); open row's index turns azure.
- **Transition to next:** natural flow into PROCESS.
- **CTA:** per-row "Discuss this service" → 09 with service preselected.

### 08 PROCESS — how QubNexa works (trust lives here)
- **Visitor goal:** learn the engagement model; answer "why should I trust the process?" without fabricated proof.
- **Business goal:** de-risk contact; pre-frame the sale.
- **Visual concept:** horizontal 4-step timeline, path drawing across during scroll; vertical line below `md`:
  - **DISCOVER** — understand the business, workflow and bottlenecks. *(uncertainty → clarity)*
  - **ARCHITECT** — design the right digital system and automation architecture. *(clarity → system)*
  - **BUILD** — implement, integrate and test. *(system → execution)*
  - **SCALE** — measure, improve and expand. *(execution → growth)*
  Below the timeline: principles band "Why QubNexa" (merged from the former standalone WHY chapter): Connected thinking / Senior precision / Velocity with control / Measured outcomes (working set) — one line each.
- **Scroll behavior:** near-native; timeline path scrub-draws (short top-anchored scrub).
- **Interaction:** steps highlight sequentially; hover expands detail.
- **Transition to next:** the completed path points toward the re-forming mark.
- **CTA:** primary "Book an intro call".

### 09 FINAL CTA — book the call
- **Visitor goal:** act with zero uncertainty about what happens next.
- **Business goal:** convert.
- **Visual concept:** full convergence — face-on mark lock behind a closing `display-xl` restatement of the tagline. Compact form (name, email, company, interest select, message) or calendar embed (decided at build).
- **Expectation micro-copy (answers "what happens if I contact?"):** three mono steps — Intro call → Scope → Proposal (working copy).
- **Scroll behavior:** final ~100vh; slow dolly settles; form reveals last.
- **Interaction:** inline validation; submit success = animated check path.
- **Transition to next:** minimal footer (lockup, mono links, legal).
- **CTA:** primary submit + mailto fallback.

## 4. Conversion architecture

Progressive question → chapter map:

| Visitor question | Answered in |
|---|---|
| What does QubNexa do? | 01 HERO (+ 06 thesis) |
| Is it relevant to my business? | 02–05 capability/system chapters, 07 SERVICES |
| What can QubNexa build? | 02 BUILD, 07 SERVICES |
| What can be automated? | 03 AUTOMATE, 07 SERVICES |
| Where does AI fit? | 04 INTELLIGENCE, 07 SERVICES |
| How does QubNexa work? | 08 PROCESS |
| Why trust the process? | 08 PROCESS principles band — clarity, not fabricated proof |
| What happens if I contact? | 09 FINAL CTA expectation steps |

Proof rule (locked): no fake testimonials, client logos, metrics, or case studies. Where proof is unavailable, the system substitutes clarity and process transparency.

## 5. Scroll-length budget (planning targets, ±20%)

| Chapter | Budget |
|---|---|
| 01 HERO | 100vh + 30vh runway |
| 02 BUILD | pin ~220vh |
| 03 AUTOMATE | pin ~250vh |
| 04 INTELLIGENCE | pin ~140vh |
| 05 GROW | pin ~180vh |
| 06 CONNECTED | pin ~120vh |
| 07 SERVICES | natural flow ~280vh |
| 08 PROCESS | ~160vh |
| 09 FINAL CTA | 100vh |

Total ≈ 16 screens. Trim rule: shorten pins before cutting chapters. Final budgets set against real content.

## 6. Transition inventory

| From → To | Mechanism |
|---|---|
| HERO → BUILD | continuous camera drift into pin; boot reverses |
| BUILD → AUTOMATE | pin release; clusters persist |
| AUTOMATE → INTELLIGENCE | pin release; workflow persists; decision nodes attach |
| INTELLIGENCE → GROW | pin release; channels arrange around the core |
| GROW → CONNECTED | pre-unpin inward convergence begins |
| CONNECTED → SERVICES | stage recedes to quiet support |
| SERVICES → PROCESS | native flow; pulse acknowledgments on service rows |
| PROCESS → FINAL CTA | stage wakes; final convergence |

Mobile and reduced-motion deltas: `animation-system.md` §11–12.

---
**Changelog v0.3:** INTELLIGENCE inserted as its own beat (04); former WHY QUBNEXA merged into PROCESS as the principles band; former OUTCOMES merged into GROW as qualitative outcomes (no invented metrics); chapters renumbered 01–09; conversion question map added; AUTOMATE pipeline choreography and GROW channel network specified.
