# Scene 7 — `morning`  ·  archetype: **settle / bookend (the final frame)**

Source: `../source/scenes/MorningScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`, `../source/scenes/_beats.ts`,
`../source/scenes/PhaseAStills.tsx` (the final-frame still).

This is the last scene, and like the first it does exactly one thing — but the
inverse. Scene 1 opened on the problem (a queue on fire); scene 7 closes on the
resolution (every incident assigned, the whole night written down). Read it as the
worked example for "how do I end an explainer — what the final frame should *be*,
and why the closing gesture is a small step back rather than anything new."

---

## What this scene is for

The video has shown the machine, followed one run in full, and drained the queue.
Scene 7's only job is to let the *finished state* land — to hold on the resolution
long enough that the viewer feels the night is over. By morning: every status cell
reads `assigned`, the chain is green in causal order, the record is full. There is
nothing left to do, and the scene shows exactly that: nothing happening, on a frame
where everything is done.

So the rule is *one idea per scene*: "by morning, everything has an owner, a
ticket, and a written record." It introduces no new element, runs no new run, flips
no new row. It is the settled sum of everything before it, viewed from a half-step
back. The temptation in a closer is to add a flourish — a final pulse, a logo, a
recap montage. Resist it. The closer's power is that it's *still*: the work is done,
so the frame is at rest.

## What it looks like

The frame inherited from scene 6 — the full machine all-green, the record complete,
all six rows `assigned` with their faint green residues — holds. The camera eases
back ~4% (a small step away from the machine) over a couple of seconds, then holds
completely still on the final frame for the rest of the scene (and the closing
narration).

## The one set piece — the settled state, asserted

The scene renders the same `<Stage/>` at its terminal state:

```tsx
<Stage
  cam={cam}
  webhook={{state: "ok"}}
  agent={{state: "ok"}}
  terms={[{state: "ok"}, {state: "ok"}, {state: "ok"}]}
  statusAt={() => "assigned"}
  statusTint={() => TINT_RESIDUE}
  recordIn={1}
  logReveals={[1, 1, 1, 1, 1]}
  logSelected={1}
/>
```

Every prop is a *constant* — there's not a single `ramp` or `pulse` driving any
block, table, or record value. The whole machine is green (`state: "ok"`), every
status cell is `assigned` (`statusAt={() => "assigned"}`), every cell carries the
residue tint (`statusTint={() => TINT_RESIDUE}` = 0.35), the record is full
(`logReveals={[1,1,1,1,1]}`), Triage selected.

> *"Why assert the whole settled state with literal constants instead of carrying
> it from scene 6?"* Because scene 6's final frame *is* this state, but scene 6
> arrived at it through five running flip functions clamped at their final values.
> Scene 7 doesn't run anything — it just *declares* the resting state directly:
> `assigned`, residue, ok, full. The values are identical to scene 6's exit (which
> is what makes the 6→7 boundary pixel-identical), but expressed as plain constants
> because there's nothing left to animate. This is the cleanest possible final
> frame: every value is a constant, so the frame can hold indefinitely with zero
> risk of a mid-flight animation freezing.

> *"Why does this match the PhaseAStills `FinalSetPieceStill` exactly?"* Because the
> final frame was locked as a Phase-A still before any motion existed — a coherent
> target state the whole choreography aims at. `FinalSetPieceStill` is the same
> constants (all ok, all assigned, residue 0.35, record full, Triage selected). The
> last frame of the animated build *is* the approved still. Locking the endpoint as
> a static frame first, then animating *toward* it, is how you guarantee the video
> lands where it's supposed to.

## The values, and where they come from

No new values. Everything is the terminal state of values already established:

| Surface | Value | From |
|---|---|---|
| All blocks | green ok rings | the run completed (scenes 5–6) |
| All six status cells | `assigned` | run 1 (row 3) + cadence (rows 1,2,4,5,6) |
| All six cells | green residue tint 0.35 | `TINT_RESIDUE`, the flip residue persisted |
| Record | full (5 log rows, complete tree) | run 1's settled record |
| Messages tag | `<sentryalerts.message>` (template) | reverted in scene 5 |

> *"Why does the record still show run 1's record and not 'the last run'?"* Same
> reason as scene 6: a run record is per-run. By morning, the inspector is still
> showing the one run we followed — run 1, `HTTP 500 /payments` — with its complete
> log and tree. The narration's closing line ("the log shows exactly what happened
> overnight, run by run") refers to the fact that *each* run was recorded; the panel
> on screen is the representative one we watched. The record doesn't morph into a
> summary; it stays the honest per-run artifact.

> *"Why does the Messages tag show the template `<sentryalerts.message>` rather than
> the last alert's value?"* Because the run is over and the workflow is idle —
> references revert to their templates between runs (scene 5's revert). An idle
> deployed workflow shows its config templates, not the last run's resolved values.
> Showing a resolved value here would imply a run is still in flight, which would
> contradict the whole "it's morning, the night is done" close.

## The animation, beat by beat

There is exactly one animation in the entire scene: the camera ease-back.

### (a) The ease-back — `cam = camLerp(CAM_ALL, CAM_OUT, ramp(t, 2.0, 4.4, 0, 1, EASING.inOut))`

The camera eases from `CAM_ALL` (0.665×) to `CAM_OUT` (0.638×) over **2.0 → 4.4s**,
`inOut`. That's a ~4% zoom-out — a small step back from the machine.

> *"Why such a tiny move — only 4%?"* Because it's a *gesture*, not a transition.
> The series' bookend move is "step away from the machine" — a slight pull-back
> that says "we're done here, let's take it in from a half-step back." A big zoom-
> out would feel like leaving; a 4% pull is just enough to register as a settling
> exhale without disrupting the frame you want the viewer to rest on. It's the
> visual equivalent of leaning back in your chair after finishing something. The
> whole machine and table stay comfortably in frame the entire time; the move only
> adds a sliver of breathing room around the edges.

> *"Why start the ease at 2.0, not at frame 0?"* Because the scene first holds a
> beat on the inherited frame — the 6→7 boundary lands on the exact drained-queue
> state, and the viewer needs a moment to register "we've arrived" before the
> camera breathes back. Easing from frame 0 would put a moving camera on the very
> first frame, fighting the continuity (scene 6's exit is static). Hold, *then*
> step back.

> *"Why `EASING.inOut`?"* Same rule as every camera move in the build: the lens is
> a transform travelling through space, so it gets the accelerate-then-decelerate
> curve. It eases out of `CAM_ALL` softly and settles into `CAM_OUT` with no hard
> stop. Linear would feel mechanical on a camera; `inOut` feels like a held breath.

### (b) The hold — from 4.4s to the end of the scene (15s)

After the camera settles at 4.4s, nothing moves at all for ~10.6s. The final frame
— all-green chain, full record, six `assigned` rows with their green residue —
holds while the closing narration plays.

> *"Ten and a half seconds of dead-still frame — is that okay for a closer?"* For a
> *final* frame, mostly yes — it's the sanctioned final-frame breath. A closer is
> *supposed* to rest: the work is done, and a long, still, settled frame is the
> visual "…and that's the night." Unlike scenes 1, 2, and 4 — where the pooled hold
> was a pacing *mistake* (slack that should have been spread across the beats) —
> here the stillness is the *content*. The frame says "complete," and complete
> things are still. That said, the choreography honestly notes the 10.6s length: if
> the closing narration were shorter, you'd want to trim the scene rather than sit
> on dead frame, and even at 15s the ease-back could start later to keep some gentle
> motion alive deeper into the hold. But a generous final hold on a *resolved* frame
> is a legitimate ending, where the same hold mid-video would be a flaw.

> *"Why is a final still frame safe to hold for any length when scene 1's wasn't?"*
> Because every value in this scene is a *constant*, not a clamped animation. There's
> nothing mid-flight to freeze — no count-up, no decaying tint, no latched ring
> doing work. The frame is genuinely *at rest*, so it can hold for any duration the
> narration needs without ever looking like a paused video. (Scene 1's hold was on a
> table that had *finished* assembling but whose narration kept going — the slack
> pooled because the beats ended early. Here the beats are *meant* to have ended:
> the video is over.)

## How to think about the whole scene

1. *What should the final frame be?* The settled sum of everything — all green, all
   `assigned`, record full → the resolution, asserted as constants.
2. *How do I match the locked endpoint?* Render exactly the Phase-A
   `FinalSetPieceStill` constants → the video lands on its approved final frame.
3. *What's the closing gesture?* A ~4% ease-back (`CAM_ALL → CAM_OUT`), the series'
   "step away from the machine" → a settling exhale, not a transition.
4. *When does it move?* Hold a beat first (the 6→7 boundary lands), ease back over
   2.0–4.4, then hold → the move is a breath, not the opening of the scene.
5. *How does it end?* On a dead-still, all-constant frame → legitimately holdable for
   any length, because nothing is mid-flight; the work is done, so the frame rests.

The whole scene is one small camera move over a frame of constants. That restraint
*is* the close: after a video full of motion — assembling, running, reading,
creating, draining — the ending earns its stillness by being the one place where
everything has stopped because everything is finished.

## Exit state (the final frame of the video)

`camera at CAM_OUT (0.638×, the ~4% step-back) · chain all-green · all six status
cells `assigned` with residue tint 0.35 · record full at run 1's settled state,
Triage selected · Messages tag at template`. This is the last frame the viewer sees:
the drained queue, the green machine, the written record — the night, resolved and
recorded, viewed from a half-step back.
