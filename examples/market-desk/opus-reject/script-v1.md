# The Prediction-Market Desk (v1) — market-desk

Registered as `market-desk-v1` (new video, no prior take; nothing
overwritten). Built batch-mode under a director's mandate (HYPE REEL 2:
"2x more hype" — VISIBLE + TRUE, multiplicity / live numbers / parallel
excite, KEEP THE SET PIECE IN FRAME, novel 2026 use case). Topic: an
agent that researches prediction markets and flags mispricings. Every
gate below the mandate converted to a written assumption.

**The one idea:** a scheduled agent runs a prediction-market desk. It
pulls a board of live markets from Polymarket, researches every open
question in PARALLEL (Exa + Perplexity + Serper as the Analyst's tools),
forms its own probability for each, and writes that estimate beside the
market's implied odds. Where the agent's number and the market's number
diverge, an EDGE lights up and a SIGNAL badge flags the mispriced row.
The board is the money shot: live odds ticking, a column of
agent-estimates filling in, edges flagging.

**Macro arc:** the board first (the known object — a table of live
markets, odds ticking), then the desk that fills it: Schedule fires →
Polymarket pulls the markets → a Parallel container fans the research
(an Analyst that searches the web three ways) → the Analyst's
probability lands in the board's `est` column → the `edge` column
resolves and the mispriced rows flag SIGNAL. Then the pull-back: the
whole board lit, several signals flagged, the desk armed for the next
sweep.

**Run count: 1.** A single scheduled traversal spans scenes 4→7 (the
fire, the pull, the parallel research fan, one market analyzed end to
end, then the board flagging). No second sweep; the board-assembly and
desk-assembly scenes are runless, the bookend holds the settled state of
the same run.

## Grounding (product truth, re-derived 2026-06-12 from `_reference/sim`
worktree checkout; block registry `apps/sim/blocks/blocks/*.ts`)

- **Polymarket block**: registry `polymarket.ts` — name `Polymarket`,
  bgColor `#4C82FB`, description "Access prediction markets data from
  Polymarket". Operation `Get Markets` (subBlock `Operation`, option
  `get_markets`); output `markets` (json, "Array of market objects").
  Icon = `PolymarketIcon` (apps/sim/components/icons.tsx:6037), ported
  verbatim, white on the blue chip. The board's market rows trace to the
  `markets` output; the `<pull.markets>` reference uses a user-named
  block (`pull`), product-legal (assumption 4).
- **Kalshi block**: registry `kalshi.ts` — name `Kalshi (Legacy)`,
  bgColor `#09C285`. NOT drawn (the desk pulls from Polymarket); named in
  narration only as a sibling source. The "(Legacy)" suffix is why
  Polymarket is the clean on-canvas block. (Assumption 8.)
- **Exa block**: registry `exa.ts` — name `Exa`, bgColor `#1F40ED`,
  "Search with Exa AI". Operation `Search` (`exa_search`); output
  `results` (json). Icon `ExaAIIcon` (icons.tsx:1585), verbatim, white
  on the blue chip.
- **Perplexity block**: registry `perplexity.ts` — name `Perplexity`,
  bgColor `#20808D` ("Perplexity turquoise"), "Use Perplexity AI for
  chat and search". Operation `Search` (`perplexity_search`); output
  `results` (json). Icon `PerplexityIcon` (icons.tsx:982), verbatim.
- **Serper block**: registry `serper.ts` — name `Serper`, bgColor
  `#2B3543`, "Search the web using Serper". Operation `search`. Icon
  `SerperIcon` (icons.tsx:781) is multicolor — ported verbatim (its own
  fills) on the dark chip, per the product's own rendering.
- **Agent block**: registry `agent.ts` — name `Agent`, bgColor
  `var(--brand)` = `#33C482` (series `BLOCK_COLORS.agent`). subBlock
  titles `Messages`, `Model`, `Tools`. Named `Analyst` (user-named
  block; assumption 4). Model value `claude-sonnet-4.6` (landing
  templates' authored value, reused from swe-fleet grounding). Tool
  chips Exa / Perplexity / Serper ring = "the tool was called"
  (module-5 grammar) — the three research blocks attach as the agent's
  tools.
- **Schedule block**: registry `schedule.ts` — name `Schedule`, bgColor
  `#6366F1`, subBlock titles `Run frequency` (Daily) and `Time`. Armed
  pill = schedules-v1 / swe-fleet SchedulePill grammar (green live dot +
  cronstrue caption `At 9:00 AM · Next: …`).
- **Parallel container**: identity from the app subflow config
  (`subflows/parallel/parallel-config.ts`): SplitIcon, bgColor `#FEE12B`
  (dark glyph per the product luminance rule). Anatomy = the docs'
  preview-container-node port (loops-v1 / swe-fleet rig). Editor labels
  verbatim: `Parallel Type` / `Parallel Each` / `Parallel Items`.
  Semantics from parallel.mdx: collection distributed one item per
  instance as `<parallel.currentItem>`; instances isolated; result order
  not guaranteed.
- ⟨pending⟩ (NOT shown as live truth): real Polymarket odds, real news,
  the agent's real probabilities. All board numbers are CLEARLY-AUTHORED
  DEMO VALUES declared in `data.ts` / `demo-corpus/README.md` — plausible
  but invented, never claimed to be a live feed. The video frames the
  desk as RESEARCH + SIGNAL (data + analysis) and never claims it places
  real-money trades (the on-canvas blocks are data + analysis only;
  Polymarket `get_markets` is read-only). This is the mandate's explicit
  framing rule.

## Batch-mode assumptions (each reversible; swap cost noted)

1. **Composed set piece, no single product source.** No docs example
   draws a markets board over a research fan; the set piece composes the
   canonical rigs (module-2 table-over-chain frame, swe-fleet container
   fan, schedules pill, module-5 run grammar). Composition is the
   subject. Swap cost: n/a.
2. **Research lane = one Analyst with Exa ‖ Perplexity ‖ Serper tools.**
   The three web blocks feed the Analyst AS TOOLS (tool chips, module-5
   grammar) — drawn as one Analyst block whose three chips ring as it
   researches, rather than three separate blocks, so the lane stays one
   legible unit and the fan stays readable. The agent forming a
   probability from web research is the registry-true capability. Swap
   cost: medium (lane geometry).
3. **Board columns `question / mkt / est / edge`.** `mkt` = the market's
   implied YES probability (Polymarket price × 100, a %); `est` = the
   Analyst's probability; `edge` = est − mkt (signed points). Short noun
   headers, not sentences. Swap cost: trivial.
4. **User-named blocks** `pull` (Polymarket), `Desk` (the Parallel
   container), `Analyst` (Agent). Product-legal; inside-references are
   `<parallel.*>`; `<pull.markets>` traces to the Polymarket `markets`
   output. Swap cost: trivial.
5. **6 markets / 6 research instances.** Six fills the board legibly and
   keeps every instance countable; the fan shows the followed (middle)
   instance at full rows and the others as compact header-only ghosts
   (swe-fleet readable-fan precedent). Swap cost: low (data + count).
6. **3 of 6 rows flag SIGNAL.** Edge threshold = |edge| ≥ 8 pts
   (declared in data.ts). Three signals reads "several mispriced"
   without the board looking uniformly flagged. Swap cost: trivial.
7. **Live-odds tick is a deterministic frame-derived jitter** around each
   market's authored base value (±1–2 pts, small sine the board reads as
   "live"), NOT a real feed. The est/edge values are stable authored
   numbers. Swap cost: trivial.
8. **Kalshi named, not drawn; no trade-execution beat.** The desk reads
   markets and signals edges — it does not place orders on canvas
   (mandate framing rule). Kalshi appears only in narration as a second
   source. Swap cost: additive later with a real run artifact.
9. **Plain `#1b1b1b` ground, no canvas dots** behind the board —
   module-2 / swe-fleet precedent for table-over-chain stages.

## Motion language

Values live in cells (the board's `mkt` odds tick via a frame-derived
delta; `est` and `edge` arrive as cell-text DipSwaps); wires carry light
only (`WirePulse` on straight outer wires, `PathPulse` on the curved
inner fan wires). State via product language (blue live ring, green ok
ring, 0.35 dim, tool-chip ring for the research calls). The EDGE signal
is the one new accent: a mispriced row gets a warm amber `edge` cell and
a small `SIGNAL` pill at the row's right — the only on-screen word, and
it's a product-style status badge (a state, like a ring), not a
sentence. The board's filling `est` column + flagging signals ARE the
spectacle.

## Locked scene list (~70s visual minimum)

1. **the-board** (~9s) — [assemble]
   Board-centered camera. The `markets` board assembles: header row
   (question / mkt / est / edge with type icons), then six market rows
   stagger in — each `question` filled, each `mkt` a live YES% that
   immediately starts ticking, `est` and `edge` empty. Row 1 takes a
   brief product row-selection and releases.
   *Beat intent: a board of live prediction markets — each row a real
   question, each with the market's implied odds, already moving.*

2. **the-desk-takes-shape** (~12s) — [assemble + camera ease]
   Camera eases out; the board glides to the top of frame (camera move
   only). Below, the desk assembles in flow order: Schedule (Run
   frequency Daily / Time 9:00 AM) → edge → Pull Markets (Polymarket,
   Get Markets) → edge → the Desk container (yellow Split chip, inner
   Start pill) — and inside it the research lane: inner wire → Analyst
   (Messages "Price P(YES) for <desk.currentItem>" / Model / three tool
   chips Exa · Perplexity · Serper).
   *Beat intent: the desk is one workflow — a clock, a Polymarket pull,
   and a container holding the research: an Analyst that searches the web
   three ways and prices each question.*

3. **wired-by-reference** (~7s) — [zoom-aside]
   The container takes the blue editing ring; world dims to 0.35. The
   editor card slides in: header (Split chip + Desk), `Parallel Type |
   Parallel Each`, `Parallel Items | <pull.markets>` — the reference tag
   glows. Card leaves, ring releases, world undims.
   *Beat intent: one reference wires the board to the desk — whatever
   markets the pull returns, the desk researches one per instance.*

4. **the-sweep** (~9s) — [run, freeze]
   The Schedule ring lights ON ITS OWN and the pill's date dips forward
   (fired and re-armed). Pulse crosses edge 1; Pull Markets goes live and
   IN SYNC all six board rows light as one product selection range (the
   pull returning the markets). The range releases as the pulse crosses
   edge 2 into the container; the container's live ring comes on — and
   HOLDS through the cut.
   *Beat intent: the clock fires, Polymarket returns the board, and the
   whole set of questions heads into the desk.*

5. **the-research-fan** (~10s) — [freeze-cut continuation + fan]
   Opens inside the held moment (container live). Camera eases onto the
   container. The lane fans six wide: five compact ghost lanes separate
   out around the followed lane. The inner Start pill blips ONCE; six
   pulses leave together; all six Analysts go live AT THE SAME TIME, and
   in the followed lane `<desk.currentItem>` resolves to its market. The
   three tool chips on the followed Analyst ring in succession (Exa →
   Perplexity → Serper — the parallel web research). HOLDS through the
   cut.
   *Beat intent: the desk splits the board — one researcher per market,
   every instance isolated, all of them searching the web at once.*

6. **one-market** (~11s) — [camera lean-in, same run]
   Opens inside the held moment; camera pushes onto the followed lane.
   The Analyst's three tool chips finish ringing and it settles ok — it
   has a probability. The camera eases back out to the full frame just in
   time to see the followed market's row resolve: its `est` cell DipSwaps
   from empty to the agent's probability, then the `edge` cell resolves
   to the signed gap (est − mkt) with an amber tint, and a SIGNAL pill
   flags at the row's right (the gap is large). The other five Analysts
   are still live. HOLDS through the cut.
   *Beat intent: one researcher end to end — search the web, weigh the
   evidence, price the question; the agent's number lands beside the
   market's, and the gap is the edge.*

7. **the-board-lights-up** (~10s) — [the money shot]
   Full frame, steady camera. The remaining five Analysts finish in
   scramble order; each finish fills that row's `est` cell (DipSwap) and
   resolves its `edge`. Two more rows clear the threshold and flag SIGNAL
   (amber edge + badge); the rest resolve to small neutral edges. The
   `est` column becomes a full column of agent probabilities; three
   SIGNAL badges stand in the board. Then the fan folds back to one lane,
   the container settles ok, and the chain settles green in causal order
   (Schedule, Pull Markets, Desk).
   *Beat intent: the desk prices the whole board — most questions the
   market has about right, a few it doesn't, and those are the signals.*

8. **the-desk** (~8s) — [settle / bookend]
   The settled frame holds: every `est` filled, every `edge` resolved,
   three SIGNAL badges flagging, the chain green, the pill armed for the
   next sweep, the `mkt` odds still gently ticking. Camera eases back ~6%
   and holds the balanced frame for VO.
   *Beat intent: a desk that never sleeps — it sweeps the markets, prices
   every question, and surfaces the edges, on a schedule.*

## Continuity contract

- **One set piece**, all geometry in `layout.ts`: the `markets` SimTable
  (top), the chain Schedule → Pull Markets → Desk container (bottom), the
  research lane (and its five fan ghosts) inside the container, the
  schedule pill above the Schedule block. Scenes render one `<Stage/>`
  and differ ONLY in state props and camera. Nothing relayouts, ever.
- Fan exists only between scene 5's fan-out and scene 7's fold; at every
  boundary inside that span fan = 1 exactly.
- Per boundary (exit state == enter state, structurally verified):
  - 1→2: board assembled, selection released, CAM_BOARD both sides.
  - 2→3: chain assembled idle, CAM_ALL.
  - 3→4: same (card gone, ring released).
  - 4→5: **freeze-cut** — container live ring ON; pill advanced; board
    range released.
  - 5→6: **freeze-cut** — fan = 1, six Analysts live, followed
    `<desk.currentItem>` resolved, container live, CAM_CONT.
  - 6→7: **freeze-cut** — fan = 1, followed Analyst ok, followed row
    flipped (est + edge + SIGNAL), five ghost Analysts live, CAM_ALL.
  - 7→8: settled state — fan folded, all rows resolved, three signals,
    chain green, pill armed, CAM_ALL.
- The board's mkt odds tick continuously across every scene (a pure
  frame-derived function of absolute frame), so the "live" motion never
  stops or jumps at a cut. est/edge/SIGNAL values, once resolved, persist.
- Verification: `bun run lint`; opened stills at every scene's key beats;
  `bun scripts/verify-boundaries.ts market-desk-v1` — NOTE: the ticking
  odds make most boundaries intentionally NON-identical in the `mkt`
  cells (the board is alive by design); boundary verification is read for
  STRUCTURAL identity of everything except those ticking cells
  (documented exception).
- No sentences on screen; the only word is the product-style SIGNAL
  badge (a status, not a sentence). Narration written after visuals lock.
