# Module 2 — Tables v2 (orientation cut) — redo/module-2-tables

Registered as `module-2-tables-v2` alongside the original `module-2-tables`
(nothing overwritten; both stay renderable). New take built end-to-end on the
explainer system: one set piece, scene-grammar archetypes, the current run
grammar (WirePulse + row resolution + ResolvedTag), product state language.

**The one idea:** a table is the workspace's structured data — typed columns
over rows — and workflows read and write it through Table blocks. One
roundtrip run (query rows → classify → write back) makes the whole idea
mechanical, and afterwards the table itself shows what the workflow did.

**Closing anchor (docs, verbatim):** *"the table serves as both the queue the
workflow pulls from and the record of what it has already done."* The last
scene is choreographed toward this line.

**Audience:** watched the workflows + agents intros. They know blocks, edges,
`<block.field>` references, runs, live/ok rings. We orient FROM that: the
table is the new object; the chain grammar is the known world.

**Deliberately not taught:** schema design, column types in depth (the header
type icons appear, uncommented), table triggers, filters/views, insert/upsert
variants, workflow columns / active tables (separate video).

## Run economy — 1 run + 1 deliberate non-run

- **THE roundtrip run** spans scenes 4→5 as a freeze-cut: it starts in
  `the-read` (query selects the rows, the reference resolves, the agent's
  live ring comes on and HOLDS through the boundary) and the SAME run
  completes in `the-write`. Never re-run.
- **The bookend non-run** (scene 7): the query fires again and selects
  NOTHING — every row is already `qualified`. Its outcome differs from run 1
  in exactly the way the closing beat needs (the status column is the
  workflow's memory). The contrast with scene 4's lit range is what makes the
  empty result legible.

## Grounding note (every on-screen value traces here)

- **Chain:** `TABLE_ROUNDTRIP_WORKFLOW` from
  `~/sim/sim/apps/docs/components/workflow-preview/examples.ts`, verbatim:
  Table `#10B981` (Operation `Query Rows`, Filter `status = 'unprocessed'`)
  → Classify `#33C482` (Messages `Classify <table.rows>`)
  → Table `#10B981` (Operation `Update Rows`, Set
  `category, status = 'qualified'`). Both table blocks are named "Table" in
  the docs example; the reference is `<table.rows>` verbatim. Table block
  icon is lucide `Table` (block-icons.tsx), color re-verified against
  `apps/sim/blocks/blocks/table.ts` (`#10B981`).
- **Table content:** the `leads` table is the docs' running example
  (tables/using-in-workflows.mdx); rows come from this repo's authored demo
  content (`src/videos/module-2-tables/data.ts`): companies
  Acme Co / Bluefin / Cortex AI / Delta Labs / Evergreen, industry
  SaaS / Fintech / AI / Biotech / Energy. `status` values `unprocessed` →
  `qualified` are the docs' verbatim filter/set values. Written `category`
  values use data.ts's authored segment vocabulary (LEAD_DESC):
  mid-market / enterprise / startup / enterprise / mid-market — the same
  vocabulary as the docs' authored agent output (`{ category: "enterprise" }`).
- **Column-set assumption (batch-mode call):** docs name columns
  company / email / description / status (+ written `category`). We show
  company / industry / category / status — `email` and `description` have no
  authored values anywhere (never invent), while `industry` is an authored
  data.ts column with values. Rationale: every shown cell traces to authored
  content; the dropped columns are absence, not invention.
- **Record scene:** the docs' authored Query-Rows OutputBundle
  (using-in-workflows.mdx): block `table1`, `84ms`, tree
  `rows: array → 0: object → id (string) · company · status: "unprocessed"`,
  `rowCount: 5`. Deviations, noted: `company` shows "Acme Co" (the table on
  screen) instead of the docs' "Acme"; `totalCount: 42` is omitted because
  the video's table visibly holds exactly 5 rows. Log durations for the other
  two blocks are borrowed from the real beaming-polaris run
  (`module-5-agents/demo-corpus/triage-run.md`), same block types: agent
  12.2s (Triage), table write 111ms (LogTicket) — the module-5-sanctioned
  stand-in pattern; swap if William runs the roundtrip live.
- **`<table.rows>` resolved value (assumption):** the runtime value is an
  array; the row resolves to `[5 rows]` (the docs bundle's `rows: array` +
  `rowCount: 5` collapsed to row width). The full value is simultaneously
  visible as the lit range in the table above — module-5's truncation rule.

## Set piece + frame

One stage, owned by `layoutV2.ts`: the `leads` SimTable (verbatim product
grid, native metrics ×2) in the upper half; the roundtrip chain (SimBlocks at
module-1/5 geometry) in the lower half. Scenes differ only in state props and
camera. Scenes 1–2 frame the table centered via a camera transform of the SAME
layout; scene 3 eases the camera to identity while the chain assembles below.
Plain `#1b1b1b` ground, no canvas dots: the table is the hero and the product
never draws a grid on the builder canvas (assumption noted; dots would claim
the table lives on the canvas, which is false).

## Locked scene list (~62s)

1. **the-table** (~9s — zoom-through → assemble) — The Table tile
   (ObjectNode, module-1's workspace world) alone at center; camera pushes
   into it and crossfades to the table world: the `leads` grid assembles
   under the table-centered camera — header row first (column names + type
   icons), then the five rows stagger in. `category` empty, `status` all
   `unprocessed`.
   *Beat intent: next to your workflows there's a table — typed columns over
   rows, holding real records.*
2. **rows-and-fields** (~7s — selection grammar) — Row 2 takes the product's
   row selection (ONE range outline + tint across the row): a record. It
   releases; the `category` column takes a column selection (header ring +
   empty cells as one range): a field waiting to be filled. Releases before
   exit.
   *Beat intent: each row is one record; the empty column is work waiting.*
3. **the-workflow** (~9s — assemble) — Camera eases to identity (the table
   glides to the top of frame — same layout, camera move only); below it the
   roundtrip chain assembles the docs way: Table block fades in, edge draws,
   Classify, edge, Table.
   *Beat intent: a workflow attaches to the table through Table blocks — one
   reads, one writes.*
4. **the-read** (~10s — run, freeze) — Run. The Query block's live ring comes
   on and IN SYNC the five rows light as one selection range — the query is
   selecting its rows (synchrony only; no connector lines). WirePulse crosses
   edge 1. In Classify's Messages row `<table.rows>` glows with the range
   above, then resolves (ResolvedTag → `[5 rows]`). Classify's live ring
   comes on — and the moment HOLDS through the cut.
   *Beat intent: a Table-block read turns rows into workflow data — the
   reference points at the very rows lit above.*
5. **the-write** (~11s — same run completes) — Inside the held moment the
   ring sits a beat (working), then WirePulse crosses edge 2; the Update
   block goes live and IN SYNC the written range (`category` + `status` ×
   5 rows) lights as one selection while values dip in top-to-bottom
   (mid-market / enterprise / startup / enterprise / mid-market; every
   status flips to `qualified`). Update settles ok; rings, selection, and the
   resolved tag all release — but the table KEEPS its new values.
   *Beat intent: results land back in cells — the table itself changed.*
6. **the-record** (~9s — record-panel) — Table + chain dim to 0.35; the
   OutputBundle rises with the docs' authored query record: logs
   Table 84ms · Classify 12.2s · Table 111ms; output tree `rows` (array,
   highlighted) → `0` → `id` / `company: "Acme Co"` / `status:
   "unprocessed"`, `rowCount: 5`. Panel leaves; world undims.
   *Beat intent: every read and write leaves a record.*
7. **queue-and-record** (~7s — bookend non-run) — The Query block runs once
   more: live ring on, the `status` column header glints (the filter reading
   it) — and NO range lights; every row already reads `qualified`. Query
   settles green, the ring releases, and the camera eases back ~7% to hold
   the balanced final frame: the filled table over its workflow.
   *Beat intent: the workflow never redoes finished work — the table is both
   the queue it pulls from and the record of what it has done.*

## Continuity contract

- One stage from `layoutV2.ts`; nothing relayouts, ever. Scenes 1–2 vs 3–7
  differ by CAMERA over identical geometry.
- 1→2: table assembled, table-centered camera, no selections. Identical.
- 2→3: same; all selections released before scene 2 ends. Identical.
- 3→4: camera identity, chain assembled idle (template rows, edges drawn),
  table unprocessed. Identical.
- 4→5: **freeze-cut, deliberately held live state:** Classify live ring ON,
  the 5-row range lit in the table, `<table.rows>` resolved to `[5 rows]`,
  both pulses spent. The held state IS the contract; verified like any pair.
- 5→6: run fully released (template tag restored, no rings, no selection) —
  EXCEPT the table's new cell values, which are the point and persist for the
  rest of the video. Identical frames.
- 6→7: same idle state, filled table; the record panel fully gone. Identical.
- Scene 7 ends pulled back (~0.93) on a held frame — no following boundary.
- Verified with `bun scripts/verify-boundaries.ts module-2-tables-v2`
  (pixel diff; structural zero, LSB-only noise passes).
