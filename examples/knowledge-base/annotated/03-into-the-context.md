# Scene 16 — `context-injection`  ·  archetype: **transfer (chunks → context)**

Source: `src/videos/knowledge-base/scenes/ContextInjectionScene.tsx`,
`src/videos/knowledge-base/layout.ts`,
`src/components/{ChunkCard,ContextPanel,KBContainer}.tsx`.

This is the scene that answers the question the previous two planted: *the
relevant chunks came back — now where do they go?* The answer is the deepest
idea in the module — they go **into the model's context, before it answers** —
and this scene shows it as a physical transfer: the chunks leave the staging
stack and travel into a panel labeled "model context." Read it as the worked
example for "move objects between two surfaces so the journey itself is the
explanation."

---

## What this scene is for

The video has been building to one sentence: *the point of a knowledge base is
to bring the right information in front of the model before it reasons.* This is
the scene that makes "in front of the model before it reasons" literal. A
`ContextPanel` — the thing the model will read — appears on the left, empty.
The three reranked chunks fly into it from the center, filling its slots. By the
end, the model's context is no longer empty; it holds exactly the three
retrieved passages.

The rule is *one idea per scene*: this scene is "the retrieved chunks enter the
model's context." It does not show the model answering — that's the next scene.
The transfer is the whole beat: empty context → full context.

## What it looks like

A `ContextPanel` (titled "model context") fades in on the left, empty. On the
right, the KB shell remains with its nine non-relevant chunks held at a deep dim.
The three reranked chunks — which the previous scene left stacked in the center —
glide left along a diagonal and settle into the panel's slots, top to bottom, in
their reranked order. When they land, the model's context is populated.

## The one real decision: the chunks travel by shared geometry, not by magic

The three chunks are positioned by interpolating between a **start** point (their
staging-stack slot, owned by `layout.ts`) and an **end** point (their slot inside
the context panel, also owned by `layout.ts`):

```tsx
const travel = interpolate(frame, [0.4*fps, 2.0*fps], [0, 1],
  {extrapolateLeft:"clamp", extrapolateRight:"clamp", easing: EASING.inOut});
...
{RERANKED_INDICES.map((kbIdx, ctxIdx) => {
  const startX = RERANK_X;             const startY = rerankY(ctxIdx);
  const endX   = CTX_SLOT_X;           const endY   = CTX_SLOT_Y_START + ctxIdx * CTX_SLOT_PITCH;
  const x = startX + (endX - startX) * travel;
  const y = startY + (endY - startY) * travel;
  ...
})}
```

Two things to take from this.

**The start point is literally the previous scene's exit point.** `RERANK_X` and
`rerankY(slot)` are the same `layout.ts` functions the reranking scene used to
*place* these chunks. This scene doesn't re-create the stack — it reads the same
coordinates, so frame 0 here is pixel-identical to the last frame there. The
chunks appear to keep existing across the cut and simply start moving. This is
the continuity-by-construction rule: cross-scene positions live in `layout.ts`
and *both* scenes read them, so the boundary can't drift.

**The end point is shared with the *next* scene.** `CTX_SLOT_X`,
`CTX_SLOT_Y_START`, `CTX_SLOT_PITCH` are where the chunks land here — and the
`output` scene renders its context chunks at those exact same coordinates. So
the chunks fly in here, and when the cut to the answer scene happens, they're
already exactly where that scene expects them. One set of slot constants serves
both the arrival (this scene) and the resting state (next scene).

> *"Why animate a literal flight instead of just fading the chunks into the
> panel?"* Because the **journey is the lesson.** The single hardest idea to
> convey is *direction* — that knowledge flows from the KB into the model, before
> the model acts. A fade-in-place would show chunks appearing in a panel with no
> sense of where they came from. The travel — out of the staging area (which came
> out of the KB), into the context panel (which feeds the model) — draws the
> whole pipeline's arrow in one continuous gesture. You're not decorating; you're
> showing the one thing a static diagram can't: which way the information moves.

## The values, and why reranked order is preserved into the slots

```ts
export const RERANKED_INDICES = [6, 10, 1]; // reranked order, top-down
```

The map iterates `RERANKED_INDICES`, and slot `ctxIdx` in the staging stack maps
to slot `ctxIdx` in the context panel — so the chunk that was on top of the
stack lands in the top context slot.

> *"Why carry the reranked order all the way into the panel?"* Because order in
> the model's context is meaningful — what the model sees first carries weight —
> and the previous scene spent its whole runtime establishing that order
> (`[1,6,10]` similarity order → `[6,10,1]` reranked). Throwing that order away
> at the transfer would make the reranking scene pointless. By preserving it
> (`ctxIdx → ctxIdx`, a straight-through mapping), the scene says "the order we
> just decided is the order the model receives." The reranked order is also what
> the `output` scene reads (`RERANKED_INDICES.map(i => KB_CHUNKS[i])`), so the
> chunks in the answer's context are in the same order they arrived in — one
> coherent chain from selection through to the answer.

## The animation, beat by beat

### (a) The non-relevant chunks are already deep-dimmed — `dimOp = 0.18`

The nine unselected chunks render at a flat `0.18` (no animation — they're
held).

> *"Why 0.18 here when the selection scene dimmed them to 0.35?"* Because they've
> moved one more step toward irrelevant. In the relevant-chunks scene they were
> backgrounded but still "candidates" (0.35). By now they've definitively lost —
> the reranking scene already faded them from 0.35 to 0.18, and this scene simply
> holds that level. The progressive dim (1.0 → 0.35 → 0.18) is a gradient of
> "how much does this chunk still matter," and it's continuous across three
> scenes so nothing snaps. The relevant three, meanwhile, are no longer rendered
> in the KB grid at all here (`if (RELEVANT.has(i)) return null`) — because they
> physically *left*; they're the ones flying across.

### (b) The empty context panel fades in — frames 0s → 0.4s

```tsx
<FadeIn delay={0} duration={0.4}><ContextPanel title="model context" .../></FadeIn>
```

The destination appears, empty, *before* the chunks arrive.

> *"Why show the empty panel first?"* Same logic as drawing the connector line
> before the chunks in the chunking scene: establish the destination so the
> arriving chunks read as *filling* it. An empty labeled box that then fills is a
> sentence ("the model's context, now populated"); chunks materializing into a
> box that appears at the same instant is mush. And the panel is empty *by
> construction* — a model's context holds nothing until something is put in it,
> the same honesty rule as the empty table cells elsewhere in the series.

### (c) The chunks travel — frames 0.4s → 2.0s, `EASING.inOut`

The three chunks interpolate from staging-stack coordinates to context-slot
coordinates over 1.6s, on an ease-in-out curve.

> *"Why so slow — 1.6 seconds for a short trip?"* Because this is *the* moment of
> the module — knowledge entering the model — and it earns weight. A snappy
> 0.3s dart would read as a UI transition; a deliberate 1.6s glide reads as
> "watch this happen." `EASING.inOut` (the series' curve for things traveling
> between states) gives it a gentle accelerate-then-settle, so the chunks ease
> out of the stack and ease *into* their slots rather than slamming in. The
> chunks all share one `travel` value, so they move as a coherent group — a batch
> of knowledge arriving together, not three independent darts.

### (d) The settle — from 2.0s to the end

The chunks rest in the panel; the model's context is full. Hold.

> *"What is this hold doing?"* It's the "before it answers" pause. The context is
> loaded and the model hasn't spoken yet — that's precisely the state the whole
> module has been describing ("the information the model sees *before* it
> answers"). Dwelling on full-context-but-no-answer-yet is what makes the next
> scene's answer read as *grounded in* this context rather than conjured. And it
> hands the next scene a settled state at the exact slot coordinates it expects.

## How to think about the whole scene

1. *Where do the retrieved chunks go?* Into a "model context" panel → make the
   destination an explicit, labeled surface.
2. *How do they get there?* A literal flight from staging stack to context slots
   → the journey draws the pipeline's direction arrow.
3. *How is the boundary seamless?* Start coords = previous scene's exit coords,
   end coords = next scene's rest coords, all in `layout.ts` → continuity can't
   drift.
4. *In what order do they land?* Reranked order, straight through → the order we
   decided is the order the model gets.
5. *Why hold at the end?* To sit in the "context full, not yet answered" state —
   the literal thesis of the module.

## Exit state (what scene 17 inherits)

`Context panel on left, populated with the three reranked chunks at
CTX_SLOT positions · nine KB chunks at 0.18 dim on the right · model has not yet
answered.` The output scene opens on exactly this: it cross-fades the dimmed KB
away, fades in the model node and the output panel, and renders the same three
chunks at the same `CTX_SLOT` coordinates — so the context the model reads in the
final scene is, frame-for-frame, the context you watched fill here.
