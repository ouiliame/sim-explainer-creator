# Scene 5 — `you-call-theirs`  ·  archetype: **run**

Source: `../source/scenes/YouCallTheirsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`.

This is the scene where the video's argument turns around. Scenes 2–4 spent
their whole length pointing *inward*: you deployed the Scout chain, and one
after another — a stranger, then a rush of five — outside callers reached in
from the left edge and drove *your* agent. This scene runs the same machinery
in reverse. *Your* agent reaches *out* to the top-right and drives somebody
else's. Read it as the worked example for "how do I show the same grammar
playing backwards without re-teaching it," because almost every decision here
is the mirror image of a decision scene 3 already made — and the value of the
scene is that the viewer feels the rhyme.

---

## What this scene is for

The video's one idea is "deploy a workflow as an MCP tool and it becomes
infrastructure other agents call; *the same protocol lets your agent call
theirs.*" Scenes 2–4 proved the first clause exhaustively. This scene exists to
prove the second, and in doing so to **close the loop that makes it an
*economy* rather than a publishing model**. A one-directional story — "you
publish, others consume" — is just a marketplace. The thing that earns the word
*economy* is reciprocity: every participant is simultaneously a supplier and a
consumer. So this scene has to take the agent that was the *callee* in every
prior scene and show it become a *caller*, using a tool that is itself another
team's deployed agent. The flip is the whole point.

So the rule is still *one idea per scene* — the idea is "your agent consumes
their deployed agent as a tool" — but to land it the scene has to do two things
the inbound scenes never had to: it has to **flip the focus** from the left
edge to the top-right, and it has to **draw a tool call as a round trip on a
brand-new spoke** while the run is mid-flight. Everything below is in service of
those two.

## What it looks like

The full ecosystem from scene 4 is on screen — the Scout chain center, the five
client badges down the left, the tool pill above the entry. Then the focus
**inverts**: the badges, the entry, and the pill all dim to roughly a third of
their brightness, and the edges dim partway, leaving the Agent block the only
fully-lit thing in frame. A partner server badge — `pricing_intel`, in MCP
purple — springs in at the **top-right**, and a spoke draws out of the Agent's
own source handle, hops right, climbs, and lands on it. The Agent's Tools row
then *grows* a third chip, `pricing_intel`, the block widening to fit it rather
than popping. Then one run fires from the editor: `Octave Systems` resolves into
the entry's Input row, the Agent goes live — and **stays live for an unusually
long beat**, because while it's live the new chip rings, a pulse rides the
partner spoke *out* to the top-right and *back*, the partner badge flashes blue
then green, and only then does `"voice agents"` resolve into the Response. The
rows revert, the world un-dims, and the chip, badge, and spoke all stay.

## The run grammar — this scene *quotes* it, doesn't reinvent it

Every run in this video is built from one shared function, `runBeats(t, a,
{midDur, hold})` (ported from the module-5 agents build), and scene 1 spent its
length teaching that grammar so every later scene could quote it. Before the
beats, it's worth restating the three rules every run obeys, because this scene
leans on all three and then adds exactly one new surface:

1. **A pulse is the only thing that travels a wire, and it carries no cargo.**
   `WirePulse` (on the chain edges) and `PathPulse` (on the partner spoke) are
   streaks of blue light — not values, not payloads. A wire firing means
   "control passed," full stop.
2. **Values never ride wires. They resolve *in place*, in rows.** When `Octave
   Systems` or `"voice agents"` appears, it appears in the block row where it
   *lives*, via `DipSwap` / `ResolvedTag` — never as a chip drifting down a
   connector.
3. **State is shown in the product's own language** — a blue live ring, a green
   ok flash, a selection ring on a chip — never a word like "RUNNING."

The one new surface this scene introduces is the **chip ring**: the
`pricing_intel` chip on the Tools row gets a selection ring exactly while the
outbound call is in flight. That's the same vocabulary scene 1 used for the
Search chip ("the agent, while working, called its tool") — pointed at a
different tool. Nothing here is a new idea; it's the established grammar with the
arrow reversed.

> *"Why reuse `runBeats` verbatim instead of choreographing the flip from
> scratch?"* Because the load-bearing claim of the whole video is that calling
> out and being called are *the same protocol*. If the outbound run looked
> different from the inbound runs — different timing, different rings, a
> bespoke animation — the viewer would read it as a different *kind* of thing,
> and the symmetry argument would collapse. Quoting the exact run grammar is
> how the scene *shows* "it's the same protocol" instead of asserting it in
> narration. The reversal lives entirely in *where* the spoke points, not in
> how the run behaves.

## The one set piece, again

As in every scene, this renders the *single* `<EconomyRig/>` — the same chain,
the same five badges, the same pill, plus the partner that scene 6 will inherit
— and differs only in state props. Nothing is mounted or unmounted at the cut.
The five badges that were lit and settled at the end of scene 4 are the same
five badges dimmed here; the partner badge that springs in here is the same one
scene 6 opens with at full reveal. That's why the `4→5` boundary is identical
down to the pixel: scene 4 left "deployed state C" (all five badges + spokes,
rows at template), and scene 5 opens on exactly that frame before the dim begins.

## The camera

There is no `cam` prop in this scene at all — the rig renders at the stage's
home framing and **does not move**. The flip is accomplished entirely by
*dimming*, not by reframing.

> *"Why hold the camera still in the scene whose whole job is to redirect the
> viewer's attention?"* Because the redirection is itself the content, and the
> cleanest way to redirect attention on a fixed diagram is to *subtract* the
> things you want ignored, not to push the lens around. If the camera panned
> from the left badges up to the top-right partner, you'd be moving the frame
> *and* the focus at once — motion-on-motion, and the viewer can't tell whether
> the partner is important because it's new or because the camera chose to look
> at it. By holding the frame and dropping everyone except the Agent to 0.35,
> the scene says "look here" with contrast, which is unambiguous. The camera in
> this video moves exactly once, in the bookend (scene 6), and only to reframe
> the whole chain as one node in an ecosystem — never to point at a beat. This
> scene's beat is pointed at by dimming.
>
> *"Why dim instead of just brightening the new partner?"* Same reason scene 2
> dimmed the downstream to make the entry focal: a single focal element reads
> only against a dimmed field. Brightening the partner while leaving the five
> badges and the pill at full would give you *two* bright regions competing for
> the eye. The dim-flip is the project's standard refocus move — drop the old
> actors to 0.35, leave the new focus at full — and it's used here precisely so
> the viewer's eye lands on the Agent (the thing that's about to become a
> caller) and the partner it's about to call, and nothing else.

## Beat 0 — the dim-flip (the focus inverts)

```ts
const dimIn  = interpolate(t, [0.4, 1.0], [0, 1], { /* clamp */ });
const dimOut = interpolate(t, [10.6, 11.3], [1, 0], { /* clamp */ });
const dimAmt = dimIn * dimOut;
```

The dim ramps *in* over **0.4 → 1.0s** and ramps back *out* over **10.6 →
11.3s**, multiplied together so `dimAmt` is a single envelope: up at the top,
held through the run, released at the very end. It's applied to everything that
isn't the Agent — the five badges (`dim: dimAmt`), the entry block (`entry:
{dim: dimAmt}`), the Response (`response: {dim: dimAmt}`), the pill (`dimmed:
dimAmt`), and the caller spokes and chain edges, which drop only partway
(`opacity: 1 - 0.45 * dimAmt`).

> *"Why does the dim hit 0.35 on the blocks but the edges only drop to ~0.55?"*
> Look at the two formulas. The block dim runs through `visOpacity`, which
> computes `(opacity) * (1 - 0.65 * dim)` — so at full `dimAmt = 1` a block sits
> at `1 − 0.65 = 0.35`. The edges and spokes use `1 − 0.45 * dimAmt`, bottoming
> out at `0.55`. The blocks dim harder than the wires on purpose: the wires are
> *structure* (they tell you the chain is still wired together) while the blocks
> are *actors* (they tell you who's doing something). You want the structure to
> recede but stay legible — a fully-dark wire would read as "disconnected" — and
> the actors to recede further so the one lit actor pops. Two different dim
> depths, two different jobs.
>
> *"Why ramp the dim in over 0.6s instead of snapping it?"* Because the flip is
> a *transition of attention*, and attention doesn't teleport. A 0.6s fade lets
> the viewer's eye follow the brightness shifting rather than being yanked. It's
> also the same duration as the badge entrances and the spoke draws below, so
> every motion in the scene's opening shares one cadence and reads as composed.
>
> *"Why is `dimAmt` a product of an in-ramp and an out-ramp rather than one
> window?"* So the *release* at the end is a single, separately-timed event
> (`10.6 → 11.3`), independent of the in-ramp. The dim holds flat at 1 for the
> whole run because `dimIn` has clamped to 1 and `dimOut` hasn't started yet;
> multiplying them gives you "fade up, hold, fade down" with two independent
> edges you can tune without touching the middle. The un-dim is the scene's
> closing breath, and it's deliberately *after* the rows revert — the world
> only brightens back once the new identity (the third chip) exists and the run
> is done.

## Beat 1 — the partner appears, the spoke draws, the chip grows

Three entrances, staggered, each its own beat:

```ts
const partnerReveal = popIn(frame, fps, 1.2);                 // badge springs in
const partnerSpoke  = interpolate(t, [1.9, 2.6], [0, 1], {easing: EASING.out});
const chipReveal    = interpolate(t, [2.8, 3.5], [0, 1], {easing: EASING.out});
```

The partner badge springs in at **1.2s** via `popIn` — the same spring (damping
14, stiffness 160, 0.6s, scale 0.82→1) that brought in every client badge in
scenes 3–4. Its spoke draws on over **1.9 → 2.6s**, `EASING.out`. Then the
`pricing_intel` chip grows onto the Agent's Tools row over **2.8 → 3.5s**,
`EASING.out`.

> *"Why `popIn` for the badge but a plain `interpolate` for the spoke and the
> chip?"* Because `popIn` is a *spring* — it has a slight organic overshoot, the
> little settle that makes a card feel like it dropped into place. That's right
> for an object *arriving* (a badge is a thing). A spoke *draws* and a chip
> *grows*; those are not arrivals, they're a line being traced and a width
> expanding, and a spring overshoot on a line length or a block width would read
> as a glitch (the wire would over-extend and snap back, the block would jiggle).
> So: spring for the badge entrance, eased ramp for the geometry that
> extends. This is the same split scene 3 made between its badge `popIn` and its
> spoke draw.
>
> *"Why this 1.2 / 1.9 / 2.8 stagger — roughly 0.7s apart?"* The three
> entrances are a *causal sentence*: a partner exists (badge) → your agent can
> reach it (spoke) → so it gains a tool (chip). Spacing them ~0.7s apart lets
> the eye land on each in turn and read the dependency — you can't draw a spoke
> to a badge that isn't there yet, and the chip is the *consequence* of the
> spoke connecting, so it comes last. Firing them together would collapse three
> ideas into one flash. The spacing is wider than scene 4's 0.45s roll-call
> stagger on purpose: this is three *different* events building on each other,
> not one event repeated five times, so each gets more air.
>
> *"The badge springs in at the top-right, not the left edge like every other
> badge — why?"* This is the whole flip, drawn spatially. The five client
> badges live at the **left** because they call *in* to the entry's target
> handle; the data and control flow rightward into your chain. The partner lives
> at the **top-right**, off the Agent's *source* handle, because your agent
> calls *out* to it — the direction is reversed, so the geometry is reversed.
> The layout encodes the semantics: left = "calls me," top-right = "I call." A
> viewer who absorbed scenes 3–4 reads the new position as "this one's the other
> direction" before a word of narration.

### The chip grows, it doesn't pop — and why that needs `toolsWrapReveal`

The chip reveal does double duty. `chipReveal` feeds both the chip's own opacity
*and* `toolsWrapReveal` on the Agent's `SimBlock`:

```ts
mcpChip={{reveal: chipReveal, ring: chipRing}}
// inside the rig:
toolsWrapReveal={mcpChip ? (mcpChip.reveal ?? 0) : 1}
```

The `pricing_intel` chip is the third tool on the row (`Search`, `Docs`,
`pricing_intel`), and it wraps to a second line. `toolsWrapReveal` opens that
second line at its exact natural height *in sync with* the chip fading in, so
the block **grows to fit the new tool** rather than the chip popping into a line
that was already there.

> *"Why bother syncing the wrap-line height to the chip — why not just leave
> room for it from the start?"* Because leaving room from the start would mean
> the Agent block was *taller than its contents* in scenes 1–4, which is a lie:
> in those scenes the agent had two tools, so its Tools row was one line. The
> block's height must always equal what it actually holds. When the agent gains
> a tool, the block *gets taller* — that's the honest depiction of "a tool was
> added." Driving the wrap height off the chip reveal makes the growth a single
> smooth event: as the chip fades up, the line opens beneath it, and the block
> settles at its new natural height with no pop, no reflow, no frame where the
> chip floats in empty space. It's the same exact-natural-height discipline the
> entry morph uses to keep its height *constant* — here applied in reverse, to
> let height *change* truthfully.
>
> *"Why is the chip MCP purple with the MCP glyph, when Search and Docs are
> other colors?"* Because the chip's appearance is the product's own MCP-tool
> identity, not a choice. `pricing_intel` is another team's *deployed workflow*,
> surfaced inside your agent as an MCP tool — and the product renders MCP tools
> with `#6366F1` and the `McpIcon` (`tool-input.tsx`). So the chip looks exactly
> like what it is: not a built-in capability (Search/Docs), but a *remote agent
> wearing a tool's clothes*. The color is the tell that this tool lives on
> somebody else's server.

## Beat 2 — the run fires, with a deliberately long middle

```ts
const run = runBeats(t, 4.6, {midDur: 2.4, hold: 1.0});
```

One run, anchored at **4.6s**, editor-origin (no caller badge lights — the
`Octave Systems` input is typed by you, same as scene 1's baseline). The grammar
plays exactly as scene 1 taught it, with anchor `a = 4.6` and `midDur = 2.4`:

- `Octave Systems` dip-swaps into the entry's Input row over **4.6 → 4.95s**
  (`run.inputMix`), and the Messages `<start.input>` tag resolves to the same
  value over ~**5.65 → 6.05s** (`run.msgMix`) — the moment `pulse1` lands.
- `pulse1` rides edge 1 over **5.1 → 5.75s** (`run.pulse1`), into the Agent.
- the Agent's live ring (`run.midLive`) is on from **5.7s to 8.1s** — `a + 1.1`
  to `a + 1.1 + midDur`.
- `pulse2` rides edge 2 over **8.1 → 8.75s** (`run.pulse2`), into the Response.
- `"voice agents"` resolves into the Response Data template over **8.75 → 9.1s**
  (`run.respMix`).
- everything reverts together over **10.1 → 10.45s** (`respStart + 0.35 + hold`
  = `8.75 + 0.35 + 1.0` = `10.1`).

> *"Why `midDur: 2.4` — why stretch the live window to 2.4s when scene 1's
> default middle is a fraction of that?"* Because in this scene **the agent's
> work *is* the outbound call.** In scene 1, the live window was the agent
> thinking and calling its local Search tool — a quick beat. Here, the live
> window has to contain an entire *round trip to another server*: the chip
> rings, a pulse leaves on the partner spoke, travels out, the remote agent runs,
> the pulse comes back. That's a sequence of five sub-beats (below), and they
> need room to read as cause-and-effect rather than a blur. 2.4s is sized to fit
> the whole out-and-back with air on each side. The middle is long *because the
> tool call is long* — the duration is honest about what's happening inside it.
>
> *"Why an editor run and not a caller badge driving it?"* Because the point of
> *this* scene is your agent as a *caller of others*, and the cleanest way to
> isolate that is to have the run originate from you (the builder) so the only
> "calling out" in frame is the one to the partner. If a client badge had also
> lit, the frame would carry two call directions at once — inbound *and*
> outbound — which is precisely scene 6's job (the bookend), not this one's.
> Keeping the origin in the editor lets the outbound leg be the sole new event.
> One idea per scene.

## Beat 3 — the three-surface sync (the tool call out and back)

This is the scene's signature move and the mirror of scene 3's caller round
trip. *Inside* the Agent's long live window, the outbound call fires as one
event seen on three surfaces at once:

```ts
const chipRing    = Math.min(c(t, 5.9, 6.15), c(t, 7.7, 7.95, 1, 0));  // chip ring up then down
const outPulse    = c(t, 6.1, 6.8);                                     // pulse rides spoke OUT
const backPulse   = c(t, 7.0, 7.7);                                     // pulse rides spoke BACK
const partnerBlue = Math.min(c(t, 6.0, 6.3), c(t, 7.0, 7.3, 1, 0));     // partner: call in flight
const partnerGreen= Math.min(c(t, 7.65, 7.9), c(t, 8.4, 8.9, 1, 0));    // partner: reply landed
```

```tsx
<PathPulse d={pp.d} len={pp.len} p={outPulse} />
<PathPulse d={pp.d} len={pp.len} p={backPulse} reverse />
```

Read it in time order. The chip rings up over **5.9 → 6.15s** — *0.2s after the
live ring started at 5.7* — and the partner badge goes blue over **6.0 → 6.3s**.
The outbound pulse departs over **6.1 → 6.8s**, riding the partner spoke from
the Agent's source handle up to the top-right. Then the return pulse rides the
*same path in reverse* over **7.0 → 7.7s**. As it arrives home, the chip ring
*releases* over **7.7 → 7.95s** — and the partner badge flashes green over
**7.65 → 7.9s**, decaying over **8.4 → 8.9s**.

> *"What is the 'three-surface sync,' exactly?"* It's one event — "your agent
> called the partner tool and got a result" — drawn simultaneously on three
> different surfaces: the **chip** on the Tools row (rings while the call is in
> flight), the **wire** (a pulse out then back), and the **remote server** (blue
> while the call is out, green when its reply lands). All three are tied to the
> same moment by construction: the chip rings as the pulse leaves, the chip
> releases as the pulse gets home, the partner goes green as the reply settles.
> A viewer reads them as one fact seen from three angles, not three separate
> animations. This is the exact same discipline scene 1 used to nest the Search
> chip ring *inside* the live window — except here the nested tool call also
> travels a wire to a remote server and comes back.
>
> *"Why does the chip ring up at 5.9, 0.2s after live starts at 5.7 — not at the
> same instant?"* Same cause-then-effect lead scene 1 used: the agent goes live
> first (it started working), *then* it reaches for a tool. A 0.2s gap lets the
> eye register "the agent is running" before "and it's calling out." Firing the
> live ring and the chip ring on the same frame would read as one undifferentiated
> flash and lose the nesting that says "the call happens *during* the work."
>
> *"Why does the chip ring release exactly when the return pulse gets home
> (7.7)?"* Because the chip ring *means* "this tool call is in flight." It must
> be on for precisely the interval the call is outstanding — from when the
> outbound pulse leaves (chip up at 5.9, pulse out at 6.1) to when the reply
> arrives (back pulse ends 7.7, chip down at 7.7). Releasing the ring at any
> other moment would desync the chip from the wire and break the claim that
> they're one event. The chip ring's lifetime *is* the call's lifetime.
>
> *"Why is the return pulse a `reverse` `PathPulse` on the identical path rather
> than a second wire?"* Because in MCP the result returns to the *caller* over
> the same connection — there is no separate "reply channel." Drawing the reply
> on the exact same geometry, just played end→start (`reverse` flips the
> dash-offset math so the streak travels target→source), is the product truth:
> one connection, used both ways. This is the precise mirror of scene 3, where
> the *caller's* reply rode its spoke *back* to the badge. Same move, opposite
> direction — which is, again, the whole symmetry argument drawn in light.
>
> *"Why blue then green on the partner, with that gap?"* Same product grammar as
> the client badges: blue while a call is outstanding, green when its reply has
> landed. The partner goes blue **6.0 → 6.3** (the call is out), holds, then the
> blue is released and green flashes **7.65 → 7.9** as the reply settles,
> decaying a second later. It's the literal inverse of a client badge: a client
> badge goes blue when *it* calls *you*; the partner badge goes blue when *you*
> call *it*. The state vocabulary is identical because the protocol is identical
> — only the arrow's direction differs.
>
> *"Why does the outbound pulse start at 6.1 and the return at 7.0 — a ~0.2s gap
> at the top before it turns around?"* The out leg runs 6.1→6.8; the back leg
> runs 7.0→7.7. The small gap (6.8→7.0) is the *remote work* — the moment the
> partner's own agent is running, somewhere else, before it answers. It's tiny
> because we don't show the remote chain (it's someone else's workspace, off
> our canvas), but the beat of stillness at the far end of the spoke says "and
> now it's their turn" without drawing their machinery.

## The partner spoke — why it's a hand-rolled path, not a straight wire

The caller spokes in scenes 3–4 are simple smooth-step edges (`simEdgeD`). The
partner spoke is a custom path built in `partnerPath()`:

```ts
// out of the Agent's source handle, a short hop right into the
// agent↔response channel, UP, then right into the partner badge:
const d = `M ${x1} ${y1} L ${xm - r} ${y1} Q ${xm} ${y1} ${xm} ${y1 - r}
           L ${xm} ${y2 + r} Q ${xm} ${y2} ${xm + r} ${y2} L ${x2} ${y2}`;
```

It leaves the Agent's source handle (the same point edge 2 leaves from), hops
right to the center of the agent↔response channel, turns *up* the channel, then
turns *right* into the partner badge — a rounded-elbow L, in the same visual
language as the product's edges.

> *"Why route it up through the channel between the Agent and the Response
> instead of drawing a straight diagonal to the top-right?"* Two reasons. First,
> a straight diagonal would cross over the Response block and its edge — visual
> collision, and it would imply the call comes *from* the response, which is
> false (it comes from the agent, mid-run). Routing up the existing
> agent↔response channel keeps the spoke in the empty corridor that's already
> there, crossing nothing. Second, the rounded-elbow language *matches the
> product's own edges* — Sim draws connectors as smooth-stepped right-angle
> paths, not diagonals, so a diagonal here would read as "not a Sim wire." The
> hand-rolled path buys a clean route *and* keeps the connector in the product's
> grammar. The `len` is computed exactly (segment lengths minus the corner radii
> plus the arc lengths) so the `PathPulse` dash math travels the true path
> length and the streak neither overshoots nor stalls at the corners.

## Beat 4 — the chain finishes and reverts; the world un-dims

After the return pulse lands and the partner goes green, the run completes
normally: `pulse2` crosses edge 2 into the Response (**8.1 → 8.75s**), `"voice
agents"` resolves into the Data template (**8.75 → 9.1s**), and everything
reverts together over **10.1 → 10.45s** — the Input row, the Messages tag, and
the Response value all dip back to their templates as one. Then the dim releases
over **10.6 → 11.3s**, brightening the badges, entry, pill, and wires back to
full.

> *"Why does the world un-dim *after* the rows revert, not during?"* Because the
> un-dim is the scene's closing statement — "the new tool now permanently
> belongs to this agent, and the ecosystem is whole again" — and it should land
> on a *settled* frame, not on top of a value still dipping. Reverting the rows
> first returns the chain to its neutral template; *then* the lights come back
> up on the full, settled ecosystem. Overlapping the un-dim with the revert
> would stack two changes and muddy both. Sequence, don't stack — the same rule
> every beat in this video follows.
>
> *"Why do the chip, partner badge, and spoke stay after the run, while the run
> values revert?"* This is the **residue** rule, identical to scenes 3–4: the
> *values* of a run are transient (they belong to that one call and revert), but
> the *structure* the scene added is permanent (the world only grows). The agent
> *gained* a tool — that's a lasting change to what it can do, so the chip,
> the partner it points at, and the spoke connecting them all persist to the
> end. Scene 6 opens with exactly this residue at full reveal. If the chip
> reverted with the values, you'd be saying the tool was borrowed for one call,
> which is false — it's installed.

## The values, and where they all trace to

Every value on screen comes from `grounding-v1.md` — nothing is invented in the
scene file:

| surface | value | source |
|---|---|---|
| entry Input (resolved) | `Octave Systems` | grounding: scene-5 editor run input |
| Agent Messages tag | `<start.input>` → `Octave Systems` | `ResolvedTag` on `msgResolve` |
| Agent Model row | `claude-sonnet-4-6` | rig default (the Scout chain) |
| Agent tools | `Search`, `Docs`, **`pricing_intel`** | `CHIP_SEARCH`, `CHIP_DOCS`, `mcpChipDef` |
| partner server | `pricing_intel`, `#6366F1` + MCP glyph | grounding: partner tool; `tool-input.tsx` color |
| Response Data (resolved) | `<scout.content>` → `"voice agents"` | grounding: `Octave Systems → "voice agents"` |
| Response Status | `200` | rig default |
| tool pill (dimmed) | `research_competitor · sim.ai/api/mcp/serve/…` | grounding: your deployed identity |

> *"Why is the resolved input `Octave Systems` here when scene 4 also used
> `Octave Systems` for its Sim-client run?"* They're the same string by design,
> but read carefully — in scene 4 `Octave Systems` was driven *in* by the Sim
> client badge (an inbound call), and here it's typed by *you* in the editor (an
> outbound-demonstrating run). Reusing the input keeps the *resolved tag*
> machinery identical across the boundary while the *origin* differs, which is
> exactly the point being made: same run, different direction. The brief it
> resolves to — `"voice agents"` — is `Octave Systems`'s grounded brief from the
> corpus; it's the honest output of researching that (fictional) company.
>
> *"Why does the partner badge and the chip share the name `pricing_intel`?"*
> Because they're the same thing seen at two scales: the **chip** is how the
> partner's deployed workflow appears *inside your agent* (a tool on the Tools
> row), and the **badge** is that same workflow as it lives *on its own server*
> (top-right). One MCP tool, drawn both as the consumer sees it and as the
> supplier hosts it — which is the whole economy in one object.

## How to think about the whole scene

Walk the decisions in causal order and the scene is just the inbound story, run
backwards and drawn truthfully:

1. *How do I flip the focus from the callers to the agent?* Dim everyone except
   the Agent (0.35 on blocks, 0.55 on wires) → contrast, not camera.
2. *How do I show "your agent can now use their tool"?* A partner badge at the
   **top-right** (the reverse position) + a spoke out of the Agent's *source*
   handle + a `pricing_intel` chip that **grows** the block → the geometry
   encodes the reversed direction; the block gets taller because it honestly
   gained a tool.
3. *How does the tool call read as the same protocol?* Quote `runBeats`
   verbatim, with a long middle → it's the same run, recognizably.
4. *How do I draw "it called out and got a result back"?* A three-surface sync —
   chip ring ↔ pulse out-and-back on the partner spoke ↔ partner blue-then-green
   → one event, three faces, in the product's own state language.
5. *What persists, what reverts?* Values revert (transient); chip, badge, spoke
   stay (residue — the world only grows).
6. *How does it end?* Rows revert, *then* the world un-dims on the settled,
   complete ecosystem → a settled hold scene 6 can inherit and stretch.

Every one of those is a mirror of a choice an earlier scene already made — the
dim-flip from scene 2, the badge+spoke from scene 3, the run grammar from scene
1, the residue from scenes 3–4. The scene's quality is that it *reuses* all of
them pointed the other way, so the flip lands as "oh, it's the same thing
backwards" rather than as a new trick. That recognition is what makes the loop
close, and the closed loop is what makes it an economy.

## Exit state (what scene 6 inherits)

`all five client badges + spokes present (un-dimmed) · partner badge
`pricing_intel` present top-right (reveal 1) · partner spoke drawn · the
`pricing_intel` chip on the Agent's Tools row at reveal 1 (block at its taller
natural height) · tool pill on, un-dimmed · rows reverted to template · world
fully un-dimmed · no camera transform`.

Scene 6 opens on exactly this frame — the **full ecosystem**: five callers left,
the chain center, the partner top-right, the pill above the entry — and only
then begins the video's single camera move (the 7% pull-back) before firing the
bookend run that carries *both* directions at once. Because both scenes render
the same `<EconomyRig/>` and scene 6 simply inherits the partner, chip, and
spoke at full reveal, that boundary is identical down to the pixel.
