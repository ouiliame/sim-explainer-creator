# Scene 4 — `the-run-record`  ·  archetype: **inspector-aside (outputs in a real surface)**

Source: `../../../../../projects/sim-explainers/src/videos/module-5-agents/scenes/TheRunRecordScene.tsx`,
`../../../../../projects/sim-explainers/src/components/` (`OutputBundle`),
`scenes/_v3.tsx`, `demo-corpus/triage-run.md`.

The companion to the centerpiece. Scene 3 showed the run *happening*; this scene
shows the run *recorded* — and it's the canonical example of the
**outputs-never-float** rule. Read it as the answer to "where does a block's
output actually live."

---

## What this scene is for

After watching the agent think and call tools, the viewer might wonder whether
any of that is inspectable, or whether it's a black box. This scene's single
idea: **nothing about the run is a mystery — it's all written down.** It does
that by raising the product's own run inspector (`OutputBundle`) over the dimmed
chain, populated with the **real** numbers from the beaming-polaris run, and
spotlighting the `toolCalls` array — the structured record of exactly the two
tool calls you just watched in scene 3.

This scene is also where the narration hangs the term "tool calling" — the
visual (a `toolCalls` array, expanded, glowing) gives the word something
concrete to point at.

## What it looks like

The chain recedes (dims) and a large run-inspector panel rises in over it
(scaled 1.7×, spring-driven rise). It's a tree: a row of **block logs** with
per-block durations (`Start 32ms · Triage 12.2s (selected) · Slack 111ms`), then
the agent's output **values** — `content` (string), `tokens` (object: input
5074 / output 431), and `toolCalls` (array of three entries with durations and
results). The `toolCalls` node glows as the focal element. Then the panel fades
and the chain comes back.

## Outputs live in a REAL surface — never floating chips (the rule this scene teaches)

This is the positive example of Case 18 (*"these look disgusting"* — floating
output pills were rejected). The block's outputs are **not** drawn as free-
floating typed badges beside the block's out-port. They appear in the
`OutputBundle` — the product's actual run-inspector tree — in a proper aside
panel. From `PATTERN.md`, a block's output may appear in exactly three real
surfaces:

1. the **OutputBundle** run-inspector tree (this scene);
2. a **resolution into a downstream row** (scene 3: the answer landing in
   Slack's Message row via `ResolvedTag`);
3. the product's tag-dropdown surface.

Scene 3 used surface #2 for the *answer*; this scene uses surface #1 for the
*full record* (durations, tokens, the toolCalls structure). Borrowing a real
surface's tokens (badge colors) to make a floating chip rail does **not** make a
new surface real — the product never draws output pills on the canvas. If a
frame needs "what comes out of this block," the answer is a real surface or a
real consumer, full stop.

> *"Why split the output across two scenes (answer→Slack in 3, record here)?"*
> Because they're two different lessons. Scene 3's point is *the agent's words
> become the next block's input* (a consumer). Scene 4's point is *the whole run
> is inspectable* (a record). Putting tokens and toolCalls in scene 3 would
> clutter the chat turn; putting the Slack resolution here would bury it. One
> idea per scene, even for "the output."

## The set piece is unchanged — dim and overlay

```tsx
<TriageChain
  morph={1}
  start={{dim}} mid={{dim}} response={{dim}}
  edge1={{opacity: 1 - 0.75 * dim}} edge2={{opacity: 1 - 0.75 * dim}}
  gifts={{tools: [CHIP_DOCS, CHIP_CRM, CHIP_SEARCH_V3]}}
/>
```

Same rig, same geometry, same three tools as every other scene. The chain just
dims (`dim` pulses up 0.4→1.1, holds, down 6.6→7.4) and the OutputBundle is
overlaid. The chain never moves — the inspector is an aside over the unmoved
canvas, exactly like the chat panel in scene 3. Continuity is structural.

## Every value is the real run

```tsx
logs=[
  {name: "Start",  duration: "32ms",  ...},
  {name: "Triage", duration: "12.2s", selected: true, ...},  // the agent, spotlit
  {name: "Slack",  duration: "111ms", ...},
]
values=[
  {key: "content", type: "string", value: "billing — Alex Johnson charged twice…"},
  {key: "tokens",  type: "object", children: [
    {key: "input",  type: "number", value: "5074"},
    {key: "output", type: "number", value: "431"}]},
  {key: "toolCalls", type: "array", highlight: toolCallsHi, children: [
    {key: "[0] customerLookup",   type: "object", value: "375ms · 1 account"},
    {key: "[1] knowledge_search", type: "object", value: "457ms · 0 results"},
    {key: "[2] knowledge_search", type: "object", value: "540ms · 0 results"}]},
]
```

Every number traces to `demo-corpus/triage-run.md`: durations 32ms / 12225ms /
111ms, tokens 5074 in / 431 out, the three tool calls with their real durations
and results (and yes, two of them honestly returned **0 results**). The Slack
111ms is a noted stand-in (the live run wrote to a Table; the duration is
borrowed from LogTicket until the Slack-wired re-run). The `content` value names
the real ZenGraph account. Nothing here is invented; the record is a faithful
depiction of an actual run.

Note `toolCalls` has **three** entries here vs. **two** tool rows in scene 3:
the real run fired `knowledge_search` twice (iterations 1 and 2). Scene 3
condensed to one "Knowledge" call for legibility of the chat turn; the *record*
shows the full truth. The record is the source of truth; the chat is the
readable narration of it.

## The animation, beat by beat

```tsx
const dim      = interpolate(t, [0.4, 1.1, 6.6, 7.4], [0, 1, 1, 0], { easing: EASING.inOut });
const panelOp  = interpolate(t, [0.9, 1.7, 6.6, 7.4], [0, 1, 1, 0], { easing: EASING.out });
const panelRise = popIn(frame, fps, 0.9, 0.8);            // spring overshoot
const panelY    = 200 + (1 - panelRise) * 30;            // rises 30px into place
const reveal = (t0) => interpolate(t, [t0, t0 + 0.4], [0, 1], { easing: EASING.out });
const toolCallsHi = interpolate(t, [3.6, 4.2, 6.0, 6.6], [0, 1, 1, 0]);  // the spotlight
```

- **Chain dims, panel rises** (0.4–1.7s). The panel uses a `popIn` spring for an
  organic overshoot on the way up; opacity handles the exit (springs don't
  cleanly reverse, so the exit is a separate opacity fade — a standard project
  pattern).
- **The tree populates top-down** via per-node `reveal(t0)` — logs at 1.7/1.9/
  2.1s, then `content` 2.3, `tokens` 2.6, `toolCalls` 2.9. Same staggered-reveal
  feel as a table loading: you read the structure being written, not a wall
  appearing.
- **`toolCalls` glows** (`toolCallsHi`, 3.6→6.6) as the focal element — this is
  the scene's point, and it's where the VO lands "tool calling." Everything else
  is present but quiet; one focal element per moment.
- **Panel fades, chain returns** (6.6–7.4) — back to the neutral chain for the
  next scene.

> *"Why spotlight `toolCalls` specifically when `content` and `tokens` are right
> there?"* Because the scene is teaching that the tool calls — the thing that
> looked like magic in scene 3 — are *recorded as data*. `content` and `tokens`
> are context (the run produced an answer, it cost some tokens); `toolCalls` is
> the payload of this beat: the agent's actions are an inspectable array. Dim
> the rest, glow the one.

## How to think about the whole scene

1. *Is the run a black box?* No → show the product's **real run inspector**
   (`OutputBundle`), never invented output chips.
2. *Where do outputs go?* Into a real surface (this) or a real consumer (scene
   3's Slack row) → never floating on the canvas.
3. *What are the values?* The actual run's numbers, traced to the demo-corpus →
   even the unflattering "0 results."
4. *What's the focal point?* `toolCalls` glows; everything else is quiet → one
   idea per moment.
5. *How is continuity kept?* Same set piece dimmed, inspector overlaid, chain
   unmoved → structural.

## Exit state (what scene 5 inherits)

`Triage agent on the chain (morph=1) · inspector gone · chain back at neutral,
undimmed · three tools shown.` Scene 5 opens on this clean chain and grows the
`Refunds` workflow-as-tool chip onto the Tools line.
