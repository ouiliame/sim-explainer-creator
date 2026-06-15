# Scene 1 — `a-tool-in-action`  ·  archetype: **assemble + run**

Source: `../source/scenes/AToolInActionScene.tsx`, `../source/scenes/_local.tsx`,
`../source/layout.ts`, and the module-5 set piece it reuses verbatim:
`src/videos/module-5-agents/scenes/_v3.tsx` (`TriageChain`, `runBeats`,
`CHIP_DOCS / CHIP_CRM / CHIP_SEARCH_V3`).

This is the opening scene, and it does one thing: it shows you a chip you've
already seen fire — and quietly re-labels it. The whole video turns on the
sentence "that CRM chip is a custom tool somebody wrote," and this scene is the
only place that sentence can be made true *for free*, because the audience
literally watched the call happen in module-5. Read it as the bookend's first
half — scene 5 is the matching close.

---

## What this scene is for

The video's thesis is "a custom tool is two parts — a schema the model reads and
code that runs — and once saved it sits on the agent's table like any built-in."
That thesis only lands if the viewer believes a custom tool is an *ordinary*
thing, not an exotic SDK project. So scene 1 doesn't introduce custom tools; it
re-introduces a chip the audience already knows, on a chain they already know,
running an input they already saw resolve. The re-label is the payload: **one of
these three chips was written by someone on this workspace, and you watched it
work.** Everything after this is "here's how that one was built."

This is *capability-first* orientation: never open on a manufactured problem
("imagine you need weather data…"). Open on the known, running, and only then
crack it open. The run here is not decoration — it is the evidence. Without the
live CRM ring, the anatomy in scenes 2–4 floats free of any reason to care.

So the one-idea-per-scene rule reads as: this scene is "your agent acts through
its tools, and you've already watched one of them — a custom one — fire." No
editor, no schema, no save. Those get their own scenes.

## What it looks like

The module-5 Triage chain assembles left to right: `Start · Input` → `Triage`
(an Agent block carrying three tool chips: Docs / CRM / Search) → `Slack`
response block, joined by two wires. Then one compressed run plays: the input
"I was charged twice" resolves into Start's Input row, a pulse travels the first
wire, Triage lights live — and *while it's live, the CRM chip rings* — a second
pulse travels, and "billing — double charge" resolves into the response block.
Everything then reverts to template rest before the cut.

## The one real decision: reuse the set piece exactly, don't rebuild it

The scene imports `TriageChain` from module-5 and renders it. It does not define
a chain. The chips are the module-5 chips (`CHIP_DOCS`, `CHIP_CRM`,
`CHIP_SEARCH_V3`) imported by name. The geometry comes from module-5's
`layout.ts`, re-exported through this video's `layout.ts` unchanged.

> *"Why reuse instead of building a fresh, simpler chain?"* Two reasons, and both
> are load-bearing. First, **series continuity**: if this chain is pixel-for-pixel
> the chain from module-5, the audience reads it as the same world, the same
> workspace, the same agent — which is exactly the claim the narration makes
> ("you've watched this one fire"). A new chain would silently undercut the
> re-label. Second, **the run artifact is real**: module-5's `triage-run.md` is a
> live run from the beaming-polaris workspace (2026-06-10) that *actually
> contains* a `customerLookup` custom-tool call (375ms). Reusing the set piece
> lets every value on screen trace to that artifact instead of being invented.
> The lesson generalizes: when a prior video already established the object your
> new video is about, import it; don't paraphrase it.

## The chip-ring = tool-call sync — the mechanism to steal

This is the scene's craft centerpiece and it recurs in scene 5, so understand it
fully here. A chip's ring is a single 0..1 number on the `SimBlockTool`:

```ts
// SimBlock.tsx — the chip's selection ring is product state, not decoration
{(tool.ring ?? 0) > 0 ? (
  <div style={{
    boxShadow: `inset 0 0 0 ${1.5 * S}px ${C.ring}`,
    opacity: tool.ring,
  }} />
) : null}
```

The scene drives that number with a windowed pulse that is *timed to sit inside
the agent's live window*:

```ts
const run = runBeats(t, 2.8, {midDur: 2.4, hold: 0.6}); // Triage live ≈ 2.8 → 5.2
const crmRing = interpolate(t, [4.3, 4.6, 5.6, 6.0], [0, 1, 1, 0], { clamp both });
// ...
tools: [CHIP_DOCS, {...CHIP_CRM, ring: crmRing}, CHIP_SEARCH_V3]
```

The ring rises at 4.3s, holds, and falls by 6.0s — entirely *within* the window
where Triage is highlighted-live. That containment is the whole point.

> *"Why does the timing matter so much — couldn't the ring fire any time?"* No.
> The ring is making a causal claim: **the agent is thinking, and mid-thought it
> reaches for this tool.** If the ring fired before the block went live, or
> lingered after it settled, the picture would say something false — a tool
> calling itself, or a tool firing when nothing's running. The ring lives inside
> the live window because a tool call lives inside an agent's turn. This is rule
> 2 ("indicate state with visuals, not words") applied to the hardest case: the
> *moment* of a tool call, shown by where in time a ring appears, with zero text.
>
> *"Why only the CRM chip — why not ring all three?"* Because the run resolves a
> billing complaint, and in the real artifact that's the call the agent made.
> One chip rings because the agent reached for one tool. Ringing all three would
> turn a precise causal statement into ambient activity. The single ring is the
> sentence "it called *this* one."

Internalize the shape: **a tool call is a ring on a chip, scoped to the live
window of the block that owns it.** Scene 5 reuses this exact mechanism to make
the closing point — and the contrast there (CRM rings, the new Weather chip
stays quiet) is only legible because scene 1 taught you that a ring means "the
agent chose this."

## The values, and where every one comes from

| On screen | Source |
|---|---|
| Chain shape (Start·Input / Triage / Slack) | module-5 `TriageChain`, reused verbatim |
| Chips Docs / CRM / Search | module-5 condensed names; the real run's toolset |
| Input "I was charged twice" | `triage-run.md` (condensed, module-5 precedent) |
| "billing — double charge" | `triage-run.md` resolved category |
| CRM ring (the call) | `triage-run.md` toolCall 1 — `customerLookup`, real |

Nothing here is invented. The grounding table in `script-v1.md` is the contract;
the discipline is that a re-label only works if the thing being re-labeled is
demonstrably the real thing.

## The animation, beat by beat

`reveal(t0, dur)` is a clamped ease-out opacity ramp. `runBeats(t, start, …)`
is module-5's run choreographer — it returns the blip/live/resolve mixes and the
two wire-pulse progresses for one pass of the chain, so the run reads identically
to how it read in module-5.

### (a) The chain assembles — staggered block reveals + edges drawing on

`start` at `reveal(0.5)`, `mid` at `reveal(1.0)`, `response` at `reveal(1.5)`;
edges draw with `reveal(0.9, 0.5)` and `reveal(1.4, 0.5)`; the chips appear with
`toolsReveal: reveal(1.0)`.

> *"Why assemble at all — couldn't it just be present?"* The assembly is the
> "orient from the known" gesture: blocks arrive in causal order (input source,
> then the agent, then where it answers), so before any run happens the viewer
> has re-seated the chain in memory. The chips reveal *with the Triage block*,
> not after — because they're part of what the block IS, and `toolsReveal` grows
> the chip row's height so the block expands into them rather than popping.

### (b) One run plays — `runBeats(t, 2.8, {midDur: 2.4, hold: 0.6})`

The run starts at 2.8s. `midDur: 2.4` is a deliberately *long* thinking window.

> *"Why stretch the live window to 2.4s?"* So the tool call has room to read.
> In module-5 the run could be brisk; here the ring is the most important event
> in the scene, and a ring needs the block to be visibly live long enough that
> the eye registers "agent thinking → chip lights → agent done." A short live
> window would crush the ring against the resolve and blur the causality. Pace
> is being spent precisely where the lesson is.

### (c) The CRM ring fires inside the live window — covered above

It rises 4.3→4.6, holds to 5.6, falls by 6.0 — nested inside the ~2.8→5.2 live
window. This is the beat the whole scene exists to deliver.

### (d) Everything reverts to template rest

By the scene's end the resolutions clear, the ring is gone, the chips sit
unringed, the chain is back to its neutral template state.

> *"Why revert instead of holding the resolved state?"* Because of the boundary
> into scene 2. Scene 2 opens on the chain *at rest* and then dims it to raise
> the editor. If scene 1 ended mid-resolution, the cut would either freeze a
> motion or force scene 2 to animate a state it didn't cause. Ending on template
> rest makes the 1→2 boundary identical by construction (same three chips, no
> rings, no resolutions, camera identity) — continuity you can't break rather
> than continuity you have to police. It also means scene 1 can be *extended* to
> fit however long the narration runs (the VO timing stretched it from 10s to
> 12.6s) without stranding a half-finished animation.

## How to think about the whole scene

1. *What's the object?* A chain the audience knows → import module-5's, verbatim.
2. *What's the claim?* "One of these chips is custom" → make it true by reusing
   the real run, not by asserting it.
3. *How do I show a tool call without words?* A ring on the chip, scoped inside
   the agent's live window → product state language, the move scene 5 reuses.
4. *Which chip rings?* Only the one the real run called → one ring is a sentence.
5. *How does it end?* Reverted to template rest → the 1→2 boundary is free and
   the scene can stretch to the VO.

## Exit state (what scene 2 inherits)

`Triage chain at template rest · three chips (Docs/CRM/Search), no rings · no
resolutions · camera identity`. Scene 2 opens on exactly this frame, then — after
frame 0 — dims the chain to 0.35 and raises the editor panel. Because both scenes
render the same `TriageChain` at the same geometry, that boundary is pixel-stable.
