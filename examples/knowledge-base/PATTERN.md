# PATTERN — the knowledge grammar (chunk → retrieve → ground)

The distinctive move of the Knowledge Base module isn't a single set piece —
it's a **four-beat grammar** that teaches how retrieval actually works, in
causal order, with no words on screen for any of it:

> **A document splits into chunks → a query lights the relevant few → the
> retrieved few travel into the model's context → the answer is visibly built
> from them.**

If you're explaining anything where a system *looks something up before it
acts* — RAG, search-then-answer, "consult the docs," grounded answers — this
is the grammar to steal.

---

## The move, in four beats

| Beat | Scene | What the viewer sees | The claim it makes |
|---|---|---|---|
| **1. Split** | `chunking` | A still document; a line draws down; chunks unfold beneath it | The unit of search is the *piece*, not the file |
| **2. Retrieve** | `relevant-chunks` | A grid of 12 chunks; a query lights 3 (green glow), dims 9 (0.35) | Search returns *the right few from many*, scattered across sources |
| **3. Transfer** | `context-injection` | The 3 chunks fly from a stack into a panel labeled "model context" | Knowledge flows *into the model, before it answers* |
| **4. Ground** | `output` | Context (same 3 chunks) → model → a specific answer types out | The answer is *built from* those passages, not conjured |

The four scenes are annotated in full in `annotated/01`–`04`; the surrounding
13 scenes are mapped in `annotated/00-scene-map.md`.

## How the chunks light and move (the mechanical core)

Everything keys off four arrays in `layout.ts` — the single source of truth:

```ts
KB_CHUNKS            // 12 chunks, deliberately spanning 6 source docs
RELEVANT_CHUNK_INDICES = [1, 6, 10]   // scattered, NOT [0,1,2]
RERANKED_INDICES       = [6, 10, 1]   // order matters into context
CTX_SLOT_X / Y / PITCH                // where chunks land in the context panel
```

- **Lighting (beat 2)** is a `Highlight active={RELEVANT.has(i)}` over a fixed
  grid — relevant chunks glow `COLORS.active` green at opacity 1, the rest fall
  to the 0.35 dim. All twelve resolve *simultaneously* (which-match is a flat
  set; ordering is a separate later beat). No scanning beam — search is shown as
  its *outcome*, a state change, never an invented process animation.
- **Moving (beat 3)** is a single shared `travel` interpolation from
  staging-stack coordinates to `CTX_SLOT` coordinates. The start point is the
  *previous* scene's exit point and the end point is the *next* scene's rest
  point — both read from the same `layout.ts` constants — so the chunks appear
  to keep existing across both cuts and simply glide. The journey draws the
  pipeline's direction arrow; that's why it's a literal flight and not a fade.
- **Grounding (beat 4)** re-renders the *same* chunks at the *same* `CTX_SLOT`
  coordinates while the model and answer arrive around them. The answer is
  specific (`"Sales fell 14% QoQ…"`) and resolves the exact opening query. The
  persistence of the specific source chunks beside the building answer is what
  makes "grounded" demonstrable rather than asserted.

## Why it's built this way (the rules underneath)

- **Introduce the atom before the chemistry.** You can't show a chunk being
  *selected* until the viewer has seen a chunk *exist*. Beat 1 does nothing but
  establish the unit — and keeps the source document *still* so chunks read as
  derived-from, not replacing.
- **Many before few.** The selection only means something against a visible
  grid of twelve. Hold the un-selected "many" for a beat, then light the "few."
  Dim, never hide, the losers — the contrast *is* the lesson.
- **Scatter the winners, span the sources.** Relevant indices are `1, 6, 10`
  (not the top three) and come from different docs, so the picture says "a best
  subset from the whole library, across sources," not "the top of the list."
- **One idea per scene; split which-match from in-what-order.** Selection
  (beat 2) is a flat set resolving at once; ranking is a separate scene; the
  transfer is its own beat. Each scene carries exactly one claim.
- **Continuity by construction.** Cross-scene positions live in `layout.ts` and
  *both* neighboring scenes read them, so every freeze-cut boundary is identical
  by definition — the chunk you see lit, then flying, then grounded is provably
  the same chunk.
- **Product state language only.** Green glow = matched/selected, 0.35/0.18 dim
  = not focal, a single ring pulse = the model working, arrows = flow. No word
  like "RELEVANT" or "PROCESSING" ever appears.

## When to use this

Reach for the chunk → retrieve → ground grammar whenever the thing you're
explaining is **"the system finds the relevant parts of a large body of
knowledge and uses them to act"**: retrieval-augmented answering, search over
docs, grounding a model in real material, "consult X before deciding." It needs
four beats because it's a *grammar*, not a set piece — don't try to compress it
into one scene, and don't pad it past four.

Do **not** reach for it when retrieval isn't the point — if the system genuinely
processes the whole corpus every time, or the lookup is incidental, this grammar
will overstate a mechanism that isn't there.

## The transferable rule

> **Teach a lookup as a journey of a single visible unit.** Make the unit
> concrete and watchable (the chunk: a skeleton card, not prose). Show selection
> as *the right few lit out of many*, scattered, resolving at once — the outcome,
> never a faked scanning process. Move the selected units by interpolating
> *shared* `layout.ts` coordinates so the same objects travel across cuts. Then
> ground the payoff by keeping those exact units visible beside the answer they
> produce — so the viewer's eye, not a caption, connects source to result. The
> whole arc rides on one continuous question (one query in, one answer out) and
> says nothing in words that the picture can say in state.
