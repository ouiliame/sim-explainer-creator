# Scene 4 — `inside-the-call`  ·  archetype: **freeze-cut continuation + expand-beneath + run** (the accepted cut)

Source: `../source/scenes/InsideTheCallScene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`. The original zoom-through take is annotated
separately in `04b-inside-the-call-v1.md` — read both; the diff is the lesson.

This is the mechanistic centerpiece and the longest scene (visual min 14s; VO
18.6s). It opens *inside* scene 3's frozen moment, then shows what the parked run
is waiting for: the child workflow running, end to end, with the handed-off value
as its `start.input`. It is the middle third of the one continuous run.

---

## What this scene is for

One idea: **inside the block, the child runs the whole way — and the value you
passed IS its `start.input`.** The viewer already knows (scene 1) what the child
*is* and (scene 3) that the parent parked on the block holding `I want a refund`.
This scene connects them: the held value arrives at the child's Start, the child
runs its own full run, and produces `"billing"`. The crucial thing it must show
is **simultaneity** — the parent call is still parked above while the child runs
below; the run hasn't *left* the parent, it's *inside* it.

## What it looks like

Opening on scene 3's frozen frame, the parent chain glides up and holds near the
top, its Workflow block ring still live. Beneath it, a bordered container panel —
headed with the Workflow block's indigo chip and the child's name — expands
downward from the block on a thin stem. Inside the panel, the child chain from
scene 1 runs: the value dips into the child Start, pulses cross, the child Agent
goes live, `Classify <start.input>` resolves to `I want a refund`,
`<agent.content>` resolves to `"billing"`, and the three child blocks settle
green. The call above never moves. The completed child holds.

## The real decisions — why expand-beneath, not zoom-through

The original take (v1) pushed the camera *through* the Workflow block until the
child canvas filled the frame. The director revised it to this: the parent stays
on screen, glides up, and the child runs in a panel *beneath* the still-live
call. Why the revision is the better teach:

> A push-*through* implies you **leave** the parent to go look at the child. But
> the parent run hasn't gone anywhere — it's parked, waiting. The whole concept is
> *sequential containment*: parent paused, child running, parent still there. The
> zoom-through hides exactly the thing you're trying to teach (that the parent is
> *waiting* while this happens). Keeping the halted call on screen the entire time,
> with the child running visibly underneath it on a stem from the block, shows the
> simultaneity. The viewer can see both tiers at once: "the run is waiting up
> there; down here is what it's waiting for."

The structure:

```tsx
const raise  = c(0.7, 2.1, EASING.inOut);  // parent glides up
const expand = c(1.1, 2.5, EASING.out);    // panel + stem grow down

<InsideStem  raise={raise} expand={expand} />
<InsidePanel expand={expand}>
  <ChildChain ... />            {/* the SAME child chain, re-staged at 0.8x in the panel */}
  <WirePulse ... /> <WirePulse ... />
</InsidePanel>

{/* the halted call — never fades, never stops being live */}
<div style={{transform: `translateY(${-RAISE_DY * raise}px)`}}>
  <ParentChain wf={{highlighted: true}} inputMix={1} iv={{mix: 1}} ... />
</div>
```

Three things to take:

**The parent never re-layouts — it's the same `ParentChain`, just translated up**
by `-RAISE_DY * raise` (300px when fully raised). Its Workflow block stays
`highlighted: true` and its rows stay resolved (`inputMix={1}`, `iv={{mix:1}}`) —
i.e. it holds *exactly* the frozen state scene 3 ended on, just slid upward. The
freeze-cut continuity is preserved because the parent is literally the same
component in the same state; only its `translateY` changes.

**The child is the same `ChildChain`, re-staged in the panel.** `InsidePanel`
renders the child at identity coordinates and transforms it into the panel body
at `CHILD_SCALE` (0.8×). It is not a redrawn mini-chain — it's the scene-1 chain,
running. So the value resolving into its Start *is* the same workflow the viewer
watched, now receiving the parent's input.

**The stem carries the containment.** `InsideStem` draws a 2.25px line from the
block's bottom edge to the panel header, growing with `expand`. Without it the
panel would read as "a popup appeared"; with it, the panel reads as "the block
opened to show its inside." Small element, load-bearing meaning.

## The values, and where they come from

This scene **owns** the child's run values (deferred from scene 1):

| row | resolves to | source |
|---|---|---|
| child Start `Inputs` (`inputMix`) | `I want a refund` | the handoff — same value the parent held |
| child Agent `Messages` (`msg`) | `Classify <start.input>` → `I want a refund` | CLASSIFY workflow agent row |
| child Response `Response Data` (`resp`) | `<agent.content>` → `"billing"` | canon classification of this input |

`I want a refund` and `"billing"` per `grounding-v1.md`.

## The animation, beat by beat

`c(lo, hi, easing?)`: the camera/panel moves get easing; run mechanics are linear.

### (a) Open the panel — `raise = c(0.7, 2.1, EASING.inOut)`, `expand = c(1.1, 2.5, EASING.out)`

A short beat of the frozen frame (to 0.7s — confirming we're inside scene 3's
held moment), then the parent glides up over **0.7–2.1s** (ease-in-out — a camera
move) while the panel expands down over **1.1–2.5s** (ease-out — a thing
arriving). The panel starts (1.1s) *after* the raise begins (0.7s) so the block
visibly lifts before its inside opens beneath it.

> *"Why hold the frozen frame for 0.7s at the open?"* That's the freeze-cut seam.
> The viewer's eye needs to confirm "this is the same frame scene 3 ended on"
> before anything moves, or the continuity is wasted. Move on frame 1 and the
> held state never registers as held.

### (b) The child runs — the familiar choreography, 3.6–7.0s

The child run reuses scene 1's exact cadence (so it reads as "the same workflow
running"):

- `inputMix = c(3.6, 4.0)` — value dips into child Start; child Start blips
  **3.9–4.4s**
- `pulse1 = c(4.3, 4.95)` — crosses to child Agent
- child Agent live **4.9–5.7s**; `msgGlow = c(4.85,5.1)*(1 - c(5.5,5.8))`,
  `msgMix = c(5.1,5.5)` — `Classify <start.input>` resolves
- `pulse2 = c(5.7, 6.35)` — crosses to child Response
- child Response blip **6.5–7.0s**; `respGlow = c(6.3,6.55)*(1 - c(6.95,7.25))`,
  `respMix = c(6.55,6.95)` — `<agent.content>` resolves to `"billing"`

> *"Why does the run wait until 3.6s to start when the panel is open by 2.5s?"*
> The same give-each-idea-air discipline. Beats 1–2.5s are "the block opens to
> reveal the child." If the child started running the instant the panel finished
> opening, the viewer couldn't separate "here's the inside" from "the inside is
> running." A ~1s beat of the static open child lets "this is the workflow you
> know, now inside the block" land before it runs.
>
> *"Why the same glow/resolve windows as scene 3's handoff?"* Consistency is the
> point — every resolution in the video uses the identical `ResolvedTag` grammar
> (glow on pulse-land, resolve in place, glow fades to residue). The child's two
> resolutions here are the same gesture the parent's `Input Variable` did in
> scene 3, so the viewer reads them without re-learning.

### (c) Settle green and hold — `startOk t≥7.6`, `agentOk t≥8.0`, `respOk t≥8.4`

The three child blocks flip to `ok` (green) in causal order — **7.6 / 8.0 / 8.4s**
— a 0.4s stagger, and **hold**. From 8.4s to scene end the completed green child
sits in the panel; the parent call still holds live above it.

> *"Why hold the completed child instead of moving on?"* Because this is another
> freeze-cut — scene 5 opens on this exact two-tier completed frame and pulls the
> result back up. The child finishing but the *parent block still live* is the
> precise state scene 5 inherits: the answer exists below, the parent hasn't
> received it yet. The green-stagger (7.6/8.0/8.4) reads as "the run completed in
> order," and freezing on it sets scene 5's "now it comes back."

## How to think about the whole scene

1. *How do I show what the parked run is waiting for?* Open the block's inside
   *beneath* the held call → both tiers visible, simultaneity shown.
2. *Why not zoom through?* Zooming through implies leaving the parent; the parent
   is *waiting*, not gone → keep it on screen.
3. *How do I prove the handed value is the child's start.input?* The same held
   value dips into the child's Start → the handoff completes inside.
4. *How do I make the child read as the known workflow?* It's the literal scene-1
   `ChildChain`, same run cadence → recognition.
5. *How do I end?* Completed green child, parent still live → freeze-cut into
   scene 5's return.

## Exit state (what scene 5 inherits — a freeze-cut boundary)

`parent raised, Workflow block ring still live · panel open beneath on its stem ·
child fully resolved (Inputs = "I want a refund", Messages resolved, Response
Data = "billing") · all three child blocks ok-green · no pulse in flight`. Scene
5 opens on this exact two-tier frame and retracts the panel.
