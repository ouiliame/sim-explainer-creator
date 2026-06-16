# Iteration — Loop & Parallel (v1) — loops

Registered as `loops-v1` (new video, no prior take; nothing overwritten).
Built batch-mode (director unavailable) — every gate converted to a written
assumption below, per the new-explainer batch protocol.

**The one idea:** When the same steps must run over many items, put the
steps inside a container block. The container runs the inside once per
item — a Loop one at a time, a Parallel all at once — and afterwards hands
you every iteration's result as one array.

**Macro arc:** capability-first — the container is the capability; the
ForEach run is its mechanism; the results array is its payoff; Parallel is
the same capability on the other schedule; no manufactured problem.

**Run count:** 2 full traversals.
- Run A (Loop, scenes 3–4 via freeze-cut): three sequential iterations —
  the iteration mechanism and the collected output.
- Run B (Parallel, scene 6): the same three items concurrently — the only
  thing that differs from Run A is the schedule, which is exactly the
  lesson. No third run; the bookend re-morphs without running.

**Grounding (product truth, re-derived 2026-06-11 from the STAGING
checkout `_reference/sim` @ `5fb37b4ad`):**
- Set-piece shape = the docs' own LOOP_WORKFLOW / PARALLEL_WORKFLOW
  (`apps/docs/components/workflow-preview/examples.ts:1490` / `:1540`):
  Start (x0) → container (x340, 430 wide) → consumer (x860), Start/consumer
  vertically aligned so the container's centered handles give straight
  outer wires (docs author the same alignment: 95+20 = 30+85). All ×1.5
  per SimBlock convention.
- Container anatomy = the docs' `preview-container-node.tsx` (staging —
  the docs workflow-preview was restructured back upstream): 8px-radius
  box, `--wp-border-1` border, `--wp-container-fill` fill
  (rgba(255,255,255,0.02) dark / rgba(0,0,0,0.02) light, global.css:1663/
  :1694), header bar `--wp-header` (surface-3) with 24px chip + 16px
  medium name, internal **Start pill** at (16, 56) native (rounded-lg,
  border, px-3 py-1.5, 13px medium) with its own source handle, container
  target/source handles 7×20 at the vertical center. Cross-checked against
  the app's real subflow node (`apps/sim/app/workspace/.../subflows/
  subflow-node.tsx`).
- Container identities from the app's subflow tool configs (the registry
  analog for containers — Loop/Parallel are canvas containers, not
  registry blocks): Loop = `RepeatIcon`, bgColor **#2FB3FF**
  (`subflows/loop/loop-config.ts`); Parallel = `SplitIcon`, bgColor
  **#FEE12B** (`subflows/parallel/parallel-config.ts`). NOTE the docs
  examples color the same containers #FAFAF9 / #1D1C1A — app config wins
  (same rule as registry-over-docs for colors); drift noted. On #FEE12B
  (light) the glyph renders dark #1c1c1c per the product's own luminance
  rule (`preview-container-node.tsx iconClassFor`).
- Inner block = the product's own teaching screenshots for the mechanism
  (`apps/docs/public/static/blocks/loop-2.png` / `parallel-2.png`):
  **Function 1** with code `return <loop.currentItem>` /
  `return <parallel.currentItem>`. Function color #FF402F
  (`apps/sim/blocks/blocks/function.ts:20`), row title **Code**
  (`function.ts:36`), CodeIcon glyph (`apps/sim/components/icons.tsx:527`)
  ported as a white glyph.
- Editor aside (scene 2) = the same screenshots + the real editor labels:
  "Loop Type" (`subflow-editor.tsx:128`), type label "For Each"
  (`use-subflow-editor.ts:26`), "Collection Items"
  (`subflow-editor.tsx:159`). Collection value `["x", "y", "z"]` is the
  product's own authored collection (parallel-2.png).
- Consumer = the docs LOOP_WORKFLOW's own after-block: **Summary** agent,
  row `Messages | Summarize <loop.results>` (agent green #33C482 =
  var(--brand), globals.css:773; Messages row title `agent.ts:88`).
- Reference semantics from loop.mdx / parallel.mdx (staging
  `apps/docs/content/docs/en/workflows/blocks/`): `<loop.currentItem>`
  only inside; results by the block's name after; iterations sequential
  for Loop, concurrent for Parallel; results collected in order.
- Row titles verified against the staging registry: Code ✓ Messages ✓.
  The Start trigger block renders header-only (no rows) — avoids the
  docs-vs-registry "Input"/"Inputs" drift entirely (start_trigger.ts:24
  titles the subBlock "Inputs"; the docs previews write "Input"; we show
  neither).

**Batch-mode assumptions (each reversible; swap cost noted):**
1. **Composite set piece.** Docs example shape (Start → container →
   Summary) + the screenshots' inner Function (`return
   <loop.currentItem>`) instead of the docs' Score-reviews agent. Reason:
   the screenshots are the product's own *mechanism* teaching content, and
   with `return <currentItem>` the collected results array
   `["x", "y", "z"]` is mechanically derivable — zero invented values.
   Swap cost: medium (inner block rows + resolution values).
2. **One collection for both phases**: `["x", "y", "z"]`
   (parallel-2.png-authored) is shown in the Loop's editor too
   (loop-2.png authors `["one","two","three"]`). Same items through the
   morph = "only the schedule changed", and the short items keep every
   resolved row inside its block width. Swap cost: trivial (one constant).
3. Container named **Loop** / **Parallel** (docs example names, which make
   `<loop.results>` / `<parallel.results>` exact by the documented
   name-normalization rule), not the screenshots' "Loop 1"/"Parallel 1".
   Swap cost: trivial.
4. The consumer is one element with two docs-verbatim identities, dipped
   by the morph: **Summary** agent (`Messages | Summarize <loop.results>`,
   LOOP_WORKFLOW) ⇄ **Aggregate** function (`Code |
   merge(<parallel.results>)`, PARALLEL_WORKFLOW). Build deviation from
   the first draft of this assumption (which kept Summary in both phases
   with only the tag swapped): `Summarize <parallel.results>` measured
   wider than the block row and truncated on a render — the docs' own
   pairing both fits and is better grounded. The "same steps" claim
   concerns the inside of the container, which still changes nothing.
   Swap cost: trivial.
5. The **parallel fan-out** (scene 6): the docs *say* "identical
   instances" but no product surface draws N instances; the fan of the one
   inner block into three ghost instances is the minimal drawing of the
   docs' own sentence, composed from existing language (same block,
   transform-interpolated, rings/dim). Flagged as the most reversible
   visual decision in the video. Swap cost: high (scene 6 choreography).
6. Record-panel scene CUT: the per-iteration log shape isn't authored
   anywhere reachable and durations would be ⟨pending⟩ everywhere; the
   results-array resolution already shows the payoff. Swap cost: additive
   (new scene later, needs a real run artifact).
7. Start block header-only (see grounding note on Input/Inputs drift).
   Swap cost: trivial.
8. A taller container than the docs' 430×170 (430×360 native) so three
   fanned instances fit inside in scene 6 without mid-video resizing; the
   real product container is user-resizable and the product screenshots
   show exactly these generous proportions. Swap cost: low (layout
   constant).

## Motion language

Values resolve in rows (`ResolvedTag` / `DipSwap`); wires carry light only
(`WirePulse` on straight outer wires, the branching build's `PathPulse`
dash-streak on the curved inner wires); state via product language (blue
live ring, green ok ring, 0.35 dim, blue selection ring while "editing").
Iteration is shown by **repetition of the same beats**: the inner Start
pill re-fires, the same pulse re-crosses, and `<loop.currentItem>`
re-resolves to the next item. The timing contrast IS the lesson: Run A's
three passes take ~3× the time of Run B's one simultaneous pass.

## Locked scene list (~66s)

1. **a-block-that-holds-blocks** (~9s) — [assemble]
   Canvas dots on the builder bg, empty. The workflow assembles in flow
   order: Start fades in → edge 0 draws to the container → the Loop
   container fades in (bordered box, header with blue Repeat chip, inner
   Start pill) → the inner wire draws from the pill → Function 1 fades in
   INSIDE with its row `Code | return <loop.currentItem>` → the exit edge
   draws from the container's own source handle → Summary fades in
   (`Messages | Summarize <loop.results>`). Hold the balanced frame.
   *Beat intent: this is a block that holds blocks — a workflow inside a
   workflow. Whatever you drop inside the container runs once per item;
   it has its own little start.*

2. **what-the-loop-knows** (~8s) — [zoom-aside]
   The container takes the blue selection ring (editing); everything else
   dims to 0.35. The product's editor card slides in on the right: header
   (blue Repeat chip + "Loop"), `Loop Type | For Each`,
   `Collection Items | ["x", "y", "z"]`. The three items glow in sequence
   — x, then y, then z — a countable collection. Card leaves, ring
   releases, world undims.
   *Beat intent: the loop is told how to iterate — for each item of this
   collection, run the inside once. Three items: the inside will run three
   times.*

3. **one-at-a-time** (~14s) — [run + camera lean-in]
   Run A begins. Start blips; pulse crosses edge 0; the container takes
   the live ring and KEEPS it. Camera leans in on the container (1.18×,
   EASING.inOut). Then the mechanism, three times over: the inner Start
   pill blips → a pulse crosses the inner wire → Function 1 goes live →
   in its row, `<loop.currentItem>` resolves in place to `"x"` → the
   Function settles ok, the resolution reverts — and the pill blips AGAIN
   for `"y"`, again for `"z"`. Visibly one at a time; never two rings at
   once. After the third pass the camera returns to identity; the
   container's live ring HOLDS through the cut (freeze-cut: the loop has
   finished its passes but produced nothing yet).
   *Beat intent: same steps, next item. Each pass, the inside runs once
   and `<loop.currentItem>` IS the current item — a different value every
   time. A Loop takes them strictly one after another.*

4. **the-results-come-out** (~8s) — [freeze-cut completion +
   reference-resolution]
   Opens inside the held moment: container still live, identity camera.
   The container settles ok; its source handle fires; ONE pulse crosses
   the exit wire; Summary goes live and in its row `<loop.results>`
   resolves in place to `["x", "y", "z"]` — every pass's result, in
   order, as one value. Summary settles ok. Hold. Then everything reverts
   to template (rings release, resolution reverts).
   *Beat intent: after the loop, the inside's per-item context is gone —
   you reference the loop itself by name, and you get all the results as
   one array, in order.*

5. **swap-the-container** (~8s) — [morph-swap]
   Template frame, identity camera. Blue selection ring on the container
   (editing). One continuous morph at constant geometry: the header chip
   crossfades #2FB3FF Repeat → #FEE12B Split (glyph goes dark on the
   light chip, per the product's luminance rule) while the name dip-swaps
   Loop → Parallel; in sync, the Function row's tag dips
   `<loop.currentItem>` → `<parallel.currentItem>` and the consumer dips
   to the docs' parallel identity (Summary/`Summarize <loop.results>` →
   Aggregate/`merge(<parallel.results>)` — assumption 4). INSIDE the
   container nothing changes — same box, same inner block, same wires,
   same items. Ring releases.
   *Beat intent: same container idea, same steps inside — one swap, and
   the only thing that changes is the schedule. Downstream, you reference
   the container by its name, so the name in the tag follows it.*

6. **all-at-once** (~12s) — [run]
   Run B. Start blips; pulse crosses edge 0; container live ring. Inside,
   the difference: Function 1 fans into THREE instances (the block splits
   to top/middle/bottom, EASING.inOut) — "a separate instance per item" —
   then the inner Start pill blips ONCE and three pulses leave together;
   all three instances go live AT THE SAME TIME; each row resolves its own
   item — `"x"`, `"y"`, `"z"` simultaneously; all three settle ok
   together, in roughly the time ONE pass took in Run A. Resolutions
   revert; the instances collapse back into one block; the container
   settles ok; the exit fires; the pulse crosses; Summary's
   `<parallel.results>` resolves to `["x", "y", "z"]`; Summary ok. Hold;
   full revert to the parallel template.
   *Beat intent: a Parallel runs an instance per item, all at once —
   independent work in a fraction of the time — and the results still
   come out as one array.*

7. **two-schedules-one-shape** (~7s) — [settle / bookend + reverse morph]
   Template parallel frame. The scene-5 morph plays in reverse (yellow →
   blue, Split → Repeat, tags dip back) landing exactly on scene 1's end
   state; then the camera eases back ~7% (EASING.inOut) and holds the
   balanced frame for VO.
   *Beat intent: one shape, two schedules. Reach for a Loop when each pass
   depends on the last or order matters; reach for Parallel when the items
   are independent and you want them done now.*

## Continuity contract

- **One set piece:** Start, container (Loop ⇄ Parallel — one element, two
  identities), inner Start pill, Function 1 (1 instance ⇄ 3-instance fan,
  scene 6 only, fully inside the scene), Summary. All geometry owned by
  `layout.ts` (docs coordinates ×1.5; container 430×360 native per
  assumption 8; outer wires straight on the container's center axis).
  Scenes pass state props to one `<Rig/>`; nothing relayouts, ever.
- **Morph = colors/labels/tags only.** Header chip color+glyph crossfade,
  name DipSwap, two tag DipSwaps. No height or position changes — the
  boundary-safe morph by construction. Scene 7 plays the same curves in
  reverse.
- **Per boundary:** 1→2 loop template, identity camera. 2→3 loop template
  (card gone, ring released). 3→4 **deliberate freeze-cut:** container
  `highlighted` (live ring) is the ONLY carried state; camera back at
  identity; all iteration resolutions reverted before the cut. 4→5 loop
  template. 5→6 parallel template (ring released). 6→7 parallel template
  (fan collapsed, run reverted inside scene 6). Every resolution reverts
  before its scene ends except the named freeze-cut. Edges draw on once
  (scene 1) and never retract; pulses are absorbed before overlapping
  their destinations.
- The fan-out exists only between run-start and run-end inside scene 6;
  at both of scene 6's boundary frames the rig is the single-instance
  parallel template.
- Verification: `bun run lint`; opened stills at every scene's key beats
  (incl. the scene-5 morph midpoint, a mid-iteration frame of scene 3,
  and the full fan of scene 6); `bun scripts/verify-boundaries.ts
  loops-v1` (structural zero required).
- No sentences on screen; narration carries the words (beat intents above;
  narration sheet on delivery).
