# The Outbound Machine (v1) — outbound-machine

Registered as `outbound-machine-v1` (hype 3; new take of the outbound
topic — growth-machine, the one good hype-2 take, is the graded exemplar;
nothing overwritten, takes culture). Built batch-mode under the hype-3
hard constraints: ONE real Sim workflow, left→right, real registry
blocks, real handles, SimEdgePath wires; allowed surfaces ONLY canvas +
SimTable + run record + ChatPanel + deploy pill (this video uses canvas +
SimTable and nothing else); Parallel container = ONE inner lane, fan-out
is runtime animation; spectacle = the RUN.

**The one idea:** an outbound machine is one workflow that fills a table —
find the companies once, enrich and personalize every one of them at the
same time, send, and then WRITE THE RECORD BACK: the run's last block
batch-inserts every enriched, personalized, sent lead into a real Sim
table. The table above the chain starts empty and ends a sent campaign.

**The hype-3 delta vs growth-machine:** the write-back is now MECHANICAL.
growth-machine's table filled conceptually (no block wrote it); here the
chain ends in a real Table block — `Batch Insert Rows` of
`<parallel.results>`, the docs' own after-the-parallel aggregation
pattern — so every cell that fills on screen is a write the workflow
actually performs. Spectacle stays product-true end to end (case 17).

**Macro arc:** capability-first composition (swe-fleet shape). The empty
outbound table (the job: a campaign that doesn't exist yet) → the machine
assembles below it (Apollo find → Enrich parallel container holding the
one lane Data Enrichment → Personalize → Instantly → Table write-back) →
one reference wires the queue to the fan → ONE run seen at three scales:
the fan splits (macro), one lane works one lead end-to-end (the
mechanistic example, freeze-cut), the lanes scramble-finish and fold —
then the run's climax: the Table block writes, and six record rows LAND
in the table one after another, each a left→right cell sweep ending in a
`sent` status (the money shot) → the sent-campaign bookend.

**Run count: 1.** A single traversal spans scenes 4→7 through freeze-cuts.
Scenes 1–3 are runless; scene 8 holds the settled state of the same run.
No reply beat this take (the mandate doesn't name it; the bookend is the
settled record — swap cost trivial to add one inbound pulse later).

## Grounding (product truth, re-derived 2026-06-12 from `_reference/sim`,
read from the main checkout; growth-machine's grounding re-verified)

- **Outbound table** = `SimTable` (verbatim app table-grid port, native
  ×2; module-2 derivation), columns `company / contact / title / signal /
  message / status`, a 6-row grid pane. OPENS EMPTY — rows are INSERTED
  by the run (the pane keeps its height; un-landed rows are empty pane,
  the product's own below-the-last-row look). Lead content authored in
  `data.ts` (traced in `demo-corpus/README.md`).
- **Apollo** = registry `apollo.ts` — bgColor `#EBF212` (dark glyph,
  luminance rule), operation **Search Organizations**
  (`apollo_organization_search`); filter row `Employees | 50–500` (docs
  filter `organization_num_employees_ranges`, humanized). Glyph =
  ApolloIcon (icons.tsx:4714).
- **Enrich container** = **Parallel container**
  (`subflows/parallel/parallel-config.ts`: SplitIcon, bgColor `#FEE12B`,
  dark glyph) named **Enrich**, ONE inner lane + inner Start pill (docs
  preview-container anatomy; loops/uc-data-enrichment rig). Editor card
  verbatim: `Parallel Type | Parallel Each`, `Parallel Items |
  <apollo.organizations>`. Result order not guaranteed (parallel.mdx) →
  the scramble finish AND the landed row order are the docs' own
  sentence, drawn.
- **The lane (inside Enrich):**
  - **Data Enrichment** = registry `enrichment.ts`, bgColor `#9333EA`,
    EnrichmentIcon. Rows `Operation | Build Full Contact` (registry
    template), `Input | <parallel.currentItem>`. Provider chip = the
    registry's provider-cascade output (`provider`, docs examples
    Hunter / People Data Labs).
  - **Personalize** = registry `agent.ts`, bgColor `#33C482`
    (var(--brand)), AgentGlyphW. Rows `Messages | Opener for
    <enrich.contact>`, `Model | claude-sonnet-4.6` (landing templates'
    authored value).
  - **Instantly** = registry `instantly.ts`, bgColor `#FFFFFF` (white
    chip), InstantlyIcon. Rows `Operation | Create Lead`
    (`instantly_create_lead`), `Campaign | Q3 Outbound` (authored label).
- **Table (write-back)** = registry `table.ts` — name **Table**, bgColor
  `#10B981`, TableIcon (icons.tsx:6487; white glyph). Rows `Operation |
  Batch Insert Rows` (`batch_insert_rows` — the registry's ONE multi-row
  write), `Table | outbound` (tableSelector; authored table name),
  `Rows | <parallel.results>` — the docs' canonical aggregation
  reference after a Parallel (workflows/blocks/parallel.mdx: "a Function
  aggregates `<parallel.results>` after they finish"). DECLARED
  DIVERGENCE: the row title abbreviates the registry's editor label
  "Rows Data (Array of JSON)" to "Rows" for canvas legibility.
- ⟨pending⟩ (NOT shown on screen): real run durations, real enriched
  values, the agent's real output strings, real Apollo result counts.
  All lead content on screen is AUTHORED demo stand-in (declared in
  `data.ts`), standing in for the run artifact exactly as swe-fleet's PR
  numbers do. No run-record (OutputBundle) scene: its rows would be
  durations, which are ⟨pending⟩.

## Batch-mode assumptions (each reversible; swap cost noted)

1. **Empty-at-open table, insert-order rows.** Because the only true
   multi-row write is `batch_insert_rows`, the table opens EMPTY and the
   run INSERTS the rows; the landed row order = `<parallel.results>`
   order = the scramble completion order (`LANDED_ORDER`), not Apollo's
   query order. (growth-machine's pre-seeded queue had no block writing
   it; hype 3 demands the write be real.) Swap cost: medium — a
   pre-seeded queued→sent variant needs an upsert-per-lane topology the
   mandate's lane doesn't include.
2. **Lane = Data Enrichment → Personalize → Instantly** (mandate-fixed).
   The Data Enrichment block subsumes the provider cascade (its
   `provider` output names Hunter/PDL). Swap cost: medium (lane
   geometry).
3. **6 leads / 6 lanes** — countable lanes, readable message column,
   product-legal parallel count. Swap cost: low.
4. **Authored personalized openers + signals, DECLARED** (six distinct
   2-line openers in `data.ts`; the different-copy-per-row behavior is
   genuine agent-per-item). Swap cost: trivial.
5. **Followed lane = Northwind** (mechanistic example, finishes first);
   ghost scramble = Veraxis, Acme, Drift, Brightwave, Cobalt. Swap cost:
   trivial.
6. **Status residue.** Each landing row pulses green and decays; a faint
   residue stays ONLY on the status column (the sent wall = the green
   column, the run's provenance). Swap cost: trivial.
7. **No reply beat** (mandate doesn't name it; one fewer claim). Swap
   cost: trivial (one inbound pulse + a status dip).
8. **Plain `#1b1b1b` ground, no canvas dots** — module-2-v2 / swe-fleet /
   growth-machine precedent for table-over-chain stages.

## Motion language (Phase B contract)

Values resolve in place, never ride wires: `WirePulse` light on the outer
wires, loops' `PathPulse` on the curved inner fan wires; `ResolvedTag` for
`<parallel.currentItem>` and `<enrich.contact>`; the `<parallel.results>`
tag glows while the Table block writes. State via product language only
(brand-blue live ring, green ok ring, 0.35 dim, provider chip ring, the
table's selection treatment). A landing record row = row chrome fades in
+ cells sweep left→right (text types/dips in per cell) + a green tint
pulse decaying to the status residue. No sentences on screen, no state
words; narration written after visuals lock.

## Locked scene list (80s)

1. **the-empty-table** (8s) — [problem visual / table hero]
   Table-centered camera (CAM_TABLE). The `outbound` grid assembles:
   header (company / contact / title / signal / message / status with
   type icons) over an EMPTY six-row pane. A collective selection-tint
   pulse over the empty pane releases — the campaign that doesn't exist
   yet is the job.

2. **the-machine** (13s) — [assemble + camera ease]
   Camera eases out (CAM_TABLE → CAM_ALL); the table glides to the top
   band (camera move only). Below, the machine assembles in flow order:
   Apollo (Search Organizations / Employees 50–500) → edge → the Enrich
   container (yellow Split chip, inner Start pill, ONE lane: Data
   Enrichment → Personalize → Instantly) → edge → the Table block
   (Batch Insert Rows / outbound / `<parallel.results>`).

3. **wired-by-reference** (8s) — [zoom-aside]
   The container takes the brand-blue editing ring; world dims to 0.35.
   The editor card slides in: `Parallel Type | Parallel Each`,
   `Parallel Items | <apollo.organizations>` — the reference tag glows.
   Card leaves, ring releases, world undims.

4. **the-fan** (10s) — [run, freeze]
   The run starts: Apollo's ring lights and settles ok; a pulse crosses
   edge 1; the container's live ring comes on. The fan: the lane fans
   six wide (four compact ghost lanes deal out, EASING.inOut); the inner
   Start pill blips ONCE; six pulses leave together; all six Data
   Enrichment blocks go live AT THE SAME TIME; in the followed lane
   `<parallel.currentItem>` resolves to `[Northwind]`. HOLDS.

5. **one-lane-one-lead** (12s) — [freeze-cut + camera lean-in, same run]
   Camera pushes onto the followed lane (CAM_LANE). The lane works ONE
   lead mechanistically: the provider chip rings (the cascade calling
   out) and Data Enrichment settles ok; pulse → Personalize goes live,
   its `<enrich.contact>` tag glows and resolves to `[Priya Nair]`,
   settles ok; pulse → Instantly goes live, settles ok. The table stays
   untouched — nothing writes until the writer runs. Camera eases back
   to CAM_ALL. HOLDS.

6. **the-scramble-finish** (9s) — [the parallel resolves]
   The other five lanes finish in scramble order (each triplet settles
   ok at its own beat — result order isn't guaranteed, drawn); the fan
   folds back to one lane; the container settles ok.

7. **the-write-back** (13s) — [THE MONEY SHOT]
   A pulse exits the container along edge 2; the Table block takes the
   live ring and its `<parallel.results>` tag glows. Then the record
   lands: six rows insert top-to-bottom in result order — each row's
   chrome fades in and its cells sweep left→right (company, contact,
   title, signal, the DIFFERENT 2-line opener, then status dips in
   `sent`), each with a green pulse decaying to the status residue. The
   message column becomes six distinct openers; the status column
   becomes a wall of `sent`. Mid-cascade = the money frame.

8. **the-sent-campaign** (7s) — [settle / bookend]
   The Table block settles ok; the chain is green end-to-end under the
   full table; camera eases back ~5% (CAM_OUT) and holds the balanced
   frame for VO. The empty pane of scene 1 is now a sent campaign — the
   run wrote its own record.

## Continuity contract

- **One set piece**, all geometry in `layout.ts`: the `outbound` SimTable
  (top band) over the chain Apollo → Enrich container → Table block, the
  lane (Data Enrichment → Personalize → Instantly) and its four fan
  ghosts inside the container, the inner Start pill. Scenes render one
  `<Stage/>` and differ ONLY in state props and camera (`cameraTo`
  transforms of the unchanged layout). Nothing relayouts, ever.
- Fan exists only between scene 4's fan-out and scene 6's fold; at every
  boundary inside that span fan = 1 exactly.
- Per boundary (exit state == enter state, pixel-verified in Phase B):
  - 1→2: table assembled, zero rows, selection released, CAM_TABLE.
  - 2→3: machine assembled idle, CAM_ALL.
  - 3→4: same (card gone, ring released), CAM_ALL.
  - 4→5: **freeze-cut** — container live, fan = 1, six lanes live,
    `<parallel.currentItem>` resolved `[Northwind]`, CAM_ALL.
  - 5→6: **freeze-cut** — fan = 1, followed lane ok, five ghosts live,
    container live, table still empty, CAM_ALL.
  - 6→7: fan folded, container ok, chain settled except the Table block
    idle, table still empty, CAM_ALL.
  - 7→8: all six rows landed + status residue, Table block ok, CAM_ALL
    (scene 8 eases to CAM_OUT).
- Landed values + status residue persist to the final frame (the table
  keeps its new values — module-2's thesis). All selection ranges,
  editing rings, and glows revert before their scene ends except the
  named freeze-cut carries.
- Verification: `bun run lint`; opened stills at every scene's key beats;
  `bun scripts/verify-boundaries.ts outbound-machine-v1` (structural
  zero) once Phase B lands motion.
- No sentences on screen; narration carries the words (written after
  visuals lock, per the narration skill).
