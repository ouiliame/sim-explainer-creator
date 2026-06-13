# Scene 3 — `wired-by-reference`  ·  archetype: **zoom-aside**

Source: `../source/scenes/WiredByReferenceScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the third scene, and it's the first one that points a magnifying glass
at a *single piece* of the desk instead of the whole board. The desk is
assembled (scene 2 left it idle). Now we answer the question every workflow
diagram raises but never explains: *how does the Polymarket block actually hand
its markets to the parallel?* The answer is one line of config — a reference —
and the entire job of this scene is to show that one line, in the product's own
editor, without anything else competing for your eye.

Read it as the worked example of the **zoom-aside**: the scene where you pause
the run, pull an element's anatomy out into an overlay, teach it, and put it
back exactly as you found it.

---

## What this scene is for

Scene 2 drew a wire from Polymarket into the Desk container. A wire is a
*claim* — "data flows here" — but it doesn't tell you *what* flows or *how the
binding is written*. In Sim, that binding isn't a special arrow; it's a
**reference**: a `<block.field>` token typed into a field, here
`<polymarket.markets>` sitting in the parallel's **Parallel Items**. That token
is the entire mechanism. When the desk runs, the parallel reads whatever array
that reference resolves to and fans one lane per element.

So the scene's single idea is: **a reference is what wires one block to
another.** Not a connector you drag — a value you write. One idea per scene
means this scene shows *only* that. It does not run anything, does not fan
anything, does not touch the table's contents. It opens an editor, glows one
tag, and closes the editor.

> *"Why give a reference its own scene at all — isn't it just config?"* Because
> it's the load-bearing concept the rest of the video assumes. Scene 6 fans
> five lanes; scene 7 resolves `<parallel.currentItem>` to a real market. Both
> only make sense if you already believe "a `<block.field>` token is a live
> binding, not a label." This scene is where that belief gets installed, on the
> simplest possible reference, before the run makes it move.

## What it looks like

The whole desk is on screen at home framing. The Desk container takes a thin
blue editing ring. Everything that *isn't* the container — the table above, the
Schedule and Polymarket blocks, the wires between them — fades back to about a
third of its brightness. An editor card slides in from the right and settles
over the dimmed area: a header (yellow Split chip + **Desk**), a **Parallel
Type** field reading `Parallel Each`, and a **Parallel Items** field holding the
reference tag `<polymarket.markets>`. The tag glows selection-blue, holds, fades
back to plain text. Then the card slides back out, the ring releases, and the
world brightens to exactly where it started.

## The one real decision: dim *selectively*, and lift the editor out as a separate overlay

Here is the scene's entire render:

```tsx
<Stage
  cam={CAM_ALL}
  tableIn={1 - 0.65 * dimW}
  sched={{dim: dimW}}
  poly={{dim: dimW}}
  cont={{highlighted: editing}}
  edge1={{opacity: 1 - 0.65 * dimW}}
  edge2={{opacity: 1 - 0.65 * dimW}}
  lanes={{2: {}}}
/>
<DeskConfigCard opacity={cardIn} slide={cardSlide} itemsGlow={itemsGlow} />
```

Two things to take from this, and they are the whole archetype.

**The dim is selective, applied per-element — *not* the Stage's global `dim`.**
The Stage component has a top-level `dim` prop that darkens the entire world at
once (`worldOp = 1 - 0.65 * dim`). This scene deliberately **does not use it.**
Instead it dims the table, the two outer blocks, and the two outer edges by hand
— each gets its own `1 - 0.65 * dimW` — while the container is left at full
brightness and given a `highlighted` ring. The result is a frame split into two
brightness planes: the focal object lit, everything else pushed back.

> *"Why dim each piece by hand when there's a one-line global dim prop?"*
> Because a global dim would take the *container down with everything else.* The
> whole point of a zoom-aside is that one element stays lit while its neighbors
> recede — that's how the viewer knows *what* is being explained. If I dimmed
> the world globally and then tried to re-brighten the container, I'd be fighting
> my own dim (re-lighting something I just darkened reads as a glow, not as
> "exempt"). Cleaner to dim only the four non-focal surfaces and never touch the
> container's opacity at all. The container isn't *re-highlighted* — it's simply
> *never dimmed.*

**The editor card is a sibling overlay in viewport space, not a child of the
stage.** Notice `DeskConfigCard` is rendered *outside* `<Stage>`, as the second
child of the `AbsoluteFill`. It does not live in stage coordinates, doesn't
move with the camera, isn't subject to the world dim. It floats in front of
everything at fixed screen position (`CARD_VX = 1290`, `CARD_VY = 300`).

> *"Why isn't the card part of the stage like every other block?"* Because it's
> a different *kind* of object. The blocks on the stage are the workflow — they
> live in the canvas and move with the camera. The editor card is a **panel** —
> in the real product it's a side sheet that opens over the canvas, in screen
> space, unaffected by canvas pan/zoom. Porting that faithfully means the card
> is an overlay, not a canvas citizen. It also keeps the dim honest: the dim
> applies to *the world*, and the card sits *above* the world, so it reads at
> full strength against the darkened backdrop — exactly like the product's panel
> over a dimmed canvas.

## Why no connector line between the container and the card

There is no wire, no leader line, no bracket joining the Desk container to the
editor card. The relationship between "this block" and "its config" is carried
**only by synchrony**: the card appears *as* the container gets its ring, glows
the tag *while* the container is the lit object, and leaves *as* the ring
releases. They animate together, so you read them as one thing.

> *"Wouldn't a connector line make the link explicit and clearer?"* It would
> make it *busier*, not clearer. A line implies dataflow — and that's the
> vocabulary this video reserves for actual wires (Schedule→Polymarket→Desk,
> and the inner pill→Analyst fan). Drawing a connector from a block to its
> editor would overload that vocabulary and invite the question "what flows along
> that line?" Nothing flows; the card *is* the block, opened up. Co-timing says
> "same object" without claiming "data moves between them." The zoom-aside's
> rule is: the aside and its subject share a clock, never a line.

## The camera

```ts
cam = CAM_ALL = { px: 1200, py: 735, s: 0.78 }
```

The camera does not move in this scene. It sits at **CAM_ALL**, the home framing
that holds the whole set piece (table + chain) — content bbox `x 128..2273,
y 150..1321`, center `(1200.5, 735.5)`, at `0.78×`.

> *"A zoom-aside is named 'zoom' — why doesn't the camera zoom in on the
> container?"* Because the *card* is the zoom. A literal camera push onto the
> container would lose the table, and we need the table visible-but-dimmed so the
> viewer keeps their bearings ("this config lives on the desk that fills that
> board"). So the "zoom" is done with hierarchy — dim the surround, float a
> magnified editor — rather than with the lens. Holding CAM_ALL steady also makes
> the boundaries trivial: scene 2 ended at CAM_ALL, scene 4 opens at CAM_ALL, and
> this scene never leaves it. The camera is a constant across the whole runless
> middle (scenes 3 and 4), which is one less thing that can jump on a cut.

## The values — every label traces to the product

The card's text is not invented. Each label is lifted verbatim from Sim's real
subflow editor (provenance is in the rig's comment above `DeskConfigCard`):

| field | value | source |
|---|---|---|
| (header) | `Desk` + Split chip | the container's own identity (`PARALLEL_COLOR = #FEE12B`, lucide `SplitIcon`) |
| Parallel Type | `Parallel Each` | `use-subflow-editor.ts` |
| Parallel Items | `<polymarket.markets>` | `subflow-editor.tsx` label; value is `ITEMS_REF` from `data.ts` |

`ITEMS_REF = "<polymarket.markets>"` is the one value that *matters* — it's the
reference the whole scene exists to show. It reads `<block-name>.<field>`:
the `markets` output of the Polymarket block. The header deliberately mirrors the
container's header on the canvas (same yellow Split chip, same **Desk** name, same
`PARALLEL_COLOR`) so the card reads unmistakably as *that* block's editor — the
visual link the absent connector line would otherwise have carried.

> *"Why `Parallel Each` and not, say, a count?"* Because that's the binding mode
> that makes the reference meaningful. `Parallel Each` means "iterate over the
> items array, one lane per element" — so `<polymarket.markets>` (an array of
> markets) becomes one analyst lane per market. The Type field is *context* for
> the Items field: it tells you the reference is going to be *fanned over*, which
> is precisely what scene 6 then does. Showing Type above Items isn't decoration;
> it's the half-sentence that makes the reference's job legible.

## The animation, beat by beat

Two helpers do all the timing, same as every scene in this build. `ramp(t, t0,
t1)` goes 0→1 as the clock crosses `t0`→`t1`, clamped outside. `pulseWindow(t,
a0, a1, b0, b1)` goes up over `a0`→`a1`, holds, comes back down over `b0`→`b1`.
Everything below is built from these two.

### (a) The world dims, the container rings up — `dimW = pulseWindow(t, 0.4, 0.9, 5.8, 6.3)` and `editing = t ≥ 0.5 && t < 6.0`

`dimW` is the single driver for *all four* dimmed surfaces. It rises over
**0.4s → 0.9s** (a ~0.5s fade-back), holds through the middle of the scene, and
falls over **5.8s → 6.3s**. Each surface consumes it the same way: the table is
`tableIn = 1 - 0.65 * dimW`, the two edges are `opacity: 1 - 0.65 * dimW`, and
the two blocks pass `dim: dimW` (the Stage's `visOpacity` helper turns that into
the identical `(1 - 0.65 * dim)` factor). One number, one window, four surfaces
— so they dim and undim as a single move.

> *"Why 0.35 specifically — why `1 - 0.65`?"* Because 0.35 is the brightness
> floor this whole series uses for 'present but not the subject.' It's dark
> enough to clearly recede (the lit container jumps forward), but *not* so dark
> that the surround vanishes — at 0.35 you can still read that there's a table up
> top and a chain below, which is the bearings the viewer needs. Go to ~0.1 and
> the surround effectively disappears, breaking continuity with the scenes on
> either side; stay above ~0.5 and the hierarchy is too weak to read as 'this one
> thing.' The `0.65` coefficient *is* 0.35: it's baked into `visOpacity` so every
> dim in the video lands on the same floor. Dim depth is a constant of the world,
> not a per-scene knob.

> *"Which elements dim, and which stay lit — and why those?"* Dimmed: the table,
> the Schedule block, the Polymarket block, edge1, edge2 — i.e. everything that
> is *context* for this beat. Lit (untouched): the Desk container and its inner
> lane (the Analyst / Update Board pair, passed through `lanes={{2: {}}}`). The
> rule is mechanical: the focal object and *its interior* stay at full
> brightness; its neighbors recede. The lane stays lit because it lives *inside*
> the container — dimming it would contradict 'the container is the subject.'

`editing` is a plain boolean window, `t ∈ [0.5, 6.0)`, fed to
`cont={{highlighted: editing}}`. That draws the container's blue inset ring
(`COLORS.secondary = #33b4ff`, the product's selection color).

> *"Why a hard boolean for the ring instead of a pulse like the dim?"* Because a
> selection ring in the real UI is binary — an element is selected or it isn't;
> it doesn't fade in over half a second. Snapping the ring on/off matches the
> product. The *dim* fades (it's an atmospheric move), but the *ring* is a state
> flag, so it toggles. Note the ring's window (0.5→6.0) sits just *inside* the
> dim's (0.4→6.3): the world starts receding a hair before the ring lands and
> finishes brightening a hair after the ring lets go, so the ring never appears
> against a still-bright frame or lingers against a re-lit one.

### (b) The editor card slides in and out — `cardIn = pulseWindow(t, 0.8, 1.4, 5.2, 5.8)`, `cardSlide = 1 - ramp(t, 0.8, 1.4)`

`cardIn` is the card's opacity: up over **0.8s → 1.4s**, hold, down over **5.2s
→ 5.8s**. `cardSlide` is its horizontal offset: `1 - ramp(t, 0.8, 1.4)` goes
from 1 (offset) to 0 (in place) over the *same* 0.8→1.4 window, and the card's
left is `CARD_VX + 80 * slide` — so it travels 80px from the right as it fades
in, then holds at rest.

> *"Why does the card enter at 0.8, after the dim starts at 0.4?"* Order of
> operations as a tiny piece of storytelling: first the world recedes and the
> container lights up (0.4–0.9), *then* the editor for that lit thing arrives
> (0.8–1.4). The ~0.4s overlap means it doesn't feel like two disconnected
> events, but the lead is enough that you read 'the desk got selected → its
> editor opened,' cause before effect. If the card arrived first, you'd be
> looking at a panel for a thing that wasn't yet the subject.

> *"Why only 80px of slide — why not fly it across the frame?"* Because a small
> travel paired with a fade reads as 'a panel opening,' which is the product
> gesture; a long fly-in reads as 'a card being thrown on screen,' which is
> trailer motion this series bans. 80px is just enough lateral movement to give
> the entrance a direction (from the right, where side panels live) without it
> becoming the event. The fade carries most of the entrance; the slide only
> flavors it.

> *"Why no easing on the slide?"* `cardSlide` is a raw `ramp` (linear). The slide
> is short (80px) and paired with an opacity fade that already softens the
> arrival; an ease would be imperceptible over that distance and would risk
> desyncing the slide from the fade (they share the 0.8→1.4 window and should
> move in lockstep). Linear keeps them locked.

Note the card's exit (opacity down 5.2→5.8) does *not* slide back out — `slide`
is `1 - ramp(t, 0.8, 1.4)`, which is pinned at 0 for the rest of the scene. The
card leaves by **fading only**, in place.

> *"Why fade out without sliding back?"* A symmetric slide-out would re-introduce
> motion right at the scene's tail, where we want things settling. Fading in
> place is the quietest possible exit — the editor just dismisses. The entrance
> earns a little direction (you're opening something); the exit doesn't need any
> (you're done). Asymmetry here is correct.

### (c) The reference tag glows, then releases — `itemsGlow = pulseWindow(t, 2.2, 2.8, 4.4, 5.0)`

This is the scene's payload. `itemsGlow` rises over **2.2s → 2.8s**, holds, and
falls over **4.4s → 5.0s** — about a 1.6s lit hold in the middle. It's passed
into the `Parallel Items` field's `<Tag>`, whose `glow` prop interpolates the
text from `COLORS.text` (`#e6e6e6`, plain) to `COLORS.secondary` (`#33b4ff`,
selection-blue) and fades in a `rgba(51,180,255, 0.14*glow)` background — the
exact treatment the editor gives a recognized `<block.field>` reference.

> *"Why glow the tag — what is the glow teaching?"* The glow is the definition of
> a reference, shown rather than said. Plain text in a field is just a string. A
> `<block.field>` token, when the editor recognizes it as a *live binding*,
> lights up selection-blue — that color is the product saying 'this is a
> resolved reference to another block, not literal text.' By ramping the tag from
> plain `#e6e6e6` *into* that blue, the animation enacts the moment of
> recognition: 'this isn't a label, it's a wire written as a value.' That single
> color transition is the whole lesson of the scene. It's also the same blue used
> for the editing ring and (later) `<parallel.currentItem>`'s glow — one color
> means 'reference / selection' across the entire video.

> *"Why does the glow fire at 2.2, well after the card lands at 1.4?"* Same
> discipline as scene 1's row-then-select: let the card fully arrive and settle
> (1.4), give the viewer a beat to read the two fields, *then* make the one
> pointing gesture (glow at 2.2). Stacking the card's entrance and the tag's glow
> in the same instant would blur both — you'd be reading layout and parsing a
> highlight at once. Separate them and each lands clean: here's the editor → *now
> look at this line.*

> *"Why does the glow release at 4.4–5.0, before the card even leaves at
> 5.2–5.8?"* Because the glow is transient recognition, and the scene's job is to
> *teach* the reference, not to leave it lit forever. The order on the way out is
> the reverse of the way in: the tag returns to plain text (4.4–5.0), *then* the
> card dismisses (5.2–5.8), *then* the ring releases and the world brightens
> (5.8–6.3). Recognition is a momentary act; the binding itself is permanent but
> unremarkable — so the tag ends as plain text, the same as it started.

## Why everything reverts before the scene ends

By **6.3s** every animated value is back to its starting state: `dimW` is 0 (world
at full brightness), `editing` is false (no ring), `cardIn` is 0 (card gone),
`itemsGlow` is 0 (tag plain). The scene leaves the desk in *exactly* the idle,
fully-lit state scene 2 handed it.

> *"Why undo everything — wasn't the point to show the reference?"* The point was
> to *teach* the reference, and the reference doesn't need to stay highlighted to
> stay true. More importantly, this is a runless aside dropped into the middle of
> the video: scene 4 needs to open on the same clean idle desk that scene 2 left,
> so it can arm the schedule from a neutral state. If this scene ended with a ring
> still on, or the table still dimmed, scene 4 would either inherit that or jump.
> The zoom-aside is a *parenthesis* — you open it, say the thing, and close it so
> the sentence around it is undisturbed. The boundary carries the template idle
> state, identical on both sides, by construction.

> *"Isn't reverting just to revert wasted motion?"* No — it's continuity made
> cheap. Because the scene returns to its enter state, the boundary into scene 4
> is the same frame as the boundary out of scene 2: idle desk, CAM_ALL, nothing
> lit. Three scenes share one rest state, so two cuts are free. A scene that
> *parks* in a changed state forces the next scene to either match the change or
> absorb a jump; a scene that *closes its own parenthesis* costs nothing
> downstream.

## How to think about the whole scene

Walk the decisions and each one answers a question:

1. *What am I explaining?* One reference (`<polymarket.markets>`) — so render the
   product's real editor, not a diagram of one.
2. *How do I make one element the subject without moving the camera?* Dim its
   neighbors to the 0.35 floor and leave it lit → hierarchy by brightness, the
   table still readable for bearings.
3. *How do I dim "everything but the container"?* Per-element dim (table, two
   blocks, two edges), never the global `dim` — the container is exempt, never
   re-lit.
4. *Where does the editor live?* A viewport-space overlay above the dimmed world,
   not a stage citizen → it reads as a panel, immune to the dim and the camera.
5. *How do I link block and editor without a wire?* Synchrony only — they share a
   clock, never a connector line, because lines mean dataflow and nothing flows.
6. *How do I show what a reference IS?* Ramp the tag from plain text into
   selection-blue → the product's own 'this is a live binding' treatment,
   enacted.
7. *How does the parenthesis close?* Everything reverts by 6.3s → the idle desk
   is identical on both boundaries, so scene 4 inherits a clean state.

There's no single clever move. The quality is the sum of seven small, restrained
decisions — and the restraint (steady camera, partial dim, no connector, full
revert) is what keeps it reading as a calm aside rather than a busy interlude.

## Exit state (what scene 4 inherits)

`desk idle and fully lit · no editing ring (released by 6.3s) · no card · tag
plain text · table + chain at full brightness · camera at CAM_ALL`. This is
pixel-identical to scene 2's exit and to scene 4's enter — the runless middle
shares one rest state across two cuts. The hold from 6.3s to the scene's end is
a latched settle on that idle desk, extend-safe by construction (no motion in
flight for the narration to interrupt).
