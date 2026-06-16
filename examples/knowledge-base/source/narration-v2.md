# Knowledge Base — narration v2

DRAFT narration. Massage the prose under each header, then re-run:

    bun scripts/vo-sync.ts --comp knowledge-base-v2 --narration src/videos/knowledge-base/narration-v2.md

Audio and scene timing both update; unchanged scenes are cached. "min Xs" is
the scene's authored visual minimum — leave it unless the visuals change.

## 1. answer-from-docs — min 10s

You probably already have knowledge you'd like your workflows to use. Here, a customer asks about the refund policy, and the question reaches the Knowledge block.

## 2. the-knowledge-base — min 9s

That block points at a knowledge base — a resource that exists inside your workspace and groups your documents together. This one holds your product docs, seventeen of them.

## 3. split-into-passages — min 11s

Inside a knowledge base, the key unit of information is the document. A document gets processed by Sim into smaller pieces called chunks — and it's the chunks that get searched, not whole files.

## 4. the-closest-passages — min 11s

When a question comes in, it's matched against every chunk by meaning — and the closest few come back: the pieces most likely to hold the answer.

## 5. into-the-context — min 14s

Those chunks get inserted into the model's context. So before the agent writes a single word, it's already looking at your actual policy — and the answer it derives is grounded in your documents.

## 6. the-search-record — min 9s

And every search leaves a record: the question, the chunks it pulled, and the answer it produced. You can always see why it said what it said.

## 7. still-your-documents — min 7s

There's no magic in any of this: it's your documents, made searchable, and brought to the model at the moment it needs them.
