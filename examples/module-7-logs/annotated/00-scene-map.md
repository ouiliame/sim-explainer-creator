# Scene map — module-7-logs (the routine scenes)

The distinctive pattern of this module — the **run record landing
entry-per-block** and the **backward trace** — lives in the v2 take's scenes 2,
3, and 4, annotated in full depth in `02-the-record.md`, `03-what-it-really-did.md`,
and `04-read-it-backwards.md`. This file completes the arc: the v2 bookend scenes
and the original v1 take's eleven concept beats, one paragraph each (intent +
any reused mechanic). Read it to see how the centerpiece is set up and paid off,
and how the same vocabulary recurs across the wider module.

The module ships as **two compositions** registered side by side in `Root.tsx`:
`module-7-logs` (v1, the eleven concept beats below, the three-video curriculum
wrapper) and `module-7-logs-v2` (the single ~62s take built around the record).
Source: `../../../../projects/sim-explainers/src/videos/module-7-logs/`.

---

## v2 take — the bookends of the record story

**1 · `a-run-happens` (11s) — archetype: assemble + run.**
The set-up for the whole video. The four real blocks (Start → Triage → BuildRow
→ LogTicket) fade in staggered (`blockIn`, 0.45s apart), edges draw on between
settled neighbors (`edgeIn`), then **one run crosses** — the single traversal the
entire record will describe. `runBeats4` choreographs it: the charged-twice
message resolves into Start's Input row, a `WirePulse` walks each edge, Triage
holds a ~1.6s live ring (the block where the real 12.2s went), BuildRow blips,
LogTicket's `Data` resolves to the category and settles green. Then everything
reverts to template, chain centered and neutral. The beat the rest of the video
answers: *a run just happened — and from out here it's already over.* Run
economy is the load-bearing decision: there is exactly **one** run, and scenes
2–5 are all re-reads of it, never fresh runs. Exit: chain center-framed
(`glide={0}`), template values, no panel, no rings — scene 2 opens identical and
performs its single glide.

**5 · `every-run-writes-one` (9s) — archetype: settle / bookend.**
The pay-off. The chain undims to full (`undim` ramp), then the **recap pulse**:
each log row pulses top→bottom (`rowPulse(i)`) while its block rings green
left→right (`blockOk(i)`), in causal order — `beat(i) = 2.2 + i*0.75`. This is
the same two-surface synchrony as scenes 3–4, now used to assert *the list IS the
run*: re-reading the same run one last time, not running again (no `WirePulse`,
no traversal). Triage's row stays selected (the held view from scene 4); the
green rings hold to the final frame. The closing image is the thesis at rest:
the chain above, its record below. Beat intent: *every run leaves this; nothing
about a run is a mystery.* Enter contract matches scene 4's exit exactly (Triage
selected, Output tab, full tree, uniform dim).

---

## v1 take — the three-video curriculum (eleven concept beats)

The v1 composition predates the record set piece; it teaches the *debugging
curriculum* across three notional videos, with the live screen-recording beats
(logs-tour-demo, fix-and-rerun-demo, copilot-debug-demo) deliberately omitted —
those are screen recordings, not animated. The animated beats:

### Video 1 — Logs Tour

**`why-logs` (6s).** A workflow runs; the output comes back wrong — a red "?"
badge resolves as the block border greys → error red. Logs sit dimmed and ready
as *the place to find out what happened*. Plants the question the module answers.
Reuses the state-by-color rule: a red badge, never the word "wrong."

**`run-is-a-timeline` (7s).** The run expands into a left→right sequence of
blocks, each flipping `ok` (green) in order, the last flipping `failed` (red).
The same "a run is an ordered sequence of timed blocks" idea the v2 record makes
literal — here as a bare timeline. Color is the only state language.

**`block-anatomy` (6s).** The failed block lifts out of the dimmed timeline and a
`BlockInspector` panel slides in beside it; rows reveal one at a time. The
single-focal-element + dim-the-rest rule, and the same "select a block, inspect
it beside the chain" geometry the v2 `OutputBundle` formalizes.

**`what-logs-answer` (5s).** The five plain questions a log answers, checked one
per beat. A list-reveal aside; cadence carries it. (One of two checklist-style
beats — see `debugging-checklist`.)

### Video 2 — Debugging Strategies

**`dont-guess-trace` (6s).** The timeline returns with the failed (red) block; a
"symptom" tag sits on it and a back-arrow traces upstream to the root-cause
block, highlighted amber. This is the v1 ancestor of the v2 centerpiece — the
*trace-backward* idea in its first, arrow-drawn form. The v2 take's lesson is
precisely that you can do this *without* the arrow, by resolving references; diff
this against `04-read-it-backwards.md` to see the upgrade.

**`debugging-checklist` (6s).** The trace questions, checked one per beat. Same
mechanic as `what-logs-answer` — a one-per-beat checklist reveal; keep the
cadence consistent with its sibling.

**`data-stopped-matching` (8s).** Two adjacent blocks; block A emits an object
token, block B expected a string, and the mismatch flashes red at the seam. The
canonical "type mismatch between blocks" failure, shown as a colored seam — no
words like `TYPE ERROR`. The longest v1 beat because it has to establish two
blocks, the wire, and the mismatch.

**`failure-types` (6s).** Common failure flavors fade in as chips in a two-column
snap grid — each is "the same mismatch wearing a different hat." A taxonomy
aside; the snap-grid layout and uniform chips keep it from reading as a
word-wall.

### Video 3 — Debugging with Mothership

**`logs-are-ground-truth` (6s).** Logs sit center as the source of truth;
Mothership connects with a "reads the run" line — *it reads, doesn't replace.*
Establishes Mothership's position, which the next two beats hold for continuity.
The connector line here is acceptable because it encodes a relationship the
product has (Mothership reads the run); contrast the v2 rule against decorative
connectors.

**`good-prompts` (6s).** Three prompt chips slide in next to the Mothership node,
which **stays exactly where `logs-are-ground-truth` left it** (continuity — the
persistent-element rule). A practical aside on prompting the debug assistant.

**`you-still-verify` (6s).** The loop closes: Mothership suggests → Workflow
edits → Rerun → You verify, with a check-gate on "You" echoing the intro loop.
The bookend; the verify gate is the curriculum's "trust but verify" note. Ends on
a settled loop so the composition can stretch to narration.

---

## What recurs across the whole module

- **A run is an ordered, timed sequence of blocks** — `run-is-a-timeline`
  sketches it; the v2 record (`02-the-record`) makes it the literal log list.
- **Trace backward from the symptom** — `dont-guess-trace` does it with an arrow
  on a failed run; `04-read-it-backwards` does it by resolving references on a
  green run, which is the same mechanic done in product grammar instead of
  drawn annotation.
- **State by color, never by word** — red badges/borders for failure, green for
  ok, blue for selected/active, dim for non-focal. Module-wide, both takes.
- **Select-and-inspect-beside-the-chain** — `block-anatomy`'s `BlockInspector`
  is the informal version; the v2 `OutputBundle` is the formal, ported version.
- **Continuity by persistent element** — Mothership holding position across
  `logs-ground-truth`/`good-prompts`/`you-still-verify` in v1; the single
  glide-once set piece across all of v2.
