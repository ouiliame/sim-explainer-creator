# market-desk — choreography notes

verdict: hype-3 ranking **#1 — BEST**. The director's distilled
criterion ("visually diverse, dynamic, clean, and some visual harmony")
names this build: it has the most concurrent DIFFERENT surfaces alive
(board + chain + container fan + signal flags), and the beat shapes vary
across the run's three scales (pull / fan / lane / scramble) instead of
repeating one shape.
branch: `hype3/market-desk` · comp: `market-desk-v1`
duration: 120.4s after vo-sync (authored visual minimum 81s)
run economy: **1 run** — a single scheduled traversal spanning scenes
5→8 through three freeze-cuts. Scenes 1–4 runless (board, assembly,
wiring, arming); scene 9 holds the settled run. Choreography ported
beat-for-beat from swe-fleet (the same-shaped exemplar) onto this rig.
source: `src/videos/market-desk/` — `<Stage/>` in `scenes/_rig.tsx`,
geometry in `layout.ts`, all content in `data.ts`.

## The one idea

A prediction-market research desk is three Sim primitives composed: a
table holds the watchlist (market + odds pre-seeded; agent_est / edge /
signal EMPTY), a Schedule fires hourly, Polymarket pulls the markets,
and a Parallel container turns one analyst lane (Agent with Exa +
Perplexity tool chips → Table `Upsert Row`) into five concurrent
analysts. The table IS the desk: estimates fill row by row and the
mispriced markets flag themselves (`watch` residue). Honesty line: no
trade, no P&L — `edge` is arithmetic, `signal` is a watch flag.
Cameras: CAM_TABLE (s 1.1) → CAM_ALL (s 0.78) → CAM_CONT (s 1.05) →
CAM_LANE (s 1.3) → CAM_OUT (s 0.735).

## Scene 1: the-board (0–14s, authored 8s)

INTENT: the watchlist is a real Sim table — five live markets, the
crowd's odds, three empty columns waiting.
CAMERA: static CAM_TABLE, table hero-framed.
CHOREOGRAPHY:
- Chrome + headers fade `ramp(t, 0.2, 0.9)`.
- Five rows stagger in at **0.35s**: `rowTextReveal(r) = ramp(1.1 +
  r*0.35, 1.7 + r*0.35)` — market + odds text only (est/edge/signal are
  empty strings until `fillMix ≥ 0.5`, which never happens here).
- Row 1 takes the product range selection: `pulseWindow(4.6, 5.0, 6.2,
  6.6)` on every cell of row 0 — "each row is one market," shown.
HOLDS: 6.6 → 14 (~7.4s) on the assembled board. Pattern: latched-settle
(this build, like outbound, has zero periodic motion — extend-only VO
retiming is boundary-safe by construction). Dead-ish but the frame is
the thesis object.

## Scene 2: the-desk-takes-shape (14–30.2s, authored 12s)

INTENT: the desk is one workflow — a clock, a market pull, and a
container holding a single analyst lane.
CAMERA: `camMix(CAM_TABLE, CAM_ALL, ramp(0.3, 2.4, inOut))` — the table
glides to the top of frame as a camera move only.
CHOREOGRAPHY (assembly in flow order, slower cadence than outbound —
each element gets a beat the narration can name):
- Schedule `ramp(2.0, 2.6, out)` → edge1 `ramp(3.0, 3.6)` → Polymarket
  `ramp(4.0, 4.6, out)` → edge2 `ramp(5.2, 5.8)` → Desk container
  `ramp(6.2, 7.0, out)` → inner pill wire `ramp(7.8, 8.4)` → Analyst
  `ramp(8.4, 9.0, out)` → lane edge `ramp(9.8, 10.3)` → Update Board
  `ramp(10.3, 10.9, out)`. ~1–1.4s gaps between elements (vs outbound's
  0.6–0.8) — the assembly nearly fills the narrated window, which is
  why this scene doesn't die in its hold.
HOLDS: 10.9 → 16.2 (~5.3s) on the idle desk. Latched-settle.

## Scene 3: wired-by-reference (30.2–40.8s, authored 7s)

INTENT: one reference (`Parallel Items | <polymarket.markets>`) wires
the pull to the desk.
CAMERA: static CAM_ALL; hierarchy via dim.
CHOREOGRAPHY (zoom-aside):
- Selective dim — table, Schedule, Polymarket, outer edges all dim to
  0.35 on ONE window `dimW = pulseWindow(0.4, 0.9, 5.8, 6.3)`; the
  container + lane stay lit (the focal object is exempt, not
  re-highlighted). Editing ring boolean `t ∈ [0.5, 6.0)`.
- Card: `cardIn = pulseWindow(0.8, 1.4, 5.2, 5.8)`, slide
  `1 − ramp(0.8, 1.4)` (80px from the right); `<polymarket.markets>`
  glow `pulseWindow(2.2, 2.8, 4.4, 5.0)`. Everything reverts by 6.3.
HOLDS: 6.3 → 10.6 (~4.3s). Latched-settle; short.

## Scene 4: armed (40.8–47s, authored 5s)

INTENT: deploy once and the desk runs every hour, attended or not.
CAMERA: static CAM_ALL.
CHOREOGRAPHY (morph at state level — the shortest scene, one gesture):
- Blue editing ring on Schedule, window `t ∈ [0.6, 2.6)` (deploying is
  an act you perform ON the workflow).
- The pill rises above the block: `pillReveal = ramp(1.5, 2.1, out)`
  (opacity + 14px rise): green dot + `Every hour · Next: Jun 12,
  3:00 PM`. Ring releases at 2.6; the pill STAYS — the armed state is
  the scene's residue and persists to the final frame.
HOLDS: 2.6 → 6.2 (~3.6s). Latched-settle; at the cap, fine.

## Scene 5: the-pull (47–58.3s, authored 9s)

INTENT: on the hour the clock fires ON ITS OWN, the real block pulls
the five markets, and the whole batch heads into the desk.
CAMERA: static CAM_ALL.
CHOREOGRAPHY:
- The self-fire: Schedule ring window `[1.0, 2.5)` with NO incoming
  pulse — nothing arrives from anywhere; that's the point. In sync the
  pill's Next DIP-SWAPS 3:00 PM → 4:00 PM (`pillSwap = ramp(1.3, 1.8)`
  through `DipSwap`) — fired and instantly re-armed, two surfaces one
  event.
- `pulse1 = ramp(2.2, 2.9, inOut)`, edge1 heat `pulseWindow(2.2, 2.6,
  4.0, 4.5)`; Polymarket live `[2.8, 5.5)` then ok `[5.5, 7.2)`.
- The pull confirms the board — chain-to-table sync: a product
  selection range sweeps the five market+odds rows (ONLY the pre-seeded
  columns: `c <= ODDS_COL`) with a **0.14s** row stagger,
  `rangeHi(r) = min(ramp(3.1 + r*0.14, 3.6 + r*0.14), 1 − ramp(5.5,
  6.1))` — lit while Polymarket is live, released as one.
- The range releases AS `pulse2 = ramp(5.6, 6.3, inOut)` crosses into
  the container (edge2 heat `pulseWindow(5.6, 6.0, 7.3, 7.8)`);
  container live ring latches `t >= 6.2` and HOLDS through the cut
  (freeze-cut carry).
HOLDS: 7.8 → 11.3 (~3.5s) inside the held live moment (container ring
ON, pill at 4:00 PM). Latched-settle; charged, short.

## Scene 6: the-fan (58.3–72.7s, authored 8s)

INTENT: the parallel splits the batch — one analyst per market, all
starting at once.
CAMERA: `camMix(CAM_ALL, CAM_CONT, ramp(0.4, 1.7, inOut))` — lean onto
the container BEFORE the fan opens (move first, then the event).
CHOREOGRAPHY:
- The runtime fan: `fan = ramp(2.2, 3.6, inOut)` — four header-only
  ghost pairs (Analyst → Update Board) separate symmetrically from
  behind the followed lane; pill wires fan with them
  (`pillEdge(lane, fan)`).
- Pill blips once `pulseWindow(4.2, 4.45, 4.75, 5.05)`; five pulses
  leave TOGETHER — every lane gets the same `pulseIn = ramp(4.4, 5.2,
  inOut)`; all five Analysts go live at the same frame (`t >= 5.1`,
  latched). One clock for all five — the synchrony IS the scene.
- The followed lane's `<parallel.currentItem>` resolves to
  `[GPT-6 ships in 2026]`: glow `pulseWindow(5.8, 6.1, 6.8, 7.1)`,
  resolve `ramp(6.3, 6.7)` — and unlike outbound, the glow FULLY
  releases before the cut; only the resolved value carries.
HOLDS: 7.1 → 14.4 (~7.3s) at CAM_CONT — fan open, five blue rings,
container ring, resolved tag. Latched-settle; static but state-dense.

## Scene 7: one-analyst (72.7–91.7s, authored 12s)

INTENT: one analyst end-to-end — real tools, an estimate, the
arithmetic edge, and a flag. The row filling IS the analyst finishing.
CAMERA: a THREE-stop move, the build's best camera idea:
`CAM_CONT → CAM_LANE` over `ramp(0.5, 1.8, inOut)` (the tool calls play
at lane framing, s 1.3), then `CAM_LANE → CAM_ALL` over `ramp(8.4, 9.8,
inOut)` — the ease-back is timed so the FULL frame arrives just before
the row fill lands at 10.0. The camera leaves the detail to go watch
the consequence.
CHOREOGRAPHY:
- Tool calls as chip rings on the Analyst (module-5 grammar): Exa ring
  `pulseWindow(2.4, 2.7, 3.5, 3.8)` (search), then Perplexity ring
  `pulseWindow(4.4, 4.7, 5.5, 5.8)` (cross-check) — two distinct
  branded beats, ~2s apart, instead of one generic "working" glow.
- Analyst flips live→ok at 6.4; `pulseA = ramp(6.6, 7.2, inOut)` with
  edge heat `pulseWindow(6.6, 7.0, 8.2, 8.7)`; Update Board live
  `[7.1, 9.9)` then ok.
- The loop closes ON THE BOARD (after the camera is out): row 4
  (`FOLLOWED_ROW = 3`) fills `ramp(10.0, 10.6)` — agent_est `0.71`,
  edge `0.16`, signal `watch` dip in (text at mix ≥ 0.5 with the
  `|mix−0.5|·4` dip); green tint pulses full then decays to the 0.35
  residue (`tint = fill · (1 − 0.65·ramp(11.2, 11.8))`); the SIGNAL
  cell keeps a full-strength residue (`signalTint = ramp(10.2, 10.8)`,
  never decayed) — the flag reads as color, not a word.
- The reference reverts AS the lane finishes: `tagResolve = 1 −
  ramp(10.6, 11.1)` — resolution is transient, residue is permanent.
- The four ghost Analysts hold `highlighted` the whole scene (still
  working — context for the scramble).
HOLDS: 11.8 → 19 (~7.2s) on the full frame: one row priced + flagged,
four lanes still live. Latched-settle; the open question ("four still
running") keeps it readable.

## Scene 8: the-signals (91.7–106.7s, authored 10s) — THE MONEY SHOT

INTENT: estimates land row after row in whatever order the analysts
finish; the mispriced markets flag themselves.
CAMERA: static CAM_ALL — full frame, steady; the table and the fan
resolve together.
CHOREOGRAPHY:
- Scramble finish: `GHOST_FINISH_ORDER = [1, 4, 0, 2]` (table rows —
  i.e. rows 2, 5, 1, 3 on screen, NOT top-to-bottom), lane starts
  `FINISH_AT[row] = 0.6 + i*1.4`. `ROW_FOR_LANE = [1, 0, 3, 4, 2]`
  maps spatial lanes to rows, so the SPATIAL finish order (lanes 0, 3,
  1, 4) scrambles too.
- Each finish is a triplet keyed to its `f`: Analyst flips ok at `f`;
  `pulseA = ramp(f, f+0.35, inOut)` with edge heat `pulseWindow(f,
  f+0.2, f+0.6, f+0.9)`; Update Board blips live `[f+0.45, f+0.6)` then
  ok — and the lane's ROW fills `ramp(f+0.7, f+1.2)`, tint pulsing then
  decaying `· (1 − 0.65·ramp(f+1.7, f+2.7))` to the 0.35 residue. Lane
  event → row event 0.7s later: cause then effect, four times,
  overlapping at 1.4s spacing.
- The second flag: row 0 (Fed) gets the full-strength signal residue
  `ramp(FINISH_AT[0]+0.7, FINISH_AT[0]+1.3)` (lands ~4.1–4.7) — two
  `watch` cells now burn while the `—` rows stay quiet.
- The settle, in causal order: fan folds `1 − ramp(7.6, 8.6, inOut)`;
  inner lane ok-rings release at 9.4 as the container absorbs them;
  chain settles green Schedule 8.9 → Polymarket 9.15 → Desk 9.4
  (**0.25s** spacing, latched).
HOLDS: 9.4 → 15 (~5.6s) on the settled chain + fully-priced board with
two flags burning. Post-payoff breath; latched-settle.

## Scene 9: the-desk-at-rest (106.7–120.4s, authored 10s)

INTENT: an hour from now it does this again — the board is a living
research surface, not a bet slip.
CAMERA: `camMix(CAM_ALL, CAM_OUT, ramp(0.8, 2.4, inOut))` (~6%
ease-back).
CHOREOGRAPHY: none after the camera — all finals latched: `fillMix=1`,
`fillTint=0.35` everywhere, `signalTint=1` on rows 0 and 3, chain ok,
pill still armed at 4:00 PM.
HOLDS: 2.4 → 13.7 (~11.3s), fully still. The settled-desk payoff
carries it further than a dead hold should, but this is the same
weakness as outbound's bookend — the #1 ranking was earned by the
DIVERSITY of the middle, not by this hold.

## The moves used

- **table-over-chain set piece at three scales** — the same run seen
  macro (pull), container (fan), lane (one analyst), then full-frame
  (scramble): beat shapes VARY across the run; this is what the
  director's "visually diverse + dynamic" verdict rewarded.
- **the self-fire + pill dip-swap** (s5): a ring with no incoming pulse
  + `Next:` DipSwapping 3:00→4:00 PM — "scheduled" shown in two
  synchronized surfaces.
- **chain-to-table range sync** (s5): Polymarket live ↔ the five
  market+odds rows sweeping lit at 0.14s stagger, released as one when
  the pulse moves on. Only the columns the block actually returns.
- **runtime fan + one-clock simultaneity** (s6): `fan = ramp(2.2, 3.6,
  inOut)`, shared `pulseIn`, all five live the same frame.
- **branded tool-chip rings** (s7): Exa then Perplexity pulseWindows ~2s
  apart — tool calls as two distinct beats.
- **camera leaves the detail to watch the consequence** (s7's
  three-stop move; the row fill waits for the eased-out frame at 10.0).
- **scramble finish with cause→effect offset** (s8: shuffled
  `FINISH_AT` at 1.4s spacing; each lane's row fills 0.7s after its
  lane settles).
- **residue hierarchy** (s7/s8/s9): green tint pulses decay to a 0.35
  provenance residue on est/edge/signal, but the `watch` cells keep
  1.0 — permanent color = the signal, decayed color = the history.
- **causal-order green settle** (s8: Schedule → Polymarket → Desk at
  0.25s) and the **~6% ease-back bookend** (s9).
- **latched-settle holds** throughout (no oscillators; extend-safe by
  construction). The two long dead holds (s1 ~7.4s, s9 ~11.3s) are the
  remaining gap to close with an ambient pattern — everything else
  earns its rest.
