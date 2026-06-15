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
