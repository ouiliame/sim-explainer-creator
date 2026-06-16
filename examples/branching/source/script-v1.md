# Branching — Condition & Router (v1) — redo/branching

Registered as `branching-v1` (new video, no prior take; nothing overwritten).
Built batch-mode from the blessed A/B direction (experiments/2026-06-10-ab-branching):
treatment's structure and discipline + baseline's docs-verbatim THREE-route Router act.

**The one idea:** A workflow doesn't have to be a line — it can fork, and on
every run exactly one branch fires. The only question is *who picks*: a
Condition picks with a rule (no model, same data → same path), a Router picks
with a model (reads the text, chooses by meaning). The branch not picked
simply never happens.

**Macro arc:** capability-first — the fork is the capability; the two
deciders are its two anatomies; the run record is its evidence; no
manufactured problem.

**Run count:** 3 runs total, each with a distinct outcome.
- Run A (Condition → Escalate, scene 2): a rule picks the path; the other
  lane stays dark.
- Run B (Condition → Reply, scene 3): the fork is real both ways; branches
  are checked top-to-bottom, first true wins.
- Run C (Router → Support, scene 5): a model picks by meaning; doubles as
  the scene-6 record source. No fourth run, no recap loop (judge: baseline's
  scene-8 mini-runs were timing-impossible and restated landed outcomes).

**Grounding (product truth, re-derived 2026-06-10):**
- Act 1 set piece = the docs' CONDITION_ROUTE_WORKFLOW verbatim
  (`apps/docs/components/workflow-preview/examples.ts:235`): Start
  {Input: Ticket} (0,60) → Condition #FF752F (330,60) with branches
  `If | <start.priority> === 'high'` / `else | -` → agents Escalate
  {Messages: Escalate this ticket} (700,0) and Reply {Messages: Draft a
  standard reply} (700,130). All ×1.5 per SimBlock convention.
- Act 2 = the docs' ROUTER_TRIAGE_WORKFLOW verbatim (`examples.ts:494`):
  same Start → Router #28C43F (320,95) {Context: <start.input>, Model:
  claude-sonnet-4-6} with label-only routes Sales / Support / Billing →
  agents Sales {Answer the pricing question} (700,0), Support {Help with
  the issue} (700,95), Billing {Resolve the billing question} (700,190).
- Branch-row anatomy from `preview-block-node.tsx`: branch rows styled
  exactly like config rows (label left, value right, `-` when empty), each
  with its OWN 7×20 source handle at right −16px native (header handle is
  −8px); the header source handle is suppressed whenever branches exist
  (`showHeaderSource = !hideSourceHandle && !hasBranches`). The error handle
  exists in the product (red, −16px) — deliberately omitted, out of scope.
- Colors re-verified against the registry today: Condition #FF752F
  (`apps/sim/blocks/blocks/condition.ts:28`), Router #28C43F
  (`apps/sim/blocks/blocks/router.ts:157` — NOT agent green #33C482).
  Glyphs: ConditionalIcon, ConnectIcon (`block-icons.tsx:84,91` →
  `apps/sim/components/icons.tsx`), ported as white glyphs.
- Semantics from condition.mdx / router.mdx / how-it-runs.mdx: top-to-bottom,
  first-true-wins; else is the fallback; "Only the branch that is taken runs.
  A block on a branch that didn't run produces no output"; the Router makes a
  model call per decision; the Condition makes none.

**Declared deviations + assumptions (batch mode — no live gates):**
1. The decider keeps x = 495 (330 native ×1.5) in BOTH phases even though
   the Router example authors x=320 — continuity (decider never moves) beats
   a 15px doc-coordinate difference between two separate examples.
2. NO invented demo values. Everything a run shows is doc-authored:
   Run A resolves `<start.priority>` → `'high'` (the literal inside the
   docs' own expression). Run B shows NO resolved value — the verdict
   choreography alone (glow → no match → else fires) carries it, because no
   doc authors a non-high priority value ⟨pending: real run B payload⟩.
   Run C does not resolve `<start.input>` to ticket text — the tag glows
   (being read) without substituting ⟨pending: real ticket text⟩. The chosen
   route is Support (middle lane — balanced; matches the docs' triage framing)
   ⟨pending: real run's selectedRoute⟩.
3. Run-record durations are omitted (OutputBundle renders rows without a
   duration) rather than invented ⟨pending: real log durations⟩. The output
   tree shows a single `selectedRoute: "support"` row — doc-authored output
   name + the docs' own route — as scenery, never highlighted. reasoning /
   tokens / cost are NOT shown (judge: a fifth idea brushing the
   structured-output exclusion; cut to resolve the scene-6 cramming flag).
4. The "selected" log row is the product's active-row background state
   (`OutputBundle row.selected` → #2c2c2c), never a word on screen —
   resolves the judge's ambiguity flag.

**Deliberately not taught:** loops/parallel, error paths / NO_MATCH
fallback, nested branching, route-description authoring, structured-output
mechanics, Router token cost.

## Motion language

Values resolve in rows (ResolvedTag); wires carry a light pulse only
(PathPulse — WirePulse's streak language carried along the smooth-step
branch path, no cargo); state via product language (blue live ring, green
ok ring, 0.35 dim). One video-specific addition, justified: **verdict
choreography on decider rows** — a checked row glows blue while evaluating,
settles green when it matches, dims to 0.35 when it doesn't. A row-scale
composition of existing state language, not a new primitive. Never a word,
never a ✗. **The timing contrast IS the lesson:** the Condition's verdict
lands ~0.3s after the tag resolves (instant, no think); the Router's live
ring holds through a ~1.4s Model-row glow before any route fires.

## Locked scene list (~64s)

1. **a-fork-in-the-flow** (~8s) — [assemble]
   Canvas dots on #1b1b1b, empty. The fork assembles in docs-preview order:
   Start fades in → edge draws to Condition → Condition fades in with both
   branch rows visible (`If | <start.priority> === 'high'`, `else | -`).
   Then the new thing, staggered so it lands: the **If row's own handle**
   glows blue and its edge draws up-and-right to Escalate (fades in); then
   the **else row's handle** glows and its edge draws down-and-right to
   Reply (fades in). Hold the balanced four-block frame; the two branch
   handles each carry one more sequential blue beat (top, then bottom), then
   settle to #454545.
   *Beat intent: the workflows you've built so far are lines — a workflow
   can split, and the split lives in one block: each branch row is its own
   output port.*

2. **the-rule-decides** (~12s) — [run + camera lean-in + reference-resolution]
   Run A. Start blips; pulse crosses edge 0; live ring on Condition. Camera
   leans in (1.28×, EASING.inOut). Inside the **If row**: the row glows
   (checking), the tag `<start.priority>` ResolvedTag-resolves in place to
   `'high'` — the rest of the expression never changes — and ~0.3s later the
   row settles **green** (instant verdict, no think-hold); the `else` row
   dims to 0.35 (never checked). The If row's handle fires blue; the Reply
   lane (block + edge) dims to 0.35 the moment the port commits — nothing
   ever arrives there; pulse along the top edge; Condition settles ok;
   Escalate live → ok. Brief hold; all resolutions revert, rings release,
   lanes undim. Camera **stays leaned** through the cut.
   (Unified grammar across all three runs: not-taken lanes dim AT the
   moment the winning port fires — dimming earlier would telegraph the
   Router's choice in run C before the model has decided.)
   *Beat intent: a Condition picks the branch by evaluating a rule against
   values your blocks already produced — the tag resolves, the check is just
   a comparison, no model is called. And the bottom lane never ran.*

3. **the-other-path** (~8s) — [run]
   Run B, inside the held lean-in framing. Start blips; pulse; live ring on
   Condition. The **If row glows first** (top-to-bottom order made visible)
   — and **dims to 0.35**: no match. The glow moves down: the `else` row brightens and settles green;
   its handle fires (Escalate's lane dims as the port commits); pulse down
   the bottom edge; Reply live → ok. Revert everything; camera returns to
   identity before scene end.
   *Beat intent: branches are checked top to bottom and the first true one
   wins; else catches the rest. Different value, different path — and again,
   the branch not taken simply didn't happen.*

4. **swap-the-decider** (~10s) — [morph-swap + smooth growth + 2→3 lanes]
   Template fork at identity camera. Blue selection ring on the Condition
   (reads as "editing"). One continuous phase-driven morph: header
   crossfades in place (chip #FF752F/ConditionalIcon → #28C43F/ConnectIcon,
   name Condition → Router); the branch rows dip-swap (`If | expr` →
   `Sales | -`, `else | -` → `Support | -`) while the destination agents
   crossfade in sync (Escalate→Sales, Reply→Support — names and Messages
   rows dip-swap); `Context | <start.input>` then `Model | claude-sonnet-4-6`
   grow in above the branch rows at exact natural slot heights; a third
   branch row `Billing | -` grows in below; lane geometry interpolates 2→3
   (Sales glides up, Support glides to the center line, Billing's agent
   fades in on lane 3 as its edge draws from the new third handle). Both
   existing edges' source anchors track their handle rows continuously —
   never a snap. Selection ring releases; settle.
   *Beat intent: same workflow, one part changed. When the decision can't be
   written as a rule, swap in a Router: it gets a context to read, a model
   to read it, and the branches become named routes.*

5. **the-model-decides** (~12s) — [run + camera lean-in]
   Run C. Start blips; pulse; live ring on Router. Camera leans in. The
   **Context row's**
   `<start.input>` tag glows — the Router is reading it ⟨no resolution;
   pending artifact⟩. The **Model row glows ~1.4s while the live ring
   holds** — a visible beat of thought, deliberately longer than the
   Condition's instant verdict (the timing contrast is the wordless lesson).
   Then the **Support route row** settles green; its handle fires (Sales
   and Billing lanes dim 0.35 as the port commits); pulse along the middle
   edge; Support agent live → ok. Hold; revert all; camera back to identity
   before scene end.
   *Beat intent: a Router hands the choice to a model — no field to check,
   just meaning. It takes a model call; the Condition took none.*

6. **the-run-record** (~8s) — [record-panel]
   The fork dims to 0.35; OutputBundle rises (×1.7). Logs column staggers in
   **three** rows: Start (blue chip) · Router (#28C43F chip, **selected** =
   the product's active-row background) · Support (agent chip). **No Sales
   row, no Billing row — five blocks on the canvas, three rows in the log.
   The absence is the beat: a long beat of stillness after the third row
   lands.** The output panel shows one quiet row, `selectedRoute: "support"`
   (scenery — never highlighted). Panel leaves; fork undims.
   *Beat intent: a branch not taken isn't an error or a skip — it left no
   log, produced no output, cost nothing. It never ran.*

7. **still-one-workflow** (~6s) — [settle / bookend + morph-swap reprise]
   Template fork, identity camera. One motion: the same phase morph runs in
   reverse — Billing's edge fades, its agent fades, Context/Model/Billing
   rows shrink out at exact heights (edges tracking the rising branch rows),
   header crossfades Router → Condition — landing on the state scene 1
   ended on. Then the camera eases back ~7% (EASING.inOut). Hold the
   balanced frame for VO.
   *Beat intent: it's still just blocks and connections — one fork, two
   interchangeable deciders. Reach for the rule when you can write it; reach
   for the model when you can't.*

## Continuity contract

- **One set piece:** Start, decider, and three destination slots at fixed
  geometry owned by `layout.ts` (docs coordinates ×1.5, decider x constant
  across phases, DEC_Y fixed). `layout.ts` exports per-phase block
  positions, the per-branch handle-Y helper (a function of the decider's
  current row reveals), edge endpoints, and the lean-in camera framing.
  Scenes pass state props to one `<Fork/>`; nothing relayouts, ever. The
  scene-6 overlay rises over the dimmed, unmoved fork.
- **The decider is one block with two variants.** Condition (header + 2
  branch rows) ↔ Router (header + 2 config rows + 3 branch rows). All
  height/lane change happens INSIDE scenes 4 and 7 via the single
  phase-driven morph (built once in `<Fork/>`, run forward then in
  reverse); branch-handle Ys and all outgoing edge anchors are recomputed
  from the same reveals every frame. Never at a cut.
- **Per boundary:** 1→2 condition template, identity camera. 2→3
  **deliberate held framing:** camera leaned (1.28×); block state fully
  template (run A reverted before scene end) — only the camera carries.
  3→4 condition template, identity. 4→5 Router template, identity, ring
  released. 5→6 Router template. 6→7 Router template. Every resolution
  reverts before its scene ends; the only cross-boundary carry in the video
  is the 2→3 camera framing. Lane-dim asymmetry exists only mid-run; all
  lanes full opacity in every boundary frame. Edges draw on once and never
  retract (scene 7's Billing edge fades out, never retracts); pulses
  absorbed before overlapping destinations.
- Verdict language fixed: glow = being checked, green = matched, 0.35 = not
  matched / not taken. Never a word, never a ✗.
- Verification: `bun run lint`; opened stills at every beat including both
  morph midpoints and the scene-6 three-row hold;
  `bun scripts/verify-boundaries.ts branching-v1` (structural zero) plus
  `bun scripts/verify-boundaries.ts module-5-agents-v3` (SimBlock extension
  regression check).
- No sentences on screen; narration carries the words.
