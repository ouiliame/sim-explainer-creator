# Scene 1 — `the-workflow`  ·  archetype: **assemble**

Source: `../source/scenes/TheWorkflowScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/states.ts` (`S1_THE_WORKFLOW`), `../source/scenes/_anim.ts`,
`../source/layout.ts`, `../source/transcript-data.ts`.

This is the opening scene, and it does exactly one thing: it shows you the
workflow the whole video is about — a normal, product-true Sim chain, except
one block in it places phone calls. Read it as the worked example for "how do I
assemble a workflow left-to-right and plant the one idea that makes it special,
without a word on screen."

---

## What this scene is for

The video's whole thesis is "give an agent a phone and it doesn't just answer —
it *calls*." Before any of that can land, you have to establish the workflow as
an ordinary object: a Start, an agent that pulls the day's appointments, and a
Parallel container that will call each one. The scene's job is to *build that
chain in front of the viewer*, block by block, so that by the end they've read a
left-to-right Sim workflow and understood its shape — and then to plant the one
detail that makes it a *voice* agent: the `<parallel.currentItem>` reference in
the Call block's "To Number" row, the wiring that turns one lane into N calls.

So the rule the scene follows is *one idea per scene*: this scene is "here is the
workflow," full stop. No run, no calls, no panels, no table. The aside band
below stays completely empty. Resist the urge to also fire the run here — that's
scene 2's whole job. This scene assembles and then *rests* on a clean chain.

## What it looks like

The camera is on the top band — closer than neutral, the aside band cropped off
below the frame. Against the canvas dots, a workflow assembles left to right:
**Start** fades in, an edge draws to the right, **Campaign** (an agent block:
`Messages | Confirm appointments`, `Model | claude-sonnet-4.6`) fades in, another
edge draws, then the yellow **Parallel container "Call each"** draws on. Inside
it, an inner **Start pill**, then the lane: **Call** (an AgentPhone block:
`Operation | Create Call`, `To Number | <parallel.currentItem>`) and **Log
outcome** (a Table block: `Operation | Insert Row`, `Table | outcomes`), wired
together. Once the chain is whole, the `<parallel.currentItem>` tag in Call's
"To Number" row glows once and releases. Then the clean chain just sits there.

## The one real decision: render the whole set piece, assemble it with opacity

The scene renders one `<Stage/>` and feeds it the `S1_THE_WORKFLOW` preset
spread with a handful of per-block opacity and edge-progress values:

```tsx
<Stage
  frame={gf}
  state={{
    ...S1_THE_WORKFLOW,            // just { cam: CAM_WORK }
    start: {opacity: startOp},
    campaign: {opacity: campOp},
    container: {opacity: contOp},
    call: {opacity: callOp},
    log: {opacity: logOp},
    edge1: {progress: edge1Draw},
    edge2: {progress: edge2Draw},
    pillE: {progress: pillDraw},
    laneE: {progress: laneDraw},
    tagGlow,
    quiet: q,
  }}
/>
```

Three things to take from this.

**There is one set piece (`<Stage/>`) for the entire video, and every scene
renders all of it.** The aside band — the three call panels and the outcomes
`SimTable` — is *present in this scene's render tree too*; it just renders
nothing because every panel's `visible` defaults to `0` and `tableReveal`
defaults to `0` (see the `Stage` destructure in `_rig.tsx`). This is the same
discipline market-desk's scene 1 follows by rendering the schedule and the
Polymarket block `hidden`: by mounting the whole set piece in both scenes and
only animating visibility, the boundary into scene 2 is identical by
construction. Continuity stops being something you check and becomes something
you can't break.

**Assembly is opacity, not mounting.** Each block's entrance is a single
`opacity` value ramped 0→1; each edge's entrance is a `progress` value ramped
0→1 (which `SimEdgePath` reads to draw the connector on as a growing stroke). No
block is conditionally rendered in or out during the assembly — they're all in
the tree the whole time, fading up in sequence. That matters because a block
that's always mounted can't cause a layout reflow when it "appears."

**The blocks are the real registry blocks, never hand-drawn boxes.** `SimBlock`
is the actual product block component; `ParallelContainer` is a port of the docs
`preview-container-node` (the same rig loops-v1 and growth-machine use). You are
never *designing* a block here — you're configuring the ones that exist, with
their real colors, real glyphs, and real operation labels.

## The camera

```ts
S1_THE_WORKFLOW = { cam: CAM_WORK }
CAM_WORK = { px: CENTER_X (1200), py: AXIS_Y (310.75), s: 0.9 }
```

The camera is a transform of the fixed 2400×1350 stage: `px, py` is the stage
point that lands at the viewport center, `s` is the zoom. Here it's centered on
the workflow axis (`AXIS_Y = 310.75`, the vertical center of the container,
which the whole chain aligns its handles to) at **0.9×**.

> *"Why 0.9 and not the home framing's 0.8?"* Because this scene is *only* about
> the workflow — the aside band doesn't exist yet, so there's no reason to frame
> for it. `CAM_WORK` pushes in on the top band so the chain reads large and the
> empty band below is cropped out of frame entirely. Neutral framing (`CAM_HOME`,
> `s = 0.8`) shows the *whole* stage including the band; that's where scene 2
> pulls back to, *as the band is revealed*. So the 0.9 here isn't arbitrary — it's
> the first half of a camera move that completes in scene 2, and the gap between
> 0.9 and 0.8 is exactly the pull-back that lets the aside band slide into frame
> underneath the fanning chain.

> *"Why is the camera static this whole scene, then?"* Because the *content* is
> moving — eight blocks and edges assembling in sequence. A scene where the
> diagram is doing the work gets a still frame to read that work against; you move
> the frame *between* scenes, not during the ones where the diagram is busy.

## The values, and where they come from

Every on-screen string traces to `_reference/sim` and is staged in `_rig.tsx`'s
`Stage` (the workflow band) and `transcript-data.ts` (the aside content, unused
this scene). For this scene:

| Element | On screen | Source / grounding |
|---|---|---|
| Start | "Start" + start glyph | `BLOCK_COLORS.start = #2FB3FF` (the registry Start trigger) |
| Campaign | "Campaign", agent glyph | agent block, `BLOCK_COLORS.agent = #33C482` = `var(--brand)` (`agent.ts`) |
| Campaign row 1 | `Messages \| Confirm appointments` | authored config label (the campaign's instruction) |
| Campaign row 2 | `Model \| claude-sonnet-4.6` | the landing templates' authored model value (`examples.ts`: `claude-sonnet-4-6`) |
| Container | "Call each", yellow chip, split glyph | Parallel identity from `parallel-config.ts`: `bgColor #FEE12B`, `SplitIcon`, dark glyph (the product's luminance rule) |
| Inner pill | "Start" | the container's inner Start pill (docs preview-container-node) |
| Call | "Call", AgentPhone gradient chip | `agentphone.ts`: `name AgentPhone`, `bgColor linear-gradient(135deg,#1a1a1a,#0a2a14)` |
| Call row 1 | `Operation \| Create Call` | `agentphone.ts` operation label verbatim (`create_call → "Create Call"`) |
| Call row 2 | `To Number \| <parallel.currentItem>` | sub-block `toNumberCall`; the value is the parallel distribution reference (`parallel.mdx`) |
| Log outcome | "Log outcome", Table chip | `table.ts`: `name Table`, `bgColor #10B981` (= `BLOCK_COLORS.table`) |
| Log row 1 | `Operation \| Insert Row` | `table.ts` operation label verbatim (`insert_row → "Insert Row"`) |
| Log row 2 | `Table \| outcomes` | the target table name (authored; matches the aside `SimTable`) |

Two grounding notes worth internalizing, because they're the kind of decision
that separates a real port from a designed-looking fake:

**"To Number" is a declared deviation.** The verbatim sub-block title in
`agentphone.ts` is **"To Phone Number"** (`toNumberCall`). The rig shortens it to
"To Number" on purpose: the full title is wide enough that the value — the
`<parallel.currentItem>` tag, which *is* the beat of this scene — would
ellipsize at the product's native 250-unit block width. So the label is
human-shortened (growth-machine precedent) to keep the load-bearing reference
fully visible. The cost is one string if you ever want it back. Read the comment
in `_rig.tsx` at the `To Number` row — the deviation is declared in the code, not
hidden.

**The Campaign model reads `claude-sonnet-4.6`** where the registry template
writes `claude-sonnet-4-6` (dashes). That's a display nicety — the dotted form is
how the model id reads in running product — and it matches the growth-machine
grounding. Not a real config value invented out of thin air; a real template's
value rendered in its display form.

## The shared timing helpers

The whole scene's timing comes from `mkClock(frame)`, which returns `t` (local
frame in seconds, `frame / FPS`) and `c`, a clamped `interpolate` over local
seconds:

```ts
c(lo, hi, a = 0, b = 1, easing?) = interpolate(t, [lo, hi], [a, b],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing})
```

So `c(0.3, 0.9, 0, 1, EASING.out)` means "ramp 0→1 over 0.3s→0.9s, eased out,
clamped flat before and after." That's the whole vocabulary of the assembly.

There's also `sceneClock("the-workflow", frame)`, which returns `gf` (the
video-global oscillator frame) and `q` (the quiet gate). For this scene `gf` and
`q` are passed through to `<Stage/>` but barely do anything *yet* — there are no
panels to oscillate. They're being threaded in from frame zero anyway, because
every scene must thread them so the mechanism is uniform. (Scene 3 is where they
start earning their keep — see that annotation for the full treatment of the
global clock + quiet gate, the build's signature mechanism.)

## The animation, beat by beat

The assembly alternates **block fade** (`EASING.out`, an entrance) with **edge
draw** (`EASING.inOut`, a transform). That alternation is the rhythm: a block
appears, then the wire reaches out from it to the next position, then the next
block appears at that position. Each edge slightly *overlaps* the block that
follows it, so the wire arrives just as its destination does.

### (a) Start fades in — `startOp = c(0.3, 0.9, 0, 1, EASING.out)`

The Start block's opacity comes up over **0.3s → 0.9s**, eased out.

> *"Why start at 0.3 instead of 0.0?"* A short beat of empty frame before the
> first block appears reads as a deliberate open — the same reason market-desk's
> table waits until 0.2. Starting at 0.0 makes the first frame look like the
> render was already mid-load.
>
> *"Why `EASING.out` on a fade — doesn't easing only matter for things that
> move?"* Across this build, block entrances use `EASING.out` as a convention
> even when they're pure opacity, so that the family of entrances feels uniform.
> The curve is barely visible on a fade, but the consistency is the point: every
> block in the chain arrives with the same easing signature, so they read as one
> family of events rather than a grab-bag.

### (b) Edge 1 draws — `edge1Draw = c(1.0, 1.5, 0, 1, EASING.inOut)`

The Start→Campaign connector's `progress` runs 0→1 over **1.0s → 1.5s**, eased
`inOut`. `SimEdgePath` reads `progress` to draw the stroke on from its source
handle toward its target — a wire growing out to where the next block will land.

> *"Why `EASING.inOut` here and `out` on the blocks?"* Because an edge *drawing
> on* is a transform travelling through space — the stroke head moves from the
> source handle to the target. `inOut` gives it a gentle accelerate-then-
> decelerate so it leaves the handle softly and settles rather than snapping to a
> stop. The project's consistent rule: `out` for entrances, `inOut` for
> transforms and travel, `in` for exits. A drawn-on edge is travel.
>
> *"Why does the edge start at 1.0 — after Start finished at 0.9?"* So the wire
> appears to *grow out of* a block that's already there, not race a block that's
> still fading in. Start lands (0.9), a beat passes, the wire reaches out (1.0).
> Cause before effect, even at a tenth of a second.

### (c) Campaign fades in — `campOp = c(1.4, 2.0, 0, 1, EASING.out)`

Campaign's opacity ramps over **1.4s → 2.0s**. Notice it starts at 1.4, *before*
edge 1 finishes drawing at 1.5 — a hair of overlap so the block arrives as the
wire reaches it, reading as "the wire connected and the next block appeared"
rather than two disjoint events.

### (d) Edge 2 draws — `edge2Draw = c(2.2, 2.7, 0, 1, EASING.inOut)`

Campaign→container connector, **2.2s → 2.7s**. Same 0.2s breath after Campaign
settles (2.0) before the wire departs (2.2).

### (e) The container draws on — `contOp = c(2.6, 3.3, 0, 1, EASING.out)`

The whole Parallel container — chrome, header, inner Start pill — fades over
**2.6s → 3.3s**, a touch slower (0.7s vs. the blocks' 0.6s) because it's a bigger
object carrying more. Again the slight pre-overlap with edge 2 (starts 2.6, edge
finishes 2.7).

### (f) Pill wire draws — `pillDraw = c(3.4, 3.9, 0, 1, EASING.inOut)`

Inside the container, the smooth-step edge from the inner Start pill to the Call
block draws on, **3.4s → 3.9s**. This is the first *inner* edge; the assembly has
crossed into the container and is now wiring up the lane.

### (g) Call fades in — `callOp = c(3.8, 4.4, 0, 1, EASING.out)`

The Call (AgentPhone) block, **3.8s → 4.4s**, overlapping the pill wire's finish
(3.9).

### (h) Lane wire draws — `laneDraw = c(4.6, 5.1, 0, 1, EASING.inOut)`

The Call→Log outcome connector, **4.6s → 5.1s**.

### (i) Log outcome fades in — `logOp = c(5.0, 5.6, 0, 1, EASING.out)`

The final block, **5.0s → 5.6s**, overlapping the lane wire. The chain is whole
at ~5.6s.

> *"The assembly takes ~5.3 seconds — why so unhurried? Couldn't all of this
> happen in two?"* Because this is the establishing shot, and there are *eight*
> sequential events (four blocks, four edges) that each need to be individually
> read. The cadence — roughly 0.5s per element, each overlapping the next by
> ~0.1s — is fast enough to feel alive but slow enough that the eye lands on each
> block and each wire in turn. Compress it to two seconds and the chain assembles
> as one blur; the viewer sees "a workflow appeared" instead of "Start, then a
> wire, then the agent, then a wire, then the container holding a Call and a
> logger." The whole point of an *assemble* archetype is that the structure is
> legible because it's built in front of you.

### (j) The reference beat — `tagGlow = Math.min(c(6.2, 6.6), c(7.4, 8.0, 1, 0))`

After the chain is whole and has settled for a beat, the `<parallel.currentItem>`
tag in Call's "To Number" row glows once and releases. The value is a hand-spelled
up-hold-down: `Math.min` of an up-ramp (`c(6.2, 6.6)`, 0→1 over 0.4s) and a
down-ramp (`c(7.4, 8.0, 1, 0)`, 1→0 over 0.6s). So the glow rises over **6.2→6.6**,
holds **6.6→7.4**, and falls over **7.4→8.0** — on fast, off a little slower,
fully released before the cut.

> *"Why is this its own beat, fired at 6.2 — a full half-second after the chain
> finished at ~5.6?"* Because the assembly and the reference highlight are two
> different ideas, and stacking them would blur both. First the viewer reads the
> whole chain (assembly, ending ~5.6). Then a beat of stillness. *Then* one
> gesture points at the single detail that makes this a voice agent — the
> `<parallel.currentItem>` reference, the wiring that makes one lane become N
> calls. Give each idea its own air; the most common way a scene starts to feel
> amateurish is two animations fighting for the same moment.
>
> *"Why does the glow fall *slower* (0.6s) than it rises (0.4s)?"* A quick rise
> grabs the eye; a slightly slower release lets it linger and feel deliberate
> rather than snapped off. The up-fast/down-slow asymmetry is the house signature
> for a one-shot highlight (the same shape market-desk uses for its selection
> pulse), and it's why the tag reads as "look here — this is the key" rather than
> a flicker.
>
> *"What does the glow actually do?"* `Tag` (from `CanvasBits`) renders the
> reference token `<parallel.currentItem>` with a `glow` prop driving a selection
> tint up and down. It's a *reference being read*, not resolved — it never
> substitutes to an actual phone number, because no real run has happened and no
> real `toNumber` is invented (the truth contract). The glow says "this is the
> wiring," not "here's a value."

### (k) The hold — ~8.0s to the scene end (9.1s)

After the tag releases at 8.0, nothing moves. The clean chain rests for ~1.1s.

> *"Isn't a still hold dead air?"* No — the chain you just built is the thesis
> object, and letting it sit is letting it land. The quiet gate (`q`) is live
> this whole scene, but with no panels yet there's nothing for it to settle, so
> the hold is plain. It's deliberately short — ~1.1s — because there's no live
> state here to sustain tension; it's just a breath on a settled chain before the
> run fires. And because the scene ends on a *settled* state with no animation
> mid-flight, it can be stretched to any length the narration needs without
> freezing a motion halfway. (vo-sync extended it from the authored 9.0s minimum
> to 9.1s — a tenth of a second, absorbed entirely by this hold.)

## How to think about the whole scene

Walk the decisions in order and each one answers a question:

1. *What's the object?* A workflow → render the real `SimBlock` chain and the
   real `ParallelContainer`, never hand-drawn boxes.
2. *How do I show only the workflow?* Render the **one** set piece with the aside
   band defaulting to invisible → continuity is free.
3. *How does a chain arrive?* Assemble left to right, block-fade alternating with
   edge-draw, each overlapping the next → you read eight discrete events, not one
   blur.
4. *Which easing where?* `out` for block entrances, `inOut` for edges drawing on
   (they're travel) → a uniform motion signature.
5. *How do I say "this is a voice agent" without a caption?* Glow the
   `<parallel.currentItem>` reference once → product vocabulary, never words on
   screen.
6. *How should it be framed?* Push in on the workflow band (`CAM_WORK`, 0.9) so
   scene 2 can pull back to home and the aside band slides into frame underneath.
7. *How does it end?* On a settled chain → safe to stretch for narration.

There's no single clever move — the quality is the sum of getting each small
decision right, restraint applied seven times.

## Exit state (what scene 2 inherits)

`chain fully assembled (Start, Campaign, container with its one lane, all edges
drawn) · no run state (no rings, no pulses) · the <parallel.currentItem> tag
released (back to rest by 8.0s) · aside band empty (no panels, no table) · camera
at CAM_WORK (s 0.9), top band framed, aside band cropped below`.

Scene 2 opens on exactly this frame and starts the run: Start blips, a pulse
crosses edge 1, and — critically — the camera *eases back* from `CAM_WORK` to
`CAM_HOME` while the lane fans, revealing the empty aside band. Because both
scenes render the same `<Stage/>` and scene 2's frame-0 state equals this exit
(via the `S2`/`S1` preset lineage), that boundary is identical down to the pixel.
