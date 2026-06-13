# agent-economy — choreography notes

**Verdict:** BEST NARRATION (hype reel 1). **Branch:** `hype/agent-economy`.
**Comp:** `agent-economy-v1` · 78.3s @ 60fps (VO-stretched: 9 / 12.3 / 11.6 /
17.2 / 13.3 / 14.9 per `public/vo/agent-economy-v1/manifest.json`).
**Run economy:** 9 runs — 1 editor baseline, 1 stranger call, 4 compressed
rush calls (the deliberate exception: the COUNT is the content), 1 outbound
flip, 1 bookend carrying both directions. All times below are seconds into
the scene (`t = frame/fps`), read off the actual `interpolate` windows.

## The one idea

Deploy a workflow as an MCP tool and it becomes infrastructure other agents
call; the same protocol lets your agent call theirs. Every scene is one more
caller (or one more direction) on the SAME unmoving Scout chain — the
choreography argues multiplicity, never relayouts.

## The shared machinery (read this first — every scene leans on it)

- `runBeats(t, a, {midDur, hold})` (module-5 `_v3.tsx`) is the canonical run
  grammar. With anchor `a`: `inputMix` dips at `[a, a+0.35]`; `startBlip`
  ring `a+0.25 → a+0.75`; `pulse1` rides edge 1 `[a+0.5, a+1.15]`; `midLive`
  ring on the Agent `a+1.1 → a+1.1+midDur`; `msgMix` resolves `[a+1.05,
  a+1.45]` — the Messages tag fills **the moment pulse1 arrives at the
  block** (cause precedes effect by construction); `pulse2` `[a+1.1+midDur,
  a+1.75+midDur]`; the Response value resolves at `respStart = a + 1.75 +
  midDur` (0.35s dip), then everything reverts together at `respStart +
  0.35 + hold` over 0.35s.
- `mcpCall(t, a)` wraps `runBeats` with the round trip: `spokeIn` pulse
  `[a−0.7, a−0.05]` (the caller's pulse ARRIVES exactly as the Input row
  starts dipping — two surfaces, one event); badge ring goes blue at
  `[a−1.0, a−0.7]` (the badge lights 0.3s BEFORE its pulse departs — intent
  precedes packet); `reply` rides the SAME spoke back at `[respStart+0.55,
  respStart+1.2]`; blue fades as the reply launches; green flashes up over
  0.25s as the reply lands and decays over 0.6s one second later.
- `popIn(frame, fps, delay)` = spring (damping 14, stiffness 160, 0.6s) —
  every badge entrance is this one spring, scale 0.82→1.

## Scene 1: an-agent-you-built (0–9s)

INTENT: you built a real agent — and it runs when YOU run it. Establishes
the run grammar so every later scene can quote it.
CAMERA: static full-frame on the chain. No move — the first scene earns the
frame before anything is allowed to move it.
CHOREOGRAPHY:
- Assembly stagger: entry fades `ease(0.3, 0.9)`, Agent `ease(0.75, 1.35)`,
  Response `ease(1.2, 1.8)` — a strict 0.45s offset, all `EASING.out`.
  Edge 1 draws `[1.0, 1.6]` and edge 2 `[1.45, 2.05]`: each wire starts
  drawing WHILE its downstream block is still fading in, so assembly reads
  as one continuous left→right wave, not three pops then two lines.
- One run: `runBeats(t, 3.6, {hold: 1.0})` → `Vantra Labs` dips into Input
  `[3.6, 3.95]`, startBlip `3.85–4.35`, pulse1 `[4.1, 4.75]`, Agent live
  `4.7–5.4`, `<start.input>` resolves `[4.65, 5.05]` as the pulse lands.
- Tool-call sync: the Search chip rings `[4.95, 5.2]` up / `[5.6, 5.85]`
  down — INSIDE the Agent's live window, 0.25s after the live ring starts.
  The nesting says "the agent, while working, called its tool".
- pulse2 `[5.4, 6.05]`; `"AI infra, Series B"` resolves `[6.05, 6.4]`;
  rows revert together `[7.4, 7.75]`.
HOLDS: 1.8→3.6s assembled-but-idle (1.8s, static — acceptable setup pause);
7.75→9s on the reverted template (1.25s breath before the cut). Both under
the dead-hold cap; only `CanvasDots` texture, no ambient motion.

## Scene 2: deploy-as-a-tool (9–21.3s)

INTENT: ONE change — deploy onto an MCP server — gives the same chain a tool
name and an address. Nothing else may move, so the one change reads.
CAMERA: static. The focus move is done with DIMMING, not framing.
CHOREOGRAPHY — a strict serial cause chain, each event waiting for the last:
- Dim-in `[0.5, 1.1]`: Agent + Response drop to 0.35 effective opacity,
  edges to 0.55 — the entry becomes focal by subtraction.
- Editing ring on the entry `t ∈ [1.2, 2.8)` — the product's "selected"
  language fires BEFORE the morph (0.3s lead): someone selected it, then it
  changed.
- Header morph Start→API `[1.5, 2.3]`, `EASING.inOut` (a transform, not an
  entrance); the crossfade is gated to mix `0.3–0.7` so there is never a
  double-exposed header; the Input row is pixel-identical throughout —
  height constant, zero relayout.
- MCP pill fades+drops in `[3.1, 3.7]`, `EASING.out`, sliding down 14px
  (`top + (1−reveal)*14`) — 0.8s AFTER the morph settles, its own beat.
- Un-dim `[4.6, 5.3]`: the world returns only after the new identity exists.
HOLDS: 5.3→12.3s (≈7s) on the deployed state. This is the VO-stretch hold —
narration reads the pill while it sits. Nothing moves but `CanvasDots`
texture: a DEAD hold by the ambient-motion test, survivable only because the
narration is actively naming what's on screen. Flag: the weakest hold in the
video; a live-dot shimmer on the pill would have earned it.

## Scene 3: a-stranger-calls (21.3–32.9s)

INTENT: an MCP client's tool call is JUST a workflow run — same grammar as
scene 1, different origin. The viewer must recognize the rhyme.
CAMERA: static; the new actor enters at the left edge (off-canvas world made
visible), chain untouched.
CHOREOGRAPHY:
- Claude Desktop badge springs in at `popIn(0.7)`; its spoke draws
  `[1.5, 2.2]` `EASING.out`; the entry's target handle appears at exactly
  `t ≥ 2.2` — the handle materializes the frame the spoke finishes, so the
  wire never points at nothing.
- `mcpCall(t, 3.4)`: badge blue `[2.4, 2.7]` → spoke pulse in `[2.7, 3.35]`
  → `Northwind AI` dips in `[3.4, 3.75]`. Three beats, 0.3–0.7s apart:
  intent → packet → arrival. Then the chain runs verbatim scene-1 grammar
  (pulse1 `[3.9, 4.55]`, live `4.5–5.2`, pulse2 `[5.2, 5.85]`, resolve
  `[5.85, 6.2]`).
- The reply rides the SAME spoke back `[6.4, 7.05]` (reverse dash-offset on
  the identical path — product-true: MCP results return to the client);
  blue fades `[6.4, 6.7]` as the reply launches; green flashes `[6.95, 7.2]`
  as it lands, decays `[8.05, 8.65]`.
- Rows revert `[7.3, 7.65]`; badge + spoke STAY (residue — the world is
  permanently bigger now).
HOLDS: 7.65→11.6s (≈4s) on deployed-state-B. Dead apart from canvas texture;
narration carries it. Borderline at the 3s cap.

## Scene 4: the-rush (32.9–50.1s) — the money shot

INTENT: you published once — five platforms now treat your workflow as
infrastructure. Multiplicity IS the lesson; the choreography must feel like
incoming traffic, not four replays.
CAMERA: static. The density comes from overlap, not movement.
CHOREOGRAPHY:
- Four badges pop in around Claude Desktop at `popIn(0.5 / 0.95 / 1.4 /
  1.85)` — uniform 0.45s stagger (this is ROLL CALL, so even rhythm is
  right); each spoke draws `[pop+0.35, pop+0.95]`, chasing its badge.
- **Accelerating cadence**: run anchors `a = 3.2, 4.8, 6.2, 7.4` — gaps
  1.6 / 1.4 / 1.2s. The compression is the point: by run 3 the viewer feels
  the calls arriving faster than they resolve.
- Per run (compressed grammar): badge blue `[a−0.25, a]`; spoke pulse in
  `[a, a+0.6]`; startBlip `a+0.5–a+0.85`; pulse1 `[a+0.7, a+1.25]`; live
  `a+1.25–a+1.75`; pulse2 `[a+1.75, a+2.3]`; reply back `[a+2.5, a+3.1]`;
  green `[a+3.0, a+3.25]` decaying `[a+3.7, a+4.3]`.
- **De-phased streams**: with 1.2–1.6s gaps against a ~3.1s round trip,
  three runs are airborne at once — e.g. at t≈6.3, Cursor's green is
  decaying, Claude Code's Agent is live, and VS Code's inbound pulse is on
  its spoke. The frame reads as a SYSTEM under load.
- **Chain-swap rows** (`chainSwap`): the rows never revert between runs —
  `Helio Robotics → Quartzline → Parcelio → Lumora Grid` dip-swap value→
  value, each landing at `a+0.55` (Input), `a+1.2` (Messages), `a+2.3`
  (Response), 0.35s dips. The row is continuously busy; the block state
  rings are unioned across runs so overlapping calls share one chain.
- One revert at `[12.0, 12.35]` after the last green decays (11.7).
HOLDS: 12.35→17.2s (≈4.8s) on the settled five-badge frame — the breath
after the payoff, earned. Static apart from canvas texture.

## Scene 5: you-call-theirs (50.1–63.4s)

INTENT: the protocol is symmetric — someone else's deployed agent becomes a
tool chip inside YOURS. The focus must flip from the left edge (inbound) to
the top-right (outbound).
CAMERA: static; the flip is done by inverting the dim — badges + entry +
pill drop to 0.35 `[0.4, 1.0]`, leaving the Agent focal.
CHOREOGRAPHY:
- Partner badge (`pricing_intel`, MCP purple) springs in top-right at
  `popIn(1.2)`; its spoke draws from the Agent's source handle `[1.9, 2.6]`;
  the `pricing_intel` chip grows on the Tools row `[2.8, 3.5]` at exact
  natural width WITH `toolsWrapReveal` opening the wrap line in sync — the
  block grows, never pops. Three entrances, ~0.7s apart, all `EASING.out`.
- One run with a LONG middle: `runBeats(t, 4.6, {midDur: 2.4})` — the
  Agent's live window `5.7–8.1` is stretched to 2.4s because the agent's
  work IS the outbound call, and the call needs room:
  - chip rings `[5.9, 6.15]` (0.2s after live starts) → outbound pulse
    departs `[6.1, 6.8]` → partner blue `[6.0, 6.3]` → return pulse
    `[7.0, 7.7]` → chip ring releases `[7.7, 7.95]` exactly as the pulse
    gets home → partner green `[7.65, 7.9]`, decaying `[8.4, 8.9]`.
    Chip-ring ↔ pulse ↔ partner-ring is a three-surface sync: the same
    event seen on the tool row, the wire, and the remote server.
- pulse2 `[8.1, 8.75]`; `"voice agents"` resolves `[8.75, 9.1]`; revert
  `[10.1, 10.45]`; un-dim `[10.6, 11.3]` — chip, badge, spoke remain
  (residue again).
HOLDS: 11.3→13.3s (2s) on the full ecosystem — short, alive with the fresh
un-dim still settling. Good.

## Scene 6: the-agent-economy (63.4–78.3s) — bookend

INTENT: both directions in ONE traversal — every agent is a tool and a
tool-user. The frame must end balanced and green.
CAMERA: the only camera move in the video — pull back 7% (`s = 1 − 0.07·e`,
`e` over `[0.6, 1.9]`, `EASING.inOut`, scaled about frame center). It exists
to reframe the chain as one node in an ecosystem, and it happens BEFORE the
run so the move never competes with the action.
CHOREOGRAPHY (anchor `a = 2.8`, hand-rolled to interleave both directions):
- Inbound: Claude Code blue `[1.85, 2.15]` → spoke pulse `[2.1, 2.75]` →
  `Drift Harbor` dips `[2.8, 3.15]` → entry stamps green ok at `3.25` →
  pulse1 `[3.3, 3.95]` → Agent live `3.9–5.9`.
- MID-RUN the outbound leg fires INSIDE the live window: chip rings
  `[4.1, 4.35]` → out pulse `[4.3, 5.0]` → partner blue `[4.2, 4.5]` →
  back pulse `[5.2, 5.9]` → partner green `[5.85, 6.1]` AS the Agent stamps
  ok at `5.9` — the remote reply and the local completion are one moment.
- pulse2 `[5.9, 6.55]` → response resolves `[6.55, 6.9]`, stamps ok `6.95`
  → reply rides back out `[7.1, 7.75]` → Claude Code green `[7.7, 7.95]`
  and HOLDS — no decay, no revert. The green-settle is strictly causal
  order (entry 3.25 → agent 5.9 → response 6.95 → caller 7.95): the state
  walks the same path the data did.
HOLDS: ≈7.95→14.9s (≈7s) on the final green frame. Earned (it's the
thesis-image: five callers, the chain, the partner, everything green) but
ambient-dead — the per-element green rings hold statically. The VO is
delivering the closing argument over it, which is what saves it.

## The moves used

- **Run grammar quoting** — scene 1 teaches `runBeats`; scenes 3–6 quote it
  verbatim so "a stranger's call is just a run" is shown, not said.
- **Caller-spoke round trip** — `PathPulse` forward then `reverse` on the
  IDENTICAL path; reply-to-caller is product truth made visible.
- **Two-surface sync** — badge ring ↔ row dip (`spokeIn` ends at `a−0.05`,
  `inputMix` starts at `a`); chip ring ↔ outbound pulse ↔ partner ring.
- **Accelerating cadence** — rush gaps 1.6/1.4/1.2s against a ~3.1s round
  trip ⇒ three calls airborne at once (de-phased streams).
- **Chain-swap rows** — values dip value→value with no template between;
  one revert at the end of the burst.
- **Residue accumulation** — each scene leaves its badge/spoke/chip behind;
  the world only grows.
- **Dim-flip refocus** — focus moves by dimming (0.35) the old actors, not
  by moving the camera.
- **Handle-on-contact** — the target handle appears the frame the spoke
  finishes drawing.
- **Pull-back bookend + causal green settle** — one 7% ease-out reframe,
  then ok-states stamped in data order, ending on a held green frame.
