# Scene 1 — `an-agent-you-built`  ·  archetype: **assemble + run**

Source: `../source/scenes/AnAgentYouBuiltScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`.

This is the opening scene of the video, and it does two things in sequence: it
**assembles** the workflow you built, then **runs it once**. Read it as a
worked example — every choice below is one you'll make again, because this
scene is the grammar the rest of the video quotes verbatim.

---

## What this scene is for

The video's whole story is "you built a real agent → deploy it once → and now
everyone can call it, in both directions." Before any of that can mean
anything, scene 1 has to establish two facts as concrete, on-screen objects:
**there is a real workflow here** (a three-block chain with authentic rows and
tools, not a cartoon), and **it runs when you run it** (a value goes in, the
chain does work, a value comes out). Everything downstream — a stranger calling
it, five clients calling it, your agent calling theirs — is *the same run* with
a different origin. So this scene isn't just an intro; it's the **reference
implementation of a run**. Get the run grammar legible here and scenes 3–6 cost
you almost nothing, because they're allowed to say "same as scene 1."

So the rule the scene follows is *one idea per scene*, read generously: the one
idea is "an agent you built, that runs." Assembly and the single run are two
halves of that one idea, not two ideas — the assembly *is* what gets run.
Resist the urge to also introduce the MCP pill, a caller badge, or the partner
server here. Those are deployment and the economy; they each get their own
scene. This scene is a plain workflow in a plain editor, running by itself.

## What it looks like

A three-block chain — `Start → Agent "Scout" → Response` — sitting left-of-center
on the builder canvas (the dotted `CanvasDots` texture behind it). The blocks
stagger in left to right, two edges draw on between them as they arrive, and
then one editor run plays through: `Vantra Labs` resolves into Start's **Input**
row, a light pulse rides the first wire, the **Scout** Agent lights up and its
**Search** tool chip rings (it called its tool), `<start.input>` resolves inside
the Agent's Messages, a second pulse rides the second wire, and
`"AI infra, Series B"` resolves inside the Response block's **Data** template.
Then everything reverts to the empty template and holds.

## The one real decision: render the *whole* set piece, run the *real* chain

The scene renders this and almost nothing else:

```tsx
<EconomyRig
  entry={{opacity: blockOp[0], highlighted: run.startBlip}}
  agent={{opacity: blockOp[1], highlighted: run.midLive}}
  response={{opacity: blockOp[2], highlighted: run.respBlip}}
  edge1={{progress: edge1}}
  edge2={{progress: edge2}}
  searchChipRing={chipRing}
  inputResolve={{text: "Vantra Labs", mix: run.inputMix}}
  msgResolve={{text: "Vantra Labs", mix: run.msgMix}}
  respResolve={{text: '"AI infra, Series B"', mix: run.respMix}}
/>
```

Two things to take from this.

**Use `SimBlock`, the real product block — never a hand-built node.** The chain
on screen is the actual block component (`Scout` Agent carries its real rows —
`Model: claude-sonnet-4-6`, `Messages: Research <start.input>` — and its real
Tools row with Search + Docs chips), fed the workflow's real shape. You are
never designing a block here; you're configuring the one that exists. Every
color, glyph, radius, and the `<start.input>` reference syntax come from the
product (`grounding-v1.md` traces each).

**Notice what *isn't* passed: no `pill`, no `badges`, no `spokes`, no
`partner`, no `mcpChip`, `entryMix` left at its default `0`.** This is the part
people get wrong. There is *one* set piece (`<EconomyRig/>`) for the entire
six-scene video, and every scene renders all of it, turning pieces on and off
with props. Here the deployment identity and the whole caller economy are
simply absent — but they're absent the way a prop defaults to off, not the way
a component is missing from the tree.

> *"Why does it matter whether they're 'off' versus 'not rendered'?"* Because of
> what happens at the cut into scene 2. Scene 2 brings the MCP pill in and morphs
> the entry header Start→API. If scene 1 hand-built a bespoke chain and scene 2
> mounted the "real" rig, you'd risk a one-frame jump — a block reflowing, a
> handle shifting, a flash. By having *both* scenes render the same
> `EconomyRig` at the same `layout.ts` geometry, and only changing prop values
> across the cut, the boundary is identical by construction. The entry block is
> at `blockX(0)`, `CHAIN_Y` in scene 1 and at `blockX(0)`, `CHAIN_Y` in scene 2;
> only its header crossfades. Continuity stops being something you check and
> becomes something you can't break.

## The camera

```ts
// no <Stage cam={…}> wrapper at all — the scene is full-frame, static.
```

There is no camera move and no camera prop in this scene. The chain lives at
fixed `layout.ts` coordinates (`CHAIN_X = 400`, `CHAIN_Y = 470`, pitch `480`)
and is shown at native scale, full-frame, dead still.

> *"Why no camera at all, when scene 1 of the market-desk video framed its hero
> at 1.1×?"* Because this video's only camera move is saved for the very last
> scene (the 7% pull-back bookend in scene 6), and spending a move here would
> spend that coin early. The CHOREOGRAPHY note says it plainly: *"the first
> scene earns the frame before anything is allowed to move it."* The chain is
> the thesis object of all six scenes; let the viewer learn the frame as fixed
> ground truth, so that when the camera finally pulls back at the end, the move
> *means* "step back and see the whole ecosystem" rather than reading as
> generic motion. A static establishing frame is a deliberate choice, not an
> absence of one.

## The values, and why they resolve *by running*, not by styling

Every on-screen value traces to `grounding-v1.md` (the invented Scout corpus):

| surface | template (idle) | resolved (this run) |
|---|---|---|
| Start · Input | `Company name` | `Vantra Labs` |
| Scout · Messages | `Research <start.input>` | `Research Vantra Labs` |
| Response · Data | `{ "brief": <scout.content> }` | `{ "brief": "AI infra, Series B" }` |

The Input row holds the placeholder `Company name` until the run dips it to
`Vantra Labs` and back; the Messages reference `<start.input>` and the Data
reference `<scout.content>` are the product's real templating tags, which
*resolve* to their values only while the run is live. The mechanism is
`DipSwap` / `ResolvedTag` driven by `mix` values that the run choreography
produces (`run.inputMix`, `run.msgMix`, `run.respMix`):

```tsx
inputResolve={{text: "Vantra Labs", mix: run.inputMix}}   // Start.Input
msgResolve={{text: "Vantra Labs", mix: run.msgMix}}        // Scout.Messages <start.input>
respResolve={{text: '"AI infra, Series B"', mix: run.respMix}}  // Response.Data <scout.content>
```

These values are not "filled because we styled them filled" — they fill because
**a row cannot show a value the run hasn't produced yet, and a reference tag
cannot resolve until upstream has run.** Keep this property. It's the same
discipline as never making a number tick without a block causing it: the
Messages tag resolves the moment `pulse1` *arrives at the Agent*, and the Data
tag resolves only after `pulse2` carries the result to the Response. Cause
precedes effect, by construction. If you ever make a cell fill on a timer with
no pulse driving it, you've broken the one rule that keeps the video an honest
depiction of how the product runs.

> *"Why does `inputResolve.text` and `msgResolve.text` both say `Vantra Labs`,
> but the Response says `"AI infra, Series B"`?"* Because the first two are the
> *same value flowing*: the company name you typed into Start is the thing
> `<start.input>` refers to, so the Messages tag resolving to `Vantra Labs` is
> the data propagating one block downstream — the viewer sees the same string
> appear in two places and reads "the input reached the agent." The Response is
> a *different* value — the brief the agent produced — so `<scout.content>`
> resolves to a new string. The grounding pairs `Vantra Labs → "AI infra,
> Series B"`; the script's earlier `"brief ready · 4 sources"` was superseded
> by the locked source, and the annotation grounds to source.

## The animation, beat by beat

The timing is built from one inline `ease(lo, hi)` (an `EASING.out`
`interpolate` from 0→1 clamped to the window), the shared `runBeats(t, a,
{hold})` grammar (the canonical run, imported from module 5 — this is the helper
scenes 3–6 quote), and `clamp01` aliased to `c` for the chip ring. With anchor
`a = 3.6`, `midDur = 0.7` (default), `hold = 1.0`, every window below is read
straight off those helpers.

### (a) The chain assembles — `blockOp = [ease(0.3,0.9), ease(0.75,1.35), ease(1.2,1.8)]`, edges `ease(1.0,1.6)` / `ease(1.45,2.05)`

The three blocks fade in on a strict **0.45-second stagger** — Start over
0.3→0.9s, Scout over 0.75→1.35s, Response over 1.2→1.8s — and the two wires
draw on between them: edge 1 over 1.0→1.6s, edge 2 over 1.45→2.05s. All
`EASING.out`.

> *"Where does the 0.45s stagger come from?"* It's chosen, not derived, but
> chosen against the same two constraints every stagger answers. Too tight
> (~0.15s) and the three blocks arrive as one pop — the viewer can't feel that a
> chain is *three* distinct stages. Too loose (~0.9s) and assembly drags past
> two seconds of dead build. 0.45s is fast enough to feel like one gesture, slow
> enough that your eye lands on Start, then Scout, then Response in order — you
> read the *direction* of the chain (left builds right), which is the whole
> point, since the run will flow that same direction.
>
> *"Why do the edges start drawing at 1.0 and 1.45 — before their downstream
> block has finished fading in?"* This is the deliberate overlap. Edge 1 starts
> at 1.0s while Scout (0.75→1.35) is still arriving; edge 2 starts at 1.45s
> while Response (1.2→1.8) is still arriving. If each wire waited for its block
> to fully land, assembly would read as *three pops, then two lines* — a stutter.
> By letting each wire draw *into* its still-arriving block, the whole assembly
> reads as **one continuous left→right wave**: block, wire-reaching, block,
> wire-reaching, block. The chain feels grown, not stacked.

### (b) The idle hold — ~1.8s to 3.6s

Once Response lands (1.8s) and edge 2 finishes (2.05s), nothing moves until the
run begins at the anchor `a = 3.6`. About **1.8 seconds** of assembled-but-idle
chain, behind only the `CanvasDots` texture.

> *"Isn't 1.8s of a static chain dead air?"* It's a setup pause, and the
> CHOREOGRAPHY flags it as acceptable, under the dead-hold cap. The chain you
> just assembled needs a beat to *be* a finished thing before it does anything —
> if the run started the instant Response arrived, the viewer wouldn't have
> registered "this is a complete workflow" before it started moving. The pause
> is the difference between "a thing that's still building" and "a built thing,
> now running." It's also where the opening narration lands ("an agent you
> built…"), so the still frame is carrying words, not silence.

### (c) The run — `runBeats(t, 3.6, {hold: 1.0})`

This is the reference run. Its sub-beats, all read off the helper with `a=3.6`:

- **`inputMix`** dips `Company name → Vantra Labs` over **[3.6, 3.95]** (0.35s).
- **`startBlip`** — Start's selection ring — fires **3.85 → 4.35**.
- **`pulse1`** rides edge 1 over **[4.1, 4.75]** (the `WirePulse` light streak,
  `len={55}`, on `edgeX1(0)→edgeX2(0)` at `CHAIN_EDGE_Y = 500`).
- **`midLive`** — Scout's live ring — holds **4.7 → 5.4** (the `midDur=0.7`
  live window).
- **`msgMix`** resolves `<start.input> → Vantra Labs` over **[4.65, 5.05]** —
  i.e. the Messages tag fills *the moment `pulse1` arrives at the Agent block*.
  Cause precedes effect by construction.
- **`pulse2`** rides edge 2 over **[5.4, 6.05]** (begins exactly as the live
  window ends).
- **`respMix`** resolves `<scout.content> → "AI infra, Series B"` over
  **[6.05, 6.4]** (`respStart = a + 1.75 + midDur = 6.05`).
- **revert** — every row dips back to its template together over **[7.4, 7.75]**
  (`respStart + 0.35 + hold = 7.4`).

What the viewer reads is a single causal sweep left to right: a value lands in
Start, light travels to the Agent, the Agent lights and its Messages fill, light
travels to the Response, the brief appears, hold, reset. No beat overlaps
another in a way that blurs it — each pulse departs as the previous block's work
completes.

> *"Why anchor the run at 3.6 instead of the first idle moment, ~2.05?"* Because
> assembly and the run are two different ideas and stacking them would blur both
> (the same reason the market-desk selection waits for the table to settle).
> Let the chain fully arrive, hold a beat so it reads as *built*, then run it.
> The gap is also what lets the narration say "an agent you built" over the
> assembled-idle frame *before* "…and it runs when you run it" over the run.
>
> *"Why `hold: 1.0`?"* That's the dwell on the fully-resolved frame before the
> revert: the brief sits readable in the Response from ~6.4s until the revert
> starts at 7.4s. One second is long enough to read `"AI infra, Series B"` and
> register "the run produced an output," short enough not to stall. Every later
> scene's `runBeats` reuses this same `hold` family so the resolved-frame dwell
> feels consistent across the video.
>
> *"Why does everything revert together at the end, instead of un-resolving in
> reverse order?"* Because the revert isn't part of the data story — it's the
> editor returning to its idle template so the *next* scene can open on a clean
> chain. A staged reverse-revert would imply the data "un-flowing," which is
> meaningless. One synchronized dip-back over 0.35s reads as "run finished,
> board cleared," full stop.

### (d) Tool-call sync — `chipRing = min(c(t, 4.95, 5.2), c(t, 5.6, 5.85, 1, 0))`

The **Search** chip on the Agent's Tools row rings: up over **[4.95, 5.2]**,
hold, down over **[5.6, 5.85]** (the `min` of a rising clamp and a falling
clamp builds the pulse-window shape). This window sits *entirely inside* the
Agent's live window (4.7→5.4), starting 0.25s after the live ring begins.

> *"Why nest the chip ring inside the Agent's live ring instead of giving it its
> own beat?"* Because the nesting *is* the meaning. The Agent is live (working);
> while it's working, one of its tools fires. If the chip rang before the Agent
> lit, or after it went idle, it would read as a separate event — "something
> else happened." Firing it 0.25s into the live window, and releasing it before
> the live window closes, says exactly "the agent, while working, called its
> tool." It's the product's own selection language used to show a tool
> invocation, with no words. Only the **Search** chip rings, not Docs —
> selecting both would be noise; one tool firing is a sentence.

### (e) The hold — ~7.75s to 9s

After the revert, the chain rests on its empty template behind only the
`CanvasDots` texture for about **1.25 seconds** before the cut.

> *"Isn't another still frame dead air?"* It's the breath before the cut, under
> the dead-hold cap, and it earns its place two ways. First, it lets the run
> *land* — the viewer just watched a value go in and a brief come out; a beat of
> stillness is what turns that from motion-you-watched into a fact-you-learned.
> Second, this is where the scene can *stretch* to fit the voiceover (the comp
> is VO-stretched to 9s). A scene that ends on a static, settled state can be
> extended to any length safely — there's no animation mid-flight to freeze.
> The exit state being "idle template, nothing moving" is precisely what makes
> the cut into scene 2 (which opens on that same idle template and starts
> dimming) seamless.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *What's the object?* A workflow → render the real `SimBlock` chain, with
   authentic rows, model name, and tool chips.
2. *How do I show only this workflow?* Render the **one** `EconomyRig` set piece
   with every later prop (pill, badges, partner) defaulted off → continuity is
   free across all six scenes.
3. *How does a chain arrive?* Blocks stagger left→right, wires drawing *into*
   still-arriving blocks → you read one continuous build, and you read its
   direction.
4. *How do I prove it's real without a caption?* Run it once — a value dips in,
   pulses travel, tags resolve, an output appears → the product's own run
   vocabulary, never words on screen.
5. *Why do values fill?* Because the run produced them, gated to pulse arrival →
   an honest depiction; cause precedes effect.
6. *How should it be framed?* Static, full-frame, no camera → the first scene
   earns the frame so the only move (scene 6's pull-back) can mean something.
7. *Why establish the run so carefully?* Because scenes 3–6 *quote* this exact
   grammar → spend the legibility here once, reuse it five times.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each one right. There's no single clever move — it's restraint and
honesty applied seven times, plus the long-game discipline of building a run
grammar the rest of the video can lean on.

## Exit state (what scene 2 inherits)

`chain assembled · entry = Start · rows reverted to template (idle by 7.75s) ·
no pill, no badges, no spokes, no partner · entryMix = 0 · camera static
full-frame`. Scene 2 opens on exactly this frame, dims Scout + Response to
0.35, and starts the Start→API header morph while the MCP pill fades in above
the entry. Because both scenes render the same `EconomyRig` at the same
`layout.ts` geometry, that boundary is identical down to the pixel.
