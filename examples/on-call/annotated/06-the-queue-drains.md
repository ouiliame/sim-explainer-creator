# Scene 6 — `the-queue-drains`  ·  archetype: **accelerating cadence (runs 2–6)**

Source: `../source/scenes/TheQueueDrainsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`, `../source/scenes/_beats.ts`.

This is the spectacle scene — the one the whole video builds toward. Scenes 3–5
followed *one* alert mechanistically. Scene 6 runs the other *five* in an
accelerating cadence and drains the status column into a wall of `assigned`. Read
this as the worked example for "how do I show 'the same thing, five more times,
faster' — multiplicity as the payoff — without it reading as five tedious repeats
or a chaotic blur." This is the loved swe-fleet / agent-economy money mechanic
(the queue draining itself), and the technique here is the most reusable thing in
the build.

---

## What this scene is for

A webhook delivers ONE alert per run — so six firing incidents = six runs. Run 1
was the followed run (scenes 3–5). Runs 2–6 are this scene: five compressed
traversals, each one's only narrative content a *different* table row flipping
`firing → triaged → assigned`. The point is **multiplicity**: you've seen the
machine work once, in full; now watch it do the same thing five more times, faster
and faster, until the queue is empty. No single run here repeats run 1's *lesson*
(you already learned how a run works) — each run's only job is to clear one more
row.

So the rule is *one idea per scene*: "every alert gets the same treatment; the
queue drains itself." The discipline is making five runs feel like *one accelerating
process* rather than five separate scenes — which is entirely a matter of how the
cadence is built.

## What it looks like

Steady home framing, no camera move. Five compressed runs fire in sequence, with
*shrinking* gaps between them and each traversal *shorter* than the last — so the
whole thing accelerates. Each run is run 1's traversal in miniature: the webhook
blips, a pulse crosses edge 1, the agent ring pulses live→ok with the three chips
ringing in quick rhythm, three lights fan out, the three terminals blip ok. And as
each run completes, a *different* table row flips `firing → triaged → assigned`
(scramble order: display rows 5, 1, 6, 2, 4), each with the green tint decaying to
residue. Row 3 stays `assigned` (run 1's result). The record stays run 1's settled
record — untouched. The status column drains until all six rows read `assigned`.

## The one set piece — same machine, run five more times

```tsx
<Stage
  cam={CAM_ALL}
  webhook={{highlighted: webhookLive, state: webhookLive ? "none" : "ok"}}
  agent={{highlighted: agentLive, state: agentLive ? "none" : "ok"}}
  terms={[ /* all three: highlighted: termsLive, ok otherwise */ ]}
  toolRings={[ring(0), ring(1), ring(2)]}
  pulse1={p1}
  fanPulses={[fanP, fanP, fanP]}
  statusAt={(r) => flipFor(r).status}
  statusTextOp={(r) => flipFor(r).textOp}
  statusTint={(r) => flipFor(r).tint}
  recordIn={1}
  logReveals={[1, 1, 1, 1, 1]}
  logSelected={1}
/>
```

> *"Why is the record fully revealed and untouched (`logReveals={[1,1,1,1,1]}`)?"*
> Because **the record on screen is run 1's record, and it stays run 1's record.**
> A run record is a *per-run* surface — Sim shows one run's inspector at a time; it
> does not accumulate across runs. Runs 2–6 each have their own record, but we're
> not switching the panel to each one (that would be five panel-swaps, noise). So
> the record sits at run 1's complete state the whole scene. This is a real product
> honesty: the record is per-run, so it shows *one* run. The *table*, by contrast,
> is the workspace's incident queue — a persistent cross-run surface — so it
> accumulates the flips. Record = one run; table = the whole night. Getting this
> right is what keeps the scene truthful.

> *"Why no `msgTag`?"* It defaults to no resolve/glow — the agent rows show the
> template `<sentryalerts.message>` (reverted in scene 5). The compressed runs blip
> the agent's *ring* but don't resolve the tag (no time, and it's not the point).
> The agent rows stay at template; only the ring pulses.

## The camera — get out of the way

```ts
cam = CAM_ALL  // steady, no move
```

No camera move — same home framing the whole scene.

> *"Why hold the camera for the spectacle scene?"* Because **multiplicity is the
> spectacle, and the camera has to get out of its way.** The thing you're meant to
> watch is five runs firing across the machine while six rows drain in the table —
> a lot of synchronized motion across the whole frame. If the camera also moved,
> you'd lose the ability to track which row is flipping against which run. Same
> rule as scene 3: the busiest run scenes hold the frame still so the *content's*
> motion is legible. A moving camera over five accelerating runs would be
> motion-on-motion chaos.

## The accelerating-cadence machine — copy this shape

This is the reusable technique. Five runs, defined by two arrays:

```ts
const STARTS = [1.0, 4.6, 7.6, 10.0, 11.9];
const DURS   = [3.2, 2.7, 2.2, 1.8, 1.6];
```

Two things accelerate at once. The **start gaps shrink**: 4.6−1.0=3.6, then 3.0,
2.4, 1.9 — each run begins sooner after the last. And each **traversal is shorter**:
3.2s, 2.7s, 2.2s, 1.8s, 1.6s — each run plays faster than the one before. Together
these make the scene *accelerate* — the queue drains faster as it goes, which reads
as momentum building (and emotionally: "oh, it's just going to clear all of them").

> *"Why accelerate, rather than five evenly-spaced identical runs?"* Because five
> *identical* runs would be tedious — the same beat, five times, at the same pace,
> is the definition of boring repetition. Accelerating turns repetition into
> *momentum*: each run is faster, so the scene has a rising energy instead of a
> flat one. It also mirrors how you'd *feel* watching a queue clear — the first one
> you watch closely, by the fifth you just see it *snap* done. The acceleration is
> the difference between "five repeats" and "a queue draining itself."

> *"Why these specific numbers?"* They're tuned so the runs *never overlap* (each
> run's traversal finishes before the next starts) while still tightening. Non-
> overlap matters for the composition trick below. The last gap (1.9s) and last
> duration (1.6s) are about as tight as you can go and still read each run as a
> distinct run rather than a blur.

### Per-run phase and the `max()` composition trick

Each run has a normalized phase `u(k) = (t − STARTS[k]) / DURS[k]` — 0 at the run's
start, 1 at its end. Because the runs never overlap, the scene composes per-run
values with `max()`:

```ts
const maxRun = (f) => Math.max(...STARTS.map((_, k) => f(k)));
const anyRun = (a, b) => STARTS.some((_, k) => within(k, a, b));
```

> *"Why `max()` to compose five runs onto one set of props?"* Because the `<Stage/>`
> has *one* webhook, *one* agent, *one* fan, etc. — and only one run is ever active
> at a time (non-overlap). So "the webhook's blip value right now" is whichever run
> is currently in its blip phase, and `max()` picks it out: at any frame, at most
> one run contributes a non-zero value, and `max` returns it. This is the elegant
> part — five runs share one machine by being mutually exclusive in time, so a
> simple `max` over all five gives you "whatever the active run is doing." No state,
> no run-index tracking; just five phase functions and a `max`. If the runs
> overlapped, you'd need to sum or handle collisions; non-overlap is what makes
> `max` correct and the whole thing stateless.

### Each run is run 1's traversal, compressed (phase fractions)

Every beat is run 1's traversal expressed as *fractions of the run's duration D*, so
each mini-run is the followed run scaled down:

- webhook blip: phase **0 – 0.14** (`anyRun(0, 0.14)`)
- pulse 1 crosses edge 1: phase **0.06 – 0.32** (`ramp(u(k), 0.06, 0.32)`)
- agent live: phase **0.28 – 0.6** (`anyRun(0.28, 0.6)`)
- three chip rings in quick rhythm, centered at phase **0.34 + 0.075·i** (0.12s
  rise, 0.3s fall)
- fan pulse: phase **0.6 – 0.78** (`ramp(u(k), 0.6, 0.78)`)
- terminals blip: phase **0.76 – 0.9** (`anyRun(0.76, 0.9)`)

> *"Why phase fractions rather than absolute times?"* Because each run has a
> *different* duration (3.2s down to 1.6s), but every run should have the *same
> shape* — blip, pulse, agent, chips, fan, terminals, in that order and proportion.
> Expressing each beat as a fraction of D means the shape is invariant: run 5 (1.6s)
> is run 1's traversal played at 2× speed, beat for beat, not a different
> choreography. This is what makes the cadence read as "that exact thing, five more
> times" — the structure is identical, only the playback speed changes. Hard-coding
> absolute times per run would risk the shape drifting; fractions lock it.

> *"Why do the chip rings fire in 'quick rhythm' (0.34 + 0.075·i) rather than the
> 3.0s-pitch reads of scene 4?"* Because in scene 4 the three reads were the *whole
> lesson* — each needed its own legible beat. Here the reads are just *texture* —
> you've already learned what they are; the three chips fire in a fast 0.075-of-D
> rhythm (a quick rattle) to *suggest* "it read the signals" without spending the
> screen time to show each one land in the record. The compression is editorial:
> show the *shape* of the read (three chips rattling), skip the detail (no record
> rows — the record is run 1's anyway). This is the central economy of the scene —
> every beat is present in miniature, none is dwelt on.

### The flips — `flipFor(r)`, the same `flipAt` as run 1

The payoff of each run is a *different* row flipping, using the **same `flipAt`
shape** as scene 5:

```ts
const flipFor = (r) => {
  if (r === FOLLOWED_ROW) return FLIP_DONE;          // row 3: stays run 1's result
  const k = CADENCE_ORDER.indexOf(r);                // which run flips this row?
  if (k === -1) return FLIP_NONE;
  return flipAt(t, STARTS[k] + 0.6*DURS[k], STARTS[k] + 0.9*DURS[k]);
};
```

`CADENCE_ORDER = [4, 0, 5, 1, 3]` — run k=0 (the first cadence run) flips data row
4 (display row 5), run k=1 flips row 0 (display row 1), and so on. Each run's flip
times are `T1 = start + 0.6·D` (the agent settles → triaged) and `T2 = start +
0.9·D` (the page lands → assigned) — the *same* causal anchors as run 1 (agent
settle, PagerDuty create), expressed as phase fractions.

> *"Why a scramble order (5, 1, 6, 2, 4) instead of draining top-to-bottom?"*
> Because the five remaining alerts are *independent* — they arrive in arrival
> order, and nothing guarantees that's queue order. Draining strictly
> top-to-bottom would imply the workflow processes the table in row order, which it
> doesn't (each run is triggered by its own webhook delivery, in whatever order the
> alerts fire). The scramble is *truthful*: alerts come in unpredictably. It's also
> visually better — a top-to-bottom drain would be a predictable wipe; a scramble
> makes each flip a small surprise ("which row next?"), which holds attention across
> five runs. Row 3 is already done (`FLIP_DONE`), so the scramble fills in the gaps
> around it.

> *"Why reuse `flipAt` rather than a new flip animation for the cadence?"* So the
> cadence reads as "that exact thing, five more times." `flipAt` is the *same*
> dip-swap-plus-green-tint-to-residue from scene 5. If the cadence flips looked even
> slightly different (faster dip, different tint), the eye would register them as a
> *different* event, breaking the "same treatment" claim. Sharing the exact `_beats.
> ts` shape between the followed run and the cadence is what guarantees the
> visual rhyme — the module owns the *shape*, scenes own the *times*. (This is the
> same generator-sharing discipline as other videos' `runBeats` reuse: the cleanest
> way to *prove* two things are the same is to build them from the same function.)

> *"Why anchor the flips at 0.6·D and 0.9·D specifically?"* Those phase fractions
> place `triaged` right where the agent settles in the compressed traversal (agent
> live ends at phase 0.6) and `assigned` right where the terminals fire (phase
> 0.76–0.9 → the page lands ~0.9). So each cadence flip is synced to *its* run's
> real beats, exactly as run 1's flips were synced to Slack-ok and PagerDuty-ok —
> just expressed as fractions. The causality (agent → triaged, page → assigned) is
> preserved at every speed.

## The animation, run by run

There isn't a beat-by-beat to enumerate the way the followed run had — that's the
*point* of the cadence. Five runs play the phase-fraction traversal above, each
faster than the last, composed by `max()`. What you watch is:

- Run k=0 (start 1.0, D 3.2): the slowest, most legible — sets the template. Flips
  display row 5.
- Run k=1 (start 4.6, D 2.7): faster. Flips display row 1.
- Run k=2 (start 7.6, D 2.2): faster still. Flips display row 6.
- Run k=3 (start 10.0, D 1.8): quick. Flips display row 2.
- Run k=4 (start 11.9, D 1.6): the fastest snap. Flips display row 4.

By ~15s, all six rows read `assigned`, each carrying its decaying-then-residue green
tint. The status column has drained.

> *"Why is the first cadence run the slowest and most legible?"* Because it's the
> *bridge* from the followed run to the cadence — the viewer needs to recognize
> "oh, this is the same run, just compressed" before the acceleration kicks in. The
> first cadence run at D=3.2 is slow enough to read as the familiar traversal; by
> the time it speeds up (D=1.6 by run 5), the viewer already trusts that each blur
> is a full run. Start legible, then accelerate — you can only speed past something
> the viewer already understands.

### The hold — from ~15s to the end of the scene (19.4s)

After the last flip (run 5, ~12.7) and its tint decay (~14.3), the wall of
`assigned` with six green residues holds for ~4.4s.

> *"Dead air?"* This one is an *earned payoff hold* — the queue has just finished
> draining, and a beat of stillness on the full wall of `assigned` lets the
> accomplishment land. The status functions all clamp at their final states
> (`FLIP_DONE` / the decayed tint), so the hold is an end-anchored hold (stable,
> stretchable). Of all the holds in the video, this is among the most justified:
> it's the visual "…and they're all done." (Even so, the re-pacing lesson applies —
> the 4.4s could be tightened or the runs spread to fill more of the 19.4s.)

## How to think about the whole scene

1. *What's the idea?* Multiplicity — the same machine, five more times → no camera
   move (get out of the way); the spectacle is the synchronized motion.
2. *How do I share one machine across five runs?* Non-overlapping runs + `max()`
   composition → stateless, at most one run active per frame.
3. *How do I make each run the same as run 1?* Phase-fraction beats (every beat a
   fraction of that run's D) → identical shape at any speed.
4. *How do I make it build energy?* Shrinking start gaps AND shrinking durations →
   acceleration, momentum, not tedium.
5. *How do I make each run mean something?* Each flips a different row, scramble
   order (arrival, not queue order), reusing `flipAt` exactly → truthful, and
   visually "that exact thing, again."
6. *What stays fixed?* The record (per-run → stays run 1's) and row 3 (`FLIP_DONE`)
   → product-honest; only the table accumulates.
7. *How do I end?* On the wall of `assigned` with six residues → earned payoff hold.

The genius of the scene is that it's almost no new code — it's run 1's traversal,
parameterized by phase fraction, fired five times with shrinking timings and
composed by `max`. The whole "queue drains itself" spectacle is `STARTS`, `DURS`,
`CADENCE_ORDER`, and the phase-fraction reuse of beats you already built. *That* is
the thing to steal.

## Exit state (what scene 7 inherits)

`all six status cells `assigned`, each with residue tint 0.35 · chain settled green
(webhook, agent, three terminals all ok — every run's last blip left them ok) ·
record full at run 1's settled state (five log rows, complete tree, Triage selected)
· Messages tag at template · camera at CAM_ALL`.

Scene 7 (the morning bookend) opens on exactly this frame — the drained queue, the
green chain, the full record — and does nothing but ease the camera back ~4% and
hold. The cell residues and `assigned` statuses persist unchanged. Because both
scenes render the same `<Stage/>`, the 6→7 boundary is identical down to the pixel;
scene 7 is this exact frame, viewed from a half-step further back.
