# Scene 3 — `inside-the-agent`  ·  archetype: **zoom-aside (the centerpiece)**

Source: `../../../../../projects/sim-explainers/src/videos/module-5-agents/scenes/InsideTheAgentScene.tsx`,
`scenes/_v3.tsx` (the `TriageChain` rig), `../../../../../projects/sim-explainers/src/components/ChatPanel.tsx`,
`../../../../../projects/sim-explainers/src/components/SimBlock.tsx` (the chip ring),
`demo-corpus/triage-run.md`.

This is the scene the whole module exists to deliver, and it carries the move
documented in `../PATTERN.md`. At 24 seconds it's three times any other scene.
Read it slowly — every decision below is one you'll re-make whenever a beat's
lesson is *what an agent is doing*.

---

## What this scene is for

Scene 2 froze on a thinking agent and posed the question: what's it doing in
there? This scene answers it, and the answer is the thesis of the module:

> **Thinking is an LLM call — a fresh chat with your prompt, your data
> substituted in, your tools on the table.** "Like spawning a new chat with
> ChatGPT or Claude, right inside your workflow."

So the scene **opens the chat the agent spun up**, beside the dimmed chain, and
plays the turn end-to-end: the resolved user message → thinking → a tool call
(chip rings in sync) → its result → a second tool call → its result → the
assistant's answer. Then it closes the panel and lets the SAME run complete
outward into Slack. Every value is the real beaming-polaris run.

This is *one* idea — "thinking = a chat" — taught by playing one turn. It is
long because a chat turn has parts, not because it does many things.

## What it looks like

The chain from scene 2 is still there, dimmed (`start.dim`, `response.dim`), the
agent's ring still live. A chat-styled panel rises in to the right of the agent
block (`PANEL = {x: 1235, y: 395, w: 580}`). It plays, top to bottom, as a real
conversation: a right-aligned user bubble, three pulsing dots, tool-call chips
with a running dot that flips to a green check, muted result lines, and finally
a left-aligned assistant answer. As each tool fires, the matching chip **on the
block** rings. Then the panel fades, the ring releases, a pulse crosses to
Slack, and the agent's words resolve into Slack's Message row. Everything
reverts and settles.

## The set piece is unchanged — the panel is an overlay, the chain just dims

```tsx
<TriageChain
  morph={1}
  start={{dim: aside}}
  mid={{highlighted: agentLive}}
  response={{dim: aside, highlighted: respBlip}}
  edge1={{opacity: 1 - 0.75 * aside}}
  edge2={{opacity: 1 - 0.75 * aside}}
  ...
/>
```

Same rig, same geometry as scenes 2, 4, 6. The scene's whole difference is
expressed as props: `start` and `response` **dim** by the `aside` amount (so the
chain recedes behind the conversation), the edges fade to 25% opacity, the agent
block stays lit (`mid.highlighted = agentLive`). The block does **not** move.
The panel is drawn over the unmoved chain.

> *"Why dim the chain instead of hiding it or cutting to a clean panel?"* The
> lesson is that the chat is *inside this block* — keeping the agent visible and
> lit, with the panel beside it, is what makes "the agent spun up a chat" read.
> A clean cut to a full-screen chat would sever the chat from the block and lose
> the whole point. Dim-don't-hide also keeps the boundary continuity (the chain
> is in the same place on the frame before and after the panel).

The `aside` value is the master fader for the whole overlay:

```tsx
const aside = interpolate(t, [0.6, 1.5, 16.0, 17.0], [0, 1, 1, 0], { easing: EASING.inOut });
```

It rises 0.6→1.5s, holds the panel up through the entire turn, and drops
16.0→17.0s — and the same value dims the chain and fades the edges, so the panel
arriving and the chain receding are one coupled motion. When `aside <= 0` the
panel isn't rendered at all (`{aside > 0 ? <ChatPanel/> : null}`).

## The carried-in held state (continuity with scene 2)

```tsx
const agentLive = t < 16.2;            // carried from scene 2's freeze; releases as panel closes
const revertOut = interpolate(t, [21.0, 21.4], [1, 0]);
const inputMix  = Math.min(1, revertOut);
```

Scene 2 left the agent ring **on** and the input **resolved**. Scene 3 honors
both: `agentLive` is true from frame 0 (the thinking continues), and only
releases at 16.2s as the panel closes — *the thinking is done.* `inputMix` stays
at 1 (input still showing "I was charged twice" in Start) until the final revert
at 21.0s. The cut from scene 2 is therefore on identical state; the run is one
continuous gesture, not two.

## The turn, item by item (the ChatPanel interior)

The panel is fed an ordered `items` list; each item carries its own frame-
derived `reveal` and rises in via `rowFade`. The kinds are the closed grammar:
`user / thinking / tool / result / assistant`.

### (a) The user message — and the money beat: co-resolution

```tsx
{ kind: "user", reveal: msgReveal, content:
  <>{"Classify and summarize: "}
    <ResolvedTag tag="<start.message>"
      value="I was charged twice for the Pro plan…"
      glow={0.6} resolve={tagResolve} /></> }
```

The bubble appears (`msgReveal`, 2.5→3.2s) showing the prompt with an unresolved
`<start.message>` tag. Then the **money beat**:

```tsx
const rowGlow    = interpolate(t, [1.7, 2.1, 5.4, 5.9], [0, 1, 1, 0]); // block's Messages row glows
const tagResolve = interpolate(t, [4.5, 5.3], [0, 1], { easing: EASING.inOut }); // tag → real text
const blockTagResolve = Math.min(tagResolve, revertOut);
```

The tag in the chat bubble resolves to the actual message over 4.5→5.3s. **At
the same time**, the block's own Messages row — fed `msgResolve={{text: "I was
charged twice", mix: blockTagResolve}}` — resolves to the same text, and the row
glows (`tagGlowMsg={rowGlow}`). The bubble's `<start.message>` and the block's
`<start.message>` resolve **together, to the same value.**

> *"This is the load-bearing trick of the whole module — read PATTERN.md."*
> There is **no connector line** between the block's Messages row and the chat
> bubble. The link is carried by **synchrony alone**: the same tag, resolving to
> the same content, on the same frames, in two places. That co-resolution *is*
> the sentence "the Messages param IS this chat's messages." Drawing an arrow
> would be the diagram-annotation look the project rejects. Two things lighting
> up together reads as causation for free — and it survives at any zoom, unlike
> a beam that has to be re-aimed every layout change.
>
> *"Why give it 0.8s (4.5→5.3) with `EASING.inOut` when other reveals are
> 0.6s and `EASING.out`?"* This is the beat the scene is *for* — it gets dwell
> time and a settle-in-and-settle-out curve so the eye can register that the
> two resolutions are the same event. The script calls it "the money beat, with
> room to land."

### (b) Thinking

```tsx
{ kind: "thinking", reveal: thinking }   // thinking = pulseWindow 5.8→6.9s
```

Three dots pulsing off `phase = t * 0.9` (a sine, frame-derived — never CSS).
It's a brief hold between the prompt and the first action: the model is
deciding what to do. The window (5.8→6.9) sits right after the tag resolves and
right before the first tool fires — each idea gets its own air.

### (c) Tool call 1 — customerLookup — synced to the CRM chip ring

```tsx
const tool1Reveal = interpolate(t, [7.0, 7.6], [0, 1], { easing: EASING.out });
const tool1Done   = interpolate(t, [8.5, 8.7], [0, 1]);
const crmRing     = interpolate(t, [7.0, 7.3, 8.5, 8.9], [0, 1, 1, 0]);  // ← the chip ring
const result1Reveal = interpolate(t, [8.9, 9.5], [0, 1], { easing: EASING.out });
```

```tsx
{ kind: "tool", reveal: tool1Reveal, name: "customerLookup", color: "#6366F1",
  glyph: <ToolGlyph/>, detail: "alex.johnson@zengraph…", done: tool1Done }
{ kind: "result", reveal: result1Reveal,
  text: "ZenGraph 3282 · Alex Johnson · active · $2M deal" }
```

The tool row appears (7.0→7.6) with a **pulsing running dot**; it flips to a
**green check** at `tool1Done` (8.5→8.7); then the result line appears
(8.9→9.5). The detail and result are the real run's data (`triage-run.md`:
`customerLookup` → the ZenGraph account).

The synchrony: the chip labelled `CRM` on the block is handed `ring: crmRing`,
whose window (7.0→8.9) is **the same window** as the tool row's life — it rings
on as the tool row appears (7.0/7.3) and releases as the result lands (8.5/8.9).

```tsx
gifts={{ tools: [
  {...CHIP_DOCS, ring: docsRing},
  {...CHIP_CRM,  ring: crmRing},
  CHIP_SEARCH_V3,
]}}
```

> *"Why the chip ring and not, say, an arrow from the tool row to the chip?"*
> Same precedent as the Messages beat: **synchrony carries the link, never
> connector lines.** The tool-call row and its chip ring share one timing
> window; their co-occurrence *is* "the agent chose this tool, and that tool is
> this one on the block." The chip ring uses the product's own selection ring
> (`SimBlock`: `boxShadow: inset 0 0 0 1.5px C.ring`, opacity = `tool.ring`) —
> product vocabulary, not an invented signifier.
>
> *"Why does the running dot → green check matter?"* It's the product's call
> lifecycle in miniature: a tool call is in-flight, then done. The check landing
> the same moment the chip ring releases and the result appears makes "the call
> returned" one legible event.

### (d) Tool call 2 — Knowledge — and the honest "0 results"

```tsx
const tool2Reveal = interpolate(t, [10.3, 10.9], [0, 1], { easing: EASING.out });
const tool2Done   = interpolate(t, [11.8, 12.0], [0, 1]);
const docsRing    = interpolate(t, [10.3, 10.6, 11.8, 12.2], [0, 1, 1, 0]);  // Docs chip rings
const result2Reveal = interpolate(t, [12.2, 12.7], [0, 1], { easing: EASING.out });
```

```tsx
{ kind: "tool", reveal: tool2Reveal, name: "Knowledge", color: "#00B0B0",
  glyph: <DatabaseGlyphW/>, detail: "refund policy", done: tool2Done }
{ kind: "result", reveal: result2Reveal, text: "0 results" }
```

Same grammar, the `Docs` chip rings this time (`docsRing`, 10.3→12.2). The
result is **"0 results"** — and that's deliberately honest: KB `e` in the real
run had no billing docs, so the real run returned 0 results twice. The video
shows the truth. (`triage-run.md` notes a PENDING swap if William seeds a
refund-policy doc and re-runs — but until then, the honest value ships. This is
the project's "a table can't show a value the run hasn't produced" discipline
applied to a tool result: don't fake a found document.)

### (e) The assistant answer

```tsx
const replyReveal = interpolate(t, [13.4, 14.1], [0, 1], { easing: EASING.out });
{ kind: "assistant", reveal: replyReveal,
  content: "billing — double charge; escalate, loop in Jessica Liu" }
```

A left-aligned plain-text turn (assistant turns aren't bubbles — mirrors the
real chat UI). It's the agent's conclusion, in its own words, the real run's
content condensed. The turn is the *last* item; the chat is complete.

## Closing the panel and completing the SAME run outward

```tsx
const outPulse = interpolate(t, [17.2, 18.0], [0, 1], { easing: EASING.inOut });
const respMix  = Math.min(interpolate(t, [18.0, 18.35], [0, 1]), revertOut);
const respBlip = t >= 17.9 && t < 18.6;
```

After the answer lands and the panel fades (`aside` drops 16.0→17.0, ring
releases at 16.2), a `WirePulse` crosses **edge 2** (block → Slack) at 17.2→18.0,
Slack blips (`respBlip`), and the agent's category resolves into Slack's Message
row: `respResolve={{text: "billing — double charge", mix: respMix}}`. The block's
Slack tag (`<triage.content>`) resolves to the agent's words.

> *"Why does the answer land in Slack's row and not float somewhere?"* This is
> the outputs-never-float rule (Case 18). The agent's output appears as a
> **resolution into the downstream consumer's row** — a real surface — never as
> a floating chip on the canvas. The thing the agent produced becomes the thing
> the next block sends. (The fuller record — tokens, toolCalls — gets its own
> real surface, the OutputBundle, in scene 4.)

Then the final revert at 21.0→21.4s (`revertOut`) takes input, the block tag,
and the response tag all back to template values together, and the scene settles
on a clean reverted chain.

## Timing as a readable transcript

Lay the windows end to end and the scene is a legible turn, each beat in its own
air, never two stacked:

| t (s) | event |
|---|---|
| 0.6–1.5 | panel rises, chain dims |
| 2.5–3.2 | user bubble appears |
| 4.5–5.3 | **tag co-resolves** in bubble AND block row (money beat) |
| 5.8–6.9 | thinking dots |
| 7.0–9.5 | tool 1 (customerLookup) — CRM chip rings, result lands |
| 10.3–12.7 | tool 2 (Knowledge) — Docs chip rings, "0 results" |
| 13.4–14.1 | assistant answer |
| 16.0–17.0 | panel closes, ring releases |
| 17.2–18.35 | pulse to Slack, `<triage.content>` resolves |
| 21.0–21.4 | everything reverts; settle |

Each tool occupies a clean ~2.5s block with nothing else moving; the money beat
gets a full second of dwell. That's the "one idea per moment" discipline scaled
up to a 24s scene — it's long but never busy.

## How to think about the whole scene

1. *What is "thinking"?* An LLM call → **open the actual chat**, in the
   product's real chat surface, beside the still-lit block.
2. *How does the chat relate to the block's config?* The Messages param IS the
   chat → resolve the SAME tag to the SAME value in both, on the same frames →
   **synchrony, no connector line.**
3. *What is a tool call?* A row in the chat → and the chip on the block **rings
   in the same window** → the call and the chip are one thing, by co-occurrence.
4. *What does the agent produce?* An answer in the chat → which **resolves into
   the next block's row** (Slack), never floating.
5. *How is it all one run?* The ring carried in from scene 2 holds through the
   panel and only releases as it closes → one continuous run across the cut.

## Exit state (what scene 4 inherits)

`Triage agent on the chain (morph=1) · panel gone · ring released · all tags
reverted to template values · chain settled at neutral.` Scene 4 opens on this
clean chain and raises the OutputBundle over it — the run *record*, the same run
you just watched, written down.
