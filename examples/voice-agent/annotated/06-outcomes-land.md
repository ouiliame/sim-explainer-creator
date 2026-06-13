# Scene 6 — `outcomes-land`  ·  archetype: **accumulation (two surfaces, one event ×4)**

Source: `../source/scenes/OutcomesLandScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx` (`OutcomeStamp`), `../source/scenes/states.ts`
(`S6_OUTCOMES_LAND` — note the special Phase-A treatment), `../source/layout.ts`,
`../source/transcript-data.ts` (`TABLE_ROWS_DATA`).

This is the payoff scene — where every call becomes a row you can act on. The
three conversations resolve in turn, and each resolution is drawn as **four
surfaces firing as one event**: the panel stamps, the lane pulses, the Log-outcome
block blips, and a row drops into the real `SimTable`. Read it as the worked
example for "how do I show an accumulation honestly — a run writing records — and
how do I synchronize the maximum number of surfaces on a single event without it
reading as chaos."

---

## What this scene is for

The arc has shown the capability (workflow), the run, the calls connecting, the
mechanism (one conversation), and the money shot (all three at once). The one
thing left is the *consequence*: each call **ends**, and when it does, an outcome
is recorded. This scene resolves the three calls staggered (1→2→3), and each
resolution lands an outcome on two-going-on-four surfaces at once, accumulating
three rows into the table. Then, after the last row lands, the **run settles**:
rings release, wires cool, and the fan retracts back to the single lane —
completed *before* the cut so scene 7 enters on the clean settled chain.

The *one idea* is "every call ends as a row you can act on." It's the most
machinery-dense scene in the video, because resolution is a chain of synchronized
events and you have to draw every link — three times.

## A note on this scene's Phase-A frame

Every other scene's `states.ts` preset is its *settled end-state*, and Phase B
animates *toward* it. This scene is the declared exception. `S6_OUTCOMES_LAND` is
the **mid-state** — the money still: call 1 resolved (row 1 landed), call 2
stamping (row 2 landing), call 3 still live. That preset was the Phase-A static
frame used to compose the scene. But the scene's *true exit* is not its preset —
it's scene 7's *enter* state (all three resolved, fan retracted). So scene 6's
Phase B animates from its **enter** state (all live, 0 rows, inherited from `S5`)
to its **exit** (3 rows, all ✓, settled), and ignores its own preset's mid-state
as an end-point. The script declares this explicitly. It's worth understanding:
the preset here was a *composition aid* (the prettiest mid-frame to design
against), not the boundary contract. The boundary contract is scene 7's enter
state, and Phase B re-verifies every boundary pair against it.

## The resolution grammar — four surfaces, one event

This is the scene's signature, the equation it repeats three times. When a call
resolves, **one event** ("this call ended with this outcome") is drawn on four
surfaces simultaneously:

1. **The panel** — its waveform flatlines, its live dot goes solid green
   (`ended`), and a green ✓ **outcome stamp** lands over the waveform footer
   (`OutcomeStamp`, scale 0.86→1 pop, the config-template label).
2. **The lane** — a pulse crosses the Call→Log-outcome edge (`pulseLane`).
3. **The Log-outcome block** — it blips (a selection ring, `log: {highlighted}`).
4. **The table** — a row drops into the `SimTable` (`rowReveal[i]`).

> *"Four surfaces for one event — isn't that exactly the 'busy' you keep warning
> against?"* No, because they're all saying the *same thing* at the *same instant*,
> which the eye reads as one event, not four. The danger is four *different* events
> stacked in one moment; this is one event *echoed* across four surfaces, which is
> the opposite — it's reinforcement, not clutter. And it's *true*: in the real
> product, a call resolving really does cause the Log-outcome block to run (the
> blip + lane pulse) which really does insert a row (the table) — the panel stamp
> is the conversation-side view of the same event. The four surfaces are four
> *honest views* of one run event: the conversation ended (panel), control reached
> the logger (lane pulse), the logger ran (block blip), a row was written (table).
> Drawing fewer would be drawing *less truth*.
>
> *"How tightly are the four synchronized?"* Within ~0.2s of each other. For call 1:
> the lane pulse fires `c(1.2,1.8)`, the Log blip is the window `[1.7,2.3)`, the
> stamp reveals `c(1.7,2.4)`, the row drops `c(1.8,2.5)`. Stamp and row land **0.1s
> apart** — deliberately near-simultaneous so they read as one landing, with just
> enough offset that the lane pulse (the control reaching the logger) visibly
> *precedes* the row (the write), preserving cause→effect.

## The values, and where they come from

| Element | On screen | Source |
|---|---|---|
| Call 1 outcome stamp | ✓ "confirmed" | `LANES[0].outcome` (config-template label) |
| Call 2 outcome stamp | ✓ "rescheduled" | `LANES[1].outcome` |
| Call 3 outcome stamp | ✓ "confirmed" | `LANES[2].outcome` |
| Table row 1 | `+1 415 ··· 4288 \| confirmed \| completed` | `TABLE_ROWS_DATA[0]` |
| Table row 2 | `+1 628 ··· 1924 \| rescheduled \| completed` | `TABLE_ROWS_DATA[1]` |
| Table row 3 | `+1 917 ··· 7706 \| confirmed \| completed` | `TABLE_ROWS_DATA[2]` |
| Call 2 confirmation line | "No problem — I've moved you to Thursday at 11. You're confirmed." | `LANES[1].agentLines[1]` |
| Call 3 confirmation line | "Perfect — confirmed for 3 PM. Thanks, and have a good day." | `LANES[2].agentLines[1]` |

**The truth contract at its sharpest here.** Note the split in the table's columns:
the `outcome` column shows **config-template labels** (`confirmed` / `rescheduled`
— the words the builder configured), but the `status` column shows **`completed`** —
the registry's own enum value from `agentphone.ts` (`status`: completed /
in-progress / failed). So the table is honest about provenance: `outcome` is what
you *configured* the call to report; `status` is the system's *own* word for "this
call finished." Neither invents a run value. The destinations (`to`) are the same
masked stand-ins from the panels. This is `TABLE_ROWS_DATA`, derived directly from
`LANES`, so the panel and the table can never disagree — two surfaces, one data
source.

> *"Why does the table only ever contain the rows that have landed?"* In `_rig.tsx`,
> `landedRows` filters `TABLE_ROWS_DATA` to only rows where `rowReveal[ri] > 0.01` —
> so the `SimTable` literally *grows* a row at a time as `Insert Row` runs. A table
> cannot show a row the run hasn't inserted yet (the same honesty rule as the empty
> columns in market-desk and the empty table in scene 3). The grid has 1 row after
> call 1 resolves, 2 after call 2, 3 after call 3 — never three blank rows waiting
> to fill in. The rows don't *exist* until they're written.

## The animation, beat by beat

`mkClock` gives `t`/`c`; `sceneClock` gives `gf` (global clock) and `q` (quiet
gate). The three resolutions are spaced **~3.3s apart**.

### Call 1 resolves (~1.5–2.5s)

```ts
sp0    = 1 - c(0.8, 1.5, 0, 1, EASING.inOut)   // flatline
ended0 = t >= 1.6                               // dot goes solid green
out0   = c(1.7, 2.4, 0, 1, EASING.out)          // ✓ stamp pops in
row0   = c(1.8, 2.5, 0, 1, EASING.out)          // row 1 drops into the table
pl1    = c(1.2, 1.8, 0, 1, EASING.inOut)        // lane pulse
logBlip: t ∈ [1.7, 2.3)                          // Log block blips
```

Panel 1 (which entered talking at amplitude 1) flatlines over **0.8→1.5**; the dot
latches solid green at **1.6**; the lane pulse crosses **1.2→1.8**; the Log block
blips **1.7→2.3**; the stamp pops **1.7→2.4**; row 1 drops **1.8→2.5**. The four
surfaces fire within 0.2s of each other.

> *"Why does the flatline (ending 1.5) precede everything else?"* Because the call
> *ending* is what triggers the resolution. The waveform goes flat (the
> conversation stopped), and *that* is the cause of the outcome being recorded. So
> the flatline leads, then the dot turns green (the call is marked done), then the
> logger fires and the row lands. The order is the causality: conversation ends →
> outcome computed → record written.

### Call 2 — speaks first, then resolves (~2.6–5.9s)

```ts
count1 = t < 2.6 ? 2 : 3
turn3b = t < 2.6 ? 1 : c(2.6, 3.4, 0, 1, EASING.out)   // confirmation line reveals
sp1    = c(2.3, 2.9, 0, 1, EASING.inOut) - c(4.3, 4.9, 0, 1, EASING.inOut)  // talks, then flatlines
ended1 = t >= 5.0
out1   = c(5.1, 5.8); row1 = c(5.2, 5.9)
pl2    = c(4.6, 5.2); logBlip: t ∈ [5.1, 5.7)
```

Call 2 *entered listening* (from `S5`, waveform 0, human bars up). So it has to
**speak its confirmation first** before it can resolve: at **2.6** turn 3 (the
"rescheduled to Thursday" line) reveals (2.6→3.4) as the waveform springs up
(2.3→2.9), then flatlines (4.3→4.9), *then* resolves — ended 5.0, stamp 5.1→5.8,
row 5.2→5.9, with its own four-surface sync (lane pulse 4.6→5.2, Log blip
5.1→5.7).

> *"Why does call 2 speak before resolving while call 1 just resolved?"* Because
> they entered in different states. Call 1 entered *talking* (it was mid-sentence),
> so it just finishes and resolves. Call 2 entered *listening* (it had heard the
> reply and not yet responded), so honesty requires it to *give its answer* before
> the call can end — you can't resolve a call the agent hasn't responded on. This
> is the de-phasing from scene 5 paying off: because the three panels were left at
> different points in their loops, their resolutions naturally take different shapes,
> which keeps the three landings from feeling like one repeated animation. The
> de-phasing that was the *spectacle* in scene 5 becomes the *variety* in scene 6.

### Call 3 — talks, lands its line, resolves last (~5.6–9.1s)

```ts
count2 = t < 5.6 ? 2 : 3
turn3c = t < 5.6 ? 1 : c(5.6, 6.4, 0, 1, EASING.out)   // confirmation line
sp2    = 0.9 - c(7.5, 8.1, 0, 0.9, EASING.inOut)        // 0.9 → flatline
ended2 = t >= 8.2
out2   = c(8.3, 9.0); row2 = c(8.4, 9.1)
pl3    = c(7.8, 8.4); logBlip: t ∈ [8.3, 8.9)
```

Call 3 entered talking at 0.9 (from `S5`). Its line lands (5.6→6.4), it keeps
talking, then flatlines (7.5→8.1) and resolves last — ended 8.2, stamp 8.3→9.0,
row 8.4→9.1, four-surface sync (lane pulse 7.8→8.4, Log blip 8.3→8.9).

### The chained lane pulse — one wire, one pulse at a time

```ts
pulseLane = pl1 < 1 ? pl1 : pl2 < 1 ? pl2 : pl3
```

There's *one* lane edge, and three landings. This chain hands the lane to whichever
pulse is currently mid-flight: `pl1` until it completes, then `pl2`, then `pl3`.
The three pulse windows never overlap (1.2–1.8, 4.6–5.2, 7.8–8.4), so the single
lane carries exactly one pulse at a time.

> *"Why one lane and three landings — shouldn't each ghost lane pulse?"* Because
> the *real* lane is what runs the Log-outcome block; the ghosts are runtime
> instances of it. Conceptually each instance's Insert-Row fires, but they're
> drawn as one lane carrying three sequential pulses (the resolutions are
> staggered, never simultaneous), which is cleaner than three ghost lanes each
> pulsing — and it keeps the eye on the one real lane, the one that's actually
> connected to the table by timing. One lane, three pulses, three rows.

### The settle — rings release, wires cool, fan retracts

```ts
campaign: {highlighted: t < 9.7}    // campaign ring releases at 9.7
call:     {highlighted: t < 9.85}   // call ring releases at 9.85
container:{highlighted: t < 10.0}   // container ring releases at 10.0
wireCool = c(9.6, 10.4, 1, 0)        // edge heat fades
fan      = c(10.0, 11.4, 1, 0)       // ghosts retract into the single lane
```

After the last row lands (~9.1), the run settles: the three rings release
**staggered** (campaign 9.7, call 9.85, container 10.0), the wires cool over
**9.6→10.4**, and the fan retracts over **10.0→11.4** — the ghost pairs sliding
back behind the real lane, undoing scene 2's fan. **All of this completes before
the cut** (the scene ends ~12.3s), so scene 7 enters on a fully clean, settled
chain.

> *"Why stagger the ring releases instead of dropping them all at once?"* Because a
> run winds *down* the way it wound *up* — block by block. Snapping all three rings
> off on one frame would read as "someone hit stop"; releasing them ~0.15s apart
> (campaign → call → container) reads as the run *completing*, each block finishing
> its work in turn. The order even mirrors the run: the outer agent settles, then
> the call, then the container that held them.
>
> *"Why must the fan fully retract before the cut?"* Because scene 7 is the
> settled bookend — its enter state is the clean single lane, fan = 0. If the fan
> were still retracting at the cut, scene 7 would open mid-retraction and either
> jump or finish the motion itself, breaking the boundary. Completing the
> retraction by 11.4 (with ~0.9s of hold after) guarantees scene 7 inherits a
> static, finished chain. The settle is *inside* this scene, not split across the
> cut.

### The hold — ~11.4–12.3s

After the fan retracts at 11.4, ~0.9s of hold on the settled, three-rows-full
frame. Effectively no hold — the scene spends its whole length on the resolutions
and settle; the quiet gate dips it at the boundary.

## How to think about the whole scene

1. *What's the payoff?* Each call becomes a recorded row → resolve the three,
   staggered.
2. *How do I draw one resolution?* Four surfaces, one event — panel stamp, lane
   pulse, Log blip, table row, within 0.2s → reinforcement, not clutter.
3. *Why do the three resolutions look different?* Because the panels entered in
   different states (talking / listening / talking) — the scene-5 de-phasing
   becomes scene-6 variety.
4. *Why does the table grow a row at a time?* Because a table can't show a row the
   run hasn't inserted → honest accumulation.
5. *Why split `outcome` (config label) from `status: completed` (registry enum)?*
   Honest provenance — what you configured vs. the system's own word.
6. *How do I hand a clean frame to the bookend?* Settle inside the scene — release
   rings staggered, cool wires, retract the fan — all completed before the cut.

## Exit state (what scene 7 inherits)

`workflow settled and clean (all rings released, wires cool, fan retracted to the
single lane — fan = 0) · three call panels resolved: each waveform flat, dot solid
green, ✓ outcome stamp landed (confirmed / rescheduled / confirmed) · outcomes
SimTable full: three rows (to / outcome / status = completed) · camera at CAM_HOME
(s 0.8) · global clock continuous, quiet gate settled at the boundary`.

This equals scene 7's enter state (the `S7_THE_CAMPAIGN_RAN` preset: fan 0, all
three panels ended with outcomeReveal 1, rowReveal [1,1,1]). Scene 7 opens on
exactly this settled frame and does the quiet retell — one sequential pulse per
table row, the camera easing back ~3%. Because the fan retraction and ring
releases completed *inside* scene 6, this boundary is a clean static handoff,
identical down to the pixel.
