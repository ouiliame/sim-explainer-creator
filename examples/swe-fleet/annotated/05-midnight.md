# Scene 5 — `midnight`  ·  archetype: **run + freeze-cut OUT**

Source: `../source/scenes/MidnightScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the scene where the video's *one run* begins. Everything before
it was setup — the backlog table, the fleet chain assembling, the
parallel reference, the deploy that arms the clock. This is the hour
striking. Read it as the worked example for "how do I make a workflow
*go* without lying about how it goes," because almost every choice here
is a constraint about honesty: nothing moves that the product wouldn't
actually move, in the order it would actually move it.

---

## What this scene is for

Scenes 1–4 built a machine and left it armed — a `backlog` table over the
chain `Schedule → Get Issues → Fleet`, the schedule deployed and waiting.
Scene 5 fires it. The whole job is to show **one scheduled traversal** of
the chain as a single causal sequence: the clock fires *itself*, that fire
runs the query, the query reads every open issue out of the backlog, and
the whole batch arrives at the fleet container's door. The video's
remaining run (scenes 6–8) all live *inside* the moment this scene ends
on, so scene 5 has a second, structural job: it has to **end mid-run, on a
live state, and hand that live state across the cut**. That's the
freeze-cut, and it's the reason this scene's archetype is "run + freeze-cut
OUT" rather than just "run."

So the rule is still *one idea per scene* — the idea is "at midnight the
clock fires, the query pulls every open issue, and the whole batch heads
into the fleet" — but this scene carries more machinery than any before
it, because a run is a chain of events and you have to draw every link.

## What it looks like

The whole set piece is on screen at neutral framing — backlog table on
top, the `Schedule → Get Issues → Fleet` chain below. The Schedule block's
ring lights up **on its own** — no pulse arrives at it from anywhere — and
at the same instant the armed pill's `Next:` value dips `Mar 18 →
Mar 19`. A streak of light travels left-to-right along edge 1 into Get
Issues; Get Issues goes live. As it does, all five backlog rows light
top-to-bottom as a single product selection — the query *reading* the open
issues it's about to hand the fleet. That selection releases as a second
streak crosses edge 2 into the Fleet container, and the container's live
ring comes on — and **stays on through the cut into scene 6.**

## The run grammar — read this before the beats

This scene is the first time the full run vocabulary is on screen at once,
so it's worth stating the three rules it obeys, because every later run
scene (the fan, the one engineer) obeys them too:

1. **A `WirePulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a streak of blue light, nothing more — not a value, not a
   row, not a payload. A wire firing means "control passed from this block
   to the next," full stop.
2. **Values never ride wires. They resolve *in place*, in rows and cells.**
   When something resolves, it resolves where it *lives* — the pill's
   `Next:` flip happens on the pill; the row selection happens on the
   table; never as a floating chip drifting down a connector.
3. **State is shown in the product's own language** — a blue live ring, a
   green ok ring, a selection outline — never a word like "RUNNING" stamped
   on screen.

If you internalize those three, the entire scene decodes: a ring is state,
a streak is control passing, a selected row is where a value lives.

> *"Why be this strict — wouldn't a little row flying down the wire into
> the container read faster?"* It would read faster and teach a lie. In
> Sim, the edge between two blocks is execution order; the rows flow by
> *reference* — the container's `Parallel Items` is literally
> `<getissues.rows>` (you saw that reference in scene 3), resolved where
> it's used, not pushed down the wire. A row sliding along the connector
> would tell the viewer the product passes data along edges, which it
> doesn't. The grammar isn't decoration — it's the load-bearing claim
> about how the product works, and breaking it for a flashier frame is
> exactly the kind of slop this series exists to avoid.

## The one set piece, again

As in every scene, this renders the *single* `<Stage/>` — the same backlog
table, the same chain, the same container, the same armed pill — and
differs only in state props and camera. Nothing is mounted or unmounted at
the cut; the chain that was idle in scene 4 is the same chain that fires
here. That's why the `4→5` boundary is identical down to the pixel: scene
4 left the pill armed reading `Mar 18` with the chain idle, and scene 5
opens on exactly that frame before anything fires.

One detail to call out in the call site: `lanes={{2: {}}}`. The followed
coding lane (Engineer → GitHub → Mark Done) is rendered the whole time,
sitting compact inside the container body behind the Start pill — `fan`
defaults to `0`, so it's the single un-fanned lane. It does nothing in
this scene; it's present so that when scene 6 fans it open, the lane was
*already there* and only its siblings have to emerge. Rendering it now is
the same continuity insurance as rendering hidden blocks in scene 1.

## The camera

```ts
cam = CAM_ALL = { px: 1395, py: 740, s: 0.7 }
```

The camera does **not move** in this scene. It sits at `CAM_ALL`, the
video's home framing — the whole set piece (table + chain) centered at
`0.7×`.

> *"Why hold the camera still through the scene where the most is
> happening?"* Because the *content* is moving — a ring, a date swap, two
> pulses, a five-row sweep — and the viewer needs a fixed frame to read
> that motion against. If the camera also moved, you'd have motion-on-motion
> and the eye couldn't tell what's the event and what's the lens. The rule
> of thumb across the build: **move the camera between scenes, not during
> the ones where the diagram itself is doing the work.** Scene 6 *will*
> move the camera (it pushes onto the container) — but it moves *first*
> (camera settles by ~1.8s), *then* the fan opens (~2.4s). Here the run is
> the event, so the camera gets out of its way.
>
> *"Why `CAM_ALL` and not something tighter on the chain?"* Because the
> chain-to-table sync is the whole point of the scene, and that sync spans
> the *full* set piece — the query is down in the chain, the row selection
> is up in the table. The choreography note is explicit: "both surfaces
> (table top, chain bottom) must be in frame because the whole scene is a
> two-surface sync." You need both in frame at once or you can't see the
> one thing this scene is about: the query reading the backlog.

## Beat 1 — the self-fire (the heart of the scene)

```ts
const schedLive = t >= 1.0 && t < 2.6;   // Schedule ring, no incoming pulse
const pillSwap = ramp(t, 1.3, 1.8);      // Next: Mar 18 → Mar 19
```

The Schedule block's live ring is a plain boolean window: on from **1.0s**
to **2.6s**. And — this is the entire teaching point — **nothing arrives at
the Schedule from anywhere.** There is no `pulse0`, no incoming edge, no
streak feeding into it. It simply lights.

> *"Why no incoming pulse — every other block in this scene gets one?"*
> Because a schedule **fires itself.** That's what a schedule *is*: it has
> no upstream block, no trigger you can point at. Look at the Stage: the
> Schedule block is rendered with `hideTargetHandle` — it has no left-side
> handle at all, precisely because nothing can wire *into* it. The hour
> comes, and it goes. If you drew a pulse arriving at the Schedule, you'd
> be answering "what triggered the run?" with "something off-screen did" —
> which is false, and which quietly undermines the whole *armed-and-
> unattended* premise scene 4 set up (the script's beat intent: "the fleet
> runs at midnight whether or not anyone is online"). The absence of an
> incoming pulse is not a thing we forgot to animate; it is the scene's
> central claim, drawn as a negative. **"Nothing arrives from anywhere" is
> the point.**

In sync with the ring lighting, the pill's `Next:` value dip-swaps from
`Mar 18` to `Mar 19`:

```ts
<DipSwap a={NEXT_BEFORE} b={NEXT_AFTER} mix={swap} />
// NEXT_BEFORE = "Mar 18, 12:00 AM"   NEXT_AFTER = "Mar 19, 12:00 AM"
```

`DipSwap` shows `a` while `mix < 0.5` and `b` once `mix ≥ 0.5`, and fades
its own opacity to zero at the `0.5` midpoint so the old value *dips out*
and the new value *dips in* through a brief blank — never a hard cut
between two strings. Driven by `pillSwap = ramp(t, 1.3, 1.8)`, the swap
completes over `1.3 → 1.8s`, landing the new date just after the ring
appears.

> *"Why does the pill's date move at the same moment the ring fires?"*
> Because they are **two surfaces showing one event.** A schedule firing
> and a schedule re-arming for the next day are the same act — it fires
> *and* computes its next run in the same tick. The ring says "it fired";
> the `Next:` flip says "and it's already armed again for tomorrow night."
> Two faces of the single fact "the clock struck," shown synchronously so
> the viewer reads them as one event, not two. This is the *self-fire +
> pill dip-swap* move, and it's the cleanest way to say "scheduled"
> without a word on screen.
>
> *"Why `Mar 18 → Mar 19`, and why exactly one day?"* Both values are
> grounded in the block's own config, not chosen for the animation. The
> Schedule rows read `Run Frequency: Daily · Time: 12:00 AM` (`SCHED_ROWS`),
> and `SCHED_PHRASE = "At 12:00 AM"` is the cronstrue rendering of that
> daily-at-midnight schedule. `Mar 18, 12:00 AM → Mar 19, 12:00 AM` is one
> day's advance — the literal next two fire times of a *daily* schedule.
> If the block said "Hourly," the swap would advance an hour instead. The
> numbers fall out of the configured schedule.
>
> *"Why 1.3–1.8 — why is the swap a beat *after* the ring at 1.0?"* The
> ring is the cause (the hour struck); the re-arm is the consequence (so
> tomorrow's run is scheduled). The ~0.3s lead lets the eye land on the
> ring first, then catch the date advancing — cause then effect, even at
> this tiny scale. Firing them on the exact same frame would blur the two
> into one undifferentiated flash. The choreography spells this out: "0.3s
> after the ring: fired and instantly re-armed, shown as one micro-beat."

## Beat 2 — the pulse crosses edge 1 into Get Issues

```ts
const pulse1  = ramp(t, 2.3, 3.0, EASING.inOut);      // streak travels the wire
const edge1Hi = pulseWindow(t, 2.3, 2.7, 4.2, 4.7);   // wire heats while live
const queryLive = t >= 2.9 && t < 5.9;                // Get Issues live ring
const queryOk   = t >= 5.9 && t < 7.6;                // → green ok ring
```

A `WirePulse` is mounted on edge 1 (Schedule → Get Issues) and its
progress `p` runs `0 → 1` over `2.3 → 3.0s`, eased `inOut`. The streak
emerges from the Schedule's source handle, travels the wire, and is
absorbed at Get Issues' target handle. In the Stage it's mounted only
while it's actually traveling — `pulse1 > 0 && pulse1 < 1` — so the
`WirePulse` element doesn't even exist before it departs or after it
lands; it vanishes the instant it arrives. The wire itself *heats*
underneath the streak — `edge1Hi` ramps the edge color from the dim `wire`
grey toward the bright `secondary` blue via `interpolateColors`, and
thickens it from `2.25` to `3.5px` (`2.25 + 1.25 * hi`) — over `2.3 →
2.7`, holds, then cools back down over `4.2 → 4.7`. As the streak lands,
Get Issues' live ring comes on (`queryLive`, from `2.9`), and once the
read completes it flips to a green `ok` ring (`queryOk`, `5.9 → 7.6`).

> *"Why does the pulse fire at 2.3 when the ring lit at 1.0?"* The
> self-fire beat (ring + date swap) needs its own air to read as "the
> clock struck" before the consequence travels. Stack the pulse onto the
> ring and the two ideas — *the clock fired* and *that fire ran the query*
> — collapse into one muddy moment. The ~1.3s gap is the causal beat:
> strike, *then* pull.
>
> *"Why `EASING.inOut` on the pulse instead of linear?"* Because the streak
> is a thing *traveling through space* — it has momentum. `inOut` gives it
> a gentle accelerate-then-decelerate, so it leaves the source handle
> softly and settles into the target rather than arriving at a hard stop.
> (Compare a plain opacity fade, left linear precisely *because* nothing
> travels — only opacity changes. Easing is for things that move.) This is
> the project's consistent rule: `inOut` for transforms and travel, `out`
> for entrances, `in` for exits.
>
> *"Why is `edge1Hi` a separate `pulseWindow` from `pulse1` — couldn't one
> value do both?"* No, because they describe different lifetimes. The
> *streak* is a quick traversal (`2.3 → 3.0`, then gone). The *heat* on the
> wire should linger while the downstream block is actively running and
> only cool once the read is done — hence it holds from `2.7` all the way
> to `4.2` before fading. A streak is an instant; "this wire is on the live
> path" is a duration. Two timings, two drivers.
>
> *"Why `queryLive` then `queryOk` — two rings?"* Same product grammar as
> every block: blue while it's working, green when it succeeded. Get Issues
> is *live* while it's reading the table (`2.9 → 5.9`), then settles *ok*
> (`5.9 → 7.6`) once the rows are in hand. In the call site that's
> `state: queryOk ? "ok" : "none"` riding alongside `highlighted:
> queryLive` — the highlight is the blue working ring, the `ok` state is
> the green done ring. The color carries the state; no "DONE" label needed.

## Beat 3 — the chain-to-table sync (the query reads the backlog)

This is the scene's signature move and the one most worth copying. While
Get Issues is live, all five backlog rows light top-to-bottom as a
**single product selection range** — the query reaching up and reading the
very rows it's about to hand the fleet.

```ts
const rangeHi = (r: number) =>
    Math.min(
        ramp(t, 3.2 + r * 0.14, 3.7 + r * 0.14),   // sweep in, 0.14s/row stagger
        1 - ramp(t, 5.9, 6.5),                      // release as ONE at 5.9–6.5
    );
const cellHi = (_c: number, r: number) =>
    (r < TABLE_ROWS ? rangeHi(r) : 0);
```

Each row's highlight ramps up over its own `0.5s` window, staggered `0.14s`
per row — row 0 lights over `3.2 → 3.7`, row 1 over `3.34 → 3.84`, and so
on down to row 4 (lighting through ~`4.26`). The whole sweep takes about
`0.56s`. The `Math.min` against `1 − ramp(t, 5.9, 6.5)` means every row, no
matter when it lit, **releases together** over `5.9 → 6.5`. Feeding
`SimTable`'s `cellHighlight` a non-zero value across a contiguous block of
cells makes it draw the product's real `--selection` outline around that
block — one selection sweeping the backlog, not five separate boxes.

The crucial detail here — and the one place this scene differs from its
market-desk twin — is the **column gate, or rather the lack of one.** The
first argument to `cellHi` is `_c`: the column is *ignored*. Every column
of every row lights. The whole row is selected, `issue · status · pr`
across.

> *"Why light the whole row here, when the twin scene lit only two of its
> columns?"* Because the two scenes are reading two different things, and
> the selection has to tell the truth about *which*. In market-desk, the
> Polymarket pull only *returned* two pre-seeded columns (market + odds);
> the other three were values the desk hadn't computed yet, so lighting
> them would have claimed a confirmation that hadn't happened. Here, Get
> Issues runs a `Query Rows` operation with `Filter: status = 'open'`
> (`QUERY_ROWS`) — it returns **whole rows**, the complete open-issue
> records. The selection is the query's *result set*: every row whose
> `status` is `open`, selected in full. Lighting the entire row is the
> honest depiction of "the query matched these five records." The verb is
> *select rows*, so the selection is *rows*, not a sub-range of columns.
>
> *"But the `status` and `pr` cells still hold `open` / empty — isn't
> selecting them odd?"* No — selecting a row is not the same as writing to
> it. The selection says "this record matched and is in the result set";
> the *contents* are still `open` (and the PR column still empty). The
> query reads what's there; it doesn't change it. That a row can be
> *selected* while still reading `open` is exactly right: the work that
> flips it to `done` happens later, downstream, in scene 7 when an analyst
> actually finishes. The selection is the read; the flip is the write.
>
> *"Why `0.14s` per row — where does that come from?"* It's the scene's
> chosen sweep cadence, fast enough that the five rows read as one
> connected *sweep* rather than five separate selections, slow enough that
> you can feel direction (top-to-bottom — the query scanning down the
> table). It deliberately differs from scene 1's `0.35s` row stagger. The
> choreography is explicit about *why*: "much faster than scene 1's 0.35s:
> this is a machine selecting, not a narrator pointing." Scene 1 was
> *populating* a table — each row a distinct arrival you should land on.
> This is a query *scanning* an existing one — a single machine gesture
> passing over it. Different verb, faster cadence.
>
> *"Why release all five at once instead of un-staggering them?"* Because
> the *release* isn't a per-row event — it's the single fact "the query
> moved on." The whole selection lets go as one because one thing caused
> it: control leaving Get Issues and heading into the container (beat 4). A
> staggered release would imply each row finished on its own clock, which
> isn't what happened — they were one selection, so they release as one.
>
> *"Why is this 'synchrony only' and not data moving from chain to table?"*
> No value crosses from Get Issues to the table here — the table cells'
> *contents* don't change at all (`backlogRows` is called with no
> `flipMix`, so every row stays `issue` / `open` / empty-PR). What's
> synchronized is *timing*: the selection is alive exactly while Get Issues
> is live (`2.9 → 5.9`), and dies when the read moves on. There are **no
> connector lines** drawn between the block and the table — the
> choreography insists on this. The sync is a temporal rhyme — "these two
> surfaces are part of the same event" — not a data transfer. The grammar
> holds: nothing rode the wire.

## Beat 4 — the pulse crosses edge 2 into the container

```ts
const pulse2  = ramp(t, 6.0, 6.7, EASING.inOut);      // streak into the container
const edge2Hi = pulseWindow(t, 6.0, 6.4, 7.7, 8.2);   // edge 2 heats
const contLive = t >= 6.6;                             // container live ring — LATCHED
```

A second `WirePulse` rides edge 2 (Get Issues → the Fleet container) over
`6.0 → 6.7`, again eased `inOut`, with edge 2 heating over `6.0 → 6.4` and
cooling over `7.7 → 8.2`. Notice the timing lock: the table selection
releases over `5.9 → 6.5`, and `pulse2` departs over `6.0 → 6.7`. **The
range releases *as* the pulse leaves** — the selection lets go because
control is moving on, the two events interleaved so the viewer reads cause
(pulse departs) and effect (selection releases) as a single hand-off. The
choreography frames it as the data visibly *leaving* the table and heading
into the container: the read finishes, the result moves.

When the streak lands, the container's live ring comes on at `t >= 6.6` —
and this one has **no upper bound.** Every other state window in the scene
is a closed interval (`schedLive` ends at `2.6`, `queryLive` at `5.9`,
`queryOk` at `7.6`); this one is open. The container is live from `6.6s`
to the end of the scene and *beyond the cut.*

> *"Why is `contLive` latched open while every other ring is a closed
> window?"* Because this is the **freeze-cut carry** — the one piece of
> live state the scene is built to hand forward. The Schedule fired and
> finished; Get Issues read and went green; both are *done*. But the
> container is *not* done — the batch has only just arrived at its door;
> the actual work (the fan, the five engineers, the one lane) happens in
> scenes 6–8, which all play *inside this live moment.* So the container's
> ring must not revert. It latches on and stays on across the boundary.

## What a freeze-cut is, and why hold state across the boundary

A **freeze-cut** is a hard cut between two scenes where the *visual state
is identical on both sides* — the last frame of scene 5 and the first
frame of scene 6 are the same picture — but the camera and the action then
diverge. Scene 6 opens on the held frame (container live, batch arrived)
and *then* starts moving: the camera pushes onto the container, the lane
fans out. The cut is invisible because nothing jumps; the continuation is
what tells you a cut happened.

> *"Why hold state across the cut instead of just letting scene 6 set it up
> again?"* Two reasons, one structural and one about honesty.
> **Structurally:** the run is *one continuous event.* The script's whole
> macro arc is "the WHOLE REST OF THE VIDEO is that one run seen at three
> scales: the fire, the fan, one engineer." The clock fired *once*; that
> single fire is still propagating through scenes 6, 7, and 8. If scene 5
> reverted the container ring at its end and scene 6 re-lit it, you'd be
> drawing *two* runs — fire, stop, fire again — when the truth is one run
> seen at three scales. The video's stated run economy is **Run count: 1**;
> a reverted-and-relit ring would visually break that count. Holding the
> live state across the boundary is what makes the four scenes read as a
> single traversal rather than four restarts. **For continuity:** because
> both scenes render the same `<Stage/>` and scene 6 simply *inherits* the
> latched `contLive`, the boundary is identical by construction — there's
> no chance of a one-frame flicker where the ring blinks off and back on.
> The freeze-cut isn't a trick you perform; it's the natural consequence of
> *not reverting* a state that the next scene needs.

This is also why the scene ends on a **latched-settle hold** (from `8.2s`
to the scene's end, ~5s of the scene's ~13.3s span): once the container
ring is on and the pill reads `Mar 19`, nothing else moves. The
choreography defends this hold against the "dead air" objection directly:
it's "technically static, but it's a held QUESTION (the batch is inside,
unresolved), which reads as tension rather than dead air." The held frame
*is* the state scene 6 inherits. A scene that ends on a settled, latched
state can be stretched to fit narration without freezing any motion
mid-flight — and, here, can be cut away from at any frame without losing
the live state, because the live state is latched rather than
mid-animation.

## The values, and where they all trace to

Everything on screen comes from `data.ts` — no value is invented in the
scene file:

| surface | value | source |
|---|---|---|
| Schedule rows | `Run Frequency: Daily` · `Time: 12:00 AM` | `SCHED_ROWS` |
| pill (before) | `At 12:00 AM · Next: Mar 18, 12:00 AM` | `SCHED_PHRASE`, `NEXT_BEFORE` |
| pill (after) | `At 12:00 AM · Next: Mar 19, 12:00 AM` | `SCHED_PHRASE`, `NEXT_AFTER` |
| Get Issues rows | `Operation: Query Rows` · `Filter: status = 'open'` | `QUERY_ROWS` |
| table (unchanged) | 5 issues; status `open`; pr empty | `ISSUES` via `backlogRows` |

The table contents do **not** change in this scene — `flipMix` is never
passed to the Stage, so `backlogRows` writes `open` for every status and
an empty string for every PR (the text only switches at `mix ≥ 0.5`, and
`mix` is always `0` here). The selection sweep lights rows; it doesn't fill
them. The filling starts in scene 7, when one engineer actually finishes
and its row flips `open → done` with a PR number. Keeping the cells
unchanged here is the same honesty rule that governs the whole series: **a
table cannot show a value the run hasn't produced.** The query *reads* the
backlog; it doesn't *write* it.

## How to think about the whole scene

Walk the events in causal order and the scene is just the run, drawn
truthfully:

1. *What starts a scheduled run?* The schedule, by itself → a ring with
   **no incoming pulse** (the block has no target handle to receive one),
   plus the `Next:` date advancing a day. The self-fire.
2. *What does that fire do?* Passes control down the wire → a `WirePulse`
   on edge 1, Get Issues goes live.
3. *What did the query get?* Every open issue → a selection sweep over
   **whole rows** (the query returns records, so the whole record lights),
   in sync with Get Issues being live. The query reading the backlog.
4. *Where does control go next?* Into the fleet → a second `WirePulse` on
   edge 2, the selection releasing as it departs.
5. *What's the run's state at the cut?* The batch is at the container and
   the work is about to start → the container's live ring **latches on and
   holds through the cut.**

Every one of those is a link in one causal chain, and the discipline of
the scene is drawing each link in the product's own grammar — ring for
state, streak for control passing, in-place row selection for the read —
and *never* breaking the rule that wires carry light, not cargo. The scene
is charged and busy, but it isn't *cluttered*, because each beat is one
link and the links are sequenced, not stacked.

## Exit state (what scene 6 inherits — a freeze-cut carry)

`container live ring ON (latched, carries across the cut) · pill reads
"Next: Mar 19, 12:00 AM" (swap landed) · table selection released · table
cells unchanged (issue / status open / pr empty) · Schedule and Get Issues
settled (Get Issues green ok) · fan = 0 (still one un-fanned lane, rendered
behind the Start pill) · camera at CAM_ALL`.

This is a **freeze-cut**: scene 6 opens on this exact frame — the held live
moment — and the carried state is the **container's live ring.** Scene 6
does not re-establish that the run is happening; it inherits a run already
in flight and continues it, pushing the camera onto the container before
fanning the lane five wide. Because both scenes render the same set piece
and scene 6 simply keeps `contLive` latched, the boundary is identical down
to the pixel.
