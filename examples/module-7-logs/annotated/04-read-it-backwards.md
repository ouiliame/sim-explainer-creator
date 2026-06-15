# Scene 4 — `read-it-backwards`  ·  archetype: **the trace** (the centerpiece)

Source: `../../../../projects/sim-explainers/src/videos/module-7-logs/scenes/V2ReadItBackwardsScene.tsx`,
`scenes/_v2.tsx` (`logTicketInputTree`, `buildRowInputTree`, `triageInputTree`,
`startOutputTree`, `ResolvedTag`, `GlowText`), `src/components/OutputBundle.tsx`.

This is the scene the whole video exists for, and the longest (20s). Everything
before it built the record as a concrete, typed, ordered object so that *this*
scene can walk it. The move: pick a value the run wrote, and read the record
**backwards** — which block produced it, what that block read — stepping
right-to-left until you reach the source. Read it as the worked example of the
**backward trace**: provenance told entirely by references resolving and a
selection ring walking the chain, with no words and no new geometry.

---

## What this scene is for

One idea: **pick any value and trace it back to its origin through the record.**
Debugging is reading the record backward from the symptom; here, on an all-green
run, the identical mechanic is taught as *provenance reading* — "where did this
value come from?" The scene walks LogTicket → BuildRow → Triage → Start, four
blocks, each naming the one before it, until the value's entire ancestry is on
screen.

This is the only scene that swings the panel to the **Input** tab, because the
backward read is about *what each block read*, not what it produced. (Start is
the exception — it's the source, so it goes back to Output.)

## What it looks like

Selection jumps from Triage to **LogTicket** (its block undims and blue-rings at
the top; the panel's tab emphasis swings to **Input**). LogTicket's input shows
`data: <buildRow.result>`, which **resolves** to `{ category: "billing", … }` —
and "billing" holds a blue provenance glow. The reference names its producer, so
selection steps **left** to **BuildRow**: its input `content: <triage.content>`
resolves to `billing — Alex Johnson charged twice…`. Step left to **Triage**: its
prompt `messages: Classify: <start.message>` resolves to the real customer
message. Step left to **Start**: the tab swings back to **Output**, and
`message` shows the message itself — the source. The blue ring has walked the
whole chain right-to-left. Then everything reverts: selection returns to Triage,
Output tab, full tree, uniform dim — exactly scene 3's resting state.

## The one real decision: provenance IS the product's reference, resolving

The scene never draws a "data came from here" arrow. It uses the grammar Sim
already has: a `<block.field>` reference. The teaching move is to make that
reference **resolve** — blend from the tag form to the literal value — at the
moment selection lands on the block that produced it.

```tsx
// LogTicket's Input tree (from _v2.tsx):
{ key: "data", type: "object", value: (
    <ResolvedTag tag="<buildRow.result>"
      value={<>{"{ category: "}<GlowText text='"billing"' glow={billingGlow}/>{", … }"}</>}
      glow={tagGlow} resolve={resolve} /> ) }
```

`ResolvedTag` is the product's own reference chip; `resolve` (0→1) blends it from
showing `<buildRow.result>` to showing the literal `{ category: "billing", … }`.
That single gesture says three things at once: *this block read a reference*,
*the reference points at BuildRow's result*, and *here's the value it became*.
No caption could be as precise, and a caption would violate the no-words rule.

> *"Why is resolving the reference the right way to show provenance?"* Because the
> reference literally *is* the provenance — `<buildRow.result>` says, in the
> product's own language, "this came from BuildRow's result." The scene doesn't
> have to invent a way to depict lineage; it animates the thing that already
> encodes it. That's the port-don't-design rule applied to a *behavior*, not just
> a surface: the product already has a grammar for "where this came from," so use
> it.

## The walk is built from differences, so exactly one block is ever selected

The five selection moves are plain clamped ramps, strictly sequential:

```ts
const m1 = c(0.8, 1.4);   // Triage → LogTicket
const m2 = c(5.0, 5.6);   // LogTicket → BuildRow
const m3 = c(9.2, 9.8);   // BuildRow → Triage
const m4 = c(13.4, 14.0); // Triage → Start
const m5 = c(16.6, 17.2); // Start → Triage (revert)
```

The trick is that each per-row selection mix is the **difference of two adjacent
moves**:

```ts
const selTicket     = m1 - m2;          // up on m1, down on m2
const selBuild      = m2 - m3;
const selTriageStep = m3 - m4;
const selStart      = m4 - m5;
const selTriage     = 1 - m1 + selTriageStep + m5;   // the resting selection
```

Because `m2` only starts rising after `m1` has finished, `selTicket = m1 - m2`
rises to 1, holds, then falls to 0 — a clean hand-off. The selections are
non-overlapping **by arithmetic**, not by careful timing you have to police.
Exactly one row is ever selected, and the blue ring walks the chain because the
same mixes drive both the panel rows and the block rings:

```ts
const ringOn = (sel) => sel > 0.5;
<TicketChain
  start={{dim: 1 - 0.7*selStart, highlighted: ringOn(selStart)}}
  triage={{dim: 1 - 0.7*selTriageStep, highlighted: ringOn(selTriageStep)}}
  build={{dim: 1 - 0.7*selBuild, highlighted: ringOn(selBuild)}}
  ticket={{dim: 1 - 0.7*selTicket, highlighted: ringOn(selTicket)}} />
```

> *"Why differences instead of five separate trapezoid windows?"* Because a
> difference of adjacent ramps *guarantees* the sum stays sane and the hand-off
> is seamless — block N's selection falls at exactly the rate block N-1's rises,
> so there's never a frame with two rings or zero rings. Hand-tuned overlapping
> windows would need constant re-checking every time you nudge a timing. This is
> continuity by construction at the choreography level.

## Only the active block's tree is mounted — the dip-swap

Each step's tree fades in and out on its own window (`ltOp`, `brOp`, `triOp`,
`startOp`, plus `fullOp` for the resting Triage tree), and the scene mounts
**only one at a time**:

```ts
let values: OutputNode[] = [];
if (fullOp > 0)       values = triageTree({opacity: fullOp});
else if (ltOp > 0)    values = logTicketInputTree({opacity: ltOp, ...});
else if (brOp > 0)    values = buildRowInputTree({opacity: brOp, ...});
else if (triOp > 0)   values = triageInputTree({opacity: triOp, ...});
else if (startOp > 0) values = startOutputTree({opacity: startOp});
```

The trees never stack or cross-fade through each other — one dips out, the next
dips in, in the gap. But the panel's outline must not pop while a tall tree
(Triage's three nodes) swaps for a short one (Start's one node). That's what
`minBodyH={PANEL_MIN_BODY_H}` (386px, the measured height of the tallest tree)
is for: it pins the values column so the panel keeps its shape no matter which
tree is mounted.

> *"Why dip-swap instead of morphing one tree into the next?"* Because the trees
> have different shapes (different keys, different node counts) — there's no
> honest morph between "LogTicket's `data` field" and "BuildRow's `content`
> field." A dip-swap in the timing gap is clean; a forced morph would be a lie
> about what the record contains. The pinned `minBodyH` is what lets the swap be
> invisible.

## Two-surface synchrony again — the tag resolves in both places

The same device as scene 3: the reference resolves in the panel (below) *and* on
the block's own row in the chain (above) on the same frame.

```ts
<TicketChain ...
  dataResolve={ltResolve} dataGlow={ltBilling}   // LogTicket's row tag
  msgResolve={triResolve} msgGlow={triGlow*(1-triResolve)}  // Triage's row tag
  inputResolve={startResolve} />                  // Start's Input row
```

When LogTicket's `data` tag resolves in the panel, LogTicket's `Data` row on the
block resolves too, and the "billing" value glows in both. The viewer sees the
same fact in the inspector and in the workflow at once — provenance shown as a
correspondence between two views, never narrated.

> *"Why bother resolving it on the block too, when the panel already shows it?"*
> Because the lesson is that the record describes *the workflow* — the panel and
> the chain are two views of one run. Lighting only the panel would make the
> record feel like a separate artifact; lighting both binds them. It's the same
> reason the chain stays on screen at all.

## The provenance glow: one value, carried all the way back

Watch "billing" specifically. In LogTicket's tree it's `{ category: "billing", …
}`; the glow (`ltBilling`) holds on it. Step to BuildRow and the value is `billing
— Alex Johnson charged twice…` — and "billing" glows again (`brBilling`). The
same token is highlighted at each step, so the eye tracks *one value* moving back
through its producers. This is what makes it a *trace* and not four independent
block inspections: the glow is the thread.

> *"Why does the tab swing back to Output for Start?"* Every other block is read
> by its **Input** (what it consumed). Start consumes nothing — it *is* the
> source — so the only honest thing to show is its **Output**: the message
> itself. The `inputTab` ramp (`0→1` at the start, back to `0` by 14.5s) swings
> the emphasis to Input for the walk and releases it for Start. The tab is part
> of the grammar: "Input" = reading backward, "Output" = you've hit the origin.

## The revert — back to scene 3's resting state

```ts
const fullOp = Math.max(1 - c(0.8, 1.2), c(17.1, 17.5));
```

`fullOp` is high at the very start (before the trace begins) and high again at
the very end (after `m5` returns selection to Triage). In between it's zero, so
the resting Triage tree is mounted only at the bookends. By the cut, selection is
back on Triage, the tab is back to Output, the full tree is up, dim is uniform —
the scene has put everything back exactly where scene 3 left it.

## How to think about the whole scene

1. *What's provenance, in product terms?* A `<block.field>` reference → animate
   the reference *resolving*, don't draw an arrow.
2. *How do I guarantee one block selected at a time across four steps?* Selection
   mixes as differences of adjacent ramps → non-overlap by arithmetic.
3. *How do I swap four differently-shaped trees without the panel popping?* Mount
   one at a time, dip-swap in the gap, pin `minBodyH`.
4. *How do I bind the record to the workflow?* Resolve the tag in both panel and
   block on the same frame → two-surface synchrony.
5. *How do I make four inspections read as one trace?* Glow the same value
   ("billing") at every step → the glow is the thread.
6. *How do I reach the source cleanly?* Swing the tab Input→Output on Start →
   the grammar says "origin."

The centerpiece isn't one clever animation; it's six disciplined choices that
together let a value be *read backward through the record it came from*.

## Exit state (what scene 5 inherits)

`identical to scene 3's exit` — selection back on Triage, `inputTab` back to 0
(Output), full Triage tree mounted (`fullOp` high), uniform dim, every resolve/
glow/ring at 0. Scene 5 opens on this frame, undims the chain to full, and runs
the recap pulse. Because the trace reverts itself completely before the cut, the
boundary is identical and the closing scene inherits a clean stage.
