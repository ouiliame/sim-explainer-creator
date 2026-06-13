# The Voice Agent (take 2, corrected layout) — voice-agent-v2 — hype reel 3

Registered as `voice-agent-v2`. Take 2 of hype2's `voice-agent-v1`
(branch `hype/voice-agent`), rebuilt under the director's grading:
"the voice agent one is also good — it's just the workflow layout should
not get fucked up; use a separate box." The loved content (the streaming
call-transcript panels, the outcome stamps, the outcomes record filling)
is kept; the architecture is corrected per case 17 as amended by the
hype2 verdicts.

**The one idea:** give an agent a phone and it doesn't just answer — it
CALLS. One workflow run fans a real phone call out to every appointment,
holds a live conversation with each, and writes every outcome back to a
table.

**The correction (the whole reason for take 2):**
- The workflow is a CLEAN, product-true, left→right Sim workflow:
  `Start → Campaign (agent) → Parallel container` whose ONE inner lane is
  `Call (AgentPhone, Create Call) → Log outcome (Table, Insert Row)`.
  SimBlock renders only these real registry blocks; edges are
  SimEdgePath between real handles; the container shows ONE lane.
- The call panels are ASIDES — chat-bubble grammar in their OWN BAND
  below the workflow, separate boxes, born per runtime call. They are
  never drawn inside the container and never occlude a block.
- The outcomes record is the REAL SimTable (the verbatim Tables-grid
  port), also a separate aside box beside the panels, filling row-by-row
  in sync with the lane's Table block (two surfaces, one event).
- Fan-out is RUNTIME animation only: the container's ghost instances
  (header-only block pairs) separate during the run (the loops/swarm
  move, growth-machine precedent) and retract on settle. Never N static
  lanes.

**Macro arc:** capability-first (browser-agent lineage; growth-machine
shape). Assemble the chain → the run fires and fans → calls connect as
asides → one conversation followed closely (the mechanistic example) →
all three at once (money) → outcomes land in the table → bookend.

**Run count: 1.** A single traversal spans scenes 2→6. No recap run; the
bookend holds the settled state and re-pulses the three landed rows.

**Spectacle = the RUN + the asides filling.** Pulses, live rings, the
runtime fan, three de-phased streaming transcripts, the outcome stamps,
and the real Table filling. No invented UI anywhere.

## Grounding (product truth, `_reference/sim` staging, 2026-06-12)

- **AgentPhone block** (`apps/sim/blocks/blocks/agentphone.ts`): name
  `AgentPhone`, bgColor `linear-gradient(135deg,#1a1a1a,#0a2a14)`, glyph
  AgentPhoneIcon (icons.tsx port). Operation label verbatim **Create
  Call** (`create_call`); sub-block title verbatim **To Phone Number**
  (`toNumberCall`); `initialGreeting` placeholder: "Hi, this is Acme Corp
  calling about your recent order." Outputs include `status`
  (completed / in-progress / failed), `transcripts`, `durationSeconds`,
  `toNumber`. The block's own templates include the appointment-call
  flow (`place-outbound-call`, modules `tables/agent/workflows`).
- **Table block** (`apps/sim/blocks/blocks/table.ts`): name `Table`,
  bgColor `#10B981`, TableIcon. Operation label verbatim **Insert Row**
  (`insert_row`). Block rendered as "Log outcome".
- **Agent block** (`agent.ts`): bgColor var(--brand) `#33C482`,
  AgentGlyphW. Model value `claude-sonnet-4.6` follows the landing
  templates' authored model value (growth-machine grounding).
- **Parallel container**: identity from
  `subflows/parallel/parallel-config.ts` — SplitIcon, bgColor `#FEE12B`,
  dark glyph (the product's luminance rule). Anatomy = the docs
  preview-container-node port (loops-v1 / growth-machine rig). One inner
  lane + inner Start pill; distribution semantics from parallel.mdx
  (`<parallel.currentItem>` per instance).
- **Reference beat**: Call's `To Number | <parallel.currentItem>` — the
  wiring that makes one lane become N calls. DECLARED DEVIATION: the
  verbatim sub-block title is **To Phone Number** (`toNumberCall`,
  agentphone.ts); it is display-shortened to "To Number" because the
  full title forces the reference tag — the beat itself — to ellipsize
  at the product's 250-native block width (growth-machine precedent:
  human-shortened field labels). Swap cost: one string.
- **Outcomes table** = `SimTable` (verbatim table-grid port, module-2
  derivation), columns `to / outcome / status`. `status` values are the
  registry's own enum word `completed`. `outcome` values are
  config-template labels (`confirmed` / `rescheduled`). `to` values are
  masked numbers (authored stand-ins, declared below).
- **Call panels** = chat-bubble aside grammar (ChatPanel lineage; the
  hype2 panels the director graded GOOD). Ported from
  `hype/voice-agent:_parts.tsx` unchanged in content.

## The truth contract (carried from take 1 — it was graded good)

- Agent turns on screen = the registry's own `initialGreeting` /
  template placeholder language (authored config, never run output).
- Human turns = skeleton bars (run output → never invented words).
- Outcomes = green ✓ stamps with config-template labels; the real
  `status` value shown in the table is `completed` (registry enum).
- Destination numbers are skeleton-masked (`+1 415 ··· 4288`) — authored
  stand-ins, no real `toNumber` invented.
- The waveform is generated motion (the agent speaking), not data.
- Real durations / call ids / transcript text = ⟨pending⟩, not shown.

## Layout contract (the architecture fix — case 17 as amended)

ONE set piece on a 2400×1350 stage, viewed by fixed cameras (growth-
machine precedent; home cam shows the whole stage):
- **Top band — the workflow**, left→right on one axis, entirely in
  frame: Start → Campaign → Parallel container (ONE lane: Call → Log
  outcome, plus the inner Start pill).
- **Bottom band — the asides**, separate boxes with clear air below the
  container: three call panels (left) + the outcomes SimTable (right).
  No edge ever connects workflow to asides; sync is by timing only
  (panel births on call connect; table rows on Log-outcome blips).
- Nothing overlaps anything, at any camera, ever.

## Locked scene list (~70s visual minimum)

1. **the-workflow** (~9s) — [assemble]
   Camera on the top band. The chain assembles left→right: Start fades
   in, edge draws, Campaign (Messages | Pull tomorrow's appointments,
   Model | claude-sonnet-4.6), edge draws, the Parallel container
   "Call each" draws on holding its ONE lane: inner Start pill → Call
   (Operation | Create Call, To Phone Number | <parallel.currentItem>)
   → Log outcome (Operation | Insert Row, Table | outcomes). The
   <parallel.currentItem> tag glows once and releases. Hold the clean
   chain. Aside band empty.
   *Beat intent: a normal Sim workflow — except one block places phone
   calls.*

2. **the-run-fires** (~7s) — [run + runtime fan]
   The run fires: Start blips, pulse crosses edge 1, Campaign
   live-rings, pulse crosses edge 2 into the container; the container
   live-rings and the lane FANS — two ghost instance pairs (header-only
   Call + Log outcome) separate above and below the real lane, pill
   wires fanning with them. Camera eases back to the home framing,
   revealing the (still empty) aside band.
   *Beat intent: one run, distributed — the parallel makes one lane into
   three live calls.*

3. **calls-connect** (~8s) — [asides are born]
   Below the workflow, in their own band: three call panels pop in
   staggered (one per connected call), each a separate box — masked
   destination, pulsing live dot, the registry greeting bubble typing
   in, waveform springing to life. At the right, the outcomes table
   appears: the real SimTable, header row only, empty. Workflow above
   stays clean and live.
   *Beat intent: each call is a real, live phone conversation — and
   there's a record waiting to be filled.*

4. **one-conversation** (~12s) — [the mechanism, lean-in]
   Camera leans toward panel 1 (workflow stays visible above, dimmed;
   panels 2–3 dim). The turn loop streams: agent speaks (waveform
   pulses) → flatlines → the human reply rises as skeleton bars →
   waveform springs back for the agent's authored confirmation line.
   The live dot keeps pulsing.
   *Beat intent: it speaks, hears the answer, and responds — turn by
   turn, a real conversation.*

5. **three-at-once** (~14s) — [THE MONEY SHOT begins]
   Pull back to the home framing: all three panels streaming
   SIMULTANEOUSLY, de-phased (different waveform seeds + turn offsets)
   — three live conversations shimmering out of sync, three live dots,
   the workflow's rings still on above, the empty table waiting at the
   right. Hold the alive frame.
   *Beat intent: the whole campaign is talking at once.*

6. **outcomes-land** (~12s) — [accumulation, two surfaces one event]
   Calls resolve staggered 1→2→3: a panel's live dot goes solid green,
   its waveform flatlines, a green ✓ outcome stamp lands (confirmed /
   rescheduled / confirmed) — and IN SYNC the lane's Log outcome block
   blips and a row drops into the SimTable (to / outcome / status =
   completed). Three rows accumulate. Container settles; ghosts begin
   to retract.
   *Beat intent: every call ends as a row you can act on.*

7. **the-campaign-ran** (~8s) — [settle / bookend]
   The settled frame: clean chain at rest (fan retracted to the single
   lane, rings released), three quiet panels with their ✓ stamps, the
   table full. Camera eases back ~3%. Each table row takes one quiet
   sequential pulse, 1→3 — the run retold without re-running.
   *Beat intent: one run, three real phone calls, three outcomes
   recorded.*

## Continuity contract

- One set piece owned by `layout.ts`; scenes render one `<Stage/>`
  (`scenes/_rig.tsx`) and differ only in state props + camera. Nothing
  relayouts, ever.
- Boundary carries: 1→2 chain at rest → run fires; 2→3 fan out + home
  cam carried; 3→4 panels + empty table carried (cam lean is the only
  change); 4→5 transcripts carried at their progress marks; 5→6 all
  live carried; 6→7 three rows + stamps carried, fan retraction
  completes before the cut. All transient state (pulses, blips, glows)
  absorbs before its scene boundary.
- Phase A note: scenes are static end-state frames (static-frames-first
  workflow). Scene 6's Phase-A frame is its mid-state (the money still:
  row 1 landed, lane 2 stamping, lane 3 live); Phase B animates 6 from
  its enter state (all live, 0 rows) to its exit (3 rows, all ✓) and
  re-verifies every boundary pair with verify-boundaries.

## Verification

- `bun run lint` clean; stills opened and LOOKED AT for every scene.
- Phase B: `bun scripts/verify-boundaries.ts voice-agent-v2`
  (structural zero), boundary stills at every cut, glide midpoints.
