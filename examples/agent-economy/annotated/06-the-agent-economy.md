# Scene 6 — `the-agent-economy`  ·  archetype: **settle / bookend**

Source: `../source/scenes/TheAgentEconomyScene.tsx`,
`../source/demo-corpus/grounding-v1.md`, `../source/layout.ts`,
`../source/scenes/_rig.tsx`.

This is the final scene of the video, and it does two things at once that
every earlier scene split apart: it runs the chain *and* it settles. It is
the bookend — the camera releases a few percent over the whole ecosystem
and one last run carries both directions in a single traversal, then
freezes green. Read it as a worked example of the *settle* archetype, the
scene whose job is to stop, name the idea by showing it whole, and complete
the arc the opening scene started. Every choice below is one you'll make
again when you write your own closing frame.

---

## What this scene is for

The video opened (scene 1) on **one agent you built** — the Scout chain on
your canvas, running because *you* ran it. Five scenes answered the question
that planted: deploy it as a tool, and what happens? A stranger calls it. Then
five callers at once. Then the flip — your agent calls someone else's. This
scene closes the loop by drawing all of that into **one picture and one run**:
five client badges down the left, the chain in the center, the partner server
top-right, the tool identity above the entry — and a single closing call that
*both* arrives from a client *and* reaches out to the partner, mid-flight. The
bookend's job is to **name the idea by making it visible all at once** — to say
"every agent is both a tool and a tool-user; that's the economy, and your
workflow is already in it" with a held image rather than a caption.

So the rule the scene follows is *one idea per scene*, taken to its limit. The
idea is "the agent economy," and the only honest way to show an *economy* is
many parties depending on each other simultaneously — so this scene is the only
one that runs **both directions in the same traversal**. Every earlier scene
isolated one direction (inbound in 3–4, outbound in 5) precisely so this one
could fuse them and have the fusion *read*. Resist the urge to add anything new
here. There are no new actors, no new geometry; everything on screen was earned
by an earlier scene. The scene's discipline is to take the assembled world, run
it once both ways, and let it rest green.

## What it looks like

The whole set piece, eased back ~7%: the five client badges on the left in
product picker order (Cursor, Claude Code, Claude Desktop, VS Code, Sim), each
wired by a spoke into the entry handle; the Scout chain center (entry now `API`,
the Agent "Scout", the Response); the `research_competitor` MCP pill above the
entry; the partner server `pricing_intel` top-right, wired to the Agent's source
handle. Then one run plays: Claude Code's badge rings blue and a pulse rides its
spoke in, `Drift Harbor` resolves into the Input row, the chain walks green in
causal order (entry → Agent → Response), and **mid-run** the `pricing_intel`
chip rings while a pulse rides out to the partner and back — then the reply rides
the spoke back to Claude Code and its badge flashes green. Nothing reverts. The
frame holds, dead still and entirely green, for the length of the narration.

## The one real decision: run it both ways once, then latch every final

The scene renders the full set piece and drives it through a single
hand-rolled run that interleaves the two directions:

```tsx
const ease = interpolate(t, [0.6, 1.9], [0, 1], {…, easing: EASING.inOut});
const s = 1 - 0.07 * ease;          // 1.00 → 0.93
const a = 2.8;                       // the bookend run's anchor

// final-state latches — no `t`, no revert:
const entryDone = t >= a + 0.45;     // ≥ 3.25
const agentDone = t >= a + 3.1;      // ≥ 5.9
const respDone  = t >= respStart + 0.4; // ≥ 6.95
const badgeGreen = c(t, respStart + 1.15, respStart + 1.4); // climbs to 1, stays
```

Two things to take from this.

**The run is the same run grammar as scene 1, fused with scene 5's
outbound leg.** Every value resolves in a row (`Drift Harbor` dips into the
Input via `inputMix`, the Messages tag via `msgMix`, the Response brief via
`respMix`), every wire carries light only (`PathPulse` on the spoke and the
partner path, `WirePulse` on the two chain edges), every state speaks the
product's language (blue ring = call in flight, green `ok` ring = finished
clean). You are not inventing a "finale" motion — you're quoting the grammar the
viewer has now seen five times and letting the *combination* be the new thing.

**Every settled value is a latched final — a fixed end-state with no clock
in it.** Look at the `*Done` booleans: each is a one-way threshold (`t >= …`),
not a window. Once crossed they never flip back. `badgeGreen` is a `c(...)` ramp
that climbs to `1` after `respStart + 1.4` and clamps there forever (note the
default `h2 = 1`, with no falling second leg — unlike scene 5's `partnerGreen`,
which decays). The comment in the source says it outright: *"Green settle,
causal order; final state holds (no revert — bookend)."* From ~8s onward the
frame is a genuinely static image — and that property is the whole reason a
bookend can survive narration (see "Why latched finals" below).

> *"Why hand-roll the beats here instead of calling `mcpCall(t, a)` like
> the other run scenes?"* Because `mcpCall` wraps one round trip — caller's
> pulse in, chain runs, reply back to caller — and it *reverts* at the end
> (its `badgeGreen` decays, `runBeats` returns rows to template). This scene
> needs two things that wrapper can't express: a **second** outbound leg fired
> *inside* the live window (the partner call), and a **non-reverting** finish
> (everything stays green). So the timing is inlined: `spokeIn`, `inputMix`,
> `pulse1`, `pulse2`, `respMix`, `reply` for the inbound round trip, plus
> `outPulse`/`backPulse`/`chipRing`/`partnerBlue`/`partnerGreen` for the
> outbound leg interleaved into the middle. It's the same beat *vocabulary* as
> the helper, composed by hand because the composition is novel.

## The camera — the only camera move in the whole video

```tsx
const ease = interpolate(t, [0.6, 1.9], [0, 1], {…, easing: EASING.inOut});
const s  = 1 - 0.07 * ease;          // scale: 1.00 → 0.93
const tx = CENTER_X * (1 - s);       // CENTER_X = 960
const ty = CENTER_Y * (1 - s);       // CENTER_Y = 540
// transform: translate(tx, ty) scale(s), transformOrigin "0 0"
```

The camera eases from `s = 1.0` (full frame, what scene 5 left) to `s = 0.93`
over **0.6s → 1.9s**, eased `inOut`, then sits there forever — a **~7%
pull-back**, scaled about the frame center (the `tx/ty = CENTER * (1 − s)`
correction keeps the midpoint fixed while everything shrinks toward it). Unlike
every earlier scene, which was framed dead static, this one *moves the camera* —
and it's the only camera move in the entire video.

> *"Why is this the *only* camera move, after five static scenes?"* Because
> scenes 1–5 each had exactly one job and the static frame served it: a static
> frame says "look at this surface, it isn't going anywhere." A camera move is a
> statement, and the video saves its single statement for the moment it has
> something the frame can't say standing still — *zoom out and see the whole
> thing.* The pull-back is the visual argument of the word "economy": the chain
> you've been staring at is one node in a web of mutual calls, and to read it as
> *part of a system* your eye has to step back far enough to hold the callers,
> the chain, and the partner in one view at once. A move that earns its place
> exactly once is worth more than five decorative ones.

> *"Why 7% — why not a bigger, more obvious zoom-out?"* Because everything
> the eye needs is *already in frame* — scene 5 ended on the full ecosystem at
> `s = 1.0`. The pull-back isn't fetching off-screen content; it's a *gesture of
> completion*, the visual equivalent of leaning back from a finished board.
> Seven percent is below the threshold where the eye reads "we're traveling
> somewhere" and above the threshold where it reads as nothing — you feel the
> frame settle back without it announcing itself as a shot. Make it 25% and it
> becomes a dolly-out that begs for new information at the new scale; make it 2%
> and it's invisible jitter. Seven percent is "take it all in, one last time."

> *"Why `EASING.inOut` and not `out`?"* Because the move both starts and ends
> from rest. `EASING.out` (fast start, slow finish) is for entrances — something
> arriving from offscreen. This camera is already at rest at `t = 0` (it inherits
> scene 5's full frame) and comes to rest again at `s = 0.93`; `inOut`
> (slow-fast-slow) eases out of the first rest and into the second, so there's no
> velocity discontinuity at either end. It's the same curve every *transform
> settling between two states* uses across the series.

> *"Why start at 0.6s instead of 0.0?"* So the cut from scene 5 lands on a
> still frame before the camera releases, and — critically — so the pull-back
> **finishes (1.9s) before the run begins (anchor `a = 2.8`).** The move and the
> action never overlap. If the camera were still drifting when Claude Code's
> pulse rode in, the two motions would compete and both would blur. Holding ~0.6s
> of the inherited frame keeps the boundary identical (exit == enter), then the
> 1.3s ease-back plays into stillness, then a ~0.9s beat of calm, *then* the run.
> Each event gets its own air — the cardinal discipline of the whole series.

## The bookend run, beat by beat (anchor `a = 2.8`)

The run is hand-rolled to interleave both directions on one anchor. Read it as
three movements: the inbound call arrives, the outbound call fires *inside* the
inbound's live window, and then the inbound completes and replies — each leg
green-stamped in the exact order the data flows. The clamp helper `c(t, lo, hi,
l2=1, h2=…)` is the series' `interpolate`-with-clamp; `c(t, lo, hi, 1, 0)` is a
*falling* ramp (used for the temporary blue rings that hand off to green).

### (a) Claude Code calls in — `badgeBlue`, `spokeIn`, `inputMix`

```tsx
const badgeBlue = Math.min(c(t, a-0.95, a-0.65), c(t, respStart+0.55, respStart+0.85, 1, 0));
const spokeIn   = c(t, a-0.7, a-0.05);   // [2.1, 2.75]
const inputMix  = c(t, a, a+0.35);        // [2.8, 3.15]
badges[SLOT_CLAUDE_CODE] = {reveal: 1, blue: badgeBlue, green: badgeGreen};
```

Claude Code's badge (slot 1) rings **blue** over `1.85 → 2.15` — `rgba(51,180,255,
blue)` in the rig — *before* its pulse departs. Then `PathPulse` rides its spoke
inbound over `2.1 → 2.75`, and `Drift Harbor` dips into the Input row over
`2.8 → 3.15`. Three beats, 0.3–0.7s apart: **intent → packet → arrival.**

> *"Why does the blue ring start at 1.85, a quarter-second before the pulse
> at 2.1?"* Because intent precedes the packet. The badge lighting blue is "this
> client decided to call"; the pulse is the call traveling the wire. Lighting
> them simultaneously would read as one event; the 0.25s lead makes the badge the
> *cause* and the pulse the *effect*. This is the same two-surface sync the rush
> scene leans on — the ring on one surface, the motion on the wire, offset so the
> eye reads causality.

> *"Why does `inputMix` start at exactly `a = 2.8`, the frame `spokeIn` ends
> (2.75)?"* So the value lands on the Input row the instant the pulse arrives —
> two surfaces, one event. The packet hitting the entry handle and the Input
> field filling are the *same moment* seen twice (on the wire, in the row). A gap
> would read as "the call arrived, then later something typed"; touching them
> makes arrival and resolution a single beat.

> *"Why Claude Code, and why `Drift Harbor`?"* Claude Code is slot 1 — and it's
> the caller scene 5's *outbound* leg didn't use, so picking it here keeps the
> bookend from echoing the prior scene's specific actor while still being one of
> the five established badges. `Drift Harbor → "dev platform"` is the last entry
> in the grounding's fictional input table (`grounding-v1.md`); every input
> string in the video traces to that table, this one included. The brief
> `"dev platform"` is what resolves into the Response later (beat e).

### (b) The chain runs inbound, stamping green in causal order — `entryDone`, `pulse1`, `midLive`

```tsx
const pulse1   = c(t, a+0.5, a+1.15);    // [3.3, 3.95] — rides edge 1
const msgMix   = c(t, a+1.05, a+1.45);   // [3.85, 4.25]
const midLive  = t >= a+1.1 && t < a+3.1; // [3.9, 5.9)
const entryDone = t >= a + 0.45;          // ≥ 3.25
entry={{state: entryDone ? "ok" : "none"}}
agent={{highlighted: midLive && !agentDone, state: agentDone ? "ok" : "none"}}
```

The entry stamps its green `ok` ring at **3.25** (just after the input lands).
`pulse1` rides edge 1 (entry → Agent) over `3.3 → 3.95`; the Messages tag
`<start.input>` resolves to `Drift Harbor` over `3.85 → 4.25` — **the moment the
pulse reaches the Agent block**, cause before effect by construction. The Agent
goes live (`midLive`, the blue working ring) from `3.9` and stays lit until
`5.9`, a **2.0-second** live window.

> *"Why is the Agent's live window 2.0s — much longer than scene 1's ~0.7s?"*
> Because in this scene the Agent's work *contains a second call.* In scene 1 the
> Agent just ran its built-in tools and finished; here, while it's live, it
> reaches out to the partner server and waits for the reply (beat c). The live
> window has to be long enough to hold that entire outbound round trip *inside*
> it — `midLive` runs `[3.9, 5.9)` and the outbound leg fires at `4.1`–`5.9`,
> nested completely within. This is the same idea as scene 5's stretched
> `midDur: 2.4`, here expressed as a literal `t >= a+1.1 && t < a+3.1` window so
> the nesting is exact. The long live ring *is* the visual claim "this agent is
> busy calling someone else."

> *"Why `highlighted: midLive && !agentDone` — why the extra `!agentDone`
> guard?"* Because the blue *working* ring and the green *done* ring are mutually
> exclusive states, and `agentDone` (`t >= 5.9`) flips on at the exact frame
> `midLive` flips off (`< 5.9`). The `&& !agentDone` makes sure that at the
> boundary frame there's never both rings at once — the block hands off cleanly
> from "working" (blue) to "finished" (green `ok`) in a single frame, the way the
> real block would.

### (c) The outbound leg fires *inside* the live window — `chipRing`, `outPulse`, `backPulse`, `partnerBlue`, `partnerGreen`

```tsx
const chipRing     = Math.min(c(t, a+1.3, a+1.55), c(t, a+2.7, a+2.95, 1, 0)); // up [4.1,4.35], down [5.5,5.75]
const outPulse     = c(t, a+1.5, a+2.2);   // [4.3, 5.0]
const backPulse    = c(t, a+2.4, a+3.1);   // [5.2, 5.9]
const partnerBlue  = Math.min(c(t, a+1.4, a+1.7), c(t, a+2.4, a+2.7, 1, 0));    // up [4.2,4.5], down [5.2,5.5]
const partnerGreen = Math.min(c(t, a+3.05, a+3.3), c(t, a+3.8, a+4.3, 1, 0));   // up [5.85,6.1], down [6.6,7.1]
```

This is the move that makes the scene the *economy* and not just another call.
While the Agent is live, the `pricing_intel` chip on its Tools row rings up over
`4.1 → 4.35`; a pulse rides the partner path **out** over `4.3 → 5.0`; the
partner badge rings blue over `4.2 → 4.5`; a pulse rides the partner path
**back** (`reverse`) over `5.2 → 5.9`; the partner badge flashes green over
`5.85 → 6.1`; and the chip ring releases over `5.5 → 5.75`. Chip ↔ wire ↔ remote
server is a **three-surface sync**: the same event seen on the Agent's tool row,
on the wire, and on the partner badge.

> *"Why does the chip ring *release* (5.5–5.75) before the partner reply even
> lands (back pulse ends 5.9)?"* Because the chip ring means "this tool is
> *executing*," and from the local Agent's point of view the call is in flight
> from departure (`outPulse` start 4.3) until the result is essentially home. The
> release at 5.5–5.75 anticipates the back pulse arriving at 5.9 by a hair —
> close enough to read as "the tool finished," far enough that the green partner
> flash at 5.85 lands as the *confirmation*. Ringing the chip off at the exact
> arrival frame would look mechanical; leading it slightly reads as the call
> *resolving*.

> *"Why does `partnerGreen` decay (down `[6.6, 7.1]`) when the local badge's
> green is supposed to *hold*?"* Because the partner is a *remote* actor whose
> job in this run is momentary — it answered one tool call and is done; its green
> flash is an acknowledgment that fades, exactly as in scene 5. The *local* badge
> (Claude Code) green is the one that latches, because it represents the
> *outcome* of the whole run from the caller's side — the thing the bookend wants
> to leave lit. So the two greens are deliberately different: the partner's is a
> transient flash (`min(up, down)`), the caller's is a one-way latch
> (`badgeGreen`, no down leg). One is "I helped"; the other is "and it came back
> to you, and that's where we rest."

> *"Why is the whole outbound leg nested inside the live window rather than
> before or after the inbound run?"* Because that nesting *is* the thesis. "Every
> agent is both a tool and a tool-user" only reads if the viewer sees the *same*
> agent being called (inbound) and calling (outbound) in *one* breath — not
> "first it's a tool, then separately it's a user." Firing the partner call while
> the Agent is mid-run, mid-live, fuses the two roles into a single moment. This
> is the payload the earlier scenes deliberately kept apart so this one could
> join them.

### (d) The Response resolves and stamps green — `pulse2`, `respMix`, `respDone`

```tsx
const pulse2    = c(t, a+3.1, a+3.75);   // [5.9, 6.55] — rides edge 2
const respStart = a + 3.75;               // 6.55
const respMix   = c(t, respStart, respStart+0.35);  // [6.55, 6.9]
const respDone  = t >= respStart + 0.4;   // ≥ 6.95
response={{state: respDone ? "ok" : "none"}}
```

The moment the Agent finishes (5.9), `pulse2` rides edge 2 (Agent → Response)
over `5.9 → 6.55`; the Response's `<scout.content>` tag resolves to
`"dev platform"` over `6.55 → 6.9`; the Response stamps its green `ok` ring at
**6.95**. The brief now contains the answer that came back from the partner —
the outbound call's result is *used* in the local output, which is the whole
point of calling a tool.

> *"Why does the Response only start resolving at 6.55, after both the
> inbound run AND the nested partner round trip have completed?"* Because the
> brief can't be written until the agent has everything it needs — and one of the
> things it needs is the partner's answer. The partner reply lands at ~5.9
> (`backPulse` end), the Agent stamps done at 5.9, *then* pulse2 carries the
> finished work to the Response. The ordering is causal: the response literally
> cannot precede the tool result it incorporates. Resolving the Response earlier
> would imply the agent answered before its own tool call returned.

### (e) The reply rides home and Claude Code latches green — `reply`, `badgeGreen`

```tsx
const reply      = c(t, respStart+0.55, respStart+1.2);  // [7.1, 7.75], reverse
const badgeGreen = c(t, respStart+1.15, respStart+1.4);  // [7.7, 7.95] → holds at 1
<PathPulse d={spoke.d} len={spoke.len} p={reply} reverse />
```

Finally the reply rides Claude Code's spoke **back** (`reverse`) over
`7.1 → 7.75` — in MCP the result returns to the client that called — and the
badge flashes green over `7.7 → 7.95` *and stays green.* The green-settle order
across the whole run is strictly causal: entry (3.25) → Agent (5.9) → Response
(6.95) → caller (7.95). **The state walks the exact path the data did.**

> *"Why does the reply leave (7.1) only *after* the Response stamps ok
> (6.95)?"* Because the client gets the *finished* result, not a partial one. The
> Response going green is "the brief is done"; only then can the reply carry it
> home. The 0.15s gap between the Response stamp and the reply departing is the
> handoff — done, *then* returned.

> *"Why does this badge's green latch when every other green flash in the
> video decayed?"* This is the bookend's defining choice. Throughout scenes 3–5,
> every badge green flashed and faded — because those runs *reverted*, returning
> the world to a resting template so the next beat could start clean. This run
> does **not** revert: `badgeGreen` has no falling leg, the three `*Done`
> booleans never flip back, no row resolves back to template. The final frame is
> the run *frozen at completion* — green at every node, the call still hanging in
> the air, resolved. That's the difference between "here's a call" (which clears)
> and "here's the economy at steady state" (which holds).

## The five badges, the partner, the pill — all present, all latched

```tsx
const badges = Object.fromEntries(
  [SLOT_CURSOR, SLOT_CLAUDE_CODE, SLOT_CLAUDE_DESKTOP, SLOT_VSCODE, SLOT_SIM]
    .map((slot) => [slot, {reveal: 1}]),
);
badges[SLOT_CLAUDE_CODE] = {reveal: 1, blue: badgeBlue, green: badgeGreen};
// …
partner={{reveal: 1, blue: partnerBlue, green: partnerGreen, spoke: {progress: 1}}}
mcpChip={{reveal: 1, ring: chipRing}}
pill={{reveal: 1}}
entryMix={1}
spokes={…all five at {progress: 1}}
```

Every actor the earlier scenes introduced is here at full reveal, fixed: all
five client badges (`reveal: 1`), all five spokes fully drawn (`progress: 1`),
the partner server (`reveal: 1`, spoke `progress: 1`), the `pricing_intel` chip
(`reveal: 1`), the `research_competitor` pill (`reveal: 1`), the entry fully
morphed to `API` (`entryMix: 1`). Only Claude Code's badge carries live state
(`blue`/`green`); the other four are simply present, the residue of the rush.
The badge order is the product's exact MCP client picker order, top to bottom:
**Cursor · Claude Code · Claude Desktop · VS Code · Sim** (`grounding-v1.md`,
from `workflow-mcp-servers.tsx`).

> *"Why are the other four badges just sitting there inert while only Claude
> Code runs?"* Because the scene's job is to show the *assembled world*, then run
> *one* call through it — not to re-fire all five. The four idle badges are the
> proof that the world is permanently bigger now: each was earned by a call in
> scenes 3–4 and left behind as residue. They don't need to light again; their
> mere presence, wired in, is the "five strangers depend on this" claim held
> static. Re-running all five here would just replay the rush and bury the one
> thing this scene adds — the *both-directions* run. One live caller against four
> resting ones reads as "the system at rest, handling a call," which is exactly
> the economy's steady state.

> *"Why is the partner spoke drawn from the Agent's *source* handle while the
> caller spokes hit the entry's *target* handle?"* Because direction is encoded
> in geometry. Callers feed *into* the chain — their spokes land on the entry's
> input (target) handle, the same handle a real upstream block would wire to.
> The Agent calling *out* to the partner leaves from the Agent's *source* handle
> (the output side), routes up-right through the agent↔response channel, and into
> the partner badge (`PARTNER_SPOKE` in `layout.ts`). Inbound hits an input;
> outbound leaves an output. The viewer reads "this end receives, that end
> sends" from where the wires attach, with no label.

## Why latched finals — the scene's structural reason for existing

This is the deepest thing to learn from a settle scene, so it gets its own
section. *Latched finals* means every state in the resting frame is a fixed
end-value with no time dependence. Here the only `t`-driven things are the
camera ease (which clamps constant after 1.9s) and the run's beats (which all
complete by ~7.95s and, crucially, **never revert** — the `*Done` booleans are
one-way thresholds, `badgeGreen` has no falling leg, no row dips back to
template). So from ~8s onward the scene is a genuinely static image: green at
every node, the last reply hanging resolved.

Why does that matter? **Because narration is written and recorded *after* the
visuals lock, and the scene has to stretch to fit it.** The choreography notes
peg this scene's hold at ≈7.95 → 14.9s — about **7 seconds** of held frame, the
window the closing voiceover plays over. When the VO comes in it might run 5
seconds or 11; the scene has to hold for however long the words take. A scene
whose final state is *static* can be extended to any length safely — you're just
holding a still frame longer, and nothing is mid-animation to freeze awkwardly.
If instead this scene ended on something still moving (a pulse looping, a ring
oscillating, a badge green that decays), you couldn't extend it without catching
that motion at a random phase. Latched finals make the audio step downstream
*painless* — every boundary in this build stayed pixel-stable through vo-sync
precisely because every hold is extend-only by construction.

> *"Is this the same property scene 1 ends on?"* Yes — and it's not a
> coincidence that the *first* and *last* scenes both end on a latched hold.
> Both are the scenes most likely to get stretched to fit narration (the open
> invites the viewer in; the close lets the thesis land), and both earn the right
> to be static because the frame itself is the payload. The rule generalizes: any
> scene that ends on a hold should end on a *latched* hold, so the hold is a
> value, not a paused motion. What makes scene 6 unusual is that it latches a
> frame mid-*run* — the run completes and freezes rather than reverting — which
> only works because the completed run *is* the thesis image.

## The honest weakness of a bookend — name it

A bookend has a real, frank tension, and you should understand it rather than
pretend it away: **a long static hold risks being dead air.** This scene holds
dead still from ~8s to ~14.9s — about seven seconds of an unchanging frame. The
choreography notes say it plainly: the hold is "earned (it's the thesis-image:
five callers, the chain, the partner, everything green) but ambient-dead — the
per-element green rings hold statically. The VO is delivering the closing
argument over it, which is what saves it."

So why does the scene carry it? Two reasons, and it's worth being precise:

1. **The frame is the payoff.** This isn't a transition holding for a beat —
   it's the *resolved thesis* of the whole video. The one agent from scene 1 is
   now wired into five callers and one partner, a single run has just proven it
   serves *and* consumes, and every node is green. A viewer's eye genuinely wants
   a moment to read the completed economy (five badges, two directions, the green
   walk is real information), and the narration plays over exactly this hold to
   deliver the closing line. The stillness is the space for the idea to land.

2. **The video earned its ranking on the *middle*.** This build was the
   batch's BEST NARRATION pick for the hype cut — the diversity is in the run
   seen at five scales (baseline, one stranger, the rush, the flip, the fusion),
   each a different beat shape. A bookend doesn't need to be dynamic; it needs to
   be *calm*, because calm is the correct register for "we're done." The
   dynamism already happened; the bookend's contribution is the opposite — a
   place to rest after it.

That said — don't launder the weakness into a virtue. It *is* a long ambient-dead
hold, and the honest improvement (named in the notes) is a low-amplitude shimmer
that keeps the frame alive without breaking the latched-final property: something
that animates but always returns to the same end-state, so the hold stays
extend-safe. The taste lesson is: ship the calm bookend, but know that "calm"
and "dead" sit a hair apart, and the line between them is whether the frame is
worth seven seconds of looking. Here it is — because it's the payoff, and
because the VO is actively naming it. On a weaker frame it wouldn't be.

## How to think about the whole scene

Walk the decisions in order and you can see the bookend's logic:

1. *What state do I show?* The full assembled ecosystem scene 5 left — read
   through the same `<EconomyRig/>`, every actor at reveal 1.
2. *What's allowed to move first?* Only the camera, once, as a *release* — a
   ~7% ease-back that reframes the chain as one node in a web, finished before
   any action so the move never competes.
3. *What's the one new thing?* A single run that carries *both* directions —
   inbound from Claude Code, outbound to the partner *nested inside the live
   window* — so "tool and tool-user" reads as one breath, not two beats.
4. *In what order does it resolve?* Strictly causal, and green-stamped in that
   order: entry → Agent → Response → caller — the state walks the data's path.
5. *How do I close the arc?* Don't revert. Freeze the run at completion, every
   node green, the reply home — the one agent from scene 1 now visibly part of
   an economy.
6. *How do I survive narration?* Latched finals → a static held frame that
   stretches to any length without freezing a motion mid-flight.
7. *What's the honest cost?* A ~7s ambient-dead hold — carried by the fact that
   the frame is the resolved thesis and the VO is naming it, not by any motion.

There's no clever new move in this scene — and there shouldn't be. The craft of
this bookend is *fusion and restraint*: quoting the run grammar the viewer
already knows, joining its two directions for the first and only time, and then
trusting the green frame. The quality is in the causal ordering, the
single-earned camera move, and the continuity — that the last frame is provably
the same set piece as the first, now whole.

## Exit state (this is the final frame of the video)

`camera eased back ~7% (s = 0.93) and held · entry = API, green ok · Agent
"Scout" green ok · Response green ok, brief = "dev platform" · Claude Code badge
latched green · four other client badges present, inert · five spokes drawn ·
partner server present (its green flash decayed) · partner spoke drawn ·
pricing_intel chip on the Tools row · research_competitor pill above the entry ·
no revert, nothing in flight`.

Nothing inherits this — it's where the video ends. But it is, by construction,
the answer to scene 1's frame: the same Scout chain, now wired into five callers
and one partner, having just run a call that arrived *and* reached out in the
same breath, every node green. The arc is closed because the last frame and the
first are the same object — one agent you built — seen at the two ends of one
idea: deploy it, and it becomes a tool in an economy of agents calling agents.
