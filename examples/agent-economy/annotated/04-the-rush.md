# Scene 4 — `the-rush`  ·  archetype: **run ×4, multi-caller (the money shot)**

Source: `../source/scenes/TheRushScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md` (scene 4),
`../source/demo-corpus/grounding-v1.md`.

This is the scene the whole video was pointed at, and the one the director
singled out — *best narration, "the multi-client rush… multiplicity as the
lesson."* Everything before it built one fact at a time: scene 1 ran the agent
the way you'd run it, scene 2 deployed it onto an MCP server, scene 3 let one
stranger call it. This scene is where *many* strangers arrive at once. Read it
as the worked example of the hardest thing a diagrammatic explainer does — make
"a lot is happening" read as a sentence instead of a smear — and read it for
how the answer is *timing*, not spectacle.

---

## What this scene is for

The thesis of the video stated plainly: **you published once, and now five
different agents on five different platforms treat your workflow as
infrastructure.** Scene 3 proved one outside agent can call your chain. A single
call, though, can't carry "many strangers depend on this" — one caller looks
like a one-off. So this scene's whole job is **count**: four more callers, each
differing from the last in exactly one dimension (which client), arriving at an
*accelerating* cadence so the frame fills up faster than it can empty.

That makes this the deliberate exception to the video's run-economy discipline.
Everywhere else the rule is "minimum runs"; here the run count *is* the content
(`script-v1.md`: "a single call cannot show 'many strangers depend on this'; the
count is the content"). One idea per scene still holds — this scene is "the
rush," full stop. It is not "and here's the flip" (scene 5) or "and here's both
directions" (scene 6). It only multiplies the caller.

The single hardest craft problem: four overlapping calls must read as *traffic*,
not as four replays of scene 3 stacked up, and not as noise. The answer is three
moves this scene teaches — the **roll-call entrance**, the **accelerating
cadence**, and the **chain-swap row** that stays continuously busy so the calls
share one chain instead of each resetting it.

## What it looks like

Full frame, static camera. Around the Claude Desktop badge already on screen
from scene 3, four more client badges pop in down the left edge in the product's
exact picker order — Cursor, Claude Code, VS Code, Sim — each with a spoke
drawing on right behind it. Then the calls come, back to back and *speeding up*:
Cursor's badge rings blue, a light pulse rides its spoke into the entry, the
Start row's value dip-swaps to `Helio Robotics`, the chain runs (start blip →
edge pulse → Agent live → edge pulse), and a reply pulse rides the *same* spoke
back as the badge flashes green. Before Cursor's reply has finished returning,
Claude Code's call is already in flight; before that resolves, VS Code's is
launching. By the middle of the scene three calls are airborne at once — one
badge green-decaying, one Agent live, one inbound pulse still on its spoke. The
single Scout chain never moves and never resets; its rows just keep swapping one
company for the next. After the last reply lands, every badge settles to neutral
and the rows revert once to template.

## The set piece is unchanged — this scene is pure state

Like every scene in the video, this renders one `<EconomyRig/>` — the same Scout
chain, the same badge column, the same pill — and changes nothing structural. It
only feeds different state props, every one a function of `t`:

```tsx
<EconomyRig
  entryMix={1}
  entry={{highlighted: startBlip}}
  agent={{highlighted: midLive}}
  response={{highlighted: respBlip}}
  pill={{reveal: 1}}
  showInHandle
  badges={badges}
  spokes={spokes}
  inputResolve={{text: inputText, mix: inputMix}}
  msgResolve={{text: msgText, mix: msgMix}}
  respResolve={{text: respText, mix: respMix}}
/>
```

`entryMix={1}` keeps the entry on its deployed identity (the API header, carried
from scene 2). `pill={{reveal: 1}}` keeps the MCP address pill on screen. Both
are residue from earlier scenes that simply persist — the scene doesn't touch
them. Everything that *arrives* — four badges, four spokes, four runs' worth of
rings and pulses and row-swaps — is expressed as `t`-derived props on that one
rig. There is no new component and no new layout.

> *"This is the busiest scene in the video — why not reach for a new visual
> device to carry the load?"* Because that's exactly the temptation that breaks
> a money shot. The frame is dense; the instinct is to add something to manage
> the density. But the density here is the *point* (it's incoming traffic), and
> the way you keep it legible is by making everything in it the same vocabulary
> the viewer already learned — the badge ring, the spoke pulse, the row dip —
> just more of them, overlapping. A new device in the busiest moment would read
> as the scene panicking. Same world as scene 1, four times over, is what makes
> "it's the same call, from four more places" land instantly. (This is the
> identical discipline `08-the-signals.md` names in the market-desk build: the
> busiest scene reaches for *no* new device.)

## The camera doesn't move

The scene renders into a plain `AbsoluteFill`; there is no camera transform at
all. Static, full-frame, the whole set piece in view.

> *"The bookend (scene 6) gets the video's one camera move — why does the money
> shot get a dead-still camera?"* Because the work is the same shape as the
> frame. The whole lesson is *multiplicity* — four callers on the left, one
> chain in the center, calls overlapping across the whole width — and you need
> to see all of it at once. A camera move would force the viewer to choose where
> to look in the exact moment the point is that there's a lot to look at. The
> density has to come from *overlap inside a held frame*, not from the camera
> finding the action. CHOREOGRAPHY.md states it directly: "the density comes
> from overlap, not movement." A still camera over a busy frame reads as
> *trust*; a moving camera over a busy frame reads as *anxiety*.

## The first idea: the roll-call entrance (even rhythm, product order)

Before any call fires, the four new badges arrive. The entrance is deliberately
*regular* — unlike the calls that follow.

```ts
const pops = {
  [SLOT_CURSOR]:      0.5,
  [SLOT_CLAUDE_CODE]: 0.95,
  [SLOT_VSCODE]:      1.4,
  [SLOT_SIM]:         1.85,
};
badges[slot] = {reveal: popIn(frame, fps, pop)};
spokes[slot] = {progress: interpolate(t, [pop+0.35, pop+0.95], [0,1], …, EASING.out)};
```

Each badge enters with the one shared `popIn` spring (damping 14, stiffness 160,
0.6s, scale 0.82→1 — the same entrance every badge in the video uses), and its
spoke draws on starting **0.35s after** the badge lands and finishing **0.6s**
later, chasing it. The four pops are at **0.5 / 0.95 / 1.4 / 1.85s** — a uniform
**0.45s** stagger.

> *"Why a perfectly even 0.45s stagger here, when the whole rest of the scene is
> about an *accelerating* cadence?"* Because the entrance and the calls are two
> different events with two different meanings. The entrance is a **roll call** —
> "here are the five clients that can call this tool," recited in order — and a
> roll call wants an even, metronomic rhythm; you're enumerating, not building
> pressure. The acceleration is reserved for the *calls*, where building pressure
> is the entire point. Using the even stagger for the roster and the tightening
> cadence for the traffic keeps the two beats from blurring: list first, at a
> steady pulse; then load, at a quickening one. (0.45s is also the exact
> assembly stagger scene 1 used for the chain's three blocks — reusing it makes
> the roll call rhyme with the original build.)

> *"Why this order — Cursor, Claude Code, VS Code, Sim — and why around Claude
> Desktop rather than top-to-bottom?"* It's not chosen for animation; it's the
> product's own MCP Client picker order, top to bottom: Cursor · Claude Code ·
> Claude Desktop · VS Code · Sim (`layout.ts`, slots 0–4, grounded to the client
> ButtonGroup in `workflow-mcp-servers.tsx`). Claude Desktop is slot 2, the
> middle — it's the one already on screen from scene 3, so the four newcomers
> arrive *around* it: Cursor and Claude Code above, VS Code and Sim below. The
> roster grows symmetrically around the caller you already know. The scene
> doesn't decide the order; the product does, and the badge column faithfully
> renders the picker.

## The second idea: the accelerating cadence (the load builds)

This is the load-bearing decision of the scene, so spend time on it. The four
runs are anchored at:

```ts
const RUNS = [
  {slot: CURSOR,      a: 3.2, company: "Helio Robotics", brief: '"warehouse robots"'},
  {slot: CLAUDE_CODE, a: 4.8, company: "Quartzline",     brief: '"data tooling"'},
  {slot: VSCODE,      a: 6.2, company: "Parcelio",       brief: '"logistics API"'},
  {slot: SIM,         a: 7.4, company: "Lumora Grid",    brief: '"energy AI"'},
];
```

The anchors are **3.2, 4.8, 6.2, 7.4s**. Walk the gaps: 4.8−3.2 = **1.6s**, then
6.2−4.8 = **1.4s**, then 7.4−6.2 = **1.2s**. The cadence *tightens* — each call
starts a little sooner after the last than the one before it.

> *"Why accelerate at all? Four evenly-spaced calls would be simpler."* Because
> even spacing would read as a *queue* — orderly, one-at-a-time, under control.
> The thesis is the opposite: your workflow has become infrastructure, and
> infrastructure under real demand gets *busier*, not steadier. The tightening
> gap is "word is spreading" drawn as timing — by the third call the viewer
> feels the calls arriving faster than the chain can clear them. That felt sense
> of accumulating load is the emotional content of "five platforms now depend on
> this," delivered without a single word on screen.

> *"Where do 1.6 / 1.4 / 1.2 come from — why those three numbers?"* They're
> authored, but against a hard constraint: each gap must be *shorter than the
> round trip*, so that calls overlap and the overlap deepens. One run's full
> arc, from its inbound pulse to its reply landing, is about **3.1s** (anchor →
> reply-back ends at `a+3.1`, below). With gaps of 1.6, 1.4, 1.2 — all well
> under 3.1 — every call launches while the previous one is still in flight, and
> because the gaps *shrink*, the number of simultaneously-airborne calls *grows*
> as the scene runs. The specific descent 1.6→1.4→1.2 is a clean 0.2s step: big
> enough to feel the acceleration, small enough that no single gap reads as a
> stutter. Tighter (say starting at 1.0) and even the first two calls would
> mush; wider (say 2.0) and they'd read as separate events with air between
> them, which is the queue you're trying to avoid.

The result is the **de-phased stream**. With ~1.2–1.6s gaps against a ~3.1s
round trip, three runs are airborne at the peak. CHOREOGRAPHY.md catches one
such instant precisely: at **t ≈ 6.3s**, Cursor's green ring is decaying, Claude
Code's Agent is live, and VS Code's inbound pulse is still on its spoke — three
different runs at three different stages, in one frame. *That* is the frame that
reads as a system under load.

## The third idea: chain-swap rows (one chain, continuously busy)

In scene 3, a single call resolved a value into the row and then the row
*reverted to template* before the scene ended. If this scene did that four
times, you'd see the row fill and empty, fill and empty — four discrete events
with dead template between them, which would undo the "continuous traffic" read.
So the rows here never return to template between runs. They **dip-swap value to
value**:

```ts
const inputText = chainSwap(t, RUNS[0].company,
  RUNS.slice(1).map(r => ({at: land(r.a), value: r.company})));
// land(a) = a+0.55 · msgAt(a) = a+1.2 · respAt(a) = a+2.3
```

`chainSwap` (in `_rig.tsx`) nests a `DipSwap` per run: the row holds
`Helio Robotics`, then at `land(RUNS[1].a)` swaps to `Quartzline`, then to
`Parcelio`, then to `Lumora Grid` — each transition a 0.35s dip through the
midpoint (`DipSwap` shows `a` below mix 0.5 and `b` above, with opacity
`|mix−0.5|·4` so the old value fades out and the new fades in, never a hard
cut). The Input row swaps at `a+0.55`, the Agent's Messages tag at `a+1.2`, the
Response brief at `a+2.3` — each row reflecting *its* run's value at *its* point
in that run's arc.

> *"Why swap value→value instead of reverting to template and resolving fresh
> each time, like scene 3 did?"* Because reverting would assert that the chain
> goes *idle* between calls, and the whole point of the rush is that it doesn't —
> it's saturated. A row that swaps `Helio Robotics → Quartzline → Parcelio →
> Lumora Grid` with no template between says "this chain is continuously
> serving, the last result barely cleared before the next request landed." The
> template-return is the visual grammar for "the run finished and the workflow
> is at rest"; suppressing it between runs is how you draw "no rest." The single
> revert is saved for the *very end* (below), where the rush actually does
> subside.

> *"Why are the per-run beats compressed here versus scene 3's full grammar?"*
> Look at the helper offsets: `land = a+0.55`, `msgAt = a+1.2`, `respAt = a+2.3`
> — the three row-resolutions are packed into ~2.3s, tighter than the unhurried
> module-5 `runBeats` arc scene 1 used. They have to be: at 1.2–1.6s gaps, a
> full-length run wouldn't finish before two more had started, and the overlap
> would stop being legible and start being mush. Compression is what *lets* the
> de-phasing read — each run is short enough that even three stacked are
> followable. The beats are the same grammar, just played faster, which is
> itself the truth: under load, each call still does the same work, there's just
> less air around it.

## The block rings are *unioned* across runs (one chain, many callers)

The Scout chain is a single set of blocks, but four runs are passing through it
at once. So the block highlights can't belong to one run — they're OR'd across
all of them:

```ts
let startBlip = false, midLive = false, respBlip = false;
for (const r of RUNS) {
  startBlip ||= t >= r.a+0.5  && t < r.a+0.85;
  midLive  ||= t >= r.a+1.25 && t < r.a+1.75;
  respBlip ||= t >= r.a+2.25 && t < r.a+2.7;
}
```

For each run, the Start block blips live over `a+0.5→a+0.85`, the Agent over
`a+1.25→a+1.75`, the Response over `a+2.25→a+2.7`. The `||=` means the Agent
reads "live" whenever *any* run is in its live window — so during overlap, the
Agent block simply stays lit, because there genuinely is always a run working.

> *"Why union them instead of giving each run its own block?"* Because there's
> only one Scout chain. The product runs one workflow; multiple callers hit the
> *same* deployed chain, not four copies. Drawing four chains would be the lie —
> it would imply the deployment forks per caller, which it doesn't. The honest
> picture is one chain, lit continuously because it's continuously busy, with
> the *callers* (the badges) being what's plural. Unioning the rings is that
> truth in code: many callers, one chain, the chain lit whenever anyone is
> running it.

## The round trip, per run: badge → spoke → chain → spoke → badge

Each run is a full MCP round trip — the call rides in on the caller's spoke, the
chain runs, the reply rides the *same* spoke back. The badge state tells the
story in product language (blue ring = call in flight, green ring = reply
landed):

```ts
badges[r.slot] = {
  blue:  Math.min(c(t, r.a-0.25, r.a),     c(t, r.a+2.5, r.a+2.8, 1, 0)),
  green: Math.min(c(t, r.a+3.0, r.a+3.25), c(t, r.a+3.7, r.a+4.3, 1, 0)),
};
```

And the two pulses on the spoke, plus two on the chain edges:

```ts
<PathPulse d={spoke.d} p={c(t, r.a, r.a+0.6)} />               // inbound
<PathPulse d={spoke.d} p={c(t, r.a+2.5, r.a+3.1)} reverse />   // reply back
<WirePulse … p={c(t, r.a+0.7,  r.a+1.25)} />                   // chain edge 1
<WirePulse … p={c(t, r.a+1.75, r.a+2.3)} />                    // chain edge 2
```

Walk one run (Cursor, `a = 3.2`):

1. **`a−0.25 → a` (2.95→3.2s):** Cursor's badge ring goes **blue** — the call is
   forming. The blue lights *before* the packet departs: intent precedes the
   pulse.
2. **`a → a+0.6` (3.2→3.8s):** the inbound `PathPulse` rides Cursor's spoke from
   the badge into the entry handle. As it arrives, the Input row dip-swaps to
   `Helio Robotics` at `land(a) = a+0.55 = 3.75s` — the value lands the frame the
   pulse reaches the block.
3. **`a+0.5 → a+0.85`:** the Start block blips live; **`a+0.7 → a+1.25`** the
   first chain edge pulses (Start → Agent); the Messages tag resolves at
   `msgAt(a) = a+1.2`.
4. **`a+1.25 → a+1.75`:** the Agent ("Scout") is live; **`a+1.75 → a+2.3`** the
   second edge pulses (Agent → Response); the Response brief resolves at
   `respAt(a) = a+2.3` to `"warehouse robots"`.
5. **`a+2.25 → a+2.7`:** the Response block blips. Blue starts fading
   `a+2.5→a+2.8`.
6. **`a+2.5 → a+3.1`:** the reply `PathPulse` rides the *same* spoke back
   (`reverse`) to Cursor — in MCP the result returns to the calling client.
7. **`a+3.0 → a+3.25`:** Cursor's badge flashes **green** — reply landed —
   decaying `a+3.7→a+4.3`.

> *"Why does the reply ride the same spoke back instead of exiting the right
> edge like the module-6 out-stub?"* Because it's product-true for MCP: a tool
> call's result returns to the client that made it, not "out the other side"
> (script-v1.md and grounding declare this deviation from module-6 v2
> deliberately). `PathPulse` with `reverse` replays the identical path geometry
> end→start, so the reply visibly retraces the call's route home. That round
> trip — out on the spoke, back on the same spoke — is what makes "your workflow
> answered *that specific caller*" legible when four callers are live at once:
> each reply goes to exactly the badge whose blue you saw launch it.

> *"Why light the badge blue 0.25s before the pulse leaves, and flash green as
> it lands?"* Because the blue is *intent* and the green is *confirmation* — two
> different facts about the call. Blue first says "this client is now calling"
> (the selection-state language the product uses), then the packet departs.
> Green at the end says "and it got its answer." Separating them by the full
> round trip is what lets you read, in the overlapping middle, which badge is
> mid-call (blue) versus which just finished (green) — the colors are how you
> keep four simultaneous callers individuated.

## The single focal thread amid the rush

Four overlapping calls could read as noise. The reason they don't is that
**Cursor's run — `RUNS[0]` — is the one the rows actually display first and
hold through.** The row-resolution mixes are gated to Cursor's anchor, then
chain-swapped forward:

```ts
const inputMix = Math.min(c(t, land(RUNS[0].a), land(RUNS[0].a)+0.35), out);
```

The first landing (`land(RUNS[0].a) = 3.75s`) resolves the row from template to
*value*; every later landing is a value→value dip-swap on top of it. So the
viewer's eye has one continuous thread to follow — the row, which fills with
Cursor's `Helio Robotics` and then keeps swapping — while the other three runs
play out as badge-and-spoke activity around it.

> *"Isn't tracking only one run's value, while four run, a cheat — doesn't it
> hide three of the calls?"* No — it's how you make four calls *watchable*. If
> all four runs tried to display their values in the row simultaneously, the row
> would be illegible. Instead the scene gives you **one focal thread** (the row,
> following the front-running call) and lets the other runs register in the
> periphery as their badges' blue/green and their spokes' pulses. You feel four
> calls — three badges are always doing something — but you only have to *read*
> one. That's the same discipline as "one focal element per moment, dim the
> rest," applied to *time*: in a burst of four, one is foregrounded and the rest
> are felt. It's what separates choreographed density from noise.

## The settle and the single revert

After the last call (Sim, `a = 7.4`) completes its arc, the rush subsides. Its
reply lands and its green decays by **~11.7s** (`a+4.3 = 11.7`). Only then does
the row revert — once, for all four runs together:

```ts
const REVERT = 12.0;
const out = c(t, REVERT, REVERT+0.35, 1, 0);   // gates every row mix to 0
```

At **12.0→12.35s** the `out` factor drives every row mix back to 0, dipping the
displayed company back to the `Company name` template in one motion. The badges
settle to neutral (no blue, no green) and stay on screen.

> *"Why one revert at the very end instead of reverting after each call?"*
> Because reverting per-call would re-assert idleness between calls — the exact
> thing the chain-swap was built to avoid. The single revert at 12.0s is the
> rush *ending*: the calls have stopped, the chain finally clears, the row goes
> back to template once. It's the punctuation on the burst, not four separate
> resets. And it's timed to fire only *after* the last green has decayed (11.7s)
> — so the revert never steps on a call still in flight; it waits for the
> traffic to actually subside, then closes the row.

> *"Why do the badges stay after settling?"* Residue — the same accumulation
> rule every scene follows. The world only grows. Scene 3 left Claude Desktop
> behind; this scene leaves all five clients behind. By the end the badge column
> is full, permanently, because those callers don't go away when their call
> finishes — they're now part of the world. The next scene opens on five badges
> because the rush *happened*, and the frame remembers it.

## How to think about the whole scene

Every decision answers one question — *how do I make "four agents call this at
once" read as legible traffic instead of noise?*:

1. *How many callers, and in what order?* Four more, in the product's picker
   order, popping in around the one you know → the roster is product truth, not
   arrangement.
2. *How does the roster arrive vs. how do the calls arrive?* Even 0.45s stagger
   for the roll call, accelerating 1.6/1.4/1.2s for the calls → list at a steady
   pulse, load at a quickening one; the two beats never blur.
3. *Why accelerate?* Gaps shorter than the 3.1s round trip, shrinking → calls
   overlap and the overlap deepens → "infrastructure under demand gets busier."
4. *How do four calls share one chain?* Chain-swap the rows value→value (no
   template between) and union the block rings → one chain, continuously busy,
   many callers.
5. *How does each call stay individuated in the overlap?* The badge round trip —
   blue out, green back on the same spoke → you can always read which client is
   mid-call and which just finished.
6. *How do you keep it from being noise?* One focal thread (the row follows the
   front call) with the other three felt in the periphery → choreographed
   density, not a smear.
7. *Where's the camera?* Dead still → the density is overlap inside a held
   frame; a move would force a choice in the moment built on seeing it all.
8. *How does it end?* One revert at 12.0s after the last green decays, badges
   stay → the rush subsides as punctuation, and the world keeps its callers.

The money shot isn't a flourish — it's the same restraint the rest of the video
uses, applied to the busiest moment. The acceleration is the felt content; the
chain-swap is the saturation; the union is the honesty (one chain, not four);
the focal thread is the legibility; the still camera is the trust. Get those
right and "five platforms call this at once" reads as a sentence the viewer
*feels*, with no word on screen.

## Exit state (what scene 5 inherits)

`all five client badges present (Cursor, Claude Code, Claude Desktop, VS Code,
Sim) + their spokes drawn on · rows reverted to template (by 12.35s) · entry on
its API/deployed identity · MCP pill on · no badge rings (all settled) · no
partner badge yet · static full frame`. This is "deployed state C" in the
continuity contract. Scene 5 opens on exactly this frame and flips the focus —
dimming the badges and entry to 0.35 — to introduce the partner server
top-right. Because both scenes render the same `<EconomyRig/>` with every value
latched at its template/settled state, the boundary is pixel-identical by
construction.
