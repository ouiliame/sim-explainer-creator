# Scene 7 — `the-evidence-trail`  ·  archetype: **settle / bookend**

Source: `../source/scenes/TheEvidenceTrailScene.tsx`, `../source/layout.ts`,
`../source/scenes/_rig.tsx`.

This is the final scene of the video, and it does almost nothing — on
purpose. It is the bookend: the camera releases a few percent, the whole
chain sits green, and the four-card evidence trail the run filled up just
rests. Read it as a worked example of the *settle* archetype — the scene
whose entire job is to stop, hold the payoff, and complete the arc the
opening scene started. Every choice below is one you'll make again when you
write your own closing frame.

---

## What this scene is for

The video opened (scene 1, `the-task`) on a **normal workflow** — one agent
between Start and Response, told to research whatever comes in, with an
empty rail of slots reserved beneath it and a planted question: what fills
those in? Five scenes answered it. Four tool calls, each a captured result,
dropped into the rail one at a time; the live browser session folded in as
the fourth. This scene closes the loop: the same chain, now all green, with
the **complete filmstrip** sitting under it — every page the agent visited,
latched as a receipt. The bookend's job is to **return to the calm frame
and let the answer land** — to say "one prompt, one run, and here are the
receipts" with a held picture rather than any new motion.

So the rule the scene follows is *one idea per scene*, taken to its limit:
this scene is "the evidence trail," full stop. No run, no new call, no
fold — everything was already shown. The only things that *happen* are the
camera easing back a touch and each card taking one quiet pulse in call
order, and neither is an event so much as a *recap*. Resist the urge to add
a final flourish here. The flourish was scene 5 (the live session folding
into its own card); scene 7's discipline is to add nothing new and trust
the settled trail.

## What it looks like

The whole set piece, pulled back ~6%: the chain Start → Research → Response
across the top, all three blocks carrying the green "ok" ring; the tools
row on Research fully grown with its three chips (Exa, Firecrawl, Browser
Use). Below, the four-slot evidence rail completely filled — slot 0 the Exa
search-results card, slots 1 and 2 the two Firecrawl page captures, slot 3
the Browser Use session that folded down from the scene-5 viewport — all at
rest, pixel-static. As the scene plays, each of the four cards takes a
single quiet blue glow in turn, 0→3, a wave rolling down the rail, then the
frame holds dead still for the length of the narration.

## The one real decision: render the settled end-state, and recap it once

The scene renders this and nothing else:

```tsx
const s = interpolate(t, [0.8, 2.2], [1, 0.94], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: EASING.inOut,
});

const recap = (a: number) =>
  Math.min(cv(t, a, a + 0.3), cv(t, a + 0.7, a + 1.1, 1, 0)) * 0.6;

<AbsoluteFill style={{transform: `scale(${s})`}}>
  <Rig
    start={{state: "ok"}}
    agent={{state: "ok"}}
    response={{state: "ok"}}
    toolsReveal={1}
    cards={[
      {reveal: 1, glow: recap(2.6)},
      {reveal: 1, glow: recap(3.3)},
      {reveal: 1, glow: recap(4.0)},
      {reveal: 1, glow: recap(4.7)},
    ]}
  />
</AbsoluteFill>
```

Two things to take from this.

**Almost every value is a fixed end-state — a "latched final," not an
animation.** Look at what's passed: `state: "ok"` on all three chain
blocks, `toolsReveal: 1` (the tools row fully grown), and `reveal: 1` on
all four cards. None of those is a function of the clock. The cards don't
drop, the chain doesn't settle, the tools don't grow — they're already
there, latched from the scenes that produced them. The *only* time
dependence in the whole scene is the camera's `s` (a ramp that clamps to a
constant after 2.2s) and the four cards' `glow`, which each rise and fall
back to zero. From ~5.8s onward — after the last glow decays — the scene is
a genuinely static image. That property has a name in this build —
*latched-settle* — and it is the whole reason this scene exists in the
shape it does (see "Why latched finals" below).

**It's still the one set piece.** Same `<Rig/>` as every other scene, same
geometry from `layout.ts`. The chain blocks sit at `CHAIN_Y`, the cards in
their fixed `slotRect` slots; nothing relayouts. You are never building a
"final frame" as a special artifact; you're configuring the same rig into
its rest pose.

> *"Why pass `{reveal: 1}` on the cards instead of letting them default?"*
> Because the rig's default card is `NO_CARD = {reveal: 0}` — a card that
> renders nothing (`CardShell` returns `null` when `reveal <= 0`). The
> whole point of the bookend is that the rail is *full*, so every slot has
> to be explicitly mounted at `reveal: 1`. And `reveal: 1` isn't just
> "visible" — it's the exact at-rest value the `popIn` spring clamped to
> when each card landed during the run (the choreography note: "cards at
> rest clamp to exactly 1 — pixel-static, never move again"). Passing the
> literal `1` here means the bookend reads the card through the same door
> the run did, at the same terminal value — no second code path, no chance
> of the final frame drifting a pixel from what scene 5 latched.

## The camera — one of only two things that move

```ts
const s = interpolate(t, [0.8, 2.2], [1, 0.94], { …, easing: EASING.inOut });

<AbsoluteFill style={{transform: `scale(${s})`}}>
```

The camera here isn't the `cam`/`Stage` rig the market-desk video used —
this video has no pan, only a scale. The whole stage scales from `1.0` to
`0.94` over **0.8s → 2.2s**, eased `inOut`, then sits at `0.94` forever.
`0.94` is a scale ratio of `0.94 / 1.0` — the content shrinks to 94% of its
home size, a **~6% pull-back** about frame center (the `AbsoluteFill`
transform origin is the center by default).

> *"Why 6% — why not a bigger, more obvious pull-back?"* Because this is a
> *release*, not a move. This pull-back is, per the choreography, "the
> video's only camera move" — every other scene is framed dead static, with
> focus carried by the product's own editing/live rings rather than the
> camera. So when the camera finally does move, it has to read as
> punctuation, not travel. Six percent is below the threshold where the eye
> reads "the camera is going somewhere" and above the threshold where it
> reads as nothing at all. You feel the frame *settle back* the way a held
> breath releases, without it announcing itself as a shot. Make it 15% and
> it becomes a deliberate dolly-out that begs for a reason; make it 1% and
> it's invisible jitter. 6% is the "we're done" gesture.

> *"Why ease back at all instead of just holding `1.0`?"* Because a hard
> arrival into a static hold reads as a *cut to a freeze* — the scene feels
> like it stalled. The gentle ease-back signals **closure**: it's the
> visual equivalent of a sentence trailing into a period rather than
> stopping mid-word. A bookend should feel like the frame is *letting go*
> of the work, stepping back to take in the whole trail one last time. The
> ease-out is that letting-go, made literal.

> *"Why `EASING.inOut` and not `out`?"* Because the move both starts and
> ends from rest. `EASING.out` (fast start, slow finish) is for entrances —
> something arriving from offscreen. This camera is already at rest at `t=0`
> (it inherits scene 6's full-frame framing at scale `1.0`) and comes to
> rest again at `0.94`; `inOut` (slow-fast-slow) eases out of the first
> rest and into the second, so there's no velocity discontinuity at either
> end. It's the same curve every deliberate transform in the build uses —
> the convention for "settling between two states."

> *"Why start at 0.8s instead of 0.0?"* So the cut from scene 6 lands on a
> still frame before the camera releases. Scene 6 ends on its own settled
> hold (the chain just went all-green, the green rings deliberately carried
> through the cut); if scene 7 started easing back on frame 0, the two
> scenes' boundary would have the camera already in motion, and the
> freeze-to-release would blur. Holding ~0.8s at scale `1.0` first means
> the boundary is identical (exit == enter, both at `1.0`), *then* the
> release begins — a clean beat of stillness, then the exhale.

## The recap pulses — the trail retold, quieter than it was lived

```tsx
const recap = (a: number) =>
  Math.min(cv(t, a, a + 0.3), cv(t, a + 0.7, a + 1.1, 1, 0)) * 0.6;

cards = [
  {reveal: 1, glow: recap(2.6)},
  {reveal: 1, glow: recap(3.3)},
  {reveal: 1, glow: recap(4.0)},
  {reveal: 1, glow: recap(4.7)},
];
```

`recap(a)` is a `wave`-shaped glow built by hand from two clamped
interpolations: it rises 0→1 over `a`→`a+0.3` (a 0.3s fade-up), holds, then
falls 1→0 over `a+0.7`→`a+1.1` (a 0.4s fade-down) — so each card glows for
about a second total — and the whole thing is scaled by **`× 0.6`**, capped
at 0.6 intensity rather than full. The four cards fire at `a = 2.6 / 3.3 /
4.0 / 4.7` — a **0.7-second stagger** — in call order, 0→3 (Exa, then the
two Firecrawl pages, then the Browser Use session).

This `glow` value lands on each card's `CardShell` (and, for slot 3, on the
session's overlay box) as the selection-blue treatment:
`rgba(51, 180, 255, …)` — an `0.08·glow` fill plus an `0.85·glow` inset
ring. It's the exact same blue glow that meant "the agent is reading this
evidence" when the brief was assembled in scene 6.

> *"Where does the `× 0.6` come from, and why does it matter so much?"*
> It's the load-bearing number of the whole scene. In scene 6, the same
> cards glowed at full strength (`1.0`) as the agent actively *read* them to
> build the brief — that was a live action, evidence being consumed. Here
> the cards glow at `0.6`, capped. The choreography note is explicit: "a
> recap glow is quieter than a live read — memory, not action." A
> full-strength glow would say "the agent is reading these again" and imply
> a second run the viewer never saw. The dimmed `0.6` says "remember these"
> — it's the trail being *recalled*, not *re-traversed*. Drop it to full
> and you've manufactured a phantom second run; drop it to, say, `0.2` and
> the recap is too faint to register as a deliberate retell. `0.6` is "loud
> enough to read as a gesture, quiet enough to read as memory."

> *"Why 0.7s of stagger — why not fire all four at once, or one slow
> sweep?"* The 0.7s offset against a ~1s glow means each card's glow
> overlaps its neighbor's: card 0 is still lit when card 1 lights, which is
> still lit when card 2 lights. That overlap is what makes it read as **one
> wave rolling down the rail** rather than four separate blinks. Fire all
> four simultaneously and you get a single flash with no direction — no
> sense of a *sequence* of evidence. Space them too far apart (say 1.5s)
> and the overlap breaks; they become four discrete events and the scene
> starts to feel like it's doing four things instead of one. 0.7s is the
> spacing that keeps four pulses reading as a single left-to-right gesture.

> *"Why retell at all — why not just hold the static full rail?"* Because
> the four cards are the thesis object, and a silent full rail is a *list*;
> the wave makes it a *sequence*. The recap re-states, without a word, the
> shape of what happened: find → read → read → act, in the order it
> happened, as one continuous motion. It's the closing line of the video
> said in the rail's own vocabulary — and then it decays to nothing and
> lets the trail rest. (This is the bookend's one permitted gesture; note
> it's a *recap* of an existing event, not a new one. The arc was closed in
> scene 6; this just traces it once more on the way out.)

## The values, and why the trail is full *by construction*

Nothing on screen is invented for this frame. The chain is the docs'
`BUILD_AGENT_WORKFLOW` shape (Start {Input: Competitor} → Research {Messages:
Research `<start.input>`, Model: claude-sonnet-4-6} → Response {Data:
`{ "brief": <research.content> }`}), the same blocks every scene rendered.
The four cards are the four tool calls made visible — `card count 4 = call
count 4` — each filled with the house **skeleton-line language** (seeded
gray bars), never readable text.

> *"Why is the card content still skeleton bars in the final frame? Wouldn't
> the closing shot be the place to show the real results?"* No, and this is
> a principled choice, not a shortcut left unfinished. The whole build
> declares up front that **no real run artifact exists** — there are no
> authored search titles, page text, plan names, or brief copy. The honest
> way to depict captured evidence you don't have the literal contents of is
> to show its *shape*, not invent its words. So every card body is the
> ChunkCard-lineage skeleton (favicon-dot + line rows for the Exa search
> card, title-bar + paragraph skeleton for the Firecrawl pages, the folded
> pricing wireframe for the session). The filmstrip shows that four results
> were captured and *what kind* each is — never a fabricated sentence. If a
> real run artifact ever arrives, the swap is four card bodies restyled, no
> layout change. The skeleton in the bookend isn't a placeholder that
> escaped cleanup; it's the truthful rendering of "evidence captured,
> contents off-screen."

> *"Why is slot 3 (the session) just sitting there like the others when it
> was a whole live viewport in scene 5?"* Because the scene-5 fold was
> designed so the session's *landed state IS an evidence card*. The
> viewport was drawn at `VIEW_RECT` (a rail slot × 2.3, same aspect) and
> folded by a single uniform scale onto `slotRect(3)`, so at `fold: 1` it's
> pixel-identical in footprint to the three popIn cards beside it. The rig
> renders it here via `SESSION_FINAL` (page B, green capture residue at
> `0.25` on the three plan regions, fold `1`). The deepest continuity claim
> of the video is exactly this: the most elaborate surface in it (a live
> browser session with a moving cursor) comes to rest as just one more
> receipt in the trail, indistinguishable in role from the search card. The
> bookend is where that claim is cashed — slot 3 reads as evidence, not as
> a deflated set piece.

## The chain — all green, latched

```tsx
start={{state: "ok"}}  agent={{state: "ok"}}  response={{state: "ok"}}
```

All three chain blocks carry the green `ok` ring (in `SimBlock`,
`state: "ok"` → a `#22c55e` ring). This is the all-green frame scene 6
ended on — Start ok, Research ok (its live blue ring, which had held across
*three* scene boundaries since scene 3, finally released in scene 6),
Response ok — now simply held.

> *"Why all green and not the blue 'live' ring from the run?"* Blue (the
> `secondary` ring) means *running now*; green (`ok`) means *finished
> clean*. The run is over — one prompt, one traversal, four calls, all
> settled. Green across the whole chain is the "work complete" read. It's
> the same causal-order green that scene 6 latched (Start → Research →
> Response), carried through the cut as deliberate state and held here. The
> bookend's closing statement — *the workflow went out and did the work* —
> is stated as a UI fact (three green rings + a full rail), not a caption.

## Why latched finals — the scene's structural reason for existing

This is the deepest thing to learn from a settle scene, so it gets its own
section. *Latched finals* means: every state in the scene is a fixed
end-value with no time dependence — no `t` inside the cards' `reveal`, the
chain `state`s, or `toolsReveal`. The only `t` in the entire scene is in
the camera's `s` ramp (which clamps to a constant after 2.2s) and the four
`recap` glows (which each return to zero by ~5.8s). So from ~5.8s onward,
the scene is a genuinely static image.

Why does that matter? **Because narration is written and recorded *after*
the visuals lock, and the scene has to stretch to fit it.** This scene's
slot in the comp is VO-stretched to ~10.8s (per the manifest), but the
visual minimum is ~7s — the difference is pure hold. When the voiceover for
this beat comes in, it might run 5 seconds or 11; the scene has to be able
to hold for however long the words take. A scene whose final state is
*static* can be extended to any length safely — you're just holding a still
frame longer, and nothing is mid-animation to freeze at a random phase. If
instead this scene ended on something still moving (a glow looping, the
camera still drifting), you couldn't extend it without catching that motion
half-finished. Latched finals make the audio step downstream *painless*:
every boundary in this build stayed structurally identical through the
vo-sync precisely because every hold is extend-only by construction. The
crucial detail is that the recap pulses *also* respect this — each glow
fully decays back to zero *before* the hold begins, so the extend-safe
region is a clean static frame, not a paused wave.

> *"Is this the same as scene 1's settled hold?"* Yes — it's the same
> property, and it's not a coincidence that the *first* and *last* scenes
> both have it. Scene 1 ends on the assembled chain over an empty rail,
> holding still; scene 7 ends on the same chain over a full rail, holding
> still. Both are the scenes most likely to get stretched to fit narration
> (the open invites the viewer in; the close lets the thesis land), and
> both earn the right to be static because the frame itself is the payload.
> The rule generalizes: any scene that ends on a hold should end on a
> *latched* hold, so the hold is a value, not a paused motion.

## The honest weakness of a bookend — name it

A bookend has a real, frank tension, and you should understand it rather
than pretend it away: **a long static hold risks being dead air.** This
scene holds dead still from ~5.8s to ~10.8s — about five seconds of an
unchanging frame. That is, by any honest accounting, a stretch of showing a
picture that isn't moving. The choreography note says so plainly: this hold
is "ambient-dead but post-payoff and under the VO close; acceptable,
borderline." *Borderline* is the right word, and it's worth being precise
about why it's carried anyway:

1. **The frame is the payoff.** This isn't a transition holding for a beat —
   it's the *resolved thesis* of the whole video. The empty rail from scene
   1 is now four receipts deep; the question ("what fills those slots?") is
   answered; the chain is green. A viewer's eye genuinely wants a moment to
   read the completed trail (four cards of distinct evidence is real
   information), and the narration plays over exactly this hold to deliver
   the closing line. The stillness is the space for the idea to land. That's
   different in kind from a hold with nothing to look at.

2. **The video earned its ranking on the *middle*, not on this hold.** This
   build was judged *best tool-call visuals* of its batch — the evidence
   filmstrip accumulating in sync with each tool call, and the live Browser
   Use session folding into its own evidence card. The dynamism already
   happened across scenes 3–5. A bookend doesn't need to be dynamic; it
   needs to be *calm*, because calm is the correct register for "we're
   done." The bookend's contribution is the opposite of the middle's: a
   place to rest after it.

That said — don't launder the weakness into a virtue. It *is* a borderline
hold, and the honest improvement (the same one named for every long settle
in this house) is a low-amplitude ambient pattern that keeps the frame
alive without breaking the latched-final property — something that animates
but always returns to the same end-state, so the hold stays extend-safe.
The taste lesson is: ship the calm bookend, but know that "calm" and "dead"
sit a hair apart, and the line between them is whether the frame is worth
five seconds of looking. Here it is — barely, and only because it's the
payoff. The recap pulses help (they fill the first ~3 seconds of what would
otherwise be pure hold), which is part of why they're there at all.

## How to think about the whole scene

Walk the decisions in order and you can see the bookend's logic:

1. *What state do I show?* The exact settled end-state scene 6 latched —
   read through the same `<Rig/>`, every value a fixed final (chain green,
   tools grown, all four cards at `reveal: 1`).
2. *What's allowed to move?* Only the camera, and only as a *release* — a
   ~6% scale ease-back that says "done," not a move that goes somewhere.
3. *Is one gesture allowed?* One — the recap wave, four quiet pulses in call
   order, capped at `0.6` so it reads as *memory, not action*, then fully
   decayed before the hold.
4. *How do I keep the trail legible?* Skeleton bodies (the honest shape of
   evidence we don't have the words for), the folded session sitting as just
   another card — hierarchy and truth with no captions.
5. *How do I close the arc?* Return to the calm full frame, the same chain
   from scene 1 now green over a full rail — the empty question answered in
   place.
6. *How do I survive narration?* Latched finals → a static hold that
   stretches to any length without freezing a motion mid-flight.
7. *What's the honest cost?* A borderline-long dead hold — carried by the
   fact that the frame is the payoff, not by any motion.

There's no clever move in this scene, and there shouldn't be. The craft of
a bookend is *subtraction*: showing the resolved state and trusting it,
adding only the gentlest release and one quiet recap so the ending feels
like a release. The quality is in the restraint and in the continuity —
that the last frame is provably the same set piece as the first, the empty
rail now full.

## Exit state (this is the final frame of the video)

`chain all green (start/agent/response state "ok") · tools row grown
(toolsReveal 1) · all four evidence cards at rest (reveal 1) — Exa search,
two Firecrawl pages, the folded Browser Use session in slot 3 · every recap
glow decayed to 0 (last falls by ~5.8s) · stage at scale 0.94 (~6%
pull-back, clamped from 2.2s)`.

Nothing inherits this — it's where the video ends. But it is, by
construction, the answer to scene 1's frame: the same chain, the same
reserved rail, now with the four empty slots filled by the four receipts
the run produced and the workflow green beneath them. The arc is closed
because the last frame and the first are the same set piece, seen at the two
ends of one prompt's work — empty trail, then the trail with the receipts
sitting right there.
