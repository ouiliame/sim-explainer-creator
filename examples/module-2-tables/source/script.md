# Module 2 — Tables: Structured State for AI Systems

Conceptual spine for the three-video Tables module. Remotion owns the **concept beats**: the use-case framing, the anatomy of a table (rows / columns / typed cells), the workflow↔table read/write loop, and the "active table" workflow-column model. The live product — opening a table in Sim, adding a Table block to a workflow, running it, watching cells fill, reading workflow logs — is captured as **screen recording** and intercut. The animated diagrams establish the mental model; the demos prove it on real UI.

This file covers all three videos as one module so the shared vocabulary (the `TableGrid` tile, the workflow→table arrow) stays consistent across cuts. Each video's animated beats are grouped; screen-rec beats are listed inline but marked `[SCREEN-REC]` and excluded from the animated total.

Source outline: `curriculum/Module 2 Tables.md`. Format follows `src/videos/intro/script.md` and `src/videos/knowledge-base/script.md`.

## Locked scene list

### Video 1 — Tables Intro: Structured State for AI Systems

1. **systems-over-lists** (6s) — Cold open. A column of look-alike records (leads / tickets / candidates) stacks in. One line: "Most real systems aren't one input — they're a list of records." Frames the use case before the noun. *Components:* `RecordStack` (new), `FadeIn`, `SlideIn`.
2. **one-off-vs-many** (7s) — Two sketches side by side: top `input → agent → output` (a single `WorkflowChain`), bottom `many records → process each → write back → inspect`. The bottom one wins focus; the top dims. "Tables are where that structured state lives." *Components:* `WorkflowChain`, `RecordStack`, `Highlight`, `FadeIn`.
3. **table-anatomy** (9s) — One empty `TableGrid` materializes: rows label as "records," columns label as "fields," and a type chip row fades in under the headers (text · number · boolean · date · JSON). The keystone definition beat. "Rows are records. Columns are fields. Each column has a type." *Components:* `TableGrid` (new), `ObjectNode` (kind: table, as the title tile), `Expand`, `FadeIn`, `Highlight`.
4. **what-belongs** (7s) — Cells in the grid fill with the things tables hold — status, score, category, extracted field, workflow output — each typed cell highlighting as it's named. "Anything you want to filter, update, compare, or process repeatedly." *Components:* `TableGrid`, `Highlight`, `FadeIn`.
5. *(open Sim — show a real table, add rows, set a column type)* `[SCREEN-REC]`
6. **work-vs-inspectable** (6s) — A `WorkflowChain` on the left draws an arrow into a `TableGrid` on the right; outputs land in a column. "Workflows do the work. Tables keep the work inspectable." *Components:* `WorkflowChain`, `TableGrid`, `ObjectNode` (table), `SlideIn`, `Highlight`.
7. **pipeline-comes-to-data** (5s) — Teaser: instead of records sliding into a pipeline, the pipeline icon slides onto the table and a column lights up. "Instead of moving data into a pipeline, the pipeline comes to the data." Sets up Video 3, no deep dive. *Components:* `TableGrid`, `ObjectNode` (workflow), `SlideIn`, `Highlight`.

### Video 2 — Using Tables in Workflows

8. **the-table** (5s) — A populated `TableGrid` (support tickets: message · category · urgency · status) settles in as the object this video operates on. "Here's a table of support tickets." *Components:* `TableGrid`, `ObjectNode` (table), `FadeIn`.
9. **read-rows** (6s) — A Table block (read) pulls one row out of the grid and hands it to a `WorkflowChain` as input; the row ghosts into the trigger block. "Table rows become workflow input." *Components:* `TableGrid`, `WorkflowChain`, `SlideIn`, `Highlight`.
10. *(open Sim — Table block read operation, map a row to the agent)* `[SCREEN-REC]`
11. **process-row** (6s) — The agent block emits a small structured-output card: `category` / `urgency` / `confidence`. Kept deliberately tiny. "The agent classifies, scores, or summarizes the row." *Components:* `AgentNode`, `ContextPanel` (as the output card), `Expand`, `FadeIn`.
12. **write-back** (6s) — The structured result flows back along an arrow into the matching empty cells of the `TableGrid`; the row's status cell flips from blank to filled. "Then the result gets written back into the row." *Components:* `TableGrid`, `SlideIn`, `Highlight`, `Expand`.
13. *(open Sim — run it, watch the row update; if wrong, open workflow logs)* `[SCREEN-REC]`
14. **table-as-dashboard** (5s) — Pull back: the whole `TableGrid` is now filled, every row carrying its workflow output; one tile labels it "the dashboard for the work." "The table becomes the dashboard for the workflow's work." *Components:* `TableGrid`, `ObjectNode` (logs, as the inspect affordance), `Zoom`, `Highlight`.

### Video 3 — Workflow Columns / Active Tables

15. **old-pipeline** (7s) — The painful traditional path drawn as a chain of disconnected tiles: `table → webhook → enrichment → script → write-back`, each a separate `ObjectNode`/block with gaps and a "coordination overhead" label. "The old way: a lot of moving parts to glue together." *Components:* `ObjectNode` (table, tool, deployment), `WorkflowChain`, `FadeIn`, `Highlight`.
16. **workflow-column** (8s) — One `TableGrid`; a single column header transforms into a workflow-column header (workflow glyph in the header). It runs once per row, top to bottom, each cell filling in turn. The keystone beat. "A workflow column runs a workflow for every row." *Components:* `TableGrid`, `ObjectNode` (workflow), `Expand`, `Highlight`, `SlideIn`.
17. **input-output-columns** (8s) — The grid splits visually: left columns tint as **input** (company · industry · description), right columns tint as **output** (qualified? · reason · confidence), arrows crossing the divide for one row. Made explicit because the spike found this confusing. "Input columns feed the workflow. Output columns catch its results." *Components:* `TableGrid`, `Highlight`, `SlideIn`, `FadeIn`.
18. *(open Sim — configure a workflow column: pick input fields, map output fields, run a row)* `[SCREEN-REC]`
19. **cascade** (8s) — Three workflow columns left to right: `enrich company → qualify lead → generate outreach`. Column 1 fills, which unblocks column 2, which unblocks column 3 — a dependency wave moving across the grid. "One column's output can feed the next. Columns cascade." *Components:* `TableGrid`, `ObjectNode` (workflow), `Highlight`, `SlideIn`, `Expand`.
20. **table-is-the-agent** (6s) — Final framing. The `TableGrid` pulses as one active control surface; the per-row workflow glyphs glow together. "The table isn't just storage. The table is the agent — the pipeline comes to the data." *Components:* `TableGrid`, `ObjectNode` (workflow, table), `Highlight`, `Zoom`.

Animated concept beats: 18 scenes (screen-rec excluded), ≈ 124s total across the three videos — split roughly V1 ≈ 40s, V2 ≈ 28s, V3 ≈ 45s. Each individual video's animated time stays in the 28–45s band; the screen-rec demos carry the runtime.

## Narration (reference)

### Video 1 — Tables Intro

> Once you've built a workflow or two, you start noticing something. Most real systems aren't one input and one output. They're a *list*. Leads, tickets, candidates, companies, documents, markets — rows of similar things you want to process.
>
> Tables are where that structured state lives. A table is closer to a structured datatable than a spreadsheet: rows are records, columns are fields, and every column has a type — text, number, boolean, date, or JSON.
>
> What belongs in a table? Statuses. Scores. Categories. Extracted fields. Workflow outputs. Anything you want to filter, update, compare, or process again and again.
>
> Here's how it connects to workflows. Workflows do the work. Tables keep the work inspectable. A workflow can read from a table, write back to it, and update it — and suddenly the table is showing you exactly what the workflow did.
>
> And there's a more powerful idea coming. Instead of moving your data into a pipeline, the pipeline can come to the data. We'll get there.

### Video 2 — Using Tables in Workflows

> Let's make this concrete. Here's a table of support tickets — each row a message, with columns for category, urgency, and status, mostly empty for now.
>
> A workflow can read this table. Using a Table block, a row becomes input to the workflow — the ticket message flows straight into the agent.
>
> The agent processes that row. Classify it, score it, summarize it. If you use structured output, keep it simple: a category, an urgency, a confidence.
>
> Then the result gets written back into the row. Update the cell, and the table changes after the run — the status flips from empty to filled.
>
> Do that across every row and the table becomes the dashboard for the workflow's work. You can see every result at a glance. And if an output looks wrong, you open the workflow logs to see why.

### Video 3 — Workflow Columns / Active Tables

> The old way to do row-wise work was painful. Table to webhook, webhook to an enrichment service, a script to process, then write the results back — a lot of moving parts to coordinate.
>
> A workflow column collapses all of that. A workflow column runs a workflow for every row in the table, top to bottom.
>
> Here's the part that trips people up, so let's be explicit. Some columns are *input* columns — their data is passed into the workflow. Others are *output* columns — the workflow's results get written back into them. Input feeds in; output catches what comes out.
>
> Take lead qualification. Input columns: company, industry, description. Output columns: qualified, reason, confidence. The workflow runs per row and fills the outputs.
>
> And columns can chain. One column enriches a company; its output feeds the next column that qualifies the lead; that feeds a third that generates outreach. A dependency cascade moving across your table.
>
> This is the shift worth internalizing. The table isn't just storage anymore. The table is the agent. The data doesn't move to the pipeline — the pipeline comes to the data.