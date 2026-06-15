# Scene 6 — `the-run-record`  ·  archetype: **record-panel**

Source: `../source/scenes/TheRunRecordScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/components/OutputBundle.tsx`, `../source/layout.ts`.

This is the evidence scene. Scenes 2, 3, and 5 each *claimed* that the branch
not taken "never happened." Scene 6 proves it from the product's own run record:
five blocks sit on the canvas, and the log shows **three rows**. The missing
two rows are the whole beat. Read it as the worked example for "how do I make an
absence land — how do I teach that a thing *didn't run* by showing what the log
*doesn't contain*."

---

## What this scene is for

The video's deepest claim is that a branch not taken is not an error, not a
skip, not a thing that ran and was discarded — **it never executed at all.** The
docs say it plainly: *"Only the branch that is taken runs. A block on a branch
that didn't run produces no output."* Scene 6 turns that sentence into a visual
fact you can count: three log rows for five blocks, and a long, deliberate beat
of stillness so the absence registers.

One idea per scene: this is "the record proves the absence." It shows Run C's
log (the Router run from scene 5) — Start, Router, Support — and nothing else.

## The set piece dims; the record rises over it

```ts
const dim = interpolate(t, [0.4, 1.1, 6.8, 7.6], [0, 1, 1, 0], {easing: EASING.inOut});
```

The whole fork — every block, every edge — dims to 0.35 (not gone, just
backgrounded) while the `OutputBundle` panel rises over it. Critically, the fork
**does not move.** Scene 6 renders the same `<Fork phase={1}/>` at its exact
scene-5 position, just dimmed, and the panel floats above it at a fixed overlay
position (`BUNDLE_X/Y`, scale 1.7). When the panel leaves, the fork undims back
to template. The set piece is never torn down — it's the same continuity
contract as every other scene, here expressed as "dim, overlay, undim."

> *"Why keep the dimmed fork on screen at all — why not cut to a clean log?"*
> Because the beat is a *comparison*: five blocks on the canvas, three rows in
> the log. If the canvas weren't visible behind the log, "three rows" would be
> just three rows — there'd be nothing to count them against. Keeping the
> five-block fork dimmed-but-present is what makes the three-row log read as
> *two short*. The absence only exists relative to the thing present behind it.

## Three rows, staggered, then a held stillness

```tsx
logs={[
  { name: "Start",   color: "#2FB3FF", glyph: <StartGlyphW/>,  reveal: reveal(1.7) },
  { name: "Router",  color: "#28C43F", glyph: <RouterGlyphW/>, selected: true, reveal: reveal(2.1) },
  { name: "Support", color: "#33C482", glyph: <AgentGlyphW/>,  reveal: reveal(2.5) },
]}
```

The log column staggers in three rows — Start at 1.7s, Router at 2.1s, Support
at 2.5s — and then **stops.** No fourth row arrives. The panel holds (the
content is fully revealed by ~2.9s but the panel stays up until ~6.6s). That
long hold after the third row is not dead air — it *is* the beat:

> *"A still log for three-plus seconds — isn't that the kind of dead frame the
> craft rules warn against?"* No, and the distinction is exact. A still frame is
> dead when nothing is being said. Here the stillness is the *content*: the
> viewer's eye, having watched three rows land, waits for a fourth — and it
> doesn't come. The held stillness is the sentence "...and that's all there is."
> You cannot rush this. Cut away after the third row lands and the absence never
> registers; the viewer assumes the log just scrolled off. The hold is what
> converts "three rows appeared" into "only three rows ran."

Five blocks on the canvas (Start, Router, three agents); three rows in the log
(Start, Router, Support). **No Sales row. No Billing row.** Sales and Billing are
present and dimmed on the canvas behind — you can see they exist — and they are
*absent* from the log. That is the proof: they didn't run, so they left no trace.

## "Selected" is a background state, never a word

```tsx
{ name: "Router", ..., selected: true, ... }
```

The Router row carries `selected: true`, which renders the product's active-row
background (`#2c2c2c` in `OutputBundle`) — the same highlight the real log uses
for the currently-inspected step. It is **not** a label, not the word
"selected," not a checkmark. State is shown with the product's own visual state,
exactly the house rule. (Earlier ambiguity about whether this read as a word was
a flagged concern; resolving it to a pure background state is the fix.)

## The output panel: one quiet row, as scenery

```tsx
values={[ { key: "selectedRoute", type: "string", value: "support", reveal: reveal(3.1) } ]}
```

The output side of the bundle shows a single row: `selectedRoute: "support"` —
the doc-authored output name plus the docs' own route. It reveals last (3.1s)
and is **never highlighted.** It's scenery: it grounds the panel as a real run
output without competing with the three-rows-vs-five-blocks beat, which is the
scene's actual subject.

Note what is deliberately *not* shown: no log durations, no `reasoning` string,
no tokens, no cost. Durations and reasoning are pending artifacts (no real run
has supplied them), so they're **omitted rather than invented** — the
`OutputBundle` renders duration-less rows on purpose. Tokens and cost were cut
because a fifth idea (the Router's model-call cost) would brush the structured-
output exclusion and crowd the scene's one beat. Restraint is the discipline:
the scene says exactly one thing, "three ran, two didn't," and shows only what
serves it.

> *"Why not show the model-call cost here — isn't 'the Router costs money'
> relevant?"* It's true and it's tempting, but it's a *different* lesson, and
> scene 6 already has its one idea. The video's spine is the fork and the
> one-branch-lights fact; cost is an adjacent topic that would split the
> scene's focus. The build cut it explicitly. One idea per scene means cutting
> the true-but-adjacent thing, not just the false one.

## How to think about the whole scene

1. *What's the claim to prove?* A branch not taken never ran — no log, no
   output, no cost.
2. *How do I make an absence visible?* Keep the five-block fork dimmed behind a
   three-row log, so three reads as *two short*.
3. *How do I make the absence land?* A long held stillness after the third row,
   waiting for a fourth that never comes.
4. *How do I mark the chosen step?* The product's active-row background, never a
   word or a check.
5. *What do I show in the output?* One quiet `selectedRoute` row as scenery;
   omit durations/reasoning/cost rather than invent them or split focus.

## Exit state (what scene 7 inherits)

`panel gone · fork undimmed back to phase=1 Router template · identity camera`.
Scene 7 opens on this Router and runs the scene-4 morph in reverse to bookend
the video.
