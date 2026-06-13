# Notes — The Overnight Engineering Fleet (swe-fleet-v1)

STATUS: delivered — script locked, scenes built, lint clean, boundaries verified, narration synced, 1080p render at /tmp/hype-reel/swe-fleet.mp4, committed locally.

## Director's mandate (verbatim intent)

Hype reel — existing explainers were called BORING. Exciting agents
implemented in Sim, "go crazy": non-trivial workflows, spectacle,
product-true Sim grammar, clean energetic narration. Topic: Devin-style
SWE agents at fleet scale. Backlog of issues in a table, a schedule fires
at midnight, parallel coding-agent lanes each take an issue (read the
code, write the fix, open a PR via the GitHub integration), and by
morning the table's status column is a wall of green DONE rows.
Money shot: the status column flipping row after row while the lanes run.

## Impressions / the conceptual job

This is a COMPOSITION video, not a primitive video: every part has its
own explainer already (tables = module-2, schedule = schedules-v1,
parallel = loops-v1, agents = module-5). The job here is to show that
three primitives the viewer may already know — table-as-queue, schedule
trigger, parallel container — compose into the thing every eng org is
currently hyping, with zero new machinery. The spectacle IS the
composition: one scheduled run, fanned five-wide, writing its results
back into the queue it came from.

## What needs explaining (strong lines)

- The backlog is a Sim table. Each row one issue; the status column is
  the queue's state.
- The workflow is three pieces: a Schedule (the caller), a Table query
  (the intake), a Parallel container (the fleet).
- Inside the container, ONE lane: an Agent with the GitHub toolset reads
  the code and writes the fix, a GitHub block opens the pull request, a
  Table block marks the row done.
- The parallel distributes the query's rows — one instance per issue,
  all at once.
- Each lane closes its own loop: the row flip in the table IS the lane
  finishing. Finish order isn't guaranteed (docs) — the rows flip in
  scramble order, which reads as a real fleet.
- By morning the table is the record: done in every status cell, a PR
  number in every pr cell, and the clock already armed for tomorrow.

## Deliberately not taught

- Parallel count-mode, batch size, nesting (loops video territory).
- GitHub trigger mode / webhooks (webhooks video).
- How the agent actually edits code (tool-call anatomy = module-5).
- Failure lanes / retries / approvals. One clean overnight, no errors —
  this is the hype reel; the approvals video owns the guardrail story.
- Table schema design, filters in depth.

## Macro arc

Capability-first: the backlog exists (known object: a table) → the fleet
workflow assembles (known grammar: blocks + a container) → wired by one
reference → deploy arms the clock → midnight: ONE run, seen at three
scales (the fire, the fan, one lane), then the money shot (the wall) →
morning bookend. The entire video is a single scheduled run — run
economy at its floor.

## Where the product already draws it

- Table grid: `SimTable` (verbatim app port, module-2).
- Blocks: `SimBlock` + registry colors/titles (schedule.ts, table.ts,
  github.ts, agent.ts).
- Container: loops-v1's `SubflowContainer` port of the docs'
  preview-container-node + app subflow node (re-derived here at fleet
  proportions).
- Armed schedule: schedules-v1's SchedulePill (module-6 deployment
  marker + product schedule-info caption).
- Editor card: loops-v1's ConfigCard grammar with the parallel editor's
  verbatim labels.
