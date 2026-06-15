# Scene 2 — `what-the-loop-knows`  ·  archetype: **zoom-aside (editor card)**

Source: `../source/scenes/WhatTheLoopKnowsScene.tsx`, `../source/scenes/_config.tsx`,
`../source/scenes/_rig.tsx`, `../source/layout.ts`.

This is the configuration scene. The workflow is built; now you learn the
**one fact** that makes a Loop run the number of times it runs: it is given a
**collection to iterate over**, and the size of that collection *is* the
number of passes. Read it as the worked example for "how do I show a block's
config without rebuilding the editor or stamping a caption" — the answer is
the *aside*: dim the world, select the block, slide in the product's own
editor panel, and let the panel's real fields carry the meaning.

---

## What this scene is for

The video's spine is: container → it runs the inside once per item → results.
Scene 1 gave you the container. Scene 2 has to install the quantity that the
run will make true: **three items in the collection ⇒ the inside runs three
times.** Everything in scene 3 (three sequential passes) and scene 6 (three
simultaneous instances) is "three" — and *this* is the scene that earns the
three. If the viewer doesn't register "the collection has three items" here,
the three passes later look arbitrary.

The rule is *one idea per scene*: the idea is "the loop is told what to
iterate over, and it has three items." Not "here's the whole editor," not
"here's every loop setting" — just the type (`For Each`) and the collection
(`["x", "y", "z"]`), with the collection's *count* made visible.

## What it looks like

The workflow stays put. The world dims to ~0.35; the **container takes a blue
selection ring** (it is being edited). The product's **subflow editor card**
slides in from the right and settles: a header (blue Repeat chip + "Loop"),
a `Loop Type` field reading **`For Each`**, a dashed divider, and a
`Collection Items` field reading **`["x", "y", "z"]`**. The `For Each` field
gets a brief blue glow (this is the setting that matters), then the three
collection items glow one after another — `"x"`, then `"y"`, then `"z"` — so
you *count* them. The card then slides back out, the ring releases, and the
world un-dims to the resting workflow.

## The aside grammar — dim, select, slide

The scene is three coordinated gestures, and they're the reusable pattern for
any "look at this block's config" beat:

```tsx
const dim = Math.min(c(0.5, 1.0), c(6.8, 7.4, 1, 0));   // world dims, then restores
const ring = t >= 0.5 && t < 7.0;                       // container "being edited"
const cardOp = Math.min(c(1.0, 1.6), c(6.2, 6.8, 1, 0)); // card in, then out
const slide = 1 - c(1.0, 1.7, 0, 1, EASING.out)
            + c(6.2, 6.8, 0, 1, EASING.in);              // off-right → in → off-right
```

1. **Dim the world.** Everything that isn't the focus drops to ~0.35. The
   rig's `start` and `summary` blocks get `{dim}`, and the two outer edges get
   their opacity multiplied by the same `1 - 0.65*dim`. The *container itself
   is not dimmed* — it stays full-bright and takes the ring, because it's the
   subject.
2. **Select the container.** `container={{highlighted: ring}}` gives it the
   blue selection ring — the product's own "this block is selected in the
   editor" treatment. No word like "EDITING"; the ring *is* the word.
3. **Slide the card in.** The `ConfigCard` enters from the right
   (`slide` runs `1 → 0`, an 80px offset → in place) and leaves the same way.

> *"Why an aside card instead of expanding the container in place to show its
> settings?"* Because the container's *body* is reserved real estate — it's
> where the inner block lives and where the run will happen. Settings like
> "what collection do I iterate" don't live in the body; in the product they
> live in a side editor panel. Porting that panel as a slide-in card is both
> truthful (it's the real surface) and clean (it doesn't disturb the
> workflow's geometry — when the card leaves, the frame is byte-identical to
> scene 1's rest state, which is exactly what scene 3 needs to inherit).

> *"Why dim the world to 0.35 rather than hide it?"* Hiding it would break
> continuity — the workflow has to be in the same place before and after the
> aside. Dimming keeps it present (you never lose the spatial context: this
> card is *about that container, over there*) while unambiguously throwing
> the focus onto the lit container and the card. This is the project's
> hierarchy rule: one focal element per moment, everything else dimmed, never
> deleted.

## The card content — the product's real fields, verbatim

The `ConfigCard` (`_config.tsx`) is a port of the product's subflow editor,
and every label is the real one:

| field | value | what it says |
|---|---|---|
| header | blue Repeat chip + `Loop` | this is the same block, selected |
| `Loop Type` | `For Each` | iterate once per item of a collection |
| `Collection Items` | `["x", "y", "z"]` | the collection — **three** items |

The two `Loop Type` modes the product offers are "For Each" and a fixed
count; **For Each** is the one that ties the iteration count to a collection,
which is the whole point of the scene. The dashed divider between the type
and the collection mirrors the real panel. The collection `["x", "y", "z"]`
is the product's own authored example collection — short, generic items
chosen precisely *because* they carry no meaning of their own: the lesson is
about iteration count and order, not about what the items *are*. (Short items
also keep every resolved row inside the block width later — a real layout
constraint, see the morph notes in scene 5.)

> *"Why these specific items and not, say, a list of customers?"* Because
> meaningful items would make the viewer think the lesson is about the
> *content* of the collection. `"x", "y", "z"` are deliberately contentless —
> they're stand-ins whose only job is to be three distinct, countable,
> orderable things. When `<loop.currentItem>` resolves to `"x"` in scene 3,
> you read "it resolved to the first item," not "it resolved to a customer
> named x." The abstraction is the point.

## The animation, beat by beat

### (a) The world dims and the container is selected — `0.5 → 1.0s`

`dim` ramps up over `0.5 → 1.0`; the `ring` boolean is on from `0.5` to
`7.0`. The dim and the selection start together: as the world recedes, the
container lights up as the thing being edited. The two outer edges fade with
the dim (their opacity is `1 - 0.65*dim`) so the dimmed workflow reads as one
receding plane, wires included.

### (b) The card slides in — `1.0 → 1.7s`

`cardOp` ramps in over `1.0 → 1.6` while `slide` eases from its off-right
offset to in-place over `1.0 → 1.7` (`EASING.out` — an entrance). The card
arrives just *after* the world has finished dimming, so the viewer's eye is
already settled on "the container is selected" before the card lands to
explain it.

### (c) The type glows — `2.0 → 3.2s`

```ts
const typeGlow = Math.min(c(2.0, 2.4), c(2.8, 3.2, 1, 0));
```

The `For Each` field gets a blue selection glow that rises over `2.0 → 2.4`,
holds, and falls over `2.8 → 3.2`. This points at the setting that *causes*
the per-item behavior — "iterate once per item" — before counting the items
it iterates over.

### (d) The three items glow in sequence — `3.4 → 6.55s`

```ts
const itemGlow = (T) => Math.min(c(T, T + 0.35), c(T + 0.8, T + 1.15, 1, 0));
itemGlows={[itemGlow(3.4), itemGlow(4.4), itemGlow(5.4)]}
```

Each item gets a 0.35s glow-in / ~0.35s glow-out, and they start **1.0s
apart** — `"x"` at 3.4, `"y"` at 4.4, `"z"` at 5.4. Each item's glow is a
blue tint behind that token in the collection string. You watch the
highlight walk the list left to right.

> *"Why glow the items one at a time instead of all at once?"* Because the
> beat is **counting**, and counting is sequential. Lighting all three
> together would say "here is a collection"; lighting them in turn says
> "one… two… three" — it makes the *cardinality* perceptible and previews the
> *order* the Loop will take them in (scene 3 walks the same `x → y → z`).
> The 1.0s spacing is slow enough to land each as a distinct count, and it
> rhymes deliberately with scene 3's per-pass cadence: the three glows here
> and the three passes there are the same "three," shown twice.

> *"Why 1.0s spacing here, when scene 1's assembly used ~0.6s and the
> market-desk row sweep used 0.14s?"* Cadence is chosen per verb. Scene 1 was
> *arriving* objects (medium). A sweep is *passing over* (fast). This is
> *counting* (deliberate, slow — you want the viewer to actually tally). The
> spacing is a signal about what kind of event it is.

### (e) The card leaves and the world restores — `6.2 → 7.4s`

`cardOp` falls over `6.2 → 6.8` and `slide` eases back off-right over the same
window (`EASING.in` — an exit). The `ring` releases at `7.0`, and `dim`
restores over `6.8 → 7.4`. By the scene's end the frame is *exactly* the
resting workflow from scene 1 — full bright, no ring, no card.

> *"Why does the card leave before the ring releases (6.8 vs 7.0)?"* So the
> gestures unwind in the reverse of the order they wound up: the card was the
> last thing in, so it's the first thing out; the selection was there first,
> so it releases last; the dim restores last of all. Unwinding in reverse
> order reads as "closing the editor," a single coherent gesture, rather than
> three things blinking off independently.

## Why this scene ends *exactly* where scene 1 did

This is the structural payoff. Scene 2 is a **round trip**: it dims, selects,
and shows a card, then undoes all three. Its exit state is byte-identical to
scene 1's exit state — resting Loop workflow, no rings, full bright. That's
intentional and it's what makes the aside *safe*: an aside is a detour that
returns you to where you started, so the run (scene 3) can open on the same
clean template scene 1 left, as if the editor was never opened. The config we
learned here is now *known to the viewer* but leaves no visual residue.

## How to think about the whole scene

1. *What's the one fact?* The Loop iterates over a collection; its size is the
   pass count → show `For Each` + `["x","y","z"]`.
2. *How do I show config without a caption or a rebuild?* The aside — dim,
   select with a ring, slide in the product's real editor card.
3. *How do I make "three" land?* Glow the items one at a time → the viewer
   counts, and previews the order.
4. *How do I keep the run's template clean?* Round-trip everything → exit
   state equals scene 1's, so scene 3 inherits a pristine workflow.

## Exit state (what scene 3 inherits)

`resting Loop workflow · no rings · world full bright · card gone · all tags
unresolved · camera at identity`. Identical to scene 1's exit. Scene 3 opens
here and immediately begins the run — outer Start blips, the pulse crosses
into the container, and the container takes a live ring it will *keep*.
