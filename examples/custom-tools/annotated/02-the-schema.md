# Scene 2 — `the-schema`  ·  archetype: **zoom-aside**

Source: `../source/scenes/TheSchemaScene.tsx`, `../source/scenes/_local.tsx`
(`SCHEMA_LINES`, `TOOL_PARAMS`), `../source/layout.ts` (`PANEL_*`), and the
ported editor `src/components/ToolEditorPanel.tsx`.

This is the first half of the distinctive move — the **tool-editor anatomy**. The
video's whole reason to exist is "a custom tool is two parts." This scene opens
the actual product editor and shows you part one: the schema, the only thing the
model ever reads. Read it as the worked example of how to *port a complex product
surface* and then *teach it with the product's own selection color* instead of
arrows and captions.

---

## What this scene is for

After scene 1 you believe custom tools are ordinary. Now the question planted in
your head is "so what *is* one?" The answer is two-part, and this scene delivers
exactly one part: the schema. The schema is "the only thing the agent ever
sees" — name, description, parameters. The scene's job is to walk you through
that JSON in the order the model reads it (what's it called → what's it for →
what does it need) while never writing a single explanatory word on screen.

One idea per scene: this is "here is the schema, and here is what each part of it
tells the model." The code is part two — its own scene. Cramming the code tab in
here would make the editor do two things at once and blur the cleanest fact in
the whole video (there are exactly *two* parts).

## What it looks like

The world dims: the Triage chain drops to 0.35 opacity and recedes. The
**Create Agent Tool** editor rises into center frame on its Schema tab — a real
modal with a header, Schema | Code tabs, a "JSON Schema" label, a "Generate"
button, the editor pane, and a footer (Cancel / Next). The `get_weather` schema
reveals top to bottom, line by line. Then a selection-blue wash sweeps the parts
the model reads: the `"name"` line, then the `"description"` line, then the whole
`city` parameter block, then the whole `units` block — each held briefly, the
previous one releasing as the next lights. The washes clear; the panel rests.

## The big decision: port the *whole* editor as a configurable component

The editor is not drawn per-scene. It's a single ported component,
`ToolEditorPanel`, that scenes 2, 3, and 4 all render — the same way the
market-desk videos render one `<Stage/>` set piece across every scene. The
component is a verbatim port of the product modal, with every metric traced in
its header comment to real source files:

- Modal chrome (`emcn/modal.tsx`): size-xl `max-w-[800px]`, `rounded-xl`,
  header `px-4 pt-4 pb-2` with a 16px close X, tabs `px-4 gap-4` with a 1px
  active indicator, body `px-4 pt-3 pb-4`, footer `border-t px-4 py-3` on 50%
  surface-3.
- Editor (`emcn/code/code.tsx` + `code.css`): `CODE_LINE_HEIGHT_PX = 21`, 20px
  gutter, `text-xs tabular-nums` line numbers, 13px code, the Prism token
  palette for **both** themes, param/`{{ENV}}` blue.
- Buttons (`emcn/button.tsx`): variants default / active / primary at real
  paddings and radii.

> *"Why port the chrome down to `pb-2` and `tabular-nums`? Nobody reads a footer
> padding."* Because authenticity is cumulative and invisible. No single metric
> is noticed; the *sum* is the difference between "that's the Sim editor" and
> "that's a code box someone drew." This is rule 8 (mirror Sim's real UI) at its
> most demanding: the editor is a dense, chrome-heavy surface, and the only way
> it reads as real is to port it as a unit from the source, re-deriving every
> color from the current `globals.css` rather than from memory. The payoff is
> that the audience never questions the surface, so all their attention is free
> for the schema itself.

**The component never animates itself.** Every moving value enters as a numeric
0..1 prop computed by the scene: `opacity`, `slide`, `tab`, `schemaReveal`,
`codeReveal`, `glow`, `paramGlow`, `savePress`. The port is a pure function of
its props; the scene owns the clock. That separation is what lets three scenes
share one editor and stay continuous across their boundaries.

## The schema content is the docs' own example, verbatim

`SCHEMA_LINES` in `_local.tsx` is the `get_weather` schema copied byte-for-byte
from `apps/docs/content/docs/en/tools/custom-tools.mdx` — the product's *own*
authored teaching example — then tokenized span by span to match the product's
Prism theme.

> *"Why use the docs' example instead of inventing a cleaner one, or
> reconstructing module-5's `customerLookup`?"* Two rules collide and both point
> the same way. Inventing values violates grounding (every on-screen value must
> trace to a real artifact). Reconstructing `customerLookup` would mean inventing
> its unpublished schema. The docs' `get_weather` is the one schema that is both
> real and publishable — it's what Sim itself uses to teach this. Use the
> product's own teaching artifact when it exists; don't out-design the docs.

Note the tokenization carries `hl` group tags (`name`, `desc`, `city`, `units`)
on the relevant lines. Those tags are the *anchors the selection wash paints
behind* — the content and the highlighting share one data structure, so a wash
can never drift off the line it's meant to mark.

## The teaching move: the product's selection color, not arrows

There is no callout box, no arrow, no "← the name" label anywhere. The scene
teaches purely by painting the product's **text-selection color**
(`--selection-dark` #264f78 in dark, `--selection-bg` #add6ff in light) behind
the lines being discussed, in reading order. That's it.

```ts
const wash = (a,b,c,d) => interpolate(t, [a,b,c,d], [0,1,1,0], { clamp both });
const glow = {
  name:  wash(3.4, 3.8, 4.8, 5.2),
  desc:  wash(5.4, 5.8, 6.8, 7.2),
  city:  wash(7.4, 7.8, 8.6, 9.0),
  units: wash(9.0, 9.4, 10.2, 10.6),
};
```

Each `wash` is a four-point pulse: fade up (a→b), hold (b→c), fade down (c→d),
clamped flat outside. The editor renders `glow[line.hl]` as a selection-colored
rectangle behind the line at `0.55 * value` opacity.

> *"Why the selection color specifically — why not a yellow highlight or a
> glow?"* Because selection is what a human does when reading code to someone:
> you drag-select the line you're talking about. The viewer has seen text
> selection ten thousand times; it reads instantly as "look here, this is what
> I mean" with no learning curve and no foreign vocabulary. A yellow marker or a
> neon glow would be an invented annotation language — slop. The selection wash
> is rule 8 applied to *pointing*: even the act of drawing attention uses a
> product affordance, not a graphic-design overlay.
>
> *"Why hold each wash for ~1s and release before the next?"* So exactly one
> thing is focal at a time (rule 7). The release of `name` before `desc` lights
> means you're never reading two highlights at once; your eye is walked down the
> schema one fact per beat. The overlap is deliberately tiny — `units` starts at
> 9.0 just as `city` finishes at 9.0 — a clean handoff, not a dissolve.

## The reveal order encodes the lesson

The wash order is `name → description → city → units`, which is precisely "what
is it called → what does it do → what does it need." That's the order the model
reads the schema to decide whether and how to call the tool. The animation
*is* the explanation of how an agent uses a schema; the narration only has to
name what the picture is already doing.

> *"Why are `city` and `units` washed as whole multi-line blocks, while `name`
> and `description` are single lines?"* Because a parameter is a unit — its
> type, its description, its enum are one thing the model reads together. The
> `_local.tsx` data tags every line of the `city` object with `hl: "city"`, so
> the wash lights the whole block as one selection. This silently teaches "a
> parameter is more than its name" without a word about JSON Schema structure.

## The aside mechanics — dim the world, raise the panel

```ts
const aside = interpolate(t, [0.3, 1.2], [0, 1], { ease inOut });
// chain: start/mid/response dim={aside}; edges opacity 1 - 0.75*aside
// panel mounts only when aside > 0; opacity & slide both = aside
```

The single `aside` value drives both halves of the move: the chain dims toward
0.35 *and* the panel fades+rises (the `slide` prop translates it down-to-up by
36px as it appears). One clock, two coordinated motions, so the world receding
and the editor arriving are the same gesture rather than two stacked animations.

> *"Why dim the chain to 0.35 instead of cutting to a clean editor on black?"*
> Because the chain is the *context* the editor belongs to — keeping it dimly
> present says "you're still in your workflow; this panel is a thing you opened,
> not a different place." Cutting it away would sever the editor from the agent
> it's a tool for. The dim is the zoom-aside's defining property: the world
> doesn't leave, it recedes.

## The animation, beat by beat

1. **0.3 → 1.2s** — `aside` ramps: chain dims, editor rises and fades in (Schema
   tab, empty editor).
2. **1.4 → 2.8s** — `schemaReveal` ramps the 22 lines top-to-bottom (the editor's
   per-line stagger: `opacity = clamp01(reveal*(n+2) - i)` gives each line its
   own staggered fade keyed to its row index).
3. **3.4 → 5.2s** — `name` wash up/hold/down.
4. **5.4 → 7.2s** — `description` wash.
5. **7.4 → 9.0s** — `city` block wash.
6. **9.0 → 10.6s** — `units` block wash; clears.
7. **tail** — panel at rest, Schema tab, all lines revealed, washes clear. The
   scene holds here and can stretch to the VO (timed to 15.8s).

> *"Why does the reveal (b) finish at 2.8 but the first wash not start until
> 3.4?"* Same discipline as every clean scene: let the surface fully arrive and
> settle, hold a half-second of stillness, *then* start pointing. Overlapping the
> line-reveal with the first selection would stack two animations and read busy.

## Exit state (what scene 3 inherits)

`world dimmed (chain at 0.35) · editor open on the Schema tab · all 22 lines
revealed · all washes cleared · panel at rest`. Scene 3 opens on exactly this
frame and then — inside scene 3 — slides the tab indicator from Schema to Code.
The schema→code morph happens *within* scene 3, never on the boundary, so the
2→3 cut is identical on both sides.
