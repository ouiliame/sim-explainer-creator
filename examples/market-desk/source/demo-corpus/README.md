# market-desk demo corpus — the `markets` board

The desk's standing Sim table. Five markets in the watchlist style of
Polymarket's own categories (econ, crypto, entertainment, tech, climate).
Every on-screen value in market-desk-v1 traces to this file (the code
copy is `../data.ts`).

## The board

| # | market              | odds | agent_est | edge  | signal |
|---|---------------------|------|-----------|-------|--------|
| 1 | Fed cut by June     | 0.32 | 0.45      | 0.13  | watch  |
| 2 | ETH $5k in 2026     | 0.41 | 0.38      | -0.03 | —      |
| 3 | Avatar 3 tops $2B   | 0.12 | 0.11      | -0.01 | —      |
| 4 | GPT-6 ships in 2026 | 0.55 | 0.71      | 0.16  | watch  |
| 5 | La Niña by winter   | 0.64 | 0.60      | -0.04 | —      |

Derivations (the honesty contract):

- **odds** — the market's current price (0..1 probability), the values
  the Polymarket block's `Get Markets` confirms each run. Pre-seeded:
  the board exists before the run.
- **agent_est** — the analyst agent's researched probability estimate
  (authored demo output). Written by the lane's `Upsert Row`.
- **edge = agent_est − odds**, arithmetic, checked per row
  (0.45−0.32=0.13; 0.38−0.41=−0.03; 0.11−0.12=−0.01; 0.55→0.71=0.16;
  0.60−0.64=−0.04).
- **signal** — `watch` iff |edge| ≥ 0.08, else `—`. A research flag
  only: there is no side, size, order, or P&L anywhere in this corpus.

## Demo flows supported

1. **The pull (scene 5):** Schedule fires hourly (`Every hour`, minute
   0); Polymarket `Get Markets` (Sort By Volume, Limit 5) returns the
   five markets → `<polymarket.markets>`.
2. **The fan (scene 6):** Parallel Each over `<polymarket.markets>` —
   five runtime instances, one market each, as
   `<parallel.currentItem>`.
3. **One analyst (scene 7):** the followed instance prices row 4
   (GPT-6 — the largest edge): Exa search → Perplexity cross-check →
   `Upsert Row` writes `{"agent_est": 0.71, "edge": 0.16,
   "signal": "watch"}` (shown truncated on the block; full values land
   in the table row).
4. **The signals (scene 8):** remaining instances finish in scramble
   order — rows 2, 5, 1, 3 (parallel result order not guaranteed,
   parallel.mdx). Both watch flags (rows 1 and 4) burn at full residue.

## Pill timestamps

Run day Jun 12, 2026 (build date). Armed: `Every hour · Next: Jun 12,
3:00 PM`; after the 3 PM fire it re-arms to `Jun 12, 4:00 PM`.
