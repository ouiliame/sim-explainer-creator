# The On-Call Agent (hype 3) — on-call-v2

Registered as `on-call-v2` (NEW TAKE — the hype-2 take `on-call-v1` lives on
branch `hype/on-call-agent` and is preserved as data; nothing overwritten).
Built under the hype-3 mandate: honest + REAL SURFACES ONLY. One real Sim
workflow, left→right; the evidence and outputs live exclusively on the run
record (OutputBundle) and a real incidents SimTable — no invented incident
cards, no evidence panels, no fake app UI (the case-17 regression this take
exists to correct).

**The one idea:** an on-call agent is one real webhook-triggered workflow —
the alert arrives, an agent READS the signals (Sentry, Datadog, GitHub as
tools) and CREATES the records (a Slack post, a Linear ticket, a PagerDuty
page). The proof lives where Sim actually keeps proof: the run record fills
row by row, and the incidents table's status column flips firing → triaged →
assigned. The agent never edits anything and never redeploys anything — it
reads and it writes records, both first-class registry operations.

**Macro arc:** problem object first (the firing queue — swe-fleet's
backlog-table shape) → the responder workflow assembles (known grammar) →
ONE alert followed mechanically through the whole machine across freeze-cuts
(in → read → create, the run record landing each beat) → the cadence
pull-back where the remaining alerts run through and the status column
drains (the queue-flip money mechanic, swe-fleet/agent-economy's loved
spectacle) → the morning bookend.

**Run count: 6, counted and justified.** A webhook delivers ONE alert per
run — six firing incidents = six runs, the trigger's real semantics. Run 1
is followed mechanistically (scenes 3→5, two freeze-cuts, one traversal).
Runs 2–6 are the cadence beat (scene 6): each is a single blip-traversal
whose only narrative content is a DIFFERENT table row flipping — multiplicity
is the spectacle, and no run repeats another's lesson. The run record on
screen is run 1's record and stays run 1's record (a run record is a per-run
surface; it does not accumulate across runs).

## Hard constraints (the hype-3 mandate, restated as checks)

1. ONE real Sim workflow, left→right, real registry blocks, real handles,
   `SimEdgePath` edges. `SimBlock` renders workflow blocks ONLY.
2. Asides ONLY in the established aside grammar — here: the run record
   (`OutputBundle`) and the incidents `SimTable` — as SEPARATE boxes beside
   the workflow (a right rail). Never inside containers, never occluding
   blocks, never replacing workflow structure.
3. No Parallel/Loop container in this video at all (the fan to three
   terminals is three real edges from one source handle — an actual
   workflow shape, not a container).
4. TRUE only: the agent READS (Sentry / Datadog / GitHub tool calls) and
   CREATES records (Slack message, Linear issue, PagerDuty incident). No
   edit, no redeploy, no self-repair appears anywhere — not even in demo
   copy.

## Grounding (product truth, re-derived 2026-06-12 from `_reference/sim`)

The workflow (all from `apps/sim/blocks/blocks/*.ts`; glyphs ported verbatim
from `apps/sim/components/icons.tsx`):

- **Trigger** = registry `generic_webhook.ts` — name **Webhook**, bgColor
  `#10B981`, `triggerAllowed: true`, lucide Webhook icon (`WebhookGlyphW`).
  Sentry has NO trigger integration in the registry (no `triggers:` block in
  `sentry.ts`, nothing in `apps/sim/triggers/`), and the generic block's own
  bestPractices say to use it exactly then — so "Sentry alerts in" is
  honestly drawn as the generic Webhook block, user-named **Sentry Alerts**
  (user naming is product-legal; swe-fleet's `Fleet` precedent). Row
  `Webhook URL | …/trigger/d8abcf0d…` — the trigger's real subBlock title
  (`triggers/generic/webhook.ts:16`) and the docs' own example UUID (the
  bestPractices curl; same display as the accepted webhooks video).
  Payload reference `<sentryalerts.message>` follows the generic-webhook
  docs' own dot-notation example (`<webhook1.message>`).
- **Agent** = registry `agent.ts` — name **Triage** (module-7's own accepted
  agent name), bgColor `var(--brand)` = `#33C482`, `AgentGlyphW`. Real
  subBlock titles `Messages` / `Model` / `Tools`. Model value
  `claude-sonnet-4-6` (the repo's accepted authored value, module-5/
  webhooks). Tool chips **Sentry** (`#362D59`), **Datadog** (`#632CA6`),
  **GitHub** (`#181C1E`) — agent-tools-over-blocks is the registry's own
  stated preference (`agent.ts` bestPractices). Chip ring = "the tool was
  called" (module-5 grammar). Standard agent outputs `content · model ·
  tokens · toolCalls` (`agent.ts` bestPractices + outputs) ground the
  record's tree.
- **Terminals** (three real edges from the agent's source handle — a real
  canvas fan, no container):
  - **Slack** — `slack.ts`, `#611f69`, op label **Send Message** (`send`),
    subBlock `Channel` → rows `Operation | Send Message`, `Channel |
    #incidents`. White pinwheel `SlackGlyphW` (the repo's existing port).
  - **Linear** — `linear.ts` `LinearV2Block`, name **Linear**, `#5E6AD2`,
    op label **Create Issue** (`linear_create_issue`), subBlock `Team` →
    rows `Operation | Create Issue`, `Team | Platform`.
  - **PagerDuty** — `pagerduty.ts`, `#06AC38`, op label **Create Incident**
    (`create_incident`), subBlock `Urgency` (dropdown High/Low, default
    High) → rows `Operation | Create Incident`, `Urgency | High`.

The surfaces (both verbatim ports already in `src/components/`):

- **Run record** = `OutputBundle` (the docs' run-inspector port). Logs
  column = the five blocks that ran, in execution order, each with chip +
  duration (module-7's accepted record shape). Output tree = Triage's REAL
  output shape: `content` (string) · `tokens` (object) · `toolCalls`
  (array) whose three children are the run's tool calls landing as rows —
  keys are the registry's real tool ids (`sentry_issues_get`,
  `datadog_query_logs`, `github_latest_commit`), values in module-7's
  accepted `NNNms · result` format. Read-ops grounding: Sentry **Get
  Issue** (`sentry_issues_get`), Datadog **Query Logs**
  (`datadog_query_logs`), GitHub **Get latest commit**
  (`github_latest_commit`) — all real operation ids; all reads.
- **Incidents table** = `SimTable` (verbatim app table-grid port, native
  ×2). Columns `incident / service / status`, 6 rows. Status vocabulary
  `firing → triaged → assigned`, lowercase plain cell text (module-2 /
  swe-fleet status style); flips land as cell dip-swaps with the green
  output tint decaying to residue (growth-machine's accepted cell
  language).

- ⟨pending⟩ (NOT shown as real): no real run artifact exists. Durations,
  token counts, tool-call result summaries, incident titles, the triage
  `content` line, channel/team names are AUTHORED demo stand-ins, declared
  in `data.ts` + `demo-corpus/README.md` (the swe-fleet PR-number / 
  growth-machine opener precedent). Real Sentry payload shape, real
  webhook URLs, real durations stay ⟨pending⟩ and off screen.

## Batch-mode assumptions (each reversible; swap cost noted)

1. **Composed set piece, no single product source** — no docs example
   draws webhook→agent→{Slack,Linear,PagerDuty}; the set piece composes
   the canonical rigs (webhooks-video trigger, module-5 agent grammar,
   module-7 record, module-2/swe-fleet table). Composition is the video's
   subject. Swap cost: n/a.
2. **All three terminals run every alert.** The drawn workflow has three
   unconditional edges, so per product semantics all three downstream
   blocks execute each run — no Condition/Router is drawn, so none is
   implied. (If the director wants severity routing, that's a Router block
   and a different video.) Swap cost: medium.
3. **Status lifecycle is the table's authored vocabulary**, flipped in
   sync with the run's REAL records: `triaged` lands when the Triage agent
   settles ok (its summary exists / Slack post lands), `assigned` lands
   when the PagerDuty incident is created (a page assigns the on-call via
   escalation — PagerDuty's real behavior). The workflow is not drawn
   writing the table (no Table block — the mandate fixes the three
   terminals); the table is the workspace's incident queue surface, the
   swe-fleet scoreboard role. Swap cost: low (add a fourth Table-block
   terminal and a `Update Row` row if drawn causality is wanted).
4. **`<sentryalerts.message>`** follows the generic-webhook docs' root
   `message` example; a literal Sentry issue-alert payload nests deeper
   (`data.issue.title`). Swap cost: trivial (string).
5. **6 incidents / 6 runs.** Six rows keep the queue countable and the
   cadence beat rhythmic (5 remaining after the followed run). Swap cost:
   low (data + beat count).
6. **Followed run = row 3** (`HTTP 500 /payments`); remaining rows flip in
   scramble order 5, 1, 6, 2, 4 (arrival order of independent alerts —
   nothing guarantees queue order). Swap cost: trivial.
7. **Plain `#1b1b1b` ground, no canvas dots** — the swe-fleet /
   growth-machine precedent for stages where a table is co-hero. Swap
   cost: trivial (`dots` prop).
8. **Record panel scale 1.6** (not the aside-default ×2) so the right rail
   column-aligns with the ×2 table at the home framing; effective text
   size at CAM_ALL ≈ the chain's own row text. Swap cost: trivial.

## Motion language (Phase B; Phase A ships the static set piece)

Values live in rows and cells (ResolvedTag for `<sentryalerts.message>`;
cell dip-swaps for status); wires carry light only (`WirePulse`); state is
the product language (blue live ring, green ok ring, red never needed —
nothing fails in this video; 0.35 dim; chip ring = tool called; green
output tint decaying to residue on flipped cells). Record rows and tree
nodes land with reveal, never floating objects. Block↔surface links are
carried by SYNCHRONY ONLY (chip rings while its toolCalls row lands; agent
settles while the status cell flips) — no connector lines. No sentences on
screen, no state words outside the status column's own enum text.

## Locked scene list (~75s visual minimum)

1. **the-queue** (~9s) — [table hero]
   Camera on the incidents table (CAM_TABLE). The grid assembles: header
   (incident / service / status), six rows stagger in, every status cell
   `firing`. The status column takes one collective product selection-tint
   pulse and releases — that column is the job.
   *Beat intent: six incidents are firing and it's 3 a.m. Somebody is
   supposed to triage all of these.*

2. **the-responder** (~13s) — [assemble + camera ease]
   Camera eases out to CAM_ALL; the workflow assembles left of the rail in
   flow order: Sentry Alerts webhook (Webhook URL row) → edge → Triage
   agent (Messages with the payload tag, Model; then the three tool chips
   width-grow in: Sentry, Datadog, GitHub) → three edges draw to Slack
   (Send Message / #incidents), Linear (Create Issue / Platform),
   PagerDuty (Create Incident / High).
   *Beat intent: this is the on-call agent — a webhook receives each
   alert, an agent reads the monitoring stack, and three integrations
   carry its findings out.*

3. **alert-in** (~8s) — [run 1 starts, freeze-cut]
   The first alert arrives: the webhook block blips live and settles ok;
   `<sentryalerts.message>` resolves in the Triage Messages row
   (ResolvedTag → row 3's incident title) while row 3 of the table takes
   the product selection highlight IN SYNC (the alert ↔ its row, synchrony
   only); a pulse crosses edge 1; the Triage live ring comes ON. The run
   record fades in below the table with its first log row landed (Sentry
   Alerts · 18ms). HOLDS through the cut.
   *Beat intent: one alert in — the run has begun, and the record is
   already being written.*

4. **reading-the-signals** (~13s) — [zoom-aside beats, same run]
   Camera leans toward the agent + record (CAM_READ). Three read beats,
   each carried by synchrony: the Sentry chip rings ↔ `[0]
   sentry_issues_get` lands in the record's toolCalls; the Datadog chip
   rings ↔ `[1] datadog_query_logs` lands; the GitHub chip rings ↔ `[2]
   github_latest_commit` lands. The Triage log row's duration counts up;
   the agent ring stays live. HOLDS through the cut.
   *Beat intent: the agent reads the incident the way an engineer would —
   the Sentry issue, the logs around it, the commit that shipped — and
   every call lands in the run record as it happens.*

5. **creating-the-records** (~11s) — [run 1 completes — THE MONEY SHOT]
   Camera back at CAM_ALL. The Triage ring settles ok; `content` and
   `tokens` reveal in the record tree; three pulses leave the agent
   together. Slack goes live → ok and its log row lands; row 3's status
   dips `firing → triaged` with the green tint. Linear goes live → ok,
   log row lands. PagerDuty goes live → ok, log row lands — and row 3
   dips `triaged → assigned`, tint pulsing to residue. Record full.
   *Beat intent: it posts the diagnosis to Slack, opens the Linear
   ticket, and pages the on-call with context — three records, created,
   and the incident is assigned.*

6. **the-queue-drains** (~13s) — [cadence, runs 2–6]
   Steady CAM_ALL. The remaining five alerts arrive in accelerating
   cadence: for each, the webhook blips, a pulse crosses, the agent ring
   pulses live→ok (chips ringing in quick rhythm), the three terminals
   blip ok — and a DIFFERENT table row flips firing → triaged → assigned
   (scramble order 5, 1, 6, 2, 4), each with the green tint decaying to
   residue. The status column drains top to bottom into a wall of
   `assigned`. The record stays run 1's settled record.
   *Beat intent: every alert gets the same treatment — the queue drains
   itself, row after row.*

7. **morning** (~8s) — [settle / bookend — THE FINAL FRAME]
   The settled frame holds: chain green in causal order, record full,
   every status cell `assigned` with its faint residue. Camera eases back
   ~4% and holds for VO.
   *Beat intent: by morning the pages went to the right people, every
   incident has an owner and a ticket — and the whole night is written
   down, run by run.*

## Continuity contract

- **One set piece**, all geometry in `layout.ts`: the workflow (Sentry
  Alerts → Triage → {Slack, Linear, PagerDuty}) on the left, the rail
  (incidents SimTable above, run record OutputBundle below) on the right.
  Scenes render one `<Stage/>` (scenes/_rig.tsx) and differ ONLY in state
  props and camera (`cameraTo` transforms of the unchanged layout).
  Nothing relayouts, ever. The asides never move and nothing ever overlaps
  them.
- Per boundary (exit state == enter state, pixel-verified):
  - 1→2: table assembled, all firing, selection released, CAM mid-ease
    (continuous camera across the cut or CAM_ALL both sides).
  - 2→3: workflow assembled idle, record not yet present, CAM_ALL.
  - 3→4: **freeze-cut** — webhook ok, Triage live ring ON, Messages tag
    resolved, table row 3 highlight released, record present with row 1
    landed, camera at CAM_ALL→CAM_READ handled inside scene 4.
  - 4→5: **freeze-cut** — Triage still live, all three chips settled, all
    three toolCalls rows landed, CAM_READ→CAM_ALL handled inside scene 5.
  - 5→6: run 1 settled — chain green, record full, row 3 assigned +
    residue, CAM_ALL.
  - 6→7: all six rows assigned + residue, chain settled, CAM_ALL.
- Cell residue tints and flipped statuses persist to the final frame.
  Resolutions revert per the template rule EXCEPT the named freeze-cut
  carries; the Messages ResolvedTag reverts when run 1 settles (5→6
  carries template state in the agent rows).
- Verification: `bun run lint`; opened stills at every scene's key beats;
  `bun scripts/verify-boundaries.ts on-call-v2` (structural zero).
- No sentences on screen; narration carries the words (beat intents
  above; narration written after visuals lock, per the narration skill).

## Phase A scope (prior commit)

Locked scene list (above), `layout.ts`, `data.ts`, the static `<Stage/>`
set piece, and two graded stills: the scene-5 money instant and the
scene-7 final frame. `Video.tsx` registers `on-call-v2` with two static
holds (money / final) standing in for the seven scenes until Phase B
animates them. No motion, no narration, no full render.

## Phase B scope (this commit)

The seven scenes animated per the motion language above (scenes/, with
shared beat shapes in `scenes/_beats.ts`); narration-v1.md in the gold
register + vo-sync (M5lS, 135.3s, extend-only). Scene choreography is
paced to the narrated beats, and the authored visual minimums were
raised to contain every beat (11/19/12/13/15/16/8 — the ~75s plan
minimums extended once real audio lengths were known; extend-only keeps
boundaries safe under any later narration trim). All 6 boundary pairs
verify IDENTICAL. The scene-5 money instant and scene-7 final frame
match the approved Phase-A stills' states.
