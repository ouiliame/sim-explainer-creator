# CORE PATTERN — Editor anatomy + capability lands on the table

**Source video:** `custom-tools` (5 scenes, ~49s · 66s with VO).
**Annotations:** `annotated/01..05` (scene-by-scene, market-desk depth).
**One-line shape:** orient on a running set piece → open the real product editor
and walk its two-part anatomy with the product's own selection color → pay the
result back as a chip that lands on the set piece → close by running it again and
letting the model choose.

This is the pattern for teaching **"a capability is two things, and once made it
becomes an ordinary object in your world."** It's the cleanest template in the
pack for any "how you build X, and what X becomes" video.

---

## The move

A configurable feature (here: a custom tool) is **two coordinated surfaces** —
something a reader consumes (the *schema* the model reads) and something that runs
(the *code*). The video:

1. **Opens on the known, running.** Reuse a set piece the audience already saw
   (the module-5 Triage chain) and run it, ringing the one chip that's secretly
   the thing the video is about. Capability-first, never a manufactured problem.
2. **Opens the real editor as an aside.** Dim the world; raise a *verbatim port*
   of the product modal (Create Agent Tool). Walk part one (schema) then part two
   (code) with the product's **text-selection color** painting the lines being
   discussed — in reading order. No arrows, no callouts, no captions.
3. **Syncs two surfaces to show an equivalence.** When two on-screen things are
   the same thing (a schema parameter and its code variable), drive *both* from
   one frame-derived value so they light together. The eye binds them; no arrow
   needed.
4. **Lands the capability on the table.** Press the real Save button, slide the
   editor out, undim the world — then a new **chip grows in by width** onto the
   agent's tool line. The abstract editor work becomes a concrete object in the
   set piece.
5. **Closes by bookending the open.** Run the same set piece again with one new
   variable: the new chip is present but the agent rings a *different*, relevant
   chip. Relevance is the model's call — shown by which chip rings, nothing else.

## How it's built (steal this)

- **One ported editor component, props-driven, never self-animating.**
  `ToolEditorPanel` is a verbatim port of the product modal — every metric
  (`max-w-[800px]`, `CODE_LINE_HEIGHT_PX=21`, the Prism palette for both themes)
  traced to a source file in its header comment. It exposes only numeric 0..1
  props (`tab`, `schemaReveal`, `codeReveal`, `glow`, `paramGlow`, `savePress`,
  `opacity`, `slide`); scenes own the clock. Three scenes share it and stay
  continuous because it's a pure function of its props.
- **Tab switch = morph-swap at constant height.** A `tab` 0→1 slides the
  product's 1px indicator (interpolating `left` + `width` between measured tab
  boxes) and crossfades schema↔code through the middle (`schemaOp/codeOp` windows).
  Editor heights are pre-computed so total body height is identical across tabs —
  the schema tab stays mounted at `opacity:0` to hold the height. One editor, two
  faces, never a teleport.
- **Selection-wash as the pointer.** A four-point `wash(a,b,c,d)` pulse
  (`[0,1,1,0]`, clamped) drives a selection-colored rectangle behind a tagged line
  or span (`glow[hl]`). Content and highlight share one data structure
  (`EditorLine` carries `hl` tags), so a wash can't drift off its line. One wash
  focal at a time; release before the next.
- **Two-surface sync.** `const w = wash(...)` feeds *both* `glow["p-city"]` (code
  variable) and `paramGlow.city` (the badge) — one value, two surfaces, identical
  timeline. Equivalence shown, not stated.
- **Chip-ring = tool call.** A chip's `ring` (0..1) renders an inset selection
  ring (`SimBlock.tsx`). Scope the ring *inside the owning block's live window* —
  that containment is the causal claim "the agent, mid-thought, reached for this
  tool." One chip rings = the agent chose one tool.
- **Chip lands by width-growth.** A revealing chip uses a **measured** natural
  width (`chipNaturalWidth`, `@remotion/layout-utils`) scaled by its reveal, so it
  expands into the chip row instead of popping into a slot. Then one selection
  pulse = "this is the new one."
- **Bookend by minimal difference.** Open and close are near-identical shots;
  change exactly one variable (the new chip, present-but-quiet) so the contrast is
  the only thing the eye lands on.

## When to use it

Reach for this pattern when the topic is **"here's a thing you make, and here's
what it becomes once made"** — and the thing has internal structure worth a tour:

- A custom tool (schema + code) → a chip on an agent.
- A connection/integration (config + auth) → a usable source.
- A schedule/trigger (condition + action) → a live arming on a workflow.
- Any "two-part artifact → it joins your existing world as an ordinary object."

It's *especially* strong when a prior video already put the destination object on
screen — then scene 1 can reuse that set piece and re-label, and scene 5 can
bookend it, for free.

Don't use it when the capability has no "lands somewhere" payoff (it's pure
config with no object that appears), or when there's no real artifact for the
editor content — the move depends on porting the *real* surface and using the
product's *own* example.

## The transferable rule

> **Port the surface, point with the product's own affordances, and pay the
> aside back into the set piece.** Teach internal structure by walking the real
> editor with the product's selection color (never arrows/captions); prove two
> things are the same by driving both from one value; and make the abstract work
> *land* as a concrete object that grows into the world the viewer already knows.
> The capability isn't explained — it's built in front of you and then set down
> on the table, where the model picks it up only when it's relevant.
