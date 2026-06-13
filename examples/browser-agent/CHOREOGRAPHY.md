# browser-agent — choreography notes

**Verdict:** BEST TOOL-CALL VISUALS (hype reel 1: "the evidence filmstrip
accumulating in sync with each tool call; the live Browser Use session
folding into its own evidence card"). **Branch:** `hype/browser-agent`.
**Comp:** `browser-agent-v1` · 82.4s @ 60fps (VO-stretched: 8.7 / 11 /
13.6 / 9 / 20.3 / 9 / 10.8 per `public/vo/browser-agent-v1/manifest.json`).
**Run economy: 1** — a single Start→Response traversal spans scenes 3–6 via
held freeze-cuts (the agent's live ring never releases between calls);
inside it, four tool calls, each a distinct reach: FIND / READ / READ / ACT.
All times below are seconds into the scene.

## The one idea

Give an agent web tools and one prompt and it goes out and works the web —
and every tool call comes back as a captured result the workflow keeps. The
choreography's whole job is one equation, taught four times: **chip ring =
card birth**. Two surfaces, one event.

## The shared machinery

- `cv(t, lo, hi, a=0, b=1)` = clamped interpolate; `wave(t, a, b,
  ramp=0.35)` = glow that rises at `a`, holds, falls to zero by `b`. Chip
  rings are `Math.min(cv(up), cv(down))` pairs throughout.
- Evidence cards: `reveal` is `popIn(frame, fps, delay, dur)` (spring,
  damping 14 / stiffness 160) with a 26px drop (`top − 26·(1−reveal)`);
  `body` staggers skeleton rows in separately from the shell; `pulse` is a
  transient green capture ring on landing; `glow` is selection-blue
  ("the agent is reading this"). Cards at rest clamp to exactly 1 —
  pixel-static, never move again.
- The viewport is designed at `VIEW_RECT` = rail-slot 4 × 2.3 (same
  aspect), so the fold is a single uniform scale: `fx/fy/k` all
  `interpolate(fold, [0,1], [VIEW_RECT, slotRect(3)])`. Continuity by
  construction — the landed state IS the evidence card.
- No real run artifact exists, so all captured content is skeleton bars
  (seeded widths) — the filmstrip shows the SHAPE of evidence, never
  invented words.

## Scene 1: the-task (0–8.7s)

INTENT: a normal Sim workflow — one agent between Start and Response, told
to research whatever comes in. Nothing special yet, on purpose.
CAMERA: static full frame, chain at CHAIN_Y=250 with the empty rail space
below it — the layout silently reserves the filmstrip's room from frame 1.
CHOREOGRAPHY:
- Assembly in preview order, alternating block/wire: Start fades
  `reveal(0.4)` (0.5s, `EASING.out`) → edge 1 draws `reveal(1.1, 0.55)` →
  Research `reveal(1.7)` → edge 2 `reveal(2.5, 0.55)` → Response
  `reveal(3.1)`. Each wire starts ~0.6s before its destination block —
  the left-to-right causality wave.
- One beat of meaning: the `<start.input>` tag glows `wave(4.8, 6.4)` —
  up 0.35s, held ~1.2s under the narration naming the reference, released.
HOLDS: 6.4→8.7 (2.3s) on the assembled chain over `CanvasDots`. Under cap.

## Scene 2: the-toolbelt (8.7–19.7s)

INTENT: the toolbelt is a reach ladder — finds / reads / acts. The agent
gets hands here.
CAMERA: static; focus by the product's editing ring, not framing.
CHOREOGRAPHY:
- Selection ring on Research `t ∈ [0.6, 7.0)` brackets the whole growth —
  someone is editing this block.
- Tools row grows in at natural height `grow(1.0, 0.7)`; the Exa chip
  mounts at `grow(1.2)` — deliberately INSIDE the row reveal so the row
  opens straight to chip-line height (no 31.5→40px pop; the comment in the
  scene explains the trap).
- Chips land in sequence, each name introduced then RUNG: Exa reveal
  `grow(1.2)` then ring `wave(2.2, 3.2, 0.3)`; Firecrawl reveal
  `grow(3.0)` then ring `wave(3.8, 4.8, 0.3)`; Browser Use reveal
  `cv(5.0, 5.7)` then ring `wave(5.9, 6.9, 0.3)`. A steady ~1.8s cadence:
  appear, then pulse — the ring pre-teaches "ring = this tool is called"
  before any run exists.
- Wrap-line subtlety: Browser Use owns the chips' second line, so
  `toolsWrapReveal = cv(4.8, 5.4)` opens the LINE first and the chip FADES
  in at full width (`fade: true`) — width-growth would jump lines
  mid-reveal.
HOLDS: 7.0→11 (≈4s) after the ring releases, settled three-chip block.
Slightly over cap, narration covers it.

## Scene 3: the-run-begins (19.7–33.3s)

INTENT: the run starts like any run — but the agent's first move is to go
OUT. First teaching of ring=card.
CAMERA: static.
CHOREOGRAPHY:
- Run grammar: Start blips `[0.4, 0.95)` with its Input row glowing
  `wave(0.4, 1.5)` (blip and read are one moment); WirePulse crosses
  `cv(1.0, 1.7)` (eased `EASING.inOut` at the call site); Research goes
  LIVE at 1.6 — **and never releases**: this ring holds through three scene
  boundaries. The Messages tag glows `wave(2.0, 3.6)` — the agent reads its
  orders before acting.
- The first tool call, two surfaces: Exa chip rings up `cv(4.4, 4.7)`;
  card 1 springs into slot 1 at `popIn(5.0, 0.7)` — birth 0.3s after the
  ring starts, well inside it (cause visibly precedes effect, both visibly
  one event). Skeleton body rows stagger over `body = cv(5.2, 6.9)` (three
  favicon+line rows at 0.27 offsets within the body ramp); the green
  capture pulse brackets the landing `[5.8, 6.1]` up / `[7.0, 7.5]` down;
  the chip ring releases `[6.6, 7.0]` as the card settles. Ring and pulse
  overlap-decay: the call ends as its receipt turns green.
HOLDS: 7.5→13.6 (≈6.1s) — the live ring on Research burns the whole time
(held tension: the run is mid-flight), card 1 sits in the rail. The hold is
long but carries an unresolved state, which keeps it alive.

## Scene 4: reading-the-pages (33.3–42.3s)

INTENT: one call per page worth reading — the move repeats, faster. The
repeat at double tempo is what shows "per result".
CAMERA: static; live ring carried in from scene 3 (freeze-cut both ends).
CHOREOGRAPHY — the same gesture twice, with a measured tempo lift:
- Call 2 (learn the move): Firecrawl ring `[0.8, 1.1]` up, `[2.8, 3.2]`
  down (~2.4s ring); card 2 `popIn(1.3, 0.7)`, body `cv(1.5, 2.8)` (1.3s),
  pulse `[2.1, 2.4]` up / `[3.3, 3.8]` down.
- Call 3 (the move repeats, ~1.6× tempo): ring `[4.0, 4.25]` up,
  `[5.5, 5.85]` down (~1.85s); card 3 `popIn(4.3, 0.6)`, body
  `cv(4.45, 5.4)` (0.95s ≈ 1.4× faster), pulse `[4.9, 5.2]` / `[6.1, 6.6]`.
  Same ring→birth offset (0.3–0.5s), every window compressed — the viewer
  reads "routine now" without a word. Card 3 uses a different seed, so the
  skeleton differs: same shape, different page.
HOLDS: 6.6→9 (2.4s), live ring + three cards. Clean.

## Scene 5: hands-on-the-web (42.3–62.6s) — THE set piece

INTENT: some pages can't be read — they must be USED. A real browser
session you can watch, whose findings become one more captured result.
CAMERA: static stage; the zoom-aside is dim + overlay. World (Start,
Response, edges, cards 1–3) dims to 0.35 over `cv(0.9, 1.6)`; Research
keeps its live ring — the agent stays visibly the actor behind the session.
CHOREOGRAPHY:
- The long-held call: Browser Use chip rings up `cv(0.5, 0.9)` and HOLDS
  ~14s, releasing only `[14.4, 15.0]` AFTER the fold lands — one chip ring
  spanning the whole session says "this is all one tool call".
- Viewport rises `popIn(1.4, 0.8)` with a 30px drop-in; page A is a landing
  wireframe.
- The hands: an arrow cursor fades in `cv(3.2, 3.6)` and eases between
  waypoints with `EASING.inOut` segments — entry (380,300) → Pricing nav
  (700,40) over `[3.4, 4.3]`; click ripple at the nav `cv(4.3, 4.75)`
  (a 6→32px expanding ring fading with progress); the page dip-swaps to
  the pricing layout `page = cv(4.6, 5.4)` — ripple at 4.3, content
  changes at 4.6: click then consequence, 0.3s apart.
- Three plan captures, an accelerating sweep (starts 6.7 / 8.5 / 10.0 —
  gaps 1.8s then 1.5s): cursor eases to plan k (`[5.6, 6.6]`, `[7.6, 8.4]`,
  `[9.2, 9.9]` — travel time also shrinking), click ripple
  (`cv(6.7, 7.15)`, `cv(8.5, 8.95)`, `cv(10.0, 10.45)`), and on each plan
  the title+price region glows selection-blue then settles green WITH
  RESIDUE: e.g. plan 1 glow `[6.8, 7.2]` up / `[7.8, 8.2]` down, green
  `[7.8, 8.4]` up then decaying `[9.4, 10.0]` to 0.25 — never to zero.
  Blue hands off to green at the same instant (7.8): reading becomes
  captured.
- Cursor fades out `[11.6, 12.1]` — the hands leave before the fold, so
  the fold reads as the SYSTEM filing the session, not the cursor dragging
  it.
- **The fold** (the signature move): `fold = cv→eased EASING.inOut over
  [12.6, 14.0]` — the whole viewport (chrome, wireframe, green residues)
  uniformly scales/glides from VIEW_RECT onto rail slot 4. Because the
  interior was designed at slot-aspect ×2.3, nothing reflows; the
  drop-shadow cuts at fold 0.5 as it stops being an overlay. The world
  undims `[13.6, 14.3]` DURING the landing — the room lights come back up
  as the evidence is filed. Land pulse (green ring on slot 4) `[14.0,
  14.3]` up / `[15.0, 15.5]` down — the same capture pulse cards 1–3 got,
  closing the rhyme: the session is just evidence card 4.
HOLDS: 15.5→20.3 (≈4.8s), live ring + full rail. Held tension again.

## Scene 6: the-brief-comes-back (62.6–71.6s)

INTENT: everything the agent captured feeds one answer.
CAMERA: static.
CHOREOGRAPHY:
- The agent re-reads its evidence IN CALL ORDER: cards 1→4 glow with
  `glowAt(a) = up [a, a+0.35] / down [a+1.0, a+1.4]` at a = 0.8 / 1.4 /
  2.0 / 2.6 — a 0.6s stagger against a 1.4s glow, so each glow overlaps the
  next: a wave rolling down the rail, not four blinks.
- Completion in causal order: Start ok 3.5 → agent ok 3.8 (the live ring
  finally releases, ~3 scenes after it lit) → pulse2 `cv(4.0, 4.7)`
  (eased `EASING.inOut`) → Response live `[4.6, 6.4)` with
  `<research.content>` glowing `[4.9, 5.3]` up / `[6.0, 6.4]` down (the
  JSON template stays — no invented brief text) → Response ok at 6.4.
  Green rings HOLD through the cut (carried state for the bookend).
HOLDS: 6.4→9 (2.6s) on the all-green frame. Earned, under cap.

## Scene 7: the-evidence-trail (71.6–82.4s) — bookend

INTENT: one prompt, one run — receipts sitting right there.
CAMERA: the video's only camera move — `scale` eases 1→0.94 over
`[0.8, 2.2]` `EASING.inOut` (a ~6% pull-back about frame center).
CHOREOGRAPHY: the trail retold without re-running — each card takes one
quiet pulse in call order, `recap(a) = (up [a, a+0.3] / down [a+0.7,
a+1.1]) × 0.6` at a = 2.6 / 3.3 / 4.0 / 4.7. The ×0.6 cap matters: a recap
glow is quieter than a live read — memory, not action.
HOLDS: ≈5.8→10.8 (≈5s) on the settled frame. Ambient-dead but post-payoff
and under the VO close; acceptable, borderline.

## The moves used

- **Ring=birth two-surface sync** — every tool call is a chip ring with a
  card springing into the rail 0.3–0.5s into it; taught in scene 3,
  repeated ×3, inverted in scene 6 (cards glow while the agent THINKS).
- **Residue accumulation** — green capture pulses decay to a kept residue
  (0.25 on plan regions); the rail only ever grows; cards at rest are
  pixel-static.
- **Held live ring as run-spine** — one blue ring on the agent spans
  scenes 3–6; every boundary is a freeze-cut carrying it; its release (6:
  t=3.8) is itself a beat.
- **Tempo lift on repeat** — the second Firecrawl call at ~1.6× speed;
  the three plan captures at shrinking gaps (1.8s → 1.5s): repetition
  reads as fluency, acceleration as momentum.
- **Cursor-and-ripple hands** — `EASING.inOut` segment-eased waypoints, a
  one-ring click ripple, then consequence 0.3s later (page dip-swap or
  capture glow). Click → effect, never simultaneous.
- **Fold-to-evidence (zoom-through reverse)** — the overlay viewport is
  pre-designed at slot aspect so its exit is one uniform scale onto the
  rail; the world undims during the landing; the landing earns the same
  green pulse as every other card.
- **Quiet recap pulses** — bookend glows at 0.6 intensity: retell, don't
  re-run.
