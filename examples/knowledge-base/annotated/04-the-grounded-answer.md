# Scene 17 — `output`  ·  archetype: **payoff (grounded answer)**

Source: `src/videos/knowledge-base/scenes/OutputScene.tsx`,
`src/videos/knowledge-base/layout.ts`,
`src/components/{ChunkCard,ContextPanel,AgentNode}.tsx`.

This is the closing scene and the payoff of the entire module. Every prior scene
was setup: scatter, search, the KB, documents, chunks, the selection, the
transfer into context. This scene cashes it in by completing the pipeline's
shape on screen — **context → model → answer** — and showing the answer being
*built from* the chunks the viewer just watched arrive. Read it as the worked
example for "land the thesis as a visible causal chain, and make the payoff
demonstrably grounded rather than asserted."

---

## What this scene is for

The whole video exists to replace one wrong mental model ("a KB is a place to
upload files") with the right one ("a KB puts the right knowledge in front of
the model before it answers"). This scene is where the right model becomes a
single readable picture: the loaded context on the left, the **model** in the
middle, and the **grounded output** on the right, joined by arrows in causal
order. The answer that appears is specific and traceable — it reads as something
*assembled from the retrieved passages*, not generated from nothing.

The rule is *one idea per scene*: this scene is "the model answers from its
context." The retrieval is over; nothing is searched or selected here. The beat
is the completion of the pipeline and the arrival of a grounded answer.

## What it looks like

The dimmed KB from the previous scene cross-fades out. In its place: the context
panel (still holding the three chunks, unchanged) on the left, an `AgentNode`
labeled "model" in the middle, and an output panel labeled "grounded output" on
the right. An arrow draws context → model; the model's ring pulses as it reads;
an arrow draws model → output; the answer types out line by line — a specific,
structured answer about Q4 sales. The three-stage pipeline sits assembled and
the answer rests.

## The one real decision: the context is the SAME object, not a redraw

The context panel and its three chunks are rendered here at the **identical**
`layout.ts` coordinates the previous scene flew them to:

```tsx
const relevantChunks = RERANKED_INDICES.map((i) => KB_CHUNKS[i]); // reranked order
...
<ContextPanel title="model context" width={CTX_W} height={CTX_H} />
{relevantChunks.map((c, i) => (
  <div style={{position:"absolute", left: CTX_SLOT_X, top: CTX_SLOT_Y_START + i*CTX_SLOT_PITCH, ...}}>
    <ChunkCard seed={c.seed} lines={c.lines} source={c.source} />
  </div>
))}
```

The chunks are read from `RERANKED_INDICES` (same source), placed at `CTX_SLOT`
coordinates (same constants), in the same order. So the context the model reads
in this scene is — frame for frame — the context the viewer watched fill in the
injection scene. The boundary is seamless because nothing is re-created; the same
geometry is simply re-rendered while *new* elements (model, output, arrows) arrive
around it.

> *"Why does it matter that it's the same chunks and not just 'some chunks in a
> panel'?"* Because the word the whole module is selling is **grounded**. An
> answer is grounded only if you can see it came from specific retrieved sources.
> By keeping the exact three chunks visible on the left while the answer builds on
> the right, the scene lets the viewer's eye connect them — *that* context
> produced *this* answer. If the context were a generic redraw, or empty, the
> answer would read as conjured, and the entire thesis ("answers from your
> documents") would be a claim instead of a demonstration. The persistence of the
> specific chunks is what makes "grounded output" literally true on screen.

## The values, and why the answer is specific

```ts
const ANSWER_LINES = [
  "Sales fell 14% QoQ in Q4.",
  "Primary drivers:",
  "• EU demand dropped 18% after Sep pricing change",
  "• 3 enterprise renewals slipped to Q1",
  "• APAC channel partner ramp delayed two weeks",
];
```

The answer is concrete — numbers, regions, causes — and it directly answers the
query that drove the whole pipeline (*"Why are sales down in Q4?"*).

> *"Why a detailed, figure-laden answer instead of a generic 'Here's what I
> found'?"* Because a vague answer would undercut the grounding claim. The point
> is that having the right passages in context lets the model produce a *specific,
> sourced* answer — the kind it could only give if it had been handed real
> material. The specificity is the evidence. It also closes the question the
> query opened: the module is a single Q→A arc ("Why are sales down in Q4?" →
> "Sales fell 14%…"), and the answer must visibly resolve that exact question,
> not a paraphrase of it.

## The animation, beat by beat — the pipeline assembles in causal order

The scene's spine is that elements arrive **in the order information flows**:
context (already there) → model → output → arrow in → model reads → arrow out →
answer. The timeline encodes the causality.

### (a) Cross-fade the KB out, fade the model and output panels in — 0s → 1.1s

```ts
const kbOp    = interpolate(frame, [0,    0.6*fps], [1, 0], {easing: EASING.inOut});
const agentOp = interpolate(frame, [0.4*fps, 1.0*fps], [0, 1], {easing: EASING.out});
const outOp   = interpolate(frame, [0.5*fps, 1.1*fps], [0, 1], {easing: EASING.out});
```

The dimmed KB (and its faint non-relevant chunks) fades away while the model node
and the output panel fade in to occupy similar screen real-estate.

> *"Why cross-fade rather than cut to the new layout?"* The KB has done its job —
> it found and delivered the chunks — so it bows out, but a hard cut would flash
> and break the sense that this is the *same scene continuing*. The cross-fade
> lets the retrieval apparatus recede and the reasoning apparatus take its place
> in the same space, reading as "the next stage of one process." The context
> panel on the left does **not** fade — it persists, because the chunks are still
> in play; only the KB shell (which we're done with) leaves.

### (b) Arrow 1 draws context → model — 1.2s → 1.7s

A 2px line grows from the context panel's right edge to the model node.

> *"Why draw the arrow only after the model has appeared?"* Order encodes
> causality, again. The arrow is the act of *feeding* context to the model, so it
> can't draw until both endpoints exist. Drawing it here, after the panels
> settle, reads as "now the context is handed to the model." `EASING.inOut`
> because it's traveling through space.

### (c) The model's ring pulses — 1.7s → 2.7s (peak at 2.2s)

```ts
const pulseT = interpolate(frame, [1.7*fps, 2.2*fps, 2.7*fps], [0, 1, 0], {easing: EASING.inOut});
// drives boxShadow ring + halo alpha on the AgentNode
```

The model node gains a glow ring that rises and falls — a single "thinking"
pulse.

> *"Why a pulse and not a steady glow or a spinner?"* A pulse is the product's
> language for "this block is doing work" — it rises (engaged), holds, releases
> (done), all without a word like "PROCESSING" or a borrowed loading-spinner. The
> up-then-down shape says the model took the context, reasoned over it, and
> finished — a complete action in one gesture. It fires *after* arrow 1 lands
> (context received) and *before* arrow 2 draws (answer emitted), so it sits
> exactly where reasoning belongs in the causal chain.

### (d) Arrow 2 draws model → output — 2.6s → 3.1s

The second arrow grows from the model to the output panel, beginning as the
think-pulse releases.

> *"Why does arrow 2 start right as the pulse ends?"* Because the answer is the
> *result* of the reasoning — it can't flow out until the thinking completes. The
> tiny overlap (arrow starts at 2.6s, pulse ends at 2.7s) makes the emission feel
> like it's *caused by* the reasoning finishing, not a separate disconnected
> event.

### (e) The answer types out — line by line from 3.3s, +0.22s each

```tsx
<FadeIn delay={3.0} duration={0.4}>…"grounded output" label…</FadeIn>
{ANSWER_LINES.map((line, i) => (
  <FadeIn key={i} delay={3.3 + i*0.22} duration={0.4}>{line}</FadeIn>
))}
```

The "grounded output" label appears first, then each answer line fades in 0.22s
after the last.

> *"Why reveal the answer line-by-line instead of all at once?"* A line-by-line
> reveal reads as the answer being *produced* — composed in real time from the
> context — rather than pre-existing and merely shown. It mirrors how a model
> streams a response, which is the honest depiction. The stagger also paces the
> viewer's reading: you take in "Sales fell 14%" before the drivers arrive, so the
> structured answer lands as structure, not as a wall. 0.22s is the same family of
> stagger used for row/chunk reveals elsewhere — consistent cadence across the
> module.

### (f) The settle — the full pipeline at rest

After the last line, the assembled three-stage diagram (context → model →
grounded output) holds. This is the final image of the video.

> *"Why end on the whole pipeline rather than just the answer?"* Because the
> thesis is the *pipeline*, not the answer. The last frame is meant to be the
> mental model the viewer keeps: their documents, reduced to the relevant
> passages, sitting in the model's context, producing a grounded answer. Holding
> all three stages in one balanced frame is the recap — the entire video
> compressed into a single readable diagram. And as everywhere in the series, a
> settled final hold can stretch to fit the closing narration.

## How to think about the whole scene

1. *What completes the picture?* The model and output stages, arriving to join
   the context that's already there → the full context → model → answer chain.
2. *How is grounding shown, not claimed?* Keep the exact retrieved chunks visible
   beside the building answer → the eye connects source to result.
3. *How is the answer made credible?* Make it specific and make it resolve the
   original query → specificity is the evidence of grounding.
4. *How does causality read?* Elements arrive in flow order — context, model,
   arrow-in, think-pulse, arrow-out, answer → the timeline *is* the explanation.
5. *What state language?* Cross-fade (handoff), a single think-pulse (work), arrows
   (flow), typed answer (production) — all product/diagram vocabulary, no captions
   beyond the "grounded output" label.

## Exit state

This is the final scene. It ends on the settled three-stage pipeline — the
recap image of the whole module: **your documents → the relevant chunks → the
model's context → a grounded answer.**
