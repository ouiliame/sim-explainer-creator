# Scene 1 — `the-task`  ·  archetype: **assemble**

Source: `../source/scenes/TheTaskScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md`.

This is the opening scene of the video, and it does exactly one thing: it shows
you the workflow the whole run is built around. Read it as a worked example —
every choice below is one you'll make again in your own first scene.

---

## What this scene is for

The video's whole story is "here's a normal agent workflow → watch it grow
hands and go work the web." So the first scene has to put the **workflow** on
screen as a concrete object — a three-block chain, `Start → Research →
Response` — and it has to read as *ordinary*. Nothing special yet, on purpose:
no tools, no run, no evidence. That ordinariness is the setup. The change
(scene 2 hangs a toolbelt on the agent) only lands as a change if scene 1 first
establishes the baseline it departs from.

So the rule the scene follows is *one idea per scene*: this scene is "here is
the workflow," full stop. No toolbelt, no run, no filmstrip. Resist the urge to
also introduce the tools or seed a card here — they each get their own scene.

## What it looks like

A three-block chain — `Start · Research · Response` — sitting in the **top
half** of frame (`CHAIN_Y = 250`), with conspicuously empty space below it. The
blocks assemble left to right, alternating block then connecting wire then
block, over a field of canvas dots. The `Research` block's `Messages` row holds
a `<start.input>` reference tag; once the chain is fully built, that tag glows
once and releases. Then it just sits there.

## The one real decision: render the *whole* set piece, chain-only state

The scene renders this and almost nothing else:

```tsx
<Rig
  start={{opacity: reveal(0.4)}}
  agent={{opacity: reveal(1.7)}}
  response={{opacity: reveal(3.1)}}
  edge1={{progress: reveal(1.1, 0.55)}}
  edge2={{progress: reveal(2.5, 0.55)}}
  msgGlow={wave(t, 4.8, 6.4)}
/>
```

Three things to take from this.

**Use `SimBlock`, the real product block — never a hand-built box.** The chain
on screen is the actual block component (a pixel-faithful port of Sim's
`PreviewBlockNode`, scaled ×1.5 for 1080p legibility), fed real block colors,
the real row grammar, real handle geometry. You are never designing a node
here; you're configuring the one the product draws. The chain's *shape* is the
docs' `BUILD_AGENT_WORKFLOW` pattern verbatim — `Start {Input} → agent
{Messages, Model} → Response {Data}` — so even the layout traces to product
truth, not taste.

**Notice the toolbelt, the run state, and all four evidence cards are
present — just not passed.** This is the part people get wrong. The instinct is
"scene 1 is only the bare chain, so only render the chain." Don't. There is
*one* set piece (`<Rig/>`) for the entire video, and every scene renders all of
it, turning pieces on with state props. Here `toolsReveal` defaults to `0` (no
toolbelt), `cards` defaults to `[NO_CARD ×4]` (empty rail), every glow defaults
to `0`. The pieces exist in the component tree from frame 1; this scene simply
declines to light them.

> *"Why bother rendering things I can't see?"* Because of what happens at the
> cut into scene 2. Scene 2 grows the toolbelt in on the same `Research` block
> and lights the rail later. If scene 1 didn't mount the rig at all and scene 2
> suddenly mounted it, you'd risk a one-frame jump — the chain reflowing, the
> block resizing, a flash. By rendering the same single set piece in both
> scenes and only animating which props are non-zero, the boundary between them
> is identical by construction. Continuity stops being something you check and
> becomes something you can't break.

**The empty bottom half is reserved, not forgotten.** The chain sits at
`CHAIN_Y = 250` (top half) while the four rail slots live at `RAIL_Y = 660`
(bottom half) — and the rail is rendered empty this whole scene. That dead
space below the chain isn't an unbalanced layout; it's the filmstrip's room,
held open from frame 1 so that when cards start dropping into it (scene 3
onward) nothing above has to move. The layout silently promises "evidence goes
here" before the viewer knows what evidence is.

## The framing

```ts
// no camera transform — static full frame, the rig drawn at stage coords
<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
```

There is no camera here. Unlike rigs that carry a `cam` transform, this video's
stage is a fixed `1920×1080` (`STAGE_W × STAGE_H` from `layout.ts`) drawn
1:1 into frame, and scenes 1–6 never move it. The only camera move in the
entire video is the ~6% pull-back in the scene-7 bookend.

> *"Why no establishing zoom on the hero, the way an `assemble` opener often
> does?"* Because the hero of *this* video isn't a single object you frame
> larger — it's a process that fills the whole frame over time (chain on top,
> filmstrip filling the bottom). A static full frame is the right neutral
> because the composition is *designed* to be read whole: top half is the
> workflow, bottom half is the evidence it will produce. Zooming in on the
> chain now would crop out the empty rail — and the empty rail is half the
> point. So "no camera" isn't laziness; it's the framing the two-zone layout
> demands.

## The values, and why they're references not data

Every on-screen string traces to the rig, which traces to the docs pattern:

| block | row | value |
|---|---|---|
| Start | Input | `Competitor` |
| Research | Messages | `Research <start.input>` |
| Research | Model | `claude-sonnet-4-6` |
| Response | Data | `{ "brief": <research.content> }` |

Two of those values — `<start.input>` and `<research.content>` — are **reference
tags**, not literals. They render via the `Tag` component (the product's own
pill for a wired reference), and they deliberately never substitute to a real
string. There is no run yet, and even when the run happens (scenes 3–6) the
brief text stays off screen as a `⟨pending⟩` artifact — so a tag is the honest
representation of "this field is wired to another block's output, value to be
produced." Keep this property. The moment you type a fake brief into that Data
row, the video stops being a true picture of how the product wires data and
becomes a mockup.

> *"Why is the agent block named `Research` and the input `Competitor`, when
> the docs blocks are named `Score lead` / `Lead`?"* Those names are patterned
> on the docs naming convention (verb-noun block name, single-noun input
> label) but populated with nouns from the registry's own research-stack and
> competitor-pricing templates. They're declared, swappable deviations — not
> doc-verbatim — because no canonical "research a competitor" block exists to
> copy. The *grammar* is product-true; the specific nouns are the closest
> honest fill.

## The animation, beat by beat

One tiny helper does all the entrance timing. `reveal(t0, dur = 0.5)` is a
scene-local clamped `interpolate` from 0→1 as the clock `t` (seconds) crosses
`t0 → t0+dur`, eased `EASING.out`. One shared helper, `wave(t, a, b, ramp =
0.35)` (imported from the rig), is a glow that rises over `a → a+ramp`, holds,
and falls to zero over `b−ramp → b`. That's the whole vocabulary; everything
below is built from these two.

### (a) The chain assembles in preview order — five staggered reveals

The blocks and wires come in alternating, left to right:

```
Start      reveal(0.4)        block fades in   0.4 → 0.9
edge 1     reveal(1.1, 0.55)  wire draws       1.1 → 1.65
Research   reveal(1.7)        block fades in   1.7 → 2.2
edge 2     reveal(2.5, 0.55)  wire draws       2.5 → 3.05
Response   reveal(3.1)        block fades in   3.1 → 3.6
```

What you see is a **left-to-right causality wave**: a block appears, then the
wire reaches out from it, then the next block appears where the wire points.
Each wire starts ~0.6s *before* its destination block (edge 1 at 1.1, Research
at 1.7) — so the wire is visibly reaching toward an empty spot, and the block
arrives to meet it. That ordering is the whole reason the chain reads as
*directional* (data flows Start → Response) rather than three boxes that
happened to fade up.

> *"Why start Start at 0.4 instead of 0.0?"* A short beat of empty dotted canvas
> before anything appears reads as a deliberate open — the blank workspace you
> build *onto*. Starting at 0.0 makes the first frame feel like the render was
> already mid-load.
>
> *"Why are the blocks 0.5s fades but the wires 0.55s?"* The block reveal is a
> plain opacity fade — `reveal`'s default `dur = 0.5`. The wires take a hair
> longer (`0.55`) because a wire *draws* (the `SimEdgePath` animates its
> `progress` 0→1, a stroke extending from source handle to target), and a draw
> needs enough frames to read as a line being pulled across the gap rather than
> a line blinking on. The 0.05s isn't precious; it's "a touch slower because
> there's spatial travel to see."
>
> *"Where does the 0.6s block-to-block pitch come from — Start 0.4, Research
> 1.7, Response 3.1?"* It's chosen against two constraints, like any stagger.
> Too tight and the three blocks arrive as one clump; you lose the
> left-to-right reading. Too loose and the chain takes five-plus seconds to
> assemble, which is dead time before the idea even starts. The ~1.3–1.4s
> per block-and-wire pair (0.4 → 1.7 → 3.1) is fast enough to feel alive, slow
> enough that your eye walks the chain in order. The whole assembly completes
> at 3.6s, leaving room for the one beat of meaning.

> *"Why `EASING.out` on the fades and not linear like a plain opacity ramp?"*
> The blocks aren't *only* fading — `reveal` is also what the rig could hang a
> drop on, and more importantly `EASING.out` (a fast-in, settle-out bezier) is
> the house entrance curve for everything that arrives. Using it on every
> entrance, fade or not, is what keeps the video's motion feeling like one
> hand. Consistency of curve matters more than whether a given entrance
> strictly needs easing.

### (b) The reference tag glows once, then releases — `msgGlow = wave(t, 4.8, 6.4)`

After the chain is fully assembled (3.6s) and has settled for a beat, the
`<start.input>` tag inside Research's `Messages` row glows: up over 4.8 →
5.15 (the `0.35` ramp), holds, down over 6.05 → 6.4. The glow is the product's
own "this row is being read" signal applied to a reference pill.

With no words, this glow says one sentence: *"the agent's instruction is wired
to whatever Start hands it"* — `Research <start.input>` means "research the
thing in Start's Input," and the glow points your eye at exactly the wired
reference while the narration names it.

> *"Why those two numbers, 4.8 and 6.4?"* They're the glow's shape: up at 4.8,
> down ending at 6.4 — so the tag stays lit for ~1.2s, long enough to register
> as a deliberate pointing gesture, then lets go and the chain returns to
> neutral.
>
> *"Why does it fire at 4.8 when the chain finished assembling at 3.6?"*
> Because the assembly and the reference-read are two different ideas, and
> overlapping them would blur both. Let the chain fully arrive and settle, hold
> a beat of stillness, *then* make the one pointing gesture. Stacking two
> animations in the same moment is the most common way a scene starts to feel
> busy and amateurish — give each idea its own air.
>
> *"Why glow only `<start.input>` and not `<research.content>` in Response
> too?"* Because this scene's one beat of meaning is "the agent is told to
> research the input." `<research.content>` (Response reading the agent's
> output) is a *later* idea — it gets its own glow in scene 6 when the brief
> comes back. Lighting both now would say two things at once. One reference,
> one glow, one sentence.

### (c) The hold — from ~6.4s to the end of the scene (≈8.7s)

After the tag releases, nothing moves. The assembled, ordinary workflow just
rests over the canvas dots for ~2.3s.

> *"Isn't a still frame dead air?"* Not here — the chain you just built is the
> baseline object of the whole video, and letting it sit is letting "this is a
> normal workflow" land before scene 2 changes it. There's a deeper reason too:
> this scene's tail is where narration plays, and the scene needs to be able to
> *stretch* to fit however long the voiceover runs (the comp is VO-stretched —
> scene 1 runs 8.7s to fit its narration). A scene that ends on a static,
> settled state can be extended to any length safely, because there's no
> animation mid-flight to interrupt. If it ended on something still moving, you
> couldn't extend it without freezing a motion halfway. So "ends on a settled
> hold" isn't just taste; it's what makes the audio step downstream painless.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *What's the object?* An agent workflow → use the real `SimBlock` chain in the
   docs' `BUILD_AGENT_WORKFLOW` shape.
2. *How do I show only the bare chain?* Render the **one** rig with tools, run
   state, and cards all left at their zero defaults → continuity is free.
3. *How does a workflow assemble?* Block → wire → block, left to right, each
   wire reaching before its block arrives → you read direction, not three
   boxes.
4. *How do I say "the agent is told to research the input" without a caption?*
   Glow the product's own `<start.input>` reference tag → product vocabulary,
   never words on screen.
5. *What about the values the run will produce?* Keep them as reference tags,
   never literals → an honest picture of wired data, value pending.
6. *How should it be framed?* Static full frame, chain up top, empty rail
   reserved below → the two-zone composition the rest of the video fills in.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. There's no single clever move — it's
restraint applied six times.

## Exit state (what scene 2 inherits)

`chain assembled (Start, Research, Response at full opacity) · both edges drawn
at progress 1 · no toolbelt (toolsReveal 0) · empty rail (4 NO_CARDs) ·
<start.input> glow released by 6.4s · static full frame`. Scene 2 opens on
exactly this frame and starts growing the Tools row in on the same `Research`
block while a selection ring brackets it. Because both scenes render the same
rig, that boundary is identical down to the pixel.
