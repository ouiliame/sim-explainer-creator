# Scene 6 — `all-at-once`  ·  archetype: **run (the simultaneous half of the contrast)**

Source: `../source/scenes/AllAtOnceScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is Run B, and it is the **payoff of the contrast.** Scene 3 ran the same
three items one at a time (Loop); scene 6 runs them **all at once**
(Parallel). The container is identical to scene 3's — same box, same inner
Start pill, same Function, same items — and the morph in scene 5 changed only
the schedule. So this scene exists to make the schedule *visible* as motion:
the inner Function fans into **three instances**, one Start fires **once**,
**three pulses leave together**, all three go live **at the same instant**,
each resolves its **own** item simultaneously, and they finish together in
about the time **one** pass took in scene 3. Read it as the worked example for
"how do I draw concurrency" — and the rule to steal: **simultaneity is drawn
as N instances sharing one clock; sequence (scene 3) was one instance re-run
on N clocks. Same container, opposite schedule, and the timing IS the lesson.**

---

## What this scene is for

The video has built one claim across five scenes: Loop and Parallel are the
same container on different schedules. Scene 6 is where you *see* the other
schedule run and *feel* why you'd pick it: independent work, done all at once,
in a fraction of the time. The whole point is the side-by-side with scene 3 —
this scene is constructed to be read against that one. Every choice here has a
counterpart in scene 3, inverted: one body re-run → three bodies run once;
three pulses staggered in time → three pulses fired together; `<…currentItem>`
rebinding across passes → three `<…currentItem>`s resolving in parallel.

The rule is *one idea per scene*: "a Parallel runs an instance per item, all
at once, and still collects one ordered array." Not the morph (scene 5), not
the schedule choice (scene 7) — just the simultaneous run.

## What it looks like

On the Parallel template (yellow Split chip), the run enters: outer Start
blips, a pulse crosses into the container, the container takes a live ring.
Then the difference from scene 3: **Function 1 fans into three instances** —
the single block separates into top / middle / bottom — and two extra inner
wires draw to the new instances. The inner Start pill blips **once**; **three
pulses leave together** along the three inner wires; **all three instances go
live at the same instant**; each row resolves its **own** item —
`<parallel.currentItem>` → `"x"` (top), `"y"` (mid), `"z"` (bottom),
**simultaneously**; all three settle ok **together**, in roughly the span one
pass took in scene 3. The resolutions revert, the three instances **collapse
back into one block**, the container settles ok, the exit fires **once**, and
`<parallel.results>` resolves in Aggregate to `["x", "y", "z"]` — the same
collected array. Full revert to the Parallel template.

## The distinctive move — the fan: N instances, one shared clock

The fan is the visual heart of the scene:

```ts
const fan = c(1.8, 2.8, 0, 1, EASING.inOut) - c(6.5, 7.4, 0, 1, EASING.inOut);
// fan: 0 = single block → 1 = three instances → 0 = collapsed back
```

`fan` opens `0 → 1` (instances separate) over `1.8 → 2.8`, holds, then
collapses `1 → 0` over `6.5 → 7.4`. The rig's `instY(fan)` interpolates the
three instance positions: at `fan=0` all three sit at the middle slot (one
block); at `fan=1` they're spread to top / mid / bottom at `±FAN_PITCH`. The
extra inner wires and the top/bottom instances only render while `fan > 0`, so
at *both* of the scene's boundary frames the rig is the single-instance
Parallel template — the fan exists only between run-start and run-end, fully
inside this scene.

Then the simultaneity — and this is the line that *is* the scene:

```ts
// All three instances share one clock — that synchrony IS the scene.
const live    = t >= 3.85 && t < 5.3;
const ok      = t >= 5.3  && t < 5.95;
const tagGlow = Math.min(c(3.9, 4.2), c(4.5, 4.8, 1, 0));
const resolve = Math.min(c(4.15, 4.55), c(5.75, 6.15, 1, 0));
const inst = (item) => ({highlighted: live, state: ok ? "ok" : "none",
                         tag: {glow: tagGlow, resolve}, item});
// ...
fn={inst(1)}  fnTop={inst(0)}  fnBot={inst(2)}
pillBlip={...one blip...}
pulseIn={pulses}  pulseInTop={pulses}  pulseInBot={pulses}   // ← same value
```

The three instances are built from **one** `inst()` factory driven by **one**
set of windows — `live`, `ok`, `tagGlow`, `resolve` are scalars, not arrays,
and all three instances read the same ones. The only thing that differs is
`item` (0, 1, 2), which binds each instance's `<parallel.currentItem>` to its
own collection element. The three inner pulses (`pulseIn`, `pulseInTop`,
`pulseInBot`) are all fed the *same* `pulses` value, so they travel as one.

> *"Why three instances here when scene 3 used one block re-run?"* Because
> that is the actual difference between the two schedules, and drawing it
> exactly is the lesson. A **Parallel** spins up a *separate instance per
> item* and runs them concurrently — so it's drawn as the body fanning into
> three real instances. A **Loop** has one body it executes repeatedly — so it
> was drawn as one block re-running (scene 3). The contrast in the drawing *is*
> the contrast in the runtime: N-instances-at-once vs one-instance-N-times.
> If scene 6 also used one re-run block, the only difference from scene 3
> would be speed, and "instance per item" — the real mechanism — would be
> invisible.

> *"Why drive all three instances off one shared clock — couldn't they each
> have their own windows?"* The shared clock **is** the simultaneity, enforced
> structurally. Because `live`, `ok`, and `resolve` are single scalars read by
> all three instances, it is *impossible* for the three to light, resolve, or
> finish at different times — they are the same expression. This mirrors scene
> 3's opposite guarantee (where one current-pass index made overlap
> impossible). There, non-overlap was structural; here, synchrony is
> structural. In both scenes the *claim* is true by construction, not by
> careful timing — which is why neither can drift on a re-render.

> *"Why does the inner Start pill blip ONCE while three pulses leave?"* Because
> the parallel fan-out is a *single* dispatch that branches to N instances —
> the inside starts once and fans out, rather than starting three separate
> times. One blip, three simultaneous pulses says "one trigger, N concurrent
> branches." (Contrast scene 3: the pill blipped three separate times, one per
> sequential pass.) The single blip is the parallel signature; the three
> staggered blips were the sequential signature.

## The timing contrast — the whole video in one comparison

This is the line the script underlines: *"Run A's three passes take ~3× the
time of Run B's one simultaneous pass."* Lay the two runs side by side:

| | scene 3 (Loop) | scene 6 (Parallel) |
|---|---|---|
| body | one block, re-run | three instances |
| inner Start | blips **3×** (per pass) | blips **once** |
| inner pulses | one, **3×** in sequence | **three together** |
| go-live | three times, never overlapping | **all three at once** |
| `<…currentItem>` resolves | `x`, then `y`, then `z` (rebinds) | `x`, `y`, `z` **simultaneously** |
| run span | passes ~2.6s apart, ~`3.2 → 10.7s` | live `3.85 → 5.95s` — **one pass's worth** |
| results | `["x","y","z"]` in order | `["x","y","z"]` — same array |

The three instances go live `3.85 → 5.3` and settle `5.3 → 5.95` — a single
live window, the duration of **one** of scene 3's passes. Three items'
worth of work, in one item's worth of time. That measured difference — same
items, same body, ~3× faster — is the entire payoff of the contrast, and it's
why scene 3 was deliberately made to *cost* time: so you could feel the
saving here.

> *"Why does it matter that the runs are framed at the same geometry and use
> the same collection?"* Because the contrast only reads if *everything else
> is held equal.* Same container position, same inner Function, same
> `["x","y","z"]`, same resolution mechanic — so the *only* perceptible
> difference between scene 3 and scene 6 is the schedule (sequential vs
> simultaneous) and its consequence (slow vs fast). One collection through
> both phases (script assumption 2) is what makes "only the schedule changed"
> literally true on screen.

## The collected array survives concurrency — still `["x", "y", "z"]`, in order

After the fan collapses, the completion is the same shape as scene 4: the
container settles ok, the exit fires **once**, and `<parallel.results>`
resolves in Aggregate's row to `["x", "y", "z"]`.

> *"Why is the array still in order when the instances ran simultaneously?"*
> Because a Parallel collects results **by item position**, not by finish
> order — instance 0's output goes to slot 0, instance 1's to slot 1, etc. So
> even though all three ran at once, the collected array preserves the
> collection's order: `["x", "y", "z"]`. This is the reassuring symmetry with
> scene 4 — *the schedule changed, but the output contract didn't.* You get
> the same ordered array from Parallel that you got from Loop; concurrency
> bought you speed without costing you order. (And again it's derivable: each
> instance returns `<parallel.currentItem>`, so the array is exactly the
> inputs, in order — zero invented values.)

## The fan is fully self-contained — the boundaries are the template

```ts
const containerLive = t >= 1.3 && t < 7.5;     // closed window — NOT latched
const containerOk   = t >= 7.5 && t < 11.2;
```

Unlike scene 3, this run's container ring is a **closed** window — it lights,
settles ok, and reverts, all inside the scene. There's no freeze-cut here: the
fan opens and collapses (`fan` returns to 0 by `7.4`), the run completes, and
everything reverts to the Parallel template before the cut. At both of the
scene's boundary frames, the rig is the single-instance Parallel template.

> *"Why no freeze-cut this time, when scene 3 carried its live ring across the
> cut?"* Because scene 3's completion (the results) was a *separate scene*
> (scene 4), so the run had to be paused mid-flight and handed across. Scene 6
> contains its *own* completion — the results resolve in this same scene — so
> there's nothing to carry. The run is one continuous event start-to-finish
> within scene 6, and it cleans up after itself. The next scene (7) is the
> bookend, which wants a clean Parallel template to reverse-morph from.

## The animation, beat by beat

| beat | window (s) | what happens |
|---|---|---|
| outer Start blip | `0.4 → 0.9` | run enters |
| pulse → container | `0.7 → 1.4` | streak crosses edge 0 |
| container live | `1.3 → 7.5` | blue ring (closed window) |
| fan opens | `1.8 → 2.8` | one block → three instances; extra wires draw |
| inner Start blip | `3.0 → 3.85` | **one** blip |
| three pulses | `3.2 → 3.95` | leave **together** along three inner wires |
| three instances live | `3.85 → 5.3` | all at once (shared clock) |
| three tags glow/resolve | `3.9 → 4.55` | `x`, `y`, `z` resolve **simultaneously**, in place |
| three settle ok | `5.3 → 5.95` | together |
| resolutions revert | `5.75 → 6.15` | tags return |
| fan collapses | `6.5 → 7.4` | three instances → one block |
| container ok | `7.5 → 11.2` | blue → green |
| exit pulse | `7.8 → 8.6` | **one** streak → Aggregate |
| Aggregate live + resolve | `8.5 → 9.5` | `<parallel.results>` → `["x","y","z"]` in place |
| Aggregate ok, hold, revert | `9.7 → 11.3` | settle, then back to template |

All transforms (`fan`, pulses, camera-free) use `EASING.inOut`; the run
follows the same grammar as every run scene — rings for state, streaks for
control, resolutions in place.

> *"Why open the fan first (1.8–2.8) and only fire the run after (3.0+)?"*
> Same rule as scene 3's camera: change the structure, *then* run against the
> changed structure. The fan settles into three instances before any of them
> light, so the synchronous go-live plays against a stable three-instance
> layout — you read "three things lit at once," not "things appearing and
> lighting in one blur." And the fan collapses *after* the run, before the
> exit, so the container hands off as a single unit (one exit pulse), exactly
> as a container should.

## How to think about the whole scene

1. *What does a Parallel do?* Runs an instance per item, concurrently → fan
   into three instances; one blip; three pulses together; one shared clock.
2. *How do I make "simultaneous" undeniable?* All instances read one scalar
   `live`/`resolve` → synchrony is structural, can't drift.
3. *How do I make the saving felt?* Three items finish in one pass's time →
   the measured ~3× contrast against scene 3.
4. *How do I keep "only the schedule changed" true?* Same container, same
   Function, same `["x","y","z"]`, same resolution move — only the count of
   live instances and the firing pattern differ.
5. *What's the output?* The same ordered array, collected by position →
   concurrency without losing order.
6. *How do I bound it cleanly?* Fan opens and collapses inside the scene; the
   run self-completes; boundaries are the Parallel template.

## Exit state (what scene 7 inherits)

`resting Parallel template (phase 1) · fan collapsed (single instance) · no
rings · `<parallel.results>` reverted to tag · camera at identity · same
geometry as every prior scene`. Scene 7 opens here, reverse-morphs Parallel →
Loop (replaying scene 5's curves backward to land on scene 1's end state), and
eases the camera back for the closing hold.
