# Scene 3 — `what-it-really-did`  ·  archetype: **record-panel + two-surface synchrony**

Source: `../../../../projects/sim-explainers/src/videos/module-7-logs/scenes/V2WhatItReallyDidScene.tsx`,
`scenes/_v2.tsx` (`triageTree` with `toolCallsHi`/`callHi`/`tokensHi`,
`TicketChain` with `chipRings`), `src/components/OutputBundle.tsx`.

Scene 2 landed the record and showed Triage's tree. This scene goes *into* the
tree: it opens the `toolCalls` array and walks the three real calls, lighting
the matching tool chip on the block above as each call highlights. Read it as
the worked example of **two-surface synchrony** — saying "this entry in the
record corresponds to that thing on the block" with zero connector lines and
zero words, purely by lighting two places at the same instant.

---

## What this scene is for

One idea: **the record kept everything the block actually did.** From outside,
the run looked instant — Triage was a single block that blinked. The record
remembers it made three tool calls, in order, each with its own timing. The
scene's job is to make that concrete: open the `toolCalls` array and show the
calls *as the record's data*, tied back to the agent's real tools.

Resist the urge to also trace provenance here (that's scene 4) or to re-explain
the tree (scene 2 did). One idea: *the array is the receipt of what the block
did, and it ties back to the block's tools.*

## What it looks like

The panel is exactly where scene 2 left it; Triage's tree is up. The `toolCalls`
array's **key** blends to blue and stays focal for the whole middle of the
scene. Then its three child rows highlight in turn — `[0] customerLookup
375ms · 1 account`, `[1] knowledge_search 457ms · 0 results`, `[2]
knowledge_search 540ms · 0 results` — and **at the same moment each one lights**,
the matching tool chip on the dimmed Triage block above rings: CRM rings with
customerLookup, Docs rings with each knowledge_search. Triage itself leans out
of the dim while its chips are active. At the end, the `tokens` node's key gets
a closing beat of blue glow. Everything reverts before the cut.

## The one real decision: synchrony, not connectors

The temptation, when you want to say "this log entry ↔ that tool," is to draw a
line between them. **Don't.** This scene says it by timing alone:

```ts
const call0 = window(2.0, 4.2); // customerLookup ↔ CRM
const call1 = window(4.6, 6.8); // knowledge_search ↔ Docs
const call2 = window(7.2, 9.4); // knowledge_search ↔ Docs (iteration 2)
// ...
<TicketChain ... chipRings={{crm: call0, docs: Math.max(call1, call2)}} />
<OutputBundle ... values={triageTree({ toolCallsHi, callHi: [call0, call1, call2], tokensHi })} />
```

The *same* `call0` value drives both the highlight on the `customerLookup` row
(in the panel, below) and the ring on the CRM chip (on the block, above). One
number, two surfaces, lit in the same frame. The viewer's eye connects them
because they pulse together — correspondence by synchrony, the way you'd point at
two things at once with two hands.

> *"Why is no-connector-line the right call?"* Two reasons. First, a line
> between the panel and the block would cross the dimmed chain and the empty
> space between the two surfaces — it's visual clutter that has to be drawn,
> animated, and routed, and it reads as scaffolding. Second, synchrony is *more*
> precise: a line says "these are related"; a simultaneous pulse says "this one,
> right now, is that one." When you have two views of the same fact, light both
> on the same frame and let the eye do the binding.

> *"Why `Math.max(call1, call2)` for the Docs chip?"* Both knowledge_search calls
> map to the same Docs tool, so the Docs chip should be ringing during *either*
> call. `max` keeps it lit across both windows without double-counting. The chip
> rings twice (once per call) because the calls are sequenced with a gap between
> their windows.

## The array stays focal the whole time

```ts
const toolCallsHi = window(0.8, 10.0);   // the array key is blue for ~9s
```

Before any individual call lights, the `toolCalls` array's *key* goes blue and
holds for almost the entire scene. This is the "one focal element per moment"
rule operating at the tree level: the array is the subject, so its key stays lit
while its children take turns being the sub-focus. When the scene moves on to
`tokens` at the end, the array releases.

> *"What's `window`?"* A trapezoid: ramp up over the first 0.4s, hold, ramp down
> over the last 0.4s (`interpolate(t, [lo, lo+0.4, hi-0.4, hi], [0,1,1,0])`).
> It's the scene's entire timing vocabulary — every highlight is one `window`.
> A highlight that comes up, holds, and releases is a *gesture*; a highlight that
> snaps on and off is a flicker. The 0.4s ramps are what make each one read as
> deliberate.

## The three calls, in real order, with real timings

The three child rows are the actual tool calls from the run, in the order they
happened, each carrying its real duration and result:

| row | value | chip |
|---|---|---|
| `[0] customerLookup` | `375ms · 1 account` | CRM |
| `[1] knowledge_search` | `457ms · 0 results` | Docs |
| `[2] knowledge_search` | `540ms · 0 results` | Docs |

These come straight from `triageTree`'s `toolCalls` children in `_v2.tsx` — every
value real, from the run artifact. The two `0 results` knowledge searches are not
trimmed away for looking like failures; they're what actually happened, and a
record that hid them would be teaching the opposite of "the record kept
everything." (This is also the honest seed of the debugging story: two empty
searches is exactly the kind of thing you'd want a log to remember.)

> *"Why walk the calls left-of-meaning to right, 2.0→4.2, 4.6→6.8, 7.2→9.4?"*
> The windows are spaced with a ~0.4s gap between them so exactly one call is the
> sub-focus at a time and the chip rings read as distinct events. The cadence
> (~2.2s per call) is slow enough to register each call+chip pair as a sentence.

## Triage leans out of the dim while its chips ring

```ts
const callActive = Math.max(call0, call1, call2);
const triageDim  = 1 - 0.7 * callActive;     // dims back to 0.35 between calls
```

The Triage block sits at 0.35 dim (inherited from scene 2) but lifts toward full
opacity whenever any call is active, then settles back between calls. This is the
visual handshake: the block "wakes up" precisely when the record is pointing at
something it did. It's the same number (`callActive`) driving the lift, so the
block can never be bright when no chip is ringing.

> *"Why lift the whole block, not just the chip?"* Because the chip is small and
> the block is the thing the viewer's eye is parked near. Lifting the block out of
> the dim draws attention *to where the ring will be*, then the ring lands. The
> block is the stage, the chip is the actor.

## The closing beat: it also counted the work

```ts
const tokensHi = window(9.8, 11.5);
```

After the array releases, the `tokens` node's key glows blue for a beat. It's a
coda, not a new section: having shown *what* the block called, the record also
shows *how much work* it was (`5074` in, `431` out). One short highlight, then
the scene is done. No chip rings here — tokens don't correspond to a block
surface, so there's nothing above to sync with; it's a panel-only glow.

## How to think about the whole scene

1. *What's the subject?* The `toolCalls` array → its key holds blue the whole
   scene.
2. *How do I show the calls are real events?* Highlight each child in turn, in
   real order, with real timing.
3. *How do I tie a log entry to the block's tool without a line?* Light the
   matching chip on the same frame → two-surface synchrony.
4. *How do I keep the block from competing when nothing points at it?* Drive its
   dim from the same `callActive` number → it's only bright when relevant.
5. *What's the closing thought?* The record also counted the work → one beat of
   `tokens` glow.

## Exit state (what scene 4 inherits)

`identical to scene 2's exit` — all highlights (`toolCallsHi`, `callHi`,
`tokensHi`, `chipRings`) ramp back to 0 before the cut, Triage's dim returns to
0.35, Output tab emphasis, full tree, Triage row selected. The two scenes share
the same set piece and the same resting state, so scene 4 opens on this exact
frame and begins the backward trace (jumping selection to LogTicket, swinging the
tab to Input) without any geometry change. Continuity is free.
