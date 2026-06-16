# Knowledge Base v2 — narration sheet

Total 71s @ 60fps (`knowledge-base-v2`). Narration is William's; this sheet
gives the visual timings, key moments, and each beat's intent. Anchor
phrases from the docs worth keeping verbatim are quoted.

## 1. answer-from-docs — 0:00–0:10
- 0:00.5–0:02.5 — chain assembles: Start → Knowledge → Agent, edges draw.
- 0:04.6 — the customer's question resolves into Start's Input row:
  "What's our refund policy for annual plans?"
- 0:05.7 — pulse lands; the Knowledge block's live ring comes on and HOLDS.
- *Intent: answering from your own documents is a workflow; a question just
  reached the Knowledge block — what is it searching?*
- Docs anchor: "a store of documents your agents can search by meaning."

## 2. the-knowledge-base — 0:10–0:19
- 0:11 — Start/Agent dim; the base panel rises above the chain.
- 0:11.6 — the block's "Product docs" row glows in sync with the panel
  header (same name, same moment).
- 0:12.2–0:14.5 — four document rows fade in; "17 docs" badge.
- *Intent: the block points at a knowledge base — a workspace resource
  holding the documents you put in.*

## 3. split-into-passages — 0:19–0:30
- 0:19.6–0:20.6 — documents glide to the left column.
- 0:21–0:25 — two passage cards slide out beside each document; originals
  stay.
- *Intent: Sim splits each document into searchable passages; search looks
  through the pieces, not the files.*

## 4. the-closest-passages — 0:30–0:41
- 0:30.5 — `<start.input>` in the Query row glows, then resolves to the
  actual question (0:31.2–0:31.9).
- 0:32.3–0:33.6 — a comparison blip sweeps every passage.
- 0:33.6–0:34.1 — the two closest ring blue; their source documents
  (refund-policy.md, billing-faq.md) ring in sync; the rest recede. HOLD.
- 0:36.4–0:37.4 — panel leaves; ring releases; pulse crosses edge 2;
  0:38.3 — the Agent's live ring comes on and HOLDS.
- *Intent: the question is compared against every passage; only the
  closest few come back.*
- Docs anchor: "like asking a librarian for the most relevant excerpts."

## 5. into-the-context — 0:41–0:55
- 0:41.5–0:42.4 — the agent's fresh chat slides in beside the dimmed chain.
- 0:42.6 — Messages row glows; 0:43.2 — the user bubble appears: "Answer
  from `<knowledge.results>`".
- 0:44.8–0:45.6 — THE money beat: the tag resolves to the retrieved
  passage in the block row and the bubble TOGETHER. Give it dwell time.
- 0:46.4–0:47.6 — thinking; 0:47.9 — the reply, in the document's own
  words: "Annual plans are eligible for a full refund within 30 days of
  purchase."
- 0:52.3–0:53.2 — panel closes; ring releases; 0:53.6 — everything reverts.
- *Intent: the passages land in the model's context — it answers from what
  it was just shown: your documents.*

## 6. the-search-record — 0:55–1:04
- 0:55.9–0:56.7 — chain recedes; the run record rises, Knowledge step
  selected (312ms).
- 0:57.4–0:58 — `results` / `query` / `totalResults` reveal;
  0:58.4–1:02 — the `results` key glows (this is what `<knowledge.results>`
  reads): content, documentName, similarity 0.92.
- *Intent: every search leaves a record — which passages, from where, how
  close.*

## 7. still-your-documents — 1:04–1:11
- 1:05–1:07.2 — one final run walks the chain; blocks settle green in
  causal order; camera eases back 7%; hold for the closing line.
- *Intent: a knowledge base — your documents, searchable, in front of the
  model exactly when needed.*
- Original script's closing thought (for VO inspiration, not on screen):
  "a way for your AI to look up the right information before it answers,
  decides, or acts."
