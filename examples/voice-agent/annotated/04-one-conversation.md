# Scene 4 — `one-conversation`  ·  archetype: **the mechanism (lean-in)**

Source: `../source/scenes/OneConversationScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx` (the turn loop, the waveform), `../source/scenes/states.ts`
(`S4_ONE_CONVERSATION`), `../source/layout.ts` (`CAM_PANEL1`),
`../source/transcript-data.ts`.

This is the *mechanistic example* scene — the one that picks a single call out of
the three and shows, up close, what "a live conversation" actually means: the
agent speaks, goes quiet while the person answers, and comes back to confirm.
Read it as the worked example for "how do I lean into one instance to teach the
mechanism, and how do I draw a turn-taking conversation honestly — voice and
listening as two surfaces showing one event."

---

## What this scene is for

Scene 3 made three calls alive but kept them all at arm's length — you saw the
*aliveness*, not the *mechanism*. The macro arc of this video is capability-first,
and the standard move after "here's the whole capability" is "here's one
mechanistic example, slowed down." That's this scene. It leans the camera toward
panel 1, dims everything else, and runs **the turn loop** on that one panel: agent
speaks → flatlines (listening) → the human reply rises as skeleton bars → the
waveform springs back for the agent's confirmation line.

The *one idea* is "it speaks, hears the answer, and responds — turn by turn, a
real conversation." It deliberately ignores the other two panels (they dim and
murmur in the background) and the table (off to the side, untouched). One call,
one mechanism, slowed to legibility.

## What it looks like

The camera leans toward panel 1 — pushing in and down-left so panel 1 fills the
lower-left, with the workflow band still visible above (dimmed). Panels 2 and 3
dim and quiet. On panel 1, the conversation advances: it's already mid-greeting
(carried from scene 3). The waveform **flatlines** — the agent stopped speaking.
A **human reply** rises in as a left-aligned skeleton-bar bubble — the person is
answering, but we never hear their words. Then the waveform **springs back up**
*under* a new agent bubble — the confirmation line ("Great — you're all set for 3
PM. We'll see you then.") rising in as the voice returns. The live dot keeps
pulsing throughout.

## The camera-plus-hierarchy move (read this — it's the scene's craft)

The lean isn't just a camera move; it's a camera move and a *hierarchy* move
firing on the same window. This is the key technique:

```ts
camP = c(0.5, 2.2, 0, 1, EASING.inOut)        // camera leans CAM_HOME → CAM_PANEL1
dim  = c(0.7, 1.9)                              // de-focus: workflow + panels 2-3
```

`camMix(CAM_HOME, CAM_PANEL1, camP)` pushes the camera from the home framing
(`s 0.8`, whole stage) to `CAM_PANEL1` (`px: panelX(0) + PANEL_W/2 + 210, py: 880,
s: 1.06`) — leaning toward panel 1 and pushing in to 1.06×. At the *same time*,
`dim` ramps the de-focus: the workflow band's opacity drops (`1 - 0.62*workflowDim`
→ 38% at full dim) and panels 2 and 3 dim (`1 - 0.55*(p.dim)` → 45%).

> *"Why move the camera and the dimming on the same window?"* Because they're one
> gesture: "focus on panel 1." A camera that pushes in *without* dimming the rest
> would still show three equally-bright panels and a bright workflow, fighting the
> focal panel for attention. Dimming *without* a camera move would flatten the
> hierarchy but not give panel 1 the room it needs to be read up close. Doing both
> on the same `inOut` window means the world *recedes* (dims) exactly as the lens
> *approaches* (pushes in) — the eye is pulled to panel 1 by two reinforcing
> cues at once. This is the build's "camera-plus-hierarchy" move, and it's the
> cleanest way to say "look here now" without a single highlight box.
>
> *"Why does the dim start at 0.7, a hair after the camera at 0.5?"* So the move
> *initiates* with the lens (the camera commits first, 0.5) and the world dims
> *into* that commitment (0.7). They finish close together (2.2 vs 1.9). Starting
> the dim slightly later means the viewer reads "we're moving toward panel 1, and
> as we do, everything else falls back" rather than "everything dimmed and then we
> moved" — cause (the lean) leading effect (the recede).
>
> *"Why `CAM_PANEL1.py = 880` and `+210` on px?"* The panel band sits low on the
> stage (`PANEL_Y = 645`, panel center ~965). Framing `py = 880` puts the camera's
> center high in the panel so the panel's header and transcript fill the frame
> rather than its empty footer. The `+210` on px nudges the center rightward off
> panel 1's own center so the workflow edge stays visible above — you're leaning
> *toward* panel 1, not burying everything else off-frame, because the scene still
> wants to remind you the workflow is the thing producing this call.

## The turn loop — the mechanism drawn honestly

The conversation on panel 1 is the scene's content, and it's drawn as a strict
alternation of two surfaces:

```ts
sp0    = 1 - c(3.0, 3.7, 0, 1, EASING.inOut) + c(7.0, 7.8, 0, 1, EASING.inOut)
turn2  = c(4.2, 5.0, 0, 1, EASING.out)    // human reply rises
turn3  = c(7.4, 8.2, 0, 1, EASING.out)    // agent confirmation rises
count0 = t < 4.2 ? 1 : t < 7.4 ? 2 : 3     // how many turns are shown
rev0   = t < 4.2 ? 1 : t < 7.4 ? turn2 : turn3   // reveal of the newest turn
```

Read `sp0` (the panel-1 waveform amplitude) carefully — it's the heart of the
scene. It starts at **1** (carried in from scene 3, mid-greeting), then *subtracts*
a ramp over **3.0→3.7** (falling to 0 — the **flatline**, the agent going quiet),
then *adds* a ramp over **7.0→7.8** (rising back to 1 — the **voice returning**).
So the waveform's life is: speaking (1) → flatlines by 3.7 → silent → springs back
by 7.8.

The turns advance in lockstep with that:

- **Turn 1** (the greeting) is already present (carried, `count0 = 1` until 4.2).
- At **t = 4.2**, `count0` steps to 2 and the **human reply** (turn 2, a skeleton-
  bar bubble) reveals over **4.2→5.0** (`turn2`). This happens *while the waveform
  is flat* (it flatlined at 3.7) — the listening picture.
- At **t = 7.4**, `count0` steps to 3 and the **agent confirmation** (turn 3, the
  authored line) reveals over **7.4→8.2** (`turn3`), *as the waveform springs back*
  (the 7.0→7.8 ramp in `sp0`) — the voice returning under the new bubble.

> *"Why is the flatline-then-human-bars the 'listening' picture — why two surfaces
> for one moment?"* Because "the agent is listening to the person" is one event,
> and it's drawn on two surfaces simultaneously: the **waveform going flat** (the
> agent's voice stopped) *and* the **human bars rising** (the person is now
> speaking). Neither alone says it. The flat waveform alone could mean "nothing is
> happening"; the human bars alone could appear while the agent is still talking.
> Together — voice off, reply rising — they unambiguously say "the agent stopped
> and is hearing the answer." This is the two-surfaces-one-event discipline
> (browser-agent's chip-ring-equals-card-birth, market-desk's synchrony) applied
> to a conversation turn.
>
> *"Why does the human reply have no words?"* The truth contract. The person's
> actual reply is *run output* — what a real human said on a real call — and run
> output is never invented. So the reply is skeleton bars whose widths
> (`["62%", "40%"]` from `LANES[0].humanReplies[0]`) are the *shape* of a reply.
> You read "the person said something about this long" with zero fabricated words.
> The agent's lines, by contrast, *do* carry text — because they're authored
> config (the greeting and confirmation the builder wrote), not a transcript.
>
> *"Why does the voice spring back exactly under the confirmation bubble (both at
> ~7.0–8.2)?"* Same two-surfaces logic, reversed: "the agent responds" is the
> waveform rising (voice on) *and* the confirmation bubble landing (the words).
> Springing the waveform back *as* the bubble reveals says "the agent is speaking
> again, and here's what it's saying." Land the bubble without the waveform and
> the agent would appear to respond mutely; spring the waveform without the bubble
> and it'd speak with no content. The two are timed together (7.0/7.4 starts) so
> they read as one "the agent responded."
>
> *"Why the ~3-second gap between the flatline (3.7) and the voice return (7.0)?"*
> Because that gap *is the listening*. The human reply reveals over 4.2–5.0 inside
> that silence, and then there's a beat of the agent "processing" before it comes
> back. Snapping the agent's response onto the heels of the human reply would read
> as a canned bot; a real conversation has a beat of silence after the person
> speaks. The 3-second flat stretch is the scene letting the listening *land*.

### The background panels — `sp1`, `sp2`

```ts
sp1 = 0.85 - c(0.9, 2.0, 0, 0.85, EASING.inOut)   // panel 2: 0.85 → 0 (goes silent)
sp2 = 0.7  - c(0.9, 2.0, 0, 0.1,  EASING.inOut)   // panel 3: 0.7 → 0.6 (murmurs on)
```

As the lean commits (0.9→2.0, riding the same window as the dim), panel 2's
waveform settles to **0** (it goes quiet) and panel 3's to **0.6** (still
murmuring, just lower). Both are also dimmed to 45%.

> *"Why does panel 2 go fully silent but panel 3 keeps murmuring at 0.6?"* So the
> background isn't *dead*. If both dimmed panels flatlined, the frame would read as
> "two calls ended" — which is wrong, they're still live. Leaving panel 3 murmuring
> at 0.6 behind the dim keeps the world alive: the focus is panel 1, but the other
> calls are still going, just quieter and out of focus. It's the difference
> between "the camera focused on one of three live calls" and "two calls stopped so
> we could look at the third." The first is true; the second is a lie. Panel 2
> going to 0 and panel 3 to 0.6 (rather than both to the same value) also keeps them
> *de-phased* even while dimmed — quieter, not uniform.

## The values, and where they come from

| Element | On screen | Source |
|---|---|---|
| Panel 1 greeting (turn 1) | "Hi, this is Acme calling to confirm your appointment for tomorrow." | `LANES[0].agentLines[0]` (authored config, registry greeting) |
| Panel 1 human reply (turn 2) | skeleton bars `62% / 40%` | `LANES[0].humanReplies[0]` (shape only, no words) |
| Panel 1 confirmation (turn 3) | "Great — you're all set for 3 PM. We'll see you then." | `LANES[0].agentLines[1]` (authored config) |
| Live dot | red, pulsing | "call in progress" (de-phased on the global clock) |
| Panels 2-3 | dimmed, panel 3 murmuring | de-focus per the lean |

All conversation content is from `transcript-data.ts`. Note the confirmation line
is *specific* to lane 0 ("3 PM") — each of the three lanes has its own authored
second line (lane 1 reschedules to Thursday, lane 2 confirms 3 PM), so the three
conversations read as genuinely different even though they share the greeting.

## The animation, beat by beat

`mkClock` gives `t`/`c`; `sceneClock` gives `gf` (the global clock, keeping the
waveforms continuous from scene 3) and `q` (the quiet gate).

1. **0.5–2.2 — the lean.** Camera eases `CAM_HOME → CAM_PANEL1` (`inOut`),
   pushing in to 1.06× toward panel 1.
2. **0.7–1.9 — the de-focus.** Workflow dims to 38%, panels 2–3 dim to 45%;
   panel 2's waveform settles to 0, panel 3's to 0.6 (0.9–2.0).
3. **carried — speaking the greeting.** Panel 1's waveform enters at amplitude 1
   (from `S3`), greeting bubble already present.
4. **3.0–3.7 — the flatline.** `sp0` subtracts to 0: the agent goes quiet.
5. **4.2–5.0 — the human reply rises.** Turn 2 (skeleton bars) reveals while the
   waveform is flat — the listening picture, two surfaces.
6. **7.0–7.8 — the voice returns.** `sp0` adds back to 1.
7. **7.4–8.2 — the confirmation lands.** Turn 3 (the authored line) reveals *as*
   the waveform springs back — the response, two surfaces.
8. **8.2–~13.8 — the hold.** Leaned into panel 1: its waveform shimmers at full
   amplitude on the global clock, its dot pulses, panel 3 murmurs at 0.6 behind
   the dim. The quiet gate dips it at the boundary (reads as the conversation
   pausing).

> *"Why is the hold ~5.6s here, longer than scene 1's?"* Because this hold is on a
> *live* state (panel 1 still talking, dot pulsing, panel 3 murmuring) — a live
> hold is tense, not dead, so it carries narration comfortably. And the scene was
> VO-stretched to 13.8s from the 12s minimum; the extra length is absorbed by this
> live hold, which is safe to stretch because every value has settled to the `S4`
> preset and the only motion is the global-clock shimmer (which the quiet gate
> handles at the boundary).

## How to think about the whole scene

1. *How do I teach the mechanism?* Lean into one instance and slow it down → the
   standard "one mechanistic example" move.
2. *How do I focus without a highlight box?* Camera push + de-focus dim on the
   same window → camera-plus-hierarchy, the world recedes as the lens approaches.
3. *How do I draw "the agent is listening"?* Waveform flatlines *and* human bars
   rise — two surfaces, one event.
4. *How do I draw "the agent responds"?* Waveform springs back *under* the
   authored confirmation bubble — two surfaces, one event.
5. *What words are allowed?* Agent lines = authored config (text); human reply =
   skeleton bars (shape only).
6. *How do I keep the background honest?* Panel 3 murmurs at 0.6 behind the dim —
   the other calls are still live, just out of focus, not stopped.

## Exit state (what scene 5 inherits)

`camera leaned into panel 1 (CAM_PANEL1, s 1.06) · workflow dimmed to 38% · panel
1 showing all 3 turns (greeting, human reply, confirmation), waveform at amplitude
1, dot pulsing · panel 2 dimmed, silent (speaking 0) · panel 3 dimmed, murmuring
(speaking 0.6) · the outcomes SimTable present, still empty · global clock
continuous, quiet gate settled at the boundary`.

This is the `S4_ONE_CONVERSATION` preset. Scene 5 (`three-at-once`) spreads
`...S3_CALLS_CONNECT` as its base but *enters* on this `S4` frame — it pulls the
camera back from `CAM_PANEL1` to `CAM_HOME` and releases the dims (`undim`), so
scene 5's frame-0 must equal this `S4` exit. The cut is identical down to the
pixel; what changes after it is the camera pulling out and the world un-dimming as
all three panels come up to full.
