# Scene 6 — `the-brief-comes-back`  ·  archetype: **result resolves**

Source: `../source/scenes/TheBriefComesBackScene.tsx`, `../source/layout.ts`,
`../source/scenes/_rig.tsx`.

This is the scene where the run *closes* — where everything the agent went out
and captured turns into the one thing the workflow was built to produce: the
brief. Scenes 3–5 were the reaching-out (find, read, act); each came back as a
card in the rail. Scene 6 is the reaching-*in*: the agent re-reads its own
evidence, assembles an answer, and resolves it into the Response block. Read it
as the worked example for "how do I land a result honestly" — because the whole
discipline here is making the answer appear *where it lives* (a real block row,
never a floating chip) and closing the run in the exact causal order the product
would close it.

---

## What this scene is for

The video's single run has been mid-flight since scene 3 — the agent's blue
live ring has held across three scene boundaries while it searched, read, and
clicked. Scene 6 is where that run finally **completes**. Its job is to draw the
closing half of the equation the whole video teaches: the evidence the rail
accumulated isn't just a pile of receipts — it *feeds one answer*. So the scene
has two halves, in order: first the agent **consults** its evidence (the four
cards glow in call order, as if being re-read), then the run **resolves** down
the chain (Research goes green, control crosses the last wire, Response reads
`<research.content>` and settles green too).

The rule is still *one idea per scene*: the idea is "the captured evidence
becomes the brief." Everything in the scene serves that one sentence — the
glow-wave is "consulting the evidence," the green cascade is "the answer is
assembled and handed off." No new tool, no new card, no re-run. The rail is
already complete when this scene opens; this scene spends it.

## What it looks like

The whole set piece is on screen at static framing — the three-block chain
above the four-card rail, the agent still wearing its blue live ring carried in
from scene 5. The four evidence cards light up selection-blue one after another,
top-left to bottom-right, a wave rolling down the rail rather than four separate
blinks. As the last glow fades, the agent's live ring flips from blue to green —
the run's spine finally releasing after three scenes. A streak of light crosses
the last wire into Response; Response goes live, its `Data` row's
`<research.content>` reference glows as it's read, and then Response itself
settles green. The chain is now all-green, the rail full — and that all-green
frame **holds through the cut** into the bookend.

## The result-resolves grammar — read this before the beats

This scene is the payoff of the run grammar scenes 3–5 set up, so it's worth
stating the three rules it obeys, because they're what keep the resolution
honest:

1. **The result resolves *in place*, in the block row where it lives — never as
   a floating chip.** When the brief "comes back," it does not drift down a wire
   or pop up as a card hovering over the canvas. It appears in the Response
   block's `Data` row, as the value of `<research.content>`, because that is
   where a Sim agent's output actually resolves. The brief lives in a row, so
   that's where it lights.
2. **State is the product's own ring color, never a word.** Blue ring = running,
   green ring = done. The run closing is three rings going green in sequence —
   Start, Research, Response — never the word `COMPLETE` stamped anywhere.
3. **A `WirePulse` carries light, not cargo.** The streak crossing the last edge
   means "control passed from the agent to Response," full stop. The *value*
   (the brief) doesn't ride the wire; it resolves in Response's row, by
   reference, the instant control lands there.

If you hold those three, the scene decodes cleanly: the cards glowing is the
agent *reading* what it has; the ring cascade is the run *finishing*; the
Response row lighting is the answer *resolving where it belongs*.

> *"Why is it so important the brief lands in a row and not as a chip?"* Because
> a chip floating over the canvas would teach a lie about how a Sim agent
> returns its output. The agent's text output is referenced as
> `<research.content>` and consumed by whatever's downstream — it resolves *in
> the Response block's Data field*, which is exactly the surface on screen. A
> floating output chip would say "the result is a free-floating thing the
> product hands you," which isn't how references work, and — per this repo's own
> rejection history — floating output chips read as slop ("these look
> disgusting"). Outputs only ever appear on real surfaces. The row is the real
> surface; the chip is the lie.

## The one set piece, again

As in every scene, this renders the *single* `<Rig/>` — same chain, same rail,
same cards in the same slots. The scene file passes only state props
(`start`, `agent`, `response`, `cards`, `respGlow`) and mounts one transient
`WirePulse`; nothing is mounted, unmounted, or relaid-out at either boundary.
That's why the `5→6` cut is identical down to the pixel: scene 5 ended on the
agent's live ring plus all four cards at rest, and scene 6 opens on exactly that
frame before anything in it fires.

```tsx
<Rig
  start={{state: startOk ? "ok" : "none"}}
  agent={{highlighted: !agentOk, state: agentOk ? "ok" : "none"}}
  response={{highlighted: respLive, state: respOk ? "ok" : "none"}}
  toolsReveal={1}
  respGlow={respGlow}
  cards={cards}
/>
```

Note `toolsReveal={1}` — the three tool chips on the agent are at full reveal,
inherited from scene 2 and never touched again. The scene only animates state,
never structure.

## The camera

There is no camera in this scene file at all — no `cam` prop, no `Stage`
wrapper. The `<Rig/>` renders at the layout's native coordinates (the chain at
`CHAIN_Y = 250`, the rail at `RAIL_Y = 660`), full static frame.

> *"Why no camera move in the resolution scene?"* Same reason scene 5's run held
> the camera still: the *content* is doing the moving — a four-card glow wave,
> three rings going green, a pulse crossing a wire — and the viewer needs a
> fixed frame to read that sequence against. The one camera move in this whole
> video is saved for the bookend (scene 7's ~6% pull-back), which moves *first*,
> then re-pulses the settled trail. Here the resolution is the event, so the
> lens gets out of its way. **Move the camera between scenes, not during the one
> where the diagram is doing the work.**
>
> *"Why frame the whole set piece rather than tighten onto the chain?"* Because
> the scene's meaning spans both halves of the layout: the *evidence* being read
> is down in the rail, and the *answer* it feeds resolves up in the chain. The
> glow wave (rail) and the green cascade (chain) are one causal sentence — "this
> evidence becomes that brief" — and you need both surfaces in frame at once or
> you can't see the sentence.

## Beat 1 — the agent re-reads its evidence (the glow wave)

```ts
const glowAt = (a: number) =>
    Math.min(cv(t, a, a + 0.35), cv(t, a + 1.0, a + 1.4, 1, 0));
const cards = [
    {reveal: 1, glow: glowAt(0.8)},
    {reveal: 1, glow: glowAt(1.4)},
    {reveal: 1, glow: glowAt(2.0)},
    {reveal: 1, glow: glowAt(2.6)},
];
```

Each card keeps `reveal: 1` — they are pixel-static, exactly where they landed
in scenes 3–5 — and gets a selection-blue `glow` that rises over `0.35s`, holds,
and falls to zero over its last `0.4s`. The starts are staggered `0.6s` apart:
card 0 lights at `0.8s`, card 1 at `1.4s`, card 2 at `2.0s`, card 3 at `2.6s`.
The glow itself is the same `0.08` blue fill + `0.85` blue inset-ring the cards
showed when they were first being captured (the `glow` branch of `CardShell`) —
this is *re-reading* in the same visual language as the original read.

> *"What's the glow on a card actually saying — the cards already landed?"* It's
> the inverse of the scene-3 move. In scene 3, a chip ring on the agent
> *births* a card — the agent reaching out and the result arriving are one
> event. Here the agent isn't reaching out; it's reaching *in*, consulting what
> it already has. The selection-blue glow is the product's "this is being read"
> language (the same glow a row gets when its reference is resolved). Four cards
> glowing in call order says, without a word: *the agent is assembling its
> answer from exactly these four pieces of evidence, in the order it gathered
> them.* The rail isn't decoration — it's the source material, and this beat is
> the agent paging back through it.
>
> *"Why a `0.6s` stagger against a `1.4s` glow — those overlap."* Deliberately,
> and the overlap is the whole effect. The glow lifetime is `1.4s` (up `0.35`,
> hold, down `0.4`); the next card starts only `0.6s` later — so while card 0 is
> still lit, card 1 is already lighting, and so on. The result is a **wave
> rolling down the rail**, not four discrete blinks. If the stagger were `≥
> 1.4s` (longer than the glow), each card would fully light and fully release
> before the next began — four separate flashes, reading as "four unrelated
> reads" rather than "one assembly pass over all four." The overlap is what
> binds them into a single gesture. (Compare scene 1's `0.35s` row stagger,
> which is *faster* than this — but there the job was distinct arrivals; here
> it's one connected sweep, so the windows are tuned to overlap.)
>
> *"Why call order 0→1→2→3 and not, say, all at once?"* Because call order is
> the truth of how the evidence was gathered — Exa found (card 0), Firecrawl
> read two pages (cards 1, 2), Browser Use acted (card 3). Re-reading in that
> same order rhymes the resolution against the run: the answer is built from the
> evidence in the sequence it arrived. Lighting all four simultaneously would
> say "it grabbed everything in one undifferentiated gulp," losing the
> per-call structure the whole video spent four scenes establishing.

`glowAt` is built from `cv` (the scene's clamped-interpolate shorthand) rather
than the rig's `wave` helper because it needs an *asymmetric* envelope — a quick
`0.35s` rise but a `0.4s` fall offset to start a full `1.0s` after the rise
begins. `Math.min(cv(up), cv(down))` composes those two ramps into one
hold-then-release pulse; it's the same `min`-of-two-ramps shape `wave` uses,
inlined here so the rise and fall windows can be tuned independently of `wave`'s
symmetric `ramp` default.

## Beat 2 — the run completes in causal order (the green cascade)

```ts
const startOk = t >= 3.5;
const agentOk = t >= 3.8;
const pulse2  = cv(t, 4.0, 4.7);
const respLive = t >= 4.6 && t < 6.4;
const respGlow = Math.min(cv(t, 4.9, 5.3), cv(t, 6.0, 6.4, 1, 0));
const respOk  = t >= 6.4;
```

Once the glow wave has rolled through (the last card's glow is fading by ~`3.4s`),
the run closes down the chain in strict causal order:

1. **Start goes green at `3.5s`** (`startOk` latches its `state` to `"ok"`).
2. **The agent goes green at `3.8s`** (`agentOk`) — and this is the scene's
   quiet hero beat: `agent={{highlighted: !agentOk, ...}}` means the agent wears
   its blue *highlighted* (live) ring right up until `3.8s`, then flips to the
   green `ok` state. **This is the live ring that has held since scene 3 finally
   releasing** — three scenes and four tool calls after it lit.
3. **The pulse crosses edge 2 over `4.0 → 4.7s`** (`pulse2`), eased
   `EASING.inOut` at the call site — control passing from the agent to Response.
4. **Response goes live over `4.6 → 6.4s`** (`respLive` sets `highlighted:
   true`, the blue running ring), and *inside* that window its `Data` row's
   `<research.content>` tag glows — `respGlow` rises `4.9 → 5.3`, holds, falls
   `6.0 → 6.4` — the brief being read into the answer.
5. **Response settles green at `6.4s`** (`respOk`) — the run is done.

> *"Why does Start light at 3.5 when it fired way back in scene 3?"* This is a
> compression for the resolution read, and it's the one judgment call worth
> flagging. Strictly, Start completed the instant it handed off in scene 3; here
> it greens at `3.5s` as the *first domino* of the closing cascade so the
> all-green chain assembles left-to-right as a single legible "the run
> finished" gesture. Reading it as "the chain confirms complete, in order" keeps
> it honest — Start did succeed; this is just when the scene *draws* that
> success, batched with the rest of the close. The alternative (Start already
> green from scene 3) would mean the cascade starts mid-chain at the agent,
> which reads as less of a clean "the whole run closed" sweep.
>
> *"Why is the agent's release (3.8) a *beat*, not just a state flip?"* Because
> that blue ring is the **run's spine** — the single piece of held live state
> that made scenes 3–6 read as *one* continuous run rather than four restarts.
> It lit at scene 3 (`t = 1.6` there), survived three freeze-cuts without ever
> reverting, and burned through every tool call. Its release here is the run
> exhaling. Flip it casually and you'd throw away the payoff of three scenes of
> held tension; let it be a distinct beat — agent blue right up to `3.8`, then
> green — and the viewer *feels* the run end, even without knowing why.
>
> *"Why the 0.3s gap between Start (3.5) and agent (3.8)?"* Causal legibility at
> small scale — the eye lands on Start greening, then catches the agent
> following. Firing both on the same frame would blur the cascade's *direction*
> (left-to-right, the run flowing forward) into one undifferentiated flash. It's
> the same 0.3s cause-then-effect beat scene 5 used for click-then-ripple: small
> gap, big readability.
>
> *"Why does the pulse fire at 4.0, *after* the agent greens at 3.8?"* Because
> the order is: the agent finishes (green), *then* hands control onward (pulse).
> A pulse departing before the agent settled would say control left while the
> work was still running — false. The agent completes, and only then does the
> streak cross to Response. Cause (agent done), then effect (control moves on).
>
> *"Why `EASING.inOut` on `pulse2`?"* Because the streak travels through space —
> it has momentum — so it gets the project's transform/travel curve:
> accelerate-then-decelerate, leaving the agent's source handle softly and
> settling into Response's target. (A fade, which doesn't travel, would be left
> linear. Easing is for things that move.) Note the eased value is computed at
> the *call site* — `p={EASING.inOut(pulse2)}` — feeding the already-clamped
> linear `pulse2` through the curve, rather than baking easing into `cv`.

## Beat 3 — the brief resolves in the Response row

The crux of the scene's honesty is *where* the brief appears. In the rig, the
Response block's `Data` row is rendered as a literal JSON template with the
reference embedded:

```tsx
rows={[{
    title: "Data",
    value: <>{'{ "brief": '}<Tag text="<research.content>" glow={respGlow} />{" }"}</>,
}]}
```

When `respGlow` rises (`4.9 → 5.3`), the `<research.content>` tag inside that
template glows selection-blue — and that's the entire "brief comes back" event.
The template `{ "brief": … }` stays put; only the reference glows. **No brief
text ever appears.**

> *"Why doesn't the actual brief text resolve in — surely the payoff is *seeing*
> the answer?"* Because no real run artifact exists (this is a batch build), and
> the iron rule of this video is: captured content is never invented words. The
> four cards show skeleton bars, not fake search results; the Response row shows
> the *reference template*, not a fake brief. What resolves is the **reference
> glowing** — `<research.content>` is the live link to the agent's output, and
> lighting it says "the answer is now present at this reference" without
> fabricating a sentence the run never produced. This follows the same
> `<start.input>` / `<research.content>` discipline as scenes 1 and 3: the tag
> glows when read but never substitutes to a value, because there's no authored
> value to substitute. When a real run artifact arrives, the swap cost is
> styling this one row's value — no layout change.
>
> *"Why glow the reference instead of, say, popping a result card?"* Because the
> brief's home is this `Data` row — that's the surface where a Sim agent's
> output is consumed downstream. Glowing it *in place* is the in-place
> resolution rule (rule 1 above) applied to the result itself. A separate result
> card would be the floating-chip lie again; the row is the truthful surface, so
> the row is what lights.
>
> *"Why is `respLive` a closed window (4.6–6.4) when the agent's live ring was
> latched open?"* Because Response's job is *bounded* — it receives control,
> reads the reference, emits the answer, done. It's live only while it's
> resolving (`4.6 → 6.4`), then settles green (`respOk`, `t ≥ 6.4`) and stays
> green. The agent's ring was latched open across scenes precisely because the
> agent's work *wasn't* done at any earlier cut; Response's work *is* done,
> inside this scene, so its live ring is a normal closed interval that gives way
> to the green ok state.

## The hold — the all-green frame carries through the cut

From `6.4s` to the end of the scene (~`2.6s` of hold), nothing moves: Start
green, agent green, Response green, all four cards at rest, rail full. And —
this is the structural job — that all-green state is **not reverted before the
boundary.** Scene 7 (the bookend) opens on exactly this frame.

> *"Why hold the green rings across the cut instead of letting scene 7 set them
> up?"* The same freeze-cut-carry logic that ran the whole video, now closing
> it. The run is *one* event; its finished state is the truth scene 7 inherits
> and re-pulses. If scene 6 reverted the rings to neutral and scene 7 re-greened
> them, you'd be drawing the run finishing *twice*. By leaving the all-green
> state latched and letting scene 7 simply keep it, the `6→7` boundary is
> identical by construction — no chance of a one-frame flicker where a ring
> blinks off and back on. The scene comment says it outright: *"The settled
> rings HOLD through the cut — the bookend opens on this frame."*
>
> *"Isn't a 2.6s still frame dead air?"* No — it's the payoff landing. The
> all-green chain over the full rail is the thesis of the whole video made
> literal: one prompt, one run, evidence captured, answer resolved. Letting it
> sit is letting it register. And structurally, a scene that ends on a settled,
> latched state can be *stretched* to fit however long the narration runs
> (here the VO stretches this scene to ~10.8s per the manifest) without freezing
> any motion mid-flight, and can be cut away from at any frame without losing
> the carried state. "Ends on a settled hold" is both taste and what makes the
> audio step painless.

## How to think about the whole scene

Walk the events in causal order and the scene is just the run *closing*, drawn
truthfully:

1. *What does the agent do with all that evidence?* Re-read it → the four cards
   glow selection-blue in call order, a wave down the rail. Consulting, not
   re-capturing.
2. *What happens when it's assembled the answer?* The run finishes → Start,
   agent, and Response go green in sequence; the agent's three-scene live ring
   finally releases.
3. *How does the answer reach Response?* Control passes → a `WirePulse` crosses
   the last edge, eased, carrying light not cargo.
4. *Where does the brief actually land?* In the row where it lives → the
   `<research.content>` reference glows inside the `Data` template, in place,
   never as a floating chip.
5. *What's the run's state at the cut?* Complete → the all-green frame latches
   and **holds through the cut** for the bookend to retell.

Every one of those is a link in one causal chain, drawn in the product's own
grammar — glow for "being read," ring color for state, streak for control
passing, in-place reference resolution for the result. The scene is the
satisfying *click* of a run completing, and it stays honest because the most
tempting cheat — making the brief itself appear as a nice readable card — is
exactly the floating-output lie the grammar forbids. The result resolves where
it lives, or it doesn't resolve at all.

## Exit state (what scene 7 inherits — a freeze-cut carry)

`Start ok (green) · agent ok (green) — live ring released at 3.8 · Response ok
(green) · `<research.content>` glow released (by 6.4) · all four cards at rest,
rail full · no pulse in flight (pulse2 absorbed by 4.7) · camera static at
native layout`.

This is a **freeze-cut**: scene 7 opens on this exact all-green frame and, for
the first and only time in the video, eases the camera back ~6% before
re-pulsing each card in call order — the trail retold without re-running.
Because both scenes render the same `<Rig/>` and scene 7 simply keeps the green
state, the boundary is identical down to the pixel.
