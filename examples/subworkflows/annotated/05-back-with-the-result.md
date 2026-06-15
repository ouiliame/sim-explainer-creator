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
