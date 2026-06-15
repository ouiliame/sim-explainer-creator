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
