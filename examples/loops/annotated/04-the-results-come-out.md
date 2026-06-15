# Scene 4 — `the-results-come-out`  ·  archetype: **freeze-cut completion + reference-resolution**

Source: `../source/scenes/TheResultsComeOutScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This scene is the **payoff** of the Loop run. Scene 3 ran the inside three
times and left the container live; scene 4 opens *inside* that held moment
and finishes the run: the loop exits **once**, and the consumer downstream
reads `<loop.results>`, which resolves to **`["x", "y", "z"]`** — every
pass's result, in order, collected as one array. Read it as the worked
example for "what happens after a loop, and how do I show the collected
output truthfully." The transferable rule: **after the loop, the per-item
context is gone; you reference the loop by name and get all the results as
one ordered array — and the array is mechanically derivable, never invented.**

---

## What this scene is for

A Loop's whole value isn't just "it ran three times" — it's "it ran three
times **and handed me everything those runs produced.**" Scene 3 showed the
mechanism (sequential passes); scene 4 shows the *product* of the mechanism
(the collected array) and how you get at it (by the container's name,
`<loop.results>`). Without this scene, the loop would look like it ran and
then evaporated. This is the scene that closes the loop — literally.

The rule is *one idea per scene*: "after the loop, you get one ordered
array." Not the passes again, not the schedule contrast — just the exit and
the resolution.

## What it looks like

The scene opens on the held freeze-cut frame: the container is still live
(blue ring), camera at identity, the Loop workflow exactly as scene 3 left
it. The container's ring flips from **live blue to ok green** — the loop is
done. Its source handle fires **one** pulse across the exit wire into
**Summary**. Summary goes live, and in its `Messages` row, `<loop.results>`
**resolves in place** to `["x", "y", "z"]` — the three pass results, in
order, as a single value. Summary settles ok-green, the frame holds, and then
everything reverts to the resting Loop template (rings release, the
resolution reverts to the tag).

## The freeze-cut completion — opening inside a held moment

```ts
const containerLive = t < 0.9;            // carried in from scene 3
const containerOk   = t >= 0.9 && t < 7.0;
```

The first thing the scene does is **inherit** the container's live ring
(`containerLive = t < 0.9`) — the latched state scene 3 handed across the
cut. For the first ~0.9s the container is still live, *exactly* as it was on
scene 3's last frame, then it transitions to the ok-green ring. This is the
other half of the freeze-cut: scene 3 latched the ring **on** and ended;
scene 4 opens with it **still on** and only then resolves it. The cut is
invisible because nothing changes at the boundary — the ring was blue, the
ring is blue — and the continuation (blue → green) is what tells you the run
moved forward.

> *"Why does scene 4 inherit the live ring for 0.9s before turning it green
> instead of opening already-green?"* Because the freeze-cut's whole job is
> that the boundary frame is *identical* on both sides. Scene 3's last frame
> is "container live"; scene 4's first frame must also be "container live," or
> the cut would flash. Holding the inherited state for a beat, then resolving
> it, is what makes the two scenes read as one continuous run rather than two
> takes. The ~0.9s also gives the eye a moment to register "we're back,
> looking at the whole workflow at identity framing" before the completion
> fires.

> *"Why does the loop exit only ONCE when it ran three times?"* This is the
> teaching point of the scene, drawn as a single pulse. Inside, the body ran
> per item; but the *container* — the loop as a whole — has a single exit. It
> runs N times internally and then hands control onward **once**, with all
> the results collected. Firing the exit wire three times would falsely imply
> the downstream block runs once per item; firing it once says "the loop
> finished, here is its single output." The one exit pulse is the visual claim
> "iteration happens *inside*; downstream sees the loop as one step."

## The reference-resolution — `<loop.results>` → `["x", "y", "z"]`

```ts
const resultsGlow    = Math.min(c(2.3, 2.7), c(3.2, 3.6, 1, 0));
const resultsResolve = Math.min(c(2.6, 3.1), c(6.2, 6.8, 1, 0));
// resultsTag={{glow: resultsGlow, resolve: resultsResolve}}
```

In Summary's `Messages` row, the value reads `Summarize <loop.results>`. As
Summary goes live, the `<loop.results>` tag glows blue (`resultsGlow`), then
**resolves in place** (`resultsResolve`) to `["x", "y", "z"]` — dipping
through a blank midpoint to the array, keeping a faint blue residue marking
provenance, exactly the `ResolvedTag` move from scene 3's per-pass
resolutions. After a long hold it reverts to the tag over `6.2 → 6.8`.

> *"Why does the result resolve in Summary's row and not as an array
> floating out of the container?"* Same iron rule as scene 3: **values
> resolve in place, where the reference lives — they never ride wires.** The
> exit pulse is light meaning "control passed to Summary"; the *value*
> `["x", "y", "z"]` materializes inside Summary's row, where
> `<loop.results>` is written. The provenance residue (faint blue on the
> resolved value) says "this text came from that reference." This is the core
> teaching move for Sim's tag system, reused here at the *array* scale: a
> reference to the loop's collected output, resolved to the actual collected
> output, right where you'd use it.

> *"Why `<loop.results>` and not `<loop.currentItem>`?"* Because **the
> per-item context is gone.** Inside the loop, each pass had a
> `<loop.currentItem>` (scene 3). *After* the loop, there is no "current
> item" — the iteration is over. What survives is the loop's *collected*
> output, addressed by the **container's name**: `<loop.results>`. The
> distinction is the whole semantic lesson — `currentItem` lives inside,
> `results` lives after, and the name (`loop`) is how you reach the container
> from downstream. (This name-by-reference fact is exactly what scene 5's
> morph exploits: rename the container and the tag follows.)

> *"Why is the array `["x", "y", "z"]` specifically — isn't that the input
> collection?"* Yes, and that's the point of the grounding choice. The inner
> Function's code is `return <loop.currentItem>` — each pass returns its own
> item unchanged. So the collected results array is **mechanically
> derivable**: pass 0 returned `"x"`, pass 1 returned `"y"`, pass 2 returned
> `"z"`, in order ⇒ `["x", "y", "z"]`. Zero invented values. The viewer who
> watched scene 3's three resolutions (`"x"`, then `"y"`, then `"z"`) can
> *predict* the array before it resolves — and then sees it confirmed. The
> identity-function body was chosen precisely so the output is honest and
> self-evident, not a number the author made up.

## "In order" — the array preserves pass order

The array reads `["x", "y", "z"]`, in the exact order the passes ran in scene
3. This is not incidental: a Loop collects results **in iteration order**, and
because scene 3 took the items strictly in order (`x → y → z`), the array
mirrors that order. The viewer's eye, having counted `x, y, z` in scene 2 and
watched them resolve `x, y, z` in scene 3, now sees them collected `x, y, z`
in scene 4 — the same sequence, three times, which is what makes "in order"
land without a word. (This is also the property scene 6 will preserve: even
when Parallel runs them at once, the collected array still comes out in
order.)

## The animation, beat by beat

| beat | window (s) | what happens |
|---|---|---|
| inherit live ring | `t < 0.9` | container still blue (freeze-cut carry) |
| loop settles ok | `0.9 → 7.0` | container ring blue → green |
| exit pulse | `1.3 → 2.1` | one streak crosses container → Summary |
| exit wire heats | `1.3 → 1.7` up, `6.0 → 6.6` down | wire brightens while on the live path |
| Summary live | `2.0 → 3.4` | Summary blue ring |
| results glow | `2.3 → 2.7` up | `<loop.results>` tag lights |
| results resolve | `2.6 → 3.1` up | tag → `["x", "y", "z"]` in place |
| Summary ok | `3.4 → 6.6` | Summary ring blue → green |
| hold | `~3.6 → 6.0` | settled; the collected array sits |
| revert | `6.0 → 6.8` | rings release, resolution reverts to tag |

> *"Why does the exit wire `heat` (a separate, longer window) on top of the
> `pulse` (a quick streak)?"* They describe different lifetimes. The pulse is
> an instant — control crossing, gone by `2.1`. The heat is a *duration* —
> "this wire is on the live path" — so it brightens as the pulse departs
> (`1.3 → 1.7`) and only cools once the whole completion is done
> (`6.0 → 6.6`). A streak is an event; "on the live path" is a state. Two
> timings, two drivers — the same discipline the run scenes use everywhere.

> *"Why such a long hold (3.6s → 6.0s) on the resolved array?"* Because the
> array **is** the payoff of the entire Loop half of the video — "you ran
> three times and here is everything you got, in order, as one value." It
> earns dwell time. The long settled hold also makes the scene stretchable
> for narration (extend-only timing), and it lets the viewer actually read
> `["x", "y", "z"]` and connect it back to the three passes they just
> watched.

## Why everything reverts to template before the scene ends

Over `6.0 → 6.8` the rings release and `<loop.results>` reverts to its tag,
landing the scene on the **resting Loop template** — the same frame scenes 1
and 2 ended on. This is deliberate: scene 5 (the morph) needs a clean,
neutral Loop template to morph *from*. By reverting the run's residue, scene
4's exit equals the template, so scene 5 can open on it and do its one job
(swap Loop → Parallel) without first having to clean up a run. Every run
reverts before its scene ends — except the named freeze-cut, which is exactly
the one carry the video allows.

## How to think about the whole scene

1. *What did the loop produce?* One ordered array of all pass results →
   `<loop.results>` resolves to `["x", "y", "z"]`.
2. *How does the loop hand off?* Once → a single exit pulse, not three.
3. *How do I get the output?* By the container's **name** →
   `<loop.results>`, because the per-item context is gone after the loop.
4. *How do I keep it honest?* Identity-function body ⇒ the array is
   derivable, not invented; resolve it in place, not down a wire.
5. *How do I open and close cleanly?* Inherit the live ring (freeze-cut),
   then revert to template → the cut in is invisible, the cut out is the
   morph's clean starting frame.

## Exit state (what scene 5 inherits)

`resting Loop template · no rings · `<loop.results>` reverted to tag · all
wires drawn, idle · camera at identity · Loop identity (phase 0)`. Identical
to the scenes 1/2 template. Scene 5 opens here, puts a selection ring on the
container, and runs the single continuous Loop → Parallel morph.
