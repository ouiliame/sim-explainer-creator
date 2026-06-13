# Scene 9 — `morning`  ·  archetype: **settle / bookend**

Source: `../source/scenes/MorningScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the final scene of the video, and it does almost nothing — on
purpose. It is the bookend: the camera releases a few percent and the
whole set piece, now fully run, just rests. The backlog is cleared —
every status `done`, every PR filed — the chain is green, and the clock
is still armed for the next midnight. Read it as a worked example of the
*settle* archetype: the scene whose entire job is to stop, hold the
payoff, and complete the arc the opening scene started. Every choice
below is one you'll make again when you write your own closing frame.

---

## What this scene is for

The video opened (scene 1) on the **full backlog** — a `backlog` table
of five issues, every `status` reading `open`, every `pr` cell empty,
and a planted question: who works these? Seven scenes answered it (the
fleet assembled, the reference wired it, the clock armed, midnight fired,
the fan split, one engineer ran end-to-end, the wall filled). This scene
closes the loop: the same table, every row now `done`, every PR number
filled, the chain green, the pill still armed. The bookend's job is to
**return to the calm home frame and let the answer land** — to say
"that's the morning after; tomorrow night it runs again" with a held
picture rather than any new motion.

So the rule the scene follows is *one idea per scene*, taken to its
limit: this scene is "the backlog, cleared," full stop. No run, no fan,
no new gesture — everything was already shown. The only thing that
*happens* is the camera easing back a touch, and that's not an event so
much as a release. Resist the urge to add a final flourish here. The
flourish was scene 8 (the wall, the money shot); scene 9's discipline is
to add nothing and trust the settled frame.

## What it looks like

The whole set piece, wide: the `backlog` table on top with all five rows
flipped (`status = done`, the PR column filled `#484 … #483`), a faint
green residue on every written cell. Below, the chain Schedule → Get
Issues → Fleet, all three carrying the green "ok" ring; the container
folded back to its single coding lane (Engineer → GitHub → Mark Done,
all green); the armed pill above Schedule reading
`At 12:00 AM · Next: Mar 19, 12:00 AM`. The camera eases back ~6%, then
holds, dead still, for the length of the narration.

## The one real decision: render the settled end-state, and hold it

The scene renders this and nothing else:

```tsx
const cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

<Stage
  cam={cam}
  fan={0}
  cont={{state: "ok"}}
  sched={{state: "ok"}}
  query={{state: "ok"}}
  pill={{reveal: 1, swap: 1}}
  flipMix={() => 1}
  flipTint={() => 0.35}
  lanes={{2: {eng: {state: "ok"}, gh: {state: "ok"}, md: {state: "ok"}}}}
/>
```

Two things to take from this.

**Every value is a fixed end-state — a "latched final," not an
animation.** Look at what's passed: `flipMix={() => 1}` (a constant
function, every row fully flipped to `done` + PR), `flipTint={() => 0.35}`
(a constant — the provenance residue, the same on every written cell),
`state: "ok"` on all three chain blocks and on all three blocks of the
one mounted lane, `pill: {reveal: 1, swap: 1}` (fully shown, fully
swapped). None of these is a function of the clock. Nothing oscillates,
nothing pulses, nothing is mid-flight. The frame at `t = 3s` is identical
to the frame at `t = 11s`. That property has a name in this build —
*latched-settle* — and it is the whole reason this scene exists in the
shape it does (see "Why latched finals" below).

**It's still the one set piece.** Same `<Stage/>` as every other scene,
same geometry from `layout.ts`. `fan={0}` collapses the container back to
its single coding lane — the four runtime ghosts that fanned out in scene
6 folded away at the end of scene 8 and stay gone — and `lanes={{2: …}}`
mounts only lane 2 (the followed lane) in its settled, all-`ok` state.
You are never building a "final frame" as a special artifact; you're
configuring the same stage into its rest pose.

> *"Why a constant function `() => 1` instead of just a number?"* Because
> the `Stage` prop is typed as `(row: number) => number` — `flipMix` and
> `flipTint` are *per-row* functions everywhere else in the video (in
> scenes 7 and 8 they flip each row on its own clock, in scramble order).
> Here the per-row variation is gone, so the function ignores its argument
> and returns the same value for all five rows. Keeping the function shape
> (rather than special-casing the prop to accept a scalar) means the
> settled scene reads the rig through the exact same door as the animated
> ones — no branch, no second code path, no chance of the final frame
> drifting from what scene 8 latched.

> *"Why mount only lane 2 and not all five?"* Because `fan = 0` is the
> single-lane canvas state — the container holds one drawn coding lane,
> and the parallel's five concurrent instances were a *runtime* fan that
> existed only between scene 6's fan-out and scene 8's fold (the
> continuity contract pins `fan = 1` at every boundary inside that span,
> `fan = 0` outside it). By morning the run is over; the canvas shows what
> it always shows at rest — one lane, the editable template. The five
> engineers' *work* didn't vanish; it's recorded in the table's five
> flipped rows. That's the whole thesis stated as a layout fact: **the
> table is the record, the canvas is just the recipe.**

## The camera — the only thing that moves

```ts
cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

CAM_ALL = { px: 1395, py: 740, s: 0.7   };  // the home framing
CAM_OUT = { px: 1395, py: 740, s: 0.655 };  // the ease-back target
```

The camera interpolates from `CAM_ALL` to `CAM_OUT` over **0.8s → 2.4s**,
eased `inOut`, then sits at `CAM_OUT` forever. Note `px` and `py` are
identical in both framings (1395, 740) — the camera doesn't *pan*, it
only changes `s`, from `0.7` to `0.655`. That's a scale ratio of
`0.655 / 0.7 ≈ 0.936` — the content shrinks to ~94% of its home size, a
**~6% pull-back**.

> *"Why is `px` 1395 and not the stage center 1410?"* `CAM_ALL` (and so
> `CAM_OUT`) frames the whole set piece — table on top, chain below —
> centered on the *content*, not the geometric center of the 2820-wide
> stage. 1395 is the home framing the video lives in (scenes 2, 4, 5, 8
> all sit here); the bookend inherits it exactly so the cut from scene 8
> is seamless. You don't recompute the framing for the close; you reuse
> the home one and only ease its scale.

> *"Why 6% — why not a bigger, more obvious pull-back?"* Because this is a
> *release*, not a move. The video's real camera moves (scene 2's
> table-glide as the chain assembles, scene 6's push onto the container,
> scene 7's three-framing lane lean-and-return) all change framing
> meaningfully to take you somewhere. This one goes nowhere — it just
> exhales. Six percent is below the threshold where the eye reads "the
> camera is traveling" and above the threshold where it reads as nothing
> at all. You feel the frame *settle back* the way a held breath releases,
> without it announcing itself as a shot. Make it 15% and it becomes a
> deliberate dolly-out that begs for a reason; make it 1% and it's
> invisible jitter. 6% is the "we're done" gesture.

> *"Why ease back at all instead of just holding `CAM_ALL`?"* Because a
> hard arrival into a static hold reads as a *cut to a freeze* — the
> motion stops on a dime and the scene feels like it stalled. The gentle
> ease-back signals **closure**: it's the visual equivalent of a sentence
> trailing into a period rather than stopping mid-word. A bookend should
> feel like the camera is *letting go* of the set piece, stepping back to
> take it all in one last time. The ease-out is that letting-go, made
> literal. It also re-establishes the wide read after scene 8's busy
> wall — pulling back a hair gives the completed board air.

> *"Why `EASING.inOut` and not `out`?"* Because the move both starts and
> ends from rest. `EASING.out` (fast start, slow finish) is for entrances
> — something arriving from offscreen. This camera is already at rest at
> `t=0` (it inherits scene 8's `CAM_ALL`) and comes to rest again at
> `CAM_OUT`; `inOut` (slow-fast-slow) eases out of the first rest and into
> the second, so there's no velocity discontinuity at either end. It's the
> same curve every camera *move* in the video uses — the convention for
> "a transform settling between two framings." Mixing in `out` here would
> make the close move with a different signature than every prior move and
> read as a different *kind* of motion.

> *"Why start at 0.8s instead of 0.0?"* So the cut from scene 8 lands on a
> still frame before the camera releases. Scene 8 ends on its own settled
> hold (the wall complete, the chain just gone green in causal order); if
> scene 9 started easing back on frame 0, the two scenes' boundary would
> have the camera already in motion, and the freeze-to-release would blur.
> Holding ~0.8s of `CAM_ALL` first means the boundary is identical
> (exit == enter, both at `CAM_ALL`), *then* the release begins — a clean
> beat of stillness, then the exhale. (Scene 2's pull-out uses the same
> `[0.8, 2.4]`-window shape for its camera; the bookend mirrors the open's
> pacing on purpose.)

## The values, and why every row is flipped — and stays tinted

Everything on the board traces to `data.ts`. Here is the full, cleared
backlog — every cell now written:

| issue | status | pr |
|---|---|---|
| OAuth redirect loop | done | #484 |
| Webhook null user | done | #486 |
| CSV export crash | done | #482 |
| Search debounce | done | #485 |
| S3 upload retries | done | #483 |

The values are not invented for this frame — they're the same authored
content the run produced over scenes 5–8, now all present because
`flipMix` is `1` everywhere. The `backlogRows` builder switches each
row's text at `mix ≥ 0.5`: below that the status reads `STATUS_BEFORE`
(`open`) and the PR cell is empty; at or above it the status reads
`STATUS_AFTER` (`done`) and the PR cell fills the row's authored number.
With `flipMix = () => 1`, all five rows are past the switch, so the whole
column is `done` and every PR is filled.

> *"Why are the PR numbers out of order down the column (#484, #486,
> #482, #485, #483)?"* Because they're assigned in *finish* order, not
> table order. `data.ts` documents this: "PR numbers are assigned in
> FINISH order (3, 5, 1, 4, 2 — parallel result order isn't guaranteed;
> docs)." A parallel container makes no promise about which instance
> completes first, so the engineer that happened to finish first got the
> lowest open PR number, and those numbers land in rows by whatever order
> the work resolved — which scene 8 dramatized as the scramble finish
> `[4, 0, 3, 1]`. The scrambled column is therefore *verifiable*: it's the
> drawn consequence of "result order not guaranteed," the docs' own
> sentence made into data. Leaving it sorted would quietly lie about how a
> parallel behaves. (The followed lane, row index 2 / `CSV export crash`,
> finished first in scene 7 and took `#482`, the lowest — consistent with
> `CURRENT_ITEM_VALUE = "[row 3]"`, the 1-based label for that
> zero-indexed row.)

Now the tint, which is the scene's one piece of carried-over visual
argument:

```tsx
flipTint={() => 0.35}   // every written cell — the provenance residue
```

Every written cell carries a faint green residue at `0.35`. In the rig
this becomes a `rgba(51,196,130, 0.22 * 0.35)` rectangle — roughly an 8%
green wash — laid over the two-column-wide `status`/`pr` block of each
row (`width: 2 * COL_W`). That color, `rgb(51,196,130)`, is the product
table's own output-tint; the wash is the same one that pulsed to full
strength when each row flipped during the run (scenes 7–8) and then
decayed — but it decayed to `0.35`, not to `0`, and that floor persists
to the final frame.

> *"Why does the residue stay at all, instead of fading to nothing?"*
> Because the green tint is *provenance*: it's the mark that says "the
> fleet wrote this." When a cell fills during the run, the tint pulses to
> `1` and then decays to `0.35`. A board with zero tint would look like a
> backlog someone closed out by hand; the `0.35` residue keeps the whole
> filled region quietly readable as *output* — five rows the fleet
> produced overnight, not five rows a person typed. The choreography names
> this directly: "the accumulating residue IS the wall of green." By the
> bookend the wall is complete and held at its residue floor.

> *"Why doesn't the bookend brighten any rows — no `signalTint`, no flag
> cells?"* Because this video's payoff is *uniform*, not selective. Every
> issue in the backlog got worked; there is no "these two matter more"
> hierarchy to build. (Contrast a desk that flags a *subset* of markets to
> watch — there the bookend holds two cells bright and the rest at
> residue, because the takeaway is *which* ones. Here the takeaway is
> *all* of them: the queue is empty.) So the rig's per-row tint function
> is a flat constant and the board reads as one even field of green
> residue — a wall, not a highlight. The right hierarchy for "the backlog
> is cleared" is no hierarchy at all; every row equal, every row done.

## The pill and the chain — armed, green, latched

```tsx
sched={{state: "ok"}}  query={{state: "ok"}}  cont={{state: "ok"}}
lanes={{2: {eng: {state: "ok"}, gh: {state: "ok"}, md: {state: "ok"}}}}
pill={{reveal: 1, swap: 1}}
```

All three chain blocks (Schedule, Get Issues, Fleet) and all three blocks
of the mounted lane carry the green `ok` ring — in the rig, `state: "ok"`
→ a `#22c55e` inset ring (`boxShadow: inset 0 0 0 ~2.6px #22c55e`). The
pill is fully revealed (`reveal: 1`) and fully swapped (`swap: 1`):
`swap: 1` drives the `DipSwap` in `SchedulePill` all the way to its `b`
value, so the caption reads `Next: Mar 19, 12:00 AM` (`NEXT_AFTER`), not
the `Mar 18` (`NEXT_BEFORE`) it showed before the run fired in scene 5.

> *"Why does the pill still say Mar 19 and not advance again?"* Because the
> fleet fired *once* in this video (the single scheduled run, scenes 5–8).
> That run fired at Mar 18 midnight and instantly re-armed for Mar 19
> (scene 5's date dip-swap — the self-fire micro-beat). The video ends the
> morning after that run, before Mar 19 midnight arrives, so the
> armed-for-tonight state is exactly the truth: the clock is loaded,
> waiting. That's the bookend's closing line — *tomorrow night it runs
> again* — stated as a UI fact, not a caption. Advancing the pill to Mar 20
> here would imply a second run the viewer never saw; leaving it at Mar 19
> keeps the frame honest about what happened. (Run economy is **1** for
> this whole video; the pill's date is the on-screen ledger of that count.)

> *"Why are all the rings green and not the blue 'live' rings from the
> run?"* Blue (the `secondary` ring) means *running now*; green (`ok`)
> means *finished clean*. The run is over — every block did its job and
> settled. Green across the whole chain *and* the surviving lane is the
> "all systems nominal, work complete" read. It's the same causal-order
> green settle scene 8 ended on (Schedule → Get Issues → Fleet), now
> simply held.

## Why latched finals — the scene's structural reason for existing

This is the deepest thing to learn from a settle scene, so it gets its own
section. *Latched finals* means: every state in the scene is a fixed
end-value with no time dependence — no `t` inside `flipMix`, `flipTint`,
or any `state`. The only `t` in the entire scene is in the camera's
`ramp(t, 0.8, 2.4)`, which itself clamps to a constant after 2.4s. So from
2.4s onward, the scene is a genuinely static image.

Why does that matter? **Because narration is written and recorded *after*
the visuals lock, and the scene has to stretch to fit it.** When the
voiceover for this beat comes in, it might run 4 seconds or 11; the scene
has to be able to hold for however long the words take. (It does: the
manifest stretched this scene to ~11.1s.) A scene whose final state is
*static* can be extended to any length safely — you're just holding a
still frame longer, and nothing is mid-animation to freeze awkwardly. If
instead this scene ended on something still moving (a tint oscillating, a
ring blinking), you couldn't extend it without catching that motion at a
random phase. Latched finals make the audio step downstream *painless*:
every boundary in this build stayed pixel-identical through the vo-sync
precisely because every hold is extend-only by construction.

> *"Is this the same as scene 1's 'ends on a settled hold' rule?"* Yes —
> it's the same property, and it's not a coincidence that the *first* and
> *last* scenes both have it. Both are the scenes most likely to get
> stretched to fit narration (the open invites the viewer in; the close
> lets the thesis land — the manifest stretched scene 1 to ~10.9s and
> scene 9 to ~11.1s, the two longest holds in the video), and both earn
> the right to be static because the frame itself is the payload. The rule
> generalizes: any scene that ends on a hold should end on a *latched*
> hold, so the hold is a value, not a paused motion.

## The honest weakness of a bookend — name it

A bookend has a real, frank tension, and you should understand it rather
than pretend it away: **a long static hold risks being dead air.** This
scene holds dead still from ~2.4s to ~11.1s — roughly *eight and a half
seconds* of an unchanging frame, the longest hold in the video. That is,
by any honest accounting, a long time to show a picture that isn't moving.
The choreography notes say so plainly: the hold is "earned as the settled
thesis-image, but ambient-dead — nothing ticks."

So why does the scene carry it? Two reasons, and it's worth being precise
about both:

1. **The frame is the payoff.** This isn't a transition holding for a beat
   — it's the *resolved thesis* of the whole video. The backlog from
   scene 1 (five `open` rows, no PRs) is now five `done` rows with five
   filled PR numbers; the question is answered; the residue wall glows.
   A viewer's eye genuinely wants a moment to read the cleared board (five
   flipped rows with scrambled PR numbers is real information — it even
   rewards a second look, since the out-of-order PRs *are* the "parallel"
   point), and the narration plays over exactly this hold to deliver the
   closing line. The stillness is the space for the idea to land. That's
   different in kind from a hold with nothing to look at.

2. **The video earned its ranking on the *middle*, not on this hold.** This
   build was the batch's BEST EXPLANATION for being visually diverse and
   dynamic — the one run seen at three scales (the midnight fire, the fan,
   one engineer, the wall), each a different beat shape. A bookend doesn't
   need to be dynamic; it needs to be *calm*, because calm is the correct
   register for "we're done, it's morning." The diversity already happened.
   The bookend's contribution is the opposite: a place to rest after it.

That said — don't launder the weakness into a virtue. It *is* a long hold,
and the honest improvement (named in the notes) is "a slow residue
shimmer" — a low-amplitude ambient pattern that keeps the frame alive
without breaking the latched-final property: something that animates but
always returns to the same end-state, so the hold stays extend-safe. The
taste lesson is: ship the calm bookend, but know that "calm" and "dead"
sit a hair apart, and the line between them is whether the frame is worth
eight-plus seconds of looking. Here it is — because it's the payoff, the
cleared backlog the whole video was building toward. On a weaker frame it
wouldn't be.

## How to think about the whole scene

Walk the decisions in order and you can see the bookend's logic:

1. *What state do I show?* The exact settled end-state scene 8 latched —
   read through the same `<Stage/>`, every value a fixed final, the
   container folded to its single canvas lane.
2. *What's allowed to move?* Only the camera, and only as a *release* — a
   ~6% ease-back (`s 0.7 → 0.655`) that says "done," not a move that goes
   somewhere.
3. *How do I keep the answer legible?* Residue everywhere (provenance, the
   fleet's authorship), no selective highlight — because "the backlog is
   cleared" is a *uniform* claim, every row equal.
4. *How do I close the arc?* Return to the wide home frame the video lives
   in, the same table from scene 1 now full — five `open` rows answered in
   place as five `done` rows with PRs.
5. *How do I survive narration?* Latched finals → a static hold that
   stretches to any length without freezing a motion mid-flight.
6. *What's the honest cost?* A long dead hold (~8.5s) — carried by the
   fact that the frame is the payoff, not by any motion.

There's no clever move in this scene, and there shouldn't be. The craft of
a bookend is *subtraction*: showing the resolved state and trusting it,
adding only the gentlest release so the ending feels like a release. The
quality is in the restraint and in the continuity — that the last frame is
provably the same set piece as the first.

## Exit state (this is the final frame of the video)

`every row flipped (flipMix=1 → status done, PR filled in scramble order
#484/#486/#482/#485/#483) · green residue everywhere (flipTint=0.35) ·
chain green (Schedule/Get Issues/Fleet ok) · the surviving lane green
(Engineer/GitHub/Mark Done ok) · container folded to one lane (fan=0) ·
pill armed at Mar 19, 12:00 AM · camera at CAM_OUT (s 0.655, ~6% back)`.

Nothing inherits this — it's where the video ends. But it is, by
construction, the answer to scene 1's frame: the same `backlog` table, the
same wide home camera, now with the five `open` rows closed to `done` and
their PRs filled, and the fleet that did it resting beneath, armed for the
next midnight. The arc is closed because the last frame and the first are
the same object — the backlog — seen at the two ends of one night's work.
