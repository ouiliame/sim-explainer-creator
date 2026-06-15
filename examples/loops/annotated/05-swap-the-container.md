# Scene 5 — `swap-the-container`  ·  archetype: **morph-swap**

Source: `../source/scenes/SwapTheContainerScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is the hinge of the video and the second half of the move that earns it
a place in the pack. The container morphs **Loop → Parallel** in one
continuous gesture at **constant geometry** — and the entire lesson is what
*doesn't* change. The box, the inner Start pill, the inner Function, the
wires, the items: all identical. Only the **schedule** changes — and the
schedule is exactly the thing you can't draw directly, so it's communicated
*by drawing everything else holding still.* Read it as the worked example for
"how do I teach that two things are the same except one property" — the answer
is the morph: one element, two identities, crossfaded in place, with the
shared structure visibly untouched.

---

## What this scene is for

The video's thesis is "one shape, two schedules." Scenes 1–4 built and ran
the **Loop** schedule. Scene 6 will run the **Parallel** schedule. Scene 5 is
the bridge that makes those two runs read as *the same container on a
different schedule* rather than two unrelated blocks. It does that by morphing
the existing container in place — same DOM, same position, same size — so the
viewer's eye never loses the object. The thing that was a Loop *becomes* a
Parallel, and you watch it happen to the very same box.

The rule is *one idea per scene*: "swap the schedule, nothing else changes."
The stillness of everything except the chip, name, and tags **is** the idea.

## What it looks like

The resting Loop template, camera at identity. The container takes a blue
selection ring (it's being edited). Then, in one continuous ~4s morph: the
header chip crossfades from **blue Repeat (#2FB3FF)** to **yellow Split
(#FEE12B)** — and the glyph goes from white to dark as it does — while the
name dip-swaps **Loop → Parallel**; in sync, the Function row's tag dips
`<loop.currentItem>` → `<parallel.currentItem>`, and the consumer dips from
the Loop's identity (**Summary** / `Summarize <loop.results>`) to the
Parallel's (**Aggregate** / `merge(<parallel.results>)`). **Inside the
container, nothing moves** — same box, same inner Start pill, same Function 1,
same wires, same items. The ring releases. The container is now a Parallel.

## The distinctive move — one `phase`, the whole morph, constant geometry

The scene is almost nothing in code, and that minimalism is the point:

```ts
const ring  = t >= 0.6 && t < 6.6;
const phase = c(1.4, 5.4, 0, 1, EASING.inOut);   // 0 = Loop … 1 = Parallel
// ...
<Rig phase={phase} container={{highlighted: ring}} />
```

A single value, `phase`, eases `0 → 1` over `1.4 → 5.4`, and the rig
translates that one number into the *entire* identity change. Look at how the
rig fans `phase` into staggered sub-curves (`morphCurves` in `_rig.tsx`):

```ts
morphCurves(phase) = {
  headerMix:  sub(phase, 0.0, 0.4),   // chip color+glyph, container name
  tagMix:     sub(phase, 0.3, 0.7),   // <loop.currentItem> → <parallel.currentItem>
  resultsMix: sub(phase, 0.55, 0.95), // consumer identity + <loop.results> → <parallel.results>
}
```

Three things morph, and they morph in a slight **stagger** — header first,
then the inner tag, then the consumer — all derived from the one `phase`
value. Each sub-morph is a crossfade or `DipSwap`:

- **The chip:** `interpolateColors(headerMix, [blue, yellow])` for the fill;
  the white Repeat glyph fades out as the dark Split glyph fades in (the dark
  glyph because #FEE12B is light — the product's own luminance rule for icon
  contrast). The chip's *size, radius, and position never change.*
- **The name:** `DipSwap a="Loop" b="Parallel"` at `headerMix` — dips through
  blank, comes back as the other word, no layout pop.
- **The Function tag:** `DipSwap` between `<loop.currentItem>` and
  `<parallel.currentItem>` at `tagMix`.
- **The consumer:** `DipSwap` of the *whole identity* at `resultsMix` —
  name (Summary → Aggregate), header chip morph (green agent → red function),
  row title (Messages → Code), and row value (`Summarize <loop.results>` →
  `merge(<parallel.results>)`).

> *"Why drive everything off one `phase` value?"* Because it guarantees the
> morph is **reversible and boundary-safe by construction.** Scene 7 plays
> the *same* curves backward by running `phase` from `1 → 0`; there is no
> separate "un-morph" code to keep in sync. And because `phase` is a pure
> function of the frame, every boundary frame is exact — at `phase=0` the rig
> is pixel-identical to the Loop template (scene 4's exit), at `phase=1` it's
> the Parallel template (scene 6's entry). One value, two clean endpoints, a
> continuous path between.

> *"Why stagger the three sub-morphs instead of changing them all at once?"*
> So the eye can follow the change as a *gesture* rather than a flash. The
> header leads (it's the thing you look at — the container's identity), the
> inner tag follows (the reference inside updating), the consumer lands last
> (the downstream reference updating). Reading header → tag → consumer mirrors
> the causal story: "I changed the container, so the references that name it
> update." It also keeps any single frame from being a muddy half-of-
> everything; at each instant one sub-morph is mid-flight and the others are
> at rest.

## The lesson is the stillness — what does NOT change

This is the crux. The morph touches **colors, labels, and tags — and nothing
else.** Look at what is conspicuously absent from the scene:

- No height change. No position change. No re-layout. (The continuity
  contract states it: "Morph = colors/labels/tags only … No height or
  position changes — the boundary-safe morph by construction.")
- The **box** is the same box.
- The **inner Start pill** is in the same place — the inside still starts the
  same way.
- The **inner Function 1** is the same block in the same slot.
- The **inner and outer wires** are unchanged.
- The **items** (`["x", "y", "z"]`) are the same collection.

> *"Why is 'nothing inside changes' the whole point — wouldn't a bigger,
> flashier transformation teach more?"* No — it would teach the *wrong* thing.
> The claim the video is making is precise: **a Loop and a Parallel are the
> same container with the same steps inside; the only difference is the
> schedule.** If the morph also rearranged the inside, the viewer would
> conclude Loop and Parallel are *different machines*, and the entire
> "one shape, two schedules" thesis collapses. By holding the box, the pill,
> the Function, the wires, and the items dead still while only the identity
> chrome crossfades, the scene proves the claim visually: you are looking at
> the same thing, relabelled. The schedule — the one real difference — isn't
> drawable as an object, so it's drawn as *the absence of any other change.*

## The reference-follows-name detail — why the tags update "on their own"

When the name dips Loop → Parallel, the tags dip `<loop.…>` →
`<parallel.…>` in sync. This isn't decoration; it's a documented product
fact. In Sim, you reference a container by its **name**, so the resolved tag
is the container's name plus the field (`<loop.results>`,
`<parallel.results>`). Rename the container and every reference to it follows
the new name. The morph draws this: the tags don't change because the author
edited them — they change *because the container's name changed*, and the
references track the name. The stagger reinforces it (name leads, tags
follow), so you read cause (rename) → effect (tags update), not two
simultaneous edits.

> *"Why does the consumer change identity entirely (Summary→Aggregate,
> Messages→Code, Summarize→merge) rather than just swapping the tag?"* This is
> a grounding-and-fit decision, and it's worth knowing because it's the kind
> of trade you'll face. The first draft kept "Summary / Summarize
> <parallel.results>" in both phases with only the tag swapped — but
> `Summarize <parallel.results>` measured *wider than the block row* and
> truncated on a render. The product's own docs pair the Loop example with a
> **Summary** agent and the Parallel example with an **Aggregate** function
> (`merge(<parallel.results>)`) — which both *fits* the row and is better
> grounded in real product surfaces. So the consumer dips its whole identity.
> The "same steps" claim is about the **inside of the container**, which still
> changes nothing; the downstream consumer naturally differs between a
> summarize-the-sequence and merge-the-parallel-outputs job. The lesson is
> intact, and the layout doesn't truncate.

## The animation, beat by beat

| beat | window (s) | what happens |
|---|---|---|
| selection ring on | `0.6` | container takes the blue editing ring |
| header morph | `phase 0.0 → 0.4` (≈ `1.4 → 3.0`) | chip blue Repeat → yellow Split; name Loop → Parallel |
| tag morph | `phase 0.3 → 0.7` (≈ `2.6 → 4.2`) | Function tag `<loop.currentItem>` → `<parallel.currentItem>` |
| consumer morph | `phase 0.55 → 0.95` (≈ `3.6 → 5.2`) | Summary/Messages/Summarize → Aggregate/Code/merge |
| phase completes | `5.4` | rig is the Parallel template |
| ring releases | `6.6` | selection ring off; settle |

The whole morph uses `EASING.inOut` — the project's curve for *transforms* —
because a morph is a transformation traveling through identity-space; it
should accelerate off the Loop state and decelerate into the Parallel state,
not snap. (Entrances get `out`, exits get `in`, transforms get `inOut` — the
same rule everywhere in the build.)

> *"Why the selection ring through the morph?"* It frames the change as **an
> edit** — "I selected this container and switched its type" — which is
> literally how you'd do it in the product. The ring is on from `0.6` (before
> the morph starts) to `6.6` (after it completes), bracketing the change as a
> single deliberate editing action, then releasing to leave the clean
> Parallel template.

## Why this scene ends on a clean Parallel template

By the end, `phase=1` and the ring is released, so the rig is the **resting
Parallel template** — yellow Split chip, name "Parallel",
`<parallel.currentItem>` in the Function, Aggregate / `merge(<parallel.
results>)` downstream — at the exact same geometry as the Loop template.
Scene 6 opens on this and runs the Parallel schedule. Because the morph is a
pure function of `phase` and ends exactly at `phase=1`, the 5→6 boundary is
the Parallel template down to the pixel.

## How to think about the whole scene

1. *What's the claim?* Loop and Parallel are one container, one set of inner
   steps, differing only in schedule → morph in place, constant geometry.
2. *How do I morph cleanly and reversibly?* One `phase` value fanned into
   staggered sub-curves → reversible (scene 7 reverses it) and boundary-exact.
3. *How do I show "only the schedule changed"?* Crossfade only the chip,
   name, and tags; hold the box, pill, Function, wires, and items perfectly
   still → the stillness is the proof.
4. *How do the tags know to update?* References follow the container's name →
   rename leads, tags follow (the stagger draws the causality).
5. *Why does the consumer fully swap?* Grounding + fit — the docs pair each
   schedule with its own consumer, and `merge(<parallel.results>)` fits the
   row where `Summarize <parallel.results>` truncated.

## Exit state (what scene 6 inherits)

`resting Parallel template (phase 1) · yellow Split chip, name "Parallel" ·
`<parallel.currentItem>` in the Function, Aggregate / `merge(<parallel.
results>)` downstream · no rings · same geometry as the Loop template ·
camera at identity`. Scene 6 opens here and runs Run B — the same three items,
all at once.
