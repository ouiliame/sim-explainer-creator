# Scene 2 — `the-toolbelt`  ·  archetype: **preview-glance + smooth growth**

Source: `../source/scenes/TheToolbeltScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../../../src/components/SimBlock.tsx`.

This is the second scene of the video, and it does exactly one thing: it gives
the agent its tools. Scene 1 built a *normal* workflow — Start → Research →
Response. This scene reaches into the middle block and grows a row of tool chips
onto it, then names them one at a time. Read it as a worked example — the
smooth-growth reveal and the preview-glance discipline here are both moves you'll
reach for again.

---

## What this scene is for

The whole video's claim is "give an agent web tools and one prompt and it goes
out and works the web." Scene 1 deliberately withheld the tools — it showed a
plain agent so the toolbelt would read as *the change*. So this scene's entire
job is to make that change land: open a **Tools** row on the Research block and
populate it with three chips — Exa, Firecrawl, Browser Use — so the viewer can
see the agent's reach before any of it is exercised.

And that last clause is the whole archetype. This is a **preview-glance**: you
*name* what's coming without *teaching* it yet. The chips appear and each pulses
once — but nothing is called, nothing searches, nothing reads. The scene plants
three nouns ("finds / reads / acts") that scenes 3–5 will turn into verbs. The
rule it follows is *one idea per scene*: this scene is "here are the hands," full
stop. No run, no cards, no filmstrip. Resist the urge to fire the first tool
call here — that's scene 3's job, and stealing it would blur both beats.

## What it looks like

The same three-block chain from scene 1, sitting where it was. A blue selection
ring appears around the Research block — the product's "someone is editing this"
signal. A **Tools** row grows open underneath the block's existing rows, smoothly,
with no pop. Then three chips arrive in sequence: Exa, then Firecrawl, then
Browser Use, the last one dropping onto a second wrap line. As each chip lands it
takes a brief selection-ring pulse. The editing ring releases, and the
three-chip block settles.

## The one real decision: grow the tools onto the *real* block, in place

The scene renders this and almost nothing else:

```tsx
<Rig
  agent={{highlighted: t >= 0.6 && t < 7.0}}
  toolsReveal={grow(1.0, 0.7)}
  toolsWrapReveal={cv(t, 4.8, 5.4)}
  chips={{
    exa:       {reveal: grow(1.2), ring: wave(t, 2.2, 3.2, 0.3)},
    firecrawl: {reveal: grow(3.0), ring: wave(t, 3.8, 4.8, 0.3)},
    browser:   {reveal: cv(t, 5.0, 5.7), ring: wave(t, 5.9, 6.9, 0.3)},
  }}
/>
```

Three things to take from this.

**Use the real `SimBlock`, and grow the chips *into* it — never draw a separate
"tools" widget.** A tool chip in Sim is part of the agent block's configuration;
it lives in the block's own Tools row. So the surface on screen is the actual
`SimBlock` component (`apps/sim/.../preview-block-node.tsx`, ported ×1.5), fed a
`tools` array and a `toolsReveal` amount. You are never designing a chip rack
here; you're feeding the block the same `SimBlockTool[]` it takes in the product.

**It's the same single set piece as scene 1 (`<Rig/>`), with only `agent` props
changing.** Start and Response are still rendered — the scene just doesn't touch
them, so they sit at full opacity exactly where scene 1 left them. This is the
continuity rule the whole video runs on: one `<Rig/>`, every scene, state props
only. The boundary into this scene is identical by construction because the chain
isn't re-mounted — it's the literal same component, one prop deeper.

> *"Why grow the row in instead of just fading the chips on top of the block?"*
> Because the chips have *height*. A Tools row is 40px of block that didn't exist
> a moment ago, and the block's bottom edge — and therefore the green ring around
> it, and the rail spacing below — all depend on where that bottom edge is. If you
> faded chips in over a block whose box didn't change, the chips would overflow or
> float. Growing the row means the block's geometry is honest at every frame: the
> block is exactly as tall as its contents, the way the real product lays it out.
> The smooth-growth machinery (height-interpolate + negative-margin gap cancel,
> below) is what buys you "no pop" while keeping that honesty.

## The values, and why these three chips

The three tools are defined in the rig (`_rig.tsx`), not invented per-scene:

| chip | color | glyph | role (taught later) |
|---|---|---|---|
| Exa | `#1F40ED` | white lettermark | FIND — search returns sources |
| Firecrawl | `#181C1E` | multicolor flame | READ — pull a page as clean text |
| Browser Use | `#181C1E` | white mark | ACT — drive a real browser |

Every one of those colors is the registry's own chip color
(`apps/sim/blocks/blocks/{exa,firecrawl,browser_use}.ts`), and every glyph is
ported from `apps/sim/components/icons.tsx`. This is the port-don't-design rule at
its most literal: you do not get to pick a palette for the toolbelt. The toolbelt
*is* three specific products with three specific brand marks, and the scene's
credibility comes entirely from those being right.

> *"Why these three and not, say, four tools to match the four cards later?"*
> Because the count is grounded, not chosen for symmetry. Exa + Firecrawl is the
> registry's actual "research stack" template (Firecrawl's block meta describes
> "an agent that uses Exa to find authoritative URLs… scrapes each with
> Firecrawl"); Browser Use is added for the pages scraping can't read. Three tools,
> three distinct *reaches*. The four evidence cards in scene 3+ come from four
> *calls* (Firecrawl gets called twice), not four tools — the mapping is calls→cards,
> never tools→cards. Don't let a later count tempt you into padding this one.

## The animation, beat by beat

Three tiny helpers do all the timing. `grow(t0, dur=0.6)` is an **eased** ramp:
it goes 0→1 over `t0 → t0+dur` with `EASING.out` (the theme's
`bezier(0.16, 1, 0.3, 1)` — a fast-out, gentle-settle entrance curve), clamped
outside. `cv(t, lo, hi)` is the *linear* clamped ramp (no easing). `wave(t, a, b,
ramp)` rises over `ramp` seconds at `a`, holds, and falls back to zero over `ramp`
seconds ending at `b`. The whole scene is built from these three, and *which* one
each value uses is itself a decision (see the easing note under the chips).

### (a) The editing ring appears — `agent.highlighted = t ∈ [0.6, 7.0)`

The Research block gets a selection ring from 0.6s to 7.0s. In `SimBlock`,
`highlighted` draws an `inset 0 0 0 2.625px` ring in the secondary (selection-blue)
color — the product's own "this block is selected / being edited" state.

> *"Why bracket the *entire* growth with one ring instead of pulsing it per
> chip?"* Because the ring is answering "why are these chips appearing?" The honest
> answer is *someone is editing this block* — adding tools to it — and that edit is
> one continuous action that spans all three chips. A single ring held across the
> whole sequence says "this is one editing session." Pulsing it per chip would
> imply three separate edits, which is a lie about what's happening, and visually
> busier for no gain.
>
> *"Why start at 0.6, before the Tools row even opens at 1.0?"* The ring is the
> *cause*; the row growing is the *effect*. Selecting the block has to visibly
> precede editing its contents, or the edit looks like it came from nowhere. 0.4s
> of "block selected, nothing changed yet" reads as a hand landing on the block
> before it starts typing.
>
> *"Why release at 7.0 and not just hold to the end?"* Because the scene has to
> *settle* — the exit state this scene hands to scene 3 is a plain, un-selected
> template chain (no editing ring), so the run in scene 3 can start clean. The ring
> releasing at 7.0 (the last chip's pulse finishes at 6.9) is the visual "edit
> done, deselect." Everything transient in this scene reverts before the cut; the
> ring is the outermost layer of that discipline.

### (b) The Tools row grows open — `toolsReveal = grow(1.0, 0.7)`

The Tools row opens over **1.0s → 1.7s**, eased. Inside `SimBlock`, a
`toolsReveal < 1` sets the row's `height: CHIP_LINE_H * toolsReveal` and a
`marginTop: -ROW_GAP * (1 - toolsReveal)` — the height grows from 0 to the natural
40px chip-line height while the negative margin cancels the flex gap that would
otherwise pop in fully-formed. That gap-cancel is the entire trick to "no pop":
without it, the 12px row gap appears at full size on frame one and the block jumps
12px taller before the row has any height.

> *"Where does 40px (`CHIP_LINE_H`) come from — why not compute it?"* It was
> **measured from a render**, not derived. The comment in `SimBlock` is explicit:
> the arithmetic (text 27 + padding 9 + border 2 = 38) under-counts by 2px, so the
> code trusts the rasterizer and hard-codes 40. This matters because the grow
> animates *to* this exact height — if it animated to 38 and the chips actually
> need 40, the last 2px would pop on the final frame or the chip borders would clip
> mid-reveal. "Trust the rasterizer, not the math" is the rule; the measured
> constant is how you obey it.
>
> *"Why 0.7s for this row but 0.6s default for the chips?"* The row is the bigger,
> structural move — the block changing shape — so it gets slightly more time to
> feel deliberate. The chips growing inside it are smaller events and take the
> snappier default. It's the same logic as scene 1's calm establishing fade vs.
> faster later motion: the size of the change sets its duration.

### (c) The first two chips grow in — `exa = grow(1.2)`, `firecrawl = grow(3.0)`

Exa reveals over **1.2s → 1.8s**, Firecrawl over **3.0s → 3.6s**. A chip's
`reveal` feeds `opacity` *and*, while `< 1`, a `maxWidth: chipNaturalWidth(name) *
reveal` with a `marginLeft: -7.5px * (1 - reveal)` — so the chip grows in *width*
from zero to its measured natural width, sliding its line-mates rightward smoothly
rather than appearing full-size and shoving them. `chipNaturalWidth` is computed
with `@remotion/layout-utils` (`24 + 7.5 + textWidth(name, 18) + 18 + 2`), so the
target width is the chip's real rendered width, not a guess.

> *"Why does Exa start at 1.2 — INSIDE the row's 1.0→1.7 reveal — instead of
> waiting for the row to finish?"* This is the subtlest decision in the scene, and
> the scene's own comment flags it. If the row opened to its full 40px height
> *empty* and then the first chip mounted, you'd get a `31.5 → 40px` pop: a bare
> label row is shorter than a chip-line row, so the block would settle at one
> height and then jump taller when Exa arrived. By mounting Exa at 1.2 — while the
> row is still growing — the row opens *straight to* chip-line height, because it
> already has a chip in it. Cause (row opening) and effect (chip appearing) overlap
> just enough that the block only ever has one height target. Overlapping these two
> reveals isn't sloppiness; it's what prevents the pop.
>
> *"Where does the ~1.8s chip-to-chip cadence come from?"* (Exa pulse done at 3.2,
> Firecrawl reveal at 3.0; Firecrawl pulse done at 4.8, Browser Use reveal at 5.0.)
> It's chosen against the same two bounds scene 1's row stagger was. Too tight and
> the three chips read as one block — the viewer can't register three distinct
> tools. Too loose and naming three chips eats ten seconds of dead time. ~1.8s lets
> each chip *appear, then pulse, then* the next appears — the eye lands on one tool,
> sees it acknowledged, moves to the next. Pick the cadence once and hold it; the
> regularity is what makes the sequence feel composed.

### (d) Each chip pulses once on landing — `ring: wave(t, …, …, 0.3)`

Exa rings `wave(2.2, 3.2, 0.3)`, Firecrawl `wave(3.8, 4.8, 0.3)`, Browser Use
`wave(5.9, 6.9, 0.3)`. Each is a ~1s pulse: a selection ring on that one chip
rises over 0.3s, holds briefly, falls over 0.3s. In `SimBlock` the chip `ring`
draws an `inset 0 0 0 2.25px` selection-ring inside the chip border.

> *"What is this pulse *for*, if no tool is being called yet?"* It's a
> pre-teaching gesture. Scenes 3–5 use exactly this chip ring to mean "this tool is
> being called right now" — and crucially, *in sync with a card being born in the
> rail* (the video's whole equation: ring = card birth). By ringing each chip once
> here, as it's introduced, the scene pre-installs the vocabulary: when you see a
> chip ring *later*, you already associate it with that specific tool. It's the
> same move as scene 1 selecting one table row to silently define "a row is a
> record" — a wordless gesture that teaches a mapping you'll need.
>
> *"Why fire the pulse ~1s after each chip appears, not on arrival?"* So the two
> ideas don't collide. The chip *appearing* is "here is a tool"; the chip *ringing*
> is "and this is what a call to it looks like." Let the chip land and settle, then
> ring it. Stacking the arrival and the pulse in the same instant would blur "a tool
> exists" with "a tool is active" — give each its own beat, the same air-per-idea
> rule scene 1 applied to its reveal-vs-selection split.

### (e) The wrap line opens and Browser Use fades in — `toolsWrapReveal = cv(t, 4.8, 5.4)`, `browser.reveal = cv(t, 5.0, 5.7)`

This is the one chip handled differently, and the difference is deliberate. "Browser
Use" is wide enough that it doesn't fit on line one — it owns the chips' *second*
wrap line. So two things happen in order: first the **line opens** (`toolsWrapReveal`
grows the chip container's height from one natural line to exactly two, over
4.8→5.4s), and then the Browser Use chip **fades in at full width** over 5.0→5.7s.
Note both use `cv` (linear), not `grow`, and the chip is flagged `fade: true` in
the rig so it reveals by opacity rather than width-growth.

> *"Why does Browser Use fade in while the other two width-grew?"* Because a
> width-growing chip on a *wrapping* line would jump lines mid-reveal. Picture it:
> as the chip grows wider, at some width it stops fitting on line one and flex-wrap
> kicks it to line two — a one-frame teleport. The other two chips never wrap, so
> width-growth is safe for them. The chip that owns the wrap boundary can't use it;
> it has to arrive at its final width atomically (a fade) onto a line that's already
> been opened for it. The scene's comment states exactly this: "width-growth would
> jump lines mid-reveal." Match the reveal style to whether the chip crosses a wrap.
>
> *"Why open the line (4.8) slightly before the chip fades (5.0)?"* Same
> cause-before-effect discipline as everywhere else: the *space* has to exist before
> the thing that fills it appears. Opening the line first means the block grows its
> second row of height, and *then* the chip materializes into that already-present
> space — never a chip appearing and shoving the block taller in the same frame.

### (f) The settle — from ~7.0s to the end of the scene

After Browser Use's pulse finishes (6.9) and the editing ring releases (7.0),
nothing moves. The three-chip block just rests.

> *"Isn't a still frame dead air?"* No — this is the new thesis object. Scene 1's
> hold let the bare table land; this hold lets the *armed agent* land — the viewer
> needs a beat to take in "this block now has three tools." And as in scene 1,
> there's a downstream reason: this scene's tail is where its narration plays, and a
> scene that ends on a fully-settled state can be *stretched* to whatever length the
> voiceover runs without freezing a motion mid-flight. (The choreography notes this
> hold runs ~4s, slightly over the visual cap, with narration covering it.) Ending
> on a settled hold is what makes the audio step painless — taste and pipeline agree.

## How to think about the whole scene

Walk the decisions in order and you can see a question driving each one:

1. *What changed since scene 1?* The agent got tools → grow a Tools row onto the
   **same** Research block, in place.
2. *How do I show only that change?* Render the one set piece; touch only the
   `agent` props → Start, Response, and the boundary are untouched and free.
3. *How does a row grow without a pop?* Animate its height with the gap cancelled,
   and mount the first chip *inside* the row's reveal → the block has one height
   target, never two.
4. *Whose hand is doing this?* The product's editing ring, bracketing the whole
   sequence → "one editing session," in product vocabulary, no caption.
5. *How do I name three tools as three?* Appear, then pulse, at a steady ~1.8s
   cadence → three distinct reaches, not one blob.
6. *What about the chip that wraps?* Open the line first, then fade the chip in at
   full width → no mid-reveal line jump.
7. *Do I teach what they do?* No — pulse each once to pre-install "ring = this tool,"
   and stop. The verbs are scenes 3–5's. → an honest preview-glance.

Every one of those is a small decision, and the quality of the scene is the sum of
getting each one right. There's no single clever move — it's restraint applied
seven times, with the smooth-growth machinery doing the quiet work of keeping the
block honest at every frame.

## Exit state (what scene 3 inherits)

`chain in template state · Research block with all three chips at reveal 1
(pixel-static) · no editing ring (released 7.0s) · no chip rings · no rail, no
cards · camera static full-frame`. Scene 3 opens on exactly this frame and starts
the run: Start blips, the wire pulses, and the agent goes live. Because both
scenes render the same `<Rig/>` with the chips already at full reveal, that
boundary is identical down to the pixel — the continuity contract calls this the
"chain + 3 chips at reveal 1 (template)" handoff.
