# Narration — market-desk-v1 (draft for the director to massage)

Register: the gold KB script — clean condensed prose that explains what
the viewer is seeing. Honest framing throughout: the desk researches and
flags; nothing claims a trade, a position, or a P&L.

## 1. the-board — min 8s

Here's a watchlist of prediction markets in a Sim table: each row is one
market, its current odds, and three columns a workflow is about to fill.

## 2. the-desk-takes-shape — min 12s

Below the board, the workflow takes shape: a Schedule that fires every
hour, a Polymarket block that pulls the markets, and one analyst lane
inside a Parallel container.

## 3. wired-by-reference — min 7s

One reference wires it together: the parallel's items are the markets
Polymarket returns, so the lane runs once per market.

## 4. armed — min 5s

Deploying arms the schedule — the next run is on the calendar, with
nobody at the desk.

## 5. the-pull — min 9s

On the hour, the schedule fires on its own and re-arms. The Polymarket
block pulls the five markets, and the whole batch heads into the Desk.

## 6. the-fan — min 8s

The parallel splits the batch — one copy of the lane per market. Five
analysts start at the same moment, each holding its own market.

## 7. one-analyst — min 12s

Follow one analyst. The agent searches with Exa, cross-checks with
Perplexity, and settles on an estimate. The table block then writes its
row back — the estimate, and the gap between it and the odds.

## 8. the-signals — min 10s

The other analysts land in whatever order they finish, and the estimates
fill row after row. Where the gap is large, the signal column flags the
market to watch.

## 9. the-desk-at-rest — min 10s

An hour from now, it prices the board again. The table stays a research
surface: the crowd's odds, the desk's estimates, and the markets worth a
closer look.
