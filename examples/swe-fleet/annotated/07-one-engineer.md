# Scene 7 — `one-engineer`  ·  archetype: **camera lean-in, same run**

Source: `../source/scenes/OneEngineerScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the richest motion scene in the whole video, and — like its twin in the
market-desk build — it's worth studying precisely *because* it never feels busy.
It does one thing: it follows a single engineer-lane from its first tool call to
the table row it flips, and it spends its twelve-plus seconds making that one
causal chain legible. Read it as a worked example of the build's best single
idea: **the camera leaves the detail to go watch the consequence.**

---

## What this scene is for

Scene 6 fanned the container open: one coding lane became five, all started at
the same instant, all still running. Scene 7 picks *one* of them — the followed
lane, lane 2, the middle of the fan — and shows it finish, end to end. The
thesis it has to land is the one in the script's beat intent: **the row flip IS
the lane finishing.** Not "the engineer works, and separately the table updates"
— those are the *same event*, and the scene's whole job is to draw the line
between the lane's last block (Mark Done) and the cell that flips because it ran.

So the rule is, again, *one idea per scene*: this scene is "watch one lane close
its own loop." It is emphatically **not** "watch all five finish" — that's scene
8, the wall, the money shot. Here four of the five lanes stay frozen in their
working state on purpose, so the viewer's attention has exactly one place to be.

## What it looks like

The camera is already mid-push when the scene opens — it's leaning from the
container framing onto the followed lane (a freeze-cut carry: scene 6 held on
`CAM_CONT` with five live rings, and this scene inherits that exact frame). At
lane scale you watch the Engineer block's single GitHub tool chip ring **three**
quick times in succession (read the file → write the fix → push the branch). The
Engineer's state ring flips green (ok). A pulse runs down the lane wire into the
GitHub block, which goes live and settles ok (the PR exists). A second pulse runs
on into Mark Done, which goes live — and *while that block is running*, the
camera pulls back out to the full home frame, arriving just as row 3 of the
backlog flips: status `open → done`, the `pr` cell fills `#482`, a green tint
pulse that decays to a faint residue. The `<parallel.currentItem>` reference in
the Engineer reverts. Four ghost lanes sit highlighted (still working) the whole
time. Hold.

## The one idea you'll reuse: the three-stop camera

Almost everything else in this scene is grammar you've already seen in earlier
scenes — chip rings (module-5), state flips, the path pulse, the row dip. The
genuinely new, genuinely load-bearing decision is the **camera path**, and it's
three stops, not two:

```ts
const inMix  = ramp(t, 0.5, 1.8, EASING.inOut);
const outMix = ramp(t, 12.6, 14.2, EASING.inOut);
const cam =
  t < 12.6 ? camMix(CAM_CONT, CAM_LANE, inMix)
           : camMix(CAM_LANE, CAM_ALL, outMix);
```

Read it as a state machine over the clock:

1. **`CAM_CONT → CAM_LANE`** over **0.5s→1.8s**. The scene inherits the
   container framing from scene 6 and pushes in to the lane (`s 1.02 → 1.3`), so
   the tool calls play at lane scale where you can actually read the chip.
2. A **hold at `CAM_LANE`** from 1.8s until 12.6s. `inMix` has clamped to 1 and
   `outMix` is still 0, so the camera sits dead still for ~10.8 seconds — the
   entire tool-call-and-handoff sequence happens here, motionless framing, all
   the motion *inside* the frame.
3. **`CAM_LANE → CAM_ALL`** over **12.6s→14.2s**. The camera eases back out to
   the home framing (`s 1.3 → 0.7`) — and it gets there *before the row flips.*

> *"Why three stops instead of just cutting to the wide shot when the table
> updates?"* Because a cut would sever cause from effect. The whole point of the
> scene is that the lane's work and the table's update are one event seen at two
> scales. If you cut, the viewer experiences two unrelated shots: "a lane
> working," then "a table updating." By keeping it one continuous camera move —
> push in, watch the work, pull out, watch the write — the cell that flips is
> unmistakably *the consequence of the lane you were just watching.* The camera
> physically connects the two.

> *"Why does the camera go back to `CAM_ALL` and not stay tight on the lane to
> watch the flip?"* Because the flip doesn't happen in the lane — it happens on
> the **backlog table**, which is at the top of the canvas, completely out of
> shot at `CAM_LANE`. The Mark Done block running is the *cause*; the row flip is
> the *effect*, and the effect is drawn somewhere else on the canvas entirely. So
> the camera has to leave the lane to go see it. That's the line worth
> internalizing: *the camera leaves the detail to go watch the consequence.* The
> detail (the tools, the handoff) is finished; the payoff is elsewhere; the
> camera follows the payoff.

### The ease-back timing is the whole trick

The two windows are tuned against each other so the geometry lands:

- The pull-out runs `12.6 → 14.2` (it completes at 14.2s).
- The row flip runs `16.2 → 16.8` (it *starts* at 16.2s).

So the camera finishes arriving at the wide frame at 14.2s, the frame sits dead
still for ~2 full seconds (Mark Done is still running — see below), and *then*
the cell starts to flip at 16.2. The full board is in frame, motionless, exactly
when the value lands.

> *"Why the ~2s gap between the camera arriving (14.2) and the flip starting
> (16.2)?"* So the move and the event don't overlap, but also because the write
> isn't done yet — Mark Done doesn't stamp ok until 16.0. The camera arriving
> early and *waiting* for the block to finish is correct: the block is the cause,
> and you don't draw the effect until the cause completes. The discipline here is
> the same one scene 1 used between its row reveal and its row selection, and the
> same one the market-desk twin used: **let one motion finish and settle before
> the next begins.** The camera lands, the frame goes quiet, the block commits,
> *then* the row flips. That beat of stillness is what makes the flip feel like an
> *arrival* instead of a thing that happened while you were busy looking
> elsewhere.

> *"Why 1.6s for the pull-out (12.6→14.2) when the push-in was only 1.3s
> (0.5→1.8)?"* They're close on purpose — the same `EASING.inOut`, near-identical
> durations — so the two moves feel like one camera with a consistent hand, not
> two different gestures. The slightly longer pull-out covers a bigger zoom delta
> (`1.3 → 0.7` is more travel than `1.02 → 1.3`), so giving it a touch more time
> keeps the *apparent* speed matched. And both use `EASING.inOut` because these
> are camera moves through space — the project's rule reserves `inOut` for
> exactly this, transforms and camera, where you want a soft start and a soft
> stop.

## The camera stops, in coordinates

All three are transforms of the same fixed layout (`px, py` is the stage point
that ends up centered in the 1920×1080 viewport; `s` is the zoom):

```ts
CAM_CONT = { px: CONT_X + CONT_W/2,  py: 975,         s: 1.02 } // the container
CAM_LANE = { px: (ENG_X + MD_X + BLOCK_W)/2,          // 1957.5
             py: BODY_CENTER,         s: 1.3  }                // the followed lane
CAM_ALL  = { px: 1395, py: 740,       s: 0.7  }                // the home framing
```

`CAM_LANE`'s `px` is computed, not eyeballed: it's the midpoint of the lane's
horizontal extent, from the Engineer's left edge (`ENG_X = 1350`) to the right
edge of Mark Done (`MD_X + BLOCK_W = 2280 + 375`), which lands at **1957.5**.
That centers the *three-block* lane in frame exactly. `py` is `BODY_CENTER`
(~1021), the vertical center of the container body, which is where the followed
lane lives. Nothing about the lane's position is a magic number — it all derives
from the same `layout.ts` geometry every other scene reads.

> *"Why `s 1.3` for the lane — same as the market-desk twin even though this lane
> has three blocks, not two?"* 1.3 frames the three-block lane (Engineer →
> GitHub → Mark Done) plus a little air. The constraint that sets the value is
> the GitHub tool chip: at native scale the chip's GitHub mark is a 14px glyph
> (`<GithubGlyphW size={14} />` in the rig's `githubChip`), and you need to be
> able to read it as a *branded tool*, not a dot. Push to 1.6 and the chip is
> huge but the three-block "read → PR → mark done" relationship falls out of
> frame; pull to 1.0 and the chip is too small to register as GitHub. 1.3 is the
> value that keeps both the chip identity and the lane structure legible at once.
> (The two-block market-desk lane fit at 1.3 too — the swe-fleet lane is wider, so
> `CAM_LANE.px` is recomputed to its own midpoint, but the zoom that makes a chip
> readable is the same number.)

## The tool calls: three identical rings = iterated tool use

```ts
const chipRing = Math.max(
  pulseWindow(t, 3.2, 3.5, 4.2, 4.5),
  pulseWindow(t, 5.2, 5.5, 6.2, 6.5),
  pulseWindow(t, 7.2, 7.5, 8.2, 8.5),
);
```

The Engineer block carries a single tool chip — **GitHub** (`#181C1E`, the
product's `github.ts` bgColor, white mark on the dark chip) — and it rings
*three* times in a row. `pulseWindow(a0, a1, b0, b1)` ramps up over `a0→a1`,
holds, ramps down over `b0→b1`. So each ring is ~0.3s up, ~0.7s hold, ~0.3s down
(~1.3s total), and the three fire on a clean **2.0s period**: 3.2, 5.2, 7.2.
`Math.max` of the three pulse windows means at any instant the chip shows
whichever ring is currently active — they never overlap (each is fully down by
4.5 / 6.5 / 8.5, well before the next rises), so `max` just selects the live one.

The ring is drawn by `SimBlock` itself: a tool chip with `ring > 0` gets an inset
box-shadow `inset 0 0 0 ${1.5*S}px ${C.ring}` in `COLORS.secondary` at `opacity =
ring` (SimBlock.tsx ~328). This is the product's own selection treatment on a
chip — "the agent reached for this tool" — not an invented glow.

> *"Why three identical rings on ONE chip, instead of two different branded chips
> like the market-desk analyst (Exa then Perplexity)?"* Because the two scenes are
> teaching two different truths. The analyst's job is *research* — search, then
> cross-check — so it reaches for two *different* tools, and the colors carry the
> method. The engineer's job is *write code against a repo* — read a file, write
> the fix, push the branch — which is the **same tool (GitHub) called repeatedly.**
> Three identical pulses on one chip is the honest picture of iterated tool use:
> same capability, invoked again and again as the agent works the problem. The
> *count* is the message (it's not one call, it's a loop of them), and the
> *sameness* is also the message (it's all one integration). Two different chips
> here would be a lie about how the work goes.

> *"Why exactly three, and why the 2.0s period?"* Three is the smallest count
> that reads as "more than once, in a rhythm" — two could read as a single
> back-and-forth, four starts to feel like padding. The 2.0s period (ring at 3.2,
> 5.2, 7.2) gives each call ~0.7s of clean air after it releases (down at 4.5,
> next up at 5.2), so the eye registers *three separate gestures* rather than one
> stuttering smear. Tighten the period to 1s and they blur into one event; widen
> it to 4s and the lane sits dead between calls. ~2s is the spacing that reads as
> "a deliberate, repeated step." (It's also the same ~2s cadence the analyst twin
> used between its two rings — consistent tool-call rhythm across the series.)

> *"Why do the rings start at 3.2 and not at 0?"* Two constraints. First, they
> start *after* the camera has finished pushing in (the push-in ends at 1.8s, plus
> a ~1.4s breath) — you don't ring a chip the viewer can't read yet. Second, the
> chip is small UI; firing the first ring a beat into the stable lane framing lets
> the eye find the chip before it lights. Ringing it during the push-in would
> waste the gesture on a moving frame.

## The settle and the two handoffs: cause then effect, twice

After the tools, the engineer finishes and hands off down a **two-block** tail —
first to GitHub (open the PR), then to Mark Done (flip the row). This is the
structural difference from the market-desk twin, which had only one write block.
Here the causal chain has an extra link, and each link is drawn the same way: a
state flip, a traveling pulse, a heating wire, the next block going live.

```ts
const engLive = t < 9.4;
const engOk   = t >= 9.4;                          // Engineer flips ok at 9.4s

const pulseA  = ramp(t, 9.6, 10.2, EASING.inOut);     // pulse Engineer → GitHub
const edgeAHi = pulseWindow(t, 9.6, 10.0, 11.4, 11.9); // lane edge A heats
const ghLive  = t >= 10.1 && t < 12.2;             // GitHub block live
const ghOk    = t >= 12.2;                          // GitHub flips ok (PR exists)

const pulseB  = ramp(t, 13.4, 14.0, EASING.inOut);     // pulse GitHub → Mark Done
const edgeBHi = pulseWindow(t, 13.4, 13.8, 15.2, 15.7); // lane edge B heats
const mdLive  = t >= 13.9 && t < 16.0;             // Mark Done live
const mdOk    = t >= 16.0;                           // Mark Done flips ok (committed)
```

The chain of causation, in order:

1. **9.4s** — the Engineer's state ring flips from neutral to **green/ok**
   (`engOk`). The coding is done. (The chip rings finished at 8.5s, so there's
   a ~0.9s beat of "thinking" before it settles — the engineer isn't done the
   instant the last tool returns.)
2. **9.6s** — a `PathPulse` (`pulseA`, the loops rig's traveling light blip)
   runs down lane edge A from the Engineer to the GitHub block, and the edge
   itself *heats* (`edgeAHi` interpolates the wire from `pal.wire` toward
   `pal.secondary` and thickens it from `2.25` to `3.5`px — the rig's
   `2.25 + 1.25·hi`). This is the engineer *handing its result to the PR block.*
3. **10.1s** — the GitHub block goes **live** (`ghLive`), its ring lit. It's
   running `Create pull request` against `acme/api`.
4. **12.2s** — GitHub flips **ok** (`ghOk`). The PR exists. Note GitHub stays
   live for ~2.1s (10.1→12.2) — opening a PR is the slow real step, so it gets
   the longest "running" window of the three blocks.
5. **13.4s** — a *second* `PathPulse` (`pulseB`) runs down lane edge B from
   GitHub to Mark Done, edge B heating (`edgeBHi`). GitHub hands off to the
   write block.
6. **13.9s** — Mark Done goes **live** (`mdLive`). It's running `Update Row by
   ID` with `{"status": "done", …}`.
7. **16.0s** — Mark Done flips **ok** (`mdOk`). The write has committed. *Only
   now* may the row flip.

> *"`pulseA`/`pulseB` use `EASING.inOut` but `edgeAHi`/`edgeBHi` are plain
> `pulseWindow`s — why the mix?"* `pulseA`/`pulseB` are things *traveling* down a
> wire (a position animating from one end to the other), so they get eased like
> any spatial move. `edgeAHi`/`edgeBHi` are *brightness* — the wire getting hotter
> then cooler — which has no spatial momentum, so they're left as linear
> up/hold/down. Same distinction the template draws for scene 1's fade and the
> twin draws for its lane wire: ease what travels, leave what only changes value.

> *"Why does `pulseB` ride DURING the camera ease-back (12.6→14.2)?"* This is the
> one deliberate exception to the build's "camera settles before the beat it
> frames" rule, and it's load-bearing. `pulseB` runs 13.4→14.0, squarely inside
> the 12.6→14.2 pull-out. The reason: the pull-out travels *up and out* toward the
> table, and `pulseB` travels *left-to-right* along the lane toward Mark Done —
> both motions point the eye in the direction of the payoff. Letting the pulse
> ride the camera move means the traveling light *pulls the viewer's eye along the
> travel*, handing it off from the lane toward the wide frame where the row is
> about to flip. The block's busy state (`mdLive` 13.9→16.0) and the camera's
> travel are overlapped on purpose so the wide frame arrives on a *still-running*
> write that *completes* (16.0) right after the camera lands (14.2) — primed to
> show its effect. The timing isn't "block runs, then camera moves" — it's "block
> runs *while* camera moves," which is what makes the flip feel immediate when the
> frame settles.

## The payoff: a row flips because a write block ran

This is the heart of the scene, and the place where the build's honesty rule is
most visible. The row only flips *after* Mark Done has committed (`mdOk` at 16.0,
flip starts at 16.2):

```ts
const flip = ramp(t, 16.2, 16.8);
const tint = ramp(t, 16.2, 16.8) * (1 - 0.65 * ramp(t, 17.6, 18.8));
```

fed into the Stage as per-row functions gated to the followed row:

```tsx
flipMix ={(r) => (r === 2 ? flip : 0)}
flipTint={(r) => (r === 2 ? tint : 0)}
```

The followed row is **row 2** — the third row, **CSV export crash**. Every
on-screen value traces to `data.ts`: this row's `pr = "#482"`, and the status
moves `STATUS_BEFORE = "open"` → `STATUS_AFTER = "done"`. The PR number is
grounded and internally consistent: `#482` is assigned in *finish* order, and
this followed lane finishes *first* (it's the one we watched), so it draws the
lowest number in the `#482–#486` block. Nothing on screen is decorative.

### (a) The status/pr cells flip — `flip = ramp(t, 16.2, 16.8)`

The two changing cells (`status` and `pr`) update via a **DipSwap**, not a fade.
The rig's `textOp` computes, for the `STATUS_COL` and `PR_COL` cells:

```ts
const dipped = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
```

So as `flip` crosses 0→1, the cell's text opacity goes 1 → **0 at mix = 0.5** →
1. At the exact midpoint the text is invisible, and that's where `backlogRows`
swaps the value (`mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER` for status; `mix <
0.5 ? "" : it.pr` for pr). The viewer never sees the swap happen — the old state
(`open` / empty) fades out, the new value is substituted at zero opacity, the new
value (`done` / `#482`) fades in.

> *"Why a dip-swap instead of just fading the new value in from nothing?"*
> Because the cell isn't empty-to-full; it's *one value replaced by another*
> (`open → done`, and on the pr cell `"" → "#482"`). A dip-swap is the honest
> animation for a *change of value*: something blinks out and a new thing blinks
> in, the way a real cell updates when a row is written. A straight fade-in would
> imply the cell was always going to hold `done` and was merely revealing it — but
> the truth is the run *wrote* it, replacing `open`. The dip is the write. (It's
> the same `DipSwap` component the schedule pill uses for `Mar 18 → Mar 19` in
> scene 5 — one grammar for "a value changed.")

> *"Why is this the right scene for the row to flip, and not scene 1?"* Because in
> scene 1 no block had run, so the status was `open` and the pr empty *by
> construction* — a table can't show a value the run hasn't produced. Here the
> value flips *only* because Mark Done (a Table-block write) just executed
> (`mdOk` at 16.0, flip at 16.2). That's the rule that keeps the whole video
> honest: a cell never flips on its own; it changes because something wrote it,
> and you watched the thing that wrote it. **Effect has a drawn cause.** If you
> ever animate a row flipping without a block causing it, you've broken the one
> property that makes this an honest depiction of the product.

### (b) The green tint pulses, then decays to a residue — `tint = flip · (1 − 0.65·ramp(17.6, 18.8))`

Over the two written cells the rig lays `rgba(51,196,130, 0.22·tint)` — the
product's own table output-tint green (`SimTable`'s `TINT_BG`). The tint div
spans both changed columns: `left: cellX(STATUS_COL)`, `width: 2 * COL_W`, so it
covers status *and* pr in one wash. `tint` follows `flip` up to full, then the
second factor `(1 − 0.65·ramp(17.6, 18.8))` rides it back down to **0.35** of
full over 17.6→18.8s. So the cells flash bright green as they're written
(16.2–16.8), hold, then settle to a faint green wash that *stays.*

> *"Why does the tint decay to 0.35 and not all the way to 0?"* Because the faint
> remainder is *provenance* — a quiet watermark that says "these cells were
> written by the run, not seeded." It decays because the *value* (`done`, `#482`)
> is the point now, not the freshness — but it doesn't vanish, because the
> residue is what *accumulates* into scene 8's wall. This is the single most
> important durable property in the build: **the residue IS the wall.** In scene 8
> four more rows flip and each leaves the same 0.35 green; by the end the status
> column is a field of faint green, and that field — built entirely out of
> leftover light from writes you watched happen — is the "wall of done." So the
> 0.35 here isn't a styling choice; it's the first brick of the payoff three
> scenes later. Decay all the way to 0 and scene 8 would have nothing to stack.

> *"Why is the residue hierarchy simpler here than in the market-desk twin?"* The
> twin had a *two-tier* residue — the est/edge cells decayed to faint provenance,
> but the `signal` cell stayed *fully* green because a permanent burning cell was
> a standing "this market is mispriced" flag. This scene has no per-row flag to
> keep lit: a done row is just done, every row equal. So there's *one* residue
> level (0.35) across both written cells, and it's uniform on purpose — `done` is
> `done`; no row screams louder than another. The hierarchy the twin used to say
> "this one is special" is deliberately absent here because in this video nothing
> is special, everything is finished. The flat residue is itself the message:
> a uniform wall, not a ranking.

## The reference reverts — resolution is transient, residue is permanent

```ts
const tagResolve = 1 - ramp(t, 16.8, 17.3);
// → laneTag={{glow: 0, resolve: tagResolve}}
```

Back in scene 6, the followed lane's Messages row resolved its
`<parallel.currentItem>` reference to the literal `[row 3]` — the parallel
handing this specific issue to this specific lane. (The Engineer's Messages value
is `Fix <parallel.currentItem>`; the rig renders the tag via `ResolvedTag` while
resolved, falling back to a bare `Tag` at 0.) That resolution has held through
scene 6's tail and all of scene 7's work. Now, as the lane finishes, `tagResolve`
ramps from 1 back to 0 over **16.8→17.3s** — the resolved value reverts to the
bare `<parallel.currentItem>` reference. The rig switches components on the
threshold: while `tagResolve > 0` it renders `ResolvedTag` (showing the resolved
value); at 0 it falls back to plain `Tag` (showing just the reference token).

> *"Why revert the resolution? Wouldn't it be cleaner to leave it resolved?"*
> No — and this is a deliberate counterpoint to the row flip. The resolution was
> a *runtime artifact*: "for this iteration, currentItem = [row 3]." Once the lane
> has finished and written its result, that binding is spent. Reverting it to the
> abstract reference says the lane is *back to being a template* — ready to be
> handed the next issue on the next night's run. **Resolution is transient;
> residue is permanent.** The row flip *stays* (it's the output that matters); the
> currentItem binding *reverts* (it was just plumbing for one iteration). The two
> opposite behaviors, side by side, teach which things are durable results and
> which are momentary wiring.

> *"Why 16.8 → 17.3, right as the flip finishes?"* So the revert reads as *part of
> the same finishing gesture* as the write. The row flips (16.2–16.8), and as it
> completes the tag lets go (16.8–17.3) — the lane wrapping up all its business in
> one continuous ~1-second beat: result committed, binding released. (And it
> starts *after* the flip, not during — cause/effect order even at this scale: the
> lane finishes its write, *then* releases its claim on the item.)

## The four ghost lanes hold their working state

```ts
const ghostLane = (): LaneState => ({eng: {highlighted: true}});
const ghosts = { 0: ghostLane(), 1: ghostLane(), 3: ghostLane(), 4: ghostLane() };
```

Lanes 0, 1, 3, 4 (every lane except the followed lane 2) are rendered with their
Engineer block `highlighted` — carrying the live ring — for the *entire* scene,
with no state change. They never settle, never flip a row.

> *"Why keep four lanes lit and doing nothing for twelve-plus seconds?"* They're
> not doing nothing — they're *still running*, and that's the context the next
> scene needs. This scene followed one engineer to completion; the four held-live
> lanes are a standing reminder that *the other four issues are still being
> fixed.* That unresolved state is the open question that carries scene 7's long
> hold ("four still running — what happens to them?") and sets up scene 8, where
> they finish in scramble order (`GHOST_FINISH_ORDER = [4, 0, 3, 1]`). If you
> settled them here, you'd have nothing left to show. So they hold, deliberately,
> as live scaffolding for the payoff to come.

> *"Why `fan={1}` — why render the full fan at all when we're zoomed onto one
> lane?"* Continuity. Scene 6 ended with the fan fully open (`fan = 1`), and scene
> 8 opens with it still open; the continuity contract pins `fan = 1` at every
> boundary in the 6→8 span. If scene 7 collapsed the fan or didn't render it, the
> boundary frames wouldn't match and you'd get a jump. The fan stays at 1 the
> whole scene; the camera just frames one lane of it. Same single set piece, same
> geometry, only the camera and a few state props differ — the property that makes
> every boundary in this video identical by construction.

## How to think about the whole scene

Walk the decisions and you can see a single question driving the structure —
*how do I show that the lane finishing and the row flipping are one event?* —
answered by a chain of small choices:

1. *Where does the work happen?* In the lane → push the camera in to lane scale
   (`CAM_CONT → CAM_LANE`) so the GitHub chip is readable.
2. *How do I show coding, not a generic "busy"?* Three identical GitHub chip
   rings on a 2.0s period → one tool, called repeatedly, in a rhythm.
3. *How does the engineer hand off?* Settle ok (9.4), pulse + heat down edge A
   into GitHub (9.6), GitHub live (10.1) → PR exists (12.2); then pulse + heat
   down edge B into Mark Done (13.4), Mark Done live (13.9) → committed (16.0).
   Cause flows left to right, twice, through two write blocks.
4. *Where does the result appear?* On the **backlog table**, not the lane → the
   camera has to leave (`CAM_LANE → CAM_ALL`) to go watch the consequence.
5. *How do I tie the move to the event?* Pull out (12.6→14.2) so the frame
   settles, let Mark Done finish (16.0), *then* flip the row (16.2) → the frame
   is still and the block is done before the cell changes; and let `pulseB` ride
   the move to pull the eye home.
6. *Why does the row flip at all?* Because Mark Done ran → effect has a drawn
   cause; a table never flips itself.
7. *What stays, what goes?* The flipped values stay (`done` / `#482`); the green
   tint decays to a flat 0.35 residue (the first brick of scene 8's wall); the
   currentItem binding reverts (transient plumbing) → a residue that teaches
   which things are durable.

There's no single clever effect here — there's one camera idea (leave the detail
to watch the consequence) executed with the timing tuned so the move and the
payoff never collide, surrounded by grammar you've already learned, all of it in
causal order. That's the quality: restraint plus one good idea, timed exactly.

## Exit state (what scene 8 inherits)

`fan = 1 · followed lane (2) settled ok across all three blocks · row 2 flipped
— status done / pr #482 · tint decayed to 0.35 residue · currentItem reverted to
the bare <parallel.currentItem> reference · Mark Done ok · the four ghost
Engineers still highlighted (working) · container live · camera at CAM_ALL.`
Scene 8 opens on exactly this frame — full-frame `CAM_ALL`, one row done, four
lanes still live — and finishes those four in scramble order `[4, 0, 3, 1]`,
each row flip leaving the same 0.35 residue until the status column is a wall of
green. Because both scenes render the same set piece with the camera already at
`CAM_ALL`, the cut is a freeze-cut: a camera change, never a state change,
identical to the pixel.
