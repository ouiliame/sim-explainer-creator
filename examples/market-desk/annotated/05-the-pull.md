# Scene 5 — `the-pull`  ·  archetype: **run + freeze-cut OUT**

Source: `../source/scenes/ThePullScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the scene where the video's *one run* begins. Everything before it
was setup — the board, the desk assembling, the reference, the arming. This
is the hour striking. Read it as the worked example for "how do I make a
workflow *go* without lying about how it goes," because almost every choice
here is a constraint about honesty: nothing moves that the product wouldn't
actually move, in the order it would actually move it.

---

## What this scene is for

Scenes 1–4 built a machine and left it armed. Scene 5 fires it. The whole
job is to show **one scheduled traversal** of the chain —
Schedule → Polymarket → Desk container — as a single causal sequence: the
clock fires *itself*, that fire pulls the markets, and the whole batch
arrives at the desk's door. The video's remaining run (scenes 6–8) all live
*inside* the moment this scene ends on, so scene 5 has a second, structural
job: it has to **end mid-run, on a live state, and hand that live state
across the cut**. That's the freeze-cut, and it's the reason this scene's
archetype is "run + freeze-cut OUT" rather than just "run."

So the rule is still *one idea per scene* — the idea is "the hour strikes
and the batch heads into the desk" — but this scene carries more
machinery than any before it, because a run is a chain of events and you
have to draw every link.

## What it looks like

The whole desk is on screen at neutral framing. The Schedule block's ring
lights up **on its own** — no pulse arrives at it from anywhere — and at the
same instant the armed pill's `Next:` value flips `3:00 PM → 4:00 PM`. A
streak of light travels left-to-right along edge 1 into Polymarket;
Polymarket goes live. As it does, the five `market` and `odds` cells light
top-to-bottom as a single product selection — the pull *confirming* the
board it's about to price. That selection releases as a second streak
crosses edge 2 into the Desk container, and the container's live ring comes
on — and **stays on through the cut into scene 6.**

## The run grammar — read this before the beats

This scene is the first time the full run vocabulary is on screen at once,
so it's worth stating the three rules it obeys, because every later run
scene obeys them too:

1. **A `WirePulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a streak of blue light, nothing more — not a value, not a
   record, not a payload. A wire firing means "control passed from this
   block to the next," full stop.
2. **Values never ride wires. They resolve *in place*, in rows and cells.**
   When a number appears, it appears in the table cell or block row where it
   *lives* — never as a floating chip drifting down a connector. (The pill's
   `Next:` flip and the table's selection sweep are both in-place events.)
3. **State is shown in the product's own language** — a blue live ring, a
   green ok ring, a selection outline — never a word like "RUNNING" stamped
   on screen.

If you internalize those three, the entire scene decodes: a ring is state,
a streak is control passing, a cell is where a value lives.

> *"Why be this strict — wouldn't a little number flying down the wire read
> faster?"* It would read faster and teach a lie. In Sim, the edge between
> two blocks is execution order; the data flows by *reference*
> (`<polymarket.markets>`), resolved where it's used. A value sliding down a
> wire would tell the viewer the product passes data along edges, which it
> doesn't. The grammar isn't decoration — it's the load-bearing claim about
> how the product works, and breaking it for a flashier frame is exactly the
> kind of slop this series exists to avoid.

## The one set piece, again

As in every scene, this renders the *single* `<Stage/>` — the same table,
the same chain, the same container, the same pill — and differs only in
state props and camera. Nothing is mounted or unmounted at the cut; the
chain that was idle in scene 4 is the same chain that fires here. That's why
the `4→5` boundary is identical down to the pixel: scene 4 left the pill
armed at `3:00 PM` with the chain idle, and scene 5 opens on exactly that
frame before anything fires.

## The camera

```ts
cam = CAM_ALL = { px: 1200, py: 735, s: 0.78 }
```

The camera does **not move** in this scene. It sits at `CAM_ALL`, the
video's home framing — the whole set piece (table + chain) centered at
`0.78×`.

> *"Why hold the camera still through the scene where the most is
> happening?"* Because the *content* is moving — a ring, a swap, two
> pulses, a five-row sweep — and the viewer needs a fixed frame to read that
> motion against. If the camera also moved, you'd have motion-on-motion and
> the eye couldn't tell what's the event and what's the lens. The rule of
> thumb across the build: **move the camera between scenes, not during the
> ones where the diagram itself is doing the work.** Scene 6 *will* move the
> camera (it leans onto the container) — but it moves *first*, then the fan
> opens. Here the run is the event, so the camera gets out of its way.
>
> *"Why `CAM_ALL` and not something tighter on the chain?"* Because the
> chain-to-table sync is the whole point of the scene, and that sync spans
> the *full* set piece — the pull is down in the chain, the confirmation
> sweep is up in the table. You need both in frame at once or you can't see
> the one thing this scene is about: the pull confirming the board.

## Beat 1 — the self-fire (the heart of the scene)

```ts
const schedLive = t >= 1.0 && t < 2.5;   // Schedule ring, no incoming pulse
const pillSwap = ramp(t, 1.3, 1.8);      // Next: 3:00 PM → 4:00 PM
```

The Schedule block's live ring is a plain boolean window: on from **1.0s**
to **2.5s**. And — this is the entire teaching point — **nothing arrives at
the Schedule from anywhere.** There is no `pulse0`, no incoming edge, no
streak feeding into it. It simply lights.

> *"Why no incoming pulse — every other block in this scene gets one?"*
> Because a schedule **fires itself.** That's what a schedule *is*: it has
> no upstream block, no trigger you can point at — `hideTargetHandle` is set
> on the Schedule block precisely because nothing can wire *into* it. The
> hour comes, and it goes. If you drew a pulse arriving at the Schedule,
> you'd be answering the question "what triggered the run?" with "something
> off-screen did" — which is false and which quietly undermines the whole
> *armed-and-unattended* premise the previous scene set up. The absence of
> an incoming pulse is not a thing we forgot to animate; it is the scene's
> central claim, drawn as a negative. **"Nothing arrives from anywhere" is
> the point.**

In sync with the ring lighting, the pill's `Next:` value dip-swaps from
`3:00 PM` to `4:00 PM`:

```ts
<DipSwap a={NEXT_BEFORE} b={NEXT_AFTER} mix={swap} />
// NEXT_BEFORE = "Jun 12, 3:00 PM"   NEXT_AFTER = "Jun 12, 4:00 PM"
```

`DipSwap` shows `a` while `mix < 0.5` and `b` once `mix ≥ 0.5`, and fades
its own opacity to zero at the `0.5` midpoint (`|mix − 0.5| · 4`) so the old
value *dips out* and the new value *dips in* through a brief blank — never a
hard cut between two strings. Driven by `pillSwap = ramp(t, 1.3, 1.8)`, the
swap completes over `1.3 → 1.8s`, landing the new value just after the ring
appears.

> *"Why does the pill's clock move at the same moment the ring fires?"*
> Because they are **two surfaces showing one event.** A schedule firing and
> a schedule re-arming for the next hour are the same act — it fires *and*
> computes its next run in the same tick. The ring says "it fired"; the
> `Next:` flip says "and it's already armed again for the hour after." Two
> faces of the single fact "the clock struck," shown synchronously so the
> viewer reads them as one event, not two. This is the *self-fire + pill
> dip-swap* move, and it's the cleanest way to say "scheduled" without a
> word on screen.
>
> *"Why `3:00 → 4:00`, and why an hour?"* Both values are grounded in the
> block's own config. The Schedule is `Run frequency: Hourly · Minute: 0`,
> i.e. cron `0 * * * *`. `Every hour` is the cronstrue rendering of that
> expression; `3:00 PM → 4:00 PM` is one hour's advance — the literal next
> two fire times. The numbers aren't chosen for the animation; they fall out
> of the configured schedule. If the block said "every 30 minutes," the swap
> would read `3:00 → 3:30`.
>
> *"Why 1.3–1.8 — why is the swap a beat *after* the ring at 1.0?"* The ring
> is the cause (the hour struck); the re-arm is the consequence (so the next
> one is scheduled). A ~0.3s lead lets the eye land on the ring first, then
> catch the clock advancing — cause then effect, even at this tiny scale.
> Firing them on the exact same frame would blur the two into one
> undifferentiated flash.

## Beat 2 — the pulse crosses edge 1 into Polymarket

```ts
const pulse1 = ramp(t, 2.2, 2.9, EASING.inOut);          // streak travels the wire
const edge1Hi = pulseWindow(t, 2.2, 2.6, 4.0, 4.5);      // wire heats while live
const polyLive = t >= 2.8 && t < 5.5;                    // Polymarket live ring
const polyOk   = t >= 5.5 && t < 7.2;                    // → green ok ring
```

A `WirePulse` is mounted on edge 1 (Schedule → Polymarket) and its progress
`p` runs `0 → 1` over `2.2 → 2.9s`, eased `inOut`. The streak emerges from
the Schedule's source handle, travels the wire, and is absorbed at
Polymarket's target handle. The wire itself *heats* underneath the streak —
`edge1Hi` ramps the edge color from the dim `wire` grey toward the bright
`secondary` blue and thickens it from `2.25` to `3.5px` — over `2.2 → 2.6`,
holds, then cools back down over `4.0 → 4.5`. As the streak lands,
Polymarket's live ring comes on (`polyLive`, from `2.8`), and once the pull
completes it flips to a green `ok` ring (`polyOk`, `5.5 → 7.2`).

> *"Why does the pulse fire at 2.2 when the ring lit at 1.0?"* The self-fire
> beat (ring + clock swap) needs its own air to read as "the clock struck"
> before the consequence travels. Stack the pulse onto the ring and the two
> ideas — *the clock fired* and *that fire pulled the markets* — collapse
> into one muddy moment. The ~1.2s gap is the causal beat: strike, *then*
> pull.
>
> *"Why `EASING.inOut` on the pulse instead of linear?"* Because the streak
> is a thing *traveling through space* — it has momentum. `inOut` gives it a
> gentle accelerate-then-decelerate, so it leaves the source handle softly
> and settles into the target rather than arriving at a hard stop. (Compare
> the table fade in scene 1, which is left linear precisely *because*
> nothing travels — only opacity changes. Easing is for things that move.)
> This is the project's consistent rule: `inOut` for transforms and travel,
> `out` for entrances, `in` for exits.
>
> *"Why is `edge1Hi` a separate pulseWindow from `pulse1` — couldn't one
> value do both?"* No, because they describe different lifetimes. The
> *streak* is a quick traversal (`2.2 → 2.9`, then gone — note `WirePulse`
> returns `null` outside `0 < p < 1`, so it vanishes the instant it lands).
> The *heat* on the wire should linger while the downstream block is
> actively running and only cool once the pull is done — hence it holds from
> `2.6` all the way to `4.0` before fading. A streak is an instant; "this
> wire is on the live path" is a duration. Two timings, two drivers.
>
> *"Why `polyLive` then `polyOk` — two rings?"* Same product grammar as
> every block: blue while it's working, green when it succeeded. Polymarket
> is *live* while it's fetching (`2.8 → 5.5`), then settles *ok*
> (`5.5 → 7.2`) once the markets are in hand. The color carries the state;
> no "DONE" label needed.

## Beat 3 — the chain-to-table sync (the pull confirms the board)

This is the scene's signature move and the one most worth copying. While
Polymarket is live, the five `market` + `odds` cells light top-to-bottom as
a **single product selection range** — the pull reaching up and confirming
the very rows it's about to price.

```ts
const rangeHi = (r: number) =>
    Math.min(
        ramp(t, 3.1 + r * 0.14, 3.6 + r * 0.14),   // sweep in, 0.14s/row stagger
        1 - ramp(t, 5.5, 6.1),                      // release as ONE at 5.5–6.1
    );
const cellHi = (c: number, r: number) =>
    c <= ODDS_COL && r < TABLE_ROWS ? rangeHi(r) : 0;
```

Each row's highlight ramps up over its own `0.5s` window, staggered `0.14s`
per row — row 0 lights over `3.1 → 3.6`, row 1 over `3.24 → 3.74`, and so on
down to row 4. The `Math.min` against `1 − ramp(t, 5.5, 6.1)` means every
row, no matter when it lit, **releases together** over `5.5 → 6.1`. Feeding
`SimTable`'s `cellHighlight` a non-zero value across a contiguous block of
cells makes it draw the product's real `--selection` outline around that
block — one selection sweeping the watchlist, not five separate boxes.

The crucial detail is the column gate: `c <= ODDS_COL`. Only columns 0 and 1
(`market`, `odds`) light. The `agent_est`, `edge`, and `signal` columns stay
completely dark.

> *"Why only `market` and `odds` — why not sweep the whole row?"* Because
> those two columns are **what the Polymarket pull actually returns.**
> `get_markets` gives you the markets and their current crowd odds — that's
> it. The estimate, the edge, and the signal don't exist yet; they're what
> the *desk* will compute, downstream, in the run that's only just begun.
> Lighting `agent_est`/`edge`/`signal` here would claim the pull confirmed
> values it has no way to know. By selecting exactly the pre-seeded columns,
> the sweep says something true and specific: *"the markets Polymarket just
> pulled match the markets on your board"* — the pull confirming the
> watchlist against live data, which is the honest meaning of the beat. The
> three empty columns staying dark is the same planted question from scene 1,
> still unanswered, deliberately.
>
> *"Why `0.14s` per row — where does that come from?"* It's the scene's
> chosen sweep cadence, fast enough that the five rows read as one connected
> *sweep* rather than five separate selections, slow enough that you can feel
> direction (top-to-bottom — the pull arriving and confirming row by row). It
> deliberately differs from scene 1's `0.35s` row stagger: scene 1 was
> *populating* a table (each row is a distinct arrival you should land on);
> this is *sweeping* an existing one (a single gesture passing over it).
> Different verb, faster cadence.
>
> *"Why release all five at once instead of un-staggering them?"* Because
> the *release* isn't a per-row event — it's the single fact "the pull
> moved on." The whole confirmation lets go as one because one thing caused
> it: control leaving Polymarket and heading into the container (beat 4). A
> staggered release would imply each row finished confirming on its own
> clock, which isn't what happened — they were one selection, so they
> release as one.
>
> *"Why is this 'synchrony only' and not data moving from chain to table?"*
> No value crosses from Polymarket to the table here — the table cells'
> *contents* don't change at all (still `market` + `odds`, still three empty
> columns). What's synchronized is *timing*: the table selection is alive
> exactly while Polymarket is live, and dies when the pull moves on. The
> sync is a temporal rhyme — "these two surfaces are part of the same
> event" — not a data transfer. The grammar holds: nothing rode the wire.

## Beat 4 — the pulse crosses edge 2 into the container

```ts
const pulse2 = ramp(t, 5.6, 6.3, EASING.inOut);          // streak into the container
const edge2Hi = pulseWindow(t, 5.6, 6.0, 7.3, 7.8);      // edge 2 heats
const contLive = t >= 6.2;                                // container live ring — LATCHED
```

A second `WirePulse` rides edge 2 (Polymarket → the Desk container) over
`5.6 → 6.3`, again eased `inOut`, with edge 2 heating over `5.6 → 6.0` and
cooling over `7.3 → 7.8`. Notice the timing lock: the table selection
releases over `5.5 → 6.1`, and `pulse2` departs over `5.6 → 6.3`. **The
range releases *as* the pulse leaves** — the confirmation lets go because
control is moving on, the two events interleaved so the viewer reads cause
(pulse departs) and effect (selection releases) as a single hand-off.

When the streak lands, the container's live ring comes on at `t >= 6.2` —
and this one has **no upper bound.** Every other state window in the scene
is a closed interval (`schedLive` ends at `2.5`, `polyLive` at `5.5`); this
one is open. The container is live from `6.2s` to the end of the scene and
*beyond the cut.*

> *"Why is `contLive` latched open while every other ring is a closed
> window?"* Because this is the **freeze-cut carry** — the one piece of live
> state the scene is built to hand forward. The Schedule fired and finished;
> Polymarket pulled and went green; both are *done*. But the container is
> *not* done — the batch has only just arrived at its door; the actual work
> (the fan, the analysts) happens in scenes 6–8, which all play *inside this
> live moment.* So the container's ring must not revert. It latches on and
> stays on across the boundary.

## What a freeze-cut is, and why hold state across the boundary

A **freeze-cut** is a hard cut between two scenes where the *visual state is
identical on both sides* — the last frame of scene 5 and the first frame of
scene 6 are the same picture — but the camera and the action then diverge.
Scene 6 opens on the held frame (container live, batch arrived) and *then*
starts moving: the camera leans in, the lane fans out. The cut is invisible
because nothing jumps; the continuation is what tells you a cut happened.

> *"Why hold state across the cut instead of just letting scene 6 set it up
> again?"* Two reasons, one structural and one about honesty. **Structurally:**
> the run is *one continuous event.* The clock fired once; that single fire
> is still propagating through scenes 6, 7, and 8. If scene 5 reverted the
> container ring at its end and scene 6 re-lit it, you'd be drawing *two*
> runs — fire, stop, fire again — when the truth is one run seen at three
> scales (the pull, the fan, one analyst). Holding the live state across the
> boundary is what makes the four scenes read as a single traversal rather
> than four restarts. **For continuity:** because both scenes render the same
> `<Stage/>` and scene 6 simply *inherits* the latched `contLive`, the
> boundary is identical by construction — there's no chance of a one-frame
> flicker where the ring blinks off and back on. The freeze-cut isn't a
> trick you perform; it's the natural consequence of *not reverting* a state
> that the next scene needs.

This is also why the scene ends on a **latched-settle hold** (from `7.8s` to
the scene's end, ~3.5s): once the container ring is on and the pill reads
`4:00 PM`, nothing else moves. The held frame *is* the state scene 6
inherits. A scene that ends on a settled, latched state can be stretched to
fit narration without freezing any motion mid-flight — and, here, can be
cut away from at any frame without losing the live state, because the live
state is latched rather than mid-animation.

## The values, and where they all trace to

Everything on screen comes from `data.ts` — no value is invented in the
scene file:

| surface | value | source |
|---|---|---|
| Schedule rows | `Run frequency: Hourly` · `Minute: 0` | `SCHED_ROWS` |
| pill (before) | `Every hour · Next: Jun 12, 3:00 PM` | `SCHED_PHRASE`, `NEXT_BEFORE` |
| pill (after) | `Every hour · Next: Jun 12, 4:00 PM` | `SCHED_PHRASE`, `NEXT_AFTER` |
| Polymarket rows | `Get Markets` · `Sort By: Volume` · `Limit: 5` | `POLY_ROWS` |
| table (unchanged) | 5 markets + odds; est/edge/signal empty | `MARKETS` via `boardRows` |

The table contents do **not** change in this scene — `fillMix` is never
passed, so every row stays `market` + `odds` with three empty columns
(`boardRows` writes empty strings until `mix ≥ 0.5`). The selection sweep
lights cells; it doesn't fill them. The filling starts in scene 7, when an
analyst actually finishes. Keeping the cells empty here is the same
honesty rule as scene 1: **a table cannot show a value the run hasn't
produced.** The pull confirms the board; it doesn't price it.

## How to think about the whole scene

Walk the events in causal order and the scene is just the run, drawn
truthfully:

1. *What starts a scheduled run?* The schedule, by itself → a ring with **no
   incoming pulse**, plus the `Next:` clock advancing an hour. The self-fire.
2. *What does that fire do?* Passes control down the wire → a `WirePulse`
   on edge 1, Polymarket goes live.
3. *What did the pull get?* The markets and their odds → a selection sweep
   over **only** the `market` + `odds` columns, in sync with Polymarket
   being live. The pull confirming the board.
4. *Where does control go next?* Into the desk → a second `WirePulse` on
   edge 2, the selection releasing as it departs.
5. *What's the run's state at the cut?* The batch is at the desk and the
   work is about to start → the container's live ring **latches on and holds
   through the cut.**

Every one of those is a link in one causal chain, and the discipline of the
scene is drawing each link in the product's own grammar — ring for state,
streak for control passing, in-place selection for the confirmation — and
*never* breaking the rule that wires carry light, not cargo. The scene is
charged and busy, but it isn't *cluttered*, because each beat is one link
and the links are sequenced, not stacked.

## Exit state (what scene 6 inherits — a freeze-cut carry)

`container live ring ON (latched, carries across the cut) · pill reads
"Next: Jun 12, 4:00 PM" (swap landed) · table selection released · table
cells unchanged (market + odds, three empty columns) · Schedule and
Polymarket settled (Polymarket green ok) · fan = 0 (still one lane) ·
camera at CAM_ALL`.

This is a **freeze-cut**: scene 6 opens on this exact frame — the held live
moment — and the carried state is the **container's live ring**. Scene 6
does not re-establish that the run is happening; it inherits a run already
in flight and continues it, easing the camera onto the container before
opening the runtime fan. Because both scenes render the same set piece and
scene 6 simply keeps `contLive` latched, the boundary is identical down to
the pixel.
