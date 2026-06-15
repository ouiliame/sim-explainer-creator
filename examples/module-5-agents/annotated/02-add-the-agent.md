# Scene 2 — `add-the-agent`  ·  archetype: **morph + run, frozen**

Source: `../../../../../projects/sim-explainers/src/videos/module-5-agents/scenes/AddTheAgentScene.tsx`,
`scenes/_v3.tsx` (the `TriageChain` rig), `layout.ts`,
`demo-corpus/triage-run.md`.

This is the hinge scene. Scene 1 showed a normal workflow; this scene performs
*the* change — one block becomes an Agent — and then starts a run and **freezes
it mid-flight** so scene 3 can open inside the held moment. Read it as the setup
half of the centerpiece: most of what makes scene 3 work is decided here.

---

## What this scene is for

The video's claim is "drop an Agent block into your workflow and now it can
think." This scene is the verb *drop*. It has to do three things, in order, and
nothing else:

1. **The event** — the deterministic `Route` block morphs in place into the
   `Triage` agent. The morph IS the lesson: you swapped one block.
2. **The agent arrives configured** — its three tools grow in right after the
   morph, so the agent reads as a filled-in form, not an empty shell.
3. **A run starts and holds** — the message resolves into Start, a pulse
   reaches the block, the live ring comes on… and the moment freezes. The
   question "what's it doing in there?" is now live on screen, unanswered.

One idea per scene applies even though three things happen: they're a single
causal sentence — *swap the block → it's configured → run it → (and now we
look inside)*. The looking-inside is scene 3.

## What it looks like

The chain from scene 1 is still there, same geometry. The middle block
crossfades from `Route` (blue, JavaScript router) to `Triage` (agent-green,
Messages/Model rows), with a brief ring on the block during the swap. Then three
tool chips — `Docs · CRM · Search` — grow in on a Tools row beneath. Then
`"I was charged twice"` resolves into Start's Input row, a pulse crosses the
first edge, the agent's ring lights — and everything stops.

## The morph: same block, swapped in place — never a new block sliding in

```tsx
const morph = interpolate(t, [0.7, 1.5], [0, 1], { easing: EASING.inOut });
const morphRing = t >= 0.6 && t < 1.7;
```

`morph` is one 0→1 value handed to `TriageChain`. Inside the rig it crossfades
two `SimBlock`s occupying the **same** `left: blockX(1), top: CHAIN_Y`:

```tsx
const fnOp = interpolate(morph, [0.3, 0.7], [1, 0]);  // Route fades out
const agOp = interpolate(morph, [0.3, 0.7], [0, 1]);  // Triage fades in
```

> *"Why crossfade two blocks instead of animating one block's contents?"*
> Because the two blocks differ in color, glyph, name, AND rows — a single
> mutating block would be four simultaneous tween hacks. Two stacked blocks at
> identical geometry, opacity-crossed, is one clean idea: *this position now
> holds a different block.* The geometry never moves, so nothing reflows.
>
> *"Why do both blocks have exactly two rows?"* Deliberate, and load-bearing.
> `Route` is `Language / Code`; `Triage` is `Messages / Model`. Equal row
> counts mean equal block height, so the crossfade doesn't change the block's
> size mid-morph — no neighbor shoves, no edge reflow. The Tools row that makes
> Triage taller is added *after* the morph completes (next beat), as its own
> event.

The `morphRing` is a short highlight on the block across the swap window
(0.6→1.7s) — the product's "this block changed" signal, in product vocabulary,
no caption.

## The tools arrive configured — width-growth, after the morph

```tsx
const toolsReveal = interpolate(t, [1.8, 2.5], [0, 1], { easing: EASING.out });
const wrapReveal  = interpolate(t, [2.3, 3.0], [0, 1], { easing: EASING.out });
```

The tools come in **after** the morph (1.8s, the morph finished at 1.5s) — two
separate events, never stacked. `toolsReveal` grows the Tools row's height in;
`wrapReveal` reveals the second wrap line. Each chip grows in by **measured
width** (`@remotion/layout-utils`, not guessed), sliding its line-mates aside
rather than popping — see `SimBlock`'s chip render (`maxWidth:
chipNaturalWidth(name) * chipOp`).

> *"Why not just fade the whole Tools row in?"* A fade would pop the chips into
> existence at full width and shove the block's footprint in one frame. Width-
> growth means the row's height and each chip's width animate continuously —
> the block *grows* its tool shelf, which reads as "the agent came configured
> with these three tools" rather than "three labels appeared."

This is the beat that makes the agent legible as a form: by 3.0s the block reads
`Messages: Classify: <start.message>` · `Model: claude-sonnet-4-6` · a Tools row
of `Docs · CRM · Search`. That anatomy is the thing scene 3 then opens up.

## The run starts — and freezes (the whole point of the scene)

```tsx
const inputMix = interpolate(t, [3.2, 3.55], [0, 1]);
const startBlip = t >= 3.4 && t < 3.9;
const pulse1    = interpolate(t, [3.7, 4.4], [0, 1], { easing: EASING.inOut });
const agentLive = t >= 4.3;   // ← holds through the cut. No release.
```

Beat by beat: `"I was charged twice"` resolves into Start's Input row
(`inputMix`, via the rig's `DipSwap`); Start blips (`startBlip`); a `WirePulse`
walks the first edge (`pulse1`); the agent's ring comes on (`agentLive`).

The critical line is `agentLive = t >= 4.3` — **no upper bound.** Every other
animated value in this video is a windowed pulse that comes back down. This one
turns on and *stays on* to the end of the scene. The agent is thinking, and we
freeze on that.

> *"Why freeze instead of completing the run here?"* Because the run's middle —
> the thinking, the tool calls — is exactly what scene 3 teaches, and it has to
> happen *inside* the agent, in the chat panel, not as a black box on the wire.
> If scene 2 completed the run (pulse to Slack, category resolves), there'd be
> nothing left for scene 3 to open. So the run is one continuous gesture split
> across the cut: scene 2 plays the front (input → pulse → ring), scene 3 opens
> the box and plays the middle, then completes the run outward into Slack. The
> freeze is the seam, and it's placed in dead-still air (just a steady ring) so
> the seam is invisible.

## Continuity: why the cut into scene 3 is free

Scene 3 opens with the exact same `TriageChain` call — `morph={1}`, the same
three tools, the agent's ring live (`agentLive = t < 16.2` there), the input
still resolved (`inputMix` carried), the Slack tag still unresolved. Because
both scenes render the *same* set piece at the *same* geometry, and scene 2's
last frame is a steady held state (nothing mid-tween), the boundary is pixel-
identical by construction. The script's continuity contract verifies it like
every other boundary.

## How to think about the whole scene

1. *What's the change?* One block becomes an agent → **morph in place**, equal
   row counts so height is stable.
2. *Is the agent empty or configured?* Configured → tools **grow in after** the
   morph, by measured width, as its own event.
3. *How do I pose "what's it doing?"* Start a run and **freeze** at the live
   ring → the unanswered question is on screen, and the run is mid-flight ready
   for scene 3 to continue.
4. *How is the cut seamless?* Same set piece, same geometry, freeze on a steady
   state → continuity is structural.

## Exit state (what scene 3 inherits)

`Triage agent on the chain (morph=1) · three tools shown · input resolved to "I
was charged twice" in Start · pulse 1 landed · agent ring LIVE and held · Slack
tag unresolved.` Scene 3 opens on exactly this frame and starts raising the chat
panel out of it.
