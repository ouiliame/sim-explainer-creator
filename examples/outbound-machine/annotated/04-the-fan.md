# Scene 4 — `the-fan`  ·  archetype: **run, freeze**

Source: `../source/scenes/TheFanScene.tsx`, `../source/layout.ts`
(`laneTop`, `pillEdge`, `fan`), `../source/scenes/_rig.tsx`, `../source/data.ts`.

This is where the run starts and where the video's signature move lives: **the
fan**. One lane becomes six, all at once, because a Parallel container runs its
body once per item in its collection — and "all at once" is the content, so the
animation has to make simultaneity *visible*. It's the most distinctive piece of
grammar in the build. If you steal one thing from this video, steal the fan.

This scene also opens the build's single run, which spans scenes 4 → 7 through
freeze-cuts. So its exit state is not a settled rest — it's a *held live moment*
that scene 5 picks up mid-stride.

---

## What this scene is for

One idea: **the parallel makes one lane into six, simultaneously.** The run fires,
Apollo resolves, a pulse crosses to the container, the container goes live, and
then the lane *fans*: four ghost lanes deal out from behind the followed lane, the
inner Start pill blips once, six pulses leave together, and all six Data
Enrichment blocks go live on the same frame. The followed lane's input resolves to
`[Northwind]`. Then it holds.

The whole point of fanning to *six* and pulsing all six *together* is to draw the
docs' sentence — "all items start at once, result order not guaranteed" — instead
of saying it. Simultaneity is not narrated; it's the shape of the motion.

## What it looks like

Apollo's chip takes a live (brand-blue) ring, then settles green (`ok`). A bright
pulse travels the wire from Apollo to the container, and the wire heats (thickens,
shifts toward brand color) under it and *stays* hot. The container takes its live
ring the instant the pulse arrives. Then the single lane splits: two ghost lanes
deal out above and two below, symmetric, the curved Start-pill wires fanning with
them. The Start pill blips once. Six pulses leave the pill together along the six
curved wires; all six Data Enrichment blocks light at the same frame. In the
followed (center) lane, `<parallel.currentItem>` resolves to `[Northwind]`. The
frame holds in this charged, all-live state.

## The real decisions

### The fan is geometry, not a sprite — `laneTop(lane, fan)` lerps real positions

The single most important thing to understand: there is no "fan animation asset."
The fan is a number, `fan ∈ [0,1]`, and the *layout functions read it* to place
the ghost lanes. From `layout.ts`:

```ts
export const laneTop = (lane, fan) => {
  if (lane === 2) return MID_TOP;                 // followed lane never moves
  const target = lane === 0 ? A2_TOP : lane === 1 ? A1_TOP
               : lane === 3 ? B1_TOP : B2_TOP;    // the four ghost destinations
  return GHOST_ANCHOR_TOP + (target - GHOST_ANCHOR_TOP) * fan;  // lerp from stacked → spread
};
```

At `fan = 0`, every ghost's top equals `GHOST_ANCHOR_TOP` — they're stacked
exactly behind the followed lane, invisible (their opacity is also gated by
`fan`). At `fan = 1`, each ghost sits at its target (two above, two below,
symmetric about the body center). In between, they lerp. The curved inner wires
fan *with* them because `pillEdge(lane, fan)` reads the same `fan` value for its
`y2` endpoint — the wire's far end is `laneHandleY(lane, fan)`, so the wire and the
block it points to are always attached. That coupling is why the fan never looks
like wires-and-boxes drifting independently: they're computed from one variable.

> *"Why lerp the geometry instead of just cross-fading a six-lane image over a
> one-lane image?"* Because a cross-fade would teleport — the six lanes would
> *appear* rather than *deal out*, and you'd lose the read of "one became many."
> Lerping real tops means the ghosts physically travel from behind the followed
> lane to their spread positions, which is the literal visual of a parallel
> distributing its body. It's also continuity-safe: at any `fan` value the layout
> is valid, so a freeze-cut at `fan = 1` (which is exactly what happens into scene
> 5) lands on geometry both scenes agree on.
>
> *"Why are the ghosts header-only, while the followed lane has full config rows?"*
> The ghosts are `ghostBlock`s (compact, header-only triplets — `_rig.tsx`). Six
> full lanes with all their config rows would be a wall of identical text — noise,
> and unreadable at this zoom. The ghosts say "there are six of these" by their
> shape; the followed lane (lane 2, center) keeps its rows because it's the one
> you'll *read* in scene 5. So the fan is five context lanes plus one legible
> example, not six equal claimants on your attention.

### The fan is exactly five lanes wide — and `fan` is the truth of how many

The script and continuity contract are strict: **the fan exists only between scene
4's fan-out and scene 6's fold; at every boundary inside that span, fan = 1
exactly.** That's why `TheFanScene` ends with `fan = ramp(3.0, 4.6, inOut)` having
reached 1 well before the scene's hold, and scene 5 opens with a hard `fan={1}`.
The fan is never caught mid-spread on a cut. (There are five lanes drawn — the
center plus four ghosts — standing in for the six leads; lane count and lead count
diverge by one here for readable spacing, a declared low-cost batch assumption.)

### One clock for all six — simultaneity is enforced, not staggered

```ts
const pulseIn  = ramp(t, 5.0, 5.9, EASING.inOut);  // ONE value
const edgeInHi = ramp(t, 5.0, 5.6);                // ONE value
const enrLive  = t >= 5.8;                          // ONE boolean

const lane = () => ({ enr: {highlighted: enrLive}, edgeIn: {hi: edgeInHi}, pulseIn });
ALL_LANES.forEach((id) => (lanes[id] = lane()));   // every lane gets the SAME object
```

Every one of the six lanes is assigned the *same* `pulseIn`, the *same*
`edgeInHi`, and the *same* `enrLive`. There is deliberately **no per-lane offset.**
All six pulses leave the Start pill on the same frame; all six Data Enrichment
blocks light on the same frame (`t >= 5.8`).

> *"Everywhere else in this video things stagger — the header in scene 1, the rows
> in scene 7 — why is the fan dead-synchronized?"* Because the staggering grain
> always matches the concept, and the concept *here* is "they all start at once."
> A Parallel container fires every branch simultaneously; that's the entire
> difference between a parallel and a loop. If the six pulses staggered, you'd be
> drawing a loop, which is a *different control-flow block* and a different claim.
> The one-clock sync is the docs' "all start at once," drawn literally. Staggering
> here would be a factual error, not just a taste choice. (Contrast scene 6, where
> the *finish* order does stagger — because finish order genuinely isn't
> synchronized.)

### The active path heats and *stays* hot across the freeze-cut

```ts
const edge1Hi = ramp(t, 1.4, 2.0);   // heats and never cools in this scene
```

Edge 1 (Apollo → container) heats over 1.4→2.0s as `pulse1` crosses it, and then
holds hot for the rest of the scene. It does **not** cool here. It cools only in
scene 6 (`1 - ramp(7.5, 8.3)`), when the parallel finally settles. The heat on
edge 1 is a persistent state meaning *this path is running* — and it has to
persist across the freeze-cuts into scenes 5 and 6, because the run is still in
flight the whole time. So scene 5 opens with `edge1={{hi: 1}}` hard-set, and scene
6 inherits it hot and only then cools it. Heat = "the run is on this path right
now"; it's a property of the run, not of any one scene.

### Two-surface sync: the pulse arrival drives the container ring

```ts
const pulse1   = ramp(t, 1.2, 2.4, EASING.inOut);
const contLive = t >= 2.4;            // container goes live the frame the pulse lands
```

The pulse finishes crossing at 2.4s, and the container's live ring latches on at
2.4s. The handoff is frame-exact: the wire delivers the signal, and the moment it
arrives the destination lights. Likewise Apollo's ring is on `[0.4, 2.6)` and then
latches `state: "ok"` at 2.6 — the live ring hands off to green exactly as the
pulse has fully left. These tight handoffs (signal leaves source → travels →
arrives → destination lights) are what make the run read as *causal* rather than
as a bunch of independently timed glows.

## The values, and where they come from

| element | value | source |
|---|---|---|
| Apollo state | live ring `[0.4, 2.6)` → `ok` | run state; ring is the product's live treatment |
| followed lane input | `<parallel.currentItem>` resolving to `[Northwind]` | `CURRENT_ITEM_VALUE` in `data.ts`; Northwind is `FOLLOWED_LEAD = 2` |
| six lanes | five drawn (center + 4 ghosts) | standing in for 6 leads; declared |

`[Northwind]` is the followed lead because `data.ts` sets `FOLLOWED_LEAD = 2`
(`LEADS[2]` = Northwind), and Northwind is the lane scene 5 will follow
mechanistically. The resolve uses `ResolvedTag` (`_rig.tsx`), the product's
treatment for a reference that has been replaced by its value — `<parallel.currentItem>`
becomes `[Northwind]` *in place*, never riding a wire.

## The animation, beat by beat

- **Apollo ring** `[0.4, 2.6)`, then `ok` at 2.6. The run fires.
- **pulse1 crosses edge 1** `ramp(1.2, 2.4, inOut)`; **edge 1 heats** `ramp(1.4,
  2.0)` under the pulse and **stays hot**.
- **Container live ring** latches at `t >= 2.4` — the frame the pulse arrives
  (two-surface sync).
- **The fan** `fan = ramp(3.0, 4.6, inOut)` — four ghosts deal out symmetrically,
  curved wires fanning with them. ~0.4s after the container went live, so the box
  is live *before* it splits.
- **Pill blip** `pulseWindow(4.8, 5.0, 5.3, 5.6)` — one inset blue ring on the
  Start pill, once. (Built as up 4.8→5.0, hold, down 5.3→5.6.)
- **Six pulses leave together** `pulseIn = ramp(5.0, 5.9, inOut)`; **in-edges heat
  together** `ramp(5.0, 5.6)`. One clock for all six.
- **All six Data Enrichment blocks live** at `t >= 5.8`, same frame.
- **`<parallel.currentItem>` resolves** to `[Northwind]`: `resolve = ramp(6.2,
  7.2, inOut)`; glow `min(ramp(5.9, 6.3), 1 - 0.6*ramp(7.6, 8.4))` — note the glow
  decays to **0.4, not 0**.
- **Hold** `8.4 → 17.6` local in the held live moment.

> *"Why does the item glow decay to 0.4 instead of 0?"* This is a **freeze-cut
> carry**. The run doesn't pause at the cut into scene 5 — it's continuous — so the
> glow on `[Northwind]` shouldn't fully die at the scene boundary and then
> resurrect. Instead it parks at 0.4, and scene 5 *finishes* the decay
> (`itemGlow = 0.4 * (1 - ramp(0.6, 1.4))` in `OneLaneOneLeadScene`). The viewer
> sees one continuous decay that happens to span a cut, not two glows with a seam.
> This is the trick that makes a freeze-cut invisible: hand the next scene a
> mid-flight value, not a finished one.
>
> *"Why does the pill blip only once?"* The pill is the parallel's entry point —
> "go." It fires once because the parallel is *triggered* once; what's parallel is
> the six branches it spawns, not six triggers. One blip, six pulses.

The whole scene holds static from 8.4 — but it reads *charged*, not dead, because
every surface is in a live state: blue rings on, edges hot, fan spread, tag
resolved. The notes flag it as past the ~3s dead cap, but a held *live* frame
carries differently from a held *idle* one.

## How to think about the whole scene

1. *How do I show one lane becoming six?* Lerp real lane positions with one `fan`
   variable; deal the ghosts out from behind the followed lane → "one became many"
   is a physical travel, not a cross-fade.
2. *How do I keep it readable?* Ghosts are header-only; only the followed lane has
   rows → five context lanes, one legible example.
3. *How do I show they start at once?* One clock for all six pulses/rings/lives →
   simultaneity is the motion; staggering here would draw a loop, not a parallel.
4. *How do I make the run read as causal?* Pulse leaves source, travels, arrives,
   destination lights on the arrival frame → two-surface sync.
5. *How does the run survive the cut into scene 5?* Park the item glow at 0.4 and
   keep edge 1 hot → freeze-cut carry; the next scene finishes mid-flight values.

## Exit state (what scene 5 inherits) — a **freeze-cut**

`run live · container live ring on · fan = 1 exactly · all six Data Enrichment
blocks live (highlighted) · `<parallel.currentItem>` resolved to `[Northwind]`,
glow parked at ~0.4 · Apollo ok · edge 1 hot · table still empty · camera at
CAM_ALL`. Scene 5 opens on this exact charged frame (it hard-sets `fan={1}`,
`cont={{highlighted: true}}`, `edge1={{hi: 1}}`, `itemTag={{resolve: 1}}`) and
immediately leans the camera in to follow lane 2. Because the run state is handed
over mid-flight, the cut is a freeze-cut: same run, new framing, no seam.
