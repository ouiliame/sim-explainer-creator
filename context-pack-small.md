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
