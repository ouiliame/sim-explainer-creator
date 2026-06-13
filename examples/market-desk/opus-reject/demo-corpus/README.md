# market-desk demo corpus

The invented "company content" this video references. Every on-screen
value comes from here (and is mirrored verbatim in `../data.ts`). These
are CLEARLY-AUTHORED DEMO VALUES — plausible 2026-flavored prediction
markets, NOT a live Polymarket feed. The video never claims these are
real odds (script grounding ⟨pending⟩ note; mandate framing rule).

## The board (`markets`)

Six live prediction-market questions. Each row:

| col      | meaning                                                    |
| -------- | ---------------------------------------------------------- |
| question | the market's question (short)                              |
| mkt      | the market's implied YES probability, % — ticks "live"     |
| est      | the Analyst agent's own probability, % (fills during run)  |
| edge     | est − mkt, signed points (resolves during run)             |

Authored rows (base mkt %, the agent's est %, → edge, signal if |edge|≥8):

| # | question                              | mkt | est | edge | SIGNAL |
| - | ------------------------------------- | --- | --- | ---- | ------ |
| 0 | Fed cuts rates in July                | 41  | 58  | +17  | ✓      |
| 1 | GPT-5 ships before October            | 63  | 67  |  +4  |        |
| 2 | Starship reaches orbit this quarter   | 72  | 60  | −12  | ✓      |
| 3 | Box office #1 opens above $90M        | 55  | 52  |  −3  |        |
| 4 | New AI exec order signed by Q3        | 28  | 39  | +11  | ✓      |
| 5 | Home team wins the division           | 48  | 51  |  +3  |        |

Row 2 (Starship) is the FOLLOWED instance — the one the camera traces
through the research fan and the lane lean-in (scenes 5–6). Its est lands
first (60), edge −12, SIGNAL.

Finish order for the other five Analysts (scene 7, scramble — parallel
result order isn't guaranteed, per parallel.mdx): rows 4, 0, 5, 1, 3.
Signals end up on rows 0, 2, 4 (three of six).

## The desk (the workflow that fills the board)

- **Schedule** — Run frequency Daily, Time 9:00 AM. Armed pill caption
  `At 9:00 AM · Next: Jun 13, 9:00 AM` (cronstrue-style, swe-fleet
  grammar). Next-date dips Jun 13 → Jun 14 when it fires.
- **Pull Markets** (Polymarket, Get Markets) — returns the board
  (`markets` output). Block row: `Operation | Get Markets`.
- **Desk** (Parallel container, Parallel Each) — `Parallel Items |
  <pull.markets>`. One instance per market.
- **Analyst** (Agent) inside the container:
  - Messages: `Price P(YES) for <desk.currentItem>`
    (`<desk.currentItem>` resolves to the followed market's question)
  - Model: `claude-sonnet-4.6`
  - Tools: Exa · Perplexity · Serper (the three web-research blocks,
    attached as tools; each chip rings as it's called)

## Demo flows supported

- **Board assembly + live ticking** (scene 1): six market questions with
  implied odds that visibly move.
- **Desk assembly** (scene 2): the scheduled research workflow.
- **One reference** (scene 3): `<pull.markets>` wires the board to the
  Parallel container.
- **The sweep** (scene 4): schedule fires, Polymarket returns the board,
  the batch enters the desk.
- **Parallel research** (scenes 5–6): six Analyst instances, each
  searching the web (Exa/Perplexity/Serper) and pricing one question.
- **The board lights up** (scene 7): est column fills, edges resolve,
  three rows flag SIGNAL.
