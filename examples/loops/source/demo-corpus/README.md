# loops demo-corpus

This video shows NO invented content — every on-screen value is
product-authored. This file indexes where each one comes from in the
staging checkout (`_reference/sim` @ `5fb37b4ad`, read 2026-06-11).

| On screen | Source |
| --- | --- |
| Workflow shape Start → Loop [Function] → Summary | `apps/docs/components/workflow-preview/examples.ts:1490` (LOOP_WORKFLOW) / `:1540` (PARALLEL_WORKFLOW) |
| Container anatomy (box, header, inner Start pill, handles) | `apps/docs/components/workflow-preview/preview-container-node.tsx`; cross-checked `apps/sim/.../subflows/subflow-node.tsx` |
| Loop chip #2FB3FF + Repeat glyph | `apps/sim/.../subflows/loop/loop-config.ts` |
| Parallel chip #FEE12B + Split glyph | `apps/sim/.../subflows/parallel/parallel-config.ts` |
| `Code \| return <loop.currentItem>` (Function 1) | `apps/docs/public/static/blocks/loop-2.png`; row title `apps/sim/blocks/blocks/function.ts:36` |
| `return <parallel.currentItem>` | `apps/docs/public/static/blocks/parallel-2.png` |
| Editor labels: Loop Type / For Each / Collection Items | `subflow-editor.tsx:128,159`; `use-subflow-editor.ts:26`; both screenshots |
| Collection `["x", "y", "z"]` | `parallel-2.png` (applied to both phases — script assumption 2) |
| `Messages \| Summarize <loop.results>` (Summary agent) | LOOP_WORKFLOW (`examples.ts`); row title `apps/sim/blocks/blocks/agent.ts:88` |
| `Code \| merge(<parallel.results>)` (Aggregate function, parallel phase) | PARALLEL_WORKFLOW (`examples.ts:1540`); row title `function.ts:36` |
| Resolved `["x", "y", "z"]` results array | mechanically derived: the inner Function returns the current item, results collect in order (loop.mdx) |
| Semantics (only-inside tags, results-by-name, sequential vs concurrent) | `apps/docs/content/docs/en/workflows/blocks/loop.mdx`, `parallel.mdx` |

`artifact-request.md` is the unsent live-run request (batch mode): a real
run would only be needed to add a record-panel scene (per-iteration log
rows + durations), which was cut — script assumption 6.
