# Knowledge Base module — scene map

The Knowledge Base explainer is a **17-scene module**, longer and more
sectioned than a single set-piece video. It answers one question — *how does
a knowledge base let a workflow look up the right information before the model
answers?* — and it does so by building, slowly, one mental model:

> **Knowledge Base → Documents → Chunks → (query) → relevant chunks →
> model context → grounded answer.**

The module breaks into four movements: a **problem prelude** (why the model
can't just be handed everything), a **structure tour** (what a KB holds and
how a file becomes searchable pieces), the **retrieval/grounding core** (the
distinctive pattern this video exists to teach), and a **grounded answer**
payoff. The four scenes carrying the core pattern are annotated in full depth
in their own files — `01-the-chunk-grid.md` (chunking), `02-the-relevant-few.md`
(relevant-chunks), `03-into-the-context.md` (context-injection), and
`04-the-grounded-answer.md` (output). This file is the paragraph-per-scene map
of everything around them, so you can see where the core sits and what state it
inherits.

Source lives at `src/videos/knowledge-base/` — scene components in `scenes/`,
all cross-scene geometry in `layout.ts`, the registered order in `Video.tsx`.
Every value on screen traces to `layout.ts` (`DOCS`, `KB_CHUNKS`,
`RELEVANT_CHUNK_INDICES`, `RERANKED_INDICES`) — the same discipline as the rest
of the series.

---

## Movement I — the problem prelude (scenes 1–4)

**1. scattered-sources** (7s) — The opening image: the information you care
about is spread across Notion, PDFs, Gmail, spreadsheets, slide decks. A
loose, deliberately un-tidy spread of source cards. The mess *is* the message —
this is the problem the rest of the video resolves into order. One idea: "your
knowledge is scattered."

**2. context-overload** (8s) — The naive fix — dump everything into one prompt —
shown failing. The whole pile crowds toward a single model and the frame reads
as too-much. State shown in the picture (crowding, strain), never the word
"expensive" or "too much context" (a case-study correction the series learned
the hard way). One idea: "you can't just hand it all over."

**3. search-emerge** (5s) — The turn. Out of the overload, the idea of *search*
appears — you don't need all of it, you need the right parts. A pivot scene,
short, that reframes the problem from "fit everything" to "find what matters."

**4. kb-appears** (6s) — The Knowledge Base arrives as the named answer: a
single Sim resource that will hold all that scattered material. The
`KBContainer` component (the real product surface) lands center-frame. This is
the thesis object; the rest of the module fills it in.

## Movement II — the structure tour (scenes 5–12)

**5. workspace** (4s) — Orients the KB inside a Sim workspace — it's a workspace
resource, alongside your workflows, not a thing off to the side.

**6. multi-kb** (4s) — A row of four KB tiles (`KB_ROW_XS` in `layout.ts`): you
can have many knowledge bases. One is selected (`FOCAL_KB_INDEX = 1`) as the one
we'll follow — the standard "pick the focal record and dim the rest" move.

**7. zoom-into-kb** (3.5s) — Camera commits to the focal KB; it grows from the
small tile (`KB_SMALL_W`) toward the large centered framing (`KB_LARGE_W`),
continuously interpolated so the same object grows rather than cuts. This is the
first half of a zoom that scene 8 inherits.

**8. documents** (5s) — Inside the enlarged KB, the six `DOCS` reveal as rows
(`docInKbY(i)`) — a PDF, Notion notes, a spreadsheet, markdown, slides, a Gmail
thread, each with its real brand glyph and source connector. The first
mental-model layer lands: **a KB is made of documents.** Note the docs carry
authentic `DocKind` source colors that the chunks will inherit downstream.

**9. zoom-into-doc** (2.5s) — One document (`FOCAL_DOC = Q3-report.pdf`) is
pulled out and enlarged to `DOC_LARGE_W` at the top of frame. Short transition
scene; its only job is to set up the chunk split by isolating a single file as
the thing about to be broken up.

**10. chunking** → **`01-the-chunk-grid.md`** *(core — full depth)*. The
focal document splits into five chunk cards. This is the first appearance of the
chunk as a unit and the foundation of the whole retrieval grammar.

**11. update** (4s) — A document changes; the KB re-indexes. Shows the KB is
live, not a one-time upload — edit a file and its chunks refresh. Honest about
the product: knowledge stays in sync.

**12. return-to-kb** (2.5s) — Camera pulls back from the single doc to the whole
KB, now understood as documents-made-of-chunks. Bridges the structure tour into
the retrieval core. Its exit hands the KB, shrunk and slid right
(`KB_QUERY_X/Y`), to the query scene.

## Movement III — the retrieval / grounding core (scenes 13–17)

**13. query** (3.5s) — The KB completes its move to the right
(`KB_LARGE → KB_QUERY`, continuously interpolated), its section label
crossfades `documents → chunks`, the twelve `KB_CHUNKS` fade in as a grid, and a
`QueryBox` slides in from the left — *"Why are sales down in Q4?"* A connector
line draws query → KB. This scene stages the board that the next three scenes
operate on; it is the immediate `enter` state the core annotations inherit.

**14. relevant-chunks** → **`02-the-relevant-few.md`** *(core — full depth)*.
The query rings the few chunks it matches; everything else dims. The retrieval
moment.

**15. reranking** (3.5s) — The three matched chunks fly out of the grid into a
centered staging stack (`RERANK_X`), then reorder by relevance
(`RELEVANT_CHUNK_INDICES = [1,6,10]` → `RERANKED_INDICES = [6,10,1]`). Shows that
order matters — the best match goes first. This scene's *exit* (three chunks
stacked, in final order, the rest of the KB dimmed to 0.18) is exactly what the
context-injection scene's travel animation reads as its *start*.

**16. context-injection** → **`03-into-the-context.md`** *(core — full depth)*.
The reranked chunks travel from the staging stack into the model-context panel.
The "in front of the model before it answers" moment.

**17. output** → **`04-the-grounded-answer.md`** *(core — full depth)*. The
model reads its context and produces an answer built from those chunks — the
"grounded output" payoff that closes the whole module.

---

## Why the core is four scenes, not one

In a single-set-piece video (like market-desk) the distinctive move is one
scene. Here the distinctive move is a **grammar** — chunk → retrieve → ground —
and a grammar needs more than one beat to teach: you have to establish the unit
(the chunk) before you can show it being selected, and show it selected before
you can show it moving into context, and show it in context before the answer
can mean anything. The four annotated scenes are that grammar laid out in
causal order. Read them in sequence; each one's `enter` state is the previous
one's `exit`.
