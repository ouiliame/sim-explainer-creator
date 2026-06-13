# Scene 5 — `one-lane-one-lead`  ·  archetype: **freeze-cut + camera lean-in (same run)**

Source: `../source/scenes/OneLaneOneLeadScene.tsx`, `../source/layout.ts`
(`CAM_LANE`), `../source/scenes/_rig.tsx`, `../source/data.ts`.

This is the **mechanistic example** — the macro→micro move that every good
explainer makes once. Scene 4 showed all six lanes firing at once (the macro
view). Scene 5 zooms into *one* lane and walks a *single* lead end to end, so the
viewer learns what "enrich, personalize, send" actually does to one company. It's
a freeze-cut continuation of the same run, and it teaches the **lane-relay**
grammar: a three-beat handoff down the lane with heat following the work.

---

## What this scene is for

One idea: **one lead, worked end to end.** Follow the center lane (Northwind). The
Data Enrichment block calls a provider and resolves; a pulse moves to Personalize,
which writes an opener for the enriched contact (`[Priya Nair]`); a pulse moves to
Instantly, which creates the lead. Each block goes live, then settles green, one
after another. And — the load-bearing restraint — **the table above stays
empty.** Nothing writes until the writer (the Table block) runs, which is scene 7.

The scene exists to make the lane's internal mechanism legible by slowing down and
zooming in on exactly one instance of it. The other five lanes are still working in
the background (context), but you only read one.

## What it looks like

The camera pushes in onto the center lane (Northwind), so the three blocks — Data
Enrichment, Personalize, Instantly — fill the frame. The Data Enrichment block's
provider chip (Hunter) rings, as if the cascade is calling out to a provider; the
block settles green. A pulse crosses to Personalize, which lights live; its
`<enrich.contact>` reference glows and resolves to `[Priya Nair]`; it settles
green. A pulse crosses to Instantly, which lights live and settles green —
timed so the green lands just as the camera starts easing back out to the home
framing. Throughout, the table at the top stays empty. The scene ends back at
CAM_ALL, the followed lane fully green, the five ghosts still live.

## The real decisions

### The camera leans in and back out — and lands on CAM_ALL *before* the cut

```ts
const inM  = ramp(t, 0.2, 1.8, EASING.inOut);
const outM = ramp(t, 9.8, 11.4, EASING.inOut);
const cam  = camMix(camMix(CAM_ALL, CAM_LANE, inM), CAM_ALL, outM);
```

Read the nested `camMix`: first interpolate CAM_ALL → CAM_LANE by `inM` (push in
over 0.2→1.8s), then interpolate *that result* back toward CAM_ALL by `outM` (ease
out over 9.8→11.4s). Early in the scene `outM` is 0, so the camera sits at
CAM_LANE; late in the scene `outM` reaches 1, so the camera returns exactly to
CAM_ALL. The work plays at lane framing; the camera returns *before* the scene
ends so the exit framing is CAM_ALL — which is the freeze-cut contract into scene
6.

`CAM_LANE` is `{px: CENTER_X, py: BODY_CENTER, s: 1.04}`. The comment in
`layout.ts` records a red-team lesson worth internalizing: `s = 1.04` is chosen so
the frame edges crop the outer *wires*, never *through the Apollo or Table
blocks*. A block sliced by the frame edge reads as broken. So the lean-in zoom is
tuned to the exact value where you get close to the lane without amputating a
neighboring block.

> *"Why ease the camera back to CAM_ALL before the cut instead of just cutting from
> CAM_LANE?"* Because scene 6 (the scramble finish) is framed at CAM_ALL — it needs
> to show all five lanes finishing, so it's a wide shot. If scene 5 exited at
> CAM_LANE and scene 6 opened at CAM_ALL, that's a jump cut on framing. By easing
> back to CAM_ALL inside scene 5, the boundary is a freeze-cut: same framing, same
> run state, no seam. The camera return is *part of* scene 5's job, not a separate
> transition.
>
> *"Why `inOut` on both the in and out moves?"* Camera moves are transforms — they
> accelerate from rest and decelerate to rest. Both the push-in and the pull-back
> are camera travels, so both get `inOut`. Consistency: every camera move in the
> build uses `inOut`.

### The carried glow finishes here — the freeze-cut seam closes

```ts
const itemGlow = 0.4 * (1 - ramp(t, 0.6, 1.4));
```

Scene 4 parked the `<parallel.currentItem>` → `[Northwind]` glow at 0.4 and handed
it across the cut. Scene 5 finishes the decay: `itemGlow` starts at 0.4 (when
`ramp(0.6,1.4)` is still 0) and fades to 0 by 1.4s. The viewer sees one continuous
glow decay that happens to straddle the scene boundary. This is the *receiving*
half of the freeze-cut carry; scene 4 was the *sending* half. Together they make
the cut invisible — the value was never finished at the seam, so there's no
flicker of "ended then restarted."

### The lane is a three-beat relay, and **heat follows the work**

```ts
// Beat 1 — Data Enrichment
const providerRing = pulseWindow(t, 2.0, 2.4, 3.4, 3.9);  // provider chip rings
const enrOk        = t >= 4.1;
const midEdgeInHi  = 1 - ramp(t, 4.1, 4.8);               // its in-edge cools as it finishes

// Beat 2 — Personalize
const pulseA       = ramp(t, 4.5, 5.3, EASING.inOut);
const edgeAHi      = pulseWindow(t, 4.5, 4.8, 5.3, 5.8);
const persLive     = t >= 5.2 && t < 7.6;
const persOk       = t >= 7.6;
const contactGlow  = Math.min(ramp(t, 5.5, 5.9), 1 - ramp(t, 7.4, 8.2));
const contactResolve = ramp(t, 6.0, 6.9, EASING.inOut);

// Beat 3 — Instantly
const pulseB       = ramp(t, 7.9, 8.7, EASING.inOut);
const edgeBHi      = pulseWindow(t, 7.9, 8.2, 8.7, 9.2);
const sendLive     = t >= 8.6 && t < 10.3;
const sendOk       = t >= 10.3;
```

The structure of each beat is identical and worth memorizing as *the* lane-relay
pattern: a **pulse** travels the in-edge → the **edge heats** (a pulseWindow that
swells under the pulse and subsides) → the destination block goes **live**
(highlighted, for a bounded window) → then **latches `ok`** (green). The next
beat's pulse starts as the previous block's live window is ending, so the relay
flows down the lane like a baton.

Notice `midEdgeInHi = 1 - ramp(4.1, 4.8)`: the Data Enrichment block's *incoming*
edge **cools** as the block finishes. Heat marks "this is where the work is right
now." When Data Enrichment is done and the baton has moved to Personalize, the
edge behind it cools because the work has left it. Heat follows the work down the
lane; it doesn't pile up.

> *"Why does Personalize's live window end at exactly 7.6, and why does Instantly
> start its pulse at 7.9?"* Each block holds live long enough to register as "this
> block is doing something" (Personalize is live `[5.2, 7.6)`, ~2.4s; that's the
> window during which its `<enrich.contact>` glows and resolves). Then it latches
> green and ~0.3s later the next pulse leaves. The 0.3s gap is the baton handoff —
> just enough air that you read "this one finished, *then* the next one started,"
> not "they overlapped." Compare scene 6, where lanes *do* overlap deliberately;
> here the single followed lane is sequential because you're reading it as one
> clean mechanism.
>
> *"Why does Instantly's green land right as the camera starts easing back (both
> ~9.8–10.3)?"* So the last beat's payoff (the lead is created, the lane is fully
> green) coincides with the camera pulling out to reveal the whole machine again.
> The micro example completes exactly as you return to the macro view — the zoom
> back out is the visual full-stop on "that's what one lane does." Timing the green
> to the camera makes the two read as one gesture.

### The provider chip ring — the cascade calling out

`providerRing = pulseWindow(2.0, 2.4, 3.4, 3.9)` drives a ring on the Data
Enrichment block's provider tool chip (Hunter — `_rig.tsx` builds `providerChip`
with `HunterGlyph` and `ring: midLane.providerRing`). The Data Enrichment block's
`provider` output is a cascade (the registry's provider cascade names
Hunter / People Data Labs), and the ring is the visual of "the block is reaching
out to a data provider to build the full contact." It rings, then the block
resolves green. With no caption, the ring says "this block calls an external
service."

### `<enrich.contact>` resolves *while the block is live* — value resolves in place

`contactGlow` rises 5.5→5.9 and `contactResolve` ramps 6.0→6.9, both *inside*
Personalize's live window `[5.2, 7.6)`. So the reference glows and resolves to
`[Priya Nair]` while Personalize is actively running — which is exactly right: the
agent produces the personalized opener *for* that contact during its run, so the
contact reference becomes its value in place, on the live block, never riding a
wire. This is the Phase-B motion contract: "values resolve in place, never ride
wires."

### The ghosts stay live the whole scene — context by distance, not opacity

```ts
const ghost = () => ({ enr: {highlighted: true}, edgeIn: {hi: 1} });
GHOSTS.forEach((id) => (lanes[id] = ghost()));
```

The four ghost lanes hold `highlighted` with hot in-edges for the entire scene —
they're still working. They're demoted by *distance* (the camera is leaned in on
lane 2, so the ghosts sit at the cropped edges), **not** by dimming. That's
faithful: the other five leads really are mid-enrichment while you watch Northwind;
they shouldn't go dark just because the camera moved.

## The values, and where they come from

| element | value | source |
|---|---|---|
| provider chip | Hunter | `PROVIDERS = ["Hunter", "People Data Labs"]` (`data.ts`); chip glyph = `HunterGlyph` |
| Personalize contact | `<enrich.contact>` resolving to `[Priya Nair]` | `CONTACT_VALUE` in `data.ts` — Northwind's enriched contact (`LEADS[2].contact`) |
| Personalize model | `claude-sonnet-4.6` | authored display label (canonical id is `claude-sonnet-4-6`) |

`[Priya Nair]` is `LEADS[2].contact` from `data.ts` — the followed lead Northwind's
contact. The resolve uses `ResolvedTag`, the in-place value treatment. (Same model
display-label note as scene 2: `claude-sonnet-4.6` with a dot is the friendly
name; the API id is hyphenated `claude-sonnet-4-6`.)

## The animation, beat by beat

- **Camera leans in** `inM = ramp(0.2, 1.8, inOut)`, CAM_ALL → CAM_LANE (1.04×).
- **Carried glow finishes** `0.4 * (1 - ramp(0.6, 1.4))` — closes the freeze-cut
  seam from scene 4.
- **Beat 1 (Data Enrichment):** provider chip rings `pulseWindow(2.0, 2.4, 3.4,
  3.9)`; block flips highlighted→`ok` at 4.1; in-edge cools `1 - ramp(4.1, 4.8)`.
- **Beat 2 (Personalize):** pulse `ramp(4.5, 5.3, inOut)`, edge heat `pulseWindow(4.5,
  4.8, 5.3, 5.8)`, live `[5.2, 7.6)` → `ok`; `<enrich.contact>` glows `min(ramp(5.5,
  5.9), 1 - ramp(7.4, 8.2))` and resolves `[Priya Nair]` `ramp(6.0, 6.9, inOut)` —
  *while live*.
- **Beat 3 (Instantly):** pulse `ramp(7.9, 8.7, inOut)`, edge heat `pulseWindow(7.9,
  8.2, 8.7, 9.2)`, live `[8.6, 10.3)` → `ok` at 10.3 — green lands as the camera
  starts back.
- **Camera eases back** `outM = ramp(9.8, 11.4, inOut)`, back to CAM_ALL exactly.
- **Hold** `11.4 → 22.8` local on the eased-back full frame, followed lane green,
  ghosts live.

> *"Why is the table untouched the whole scene?"* This is the honest-product rule
> doing real work. A Sim table only changes when a block writes to it, and the only
> block that writes these rows is the Table block (`Batch Insert Rows`), which
> hasn't run. So even though one full lead is now enriched, personalized, and sent,
> the table is still empty — because *the writer hasn't fired.* Showing the table
> fill here would be a lie about how the workflow runs. The empty table during a
> fully-worked lane is the whole point of separating the work from the write-back.

## How to think about the whole scene

1. *How do I teach the mechanism?* Macro→micro: zoom into one lane after showing
   all six → one legible instance of the unit of work.
2. *How close can I get?* `s = 1.04`, tuned so the frame crops wires, never blocks
   → no amputated block.
3. *How does work move down a lane?* Pulse → edge heat → live → latched ok, beat by
   beat, heat following the work → the lane-relay pattern.
4. *When does the reference become its value?* While the block is live → values
   resolve in place, on the running block, never on a wire.
5. *Why is the table still empty?* Because the writer hasn't run → faithful to how
   a Sim table actually changes.
6. *How do I return without a jump?* Ease back to CAM_ALL before the cut → exit
   framing equals scene 6's open; freeze-cut.

## Exit state (what scene 6 inherits) — a **freeze-cut**

`fan = 1 · followed lane (lane 2) all green (`ok`) · five ghost lanes still live
(highlighted, hot in-edges) · container live · table still empty ·
`<parallel.currentItem>` and `<enrich.contact>` both resolved · camera at CAM_ALL`.
Scene 6 opens on this exact frame and begins finishing the five ghost lanes in
scramble order, then folds the fan. Same run, same framing — freeze-cut.
