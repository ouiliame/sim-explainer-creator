# Scene 2 — `the-run-fires`  ·  archetype: **run + runtime fan**

Source: `../source/scenes/TheRunFiresScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/states.ts` (`S2_THE_RUN_FIRES`), `../source/scenes/_anim.ts`
(`camMix`), `../source/layout.ts` (`ghostTop`, `ghostHandleY`, `CAM_WORK`,
`CAM_HOME`).

This is the scene where the *one run* begins, and where the video's central
spectacle — the parallel fan — happens for the first time. Scene 1 built an idle
chain. Scene 2 fires it, and the first thing the run does that no ordinary
workflow does is *multiply*: the single lane fans into three live instances.
Read it as the worked example for "how do I start a run, drive it down a chain in
the product's own grammar, and then show a parallel container distributing — all
without lying about how Sim actually works."

---

## What this scene is for

The thesis is "one run, distributed — the parallel turns one lane into three live
calls." This scene has to do two things in sequence: (1) **start the run** and
drive it through the chain — Start fires, control passes to Campaign, Campaign
goes live, control passes into the container — using the product's own run
grammar (blip, pulse, ring); and (2) **fan the lane** — the container's one lane
separates into three instances, which is how a Parallel block distributes work at
runtime. And as the fan opens, the camera pulls back to reveal the (still empty)
aside band where the calls and the outcomes table will live.

The *one idea* is "the run fires and fans." It does not yet show the calls
connecting (scene 3), or any conversation (scene 4). The panels stay unborn; the
table stays absent. This scene is purely the run entering the chain and the lane
multiplying.

## The run grammar — read this before the beats

This is the first scene where a run actually *runs* on screen, so it's worth
stating the rules it obeys, because every later run scene obeys them too:

1. **A `PathPulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a streak of blue light (`#33b4ff`), nothing more — not a value,
   not a record. A wire firing means "control passed from this block to the
   next," full stop.
2. **State is shown in the product's own language** — a blue live ring
   (`highlighted: true` → `SimBlock`'s `COLORS.secondary` ring), an edge heating
   up (`hi` interpolating the wire toward secondary), a pill blip — never a word
   like "RUNNING" stamped on screen.
3. **The fan is a runtime animation, never N static lanes.** The container is
   authored with *one* lane (scene 1). The three instances appear only because
   the *run* is distributing — they're ghost pairs that separate during the run
   and retract when it settles. You never draw three lanes in the layout; you fan
   one.

If you internalize those three, the scene decodes: a blip and a latched ring is a
block firing and staying live, a streak is control passing, and a fan of ghost
pairs is a Parallel container distributing.

## The one set piece, the fan, and the camera move

The scene renders the one `<Stage/>` and feeds it run state plus a `fan`
progress and a `camMix`:

```tsx
<Stage
  frame={gf}
  state={{
    cam: camMix(CAM_WORK, CAM_HOME, camP),
    start: {highlighted: startBlip},
    campaign: {highlighted: campaignLive},
    container: {highlighted: containerLive},
    call: {highlighted: callLive},
    edge1: {hi: edge1Hi}, edge2: {hi: edge2Hi}, pillE: {hi: pillHi},
    pulse1, pulse2, pulsePill, pillBlip,
    fan, tagGlow, quiet: q,
  }}
/>
```

Note how little the scene *lays out*. It computes timing windows and hands them
to `<Stage/>`; the geometry of where the ghost pairs travel to lives entirely in
`layout.ts` (`ghostTop(g, fan)` lerps a ghost pair from "stacked behind the lane"
at `fan=0` to its fanned slot at `fan=1`). The scene says *when*; the layout says
*where*. That division is what keeps continuity free.

**The fan mechanism.** In `_rig.tsx`, `ghostLane("a")` and `ghostLane("b")` each
render a header-only **Call + Log outcome** pair plus their wires, positioned by
`ghostTop(g, fan)`. At `fan = 0` both pairs sit at `GHOST_ANCHOR` — exactly
stacked behind the real lane, invisible (`opacity: fan` = 0). As `fan` rises, pair
"a" lerps to a slot *above* the lane (`GHOST_TOP_A`) and pair "b" to a slot
*below* (`GHOST_TOP_B`), their opacity rising with `fan`. The result on screen:
the one lane appears to split into three, the two new ones sliding out above and
below the original, their pill-wires and lane-wires fanning with them. This is the
loops/growth-machine "instances separate at runtime" precedent ported here.

> *"Why ghost *pairs* and not just three copies of the lane?"* Because the
> instances are runtime artifacts, not authored structure. Drawing three full
> lanes would imply the workflow *has* three lanes, which it doesn't — it has one,
> distributed three ways at run time. The ghosts are header-only (just the block
> chrome, no config rows) precisely to read as "instance" rather than "another
> authored block": they're lighter, they fan out from behind the real lane, and
> they retract back into it when the run settles (scene 6). The real lane stays
> the real lane; the ghosts are its runtime shadows.

## The camera move

```ts
camP = c(4.2, 6.2, 0, 1, EASING.inOut)
cam  = camMix(CAM_WORK, CAM_HOME, camP)
```

`camMix` linearly interpolates the three camera fields (`px`, `py`, `s`) from
`CAM_WORK` (s 0.9, centered on the workflow axis) to `CAM_HOME` (s 0.8, centered
on the whole stage), driven by `camP` which is itself eased `inOut`. So the
camera eases back over **4.2s → 6.2s**, pulling out from the top-band framing to
show the whole stage — including the empty aside band sliding into frame below.

> *"Why does the camera move start at 4.2 — after the fan started at 3.6, not
> with it?"* Because the camera move is a *reveal*, and you want the fan to
> already be opening before you pull back to show it in context. Start them
> together and the eye can't tell whether the lane is fanning or the camera is
> just zooming out. Let the fan start (3.6), get a beat of it opening at the
> closer framing, *then* pull back (4.2) so the viewer reads "the lane fanned, and
> now I'm seeing the whole stage it fanned within." The move is timed *after* the
> event it reveals.
>
> *"Why `EASING.inOut` on the camera?"* Camera moves are the canonical `inOut`
> case in this build — a lens travelling through space wants to accelerate softly
> and decelerate into its destination. A linear camera move reads as mechanical;
> `inOut` reads as a considered push. (Note the *mix* is linear — `camMix` lerps
> the fields — but the *parameter* `camP` is eased, so the eased curve drives the
> whole move.)

## The animation, beat by beat

The run enters as a left-to-right relay: **blip → pulse → ring**, each surface
lighting the frame the pulse reaches it. The `mkClock` helpers are the same as
scene 1 (`t` = local seconds, `c` = clamped eased interpolate).

### (a) Start blips — `startBlip = t >= 0.3 && t < 0.8`

The Start block's selection ring (a brief blue blip) is a plain boolean window:
on from **0.3s to 0.8s**, a ~0.5s flash. It's the run *beginning* — Start fired.

> *"Why a closed window (blips off) when later rings latch open?"* Because Start
> *fires and finishes* — it's a trigger, an instant. It doesn't stay live; it
> kicks the run off and it's done. So its ring is a closed blip. Campaign and the
> container, by contrast, latch on and stay (they're doing work for the rest of
> the run). The difference in window shape *is* the difference in event lifetime:
> instant vs. ongoing.

### (b) Pulse crosses edge 1, Campaign goes live

```ts
pulse1   = c(0.5, 1.2, 0, 1, EASING.inOut)   // streak travels edge 1
edge1Hi  = c(0.9, 1.3)                        // the wire heats up as control passes
campaignLive = t >= 1.15                       // Campaign live ring — LATCHED
```

A `PathPulse` rides edge 1 (Start→Campaign), its progress `0→1` over **0.5→1.2s**,
eased `inOut` (it's travelling — momentum). The edge itself heats over **0.9→1.3**
(`edgeColor` interpolates the wire from `pal.wire` toward `pal.secondary` and the
thickness grows `2.25 → 3.5`), so the wire briefly glows as the streak crosses it.
As the streak lands, Campaign's live ring latches at **t >= 1.15** — no upper
bound, it stays on.

> *"Why does Campaign light at 1.15 while the pulse finishes at 1.2?"* A hair of
> overlap. The streak is decelerating into Campaign's handle over its last
> fraction; lighting the ring at 1.15 means Campaign comes alive *as* the streak
> is absorbed, so "control arrives" and "block goes live" read as one event. A gap
> would read as a pause; the slight overlap reads as cause-into-effect.
>
> *"Why latch Campaign open instead of blipping it like Start?"* Because Campaign
> is the agent that's doing the run's work — pulling appointments, driving the
> calls. It's live for the rest of the run. The latched ring is the run's spine,
> the same freeze-cut-carry discipline browser-agent uses: a live ring that holds
> across cuts says "this is still going." Campaign's ring stays on through scenes
> 2–5 and only releases when the run settles in scene 6.

### (c) Pulse crosses edge 2, the container goes live

```ts
pulse2  = c(1.6, 2.3, 0, 1, EASING.inOut)
edge2Hi = c(2.0, 2.4)
containerLive = t >= 2.25
```

Identical grammar one block down: streak over **1.6→2.3**, edge heat **2.0→2.4**,
container live ring latches at **2.25**. Now control is inside the Parallel
container.

> *"Why the ~0.4s gap between Campaign going live (1.15) and the next pulse
> departing (1.6)?"* So each block-to-block hand-off reads as a discrete step.
> Campaign lights, holds a beat, *then* passes control onward. Cramming the next
> pulse onto the same frame Campaign lit would blur "Campaign is live" into
> "control already left" — the viewer couldn't tell the run paused at Campaign at
> all. The small gap is the run *visiting* each block.

### (d) Inside the container: pill blip and the pulse to Call

```ts
pillBlip  = Math.min(c(2.5, 2.7), c(3.0, 3.3, 1, 0))   // inner Start pill blips
pulsePill = c(2.8, 3.5, 0, 1, EASING.inOut)             // pulse pill → Call
pillHi    = c(3.2, 3.6)                                  // pill-edge heats
callLive  = t >= 3.45                                    // Call live ring — LATCHED
```

The inner Start pill blips (up-hold-down: up **2.5→2.7**, down **3.0→3.3**) — the
container's own start kicking off its instances. Then a pulse rides the pill→Call
edge over **2.8→3.5** (eased), the edge heats **3.2→3.6**, and Call's live ring
latches at **3.45**.

> *"Why does the container have its own inner Start pill that blips?"* Because a
> Parallel container *is* a sub-workflow — it has its own entry. The product draws
> an inner Start pill inside the container, and at runtime that pill is what kicks
> off each instance. Blipping it says "the container's own run started" — the same
> blip grammar as the outer Start, scaled down to the inner scope. It's product-
> true: control entered the container, and the container started its lane.

### (e) The fan — `fan = c(3.6, 5.0, 0, 1, EASING.inOut)`

The headline beat. `fan` ramps **3.6s → 5.0s**, eased `inOut`, driving
`ghostTop`/`ghostHandleY` for both ghost pairs. Over those 1.4 seconds the two
ghost Call+Log pairs separate from behind the real lane — one rising above, one
dropping below — their wires fanning with them, their opacity coming up with
`fan`. The single lane becomes three.

> *"Why does the fan start at 3.6, right as Call goes live at 3.45?"* Because the
> fan *is* the lane going live, distributed. Call lights (3.45) — the instance is
> running — and the fan opens (3.6) as the container spawns the parallel copies.
> They're nearly simultaneous on purpose: the lane coming alive and the lane
> multiplying are one event, "the parallel distributed."
>
> *"Why 1.4 seconds — why not snap it open?"* Because the fan is the scene's
> spectacle and the move that teaches "this is a parallel." A snap would read as a
> cut, not a distribution; the eye wouldn't trace the instances separating from
> the original. 1.4s eased `inOut` lets them *grow apart* — you see two new lanes
> emerge from the one, which is exactly the mental model (one authored lane, fanned
> at runtime). Long enough to read the multiplication, short enough to stay
> energetic.
>
> *"Why `inOut` and not `out`?"* The ghosts are *travelling* from one position to
> another (behind-the-lane → fanned), not entering from nothing — so it's a
> transform, and transforms get `inOut`. They ease out of the stack and settle
> into their slots.

### (f) The tag glows again — `tagGlow = Math.min(c(3.9, 4.3), c(5.4, 6.0, 1, 0))`

While the items distribute, the `<parallel.currentItem>` tag glows once more: up
**3.9→4.3**, hold, down **5.4→6.0**, released before the cut.

> *"Why glow the tag again — it already glowed in scene 1?"* Different purpose.
> In scene 1 the glow *introduced* the reference (this is the wiring). Here it
> glows *as the fan opens*, so it reads as the reference *doing its job*:
> `<parallel.currentItem>` is what makes each instance dial a different number, and
> lighting it exactly while the lane multiplies says "that reference is why one
> lane becomes three." Same token, different sentence — scene 1: "here's the
> wiring"; scene 2: "and here's the wiring working."

### (g) The hold — ~6.2s to 7.5s

After the camera settles at home (6.2) and the tag releases (6.0), the live
fanned chain rests for ~1.3s.

> *"What's holding during this hold — isn't the run mid-flight?"* Yes, and that's
> what makes the hold work. Campaign, container, and Call all have *latched* live
> rings — the frame is alive, the run is in progress. A hold on a live state is
> tense, not dead: the blue rings say "still going, calls are about to connect,"
> which carries the narration. And because the live state is *latched* (rings held,
> not mid-transition) and the fan has fully opened to `fan=1` (the ghosts are at
> rest in their fanned slots), the scene can be cut away at any frame — every
> animated value has settled. The quiet gate (`q`) is live but there are still no
> panels to settle, so the gate's effect is invisible here; it's the *latched
> state*, not the gate, that makes this hold safe.

## How to think about the whole scene

Walk the events in causal order:

1. *What starts a run?* Start fires → a brief selection blip (0.3–0.8), closed
   window because firing is instant.
2. *What does firing do?* Passes control down the wire → a `PathPulse` on edge 1,
   eased `inOut`, the edge heating as it crosses, Campaign latching live as it
   lands.
3. *And onward?* The same grammar to the container (pulse 2, edge 2 heat,
   container latches live).
4. *What does the container do?* Starts its own lane → inner pill blips, pulse to
   Call, Call latches live.
5. *What makes this a parallel?* The lane fans → two ghost pairs separate above
   and below the real lane (3.6–5.0), the `<parallel.currentItem>` tag glowing as
   the items distribute.
6. *How do I show this is one run on a bigger stage?* Pull the camera back
   (4.2–6.2) *after* the fan starts, revealing the empty aside band.
7. *What's the state at the cut?* Live and fanned → latched rings hold, the fan
   rests at `fan=1`, ready for the calls to be born.

Each beat is one link, sequenced not stacked: blip (0.3) → pulse+ring (0.5–2.25)
→ inner pill+Call (2.5–3.45) → fan (3.6–5.0) → camera reveal (4.2–6.2) → hold.
Every idea gets its air before the next begins.

## Exit state (what scene 3 inherits)

`run live (Campaign, container, Call latched-on blue rings) · the fan fully open
(fan = 1; two ghost Call+Log pairs at rest in their fanned slots above and below
the real lane, wires fanned) · the <parallel.currentItem> tag released (by 6.0s)
· all transient pulses/blips absorbed · aside band empty (no panels, no table) ·
camera at CAM_HOME (s 0.8), the whole stage in frame including the empty band
below`.

This is the `S2_THE_RUN_FIRES` preset. Scene 3 spreads `S3_CALLS_CONNECT`, which
*starts from* `...S2_THE_RUN_FIRES` (it inherits all the run state and the fan)
and only adds the panels being born and the table appearing. Because scene 3's
frame-0 state equals this exit and both scenes render the same `<Stage/>`, the
boundary is identical down to the pixel — the live fanned chain carries, and the
only thing that changes after the cut is the aside band coming to life below it.
