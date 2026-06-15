# PATTERN — Agent anatomy & the ChatPanel interior

The distinctive move of Module 5. Steal this whenever a beat's lesson is
**what an agent is doing** — deciding, calling a tool, loading a skill,
producing an answer. Read this page first; the per-scene annotations are the
worked example.

---

## The move in one sentence

When a workflow's middle block is an **Agent**, you don't explain "it thinks"
with a word or a glow — you **open the chat it spun up**, beside the dimmed
chain, and play the turn: the resolved user message arrives → a thinking
indicator → tool-call rows that land **on the exact frame their chip rings
light up on the block** → tool results → the assistant's answer. The answer
never floats on the canvas; it resolves into the next block's row, and the
full record lives in an OutputBundle panel.

That's it. "Thinking" is made concrete as *an LLM call — a fresh chat with
your prompt, your data substituted in, your tools on the table.*

## Why it exists (the rejection that forced it)

The first agent cut ran the block as **exterior state only** — live ring,
think-hold, chip rings — with no view of the messages. The verdict: *"the
agent videos should show what's happening — we should see a chat show up of
the messages being passed, the agent thinking, doing tool calls (that
synchronize with the light ups), and the output."* A think-hold with nothing
visible is a closed box sitting exactly where the lesson lives. (Case 19.)

So the rule: **any beat whose lesson is the agent's behavior REQUIRES the
ChatPanel interior.** Exterior-only is allowed *only* when the agent is
scenery for some other beat.

## The three parts

### 1. Anatomy — the Agent block IS the configuration

Before any run, the Agent block reads as a filled-in form, in product
vocabulary, never captions:

- **Messages** row — `Classify: <start.message>` (the prompt, with a tag)
- **Model** row — `claude-sonnet-4-6`
- **Tools** row — chips: `Docs · CRM · Search` (the toolset on the table)
- **Skills** row — `support-playbook` (optional, revealed later)

The block is the same `SimBlock` component as every other block; "agent" is a
color (`BLOCK_COLORS.agent`) + glyph + the Tools/Skills rows. You configure it;
you never draw a bespoke "agent" widget.

### 2. The ChatPanel interior — the turn, played out

A real chat-styled panel (mirrors `apps/sim/app/chat/components/message`)
opens beside the dimmed block and plays an ordered item list, each item
rising in on its own frame-derived `reveal`:

```
user      →  "Classify and summarize: <start.message>"   (tag resolves here)
thinking  →  three pulsing dots
tool      →  customerLookup · alex.johnson@zengraph…   (pulsing → green check)
result    →  ZenGraph 3282 · Alex Johnson · active · $2M deal
tool      →  Knowledge · refund policy
result    →  0 results
assistant →  billing — double charge; escalate, loop in Jessica Liu
```

The panel is **content-agnostic** (`items: ChatItem[]`) — any video stages any
conversation. The kinds (`user / thinking / tool / result / assistant`) are
the closed grammar.

### 3. Synchrony, not connector lines — the load-bearing trick

Two links are carried **by simultaneity alone**, with no arrow drawn between
surfaces:

- **The Messages param ↔ the chat.** When the user bubble's `<start.message>`
  tag resolves to the real message, the block's Messages row glows and
  resolves to the **same text on the same frames**. That co-resolution *is*
  the sentence "the Messages param IS this chat's messages." No beam.
- **The tool call ↔ the chip.** When a `tool` row appears in the panel, the
  matching chip on the block's Tools row gets its selection **ring** on the
  same window, and releases when the tool's result lands. Tool-call row and
  chip ring share one timing window. That co-occurrence *is* "the agent chose
  this tool." No connector.

This is the precedent rule: **synchrony carries the link, never connector
lines.** Drawing an arrow from the bubble to the row would be the "diagram
annotation" look the whole project rejects. Two things lighting up together
reads as causation for free, and it survives at any zoom.

## How it's built (the mechanics worth copying)

- **One set piece, props express the scene.** `TriageChain` renders the whole
  chain every scene; scene 3 just dims it (`start.dim`, `response.dim`), keeps
  the agent's ring live (`mid.highlighted`), and overlays the panel. Continuity
  is structural — the 2→3 cut is pixel-identical because both render the same
  chain at the same geometry.
- **The held moment.** Scene 2 starts the run and *freezes* at the live ring
  (`agentLive = t >= 4.3`, no release). Scene 3 opens **inside that frozen
  frame** (`agentLive = t < 16.2`) and only releases the ring as the panel
  closes. One continuous run spans two scenes; the cut is invisible.
- **Co-resolution by shared values.** The same string —
  `"I was charged twice"` — is fed to both the block's `msgResolve` and the
  panel's `ResolvedTag value`, on overlapping `interpolate` windows. Identity
  of content + identity of timing = the link.
- **Chip ring = a window per tool.** `crmRing` / `docsRing` are
  `interpolate(t, [in, hold, hold, out], [0,1,1,0])` windows handed to the
  chip's `ring` prop; the same `t` windows gate the panel's `tool` reveal and
  `done`. Change one number, change both, or the sync breaks.
- **The thinking dots and tool "running" dot are frame-derived**, pulsed off a
  `phase = t * 0.9` sine — never a CSS animation.
- **Reveal-and-rise.** Every chat row uses `rowFade(r)` — opacity + a 10px
  `translateY` keyed to its `reveal`. One helper, every row.

## Outputs never float (the companion rule)

A block's output appears in **exactly one of three real surfaces**, never as
free-floating chips/pills on the canvas (Case 18 — *"these look disgusting"*):

1. the **OutputBundle** run-inspector tree, in a proper aside panel (scene 4:
   `logs` + `content` / `tokens` / `toolCalls`, the real numbers);
2. a **resolution into a downstream row** (`ResolvedTag` / `DipSwap` — the
   agent's words landing in Slack's Message row);
3. the product's own tag-dropdown surface.

Borrowing a real surface's *tokens* (badge colors) does not make a new surface
real. If a frame needs "what comes out of this block," the answer is a real
surface or a real consumer — not an annotation. (Tool chips on the Tools row
are exempt: that row *is* product UI.)

## When to use it

- **Use the full interior** when the lesson is the agent's behavior: it
  decides, calls a tool, loads a skill, or produces output.
- **Exterior-only (ring + chip rings, no panel)** is fine when the agent is
  *scenery* — present, but some other block is the lesson of that beat.
- **Never** a think-hold with nothing visible. That's the closed box that got
  rejected.

## The transferable rule

> **Show the agent's behavior from the inside, in the product's own chat
> surface, and link the parts by synchrony — never by drawing connectors.**
> The Messages param and the chat are one thing because they resolve together;
> the tool call and the chip are one thing because they light up together. The
> output lives in a real surface or a real consumer, never floating. Everything
> is one set piece with props; "thinking" is concretely an LLM call you can
> watch.
