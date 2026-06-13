# Scene 8 — `the-signals`  ·  archetype: **the money shot**

Source: `../source/scenes/TheSignalsScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the payoff. Everything before it was setup: scene 1 put the empty
table on screen, scenes 2–4 built and armed the desk, scenes 5–7 ran one
analyst end to end so you'd understand what a single instance does. This scene
is where all five instances *land*, the empty columns from scene 1 finally
fill, and the two mispriced markets light up on their own. Read it as the
scene the whole video was pointed at — and read it for how restraint pays off
under pressure. A money shot is the moment most likely to tip into showing off,
and the discipline here is that it does the opposite: it slows down and lets
causality be legible.

---

## What this scene is for

The thesis of the video, stated plainly: *the table IS the desk; the run fills
it in, and the mispriced markets flag themselves.* Scene 7 proved that on one
row. This scene has to prove it on the **whole board** — four more estimates
land, the second flag joins the first, and the run resolves into a settled
desk. One idea per scene still holds: this scene is "the rest of the run
finishes and the board is complete." It is not "and also here's how parallel
works" (that was scene 6) or "here's what one analyst does" (scene 7). It only
closes the loop those scenes opened.

The single hardest thing this scene has to do is make a *concurrent* finish
read as *legible*. Five analysts running at once will finish whenever they
finish — and if you just fill four rows at once, the viewer learns nothing and
the frame turns to mush. So the scene's entire craft problem is: how do you
show "they finished independently, in no particular order" while keeping each
finish individually readable? The answer is the two ideas this scene teaches —
**scramble order** and the **cause→effect offset**.

## What it looks like

Full frame, steady camera (`CAM_ALL`, the home framing). The four remaining
analyst instances — the ones still running at the end of scene 7 — finish one
after another, but *not* top to bottom. Each finish is a little three-beat
event: the analyst's block flips to a green ok ring, a pulse crosses the wire
to its Update Board block, and then — about three-quarters of a second later —
that analyst's **row on the table fills in** with its estimate, edge, and
signal, the cells flashing green and decaying to a faint residue. Two of those
rows (Fed, and the GPT-6 row already done from scene 7) hold a *full-strength*
green signal cell — the `watch` flag, reading as color. The `—` rows stay
quiet. Once the work is done, the fan of five lanes folds back into the one
lane the canvas actually holds, the container settles to a green ok ring, and
the chain settles green left to right: Schedule, then Polymarket, then Desk.

## The set piece is unchanged — this scene is pure state

Like every scene, this renders the one `<Stage/>`. It changes nothing about
the geometry; it only feeds different state props:

```tsx
<Stage
  cam={CAM_ALL}
  fan={fan}
  cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}
  sched={{state: schedOk ? "ok" : "none"}}
  poly={{state: polyOk ? "ok" : "none"}}
  pill={{reveal: 1, swap: 1}}
  fillMix={fillMix}
  fillTint={fillTint}
  signalTint={signalTint}
  lanes={{0: ghostLane(0), 1: ghostLane(1), 3: ghostLane(3), 4: ghostLane(4),
          2: {ana: {state: laneSettled ? "ok" : "none"}, upd: {...}}}}
/>
```

Everything that arrives on screen — the four finishing lanes, the four filling
rows, the two flags, the folding fan, the settling chain — is expressed as
functions of `t`. There is no new component, no new layout, no element that
exists only in this scene. The reason that matters: this is the busiest scene
in the video, and the temptation in a busy scene is to reach for a new visual
device to carry the load. Resisting that is what keeps it the same world as
scene 1.

> *"Why is `pill={{reveal: 1, swap: 1}}`?"* The schedule pill is still on
> screen, still reading `Next: Jun 12, 4:00 PM` — it flipped to 4:00 PM back
> in scene 5 when the clock fired, and it stays flipped. `reveal: 1` keeps it
> present, `swap: 1` keeps it on the post-fire value. The pill is residue from
> an earlier scene that simply persists; the scene doesn't touch it. Carrying
> a settled value forward unchanged is itself a continuity decision — the
> armed schedule is a fact about the world now, not an animation.

## The camera doesn't move

```ts
cam = CAM_ALL = { px: 1200, py: 735, s: 0.78 }
```

Static, at the home framing — the whole set piece in view, table on top, chain
below. No camera move at all.

> *"Scene 7 had a three-stop camera move and it was called the build's best
> camera idea — why does the money shot get a still camera?"* Because the work
> is the same shape as the framing. In scene 7 the camera had to *travel* — in
> to the lane to watch the tool calls, back out to watch the consequence land
> on the board — because one analyst's detail and its consequence live in two
> different places. Here, four finishes are landing on the table *and* four
> lanes are settling in the container *at the same time*, and you need to see
> both at once. A camera move would force you to choose where to look in a
> moment when the whole point is that two surfaces resolve together. So the
> camera holds the wide frame and lets the motion happen inside it. The beat
> shape of this scene — diffuse, four-things-at-once, table-and-container —
> *is* the full frame; you don't move a camera through it.
>
> *"Doesn't a still camera make the money shot feel flat?"* It would if
> nothing inside the frame moved. But this is the most internally active frame
> in the video — four cause→effect triplets overlapping, a fan folding, a
> chain settling. The dynamism is in the content, not the camera. Scene 7
> earned its move because it had a still subject (one lane) that needed the
> camera to create motion; scene 8 has a moving subject and a still camera.
> That contrast between adjacent scenes is deliberate — it's part of why the
> run doesn't read as one repeated shape.

## The first idea: the finish is *scrambled*, and the scramble is product truth

This is the load-bearing decision of the scene, so spend time on it.

The four remaining instances finish in this order:

```ts
GHOST_FINISH_ORDER = [1, 4, 0, 2]
FINISH_AT[row] = 0.6 + i * 1.4   // for each row at index i in that order
```

Walk it out. The order is *table rows*, not lanes and not positions:

| order `i` | row that finishes | `FINISH_AT[row]` | which market |
|---|---|---|---|
| 0 | row 1 | 0.6s | ETH $5k in 2026 |
| 1 | row 4 | 2.0s | La Niña by winter |
| 2 | row 0 | 3.4s | Fed cut by June |
| 3 | row 2 | 4.8s | Avatar 3 tops $2B |

(Row 3, GPT-6, is the followed row — it already finished in scene 7, so it's
not in this list. `FOLLOWED_ROW = 3`.)

So the rows do **not** fill top to bottom. They fill 1, then 4, then 0, then 2
— a deliberate shuffle. And the *spatial* finish order scrambles too, because
of a second mapping:

```ts
ROW_FOR_LANE = [1, 0, 3, 4, 2]   // lane (top→bottom) → table row it prices
```

The four ghost lanes that are still running are lanes 0, 1, 3, 4 (lane 2 is
the followed lane, already done). Compose the two mappings — each lane prices a
row, each row has a finish time — and you get:

| lane (spatial) | prices row | finishes at |
|---|---|---|
| 0 (top ghost) | row 1 | 0.6s |
| 3 (below mid) | row 4 | 2.0s |
| 1 (near top) | row 0 | 3.4s |
| 4 (bottom) | row 2 | 4.8s |

The lanes finish in spatial order 0, 3, 1, 4 — top, lower-middle, upper,
bottom. Scrambled on the table *and* scrambled in space. Nothing finishes in
the order your eye would predict from either the table or the fan.

> *"Why on earth scramble it? A tidy top-to-bottom fill would be cleaner."* It
> would be cleaner and it would be a **lie**. The desk runs five analysts as a
> parallel container, and the product's own documentation says the result
> order of a parallel is not guaranteed — each instance is isolated and
> finishes when it finishes. A top-to-bottom fill would quietly assert an
> ordering that the product explicitly does not promise. The scramble is the
> docs' sentence, drawn: *order not guaranteed* isn't a caption on screen, it's
> the literal finish pattern. This is the same discipline as scene 1's empty
> columns being empty *by construction* — the animation is constrained to only
> show what the product actually does. A clean lie is worse than an honest
> scramble.
>
> *"How was the specific order `[1, 4, 0, 2]` chosen?"* It's authored, not
> derived — there's no "correct" order, since the whole point is that there
> isn't one. But it's chosen against a constraint: it should look *un*-ordered
> from every angle. `[1, 4, 0, 2]` interleaves — a near-bottom row, then the
> very bottom, then the top, then the middle — so neither the table nor the
> spatial fan reveals a pattern. Picking, say, `[0, 1, 2, 4]` would have filled
> almost top-to-bottom and undone the entire point. The order is engineered to
> look like no order.
>
> *"Why is the scramble defined in `data.ts` and not in the scene?"* Because
> the lane→row assignment (`ROW_FOR_LANE`) and the finish order
> (`GHOST_FINISH_ORDER`) are *facts about the demo run*, not facts about this
> scene's animation. They're declared next to the `MARKETS` data they describe,
> with a comment tying them to the docs' guarantee. The scene reads them. If
> another scene ever needed to reference which lane priced which row, it'd read
> the same source. Keep the run's truth in the data layer; keep timing in the
> scene.

The cadence is **1.4s** between finish starts (`i * 1.4`), beginning at 0.6s.
So the four lanes settle at 0.6, 2.0, 3.4, 4.8 — evenly spaced, a bit over a
second apart.

> *"Where does 1.4s come from?"* It's the spacing that lets each finish be its
> own readable event without the scene dragging. Each finish is a triplet that
> takes about 1.2s to play out (lane settles, pulse crosses, row fills 0.7s
> later over a 0.5s ramp). At 1.4s spacing the triplets *overlap slightly* —
> the next lane settles while the previous row is still filling — which reads
> as "concurrent, but staggered," exactly the truth of five analysts finishing
> around the same time but not simultaneously. Tighter (say 0.8s) and the
> triplets would pile up illegibly; wider (say 2.5s) and four finishes would
> take ten-plus seconds and the scene would sag. 1.4s is the overlap that says
> "all roughly at once, but you can still follow each one."

## The second idea: the cause→effect offset (lane settles, THEN the row fills)

This is the move that makes the scramble *teachable* rather than just busy.
Each finish is split into two events with a deliberate gap between them.

For each ghost lane, keyed to its finish time `f = FINISH_AT[ROW_FOR_LANE[lane]]`:

```ts
ana:   {highlighted: t < f,                  state: t >= f ? "ok" : "none"}
upd:   {highlighted: t >= f+0.45 && t < f+0.6, state: t >= f+0.6 ? "ok" : "none"}
edgeA: {hi: pulseWindow(t, f, f+0.2, f+0.6, f+0.9)}
pulseA: ramp(t, f, f+0.35, EASING.inOut)
```

And the row fill, in `fillMix`/`fillTint`, lands **0.7s after** the lane's `f`:

```ts
fillMix(r) = ramp(t, f + 0.7, f + 1.2)        // f = FINISH_AT[r]
fillTint(r) = ramp(t, f+0.7, f+1.2) * (1 - 0.65 * ramp(t, f+1.7, f+2.7))
```

So the sequence for *each* finishing lane is:

1. **At `f`:** the Analyst block drops its "working" highlight and takes a
   green **ok** ring. A pulse (`pulseA`) launches down the lane edge over
   `f`→`f+0.35`, with the edge heating up (`edgeA`, a pulseWindow). This is the
   **cause** — the analyst finished, and its result travels to the Update Board.
2. **At `f+0.45`→`f+0.6`:** the Update Board block blips `highlighted` (live)
   for a beat, then at `f+0.6` flips to its own green **ok** ring. The write
   landed.
3. **At `f+0.7`→`f+1.2`:** *now* the table row fills — `agent_est`, `edge`, and
   `signal` switch from empty to their values, the cells flashing green. This
   is the **effect** — the board updates because the lane wrote to it.

> *"Why the 0.7s delay between the lane settling and the row filling? Why not
> fill the row the instant the analyst finishes?"* Because the delay *is* the
> causality, made visible. The story of this desk is "the analyst computes an
> estimate → the Update Board block writes it → the table changes." Those are
> three steps with real direction: the table changes *because* the lane wrote
> to it. If the row filled at the same instant the analyst settled, the two
> would read as one event and the viewer would lose the arrow — it'd look like
> the table and the lane are the same thing animating together, rather than one
> causing the other. The 0.7s gap lets the eye see the cause complete (analyst
> ok → pulse → Update Board ok) and *then* watch the consequence arrive on the
> board. Cause, beat, effect. It's the same lesson scene 7 taught with its
> camera ("leave the detail to go watch the consequence"), done here with time
> instead of camera.
>
> *"And this happens four times, overlapping — doesn't that get confusing?"*
> It would if the cause and effect weren't separated. Because each finish is a
> clean two-part gesture with a held gap, your eye can track four of them
> overlapping at 1.4s spacing — you see lane A's cause, then lane B's cause
> arrives while lane A's effect (the row) is landing, and so on. The offset is
> precisely what lets them overlap *legibly*. Without it, four simultaneous
> fills would be noise; with it, they're a readable cascade.
>
> *"Why is `ana.highlighted = t < f` — why does the highlight turn off exactly
> when the ok ring turns on?"* Those four ghost analysts have been holding a
> "working" highlight since scene 7 (the open question that scene left: "four
> still running"). The instant a lane finishes, its working highlight must
> release and its ok ring take over — a block can't be both "still working" and
> "done." So `highlighted: t < f` (working until `f`) and `state: "ok" when
> t >= f` are two faces of one transition. The block changes meaning at exactly
> one frame.

The pulse and edge-heat numbers are the same vocabulary scene 7 used for the
single lane, just keyed to each lane's `f` instead of one fixed time:
`pulseA = ramp(f, f+0.35, inOut)` (the dot crosses in ~0.35s), edge heat
`pulseWindow(f, f+0.2, f+0.6, f+0.9)` (heats over 0.2s, holds, cools by 0.9s).
Reusing scene 7's exact shape is intentional — the viewer learned what one
finish looks like in scene 7, and seeing the identical gesture four more times
here is what makes "oh, these are the same thing, four more times" read
instantly.

## The fill, the tint, and the residue — three layers on the cells

When a row fills, three things happen to its `agent_est`/`edge`/`signal` cells,
and they're worth separating because each is a different signal.

**`fillMix(r)` — the text switch.** `ramp(t, f+0.7, f+1.2)` goes 0→1 over that
half-second. The table's `boardRows` builder writes the values only once
`mix >= 0.5` (the `filled` boolean). So the text appears at the midpoint of the
ramp. The rig's `cellTextOpacity` carries a *dip* across that switch
(`Math.abs(mix - 0.5) * 4`) — the empty cell fades down to nothing as it
approaches 0.5, then the filled text fades up — so you never see text
hard-cut; it crossfades through empty. This is the DipSwap idiom, applied
per-cell.

> *"Why switch text at the midpoint instead of just fading the value in?"*
> Because the cell is changing from one state (empty) to another (a number),
> not just appearing. Fading a value in from nothing would imply the cell was
> always going to hold that value and is merely revealing it. The dip-through-
> empty says "this cell *changed* — it was blank, now it holds a result." It's
> the honest depiction of a write.

**`fillTint(r)` — the green output pulse, decaying to residue.** A green
overlay (`rgba(51,196,130,...)`) spans the three written columns. It pulses to
full as the row fills, then **decays** by `(1 - 0.65 * ramp(f+1.7, f+2.7))` —
losing 65% of its strength over the second after it lands, settling to a faint
~0.35-strength residue.

> *"Why does the tint decay instead of staying full?"* Because the bright green
> means *just happened* and the faint residue means *this was produced by the
> run* (provenance). If every filled cell stayed full-bright green, the board
> would be a wall of green with no hierarchy — you couldn't tell which row just
> landed from which landed three seconds ago. The decay creates a *recency
> gradient*: the row that just filled glows, the earlier ones have faded to
> residue. And by the end, every estimate cell carries the same faint residue —
> a quiet, permanent mark that says "this column was written by the desk, not
> seeded." It's the residue hierarchy the whole video uses: bright = event,
> faint = history.

**`signalTint(r)` — the flag that does NOT decay.** This is the second flag, and
the payoff of the scene's thesis.

```ts
signalTint(r) =
  r === FOLLOWED_ROW ? 1                                        // GPT-6, from scene 7
  : r === 0           ? ramp(t, FINISH_AT[0]+0.7, FINISH_AT[0]+1.3)  // Fed, lands here
  : 0                                                          // the — rows: nothing
```

The signal cell of a flagged row gets its *own* green overlay
(`rgba(51,196,130,0.3)` at full strength) that **never decays**. Row 3 (GPT-6)
holds it at `1` — carried in from scene 7. Row 0 (Fed) ramps it up as the Fed
row finishes (`FINISH_AT[0] = 3.4`, so ~4.1→4.7s). Every other row gets `0` —
their signal cells say `—` and stay completely quiet.

> *"Why does the signal residue stay full when the est/edge residue decays?"*
> Because they mean different things. The est/edge tint is *provenance* — a
> faint "this was computed" mark on every written cell. The signal tint is the
> *answer* — "this market is mispriced, watch it." The answer is the whole
> point of the desk; it must not fade into the background with the
> bookkeeping. So the est/edge residue decays to faint history, but the two
> `watch` cells keep burning at full. By the end of the scene you have a board
> where five rows carry faint provenance residue and exactly two cells — Fed
> and GPT-6 — burn green. **The mispriced markets flagged themselves**, in
> color, with no word on screen. That contrast (faint everywhere, bright on
> two) is the visual sentence the entire video was built to say.
>
> *"Why those two rows — Fed and GPT-6?"* It's not a styling choice; it's
> arithmetic from the data. `signal = "watch"` exactly when `|edge| ≥ 0.08`,
> and `edge = agent_est − odds`. Fed: 0.45 − 0.32 = 0.13 (watch). GPT-6:
> 0.71 − 0.55 = 0.16 (watch). The other three rows have edges of −0.03, −0.01,
> −0.04 — all under the 0.08 threshold, so `—`. The two flags are the two rows
> where the analyst's estimate diverged enough from the crowd's odds to matter.
> The scene doesn't decide which rows flag; the data does, and the scene
> faithfully lights exactly those.

## The settle, in causal order

Once the four finishes are done (the last, row 2, fills by ~6.0s), the run
resolves. Three things settle, in a specific order:

**The fan folds back to one lane.**
```ts
fan = 1 - ramp(t, 7.6, 8.6, EASING.inOut)
```
Over 7.6→8.6s the fan goes from 1 to 0 — the four ghost lanes slide back
behind the followed lane, leaving the one lane the canvas actually holds. Eased
in-out because this is a spatial move (lanes traveling), and spatial moves get
easing.

> *"Why fold the fan back at all? The instances did real work — why hide
> them?"* Because the fan was a *runtime* thing — the parallel container holds
> one lane in the editor and spins up five instances only while running. When
> the run finishes, there's one lane again. Folding the fan is the run ending,
> shown structurally. It also returns the frame to the canonical state scene 9
> inherits (one lane, settled), so the bookend opens on a clean desk rather
> than a five-way fan. The work the ghosts did didn't vanish — it's on the
> board, as residue. The lanes fold; their output stays.

**The inner lane's ok-rings release as the container absorbs them.**
```ts
laneSettled = t < 9.4
// lane 2: ana/upd state = laneSettled ? "ok" : "none"
```
The followed lane's own ok rings (carried since scene 7) hold until 9.4s, then
release — at the same moment the container takes its ok ring.

**The chain settles green, left to right, in causal order.**
```ts
schedOk = t >= 8.9   // Schedule
polyOk  = t >= 9.15  // Polymarket
contOk  = t >= 9.4   // Desk container
```
Schedule goes green at 8.9, Polymarket at 9.15, the Desk container at 9.4 —
**0.25s** apart, in flow order.

> *"Why settle the chain in that order, and why so tight (0.25s)?"* The order is
> causal: the run flowed Schedule → Polymarket → Desk, so the "done, all good"
> confirmation settles in the same direction — a little green wave running down
> the chain the way the work ran down it. Settling them in reverse, or all at
> once, would lose that read. The 0.25s spacing is *much* tighter than the 1.4s
> finish cadence on purpose: the finishes were the *content* (each one a
> distinct event you needed to follow), but the settle is *punctuation* — a
> quick confirming sweep, not four things to watch. A tight 0.25s reads as "and
> it's all done" in one gesture; a slow settle would imply the chain itself was
> still working, which it isn't. Pace encodes whether something is an event or
> a confirmation.
>
> *"Why does the container's `highlighted` flip to `!contOk`?"*
> `cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}` — the
> container holds a plain "live" highlight (carried from the run) right up
> until 9.4s, then swaps it for the green ok ring. Same one-frame transition as
> the analyst blocks: a block is either still-live (highlighted) or done (ok),
> never both. The highlight releases exactly as the ok takes over.

## The animation, end to end

Putting the whole timeline together:

| time | event |
|---|---|
| 0.6s | lane 0 settles ok, pulse crosses → row 1 fills ~1.3–1.8s |
| 2.0s | lane 3 settles ok, pulse crosses → row 4 fills ~2.7–3.2s |
| 3.4s | lane 1 settles ok, pulse crosses → row 0 (Fed) fills ~4.1–4.6s; Fed flag burns up ~4.1–4.7s |
| 4.8s | lane 4 settles ok, pulse crosses → row 2 fills ~5.5–6.0s |
| 7.6→8.6s | the fan folds back to one lane |
| 8.9 / 9.15 / 9.4s | chain settles green: Schedule → Polymarket → Desk |
| 9.4s | inner lane's ok rings release; container takes its ok ring |
| 9.4 → end | **hold** — settled chain, fully priced board, two flags burning |

The hold from ~9.4s to the end of the scene (~5.6s of stillness) is a
latched-settle — nothing oscillates, every value is at its final state — so the
scene can stretch to fit narration without freezing a motion mid-flight, the
same property scene 1's hold has.

> *"Isn't a 5.6s hold dead air right after the payoff?"* It's the payoff
> *landing*. The scene just resolved the entire run; the held frame — every
> column filled, two cells burning, the chain green, the pill still armed for
> next hour — is the thesis fully assembled, and letting it sit is letting the
> viewer read it. It's the breath after the point, and it's where the
> scene's narration plays. (The choreography notes are honest that this hold,
> like scene 9's, is a known soft spot — the build earned its #1 ranking on the
> *diversity of the middle*, not on these tail holds. Worth knowing: even the
> best build has holds it would tighten.)

## How to think about the whole scene

Every decision here answers one question — "how do I show five independent
finishes landing on a shared board, honestly and legibly?":

1. *In what order do they finish?* Scrambled (`GHOST_FINISH_ORDER`), because
   the docs say parallel order isn't guaranteed → the scramble is product
   truth, not chaos.
2. *How do I keep four overlapping finishes readable?* The cause→effect offset
   — lane settles, beat, row fills 0.7s later → each finish is a clean two-part
   gesture even while four overlap.
3. *How fast do they come?* 1.4s apart → overlapping enough to read as
   "concurrent," spaced enough to follow each one.
4. *How does a row changing read as a write, not a reveal?* The dip-through-
   empty text switch + a green tint pulse → "this cell changed."
5. *How do I keep the board from being a wall of green?* Decay the est/edge
   tint to faint residue → a recency gradient and a provenance mark.
6. *How does the answer stand out from the bookkeeping?* The two `watch` cells
   keep a full-strength residue that never decays → the mispriced markets flag
   themselves, in color.
7. *How does the run end?* The fan folds and the chain settles green in causal
   order at a tight 0.25s → "done," as punctuation, not as four more events.
8. *Where's the camera?* Still, at the home framing → the motion is inside the
   frame; a camera move would force a choice in a moment built on seeing two
   surfaces resolve together.

The money shot isn't a single clever flourish — it's the same restraint the
rest of the video uses, applied to the busiest moment. The scramble is honesty;
the offset is legibility; the decay is hierarchy; the still camera is trust in
the content. Get those four right and "the whole board lands" reads as a
sentence instead of a smear.

## Exit state (what scene 9 inherits)

`fan folded to one lane · all five rows filled, est/edge/signal residue at
~0.35 · two signal cells (Fed row 0, GPT-6 row 3) at full-strength green · chain
green (Schedule / Polymarket / Desk all ok) · pill still armed at "Next:
Jun 12, 4:00 PM" · camera at CAM_ALL`. Scene 9 opens on exactly this frame and
eases the camera back ~6% to `CAM_OUT` for the bookend hold — every value
already latched, so the boundary is pixel-identical by construction.
