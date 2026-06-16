# Module 7 — Logs (v2 take) — `module-7-logs-v2`

A NEW TAKE, registered alongside the original `module-7-logs` (which stays
renderable, untouched). One ~62s concept video, not the old three-video
wrapper structure.

## The one idea (thesis)

**Every run leaves a complete record — and debugging is reading that record
backwards from the symptom.** (This is verbatim the docs' own framing:
`apps/docs/content/docs/en/logs-debugging/index.mdx` — "A log is the recorded
trace of one workflow run, and debugging is reading that trace backward from
the block that failed.")

## Batch-mode assumptions (no interactive gates this build)

- **Audience:** has watched the workflows + agents intros. They know the
  triage chain, SimBlock language, WirePulse/ResolvedTag, and have already
  seen the OutputBundle once (module-5 v3 "the-run-record", 8s). This video
  goes to *orientation depth on the record itself* — the thing module-5 only
  glanced at.
- **Example:** the REAL beaming-polaris run, **as actually run** —
  Start → Triage → BuildRow → LogTicket
  (`src/videos/module-5-agents/demo-corpus/triage-run.md`). I deliberately
  use the live 4-block chain (function + table terminal), NOT module-5's
  Slack-ending video variant, because (a) every duration/value here is real
  with zero stand-ins, and (b) four spans make a better trace than three.
- **All-green run, no manufactured failure.** We have no real failed-run
  artifact, and inventing one is forbidden. The trace-backwards mechanic is
  taught on a green run as *provenance reading* ("where did this value come
  from"), which is the identical mechanic the docs' debugging loop uses
  (read input → walk back to source). A real failed-run artifact for a
  follow-up beat is ⟨pending⟩ (see Grounding).
- **Deliberately not taught:** alerting, retention, log filtering UI,
  snapshots, Mothership-assisted debugging (old take's video 3 — out of
  scope per brief).
- **Anchor mined from old module-1 v1 / curriculum:** "If something fails,
  trace backward" / "Debugging a workflow means tracing data backward from
  the failure." Used at orientation depth as the centerpiece scene.

## Grounding note — every value on screen

From `src/videos/module-5-agents/demo-corpus/triage-run.md` (live run,
2026-06-10, beaming-polaris workspace):

- Log rows + durations: Start **32ms** · Triage **12225ms → "12.2s"** ·
  BuildRow **115ms** · LogTicket **111ms**.
- Triage output: content "billing — Alex Johnson charged twice…" (same
  condensation module-5 v3 ships), tokens **5074 / 431**,
  model `claude-sonnet-4-6`, toolCalls `[0] customerLookup 375ms · 1 account`,
  `[1] knowledge_search 457ms · 0 results`, `[2] knowledge_search 540ms · 0 results`.
  (The run's real cost $0.02386 was in the first cut and was REMOVED in the
  fix cycle: the cost node pushed the panel past the frame bottom, and the
  curriculum says keep light on costs. The tree is now exactly module-5's
  record shape: content · tokens · toolCalls.)
- Run input: "I was charged twice for the Pro plan this month — please fix
  this. My account email is alex.johnson@zengraph3282.ai".
- Block configs: Start input field `message`; Triage Messages
  `Classify: <start.message>`, model claude-sonnet-4-6, tools Docs/CRM/Search
  (module-5's established chips); BuildRow = function assembling
  `{ message, category, summary, created_at }`; LogTicket = Insert Row into
  `support_tickets`, Data `<buildRow.result>`.
- Condensations (noted, not invented): BuildRow's Code row shows
  `return { message, category, … }` (the corpus describes the function as
  assembling exactly that object; the literal source text is ⟨pending⟩).
  BuildRow result preview `{ category: "billing", … }` — category value is
  real; the full object's `created_at` literal is ⟨pending⟩ so it is never
  shown expanded.
- ⟨pending⟩: a real *failed* run of this workflow (e.g. a broken reference)
  would unlock a "the ring turns red, same read works" coda. Not built —
  nothing invented.

## Set piece + vocabulary

ONE set piece for all five scenes, owned by `layout-v2.ts`:

- **The ticket chain** — the real 4-block workflow, SimBlocks at module-1/5
  metrics, scaled 0.86 as a unit (4×375px blocks don't fit at 1×), pitch 510.
  It starts frame-center (scene 1), glides ONCE to the top of frame
  (scene 2) and never moves again.
- **The record panel** — `OutputBundle` (the docs' own run-inspector
  miniature; THE record vocabulary) at ×1.62, centered below the chain.
  Persistent from scene 2 to the end. Log-row selection, Output/Input tab
  emphasis, and tree contents are the only things that change.
- Archetypes: assemble + run (sc 1) → record-panel (sc 2) → record-panel
  with zoom-aside synchrony (sc 3) → the trace = record-panel + camera-less
  backward walk, panel↔chain synchrony only (sc 4) → settle/bookend (sc 5).
- **Run economy: ONE real traversal** (scene 1) — it is the run the whole
  record describes. Scene 5's close is a *recap pulse*: log rows pulse
  top→bottom while their blocks ring green left→right, in sync — re-reading
  the SAME run, not running again. No other traversals.
- Product state language only: blue ring = selected/live, green = ok,
  0.35 dim = not focal, ResolvedTag for every reference, values resolve in
  rows, wires carry only light. No words for states, no sentences anywhere.

## Locked scene list (62s)

1. **a-run-happens** (11s) — assemble + run. The four blocks fade in
   staggered, edges draw on. One run crosses: the real charged-twice message
   resolves into Start's Input row, pulse, Triage live-rings (~1.6s — the
   block where the real 12.2s went), pulse, BuildRow live blip, pulse,
   LogTicket green blip. Everything reverts to template; chain centered,
   neutral.
   *Beat intent: a run just happened — and from out here it's already over.*
2. **the-record** (10s) — record-panel. The chain glides up and dims to
   0.35; the OutputBundle rises beneath it. The four log rows reveal in run
   order, each with its REAL duration; Triage's row arrives selected and its
   output tree reveals (content · tokens · toolCalls). The "12.2s"
   duration text glows briefly — the record already shows where the time
   went.
   *Beat intent: the run wrote itself down — every block, in order, timed.*
3. **what-it-really-did** (12s) — record-panel + synchrony. The toolCalls
   array is the focal node: its key blends blue and each of the three call
   rows highlights in turn while the matching tool chip on the dimmed Triage
   block rings at the same moment (CRM ↔ customerLookup, Docs ↔ the two
   knowledge_searches). Tokens get a final beat of key-glow.
   *Beat intent: the run looked instant from outside — the record kept
   everything the block actually did.*
4. **read-it-backwards** (20s) — THE centerpiece (the old v1 "trace
   backward" idea at orientation depth). Selection jumps to **LogTicket**
   (its block undims + blue-rings above) and the **Input** tab takes the
   emphasis: `data: <buildRow.result>` glows and resolves to
   `{ category: "billing", … }` — "billing" holds a provenance glow. The
   reference names its producer, so selection steps LEFT to **BuildRow**:
   its input `content: <triage.content>` resolves to "billing — Alex
   Johnson charged twice…". Step LEFT to **Triage**: its input
   `messages: Classify: <start.message>` resolves to the real customer
   message. Step LEFT to **Start**: tab emphasis returns to Output —
   `message`: the message itself. The blue ring has walked the whole chain
   right-to-left; the value's entire ancestry was in the record. Everything
   reverts: selection back on Triage, Output tab, full tree, uniform dim.
   *Beat intent: pick any value and read the record backwards — which block
   produced it, what that block read — until you reach the source.*
5. **every-run-writes-one** (9s) — settle/bookend. The chain undims to full.
   Then the recap pulse: log rows pulse top→bottom while their blocks ring
   green left→right in causal order — the list IS the run. Gentle settle;
   hold the balanced final frame (chain above, record below).
   *Beat intent: every run leaves this. Nothing about a run is a mystery.*

## Continuity contract (boundaries)

- **1→2:** chain center-framed, template values, no panel, no rings. Scene 2
  opens identical, then performs the single glide (interpolated, never cut).
- **2→3:** chain top + dim 0.35; panel up; rows all revealed; Triage row
  selected; Triage tree fully revealed; Output tab emphasis; zero highlights.
- **3→4:** identical to 2→3 exit (all toolCall highlights and chip rings
  reverted before scene 3 ends).
- **4→5:** identical again — scene 4 reverts its selection walk (back to
  Triage, Output tab, full tree) before it ends.
- The panel's body height is pinned (`minBodyH`) to the tallest tree so the
  panel never changes outline while trees dip-swap.
- Verified with `bun scripts/verify-boundaries.ts module-7-logs-v2`.

## Component changes (all additive, back-compat)

- `OutputBundle`: `inputTab?: 0..1` (Output↔Input header emphasis blend),
  `minBodyH?: number` (pin values-column height), `OutputLogRow.selected`
  widened to `boolean | number` (animatable selection), `OutputNode.value`
  widened to ReactNode (lets a traced value glow / hold a ResolvedTag).
- `ResolvedTag.value` widened to ReactNode (same reason).
- Module-local `scenes/_v2.tsx`: the 4-block `TicketChain`, `runBeats4`,
  function/table white glyphs. Nothing in the v1 take is touched.

## Narration

NOT drafted here (always William's). Beat intents above are the narration
sheet's skeleton; the closing image is the chain + its record at rest.
