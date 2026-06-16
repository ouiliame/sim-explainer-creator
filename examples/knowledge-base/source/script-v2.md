# Knowledge Base v2 — orientation cut (redo/knowledge-base)

Registered as `knowledge-base-v2` alongside the original. Nothing from the
original take is touched; v2 scenes live in `scenes-v2/`, geometry in
`layoutV2.ts`.

**The one idea:** a knowledge base makes your documents *searchable* — so a
workflow can put just the relevant passages in front of the model before it
answers. Not the whole library; the right pages.

**Visual reference:** the docs' own "Using a knowledge base in a workflow"
page (`apps/docs/content/docs/en/knowledgebase/using-in-workflows.mdx`):
its SUPPORT_KB_WORKFLOW preview is the set piece verbatim, and its authored
OutputBundle is the record scene almost verbatim. Chain geometry is
module-1/module-5's (same canvas, same pitch) so the series reads as one
world.

**Two runs total.** Run 1 is ONE continuous run spanning scenes 1→5: it
starts in scene 1, freezes at the Knowledge block's live ring while the
aside opens the base (scenes 2–4 live inside that held moment), completes
its second hop into the Agent at the end of scene 4, freezes again at the
Agent's live ring while the chat aside shows the passages entering the
model's context, and finishes there. Run 2 is the closing green settle.

## Batch-mode assumptions (where the pipeline gates on William)

- **Beat gate (Phase 2):** capability-first arc assumed over problem-first —
  the grammar prescribes it for "what is X" orientation videos, and the
  audience (post-workflows, post-agents) doesn't need the problem
  manufactured.
- **Script gate (Phase 3):** the brief's "zoom-aside … ChatPanel with a
  knowledge tool call" is realized as the Agent-side chat aside in which
  `<knowledge.results>` resolves INTO the user message (two-surface
  ResolvedTag sync, module-5's core pattern) — NOT as an agent-initiated
  `knowledge_search` tool call. Rationale: in SUPPORT_KB_WORKFLOW the
  search already happened one block earlier; a tool call in the chat would
  show the *other* usage pattern (agent-initiated retrieval), which
  module-5 already demonstrated and this video deliberately leaves out.
  If William wants the tool-call variant instead, scene 5 swaps the
  ResolvedTag bubble for a tool row — geometry unchanged.
- **KB name** "Product docs": the docs page's own phrase ("the Knowledge
  block searches a base of product docs"). The Knowledge block carries the
  product-true third row `Knowledge Base` (subBlock title in
  `apps/sim/blocks/blocks/knowledge.ts`), which the docs' 2-row preview
  omits.

## Grounding (every on-screen value traces)

| Value | Source |
| --- | --- |
| Chain blocks/rows: Start `Input: Customer question` · Knowledge `Operation: Search`, `Query: <start.input>` · Agent `Messages: Answer from <knowledge.results>`, `Model: claude-sonnet-4-6` | `SUPPORT_KB_WORKFLOW`, docs `workflow-preview/examples.ts`. Display adaptation: the Agent's Messages ROW shows the tag alone (`<knowledge.results>`) because the authored prefix truncates the reference at block width; the chat bubble (scene 5) carries the full authored line "Answer from `<knowledge.results>`" verbatim (module-5 precedent: row compact, bubble verbose). |
| Knowledge row `Knowledge Base: Product docs` | row title from the real block registry (`knowledge.ts` subBlock "Knowledge Base"); value = the docs page's own phrase |
| Customer question "What's our refund policy for annual plans?" | demo-corpus `README.md`, Q&A demo flow (authored verbatim) |
| Documents shown: refund-policy.md, pricing-faq.md, billing-faq.md, onboarding-guide.md + "17 docs" badge | demo-corpus files / README ("17 documents total") |
| Search winners: refund-policy.md (top), billing-faq.md (supporting) | demo-corpus README Q&A flow ("Should pull: refund-policy.md (top match), billing-faq.md (supporting)") |
| Retrieved passage / agent answer "Annual plans are eligible for a full refund within 30 days of purchase." | demo-corpus `refund-policy.md`, first bullet, verbatim |
| Record values: `results` array with `content`, `documentName`, `similarity 0.92`, `sourceUrl null`; `query`; `totalResults 5`; Knowledge log `312ms` selected | docs `using-in-workflows.mdx` authored OutputBundle (structure + similarity + count + duration verbatim; `content`/`documentName`/`query` swapped to the corpus values above so the video stays one coherent world — the docs' "refund-policy.pdf"/"Refunds are issued within 14 days…" belong to a different invented corpus) |
| Log durations Start `9ms`, Agent `1.2s` | docs `workflow-preview/output-bundle.tsx` authored defaults |

No ⟨pending⟩ values remain.

## Locked scene list (~71s)

1. **answer-from-docs** (~10s · assemble + run start) — The
   SUPPORT_KB_WORKFLOW chain assembles on the canvas: Start → Knowledge →
   Agent, edges draw on. The run starts: the customer question resolves
   into Start's Input row (DipSwap), start blip, WirePulse crosses edge 1,
   the Knowledge block's live ring comes on — and the moment **holds**
   through the cut.
   *Beat intent: in Sim, answering from your own documents is a workflow —
   and a question just reached the Knowledge block. What is it searching?*
2. **the-knowledge-base** (~9s · zoom-aside, held moment) — Start/Agent and
   edges dim; a panel rises above the chain: the knowledge base. Its
   `Knowledge Base` row glows in the block while the panel header appears
   (synchrony, no connector line). Four document rows fade in staggered,
   centered in the panel, with a "17 docs" count badge.
   *Beat intent: the block points at a knowledge base — a workspace
   resource holding the documents you put in.*
3. **split-into-passages** (~11s · mechanism, same aside) — The document
   rows glide to the panel's left column; from each document, two passage
   cards slide out and settle in rows beside it. The originals stay.
   *Beat intent: Sim splits each document into searchable passages —
   search looks through the pieces, not the files.*
4. **the-closest-passages** (~11s · reference-resolution + selection, same
   aside, then the run resumes) — The Query row's `<start.input>` glows and
   resolves to the actual question (ResolvedTag). A brightness wave sweeps
   every passage card (each one is compared); then the two closest ring
   selection-blue while their source documents ring in sync; everything
   else dims. Hold. The panel leaves, the Knowledge ring releases, the
   pulse crosses edge 2, the Agent's live ring comes on — **holds** through
   the cut.
   *Beat intent: the question is compared against every passage; only the
   closest few come back. (Where do they go?)*
5. **into-the-context** (~14s · zoom-aside on the Agent) — Inside the held
   moment, the agent's fresh chat slides in beside the dimmed chain
   (module-5's pattern). The Messages row glows; the user bubble appears
   with the same content; then `<knowledge.results>` resolves to the
   retrieved passage in the row and the bubble TOGETHER. Thinking → the
   reply, in the words of the document. Panel closes, the ring releases,
   every resolution reverts.
   *Beat intent: the passages land in the model's context — it answers
   from what it was just shown: your documents.*
6. **the-search-record** (~9s · record-panel) — The chain recedes; the run
   inspector rises with the Knowledge step selected: logs (Start 9ms ·
   Knowledge 312ms · Agent 1.2s) beside the typed tree — `results` array
   (content / documentName / similarity 0.92 / sourceUrl), `query`,
   `totalResults 5`. The `results` key glows.
   *Beat intent: every search leaves a record — you can see exactly which
   passages came back, from where, and how close.*
7. **still-your-documents** (~7s · settle/bookend) — One final run walks
   the chain; blocks settle green in causal order; gentle camera ease-back.
   Hold the balanced frame.
   *Beat intent: a knowledge base — your documents, searchable, in front
   of the model exactly when needed.*

## Continuity contract

- One chain (layoutV2.ts geometry = module-5's), all seven scenes. The KB
  panel (2–4), chat panel (5) and run record (6) are overlays over the
  unmoved, dimmed chain.
- Boundaries 1→2, 2→3, 3→4, 4→5 carry LIVE state (the deliberate
  freeze-cuts): question resolved in Start's Input throughout; Knowledge
  ring on through 1→4; panel + doc/passage layout held at 2→3 and 3→4
  (positions owned by layoutV2.ts); Query resolved + Agent ring on at 4→5.
- All resolutions revert before scene 5 ends; boundaries 5→6 and 6→7 carry
  template state.
- Equal-height invariants: the panel never resizes; documents glide
  (interpolated), never teleport; passage cards render null until reveal.
- Product state language only: blue ring = live/selected, green = done,
  0.35 dim = not focal; no words for states, no connector lines, no
  sentences on screen.
