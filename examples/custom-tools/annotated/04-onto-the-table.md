# Scene 4 — `onto-the-table`  ·  archetype: **aside exit + capability-lands chip beat**

Source: `../source/scenes/OntoTheTableScene.tsx`, `../source/scenes/_local.tsx`
(`CHIP_WEATHER`), `../source/layout.ts`, `ToolEditorPanel.tsx`, and `SimBlock.tsx`
(the chip width-growth + ring mechanics).

This is the hinge of the whole video — **capability lands on the table.** The two
prior scenes were anatomy in a dimmed-away editor; this scene takes the thing you
just built and physically puts it back into the world, as a chip on the agent's
tool line. The single beat "Save Tool → a new chip grows onto the block" is the
sentence the entire piece is engineered to deliver. Read it as the worked example
of *closing an aside by paying its result back into the set piece.*

---

## What this scene is for

The thesis has two clauses: "a custom tool is two parts" (scenes 2–3) *and* "once
saved it sits on the agent's table like any built-in." This scene is that second
clause, made literal. The viewer has to *see* the abstract editor work become a
concrete chip on the same Triage block from scene 1 — because that's the moment
"I wrote a tool" stops being an SDK-project feeling and becomes "it's just another
chip." If this beat doesn't land, the anatomy was trivia.

One idea per scene: this is "save it, and it's on the table." Not "and here's how
the agent uses it" — that's scene 5. This scene ends the moment the chip has
settled into place.

## What it looks like

The **Save Tool** button dips (a brief press). The editor panel slides down and
fades out. The world undims — the Triage chain comes back up to full opacity,
edges brighten. Then, on Triage's tool line, a **fourth chip — Weather — grows
in** beside Docs / CRM / Search: it expands from zero width to full, pushing
nothing, and takes one brief selection pulse before settling. Camera untouched.

## The capability-lands move — how the chip beat is built

Two mechanisms compose to make "the saved tool lands as a chip." Both live in
`SimBlock.tsx` and are driven by per-chip 0..1 numbers.

**(1) Width-growth, so the chip arrives instead of popping.** A chip with
`opacity < 1` is rendered with a measured `maxWidth` scaled by its reveal, so it
expands horizontally into existence:

```ts
// SimBlock.tsx — the chip grows in width; the width is MEASURED, not guessed
...(chipOp < 1 ? {
  maxWidth: chipNaturalWidth(tool.name) * chipOp,
  marginLeft: -5 * S * (1 - chipOp),
} : {})
```

The scene feeds that `chipOp` via `chipReveal`:

```ts
const chipReveal = interpolate(t, [3.1, 4.0], [0,1], { ease out });
tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3, {...CHIP_WEATHER, opacity: chipReveal, ring: chipPulse}]
```

> *"Why width-growth and not a fade-in or a drop-in?"* Because the chip is
> *joining a row of existing chips*, and the only honest way to add to a row is to
> make room in the row. A fade-in would have the chip ghost into a fixed slot
> (where did the slot come from?); a drop-in would be a foreign motion the product
> never does. Growing from zero width is how a real tags/chips row behaves when an
> item is added — the row extends to hold it. And the width is **measured** with
> `@remotion/layout-utils` (`chipNaturalWidth`), not eyeballed, so the chip never
> clips its own border or overshoots its label mid-grow. This is rule 4 (never
> teleport a persistent element) applied to a *new* element: even arriving, it
> moves continuously into a real layout.

**(2) The selection pulse — "this one is new."** Right after it finishes growing,
the chip takes one ring pulse (the same `ring` prop scene 1 used for the tool
*call*):

```ts
const chipPulse = interpolate(t, [4.0, 4.3, 5.1, 5.5], [0,1,1,0], { clamp both });
// ...ring: chipPulse
```

> *"Isn't reusing the ring confusing — in scene 1 a ring meant 'the agent called
> this tool'?"* It's the same product affordance (a selection ring) carrying its
> general meaning, "this chip is the focal one right now," in two contexts. Here
> it's a brief acknowledgement pulse — "this is the one that just arrived" — not a
> live call (no run is happening, the chain isn't live). The viewer reads it from
> context: a chip that just grew in, ringing once as it lands, is plainly "the new
> one." Scene 5 then disambiguates definitively by ringing CRM *during a live run*
> while Weather stays quiet — restoring the call-meaning. The shared vocabulary is
> a feature: one ring affordance, meaning "attend to this chip," sharpened by
> context each time.

## The deliberate deviation, marked and reversible

The live beaming-polaris Triage has **three** tools. This scene adds a fourth
(Weather). That's a deviation from the artifact, and it's explicitly flagged in
`script-v1.md`'s grounding notes as acceptable and reversible.

> *"Why is inventing a fourth chip OK here when inventing values is forbidden
> elsewhere?"* Because the deviation is *demonstrative of a documented product
> behavior*, not a fabricated fact. The docs state plainly: a saved custom tool
> "appears alongside built-in tools" and is "available in any Agent block." The
> scene is showing that exact documented flow — a newly-saved tool appearing on
> the line. The chip's name (`Weather`, condensed from `get_weather` per the
> module-5 condensation rule), color (`#6366F1`), and glyph (`ToolGlyph`) all
> follow the established `CHIP_CRM` custom-tool grammar, so it's consistent with
> the world. The discipline isn't "never add anything" — it's "every addition is
> either traceable to an artifact or a marked, reversible illustration of
> documented behavior, recorded in the grounding table." This one is the latter.

## The aside-exit mechanics

The save/exit is three coordinated ramps, sequenced so the panel leaves *before*
the chip arrives — the editor's work is handed off to the world:

```ts
const savePress = interpolate(t, [0.5, 1.1], [0,1], {});            // button dip
const panelOut  = interpolate(t, [1.3, 2.1], [0,1], { ease in });   // panel slides+fades out
const undim     = interpolate(t, [1.7, 2.5], [1,0], { ease out });  // world comes back up
// chip grows at 3.1→4.0, pulses 4.0→5.5 — AFTER the panel is gone
```

The `savePress` feeds the primary button's press treatment in the component (a
brief scale-down + brightness dip following a `sin(press·π)` curve, so it dips
*and recovers* in one motion — a button press, not a button that stays pressed).
`panelOut` drives both the panel's opacity (`1 - panelOut`) and its `slide` (so it
translates back down as it fades, the mirror of its scene-2 rise). `undim` brings
the chain's `dim` back to 0 and edges back to full.

> *"Why this exact order — press, then exit, then undim, then chip?"* Because it's
> a causal chain and the order *is* the meaning: you press Save → the editor
> closes (its job is done) → your workflow comes back into focus → and only then
> does the result of the save appear on it. If the chip grew while the panel was
> still leaving, the eye would be split between two motions and the causality
> ("save *caused* this chip") would blur. Letting the panel fully clear and the
> world fully return *before* the chip grows makes the chip unambiguously the
> consequence of the save. One focal motion at a time (rule 7), sequenced into a
> sentence.
>
> *"Why is the camera untouched?"* Because the chain never moved — scenes 2–3
> only dimmed it; it's at the same geometry it had in scene 1. Undimming returns
> the *exact* frame the viewer last saw the chain in (plus one chip). A camera
> move here would imply we'd gone somewhere; we didn't. We came back.

## The animation, beat by beat

1. **0.5 → 1.1s** — Save Tool dips and recovers (the press).
2. **1.3 → 2.1s** — panel slides down + fades out.
3. **1.7 → 2.5s** — world undims (chain back to full, edges brighten). Overlaps
   the tail of the panel exit slightly so the handoff feels continuous, not gapped.
4. **3.1 → 4.0s** — Weather chip grows in by width beside the other three.
5. **4.0 → 5.5s** — chip takes one selection pulse, settles.
6. **tail** — chain at rest with four chips, world undimmed, panel gone (8s; no VO
   stretch needed — this is the shortest scene, a clean hinge).

## How to think about the whole scene

1. *How do I close the aside?* Press the real button, slide the panel out the way
   it came in, undim the world → the editor leaves the way it arrived.
2. *How does the saved tool appear?* As a chip that grows in by width into the
   real chip row → it joins the line, it doesn't pop into a slot.
3. *How do I say "this is the new one" without words?* One selection pulse after
   it lands → product state language, read from context.
4. *How do I keep it honest?* The 4th chip is a marked, reversible illustration of
   documented behavior, in the world's chip grammar → deviation with a paper trail.

## Exit state (what scene 5 inherits)

`Triage chain at rest with FOUR chips (Weather at opacity 1, ring 0) · world
undimmed · panel gone · camera identity`. Scene 5 opens on exactly this frame —
the same chain scene 1 ran, now carrying the tool you just built — and runs the
closing pass. Boundary identical on both sides.
