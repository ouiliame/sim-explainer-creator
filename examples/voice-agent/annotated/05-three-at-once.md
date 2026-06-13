# Scene 5 — `three-at-once`  ·  archetype: **the money shot (de-phased streams)**

Source: `../source/scenes/ThreeAtOnceScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx`, `../source/scenes/states.ts` (`S5_THREE_AT_ONCE`),
`../source/layout.ts` (`CAM_PANEL1`, `CAM_HOME`), `../source/transcript-data.ts`.

This is **the money shot** — the video's thesis frame, the one image the whole
build exists to produce: all three conversations running *at once*, each on its
own pace, three live phone calls shimmering out of sync, while the workflow above
is still just *one run*. Read it as the worked example for "how do I make a
spectacle frame that's actually alive — three independent streams, de-phased — and
how do I prove the spectacle is still honest (it's one run, not three workflows)."

---

## What this scene is for

The macro arc went: capability (the workflow), the run firing and fanning, the
calls connecting, then *one* conversation up close (the mechanism). Now it pulls
back and shows the payoff: **the whole campaign talking at once.** Three live
conversations, each at a different point in its turn loop — one talking, one
listening, one wrapping up — all simultaneous, all de-phased. The thesis line the
scene carries is "this is *still a single run* of the workflow above" — the rings
are still lit, the table still waits, one workflow drove all three.

The *one idea* is "the whole campaign is talking at once — and it's one run." It's
a *hold*-dominated scene: a brief pull-back and un-dim, then a long alive hold
where three independent conversation clocks run in parallel and the global clock
keeps the whole band breathing.

## What it looks like

The camera pulls back from the panel-1 lean to the home framing, and the dims
release — all three panels come up to full brightness. Then the three of them run
their turn loops *independently and out of phase*: panel 1 keeps talking, takes a
breath mid-scene, talks again; panel 2's human reply rises and the agent answers,
then it listens again; panel 3 flatlines, its human reply rises, the agent comes
back on. Three live dots pulse de-phased; three waveforms shimmer at different
amplitudes and seeds; the workflow's rings stay on above; the empty table waits at
the right. No two panels ever change state in the same second.

## The pull-back — `camera + undim on the same window`

```ts
camP  = c(0.4, 2.2, 0, 1, EASING.inOut)   // camera CAM_PANEL1 → CAM_HOME
undim = c(0.5, 1.7, 1, 0)                  // de-focus releases (1 → 0)
```

The inverse of scene 4's lean. `camMix(CAM_PANEL1, CAM_HOME, camP)` pulls the
camera from the panel-1 lean back to home over **0.4→2.2**, and `undim` releases
the de-focus from 1 to 0 over **0.5→1.7** — riding the pull-back, the same
camera-plus-hierarchy move running in reverse. As the camera retreats, the
workflow comes back to full brightness and panels 2–3 un-dim, so all three panels
are equal and bright by the time the camera settles at home.

> *"Why does `undim` finish (1.7) before the camera does (2.2)?"* Because you want
> the panels at full brightness *before* the camera fully settles, so the money
> frame is already established as the camera arrives at it. If the un-dim lagged
> the camera, you'd reach the home framing with the panels still dimming up — the
> thesis frame would assemble *after* you got there. Finishing the un-dim early
> means the camera lands on a frame that's *already* the money shot.
>
> *"Why `c(0.5, 1.7, 1, 0)` — passing 1→0 — instead of easing? It's linear here."*
> Note `undim` has no easing argument: it's a plain linear release, and it's used
> as a *multiplier* (`workflowDim: undim`, `dim: undim`). The camera carries the
> eased feel of the move; the dim just needs to get out of the way proportionally.
> Easing both would double the curve. The pattern: ease the *primary* gesture (the
> camera), let the *coupled* values ride linearly under it.

## The three de-phased conversation clocks (copy these numbers)

This is the scene's craft: three panels, each running an *independent* turn loop,
deliberately offset so no two change in the same second. Here is each, verbatim,
with what it draws:

**Panel 1 — keeps talking, breathes, talks again:**
```ts
sp0 = 1 - c(4.5, 5.3, 0, 1, EASING.inOut) + c(7.5, 8.3, 0, 1, EASING.inOut)   // ends at 1
turnCount: 3  (all turns already present from S4)
```
Starts speaking (1, carried from S4), flatlines over **4.5→5.3** (a breath), springs
back over **7.5→8.3**. Ends at amplitude 1 — still talking.

**Panel 2 — human reply rises, agent answers, listens again:**
```ts
count1 = t < 3.0 ? 1 : 2
rev1   = t < 3.0 ? 1 : c(3.0, 3.8, 0, 1, EASING.out)    // human reply reveals
sp1    = c(5.5, 6.3, 0, 0.9, EASING.inOut) - c(9.0, 9.8, 0, 0.9, EASING.inOut)  // ends 0
```
At **3.0** turn 2 (the human reply) starts revealing (3.0→3.8); the agent answers,
waveform rising to 0.9 over **5.5→6.3**; then it listens again, the waveform
falling back over **9.0→9.8**. Ends at amplitude 0 — listening (S5 leaves it
mid-listen, human bars up).

**Panel 3 — listening, human reply rises, agent comes back:**
```ts
count2 = t < 4.6 ? 1 : 2
rev2   = t < 4.6 ? 1 : c(4.6, 5.4, 0, 1, EASING.out)
sp2    = 0.6 - c(3.8, 4.5, 0, 0.6, EASING.inOut) + c(7.0, 7.8, 0, 0.9, EASING.inOut)  // ends 0.9
```
Starts murmuring at 0.6 (carried from S4), flatlines over **3.8→4.5**; at **4.6**
its human reply rises (4.6→5.4); the agent comes back on over **7.0→7.8** to 0.9.
Ends at amplitude 0.9 — talking.

Lay the events on a timeline and the de-phasing is the whole point:

| ~t | panel 1 | panel 2 | panel 3 |
|---|---|---|---|
| 3.0 | talking | human reply rises | murmuring |
| 3.8–4.5 | talking | (reply revealed) | flatlines |
| 4.6 | talking | listening | human reply rises |
| 4.5–5.3 | **flatlines** | listening | (reply revealed) |
| 5.5–6.3 | silent | **agent answers** | silent |
| 7.0–7.8 | silent | talking | **agent comes back** |
| 7.5–8.3 | **springs back** | talking | talking |
| 9.0–9.8 | talking | **listens again** | talking |

Every state change lands on its *own* beat. No two panels flatline, reveal, or
spring back in the same second.

> *"Why go to all this trouble to stagger three turn loops — wouldn't three copies
> of one loop be simpler and read the same?"* It would be simpler and read
> completely wrong. Three *synchronized* waveforms — all flatlining together, all
> springing back together — would instantly read as one animation stamped three
> times, a screensaver, not three live calls. The de-phasing *is* the spectacle:
> the frame feels alive precisely because at any instant one panel is talking,
> another listening, a third wrapping up, the way three real simultaneous calls
> would be. The viewer can't predict the next change because the three clocks are
> independent — that unpredictability is what sells "these are three different
> conversations." It's the same reason the waveform *shapes* are de-phased by
> `seed` and the dots by `i·2.1`: every layer of the band is offset from every
> other.
>
> *"Why do the panels end at amplitudes 1 / 0 / 0.9?"* Because those are the exact
> values the `S5_THREE_AT_ONCE` preset declares, and scene 6 inherits them. Panel 1
> ends talking (1), panel 2 ends listening (0, human bars up), panel 3 ends talking
> (0.9). Scene 6 then resolves the calls in order 1→2→3, and it needs each panel to
> *enter* at a known state — so scene 5 must *settle* each waveform to its preset
> value before the cut. The de-phasing is free-running in the middle but lands on
> fixed marks at the boundary; that's what makes the cut into the resolution scene
> carry exactly.

## The thesis claim — it's still one run

The workflow band stays *fully visible and live* this whole scene — Campaign,
container, and Call rings still lit (carried from `S3`/`S5`), the camera framed so
the chain is in frame above the panels. That's not incidental; it's the scene's
argument.

> *"Why keep the workflow on screen during the money shot — wouldn't the panels
> alone be cleaner?"* Because the thesis isn't "three phone calls are happening" —
> it's "*one workflow run* is making three phone calls happen." Drop the workflow
> and you've shown three calls with no visible cause; the viewer might think you
> wired up three workflows. Keeping the lit chain above the three live panels makes
> the claim visible: one run (one set of rings) → three conversations (three
> panels). The empty table waiting at the right completes the sentence: one run,
> three calls, and a record still to be filled. The whole frame is the thesis.

## The values, and where they come from

All conversation content is `transcript-data.ts` (`LANES`), same as scene 4 — each
panel's greeting, human-reply shape, and confirmation line. Nothing new is
introduced; this scene re-uses the three lanes' authored content and just runs them
at different phases. The waveform de-phasing comes from the per-panel `seed`
(1/2/3) and the global clock `gf`; the dot de-phasing from `i·2.1`.

## The animation, beat by beat

1. **0.4–2.2 — pull back.** Camera `CAM_PANEL1 → CAM_HOME` (`inOut`).
2. **0.5–1.7 — un-dim.** Workflow and panels 2–3 release to full brightness
   (linear, riding the camera).
3. **3.0–9.8 — the three de-phased clocks** (see the table above). Each panel's
   turn loop runs on its own schedule; no two changes coincide.
4. **9.8–~16.2 — the alive hold.** Three shimmering waveforms at amplitudes
   1 / 0 / 0.9, three pulsing dots, the workflow's rings on above, the empty table
   waiting. ~6.4 seconds of the video's thesis frame, kept breathing by the global
   clock; the quiet gate settles it for the cut.

> *"How does a 6.4-second hold survive on a money shot?"* Same mechanism as scene
> 3's long hold, doing its most important work here. The global clock keeps all
> three waveforms and dots continuously shimmering — the frame is never static even
> though no *turn* is changing. Nothing is focal (that's correct — you're meant to
> take in the whole alive band, not track one event), and the de-phased shimmer
> carries the narration ("all three conversations are running at once... this is
> still a single run") across its full length. The scene was VO-stretched to 16.2s
> from the 14s minimum; the extra 2.2s is absorbed entirely by this hold, which is
> safe to stretch because every value has settled to the `S5` preset by 9.8 and the
> only remaining motion is the gated global-clock shimmer.

## How to think about the whole scene

1. *How do I get from the lean to the money shot?* Reverse the scene-4 move —
   pull back, un-dim on the same window → camera-plus-hierarchy in reverse.
2. *How do I make three live calls read as three, not one loop?* Three independent
   turn clocks, de-phased so no two change in the same second → the de-phasing is
   the spectacle.
3. *How do I make the cut into the resolution scene carry?* Settle each waveform to
   its `S5` preset amplitude (1 / 0 / 0.9) before the boundary → free-running in
   the middle, fixed marks at the edge.
4. *How do I prove it's honest?* Keep the lit workflow and the empty table in frame
   above/beside the panels → one run, three calls, a record still to fill.
5. *How does a 6s thesis hold carry?* Global clock keeps the band breathing; quiet
   gate settles the boundary → alive, not static.

## Exit state (what scene 6 inherits)

`camera at CAM_HOME (s 0.8), full frame · workflow live and bright (rings held,
fan = 1) · panel 1: 3 turns shown, waveform at 1 (talking) · panel 2: 2 turns
shown (human reply revealed), waveform at 0 (listening) · panel 3: 2 turns shown
(human reply revealed), waveform at 0.9 (talking) · three live dots pulsing
de-phased · outcomes SimTable present, still empty (0 rows) · global clock
continuous, quiet gate settled at the boundary`.

This is the `S5_THREE_AT_ONCE` preset. Scene 6 (`outcomes-land`) enters on exactly
this all-live, zero-rows frame and animates the resolution: each call ends in turn,
takes a green stamp, and drops a row into the table. Because scene 6's frame-0 state
equals this exit — three panels at amplitudes 1/0/0.9 with their exact turn counts,
the empty table — and both scenes render the same `<Stage/>`, the boundary is
identical down to the pixel. The money shot freezes for one frame and then begins to
resolve.
