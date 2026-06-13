# The Prediction-Market Desk (v1) — market-desk

Registered as `market-desk-v1` (new video, nothing overwritten). Built
batch-mode under the hype-3 mandate (prediction-market desk, HONEST
version — research/signal framing only, no real-money trading claims;
money shot = the agent-estimate column filling row by row while the
signal cells flag the mispriced markets). Phase A delivers the locked
scene list + the static set piece + two stills; motion and narration are
Phase B. Every gate below the mandate is a written assumption.

**The one idea:** a prediction-market research desk is three Sim
primitives composed — a table holds the watchlist (market + current
odds), a schedule fires every hour, Polymarket's real block pulls the
markets, and a Parallel container turns one analyst lane (an agent that
researches each market with Exa and Perplexity, then a Table block that
writes its estimate back) into five concurrent analysts. The table is
the desk: estimate, edge, and signal fill row by row, and the mispriced
markets flag themselves.

**Macro arc (swe-fleet's loved shape, new mechanism):** the board (known
object) → the desk workflow assembles (known grammar) → one reference
wires the markets to the analysts → deploy arms the clock → the hour
strikes, and the REST OF THE VIDEO is that one run at three scales: the
pull (macro), the fan (container), one analyst (lane) — then the
pull-back for the signals landing, and the at-rest bookend.

**Run count: 1.** A single scheduled traversal spans scenes 5→8 through
three freeze-cuts. Scenes 1–4 are runless; scene 9 holds the settled
state of the same run.

**Honesty line (the hype-3 constraint):** the desk never trades. The
agent writes a probability estimate; `edge` is arithmetic
(`agent_est − odds`); `signal` is a watch flag on rows where the gap is
large. Nothing on screen claims an order, a position, or a P&L.

## Grounding (product truth, re-derived 2026-06-12 from the staging
checkout `_reference/sim` @ `5fb37b4ad`)

- **Table grid** = `SimTable` (verbatim app table-grid port, native ×2;
  module-2 derivation). Columns market/odds/agent_est/edge/signal,
  5 rows — authored demo content in `demo-corpus/README.md`. Lowercase
  cell vocabulary (`watch` / `—`) follows module-2's docs-verbatim
  lowercase status style.
- **Schedule block**: registry `schedule.ts` — name Schedule, bgColor
  `#6366F1`, subBlock titles verbatim `Run frequency` (option label
  `Hourly`, line 31) and `Minute` (hourly-mode short-input, line 55;
  value `0`). NOTE the registry's lowercase `frequency` — swe-fleet's
  `Run Frequency` predates the registry-wins tiebreak and is not copied.
  Armed pill = schedules-v1 SchedulePill grammar; phrase `Every hour` =
  cronstrue for `0 * * * *` (same derivation as schedules-v1's
  "At 8:00 AM"); `Next:` format from the product's schedule-info
  caption.
- **Polymarket block**: registry `polymarket.ts` — name Polymarket,
  bgColor `#4C82FB`, glyph PolymarketIcon
  (apps/sim/components/icons.tsx:6037, verbatim path, white on the blue
  chip). Operation label verbatim `Get Markets` (`get_markets`, the
  registry's default operation). Displayed rows `Sort By | Volume`
  (registry options, line ~525) and `Limit | 5` (pagination short-input
  — the 5 grounds the five-row board). `get_markets` outputs `markets`
  (json array, registry outputs block) → the wiring reference
  `<polymarket.markets>`.
- **Parallel container**: identity from
  `subflows/parallel/parallel-config.ts` — SplitIcon, bgColor `#FEE12B`,
  dark glyph on the light chip (the product's luminance rule). Anatomy =
  the docs' preview-container-node port (loops-v1 rig → swe-fleet
  proportions). Editor labels verbatim: `Parallel Type` /
  `Parallel Each` / `Parallel Items` (subflow-editor.tsx,
  use-subflow-editor.ts). Semantics from parallel.mdx: collection
  distributed one item per instance as `<parallel.currentItem>`;
  instances isolated; result order not guaranteed — the scrambled
  finish order is the docs' own sentence, drawn. THE CANVAS SHOWS ONE
  LANE; the fan is runtime animation only (case study 17 rule 4).
- **Agent block** ("Analyst"): registry `agent.ts` — subBlock titles
  `Messages`, `Model`, `Tools`. Model `claude-sonnet-4.6` (landing
  template's authored value, swe-fleet precedent). Tool chips = the real
  Exa and Perplexity tool integrations: Exa `#1F40ED` bgColor +
  ExaAIIcon (icons.tsx:1585), Perplexity `#20808D` bgColor +
  PerplexityIcon (icons.tsx:982). Chip ring = "the tool was called"
  (module-5 grammar).
- **Table block** ("Update Board"): registry `table.ts` — name Table,
  bgColor `#10B981`, operation label verbatim `Upsert Row`
  (`upsert_row`: tableId + Row Data, no row-id subBlock — the right
  honest operation for write-or-refresh by market), `Row Data (JSON)`
  shown truncated as `{"agent_est": 0.71, …}` (module-5 truncation rule
  — the full write is simultaneously visible in the table row it lands
  in). Glyph = lucide Table (block-icons.tsx; module-2 port).
- **`edge` / `signal` provenance:** both are VALUES the lane writes
  (inside the truncated Row Data), not invented UI — the agent computes
  `agent_est − odds` and flags `watch` when |edge| ≥ 0.08 per its
  Messages instruction. No scorecard, no panel: the only surface they
  live on is the real table.
- ⟨pending⟩ (not shown on screen): real Polymarket market slugs/ids,
  real run durations, a real workspace's next-run timestamp. No
  run-record (OutputBundle) scene in v1 for exactly this reason
  (loops-v1 assumption 6's logic) — additive later with a real run
  artifact.

## Batch-mode assumptions (each reversible; swap cost noted)

1. **Composed set piece, no single product source.** No docs example
   draws table + schedule + Polymarket + parallel; the set piece
   composes the four canonical rigs (module-2 table-over-chain frame,
   schedules-v1 pill, loops-v1/swe-fleet container, module-5 run
   grammar). Composition is the video's subject. Swap cost: n/a.
2. **Lane = Analyst (Agent) → Update Board (Table) inside the
   container.** Exa/Perplexity are TOOL CHIPS on the agent (the mandate
   says so), not separate blocks — research is the agent's act; the
   write is the only drawn side effect. Swap cost: medium (lane
   geometry).
3. **Board pre-seeded with market + odds; the run writes agent_est /
   edge / signal.** The watchlist exists before the run (the desk's
   standing object, like swe-fleet's backlog); Upsert refreshes by
   market key. Odds cells stay static during the run (current odds is
   what get_markets confirms; animating a second numeric column would
   double the noise for zero story). Swap cost: low (data + flip
   columns).
4. **Container named `Desk`.** User-named blocks are product-legal;
   nothing references `<desk.results>`; inner references are
   `<parallel.*>` by definition. Swap cost: trivial.
5. **5 markets / 5 runtime instances.** Module-2/swe-fleet's five-row
   precedent; countable lanes; `Limit | 5` on the Polymarket block makes
   the count a configured fact. Swap cost: low (constants).
6. **Signal vocabulary `watch` / `—`.** A research flag, not a trade
   instruction (the honesty line). Threshold |edge| ≥ 0.08 stated in
   demo-corpus and carried by the agent's instruction, not on screen.
   Swap cost: trivial.
7. **Ghost lanes compact** (header-only Analyst→Update pairs) when the
   runtime fan is open — state rings carry their progress, the TABLE
   carries their results (swe-fleet assumption 3; same reversibility
   flag).
8. **Plain `#1b1b1b` ground, no canvas dots** — module-2 v2's precedent
   for table-over-chain stages (CanvasDots stays mounted; default-off
   per SKILL.md).

## Motion language (Phase B contract)

Values live in rows and cells (`ResolvedTag` in the Analyst's Messages;
cell text dips in table cells); wires carry light only (`WirePulse`
outer, loops' `PathPulse` on curved inner fan wires); state via product
language (blue live ring, green ok ring, 0.35 dim, chip ring for tool
calls). Fills land as cell dips with the green output tint
(`rgba(51,196,130)`) pulsing to a 0.35 residue; the accumulating residue
across agent_est/edge/signal IS the desk lighting up. The two `watch`
rows keep a full-strength signal-cell residue — the flag reads as color,
not as a word you must parse. No sentences on screen, no state words
outside table cell VALUES.

## Locked scene list (~81s visual minimum)

1. **the-board** (~8s) — [assemble]
   Table-centered camera. The `markets` grid assembles: header row
   (market/odds/agent_est/edge/signal with type icons), five rows
   stagger in — market + odds filled, agent_est/edge/signal empty.
   Row 1 takes a brief product range selection and releases.
   *Beat intent: the watchlist is a Sim table — five live markets, the
   crowd's current odds, and three empty columns waiting for the desk.*

2. **the-desk-takes-shape** (~12s) — [assemble + camera ease]
   Camera eases out; the table glides to the top (camera move only).
   Below, the workflow assembles in flow order: Schedule (Run frequency
   Hourly / Minute 0) → edge → Polymarket (Get Markets / Sort By Volume
   / Limit 5) → edge → the Desk container (yellow Split chip, inner
   Start pill) — and inside it, ONE lane: inner wire → Analyst
   (Messages `<parallel.currentItem>` / Model claude-sonnet-4.6 /
   Tools: Exa, Perplexity) → Update Board (Upsert Row /
   `{"agent_est": 0.71, …}`).
   *Beat intent: the desk is one workflow — a clock, a market pull, and
   a container holding a single analyst lane: research, estimate, write
   it back.*

3. **wired-by-reference** (~7s) — [zoom-aside]
   Container takes the blue editing ring; world dims 0.35. Editor card:
   header (Split chip + Desk), `Parallel Type | Parallel Each`,
   `Parallel Items | <polymarket.markets>` — the tag glows. Card leaves,
   ring releases, world undims.
   *Beat intent: one reference wires the market pull to the desk —
   whatever markets come back, the parallel prices each one.*

4. **armed** (~5s) — [morph at state level]
   Blue ring lands on Schedule; the pill rises: green dot +
   `Every hour · Next: Jun 12, 3:00 PM`. Ring releases; pill stays.
   *Beat intent: deploy once and the desk re-prices the board every
   hour, attended or not.*

5. **the-pull** (~9s) — [run, freeze]
   The Schedule ring lights ON ITS OWN; the pill's Next dips forward
   (3:00 PM → 4:00 PM — fired and re-armed). Pulse crosses edge 1;
   Polymarket goes live and IN SYNC the five market+odds rows light as
   one product selection range (the pull confirming the board;
   synchrony only). Range releases as the pulse crosses edge 2; the
   container's live ring comes on — HOLDS through the cut.
   *Beat intent: on the hour the clock fires, the real Polymarket block
   pulls the five markets, and the whole batch heads into the desk.*

6. **the-fan** (~8s) — [freeze-cut continuation + runtime fan]
   Opens inside the held moment. Camera eases onto the container. The
   single lane fans five wide AT RUNTIME: four compact instances
   separate out above/below the followed lane. The Start pill blips
   once; five pulses leave together; five Analysts go live at the same
   moment; in the followed lane `<parallel.currentItem>` resolves to
   `[GPT-6 ships in 2026]`.  HOLDS through the cut.
   *Beat intent: the parallel splits the batch — one analyst per
   market, isolated, all starting at once.*

7. **one-analyst** (~12s) — [camera lean-in, same run]
   Camera onto the followed lane. The Analyst works: the Exa chip rings
   (search), then the Perplexity chip rings (cross-check), agent
   settles ok. Pulse → Update Board goes live; camera eases back out in
   time to see the lane's row close its loop: row 4's agent_est dips in
   `0.71`, edge fills `0.16`, signal flags `watch` — green tint pulse
   decaying to residue (signal cell keeps it strong). Lane settles ok;
   tag resolution reverts. Other four instances still live. HOLDS.
   *Beat intent: one analyst end to end — research with real tools, an
   estimate, the arithmetic edge, and a flag the desk can read. The row
   filling IS the analyst finishing.*

8. **the-signals** (~10s) — [the money shot]
   Full frame, steady camera. The remaining instances finish in
   scramble order — row 2, row 5, row 1, row 3 — each finish a triplet:
   lane settles ok, agent_est + edge fill, signal lands (`watch` on the
   mispriced Fed row with a strong residue; `—` on the fair rows). The
   est column becomes a filled board with two flags burning. Then the
   fan folds back to ONE lane, the container settles ok, and the chain
   settles green in causal order — Schedule, Polymarket, Desk.
   *Beat intent: the desk lands its estimates row after row — order
   not guaranteed, every instance independent — and the mispriced
   markets flag themselves.*

9. **the-desk-at-rest** (~10s) — [settle / bookend]
   The settled frame holds: every row priced, two watch flags, the
   chain green, the pill armed for the next hour. Camera eases back
   ~6% and holds for VO.
   *Beat intent: an hour from now it does this again — the board is a
   living research surface, not a bet slip.*

## Continuity contract

- **One set piece**, all geometry in `layout.ts`: the `markets`
  SimTable (top), the chain Schedule → Polymarket → Desk container
  (bottom), ONE lane (+ four runtime ghosts) inside, the pill above
  Schedule. Scenes render one `<Stage/>` (scenes/_rig.tsx) and differ
  ONLY in state props and camera. Nothing relayouts, ever.
- Fan exists only between scene 6's fan-out and scene 8's fold; at
  every boundary inside that span fan = 1 exactly. Outside it the
  canvas shows exactly ONE inner lane.
- Per boundary (exit == enter, pixel-verified in Phase B):
  - 1→2: table assembled, selection released, CAM_TABLE.
  - 2→3: chain assembled idle, CAM_ALL.
  - 3→4: same (card gone, ring released).
  - 4→5: armed — pill `Next: Jun 12, 3:00 PM`, CAM_ALL.
  - 5→6: freeze-cut — container live ring ON; pill reads 4:00 PM;
    range released; CAM_ALL.
  - 6→7: freeze-cut — fan = 1, five instances live, followed tag
    resolved, container live, CAM_CONT.
  - 7→8: freeze-cut — fan = 1, followed lane ok, row 4 filled
    (0.71 / 0.16 / watch + residue), tag reverted, four ghosts live,
    container live, CAM_ALL.
  - 8→9: settled — fan folded to one lane, all rows filled with
    residue, chain green (Schedule/Polymarket/Desk ok), pill armed,
    CAM_ALL.
- Cell residues and filled values persist to the final frame. All
  selections, editing rings, and resolutions revert before their scene
  ends except the named freeze-cut carries.
- Verification: `bun run lint`; opened stills at every key beat;
  `bun scripts/verify-boundaries.ts market-desk-v1` (structural zero).
- No sentences on screen; narration carries the words (Phase B, after
  visuals lock, per the narration skill).

## Phase A status

Scenes shipped in this phase: two STATIC set-piece holds registered as
the composition's scenes —
`money-shot-still` (scene-8 mid-state: fan = 1, three rows filled, the
Fed row landing with a full tint pulse, two instances still live) and
`final-still` (scene-9 settled state). Phase B replaces them with the
nine motion scenes above; the Stage props in `scenes/_rig.tsx` already
express every state both phases need.

## Phase B status

The nine motion scenes shipped (stills removed, recoverable at
ab28aca); choreography ported beat-for-beat from swe-fleet (d82378b),
the same-shaped exemplar, onto this rig's props. Narration in
`narration-v1.md` (gold register, draft for the director to massage),
vo-synced with the canon voice → 120.4s total. Lint clean; vocab lint
clean (DeskContainer + DeskConfigCard annotated as sanctioned ports);
all 8 boundary pairs pixel-IDENTICAL after the sync (extend-only holds).
