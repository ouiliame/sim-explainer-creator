# Module 7 — Logs & Debugging

Conceptual spine for the three-video Logs & Debugging module. Remotion owns the
**concept beats**: the "logs are ground truth" framing, the run-as-timeline
diagram with a failed block, the inspector anatomy, the trace-backward debugging
loop, and the Mothership-assisted-but-you-verify recap. Everything that is
"open Sim, click the block, read the real panel, run it" is a **screen
recording** intercut between these beats — the live Logs UI is never rebuilt in
Remotion. Each video is a short animated wrapper around its demo.

Total animated concept time across the module ≈ 68s. The screen-rec demos carry
the rest of the runtime.

Shared vocabulary reused: `ObjectNode` (logs, workflow, agent, tool kinds),
`WorkflowChain`, `WorkspaceFrame`, theme `COLORS.error` for the failed state,
the 5 primitives (`FadeIn`, `SlideIn`, `Highlight`, `Zoom`, `Expand`).

New shared components this module introduces (see per-scene notes):
- **RunTimeline** — a horizontal sequence of run blocks, each with a status
  (`ok` / `failed` / `pending`) driving border + glyph color; the failed block
  renders in `COLORS.error`. Generalizes `WorkflowChain` from "design-time
  chain" to "a run with outcomes." Used across all three videos.
- **BlockInspector** — a side panel showing a selected block's anatomy:
  Input / Output / Error / Timing / Model·Tool rows. Static layout; rows reveal
  via `FadeIn`/`SlideIn`.
- **ChecklistCard** — a titled card of question rows that check on, one per
  beat. Used for the "what logs answer" and "debugging checklist" beats.

---

## Locked scene list

### Video 1 — Logs Tour (animated wrapper ≈ 24s)

1. **why-logs** (6s) — A `workflow` ObjectNode runs; output comes back wrong/empty (a red question-mark badge). One line: "When a run does something you didn't expect, logs show what actually happened." Establishes logs as a normal part of building, not an advanced surface. Components: `ObjectNode` (workflow), `Highlight`, `FadeIn`. Object kinds: workflow, logs.
2. **run-is-a-timeline** (7s) — The run expands into a left-to-right sequence of blocks via `RunTimeline`. Each block flips to `ok` (green check) in order; the last one flips to `failed` and turns red. "A run is a sequence of blocks. Most succeed — this one failed." Components: **RunTimeline** (new), `Expand`, `Highlight`. Object kinds: agent, tool, logs.
3. **block-anatomy** (6s) — The failed block lifts out; a `BlockInspector` panel slides in beside it showing Input / Output / Error / Timing / Model·Tool. Rows reveal one at a time. "Click any block to see what it received, what it returned, and how long it took." Components: **BlockInspector** (new), **RunTimeline** (dimmed via `Highlight active={false}`), `SlideIn`. 
4. **what-logs-answer** (5s) — A `ChecklistCard` reveals the five questions: What ran? In what order? What did each block receive? What did each block return? Where did it fail? Components: **ChecklistCard** (new), `FadeIn`. 
5. **[SCREEN-REC] logs-tour-demo** — Open Sim → run list → select a run → real timeline → click a block → read the actual input/output/error/timing panel. Slots after scene 3 (anatomy) and is recapped by scene 4. NOT animated.

### Video 2 — Debugging Strategies (animated wrapper ≈ 26s)

6. **dont-guess-trace** (6s) — The `RunTimeline` reappears with the failed (red) block. A "symptom" tag sits on the failed block; a back-arrow traces to an earlier block where the data actually went wrong (highlighted amber). "The failed block is the symptom — not always the root cause. Don't guess. Trace the data." Components: **RunTimeline** (new, reused), `Highlight`, `SlideIn`. 
7. **debugging-checklist** (6s) — `ChecklistCard` reveals the trace questions: Which block failed? What input did it receive? Was that input expected? Did the bad data come from earlier? What changed after the fix? Components: **ChecklistCard** (new, reused), `FadeIn`.
8. **data-stopped-matching** (8s) — Two adjacent blocks on the timeline; a small data token leaves block A shaped one way (e.g. `{...}` object) and arrives at block B which expected a different shape (e.g. plain string) — mismatch flashes red at the seam. "Debugging usually means finding where the data stopped matching what the next block expected." The module's emphasis line, drawn literally. Components: **RunTimeline** (new), `ObjectNode` (agent, tool), `Highlight`, `Zoom`. 
9. **failure-types** (6s) — A short stacked list of common failure types fades in as labeled chips: missing input · wrong field reference · string vs object · nested field missing · empty agent message · tool/API failure · structured-output mismatch. Each is a flavor of the same mismatch. Components: `FadeIn`, `Highlight`. (Reuses ChecklistCard styling.)
10. **[SCREEN-REC] fix-and-rerun-demo** — One failing workflow in Sim: inspect failed block → trace backward → fix the reference → rerun → compare failed vs fixed run, confirm output is correct (not just error-free). Slots after scene 8. NOT animated.

### Video 3 — Debugging with Mothership / Copilot (animated wrapper ≈ 18s)

11. **logs-are-ground-truth** (6s) — `ObjectNode` (logs) sits center as the source of truth; a `mothership` node connects to it with a "reads the run" line. "Logs are ground truth. Mothership reads them — it doesn't replace them." Components: `ObjectNode` (logs, mothership), `SlideIn`, `Highlight`. Object kinds: logs, mothership.
12. **good-prompts** (6s) — Three prompt chips slide in next to the Mothership node: "Explain why this run failed." · "Inspect the logs and find the bad input." · "Why is this field undefined?" Components: `FadeIn`, `SlideIn`. (Reuses ChecklistCard styling for the chips.)
13. **you-still-verify** (6s) — The loop closes: Mothership suggests a fix → workflow edits → **rerun** → you check the result. A verification gate (check icon) sits on "you", echoing the intro's exploration loop. "Mothership helps interpret and fix. You verify by rerunning and inspecting the result." Components: `ObjectNode` (mothership, workflow, logs), `Expand`, `Highlight`. 
14. **[SCREEN-REC] copilot-debug-demo** — Ask Mothership/Copilot in Sim to explain a failed run, watch it read the logs, suggest and apply a fix, rerun, then the user verifies the right block changed and downstream blocks still work. Slots after scene 11. NOT animated.

Animated totals: V1 ≈ 24s, V2 ≈ 26s, V3 ≈ 18s → **≈ 68s** of concept beats across the module.

---

## Narration (reference)

### Video 1 — Logs Tour

> Sometimes a workflow runs and does something you didn't expect — it fails, or the output just looks wrong. Logs are where you see what actually happened.
> A run is really a sequence of blocks. Most of them succeed — but here, one failed.
> Click any block and you can see exactly what it received as input, what it returned as output, the error if there was one, how long it took, and which model or tool it used.
> So logs answer five plain questions: what ran, in what order, what each block received, what each block returned, and where it failed.
> Let's open a real run and look.

### Video 2 — Debugging Strategies

> When something breaks, the instinct is to guess. Don't. Trace the data instead. The block that turned red is the symptom — the actual problem is often a block or two upstream.
> So work a short checklist: which block failed, what input did it receive, was that input what you expected, did the bad data come from an earlier block — and after you fix it, what changed.
> Almost every failure is the same shape: the data stopped matching what the next block expected. One block returned an object, the next one wanted a string. A field the next block referenced wasn't there.
> Missing input, wrong field reference, string versus object, a nested field that's gone, an empty agent message, a tool that failed, a structured output that didn't match — they're all flavors of that one mismatch.
> Let's debug one for real: inspect, trace backward, fix, rerun — and confirm the output is actually correct, not just error-free.

### Video 3 — Debugging with Mothership / Copilot

> Logs are the ground truth. Mothership can read a run for you — but it doesn't replace the logs, it interprets them.
> Give it a clear job: explain why this run failed, inspect the logs and find the bad input, ask why a field is undefined.
> It can read the run, explain the error, suggest a fix, even edit the workflow. But you still verify — rerun it, check the right block changed, and make sure the output matches what you actually wanted.
> Logs are ground truth. Mothership helps you interpret and fix. You confirm by rerunning and inspecting the result.
