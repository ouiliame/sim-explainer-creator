# Scene 2 — `the-record`  ·  archetype: **record-panel** (first landing)

Source: `../../../../projects/sim-explainers/src/videos/module-7-logs/scenes/V2TheRecordScene.tsx`,
`scenes/_v2.tsx` (`buildLogRows`, `triageTree`, `TicketChain`),
`layout-v2.ts`, `src/components/OutputBundle.tsx`.

This is where the video's thesis object arrives. Scene 1 ran the chain once
and it was over in a blink. This scene answers the question that planted —
*"that's it?"* — by revealing that the run wrote itself down. Read it as the
worked example of **landing a record**: how a log list arrives entry-per-block
in run order, and how the selected block's typed output tree comes up beside
it. Scenes 3 and 4 are variations on the panel this scene builds.

---

## What this scene is for

One idea: **the run left a complete record.** Not "here's a logs feature" —
*the run you just watched recorded every block, in order, with its real
timing.* The scene has to do three concrete things and nothing else:

1. Get the chain out of the way (it's no longer the subject — the record is).
2. Bring the record panel up as a real object.
3. Reveal the log rows **in run order** so the list reads as the run filling it
   in, then select one block and show its output tree.

That's the whole scene. Resist showing the backward trace here, or the
tool-call detail (scene 3), or the recap (scene 5). One idea: *the record
exists, and it's ordered and timed.*

## What it looks like

The four-block chain glides from frame-center up to the top of frame and dims
to 0.35 — present, but demoted to context. Beneath it, the `OutputBundle` panel
rises and fades in: a **Logs** column on the left (one row per block) and an
**Output** panel on the right (the selected block's typed tree). The four log
rows reveal top to bottom — `Start 32ms`, `Triage 12.2s`, `BuildRow 115ms`,
`LogTicket 111ms` — each with its real duration. Triage's row arrives already
selected, and its output tree reveals beneath the Output header: `content`,
`tokens`, `toolCalls`. Late in the scene, the **12.2s** on Triage's row glows
blue for a beat, then releases.

## The one real decision: the chain demotes, the record promotes — on one set piece

The scene renders the **same single set piece** as every other v2 scene: the
`TicketChain` plus the `OutputBundle`. It changes only state props.

```tsx
const glide = clamp(0.3, 1.7, 0, 1, EASING.inOut);
const dim   = clamp(0.7, 1.9, 0, 1, EASING.inOut);
// ...
<TicketChain glide={glide} start={{dim}} triage={{dim}} build={{dim}} ticket={{dim}}
  edges={[{opacity: 1 - 0.65 * dim}, ...]} />
```

Two things to take from this.

**The chain doesn't disappear — it moves and dims.** The instinct is to cut the
chain away once we're done with it. Don't. The chain is *what the record is
about*; in scenes 3 and 4 the record's values point back at it. So it glides to
the top and drops to 0.35 opacity — still legible, no longer focal. The
`dim` ramp and the `glide` ramp run on overlapping but offset windows
(`0.3→1.7` and `0.7→1.9`) so the chain is already on its way up before it
starts dimming; it doesn't fade in place then jerk upward.

> *"Why is the chain's geometry not in this file?"* Because continuity is owned
> by `layout-v2.ts`. `chainY(glide)` interpolates between `CHAIN_Y_CENTER` (432)
> and `CHAIN_Y_TOP` (56); the scene just feeds it a `0→1` number. Scene 1 passed
> `glide={0}`, scene 3 passes `glide={1}`. The glide happens *exactly once*, in
> this scene, and is interpolated — never a cut. Both neighboring scenes inherit
> the endpoints from the shared layout, so the boundaries are identical by
> construction.

**The panel is the real port, scaled as a unit.** `OutputBundle` is a verbatim
copy of the docs' run-inspector miniature, rendered at native size and scaled
`1.62×` (from `layout-v2.ts`). You are never designing a logs panel; you're
configuring the one that ships in the product. The Logs/Output split, the type
badges, the dark surface ramp — all come from the port.

## The panel rise

```ts
const panelOp   = clamp(1.4, 2.2);        // opacity 0→1 over 1.4s→2.2s
const panelRise = (1 - panelOp) * 30;      // starts 30px low, settles to PANEL_Y
```

The panel fades in *and* rises 30px into place — a small upward settle, not a
hard appearance. It's gated behind the chain's glide (`1.4s` start, after the
glide began at `0.3s`) so the eye finishes following the chain up before the
record arrives. Two motions, sequenced, never stacked.

> *"Why rise only 30px?"* It's a settle, not an entrance from off-screen. The
> panel belongs at `PANEL_Y` (348); the 30px is just enough to read as "arriving"
> without looking like it flew in. Big travel distances read as cinematic; this
> is a diagram, so the motion is small and quiet.

## The rows populate in run order — this is the core mechanic

```ts
const rowReveal = (i: number) => clamp(2.2 + i * 0.3, 2.6 + i * 0.3);
```

Each log row fades in over a 0.4s ramp, and each row starts **0.3s after the one
above it** — so the rows arrive top to bottom: Start, then Triage, then
BuildRow, then LogTicket. This is not decoration. **The reveal order is the run
order.** The list isn't a static table that fades in as a block; it *fills in*
the way the run produced it, which is the whole point — a log is a run writing
itself down, in sequence.

The rows themselves come from `buildLogRows`, which is purely declarative:

```ts
buildLogRows({
  reveals: [rowReveal(0), rowReveal(1), rowReveal(2), rowReveal(3)],
  selected: [0, triSelected, 0, 0],     // only Triage selected
  triageDurationGlow: durGlow,
})
```

Every value in that builder is real (`32ms`, `12.2s`, `115ms`, `111ms` from the
run artifact). The scene file holds *only timing*; the builder holds the truth.

> *"Why 0.3s stagger and not the 0.35 the table scenes use?"* Slightly tighter,
> because these are four rows of a single object arriving, not five independent
> records being established. The eye should read them as one list assembling,
> with enough beat between rows to feel the order. Once you pick a stagger for a
> kind of reveal, stay consistent within the video.

## Triage arrives selected, and its tree reveals

```ts
const triSelected = clamp(3.6, 4.0);                          // row 1 selects
const treeReveal  = (i) => clamp(4.2 + i * 0.35, 4.7 + i * 0.35);  // 3 nodes
// ...
values={triageTree({ reveals: [treeReveal(0), treeReveal(1), treeReveal(2)] })}
```

After the rows finish arriving, Triage's row gets a selection background
(`triSelected` ramps the row's `selected` mix 0→1), and *then* its output tree
reveals node by node: `content`, `tokens`, `toolCalls`, each 0.35s apart. The
sequencing is deliberate — rows finish, *then* a selection, *then* the tree —
three ideas, each given its own air. Stacking them would blur all three.

Why Triage? Because it's the block that matters: the agent step, the one that
took 12.2s, the one whose tool calls scene 3 explores. Selecting it now makes
its tree the panel's resting state, which scenes 3, 4, and 5 all inherit.

> *"What is `triageTree`'s shape, and why these three nodes?"* It's exactly
> module-5's record shape — `content: string`, `tokens: object`,
> `toolCalls: array` — with type badges from the port. Cost was in the first cut
> and **removed** in the fix cycle: the cost node pushed the panel past the frame
> bottom, and the curriculum says keep light on costs. So the tree is the
> honest-but-trimmed bundle: three nodes, all real, all typed.

## Where the time went — the duration glow

```ts
const durGlow = interpolate(t, [6.6, 7.2, 8.6, 9.3], [0, 1, 1, 0], {...});
```

Late in the scene, the **12.2s** text on Triage's row blends from muted grey to
selection blue, holds for ~1.4s, then releases. That's it — no caption, no
arrow. The glow says *the record already shows where the time went*: three of
the four blocks ran in milliseconds; one took twelve seconds, and the record
told you which.

> *"Why glow the duration and not, say, draw a callout?"* Because a log answers
> "where did the time go" by *being a list of durations* — the answer is already
> on screen, you just have to point. A color shift on the real number is the
> minimum gesture that points. A callout box would be inventing UI the product
> doesn't have; the glow uses the number that's already there.

The glow is built to **release before the cut** (back to 0 by 9.3s) so scene 3
inherits a clean panel with no stray highlight — see the exit contract.

## How to think about the whole scene

Walk the decisions and each answers a question:

1. *The record is the new subject — what happens to the old one?* The chain
   glides up and dims → demoted to context, not deleted.
2. *How does the record arrive as an object?* The real `OutputBundle`, scaled,
   fading and rising into place → product surface, never a hand-built panel.
3. *How do I say "a log is the run, in order"?* Reveal the rows top-to-bottom in
   run order → the list reads as the run writing itself down.
4. *How do I show "the record kept what the block did"?* Select Triage, reveal
   its typed tree → named, typed values under the block's name.
5. *Where did the time go?* Glow the real 12.2s → the answer was already in the
   list.

No clever single move. Five small decisions, sequenced so no two animate at
once.

## Exit state (what scene 3 inherits)

`chain at top + dim 0.35 · panel fully up · all four log rows revealed · Triage
row selected · Triage's full tree revealed · Output tab emphasis (inputTab=0) ·
zero highlights (durGlow released by 9.3s)`. Scene 3 opens on exactly this frame
(`glide={1}`, Triage selected, full tree, `dim:1`) and starts highlighting
inside the tree without moving anything. Because both scenes render the same set
piece and scene 2 ends on a settled state, the boundary is identical and the
scene can stretch to fit narration safely.
