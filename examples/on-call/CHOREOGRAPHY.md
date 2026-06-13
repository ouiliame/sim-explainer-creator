# on-call — choreography notes

- **verdict:** hype3 fleet take (the honest retake of hype2's case-17-graded
  `on-call`); not yet individually director-graded. Choreography verified:
  all 6 boundary pairs IDENTICAL, key-beat stills reviewed.
- **branch:** `hype3/on-call` · **comp:** `on-call-v2` · **duration:** 135.3s
  (7 scenes; every scene's final length = its VO length, all longer than the
  authored visual minimums 11/19/12/13/15/16/8 — extend-only).
- **run economy:** 6 runs, one per webhook alert. Run 1 followed
  mechanistically across two freeze-cuts (scenes 3→5); runs 2–6 are the
  accelerating cadence (scene 6), each one's only content a DIFFERENT table
  row flipping. The run record on screen stays run 1's.
- **rig:** one set piece (`scenes/_rig.tsx` Stage) — workflow Sentry Alerts
  webhook → Triage agent (Sentry/Datadog/GitHub tool chips) → {Slack,
  Linear, PagerDuty} fan on the left; right rail = incidents `SimTable`
  (top) over run 1's `OutputBundle` record (bottom). Scenes differ ONLY in
  state props + camera. Shared beat math in `scenes/_beats.ts` (`ramp`,
  `pulse`, `flipAt`). Note: `ramp` defaults to LINEAR; easing is passed
  explicitly where it matters (entrances `EASING.out`, camera `EASING.inOut`).

All times below are seconds INSIDE the scene (`t = frame/fps`). Scene
start/length from `public/vo/on-call-v2/manifest.json`.

## The one idea

An on-call agent is one real webhook-triggered workflow: the alert arrives,
an agent READS the monitoring stack (tool calls landing in the run record as
they happen) and CREATES the records (Slack post, Linear ticket, PagerDuty
page) — and the incidents table's status column drains firing → triaged →
assigned, row after row, all night.

## Scene 1: the-queue (0–15.4s)

INTENT: six incidents are firing at 3 a.m.; the status column is the job.
CAMERA: locked on `CAM_TABLE` (table hero, s=1.04). No move — the problem
object gets a still frame.
CHOREOGRAPHY:
- Table chrome fades in: `ramp(t, 0.3, 0.9)` (linear).
- Six rows stagger in at **0.3s pitch**: row r reveals over
  `ramp(t, 1.0 + 0.3r, 1.5 + 0.3r)` — last row lands at 3.3s.
- The status column takes ONE collective product selection-tint pulse:
  `pulse(t, 6.0, 9.0)` (trapezoid: 0.35s rise, hold, 0.6s release) — timed
  under the narration's "each one needs the same first response". The pulse
  RELEASES before the cut so boundary 1→2 is clean.
HOLDS: 9.6→15.4 (~5.8s) fully static — all-firing table, nothing moving.
Living-motion pattern: **none (static end-hold — dead)**. This exceeds the
~3s dead-hold cap; the extend-only VO sync stretched a 11s visual to 15.4s
and the slack all pooled at the end. If you imitate this scene, either
re-pace the stagger/pulse to span the narrated time or accept the flag.

## Scene 2: the-responder (15.4–39.9s, 24.5s)

INTENT: this is the whole machine — webhook in, agent reads via tools,
three integrations carry the findings out.
CAMERA: `camLerp(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.5, 0, 1, EASING.inOut))`
— ease out to the home framing FIRST (while the thesis line plays), then
assemble into the revealed space. The camera move exists to hand the frame
from the problem object to the machine.
CHOREOGRAPHY (assemble in flow order, each part as narration names it —
edge draws, THEN block fades, alternating):
- Webhook fades 4.4–5.0 (`EASING.out`); edge 1 draws 6.2–6.8; agent fades
  7.4–8.0.
- The agent's Tools row grows in 10.2–10.7 (`toolsRowReveal` — height
  reserved first, no pop), then the three chips width-grow at **0.9s
  pitch**: Sentry 10.8–11.25, Datadog 11.7–12.15, GitHub 12.6–13.05 — each
  as the narration says its name. The second chip line opens 12.55–13.0
  (`toolsWrapReveal`) so GitHub wraps without a height jump.
- The fan: three edges draw at **0.9s pitch** (14.8–15.4 / 15.7–16.3 /
  16.6–17.2), each terminal fading in 0.7s after its edge starts (15.5–16.1
  / 16.4–17.0 / 17.3–17.9) — edge leads, block follows, top to bottom.
HOLDS: 17.9→24.5 (~6.6s) static assembled chain. Living-motion pattern:
**none (static end-hold — dead)**. Same extend-only pooling as scene 1.

## Scene 3: alert-in (39.9–55.3s, 15.4s) — run 1 starts, freeze-cut out

INTENT: one alert in; the run has begun and is already being recorded.
CAMERA: locked `CAM_ALL`. The event is small; the camera doesn't move.
CHOREOGRAPHY:
- The webhook blips live ON ITS OWN: `highlighted` 1.2–1.9, then `state:
  "ok"` from 1.9 (it ran in 18ms — the blip is short on purpose).
- **Two-surface sync (the scene's one trick):** the Messages tag glows
  `pulse(t, 1.5, 2.3, 0.3, 0.4)` and resolves `ramp(t, 1.95, 2.45)` to row
  3's incident title — while table row 3 takes the product selection
  highlight `pulse(t, 1.95, 4.2, 0.35, 0.6)`. Both keyed at **1.95** — the
  alert and its row are linked by synchrony only, no connector line.
- `WirePulse` crosses edge 1: `ramp(t, 6.5, 7.2)`; the Triage live ring
  comes ON at 7.15 (the ring lights as the pulse is absorbed).
- The record fades in below the table 10.0–10.7 with its first log row
  landing 10.5–10.9 (Sentry Alerts · 18ms) — "Sim starts recording the run."
HOLDS: 10.9→15.4 (~4.5s) frozen on the freeze-cut state: webhook ok, Triage
blue ring ON, tag resolved, record one row deep. Living-motion pattern:
**end-anchored hold** — the held states are open-ended booleans
(`highlighted: t >= 7.15` has no off edge), so the freeze-cut carry
survives any narrated duration. The held live ring is what keeps the hold
readable as "work in progress", not dead air.

## Scene 4: reading-the-signals (55.3–77.3s, 22s) — same run, freeze-cut both ends

INTENT: the agent investigates like an engineer — Sentry issue, Datadog
logs, latest GitHub commit — and every read lands in the record AS IT
HAPPENS.
CAMERA: `camLerp(CAM_ALL, CAM_READ, ramp(t, 0.3, 1.7, 0, 1, EASING.inOut))`
— lean toward the agent + record because the next 10 seconds are a
conversation between exactly those two surfaces.
CHOREOGRAPHY:
- Triage's own log row lands 0.8–1.2 (selected — the output tree is ITS
  output), and its duration **counts up**:
  `triageDur = (9.8 * ramp(t, 1.2, 12.5)).toFixed(1) + "s"` — a live
  number ticking for 11.3s, landing exactly on 9.8s. This is the scene's
  ambient motion; it makes the whole read sequence feel like elapsed time.
- Three read beats at **3.0s pitch**, `B = [4.5, 7.5, 10.5]`, each a
  two-surface sync — chip ring ↔ record row, SAME beat time b:
  - chip ring: rises b−0.5→b−0.2, releases b+0.8→b+1.5;
  - toolCalls row lands: `ramp(t, b, b+0.4)`;
  - row highlight: rises b→b+0.3, releases b+0.7→b+1.5.
  The ring leads by 0.5s (the call goes out), the row lands ON the beat
  (the result comes back). Order: Sentry, Datadog, GitHub — the order the
  narration names them.
HOLDS: ~12.5→22 (~9.5s) on the freeze-cut state (agent ring live, three
chips settled, three toolCalls rows landed). Living-motion pattern:
**end-anchored hold** (open-ended `highlighted`, count-up clamped at its
final value). Honest flag: after the count-up lands at 12.5 nothing moves
for 9.5s — the longest semi-dead stretch in the video; only the live ring
says "still running".

## Scene 5: creating-the-records (77.3–100.9s, 23.6s) — run 1 completes, THE MONEY SHOT

INTENT: three records created — diagnosis to Slack, ticket in Linear, page
via PagerDuty — and row 3 flips firing → triaged → assigned.
CAMERA: `camLerp(CAM_READ, CAM_ALL, ramp(t, 0.2, 1.6, 0, 1, EASING.inOut))`
— pull back to the whole frame because the payoff spans workflow + table +
record at once.
CHOREOGRAPHY:
- The agent settles: live until 2.2, then `state: "ok"`; `content` reveals
  2.3–2.8 and `tokens` 2.6–3.1 (**0.3s stagger** — outputs land as a pair,
  not a block).
- **Triple-pulse fan:** ONE shared progress value `ramp(t, 3.4, 4.2)`
  drives all three `FanPulse`s — three lights leave the agent's source
  handle together (one event, three edges). Each fan edge's highlight
  rises 3.4–3.8 and releases as its terminal goes ok.
- Terminals at **2.6s pitch**, `OK = [5.4, 8.0, 10.6]` (Slack, Linear,
  PagerDuty — narration order): live window OK−0.9→OK, `ok` at OK, log row
  lands `ramp(t, OK, OK+0.4)` — block settles ↔ record row, same instant.
- **The status flip is synced to the run's REAL records** via
  `flipAt(t, T1=5.5, T2=10.7)`: triaged lands 0.1s after Slack's ok (the
  summary exists), assigned 0.1s after PagerDuty's ok (the page assigns).
  Flip shape (from `_beats.ts`): text dips to 0 within ±0.14s of T
  (dip-swap), green tint spikes to 0.85 over 0.12s then decays over 1.6s
  to the 0.35 residue. The residue persists to the final frame.
- The Messages tag REVERTS to its template `ramp(t, 13.4, 13.9, 1, 0)` —
  run 1 is over; references outlive runs.
HOLDS: 13.9→23.6 (~9.7s) on the settled run-1 frame (chain green, record
full, row 3 assigned + residue). Living-motion pattern: **end-anchored
hold**, earned (it's the payoff breath) but long — the tint decay is the
last motion and it's done by ~12.3.

## Scene 6: the-queue-drains (100.9–120.3s, 19.4s) — runs 2–6, the cadence

INTENT: every alert gets the same treatment; the queue drains itself.
CAMERA: steady `CAM_ALL` — multiplicity is the spectacle; the camera gets
out of the way.
CHOREOGRAPHY (the accelerating-cadence machine — copy this shape):
- Five compressed runs: `STARTS = [1.0, 4.6, 7.6, 10.0, 11.9]`,
  `DURS = [3.2, 2.7, 2.2, 1.8, 1.6]` — start gaps shrink 3.6→3.0→2.4→1.9
  and each traversal is shorter than the last. Runs never overlap, so
  per-run values compose with `max()`.
- Each run is run 1's traversal in miniature, as FRACTIONS of its D:
  webhook blip phase 0–0.14 · pulse1 0.06–0.32 · agent live 0.28–0.6 ·
  the three chip rings in quick rhythm centered at phase 0.34 + 0.075·i
  (0.12s rise, 0.3s fall) · fan pulse 0.6–0.78 · terminals blip 0.76–0.9.
- Each run flips a DIFFERENT row, scramble order `CADENCE_ORDER =
  [4, 0, 5, 1, 3]` (display rows 5, 1, 6, 2, 4 — arrival order of
  independent alerts, NOT queue order). Flip times reuse `flipAt` with
  T1 = start + 0.6·D (agent settles), T2 = start + 0.9·D (page lands) —
  the same flip shape as the followed run, so the cadence reads as "that
  exact thing, five more times".
- Row 3 stays `FLIP_DONE` (assigned + residue); the record stays run 1's.
HOLDS: ~15→19.4 (~4.4s) on the wall of `assigned` with six residues —
earned payoff hold. Living-motion pattern: **end-anchored hold** (status
functions clamp at their final states).

## Scene 7: morning (120.3–135.3s, 15s) — bookend

INTENT: by morning everything has an owner, a ticket, and a written record.
CAMERA: `camLerp(CAM_ALL, CAM_OUT, ramp(t, 2.0, 4.4, 0, 1, EASING.inOut))`
— a ~4% ease-back, the series' "step away from the machine" gesture.
CHOREOGRAPHY: none beyond the camera. Chain all-ok, every status cell
`assigned` at `TINT_RESIDUE = 0.35`, record full.
HOLDS: 4.4→15 (~10.6s) static. Living-motion pattern: **none (static
end-hold)** — sanctioned as the final-frame breath, but note 10.6s of it.

## The moves used

- **Table-hero assemble + column pulse** (S1): staggered row reveals
  (0.3s pitch) then one collective selection pulse on the column that IS
  the job — released before the cut.
- **Assemble-in-flow-order** (S2): edge draws, block fades, alternating
  left→right at ~1s pitch; tool chips width-grow one per narrated name;
  wrap line opens with the chip that needs it (no height pop).
- **Two-surface sync** (S3, S4, S5): tag resolve ↔ row selection at the
  same keyframe; chip ring (leads 0.5s) ↔ toolCalls row (lands on beat);
  terminal ok ↔ status dip 0.1s later. Causality is carried ONLY by
  synchrony — never connector lines.
- **Count-up duration** (S4): a ticking number is the cheapest legitimate
  ambient motion during a multi-beat read sequence.
- **Triple-pulse fan / dim-free port fire** (S5): one shared progress
  value on three edges = one event with three consequences.
- **Status dip-swap with tint→residue** (`flipAt`): text dips ±0.14s, tint
  0→0.85 in 0.12s, decays 1.6s to 0.35, residue persists forever.
- **Accelerating cadence with scramble order** (S6): shrinking start gaps
  AND shrinking traversal durations; phase-fraction beats so every mini-run
  is the followed run compressed; each flips a different row in scrambled
  order.
- **Freeze-cut carry** (3→4, 4→5): held live rings as open-ended booleans —
  the de-facto end-anchored-hold pattern; boundary states survive any
  narration length.
- **Ease-back bookend** (S7): ~4% scale-out onto the settled frame.
- **Anti-pattern to avoid repeating:** extend-only VO slack pools at scene
  ends — scenes 1, 2 and 7 sit fully static for 5–10s. Re-pace beats to
  span the narrated duration (VOICEOVER.md "end-anchored holds" is the
  named fix) instead of letting everything settle early.
