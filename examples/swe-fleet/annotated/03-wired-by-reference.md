# Scene 3 — `wired-by-reference`  ·  archetype: **zoom-aside**

Source: `../source/scenes/WiredByReferenceScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the third scene, and it's the first one that points a magnifying glass
at a *single piece* of the fleet instead of the whole set piece. The chain is
assembled (scene 2 left it idle at home framing). Now we answer the question the
assembly diagram raises but never explains: *how does the Get Issues query
actually hand its rows to the parallel?* The answer is one line of config — a
reference — and the entire job of this scene is to show that one line, in the
product's own subflow editor, without anything else competing for your eye.

Read it as the worked example of the **zoom-aside**: the scene where you pause
the run (here there is no run yet — it's a runless aside), pull an element's
anatomy out into an overlay, teach it, and put it back exactly as you found it.

---

## What this scene is for

Scene 2 drew a wire from Get Issues into the Fleet container. A wire is a
*claim* — "data flows here" — but it doesn't tell you *what* flows or *how the
binding is written*. In Sim, that binding isn't a special arrow; it's a
**reference**: a `<block.field>` token typed into a field, here
`<getissues.rows>` sitting in the parallel's **Parallel Items**. That token is
the entire mechanism. When the fleet runs, the parallel reads whatever array
that reference resolves to — the rows the query returned — and fans one coding
lane per element.

So the scene's single idea is: **a reference is what wires one block to
another.** Not a connector you drag — a value you write. One idea per scene means
this scene shows *only* that. It does not run anything, does not fan anything,
does not touch the table's contents. It opens an editor, glows one tag, and
closes the editor.

> *"Why give a reference its own scene at all — isn't it just config?"* Because
> it's the load-bearing concept the rest of the video assumes. Scene 6 fans five
> lanes; scene 7 resolves `<parallel.currentItem>` to a real issue row. Both
> only make sense if you already believe "a `<block.field>` token is a live
> binding, not a label." This scene is where that belief gets installed, on the
> simplest possible reference — the queue-to-fleet wire — before the run makes it
> move. It's also the *first half of a pair* with the inner `<parallel.currentItem>`
> tag the later scenes resolve: the same blue, the same "this is a reference"
> grammar, taught here on the static case and paid off there on the live one.

## What it looks like

The whole set piece is on screen at home framing. The Fleet container takes a
thin blue editing ring. Everything that *isn't* the container — the backlog
table above, the Schedule and Get Issues blocks, the wires between them — fades
back to about a third of its brightness. An editor card slides in from the right
and settles over the dimmed area: a header (yellow Split chip + **Fleet**), a
**Parallel Type** field reading `Parallel Each`, and a **Parallel Items** field
holding the reference tag `<getissues.rows>`. The tag glows selection-blue,
holds, fades back to plain mono text. Then the card slides out (fades, in place),
the ring releases, and the world brightens to exactly where it started.

## The one real decision: dim *selectively*, and lift the editor out as a separate overlay

Here is the scene's entire render:

```tsx
<Stage
  cam={CAM_ALL}
  tableIn={1 - 0.65 * dimW}
  sched={{dim: dimW}}
  query={{dim: dimW}}
  cont={{highlighted: editing}}
  edge1={{opacity: 1 - 0.65 * dimW}}
  edge2={{opacity: 1 - 0.65 * dimW}}
  lanes={{2: {}}}
/>
<FleetConfigCard opacity={cardIn} slide={cardSlide} itemsGlow={itemsGlow} />
```

Two things to take from this, and they are the whole archetype.

**The dim is selective, applied per-element — *not* the Stage's global `dim`.**
The Stage component has a top-level `dim` prop that darkens the entire world at
once (`worldOp = 1 - 0.65 * dim`). This scene deliberately **does not use it.**
Instead it dims the table, the two outer blocks (`sched`, `query`), and the two
outer edges by hand — each gets its own `1 - 0.65 * dimW` — while the container is
left at full brightness and given a `highlighted` ring. The result is a frame
split into two brightness planes: the focal object lit, everything else pushed
back.

> *"Why dim each piece by hand when there's a one-line global dim prop?"*
> Because a global dim would take the *container down with everything else.* The
> whole point of a zoom-aside is that one element stays lit while its neighbors
> recede — that's how the viewer knows *what* is being explained. If I dimmed the
> world globally and then tried to re-brighten the container, I'd be fighting my
> own dim (re-lighting something I just darkened reads as a glow, not as
> "exempt"). Cleaner to dim only the five non-focal surfaces (table + two blocks
> + two edges) and never touch the container's opacity at all. The container
> isn't *re-highlighted* — it's simply *never dimmed.*

> *"Why is the prop `query` here, when the twin video dimmed `poly`?"* Same
> mechanism, different chain. This video's middle block is **Get Issues** (a
> Table-query block), so the second outer block's state prop is `query`, and the
> reference it owns is `<getissues.rows>` — the `rows` array that query outputs.
> The other desk's middle block was Polymarket, so it dimmed `poly` and its
> reference was `<polymarket.markets>`. The archetype is identical; only the
> block names and the one reference value change. That's the whole point of
> reading the twin: the *shape* transfers, the *content* comes from your
> product's chain.

**The editor card is a sibling overlay in viewport space, not a child of the
stage.** Notice `FleetConfigCard` is rendered *outside* `<Stage>`, as the second
child of the `AbsoluteFill`. It does not live in stage coordinates, doesn't move
with the camera, isn't subject to the world dim. It floats in front of everything
at fixed screen position (`CARD_VX = 1290`, `CARD_VY = 300`, `CARD_W = 560`).

> *"Why isn't the card part of the stage like every other block?"* Because it's a
> different *kind* of object. The blocks on the stage are the workflow — they
> live in the canvas and move with the camera. The editor card is a **panel** —
> in the real product it's a side sheet that opens over the canvas, in screen
> space, unaffected by canvas pan/zoom. Porting that faithfully means the card is
> an overlay, not a canvas citizen. It also keeps the dim honest: the dim applies
> to *the world*, and the card sits *above* the world, so it reads at full
> strength against the darkened backdrop — exactly like the product's panel over
> a dimmed canvas. (`CARD_VX = 1290` puts the card's left edge in the right half
> of the 1920-wide viewport, over the dimmed table/chain, not on top of the lit
> container at `CONT_X` — the panel sits *beside* its subject, the way a real side
> sheet does.)

## Why no connector line between the container and the card

There is no wire, no leader line, no bracket joining the Fleet container to the
editor card. The relationship between "this block" and "its config" is carried
**only by synchrony**: the card appears *as* the container gets its ring, glows
the tag *while* the container is the lit object, and leaves *as* the ring
releases. They animate together, so you read them as one thing.

> *"Wouldn't a connector line make the link explicit and clearer?"* It would make
> it *busier*, not clearer. A line implies dataflow — and that's the vocabulary
> this video reserves for actual wires (Schedule→Get Issues→Fleet, and the inner
> Start-pill→Engineer fan). Drawing a connector from a block to its editor would
> overload that vocabulary and invite the question "what flows along that line?"
> Nothing flows; the card *is* the block, opened up. Co-timing says "same object"
> without claiming "data moves between them." The zoom-aside's rule is: the aside
> and its subject share a clock, never a line. The header — same yellow Split chip,
> same **Fleet** name, same `PARALLEL_COLOR = #FEE12B` — is what carries the visual
> identity the absent line would otherwise have had to.

## The camera

```ts
cam = CAM_ALL = { px: 1395, py: 740, s: 0.7 }
```

The camera does not move in this scene. It sits at **CAM_ALL**, the home framing
that holds the whole set piece (table + chain) at `0.7×`, centered on stage point
`(1395, 740)` — `cameraTo` maps that point to the viewport center.

> *"A zoom-aside is named 'zoom' — why doesn't the camera zoom in on the
> container?"* Because the *card* is the zoom. A literal camera push onto the
> container would lose the backlog table, and we need the table visible-but-dimmed
> so the viewer keeps their bearings ("this config lives on the fleet that fills
> that backlog"). So the "zoom" is done with hierarchy — dim the surround, float a
> magnified editor — rather than with the lens. Holding CAM_ALL steady also makes
> the boundaries trivial: scene 2 ended at CAM_ALL, scene 4 (lights-out) opens at
> CAM_ALL, and this scene never leaves it. The camera is a constant across the
> whole runless front half (scenes 2→3→4 all rest at CAM_ALL), which is one less
> thing that can jump on a cut.

## The values — every label traces to the product

The card's text is not invented. Each label is lifted verbatim from Sim's real
subflow editor (provenance is in the rig's comment above `FleetConfigCard`, and
re-derived in `script-v1.md`'s grounding block):

| field | value | source |
|---|---|---|
| (header) | `Fleet` + Split chip | the container's own identity (`PARALLEL_COLOR = #FEE12B`, lucide `SplitIcon`, `subflows/parallel/parallel-config.ts`) |
| Parallel Type | `Parallel Each` | `use-subflow-editor.ts` typeLabels |
| Parallel Items | `<getissues.rows>` | `subflow-editor.tsx:159` label; value is `ITEMS_REF` from `data.ts` |

`ITEMS_REF = "<getissues.rows>"` is the one value that *matters* — it's the
reference the whole scene exists to show. It reads `<block-name>.<field>`: the
`rows` output of the Get Issues block (a Table-query block; its `Query Rows`
operation outputs an array named `rows`, grounded in `table.ts` and the docs'
table-query output spec). So the token says, literally, "iterate over the array
that the Get Issues query produced." The header deliberately mirrors the
container's header on the canvas (same yellow Split chip, same **Fleet** name,
same `PARALLEL_COLOR`) so the card reads unmistakably as *that* block's editor.

> *"Why `Parallel Each` and not, say, a count?"* Because that's the binding mode
> that makes the reference meaningful. `Parallel Each` means "iterate over the
> items array, one lane per element" — so `<getissues.rows>` (an array of open
> issues) becomes one Engineer lane per issue. The Type field is *context* for
> the Items field: it tells you the reference is going to be *fanned over*, which
> is precisely what scene 6 then does. Showing Type above Items isn't decoration;
> it's the half-sentence that makes the reference's job legible. (The alternative
> mode, `Parallel Count`, would fan a fixed N copies with no per-item input — which
> would make `<getissues.rows>` meaningless, because nothing would consume the
> array. `Parallel Each` is the only mode under which this reference does work.)

> *"Why is the Items value rendered in mono and the labels in the sans `FONT`?"*
> Product fidelity. Field *labels* ("Parallel Type", "Parallel Items") are chrome
> text in the editor's sans stack; field *values* that are code-like — a
> `<block.field>` reference — render in the editor's mono stack, because they're
> tokens you'd type, not prose. The card uses `MONO` only for the reference value
> and `Parallel Each` stays in `FONT` because it's a chosen label from a dropdown,
> not a typed token. Matching that split is part of "port the product, don't
> design."

## The animation, beat by beat

Two helpers do all the timing, same as every scene in this build. `ramp(t, t0,
t1)` goes 0→1 as the clock crosses `t0`→`t1`, clamped outside. `pulseWindow(t,
a0, a1, b0, b1)` goes up over `a0`→`a1`, holds, comes back down over `b0`→`b1`.
Everything below is built from these two. Note the scene's clock runs to ~12s
(the VO-stretched length, per `CHOREOGRAPHY.md`), which is why every window below
sits later than the twin's ~6s version — the *shape* is identical, the hold in the
middle is just longer to sit under more narration.

### (a) The world dims, the container rings up — `dimW = pulseWindow(t, 0.4, 0.9, 10.2, 10.7)` and `editing = t ≥ 0.5 && t < 10.4`

`dimW` is the single driver for *all five* dimmed surfaces. It rises over **0.4s →
0.9s** (a ~0.5s fade-back), holds through the middle of the scene, and falls over
**10.2s → 10.7s**. Each surface consumes it the same way: the table is `tableIn =
1 - 0.65 * dimW`, the two edges are `opacity: 1 - 0.65 * dimW`, and the two blocks
pass `dim: dimW` (the Stage's `visOpacity` helper turns that into the identical
`(1 - 0.65 * dim)` factor). One number, one window, five surfaces — so they dim and
undim as a single move.

> *"Why 0.35 specifically — why `1 - 0.65`?"* Because 0.35 is the brightness floor
> this whole series uses for 'present but not the subject.' It's dark enough to
> clearly recede (the lit container jumps forward), but *not* so dark that the
> surround vanishes — at 0.35 you can still read that there's a backlog table up
> top and a chain below, which is the bearings the viewer needs. Go to ~0.1 and
> the surround effectively disappears, breaking continuity with the scenes on
> either side; stay above ~0.5 and the hierarchy is too weak to read as 'this one
> thing.' The `0.65` coefficient *is* 0.35: it's baked into `visOpacity` so every
> dim in the video lands on the same floor. Dim depth is a constant of the world,
> not a per-scene knob — the same 0.35 floor reappears as the cell-tint residue in
> scenes 7–8, so "0.35 means *backgrounded but persistent*" is a vocabulary the
> whole video speaks.

> *"Which elements dim, and which stay lit — and why those?"* Dimmed: the backlog
> table, the Schedule block, the Get Issues block (`query`), edge1, edge2 — i.e.
> everything that is *context* for this beat. Lit (untouched): the Fleet container
> and its inner lane (the Engineer / GitHub / Mark Done triplet, passed through
> `lanes={{2: {}}}`). The rule is mechanical: the focal object and *its interior*
> stay at full brightness; its neighbors recede. The lane stays lit because it
> lives *inside* the container — dimming it would contradict 'the container is the
> subject.' Passing `lanes={{2: {}}}` (an empty state object for lane 2, the
> followed lane) is what renders that interior at default full opacity; omit it and
> the container would be an empty lit box, which would read as "nothing's in
> here."

`editing` is a plain boolean window, `t ∈ [0.5, 10.4)`, fed to
`cont={{highlighted: editing}}`. That drives `FleetContainer`'s `showRing` and
draws the container's blue inset ring (`COLORS.secondary = #33b4ff`, the product's
selection color, via `boxShadow: inset 0 0 0 ${1.75 * S}px`).

> *"Why a hard boolean for the ring instead of a pulse like the dim?"* Because a
> selection ring in the real UI is binary — an element is selected or it isn't; it
> doesn't fade in over half a second. Snapping the ring on/off matches the
> product. The *dim* fades (it's an atmospheric move), but the *ring* is a state
> flag, so it toggles. Note the ring's window (0.5→10.4) sits just *inside* the
> dim's (0.4→10.7): the world starts receding a hair before the ring lands (0.4 <
> 0.5) and finishes brightening a hair after the ring lets go (10.4 < 10.7), so the
> ring never appears against a still-bright frame or lingers against a re-lit one.

### (b) The editor card slides in and out — `cardIn = pulseWindow(t, 0.8, 1.4, 9.6, 10.2)`, `cardSlide = 1 - ramp(t, 0.8, 1.4)`

`cardIn` is the card's opacity: up over **0.8s → 1.4s**, hold, down over **9.6s →
10.2s**. `cardSlide` is its horizontal offset: `1 - ramp(t, 0.8, 1.4)` goes from 1
(offset) to 0 (in place) over the *same* 0.8→1.4 window, and the card's left is
`CARD_VX + 80 * slide` — so it travels 80px from the right as it fades in, then
holds at rest.

> *"Why does the card enter at 0.8, after the dim starts at 0.4?"* Order of
> operations as a tiny piece of storytelling: first the world recedes and the
> container lights up (0.4–0.9), *then* the editor for that lit thing arrives
> (0.8–1.4). The ~0.4s overlap means it doesn't feel like two disconnected events,
> but the lead is enough that you read 'the fleet got selected → its editor
> opened,' cause before effect. If the card arrived first, you'd be looking at a
> panel for a thing that wasn't yet the subject. (This is the product's own
> order, too: you click the block, *then* the inspector opens — never the reverse.)

> *"Why only 80px of slide — why not fly it across the frame?"* Because a small
> travel paired with a fade reads as 'a panel opening,' which is the product
> gesture; a long fly-in reads as 'a card being thrown on screen,' which is the
> trailer motion this series bans. 80px is just enough lateral movement to give
> the entrance a direction (from the right, where side panels live) without it
> becoming the event. The fade carries most of the entrance; the slide only
> flavors it.

> *"Why no easing on the slide?"* `cardSlide` is a raw `ramp` (linear). The slide
> is short (80px) and paired with an opacity fade that already softens the
> arrival; an ease would be imperceptible over that distance and would risk
> desyncing the slide from the fade (they share the 0.8→1.4 window and should move
> in lockstep). Linear keeps them locked.

Note the card's exit (opacity down 9.6→10.2) does *not* slide back out — `slide`
is `1 - ramp(t, 0.8, 1.4)`, which is pinned at 0 for the rest of the scene. The
card leaves by **fading only**, in place.

> *"Why fade out without sliding back?"* A symmetric slide-out would re-introduce
> motion right at the scene's tail, where we want things settling. Fading in place
> is the quietest possible exit — the editor just dismisses. The entrance earns a
> little direction (you're opening something); the exit doesn't need any (you're
> done). Asymmetry here is correct.

### (c) The reference tag glows, then releases — `itemsGlow = pulseWindow(t, 2.6, 3.2, 7.8, 8.4)`

This is the scene's payload. `itemsGlow` rises over **2.6s → 3.2s**, holds, and
falls over **7.8s → 8.4s** — about a 4.6s lit hold in the middle, the single
longest-held gesture in the scene because the scene has exactly one thing to say.
It's passed into the `Parallel Items` field's `<Tag>`, whose `glow` prop
interpolates the text from `COLORS.text` (`#e6e6e6`, plain) to `COLORS.secondary`
(`#33b4ff`, selection-blue) and fades in a `rgba(51,180,255, 0.14*glow)`
background — the exact treatment the editor gives a recognized `<block.field>`
reference.

> *"Why glow the tag — what is the glow teaching?"* The glow is the definition of
> a reference, shown rather than said. Plain text in a field is just a string. A
> `<block.field>` token, when the editor recognizes it as a *live binding*, lights
> up selection-blue — that color is the product saying 'this is a resolved
> reference to another block, not literal text.' By ramping the tag from plain
> `#e6e6e6` *into* that blue, the animation enacts the moment of recognition:
> 'this isn't a label, it's a wire written as a value.' That single color
> transition is the whole lesson of the scene. It's also the same blue used for
> the editing ring here and (later) for `<parallel.currentItem>`'s glow in scenes
> 6–7 — one color means 'reference / selection' across the entire video, so when
> the viewer sees blue on a token later, they already know it means "this resolves
> to something."

> *"Why does the glow fire at 2.6, well after the card lands at 1.4?"* Same
> discipline as scene 1's row-then-select: let the card fully arrive and settle
> (1.4), give the viewer a beat to read the two fields, *then* make the one
> pointing gesture (glow at 2.6). Stacking the card's entrance and the tag's glow
> in the same instant would blur both — you'd be reading layout and parsing a
> highlight at once. Separate them and each lands clean: here's the editor → *now
> look at this line.* The ~1.2s gap between the card settling (1.4) and the glow
> starting (2.6) is the longest such pause in the scene, deliberately, because the
> two-field card needs reading time before you point inside it.

> *"Why does the glow release at 7.8–8.4, well before the card even leaves at
> 9.6–10.2?"* Because the glow is transient recognition, and the scene's job is to
> *teach* the reference, not to leave it lit forever. The order on the way out is
> the reverse of the way in: the tag returns to plain text (7.8–8.4), *then* the
> card dismisses (9.6–10.2), *then* the ring releases (10.4) and the world
> brightens (10.2–10.7). Last in, first out. Recognition is a momentary act; the
> binding itself is permanent but unremarkable — so the tag ends as plain text, the
> same as it started. The ~1.4s gap between glow-off (8.4) and card-out (9.6) is a
> small breath where you see the now-quiet reference sitting as ordinary text,
> which quietly reinforces "it was always there; the glow was just us pointing."

## Why everything reverts before the scene ends

By **10.7s** every animated value is back to its starting state: `dimW` is 0
(world at full brightness), `editing` is false (no ring), `cardIn` is 0 (card
gone), `itemsGlow` is 0 (tag plain). The scene leaves the fleet in *exactly* the
idle, fully-lit state scene 2 handed it. The ~1.3s tail (10.7s → ~12s) is a
latched settle on that restored idle frame.

> *"Why undo everything — wasn't the point to show the reference?"* The point was
> to *teach* the reference, and the reference doesn't need to stay highlighted to
> stay true. More importantly, this is a runless aside dropped into the middle of
> the assembly half: scene 4 (lights-out) needs to open on the same clean idle
> chain that scene 2 left, so it can arm the schedule from a neutral state. If this
> scene ended with a ring still on, or the table still dimmed, scene 4 would either
> inherit that or jump. The zoom-aside is a *parenthesis* — you open it, say the
> thing, and close it so the sentence around it is undisturbed. The boundary
> carries the template idle state, identical on both sides, by construction.

> *"Isn't reverting just to revert wasted motion?"* No — it's continuity made
> cheap. Because the scene returns to its enter state, the boundary into scene 4
> is the same frame as the boundary out of scene 2: idle chain, CAM_ALL, nothing
> lit. Three scenes (2→3→4) share one rest state, so two cuts are free. A scene
> that *parks* in a changed state forces the next scene to either match the change
> or absorb a jump; a scene that *closes its own parenthesis* costs nothing
> downstream. The continuity contract in `script-v1.md` records this boundary as
> "3→4: same (card gone, ring released)" — and `verify-boundaries.ts` proves it
> structurally zero.

## How to think about the whole scene

Walk the decisions and each one answers a question:

1. *What am I explaining?* One reference (`<getissues.rows>`) — so render the
   product's real subflow editor, not a diagram of one.
2. *How do I make one element the subject without moving the camera?* Dim its
   neighbors to the 0.35 floor and leave it lit → hierarchy by brightness, the
   backlog table still readable for bearings.
3. *How do I dim "everything but the container"?* Per-element dim (table, two
   blocks, two edges), never the global `dim` — the container is exempt, never
   re-lit; its interior lane stays lit via `lanes={{2: {}}}`.
4. *Where does the editor live?* A viewport-space overlay above the dimmed world,
   not a stage citizen → it reads as a side-sheet panel, immune to the dim and the
   camera, sat beside its subject not over it.
5. *How do I link block and editor without a wire?* Synchrony only — they share a
   clock, plus a header that mirrors the block's identity (Split chip + **Fleet**),
   never a connector line, because lines mean dataflow and nothing flows.
6. *How do I show what a reference IS?* Ramp the tag from plain `#e6e6e6` into
   selection-blue `#33b4ff` → the product's own 'this is a live binding'
   treatment, enacted; held long because it's the scene's one payload.
7. *How does the parenthesis close?* Everything reverts by 10.7s in reverse order
   (glow → card → ring → dim) → the idle chain is identical on both boundaries, so
   scene 4 inherits a clean state.

There's no single clever move. The quality is the sum of seven small, restrained
decisions — and the restraint (steady camera, partial dim, no connector, full
revert) is what keeps it reading as a calm aside rather than a busy interlude.

## Exit state (what scene 4 inherits)

`chain idle and fully lit · no editing ring (released by 10.4–10.7s) · no card ·
tag plain mono text · table + chain at full brightness · camera at CAM_ALL`. This
is pixel-identical to scene 2's exit and to scene 4's enter — the runless front
half (scenes 2→3→4) shares one rest state across two cuts. The hold from 10.7s to
the scene's end (~12s) is a latched settle on that idle chain, extend-safe by
construction (no motion in flight for the narration to interrupt).
