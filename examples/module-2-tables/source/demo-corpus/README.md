# module-2-tables — demo corpus

Tables are tabular, so the invented "real content" for this module lives in
`../data.ts` rather than as standalone markdown documents. This file indexes the
demo datasets and which scenes consume them.

## Datasets (in `../data.ts`)

- **ANATOMY_COLUMNS / TYPE_CHIPS** — generic typed columns (`text · number ·
  boolean · date · JSON`) for the keystone anatomy beat. Used by
  `TableAnatomyScene`.
- **BELONGS_COLUMNS / BELONGS_ROWS** — `status · score · category · output`, a
  small filled grid showing the kinds of things tables hold. Used by
  `WhatBelongsScene`, `WorkVsInspectableScene`, `PipelineComesToDataScene`.
- **TICKET_COLUMNS / TICKET_MESSAGES / TICKET_FILLED** — the V2 support-ticket
  table: `message · category · urgency · status`. Starts message-only, gets
  classified by the workflow. `FOCUS_ROW` is the single row read/processed/written
  in `ReadRowsScene → ProcessRowScene → WriteBackScene`. `ticketRowsFilled()` is
  the dashboard end state (`TableAsDashboardScene`).
- **LEAD_* / leadRows()** — V3 lead-qualification table with input columns
  (`company · industry · description`) and an output column (`qualified?`). Used
  by `WorkflowColumnScene`, `InputOutputColumnsScene`.
- **CASCADE_COLUMNS / CASCADE_FILL** — three chained workflow columns
  (`enrich → qualify → outreach`) for the dependency-cascade and final
  active-table beats (`CascadeScene`, `TableIsTheAgentScene`).

## Continuity notes

- The `TableGrid` is the persistent element. Its geometry is fixed in
  `../layout.ts` (`GRID_X/GRID_Y`, `COL_W`, `CELL_H`, `HEADER_H`). Two-up scenes
  shift the grid to `TWO_UP_GRID_X` and place the workflow chain at `CHAIN_X`.
- The same focus row (`FOCUS_ROW`) carries through read → process → write-back so
  the cut between those scenes reads as one continuous row.
