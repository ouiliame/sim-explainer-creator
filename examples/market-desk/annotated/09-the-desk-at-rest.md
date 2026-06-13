# Scene 9 — `the-desk-at-rest`  ·  archetype: **settle / bookend**

Source: `../source/scenes/DeskAtRestScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the final scene of the video, and it does almost nothing — on
purpose. It is the bookend: the camera releases a few percent and the
whole desk, now fully priced, just rests. Read it as a worked example of
the *settle* archetype — the scene whose entire job is to stop, hold the
payoff, and complete the arc the opening scene started. Every choice
below is one you'll make again when you write your own closing frame.

---

## What this scene is for

The video opened (scene 1) on the **empty board** — a watchlist with
three blank columns and a planted question: who fills those in? Eight
scenes answered it. This scene closes the loop: the same board, every
column now written, two markets flagged, the chain green, the clock still
armed for the next hour. The bookend's job is to **return to the calm
wide frame and let the answer land** — to say "that's the desk; an hour
from now it does it again" with a held picture rather than any new motion.

So the rule the scene follows is *one idea per scene*, taken to its
limit: this scene is "the desk at rest," full stop. No run, no fan, no
new gesture — everything was already shown. The only thing that *happens*
is the camera easing back a touch, and that's not an event so much as a
release. Resist the urge to add a final flourish here. The flourish was
scene 8 (the money shot); scene 9's discipline is to add nothing and
trust the settled frame.

## What it looks like

The whole set piece, wide: the `markets` table on top with all five rows
priced (`agent_est`, `edge`, `signal` filled), a faint green residue on
every written cell, and two of the `signal` cells — rows 0 and 3 —
burning brighter than the rest. Below, the chain Schedule → Polymarket →
Desk, all three with the green "ok" ring; the container folded back to a
single lane; the armed pill above Schedule reading `Every hour · Next:
Jun 12, 4:00 PM`. The camera eases back ~6%, then holds, dead still, for
the length of the narration.

## The one real decision: render the settled end-state, and hold it

The scene renders this and nothing else:

```tsx
const cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

<Stage
  cam={cam}
  fan={0}
  sched={{state: "ok"}}
  poly={{state: "ok"}}
  cont={{state: "ok"}}
  pill={{reveal: 1, swap: 1}}
  fillMix={() => 1}
  fillTint={() => 0.35}
  signalTint={(r) => (r === 0 || r === FOLLOWED_ROW ? 1 : 0)}
  lanes={{2: {}}}
/>
```

Two things to take from this.

**Every value is a fixed end-state — a "latched final," not an
animation.** Look at what's passed: `fillMix={() => 1}` (a constant
function, every row fully filled), `fillTint={() => 0.35}` (a constant —
the provenance residue, the same on every written cell), `signalTint`
that returns `1` or `0` per row with no `t` in it at all, `state: "ok"`
on all three chain pieces. None of these is a function of the clock.
Nothing oscillates, nothing pulses, nothing is mid-flight. The frame at
`t = 3s` is identical to the frame at `t = 13s`. That property has a name
in this build — *latched-settle* — and it is the whole reason this scene
exists in the shape it does (see "Why latched finals" below).

**It's still the one set piece.** Same `<Stage/>` as every other scene,
same geometry from `layout.ts`. `fan={0}` collapses the container back to
its single canvas lane — the four runtime ghosts folded away at the end
of scene 8 and stay gone — and `lanes={{2: {}}}` mounts that one lane in
its default (settled, no rings, no tag glow) state. You are never
building a "final frame" as a special artifact; you're configuring the
same stage into its rest pose.

> *"Why a constant function `() => 1` instead of just a number?"* Because
> the `Stage` prop is typed as `(row: number) => number` — `fillMix`,
> `fillTint`, and `signalTint` are *per-row* functions everywhere else in
> the video (in scene 7 and 8 they ramp each row on its own clock). Here
> the per-row variation is gone, so the function ignores its argument and
> returns the same value for all five rows. Keeping the function shape
> (rather than special-casing the prop to accept a scalar) means the
> settled scene reads the rig through the exact same door as the animated
> ones — no branch, no second code path, no chance of the final frame
> drifting from what scene 8 latched.

## The camera — the only thing that moves

```ts
cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

CAM_ALL = { px: 1200, py: 735, s: 0.78  };  // the home framing
CAM_OUT = { px: 1200, py: 735, s: 0.735 };  // the ease-back target
```

The camera interpolates from `CAM_ALL` to `CAM_OUT` over **0.8s → 2.4s**,
eased `inOut`, then sits at `CAM_OUT` forever. Note `px` and `py` are
identical in both framings (1200, 735) — the camera doesn't *pan*, it
only changes `s`, from `0.78` to `0.735`. That's a scale ratio of
`0.735 / 0.78 ≈ 0.942` — the content shrinks to ~94% of its home size, a
**~6% pull-back**.

> *"Why 6% — why not a bigger, more obvious pull-back?"* Because this is a
> *release*, not a move. The video's real camera moves (scene 2's
> table-glide, scene 6's lean onto the container, scene 7's three-stop
> lane move) all change framing meaningfully to take you somewhere. This
> one goes nowhere — it just exhales. Six percent is below the threshold
> where the eye reads "the camera is traveling" and above the threshold
> where it reads as nothing at all. You feel the frame *settle back* the
> way a held breath releases, without it announcing itself as a shot.
> Make it 15% and it becomes a deliberate dolly-out that begs for a
> reason; make it 1% and it's invisible jitter. 6% is the "we're done"
> gesture.

> *"Why ease back at all instead of just holding `CAM_ALL`?"* Because a
> hard arrival into a static hold reads as a *cut to a freeze* — the
> motion stops on a dime and the scene feels like it stalled. The gentle
> ease-back signals **closure**: it's the visual equivalent of a sentence
> trailing into a period rather than stopping mid-word. A bookend should
> feel like the camera is *letting go* of the desk, stepping back to take
> it all in one last time. The ease-out is that letting-go, made literal.

> *"Why `EASING.inOut` and not `out`?"* Because the move both starts and
> ends from rest. `EASING.out` (fast start, slow finish) is for entrances
> — something arriving from offscreen. This camera is already at rest at
> `t=0` (it inherits scene 8's `CAM_ALL`) and comes to rest again at
> `CAM_OUT`; `inOut` (slow-fast-slow) eases out of the first rest and into
> the second, so there's no velocity discontinuity at either end. It's
> the same curve every camera *move* in the video uses — the convention
> for "a transform settling between two framings."

> *"Why start at 0.8s instead of 0.0?"* So the cut from scene 8 lands on a
> still frame before the camera releases. Scene 8 ends on its own settled
> hold (the chain just went green); if scene 9 started easing back on
> frame 0, the two scenes' boundary would have the camera already in
> motion, and the freeze-to-release would blur. Holding ~0.8s of `CAM_ALL`
> first means the boundary is identical (exit == enter, both at
> `CAM_ALL`), *then* the release begins — a clean beat of stillness, then
> the exhale.

## The values, and why two flags stay bright while everything else decayed

Everything on the board traces to `data.ts`. Here is the full, settled
board — every cell now written:

| market | odds | agent_est | edge | signal |
|---|---|---|---|---|
| Fed cut by June | 0.32 | 0.45 | 0.13 | **watch** |
| ETH $5k in 2026 | 0.41 | 0.38 | -0.03 | — |
| Avatar 3 tops $2B | 0.12 | 0.11 | -0.01 | — |
| GPT-6 ships in 2026 | 0.55 | 0.71 | 0.16 | **watch** |
| La Niña by winter | 0.64 | 0.60 | -0.04 | — |

The numbers are not invented for this frame — they're the same authored
values the run produced over scenes 5–8, now all present because
`fillMix` is 1 everywhere. `edge = agent_est − odds` (arithmetic, e.g.
`0.45 − 0.32 = 0.13`), and `signal` is `watch` exactly when
`|edge| ≥ 0.08` (rows 0 and 3, edges `0.13` and `0.16`); the other three
fall short and read `—`. This is the honesty line made visible: the desk
flags *watch*, never *buy*.

Now the tint hierarchy, which is the scene's one piece of real visual
argument:

```tsx
fillTint={() => 0.35}                                       // every written cell
signalTint={(r) => (r === 0 || r === FOLLOWED_ROW ? 1 : 0)} // FOLLOWED_ROW = 3
```

Every written cell carries a faint green residue at `0.35` — in the rig
this becomes `rgba(51,196,130, 0.22 * 0.35)`, roughly an 8% green wash
across the `agent_est`/`edge`/`signal` block. But the `signal` cells of
rows 0 and 3 get an *additional* `signalTint` of `1.0` — full strength,
`rgba(51,196,130, 0.3 * 1)` — so those two cells glow markedly brighter
than the residue around them.

> *"Why does the residue stay at all, instead of fading to nothing?"*
> Because the green tint is *provenance*: it's the mark that says "the
> desk wrote this." When a cell fills during the run (scenes 7–8), the
> tint pulses to full and then decays — but it decays to `0.35`, not to
> `0`, and that floor persists to the final frame. A board with zero tint
> would look like a board someone typed by hand; the `0.35` residue keeps
> the whole filled region quietly readable as *output*. It's the
> difference between "here are some numbers" and "here is what the desk
> produced."

> *"Why do the two `watch` cells keep full color while everything else is
> residue?"* Because the residue is *history* and the signal is the
> *lasting takeaway*. Everything the desk computed is true and worth a
> faint mark — but the only thing a person scanning this board needs to
> act on is *which markets are mispriced*. By holding those two cells at
> `1.0` while the rest sits at `0.35`, the frame builds a hierarchy with
> no words: the bright cells are the answer, the dim wash is the work.
> This is also why the flag reads as **color, not a word** — you don't
> parse "watch", you *see* two cells lit. (The text says `watch` too, but
> the eye gets the message from the glow first.) Letting the signal decay
> to the same residue as everything else would flatten the board into an
> undifferentiated grid and throw away the whole point of the video.

> *"Why `r === 0 || r === FOLLOWED_ROW` instead of listing both row
> numbers?"* `FOLLOWED_ROW` is `3` — it's the row the on-canvas lane
> priced in scene 7, named once in `data.ts` so the lane geometry and the
> signal logic can't drift apart. Writing `r === 3` here would work but
> would be a second, silent copy of that fact; reading it from the
> constant means if the followed market ever changes, this scene follows
> automatically. Row 0 (the Fed market) is the *other* flag, the one
> scene 8 lit during the scramble — it's a literal `0` because it isn't
> tied to the followed-lane concept, just to "the board's other mispriced
> row."

## The pill and the chain — armed, green, latched

```tsx
sched={{state: "ok"}}  poly={{state: "ok"}}  cont={{state: "ok"}}
pill={{reveal: 1, swap: 1}}
```

All three chain blocks carry the green `ok` ring (in the rig,
`state: "ok"` → a `#22c55e` inset ring). The pill is fully revealed
(`reveal: 1`) and fully swapped (`swap: 1`) — `swap: 1` drives the
`DipSwap` in `SchedulePill` all the way to its `b` value, so the caption
reads `Next: Jun 12, 4:00 PM` (`NEXT_AFTER`), not the `3:00 PM`
(`NEXT_BEFORE`) it showed before the run fired in scene 5.

> *"Why does the pill still say 4:00 PM and not advance again?"* Because
> the desk fired *once* in this video (the single scheduled run, scenes
> 5–8). That run fired at 3:00 and re-armed for 4:00 (scene 5's dip-swap).
> The video ends before 4:00 arrives, so the armed-for-next-hour state is
> exactly the truth: the clock is loaded, waiting. That's the bookend's
> closing line — *an hour from now it does this again* — stated as a UI
> fact, not a caption. Advancing the pill to 5:00 here would imply a
> second run the viewer never saw; leaving it at 4:00 keeps the frame
> honest about what happened.

> *"Why are all three rings green and not the blue 'live' rings from the
> run?"* Blue (the `secondary` ring) means *running now*; green (`ok`)
> means *finished clean*. The run is over — every block did its job and
> settled. Green across the whole chain is the "all systems nominal, work
> complete" read. It's the same causal-order green settle scene 8 ended
> on (Schedule → Polymarket → Desk), now simply held.

## Why latched finals — the scene's structural reason for existing

This is the deepest thing to learn from a settle scene, so it gets its
own section. *Latched finals* means: every state in the scene is a fixed
end-value with no time dependence — no `t` inside `fillMix`, `fillTint`,
`signalTint`, or any `state`. The only `t` in the entire scene is in the
camera's `ramp(t, 0.8, 2.4)`, which itself clamps to a constant after
2.4s. So from 2.4s onward, the scene is a genuinely static image.

Why does that matter? **Because narration is written and recorded *after*
the visuals lock, and the scene has to stretch to fit it.** When the
voiceover for this beat comes in, it might run 4 seconds or 11; the scene
has to be able to hold for however long the words take. A scene whose
final state is *static* can be extended to any length safely — you're
just holding a still frame longer, and nothing is mid-animation to freeze
awkwardly. If instead this scene ended on something still moving (a pulse
looping, a tint oscillating), you couldn't extend it without catching
that motion at a random phase. Latched finals make the audio step
downstream *painless*: every boundary in this build stayed pixel-identical
through the vo-sync precisely because every hold is extend-only by
construction.

> *"Is this the same as scene 1's 'ends on a settled hold' rule?"* Yes —
> it's the same property, and it's not a coincidence that the *first* and
> *last* scenes both have it. Both are the scenes most likely to get
> stretched to fit narration (the open invites the viewer in; the close
> lets the thesis land), and both earn the right to be static because the
> frame itself is the payload. The rule generalizes: any scene that ends
> on a hold should end on a *latched* hold, so the hold is a value, not a
> paused motion.

## The honest weakness of a bookend — name it

A bookend has a real, frank tension, and you should understand it rather
than pretend it away: **a long static hold risks being dead air.** This
scene holds dead still from ~2.4s to ~13.7s — over eleven seconds of an
unchanging frame. That is, by any honest accounting, a long time to show
a picture that isn't moving. The choreography notes say so plainly: this
hold (and scene 1's ~7.4s open) are "the two long dead holds," the
remaining gap an ambient pattern would close.

So why does the scene carry it? Two reasons, and it's worth being precise
about both:

1. **The frame is the payoff.** This isn't a transition holding for a
   beat — it's the *resolved thesis* of the whole video. The empty board
   from scene 1 is now full; the question is answered; the two flags burn.
   A viewer's eye genuinely wants a moment to read the completed board
   (five priced rows is real information), and the narration plays over
   exactly this hold to deliver the closing line. The stillness is the
   space for the idea to land. That's different in kind from a hold with
   nothing to look at.

2. **The video earned its ranking on the *middle*, not on this hold.**
   This build was judged best of its batch for being *visually diverse
   and dynamic* — the run seen at three different scales (the pull, the
   fan, one lane, the scramble), each a different beat shape. A bookend
   doesn't need to be dynamic; it needs to be *calm*, because calm is the
   correct register for "we're done." The diversity already happened. The
   bookend's contribution is the opposite: a place to rest after it.

That said — don't launder the weakness into a virtue. It *is* a long
hold, and the honest improvement (named in the notes) is a low-amplitude
ambient pattern that keeps the frame alive without breaking the
latched-final property — something that animates but always returns to
the same end-state, so the hold stays extend-safe. The taste lesson is:
ship the calm bookend, but know that "calm" and "dead" sit a hair apart,
and the line between them is whether the frame is worth eleven seconds of
looking. Here it is — barely, and only because it's the payoff. On a
weaker frame it wouldn't be.

## How to think about the whole scene

Walk the decisions in order and you can see the bookend's logic:

1. *What state do I show?* The exact settled end-state scene 8 latched —
   read through the same `<Stage/>`, every value a fixed final.
2. *What's allowed to move?* Only the camera, and only as a *release* —
   a ~6% ease-back that says "done," not a move that goes somewhere.
3. *How do I keep the answer legible?* Residue everywhere (provenance),
   full color on the two flags (the takeaway) — hierarchy with no words.
4. *How do I close the arc?* Return to the wide home frame the video
   lives in, the same board from scene 1 now filled — the empty question
   answered in place.
5. *How do I survive narration?* Latched finals → a static hold that
   stretches to any length without freezing a motion mid-flight.
6. *What's the honest cost?* A long dead hold — carried by the fact that
   the frame is the payoff, not by any motion.

There's no clever move in this scene, and there shouldn't be. The craft
of a bookend is *subtraction*: showing the resolved state and trusting it,
adding only the gentlest release so the ending feels like a release. The
quality is in the restraint and in the continuity — that the last frame
is provably the same set piece as the first.

## Exit state (this is the final frame of the video)

`every row priced (fillMix=1) · green residue everywhere (fillTint=0.35) ·
two watch flags burning (signalTint=1 on rows 0 and 3) · chain green
(Schedule/Polymarket/Desk ok) · container folded to one lane (fan=0) ·
pill armed at Jun 12, 4:00 PM · camera at CAM_OUT (s 0.735, ~6% back)`.

Nothing inherits this — it's where the video ends. But it is, by
construction, the answer to scene 1's frame: the same `markets` table,
the same wide home camera, now with the three empty columns filled and
the desk that filled them resting beneath. The arc is closed because the
last frame and the first are the same object, seen at the two ends of one
hour's work.
