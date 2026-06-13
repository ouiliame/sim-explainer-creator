# Scene 6 — `the-fan`  ·  archetype: **freeze-cut continuation + runtime fan**

Source: `../source/scenes/TheFanScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`.

This is the scene where the Fleet container actually does the one thing it's
*for*: it takes a single coding lane and runs it five times at once. It's also
the scene with the most discipline packed into the fewest lines — 47 of them —
because the whole illusion ("five concurrent engineers") is a runtime animation
over geometry that, on the canvas, is still **one lane**. Read it as the worked
example of the rule that costs people the most rounds: *a container contains its
children; the fan must never overflow the box.*

---

## What this scene is for

Scene 5 ended on a held, charged frame: the schedule fired on its own at
midnight, the query swept every `open` row of the backlog, and the batch crossed
edge 2 into the Fleet container, whose live ring came on and **stayed on through
the cut**. This scene opens *inside* that held moment — the ring is already lit —
and answers the question the held frame planted: *the batch went into the
container; now what?*

The answer is the parallel's whole reason to exist. One Engineer lane
(`Engineer → GitHub → Mark Done`) fans out into five, each pinned to one issue
from the backlog, and — this is the load-bearing idea — they all start **at the
same instant**. The scene's one job is to make that simultaneity legible: not
"five lanes appear" but "five engineers leave the gate together, on one clock."
So everything in the scene is choreographed to fire *together* where the parallel
fires together, and *once* where the parallel acts once.

The *one idea per scene* rule here is "the batch splits into one-engineer-per-
issue, all starting at once." It is deliberately **not** "watch an engineer
work" (that's scene 7, `one-engineer`, at lane framing) and **not** "watch the
backlog fill in" (that's scene 8, `the-wall`, the money shot). This scene splits
and launches; it does not finish anything. No row flips `open → done`, no GitHub
PR opens, no tool chip rings, no `ok` states. Resist the urge to start showing
work here — the fan-and-launch *is* the beat.

## What it looks like

We're already leaning toward the container (the camera finishes its move onto
it; the backlog table's last two rows stay sliced in the top of frame so the
table never fully leaves the story). The single Engineer lane sitting inside the
Fleet box separates into five: two compact "ghost" lanes peel off above the
followed lane, two below, all emerging from behind it and sliding to their
resting positions — symmetric, inside the box. The inner Start pill blips blue
once. Five curved wires light from the pill out to the five Engineers in one
motion, and all five Engineer blocks take the live ring **on the same frame**. In
the one followed lane (the full-detail middle one), the Engineer's Messages value
— `Fix <parallel.currentItem>` — has its reference tag glow, dip, and resolve to
its item: `Fix [row 3]`. Then it holds, fan open, through the cut into scene 7.

## The one real decision: the fan is a runtime animation over ONE lane

The canvas — the actual laid-out geometry in `layout.ts` — contains exactly
**one** Engineer lane (`Engineer → GitHub → Mark Done`), sitting at the vertical
center of the container body. The four other lanes you see during this scene are
*ghost instances* that exist **only while `fan > 0`**. The Stage renders them
conditionally:

```tsx
{/* Ghost lanes (compact: header-only triplets). */}
{fan > 0 ? ([0, 1, 3, 4] as LaneId[]).map(ghostLane) : null}

{/* The followed lane (full rows) — the canvas's ONE lane. */}
<div style={{... top: laneTop(2, fan) - CONT_Y ...}}>
  <SimBlock name="Engineer" .../>
  ...
```

This is the single most important discipline in the build, and it's worth
stating as a rule with its own name. **The canvas shows one lane; the fan is
runtime animation only.** (It's case study 17's rule 4, carried forward; the
layout header — "the coding lane (and its four fan ghosts) INSIDE the container"
— the rig header, and the choreography all repeat it because it's the thing that
goes wrong.)

> *"Why fan at runtime instead of just drawing five lanes?"* Two reasons, and
> they compound. First, **honesty**: a Parallel container in Sim *is* one lane.
> The author wires a single `Engineer → GitHub → Mark Done`; the runtime is what
> multiplies it across the collection (`<getissues.rows>` — the rows the query
> returned). If you drew five static lanes, you'd be depicting the wrong thing —
> five authored lanes is a different (and wrong) workflow. The fan being a
> runtime event is the product's actual semantics drawn faithfully: you author
> one, the run makes many — which is exactly what the `Parallel Items` reference
> wired in scene 3 *promises*. Second, **continuity**: scenes 1–5, 8's fold, and
> 9 all show the container with its *one* lane. If the canvas itself held five
> lanes, every other scene would have to hide four of them, and the container
> would have to be sized for five permanently — wasting the box and breaking the
> "one lane" read everywhere else. By making the fan a `0→1` runtime value, the
> *same* set piece is one lane at `fan = 0` and five at `fan = 1`, with nothing
> relaid out. The container is one lane in scene 5, five in scene 6, and folds
> back to one in scene 8 — all the same geometry. (The continuity contract spells
> it out: "Fan exists only between scene 6's fan-out and scene 8's fold; at every
> boundary inside that span fan = 1 exactly.")

> *"So where do the five come from, mechanically?"* From `laneTop(lane, fan)` in
> `layout.ts`. Lane 2 (the followed lane) is *always* at `MID_TOP` — `laneTop`
> returns it unmoved regardless of `fan`. The other four interpolate from a
> shared anchor to their targets:
> ```ts
> export const laneTop = (lane, fan) => {
>   if (lane === 2) return MID_TOP;
>   const target = lane === 0 ? A2_TOP : lane === 1 ? A1_TOP : lane === 3 ? B1_TOP : B2_TOP;
>   return GHOST_ANCHOR_TOP + (target - GHOST_ANCHOR_TOP) * fan;
> };
> ```
> At `fan = 0` every ghost sits at `GHOST_ANCHOR_TOP` — the vertical center of
> the followed lane (`MID_TOP + (ENG_H - GHOST_H) / 2`), i.e. *stacked behind the
> mid lane, invisible because the mid lane is drawn over them and they're at
> opacity-via-`extra` zero*. As `fan` ramps to 1 they slide out to `A2/A1`
> (above) and `B1/B2` (below). The lane id ordering is top→bottom: lane 0 is the
> outer-top slot (`A2_TOP`), lane 1 inner-top (`A1_TOP`), **lane 2 the followed
> middle**, lane 3 inner-bottom (`B1_TOP`), lane 4 outer-bottom (`B2_TOP`). The
> fan *is* this interpolation; you never author five positions, you author one
> anchor and four targets and let `fan` mix between them.

## How the container is kept from overflowing — the box is sized for the fan

This is the other half of the discipline, and it's solved in `layout.ts` by
**deriving the container's height from the fan stack**, not by eyeballing a box
and hoping the lanes fit:

```ts
export const GHOST_H = simBlockHeight(0); // 62 — header-only block
export const ENG_H = 208;                 // measured from a rendered frame
export const LANE_GAP = 24;               // mid lane ↔ first ghost
export const GHOST_GAP = 22;              // ghost ↔ ghost

// ghost · ghost · MID (Engineer-height) · ghost · ghost — symmetric about
// the body center.
const FAN_STACK = 4 * GHOST_H + 2 * GHOST_GAP + 2 * LANE_GAP + ENG_H; // 548

const BODY_PAD = 26;
export const CONT_H = CONT_HEADER_H + BODY_PAD + FAN_STACK + BODY_PAD; // 661
```

The container's height is `header (61) + pad (26) + the full five-wide stack
(548) + pad (26) = 661`. The box is *defined by* the thing it has to hold at full
fan. There is no frame where a ghost can poke past the border, because the border
was computed from the ghosts' total extent plus padding. (Note `CONT_HEADER_H =
40 * S + 1 = 61` — the docs container's `py-2 + 24px` chip, not a round number;
it's a measured product metric too.)

> *"Why size the box for the fan when the fan is only on for three scenes?"*
> Because the alternative — a box sized for one lane that grows when the fan
> opens — would mean the container *relayouts* mid-video, which is exactly the
> teleport the continuity rules forbid. A container that resizes when its
> contents multiply reads as broken: the border jumps, `CONT_Y`/`AXIS_Y` shift,
> the outer wires (`EDGE1`, `EDGE2`) that land on the container's axis handle move
> with it, the whole chain reflows. Instead the box is its final, fan-open size
> *from scene 1*, holding one centered lane with empty air above and below it (air
> the viewer never reads as wrong — boxes have padding, and the docs' own
> teaching screenshots show generous boxes). When the fan opens, the lanes simply
> move into space that was always there. `CONT_H` never changes; `CONT_Y` (660)
> never changes; `AXIS_Y` (990.5) never changes; the outer chain's geometry is
> constant. The fan happens *entirely within a box that was already the right
> size.*

> *"And `ENG_H = 208` is a magic number — where's it from?"* It's **measured from
> a rendered frame**, not computed, and the layout comment says so: the Engineer
> block has Messages + Model rows plus a one-line Tools row carrying the single
> GitHub tool chip, and the exact rasterized height of that stack is 208px. The
> comment even shows the arithmetic estimate — `74 + 31.5 + 12 + 31.5 + 12 + 33 +
> 12 + 1 ≈ 207 computed` — and then overrides it: *the rasterizer says 208, and
> the rasterizer wins.* That's the craft rule ("trust the rasterizer"). The
> ghosts use `simBlockHeight(0) = 62`, the exact height of a header-only block,
> because ghosts show no rows. Every number in `FAN_STACK` is either an exact
> component metric (`GHOST_H`) or a measured one (`ENG_H`); the gaps
> (`LANE_GAP = 24`, `GHOST_GAP = 22`) are the only chosen spacings, and they're
> deliberately near-equal so the stack reads as evenly distributed — `LANE_GAP`
> is a touch larger because the mid lane is the tall one and earns a little more
> air on each side.

## The ghost lanes — header-only, because the backlog carries their results

Each ghost lane is a *triplet* of *header-only* `SimBlock`s — an `Engineer`, a
`GitHub`, and a `Mark Done` with no rows, no tools — drawn by `ghostBlock` and
assembled by `ghostLane`:

```ts
const ghostBlock = (key, x, top, name, color, glyph, vis, extra, hideTarget, hideSource) => {
  const op = visOpacity(vis) * extra;   // extra = fan, so they fade in WITH the fan
  return op <= 0 ? null : ( ... <SimBlock name={name} ... highlighted={vis?.highlighted} state={vis?.state} .../> );
};

const ghostLane = (lane: LaneId) => {
  const top = laneTop(lane, fan);
  return ( ...
    ghostBlock(`eng-${lane}`, ENG_X, top, "Engineer",  BLOCK_COLORS.agent, ..., st?.eng, fan, false, false)
    ghostBlock(`gh-${lane}`,  GH_X,  top, "GitHub",    GITHUB_COLOR,       ..., st?.gh,  fan, false, false)
    ghostBlock(`md-${lane}`,  MD_X,  top, "Mark Done", BLOCK_COLORS.table, ..., st?.md,  fan, false, true)
  );
};
```

> *"Why header-only ghosts instead of five full lanes?"* Because a full lane
> repeated four more times is visual noise that says nothing the followed lane
> doesn't already say. The viewer learns "an engineer reads the code, opens a PR,
> marks the row done" from the *one* full lane (scene 7). The ghosts only need to
> carry two facts: *they exist* (there are five) and *their state* (live now, `ok`
> later in scene 8). A header-only block with a state ring carries both. Their
> actual *results* don't live on the blocks at all — they land in the **backlog
> table**, which is the whole point of the desk ("the table IS this video's
> record surface — its whole thesis," batch assumption 8). So the ghosts are
> deliberately information-light: their progress is a ring, their output is a
> backlog row flipping `open → done` with a PR number. This is swe-fleet
> assumption 3 — the video's "most reversible visual call" — and the reason it's
> safe to make is precisely that the table, not the lanes, is where you read the
> answer. (Five full-row lanes would force an unreadable `s ≈ 0.55` camera; the
> assumption notes this explicitly.)

> *"Why does `extra = fan` gate the ghosts' opacity?"* So they don't just
> *appear* — they fade up *as* they slide out. `visOpacity(vis) * fan` means at
> `fan = 0` they're at zero opacity (and stacked behind the mid lane), and they
> reach full opacity exactly as they reach their resting positions at `fan = 1`.
> The emergence and the fade are the *same ramp*, so there's no frame where a
> ghost is fully opaque but still mid-slide, or fully positioned but ghostly. One
> value drives both. The inner edges get the same treatment — `laneEdges(l, fan)`
> multiplies each edge's opacity by `fan` for the ghost lanes, so the wires fan in
> with their blocks. (The followed lane's edges are drawn separately at
> `laneEdges(2, 1)` — always full opacity, because lane 2 is the canvas's real
> lane and is present at every `fan`.)

## The camera — move first, *then* the event

```ts
const cam = camMix(CAM_ALL, CAM_CONT, ramp(t, 0.4, 1.8, EASING.inOut));
const fan = ramp(t, 2.4, 4.0, EASING.inOut);
```

The camera eases from `CAM_ALL` (the whole-desk home framing, `s = 0.7`) to
`CAM_CONT` (the container, `s = 1.02`) over **0.4s → 1.8s**. The fan doesn't
*start* until **2.4s** — just over half a second after the camera arrives.

```ts
export const CAM_CONT: Cam = {px: CONT_X + CONT_W / 2, py: 975, s: 1.02};
```

`CAM_CONT` centers on the container's horizontal midpoint (`CONT_X + CONT_W/2 =
1110 + 795 = 1905`) at `py = 975` (just above the container's vertical center
`AXIS_Y = 990.5`, biased a touch up so the fan — symmetric about the body center
— sits centered in frame, *and* so the backlog table's last two rows stay sliced
in at the top of frame on a clean row boundary). `s = 1.02` is barely above
neutral — enough to lean in on the container without losing the chain or the
table entirely. The layout comment names this intent: *"the table's last two rows
stay in frame, sliced on a row boundary."* The table never fully leaves the
story; the fleet is acting *on it*, and you keep a corner of it in view.

> *"Why finish the camera move before opening the fan — why not do both at
> once?"* This is the *move first, then the event* rule, and it's about not
> asking the viewer to track two things at once. If the camera were still
> traveling when the lanes started separating, the eye couldn't tell motion-of-
> the-world (camera) from motion-of-the-content (fan) apart — the lanes would
> seem to drift partly because they're moving and partly because the frame is. By
> landing the camera at 1.8s and holding ~0.6s of stillness before the fan opens
> at 2.4s, the fan plays against a *settled* frame: now every bit of motion you
> see is the content doing something. The camera's job is to put you in front of
> the container; *then* the container performs. Two ideas, two moments — never
> stacked. (The choreography flags it: "move, then fan, never both" — `2.4 >
> 1.8`.)

> *"Why `EASING.inOut` on the camera AND the fan?"* Both are spatial transforms
> with momentum (a camera glide; lanes traveling out from behind the mid lane), so
> both get the camera/transform curve — `EASING.inOut`, per the project's easing
> convention (`out` for entrances, `inOut` for camera moves and transforms, `in`
> for exits). The fan is a transform of position, not an entrance of a new
> element, so it's `inOut`, not `out`. (Scene 8's fold-back is the literal reverse
> of this transform — `1 − ramp(...)` with the same `inOut` — so the symmetry
> reads.) Consistent curve choice is part of what makes the build feel composed.

## The launch — once where it acts once, together where it acts together

This is the heart of the scene. Four values drive it, and *each one's timing
encodes a fact about how a parallel works.*

```ts
const pillBlip = pulseWindow(t, 4.9, 5.15, 5.45, 5.75);
const pulses   = ramp(t, 5.1, 5.9, EASING.inOut);

// One clock for all five — the synchrony IS the scene.
const engLive  = t >= 5.8;
```

### (a) The Start pill blips ONCE — `pillBlip = pulseWindow(t, 4.9, 5.15, 5.45, 5.75)`

The inner Start pill takes a single blue ring that comes up over 4.9→5.15s and
falls over 5.45→5.75s — one short blip, then gone. It's drawn as an inset
box-shadow ring (`COLORS.secondary`) on the pill, opacity `= pillBlip`.

> *"Why does the pill blip exactly once when five lanes launch?"* Because there
> *is* one Start. The parallel has a single entry point; the collection
> (`<getissues.rows>`) is distributed *from* that one pill *to* the five
> instances. If the pill blipped five times, or pulsed per-lane, you'd be
> implying five separate triggers — the opposite of the truth. One blip says "one
> trigger." The fan-out then shows that one trigger reaching five places. The
> number of blips is a claim about the architecture, and the honest claim is
> *one*.

### (b) Five pulses leave TOGETHER — one shared `pulses` ramp

Every lane gets the *same* `pulseIn` value, because they're all built from the
same `lane()` factory:

```ts
const lane = (): LaneState => ({ eng: {highlighted: engLive}, pulseIn: pulses });
...
lanes={{0: lane(), 1: lane(), 2: lane(), 3: lane(), 4: lane()}}
```

The Stage draws a `PathPulse` along each lane's pill-edge using `st?.pulseIn`, and
since all five lanes carry the identical `pulses` ramp, all five pulses travel
their wires in lockstep over 5.1→5.9s. The pulse departs ~0.2s into the blip
(blip starts 4.9, pulse starts 5.1) — the trigger lights, *then* the signal
leaves it.

> *"Why one shared ramp instead of five staggered ones?"* Because the staggering
> is the lie. The whole lesson of a parallel is *simultaneous* — instances launch
> together, not in sequence. The most natural-looking thing to animate would be a
> little stagger (it reads as "lively"), and it would be *wrong*: a stagger says
> "first this one, then that one," which is a loop, not a parallel. So the build
> does the harder, more honest thing — one clock, five identical pulses — and
> lets the *synchrony itself* be the visual. There is a note in the source making
> this explicit: `// One clock for all five — the synchrony IS the scene.` That
> comment is the scene's thesis. (The scramble — "result order not guaranteed" —
> is reserved for the *finish* in scene 8; the *launch* is dead-uniform on
> purpose, so the two reads don't collide.)

> *"Why do the wires fan with the lanes — won't the pulses curve?"* Yes, and
> that's correct. The pill-edge geometry is `pillEdge(lane, fan)`: it runs from
> the pill's source handle (`PILL_X + PILL_W + 12`) to *that lane's* Engineer
> target (`ENG_X − 12`), and the target's `y` is `laneHandleY(lane, fan)` — which
> moves with the fan. So at `fan = 1` the five wires splay from one pill out to
> five vertically-spread targets, and the five `PathPulse`s ride those splayed
> curves. (`PathPulse` is the loops rig's curved smooth-step pulse, reused here
> precisely because the inner fan wires curve — the outer chain uses the straight
> `WirePulse`.) One source, five destinations, drawn as one-to-many — which is
> exactly what a parallel's distribution looks like.

### (c) All five Engineers go live ON THE SAME FRAME — `engLive = t >= 5.8`

```ts
const engLive = t >= 5.8;
const lane = (): LaneState => ({ eng: {highlighted: engLive}, pulseIn: pulses });
// ... applied to lanes 0,1,2,3,4 identically
```

At `t = 5.8s` — just as the pulses arrive (window 5.1→5.9) — every Engineer's
live ring latches on, all at once. Not lane 0 then lane 1; *all five at frame
348* (5.8s × 60fps).

> *"Why a hard `t >= 5.8` boolean instead of a ramp?"* Because a ring is a binary
> product state — a block is either live or it isn't; the blue live ring doesn't
> fade in over the product. A boolean latch is the faithful depiction. And `>=`
> (latched, not windowed) means it comes on and *stays* on — these lanes are now
> working and remain working through the cut and into scene 7 (and most of scene
> 8). The synchrony is in the *single threshold*: one number, applied to all five
> via the shared `engLive`, means one frame for all five. If each lane had its own
> threshold you'd be back to a stagger. The lesson — *one clock = parallel* — is
> encoded as *one constant shared by five lanes.* (Note `highlighted` here drives
> the blue live ring; the ghosts read `st?.eng?.highlighted` the same way the
> followed lane does — the five rings are genuinely one value.)

> *"Why 5.8, landing it right at the pulses' tail (5.1→5.9)?"* Cause then effect.
> The pulse leaving the pill is the cause (the trigger reaching the lane); the
> Engineer lighting up is the effect (the lane starting). 5.8 is just inside the
> pulse window's tail, so the rings land as the pulses arrive — you read "the
> trigger got there, so they started." Lighting them *before* the pulses arrived
> would break the causality; lighting them well *after* would leave a dead gap.
> 5.8 threads it.

## The followed lane resolves its reference — `<parallel.currentItem>` → its item

Only the middle lane (lane 2, the followed one) shows full detail, and in its
Engineer's Messages value — `Fix <parallel.currentItem>` — the reference
resolves:

```ts
const tagGlow    = pulseWindow(t, 6.6, 6.9, 7.6, 7.9);
const tagResolve = ramp(t, 7.1, 7.5);
...
laneTag={{glow: tagGlow, resolve: tagResolve}}
```

The Stage builds the Messages value conditionally on `tagResolve`: while
`resolve <= 0` it's a plain glowing `<Tag text={CURRENT_ITEM_TAG} glow=... />`;
once `resolve > 0` it swaps to a `ResolvedTag` that dip-swaps from the tag to its
value:

```tsx
const engMessages = (
  <>{"Fix "}{tagResolve > 0
    ? <ResolvedTag tag={CURRENT_ITEM_TAG} value={CURRENT_ITEM_VALUE} glow={laneTag?.glow ?? 0} resolve={tagResolve} />
    : <Tag text={CURRENT_ITEM_TAG} glow={laneTag?.glow ?? 0} />}</>
);
```

So the `<parallel.currentItem>` tag glows blue (6.6→6.9, holds, releases
7.6→7.9), and *during* that glow it dip-swaps from the tag to its value over
7.1→7.5s — landing on `[row 3]` (`CURRENT_ITEM_VALUE` from `data.ts`), the
backlog item this lane is fixing.

> *"Why `[row 3]` and not the issue text like `OAuth redirect loop`?"* Because
> `<parallel.currentItem>` resolves to the *collection element* the parallel
> handed this instance — and the collection is `<getissues.rows>`, the *rows* the
> query returned. Each instance's `currentItem` is one row object; the honest
> resolved form is a row handle, `[row 3]`, not a cherry-picked field. (The data
> comment ties row 3 to the demo: it's the lane whose work scene 7 follows end-
> to-end, finishing first with PR `#482`. The four ghosts get rows 0/1/3/4
> implicitly; the followed lane is row 2 in lane order but its `currentItem`
> value is authored as `[row 3]` — the binding the viewer learns once, here.)

> *"Why resolve the reference here, and only on one lane?"* Because *this* is what
> `<parallel.currentItem>` means and the scene is finally in a position to show
> it: the parallel distributes the collection one item per instance, and each
> instance sees its slice as `currentItem`. The followed lane resolving to `[row
> 3]` says "this instance got *this* item." Showing it on one lane (not five)
> keeps the read clean — you learn the binding once, on the lane you can actually
> see; the four ghosts are header-only and have no Messages row to resolve anyway
> (`midLane = lanes[2]` is the only lane the Stage feeds full rows). The synchrony
> beat (b/c above) taught *all five start together*; this beat teaches *each gets
> its own item*. Two facts about a parallel, two separate moments.

> *"Why does the glow fully release before the cut, but the resolved value stay?"*
> Deliberate. The glow is a *transient gesture* — "look here, this is resolving" —
> and gestures revert. The resolved value is *state* — the lane really does hold
> this item for the rest of the run — and state persists. So `tagGlow`'s
> `pulseWindow` brings the blue back to zero by 7.9s, while `tagResolve` ramps to
> 1 and *stays* 1 (it's a clamped ramp with no reverse). At the freeze-cut the tag
> reads as a plain resolved value with no highlight — exactly the calm state scene
> 7 inherits and leans into. (Scene 7 will *revert* this resolution at 16.8→17.3s
> as the lane finishes — `// the tag un-resolves` — by the same logic in reverse:
> residue of the table *fill* is permanent, the *resolution* is transient.)

## The carried chain state — what's already on, untouched

The scene also passes two props it doesn't animate, and they matter for the
freeze-cut:

```tsx
cont={{highlighted: true}}            // container live ring — carried from scene 5
pill={{reveal: 1, swap: 1}}           // schedule pill, already swapped to Mar 19
```

`cont={{highlighted: true}}` keeps the Fleet container's blue live ring lit for
the entire scene — it's the state scene 5 carried across the freeze-cut, and this
scene simply *holds* it (never re-lights it; a re-light would imply a new event).
`pill={{swap: 1}}` keeps the schedule pill reading `Next: Mar 19, 12:00 AM` — the
date scene 5 dip-swapped when the clock fired and re-armed. Both are *state at
rest*: the scene inherits them and passes them through unchanged, which is what
"freeze-cut continuation" requires — the carried state isn't re-performed, it's
just continuously present.

## The hold — 7.9s to the end (freeze-cut carry)

After the tag glow releases at 7.9s, nothing moves. The scene holds for ~6.8
seconds at `CAM_CONT` with the fan open, five blue live rings lit, the container
ring on, the schedule pill armed at Mar 19, and the followed lane's tag resolved
to `[row 3]` — and that exact state carries through the cut.

> *"Isn't almost seven seconds of stillness dead air?"* It's a *state-dense* hold,
> not a dead one — five live lanes, a resolved reference, a lit container, an
> armed clock; there's a lot on screen to read, and (per scene 1's logic) a
> settled latched state is what lets the scene stretch to fit narration safely.
> It's also a freeze-cut: the *next* scene opens on this identical frame and
> starts working the followed lane. So the hold isn't waiting — it's the carry.
> The choreography rates it the longest hold in the video and defends it exactly
> this way: *"five blue rings = five unresolved questions"* — five engineers
> working, none finished, the answer deferred to scenes 7–8. That's held tension,
> not dead air.

## How to think about the whole scene

Walk it and every choice is answering "how do I draw a parallel *honestly*?":

1. *What does a parallel actually contain?* One lane → the canvas holds one
   `Engineer → GitHub → Mark Done` lane; the other four are runtime-only ghosts.
2. *How do I show five without lying about the authoring?* Fan the one lane via a
   `0→1` runtime value (`laneTop(lane, fan)`), so the same set piece is one lane
   elsewhere and five here.
3. *How do I keep the box honest?* Size `CONT_H` *from* the full fan stack
   (`FAN_STACK = 548`) → the container never resizes; the fan plays inside space
   that was always there.
4. *What do the extra lanes need to say?* Only "we exist" and "our state" →
   header-only ghost triplets with rings; their results land in the backlog table.
5. *How do I let the viewer watch the split, not fight the camera?* Move onto the
   container first (`ramp 0.4→1.8`), hold, *then* open the fan (`ramp 2.4→4.0`).
6. *What's the actual lesson?* Simultaneity → one pill blip, one shared `pulses`
   ramp, one `t >= 5.8` threshold across all five. The synchrony is encoded as
   *shared constants.*
7. *What does each instance get?* Its own item → resolve `<parallel.currentItem>`
   to `[row 3]` on the followed lane, glow transient, value permanent.

There's no clever single move; it's the *one-lane discipline* applied through
geometry, then a launch choreographed so that what's simultaneous in the product
is simultaneous on screen.

## Exit state (what scene 7 inherits)

`fan = 1 (full five-wide) · five Engineers live (latched on via engLive) ·
followed lane's tag resolved to [row 3], glow released · container live ring on
(cont highlighted) · schedule pill armed (Next: Mar 19, 12:00 AM) · camera at
CAM_CONT`. Scene 7 opens on exactly this frame — a freeze-cut — and eases the
camera in (`camMix(CAM_CONT, CAM_LANE, ...)`) onto the followed lane to watch
that one engineer work, while the four ghosts hold `live` as context for scene
8's scramble. Because both scenes render the same single set piece with `fan = 1`
exactly, the boundary is pixel-identical by construction (continuity contract
6→7: "fan = 1, five lanes live, followed lane's `<parallel.currentItem>` resolved
to `[row 3]`, container live, CAM_CONT").
