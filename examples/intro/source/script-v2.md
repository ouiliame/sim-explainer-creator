# Intro v2 — "The shape of a workspace" (intro-v2)

Registered as `intro-v2` alongside the original `intro`. The series opener
for someone who has seen nothing: what Sim IS, the shape of a workspace,
and where the series goes. Names and shape only — zero mechanics.

**Thesis:** Sim is a workspace where you build AI systems as workflows over
your resources.

**Macro arc:** outside-in zoom, stopped at the threshold — assemble the
workspace → split it into holders vs. the doer → compose the system shape
(hub) → name the tour stops → push into the workflow and leave the viewer
at module 1's set piece.

**Run economy: zero runs.** Nothing executes in this video. Wire light
appears twice, both justified: (a) scene 3's spoke pulses are relationship
cues (which way data flows between the workflow and each neighbor — the
hub IS the lesson), not runs: no rings, no resolutions, nothing completes;
(b) scene 5 sends ONE WirePulse sweep across the assembled chain as the
hook — the promise of "watch it work," redeemed by module 1. No row ever
resolves; boundary frames everywhere carry template state.

**Grounding note:** every on-screen value is pre-existing: tile names/chip
colors from the shared `ObjectNode` vocabulary (`OBJECTS`); the closing
chain is module-1's `<Chain/>` verbatim — the docs' own authored CLASSIFY
example (`~/sim/sim/apps/docs/components/workflow-preview/examples.ts`:
"Customer message", "claude-sonnet-4-6", "Classify `<start.input>`",
`{ "category": <agent.content> }`). Nothing invented, nothing ⟨pending⟩.

GATE SUBSTITUTION (batch mode): scene list locked against the brief
(hub-and-spokes / cluster-split / zoom-through as the spine; module-1 tile
vocabulary; end zooming INTO a workflow). Mothership rides the ring at the
top — the builder above the system — rather than getting a mechanics beat,
per the curriculum's "don't fully teach Mothership."

## Locked scene list (~61s)

1. **one-surface** (~10s, assemble) — Dark surface. The eight workspace
   tiles rise in one by one (Mothership, Workflow, Table, Knowledge Base,
   File, Tool, Logs, Deployment) into a 4×2 grid, with the docs' entrance
   stagger. Nothing else.
   *Beat intent: this is Sim — one workspace, and everything your system
   uses lives in it, with a name.*
2. **two-kinds** (~11s, cluster-split) — Mothership, Tool, Logs and
   Deployment step back (fade); Table / Knowledge Base / File glide into a
   left cluster panel, the Workflow glides right into its own. Dots are
   absorbed into the resource tiles (they hold); the workflow tile emits
   expanding pulse rings (it does).
   *Beat intent: two kinds of things — resources that hold, workflows
   that do.*
3. **wired-together** (~14s, hub-and-spokes) — The panels dissolve; the
   workflow glides to center, the resources fan onto a ring around it; the
   four tiles that stepped back rejoin the ring (Mothership at the top).
   Spokes draw outward, then wire light travels them: from Mothership down
   into the workflow (it builds it), in from the resources (it reads
   them), out to Tool, Deployment and Logs (it acts, ships, and leaves a
   record).
   *Beat intent: an AI system is a workflow wired to your resources —
   and Mothership builds it for you.*
4. **the-series** (~11s, preview-glance) — The hub holds still. A blue
   selection ring visits each tile in series order: Mothership → Workflow →
   Table → Knowledge Base → File → Tool → Deployment → Logs. Names only;
   nothing moves, nothing is taught.
   *Beat intent: every one of these is a stop on this series — short
   video each.*
5. **into-the-workflow** (~15s, zoom-through) — Ring and spokes recede; the
   camera pushes into the Workflow tile until it gives way to the builder
   canvas, where module-1's chain assembles: Start → Agent → Response,
   blocks fading in and edges drawing on. One pulse of light crosses the
   wires. Hold on the threshold.
   *Beat intent: workflows are where we start — next video, we go inside
   this one.*

## Continuity contract

- One set piece: the workspace tile field. ALL geometry (grid, clusters,
  ring, zoom target, chain canvas) lives in `layout-v2.ts`; scenes
  interpolate between named configurations and never hardcode positions.
- 1→2: full 4×2 grid at rest, all tiles opacity 1. Identical pair.
- 2→3: clusters formed (panels at full, 3 resources stacked left, workflow
  right); the four non-members are OFF stage (they exited in 2, re-enter
  in 3). Identical pair.
- 3→4: hub at rest — workflow centered, 7 satellites on the ring,
  spokes drawn, no pulse mid-flight. Identical pair.
- 4→5: same hub at rest — every selection ring has fully faded by the
  cut. Identical pair.
- Scene 5 ends the video on module-1's chain at rest (the hand-off frame);
  no boundary after it.
- Tiles never teleport: grid→cluster and cluster→ring positions
  interpolate; exits are fades, re-entrances are rises at the new ring
  position (the module-1 scene-2/scene-9 precedent).
- State language: blue #33b4ff rings for "this one" (scene 4), 0.35 dim /
  fade for non-focal, WirePulse for wire light. No words on screen beyond
  the tiles' noun labels.
