# Scene 3 — `wired-by-reference`  ·  archetype: **zoom-aside**

Source: `../source/scenes/WiredByReferenceScene.tsx`, `../source/scenes/_rig.tsx`
(`EnrichConfigCard`), `../source/layout.ts`, `../source/data.ts`.

This is the build's one *aside* — a brief pull-out-of-the-flow to inspect a
single configuration field and then return. It teaches the most important
mechanical idea in the whole video (one reference is what turns one lane into a
fan) and it teaches the **zoom-aside grammar**: dim the world, ring the subject,
slide a card in, glow the value, then reverse all of it before the cut. Study it
as the template for "let me show you one detail without losing my place."

---

## What this scene is for

One idea: **a single reference does the wiring.** The container's `Parallel
Items` field is set to `<apollo.organizations>` — the collection Apollo returned.
That one reference is why the lane runs once per company. Everything dramatic in
scenes 4–6 (the fan, the six concurrent lanes, the scramble) follows mechanically
from this one field. So the scene exists to hold that field up, name it
(visually), and put it back.

The discipline here is *don't change the world to inspect it.* The machine
doesn't move, doesn't relayout, doesn't even zoom. The focus change is done
entirely by **dimming everything except the subject** and floating an editor card
over the top. When the card leaves, the frame is byte-identical to where scene 2
left it.

## What it looks like

The assembled machine from scene 2 is sitting there. Then the whole world dims to
about a third of its brightness, the Enrich container takes a brand-blue editing
ring (the product's "this block is selected/being edited" treatment), and a block
editor card slides in from the right. The card shows the container's two fields:
`Parallel Type | Parallel Each` and `Parallel Items | <apollo.organizations>`.
The `<apollo.organizations>` reference glows for a beat — that's the gesture: *this
is the wire.* Then the glow releases, the card slides back out to the right, the
ring releases, and the world brightens back to full.

## The real decisions

### The dim and the ring are one event, driven by one window

```ts
const dim    = Math.min(ramp(t, 0.3, 1.0, EASING.inOut), 1 - ramp(t, 6.6, 7.4, EASING.inOut));
const ringOn = t >= 0.3 && t <= 7.4;
```

The world's dim ramps up over 0.3→1.0s and releases over 6.6→7.4s. The
container's editing ring is a boolean that is on for exactly the same window
`[0.3, 7.4]`. They start together and end together because they are the *same
gesture*: "I am now editing this block" = the block lights up **and** everything
else recedes. If the ring came on without the dim, or the dim lifted before the
ring, the viewer would feel two events instead of one.

Look at how `dim` reaches the world. In `_rig.tsx`, `Stage` computes
`worldOp = 1 - 0.65 * dim` and applies it to the entire transformed world div. So
`dim = 1` doesn't mean "fully black" — it means the world drops to 35% opacity
(`1 - 0.65`). That 0.35 floor is deliberate: the machine has to stay *legible*
behind the card (you need to still see it's the Enrich container that's being
edited), just demoted. This is style lesson #7 — one focal element per moment, dim
the rest to ~0.2–0.35, don't hide it.

> *"Why dim to 0.35 specifically and not, say, 0.1?"* Two forces. Dim too little
> and the card doesn't pop — the eye doesn't know where to look. Dim too much and
> you lose the context that makes the card meaningful (which block is this card
> *for*?). 0.35 keeps the container readable through the wash so the card reads as
> *attached to that container*, while still making the card unmistakably the
> focus. It's also the series' standard aside-dim, reused across builds for
> consistency.

### The container's editing ring is the product's own treatment

The ring is rendered inside `EnrichContainer` (`_rig.tsx`): when `vis.highlighted`
is true (which is what `cont={{highlighted: ringOn}}` sets), it draws an
`inset 0 0 0 1.75*S px` box-shadow in `COLORS.secondary` — Sim's brand blue. This
is the exact ring the product puts around a block you've clicked into to edit.
Using it means the scene says "editing" in the product's vocabulary, with no
caption.

### The card slide and the card opacity ride the same two windows

```ts
const cardOp    = Math.min(ramp(t, 0.8, 1.5, EASING.out), 1 - ramp(t, 6.7, 7.3, EASING.in));
const cardSlide = 1 - Math.min(ramp(t, 0.8, 1.5, EASING.out), 1) + ramp(t, 6.7, 7.3, EASING.in);
const itemsGlow = Math.min(ramp(t, 2.2, 2.9, EASING.out), 1 - ramp(t, 5.6, 6.3, EASING.in));
```

The card's opacity rises 0.8→1.5 and falls 6.7→7.3. Its slide is built from the
*same* ramps: `slide` is `1` when the card is offscreen-right and `0` when it's in
place, and `EnrichConfigCard` applies it as `left: CARD_VX + 80 * slide` — so the
card enters from 80px to the right while fading up, and leaves 80px to the right
while fading down. Enter from the right, leave to the right. Tying the slide and
the opacity to identical windows guarantees they're perfectly synchronized — there
is no separate "slide timer" that could drift from the "fade timer."

> *"Why does the card start at 0.8, after the dim has already begun (0.3)?"* The
> dim+ring is the "I'm selecting this block" beat; the card is the "here's its
> config" beat. You want the world to *begin* receding and the ring to *begin*
> appearing first, so that when the card arrives it lands into an
> already-prepared, already-dimmed stage. If the card and the dim started on the
> same frame, the card would be sliding in over a world that's still bright and
> still rearranging its brightness — busy. The 0.5s offset stages the two beats.
>
> *"Why only an 80px slide, not a big sweep?"* It's an aside, not an entrance. A
> small, quick travel reads as "a panel docking," which is what a block editor
> does. A long slide would over-dramatize a UI panel and pull focus from the
> field it's carrying.

### The glow fires mid-hold and releases before the card leaves

`itemsGlow` rises 2.2→2.9 and falls 5.6→6.3 — entirely *inside* the card's
on-window (0.8 … 7.3). So the sequence is: card arrives (1.5), settles, *then* the
`<apollo.organizations>` tag glows (2.2–2.9), holds glowing through the middle of
the scene, releases (5.6–6.3), *then* the card leaves (6.7). The glow is the one
gesture the card exists to deliver, and it gets clean air on both sides — nothing
else is moving while it's glowing.

The glow is applied by `<Tag text={ITEMS_REF} glow={itemsGlow} />` inside the
card. `ITEMS_REF` is `<apollo.organizations>` from `data.ts`. The `Tag` component
is the product's reference-token chip; `glow` brightens it. This is "values
resolve in place, never ride wires" — but here it's even simpler: the reference
*is* the value, and the glow is just "look here."

> *"Why glow the reference instead of, say, drawing an arrow from Apollo to the
> field?"* Because the reference token **is** the connection. `<apollo.organizations>`
> literally means "the organizations Apollo returned." Glowing the token says "this
> string is the wire" far more honestly than a drawn arrow would — the product
> doesn't draw an arrow for a reference, it just has you type the reference. The
> animation mirrors how the wiring actually works.

## The values, and where they come from

| field on the card | value | source |
|---|---|---|
| `Parallel Type` | `Parallel Each` | the docs' preview-container editor verbatim |
| `Parallel Items` | `<apollo.organizations>` | `ITEMS_REF` in `data.ts` — the parallel's items reference |

The card chrome (yellow Split chip + "Enrich" header, the two labeled fields in
`surface2` input boxes, the `MONO` font on the reference value) is a port of the
product's block-editor panel for a Parallel container's two fields — declared in
`_rig.tsx` as the loops `ConfigCard` zoom-aside grammar. It is a *real surface*,
not an invented one; that's why it's allowed under the hype-3 constraint (canvas +
SimTable only, with declared asides).

## The animation, beat by beat

- **Dim up + ring on** `0.3 → 1.0` (`inOut`). World recedes to 0.35; container
  takes the brand-blue ring. One event.
- **Card slides in** `0.8 → 1.5` (`out`), entering 80px from the right. Lands ~0.5s
  after the dim began.
- **`<apollo.organizations>` glows** `2.2 → 2.9` (`out`). The one gesture — held
  through the middle of the scene.
- **Glow releases** `5.6 → 6.3` (`in`). The look-here lifts before anything else
  moves.
- **Card slides out** `6.7 → 7.3` (`in`), leaving 80px to the right.
- **Dim down + ring off** `6.6 → 7.4` (`inOut`). World brightens; ring releases.
  One event, mirroring the open.
- **Hold** `7.4 → end` (~11.5s after VO) on the undimmed idle chain.

Every window is nested so that the scene **fully reverts** before its end: by
7.4s the dim is 0, the ring is off, the card is gone, the glow is gone. This is
the freeze-cut contract for an aside — the aside is a closed parenthesis, and the
frame on either side of it is scene 2's exit state. The choreography notes the
7.4→11.5 hold is "dead but short"; it's the price of letting the undim fully
complete before the cut.

> *"Why must everything revert before the cut?"* Because scene 4 opens on the same
> assembled-idle frame and *starts the run*. If the ring or the dim leaked across
> the cut, scene 4 would inherit a half-edited, half-dim world, and the run would
> start in a visually contaminated state. The aside has to leave no trace. The
> general rule: an aside's exit state must equal its enter state, so the
> surrounding flow is undisturbed.

## How to think about the whole scene

1. *How do I inspect one field without losing my place?* Dim the world, don't move
   it → the machine stays put, continuity is free.
2. *How do I say "this block is being edited"?* The product's brand-blue editing
   ring, on the same window as the dim → one event, product vocabulary.
3. *How does a config panel arrive?* Slide a real editor card 80px in from the
   right, fade synced to slide → reads as a docking panel.
4. *What's the one thing to look at?* The `<apollo.organizations>` reference,
   glowing mid-hold with air on both sides → the wire, named without words.
5. *How do I leave?* Reverse every window before the cut → the aside is a closed
   parenthesis; scene 4 inherits scene 2's exit untouched.

## Exit state (what scene 4 inherits)

`machine assembled and idle · dim = 0 (world at full) · container ring off
(`highlighted: false`) · card fully gone · `<apollo.organizations>` glow = 0 ·
fan = 0 · table still empty · camera at CAM_ALL`. This is identical to scene 2's
exit. Scene 4 opens here and lights Apollo's ring to begin the single run that
spans scenes 4 → 7.
