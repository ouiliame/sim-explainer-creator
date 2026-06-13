# Scene 2 — `the-machine`  ·  archetype: **assemble + camera ease**

Source: `../source/scenes/TheMachineScene.tsx`, `../source/layout.ts`,
`../source/data.ts`, `../source/scenes/_rig.tsx`, `../source/scenes/_glyphs.tsx`.

This scene introduces the workflow. Scene 1 asked "who fills the table in?";
scene 2 answers "this machine does" — and it does so by *drawing the canvas in
front of you*, block by block, edge by edge, in flow order. It's the longest
assembly in the build and the one with the most named blocks, so it's worth
studying as the template for any "here is the workflow" scene.

---

## What this scene is for

One idea: **the machine is one ordinary Sim workflow**, living under the table,
that reads left to right. Apollo finds companies → the Enrich container fans the
work out per company → the Table block writes the results back. The scene's whole
job is to assemble that chain cleanly enough that the viewer reads it as *a
pipeline*, not a pile of boxes — and to do it while the camera pulls back so the
table from scene 1 glides up into a band at the top and the machine claims the
space below.

Note what it deliberately is *not*: it is not a run. Nothing lights up, nothing
resolves, no value fills. The blocks arrive idle. The run is scenes 4–7; this
scene is just the static schematic.

## What it looks like

The camera eases out from the table-hero framing to the home framing. As it
settles, the table rises into the top band and the lower two-thirds of the frame
opens up. Into that space the machine draws itself, left to right:

- **Apollo** (yellow chip) fades in, with rows `Operation | Search Organizations`
  and `Employees | 50–500`.
- An **edge draws** from Apollo's right handle toward the container.
- The **Enrich container** fades in — a yellow `Split` chip + the word "Enrich",
  an inner `Start` pill, and one lane: **Data Enrichment** (purple) →
  **Personalize** (green) → **Instantly** (white chip).
- The **three inner edges** draw together, wiring Start → Data Enrichment →
  Personalize → Instantly.
- A second **edge draws** out of the container.
- The **Table block** (green) fades in last, with rows
  `Operation | Batch Insert Rows`, `Table | outbound`, `Rows | <parallel.results>`.

Then the whole machine holds, idle, under the still-empty table.

## The real decisions

### The camera move is the only thing that moves the table

```ts
const camM = ramp(t, 0.2, 2.4, EASING.inOut);
const cam = camMix(CAM_TABLE, CAM_ALL, camM);
```

The table "glides to the top band" — but read the code: nothing about the table
changes. `camMix` interpolates the camera from `CAM_TABLE` (px=center, py=table
center, s=0.86) to `CAM_ALL` (px=center, py=*midpoint of table and chain*,
s=0.62) over 0.2→2.4s with `EASING.inOut`. The table's stage coordinates are
fixed in `layout.ts` and never touched. What looks like the table sliding up is
the camera's `py` moving *down* the stage to recenter on the whole set piece, and
its `s` zooming *out* to fit the chain.

> *"Why is that the right way to do it — why not animate the table's `y`?"* This
> is style lesson #4: never teleport (or even re-lay-out) a persistent element. If
> you animated the table's position, you'd have to keep that animated position
> consistent across every later scene, and any mismatch is a jump on the cut. By
> making it a *camera* move over fixed geometry, the table's stage position is the
> same in scene 1, 2, 3, …, 8. The only thing that ever differs between scenes is
> `cam` and state props. The set piece is immovable; the camera is the only
> traveler. That single discipline is why this 146-second video never once jumps.
>
> *"Why `EASING.inOut` on the camera but `EASING.out` on the fades?"* Camera moves
> and transforms get `inOut` (ease in *and* out — they accelerate from rest and
> decelerate to rest, which is how a real camera or a real pan feels). Entrances
> get `out` (they're already "arriving," so they only need to decelerate). Exits
> get `in`. This is the series' fixed easing grammar; obeying it is half of what
> makes motion read as composed rather than random.

### Assembly runs *after* the camera mostly settles, in strict flow order

```ts
const apolloIn  = ramp(t, 2.6, 3.2, EASING.out);   // block  (out)
const edge1P    = ramp(t, 3.3, 4.0, EASING.inOut);  // edge   (inOut)
const contIn    = ramp(t, 4.1, 4.8, EASING.out);    // block
const laneIn    = ramp(t, 5.1, 5.8, EASING.out);    // lane (3 blocks together)
const laneEdgeP = ramp(t, 5.9, 6.7, EASING.inOut);  // 3 inner edges together
const edge2P    = ramp(t, 7.0, 7.7, EASING.inOut);  // edge
const wbIn      = ramp(t, 7.7, 8.4, EASING.out);    // block
```

Two things to internalize here.

**The cadence alternates block-fade / edge-draw.** A block *fades* (opacity ramp,
`EASING.out`); then an edge *draws* (its `progress` ramps 0→1, `EASING.inOut`,
which extends the line from source toward target); then the next block fades.
This alternation is what makes it read as *someone drawing a canvas* rather than a
slideshow of finished boxes. The edges literally grow between the blocks they
connect — `SimEdgePath` takes a `progress` prop and renders a partial path — so
you watch the wire reach out and land on the next handle before that block
arrives.

> *"Why does the camera finish (2.4) before the first block starts (2.6)?"* Same
> separation-of-ideas rule as scene 1's selection. The camera move is one idea
> ("the desk opens up"); the assembly is another ("the machine draws itself").
> Overlapping them would mean blocks fading in *while the whole frame is still
> zooming*, which reads as chaos — your eye can't track a box that's both
> appearing and sliding. Let the frame settle, then build into the settled frame.
> The 0.2s gap (2.4 → 2.6) is the breath between the two.

**The container's whole interior arrives as one unit.** `laneIn` drives all three
inner blocks' opacity together (Data Enrichment, Personalize, Instantly all get
`{opacity: laneIn}`), and `laneEdgeP` draws all three inner edges together. They
do *not* stagger.

> *"Why assemble Apollo → container → Table one at a time, but the lane all at
> once?"* Because the chain (Apollo, container, Table) is a **sequence** — three
> distinct stages of the pipeline, and you want each one to register as its own
> step, so they come one at a time. The lane inside the container is a single
> **unit of work** — "enrich, personalize, send" is one conceptual move (process
> a lead), and later it's the thing that gets duplicated six times. Staggering its
> internals would over-emphasize them at the moment you're still establishing the
> outer chain. So the grain of the staggering matches the grain of the concept:
> outer stages step, inner unit arrives whole.

### Every block's color and glyph is ported from the registry — not chosen

This is the craft rule that separates a real Sim explainer from a mock-up.
`_glyphs.tsx` carries the verified colors and brand glyphs, each with provenance:

| block | color | source | glyph |
|---|---|---|---|
| Apollo | `#EBF212` | `apollo.ts` | ApolloIcon (icons.tsx:4714), black star-burst |
| Enrich container | `#FEE12B` | `parallel-config.ts` | Lucide `SplitIcon`, dark |
| Data Enrichment | `#9333EA` | `enrichment.ts` | three sparkles, white |
| Personalize | `var(--brand)` `#33C482` | `agent.ts` | AgentGlyphW |
| Instantly | `#FFFFFF` | `instantly.ts` | InstantlyIcon (blue circle + lightning) |
| Table | `#10B981` | `table.ts` | TableIcon (icons.tsx:6487), white grid |

The glyph fills obey the product's chip-luminance rule: a dark glyph on a light
chip (Apollo's black star on yellow, the Split icon's dark stroke on yellow), a
white/colored glyph on a dark chip (Enrichment's white sparkles on purple, the
Table's white grid on green). You don't pick these. You read them out of
`_reference/sim`'s block registry and port them verbatim, because the whole point
is that this video reads as *the same world* as the product — the registry wins
every color and title conflict.

## The values, and where they come from

Every row text is registry- or docs-verbatim, sourced in `data.ts`:

| block | rows | grounding |
|---|---|---|
| Apollo | `Operation \| Search Organizations` · `Employees \| 50–500` | `apollo.ts` op `apollo_organization_search`; the employee-range filter is the docs' `organization_num_employees_ranges`, humanized |
| Data Enrichment | `Operation \| Build Full Contact` · `Input \| <parallel.currentItem>` | `enrichment.ts` build-full-contact template; the per-instance input is the parallel's current item |
| Personalize | `Messages \| Opener for <enrich.contact>` · `Model \| claude-sonnet-4.6` | `agent.ts`; the model string is an authored display label |
| Instantly | `Operation \| Create Lead` · `Campaign \| Q3 Outbound` | `instantly.ts` op `instantly_create_lead`; campaign label authored |
| Table | `Operation \| Batch Insert Rows` · `Table \| outbound` · `Rows \| <parallel.results>` | `table.ts` op `batch_insert_rows`; `<parallel.results>` is the docs' canonical after-the-parallel aggregation (parallel.mdx) |

One value deserves a flag for honesty's sake. The Personalize block shows
`Model | claude-sonnet-4.6` — written with a **dot**. That's an authored display
label, the human-readable form of the model name as it would appear in a block
editor's model picker, and it's fine on a demo surface. Just know that the
*canonical model id* (the string the API actually takes) is `claude-sonnet-4-6`,
with hyphens — "Claude Sonnet 4.6" is a real model, and `claude-sonnet-4.6` is
the friendly spelling of it, not the id. If you ever promote this from a label to
something a viewer is meant to copy into code, switch to the hyphenated id. As a
caption that says "an agent runs here," the dotted display name reads correctly.

The "Rows" row is a **declared divergence**: the registry's editor label is
"Rows Data (Array of JSON)", abbreviated to "Rows" for canvas legibility. That's
recorded in `data.ts` and the script — when you simplify a real label for the
frame, you declare it, you don't pretend.

## The animation, beat by beat

- **Camera ease** `ramp(0.2, 2.4, inOut)` via `camMix(CAM_TABLE, CAM_ALL)` — the
  pull-back that finishes scene 1's half-move. Table glides to the top band as a
  pure camera effect.
- **Apollo fade** `2.6 → 3.2` (`out`). First block, ~0.6s.
- **Edge 1 draw** `3.3 → 4.0` (`inOut`). The wire reaches from Apollo to the
  container's left handle. ~0.1s gap after Apollo settles.
- **Container fade** `4.1 → 4.8` (`out`). The box, header, and Start pill arrive.
- **Lane fade** `5.1 → 5.8` (`out`). All three inner blocks together. ~0.3s gap
  after the container — slightly longer, because the container needs to read as
  "a box" for a beat before its contents populate.
- **Inner edges draw** `5.9 → 6.7` (`inOut`). Start→DE, DE→Personalize,
  Personalize→Instantly, all together.
- **Edge 2 draw** `7.0 → 7.7` (`inOut`). Out of the container toward the Table
  block.
- **Table block fade** `7.7 → 8.4` (`out`). The writer arrives last — it's the
  last stage of the pipeline, so it's the last thing drawn.
- **Hold** `8.4 → end` (the scene runs to ~24.5s local after VO). The idle
  machine sits while narration walks the blocks.

> *"Why ~0.6–0.8s per step and not faster?"* Each step is a thing the viewer has
> to actually look at and name (this is Apollo, this is the container, this is the
> writer). Sub-half-second steps would blur the sequence into one event. Slower
> than ~0.8s and the eight-step assembly drags past where attention holds. The
> ~0.7s step is the sweet spot for "I can see each piece land."
>
> *The honest caveat:* the choreography notes call this hold the build's weakest
> — the assembly finishes at 8.4s but the narration keeps naming blocks for ~16
> more seconds against a completely static frame, so the picture finishes
> revealing long before the words catch up. The fix would be to *re-pace the
> assembly to span the narrated window* (stretch the ramps so each block lands as
> the VO names it) rather than front-loading it. Worth remembering when you build
> a long assembly scene: pace the reveal to the narration, don't race ahead of it.

## How to think about the whole scene

1. *How does the table become a band so the machine has room?* A camera ease, not
   a layout change → the set piece never moves.
2. *In what order does a pipeline assemble?* Flow order, left to right, Apollo
   first, writer last → the geography teaches the dataflow.
3. *How do I make it read as drawing, not a slideshow?* Alternate block-fade with
   edge-draw → the wires reach out and land between the boxes.
4. *Outer stages vs the inner unit?* Stages step one at a time; the lane arrives
   whole → staggering grain matches conceptual grain.
5. *Where do the colors/glyphs/labels come from?* The registry and docs, ported
   verbatim → same world as the product.

## Exit state (what scene 3 inherits)

`machine fully assembled and idle · all blocks at full opacity, `state: none` ·
both outer edges drawn (progress 1) · all three inner edges drawn · fan = 0 (one
lane) · table still empty · camera at CAM_ALL (0.62×)`. Scene 3 opens on this
exact frame and dims the world to 0.35 while sliding the editor card in — no
camera move, no re-layout. The boundary is identical.
