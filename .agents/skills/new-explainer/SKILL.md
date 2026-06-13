---
name: new-explainer
description: Build a Sim explainer video from a topic — the full pipeline (concept → locked visual script → build → verify → narrate). Invoke whenever asked to make a new explainer video in this harness.
---

# Building a Sim explainer video

This is the pipeline. Follow it in order. The whole method is anchored on ONE
fully worked example — the **market-desk** video in `examples/market-desk/` —
which you will read completely (annotations AND code) before building anything.

## Before you write any code: read the entire sequence

Read these in order. Do not skim. The annotations explain *why*; the source
shows *exactly how* — you need both, and you should have the code open while
you read each annotation.

1. **`CLAUDE.md`** (repo root) — the contract and the hard rules.
2. **`docs/constraint-design.md`** — what's a fact you must honor vs. a taste
   call you make; why bad design happens and how the rules prevent it.
3. **`docs/market-desk-teardown.md`** — the algorithm a complete video reveals:
   the 4-layer code architecture, the front-half (concept → scene list), and
   the failure modes to avoid.
4. **The worked example, annotation + code together** — for each scene 1→9:
   - read `examples/market-desk/annotated/0N-<scene>.md` (the teaching), then
   - read the matching `examples/market-desk/source/scenes/<Scene>.tsx` it
     describes, plus the shared rig it drives.
   Also read, as a set: `source/script-v1.md` (the locked plan format),
   `source/layout.ts` (geometry), `source/data.ts` (content),
   `source/scenes/_rig.tsx` (the `<Stage/>` set piece), and
   `examples/market-desk/CHOREOGRAPHY.md` (motion taste with timing windows).
5. **`src/components/`** — the library you compose from. At minimum know
   `SimBlock`/`SimEdgePath`, `SimTable`, `OutputBundle`, `ChatPanel`, and the
   data-motion set (`WirePulse`, `ResolvedTag`, `DipSwap`, `Tag`, `CanvasDots`).
6. **Product truth** — `_reference/sim` (submodule). The block registry
   (`apps/sim/blocks/blocks/*.ts`) and the docs' authored examples
   (`apps/docs/components/workflow-preview/examples.ts`) are where every
   on-screen value and color comes from.

You are imitating market-desk's *decision style*: compose real components,
ground every value, one set piece, frame-derived motion, honest mechanism.

## The 4-layer code architecture (every video is built this way)

market-desk is four roles, and "building" is composition + timing, never
drawing. Mirror this exactly:

- **`layout.ts` = geometry (where).** Pure constants + helpers (`cameraTo`,
  cell/lane helpers). Every number grounded (table metrics from the product
  grid; blocks from `SimBlock` at the series scale). Nothing relayouts.
- **`data.ts` = content (what).** Every on-screen string/value/tag/row, traced
  to the registry or the authored docs example. ⟨pending⟩ for anything you
  can't ground — and keep it off screen.
- **`scenes/_rig.tsx` = the set piece (`<Stage/>`).** Imports the library +
  geometry + content and assembles ONE component that takes frame-derived
  **state props** (visibility, dim, rings, pulses, fills, camera). The only
  locally-defined visuals are verbatim product-icon glyph ports and ported
  container/card asides — never a new surface.
- **`scenes/*.tsx` = state choreography (when).** Each scene is ~30–50 lines:
  read `frame`, compute `ramp()`/`pulseWindow()` numbers, render one `<Stage/>`
  with them. The scene draws nothing; it times the set piece's state.

## The pipeline

### 1. Concept (one idea, composed from real primitives)
State the one idea as "X is N Sim primitives composed: [the real blocks]." The
concept is which real blocks the topic needs, not a designed diagram. Pick the
nearest-shaped graded example to borrow the *scene arc* from (don't invent
structure).

### 2. Lock the script (`src/videos/<slug>/script-v1.md`)
Use market-desk's `script-v1.md` as the format: the one idea, the macro arc,
**run economy** (count traversals; prefer one run seen at multiple scales via
freeze-cuts), the **grounding** (every value → registry/docs, ⟨pending⟩ for
the rest), batch assumptions with swap costs, the **locked scene list** (each
beat → archetype + one-line intent), and the **continuity contract**
(per-boundary exit==enter state). The scene list is a contract; lock it before
code.

### 3. Build statics first
Write `layout.ts` (geometry), `data.ts` (content), then the `<Stage/>` rig
composing `src/components`. Get a still reading correctly before any motion.
Render stills and LOOK.

### 4. Add motion (thin scenes)
One file per scene: frame-derived state into `<Stage/>`. **For the common beats,
import the tuned vocabulary from `src/motion/timing.ts` — do NOT hand-author raw
`ramp(t, 2.2, 3.6)` numbers.** Those windows were harvested verbatim from the
exemplar and carry its rhythm by construction: `assembleStagger`, `cameraEase`,
`traverse`, `edgeHeat`, `chipRing`, `tagGlow`/`tagResolve`, `cellFill`/`cellTint`,
`selectionPulse`, `scrambleFinish` + `finishTimes`, `settleAt`. Reach for these
first; the smoothness is in the numbers, and you can't feel-tune them from a
still. Imitate the taste they encode: one focal element, sync = meaning (two
surfaces change on one event), edges draw on (never retract), pulses absorbed
before their destination, latched-settle holds (extend-safe for VO), beat-shape
variety across scenes.

### 5. Register + verify
Add `{id, Component, totalSeconds, scenes}` to `src/Root.tsx`. Then:
`bun run lint`; render stills at every beat + every boundary, OPEN them, fix by
measuring pixels; `bun scripts/verify-boundaries.ts <id>` (boundaries
structural-zero). Run the hard-rules checklist below on every scene.

### 6. Narrate last
Write `narration-v1.md` (one paragraph per scene, gold register: clean
condensed prose that explains what's on screen; never trailer voice, fragments,
or "not-X-but-Y" reversals), then
`bun scripts/vo-sync.ts --comp <id> --narration … --voice M5lSFiV8wa1aYNbadPOy`
and re-render. Audio is subordinate to visuals and re-timed to them.

## The hard-rules checklist (run on every scene)

- One set piece; scenes differ only in state props + camera. Nothing relayouts.
- Composed from `src/components` only. **If you defined a bordered surface
  inside a scene, you failed** — port it or use a shared component.
- Every on-screen value grounded; gaps ⟨pending⟩ and off screen.
- State in product vocabulary (rings/dims/tints), never a state word on screen.
- **Outputs only in real surfaces** (`OutputBundle` tree / a downstream-row
  resolution / the tag dropdown) — never floating chips.
- **Sim is not realtime** — a surface (table/board/log) changes ONLY when a
  block writes to it. No ambient ticking, no self-updating numbers.
- **Show the mechanism completely** — every effect has its drawn cause (a table
  fills ⇒ a Table write block ran; a value appears ⇒ a block produced it).
- **A container contains its children** — draw ONE lane; fan at runtime only;
  the container is sized so the fan never overflows its box.
- **Agent-behavior beats use the `ChatPanel` interior** — when the lesson is the
  agent deciding / calling a tool / producing output, show the chat beside the
  dimmed block (user message → thinking → tool-call rows synced same-frame to
  the chip rings → result → assistant bubble). Synchrony only, no connector
  lines.
- Frame-derived everything; the five motion primitives or `ramp`/`pulseWindow`
  with theme easings.

A video is done when it lints, every boundary pair is pixel-identical, you have
LOOKED at stills of every scene, and it is a faithful runnable Sim workflow —
not a vibes animation of an outcome.
