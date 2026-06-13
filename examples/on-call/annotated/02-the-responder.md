# Scene 2 — `the-responder`  ·  archetype: **assemble + camera ease**

Source: `../source/scenes/TheResponderScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`.

Scene 1 gave you the problem (a queue on fire). This scene gives you the machine
that answers it — the whole on-call workflow, assembled left→right in flow order
while the camera pulls back to reveal the space it lives in. Read this as the
worked example of "how do I build a multi-block workflow on screen so the viewer
reads it as one causal chain, not a pile of boxes — and how do I time the
assembly to the narration naming each part."

---

## What this scene is for

The video's thesis is "this whole first response is *one workflow*." Scene 2 has
to make that workflow a concrete object: a webhook receives the alert, a Triage
agent reads the monitoring stack via three tool chips, and three integration
blocks carry its findings out. That's the entire shape — webhook → agent →
{Slack, Linear, PagerDuty} — and the scene assembles it part by part, each part
arriving exactly as the narration names it.

So the rule is *one idea per scene*: this scene is "here is the responder
workflow, assembled." It does **not** run anything. No alert arrives, no ring
lights, no record appears. Those are scene 3 onward. The temptation is to fire a
test run at the end to make it feel alive — don't. A run is a different idea, and
it gets its own scene. This scene's job is purely structural: show the machine at
rest, fully built, so that when scene 3 fires it you already know every block it
flows through.

## What it looks like

The camera eases out from the table (scene 1's `CAM_TABLE`) to the home framing
`CAM_ALL`, opening up the left two-thirds of the stage. Into that space the
workflow assembles in flow order: the **Sentry Alerts** webhook block fades in
(left), then edge 1 draws right toward where the agent will be, then the **Triage**
agent block fades in. The agent's Tools row grows in (reserving its height first,
no pop), and the three tool chips — **Sentry**, **Datadog**, **GitHub** —
width-grow in one at a time; GitHub wraps onto a second chip line that opens to
receive it. Finally three edges fan from the agent's source handle to the three
terminals — **Slack**, **Linear**, **PagerDuty** — each terminal fading in just
after its edge lands. The incidents table sits untouched in the right rail the
whole time, still all `firing`.

## The one set piece, and the division of labor

The scene renders the *single* `<Stage/>` and differs from scene 1 only in which
parts are visible and where the camera is. Note how little the scene file does:
it computes a dozen `ramp` windows and hands them to `<Stage/>` as props.

```tsx
<Stage
  cam={cam}
  webhook={{opacity: webhookIn}}
  agent={{opacity: agentIn}}
  terms={[{opacity: terms[0]}, {opacity: terms[1]}, {opacity: terms[2]}]}
  edge1={{progress: edge1}}
  fans={[{progress: fans[0]}, {progress: fans[1]}, {progress: fans[2]}]}
  toolsRowReveal={toolsRow}
  toolChipReveals={chips}
  toolsWrapReveal={toolsWrap}
/>
```

Everything else — the geometry, the block chrome, the chip layout, the edge
paths — lives in the rig and `layout.ts`. The scene is *just the timing.* That's
the division of labor that keeps continuity free: scenes never lay anything out,
they only say *when*. The table stays at its default (`tableIn` defaults to 1,
`statusAt` defaults to `() => "firing"`), so it's identical to scene 1's exit
without the scene having to re-assert it.

> *"Why does the scene pass the workflow's visibility but NOT the table?"* Because
> the table is at its default state, and the rig's defaults *are* the scene-1 exit
> state (table in, all firing). The workflow, by contrast, was at `opacity: 0` in
> scene 1 and is *animating* here, so its reveals must be passed. Carried state
> that's at default can be left to the default; state that changes must be driven.

## The camera ease — the move that hands the frame from problem to machine

```ts
const cam = camLerp(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.5, 0, 1, EASING.inOut));
```

`camLerp` blends two camera framings; the blend factor ramps `0→1` over **0.3s →
2.5s**, eased `inOut`. So the camera starts exactly where scene 1 left it
(`CAM_TABLE`, 1.04×, centered on the table) and over ~2.2 seconds eases to
`CAM_ALL` (0.665×, centered on `px: 1428` near the workflow's right edge).

> *"Why ease the camera FIRST, before assembling anything?"* Look at the timing:
> the camera settles by 2.5s, but the webhook doesn't fade in until 4.4s. The
> pull-back happens *first*, over the narration's thesis line ("you can build that
> first response as a single workflow"), opening up empty space — and *then* the
> machine assembles into that revealed space. If you assembled while the camera
> was still moving, you'd have motion-on-motion: blocks fading in while the frame
> travels, and the eye couldn't tell what's the lens and what's the event. Move
> the frame, settle it, *then* fill it. The camera move's whole job is to hand the
> frame from the problem object (the table, hero-framed) to the machine (the home
> framing), and a handoff should be one clean gesture, not tangled with the next
> thing.

> *"Why `EASING.inOut` here, when scene 1's ramps were linear?"* Because the
> camera is a *transform travelling through space* — it has momentum. `inOut`
> (the bezier `0.65, 0, 0.35, 1`) gives it a gentle accelerate-then-decelerate,
> so the lens leaves `CAM_TABLE` softly and settles into `CAM_ALL` without a hard
> stop. This is the project's consistent rule: `inOut` for camera moves and
> transforms, `out` for entrances, `in` for exits. Linear is only for opacity,
> which has no spatial momentum to shape.

## The assembly, beat by beat

Everything is a `ramp` with `EASING.out` (the entrance curve: fast start, gentle
settle — `bezier(0.16, 1, 0.3, 1)`). The pattern across the whole assembly is
**edge draws, then block fades, alternating, left to right** — you watch control
flow *reach* toward the next block before the block arrives, which reads as the
chain wiring itself up in causal order.

### (a) The webhook fades in — `webhookIn = ramp(t, 4.4, 5.0, 0, 1, EASING.out)`

The Sentry Alerts block's opacity comes up over **4.4 → 5.0s** — the first thing
to assemble, on the far left, as the narration says "a webhook receives each
alert."

> *"Why start at 4.4, so far into the scene?"* Because the camera ease (0.3–2.5s)
> plus a beat of settled empty frame has to play first. The narration's thesis
> line runs over the pull-back; the assembly starts when the narration starts
> naming parts. The visual is paced to the words, not racing ahead of them.

### (b) Edge 1 draws — `edge1 = ramp(t, 6.2, 6.8, 0, 1, EASING.out)`

The edge from webhook to agent draws left-to-right over **6.2 → 6.8s**. It's
passed as `edge1={{progress: edge1}}`, and `SimEdgePath` draws progress via
`strokeDasharray` (`${len * progress} 99999`) — so the line literally extends from
the source handle toward the (not-yet-present) agent.

> *"Why draw the edge BEFORE the agent block exists?"* This is the alternating
> grammar: the edge reaches toward where the next block will be, *then* the block
> arrives at the end of it. It reads as "control flows this way → and here's what
> it flows into." Drawing the block first and the edge after would read backwards.
> And `SimEdgePath` returns `null` at `progress <= 0`, so before 6.2 there's no
> stray dot where the edge will be — the wire simply doesn't exist until it starts
> drawing.

### (c) The agent fades in — `agentIn = ramp(t, 7.4, 8.0, 0, 1, EASING.out)`

The Triage agent block fades in over **7.4 → 8.0s**, ~0.6s after edge 1 finishes
drawing (6.8) — the edge lands, beat, the block it points to appears. At this
point the agent shows only its two config rows (`Messages` and `Model`); the
Tools row hasn't grown in yet.

### (d) The Tools row grows in — `toolsRow = ramp(t, 10.2, 10.7, 0, 1, EASING.out)`

The agent's whole Tools line reveals over **10.2 → 10.7s**, passed as
`toolsRowReveal`. In `SimBlock`, `toolsReveal < 1` animates the row's slot height
(`height: CHIP_LINE_H * toolsReveal`) and cancels the flex gap
(`marginTop: -ROW_GAP * (1 - toolsReveal)`) — so the block *grows downward* as the
row appears, never popping. The label "Tools" and the (empty) chip area arrive
first; the chips fill in next.

> *"Why grow the Tools row in as a separate beat from the agent block?"* Because
> the agent *arriving* and the agent *getting its tools* are two moments, and the
> narration names them separately ("a Triage agent reads the monitoring stack —
> its tools are…"). Growing the row first reserves the height, so when the chips
> width-grow in (next beat) nothing below them is displaced. This is the
> no-teleport rule done structurally: reserve space, then fill it.

### (e) The three chips width-grow — `chips = [ramp(...10.8,11.25), ramp(...11.7,12.15), ramp(...12.6,13.05)]`

The three tool chips appear one at a time at **0.9s pitch**: Sentry over
10.8→11.25, Datadog over 11.7→12.15, GitHub over 12.6→13.05 — each as the
narration says its name ("Sentry, Datadog, and GitHub"). They're passed as
`toolChipReveals`. In `SimBlock`, a chip at `opacity < 1` grows in *width*
(`maxWidth: chipNaturalWidth(tool.name) * chipOp`) with a negative left margin to
cancel the gap — so each chip expands from zero width without shoving its
line-mates sideways. The natural widths are **measured** (`@remotion/layout-utils`
via `chipNaturalWidth`), not guessed, so the grow lands exactly.

> *"Why 0.9s pitch for the chips, when the table rows in scene 1 were 0.3s?"* Two
> reasons. First, pace is keyed to the narration: the chips arrive as their names
> are spoken, and "Sentry, Datadog, and GitHub" is spoken at roughly that cadence.
> Second, a tool chip is a *more significant* event than a table row — it's a
> capability the agent gains — so it earns more air. The consistent rule across
> the build: bigger conceptual events get wider spacing. Table rows (0.3s) are
> small; blocks and chips (~0.9s) are large.

> *"Why width-grow rather than fade?"* Because a chip is a physical pill in a row
> of pills; fading it in would let it overlap or look like it's materializing on
> top of its neighbors. Growing it in width *makes room* as it arrives — it reads
> as a chip being *added to the row*, which is what's happening. Same logic as the
> Tools row growing its height: the layout opens to receive the new thing.

### (f) The wrap line opens for GitHub — `toolsWrap = ramp(t, 12.55, 13.0, 0, 1, EASING.out)`

Three chips don't fit on one line at this block width, so GitHub wraps to a second
line. `toolsWrapReveal` opens that second line over **12.55 → 13.0s** —
overlapping GitHub's own width-grow (12.6→13.05) by design. In `SimBlock`,
`toolsWrapReveal < 1` sets the chip container's height to exactly one natural line
plus a fraction of the second (`CHIP_LINE_H + (CHIP_LINE_H + 5*S) * toolsWrap`),
so the block grows downward by exactly one chip-line-height as GitHub arrives — no
height pop.

> *"Why does the wrap line open at 12.55, a hair BEFORE GitHub finishes growing at
> 13.05?"* So the line is already opening to receive GitHub as it grows in. If the
> wrap opened *after* GitHub appeared, GitHub would briefly clip or the block
> would jump. Opening the line slightly ahead means the space exists the instant
> the chip needs it. This is the same "reserve space before filling it" discipline
> as the Tools row — applied to the second line.

### (g) The fan draws — `fans = [ramp(...14.8,15.4), ramp(...15.7,16.3), ramp(...16.6,17.2)]`; terminals follow

Three real edges fan from the agent's source handle to the three terminals, at
**0.9s pitch**, top to bottom: Slack edge 14.8→15.4, Linear 15.7→16.3, PagerDuty
16.6→17.2. Each terminal fades in **0.6s after its edge starts**: Slack 15.5→16.1,
Linear 16.4→17.0, PagerDuty 17.3→17.9. Same alternating grammar as edge 1 → agent:
edge leads, block follows.

> *"Why three separate edges and not a Parallel/Loop container?"* This is the
> video's load-bearing structural honesty (mandate constraint 3). Three
> unconditional edges from one source handle is a *real Sim workflow shape* — the
> agent block's source handle can fan to multiple downstream blocks, and all of
> them execute. A Parallel container would imply a different construct the product
> has but this workflow doesn't use. The fan is three real `SimEdgePath`s
> (`fanEdge(i)` smooth-steps from the agent's handle to each terminal's handle),
> drawn with the same geometry as edge 1. Drawing a container box around them
> would be inventing a structure that isn't there.

> *"Why does the terminal stack center on the axis?"* Look at `layout.ts`: the
> three terminals are stacked with `TERM_GAP = 104` between them and the whole
> stack is centered on `AXIS_Y = 670` (the webhook/agent handle axis). So the
> middle terminal (Linear) sits on the axis, and Slack/PagerDuty fan symmetrically
> above and below. The fan edges smooth-step from the agent's single on-axis handle
> out to each terminal's own handle. Centering the stack on the axis makes the fan
> read as balanced — a symmetric three-way branch — rather than lopsided. (This is
> the same frame-balance instinct as picking a middle slot for a lone caller in
> other videos: build symmetric so nothing reads as broken.)

### (h) The hold — from ~17.9s to the end of the scene (24.5s)

After PagerDuty lands, the assembled chain sits, idle, fully built.

> *"Dead air again?"* Yes — same honest scar as scene 1. The authored minimum was
> 19s, VO stretched it to 24.5s, and ~6.6s pooled at the end as a static assembled
> chain. The fix is the same: re-pace the assembly to span the narrated time
> rather than finishing at 17.9 and sitting. The reason it survives: an assembled
> machine *about to run* carries a little anticipatory tension (you know something's
> coming), but as in scene 1, tense-by-luck isn't a technique. If you imitate
> this, spread the beats.

## How to think about the whole scene

1. *How do I get from the table to the machine?* Ease the camera `CAM_TABLE →
   CAM_ALL` first, settle it, then assemble into the revealed space.
2. *How do I make a chain read as causal?* Assemble in flow order, edge-then-block
   alternating, left to right → you read flow direction as it builds.
3. *How does an agent get tools?* Grow the Tools row's height first (reserve
   space), then width-grow the chips one per narrated name, opening a wrap line
   for the third → no pop, ever.
4. *How do I fan to three terminals honestly?* Three real edges from one source
   handle, the stack centered on the axis → a real workflow shape, no container.
5. *How do I pace it?* Every beat lands as the narration names it; ~0.9s pitch for
   blocks/chips (big events get air), the camera's `inOut`, entrances' `out`.
6. *How do I end?* On the idle assembled chain (and — the lesson — re-paced so the
   tail isn't dead).

## Exit state (what scene 3 inherits)

`workflow fully assembled idle: webhook in (opacity 1), edge 1 drawn (progress 1),
agent in with Tools row grown and all three chips at reveal 1 (wrap line open),
three fan edges drawn (progress 1), three terminals in (opacity 1) · no run state
(no rings, no pulses) · table still all `firing` (unchanged from scene 1) · record
not present · camera at CAM_ALL (0.665×)`.

Scene 3 opens on exactly this frame — the idle assembled machine at the home
framing — and fires the first alert: the webhook blips, the Messages tag resolves
in sync with row 3 of the table, a pulse crosses edge 1, the Triage ring latches
on, and the record fades in below the table. Because both scenes render the same
`<Stage/>` at the same `CAM_ALL`, the 2→3 boundary is identical down to the pixel:
nothing relayouts, the camera doesn't move, the run simply begins on top of the
assembled chain.
