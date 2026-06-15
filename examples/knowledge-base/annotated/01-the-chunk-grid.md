# Scene 10 — `chunking`  ·  archetype: **mechanism (split)**

Source: `src/videos/knowledge-base/scenes/ChunkingScene.tsx`,
`src/videos/knowledge-base/layout.ts`,
`src/components/{ChunkCard,DocumentCard}.tsx`.

This is the scene that introduces the **chunk** — the single most important
unit in the whole module. Everything downstream (retrieval, reranking,
context, the grounded answer) operates on chunks, so this scene's only job is
to make you believe one thing: *a document is not the unit Sim searches; the
pieces it splits into are.* Read it as the worked example for "introduce the
atom before you show the chemistry" — you cannot teach selection of a thing
the viewer hasn't seen exist yet.

---

## What this scene is for

By the time we arrive here, the viewer has seen a knowledge base full of
documents, and we've zoomed into one (`FOCAL_DOC = Q3-report.pdf`, held at the
top of frame from the previous scene). This scene takes that one document and
shows it **becoming searchable pieces** — five chunk cards growing out from
underneath it, joined to it by a single thin line.

The rule it follows is *one idea per scene*: this scene is "a document splits
into chunks," full stop. It does not search anything, does not bring in a
query, does not select. Resist adding the query here — retrieval is four scenes
away and needs the chunks to simply *exist* first. The split is the whole beat.

## What it looks like

`Q3-report.pdf` sits at the top, enlarged (`DOC_LARGE_W = 880`), exactly where
the previous scene left it — no jump. A 2px vertical connector line draws
downward from the bottom of the doc. As it reaches the chunk row, five
`ChunkCard`s expand open along the bottom, left to right, each a small
stack of skeleton text lines with a colored left stripe matching the source
document's kind. The doc stays put the whole time. By the end you read: *one
file, on top; the searchable pieces it's made of, below.*

## The one real decision: chunks are a derived view of the doc, not new objects

The scene renders the **same** `DocumentCard` that the previous scene enlarged,
at the **same** `layout.ts` coordinates:

```tsx
<div style={{position: "absolute", left: DOC_LARGE_X, top: DOC_LARGE_Y}}>
  <DocumentCard kind={FOCAL_DOC.kind} name={FOCAL_DOC.name} size="lg" width={DOC_LARGE_W} />
</div>
```

The doc does not animate, fade, or move. That stillness is load-bearing.

> *"Why keep the doc completely still while the chunks grow?"* Because the
> claim of the scene is that the chunks **come from** the doc — they are a
> derived view of it, not a replacement for it. If the doc faded as the chunks
> appeared, you'd read "the file turns into chunks" (the original is gone). By
> holding the doc fixed and growing the chunks *beneath* it, joined by a line,
> you read "the file is still there; these are pieces of it." That distinction
> matters three scenes later, when retrieval pulls back chunks and the narration
> says it does **not** pull back the whole file. The visual grammar set here is
> what makes that later claim land without a caption.

The chunk content is the other honest detail. A `ChunkCard` renders **skeleton
lines**, never real prose:

```tsx
const widthPct = 92 - ((seed * 7 + i * 13) % 28);
// → gray bars at deterministic, seed-varied widths
```

> *"Why fake text bars instead of real sentences?"* Two reasons. First, the
> viewer can't read a paragraph at YouTube distance in the time a chunk is on
> screen, so real text would be noise pretending to be signal. Second — and this
> is the rule — **a chunk is a unit of retrieval, not a thing you read.** The
> skeleton says "this is a passage" without inviting you to read it, which keeps
> your attention on the *mechanism* (splitting, then selecting) rather than the
> contents. The width variance from `seed` keeps the five cards from looking
> like five identical placeholders — they read as five distinct passages.

The colored left stripe is `SOURCE_COLOR[source]` — every chunk inherits the
`DocKind` color of the document it came from. Here all five share the PDF color
(they're all from `Q3-report.pdf`). That property pays off in the next movement:
when the KB grid shows twelve chunks from six different docs, the stripe colors
let you see at a glance that retrieval picks across *multiple sources*, not one.

## The values, and why exactly five chunks

The five chunks come from `layout.ts`:

```ts
export const FOCAL_CHUNKS: ChunkSpec[] = [
  {seed: 1, lines: 3, source: FOCAL_DOC.kind},
  {seed: 2, lines: 4, source: FOCAL_DOC.kind},
  {seed: 3, lines: 3, source: FOCAL_DOC.kind},
  {seed: 4, lines: 4, source: FOCAL_DOC.kind},
  {seed: 5, lines: 3, source: FOCAL_DOC.kind},
];
```

> *"Why five, and why varied line counts (3/4/3/4/3)?"* Five is enough to read
> as "a document makes several pieces" without crowding the row
> (`CHUNK_COUNT = 5`, `CHUNKS_TOTAL_W` is computed from it and centered). The
> varied line counts — some chunks three bars tall, some four — say the splits
> aren't a uniform grid; a document breaks into passages of different sizes.
> A perfectly uniform five-up would read as "we cut it into equal slices," which
> is the wrong mental model. The variance is small enough to stay tidy, large
> enough to read as organic.

## The animation, beat by beat

### (a) The connector line draws down — frames 0.6s → 1.2s

```ts
const lineH = interpolate(frame, [0.6*fps, 1.2*fps], [0, lineEndY - lineStartY],
  {extrapolateLeft:"clamp", extrapolateRight:"clamp", easing: EASING.inOut});
```

A 2px line grows from the bottom of the doc down to just above the chunk row.

> *"Why draw the line first, before any chunk appears?"* The line is the claim
> "these came from here." Drawing it first sets up the causal arrow — *the doc
> reaches down* — so that when the chunks appear at its end, they read as the
> *result* of that reach, not as separate objects that happened to fade in
> below. Order encodes causality: cause (the reach) before effect (the pieces).
> The line uses `EASING.inOut` because it's a thing traveling through space — the
> series' rule is ease the things that move.

### (b) The five chunks expand open — staggered from 1.3s, +0.12s each

```tsx
<Expand delay={1.3 + i * 0.12} duration={0.7} axis="y">
  <ChunkCard .../>
</Expand>
```

Each chunk scales open on the **y axis** (`axis="y"` — it grows in height from a
flat line to full card) over 0.7s, and each starts 0.12s after the one to its
left. So chunk 0 opens at 1.3s, chunk 4 at ~1.78s.

> *"Why expand on the y-axis specifically, not a fade or a scale-from-center?"*
> Because `axis="y"` makes each card unfold *downward from the line* — the
> physical gesture of "the document peeling off a slice." A plain fade would have
> them ghost in with no sense of being produced; a full scale-from-center would
> look like a UI popping a modal. The y-expand is the cheapest motion that reads
> as "split off." This is the `Expand` primitive doing exactly its job: it pairs
> the scale with an opacity ramp (`opacity: t`), so the card fades in *as* it
> unfolds — no separate fade needed.
>
> *"Why the 0.12s stagger instead of all five at once?"* Same reasoning as any
> staggered reveal in the series: simultaneous arrival reads as one block (you'd
> see "chunks" as a single texture), staggered arrival reads as five distinct
> pieces your eye lands on in turn. 0.12s is tight — the whole split completes in
> well under a second — because this is a transition-weight scene (4s total), not
> an establishing shot. A document splitting should feel quick and mechanical,
> not ceremonial.

### (c) The hold — from ~2.5s to the end

After the fifth chunk finishes opening, nothing moves. The doc-and-its-chunks
diagram rests for the back half of the scene.

> *"Isn't that dead air in a 4-second scene?"* No — the hold is where the mental
> model sets. The viewer needs a beat to absorb the new structure (file on top,
> pieces below) before the module starts *operating* on it. And as everywhere in
> the series, ending on a settled state means the scene can stretch to fit
> narration without freezing a motion mid-flight.

## How to think about the whole scene

1. *What's the new unit?* The chunk → introduce it as a `ChunkCard`, skeleton
   not prose, so it reads as "a passage" not "something to read."
2. *Where does it come from?* The doc → keep the doc still and draw a line down,
   so chunks read as *derived from* the file, not replacing it.
3. *How many, and how uniform?* Five, varied sizes → "several pieces of
   different lengths," not "equal slices."
4. *How do they appear?* Y-expand, staggered → each one *peels off*, and you
   count five distinct pieces.
5. *What carries the source identity?* The stripe color → so multi-source
   retrieval reads for free two scenes later.

## Exit state (what scenes 11–12 inherit)

`Q3-report.pdf at DOC_LARGE position · five FOCAL_CHUNKS open below it, joined
by the connector line · nothing selected, nothing searched.` The update scene
(11) operates on this same diagram (re-indexing refreshes these chunks), and
return-to-kb (12) pulls back from it to re-establish the whole KB before the
query arrives. The chunk, once introduced here, never has to be explained
again — it just gets used.
