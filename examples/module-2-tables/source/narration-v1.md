# Module 2 — Tables v2 — narration v1

DRAFT narration. Massage freely — edit the prose under each header, then
re-run:

    bun scripts/vo-sync.ts --comp module-2-tables-v2 --narration src/videos/module-2-tables/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change.

## 1. the-table — min 9s

Alongside your workflows, a workspace can hold tables — typed columns over rows, holding real records. This one tracks incoming leads.

## 2. rows-and-fields — min 7s

Each row is one record, and each column is a typed field. The empty column is the work this workflow is about to do.

## 3. the-workflow — min 9s

A workflow connects to a table through Table blocks: one block queries rows out, and another writes results back.

## 4. the-read — min 10s

When the run starts, the query selects the rows that match its filter — and the table reference hands them to the next block as data.

## 5. the-write — min 11s

When the classifier finishes, the results land back in the table: a category for every row, and every status flipped to qualified.

## 6. the-record — min 9s

Every read and write is recorded in the run's log — which rows were touched, how many, and how long it took.

## 7. queue-and-record — min 7s

Run the workflow again and nothing matches — every row is already done. The table serves as both the queue the workflow pulls from and the record of what it has already done.
