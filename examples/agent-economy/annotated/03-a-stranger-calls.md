# Scene 3 — `a-stranger-calls`  ·  archetype: **run**

Source: `../source/scenes/AStrangerCallsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`,
`../source/script-v1.md` (scene 3).

This is the fourth scene of the video and the one that lands the whole thesis.
Scene 1 ran the chain because *you* pressed run. Scene 2 deployed it — gave it a
tool name and an address. This scene is the first time the chain runs because
**someone outside the frame called it.** Read it as a worked example of an
*inbound call*: who's calling, how the call arrives, and how you show "a stranger
drove your agent" without a single word on screen.

---

## What this scene is for

The video's spine is "deploy a workflow as an MCP tool and it becomes
infrastructure other agents call." Scene 2 made the deployment real (the pill).
This scene has to make the *consequence* real: a caller you've never met sends a
request, and the exact same chain — same blocks, same wires, same resolution
beats — runs end to end. The teaching move is a **rhyme**: this run must look
identical to scene 1's editor run, beat for beat, so the viewer's own eyes
conclude "oh — a stranger's call is just a run." Nothing on screen says that;
the recognition does the work.

So the rule the scene follows is *one idea per scene*: this scene is "an outside
caller invokes the deployed agent," full stop. It does not introduce the second
caller, or the crowd, or the outbound direction — those are scenes 4, 5, 6. The
one new thing here is **the caller**: a badge at the left edge, a spoke into the
entry, a round trip. Everything else is quoted from scene 1.

## What it looks like

The deployed Scout chain sits center-frame exactly where scene 2 left it (entry
= API, the MCP pill above it). A client badge — **Claude Desktop** — springs in
at the left edge, in the middle slot. A spoke draws from the badge to the entry's
target handle. The badge's ring goes **blue** (its call is in flight), a light
pulse rides the spoke *in*, `Northwind AI` resolves into the Input row, and the
chain runs the full scene-1 grammar (start blip, pulse down edge 1, the Agent
goes live, `<start.input>` resolves, pulse down edge 2, the brief resolves in the
Response). Then a reply pulse rides the **same spoke back**, the badge flashes
**green**, the rows revert to template — and the badge and its spoke **stay**.

## The one real decision: quote scene 1's run verbatim, only change the origin

The scene renders the one set piece and feeds it almost the same props scene 1
did. The single structural difference is everything to do with the caller:

```tsx
<EconomyRig
  entryMix={1}                                   // deployed: header is API, not Start
  entry={{highlighted: call.startBlip}}
  agent={{highlighted: call.midLive}}
  response={{highlighted: call.respBlip}}
  pill={{reveal: 1}}                             // the pill from scene 2, still on
  showInHandle={t >= 2.2}                        // the target handle the spoke points at
  badges={{[SLOT_CLAUDE_DESKTOP]: {reveal, blue, green}}}
  spokes={{[SLOT_CLAUDE_DESKTOP]: {progress: spokeDraw}}}
  inputResolve={{text: "Northwind AI", mix: call.inputMix}}
  msgResolve={{text: "Northwind AI", mix: call.msgMix}}
  respResolve={{text: '"agent platform"', mix: call.respMix}}
/>
```

Three things to take from this.

**The run beats come from the same generator scene 1 used.** Scene 1 called
`runBeats(t, 3.6, {hold: 1.0})`. This scene calls `mcpCall(t, 3.4)`, and
`mcpCall` is *a wrapper around `runBeats`* — it runs `runBeats(t, a, {hold: 1.1,
...})` internally and adds the round-trip beats (`spokeIn`, `reply`,
`badgeBlue`, `badgeGreen`) on top. So `call.startBlip`, `call.midLive`,
`call.pulse1`, `call.respMix` are *literally the same function output* as scene
1's `run.*`, just anchored 0.2s earlier. The rhyme isn't approximate; the run is
the same code.

> *"Why reuse the generator instead of re-timing the run by hand?"* Because
> "a stranger's call is just a run" is the lesson, and the cleanest way to *prove*
> two things are the same is to build them from the same source. If this scene
> hand-rolled its own slightly-different run timing, the rhyme would be fuzzy —
> the viewer might feel a difference they can't name. Sharing `runBeats`
> guarantees the inner chain is pixel-for-pixel the scene-1 run; only the
> envelope (the caller arriving and being replied to) is new.

**`entryMix={1}` and `pill={{reveal: 1}}` are not animations — they're inherited
state.** The entry is fully morphed to API and the pill is fully present from the
first frame of this scene, because scene 2 ended there. They're held constant the
whole scene. This is the deployed state the scene runs *on top of*.

**Render the whole set piece; turn on exactly one badge.** The rig knows about
five client slots and a partner server. This scene mounts the full rig and
populates a single badge slot (`SLOT_CLAUDE_DESKTOP`) and a single spoke. The
other four slots are simply absent from the `badges`/`spokes` objects, so the rig
renders nothing for them — but they're *available*, which is what lets scene 4
add four more without any relayout.

> *"Why Claude Desktop, and why the middle slot?"* The client list is the
> product's real MCP-client picker, in product order: Cursor · Claude Code ·
> Claude Desktop · VS Code · Sim (`SLOT_CLAUDE_DESKTOP = 2`, the middle of five).
> Picking the middle slot is deliberate staging for the *next* scene: when the
> rush adds the other four, they bloom symmetrically above and below this one
> (`badgeCenterY(slot) = CHAIN_EDGE_Y + (slot − 2) * 150` — slot 2 sits exactly
> on the chain's edge-Y, and the others fan ±150px around it). Start the lone
> caller in the center and the crowd grows balanced around it; start it at an end
> and scene 4 would have to grow lopsided. Which client it is, is grounded — it's
> the third entry in the product's real picker list — not chosen for the brand.

## The values, and where every one comes from

Every on-screen string traces to `grounding-v1.md`:

| Surface | Value | Provenance |
|---|---|---|
| Input row | `Northwind AI` | invented Scout corpus — Claude Desktop's input |
| Messages tag resolves to | `Northwind AI` | the same input, echoed where `<start.input>` was |
| Response brief | `"agent platform"` | invented Scout corpus — Northwind AI's brief |
| Entry header | `API` | block registry `api_trigger.ts` (`#2F55FF`), inherited from scene 2 |
| Pill | `research_competitor · sim.ai/api/mcp/serve/…` | real URL shape, lowercase-underscore tool-name rule |
| Badge | `Claude Desktop` + Anthropic mark on clay `#D97757` | product MCP-client list; mark ported, chip color declared deviation |

> *"Why does the Input say `Northwind AI` and not the editor's `Vantra Labs`?"*
> Because the caller is different, and the input is the caller's. Scene 1's editor
> typed `Vantra Labs`; this scene's stranger passes `Northwind AI`. Changing
> exactly one thing — the input value — between two otherwise-identical runs is
> how you show "different caller, same machine." The brief that comes back
> (`"agent platform"`) is Northwind's, not Vantra's. The pair is grounded as a
> matched set in the corpus.

> *"Why is the Messages tag fed the same string as the Input?"* Because the
> Agent's Messages row is literally `Research <start.input>` — the tag
> `<start.input>` *is* a reference to the entry's input. When the input is
> `Northwind AI`, resolving `<start.input>` must produce `Northwind AI`. Feeding
> `msgResolve` the same text isn't redundancy; it's the reference system being
> honest. The Response brief differs because `<scout.content>` is a *different*
> reference — the agent's output, not its input.

## The choreography — `mcpCall(t, 3.4)`, beat by beat

The anchor is `a = 3.4`. Everything below is `t` in seconds into the scene, read
straight off the `interpolate` windows in `mcpCall` (and the `runBeats` grammar
it wraps). The clamp helper `c(t, lo, hi, l2=0, h2=1)` ramps `l2→h2` as `t`
crosses `lo→hi` and holds outside.

The whole call decomposes into three phases: **the caller arrives** (badge,
spoke), **the call comes in and the chain runs** (the scene-1 rhyme), **the reply
goes home** (return pulse, green). Read them in that order.

### (a) The badge springs in — `badgeReveal = popIn(frame, fps, 0.7)`

The Claude Desktop badge enters on the one shared entrance spring: `popIn` is a
0.6s spring (damping 14, stiffness 160) delayed 0.7s, scaling the card `0.82 → 1`
with a slight organic overshoot, opacity ramping in at `min(1, reveal*1.6)`.

> *"Why `popIn` and not a fade?"* Because every badge in the video enters with
> this exact spring — it's the house "a new actor joined" gesture. Using the same
> spring for the lone caller here and the four callers in scene 4 makes them read
> as the same *kind* of thing arriving. The slight overshoot gives the badge a
> physical "pop onto the canvas" feel that a flat fade wouldn't; these are
> objects landing in a workspace, not labels fading up.

> *"Why delay it 0.7s instead of springing at t=0?"* The scene opens on the
> settled deployed state inherited from scene 2 — the viewer needs a beat to
> register "we're still on the same chain" before a new element appears. Spring at
> t=0 and the boundary into this scene would have a moving element on the very
> first frame, which fights the continuity (scene 2's exit is static). A short
> still beat, *then* the caller arrives.

### (b) The spoke draws on — `spokeDraw = interpolate(t, [1.5, 2.2], [0, 1], EASING.out)`

After the badge lands, its spoke draws from the badge's right edge to the entry's
target handle over **1.5s → 2.2s**, eased out. The spoke is
`spokePath(SLOT_CLAUDE_DESKTOP)` — a smooth-step (rounded-elbow) edge in the same
visual language as the chain's own wires (`simEdgeD` geometry,
`SPOKE_X1 = 292 → SPOKE_X2 = 388`, from `badgeCenterY(2)` to `CHAIN_EDGE_Y`).

> *"Why does the spoke wait for the badge (0.7s spring) before drawing
> (starts 1.5s)?"* Cause before effect: the actor exists, *then* it connects.
> Drawing the wire while the badge is still springing in would blur "a thing
> arrived" and "it wired itself up" into one mushy moment. Let the badge land
> (~1.3s), hold a hair, then run the wire out to the chain. Two beats, ~0.8s
> apart, each legible.

> *"Why `EASING.out` on the draw but a spring on the badge?"* The badge is a
> discrete object landing — a spring's overshoot suits "it arrives." The spoke is
> a line *extending* through space toward a target — an ease-out (fast start,
> gentle settle into the handle) suits "it reaches and connects." The series uses
> ease-out for every wire draw-on; this is that convention.

### (c) The target handle materializes on contact — `showInHandle={t >= 2.2}`

The entry's target handle (the little socket the spoke plugs into) appears at
**exactly `t = 2.2`** — the same instant `spokeDraw` reaches 1.

> *"Why gate the handle to the frame the spoke finishes?"* So the wire never
> points at nothing. If the handle were always present, the spoke would draw
> toward a visible socket before connecting — fine, but slightly less satisfying.
> If the handle appeared *late*, the spoke would briefly terminate in empty space.
> Materializing it on contact (`t >= 2.2` is the same `2.2` that ends the draw)
> makes the connection read as a *plug-in*: the socket exists because the wire
> just reached it. This is the "handle-on-contact" move the choreography names.

> *"Why a hard boolean (`t >= 2.2`) instead of a fade?"* The handle is a tiny
> structural dot, not a focal element — a fade on it would be invisible at this
> scale and would only risk a half-rendered handle on some frame. A clean
> appear-on-contact is correct for a sub-pixel-budget element. (Scene 1 had no
> caller, so its entry rendered `hideTargetHandle` — there was nothing to plug in.
> The handle is *part of the caller story*, which is why it's gated on the spoke.)

### (d) The badge lights blue — `call.badgeBlue`, up over `[2.4, 2.7]`

The badge's ring goes blue (a `0 0 0 2.5px rgba(51,180,255,…)` box-shadow ring,
the product's selection-blue) over **2.4s → 2.7s** — *before* its pulse departs.
`badgeBlue` is `min(c(t, 2.4, 2.7), c(t, 6.4, 6.7, 1→0))`: it rises here, holds
through the whole call, and falls as the reply launches (phase (i)).

> *"Why does the badge light 0.3s before the pulse leaves (pulse starts 2.7)?"*
> Intent precedes packet. The blue ring means "this caller's call is in flight" —
> the *decision to call* lights up, then the call physically departs down the
> spoke. Lighting them simultaneously would lose that the badge is the *origin*;
> the 0.3s lead makes the badge the cause and the pulse its consequence. It's the
> same logic as a button highlighting on press before the request fires.

### (e) The call rides the spoke in — `call.spokeIn`, `[2.7, 3.35]`

A light pulse (`PathPulse`, the same blue streak as the chain's `WirePulse` but
on an arbitrary path) travels the spoke from badge to entry over **2.7s → 3.35s**.
It's drawn with `<PathPulse d={spoke.d} len={spoke.len} p={call.spokeIn} />`.

> *"Why does the inbound pulse end at 3.35, and the input dip start at 3.4?"*
> That 0.05s gap is the point: `spokeIn` ends at `a − 0.05` and `inputMix` starts
> at `a`. The pulse *arrives at the entry* the very frame the Input row *begins
> resolving* `Northwind AI`. Two surfaces — the wire and the row — show one event:
> the request lands, and the value appears where it landed. This is the
> "two-surface sync" that makes the call feel like a single physical thing rather
> than two unrelated animations. Cause and effect are welded by construction.

### (f) The chain runs — the scene-1 rhyme, `[3.4 → 6.2]`

From here the inner run is `runBeats(t, 3.4)`, identical in shape to scene 1's
`runBeats(t, 3.6)`. In order:

- **`inputMix` dip `[3.4, 3.75]`** — `Northwind AI` dip-swaps into the Input row
  (`DipSwap` fades through the midpoint, no layout pop).
- **`startBlip` ring `3.65 → 4.15`** — the entry gets the product's selection ring
  (the request hit the trigger).
- **`pulse1` `[3.9, 4.55]`** — a `WirePulse` rides edge 1 (entry → Agent),
  `len={55}`.
- **`midLive` ring `4.5 → 5.2`** — the Agent "Scout" goes live (highlighted) for
  0.7s (the default `midDur`). This is the agent *working*.
- **`msgMix` `[4.45, 4.85]`** — `<start.input>` resolves to `Northwind AI` inside
  the Messages row. It resolves the moment `pulse1` reaches the Agent (`pulse1`
  arrives ~4.55; the tag fills as the packet lands — cause precedes effect).
- **`pulse2` `[5.2, 5.85]`** — a `WirePulse` rides edge 2 (Agent → Response).
- **`respMix` `[5.85, 6.2]`** — `<scout.content>` resolves to `"agent platform"`
  inside the Response Data template (`{ "brief": … }`, Status `200`).

> *"Why no Search-chip ring here, when scene 1 had one?"* Scene 1's job was to
> *teach* the run, so it showed the agent calling its tool (the Search chip rang
> inside the live window — "while working, it called a tool"). This scene is
> *quoting* the run, and quoting it tighter — the lesson here is the **origin**
> (a stranger), not the internals. Re-showing the tool-call would re-spend
> attention on something already taught and pull focus off the badge/spoke story.
> The omission is editorial economy: show only the new idea, trust the rhyme to
> carry the rest. (The `Search`/`Docs` chips are still *on* the Agent block, just
> not ringing — the chain is visibly the same chain.)

> *"Why anchor at 3.4 rather than scene 1's 3.6?"* Because this scene front-loads
> the caller arrival (badge 0.7s, spoke 1.5–2.2s, blue 2.4s, pulse-in 2.7–3.35s).
> Anchoring the run 0.2s earlier lets the inbound pulse hand straight off into the
> input dip with no dead gap — the call arrives and the chain *immediately* picks
> it up. The 0.2s shift doesn't disturb the rhyme; the run's internal spacing is
> untouched, only its start moved.

### (g) The reply rides the same spoke back — `call.reply`, `[6.4, 7.05]`

After the Response resolves, a pulse rides the **identical spoke path in
reverse** — `<PathPulse d={spoke.d} len={spoke.len} p={call.reply} reverse />`.
`reverse` plays the dash-offset target→source, so the same geometry now carries
light *out* to the caller over **6.4s → 7.05s**. `replyStart = respStart + 0.55
= 5.85 + 0.55 = 6.4`.

> *"Why does the reply go BACK to the caller instead of out a right-hand stub?"*
> Because that's how MCP works: the result returns to the client that called.
> Module-6's deploy video used an out-stub to the right (the response leaving "the
> other side"), but for an MCP call the response goes home to the caller. The
> script's batch-assumption #3 takes this deviation deliberately — replies return
> to callers, no inbound out-stub — because it's product-true. Reusing the *same
> path* (forward `PathPulse`, then `reverse` on identical `d` and `len`) is what
> makes "it went back the way it came" unmistakable. A different return path would
> imply a different channel.

> *"Why 0.55s after the Response resolves, not immediately?"* `respMix` finishes
> dipping at ~6.2; the reply launches at 6.4. That ~0.2s beat lets the brief
> *land and be seen* before the result departs — you read `"agent platform"` in
> the Response, *then* it ships back. Launching the reply the instant the value
> appears would step on the resolution.

### (h) The badge flashes green — `call.badgeGreen`, up `[6.95, 7.2]`, decays `[8.05, 8.65]`

As the reply pulse arrives home (~7.05), the badge's ring flashes **green** (the
product's ok-green, `rgba(34,197,94,…)`): up over **6.95 → 7.2** (a ~0.25s
flash), holds ~0.85s, then decays over **8.05 → 8.65**. `badgeGreen` is
`min(c(t, 6.95, 7.2), c(t, 8.05, 8.65, 1→0))`.

> *"Why green, and why does it land as the reply arrives?"* Green is "succeeded"
> in the product's language — the call completed and the result came back. Timing
> the green flash to the reply's *arrival* (replyEnd ≈ 7.05; green peaks 7.2)
> makes the badge's state the *consequence* of the reply landing: the result got
> home, so the caller is now satisfied (green). The blue (call in flight) → green
> (reply received) arc is the caller's whole story in two ring colors, no words.

> *"Why does blue fade exactly as the reply launches (`[6.4, 6.7]`)?"* So the
> badge is never blue-and-green at once. Blue means "my call is out"; the moment
> the reply *departs back toward me* (6.4), the call is no longer purely outbound,
> so blue retires — and ~0.55s later green confirms arrival. The two rings
> hand off cleanly: a brief unringed beat between them, never an overlap.

### (i) Rows revert; the caller stays — revert `[7.3, 7.65]`

The run's resolutions revert together over **7.3s → 7.65s** (`respStart + 0.35 +
hold = 5.85 + 0.35 + 1.1 = 7.3`, a 0.35s dip back to template). The Input,
Messages, and Response rows return to `Company name` / `Research <start.input>` /
`{ "brief": <scout.content> }`. But the **badge and spoke do not revert** —
they're held at `reveal: 1` and `progress: 1` for the rest of the scene.

> *"Why revert the rows but keep the badge?"* Because they mean different things.
> The row values were *this call's* transient data — once the call is done, the
> chain returns to its idle template, ready for the next caller (true to the
> product: a deployed tool doesn't keep the last request's values pinned). The
> badge and spoke are *structural* — the connection between this client and your
> server is now a permanent fact of the world. This is "residue accumulation": the
> world only grows. The viewer should feel that after this scene there is
> *permanently one more caller* wired in, which is exactly what scene 4 builds on.

### (j) The hold — ~7.65s to the end of the scene

After the revert and the green decay (done by 8.65), nothing moves but the
ambient `CanvasDots` texture. The frame rests on **deployed-state-B**: the chain
idle, the pill on, Claude Desktop wired in.

> *"Isn't a ~3-4s still frame dead air?"* It's borderline — the choreography
> flags this hold (≈7.65→11.6s) as right at the 3s ambient-motion cap, carried by
> narration. The reason it's allowed: this scene's tail is where the voiceover
> reads, and the scene must be able to *stretch* to fit it (the comp VO-stretches
> scene 3 to 11.6s per the manifest). A scene that ends on a settled state can be
> extended to any length safely — there's no animation mid-flight to freeze. The
> green having fully decayed before the hold begins matters: the badge rests in
> its neutral wired-in state, which is also exactly the state scene 4 inherits.

## How to think about the whole scene

Walk the decisions in order and each one answers a question:

1. *What's new vs scene 1?* Only the **caller** → reuse `runBeats` for the inner
   run, add the round trip around it.
2. *How do I prove "a stranger's call is just a run"?* Build the run from the
   **same generator** scene 1 used → the rhyme is exact, not approximate.
3. *Who's calling, and where do they sit?* The product's real MCP-client list,
   **middle slot** → grounded, and staged so scene 4 grows symmetrically.
4. *How does a caller arrive?* Badge springs in (`popIn`), *then* its spoke draws
   → actor before connection, two legible beats.
5. *How does the wire avoid pointing at nothing?* Target handle materializes the
   frame the spoke lands → handle-on-contact.
6. *How do I weld "call arrives" to "value appears"?* Inbound pulse ends at
   `a−0.05`, input dip starts at `a` → one event on two surfaces.
7. *How does the result get home?* Same spoke, **reversed** → product-true MCP
   return, unmistakable because the path is identical.
8. *How do I narrate the caller's state without words?* Blue ring (in flight) →
   green flash (reply received), handing off cleanly.
9. *What persists?* Rows revert, **badge + spoke stay** → residue; the world is
   permanently bigger.

There's no clever single move — the scene is the scene-1 run with a caller
wrapped around it, and the quality is in getting the *wrapper's* nine small
timings right so the inbound call reads as one continuous physical event.

## Exit state (what scene 4 inherits)

`deployed-state-B: chain idle (rows reverted to template by 7.65s) · entry = API ·
pill on · Claude Desktop badge present (slot 2, reveal 1) · its spoke drawn
(progress 1) · badge rings off (green decayed by 8.65s) · camera static`. Scene 4
opens on exactly this frame and pops four more badges in *around* this one (slots
0, 1, 3, 4), each with its own spoke — the lone caller becomes a crowd with no
relayout, because the middle slot was chosen for exactly this growth. Both scenes
render the same set piece, so the boundary is identical down to the pixel.
