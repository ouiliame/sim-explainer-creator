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
