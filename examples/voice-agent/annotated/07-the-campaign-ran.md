# Scene 7 — `the-campaign-ran`  ·  archetype: **settle / bookend (the quiet retell)**

Source: `../source/scenes/TheCampaignRanScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/states.ts` (`S7_THE_CAMPAIGN_RAN`), `../source/layout.ts`
(`CAM_HOME`, `CAM_OUT`), `../source/transcript-data.ts`.

This is the bookend — the settled frame that retells the run without re-running
it. The campaign is over: the chain rests, the three panels sit quiet with their ✓
stamps, the table is full. The scene's one gesture is a *quiet retell* — each
table row takes a single sequential pulse, 1→3, recapping "three calls, three
outcomes" with zero new run energy. Read it as the worked example for "how do I
close a video — settle, recap without repeating, and end on a still that means
something."

---

## What this scene is for

The video ran once. Scene 6 landed the three outcomes and settled the chain. This
scene's job is to *let it land* and *retell it* — to hold the completed state long
enough for the viewer to absorb "that was one run that made three phone calls and
recorded three outcomes," and to gently re-walk the three results so the recap is
felt, not just stated. The macro arc declared **run count: 1** — there is no
second run, no recap run. The retell is done with *highlight pulses on the existing
rows*, not by re-firing anything.

The *one idea* is "one run, three real phone calls, three recorded outcomes." It's
a hold-dominated bookend: a tiny camera ease-back, three sequential row pulses, and
then a long, intentional stillness.

## What it looks like

The settled frame from scene 6: the clean chain at rest (fan retracted, rings off),
three quiet call panels each showing its full transcript and green ✓ stamp, the
outcomes `SimTable` full with three rows. The camera eases back ~3% — a small final
pull-out. Then each table row, in turn, takes one quiet highlight pulse (1→3,
sequential), like a finger running down the recorded results. After the third pulse
fades, nothing moves: the dots are solid green, the waveforms flat, the frame still.

## The settled inheritance — this scene barely animates

The scene spreads `S7_THE_CAMPAIGN_RAN` — the full settled preset — and changes
almost nothing:

```tsx
<Stage
  frame={gf}
  state={{
    ...S7_THE_CAMPAIGN_RAN,   // fan 0, all panels ended+stamped, table full (rows 1,1,1)
    cam: camMix(CAM_HOME, CAM_OUT, camP),
    rowPulse,                 // the only real addition
    quiet: q,
  }}
/>
```

`S7_THE_CAMPAIGN_RAN` already carries the entire end state: `fan: 0`, all three
panels `{ended: true, outcomeReveal: 1, turnCount: 3}`, `tableReveal: 1`,
`rowReveal: [1, 1, 1]`. The scene inherits a finished world. The only things it
*does* are ease the camera back and run the row pulses.

> *"Why is the camera move from `CAM_HOME`, not from `CAM_OUT` where scene 6 left
> off?"* Scene 6 ended at `CAM_HOME` (s 0.8). Scene 7 enters at `CAM_HOME` and eases
> to `CAM_OUT` (s 0.775) — so its frame-0 *is* `CAM_HOME`, matching scene 6's exit
> exactly. The ease-back happens *within* scene 7, starting from the inherited home
> framing. That's why `camMix(CAM_HOME, CAM_OUT, camP)` with `camP` starting at 0:
> frame 0 is pure `CAM_HOME`, and it drifts out from there.

## The camera — the ~3% ease-back

```ts
camP = c(0.4, 2.0, 0, 1, EASING.inOut)
cam  = camMix(CAM_HOME, CAM_OUT, camP)   // s 0.8 → 0.775
```

The camera eases from `CAM_HOME` (s 0.8) to `CAM_OUT` (s 0.775) over **0.4→2.0** —
a ~3% pull-back, barely perceptible.

> *"Why such a tiny camera move — 3% is almost nothing?"* Because a bookend wants a
> *whisper* of a pull-back, not a real move. The slight retreat reads as "stepping
> back to take in the whole finished thing" — the visual equivalent of exhaling at
> the end. A bigger move would feel like a new event; 3% is just enough that the
> frame settles outward, signaling closure, without drawing attention to itself.
> It's the same ~3–6% ease-back every bookend in this series uses (browser-agent's
> scene 7, market-desk's outro) — the house punctuation for "the end."
>
> *"Why `EASING.inOut`?"* It's a camera move — the canonical `inOut` case. Eases
> out of home, settles into the final framing.

## The quiet retell — sequential row pulses

```ts
pulseAt(a) = Math.min(c(a, a+0.3), c(a+0.7, a+1.2, 1, 0))   // up 0.3s, hold, down 0.5s
rowPulse   = [pulseAt(2.4), pulseAt(3.8), pulseAt(5.2)]
```

Each row gets one highlight pulse — an up-hold-down (up over 0.3s, down over 0.5s)
— and they fire **sequentially at 1.4s spacing**: row 1 at **2.4**, row 2 at
**3.8**, row 3 at **5.2**. `rowPulse` is fed to the `SimTable`'s `cellHighlight`
(via `cellHighlight={(_, ri) => rowPulse[landedIdx[ri]]}`), which draws the
product's own row-selection treatment — one row lighting up, then releasing, then
the next.

> *"Why retell with row pulses instead of re-running the workflow?"* Because the
> video already made its point with one run; re-running it would be redundant motion
> and would muddy the "it's *one* run" thesis. The recap energy comes from
> *re-touching the results*, not re-doing the work. A pulse running down the three
> recorded rows says "look — three outcomes, recorded" by pointing at the receipts,
> which is exactly the close the script wants: the run retold *as its record*. This
> is the build's "quiet retell" move — recap with zero re-run.
>
> *"Why 1.4s spacing — and why sequential, not all three at once?"* Sequential
> because the retell is a *walk* down the results — row 1, then 2, then 3, the way
> you'd run your finger down a list confirming each entry. Pulsing all three at once
> would say "here are the results" as one flat statement; pulsing them in turn says
> "this one, and this one, and this one" — three confirmations, matching the three
> calls. 1.4s is slow and calm, the right pace for a closing recap (faster would
> feel anxious, like the run energy from scene 6 hadn't dissipated). Each pulse
> (0.3s up + ~0.4s hold + 0.5s down ≈ 1.2s) fits inside its 1.4s slot, so they don't
> overlap — one row lit at a time, clean.
>
> *"Why does the up-ramp (0.3s) differ from the down-ramp (0.5s)?"* The same
> up-fast/down-slow signature as every one-shot highlight in the build — a quick
> rise grabs the eye, a slower release lets it linger and feel deliberate. It reads
> as a considered touch, not a flicker.

The retell finishes by **6.4s** (row 3's pulse, fired at 5.2, fully down by ~6.4).

## The values, and where they come from

Nothing new on screen — the scene shows the settled state of everything already
established: the three panels with their authored transcripts and config-label ✓
stamps (`LANES[i].outcome`), the full `SimTable` with `TABLE_ROWS_DATA` (to /
outcome / status = completed). The retell pulses don't introduce content; they
re-light existing rows. This is correct for a bookend — a recap shows you what you
already saw, it doesn't add.

## The animation, beat by beat

`mkClock` gives `t`/`c`; `sceneClock` gives `gf` and `q`.

1. **0.4–2.0 — the ease-back.** Camera `CAM_HOME → CAM_OUT` (~3%, `inOut`).
2. **2.4–~3.6 — row 1 pulses.** Up 2.4→2.7, hold, down 3.1→3.6.
3. **3.8–~5.0 — row 2 pulses.** Same shape, offset 1.4s.
4. **5.2–~6.4 — row 3 pulses.** Same shape, offset 1.4s.
5. **6.4–~11.3 — the still hold.** ~4.9 seconds of intentional stillness: dots
   solid green (`ended` kills the pulse — they no longer oscillate), waveforms flat,
   chain at rest, table full. The quiet gate handles the boundary, but there's
   nothing oscillating to settle — the frame is genuinely still.

> *"Isn't a ~5-second still hold dead air, especially as the *last* thing the
> viewer sees?"* No — and this is the one place in the video where the stillness is
> the *meaning*. Every other hold was *alive* (latched rings, shimmering waveforms,
> pulsing dots) because the run was in flight. Here the run is *over*, so the frame
> is genuinely still, and that stillness *is* the message: the campaign is done,
> the work is recorded, there's nothing left running. An alive hold here would lie —
> it would imply the run is still going. The dots being solid green (not pulsing),
> the waveforms flat, the chain dark — these are the picture of "finished." At under
> 5 seconds post-payoff, it reads as the breath the bookend template asks for: a
> moment to let the completed thing sit before the video ends. The VO ("that was one
> run — three phone calls, three conversations, and every outcome recorded") plays
> over this still, and the scene was stretched to 11.3s to fit it; the extra length
> is absorbed entirely by this stillness, which is trivially safe to stretch because
> nothing is moving.
>
> *"Why do the dots stop pulsing here when they pulsed the whole rest of the
> video?"* In `_rig.tsx`, `livePulse = p.ended ? 0 : 0.5 + 0.5·sin(...)` — once a
> panel is `ended`, its live dot drops to a fixed solid green with no oscillation.
> All three panels are `ended` in `S7`, so all three dots are solid. This is
> product-honest: a live dot pulses while the call is *in progress*; a finished call
> shows a steady "done" indicator. The cessation of pulsing is itself information —
> the calls are over.

## How to think about the whole scene

1. *How do I close?* Settle, retell, end on a meaningful still → the bookend shape.
2. *What's already true at the open?* Everything — inherit the full `S7` settled
   preset; the scene barely animates.
3. *How do I recap without repeating?* Sequential row pulses (1.4s spacing) on the
   existing rows → the quiet retell, recap energy with zero re-run.
4. *How do I punctuate the end?* A ~3% camera ease-back → the house "the end"
   whisper.
5. *How do I end on a still that isn't dead?* Let the stillness *mean* "finished" —
   solid (not pulsing) dots, flat waveforms, a run that's genuinely over → stillness
   as the message, not the absence of one.

## Exit state (the end of the video)

`camera at CAM_OUT (s 0.775) · chain clean and at rest (fan 0, no rings) · three
panels quiet, each with its full transcript and solid-green ✓ stamp, dots solid
(not pulsing), waveforms flat · outcomes SimTable full (three rows, status =
completed) · all retell pulses released by 6.4s · a still, settled frame`.

There's no scene 8 to inherit this — it's the last frame of the video. But the
continuity discipline still applies inward: this scene's enter state had to equal
scene 6's exit (which it does, via the shared `S7` preset and the fan/ring settle
completing inside scene 6), so the cut *into* the bookend was identical down to the
pixel. The video ends where it should — on the campaign's recorded result, held
still long enough to land.
