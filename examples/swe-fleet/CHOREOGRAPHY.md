# swe-fleet — choreography notes

**Verdict:** BEST EXPLANATION (hype reel 1). **Branch:** `hype/swe-fleet`.
**Comp:** `swe-fleet-v1` · 127.5s @ 60fps (VO-stretched: 10.9 / 18.8 / 12 /
8.4 / 13.3 / 14.7 / 22.8 / 15.5 / 11.1 per `public/vo/swe-fleet-v1/
manifest.json`). **Run economy: 1** — a single scheduled traversal spans
scenes 5→8 through three freeze-cuts; everything before it is assembly,
everything after is the settled state of the same run. All times below are
seconds into the scene.

## The one idea

An overnight engineering fleet is three Sim primitives composed: a table
holds the backlog, a schedule fires at midnight, a Parallel container turns
one coding lane into five engineers. The money shot is the status column
flipping row after row WHILE the lanes run — the table and the workflow are
two views of the same event, kept in sync.

## The shared machinery

- ONE `<Stage/>` (`scenes/_rig.tsx`) renders the whole 2820×1500 set piece;
  scenes pass only state props + a camera. `cameraTo(px, py, s)` maps a
  stage point to viewport center; `camMix(a, b, m)` lerps framings. Named
  cameras: `CAM_TABLE` (s 1.35) → `CAM_ALL` (s 0.7, home) → `CAM_CONT`
  (s 1.02) → `CAM_LANE` (s 1.3) → `CAM_OUT` (s 0.655).
- `ramp(t, t0, t1, easing?)` = clamped 0→1; `pulseWindow(t, a0, a1, b0,
  b1)` = up over [a0,a1], down over [b0,b1] — every ring/tint/glow is one of
  these two, so the motion vocabulary stays closed.
- `laneTop(lane, fan)`: ghost lanes interpolate from STACKED BEHIND the
  followed lane (anchored at its vertical center) out to symmetric slots —
  the fan is a continuous transform, not five entrances.
- Table flips: `flipMix(r)` dips the status/pr cell text (opacity
  `|mix−0.5|·4`, text switches at 0.5 — `open→done`, empty→`#48x`);
  `flipTint(r)` lays `rgba(51,196,130, 0.22·tint)` over the two written
  cells, pulsed to 1 then decayed to 0.35 — the residue IS the wall.

## Scene 1: the-backlog (0–10.9s)

INTENT: the backlog is a Sim table — each row one issue waiting; status
open, pr empty.
CAMERA: `CAM_TABLE` (s 1.35), static — the table is hero-framed alone; the
chain doesn't exist yet (`hidden: true` everywhere else).
CHOREOGRAPHY:
- Table chrome fades `ramp(0.2, 0.9)`; row text staggers in at
  `ramp(1.1 + r·0.35, 1.7 + r·0.35)` — a strict 0.35s-per-row cascade, five
  rows landing 1.1→3.45s. Even rhythm: this is roll call, not drama.
- Row 1 takes the product's range-selection treatment
  `pulseWindow(4.6, 5.0, 6.2, 6.6)` — rises 0.4s, HOLDS lit 1.2s while the
  narration says "each row is one issue", releases 0.4s. A selection used
  as a pointing finger, released before the boundary.
HOLDS: 6.6→10.9 (≈4.3s) on the plain open table. Dead (no ambient) — relies
entirely on narration; over the 3s cap. The weakest hold here.

## Scene 2: the-fleet-takes-shape (10.9–29.7s)

INTENT: the fleet is ONE workflow — clock, query, container, and inside it
the lane: read, fix, PR, mark done.
CAMERA: `camMix(CAM_TABLE, CAM_ALL, ramp(0.3, 2.4, EASING.inOut))` — the
pull-out happens FIRST and alone (the table glides to the top of frame),
opening the empty lower canvas that the assembly will fill. Camera move and
assembly never overlap-compete: the camera settles at 2.4, the first block
lands at 2.0–2.6, a deliberate handoff.
CHOREOGRAPHY — wire-then-block alternation, paced to the narration's
clauses (~2s per element, eleven entrances over 12s):
- Schedule `ramp(2.0, 2.6, EASING.out)` → edge 1 draws `[3.2, 3.8]` →
  Get Issues `[4.2, 4.8]` → edge 2 `[5.6, 6.2]` → Fleet container
  `[6.6, 7.4]` → inner pill-wire `[8.4, 9.0]` → Engineer `[9.0, 9.6]` →
  lane edge A `[10.6, 11.1]` → GitHub `[11.1, 11.7]` → edge B
  `[12.8, 13.3]` → Mark Done `[13.3, 13.9]`.
- The pattern: each wire STARTS first and its destination block fades in as
  the wire arrives (edge ends at 9.0, Engineer starts at 9.0) — causality
  drawn left to right, twice over (outer chain, then inner lane).
HOLDS: 13.9→18.8 (≈4.9s) on the assembled idle chain. Dead; the narration
is summarizing the lane. Over cap — same flaw as scene 1's hold.

## Scene 3: wired-by-reference (29.7–41.7s)

INTENT: ONE reference (`<getissues.rows>`) wires queue to fleet.
CAMERA: static `CAM_ALL`. The zoom-aside is faked with dim + overlay, not a
camera move — the editor card lives in VIEWPORT space above the world.
CHOREOGRAPHY:
- World dims `pulseWindow(0.4, 0.9, 10.2, 10.7)` to 0.35 — EXCEPT the
  container, which instead takes the blue editing ring `t ∈ [0.5, 10.4)`:
  dim and ring flip on within 0.1s of each other (one event, two surfaces).
- Card slides in `pulseWindow(0.8, 1.4, 9.6, 10.2)` with an 80px
  right-offset slide (`slide = 1 − ramp(0.8, 1.4)`) — entrance starts 0.3s
  after the ring, so selection precedes inspector, the product's own order.
- The `<getissues.rows>` tag glows `pulseWindow(2.6, 3.2, 7.8, 8.4)` — up
  0.6s, HELD LIT 4.6s while the narration explains the wiring, down 0.6s.
  One glow, held long: the scene has exactly one payload.
- Exit is strictly reverse-order: glow off (8.4) → card out (9.6–10.2) →
  ring off (10.4) → undim (10.2–10.7). Last in, first out.
HOLDS: 10.7→12 (1.3s) on the restored idle frame — a clean breath.

## Scene 4: lights-out (41.7–50.1s)

INTENT: deploy once and the clock is armed.
CAMERA: static `CAM_ALL`.
CHOREOGRAPHY: the smallest scene, two beats:
- Editing ring on the Schedule block `t ∈ [0.6, 2.6)` (deploying is an act
  you perform ON the block); the schedule pill rises `ramp(1.5, 2.1,
  EASING.out)` with a 14px upward drift — it appears WHILE the ring is
  still on (cause visibly present), then the ring releases at 2.6 and the
  pill stays. Green live dot + `At 12:00 AM · Next: Mar 18, 12:00 AM`.
HOLDS: 2.6→8.4 (≈5.8s) on the armed frame. Static; the green dot is the
only "live" signal and it doesn't blink. Long but tolerable — it's the
calm-before-midnight beat and the narration is building anticipation.

## Scene 5: midnight (50.1–63.4s) — the run begins

INTENT: nothing arrives from anywhere — the clock fires ON ITS OWN, the
query pulls every open issue, the batch enters the fleet.
CAMERA: static `CAM_ALL` — both surfaces (table top, chain bottom) must be
in frame because the whole scene is a two-surface sync.
CHOREOGRAPHY:
- Self-fire: Schedule ring lights `t ∈ [1.0, 2.6)` with NO inbound pulse —
  the absence is the point. The pill's date dip-swaps `Mar 18 → Mar 19`
  over `ramp(1.3, 1.8)`, 0.3s after the ring: fired and instantly re-armed,
  shown as one micro-beat.
- pulse1 `ramp(2.3, 3.0, EASING.inOut)` with edge 1 heating
  `pulseWindow(2.3, 2.7, 4.2, 4.7)` — the wire brightens AS the pulse rides
  it and cools after.
- **The query selects its rows**: Get Issues goes live `t ∈ [2.9, 5.9)` and
  IN SYNC the five table rows light as a product selection range,
  staggered `ramp(3.2 + r·0.14, 3.7 + r·0.14)` — a 0.14s-per-row sweep
  (0.56s total), much faster than scene 1's 0.35s: this is a machine
  selecting, not a narrator pointing. No connector lines — synchrony alone
  carries "this block did that to the table".
- Release is also synced: the range fades `[5.9, 6.5]` exactly as the query
  stamps ok (5.9) and pulse2 departs `[6.0, 6.7]` (edge 2 hot
  `pulseWindow(6.0, 6.4, 7.7, 8.2)`) — the data visibly LEAVES the table
  and heads into the container.
- Container live ring on at 6.6 — and HOLDS through the cut (freeze-cut
  carry: scene 6 opens inside this moment).
HOLDS: 6.7→13.3 (≈6.6s) with the container ring burning. Technically
static, but it's a held QUESTION (the batch is inside, unresolved), which
reads as tension rather than dead air. The narration spans it.

## Scene 6: the-fan (63.4–78.1s)

INTENT: the parallel splits the batch — one engineer per issue, all
starting at the same moment.
CAMERA: `camMix(CAM_ALL, CAM_CONT, ramp(0.4, 1.8, EASING.inOut))` — push
onto the container; framed so the table's last two rows stay visible,
sliced on a row boundary (the table never fully leaves the story).
CHOREOGRAPHY:
- The fan: `fan = ramp(2.4, 4.0, EASING.inOut)` — four compact ghost lanes
  emerge FROM BEHIND the followed lane (`laneTop` anchors them at its
  center at fan=0) and separate to symmetric slots. One transform, 1.6s,
  after the camera has settled (2.4 > 1.8) — move, then fan, never both.
- The synchronized start: inner Start pill blips once
  `pulseWindow(4.9, 5.15, 5.45, 5.75)`; five pulses leave TOGETHER on one
  clock `ramp(5.1, 5.9, EASING.inOut)` (pulse departs 0.2s into the blip);
  all five Engineers go live at the same instant `t ≥ 5.8` — the pulses
  arrive and the rings light as one event. Uniform timing is the MESSAGE
  here (isolated instances, same moment); the scramble comes later.
- The followed lane personalizes: `<parallel.currentItem>` glows
  `pulseWindow(6.6, 6.9, 7.6, 7.9)` and resolves to `[row 3]` over
  `ramp(7.1, 7.5)` — resolve fires mid-glow, glow releases after.
HOLDS: 7.9→14.7 (≈6.8s), freeze-cut carry: five live rings burning, tag
resolved. Same held-tension defense as scene 5; the longest hold in the
video and it survives because five blue rings = five unresolved questions.

## Scene 7: one-engineer (78.1–100.9s)

INTENT: one lane end to end — agent fixes, GitHub block opens the PR, Table
block marks ITS OWN row done. The row flip IS the lane finishing.
CAMERA: three framings, each move `EASING.inOut`: push `camMix(CAM_CONT,
CAM_LANE, ramp(0.5, 1.8))`, then hold at lane framing for the work, then
ease back `camMix(CAM_LANE, CAM_ALL, ramp(12.6, 14.2))` — timed so the
viewer arrives at full frame JUST BEFORE the row flips (16.2): the camera
exists to put the table back in frame for the payoff.
CHOREOGRAPHY:
- The agent works: the GitHub tool chip rings three times on a 2.0s period
  — `pulseWindow(3.2, 3.5, 4.2, 4.5)`, `(5.2, 5.5, 6.2, 6.5)`,
  `(7.2, 7.5, 8.2, 8.5)` (read the file / write the fix / push the branch).
  Three identical pulses = iterated tool use, without words.
- Engineer settles ok at 9.4 → pulseA `ramp(9.6, 10.2, EASING.inOut)`,
  edge A hot `pulseWindow(9.6, 10.0, 11.4, 11.9)` → GitHub live
  `[10.1, 12.2)`, ok at 12.2 (the PR exists).
- pulseB rides `[13.4, 14.0]` DURING the camera ease-back (12.6–14.2) —
  the only place motion overlaps a camera move, deliberately: the pulse
  pulls the eye along the travel direction. Mark Done live `[13.9, 16.0)`,
  ok at 16.0.
- The loop closes: row 3 flips `ramp(16.2, 16.8)` (status dips open→done,
  pr fills `#482`), green tint pulses to 1 then decays
  `1 − 0.65·ramp(17.6, 18.8)` → 0.35 residue. The tag un-resolves
  `[16.8, 17.3]` — the lane's job is done, its reference lets go.
HOLDS: 18.8→22.8 (≈4s) — ALIVE: the four ghost Engineers still burn live
rings (their work is unfinished), row 3's residue glows. The hold is a
promise of scene 8.

## Scene 8: the-wall (100.9–116.4s) — the money shot

INTENT: the fleet lands its work row after row — order not guaranteed,
every lane independent — until the queue is empty.
CAMERA: static `CAM_ALL`, steady through the whole payoff. The discipline:
when the content is maximal, the camera does nothing.
CHOREOGRAPHY:
- **Scramble finish**: lanes finish in `GHOST_FINISH_ORDER = [4, 0, 3, 1]`
  (bottom, top, fourth, second — visually non-monotonic on purpose; the
  docs' "result order not guaranteed", drawn) at `FINISH_AT = 0.8 + i·1.5`
  → 0.8, 2.3, 3.8, 5.3. Scrambled ORDER, even 1.5s CADENCE — the rhythm
  stays readable while the order says "parallel".
- Each finish is a compressed lane triplet relative to its `f`: Engineer ok
  at `f`; pulseA `[f, f+0.35]`; GitHub blips live `[f+0.3, f+0.45)`, ok at
  `f+0.45`; pulseB `[f+0.45, f+0.8]`; Mark Done blips `[f+0.75, f+0.9)`,
  ok at `f+0.9`; **and its table row flips `[f+0.95, f+1.45]`** with the
  green tint decaying `[f+2.0, f+3.0]` to the same 0.35 residue. Row flips
  land at 1.75 / 3.25 / 4.75 / 6.25 — the literal "row after row" under
  the narration. PR numbers fill in finish order (#483→#486) while rows
  sit in table order: the scramble is verifiable in the data.
- With a 1.5s gap against a ~1.45s triplet, each lane's row flips as the
  NEXT lane's pulses fire — the wall accumulates with zero dead frames.
- Cleanup in causal order: fan folds back `1 − ramp(10.4, 11.6,
  EASING.inOut)` (the reverse of scene 6's transform — symmetry); then the
  chain settles green Schedule 11.9 → Get Issues 12.3 → container 12.7
  (0.4s steps, the same direction the data flowed).
HOLDS: 12.7→15.5 (≈2.8s) on the full wall — earned, post-payoff, under cap.

## Scene 9: morning (116.4–127.5s) — bookend

INTENT: by morning the table is the record; the clock is already armed for
tomorrow night.
CAMERA: `camMix(CAM_ALL, CAM_OUT, ramp(0.8, 2.4, EASING.inOut))` — a ~6%
ease-back (s 0.7→0.655). The one move, then stillness.
CHOREOGRAPHY: none beyond the camera — every status `done`, every pr
filled, residue tints at 0.35, chain green, pill still reading
`Next: Mar 19, 12:00 AM`. The frame is the argument.
HOLDS: ≈2.4→11.1 (≈8.7s), the longest hold in the video. Earned as the
settled thesis-image, but ambient-dead — nothing ticks. The VO closing
carries it; a slow residue shimmer would have carried it better.

## The moves used

- **Three-scale freeze-cut chain** — one run crossing scenes 5→6→7→8, each
  boundary carrying a live state (container ring / five live lanes / row-3
  residue) so the cut is a camera change, never a state change.
- **Two-surface sync (block ↔ table)** — query live ring ↔ row range sweep
  (0.14s/row); lane finish ↔ row flip (`f+0.9` ok, `f+0.95` flip). No
  connector lines; synchrony is the explanation.
- **Scramble finish, even cadence** — order [4,0,3,1], gaps locked at 1.5s.
- **Residue accumulation** — green tint pulses to 1, decays to 0.35 and
  STAYS; the wall of done is made of leftover light.
- **Wire-then-block assembly** — each edge finishes drawing the frame its
  destination block starts fading in.
- **Camera-then-action sequencing** — every `camMix` settles before the
  beat it frames (sole exception: pulseB rides during scene 7's ease-back,
  pulling the eye home for the row flip).
- **Self-fire** — a ring with no inbound pulse + a date dip-swap = "the
  clock did this", no words.
- **One-clock fan start** — five pulses on a single ramp; uniform timing
  as the message (same moment), reserved scramble for the finish.
