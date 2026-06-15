# Scene 3 — `the-code`  ·  archetype: **morph-swap (tab switch) + two-surface sync**

Source: `../source/scenes/TheCodeScene.tsx`, `../source/scenes/_local.tsx`
(`CODE_LINES`, `TOOL_PARAMS`), `../source/layout.ts`, `ToolEditorPanel.tsx`.

This is the second half of the tool-editor anatomy, and it carries the most
sophisticated single beat in the video: the **two-surface sync** — a schema
parameter and its use as a code variable lit *at the same instant on two
different product surfaces*, so the equivalence is shown rather than stated.
Read it as the worked example of the house "synchrony" move: when two things are
the same thing, prove it by animating them together.

---

## What this scene is for

You've seen part one (the schema, what the model reads). This scene delivers part
two: the code, what actually runs when the agent calls the tool. The fact the
scene must land is the one that's invisible in the static UI — *the parameters
you declared in the schema simply exist as variables in your code.* Then two
riders: secrets arrive as `{{KEY}}` placeholders, and whatever you `return` is
what the agent gets back. That's the entire mental model of writing a tool body,
delivered without a sentence on screen.

One idea per scene, stated precisely: this is "the code half, and how the schema
connects to it." The connection — schema param becomes code variable — is the
load-bearing beat; everything else in the scene serves it.

## What it looks like

Continuing from scene 2's exit, the editor's 1px tab indicator **slides** from
Schema to Code; the panel content crossfades from the schema JSON to the
function body at *constant panel height*. Above the editor sits the product's
real **"Available parameters: city units"** badge row. Then the sync beats fire:
the `city` badge pulses while `${city}` in the code takes the selection wash —
same moment, two surfaces — then the same for `units`. Then
`{{OPENWEATHER_API_KEY}}` takes the wash (it already renders env-var blue).
Finally the whole `return { … }` block takes the wash and holds. Washes clear;
panel rests on the Code tab.

## The morph-swap: tab switch at constant height

The tab change is not a cut and not a dip-to-blank. It's the canonical
morph-swap: the two contents crossfade through each other while the panel frame
holds perfectly still.

```ts
const tab = interpolate(t, [0.6, 1.4], [0,1], { ease inOut }); // 0=Schema, 1=Code
// inside ToolEditorPanel:
const schemaOp = clamp01((0.7 - tab) / 0.4); // schema fades out over the middle
const codeOp   = clamp01((tab - 0.3) / 0.4); // code fades in over the middle
// the 1px indicator interpolates left+width between the two trigger boxes
```

The indicator's `left` and `width` interpolate between the measured Schema tab
(55px) and Code tab (41px) boxes, so the product's own active-tab underline
physically slides and resizes between the two labels.

Crucially, the panel does **not** change height. The component pre-computes fixed
editor heights so the swap is height-stable:

```ts
SCHEMA_EDITOR_H = 22*21 + 17 = 479
CODE_EDITOR_H   = SCHEMA_EDITOR_H - PARAMS_ROW_H(36) - PARAMS_ROW_MB(8) = 435
```

The Code tab is shorter by exactly the height of the "Available parameters" row
plus its margin, so the *total* body height is identical across tabs. The schema
tab stays mounted in flow at `opacity: schemaOp` (not unmounted) precisely to
hold that height during the crossfade.

> *"Why obsess over constant height?"* Because the editor is a persistent element
> across scenes 2–4 (rule 4: never teleport a persistent element). If the panel
> grew or shrank on the tab switch, the viewer would read it as two different
> panels appearing, not one panel showing two faces of the same tool. Height
> stability is what makes "Schema" and "Code" read as *tabs of one editor* — which
> is the literal claim the video makes about the two parts being one tool. The
> continuity *is* the content here.
>
> *"Why crossfade instead of cut?"* A hard cut would read as a context change. A
> crossfade through the middle, with the indicator sliding, reads as "the same
> surface, turning to its other side." The morph-swap is the archetype for "X and
> Y are two views of one thing," and that's exactly the schema/code relationship.

## The distinctive beat: two-surface sync

This is the move worth stealing. The product gives you *two* surfaces that say
"these are your parameters": the **Available parameters badge row** (real product
UI in the Code tab) and the **blue-rendered param names inside the code**
(`${city}`, `${units}`, which the product's `highlightVariables` paints blue).
The scene lights both at the same instant from one shared value:

```ts
const cityW  = wash(3.5, 3.9, 4.9, 5.3);
const unitsW = wash(5.5, 5.9, 6.7, 7.1);

glow      = { "p-city": cityW, "p-units": unitsW, env: wash(7.7,…), ret: wash(9.9,…) };
paramGlow = { city: cityW, units: unitsW };   // SAME values feed the badges
```

`cityW` drives *both* the selection wash behind `${city}` in the code (`glow`)
*and* the pulse on the `city` badge above it (`paramGlow`) — one number, two
surfaces, identical timeline. The badge pulse is a scale-up plus a ring; the code
wash is the selection rectangle. They breathe together.

> *"Why go to the trouble of syncing two surfaces instead of just highlighting
> the variable?"* Because the fact being taught is an *equivalence*: the thing in
> the badge row and the thing in the code are the same parameter. The cleanest
> way to show "A is B" is to make A and B do the same thing at the same time —
> the eye binds them automatically, with no arrow drawn between them and no
> caption. If you only lit the code variable, you'd be showing "here's a blue
> word"; lighting both, together, shows "the parameter you declared is this
> variable." This is the synchrony move, and it generalizes: whenever two
> on-screen surfaces represent the same underlying thing, prove it by driving
> both from one frame-derived value.
>
> *"Why does the product even have two surfaces saying the same thing?"* Because
> the equivalence is non-obvious to users ("why do I describe parameters twice?"),
> so the product added the badge row as a teaching surface — and the video simply
> *uses the product's own teaching surface* rather than inventing one. Rule 8 and
> rule 1 at once: mirror the real UI, and let it carry the words.

## The remaining washes encode the two riders

After the param sync, two more washes, in order:

- **`{{OPENWEATHER_API_KEY}}`** (7.7→9.5) — it already renders in env-var blue
  (`#35b6ff` dark / `#1d4ed8` light, from `code.css`), so the wash just points at
  syntax the product already color-codes. The lesson — "secrets come in as
  `{{KEY}}`" — is half-told by the product's own coloring before the wash even
  fires. The wash just says "look, *that's* the secret."
- **the `return { … }` block** (9.9→11.7) — washed as a whole block (lines 7–11
  all carry `hl: "ret"`) and held slightly longer than the others. This is the
  rider "whatever you return is what the agent sees." Washing the whole block as
  one selection says "this entire object is the tool's output," and the extra
  hold gives the closing fact of the anatomy a beat to land.

> *"Why is the long fetch line soft-wrapped across two visual rows?"* The docs'
> URL line is one logical line, but rendered at the editor's width it would
> horizontal-scroll and push `{{OPENWEATHER_API_KEY}}` off-screen — killing the
> secrets beat. `_local.tsx` soft-wraps it (the second visual row has no line
> number, exactly as a real editor wraps). The *content* is byte-identical to the
> docs; only the display wraps. This is a sanctioned display adaptation, argued in
> `demo-corpus/get-weather-tool.md`: you may adapt display when the product itself
> would, but never the content.

## The animation, beat by beat

1. **0.6 → 1.4s** — `tab` slides Schema→Code; indicator translates+resizes;
   contents crossfade at constant height.
2. **1.5 → 2.7s** — `codeReveal` ramps the function body top-to-bottom.
3. **3.5 → 5.3s** — `city` sync: badge pulse + `${city}` wash, together.
4. **5.5 → 7.1s** — `units` sync: badge pulse + `${units}` wash, together.
5. **7.7 → 9.5s** — `{{OPENWEATHER_API_KEY}}` wash.
6. **9.9 → 11.7s** — `return { … }` block wash, held; clears.
7. **tail** — Code tab at rest, all washes clear (stretches to VO ≈ 17.1s).

The chain stays fully dimmed throughout (`dim: 1`, edges at 0.25) — scene 2
dimmed it; scene 3 just keeps it there, so there's no re-dim motion on the
boundary.

## How to think about the whole scene

1. *How do I get from schema to code?* Slide the product's own tab at constant
   height → one editor, two faces, never a teleport.
2. *How do I show "schema param = code variable"?* Drive the badge and the code
   variable from one value → the eye binds them; no arrow needed.
3. *How do I teach secrets?* Point at syntax the product already colors blue →
   the product half-told it; the wash finishes the sentence.
4. *How do I teach "return = what the agent sees"?* Wash the whole return block,
   held → the output is one object, and it's the last fact, so it lingers.

## Exit state (what scene 4 inherits)

`world dimmed · editor open on the Code tab · code fully revealed · all washes
cleared · panel at rest`. Scene 4 opens here and then runs the save/exit: the
Save Tool button dips, the panel slides out, the world undims. That save happens
*inside* scene 4, so the 3→4 boundary is identical on both sides.
