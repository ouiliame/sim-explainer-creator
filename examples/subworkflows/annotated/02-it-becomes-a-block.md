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
