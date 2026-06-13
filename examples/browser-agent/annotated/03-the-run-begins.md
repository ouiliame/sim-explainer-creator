# Scene 3 — `the-run-begins`  ·  archetype: **run + freeze-cut OUT**

Source: `../source/scenes/TheRunBeginsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`.

This is the scene where the video's *one run* begins. Scenes 1–2 were setup —
the chain assembled, the toolbelt grew in. Nothing has *happened* yet. Scene 3
is the start striking: the workflow picks up its input and goes to work, and
the first thing it does is reach out to the web. Read it as the worked example
for "how do I make a run *start* — and start *going out* — without lying about
how it goes," because every choice here is a constraint about honesty: nothing
moves that the product wouldn't move, in the order it would move it.

---

## What this scene is for

Scenes 1–2 built a workflow and left it idle. Scene 3 fires it. The whole job
is to show **the run beginning** — Start blips, its input is read, control
passes down the wire, Research goes live — and then, in the same breath, to
show that this run's first act is to **go out**: the first tool call fires, and
its result lands as a kept receipt in the rail. So the scene teaches three
things at once: the run starting, the *grammar* a run is drawn in here (ring for
state, streak for control, chip-ring-plus-card-birth for a tool call), and the
**freeze-cut** — because this run doesn't finish in scene 3. It spans four
scenes. Scene 3 has to **end mid-run, on a live state, and hand that live state
across the cut.** That's why the archetype is "run + freeze-cut OUT" and not
just "run."

So the rule is still *one idea per scene* — the idea is "the run starts and its
first move is to go out and search" — but this scene carries more machinery than
any before it, because a run is a chain of events and you have to draw every
link.

## What it looks like

The whole set piece is on screen at neutral framing — the three-block chain
(Start → Research → Response) above the empty four-slot evidence rail. The Start
block **blips** (a brief selection ring) and at the same instant its `Input`
row glows — the input being read. A streak of blue light travels left-to-right
along edge 1 into Research; Research's **live ring** comes on — and **stays on
through the cut into scene 4.** Its `Messages` row tag glows as the agent reads
its orders. Then the first tool call: the **Exa chip rings**, and *in sync* with
that ring, **evidence card 1 drops into rail slot 1** — a search-results card,
three favicon-dot rows staggering in. A green capture pulse brackets the
landing; the chip ring releases as the card settles; the **live ring holds.**

## The run grammar — read this before the beats

This is the first scene where a run is actually *running* on screen, so it's
worth stating the rules it obeys, because every later run scene (4, 5, 6) obeys
them too:

1. **A `WirePulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a streak of blue light, nothing more — not a value, not a
   record, not a payload. A wire firing means "control passed from this block to
   the next," full stop.
2. **Values never ride wires. They resolve *in place*, in rows and cells.** When
   the input is read, the `Input` row glows where the value *lives* — it doesn't
   detach and fly down the connector. (The `Messages` tag glow is the same: an
   in-place event.)
3. **State is shown in the product's own language** — a blue live ring, a green
   capture pulse, a chip ring, a row glow — never a word like "RUNNING" stamped
   on screen.

And one rule specific to this video, taught here for the first time:

4. **A tool call is two surfaces showing one event: the chip rings *and* a card
   is born.** The Exa chip lighting and card 1 dropping into the rail are not
   two things — they're one thing (a tool was called and came back) drawn on two
   surfaces. This is the ResolvedTag synchrony discipline carried to the rail,
   and it's the equation the whole video repeats four times: **chip ring = card
   birth.**

If you internalize those four, the entire scene decodes: a ring is state, a
streak is control passing, a row glow is a value being read, and a chip-ring-
with-card-birth is one tool call.

> *"Why be this strict — wouldn't a little search-result chip flying down the
> wire from the chip into the rail read faster?"* It would read faster and teach
> a lie. In Sim, the edge between two blocks is execution order; a tool call's
> result doesn't *travel* anywhere — it's an output the block holds, which the
> rail visualizes as a captured card. Drawing the result sliding from chip to
> rail would tell the viewer the product passes data along visible paths, which
> it doesn't. The card simply *appears* in its slot, in sync with the ring,
> because that's what a tool call is: it fired, and now there's a result. The
> grammar isn't decoration — it's the load-bearing claim about how the product
> works.

## The one set piece, again

As in every scene, this renders the *single* `<Rig/>` — the same three blocks,
the same edges, the same four rail slots — and differs only in state props.
Nothing is mounted or unmounted at the cut; the chain that was idle in scene 2
is the same chain that fires here. That's why the `2→3` boundary is identical
down to the pixel: scene 2 left the chain assembled with all three tool chips at
`reveal 1` and no run state, and scene 3 opens on exactly that frame before
anything blips.

Note how little the scene file actually *does*. It computes a handful of timing
windows and hands them to `<Rig/>` as props:

```tsx
<Rig
  start={{highlighted: startBlip}}
  agent={{highlighted: agentLive}}
  toolsReveal={1}
  inputGlow={inputGlow}
  msgGlow={msgGlow}
  chips={{exa: {ring: exaRing}}}
  cards={[card1, {}, {}, {}]}
/>
```

Everything else — the geometry, the block chrome, the card layout — lives in the
rig and the layout module. The scene is *just the timing.* That's the division
of labor that keeps continuity free: scenes never lay anything out, they only
say *when*.

> *"Why pass `toolsReveal={1}` here at all — it's not animating?"* Because the
> tools row is part of the carried state. Scene 2 grew it in; if scene 3 didn't
> pass `toolsReveal={1}`, the rig would default it to `0` and the whole Tools
> row would vanish on the cut. The prop isn't animating *this* scene, but it's
> holding the state scene 2 established. Carried state has to be re-asserted
> every scene, not assumed.

## The camera

There is no camera in this video. The set piece is designed at `1920×1080` and
rendered at full frame — no `Stage`, no `cam`, no zoom. Every scene 1–6 sits at
the same static framing; the only camera move in the whole video is a ~6%
pull-back in the scene-7 bookend.

> *"Why no camera move in the scene where the most is happening?"* Same reason
> the market-desk run scene holds its camera still: the *content* is moving — a
> blip, a row glow, a streak, a live ring, a chip ring, a card dropping in — and
> the viewer needs a fixed frame to read that motion against. If the frame also
> moved, you'd have motion-on-motion and the eye couldn't tell what's the event
> and what's the lens. The rule of thumb across the build: **move the frame
> between scenes, not during the ones where the diagram itself is doing the
> work.** Here the run is the event, so the frame gets out of its way. (Scene 5
> *does* move — the live-session viewport rises and folds — but that's an
> overlay rising over a dimmed world, not the whole frame travelling.)
>
> *"Why frame the *whole* set piece and not push in on the chain?"* Because the
> chip-ring-to-card-birth sync is the whole point of the scene, and that sync
> spans both halves of the frame — the chip is up in the chain (Research's Tools
> row), the card is down in the rail (slot 1). You need both in frame at once or
> you can't see the one thing this scene is about: a tool call producing a kept
> result.

## The shared timing helpers

Two tiny helpers do almost all the timing, and they're worth naming because
every beat is built from them.

`cv(t, lo, hi, a=0, b=1)` is a clamped `interpolate` — it goes from `a` to `b`
as the clock `t` (seconds) crosses `lo`→`hi`, held flat outside that window.

`wave(t, a, b, ramp=0.35)` is a glow that *rises* at `a`, *holds*, and *falls*
to zero by `b`: it's `Math.min(cv(t, a, a+ramp), cv(t, b−ramp, b, 1, 0))` — up
over the first `ramp` seconds, down over the last `ramp` seconds, full in
between. Every row glow in the scene is a `wave`; every transient ring is a
`Math.min` of two `cv`s (an up-ramp clamped against a down-ramp), which is the
same up-hold-down shape spelled out by hand when the up and down need different
lengths.

That's the whole vocabulary. There's also `popIn(frame, fps, delay, dur)` —
a spring-driven entrance (damping 14, stiffness 160) that's exactly `0` before
`delay`, springs over `dur` with a slight organic overshoot, and clamps to
**exactly 1** afterward. It's used for the one thing that *drops in* — the card.

## Beat 1 — the start fires (the run picks up its input)

```ts
const startBlip = t >= 0.4 && t < 0.95;   // Start selection ring, a brief blip
const inputGlow = wave(t, 0.4, 1.5);      // Input row glows: the value is read
```

The Start block's selection ring is a plain boolean window: on from **0.4s** to
**0.95s** — a ~0.55s blip. It's driven into the rig as `start={{highlighted:
startBlip}}`, which lights `SimBlock`'s ring at `C.ring` (the secondary blue
`#33b4ff`) — the product's own selection treatment. At the *same instant* the
`Input` row glows, via `inputGlow = wave(t, 0.4, 1.5)`: up over `0.4→0.75`,
held, down over `1.15→1.5`. The glow is the rig painting a faint
`rgba(51,180,255,0.14)` tint behind the row (`SimBlock`'s `row.glow`).

> *"Why are the blip and the row glow the same moment — why not blip first, then
> read?"* Because they're **one event on two surfaces.** A block firing and that
> block reading its input are the same act — control arrives *and* the block
> consumes what's wired into it, in the same tick. The blip says "this block is
> active"; the row glow says "and it's reading its `Input`." Firing them
> together is the cleanest way to say "the run started here and picked up its
> input" without a word on screen. (Note the start at `0.4`, not `0.0`: a short
> beat of still frame before anything fires reads as a deliberate open, same as
> scene 1's table not appearing until `0.2`.)
>
> *"Why does the blip *end* at `0.95` while the glow runs to `1.5`?"* The blip
> is the *firing* — an instant, so it's brief. The glow is the *reading* — it
> wants to linger a touch longer so the eye lands on it, and it needs to still
> be alive when the pulse departs (beat 2) so the viewer reads "it read its
> input, *then* passed control on." The two windows are deliberately different
> lengths because they describe different-lifetime events.
>
> *"What is the `Input` value being read?"* `Competitor` — the Start block's one
> row is `{Input: "Competitor"}`, grounded in the docs' `BUILD_AGENT_WORKFLOW`
> pattern (`Start {Input: <label>}`) with the noun taken from the registry's
> competitor-pricing template. It's a label, not a real value — `<start.input>`
> never resolves to anything downstream, because no real run artifact exists.
> The glow says "this is being read," not "here's what it is."

## Beat 2 — the pulse crosses edge 1 into Research

```ts
const pulse1 = cv(t, 1.0, 1.7);   // streak travels edge 1 (eased at the call site)
const agentLive = t >= 1.6;       // Research live ring — LATCHED, holds through the cut
const msgGlow = wave(t, 2.0, 3.6); // Messages tag glows: the agent reads its orders
```

A `WirePulse` is mounted on edge 1 (Start → Research) and its progress runs
`0 → 1` over `1.0 → 1.7s`. The streak emerges from Start's source handle,
travels the wire, and is absorbed at Research's target handle. As it lands,
Research's live ring comes on at `t >= 1.6` — and this one has **no upper
bound.** It's latched. Then the `Messages` row's `<start.input>` tag glows via
`msgGlow = wave(t, 2.0, 3.6)` — up over `2.0→2.35`, held a beat, down over
`3.25→3.6` — the agent reading its instructions before it acts.

Note the call site eases the pulse:

```tsx
<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={EASING.inOut(pulse1)} />
```

> *"Why is `pulse1` raw `cv` but eased with `EASING.inOut` at the call site
> rather than passing the easing into `cv`?"* The scene keeps `pulse1` as a
> clean `0→1` linear progress so the *gate* — `pulse1 > 0 && pulse1 < 1`, which
> decides when the streak is mounted at all — reads off un-eased progress, and
> the easing is applied only to the `p` the `WirePulse` actually draws with.
> Same result, but the mount window stays simple. And it *must* be eased,
> because the streak is a thing *travelling through space* — it has momentum.
> `inOut` gives it a gentle accelerate-then-decelerate, so it leaves Start's
> handle softly and settles into Research rather than arriving at a hard stop.
> This is the project's consistent rule: `inOut` for transforms and travel,
> `out` for entrances, `in` for exits.
>
> *"Why does `WirePulse` need the `0 < p < 1` gate — why not always render it?"*
> Because `WirePulse` returns `null` outside `0 < p < 1`, so the streak vanishes
> the instant it lands. The gate in the scene file is just belt-and-suspenders:
> it avoids mounting the component at all when there's nothing to draw. A streak
> is an *instant* — it exists only while it's travelling, then it's gone. There
> is no lingering wire-heat in this video the way market-desk heats its edges;
> the edges here stay at their drawn-on rest state and only the streak moves.
>
> *"Why does the live ring latch open at `1.6` while Start's blip was a closed
> window?"* Because this is the **freeze-cut carry** — the one piece of live
> state the scene is built to hand forward. Start fired and finished (its blip
> ended at `0.95`); it's *done*. But Research is **not** done — it has only just
> gone live, and the actual work (four tool calls across scenes 3–6) is just
> beginning. So Research's ring must not revert. It latches on and stays on
> across three scene boundaries, releasing only in scene 6 when the brief is
> assembled. The held blue ring *is* the run's spine — one ring spanning four
> scenes, every boundary a freeze-cut that carries it.
>
> *"Why does the ring light at `1.6`, a beat before the pulse fully lands at
> `1.7`?"* The streak is decelerating into the handle over its last fraction;
> lighting the ring at `1.6` means Research comes alive just as the streak is
> being absorbed, so "control arrives" and "block goes live" read as one event
> rather than the ring waiting for a clean stop. A hair of overlap reads as
> cause-into-effect; a gap would read as a pause.
>
> *"Why does `msgGlow` fire at `2.0`, after the ring at `1.6` — and why is it a
> `wave`?"* Two ideas, sequenced, not stacked. First Research goes live (the
> ring); *then*, a beat later, it reads its orders (the `Messages` tag glow).
> The `<start.input>` tag inside the `Messages` value glows selection-blue and
> releases — it's a reference being read, not resolved (it never substitutes to
> a value, because there's no authored value to resolve to). A `wave` is exactly
> the right shape: glow up, hold while the narration names what's being read,
> release. Reading is a *duration*, so it gets a held glow, not an instant.

## Beat 3 — the first tool call (chip ring = card birth)

This is the scene's signature move and the one the whole video repeats. The
agent's first act is to call Exa, and that single act is drawn on **two
surfaces at once**: the Exa chip rings *and* card 1 is born in the rail.

```ts
const exaRing = Math.min(cv(t, 4.4, 4.7), cv(t, 6.6, 7.0, 1, 0));
const card1 = {
    reveal: popIn(frame, fps, 5.0, 0.7),                    // springs into slot 1
    body:   cv(t, 5.2, 6.9),                                // skeleton rows stagger in
    pulse:  Math.min(cv(t, 5.8, 6.1), cv(t, 7.0, 7.5, 1, 0)), // green capture ring
};
```

**The chip ring.** `exaRing` is a hand-spelled up-hold-down: up fast over
`4.4 → 4.7` (a ~0.3s snap), held, down over `6.6 → 7.0`. It's passed as
`chips={{exa: {ring: exaRing}}}`, which lights `SimBlock`'s per-chip selection
ring (`inset 0 0 0 1.5px` of `C.ring`) on the Exa chip only. The chip rings;
the other two chips stay dark.

**The card birth.** `card1.reveal` is a `popIn` delayed to `5.0s` over `0.7s` —
so the card starts dropping into slot 1 **0.3s after the chip ring started
rising at 4.4**, and well inside the ring's lifetime. The `CardShell` reads
`reveal` to drive both the drop (`top − 26·(1−reveal)`, a 26px settle) and the
fade (`opacity min(1, reveal·1.4)`). Because `popIn` clamps to **exactly 1**
after `0.7s`, the card is pixel-static at rest — it never moves again, which is
what makes it safe to carry across the cut.

> *"Why does the card drop 0.3s *after* the chip starts ringing, not at the same
> instant?"* Because cause should visibly precede effect, even at this tiny
> scale. The chip rings (the agent decided to call this tool), *then* the result
> lands (the call came back). 0.3s is enough to read the order — ring, then card
> — but small enough that the two still read as one event, not two. Land them on
> the same frame and you lose the causality; space them a full second and they'd
> read as unrelated. 0.3s is the sweet spot, and it's the same offset every
> later tool call uses, so the rhythm is consistent.

**The skeleton body.** `card1.body = cv(t, 5.2, 6.9)` drives a *separate*
staggered reveal of the card's three content rows, after the shell has landed.
Inside `SearchCard`, each row appears on its own window within the body ramp —
`cv(body, 0.2 + i·0.27, 0.45 + i·0.27)` — so the three favicon-dot-plus-line
rows stagger in top to bottom (row 0 at body `0.2→0.45`, row 1 at `0.47→0.72`,
row 2 at `0.74→0.99`).

> *"Why is `body` a separate ramp from `reveal` — why not just fill the card the
> instant it lands?"* Because the shell *arriving* and the shell *filling with
> content* are two different moments, and separating them reads as "a result
> card appeared, and then its contents loaded in" — the product's own
> loading-rows feel. Fill it all at once and the card reads as a static sticker;
> stagger the rows in and it reads as evidence *resolving*. Same reason scene 1
> revealed the table chrome first and the rows second.
>
> *"Why is the content skeleton bars and not real search results?"* Because **no
> real run artifact exists** — this was built batch-mode, with no live run to
> harvest titles and URLs from. Every captured value in the whole video is
> ⟨pending a real run artifact⟩ and stays off screen; captured content renders
> as the house skeleton-line language (seeded gray bars, the `ChunkCard`
> lineage), so the filmstrip shows the *shape* of evidence — a search result has
> a favicon, a title, a sub-line — never invented words. Writing fake search
> titles would be the exact kind of slop this series exists to avoid: it would
> read as real data the viewer might try to believe. The shape is honest; the
> words would be a lie.
>
> *"Why are the bar widths seeded (`seededPct`) instead of random?"* Because
> random widths would *flicker* — a different value every frame, which the
> non-pure-animation lint rule catches and which reads as noise. `seededPct(seed,
> i, ...)` is a pure function of the row index, so the skeleton is deterministic:
> the same card always draws the same bars. It *looks* varied (the widths differ
> row to row) but it's frame-stable, which is the whole discipline — every
> on-screen value must be frame-derived, never `Math.random()`.

**The capture pulse.** `card1.pulse` is another up-hold-down: up over `5.8 →
6.1`, down over `7.0 → 7.5`. It draws a transient **green** ring
(`rgba(34,197,94,...)`) around the card — the product's "this was captured / ok"
color, distinct from the blue selection glow. It brackets the landing: the card
drops, fills, and a green ring flashes to mark "captured," then fades.

> *"Why green, and why does it overlap the chip ring fading out?"* Green is the
> ok/captured color (the same green a block's `state="ok"` ring uses); blue is
> active/selected. The pulse going green says "this result is now *kept*" — a
> receipt. And it deliberately overlaps the chip ring's release: the chip ring
> falls over `6.6→7.0` while the green pulse is still up and only fades over
> `7.0→7.5`. The call *ends* (chip ring releases) exactly as its *receipt* turns
> green and settles. The hand-off — blue tool-call activity giving way to green
> captured-result — is drawn as the two rings crossing. That overlap-decay is
> the visual sentence "the call finished and left a kept result behind."

## Beat 4 — the hold (the held live ring)

After the green pulse fades at `7.5s`, nothing transient moves for the rest of
the scene (which runs to ~13.6s, VO-stretched). The chain sits, card 1 sits in
the rail — but Research's **live ring burns the whole time.**

> *"Isn't a six-second hold dead air?"* Not here, and the reason is the latched
> ring. A hold on a *settled* state (scene 1's assembled board) is restful; a
> hold on a *live* state is *tense*. The blue ring says the run is mid-flight —
> the agent is still working, the next call is coming — so the held frame
> carries an unresolved question ("what's it doing now?") that keeps it alive
> through the narration. This is the same property that makes the hold safe to
> *stretch*: the scene can run as long as the voiceover needs, because the held
> state is a latched ring, not a motion frozen mid-flight. A scene that ends on a
> settled-or-latched state can be extended to any length without freezing an
> animation halfway. Here it's latched (the ring is *on*, holding), which is
> even better than settled: you can cut away at any frame without losing the live
> state, because the state is held rather than mid-transition.

## How to think about the whole scene

Walk the events in causal order and the scene is just the run starting, drawn
truthfully:

1. *What starts a run?* The Start block fires → a brief selection blip, and its
   `Input` row glows as the value is read. The two are one event.
2. *What does firing do?* Passes control down the wire → a `WirePulse` on edge
   1, eased `inOut`, absorbed at Research.
3. *What does Research do first?* Comes alive and reads its orders → the live
   ring latches on, the `Messages` tag glows and releases.
4. *What's the agent's first move?* Go out — call a tool → the Exa chip rings,
   and **in sync** card 1 is born in the rail, fills with a skeleton search
   result, and a green pulse marks it captured. One call, two surfaces.
5. *What's the run's state at the cut?* Still going → Research's live ring
   **holds through the cut**, card 1 sitting in the rail as the first receipt.

Every one of those is a link in one causal chain, and the discipline of the
scene is drawing each link in the product's own grammar — blip and row glow for
"fired and read," streak for control passing, latched ring for "still live,"
chip-ring-plus-card-birth for a tool call — and *never* breaking the rule that
wires carry light, not cargo, and that captured content is shape, not invented
words. The scene is the busiest yet, but it isn't *cluttered*, because each beat
is one link and the links are sequenced, not stacked: fire (0.4) → pulse (1.0) →
live + read (1.6–3.6) → call + card (4.4–7.5) → hold. Each idea gets its own
air before the next begins.

## Exit state (what scene 4 inherits — a freeze-cut carry)

`Research live ring ON (latched blue, carries across the cut) · card 1 at rest
in slot 1 (popIn clamped to exactly 1 — pixel-static, search-result skeleton
fully revealed) · Start settled (blip released, no ring) · all three tool chips
at reveal 1, none ringing · Input and Messages glows released · rail slots 2–4
empty · static full frame`.

This is a **freeze-cut**: scene 4 opens on this exact frame — the held live
moment, one card in the rail — and the carried state is **Research's live ring**.
Scene 4 does not re-establish that a run is happening; it inherits a run already
in flight and continues it, ringing the Firecrawl chip and dropping card 2 into
slot 2. Because both scenes render the same `<Rig/>` and scene 4 simply keeps
`agentLive` latched (passing `agent={{highlighted: true}}` from its own frame
0), the boundary is identical down to the pixel. The held live ring is the
boundary contract; the run is *one* event, seen at four scales across four
scenes, and this is the first cut it survives.
