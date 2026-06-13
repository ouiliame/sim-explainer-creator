# Narration — swe-fleet-v1 (draft for the director to massage)

Register: the gold KB script — clean condensed prose that explains what
the viewer is seeing. Energy comes from the content and the pacing, not
from trailer voice.

## 1. the-backlog — min 8s

You probably have a backlog like this. In Sim it's a table — each row is
one open issue, waiting on a fix.

## 2. the-fleet-takes-shape — min 16s

Here's the workflow that runs it overnight: a Schedule set for midnight,
a query that pulls every open issue, and a Parallel container holding
one coding lane — an agent, a GitHub block, and a table update.

## 3. wired-by-reference — min 11s

One reference wires it together: the parallel's items are the query's
rows, so the lane runs once for every open issue.

## 4. lights-out — min 6s

Deploying arms the clock — the next run is on the calendar, with nobody
at the keyboard.

## 5. midnight — min 11s

At midnight it fires on its own and re-arms for tomorrow. The query
lights up all five open issues, and the batch heads into the fleet.

## 6. the-fan — min 12s

The parallel turns that batch into a fleet — one copy of the lane per
issue. Five engineers start at the same moment, each holding its own row
as the current item.

## 7. one-engineer — min 20s

Follow one lane. The agent reads the code, writes the fix, and pushes a
branch — three GitHub tool calls. The GitHub block opens the pull
request, and the table block flips this lane's own row to done.

## 8. the-wall — min 13s

The rest land in whatever order they finish — every instance is
independent. Row after row, the status column flips to done, and every
issue gets its PR number.

## 9. morning — min 8s

By morning the table is the record: five pull requests ready for review,
and the clock already armed for tomorrow night.
