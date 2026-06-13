# Scene 6 — `the-scramble-finish`  ·  archetype: **the parallel resolves**

Source: `../source/scenes/TheScrambleFinishScene.tsx`, `../source/layout.ts`
(`laneTop` fold), `../source/scenes/_rig.tsx`, `../source/data.ts`.

This scene resolves the parallel. The other five lanes finish — but the
load-bearing detail is that they finish in a **scramble**, not top-to-bottom,
because a parallel run's result order isn't guaranteed (parallel.mdx). Then the
fan folds back to one lane and the container settles. It's the third leg of the
single run (scenes 4 → 7) and it teaches the **scramble-finish** grammar:
overlapping, de-phased completions in shuffled spatial order, which is what reads
as a real concurrent system rather than a tidy animation.

---

## What this scene is for

One idea: **result order isn't guaranteed** — drawn, not said. In scene 4 the
lanes all *started* on one clock (a parallel fires every branch at once). Here
they *finish* on five different clocks, and crucially in a spatially shuffled
order (lane 3 first, then 0, then 4, then 1 — not 0,1,3,4). That shuffle is the
content: it's the visual proof that the completion order of a parallel is
nondeterministic. Once the last lane lands, the fan folds back to a single lane
and the container goes green. The table is still empty — nothing has written yet;
the writer is scene 7.

## What it looks like

The five lanes from scene 5 are present (the followed lane already green, four
ghosts still live). One by one, in a non-top-to-bottom order, each ghost lane runs
its compressed triplet — Data Enrichment goes green, then Personalize lights and
greens, then Instantly lights and greens — and these triplets *overlap*, so at any
moment a couple of lanes are mid-work at different stages. After the last lane
lands, the four ghost lanes fold back in behind the followed lane (the fan
collapses to one), edge 1 finally cools, and the container flips from live to
green. It holds on the settled chain — every block green except the idle Table
block, which is the loaded pause before the money shot.

## The real decisions

### The finish order is shuffled on purpose

```ts
const FINISH = [
  { lane: 3, f: 0.4 },
  { lane: 0, f: 1.75 },
  { lane: 4, f: 3.1 },
  { lane: 1, f: 4.45 },
];
```

Four ghosts, starting at `f = 0.4, 1.75, 3.1, 4.45` — a **uniform 1.35s spacing**
but a **shuffled spatial order**: the lanes finish 3, 0, 4, 1, which is not their
top-to-bottom arrangement (0, 1, 3, 4). The spacing is regular; the *which-lane*
is scrambled.

> *"Why uniform spacing but scrambled lanes? Why not random spacing too?"* Two
> separate jobs. The uniform 1.35s spacing keeps the *rhythm* even, so the scene
> doesn't feel arbitrary or janky — it's a steady cadence of completions. The
> scrambled *spatial* order is what carries the meaning: "the lane that finishes
> first isn't the top one." If the spacing were also random you'd add visual noise
> without adding meaning — the eye can't read randomness-in-timing as
> "nondeterministic order," but it *can* read "they're finishing out of position"
> when the cadence is even and only the position jumps around. So: even cadence
> (legible), shuffled position (the claim).
>
> *"Why does Northwind — the followed lane — not re-finish here?"* It already
> finished in scene 5 (`lanes[2] = {enr: ok, pers: ok, send: ok}` hard-set at the
> top of this scene). It's green and stays green. This is also why
> `LANDED_ORDER = [2, 4, 0, 5, 1, 3]` in `data.ts` puts lead 2 (Northwind) first:
> the lane you followed and watched finish is the first row to land in scene 7.
> The narrative thread (you followed Northwind) and the data order (Northwind lands
> first) agree.

### The triplets overlap — concurrency, de-phased

```ts
const ghostLane = (lane, f) => ({
  enr:  {highlighted: t < f,                state: t >= f          ? "ok" : "none"},
  pers: {highlighted: t >= f+0.45 && t < f+0.95, state: t >= f+0.95 ? "ok" : "none"},
  send: {highlighted: t >= f+1.45 && t < f+1.95, state: t >= f+1.95 ? "ok" : "none"},
  edgeIn: {hi: 1 - ramp(t, f, f+0.7)},
  edgeA:  {hi: pulseWindow(t, f+0.45, f+0.65, f+0.95, f+1.25)},
  edgeB:  {hi: pulseWindow(t, f+1.45, f+1.65, f+1.95, f+2.25)},
  pulseA: ramp(t, f+0.45, f+1.0, EASING.inOut),
  pulseB: ramp(t, f+1.45, f+2.0, EASING.inOut),
});
```

Each lane runs the *same* compressed triplet relative to its own `f`: enr greens
at `f`, Personalize works `[f+0.45, f+0.95)`, Instantly works `[f+1.45, f+1.95)`.
Each lane's triplet spans about 2 seconds. But the lanes start only 1.35s apart —
so **lane 0 (f=1.75) begins before lane 3 (f=0.4) has finished** (lane 3 finishes
around 0.4+1.95 = 2.35; lane 0 starts at 1.75). The triplets overlap. At any given
frame in the middle of the scene, two or three lanes are simultaneously
mid-enrichment, mid-personalize, and mid-send at different stages.

> *"Why make them overlap instead of finishing one lane completely before the next
> starts?"* Because they're *concurrent.* The whole reason this is a parallel and
> not a loop is that the branches run at the same time. Finishing them one-at-a-time
> would draw a sequential queue, which is the wrong control-flow picture. The
> overlap — multiple lanes in flight at once, completing at staggered moments — is
> the honest depiction of concurrent work landing on its own schedule. It's the
> same fidelity discipline as scene 4's one-clock start: the motion has to match
> the control flow, or it's a factual error.

Each lane reuses scene 5's exact relay vocabulary (pulse → edge heat → live →
ok), just compressed and de-phased. So the viewer who learned the lane-relay in
scene 5 reads five of them at once here without re-learning it.

### The fold reuses the fan geometry, in reverse

```ts
const fan = 1 - ramp(t, 6.7, 8.0, EASING.inOut);
```

After the last triplet lands (lane 1, f=4.45, finishes around 6.4s), the fan
folds: `fan` goes from 1 back to 0 over 6.7→8.0s. This drives the *same*
`laneTop(lane, fan)` from scene 4 — the ghosts lerp from their spread positions
back to `GHOST_ANCHOR_TOP`, stacked behind the followed lane, and their opacity
(gated by `fan`) drops to 0. The curved wires fold with them, because `pillEdge`
reads the same `fan`. One variable opened the fan in scene 4; the same variable
closes it here. No new geometry, no teleport — the fold is the fan run backward.

> *"Why fold the fan at all — why not leave six lanes?"* Conceptually, the parallel
> has finished: there's nothing left to show six-wide. The fold returns the
> machine to its resting one-lane shape so scene 7 can frame the table-and-writer
> cleanly without five spent ghost lanes cluttering the chain. Visually, the fold
> is the "the parallel is done, collapse back" beat — it punctuates the end of the
> concurrent section.

### Edge 1 cools at last — the active path's heat finally lifts

```ts
const edge1Hi = 1 - ramp(t, 7.5, 8.3);
const contOk  = t >= 8.3;
```

Edge 1 (Apollo → container) has been hot since scene 4 — through the fan, through
the freeze-cuts into scenes 5 and 6 — because the run was on that path the whole
time. *Now*, as the parallel settles, it cools (7.5→8.3), and the container flips
from live (`highlighted`) to green (`ok`) at 8.3. The heat lifting is the signal
that "the run has left this path; the parallel is done." Heat lived exactly as
long as the path was running — across three scenes and two freeze-cuts — and dies
the moment the work it marked completes. That's the persistent-heat-active-path
grammar paying off: heat is a property of the *run*, tracked across scene
boundaries, not redecorated per scene.

## The values, and where they come from

This scene shows no new lead content — the ghost lanes are header-only, so no
contact/opener text appears. The only "values" are the finish order and the
landed order:

| element | value | source |
|---|---|---|
| ghost finish order | lanes 3, 0, 4, 1 | `FINISH` array — shuffled on purpose |
| resulting insert order | `LANDED_ORDER = [2, 4, 0, 5, 1, 3]` | `data.ts` — the order scene 7 writes rows |

`LANDED_ORDER` is the bridge to scene 7: `<parallel.results>` order = scramble
completion order = the order the Table block inserts rows. Northwind (lead 2)
finished first (in scene 5) and lands first.

## The animation, beat by beat

- **Ghost triplets**, each at its `f` (0.4 / 1.75 / 3.1 / 4.45), lanes 3, 0, 4, 1:
  enr greens at `f`; Personalize live `[f+0.45, f+0.95)` → ok; Instantly live
  `[f+1.45, f+1.95)` → ok; pulses `ramp(f+0.45, f+1.0)` and `ramp(f+1.45, f+2.0)`;
  edge heats are pulseWindows shadowing each hop; in-edge cools `1 - ramp(f, f+0.7)`.
  The triplets **overlap** (1.35s spacing < ~2s triplet length).
- **The fold** `fan = 1 - ramp(6.7, 8.0, inOut)` after the last triplet lands —
  ghosts fold back behind the followed lane.
- **Edge 1 cools** `1 - ramp(7.5, 8.3)` — the active path's heat finally lifts.
- **Container settles** `highlighted → ok` at 8.3.
- **Hold** `8.3 → 15.7` local on the settled chain, every block green except the
  idle Table block — a loaded pause before the money shot.

> *"Why hold on 'everything green except the Table block'?"* It's a deliberate
> loaded pause. The enrich/personalize/send pipeline is done; the only thing left
> is the write-back. By holding here with the writer conspicuously idle (no ring,
> no green) while everything upstream is green, the frame poses the question scene
> 7 answers: *now what writes the table?* The empty table above plus the
> not-yet-fired writer below is the setup for the payoff.

## How to think about the whole scene

1. *How do I show result order isn't guaranteed?* Finish the lanes in a shuffled
   spatial order with even cadence → the shuffle is the claim, the cadence keeps it
   legible.
2. *How do I show concurrency?* Overlap the triplets so multiple lanes are in
   flight at once → matches a parallel's control flow, not a sequential queue.
3. *How do I collapse the fan?* Run the same `fan` variable backward → the fold is
   the fan in reverse, no new geometry.
4. *When does the run's heat finally lift?* When the parallel settles — edge 1
   cools at 8.3, after living hot across three scenes → heat is a property of the
   run.
5. *How do I set up scene 7?* Hold on everything-green-except-the-writer, table
   still empty → a loaded pause that poses the money shot's question.

## Exit state (what scene 7 inherits)

`fan folded (fan = 0, one lane) · followed lane and all five completions green ·
container green (`ok`) · edge 1 cooled · Apollo ok · the Table block still idle
(no ring, `state: none`) · table still empty · camera at CAM_ALL`. Scene 7 opens
on this exact frame and fires the writer: a pulse exits the container along edge
2, the Table block goes live, and the six rows begin landing.
