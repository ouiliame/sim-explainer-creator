# Scene 5 — `creating-the-records`  ·  archetype: **run completes — the money shot**

Source: `../source/scenes/CreatingTheRecordsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`, `../source/scenes/_beats.ts`,
`../source/scenes/PhaseAStills.tsx` (the money-instant still).

This is the payoff of the followed run and the richest scene in the video. The
agent finishes investigating and *creates the records*: it posts the diagnosis to
Slack, opens a Linear ticket, pages the on-call via PagerDuty — three records
created — and in sync with those real records, the table's row 3 flips
`firing → triaged → assigned`. This is the "money shot": the moment that proves the
whole thesis (an on-call agent reads, then creates records, and the queue starts
clearing). Read it as the worked example for "how do I land a multi-consequence
payoff — one cause, three effects, plus a state change on a separate surface — so
it reads as one triumphant event rather than a busy mess."

---

## What this scene is for

Run 1 has read its signals (scene 4). Now it *acts* — but "acts" here means
**creates records**, never edits or fixes (the mandate's central honesty
constraint). Three terminals fire in sequence, each writing a record (a Slack
message, a Linear issue, a PagerDuty incident), each landing as a log row. And the
incidents table — a *separate* surface — flips row 3's status twice, synced to the
run's real records: `triaged` when the agent's diagnosis exists (Slack posts),
`assigned` when the page is created (PagerDuty). This is the scene where the
"status column is the job" promise from scene 1 first pays off, on one row.

So the rule is *one idea per scene*: "the agent creates three records, and the
incident is assigned." It's the completion of run 1. It does **not** start the
remaining five runs (scene 6) — it follows *one* alert all the way to `assigned`,
and then the cadence beat does the other five.

## What it looks like

The camera pulls back from the read-framing to the home framing (the payoff spans
the whole frame). The agent's blue live ring (carried from scene 4) settles to
green ok; `content` and `tokens` reveal in the record tree. Three lights leave the
agent's source handle *together* and travel the three fan edges. Then, in sequence
(Slack, Linear, PagerDuty), each terminal goes live blue → settles green ok, and
its log row lands in the record. Synced to those: row 3's status cell dips
`firing → triaged` (green tint flaring then decaying) when Slack lands, and dips
`triaged → assigned` when PagerDuty lands. The record fills to all five log rows.
At the end, the Messages tag reverts from its resolved value back to the
`<sentryalerts.message>` template — run 1 is over.

## The one set piece — every surface at once

This scene touches more props than any other, because the payoff spans the
workflow (agent + three terminals + fan), the table (row 3 flip), and the record
(content, tokens, three more log rows) simultaneously:

```tsx
<Stage
  cam={cam}
  webhook={{state: "ok"}}
  agent={{highlighted: agentLive, state: agentLive ? "none" : "ok"}}
  terms={[
    {highlighted: live(0), state: ok(0) ? "ok" : "none"},
    {highlighted: live(1), state: ok(1) ? "ok" : "none"},
    {highlighted: live(2), state: ok(2) ? "ok" : "none"},
  ]}
  fans={[{hi: fanHi(0)}, {hi: fanHi(1)}, {hi: fanHi(2)}]}
  fanPulses={[fanP, fanP, fanP]}
  msgTag={{resolve}}
  statusAt={(r) => (r === FOLLOWED_ROW ? flip.status : FLIP_NONE.status)}
  statusTextOp={(r) => (r === FOLLOWED_ROW ? flip.textOp : 1)}
  statusTint={(r) => (r === FOLLOWED_ROW ? flip.tint : 0)}
  recordIn={1}
  logReveals={[1, 1, log(0), log(1), log(2)]}
  logSelected={1}
  contentReveal={content}
  tokensReveal={tokens}
/>
```

> *"Why is `statusAt` for every other row `FLIP_NONE.status` (= 'firing')?"*
> Because only row 3 is being flipped this scene — the other five stay `firing`
> until the cadence (scene 6). `flipAt` is applied to row 3 only; the rest are
> pinned firing, full text opacity, zero tint. This is the same selective pattern
> as scene 3's `rowHi` (only the followed row). The followed run touches exactly
> one row.

## The camera — pull back for the payoff

```ts
const cam = camLerp(CAM_READ, CAM_ALL, ramp(t, 0.2, 1.6, 0, 1, EASING.inOut));
```

The camera eases from `CAM_READ` (0.78×, the scene-4 lean) back out to `CAM_ALL`
(0.665×) over **0.2 → 1.6s**, `inOut`.

> *"Why pull back out, when scene 4 just leaned in?"* Because the payoff is no
> longer a two-surface conversation — it spans *four* things at once: the agent
> settling, three terminals firing on the left, the record filling on the lower
> right, and the table flipping on the upper right. You need the whole frame to see
> all of it. Scene 4 leaned in because it was an intimate agent↔record exchange;
> scene 5 pulls back because the consequence is wide. The camera framing tracks the
> *scope* of what's happening: tight for a focused exchange, wide for a
> spanning payoff.

> *"Why does the camera settle by 1.6, before the action?"* Same discipline:
> the pull-back happens first (over the agent settling and outputs revealing), and
> the big spanning payoff (the fan, the terminals, the flips, 3.4s onward) plays
> against a stationary `CAM_ALL`. Move the frame, settle it, then act.

## The values, and where they come from

| Surface | Value | Provenance |
|---|---|---|
| content | `payments-api — 500s began with deploy 4f2c1…` | authored diagnosis (threads the GitHub read's `4f2c1`) |
| tokens | `input 6204`, `output 388` | `TRIAGE_TOKENS` (authored) |
| Slack rows | `Operation: Send Message`, `Channel: #incidents` | `slack.ts` op label + subBlock; `#incidents` authored |
| Linear rows | `Operation: Create Issue`, `Team: Platform` | `linear.ts` (V2); `Platform` authored |
| PagerDuty rows | `Operation: Create Incident`, `Urgency: High` | `pagerduty.ts` op label + subBlock (default High) |
| Slack log | `Slack · 412ms` | `LOG_DURATIONS.slack` (authored) |
| Linear log | `Linear · 633ms` | `LOG_DURATIONS.linear` (authored) |
| PagerDuty log | `PagerDuty · 528ms` | `LOG_DURATIONS.pagerduty` (authored) |
| Status flips | `firing → triaged → assigned` | authored lifecycle, synced to real records |

> *"Why are the three terminal operations all CREATES, and why does that matter?"*
> Because it's the mandate's whole point. `Send Message`, `Create Issue`,
> `Create Incident` are the registry's real operation labels — and every one
> *creates a new record*. The agent never edits Slack, never updates a ticket,
> never redeploys. It reads (scene 4's three tool calls) and it creates records
> (these three). That read/create split is the honest claim the video makes about
> on-call agents, and the operation labels enforce it: there is no "update" or
> "edit" or "deploy" anywhere on screen.

> *"Why does PagerDuty's flip become `assigned` rather than `paged`?"* Because a
> PagerDuty incident, when created, *assigns* the on-call engineer via escalation —
> that's PagerDuty's real behavior. So "Create Incident" landing → the incident is
> now `assigned` (it has an owner). The status vocabulary is authored, but the
> *causality* is product-true: creating the page is what assigns the responder.

## The animation, beat by beat

### (a) The agent settles ok — `agentLive = t < 2.2`; outputs reveal

The agent's ring is blue-live until **2.2s**, then green ok (`state: agentLive ?
"none" : "ok"`). As it settles, `content` reveals over **2.3 → 2.8s** and `tokens`
over **2.6 → 3.1s** — a **0.3s stagger**, so the two outputs land as a pair, not a
single block.

> *"Why does the live ring finally release here, after latching across three
> scenes?"* Because *this* is where the agent is done. It went live at scene 3's
> 7.15, burned through scene 4's reads, and now — having finished investigating
> and produced its diagnosis — it settles ok. The latched ring's whole job was to
> span the run; the run's agent-phase ends at 2.2 here, so the ring releases. Blue
> (working) → green (done) is the agent's two-color story, and the green is the
> first thing this scene does.

> *"Why stagger content and tokens by 0.3s instead of revealing them together?"*
> Because two things landing on the exact same frame read as one block teleporting
> in; a small stagger reads as them *arriving in sequence* — content first (the
> diagnosis), then tokens (the cost). It's the same micro-stagger logic as the
> table rows (0.3s) and a softer version of the read beats — just enough to feel
> sequential, not so much that they feel unrelated. The `toolCalls` array is
> already revealed (carried from scene 4), so only `content` and `tokens` are new
> here; they complete the tree.

### (b) The triple-pulse fan — `fanP = ramp(t, 3.4, 4.2)`, ONE value on three edges

This is the scene's signature move. *One* shared progress value, `fanP`, ramps
`0→1` over **3.4 → 4.2s**, and it's passed to all three fan edges:
`fanPulses={[fanP, fanP, fanP]}`. Three `FanPulse` streaks leave the agent's
source handle *at the same instant* and travel the three smooth-step fan edges to
the three terminals — one event, three consequences.

> *"Why one shared value rather than three separate pulse timings?"* Because the
> agent dispatches to all three terminals *at once* — the fan is three
> unconditional edges from one source handle (scene 2's structural honesty), so
> control leaves for all three simultaneously. Driving all three `FanPulse`s from
> the same `fanP` guarantees they're synchronized to the frame: three lights
> leaving together. If you gave them three timings, they'd drift apart and read as
> three separate dispatches, which would lie about the fan being one branch point.
> One value = one event.

> *"How does `FanPulse` differ from the `WirePulse` on edge 1?"* `WirePulse` is a
> horizontal `<div>` streak — it only works on straight wires. The fan edges *bend*
> (smooth-step from the agent's handle out to each terminal's handle), so the rig
> defines `FanPulse`: the same blue light, but drawn as an SVG `<path>` with dash
> math (`strokeDasharray`/`strokeDashoffset`) riding the exact `simEdgeD` geometry
> of the fan edge. It has the same head-streak-plus-trail language (three trailing
> ghost copies at falling opacity, computed from the same `p` param). So a viewer
> reads the fan pulses as "the same light, going around a corner" — consistent
> grammar, different drawing primitive for a bent path.

> *"Why do the fan edges also highlight (`fanHi`)?"* `fanHi(i) = min(ramp(t, 3.4,
> 3.8), ramp(t, OK[i], OK[i]+0.7, 1, 0))` — each fan edge's highlight rises with
> the pulse (3.4→3.8) and releases as *its* terminal settles ok. So while a
> terminal is live, its edge is lit (control is flowing to it); when the terminal
> finishes, its edge cools. Three edges lighting together then cooling one at a time
> as their terminals complete — the edge highlight tracks "this branch is active."

### (c) The three terminals fire — `OK = [5.4, 8.0, 10.6]`, 2.6s pitch

The terminals settle ok in sequence: Slack at **5.4s**, Linear at **8.0s**,
PagerDuty at **10.6s** — 2.6s pitch, in narration order. For each: `live(i)` is
blue from `OK[i]−0.9` to `OK[i]` (a 0.9s live window), then `ok(i)` is green from
`OK[i]`. Each log row lands `ramp(t, OK[i], OK[i]+0.4)` — the moment the block
settles ok, its record row appears.

> *"Why does each terminal go live (blue) for 0.9s BEFORE settling ok (green)?"*
> Because creating a record takes a moment — the Slack post, the Linear issue, the
> PagerDuty incident each have a real duration (412/633/528ms, scaled up for
> legibility to ~0.9s on screen). The block is *working* (blue) while it creates
> the record, then *done* (green) when the record exists. Blue→green is every
> block's two-color story; the 0.9s window is the work, the green is the
> completion.

> *"Why does the log row land ON the green (`ramp(t, OK[i], OK[i]+0.4)`)?"* Because
> the block settling ok and its record existing are the same event — synchrony.
> The block finishes (green) ↔ its log row appears in the record (it ran, here's
> the proof). Same instant, two surfaces: the terminal block and its log entry.
> This is the terminal-completion analog of scene 4's read-result sync. The fan
> pulse arrived earlier (control reached the terminal); the terminal worked (blue
> 0.9s); the terminal finished and recorded (green + log row, same frame).

> *"Why 2.6s pitch between terminals?"* Paced to the narration naming each ("posts
> the diagnosis to Slack, opens a ticket in Linear, creates a PagerDuty incident")
> and wide enough that each create is individually legible — and crucially, wide
> enough to let the *flips* land between them (the first flip lands after Slack at
> 5.5, the second after PagerDuty at 10.7). The terminals aren't racing; each one's
> creation, log row, and (for Slack and PagerDuty) status flip get their own beat.

### (d) The status flip — `flip = flipAt(t, 5.5, 10.7)`, synced to the real records

This is the scene's other signature move, and the one to study hardest because the
whole video's table mechanic is here. `flipAt(t, T1, T2)` from `_beats.ts` produces
three values for row 3's status cell:

```ts
flipAt(t, T1=5.5, T2=10.7) → {
  status:  t < T1 ? "firing" : t < T2 ? "triaged" : "assigned",
  textOp:  min(dip(T1), dip(T2)),     // cell TEXT opacity — dips to 0 at each T
  tint:    max(tintPulse(T1), tintPulse(T2)),  // green output tint, pulse→residue
}
```

**The text dip-swap.** `dip(T) = min(1, |t − T| / 0.14)` — the cell text opacity
reaches exactly 0 at each flip time T (within ±0.14s), then comes back. So the
status text *fades out, swaps the enum value, fades back in* — a clean dip-swap with
no layout pop. At T1=5.5 it dips and returns as `triaged`; at T2=10.7 it dips and
returns as `assigned`.

**The green tint.** `tintPulse(T)` spikes the green output tint to 0.85 over 0.12s
right after each T, then decays over 1.6s to the **residue 0.35**. The rig renders
it as a `rgba(51,196,130, 0.24*tint)` overlay sized exactly to the status cell
(`statusCellX`, `cellTopY(r)`, `STATUS_W`, `CELL_H−2`). The `max()` of the two
pulses keeps the tint continuous through the second flip. The residue 0.35
*persists to the final frame* — a flipped cell keeps a faint green wash forever, a
permanent "this was written" mark.

> *"Why does T1=5.5 and T2=10.7 — why those exact times?"* They're synced to the
> run's REAL records. `triaged` lands at 5.5, which is **0.1s after Slack settles
> ok at 5.4** — the moment the agent's diagnosis exists (the Slack post). `assigned`
> lands at 10.7, **0.1s after PagerDuty settles ok at 10.6** — the moment the page
> is created (which assigns the on-call). The flips are not on their own timeline;
> they're *consequences* of the terminals' real completions, lagged 0.1s so cause
> visibly precedes effect (the record is created, *then* the status reflects it).
> This is the synchrony rule again: the table change is welded to the record that
> caused it, by timing, with no connector. Linear (the middle terminal at 8.0)
> creates a ticket but doesn't flip the status — because a ticket existing doesn't
> change the incident's *status*; only the diagnosis (triaged) and the page
> (assigned) do. The flips track the *meaningful* state changes, not every create.

> *"Why a dip-swap for the text rather than a crossfade or a slide?"* Because the
> cell has a fixed width and the values have different lengths (`firing` /
> `triaged` / `assigned`); a crossfade would briefly show two overlapping strings,
> and a slide would imply motion the product doesn't have. A dip-swap — fade to 0,
> swap the string at the invisible midpoint, fade back — changes the value with no
> overlap and no layout shift. It's the same `DipSwap` discipline used for the
> Messages tag (and everywhere a value changes in place in this series).

> *"Why does the green tint decay to a RESIDUE rather than vanishing?"* Because the
> residue is the *permanent record* of the write. A bright green flare says "just
> written"; decaying to a faint 0.35 wash says "written, and it stays written." By
> the final frame (scene 7), all six status cells carry this residue — the table
> reads as "everything here has been processed," a quiet permanent green that's the
> visual sum of the whole night's work. If the tint vanished, the final table would
> look untouched, which would erase the proof. The residue *is* the proof,
> persisted. (It's also tuned to land right at the table's own resting
> provenance-tint value, so a written cell settles into the product's look with no
> seam.)

### (e) The Messages tag reverts — `resolve = ramp(t, 13.4, 13.9, 1, 0)`

After the run completes, the Messages tag reverts from its resolved value
(`HTTP 500 /payments`) back to the `<sentryalerts.message>` template, over
**13.4 → 13.9s** (a reverse ramp, `1 → 0`).

> *"Why revert the tag, when the table flips PERSIST?"* Because they mean different
> things. The resolved tag value was *this run's transient data* — once run 1 is
> over, the agent's Messages row returns to its idle template (`<sentryalerts.
> message>`), ready for the next alert. That's true to the product: a deployed
> workflow doesn't keep the last run's values pinned in its config rows; references
> are templates that re-resolve each run. The *table flips*, by contrast, are
> permanent facts about the incidents — row 3 is genuinely now `assigned`, and stays
> that way. So: run-transient values revert (the tag), persistent world-state
> accumulates (the status + residue). This distinction is the freeze-cut contract
> for 5→6: scene 6 inherits the *template* agent rows (tag reverted) but the
> *flipped* table (row 3 assigned forever).

> *"Why revert at 13.4, so late?"* Because the run has to fully complete first —
> the last flip (assigned) lands at 10.7, its tint decays through ~12.3, and only
> then (a breath later) does the run's transient state retire. Reverting earlier
> would pull the value out from under a still-completing run. The revert is the
> *last* thing that happens, marking "run 1 is fully over."

### (f) The hold — from ~13.9s to the end of the scene (23.6s)

After the tag reverts, the settled run-1 frame holds: chain all-green, record full
(five log rows, complete tree), row 3 `assigned` with its decaying-then-residue
tint, all other rows still `firing`.

> *"A ~9.7s hold — same problem?"* It's long, but this one is *earned*: it's the
> payoff breath. The money shot just landed (the incident went `assigned`, the
> record filled), and a beat of stillness lets it *land*. The tint decay (the last
> motion) finishes around 12.3, so there's still ~11s of true stillness — which is
> where the re-pacing lesson applies (spread the terminals/flips across the
> narrated 23.6s). But unlike scenes 1–2's holds, a settled-payoff hold has earned
> its stillness; the frame is the *result*, and results deserve to be looked at.

## How to think about the whole scene

1. *How does the run finish?* The agent's latched ring settles green; content +
   tokens complete the tree (0.3s stagger) → the agent is done.
2. *How does it dispatch to three terminals at once?* One shared `fanP` on three
   `FanPulse` edges → one event, three consequences, frame-synced.
3. *How does each record get created?* Terminal goes live blue (working 0.9s) →
   green ok ↔ its log row lands on the same frame → block-completes ↔ record-row,
   synchrony.
4. *How does the table reflect it?* `flipAt` dips the status text at 5.5 (after
   Slack) and 10.7 (after PagerDuty), 0.1s after the real records → causality
   carried by timing, green tint pulsing to permanent residue.
5. *What reverts vs persists?* The Messages tag reverts (run-transient); the status
   flip + residue persist (world-state) → the freeze-cut contract for 5→6.
6. *How is it framed?* Pull back to `CAM_ALL` → the payoff spans the whole frame.

The scene is the busiest in the video, but it isn't cluttered, because every beat
is one causal link and the links are *sequenced*: agent settles (2.2) → fan
dispatches (3.4) → Slack creates + triaged flips (5.4–5.5) → Linear creates (8.0)
→ PagerDuty creates + assigned flips (10.6–10.7) → tag reverts (13.4). One cause,
its consequences laid out in time, never stacked.

## Exit state (what scene 6 inherits)

`run 1 settled: chain all-green (webhook, agent, three terminals all `state:
"ok"`) · record full (all five log rows, complete output tree: content, tokens,
three toolCalls) · Triage log row selected · Messages tag reverted to template
`<sentryalerts.message>` · table row 3 `assigned` with residue tint 0.35; rows
1,2,4,5,6 still `firing` · camera at CAM_ALL`.

Scene 6 opens on exactly this frame — run 1 complete, one row cleared — and runs the
remaining five alerts as an accelerating cadence, each flipping a *different* row to
`assigned`, until the whole status column has drained. Row 3 stays `FLIP_DONE`
(assigned + residue) the whole time; the record stays run 1's settled record (a run
record is per-run; it does not accumulate across runs). Because both scenes render
the same `<Stage/>` at the same `CAM_ALL`, the 5→6 boundary is identical down to the
pixel.
