# Scene 7 — `one-analyst`  ·  archetype: **camera lean-in, same run**

Source: `../source/scenes/OneAnalystScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the richest motion scene in the whole video, and it's worth studying
precisely because it never feels busy. It does one thing — *follow a single
analyst from the first tool call to the cell it writes* — and it spends its
twelve seconds making that one causal chain legible. Read it as a worked
example of the build's best single idea: **the camera leaves the detail to go
watch the consequence.**

---

## What this scene is for

Scene 6 fanned the container open: one analyst lane became five, all started at
the same frame, all still running. Scene 7 picks *one* of them — the followed
lane, lane 2 — and shows it finish, end to end. The thesis it has to land is the
one in the script: **the row filling IS the analyst finishing.** Not "the
analyst works, and separately the table updates" — those are the same event,
and the scene's whole job is to draw the line between the lane's last block
(Update Board) and the cell that lights up because it ran.

So the rule is, again, *one idea per scene*: this scene is "watch one lane close
its own loop." It is emphatically **not** "watch all five finish" — that's scene
8, the money shot. Here, four of the five lanes stay frozen in their working
state on purpose, so the viewer's attention has exactly one place to be.

## What it looks like

The camera is already mid-push when the scene opens — it's leaning from the
container framing onto the followed lane. At lane scale, you watch the Analyst
block's two tool chips ring in sequence: the blue Exa chip lights, releases,
then ~2s later the teal Perplexity chip lights and releases. The Analyst's
state ring flips green (ok). A pulse runs down the lane wire into Update Board,
which goes live. And then — this is the move — the camera *pulls back out* to
the full frame, arriving just as row 4 of the board fills in: `0.71`, `0.16`,
`watch`, a green flash that decays to a faint residue, except the signal cell,
which stays fully green. The reference tag in the Analyst reverts. Four ghost
lanes sit highlighted the whole time. Hold.

## The one idea you'll reuse: the three-stop camera

Almost everything else in this scene is grammar you've already seen in earlier
scenes (chip rings, state flips, the row fill). The genuinely new, genuinely
load-bearing decision is the **camera path**, and it's three stops, not two:

```ts
const inMix  = ramp(t, 0.5, 1.8, EASING.inOut);
const outMix = ramp(t, 8.4, 9.8, EASING.inOut);
const cam =
  t < 8.4 ? camMix(CAM_CONT, CAM_LANE, inMix)
          : camMix(CAM_LANE, CAM_ALL, outMix);
```

Read it as a state machine over the clock:

1. **`CAM_CONT → CAM_LANE`** over **0.5s→1.8s**. The scene inherits the
   container framing from scene 6 and pushes in to the lane (`s 1.05 → 1.3`),
   so the tool calls play at lane scale where you can actually read the chips.
2. A **hold at `CAM_LANE`** from 1.8s until 8.4s. `inMix` has clamped to 1 and
   `outMix` is still 0, so the camera sits still for ~6.6 seconds — the entire
   tool-call-and-settle sequence happens here, motionless framing, all the
   motion inside the frame.
3. **`CAM_LANE → CAM_ALL`** over **8.4s→9.8s**. The camera eases back out to
   the home framing (`s 1.3 → 0.78`) — and it gets there *before the row
   fills.*

> *"Why three stops instead of just cutting to the wide shot when the table
> updates?"* Because a cut would sever cause from effect. The whole point of
> the scene is that the lane's work and the table's update are one event seen
> at two scales. If you cut, the viewer experiences two unrelated shots: "a lane
> working" and then "a table updating." By keeping it one continuous camera move
> — push in, watch the work, pull out, watch the write — the cell that lights
> up is unmistakably *the consequence of the lane you were just watching.* The
> camera physically connects the two.

> *"Why does the camera go back to `CAM_ALL` and not stay tight on the lane to
> watch the write?"* Because the write doesn't happen in the lane — it happens
> on the **board**, which is at the top of the frame, out of shot at `CAM_LANE`.
> The Update Board block running is the *cause*; the row filling is the
> *effect*, and the effect is drawn somewhere else on the canvas. So the camera
> has to leave the lane to go see it. That's the line worth internalizing: *the
> camera leaves the detail to go watch the consequence.* The detail (the tools,
> the settle) is done; the payoff is elsewhere; the camera follows the payoff.

### The ease-back timing is the whole trick

The two windows are tuned against each other so the geometry lands:

- The pull-out runs `8.4 → 9.8` (it completes at 9.8s).
- The row fill runs `10.0 → 10.6` (it *starts* at 10.0s).

So the camera finishes arriving at the wide frame at 9.8s, sits for a fifth of
a second, and *then* the cell starts to fill. The full board is in frame, dead
still, exactly when the value lands.

> *"Why the 0.2s gap between the camera arriving (9.8) and the fill starting
> (10.0)?"* So the move and the event don't overlap. If the cell started
> filling at 9.7s, mid-pull-out, two things would be moving at once — the whole
> frame translating *and* a cell changing — and the eye couldn't track either.
> The discipline here is the same one scene 1 used between its row reveal and
> its selection: **let one motion finish and settle before the next begins.**
> The camera lands, the frame goes quiet, *then* the payoff. That beat of
> stillness is what makes the fill feel like an arrival instead of a thing that
> happened while you were busy looking elsewhere.

> *"Why 1.4s for the pull-out (8.4→9.8) when the push-in was only 1.3s
> (0.5→1.8)?"* They're close on purpose — the same EASING.inOut, near-identical
> durations — so the two moves feel like one camera with a consistent hand, not
> two different gestures. The slightly longer pull-out covers a bigger zoom
> delta (1.3→0.78 is more travel than 1.05→1.3), so giving it a touch more time
> keeps the *apparent* speed matched. And both use `EASING.inOut` because these
> are camera moves through space — the project's rule reserves `inOut` for
> exactly this, transforms and camera, where you want a soft start and a soft
> stop.

## The camera stops, in coordinates

All three are transforms of the same fixed layout (`px, py` is the stage point
that ends up centered in the 1920×1080 viewport; `s` is the zoom):

```ts
CAM_CONT = { px: CONT_X + CONT_W/2, py: 975,        s: 1.05 } // the container
CAM_LANE = { px: (ANA_X + UPD_X + BLOCK_W)/2,        // 1808
             py: BODY_CENTER,        s: 1.3  }               // the followed lane
CAM_ALL  = { px: 1200, py: 735,      s: 0.78 }               // the home framing
```

`CAM_LANE`'s `px` is computed, not eyeballed: it's the midpoint of the lane's
horizontal extent, from the Analyst's left edge (`ANA_X`) to the right edge of
Update Board (`UPD_X + BLOCK_W`). That centers the two-block lane in frame
exactly. `py` is `BODY_CENTER`, the vertical center of the container body, which
is where the followed lane lives. Nothing about the lane's position is a magic
number — it all derives from the same `layout.ts` geometry every other scene
reads.

> *"Why `s 1.3` for the lane and not tighter?"* 1.3 frames the two-block lane
> plus a little air — tight enough that the tool chips (small UI, 14px glyphs at
> native scale) are readable, loose enough that you can still see the lane is a
> pair of connected blocks, not one. Push to 1.6 and the chips are huge but you
> lose the "Analyst → Update Board" relationship; pull to 1.1 and the chips are
> too small to register as branded tools. 1.3 is the value that keeps both the
> chip identities and the lane structure legible at once.

## The two tool calls: why two distinct beats beat one blur

```ts
const exaRing  = pulseWindow(t, 2.4, 2.7, 3.5, 3.8);
const pplxRing = pulseWindow(t, 4.4, 4.7, 5.5, 5.8);
```

The Analyst block carries two tool chips — Exa (blue, `#1F40ED`) and Perplexity
(teal, `#20808D`) — and each gets its own ring pulse. `pulseWindow(a0, a1, b0,
b1)` ramps up over `a0→a1`, holds, ramps down over `b0→b1`. So:

- **Exa rings** over 2.4→2.7 (up), holds, 3.5→3.8 (down). That's the *search*.
- **Perplexity rings** over 4.4→4.7 (up), holds, 5.5→5.8 (down). That's the
  *cross-check*.

The ring is drawn by `SimBlock` itself: each tool chip with `ring > 0` gets an
inset box-shadow in `COLORS.secondary` at `opacity = ring` (SimBlock.tsx ~328).
This is the product's own selection treatment on a chip — "the agent reached for
this tool" — not an invented glow.

> *"Why two separate rings ~2s apart instead of one 'the agent is working'
> glow over the whole window?"* Because a single generic glow says *nothing* —
> it's the slop default, a blur that means "something is happening." Two
> distinct, *branded* beats say something specific and true: the analyst searched
> (Exa), then cross-checked (Perplexity). The viewer reads two real tools being
> used in sequence, which is exactly what an agent doing research does. The gap
> between them (Exa down at 3.8, Perplexity up at 4.4 — a clean ~0.6s of
> nothing) is what makes them read as *two* calls rather than one smear. One
> idea, twice, in order, beats one vague idea once.

> *"Why these exact windows — 2.4 and 4.4 for the rises?"* Two constraints.
> First, they start *after* the camera has finished pushing in (the push-in
> ends at 1.8s) — you don't ring a chip the viewer can't read yet. Second,
> they're spaced so each ring is a full, separable gesture: ~0.3s up, ~0.8s
> hold, ~0.3s down is ~1.4s per call, and starting them 2.0s apart leaves clean
> air between. Tighten the spacing to 1s and they'd start to feel like one
> event; widen it to 4s and the lane sits dead between calls. ~2s is the spacing
> that reads as "two deliberate steps."

> *"Why Exa first, then Perplexity, and not the reverse?"* It mirrors how the
> work actually goes: you *search* for primary sources first (Exa), then
> *cross-check* what you found (Perplexity). The order encodes a small truth
> about the method, for free, at no extra animation cost. (And it's grounded —
> both blocks exist in the real Analyst's tool list; the colors are the
> products' own `bgColor` tokens, ported verbatim.)

## The settle and the handoff: cause then effect

After the tools, the analyst finishes and hands off to the write block:

```ts
const anaLive = t < 6.4;
const anaOk   = t >= 6.4;                      // Analyst flips ok at 6.4s
const pulseA  = ramp(t, 6.6, 7.2, EASING.inOut);     // pulse down the lane wire
const edgeAHi = pulseWindow(t, 6.6, 7.0, 8.2, 8.7);  // the lane wire heats
const updLive = t >= 7.1 && t < 9.9;           // Update Board live
const updOk   = t >= 9.9;                       // Update Board ok
```

The chain of causation, in order:

1. **6.4s** — the Analyst's state ring flips from neutral to **green/ok**
   (`anaOk`). The research is done. (The chip rings finished at 5.8s, so there's
   a half-second of "thinking" before it settles — the analyst isn't done the
   instant the last tool returns.)
2. **6.6s** — a `PathPulse` (`pulseA`) travels down the lane edge from the
   Analyst to Update Board, and the edge itself *heats* (`edgeAHi` brightens the
   wire from `pal.wire` toward `pal.secondary` and thickens it from 2.25 to
   3.5px). This is the analyst *handing its result to the write block.*
3. **7.1s** — Update Board goes **live** (`updLive`), its ring lit. It's running
   the upsert.
4. **9.9s** — Update Board flips **ok** (`updOk`). The write has committed.

> *"Why does Update Board stay live for almost three seconds (7.1 → 9.9)?"*
> Because that window is *covered by the camera move.* The pull-out runs 8.4→9.8.
> So Update Board is "running" precisely while the camera is traveling from the
> lane to the wide frame — the write is in flight during the move, and it
> *completes* (`updOk` at 9.9) right as the camera lands (9.8). The block's busy
> state and the camera's travel are deliberately overlapped so that the wide
> frame arrives on a *just-finished* write, primed to show its effect. The
> timing isn't "block runs, then camera moves" — it's "block runs *while*
> camera moves," which is what makes the fill feel immediate when the frame
> settles.

> *"`pulseA` uses `EASING.inOut` but `edgeAHi` is a plain `pulseWindow` — why
> the mix?"* `pulseA` is a thing *traveling* down the wire (a position animating
> from one end to the other), so it gets eased like any spatial move. `edgeAHi`
> is a *brightness* — the wire getting hotter and cooler — which has no spatial
> momentum, so it's left as a linear up/hold/down. Same distinction the template
> draws for scene 1's fade: ease what travels, leave what only changes value.

## The payoff: a value lands because a write block ran

This is the heart of the scene, and the place where the build's honesty rule is
most visible. The row only fills *after* Update Board has run:

```ts
const fill   = ramp(t, 10.0, 10.6);
const tint   = fill * (1 - 0.65 * ramp(t, 11.2, 11.8));
const signal = ramp(t, 10.2, 10.8);
```

fed into the Stage as per-row functions gated to the followed row:

```tsx
fillMix   ={(r) => (r === FOLLOWED_ROW ? fill   : 0)}
fillTint  ={(r) => (r === FOLLOWED_ROW ? tint   : 0)}
signalTint={(r) => (r === FOLLOWED_ROW ? signal : 0)}
```

`FOLLOWED_ROW = 3` — the fourth row, **GPT-6 ships in 2026** (odds `0.55`). Every
on-screen value traces to `data.ts`: this row's `est = 0.71`, `edge = 0.16`,
`signal = watch`. The numbers are grounded and internally consistent — `edge =
agent_est − odds = 0.71 − 0.55 = 0.16` (arithmetic, checked), and `signal =
watch` because `|0.16| ≥ 0.08` (the watch threshold). Nothing is decorative.

### (a) The text dips in — `fill = ramp(t, 10.0, 10.6)`

The three empty cells (`agent_est`, `edge`, `signal`) get their text via a
**DipSwap**, not a fade. The rig's `textOp` computes, for the fillable columns:

```ts
const dipped = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
```

So as `fill` crosses 0→1, the cell's text opacity goes 1 → **0 at mix = 0.5** →
1. At the exact midpoint the text is invisible, and that's where `boardRows`
swaps the empty string for the real value (`filled = mix >= 0.5`). The viewer
never sees the swap happen — the old (empty) state fades out, the value is
substituted at zero opacity, the new value fades in.

> *"Why a dip-swap instead of just fading the value in from nothing?"* Because
> the cell isn't empty-to-full; it's *one value replaced by another* (in this
> scene "" → "0.71", but the same component handles "3:00 PM" → "4:00 PM" on the
> schedule pill). A dip-swap is the honest animation for a *change of value*:
> something blinks out and a new thing blinks in, the way a real cell updates.
> A straight fade-in would imply the cell was always going to hold this value
> and was merely revealing it — but the truth is the run *wrote* it, replacing a
> blank. The dip is the write.

> *"Why is this the right scene for the cell to fill, and not scene 1?"* Because
> in scene 1 no block had run, so the cell was empty *by construction* — a table
> can't show a value the run hasn't produced. Here the value appears *only*
> because Update Board (a write block) just executed. That's the rule that keeps
> the whole video honest: a number never ticks into a cell on its own; it
> appears because something wrote it, and you watched the thing that wrote it.
> Effect has a drawn cause. If you ever animate a cell filling without a block
> causing it, you've broken the one property that makes this an honest depiction
> of the product.

### (b) The green tint pulses, then decays to a residue — `tint = fill · (1 − 0.65·ramp(11.2, 11.8))`

Over the three written cells the rig paints `rgba(51,196,130, 0.22·tint)` — the
table's own output-tint green. `tint` follows `fill` up to full, then the second
factor `(1 − 0.65·ramp(11.2, 11.8))` rides it back down to **0.35** of full over
11.2→11.8s. So the cells flash bright green as they're written, then settle to a
faint green wash that *stays.*

### (c) The signal cell keeps a FULL-strength residue — `signalTint = ramp(10.2, 10.8)`

The signal cell gets a *second*, separate tint (`rgba(51,196,130, 0.3·signal)`),
and crucially `signal` is a plain `ramp` with **no decay term.** It ramps to 1
over 10.2→10.8 and *stays at 1.* So after everything settles, the `agent_est`
and `edge` cells carry a faint 0.35 green, but the `signal` cell stays fully,
permanently green.

> *"Why two different residue strengths — what's the hierarchy saying?"* This is
> the residue hierarchy, and it's the most important read in the scene:
> **permanent color = the signal; decayed color = the history.** The faint green
> on `agent_est` and `edge` is *provenance* — "these cells were written by the
> run," a quiet watermark that this is computed data, not seed data. But it
> decays because the *number* is the point now, not the fact that it's fresh.
> The signal cell is different: its full-strength green *is the flag.* The market
> is mispriced (edge 0.16 ≥ threshold), and that's a standing fact the desk
> wants you to keep seeing. So it never fades.

> *"Why is the flag a color and not the word `watch`?"* The cell *does* contain
> the text `watch` (grounded in `data.ts`), but the thing that makes it read as
> *flagged from across the room* is the burning green, not the word. This is the
> project's "indicate state with visuals, not words" rule applied exactly: the
> viewer doesn't read `watch` and infer importance — they see one cell still
> glowing among rows that have gone quiet, and *that* is the signal. The word is
> the label; the color is the alarm. In scene 8, when a second row flags, you'll
> recognize it instantly because you learned the grammar here: a burning cell =
> a mispriced market.

> *"Why does the signal tint start at 10.2, slightly after the fill at 10.0?"*
> So the flag lands *after* the number it's a verdict on. The estimate dips in
> (10.0), and a beat later the flag lights (10.2) — cause (the edge is big)
> before effect (so it's flagged). Even at this tiny scale, the build keeps
> things in causal order.

## The reference reverts — resolution is transient, residue is permanent

```ts
const tagResolve = 1 - ramp(t, 10.6, 11.1);
// → laneTag={{glow: 0, resolve: tagResolve}}
```

Back in scene 6, the followed lane's Messages row resolved its
`<parallel.currentItem>` reference to the literal `[GPT-6 ships in 2026]` — the
parallel handing this specific market to this specific lane. That resolution has
held through scene 6's tail and most of scene 7. Now, as the lane finishes its
work, `tagResolve` ramps from 1 back to 0 over 10.6→11.1s — the resolved value
reverts to the bare `<parallel.currentItem>` reference.

The rig switches components on the threshold: while `tagResolve > 0` it renders a
`ResolvedTag` (showing the resolved value); at 0 it falls back to a plain `Tag`
(showing just the reference token).

> *"Why revert the resolution? Wouldn't it be cleaner to leave it resolved?"*
> No — and this is a deliberate counterpoint to the row fill. The resolution was
> a *runtime artifact*: "for this iteration, currentItem = GPT-6." Once the lane
> has finished and written its result, that binding is spent. Reverting it to the
> abstract reference says the lane is *back to being a template* — ready to be
> handed the next market on the next run. **Resolution is transient; residue is
> permanent.** The row fill *stays* (it's the output that matters); the
> currentItem binding *reverts* (it was just plumbing for one iteration). The
> two opposite behaviors, side by side, teach which things are durable results
> and which are momentary wiring.

> *"Why 10.6 → 11.1, right in the middle of the fill?"* So the revert reads as
> *part of the same finishing gesture* as the write. The row fills (10.0–10.6),
> and as it completes the tag lets go (10.6–11.1) — the lane wrapping up all its
> business in one continuous ~1-second beat: result committed, binding released.

## The four ghost lanes hold their working state

```ts
const ghostLane = (): LaneState => ({ana: {highlighted: true}});
const ghosts = { 0: ghostLane(), 1: ghostLane(), 3: ghostLane(), 4: ghostLane() };
```

Lanes 0, 1, 3, 4 (every lane except the followed lane 2) are rendered as
`highlighted` — their Analyst blocks carry the live ring — for the *entire*
scene, with no state change. They never settle, never fill a row.

> *"Why keep four lanes lit and doing nothing for twelve seconds?"* They're not
> doing nothing — they're *still running*, and that's the context the next scene
> needs. This scene followed one analyst to completion; the four held-live lanes
> are a standing reminder that *the other four markets are still being priced.*
> That unresolved state is the open question that carries scene 7's long hold
> ("four still running — what happens to them?") and sets up scene 8, where they
> finish in scramble order. If you settled them here, you'd have nothing left to
> show. So they hold, deliberately, as live scaffolding for the payoff to come.

> *"Why `fan={1}` — why render the full fan at all when we're zoomed onto one
> lane?"* Continuity. Scene 6 ended with the fan fully open (`fan = 1`), and
> scene 8 opens with it still open. If scene 7 collapsed the fan or didn't
> render it, the boundary frames wouldn't match and you'd get a jump. The fan
> stays at 1 the whole scene; the camera just frames one lane of it. Same single
> set piece, same geometry, only the camera and a few state props differ — the
> property that makes every boundary in this video identical by construction.

## How to think about the whole scene

Walk the decisions and you can see a single question driving the structure —
*how do I show that the lane finishing and the cell filling are one event?* —
answered by a chain of small choices:

1. *Where does the work happen?* In the lane → push the camera in to lane scale
   (`CAM_CONT → CAM_LANE`) so the tools are readable.
2. *How do I show research, not a generic "busy"?* Two branded chip rings, Exa
   then Perplexity, ~2s apart → two real tools, in method order.
3. *How does the analyst hand off?* Settle ok (6.4), pulse down the lane wire
   into Update Board (6.6), block goes live (7.1) → cause flows to the writer.
4. *Where does the result appear?* On the **board**, not the lane → the camera
   has to leave (`CAM_LANE → CAM_ALL`) to go watch the consequence.
5. *How do I tie the move to the event?* Time the pull-out (8.4→9.8) to finish
   *just before* the fill (10.0) → the frame settles, then the cell lands.
6. *Why does the cell hold a value at all?* Because Update Board ran → effect
   has a drawn cause; a table never fills itself.
7. *What stays, what goes?* The row fill stays (residue); the est/edge tint
   decays to provenance; the signal cell stays fully lit (the flag); the
   currentItem binding reverts (transient plumbing) → a residue hierarchy that
   teaches which things are durable.

There's no single clever effect here — there's one camera idea (leave the detail
to watch the consequence) executed with the timing tuned so the move and the
payoff never collide, surrounded by grammar you've already learned, all of it in
causal order. That's the quality: restraint plus one good idea, timed exactly.

## Exit state (what scene 8 inherits)

`fan = 1 · followed lane (2) settled ok · row 4 filled — 0.71 / 0.16 / watch ·
est+edge tint at 0.35 residue, signal cell at full green · currentItem reverted
to the bare reference · Update Board ok · the four ghost lanes still highlighted
(working) · container live · camera at CAM_ALL.` Scene 8 opens on exactly this
frame — full-frame `CAM_ALL`, one row priced, four lanes still live — and starts
finishing those four in scramble order. Because both scenes render the same set
piece with the camera already at `CAM_ALL`, the cut is identical to the pixel.
