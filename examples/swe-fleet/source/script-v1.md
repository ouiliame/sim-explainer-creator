# The Overnight Engineering Fleet (v1) — swe-fleet

Registered as `swe-fleet-v1` (new video, no prior take; nothing
overwritten). Built batch-mode under a director's mandate (hype reel:
SWE agents at fleet scale; money shot = the status column flipping row
after row while the lanes run). Every gate below the mandate converted
to a written assumption.

**The one idea:** an overnight engineering fleet is three Sim primitives
composed — a table holds the backlog, a schedule fires the workflow at
midnight, and a Parallel container turns one coding lane (agent reads the
code and writes the fix, a GitHub block opens the PR, a Table block marks
the row done) into five concurrent engineers. By morning the table is the
record: a wall of done rows with PR numbers.

**Macro arc:** capability-first composition — the backlog (known object) →
the fleet workflow assembles (known grammar) → one reference wires queue
to fleet → deploy arms the clock → midnight, and the WHOLE REST OF THE
VIDEO is that one run seen at three scales: the fire (macro), the fan
(container), one engineer (lane) — then the pull-back for the wall, and
the morning bookend.

**Run count: 1.** A single scheduled traversal spans scenes 5→8 through
three deliberate freeze-cuts. No editor run, no second night: the backlog
scene and assembly scenes are runless, and the bookend holds the settled
state of the same run. (Run economy floor — every prior video used 2–3.)

## Grounding (product truth, re-derived 2026-06-11 from the STAGING
checkout `_reference/sim` @ `5fb37b4ad`)

- **Table grid** = `SimTable` (verbatim app table-grid port, native ×2;
  module-2 derivation). Columns issue/status/pr, 5 rows — authored demo
  content in `demo-corpus/README.md`. Status vocabulary `open` → `done`
  follows module-2's docs-verbatim lowercase status style
  (`unprocessed` → `qualified`).
- **Schedule block**: registry `schedule.ts` — name Schedule, bgColor
  `#6366F1`, subBlock titles `Run Frequency` (Daily) and `Time`
  (12:00 AM). Armed-state pill = schedules-v1's SchedulePill (module-6
  deployment marker + the product's schedule-info caption format,
  `At 12:00 AM · Next: Mar 18, 12:00 AM`; "At 12:00 AM" = cronstrue for
  daily 00:00, same derivation as schedules-v1's "At 8:00 AM").
- **Table blocks**: registry `table.ts` — name Table, bgColor `#10B981`,
  operation labels `Query Rows` and `Update Row by ID` (subBlock
  `Operation`), `Row Data (JSON)` exists for update (shown truncated as
  `{"status": "done", …}`); query outputs `rows` (array) ground
  `<getissues.rows>`. Filter display `status = 'open'` follows module-2
  v2's docs-verbatim filter shape. Glyph = lucide Table
  (block-icons.tsx), ported in module-2 v2.
- **Parallel container**: identity from the app's subflow tool config
  (`subflows/parallel/parallel-config.ts`): SplitIcon, bgColor `#FEE12B`
  (glyph renders dark on the light chip — the product's luminance rule).
  Anatomy = the docs' preview-container-node port (loops-v1 rig,
  re-derived at fleet proportions). Editor labels verbatim:
  `Parallel Type` (subflow-editor.tsx:128), type label `Parallel Each`
  (use-subflow-editor.ts typeLabels), `Parallel Items`
  (subflow-editor.tsx:159). Semantics from parallel.mdx: collection
  distributed one item per instance as `<parallel.currentItem>`;
  instances isolated; **result order not guaranteed** — the scrambled
  finish order is the docs' own sentence, drawn.
- **`<parallel.currentItem.id>`-style property access** (implied by the
  Mark Done lane, not shown on screen): grounded by credential.mdx's own
  `<loop.currentItem.credentialId>`.
- **GitHub block**: registry `github.ts` / `GitHubV2Block` — name GitHub,
  bgColor `#181C1E`, operation label `Create pull request`
  (`github_create_pr`, also in integrations/github.mdx with full
  input/output spec: title/head/base in, `number` out — the table's pr
  column traces to that `number` output). Block row display
  `Repository | acme/api` uses the landing templates' own GitHub-block
  row style (`Repository | org/repo`, template-workflows.ts). Glyph =
  GithubIcon (apps/sim/components/icons.tsx:718), white on the dark chip.
- **Agent block**: registry `agent.ts` — subBlock titles `Messages`,
  `Model`, `Tools`. Model value `claude-sonnet-4.6` is the landing
  template's authored value (GITHUB_RELEASE_WORKFLOW). Tool chip ring =
  "the tool was called" (module-5 grammar).
- ⟨pending⟩ (not shown on screen): real run durations, a real
  workspace's next-run timestamp, real PR URLs, the agent's actual
  branch names. No record-panel scene for exactly this reason
  (loops-v1 assumption 6's logic).

## Batch-mode assumptions (each reversible; swap cost noted)

1. **Composed set piece, no single product source.** No docs example or
   template draws a table + schedule + parallel + GitHub fleet; the set
   piece composes the four canonical rigs (module-2 table-over-chain
   frame, schedules-v1 pill, loops-v1 container, module-5 run grammar).
   Composition is the video's subject, so this is the point, not a
   liberty. Swap cost: n/a.
2. **Lane = Agent → GitHub → Mark Done inside the container.** The
   mandate names the GitHub *integration* for the PR; the explicit
   GitHub block (vs agent-tool-only) makes the PR a drawn, countable
   beat and satisfies "GitHub blocks" verbatim. Containers hold chains
   (subflows are workflows; docs containers show one block only by
   example). Swap cost: medium (lane geometry).
3. **Compact ghost lanes.** The fan shows the followed (middle) lane at
   full rows and the other four as header-only triplets with edges —
   state language (live/ok rings) carries their progress; the TABLE
   carries their results. Full five-wide full-row lanes would force an
   unreadable s≈0.55 camera. This is the video's most reversible visual
   call (same flag as loops-v1 assumption 5). Swap cost: high (fan
   choreography).
4. **Container named `Fleet`.** User-named blocks are product-legal;
   nothing downstream references `<fleet.results>` (no after-block), and
   inside-references are `<parallel.*>` by definition (parallel.mdx), so
   the name costs no reference exactness. Swap cost: trivial.
5. **5 issues / 5 lanes.** Five matches module-2's table precedent, keeps
   every lane countable on screen, and the docs' 20-branch ceiling makes
   five product-legal. Swap cost: low (data + lane count constants).
6. **PR numbers #482–#486 assigned in finish order** — authored demo
   values (demo-corpus), sequence-consistent for one repo, scrambled
   across rows per the no-order-guarantee docs sentence. Swap cost:
   trivial.
7. **Mark Done's Row Data truncated** to `{"status": "done", …}` — the
   full write (status + pr) is simultaneously visible in the table rows
   it lands in (module-5 truncation rule). Row ID config not shown
   (absence, not invention). Swap cost: trivial.
8. **No record-panel scene.** Durations/log shapes would be ⟨pending⟩
   everywhere; the table IS this video's record surface (its whole
   thesis). Swap cost: additive later with a real run artifact.
9. **Plain `#1b1b1b` ground, no canvas dots** — module-2 v2's precedent
   and rationale for table-over-chain stages: the table is co-hero and
   the product never draws the builder dot grid behind a table.

## Motion language

Values live in rows (`ResolvedTag`/`DipSwap` in block rows; cell text
dips in table cells); wires carry light only (`WirePulse` on straight
outer wires, loops' `PathPulse` on curved inner fan wires); state via
product language (blue live ring, green ok ring, 0.35 dim, chip ring for
tool calls, the product's range-selection treatment on queried rows).
Fleet results land as table-cell dips with a green output-tint pulse
that decays to a faint residue (the ResolvedTag residue idea applied to
cells): the accumulating residue IS the wall of green. No sentences on
screen, no state words.

## Locked scene list (~79s visual minimum)

1. **the-backlog** (~8s) — [assemble]
   Table-centered camera. The `backlog` grid assembles: header row
   (issue/status/pr with type icons), then the five rows stagger in —
   every status `open`, every pr empty. Row 1 takes a brief product row
   selection (one range outline + tint) and releases.
   *Beat intent: the backlog is a Sim table — each row one issue waiting
   for an engineer; status open, no PR.*

2. **the-fleet-takes-shape** (~12s) — [assemble + camera ease]
   The camera eases out; the table glides to the top of frame (same
   layout, camera move only). Below, the workflow assembles in flow
   order: Schedule (Run Frequency Daily / Time 12:00 AM) → edge → Get
   Issues (Query Rows / status = 'open') → edge → the Fleet container
   (yellow Split chip, inner Start pill) — and inside it, the lane:
   inner wire → Engineer (Messages `Fix <parallel.currentItem>` /
   Model / GitHub tool chip) → GitHub (Create pull request / acme/api)
   → Mark Done (Update Row by ID / `{"status": "done", …}`).
   *Beat intent: the fleet is one workflow — a clock, a query, and a
   container holding a single coding lane: read, fix, PR, mark done.*

3. **wired-by-reference** (~7s) — [zoom-aside]
   The container takes the blue editing ring; world dims to 0.35. The
   editor card slides in: header (Split chip + Fleet), `Parallel Type |
   Parallel Each`, `Parallel Items | <getissues.rows>` — the reference
   tag glows. Card leaves, ring releases, world undims.
   *Beat intent: one reference wires the queue to the fleet — whatever
   rows the query returns, the parallel runs the lane once per row.*

4. **lights-out** (~6s) — [morph at state level]
   Template chain. The blue editing ring lands on the Schedule block and
   the schedule pill rises above it: green live dot +
   `At 12:00 AM · Next: Mar 18, 12:00 AM`. Ring releases; pill stays.
   Hold the armed frame.
   *Beat intent: deploy once and the clock is armed — the fleet runs at
   midnight whether or not anyone is online.*

5. **midnight** (~10s) — [run, freeze]
   Nothing arrives from anywhere: the Schedule ring lights ON ITS OWN
   and the pill's date dips forward (Mar 18 → Mar 19 — fired and
   re-armed). Pulse crosses edge 1; Get Issues goes live and IN SYNC all
   five table rows light as one product selection range (the query
   selecting `status = 'open'`; synchrony only, no connector lines).
   The range releases as the pulse crosses edge 2 into the container;
   the container's live ring comes on — and HOLDS through the cut.
   *Beat intent: at midnight the clock fires, the query pulls every open
   issue, and the whole batch heads into the fleet.*

6. **the-fan** (~9s) — [freeze-cut continuation + fan]
   Opens inside the held moment (container live). The camera eases onto
   the container. The lane fans five wide: four compact lanes separate
   out above and below the followed lane (EASING.inOut). The inner Start
   pill blips ONCE; five pulses leave together along the fanned wires;
   all five Engineers go live AT THE SAME TIME, and in the followed lane
   `<parallel.currentItem>` resolves to `[row 3]`. HOLDS through the cut
   (lanes live, tag resolved).
   *Beat intent: the parallel splits the batch — one engineer per issue,
   every instance isolated, all of them starting at the same moment.*

7. **one-engineer** (~12s) — [camera lean-in, same run]
   Opens inside the held moment; camera pushes onto the followed lane.
   The Engineer works: the GitHub tool chip rings three quick times
   (reading the file, writing the fix, pushing the branch) and the agent
   settles ok. Pulse → the GitHub block goes live, settles ok — the PR
   exists. Pulse → Mark Done goes live, and the camera eases back out to
   the full frame just in time to see the lane's row close its loop: row
   3's status dips `open → done` and pr fills `#482` with a green tint
   pulse that decays to a residue; the followed lane settles ok. The
   other four lanes are still live. HOLDS through the cut.
   *Beat intent: one lane end to end — the agent reads the code and
   writes the fix, the GitHub block opens the PR, the Table block marks
   its own row done. The row flip IS the lane finishing.*

8. **the-wall** (~9s) — [the money shot]
   Full frame, steady camera. The remaining four lanes finish in
   scramble order — row 5, row 1, row 4, row 2 — each finish a triplet:
   lane settles ok, status dips to `done`, pr fills (#483 → #486),
   green pulse, residue. The status column becomes a wall of done. Then
   the fan folds back into one lane, the container settles ok, and the
   chain settles green in causal order — Schedule, Get Issues, Fleet.
   *Beat intent: the fleet lands its work row after row — order not
   guaranteed, every lane independent — until the queue is empty.*

9. **morning** (~8s) — [settle / bookend]
   The settled frame holds: every status `done`, every pr filled, the
   chain green, the pill still armed for the next midnight. The camera
   eases back ~6% and holds the balanced frame for VO.
   *Beat intent: by morning the table is the record — five PRs waiting
   for review, and the clock already armed for tomorrow night.*

## Continuity contract

- **One set piece**, all geometry in `layout.ts`: the `backlog` SimTable
  (top), the chain Schedule → Get Issues → Fleet container (bottom), the
  lane (and its four fan ghosts) inside the container, the schedule pill
  above the Schedule block. Scenes render one `<Stage/>` and differ ONLY
  in state props and camera (`cameraTo` transforms of the unchanged
  layout). Nothing relayouts, ever.
- Fan exists only between scene 6's fan-out and scene 8's fold; at every
  boundary inside that span fan = 1 exactly.
- Per boundary (exit state == enter state, pixel-verified):
  - 1→2: table assembled, row selection released, CAM_TABLE both sides.
  - 2→3: chain assembled idle, CAM_ALL.
  - 3→4: same (card gone, ring released).
  - 4→5: armed state — pill `Next: Mar 18, 12:00 AM`, template chain,
    CAM_ALL.
  - 5→6: **freeze-cut** — container live ring ON is the carried state;
    pill reads Mar 19; table range released; CAM_ALL.
  - 6→7: **freeze-cut** — fan = 1, five lanes live, followed lane's
    `<parallel.currentItem>` resolved to `[row 3]`, container live,
    CAM_CONT.
  - 7→8: **freeze-cut** — fan = 1, followed lane ok, row 3 flipped
    (done / #482 / residue), four ghost lanes live, container live,
    CAM_ALL.
  - 8→9: settled state — fan folded, all rows flipped with residue,
    chain green (Schedule/Get Issues/Fleet ok), pill armed, CAM_ALL.
- Cell residue tints and flipped values persist to the final frame (they
  are the table's new VALUES + provenance residue, module-2's "the table
  keeps its new values"). All selection ranges, editing rings, and
  resolutions revert before their scene ends except the named
  freeze-cut carries.
- Verification: `bun run lint`; opened stills at every scene's key beats
  (incl. fan midpoint, chip-ring frame, each row flip, the wall);
  `bun scripts/verify-boundaries.ts swe-fleet-v1` (structural zero).
- No sentences on screen; narration carries the words (beat intents
  above; narration written after visuals lock, per the narration skill).
