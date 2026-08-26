# QubNexa Light Theme — Token Draft v1 (static-frame pass)

Dark theme retired. Light-dominant system: paper-blue base, deep ink-blue structure, brand-blue accent, one warm secondary so the palette doesn't read cold.

## 1. Palette rationale

- **Base `#F7F9FC`** — near-white with a cool blue cast; keeps the page airy while staying in the same hue family as the ink.
- **Ink `#0B1E3D`** — deep navy used as TEXT/STRUCTURE color on light ground (the old dark theme inverted). All borders, hairlines and glass panels are ink at low opacity instead of gray — this is what makes light-mode glass look designed rather than washed out.
- **Accent `#2F6FED`** — brand blue, saturated enough to hold against the pale base; reserved for CTAs, active states, and the motif's "energized" state.
- **Warm secondary Sand `#E4DAC6`** (with deep variant `#8A6D3B` for text-on-sand) — chosen because a pure blue-only light palette reads clinical/fintech-cold; sand is desaturated enough to stay quiet (it never competes with the blue) but warms chips, tags, the eyebrow band, and motif "human/workflow" nodes. It also echoes paper/blueprint culture: blueprint lines on warm paper.

## 2. Core tokens

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F7F9FC` | page base |
| `--bg-raised` | `#FFFFFF` | cards, glass panel fill base |
| `--ink` | `#0B1E3D` | headings, body text, structural SVG strokes |
| `--ink-70` | `#0B1E3D @ 0.70` | supporting copy |
| `--ink-50` | `#0B1E3D @ 0.50` | metadata, mono labels |
| `--ink-30` | `#0B1E3D @ 0.30` | hairline dividers |
| `--accent` | `#2F6FED` | CTA fill, links, active rail tick, motif energized stroke |
| `--accent-strong` | `#1E54C7` | hover/pressed CTA |
| `--accent-tint` | `#2F6FED @ 0.10` | chip backgrounds, focus rings |
| `--sand` | `#E4DAC6` | warm chip/tag fill, motif neutral nodes, section washes |
| `--sand-deep` | `#8A6D3B` | text on sand fills |
| `--sand-tint` | `#E4DAC6 @ 0.35` | subtle warm wash behind eyebrows/tags |
| `--grid-line` | `#0B1E3D @ 0.06` | faint background grid / dotted field |

## 3. Glass formula (inverted for light)

Old dark glass was white-on-navy. Light glass is **ink-on-paper**:

| Surface | Formula |
|---|---|
| Glass panel (nav pill, tag card) | `backdrop-blur-xl bg-[#FFFFFF]/[0.55] border border-[#0B1E3D]/[0.10] shadow-[0_8px_32px_rgba(11,30,61,0.08)]` |
| Glass panel raised (footer floating card) | `backdrop-blur-xl bg-[#FFFFFF]/[0.72] border border-[#0B1E3D]/[0.12] shadow-[0_16px_48px_rgba(11,30,61,0.12)]` |
| Hairline divider | `1px solid #0B1E3D @ 0.12` |
| Focus ring | `0 0 0 3px #2F6FED @ 0.25` |

## 4. Motion tokens

| Token | Value | Usage |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | all entrances |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | section/motif state transitions |
| `--dur-fast` | `200ms` | hovers, link color, button press |
| `--dur-med` | `500ms` | headline line slide-in |
| `--dur-reveal` | `800ms` | primary fade-ups, motif draw |
| `--dur-stagger-char` | `30ms` per char, total window `500ms`, from `translateX(-18px)` | hero char stagger |
| `--dur-stage-1/2/3` | `800ms` / `1200ms` / `1400ms` | staged fades (headline → supporting → CTAs/chrome) |
| `--dur-motif-pulse` | `2400ms` loop | thread pulse traveling along path |

## 5. The Motif — "The Thread"

One continuous line. In VEX it is a single dot emitting a short horizontal stroke — the system coming online, drawn in ink with an azure leading tip. It then evolves once per chapter:

| Ch | Chapter | Thread state |
|---|---|---|
| 01 | HERO (VEX) | dot + short stroke — ignition |
| 02 | BUILD | the stroke **separates** into parallel strands (foundations laid side by side) |
| 03 | AUTOMATE | strands get **connector bridges** — paths link between nodes |
| 04 | INTELLIGENCE | a decision node on the path **activates** (azure node + decide-then-act pulse ring) |
| 05 | GROW | the line **expands** outward into radiating branches (channels around core) |
| 06 | CONNECTED SYSTEMS | branches **converge** back into one line passing through a closed ring |
| 07 | SERVICES | the line becomes an **index** — ordered ticks/stops along a ruler line |
| 08 | PROCESS | the index ticks **sequence** into arrowed steps (discover → architect → build → scale) |
| 09 | LUMINA (footer) | the line **closes into itself** — a complete circuit/knot threading through the footer's top edge; the dot from chapter 01 sits inside the closed loop. Loop closed = story complete. |

Why it fits: QubNexa *connects* digital systems, automation and AI. A single unbroken line that separates, connects, activates, expands, converges, indexes, sequences and finally closes is literally the positioning drawn as one gesture. It replaces the retired Q-Orbit 3D mark with something renderable in pure SVG, cheap on LCP, and legible at every scale.

Rule: ONE signature effect per section — the Thread is that effect everywhere else stays quiet.
