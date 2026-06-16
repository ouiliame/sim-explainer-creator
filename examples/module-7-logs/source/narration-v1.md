# Module 7 — Logs — narration v1

DRAFT narration. Massage freely — edit the prose under each header, then re-run:

    bun scripts/vo-sync.ts --comp module-7-logs-v2 --narration src/videos/module-7-logs/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change.

## 1. a-run-happens — min 11s

Here's a workflow processing a support ticket — four blocks, start to finish. Every time a workflow runs, Sim records exactly what happened. That record is called a log.

## 2. the-record — min 10s

The log lists every block in the order it ran, along with its timing — so you can see exactly where the twelve seconds of this run were spent.

## 3. what-it-really-did — min 12s

Selecting a block shows everything it actually did. This agent made three tool calls — a customer lookup and two knowledge searches — and the log records each call, along with the tokens it used.

## 4. read-it-backwards — min 20s

The log also shows where every value came from. This row was built from the function's result. The function read the agent's answer, and the agent read the customer's message. To debug a workflow, you read the log backwards — from the wrong value, step by step, to its source.

## 5. every-run-writes-one — min 9s

Every run produces a log automatically. When a workflow does something unexpected, the log is the first place to look.
