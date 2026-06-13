# market-desk-v1 — narration v1

Register: clean condensed prose that explains what the viewer is seeing
(calibrated on examples/vo/_gold). Headers match the SCENES array
exactly; "min Ns" is the authored visual minimum (vo-sync extends, never
shrinks). Pace target ~1.9 words/sec. Kept tight for the hype reel.

## 1. the-board — min 9s

A prediction market turns a question into a price, and that price is the
crowd's odds on yes. Here's a board of live markets from Polymarket, each
one moving in real time as people trade.

## 2. the-desk-takes-shape — min 13s

We can put an agent on this board. The desk is one workflow: a morning
schedule, a Polymarket block that pulls the markets, and a container
holding an Analyst that prices each question, searching the web with Exa,
Perplexity, and Serper.

## 3. wired-by-reference — min 8s

One reference does the wiring. Parallel Items points at the markets from
the pull, so the desk runs the Analyst once for every question it returns.

## 4. the-sweep — min 9s

Every morning the schedule fires on its own. Polymarket returns the board,
and all six questions head into the desk at once.

## 5. the-research-fan — min 11s

The desk splits the work, running one Analyst per market in parallel.
Every instance starts at the same moment, each searching the web for
evidence on its own question.

## 6. one-market — min 12s

Follow one. The Analyst weighs what it finds and settles on its own
probability. That estimate lands beside the market's, and the gap between
them is the edge.

## 7. the-board-lights-up — min 11s

The rest finish the same way, filling the board market by market. Where
the agent and the price disagree by enough, the row flags a signal — a
mispriced question worth a second look.

## 8. the-desk — min 8s

So the desk runs while you sleep, pricing every market against the crowd
and surfacing the edges — on Polymarket, Kalshi, or any board you give it.
