# Scene 6 — `the-fan`  ·  archetype: **freeze-cut continuation + runtime fan**

Source: `../source/scenes/TheFanScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`.

This is the scene where the container actually does the one thing it's *for*:
it takes a single lane and runs it five times at once. It's also the scene
with the most discipline packed into the fewest lines — 48 of them — because
the whole illusion ("five concurrent analysts") is a runtime animation over
geometry that, on the canvas, is still **one lane**. Read it as the worked
example of the rule that costs people the most rounds: *a container contains
its children; the fan must never overflow the box.*

---

## What this scene is for

Scene 5 ended on a held, charged frame: the schedule fired on its own, the
pull swept the board, and the batch crossed into the Desk container, whose
live ring came on and **stayed on through the cut**. This scene opens *inside*
that held moment — the ring is already lit — and answers the question the held
frame planted: *the batch went into the container; now what?*

The answer is the parallel's whole reason to exist. One analyst lane fans out
into five, each pinned to one market, and — this is the load-bearing idea —
they all start **at the same instant**. The scene's one job is to make that
simultaneity legible: not "five lanes appear" but "five lanes leave the gate
together, on one clock." So everything in the scene is choreographed to fire
*together* where the parallel fires together, and *once* where the parallel
acts once.

The *one idea per scene* rule here is "the batch splits into one-analyst-per-
market, all starting at once." It is deliberately **not** "watch an analyst
work" (that's scene 7, at lane framing) and **not** "watch the estimates land"
(that's scene 8, the money shot). This scene splits and launches; it does not
finish anything. No row fills, no tool rings, no `ok` states. Resist the urge
to start showing work here — the fan-and-launch *is* the beat.

## What it looks like

We're already leaning toward the container (the camera finishes its move onto
it). The single analyst lane sitting inside the Desk box separates into five:
two compact "ghost" lanes peel off above the followed lane, two below, all
emerging from behind it and sliding to their resting positions — symmetric,
inside the box. The inner Start pill blips blue once. Five curved wires light
from the pill out to the five Analysts in one motion, and all five Analyst
blocks take the live ring **on the same frame**. In the one followed lane (the
full-detail middle one), the Analyst's Messages reference
`<parallel.currentItem>` glows, dips, and resolves to its market —
`[GPT-6 ships in 2026]`. Then it holds, fan open, through the cut into scene 7.

## The one real decision: the fan is a runtime animation over ONE lane

The canvas — the actual laid-out geometry in `layout.ts` — contains exactly
**one** analyst lane (`Analyst → Update Board`), sitting at the vertical center
of the container body. The four other lanes you see during this scene are
*ghost instances* that exist **only while `fan > 0`**. The Stage renders them
conditionally:

```tsx
{/* Ghost instances (RUNTIME fan only: header-only pairs). */}
{fan > 0 ? ([0, 1, 3, 4] as LaneId[]).map(ghostLane) : null}

{/* The followed lane (full rows) — the canvas's ONE lane. */}
<div style={{... top: laneTop(2, fan) - CONT_Y ...}}>
  <SimBlock name="Analyst" .../>
  ...
```

This is the single most important discipline in the build, and it's worth
stating as a rule with its own name. **The canvas shows one lane; the fan is
runtime animation only.** (It's case study 17's rule 4, and the layout header,
the rig header, and the choreography all repeat it because it's the thing that
goes wrong.)

> *"Why fan at runtime instead of just drawing five lanes?"* Two reasons, and
> they compound. First, **honesty**: a Parallel container in Sim *is* one lane.
> The author wires a single `Analyst → Update Board`; the runtime is what
> multiplies it across the collection. If you drew five static lanes, you'd be
> depicting the wrong thing — five authored lanes is a different (and wrong)
> workflow. The fan being a runtime event is the product's actual semantics
> drawn faithfully: you author one, the run makes many. Second,
> **continuity**: scenes 1–5 and 9 all show the container with its *one* lane.
> If the canvas itself held five lanes, every other scene would have to hide
> four of them, and the container would have to be sized for five permanently —
> wasting the box and breaking the "one lane" read everywhere else. By making
> the fan a `0→1` runtime value, the *same* set piece is one lane at `fan = 0`
> and five at `fan = 1`, with nothing relaid out. The container is one lane in
> scene 5, five in scene 6, and folds back to one in scene 8 — all the same
> geometry.

> *"So where do the five come from, mechanically?"* From `laneTop(lane, fan)`
> in `layout.ts`. Lane 2 (the followed lane) is *always* at `MID_TOP` —
> `laneTop` returns it unmoved regardless of `fan`. The other four interpolate
> from a shared anchor to their targets:
> ```ts
> export const laneTop = (lane, fan) => {
>   if (lane === 2) return MID_TOP;
>   const target = lane === 0 ? A2_TOP : lane === 1 ? A1_TOP : lane === 3 ? B1_TOP : B2_TOP;
>   return GHOST_ANCHOR_TOP + (target - GHOST_ANCHOR_TOP) * fan;
> };
> ```
> At `fan = 0` every ghost sits at `GHOST_ANCHOR_TOP` — the vertical center of
> the followed lane — i.e. *stacked behind the mid lane, invisible because the
> mid lane is drawn over them and they're at opacity-via-`extra` zero*. As
> `fan` ramps to 1 they slide out to `A2/A1` (above) and `B1/B2` (below). The
> fan *is* this interpolation; you never author five positions, you author one
> anchor and four targets and let `fan` mix between them.

## How the container is kept from overflowing — the box is sized for the fan

This is the other half of the discipline, and it's solved in `layout.ts` by
**deriving the container's height from the fan stack**, not by eyeballing a box
and hoping the lanes fit:

```ts
export const GHOST_H = simBlockHeight(0); // 62 — header-only block
export const ANALYST_H = 208;             // measured from a rendered frame
export const LANE_GAP = 24;               // mid lane ↔ first ghost
export const GHOST_GAP = 22;              // ghost ↔ ghost

// ghost · ghost · MID · ghost · ghost — symmetric about the body center
const FAN_STACK = 4 * GHOST_H + 2 * GHOST_GAP + 2 * LANE_GAP + ANALYST_H; // 548

const BODY_PAD = 26;
export const CONT_H = CONT_HEADER_H + BODY_PAD + FAN_STACK + BODY_PAD; // 661
```

The container's height is `header + pad + (the full five-wide stack) + pad`.
The box is *defined by* the thing it has to hold at full fan. There is no frame
where a ghost can poke past the border, because the border was computed from
the ghosts' total extent plus padding.

> *"Why size the box for the fan when the fan is only on for three scenes?"*
> Because the alternative — a box sized for one lane that grows when the fan
> opens — would mean the container *relayouts* mid-video, which is exactly the
> teleport the continuity rules forbid. A container that resizes when its
> contents multiply reads as broken: the border jumps, the outer wires that
> land on its handles shift, the whole chain reflows. Instead the box is its
> final, fan-open size *from scene 1*, holding one centered lane with empty air
> above and below it (air the viewer never reads as wrong — boxes have
> padding). When the fan opens, the lanes simply move into space that was
> always there. `CONT_H` never changes; `CONT_Y` never changes; the outer
> chain's geometry is constant. The fan happens *entirely within a box that
> was already the right size.*

> *"And `ANALYST_H = 208` is a magic number — where's it from?"* It's
> **measured from a rendered frame**, not computed, and the layout comment says
> so: the Analyst block has Messages + Model rows plus a one-line Tools row
> with the Exa and Perplexity chips, and the exact rasterized height of that
> stack is 208px (the arithmetic estimate is ~207; the rasterizer says 208, and
> *the rasterizer wins* — that's the craft rule). The ghosts use
> `simBlockHeight(0) = 62`, the exact height of a header-only block, because
> ghosts show no rows. Every number in `FAN_STACK` is either an exact component
> metric or a measured one; none is decorative.

## The ghost lanes — header-only, because the table carries their results

Each ghost lane is a pair of *header-only* `SimBlock`s — an `Analyst` and an
`Update Board` with no rows, no tools — drawn by `ghostBlock`:

```ts
const ghostBlock = (key, x, top, name, color, glyph, vis, extra, hideSource) => {
  const op = visOpacity(vis) * extra;   // extra = fan, so they fade in WITH the fan
  return op <= 0 ? null : ( ... <SimBlock name={name} ... highlighted={vis?.highlighted} .../> );
};
```

> *"Why header-only ghosts instead of five full lanes?"* Because a full lane
> repeated four more times is visual noise that says nothing the followed lane
> doesn't already say. The viewer learns "an analyst researches and writes
> back" from the *one* full lane (scene 7). The ghosts only need to carry two
> facts: *they exist* (there are five) and *their state* (live now, `ok`
> later). A header-only block with a state ring carries both. Their actual
> *results* don't live on the blocks at all — they land in the **table**, which
> is the whole point of the desk (the table IS the desk). So the ghosts are
> deliberately information-light: their progress is a ring, their output is a
> table row. This is swe-fleet assumption 3, reused.

> *"Why does `extra = fan` gate the ghosts' opacity?"* So they don't just
> *appear* — they fade up *as* they slide out. `visOpacity(vis) * fan` means at
> `fan = 0` they're at zero opacity (and behind the mid lane), and they reach
> full opacity exactly as they reach their resting positions. The emergence and
> the fade are the same ramp, so there's no frame where a ghost is fully opaque
> but still mid-slide, or fully positioned but ghostly. One value drives both.

## The camera — move first, *then* the event

```ts
const cam = camMix(CAM_ALL, CAM_CONT, ramp(t, 0.4, 1.7, EASING.inOut));
const fan = ramp(t, 2.2, 3.6, EASING.inOut);
```

The camera eases from `CAM_ALL` (the whole-desk home framing, `s = 0.78`) to
`CAM_CONT` (the container, `s = 1.05`) over **0.4s → 1.7s**. The fan doesn't
*start* until **2.2s** — half a second after the camera arrives.

```ts
export const CAM_CONT: Cam = {px: CONT_X + CONT_W / 2, py: 975, s: 1.05};
```

`CAM_CONT` centers on the container's horizontal midpoint (`CONT_X + CONT_W/2`)
at `py = 975` (just below the container's vertical center of 990.5, biased a
touch up so the fan, which is symmetric about the body center, sits centered in
frame). `s = 1.05` is barely above neutral — enough to lean in on the container
without losing the chain entirely.

> *"Why finish the camera move before opening the fan — why not do both at
> once?"* This is the *move first, then the event* rule, and it's about not
> asking the viewer to track two things at once. If the camera were still
> traveling when the lanes started separating, the eye couldn't tell motion-of-
> the-world (camera) from motion-of-the-content (fan) apart — the lanes would
> seem to drift partly because they're moving and partly because the frame is.
> By landing the camera at 1.7s and holding half a second of stillness before
> the fan opens at 2.2s, the fan plays against a *settled* frame: now every bit
> of motion you see is the content doing something. The camera's job is to put
> you in front of the container; *then* the container performs. Two ideas, two
> moments — never stacked.

> *"Why `EASING.inOut` on the camera but the fan also `inOut`?"* Both are
> spatial transforms with momentum (a camera glide, lanes traveling), so both
> get the camera/transform curve — `EASING.inOut`, per the project's easing
> convention (`out` for entrances, `inOut` for camera moves and transforms,
> `in` for exits). The fan is a transform of position, not an entrance of a new
> element, so it's `inOut`, not `out`. Consistent curve choice is part of what
> makes the build feel composed.

## The launch — once where it acts once, together where it acts together

This is the heart of the scene. Three things happen, and *each one's timing
encodes a fact about how a parallel works.*

```ts
const pillBlip = pulseWindow(t, 4.2, 4.45, 4.75, 5.05);
const pulses   = ramp(t, 4.4, 5.2, EASING.inOut);
const anaLive  = t >= 5.1;
```

### (a) The Start pill blips ONCE — `pillBlip = pulseWindow(t, 4.2, 4.45, 4.75, 5.05)`

The inner Start pill takes a single blue ring that comes up over 4.2→4.45s and
falls over 4.75→5.05s — one short blip, then gone.

> *"Why does the pill blip exactly once when five lanes launch?"* Because there
> *is* one Start. The parallel has a single entry point; the collection is
> distributed *from* that one pill *to* the five instances. If the pill blipped
> five times, or pulsed per-lane, you'd be implying five separate triggers —
> the opposite of the truth. One blip says "one trigger." The fan-out then
> shows that one trigger reaching five places. The number of blips is a claim
> about the architecture, and the honest claim is *one*.

### (b) Five pulses leave TOGETHER — one shared `pulses` ramp

Every lane gets the *same* `pulseIn` value:

```ts
const lane = (): LaneState => ({ ana: {highlighted: anaLive}, pulseIn: pulses });
...
lanes={{0: lane(), 1: lane(), 2: lane(), 3: lane(), 4: lane()}}
```

The Stage draws a `PathPulse` along each lane's pill-edge using `st?.pulseIn`,
and since all five lanes carry the identical `pulses` ramp, all five pulses
travel their wires in lockstep over 4.4→5.2s.

> *"Why one shared ramp instead of five staggered ones?"* Because the
> staggering is the lie. The whole lesson of a parallel is *simultaneous* —
> instances launch together, not in sequence. The most natural-looking thing to
> animate would be a little stagger (it reads as "lively"), and it would be
> *wrong*: a stagger says "first this one, then that one," which is a loop, not
> a parallel. So the build does the harder, more honest thing — one clock, five
> identical pulses — and lets the *synchrony itself* be the visual. There is a
> note in the source making this explicit: `// One clock for all five — the
> synchrony IS the scene.` That comment is the scene's thesis.

> *"Why do the wires fan with the lanes — won't the pulses curve?"* Yes, and
> that's correct. The pill-edge geometry is `pillEdge(lane, fan)`: it runs from
> the pill's source handle to *that lane's* Analyst target, and the target's
> `y` is `laneHandleY(lane, fan)` — which moves with the fan. So at `fan = 1`
> the five wires splay from one pill out to five vertically-spread targets, and
> the five pulses ride those splayed curves. One source, five destinations,
> drawn as one-to-many — which is exactly what a parallel's distribution looks
> like.

### (c) All five Analysts go live ON THE SAME FRAME — `anaLive = t >= 5.1`

```ts
const anaLive = t >= 5.1;
// ... ana: {highlighted: anaLive}  // on EVERY lane
```

At `t = 5.1s` — just as the pulses arrive — every Analyst's live ring latches
on, all at once. Not lane 0 then lane 1; *all five at frame 306* (5.1s × 60fps).

> *"Why a hard `t >= 5.1` boolean instead of a ramp?"* Because a ring is a
> binary product state — a block is either live or it isn't; the live ring
> doesn't fade in over the product. A boolean latch is the faithful depiction.
> And `>=` (latched, not windowed) means it comes on and *stays* on — these
> lanes are now working and remain working through the cut and into scene 7.
> The synchrony is in the *single threshold*: one number, applied to all five,
> means one frame for all five. If each lane had its own threshold you'd be back
> to a stagger. The lesson — *one clock = parallel* — is encoded as *one
> constant shared by five lanes.*

> *"Why 5.1, landing it right after the pulses (4.4→5.2)?"* Cause then effect.
> The pulse leaving the pill is the cause (the trigger reaching the lane); the
> Analyst lighting up is the effect (the lane starting). 5.1 is just inside the
> pulse window's tail, so the rings land as the pulses arrive — you read "the
> trigger got there, so they started." Lighting them *before* the pulses
> arrived would break the causality; lighting them well *after* would leave a
> dead gap. 5.1 threads it.

## The followed lane resolves its reference — `<parallel.currentItem>` → its market

Only the middle lane (lane 2, the followed one) shows full detail, and in its
Analyst's Messages row the reference resolves:

```ts
const tagGlow    = pulseWindow(t, 5.8, 6.1, 6.8, 7.1);
const tagResolve = ramp(t, 6.3, 6.7);
...
laneTag={{glow: tagGlow, resolve: tagResolve}}
```

The Stage feeds this to a `ResolvedTag` in the followed Analyst's Messages
value: the `<parallel.currentItem>` tag glows blue (5.8→6.1, holds, releases
6.8→7.1), and *during* that glow it dip-swaps from the tag to its value over
6.3→6.7s — landing on `[GPT-6 ships in 2026]` (`CURRENT_ITEM_VALUE` from
`data.ts`), the market this lane prices.

> *"Why resolve the reference here, and only on one lane?"* Because *this* is
> what `<parallel.currentItem>` means and the scene is finally in a position to
> show it: the parallel distributes the collection one item per instance, and
> each instance sees its slice as `currentItem`. The followed lane resolving to
> `[GPT-6 ships in 2026]` says "this instance got *this* market." Showing it on
> one lane (not five) keeps the read clean — you learn the binding once, on the
> lane you can actually see; the four ghosts are header-only and have no
> Messages row to resolve anyway. The synchrony beat (b/c above) taught *all
> five start together*; this beat teaches *each gets its own item*. Two facts
> about a parallel, two separate moments.

> *"Why does the glow fully release before the cut, but the resolved value
> stay?"* Deliberate, and the source comment flags it: `// the glow FULLY
> releases before the cut; only the resolved value carries.` The glow is a
> *transient gesture* — "look here, this is resolving" — and gestures revert.
> The resolved value is *state* — the lane really does hold this market for the
> rest of the run — and state persists. So `tagGlow`'s pulseWindow brings the
> blue back to zero by 7.1s, while `tagResolve` ramps to 1 and *stays* 1 (it's
> a clamped ramp with no reverse). At the freeze-cut the tag reads as a plain
> resolved value with no highlight — exactly the calm state scene 7 inherits and
> leans into. (Scene 7 will revert *this* resolution as the lane finishes, by
> the same logic in reverse: residue of the *fill* is permanent, the
> *resolution* is transient.)

## The hold — 7.1s to the end (freeze-cut carry)

After the tag glow releases at 7.1s, nothing moves. The scene holds for ~7
seconds at `CAM_CONT` with the fan open, five blue rings lit, the container
ring on, and the tag resolved — and that exact state carries through the cut.

> *"Isn't seven seconds of stillness dead air?"* It's a *state-dense* hold, not
> a dead one — five live lanes, a resolved reference, a lit container; there's a
> lot on screen to read, and (per scene 1's logic) a settled latched state is
> what lets the scene stretch to fit narration safely. It's also a freeze-cut:
> the *next* scene opens on this identical frame and starts working the followed
> lane. So the hold isn't waiting — it's the carry. The choreography rates it
> "static but state-dense," which is the right trade for a freeze-cut bridge.

## How to think about the whole scene

Walk it and every choice is answering "how do I draw a parallel *honestly*?":

1. *What does a parallel actually contain?* One lane → the canvas holds one
   lane; the other four are runtime-only ghosts.
2. *How do I show five without lying about the authoring?* Fan the one lane via
   a `0→1` runtime value (`laneTop(lane, fan)`), so the same set piece is one
   lane elsewhere and five here.
3. *How do I keep the box honest?* Size `CONT_H` *from* the full fan stack →
   the container never resizes; the fan plays inside space that was always
   there.
4. *What do the extra lanes need to say?* Only "we exist" and "our state" →
   header-only ghosts with rings; their results land in the table.
5. *How do I let the viewer watch the split, not fight the camera?* Move onto
   the container first, hold, *then* open the fan.
6. *What's the actual lesson?* Simultaneity → one blip, one shared pulse ramp,
   one `t >= 5.1` threshold across all five. The synchrony is encoded as
   *shared constants.*
7. *What does each instance get?* Its own item → resolve `<parallel.currentItem>`
   on the followed lane, glow transient, value permanent.

There's no clever single move; it's the *one-lane discipline* applied through
geometry, then a launch choreographed so that what's simultaneous in the
product is simultaneous on screen.

## Exit state (what scene 7 inherits)

`fan = 1 (full five-wide) · five Analysts live (latched on) · followed lane's
tag resolved to [GPT-6 ships in 2026], glow released · container live ring on ·
pill swap 1 (Next: 4:00 PM) · camera at CAM_CONT`. Scene 7 opens on exactly
this frame — a freeze-cut — and eases the camera in onto the followed lane to
watch that one analyst work, while the four ghosts hold `live` as context for
scene 8's scramble. Because both scenes render the same single set piece with
`fan = 1` exactly, the boundary is pixel-identical by construction.
