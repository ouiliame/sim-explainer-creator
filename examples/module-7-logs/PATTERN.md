# PATTERN — the run record & the backward trace

*One-page distillation. This is the move module-7-logs (v2 take) exists to
teach, and the one worth stealing for any "what did this run actually do?" or
"where did this value come from?" explainer.*

---

## The move, in one sentence

**A run leaves a complete written record — every block's status, timing, and
typed output, in run order — and you debug by reading that record *backwards*
from a value to the block that produced it.**

There are really three nested moves, and they build on each other:

1. **The record lands entry-per-block, synced to completion.** The log is a
   list of rows, one per block, each carrying that block's real
   duration (`Start 32ms · Triage 12.2s · BuildRow 115ms · LogTicket 111ms`).
   The rows reveal *in run order*, top to bottom, the way the run actually
   filled them in — so the list reads as the run writing itself down.
2. **The selected block's output is a typed tree.** Pick a row and the panel
   beside it shows that block's `OutputBundle`: named fields, each with a type
   badge (`content: string`, `tokens: object`, `toolCalls: array`), the array
   expanding to the three real tool calls with their per-call timings. The
   record kept *everything the block did*, not just its headline result.
3. **Trace a value backward.** Pick any value in the record and walk it to its
   source: LogTicket wrote `<buildRow.result>` → so select BuildRow, whose
   input was `<triage.content>` → select Triage, whose prompt read
   `<start.message>` → select Start, the origin. The selection (a blue ring)
   walks the chain **right-to-left**, each reference naming the block that
   produced it, until you reach the source. The value's entire ancestry was in
   the record the whole time.

That third move is the thesis. The first two exist to make it legible: you
can't trace backward through a record until the record is on screen as a
concrete, typed, ordered object.

---

## Why it lands (the mechanism)

**The record is built from the same run the viewer just watched.** Scene 1 runs
the chain *once* — the real charged-twice message crosses Start → Triage →
BuildRow → LogTicket and it's over in a blink, looking instant from outside.
Then the record rises and replays that same run *as data*. The emotional beat
is "the run looked instant, but it wrote all of this down." That only works
because there is exactly **one run** in the whole video and the record
describes *it* — not a fresh, illustrative run conjured for the panel.

**Every number is real.** Durations, token counts, tool-call timings, the
resolved values — all trace to one run artifact (`triage-run.md`). The "12.2s"
on Triage's row isn't a dramatized figure; it's where the real time went, which
is exactly the question a log answers. Honesty is the whole point of a record;
a record full of invented numbers teaches the opposite of the lesson.

**The trace is told entirely in product vocabulary — zero words on screen.**
"This value came from that block" is said by a *reference resolving*: a
`ResolvedTag` showing `<buildRow.result>` blends from the tag form to the
literal value, and the blue selection ring moves to the named producer. No
arrow labeled "data flow," no caption "tracing backward." The product already
has a grammar for provenance (the `<block.field>` reference); the scene just
animates it.

**Two surfaces stay in sync.** The reference resolves in *both* the record
panel (below) and the block's own row on the chain (above) at the same instant,
and the block it points to lights up. Provenance is shown as a correspondence
between two views of the same fact, not narrated.

---

## How it's built

- **One persistent set piece, owned by `layout-v2.ts`.** The 4-block chain
  (real SimBlocks, scaled `0.86` as a unit) plus the `OutputBundle` record panel
  (scaled `1.62`, centered below). The chain glides from frame-center to the top
  **once** (scene 2) and never moves again; the panel is persistent scenes 2–5.
  Scenes pass *state props only* — selection mixes, reveal ramps, tab emphasis —
  never geometry.
- **`OutputBundle` is a verbatim port** of the docs' run-inspector miniature
  (`apps/docs/components/workflow-preview/output-bundle.tsx`): a Logs column
  (the per-block rows) beside an Output panel (the typed tree). Markup, metrics,
  type-badge colors copied 1:1, rendered native then scaled as a unit. You are
  never *designing* a record panel; you're configuring the one that ships.
- **Content comes from declarative builders** (`buildLogRows`, `triageTree`,
  and the per-block `*InputTree` functions in `_v2.tsx`). Each takes `0..1`
  mixes (`reveal`, `selected`, `highlight`, `resolve`, `glow`) so a scene reads
  as a table of frame-derived numbers, not imperative DOM.
- **Animatable everything, via widened types.** `OutputLogRow.selected` is
  `boolean | number` (so selection can ramp), `OutputNode.value` is a
  `ReactNode` (so a traced value can carry a `ResolvedTag` or glow),
  `inputTab: 0..1` blends the Output↔Input header emphasis. All additive,
  back-compat — the port still renders as the port at default props.
- **The panel outline is pinned.** `minBodyH` fixes the values-column height to
  the tallest tree (Triage's, ≈386px native) so when scene 4 dip-swaps small
  per-block trees in and out, the panel never changes shape. Continuity by
  construction.
- **The backward walk is five clamped `interpolate` moves** (`m1..m5`,
  Triage→LogTicket→BuildRow→Triage→Start→revert), and each per-row selection
  mix is a *difference* of adjacent moves (`selBuild = m2 - m3`) so exactly one
  row is ever selected — non-overlapping by arithmetic, not by luck. Only the
  active block's tree is mounted at a time (an `if/else if` ladder on the
  per-step opacities), so trees never stack.

---

## When to use it

Reach for this pattern when the video's job is **"make the invisible work of a
run inspectable"** — any topic where something ran, looked like a black box,
and the teaching point is *the system already recorded what happened, here's how
to read it*:

- run logs / observability / debugging ("trace backward from the symptom")
- data provenance / lineage ("where did this field come from?")
- agent tool-call traces ("what did it actually call, and how long did each
  take?")
- pipeline / DAG post-mortems

It is **not** the move for teaching what a block *is* (that's an anatomy aside)
or for showing a run *happen* (that's a single traversal). It's specifically the
post-hoc read: the run is over, the record is the object, and you walk it.

---

## The transferable rule

> **Run it once, then make the record the object.** Don't re-run for the
> inspector — replay the *same* run as data. Land the record entry-per-block in
> run order so the list reads as the run writing itself down; show the selected
> block's output as a typed tree so "the record kept everything" is literal; and
> trace provenance by letting the product's own reference (`<block.field>`)
> *resolve* — the blue ring walking to the named producer — so "this came from
> that" needs no caption. Every value on screen must be a real value from that
> one run, or the record is teaching a lie.
