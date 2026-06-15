# Scene 4 — `swap-the-decider`  ·  archetype: **morph-swap + smooth growth + 2→3 lanes**

Source: `../source/scenes/SwapTheDeciderScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/layout.ts`, `../source/components/SimBlock.tsx`.

This is the hinge of the video. Scenes 1–3 taught one decider — a Condition,
picking by rule. Scene 4 changes *who picks* without changing anything else,
and it does it as **one continuous morph**: the Condition becomes a Router in
place, two lanes grow to three, and not a single block teleports. Read it as
the worked example for "how do I show 'same workflow, one part swapped' as a
transformation rather than a cut" — the single hardest continuity problem in
the whole project, solved by making the two deciders two *states* of one set
piece.

---

## What this scene is for

The thesis of the video is "the only question is *who picks*." Scene 4 is where
that question gets its answer made physical: when the decision can't be written
as a rule — when it depends on *meaning* — you swap the Condition for a Router.
The scene has to make the swap read as **editing one block**, not as deleting
one workflow and drawing another. Everything that's the same (Start, the
decider's position, the destination column) must visibly *stay*; only the parts
that change (header identity, branch labels, the new Context/Model rows, the
third lane) move.

One idea per scene: this is "swap the decider." No run fires here — scene 4 is
purely the transformation. The Router doesn't *decide* anything until scene 5.

## The whole scene is one number: `phase`

```ts
const phase = interpolate(t, [1.2, 7.6], [0, 1], {easing: EASING.inOut, ...clamp});
```

Scene 4 drives `phase` from 0 to 1 over **1.2 → 7.6s**, under a blue selection
ring on the decider, and hands `<Fork/>` nothing else but the ring and Billing's
edge-draw. Every visual change — header crossfade, label dip-swaps, row growth,
lane glide, the third lane appearing — is a function of that one `phase` value,
defined once inside `_fork.tsx`'s `morphCurves`:

```ts
export const morphCurves = (phase: number) => ({
  headerMix:     sub(phase, 0.0, 0.18),   // Condition chip/glyph/name → Router
  labelMix:      sub(phase, 0.1, 0.3),    // branch + agent labels dip-swap
  ctxReveal:     sub(phase, 0.3, 0.5),    // Context row grows in
  modelReveal:   sub(phase, 0.45, 0.65),  // Model row grows in
  branchCReveal: sub(phase, 0.6, 0.8),    // the Billing route grows in
  laneMix:       sub(phase, 0.55, 0.85),  // 2 lanes glide to 3-lane positions
  destCMix:      sub(phase, 0.78, 1),     // Billing's agent fades in
});
```

This is the architectural payoff of scene 1's "one set piece" decision. Because
`headerMix`, `labelMix`, the row reveals, and `laneMix` are all *sub-ranges of
the same phase*, the morph has an internal stagger — header first, then labels,
then rows growing, then lanes gliding, then Billing arriving — that reads as a
deliberate, legible edit. And because it's a single monotonic function of one
number, scene 7 can replay the *exact same move in reverse* simply by running
`phase` from 1 back to 0. The forward morph and the reverse morph are not two
animations; they are one animation and its mirror.

> *"Why not just crossfade the whole Condition block to the whole Router block?"*
> Because a whole-block crossfade is a dissolve — it says "this thing was
> replaced by that thing." The staggered morph says "this block was *edited*:
> its header changed, then it grew rows, then a route was added." The viewer
> watches a configuration change, which is the truth: in the product you don't
> delete a Condition and draw a Router, you change the block's type and
> reconfigure it. The stagger *is* the meaning.

## The header identity crossfade

The decider's header carries two identities at once and crossfades between them:

```tsx
name={<DipSwap a="Condition" b="Router" mix={m.headerMix} />}
color={BLOCK_COLORS.condition}                       // #FF752F base
headerMorph={{ color: BLOCK_COLORS.router,           // #28C43F overlay
               glyph: <RouterGlyphW/>, mix: m.headerMix }}
```

`SimBlock`'s `headerMorph` draws the Router's green chip and Connect glyph
*over* the Condition's orange chip and Conditional glyph, fading the overlay in
as `mix` rises while the base glyph fades out. The name `DipSwap`s
Condition→Router. Two real product identities, blended in the same 24px chip,
in place. The orange `#FF752F` and the green `#28C43F` are both re-derived from
the registry — the Router is its *own* green, deliberately not the agent green
`#33C482`.

## Smooth growth: rows that don't pop

The Router has rows the Condition doesn't — `Context | <start.input>` and
`Model | claude-sonnet-4-6`. They **grow in at their exact natural slot
heights** rather than popping into existence. This is what `revealStyle` in
`SimBlock` is for: a mid-reveal row animates its slot height and cancels the
flex gap (`marginTop: -ROW_GAP * (1 - reveal)`) so the block grows continuously
and never jumps when a row mounts:

```ts
const revealStyle = (reveal) => reveal >= 1 ? {} : {
  height: ROW_LINE_H * reveal,
  marginTop: -ROW_GAP * (1 - reveal),
  overflow: "hidden",
  opacity: reveal,
};
```

The block literally gets taller as Context, then Model, then the Billing branch
grow in — each at the height it will finally occupy, interpolated from zero. No
relayout, no pop.

## The hardest part: edges that track a growing block

Here is the detail that makes or breaks the scene. The decider's branch handles
move *while the block is growing* — every row that grows above a branch row
pushes that branch's handle down. The edges leaving those handles must follow,
continuously, every frame. They do, because both the handle Y and the edge
anchor are recomputed from the *same* reveal math:

```ts
// in _fork.tsx
const reveals = deciderReveals(m.ctxReveal, m.modelReveal, m.branchCReveal);
const eA = branchEdge(reveals, m.laneMix, 0);   // edge A anchor
// branchEdge → branchHandleY(reveals, k) → DEC_Y + simBlockItemCenterY(reveals, 2 + k)
```

`simBlockItemCenterY` walks the reveal list and returns the center Y of branch
`k` *given how far each row above it has grown*. The handle the `SimBlock`
draws and the edge anchor the `<Fork/>` computes both call it with the same
reveals, so they are pinned together at every frame of the growth. The branch
handle and its edge are never two things that happen to line up — they are one
position computed once.

> *"What would break if the edge anchors were static while the block grew?"*
> The edges would tear away from their handles mid-morph — the wire starting in
> empty space above or below the row it's supposed to leave. It's the single
> most visible way a morph like this looks broken. The fix isn't to animate the
> edges separately and hope they match; it's to derive the handle and the edge
> from the same function so they *can't* disagree.

## 2 lanes become 3

The destination column glides from two lanes to three. `laneMix` interpolates
each lane's Y via `destY`: Escalate (top) glides up to Sales' position, Reply
(middle-ish) glides to Support's center line, and the third lane, **Billing**,
appears. Billing's agent fades in with `destCMix`, and its edge draws from the
*new* third branch handle:

```ts
const edgeCDraw = interpolate(morphCurves(phase).destCMix, [0.05, 1], [0, 1], ...);
```

So the third route's edge is gated to draw *as its lane arrives* — it never
draws into empty space, and `progress` never runs backward. The agents'
names and Messages rows dip-swap in sync (Escalate→Sales, Reply→Support) so the
gliding blocks are also *relabeling* as they move — one motion carrying both the
geometry change and the content change.

> *"Why does the decider keep the Condition's x even though the Router example
> authors it 15px left?"* Declared deviation, and it's the right call: the
> decider is the thing being *edited in place*, so it must not move at all
> during the swap. A 15px slide of the very block you're claiming "stayed put"
> would undercut the whole "same block, reconfigured" reading. Continuity of
> the edited block beats fidelity to a coordinate that differs only because the
> two docs examples were authored separately.

## The selection ring frames it as "editing"

```ts
const editing = t >= 0.6 && t < 8.4;
decider={{highlighted: editing}}
```

A blue selection ring sits on the decider for the whole morph and releases at
the end. That ring is the product's own "this block is selected" state, and it
does the framing work: you're not watching a workflow rebuild itself, you're
watching *someone edit the selected block*. The ring is on before the morph
starts and off after it settles — bracketing the transformation as a single
deliberate edit.

## How to think about the whole scene

1. *What's the claim?* Same workflow, one part swapped → editing one block,
   not redrawing the graph.
2. *How do I make a swap continuous?* Make the two deciders two states of one
   set piece, driven by a single `phase`; never mount/unmount.
3. *How do I make it legible?* Stagger the sub-moves (header → labels → rows →
   lanes → Billing) as sub-ranges of that one phase.
4. *How do new rows appear without a pop?* Grow them at their exact slot
   heights via `revealStyle`.
5. *How do edges survive a growing block?* Derive handle Y and edge anchor from
   the same reveal math so they can't drift apart.
6. *How do I frame it as an edit?* A selection ring on, morph, ring off.

## Exit state (what scene 5 inherits)

`fork at phase=1 (full Router: green header, Context/Model rows, three routes
Sales/Support/Billing, three lanes) · selection ring released · identity
camera`. Scene 5 opens on this Router template and runs it.
