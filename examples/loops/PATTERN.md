# CORE PATTERN — the container + the sequential-vs-simultaneous contrast

*The `loops` build (Iteration — Loop & Parallel). One container, two
schedules; the schedule is the only thing that changes, and that IS the
lesson.*

This is a teaching template for any topic shaped like **"the same machine,
two modes — and the difference between the modes is the whole point."** Loop
vs Parallel is the worked instance, but the move generalizes to any
A-vs-B-where-only-one-property-differs lesson (sync vs async, batch vs
stream, eager vs lazy, etc.).

---

## The move in one breath

Build **one container block** — a box that visibly *holds another block* and
has its own internal Start. Run its inside **sequentially** (one drawn body,
re-run once per item, with the current-item reference resolving to a new value
each pass), then show the **collected results array** as the payoff. Then
**morph the same container in place** to the other mode and run it
**simultaneously** (the inside fans into N instances that share one clock).
Hold *everything* equal across the two runs — same box, same inner block, same
items, same geometry, same resolution mechanic — so the **only** perceptible
difference is the schedule. The timing gap (sequential takes ~N× simultaneous)
is the lesson, drawn as motion.

## Why it's in the pack

It is the cleanest example in the library of **teaching a contrast by holding
everything constant except the one variable.** Most explainers teach two
concepts as two diagrams; this teaches them as *one object in two states*, so
the difference can't be misattributed to anything but the variable that
actually changed. The morph (scene 5) and the held-equal runs (scenes 3 & 6)
are the reusable machinery.

## How it's built

**One rig, one `phase`.** The entire video is a single set piece (`_rig.tsx`):
Start → container → inner Function → consumer, all geometry owned by
`layout.ts`. Every scene renders the *whole* rig and changes only state props.
A single value, `phase` (`0 = Loop … 1 = Parallel`), drives the entire
identity morph (chip color+glyph, container name, both reference tags) via
staggered sub-curves (`morphCurves`). Nothing ever re-layouts; boundaries are
pixel-identical by construction.

**The container anatomy** (ported from the product's container node):
- a faint-fill, 1px-border, 8px-radius **box** with `overflow: hidden` (the
  inner block is genuinely clipped inside);
- a **header bar** with a 24px colored chip (identity glyph) + the name — the
  *only* part the morph touches;
- an **internal Start pill** with its own source handle, sitting inside the
  body — the proof that *the inside is its own little workflow with its own
  beginning*. This is the load-bearing glyph: its re-firing is how iteration
  is shown;
- **centered outer handles** (at the box's vertical center), so the
  Start→container and container→consumer wires are dead straight on one axis.

**Sequential (Loop, scene 3):** one drawn Function block, re-run. A single set
of beat windows (pill blip → inner pulse → live → ok → resolve → revert) is
written relative to the *current pass's* start time `T`; a pass index `k`
computed from non-overlapping windows advances `0→1→2`, replaying the same
windows against each new `T`. The only thing that differs per pass is which
item `<loop.currentItem>` binds to. Non-overlap is structural — two passes
*cannot* co-exist. After the third pass the container's live ring **latches**
and holds across a freeze-cut into scene 4, where the loop exits **once** and
`<loop.results>` resolves in place to the collected array `["x","y","z"]`.

**The morph (scene 5):** `phase` eases `0→1` at constant geometry. Chip, name,
and tags crossfade; **the box, the inner Start pill, the inner Function, the
wires, and the items hold perfectly still.** The stillness is the proof that
"only the schedule changed."

**Simultaneous (Parallel, scene 6):** the inner Function **fans into three
instances** (`fan: 0→1→0`, self-contained within the scene). The inner Start
blips **once**, three pulses leave **together**, and all three instances are
driven by **one shared scalar clock** (`live`/`ok`/`resolve` are not arrays) —
synchrony is structural, can't drift. Each instance binds
`<parallel.currentItem>` to its own item; all resolve at once, finishing in
about the time **one** sequential pass took. The exit still fires once and
`<parallel.results>` still resolves to `["x","y","z"]` — collected by
position, so order survives concurrency.

**The bookend (scene 7):** reverse the morph (`phase: 1→0`) to land exactly on
the opening frame, then ease the camera back for a calm closing hold.

## The grammar that keeps it honest

- **Wires carry light, not cargo.** A pulse is a streak meaning "control
  passed"; it carries no value. Values **resolve in place** in block rows
  (`ResolvedTag`: tag glows → dips → becomes the value, keeping a faint blue
  provenance residue), never sliding down a wire. Data flows by *reference*,
  resolved at the point of use — drawing values on wires would teach a lie.
- **State in the product's own language:** blue live ring, green ok ring,
  selection ring while editing, ~0.35 dim for "not the focus." Never a word
  like "RUNNING" stamped on screen.
- **Iteration = repetition of beats**, not duplication of blocks. Sequence is
  one body re-run; simultaneity is N instances sharing one clock.
- **Every value is derivable, never invented.** The inner body is
  `return <currentItem>`, so the results array is mechanically the inputs in
  order — the viewer can predict it before it resolves.

## When to use it

Reach for this pattern when the topic is **two modes of one mechanism** and
the teaching goal is *the difference between the modes*:
- there is a single object/machine that can operate two (or more) ways;
- the ways differ in exactly one property (schedule, order, timing,
  strategy);
- the property itself isn't directly drawable (you can't draw "concurrency"),
  so it must be shown as *the consequence* of the change against an otherwise
  identical baseline.

Do **not** use it when the two things being compared are genuinely different
objects (then they deserve two diagrams), or when the lesson is about one
mode alone (then drop the contrast and just run it).

## The transferable rule

> **To teach that two things differ in one property, build ONE object, run it
> both ways, and hold everything else identical — same geometry, same parts,
> same data, same grammar. Morph between the modes in place (one driver value,
> reversible), so the viewer never loses the object. The single uncontrolled
> variable — and its visible consequence (here, sequential costs ~N× the time
> of simultaneous) — becomes the entire lesson, because it is the only thing
> that ever changed.**

Corollaries worth stealing wholesale:
- **One rig, state props only** → continuity is free, boundaries are exact.
- **One driver value for a morph** (`phase`) → the reverse is the same move
  backward; no un-morph code; pixel-true bookends.
- **Structural guarantees over careful timing:** compute a single
  current-index for sequence (overlap impossible) and a single shared clock
  for simultaneity (drift impossible) — the *claim* is true by construction.
- **The freeze-cut carry:** when one event spans two scenes, latch the one
  live state across the cut and revert everything else; the run reads as
  continuous, the boundary stays identical.
- **Make the cost felt before you show the saving:** deliberately let the slow
  mode take its full time, so the fast mode's saving lands as a measured
  contrast, not a claim.
