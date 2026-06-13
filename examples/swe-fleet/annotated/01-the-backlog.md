# Scene 1 — `the-backlog`  ·  archetype: **assemble**

Source: `../source/scenes/TheBacklogScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the opening scene of the video, and it does exactly one thing: it shows
you the table the whole fleet is built around. Read it as a worked example —
every choice below is one you'll make again in your own first scene.

---

## What this scene is for

The video's whole story is "here's a backlog of issues → here's the fleet that
clears it overnight." So the first scene has to put the **backlog** on screen as
a concrete object, and — this is the important part — it has to show two of its
columns in a *waiting* state: every `status` reads `open`, every `pr` cell is
empty. That waiting is a question you're planting in the viewer's head ("who
closes these out?"), and the rest of the video is the answer.

So the rule the scene follows is *one idea per scene*: this scene is "here is
the backlog," full stop. No workflow, no schedule, no run, no motion beyond the
table arriving. Resist the urge to also introduce the chain or the container
here — they get their own scene.

## What it looks like

A three-column table — `issue · status · pr` — centered in frame, with five
rows. The `issue` cells are filled with bug titles; every `status` cell reads
`open`; every `pr` cell is blank. The table fades in, the rows populate top to
bottom, one row briefly gets a selection highlight, and then it just sits there.

## The one real decision: use the real table, and render the *whole* set piece

The scene renders this and almost nothing else:

```tsx
<Stage
  cam={CAM_TABLE}
  tableIn={tableIn}
  rowTextReveal={rowTextReveal}
  cellHi={cellHi}
  sched={{hidden: true}}
  query={{hidden: true}}
  cont={{hidden: true}}
  edge1={{opacity: 0}}
  edge2={{opacity: 0}}
  lanes={{2: {eng: {hidden: true}, gh: {hidden: true}, md: {hidden: true}, edgeIn: {opacity: 0}, edgeA: {opacity: 0}, edgeB: {opacity: 0}}}}
/>
```

Two things to take from this.

**Use `SimTable`, the real product table — never a hand-built grid.** The data
the fleet works on is a Sim table (the `backlog`), so the surface on screen is
the actual table component, fed real columns (`BACKLOG_COLUMNS` in `data.ts`)
and real rows. You are never designing a table here; you're configuring the one
that exists.

**Notice the chain, the container, and the entire coding lane are all present —
just `hidden`.** This is the part people get wrong. The instinct is "scene 1 is
only the table, so only render the table." Don't. There is *one* set piece
(`<Stage/>`) for the entire video, and every scene renders all of it, turning
pieces on and off with state props. Here the chain's visibility is set to zero:
`sched / query / cont` are `{hidden: true}`, both outer edges are `{opacity:
0}`, and — note this — the followed lane *inside* the container is muted too,
via the nested `lanes={{2: {...}}}` prop, hiding its Engineer / GitHub / Mark
Done blocks and all three of its inner edges.

> *"Why the extra `lanes={{2: …}}` line — isn't hiding `cont` enough to hide
> what's inside it?"* No, and this is a real subtlety of this set piece that
> the market-desk twin doesn't have. The container's contents (the followed
> lane and its edges) are not children that inherit the container's opacity —
> the rig renders the mid lane's blocks as absolutely-positioned siblings whose
> opacity comes from `visOpacity(midLane?.eng)` etc., not from the container's
> `op`. So `cont: {hidden: true}` blanks the *box*, but the lane blocks would
> still draw on their own unless you explicitly mute them. Hiding the box and
> hiding its interior are two separate switches; scene 1 throws both. The lane
> is `lanes[2]` because lane 2 is the followed (middle) lane — the four fan
> ghosts (lanes 0,1,3,4) only render when `fan > 0`, which is also zero here,
> so they cost nothing and need no entry.

> *"Why bother rendering things I can't see?"* Because of what happens at the
> cut into scene 2. Scene 2 brings the chain in and eases the camera out. If
> scene 1 didn't render the chain at all and scene 2 suddenly mounted it, you'd
> risk a one-frame jump — the table reflowing, a layout shift, a flash. By
> rendering the same single set piece in both scenes and only animating
> visibility, the boundary between them is identical by construction.
> Continuity stops being something you check and becomes something you can't
> break.

## The camera

```ts
cam = CAM_TABLE = { px: CENTER_X, py: tableCenter().y, s: 1.35 }
```

The camera is a transform of the fixed layout (`cameraTo(px, py, s)`): `px, py`
is the stage point that ends up in the center of the 1920×1080 viewport, `s` is
the zoom. Here it's centered on the table — `px = CENTER_X = 1410` is the
horizontal center of the 2820-wide stage, `py = tableCenter().y` is the table's
own vertical midpoint — at **1.35×**.

> *"Why is `px` a named constant and `py` a function call, instead of literal
> numbers?"* Because the camera is derived from the layout, never hand-placed.
> `CENTER_X` and `tableCenter()` both live in `layout.ts`; if the table's size
> or position ever changes, the camera that frames it moves with it
> automatically. Hard-coding `px: 1410` would work today and silently
> mis-frame the table the day someone adds a column. The camera reads the
> geometry; it doesn't duplicate it.

> *"Why 1.35 and not just 1.0?"* The table is the hero of this scene, so it's
> framed well above neutral. Neutral — the framing used once the whole fleet is
> on screen — is `CAM_ALL`'s `s: 0.7`. The gap between `1.35` here and `0.7`
> next scene is deliberate and large: in scene 2 the camera *eases out* from
> `CAM_TABLE` to `CAM_ALL` (`camMix(CAM_TABLE, CAM_ALL, ramp(0.3, 2.4,
> EASING.inOut))`), and that pull-back is what makes the fleet feel like it's
> *assembling around* the backlog rather than just appearing. The table glides
> to the top of frame and the empty lower canvas opens up underneath it. So the
> scene-1 zoom isn't arbitrary; it's the first half of a camera move that
> completes in scene 2. (The wider 1.35→0.7 swing here vs. market-desk's
> 1.1→0.78 is because this set piece is taller — a table *plus* a chain *plus*
> a container — so `CAM_ALL` has to sit further back to hold all of it.)

## The values, and why the empty cells are empty *by construction*

All five rows come from `ISSUES` in `data.ts` (every on-screen value traces to
there):

| issue | status | pr |
|---|---|---|
| OAuth redirect loop | open | |
| Webhook null user | open | |
| CSV export crash | open | |
| Search debounce | open | |
| S3 upload retries | open | |

The `status` is `open` and the `pr` is blank, and the way they're blank matters.
The rig builds the cell matrix through `backlogRows(flipMix)`, where `flipMix(r)`
is a per-row 0→1 "has this row been completed" amount:

```ts
const mix = flipMix(r);
[ {text: it.issue},
  {text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER},   // "open" : "done"
  {text: mix < 0.5 ? "" : it.pr} ]                     // "" : "#48x"
```

In this scene no `flipMix` is passed at all — the rig defaults it to `() => 0` —
so every row's `mix` is `0`, every `status` resolves to `STATUS_BEFORE` (`open`),
and every `pr` resolves to the empty string. The blanks are not "blank because
we styled them blank"; they are blank because **a row that hasn't been worked
shows no PR.** Keep this property. It's the same reason the table never animates
on its own: a Sim table only changes when something writes to it. The entire
back half of the video is `flipMix` crossing `0.5` row by row as each lane
finishes — `open → done`, empty → `#482`. If you ever find yourself making a
status flip or a PR number appear without a block causing it, you've broken the
one rule that keeps the video an honest depiction of how the product works.

> *"The PR numbers aren't in order — #484, #486, #482, #485, #483. Bug?"* No,
> it's deliberate and it's grounded. `ISSUES` lists PRs in *finish* order across
> a single repo (`#482`–`#486`), but the rows sit in *table* order. A Parallel
> container's result order isn't guaranteed (the docs say so explicitly), so the
> issue that finishes first doesn't have to be the issue on row 1. None of that
> is visible in scene 1 — every `pr` is empty here — but the data is authored so
> that when the cells fill in scenes 7–8, the scramble is real and verifiable,
> not faked. You set the honest data up front even when the scene that pays it
> off is sixty seconds away.

## The animation, beat by beat

Two tiny helpers do all the timing. `ramp(t, t0, t1)` goes from 0 to 1 as the
clock `t` (in seconds) crosses `t0`→`t1`, clamped outside that window.
`pulseWindow(t, a0, a1, b0, b1)` goes up over `a0`→`a1`, holds, then comes back
down over `b0`→`b1` (it's literally `min(ramp(a0,a1), 1 − ramp(b0,b1))`). That's
the whole vocabulary; everything is built from these two.

### (a) The table fades in — `tableIn = ramp(t, 0.2, 0.9)`

The entire table's opacity comes up over **0.2s → 0.9s**. `tableIn` is passed
straight through to the wrapping `<div>`'s `opacity` and gates the table
mounting at all (`tableIn > 0 ? … : null`).

> *"Why start at 0.2 instead of 0.0?"* A short beat of empty frame before
> anything appears reads as a deliberate open. Starting at 0.0 makes the first
> frame feel like the render was already mid-load.
>
> *"Why ~0.7 seconds — why not snappier?"* This is the establishing shot. It
> gets a calm, unhurried entrance. Later scenes, where things are happening,
> move faster. Pace is a signal: a slow entrance says "settle in and look."
>
> *"Why no easing curve?"* `ramp` takes an optional `easing` argument and this
> call omits it, so it's linear. A fade has no spatial momentum — nothing is
> moving through space, only opacity changing — so an ease-in/out would be
> invisible. Easing is reserved for things that travel (the camera moves and
> the fan all pass `EASING.inOut`); a plain opacity ramp is left linear.

### (b) The rows populate top to bottom — `rowTextReveal(r) = ramp(t, 1.1 + r*0.35, 1.7 + r*0.35)`

Each row's text reveals on its own 0.6-second ramp, and each row starts **0.35
seconds after the one above it**. Row 0 reveals over 1.1→1.7s, row 1 over
1.45→2.05s, and so on down to row 4 at 2.5→3.1s. The rig wires this through
`textOp(c, r)`, which multiplies each cell's text opacity by `rowTextReveal(r)`.
Because the grid chrome and the column headers came in with step (a), what you
see is content *populating into* an already-present table — the product's own
"rows loading" feel.

> *"Where does 0.35 come from?"* It's chosen, not derived — but chosen against
> two constraints. Too small (say 0.1s) and the five rows arrive almost
> together, reading as one block; the viewer can't feel that there are five
> distinct issues. Too large (say 0.8s) and the table takes four-plus seconds to
> fill, which is dead time. 0.35s is fast enough to feel alive, slow enough that
> your eye lands on each row in turn — an even roll-call rhythm, not drama. Once
> you pick a stagger you like, reuse it: scene 5's query sweep deliberately runs
> *faster* (0.14s/row) precisely because that one is a machine selecting, not a
> narrator pointing — and the contrast only reads if scene 1's cadence is its
> own consistent thing.
>
> *"The empty `pr` cells get this reveal too — what reveals if there's no
> text?"* Nothing, and that's correct. `textOp` returns `reveal` for an empty
> cell, but `SimTable` only renders a `<span>` when `cell.text` is truthy, so an
> empty cell has nothing to fade. The column *header* (`pr`) came in with the
> chrome, so the viewer can see the empty column exists and is waiting. You get
> the "the PR column is blank" read for free. (Note `textOp` has special
> handling for `STATUS_COL`/`PR_COL` — a dip term keyed off `flipMix` — but with
> `flipMix` absent that term is `1`, so here those columns reveal exactly like
> the `issue` column.)

### (c) One row gets selected, then released — `cellHi(c, r) = (r === 0 ? rowHi : 0)`, with `rowHi = pulseWindow(t, 4.6, 5.0, 6.2, 6.6)`

Every cell of row 0 gets the same highlight value, which rises over 4.6→5.0s,
holds, and falls over 6.2→6.6s. `cellHi` is passed to `SimTable` as
`cellHighlight`. Feeding the table the *same* value across a contiguous run of
cells is what makes it draw the product's **single selection outline** around
the whole row rather than three separate boxes: `SimTable` suppresses any cell
border that faces another highlighted cell (`bw.right = hiAt(ci+1, ri) > 0 ? 0 :
2`, and so on), so three lit cells merge into one outline, and once `hi` crosses
`0.5` it also lays the product's faint selection tint (`rgba(37,99,235,0.06)`)
under them. With no words, this says "a row is one issue."

> *"Why is the highlight a single value across the whole row instead of a
> per-cell thing?"* That's the mechanism that produces a *range* selection
> instead of three independent cell selections. `cellHi` returns the identical
> `rowHi` for every column of row 0, the edge-suppression logic sees neighbors
> lit, drops the interior borders, and you get one clean outline — exactly the
> product's range treatment. If you returned slightly different values per cell,
> the merge would break and you'd see seams.
>
> *"Why those four numbers — 4.6, 5.0, 6.2, 6.6?"* They're the pulse's shape: up
> between 4.6 and 5.0 (a ~0.4s fade-in), hold from 5.0 to 6.2, down between 6.2
> and 6.6. So the row stays selected for ~1.2s, long enough to register while
> the narration says "each row is one issue," then lets go.
>
> *"Why does it fire at 4.6 when the rows finished arriving at 3.1?"* Because
> the reveal and the selection are two different ideas, and overlapping them
> would blur both. Let the table fully arrive and settle, hold a beat of
> stillness, *then* make the one selection gesture. Stacking two animations in
> the same moment is the most common way a scene starts to feel busy and
> amateurish — give each idea its own air.
>
> *"Why only row 0?"* It's a demonstration, not decoration. You're pointing at
> one record to teach "this is a record," then releasing it so the table returns
> to neutral. Selecting all five would be noise; selecting one and letting go is
> a sentence. And it has to *release* before the scene ends — the exit contract
> demands no selection is carried into scene 2 (see Exit state), so the
> down-ramp finishing at 6.6 isn't optional, it's the boundary obligation.

### (d) The hold — from ~6.6s to the end of the scene (~10.9s)

After the selection releases, nothing moves. The assembled backlog just rests
for roughly 4.3 seconds.

> *"Isn't a 4-second still frame dead air?"* Honestly, partly — this is the
> weakest hold in the video, and the choreography notes flag it: it's over the
> usual 3s ceiling and there's no ambient motion to carry it, so it leans
> entirely on the narration. The defensible part is that the table you just
> built is the thesis object of the whole video, and letting it sit is letting
> it land. There's also a downstream reason: this scene's tail is where
> narration plays, and the scene needs to be able to *stretch* to fit however
> long the voiceover runs (the final comp stretches scene 1 to 10.9s for VO). A
> scene that ends on a static, settled state can be extended to any length
> safely, because there's no animation mid-flight to interrupt. If the scene
> ended on something still moving, you couldn't extend it without freezing a
> motion halfway. So "ends on a settled hold" is what makes the audio step
> downstream painless — even when, as here, the hold runs a touch long.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *What's the object?* A backlog table → use the real `SimTable`, fed
   `BACKLOG_COLUMNS` and `ISSUES`.
2. *How do I show only the table?* Render the **one** set piece with everything
   else hidden — chain `hidden`, edges `opacity: 0`, *and* the lane interior
   muted via `lanes[2]` → continuity is free.
3. *How does a table arrive?* Chrome and headers first, then content row by row
   → you read five issues, not one blob.
4. *How do I say "a row is an issue" without a caption?* The product's own range
   selection on one row → product vocabulary, never words on screen.
5. *What about the columns the run will fill?* Render them in their *before*
   state (`open`, empty) **as a function of `flipMix`** → an honest planted
   question, and the same machinery that later flips them.
6. *How should it be framed?* Hero the table, zoomed to 1.35, so the next scene
   can pull back to 0.7 and the fleet assembles around it.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. There's no single clever move — it's
restraint applied six times.

## Exit state (what scene 2 inherits)

`table assembled · status all "open", pr all empty · row selection released by
6.6s (no highlight) · chain hidden · lane interior hidden · camera at
CAM_TABLE`. Scene 2 opens on exactly this frame and starts easing the camera out
from `CAM_TABLE` to `CAM_ALL` while the chain fades up underneath and the table
glides to the top of frame. Because both scenes render the same set piece and
this scene leaves nothing mid-animation, that boundary is identical down to the
pixel.
