# Scene 8 — `the-sent-campaign`  ·  archetype: **settle / bookend**

Source: `../source/scenes/TheSentCampaignScene.tsx`, `../source/layout.ts`
(`CAM_OUT`), `../source/scenes/_rig.tsx`, `../source/data.ts`.

This is the bookend. Scene 1 opened on an empty table — the campaign that didn't
exist. Scene 8 closes on the same table, full — a sent campaign. The run wrote its
own record, and the last gesture is a small, calm pull-back that holds the
balanced, finished frame for the outro voiceover. It teaches the **settle**
grammar: how to end on a latched final state that's safe to hold for as long as the
narration runs.

---

## What this scene is for

One idea: **the bookend pays off the open.** Scene 1's empty pane is now a sent
campaign; you run the same workflow again for the next campaign. There's nothing
left to mechanically demonstrate — the run is done. So the scene's only job is to
present the finished state as a settled, balanced frame and let it land. The single
motion is a ~5% camera ease-back, the series' standard "settle" gesture, after
which everything holds.

## What it looks like

The full table from scene 7 sits over the green machine. The camera eases back a
touch (about 5%), widening the frame slightly so the whole set piece — full table,
green chain — sits balanced and centered. Then nothing moves. The status column
keeps its faint green residue (the sent wall). Every block is green. The video ends
on this held, finished frame.

## The real decisions

### Every state is a latched final — nothing is mid-animation

```ts
const FULL = () => 1;
const finalTint = (c) => (c === STATUS_COL ? 0.12 : 0);

<Stage
  rowLand={FULL}                 // every row fully landed
  cellTint={finalTint}           // status residue only
  apollo={{state: "ok"}}
  cont={{state: "ok"}}
  wb={{state: "ok"}}
  fan={0}
  lanes={{2: {enr: {state: "ok"}, pers: {state: "ok"}, send: {state: "ok"}}}}
  itemTag={{resolve: 1}}
  contactTag={{resolve: 1}}
/>
```

Read what's *not* here: no ramps, no pulseWindows, no `t`-dependent expressions
except the camera. `rowLand` is a constant `1`, `cellTint` is the constant final
residue, every block is hard-set `ok`, both tags are hard-set `resolve: 1`. The
scene is a single static composition — a still life of the finished run — plus one
camera move.

> *"Why hard-set everything instead of letting scene 7's final values carry
> over?"* Two reasons. First, robustness: scene 8 is its own composition, and
> hard-setting the final state means it renders correctly at frame 0 regardless of
> what scene 7 did — it doesn't depend on inheriting in-flight values. Second, and
> more importantly, this is what makes the outro **safe to stretch.** The scene
> holds for ~15.7s after the camera settles (the choreography notes flag this as
> far past the dead-motion cap), all of it to fit the outro voiceover. Because
> every value is a latched constant, the scene can be extended to *any* length
> without breaking — there's no animation mid-flight that extending would freeze
> halfway. This is the latched-settle pattern: an end-anchored final state that VO
> retiming can stretch indefinitely, boundary-safe by construction.

### The camera ease-back is tiny on purpose — `CAM_OUT` is 0.59 vs CAM_ALL's 0.62

```ts
const outM = ramp(t, 0.8, 2.4, EASING.inOut);
const cam  = camMix(CAM_ALL, CAM_OUT, outM);
```

The camera interpolates CAM_ALL (s=0.62) → CAM_OUT (s=0.59) over 0.8→2.4s. That's
about a 5% zoom-out — the same `px`/`py` center, just a hair wider.

> *"Why such a small move — why not a dramatic pull-out to end on?"* Because the
> finished table *is* the ending; the camera shouldn't upstage it. A big pull-out
> would turn the close into a flourish about the camera. The ~5% ease-back is a
> breath — it gives the finished frame a tiny bit more air, signals "we're done and
> stepping back to look," and settles. It's the series' fixed settle gesture
> (`CAM_OUT` exists only for this), deliberately understated. The move is also
> `EASING.inOut` (a transform: accelerate from rest, decelerate to rest) and starts
> at 0.8s, not 0.0 — a short beat at the CAM_ALL framing first (continuity with
> scene 7's exit) before the gentle widen.
>
> *"Why start the ease at 0.8 instead of immediately?"* So the cut from scene 7
> lands on the *exact* CAM_ALL framing scene 7 exited on — a beat of identical
> framing — and only then does the camera begin to widen. If it started easing at
> frame 0, there'd be a frame-1 velocity at the boundary, which reads as a tiny
> lurch on the cut. The 0.8s hold-then-ease makes the boundary seamless and the
> widen feel intentional.

### The sent wall persists to the literal last frame

`finalTint` keeps the 0.12 green residue on the status column and zero everywhere
else — identical to the residue scene 7 left. The landed values, the openers, the
`sent` statuses, and that one column of faint green all persist unchanged to the
final frame of the video. This is module-2's thesis made literal: **the table
keeps its new values.** A table that's been written stays written. The video does
not reset to empty; it ends on the campaign the run produced, with the run's own
provenance (the green status column) still faintly visible. The first frame and the
last frame of the video are the same table — once empty, now sent.

## The values, and where they come from

Identical to scene 7's final state — all from `LEADS` in `data.ts`, in
`LANDED_ORDER = [2, 4, 0, 5, 1, 3]`:

| column | final content |
|---|---|
| company | Northwind, Veraxis, Acme Robotics, Drift Labs, Brightwave, Cobalt Health |
| contact | Priya Nair, Lena Voss, Dana Liu, Theo Park, Marcus Reed, Sam Okafor |
| title | CTO, Founder, VP Engineering, Head of Sales, Head of Growth, VP Product |
| signal | the six reach-out reasons |
| message | six distinct two-line openers |
| status | `sent` × 6 (the wall, with 0.12 residue) |

No new values are introduced; scene 8 shows nothing scene 7 didn't already write.
That's the point of a bookend — it presents, it doesn't add.

## The animation, beat by beat

- **Beat of CAM_ALL framing** `0 → 0.8` — identical to scene 7's exit, so the cut
  is seamless.
- **Camera ease-back** `outM = ramp(0.8, 2.4, inOut)`, CAM_ALL (0.62) → CAM_OUT
  (0.59) — the ~5% settle.
- **Hold** `2.4 → 18.1` local (~15.7s) for the outro VO. Latched-settle; zero
  motion.

> *"Fifteen-plus seconds of zero motion — isn't that a problem?"* The choreography
> notes say plainly that it is — it's far past the dead-motion cap, and it's exactly
> the hold class that an ambient layer (a quiet shimmer, a breathing glow) would
> exist to fix. It reads as a *breath* rather than a freeze only because the frame
> is the settled payoff — the thing the viewer wants to rest on. But the honest
> lesson the build's ranking taught is: latched holds are *safe* (they can stretch
> to any VO length without breaking a boundary), but they are not *alive*. If you're
> building a long outro hold and you have any ambient motion in your kit, this is
> where it earns its keep. Without one, keep the hold as short as the VO allows.

## How to think about the whole scene

1. *What's the ending image?* The full table — scene 1's empty pane, now sent →
   the bookend pays off the open.
2. *How do I make it safe to hold for the VO?* Hard-set every value as a latched
   constant → no mid-flight animation, so the hold can stretch to any length.
3. *How big should the closing camera move be?* ~5% (CAM_ALL → CAM_OUT) → a breath,
   not a flourish; the finished table is the star.
4. *Why hold the CAM_ALL framing first?* So the cut from scene 7 is seamless before
   the widen begins.
5. *What survives to the last frame?* The landed values and the status residue →
   the table keeps its new values; the run's provenance stays visible.
6. *What's the build's parting lesson?* Latched holds are safe but not alive — pair
   long outro holds with an ambient layer, or keep them short.

## Exit state (end of video)

The final frame: `full table (all six leads, six distinct openers, six `sent`
statuses) · status-column green residue at 0.12 · whole chain green · camera at
CAM_OUT (0.59×)`. This is the last image of the video — the same table that opened
it, now a sent campaign. For the next campaign, you run the same workflow again.
