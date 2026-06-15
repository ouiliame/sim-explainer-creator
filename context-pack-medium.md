# Context Pack — SMALL (distilled moves only)

The reusable moves as one-page cards + the composition discipline. No scene-by-scene, no golds. Read all of it.

## ── COMPOSITION CRAFT ──
# Composition — the difference between a wireframe and a scene

Two frames of the same kind of content. One reads as a cheap wireframe; one reads
as the real product, alive and working. The components, colors, and values are not
the problem — **the composition is.** This is the lesson most worth internalizing,
because it's the one that separates "technically correct" from "good."

- `BAD-sparse-wireframe.png` — what to never ship.
- `GOOD-dense-composed.png` — the target.

Open both side by side before you read on.

---

## What makes the bad frame bad

It uses real components and grounded values, and it still looks amateur. Why:

1. **It's lopsided, and most of the frame is dead.** One small card floats mid-left;
   a column of cards is jammed against the right edge; the entire center and
   bottom-right are empty void. Two clusters shoved to opposite margins is not a
   composition — it's two things that happen to be on screen.
2. **The parts aren't connected — no mechanism crosses the frame.** The cards on the
   right just sit in a list. You don't *see* the thing on the left becoming them.
   There's no flow, no derivation, no causality drawn between the regions. A viewer
   can't read "this produces that" because nothing says so.
3. **Stray scaffolding.** Thin marker lines cut through the left card and read as a
   glitch. If a line doesn't carry meaning a viewer can name, it's noise — cut it.
4. **A text island in the void.** A block of mono config text is dumped into empty
   space at the bottom-left, a label to read rather than a thing to look at. Config
   belongs *inside a real block's config rows*, not floating on the canvas.

The sum: the frame is **sparse, unbalanced, disconnected, and littered.** It looks
like a layout that was started and abandoned.

## What makes the good frame good

1. **It's banded and full.** A complete workflow runs across the top of the frame; a
   row of live work fills the bottom; a results surface sits to the side. Every
   region of the frame is populated and deliberate. There is no large dead quadrant.
2. **The whole machine is visible and working at once.** You see the trigger, the
   agent, the *parallel container with three real lanes inside it*, three live phone
   conversations at different stages, and the table they write to — all in one read.
   The frame is a money shot: the system caught mid-run, doing its actual job.
3. **The mechanism connects edge to edge.** Wires run from the workflow into the
   container; the container's lanes correspond to the three call panels below; the
   calls feed the table. Your eye can trace cause → effect across the entire frame.
4. **It's dense with authentic detail.** Real phone numbers, real message text,
   `<parallel.currentItem>`, waveforms, a parallel container with its real header.
   Density that is all *real product*, not filler — that's what makes it read alive.

---

## The discipline (apply this BEFORE you place anything)

Staging is a composition problem, not a "drop the components somewhere" problem.
Decide the frame's structure first:

- **Band the frame.** Most scenes resolve into 2–3 horizontal bands (e.g. the
  workflow chain across the top; the evidence of its work — panels, tables, chat —
  across the bottom). Place every element into a band. A single element floating
  alone in open space is the tell of a wireframe.
- **No dead quadrants.** Mentally quarter the frame. If a quarter is empty void with
  nothing doing work, the composition is unbalanced — either the focal cluster is too
  small (zoom in / scale up) or you're missing the supporting surface that belongs
  there (the table, the inspector, the chat). Fill it with *real work*, never filler.
- **Connect the mechanism across the frame.** If region A produces what region B
  shows, *draw the relationship* — a wire, a fan, a synchronized beat. Disconnected
  clusters read as a mood board. The viewer should be able to trace the causal path
  end to end.
- **Anchor the focal cluster.** One region is the subject of the moment; center or
  band it with weight. Everything else distributes around it for balance (hub-and-
  spoke, symmetric lanes, a banded grid) — never lopsided.
- **Density is real surfaces, not decoration.** Fill the frame by showing *more of the
  real system working* (more lanes mid-run, the table filling, the chat interior, the
  inspector tree) — not by adding boxes. If a region is sparse, the fix is usually
  "show the mechanism there," not "add a graphic."
- **Config lives in blocks; outputs live in surfaces.** Never float a text block of
  settings on the canvas — put it in a real block's config rows. Never float result
  chips — resolve them in a real surface. Loose text/chips on the background are the
  litter that makes a frame look unfinished.
- **Kill every line that isn't load-bearing.** Marker lines, helper guides, dev
  labels, an unlabeled stray shape — if a viewer can't name what it means, delete it.

The test, before you call a scene done: **could this frame be a screenshot of the
real product mid-run?** The good frame could. The bad frame obviously couldn't — and
the gap between them is composition, applied six times over.

# Archetype: "The Machine" — a workflow being a machine in action

This is the single most reusable composition for a **use-case explainer**, extracted
from `voice-agent` (read its `annotated/` + `source/` for the full build). It is the
frame that makes a viewer feel "this thing is *doing* something real, at scale." If
you're building a use-case and want the machine-in-action money shot, default to this.

Reference frame: `voice-agent` at full run — an outbound-call campaign. But the
template is topic-agnostic; the point is the **three regions and how they sync.**

## The layout — two bands that never touch

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAND — the workflow (simple, product-true, left→right)   │
│     Start → Agent(the campaign) → Parallel container          │
│            "do each"  { ONE inner lane: Act → Log outcome }    │
├──────────────────────────────────────────────────────────────┤
│  BOTTOM BAND — the aside (separate boxes, no edge crosses up)  │
│                                                                │
│   ┌──────┐ ┌──────┐ ┌──────┐            ┌──────────────────┐   │
│   │ act  │ │ act  │ │ act  │            │  STATE TABLE     │   │
│   │ #1   │ │ #2   │ │ #3   │            │  (grows a row    │   │
│   │ live │ │ live │ │ live │            │   per outcome)   │   │
│   └──────┘ └──────┘ └──────┘            └──────────────────┘   │
│   activity visualization (bottom-LEFT)   state (bottom-RIGHT)  │
└──────────────────────────────────────────────────────────────┘
```

- **Top band — the workflow, kept SIMPLE.** Trigger → one Agent block (the "campaign"
  / the thing that decides) → a **Parallel container** holding exactly ONE inner lane
  (the act + a Table write "log outcome"). At runtime the container fans the lane into
  N ghost instances *inside its box* (never overflowing — `CONT_H` derives from the
  fan stack). Product-true, on one axis. Do not make the workflow elaborate; its job
  is to be the legible *cause*, not the spectacle.
- **Bottom-left — the activity visualization.** This is where "something is happening."
  N real surfaces showing the agent's **real-world action** mid-flight — voice-agent
  uses `AgentPhone` call panels (live conversation bubbles + waveform + status stamp),
  **de-phased** so no two change on the same frame (the de-phasing *is* the liveness).
  Swap this surface for your topic's action (see "porting" below).
- **Bottom-right — the state table.** The real `SimTable` of outcomes, which **grows
  one row at a time** as each instance's Log-outcome block writes. It is honest:
  it only ever contains rows that have landed (a table can't show a row no block wrote).

## The load-bearing idea: "N surfaces, one event"

When one instance finishes, **multiple honest views of that single event fire on the
same frame, with no connector lines** — synchrony carries the causality:

1. the activity panel resolves (waveform flatlines, dot goes green, a status stamps),
2. the inner lane pulses (control reaches the Log block),
3. the Log block blips ok (it ran),
4. a row drops into the state table (it wrote).

All four are driven from **one data source** (`LANES` → `TABLE_ROWS_DATA`) so the
panel and the table can never disagree. That single-source discipline is what makes
it read as one machine, not four animations.

## Why it excites

It satisfies the use-case design principles (`docs/design-principles-use-cases.md`) by
construction: the machine is busy (a fan of N), each block is a **higher-level
real-world activity** shown via its real surface (calls, not config rows), and the
whole frame is dense and banded (`COMPOSITION-DELTA.md`) — every region doing work,
the cause (top) and its effects (bottom) visible in one read.

## Porting it to a new topic

Map your topic onto the three slots:

- **The activity (bottom-left surface):** what real-world thing is the agent *doing*,
  many times? Calls → phone panels. Browsing/filling forms → `BrowserSession` +
  cursor. Drafting/sending messages → message-composer cards. Researching → `ChatPanel`
  + evidence trail. Pick the surface that shows the action mid-flight, and de-phase N
  of them. If a real surface doesn't exist yet, that's a component to port — never a
  hand-drawn box.
- **The outcome (bottom-right table):** what does each instance *produce*? One row per
  instance: the subject + the result columns (voice-agent: `to / outcome / status`).
- **The workflow (top):** trigger → the Agent that runs the activity → Parallel
  container with the `Act → Log outcome` lane. Ground every block/field/value in
  `docs/sim-block-schemas.md`.

The test of a good port: at the money shot, **could this be a screenshot of the real
product running that job?** If the bottom-left shows a real action happening N times,
the table is filling from it, and the workflow on top is the honest cause — yes.

## ── PATTERN CARDS ──

<!-- PATTERN: subworkflows -->
# CORE PATTERN — the fold / unfold (a workflow becomes a block)

This is the move that earns the Subworkflows video its place in the pack. Read
this card before the per-scene annotations; the scene files are where you watch
it work three times, but this is the mechanic in one page.

---

## What the move *is*

A **fold** takes a whole canvas — a full 1920×1080 frame, blocks, wires, dots,
everything — and shrinks it down until it lands exactly inside the footprint of
a single Workflow block, crossfading to the block as it arrives. The viewer
literally watches "this entire workflow" turn into "one step."

The **unfold** (its inverse) is the camera pushing *into* a block until the
child world that lives behind it resolves at full size underneath — "open this
step and there's a whole workflow inside."

It is one idea, run as a pair, and it is the entire thesis of the video made
physical: *a workflow can be a block; a block can be a workflow.* Containment is
not asserted with a label — it is performed with geometry.

The video uses it **three times**, and the third is the payoff:

1. **Scene 2 — fold.** The child canvas you just watched run folds into a
   Workflow block in a new parent. ("The thing you built is now a part.")
2. **Scenes 4–5 — unfold + re-fold.** (In the accepted cut this becomes the
   *expand-beneath* variant — see the note below — but the original take is a
   literal push through the block and a fold back.) The parent run parks on the
   block, you go inside, the child runs, the result folds back up.
3. **Scene 6 — the bookend fold.** The *parent itself* folds into a block one
   level up. Same move, same target slot, one level higher — proving the claim
   recurses. "Workflows all the way up."

The discipline that makes it a *move* and not three effects: **each use differs
from the previous in exactly one taught dimension.** Fold #1 teaches
containment. The unfold teaches the call mechanism. Fold #3 teaches composition.
The viewer's eye recognizes the geometry instantly each time, so all the
attention is free to land on the one new idea.

---

## How it's built — the code mechanic

The non-negotiable: **the move is a camera transform over an unchanged layout.
The world never re-layouts.** Folding does not rebuild the chain at block size;
it renders the chain at its normal `layout.ts` coordinates and wraps it in one
absolutely-positioned full-stage `<div>` whose `transform` is interpolated. The
blocks inside never know they're being folded — they sit at `blockX(i)` /
`CHAIN_Y` exactly as in every other scene.

```tsx
// the fold wrapper — scene 2, 5(v1), 6 are all this same shape
<div style={{
  position: "absolute", inset: 0,
  opacity: childOp,                              // crossfade out as it lands
  transform: foldTransform(SLOT_HEADER_CENTER, fold), // fold: 0..1
  transformOrigin: "0 0",
}}>
  <ChildChain .../>   {/* rendered at identity coordinates */}
</div>
```

The two camera functions both live in `layout.ts` and are pure functions of a
single 0→1 progress:

```ts
export const FOLD_K = BLOCK_W / STAGE_W;        // 375/1920 = 0.195 — fully folded scale

export const foldTransform = (target, p) => {
  const k  = 1 + (FOLD_K - 1) * p;              // 1 → 0.195
  const cx = CENTER_X + (target.x - CENTER_X) * p; // frame center → block center
  const cy = CENTER_Y + (target.y - CENTER_Y) * p;
  return `translate(${cx - k*CENTER_X}px, ${cy - k*CENTER_Y}px) scale(${k})`;
};

export const PUSH_Z = 5.4;                       // block fills frame at z=1
export const pushTransform = (z) => {
  const s  = 1 + (PUSH_Z - 1) * z;               // 1 → 5.4
  const tx = (CENTER_X - SLOT_BLOCK_CENTER.x * PUSH_Z) * z;
  const ty = (CENTER_Y - SLOT_BLOCK_CENTER.y * PUSH_Z) * z;
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};
```

Read `foldTransform` as: at `p=0` it is the identity (`k=1`, translate `0,0`);
at `p=1` the whole stage is scaled to `FOLD_K` about the frame's top-left and
shoved so that what *was* the frame center now sits on `target` — and because
the stage is now block-width wide, that means the folded world occupies the
block's footprint exactly. `pushTransform` is the same logic inverted: it scales
the stage *up* by `PUSH_Z` and translates so the block's center stays pinned in
frame, driving everything else off the edges until the block fills the screen.

### The four things that make it land

1. **One geometry, owned by `layout.ts`.** Child, parent, and outer chains all
   place their blocks at the same `blockX(i)` / `CHAIN_Y` slots. The fold/unfold
   always targets the **center slot** (`blockX(1)`, world-center `x = 960`),
   computed from the layout constants — never a magic number. Because every
   world is centered on the same slot, the move always reads as "this folds into
   *that* block."

2. **The fold targets a *computed* block center, sized to the block's row
   count.** A header-only block is 62px tall, a 2-row block is 162px tall, so
   there are two targets — `SLOT_HEADER_CENTER` (y=501) and `SLOT_BLOCK_CENTER`
   (y=551) — each `CHAIN_Y + simBlockHeight(n)/2`. You fold to the one that
   matches the block you're folding *into*, or the landing is off-center by half
   a block.

3. **The dot grid never folds.** `CanvasDots` is a single static background at
   identity in every scene. Only chains transform. This is what keeps fold
   boundaries pixel-clean — there are never dots-inside-dots, and the universal
   canvas reads as one continuous space across all three worlds.

4. **Crossfade timing is offset from the scale.** The world shrinks over the
   full window (`fold = c(0.5, 2.8)`) but its opacity only drops late
   (`childOp = 1 - c(1.8, 2.6)`) while the destination block fades in as the
   shrink completes (`blockOp = c(2.3, 2.9)`). You never see the world *pop* —
   it shrinks to near-block-size first, and only then dissolves into the real
   block that's resolving in the same spot. The two images are nearly registered
   at the moment of the swap, so the cut is invisible.

---

## The accepted-cut wrinkle (read this)

The literal push-through unfold (`pushTransform`, scene 4 v1) was **revised** by
the director into an *expand-beneath*: the parent chain glides up and **holds**
(the call visibly halted, ring live) while a container panel expands *downward*
from the Workflow block, and the child runs inside that panel. A solid stem from
the block's bottom edge to the panel header carries the containment ("this panel
IS that block's inside").

Why the revision is the better teach: a push-*through* implies you *leave* the
parent to see the child. But the parent run hasn't gone anywhere — it's parked,
waiting. Keeping the halted call on screen the whole time, with the child
running visibly beneath it, shows the *simultaneity* (parent paused, child
running) that the zoom-through hid. Both takes ship in the repo (v1 = the pure
move, v2 = the accepted teach), which is itself the lesson: **the move serves
the concept, and when a cleaner read exists, the move yields to it.** The fold
survives unchanged at the two ends (scene 2 in, scene 6 bookend); only the
middle unfold was traded for a containment panel that keeps both tiers visible.

---

## When to reach for it

Reach for the fold/unfold when your concept is **containment or composition** —
"this whole thing is one piece of that bigger thing," or "open this piece and
there's a whole thing inside." It is the right move when:

- The thing being contained is something the viewer has *already seen working*
  at full size (the fold then reads as "packaging a live thing," not minting an
  icon). Scene 1 exists entirely to earn scene 2's fold.
- You want to teach recursion/nesting. The bookend fold (the container becoming
  the contained) is the cleanest way to say "this goes all the way up" without a
  single number on screen.

Do **not** reach for it for ordinary scene transitions, for emphasis, or to
"add energy." It is a semantic move — it *means* containment. Used decoratively
it reads as a gimmick and burns the recognition you need for the beats that
matter.

---

## The transferable rule

> **Perform containment with one camera transform over one fixed geometry —
> never re-layout the world to fit the box.** Put every world's chain on the
> same `layout.ts` slots, target the *computed* center of the destination block,
> keep the background static so boundaries stay pixel-clean, and offset the
> crossfade from the scale so the swap is invisible. Then use the move sparingly
> and identically, varying only the one dimension each repetition is there to
> teach — so the geometry becomes a word the viewer learns to read, and every
> later use spends its novelty budget on the new idea instead of the motion.

<!-- PATTERN: custom-tools -->
# CORE PATTERN — Editor anatomy + capability lands on the table

**Source video:** `custom-tools` (5 scenes, ~49s · 66s with VO).
**Annotations:** `annotated/01..05` (scene-by-scene, market-desk depth).
**One-line shape:** orient on a running set piece → open the real product editor
and walk its two-part anatomy with the product's own selection color → pay the
result back as a chip that lands on the set piece → close by running it again and
letting the model choose.

This is the pattern for teaching **"a capability is two things, and once made it
becomes an ordinary object in your world."** It's the cleanest template in the
pack for any "how you build X, and what X becomes" video.

---

## The move

A configurable feature (here: a custom tool) is **two coordinated surfaces** —
something a reader consumes (the *schema* the model reads) and something that runs
(the *code*). The video:

1. **Opens on the known, running.** Reuse a set piece the audience already saw
   (the module-5 Triage chain) and run it, ringing the one chip that's secretly
   the thing the video is about. Capability-first, never a manufactured problem.
2. **Opens the real editor as an aside.** Dim the world; raise a *verbatim port*
   of the product modal (Create Agent Tool). Walk part one (schema) then part two
   (code) with the product's **text-selection color** painting the lines being
   discussed — in reading order. No arrows, no callouts, no captions.
3. **Syncs two surfaces to show an equivalence.** When two on-screen things are
   the same thing (a schema parameter and its code variable), drive *both* from
   one frame-derived value so they light together. The eye binds them; no arrow
   needed.
4. **Lands the capability on the table.** Press the real Save button, slide the
   editor out, undim the world — then a new **chip grows in by width** onto the
   agent's tool line. The abstract editor work becomes a concrete object in the
   set piece.
5. **Closes by bookending the open.** Run the same set piece again with one new
   variable: the new chip is present but the agent rings a *different*, relevant
   chip. Relevance is the model's call — shown by which chip rings, nothing else.

## How it's built (steal this)

- **One ported editor component, props-driven, never self-animating.**
  `ToolEditorPanel` is a verbatim port of the product modal — every metric
  (`max-w-[800px]`, `CODE_LINE_HEIGHT_PX=21`, the Prism palette for both themes)
  traced to a source file in its header comment. It exposes only numeric 0..1
  props (`tab`, `schemaReveal`, `codeReveal`, `glow`, `paramGlow`, `savePress`,
  `opacity`, `slide`); scenes own the clock. Three scenes share it and stay
  continuous because it's a pure function of its props.
- **Tab switch = morph-swap at constant height.** A `tab` 0→1 slides the
  product's 1px indicator (interpolating `left` + `width` between measured tab
  boxes) and crossfades schema↔code through the middle (`schemaOp/codeOp` windows).
  Editor heights are pre-computed so total body height is identical across tabs —
  the schema tab stays mounted at `opacity:0` to hold the height. One editor, two
  faces, never a teleport.
- **Selection-wash as the pointer.** A four-point `wash(a,b,c,d)` pulse
  (`[0,1,1,0]`, clamped) drives a selection-colored rectangle behind a tagged line
  or span (`glow[hl]`). Content and highlight share one data structure
  (`EditorLine` carries `hl` tags), so a wash can't drift off its line. One wash
  focal at a time; release before the next.
- **Two-surface sync.** `const w = wash(...)` feeds *both* `glow["p-city"]` (code
  variable) and `paramGlow.city` (the badge) — one value, two surfaces, identical
  timeline. Equivalence shown, not stated.
- **Chip-ring = tool call.** A chip's `ring` (0..1) renders an inset selection
  ring (`SimBlock.tsx`). Scope the ring *inside the owning block's live window* —
  that containment is the causal claim "the agent, mid-thought, reached for this
  tool." One chip rings = the agent chose one tool.
- **Chip lands by width-growth.** A revealing chip uses a **measured** natural
  width (`chipNaturalWidth`, `@remotion/layout-utils`) scaled by its reveal, so it
  expands into the chip row instead of popping into a slot. Then one selection
  pulse = "this is the new one."
- **Bookend by minimal difference.** Open and close are near-identical shots;
  change exactly one variable (the new chip, present-but-quiet) so the contrast is
  the only thing the eye lands on.

## When to use it

Reach for this pattern when the topic is **"here's a thing you make, and here's
what it becomes once made"** — and the thing has internal structure worth a tour:

- A custom tool (schema + code) → a chip on an agent.
- A connection/integration (config + auth) → a usable source.
- A schedule/trigger (condition + action) → a live arming on a workflow.
- Any "two-part artifact → it joins your existing world as an ordinary object."

It's *especially* strong when a prior video already put the destination object on
screen — then scene 1 can reuse that set piece and re-label, and scene 5 can
bookend it, for free.

Don't use it when the capability has no "lands somewhere" payoff (it's pure
config with no object that appears), or when there's no real artifact for the
editor content — the move depends on porting the *real* surface and using the
product's *own* example.

## The transferable rule

> **Port the surface, point with the product's own affordances, and pay the
> aside back into the set piece.** Teach internal structure by walking the real
> editor with the product's selection color (never arrows/captions); prove two
> things are the same by driving both from one value; and make the abstract work
> *land* as a concrete object that grows into the world the viewer already knows.
> The capability isn't explained — it's built in front of you and then set down
> on the table, where the model picks it up only when it's relevant.

<!-- PATTERN: loops -->
# CORE PATTERN — the container + the sequential-vs-simultaneous contrast

*The `loops` build (Iteration — Loop & Parallel). One container, two
schedules; the schedule is the only thing that changes, and that IS the
lesson.*

This is a teaching template for any topic shaped like **"the same machine,
two modes — and the difference between the modes is the whole point."** Loop
vs Parallel is the worked instance, but the move generalizes to any
A-vs-B-where-only-one-property-differs lesson (sync vs async, batch vs
stream, eager vs lazy, etc.).

---

## The move in one breath

Build **one container block** — a box that visibly *holds another block* and
has its own internal Start. Run its inside **sequentially** (one drawn body,
re-run once per item, with the current-item reference resolving to a new value
each pass), then show the **collected results array** as the payoff. Then
**morph the same container in place** to the other mode and run it
**simultaneously** (the inside fans into N instances that share one clock).
Hold *everything* equal across the two runs — same box, same inner block, same
items, same geometry, same resolution mechanic — so the **only** perceptible
difference is the schedule. The timing gap (sequential takes ~N× simultaneous)
is the lesson, drawn as motion.

## Why it's in the pack

It is the cleanest example in the library of **teaching a contrast by holding
everything constant except the one variable.** Most explainers teach two
concepts as two diagrams; this teaches them as *one object in two states*, so
the difference can't be misattributed to anything but the variable that
actually changed. The morph (scene 5) and the held-equal runs (scenes 3 & 6)
are the reusable machinery.

## How it's built

**One rig, one `phase`.** The entire video is a single set piece (`_rig.tsx`):
Start → container → inner Function → consumer, all geometry owned by
`layout.ts`. Every scene renders the *whole* rig and changes only state props.
A single value, `phase` (`0 = Loop … 1 = Parallel`), drives the entire
identity morph (chip color+glyph, container name, both reference tags) via
staggered sub-curves (`morphCurves`). Nothing ever re-layouts; boundaries are
pixel-identical by construction.

**The container anatomy** (ported from the product's container node):
- a faint-fill, 1px-border, 8px-radius **box** with `overflow: hidden` (the
  inner block is genuinely clipped inside);
- a **header bar** with a 24px colored chip (identity glyph) + the name — the
  *only* part the morph touches;
- an **internal Start pill** with its own source handle, sitting inside the
  body — the proof that *the inside is its own little workflow with its own
  beginning*. This is the load-bearing glyph: its re-firing is how iteration
  is shown;
- **centered outer handles** (at the box's vertical center), so the
  Start→container and container→consumer wires are dead straight on one axis.

**Sequential (Loop, scene 3):** one drawn Function block, re-run. A single set
of beat windows (pill blip → inner pulse → live → ok → resolve → revert) is
written relative to the *current pass's* start time `T`; a pass index `k`
computed from non-overlapping windows advances `0→1→2`, replaying the same
windows against each new `T`. The only thing that differs per pass is which
item `<loop.currentItem>` binds to. Non-overlap is structural — two passes
*cannot* co-exist. After the third pass the container's live ring **latches**
and holds across a freeze-cut into scene 4, where the loop exits **once** and
`<loop.results>` resolves in place to the collected array `["x","y","z"]`.

**The morph (scene 5):** `phase` eases `0→1` at constant geometry. Chip, name,
and tags crossfade; **the box, the inner Start pill, the inner Function, the
wires, and the items hold perfectly still.** The stillness is the proof that
"only the schedule changed."

**Simultaneous (Parallel, scene 6):** the inner Function **fans into three
instances** (`fan: 0→1→0`, self-contained within the scene). The inner Start
blips **once**, three pulses leave **together**, and all three instances are
driven by **one shared scalar clock** (`live`/`ok`/`resolve` are not arrays) —
synchrony is structural, can't drift. Each instance binds
`<parallel.currentItem>` to its own item; all resolve at once, finishing in
about the time **one** sequential pass took. The exit still fires once and
`<parallel.results>` still resolves to `["x","y","z"]` — collected by
position, so order survives concurrency.

**The bookend (scene 7):** reverse the morph (`phase: 1→0`) to land exactly on
the opening frame, then ease the camera back for a calm closing hold.

## The grammar that keeps it honest

- **Wires carry light, not cargo.** A pulse is a streak meaning "control
  passed"; it carries no value. Values **resolve in place** in block rows
  (`ResolvedTag`: tag glows → dips → becomes the value, keeping a faint blue
  provenance residue), never sliding down a wire. Data flows by *reference*,
  resolved at the point of use — drawing values on wires would teach a lie.
- **State in the product's own language:** blue live ring, green ok ring,
  selection ring while editing, ~0.35 dim for "not the focus." Never a word
  like "RUNNING" stamped on screen.
- **Iteration = repetition of beats**, not duplication of blocks. Sequence is
  one body re-run; simultaneity is N instances sharing one clock.
- **Every value is derivable, never invented.** The inner body is
  `return <currentItem>`, so the results array is mechanically the inputs in
  order — the viewer can predict it before it resolves.

## When to use it

Reach for this pattern when the topic is **two modes of one mechanism** and
the teaching goal is *the difference between the modes*:
- there is a single object/machine that can operate two (or more) ways;
- the ways differ in exactly one property (schedule, order, timing,
  strategy);
- the property itself isn't directly drawable (you can't draw "concurrency"),
  so it must be shown as *the consequence* of the change against an otherwise
  identical baseline.

Do **not** use it when the two things being compared are genuinely different
objects (then they deserve two diagrams), or when the lesson is about one
mode alone (then drop the contrast and just run it).

## The transferable rule

> **To teach that two things differ in one property, build ONE object, run it
> both ways, and hold everything else identical — same geometry, same parts,
> same data, same grammar. Morph between the modes in place (one driver value,
> reversible), so the viewer never loses the object. The single uncontrolled
> variable — and its visible consequence (here, sequential costs ~N× the time
> of simultaneous) — becomes the entire lesson, because it is the only thing
> that ever changed.**

Corollaries worth stealing wholesale:
- **One rig, state props only** → continuity is free, boundaries are exact.
- **One driver value for a morph** (`phase`) → the reverse is the same move
  backward; no un-morph code; pixel-true bookends.
- **Structural guarantees over careful timing:** compute a single
  current-index for sequence (overlap impossible) and a single shared clock
  for simultaneity (drift impossible) — the *claim* is true by construction.
- **The freeze-cut carry:** when one event spans two scenes, latch the one
  live state across the cut and revert everything else; the run reads as
  continuous, the boundary stays identical.
- **Make the cost felt before you show the saving:** deliberately let the slow
  mode take its full time, so the fast mode's saving lands as a measured
  contrast, not a claim.

<!-- PATTERN: branching -->
# PATTERN — the fork: exactly one branch fires, and *who picks*

The one move this video exists to teach. A workflow doesn't have to be a line.
It can **fork** — split into branches — and on every run **exactly one branch
fires.** The only open question is *who picks the branch*:

- a **Condition** picks by **rule** — no model, same data → same path; or
- a **Router** picks by **model** — it reads the meaning of the text and chooses.

The unpicked branch doesn't error, doesn't skip, doesn't run-and-discard. **It
never happens.** No log, no output, no cost. The whole video is that one fact,
shown from three angles: the fork's anatomy, its two deciders, and the run
record that proves the absence.

---

## The three things to steal

### 1. The two deciders are the *same fork* with one part swapped — and the swap is the lesson

Don't teach Condition and Router as two separate features. Teach them as two
answers to one question — *who picks the branch?* — over an identical fork.
Build them as **two states of one set piece** parameterized by a single number
(`phase`: 0 = Condition, 1 = Router), so swapping one for the other is a
continuous **morph**, not a cut. The morph reads as *editing one block*: header
crossfades (orange Condition `#FF752F`/conditional glyph → green Router
`#28C43F`/connect glyph), new rows (`Context`, `Model`) grow in at their exact
slot heights, branch rows relabel (`If`/`else` → named routes), and lanes glide
2→3. Driving the one `phase` backward replays the whole edit in reverse — so the
closing bookend costs nothing.

> **The rule-vs-model contrast is carried by TIME, not words.** The Condition's
> verdict lands ~0.3s after its tag resolves — instant, no model. The Router
> holds its live ring through a ~1.4s Model-row glow before any route fires — a
> visible beat of thought. Hold every *other* variable constant (camera grammar,
> lane-dim timing, verdict colors) so the *only* salient difference between the
> two runs is the held beat. That asymmetry teaches "one calls a model, the
> other doesn't" with no caption.

### 2. The one-branch-lights money beat — and the unpicked branch goes dark

On a run: the chosen branch row settles **green**, **its own handle fires blue**,
a pulse rides **its** edge to the destination, and the destination runs. Every
*other* lane dims to 0.35 — **at the exact moment the winning port fires, never
earlier.** (Dimming earlier would, in the Router run, leak the model's choice
before the model has decided.) Verdict vocabulary, fixed and wordless: **glow =
being checked · green = matched · 0.35 dim = not matched / not taken.** Never a
word, never a ✗.

Then prove the absence in the **run record**: five blocks on the canvas, **three
rows in the log** (Start · decider · the one chosen agent). The two missing rows
are the beat — hold a long stillness after the third row lands, waiting for a
fourth that never comes. *That* is "the branch not taken never ran."

### 3. Branch-row anatomy — the branch row IS the output port

This is the structural fact the whole video rests on, and it's a faithful port
of the product's `preview-block-node.tsx`:

- A Condition/Router renders its **branches as rows** (label left, value right,
  `-` when empty) — styled exactly like config rows.
- **Each branch row has its OWN source handle** at its right edge, vertically
  centered on the row.
- The **header source handle is suppressed** the instant branches exist:
  `showHeaderSource = !hideSourceHandle && !hasBranches`.
- Branches are checked **top-to-bottom, first true wins**; `else` is the
  fallback.

So the fork is **one block, not a junction**: the split is *configuration inside
the block*, and each branch is a labeled, independently-firing port. Teach it by
lighting **the branch handle before its edge draws** (cause before effect), and
by deriving the handle's Y and its edge's anchor from the **same** row-reveal
math (`simBlockItemCenterY`) so they stay pinned together even while the block
grows during the morph.

---

## How it's built

- **One set piece for all 7 scenes.** `<Fork phase={...} />` with Start →
  decider → destination lanes at fixed geometry (`layout.ts`). The decider
  **never moves** (a declared 15px deviation in favor of continuity). Scenes pass
  state props; nothing relayouts, ever.
- **Content is the docs' own examples, verbatim.** `CONDITION_ROUTE_WORKFLOW`
  (phase 0) and `ROUTER_TRIAGE_WORKFLOW` (phase 1), ×1.5. No invented values:
  the If tag resolves to the docs' own literal `'high'`; where a real payload is
  missing (Run B's non-high value, Run C's ticket text, log durations) the tag
  **glows without substituting** and the value is omitted, not fabricated.
- **The morph is sub-ranges of one `phase`** (`morphCurves`): header → labels →
  rows growing → lanes gliding → third lane arriving. Run forward in the swap
  scene, in reverse in the bookend. Rows grow via `revealStyle` (animate slot
  height, cancel the flex gap) so the block never pops; edges fade, never
  retract.
- **State via product language only:** blue live ring (running), green ok ring
  (done), the row glow/match/dim verdict composition, the active-row background
  for the chosen log row. One justified video-specific addition — verdict
  choreography on decider rows — is a row-scale composition of existing state
  language, not a new primitive.
- **The only cross-boundary carry in the whole video** is the camera lean shared
  by the *paired* Condition runs (scenes 2→3). The lone Router run keeps its own
  lean. Every other boundary frame is fully neutral.

---

## When to use this pattern

Reach for the fork move whenever the topic is **a decision that selects one of
several paths** — routing, triage, conditional branching, escalation, any
"if X do A, else do B" or "classify then dispatch." Use the **two-decider
swap** specifically when the product offers both a rule-based and a model-based
way to make the same choice, and the teaching goal is *when to use which*. The
spine — fork anatomy → rule decider → model decider → run-record proof → bookend
— generalizes to any "one block, two interchangeable strategies" comparison.

**Don't** use it for parallel fan-out (every branch runs), loops, or nested
branching — those are different shapes. This pattern's defining constraint is
*exactly one* branch fires.

---

## The transferable rule

> **Teach a choice as one shape with a swappable decider, and prove the choice
> by what *didn't* happen.** Make the alternatives two states of one set piece so
> the comparison is a continuous morph, not a cut. Carry the "rule vs model"
> distinction in *time* — instant verdict vs held think — not in words. Show the
> winner light and fire from its own port; dim the losers only at the instant the
> winner commits; then let the run record's *missing rows* prove the unpicked
> branch never ran. State is the product's own visual language — glow, green,
> dim, live ring — never a label, never a ✗.

<!-- PATTERN: module-7-logs -->
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

<!-- PATTERN: module-5-agents -->
# PATTERN — Agent anatomy & the ChatPanel interior

The distinctive move of Module 5. Steal this whenever a beat's lesson is
**what an agent is doing** — deciding, calling a tool, loading a skill,
producing an answer. Read this page first; the per-scene annotations are the
worked example.

---

## The move in one sentence

When a workflow's middle block is an **Agent**, you don't explain "it thinks"
with a word or a glow — you **open the chat it spun up**, beside the dimmed
chain, and play the turn: the resolved user message arrives → a thinking
indicator → tool-call rows that land **on the exact frame their chip rings
light up on the block** → tool results → the assistant's answer. The answer
never floats on the canvas; it resolves into the next block's row, and the
full record lives in an OutputBundle panel.

That's it. "Thinking" is made concrete as *an LLM call — a fresh chat with
your prompt, your data substituted in, your tools on the table.*

## Why it exists (the rejection that forced it)

The first agent cut ran the block as **exterior state only** — live ring,
think-hold, chip rings — with no view of the messages. The verdict: *"the
agent videos should show what's happening — we should see a chat show up of
the messages being passed, the agent thinking, doing tool calls (that
synchronize with the light ups), and the output."* A think-hold with nothing
visible is a closed box sitting exactly where the lesson lives. (Case 19.)

So the rule: **any beat whose lesson is the agent's behavior REQUIRES the
ChatPanel interior.** Exterior-only is allowed *only* when the agent is
scenery for some other beat.

## The three parts

### 1. Anatomy — the Agent block IS the configuration

Before any run, the Agent block reads as a filled-in form, in product
vocabulary, never captions:

- **Messages** row — `Classify: <start.message>` (the prompt, with a tag)
- **Model** row — `claude-sonnet-4-6`
- **Tools** row — chips: `Docs · CRM · Search` (the toolset on the table)
- **Skills** row — `support-playbook` (optional, revealed later)

The block is the same `SimBlock` component as every other block; "agent" is a
color (`BLOCK_COLORS.agent`) + glyph + the Tools/Skills rows. You configure it;
you never draw a bespoke "agent" widget.

### 2. The ChatPanel interior — the turn, played out

A real chat-styled panel (mirrors `apps/sim/app/chat/components/message`)
opens beside the dimmed block and plays an ordered item list, each item
rising in on its own frame-derived `reveal`:

```
user      →  "Classify and summarize: <start.message>"   (tag resolves here)
thinking  →  three pulsing dots
tool      →  customerLookup · alex.johnson@zengraph…   (pulsing → green check)
result    →  ZenGraph 3282 · Alex Johnson · active · $2M deal
tool      →  Knowledge · refund policy
result    →  0 results
assistant →  billing — double charge; escalate, loop in Jessica Liu
```

The panel is **content-agnostic** (`items: ChatItem[]`) — any video stages any
conversation. The kinds (`user / thinking / tool / result / assistant`) are
the closed grammar.

### 3. Synchrony, not connector lines — the load-bearing trick

Two links are carried **by simultaneity alone**, with no arrow drawn between
surfaces:

- **The Messages param ↔ the chat.** When the user bubble's `<start.message>`
  tag resolves to the real message, the block's Messages row glows and
  resolves to the **same text on the same frames**. That co-resolution *is*
  the sentence "the Messages param IS this chat's messages." No beam.
- **The tool call ↔ the chip.** When a `tool` row appears in the panel, the
  matching chip on the block's Tools row gets its selection **ring** on the
  same window, and releases when the tool's result lands. Tool-call row and
  chip ring share one timing window. That co-occurrence *is* "the agent chose
  this tool." No connector.

This is the precedent rule: **synchrony carries the link, never connector
lines.** Drawing an arrow from the bubble to the row would be the "diagram
annotation" look the whole project rejects. Two things lighting up together
reads as causation for free, and it survives at any zoom.

## How it's built (the mechanics worth copying)

- **One set piece, props express the scene.** `TriageChain` renders the whole
  chain every scene; scene 3 just dims it (`start.dim`, `response.dim`), keeps
  the agent's ring live (`mid.highlighted`), and overlays the panel. Continuity
  is structural — the 2→3 cut is pixel-identical because both render the same
  chain at the same geometry.
- **The held moment.** Scene 2 starts the run and *freezes* at the live ring
  (`agentLive = t >= 4.3`, no release). Scene 3 opens **inside that frozen
  frame** (`agentLive = t < 16.2`) and only releases the ring as the panel
  closes. One continuous run spans two scenes; the cut is invisible.
- **Co-resolution by shared values.** The same string —
  `"I was charged twice"` — is fed to both the block's `msgResolve` and the
  panel's `ResolvedTag value`, on overlapping `interpolate` windows. Identity
  of content + identity of timing = the link.
- **Chip ring = a window per tool.** `crmRing` / `docsRing` are
  `interpolate(t, [in, hold, hold, out], [0,1,1,0])` windows handed to the
  chip's `ring` prop; the same `t` windows gate the panel's `tool` reveal and
  `done`. Change one number, change both, or the sync breaks.
- **The thinking dots and tool "running" dot are frame-derived**, pulsed off a
  `phase = t * 0.9` sine — never a CSS animation.
- **Reveal-and-rise.** Every chat row uses `rowFade(r)` — opacity + a 10px
  `translateY` keyed to its `reveal`. One helper, every row.

## Outputs never float (the companion rule)

A block's output appears in **exactly one of three real surfaces**, never as
free-floating chips/pills on the canvas (Case 18 — *"these look disgusting"*):

1. the **OutputBundle** run-inspector tree, in a proper aside panel (scene 4:
   `logs` + `content` / `tokens` / `toolCalls`, the real numbers);
2. a **resolution into a downstream row** (`ResolvedTag` / `DipSwap` — the
   agent's words landing in Slack's Message row);
3. the product's own tag-dropdown surface.

Borrowing a real surface's *tokens* (badge colors) does not make a new surface
real. If a frame needs "what comes out of this block," the answer is a real
surface or a real consumer — not an annotation. (Tool chips on the Tools row
are exempt: that row *is* product UI.)

## When to use it

- **Use the full interior** when the lesson is the agent's behavior: it
  decides, calls a tool, loads a skill, or produces output.
- **Exterior-only (ring + chip rings, no panel)** is fine when the agent is
  *scenery* — present, but some other block is the lesson of that beat.
- **Never** a think-hold with nothing visible. That's the closed box that got
  rejected.

## The transferable rule

> **Show the agent's behavior from the inside, in the product's own chat
> surface, and link the parts by synchrony — never by drawing connectors.**
> The Messages param and the chat are one thing because they resolve together;
> the tool call and the chip are one thing because they light up together. The
> output lives in a real surface or a real consumer, never floating. Everything
> is one set piece with props; "thinking" is concretely an LLM call you can
> watch.

<!-- PATTERN: knowledge-base -->
# PATTERN — the knowledge grammar (chunk → retrieve → ground)

The distinctive move of the Knowledge Base module isn't a single set piece —
it's a **four-beat grammar** that teaches how retrieval actually works, in
causal order, with no words on screen for any of it:

> **A document splits into chunks → a query lights the relevant few → the
> retrieved few travel into the model's context → the answer is visibly built
> from them.**

If you're explaining anything where a system *looks something up before it
acts* — RAG, search-then-answer, "consult the docs," grounded answers — this
is the grammar to steal.

---

## The move, in four beats

| Beat | Scene | What the viewer sees | The claim it makes |
|---|---|---|---|
| **1. Split** | `chunking` | A still document; a line draws down; chunks unfold beneath it | The unit of search is the *piece*, not the file |
| **2. Retrieve** | `relevant-chunks` | A grid of 12 chunks; a query lights 3 (green glow), dims 9 (0.35) | Search returns *the right few from many*, scattered across sources |
| **3. Transfer** | `context-injection` | The 3 chunks fly from a stack into a panel labeled "model context" | Knowledge flows *into the model, before it answers* |
| **4. Ground** | `output` | Context (same 3 chunks) → model → a specific answer types out | The answer is *built from* those passages, not conjured |

The four scenes are annotated in full in `annotated/01`–`04`; the surrounding
13 scenes are mapped in `annotated/00-scene-map.md`.

## How the chunks light and move (the mechanical core)

Everything keys off four arrays in `layout.ts` — the single source of truth:

```ts
KB_CHUNKS            // 12 chunks, deliberately spanning 6 source docs
RELEVANT_CHUNK_INDICES = [1, 6, 10]   // scattered, NOT [0,1,2]
RERANKED_INDICES       = [6, 10, 1]   // order matters into context
CTX_SLOT_X / Y / PITCH                // where chunks land in the context panel
```

- **Lighting (beat 2)** is a `Highlight active={RELEVANT.has(i)}` over a fixed
  grid — relevant chunks glow `COLORS.active` green at opacity 1, the rest fall
  to the 0.35 dim. All twelve resolve *simultaneously* (which-match is a flat
  set; ordering is a separate later beat). No scanning beam — search is shown as
  its *outcome*, a state change, never an invented process animation.
- **Moving (beat 3)** is a single shared `travel` interpolation from
  staging-stack coordinates to `CTX_SLOT` coordinates. The start point is the
  *previous* scene's exit point and the end point is the *next* scene's rest
  point — both read from the same `layout.ts` constants — so the chunks appear
  to keep existing across both cuts and simply glide. The journey draws the
  pipeline's direction arrow; that's why it's a literal flight and not a fade.
- **Grounding (beat 4)** re-renders the *same* chunks at the *same* `CTX_SLOT`
  coordinates while the model and answer arrive around them. The answer is
  specific (`"Sales fell 14% QoQ…"`) and resolves the exact opening query. The
  persistence of the specific source chunks beside the building answer is what
  makes "grounded" demonstrable rather than asserted.

## Why it's built this way (the rules underneath)

- **Introduce the atom before the chemistry.** You can't show a chunk being
  *selected* until the viewer has seen a chunk *exist*. Beat 1 does nothing but
  establish the unit — and keeps the source document *still* so chunks read as
  derived-from, not replacing.
- **Many before few.** The selection only means something against a visible
  grid of twelve. Hold the un-selected "many" for a beat, then light the "few."
  Dim, never hide, the losers — the contrast *is* the lesson.
- **Scatter the winners, span the sources.** Relevant indices are `1, 6, 10`
  (not the top three) and come from different docs, so the picture says "a best
  subset from the whole library, across sources," not "the top of the list."
- **One idea per scene; split which-match from in-what-order.** Selection
  (beat 2) is a flat set resolving at once; ranking is a separate scene; the
  transfer is its own beat. Each scene carries exactly one claim.
- **Continuity by construction.** Cross-scene positions live in `layout.ts` and
  *both* neighboring scenes read them, so every freeze-cut boundary is identical
  by definition — the chunk you see lit, then flying, then grounded is provably
  the same chunk.
- **Product state language only.** Green glow = matched/selected, 0.35/0.18 dim
  = not focal, a single ring pulse = the model working, arrows = flow. No word
  like "RELEVANT" or "PROCESSING" ever appears.

## When to use this

Reach for the chunk → retrieve → ground grammar whenever the thing you're
explaining is **"the system finds the relevant parts of a large body of
knowledge and uses them to act"**: retrieval-augmented answering, search over
docs, grounding a model in real material, "consult X before deciding." It needs
four beats because it's a *grammar*, not a set piece — don't try to compress it
into one scene, and don't pad it past four.

Do **not** reach for it when retrieval isn't the point — if the system genuinely
processes the whole corpus every time, or the lookup is incidental, this grammar
will overstate a mechanism that isn't there.

## The transferable rule

> **Teach a lookup as a journey of a single visible unit.** Make the unit
> concrete and watchable (the chunk: a skeleton card, not prose). Show selection
> as *the right few lit out of many*, scattered, resolving at once — the outcome,
> never a faked scanning process. Move the selected units by interpolating
> *shared* `layout.ts` coordinates so the same objects travel across cuts. Then
> ground the payoff by keeping those exact units visible beside the answer they
> produce — so the viewer's eye, not a caption, connects source to result. The
> whole arc rides on one continuous question (one query in, one answer out) and
> says nothing in words that the picture can say in state.

<!-- PATTERN: module-2-tables -->
# PATTERN — the table as queue + record (cell-fill write-back)

The distinctive move of the Tables module, in one page. If you only read one
file in this pack, read this one — then go to the scene annotations for how each
piece is built frame by frame.

---

## The move

A **table** is on screen as a concrete object: typed columns over rows, holding
real records. A **workflow** runs against it and does three things, in order:

1. **Reads** rows out of the table (a query selects a range of rows).
2. **Processes** them (an agent classifies, enriches, scores — whatever).
3. **Writes the result back** into the same table's cells (an update fills the
   empty columns and flips a status).

The whole point — the thesis the video is built to land — is the docs line said
verbatim at the close:

> *"the table serves as both the queue the workflow pulls from and the record of
> what it has already done."*

So the table is doing double duty. It is the **queue** (the work waiting — rows
the workflow hasn't touched yet, marked by an empty column and a `status` of
`unprocessed`). And after the run it is the **record** (the same table, now
holding the results, with `status` flipped to `qualified`). One object, two
roles, and the run is the hinge between them.

## Why it's the strongest teaching shape in the set

Because it makes a database operation **mechanical and visible** without a single
word of explanation. You watch rows get selected, watch a reference resolve to
those exact rows, watch values drop into the cells that were empty. The table
*changing* is the proof that the workflow did something — and because a real
table only changes when something writes to it, the animation is honest about
how the product actually works.

It also gives you a free, devastating final beat: **run the same query twice.**
The first run lights up five rows. The second run lights up nothing — because the
first run flipped every `status` to `qualified`, and the filter reads
`status = 'unprocessed'`. The empty result is the entire thesis collapsed into
one shot: the table *remembers*, so the workflow never redoes finished work.

---

## How it's built

### One set piece, camera-only differences

There is exactly **one** stage (`_v2.tsx`'s `<Stage/>`), owned by `layoutV2.ts`:
the `leads` table in the upper half, the read→classify→write chain in the lower
half, at fixed geometry. Every scene renders the whole stage and changes only
**state props + camera**. Scenes 1–2 frame the table centered (`CAM_TABLE`,
`s=1.18`); scene 3 eases the camera to identity so the chain is revealed below;
scene 7 eases back to `0.93` for the final balanced hold. Nothing ever relayouts.
Continuity is a property of the construction, not something you check after.

### The table is the real product grid — never a hand-built div

The surface is `SimTable` — a verbatim static port of Sim's Tables grid (native
metrics ×2, real class strings, real selection treatment). You never *design* a
table; you configure the one that exists. Cell contents are a pure function of
state, so the table can only show what the run has produced.

### Cell-fill write-back: values land *in cells*, never as floating chips

This is the part that cost a rejection. An earlier cut (the legacy
`WriteBackScene`) flew little output **chips** ("billing", "high", "done") out of
the agent on a connector line into the table. It was scrapped — *"these look
disgusting"* (case 18). **Outputs only ever appear in real surfaces.** The fix:
the written values appear **inside the table cells themselves**, via a per-row
`writeMix(row): 0→1` that the `Stage` turns into cell content:

```ts
// _v2.tsx — cell text is a function of the write progress
{text: mix < 0.5 ? "" : lead.category}     // category: empty → value at the midpoint
{text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER}  // status: unprocessed → qualified
```

and a **DipSwap** on the text opacity so the swap isn't a hard cut:

```ts
const dip = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
// text fades out toward mix=0.5, the value swaps in at 0.5, fades back up
```

So you see the cell's old content dim away and the new value rise in its place —
a write, not a teleport.

### The green output tint, and how it decays to residue

The cell **background** carries the "this was just written" signal, through
`SimTable`'s `cellTint(col,row): "input" | "output" | null` — **never an overlay
div**. The tints are product-grade, low-alpha washes:

```ts
const TINT_BG = {
  input:  "rgba(51,180,255,0.07)",   // blue — fed into the workflow
  output: "rgba(51,196,130,0.08)",   // green — written back by the workflow
};
```

The green `output` tint is how a freshly-written cell reads as *output*. The
craft is in letting it **decay to residue**: the tint comes up strong as the
value lands, then settles to a faint, persistent wash — the cell stays subtly
green to mark "the workflow touched this," but it's quiet enough not to compete
once the run is over. (In the v2 run cut the *live* range uses the blue
`cellHighlight` selection range while the run is in flight, then releases; the
green `output` residue is the tint that's left to say "written." Either way the
rule holds: the signal is a `cellTint`/selection treatment on the real cell, not
a colored rectangle floated on top.)

### The cause→effect offset (synchrony, never connector lines)

When the query reads, the block's **live ring comes on** and *in sync* the rows
**light as one selection range** in the table above — but there is **no connector
line** drawn between block and table. The teaching is carried by **synchrony**:
two things happen on the same frame, so your eye binds them as cause and effect.
Same on the write: the Update block goes live and *in sync* the written range
lights while values dip in. The offset is deliberate and small — the ring leads
by a beat, the range follows — so it reads as "the block did this," not "these
animated together by coincidence."

The reference resolution reinforces it: Classify's `Messages` row holds
`<table.rows>`, which **glows** with the lit range, then **resolves** to
`[5 rows]` — pointing at the very rows lit above. The full value lives in the
table; the resolved tag is the truncated stand-in (module-5's truncation rule).

### The range outline (one record, one field)

Feeding `SimTable` the *same* highlight value across a contiguous run of cells
makes it draw the product's **single selection outline** around the whole run —
because `SimTable` suppresses the borders that face another highlighted cell. So
a whole row lit = one outline = "a row is one record"; a whole column lit = one
outline = "a field is one column." This is how the video says "record" and
"field" with zero captions.

### The run-twice no-op

The bookend (scene 7) re-fires the query. The `status` column header **glints**
(the filter reading it), and **no range lights** — every row already reads
`qualified`, so the `status = 'unprocessed'` filter matches nothing. The contrast
with the lit range of the first run is the whole lesson, and it only lands
because the first run's write **persisted**: the table kept its new values across
every subsequent scene (the one thing that survives the run's release).

---

## When to use it

Reach for this shape whenever the topic is **a system that processes a
collection and accumulates state** — a queue worker, a batch job, an enrichment
pipeline, a moderation pass, anything that reads items, does work, and records
the outcome back onto the items. The table is the ideal stage for it because the
table is *simultaneously* the input and the ledger, so a single object carries
the entire story.

Don't reach for it when the work is a one-shot transform (one input → one output,
nothing accumulates) — there's no queue and no record, so the double-duty framing
is a lie. That case wants a plain chain, not a table.

---

## The transferable rule

> **Make the data object the protagonist, and let state changes to it be the only
> proof of work.** Read by lighting a range; process off-screen or in a block;
> write by filling the cells that were empty — in the real surface, via the
> product's own tint/selection treatment, never a floated chip or overlay. Bind
> cause to effect with synchrony, not connector lines. Then run it a second time
> and show it do nothing: a no-op is the cleanest possible proof that the object
> remembers.

## ── S-TIER FULL ANNOTATIONS (the core moves, taught scene-by-scene) ──

### subworkflows

<!-- subworkflows / 00-the-rig.md -->
# The rig — `scenes/_local.tsx` + `layout.ts`  ·  the set piece, three worlds

Source: `../source/scenes/_local.tsx`, `../source/layout.ts`,
`../source/components/SimBlock.tsx`.

Before any scene makes sense you have to see the rig — the shared parts every
scene is assembled from. In the market-desk video that was one `<Stage/>`. Here
it's a small kit: three chain components (`ChildChain`, `ParentChain`,
`OuterChain`), a container panel (`InsidePanel` + `InsideStem`), and the camera
math in `layout.ts`. Read this file the way you'd read a parts list before
reading the assembly instructions — every scene below pulls from exactly these
pieces, and the discipline of the whole video is *in here*, not in the scenes.

---

## What the rig is for

The video tells one story across three different "worlds": the child workflow on
its own canvas (scenes 1, 4), the parent that calls it (scenes 2–5), and an
outer chain one level up (scene 6). The naive way to build that is three
separate layouts. That's the trap. If the three worlds have different geometry,
the fold/unfold — the whole video's move — has nowhere consistent to land, and
every boundary becomes a thing you have to hand-tune.

So the rig's job is: **one geometry, three skins.** Every chain in the video
places its blocks at the exact same slots. The worlds differ in *what blocks sit
there and what they say*; the slots themselves never move. That single decision
is what makes the fold always target the same place and the boundaries
pixel-identical by construction.

## The three chains — same slots, different contents

All three chain components (`ChildChain`, `ParentChain`, `OuterChain`) are the
same shape: three blocks at `blockX(0/1/2)` / `CHAIN_Y`, two wires between them,
each block fed a `BlockVis` (`opacity` / `dim` / `highlighted` / `state` /
`hidden`). They differ only in the blocks and rows:

| world | blocks | the middle slot | center-slot rows |
|---|---|---|---|
| **child** (`ChildChain`) | Start → Agent → Response | Agent | the CLASSIFY workflow's real internals |
| **parent** (`ParentChain`) | Start → **Workflow** → Agent | the Workflow block | `Select Workflow: classify-message` · `Input Variable: <start.input>` |
| **outer** (`OuterChain`) | Start → **Workflow** → Agent | a header-only Workflow block | none (names only) |

> *"Why is the center slot always the special one?"* Because that's where the
> fold lands. `blockX(1)` is dead center of the stage (`x = 960` — the chains
> are width-centered), so a fold that targets the center slot is also a fold
> toward the middle of the frame, which reads as "settling in" rather than
> "drifting to a corner." Putting the Workflow block in the center slot in both
> parent and outer means the recursion bookend (scene 6) lands in the same place
> the first fold did. The geometry is doing the teaching.

Notice every block row **title** is a verbatim staging-registry string —
`Inputs`, `Select Workflow`, `Input Variable`, `Model`, `Messages`,
`Response Data`, `Status Code`. The header comment in the rig spells out the
provenance per row, and `grounding-v1.md` verifies each against
`apps/sim/blocks/blocks/*.ts`. This is the *port-the-product* rule applied at the
string level: you don't get to invent a row title, even a plausible one. The
cost of being honest here is three title strings that deviate from prior videos'
pixels (the batch directive chose registry titles over canon abbreviations) —
recorded as a known swap, not a slip.

## The two resolution primitives — `DipSwap` and `ResolvedTag`

The rig only ever changes a row's value two ways, and both are product-honest:

- **`DipSwap a b mix`** — a row's value crossfades from `a` (the template
  placeholder, e.g. `Customer message`) to `b` (the run value, e.g.
  `I want a refund`) as `mix` goes 0→1. This is "the run wrote into this row."
- **`ResolvedTag tag value glow resolve`** — a reference like `<start.input>`
  glows (`glow`) as a pulse lands on it, then resolves in place to its value
  (`resolve`), leaving the resolved value as visible residue so provenance stays
  on screen through a hold.

That's the entire value-change vocabulary. A row **never** changes for any other
reason — there is no number that ticks on its own, no cell that fills without a
block having caused it. Same rule as the market-desk table: *a surface only
changes when something writes to it.* If you catch yourself animating a value
with neither a `DipSwap` nor a `ResolvedTag` driven by a landing pulse, you've
broken the one rule that keeps the video an honest depiction of the product.

## The camera math — `foldTransform` and `pushTransform`

This is the load-bearing part of the rig and the subject of `PATTERN.md`; read
it there in full. The short version, because the scenes call these constantly:

- `foldTransform(target, p)` — `p=0` identity; `p=1` shrinks the whole stage to
  `FOLD_K` (= `BLOCK_W/STAGE_W` = `375/1920` = **0.195×**) and lands it centered
  on `target`. Applied to a full-stage wrapper with `transformOrigin: "0 0"`.
- `pushTransform(z)` — `z=0` identity; `z=1` scales the stage up by `PUSH_Z`
  (**5.4×**) with the 2-row block's center pinned, so the block fills frame.
- The two fold targets are **computed, not typed**: `SLOT_HEADER_CENTER`
  (y=501, for the 62px header-only block) and `SLOT_BLOCK_CENTER` (y=551, for
  the 162px 2-row block), each `CHAIN_Y + simBlockHeight(n)/2`. Fold to the one
  that matches the block you're folding into.

> *"Why derive `FOLD_K` from the widths instead of just picking a scale that
> looks right?"* Because the point of the fold is that the world becomes *the
> block* — not "small." If you eyeball `scale(0.2)` you'll be a few pixels off
> the block's real footprint and the crossfade at the bottom of the fold won't
> register cleanly. Deriving the scale from `BLOCK_W/STAGE_W` guarantees the
> shrunk world is exactly block-width, so when it crossfades to the actual block
> the two images sit on top of each other.

## The inside panel — `InsidePanel` + `InsideStem`

This is the rig piece the *accepted* cut adds (the director's revision of the
v1 zoom-through; see `PATTERN.md` and scenes 4–5). It's a bordered container —
the loops video's "block that holds blocks" grammar, ported from the docs'
`preview-container-node.tsx` metrics ×1.5 — headed with the Workflow block's
indigo chip and the child's name. Two details earn their keep:

- The header chip is the *same* indigo + glyph as the Workflow block, and the
  name is the *same* child the block's `Select Workflow` row names. So the panel
  reads unmistakably as "the inside of *that* block," not a generic popup.
- The child world is re-staged inside the panel at `CHILD_SCALE` (0.8×) using
  the **same `ChildChain` at identity coordinates**, then translated/scaled to
  center in the panel body (`CHILD_TX`/`CHILD_TY` computed from the panel
  geometry). Again: never a re-layout — the child is the same component at the
  same slots, just transformed into the box.

The `InsideStem` is a 2.25px line from the block's bottom edge to the panel
header, drawn with `expand`. It's the umbilical that says "this panel descends
from that block." Tiny element, but it's the difference between "a panel
appeared" and "the block opened."

## How to think about the whole rig

The rig encodes four commitments, and every scene inherits all four for free:

1. **One geometry.** Three worlds, identical slots → the fold always lands in
   the same place; boundaries are pixel-clean.
2. **Real strings only.** Every title traces to the registry; every value to
   `grounding-v1.md`. No invention.
3. **Two resolution primitives.** Rows change via `DipSwap` / `ResolvedTag`
   driven by landing pulses, never on their own.
4. **Camera, not layout.** Containment is performed by transforming a fixed
   world, not by rebuilding it small.

If you internalize the rig, the scenes read as nothing but *timing over these
parts* — which is exactly what a clean explainer should be.

## Exit state

The rig has no exit state of its own — it's the kit. But note the resting
contract it defines, which every scene's boundary is measured against: a chain
*at rest* is all blocks at `opacity 1`, no `highlighted`, no `state`, no
resolutions, wires at `progress 1`, camera at identity, dots at identity. That
resting state is the fixed point the whole video keeps returning to.

<!-- subworkflows / 01-the-workflow-you-know.md -->
# Scene 1 — `the-workflow-you-know`  ·  archetype: **assemble + compressed run**

Source: `../source/scenes/TheWorkflowYouKnowScene.tsx`, `../source/scenes/_local.tsx`,
`../source/layout.ts`.

This is the opening scene, and it does one job that the whole rest of the video
depends on: it shows you a workflow **working on its own**, so that when it folds
into a single block in scene 2, you recognize what got packaged. Read it as the
setup for a payoff — every choice here is in service of the fold landing.

---

## What this scene is for

The video's thesis is "a whole workflow can be one block inside another." For
that to mean anything, the viewer has to first hold "a whole workflow" as a
concrete, complete, *running* thing. So scene 1 puts the series CLASSIFY chain
(Start → Agent → Response — the workflow the viewer already knows from module-1)
on the canvas, assembles it, and runs it once end-to-end.

The discipline — *one idea per scene* — is sharp here: this scene establishes
the referent and **nothing else**. No Workflow block, no parent, no fold. And
critically, **no row values resolve.** The run is *compressed*: blips, pulses,
a live ring, blocks settling green — the shape of a run, but not its data.

> *"Why run it but withhold the values?"* Two reasons, both load-bearing. First,
> scene 4 owns the child's values — it's where `<start.input>` and
> `<agent.content>` actually resolve, and showing them here would spend that
> reveal early and make scene 4 redundant. Second, a *compressed* run says "this
> works, you've seen it work" without re-teaching the workflow; the viewer reads
> the gestalt (it lights up, it goes green) and moves on. The full mechanism is
> deferred to where it's the point.

## What it looks like

The three blocks of the CLASSIFY chain stagger in left to right, the two edges
draw on between them, and then one quick run sweeps through: Start blips, a pulse
crosses to the Agent, the Agent shows a live ring, a pulse crosses to the
Response, the Response blips, and the blocks settle green in causal order — then
the green fades back to rest. No values appear in any row.

## The real decisions: render the real chain, run it hollow

The scene renders exactly one thing — `<ChildChain/>` from the rig — and drives
it entirely through `BlockVis` props:

```tsx
<ChildChain
  start={{opacity: reveal(0.4),  highlighted: t >= 2.8 && t < 3.3}}
  agent={{opacity: reveal(0.9),  highlighted: t >= 3.65 && t < 4.35}}
  response={{opacity: reveal(1.4), highlighted: t >= 4.95 && t < 5.45}}
  edge1={{progress: reveal(0.85, 0.4)}}
  edge2={{progress: reveal(1.35, 0.4)}}
/>
<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse(3.05)} />
<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse(4.35)} />
```

The thing to take from this: **the chain is the real `ChildChain` component at
its real `layout.ts` slots, not a one-off drawing for the intro.** It's the same
component that will be re-staged inside the panel in scene 4 and folded into the
block in scene 2. By using the production chain here, scene 1's exit state is
*already* a frame the later scenes can fold — continuity is free, and the fold in
scene 2 is packaging the literal thing you just watched, not a lookalike icon.

Note there are no row resolution props passed (`inputMix` defaults 0, `msg`/`resp`
undefined). The rows render their template placeholders only. The run is hollow
by omission, which is the cleanest way to compress it — you don't suppress
values, you simply don't drive them.

## The values, and where they come from

None resolve on screen this scene — that's the point. The rows show their static
template state (`Inputs: Customer message`, `Messages: Classify <start.input>`,
`Response Data: <agent.content>`, `Status Code: 200`), all verbatim from the
staging CLASSIFY workflow per `grounding-v1.md`. The run values
(`I want a refund`, `"billing"`) are deliberately held for scene 4.

## The animation, beat by beat

Two helpers: `reveal(t0, dur=0.45)` is an `EASING.out` ramp (entrances —
something is arriving, so it eases); `pulse(t0, dur=0.65)` is a *linear* ramp
(a pulse travels a wire at constant speed; easing a wire-pulse looks like it's
braking mid-wire). The split — eased entrances, linear pulses — is the same
discipline the market-desk video applies: easing is for things that arrive and
settle; constant motion is for things in transit.

### (a) The chain assembles — `reveal(0.4)` / `reveal(0.9)` / `reveal(1.4)`, edges `reveal(0.85,0.4)` / `reveal(1.35,0.4)`

Start fades in at 0.4s, Agent at 0.9s, Response at 1.4s — a **0.5s stagger** —
with edge 1 drawing on at 0.85s (just as the Agent it points to begins) and edge
2 at 1.35s. So you read left-to-right causal order: block, its outgoing edge,
the next block.

> *"Why 0.5s between blocks and not the table's 0.35s row stagger?"* Different
> objects, different cadence. A table row is a small thing; five of them at
> 0.35s feels like a list loading. A workflow block is a heavier object and there
> are only three, so a slightly longer 0.5s beat lets each block land as its own
> event. The edges drawing *between* the block reveals (0.85, 1.35) interleave so
> the chain visibly *connects* rather than appearing pre-wired.
>
> *"Why does Start fade at 0.4 instead of 0.0?"* Same reason scene 1 of any video
> opens on a beat of empty frame: starting at 0.0 reads as "the render was
> already mid-load." A short hold says "deliberate open."

### (b) The compressed run — blips, pulses, live ring

The run is three highlight windows and two pulses, choreographed in causal order:

- Start `highlighted` **2.8–3.3s** (a ~0.5s blip — the run touches Start)
- `pulse(3.05)` crosses edge 1 over **3.05–3.70s** — fires *during* Start's blip,
  so the pulse leaves as Start lights, reading as cause→effect
- Agent `highlighted` **3.65–4.35s** — its live ring, lit as the pulse lands
- `pulse(4.35)` crosses edge 2 over **4.35–5.0s** — fires as the Agent's window
  ends
- Response `highlighted` **4.95–5.45s** — lit as that pulse lands

> *"Why do the pulse and the upstream block's blip overlap (3.05 inside 2.8–3.3)
> rather than sequence cleanly?"* Because a run isn't a relay where each step
> finishes before the next starts — the signal *leaves* the block while the block
> is still lit. The small overlap is what makes it read as a single flowing run
> rather than three discrete events. Get this wrong (gap between blip-end and
> pulse-start) and the run looks like it stutters at every block.
>
> *"Why no green-settle props passed (`state`)?"* The script calls for blocks to
> "settle green in causal order, then green fades back to rest." In this hollow
> compressed run the highlight windows carry the run; the scene ends having
> returned every block to its resting (un-highlighted, no-state) form by ~5.45s,
> so the long tail to 8s (or the VO-extended 8.6s) is a clean rest. That settled
> tail is deliberate — see (c).

### (c) The hold — from ~5.45s to scene end

After the Response blip releases, the chain sits at rest. With VO it stretches to
8.6s; the visual minimum is 8s.

> *"Isn't that dead air?"* No — it's the establishing hold, same role as scene
> 1's hold in the market-desk video. The viewer needs a beat to register "this is
> a complete, working workflow" before it gets folded away. And because the scene
> ends on a fully settled state (no motion mid-flight), it can stretch to whatever
> length the narration needs without freezing an animation halfway. A scene that
> ends still is a scene the audio step can extend painlessly.

## How to think about the whole scene

1. *What's the referent?* The CLASSIFY workflow the viewer already knows → render
   the real `ChildChain`, not a stand-in.
2. *How do I say "this works" without re-teaching it?* A compressed run — the
   shape of a run, no values → recognition without redundancy.
3. *Why withhold the values?* Scene 4 owns them → don't spend the reveal early.
4. *How does it need to end?* Settled, at rest, at identity → so scene 2 can fold
   this exact frame and the audio can stretch it.

## Exit state (what scene 2 inherits)

`child chain assembled at its layout.ts slots · no highlights · no resolutions ·
edges full · camera at identity · dots at identity`. This is the resting child
canvas. Scene 2 opens on exactly this frame and begins folding it — the fold is
operating on the literal workflow you just watched run.

<!-- subworkflows / 02-it-becomes-a-block.md -->
# Scene 2 — `it-becomes-a-block`  ·  archetype: **fold (the move, first showing) + assemble**

Source: `../source/scenes/ItBecomesABlockScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`.

This is the first showing of **the move** — the fold. The child canvas you just
watched run shrinks down and lands inside a single Workflow block in a new
parent chain. It is the most important scene in the video to get right, because
it teaches the move's grammar; scenes 4–6 spend the recognition this scene
builds. Read it with `PATTERN.md` open.

---

## What this scene is for

One idea: **the whole workflow is now ONE step in a bigger flow.** The fold
performs "this entire thing → one block," and then the scene configures that
block (two rows: which workflow, what input) and assembles a parent around it.
The viewer should come out understanding both halves of the thesis-in-miniature:
a workflow can be a block, and configuring that block is just "pick the child,
hand it a value."

## What it looks like

The resting child canvas from scene 1 eases backward and shrinks toward the
center, crossfading into a single indigo Workflow block. The block's first row
appears under a brief selection ring (`Select Workflow: classify-message` — the
editing moment), then its second row (`Input Variable: <start.input>`). Then a
Start fades in to the left and an Agent to the right, the edges draw on, and the
parent chain rests.

## The real decisions

```tsx
const fold    = c(0.5, 2.8, EASING.inOut);   // the camera move
const childOp = 1 - c(1.8, 2.6);             // crossfade the world out, late

{childOp > 0 ? (
  <div style={{ position:"absolute", inset:0, opacity:childOp,
                transform: foldTransform(SLOT_HEADER_CENTER, fold),
                transformOrigin:"0 0" }}>
    <ChildChain start={{}} agent={{}} response={{}} edge1={{}} edge2={{}} />
  </div>
) : null}

<ParentChain
  start={{opacity: startOp}}
  wf={{opacity: blockOp, highlighted: editing}}
  agent={{opacity: agentOp}}
  edge1={{progress: edge1}} edge2={{progress: edge2}}
  wfBodyReveal={row1} wfRow1Reveal={row1} wfRow2Reveal={row2}
/>
```

Three decisions worth dwelling on.

**The fold is a transform over the unchanged child chain.** `<ChildChain/>` is
rendered at its normal identity coordinates inside a full-stage wrapper; the
wrapper's `transform` is `foldTransform(SLOT_HEADER_CENTER, fold)`. The chain
never re-layouts to "be small" — the camera makes it small and lands it on the
block slot. This is the entire mechanic of the move (see `PATTERN.md`).

**The fold targets `SLOT_HEADER_CENTER`, not the block's eventual 2-row center.**
At the instant the fold lands, the destination block has *no rows yet* — it's
header-only (62px). So the fold targets the header-only center (y=501). The rows
reveal *after* the fold settles, growing the block downward from there. If you'd
folded to the 2-row center (y=551, `SLOT_BLOCK_CENTER`), the world would land 50px
low and the block would appear to jump when its rows pushed it back up.

**The destination block and the parent are the real `ParentChain`.** The block
the world folds into is `ParentChain`'s Workflow block at `blockX(1)` — the same
center slot the fold targets. The Start and Agent that assemble around it are the
same `ParentChain`'s other two slots. So the parent isn't drawn to receive the
fold; it *is* the rig's parent chain, revealed piece by piece.

## The values, and where they come from

Two rows resolve into existence (they don't *run* — they're the block's static
configuration, authored by the builder):

| row | value | source |
|---|---|---|
| `Select Workflow` | `classify-message` | `CLASSIFY_WORKFLOW.id`; registry title from `workflow.ts` |
| `Input Variable` | `<start.input>` | `WORKFLOW_CALL_WORKFLOW` block row, verbatim; title from `workflow.ts` |

The Agent that assembles to the right carries `Messages: <workflow.result>`
(bare tag — the docs' `Summarize ` prefix truncates at row width; the
KB-v2/webhooks precedent). That tag is dormant here — it resolves in scene 5.
All per `grounding-v1.md`.

## The animation, beat by beat

One helper: `c(lo, hi, easing?)` — a clamped 0→1 ramp over `[lo,hi]`. Camera and
transforms get `EASING.inOut` (they accelerate out of rest and ease into the
landing); reveals get `EASING.out`; crossfades are linear.

### (a) The fold — `fold = c(0.5, 2.8, EASING.inOut)`, world crossfades `childOp = 1 - c(1.8, 2.6)`

The world shrinks over **0.5–2.8s** (a ~2.3s move) on an ease-in-out curve, and
its opacity drops only over **1.8–2.6s** — late, near the end of the shrink.

> *"Why is the fold so slow — 2.3 seconds?"* Because this is the move's first
> showing and the viewer has to *read* it as "the whole thing becomes one block,"
> not just "something shrank." A fast fold reads as a transition wipe. A slow,
> eased fold lets the eye track the entire chain collapsing into the footprint —
> the meaning is in being able to follow it. Later folds (scene 6, 2.1s) can be a
> touch quicker because the grammar is established.
>
> *"Why does the opacity drop at 1.8 instead of with the scale at 0.5?"* This is
> the crossfade-offset trick from `PATTERN.md`. If the world faded as it shrank,
> you'd watch a ghost dissolve into nothing. By holding it opaque until 1.8s —
> by which point it's nearly block-sized — then fading it out over 1.8–2.6s while
> `blockOp = c(2.3, 2.9)` fades the real block *in* over the same window, the two
> images are registered at the swap. You never see the seam; the shrunk world
> *becomes* the block.

### (b) The configuration — selection ring + two rows

- block fades in: `blockOp = c(2.3, 2.9)` (as the fold lands)
- `editing = t >= 3.3 && t < 6.0` — the Workflow block carries a selection ring
  for **3.3–6.0s** (the "you're editing this block" state)
- row 1 reveals: `row1 = c(3.6, 4.2, EASING.out)` — also drives `wfBodyReveal`,
  so the block body grows *with* the first row
- row 2 reveals: `row2 = c(4.8, 5.4, EASING.out)`

> *"Why the selection ring at all?"* It's product vocabulary for "this is the
> block being configured" — the editing moment — without a caption. The ring
> spans 3.3–6.0s, covering both row reveals, so it reads as "while this block is
> selected, you set its two fields," then releases. State via the product's own
> language, never the word `EDITING`.
>
> *"Why ~1.2s between row 1 (3.6) and row 2 (4.8)?"* The two rows are two distinct
> ideas — *which* workflow, then *what* it receives. Spacing them lets each
> register as its own configuration act. Revealing them together would read as
> "the block has some rows" rather than "you pick the child, then you map the
> input."

### (c) The parent assembles — `startOp = c(6.2,6.7)`, `agentOp = c(6.8,7.3)`, edges `c(6.9,7.3)` / `c(7.4,7.8)`

Only *after* the block is fully configured (rows done ~5.4s, ring released 6.0s)
does the parent grow around it: Start at 6.2s, Agent at 6.8s, edge 1 at 6.9s,
edge 2 at 7.4s — same left-to-right, block-then-edge cadence as scene 1's
assemble.

> *"Why build the parent last instead of having it present during the fold?"*
> Sequencing teaches causality. The story is: here's the workflow → it becomes a
> block → you configure that block → then you build a flow around it. If the Start
> and Agent were already there during the fold, the viewer wouldn't know which
> element is the *new* idea. Revealing them after the block is configured makes
> the block unmistakably the subject and the parent its context.

### (d) The hold — to scene end (visual min 10s; VO 15.7s)

The parent rests, fully assembled, no rings, no resolutions.

> *"This scene is VO-stretched to 15.7s — a long hold. Safe?"* Yes, for the usual
> reason: it ends on a settled state. The long tail is where the narration
> explains "you pick which workflow it calls and what input it receives, then
> build around it." Because nothing is mid-motion, the hold extends cleanly.

## How to think about the whole scene

1. *How do I say "this whole thing is one block"?* The fold — a camera transform
   over the unchanged child chain → containment performed, not labeled.
2. *Where does it land?* The center slot's header-only center, computed → lands
   on the real block, no jump when rows grow.
3. *How do I make the swap invisible?* Hold the world opaque until it's
   block-sized, then crossfade to the real block resolving in place.
4. *How do I teach configuration?* Selection ring + two staggered rows → "pick
   the child, map the input," in product vocabulary.
5. *When does the parent appear?* After the block is configured → the block reads
   as the subject, the parent as its context.

## Exit state (what scene 3 inherits)

`parent chain at rest · block rows complete (classify-message / <start.input>) ·
no selection ring · no resolutions · no rings · edges full · camera identity`.
Scene 3 opens on this exact resting parent and starts a run into it.

<!-- subworkflows / 03-the-call-begins.md -->
# Scene 3 — `the-call-begins`  ·  archetype: **run → freeze-cut**

Source: `../source/scenes/TheCallBeginsScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`.

This scene starts THE run — the one mechanistic run that the centerpiece (scenes
3→4→5) is built around — and ends by **freezing it** at the Workflow block. The
held live state crosses the scene boundary unchanged. Read it together with
scenes 4 and 5: it is the first third of one continuous run, not a self-contained
scene.

---

## What this scene is for

One idea: **the run reaches the block and parks.** A parent run starts, the input
value lands in Start, the pulse crosses to the Workflow block, the block's
`Input Variable` resolves to the actual value (the handoff is visible in the
block's own config row), and the block goes live… and stops. Nothing moves past
it. The beat the viewer must take away is: *the block has the parent's value, and
now it has to go run something — so the run waits here.*

## What it looks like

On the resting parent from scene 2: the value `I want a refund` dips into Start's
`Inputs` row, Start blips, a pulse crosses edge 1, and as it lands the block's
`<start.input>` tag glows then resolves to `I want a refund`. The Workflow block's
live ring comes on — and holds. The Agent downstream never lights. The frame
freezes on the live, parked block.

## The real decisions

```tsx
const inputMix = c(1.0, 1.4);                       // value dips into Start
const startBlip = t >= 1.3 && t < 1.8;
const pulse1   = c(1.7, 2.35);                      // crosses edge 1
const ivGlow   = c(2.1, 2.35) * (1 - c(2.75, 3.1)); // glow up, then down
const ivMix    = c(2.35, 2.75);                     // resolve in place
const wfLive   = t >= 2.35;                         // …and HOLDS

<ParentChain
  start={{highlighted: startBlip}}
  wf={{highlighted: wfLive}}
  agent={{}} edge1={{}} edge2={{}}
  inputMix={inputMix}
  iv={{glow: ivGlow, mix: ivMix}}
/>
<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
```

The decisions:

**Only edge 1 gets a pulse; edge 2 is dead.** The pulse crosses Start→Workflow
and stops. There is deliberately no pulse on Workflow→Agent. That absence *is* the
teach: the run physically cannot proceed past the block because the block hasn't
returned yet. Showing a second pulse would say "the run continued," which is the
opposite of the lesson.

**The handoff resolves in the block's *own* config row.** The `Input Variable`
row was authored as `<start.input>` in scene 2; here it resolves to the run's
actual value. So the viewer literally sees the parent's value flow into the
block's configuration — the input mapping made visible. This is the friction the
notes flagged ("the input handoff is invisible in the UI; the docs say it in one
line; nobody sees it"). The scene's whole job is to make that one invisible line
*visible*.

**`wfLive = t >= 2.35` has no upper bound.** The live ring comes on and never
turns off within this scene. That open-ended truth is the freeze-cut's carried
state — scene 4 will open on this exact live frame.

## The values, and where they come from

| where | value | source |
|---|---|---|
| Start `Inputs` (via `inputMix`) | `Customer message` → `I want a refund` | series-canon run input |
| block `Input Variable` (via `iv`) | `<start.input>` → `I want a refund` | the handoff; `workflow.ts` input description: "available as start.input in the child" |

`RUN_INPUT = "I want a refund"` is the canon run value (`grounding-v1.md`).

## The animation, beat by beat

One helper: `c(lo, hi)` — a clamped *linear* 0→1 ramp (no easing argument passed;
run mechanics travel at constant rate).

### (a) The input lands — `inputMix = c(1.0, 1.4)`, Start blip `1.3–1.8s`

The value crossfades into Start's row over **1.0–1.4s** (a fast 0.4s swap — a
value populating, not arriving from off-screen), and Start blips **1.3–1.8s**,
overlapping the tail of the swap so "the value arrived" and "Start fired" read as
one event.

> *"Why does the run open at 1.0s, not 0.0?"* Scene 3 opens on the resting parent
> inherited from scene 2; a short beat of stillness before the run starts lets the
> viewer register "we're back on the parent, at rest" before motion begins. Cutting
> straight into a run would blur the boundary.

### (b) The pulse crosses — `pulse1 = c(1.7, 2.35)`

The pulse travels edge 1 over **1.7–2.35s**, leaving as Start's blip is still lit
(1.7 inside 1.3–1.8) — cause→effect, same overlap discipline as scene 1.

### (c) The handoff resolves — `ivGlow = c(2.1,2.35)*(1 - c(2.75,3.1))`, `ivMix = c(2.35,2.75)`

As the pulse nears the block (2.1s), the `<start.input>` tag **glows** (rises
2.1→2.35s); then over **2.35–2.75s** it **resolves** in place to `I want a
refund`; then the glow **fades** over 2.75–3.1s, leaving the resolved value as
residue.

> *"Why the glow-then-resolve-then-fade-glow three-step?"* This is the
> `ResolvedTag` grammar and it encodes provenance honestly. The glow is "a value
> just landed on this reference" (synchronized to the pulse arriving). The resolve
> is "the reference became its value." The glow fading while the value stays is
> "the reference is now just this value" — the provenance receipt lingers as plain
> text so it's still readable through the long hold. Multiply `ivGlow` by
> `(1 - c(2.75,3.1))` so the glow is a pulse (up then down), not a state that
> stays on.

### (d) The block goes live and holds — `wfLive = t >= 2.35`

The instant the handoff completes (2.35s), the block's live ring comes on and
stays. From here to scene end (visual min 7s; VO 8.9s) nothing moves.

> *"A ~4.5s hold on a live ring — isn't that a long time to sit?"* It's the point
> of the scene. The held live ring *is* "the run is waiting here." The longer it
> holds with nothing else moving, the more the viewer feels the parent run is
> stuck on this block — which sets up scene 4's answer ("here's what it's waiting
> FOR"). And the hold is what makes the freeze-cut work: scene 4 opens on this
> frozen frame, so the held state has to be genuinely static.

## The freeze-cut — why this is the right move here

A freeze-cut means: end the scene on a held, mid-action state, and open the next
scene on that *same* state. It answers the viewer's "what is happening inside this
moment?" The notes call this out as one of the two moves the docs' own pedagogy
leans on. Scene 3 freezes the run at the block (live ring on, downstream dark);
scene 4 opens inside that frozen moment and shows the child running. The contract
is strict: scene 4's *enter* state must equal scene 3's *exit* state to the pixel
— Start resolved to `I want a refund`, block `Input Variable` resolved, block ring
live, camera identity. The one run never re-runs; scene 4 *continues* it.

## How to think about the whole scene

1. *How do I show the run reaching the block?* Input dips into Start, pulse
   crosses edge 1 → ordinary run mechanics.
2. *How do I make the invisible handoff visible?* Resolve `<start.input>` in the
   block's own config row → the input mapping, on screen.
3. *How do I show "it parks"?* Live ring on, no pulse on edge 2 → the run
   physically can't proceed; the absence is the teach.
4. *How do I hand off to scene 4?* Hold the live state open-ended → freeze-cut;
   scene 4 opens inside it.

## Exit state (what scene 4 inherits — a freeze-cut boundary)

`parent chain · Start Inputs = "I want a refund" (resolved) · block Input Variable
= "I want a refund" (resolved, glow faded) · block ring live-blue (held) · Agent
dark · no pulse in flight · camera identity`. Scene 4 opens on this exact frame.

<!-- subworkflows / 04-inside-the-call.md -->
# Scene 4 — `inside-the-call`  ·  archetype: **freeze-cut continuation + expand-beneath + run** (the accepted cut)

Source: `../source/scenes/InsideTheCallScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`. The original zoom-through take is annotated
separately in `04b-inside-the-call-v1.md` — read both; the diff is the lesson.

This is the mechanistic centerpiece and the longest scene (visual min 14s; VO
18.6s). It opens *inside* scene 3's frozen moment, then shows what the parked run
is waiting for: the child workflow running, end to end, with the handed-off value
as its `start.input`. It is the middle third of the one continuous run.

---

## What this scene is for

One idea: **inside the block, the child runs the whole way — and the value you
passed IS its `start.input`.** The viewer already knows (scene 1) what the child
*is* and (scene 3) that the parent parked on the block holding `I want a refund`.
This scene connects them: the held value arrives at the child's Start, the child
runs its own full run, and produces `"billing"`. The crucial thing it must show
is **simultaneity** — the parent call is still parked above while the child runs
below; the run hasn't *left* the parent, it's *inside* it.

## What it looks like

Opening on scene 3's frozen frame, the parent chain glides up and holds near the
top, its Workflow block ring still live. Beneath it, a bordered container panel —
headed with the Workflow block's indigo chip and the child's name — expands
downward from the block on a thin stem. Inside the panel, the child chain from
scene 1 runs: the value dips into the child Start, pulses cross, the child Agent
goes live, `Classify <start.input>` resolves to `I want a refund`,
`<agent.content>` resolves to `"billing"`, and the three child blocks settle
green. The call above never moves. The completed child holds.

## The real decisions — why expand-beneath, not zoom-through

The original take (v1) pushed the camera *through* the Workflow block until the
child canvas filled the frame. The director revised it to this: the parent stays
on screen, glides up, and the child runs in a panel *beneath* the still-live
call. Why the revision is the better teach:

> A push-*through* implies you **leave** the parent to go look at the child. But
> the parent run hasn't gone anywhere — it's parked, waiting. The whole concept is
> *sequential containment*: parent paused, child running, parent still there. The
> zoom-through hides exactly the thing you're trying to teach (that the parent is
> *waiting* while this happens). Keeping the halted call on screen the entire time,
> with the child running visibly underneath it on a stem from the block, shows the
> simultaneity. The viewer can see both tiers at once: "the run is waiting up
> there; down here is what it's waiting for."

The structure:

```tsx
const raise  = c(0.7, 2.1, EASING.inOut);  // parent glides up
const expand = c(1.1, 2.5, EASING.out);    // panel + stem grow down

<InsideStem  raise={raise} expand={expand} />
<InsidePanel expand={expand}>
  <ChildChain ... />            {/* the SAME child chain, re-staged at 0.8x in the panel */}
  <WirePulse ... /> <WirePulse ... />
</InsidePanel>

{/* the halted call — never fades, never stops being live */}
<div style={{transform: `translateY(${-RAISE_DY * raise}px)`}}>
  <ParentChain wf={{highlighted: true}} inputMix={1} iv={{mix: 1}} ... />
</div>
```

Three things to take:

**The parent never re-layouts — it's the same `ParentChain`, just translated up**
by `-RAISE_DY * raise` (300px when fully raised). Its Workflow block stays
`highlighted: true` and its rows stay resolved (`inputMix={1}`, `iv={{mix:1}}`) —
i.e. it holds *exactly* the frozen state scene 3 ended on, just slid upward. The
freeze-cut continuity is preserved because the parent is literally the same
component in the same state; only its `translateY` changes.

**The child is the same `ChildChain`, re-staged in the panel.** `InsidePanel`
renders the child at identity coordinates and transforms it into the panel body
at `CHILD_SCALE` (0.8×). It is not a redrawn mini-chain — it's the scene-1 chain,
running. So the value resolving into its Start *is* the same workflow the viewer
watched, now receiving the parent's input.

**The stem carries the containment.** `InsideStem` draws a 2.25px line from the
block's bottom edge to the panel header, growing with `expand`. Without it the
panel would read as "a popup appeared"; with it, the panel reads as "the block
opened to show its inside." Small element, load-bearing meaning.

## The values, and where they come from

This scene **owns** the child's run values (deferred from scene 1):

| row | resolves to | source |
|---|---|---|
| child Start `Inputs` (`inputMix`) | `I want a refund` | the handoff — same value the parent held |
| child Agent `Messages` (`msg`) | `Classify <start.input>` → `I want a refund` | CLASSIFY workflow agent row |
| child Response `Response Data` (`resp`) | `<agent.content>` → `"billing"` | canon classification of this input |

`I want a refund` and `"billing"` per `grounding-v1.md`.

## The animation, beat by beat

`c(lo, hi, easing?)`: the camera/panel moves get easing; run mechanics are linear.

### (a) Open the panel — `raise = c(0.7, 2.1, EASING.inOut)`, `expand = c(1.1, 2.5, EASING.out)`

A short beat of the frozen frame (to 0.7s — confirming we're inside scene 3's
held moment), then the parent glides up over **0.7–2.1s** (ease-in-out — a camera
move) while the panel expands down over **1.1–2.5s** (ease-out — a thing
arriving). The panel starts (1.1s) *after* the raise begins (0.7s) so the block
visibly lifts before its inside opens beneath it.

> *"Why hold the frozen frame for 0.7s at the open?"* That's the freeze-cut seam.
> The viewer's eye needs to confirm "this is the same frame scene 3 ended on"
> before anything moves, or the continuity is wasted. Move on frame 1 and the
> held state never registers as held.

### (b) The child runs — the familiar choreography, 3.6–7.0s

The child run reuses scene 1's exact cadence (so it reads as "the same workflow
running"):

- `inputMix = c(3.6, 4.0)` — value dips into child Start; child Start blips
  **3.9–4.4s**
- `pulse1 = c(4.3, 4.95)` — crosses to child Agent
- child Agent live **4.9–5.7s**; `msgGlow = c(4.85,5.1)*(1 - c(5.5,5.8))`,
  `msgMix = c(5.1,5.5)` — `Classify <start.input>` resolves
- `pulse2 = c(5.7, 6.35)` — crosses to child Response
- child Response blip **6.5–7.0s**; `respGlow = c(6.3,6.55)*(1 - c(6.95,7.25))`,
  `respMix = c(6.55,6.95)` — `<agent.content>` resolves to `"billing"`

> *"Why does the run wait until 3.6s to start when the panel is open by 2.5s?"*
> The same give-each-idea-air discipline. Beats 1–2.5s are "the block opens to
> reveal the child." If the child started running the instant the panel finished
> opening, the viewer couldn't separate "here's the inside" from "the inside is
> running." A ~1s beat of the static open child lets "this is the workflow you
> know, now inside the block" land before it runs.
>
> *"Why the same glow/resolve windows as scene 3's handoff?"* Consistency is the
> point — every resolution in the video uses the identical `ResolvedTag` grammar
> (glow on pulse-land, resolve in place, glow fades to residue). The child's two
> resolutions here are the same gesture the parent's `Input Variable` did in
> scene 3, so the viewer reads them without re-learning.

### (c) Settle green and hold — `startOk t≥7.6`, `agentOk t≥8.0`, `respOk t≥8.4`

The three child blocks flip to `ok` (green) in causal order — **7.6 / 8.0 / 8.4s**
— a 0.4s stagger, and **hold**. From 8.4s to scene end the completed green child
sits in the panel; the parent call still holds live above it.

> *"Why hold the completed child instead of moving on?"* Because this is another
> freeze-cut — scene 5 opens on this exact two-tier completed frame and pulls the
> result back up. The child finishing but the *parent block still live* is the
> precise state scene 5 inherits: the answer exists below, the parent hasn't
> received it yet. The green-stagger (7.6/8.0/8.4) reads as "the run completed in
> order," and freezing on it sets scene 5's "now it comes back."

## How to think about the whole scene

1. *How do I show what the parked run is waiting for?* Open the block's inside
   *beneath* the held call → both tiers visible, simultaneity shown.
2. *Why not zoom through?* Zooming through implies leaving the parent; the parent
   is *waiting*, not gone → keep it on screen.
3. *How do I prove the handed value is the child's start.input?* The same held
   value dips into the child's Start → the handoff completes inside.
4. *How do I make the child read as the known workflow?* It's the literal scene-1
   `ChildChain`, same run cadence → recognition.
5. *How do I end?* Completed green child, parent still live → freeze-cut into
   scene 5's return.

## Exit state (what scene 5 inherits — a freeze-cut boundary)

`parent raised, Workflow block ring still live · panel open beneath on its stem ·
child fully resolved (Inputs = "I want a refund", Messages resolved, Response
Data = "billing") · all three child blocks ok-green · no pulse in flight`. Scene
5 opens on this exact two-tier frame and retracts the panel.

<!-- subworkflows / 04b-inside-the-call-v1.md -->
# Scene 4 (v1 take) — `inside-the-call` zoom-through  ·  archetype: **freeze-cut continuation + unfold (push-through) + run**

Source: `../source/scenes/InsideTheCallV1Scene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`. This is the **original** take, superseded by the
accepted expand-beneath cut (`04-inside-the-call.md`). Both ship in the repo
(takes culture); the diff between them is one of the most useful lessons in the
pack — so read this *after* the accepted version, as a "what changed and why."

---

## What this take is for

Same beat intent as the accepted cut: **inside the block, the child runs
end-to-end with the parent's value as its `start.input`.** The only difference is
*how you get inside* — here, the camera pushes **through** the live Workflow
block (the literal unfold, the inverse of scene 2's fold) until the child canvas
resolves at full size underneath. This is the pure form of the video's move: a
fold reversed.

## What it looks like

Opening on scene 3's frozen frame, the camera pushes into the live Workflow block
— the parent world scales up and recedes off the edges of frame, fading out — and
the child canvas (the scene-1 chain, at full size) crossfades in at identity
behind it. Then the child runs the same choreography as the accepted cut, settles
green, and holds.

## The real decisions — the push-through mechanic

```tsx
const z        = c(0.7, 2.9, EASING.inOut);  // camera pushes IN
const parentOp = 1 - c(2.0, 2.8);            // parent fades as it blows past
const childOp  = c(2.2, 3.0);                // child resolves underneath

{parentOp > 0 ? (
  <div style={{ opacity:parentOp, transform: pushTransform(z), transformOrigin:"0 0" }}>
    <ParentChain wf={{highlighted:true}} inputMix={1} iv={{mix:1}} ... />
  </div>
) : null}

{childOp > 0 ? (
  <div style={{ opacity:childOp }}>   {/* child at IDENTITY — no transform */}
    <ChildChain ... />
  </div>
) : null}
```

The mechanic is the exact inverse of scene 2's fold and uses the rig's other
camera function:

- `pushTransform(z)` scales the parent stage up by `PUSH_Z` (5.4×) with the 2-row
  Workflow block's center (`SLOT_BLOCK_CENTER`, y=551) pinned in frame, so as `z`
  goes 0→1 the block grows to fill the screen and everything else flies off the
  edges. The parent is the same `ParentChain` at identity, transformed — never
  re-laid-out.
- The **child renders at identity with no transform at all.** The illusion of
  "the child was always inside the block" comes from crossfading the child in
  (`childOp = c(2.2, 3.0)`) underneath the parent that's blowing past
  (`parentOp = 1 - c(2.0, 2.8)`). At the swap moment the parent is huge and
  fading; the child resolves at normal size. You "arrive" at the child.

> *"Why does the push target `SLOT_BLOCK_CENTER` (y=551) here, but scene 2's fold
> targeted `SLOT_HEADER_CENTER` (y=501)?"* Because by scene 4 the Workflow block
> is the fully-configured 2-row block (162px tall), so its real center is y=551.
> Scene 2 folded into a header-only block (62px, center y=501) because the rows
> hadn't been added yet. The camera always targets the *actual* center of the
> block as it exists at that moment — that's why there are two computed targets in
> `layout.ts`, not one.

## Why this take was superseded

The push-through is the more *spectacular* version of the move — it's the move in
its purest, most literal form, and that's exactly why it was wrong here. Pushing
through the block makes the parent leave the frame entirely. For three to four
seconds the viewer cannot see the parent at all — and the one thing this scene
most needs to teach is that *the parent is still there, parked, waiting* while
the child runs. The zoom-through visually contradicts the concept.

The accepted cut (`04-inside-the-call.md`) keeps the parent on screen and runs the
child in a panel beneath it, so both tiers are visible and the simultaneity reads.
The lesson the pair teaches:

> **The move serves the concept — when the cleanest read of the concept needs the
> move to yield, it yields.** The fold/unfold is the video's signature, but the
> centerpiece's job is to show sequential containment (parent paused while child
> runs), and a literal push-through can't show "paused" if the parent is off
> screen. So the literal unfold survives at the two ends of the video (scene 2's
> fold, scene 6's bookend, where there's nothing to keep on screen), and the
> middle trades it for a containment panel. Recognizing when your signature move
> is fighting your concept — and demoting it — is the senior judgment here.

## The animation, beat by beat

Identical to the accepted cut *from 3.6s onward* — the child's run is the same
choreography (`inputMix = c(3.6,4.0)`, child Agent live 4.9–5.7s, `<agent.content>`
→ `"billing"` by ~6.95s, green settle 7.6/8.0/8.4s, hold). Only the *entry*
differs:

### The push-through entry — `z = c(0.7, 2.9, EASING.inOut)`

A 0.7s hold on the frozen frame (the freeze-cut seam, same as the accepted cut),
then the camera pushes in over **0.7–2.9s** on ease-in-out. The parent fades over
**2.0–2.8s** and the child resolves over **2.2–3.0s** — the crossfade is offset
into the late part of the push, the same trick as every fold in the video:
hold the moving image opaque until it's nearly out, then swap. The ~1.1s before
2.0s is the camera accelerating into the block while the parent is still solid, so
you read "we're diving into *this block*" before the swap.

> *"Why 2.2s for the push (0.7→2.9) vs the panel's 1.4s raise (0.7→2.1)?"* A
> push-through covers more visual distance — the whole frame scales 5.4× — so it
> needs more time to read as a deliberate dive rather than a snap-zoom. The panel
> only slides the parent up 300px and grows a box; less distance, less time. Both
> are ease-in-out because both are camera moves.

## How to think about the whole take

1. *How do I get inside the block?* Push the camera through it (`pushTransform`),
   crossfade the child in underneath → the literal unfold.
2. *Why is this the pure move?* It's scene 2's fold run backwards → the
   containment grammar made fully physical.
3. *Why was it wrong?* It removes the parent from frame, contradicting "the parent
   is parked, waiting" → the concept needed both tiers visible.
4. *What replaced it?* Expand-beneath — same child run, parent kept on screen →
   the move yields to the clearer read.

## Exit state

Same as the accepted cut's exit (`childOp` resolved, child green, held) — but at
**identity full-frame**, with no parent and no panel on screen (the parent blew
past during the push). The v1 scene 5 (`05b-back-with-the-result-v1.md`) opens on
*this* identity child and folds it back into the block; that's why the two takes
need matched scene-5 variants — the held frame they inherit is geometrically
different.

<!-- subworkflows / 05-back-with-the-result.md -->
# Scene 5 — `back-with-the-result`  ·  archetype: **re-fold (panel retract) + run completion** (the accepted cut)

Source: `../source/scenes/BackWithTheResultScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`. The original fold-back take is in
`05b-back-with-the-result-v1.md`.

This is the final third of the one continuous run. It opens on scene 4's frozen
two-tier frame, retracts the child back into the block, flips the block live→green
(the call returned), and resumes the parent run with the child's answer as
`<workflow.result>`. Then it reverts everything to rest.

---

## What this scene is for

One idea: **the child's final response comes back as the block's result, and the
parent continues with it like any other value.** The viewer has seen the child
produce `"billing"` (scene 4). This scene closes the loop: that value returns to
the parent as `<workflow.result>`, the Agent uses it, the parent finishes. The
takeaway is that the return is *unremarkable* — once it's back, `<workflow.result>`
is just an ordinary block reference, no different from `<agent.content>`.

## What it looks like

On scene 4's held frame (call live above, green child in the panel below), the
panel retracts upward into the Workflow block — the inside returns to its
container — and the parent chain glides home. As it lands, the block's ring flips
live-blue → ok-green: the call returned. The run resumes: a pulse crosses edge 2,
`<workflow.result>` resolves to `"billing"` in the Agent's `Messages` row, the
Agent goes live, the parent settles green, holds, then every resolution reverts
and the green fades — back to the resting parent.

## The real decisions

```tsx
// SEQUENCED so the chain never passes through the open panel:
const expand = 1 - c(0.6, 1.7, EASING.in);   // panel retracts FIRST
const raise  = 1 - c(1.7, 2.9, EASING.inOut); // THEN parent glides home
const wfOk   = t >= 3.0;                       // ring flips green as it lands
```

The decision that matters most here is **the sequencing.** The panel retracts
*fully* (`expand` 1→0 over 0.6–1.7s) *before* the parent starts gliding home
(`raise` 1→0 over 1.7–2.9s). They don't overlap.

> *"Why not retract and glide at the same time to save a second?"* Because if the
> parent chain moved down while the panel was still open, the chain would pass
> *through* the open panel — blocks overlapping the container, a visual collision
> that reads as broken. By fully retracting the inside into the block first, then
> moving the now-closed parent home, nothing ever overlaps. This is the same
> class of decision as continuity: you sequence motions so two things never
> occupy the same space. It costs a beat; it buys a clean frame.

Note the easings: the panel retract is `EASING.in` (a thing leaving — it
accelerates away), the parent glide is `EASING.inOut` (a camera move home). The
choice matches the market-desk rule: `in` for exits, `inOut` for camera.

## The values, and where they come from

| row | resolves | source |
|---|---|---|
| parent Agent `Messages` (`wr`) | `<workflow.result>` → `"billing"` | the child's final response, returned as the block's `result` output |

`<workflow.result>` is the bare tag (the docs' `Summarize ` prefix truncates at
row width — KB-v2/webhooks precedent). It resolves to `"billing"` — *the same
value the child visibly produced as `<agent.content>`* — which is the whole point:
the block's result IS the child's final response. All per `grounding-v1.md`.

## The animation, beat by beat

`c(lo, hi, easing?)`: easing on the structural moves, linear on the run.

### (a) Retract, then glide — `expand = 1 - c(0.6,1.7,in)`, `raise = 1 - c(1.7,2.9,inOut)`

Panel retracts **0.6–1.7s**, parent glides home **1.7–2.9s** — strictly
sequential, as above. A short 0.6s hold at the open confirms we're inside scene
4's frozen frame before motion (the freeze-cut seam).

### (b) The call returns — `wfOk = t >= 3.0`

The instant the parent lands home (raise done 2.9s), at **3.0s** the Workflow
block's ring flips live-blue → ok-green.

> *"Why is the green-flip tied to the landing, not the panel retract?"* Because
> "the call returned" is the moment the parent is whole again — block back in its
> chain, inside folded away. Flipping the ring as the chain lands makes "returned"
> and "the parent is back together" the same beat. Flip it during the retract and
> the parent would still be mid-move when it supposedly "completed."

### (c) The run resumes — `pulse2 = c(3.5,4.15)`, `wr` resolves, Agent live 4.1–5.1s

After the return, the previously-dead edge 2 finally gets its pulse
(**3.5–4.15s**) — the run can now proceed past the block, because the block has
returned. `<workflow.result>` glows (`wrGlow = c(3.9,4.15)*(1 - c(4.55,4.9))`) and
resolves (`wrMix` rising over 4.15–4.55s) to `"billing"`; the Agent goes live
**4.1–5.1s**.

> *"The pulse on edge 2 was conspicuously absent in scene 3 — why does it matter
> that it fires now?"* That's the payoff of scene 3's deliberate omission. Scene 3
> withheld the edge-2 pulse to show the run *couldn't* proceed past the parked
> block. Now that the block has returned, the pulse crosses — the run continues.
> The presence here and the absence there are a matched pair teaching "the parent
> waits, then continues."

### (d) Settle green, hold, revert — `startOk`/`agentOk` windowed `[5.4,7.6]`/`[5.8,8.0]`, `revert = 1 - c(7.2,7.6)`

The parent settles green in causal order (Start ok 5.4s, Agent ok 5.8s, the
Workflow block held green via `wfOkHeld = wfOk && t < 7.8`), holds, then **reverts**:
`revert = 1 - c(7.2,7.6)` drives `inputMix`, `ivMix` back to 0, and `wrMix` is
itself gated by `(1 - c(7.2,7.6))` so the resolved value un-resolves. By ~7.8s
every ring is off, every resolution reverted — the resting parent.

> *"Why revert all the resolutions at the end instead of leaving the run's results
> on screen?"* Because the continuity contract requires scene 6 to inherit the
> *resting* parent (no resolutions, no rings) so scene 6 can fold a clean parent.
> The video's rule is "all resolutions revert before scene end EXCEPT across the
> two named freeze-cuts." Scene 5 is *not* a freeze-cut out (scene 6 starts fresh
> on the rested parent), so it cleans up after itself. The windowed `[5.4,7.6]`
> on the green states means they too switch off at 7.6, returning the blocks to
> neutral. The scene leaves the stage exactly as scene 2 left it.

## How to think about the whole scene

1. *How does the inside return?* Panel retracts into the block → containment
   closes, the inverse of scene 4's open.
2. *Why retract before gliding?* So the chain never passes through the open panel
   → no collision.
3. *How do I show "the call returned"?* Ring flips green as the parent lands →
   return = parent whole again.
4. *How does the result reach the parent?* `<workflow.result>` resolves to
   `"billing"`; edge-2 pulse finally fires → the run continues, the absence in
   scene 3 paid off.
5. *How do I end?* Revert every resolution and ring → the resting parent scene 6
   needs.

## Exit state (what scene 6 inherits)

`parent chain at rest · all resolutions reverted (rows back to template) · no
rings · no green · edges full · camera identity · dots identity`. Identical to
scene 2's exit. Scene 6 opens on this resting parent and folds it one level up.

<!-- subworkflows / 05b-back-with-the-result-v1.md -->
# Scene 5 (v1 take) — `back-with-the-result` fold-back  ·  archetype: **fold (the move, reversed) + run completion**

Source: `../source/scenes/BackWithTheResultV1Scene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`. The **original** take, paired with the v1
zoom-through scene 4 (`04b-inside-the-call-v1.md`) and superseded by the accepted
expand-beneath cut (`05-back-with-the-result.md`). Read after the accepted
version.

---

## What this take is for

Same beat intent: **the child's final response comes back as the block's result.**
The difference is the *return geometry*. Because the v1 scene 4 left the viewer at
the child canvas at full-frame identity (the camera had pushed all the way
through the block), v1 scene 5 must *fold the child back into the block* — the
literal fold, run as the closing half of the unfold/fold pair. It's the most
symmetric use of the move in the video: scene 2 folded the child in, scene 4
pushed through, scene 5 folds it back.

## What it looks like

Opening on scene 4-v1's held frame (the completed green child at full-frame
identity), the camera pulls out: the child world folds down into the Workflow
block's footprint while the parent world simultaneously returns from its
pushed-in framing. As the fold lands, the block's ring flips live-blue → ok-green.
The run then resumes exactly as in the accepted cut (edge-2 pulse,
`<workflow.result>` → `"billing"`, settle, hold, revert).

## The real decisions — the dual-layer pull-out

```tsx
const out      = c(0.6, 2.8, EASING.inOut); // one camera move, two layers
const z        = 1 - out;                    // parent un-pushes  (pushTransform)
const parentOp = c(0.9, 1.7);                // parent fades in
const childOp  = 1 - c(1.8, 2.6);            // child fades out

// child layer — folds into the block:
<div style={{opacity:childOp, transform: foldTransform(SLOT_BLOCK_CENTER, out)}}>
  <ChildChain ... all ok-green ... />
</div>

// parent layer — un-pushes back to identity:
<div style={{opacity:parentOp, transform: pushTransform(z)}}>
  <ParentChain wf={{highlighted:!wfOk, state: wfOkHeld?"ok":"none"}} ... />
</div>
```

The elegant part: **one progress value (`out`) drives both layers in opposite
directions.** As `out` goes 0→1:

- the **child** folds in via `foldTransform(SLOT_BLOCK_CENTER, out)` — shrinking
  to the block footprint (note `SLOT_BLOCK_CENTER`, y=551, the 2-row block's
  center, because the block is fully configured by now);
- the **parent** un-pushes via `pushTransform(1 - out)` — `z` going 1→0 returns
  the parent from its scene-4 blown-up framing to identity.

So the child collapses into the block at the same moment the parent resolves
around it from the push. The two transforms are the two halves of "the inside
returns to its container and the container is back in its chain," driven by a
single clock. This is the move at its most economical.

> *"Why fold to `SLOT_BLOCK_CENTER` here but scene 2 folded to
> `SLOT_HEADER_CENTER`?"* Because the block now has both its rows (it's the 162px
> 2-row block, center y=551), whereas in scene 2 the fold landed on a header-only
> block that hadn't grown its rows yet (center y=501). Always fold to the actual
> center of the block as it exists at that moment.

## Why this take was superseded

It's the cleanest, most symmetric use of the fold/unfold in the whole video — and
it went out with the zoom-through it was paired to. Once the director replaced the
scene-4 push-through with expand-beneath (to keep the parent on screen during the
child's run), the held frame scene 5 inherits changed: there's no full-frame child
to fold back, there's a panel to retract. So this fold-back was replaced by the
accepted cut's panel-retract. The lesson is the same one the scene-4 pair teaches:

> **The move is beautiful and you will be tempted to keep it for its own sake.**
> This fold-back is arguably the prettiest single transition in the video. It was
> cut anyway, because its *partner* scene 4 hid the concept. Symmetry and elegance
> don't override teaching — if the entry move was wrong, the matching exit move
> goes with it, however nice it looks in isolation. Keep both takes renderable
> (takes culture) so the craft decision stays legible, but ship the one that
> teaches.

## The animation, beat by beat

From `wfOk = t >= 2.7` onward this take is essentially the accepted cut shifted
~0.3s earlier (the fold-back lands at 2.7s vs the panel-retract's 3.0s): edge-2
`pulse2 = c(3.3,3.95)`, `<workflow.result>` resolves to `"billing"`, Agent live
3.9–4.9s, green settle 5.2/5.6s, hold, revert via `revert = 1 - c(7.2,7.6)`. The
return mechanics are identical; only the *entry geometry* (fold-back vs retract)
differs.

### The pull-out — `out = c(0.6, 2.8, EASING.inOut)`

0.6s hold on the frozen frame (freeze-cut seam), then the dual-layer pull-out over
**0.6–2.8s** on ease-in-out. The crossfade is offset as always: the child holds
opaque until 1.8s (nearly folded) then fades 1.8–2.6s, while the parent fades *in*
over 0.9–1.7s — so at the swap the parent is resolving as the child collapses into
the block.

> *"Two camera transforms running opposite at once — does that read as confusing?"*
> No, because they share a center: the child folds *toward* `SLOT_BLOCK_CENTER`
> and the parent un-pushes *around* that same block. Both motions converge on the
> Workflow block, so the eye has one focal point — the block — and reads "the
> inside is collapsing back into this block, and here's the block back in its
> chain." Convergent motion toward a shared point reads as one event; divergent
> motion would read as chaos.

## How to think about the whole take

1. *How does the inside return?* Fold the child back into the block (the move,
   reversed) → symmetric with scene 2's fold-in.
2. *How do I bring the parent back too?* Un-push it (`pushTransform(1-out)`)
   driven by the same clock → one progress, two converging layers.
3. *Where does it fold to?* `SLOT_BLOCK_CENTER` — the 2-row block's actual center.
4. *Why was it cut?* Its partner (scene-4 push-through) hid the concept; the pair
   went together → elegance yields to teaching.

## Exit state

Same resting parent as the accepted cut (all reverted, no rings, identity) — so
scene 6 inherits the same clean parent regardless of which scene-5 take ran.

<!-- subworkflows / 06-workflows-all-the-way-up.md -->
# Scene 6 — `workflows-all-the-way-up`  ·  archetype: **fold (the bookend) + settle**

Source: `../source/scenes/WorkflowsAllTheWayUpScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`.

This is the closing scene and the payoff of the whole video: the move runs one
last time, **on the parent itself.** The parent chain you've been watching folds
into a single Workflow block inside a yet-bigger chain. It is the recursion
bookend — the container becoming the contained — and it proves the thesis
recurses without a single number on screen.

---

## What this scene is for

One idea: **a parent is itself a workflow, so it too can be a block — composition
goes all the way up.** Scene 2 taught "a workflow becomes a block" by folding the
child. Scene 6 closes the loop by folding the *parent* — the thing that did the
calling is now itself a callable step. The takeaway the viewer leaves with: keep
each workflow small and call it anywhere; this nests indefinitely.

## What it looks like

On the resting parent from scene 5, the camera eases back and the whole parent
canvas folds into a single indigo Workflow block at the center of a header-only
outer chain (Start → Workflow → Agent, names only). One pulse crosses into the
block — a single blip on it, the entire story compressed to one beat — a pulse
out, and the outer chain holds, balanced and still. End of video.

## The real decisions

```tsx
const fold     = c(0.5, 2.6, EASING.inOut);
const parentOp = 1 - c(1.7, 2.4);

{parentOp > 0 ? (
  <div style={{opacity:parentOp, transform: foldTransform(SLOT_HEADER_CENTER, fold), transformOrigin:"0 0"}}>
    <ParentChain start={{}} wf={{}} agent={{}} edge1={{}} edge2={{}} />
  </div>
) : null}

<OuterChain
  start={{opacity: startOp}}
  wf={{opacity: wfOp, highlighted: wfBlip}}
  agent={{opacity: agentOp, highlighted: agentBlip}}
  edge1={{progress: edge1}} edge2={{progress: edge2}}
/>
```

Three decisions:

**It's the exact same fold as scene 2 — same function, same target, same center
slot.** `foldTransform(SLOT_HEADER_CENTER, fold)` folds the parent into the
header-only block center (y=501) at `blockX(1)` — the identical landing as scene
2. This is deliberate and it's the whole point of the bookend: the viewer's eye
recognizes the move instantly ("oh, the fold again"), and that recognition frees
all their attention for the one new idea — *this time it's the parent folding,
not the child.* Reusing the move verbatim is what makes the recursion read.

**What folds is the full parent chain; what it lands in is a header-only block.**
The folded parent (Start → Workflow → Agent, with all its config) collapses into
a single nameless `Workflow` block in the outer chain. The outer chain is
header-only — no config rows — because nothing about the outer level needs
grounding or explanation; its job is purely to say "there's another level here,
and the whole thing you just learned is one block in it."

**The center slot is, again, the Workflow block.** Across child, parent, and outer
worlds, the thing in the center slot is always what the next level treats as one
step. The geometry has taught this by repetition: center slot = the contained
workflow.

## The values, and where they come from

No row values — the outer chain is header-only (`Start` / `Workflow` / `Agent`
names only), per `grounding-v1.md` and the batch assumption that nothing
un-grounded appears. The second-level block is named `Workflow` (the registry/
docs-example name), not `Workflow 2` — instance numbering is a workspace artifact
that can't be grounded without a live run.

## The animation, beat by beat

`c(lo, hi, easing?)`: ease-in-out on the fold, ease-out on the assemble, linear
on the pulses.

### (a) The bookend fold — `fold = c(0.5, 2.6, EASING.inOut)`, `parentOp = 1 - c(1.7, 2.4)`

The parent folds over **0.5–2.6s** — a touch quicker than scene 2's 0.5–2.8s.

> *"Why faster than the first fold?"* Because the grammar is now established. Scene
> 2's fold had to be slow enough to *teach* the move (the viewer was seeing it for
> the first time). By scene 6 the viewer reads the fold instantly, so it can move a
> little quicker without losing legibility — and a slightly snappier fold reads as
> "you already know this move; here it is again, one level up." Spending less time
> on the familiar move is itself a signal that the move is familiar.

The parent crossfades out late (`1 - c(1.7,2.4)`) as the outer block fades in
(`wfOp = c(2.1,2.7)`) — the same offset-crossfade trick, so the swap is invisible.

### (b) The outer chain assembles — `startOp = c(2.9,3.4)`, `agentOp = c(3.1,3.6)`, edges `c(3.3,3.7)` / `c(3.5,3.9)`

After the fold lands, the outer Start and Agent fade in and the edges draw on —
same left-to-right, block-then-edge cadence as scenes 1 and 2's assembles, but
tighter (0.2s offsets vs 0.5s).

> *"Why a tighter assemble here?"* This is a recap, not a teach. The outer chain
> exists to frame the recursion, not to be studied. A quick assemble says "and it
> sits in a bigger flow" without dwelling — the dwelling beat is the fold itself.

### (c) The compressed pulse — `pulse1 = c(4.4,5.05)`, `wfBlip 5.0–5.6s`, `pulse2 = c(5.6,6.25)`, `agentBlip 6.2–6.7s`

One pulse crosses into the outer Workflow block (4.4–5.05s), the block **blips**
(5.0–5.6s), a pulse crosses out (5.6–6.25s), the outer Agent blips (6.2–6.7s).

> *"Why run the outer chain at all — isn't the fold the point?"* The single blip
> on the outer Workflow block is the third run of the video, and it does one
> precise job: it proves the recursion claim by showing the parent now *behaves
> exactly as the child did.* The entire mechanism of scenes 3–5 — park, run
> inside, return — is compressed into one blip on the block. "The whole video,
> replayed as a beat." It says: at this level, that parent is just a block that
> runs and returns, same as every other block. One blip carries the recursion;
> a full run would re-teach what scenes 3–5 already taught.
>
> *"Why is it just a blip and not a full handoff/return like scene 3–5?"* Because
> teaching the mechanism again would be redundant and long. The compressed blip
> trusts the viewer to fill in "and inside that block, the same thing happens" —
> which is exactly the recursive insight the scene wants them to have on their own.

### (d) The hold — to scene end (visual min 8s; VO 13s)

The outer chain rests, balanced and still. This is the final frame of the video.

> *"A 13s scene that's mostly hold — why so long?"* The VO tail carries the
> closing line ("keeping workflows small and calling them from each other is how
> large systems stay manageable"). The scene ends on a settled, balanced
> three-block chain — symmetric, centered, nothing mid-motion — which is both the
> right note to end on and a frame that stretches safely to whatever the narration
> needs. Balance matters especially in the last frame: a lopsided final image
> reads as unfinished.

## How to think about the whole scene

1. *How do I prove composition recurses?* Fold the *parent* — same move as scene 2,
   one level up → recognition does the teaching.
2. *Why reuse the exact fold?* So the only new variable is "it's the parent now"
   → all attention on the recursion.
3. *How do I imply infinite nesting without a number?* The compressed blip on the
   outer block → "the whole story, one beat; and it keeps going."
4. *How do I end?* Balanced header-only chain at rest → a clean, symmetric final
   frame the audio can stretch.

## Exit state (end of video)

`outer chain at rest · header-only Start / Workflow / Agent · no rings · edges
full · camera identity · dots identity`. No following boundary — this is the last
frame. The video has gone child → block (scene 2 fold) → run-inside (3–5) → parent
→ block (scene 6 fold), and the move that opened the thesis is the move that
closes it.

### custom-tools

<!-- custom-tools / 01-a-tool-in-action.md -->
# Scene 1 — `a-tool-in-action`  ·  archetype: **assemble + run**

Source: `../source/scenes/AToolInActionScene.tsx`, `../source/scenes/_local.tsx`,
`../source/layout.ts`, and the module-5 set piece it reuses verbatim:
`src/videos/module-5-agents/scenes/_v3.tsx` (`TriageChain`, `runBeats`,
`CHIP_DOCS / CHIP_CRM / CHIP_SEARCH_V3`).

This is the opening scene, and it does one thing: it shows you a chip you've
already seen fire — and quietly re-labels it. The whole video turns on the
sentence "that CRM chip is a custom tool somebody wrote," and this scene is the
only place that sentence can be made true *for free*, because the audience
literally watched the call happen in module-5. Read it as the bookend's first
half — scene 5 is the matching close.

---

## What this scene is for

The video's thesis is "a custom tool is two parts — a schema the model reads and
code that runs — and once saved it sits on the agent's table like any built-in."
That thesis only lands if the viewer believes a custom tool is an *ordinary*
thing, not an exotic SDK project. So scene 1 doesn't introduce custom tools; it
re-introduces a chip the audience already knows, on a chain they already know,
running an input they already saw resolve. The re-label is the payload: **one of
these three chips was written by someone on this workspace, and you watched it
work.** Everything after this is "here's how that one was built."

This is *capability-first* orientation: never open on a manufactured problem
("imagine you need weather data…"). Open on the known, running, and only then
crack it open. The run here is not decoration — it is the evidence. Without the
live CRM ring, the anatomy in scenes 2–4 floats free of any reason to care.

So the one-idea-per-scene rule reads as: this scene is "your agent acts through
its tools, and you've already watched one of them — a custom one — fire." No
editor, no schema, no save. Those get their own scenes.

## What it looks like

The module-5 Triage chain assembles left to right: `Start · Input` → `Triage`
(an Agent block carrying three tool chips: Docs / CRM / Search) → `Slack`
response block, joined by two wires. Then one compressed run plays: the input
"I was charged twice" resolves into Start's Input row, a pulse travels the first
wire, Triage lights live — and *while it's live, the CRM chip rings* — a second
pulse travels, and "billing — double charge" resolves into the response block.
Everything then reverts to template rest before the cut.

## The one real decision: reuse the set piece exactly, don't rebuild it

The scene imports `TriageChain` from module-5 and renders it. It does not define
a chain. The chips are the module-5 chips (`CHIP_DOCS`, `CHIP_CRM`,
`CHIP_SEARCH_V3`) imported by name. The geometry comes from module-5's
`layout.ts`, re-exported through this video's `layout.ts` unchanged.

> *"Why reuse instead of building a fresh, simpler chain?"* Two reasons, and both
> are load-bearing. First, **series continuity**: if this chain is pixel-for-pixel
> the chain from module-5, the audience reads it as the same world, the same
> workspace, the same agent — which is exactly the claim the narration makes
> ("you've watched this one fire"). A new chain would silently undercut the
> re-label. Second, **the run artifact is real**: module-5's `triage-run.md` is a
> live run from the beaming-polaris workspace (2026-06-10) that *actually
> contains* a `customerLookup` custom-tool call (375ms). Reusing the set piece
> lets every value on screen trace to that artifact instead of being invented.
> The lesson generalizes: when a prior video already established the object your
> new video is about, import it; don't paraphrase it.

## The chip-ring = tool-call sync — the mechanism to steal

This is the scene's craft centerpiece and it recurs in scene 5, so understand it
fully here. A chip's ring is a single 0..1 number on the `SimBlockTool`:

```ts
// SimBlock.tsx — the chip's selection ring is product state, not decoration
{(tool.ring ?? 0) > 0 ? (
  <div style={{
    boxShadow: `inset 0 0 0 ${1.5 * S}px ${C.ring}`,
    opacity: tool.ring,
  }} />
) : null}
```

The scene drives that number with a windowed pulse that is *timed to sit inside
the agent's live window*:

```ts
const run = runBeats(t, 2.8, {midDur: 2.4, hold: 0.6}); // Triage live ≈ 2.8 → 5.2
const crmRing = interpolate(t, [4.3, 4.6, 5.6, 6.0], [0, 1, 1, 0], { clamp both });
// ...
tools: [CHIP_DOCS, {...CHIP_CRM, ring: crmRing}, CHIP_SEARCH_V3]
```

The ring rises at 4.3s, holds, and falls by 6.0s — entirely *within* the window
where Triage is highlighted-live. That containment is the whole point.

> *"Why does the timing matter so much — couldn't the ring fire any time?"* No.
> The ring is making a causal claim: **the agent is thinking, and mid-thought it
> reaches for this tool.** If the ring fired before the block went live, or
> lingered after it settled, the picture would say something false — a tool
> calling itself, or a tool firing when nothing's running. The ring lives inside
> the live window because a tool call lives inside an agent's turn. This is rule
> 2 ("indicate state with visuals, not words") applied to the hardest case: the
> *moment* of a tool call, shown by where in time a ring appears, with zero text.
>
> *"Why only the CRM chip — why not ring all three?"* Because the run resolves a
> billing complaint, and in the real artifact that's the call the agent made.
> One chip rings because the agent reached for one tool. Ringing all three would
> turn a precise causal statement into ambient activity. The single ring is the
> sentence "it called *this* one."

Internalize the shape: **a tool call is a ring on a chip, scoped to the live
window of the block that owns it.** Scene 5 reuses this exact mechanism to make
the closing point — and the contrast there (CRM rings, the new Weather chip
stays quiet) is only legible because scene 1 taught you that a ring means "the
agent chose this."

## The values, and where every one comes from

| On screen | Source |
|---|---|
| Chain shape (Start·Input / Triage / Slack) | module-5 `TriageChain`, reused verbatim |
| Chips Docs / CRM / Search | module-5 condensed names; the real run's toolset |
| Input "I was charged twice" | `triage-run.md` (condensed, module-5 precedent) |
| "billing — double charge" | `triage-run.md` resolved category |
| CRM ring (the call) | `triage-run.md` toolCall 1 — `customerLookup`, real |

Nothing here is invented. The grounding table in `script-v1.md` is the contract;
the discipline is that a re-label only works if the thing being re-labeled is
demonstrably the real thing.

## The animation, beat by beat

`reveal(t0, dur)` is a clamped ease-out opacity ramp. `runBeats(t, start, …)`
is module-5's run choreographer — it returns the blip/live/resolve mixes and the
two wire-pulse progresses for one pass of the chain, so the run reads identically
to how it read in module-5.

### (a) The chain assembles — staggered block reveals + edges drawing on

`start` at `reveal(0.5)`, `mid` at `reveal(1.0)`, `response` at `reveal(1.5)`;
edges draw with `reveal(0.9, 0.5)` and `reveal(1.4, 0.5)`; the chips appear with
`toolsReveal: reveal(1.0)`.

> *"Why assemble at all — couldn't it just be present?"* The assembly is the
> "orient from the known" gesture: blocks arrive in causal order (input source,
> then the agent, then where it answers), so before any run happens the viewer
> has re-seated the chain in memory. The chips reveal *with the Triage block*,
> not after — because they're part of what the block IS, and `toolsReveal` grows
> the chip row's height so the block expands into them rather than popping.

### (b) One run plays — `runBeats(t, 2.8, {midDur: 2.4, hold: 0.6})`

The run starts at 2.8s. `midDur: 2.4` is a deliberately *long* thinking window.

> *"Why stretch the live window to 2.4s?"* So the tool call has room to read.
> In module-5 the run could be brisk; here the ring is the most important event
> in the scene, and a ring needs the block to be visibly live long enough that
> the eye registers "agent thinking → chip lights → agent done." A short live
> window would crush the ring against the resolve and blur the causality. Pace
> is being spent precisely where the lesson is.

### (c) The CRM ring fires inside the live window — covered above

It rises 4.3→4.6, holds to 5.6, falls by 6.0 — nested inside the ~2.8→5.2 live
window. This is the beat the whole scene exists to deliver.

### (d) Everything reverts to template rest

By the scene's end the resolutions clear, the ring is gone, the chips sit
unringed, the chain is back to its neutral template state.

> *"Why revert instead of holding the resolved state?"* Because of the boundary
> into scene 2. Scene 2 opens on the chain *at rest* and then dims it to raise
> the editor. If scene 1 ended mid-resolution, the cut would either freeze a
> motion or force scene 2 to animate a state it didn't cause. Ending on template
> rest makes the 1→2 boundary identical by construction (same three chips, no
> rings, no resolutions, camera identity) — continuity you can't break rather
> than continuity you have to police. It also means scene 1 can be *extended* to
> fit however long the narration runs (the VO timing stretched it from 10s to
> 12.6s) without stranding a half-finished animation.

## How to think about the whole scene

1. *What's the object?* A chain the audience knows → import module-5's, verbatim.
2. *What's the claim?* "One of these chips is custom" → make it true by reusing
   the real run, not by asserting it.
3. *How do I show a tool call without words?* A ring on the chip, scoped inside
   the agent's live window → product state language, the move scene 5 reuses.
4. *Which chip rings?* Only the one the real run called → one ring is a sentence.
5. *How does it end?* Reverted to template rest → the 1→2 boundary is free and
   the scene can stretch to the VO.

## Exit state (what scene 2 inherits)

`Triage chain at template rest · three chips (Docs/CRM/Search), no rings · no
resolutions · camera identity`. Scene 2 opens on exactly this frame, then — after
frame 0 — dims the chain to 0.35 and raises the editor panel. Because both scenes
render the same `TriageChain` at the same geometry, that boundary is pixel-stable.

<!-- custom-tools / 02-the-schema.md -->
# Scene 2 — `the-schema`  ·  archetype: **zoom-aside**

Source: `../source/scenes/TheSchemaScene.tsx`, `../source/scenes/_local.tsx`
(`SCHEMA_LINES`, `TOOL_PARAMS`), `../source/layout.ts` (`PANEL_*`), and the
ported editor `src/components/ToolEditorPanel.tsx`.

This is the first half of the distinctive move — the **tool-editor anatomy**. The
video's whole reason to exist is "a custom tool is two parts." This scene opens
the actual product editor and shows you part one: the schema, the only thing the
model ever reads. Read it as the worked example of how to *port a complex product
surface* and then *teach it with the product's own selection color* instead of
arrows and captions.

---

## What this scene is for

After scene 1 you believe custom tools are ordinary. Now the question planted in
your head is "so what *is* one?" The answer is two-part, and this scene delivers
exactly one part: the schema. The schema is "the only thing the agent ever
sees" — name, description, parameters. The scene's job is to walk you through
that JSON in the order the model reads it (what's it called → what's it for →
what does it need) while never writing a single explanatory word on screen.

One idea per scene: this is "here is the schema, and here is what each part of it
tells the model." The code is part two — its own scene. Cramming the code tab in
here would make the editor do two things at once and blur the cleanest fact in
the whole video (there are exactly *two* parts).

## What it looks like

The world dims: the Triage chain drops to 0.35 opacity and recedes. The
**Create Agent Tool** editor rises into center frame on its Schema tab — a real
modal with a header, Schema | Code tabs, a "JSON Schema" label, a "Generate"
button, the editor pane, and a footer (Cancel / Next). The `get_weather` schema
reveals top to bottom, line by line. Then a selection-blue wash sweeps the parts
the model reads: the `"name"` line, then the `"description"` line, then the whole
`city` parameter block, then the whole `units` block — each held briefly, the
previous one releasing as the next lights. The washes clear; the panel rests.

## The big decision: port the *whole* editor as a configurable component

The editor is not drawn per-scene. It's a single ported component,
`ToolEditorPanel`, that scenes 2, 3, and 4 all render — the same way the
market-desk videos render one `<Stage/>` set piece across every scene. The
component is a verbatim port of the product modal, with every metric traced in
its header comment to real source files:

- Modal chrome (`emcn/modal.tsx`): size-xl `max-w-[800px]`, `rounded-xl`,
  header `px-4 pt-4 pb-2` with a 16px close X, tabs `px-4 gap-4` with a 1px
  active indicator, body `px-4 pt-3 pb-4`, footer `border-t px-4 py-3` on 50%
  surface-3.
- Editor (`emcn/code/code.tsx` + `code.css`): `CODE_LINE_HEIGHT_PX = 21`, 20px
  gutter, `text-xs tabular-nums` line numbers, 13px code, the Prism token
  palette for **both** themes, param/`{{ENV}}` blue.
- Buttons (`emcn/button.tsx`): variants default / active / primary at real
  paddings and radii.

> *"Why port the chrome down to `pb-2` and `tabular-nums`? Nobody reads a footer
> padding."* Because authenticity is cumulative and invisible. No single metric
> is noticed; the *sum* is the difference between "that's the Sim editor" and
> "that's a code box someone drew." This is rule 8 (mirror Sim's real UI) at its
> most demanding: the editor is a dense, chrome-heavy surface, and the only way
> it reads as real is to port it as a unit from the source, re-deriving every
> color from the current `globals.css` rather than from memory. The payoff is
> that the audience never questions the surface, so all their attention is free
> for the schema itself.

**The component never animates itself.** Every moving value enters as a numeric
0..1 prop computed by the scene: `opacity`, `slide`, `tab`, `schemaReveal`,
`codeReveal`, `glow`, `paramGlow`, `savePress`. The port is a pure function of
its props; the scene owns the clock. That separation is what lets three scenes
share one editor and stay continuous across their boundaries.

## The schema content is the docs' own example, verbatim

`SCHEMA_LINES` in `_local.tsx` is the `get_weather` schema copied byte-for-byte
from `apps/docs/content/docs/en/tools/custom-tools.mdx` — the product's *own*
authored teaching example — then tokenized span by span to match the product's
Prism theme.

> *"Why use the docs' example instead of inventing a cleaner one, or
> reconstructing module-5's `customerLookup`?"* Two rules collide and both point
> the same way. Inventing values violates grounding (every on-screen value must
> trace to a real artifact). Reconstructing `customerLookup` would mean inventing
> its unpublished schema. The docs' `get_weather` is the one schema that is both
> real and publishable — it's what Sim itself uses to teach this. Use the
> product's own teaching artifact when it exists; don't out-design the docs.

Note the tokenization carries `hl` group tags (`name`, `desc`, `city`, `units`)
on the relevant lines. Those tags are the *anchors the selection wash paints
behind* — the content and the highlighting share one data structure, so a wash
can never drift off the line it's meant to mark.

## The teaching move: the product's selection color, not arrows

There is no callout box, no arrow, no "← the name" label anywhere. The scene
teaches purely by painting the product's **text-selection color**
(`--selection-dark` #264f78 in dark, `--selection-bg` #add6ff in light) behind
the lines being discussed, in reading order. That's it.

```ts
const wash = (a,b,c,d) => interpolate(t, [a,b,c,d], [0,1,1,0], { clamp both });
const glow = {
  name:  wash(3.4, 3.8, 4.8, 5.2),
  desc:  wash(5.4, 5.8, 6.8, 7.2),
  city:  wash(7.4, 7.8, 8.6, 9.0),
  units: wash(9.0, 9.4, 10.2, 10.6),
};
```

Each `wash` is a four-point pulse: fade up (a→b), hold (b→c), fade down (c→d),
clamped flat outside. The editor renders `glow[line.hl]` as a selection-colored
rectangle behind the line at `0.55 * value` opacity.

> *"Why the selection color specifically — why not a yellow highlight or a
> glow?"* Because selection is what a human does when reading code to someone:
> you drag-select the line you're talking about. The viewer has seen text
> selection ten thousand times; it reads instantly as "look here, this is what
> I mean" with no learning curve and no foreign vocabulary. A yellow marker or a
> neon glow would be an invented annotation language — slop. The selection wash
> is rule 8 applied to *pointing*: even the act of drawing attention uses a
> product affordance, not a graphic-design overlay.
>
> *"Why hold each wash for ~1s and release before the next?"* So exactly one
> thing is focal at a time (rule 7). The release of `name` before `desc` lights
> means you're never reading two highlights at once; your eye is walked down the
> schema one fact per beat. The overlap is deliberately tiny — `units` starts at
> 9.0 just as `city` finishes at 9.0 — a clean handoff, not a dissolve.

## The reveal order encodes the lesson

The wash order is `name → description → city → units`, which is precisely "what
is it called → what does it do → what does it need." That's the order the model
reads the schema to decide whether and how to call the tool. The animation
*is* the explanation of how an agent uses a schema; the narration only has to
name what the picture is already doing.

> *"Why are `city` and `units` washed as whole multi-line blocks, while `name`
> and `description` are single lines?"* Because a parameter is a unit — its
> type, its description, its enum are one thing the model reads together. The
> `_local.tsx` data tags every line of the `city` object with `hl: "city"`, so
> the wash lights the whole block as one selection. This silently teaches "a
> parameter is more than its name" without a word about JSON Schema structure.

## The aside mechanics — dim the world, raise the panel

```ts
const aside = interpolate(t, [0.3, 1.2], [0, 1], { ease inOut });
// chain: start/mid/response dim={aside}; edges opacity 1 - 0.75*aside
// panel mounts only when aside > 0; opacity & slide both = aside
```

The single `aside` value drives both halves of the move: the chain dims toward
0.35 *and* the panel fades+rises (the `slide` prop translates it down-to-up by
36px as it appears). One clock, two coordinated motions, so the world receding
and the editor arriving are the same gesture rather than two stacked animations.

> *"Why dim the chain to 0.35 instead of cutting to a clean editor on black?"*
> Because the chain is the *context* the editor belongs to — keeping it dimly
> present says "you're still in your workflow; this panel is a thing you opened,
> not a different place." Cutting it away would sever the editor from the agent
> it's a tool for. The dim is the zoom-aside's defining property: the world
> doesn't leave, it recedes.

## The animation, beat by beat

1. **0.3 → 1.2s** — `aside` ramps: chain dims, editor rises and fades in (Schema
   tab, empty editor).
2. **1.4 → 2.8s** — `schemaReveal` ramps the 22 lines top-to-bottom (the editor's
   per-line stagger: `opacity = clamp01(reveal*(n+2) - i)` gives each line its
   own staggered fade keyed to its row index).
3. **3.4 → 5.2s** — `name` wash up/hold/down.
4. **5.4 → 7.2s** — `description` wash.
5. **7.4 → 9.0s** — `city` block wash.
6. **9.0 → 10.6s** — `units` block wash; clears.
7. **tail** — panel at rest, Schema tab, all lines revealed, washes clear. The
   scene holds here and can stretch to the VO (timed to 15.8s).

> *"Why does the reveal (b) finish at 2.8 but the first wash not start until
> 3.4?"* Same discipline as every clean scene: let the surface fully arrive and
> settle, hold a half-second of stillness, *then* start pointing. Overlapping the
> line-reveal with the first selection would stack two animations and read busy.

## Exit state (what scene 3 inherits)

`world dimmed (chain at 0.35) · editor open on the Schema tab · all 22 lines
revealed · all washes cleared · panel at rest`. Scene 3 opens on exactly this
frame and then — inside scene 3 — slides the tab indicator from Schema to Code.
The schema→code morph happens *within* scene 3, never on the boundary, so the
2→3 cut is identical on both sides.

<!-- custom-tools / 03-the-code.md -->
# Scene 3 — `the-code`  ·  archetype: **morph-swap (tab switch) + two-surface sync**

Source: `../source/scenes/TheCodeScene.tsx`, `../source/scenes/_local.tsx`
(`CODE_LINES`, `TOOL_PARAMS`), `../source/layout.ts`, `ToolEditorPanel.tsx`.

This is the second half of the tool-editor anatomy, and it carries the most
sophisticated single beat in the video: the **two-surface sync** — a schema
parameter and its use as a code variable lit *at the same instant on two
different product surfaces*, so the equivalence is shown rather than stated.
Read it as the worked example of the house "synchrony" move: when two things are
the same thing, prove it by animating them together.

---

## What this scene is for

You've seen part one (the schema, what the model reads). This scene delivers part
two: the code, what actually runs when the agent calls the tool. The fact the
scene must land is the one that's invisible in the static UI — *the parameters
you declared in the schema simply exist as variables in your code.* Then two
riders: secrets arrive as `{{KEY}}` placeholders, and whatever you `return` is
what the agent gets back. That's the entire mental model of writing a tool body,
delivered without a sentence on screen.

One idea per scene, stated precisely: this is "the code half, and how the schema
connects to it." The connection — schema param becomes code variable — is the
load-bearing beat; everything else in the scene serves it.

## What it looks like

Continuing from scene 2's exit, the editor's 1px tab indicator **slides** from
Schema to Code; the panel content crossfades from the schema JSON to the
function body at *constant panel height*. Above the editor sits the product's
real **"Available parameters: city units"** badge row. Then the sync beats fire:
the `city` badge pulses while `${city}` in the code takes the selection wash —
same moment, two surfaces — then the same for `units`. Then
`{{OPENWEATHER_API_KEY}}` takes the wash (it already renders env-var blue).
Finally the whole `return { … }` block takes the wash and holds. Washes clear;
panel rests on the Code tab.

## The morph-swap: tab switch at constant height

The tab change is not a cut and not a dip-to-blank. It's the canonical
morph-swap: the two contents crossfade through each other while the panel frame
holds perfectly still.

```ts
const tab = interpolate(t, [0.6, 1.4], [0,1], { ease inOut }); // 0=Schema, 1=Code
// inside ToolEditorPanel:
const schemaOp = clamp01((0.7 - tab) / 0.4); // schema fades out over the middle
const codeOp   = clamp01((tab - 0.3) / 0.4); // code fades in over the middle
// the 1px indicator interpolates left+width between the two trigger boxes
```

The indicator's `left` and `width` interpolate between the measured Schema tab
(55px) and Code tab (41px) boxes, so the product's own active-tab underline
physically slides and resizes between the two labels.

Crucially, the panel does **not** change height. The component pre-computes fixed
editor heights so the swap is height-stable:

```ts
SCHEMA_EDITOR_H = 22*21 + 17 = 479
CODE_EDITOR_H   = SCHEMA_EDITOR_H - PARAMS_ROW_H(36) - PARAMS_ROW_MB(8) = 435
```

The Code tab is shorter by exactly the height of the "Available parameters" row
plus its margin, so the *total* body height is identical across tabs. The schema
tab stays mounted in flow at `opacity: schemaOp` (not unmounted) precisely to
hold that height during the crossfade.

> *"Why obsess over constant height?"* Because the editor is a persistent element
> across scenes 2–4 (rule 4: never teleport a persistent element). If the panel
> grew or shrank on the tab switch, the viewer would read it as two different
> panels appearing, not one panel showing two faces of the same tool. Height
> stability is what makes "Schema" and "Code" read as *tabs of one editor* — which
> is the literal claim the video makes about the two parts being one tool. The
> continuity *is* the content here.
>
> *"Why crossfade instead of cut?"* A hard cut would read as a context change. A
> crossfade through the middle, with the indicator sliding, reads as "the same
> surface, turning to its other side." The morph-swap is the archetype for "X and
> Y are two views of one thing," and that's exactly the schema/code relationship.

## The distinctive beat: two-surface sync

This is the move worth stealing. The product gives you *two* surfaces that say
"these are your parameters": the **Available parameters badge row** (real product
UI in the Code tab) and the **blue-rendered param names inside the code**
(`${city}`, `${units}`, which the product's `highlightVariables` paints blue).
The scene lights both at the same instant from one shared value:

```ts
const cityW  = wash(3.5, 3.9, 4.9, 5.3);
const unitsW = wash(5.5, 5.9, 6.7, 7.1);

glow      = { "p-city": cityW, "p-units": unitsW, env: wash(7.7,…), ret: wash(9.9,…) };
paramGlow = { city: cityW, units: unitsW };   // SAME values feed the badges
```

`cityW` drives *both* the selection wash behind `${city}` in the code (`glow`)
*and* the pulse on the `city` badge above it (`paramGlow`) — one number, two
surfaces, identical timeline. The badge pulse is a scale-up plus a ring; the code
wash is the selection rectangle. They breathe together.

> *"Why go to the trouble of syncing two surfaces instead of just highlighting
> the variable?"* Because the fact being taught is an *equivalence*: the thing in
> the badge row and the thing in the code are the same parameter. The cleanest
> way to show "A is B" is to make A and B do the same thing at the same time —
> the eye binds them automatically, with no arrow drawn between them and no
> caption. If you only lit the code variable, you'd be showing "here's a blue
> word"; lighting both, together, shows "the parameter you declared is this
> variable." This is the synchrony move, and it generalizes: whenever two
> on-screen surfaces represent the same underlying thing, prove it by driving
> both from one frame-derived value.
>
> *"Why does the product even have two surfaces saying the same thing?"* Because
> the equivalence is non-obvious to users ("why do I describe parameters twice?"),
> so the product added the badge row as a teaching surface — and the video simply
> *uses the product's own teaching surface* rather than inventing one. Rule 8 and
> rule 1 at once: mirror the real UI, and let it carry the words.

## The remaining washes encode the two riders

After the param sync, two more washes, in order:

- **`{{OPENWEATHER_API_KEY}}`** (7.7→9.5) — it already renders in env-var blue
  (`#35b6ff` dark / `#1d4ed8` light, from `code.css`), so the wash just points at
  syntax the product already color-codes. The lesson — "secrets come in as
  `{{KEY}}`" — is half-told by the product's own coloring before the wash even
  fires. The wash just says "look, *that's* the secret."
- **the `return { … }` block** (9.9→11.7) — washed as a whole block (lines 7–11
  all carry `hl: "ret"`) and held slightly longer than the others. This is the
  rider "whatever you return is what the agent sees." Washing the whole block as
  one selection says "this entire object is the tool's output," and the extra
  hold gives the closing fact of the anatomy a beat to land.

> *"Why is the long fetch line soft-wrapped across two visual rows?"* The docs'
> URL line is one logical line, but rendered at the editor's width it would
> horizontal-scroll and push `{{OPENWEATHER_API_KEY}}` off-screen — killing the
> secrets beat. `_local.tsx` soft-wraps it (the second visual row has no line
> number, exactly as a real editor wraps). The *content* is byte-identical to the
> docs; only the display wraps. This is a sanctioned display adaptation, argued in
> `demo-corpus/get-weather-tool.md`: you may adapt display when the product itself
> would, but never the content.

## The animation, beat by beat

1. **0.6 → 1.4s** — `tab` slides Schema→Code; indicator translates+resizes;
   contents crossfade at constant height.
2. **1.5 → 2.7s** — `codeReveal` ramps the function body top-to-bottom.
3. **3.5 → 5.3s** — `city` sync: badge pulse + `${city}` wash, together.
4. **5.5 → 7.1s** — `units` sync: badge pulse + `${units}` wash, together.
5. **7.7 → 9.5s** — `{{OPENWEATHER_API_KEY}}` wash.
6. **9.9 → 11.7s** — `return { … }` block wash, held; clears.
7. **tail** — Code tab at rest, all washes clear (stretches to VO ≈ 17.1s).

The chain stays fully dimmed throughout (`dim: 1`, edges at 0.25) — scene 2
dimmed it; scene 3 just keeps it there, so there's no re-dim motion on the
boundary.

## How to think about the whole scene

1. *How do I get from schema to code?* Slide the product's own tab at constant
   height → one editor, two faces, never a teleport.
2. *How do I show "schema param = code variable"?* Drive the badge and the code
   variable from one value → the eye binds them; no arrow needed.
3. *How do I teach secrets?* Point at syntax the product already colors blue →
   the product half-told it; the wash finishes the sentence.
4. *How do I teach "return = what the agent sees"?* Wash the whole return block,
   held → the output is one object, and it's the last fact, so it lingers.

## Exit state (what scene 4 inherits)

`world dimmed · editor open on the Code tab · code fully revealed · all washes
cleared · panel at rest`. Scene 4 opens here and then runs the save/exit: the
Save Tool button dips, the panel slides out, the world undims. That save happens
*inside* scene 4, so the 3→4 boundary is identical on both sides.

<!-- custom-tools / 04-onto-the-table.md -->
# Scene 4 — `onto-the-table`  ·  archetype: **aside exit + capability-lands chip beat**

Source: `../source/scenes/OntoTheTableScene.tsx`, `../source/scenes/_local.tsx`
(`CHIP_WEATHER`), `../source/layout.ts`, `ToolEditorPanel.tsx`, and `SimBlock.tsx`
(the chip width-growth + ring mechanics).

This is the hinge of the whole video — **capability lands on the table.** The two
prior scenes were anatomy in a dimmed-away editor; this scene takes the thing you
just built and physically puts it back into the world, as a chip on the agent's
tool line. The single beat "Save Tool → a new chip grows onto the block" is the
sentence the entire piece is engineered to deliver. Read it as the worked example
of *closing an aside by paying its result back into the set piece.*

---

## What this scene is for

The thesis has two clauses: "a custom tool is two parts" (scenes 2–3) *and* "once
saved it sits on the agent's table like any built-in." This scene is that second
clause, made literal. The viewer has to *see* the abstract editor work become a
concrete chip on the same Triage block from scene 1 — because that's the moment
"I wrote a tool" stops being an SDK-project feeling and becomes "it's just another
chip." If this beat doesn't land, the anatomy was trivia.

One idea per scene: this is "save it, and it's on the table." Not "and here's how
the agent uses it" — that's scene 5. This scene ends the moment the chip has
settled into place.

## What it looks like

The **Save Tool** button dips (a brief press). The editor panel slides down and
fades out. The world undims — the Triage chain comes back up to full opacity,
edges brighten. Then, on Triage's tool line, a **fourth chip — Weather — grows
in** beside Docs / CRM / Search: it expands from zero width to full, pushing
nothing, and takes one brief selection pulse before settling. Camera untouched.

## The capability-lands move — how the chip beat is built

Two mechanisms compose to make "the saved tool lands as a chip." Both live in
`SimBlock.tsx` and are driven by per-chip 0..1 numbers.

**(1) Width-growth, so the chip arrives instead of popping.** A chip with
`opacity < 1` is rendered with a measured `maxWidth` scaled by its reveal, so it
expands horizontally into existence:

```ts
// SimBlock.tsx — the chip grows in width; the width is MEASURED, not guessed
...(chipOp < 1 ? {
  maxWidth: chipNaturalWidth(tool.name) * chipOp,
  marginLeft: -5 * S * (1 - chipOp),
} : {})
```

The scene feeds that `chipOp` via `chipReveal`:

```ts
const chipReveal = interpolate(t, [3.1, 4.0], [0,1], { ease out });
tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3, {...CHIP_WEATHER, opacity: chipReveal, ring: chipPulse}]
```

> *"Why width-growth and not a fade-in or a drop-in?"* Because the chip is
> *joining a row of existing chips*, and the only honest way to add to a row is to
> make room in the row. A fade-in would have the chip ghost into a fixed slot
> (where did the slot come from?); a drop-in would be a foreign motion the product
> never does. Growing from zero width is how a real tags/chips row behaves when an
> item is added — the row extends to hold it. And the width is **measured** with
> `@remotion/layout-utils` (`chipNaturalWidth`), not eyeballed, so the chip never
> clips its own border or overshoots its label mid-grow. This is rule 4 (never
> teleport a persistent element) applied to a *new* element: even arriving, it
> moves continuously into a real layout.

**(2) The selection pulse — "this one is new."** Right after it finishes growing,
the chip takes one ring pulse (the same `ring` prop scene 1 used for the tool
*call*):

```ts
const chipPulse = interpolate(t, [4.0, 4.3, 5.1, 5.5], [0,1,1,0], { clamp both });
// ...ring: chipPulse
```

> *"Isn't reusing the ring confusing — in scene 1 a ring meant 'the agent called
> this tool'?"* It's the same product affordance (a selection ring) carrying its
> general meaning, "this chip is the focal one right now," in two contexts. Here
> it's a brief acknowledgement pulse — "this is the one that just arrived" — not a
> live call (no run is happening, the chain isn't live). The viewer reads it from
> context: a chip that just grew in, ringing once as it lands, is plainly "the new
> one." Scene 5 then disambiguates definitively by ringing CRM *during a live run*
> while Weather stays quiet — restoring the call-meaning. The shared vocabulary is
> a feature: one ring affordance, meaning "attend to this chip," sharpened by
> context each time.

## The deliberate deviation, marked and reversible

The live beaming-polaris Triage has **three** tools. This scene adds a fourth
(Weather). That's a deviation from the artifact, and it's explicitly flagged in
`script-v1.md`'s grounding notes as acceptable and reversible.

> *"Why is inventing a fourth chip OK here when inventing values is forbidden
> elsewhere?"* Because the deviation is *demonstrative of a documented product
> behavior*, not a fabricated fact. The docs state plainly: a saved custom tool
> "appears alongside built-in tools" and is "available in any Agent block." The
> scene is showing that exact documented flow — a newly-saved tool appearing on
> the line. The chip's name (`Weather`, condensed from `get_weather` per the
> module-5 condensation rule), color (`#6366F1`), and glyph (`ToolGlyph`) all
> follow the established `CHIP_CRM` custom-tool grammar, so it's consistent with
> the world. The discipline isn't "never add anything" — it's "every addition is
> either traceable to an artifact or a marked, reversible illustration of
> documented behavior, recorded in the grounding table." This one is the latter.

## The aside-exit mechanics

The save/exit is three coordinated ramps, sequenced so the panel leaves *before*
the chip arrives — the editor's work is handed off to the world:

```ts
const savePress = interpolate(t, [0.5, 1.1], [0,1], {});            // button dip
const panelOut  = interpolate(t, [1.3, 2.1], [0,1], { ease in });   // panel slides+fades out
const undim     = interpolate(t, [1.7, 2.5], [1,0], { ease out });  // world comes back up
// chip grows at 3.1→4.0, pulses 4.0→5.5 — AFTER the panel is gone
```

The `savePress` feeds the primary button's press treatment in the component (a
brief scale-down + brightness dip following a `sin(press·π)` curve, so it dips
*and recovers* in one motion — a button press, not a button that stays pressed).
`panelOut` drives both the panel's opacity (`1 - panelOut`) and its `slide` (so it
translates back down as it fades, the mirror of its scene-2 rise). `undim` brings
the chain's `dim` back to 0 and edges back to full.

> *"Why this exact order — press, then exit, then undim, then chip?"* Because it's
> a causal chain and the order *is* the meaning: you press Save → the editor
> closes (its job is done) → your workflow comes back into focus → and only then
> does the result of the save appear on it. If the chip grew while the panel was
> still leaving, the eye would be split between two motions and the causality
> ("save *caused* this chip") would blur. Letting the panel fully clear and the
> world fully return *before* the chip grows makes the chip unambiguously the
> consequence of the save. One focal motion at a time (rule 7), sequenced into a
> sentence.
>
> *"Why is the camera untouched?"* Because the chain never moved — scenes 2–3
> only dimmed it; it's at the same geometry it had in scene 1. Undimming returns
> the *exact* frame the viewer last saw the chain in (plus one chip). A camera
> move here would imply we'd gone somewhere; we didn't. We came back.

## The animation, beat by beat

1. **0.5 → 1.1s** — Save Tool dips and recovers (the press).
2. **1.3 → 2.1s** — panel slides down + fades out.
3. **1.7 → 2.5s** — world undims (chain back to full, edges brighten). Overlaps
   the tail of the panel exit slightly so the handoff feels continuous, not gapped.
4. **3.1 → 4.0s** — Weather chip grows in by width beside the other three.
5. **4.0 → 5.5s** — chip takes one selection pulse, settles.
6. **tail** — chain at rest with four chips, world undimmed, panel gone (8s; no VO
   stretch needed — this is the shortest scene, a clean hinge).

## How to think about the whole scene

1. *How do I close the aside?* Press the real button, slide the panel out the way
   it came in, undim the world → the editor leaves the way it arrived.
2. *How does the saved tool appear?* As a chip that grows in by width into the
   real chip row → it joins the line, it doesn't pop into a slot.
3. *How do I say "this is the new one" without words?* One selection pulse after
   it lands → product state language, read from context.
4. *How do I keep it honest?* The 4th chip is a marked, reversible illustration of
   documented behavior, in the world's chip grammar → deviation with a paper trail.

## Exit state (what scene 5 inherits)

`Triage chain at rest with FOUR chips (Weather at opacity 1, ring 0) · world
undimmed · panel gone · camera identity`. Scene 5 opens on exactly this frame —
the same chain scene 1 ran, now carrying the tool you just built — and runs the
closing pass. Boundary identical on both sides.

<!-- custom-tools / 05-the-agent-decides.md -->
# Scene 5 — `the-agent-decides`  ·  archetype: **settle / bookend**

Source: `../source/scenes/TheAgentDecidesScene.tsx`, `../source/scenes/_local.tsx`
(`CHIP_WEATHER`), `../source/layout.ts`, and the module-5 `TriageChain` +
`WirePulse`.

This is the close, and it's the deliberate mirror of scene 1. Scene 1 ran the
chain with three chips and rang the CRM one to prove "a custom tool already lives
in your world." Scene 5 runs the *same chain with four chips* and rings the CRM
one again — but now the new Weather chip sits quiet. That contrast is the final
lesson: **relevance is the model's call.** Read it as the worked example of a
bookend that earns its closure by changing exactly one variable.

---

## What this scene is for

Two facts have to land at the end. First: the model decides *when* your tool is
relevant — same as every built-in; you don't wire a custom tool into the chain
like a block, the agent reaches for it (or doesn't) per message. Second, the
reassuring deflation: after all of that, it's *still just a workflow* — the same
three blocks and two wires, settling green. The scene delivers both by running the
chain one last time and letting it come to rest.

One idea per scene: this is "the model picks the tool the message needs, and the
whole thing is still a workflow." It is a *settle* — the energy of the piece
discharges into a calm, balanced, resolved final frame.

## What it looks like

Continuing from scene 4's four-chip chain: a pulse travels the first wire, Triage
goes live, and **the CRM chip rings** briefly — the new Weather chip stays quiet.
A second pulse travels; the blocks settle to green "ok" state in causal order
(Start → Triage → Slack). The camera eases back ~7%, opening up the frame. Hold
on the balanced, green-settled board to the end of the video.

## The bookend: change exactly one variable

The power of a bookend is that it's *almost* the same shot as the open, so the
viewer's attention is drawn to the single thing that's different. Lay scene 1 and
scene 5 side by side:

| | Scene 1 (open) | Scene 5 (close) |
|---|---|---|
| Chain | Triage, 3 chips | Triage, **4 chips** |
| Run | one pass, input resolves | one pass, settles green |
| CRM chip | **rings** (the call) | **rings** (the call) |
| Weather chip | not present | present, **quiet** |
| Camera | identity | eases back ~7% |

The only meaningful new variable is *the fourth chip exists, and it stays quiet
while CRM rings.* Everything else is held constant precisely so that contrast is
the thing you see.

> *"Why is keeping everything else the same the whole point?"* Because the lesson
> is about *selectivity* — the agent reaching for one tool and not another. You
> can only show selectivity by presenting multiple available tools and having the
> agent pick. The new Weather chip *has* to be present-but-quiet for "the model
> chose CRM, not Weather" to be a visible event. If scene 5 changed the run, the
> input, or the layout too, the quiet chip would get lost in the noise. A bookend
> teaches by minimal difference: hold everything, move one thing, point at the
> move. The discipline is restraint — resist the urge to make the finale bigger.

## The decisive beat: CRM rings, Weather stays quiet

Same ring mechanism as scene 1, scoped inside the live window:

```ts
const agentLive = t >= 1.7 && t < 3.0;            // Triage live window
const crmRing = interpolate(t, [1.9, 2.2, 2.7, 3.0], [0,1,1,0], { clamp both });
// ...
tools: [CHIP_DOCS, {...CHIP_CRM, ring: crmRing}, CHIP_SEARCH_V3, CHIP_WEATHER]
//                  ^^^ CRM gets a ring                          ^^^ Weather has none
```

CRM gets a `ring` driven inside the 1.7→3.0 live window; Weather is passed with
no `ring` at all (so it renders flat). The contrast is built into the props: one
chip carries a ring value, one doesn't.

> *"Why does this prove 'relevance is the model's call'?"* Because the message
> being handled is the billing complaint from the real artifact, and the tool the
> billing complaint needs is CRM (`customerLookup`) — not weather. The agent
> rings the relevant chip and ignores the irrelevant one, *with no logic shown on
> screen deciding it.* The absence of a ring on Weather is the visual for "the
> model judged this one irrelevant to this message." Scene 1 taught the audience
> that a ring means "the agent chose this tool"; scene 5 cashes that in by showing
> a chip the agent *didn't* choose, sitting right next to one it did. The lesson
> is delivered entirely by which chip rings — no caption, no arrow, no decision
> diagram. This is the chip-ring vocabulary paying its full dividend.
>
> *"Why ring CRM again rather than make Weather the one that fires?"* Because
> Weather firing would require a weather-shaped message, which would mean changing
> the input — breaking the bookend's "change one variable" discipline and
> abandoning the real artifact. Ringing the *same* chip as scene 1, on the *same*
> input, with the new chip present-and-quiet, is the tighter teaching: the world
> is identical, you just added a tool, and the agent's behavior on this message is
> unchanged because this message never needed your tool. That's a more honest and
> more reassuring close than manufacturing a reason to fire the new one.

## The settle: green state in causal order

The blocks resolve to success state by time-gated booleans, in order:

```ts
const startDone = t >= 1.0;
const agentLive = t >= 1.7 && t < 3.0;
const agentDone = t >= 3.0;
const respDone  = t >= 3.8;
// start.state = startDone?'ok':'none'; mid.state = agentDone?'ok':'none'; response.state = respDone?'ok':'none'
```

`state: "ok"` paints the block's success ring green (`#22c55e` in `SimBlock`,
the same state language used across the series). They turn green in causal order
(1.0 → 3.0 → 3.8) so the success reads as *flowing through the chain*, not
snapping on at once.

> *"Why settle to green at all — why not just stop the run?"* Because green is
> the product's own 'this ran successfully' state, and the video's last fact is
> "it's still just a workflow." A workflow that ran cleanly ends green. Letting
> the success propagate Start→Triage→Slack is the visual sentence "the whole
> thing worked, end to end" — the calm landing the piece resolves into.

## The camera ease-back

```ts
const ease = interpolate(t, [3.2, 5.4], [0,1], { ease inOut });
const s = 1 - 0.07 * ease;          // zoom out 7%
const tx = CENTER_X * (1 - s);      // keep the zoom centered
const ty = CENTER_Y * (1 - s);
// applied as transform: translate(tx,ty) scale(s) about origin 0 0
```

The whole board scales down 7% about its center as the run finishes.

> *"Why pull back at the end?"* It's the breath that signals "done." Through the
> video the framing was tight on the editor and the block; easing back opens the
> frame to show the *whole* balanced workflow at rest — the "still just a
> workflow" beat made visual. The 7% is small and centered (the `tx/ty` math keeps
> the center fixed) so it reads as settling, not as a new camera move. It starts
> at 3.2s, after the run's work is essentially done, so the pull-back accompanies
> the resolution rather than competing with it. A settle scene earns a gentle
> outward camera; an action scene would not.

## The animation, beat by beat

1. **1.0s** — Start resolves (green).
2. **1.0 → 1.7s** — pulse travels wire 1 (ease inOut).
3. **1.7 → 3.0s** — Triage live; **CRM rings** (1.9→3.0), Weather quiet.
4. **3.0s** — Triage resolves green.
5. **3.0 → 3.7s** — pulse travels wire 2.
6. **3.2 → 5.4s** — camera eases back 7%.
7. **3.8s** — Slack response resolves green; chain fully settled.
8. **tail** — hold the balanced, green, four-chip frame to video end (stretches to
   VO ≈ 12.5s).

## How to think about the whole scene

1. *How do I close?* Bookend scene 1 → run the same chain, hold everything,
   change one variable.
2. *What's the one variable?* A fourth chip that stays quiet while CRM rings →
   relevance is the model's call, shown by which chip rings.
3. *How do I land "still just a workflow"?* Settle green in causal order, ease the
   camera back 7% → the energy discharges into a calm, whole, resolved frame.
4. *Why ring the same chip as the open?* The input is the same real artifact;
   honesty + the tightest possible contrast.

## Exit state

`Four-chip Triage chain, fully settled green · CRM ring released · Weather quiet ·
camera eased back 7% · balanced hold`. This is the final frame of the video. The
piece opened on this chain and closes on it — the same world, now carrying a tool
you watched get built, with the agent reaching for exactly what the message needs.

### loops

<!-- loops / 01-a-block-that-holds-blocks.md -->
# Scene 1 — `a-block-that-holds-blocks`  ·  archetype: **assemble**

Source: `../source/scenes/ABlockThatHoldsBlocksScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is the opening scene of the video, and it does exactly one thing: it
**builds the set piece you will watch for the rest of the run** — Start, a
container block, the one block living inside it, and the consumer that reads
its results. Read it as a worked example, because the single most important
decision in the whole video is made here, silently, in how this scene
assembles: the container is drawn as *a block that holds blocks*, and you
see a block go **inside** it. Everything the video teaches afterward is a
consequence of that one structural fact.

---

## What this scene is for

The video's whole thesis is: *when the same steps must run over many items,
put the steps inside a container.* So scene 1's job is to make the container
**concrete as a thing with an inside**, not a labelled box. It does that by
assembling the workflow in **flow order** — Start first, then a wire, then
the container's empty shell, then a wire *inside* it, then the inner block
landing *inside* the shell, then the container's own exit wire, then the
consumer. The order is the argument. You watch a block get dropped into
another block, and the idea "a workflow inside a workflow" arrives without a
caption.

The rule it follows is *one idea per scene*: this scene is "here is a block
that holds blocks." No run, no iteration, no Loop-vs-Parallel — those each
get their own scene. Resist the urge to also fire the container here; the
assembly *is* the idea, and a run on top of it would bury the structure
under motion.

## What it looks like

A workflow on the builder canvas, centered. From left to right: a **Start**
trigger (header-only, blue), a straight wire, a **Loop** container — a
bordered box with a header bar (blue Repeat chip + the name "Loop") and,
sitting inside the body near the top-left, its own little **Start pill** — a
short inner wire from that pill, a **Function 1** block (red, row
`Code | return <loop.currentItem>`) landing *inside* the container, the
container's own exit wire, and finally a **Summary** agent (green, row
`Messages | Summarize <loop.results>`). They arrive in that exact order,
each fading/drawing on in turn, and then the assembled frame holds, balanced
and still.

## The one real decision: render the *whole* set piece, every scene, from one rig

The scene renders this and almost nothing else:

```tsx
<Rig
  phase={0}
  start={{opacity: c(0.5, 1.1, 0, 1, EASING.out)}}
  edge0={{progress: c(1.2, 1.8, 0, 1, EASING.out)}}
  container={{opacity: c(1.9, 2.7, 0, 1, EASING.out)}}
  edgeIn={{progress: c(2.9, 3.5, 0, 1, EASING.out)}}
  fn={{opacity: c(3.6, 4.3, 0, 1, EASING.out)}}
  edgeExit={{progress: c(4.7, 5.3, 0, 1, EASING.out)}}
  summary={{opacity: c(5.4, 6.1, 0, 1, EASING.out)}}
/>
```

Two things to take from this, and they are the same two lessons the whole
series turns on.

**There is exactly one set piece, `<Rig/>`, and every scene renders all of
it.** The Start, the container, the inner Start pill, the Function, the
Summary, all the wires — every scene mounts the entire rig and only changes
**state props** (opacity, `progress`, `highlighted`, `phase`, tag glows).
Scene 1 isn't "the assemble scene that builds a thing the next scene
inherits"; it's the rig at one set of prop values. Scene 2 is the same rig
at different values. The container you see assemble here is numerically the
same DOM the morph in scene 5 will recolor and the run in scene 6 will fan —
never a re-layout, never a remount.

> *"Why render the whole rig when scene 1 only needs the empty workflow?"*
> Because of the cut into scene 2. If scene 1 mounted only what it shows and
> scene 2 mounted more, you'd risk a one-frame reflow at the boundary — the
> container shifting, a flash. By having both scenes render the *same* rig
> and animate only props, the boundary is identical **by construction**.
> Continuity stops being a thing you check after the fact and becomes a thing
> you cannot break. This is the project's deepest habit: own all geometry in
> `layout.ts`, render one rig, never relayout.

**`phase={0}` means "this is the Loop identity."** The rig has a single
`phase` value, `0 = Loop … 1 = Parallel`, that drives the *entire* morph —
the chip color and glyph, the container name, and the two reference tags.
Scene 1 pins it at 0, so everything reads as a Loop: blue Repeat chip, name
"Loop", `<loop.currentItem>` in the Function row, `<loop.results>` in
Summary. You are not choosing those strings here; they are what `phase=0`
*is*. (The same rig at `phase=1` is the Parallel identity, with nothing else
changed — which is scene 5's whole lesson, set up silently here.)

## The container anatomy — what's actually being assembled

The container (`SubflowContainer` in `_rig.tsx`) is a pixel port of the
product's own container node, and every part of it is load-bearing for the
lessons that follow. It is worth naming the parts, because the rest of the
video *animates these specific parts*:

- **The box.** 8px-radius (×1.5 = 12), 1px border in `--wp-border-1`, a
  faint fill (`rgba(255,255,255,0.02)` dark) — barely-there, so it reads as
  *a region that contains*, not a solid card. The body has
  `overflow: hidden`, so the inner block is genuinely clipped to the inside.
- **The header bar.** Surface-3 background, a 24px (×1.5) rounded chip on the
  left holding the identity glyph (the blue Repeat icon), then the 16px
  medium name. This is the only part the morph in scene 5 touches.
- **The internal Start pill.** A small rounded pill (`Start`, 13px medium)
  positioned absolutely inside the body near the top-left (docs:
  `left-4 top-[56px]`), with **its own source handle** on its right edge.
  This is the single most important glyph in the video: it is the visual
  proof that *the inside of the container is its own little workflow with its
  own beginning.* Whatever runs inside starts from this pill, once per item.
- **The centered outer handles.** The container's target handle (left) and
  source handle (right) sit at the box's **vertical center** (7×20 native),
  not at a header offset. That's why the outer wires — Start→container and
  container→Summary — are dead straight on the stage axis: the layout aligns
  Start's and Summary's header handles to the container's centered handles
  (the docs author the same alignment, `95+20 = 30+85`). Straight wires read
  as "one clean flow line"; the centered handles are what make that possible.

> *"Why does the container have an inner Start pill at all — isn't the outer
> Start enough?"* No, and this is the crux of the whole video. The outer
> Start triggers the *workflow*. The **inner** Start pill triggers the
> *inside of the container*, and it fires **once per item**. Drawing it now,
> at rest, plants the mechanism: when the run comes (scene 3), you'll watch
> this pill re-fire — once for `"x"`, once for `"y"`, once for `"z"` — and
> because you saw it sitting there in scene 1, the re-firing reads as
> "the inside started again," not "a new thing appeared." The pill is the
> seed of the iteration lesson, planted three scenes early.

## The values, and why they're already "wired" before anything runs

Every string on screen traces to the rig's constants, not the scene file:

| surface | value | source |
|---|---|---|
| container name | `Loop` | `DipSwap a` at `phase=0` |
| container chip | blue `#2FB3FF` Repeat | `LOOP_COLOR` + `RepeatGlyph` |
| Function row | `Code` · `return <loop.currentItem>` | `itemValue()` at `phase=0` |
| Summary row | `Messages` · `Summarize <loop.results>` | `resultsValue` at `phase=0` |

Notice the Function row already shows `<loop.currentItem>` and Summary
already shows `<loop.results>`, at rest, before any run. These are
**unresolved reference tags** — plain row text right now, no glow. That's
deliberate and honest: in the product, a block's config *contains those
references* whether or not it has run; the reference is authored, the
*value* is produced at runtime. So the tags are visible from the first frame
(this is how the block is configured), and only the *resolution* — the tag
turning into `"x"` — waits for the run. Showing the tags at rest is the
setup that makes scene 3's resolution legible: you can't watch a tag resolve
if you never saw the tag.

## The animation, beat by beat

One tiny helper does all the timing. `c(lo, hi, a, b, easing)` is a clamped
`interpolate` on the clock `t` (seconds): it goes from `a` to `b` as `t`
crosses `lo → hi` and holds flat outside that window. Every entrance below
is one `c(...)` call with `EASING.out` — the project's entrance curve.

The seven beats fire in **flow order**, each starting just after the
previous one is well underway, so you read a chain assembling left to right:

| beat | window (s) | what enters |
|---|---|---|
| Start | 0.5 → 1.1 | the outer Start trigger fades in |
| edge 0 | 1.2 → 1.8 | the wire *draws* Start → container |
| container | 1.9 → 2.7 | the box, header, and inner Start pill fade in together |
| inner edge | 2.9 → 3.5 | the wire *draws* from the inner pill toward the Function slot |
| Function | 3.6 → 4.3 | Function 1 fades in **inside** the container |
| exit edge | 4.7 → 5.3 | the wire *draws* container → Summary |
| Summary | 5.4 → 6.1 | the consumer fades in |

> *"Why draw the wires with `progress` instead of fading them in?"* Because a
> wire is a *connection being made* — it has direction (source → target), and
> drawing it from one end to the other says "this now connects to that."
> `SimEdgePath`'s `progress` strokes the path via `strokeDasharray`, so the
> line grows from the source handle to the target. A wire that merely faded
> in would read as "a line appeared," losing the causal "A connects to B."
> The blocks fade (they're objects arriving); the wires draw (they're
> connections forming). Two verbs, matched to two kinds of thing.

> *"Why does the inner edge draw *before* the Function block lands (2.9→3.5,
> then 3.6→4.3)?"* So the eye is led *into* the container. The inner Start
> pill emits a wire toward an empty slot, and then the Function arrives where
> the wire points — you watch the inside get wired up, then populated. Doing
> it the other way (block first, then wire) would read as "a block appeared,
> then we connected it"; this order reads as "the inside is a little
> workflow, and here's its first step landing on the rails." The assembly
> order is teaching the structure.

> *"Why `EASING.out` on every entrance and no easing on... wait, there's no
> linear here."* Everything in this scene either travels (wires drawing) or
> arrives (blocks fading). The project's rule is `out` for entrances — a
> gentle decelerate-into-place that makes each element feel like it *settles*
> rather than snaps. Using one curve for all seven entrances is what makes
> the assembly feel composed rather than seven separate animations with seven
> personalities. Consistent easing is consistency.

> *"Why ~0.6s per beat and ~0.1–0.2s overlap between them?"* Each beat needs
> long enough to land as its own event (so you read seven distinct things
> arriving), but the slight overlap keeps the assembly *flowing* rather than
> ticking one-at-a-time with dead gaps. The cadence is chosen once and
> reused; the regularity is part of why it reads as a single build.

## The hold — from ~6.1s to the end of the scene

After Summary lands, nothing moves. The assembled workflow rests, balanced
and symmetric on the stage axis.

> *"Isn't a still frame dead air?"* No — the assembled rig is the thesis
> object of the entire video, and letting it sit is letting the structure
> land before anything starts moving through it. There's a downstream reason
> too: this tail is where the scene's narration plays, and a scene that ends
> on a **settled, motionless state** can be stretched to any length to fit
> the voiceover without freezing a motion mid-flight. (The video's timing is
> "extend-only": authored durations are visual minimums, and a VO sync can
> only lengthen a scene — see `Video.tsx`.) Ending on a settled hold is what
> makes that safe.

## How to think about the whole scene

Walk the decisions in order and each one answers a question:

1. *What's the structural claim?* A block holds blocks → assemble in flow
   order so you watch a block go **inside** another.
2. *How do I show only the assembly?* Render the **one** rig at `phase=0`
   with state props ramping → continuity is free, identity is the Loop.
3. *How does a workflow arrive?* Blocks fade, wires draw, left to right →
   you read a chain forming, not a picture appearing.
4. *How do I plant the iteration mechanism without running anything?* Draw
   the inner Start pill at rest → its re-firing later will read as "the
   inside started again."
5. *How do I make later resolutions legible?* Show the reference tags
   (`<loop.currentItem>`, `<loop.results>`) configured-but-unresolved from
   the first frame.
6. *How should it rest?* Settled and balanced on the axis → stretchable for
   VO, and the exact frame scene 2 inherits.

There's no single clever move; the scene is restraint applied six times, and
the quality is the sum of getting each small decision right.

## Exit state (what scene 2 inherits)

`workflow fully assembled · Loop identity (phase 0) · no rings, no run · all
wires drawn and held · camera at identity (no Camera wrapper) · reference
tags visible but unresolved`. Scene 2 opens on exactly this frame and begins
dimming the world while the container takes a selection ring and the editor
card slides in. Because both scenes render the same rig at the same
geometry, the boundary is identical down to the pixel.

<!-- loops / 02-what-the-loop-knows.md -->
# Scene 2 — `what-the-loop-knows`  ·  archetype: **zoom-aside (editor card)**

Source: `../source/scenes/WhatTheLoopKnowsScene.tsx`, `../source/scenes/_config.tsx`,
`../source/scenes/_rig.tsx`, `../source/layout.ts`.

This is the configuration scene. The workflow is built; now you learn the
**one fact** that makes a Loop run the number of times it runs: it is given a
**collection to iterate over**, and the size of that collection *is* the
number of passes. Read it as the worked example for "how do I show a block's
config without rebuilding the editor or stamping a caption" — the answer is
the *aside*: dim the world, select the block, slide in the product's own
editor panel, and let the panel's real fields carry the meaning.

---

## What this scene is for

The video's spine is: container → it runs the inside once per item → results.
Scene 1 gave you the container. Scene 2 has to install the quantity that the
run will make true: **three items in the collection ⇒ the inside runs three
times.** Everything in scene 3 (three sequential passes) and scene 6 (three
simultaneous instances) is "three" — and *this* is the scene that earns the
three. If the viewer doesn't register "the collection has three items" here,
the three passes later look arbitrary.

The rule is *one idea per scene*: the idea is "the loop is told what to
iterate over, and it has three items." Not "here's the whole editor," not
"here's every loop setting" — just the type (`For Each`) and the collection
(`["x", "y", "z"]`), with the collection's *count* made visible.

## What it looks like

The workflow stays put. The world dims to ~0.35; the **container takes a blue
selection ring** (it is being edited). The product's **subflow editor card**
slides in from the right and settles: a header (blue Repeat chip + "Loop"),
a `Loop Type` field reading **`For Each`**, a dashed divider, and a
`Collection Items` field reading **`["x", "y", "z"]`**. The `For Each` field
gets a brief blue glow (this is the setting that matters), then the three
collection items glow one after another — `"x"`, then `"y"`, then `"z"` — so
you *count* them. The card then slides back out, the ring releases, and the
world un-dims to the resting workflow.

## The aside grammar — dim, select, slide

The scene is three coordinated gestures, and they're the reusable pattern for
any "look at this block's config" beat:

```tsx
const dim = Math.min(c(0.5, 1.0), c(6.8, 7.4, 1, 0));   // world dims, then restores
const ring = t >= 0.5 && t < 7.0;                       // container "being edited"
const cardOp = Math.min(c(1.0, 1.6), c(6.2, 6.8, 1, 0)); // card in, then out
const slide = 1 - c(1.0, 1.7, 0, 1, EASING.out)
            + c(6.2, 6.8, 0, 1, EASING.in);              // off-right → in → off-right
```

1. **Dim the world.** Everything that isn't the focus drops to ~0.35. The
   rig's `start` and `summary` blocks get `{dim}`, and the two outer edges get
   their opacity multiplied by the same `1 - 0.65*dim`. The *container itself
   is not dimmed* — it stays full-bright and takes the ring, because it's the
   subject.
2. **Select the container.** `container={{highlighted: ring}}` gives it the
   blue selection ring — the product's own "this block is selected in the
   editor" treatment. No word like "EDITING"; the ring *is* the word.
3. **Slide the card in.** The `ConfigCard` enters from the right
   (`slide` runs `1 → 0`, an 80px offset → in place) and leaves the same way.

> *"Why an aside card instead of expanding the container in place to show its
> settings?"* Because the container's *body* is reserved real estate — it's
> where the inner block lives and where the run will happen. Settings like
> "what collection do I iterate" don't live in the body; in the product they
> live in a side editor panel. Porting that panel as a slide-in card is both
> truthful (it's the real surface) and clean (it doesn't disturb the
> workflow's geometry — when the card leaves, the frame is byte-identical to
> scene 1's rest state, which is exactly what scene 3 needs to inherit).

> *"Why dim the world to 0.35 rather than hide it?"* Hiding it would break
> continuity — the workflow has to be in the same place before and after the
> aside. Dimming keeps it present (you never lose the spatial context: this
> card is *about that container, over there*) while unambiguously throwing
> the focus onto the lit container and the card. This is the project's
> hierarchy rule: one focal element per moment, everything else dimmed, never
> deleted.

## The card content — the product's real fields, verbatim

The `ConfigCard` (`_config.tsx`) is a port of the product's subflow editor,
and every label is the real one:

| field | value | what it says |
|---|---|---|
| header | blue Repeat chip + `Loop` | this is the same block, selected |
| `Loop Type` | `For Each` | iterate once per item of a collection |
| `Collection Items` | `["x", "y", "z"]` | the collection — **three** items |

The two `Loop Type` modes the product offers are "For Each" and a fixed
count; **For Each** is the one that ties the iteration count to a collection,
which is the whole point of the scene. The dashed divider between the type
and the collection mirrors the real panel. The collection `["x", "y", "z"]`
is the product's own authored example collection — short, generic items
chosen precisely *because* they carry no meaning of their own: the lesson is
about iteration count and order, not about what the items *are*. (Short items
also keep every resolved row inside the block width later — a real layout
constraint, see the morph notes in scene 5.)

> *"Why these specific items and not, say, a list of customers?"* Because
> meaningful items would make the viewer think the lesson is about the
> *content* of the collection. `"x", "y", "z"` are deliberately contentless —
> they're stand-ins whose only job is to be three distinct, countable,
> orderable things. When `<loop.currentItem>` resolves to `"x"` in scene 3,
> you read "it resolved to the first item," not "it resolved to a customer
> named x." The abstraction is the point.

## The animation, beat by beat

### (a) The world dims and the container is selected — `0.5 → 1.0s`

`dim` ramps up over `0.5 → 1.0`; the `ring` boolean is on from `0.5` to
`7.0`. The dim and the selection start together: as the world recedes, the
container lights up as the thing being edited. The two outer edges fade with
the dim (their opacity is `1 - 0.65*dim`) so the dimmed workflow reads as one
receding plane, wires included.

### (b) The card slides in — `1.0 → 1.7s`

`cardOp` ramps in over `1.0 → 1.6` while `slide` eases from its off-right
offset to in-place over `1.0 → 1.7` (`EASING.out` — an entrance). The card
arrives just *after* the world has finished dimming, so the viewer's eye is
already settled on "the container is selected" before the card lands to
explain it.

### (c) The type glows — `2.0 → 3.2s`

```ts
const typeGlow = Math.min(c(2.0, 2.4), c(2.8, 3.2, 1, 0));
```

The `For Each` field gets a blue selection glow that rises over `2.0 → 2.4`,
holds, and falls over `2.8 → 3.2`. This points at the setting that *causes*
the per-item behavior — "iterate once per item" — before counting the items
it iterates over.

### (d) The three items glow in sequence — `3.4 → 6.55s`

```ts
const itemGlow = (T) => Math.min(c(T, T + 0.35), c(T + 0.8, T + 1.15, 1, 0));
itemGlows={[itemGlow(3.4), itemGlow(4.4), itemGlow(5.4)]}
```

Each item gets a 0.35s glow-in / ~0.35s glow-out, and they start **1.0s
apart** — `"x"` at 3.4, `"y"` at 4.4, `"z"` at 5.4. Each item's glow is a
blue tint behind that token in the collection string. You watch the
highlight walk the list left to right.

> *"Why glow the items one at a time instead of all at once?"* Because the
> beat is **counting**, and counting is sequential. Lighting all three
> together would say "here is a collection"; lighting them in turn says
> "one… two… three" — it makes the *cardinality* perceptible and previews the
> *order* the Loop will take them in (scene 3 walks the same `x → y → z`).
> The 1.0s spacing is slow enough to land each as a distinct count, and it
> rhymes deliberately with scene 3's per-pass cadence: the three glows here
> and the three passes there are the same "three," shown twice.

> *"Why 1.0s spacing here, when scene 1's assembly used ~0.6s and the
> market-desk row sweep used 0.14s?"* Cadence is chosen per verb. Scene 1 was
> *arriving* objects (medium). A sweep is *passing over* (fast). This is
> *counting* (deliberate, slow — you want the viewer to actually tally). The
> spacing is a signal about what kind of event it is.

### (e) The card leaves and the world restores — `6.2 → 7.4s`

`cardOp` falls over `6.2 → 6.8` and `slide` eases back off-right over the same
window (`EASING.in` — an exit). The `ring` releases at `7.0`, and `dim`
restores over `6.8 → 7.4`. By the scene's end the frame is *exactly* the
resting workflow from scene 1 — full bright, no ring, no card.

> *"Why does the card leave before the ring releases (6.8 vs 7.0)?"* So the
> gestures unwind in the reverse of the order they wound up: the card was the
> last thing in, so it's the first thing out; the selection was there first,
> so it releases last; the dim restores last of all. Unwinding in reverse
> order reads as "closing the editor," a single coherent gesture, rather than
> three things blinking off independently.

## Why this scene ends *exactly* where scene 1 did

This is the structural payoff. Scene 2 is a **round trip**: it dims, selects,
and shows a card, then undoes all three. Its exit state is byte-identical to
scene 1's exit state — resting Loop workflow, no rings, full bright. That's
intentional and it's what makes the aside *safe*: an aside is a detour that
returns you to where you started, so the run (scene 3) can open on the same
clean template scene 1 left, as if the editor was never opened. The config we
learned here is now *known to the viewer* but leaves no visual residue.

## How to think about the whole scene

1. *What's the one fact?* The Loop iterates over a collection; its size is the
   pass count → show `For Each` + `["x","y","z"]`.
2. *How do I show config without a caption or a rebuild?* The aside — dim,
   select with a ring, slide in the product's real editor card.
3. *How do I make "three" land?* Glow the items one at a time → the viewer
   counts, and previews the order.
4. *How do I keep the run's template clean?* Round-trip everything → exit
   state equals scene 1's, so scene 3 inherits a pristine workflow.

## Exit state (what scene 3 inherits)

`resting Loop workflow · no rings · world full bright · card gone · all tags
unresolved · camera at identity`. Identical to scene 1's exit. Scene 3 opens
here and immediately begins the run — outer Start blips, the pulse crosses
into the container, and the container takes a live ring it will *keep*.

<!-- loops / 03-one-at-a-time.md -->
# Scene 3 — `one-at-a-time`  ·  archetype: **run + camera lean-in (freeze-cut OUT)**

Source: `../source/scenes/OneAtATimeScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is **the** scene — the one the whole video exists to deliver, and the
reason this build is in the pack. It shows what a Loop *does*: it runs the
inside of the container **once per item, strictly one at a time**, and on
each pass `<loop.currentItem>` resolves in place to a different item. Read it
as the worked example for "how do I animate iteration honestly" — and the
answer is the move worth stealing: **iteration is drawn as the literal
repetition of one body's beats over a single drawn block, not as N copies of
the block.** The same inner Start pill re-fires; the same inner wire
re-pulses; the same Function row re-resolves — three times, never overlapping.

---

## What this scene is for

Scene 2 established "three items." Scene 3 spends those three: it runs the
container's inside three times in sequence and makes you *feel* the
one-at-a-time-ness — never two rings lit at once, each pass strictly after
the last. The contrast that is the entire video's lesson — sequential (Loop)
vs simultaneous (Parallel) — has its **sequential half built here**, and
built so legibly that scene 6 can be "the same thing but at once" and the
difference reads instantly.

The rule is *one idea per scene*: the idea is "same steps, next item, in
order." Not the results (that's scene 4, across a deliberate freeze-cut), not
the schedule contrast (that's scene 5–6). Just the iteration mechanism,
repeated three times.

## What it looks like

The run enters: the outer Start blips, a pulse crosses the wire into the
container, and the **container takes a live (blue) ring and keeps it.** The
camera leans in on the container (to 1.12×). Then the mechanism plays three
times: the **inner Start pill blips** → a pulse crosses the **inner wire** →
**Function 1 goes live** → in its `Code` row, `<loop.currentItem>` **resolves
in place** to `"x"` → the Function settles green-ok → the resolution reverts
to the tag — and then the pill blips **again** for `"y"`, and again for
`"z"`. Strictly sequential: at no instant are two passes lit. After the third
pass, the camera returns to identity, and the **container's live ring HOLDS
through the cut** — the passes are done, but the loop has produced nothing
yet. That held live ring is the freeze-cut into scene 4.

## The distinctive move — one body, re-run, not N bodies

Look at how the three passes are produced. There is **one** Function block in
this scene (`fn`), and it is driven by a single set of windows keyed off the
*current pass index*:

```ts
const ITER_T = [3.2, 5.8, 8.4];                 // the three pass start times

const k = t < ITER_T[1] ? 0 : t < ITER_T[2] ? 1 : 2;   // which pass is current
const T = ITER_T[k];                                    // that pass's clock origin

const pillBlip = Math.min(c(T, T + 0.25), c(T + 0.55, T + 0.85, 1, 0));
const pulseIn  = c(T + 0.2, T + 0.95, 0, 1, EASING.inOut);
const fnLive   = t >= T + 0.85 && t < T + 1.75;
const fnOk     = t >= T + 1.75 && t < T + 2.35;
const tagGlow  = Math.min(c(T + 0.7, T + 1.0), c(T + 1.3, T + 1.6, 1, 0));
const resolve  = Math.min(c(T + 0.95, T + 1.35), c(T + 1.95, T + 2.35, 1, 0));
// ...
fn={{
  highlighted: fnLive,
  state: fnOk ? "ok" : "none",
  tag: {glow: tagGlow, resolve},
  item: k,             // ← the ONLY thing that differs pass to pass
}}
```

Every beat — `pillBlip`, `pulseIn`, `fnLive`, `fnOk`, `tagGlow`, `resolve` —
is written **relative to `T`**, the current pass's start time. As the clock
crosses each `ITER_T` boundary, `k` advances (`0 → 1 → 2`), `T` jumps to the
next origin, and **the exact same six windows replay** against that new
origin. The block doesn't move. It doesn't duplicate. It runs, reverts, and
runs again. The *only* value that changes between passes is `item: k`, which
selects which collection item `<loop.currentItem>` resolves to.

> *"Why animate one block three times instead of showing three blocks?"*
> Because that is **what a Loop actually is.** A Loop does not instantiate
> three copies of the body — it has one body and executes it three times,
> sequentially, rebinding `<loop.currentItem>` each time. Drawing three
> blocks would be a lie about the runtime (and worse, it would be the
> *Parallel* picture — three instances is precisely how scene 6 draws
> Parallel). The honesty of "one body, re-run" is also the legibility: the
> viewer watches the *same* Function light up, resolve, go dark, light up
> again — and "same steps, next item" is the only possible read. The single
> drawn body re-running **is** the sequential schedule, made visible.

> *"How is `<loop.currentItem>` 'a different value every time' if it's one
> block?"* Through `item: k`. The rig's `itemValue()` looks up
> `ITEMS[inst.item]` and feeds it to the resolving tag, so on pass 0 the tag
> resolves to `"x"`, on pass 1 to `"y"`, on pass 2 to `"z"`. The reference is
> the same (`<loop.currentItem>`); the *binding* changes. That is exactly the
> product's semantics: inside the loop, `<loop.currentItem>` is whatever the
> current iteration's item is — one name, a new value per pass.

## The resolution mechanic — `ResolvedTag`, glow → dip → value → revert

The single most important micro-interaction in the video is the tag
resolving *in place*. It's the `ResolvedTag` move (`tag` glows blue, then
dip-swaps through a blank midpoint to the runtime `value`, keeping a faint
blue residue to mark provenance), driven by two values per pass:

- `tagGlow` (rises `T+0.7 → T+1.0`, falls `T+1.3 → T+1.6`): the unresolved
  `<loop.currentItem>` tag lights selection-blue — "this reference is about
  to be read."
- `resolve` (rises `T+0.95 → T+1.35`, falls `T+1.95 → T+2.35`): the tag
  **dips out and the item value dips in, right where the tag was** — `"x"` on
  pass 0. Then `resolve` falls back to 0, and the value dips back to the tag.

> *"Why does the value appear *in the row* and not slide down the wire from
> somewhere?"* This is the iron rule of the whole series, and it's load-
> bearing here: **values never ride wires; they resolve in place. Wires carry
> light, not cargo.** The pulse crossing the inner wire (`pulseIn`) is a
> streak of light meaning "control passed from the pill to the Function" —
> nothing rides it. The *value* `"x"` materializes inside the Function's
> `Code` row, where `<loop.currentItem>` lives, because that's where the
> reference is. A value sliding down the wire would teach that Sim passes data
> along edges, which it doesn't — data flows by *reference*, resolved at the
> point of use. Breaking this for a flashier frame would teach a lie about the
> product. The resolution-in-place is the truthful, and the only, way to draw
> "the current item became x."

> *"Why does the resolution **revert** to the tag at the end of each pass?"*
> Two reasons. Honesty: after the pass, the binding is gone — the block is no
> longer running, so it shows its *configured* state (the tag), not a stale
> value. Legibility: reverting clears the slate so the next pass's resolution
> reads as a fresh event (`"x"` → tag → `"y"`), not as `"x"` getting
> overwritten by `"y"`. The revert is what makes the three resolutions read
> as three distinct passes rather than one value mutating.

## The no-overlap guarantee — why it can never show two passes at once

The pass index `k` is computed from non-overlapping time windows
(`t < ITER_T[1] ? 0 : ...`), so **exactly one pass is current at any
instant**, and every beat keys off that single pass's `T`. There is no way
for pass 0's `fnLive` and pass 1's `fnLive` to both be true — they're the
same expression evaluated against whichever `T` is active. This is the
structural enforcement of "one at a time": it isn't a matter of careful
timing that *happens* to not overlap; it's impossible for it to overlap,
because there's one block and one current pass.

> *"Why is non-overlap worth enforcing structurally rather than just spacing
> the windows?"* Because "strictly one at a time" is the *claim* of the
> scene, and it's the half of the contrast that scene 6 (all-at-once) plays
> against. If two passes ever flickered together, the sequential lesson would
> blur and the Parallel contrast would lose its punch. Building it so overlap
> is impossible means the claim is true by construction — the same discipline
> as rendering one rig for continuity.

## The pace IS the lesson — three passes take ~3× one pass

The three passes start at `3.2`, `5.8`, `8.4` — about **2.6s apart** — and
each pass's full cycle (blip → pulse → live → ok → resolve → revert) runs
~2.35s. So Run A occupies roughly `3.2 → 10.7s` of run time for three items.
This duration is *deliberate* and it's set up to be **contrasted**: scene 6
runs the same three items in about the time **one** pass takes here, because
they go at once. The script states it outright — "Run A's three passes take
~3× the time of Run B's one simultaneous pass." The slowness of this scene is
not a pacing accident; it is the measuring stick the Parallel run will be
read against. Sequential *costs* time, and you feel the cost here so the
savings land there.

## The camera — lean in to watch the inside, lean back before the cut

```ts
const lean = Math.min(c(1.8, 3.0, 0, 1, EASING.inOut),
                      c(11.6, 12.8, 1, 0, EASING.inOut));
// interpolate px/py/s from identity → LEAN (container-centered, 1.12×) → identity
```

The camera eases from identity onto the container (`LEAN = {px: container
center, s: 1.12}`) over `1.8 → 3.0`, holds through all three passes, and
eases back to identity over `11.6 → 12.8` — **before** the cut. The `1.12×`
zoom is chosen so Start and Summary stay just in frame (`1665 × 1.12 = 1865 <
1920`); the lean tightens onto the *inside* of the container, which is where
the iteration is happening, without losing the workflow's context entirely.

> *"Why move the camera *first*, then run, and lean back *before* the run is
> fully resolved?"* Two rules. First: **move the camera between events, not
> during them.** The lean-in completes (by `3.0`) before the first pass's
> resolution (`~4.5`), so the iteration plays against a *fixed* tighter frame
> — motion-on-motion is avoided, the eye reads the passes against a steady
> lens. Second, and this is the freeze-cut setup: the camera returns to
> identity over `11.6 → 12.8`, so the *framing* is neutral at the cut even
> though the container's live ring is still on. The next scene (results) opens
> at identity framing with the container live — the camera is home, the state
> is held.

## The freeze-cut OUT — the live ring holds, on purpose

```ts
const containerLive = t >= 1.4;   // holds through the scene end (freeze-cut)
```

`containerLive` has **no upper bound** — once the run enters at `1.4s`, the
container's live ring is on for the rest of the scene *and across the cut into
scene 4*. Every other state in the scene is a closed window (each `fnLive`,
each `fnOk` ends); the container's ring is latched open.

> *"Why hold the container live across the cut instead of completing the run
> here?"* Because the run is **one continuous event**, and scenes 3 and 4 are
> two halves of it: scene 3 is "the passes ran," scene 4 is "the results came
> out." If scene 3 reverted the container ring at its end and scene 4 re-lit
> it, you'd be drawing *two* runs — run, stop, run again — when the truth is
> one run seen in two beats. The script names this explicitly: the 3→4
> boundary is a **deliberate freeze-cut** where the container's live ring is
> the *only* carried state — camera back at identity, every iteration
> resolution already reverted before the cut. The held ring says "the inside
> finished its passes, but the loop hasn't produced its output yet" — which is
> exactly the held moment scene 4 opens inside. Because both scenes render the
> same rig and scene 4 simply keeps the ring on (its `containerLive = t <
> 0.9`), the boundary is pixel-identical and the run reads as continuous.

## How to think about the whole scene

1. *What does a Loop do?* Runs the inside once per item, in order → one body,
   re-run three times, never overlapping.
2. *How does each pass differ?* `<loop.currentItem>` rebinds →
   `ResolvedTag` resolves the same tag to `"x"`, then `"y"`, then `"z"`,
   in place, reverting between passes.
3. *How do I make "sequential" undeniable?* Compute one current pass index
   from non-overlapping windows → two passes can't co-exist by construction.
4. *How do I make the cost felt?* Let three passes take ~3× one pass → the
   measuring stick for scene 6's savings.
5. *Where's the camera?* Lean in to watch the inside, lean back to identity
   before the cut → fixed frame during motion, neutral framing at the
   freeze-cut.
6. *What carries across the cut?* Only the container's latched live ring →
   the run is one event, paused mid-flight.

## Exit state (what scene 4 inherits — a freeze-cut carry)

`container live ring ON (latched, carries across the cut) · all three passes
done, every resolution reverted to the tag · Function not live · camera at
identity · Loop identity (phase 0)`. Scene 4 opens on this exact frame — the
held live moment — and completes the same run: the container settles ok, its
exit wire fires once, and `<loop.results>` resolves in Summary. The carried
state is the container's live ring; the boundary is identical by
construction.

<!-- loops / 04-the-results-come-out.md -->
# Scene 4 — `the-results-come-out`  ·  archetype: **freeze-cut completion + reference-resolution**

Source: `../source/scenes/TheResultsComeOutScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This scene is the **payoff** of the Loop run. Scene 3 ran the inside three
times and left the container live; scene 4 opens *inside* that held moment
and finishes the run: the loop exits **once**, and the consumer downstream
reads `<loop.results>`, which resolves to **`["x", "y", "z"]`** — every
pass's result, in order, collected as one array. Read it as the worked
example for "what happens after a loop, and how do I show the collected
output truthfully." The transferable rule: **after the loop, the per-item
context is gone; you reference the loop by name and get all the results as
one ordered array — and the array is mechanically derivable, never invented.**

---

## What this scene is for

A Loop's whole value isn't just "it ran three times" — it's "it ran three
times **and handed me everything those runs produced.**" Scene 3 showed the
mechanism (sequential passes); scene 4 shows the *product* of the mechanism
(the collected array) and how you get at it (by the container's name,
`<loop.results>`). Without this scene, the loop would look like it ran and
then evaporated. This is the scene that closes the loop — literally.

The rule is *one idea per scene*: "after the loop, you get one ordered
array." Not the passes again, not the schedule contrast — just the exit and
the resolution.

## What it looks like

The scene opens on the held freeze-cut frame: the container is still live
(blue ring), camera at identity, the Loop workflow exactly as scene 3 left
it. The container's ring flips from **live blue to ok green** — the loop is
done. Its source handle fires **one** pulse across the exit wire into
**Summary**. Summary goes live, and in its `Messages` row, `<loop.results>`
**resolves in place** to `["x", "y", "z"]` — the three pass results, in
order, as a single value. Summary settles ok-green, the frame holds, and then
everything reverts to the resting Loop template (rings release, the
resolution reverts to the tag).

## The freeze-cut completion — opening inside a held moment

```ts
const containerLive = t < 0.9;            // carried in from scene 3
const containerOk   = t >= 0.9 && t < 7.0;
```

The first thing the scene does is **inherit** the container's live ring
(`containerLive = t < 0.9`) — the latched state scene 3 handed across the
cut. For the first ~0.9s the container is still live, *exactly* as it was on
scene 3's last frame, then it transitions to the ok-green ring. This is the
other half of the freeze-cut: scene 3 latched the ring **on** and ended;
scene 4 opens with it **still on** and only then resolves it. The cut is
invisible because nothing changes at the boundary — the ring was blue, the
ring is blue — and the continuation (blue → green) is what tells you the run
moved forward.

> *"Why does scene 4 inherit the live ring for 0.9s before turning it green
> instead of opening already-green?"* Because the freeze-cut's whole job is
> that the boundary frame is *identical* on both sides. Scene 3's last frame
> is "container live"; scene 4's first frame must also be "container live," or
> the cut would flash. Holding the inherited state for a beat, then resolving
> it, is what makes the two scenes read as one continuous run rather than two
> takes. The ~0.9s also gives the eye a moment to register "we're back,
> looking at the whole workflow at identity framing" before the completion
> fires.

> *"Why does the loop exit only ONCE when it ran three times?"* This is the
> teaching point of the scene, drawn as a single pulse. Inside, the body ran
> per item; but the *container* — the loop as a whole — has a single exit. It
> runs N times internally and then hands control onward **once**, with all
> the results collected. Firing the exit wire three times would falsely imply
> the downstream block runs once per item; firing it once says "the loop
> finished, here is its single output." The one exit pulse is the visual claim
> "iteration happens *inside*; downstream sees the loop as one step."

## The reference-resolution — `<loop.results>` → `["x", "y", "z"]`

```ts
const resultsGlow    = Math.min(c(2.3, 2.7), c(3.2, 3.6, 1, 0));
const resultsResolve = Math.min(c(2.6, 3.1), c(6.2, 6.8, 1, 0));
// resultsTag={{glow: resultsGlow, resolve: resultsResolve}}
```

In Summary's `Messages` row, the value reads `Summarize <loop.results>`. As
Summary goes live, the `<loop.results>` tag glows blue (`resultsGlow`), then
**resolves in place** (`resultsResolve`) to `["x", "y", "z"]` — dipping
through a blank midpoint to the array, keeping a faint blue residue marking
provenance, exactly the `ResolvedTag` move from scene 3's per-pass
resolutions. After a long hold it reverts to the tag over `6.2 → 6.8`.

> *"Why does the result resolve in Summary's row and not as an array
> floating out of the container?"* Same iron rule as scene 3: **values
> resolve in place, where the reference lives — they never ride wires.** The
> exit pulse is light meaning "control passed to Summary"; the *value*
> `["x", "y", "z"]` materializes inside Summary's row, where
> `<loop.results>` is written. The provenance residue (faint blue on the
> resolved value) says "this text came from that reference." This is the core
> teaching move for Sim's tag system, reused here at the *array* scale: a
> reference to the loop's collected output, resolved to the actual collected
> output, right where you'd use it.

> *"Why `<loop.results>` and not `<loop.currentItem>`?"* Because **the
> per-item context is gone.** Inside the loop, each pass had a
> `<loop.currentItem>` (scene 3). *After* the loop, there is no "current
> item" — the iteration is over. What survives is the loop's *collected*
> output, addressed by the **container's name**: `<loop.results>`. The
> distinction is the whole semantic lesson — `currentItem` lives inside,
> `results` lives after, and the name (`loop`) is how you reach the container
> from downstream. (This name-by-reference fact is exactly what scene 5's
> morph exploits: rename the container and the tag follows.)

> *"Why is the array `["x", "y", "z"]` specifically — isn't that the input
> collection?"* Yes, and that's the point of the grounding choice. The inner
> Function's code is `return <loop.currentItem>` — each pass returns its own
> item unchanged. So the collected results array is **mechanically
> derivable**: pass 0 returned `"x"`, pass 1 returned `"y"`, pass 2 returned
> `"z"`, in order ⇒ `["x", "y", "z"]`. Zero invented values. The viewer who
> watched scene 3's three resolutions (`"x"`, then `"y"`, then `"z"`) can
> *predict* the array before it resolves — and then sees it confirmed. The
> identity-function body was chosen precisely so the output is honest and
> self-evident, not a number the author made up.

## "In order" — the array preserves pass order

The array reads `["x", "y", "z"]`, in the exact order the passes ran in scene
3. This is not incidental: a Loop collects results **in iteration order**, and
because scene 3 took the items strictly in order (`x → y → z`), the array
mirrors that order. The viewer's eye, having counted `x, y, z` in scene 2 and
watched them resolve `x, y, z` in scene 3, now sees them collected `x, y, z`
in scene 4 — the same sequence, three times, which is what makes "in order"
land without a word. (This is also the property scene 6 will preserve: even
when Parallel runs them at once, the collected array still comes out in
order.)

## The animation, beat by beat

| beat | window (s) | what happens |
|---|---|---|
| inherit live ring | `t < 0.9` | container still blue (freeze-cut carry) |
| loop settles ok | `0.9 → 7.0` | container ring blue → green |
| exit pulse | `1.3 → 2.1` | one streak crosses container → Summary |
| exit wire heats | `1.3 → 1.7` up, `6.0 → 6.6` down | wire brightens while on the live path |
| Summary live | `2.0 → 3.4` | Summary blue ring |
| results glow | `2.3 → 2.7` up | `<loop.results>` tag lights |
| results resolve | `2.6 → 3.1` up | tag → `["x", "y", "z"]` in place |
| Summary ok | `3.4 → 6.6` | Summary ring blue → green |
| hold | `~3.6 → 6.0` | settled; the collected array sits |
| revert | `6.0 → 6.8` | rings release, resolution reverts to tag |

> *"Why does the exit wire `heat` (a separate, longer window) on top of the
> `pulse` (a quick streak)?"* They describe different lifetimes. The pulse is
> an instant — control crossing, gone by `2.1`. The heat is a *duration* —
> "this wire is on the live path" — so it brightens as the pulse departs
> (`1.3 → 1.7`) and only cools once the whole completion is done
> (`6.0 → 6.6`). A streak is an event; "on the live path" is a state. Two
> timings, two drivers — the same discipline the run scenes use everywhere.

> *"Why such a long hold (3.6s → 6.0s) on the resolved array?"* Because the
> array **is** the payoff of the entire Loop half of the video — "you ran
> three times and here is everything you got, in order, as one value." It
> earns dwell time. The long settled hold also makes the scene stretchable
> for narration (extend-only timing), and it lets the viewer actually read
> `["x", "y", "z"]` and connect it back to the three passes they just
> watched.

## Why everything reverts to template before the scene ends

Over `6.0 → 6.8` the rings release and `<loop.results>` reverts to its tag,
landing the scene on the **resting Loop template** — the same frame scenes 1
and 2 ended on. This is deliberate: scene 5 (the morph) needs a clean,
neutral Loop template to morph *from*. By reverting the run's residue, scene
4's exit equals the template, so scene 5 can open on it and do its one job
(swap Loop → Parallel) without first having to clean up a run. Every run
reverts before its scene ends — except the named freeze-cut, which is exactly
the one carry the video allows.

## How to think about the whole scene

1. *What did the loop produce?* One ordered array of all pass results →
   `<loop.results>` resolves to `["x", "y", "z"]`.
2. *How does the loop hand off?* Once → a single exit pulse, not three.
3. *How do I get the output?* By the container's **name** →
   `<loop.results>`, because the per-item context is gone after the loop.
4. *How do I keep it honest?* Identity-function body ⇒ the array is
   derivable, not invented; resolve it in place, not down a wire.
5. *How do I open and close cleanly?* Inherit the live ring (freeze-cut),
   then revert to template → the cut in is invisible, the cut out is the
   morph's clean starting frame.

## Exit state (what scene 5 inherits)

`resting Loop template · no rings · `<loop.results>` reverted to tag · all
wires drawn, idle · camera at identity · Loop identity (phase 0)`. Identical
to the scenes 1/2 template. Scene 5 opens here, puts a selection ring on the
container, and runs the single continuous Loop → Parallel morph.

<!-- loops / 05-swap-the-container.md -->
# Scene 5 — `swap-the-container`  ·  archetype: **morph-swap**

Source: `../source/scenes/SwapTheContainerScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is the hinge of the video and the second half of the move that earns it
a place in the pack. The container morphs **Loop → Parallel** in one
continuous gesture at **constant geometry** — and the entire lesson is what
*doesn't* change. The box, the inner Start pill, the inner Function, the
wires, the items: all identical. Only the **schedule** changes — and the
schedule is exactly the thing you can't draw directly, so it's communicated
*by drawing everything else holding still.* Read it as the worked example for
"how do I teach that two things are the same except one property" — the answer
is the morph: one element, two identities, crossfaded in place, with the
shared structure visibly untouched.

---

## What this scene is for

The video's thesis is "one shape, two schedules." Scenes 1–4 built and ran
the **Loop** schedule. Scene 6 will run the **Parallel** schedule. Scene 5 is
the bridge that makes those two runs read as *the same container on a
different schedule* rather than two unrelated blocks. It does that by morphing
the existing container in place — same DOM, same position, same size — so the
viewer's eye never loses the object. The thing that was a Loop *becomes* a
Parallel, and you watch it happen to the very same box.

The rule is *one idea per scene*: "swap the schedule, nothing else changes."
The stillness of everything except the chip, name, and tags **is** the idea.

## What it looks like

The resting Loop template, camera at identity. The container takes a blue
selection ring (it's being edited). Then, in one continuous ~4s morph: the
header chip crossfades from **blue Repeat (#2FB3FF)** to **yellow Split
(#FEE12B)** — and the glyph goes from white to dark as it does — while the
name dip-swaps **Loop → Parallel**; in sync, the Function row's tag dips
`<loop.currentItem>` → `<parallel.currentItem>`, and the consumer dips from
the Loop's identity (**Summary** / `Summarize <loop.results>`) to the
Parallel's (**Aggregate** / `merge(<parallel.results>)`). **Inside the
container, nothing moves** — same box, same inner Start pill, same Function 1,
same wires, same items. The ring releases. The container is now a Parallel.

## The distinctive move — one `phase`, the whole morph, constant geometry

The scene is almost nothing in code, and that minimalism is the point:

```ts
const ring  = t >= 0.6 && t < 6.6;
const phase = c(1.4, 5.4, 0, 1, EASING.inOut);   // 0 = Loop … 1 = Parallel
// ...
<Rig phase={phase} container={{highlighted: ring}} />
```

A single value, `phase`, eases `0 → 1` over `1.4 → 5.4`, and the rig
translates that one number into the *entire* identity change. Look at how the
rig fans `phase` into staggered sub-curves (`morphCurves` in `_rig.tsx`):

```ts
morphCurves(phase) = {
  headerMix:  sub(phase, 0.0, 0.4),   // chip color+glyph, container name
  tagMix:     sub(phase, 0.3, 0.7),   // <loop.currentItem> → <parallel.currentItem>
  resultsMix: sub(phase, 0.55, 0.95), // consumer identity + <loop.results> → <parallel.results>
}
```

Three things morph, and they morph in a slight **stagger** — header first,
then the inner tag, then the consumer — all derived from the one `phase`
value. Each sub-morph is a crossfade or `DipSwap`:

- **The chip:** `interpolateColors(headerMix, [blue, yellow])` for the fill;
  the white Repeat glyph fades out as the dark Split glyph fades in (the dark
  glyph because #FEE12B is light — the product's own luminance rule for icon
  contrast). The chip's *size, radius, and position never change.*
- **The name:** `DipSwap a="Loop" b="Parallel"` at `headerMix` — dips through
  blank, comes back as the other word, no layout pop.
- **The Function tag:** `DipSwap` between `<loop.currentItem>` and
  `<parallel.currentItem>` at `tagMix`.
- **The consumer:** `DipSwap` of the *whole identity* at `resultsMix` —
  name (Summary → Aggregate), header chip morph (green agent → red function),
  row title (Messages → Code), and row value (`Summarize <loop.results>` →
  `merge(<parallel.results>)`).

> *"Why drive everything off one `phase` value?"* Because it guarantees the
> morph is **reversible and boundary-safe by construction.** Scene 7 plays
> the *same* curves backward by running `phase` from `1 → 0`; there is no
> separate "un-morph" code to keep in sync. And because `phase` is a pure
> function of the frame, every boundary frame is exact — at `phase=0` the rig
> is pixel-identical to the Loop template (scene 4's exit), at `phase=1` it's
> the Parallel template (scene 6's entry). One value, two clean endpoints, a
> continuous path between.

> *"Why stagger the three sub-morphs instead of changing them all at once?"*
> So the eye can follow the change as a *gesture* rather than a flash. The
> header leads (it's the thing you look at — the container's identity), the
> inner tag follows (the reference inside updating), the consumer lands last
> (the downstream reference updating). Reading header → tag → consumer mirrors
> the causal story: "I changed the container, so the references that name it
> update." It also keeps any single frame from being a muddy half-of-
> everything; at each instant one sub-morph is mid-flight and the others are
> at rest.

## The lesson is the stillness — what does NOT change

This is the crux. The morph touches **colors, labels, and tags — and nothing
else.** Look at what is conspicuously absent from the scene:

- No height change. No position change. No re-layout. (The continuity
  contract states it: "Morph = colors/labels/tags only … No height or
  position changes — the boundary-safe morph by construction.")
- The **box** is the same box.
- The **inner Start pill** is in the same place — the inside still starts the
  same way.
- The **inner Function 1** is the same block in the same slot.
- The **inner and outer wires** are unchanged.
- The **items** (`["x", "y", "z"]`) are the same collection.

> *"Why is 'nothing inside changes' the whole point — wouldn't a bigger,
> flashier transformation teach more?"* No — it would teach the *wrong* thing.
> The claim the video is making is precise: **a Loop and a Parallel are the
> same container with the same steps inside; the only difference is the
> schedule.** If the morph also rearranged the inside, the viewer would
> conclude Loop and Parallel are *different machines*, and the entire
> "one shape, two schedules" thesis collapses. By holding the box, the pill,
> the Function, the wires, and the items dead still while only the identity
> chrome crossfades, the scene proves the claim visually: you are looking at
> the same thing, relabelled. The schedule — the one real difference — isn't
> drawable as an object, so it's drawn as *the absence of any other change.*

## The reference-follows-name detail — why the tags update "on their own"

When the name dips Loop → Parallel, the tags dip `<loop.…>` →
`<parallel.…>` in sync. This isn't decoration; it's a documented product
fact. In Sim, you reference a container by its **name**, so the resolved tag
is the container's name plus the field (`<loop.results>`,
`<parallel.results>`). Rename the container and every reference to it follows
the new name. The morph draws this: the tags don't change because the author
edited them — they change *because the container's name changed*, and the
references track the name. The stagger reinforces it (name leads, tags
follow), so you read cause (rename) → effect (tags update), not two
simultaneous edits.

> *"Why does the consumer change identity entirely (Summary→Aggregate,
> Messages→Code, Summarize→merge) rather than just swapping the tag?"* This is
> a grounding-and-fit decision, and it's worth knowing because it's the kind
> of trade you'll face. The first draft kept "Summary / Summarize
> <parallel.results>" in both phases with only the tag swapped — but
> `Summarize <parallel.results>` measured *wider than the block row* and
> truncated on a render. The product's own docs pair the Loop example with a
> **Summary** agent and the Parallel example with an **Aggregate** function
> (`merge(<parallel.results>)`) — which both *fits* the row and is better
> grounded in real product surfaces. So the consumer dips its whole identity.
> The "same steps" claim is about the **inside of the container**, which still
> changes nothing; the downstream consumer naturally differs between a
> summarize-the-sequence and merge-the-parallel-outputs job. The lesson is
> intact, and the layout doesn't truncate.

## The animation, beat by beat

| beat | window (s) | what happens |
|---|---|---|
| selection ring on | `0.6` | container takes the blue editing ring |
| header morph | `phase 0.0 → 0.4` (≈ `1.4 → 3.0`) | chip blue Repeat → yellow Split; name Loop → Parallel |
| tag morph | `phase 0.3 → 0.7` (≈ `2.6 → 4.2`) | Function tag `<loop.currentItem>` → `<parallel.currentItem>` |
| consumer morph | `phase 0.55 → 0.95` (≈ `3.6 → 5.2`) | Summary/Messages/Summarize → Aggregate/Code/merge |
| phase completes | `5.4` | rig is the Parallel template |
| ring releases | `6.6` | selection ring off; settle |

The whole morph uses `EASING.inOut` — the project's curve for *transforms* —
because a morph is a transformation traveling through identity-space; it
should accelerate off the Loop state and decelerate into the Parallel state,
not snap. (Entrances get `out`, exits get `in`, transforms get `inOut` — the
same rule everywhere in the build.)

> *"Why the selection ring through the morph?"* It frames the change as **an
> edit** — "I selected this container and switched its type" — which is
> literally how you'd do it in the product. The ring is on from `0.6` (before
> the morph starts) to `6.6` (after it completes), bracketing the change as a
> single deliberate editing action, then releasing to leave the clean
> Parallel template.

## Why this scene ends on a clean Parallel template

By the end, `phase=1` and the ring is released, so the rig is the **resting
Parallel template** — yellow Split chip, name "Parallel",
`<parallel.currentItem>` in the Function, Aggregate / `merge(<parallel.
results>)` downstream — at the exact same geometry as the Loop template.
Scene 6 opens on this and runs the Parallel schedule. Because the morph is a
pure function of `phase` and ends exactly at `phase=1`, the 5→6 boundary is
the Parallel template down to the pixel.

## How to think about the whole scene

1. *What's the claim?* Loop and Parallel are one container, one set of inner
   steps, differing only in schedule → morph in place, constant geometry.
2. *How do I morph cleanly and reversibly?* One `phase` value fanned into
   staggered sub-curves → reversible (scene 7 reverses it) and boundary-exact.
3. *How do I show "only the schedule changed"?* Crossfade only the chip,
   name, and tags; hold the box, pill, Function, wires, and items perfectly
   still → the stillness is the proof.
4. *How do the tags know to update?* References follow the container's name →
   rename leads, tags follow (the stagger draws the causality).
5. *Why does the consumer fully swap?* Grounding + fit — the docs pair each
   schedule with its own consumer, and `merge(<parallel.results>)` fits the
   row where `Summarize <parallel.results>` truncated.

## Exit state (what scene 6 inherits)

`resting Parallel template (phase 1) · yellow Split chip, name "Parallel" ·
`<parallel.currentItem>` in the Function, Aggregate / `merge(<parallel.
results>)` downstream · no rings · same geometry as the Loop template ·
camera at identity`. Scene 6 opens here and runs Run B — the same three items,
all at once.

<!-- loops / 06-all-at-once.md -->
# Scene 6 — `all-at-once`  ·  archetype: **run (the simultaneous half of the contrast)**

Source: `../source/scenes/AllAtOnceScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is Run B, and it is the **payoff of the contrast.** Scene 3 ran the same
three items one at a time (Loop); scene 6 runs them **all at once**
(Parallel). The container is identical to scene 3's — same box, same inner
Start pill, same Function, same items — and the morph in scene 5 changed only
the schedule. So this scene exists to make the schedule *visible* as motion:
the inner Function fans into **three instances**, one Start fires **once**,
**three pulses leave together**, all three go live **at the same instant**,
each resolves its **own** item simultaneously, and they finish together in
about the time **one** pass took in scene 3. Read it as the worked example for
"how do I draw concurrency" — and the rule to steal: **simultaneity is drawn
as N instances sharing one clock; sequence (scene 3) was one instance re-run
on N clocks. Same container, opposite schedule, and the timing IS the lesson.**

---

## What this scene is for

The video has built one claim across five scenes: Loop and Parallel are the
same container on different schedules. Scene 6 is where you *see* the other
schedule run and *feel* why you'd pick it: independent work, done all at once,
in a fraction of the time. The whole point is the side-by-side with scene 3 —
this scene is constructed to be read against that one. Every choice here has a
counterpart in scene 3, inverted: one body re-run → three bodies run once;
three pulses staggered in time → three pulses fired together; `<…currentItem>`
rebinding across passes → three `<…currentItem>`s resolving in parallel.

The rule is *one idea per scene*: "a Parallel runs an instance per item, all
at once, and still collects one ordered array." Not the morph (scene 5), not
the schedule choice (scene 7) — just the simultaneous run.

## What it looks like

On the Parallel template (yellow Split chip), the run enters: outer Start
blips, a pulse crosses into the container, the container takes a live ring.
Then the difference from scene 3: **Function 1 fans into three instances** —
the single block separates into top / middle / bottom — and two extra inner
wires draw to the new instances. The inner Start pill blips **once**; **three
pulses leave together** along the three inner wires; **all three instances go
live at the same instant**; each row resolves its **own** item —
`<parallel.currentItem>` → `"x"` (top), `"y"` (mid), `"z"` (bottom),
**simultaneously**; all three settle ok **together**, in roughly the span one
pass took in scene 3. The resolutions revert, the three instances **collapse
back into one block**, the container settles ok, the exit fires **once**, and
`<parallel.results>` resolves in Aggregate to `["x", "y", "z"]` — the same
collected array. Full revert to the Parallel template.

## The distinctive move — the fan: N instances, one shared clock

The fan is the visual heart of the scene:

```ts
const fan = c(1.8, 2.8, 0, 1, EASING.inOut) - c(6.5, 7.4, 0, 1, EASING.inOut);
// fan: 0 = single block → 1 = three instances → 0 = collapsed back
```

`fan` opens `0 → 1` (instances separate) over `1.8 → 2.8`, holds, then
collapses `1 → 0` over `6.5 → 7.4`. The rig's `instY(fan)` interpolates the
three instance positions: at `fan=0` all three sit at the middle slot (one
block); at `fan=1` they're spread to top / mid / bottom at `±FAN_PITCH`. The
extra inner wires and the top/bottom instances only render while `fan > 0`, so
at *both* of the scene's boundary frames the rig is the single-instance
Parallel template — the fan exists only between run-start and run-end, fully
inside this scene.

Then the simultaneity — and this is the line that *is* the scene:

```ts
// All three instances share one clock — that synchrony IS the scene.
const live    = t >= 3.85 && t < 5.3;
const ok      = t >= 5.3  && t < 5.95;
const tagGlow = Math.min(c(3.9, 4.2), c(4.5, 4.8, 1, 0));
const resolve = Math.min(c(4.15, 4.55), c(5.75, 6.15, 1, 0));
const inst = (item) => ({highlighted: live, state: ok ? "ok" : "none",
                         tag: {glow: tagGlow, resolve}, item});
// ...
fn={inst(1)}  fnTop={inst(0)}  fnBot={inst(2)}
pillBlip={...one blip...}
pulseIn={pulses}  pulseInTop={pulses}  pulseInBot={pulses}   // ← same value
```

The three instances are built from **one** `inst()` factory driven by **one**
set of windows — `live`, `ok`, `tagGlow`, `resolve` are scalars, not arrays,
and all three instances read the same ones. The only thing that differs is
`item` (0, 1, 2), which binds each instance's `<parallel.currentItem>` to its
own collection element. The three inner pulses (`pulseIn`, `pulseInTop`,
`pulseInBot`) are all fed the *same* `pulses` value, so they travel as one.

> *"Why three instances here when scene 3 used one block re-run?"* Because
> that is the actual difference between the two schedules, and drawing it
> exactly is the lesson. A **Parallel** spins up a *separate instance per
> item* and runs them concurrently — so it's drawn as the body fanning into
> three real instances. A **Loop** has one body it executes repeatedly — so it
> was drawn as one block re-running (scene 3). The contrast in the drawing *is*
> the contrast in the runtime: N-instances-at-once vs one-instance-N-times.
> If scene 6 also used one re-run block, the only difference from scene 3
> would be speed, and "instance per item" — the real mechanism — would be
> invisible.

> *"Why drive all three instances off one shared clock — couldn't they each
> have their own windows?"* The shared clock **is** the simultaneity, enforced
> structurally. Because `live`, `ok`, and `resolve` are single scalars read by
> all three instances, it is *impossible* for the three to light, resolve, or
> finish at different times — they are the same expression. This mirrors scene
> 3's opposite guarantee (where one current-pass index made overlap
> impossible). There, non-overlap was structural; here, synchrony is
> structural. In both scenes the *claim* is true by construction, not by
> careful timing — which is why neither can drift on a re-render.

> *"Why does the inner Start pill blip ONCE while three pulses leave?"* Because
> the parallel fan-out is a *single* dispatch that branches to N instances —
> the inside starts once and fans out, rather than starting three separate
> times. One blip, three simultaneous pulses says "one trigger, N concurrent
> branches." (Contrast scene 3: the pill blipped three separate times, one per
> sequential pass.) The single blip is the parallel signature; the three
> staggered blips were the sequential signature.

## The timing contrast — the whole video in one comparison

This is the line the script underlines: *"Run A's three passes take ~3× the
time of Run B's one simultaneous pass."* Lay the two runs side by side:

| | scene 3 (Loop) | scene 6 (Parallel) |
|---|---|---|
| body | one block, re-run | three instances |
| inner Start | blips **3×** (per pass) | blips **once** |
| inner pulses | one, **3×** in sequence | **three together** |
| go-live | three times, never overlapping | **all three at once** |
| `<…currentItem>` resolves | `x`, then `y`, then `z` (rebinds) | `x`, `y`, `z` **simultaneously** |
| run span | passes ~2.6s apart, ~`3.2 → 10.7s` | live `3.85 → 5.95s` — **one pass's worth** |
| results | `["x","y","z"]` in order | `["x","y","z"]` — same array |

The three instances go live `3.85 → 5.3` and settle `5.3 → 5.95` — a single
live window, the duration of **one** of scene 3's passes. Three items'
worth of work, in one item's worth of time. That measured difference — same
items, same body, ~3× faster — is the entire payoff of the contrast, and it's
why scene 3 was deliberately made to *cost* time: so you could feel the
saving here.

> *"Why does it matter that the runs are framed at the same geometry and use
> the same collection?"* Because the contrast only reads if *everything else
> is held equal.* Same container position, same inner Function, same
> `["x","y","z"]`, same resolution mechanic — so the *only* perceptible
> difference between scene 3 and scene 6 is the schedule (sequential vs
> simultaneous) and its consequence (slow vs fast). One collection through
> both phases (script assumption 2) is what makes "only the schedule changed"
> literally true on screen.

## The collected array survives concurrency — still `["x", "y", "z"]`, in order

After the fan collapses, the completion is the same shape as scene 4: the
container settles ok, the exit fires **once**, and `<parallel.results>`
resolves in Aggregate's row to `["x", "y", "z"]`.

> *"Why is the array still in order when the instances ran simultaneously?"*
> Because a Parallel collects results **by item position**, not by finish
> order — instance 0's output goes to slot 0, instance 1's to slot 1, etc. So
> even though all three ran at once, the collected array preserves the
> collection's order: `["x", "y", "z"]`. This is the reassuring symmetry with
> scene 4 — *the schedule changed, but the output contract didn't.* You get
> the same ordered array from Parallel that you got from Loop; concurrency
> bought you speed without costing you order. (And again it's derivable: each
> instance returns `<parallel.currentItem>`, so the array is exactly the
> inputs, in order — zero invented values.)

## The fan is fully self-contained — the boundaries are the template

```ts
const containerLive = t >= 1.3 && t < 7.5;     // closed window — NOT latched
const containerOk   = t >= 7.5 && t < 11.2;
```

Unlike scene 3, this run's container ring is a **closed** window — it lights,
settles ok, and reverts, all inside the scene. There's no freeze-cut here: the
fan opens and collapses (`fan` returns to 0 by `7.4`), the run completes, and
everything reverts to the Parallel template before the cut. At both of the
scene's boundary frames, the rig is the single-instance Parallel template.

> *"Why no freeze-cut this time, when scene 3 carried its live ring across the
> cut?"* Because scene 3's completion (the results) was a *separate scene*
> (scene 4), so the run had to be paused mid-flight and handed across. Scene 6
> contains its *own* completion — the results resolve in this same scene — so
> there's nothing to carry. The run is one continuous event start-to-finish
> within scene 6, and it cleans up after itself. The next scene (7) is the
> bookend, which wants a clean Parallel template to reverse-morph from.

## The animation, beat by beat

| beat | window (s) | what happens |
|---|---|---|
| outer Start blip | `0.4 → 0.9` | run enters |
| pulse → container | `0.7 → 1.4` | streak crosses edge 0 |
| container live | `1.3 → 7.5` | blue ring (closed window) |
| fan opens | `1.8 → 2.8` | one block → three instances; extra wires draw |
| inner Start blip | `3.0 → 3.85` | **one** blip |
| three pulses | `3.2 → 3.95` | leave **together** along three inner wires |
| three instances live | `3.85 → 5.3` | all at once (shared clock) |
| three tags glow/resolve | `3.9 → 4.55` | `x`, `y`, `z` resolve **simultaneously**, in place |
| three settle ok | `5.3 → 5.95` | together |
| resolutions revert | `5.75 → 6.15` | tags return |
| fan collapses | `6.5 → 7.4` | three instances → one block |
| container ok | `7.5 → 11.2` | blue → green |
| exit pulse | `7.8 → 8.6` | **one** streak → Aggregate |
| Aggregate live + resolve | `8.5 → 9.5` | `<parallel.results>` → `["x","y","z"]` in place |
| Aggregate ok, hold, revert | `9.7 → 11.3` | settle, then back to template |

All transforms (`fan`, pulses, camera-free) use `EASING.inOut`; the run
follows the same grammar as every run scene — rings for state, streaks for
control, resolutions in place.

> *"Why open the fan first (1.8–2.8) and only fire the run after (3.0+)?"*
> Same rule as scene 3's camera: change the structure, *then* run against the
> changed structure. The fan settles into three instances before any of them
> light, so the synchronous go-live plays against a stable three-instance
> layout — you read "three things lit at once," not "things appearing and
> lighting in one blur." And the fan collapses *after* the run, before the
> exit, so the container hands off as a single unit (one exit pulse), exactly
> as a container should.

## How to think about the whole scene

1. *What does a Parallel do?* Runs an instance per item, concurrently → fan
   into three instances; one blip; three pulses together; one shared clock.
2. *How do I make "simultaneous" undeniable?* All instances read one scalar
   `live`/`resolve` → synchrony is structural, can't drift.
3. *How do I make the saving felt?* Three items finish in one pass's time →
   the measured ~3× contrast against scene 3.
4. *How do I keep "only the schedule changed" true?* Same container, same
   Function, same `["x","y","z"]`, same resolution move — only the count of
   live instances and the firing pattern differ.
5. *What's the output?* The same ordered array, collected by position →
   concurrency without losing order.
6. *How do I bound it cleanly?* Fan opens and collapses inside the scene; the
   run self-completes; boundaries are the Parallel template.

## Exit state (what scene 7 inherits)

`resting Parallel template (phase 1) · fan collapsed (single instance) · no
rings · `<parallel.results>` reverted to tag · camera at identity · same
geometry as every prior scene`. Scene 7 opens here, reverse-morphs Parallel →
Loop (replaying scene 5's curves backward to land on scene 1's end state), and
eases the camera back for the closing hold.

<!-- loops / 07-two-schedules-one-shape.md -->
# Scene 7 — `two-schedules-one-shape`  ·  archetype: **settle / bookend (reverse morph)**

Source: `../source/scenes/TwoSchedulesOneShapeScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is the closing scene, and it makes the video's thesis literal: **one
shape, two schedules.** It takes the Parallel container the run left and
morphs it *back* to Loop — playing scene 5's morph in reverse — so the last
thing you see is the very container you started with, having visibly been both
things. Read it as the worked example for "how do I end on the thesis without
a summary slide" — the answer is the bookend: reverse the one move that
defined the contrast, land exactly on the opening frame, and let the camera
ease back to a calm, balanced hold for the closing narration.

---

## What this scene is for

The video taught a contrast (Loop sequential vs Parallel simultaneous) by
running both schedules through one container. Scene 7's job is to **close the
loop on that argument** — to leave the viewer not on "Parallel" (where scene 6
ended) but on the *idea above both*: this is one shape, and Loop and Parallel
are two ways to schedule it. It does that physically: the container morphs
Parallel → Loop, returning to the exact frame the video opened on, so the
whole piece is bracketed — you began on a Loop, you saw it become a Parallel
and run both ways, and you end back on the Loop, now understanding it as one
of two options. Then the camera eases back a touch and holds for the take-home
narration.

The rule is *one idea per scene*: "one shape, two schedules — pick the one the
work calls for." Not a new mechanism, not a recap of every beat — just the
return that frames everything as one shape, held calm.

## What it looks like

The resting Parallel template (yellow Split chip, name "Parallel"). The
scene-5 morph plays **in reverse**: the chip crossfades yellow Split →
**blue Repeat**, the name dips **Parallel → Loop**, and the tags dip back
(`<parallel.currentItem>` → `<loop.currentItem>`, and the consumer returns to
Summary / `Summarize <loop.results>`). It lands on *exactly* scene 1's end
state — the resting Loop workflow. Then the camera eases **back ~7%** (pulls
out slightly), and the balanced frame holds, still, for the closing voiceover.

## The reverse morph — the same move, played backward

The entire morph is reused, run in the opposite direction:

```ts
const phase = 1 - c(0.8, 4.2, 0, 1, EASING.inOut);   // 1 → 0 (Parallel → Loop)
const s     = 1 - 0.07 * c(4.6, 6.0, 0, 1, EASING.inOut);  // ease camera back ~7%
// ...
<Camera px={960} py={540} s={s}>
  <Rig phase={phase} />
</Camera>
```

That's the whole scene. `phase` runs `1 → 0` over `0.8 → 4.2`, and the rig's
`morphCurves` translate it into the same staggered crossfades as scene 5 —
just traversed in reverse, so the consumer un-morphs first, then the inner
tag, then the header (the reverse of scene 5's header → tag → consumer
stagger). There is **no separate un-morph code**: because scene 5 derived the
entire identity change from one `phase` value, reversing the morph is just
running that one value backward. The same `DipSwap`s, the same
`interpolateColors`, the same `EASING.inOut` — read backward.

> *"Why reverse the exact morph instead of writing a fresh closing
> transition?"* Because the reverse morph is what *proves* the thesis. Scene 5
> said "this container can be either"; scene 7 demonstrates the round trip —
> it goes Parallel → Loop along the identical path, so the viewer sees the two
> identities as two ends of **one** continuous axis, not two separate blocks.
> And because it's the same `phase`-driven function, it lands *exactly* on
> scene 1's end state with zero drift — the bookend is pixel-true by
> construction, not by re-authoring. Reusing the move is both the cleaner code
> and the stronger argument.

> *"Why land on Loop (scene 1's state) rather than ending on Parallel?"* So the
> video is **bracketed.** It opened on a Loop; ending on the same Loop closes
> the bracket and says "we're back where we started, but now you know it's one
> of two schedules." Ending on Parallel would leave the asymmetry "we ended on
> the second thing"; returning to the first reframes *both* as
> interchangeable options of one shape — which is precisely the take-home.

## The camera — ease back, don't move during the morph

The camera does two distinct things, and the order matters:

1. **During the morph (`0.8 → 4.2`): the camera holds at identity** (`s`
   stays 1 until `4.6`). The morph is the event; the lens stays still so the
   eye reads the identity change cleanly — the same "move the camera between
   events, not during them" rule the run scenes follow.
2. **After the morph (`4.6 → 6.0`): the camera eases back ~7%** (`s` drops to
   `0.93`). Once the container has settled back to Loop, the frame pulls out
   slightly, giving a touch of air around the now-resting workflow.

> *"Why pull the camera back at the end?"* It's a closing gesture — a gentle
> *exhale*. Pulling out slightly settles the whole workflow into a calm,
> balanced composition and signals "we're done; take it in." It also gives the
> closing narration ("reach for a Loop when order matters; reach for Parallel
> when the items are independent") a quiet, full-frame canvas to play over,
> rather than a tight or busy one. The 7% is small on purpose — enough to feel
> like a settle, not so much that it reads as a new camera move competing with
> the morph that just finished.

> *"Why morph first, then pull back — why not both at once?"* Motion-on-motion
> again. If the camera pulled back *while* the chip and name were
> crossfading, you'd have two transformations fighting for the eye and
> couldn't read either cleanly. Sequencing them — morph completes (`4.2`),
> *then* camera eases (`4.6`) — keeps each gesture legible: first "it becomes
> a Loop again," then "settle and hold."

## Why the bookend works as a recap without recapping

Scene 7 carries no new information — and that's the design. It's a **settle**
archetype: its job is to resolve, not to teach. By reversing the defining move
and returning to the opening frame, it lets the viewer *re-experience* the
core idea (this one container is both schedules) in a single gesture, then
holds still so the narration can state the decision rule. There's no montage
of earlier beats, no caption listing differences — just the container becoming
itself again, which is the most economical possible restatement of
"one shape, two schedules."

## The closing hold

From `~6.0s` to the scene's end, nothing moves: the resting Loop workflow,
pulled back ~7%, balanced and centered on the stage axis. This is the take-
home frame, and like every scene's tail it ends on a **settled, motionless
state** — stretchable to fit the closing narration without freezing a motion
mid-flight (the video's extend-only timing). The last frame of the video is
the first frame's workflow, slightly further away, at rest.

## How to think about the whole scene

1. *How do I end on the thesis?* Reverse the defining move → Parallel morphs
   back to Loop, framing both as one shape.
2. *How do I land it exactly?* Run scene 5's `phase` backward (`1 → 0`) → the
   bookend hits scene 1's end state with zero drift, by construction.
3. *Where's the camera?* Still during the morph, then ease back ~7% after →
   one event at a time; a closing exhale, not a competing move.
4. *How do I recap without a recap?* Let the round trip *be* the restatement;
   hold still for the decision-rule narration.

## Exit state (end of video)

`resting Loop workflow (phase 0) — identical to scene 1's end state · camera
eased back ~7% (s ≈ 0.93) · no rings, no run · balanced, settled hold`. The
video closes on the shape it opened on, now understood as one of two
schedules.
