# Scene 7 — `still-one-workflow`  ·  archetype: **settle / bookend + morph-swap reprise**

Source: `../source/scenes/StillOneWorkflowScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/layout.ts`.

This is the closing scene, and it does one thing: it runs scene 4's morph **in
reverse**, landing the fork back on the exact state scene 1 ended on, then eases
the camera out a touch and holds for the final narration. Read it as the worked
example for "how do I close a video so the last frame *rhymes* with the first —
how do I make a bookend a single reversible move rather than a new animation."

---

## What this scene is for

The video's thesis, stated once more as a picture: *it's still one workflow —
one fork, two interchangeable deciders; reach for the rule when you can write
it, the model when you can't.* Scene 7 makes "still one workflow" literal by
turning the Router back into the Condition with the same move that turned the
Condition into the Router, then settling. The closing image is the opening
image — the two-lane Condition fork — so the video reads as a loop that returns
home rather than a list that stops.

One idea per scene: this is "settle, and return." No run, no decision — just the
reverse morph and a final breath of camera.

## The reverse morph is the same function, played backward

```ts
const phase = interpolate(t, [0.7, 4.0], [1, 0], {easing: EASING.inOut, ...clamp});
```

That's the whole transformation: drive `phase` from **1 back to 0** over
0.7–4.0s. Because every part of the morph in scene 4 was a sub-range of one
monotonic `phase` (see scene 4's annotation), running `phase` downward replays
the entire edit in reverse, automatically and in the right order: Billing's
agent fades, its edge fades (it **fades, never retracts** — `destCMix` drops, so
the lane goes to zero opacity rather than the edge un-drawing backward), the
Context/Model/Billing rows shrink out at their exact slot heights (edges
tracking the rising branch rows the same way they tracked the growing ones), the
header crossfades Router→Condition, the labels dip-swap back, and the three
lanes glide to two.

This is the deepest payoff of the "one set piece, one `phase`" architecture. The
bookend cost almost nothing to build: it is scene 4's `morphCurves` evaluated on
a descending `phase`. There is no second morph to keep in sync with the first —
there is one morph and its reverse, guaranteed identical because they're the
same code.

> *"Why reverse the morph instead of just cutting back to the scene-1
> Condition?"* Because a cut would say "and now, separately, here's the
> Condition again." The reverse morph says "the Router you just watched *is* the
> Condition you started with — watch it turn back." It earns the "still one
> workflow" claim by demonstrating it: same block, reconfigured, reversible. A
> cut asserts the equivalence; the reverse morph proves it.

## The continuity catch: fade, don't retract

```ts
// Billing's edge fades out with its lane (destCMix → 0); progress never runs backward.
```

When the third lane leaves, its edge must **fade** (opacity to zero) rather than
*retract* (draw-progress running 1→0). A retracting edge — a wire visibly
un-drawing itself back into the handle — reads as a glitch, the reverse of a
connection being made. The build's rule is fixed: *edges draw on once and never
retract.* So scene 7 fades Billing's edge with its lane's opacity. The edge that
was drawn in scene 4 stays drawn; it just becomes invisible along with the lane
it served. This is the mirror of scene 4's `edgeCDraw` gate, which guaranteed
the edge never drew into empty space — together they make the third lane's
appearance and disappearance both clean.

## The final camera breath

```ts
const ease = interpolate(t, [3.8, 5.4], [0, 1], {easing: EASING.inOut, ...clamp});
const s = 1 - 0.07 * ease;   // ease OUT ~7%
```

After the morph completes (~4.0s), the camera eases *out* by ~7% over 3.8–5.4s —
a gentle pull-back that gives the settled Condition fork a little air and signals
"we're done looking closely now." It's scaled around the stage center
(`transformOrigin "0 0"` with `tx/ty` chosen to keep center fixed), so it reads
as the frame relaxing rather than the fork shrinking. Then it holds — a settled,
static frame the final narration can play over and stretch to fit.

> *"Why pull back ~7% at the very end?"* Two reasons. Compositionally, it's the
> exhale after a video of lean-ins — the last gesture should release tension,
> not add it. Practically, a scene that ends on a settled, slightly-pulled-back
> static frame can be *extended to any length* to fit the closing voiceover
> without freezing a motion mid-flight. The same property scene 1's hold had:
> end on stillness, and the audio step downstream is painless.

## Why the camera move is raw `interpolate`, not the `Camera` lean

Scenes 2, 3, and 5 used the `Camera` component with `LEAN`. Scene 7 hand-rolls a
small scale around center instead, because it's not a lean *toward* a point —
it's a uniform relaxation of the whole frame. The five-primitive rule is about a
*closed motion vocabulary*, not the wrapper components; a frame-derived
`interpolate` with `EASING.inOut` is squarely inside that vocabulary. Reaching
for `Camera`/`LEAN` here would impose a focal point the closing beat doesn't
want.

## How to think about the whole scene

1. *What's the closing claim?* Still one workflow — one fork, two
   interchangeable deciders.
2. *How do I prove "same workflow"?* Reverse the scene-4 morph: same `phase`,
   driven 1→0. Router turns back into Condition before your eyes.
3. *How do I retire the third lane cleanly?* Fade its edge with the lane —
   never retract a drawn edge.
4. *How do I land on the opening image?* The reverse morph ends exactly where
   scene 1 ended; the video closes on its own first frame.
5. *How do I close the camera?* A gentle ~7% pull-back — the exhale — then a
   settled hold the narration can stretch into.

## Exit state (the video's last frame)

`fork at phase=0 (two-lane Condition template — the scene-1 image) · camera
eased back ~7% · settled, holding`. The video ends where it began, one fork with
the rule-decider in place, having shown you both ways it can pick.
