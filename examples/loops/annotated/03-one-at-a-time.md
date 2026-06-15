# Scene 3 — `one-at-a-time`  ·  archetype: **run + camera lean-in (freeze-cut OUT)**

Source: `../source/scenes/OneAtATimeScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is **the** scene — the one the whole video exists to deliver, and the
reason this build is in the pack. It shows what a Loop *does*: it runs the
inside of the container **once per item, strictly one at a time**, and on
each pass `<loop.currentItem>` resolves in place to a different item. Read it
as the worked example for "how do I animate iteration honestly" — and the
answer is the move worth stealing: **iteration is drawn as the literal
repetition of one body's beats over a single drawn block, not as N copies of
the block.** The same inner Start pill re-fires; the same inner wire
re-pulses; the same Function row re-resolves — three times, never overlapping.

---

## What this scene is for

Scene 2 established "three items." Scene 3 spends those three: it runs the
container's inside three times in sequence and makes you *feel* the
one-at-a-time-ness — never two rings lit at once, each pass strictly after
the last. The contrast that is the entire video's lesson — sequential (Loop)
vs simultaneous (Parallel) — has its **sequential half built here**, and
built so legibly that scene 6 can be "the same thing but at once" and the
difference reads instantly.

The rule is *one idea per scene*: the idea is "same steps, next item, in
order." Not the results (that's scene 4, across a deliberate freeze-cut), not
the schedule contrast (that's scene 5–6). Just the iteration mechanism,
repeated three times.

## What it looks like

The run enters: the outer Start blips, a pulse crosses the wire into the
container, and the **container takes a live (blue) ring and keeps it.** The
camera leans in on the container (to 1.12×). Then the mechanism plays three
times: the **inner Start pill blips** → a pulse crosses the **inner wire** →
**Function 1 goes live** → in its `Code` row, `<loop.currentItem>` **resolves
in place** to `"x"` → the Function settles green-ok → the resolution reverts
to the tag — and then the pill blips **again** for `"y"`, and again for
`"z"`. Strictly sequential: at no instant are two passes lit. After the third
pass, the camera returns to identity, and the **container's live ring HOLDS
through the cut** — the passes are done, but the loop has produced nothing
yet. That held live ring is the freeze-cut into scene 4.

## The distinctive move — one body, re-run, not N bodies

Look at how the three passes are produced. There is **one** Function block in
this scene (`fn`), and it is driven by a single set of windows keyed off the
*current pass index*:

```ts
const ITER_T = [3.2, 5.8, 8.4];                 // the three pass start times

const k = t < ITER_T[1] ? 0 : t < ITER_T[2] ? 1 : 2;   // which pass is current
const T = ITER_T[k];                                    // that pass's clock origin

const pillBlip = Math.min(c(T, T + 0.25), c(T + 0.55, T + 0.85, 1, 0));
const pulseIn  = c(T + 0.2, T + 0.95, 0, 1, EASING.inOut);
const fnLive   = t >= T + 0.85 && t < T + 1.75;
const fnOk     = t >= T + 1.75 && t < T + 2.35;
const tagGlow  = Math.min(c(T + 0.7, T + 1.0), c(T + 1.3, T + 1.6, 1, 0));
const resolve  = Math.min(c(T + 0.95, T + 1.35), c(T + 1.95, T + 2.35, 1, 0));
// ...
fn={{
  highlighted: fnLive,
  state: fnOk ? "ok" : "none",
  tag: {glow: tagGlow, resolve},
  item: k,             // ← the ONLY thing that differs pass to pass
}}
```

Every beat — `pillBlip`, `pulseIn`, `fnLive`, `fnOk`, `tagGlow`, `resolve` —
is written **relative to `T`**, the current pass's start time. As the clock
crosses each `ITER_T` boundary, `k` advances (`0 → 1 → 2`), `T` jumps to the
next origin, and **the exact same six windows replay** against that new
origin. The block doesn't move. It doesn't duplicate. It runs, reverts, and
runs again. The *only* value that changes between passes is `item: k`, which
selects which collection item `<loop.currentItem>` resolves to.

> *"Why animate one block three times instead of showing three blocks?"*
> Because that is **what a Loop actually is.** A Loop does not instantiate
> three copies of the body — it has one body and executes it three times,
> sequentially, rebinding `<loop.currentItem>` each time. Drawing three
> blocks would be a lie about the runtime (and worse, it would be the
> *Parallel* picture — three instances is precisely how scene 6 draws
> Parallel). The honesty of "one body, re-run" is also the legibility: the
> viewer watches the *same* Function light up, resolve, go dark, light up
> again — and "same steps, next item" is the only possible read. The single
> drawn body re-running **is** the sequential schedule, made visible.

> *"How is `<loop.currentItem>` 'a different value every time' if it's one
> block?"* Through `item: k`. The rig's `itemValue()` looks up
> `ITEMS[inst.item]` and feeds it to the resolving tag, so on pass 0 the tag
> resolves to `"x"`, on pass 1 to `"y"`, on pass 2 to `"z"`. The reference is
> the same (`<loop.currentItem>`); the *binding* changes. That is exactly the
> product's semantics: inside the loop, `<loop.currentItem>` is whatever the
> current iteration's item is — one name, a new value per pass.

## The resolution mechanic — `ResolvedTag`, glow → dip → value → revert

The single most important micro-interaction in the video is the tag
resolving *in place*. It's the `ResolvedTag` move (`tag` glows blue, then
dip-swaps through a blank midpoint to the runtime `value`, keeping a faint
blue residue to mark provenance), driven by two values per pass:

- `tagGlow` (rises `T+0.7 → T+1.0`, falls `T+1.3 → T+1.6`): the unresolved
  `<loop.currentItem>` tag lights selection-blue — "this reference is about
  to be read."
- `resolve` (rises `T+0.95 → T+1.35`, falls `T+1.95 → T+2.35`): the tag
  **dips out and the item value dips in, right where the tag was** — `"x"` on
  pass 0. Then `resolve` falls back to 0, and the value dips back to the tag.

> *"Why does the value appear *in the row* and not slide down the wire from
> somewhere?"* This is the iron rule of the whole series, and it's load-
> bearing here: **values never ride wires; they resolve in place. Wires carry
> light, not cargo.** The pulse crossing the inner wire (`pulseIn`) is a
> streak of light meaning "control passed from the pill to the Function" —
> nothing rides it. The *value* `"x"` materializes inside the Function's
> `Code` row, where `<loop.currentItem>` lives, because that's where the
> reference is. A value sliding down the wire would teach that Sim passes data
> along edges, which it doesn't — data flows by *reference*, resolved at the
> point of use. Breaking this for a flashier frame would teach a lie about the
> product. The resolution-in-place is the truthful, and the only, way to draw
> "the current item became x."

> *"Why does the resolution **revert** to the tag at the end of each pass?"*
> Two reasons. Honesty: after the pass, the binding is gone — the block is no
> longer running, so it shows its *configured* state (the tag), not a stale
> value. Legibility: reverting clears the slate so the next pass's resolution
> reads as a fresh event (`"x"` → tag → `"y"`), not as `"x"` getting
> overwritten by `"y"`. The revert is what makes the three resolutions read
> as three distinct passes rather than one value mutating.

## The no-overlap guarantee — why it can never show two passes at once

The pass index `k` is computed from non-overlapping time windows
(`t < ITER_T[1] ? 0 : ...`), so **exactly one pass is current at any
instant**, and every beat keys off that single pass's `T`. There is no way
for pass 0's `fnLive` and pass 1's `fnLive` to both be true — they're the
same expression evaluated against whichever `T` is active. This is the
structural enforcement of "one at a time": it isn't a matter of careful
timing that *happens* to not overlap; it's impossible for it to overlap,
because there's one block and one current pass.

> *"Why is non-overlap worth enforcing structurally rather than just spacing
> the windows?"* Because "strictly one at a time" is the *claim* of the
> scene, and it's the half of the contrast that scene 6 (all-at-once) plays
> against. If two passes ever flickered together, the sequential lesson would
> blur and the Parallel contrast would lose its punch. Building it so overlap
> is impossible means the claim is true by construction — the same discipline
> as rendering one rig for continuity.

## The pace IS the lesson — three passes take ~3× one pass

The three passes start at `3.2`, `5.8`, `8.4` — about **2.6s apart** — and
each pass's full cycle (blip → pulse → live → ok → resolve → revert) runs
~2.35s. So Run A occupies roughly `3.2 → 10.7s` of run time for three items.
This duration is *deliberate* and it's set up to be **contrasted**: scene 6
runs the same three items in about the time **one** pass takes here, because
they go at once. The script states it outright — "Run A's three passes take
~3× the time of Run B's one simultaneous pass." The slowness of this scene is
not a pacing accident; it is the measuring stick the Parallel run will be
read against. Sequential *costs* time, and you feel the cost here so the
savings land there.

## The camera — lean in to watch the inside, lean back before the cut

```ts
const lean = Math.min(c(1.8, 3.0, 0, 1, EASING.inOut),
                      c(11.6, 12.8, 1, 0, EASING.inOut));
// interpolate px/py/s from identity → LEAN (container-centered, 1.12×) → identity
```

The camera eases from identity onto the container (`LEAN = {px: container
center, s: 1.12}`) over `1.8 → 3.0`, holds through all three passes, and
eases back to identity over `11.6 → 12.8` — **before** the cut. The `1.12×`
zoom is chosen so Start and Summary stay just in frame (`1665 × 1.12 = 1865 <
1920`); the lean tightens onto the *inside* of the container, which is where
the iteration is happening, without losing the workflow's context entirely.

> *"Why move the camera *first*, then run, and lean back *before* the run is
> fully resolved?"* Two rules. First: **move the camera between events, not
> during them.** The lean-in completes (by `3.0`) before the first pass's
> resolution (`~4.5`), so the iteration plays against a *fixed* tighter frame
> — motion-on-motion is avoided, the eye reads the passes against a steady
> lens. Second, and this is the freeze-cut setup: the camera returns to
> identity over `11.6 → 12.8`, so the *framing* is neutral at the cut even
> though the container's live ring is still on. The next scene (results) opens
> at identity framing with the container live — the camera is home, the state
> is held.

## The freeze-cut OUT — the live ring holds, on purpose

```ts
const containerLive = t >= 1.4;   // holds through the scene end (freeze-cut)
```

`containerLive` has **no upper bound** — once the run enters at `1.4s`, the
container's live ring is on for the rest of the scene *and across the cut into
scene 4*. Every other state in the scene is a closed window (each `fnLive`,
each `fnOk` ends); the container's ring is latched open.

> *"Why hold the container live across the cut instead of completing the run
> here?"* Because the run is **one continuous event**, and scenes 3 and 4 are
> two halves of it: scene 3 is "the passes ran," scene 4 is "the results came
> out." If scene 3 reverted the container ring at its end and scene 4 re-lit
> it, you'd be drawing *two* runs — run, stop, run again — when the truth is
> one run seen in two beats. The script names this explicitly: the 3→4
> boundary is a **deliberate freeze-cut** where the container's live ring is
> the *only* carried state — camera back at identity, every iteration
> resolution already reverted before the cut. The held ring says "the inside
> finished its passes, but the loop hasn't produced its output yet" — which is
> exactly the held moment scene 4 opens inside. Because both scenes render the
> same rig and scene 4 simply keeps the ring on (its `containerLive = t <
> 0.9`), the boundary is pixel-identical and the run reads as continuous.

## How to think about the whole scene

1. *What does a Loop do?* Runs the inside once per item, in order → one body,
   re-run three times, never overlapping.
2. *How does each pass differ?* `<loop.currentItem>` rebinds →
   `ResolvedTag` resolves the same tag to `"x"`, then `"y"`, then `"z"`,
   in place, reverting between passes.
3. *How do I make "sequential" undeniable?* Compute one current pass index
   from non-overlapping windows → two passes can't co-exist by construction.
4. *How do I make the cost felt?* Let three passes take ~3× one pass → the
   measuring stick for scene 6's savings.
5. *Where's the camera?* Lean in to watch the inside, lean back to identity
   before the cut → fixed frame during motion, neutral framing at the
   freeze-cut.
6. *What carries across the cut?* Only the container's latched live ring →
   the run is one event, paused mid-flight.

## Exit state (what scene 4 inherits — a freeze-cut carry)

`container live ring ON (latched, carries across the cut) · all three passes
done, every resolution reverted to the tag · Function not live · camera at
identity · Loop identity (phase 0)`. Scene 4 opens on this exact frame — the
held live moment — and completes the same run: the container settles ok, its
exit wire fires once, and `<loop.results>` resolves in Summary. The carried
state is the container's live ring; the boundary is identical by
construction.
