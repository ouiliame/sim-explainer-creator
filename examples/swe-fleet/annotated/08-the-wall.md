# Scene 8 — `the-wall`  ·  archetype: **the money shot**

Source: `../source/scenes/TheWallScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the payoff. Everything before it was setup: scene 1 put the empty
backlog on screen, scenes 2–5 built and armed the fleet chain, scene 6
fanned the parallel container into five lanes, scene 7 followed one coding
lane end to end so you'd understand what a single instance does. This scene
is where the other four instances *land*, the `status` column flips row
after row to `done`, and the `pr` column fills with PR numbers. Read it as
the scene the whole video was pointed at — and read it for how restraint
pays off under pressure. A money shot is the moment most likely to tip into
showing off, and the discipline here is that it does the opposite: it slows
down and lets causality be legible.

---

## What this scene is for

The thesis of the video, stated plainly: *the backlog IS the worklist; the
fleet runs the open issues in parallel and writes each one done.* Scene 7
proved that on one row — the followed lane read its issue, opened a PR, and
marked its own row done. This scene has to prove it on the **whole queue**:
four more lanes finish, four more rows flip from `open` to `done`, four PR
numbers land, and the run resolves into a settled chain. One idea per scene
still holds: this scene is "the rest of the fleet finishes and the queue
empties." It is not "and also here's how parallel works" (that was scene 6)
or "here's what one engineer does" (scene 7). It only closes the loop those
scenes opened.

The single hardest thing this scene has to do is make a *concurrent* finish
read as *legible*. Five engineers running at once will finish whenever they
finish — and if you just flip four rows at once, the viewer learns nothing
and the frame turns to mush. So the scene's entire craft problem is: how do
you show "they finished independently, in no particular order" while keeping
each finish individually readable? The answer is the two ideas this scene
teaches — **scramble order** and the **cause→effect offset** — plus the
spectacle they buy: the `status` column flipping `done` one row at a time.

## What it looks like

Full frame, steady camera (`CAM_ALL`, the home framing). The four remaining
coding lanes — the ones still running at the end of scene 7 — finish one
after another, but *not* top to bottom. Each finish is a little event: the
Engineer block flips to a green ok ring, a pulse crosses the wire to its
GitHub block (which blips live, then settles ok), a second pulse crosses to
its Mark Done block (which blips live, then settles ok), and then — about a
second after the Engineer settled — that lane's **row on the backlog table
flips**: the `status` cell dips from `open` to `done`, the `pr` cell fills
with a PR number, the two cells flashing green and decaying to a faint
residue. The PR numbers land in *finish* order (#483, #484, #485, #486)
while the rows sit in *table* order — so the scramble is verifiable right
there in the data. Once the queue is empty, the fan of five lanes folds back
into the one lane the canvas actually holds, the container settles to a green
ok ring, and the chain settles green left to right: Schedule, then Get
Issues, then Fleet.

## The set piece is unchanged — this scene is pure state

Like every scene, this renders the one `<Stage/>`. It changes nothing about
the geometry; it only feeds different state props:

```tsx
<Stage
  cam={CAM_ALL}
  fan={fan}
  cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}
  sched={{state: schedOk ? "ok" : "none"}}
  query={{state: queryOk ? "ok" : "none"}}
  pill={{reveal: 1, swap: 1}}
  flipMix={flipMix}
  flipTint={flipTint}
  lanes={{0: ghostLane(0), 1: ghostLane(1), 3: ghostLane(3), 4: ghostLane(4),
          2: {eng: {state: "ok"}, gh: {state: "ok"}, md: {state: "ok"}}}}
/>
```

Everything that arrives on screen — the four finishing lanes, the four
flipping rows, the folding fan, the settling chain — is expressed as
functions of `t`. There is no new component, no new layout, no element that
exists only in this scene. The reason that matters: this is the busiest scene
in the video, and the temptation in a busy scene is to reach for a new visual
device to carry the load. Resisting that is what keeps it the same world as
scene 1.

> *"Why is `pill={{reveal: 1, swap: 1}}`?"* The schedule pill is still on
> screen, still reading `At 12:00 AM · Next: Mar 19, 12:00 AM` — it flipped
> to Mar 19 back in scene 5 when the clock fired (the run consumed *that*
> midnight; the next one is now a day later). `reveal: 1` keeps it present,
> `swap: 1` keeps it on the post-fire value. The pill is residue from an
> earlier scene that simply persists; the scene doesn't touch it. Carrying a
> settled value forward unchanged is itself a continuity decision — the armed
> schedule is a fact about the world now, not an animation.

> *"Why does lane 2 get `{eng/gh/md: {state: 'ok'}}` and no other props?"*
> Lane 2 is the *followed lane* — it finished on screen in scene 7, so it
> enters this scene already done. It doesn't re-finish; it just holds its three
> green ok rings. The scene's animation is entirely about the *other four*. The
> followed lane sitting still and green while the others finish around it is
> the visual statement "you already watched one of these; here are the rest."

## The camera doesn't move

```ts
cam = CAM_ALL = { px: 1395, py: 740, s: 0.7 }
```

Static, at the home framing — the whole set piece in view, backlog table on
top, chain below. No camera move at all.

> *"Scene 7 had a camera that traveled into the lane and back out — why does
> the money shot get a still camera?"* Because the work is the same shape as
> the framing. In scene 7 the camera had to *travel* — in to the lane to watch
> one engineer's tool calls, back out to watch the consequence land on the
> board — because one lane's detail and its consequence live in two different
> places. Here, four finishes are landing on the table *and* four lanes are
> settling in the container *at the same time*, and you need to see both at
> once. A camera move would force you to choose where to look in a moment when
> the whole point is that two surfaces resolve together — the lanes go green in
> the container *and* the rows flip on the table. So the camera holds the wide
> frame and lets the motion happen inside it. The beat shape of this scene —
> diffuse, four-things-at-once, table-and-container — *is* the full frame; you
> don't move a camera through it.
>
> *"Doesn't a still camera make the money shot feel flat?"* It would if
> nothing inside the frame moved. But this is the most internally active frame
> in the video — four cause→effect events overlapping, a status column flipping
> row by row, a fan folding, a chain settling. The dynamism is in the content,
> not the camera. Scene 7 earned its move because it had a still subject (one
> lane) that needed the camera to create motion; scene 8 has a moving subject
> and a still camera. That contrast between adjacent scenes is deliberate — it's
> part of why the run doesn't read as one repeated shape.

## The first idea: the finish is *scrambled*, and the scramble is product truth

This is the load-bearing decision of the scene, so spend time on it.

The four remaining lanes finish in this order (and in this build, a lane's id
*is* the table row it prices — so the order is rows *and* lanes at once):

```ts
GHOST_FINISH_ORDER = [4, 0, 3, 1]
FINISH_AT[lane] = 0.8 + i * 1.5   // for each lane at index i in that order
```

Walk it out:

| order `i` | lane / row that finishes | `FINISH_AT` | which issue | PR |
|---|---|---|---|---|
| 0 | lane 4 / row 4 (bottom) | 0.8s | S3 upload retries | #483 |
| 1 | lane 0 / row 0 (top) | 2.3s | OAuth redirect loop | #484 |
| 2 | lane 3 / row 3 (lower-mid) | 3.8s | Search debounce | #485 |
| 3 | lane 1 / row 1 (upper-mid) | 5.3s | Webhook null user | #486 |

(Row 2, CSV export crash / #482, is the followed row — it already finished in
scene 7, so it's not in this list. It enters done.)

So the rows do **not** flip top to bottom. They flip 4, then 0, then 3, then 1
— a deliberate shuffle. And because lane id equals row, the *spatial* finish
order in the fan scrambles in exactly the same way: bottom lane first, then
top, then lower-middle, then upper-middle. Nothing finishes in the order your
eye would predict from either the table or the fan.

> *"Why on earth scramble it? A tidy top-to-bottom flip would be cleaner."* It
> would be cleaner and it would be a **lie**. The fleet runs five engineers as
> a parallel container, and the product's own documentation says the result
> order of a parallel is not guaranteed — each instance is isolated and
> finishes when it finishes. A top-to-bottom flip would quietly assert an
> ordering that the product explicitly does not promise. The scramble is the
> docs' sentence, drawn: *order not guaranteed* isn't a caption on screen, it's
> the literal finish pattern. This is the same discipline as scene 1's empty
> `pr` column being empty *by construction* — the animation is constrained to
> only show what the product actually does. A clean lie is worse than an honest
> scramble.
>
> *"How was the specific order `[4, 0, 3, 1]` chosen?"* It's authored, not
> derived — there's no "correct" order, since the whole point is that there
> isn't one. But it's chosen against a constraint: it should look *un*-ordered
> from every angle. `[4, 0, 3, 1]` interleaves — the very bottom, then the very
> top, then lower-middle, then upper-middle — so neither the table nor the
> spatial fan reveals a pattern. Picking, say, `[1, 3, 4, 0]` would still be a
> shuffle, but `[4, 0, 3, 1]` maximizes the visual jump between consecutive
> finishes (bottom→top is the largest possible leap), which reads most clearly
> as "wherever, in any order." The order is engineered to look like no order.
>
> *"And the PR numbers — why do they look out of sequence on the table?"*
> That's the scramble made *verifiable in the data*, and it's the nicest detail
> in the scene. PR numbers are assigned in **finish** order, not table order.
> The followed lane finished first (scene 7) and took **#482**; then the four
> here finish 4, 0, 3, 1 and take **#483, #484, #485, #486** in that sequence.
> But the rows sit in table order, so reading the `pr` column top to bottom you
> get **#484, #486, #482, #485, #483** — visibly out of sequence. A viewer who
> notices the PRs aren't monotonic has *read the scramble straight off the
> board*: the numbers prove the rows didn't finish in row order. The data
> encodes the docs' guarantee; the table displays the proof.
>
> *"Why are the finish order and PR assignment defined in `data.ts` and not in
> the scene?"* Because `GHOST_FINISH_ORDER` and the PR-in-finish-order
> assignment are *facts about the demo run*, not facts about this scene's
> animation. They're declared next to the `ISSUES` data they describe, with a
> comment tying them to the docs' guarantee (`PR numbers are assigned in FINISH
> order … parallel result order isn't guaranteed; docs`). The scene reads them.
> Keep the run's truth in the data layer; keep timing in the scene.

The cadence is **1.5s** between finish starts (`i * 1.5`), beginning at 0.8s.
So the four lanes settle at 0.8, 2.3, 3.8, 5.3 — evenly spaced, a second and a
half apart. Note the split of concerns: the *order* is scrambled, but the
*rhythm* is perfectly even.

> *"Why scramble the order but keep the cadence metronomic?"* Because they
> carry two different messages and you only want to scramble one of them. The
> order says "parallel — finishes in no guaranteed sequence." The even 1.5s
> cadence says "but this is a legible, composed spectacle, not chaos." If you
> *also* jittered the timing, the scene would read as glitchy rather than as a
> steady wall accumulating. The choreography note puts it exactly: "Scrambled
> ORDER, even 1.5s CADENCE — the rhythm stays readable while the order says
> parallel." A steady beat is what lets the eye relax enough to notice that the
> rows are flipping out of order.
>
> *"Where does 1.5s come from?"* It's the spacing that lets each finish be its
> own readable event without the scene dragging. Each finish is a triplet that
> takes about 1.45s to play out (Engineer settles, pulse, GitHub, pulse, Mark
> Done, then the row flips ~1s after the Engineer). At 1.5s spacing the next
> lane's Engineer settles just as the previous lane's *row* is flipping — the
> two events interlock with essentially zero dead frames, which reads as
> "concurrent, but staggered," exactly the truth of five engineers finishing
> around the same time but not simultaneously. Tighter (say 0.8s) and the
> triplets would pile up illegibly; wider (say 2.5s) and four finishes would
> take twelve-plus seconds and the scene would sag.

## The second idea: the cause→effect offset (lane settles, THEN the row flips)

This is the move that makes the scramble *teachable* rather than just busy, and
it's what makes the status-column flip read as a *consequence* instead of a
decoration. Each finish is split into a lane triplet and then — a beat later —
the row flip.

For each ghost lane, keyed to its finish time `f = FINISH_AT[lane]`:

```ts
eng:    {highlighted: t < f,                    state: t >= f      ? "ok" : "none"}
gh:     {highlighted: t >= f+0.3  && t < f+0.45, state: t >= f+0.45 ? "ok" : "none"}
md:     {highlighted: t >= f+0.75 && t < f+0.9,  state: t >= f+0.9  ? "ok" : "none"}
edgeA:  {hi: pulseWindow(t, f,      f+0.2,  f+0.6, f+0.9)}
edgeB:  {hi: pulseWindow(t, f+0.45, f+0.65, f+1.0, f+1.3)}
pulseA: ramp(t, f,      f+0.35, EASING.inOut)
pulseB: ramp(t, f+0.45, f+0.8,  EASING.inOut)
```

And the row flip, in `flipMix`/`flipTint`, lands **0.95s after** the lane's `f`:

```ts
flipMix(r)  = ramp(t, f + 0.95, f + 1.45)                                  // f = FINISH_AT[r]
flipTint(r) = ramp(t, f+0.95, f+1.45) * (1 - 0.65 * ramp(t, f+2.0, f+3.0))
```

So the sequence for *each* finishing lane is a clean left-to-right cascade
down the lane, and *then* the board:

1. **At `f`:** the Engineer block drops its "working" highlight and takes a
   green **ok** ring. `pulseA` launches a dot down the first lane edge over
   `f`→`f+0.35`, with `edgeA` heating up. **The engineer finished its fix.**
2. **At `f+0.3`→`f+0.45`:** the GitHub block blips `highlighted` (live) for a
   beat, then at `f+0.45` flips to its own green **ok** ring; `pulseB` launches
   down the second edge over `f+0.45`→`f+0.8`. **The PR is opened.**
3. **At `f+0.75`→`f+0.9`:** the Mark Done block blips live, then at `f+0.9`
   takes its green **ok** ring. **The "mark done" write has executed.**
4. **At `f+0.95`→`f+1.45`:** *now* the table row flips — `status` switches
   `open`→`done`, `pr` fills, both cells flashing green. **The board shows it.**

The row flips therefore land at **1.75, 3.25, 4.75, 6.25s** — and that is the
literal "row after row" the narration speaks over. The status column becoming
a wall of `done` is the legible spectacle this whole archetype exists to
deliver.

> *"Why the ~1s delay between the lane settling and the row flipping? Why not
> flip the row the instant the engineer finishes?"* Because the delay *is* the
> causality, made visible. The story of this lane is "the engineer writes the
> fix → GitHub opens the PR → the Mark Done block updates the backlog row."
> Those are three blocks in series, and only the *last* one touches the table.
> If the row flipped the instant the Engineer settled, it would imply the
> *engineer* changed the table — but the engineer doesn't; the Mark Done block
> does, two blocks downstream. The 0.95s gap is exactly long enough to let the
> pulse cross both edges and the Mark Done block settle ok *first*, so the row
> flips visibly *after* the block that writes it. Cause, beat, effect. The row
> changes *because* Mark Done ran — and the offset is what lets you see the
> arrow.
>
> *"And this happens four times, overlapping — doesn't that get confusing?"*
> It would if the cause and effect weren't separated. Because each finish is a
> clean cascade with a held gap before the row flips, your eye can track four
> of them overlapping at 1.5s spacing — you see lane A's triplet fire, then lane
> B's Engineer settles while lane A's row is flipping, and so on. With a 1.5s
> gap against a ~1.45s triplet, each lane's row flips as the next lane's pulses
> fire, and the wall accumulates with essentially zero dead frames. The offset
> is precisely what lets them overlap *legibly*. Without it, four simultaneous
> flips would be noise; with it, they're a readable cascade.
>
> *"Why is `eng.highlighted = t < f` — why does the highlight turn off exactly
> when the ok ring turns on?"* Those four engineers have been holding a
> "working" highlight since scene 7 (the open question that scene left: "four
> still running"). The instant a lane finishes, its working highlight must
> release and its ok ring take over — a block can't be both "still working" and
> "done." So `highlighted: t < f` (working until `f`) and `state: "ok" when
> t >= f` are two faces of one transition. The block changes meaning at exactly
> one frame. The GitHub and Mark Done blocks use the same idiom but as a brief
> *blip* (`highlighted` true for a 0.15s window just before their ok), because
> those blocks were idle, not working — they light up only as the pulse reaches
> them, the way a downstream block flashes live as data arrives.

The pulse and edge-heat numbers are the same vocabulary scene 7 used for the
single lane, just keyed to each lane's `f` instead of one fixed time. Reusing
scene 7's exact shape is intentional — the viewer learned what one finish looks
like in scene 7, and seeing the identical gesture four more times here is what
makes "oh, these are the same thing, four more times" read instantly.

## The flip, the tint, and the residue — the status column becomes the wall

When a row flips, the `status` and `pr` cells change together, and three layers
act on them. Pulling them apart is worth it because each is a different signal.

**`flipMix(r)` — the text switch.** `ramp(t, f+0.95, f+1.45)` goes 0→1 over that
half-second. The `backlogRows` builder writes `done` and the PR number only once
`mix >= 0.5`; below 0.5 it writes `open` and an empty `pr` cell:

```ts
[ {text: it.issue},
  {text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER},   // "open" → "done"
  {text: mix < 0.5 ? "" : it.pr} ]                      // "" → "#48x"
```

So the value switches at the midpoint of the ramp. The rig's `cellTextOpacity`
carries a *dip* across that switch, but **only for the `status` and `pr`
columns** (`if (c === STATUS_COL || c === PR_COL)`): `Math.abs(mix - 0.5) * 4`
fades the cell to nothing as it approaches 0.5, then back up — so `open` fades
out and `done` fades in through empty; you never see a hard text cut. The
`issue` column is untouched (its text was always there). This is the DipSwap
idiom, applied per-cell, to exactly the two columns that change.

> *"Why dip the text through empty instead of just fading `done` in?"* Because
> the cell is *changing state*, not appearing. The `status` cell already held
> `open`; fading `done` in over it would imply the cell was always going to say
> `done` and is merely revealing it. The dip-through-empty says "this cell
> *changed* — it read `open`, now it reads `done`." It's the honest depiction of
> a write. And scoping the dip to `status`/`pr` only is correct: the `issue`
> column didn't change, so it must not flicker.

**`flipTint(r)` — the green output pulse, decaying to residue.** A green overlay
spans the two written columns (`status` + `pr` — `width: 2 * COL_W` starting at
`cellX(STATUS_COL)`), in the product's own table-tint color
`rgba(51,196,130,…)`. It pulses to full as the row flips, then **decays** by
`(1 - 0.65 * ramp(t, f+2.0, f+3.0))` — losing 65% of its strength over the
second after it lands, settling to a faint ~0.35-strength residue.

> *"Why does the tint decay instead of staying full?"* Because the bright green
> means *just happened* and the faint residue means *this was written by the
> run* (provenance). If every flipped row stayed full-bright green, the board
> would be a wall of uniform green with no hierarchy — you couldn't tell which
> row just landed from which landed three seconds ago. The decay creates a
> *recency gradient*: the row that just flipped glows, the earlier ones have
> faded to residue. And by the end, every `done` row carries the same faint
> residue — a quiet, permanent mark that says "this status was set by the
> fleet, not seeded." Bright = event, faint = history.
>
> *"Why is row 2 special — `flipMix(2) = 1`, `flipTint(2) = 0.35`?"* Row 2 is
> the followed row; it flipped on screen in scene 7 and enters this scene
> already `done`. So its mix is pinned to `1` (text already showing `done` /
> `#482`) and its tint is pinned to the settled residue `0.35` — it skips the
> pulse entirely, because its pulse already played a scene ago. It enters as
> history, not as an event. Carrying that one row's *settled residue* across the
> cut is the continuity that makes the freeze-cut from scene 7 pixel-identical.

By the end, the `status` column reads `done · done · done · done · done` top to
bottom and the `pr` column reads `#484 · #486 · #482 · #485 · #483` — five
rows of faint green residue, the queue empty. **The wall is the status column
fully flipped.** That contrast — five `open`s replaced by five `done`s, in
scrambled order, each one provably written by a lane — is the visual sentence
the entire video was built to say. No words on screen; the column does the
talking.

## The settle, in causal order

Once the four finishes are done (the last row, row 1, flips by ~6.75s), the run
resolves. Three things settle, in a specific order.

**The fan folds back to one lane.**
```ts
fan = 1 - ramp(t, 10.4, 11.6, EASING.inOut)
```
Over 10.4→11.6s the fan goes from 1 to 0 — the four ghost lanes slide back
behind the followed lane, leaving the one lane the canvas actually holds. This
is the literal *reverse* of scene 6's fan-out transform (same `laneTop(lane,
fan)` interpolation, run from 1 down to 0 instead of 0 up to 1), so the fold is
the symmetric bookend of the unfold. Eased in-out because this is a spatial move
(lanes traveling), and spatial moves get easing.

> *"Why fold the fan back at all? The lanes did real work — why hide them?"*
> Because the fan was a *runtime* thing — the parallel container holds one lane
> in the editor and spins up five instances only while running. When the run
> finishes, there's one lane again. Folding the fan is the run ending, shown
> structurally. It also returns the frame to the canonical state scene 9
> inherits (one lane, settled), so the bookend opens on a clean chain rather
> than a five-way fan. The work the lanes did didn't vanish — it's on the board,
> as five `done` rows. The lanes fold; their output stays.

**The chain settles green, left to right, in causal order.**
```ts
schedOk = t >= 11.9   // Schedule
queryOk = t >= 12.3   // Get Issues
contOk  = t >= 12.7   // Fleet container
```
Schedule goes green at 11.9, Get Issues at 12.3, the Fleet container at 12.7 —
**0.4s** apart, in flow order.

> *"Why settle the chain in that order, and why a quick tight sweep?"* The order
> is causal: the run flowed Schedule → Get Issues → Fleet, so the "done, all
> good" confirmation settles in the same direction — a little green wave running
> down the chain the way the work ran down it. Settling them in reverse, or all
> at once, would lose that read. The 0.4s spacing is much tighter than the 1.5s
> finish cadence on purpose: the finishes were the *content* (each a distinct
> event you needed to follow), but the settle is *punctuation* — a quick
> confirming sweep, not three more things to watch. A tight 0.4s reads as "and
> it's all done" in one gesture; a slow settle would imply the chain itself was
> still working, which it isn't. Pace encodes whether something is an event or a
> confirmation.
>
> *"Why does the container's `highlighted` flip to `!contOk`?"*
> `cont={{highlighted: !contOk, state: contOk ? "ok" : "none"}}` — the container
> holds a plain "live" highlight (carried from the run) right up until 12.7s,
> then swaps it for the green ok ring. Same one-frame transition as the
> Engineer blocks: a block is either still-live (highlighted) or done (ok),
> never both. The highlight releases exactly as the ok takes over. (Note the
> container settling green at 12.7 lands at the same instant as its own
> chain-step in the sweep — the container *is* the third chain node, so its
> sweep step and its highlight-release are the same event.)

## The animation, end to end

Putting the whole timeline together:

| time | event |
|---|---|
| 0.8s | lane 4 settles ok, pulses cross → row 4 flips (`done` / #483) ~1.75–2.25s |
| 2.3s | lane 0 settles ok, pulses cross → row 0 flips (`done` / #484) ~3.25–3.75s |
| 3.8s | lane 3 settles ok, pulses cross → row 3 flips (`done` / #485) ~4.75–5.25s |
| 5.3s | lane 1 settles ok, pulses cross → row 1 flips (`done` / #486) ~6.25–6.75s |
| 10.4→11.6s | the fan folds back to one lane |
| 11.9 / 12.3 / 12.7s | chain settles green: Schedule → Get Issues → Fleet |
| 12.7 → end | **hold** — folded fan, full wall of `done`, chain green, pill armed |

The hold from ~12.7s to the end of the scene (~2.8s of stillness) is a
latched-settle — nothing oscillates, every value is at its final state — so the
scene can stretch to fit narration without freezing a motion mid-flight, the
same property scene 1's hold has.

> *"Isn't a hold dead air right after the payoff?"* It's the payoff *landing*.
> The scene just emptied the queue; the held frame — every `status` reading
> `done`, every `pr` filled, the chain green, the pill still armed for the next
> midnight — is the thesis fully assembled, and letting it sit is letting the
> viewer read it. At ~2.8s it's deliberately *short* — the choreography flags
> tail holds as the build's known soft spot and caps this one tight, post-payoff
> and under cap, rather than letting it sag the way a longer hold would.

## How to think about the whole scene

Every decision here answers one question — "how do I show five independent
finishes empty the queue, honestly and legibly?":

1. *In what order do they finish?* Scrambled (`[4, 0, 3, 1]`), because the docs
   say parallel order isn't guaranteed → the scramble is product truth, not
   chaos, and the out-of-sequence PR numbers make it verifiable on the board.
2. *How do I keep four overlapping finishes readable?* The cause→effect offset
   — lane triplet fires, beat, row flips ~1s later → each finish is a clean
   cascade even while four overlap.
3. *How fast do they come?* 1.5s apart, with the order scrambled but the cadence
   even → overlapping enough to read as "concurrent," metered enough to follow
   each one and feel composed rather than glitchy.
4. *How does a row changing read as a write, not a reveal?* The dip-through-empty
   text switch on `status`/`pr` + a green tint pulse → "this cell *changed*."
5. *How do I keep the board from being a wall of uniform green?* Decay the tint
   to faint residue → a recency gradient and a provenance mark; the wall is
   `done` rows, not a green smear.
6. *How does the run end?* The fan folds (the reverse of scene 6) and the chain
   settles green in causal order at a tight 0.4s → "done," as punctuation, not
   as more events.
7. *Where's the camera?* Still, at the home framing → the motion is inside the
   frame; a camera move would force a choice in a moment built on seeing the
   lanes settle and the rows flip together.

The money shot isn't a single clever flourish — it's the same restraint the
rest of the video uses, applied to the busiest moment. The scramble is honesty;
the offset is legibility; the decay is hierarchy; the still camera is trust in
the content. Get those four right and "the queue empties, row after row" reads
as a sentence instead of a smear.

## Exit state (what scene 9 inherits)

`fan folded to one lane · all five rows flipped to `done` with a PR number,
`status`/`pr` residue at ~0.35 · `pr` column reads #484 / #486 / #482 / #485 /
#483 (table order; finish-order numbers) · chain green (Schedule / Get Issues /
Fleet all ok) · followed lane's three blocks ok · pill still armed at "Next:
Mar 19, 12:00 AM" · camera at CAM_ALL`. Scene 9 opens on exactly this frame and
eases the camera back ~6% to `CAM_OUT` for the bookend hold — every value
already latched, so the boundary is pixel-identical by construction.
