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
