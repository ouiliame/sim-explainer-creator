# voice-agent — choreography notes

verdict: hype-3 ranking **#3** ("good despite some visual artifacts") —
loved content (the streaming call panels, carried from the hype2 take the
director graded GOOD); the artifacts cost it two places, not the
choreography. This is also the reference implementation of living-motion
pattern 2: **global clock + quiet gate**.
branch: `hype3/voice-agent` · comp: `voice-agent-v2`
duration: 82.3s after vo-sync (authored visual minimum 70s)
run economy: **1 run**, spanning scenes 2→6. Scene 1 assembles; scene 7
holds the settled state and re-pulses the rows (retell, no re-run).
source: `src/videos/voice-agent/` — `timing.ts` (the global clock),
`scenes/_anim.ts` (`mkClock`, `sceneClock`, `camMix`), `scenes/states.ts`
(per-scene end-state presets), `scenes/_rig.tsx` (`<Stage/>`),
`scenes/_parts.tsx` (CallPanel / Waveform / OutcomeStamp).

## The one idea

Give an agent a phone and it CALLS: one workflow run fans into three
live phone conversations and writes every outcome back to a table. Set
piece: top band = product-true chain Start → Campaign (agent) → Parallel
"Call each" (ONE lane: Call (AgentPhone) → Log outcome (Table); ghost
pairs fan at runtime only); bottom band = three call panels + the real
outcomes SimTable, separate boxes, no edge ever crossing bands — sync by
timing only. Cameras: CAM_WORK (s 0.9) → CAM_HOME (s 0.8) → CAM_PANEL1
(s 1.06) → CAM_OUT (s 0.775).

## THE MECHANISM — timing.ts global clock + quiet gate (annotate this first)

This video's aside band carries continuously-oscillating surfaces
(waveform bars, pulsing live dots) ACROSS cuts. Extend-only VO retiming
changes scene lengths in 0.1s steps, which would break any boundary that
depends on a periodic animation's phase. The fix is two pieces, both in
`scenes/_anim.ts` reading `timing.ts`:

1. **Global oscillator frame `gf`.** `timing.ts` exports `SCENE_LIST`
   with authored minimums and `sceneSeconds()` = `max(min,
   VO_TIMING[name])` — the SAME numbers Video.tsx uses to mount
   Sequences. `sceneStartFrames(name)` sums effective prior durations, so
   `gf = localFrame + sceneStartFrames(name)` is a video-global clock
   that is correct in the master comp AND in standalone scene comps
   (verify-boundaries renders scene comps). Every scene passes
   `frame={gf}` to `<Stage/>`; all oscillators derive from it:
   - waveform bars: three out-of-phase sines per bar,
     `0.5 + 0.32·sin(gf/9 + i·0.7 + seed·2.1) + 0.18·sin(gf·1.7/9 −
     i·0.42 + seed) + 0.12·sin(gf·0.6/9 + i·1.3 + seed·3.3)` — `seed`
     (1/2/3 per panel) de-phases the three panels;
   - live dots: `0.5 + 0.5·sin(gf/9 + i·2.1)` per panel.
   Because the phase is global, the shimmer is CONTINUOUS through every
   cut — no pop, ever, at any VO-retimed duration.
2. **Quiet gate `q`.** `sceneClock` also returns `q`: 0 at both boundary
   frames of the scene, ramping 0→1 over the first 0.5s and 1→0 over the
   last 0.5s (plain clamped interpolate, no easing). Every oscillating
   AMPLITUDE multiplies by `q` (`speaking * quiet` into the waveform;
   `0.5 + 0.5·sin(...) * quiet` for the dots — note the dot gates to a
   FIXED mid-glow 0.5, the waveform to its flat 6% baseline). Result:
   every cut lands on a settled, pixel-identical frame
   (verify-boundaries reads IDENTICAL) and the half-second dip reads as
   a natural lull between conversation turns, not a freeze.

Imitate literally: put scene lengths in one `timing.ts` shared by
Video.tsx AND scenes; derive every periodic phase from
`frame + sceneStartFrames(scene)`; multiply every periodic amplitude by
the 0.5s-ramp quiet gate.

Also note `states.ts`: one static end-state preset per scene
(S1…S7), spread into each scene's Stage props — the boundary contract
holds by CONSTRUCTION because scene N animates toward the preset scene
N+1 spreads.

## Scene 1: the-workflow (0–9.1s, authored 9s)

INTENT: a normal Sim workflow — except one block places phone calls.
CAMERA: static CAM_WORK (the top band, closer; aside band off-frame
below).
CHOREOGRAPHY (left→right assembly, block-fade/edge-draw alternation):
- Start `c(0.3,0.9, out)` → edge1 draws `c(1.0,1.5, inOut)` → Campaign
  `c(1.4,2.0, out)` → edge2 `c(2.2,2.7, inOut)` → container
  `c(2.6,3.3, out)` → pill wire `c(3.4,3.9, inOut)` → Call
  `c(3.8,4.4, out)` → lane wire `c(4.6,5.1, inOut)` → Log outcome
  `c(5.0,5.6, out)`. (`c` = clamped interpolate over local seconds.)
- The reference beat: `<parallel.currentItem>` tag in Call's "To Number"
  row glows once, `min(c(6.2,6.6), c(7.4,8.0, 1, 0))` — on 0.4s, hold,
  off 0.6s; fully released before the cut.
HOLDS: 8.0 → 9.1 (~1.1s) on the clean chain. Pattern: quiet gate is live
(passed as `quiet: q`) but no panels exist yet, so the hold is plain —
short enough to read as a breath.

## Scene 2: the-run-fires (9.1–16.6s, authored 7s)

INTENT: one run, distributed — the parallel turns one lane into three
live calls.
CAMERA: `camMix(CAM_WORK, CAM_HOME, c(4.2, 6.2, inOut))` — eases back
WHILE the fan opens, revealing the still-empty aside band (the camera
move is a reveal, timed after the fan starts).
CHOREOGRAPHY (blip → pulse → ring relay, left to right):
- Start blip window `t ∈ [0.3, 0.8)` → `pulse1 = c(0.5,1.2, inOut)` with
  edge1 heat `c(0.9,1.3)` → Campaign live latches 1.15 → `pulse2 =
  c(1.6,2.3, inOut)`, edge2 heat `c(2.0,2.4)` → container live latches
  2.25.
- Inside: pill blip `min(c(2.5,2.7), c(3.0,3.3,1,0))`; `pulsePill =
  c(2.8,3.5, inOut)`; pill-edge heat `c(3.2,3.6)`; Call live latches
  3.45 — each surface lights the frame the pulse reaches it.
- THE FAN: `fan = c(3.6, 5.0, inOut)` — two header-only ghost PAIRS
  (Call + Log outcome) separate above and below the real lane,
  `ghostTop(g, fan)` lerping from behind the lane; their wires fan with
  them. Tag glows while the items distribute: `min(c(3.9,4.3),
  c(5.4,6.0,1,0))` — released before the cut.
HOLDS: 6.2 → 7.5 (~1.3s) on the live fanned chain at home framing.
Quiet gate active; short.

## Scene 3: calls-connect (16.6–28.7s, authored 8s)

INTENT: each call is a real live phone conversation — and a record is
waiting to be filled.
CAMERA: static CAM_HOME.
CHOREOGRAPHY (staggered births, two surfaces):
- Panel births at **0.5 / 1.4 / 2.3** (0.9s stagger). Per panel i:
  pop-in `visible = c(BIRTH, BIRTH+0.6, out)` (opacity + 26px translateY
  rise); greeting bubble types in `lastReveal = c(BIRTH+0.5, BIRTH+1.1,
  out)` (bubbles rise 12px as they reveal); waveform springs to life
  `speaking = c(BIRTH+0.7, BIRTH+1.5, 0, SP[i], out)` with SETTLE
  amplitudes `SP = [1, 0.85, 0.7]` — three different loudnesses = three
  de-phased live calls, matching the S3 preset exactly.
- The record appears LAST: SimTable (header only, zero rows) reveal
  `c(4.6, 5.4, out)` with the same 26px rise — the empty table is the
  scene's closing beat, not furniture.
HOLDS: 5.4 → 12.1 (~6.7s) — ALIVE: three waveforms shimmer on the global
clock at amplitudes 1/0.85/0.7, three live dots pulse de-phased
(`i*2.1` phase offset), workflow rings stay lit. This is the build's
proof that a 6s hold can carry: nothing is focal, everything breathes.
Quiet gate settles it for the cut.

## Scene 4: one-conversation (28.7–42.5s, authored 12s)

INTENT: the mechanism — it speaks, hears the answer, responds; turn by
turn.
CAMERA: `camMix(CAM_HOME, CAM_PANEL1, c(0.5, 2.2, inOut))`; the
de-focus `workflowDim = c(0.7, 1.9)` (workflow band → 38% opacity) and
panel dims ride the SAME window — camera and hierarchy move as one.
CHOREOGRAPHY (the turn loop on panel 1):
- Carried in speaking the greeting (`speaking = 1` from S3).
- The agent flatlines: `sp0 = 1 − c(3.0,3.7,inOut) … `; the human reply
  rises as skeleton bars: turn 2 reveal `c(4.2, 5.0, out)`
  (`turnCount` steps 1→2 at t=4.2) — the waveform going FLAT while the
  bars rise is the "listening" picture, two surfaces one event.
- The agent comes back: `… + c(7.0, 7.8, inOut)` springs the waveform
  back UNDER turn 3's authored confirmation line revealing
  `c(7.4, 8.2, out)` (`turnCount` 2→3 at 7.4) — voice returns as the
  bubble lands.
- Background panels settle to dim amplitudes: `sp1 = 0.85 −
  c(0.9,2.0,0,0.85,inOut)` (to 0), `sp2 = 0.7 − c(0.9,2.0,0,0.1,inOut)`
  (to 0.6), both dimmed 55% — quieter, not dead.
HOLDS: 8.2 → 13.8 (~5.6s) leaned into panel 1 — ALIVE: panel 1's
waveform at full amplitude, dot pulsing, panel 3 still murmuring at 0.6
behind the dim. Quiet gate dips it at the boundary (reads as the
conversation pausing).

## Scene 5: three-at-once (42.5–58.7s, authored 14s) — THE MONEY SHOT

INTENT: the whole campaign is talking at once — and it's still ONE run
of the workflow above.
CAMERA: pull back `camMix(CAM_PANEL1, CAM_HOME, c(0.4, 2.2, inOut))`;
dims release on `undim = c(0.5, 1.7, 1, 0)` riding the move.
CHOREOGRAPHY (three de-phased conversation clocks — copy these numbers):
- Panel 1: keeps talking, takes a breath mid-scene, talks again —
  `sp0 = 1 − c(4.5,5.3,inOut) + c(7.5,8.3,inOut)` (ends 1).
- Panel 2: human reply rises at 3.0 (`turnCount` 1→2, reveal
  `c(3.0,3.8,out)`); agent answers `sp1 = c(5.5,6.3,0,0.9,inOut)`, then
  listens again `− c(9.0,9.8,0,0.9,inOut)` (ends 0 — S5 leaves it
  listening).
- Panel 3: listening at 0.6; flatlines `−c(3.8,4.5)`; its human reply
  rises at 4.6 (reveal `c(4.6,5.4,out)`); agent comes back
  `+ c(7.0,7.8,0,0.9,inOut)` (ends 0.9).
- Every amplitude settles to the S5 preset values so the cut into
  outcomes-land carries exactly. No two panels change state in the same
  second — the de-phasing IS the spectacle.
HOLDS: 9.8 → 16.2 (~6.4s) on the alive frame: three shimmering
waveforms at 1/0/0.9, three pulsing dots, rings on above, empty table
waiting right. The video's thesis frame; the global clock keeps it
breathing for 6+ seconds of narration.

## Scene 6: outcomes-land (58.7–71s, authored 12s)

INTENT: every call ends as a row you can act on — two surfaces, one
event, three times.
CAMERA: static CAM_HOME.
CHOREOGRAPHY (staggered resolutions ~3.3s apart, each a 4-surface sync):
- Call 1: flatline `sp0 = 1 − c(0.8,1.5,inOut)` → dot solid green
  (`ended` latches 1.6) → ✓ stamp `out0 = c(1.7,2.4, out)` (scale
  0.86→1 pop) → row 1 drops `row0 = c(1.8,2.5, out)` — stamp and row
  land 0.1s apart, deliberately near-simultaneous.
- Call 2 SPEAKS FIRST (its authored confirmation line, turn 3 reveal
  `c(2.6,3.4,out)`, waveform `c(2.3,2.9) − c(4.3,4.9)`), THEN resolves:
  ended 5.0, stamp `c(5.1,5.8)`, row `c(5.2,5.9)`.
- Call 3 resolves last: line at 5.6, flatline `0.9 − c(7.5,8.1)`, ended
  8.2, stamp `c(8.3,9.0)`, row `c(8.4,9.1)`.
- The workflow echoes each landing: `pulseLane` fires per landing
  (`c(1.2,1.8) / c(4.6,5.2) / c(7.8,8.4)`, chained `pl1<1 ? pl1 : pl2<1
  ? pl2 : pl3` so the one lane carries one pulse at a time) and the Log
  outcome block blips in three windows `[1.7,2.3) ∪ [5.1,5.7) ∪
  [8.3,8.9)` — panel stamp ↔ lane pulse ↔ Log blip ↔ table row: four
  surfaces, one event.
- Settle inside the scene: rings release staggered (campaign 9.7, call
  9.85, container 10.0), wires cool `c(9.6,10.4,1,0,inOut)`, fan
  retracts `c(10.0,11.4,1,0,inOut)` — COMPLETE before the cut so scene
  7 enters the clean frame.
HOLDS: 11.4 → 12.3 (~0.9s). Quiet gate; effectively no hold — the scene
spends its whole length.
NOTE: this scene ignores its states preset's mid-state (S6 was the
Phase-A money STILL); it animates enter (all live, 0 rows) → exit (3
rows, all ✓), as the script declares.

## Scene 7: the-campaign-ran (71–82.3s, authored 8s)

INTENT: one run, three calls, three recorded outcomes — retold without
re-running.
CAMERA: `camMix(CAM_HOME, CAM_OUT, c(0.4, 2.0, inOut))` (~3% ease-back).
CHOREOGRAPHY: the retell — one quiet highlight pulse per table row,
sequential 1→3 at **1.4s spacing**: `pulseAt(a) = min(c(a, a+0.3),
c(a+0.7, a+1.2, 1, 0))` at a = 2.4 / 3.8 / 5.2, fed to
`cellHighlight` via `rowPulse`. Every pulse absorbs by 6.4.
HOLDS: 6.4 → 11.3 (~4.9s) on the settled bookend. The dots are solid
green (`ended` kills the pulse) and waveforms flat — this hold is
intentionally STILL (the campaign is over); the stillness is the
meaning, and at under 5s post-payoff it reads as the breath the
template asks for.

## The moves used

- **global clock + quiet gate** (every scene — pattern 2 from
  VOICEOVER.md; see THE MECHANISM above). The transferable core of this
  build.
- **de-phased streams** (s3 birth stagger 0.9s + settle amplitudes
  1/0.85/0.7; s5's three independent talk/listen clocks; per-panel seed
  + `i*2.1` dot phase).
- **two-surface sync, scaled to four** (s6: stamp ↔ lane pulse ↔ Log
  blip ↔ row, within 0.2s of each other, three times at ~3.3s spacing).
- **speak/listen hand-off** (s4/s5: waveform flatlines AS skeleton bars
  rise; springs back AS the authored line lands).
- **runtime fan of ghost pairs** (s2: `fan = c(3.6,5.0,inOut)`, wires
  fanning with blocks).
- **blip → pulse → ring relay** (s2's run entry; latching `t >= X`
  rings the frame the pulse arrives).
- **camera-plus-hierarchy moves** (s4: lean-in, workflowDim and panel
  dims on the same window; s5: pull-back with undim riding it).
- **end-state presets (states.ts)** — animate toward the preset the next
  scene spreads; boundaries hold by construction.
- **the quiet retell** (s7: sequential row re-pulses at 1.4s — recap
  energy with zero re-run).
