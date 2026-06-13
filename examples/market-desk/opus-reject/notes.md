# Notes — The Prediction-Market Desk (market-desk-v1)

STATUS: delivered — script locked, scenes built, lint clean, boundaries
verified (structural; ticking-odds exception documented), narration
synced (voice M5lSFiV8wa1aYNbadPOy), 1080p render at
/tmp/hype2/market-desk.mp4, committed locally.

## Director's mandate (verbatim intent)

HYPE REEL 2 — "2x more hype." Taste rule: the spectacle must be VISIBLE +
TRUE; multiplicity / live numbers / parallel excite; linear chains do
NOT; KEEP THE SET PIECE IN FRAME; novel 2026 use cases. Best of reel 1:
agent-economy, swe-fleet, browser-agent. Worst: self-healing
(subtle + false), red-team (linear + cut across frame). Topic: THE
PREDICTION-MARKET DESK — a scheduled agent that researches prediction
markets and flags mispricings. Money shot: a board of live markets with
ticking odds, agent-estimates appearing beside the market odds, edges
lighting up, a SIGNAL badge on the mispriced ones.

## The conceptual job

This is a COMPOSITION video. Every primitive has its own explainer
already (table = module-2, schedule = schedules-v1, parallel = loops-v1,
agents/tools = module-5). The job: show that a board (table), a clock
(schedule), a data pull (Polymarket), and parallel web research (a
Parallel container holding an Analyst with Exa/Perplexity/Serper tools)
compose into a prediction-market desk — with zero new machinery. The
spectacle IS the board filling: six markets, six researchers running at
once, the est column resolving, the edge column flagging signals.

## Why it clears the reel-2 bar (VISIBLE + TRUE + in-frame)

- VISIBLE: the board is the hero and never leaves frame. Live odds tick
  every frame; the est column fills market by market; three SIGNAL badges
  flag the mispriced rows. The research fans six-wide — six Analyst
  instances live at once, the parallel money shot. Numbers ticking, a
  board filling, edges flagging — exactly the brief.
- TRUE: every block is real in the registry (Polymarket, Exa, Perplexity,
  Serper, Schedule, Agent, Parallel) with re-derived names/colors/ops.
  The desk reads markets and signals edges — data + analysis, all
  registry-true. It does NOT claim to place real-money trades (Polymarket
  get_markets is read-only; mandate framing rule honored).
- IN-FRAME: the set piece (board + chain + fanned container) is centered
  and fits CAM_ALL; the fan (the hype moment) fits CAM_CONT with all six
  lanes legible. No far-camera cut (the red-team failure mode avoided).
- Multiplicity/parallel (the reel-1 winners' lesson): six live markets,
  six concurrent researchers, a filling column, flagging signals. Not a
  single linear chain panned across.

## Grounded vs authored (the honesty line)

- Grounded (registry, re-derived 2026-06-12): all block identities —
  names, bgColors, operations, outputs, icons. See script-v1.md grounding
  and demo-corpus/README.md.
- Authored DEMO values (declared, never claimed as a live feed): the six
  market questions, the market odds, the agent estimates, the edges, the
  signal threshold (|edge| ≥ 8 pts), the schedule time/next-date, the PR
  of the live tick (a deterministic frame-derived wobble). All in data.ts.
- ⟨pending⟩ for real live odds / real news / the agent's real
  probabilities — never invented as truth.

## Shared-component change

Added an optional `colWidths?: number[]` prop to `SimTable` (a wide
question column beside narrow numeric columns). The real table-grid
supports user-resized columns, so this is product-legal; default behavior
(uniform 160px) is unchanged, so existing videos are unaffected.

## Build-time decisions worth flagging (reversible)

1. Research lane = ONE Analyst with three tool chips, not three separate
   blocks — keeps the fanned lane one legible unit. (script assumption 2.)
2. 6 markets / 6 instances; 3 flag SIGNAL — enough to read "several
   mispriced" without a uniformly-flagged board. (assumptions 5–6.)
3. Container is intrinsically tall (holds the 6-lane fan); idle scenes
   (2,3) show it mostly empty — the same shape swe-fleet shipped. The run
   scenes (5–7) fill it; that is where the hype lives.
4. Boundary verification intentionally NON-identical in the mkt cells
   (the board is alive by design) and the ringing chips at the
   freeze-cuts — documented exception, structure is otherwise identical
   (confirmed by opened boundary stills).

## Verification done

- `bun run lint` — clean (eslint + tsc).
- Opened rendered stills at every scene's key beats + all three
  freeze-cut boundary pairs (4→5, 5→6, 6→7): structurally continuous.
- `bun scripts/verify-boundaries.ts market-desk-v1` — diffs localize to
  the ticking-mkt cells + ringing chips (the live-board exception).
