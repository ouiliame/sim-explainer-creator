# market-desk teardown — the algorithm a #1 build reveals

Reverse-engineered from the complete artifact chain (the only #1-ranked
showpiece): `examples/market-desk/source/{notes,script-v1,narration-v1}.md`
+ `source/scenes/` + `CHOREOGRAPHY.md`. Read those in that order; this doc is
the distilled procedure.

This is the **front-half** (concept → locked scene list) the choreography
README doesn't cover, plus the **non-obvious levers** that abstract pipelines
miss. Codify FROM here, by pointing at the real artifacts (show, don't tell).

## What it is (the composition)

A prediction-market research desk = **four real Sim blocks composed**: a Table
(watchlist) + a Schedule (fires hourly) + a Polymarket block (pulls markets) +
a Parallel container (one analyst lane → five concurrent). The table is the
desk; estimates fill row by row and the mispriced markets flag themselves.
**The video's subject IS the composition of real product primitives.** Not a
designed diagram — an arrangement of things that already exist.

## The algorithm (8 moves, with the load-bearing ones flagged ★)

**★1. Concept = composition of real primitives.** State the one idea as
"X is N Sim primitives composed: [Table, Schedule, Polymarket, Parallel]."
The concept step is a SELECTION problem (which real blocks), not an invention
problem. This is port-don't-design applied at the *concept* level — and it's
why the floor is high even for a weak model: there's nothing to design, only
to arrange.

**★2. Borrow the SHAPE from a graded-best exemplar.** market-desk's macro arc
("board → desk assembles → wire by reference → arm the clock → the hour
strikes → ONE run at three scales → settle") was **ported beat-for-beat from
swe-fleet** (the same-shaped #1 of reel-1), swapping only the mechanism. The
notes say it outright: "swe-fleet's loved shape, new mechanism." **Structure
is reused from a graded winner; only the content changes.** This is the single
biggest lever and the one a cold agent will skip unless forced: don't invent a
scene arc — find the nearest graded-best video and port its arc.

**★3. Run economy: one run at multiple scales.** Run count = **1**. A single
scheduled traversal spans scenes 5→8 through three **freeze-cuts**, seen at
three scales: the pull (macro) → the fan (container) → one analyst (lane) →
pull back for the signals. Scenes 1–4 are runless (assembly); scene 9 holds
the settled run. The money pattern: *one run, three camera scales, freeze-cuts
carrying live state across the cuts* — not N runs.

**4. Ground every value to the registry.** Every block color/label/output
field traced to `apps/sim/blocks/blocks/*.ts` (Schedule #6366F1, Polymarket
#4C82FB `Get Markets`, Parallel #FEE12B, Table #10B981 `Upsert Row`, the
`<polymarket.markets>` wire). Anything not derivable → ⟨pending⟩ and OFF
SCREEN (no run-record scene, because real durations weren't available). The
registry wins over docs on conflicts.

**5. Declare batch assumptions with swap costs.** Every reversible decision
(composed set piece, lane = Agent→Table, board pre-seeded, 5 markets, signal
vocab) is listed with its cost to change. Makes the build auditable and the
director's reversals cheap.

**6. Lock the scene list as a contract.** Each beat → a named **archetype**
(assemble / zoom-aside / run / freeze-cut / settle) + a one-line beat-intent +
the **continuity contract** (per-boundary exit==enter state, pixel-verified).
The scene list is locked BEFORE any code.

**7. One set piece, `layout.ts` owns geometry.** Every scene renders one
`<Stage/>` and differs ONLY in state props + camera. Nothing relayouts. The
runtime fan (5 lanes) is *animation only* — the canvas always has ONE lane
(case-17 rule: never N static lanes).

**★8. Motion: vary the beat shape across scales.** What won #1 (director's
words): "visually diverse + dynamic." The choreography README's payload —
beat shapes VARY across the run's scales (pull / fan / lane / scramble finish)
instead of repeating one shape; **sync is meaning** (Exa chip rings AS the
search happens; a cell fills AS the lane settles — two surfaces, one event);
**latched-settle holds** (no oscillators → extend-safe for VO); the money shot
is the **scramble finish with cause→effect offset** (lane settles → its row
fills 0.7s later, four times, overlapping); **the camera leaves the detail to
watch the consequence** (eases out so the full board is in frame when the row
lands).

## The reading order = the pipeline

`notes.md` (concept skeleton) → `script-v1.md` (locked plan: one idea, macro
arc, run economy, grounding, assumptions, scene list, continuity contract) →
`scenes/_rig.tsx` + `layout.ts` (one set piece, prop-driven) → individual
scenes → `CHOREOGRAPHY.md` (motion taste) → `narration-v1.md` (gold register,
vo-synced last). That chain IS the generation algorithm, shown end to end.

## The one gap (the director's note, 2026-06-13)

market-desk runs its Agent ("Analyst") **exterior only** — the lesson there is
parallelism, so the agent's work shows as chip rings (Exa, then Perplexity)
with no view of the messages. **When the agent block itself is what's being
taught, that's not enough** (case 19): the Agent block is the platform's most
confusing primitive, and a chat showing *what's happening inside it* is what
hammers it home. So the codified grammar adds, for any agent-anatomy beat, the
`ChatPanel` zoom-aside beside the dimmed block: the input as the user message
→ thinking dots → tool-call rows landing the **same frame** as the chip rings
→ tool results → the assistant's answer bubble. Synchrony carries the link;
never connector lines. (market-desk scene 7 "one-analyst" is exactly where
this would slot — the chat would show the market as the prompt, Exa/Perplexity
as synced tool calls, the 0.71 estimate as the answer.)

## How the grammar maps to CODE (the 4-layer separation)

The video is **four files' worth of roles**, and "building" it is composition +
timing, never drawing. Verified by reading the source:

1. **`layout.ts` = GEOMETRY (where).** Pure constants + helpers, nothing else.
   `STAGE_W/H`, every block X, table cell metrics, `cameraTo`, `cellX/cellY/
   laneEdge`. Every number is GROUNDED, not chosen: table = product table-grid
   ×2, blocks = `SimBlock` ×1.5 at the series chain pitch, container = the
   docs' preview-container-node port. One constant (`ANALYST_H`) is *measured
   from a render* ("trust the rasterizer"). Comment: "Nothing relayouts, ever."

2. **`data.ts` = CONTENT (what).** Every on-screen string/value: columns, rows,
   the tags (`<parallel.currentItem>`, `<polymarket.markets>`), block row
   labels, the model name. Content fully separated from rendering — this is
   where the grounded values live and where ⟨pending⟩ would go.

3. **`scenes/_rig.tsx` = THE SET PIECE (`<Stage/>`).** Imports the shared
   library (`SimBlock, SimTable, SimEdgePath, WirePulse, ResolvedTag, Tag,
   DipSwap, BLOCK_COLORS` + glyphs) + geometry from layout + content from data,
   and ASSEMBLES one `<Stage/>` that takes ~20 frame-derived **state props**
   (`cam, dim, fillMix, sched, poly, cont, edge1, pulse1, pill, fan, lanes,
   laneTag…`). Pure composition: position imported components at layout coords,
   wire their visual-state props. The ONLY locally-defined visuals are ports:
   the glyphs ("verbatim product icon paths"), `DeskContainer` (preview-
   container-node port), `SchedulePill` (reused from schedules-v1), and
   `DeskConfigCard` (zoom-aside grammar). It also defines `ramp/pulseWindow/
   camMix` — math helpers, not visual vocabulary.

4. **`scenes/*.tsx` = STATE CHOREOGRAPHY (when).** Each scene is ~30–50 lines:
   read `frame`, compute frame-derived numbers, render ONE `<Stage/>` with
   them. `TheFanScene` in full is 48 lines, half comment: it computes
   `fan = ramp(t,2.2,3.6)`, `pulses = ramp(t,4.4,5.2)`, `anaLive = t>=5.1`, and
   passes them. **The scene invents NO visuals — it is pure timing of the set
   piece's state.** The leading comment block IS the choreography spec.

So: **concept** (4 primitives composed, one run at three scales) → **one
`<Stage/>`** assembled from the library at `layout.ts` coords with `data.ts`
content → **9 thin scene files** that are frame-derived state over that one
Stage. Each scene-grammar archetype is a *prop pattern* on Stage, not a new
component (assemble = reveals ramping; run = pulse/ring props; zoom-aside =
`dim` + a card; freeze-cut = the same held state across two scenes' boundary).

## Did it invent code? Almost none — the thesis holds

The entire "original" surface area is: the `Stage` assembly + the 9 scene
state-functions (both = composition/timing, not vocabulary) + a handful of
**ports** (product-icon glyphs, the container node, the schedule pill) and one
**cross-video import** (`PathPulse` from `loops/scenes/_rig`). **Zero new
surfaces, zero new motion primitives, zero invented UI.** The creative act was
choosing which real blocks to compose and timing their states — exactly what
the model-pair delta says Opus failed to do (it invented surfaces inside
scenes instead of composing a Stage from the library). **This 4-layer
separation is the single most important thing to put in front of a cold agent:
write layout.ts + data.ts, assemble a Stage from `src/components`, then write
thin frame-derived scenes. If you're defining a bordered surface inside a
scene, you've already failed.**

## Why the Opus version was rejected — it COMPOSED; the gap is elsewhere

The Opus market-desk (`opus-reject/`) is the most important artifact in this
kit, because it refutes the easy explanation. Diff it against Fable's:

- **Same plan.** The two `script-v1.md` files are near-twins: same one idea
  (Schedule + Polymarket + Parallel + board), same macro arc, same run economy
  (1 run, freeze-cuts), same grounding discipline, same assumptions-with-swap-
  costs format, same archetypes, same "one set piece / `layout.ts` owns
  geometry / one `<Stage/>`" architecture, same per-boundary continuity
  contract. **Opus composed — at the same level, same grammar.**
- **Same code shape.** Same low-level helpers (`visOpacity, ramp, pulseWindow,
  camMix`), comparable motion density (Opus 1–9 timed events/scene, Fable
  1–10). It is NOT that Opus did less motion or invented its surfaces (the
  delta doc's three static-frame axes — surface/camera/containment — Opus
  passed here; it was the closest hype2 got).

So composition wasn't the gap. The rejection is **product-mechanism honesty +
choreography appetite** — the micro-decisions the low-level skill leaves open:

1. **Effects without causes (the disease).** Opus animated *outcomes* and
   skipped the *mechanism*:
   - **The board ticks "live."** Opus added a frame-derived jitter to the odds
     so the table feels realtime. **Sim is not realtime** — a table changes
     ONLY when a workflow writes to it. The tick is a lie about the product,
     and it broke the boundary verifier (Opus documented most boundaries as
     "intentionally non-identical" because of it). Fable kept odds static; the
     table updates only when the write lands.
   - **No write block.** Opus drew the lane as `Analyst` alone — the board's
     `est`/`edge` cells fill with **no Table block writing them**. In real Sim
     a surface changes only when a Table block (`Upsert Row`) runs. Fable's
     lane is `Analyst → Update Board` — the write-back is a drawn block, so the
     row filling has a cause on canvas.
   - **The fan overflows the container.** Opus's runtime fan drew six Analyst
     lanes that spill past the `Desk` container's bottom edge — the inner
     blocks exceed the box that's supposed to contain them (case-17 lineage:
     the set piece bigger than its frame). It's also the containment-honesty
     violation: N lanes drawn at all. Fable draws ONE lane on canvas and fans
     at runtime *within* the container's bounds. (This means the model-pair
     delta was too generous — it called market-desk's containment "clean";
     the rendered frame shows it wasn't.)
2. **Choreography appetite.** Even at equal motion density, the *taste* of the
   timing (beat-shape variety across scales, sync precision, latched holds, the
   scramble-finish payoff) is what won #1 — and that doesn't transfer through a
   skill (model-resilience: "guards transfer discipline, not appetite").

**The lesson (your hypothesis, confirmed): the primitives are too low-level.**
Both models wield `SimBlock` + raw `ramp()` math at the same level, so the
FLOOR is set by the primitive level, not by "compose vs invent." At that level
Opus still makes hundreds of micro-decisions — *should the table tick? is there
a write block? how long is this hold?* — and gets the honesty and the taste
ones wrong. Raising the primitive level removes those decisions structurally:
a `runBeats()`-style baked choreography (timing pre-tuned), a set-piece scaffold
where a written-to surface STRUCTURALLY requires a write block in its lane, a
`SimTable` that can only change on a write event — none of which Opus *can* get
wrong because the decision no longer exists. That is the harness's real job:
not "tell Opus to compose," but "raise the floor so the open decisions are ones
even a weaker model can't fail."

### Two product-truth rules this surfaced (now in CLAUDE.md hard rules)

- **Sim is not realtime.** A surface (table/board/log) changes ONLY at the
  moment a workflow writes to it. No ambient ticking, no live feed, no
  self-updating numbers. Show an update only when the write block runs.
- **Show the mechanism, completely — every effect has its drawn cause.** A
  table fills ⇒ a Table write block (`Upsert`/`Insert`) is in the lane. A value
  appears ⇒ a block produced it. Never animate a consequence without the block
  that causes it. The video must be a faithful runnable workflow, not a vibes
  animation of an outcome.

## What to codify from this (the open work)

Turn the ★ moves into the harness skill, each anchored to the real artifact:
- **Concept-as-composition** + **borrow-the-shape** → `new-explainer` Phase 0–2
  (the front-half this teardown recovers).
- **Run-at-three-scales / freeze-cut carry** → scene-grammar.md.
- **Beat-shape variety / sync-is-meaning / latched holds / scramble finish** →
  the choreography section (CHOREOGRAPHY.md is already 80% of it).
- **Agent-chat interior** → a required scene archetype (the gap above).
