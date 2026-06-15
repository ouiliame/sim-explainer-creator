# Scene 3 — `the-call-begins`  ·  archetype: **run → freeze-cut**

Source: `../source/scenes/TheCallBeginsScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`.

This scene starts THE run — the one mechanistic run that the centerpiece (scenes
3→4→5) is built around — and ends by **freezing it** at the Workflow block. The
held live state crosses the scene boundary unchanged. Read it together with
scenes 4 and 5: it is the first third of one continuous run, not a self-contained
scene.

---

## What this scene is for

One idea: **the run reaches the block and parks.** A parent run starts, the input
value lands in Start, the pulse crosses to the Workflow block, the block's
`Input Variable` resolves to the actual value (the handoff is visible in the
block's own config row), and the block goes live… and stops. Nothing moves past
it. The beat the viewer must take away is: *the block has the parent's value, and
now it has to go run something — so the run waits here.*

## What it looks like

On the resting parent from scene 2: the value `I want a refund` dips into Start's
`Inputs` row, Start blips, a pulse crosses edge 1, and as it lands the block's
`<start.input>` tag glows then resolves to `I want a refund`. The Workflow block's
live ring comes on — and holds. The Agent downstream never lights. The frame
freezes on the live, parked block.

## The real decisions

```tsx
const inputMix = c(1.0, 1.4);                       // value dips into Start
const startBlip = t >= 1.3 && t < 1.8;
const pulse1   = c(1.7, 2.35);                      // crosses edge 1
const ivGlow   = c(2.1, 2.35) * (1 - c(2.75, 3.1)); // glow up, then down
const ivMix    = c(2.35, 2.75);                     // resolve in place
const wfLive   = t >= 2.35;                         // …and HOLDS

<ParentChain
  start={{highlighted: startBlip}}
  wf={{highlighted: wfLive}}
  agent={{}} edge1={{}} edge2={{}}
  inputMix={inputMix}
  iv={{glow: ivGlow, mix: ivMix}}
/>
<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
```

The decisions:

**Only edge 1 gets a pulse; edge 2 is dead.** The pulse crosses Start→Workflow
and stops. There is deliberately no pulse on Workflow→Agent. That absence *is* the
teach: the run physically cannot proceed past the block because the block hasn't
returned yet. Showing a second pulse would say "the run continued," which is the
opposite of the lesson.

**The handoff resolves in the block's *own* config row.** The `Input Variable`
row was authored as `<start.input>` in scene 2; here it resolves to the run's
actual value. So the viewer literally sees the parent's value flow into the
block's configuration — the input mapping made visible. This is the friction the
notes flagged ("the input handoff is invisible in the UI; the docs say it in one
line; nobody sees it"). The scene's whole job is to make that one invisible line
*visible*.

**`wfLive = t >= 2.35` has no upper bound.** The live ring comes on and never
turns off within this scene. That open-ended truth is the freeze-cut's carried
state — scene 4 will open on this exact live frame.

## The values, and where they come from

| where | value | source |
|---|---|---|
| Start `Inputs` (via `inputMix`) | `Customer message` → `I want a refund` | series-canon run input |
| block `Input Variable` (via `iv`) | `<start.input>` → `I want a refund` | the handoff; `workflow.ts` input description: "available as start.input in the child" |

`RUN_INPUT = "I want a refund"` is the canon run value (`grounding-v1.md`).

## The animation, beat by beat

One helper: `c(lo, hi)` — a clamped *linear* 0→1 ramp (no easing argument passed;
run mechanics travel at constant rate).

### (a) The input lands — `inputMix = c(1.0, 1.4)`, Start blip `1.3–1.8s`

The value crossfades into Start's row over **1.0–1.4s** (a fast 0.4s swap — a
value populating, not arriving from off-screen), and Start blips **1.3–1.8s**,
overlapping the tail of the swap so "the value arrived" and "Start fired" read as
one event.

> *"Why does the run open at 1.0s, not 0.0?"* Scene 3 opens on the resting parent
> inherited from scene 2; a short beat of stillness before the run starts lets the
> viewer register "we're back on the parent, at rest" before motion begins. Cutting
> straight into a run would blur the boundary.

### (b) The pulse crosses — `pulse1 = c(1.7, 2.35)`

The pulse travels edge 1 over **1.7–2.35s**, leaving as Start's blip is still lit
(1.7 inside 1.3–1.8) — cause→effect, same overlap discipline as scene 1.

### (c) The handoff resolves — `ivGlow = c(2.1,2.35)*(1 - c(2.75,3.1))`, `ivMix = c(2.35,2.75)`

As the pulse nears the block (2.1s), the `<start.input>` tag **glows** (rises
2.1→2.35s); then over **2.35–2.75s** it **resolves** in place to `I want a
refund`; then the glow **fades** over 2.75–3.1s, leaving the resolved value as
residue.

> *"Why the glow-then-resolve-then-fade-glow three-step?"* This is the
> `ResolvedTag` grammar and it encodes provenance honestly. The glow is "a value
> just landed on this reference" (synchronized to the pulse arriving). The resolve
> is "the reference became its value." The glow fading while the value stays is
> "the reference is now just this value" — the provenance receipt lingers as plain
> text so it's still readable through the long hold. Multiply `ivGlow` by
> `(1 - c(2.75,3.1))` so the glow is a pulse (up then down), not a state that
> stays on.

### (d) The block goes live and holds — `wfLive = t >= 2.35`

The instant the handoff completes (2.35s), the block's live ring comes on and
stays. From here to scene end (visual min 7s; VO 8.9s) nothing moves.

> *"A ~4.5s hold on a live ring — isn't that a long time to sit?"* It's the point
> of the scene. The held live ring *is* "the run is waiting here." The longer it
> holds with nothing else moving, the more the viewer feels the parent run is
> stuck on this block — which sets up scene 4's answer ("here's what it's waiting
> FOR"). And the hold is what makes the freeze-cut work: scene 4 opens on this
> frozen frame, so the held state has to be genuinely static.

## The freeze-cut — why this is the right move here

A freeze-cut means: end the scene on a held, mid-action state, and open the next
scene on that *same* state. It answers the viewer's "what is happening inside this
moment?" The notes call this out as one of the two moves the docs' own pedagogy
leans on. Scene 3 freezes the run at the block (live ring on, downstream dark);
scene 4 opens inside that frozen moment and shows the child running. The contract
is strict: scene 4's *enter* state must equal scene 3's *exit* state to the pixel
— Start resolved to `I want a refund`, block `Input Variable` resolved, block ring
live, camera identity. The one run never re-runs; scene 4 *continues* it.

## How to think about the whole scene

1. *How do I show the run reaching the block?* Input dips into Start, pulse
   crosses edge 1 → ordinary run mechanics.
2. *How do I make the invisible handoff visible?* Resolve `<start.input>` in the
   block's own config row → the input mapping, on screen.
3. *How do I show "it parks"?* Live ring on, no pulse on edge 2 → the run
   physically can't proceed; the absence is the teach.
4. *How do I hand off to scene 4?* Hold the live state open-ended → freeze-cut;
   scene 4 opens inside it.

## Exit state (what scene 4 inherits — a freeze-cut boundary)

`parent chain · Start Inputs = "I want a refund" (resolved) · block Input Variable
= "I want a refund" (resolved, glow faded) · block ring live-blue (held) · Agent
dark · no pulse in flight · camera identity`. Scene 4 opens on this exact frame.
