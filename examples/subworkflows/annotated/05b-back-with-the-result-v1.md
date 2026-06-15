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
