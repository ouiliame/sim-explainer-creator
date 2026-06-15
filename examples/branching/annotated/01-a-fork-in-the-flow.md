# Scene 1 — `a-fork-in-the-flow`  ·  archetype: **assemble**

Source: `../source/scenes/AForkInTheFlowScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/layout.ts`, `../source/components/SimBlock.tsx`.

This is the opening scene, and it does exactly one thing: it builds the
**fork** in front of you and shows you the one structural fact the whole
video turns on — that the split lives *inside a single block*, and each
branch is that block's own output port. Read it as a worked example. Every
choice below is the first time you make a decision you'll make again in your
own opening scene.

---

## What this scene is for

The video's whole story is "a workflow doesn't have to be a line — it can
fork, and on every run exactly one branch fires; the only question is *who
picks*." Before any of that can land, scene 1 has to put the fork on screen
as a concrete object and make one thing unmistakable: **the branching is not
two separate wires leaving the block from the same spot — it's two rows, and
each row has its own handle.** That handle-per-row anatomy is the seed of the
entire rest of the video. Get it on screen now, with no run, no decision, no
words, and the later "one branch lights" beats have something true to land
against.

So the rule the scene follows is *one idea per scene*: this scene is "here is
the shape, and here is where the branches come from." Full stop. No run fires
(that's scene 2). No model, no rule, no decision is shown. Resist the urge to
also demonstrate the pick here — the assembly *is* the idea.

## What it looks like

A canvas (the dotted Sim editor background, on `#1b1b1b`), empty. Then, in
the docs preview's own assembly order: **Start** fades in (a Start block,
`Input | Ticket`), an edge draws rightward to the decider, and the
**Condition** fades in — `#FF752F` chip, the conditional glyph — already
showing **both branch rows**: `If | <start.priority> === 'high'` and
`else | -`. Then the new thing, staggered so the eye catches it: the **If
row's own handle** lights blue and its edge draws up-and-right to **Escalate**
(an agent, which fades in); then the **else row's handle** lights and its edge
draws down-and-right to **Reply**. The frame settles into a balanced
four-block fork, and the two branch handles each take one more sequential blue
beat — top, then bottom — before settling to the resting handle gray.

## The one real decision: render the whole set piece, port the docs example verbatim

The scene renders `<Fork phase={0} />` and almost nothing else. Two things to
take from this.

**Use the real product blocks, and the real authored example — never a
hand-drawn diagram.** The fork on screen is `CONDITION_ROUTE_WORKFLOW`, the
docs' own condition-route preview (`examples.ts:235`), ported coordinate-for-
coordinate at ×1.5: Start `{Input: Ticket}`, Condition with branches
`If | <start.priority> === 'high'` and `else | -`, agents Escalate and Reply.
You are never designing a fork here; you are configuring the one that ships in
the product's documentation. The expression inside the If row is the docs'
literal, down to the `=== 'high'`.

**`phase` is the whole video.** `<Fork/>` is a single set piece parameterized
by one number, `phase`: at `0` it's the two-lane Condition; at `1` it's the
three-lane Router. Scene 1 holds `phase={0}`. Every other scene renders the
*same* `<Fork/>` and only changes state props (which row glows, which lane
dims, where the camera is) or drives `phase` between `0` and `1`. This is the
continuity contract made mechanical:

> *"Why one component for two different workflows?"* Because of what happens
> at the swap in scene 4. If the Condition and the Router were two separate
> components that got mounted and unmounted, the swap would be a cut — a flash,
> a relayout, a jump. By making them two *states* of one component, the swap
> becomes an interpolation: the header crossfades, rows grow at their exact
> natural heights, lanes glide. Continuity stops being something you check and
> becomes something you can't break. Scene 1's job is to mount that one set
> piece in its phase-0 state and never tear it down for the rest of the video.

## The anatomy you must get right: the branch row IS the port

This is the load-bearing detail of the entire video, so it gets its own
section. In Sim, a Condition or a Router does **not** emit from a single
header source handle the way a normal block does. Each *branch row* carries
its own source handle, pinned at the right edge of that row. The header source
handle is **suppressed** the moment branches exist. In the port
(`SimBlock.tsx`) this is one line, lifted straight from the product's
`preview-block-node.tsx`:

```ts
const showHeaderSource = !hideSourceHandle && branches.length === 0;
```

So a block with branches has no handle next to its title — it has one handle
per branch row, vertically centered on each row, drawn in the *outer* wrapper
(the card clips overflow) at a Y computed from the same row-reveal math the
edges use:

```ts
const cy = simBlockItemCenterY(itemReveals, rows.length + bi);
```

Why this matters so much: it's the visual proof that **the fork is one block,
not a junction.** A viewer who has only ever built linear workflows reads
"branching" as "a wire splits." The truth Sim wants taught is subtler and more
powerful — the branching is *configuration inside one block*, and each branch
is a labeled, independently-firing output. Scene 1 teaches that wordlessly by
lighting **the If row's handle** before its edge draws, then **the else row's
handle** before its edge draws. The handle is the subject; the edge is just
the handle's consequence.

> *"Why stagger the two branch edges instead of drawing them together?"*
> Because drawing them together reads as "the block forks into two" — a
> simultaneous split. Drawing the If handle, then its edge, *then* the else
> handle, then its edge, reads as "this row is a port → it goes here; this
> other row is also a port → it goes there." The stagger is what converts a
> picture of a Y-shape into a sentence about output rows. Two ideas drawn at
> once blur into one; drawn in sequence they teach order.

## The geometry, and why nothing ever moves

All positions live in `layout.ts`, derived from the docs coordinates ×1.5 and
centered as a unit. Three facts to internalize, because every later scene
leans on them:

- **The decider never moves.** `DEC_X` and `DEC_Y` are constants. Even though
  the docs' Router example authors the decider 15px left of the Condition
  example, the layout pins it at the Condition's x in *both* phases. A
  declared, deliberate deviation: "the decider never moving beats a 15px
  doc-coordinate difference between two separate examples." Continuity is worth
  more than coordinate purity.
- **Start never moves** (the docs keep it level with the decider).
- **The destination lanes' Y is a function of `phase`** — `destY(laneMix)`
  lerps each lane between its condition-phase row and its router-phase row.
  At `phase=0` (this scene) that resolves to the two condition lanes:
  Escalate at `DEC_Y − 90`, Reply at `DEC_Y + 105`.

Because everything is a pure function of `phase` plus per-frame state, no scene
ever relayouts. The boundary between scene 1 and scene 2 is identical by
construction: scene 2 opens on `phase={0}` too, at identity camera, with the
fork exactly as scene 1 left it.

## The animation, beat by beat

One helper does all the entrance timing. `reveal(t0, dur=0.5)` ramps 0→1 over
`t0 → t0+dur` with `EASING.out` (the house entrance curve). A second helper,
`beat(t0)`, is the handle pulse: up over 0.3s, hold to 0.7s, down by 1.0s.

### (a) Start fades in — `reveal(0.5)`

The Start block's opacity comes up over **0.5s → 1.0s**. A short beat of empty
canvas first reads as a deliberate open, not a mid-load render.

### (b) The edge draws to the decider — `reveal(0.9, 0.55)`

Edge 0 draws left-to-right over **0.9 → 1.45s**, slightly overlapping Start's
arrival so the chain reads as connected, not assembled-in-pieces. `SimEdgePath`
animates draw via `strokeDasharray`, so the line *grows* from Start toward the
decider — the product's own "connection made" feel.

### (c) The decider fades in with both branch rows — `reveal(1.2)`

The Condition arrives over **1.2 → 1.7s**, already showing both branch rows.
It does not "grow" rows here — at `phase=0` the two branch rows are fully
present (`opacity: 1` in the branch list); only the Router's Context/Model/
Billing rows are reveal-gated, and those are at zero this whole scene.

### (d) The branch handles light and their edges draw — the new thing

```tsx
destA={{opacity: reveal(2.9)}}   edgeA={{progress: reveal(2.5, 0.6)}}
destB={{opacity: reveal(4.3)}}   edgeB={{progress: reveal(3.9, 0.6)}}
branchA={{handleGlow: Math.max(beat(2.2), beat(5.6))}}
branchB={{handleGlow: Math.max(beat(3.6), beat(6.3))}}
```

Walk the timing for lane A (the If row → Escalate): the **handle beats blue at
2.2s** (`beat(2.2)`), *then* the **edge draws at 2.5s** (`reveal(2.5, 0.6)`),
*then* **Escalate fades in at 2.9s** (`reveal(2.9)`). Handle → edge →
destination, in that order, ~0.35s apart. Lane B repeats the move one beat
later: handle at 3.6, edge at 3.9, Reply at 4.3.

> *"Why does the handle light* before *the edge draws?"* Because the lesson is
> "the row is the source." If the edge drew first and the handle lit second,
> you'd read "a wire appeared, and oh, it happens to start at this row." Lit
> handle first says "*this row* is going to emit," and then it does. Cause
> before effect, every time.

### (e) The settling beats — `Math.max(..., beat(5.6))` / `beat(6.3)`

After both lanes are drawn, each branch handle takes one more blue beat —
**top at 5.6s, bottom at 6.3s** — then settles to the resting handle gray
(`pal.wire`). This is a tiny "both ports are real and live" gesture over the
finished, balanced frame, and it's sequenced top-then-bottom to pre-teach the
top-to-bottom reading order that scene 3 will make load-bearing.

> *"Isn't that an extra animation over a finished frame — clutter?"* It's the
> opposite. It's the scene's thesis statement said once more, quietly, after
> the assembly noise has died down: *these two handles are the whole point.*
> One beat each, sequenced, then still. If it pulsed continuously it would be
> decoration; one deliberate pass reads as emphasis.

## How to think about the whole scene

Walk the decisions and you can see a question driving each:

1. *What's the object?* A fork → render the real `<Fork/>` set piece at
   `phase={0}`, the docs' verbatim condition example.
2. *How do I show only the fork, with continuity for free?* One component
   parameterized by `phase`; never mount/unmount the deciders separately.
3. *What's the one fact this whole video needs?* That branching lives inside
   one block as per-row ports → light the branch handle before its edge.
4. *How do I say "this row is an output port" without a caption?* The
   product's own per-branch source handle, suppressing the header handle —
   product vocabulary, never words.
5. *How do I pre-teach reading order?* Assemble and settle top-then-bottom.

There's no single clever move — it's the product's real anatomy, rendered
honestly, in an order that teaches.

## Exit state (what scene 2 inherits)

`fork fully assembled at phase=0 · both lanes drawn · both branch handles
settled to resting gray · no run, no glow, no dim · identity camera`. Scene 2
opens on exactly this frame and fires the first run into it.
