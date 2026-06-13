# swe-fleet demo corpus — the `backlog` table and the acme/api repo

The video's "real content": a small engineering org (acme) runs its issue
backlog out of a Sim table and lets the overnight fleet work it. All
values the video shows on screen trace to this file (authored demo
content, per the demo-corpus convention — module-2's data.ts pattern).

## The `backlog` table

Columns (all shown): `issue` (text) · `status` (text) · `pr` (text).

| # | issue               | status (before → after) | pr (after) |
| - | ------------------- | ----------------------- | ---------- |
| 1 | OAuth redirect loop | open → done             | #484       |
| 2 | Webhook null user   | open → done             | #486       |
| 3 | CSV export crash    | open → done             | #482       |
| 4 | Search debounce     | open → done             | #485       |
| 5 | S3 upload retries   | open → done             | #483       |

PR numbers are assigned in FINISH order, not row order — the parallel
docs say result order isn't guaranteed, and the scramble (3, 5, 1, 4, 2)
is the video's drawing of that sentence. Row 3 finishes first because it
is the fan's followed (middle) lane.

## The repo

`acme/api` — single repository, base branch `main`. The GitHub block's
Repository row uses the landing template's own `org/repo` display style
(template-workflows.ts GitHub blocks author `Repository | org/repo`).

## The workflow (`Overnight Fleet`)

- **Schedule** — Run Frequency `Daily`, Time `12:00 AM`. Armed pill
  caption: `At 12:00 AM · Next: Mar 18, 12:00 AM` (cronstrue phrase +
  schedule-info date format; Mar date anchor = the series' landing
  logs-preview anchor, same as schedules-v1).
- **Get Issues** (Table) — Operation `Query Rows`, Filter
  `status = 'open'` (module-2's docs-verbatim filter shape).
- **Fleet** (Parallel container) — Parallel Type `Parallel Each`,
  Parallel Items `<getissues.rows>` (editor labels verbatim from
  subflow-editor.tsx / use-subflow-editor.ts).
- Inside, one lane:
  - **Engineer** (Agent) — Messages `Fix <parallel.currentItem>`,
    Model `claude-sonnet-4.6` (landing template's authored model value),
    Tools: GitHub (#181C1E, GithubIcon).
  - **GitHub** — Operation `Create pull request`, Repository `acme/api`.
  - **Mark Done** (Table) — Operation `Update Row by ID`, Row Data
    `{"status": "done", …}` (truncated; the full write is visible in the
    table — the module-5 truncation rule).

## Demo flows supported

1. Scene 1: the table assembles with the five `open` issues.
2. Scene 5: the midnight query selects all five rows.
3. Scene 7: row 3 flips first (`done`, `#482`).
4. Scene 8: rows 5, 1, 4, 2 flip in that order (#483–#486).
5. Scene 9: the morning table — every row done, every pr filled.
