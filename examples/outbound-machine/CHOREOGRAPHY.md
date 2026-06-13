# outbound-machine — choreography notes

verdict: hype-3 ranking **#4** ("outbound") — clean and gate-perfect, but
fewer concurrent surface types than market-desk/on-call, and several
VO-extended holds run long with zero ambient motion (taste rule 5/6).
branch: `hype3/outbound-machine` · comp: `outbound-machine-v1`
duration: 146.6s after vo-sync (authored visual minimum 80s — every scene
was extended, some heavily; see HOLDS notes)
run economy: **1 run**, spanning scenes 4→7 through freeze-cuts. Scenes
1–3 runless (assemble + wiring aside), scene 8 holds the settled run.
source: `src/videos/outbound-machine/` (scenes/_rig.tsx `<Stage/>`,
geometry 100% in layout.ts; per-scene timings below are local seconds
from each scene's `ramp(t, t0, t1)` windows).

## The one idea

An outbound machine is one workflow that fills a table: find companies
once, enrich + personalize every one of them in parallel, send — and the
run's LAST block (`Table · Batch Insert Rows · <parallel.results>`)
writes the record back. The table opens empty and ends a sent campaign.

The set piece: the `outbound` SimTable (6 cols × 6-row empty pane, top
band) over the chain Apollo → Enrich (Parallel container, ONE lane: Data
Enrichment → Personalize → Instantly, ×6 at runtime fan) → Table block.
Cameras: CAM_TABLE (s 0.86) → CAM_ALL (s 0.62) → CAM_LANE (s 1.04) →
CAM_OUT (s 0.59).

## Scene 1: the-empty-table (0–12.8s, authored 8s)

INTENT: the job is a campaign that doesn't exist yet — a real Sim table
with six named columns and an EMPTY pane.
CAMERA: static CAM_TABLE, table hero-framed. No move — the table IS the
frame.
CHOREOGRAPHY:
- Pane chrome fades in: `ramp(t, 0.3, 1.0, EASING.out)` on `tableIn`.
- Header assembles left→right, per-column stagger of **0.22s**:
  `colIn(c) = ramp(t, 1.1 + c*0.22, 1.65 + c*0.22, EASING.out)` — six
  columns land 1.1 → 2.75.
- The "blank record is the job" beat: a collective selection pulse over
  the whole empty pane (product range treatment — 2px `--selection`
  border + rgba(37,99,235,0.06) tint), up `4.0→4.7` (EASING.out),
  released `6.2→7.0` (EASING.in). `rowLand = 0` everywhere — un-landed
  rows are invisible pane, so the pulse is an overlay, not cell
  highlights.
HOLDS: 7.0 → 12.8 (~5.8s) on the assembled empty table. Pattern:
latched-settle (end-anchored equivalent — nothing periodic anywhere in
this build, so extend-only VO retiming is boundary-safe by construction).
No ambient motion → the tail of this hold is DEAD; tolerable only because
the frame is the thesis (the empty board).

## Scene 2: the-machine (12.8–37.3s, authored 13s)

INTENT: the machine is ONE ordinary workflow under the table.
CAMERA: CAM_TABLE → CAM_ALL over `ramp(t, 0.2, 2.4, EASING.inOut)` via
`camMix` — the table "glides to the top band" purely as a camera move
(nothing relayouts).
CHOREOGRAPHY (assembly in flow order, AFTER the camera mostly settles):
- Apollo fades in `2.6→3.2` (EASING.out) → edge 1 draws `3.3→4.0`
  (EASING.inOut — edges are transforms, not entrances) → container
  `4.1→4.8` → the ONE inner lane (all three blocks fade together)
  `5.1→5.8` → all three inner edges draw together `5.9→6.7` → edge 2
  `7.0→7.7` → the Table block `7.7→8.4`.
- Cadence: block (out) / edge (inOut) alternation, ~0.6–0.8s steps —
  reads as drawing the canvas, not a slideshow, because edges DRAW
  between fades.
HOLDS: 8.4 → 24.5 local (~16s!) on the idle assembled machine while the
narration walks the blocks. Pattern: latched-settle. This is the build's
weakest hold — completely static for 16s; the narration names blocks the
picture finished revealing 10+ seconds earlier (violates taste rule 4
"beats land as narration names them" — the fix would be re-pacing the
assembly to span the narrated window).

## Scene 3: wired-by-reference (37.3–48.8s, authored 8s)

INTENT: ONE reference (`Parallel Items | <apollo.organizations>`) wires
the queue to the fan.
CAMERA: static CAM_ALL; focus change is done by dimming, not zooming.
CHOREOGRAPHY (zoom-aside grammar):
- World dims to 0.35: `dim = min(ramp(0.3,1.0,inOut), 1-ramp(6.6,7.4,
  inOut))`; the container's brand-blue editing ring is a boolean window
  `t ∈ [0.3, 7.4]` — ring and dim move as one event.
- Editor card slide-in: opacity `min(ramp(0.8,1.5,out), 1-ramp(6.7,7.3,
  in))`, with an 80px horizontal slide driven by the SAME windows
  (`slide = 1 - in + out`) — enter from the right, leave to the right.
- The beat: `<apollo.organizations>` tag glow inside the card,
  `min(ramp(2.2,2.9,out), 1-ramp(5.6,6.3,in))` — glows mid-hold, releases
  before the card leaves. Everything reverts before the cut (boundary =
  scene 2's exit).
HOLDS: 7.4 → 11.5 (~4.1s) on the undimmed idle chain. Latched-settle;
dead but short.

## Scene 4: the-fan (48.8–66.4s, authored 10s)

INTENT: the run starts and the parallel makes one lane into six —
simultaneity is the content.
CAMERA: static CAM_ALL. The fan is the motion; the camera stays out so
you see table + chain + fan at once.
CHOREOGRAPHY:
- Apollo ring window `t ∈ [0.4, 2.6)`, then latches `state: "ok"` at
  2.6 — live ring hands off to green exactly as the pulse leaves.
- `pulse1` crosses edge 1 `ramp(1.2, 2.4, EASING.inOut)`; the edge heats
  (`hi: ramp(1.4, 2.0)`) UNDER the traveling pulse and STAYS hot (the
  active path cools only in scene 6).
- Two-surface sync: container live ring latches at `t >= 2.4` — the
  frame the pulse arrives.
- THE FAN: `fan = ramp(3.0, 4.6, EASING.inOut)` — four header-only ghost
  lanes deal out symmetrically from behind the followed lane
  (`laneTop(lane, fan)` lerps ghost tops from the stacked anchor to ±
  targets; the curved pill wires fan WITH them since `pillEdge(lane,fan)`
  reads the same fan value).
- Pill blips ONCE: `pulseWindow(4.8, 5.0, 5.3, 5.6)` (inset blue ring on
  the inner Start pill).
- Six pulses leave TOGETHER: every lane gets the same
  `pulseIn = ramp(5.0, 5.9, inOut)` + `edgeIn.hi = ramp(5.0, 5.6)` — one
  clock for all six, deliberately NOT staggered (the docs' "all start at
  once", drawn).
- All six Data Enrichment blocks go live at the same frame (`t >= 5.8`,
  latched).
- The followed lane's `<parallel.currentItem>` resolves to `[Northwind]`:
  resolve `ramp(6.2, 7.2, inOut)`; glow `min(ramp(5.9,6.3),
  1 - 0.6*ramp(7.6,8.4))` — note the glow decays to **0.4, not 0**: a
  deliberate freeze-cut carry that scene 5 finishes
  (`itemGlow = 0.4 * (1 - ramp(0.6, 1.4))`).
HOLDS: 8.4 → 17.6 (~9.2s) inside the held live moment (blue rings ON,
hot edges, fan=1, tag resolved). Latched-settle. Static but reads
charged because every surface is in a "live" state; still past the ~3s
dead cap.

## Scene 5: one-lane-one-lead (66.4–89.2s, authored 12s)

INTENT: the mechanistic example — ONE lead worked end-to-end; the table
above stays untouched (nothing writes until the writer runs).
CAMERA: lean-in then return: `camMix(camMix(CAM_ALL, CAM_LANE,
ramp(0.2,1.8,inOut)), CAM_ALL, ramp(9.8,11.4,inOut))` — push onto the
followed lane, work plays at lane framing, ease back BEFORE the cut so
exit = CAM_ALL exactly (freeze-cut contract).
CHOREOGRAPHY (a three-beat relay along the lane):
- Carried glow finishes decaying: `0.4 * (1 - ramp(0.6, 1.4))`.
- Beat 1 — Data Enrichment: provider chip ring (the cascade calling out)
  `pulseWindow(2.0, 2.4, 3.4, 3.9)`; block flips highlighted→ok at 4.1;
  its in-edge cools `1 - ramp(4.1, 4.8)` (heat follows the work).
- Beat 2 — Personalize: `pulseA = ramp(4.5, 5.3, inOut)` with edge heat
  `pulseWindow(4.5, 4.8, 5.3, 5.8)`; live window `[5.2, 7.6)` then ok;
  `<enrich.contact>` glow `min(ramp(5.5,5.9), 1-ramp(7.4,8.2))` and
  resolve to `[Priya Nair]` `ramp(6.0, 6.9, inOut)` — the tag resolves
  WHILE the block is live (value resolves in place, never rides a wire).
- Beat 3 — Instantly: `pulseB = ramp(7.9, 8.7, inOut)`, heat
  `pulseWindow(7.9, 8.2, 8.7, 9.2)`, live `[8.6, 10.3)`, ok latches
  10.3 — timed so the green lands just as the camera ease-back starts.
- Ghost lanes hold `enr.highlighted + edgeIn.hi=1` the whole scene (the
  other five are still working — context, dimmed by distance not
  opacity).
HOLDS: 11.4 → 22.8 (~11.4s) on the eased-back full frame, followed lane
green, ghosts live. Latched-settle; long.

## Scene 6: the-scramble-finish (89.2–104.9s, authored 9s)

INTENT: result order isn't guaranteed (parallel.mdx) — drawn, not said.
CAMERA: static CAM_ALL.
CHOREOGRAPHY:
- Scramble order: ghosts finish lane **3, 0, 4, 1** (not top-to-bottom)
  at starts `f = 0.4, 1.75, 3.1, 4.45` — uniform 1.35s spacing but
  SHUFFLED spatial order, which is what reads as a real system.
- Each ghost runs the same compressed triplet relative to its `f`:
  enr flips ok at `f`; pers live `[f+0.45, f+0.95)` → ok; send live
  `[f+1.45, f+1.95)` → ok; `pulseA = ramp(f+0.45, f+1.0, inOut)`,
  `pulseB = ramp(f+1.45, f+2.0)`; edge heats are pulseWindows shadowing
  each hop. Four lanes' triplets OVERLAP (lane 0 starts before lane 3
  finishes) — concurrent, de-phased work.
- The fold: `fan = 1 - ramp(6.7, 8.0, EASING.inOut)` after the last
  triplet lands; container flips highlighted→ok at 8.3; edge 1 finally
  cools `1 - ramp(7.5, 8.3)` (the active path's heat lived from scene 4
  until the parallel settled — heat = "this path is running").
HOLDS: 8.3 → 15.7 (~7.4s), chain settled except the idle Table block —
a loaded pause before the money shot. Latched-settle.

## Scene 7: the-write-back (104.9–128.5s, authored 13s) — THE MONEY SHOT

INTENT: the run writes its own record — six rows batch-insert into the
table, each a left→right cell sweep ending in `sent`.
CAMERA: static CAM_ALL — table and writer block share the frame; the
sync between them IS the shot.
CHOREOGRAPHY:
- Trigger: `pulse2 = ramp(0.5, 1.5, inOut)` exits the container; edge 2
  heats `ramp(0.7,1.3) * (1 - ramp(11.0,11.6))`; Table block live at
  1.4; its `<parallel.results>` Rows tag glows
  `0.9 * min(ramp(1.5,2.1), 1-ramp(10.6,11.4))` — the tag burns for the
  WHOLE write (the reference is what's being consumed).
- Row cascade: row r lands at `rowAt(r) = 2.0 + r*1.25` (six rows,
  top-to-bottom in RESULT order `LANDED_ORDER = [2,4,0,5,1,3]` — the
  scramble order from scene 6 becomes the insert order; Northwind, the
  followed lead, lands first).
- Within a row: chrome fades `ramp(rowAt, rowAt+0.4, out)`, then cells
  sweep left→right one per **0.16s**: `cellAt(c,r) = rowAt(r) + 0.15 +
  c*0.16`, fill `ramp(cellAt, cellAt+0.35, out)`, text appears at
  fill ≥ 0.5 (dip-in).
- Residue trail: per-cell green tint peaks at **0.7** as the cell fills
  (`up * (PEAK - (PEAK - residue)*down)`, down = `ramp(rowAt+1.6,
  rowAt+2.8)`), decaying to **0** everywhere EXCEPT the status column's
  **0.12** — the "sent wall": the only permanent color is the run's
  provenance.
- Settle: Table block flips ok at 11.6, after the last cell (fill ends
  ~9.55: `cellAt(5,5) = 8.25 + 0.15 + 5·0.16 = 9.2`) has landed and the
  last tint has decayed (row 5's down-ramp ends `rowAt(5)+2.8 = 11.05`).
HOLDS: 11.6 → 23.6 (~12s) on the full table + green chain. Earned (the
payoff frame) but static; latched-settle.

## Scene 8: the-sent-campaign (128.5–146.6s, authored 7s)

INTENT: bookend — scene 1's empty pane is now a sent campaign.
CAMERA: `camMix(CAM_ALL, CAM_OUT, ramp(0.8, 2.4, inOut))` — a ~5%
ease-back (0.62 → 0.59), the series' settle gesture.
CHOREOGRAPHY: none after the camera. State is all latched finals:
`rowLand = 1`, status-column tint 0.12, every block `state: "ok"`,
tags resolved.
HOLDS: 2.4 → 18.1 (~15.7s) for the VO outro. Latched-settle; the frame
is the settled payoff so it reads as a breath, but 15s of zero motion is
far past the cap — this is exactly the hold class voice-agent's quiet
gate / ambient shimmer exists to fix.

## The moves used

- **left→right assembly cadence** (s1 header stagger 0.22s; s2
  block-fade/edge-draw alternation at 0.6–0.8s steps).
- **collective range pulse on an empty pane** (s1) — the problem stated
  with the product's own selection treatment.
- **dim-at-aside / editor-card slide** (s3) — dim, ring, card, tag-glow
  all nested pulseWindows that fully revert.
- **runtime fan + one-clock simultaneity** (s4) — ghosts deal out on one
  EASING.inOut ramp; all six pulses/rings share a single clock.
- **freeze-cut carry with partial decay** (s4→s5: tag glow parks at 0.4
  and finishes decaying after the cut).
- **lane relay with heat hand-off** (s5: each hop = pulse + edge
  pulseWindow + live-window → latched ok; the in-edge cools as its block
  finishes).
- **scramble finish** (s6: lanes 3,0,4,1 at 1.35s spacing, overlapping
  triplets; fold after the last).
- **row-land cell sweep + residue trail** (s7: 1.25s row stagger × 0.16s
  column step; tint peaks 0.7, decays to a status-only 0.12 residue —
  the sent wall).
- **persistent-heat active path** (edge 1 hot from scene 4 to scene 6 —
  heat marks the running path across freeze-cuts).
- **latched-settle holds** (everywhere): all state is `t >= X` booleans
  or clamped ramps, so VO extension can never break a boundary — but
  with NO ambient layer, the long extended holds (s2 ~16s, s8 ~15.7s)
  sit dead. The lesson the ranking taught: latched holds are SAFE but
  not ALIVE; pair them with an ambient pattern when narration runs long.
