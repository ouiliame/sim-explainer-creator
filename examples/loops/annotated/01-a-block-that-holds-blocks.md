# Scene 1 — `a-block-that-holds-blocks`  ·  archetype: **assemble**

Source: `../source/scenes/ABlockThatHoldsBlocksScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is the opening scene of the video, and it does exactly one thing: it
**builds the set piece you will watch for the rest of the run** — Start, a
container block, the one block living inside it, and the consumer that reads
its results. Read it as a worked example, because the single most important
decision in the whole video is made here, silently, in how this scene
assembles: the container is drawn as *a block that holds blocks*, and you
see a block go **inside** it. Everything the video teaches afterward is a
consequence of that one structural fact.

---

## What this scene is for

The video's whole thesis is: *when the same steps must run over many items,
put the steps inside a container.* So scene 1's job is to make the container
**concrete as a thing with an inside**, not a labelled box. It does that by
assembling the workflow in **flow order** — Start first, then a wire, then
the container's empty shell, then a wire *inside* it, then the inner block
landing *inside* the shell, then the container's own exit wire, then the
consumer. The order is the argument. You watch a block get dropped into
another block, and the idea "a workflow inside a workflow" arrives without a
caption.

The rule it follows is *one idea per scene*: this scene is "here is a block
that holds blocks." No run, no iteration, no Loop-vs-Parallel — those each
get their own scene. Resist the urge to also fire the container here; the
assembly *is* the idea, and a run on top of it would bury the structure
under motion.

## What it looks like

A workflow on the builder canvas, centered. From left to right: a **Start**
trigger (header-only, blue), a straight wire, a **Loop** container — a
bordered box with a header bar (blue Repeat chip + the name "Loop") and,
sitting inside the body near the top-left, its own little **Start pill** — a
short inner wire from that pill, a **Function 1** block (red, row
`Code | return <loop.currentItem>`) landing *inside* the container, the
container's own exit wire, and finally a **Summary** agent (green, row
`Messages | Summarize <loop.results>`). They arrive in that exact order,
each fading/drawing on in turn, and then the assembled frame holds, balanced
and still.

## The one real decision: render the *whole* set piece, every scene, from one rig

The scene renders this and almost nothing else:

```tsx
<Rig
  phase={0}
  start={{opacity: c(0.5, 1.1, 0, 1, EASING.out)}}
  edge0={{progress: c(1.2, 1.8, 0, 1, EASING.out)}}
  container={{opacity: c(1.9, 2.7, 0, 1, EASING.out)}}
  edgeIn={{progress: c(2.9, 3.5, 0, 1, EASING.out)}}
  fn={{opacity: c(3.6, 4.3, 0, 1, EASING.out)}}
  edgeExit={{progress: c(4.7, 5.3, 0, 1, EASING.out)}}
  summary={{opacity: c(5.4, 6.1, 0, 1, EASING.out)}}
/>
```

Two things to take from this, and they are the same two lessons the whole
series turns on.

**There is exactly one set piece, `<Rig/>`, and every scene renders all of
it.** The Start, the container, the inner Start pill, the Function, the
Summary, all the wires — every scene mounts the entire rig and only changes
**state props** (opacity, `progress`, `highlighted`, `phase`, tag glows).
Scene 1 isn't "the assemble scene that builds a thing the next scene
inherits"; it's the rig at one set of prop values. Scene 2 is the same rig
at different values. The container you see assemble here is numerically the
same DOM the morph in scene 5 will recolor and the run in scene 6 will fan —
never a re-layout, never a remount.

> *"Why render the whole rig when scene 1 only needs the empty workflow?"*
> Because of the cut into scene 2. If scene 1 mounted only what it shows and
> scene 2 mounted more, you'd risk a one-frame reflow at the boundary — the
> container shifting, a flash. By having both scenes render the *same* rig
> and animate only props, the boundary is identical **by construction**.
> Continuity stops being a thing you check after the fact and becomes a thing
> you cannot break. This is the project's deepest habit: own all geometry in
> `layout.ts`, render one rig, never relayout.

**`phase={0}` means "this is the Loop identity."** The rig has a single
`phase` value, `0 = Loop … 1 = Parallel`, that drives the *entire* morph —
the chip color and glyph, the container name, and the two reference tags.
Scene 1 pins it at 0, so everything reads as a Loop: blue Repeat chip, name
"Loop", `<loop.currentItem>` in the Function row, `<loop.results>` in
Summary. You are not choosing those strings here; they are what `phase=0`
*is*. (The same rig at `phase=1` is the Parallel identity, with nothing else
changed — which is scene 5's whole lesson, set up silently here.)

## The container anatomy — what's actually being assembled

The container (`SubflowContainer` in `_rig.tsx`) is a pixel port of the
product's own container node, and every part of it is load-bearing for the
lessons that follow. It is worth naming the parts, because the rest of the
video *animates these specific parts*:

- **The box.** 8px-radius (×1.5 = 12), 1px border in `--wp-border-1`, a
  faint fill (`rgba(255,255,255,0.02)` dark) — barely-there, so it reads as
  *a region that contains*, not a solid card. The body has
  `overflow: hidden`, so the inner block is genuinely clipped to the inside.
- **The header bar.** Surface-3 background, a 24px (×1.5) rounded chip on the
  left holding the identity glyph (the blue Repeat icon), then the 16px
  medium name. This is the only part the morph in scene 5 touches.
- **The internal Start pill.** A small rounded pill (`Start`, 13px medium)
  positioned absolutely inside the body near the top-left (docs:
  `left-4 top-[56px]`), with **its own source handle** on its right edge.
  This is the single most important glyph in the video: it is the visual
  proof that *the inside of the container is its own little workflow with its
  own beginning.* Whatever runs inside starts from this pill, once per item.
- **The centered outer handles.** The container's target handle (left) and
  source handle (right) sit at the box's **vertical center** (7×20 native),
  not at a header offset. That's why the outer wires — Start→container and
  container→Summary — are dead straight on the stage axis: the layout aligns
  Start's and Summary's header handles to the container's centered handles
  (the docs author the same alignment, `95+20 = 30+85`). Straight wires read
  as "one clean flow line"; the centered handles are what make that possible.

> *"Why does the container have an inner Start pill at all — isn't the outer
> Start enough?"* No, and this is the crux of the whole video. The outer
> Start triggers the *workflow*. The **inner** Start pill triggers the
> *inside of the container*, and it fires **once per item**. Drawing it now,
> at rest, plants the mechanism: when the run comes (scene 3), you'll watch
> this pill re-fire — once for `"x"`, once for `"y"`, once for `"z"` — and
> because you saw it sitting there in scene 1, the re-firing reads as
> "the inside started again," not "a new thing appeared." The pill is the
> seed of the iteration lesson, planted three scenes early.

## The values, and why they're already "wired" before anything runs

Every string on screen traces to the rig's constants, not the scene file:

| surface | value | source |
|---|---|---|
| container name | `Loop` | `DipSwap a` at `phase=0` |
| container chip | blue `#2FB3FF` Repeat | `LOOP_COLOR` + `RepeatGlyph` |
| Function row | `Code` · `return <loop.currentItem>` | `itemValue()` at `phase=0` |
| Summary row | `Messages` · `Summarize <loop.results>` | `resultsValue` at `phase=0` |

Notice the Function row already shows `<loop.currentItem>` and Summary
already shows `<loop.results>`, at rest, before any run. These are
**unresolved reference tags** — plain row text right now, no glow. That's
deliberate and honest: in the product, a block's config *contains those
references* whether or not it has run; the reference is authored, the
*value* is produced at runtime. So the tags are visible from the first frame
(this is how the block is configured), and only the *resolution* — the tag
turning into `"x"` — waits for the run. Showing the tags at rest is the
setup that makes scene 3's resolution legible: you can't watch a tag resolve
if you never saw the tag.

## The animation, beat by beat

One tiny helper does all the timing. `c(lo, hi, a, b, easing)` is a clamped
`interpolate` on the clock `t` (seconds): it goes from `a` to `b` as `t`
crosses `lo → hi` and holds flat outside that window. Every entrance below
is one `c(...)` call with `EASING.out` — the project's entrance curve.

The seven beats fire in **flow order**, each starting just after the
previous one is well underway, so you read a chain assembling left to right:

| beat | window (s) | what enters |
|---|---|---|
| Start | 0.5 → 1.1 | the outer Start trigger fades in |
| edge 0 | 1.2 → 1.8 | the wire *draws* Start → container |
| container | 1.9 → 2.7 | the box, header, and inner Start pill fade in together |
| inner edge | 2.9 → 3.5 | the wire *draws* from the inner pill toward the Function slot |
| Function | 3.6 → 4.3 | Function 1 fades in **inside** the container |
| exit edge | 4.7 → 5.3 | the wire *draws* container → Summary |
| Summary | 5.4 → 6.1 | the consumer fades in |

> *"Why draw the wires with `progress` instead of fading them in?"* Because a
> wire is a *connection being made* — it has direction (source → target), and
> drawing it from one end to the other says "this now connects to that."
> `SimEdgePath`'s `progress` strokes the path via `strokeDasharray`, so the
> line grows from the source handle to the target. A wire that merely faded
> in would read as "a line appeared," losing the causal "A connects to B."
> The blocks fade (they're objects arriving); the wires draw (they're
> connections forming). Two verbs, matched to two kinds of thing.

> *"Why does the inner edge draw *before* the Function block lands (2.9→3.5,
> then 3.6→4.3)?"* So the eye is led *into* the container. The inner Start
> pill emits a wire toward an empty slot, and then the Function arrives where
> the wire points — you watch the inside get wired up, then populated. Doing
> it the other way (block first, then wire) would read as "a block appeared,
> then we connected it"; this order reads as "the inside is a little
> workflow, and here's its first step landing on the rails." The assembly
> order is teaching the structure.

> *"Why `EASING.out` on every entrance and no easing on... wait, there's no
> linear here."* Everything in this scene either travels (wires drawing) or
> arrives (blocks fading). The project's rule is `out` for entrances — a
> gentle decelerate-into-place that makes each element feel like it *settles*
> rather than snaps. Using one curve for all seven entrances is what makes
> the assembly feel composed rather than seven separate animations with seven
> personalities. Consistent easing is consistency.

> *"Why ~0.6s per beat and ~0.1–0.2s overlap between them?"* Each beat needs
> long enough to land as its own event (so you read seven distinct things
> arriving), but the slight overlap keeps the assembly *flowing* rather than
> ticking one-at-a-time with dead gaps. The cadence is chosen once and
> reused; the regularity is part of why it reads as a single build.

## The hold — from ~6.1s to the end of the scene

After Summary lands, nothing moves. The assembled workflow rests, balanced
and symmetric on the stage axis.

> *"Isn't a still frame dead air?"* No — the assembled rig is the thesis
> object of the entire video, and letting it sit is letting the structure
> land before anything starts moving through it. There's a downstream reason
> too: this tail is where the scene's narration plays, and a scene that ends
> on a **settled, motionless state** can be stretched to any length to fit
> the voiceover without freezing a motion mid-flight. (The video's timing is
> "extend-only": authored durations are visual minimums, and a VO sync can
> only lengthen a scene — see `Video.tsx`.) Ending on a settled hold is what
> makes that safe.

## How to think about the whole scene

Walk the decisions in order and each one answers a question:

1. *What's the structural claim?* A block holds blocks → assemble in flow
   order so you watch a block go **inside** another.
2. *How do I show only the assembly?* Render the **one** rig at `phase=0`
   with state props ramping → continuity is free, identity is the Loop.
3. *How does a workflow arrive?* Blocks fade, wires draw, left to right →
   you read a chain forming, not a picture appearing.
4. *How do I plant the iteration mechanism without running anything?* Draw
   the inner Start pill at rest → its re-firing later will read as "the
   inside started again."
5. *How do I make later resolutions legible?* Show the reference tags
   (`<loop.currentItem>`, `<loop.results>`) configured-but-unresolved from
   the first frame.
6. *How should it rest?* Settled and balanced on the axis → stretchable for
   VO, and the exact frame scene 2 inherits.

There's no single clever move; the scene is restraint applied six times, and
the quality is the sum of getting each small decision right.

## Exit state (what scene 2 inherits)

`workflow fully assembled · Loop identity (phase 0) · no rings, no run · all
wires drawn and held · camera at identity (no Camera wrapper) · reference
tags visible but unresolved`. Scene 2 opens on exactly this frame and begins
dimming the world while the container takes a selection ring and the editor
card slides in. Because both scenes render the same rig at the same
geometry, the boundary is identical down to the pixel.
