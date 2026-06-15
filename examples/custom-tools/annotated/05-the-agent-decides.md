# Scene 5 — `the-agent-decides`  ·  archetype: **settle / bookend**

Source: `../source/scenes/TheAgentDecidesScene.tsx`, `../source/scenes/_local.tsx`
(`CHIP_WEATHER`), `../source/layout.ts`, and the module-5 `TriageChain` +
`WirePulse`.

This is the close, and it's the deliberate mirror of scene 1. Scene 1 ran the
chain with three chips and rang the CRM one to prove "a custom tool already lives
in your world." Scene 5 runs the *same chain with four chips* and rings the CRM
one again — but now the new Weather chip sits quiet. That contrast is the final
lesson: **relevance is the model's call.** Read it as the worked example of a
bookend that earns its closure by changing exactly one variable.

---

## What this scene is for

Two facts have to land at the end. First: the model decides *when* your tool is
relevant — same as every built-in; you don't wire a custom tool into the chain
like a block, the agent reaches for it (or doesn't) per message. Second, the
reassuring deflation: after all of that, it's *still just a workflow* — the same
three blocks and two wires, settling green. The scene delivers both by running the
chain one last time and letting it come to rest.

One idea per scene: this is "the model picks the tool the message needs, and the
whole thing is still a workflow." It is a *settle* — the energy of the piece
discharges into a calm, balanced, resolved final frame.

## What it looks like

Continuing from scene 4's four-chip chain: a pulse travels the first wire, Triage
goes live, and **the CRM chip rings** briefly — the new Weather chip stays quiet.
A second pulse travels; the blocks settle to green "ok" state in causal order
(Start → Triage → Slack). The camera eases back ~7%, opening up the frame. Hold
on the balanced, green-settled board to the end of the video.

## The bookend: change exactly one variable

The power of a bookend is that it's *almost* the same shot as the open, so the
viewer's attention is drawn to the single thing that's different. Lay scene 1 and
scene 5 side by side:

| | Scene 1 (open) | Scene 5 (close) |
|---|---|---|
| Chain | Triage, 3 chips | Triage, **4 chips** |
| Run | one pass, input resolves | one pass, settles green |
| CRM chip | **rings** (the call) | **rings** (the call) |
| Weather chip | not present | present, **quiet** |
| Camera | identity | eases back ~7% |

The only meaningful new variable is *the fourth chip exists, and it stays quiet
while CRM rings.* Everything else is held constant precisely so that contrast is
the thing you see.

> *"Why is keeping everything else the same the whole point?"* Because the lesson
> is about *selectivity* — the agent reaching for one tool and not another. You
> can only show selectivity by presenting multiple available tools and having the
> agent pick. The new Weather chip *has* to be present-but-quiet for "the model
> chose CRM, not Weather" to be a visible event. If scene 5 changed the run, the
> input, or the layout too, the quiet chip would get lost in the noise. A bookend
> teaches by minimal difference: hold everything, move one thing, point at the
> move. The discipline is restraint — resist the urge to make the finale bigger.

## The decisive beat: CRM rings, Weather stays quiet

Same ring mechanism as scene 1, scoped inside the live window:

```ts
const agentLive = t >= 1.7 && t < 3.0;            // Triage live window
const crmRing = interpolate(t, [1.9, 2.2, 2.7, 3.0], [0,1,1,0], { clamp both });
// ...
tools: [CHIP_DOCS, {...CHIP_CRM, ring: crmRing}, CHIP_SEARCH_V3, CHIP_WEATHER]
//                  ^^^ CRM gets a ring                          ^^^ Weather has none
```

CRM gets a `ring` driven inside the 1.7→3.0 live window; Weather is passed with
no `ring` at all (so it renders flat). The contrast is built into the props: one
chip carries a ring value, one doesn't.

> *"Why does this prove 'relevance is the model's call'?"* Because the message
> being handled is the billing complaint from the real artifact, and the tool the
> billing complaint needs is CRM (`customerLookup`) — not weather. The agent
> rings the relevant chip and ignores the irrelevant one, *with no logic shown on
> screen deciding it.* The absence of a ring on Weather is the visual for "the
> model judged this one irrelevant to this message." Scene 1 taught the audience
> that a ring means "the agent chose this tool"; scene 5 cashes that in by showing
> a chip the agent *didn't* choose, sitting right next to one it did. The lesson
> is delivered entirely by which chip rings — no caption, no arrow, no decision
> diagram. This is the chip-ring vocabulary paying its full dividend.
>
> *"Why ring CRM again rather than make Weather the one that fires?"* Because
> Weather firing would require a weather-shaped message, which would mean changing
> the input — breaking the bookend's "change one variable" discipline and
> abandoning the real artifact. Ringing the *same* chip as scene 1, on the *same*
> input, with the new chip present-and-quiet, is the tighter teaching: the world
> is identical, you just added a tool, and the agent's behavior on this message is
> unchanged because this message never needed your tool. That's a more honest and
> more reassuring close than manufacturing a reason to fire the new one.

## The settle: green state in causal order

The blocks resolve to success state by time-gated booleans, in order:

```ts
const startDone = t >= 1.0;
const agentLive = t >= 1.7 && t < 3.0;
const agentDone = t >= 3.0;
const respDone  = t >= 3.8;
// start.state = startDone?'ok':'none'; mid.state = agentDone?'ok':'none'; response.state = respDone?'ok':'none'
```

`state: "ok"` paints the block's success ring green (`#22c55e` in `SimBlock`,
the same state language used across the series). They turn green in causal order
(1.0 → 3.0 → 3.8) so the success reads as *flowing through the chain*, not
snapping on at once.

> *"Why settle to green at all — why not just stop the run?"* Because green is
> the product's own 'this ran successfully' state, and the video's last fact is
> "it's still just a workflow." A workflow that ran cleanly ends green. Letting
> the success propagate Start→Triage→Slack is the visual sentence "the whole
> thing worked, end to end" — the calm landing the piece resolves into.

## The camera ease-back

```ts
const ease = interpolate(t, [3.2, 5.4], [0,1], { ease inOut });
const s = 1 - 0.07 * ease;          // zoom out 7%
const tx = CENTER_X * (1 - s);      // keep the zoom centered
const ty = CENTER_Y * (1 - s);
// applied as transform: translate(tx,ty) scale(s) about origin 0 0
```

The whole board scales down 7% about its center as the run finishes.

> *"Why pull back at the end?"* It's the breath that signals "done." Through the
> video the framing was tight on the editor and the block; easing back opens the
> frame to show the *whole* balanced workflow at rest — the "still just a
> workflow" beat made visual. The 7% is small and centered (the `tx/ty` math keeps
> the center fixed) so it reads as settling, not as a new camera move. It starts
> at 3.2s, after the run's work is essentially done, so the pull-back accompanies
> the resolution rather than competing with it. A settle scene earns a gentle
> outward camera; an action scene would not.

## The animation, beat by beat

1. **1.0s** — Start resolves (green).
2. **1.0 → 1.7s** — pulse travels wire 1 (ease inOut).
3. **1.7 → 3.0s** — Triage live; **CRM rings** (1.9→3.0), Weather quiet.
4. **3.0s** — Triage resolves green.
5. **3.0 → 3.7s** — pulse travels wire 2.
6. **3.2 → 5.4s** — camera eases back 7%.
7. **3.8s** — Slack response resolves green; chain fully settled.
8. **tail** — hold the balanced, green, four-chip frame to video end (stretches to
   VO ≈ 12.5s).

## How to think about the whole scene

1. *How do I close?* Bookend scene 1 → run the same chain, hold everything,
   change one variable.
2. *What's the one variable?* A fourth chip that stays quiet while CRM rings →
   relevance is the model's call, shown by which chip rings.
3. *How do I land "still just a workflow"?* Settle green in causal order, ease the
   camera back 7% → the energy discharges into a calm, whole, resolved frame.
4. *Why ring the same chip as the open?* The input is the same real artifact;
   honesty + the tightest possible contrast.

## Exit state

`Four-chip Triage chain, fully settled green · CRM ring released · Weather quiet ·
camera eased back 7% · balanced hold`. This is the final frame of the video. The
piece opened on this chain and closes on it — the same world, now carrying a tool
you watched get built, with the agent reaching for exactly what the message needs.
