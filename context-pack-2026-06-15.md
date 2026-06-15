# Context Pack — 2026-06-15

The four core annotated exemplars, compiled for one-read injection. Read this
whole before building. Each is a Fable-grade golden video taught scene-by-scene
(the *why* behind every component choice, prop, timing window, and grounded value).
Imitate the **decision style**, never the literal content.

- **market-desk** — the canonical anchor: parallel-fan / the "machine", table over chain.
- **browser-agent** — tool-calls + the live browser-session surface + evidence filmstrip.
- **agent-economy** — multiplicity / volume (a swarm of requests).
- **voice-agent** — the "Machine" money-shot archetype: workflow top, live call panels, outcomes table.

(Annotations only. The matching source — layout.ts / data.ts / _rig.tsx / scenes —
lives in examples/<slug>/source/; read your nearest-shaped one's source for the code half.)


═══════════════════════════════════════════════════════════════════════
# EXEMPLAR: market-desk
═══════════════════════════════════════════════════════════════════════

<!-- ── market-desk / 01-the-board.md ── -->

# Scene 1 — `the-board`  ·  archetype: **assemble**

Source: `../source/scenes/TheBoardScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the opening scene of the video, and it does exactly one thing: it shows
you the table the whole desk is built around. Read it as a worked example —
every choice below is one you'll make again in your own first scene.

---

## What this scene is for

The video's whole story is "here's a watchlist of markets → here's the desk
that fills it in." So the first scene has to put the **watchlist** on screen as
a concrete object, and — this is the important part — it has to show three of
its columns **empty**. That emptiness is a question you're planting in the
viewer's head ("who fills those in?"), and the rest of the video is the answer.

So the rule the scene follows is *one idea per scene*: this scene is "here is
the table," full stop. No workflow, no run, no motion beyond the table arriving.
Resist the urge to also introduce the schedule or the blocks here — they get
their own scene.

## What it looks like

A five-column table — `market · odds · agent_est · edge · signal` — centered in
frame, with five market rows. The `market` and `odds` cells are filled; the
`agent_est`, `edge`, and `signal` cells are blank. The table fades in, the rows
populate top to bottom, one row briefly gets a selection highlight, and then it
just sits there.

## The one real decision: use the real table, and render the *whole* set piece

The scene renders this and almost nothing else:

```tsx
<Stage
  cam={CAM_TABLE}
  tableIn={tableIn}
  rowTextReveal={rowTextReveal}
  cellHi={cellHi}
  sched={{hidden: true}}
  poly={{hidden: true}}
  cont={{hidden: true}}
  edge1={{opacity: 0}}
  edge2={{opacity: 0}}
/>
```

Two things to take from this.

**Use `SimTable`, the real product table — never a hand-built grid.** The data
the desk works on is a Sim table, so the surface on screen is the actual table
component, fed real columns and rows. You are never designing a table here;
you're configuring the one that exists.

**Notice the schedule, the Polymarket block, and the container are all
present — just `hidden`.** This is the part people get wrong. The instinct is
"scene 1 is only the table, so only render the table." Don't. There is *one*
set piece (`<Stage/>`) for the entire video, and every scene renders all of it,
turning pieces on and off with state props. Here the chain's visibility is set
to zero (`hidden: true`, edge opacity `0`).

> *"Why bother rendering things I can't see?"* Because of what happens at the
> cut into scene 2. Scene 2 brings the chain in. If scene 1 didn't render the
> chain at all and scene 2 suddenly mounted it, you'd risk a one-frame jump —
> the table reflowing, a layout shift, a flash. By rendering the same single
> set piece in both scenes and only animating visibility, the boundary between
> them is identical by construction. Continuity stops being something you check
> and becomes something you can't break.

## The camera

```ts
cam = CAM_TABLE = { px: 1200, py: tableCenter().y, s: 1.1 }
```

The camera is a transform of the fixed layout: `px, py` is the stage point that
ends up in the center of frame, `s` is the zoom. Here it's centered on the
table (`px = 1200` is the horizontal center of the 2400-wide stage) at **1.1×**.

> *"Why 1.1 and not just 1.0?"* The table is the hero of this scene, so it's
> framed a touch larger than neutral. Neutral — the framing used once the whole
> desk is on screen — is `0.78`. The gap between `1.1` here and `0.78` next
> scene is deliberate: in scene 2 the camera *eases out* from `1.1` to `0.78`,
> and that pull-back is what makes the desk feel like it's *growing around* the
> board rather than just appearing. So the scene-1 zoom isn't arbitrary; it's
> the first half of a camera move that completes in scene 2.

## The values, and why the empty columns are empty *by construction*

All five rows live in `data.ts` (every on-screen value traces to there):

| market | odds | agent_est | edge | signal |
|---|---|---|---|---|
| Fed cut by June | 0.32 | | | |
| ETH $5k in 2026 | 0.41 | | | |
| Avatar 3 tops $2B | 0.12 | | | |
| GPT-6 ships in 2026 | 0.55 | | | |
| La Niña by winter | 0.64 | | | |

The `agent_est / edge / signal` cells are blank, and the way they're blank
matters. The row builder takes a per-row "fill" amount and only writes those
three columns once the row is at least half-filled:

```ts
const filled = fillMix(r) >= 0.5;
[ {text: market}, {text: odds},
  {text: filled ? est  : ""},
  {text: filled ? edge : ""},
  {text: filled ? signal : ""} ]
```

In this scene there is no fill happening at all, so those three columns render
as empty strings. They are not "blank because we styled them blank" — they are
blank because **a table cannot show a value the run hasn't produced yet.** Keep
this property. It's the same reason the table never animates on its own: a Sim
table only changes when something writes to it. If you ever find yourself
making a number tick or a cell fill without a block causing it, you've broken
the one rule that keeps the video an honest depiction of how the product works.

## The animation, beat by beat

Two tiny helpers do all the timing. `ramp(t, t0, t1)` goes from 0 to 1 as the
clock `t` (in seconds) crosses `t0`→`t1`, clamped outside that window.
`pulseWindow(t, a0, a1, b0, b1)` goes up over `a0`→`a1`, holds, then comes back
down over `b0`→`b1`. That's the whole vocabulary; everything is built from
these two.

### (a) The table fades in — `tableIn = ramp(t, 0.2, 0.9)`

The entire table's opacity comes up over **0.2s → 0.9s**.

> *"Why start at 0.2 instead of 0.0?"* A short beat of empty frame before
> anything appears reads as a deliberate open. Starting at 0.0 makes the first
> frame feel like the render was already mid-load.
>
> *"Why ~0.7 seconds — why not snappier?"* This is the establishing shot. It
> gets a calm, unhurried entrance. Later scenes, where things are happening,
> move faster. Pace is a signal: a slow entrance says "settle in and look."
>
> *"Why no easing curve?"* A fade has no spatial momentum — nothing is moving
> through space, only opacity changing — so an ease-in/out would be invisible.
> Easing is for things that travel; a plain opacity ramp is left linear.

### (b) The rows populate top to bottom — `rowTextReveal(r) = ramp(t, 1.1 + r*0.35, 1.7 + r*0.35)`

Each row's text reveals on its own 0.6-second ramp, and each row starts **0.35
seconds after the one above it**. Row 0 reveals over 1.1→1.7s, row 1 over
1.45→2.05s, and so on down to row 4 at 2.5→3.1s. Because the grid lines came in
with step (a), what you see is content *populating into* an already-present
table — the product's own "rows loading" feel.

> *"Where does 0.35 come from?"* It's chosen, not derived — but chosen against
> two constraints. Too small (say 0.1s) and the five rows arrive almost
> together, reading as one block; the viewer can't feel that there are five
> distinct markets. Too large (say 0.8s) and the table takes four-plus seconds
> to fill, which is dead time. 0.35s is fast enough to feel alive, slow enough
> that your eye lands on each row in turn. Once you pick a stagger you like,
> reuse it — consistent cadence across the video is part of what makes it feel
> composed rather than improvised.
>
> *"The empty columns get this reveal too — what reveals if there's no text?"*
> Nothing, and that's correct. The reveal animates text opacity; those cells
> have no text. The column *headers* (`agent_est` etc.) came in with the chrome,
> so the viewer can see the empty columns exist and are waiting. You get the
> "three empty columns" read for free.

### (c) One row gets selected, then released — `cellHi(c, r) = (r === 0 ? rowHi : 0)`, with `rowHi = pulseWindow(t, 4.6, 5.0, 6.2, 6.6)`

Every cell of row 0 gets the same highlight value, which rises over 4.6→5.0s,
holds, and falls over 6.2→6.6s. Feeding the table the same value across a
contiguous run of cells makes it draw the product's **single selection outline**
around the whole row — one record highlighted — rather than five separate
boxes. With no words, this says "a row is one market."

> *"Why those four numbers?"* They're the pulse's shape: up between 4.6 and 5.0
> (a ~0.4s fade-in), hold from 5.0 to 6.2, down between 6.2 and 6.6. So the row
> stays selected for a little over a second, long enough to register, then lets
> go.
>
> *"Why does it fire at 4.6 when the rows finished arriving at 3.1?"* Because
> the reveal and the selection are two different ideas, and overlapping them
> would blur both. Let the table fully arrive and settle, hold a beat of
> stillness, *then* make the one selection gesture. Stacking two animations in
> the same moment is the most common way a scene starts to feel busy and
> amateurish — give each idea its own air.
>
> *"Why only row 0?"* It's a demonstration, not decoration. You're pointing at
> one record to teach "this is a record," then releasing it so the table
> returns to neutral. Selecting all five would be noise; selecting one and
> letting go is a sentence.

### (d) The hold — from ~6.6s to the end of the scene

After the selection releases, nothing moves. The assembled board just rests.

> *"Isn't a still frame dead air?"* Not here — the table you just built is the
> thesis object of the whole video, and letting it sit is letting it land.
> There's a deeper reason too: this scene's tail is where narration plays, and
> the scene needs to be able to *stretch* to fit however long the voiceover
> runs. A scene that ends on a static, settled state can be extended to any
> length safely, because there's no animation mid-flight to interrupt. If the
> scene ended on something still moving, you couldn't extend it without
> freezing a motion halfway. So "ends on a settled hold" isn't just taste; it's
> what makes the audio step downstream painless.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *What's the object?* A table → use the real `SimTable`.
2. *How do I show only the table?* Render the **one** set piece with everything
   else hidden → continuity is free.
3. *How does a table arrive?* Chrome first, then content row by row → you read
   five markets, not one blob.
4. *How do I say "a row is a market" without a caption?* The product's own row
   selection → product vocabulary, never words on screen.
5. *What about the columns the run will fill?* Render them empty **as a function
   of fill state** → an honest planted question.
6. *How should it be framed?* Hero the table, slightly zoomed, so the next scene
   can pull back and the desk grows around it.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. There's no single clever move — it's
restraint applied six times.

## Exit state (what scene 2 inherits)

`table assembled · no selection (released by 6.6s) · chain hidden · camera at
CAM_TABLE`. Scene 2 opens on exactly this frame and starts easing the camera
out while the chain fades up underneath. Because both scenes render the same
set piece, that boundary is identical down to the pixel.

<!-- ── market-desk / 02-the-desk-takes-shape.md ── -->

# Scene 2 — `the-desk-takes-shape`  ·  archetype: **assemble + camera ease**

Source: `../source/scenes/DeskTakesShapeScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the build scene: the second scene of the video, and the one that turns
"here's a table" into "here's a desk." It does two things at once — a camera
move and an assembly — but they're the *same* idea (the desk growing around the
board), so it stays inside the one-idea rule. Read it as the worked example of
how to introduce a whole workflow without overwhelming the viewer.

---

## What this scene is for

Scene 1 planted a question: three empty columns, and a table that can't fill
them. This scene answers "who fills those in?" by assembling the thing that
will — the desk. But it answers it as a *picture of a workflow*, not a list of
features. The point the scene has to land is **the desk is one chain**: a clock,
a market pull, and a container holding a single analyst lane. Everything is in
service of that one read.

So the rule the scene follows is still *one idea per scene* — the idea here is
"the desk is this shape." It is deliberately runless: nothing executes, no
number fills, no cell changes. We're introducing the apparatus, not running it.
Resist the urge to also fire the schedule or light a wire "to show what it does"
— that's scenes 5 onward. This scene only builds.

## What it looks like

The camera pulls back. The table — which filled the frame in scene 1 — glides
up to the top of frame and shrinks to its home size, and as the empty space
opens up beneath it, the workflow assembles into that space, left to right, in
the order data flows: a **Schedule** block appears, a wire draws to a
**Polymarket** block, a wire draws to the **Desk** container (a yellow Split
chip and an inner Start pill), and inside the container one lane builds —
an inner wire, an **Analyst** agent (with Exa and Perplexity tool chips), a wire,
and an **Update Board** table block. Then it rests.

## The one real decision: it's all a camera move, not a layout change

The scene renders this:

```tsx
<Stage
  cam={camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut))}
  sched={{opacity: schedIn}}
  poly={{opacity: polyIn}}
  cont={{opacity: contIn}}
  edge1={{progress: edge1}}
  edge2={{progress: edge2}}
  lanes={{2: {ana: {opacity: anaIn}, upd: {opacity: updIn},
             edgeIn: {progress: edgeIn}, edgeA: {progress: edgeA}}}}
/>
```

Two things to take from this.

**The table does not move. The camera does.** This is the part people get
wrong. The instinct, when you want the table to "go to the top so the chain has
room," is to animate the table's `top` from 150 down to a smaller number — to
*relayout*. Don't. The table's stage coordinates (`TABLE_X = 360`,
`TABLE_Y = 150`) never change in this scene or any other. What changes is the
camera: it eases from `CAM_TABLE` (centered on the table, zoomed to 1.1×) to
`CAM_ALL` (centered on the whole set piece at 0.78×). Because the camera now
frames a taller region of fixed geometry, the table — which lives at the top of
that geometry — *ends up* near the top of frame, smaller. The glide is real,
but it's the viewport moving over a still world, not the table moving.

> *"Why does that distinction matter so much?"* Because it's the rule that makes
> continuity free across the whole video. The set piece is one fixed layout
> (`layout.ts`); every scene is a `camMix` over that same geometry plus state
> props. If scenes moved elements around to "make room," every cut would be a
> potential layout jump, and you'd be hand-checking each boundary. By making the
> only spatial change a camera transform, the table at the end of scene 1 and
> the table at the start of scene 2 are the *same object at the same coordinates*
> — the boundary is identical by construction. Once, in `cameraTo`; never again.

**Every block is already present in the layout — this scene just fades them
in.** Schedule, Polymarket, the container, the inner lane all live at fixed
positions in `layout.ts` and are rendered by the *same* `<Stage/>` scene 1
rendered (where they were `hidden`). Here they come up on opacity ramps. Nothing
mounts mid-video; visibility is animated, never existence.

## The camera, completed

```ts
cam = camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut))
// CAM_TABLE = { px: 1200, py: tableCenter().y, s: 1.1 }
// CAM_ALL   = { px: 1200, py: 735,             s: 0.78 }
```

This is the second half of the move scene 1 set up. Scene 1 deliberately framed
the table a touch large (1.1×) so this scene could pull back to neutral (0.78×),
and that pull-back is what makes the desk feel like it *grows around* the board
rather than appearing beside it. `camMix` linearly interpolates all three camera
fields (`px`, `py`, `s`) by a single mix value; here the mix is
`ramp(t, 0.3, 2.4, EASING.inOut)` — 0 to 1 over **0.3s → 2.4s**, eased in-out.

> *"Why ease this one when scene 1's fades were left linear?"* Because this is a
> *move through space* — the framing travels and the zoom changes — and motion
> through space wants momentum: a gentle start, a glide, a gentle stop.
> `EASING.inOut` (`bezier(0.65, 0, 0.35, 1)`) gives exactly that S-curve. The
> project rule is consistent: `EASING.inOut` for camera moves and transforms,
> `EASING.out` for entrances, plain linear for fades (which have no spatial
> momentum to shape). A linear camera pull would start and stop abruptly and
> read as mechanical.

> *"Why start at 0.3 and finish at 2.4 — why those bounds?"* The 0.3s lead-in is
> a held beat on scene 1's exit frame before anything moves, so the cut doesn't
> feel like it yanks the camera the instant the scene starts. The 2.4s landing
> is chosen against the assembly: the first block (Schedule) starts fading in at
> 2.0s, while the camera is still settling, and finishes after the camera has
> arrived. So the camera *gets out of the way* before the chain becomes the
> focus — you're never asked to track a moving frame *and* read a new block at
> the same time. Too short a move (say ending at 1.0s) and the pull-back feels
> hurried, not a "settle in"; too long (4s+) and you're watching an empty pan.

> *"Why 0.78× for CAM_ALL?"* It's derived, not picked. `CAM_ALL` frames the
> whole content bounding box (`x 128..2273, y 150..1321`, center `(1200.5,
> 735.5)`), and 0.78 is the zoom at which that box fits the 1920×1080 viewport
> with a comfortable margin. This is the video's *home* framing — scenes 3, 4,
> 5, 8 all return to it — so it earns being the neutral the camera resolves to.

## The values, and why each block is grounded

Every block on screen is a real Sim block fed registry-true content from
`data.ts`. None of it is designed; all of it is configured. The chain, in flow
order:

**Schedule** — `BLOCK_COLORS.schedule = #6366F1`, the indigo schedule chip, with
two rows from `SCHED_ROWS`:

| Run frequency | Hourly |
|---|---|
| Minute | 0 |

The titles are verbatim from the registry (`schedule.ts`) — note the lowercase
`frequency`, which is what the registry actually says (the older `swe-fleet`
build wrote `Run Frequency` before the registry-wins tiebreak; it's not copied).
This block has `hideTargetHandle` set, because it's the *entry* of the chain —
nothing flows into a clock.

**Polymarket** — `POLYMARKET_COLOR = #4C82FB`, the blue chip with the verbatim
PolymarketIcon path (white-filled for the chip), three rows from `POLY_ROWS`:

| Operation | Get Markets |
|---|---|
| Sort By | Volume |
| Limit | 5 |

`Get Markets` is the registry's default operation (`get_markets`); `Limit | 5`
is doing real work — it's *why* the board has exactly five rows. The count isn't
a coincidence we drew, it's a configured fact you can see.

**Desk** — the Parallel container. Its identity comes from
`parallel-config.ts`: the `SplitGlyph` (lucide SplitIcon) on a
`PARALLEL_COLOR = #FEE12B` chip, drawn *dark* on the light yellow per the
product's luminance rule. Inside its header sits the name `Desk` (a user-named
block — product-legal); over its body sits the inner **Start** pill, which is
the parallel's own entry point.

**Analyst** — `BLOCK_COLORS.agent = #33C482`, the green agent block. Two rows
plus a tools line:

| Messages | `<parallel.currentItem>` |
|---|---|
| Model | claude-sonnet-4.6 |

with tool chips **Exa** (`#1F40ED`) and **Perplexity** (`#20808D`), each a real
tool integration with its verbatim brand glyph. The `Messages` value is the bare
reference tag `<parallel.currentItem>` — the per-instance market each analyst
receives. (The actual instruction lives in the agent's system prompt, which the
block doesn't draw; a verb prefix here truncated the tag mid-name on render, so
it's shown bare.)

**Update Board** — `BLOCK_COLORS.table = #10B981`, the green table block, two
rows from `UPDATE_ROWS`:

| Operation | Upsert Row |
|---|---|
| Row Data | `{"agent_est": 0.71, …}` |

`Upsert Row` (`upsert_row`) is the honest write operation: refresh-or-insert by
market key. The Row Data is shown truncated — and that's fine, because the full
value lands in the table row it writes to, which is simultaneously on screen.
This block has `hideSourceHandle` set: it's the *end* of the lane, nothing flows
out of it.

> *"Why does the Analyst's Messages already say `0.71` won't appear here, but
> Update Board's Row Data shows `0.71`?"* The `0.71` in Update Board is an
> *authored example value* of the JSON shape — it's showing you what the block
> writes, structurally. It isn't a live result; the run hasn't happened. The
> same honesty rule from scene 1 holds: nothing on screen is a value the run
> produced, because no run has produced anything yet. The board's three columns
> are still empty in this scene for exactly that reason.

> *"Why show the full row content on every block in a runless scene — isn't that
> a lot of text to read?"* Because the rows are what make each block a *specific*
> block instead of a generic box. "Schedule" is just a word; "Schedule · Run
> frequency Hourly · Minute 0" is a clock you understand. The narration will
> name each block as it lands, and the row underneath is the proof of what the
> word means. This is the assembly scene; it's the one place the viewer is
> *supposed* to read the configuration, because every later scene assumes they
> already did.

## Why ONE lane, not the fan

The container holds a single analyst lane — Analyst → Update Board — and only
one. The five-wide fan (one analyst per market) does not exist in this scene. It
doesn't exist in the layout as drawn content at all: `laneTop(2, fan)` with
`fan = 0` is the only lane on canvas; the four ghost instances are gated behind
`fan > 0`, which only happens at runtime in scene 6.

> *"Why hide the fan here? Isn't 'five concurrent analysts' the whole point?"*
> It is the point — *later*. The fan is what the parallel *does when it runs*;
> the lane is what the parallel *is*. This scene teaches the structure, and the
> structure is one lane that the container will replicate. Drawing five lanes
> now would say "there are five hardcoded analysts," which is the wrong mental
> model — the truth is one lane, fanned at runtime over whatever markets come
> back. Show the template; let the run show the copies. (This is a literal rule
> from the rejection history — case study 17, rule 4: the canvas shows one lane,
> the fan is runtime animation only.)

## The animation, beat by beat

One helper does all the timing here. `ramp(t, t0, t1, easing?)` goes from 0 to 1
as the clock `t` (in seconds) crosses `t0`→`t1`, clamped outside that window,
with an optional easing curve. Entrances use `EASING.out`; wires use no easing.
That's the whole vocabulary for this scene — nine ramps and one camera mix.

### (a) The assembly order *is* data flow

The blocks come in left to right in the order data moves through them:

```ts
schedIn = ramp(t, 2.0,  2.6,  EASING.out)   // Schedule
edge1   = ramp(t, 3.0,  3.6)                // → Polymarket
polyIn  = ramp(t, 4.0,  4.6,  EASING.out)   // Polymarket
edge2   = ramp(t, 5.2,  5.8)                // → Desk container
contIn  = ramp(t, 6.2,  7.0,  EASING.out)   // Desk container
edgeIn  = ramp(t, 7.8,  8.4)                // inner pill wire
anaIn   = ramp(t, 8.4,  9.0,  EASING.out)   // Analyst
edgeA   = ramp(t, 9.8,  10.3)               // lane wire
updIn   = ramp(t, 10.3, 10.9, EASING.out)   // Update Board
```

Read the centers: Schedule (~2.3), edge (~3.3), Polymarket (~4.3), edge (~5.5),
container (~6.6), inner wire (~8.1), Analyst (~8.7), lane wire (~10.0), Update
Board (~10.6). Block, then the wire that feeds the next block, then that block —
all the way down. The viewer's eye traces the data path because the *animation*
traces the data path.

> *"Why assemble in flow order instead of, say, all the blocks then all the
> wires?"* Because flow order tells a story and the alternatives don't. "Clock →
> pull → desk → analyst → write-back" is a sentence; the viewer assembles the
> *meaning* of the chain at the same pace they watch it draw. If all three blocks
> popped in and then the wires connected them, you'd read "three boxes" first
> and "a pipeline" second — two reads where flow order gives you one. The wire
> drawing *between* two blocks, in the gap, is the literal claim "this feeds
> that," made visually.

> *"Why are entrances eased (`EASING.out`) but wires aren't?"* A block fading and
> settling in is an arrival — `EASING.out` (`bezier(0.16, 1, 0.3, 1)`) front-loads
> the motion so it appears quickly then eases to a stop, the standard entrance
> feel. A wire isn't arriving in space; it's *drawing* — `progress` sweeps the
> path from 0 to 1 (start handle to end handle) at a steady rate, like a line
> being drawn with a pen. Easing a draw would make the pen lurch. Same principle
> as scene 1: ease things that travel, leave linear the things that just reveal.

### (b) The cadence: ~1.0–1.4s between elements, and why it's slow

The gap between the *center* of one element and the next runs about 1.0 to 1.4
seconds — Schedule center to edge1 center is ~1.0s, edge1 to Polymarket ~1.0s,
Polymarket to edge2 ~1.2s, edge2 to container ~1.1s, then a ~1.5s reach into the
container before the inner wire, and ~0.9–1.4s through the lane. The whole
assembly spans 2.0s to 10.9s — nearly nine seconds for nine elements.

> *"Why so slow? `swe-fleet`'s assembly ran at 0.6–0.8s gaps."* Because each
> element here has to be *nameable*. This is the scene where narration introduces
> the desk's parts — "a clock fires every hour, the Polymarket block pulls the
> markets, a container holds the analyst" — and the narration needs a beat per
> noun to land it. At 0.6s gaps the chain assembles in under five seconds and the
> voiceover is racing to keep up, or the blocks are all on screen before they're
> spoken about. At ~1.2s gaps the assembly *nearly fills the narrated window*,
> which is the other reason it works: this scene's hold is short precisely
> because the build itself carries most of the runtime. The slow cadence buys
> two things at once — clarity for the narration and a scene that doesn't die
> waiting.

> *"How was 1.0–1.4s derived as the bound?"* By the failure modes on either
> side. Too fast (≤0.7s) and the elements blur into one assembly gesture — you
> can't feel the distinct steps, and there's no room to name them. Too slow
> (≥2s) and the gaps become dead air between arrivals; the eye finishes reading
> one block and waits, bored, for the next. 1.0–1.4s is the band where each
> arrival fully registers and the narration can name it, with no idle gap. Once
> you find the band, keep the spacing *roughly even* — the small variations here
> (1.0 to 1.5) track the wire/block alternation, not arbitrary jitter.

### (c) The reach into the container

Notice the largest single gap: the container finishes coming in at 7.0s, but the
inner pill wire doesn't start until 7.8s — a held ~0.8s beat with the container
present and empty before its interior begins to build.

> *"Why pause there?"* Because the container is a context switch — the eye has
> to move *inside* a box and re-scope to a smaller world. Holding a beat on the
> empty container says "now we go in here," and lets the viewer register the
> container as a container (a thing with an interior) before that interior fills.
> Building the inner lane the instant the box arrives would collapse "here's a
> container" and "here's what's in it" into one unreadable moment. The inner
> assembly then runs in the same flow order at the same cadence — pill wire →
> Analyst → lane wire → Update Board — a small chain echoing the outer one.

### (d) The hold — from ~10.9s to the end of the scene

After Update Board lands at 10.9s, nothing moves. The assembled desk just rests
(~5.3s of hold in the shipped timing).

> *"Isn't that dead air, like scene 1's tail?"* Less so, and for a structural
> reason. Scene 1's hold was long (~7.4s) because almost nothing happened before
> it; this scene's assembly is nine seconds of continuous build, so by the time
> it settles, most of the scene's runtime is spent and the hold is short. The
> hold still earns its place: it's where the narration finishes naming the chain,
> and — same as scene 1 — a scene that ends on a settled, motionless state can be
> *extended* to fit however long the voiceover runs without freezing a motion
> mid-flight. "Ends on a latched settle" is the property that makes the audio
> step downstream painless; every scene in this video has it.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *How do I make room for the chain?* Pull the camera back over fixed geometry
   → the table glides up as a camera move, layout never changes, continuity free.
2. *How do I introduce a whole workflow without overwhelming?* Assemble it one
   element at a time → the viewer builds the chain at the pace they watch it.
3. *In what order?* Flow order — block, feeding wire, next block → the assembly
   *is* the data path; you read a pipeline, not a pile of boxes.
4. *How fast?* ~1.2s gaps, slow enough to name each part → the build carries the
   narration and nearly fills the window, so the hold can be short.
5. *How many analyst lanes?* One → teach the structure (a lane the container
   replicates), not five hardcoded copies; the fan is the run's job.
6. *What's in each block?* Registry-true rows from `data.ts` → every block is a
   specific, grounded Sim block, never a designed placeholder.
7. *How does it end?* On a settled, idle desk → extend-safe for the voiceover.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. The camera move and the assembly look like
two ideas, but they're one — *the desk growing around the board* — and the whole
scene is that single move executed with restraint.

## Exit state (what scene 3 inherits)

`table assembled (top of frame) · chain fully assembled and idle · one analyst
lane · no run, no fills · CAM_ALL`. Scene 3 (`wired-by-reference`) opens on
exactly this frame at exactly this framing — it doesn't move the camera at all,
it dims the world to 0.35 and brings up the editor card. Because both scenes
render the same set piece at the same camera, that boundary is identical down to
the pixel (`2→3` in the continuity contract: chain assembled idle, CAM_ALL).

<!-- ── market-desk / 03-wired-by-reference.md ── -->

# Scene 3 — `wired-by-reference`  ·  archetype: **zoom-aside**

Source: `../source/scenes/WiredByReferenceScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the third scene, and it's the first one that points a magnifying glass
at a *single piece* of the desk instead of the whole board. The desk is
assembled (scene 2 left it idle). Now we answer the question every workflow
diagram raises but never explains: *how does the Polymarket block actually hand
its markets to the parallel?* The answer is one line of config — a reference —
and the entire job of this scene is to show that one line, in the product's own
editor, without anything else competing for your eye.

Read it as the worked example of the **zoom-aside**: the scene where you pause
the run, pull an element's anatomy out into an overlay, teach it, and put it
back exactly as you found it.

---

## What this scene is for

Scene 2 drew a wire from Polymarket into the Desk container. A wire is a
*claim* — "data flows here" — but it doesn't tell you *what* flows or *how the
binding is written*. In Sim, that binding isn't a special arrow; it's a
**reference**: a `<block.field>` token typed into a field, here
`<polymarket.markets>` sitting in the parallel's **Parallel Items**. That token
is the entire mechanism. When the desk runs, the parallel reads whatever array
that reference resolves to and fans one lane per element.

So the scene's single idea is: **a reference is what wires one block to
another.** Not a connector you drag — a value you write. One idea per scene
means this scene shows *only* that. It does not run anything, does not fan
anything, does not touch the table's contents. It opens an editor, glows one
tag, and closes the editor.

> *"Why give a reference its own scene at all — isn't it just config?"* Because
> it's the load-bearing concept the rest of the video assumes. Scene 6 fans
> five lanes; scene 7 resolves `<parallel.currentItem>` to a real market. Both
> only make sense if you already believe "a `<block.field>` token is a live
> binding, not a label." This scene is where that belief gets installed, on the
> simplest possible reference, before the run makes it move.

## What it looks like

The whole desk is on screen at home framing. The Desk container takes a thin
blue editing ring. Everything that *isn't* the container — the table above, the
Schedule and Polymarket blocks, the wires between them — fades back to about a
third of its brightness. An editor card slides in from the right and settles
over the dimmed area: a header (yellow Split chip + **Desk**), a **Parallel
Type** field reading `Parallel Each`, and a **Parallel Items** field holding the
reference tag `<polymarket.markets>`. The tag glows selection-blue, holds, fades
back to plain text. Then the card slides back out, the ring releases, and the
world brightens to exactly where it started.

## The one real decision: dim *selectively*, and lift the editor out as a separate overlay

Here is the scene's entire render:

```tsx
<Stage
  cam={CAM_ALL}
  tableIn={1 - 0.65 * dimW}
  sched={{dim: dimW}}
  poly={{dim: dimW}}
  cont={{highlighted: editing}}
  edge1={{opacity: 1 - 0.65 * dimW}}
  edge2={{opacity: 1 - 0.65 * dimW}}
  lanes={{2: {}}}
/>
<DeskConfigCard opacity={cardIn} slide={cardSlide} itemsGlow={itemsGlow} />
```

Two things to take from this, and they are the whole archetype.

**The dim is selective, applied per-element — *not* the Stage's global `dim`.**
The Stage component has a top-level `dim` prop that darkens the entire world at
once (`worldOp = 1 - 0.65 * dim`). This scene deliberately **does not use it.**
Instead it dims the table, the two outer blocks, and the two outer edges by hand
— each gets its own `1 - 0.65 * dimW` — while the container is left at full
brightness and given a `highlighted` ring. The result is a frame split into two
brightness planes: the focal object lit, everything else pushed back.

> *"Why dim each piece by hand when there's a one-line global dim prop?"*
> Because a global dim would take the *container down with everything else.* The
> whole point of a zoom-aside is that one element stays lit while its neighbors
> recede — that's how the viewer knows *what* is being explained. If I dimmed
> the world globally and then tried to re-brighten the container, I'd be fighting
> my own dim (re-lighting something I just darkened reads as a glow, not as
> "exempt"). Cleaner to dim only the four non-focal surfaces and never touch the
> container's opacity at all. The container isn't *re-highlighted* — it's simply
> *never dimmed.*

**The editor card is a sibling overlay in viewport space, not a child of the
stage.** Notice `DeskConfigCard` is rendered *outside* `<Stage>`, as the second
child of the `AbsoluteFill`. It does not live in stage coordinates, doesn't
move with the camera, isn't subject to the world dim. It floats in front of
everything at fixed screen position (`CARD_VX = 1290`, `CARD_VY = 300`).

> *"Why isn't the card part of the stage like every other block?"* Because it's
> a different *kind* of object. The blocks on the stage are the workflow — they
> live in the canvas and move with the camera. The editor card is a **panel** —
> in the real product it's a side sheet that opens over the canvas, in screen
> space, unaffected by canvas pan/zoom. Porting that faithfully means the card
> is an overlay, not a canvas citizen. It also keeps the dim honest: the dim
> applies to *the world*, and the card sits *above* the world, so it reads at
> full strength against the darkened backdrop — exactly like the product's panel
> over a dimmed canvas.

## Why no connector line between the container and the card

There is no wire, no leader line, no bracket joining the Desk container to the
editor card. The relationship between "this block" and "its config" is carried
**only by synchrony**: the card appears *as* the container gets its ring, glows
the tag *while* the container is the lit object, and leaves *as* the ring
releases. They animate together, so you read them as one thing.

> *"Wouldn't a connector line make the link explicit and clearer?"* It would
> make it *busier*, not clearer. A line implies dataflow — and that's the
> vocabulary this video reserves for actual wires (Schedule→Polymarket→Desk,
> and the inner pill→Analyst fan). Drawing a connector from a block to its
> editor would overload that vocabulary and invite the question "what flows along
> that line?" Nothing flows; the card *is* the block, opened up. Co-timing says
> "same object" without claiming "data moves between them." The zoom-aside's
> rule is: the aside and its subject share a clock, never a line.

## The camera

```ts
cam = CAM_ALL = { px: 1200, py: 735, s: 0.78 }
```

The camera does not move in this scene. It sits at **CAM_ALL**, the home framing
that holds the whole set piece (table + chain) — content bbox `x 128..2273,
y 150..1321`, center `(1200.5, 735.5)`, at `0.78×`.

> *"A zoom-aside is named 'zoom' — why doesn't the camera zoom in on the
> container?"* Because the *card* is the zoom. A literal camera push onto the
> container would lose the table, and we need the table visible-but-dimmed so the
> viewer keeps their bearings ("this config lives on the desk that fills that
> board"). So the "zoom" is done with hierarchy — dim the surround, float a
> magnified editor — rather than with the lens. Holding CAM_ALL steady also makes
> the boundaries trivial: scene 2 ended at CAM_ALL, scene 4 opens at CAM_ALL, and
> this scene never leaves it. The camera is a constant across the whole runless
> middle (scenes 3 and 4), which is one less thing that can jump on a cut.

## The values — every label traces to the product

The card's text is not invented. Each label is lifted verbatim from Sim's real
subflow editor (provenance is in the rig's comment above `DeskConfigCard`):

| field | value | source |
|---|---|---|
| (header) | `Desk` + Split chip | the container's own identity (`PARALLEL_COLOR = #FEE12B`, lucide `SplitIcon`) |
| Parallel Type | `Parallel Each` | `use-subflow-editor.ts` |
| Parallel Items | `<polymarket.markets>` | `subflow-editor.tsx` label; value is `ITEMS_REF` from `data.ts` |

`ITEMS_REF = "<polymarket.markets>"` is the one value that *matters* — it's the
reference the whole scene exists to show. It reads `<block-name>.<field>`:
the `markets` output of the Polymarket block. The header deliberately mirrors the
container's header on the canvas (same yellow Split chip, same **Desk** name, same
`PARALLEL_COLOR`) so the card reads unmistakably as *that* block's editor — the
visual link the absent connector line would otherwise have carried.

> *"Why `Parallel Each` and not, say, a count?"* Because that's the binding mode
> that makes the reference meaningful. `Parallel Each` means "iterate over the
> items array, one lane per element" — so `<polymarket.markets>` (an array of
> markets) becomes one analyst lane per market. The Type field is *context* for
> the Items field: it tells you the reference is going to be *fanned over*, which
> is precisely what scene 6 then does. Showing Type above Items isn't decoration;
> it's the half-sentence that makes the reference's job legible.

## The animation, beat by beat

Two helpers do all the timing, same as every scene in this build. `ramp(t, t0,
t1)` goes 0→1 as the clock crosses `t0`→`t1`, clamped outside. `pulseWindow(t,
a0, a1, b0, b1)` goes up over `a0`→`a1`, holds, comes back down over `b0`→`b1`.
Everything below is built from these two.

### (a) The world dims, the container rings up — `dimW = pulseWindow(t, 0.4, 0.9, 5.8, 6.3)` and `editing = t ≥ 0.5 && t < 6.0`

`dimW` is the single driver for *all four* dimmed surfaces. It rises over
**0.4s → 0.9s** (a ~0.5s fade-back), holds through the middle of the scene, and
falls over **5.8s → 6.3s**. Each surface consumes it the same way: the table is
`tableIn = 1 - 0.65 * dimW`, the two edges are `opacity: 1 - 0.65 * dimW`, and
the two blocks pass `dim: dimW` (the Stage's `visOpacity` helper turns that into
the identical `(1 - 0.65 * dim)` factor). One number, one window, four surfaces
— so they dim and undim as a single move.

> *"Why 0.35 specifically — why `1 - 0.65`?"* Because 0.35 is the brightness
> floor this whole series uses for 'present but not the subject.' It's dark
> enough to clearly recede (the lit container jumps forward), but *not* so dark
> that the surround vanishes — at 0.35 you can still read that there's a table up
> top and a chain below, which is the bearings the viewer needs. Go to ~0.1 and
> the surround effectively disappears, breaking continuity with the scenes on
> either side; stay above ~0.5 and the hierarchy is too weak to read as 'this one
> thing.' The `0.65` coefficient *is* 0.35: it's baked into `visOpacity` so every
> dim in the video lands on the same floor. Dim depth is a constant of the world,
> not a per-scene knob.

> *"Which elements dim, and which stay lit — and why those?"* Dimmed: the table,
> the Schedule block, the Polymarket block, edge1, edge2 — i.e. everything that
> is *context* for this beat. Lit (untouched): the Desk container and its inner
> lane (the Analyst / Update Board pair, passed through `lanes={{2: {}}}`). The
> rule is mechanical: the focal object and *its interior* stay at full
> brightness; its neighbors recede. The lane stays lit because it lives *inside*
> the container — dimming it would contradict 'the container is the subject.'

`editing` is a plain boolean window, `t ∈ [0.5, 6.0)`, fed to
`cont={{highlighted: editing}}`. That draws the container's blue inset ring
(`COLORS.secondary = #33b4ff`, the product's selection color).

> *"Why a hard boolean for the ring instead of a pulse like the dim?"* Because a
> selection ring in the real UI is binary — an element is selected or it isn't;
> it doesn't fade in over half a second. Snapping the ring on/off matches the
> product. The *dim* fades (it's an atmospheric move), but the *ring* is a state
> flag, so it toggles. Note the ring's window (0.5→6.0) sits just *inside* the
> dim's (0.4→6.3): the world starts receding a hair before the ring lands and
> finishes brightening a hair after the ring lets go, so the ring never appears
> against a still-bright frame or lingers against a re-lit one.

### (b) The editor card slides in and out — `cardIn = pulseWindow(t, 0.8, 1.4, 5.2, 5.8)`, `cardSlide = 1 - ramp(t, 0.8, 1.4)`

`cardIn` is the card's opacity: up over **0.8s → 1.4s**, hold, down over **5.2s
→ 5.8s**. `cardSlide` is its horizontal offset: `1 - ramp(t, 0.8, 1.4)` goes
from 1 (offset) to 0 (in place) over the *same* 0.8→1.4 window, and the card's
left is `CARD_VX + 80 * slide` — so it travels 80px from the right as it fades
in, then holds at rest.

> *"Why does the card enter at 0.8, after the dim starts at 0.4?"* Order of
> operations as a tiny piece of storytelling: first the world recedes and the
> container lights up (0.4–0.9), *then* the editor for that lit thing arrives
> (0.8–1.4). The ~0.4s overlap means it doesn't feel like two disconnected
> events, but the lead is enough that you read 'the desk got selected → its
> editor opened,' cause before effect. If the card arrived first, you'd be
> looking at a panel for a thing that wasn't yet the subject.

> *"Why only 80px of slide — why not fly it across the frame?"* Because a small
> travel paired with a fade reads as 'a panel opening,' which is the product
> gesture; a long fly-in reads as 'a card being thrown on screen,' which is
> trailer motion this series bans. 80px is just enough lateral movement to give
> the entrance a direction (from the right, where side panels live) without it
> becoming the event. The fade carries most of the entrance; the slide only
> flavors it.

> *"Why no easing on the slide?"* `cardSlide` is a raw `ramp` (linear). The slide
> is short (80px) and paired with an opacity fade that already softens the
> arrival; an ease would be imperceptible over that distance and would risk
> desyncing the slide from the fade (they share the 0.8→1.4 window and should
> move in lockstep). Linear keeps them locked.

Note the card's exit (opacity down 5.2→5.8) does *not* slide back out — `slide`
is `1 - ramp(t, 0.8, 1.4)`, which is pinned at 0 for the rest of the scene. The
card leaves by **fading only**, in place.

> *"Why fade out without sliding back?"* A symmetric slide-out would re-introduce
> motion right at the scene's tail, where we want things settling. Fading in
> place is the quietest possible exit — the editor just dismisses. The entrance
> earns a little direction (you're opening something); the exit doesn't need any
> (you're done). Asymmetry here is correct.

### (c) The reference tag glows, then releases — `itemsGlow = pulseWindow(t, 2.2, 2.8, 4.4, 5.0)`

This is the scene's payload. `itemsGlow` rises over **2.2s → 2.8s**, holds, and
falls over **4.4s → 5.0s** — about a 1.6s lit hold in the middle. It's passed
into the `Parallel Items` field's `<Tag>`, whose `glow` prop interpolates the
text from `COLORS.text` (`#e6e6e6`, plain) to `COLORS.secondary` (`#33b4ff`,
selection-blue) and fades in a `rgba(51,180,255, 0.14*glow)` background — the
exact treatment the editor gives a recognized `<block.field>` reference.

> *"Why glow the tag — what is the glow teaching?"* The glow is the definition of
> a reference, shown rather than said. Plain text in a field is just a string. A
> `<block.field>` token, when the editor recognizes it as a *live binding*,
> lights up selection-blue — that color is the product saying 'this is a
> resolved reference to another block, not literal text.' By ramping the tag from
> plain `#e6e6e6` *into* that blue, the animation enacts the moment of
> recognition: 'this isn't a label, it's a wire written as a value.' That single
> color transition is the whole lesson of the scene. It's also the same blue used
> for the editing ring and (later) `<parallel.currentItem>`'s glow — one color
> means 'reference / selection' across the entire video.

> *"Why does the glow fire at 2.2, well after the card lands at 1.4?"* Same
> discipline as scene 1's row-then-select: let the card fully arrive and settle
> (1.4), give the viewer a beat to read the two fields, *then* make the one
> pointing gesture (glow at 2.2). Stacking the card's entrance and the tag's glow
> in the same instant would blur both — you'd be reading layout and parsing a
> highlight at once. Separate them and each lands clean: here's the editor → *now
> look at this line.*

> *"Why does the glow release at 4.4–5.0, before the card even leaves at
> 5.2–5.8?"* Because the glow is transient recognition, and the scene's job is to
> *teach* the reference, not to leave it lit forever. The order on the way out is
> the reverse of the way in: the tag returns to plain text (4.4–5.0), *then* the
> card dismisses (5.2–5.8), *then* the ring releases and the world brightens
> (5.8–6.3). Recognition is a momentary act; the binding itself is permanent but
> unremarkable — so the tag ends as plain text, the same as it started.

## Why everything reverts before the scene ends

By **6.3s** every animated value is back to its starting state: `dimW` is 0 (world
at full brightness), `editing` is false (no ring), `cardIn` is 0 (card gone),
`itemsGlow` is 0 (tag plain). The scene leaves the desk in *exactly* the idle,
fully-lit state scene 2 handed it.

> *"Why undo everything — wasn't the point to show the reference?"* The point was
> to *teach* the reference, and the reference doesn't need to stay highlighted to
> stay true. More importantly, this is a runless aside dropped into the middle of
> the video: scene 4 needs to open on the same clean idle desk that scene 2 left,
> so it can arm the schedule from a neutral state. If this scene ended with a ring
> still on, or the table still dimmed, scene 4 would either inherit that or jump.
> The zoom-aside is a *parenthesis* — you open it, say the thing, and close it so
> the sentence around it is undisturbed. The boundary carries the template idle
> state, identical on both sides, by construction.

> *"Isn't reverting just to revert wasted motion?"* No — it's continuity made
> cheap. Because the scene returns to its enter state, the boundary into scene 4
> is the same frame as the boundary out of scene 2: idle desk, CAM_ALL, nothing
> lit. Three scenes share one rest state, so two cuts are free. A scene that
> *parks* in a changed state forces the next scene to either match the change or
> absorb a jump; a scene that *closes its own parenthesis* costs nothing
> downstream.

## How to think about the whole scene

Walk the decisions and each one answers a question:

1. *What am I explaining?* One reference (`<polymarket.markets>`) — so render the
   product's real editor, not a diagram of one.
2. *How do I make one element the subject without moving the camera?* Dim its
   neighbors to the 0.35 floor and leave it lit → hierarchy by brightness, the
   table still readable for bearings.
3. *How do I dim "everything but the container"?* Per-element dim (table, two
   blocks, two edges), never the global `dim` — the container is exempt, never
   re-lit.
4. *Where does the editor live?* A viewport-space overlay above the dimmed world,
   not a stage citizen → it reads as a panel, immune to the dim and the camera.
5. *How do I link block and editor without a wire?* Synchrony only — they share a
   clock, never a connector line, because lines mean dataflow and nothing flows.
6. *How do I show what a reference IS?* Ramp the tag from plain text into
   selection-blue → the product's own 'this is a live binding' treatment,
   enacted.
7. *How does the parenthesis close?* Everything reverts by 6.3s → the idle desk
   is identical on both boundaries, so scene 4 inherits a clean state.

There's no single clever move. The quality is the sum of seven small, restrained
decisions — and the restraint (steady camera, partial dim, no connector, full
revert) is what keeps it reading as a calm aside rather than a busy interlude.

## Exit state (what scene 4 inherits)

`desk idle and fully lit · no editing ring (released by 6.3s) · no card · tag
plain text · table + chain at full brightness · camera at CAM_ALL`. This is
pixel-identical to scene 2's exit and to scene 4's enter — the runless middle
shares one rest state across two cuts. The hold from 6.3s to the scene's end is
a latched settle on that idle desk, extend-safe by construction (no motion in
flight for the narration to interrupt).

<!-- ── market-desk / 04-armed.md ── -->

# Scene 4 — `armed`  ·  archetype: **morph at state level**

Source: `../source/scenes/ArmedScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the shortest scene in the video — about five seconds, one gesture.
Read it as the worked example of *restraint*: a scene that does exactly one
thing, says one sentence, and gets out. The lesson here isn't "how to do a lot";
it's "how to know when one move is the whole scene."

---

## What this scene is for

By the end of scene 3 the desk is fully built and fully wired: the table up top,
the Schedule → Polymarket → Desk chain below, one reference connecting the
market pull to the parallel. Everything is *assembled* — but nothing is *armed*.
The workflow exists; it isn't deployed.

This scene's whole job is to flip that one bit. It says: **deploy once, and the
desk re-prices the board every hour, attended or not.** That's the entire idea.
The schedule was always *configured* (scene 2 showed its `Run frequency: Hourly`
rows), but configured isn't running — deploying is the act that turns a drawn
clock into a live one.

So the rule, again, is *one idea per scene*: this scene is "the workflow gets
deployed, and now it's armed." Full stop. No run happens here — the clock
doesn't *fire* until scene 5. This scene only **arms** it. Resist the urge to
also show the first run; that's a different idea and it gets its own scene.

## What it looks like

The whole set piece is on screen at home framing (`CAM_ALL`). A blue editing
ring lands on the **Schedule** block — the leftmost block in the chain. As it
lands, a small pill **rises** into place above that block: a green live dot, then
the text `Every hour · Next: Jun 12, 3:00 PM`. A beat later the ring releases —
but the pill **stays**. That's it. That residual pill is the scene's entire
output, and it persists for the rest of the video.

## The one real decision: this scene is a state delta, not a build

Look at how little the scene component contains:

```tsx
const editing = t >= 0.6 && t < 2.6;
const pillReveal = ramp(t, 1.5, 2.1, EASING.out);

return (
  <Stage
    cam={CAM_ALL}
    sched={{highlighted: editing}}
    pill={{reveal: pillReveal, swap: 0}}
    lanes={{2: {}}}
  />
);
```

Four props. The camera, one boolean on the Schedule block, one ramp on the pill,
and an empty lane object. Everything else — the table, the wires, Polymarket, the
container, the inner lane — is rendered by `<Stage/>` at its default state,
exactly as scene 3 left it. The scene authors *only the delta*.

This is the **morph at state level** archetype in its purest form. Nothing
enters, nothing assembles, nothing relayouts. The set piece is already there; the
scene changes *one piece of state* (Schedule goes from idle to deployed) and lets
the rest of the frame sit. Compare scene 2, which has nine staggered entrances —
that's an *assemble* scene. This one has zero entrances and one state flip. The
archetype tells you how much machinery the scene needs, and the answer here is
almost none.

> *"Why is `lanes={{2: {}}}` there at all if it's empty?"* It's the followed
> lane (lane 2) declared with no state overrides — which makes the Analyst and
> Update Board render at their default visibility. Leave it out and the inner
> lane would still draw (the rig always draws lane 2), but passing the empty
> object keeps the prop shape identical to the neighboring scenes. Continuity is
> partly a discipline of *not* varying things you don't mean to vary: same set
> piece, same lane declared, only the two things this scene is about changed.

## The camera

```ts
cam = CAM_ALL = { px: 1200, py: 735, s: 0.78 }
```

Static, the whole scene. `CAM_ALL` is the video's home framing — the point
`(1200, 735)` (the center of the table-plus-chain content box) held at the
viewport center, zoomed to **0.78×** so the entire desk fits in frame.

> *"Why no camera move here when almost every other scene has one?"* Because the
> scene's single gesture is small and local — a ring and a pill on one block —
> and the viewer needs to *see the whole desk* while it happens. The point being
> made is "this one block arms the *whole* thing," which only reads if the whole
> thing is in frame. A push-in onto the Schedule block would say "look at this
> block in isolation," the opposite of the intended meaning. The camera holds
> wide precisely so the armed pill is read in the context of everything it's
> about to drive. A still camera is a choice, not an absence of one.
>
> *"Why `0.78` specifically?"* It's the framing scenes 2, 3, 5, and 8 also use —
> the content box (x 128..2273, y 150..1321) fits the 1920-wide viewport at
> 0.78. Reusing the exact same number is what makes the cuts between these scenes
> seamless: the desk is pixel-for-pixel in the same place. The home framing is a
> shared constant, not re-chosen per scene.

## The two gestures, and why they overlap

There are only two animated things, and their timing is the whole craft of the
scene. Both are built from the same two helpers the rest of the video uses:
`ramp(t, t0, t1, easing?)` (0→1 across `t0`→`t1`, clamped, optionally eased) and
the boolean window.

### (a) The blue editing ring — `editing = t >= 0.6 && t < 2.6`

The Schedule block carries `highlighted: true` for the window **0.6s → 2.6s**,
then drops back to `false`. In the rig, `highlighted` draws the product's **blue
selection ring** around the block (`COLORS.secondary`, the same inset box-shadow
the container uses in scene 3).

> *"Why blue, and why does blue read as 'deploying'?"* Blue is the product's
> *editing / selected* color — it's the ring you see when you've clicked a block
> to act on it. Throughout this video, blue = "a thing is being acted upon by
> you" (scene 3's container ring, this scene's Schedule ring), while green = "a
> thing ran and succeeded" and a live-blue ring on a *running* block = "executing
> now." Here we want "you are performing the deploy *on* the Schedule block" —
> an authored act, not a runtime event — so it's the editing ring, the same
> grammar as scene 3's wiring gesture. Deploying is something you do *to* the
> workflow; the ring lands *on* the block to say so.
>
> *"Why a plain boolean instead of a fade like the pill gets?"* The ring is a
> selection state — in the product it snaps on when you click and snaps off when
> you don't. It doesn't fade in. Modeling it as a boolean (on at 0.6, off at 2.6)
> matches that hard-edged product behavior. The pill, by contrast, is a *new
> object appearing*, so it gets a soft entrance. Two different things, two
> different treatments — the ring behaves like the real selection ring, the pill
> behaves like a real object arriving.
>
> *"Why start at 0.6, not 0.0?"* The same reason scene 1 starts its fade at 0.2:
> a short beat of the settled, un-armed desk before anything happens reads as a
> deliberate "before." The cut lands on the inherited state from scene 3, holds
> it for a breath, *then* the deploy gesture begins. Opening on motion already in
> progress would make the cut feel like it clipped the start of the action.

### (b) The pill rises — `pillReveal = ramp(t, 1.5, 2.1, EASING.out)`

The pill's reveal value ramps 0→1 over **1.5s → 2.1s**, eased with `EASING.out`.
That single value drives two things at once in the `SchedulePill` component:

```tsx
top: SCHED_PILL.y + (1 - reveal) * 14,
opacity: reveal * (1 - 0.65 * dimmed),
```

So at `reveal = 0` the pill is 14px **below** its resting spot and fully
transparent; as `reveal` climbs to 1 it slides up those 14px and fades in
together. It **rises into place** rather than simply appearing.

> *"Why make it rise 14px instead of just fading in?"* A pure opacity fade reads
> as "this label was always here, you just couldn't see it." A rise reads as
> "this came into being just now, *because* of what you just did." The 14px lift
> ties the pill's arrival causally to the deploy gesture — it's the *result* of
> arming, surfacing from the block. It's a small distance on purpose: enough to
> register as a deliberate entrance, not so much that it looks like it flew in
> from somewhere. (Compare scene 1's table rows, which don't move at all — they
> *populate* an existing table. There, "already there, filling in" is the right
> read. Here, "newly created" is, so this one moves.)
>
> *"Why `EASING.out` on the rise but no easing on scene 1's fades?"* Because this
> value drives *spatial* motion — the pill travels 14px through space — and
> easing is for things that travel. `EASING.out` (decelerate-to-rest) makes it
> arrive and settle, like it's landing into its slot. Scene 1's table fade was
> pure opacity with no spatial component, so it was left linear; an ease there
> would be invisible. The rule is consistent across the whole project: ease what
> moves, leave flat what only changes opacity.
>
> *"Why 1.5→2.1 — why does the pill start rising a beat after the ring lands?"*
> Sequence is meaning. The ring lands at 0.6; the pill begins at 1.5, ~0.9s
> later. That gap encodes cause and effect: *first* you deploy (ring on the
> block), *then* the armed state appears (pill rises). If they fired together the
> viewer couldn't tell which caused which — it'd read as two simultaneous
> decorations. Staggered, it reads as a sentence: "deploy → now it's armed." The
> pill finishes rising at 2.1, comfortably before the ring releases at 2.6, so
> you see the armed state *while the block is still selected* — the deploy and
> its consequence briefly coexist, which is what seals the causal read.

### Where the pill's words come from

The text is `Every hour · Next: Jun 12, 3:00 PM`, and not one character of it is
free-typed. From `data.ts`:

```ts
export const SCHED_PHRASE = "Every hour";       // cronstrue("0 * * * *")
export const NEXT_BEFORE  = "Jun 12, 3:00 PM";
```

> *"Where does 'Every hour' come from — why not 'Hourly' to match the block?"*
> The Schedule block's own row says `Run frequency: Hourly` (the registry option
> label). But the *deployed pill* is a different surface — it's the product's
> schedule marker, and that marker shows the human-readable expansion of the
> underlying cron expression. The block is configured `Hourly`, which compiles to
> the cron string `0 * * * *` ("at minute 0 of every hour"), and **cronstrue** —
> the same library the product uses, the same derivation as the schedules-v1
> rig's "At 8:00 AM" — renders `0 * * * *` as the phrase **"Every hour."** So the
> two surfaces agree without being identical: the block shows the *setting*
> (`Hourly`), the pill shows the *compiled schedule* (`Every hour`). Typing
> "Hourly" into the pill would be a small lie about which surface this is and how
> the phrase is produced.
>
> *"And the `Next: Jun 12, 3:00 PM`?"* That's the product's schedule-info caption
> format — the next scheduled fire time. The exact timestamp is authored demo
> content (`NEXT_BEFORE`), chosen so that one hour later it becomes `4:00 PM`
> (`NEXT_AFTER`) — which is the dip-swap scene 5 performs when the clock fires.
> The "3:00 PM" here exists to be advanced to "4:00 PM" then. The value is set up
> in scene 4 precisely so scene 5 has something to change. `swap: 0` is passed
> here to hold it at the "before" value — the `DipSwap` is wired but at rest.
>
> *"Why the green dot?"* It's the product's *live / active* indicator —
> `#22c55e`, the same green that means "deployed and listening." It's the visual
> half of "this schedule is now armed": the dot says *live*, the text says *what
> it'll do and when*. No word like "DEPLOYED" or "ACTIVE" appears, because the
> green dot already says it. (Style lesson 2: indicate state with visuals, not
> words.)

### (c) The release, and the residue — ring off at 2.6, pill stays forever

At 2.6s the `editing` window closes and the blue ring vanishes. But `pillReveal`
stays clamped at 1 (the `ramp` finished at 2.1 and never comes back down), so the
pill holds at full opacity, in place, for the rest of the scene — and, because
every later scene also passes a `pill` prop, **for the rest of the video.**

> *"Why does the ring release but the pill persist? Aren't they part of the same
> gesture?"* This is the most important idea in the scene, and it's a distinction
> between *transient* and *carried* state. The ring is **transient** — it's the
> act of deploying, and acts are momentary; you click, it's done, the selection
> goes away. The pill is **carried** — it's the *consequence* of the act, the new
> standing fact that the desk is now armed. Consequences persist. The whole
> point of the video's spine is that this run is *scheduled* — so the armed state
> can't be a thing that flashes and disappears; it has to become part of the
> set piece, visible at every subsequent boundary. Scene 5 reads the pill (and
> dip-swaps its time). Scene 9's final frame still shows it, armed for the next
> hour. If the pill released with the ring, the video would have no way to show
> "and it's *still* scheduled" at the end. The release-vs-stay asymmetry *is* the
> meaning: the action ends, the state it created remains.
>
> This is also why the scene is *boundary-safe*. It ends on a settled, latched
> state — ring off, pill at full, nothing mid-flight. Like scene 1's hold, that
> means the scene can be stretched to any length to fit the narration without
> freezing a motion halfway. The armed pill isn't going anywhere; you can sit on
> it as long as the voiceover needs.

### (d) The hold — from ~2.6s to the end (~6.2s authored)

After the ring releases, nothing moves for the remaining ~3.6 seconds. The
armed desk just rests, pill lit.

> *"Isn't 3.6 seconds of stillness on a five-second scene a lot of dead air?"*
> It's a *latched-settle* hold, the same pattern the whole video uses — and on
> the shortest scene it's the smallest hold in the video, which is exactly
> right. The hold is where the narration lands ("deploy once and it runs every
> hour…"), and the scene needs to rest on the armed state long enough for that
> line to register before the clock fires next scene. Short scene, short hold —
> proportion is preserved. The choreography notes call this hold "at the cap,
> fine": ~3.6s is about as long as a settled-state hold should run before it
> starts to feel dead, and this one stops just at that line.

## Why a scene can be this short — and why that's a strength

The instinct on a five-second scene is to feel like it's not *enough* — to pad
it, to add a second gesture, to make the ring do a little dance. Don't. The
reasons this scene earns being the shortest in the video:

1. **It has exactly one idea.** "The workflow gets deployed; now it's armed."
   One idea is one scene, and a one-idea scene that takes twelve seconds is
   *slow*, not thorough. Match the duration to the idea's size.
2. **It inherits a finished frame.** Everything it needs is already on screen
   from scene 3. It has nothing to *build* — no assembly, no entrances. A scene
   that only changes state is intrinsically short, and trying to stretch it means
   inventing motion that doesn't carry meaning (which is scaffolding — style
   lesson 6).
3. **Its job is causal glue, not spectacle.** It's the hinge between "the desk is
   built" (scenes 1–3) and "the desk runs" (scenes 5–8). Hinges should be quick —
   they connect two larger things. Lingering here would sap momentum right before
   the run, which is the part the viewer actually came to see.
4. **Pacing is information.** A short, decisive scene *says* "this is a small,
   decisive act." Deploying a workflow in Sim *is* a single click. The scene's
   brevity mirrors the product truth: arming the desk is one gesture, so the
   scene is one gesture. If it took twelve seconds it would imply deploying is
   laborious, which would be a quiet lie about the product.

The discipline of the whole video is variety of beat *shape*: a long assemble, a
zoom-aside, a quick state flip, a multi-stop camera run. The five-second arming
scene is the *quick state flip* in that mix — and the mix only reads as varied if
some scenes are genuinely short. A short scene isn't a scene you failed to fill;
it's a scene that knows its size.

## How to think about the whole scene

Walk the decisions in order and the questions driving them are all about
*restraint*:

1. *What changes?* One bit: Schedule goes from idle to deployed → author only the
   delta, render the rest of the set piece at default.
2. *How do I show "you deployed this"?* The product's blue editing ring lands on
   the block → an act performed *on* the workflow, in product vocabulary.
3. *How do I show "now it's armed"?* A schedule pill rises above the block →
   a new standing object, entering causally after the deploy.
4. *How do I show "armed" without the word?* Green live dot + the cron-derived
   phrase + the next-fire time → state as visuals, all text grounded.
5. *What stays, what goes?* The act (ring) is transient and releases; the
   consequence (pill) is carried and persists to the final frame → the asymmetry
   *is* the meaning.
6. *How long should it be?* As long as one state flip needs and no longer → the
   shortest scene in the video, on purpose.

There's no clever move here — the quality of the scene is in what it *refuses* to
do. It's the discipline of the whole project applied to its smallest unit.

## Exit state (what scene 5 inherits)

`desk fully built and idle · Schedule editing-ring released (by 2.6s) · armed
pill present and latched, reading "Every hour · Next: Jun 12, 3:00 PM" (swap 0) ·
camera at CAM_ALL`. Scene 5 opens on exactly this frame and lights the Schedule's
ring *on its own* (no incoming pulse — the self-fire), then dip-swaps the pill's
`Next:` from 3:00 PM to 4:00 PM. The pill this scene leaves behind is the object
scene 5 acts on. Because both scenes render the same set piece with the same
camera, that boundary is identical down to the pixel.

<!-- ── market-desk / 05-the-pull.md ── -->

# Scene 5 — `the-pull`  ·  archetype: **run + freeze-cut OUT**

Source: `../source/scenes/ThePullScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the scene where the video's *one run* begins. Everything before it
was setup — the board, the desk assembling, the reference, the arming. This
is the hour striking. Read it as the worked example for "how do I make a
workflow *go* without lying about how it goes," because almost every choice
here is a constraint about honesty: nothing moves that the product wouldn't
actually move, in the order it would actually move it.

---

## What this scene is for

Scenes 1–4 built a machine and left it armed. Scene 5 fires it. The whole
job is to show **one scheduled traversal** of the chain —
Schedule → Polymarket → Desk container — as a single causal sequence: the
clock fires *itself*, that fire pulls the markets, and the whole batch
arrives at the desk's door. The video's remaining run (scenes 6–8) all live
*inside* the moment this scene ends on, so scene 5 has a second, structural
job: it has to **end mid-run, on a live state, and hand that live state
across the cut**. That's the freeze-cut, and it's the reason this scene's
archetype is "run + freeze-cut OUT" rather than just "run."

So the rule is still *one idea per scene* — the idea is "the hour strikes
and the batch heads into the desk" — but this scene carries more
machinery than any before it, because a run is a chain of events and you
have to draw every link.

## What it looks like

The whole desk is on screen at neutral framing. The Schedule block's ring
lights up **on its own** — no pulse arrives at it from anywhere — and at the
same instant the armed pill's `Next:` value flips `3:00 PM → 4:00 PM`. A
streak of light travels left-to-right along edge 1 into Polymarket;
Polymarket goes live. As it does, the five `market` and `odds` cells light
top-to-bottom as a single product selection — the pull *confirming* the
board it's about to price. That selection releases as a second streak
crosses edge 2 into the Desk container, and the container's live ring comes
on — and **stays on through the cut into scene 6.**

## The run grammar — read this before the beats

This scene is the first time the full run vocabulary is on screen at once,
so it's worth stating the three rules it obeys, because every later run
scene obeys them too:

1. **A `WirePulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a streak of blue light, nothing more — not a value, not a
   record, not a payload. A wire firing means "control passed from this
   block to the next," full stop.
2. **Values never ride wires. They resolve *in place*, in rows and cells.**
   When a number appears, it appears in the table cell or block row where it
   *lives* — never as a floating chip drifting down a connector. (The pill's
   `Next:` flip and the table's selection sweep are both in-place events.)
3. **State is shown in the product's own language** — a blue live ring, a
   green ok ring, a selection outline — never a word like "RUNNING" stamped
   on screen.

If you internalize those three, the entire scene decodes: a ring is state,
a streak is control passing, a cell is where a value lives.

> *"Why be this strict — wouldn't a little number flying down the wire read
> faster?"* It would read faster and teach a lie. In Sim, the edge between
> two blocks is execution order; the data flows by *reference*
> (`<polymarket.markets>`), resolved where it's used. A value sliding down a
> wire would tell the viewer the product passes data along edges, which it
> doesn't. The grammar isn't decoration — it's the load-bearing claim about
> how the product works, and breaking it for a flashier frame is exactly the
> kind of slop this series exists to avoid.

## The one set piece, again

As in every scene, this renders the *single* `<Stage/>` — the same table,
the same chain, the same container, the same pill — and differs only in
state props and camera. Nothing is mounted or unmounted at the cut; the
chain that was idle in scene 4 is the same chain that fires here. That's why
the `4→5` boundary is identical down to the pixel: scene 4 left the pill
armed at `3:00 PM` with the chain idle, and scene 5 opens on exactly that
frame before anything fires.

## The camera

```ts
cam = CAM_ALL = { px: 1200, py: 735, s: 0.78 }
```

The camera does **not move** in this scene. It sits at `CAM_ALL`, the
video's home framing — the whole set piece (table + chain) centered at
`0.78×`.

> *"Why hold the camera still through the scene where the most is
> happening?"* Because the *content* is moving — a ring, a swap, two
> pulses, a five-row sweep — and the viewer needs a fixed frame to read that
> motion against. If the camera also moved, you'd have motion-on-motion and
> the eye couldn't tell what's the event and what's the lens. The rule of
> thumb across the build: **move the camera between scenes, not during the
> ones where the diagram itself is doing the work.** Scene 6 *will* move the
> camera (it leans onto the container) — but it moves *first*, then the fan
> opens. Here the run is the event, so the camera gets out of its way.
>
> *"Why `CAM_ALL` and not something tighter on the chain?"* Because the
> chain-to-table sync is the whole point of the scene, and that sync spans
> the *full* set piece — the pull is down in the chain, the confirmation
> sweep is up in the table. You need both in frame at once or you can't see
> the one thing this scene is about: the pull confirming the board.

## Beat 1 — the self-fire (the heart of the scene)

```ts
const schedLive = t >= 1.0 && t < 2.5;   // Schedule ring, no incoming pulse
const pillSwap = ramp(t, 1.3, 1.8);      // Next: 3:00 PM → 4:00 PM
```

The Schedule block's live ring is a plain boolean window: on from **1.0s**
to **2.5s**. And — this is the entire teaching point — **nothing arrives at
the Schedule from anywhere.** There is no `pulse0`, no incoming edge, no
streak feeding into it. It simply lights.

> *"Why no incoming pulse — every other block in this scene gets one?"*
> Because a schedule **fires itself.** That's what a schedule *is*: it has
> no upstream block, no trigger you can point at — `hideTargetHandle` is set
> on the Schedule block precisely because nothing can wire *into* it. The
> hour comes, and it goes. If you drew a pulse arriving at the Schedule,
> you'd be answering the question "what triggered the run?" with "something
> off-screen did" — which is false and which quietly undermines the whole
> *armed-and-unattended* premise the previous scene set up. The absence of
> an incoming pulse is not a thing we forgot to animate; it is the scene's
> central claim, drawn as a negative. **"Nothing arrives from anywhere" is
> the point.**

In sync with the ring lighting, the pill's `Next:` value dip-swaps from
`3:00 PM` to `4:00 PM`:

```ts
<DipSwap a={NEXT_BEFORE} b={NEXT_AFTER} mix={swap} />
// NEXT_BEFORE = "Jun 12, 3:00 PM"   NEXT_AFTER = "Jun 12, 4:00 PM"
```

`DipSwap` shows `a` while `mix < 0.5` and `b` once `mix ≥ 0.5`, and fades
its own opacity to zero at the `0.5` midpoint (`|mix − 0.5| · 4`) so the old
value *dips out* and the new value *dips in* through a brief blank — never a
hard cut between two strings. Driven by `pillSwap = ramp(t, 1.3, 1.8)`, the
swap completes over `1.3 → 1.8s`, landing the new value just after the ring
appears.

> *"Why does the pill's clock move at the same moment the ring fires?"*
> Because they are **two surfaces showing one event.** A schedule firing and
> a schedule re-arming for the next hour are the same act — it fires *and*
> computes its next run in the same tick. The ring says "it fired"; the
> `Next:` flip says "and it's already armed again for the hour after." Two
> faces of the single fact "the clock struck," shown synchronously so the
> viewer reads them as one event, not two. This is the *self-fire + pill
> dip-swap* move, and it's the cleanest way to say "scheduled" without a
> word on screen.
>
> *"Why `3:00 → 4:00`, and why an hour?"* Both values are grounded in the
> block's own config. The Schedule is `Run frequency: Hourly · Minute: 0`,
> i.e. cron `0 * * * *`. `Every hour` is the cronstrue rendering of that
> expression; `3:00 PM → 4:00 PM` is one hour's advance — the literal next
> two fire times. The numbers aren't chosen for the animation; they fall out
> of the configured schedule. If the block said "every 30 minutes," the swap
> would read `3:00 → 3:30`.
>
> *"Why 1.3–1.8 — why is the swap a beat *after* the ring at 1.0?"* The ring
> is the cause (the hour struck); the re-arm is the consequence (so the next
> one is scheduled). A ~0.3s lead lets the eye land on the ring first, then
> catch the clock advancing — cause then effect, even at this tiny scale.
> Firing them on the exact same frame would blur the two into one
> undifferentiated flash.

## Beat 2 — the pulse crosses edge 1 into Polymarket

```ts
const pulse1 = ramp(t, 2.2, 2.9, EASING.inOut);          // streak travels the wire
const edge1Hi = pulseWindow(t, 2.2, 2.6, 4.0, 4.5);      // wire heats while live
const polyLive = t >= 2.8 && t < 5.5;                    // Polymarket live ring
const polyOk   = t >= 5.5 && t < 7.2;                    // → green ok ring
```

A `WirePulse` is mounted on edge 1 (Schedule → Polymarket) and its progress
`p` runs `0 → 1` over `2.2 → 2.9s`, eased `inOut`. The streak emerges from
the Schedule's source handle, travels the wire, and is absorbed at
Polymarket's target handle. The wire itself *heats* underneath the streak —
`edge1Hi` ramps the edge color from the dim `wire` grey toward the bright
`secondary` blue and thickens it from `2.25` to `3.5px` — over `2.2 → 2.6`,
holds, then cools back down over `4.0 → 4.5`. As the streak lands,
Polymarket's live ring comes on (`polyLive`, from `2.8`), and once the pull
completes it flips to a green `ok` ring (`polyOk`, `5.5 → 7.2`).

> *"Why does the pulse fire at 2.2 when the ring lit at 1.0?"* The self-fire
> beat (ring + clock swap) needs its own air to read as "the clock struck"
> before the consequence travels. Stack the pulse onto the ring and the two
> ideas — *the clock fired* and *that fire pulled the markets* — collapse
> into one muddy moment. The ~1.2s gap is the causal beat: strike, *then*
> pull.
>
> *"Why `EASING.inOut` on the pulse instead of linear?"* Because the streak
> is a thing *traveling through space* — it has momentum. `inOut` gives it a
> gentle accelerate-then-decelerate, so it leaves the source handle softly
> and settles into the target rather than arriving at a hard stop. (Compare
> the table fade in scene 1, which is left linear precisely *because*
> nothing travels — only opacity changes. Easing is for things that move.)
> This is the project's consistent rule: `inOut` for transforms and travel,
> `out` for entrances, `in` for exits.
>
> *"Why is `edge1Hi` a separate pulseWindow from `pulse1` — couldn't one
> value do both?"* No, because they describe different lifetimes. The
> *streak* is a quick traversal (`2.2 → 2.9`, then gone — note `WirePulse`
> returns `null` outside `0 < p < 1`, so it vanishes the instant it lands).
> The *heat* on the wire should linger while the downstream block is
> actively running and only cool once the pull is done — hence it holds from
> `2.6` all the way to `4.0` before fading. A streak is an instant; "this
> wire is on the live path" is a duration. Two timings, two drivers.
>
> *"Why `polyLive` then `polyOk` — two rings?"* Same product grammar as
> every block: blue while it's working, green when it succeeded. Polymarket
> is *live* while it's fetching (`2.8 → 5.5`), then settles *ok*
> (`5.5 → 7.2`) once the markets are in hand. The color carries the state;
> no "DONE" label needed.

## Beat 3 — the chain-to-table sync (the pull confirms the board)

This is the scene's signature move and the one most worth copying. While
Polymarket is live, the five `market` + `odds` cells light top-to-bottom as
a **single product selection range** — the pull reaching up and confirming
the very rows it's about to price.

```ts
const rangeHi = (r: number) =>
    Math.min(
        ramp(t, 3.1 + r * 0.14, 3.6 + r * 0.14),   // sweep in, 0.14s/row stagger
        1 - ramp(t, 5.5, 6.1),                      // release as ONE at 5.5–6.1
    );
const cellHi = (c: number, r: number) =>
    c <= ODDS_COL && r < TABLE_ROWS ? rangeHi(r) : 0;
```

Each row's highlight ramps up over its own `0.5s` window, staggered `0.14s`
per row — row 0 lights over `3.1 → 3.6`, row 1 over `3.24 → 3.74`, and so on
down to row 4. The `Math.min` against `1 − ramp(t, 5.5, 6.1)` means every
row, no matter when it lit, **releases together** over `5.5 → 6.1`. Feeding
`SimTable`'s `cellHighlight` a non-zero value across a contiguous block of
cells makes it draw the product's real `--selection` outline around that
block — one selection sweeping the watchlist, not five separate boxes.

The crucial detail is the column gate: `c <= ODDS_COL`. Only columns 0 and 1
(`market`, `odds`) light. The `agent_est`, `edge`, and `signal` columns stay
completely dark.

> *"Why only `market` and `odds` — why not sweep the whole row?"* Because
> those two columns are **what the Polymarket pull actually returns.**
> `get_markets` gives you the markets and their current crowd odds — that's
> it. The estimate, the edge, and the signal don't exist yet; they're what
> the *desk* will compute, downstream, in the run that's only just begun.
> Lighting `agent_est`/`edge`/`signal` here would claim the pull confirmed
> values it has no way to know. By selecting exactly the pre-seeded columns,
> the sweep says something true and specific: *"the markets Polymarket just
> pulled match the markets on your board"* — the pull confirming the
> watchlist against live data, which is the honest meaning of the beat. The
> three empty columns staying dark is the same planted question from scene 1,
> still unanswered, deliberately.
>
> *"Why `0.14s` per row — where does that come from?"* It's the scene's
> chosen sweep cadence, fast enough that the five rows read as one connected
> *sweep* rather than five separate selections, slow enough that you can feel
> direction (top-to-bottom — the pull arriving and confirming row by row). It
> deliberately differs from scene 1's `0.35s` row stagger: scene 1 was
> *populating* a table (each row is a distinct arrival you should land on);
> this is *sweeping* an existing one (a single gesture passing over it).
> Different verb, faster cadence.
>
> *"Why release all five at once instead of un-staggering them?"* Because
> the *release* isn't a per-row event — it's the single fact "the pull
> moved on." The whole confirmation lets go as one because one thing caused
> it: control leaving Polymarket and heading into the container (beat 4). A
> staggered release would imply each row finished confirming on its own
> clock, which isn't what happened — they were one selection, so they
> release as one.
>
> *"Why is this 'synchrony only' and not data moving from chain to table?"*
> No value crosses from Polymarket to the table here — the table cells'
> *contents* don't change at all (still `market` + `odds`, still three empty
> columns). What's synchronized is *timing*: the table selection is alive
> exactly while Polymarket is live, and dies when the pull moves on. The
> sync is a temporal rhyme — "these two surfaces are part of the same
> event" — not a data transfer. The grammar holds: nothing rode the wire.

## Beat 4 — the pulse crosses edge 2 into the container

```ts
const pulse2 = ramp(t, 5.6, 6.3, EASING.inOut);          // streak into the container
const edge2Hi = pulseWindow(t, 5.6, 6.0, 7.3, 7.8);      // edge 2 heats
const contLive = t >= 6.2;                                // container live ring — LATCHED
```

A second `WirePulse` rides edge 2 (Polymarket → the Desk container) over
`5.6 → 6.3`, again eased `inOut`, with edge 2 heating over `5.6 → 6.0` and
cooling over `7.3 → 7.8`. Notice the timing lock: the table selection
releases over `5.5 → 6.1`, and `pulse2` departs over `5.6 → 6.3`. **The
range releases *as* the pulse leaves** — the confirmation lets go because
control is moving on, the two events interleaved so the viewer reads cause
(pulse departs) and effect (selection releases) as a single hand-off.

When the streak lands, the container's live ring comes on at `t >= 6.2` —
and this one has **no upper bound.** Every other state window in the scene
is a closed interval (`schedLive` ends at `2.5`, `polyLive` at `5.5`); this
one is open. The container is live from `6.2s` to the end of the scene and
*beyond the cut.*

> *"Why is `contLive` latched open while every other ring is a closed
> window?"* Because this is the **freeze-cut carry** — the one piece of live
> state the scene is built to hand forward. The Schedule fired and finished;
> Polymarket pulled and went green; both are *done*. But the container is
> *not* done — the batch has only just arrived at its door; the actual work
> (the fan, the analysts) happens in scenes 6–8, which all play *inside this
> live moment.* So the container's ring must not revert. It latches on and
> stays on across the boundary.

## What a freeze-cut is, and why hold state across the boundary

A **freeze-cut** is a hard cut between two scenes where the *visual state is
identical on both sides* — the last frame of scene 5 and the first frame of
scene 6 are the same picture — but the camera and the action then diverge.
Scene 6 opens on the held frame (container live, batch arrived) and *then*
starts moving: the camera leans in, the lane fans out. The cut is invisible
because nothing jumps; the continuation is what tells you a cut happened.

> *"Why hold state across the cut instead of just letting scene 6 set it up
> again?"* Two reasons, one structural and one about honesty. **Structurally:**
> the run is *one continuous event.* The clock fired once; that single fire
> is still propagating through scenes 6, 7, and 8. If scene 5 reverted the
> container ring at its end and scene 6 re-lit it, you'd be drawing *two*
> runs — fire, stop, fire again — when the truth is one run seen at three
> scales (the pull, the fan, one analyst). Holding the live state across the
> boundary is what makes the four scenes read as a single traversal rather
> than four restarts. **For continuity:** because both scenes render the same
> `<Stage/>` and scene 6 simply *inherits* the latched `contLive`, the
> boundary is identical by construction — there's no chance of a one-frame
> flicker where the ring blinks off and back on. The freeze-cut isn't a
> trick you perform; it's the natural consequence of *not reverting* a state
> that the next scene needs.

This is also why the scene ends on a **latched-settle hold** (from `7.8s` to
the scene's end, ~3.5s): once the container ring is on and the pill reads
`4:00 PM`, nothing else moves. The held frame *is* the state scene 6
inherits. A scene that ends on a settled, latched state can be stretched to
fit narration without freezing any motion mid-flight — and, here, can be
cut away from at any frame without losing the live state, because the live
state is latched rather than mid-animation.

## The values, and where they all trace to

Everything on screen comes from `data.ts` — no value is invented in the
scene file:

| surface | value | source |
|---|---|---|
| Schedule rows | `Run frequency: Hourly` · `Minute: 0` | `SCHED_ROWS` |
| pill (before) | `Every hour · Next: Jun 12, 3:00 PM` | `SCHED_PHRASE`, `NEXT_BEFORE` |
| pill (after) | `Every hour · Next: Jun 12, 4:00 PM` | `SCHED_PHRASE`, `NEXT_AFTER` |
| Polymarket rows | `Get Markets` · `Sort By: Volume` · `Limit: 5` | `POLY_ROWS` |
| table (unchanged) | 5 markets + odds; est/edge/signal empty | `MARKETS` via `boardRows` |

The table contents do **not** change in this scene — `fillMix` is never
passed, so every row stays `market` + `odds` with three empty columns
(`boardRows` writes empty strings until `mix ≥ 0.5`). The selection sweep
lights cells; it doesn't fill them. The filling starts in scene 7, when an
analyst actually finishes. Keeping the cells empty here is the same
honesty rule as scene 1: **a table cannot show a value the run hasn't
produced.** The pull confirms the board; it doesn't price it.

## How to think about the whole scene

Walk the events in causal order and the scene is just the run, drawn
truthfully:

1. *What starts a scheduled run?* The schedule, by itself → a ring with **no
   incoming pulse**, plus the `Next:` clock advancing an hour. The self-fire.
2. *What does that fire do?* Passes control down the wire → a `WirePulse`
   on edge 1, Polymarket goes live.
3. *What did the pull get?* The markets and their odds → a selection sweep
   over **only** the `market` + `odds` columns, in sync with Polymarket
   being live. The pull confirming the board.
4. *Where does control go next?* Into the desk → a second `WirePulse` on
   edge 2, the selection releasing as it departs.
5. *What's the run's state at the cut?* The batch is at the desk and the
   work is about to start → the container's live ring **latches on and holds
   through the cut.**

Every one of those is a link in one causal chain, and the discipline of the
scene is drawing each link in the product's own grammar — ring for state,
streak for control passing, in-place selection for the confirmation — and
*never* breaking the rule that wires carry light, not cargo. The scene is
charged and busy, but it isn't *cluttered*, because each beat is one link
and the links are sequenced, not stacked.

## Exit state (what scene 6 inherits — a freeze-cut carry)

`container live ring ON (latched, carries across the cut) · pill reads
"Next: Jun 12, 4:00 PM" (swap landed) · table selection released · table
cells unchanged (market + odds, three empty columns) · Schedule and
Polymarket settled (Polymarket green ok) · fan = 0 (still one lane) ·
camera at CAM_ALL`.

This is a **freeze-cut**: scene 6 opens on this exact frame — the held live
moment — and the carried state is the **container's live ring**. Scene 6
does not re-establish that the run is happening; it inherits a run already
in flight and continues it, easing the camera onto the container before
opening the runtime fan. Because both scenes render the same set piece and
scene 6 simply keeps `contLive` latched, the boundary is identical down to
the pixel.

<!-- ── market-desk / 06-the-fan.md ── -->

# Scene 6 — `the-fan`  ·  archetype: **freeze-cut continuation + runtime fan**

Source: `../source/scenes/TheFanScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`.

This is the scene where the container actually does the one thing it's *for*:
it takes a single lane and runs it five times at once. It's also the scene
with the most discipline packed into the fewest lines — 48 of them — because
the whole illusion ("five concurrent analysts") is a runtime animation over
geometry that, on the canvas, is still **one lane**. Read it as the worked
example of the rule that costs people the most rounds: *a container contains
its children; the fan must never overflow the box.*

---

## What this scene is for

Scene 5 ended on a held, charged frame: the schedule fired on its own, the
pull swept the board, and the batch crossed into the Desk container, whose
live ring came on and **stayed on through the cut**. This scene opens *inside*
that held moment — the ring is already lit — and answers the question the held
frame planted: *the batch went into the container; now what?*

The answer is the parallel's whole reason to exist. One analyst lane fans out
into five, each pinned to one market, and — this is the load-bearing idea —
they all start **at the same instant**. The scene's one job is to make that
simultaneity legible: not "five lanes appear" but "five lanes leave the gate
together, on one clock." So everything in the scene is choreographed to fire
*together* where the parallel fires together, and *once* where the parallel
acts once.

The *one idea per scene* rule here is "the batch splits into one-analyst-per-
market, all starting at once." It is deliberately **not** "watch an analyst
work" (that's scene 7, at lane framing) and **not** "watch the estimates land"
(that's scene 8, the money shot). This scene splits and launches; it does not
finish anything. No row fills, no tool rings, no `ok` states. Resist the urge
to start showing work here — the fan-and-launch *is* the beat.

## What it looks like

We're already leaning toward the container (the camera finishes its move onto
it). The single analyst lane sitting inside the Desk box separates into five:
two compact "ghost" lanes peel off above the followed lane, two below, all
emerging from behind it and sliding to their resting positions — symmetric,
inside the box. The inner Start pill blips blue once. Five curved wires light
from the pill out to the five Analysts in one motion, and all five Analyst
blocks take the live ring **on the same frame**. In the one followed lane (the
full-detail middle one), the Analyst's Messages reference
`<parallel.currentItem>` glows, dips, and resolves to its market —
`[GPT-6 ships in 2026]`. Then it holds, fan open, through the cut into scene 7.

## The one real decision: the fan is a runtime animation over ONE lane

The canvas — the actual laid-out geometry in `layout.ts` — contains exactly
**one** analyst lane (`Analyst → Update Board`), sitting at the vertical center
of the container body. The four other lanes you see during this scene are
*ghost instances* that exist **only while `fan > 0`**. The Stage renders them
conditionally:

```tsx
{/* Ghost instances (RUNTIME fan only: header-only pairs). */}
{fan > 0 ? ([0, 1, 3, 4] as LaneId[]).map(ghostLane) : null}

{/* The followed lane (full rows) — the canvas's ONE lane. */}
<div style={{... top: laneTop(2, fan) - CONT_Y ...}}>
  <SimBlock name="Analyst" .../>
  ...
```

This is the single most important discipline in the build, and it's worth
stating as a rule with its own name. **The canvas shows one lane; the fan is
runtime animation only.** (It's case study 17's rule 4, and the layout header,
the rig header, and the choreography all repeat it because it's the thing that
goes wrong.)

> *"Why fan at runtime instead of just drawing five lanes?"* Two reasons, and
> they compound. First, **honesty**: a Parallel container in Sim *is* one lane.
> The author wires a single `Analyst → Update Board`; the runtime is what
> multiplies it across the collection. If you drew five static lanes, you'd be
> depicting the wrong thing — five authored lanes is a different (and wrong)
> workflow. The fan being a runtime event is the product's actual semantics
> drawn faithfully: you author one, the run makes many. Second,
> **continuity**: scenes 1–5 and 9 all show the container with its *one* lane.
> If the canvas itself held five lanes, every other scene would have to hide
> four of them, and the container would have to be sized for five permanently —
> wasting the box and breaking the "one lane" read everywhere else. By making
> the fan a `0→1` runtime value, the *same* set piece is one lane at `fan = 0`
> and five at `fan = 1`, with nothing relaid out. The container is one lane in
> scene 5, five in scene 6, and folds back to one in scene 8 — all the same
> geometry.

> *"So where do the five come from, mechanically?"* From `laneTop(lane, fan)`
> in `layout.ts`. Lane 2 (the followed lane) is *always* at `MID_TOP` —
> `laneTop` returns it unmoved regardless of `fan`. The other four interpolate
> from a shared anchor to their targets:
> ```ts
> export const laneTop = (lane, fan) => {
>   if (lane === 2) return MID_TOP;
>   const target = lane === 0 ? A2_TOP : lane === 1 ? A1_TOP : lane === 3 ? B1_TOP : B2_TOP;
>   return GHOST_ANCHOR_TOP + (target - GHOST_ANCHOR_TOP) * fan;
> };
> ```
> At `fan = 0` every ghost sits at `GHOST_ANCHOR_TOP` — the vertical center of
> the followed lane — i.e. *stacked behind the mid lane, invisible because the
> mid lane is drawn over them and they're at opacity-via-`extra` zero*. As
> `fan` ramps to 1 they slide out to `A2/A1` (above) and `B1/B2` (below). The
> fan *is* this interpolation; you never author five positions, you author one
> anchor and four targets and let `fan` mix between them.

## How the container is kept from overflowing — the box is sized for the fan

This is the other half of the discipline, and it's solved in `layout.ts` by
**deriving the container's height from the fan stack**, not by eyeballing a box
and hoping the lanes fit:

```ts
export const GHOST_H = simBlockHeight(0); // 62 — header-only block
export const ANALYST_H = 208;             // measured from a rendered frame
export const LANE_GAP = 24;               // mid lane ↔ first ghost
export const GHOST_GAP = 22;              // ghost ↔ ghost

// ghost · ghost · MID · ghost · ghost — symmetric about the body center
const FAN_STACK = 4 * GHOST_H + 2 * GHOST_GAP + 2 * LANE_GAP + ANALYST_H; // 548

const BODY_PAD = 26;
export const CONT_H = CONT_HEADER_H + BODY_PAD + FAN_STACK + BODY_PAD; // 661
```

The container's height is `header + pad + (the full five-wide stack) + pad`.
The box is *defined by* the thing it has to hold at full fan. There is no frame
where a ghost can poke past the border, because the border was computed from
the ghosts' total extent plus padding.

> *"Why size the box for the fan when the fan is only on for three scenes?"*
> Because the alternative — a box sized for one lane that grows when the fan
> opens — would mean the container *relayouts* mid-video, which is exactly the
> teleport the continuity rules forbid. A container that resizes when its
> contents multiply reads as broken: the border jumps, the outer wires that
> land on its handles shift, the whole chain reflows. Instead the box is its
> final, fan-open size *from scene 1*, holding one centered lane with empty air
> above and below it (air the viewer never reads as wrong — boxes have
> padding). When the fan opens, the lanes simply move into space that was
> always there. `CONT_H` never changes; `CONT_Y` never changes; the outer
> chain's geometry is constant. The fan happens *entirely within a box that
> was already the right size.*

> *"And `ANALYST_H = 208` is a magic number — where's it from?"* It's
> **measured from a rendered frame**, not computed, and the layout comment says
> so: the Analyst block has Messages + Model rows plus a one-line Tools row
> with the Exa and Perplexity chips, and the exact rasterized height of that
> stack is 208px (the arithmetic estimate is ~207; the rasterizer says 208, and
> *the rasterizer wins* — that's the craft rule). The ghosts use
> `simBlockHeight(0) = 62`, the exact height of a header-only block, because
> ghosts show no rows. Every number in `FAN_STACK` is either an exact component
> metric or a measured one; none is decorative.

## The ghost lanes — header-only, because the table carries their results

Each ghost lane is a pair of *header-only* `SimBlock`s — an `Analyst` and an
`Update Board` with no rows, no tools — drawn by `ghostBlock`:

```ts
const ghostBlock = (key, x, top, name, color, glyph, vis, extra, hideSource) => {
  const op = visOpacity(vis) * extra;   // extra = fan, so they fade in WITH the fan
  return op <= 0 ? null : ( ... <SimBlock name={name} ... highlighted={vis?.highlighted} .../> );
};
```

> *"Why header-only ghosts instead of five full lanes?"* Because a full lane
> repeated four more times is visual noise that says nothing the followed lane
> doesn't already say. The viewer learns "an analyst researches and writes
> back" from the *one* full lane (scene 7). The ghosts only need to carry two
> facts: *they exist* (there are five) and *their state* (live now, `ok`
> later). A header-only block with a state ring carries both. Their actual
> *results* don't live on the blocks at all — they land in the **table**, which
> is the whole point of the desk (the table IS the desk). So the ghosts are
> deliberately information-light: their progress is a ring, their output is a
> table row. This is swe-fleet assumption 3, reused.

> *"Why does `extra = fan` gate the ghosts' opacity?"* So they don't just
> *appear* — they fade up *as* they slide out. `visOpacity(vis) * fan` means at
> `fan = 0` they're at zero opacity (and behind the mid lane), and they reach
> full opacity exactly as they reach their resting positions. The emergence and
> the fade are the same ramp, so there's no frame where a ghost is fully opaque
> but still mid-slide, or fully positioned but ghostly. One value drives both.

## The camera — move first, *then* the event

```ts
const cam = camMix(CAM_ALL, CAM_CONT, ramp(t, 0.4, 1.7, EASING.inOut));
const fan = ramp(t, 2.2, 3.6, EASING.inOut);
```

The camera eases from `CAM_ALL` (the whole-desk home framing, `s = 0.78`) to
`CAM_CONT` (the container, `s = 1.05`) over **0.4s → 1.7s**. The fan doesn't
*start* until **2.2s** — half a second after the camera arrives.

```ts
export const CAM_CONT: Cam = {px: CONT_X + CONT_W / 2, py: 975, s: 1.05};
```

`CAM_CONT` centers on the container's horizontal midpoint (`CONT_X + CONT_W/2`)
at `py = 975` (just below the container's vertical center of 990.5, biased a
touch up so the fan, which is symmetric about the body center, sits centered in
frame). `s = 1.05` is barely above neutral — enough to lean in on the container
without losing the chain entirely.

> *"Why finish the camera move before opening the fan — why not do both at
> once?"* This is the *move first, then the event* rule, and it's about not
> asking the viewer to track two things at once. If the camera were still
> traveling when the lanes started separating, the eye couldn't tell motion-of-
> the-world (camera) from motion-of-the-content (fan) apart — the lanes would
> seem to drift partly because they're moving and partly because the frame is.
> By landing the camera at 1.7s and holding half a second of stillness before
> the fan opens at 2.2s, the fan plays against a *settled* frame: now every bit
> of motion you see is the content doing something. The camera's job is to put
> you in front of the container; *then* the container performs. Two ideas, two
> moments — never stacked.

> *"Why `EASING.inOut` on the camera but the fan also `inOut`?"* Both are
> spatial transforms with momentum (a camera glide, lanes traveling), so both
> get the camera/transform curve — `EASING.inOut`, per the project's easing
> convention (`out` for entrances, `inOut` for camera moves and transforms,
> `in` for exits). The fan is a transform of position, not an entrance of a new
> element, so it's `inOut`, not `out`. Consistent curve choice is part of what
> makes the build feel composed.

## The launch — once where it acts once, together where it acts together

This is the heart of the scene. Three things happen, and *each one's timing
encodes a fact about how a parallel works.*

```ts
const pillBlip = pulseWindow(t, 4.2, 4.45, 4.75, 5.05);
const pulses   = ramp(t, 4.4, 5.2, EASING.inOut);
const anaLive  = t >= 5.1;
```

### (a) The Start pill blips ONCE — `pillBlip = pulseWindow(t, 4.2, 4.45, 4.75, 5.05)`

The inner Start pill takes a single blue ring that comes up over 4.2→4.45s and
falls over 4.75→5.05s — one short blip, then gone.

> *"Why does the pill blip exactly once when five lanes launch?"* Because there
> *is* one Start. The parallel has a single entry point; the collection is
> distributed *from* that one pill *to* the five instances. If the pill blipped
> five times, or pulsed per-lane, you'd be implying five separate triggers —
> the opposite of the truth. One blip says "one trigger." The fan-out then
> shows that one trigger reaching five places. The number of blips is a claim
> about the architecture, and the honest claim is *one*.

### (b) Five pulses leave TOGETHER — one shared `pulses` ramp

Every lane gets the *same* `pulseIn` value:

```ts
const lane = (): LaneState => ({ ana: {highlighted: anaLive}, pulseIn: pulses });
...
lanes={{0: lane(), 1: lane(), 2: lane(), 3: lane(), 4: lane()}}
```

The Stage draws a `PathPulse` along each lane's pill-edge using `st?.pulseIn`,
and since all five lanes carry the identical `pulses` ramp, all five pulses
travel their wires in lockstep over 4.4→5.2s.

> *"Why one shared ramp instead of five staggered ones?"* Because the
> staggering is the lie. The whole lesson of a parallel is *simultaneous* —
> instances launch together, not in sequence. The most natural-looking thing to
> animate would be a little stagger (it reads as "lively"), and it would be
> *wrong*: a stagger says "first this one, then that one," which is a loop, not
> a parallel. So the build does the harder, more honest thing — one clock, five
> identical pulses — and lets the *synchrony itself* be the visual. There is a
> note in the source making this explicit: `// One clock for all five — the
> synchrony IS the scene.` That comment is the scene's thesis.

> *"Why do the wires fan with the lanes — won't the pulses curve?"* Yes, and
> that's correct. The pill-edge geometry is `pillEdge(lane, fan)`: it runs from
> the pill's source handle to *that lane's* Analyst target, and the target's
> `y` is `laneHandleY(lane, fan)` — which moves with the fan. So at `fan = 1`
> the five wires splay from one pill out to five vertically-spread targets, and
> the five pulses ride those splayed curves. One source, five destinations,
> drawn as one-to-many — which is exactly what a parallel's distribution looks
> like.

### (c) All five Analysts go live ON THE SAME FRAME — `anaLive = t >= 5.1`

```ts
const anaLive = t >= 5.1;
// ... ana: {highlighted: anaLive}  // on EVERY lane
```

At `t = 5.1s` — just as the pulses arrive — every Analyst's live ring latches
on, all at once. Not lane 0 then lane 1; *all five at frame 306* (5.1s × 60fps).

> *"Why a hard `t >= 5.1` boolean instead of a ramp?"* Because a ring is a
> binary product state — a block is either live or it isn't; the live ring
> doesn't fade in over the product. A boolean latch is the faithful depiction.
> And `>=` (latched, not windowed) means it comes on and *stays* on — these
> lanes are now working and remain working through the cut and into scene 7.
> The synchrony is in the *single threshold*: one number, applied to all five,
> means one frame for all five. If each lane had its own threshold you'd be back
> to a stagger. The lesson — *one clock = parallel* — is encoded as *one
> constant shared by five lanes.*

> *"Why 5.1, landing it right after the pulses (4.4→5.2)?"* Cause then effect.
> The pulse leaving the pill is the cause (the trigger reaching the lane); the
> Analyst lighting up is the effect (the lane starting). 5.1 is just inside the
> pulse window's tail, so the rings land as the pulses arrive — you read "the
> trigger got there, so they started." Lighting them *before* the pulses
> arrived would break the causality; lighting them well *after* would leave a
> dead gap. 5.1 threads it.

## The followed lane resolves its reference — `<parallel.currentItem>` → its market

Only the middle lane (lane 2, the followed one) shows full detail, and in its
Analyst's Messages row the reference resolves:

```ts
const tagGlow    = pulseWindow(t, 5.8, 6.1, 6.8, 7.1);
const tagResolve = ramp(t, 6.3, 6.7);
...
laneTag={{glow: tagGlow, resolve: tagResolve}}
```

The Stage feeds this to a `ResolvedTag` in the followed Analyst's Messages
value: the `<parallel.currentItem>` tag glows blue (5.8→6.1, holds, releases
6.8→7.1), and *during* that glow it dip-swaps from the tag to its value over
6.3→6.7s — landing on `[GPT-6 ships in 2026]` (`CURRENT_ITEM_VALUE` from
`data.ts`), the market this lane prices.

> *"Why resolve the reference here, and only on one lane?"* Because *this* is
> what `<parallel.currentItem>` means and the scene is finally in a position to
> show it: the parallel distributes the collection one item per instance, and
> each instance sees its slice as `currentItem`. The followed lane resolving to
> `[GPT-6 ships in 2026]` says "this instance got *this* market." Showing it on
> one lane (not five) keeps the read clean — you learn the binding once, on the
> lane you can actually see; the four ghosts are header-only and have no
> Messages row to resolve anyway. The synchrony beat (b/c above) taught *all
> five start together*; this beat teaches *each gets its own item*. Two facts
> about a parallel, two separate moments.

> *"Why does the glow fully release before the cut, but the resolved value
> stay?"* Deliberate, and the source comment flags it: `// the glow FULLY
> releases before the cut; only the resolved value carries.` The glow is a
> *transient gesture* — "look here, this is resolving" — and gestures revert.
> The resolved value is *state* — the lane really does hold this market for the
> rest of the run — and state persists. So `tagGlow`'s pulseWindow brings the
> blue back to zero by 7.1s, while `tagResolve` ramps to 1 and *stays* 1 (it's
> a clamped ramp with no reverse). At the freeze-cut the tag reads as a plain
> resolved value with no highlight — exactly the calm state scene 7 inherits and
> leans into. (Scene 7 will revert *this* resolution as the lane finishes, by
> the same logic in reverse: residue of the *fill* is permanent, the
> *resolution* is transient.)

## The hold — 7.1s to the end (freeze-cut carry)

After the tag glow releases at 7.1s, nothing moves. The scene holds for ~7
seconds at `CAM_CONT` with the fan open, five blue rings lit, the container
ring on, and the tag resolved — and that exact state carries through the cut.

> *"Isn't seven seconds of stillness dead air?"* It's a *state-dense* hold, not
> a dead one — five live lanes, a resolved reference, a lit container; there's a
> lot on screen to read, and (per scene 1's logic) a settled latched state is
> what lets the scene stretch to fit narration safely. It's also a freeze-cut:
> the *next* scene opens on this identical frame and starts working the followed
> lane. So the hold isn't waiting — it's the carry. The choreography rates it
> "static but state-dense," which is the right trade for a freeze-cut bridge.

## How to think about the whole scene

Walk it and every choice is answering "how do I draw a parallel *honestly*?":

1. *What does a parallel actually contain?* One lane → the canvas holds one
   lane; the other four are runtime-only ghosts.
2. *How do I show five without lying about the authoring?* Fan the one lane via
   a `0→1` runtime value (`laneTop(lane, fan)`), so the same set piece is one
   lane elsewhere and five here.
3. *How do I keep the box honest?* Size `CONT_H` *from* the full fan stack →
   the container never resizes; the fan plays inside space that was always
   there.
4. *What do the extra lanes need to say?* Only "we exist" and "our state" →
   header-only ghosts with rings; their results land in the table.
5. *How do I let the viewer watch the split, not fight the camera?* Move onto
   the container first, hold, *then* open the fan.
6. *What's the actual lesson?* Simultaneity → one blip, one shared pulse ramp,
   one `t >= 5.1` threshold across all five. The synchrony is encoded as
   *shared constants.*
7. *What does each instance get?* Its own item → resolve `<parallel.currentItem>`
   on the followed lane, glow transient, value permanent.

There's no clever single move; it's the *one-lane discipline* applied through
geometry, then a launch choreographed so that what's simultaneous in the
product is simultaneous on screen.

## Exit state (what scene 7 inherits)

`fan = 1 (full five-wide) · five Analysts live (latched on) · followed lane's
tag resolved to [GPT-6 ships in 2026], glow released · container live ring on ·
pill swap 1 (Next: 4:00 PM) · camera at CAM_CONT`. Scene 7 opens on exactly
this frame — a freeze-cut — and eases the camera in onto the followed lane to
watch that one analyst work, while the four ghosts hold `live` as context for
scene 8's scramble. Because both scenes render the same single set piece with
`fan = 1` exactly, the boundary is pixel-identical by construction.

<!-- ── market-desk / 07-one-analyst.md ── -->

# Scene 7 — `one-analyst`  ·  archetype: **camera lean-in, same run**

Source: `../source/scenes/OneAnalystScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the richest motion scene in the whole video, and it's worth studying
precisely because it never feels busy. It does one thing — *follow a single
analyst from the first tool call to the cell it writes* — and it spends its
twelve seconds making that one causal chain legible. Read it as a worked
example of the build's best single idea: **the camera leaves the detail to go
watch the consequence.**

---

## What this scene is for

Scene 6 fanned the container open: one analyst lane became five, all started at
the same frame, all still running. Scene 7 picks *one* of them — the followed
lane, lane 2 — and shows it finish, end to end. The thesis it has to land is the
one in the script: **the row filling IS the analyst finishing.** Not "the
analyst works, and separately the table updates" — those are the same event,
and the scene's whole job is to draw the line between the lane's last block
(Update Board) and the cell that lights up because it ran.

So the rule is, again, *one idea per scene*: this scene is "watch one lane close
its own loop." It is emphatically **not** "watch all five finish" — that's scene
8, the money shot. Here, four of the five lanes stay frozen in their working
state on purpose, so the viewer's attention has exactly one place to be.

## What it looks like

The camera is already mid-push when the scene opens — it's leaning from the
container framing onto the followed lane. At lane scale, you watch the Analyst
block's two tool chips ring in sequence: the blue Exa chip lights, releases,
then ~2s later the teal Perplexity chip lights and releases. The Analyst's
state ring flips green (ok). A pulse runs down the lane wire into Update Board,
which goes live. And then — this is the move — the camera *pulls back out* to
the full frame, arriving just as row 4 of the board fills in: `0.71`, `0.16`,
`watch`, a green flash that decays to a faint residue, except the signal cell,
which stays fully green. The reference tag in the Analyst reverts. Four ghost
lanes sit highlighted the whole time. Hold.

## The one idea you'll reuse: the three-stop camera

Almost everything else in this scene is grammar you've already seen in earlier
scenes (chip rings, state flips, the row fill). The genuinely new, genuinely
load-bearing decision is the **camera path**, and it's three stops, not two:

```ts
const inMix  = ramp(t, 0.5, 1.8, EASING.inOut);
const outMix = ramp(t, 8.4, 9.8, EASING.inOut);
const cam =
  t < 8.4 ? camMix(CAM_CONT, CAM_LANE, inMix)
          : camMix(CAM_LANE, CAM_ALL, outMix);
```

Read it as a state machine over the clock:

1. **`CAM_CONT → CAM_LANE`** over **0.5s→1.8s**. The scene inherits the
   container framing from scene 6 and pushes in to the lane (`s 1.05 → 1.3`),
   so the tool calls play at lane scale where you can actually read the chips.
2. A **hold at `CAM_LANE`** from 1.8s until 8.4s. `inMix` has clamped to 1 and
   `outMix` is still 0, so the camera sits still for ~6.6 seconds — the entire
   tool-call-and-settle sequence happens here, motionless framing, all the
   motion inside the frame.
3. **`CAM_LANE → CAM_ALL`** over **8.4s→9.8s**. The camera eases back out to
   the home framing (`s 1.3 → 0.78`) — and it gets there *before the row
   fills.*

> *"Why three stops instead of just cutting to the wide shot when the table
> updates?"* Because a cut would sever cause from effect. The whole point of
> the scene is that the lane's work and the table's update are one event seen
> at two scales. If you cut, the viewer experiences two unrelated shots: "a lane
> working" and then "a table updating." By keeping it one continuous camera move
> — push in, watch the work, pull out, watch the write — the cell that lights
> up is unmistakably *the consequence of the lane you were just watching.* The
> camera physically connects the two.

> *"Why does the camera go back to `CAM_ALL` and not stay tight on the lane to
> watch the write?"* Because the write doesn't happen in the lane — it happens
> on the **board**, which is at the top of the frame, out of shot at `CAM_LANE`.
> The Update Board block running is the *cause*; the row filling is the
> *effect*, and the effect is drawn somewhere else on the canvas. So the camera
> has to leave the lane to go see it. That's the line worth internalizing: *the
> camera leaves the detail to go watch the consequence.* The detail (the tools,
> the settle) is done; the payoff is elsewhere; the camera follows the payoff.

### The ease-back timing is the whole trick

The two windows are tuned against each other so the geometry lands:

- The pull-out runs `8.4 → 9.8` (it completes at 9.8s).
- The row fill runs `10.0 → 10.6` (it *starts* at 10.0s).

So the camera finishes arriving at the wide frame at 9.8s, sits for a fifth of
a second, and *then* the cell starts to fill. The full board is in frame, dead
still, exactly when the value lands.

> *"Why the 0.2s gap between the camera arriving (9.8) and the fill starting
> (10.0)?"* So the move and the event don't overlap. If the cell started
> filling at 9.7s, mid-pull-out, two things would be moving at once — the whole
> frame translating *and* a cell changing — and the eye couldn't track either.
> The discipline here is the same one scene 1 used between its row reveal and
> its selection: **let one motion finish and settle before the next begins.**
> The camera lands, the frame goes quiet, *then* the payoff. That beat of
> stillness is what makes the fill feel like an arrival instead of a thing that
> happened while you were busy looking elsewhere.

> *"Why 1.4s for the pull-out (8.4→9.8) when the push-in was only 1.3s
> (0.5→1.8)?"* They're close on purpose — the same EASING.inOut, near-identical
> durations — so the two moves feel like one camera with a consistent hand, not
> two different gestures. The slightly longer pull-out covers a bigger zoom
> delta (1.3→0.78 is more travel than 1.05→1.3), so giving it a touch more time
> keeps the *apparent* speed matched. And both use `EASING.inOut` because these
> are camera moves through space — the project's rule reserves `inOut` for
> exactly this, transforms and camera, where you want a soft start and a soft
> stop.

## The camera stops, in coordinates

All three are transforms of the same fixed layout (`px, py` is the stage point
that ends up centered in the 1920×1080 viewport; `s` is the zoom):

```ts
CAM_CONT = { px: CONT_X + CONT_W/2, py: 975,        s: 1.05 } // the container
CAM_LANE = { px: (ANA_X + UPD_X + BLOCK_W)/2,        // 1808
             py: BODY_CENTER,        s: 1.3  }               // the followed lane
CAM_ALL  = { px: 1200, py: 735,      s: 0.78 }               // the home framing
```

`CAM_LANE`'s `px` is computed, not eyeballed: it's the midpoint of the lane's
horizontal extent, from the Analyst's left edge (`ANA_X`) to the right edge of
Update Board (`UPD_X + BLOCK_W`). That centers the two-block lane in frame
exactly. `py` is `BODY_CENTER`, the vertical center of the container body, which
is where the followed lane lives. Nothing about the lane's position is a magic
number — it all derives from the same `layout.ts` geometry every other scene
reads.

> *"Why `s 1.3` for the lane and not tighter?"* 1.3 frames the two-block lane
> plus a little air — tight enough that the tool chips (small UI, 14px glyphs at
> native scale) are readable, loose enough that you can still see the lane is a
> pair of connected blocks, not one. Push to 1.6 and the chips are huge but you
> lose the "Analyst → Update Board" relationship; pull to 1.1 and the chips are
> too small to register as branded tools. 1.3 is the value that keeps both the
> chip identities and the lane structure legible at once.

## The two tool calls: why two distinct beats beat one blur

```ts
const exaRing  = pulseWindow(t, 2.4, 2.7, 3.5, 3.8);
const pplxRing = pulseWindow(t, 4.4, 4.7, 5.5, 5.8);
```

The Analyst block carries two tool chips — Exa (blue, `#1F40ED`) and Perplexity
(teal, `#20808D`) — and each gets its own ring pulse. `pulseWindow(a0, a1, b0,
b1)` ramps up over `a0→a1`, holds, ramps down over `b0→b1`. So:

- **Exa rings** over 2.4→2.7 (up), holds, 3.5→3.8 (down). That's the *search*.
- **Perplexity rings** over 4.4→4.7 (up), holds, 5.5→5.8 (down). That's the
  *cross-check*.

The ring is drawn by `SimBlock` itself: each tool chip with `ring > 0` gets an
inset box-shadow in `COLORS.secondary` at `opacity = ring` (SimBlock.tsx ~328).
This is the product's own selection treatment on a chip — "the agent reached for
this tool" — not an invented glow.

> *"Why two separate rings ~2s apart instead of one 'the agent is working'
> glow over the whole window?"* Because a single generic glow says *nothing* —
> it's the slop default, a blur that means "something is happening." Two
> distinct, *branded* beats say something specific and true: the analyst searched
> (Exa), then cross-checked (Perplexity). The viewer reads two real tools being
> used in sequence, which is exactly what an agent doing research does. The gap
> between them (Exa down at 3.8, Perplexity up at 4.4 — a clean ~0.6s of
> nothing) is what makes them read as *two* calls rather than one smear. One
> idea, twice, in order, beats one vague idea once.

> *"Why these exact windows — 2.4 and 4.4 for the rises?"* Two constraints.
> First, they start *after* the camera has finished pushing in (the push-in
> ends at 1.8s) — you don't ring a chip the viewer can't read yet. Second,
> they're spaced so each ring is a full, separable gesture: ~0.3s up, ~0.8s
> hold, ~0.3s down is ~1.4s per call, and starting them 2.0s apart leaves clean
> air between. Tighten the spacing to 1s and they'd start to feel like one
> event; widen it to 4s and the lane sits dead between calls. ~2s is the spacing
> that reads as "two deliberate steps."

> *"Why Exa first, then Perplexity, and not the reverse?"* It mirrors how the
> work actually goes: you *search* for primary sources first (Exa), then
> *cross-check* what you found (Perplexity). The order encodes a small truth
> about the method, for free, at no extra animation cost. (And it's grounded —
> both blocks exist in the real Analyst's tool list; the colors are the
> products' own `bgColor` tokens, ported verbatim.)

## The settle and the handoff: cause then effect

After the tools, the analyst finishes and hands off to the write block:

```ts
const anaLive = t < 6.4;
const anaOk   = t >= 6.4;                      // Analyst flips ok at 6.4s
const pulseA  = ramp(t, 6.6, 7.2, EASING.inOut);     // pulse down the lane wire
const edgeAHi = pulseWindow(t, 6.6, 7.0, 8.2, 8.7);  // the lane wire heats
const updLive = t >= 7.1 && t < 9.9;           // Update Board live
const updOk   = t >= 9.9;                       // Update Board ok
```

The chain of causation, in order:

1. **6.4s** — the Analyst's state ring flips from neutral to **green/ok**
   (`anaOk`). The research is done. (The chip rings finished at 5.8s, so there's
   a half-second of "thinking" before it settles — the analyst isn't done the
   instant the last tool returns.)
2. **6.6s** — a `PathPulse` (`pulseA`) travels down the lane edge from the
   Analyst to Update Board, and the edge itself *heats* (`edgeAHi` brightens the
   wire from `pal.wire` toward `pal.secondary` and thickens it from 2.25 to
   3.5px). This is the analyst *handing its result to the write block.*
3. **7.1s** — Update Board goes **live** (`updLive`), its ring lit. It's running
   the upsert.
4. **9.9s** — Update Board flips **ok** (`updOk`). The write has committed.

> *"Why does Update Board stay live for almost three seconds (7.1 → 9.9)?"*
> Because that window is *covered by the camera move.* The pull-out runs 8.4→9.8.
> So Update Board is "running" precisely while the camera is traveling from the
> lane to the wide frame — the write is in flight during the move, and it
> *completes* (`updOk` at 9.9) right as the camera lands (9.8). The block's busy
> state and the camera's travel are deliberately overlapped so that the wide
> frame arrives on a *just-finished* write, primed to show its effect. The
> timing isn't "block runs, then camera moves" — it's "block runs *while*
> camera moves," which is what makes the fill feel immediate when the frame
> settles.

> *"`pulseA` uses `EASING.inOut` but `edgeAHi` is a plain `pulseWindow` — why
> the mix?"* `pulseA` is a thing *traveling* down the wire (a position animating
> from one end to the other), so it gets eased like any spatial move. `edgeAHi`
> is a *brightness* — the wire getting hotter and cooler — which has no spatial
> momentum, so it's left as a linear up/hold/down. Same distinction the template
> draws for scene 1's fade: ease what travels, leave what only changes value.

## The payoff: a value lands because a write block ran

This is the heart of the scene, and the place where the build's honesty rule is
most visible. The row only fills *after* Update Board has run:

```ts
const fill   = ramp(t, 10.0, 10.6);
const tint   = fill * (1 - 0.65 * ramp(t, 11.2, 11.8));
const signal = ramp(t, 10.2, 10.8);
```

fed into the Stage as per-row functions gated to the followed row:

```tsx
fillMix   ={(r) => (r === FOLLOWED_ROW ? fill   : 0)}
fillTint  ={(r) => (r === FOLLOWED_ROW ? tint   : 0)}
signalTint={(r) => (r === FOLLOWED_ROW ? signal : 0)}
```

`FOLLOWED_ROW = 3` — the fourth row, **GPT-6 ships in 2026** (odds `0.55`). Every
on-screen value traces to `data.ts`: this row's `est = 0.71`, `edge = 0.16`,
`signal = watch`. The numbers are grounded and internally consistent — `edge =
agent_est − odds = 0.71 − 0.55 = 0.16` (arithmetic, checked), and `signal =
watch` because `|0.16| ≥ 0.08` (the watch threshold). Nothing is decorative.

### (a) The text dips in — `fill = ramp(t, 10.0, 10.6)`

The three empty cells (`agent_est`, `edge`, `signal`) get their text via a
**DipSwap**, not a fade. The rig's `textOp` computes, for the fillable columns:

```ts
const dipped = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
```

So as `fill` crosses 0→1, the cell's text opacity goes 1 → **0 at mix = 0.5** →
1. At the exact midpoint the text is invisible, and that's where `boardRows`
swaps the empty string for the real value (`filled = mix >= 0.5`). The viewer
never sees the swap happen — the old (empty) state fades out, the value is
substituted at zero opacity, the new value fades in.

> *"Why a dip-swap instead of just fading the value in from nothing?"* Because
> the cell isn't empty-to-full; it's *one value replaced by another* (in this
> scene "" → "0.71", but the same component handles "3:00 PM" → "4:00 PM" on the
> schedule pill). A dip-swap is the honest animation for a *change of value*:
> something blinks out and a new thing blinks in, the way a real cell updates.
> A straight fade-in would imply the cell was always going to hold this value
> and was merely revealing it — but the truth is the run *wrote* it, replacing a
> blank. The dip is the write.

> *"Why is this the right scene for the cell to fill, and not scene 1?"* Because
> in scene 1 no block had run, so the cell was empty *by construction* — a table
> can't show a value the run hasn't produced. Here the value appears *only*
> because Update Board (a write block) just executed. That's the rule that keeps
> the whole video honest: a number never ticks into a cell on its own; it
> appears because something wrote it, and you watched the thing that wrote it.
> Effect has a drawn cause. If you ever animate a cell filling without a block
> causing it, you've broken the one property that makes this an honest depiction
> of the product.

### (b) The green tint pulses, then decays to a residue — `tint = fill · (1 − 0.65·ramp(11.2, 11.8))`

Over the three written cells the rig paints `rgba(51,196,130, 0.22·tint)` — the
table's own output-tint green. `tint` follows `fill` up to full, then the second
factor `(1 − 0.65·ramp(11.2, 11.8))` rides it back down to **0.35** of full over
11.2→11.8s. So the cells flash bright green as they're written, then settle to a
faint green wash that *stays.*

### (c) The signal cell keeps a FULL-strength residue — `signalTint = ramp(10.2, 10.8)`

The signal cell gets a *second*, separate tint (`rgba(51,196,130, 0.3·signal)`),
and crucially `signal` is a plain `ramp` with **no decay term.** It ramps to 1
over 10.2→10.8 and *stays at 1.* So after everything settles, the `agent_est`
and `edge` cells carry a faint 0.35 green, but the `signal` cell stays fully,
permanently green.

> *"Why two different residue strengths — what's the hierarchy saying?"* This is
> the residue hierarchy, and it's the most important read in the scene:
> **permanent color = the signal; decayed color = the history.** The faint green
> on `agent_est` and `edge` is *provenance* — "these cells were written by the
> run," a quiet watermark that this is computed data, not seed data. But it
> decays because the *number* is the point now, not the fact that it's fresh.
> The signal cell is different: its full-strength green *is the flag.* The market
> is mispriced (edge 0.16 ≥ threshold), and that's a standing fact the desk
> wants you to keep seeing. So it never fades.

> *"Why is the flag a color and not the word `watch`?"* The cell *does* contain
> the text `watch` (grounded in `data.ts`), but the thing that makes it read as
> *flagged from across the room* is the burning green, not the word. This is the
> project's "indicate state with visuals, not words" rule applied exactly: the
> viewer doesn't read `watch` and infer importance — they see one cell still
> glowing among rows that have gone quiet, and *that* is the signal. The word is
> the label; the color is the alarm. In scene 8, when a second row flags, you'll
> recognize it instantly because you learned the grammar here: a burning cell =
> a mispriced market.

> *"Why does the signal tint start at 10.2, slightly after the fill at 10.0?"*
> So the flag lands *after* the number it's a verdict on. The estimate dips in
> (10.0), and a beat later the flag lights (10.2) — cause (the edge is big)
> before effect (so it's flagged). Even at this tiny scale, the build keeps
> things in causal order.

## The reference reverts — resolution is transient, residue is permanent

```ts
const tagResolve = 1 - ramp(t, 10.6, 11.1);
// → laneTag={{glow: 0, resolve: tagResolve}}
```

Back in scene 6, the followed lane's Messages row resolved its
`<parallel.currentItem>` reference to the literal `[GPT-6 ships in 2026]` — the
parallel handing this specific market to this specific lane. That resolution has
held through scene 6's tail and most of scene 7. Now, as the lane finishes its
work, `tagResolve` ramps from 1 back to 0 over 10.6→11.1s — the resolved value
reverts to the bare `<parallel.currentItem>` reference.

The rig switches components on the threshold: while `tagResolve > 0` it renders a
`ResolvedTag` (showing the resolved value); at 0 it falls back to a plain `Tag`
(showing just the reference token).

> *"Why revert the resolution? Wouldn't it be cleaner to leave it resolved?"*
> No — and this is a deliberate counterpoint to the row fill. The resolution was
> a *runtime artifact*: "for this iteration, currentItem = GPT-6." Once the lane
> has finished and written its result, that binding is spent. Reverting it to the
> abstract reference says the lane is *back to being a template* — ready to be
> handed the next market on the next run. **Resolution is transient; residue is
> permanent.** The row fill *stays* (it's the output that matters); the
> currentItem binding *reverts* (it was just plumbing for one iteration). The
> two opposite behaviors, side by side, teach which things are durable results
> and which are momentary wiring.

> *"Why 10.6 → 11.1, right in the middle of the fill?"* So the revert reads as
> *part of the same finishing gesture* as the write. The row fills (10.0–10.6),
> and as it completes the tag lets go (10.6–11.1) — the lane wrapping up all its
> business in one continuous ~1-second beat: result committed, binding released.

## The four ghost lanes hold their working state

```ts
const ghostLane = (): LaneState => ({ana: {highlighted: true}});
const ghosts = { 0: ghostLane(), 1: ghostLane(), 3: ghostLane(), 4: ghostLane() };
```

Lanes 0, 1, 3, 4 (every lane except the followed lane 2) are rendered as
`highlighted` — their Analyst blocks carry the live ring — for the *entire*
scene, with no state change. They never settle, never fill a row.

> *"Why keep four lanes lit and doing nothing for twelve seconds?"* They're not
> doing nothing — they're *still running*, and that's the context the next scene
> needs. This scene followed one analyst to completion; the four held-live lanes
> are a standing reminder that *the other four markets are still being priced.*
> That unresolved state is the open question that carries scene 7's long hold
> ("four still running — what happens to them?") and sets up scene 8, where they
> finish in scramble order. If you settled them here, you'd have nothing left to
> show. So they hold, deliberately, as live scaffolding for the payoff to come.

> *"Why `fan={1}` — why render the full fan at all when we're zoomed onto one
> lane?"* Continuity. Scene 6 ended with the fan fully open (`fan = 1`), and
> scene 8 opens with it still open. If scene 7 collapsed the fan or didn't
> render it, the boundary frames wouldn't match and you'd get a jump. The fan
> stays at 1 the whole scene; the camera just frames one lane of it. Same single
> set piece, same geometry, only the camera and a few state props differ — the
> property that makes every boundary in this video identical by construction.

## How to think about the whole scene

Walk the decisions and you can see a single question driving the structure —
*how do I show that the lane finishing and the cell filling are one event?* —
answered by a chain of small choices:

1. *Where does the work happen?* In the lane → push the camera in to lane scale
   (`CAM_CONT → CAM_LANE`) so the tools are readable.
2. *How do I show research, not a generic "busy"?* Two branded chip rings, Exa
   then Perplexity, ~2s apart → two real tools, in method order.
3. *How does the analyst hand off?* Settle ok (6.4), pulse down the lane wire
   into Update Board (6.6), block goes live (7.1) → cause flows to the writer.
4. *Where does the result appear?* On the **board**, not the lane → the camera
   has to leave (`CAM_LANE → CAM_ALL`) to go watch the consequence.
5. *How do I tie the move to the event?* Time the pull-out (8.4→9.8) to finish
   *just before* the fill (10.0) → the frame settles, then the cell lands.
6. *Why does the cell hold a value at all?* Because Update Board ran → effect
   has a drawn cause; a table never fills itself.
7. *What stays, what goes?* The row fill stays (residue); the est/edge tint
   decays to provenance; the signal cell stays fully lit (the flag); the
   currentItem binding reverts (transient plumbing) → a residue hierarchy that
   teaches which things are durable.

There's no single clever effect here — there's one camera idea (leave the detail
to watch the consequence) executed with the timing tuned so the move and the
payoff never collide, surrounded by grammar you've already learned, all of it in
causal order. That's the quality: restraint plus one good idea, timed exactly.

## Exit state (what scene 8 inherits)

`fan = 1 · followed lane (2) settled ok · row 4 filled — 0.71 / 0.16 / watch ·
est+edge tint at 0.35 residue, signal cell at full green · currentItem reverted
to the bare reference · Update Board ok · the four ghost lanes still highlighted
(working) · container live · camera at CAM_ALL.` Scene 8 opens on exactly this
frame — full-frame `CAM_ALL`, one row priced, four lanes still live — and starts
finishing those four in scramble order. Because both scenes render the same set
piece with the camera already at `CAM_ALL`, the cut is identical to the pixel.

<!-- ── market-desk / 08-the-signals.md ── -->

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

<!-- ── market-desk / 09-the-desk-at-rest.md ── -->

# Scene 9 — `the-desk-at-rest`  ·  archetype: **settle / bookend**

Source: `../source/scenes/DeskAtRestScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the final scene of the video, and it does almost nothing — on
purpose. It is the bookend: the camera releases a few percent and the
whole desk, now fully priced, just rests. Read it as a worked example of
the *settle* archetype — the scene whose entire job is to stop, hold the
payoff, and complete the arc the opening scene started. Every choice
below is one you'll make again when you write your own closing frame.

---

## What this scene is for

The video opened (scene 1) on the **empty board** — a watchlist with
three blank columns and a planted question: who fills those in? Eight
scenes answered it. This scene closes the loop: the same board, every
column now written, two markets flagged, the chain green, the clock still
armed for the next hour. The bookend's job is to **return to the calm
wide frame and let the answer land** — to say "that's the desk; an hour
from now it does it again" with a held picture rather than any new motion.

So the rule the scene follows is *one idea per scene*, taken to its
limit: this scene is "the desk at rest," full stop. No run, no fan, no
new gesture — everything was already shown. The only thing that *happens*
is the camera easing back a touch, and that's not an event so much as a
release. Resist the urge to add a final flourish here. The flourish was
scene 8 (the money shot); scene 9's discipline is to add nothing and
trust the settled frame.

## What it looks like

The whole set piece, wide: the `markets` table on top with all five rows
priced (`agent_est`, `edge`, `signal` filled), a faint green residue on
every written cell, and two of the `signal` cells — rows 0 and 3 —
burning brighter than the rest. Below, the chain Schedule → Polymarket →
Desk, all three with the green "ok" ring; the container folded back to a
single lane; the armed pill above Schedule reading `Every hour · Next:
Jun 12, 4:00 PM`. The camera eases back ~6%, then holds, dead still, for
the length of the narration.

## The one real decision: render the settled end-state, and hold it

The scene renders this and nothing else:

```tsx
const cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

<Stage
  cam={cam}
  fan={0}
  sched={{state: "ok"}}
  poly={{state: "ok"}}
  cont={{state: "ok"}}
  pill={{reveal: 1, swap: 1}}
  fillMix={() => 1}
  fillTint={() => 0.35}
  signalTint={(r) => (r === 0 || r === FOLLOWED_ROW ? 1 : 0)}
  lanes={{2: {}}}
/>
```

Two things to take from this.

**Every value is a fixed end-state — a "latched final," not an
animation.** Look at what's passed: `fillMix={() => 1}` (a constant
function, every row fully filled), `fillTint={() => 0.35}` (a constant —
the provenance residue, the same on every written cell), `signalTint`
that returns `1` or `0` per row with no `t` in it at all, `state: "ok"`
on all three chain pieces. None of these is a function of the clock.
Nothing oscillates, nothing pulses, nothing is mid-flight. The frame at
`t = 3s` is identical to the frame at `t = 13s`. That property has a name
in this build — *latched-settle* — and it is the whole reason this scene
exists in the shape it does (see "Why latched finals" below).

**It's still the one set piece.** Same `<Stage/>` as every other scene,
same geometry from `layout.ts`. `fan={0}` collapses the container back to
its single canvas lane — the four runtime ghosts folded away at the end
of scene 8 and stay gone — and `lanes={{2: {}}}` mounts that one lane in
its default (settled, no rings, no tag glow) state. You are never
building a "final frame" as a special artifact; you're configuring the
same stage into its rest pose.

> *"Why a constant function `() => 1` instead of just a number?"* Because
> the `Stage` prop is typed as `(row: number) => number` — `fillMix`,
> `fillTint`, and `signalTint` are *per-row* functions everywhere else in
> the video (in scene 7 and 8 they ramp each row on its own clock). Here
> the per-row variation is gone, so the function ignores its argument and
> returns the same value for all five rows. Keeping the function shape
> (rather than special-casing the prop to accept a scalar) means the
> settled scene reads the rig through the exact same door as the animated
> ones — no branch, no second code path, no chance of the final frame
> drifting from what scene 8 latched.

## The camera — the only thing that moves

```ts
cam = camMix(CAM_ALL, CAM_OUT, ramp(t, 0.8, 2.4, EASING.inOut));

CAM_ALL = { px: 1200, py: 735, s: 0.78  };  // the home framing
CAM_OUT = { px: 1200, py: 735, s: 0.735 };  // the ease-back target
```

The camera interpolates from `CAM_ALL` to `CAM_OUT` over **0.8s → 2.4s**,
eased `inOut`, then sits at `CAM_OUT` forever. Note `px` and `py` are
identical in both framings (1200, 735) — the camera doesn't *pan*, it
only changes `s`, from `0.78` to `0.735`. That's a scale ratio of
`0.735 / 0.78 ≈ 0.942` — the content shrinks to ~94% of its home size, a
**~6% pull-back**.

> *"Why 6% — why not a bigger, more obvious pull-back?"* Because this is a
> *release*, not a move. The video's real camera moves (scene 2's
> table-glide, scene 6's lean onto the container, scene 7's three-stop
> lane move) all change framing meaningfully to take you somewhere. This
> one goes nowhere — it just exhales. Six percent is below the threshold
> where the eye reads "the camera is traveling" and above the threshold
> where it reads as nothing at all. You feel the frame *settle back* the
> way a held breath releases, without it announcing itself as a shot.
> Make it 15% and it becomes a deliberate dolly-out that begs for a
> reason; make it 1% and it's invisible jitter. 6% is the "we're done"
> gesture.

> *"Why ease back at all instead of just holding `CAM_ALL`?"* Because a
> hard arrival into a static hold reads as a *cut to a freeze* — the
> motion stops on a dime and the scene feels like it stalled. The gentle
> ease-back signals **closure**: it's the visual equivalent of a sentence
> trailing into a period rather than stopping mid-word. A bookend should
> feel like the camera is *letting go* of the desk, stepping back to take
> it all in one last time. The ease-out is that letting-go, made literal.

> *"Why `EASING.inOut` and not `out`?"* Because the move both starts and
> ends from rest. `EASING.out` (fast start, slow finish) is for entrances
> — something arriving from offscreen. This camera is already at rest at
> `t=0` (it inherits scene 8's `CAM_ALL`) and comes to rest again at
> `CAM_OUT`; `inOut` (slow-fast-slow) eases out of the first rest and into
> the second, so there's no velocity discontinuity at either end. It's
> the same curve every camera *move* in the video uses — the convention
> for "a transform settling between two framings."

> *"Why start at 0.8s instead of 0.0?"* So the cut from scene 8 lands on a
> still frame before the camera releases. Scene 8 ends on its own settled
> hold (the chain just went green); if scene 9 started easing back on
> frame 0, the two scenes' boundary would have the camera already in
> motion, and the freeze-to-release would blur. Holding ~0.8s of `CAM_ALL`
> first means the boundary is identical (exit == enter, both at
> `CAM_ALL`), *then* the release begins — a clean beat of stillness, then
> the exhale.

## The values, and why two flags stay bright while everything else decayed

Everything on the board traces to `data.ts`. Here is the full, settled
board — every cell now written:

| market | odds | agent_est | edge | signal |
|---|---|---|---|---|
| Fed cut by June | 0.32 | 0.45 | 0.13 | **watch** |
| ETH $5k in 2026 | 0.41 | 0.38 | -0.03 | — |
| Avatar 3 tops $2B | 0.12 | 0.11 | -0.01 | — |
| GPT-6 ships in 2026 | 0.55 | 0.71 | 0.16 | **watch** |
| La Niña by winter | 0.64 | 0.60 | -0.04 | — |

The numbers are not invented for this frame — they're the same authored
values the run produced over scenes 5–8, now all present because
`fillMix` is 1 everywhere. `edge = agent_est − odds` (arithmetic, e.g.
`0.45 − 0.32 = 0.13`), and `signal` is `watch` exactly when
`|edge| ≥ 0.08` (rows 0 and 3, edges `0.13` and `0.16`); the other three
fall short and read `—`. This is the honesty line made visible: the desk
flags *watch*, never *buy*.

Now the tint hierarchy, which is the scene's one piece of real visual
argument:

```tsx
fillTint={() => 0.35}                                       // every written cell
signalTint={(r) => (r === 0 || r === FOLLOWED_ROW ? 1 : 0)} // FOLLOWED_ROW = 3
```

Every written cell carries a faint green residue at `0.35` — in the rig
this becomes `rgba(51,196,130, 0.22 * 0.35)`, roughly an 8% green wash
across the `agent_est`/`edge`/`signal` block. But the `signal` cells of
rows 0 and 3 get an *additional* `signalTint` of `1.0` — full strength,
`rgba(51,196,130, 0.3 * 1)` — so those two cells glow markedly brighter
than the residue around them.

> *"Why does the residue stay at all, instead of fading to nothing?"*
> Because the green tint is *provenance*: it's the mark that says "the
> desk wrote this." When a cell fills during the run (scenes 7–8), the
> tint pulses to full and then decays — but it decays to `0.35`, not to
> `0`, and that floor persists to the final frame. A board with zero tint
> would look like a board someone typed by hand; the `0.35` residue keeps
> the whole filled region quietly readable as *output*. It's the
> difference between "here are some numbers" and "here is what the desk
> produced."

> *"Why do the two `watch` cells keep full color while everything else is
> residue?"* Because the residue is *history* and the signal is the
> *lasting takeaway*. Everything the desk computed is true and worth a
> faint mark — but the only thing a person scanning this board needs to
> act on is *which markets are mispriced*. By holding those two cells at
> `1.0` while the rest sits at `0.35`, the frame builds a hierarchy with
> no words: the bright cells are the answer, the dim wash is the work.
> This is also why the flag reads as **color, not a word** — you don't
> parse "watch", you *see* two cells lit. (The text says `watch` too, but
> the eye gets the message from the glow first.) Letting the signal decay
> to the same residue as everything else would flatten the board into an
> undifferentiated grid and throw away the whole point of the video.

> *"Why `r === 0 || r === FOLLOWED_ROW` instead of listing both row
> numbers?"* `FOLLOWED_ROW` is `3` — it's the row the on-canvas lane
> priced in scene 7, named once in `data.ts` so the lane geometry and the
> signal logic can't drift apart. Writing `r === 3` here would work but
> would be a second, silent copy of that fact; reading it from the
> constant means if the followed market ever changes, this scene follows
> automatically. Row 0 (the Fed market) is the *other* flag, the one
> scene 8 lit during the scramble — it's a literal `0` because it isn't
> tied to the followed-lane concept, just to "the board's other mispriced
> row."

## The pill and the chain — armed, green, latched

```tsx
sched={{state: "ok"}}  poly={{state: "ok"}}  cont={{state: "ok"}}
pill={{reveal: 1, swap: 1}}
```

All three chain blocks carry the green `ok` ring (in the rig,
`state: "ok"` → a `#22c55e` inset ring). The pill is fully revealed
(`reveal: 1`) and fully swapped (`swap: 1`) — `swap: 1` drives the
`DipSwap` in `SchedulePill` all the way to its `b` value, so the caption
reads `Next: Jun 12, 4:00 PM` (`NEXT_AFTER`), not the `3:00 PM`
(`NEXT_BEFORE`) it showed before the run fired in scene 5.

> *"Why does the pill still say 4:00 PM and not advance again?"* Because
> the desk fired *once* in this video (the single scheduled run, scenes
> 5–8). That run fired at 3:00 and re-armed for 4:00 (scene 5's dip-swap).
> The video ends before 4:00 arrives, so the armed-for-next-hour state is
> exactly the truth: the clock is loaded, waiting. That's the bookend's
> closing line — *an hour from now it does this again* — stated as a UI
> fact, not a caption. Advancing the pill to 5:00 here would imply a
> second run the viewer never saw; leaving it at 4:00 keeps the frame
> honest about what happened.

> *"Why are all three rings green and not the blue 'live' rings from the
> run?"* Blue (the `secondary` ring) means *running now*; green (`ok`)
> means *finished clean*. The run is over — every block did its job and
> settled. Green across the whole chain is the "all systems nominal, work
> complete" read. It's the same causal-order green settle scene 8 ended
> on (Schedule → Polymarket → Desk), now simply held.

## Why latched finals — the scene's structural reason for existing

This is the deepest thing to learn from a settle scene, so it gets its
own section. *Latched finals* means: every state in the scene is a fixed
end-value with no time dependence — no `t` inside `fillMix`, `fillTint`,
`signalTint`, or any `state`. The only `t` in the entire scene is in the
camera's `ramp(t, 0.8, 2.4)`, which itself clamps to a constant after
2.4s. So from 2.4s onward, the scene is a genuinely static image.

Why does that matter? **Because narration is written and recorded *after*
the visuals lock, and the scene has to stretch to fit it.** When the
voiceover for this beat comes in, it might run 4 seconds or 11; the scene
has to be able to hold for however long the words take. A scene whose
final state is *static* can be extended to any length safely — you're
just holding a still frame longer, and nothing is mid-animation to freeze
awkwardly. If instead this scene ended on something still moving (a pulse
looping, a tint oscillating), you couldn't extend it without catching
that motion at a random phase. Latched finals make the audio step
downstream *painless*: every boundary in this build stayed pixel-identical
through the vo-sync precisely because every hold is extend-only by
construction.

> *"Is this the same as scene 1's 'ends on a settled hold' rule?"* Yes —
> it's the same property, and it's not a coincidence that the *first* and
> *last* scenes both have it. Both are the scenes most likely to get
> stretched to fit narration (the open invites the viewer in; the close
> lets the thesis land), and both earn the right to be static because the
> frame itself is the payload. The rule generalizes: any scene that ends
> on a hold should end on a *latched* hold, so the hold is a value, not a
> paused motion.

## The honest weakness of a bookend — name it

A bookend has a real, frank tension, and you should understand it rather
than pretend it away: **a long static hold risks being dead air.** This
scene holds dead still from ~2.4s to ~13.7s — over eleven seconds of an
unchanging frame. That is, by any honest accounting, a long time to show
a picture that isn't moving. The choreography notes say so plainly: this
hold (and scene 1's ~7.4s open) are "the two long dead holds," the
remaining gap an ambient pattern would close.

So why does the scene carry it? Two reasons, and it's worth being precise
about both:

1. **The frame is the payoff.** This isn't a transition holding for a
   beat — it's the *resolved thesis* of the whole video. The empty board
   from scene 1 is now full; the question is answered; the two flags burn.
   A viewer's eye genuinely wants a moment to read the completed board
   (five priced rows is real information), and the narration plays over
   exactly this hold to deliver the closing line. The stillness is the
   space for the idea to land. That's different in kind from a hold with
   nothing to look at.

2. **The video earned its ranking on the *middle*, not on this hold.**
   This build was judged best of its batch for being *visually diverse
   and dynamic* — the run seen at three different scales (the pull, the
   fan, one lane, the scramble), each a different beat shape. A bookend
   doesn't need to be dynamic; it needs to be *calm*, because calm is the
   correct register for "we're done." The diversity already happened. The
   bookend's contribution is the opposite: a place to rest after it.

That said — don't launder the weakness into a virtue. It *is* a long
hold, and the honest improvement (named in the notes) is a low-amplitude
ambient pattern that keeps the frame alive without breaking the
latched-final property — something that animates but always returns to
the same end-state, so the hold stays extend-safe. The taste lesson is:
ship the calm bookend, but know that "calm" and "dead" sit a hair apart,
and the line between them is whether the frame is worth eleven seconds of
looking. Here it is — barely, and only because it's the payoff. On a
weaker frame it wouldn't be.

## How to think about the whole scene

Walk the decisions in order and you can see the bookend's logic:

1. *What state do I show?* The exact settled end-state scene 8 latched —
   read through the same `<Stage/>`, every value a fixed final.
2. *What's allowed to move?* Only the camera, and only as a *release* —
   a ~6% ease-back that says "done," not a move that goes somewhere.
3. *How do I keep the answer legible?* Residue everywhere (provenance),
   full color on the two flags (the takeaway) — hierarchy with no words.
4. *How do I close the arc?* Return to the wide home frame the video
   lives in, the same board from scene 1 now filled — the empty question
   answered in place.
5. *How do I survive narration?* Latched finals → a static hold that
   stretches to any length without freezing a motion mid-flight.
6. *What's the honest cost?* A long dead hold — carried by the fact that
   the frame is the payoff, not by any motion.

There's no clever move in this scene, and there shouldn't be. The craft
of a bookend is *subtraction*: showing the resolved state and trusting it,
adding only the gentlest release so the ending feels like a release. The
quality is in the restraint and in the continuity — that the last frame
is provably the same set piece as the first.

## Exit state (this is the final frame of the video)

`every row priced (fillMix=1) · green residue everywhere (fillTint=0.35) ·
two watch flags burning (signalTint=1 on rows 0 and 3) · chain green
(Schedule/Polymarket/Desk ok) · container folded to one lane (fan=0) ·
pill armed at Jun 12, 4:00 PM · camera at CAM_OUT (s 0.735, ~6% back)`.

Nothing inherits this — it's where the video ends. But it is, by
construction, the answer to scene 1's frame: the same `markets` table,
the same wide home camera, now with the three empty columns filled and
the desk that filled them resting beneath. The arc is closed because the
last frame and the first are the same object, seen at the two ends of one
hour's work.

<!-- ── market-desk / CHOREOGRAPHY.md ── -->

# market-desk — choreography notes

verdict: hype-3 ranking **#1 — BEST**. The director's distilled
criterion ("visually diverse, dynamic, clean, and some visual harmony")
names this build: it has the most concurrent DIFFERENT surfaces alive
(board + chain + container fan + signal flags), and the beat shapes vary
across the run's three scales (pull / fan / lane / scramble) instead of
repeating one shape.
branch: `hype3/market-desk` · comp: `market-desk-v1`
duration: 120.4s after vo-sync (authored visual minimum 81s)
run economy: **1 run** — a single scheduled traversal spanning scenes
5→8 through three freeze-cuts. Scenes 1–4 runless (board, assembly,
wiring, arming); scene 9 holds the settled run. Choreography ported
beat-for-beat from swe-fleet (the same-shaped exemplar) onto this rig.
source: `src/videos/market-desk/` — `<Stage/>` in `scenes/_rig.tsx`,
geometry in `layout.ts`, all content in `data.ts`.

## The one idea

A prediction-market research desk is three Sim primitives composed: a
table holds the watchlist (market + odds pre-seeded; agent_est / edge /
signal EMPTY), a Schedule fires hourly, Polymarket pulls the markets,
and a Parallel container turns one analyst lane (Agent with Exa +
Perplexity tool chips → Table `Upsert Row`) into five concurrent
analysts. The table IS the desk: estimates fill row by row and the
mispriced markets flag themselves (`watch` residue). Honesty line: no
trade, no P&L — `edge` is arithmetic, `signal` is a watch flag.
Cameras: CAM_TABLE (s 1.1) → CAM_ALL (s 0.78) → CAM_CONT (s 1.05) →
CAM_LANE (s 1.3) → CAM_OUT (s 0.735).

## Scene 1: the-board (0–14s, authored 8s)

INTENT: the watchlist is a real Sim table — five live markets, the
crowd's odds, three empty columns waiting.
CAMERA: static CAM_TABLE, table hero-framed.
CHOREOGRAPHY:
- Chrome + headers fade `ramp(t, 0.2, 0.9)`.
- Five rows stagger in at **0.35s**: `rowTextReveal(r) = ramp(1.1 +
  r*0.35, 1.7 + r*0.35)` — market + odds text only (est/edge/signal are
  empty strings until `fillMix ≥ 0.5`, which never happens here).
- Row 1 takes the product range selection: `pulseWindow(4.6, 5.0, 6.2,
  6.6)` on every cell of row 0 — "each row is one market," shown.
HOLDS: 6.6 → 14 (~7.4s) on the assembled board. Pattern: latched-settle
(this build, like outbound, has zero periodic motion — extend-only VO
retiming is boundary-safe by construction). Dead-ish but the frame is
the thesis object.

## Scene 2: the-desk-takes-shape (14–30.2s, authored 12s)

INTENT: the desk is one workflow — a clock, a market pull, and a
container holding a single analyst lane.
CAMERA: `camMix(CAM_TABLE, CAM_ALL, ramp(0.3, 2.4, inOut))` — the table
glides to the top of frame as a camera move only.
CHOREOGRAPHY (assembly in flow order, slower cadence than outbound —
each element gets a beat the narration can name):
- Schedule `ramp(2.0, 2.6, out)` → edge1 `ramp(3.0, 3.6)` → Polymarket
  `ramp(4.0, 4.6, out)` → edge2 `ramp(5.2, 5.8)` → Desk container
  `ramp(6.2, 7.0, out)` → inner pill wire `ramp(7.8, 8.4)` → Analyst
  `ramp(8.4, 9.0, out)` → lane edge `ramp(9.8, 10.3)` → Update Board
  `ramp(10.3, 10.9, out)`. ~1–1.4s gaps between elements (vs outbound's
  0.6–0.8) — the assembly nearly fills the narrated window, which is
  why this scene doesn't die in its hold.
HOLDS: 10.9 → 16.2 (~5.3s) on the idle desk. Latched-settle.

## Scene 3: wired-by-reference (30.2–40.8s, authored 7s)

INTENT: one reference (`Parallel Items | <polymarket.markets>`) wires
the pull to the desk.
CAMERA: static CAM_ALL; hierarchy via dim.
CHOREOGRAPHY (zoom-aside):
- Selective dim — table, Schedule, Polymarket, outer edges all dim to
  0.35 on ONE window `dimW = pulseWindow(0.4, 0.9, 5.8, 6.3)`; the
  container + lane stay lit (the focal object is exempt, not
  re-highlighted). Editing ring boolean `t ∈ [0.5, 6.0)`.
- Card: `cardIn = pulseWindow(0.8, 1.4, 5.2, 5.8)`, slide
  `1 − ramp(0.8, 1.4)` (80px from the right); `<polymarket.markets>`
  glow `pulseWindow(2.2, 2.8, 4.4, 5.0)`. Everything reverts by 6.3.
HOLDS: 6.3 → 10.6 (~4.3s). Latched-settle; short.

## Scene 4: armed (40.8–47s, authored 5s)

INTENT: deploy once and the desk runs every hour, attended or not.
CAMERA: static CAM_ALL.
CHOREOGRAPHY (morph at state level — the shortest scene, one gesture):
- Blue editing ring on Schedule, window `t ∈ [0.6, 2.6)` (deploying is
  an act you perform ON the workflow).
- The pill rises above the block: `pillReveal = ramp(1.5, 2.1, out)`
  (opacity + 14px rise): green dot + `Every hour · Next: Jun 12,
  3:00 PM`. Ring releases at 2.6; the pill STAYS — the armed state is
  the scene's residue and persists to the final frame.
HOLDS: 2.6 → 6.2 (~3.6s). Latched-settle; at the cap, fine.

## Scene 5: the-pull (47–58.3s, authored 9s)

INTENT: on the hour the clock fires ON ITS OWN, the real block pulls
the five markets, and the whole batch heads into the desk.
CAMERA: static CAM_ALL.
CHOREOGRAPHY:
- The self-fire: Schedule ring window `[1.0, 2.5)` with NO incoming
  pulse — nothing arrives from anywhere; that's the point. In sync the
  pill's Next DIP-SWAPS 3:00 PM → 4:00 PM (`pillSwap = ramp(1.3, 1.8)`
  through `DipSwap`) — fired and instantly re-armed, two surfaces one
  event.
- `pulse1 = ramp(2.2, 2.9, inOut)`, edge1 heat `pulseWindow(2.2, 2.6,
  4.0, 4.5)`; Polymarket live `[2.8, 5.5)` then ok `[5.5, 7.2)`.
- The pull confirms the board — chain-to-table sync: a product
  selection range sweeps the five market+odds rows (ONLY the pre-seeded
  columns: `c <= ODDS_COL`) with a **0.14s** row stagger,
  `rangeHi(r) = min(ramp(3.1 + r*0.14, 3.6 + r*0.14), 1 − ramp(5.5,
  6.1))` — lit while Polymarket is live, released as one.
- The range releases AS `pulse2 = ramp(5.6, 6.3, inOut)` crosses into
  the container (edge2 heat `pulseWindow(5.6, 6.0, 7.3, 7.8)`);
  container live ring latches `t >= 6.2` and HOLDS through the cut
  (freeze-cut carry).
HOLDS: 7.8 → 11.3 (~3.5s) inside the held live moment (container ring
ON, pill at 4:00 PM). Latched-settle; charged, short.

## Scene 6: the-fan (58.3–72.7s, authored 8s)

INTENT: the parallel splits the batch — one analyst per market, all
starting at once.
CAMERA: `camMix(CAM_ALL, CAM_CONT, ramp(0.4, 1.7, inOut))` — lean onto
the container BEFORE the fan opens (move first, then the event).
CHOREOGRAPHY:
- The runtime fan: `fan = ramp(2.2, 3.6, inOut)` — four header-only
  ghost pairs (Analyst → Update Board) separate symmetrically from
  behind the followed lane; pill wires fan with them
  (`pillEdge(lane, fan)`).
- Pill blips once `pulseWindow(4.2, 4.45, 4.75, 5.05)`; five pulses
  leave TOGETHER — every lane gets the same `pulseIn = ramp(4.4, 5.2,
  inOut)`; all five Analysts go live at the same frame (`t >= 5.1`,
  latched). One clock for all five — the synchrony IS the scene.
- The followed lane's `<parallel.currentItem>` resolves to
  `[GPT-6 ships in 2026]`: glow `pulseWindow(5.8, 6.1, 6.8, 7.1)`,
  resolve `ramp(6.3, 6.7)` — and unlike outbound, the glow FULLY
  releases before the cut; only the resolved value carries.
HOLDS: 7.1 → 14.4 (~7.3s) at CAM_CONT — fan open, five blue rings,
container ring, resolved tag. Latched-settle; static but state-dense.

## Scene 7: one-analyst (72.7–91.7s, authored 12s)

INTENT: one analyst end-to-end — real tools, an estimate, the
arithmetic edge, and a flag. The row filling IS the analyst finishing.
CAMERA: a THREE-stop move, the build's best camera idea:
`CAM_CONT → CAM_LANE` over `ramp(0.5, 1.8, inOut)` (the tool calls play
at lane framing, s 1.3), then `CAM_LANE → CAM_ALL` over `ramp(8.4, 9.8,
inOut)` — the ease-back is timed so the FULL frame arrives just before
the row fill lands at 10.0. The camera leaves the detail to go watch
the consequence.
CHOREOGRAPHY:
- Tool calls as chip rings on the Analyst (module-5 grammar): Exa ring
  `pulseWindow(2.4, 2.7, 3.5, 3.8)` (search), then Perplexity ring
  `pulseWindow(4.4, 4.7, 5.5, 5.8)` (cross-check) — two distinct
  branded beats, ~2s apart, instead of one generic "working" glow.
- Analyst flips live→ok at 6.4; `pulseA = ramp(6.6, 7.2, inOut)` with
  edge heat `pulseWindow(6.6, 7.0, 8.2, 8.7)`; Update Board live
  `[7.1, 9.9)` then ok.
- The loop closes ON THE BOARD (after the camera is out): row 4
  (`FOLLOWED_ROW = 3`) fills `ramp(10.0, 10.6)` — agent_est `0.71`,
  edge `0.16`, signal `watch` dip in (text at mix ≥ 0.5 with the
  `|mix−0.5|·4` dip); green tint pulses full then decays to the 0.35
  residue (`tint = fill · (1 − 0.65·ramp(11.2, 11.8))`); the SIGNAL
  cell keeps a full-strength residue (`signalTint = ramp(10.2, 10.8)`,
  never decayed) — the flag reads as color, not a word.
- The reference reverts AS the lane finishes: `tagResolve = 1 −
  ramp(10.6, 11.1)` — resolution is transient, residue is permanent.
- The four ghost Analysts hold `highlighted` the whole scene (still
  working — context for the scramble).
HOLDS: 11.8 → 19 (~7.2s) on the full frame: one row priced + flagged,
four lanes still live. Latched-settle; the open question ("four still
running") keeps it readable.

## Scene 8: the-signals (91.7–106.7s, authored 10s) — THE MONEY SHOT

INTENT: estimates land row after row in whatever order the analysts
finish; the mispriced markets flag themselves.
CAMERA: static CAM_ALL — full frame, steady; the table and the fan
resolve together.
CHOREOGRAPHY:
- Scramble finish: `GHOST_FINISH_ORDER = [1, 4, 0, 2]` (table rows —
  i.e. rows 2, 5, 1, 3 on screen, NOT top-to-bottom), lane starts
  `FINISH_AT[row] = 0.6 + i*1.4`. `ROW_FOR_LANE = [1, 0, 3, 4, 2]`
  maps spatial lanes to rows, so the SPATIAL finish order (lanes 0, 3,
  1, 4) scrambles too.
- Each finish is a triplet keyed to its `f`: Analyst flips ok at `f`;
  `pulseA = ramp(f, f+0.35, inOut)` with edge heat `pulseWindow(f,
  f+0.2, f+0.6, f+0.9)`; Update Board blips live `[f+0.45, f+0.6)` then
  ok — and the lane's ROW fills `ramp(f+0.7, f+1.2)`, tint pulsing then
  decaying `· (1 − 0.65·ramp(f+1.7, f+2.7))` to the 0.35 residue. Lane
  event → row event 0.7s later: cause then effect, four times,
  overlapping at 1.4s spacing.
- The second flag: row 0 (Fed) gets the full-strength signal residue
  `ramp(FINISH_AT[0]+0.7, FINISH_AT[0]+1.3)` (lands ~4.1–4.7) — two
  `watch` cells now burn while the `—` rows stay quiet.
- The settle, in causal order: fan folds `1 − ramp(7.6, 8.6, inOut)`;
  inner lane ok-rings release at 9.4 as the container absorbs them;
  chain settles green Schedule 8.9 → Polymarket 9.15 → Desk 9.4
  (**0.25s** spacing, latched).
HOLDS: 9.4 → 15 (~5.6s) on the settled chain + fully-priced board with
two flags burning. Post-payoff breath; latched-settle.

## Scene 9: the-desk-at-rest (106.7–120.4s, authored 10s)

INTENT: an hour from now it does this again — the board is a living
research surface, not a bet slip.
CAMERA: `camMix(CAM_ALL, CAM_OUT, ramp(0.8, 2.4, inOut))` (~6%
ease-back).
CHOREOGRAPHY: none after the camera — all finals latched: `fillMix=1`,
`fillTint=0.35` everywhere, `signalTint=1` on rows 0 and 3, chain ok,
pill still armed at 4:00 PM.
HOLDS: 2.4 → 13.7 (~11.3s), fully still. The settled-desk payoff
carries it further than a dead hold should, but this is the same
weakness as outbound's bookend — the #1 ranking was earned by the
DIVERSITY of the middle, not by this hold.

## The moves used

- **table-over-chain set piece at three scales** — the same run seen
  macro (pull), container (fan), lane (one analyst), then full-frame
  (scramble): beat shapes VARY across the run; this is what the
  director's "visually diverse + dynamic" verdict rewarded.
- **the self-fire + pill dip-swap** (s5): a ring with no incoming pulse
  + `Next:` DipSwapping 3:00→4:00 PM — "scheduled" shown in two
  synchronized surfaces.
- **chain-to-table range sync** (s5): Polymarket live ↔ the five
  market+odds rows sweeping lit at 0.14s stagger, released as one when
  the pulse moves on. Only the columns the block actually returns.
- **runtime fan + one-clock simultaneity** (s6): `fan = ramp(2.2, 3.6,
  inOut)`, shared `pulseIn`, all five live the same frame.
- **branded tool-chip rings** (s7): Exa then Perplexity pulseWindows ~2s
  apart — tool calls as two distinct beats.
- **camera leaves the detail to watch the consequence** (s7's
  three-stop move; the row fill waits for the eased-out frame at 10.0).
- **scramble finish with cause→effect offset** (s8: shuffled
  `FINISH_AT` at 1.4s spacing; each lane's row fills 0.7s after its
  lane settles).
- **residue hierarchy** (s7/s8/s9): green tint pulses decay to a 0.35
  provenance residue on est/edge/signal, but the `watch` cells keep
  1.0 — permanent color = the signal, decayed color = the history.
- **causal-order green settle** (s8: Schedule → Polymarket → Desk at
  0.25s) and the **~6% ease-back bookend** (s9).
- **latched-settle holds** throughout (no oscillators; extend-safe by
  construction). The two long dead holds (s1 ~7.4s, s9 ~11.3s) are the
  remaining gap to close with an ambient pattern — everything else
  earns its rest.

═══════════════════════════════════════════════════════════════════════
# EXEMPLAR: browser-agent
═══════════════════════════════════════════════════════════════════════

<!-- ── browser-agent / 01-the-task.md ── -->

# Scene 1 — `the-task`  ·  archetype: **assemble**

Source: `../source/scenes/TheTaskScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md`.

This is the opening scene of the video, and it does exactly one thing: it shows
you the workflow the whole run is built around. Read it as a worked example —
every choice below is one you'll make again in your own first scene.

---

## What this scene is for

The video's whole story is "here's a normal agent workflow → watch it grow
hands and go work the web." So the first scene has to put the **workflow** on
screen as a concrete object — a three-block chain, `Start → Research →
Response` — and it has to read as *ordinary*. Nothing special yet, on purpose:
no tools, no run, no evidence. That ordinariness is the setup. The change
(scene 2 hangs a toolbelt on the agent) only lands as a change if scene 1 first
establishes the baseline it departs from.

So the rule the scene follows is *one idea per scene*: this scene is "here is
the workflow," full stop. No toolbelt, no run, no filmstrip. Resist the urge to
also introduce the tools or seed a card here — they each get their own scene.

## What it looks like

A three-block chain — `Start · Research · Response` — sitting in the **top
half** of frame (`CHAIN_Y = 250`), with conspicuously empty space below it. The
blocks assemble left to right, alternating block then connecting wire then
block, over a field of canvas dots. The `Research` block's `Messages` row holds
a `<start.input>` reference tag; once the chain is fully built, that tag glows
once and releases. Then it just sits there.

## The one real decision: render the *whole* set piece, chain-only state

The scene renders this and almost nothing else:

```tsx
<Rig
  start={{opacity: reveal(0.4)}}
  agent={{opacity: reveal(1.7)}}
  response={{opacity: reveal(3.1)}}
  edge1={{progress: reveal(1.1, 0.55)}}
  edge2={{progress: reveal(2.5, 0.55)}}
  msgGlow={wave(t, 4.8, 6.4)}
/>
```

Three things to take from this.

**Use `SimBlock`, the real product block — never a hand-built box.** The chain
on screen is the actual block component (a pixel-faithful port of Sim's
`PreviewBlockNode`, scaled ×1.5 for 1080p legibility), fed real block colors,
the real row grammar, real handle geometry. You are never designing a node
here; you're configuring the one the product draws. The chain's *shape* is the
docs' `BUILD_AGENT_WORKFLOW` pattern verbatim — `Start {Input} → agent
{Messages, Model} → Response {Data}` — so even the layout traces to product
truth, not taste.

**Notice the toolbelt, the run state, and all four evidence cards are
present — just not passed.** This is the part people get wrong. The instinct is
"scene 1 is only the bare chain, so only render the chain." Don't. There is
*one* set piece (`<Rig/>`) for the entire video, and every scene renders all of
it, turning pieces on with state props. Here `toolsReveal` defaults to `0` (no
toolbelt), `cards` defaults to `[NO_CARD ×4]` (empty rail), every glow defaults
to `0`. The pieces exist in the component tree from frame 1; this scene simply
declines to light them.

> *"Why bother rendering things I can't see?"* Because of what happens at the
> cut into scene 2. Scene 2 grows the toolbelt in on the same `Research` block
> and lights the rail later. If scene 1 didn't mount the rig at all and scene 2
> suddenly mounted it, you'd risk a one-frame jump — the chain reflowing, the
> block resizing, a flash. By rendering the same single set piece in both
> scenes and only animating which props are non-zero, the boundary between them
> is identical by construction. Continuity stops being something you check and
> becomes something you can't break.

**The empty bottom half is reserved, not forgotten.** The chain sits at
`CHAIN_Y = 250` (top half) while the four rail slots live at `RAIL_Y = 660`
(bottom half) — and the rail is rendered empty this whole scene. That dead
space below the chain isn't an unbalanced layout; it's the filmstrip's room,
held open from frame 1 so that when cards start dropping into it (scene 3
onward) nothing above has to move. The layout silently promises "evidence goes
here" before the viewer knows what evidence is.

## The framing

```ts
// no camera transform — static full frame, the rig drawn at stage coords
<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
```

There is no camera here. Unlike rigs that carry a `cam` transform, this video's
stage is a fixed `1920×1080` (`STAGE_W × STAGE_H` from `layout.ts`) drawn
1:1 into frame, and scenes 1–6 never move it. The only camera move in the
entire video is the ~6% pull-back in the scene-7 bookend.

> *"Why no establishing zoom on the hero, the way an `assemble` opener often
> does?"* Because the hero of *this* video isn't a single object you frame
> larger — it's a process that fills the whole frame over time (chain on top,
> filmstrip filling the bottom). A static full frame is the right neutral
> because the composition is *designed* to be read whole: top half is the
> workflow, bottom half is the evidence it will produce. Zooming in on the
> chain now would crop out the empty rail — and the empty rail is half the
> point. So "no camera" isn't laziness; it's the framing the two-zone layout
> demands.

## The values, and why they're references not data

Every on-screen string traces to the rig, which traces to the docs pattern:

| block | row | value |
|---|---|---|
| Start | Input | `Competitor` |
| Research | Messages | `Research <start.input>` |
| Research | Model | `claude-sonnet-4-6` |
| Response | Data | `{ "brief": <research.content> }` |

Two of those values — `<start.input>` and `<research.content>` — are **reference
tags**, not literals. They render via the `Tag` component (the product's own
pill for a wired reference), and they deliberately never substitute to a real
string. There is no run yet, and even when the run happens (scenes 3–6) the
brief text stays off screen as a `⟨pending⟩` artifact — so a tag is the honest
representation of "this field is wired to another block's output, value to be
produced." Keep this property. The moment you type a fake brief into that Data
row, the video stops being a true picture of how the product wires data and
becomes a mockup.

> *"Why is the agent block named `Research` and the input `Competitor`, when
> the docs blocks are named `Score lead` / `Lead`?"* Those names are patterned
> on the docs naming convention (verb-noun block name, single-noun input
> label) but populated with nouns from the registry's own research-stack and
> competitor-pricing templates. They're declared, swappable deviations — not
> doc-verbatim — because no canonical "research a competitor" block exists to
> copy. The *grammar* is product-true; the specific nouns are the closest
> honest fill.

## The animation, beat by beat

One tiny helper does all the entrance timing. `reveal(t0, dur = 0.5)` is a
scene-local clamped `interpolate` from 0→1 as the clock `t` (seconds) crosses
`t0 → t0+dur`, eased `EASING.out`. One shared helper, `wave(t, a, b, ramp =
0.35)` (imported from the rig), is a glow that rises over `a → a+ramp`, holds,
and falls to zero over `b−ramp → b`. That's the whole vocabulary; everything
below is built from these two.

### (a) The chain assembles in preview order — five staggered reveals

The blocks and wires come in alternating, left to right:

```
Start      reveal(0.4)        block fades in   0.4 → 0.9
edge 1     reveal(1.1, 0.55)  wire draws       1.1 → 1.65
Research   reveal(1.7)        block fades in   1.7 → 2.2
edge 2     reveal(2.5, 0.55)  wire draws       2.5 → 3.05
Response   reveal(3.1)        block fades in   3.1 → 3.6
```

What you see is a **left-to-right causality wave**: a block appears, then the
wire reaches out from it, then the next block appears where the wire points.
Each wire starts ~0.6s *before* its destination block (edge 1 at 1.1, Research
at 1.7) — so the wire is visibly reaching toward an empty spot, and the block
arrives to meet it. That ordering is the whole reason the chain reads as
*directional* (data flows Start → Response) rather than three boxes that
happened to fade up.

> *"Why start Start at 0.4 instead of 0.0?"* A short beat of empty dotted canvas
> before anything appears reads as a deliberate open — the blank workspace you
> build *onto*. Starting at 0.0 makes the first frame feel like the render was
> already mid-load.
>
> *"Why are the blocks 0.5s fades but the wires 0.55s?"* The block reveal is a
> plain opacity fade — `reveal`'s default `dur = 0.5`. The wires take a hair
> longer (`0.55`) because a wire *draws* (the `SimEdgePath` animates its
> `progress` 0→1, a stroke extending from source handle to target), and a draw
> needs enough frames to read as a line being pulled across the gap rather than
> a line blinking on. The 0.05s isn't precious; it's "a touch slower because
> there's spatial travel to see."
>
> *"Where does the 0.6s block-to-block pitch come from — Start 0.4, Research
> 1.7, Response 3.1?"* It's chosen against two constraints, like any stagger.
> Too tight and the three blocks arrive as one clump; you lose the
> left-to-right reading. Too loose and the chain takes five-plus seconds to
> assemble, which is dead time before the idea even starts. The ~1.3–1.4s
> per block-and-wire pair (0.4 → 1.7 → 3.1) is fast enough to feel alive, slow
> enough that your eye walks the chain in order. The whole assembly completes
> at 3.6s, leaving room for the one beat of meaning.

> *"Why `EASING.out` on the fades and not linear like a plain opacity ramp?"*
> The blocks aren't *only* fading — `reveal` is also what the rig could hang a
> drop on, and more importantly `EASING.out` (a fast-in, settle-out bezier) is
> the house entrance curve for everything that arrives. Using it on every
> entrance, fade or not, is what keeps the video's motion feeling like one
> hand. Consistency of curve matters more than whether a given entrance
> strictly needs easing.

### (b) The reference tag glows once, then releases — `msgGlow = wave(t, 4.8, 6.4)`

After the chain is fully assembled (3.6s) and has settled for a beat, the
`<start.input>` tag inside Research's `Messages` row glows: up over 4.8 →
5.15 (the `0.35` ramp), holds, down over 6.05 → 6.4. The glow is the product's
own "this row is being read" signal applied to a reference pill.

With no words, this glow says one sentence: *"the agent's instruction is wired
to whatever Start hands it"* — `Research <start.input>` means "research the
thing in Start's Input," and the glow points your eye at exactly the wired
reference while the narration names it.

> *"Why those two numbers, 4.8 and 6.4?"* They're the glow's shape: up at 4.8,
> down ending at 6.4 — so the tag stays lit for ~1.2s, long enough to register
> as a deliberate pointing gesture, then lets go and the chain returns to
> neutral.
>
> *"Why does it fire at 4.8 when the chain finished assembling at 3.6?"*
> Because the assembly and the reference-read are two different ideas, and
> overlapping them would blur both. Let the chain fully arrive and settle, hold
> a beat of stillness, *then* make the one pointing gesture. Stacking two
> animations in the same moment is the most common way a scene starts to feel
> busy and amateurish — give each idea its own air.
>
> *"Why glow only `<start.input>` and not `<research.content>` in Response
> too?"* Because this scene's one beat of meaning is "the agent is told to
> research the input." `<research.content>` (Response reading the agent's
> output) is a *later* idea — it gets its own glow in scene 6 when the brief
> comes back. Lighting both now would say two things at once. One reference,
> one glow, one sentence.

### (c) The hold — from ~6.4s to the end of the scene (≈8.7s)

After the tag releases, nothing moves. The assembled, ordinary workflow just
rests over the canvas dots for ~2.3s.

> *"Isn't a still frame dead air?"* Not here — the chain you just built is the
> baseline object of the whole video, and letting it sit is letting "this is a
> normal workflow" land before scene 2 changes it. There's a deeper reason too:
> this scene's tail is where narration plays, and the scene needs to be able to
> *stretch* to fit however long the voiceover runs (the comp is VO-stretched —
> scene 1 runs 8.7s to fit its narration). A scene that ends on a static,
> settled state can be extended to any length safely, because there's no
> animation mid-flight to interrupt. If it ended on something still moving, you
> couldn't extend it without freezing a motion halfway. So "ends on a settled
> hold" isn't just taste; it's what makes the audio step downstream painless.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *What's the object?* An agent workflow → use the real `SimBlock` chain in the
   docs' `BUILD_AGENT_WORKFLOW` shape.
2. *How do I show only the bare chain?* Render the **one** rig with tools, run
   state, and cards all left at their zero defaults → continuity is free.
3. *How does a workflow assemble?* Block → wire → block, left to right, each
   wire reaching before its block arrives → you read direction, not three
   boxes.
4. *How do I say "the agent is told to research the input" without a caption?*
   Glow the product's own `<start.input>` reference tag → product vocabulary,
   never words on screen.
5. *What about the values the run will produce?* Keep them as reference tags,
   never literals → an honest picture of wired data, value pending.
6. *How should it be framed?* Static full frame, chain up top, empty rail
   reserved below → the two-zone composition the rest of the video fills in.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. There's no single clever move — it's
restraint applied six times.

## Exit state (what scene 2 inherits)

`chain assembled (Start, Research, Response at full opacity) · both edges drawn
at progress 1 · no toolbelt (toolsReveal 0) · empty rail (4 NO_CARDs) ·
<start.input> glow released by 6.4s · static full frame`. Scene 2 opens on
exactly this frame and starts growing the Tools row in on the same `Research`
block while a selection ring brackets it. Because both scenes render the same
rig, that boundary is identical down to the pixel.

<!-- ── browser-agent / 02-the-toolbelt.md ── -->

# Scene 2 — `the-toolbelt`  ·  archetype: **preview-glance + smooth growth**

Source: `../source/scenes/TheToolbeltScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../../../src/components/SimBlock.tsx`.

This is the second scene of the video, and it does exactly one thing: it gives
the agent its tools. Scene 1 built a *normal* workflow — Start → Research →
Response. This scene reaches into the middle block and grows a row of tool chips
onto it, then names them one at a time. Read it as a worked example — the
smooth-growth reveal and the preview-glance discipline here are both moves you'll
reach for again.

---

## What this scene is for

The whole video's claim is "give an agent web tools and one prompt and it goes
out and works the web." Scene 1 deliberately withheld the tools — it showed a
plain agent so the toolbelt would read as *the change*. So this scene's entire
job is to make that change land: open a **Tools** row on the Research block and
populate it with three chips — Exa, Firecrawl, Browser Use — so the viewer can
see the agent's reach before any of it is exercised.

And that last clause is the whole archetype. This is a **preview-glance**: you
*name* what's coming without *teaching* it yet. The chips appear and each pulses
once — but nothing is called, nothing searches, nothing reads. The scene plants
three nouns ("finds / reads / acts") that scenes 3–5 will turn into verbs. The
rule it follows is *one idea per scene*: this scene is "here are the hands," full
stop. No run, no cards, no filmstrip. Resist the urge to fire the first tool
call here — that's scene 3's job, and stealing it would blur both beats.

## What it looks like

The same three-block chain from scene 1, sitting where it was. A blue selection
ring appears around the Research block — the product's "someone is editing this"
signal. A **Tools** row grows open underneath the block's existing rows, smoothly,
with no pop. Then three chips arrive in sequence: Exa, then Firecrawl, then
Browser Use, the last one dropping onto a second wrap line. As each chip lands it
takes a brief selection-ring pulse. The editing ring releases, and the
three-chip block settles.

## The one real decision: grow the tools onto the *real* block, in place

The scene renders this and almost nothing else:

```tsx
<Rig
  agent={{highlighted: t >= 0.6 && t < 7.0}}
  toolsReveal={grow(1.0, 0.7)}
  toolsWrapReveal={cv(t, 4.8, 5.4)}
  chips={{
    exa:       {reveal: grow(1.2), ring: wave(t, 2.2, 3.2, 0.3)},
    firecrawl: {reveal: grow(3.0), ring: wave(t, 3.8, 4.8, 0.3)},
    browser:   {reveal: cv(t, 5.0, 5.7), ring: wave(t, 5.9, 6.9, 0.3)},
  }}
/>
```

Three things to take from this.

**Use the real `SimBlock`, and grow the chips *into* it — never draw a separate
"tools" widget.** A tool chip in Sim is part of the agent block's configuration;
it lives in the block's own Tools row. So the surface on screen is the actual
`SimBlock` component (`apps/sim/.../preview-block-node.tsx`, ported ×1.5), fed a
`tools` array and a `toolsReveal` amount. You are never designing a chip rack
here; you're feeding the block the same `SimBlockTool[]` it takes in the product.

**It's the same single set piece as scene 1 (`<Rig/>`), with only `agent` props
changing.** Start and Response are still rendered — the scene just doesn't touch
them, so they sit at full opacity exactly where scene 1 left them. This is the
continuity rule the whole video runs on: one `<Rig/>`, every scene, state props
only. The boundary into this scene is identical by construction because the chain
isn't re-mounted — it's the literal same component, one prop deeper.

> *"Why grow the row in instead of just fading the chips on top of the block?"*
> Because the chips have *height*. A Tools row is 40px of block that didn't exist
> a moment ago, and the block's bottom edge — and therefore the green ring around
> it, and the rail spacing below — all depend on where that bottom edge is. If you
> faded chips in over a block whose box didn't change, the chips would overflow or
> float. Growing the row means the block's geometry is honest at every frame: the
> block is exactly as tall as its contents, the way the real product lays it out.
> The smooth-growth machinery (height-interpolate + negative-margin gap cancel,
> below) is what buys you "no pop" while keeping that honesty.

## The values, and why these three chips

The three tools are defined in the rig (`_rig.tsx`), not invented per-scene:

| chip | color | glyph | role (taught later) |
|---|---|---|---|
| Exa | `#1F40ED` | white lettermark | FIND — search returns sources |
| Firecrawl | `#181C1E` | multicolor flame | READ — pull a page as clean text |
| Browser Use | `#181C1E` | white mark | ACT — drive a real browser |

Every one of those colors is the registry's own chip color
(`apps/sim/blocks/blocks/{exa,firecrawl,browser_use}.ts`), and every glyph is
ported from `apps/sim/components/icons.tsx`. This is the port-don't-design rule at
its most literal: you do not get to pick a palette for the toolbelt. The toolbelt
*is* three specific products with three specific brand marks, and the scene's
credibility comes entirely from those being right.

> *"Why these three and not, say, four tools to match the four cards later?"*
> Because the count is grounded, not chosen for symmetry. Exa + Firecrawl is the
> registry's actual "research stack" template (Firecrawl's block meta describes
> "an agent that uses Exa to find authoritative URLs… scrapes each with
> Firecrawl"); Browser Use is added for the pages scraping can't read. Three tools,
> three distinct *reaches*. The four evidence cards in scene 3+ come from four
> *calls* (Firecrawl gets called twice), not four tools — the mapping is calls→cards,
> never tools→cards. Don't let a later count tempt you into padding this one.

## The animation, beat by beat

Three tiny helpers do all the timing. `grow(t0, dur=0.6)` is an **eased** ramp:
it goes 0→1 over `t0 → t0+dur` with `EASING.out` (the theme's
`bezier(0.16, 1, 0.3, 1)` — a fast-out, gentle-settle entrance curve), clamped
outside. `cv(t, lo, hi)` is the *linear* clamped ramp (no easing). `wave(t, a, b,
ramp)` rises over `ramp` seconds at `a`, holds, and falls back to zero over `ramp`
seconds ending at `b`. The whole scene is built from these three, and *which* one
each value uses is itself a decision (see the easing note under the chips).

### (a) The editing ring appears — `agent.highlighted = t ∈ [0.6, 7.0)`

The Research block gets a selection ring from 0.6s to 7.0s. In `SimBlock`,
`highlighted` draws an `inset 0 0 0 2.625px` ring in the secondary (selection-blue)
color — the product's own "this block is selected / being edited" state.

> *"Why bracket the *entire* growth with one ring instead of pulsing it per
> chip?"* Because the ring is answering "why are these chips appearing?" The honest
> answer is *someone is editing this block* — adding tools to it — and that edit is
> one continuous action that spans all three chips. A single ring held across the
> whole sequence says "this is one editing session." Pulsing it per chip would
> imply three separate edits, which is a lie about what's happening, and visually
> busier for no gain.
>
> *"Why start at 0.6, before the Tools row even opens at 1.0?"* The ring is the
> *cause*; the row growing is the *effect*. Selecting the block has to visibly
> precede editing its contents, or the edit looks like it came from nowhere. 0.4s
> of "block selected, nothing changed yet" reads as a hand landing on the block
> before it starts typing.
>
> *"Why release at 7.0 and not just hold to the end?"* Because the scene has to
> *settle* — the exit state this scene hands to scene 3 is a plain, un-selected
> template chain (no editing ring), so the run in scene 3 can start clean. The ring
> releasing at 7.0 (the last chip's pulse finishes at 6.9) is the visual "edit
> done, deselect." Everything transient in this scene reverts before the cut; the
> ring is the outermost layer of that discipline.

### (b) The Tools row grows open — `toolsReveal = grow(1.0, 0.7)`

The Tools row opens over **1.0s → 1.7s**, eased. Inside `SimBlock`, a
`toolsReveal < 1` sets the row's `height: CHIP_LINE_H * toolsReveal` and a
`marginTop: -ROW_GAP * (1 - toolsReveal)` — the height grows from 0 to the natural
40px chip-line height while the negative margin cancels the flex gap that would
otherwise pop in fully-formed. That gap-cancel is the entire trick to "no pop":
without it, the 12px row gap appears at full size on frame one and the block jumps
12px taller before the row has any height.

> *"Where does 40px (`CHIP_LINE_H`) come from — why not compute it?"* It was
> **measured from a render**, not derived. The comment in `SimBlock` is explicit:
> the arithmetic (text 27 + padding 9 + border 2 = 38) under-counts by 2px, so the
> code trusts the rasterizer and hard-codes 40. This matters because the grow
> animates *to* this exact height — if it animated to 38 and the chips actually
> need 40, the last 2px would pop on the final frame or the chip borders would clip
> mid-reveal. "Trust the rasterizer, not the math" is the rule; the measured
> constant is how you obey it.
>
> *"Why 0.7s for this row but 0.6s default for the chips?"* The row is the bigger,
> structural move — the block changing shape — so it gets slightly more time to
> feel deliberate. The chips growing inside it are smaller events and take the
> snappier default. It's the same logic as scene 1's calm establishing fade vs.
> faster later motion: the size of the change sets its duration.

### (c) The first two chips grow in — `exa = grow(1.2)`, `firecrawl = grow(3.0)`

Exa reveals over **1.2s → 1.8s**, Firecrawl over **3.0s → 3.6s**. A chip's
`reveal` feeds `opacity` *and*, while `< 1`, a `maxWidth: chipNaturalWidth(name) *
reveal` with a `marginLeft: -7.5px * (1 - reveal)` — so the chip grows in *width*
from zero to its measured natural width, sliding its line-mates rightward smoothly
rather than appearing full-size and shoving them. `chipNaturalWidth` is computed
with `@remotion/layout-utils` (`24 + 7.5 + textWidth(name, 18) + 18 + 2`), so the
target width is the chip's real rendered width, not a guess.

> *"Why does Exa start at 1.2 — INSIDE the row's 1.0→1.7 reveal — instead of
> waiting for the row to finish?"* This is the subtlest decision in the scene, and
> the scene's own comment flags it. If the row opened to its full 40px height
> *empty* and then the first chip mounted, you'd get a `31.5 → 40px` pop: a bare
> label row is shorter than a chip-line row, so the block would settle at one
> height and then jump taller when Exa arrived. By mounting Exa at 1.2 — while the
> row is still growing — the row opens *straight to* chip-line height, because it
> already has a chip in it. Cause (row opening) and effect (chip appearing) overlap
> just enough that the block only ever has one height target. Overlapping these two
> reveals isn't sloppiness; it's what prevents the pop.
>
> *"Where does the ~1.8s chip-to-chip cadence come from?"* (Exa pulse done at 3.2,
> Firecrawl reveal at 3.0; Firecrawl pulse done at 4.8, Browser Use reveal at 5.0.)
> It's chosen against the same two bounds scene 1's row stagger was. Too tight and
> the three chips read as one block — the viewer can't register three distinct
> tools. Too loose and naming three chips eats ten seconds of dead time. ~1.8s lets
> each chip *appear, then pulse, then* the next appears — the eye lands on one tool,
> sees it acknowledged, moves to the next. Pick the cadence once and hold it; the
> regularity is what makes the sequence feel composed.

### (d) Each chip pulses once on landing — `ring: wave(t, …, …, 0.3)`

Exa rings `wave(2.2, 3.2, 0.3)`, Firecrawl `wave(3.8, 4.8, 0.3)`, Browser Use
`wave(5.9, 6.9, 0.3)`. Each is a ~1s pulse: a selection ring on that one chip
rises over 0.3s, holds briefly, falls over 0.3s. In `SimBlock` the chip `ring`
draws an `inset 0 0 0 2.25px` selection-ring inside the chip border.

> *"What is this pulse *for*, if no tool is being called yet?"* It's a
> pre-teaching gesture. Scenes 3–5 use exactly this chip ring to mean "this tool is
> being called right now" — and crucially, *in sync with a card being born in the
> rail* (the video's whole equation: ring = card birth). By ringing each chip once
> here, as it's introduced, the scene pre-installs the vocabulary: when you see a
> chip ring *later*, you already associate it with that specific tool. It's the
> same move as scene 1 selecting one table row to silently define "a row is a
> record" — a wordless gesture that teaches a mapping you'll need.
>
> *"Why fire the pulse ~1s after each chip appears, not on arrival?"* So the two
> ideas don't collide. The chip *appearing* is "here is a tool"; the chip *ringing*
> is "and this is what a call to it looks like." Let the chip land and settle, then
> ring it. Stacking the arrival and the pulse in the same instant would blur "a tool
> exists" with "a tool is active" — give each its own beat, the same air-per-idea
> rule scene 1 applied to its reveal-vs-selection split.

### (e) The wrap line opens and Browser Use fades in — `toolsWrapReveal = cv(t, 4.8, 5.4)`, `browser.reveal = cv(t, 5.0, 5.7)`

This is the one chip handled differently, and the difference is deliberate. "Browser
Use" is wide enough that it doesn't fit on line one — it owns the chips' *second*
wrap line. So two things happen in order: first the **line opens** (`toolsWrapReveal`
grows the chip container's height from one natural line to exactly two, over
4.8→5.4s), and then the Browser Use chip **fades in at full width** over 5.0→5.7s.
Note both use `cv` (linear), not `grow`, and the chip is flagged `fade: true` in
the rig so it reveals by opacity rather than width-growth.

> *"Why does Browser Use fade in while the other two width-grew?"* Because a
> width-growing chip on a *wrapping* line would jump lines mid-reveal. Picture it:
> as the chip grows wider, at some width it stops fitting on line one and flex-wrap
> kicks it to line two — a one-frame teleport. The other two chips never wrap, so
> width-growth is safe for them. The chip that owns the wrap boundary can't use it;
> it has to arrive at its final width atomically (a fade) onto a line that's already
> been opened for it. The scene's comment states exactly this: "width-growth would
> jump lines mid-reveal." Match the reveal style to whether the chip crosses a wrap.
>
> *"Why open the line (4.8) slightly before the chip fades (5.0)?"* Same
> cause-before-effect discipline as everywhere else: the *space* has to exist before
> the thing that fills it appears. Opening the line first means the block grows its
> second row of height, and *then* the chip materializes into that already-present
> space — never a chip appearing and shoving the block taller in the same frame.

### (f) The settle — from ~7.0s to the end of the scene

After Browser Use's pulse finishes (6.9) and the editing ring releases (7.0),
nothing moves. The three-chip block just rests.

> *"Isn't a still frame dead air?"* No — this is the new thesis object. Scene 1's
> hold let the bare table land; this hold lets the *armed agent* land — the viewer
> needs a beat to take in "this block now has three tools." And as in scene 1,
> there's a downstream reason: this scene's tail is where its narration plays, and a
> scene that ends on a fully-settled state can be *stretched* to whatever length the
> voiceover runs without freezing a motion mid-flight. (The choreography notes this
> hold runs ~4s, slightly over the visual cap, with narration covering it.) Ending
> on a settled hold is what makes the audio step painless — taste and pipeline agree.

## How to think about the whole scene

Walk the decisions in order and you can see a question driving each one:

1. *What changed since scene 1?* The agent got tools → grow a Tools row onto the
   **same** Research block, in place.
2. *How do I show only that change?* Render the one set piece; touch only the
   `agent` props → Start, Response, and the boundary are untouched and free.
3. *How does a row grow without a pop?* Animate its height with the gap cancelled,
   and mount the first chip *inside* the row's reveal → the block has one height
   target, never two.
4. *Whose hand is doing this?* The product's editing ring, bracketing the whole
   sequence → "one editing session," in product vocabulary, no caption.
5. *How do I name three tools as three?* Appear, then pulse, at a steady ~1.8s
   cadence → three distinct reaches, not one blob.
6. *What about the chip that wraps?* Open the line first, then fade the chip in at
   full width → no mid-reveal line jump.
7. *Do I teach what they do?* No — pulse each once to pre-install "ring = this tool,"
   and stop. The verbs are scenes 3–5's. → an honest preview-glance.

Every one of those is a small decision, and the quality of the scene is the sum of
getting each one right. There's no single clever move — it's restraint applied
seven times, with the smooth-growth machinery doing the quiet work of keeping the
block honest at every frame.

## Exit state (what scene 3 inherits)

`chain in template state · Research block with all three chips at reveal 1
(pixel-static) · no editing ring (released 7.0s) · no chip rings · no rail, no
cards · camera static full-frame`. Scene 3 opens on exactly this frame and starts
the run: Start blips, the wire pulses, and the agent goes live. Because both
scenes render the same `<Rig/>` with the chips already at full reveal, that
boundary is identical down to the pixel — the continuity contract calls this the
"chain + 3 chips at reveal 1 (template)" handoff.

<!-- ── browser-agent / 03-the-run-begins.md ── -->

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

<!-- ── browser-agent / 04-reading-the-pages.md ── -->

# Scene 4 — `reading-the-pages`  ·  archetype: **tool calls / evidence accumulation**

Source: `../source/scenes/ReadingThePagesScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md` (scene 4).

This is the scene the whole video is built to earn — the one the director
singled out: *"the evidence filmstrip accumulating in sync with each tool
call."* Read it as the worked example of the move at the heart of the piece:
**one tool call = one card births in the rail.** Scene 4 teaches that move
twice in nine seconds, the second time faster, and that's the entire scene.

---

## What this scene is for

The video's thesis is "give an agent web tools and one prompt, and it goes
out and works the web — and every tool call comes back as a captured result
the workflow keeps." The previous scene taught that equation once (the agent's
first move was an Exa search, and a search-results card dropped into the rail
in sync). This scene's job is to **establish that the equation is a pattern,
not a one-off** — to show the agent doing the same thing again, and again, one
call per page worth reading, with the filmstrip growing each time.

So the rule the scene follows is *one idea per scene*: this scene is "the
agent reads pages, and each read is a captured card," full stop. It is not
about *what* the pages say (that content never appears — see below), and it is
not about the browser session (that's scene 5's set piece). It is purely the
**rhythm of accumulation**: ring → card, ring → card.

There's a second, quieter idea folded in, and it's the reason there are *two*
reads here and not one: the repeat. A single read teaches "this is what a read
looks like." The repeat — at a faster tempo — teaches "this is *routine* now;
the agent does this per source." That's why the choreography compresses every
window on the second call: the acceleration is the message.

## What it looks like

The chain (Start → Research → Response) sits where it has all video, the
Research block burning a blue live ring it lit two scenes ago and hasn't
released. Below it, the evidence rail: card 1 (the Exa search results from
scene 3) already at rest in slot 1. Then the Firecrawl chip on the Research
block rings, and a page-capture card drops into slot 2 — a title bar and a
paragraph of skeleton lines drawing in. The chip ring fades, a green capture
ring flashes around the new card and settles. Then it all happens *again*,
faster: the chip rings a second time, card 3 drops into slot 3 (same shape,
different skeleton), captures green. Three cards now sit in the rail. The live
ring still holds. Cut.

## The one real decision: render the whole set piece, carry the held state

Like every scene in this video, scene 4 renders the *single* set piece — one
`<Rig/>` — and passes it state. It builds almost nothing of its own:

```tsx
<Rig
  agent={{highlighted: true}}
  toolsReveal={1}
  chips={{firecrawl: {ring: Math.max(ring1, ring2)}}}
  cards={[{reveal: 1}, card2, card3, {}]}
/>
```

Three things to take from this.

**The `<Rig/>` is the entire world; scenes only pass state.** The chain, the
three tool chips, the four-slot rail — all of it lives in `_rig.tsx` and is
positioned by `layout.ts`. A scene never lays anything out; it hands the rig a
prop bag describing *what state the world is in right now*. That's why
continuity is free: scene 3's last frame and scene 4's first frame are the
same rig in (nearly) the same state, by construction.

**The held live ring is carried in as a prop, not re-lit.** `agent={{highlighted:
true}}` — the Research block is live for the *entire* duration of this scene,
flat true, no animation. It was lit in scene 3 at t=1.6s and it does not release
until scene 6. Scene 4 is one stretch in the middle of that long-held ring, so
the scene's job is to *not touch it* — just declare it on. This is the run-spine:
one blue ring spanning four scenes, every boundary a freeze-cut carrying it.

> *"Why hold a ring across four scene cuts instead of releasing and re-lighting
> per scene?"* Because the live ring means **the run is mid-flight** — the agent
> is still working. If it released between calls, you'd be saying the run
> finished and restarted four times, which is a lie: it's *one* Start→Response
> traversal. The held ring is what makes the four tool calls read as four moves
> inside a single run rather than four separate runs. Releasing it is itself a
> beat — and it's reserved for scene 6, when the agent finally hands back the
> brief.

**Card 1 is passed `{reveal: 1}` — explicitly at rest.** The first slot still
holds the search-results card from scene 3, and the scene declares it fully
revealed (`reveal: 1`), which `popIn` clamps to *exactly* 1 — pixel-static.
The card doesn't re-animate or re-pop on the cut; it's just *there*, the same
as the last frame of scene 3. Slot 4 is `{}` (the empty default, `reveal: 0`),
so it renders nothing — that slot belongs to scene 5's folded browser session.

> *"Why pass `{reveal: 1}` for card 1 instead of just leaving it out?"* Because
> leaving it out (`{}`) means `reveal: 0` — the card would *vanish*. Card 1 must
> persist visibly across the cut (continuity contract: 3→4 carries card 1 at
> rest). The rail only ever grows; a card that has landed never leaves and never
> moves. So every scene from here on must keep re-declaring the cards already in
> the rail as fully present. The filmstrip is cumulative state, re-asserted each
> scene.

## The two-surface sync — the move this whole video exists to show

The director's praise was specifically for **"the evidence filmstrip
accumulating in sync with each tool call."** That sync is the load-bearing
mechanism, so it's worth being precise about how it's built. Every tool call is
*one event shown on two surfaces at once*:

1. **The tool chip rings** on the Research block — the product's own "this tool
   was called" signal, a ring pulse around the chip.
2. **A card births in the rail** — springs into the next open slot and captures.

These are deliberately wired so the chip ring starts *first* and the card birth
follows a beat later, *inside* the ring window. Cause visibly precedes effect,
yet both read as a single gesture. The discipline (the ResolvedTag synchrony
rule from the component library) is: when one thing causes another, show both,
and let the timing make the causation visible — never just one, never
simultaneous.

> *"Why two surfaces? Wouldn't the card alone be enough?"* The card alone tells
> you a card appeared, but not *why*. The chip ring is the product's vocabulary
> for "the agent called this tool" — it ties the new evidence back to a specific
> tool on a specific block. Showing both, in sync, is what makes the viewer
> learn the equation `chip ring = captured result` without a word of narration.
> Drop the ring and the cards look like they're appearing on their own, which
> breaks the honesty rule (nothing changes in a Sim workflow unless something
> causes it).

> *"Why does the same chip ring twice instead of two different chips?"* Both
> reads are **Firecrawl** calls — the registry's read tool. (Exa *finds* the
> pages in scene 3; Firecrawl *reads* them here; Browser Use *acts* in scene 5.)
> The agent calling the same tool twice in a row is the literal truth of the
> task — "scrape each source with Firecrawl" — so the same chip rings twice.
> That's why both rings feed the *same* prop:
> `chips={{firecrawl: {ring: Math.max(ring1, ring2)}}}`. Two ring windows,
> `Math.max`'d so whichever is active drives the chip; between them the ring is
> zero (the chip rests). One chip, two calls.

## The values, and why the captured pages are skeleton lines

Open the rig and you'll find that the page cards (slots 2 and 3) render no
words — a title bar and five paragraph lines, all gray skeleton bars:

```tsx
<PageCard slot={1} vis={cards[1]} seed={4} />
<PageCard slot={2} vis={cards[2]} seed={9} />
```

The bars' widths are *seeded*, not random: `seededPct(seed, i, base, span)`
derives a deterministic width from the card's seed and the row index, so the
same card looks the same on every render (no jitter, no flicker) but two
different cards look like two different pages.

> *"Why no actual page text — wouldn't real text be more convincing?"* Because
> **no real run artifact exists** (this is a batch build, declared in the script's
> assumptions). The honest options are: invent fake page text, or show the
> *shape* of a captured page without inventing its content. The video chooses
> the second — captured content is always the house skeleton-line language
> (inherited from the ChunkCard precedent). The filmstrip shows you that
> evidence *was captured and has structure*, never puts words in the agent's
> mouth. When a real artifact arrives, the swap is four card bodies, no layout
> change.

> *"Why does card 3 take a different `seed` (9) than card 2 (4)?"* So the two
> page captures don't look identical. Same card grammar (title + paragraph),
> different skeleton — which reads as "two different pages, both read the same
> way." If both used the same seed, the repeat would look like a glitch (the
> same card drawn twice) rather than a second, distinct source. The seed is the
> cheapest possible way to say "different page, same shape."

## The card grammar — component selection

Both reads use `PageCard`, which is the Firecrawl-flavored member of a small
card family, all built on one `CardShell`:

- **`CardShell`** — the house card chrome: `surface2` body, `border1` 1px
  border, `r8` radius, a 36px header strip carrying *only* the tool's identity
  chip (a 20px rounded square in the tool's registry color with its glyph). No
  caption, no label — the chip *is* the provenance, because the synced chip
  ring already taught which tool this card came from. The shell also owns the
  two transient overlays: a selection-blue `glow` ("the agent is reading this")
  and a green `pulse` ("just captured").
- **`SearchCard`** (slot 0, scene 3) — Exa chip, three favicon-dot + title/sub
  rows (search results have a list shape).
- **`PageCard`** (slots 1–2, this scene) — Firecrawl chip, a bold title bar
  then five paragraph lines (a page has a document shape).

That the search card and the page card are visibly *different shapes* is
deliberate: a viewer can tell "this is a search result" from "this is a read
page" at a glance, without reading anything. The shape carries the meaning.

> *"Why is the chip the only thing in the header — no source URL, no title?"*
> Because a URL or title would be words, and words are off-screen content here
> (no real artifact). The chip alone is enough provenance: you watched the
> Firecrawl chip ring as this card was born, so you already know it's a
> Firecrawl read. Adding a skeleton "title bar" inside the body (not the header)
> gives the *shape* of a page heading without claiming to know its text.

## The animation, beat by beat

Two helpers do all the timing. `cv(t, lo, hi)` is a clamped interpolate from 0
to 1 as the clock `t` (seconds) crosses `lo`→`hi`, flat outside. `popIn(frame,
fps, delay, dur)` is a spring (damping 14, stiffness 160) that's 0 before
`delay`, springs over `dur` with a slight organic overshoot, then clamps to
*exactly* 1 — so a landed card is pixel-static. Chip rings and capture pulses
are `Math.min(cv(up), cv(down))` pairs: rise, hold, fall.

The scene is the same gesture twice. Walk call 2 in full; call 3 is the same
shape compressed.

### Call 2 — learn the move (the Firecrawl read)

```ts
ring1 = Math.min(cv(t, 0.8, 1.1), cv(t, 2.8, 3.2, 1, 0));
card2 = {
  reveal: popIn(frame, fps, 1.3, 0.7),
  body:   cv(t, 1.5, 2.8),
  pulse:  Math.min(cv(t, 2.1, 2.4), cv(t, 3.3, 3.8, 1, 0)),
};
```

- **The chip rings** — up over **0.8→1.1s** (a fast ~0.3s rise), holds, down
  over **2.8→3.2s**. A ~2.4-second ring: long enough to feel like a call that
  takes a moment, framing the whole birth-and-capture inside it.
- **The card births** — `popIn` at **delay 1.3s, dur 0.7s**. It springs into
  slot 2 with a 26px drop (the shell offsets `top` by `−26·(1−reveal)`), so the
  card *falls into place* rather than fading on. Birth at 1.3s is **0.5s after
  the ring started at 0.8s** — cause (the call) visibly precedes effect (the
  card), both inside the one ring window.

> *"Why birth the card 0.5s into the ring instead of at the same instant?"* So
> the eye reads an order: the chip rings, *then* the card appears *because* of
> it. Simultaneous would read as a coincidence; 0.5s apart reads as causation.
> But it can't be much more than 0.5s either, or the two stop feeling like one
> event. That 0.3–0.5s ring→birth offset is the same in scene 3 and in both
> calls here — a fixed grammar.

- **The body fills** — `body = cv(t, 1.5, 2.8)`, a 1.3-second ramp starting
  0.2s after the shell lands. The shell drops first (chrome), *then* the
  skeleton lines stagger in within it — the same "chrome first, content after"
  read the product's own cards have. (Inside `PageCard`, the title bar reveals
  over the body's first 15–40%, then the five lines stagger at 0.11 offsets —
  so the page draws top to bottom.)

> *"Why separate `body` from `reveal` — why not fill content as the card drops?"*
> Because a card that arrives fully populated reads as a static asset that
> faded in, not as a page being *captured*. Splitting the shell's arrival from
> the content's reveal gives you the product's "result is loading in" feel —
> the structure lands, then fills. It's the same reason scene 1 of the
> market-desk video brings table chrome in before row text.

- **The capture pulse** — `pulse`, green ring up **2.1→2.4s**, down **3.3→3.8s**.
  It brackets the moment the body finishes filling: as the page finishes
  drawing, a green ring flashes around the card and fades. Green is the
  product's "ok / done" color — this card is now a *captured, kept* result.

> *"Why green, and why a transient flash rather than a held state?"* Green is
> the product's done-signal (same family as the agent's green ok-ring). A flash,
> not a hold, because the capture is a *moment* — the instant the read
> completes — after which the card just rests as plain evidence. A permanently
> green card would read as "still doing something." The pulse says "captured!"
> once and lets the card go quiet.

Notice the choreography of the three transients: the ring is releasing
(2.8→3.2) at almost exactly the moment the capture pulse is firing (2.1→2.4 up,
3.3→3.8 down). The call ends as its receipt turns green — ring and pulse
overlap-decay, so "the call finished" and "the evidence is kept" land as one
smooth handoff rather than two separate blinks.

### Call 3 — the move repeats, ~1.6× tempo

```ts
ring2 = Math.min(cv(t, 4.0, 4.25), cv(t, 5.5, 5.85, 1, 0));
card3 = {
  reveal: popIn(frame, fps, 4.3, 0.6),
  body:   cv(t, 4.45, 5.4),
  pulse:  Math.min(cv(t, 4.9, 5.2), cv(t, 6.1, 6.6, 1, 0)),
};
```

Same four parts, every window compressed:

| | Call 2 | Call 3 | change |
|---|---|---|---|
| ring up | 0.8→1.1 (0.3s) | 4.0→4.25 (0.25s) | faster |
| ring total | ~2.4s | ~1.85s | shorter |
| card popIn dur | 0.7s | 0.6s | snappier |
| body ramp | 1.5→2.8 (1.3s) | 4.45→5.4 (0.95s) | ~1.4× faster |
| ring→birth offset | 0.5s | 0.3s | tighter |

The ring→birth offset stays in the 0.3–0.5s grammar; everything else tightens.
The result reads, with no word on screen, as **"routine now."** The first read
was deliberate and a little slow — you're learning the move. The second is
brisk — the agent has done this; it's fluent.

> *"Where does the ~1.6× come from — is it derived?"* It's chosen, not derived,
> but chosen against a feel: too close to call-2's tempo and the repeat reads as
> identical (no momentum); too fast and the second card births before the eye
> has finished reading the first capture. ~1.4–1.6× is the band where the
> repeat is visibly quicker yet still legible as the same gesture. The
> principle is the transferable part: **repetition reads as fluency, and a
> measured acceleration on the repeat reads as momentum.** (Scene 5's three
> plan-captures use the same trick with shrinking gaps.)

> *"Why two reads and not three or four?"* Two is the minimum that makes a
> pattern — one is an instance, two is a rhythm. The script's run economy is
> deliberate: Exa finds (1 call), Firecrawl reads (2 calls — *just enough* to
> establish "per source"), Browser Use acts (1 call). Four cards, four calls,
> no decorative slots. A third Firecrawl read would be padding; it would teach
> nothing the second didn't.

### The hold — ~6.6s to the cut

After card 3's pulse falls out (by 6.6s), nothing moves. The live ring burns,
three cards sit in the rail, ~2.4s of stillness to the boundary.

> *"Isn't that dead air?"* No — the hold carries an *unresolved* state: the live
> ring is still on, which means the run isn't done. A still frame that holds
> tension (the agent is mid-flight, more is coming) is not dead; it's a held
> breath. It's also what lets the scene stretch to fit narration — a scene that
> ends on a settled, animation-free state can be extended to any VO length
> without freezing a motion halfway. (In the shipped cut, VO stretches this
> scene's tail to ~13.6s total.)

## How to think about the whole scene

Walk the decisions and each one answers a question:

1. *What's the move?* A tool call → show it on two surfaces (chip ring +
   card birth), in sync, cause-before-effect.
2. *Which tool, and why twice?* Firecrawl reads pages → the agent reads two
   sources, so the chip rings twice (`Math.max` of two windows on one chip).
3. *How do I show "the same move, now routine"?* Repeat it ~1.6× faster →
   acceleration reads as fluency, no caption needed.
4. *What's in the captured cards?* The *shape* of a page, never its words →
   seeded skeleton lines (no real artifact, stay honest).
5. *How do I keep the run feeling continuous?* Carry the live ring flat-on and
   re-declare card 1 at rest → the rail grows, nothing else changes.
6. *Where does the scene rest?* On a held, unresolved state (ring still on) →
   stretchable for VO, tension preserved into scene 5.

There's no single clever move — the quality is the same gesture rendered twice
with the right tempo lift, on a world that's carried in whole. Restraint, plus
one rhythm done well.

## Exit state (what scene 5 inherits)

`chain present · Research LIVE ring held (carried from scene 3, still on) ·
cards 1–3 at rest in slots 0–2 (search + two page reads, all `reveal: 1`,
pixel-static) · slot 4 empty · all transients (both chip rings, both capture
pulses) released by ~6.6s`. Scene 5 opens on exactly this frame: the Browser
Use chip rings and *holds*, the world dims to 0.35 (except the live Research
ring), and the live-session viewport rises center-frame — to eventually fold
into that empty slot 4 as card 4. Because both scenes render the same `<Rig/>`
with the live ring and cards 1–3 carried, the boundary is identical by
construction.

<!-- ── browser-agent / 05-hands-on-the-web.md ── -->

# Scene 5 — `hands-on-the-web`  ·  archetype: **live set piece** (zoom-aside + zoom-through-reverse exit)

Source: `../source/scenes/HandsOnTheWebScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md` (scene 5), `../CHOREOGRAPHY.md`
(scene 5).

This is the centerpiece of the whole video — the one scene everything else is
built to set up. The first four scenes assemble a chain, hand it a toolbelt,
and watch it search and read pages. This scene is the payoff: a *live browser
session* you can actually watch — a real viewport, a cursor moving and
clicking, a page reacting — and then that whole session folding down into one
more evidence card. Read it as a worked example of the hardest thing this
project does: animate a live product surface honestly, with continuity that
can't break. Every choice below is one you'll make again the first time you
build a set piece of your own.

---

## What this scene is for

The video's thesis is "give an agent web tools and one prompt and it goes out
and works the web — and every tool call comes back as a captured result the
workflow keeps." Scenes 3 and 4 taught the easy half of that: *find* (search)
and *read* (scrape). Both are invisible reaches — a chip rings, a card is born,
done. This scene teaches the hard half: **some pages can't be read, they have
to be *used*** — and that means there is nothing to abstract away. You have to
show hands on the web: a browser, a cursor, a click, a page responding.

So the scene does exactly one idea — *the agent drives a real browser session*
— and it has to make two things land at once without ever feeling like two
ideas:

1. **This is live.** A genuine browser viewport, a cursor that moves and
   clicks, a page that reacts. It reads as a session you're watching, not a
   diagram of one.
2. **This is still one tool call.** Everything you watch is a single Browser
   Use call, and when it finishes it becomes the fourth evidence card in the
   same rail the other three sit in — no different, in the end, from the search
   card or the page cards.

The tension the scene rides is *liveness vs. continuity*. A live session wants
to be a special, cinematic, full-screen moment. The rail discipline wants it to
be one more receipt. The scene's whole craft is being both: it rises center-frame
as a hero, then **folds** back into a rail slot, and the fold is what reconciles
them. Hold onto that — the fold is the scene.

## What it looks like

The Browser Use chip on the agent rings and *holds*. The rest of the world —
Start, Response, the edges, the three cards already in the rail — dims to 0.35.
A browser viewport rises into center frame: dark chrome (traffic lights, a
skeleton URL pill, the Browser Use glyph), a wireframe landing page underneath.
An arrow cursor fades in, eases up to a "Pricing" nav item, clicks (a ripple
rings outward), and the page dip-swaps to a pricing layout — three plan-card
wireframes. The cursor then visits each plan in turn — click, ripple — and on
each, the title-and-price region glows selection-blue and settles green,
keeping a faint green residue. The cursor leaves. Then the entire viewport —
chrome, page, green residues and all — scales and glides down into rail slot 4,
landing as evidence card 4 with the same green capture pulse the other three
cards got. The world undims. The agent's live ring never releases.

## The one real decision: render the live session as the *product's own surface*, then fold it into the rail

The scene renders the one shared set piece (`<Rig/>`) plus one overlay
(`<SessionViewport/>`):

```tsx
<Rig
  start={{dim}}
  agent={{highlighted: true}}
  response={{dim}}
  edge1={{dim}}
  edge2={{dim}}
  toolsReveal={1}
  chips={{browser: {ring: browserRing}}}
  cards={[{reveal: 1, dim}, {reveal: 1, dim}, {reveal: 1, dim}, {hidden: true}]}
/>
<SessionViewport state={viewport} />
```

Three things to take from this.

**The viewport is the product's own surface, not an invention.** Browser Use is
genuinely agentic in Sim — its block outputs a `liveUrl`, documented as
"Embeddable live browser session URL (active during execution)." So the thing
on screen is *that*: the live session URL rendered as a browser. You are not
designing "what a browser agent might look like"; you are showing the surface
the product literally emits. This is the port-don't-design rule applied to the
hardest possible case — a thing that feels custom is still grounded in a real
product output.

**The whole world is still rendered — just dimmed, not removed.** Start,
Response, the edges, and cards 1–3 all stay mounted at `dim` (0.35). This is
the same continuity discipline scene 1 used by keeping the chain `hidden` but
present: the agent keeps its `highlighted: true` live ring through the entire
session, so even while the browser is the hero, *the agent is visibly the actor
behind it.* You're never tempted to read the session as a free-floating thing;
it's tethered to the block that called it.

**Slot 4 is `hidden` on the Rig — because this scene *owns* slot 4.** Look at
the cards array: slots 0–2 are at rest (`reveal: 1, dim`), but slot 3 is
`{hidden: true}`. That's deliberate. The fourth evidence card doesn't exist yet
as a Rig card — it's *being made*, right now, out of the viewport. The viewport
will fold down and *become* slot 4. If the Rig also drew a card there, you'd
have two things in one slot at the fold. So the scene takes the slot away from
the Rig for the duration and hands it back, filled, at the end (scene 6 renders
slot 4 as a normal card again).

> *"Why fold the viewport into the slot instead of just fading the viewport out
> and fading a card in?"* Because a crossfade is a cut in disguise — it says
> "here is a session; now, separately, here is a card about it." The fold says
> something stronger and truer: *the session **is** the card.* The same pixels
> that were the live browser become the receipt. That's the equation the whole
> video is built on — every tool call comes back as a captured result — and the
> set piece is where that equation has to be most convincing, because the live
> session is the call that least *looks* like it could be reduced to a card. Make
> the reduction literal — same pixels, one continuous scale — and the viewer
> believes it without a word.

## How the fold is continuity-by-construction (read this before the timing)

This is the load-bearing geometry of the scene, and it's all in `layout.ts`:

```ts
export const CARD_W = 330;          // a rail slot is 330×200
export const CARD_H = 200;
export const VIEW_SCALE = 2.3;
export const VIEW_W = CARD_W * VIEW_SCALE;   // 759
export const VIEW_H = CARD_H * VIEW_SCALE;   // 460
export const VIEW_RECT = {x: 580.5, y: 552, w: VIEW_W, h: VIEW_H};
```

The viewport is designed at **exactly the rail-slot aspect ratio, scaled up
2.3×.** A slot is 330×200; the viewport is 759×460 — the same 1.65 aspect. That
is the entire trick. Because the big viewport and the small slot are the same
shape, the fold is a **single uniform scale** — every interior element travels
by the same factor, so *nothing reflows.* In `SessionViewport`:

```ts
const fx = interpolate(fold, [0, 1], [VIEW_RECT.x, target.x]);
const fy = interpolate(fold, [0, 1], [VIEW_RECT.y, target.y]);
const k  = interpolate(fold, [0, 1], [1, CARD_W / VIEW_W]);   // 1 → 0.4347…
```

The interior is laid out once at `VIEW_W × VIEW_H` and wrapped in
`transform: scale(${k})` with `transformOrigin: "top left"`; the outer box is
`VIEW_W * k × VIEW_H * k`. At `fold = 0` that's the full viewport at
center-frame; at `fold = 1` it's `759 × 0.4347 = 330` wide, `460 × 0.4347 = 200`
tall, sitting at `slotRect(3)` — pixel-exact on the slot every other scene reads.

> *"Why 2.3× and not, say, 3× or 2×?"* It's chosen against two pressures. Too
> small (say 1.5×) and the hero viewport isn't big enough to feel like a real
> session you're watching — the cursor, the plan cards, the click ripples all
> get cramped and the "liveness" doesn't read. Too big (say 3×) and the
> viewport starts crowding the dimmed chain above it and the rail below, and the
> fold becomes a long dramatic shrink that draws attention to itself as an
> *effect* rather than reading as "filing the result." 2.3× lands the viewport
> at 759×460 — large enough to host a believable cursor-and-click performance,
> small enough to sit cleanly in the reserved center space between chain and
> rail. And critically, **whatever you pick, it must be a clean multiple of the
> slot** — that's non-negotiable, because the aspect-match is what makes the
> fold reflow-free. 2.3 was tuned for size; the *integer-aspect* constraint is
> the real rule.

> *"Why `transformOrigin: top-left` and interpolate `x`/`y` separately, instead
> of scaling about the center?"* Because the landing target is a *specific rect*
> (`slotRect(3)`), not "wherever the center ends up." Driving `x`, `y`, and `k`
> independently lets the fold path end exactly on the slot's top-left corner
> with exactly the slot's dimensions — no trig, no drift. Scaling about center
> would land the viewport centered on the slot's center, which is the same
> place only if your arithmetic is perfect; this way the arithmetic is the
> interpolation and can't be off.

> *"The border radius does something odd —`borderRadius: 8 / Math.max(k, 0.001)`.
> Why divide?"* Because the radius lives *inside* the `scale(k)` transform, so it
> gets multiplied by `k` when rendered. To land at a real 8px radius (the house
> card radius `r8`) after the scale, you pre-divide by `k` so that `8/k × k = 8`.
> At `fold = 0`, `k = 1` and the radius is a plain 8 on the big viewport; at
> `fold = 1` the same machinery keeps it at 8px on the card. Without this the
> card corners would round at ~3.5px and not match the other three cards. The
> `Math.max(k, 0.001)` is just a divide-by-zero guard for the degenerate case.

> *"And the drop-shadow — `boxShadow: fold < 0.5 ? '…' : 'none'`?"* The big
> viewport floats as an overlay above the dimmed world, so it carries a soft
> drop-shadow to read as "lifted." A rail card does *not* float — it sits flush
> in the strip with the other three. So the shadow is switched off at the fold
> midpoint: while it's still mostly an overlay it's lifted; once it's mostly a
> card it's flush. The cut is hidden inside the motion, at the moment your eye
> is tracking the scale, not the shadow.

## The cursor rig — how the hands move

The cursor is the soul of "liveness," so it's worth reading the rig carefully.
It's an SVG arrow (`Cursor`), positioned by `left`/`top` in viewport page
coordinates, and it moves by **eased segments between waypoints** — never a
straight constant-velocity slide. The waypoints, in viewport coords, are:

```
entry (380, 300) → Pricing nav (700, 40) → plan 1 (165, 95)
                 → plan 2 (387, 95) → plan 3 (609, 95)
```

The motion is built from a single helper that the scene defines inline:

```ts
const seg = (lo, hi, a, b) =>
  interpolate(t, [lo, hi], [a, b], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut});
```

`seg` eases one coordinate from `a` to `b` over the time window `lo→hi`, with
`EASING.inOut` (the bezier `0.65, 0, 0.35, 1` — slow out of rest, fast in the
middle, slow into the target). Then `cx` and `cy` are piecewise functions of
`t`, switching which segment is active by time:

```ts
const cx =
  t < 5.6 ? seg(3.4, 4.3, 380, 700)
  : t < 7.6 ? seg(5.6, 6.6, 700, 165)
  : t < 9.2 ? seg(7.6, 8.4, 165, 387)
  : seg(9.2, 9.9, 387, 609);
const cy =
  t < 5.6 ? seg(3.4, 4.3, 300, 40) : t < 7.6 ? seg(5.6, 6.6, 40, 95) : 95;
```

A few things to notice.

**`x` and `y` are eased *together* over the same windows, so the cursor travels
on a curved diagonal, not in an L.** The first move (`3.4→4.3`) eases `x`
380→700 *and* `y` 300→40 simultaneously: the cursor swoops up-and-right to the
nav item in one gesture. If you eased `x` then `y`, the cursor would crawl along
edges like a maze-solver — instantly robotic. Co-eased coordinates read as a
hand.

**After the page swaps, `y` snaps to a constant 95 and only `x` moves.** The
three plan cards are in a row at the same height (`y = 95`), so visiting them is
pure horizontal travel — `cy` returns the literal `95` past `t = 7.6` with no
interpolation. The cursor slides left-to-right across the three plans. This is
correct and intentional: real cursor motion across a row of equal-height targets
*is* mostly horizontal.

> *"Why `EASING.inOut` for the cursor and not `EASING.out`?"* Because the cursor
> both *leaves* a resting target and *arrives* at the next one — it has rest at
> both ends. `EASING.out` (fast-then-slow) is for things entering from nothing,
> where there's no "leaving" to animate. A cursor that's been sitting on the nav
> item and is about to sit on a plan card should accelerate out of stillness and
> decelerate into stillness — that's `inOut`. Using `out` would make every move
> start at full speed, like the cursor was flicked. The project's easing rule is
> exactly this: `inOut` for transforms and moves, `out` for entrances. The
> cursor is a move.

> *"Why are the waypoints in 'viewport page coordinates' (700, 40 etc.) and not
> stage coordinates?"* Because the cursor lives *inside* the viewport's interior,
> which is laid out at `VIEW_W × VIEW_H` and then scaled by `k`. By authoring the
> cursor in interior coordinates, it rides the fold for free — but in this scene
> the cursor has already faded out before the fold begins (more below), so what
> this really buys is simplicity: the cursor's targets are the same numbers as
> the nav item and plan cards it's pointing at, because they're in the same
> coordinate space. The nav `Bar` is drawn near the top-right of page A; the
> cursor's nav target is (700, 40) — the same place, same space.

**The cursor fades, it doesn't teleport, and it leaves *before* the fold:**

```ts
const cursorOp = Math.min(cv(t, 3.2, 3.6), cv(t, 11.6, 12.1, 1, 0));
```

It fades in over 3.2→3.6s and fades out over 11.6→12.1s — and the scene only
renders it while `cursorOp > 0` (`cursor: cursorOp > 0 ? {…} : null`).

> *"Why make the cursor leave at 12.1, before the fold starts at 12.6?"* This is
> a subtle, important beat. If the cursor were still on screen when the viewport
> folded, the fold would read as *the cursor dragging the window into the rail* —
> as if the hands were doing the filing. But the filing isn't a hand gesture;
> it's the *system* recording the result. So the hands finish their work
> (clicking the three plans) and *leave*, and only then — with the session
> sitting there, captured, unattended — does it fold itself away. The half-second
> gap (12.1 → 12.6) is the difference between "the cursor put it away" and "the
> system filed it." That half second is doing real semantic work.

## How a click lands — the ripple and the consequence

A click is two things on screen: a **ripple** (the feedback that a click
happened) and a **consequence** (what the click did) — and the scene is
scrupulous about never letting them be simultaneous.

The ripples are four entries, each a click point with a progress value:

```ts
const ripples = [
  {x: 700, y: 40, p: cv(t, 4.3, 4.75)},   // the Pricing nav click
  {x: 165, y: 95, p: cv(t, 6.7, 7.15)},   // plan 1
  {x: 387, y: 95, p: cv(t, 8.5, 8.95)},   // plan 2
  {x: 609, y: 95, p: cv(t, 10.0, 10.45)}, // plan 3
];
```

Each `p` ramps 0→1 over a ~0.45s window. The viewport renders the ripple as an
expanding, fading ring:

```ts
if (rp.p <= 0 || rp.p >= 1) return null;       // only visible mid-click
const r = 6 + 26 * rp.p;                        // radius grows 6 → 32px
border: `2.5px solid rgba(51, 180, 255, ${0.9 * (1 - rp.p)})`,  // fades as it grows
```

So a click is a 2.5px selection-blue ring that starts at 6px radius and expands
to 32px while fading to nothing — the universal "tap" feedback, in the product's
own selection-blue (`rgba(51,180,255)`). It only exists for that ~0.45s window;
at `p ≤ 0` or `p ≥ 1` it renders nothing, so it never lingers.

> *"Why does the ripple expand *and* fade at the same time?"* Because that's the
> physics your eye already knows from every touchscreen and every macOS click —
> a disturbance radiating out and dissipating. Expanding-only would read as a
> growing circle (a target, a loading state); fading-only would read as a
> blinking dot. The combination — `r` up, opacity `0.9 * (1 - p)` down — is
> unambiguously "a click happened *here*, just now." It's 6px at birth (a
> point, where the cursor tip is) and 32px at death (spread out, gone), so it
> reads as originating exactly under the cursor.

Now the **click-then-consequence ordering.** Watch the first click against the
page swap:

```ts
const page = cv(t, 4.6, 5.4);            // page A → page B (pricing)
// ripple at the nav:  cv(t, 4.3, 4.75)
```

The nav ripple starts at **4.3**; the page begins swapping at **4.6** — a 0.3s
gap. Click first, *then* the page changes. The same ordering holds for the plan
captures: the cursor arrives, the ripple fires, and only after does the
plan's region glow. Cause visibly precedes effect, every time, by about a third
of a second.

> *"Why 0.3s and not simultaneous, or instant?"* Simultaneous reads as
> coincidence — the page just *happened* to change when the cursor was there.
> Instant (0.0s) reads as a hard cut and loses the causal beat. ~0.3s is the
> sweet spot where the eye registers the click as *the cause*: it sees the
> ripple, and a beat later the world responds *to* it. This is the same
> ring=card-birth discipline from scenes 3–4 (cause before effect, both clearly
> one event) applied to the cursor: click before consequence, both clearly one
> event.

## How the page reacts — the dip-swap

The page doesn't cut from landing-page to pricing-page; it **dips through black
and back**, swapping content at the bottom of the dip:

```ts
const pageDip = Math.min(1, Math.abs(page - 0.5) * 4);   // page opacity
const isPricing = page >= 0.5;                            // which layout
// …page area:  opacity: pageDip
```

`page` ramps 0→1 over 4.6→5.4s. `pageDip` is the page-area opacity: it's
`|page − 0.5| × 4` clamped to 1, which is a **V** — full opacity at `page = 0`,
*zero* opacity at `page = 0.5` (the midpoint), full opacity again at `page = 1`.
And `isPricing` flips from the landing wireframe to the pricing layout exactly
at `page = 0.5` — i.e. at the bottom of the dip, when the page is invisible.

> *"Why dip to black instead of crossfading the two pages?"* Two reasons. First,
> a crossfade would briefly show landing-page and pricing-page *superimposed* —
> a muddy double-exposure that no real browser ever produces. A real page
> navigation blanks and repaints; the dip-to-black-and-back is exactly that
> repaint, abstracted. Second, swapping the layout at `pageDip = 0` means **the
> swap is never visible as a swap** — the hard switch from one DOM to another
> happens while the page is at zero opacity, so you never catch the layout
> "popping." You see: page fades down, page fades up, and it's different now.
> That's how navigation feels. The `× 4` makes the dip *fast* (the page is only
> near-invisible for a brief window around the midpoint) so it reads as a snappy
> reload, not a slow dissolve.

The two page layouts are both wireframes, by declared design (no real run
artifact exists). Page A is a landing page — a nav row with a deliberately
brighter "Pricing" `Bar` (op 0.55, `textTertiary`) that is *the cursor's first
target* — plus a centered hero block. Page B is the pricing page: a title bar
and three `PlanCard` wireframes in a row. Nothing on either page is readable
text; it's all seeded skeleton bars. That's the same honesty rule the cards
follow — **the page shows the *shape* of a pricing page, never invented prices**
— justified by the registry's own authored Browser Use task ("go to the pricing
page and collect every plan name and monthly price").

## How a capture lands — blue glow → green settle → kept residue

Each of the three plans gets captured, and a capture is a two-phase event:
**read it** (selection-blue) → **keep it** (green), with the green *never
decaying fully back to zero.* The captures array:

```ts
const captures = [
  { glow:  Math.min(cv(t, 6.8, 7.2),  cv(t, 7.8, 8.2, 1, 0)),
    green: Math.min(cv(t, 7.8, 8.4),  cv(t, 9.4, 10.0, 1, 0.25)) },   // plan 1
  { glow:  Math.min(cv(t, 8.6, 9.0),  cv(t, 9.5, 9.9, 1, 0)),
    green: Math.min(cv(t, 9.5, 10.1), cv(t, 10.9, 11.5, 1, 0.25)) },  // plan 2
  { glow:  Math.min(cv(t, 10.1, 10.5),cv(t, 11.0, 11.4, 1, 0)),
    green: Math.min(cv(t, 11.0, 11.6),cv(t, 12.2, 12.8, 1, 0.25)) },  // plan 3
];
```

Each `glow` is a `Math.min(up, down)` wave — rises over ~0.4s, holds, falls to
zero. Each `green` is also a wave, but its *down* leg interpolates to `0.25`,
not 0 — so after the green settles, a quarter-strength residue stays. The
`PlanCard` renders both over the title+price region:

```ts
backgroundColor: `rgba(51, 180, 255, ${0.16 * capture.glow})`,        // blue read
boxShadow:       `inset 0 0 0 999px rgba(34, 197, 94, ${0.13 * capture.green})`,  // green keep
```

So on plan 1: at ~6.8s the title-and-price region fills selection-blue (*the
agent is reading this region*); at exactly **7.8s** the blue starts releasing
and the green starts rising — the handoff is instantaneous and simultaneous —
and by ~9.4s the green decays not to nothing but to 0.25, a faint permanent
green wash on that region. That residue is the point: **the card keeps showing
*what* was captured.**

> *"Why hand blue off to green at the *same instant* (7.8) rather than letting
> blue fully fade and then bringing green up?"* Because reading-and-keeping is
> one continuous act, not two. If blue fully cleared before green appeared,
> there'd be a gap where the region is neutral — a beat of "nothing captured
> here" between the read and the keep. Crossing them at one instant says: the
> moment it finished reading is the moment it had captured. Blue *becomes*
> green. This is the exact ResolvedTag discipline — the value is being resolved
> in place, and the color *is* the state machine: live-blue → done-green.

> *"Why does the green decay to 0.25 instead of staying full or going to zero?"*
> Going to zero would mean the capture *un-happened* — the region would look
> untouched, and the card would carry no memory of what it grabbed. Staying full
> green would scream "ACTIVE / just now" forever, even minutes later in the
> bookend. 0.25 is *residue* — strong enough that you can always see "these
> three regions are the captured ones," faint enough that it reads as
> settled-history rather than live-action. It's provenance: a quiet, permanent
> mark of *what this evidence is.* And it has to survive the fold (those green
> washes ride down into the card), which is why `SESSION_FINAL` in the rig hard-codes
> exactly `green: 0.25` on all three plan regions — the at-rest card *is* the
> session with its residue.

> *"Why do the three captures accelerate — gaps of 1.8s then 1.5s?"* Same tempo-lift
> idea scenes 3–4 used: the first capture is taught slowly (cursor travels
> `5.6→6.6`, the move is shown in full), and each subsequent one is a touch
> faster — travel windows and gaps both shrink. Repetition reads as *fluency*;
> acceleration reads as *momentum*. By plan 3 the viewer isn't learning the
> gesture anymore, they're watching a competent thing finish a routine. You
> never write "and it does this for each plan" — the shrinking cadence says it.

## The animation, beat by beat

The scene's clock is `t = frame / fps` (seconds into the scene). Two helpers
carry everything: `cv(t, lo, hi, a=0, b=1)` is a clamped interpolate (linear
ramp from `a` to `b` as `t` crosses `lo→hi`), and `popIn(frame, fps, delay, dur)`
is the spring entrance (damping 14 / stiffness 160) that clamps to *exactly* 1
afterward so boundary frames stay pixel-static. `Math.min(cv(up), cv(down))` is
the wave idiom — rise, hold, fall — used for every ring and glow.

### (a) The chip rings up early and *holds* the whole session — `browserRing = Math.min(cv(t, 0.5, 0.9), cv(t, 14.4, 15.0, 1, 0))`

The Browser Use chip on the agent rings up over 0.5→0.9s and does not release
until 14.4→15.0s — a ~14-second held ring, releasing only *after* the fold has
landed (the fold completes at 14.0).

> *"Why hold one ring for fourteen seconds when every other tool call's ring was
> ~2 seconds?"* Because everything you watch — navigate, click, swap, capture
> three plans, fold — is **one Browser Use call.** In scenes 3–4, a call was
> instantaneous from the viewer's side: ring, card, done. Here the call has
> *duration you can see* — that's the whole novelty of a live session. A single
> unbroken ring spanning the entire session is the visual sentence "this is all
> one tool call." If the ring blinked per click, you'd read four calls; one
> continuous ring says one call that happens to take a while. And it releases
> only *after* the fold so that the chip is still lit while the result is being
> filed — the call isn't "done" until the evidence is in the rail.

### (b) The world dims, and undims during the landing — `dim = Math.min(cv(t, 0.9, 1.6), cv(t, 13.6, 14.3, 1, 0))`

Everything that isn't the working agent — Start, Response, edges, cards 1–3 —
dims to 0.35 over 0.9→1.6s, and *undims* over 13.6→14.3s. The agent itself keeps
its live ring and is never dimmed.

> *"Why undim *during* the fold (13.6→14.3) rather than after it (>14.0)?"* The
> fold runs 12.6→14.0. The undim runs 13.6→14.3 — it *overlaps* the back half of
> the fold. That overlap is the beat: as the session glides down into the rail,
> the room lights come back up *around* it. The metaphor is "the agent steps out
> of its focused work and the desk reappears, now with one more receipt on it."
> If you undimmed strictly after the fold, you'd get a dead beat — landed card,
> then a separate lights-up — two events. Overlapping them makes the filing and
> the return-to-normal one continuous motion: the world reassembles *as* the
> evidence lands.

### (c) The viewport rises — `reveal = popIn(frame, fps, 1.4, 0.8)`

The viewport springs in starting at 1.4s over 0.8s, with a 30px upward drop-in
(`top: fy - 30 * (1 - reveal)`) and an opacity ramp (`Math.min(1, reveal * 1.3)`).

> *"Why start the rise at 1.4, after the dim (0.9→1.6) has begun but not
> finished?"* So the rise reads as *caused by* the dim, not concurrent with the
> chip ring. Order of events: chip rings (0.5) → world starts dimming (0.9) →
> viewport rises into the cleared space (1.4). Each is a beat apart, so the
> viewer reads a chain — *the tool is called, the room makes space, the session
> appears* — rather than three things flashing at once. Stacking them on the
> same frame is the fastest way to make a set piece feel busy; staggering by
> half-beats is what makes it feel composed.

> *"Why `popIn` (a spring) for the viewport but plain `cv` ramps for the glows
> and rings?"* Because the viewport is a *physical object entering the frame* —
> a window rising into place — and a spring's slight organic overshoot-and-settle
> is exactly how a surface should arrive. Glows and rings aren't objects, they're
> *states* (something is active / being read), and a state should ramp cleanly,
> not bounce. `popIn` for things that move through space; `cv` for things that
> change intensity. Same division as easing-for-travel-only in scene 1.

### (d) The cursor performs — fades in 3.2→3.6, navigates and clicks, fades out 11.6→12.1

Covered in detail in the cursor and click sections above. The arc, in time:
fade in (3.2) → swoop to nav (3.4→4.3) → click nav (4.3) → page swaps (4.6→5.4)
→ visit plan 1 (5.6→6.6), click (6.7), capture (6.8→) → plan 2 (7.6→8.4), click
(8.5), capture (8.6→) → plan 3 (9.2→9.9), click (10.0), capture (10.1→) → fade
out (11.6→12.1). The hands arrive, work, and leave — and the leaving is what
licenses the fold to read as the system filing the result.

### (e) The fold — `fold = eased interpolate over [12.6, 14.0]`

```ts
const fold = cv(t, 12.6, 14.0) === 0 ? 0 : interpolate(t, [12.6, 14.0], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut,
});
```

The signature move. `fold` eases 0→1 over 12.6→14.0s with `EASING.inOut`, and
that single value drives `fx`, `fy`, and `k` (position and scale) in
`SessionViewport`, plus the shadow cut at 0.5. The whole viewport — chrome,
pricing page, the three green residue washes — uniformly scales and glides from
center-frame onto rail slot 4. Nothing reflows (the aspect-match guarantees it);
the residues ride down intact and *are* the card's content.

> *"Why the `cv(...) === 0 ? 0 : interpolate(...)` shape — why not just the eased
> interpolate?"* It's a guard so the value is *exactly* 0 before 12.6, not a
> floating-point near-zero. Before the fold, the viewport must sit pixel-static
> at `VIEW_RECT` (the boundary from scene 4's continuity isn't at issue here, but
> the held session frame is): an eased interpolate clamped left still returns
> exactly 0 at its left edge, but the explicit `=== 0 ? 0` makes the *intent*
> unmistakable and bulletproofs the at-rest frame against any easing-curve
> rounding. It's the same discipline as `popIn` clamping to exactly 1 — transient
> machinery must land on exact integers at its rest states or boundary frames
> drift.

> *"Why `EASING.inOut` for the fold?"* Because the fold is a *move* of an object
> from one resting place (center overlay) to another (the rail slot) — rest at
> both ends. Slow out of center, travel, slow into the slot. `EASING.out` would
> launch it at full speed (flicked away); `EASING.in` would end at full speed
> (slammed in). `inOut` is the only curve that makes a window glide gracefully
> from A to B, and it matches the project's move-easing rule exactly.

### (f) The land pulse — `landPulse = Math.min(cv(t, 14.0, 14.3), cv(t, 15.0, 15.5, 1, 0))`

The instant the fold lands (14.0), a green capture ring pulses on slot 4 — rises
over 14.0→14.3, holds, releases 15.0→15.5 — drawn as an inset 2.5px green
(`rgba(34,197,94)`) ring on the slot rect, the *same* green capture pulse cards
1–3 got when they were born.

> *"Why give the folded session a capture pulse at all — it already has the green
> residues?"* Because this is the rhyme that closes the scene's argument. Every
> other card announced its birth with one green capture-ring pulse (scene 3,
> scene 4 ×2). The session is the fourth card; it gets the identical pulse at the
> identical moment in its life (the instant it lands in its slot). The residue
> washes say *what* was captured (provenance, permanent); the land pulse says
> *a capture just completed here* (event, transient) — and it's the exact same
> event the other three cards had. With that pulse, the live browser session —
> the call that least looked reducible — is unmistakably just evidence card 4.
> The set piece's whole job is to make that equation undeniable, and the
> borrowed pulse is the last brushstroke.

### (g) The hold — from ~15.5s to the end of the scene

After the land pulse releases (15.5) and the ring releases (15.0), the scene
holds ~4.8s (15.5→20.3 per the VO stretch) on the full assembled state: the
agent's live ring still burning, all four cards in the rail. Nothing moves.

> *"Isn't a 4.8-second still hold dead air right after the payoff?"* It carries
> an *unresolved* state, which is what keeps it alive — the agent's live ring is
> still lit. The run isn't done; the agent has its four pieces of evidence and is
> (about to be) assembling them. So the hold reads as held tension — "it has
> everything it needs; now what?" — which is exactly the question scene 6
> answers. And, as in scene 1, ending on a settled state with no animation
> mid-flight is what lets the scene *stretch* to fit the voiceover safely: the
> only thing in motion (the live ring) is a steady pulse with no start or end to
> freeze. A held, settled tail is what makes the audio step downstream painless.

## How to think about the whole scene

Walk the decisions in order and each one answers a question the previous one
raised:

1. *What is a "live browser session," honestly?* The product's own `liveUrl`
   surface → render a real browser viewport, not a designed one.
2. *How do I make it the hero without abandoning the rail discipline?* Dim the
   world, rise center-frame — but design the viewport at the rail-slot aspect so
   it can fold back in.
3. *How does it read as still being one tool call?* One Browser Use chip ring,
   held ~14s across the entire session → one ring, one call.
4. *How do hands move like hands?* Co-eased `x`/`y` waypoint segments with
   `EASING.inOut` → curved, decelerating travel, never an L-shaped crawl.
5. *How does a click read as a click?* A blue ripple that expands-and-fades at
   the cursor tip, then the consequence ~0.3s later → cause before effect.
6. *How does the page react?* A fast dip-to-black with the layout swapped at the
   invisible midpoint → a repaint, never a muddy crossfade.
7. *How does a capture read?* Blue read → green keep at one instant → a 0.25
   residue that stays → the card remembers what it grabbed.
8. *How does the session become a receipt?* A single uniform fold onto slot 4
   (same pixels), the shadow cut at the midpoint, the world undimming during the
   landing, and the same green land-pulse every other card got → the session
   *is* evidence card 4, proven by construction.

There's no single clever move — the set piece is the sum of eight honest
decisions, each one a small refusal to fake it. The fold is the load-bearing
one, but it only works because the aspect-match was set up in `layout.ts` long
before any motion existed.

## Exit state (what scene 6 inherits)

`agent LIVE ring (never released — carried since scene 3) · world undimmed (back
to full) · four cards in the rail, all at rest and pixel-static · card 4 = the
folded session showing its three 0.25 green residues (the rig's `SESSION_FINAL`)
· no cursor, no viewport overlay, no ripples · Browser Use chip ring released`.
Scene 6 opens on exactly this frame: it re-renders slot 4 as a normal Rig card
(no longer `hidden`) carrying `SESSION_FINAL`, and begins glowing all four cards
in call order as the agent assembles its brief. Because both scenes render the
same set piece and the folded viewport landed pixel-exact on `slotRect(3)`, the
handoff from "viewport-that-became-card-4" to "Rig-card-4" is identical down to
the pixel — the residues are in the same place at the same strength on both
sides of the cut.

## Component-extraction candidate

The director wants the browser + cursor + click visuals replicated as reusable
components. Here's exactly what's reusable, what isn't, and what the components
should look like. Today all of this lives inline in `_rig.tsx` (the
`SessionViewport`, the inner `Cursor`, `PlanCard`, and the ripple loop) and in
`HandsOnTheWebScene.tsx` (the waypoint/segment math, the ripple/capture arrays).
Three components fall out cleanly.

### 1. `<BrowserSession>` — the viewport shell (high reuse)

The chrome and frame are entirely topic-agnostic and should be promoted to
`src/components/` as the canonical "live browser session" surface for any future
video that shows Browser Use (or any web-driving tool).

**Reusable as-is:** the dark chrome bar (traffic lights `#ff5f57 / #febc2e /
#28c840`, the skeleton URL pill, the tool identity chip slot), `surface2` frame
on `border1` at `r8`, the lifted drop-shadow, the page-area dip-swap mechanism,
and — critically — **the fold-to-slot geometry.**

**Proposed props:**
```ts
type BrowserSessionProps = {
  reveal?: number;          // popIn rise + opacity (rig keeps this)
  page: React.ReactNode;    // the page content — caller supplies the wireframe
  toolChip?: {color: string; glyph: React.ReactNode};  // identity chip in chrome
  cursor?: {x: number; y: number; opacity: number} | null;
  ripples?: {x: number; y: number; p: number}[];
  fold?: number;            // 0 = full viewport, 1 = folded into target slot
  foldTarget?: {x: number; y: number; w: number; h: number};  // the slot rect
  viewRect?: {x: number; y: number; w: number; h: number};    // at-rest rect
};
```

**Native metrics to preserve (non-negotiable):**
- **The aspect-match invariant.** `viewRect` must be `foldTarget` scaled by an
  integer-ish factor (here 2.3×) at the *same aspect ratio*. This is the entire
  reason the fold is reflow-free. The component should arguably *enforce* this —
  derive `viewRect` from `foldTarget × scale` so a caller can't accidentally
  break it.
- `CHROME_H = 56`, traffic-light dims (11px circles), URL pill (24px tall, r12,
  max-width 320, `surface1` on `border`), the 28px tool chip (r7, `border1`).
- The fold math verbatim: `fx/fy = interpolate(fold, [0,1], [viewRect, target])`,
  `k = interpolate(fold, [0,1], [1, target.w / viewRect.w])`, `transformOrigin:
  top-left`, `borderRadius: 8 / max(k, 0.001)`, shadow cut at `fold < 0.5`.
- The page dip: `pageDip = min(1, |pageProgress − 0.5| × 4)`, layout swap at the
  midpoint. This is reusable as a small `usePageDip(progress)` hook or a
  `<DipSwap a={…} b={…} progress={…} />` wrapper.

**Stays scene-specific:** the *page contents* (`page A` landing wireframe, `page
B` pricing layout, `PlanCard`) — those are this video's topic. `BrowserSession`
takes `page` as children; the pricing wireframe is the caller's business.

### 2. `<Cursor>` + a waypoint driver (high reuse)

The `Cursor` SVG (the classic arrow: `#fff` fill, `#1b1b1b` 1.4px stroke,
`strokeLinejoin: round`, 26px) is 100% reusable and should move up unchanged.
The *waypoint-segment easing* is the more valuable extraction — right now `cx`/`cy`
are hand-written piecewise ternaries in the scene, which is error-prone to
author. Promote a driver:

```ts
// useCursorPath(t, waypoints) → {x, y}
type Waypoint = {t0: number; t1: number; x: number; y: number};
// each leg eases x AND y together over [t0, t1] with EASING.inOut from the
// previous waypoint; holds at the last reached waypoint between legs.
```

**Native behaviors to preserve:** co-eased `x`/`y` (never sequential), `EASING.inOut`
on every leg (rest at both ends), and a hold (constant) between legs. The driver
should make "the cursor swoops on a diagonal and decelerates into each target"
the default, because that's what makes it read as a hand.

### 3. `useClickRipple` / `<ClickRipple>` (high reuse)

The ripple is a tiny, pure, fully reusable primitive:

```ts
// a click at (x,y) with progress p∈(0,1):
//   radius = 6 + 26*p ; border = 2.5px rgba(51,180,255, 0.9*(1-p)) ; hidden at p≤0||p≥1
```

**Native metrics to preserve:** the 6→32px expansion, the selection-blue
(`rgba(51,180,255)`), the `0.9*(1-p)` fade-with-expansion, and the render-nothing
guard outside `(0,1)`. Pair it with the project convention that the *consequence*
of a click trails the ripple by ~0.3s — that timing offset is a usage rule worth
documenting on the component, not a prop.

### Deliberately NOT extracted

- **The capture two-phase (blue→green→0.25 residue).** This is the
  evidence/provenance language shared with the cards (ResolvedTag lineage), not a
  browser concept. It belongs with the *card* grammar, not `BrowserSession`. If
  anything, factor a shared `useCaptureGlow(t, …)` that both the plan regions and
  the cards call — but keep it out of the viewport component.
- **`PlanCard` and the two page wireframes** — topic-specific (pricing), as above.
- **The held-chip-ring and world-dim orchestration** — those are scene-level
  staging (which blocks dim, how long the ring holds), not viewport behavior.

**Net:** three new primitives — `BrowserSession` (viewport shell + fold +
dip-swap), `Cursor` + `useCursorPath` (the hands), `ClickRipple` (the click) —
would let any future video stage a live browser session by supplying only the
page wireframe and a waypoint list, while the load-bearing invariants (aspect-match
fold, co-eased cursor, expand-and-fade ripple, click-then-consequence offset)
travel with the components instead of being re-derived each time.

<!-- ── browser-agent / 06-the-brief-comes-back.md ── -->

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

<!-- ── browser-agent / 07-the-evidence-trail.md ── -->

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

<!-- ── browser-agent / CHOREOGRAPHY.md ── -->

# browser-agent — choreography notes

**Verdict:** BEST TOOL-CALL VISUALS (hype reel 1: "the evidence filmstrip
accumulating in sync with each tool call; the live Browser Use session
folding into its own evidence card"). **Branch:** `hype/browser-agent`.
**Comp:** `browser-agent-v1` · 82.4s @ 60fps (VO-stretched: 8.7 / 11 /
13.6 / 9 / 20.3 / 9 / 10.8 per `public/vo/browser-agent-v1/manifest.json`).
**Run economy: 1** — a single Start→Response traversal spans scenes 3–6 via
held freeze-cuts (the agent's live ring never releases between calls);
inside it, four tool calls, each a distinct reach: FIND / READ / READ / ACT.
All times below are seconds into the scene.

## The one idea

Give an agent web tools and one prompt and it goes out and works the web —
and every tool call comes back as a captured result the workflow keeps. The
choreography's whole job is one equation, taught four times: **chip ring =
card birth**. Two surfaces, one event.

## The shared machinery

- `cv(t, lo, hi, a=0, b=1)` = clamped interpolate; `wave(t, a, b,
  ramp=0.35)` = glow that rises at `a`, holds, falls to zero by `b`. Chip
  rings are `Math.min(cv(up), cv(down))` pairs throughout.
- Evidence cards: `reveal` is `popIn(frame, fps, delay, dur)` (spring,
  damping 14 / stiffness 160) with a 26px drop (`top − 26·(1−reveal)`);
  `body` staggers skeleton rows in separately from the shell; `pulse` is a
  transient green capture ring on landing; `glow` is selection-blue
  ("the agent is reading this"). Cards at rest clamp to exactly 1 —
  pixel-static, never move again.
- The viewport is designed at `VIEW_RECT` = rail-slot 4 × 2.3 (same
  aspect), so the fold is a single uniform scale: `fx/fy/k` all
  `interpolate(fold, [0,1], [VIEW_RECT, slotRect(3)])`. Continuity by
  construction — the landed state IS the evidence card.
- No real run artifact exists, so all captured content is skeleton bars
  (seeded widths) — the filmstrip shows the SHAPE of evidence, never
  invented words.

## Scene 1: the-task (0–8.7s)

INTENT: a normal Sim workflow — one agent between Start and Response, told
to research whatever comes in. Nothing special yet, on purpose.
CAMERA: static full frame, chain at CHAIN_Y=250 with the empty rail space
below it — the layout silently reserves the filmstrip's room from frame 1.
CHOREOGRAPHY:
- Assembly in preview order, alternating block/wire: Start fades
  `reveal(0.4)` (0.5s, `EASING.out`) → edge 1 draws `reveal(1.1, 0.55)` →
  Research `reveal(1.7)` → edge 2 `reveal(2.5, 0.55)` → Response
  `reveal(3.1)`. Each wire starts ~0.6s before its destination block —
  the left-to-right causality wave.
- One beat of meaning: the `<start.input>` tag glows `wave(4.8, 6.4)` —
  up 0.35s, held ~1.2s under the narration naming the reference, released.
HOLDS: 6.4→8.7 (2.3s) on the assembled chain over `CanvasDots`. Under cap.

## Scene 2: the-toolbelt (8.7–19.7s)

INTENT: the toolbelt is a reach ladder — finds / reads / acts. The agent
gets hands here.
CAMERA: static; focus by the product's editing ring, not framing.
CHOREOGRAPHY:
- Selection ring on Research `t ∈ [0.6, 7.0)` brackets the whole growth —
  someone is editing this block.
- Tools row grows in at natural height `grow(1.0, 0.7)`; the Exa chip
  mounts at `grow(1.2)` — deliberately INSIDE the row reveal so the row
  opens straight to chip-line height (no 31.5→40px pop; the comment in the
  scene explains the trap).
- Chips land in sequence, each name introduced then RUNG: Exa reveal
  `grow(1.2)` then ring `wave(2.2, 3.2, 0.3)`; Firecrawl reveal
  `grow(3.0)` then ring `wave(3.8, 4.8, 0.3)`; Browser Use reveal
  `cv(5.0, 5.7)` then ring `wave(5.9, 6.9, 0.3)`. A steady ~1.8s cadence:
  appear, then pulse — the ring pre-teaches "ring = this tool is called"
  before any run exists.
- Wrap-line subtlety: Browser Use owns the chips' second line, so
  `toolsWrapReveal = cv(4.8, 5.4)` opens the LINE first and the chip FADES
  in at full width (`fade: true`) — width-growth would jump lines
  mid-reveal.
HOLDS: 7.0→11 (≈4s) after the ring releases, settled three-chip block.
Slightly over cap, narration covers it.

## Scene 3: the-run-begins (19.7–33.3s)

INTENT: the run starts like any run — but the agent's first move is to go
OUT. First teaching of ring=card.
CAMERA: static.
CHOREOGRAPHY:
- Run grammar: Start blips `[0.4, 0.95)` with its Input row glowing
  `wave(0.4, 1.5)` (blip and read are one moment); WirePulse crosses
  `cv(1.0, 1.7)` (eased `EASING.inOut` at the call site); Research goes
  LIVE at 1.6 — **and never releases**: this ring holds through three scene
  boundaries. The Messages tag glows `wave(2.0, 3.6)` — the agent reads its
  orders before acting.
- The first tool call, two surfaces: Exa chip rings up `cv(4.4, 4.7)`;
  card 1 springs into slot 1 at `popIn(5.0, 0.7)` — birth 0.3s after the
  ring starts, well inside it (cause visibly precedes effect, both visibly
  one event). Skeleton body rows stagger over `body = cv(5.2, 6.9)` (three
  favicon+line rows at 0.27 offsets within the body ramp); the green
  capture pulse brackets the landing `[5.8, 6.1]` up / `[7.0, 7.5]` down;
  the chip ring releases `[6.6, 7.0]` as the card settles. Ring and pulse
  overlap-decay: the call ends as its receipt turns green.
HOLDS: 7.5→13.6 (≈6.1s) — the live ring on Research burns the whole time
(held tension: the run is mid-flight), card 1 sits in the rail. The hold is
long but carries an unresolved state, which keeps it alive.

## Scene 4: reading-the-pages (33.3–42.3s)

INTENT: one call per page worth reading — the move repeats, faster. The
repeat at double tempo is what shows "per result".
CAMERA: static; live ring carried in from scene 3 (freeze-cut both ends).
CHOREOGRAPHY — the same gesture twice, with a measured tempo lift:
- Call 2 (learn the move): Firecrawl ring `[0.8, 1.1]` up, `[2.8, 3.2]`
  down (~2.4s ring); card 2 `popIn(1.3, 0.7)`, body `cv(1.5, 2.8)` (1.3s),
  pulse `[2.1, 2.4]` up / `[3.3, 3.8]` down.
- Call 3 (the move repeats, ~1.6× tempo): ring `[4.0, 4.25]` up,
  `[5.5, 5.85]` down (~1.85s); card 3 `popIn(4.3, 0.6)`, body
  `cv(4.45, 5.4)` (0.95s ≈ 1.4× faster), pulse `[4.9, 5.2]` / `[6.1, 6.6]`.
  Same ring→birth offset (0.3–0.5s), every window compressed — the viewer
  reads "routine now" without a word. Card 3 uses a different seed, so the
  skeleton differs: same shape, different page.
HOLDS: 6.6→9 (2.4s), live ring + three cards. Clean.

## Scene 5: hands-on-the-web (42.3–62.6s) — THE set piece

INTENT: some pages can't be read — they must be USED. A real browser
session you can watch, whose findings become one more captured result.
CAMERA: static stage; the zoom-aside is dim + overlay. World (Start,
Response, edges, cards 1–3) dims to 0.35 over `cv(0.9, 1.6)`; Research
keeps its live ring — the agent stays visibly the actor behind the session.
CHOREOGRAPHY:
- The long-held call: Browser Use chip rings up `cv(0.5, 0.9)` and HOLDS
  ~14s, releasing only `[14.4, 15.0]` AFTER the fold lands — one chip ring
  spanning the whole session says "this is all one tool call".
- Viewport rises `popIn(1.4, 0.8)` with a 30px drop-in; page A is a landing
  wireframe.
- The hands: an arrow cursor fades in `cv(3.2, 3.6)` and eases between
  waypoints with `EASING.inOut` segments — entry (380,300) → Pricing nav
  (700,40) over `[3.4, 4.3]`; click ripple at the nav `cv(4.3, 4.75)`
  (a 6→32px expanding ring fading with progress); the page dip-swaps to
  the pricing layout `page = cv(4.6, 5.4)` — ripple at 4.3, content
  changes at 4.6: click then consequence, 0.3s apart.
- Three plan captures, an accelerating sweep (starts 6.7 / 8.5 / 10.0 —
  gaps 1.8s then 1.5s): cursor eases to plan k (`[5.6, 6.6]`, `[7.6, 8.4]`,
  `[9.2, 9.9]` — travel time also shrinking), click ripple
  (`cv(6.7, 7.15)`, `cv(8.5, 8.95)`, `cv(10.0, 10.45)`), and on each plan
  the title+price region glows selection-blue then settles green WITH
  RESIDUE: e.g. plan 1 glow `[6.8, 7.2]` up / `[7.8, 8.2]` down, green
  `[7.8, 8.4]` up then decaying `[9.4, 10.0]` to 0.25 — never to zero.
  Blue hands off to green at the same instant (7.8): reading becomes
  captured.
- Cursor fades out `[11.6, 12.1]` — the hands leave before the fold, so
  the fold reads as the SYSTEM filing the session, not the cursor dragging
  it.
- **The fold** (the signature move): `fold = cv→eased EASING.inOut over
  [12.6, 14.0]` — the whole viewport (chrome, wireframe, green residues)
  uniformly scales/glides from VIEW_RECT onto rail slot 4. Because the
  interior was designed at slot-aspect ×2.3, nothing reflows; the
  drop-shadow cuts at fold 0.5 as it stops being an overlay. The world
  undims `[13.6, 14.3]` DURING the landing — the room lights come back up
  as the evidence is filed. Land pulse (green ring on slot 4) `[14.0,
  14.3]` up / `[15.0, 15.5]` down — the same capture pulse cards 1–3 got,
  closing the rhyme: the session is just evidence card 4.
HOLDS: 15.5→20.3 (≈4.8s), live ring + full rail. Held tension again.

## Scene 6: the-brief-comes-back (62.6–71.6s)

INTENT: everything the agent captured feeds one answer.
CAMERA: static.
CHOREOGRAPHY:
- The agent re-reads its evidence IN CALL ORDER: cards 1→4 glow with
  `glowAt(a) = up [a, a+0.35] / down [a+1.0, a+1.4]` at a = 0.8 / 1.4 /
  2.0 / 2.6 — a 0.6s stagger against a 1.4s glow, so each glow overlaps the
  next: a wave rolling down the rail, not four blinks.
- Completion in causal order: Start ok 3.5 → agent ok 3.8 (the live ring
  finally releases, ~3 scenes after it lit) → pulse2 `cv(4.0, 4.7)`
  (eased `EASING.inOut`) → Response live `[4.6, 6.4)` with
  `<research.content>` glowing `[4.9, 5.3]` up / `[6.0, 6.4]` down (the
  JSON template stays — no invented brief text) → Response ok at 6.4.
  Green rings HOLD through the cut (carried state for the bookend).
HOLDS: 6.4→9 (2.6s) on the all-green frame. Earned, under cap.

## Scene 7: the-evidence-trail (71.6–82.4s) — bookend

INTENT: one prompt, one run — receipts sitting right there.
CAMERA: the video's only camera move — `scale` eases 1→0.94 over
`[0.8, 2.2]` `EASING.inOut` (a ~6% pull-back about frame center).
CHOREOGRAPHY: the trail retold without re-running — each card takes one
quiet pulse in call order, `recap(a) = (up [a, a+0.3] / down [a+0.7,
a+1.1]) × 0.6` at a = 2.6 / 3.3 / 4.0 / 4.7. The ×0.6 cap matters: a recap
glow is quieter than a live read — memory, not action.
HOLDS: ≈5.8→10.8 (≈5s) on the settled frame. Ambient-dead but post-payoff
and under the VO close; acceptable, borderline.

## The moves used

- **Ring=birth two-surface sync** — every tool call is a chip ring with a
  card springing into the rail 0.3–0.5s into it; taught in scene 3,
  repeated ×3, inverted in scene 6 (cards glow while the agent THINKS).
- **Residue accumulation** — green capture pulses decay to a kept residue
  (0.25 on plan regions); the rail only ever grows; cards at rest are
  pixel-static.
- **Held live ring as run-spine** — one blue ring on the agent spans
  scenes 3–6; every boundary is a freeze-cut carrying it; its release (6:
  t=3.8) is itself a beat.
- **Tempo lift on repeat** — the second Firecrawl call at ~1.6× speed;
  the three plan captures at shrinking gaps (1.8s → 1.5s): repetition
  reads as fluency, acceleration as momentum.
- **Cursor-and-ripple hands** — `EASING.inOut` segment-eased waypoints, a
  one-ring click ripple, then consequence 0.3s later (page dip-swap or
  capture glow). Click → effect, never simultaneous.
- **Fold-to-evidence (zoom-through reverse)** — the overlay viewport is
  pre-designed at slot aspect so its exit is one uniform scale onto the
  rail; the world undims during the landing; the landing earns the same
  green pulse as every other card.
- **Quiet recap pulses** — bookend glows at 0.6 intensity: retell, don't
  re-run.

═══════════════════════════════════════════════════════════════════════
# EXEMPLAR: agent-economy
═══════════════════════════════════════════════════════════════════════

<!-- ── agent-economy / 01-an-agent-you-built.md ── -->

# Scene 1 — `an-agent-you-built`  ·  archetype: **assemble + run**

Source: `../source/scenes/AnAgentYouBuiltScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`.

This is the opening scene of the video, and it does two things in sequence: it
**assembles** the workflow you built, then **runs it once**. Read it as a
worked example — every choice below is one you'll make again, because this
scene is the grammar the rest of the video quotes verbatim.

---

## What this scene is for

The video's whole story is "you built a real agent → deploy it once → and now
everyone can call it, in both directions." Before any of that can mean
anything, scene 1 has to establish two facts as concrete, on-screen objects:
**there is a real workflow here** (a three-block chain with authentic rows and
tools, not a cartoon), and **it runs when you run it** (a value goes in, the
chain does work, a value comes out). Everything downstream — a stranger calling
it, five clients calling it, your agent calling theirs — is *the same run* with
a different origin. So this scene isn't just an intro; it's the **reference
implementation of a run**. Get the run grammar legible here and scenes 3–6 cost
you almost nothing, because they're allowed to say "same as scene 1."

So the rule the scene follows is *one idea per scene*, read generously: the one
idea is "an agent you built, that runs." Assembly and the single run are two
halves of that one idea, not two ideas — the assembly *is* what gets run.
Resist the urge to also introduce the MCP pill, a caller badge, or the partner
server here. Those are deployment and the economy; they each get their own
scene. This scene is a plain workflow in a plain editor, running by itself.

## What it looks like

A three-block chain — `Start → Agent "Scout" → Response` — sitting left-of-center
on the builder canvas (the dotted `CanvasDots` texture behind it). The blocks
stagger in left to right, two edges draw on between them as they arrive, and
then one editor run plays through: `Vantra Labs` resolves into Start's **Input**
row, a light pulse rides the first wire, the **Scout** Agent lights up and its
**Search** tool chip rings (it called its tool), `<start.input>` resolves inside
the Agent's Messages, a second pulse rides the second wire, and
`"AI infra, Series B"` resolves inside the Response block's **Data** template.
Then everything reverts to the empty template and holds.

## The one real decision: render the *whole* set piece, run the *real* chain

The scene renders this and almost nothing else:

```tsx
<EconomyRig
  entry={{opacity: blockOp[0], highlighted: run.startBlip}}
  agent={{opacity: blockOp[1], highlighted: run.midLive}}
  response={{opacity: blockOp[2], highlighted: run.respBlip}}
  edge1={{progress: edge1}}
  edge2={{progress: edge2}}
  searchChipRing={chipRing}
  inputResolve={{text: "Vantra Labs", mix: run.inputMix}}
  msgResolve={{text: "Vantra Labs", mix: run.msgMix}}
  respResolve={{text: '"AI infra, Series B"', mix: run.respMix}}
/>
```

Two things to take from this.

**Use `SimBlock`, the real product block — never a hand-built node.** The chain
on screen is the actual block component (`Scout` Agent carries its real rows —
`Model: claude-sonnet-4-6`, `Messages: Research <start.input>` — and its real
Tools row with Search + Docs chips), fed the workflow's real shape. You are
never designing a block here; you're configuring the one that exists. Every
color, glyph, radius, and the `<start.input>` reference syntax come from the
product (`grounding-v1.md` traces each).

**Notice what *isn't* passed: no `pill`, no `badges`, no `spokes`, no
`partner`, no `mcpChip`, `entryMix` left at its default `0`.** This is the part
people get wrong. There is *one* set piece (`<EconomyRig/>`) for the entire
six-scene video, and every scene renders all of it, turning pieces on and off
with props. Here the deployment identity and the whole caller economy are
simply absent — but they're absent the way a prop defaults to off, not the way
a component is missing from the tree.

> *"Why does it matter whether they're 'off' versus 'not rendered'?"* Because of
> what happens at the cut into scene 2. Scene 2 brings the MCP pill in and morphs
> the entry header Start→API. If scene 1 hand-built a bespoke chain and scene 2
> mounted the "real" rig, you'd risk a one-frame jump — a block reflowing, a
> handle shifting, a flash. By having *both* scenes render the same
> `EconomyRig` at the same `layout.ts` geometry, and only changing prop values
> across the cut, the boundary is identical by construction. The entry block is
> at `blockX(0)`, `CHAIN_Y` in scene 1 and at `blockX(0)`, `CHAIN_Y` in scene 2;
> only its header crossfades. Continuity stops being something you check and
> becomes something you can't break.

## The camera

```ts
// no <Stage cam={…}> wrapper at all — the scene is full-frame, static.
```

There is no camera move and no camera prop in this scene. The chain lives at
fixed `layout.ts` coordinates (`CHAIN_X = 400`, `CHAIN_Y = 470`, pitch `480`)
and is shown at native scale, full-frame, dead still.

> *"Why no camera at all, when scene 1 of the market-desk video framed its hero
> at 1.1×?"* Because this video's only camera move is saved for the very last
> scene (the 7% pull-back bookend in scene 6), and spending a move here would
> spend that coin early. The CHOREOGRAPHY note says it plainly: *"the first
> scene earns the frame before anything is allowed to move it."* The chain is
> the thesis object of all six scenes; let the viewer learn the frame as fixed
> ground truth, so that when the camera finally pulls back at the end, the move
> *means* "step back and see the whole ecosystem" rather than reading as
> generic motion. A static establishing frame is a deliberate choice, not an
> absence of one.

## The values, and why they resolve *by running*, not by styling

Every on-screen value traces to `grounding-v1.md` (the invented Scout corpus):

| surface | template (idle) | resolved (this run) |
|---|---|---|
| Start · Input | `Company name` | `Vantra Labs` |
| Scout · Messages | `Research <start.input>` | `Research Vantra Labs` |
| Response · Data | `{ "brief": <scout.content> }` | `{ "brief": "AI infra, Series B" }` |

The Input row holds the placeholder `Company name` until the run dips it to
`Vantra Labs` and back; the Messages reference `<start.input>` and the Data
reference `<scout.content>` are the product's real templating tags, which
*resolve* to their values only while the run is live. The mechanism is
`DipSwap` / `ResolvedTag` driven by `mix` values that the run choreography
produces (`run.inputMix`, `run.msgMix`, `run.respMix`):

```tsx
inputResolve={{text: "Vantra Labs", mix: run.inputMix}}   // Start.Input
msgResolve={{text: "Vantra Labs", mix: run.msgMix}}        // Scout.Messages <start.input>
respResolve={{text: '"AI infra, Series B"', mix: run.respMix}}  // Response.Data <scout.content>
```

These values are not "filled because we styled them filled" — they fill because
**a row cannot show a value the run hasn't produced yet, and a reference tag
cannot resolve until upstream has run.** Keep this property. It's the same
discipline as never making a number tick without a block causing it: the
Messages tag resolves the moment `pulse1` *arrives at the Agent*, and the Data
tag resolves only after `pulse2` carries the result to the Response. Cause
precedes effect, by construction. If you ever make a cell fill on a timer with
no pulse driving it, you've broken the one rule that keeps the video an honest
depiction of how the product runs.

> *"Why does `inputResolve.text` and `msgResolve.text` both say `Vantra Labs`,
> but the Response says `"AI infra, Series B"`?"* Because the first two are the
> *same value flowing*: the company name you typed into Start is the thing
> `<start.input>` refers to, so the Messages tag resolving to `Vantra Labs` is
> the data propagating one block downstream — the viewer sees the same string
> appear in two places and reads "the input reached the agent." The Response is
> a *different* value — the brief the agent produced — so `<scout.content>`
> resolves to a new string. The grounding pairs `Vantra Labs → "AI infra,
> Series B"`; the script's earlier `"brief ready · 4 sources"` was superseded
> by the locked source, and the annotation grounds to source.

## The animation, beat by beat

The timing is built from one inline `ease(lo, hi)` (an `EASING.out`
`interpolate` from 0→1 clamped to the window), the shared `runBeats(t, a,
{hold})` grammar (the canonical run, imported from module 5 — this is the helper
scenes 3–6 quote), and `clamp01` aliased to `c` for the chip ring. With anchor
`a = 3.6`, `midDur = 0.7` (default), `hold = 1.0`, every window below is read
straight off those helpers.

### (a) The chain assembles — `blockOp = [ease(0.3,0.9), ease(0.75,1.35), ease(1.2,1.8)]`, edges `ease(1.0,1.6)` / `ease(1.45,2.05)`

The three blocks fade in on a strict **0.45-second stagger** — Start over
0.3→0.9s, Scout over 0.75→1.35s, Response over 1.2→1.8s — and the two wires
draw on between them: edge 1 over 1.0→1.6s, edge 2 over 1.45→2.05s. All
`EASING.out`.

> *"Where does the 0.45s stagger come from?"* It's chosen, not derived, but
> chosen against the same two constraints every stagger answers. Too tight
> (~0.15s) and the three blocks arrive as one pop — the viewer can't feel that a
> chain is *three* distinct stages. Too loose (~0.9s) and assembly drags past
> two seconds of dead build. 0.45s is fast enough to feel like one gesture, slow
> enough that your eye lands on Start, then Scout, then Response in order — you
> read the *direction* of the chain (left builds right), which is the whole
> point, since the run will flow that same direction.
>
> *"Why do the edges start drawing at 1.0 and 1.45 — before their downstream
> block has finished fading in?"* This is the deliberate overlap. Edge 1 starts
> at 1.0s while Scout (0.75→1.35) is still arriving; edge 2 starts at 1.45s
> while Response (1.2→1.8) is still arriving. If each wire waited for its block
> to fully land, assembly would read as *three pops, then two lines* — a stutter.
> By letting each wire draw *into* its still-arriving block, the whole assembly
> reads as **one continuous left→right wave**: block, wire-reaching, block,
> wire-reaching, block. The chain feels grown, not stacked.

### (b) The idle hold — ~1.8s to 3.6s

Once Response lands (1.8s) and edge 2 finishes (2.05s), nothing moves until the
run begins at the anchor `a = 3.6`. About **1.8 seconds** of assembled-but-idle
chain, behind only the `CanvasDots` texture.

> *"Isn't 1.8s of a static chain dead air?"* It's a setup pause, and the
> CHOREOGRAPHY flags it as acceptable, under the dead-hold cap. The chain you
> just assembled needs a beat to *be* a finished thing before it does anything —
> if the run started the instant Response arrived, the viewer wouldn't have
> registered "this is a complete workflow" before it started moving. The pause
> is the difference between "a thing that's still building" and "a built thing,
> now running." It's also where the opening narration lands ("an agent you
> built…"), so the still frame is carrying words, not silence.

### (c) The run — `runBeats(t, 3.6, {hold: 1.0})`

This is the reference run. Its sub-beats, all read off the helper with `a=3.6`:

- **`inputMix`** dips `Company name → Vantra Labs` over **[3.6, 3.95]** (0.35s).
- **`startBlip`** — Start's selection ring — fires **3.85 → 4.35**.
- **`pulse1`** rides edge 1 over **[4.1, 4.75]** (the `WirePulse` light streak,
  `len={55}`, on `edgeX1(0)→edgeX2(0)` at `CHAIN_EDGE_Y = 500`).
- **`midLive`** — Scout's live ring — holds **4.7 → 5.4** (the `midDur=0.7`
  live window).
- **`msgMix`** resolves `<start.input> → Vantra Labs` over **[4.65, 5.05]** —
  i.e. the Messages tag fills *the moment `pulse1` arrives at the Agent block*.
  Cause precedes effect by construction.
- **`pulse2`** rides edge 2 over **[5.4, 6.05]** (begins exactly as the live
  window ends).
- **`respMix`** resolves `<scout.content> → "AI infra, Series B"` over
  **[6.05, 6.4]** (`respStart = a + 1.75 + midDur = 6.05`).
- **revert** — every row dips back to its template together over **[7.4, 7.75]**
  (`respStart + 0.35 + hold = 7.4`).

What the viewer reads is a single causal sweep left to right: a value lands in
Start, light travels to the Agent, the Agent lights and its Messages fill, light
travels to the Response, the brief appears, hold, reset. No beat overlaps
another in a way that blurs it — each pulse departs as the previous block's work
completes.

> *"Why anchor the run at 3.6 instead of the first idle moment, ~2.05?"* Because
> assembly and the run are two different ideas and stacking them would blur both
> (the same reason the market-desk selection waits for the table to settle).
> Let the chain fully arrive, hold a beat so it reads as *built*, then run it.
> The gap is also what lets the narration say "an agent you built" over the
> assembled-idle frame *before* "…and it runs when you run it" over the run.
>
> *"Why `hold: 1.0`?"* That's the dwell on the fully-resolved frame before the
> revert: the brief sits readable in the Response from ~6.4s until the revert
> starts at 7.4s. One second is long enough to read `"AI infra, Series B"` and
> register "the run produced an output," short enough not to stall. Every later
> scene's `runBeats` reuses this same `hold` family so the resolved-frame dwell
> feels consistent across the video.
>
> *"Why does everything revert together at the end, instead of un-resolving in
> reverse order?"* Because the revert isn't part of the data story — it's the
> editor returning to its idle template so the *next* scene can open on a clean
> chain. A staged reverse-revert would imply the data "un-flowing," which is
> meaningless. One synchronized dip-back over 0.35s reads as "run finished,
> board cleared," full stop.

### (d) Tool-call sync — `chipRing = min(c(t, 4.95, 5.2), c(t, 5.6, 5.85, 1, 0))`

The **Search** chip on the Agent's Tools row rings: up over **[4.95, 5.2]**,
hold, down over **[5.6, 5.85]** (the `min` of a rising clamp and a falling
clamp builds the pulse-window shape). This window sits *entirely inside* the
Agent's live window (4.7→5.4), starting 0.25s after the live ring begins.

> *"Why nest the chip ring inside the Agent's live ring instead of giving it its
> own beat?"* Because the nesting *is* the meaning. The Agent is live (working);
> while it's working, one of its tools fires. If the chip rang before the Agent
> lit, or after it went idle, it would read as a separate event — "something
> else happened." Firing it 0.25s into the live window, and releasing it before
> the live window closes, says exactly "the agent, while working, called its
> tool." It's the product's own selection language used to show a tool
> invocation, with no words. Only the **Search** chip rings, not Docs —
> selecting both would be noise; one tool firing is a sentence.

### (e) The hold — ~7.75s to 9s

After the revert, the chain rests on its empty template behind only the
`CanvasDots` texture for about **1.25 seconds** before the cut.

> *"Isn't another still frame dead air?"* It's the breath before the cut, under
> the dead-hold cap, and it earns its place two ways. First, it lets the run
> *land* — the viewer just watched a value go in and a brief come out; a beat of
> stillness is what turns that from motion-you-watched into a fact-you-learned.
> Second, this is where the scene can *stretch* to fit the voiceover (the comp
> is VO-stretched to 9s). A scene that ends on a static, settled state can be
> extended to any length safely — there's no animation mid-flight to freeze.
> The exit state being "idle template, nothing moving" is precisely what makes
> the cut into scene 2 (which opens on that same idle template and starts
> dimming) seamless.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *What's the object?* A workflow → render the real `SimBlock` chain, with
   authentic rows, model name, and tool chips.
2. *How do I show only this workflow?* Render the **one** `EconomyRig` set piece
   with every later prop (pill, badges, partner) defaulted off → continuity is
   free across all six scenes.
3. *How does a chain arrive?* Blocks stagger left→right, wires drawing *into*
   still-arriving blocks → you read one continuous build, and you read its
   direction.
4. *How do I prove it's real without a caption?* Run it once — a value dips in,
   pulses travel, tags resolve, an output appears → the product's own run
   vocabulary, never words on screen.
5. *Why do values fill?* Because the run produced them, gated to pulse arrival →
   an honest depiction; cause precedes effect.
6. *How should it be framed?* Static, full-frame, no camera → the first scene
   earns the frame so the only move (scene 6's pull-back) can mean something.
7. *Why establish the run so carefully?* Because scenes 3–6 *quote* this exact
   grammar → spend the legibility here once, reuse it five times.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each one right. There's no single clever move — it's restraint and
honesty applied seven times, plus the long-game discipline of building a run
grammar the rest of the video can lean on.

## Exit state (what scene 2 inherits)

`chain assembled · entry = Start · rows reverted to template (idle by 7.75s) ·
no pill, no badges, no spokes, no partner · entryMix = 0 · camera static
full-frame`. Scene 2 opens on exactly this frame, dims Scout + Response to
0.35, and starts the Start→API header morph while the MCP pill fades in above
the entry. Because both scenes render the same `EconomyRig` at the same
`layout.ts` geometry, that boundary is identical down to the pixel.

<!-- ── agent-economy / 02-deploy-as-a-tool.md ── -->

# Scene 2 — `deploy-as-a-tool`  ·  archetype: **morph-swap**

Source: `../source/scenes/DeployAsAToolScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`.

This is the hinge of the whole video. Scene 1 showed you a working chain that
runs when *you* run it; every scene after this one is a *caller* arriving. This
scene is the single change that makes that possible — the one move that turns
"an agent you built" into "a tool other agents can call." Read it as the worked
example of a **morph-swap**: a scene that changes the *identity* of an element
already on screen, without moving, rebuilding, or relayout-ing anything.

---

## What this scene is for

The video's spine is "deploy a workflow as an MCP tool and it becomes
infrastructure others call." Scene 1 built the chain. This scene performs the
deploy — and it has to do it as a *transformation of the thing already there*,
not as a new thing arriving. The chain you watched run is the chain that gets
deployed; the viewer must feel that continuity in their gut, because the entire
thesis ("the same agent, now callable") collapses if the deployed thing looks
like a different object.

So the rule the scene follows is *one idea per scene*: this scene is "the chain
acquires a tool identity." Full stop. No call comes in — the first stranger
doesn't arrive until scene 3. No badges, no spokes, no partner server. This
scene only changes what the chain *is*; who calls it is a different idea and
gets its own scene. Resist the urge to also show the first caller here — that's
the most natural place to over-reach, and it would blur the one change this
scene exists to make legible.

## What it looks like

The whole Scout chain is on screen at home framing, exactly as scene 1 left it.
The Agent and Response blocks **dim** to the background; the entry block becomes
the only lit thing. A blue editing ring lands on the entry. As it sits there,
the entry's **header morphs** — the cyan `Start` chip crossfades into the deeper
blue `API` chip, name and glyph and color all swapping together, while the
`Input` row underneath stays *pixel-identical*. A beat after the morph settles,
the **MCP tool pill** fades and rises into place above the entry: a green live
dot, then `research_competitor` on `sim.ai/api/mcp/serve/…` in mono. Then the
world un-dims and the deployed chain rests. The pill stays for the rest of the
video.

## The one real decision: this is a morph, not a build

Look at how little the scene component contains:

```tsx
const dimAmt = dimIn * dimOut;
const ringOn = t >= 1.2 && t < 2.8;
const morph  = interpolate(t, [1.5, 2.3], [0, 1], {..., easing: EASING.inOut});
const pillReveal = interpolate(t, [3.1, 3.7], [0, 1], {..., easing: EASING.out});

return (
  <EconomyRig
    entryMix={morph}
    entry={{highlighted: ringOn}}
    agent={{dim: dimAmt}}
    response={{dim: dimAmt}}
    edge1={{opacity: 1 - 0.45 * dimAmt}}
    edge2={{opacity: 1 - 0.45 * dimAmt}}
    pill={{reveal: pillReveal}}
  />
);
```

Six props, and not one of them mounts a new structural element. The camera is
implicit (the rig sits at home framing — there's no `cam` prop because this
video frames statically and never moves until scene 6). The Agent and Response
get a `dim`. The two edges get an opacity. The entry gets a highlight boolean
and a `morph` value. The pill gets a reveal. Everything else — the chain's
geometry, the entry's `Input` row, the block positions — is rendered by
`EconomyRig` at its default state, *exactly* as scene 1 left it. The scene
authors only the delta.

This is the **morph-swap** archetype, and it's worth being precise about how it
differs from scene 4's *morph-at-state-level* (the armed scene in the
market-desk video). There, a block's *state* flipped (idle → deployed) but the
block stayed the same block. Here the entry block changes *what kind of block it
is*: a `Start` trigger becomes an `API` trigger. The identity itself swaps. The
machinery for that swap lives entirely in the rig — the scene just drives one
`morph` value from 0 to 1 and the rig crossfades two full block variants behind
it.

> *"Why drive the swap with a single `morph` scalar instead of mounting the API
> block and unmounting the Start block?"* Because a mount/unmount is a cut, and
> a cut can't be a *transformation*. The rig renders **both** variants every
> frame and crossfades their opacities against the one scalar:
>
> ```ts
> const fromOp = interpolate(entryMix, [0.3, 0.7], [1, 0], {clamp});
> const toOp   = interpolate(entryMix, [0.3, 0.7], [0, 1], {clamp});
> ...
> {entryBlock("start", fromOp)}
> {entryBlock("api", toOp)}
> ```
>
> Both blocks occupy the *same* `left: blockX(0), top: CHAIN_Y` — they're
> stacked, identical in geometry, differing only in header. As `morph` crosses
> 0.3→0.7 the Start opacity falls 1→0 while the API opacity rises 0→1. The
> viewer sees one header dissolve into another *in place*. That's the whole
> point of a morph: the chain never blinks, never reflows, never loses its
> identity for a frame — it *becomes* something while you watch.

## What stays pixel-identical — and why that's the load-bearing constraint

The entry block has exactly one row, `{title: "Input", value: "Company name"}`,
and both the `start` and `api` variant render that *same row* from the *same*
`inputValue`:

```ts
const entryBlock = (variant, op) => (
  <SimBlock
    name={ENTRY_VARIANTS[variant].name}
    color={ENTRY_VARIANTS[variant].color}
    glyph={ENTRY_VARIANTS[variant].glyph}
    rows={[{title: "Input", value: inputValue}]}   // identical in both
    ...
  />
);
```

Only the `name`, `color`, and `glyph` differ between variants. The row is
shared. This is not incidental — it's the discipline that makes the morph
*read* as a morph rather than a glitch.

> *"Why does the Input row have to be pixel-identical across the swap?"* Because
> the block's **height** is a function of its rows, and if the height changed
> mid-morph the block would grow or shrink — and a block that resizes during a
> crossfade looks broken, not transformed. The morph's entire credibility rests
> on the body staying frozen while only the header dissolves. The choreography
> notes call this out explicitly: "the Input row is pixel-identical throughout —
> height constant, zero relayout." If you ever morph a block and the body
> twitches, you've lost the illusion. The fix is never to animate the height
> back into place; it's to *make the morphed variants share the body* so there's
> nothing to relayout in the first place. Continuity here is a property of the
> data, not of the animation.
>
> *"Why is the crossfade window `0.3–0.7` rather than the full `0–1`?"* So there
> is never a frame where *both* headers are fully opaque (a double-exposed,
> two-named block) or *both* are gone (a headerless block). By the time the old
> header has faded to nothing (`morph = 0.7`) the new one is fully up, and
> neither is visible at partial strength outside that band. The `EASING.inOut`
> on the `morph` scalar means the crossfade accelerates into and decelerates out
> of that middle band — a transform curve, because this *is* a transform, not an
> entrance. (Contrast the pill below, which uses `EASING.out`, the
> arrive-and-settle curve for a new object.)

## The two block identities, and where their values come from

Both variants come from a single `ENTRY_VARIANTS` table in the rig, and every
field of it is grounded — nothing is free-typed.

```ts
const ENTRY_VARIANTS = {
  start: {name: "Start", color: BLOCK_COLORS.start, glyph: <StartGlyphW/>},  // #2FB3FF
  api:   {name: "API",   color: BLOCK_COLORS.api,   glyph: <ApiGlyphW/>},    // #2F55FF
};
```

| field | `start` | `api` | source |
|---|---|---|---|
| name | `Start` | `API` | the two trigger blocks' registry names |
| color | `#2FB3FF` | `#2F55FF` | `BLOCK_COLORS.start` / `.api` (SimBlock, re-checked vs registry) |
| glyph | `StartGlyphW` | `ApiGlyphW` | the ported product block glyphs |

> *"Why does the chain swap its trigger from `Start` to `API` when you deploy as
> MCP — and why is *that* the visual of 'deployed'?"* Because in the product, a
> deployed workflow is reached over an endpoint, not by clicking Run in the
> editor. The `Start` trigger is the *editor* entry — "this is where a manual
> run begins." The `API` trigger is the *deployed* entry — "this chain is now
> reachable by a request from outside." Swapping the header from cyan `Start` to
> deep-blue `API` is the product-true picture of "this stopped being a thing you
> run and became a thing that gets *called*." The grounding traces this exact
> morph to the module-6 deployment build (`Entry morph Start #2FB3FF → API
> #2F55FF` — "the same morph the accepted module-6 v2 ships"). This scene
> *reprises* that morph fast rather than re-teaching it: the audience either has
> module 6 or doesn't need it, and the new information is carried by the pill,
> not the header swap.
>
> *"Why these two blues specifically — won't `#2FB3FF` and `#2F55FF` read as the
> same color mid-crossfade?"* They're close on purpose — both are in the
> trigger-blue family, so the swap reads as "the same *kind* of thing changed
> register," not "a green block became a red block." The deeper, more saturated
> `#2F55FF` of `API` reads as the *committed*, deployed version of the lighter
> editor `Start`. The colors come straight from the block registry
> (`starter.ts`, `api_trigger.ts`); they are not tuned for the animation. If
> they were further apart the morph would read as a *replacement*; being a
> family apart, it reads as a *promotion*.

## The editing ring — and why it fires *before* the morph

```ts
const ringOn = t >= 1.2 && t < 2.8;   // entry={{highlighted: ringOn}}
```

The entry block carries `highlighted: true` for the window **1.2s → 2.8s**, then
drops to `false`. In `SimBlock`, `highlighted` draws the product's blue
selection ring — an inset box-shadow in `COLORS.secondary` (`#33b4ff`), the same
ring the market-desk video uses to mean "you are acting on this block."

> *"Why a plain boolean window instead of a fade?"* The ring is a *selection
> state*. In the product it snaps on when you click a block and snaps off when
> you don't — it doesn't ease in. Modeling it as a boolean (on at 1.2, off at
> 2.8) matches that hard-edged product behavior. The morph and the pill, which
> are *changes happening to* the block, get soft interpolated treatments; the
> ring, which is *you selecting* the block, snaps. Same grammar as every other
> scene in this series and the market-desk one: ease what transforms or arrives,
> snap what is a selection.
>
> *"Why does the ring come on at 1.2 but the morph not start until 1.5 — why the
> 0.3s lead?"* Sequence is meaning. The ring is the *act* ("someone selected
> this block to deploy it"); the morph is the *consequence* ("and now it
> changed"). Firing the ring 0.3s before the morph encodes cause and effect: you
> selected it, *then* it changed. If they started together the viewer couldn't
> tell which drove which — it'd read as two simultaneous decorations. The
> choreography notes name this exact beat: "the product's 'selected' language
> fires BEFORE the morph (0.3s lead): someone selected it, then it changed."
>
> *"Why does the ring release at 2.8, after the morph finishes at 2.3?"* So you
> see the *deployed* (API) header *while the block is still selected* — the act
> and its result briefly coexist (2.3→2.8) before the selection lets go. That
> overlap seals the causal read: the thing you selected is the thing that
> changed. The ring is **transient** (it's the act, and acts are momentary) — it
> releases. The morph and pill are **carried** (they're the new standing facts) —
> they stay. That asymmetry is the same one the market-desk armed scene draws
> between its ring and its pill.

## The MCP pill — the new identity, surfacing

```ts
const pillReveal = interpolate(t, [3.1, 3.7], [0, 1], {clamp, easing: EASING.out});
```

The pill's reveal ramps 0→1 over **3.1s → 3.7s**, eased with `EASING.out`. That
single value drives two things at once in the `ToolPill` component, exactly the
two-in-one the market-desk schedule pill uses:

```tsx
top: PILL.y + (1 - reveal) * 14,
opacity: reveal * (1 - 0.65 * dimmed),
```

So at `reveal = 0` the pill is 14px **below** its resting spot and transparent;
as `reveal` climbs to 1 it slides up those 14px and fades in together. It
**rises into place** rather than simply appearing.

> *"Why make it rise 14px instead of just fading in?"* A pure opacity fade reads
> as "this label was always here, you just couldn't see it." A rise reads as
> "this came into being just now, *because* of what you just did." The 14px lift
> ties the pill's arrival causally to the deploy — it's the *result* of the
> morph, surfacing above the block that just changed. It's a small distance on
> purpose: enough to register as a deliberate entrance, not so much it looks like
> it flew in from off-screen. (The exact same 14px and the same
> `top + (1-reveal)*14` formula as the market-desk armed pill — this is a shared
> idiom across the videos, not a re-invention.)
>
> *"Why `EASING.out` here but `EASING.inOut` on the morph?"* Because the pill
> *travels* — it moves 14px through space — and `EASING.out` (decelerate-to-rest)
> makes it arrive and settle, like it's landing into its slot. The morph isn't a
> spatial entrance; it's a crossfade-in-place, a transform, so it takes the
> transform curve `EASING.inOut`. Ease-to-rest for things that arrive, the
> symmetric transform curve for things that change in place. The rule holds
> across the whole project.
>
> *"Why 3.1 — a beat after the morph settles at 2.3, and after the ring releases
> at 2.8?"* Staggering again. The chain identity changes *first* (morph 1.5→2.3),
> the selection lets go (ring off 2.8), and only *then* does the new public
> identity surface (pill 3.1→3.7). Reading top to bottom in time: deploy →
> selection releases → the tool's name and address appear. Each beat waits for
> the last. The choreography calls the pill "0.8s AFTER the morph settles, its
> own beat" — it gets its own air rather than stacking on the morph, which would
> blur both into one busy moment.

### Where the pill's words come from

Not one character of the pill is free-typed. From the rig:

```ts
export const TOOL_NAME  = "research_competitor";
export const SERVER_URL = "sim.ai/api/mcp/serve/…";   // UUID ⟨pending⟩
```

> *"Where does `research_competitor` come from — why lowercase with an
> underscore?"* It's the MCP tool name for the deployed Scout workflow, and the
> shape follows the product's own naming rule. The grounding cites
> `workflows/deployment/mcp.mdx`: "Use lowercase letters, numbers, and
> underscores" (the doc's own example is `search_documents`). So
> `research_competitor` isn't a label chosen to look techy — it's what a Sim MCP
> tool name *must* look like. Typing `Research Competitor` or `researchTool`
> would be a small lie about how the product names tools. It's rendered in mono
> because it's an identifier, not prose.
>
> *"And `sim.ai/api/mcp/serve/…` — what's the `…`?"* That's the product's MCP
> server URL shape, traced to `workflow-mcp-servers.tsx:131`
> (`${getBaseUrl()}/api/mcp/serve/${serverId}`) and confirmed by the docs
> screenshot. The trailing `…` elides the real server UUID, which is
> ⟨pending⟩ — there's no live workspace in this batch build, and the batch rule
> forbids inventing a fake UUID. So rather than fabricate one, the pill shows the
> *true* path prefix and honestly elides the part it doesn't have. (Module 6 set
> this precedent — elide the UUID as `…` rather than invent it.) The smaller,
> grey mono line is the product's address caption; the larger line is the tool
> name. Two lines, one identity: *what* the tool is called and *where* it lives.
>
> *"Why the green dot?"* It's the deploy modal's *live-version* marker —
> `#22c55e`, the same green that means "deployed and listening" in module 6 and
> in the market-desk armed pill. It's the visual half of "this is now a live
> tool": the dot says *live*, the text says *what it's called and where*. No word
> like `DEPLOYED` or `LIVE` appears, because the green dot already says it (style
> lesson 2: indicate state with visuals, not words).

## The dim — refocusing by subtraction, not by camera

This video never moves its camera until the final scene, so the only way to
direct the eye to the entry is to **dim everything else**. The scene does that
with a windowed product of two ramps:

```ts
const dimIn  = interpolate(t, [0.5, 1.1], [0, 1], {clamp});   // dim comes on
const dimOut = interpolate(t, [4.6, 5.3], [1, 0], {clamp});   // dim lifts
const dimAmt = dimIn * dimOut;
```

`dimAmt` rises 0→1 over 0.5→1.1s, holds at 1, then falls 1→0 over 4.6→5.3s. It's
applied to the Agent and Response blocks (`dim: dimAmt`) and, more gently, to
the two edges (`opacity: 1 - 0.45 * dimAmt`). In the rig's `visOpacity`, a block
at `dim = 1` renders at `1 - 0.65 * 1 = 0.35` opacity — the series' standard
"dimmed but still present" level.

> *"Why dim to 0.35 and not all the way to 0, or hide them?"* Because the Agent
> and Response are still *part of the chain being deployed* — they don't go away,
> they recede. 0.35 keeps them legible as context (you can still see it's a
> three-block chain) while making the entry unambiguously focal. Hiding them
> would say "they left"; dimming them says "look here for a moment." This is the
> series' **dim-flip refocus** move — focus moves by dimming the non-focal
> actors, never by moving the camera. The market-desk video moves its camera to
> refocus; this one can't (static until scene 6), so it subtracts light instead.
> Same goal, different lever.
>
> *"Why only `0.45 * dimAmt` on the edges — why dim them less than the blocks?"*
> The wires are thin; dim them as hard as the blocks (to 0.35) and they nearly
> vanish, which would read as the chain *disconnecting* during the deploy. At
> `1 - 0.45 = 0.55` they stay visibly present — the chain is still wired
> together, just quieted. The blocks carry the dim; the wires only soften.
>
> *"Why does the dim come on at 0.5 but the ring not land until 1.2?"* The dim is
> the *setup* for the focal move — it darkens the stage *before* the action
> begins, so when the ring lands the entry is already the only lit thing and the
> gesture reads instantly. If the ring landed into a fully-lit frame and the dim
> came after, the eye would have to re-find the entry. Dim first, then act.
>
> *"And why does the dim lift (4.6→5.3) only *after* the pill is fully up
> (3.7)?"* Because the world should return only once the new identity *exists*.
> The sequence is: dim the stage → deploy (ring + morph) → surface the identity
> (pill) → *now* bring the world back, with the chain transformed and named.
> Un-dimming earlier would pull focus off the entry before the pill had
> registered. The choreography: "Un-dim `[4.6, 5.3]`: the world returns only
> after the new identity exists."

## The animation, beat by beat

A strict serial cause-chain, each event waiting for the last — this is the
scene's whole craft. Read it as one sentence in time:

1. **0.5→1.1s** — the stage dims. Agent + Response to 0.35, edges to 0.55. The
   entry becomes focal by subtraction.
2. **1.2s** — the blue editing ring lands on the entry. *Someone selected this
   block.* (0.3s lead before the morph.)
3. **1.5→2.3s** — the header morphs `Start` → `API`, crossfading through the
   0.3–0.7 band, `EASING.inOut`. The Input row never moves. *The chain became a
   deployed endpoint.*
4. **2.8s** — the ring releases. The act is done; the API header it left behind
   stays.
5. **3.1→3.7s** — the MCP pill rises 14px and fades in, `EASING.out`. *The tool
   now has a name and an address.*
6. **4.6→5.3s** — the world un-dims. The transformed, named chain returns to
   full presence.
7. **5.3s → end (~7s of hold)** — nothing moves. The deployed state rests.

Every gap between those beats is deliberate, and none of them overlap by
accident. The 0.3s ring-before-morph lead, the 0.5s gap from morph-settle (2.3)
to pill-start (3.1), the wait for the pill before un-dimming — each is a cause
preceding its effect, so the viewer reads a *process*, not a pile of
simultaneous animations. Stacking these would be the fastest way to make the
scene feel busy; spacing them is what makes it read as a clean sequence of
deliberate steps.

### The hold — 5.3s to the end (~7s)

After the world un-dims, nothing moves for roughly seven seconds. The deployed
chain just sits, pill lit.

> *"Seven seconds of stillness is a lot — isn't that dead air?"* It's the
> VO-stretch hold: this scene is stretched to fit its narration line, and the
> narration *reads the pill* while it sits — naming the tool, the address, the
> idea that the chain is now callable. A scene that ends on a settled, latched
> state can be stretched to any length safely, because there's no animation
> mid-flight to interrupt (the same boundary-safety property as the market-desk
> holds). That said — the choreography is honest that this is **the weakest hold
> in the video**: by the ambient-motion test it's a *dead* hold (only
> `CanvasDots` texture moves), survivable *only* because the narration is
> actively naming what's on screen. The note flags the fix: "a live-dot shimmer
> on the pill would have earned it." Take the lesson: a long hold needs either
> active narration over it or a small ambient life on the focal object; this one
> leans entirely on the former, and it's the one hold in the video that's right
> at the edge of working.

## How to think about the whole scene

Walk the decisions in order and there's a question driving each one — and every
answer is "change the *identity*, move *nothing*":

1. *What's the change?* The chain's trigger goes from editor (`Start`) to
   deployed (`API`) → a **morph**, not a build. Render both variants, crossfade
   one scalar.
2. *How do I keep it the same chain?* Share the `Input` row across both variants
   so the body is pixel-identical → the height never moves, so the morph reads
   as a transform, not a glitch.
3. *How do I show "someone deployed this"?* The product's blue editing ring lands
   on the entry, 0.3s before the morph → an act performed *on* the block, cause
   before effect.
4. *How do I show "now it's a tool"?* An MCP pill rises above the entry: green
   live dot + product-shaped tool name + product-true server URL → a new standing
   identity, every character grounded, the UUID honestly elided.
5. *How do I focus the eye with no camera?* Dim everything but the entry to 0.35
   (edges only to 0.55) → refocus by subtraction; un-dim only after the new
   identity exists.
6. *What stays, what goes?* The ring (the act) releases; the API header and the
   pill (the consequences) persist to the final frame → the asymmetry *is* the
   meaning.

There's no clever move here — the quality of the scene is in what it *refuses* to
do. It changes exactly one thing about one block and lets the rest of the frame
hold. A morph-swap that also rebuilt the chain, or moved the camera, or brought
in a caller, would have buried its one idea. Restraint applied six times.

## Exit state (what scene 3 inherits)

`Scout chain at home framing · entry = **API** (morph at 1, latched) · MCP pill
present and latched, reading green-dot · `research_competitor` ·
`sim.ai/api/mcp/serve/…` (mono) · Agent + Response + edges un-dimmed (back to
full by 5.3s) · no badges, no spokes, no partner · rows at template`. This is
the continuity contract's "deployed state A." Scene 3 opens on exactly this
frame and pops in the first client badge (Claude Desktop) at the left edge,
draws its spoke into the entry's now-`API` handle, and runs the chain as a
*caller's* call. Because both scenes render the same `EconomyRig` set piece at
the same static framing, that boundary is identical down to the pixel — and the
deployed identity this scene created is the thing every later scene calls.

<!-- ── agent-economy / 03-a-stranger-calls.md ── -->

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

<!-- ── agent-economy / 04-the-rush.md ── -->

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

<!-- ── agent-economy / 05-you-call-theirs.md ── -->

# Scene 5 — `you-call-theirs`  ·  archetype: **run**

Source: `../source/scenes/YouCallTheirsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`.

This is the scene where the video's argument turns around. Scenes 2–4 spent
their whole length pointing *inward*: you deployed the Scout chain, and one
after another — a stranger, then a rush of five — outside callers reached in
from the left edge and drove *your* agent. This scene runs the same machinery
in reverse. *Your* agent reaches *out* to the top-right and drives somebody
else's. Read it as the worked example for "how do I show the same grammar
playing backwards without re-teaching it," because almost every decision here
is the mirror image of a decision scene 3 already made — and the value of the
scene is that the viewer feels the rhyme.

---

## What this scene is for

The video's one idea is "deploy a workflow as an MCP tool and it becomes
infrastructure other agents call; *the same protocol lets your agent call
theirs.*" Scenes 2–4 proved the first clause exhaustively. This scene exists to
prove the second, and in doing so to **close the loop that makes it an
*economy* rather than a publishing model**. A one-directional story — "you
publish, others consume" — is just a marketplace. The thing that earns the word
*economy* is reciprocity: every participant is simultaneously a supplier and a
consumer. So this scene has to take the agent that was the *callee* in every
prior scene and show it become a *caller*, using a tool that is itself another
team's deployed agent. The flip is the whole point.

So the rule is still *one idea per scene* — the idea is "your agent consumes
their deployed agent as a tool" — but to land it the scene has to do two things
the inbound scenes never had to: it has to **flip the focus** from the left
edge to the top-right, and it has to **draw a tool call as a round trip on a
brand-new spoke** while the run is mid-flight. Everything below is in service of
those two.

## What it looks like

The full ecosystem from scene 4 is on screen — the Scout chain center, the five
client badges down the left, the tool pill above the entry. Then the focus
**inverts**: the badges, the entry, and the pill all dim to roughly a third of
their brightness, and the edges dim partway, leaving the Agent block the only
fully-lit thing in frame. A partner server badge — `pricing_intel`, in MCP
purple — springs in at the **top-right**, and a spoke draws out of the Agent's
own source handle, hops right, climbs, and lands on it. The Agent's Tools row
then *grows* a third chip, `pricing_intel`, the block widening to fit it rather
than popping. Then one run fires from the editor: `Octave Systems` resolves into
the entry's Input row, the Agent goes live — and **stays live for an unusually
long beat**, because while it's live the new chip rings, a pulse rides the
partner spoke *out* to the top-right and *back*, the partner badge flashes blue
then green, and only then does `"voice agents"` resolve into the Response. The
rows revert, the world un-dims, and the chip, badge, and spoke all stay.

## The run grammar — this scene *quotes* it, doesn't reinvent it

Every run in this video is built from one shared function, `runBeats(t, a,
{midDur, hold})` (ported from the module-5 agents build), and scene 1 spent its
length teaching that grammar so every later scene could quote it. Before the
beats, it's worth restating the three rules every run obeys, because this scene
leans on all three and then adds exactly one new surface:

1. **A pulse is the only thing that travels a wire, and it carries no cargo.**
   `WirePulse` (on the chain edges) and `PathPulse` (on the partner spoke) are
   streaks of blue light — not values, not payloads. A wire firing means
   "control passed," full stop.
2. **Values never ride wires. They resolve *in place*, in rows.** When `Octave
   Systems` or `"voice agents"` appears, it appears in the block row where it
   *lives*, via `DipSwap` / `ResolvedTag` — never as a chip drifting down a
   connector.
3. **State is shown in the product's own language** — a blue live ring, a green
   ok flash, a selection ring on a chip — never a word like "RUNNING."

The one new surface this scene introduces is the **chip ring**: the
`pricing_intel` chip on the Tools row gets a selection ring exactly while the
outbound call is in flight. That's the same vocabulary scene 1 used for the
Search chip ("the agent, while working, called its tool") — pointed at a
different tool. Nothing here is a new idea; it's the established grammar with the
arrow reversed.

> *"Why reuse `runBeats` verbatim instead of choreographing the flip from
> scratch?"* Because the load-bearing claim of the whole video is that calling
> out and being called are *the same protocol*. If the outbound run looked
> different from the inbound runs — different timing, different rings, a
> bespoke animation — the viewer would read it as a different *kind* of thing,
> and the symmetry argument would collapse. Quoting the exact run grammar is
> how the scene *shows* "it's the same protocol" instead of asserting it in
> narration. The reversal lives entirely in *where* the spoke points, not in
> how the run behaves.

## The one set piece, again

As in every scene, this renders the *single* `<EconomyRig/>` — the same chain,
the same five badges, the same pill, plus the partner that scene 6 will inherit
— and differs only in state props. Nothing is mounted or unmounted at the cut.
The five badges that were lit and settled at the end of scene 4 are the same
five badges dimmed here; the partner badge that springs in here is the same one
scene 6 opens with at full reveal. That's why the `4→5` boundary is identical
down to the pixel: scene 4 left "deployed state C" (all five badges + spokes,
rows at template), and scene 5 opens on exactly that frame before the dim begins.

## The camera

There is no `cam` prop in this scene at all — the rig renders at the stage's
home framing and **does not move**. The flip is accomplished entirely by
*dimming*, not by reframing.

> *"Why hold the camera still in the scene whose whole job is to redirect the
> viewer's attention?"* Because the redirection is itself the content, and the
> cleanest way to redirect attention on a fixed diagram is to *subtract* the
> things you want ignored, not to push the lens around. If the camera panned
> from the left badges up to the top-right partner, you'd be moving the frame
> *and* the focus at once — motion-on-motion, and the viewer can't tell whether
> the partner is important because it's new or because the camera chose to look
> at it. By holding the frame and dropping everyone except the Agent to 0.35,
> the scene says "look here" with contrast, which is unambiguous. The camera in
> this video moves exactly once, in the bookend (scene 6), and only to reframe
> the whole chain as one node in an ecosystem — never to point at a beat. This
> scene's beat is pointed at by dimming.
>
> *"Why dim instead of just brightening the new partner?"* Same reason scene 2
> dimmed the downstream to make the entry focal: a single focal element reads
> only against a dimmed field. Brightening the partner while leaving the five
> badges and the pill at full would give you *two* bright regions competing for
> the eye. The dim-flip is the project's standard refocus move — drop the old
> actors to 0.35, leave the new focus at full — and it's used here precisely so
> the viewer's eye lands on the Agent (the thing that's about to become a
> caller) and the partner it's about to call, and nothing else.

## Beat 0 — the dim-flip (the focus inverts)

```ts
const dimIn  = interpolate(t, [0.4, 1.0], [0, 1], { /* clamp */ });
const dimOut = interpolate(t, [10.6, 11.3], [1, 0], { /* clamp */ });
const dimAmt = dimIn * dimOut;
```

The dim ramps *in* over **0.4 → 1.0s** and ramps back *out* over **10.6 →
11.3s**, multiplied together so `dimAmt` is a single envelope: up at the top,
held through the run, released at the very end. It's applied to everything that
isn't the Agent — the five badges (`dim: dimAmt`), the entry block (`entry:
{dim: dimAmt}`), the Response (`response: {dim: dimAmt}`), the pill (`dimmed:
dimAmt`), and the caller spokes and chain edges, which drop only partway
(`opacity: 1 - 0.45 * dimAmt`).

> *"Why does the dim hit 0.35 on the blocks but the edges only drop to ~0.55?"*
> Look at the two formulas. The block dim runs through `visOpacity`, which
> computes `(opacity) * (1 - 0.65 * dim)` — so at full `dimAmt = 1` a block sits
> at `1 − 0.65 = 0.35`. The edges and spokes use `1 − 0.45 * dimAmt`, bottoming
> out at `0.55`. The blocks dim harder than the wires on purpose: the wires are
> *structure* (they tell you the chain is still wired together) while the blocks
> are *actors* (they tell you who's doing something). You want the structure to
> recede but stay legible — a fully-dark wire would read as "disconnected" — and
> the actors to recede further so the one lit actor pops. Two different dim
> depths, two different jobs.
>
> *"Why ramp the dim in over 0.6s instead of snapping it?"* Because the flip is
> a *transition of attention*, and attention doesn't teleport. A 0.6s fade lets
> the viewer's eye follow the brightness shifting rather than being yanked. It's
> also the same duration as the badge entrances and the spoke draws below, so
> every motion in the scene's opening shares one cadence and reads as composed.
>
> *"Why is `dimAmt` a product of an in-ramp and an out-ramp rather than one
> window?"* So the *release* at the end is a single, separately-timed event
> (`10.6 → 11.3`), independent of the in-ramp. The dim holds flat at 1 for the
> whole run because `dimIn` has clamped to 1 and `dimOut` hasn't started yet;
> multiplying them gives you "fade up, hold, fade down" with two independent
> edges you can tune without touching the middle. The un-dim is the scene's
> closing breath, and it's deliberately *after* the rows revert — the world
> only brightens back once the new identity (the third chip) exists and the run
> is done.

## Beat 1 — the partner appears, the spoke draws, the chip grows

Three entrances, staggered, each its own beat:

```ts
const partnerReveal = popIn(frame, fps, 1.2);                 // badge springs in
const partnerSpoke  = interpolate(t, [1.9, 2.6], [0, 1], {easing: EASING.out});
const chipReveal    = interpolate(t, [2.8, 3.5], [0, 1], {easing: EASING.out});
```

The partner badge springs in at **1.2s** via `popIn` — the same spring (damping
14, stiffness 160, 0.6s, scale 0.82→1) that brought in every client badge in
scenes 3–4. Its spoke draws on over **1.9 → 2.6s**, `EASING.out`. Then the
`pricing_intel` chip grows onto the Agent's Tools row over **2.8 → 3.5s**,
`EASING.out`.

> *"Why `popIn` for the badge but a plain `interpolate` for the spoke and the
> chip?"* Because `popIn` is a *spring* — it has a slight organic overshoot, the
> little settle that makes a card feel like it dropped into place. That's right
> for an object *arriving* (a badge is a thing). A spoke *draws* and a chip
> *grows*; those are not arrivals, they're a line being traced and a width
> expanding, and a spring overshoot on a line length or a block width would read
> as a glitch (the wire would over-extend and snap back, the block would jiggle).
> So: spring for the badge entrance, eased ramp for the geometry that
> extends. This is the same split scene 3 made between its badge `popIn` and its
> spoke draw.
>
> *"Why this 1.2 / 1.9 / 2.8 stagger — roughly 0.7s apart?"* The three
> entrances are a *causal sentence*: a partner exists (badge) → your agent can
> reach it (spoke) → so it gains a tool (chip). Spacing them ~0.7s apart lets
> the eye land on each in turn and read the dependency — you can't draw a spoke
> to a badge that isn't there yet, and the chip is the *consequence* of the
> spoke connecting, so it comes last. Firing them together would collapse three
> ideas into one flash. The spacing is wider than scene 4's 0.45s roll-call
> stagger on purpose: this is three *different* events building on each other,
> not one event repeated five times, so each gets more air.
>
> *"The badge springs in at the top-right, not the left edge like every other
> badge — why?"* This is the whole flip, drawn spatially. The five client
> badges live at the **left** because they call *in* to the entry's target
> handle; the data and control flow rightward into your chain. The partner lives
> at the **top-right**, off the Agent's *source* handle, because your agent
> calls *out* to it — the direction is reversed, so the geometry is reversed.
> The layout encodes the semantics: left = "calls me," top-right = "I call." A
> viewer who absorbed scenes 3–4 reads the new position as "this one's the other
> direction" before a word of narration.

### The chip grows, it doesn't pop — and why that needs `toolsWrapReveal`

The chip reveal does double duty. `chipReveal` feeds both the chip's own opacity
*and* `toolsWrapReveal` on the Agent's `SimBlock`:

```ts
mcpChip={{reveal: chipReveal, ring: chipRing}}
// inside the rig:
toolsWrapReveal={mcpChip ? (mcpChip.reveal ?? 0) : 1}
```

The `pricing_intel` chip is the third tool on the row (`Search`, `Docs`,
`pricing_intel`), and it wraps to a second line. `toolsWrapReveal` opens that
second line at its exact natural height *in sync with* the chip fading in, so
the block **grows to fit the new tool** rather than the chip popping into a line
that was already there.

> *"Why bother syncing the wrap-line height to the chip — why not just leave
> room for it from the start?"* Because leaving room from the start would mean
> the Agent block was *taller than its contents* in scenes 1–4, which is a lie:
> in those scenes the agent had two tools, so its Tools row was one line. The
> block's height must always equal what it actually holds. When the agent gains
> a tool, the block *gets taller* — that's the honest depiction of "a tool was
> added." Driving the wrap height off the chip reveal makes the growth a single
> smooth event: as the chip fades up, the line opens beneath it, and the block
> settles at its new natural height with no pop, no reflow, no frame where the
> chip floats in empty space. It's the same exact-natural-height discipline the
> entry morph uses to keep its height *constant* — here applied in reverse, to
> let height *change* truthfully.
>
> *"Why is the chip MCP purple with the MCP glyph, when Search and Docs are
> other colors?"* Because the chip's appearance is the product's own MCP-tool
> identity, not a choice. `pricing_intel` is another team's *deployed workflow*,
> surfaced inside your agent as an MCP tool — and the product renders MCP tools
> with `#6366F1` and the `McpIcon` (`tool-input.tsx`). So the chip looks exactly
> like what it is: not a built-in capability (Search/Docs), but a *remote agent
> wearing a tool's clothes*. The color is the tell that this tool lives on
> somebody else's server.

## Beat 2 — the run fires, with a deliberately long middle

```ts
const run = runBeats(t, 4.6, {midDur: 2.4, hold: 1.0});
```

One run, anchored at **4.6s**, editor-origin (no caller badge lights — the
`Octave Systems` input is typed by you, same as scene 1's baseline). The grammar
plays exactly as scene 1 taught it, with anchor `a = 4.6` and `midDur = 2.4`:

- `Octave Systems` dip-swaps into the entry's Input row over **4.6 → 4.95s**
  (`run.inputMix`), and the Messages `<start.input>` tag resolves to the same
  value over ~**5.65 → 6.05s** (`run.msgMix`) — the moment `pulse1` lands.
- `pulse1` rides edge 1 over **5.1 → 5.75s** (`run.pulse1`), into the Agent.
- the Agent's live ring (`run.midLive`) is on from **5.7s to 8.1s** — `a + 1.1`
  to `a + 1.1 + midDur`.
- `pulse2` rides edge 2 over **8.1 → 8.75s** (`run.pulse2`), into the Response.
- `"voice agents"` resolves into the Response Data template over **8.75 → 9.1s**
  (`run.respMix`).
- everything reverts together over **10.1 → 10.45s** (`respStart + 0.35 + hold`
  = `8.75 + 0.35 + 1.0` = `10.1`).

> *"Why `midDur: 2.4` — why stretch the live window to 2.4s when scene 1's
> default middle is a fraction of that?"* Because in this scene **the agent's
> work *is* the outbound call.** In scene 1, the live window was the agent
> thinking and calling its local Search tool — a quick beat. Here, the live
> window has to contain an entire *round trip to another server*: the chip
> rings, a pulse leaves on the partner spoke, travels out, the remote agent runs,
> the pulse comes back. That's a sequence of five sub-beats (below), and they
> need room to read as cause-and-effect rather than a blur. 2.4s is sized to fit
> the whole out-and-back with air on each side. The middle is long *because the
> tool call is long* — the duration is honest about what's happening inside it.
>
> *"Why an editor run and not a caller badge driving it?"* Because the point of
> *this* scene is your agent as a *caller of others*, and the cleanest way to
> isolate that is to have the run originate from you (the builder) so the only
> "calling out" in frame is the one to the partner. If a client badge had also
> lit, the frame would carry two call directions at once — inbound *and*
> outbound — which is precisely scene 6's job (the bookend), not this one's.
> Keeping the origin in the editor lets the outbound leg be the sole new event.
> One idea per scene.

## Beat 3 — the three-surface sync (the tool call out and back)

This is the scene's signature move and the mirror of scene 3's caller round
trip. *Inside* the Agent's long live window, the outbound call fires as one
event seen on three surfaces at once:

```ts
const chipRing    = Math.min(c(t, 5.9, 6.15), c(t, 7.7, 7.95, 1, 0));  // chip ring up then down
const outPulse    = c(t, 6.1, 6.8);                                     // pulse rides spoke OUT
const backPulse   = c(t, 7.0, 7.7);                                     // pulse rides spoke BACK
const partnerBlue = Math.min(c(t, 6.0, 6.3), c(t, 7.0, 7.3, 1, 0));     // partner: call in flight
const partnerGreen= Math.min(c(t, 7.65, 7.9), c(t, 8.4, 8.9, 1, 0));    // partner: reply landed
```

```tsx
<PathPulse d={pp.d} len={pp.len} p={outPulse} />
<PathPulse d={pp.d} len={pp.len} p={backPulse} reverse />
```

Read it in time order. The chip rings up over **5.9 → 6.15s** — *0.2s after the
live ring started at 5.7* — and the partner badge goes blue over **6.0 → 6.3s**.
The outbound pulse departs over **6.1 → 6.8s**, riding the partner spoke from
the Agent's source handle up to the top-right. Then the return pulse rides the
*same path in reverse* over **7.0 → 7.7s**. As it arrives home, the chip ring
*releases* over **7.7 → 7.95s** — and the partner badge flashes green over
**7.65 → 7.9s**, decaying over **8.4 → 8.9s**.

> *"What is the 'three-surface sync,' exactly?"* It's one event — "your agent
> called the partner tool and got a result" — drawn simultaneously on three
> different surfaces: the **chip** on the Tools row (rings while the call is in
> flight), the **wire** (a pulse out then back), and the **remote server** (blue
> while the call is out, green when its reply lands). All three are tied to the
> same moment by construction: the chip rings as the pulse leaves, the chip
> releases as the pulse gets home, the partner goes green as the reply settles.
> A viewer reads them as one fact seen from three angles, not three separate
> animations. This is the exact same discipline scene 1 used to nest the Search
> chip ring *inside* the live window — except here the nested tool call also
> travels a wire to a remote server and comes back.
>
> *"Why does the chip ring up at 5.9, 0.2s after live starts at 5.7 — not at the
> same instant?"* Same cause-then-effect lead scene 1 used: the agent goes live
> first (it started working), *then* it reaches for a tool. A 0.2s gap lets the
> eye register "the agent is running" before "and it's calling out." Firing the
> live ring and the chip ring on the same frame would read as one undifferentiated
> flash and lose the nesting that says "the call happens *during* the work."
>
> *"Why does the chip ring release exactly when the return pulse gets home
> (7.7)?"* Because the chip ring *means* "this tool call is in flight." It must
> be on for precisely the interval the call is outstanding — from when the
> outbound pulse leaves (chip up at 5.9, pulse out at 6.1) to when the reply
> arrives (back pulse ends 7.7, chip down at 7.7). Releasing the ring at any
> other moment would desync the chip from the wire and break the claim that
> they're one event. The chip ring's lifetime *is* the call's lifetime.
>
> *"Why is the return pulse a `reverse` `PathPulse` on the identical path rather
> than a second wire?"* Because in MCP the result returns to the *caller* over
> the same connection — there is no separate "reply channel." Drawing the reply
> on the exact same geometry, just played end→start (`reverse` flips the
> dash-offset math so the streak travels target→source), is the product truth:
> one connection, used both ways. This is the precise mirror of scene 3, where
> the *caller's* reply rode its spoke *back* to the badge. Same move, opposite
> direction — which is, again, the whole symmetry argument drawn in light.
>
> *"Why blue then green on the partner, with that gap?"* Same product grammar as
> the client badges: blue while a call is outstanding, green when its reply has
> landed. The partner goes blue **6.0 → 6.3** (the call is out), holds, then the
> blue is released and green flashes **7.65 → 7.9** as the reply settles,
> decaying a second later. It's the literal inverse of a client badge: a client
> badge goes blue when *it* calls *you*; the partner badge goes blue when *you*
> call *it*. The state vocabulary is identical because the protocol is identical
> — only the arrow's direction differs.
>
> *"Why does the outbound pulse start at 6.1 and the return at 7.0 — a ~0.2s gap
> at the top before it turns around?"* The out leg runs 6.1→6.8; the back leg
> runs 7.0→7.7. The small gap (6.8→7.0) is the *remote work* — the moment the
> partner's own agent is running, somewhere else, before it answers. It's tiny
> because we don't show the remote chain (it's someone else's workspace, off
> our canvas), but the beat of stillness at the far end of the spoke says "and
> now it's their turn" without drawing their machinery.

## The partner spoke — why it's a hand-rolled path, not a straight wire

The caller spokes in scenes 3–4 are simple smooth-step edges (`simEdgeD`). The
partner spoke is a custom path built in `partnerPath()`:

```ts
// out of the Agent's source handle, a short hop right into the
// agent↔response channel, UP, then right into the partner badge:
const d = `M ${x1} ${y1} L ${xm - r} ${y1} Q ${xm} ${y1} ${xm} ${y1 - r}
           L ${xm} ${y2 + r} Q ${xm} ${y2} ${xm + r} ${y2} L ${x2} ${y2}`;
```

It leaves the Agent's source handle (the same point edge 2 leaves from), hops
right to the center of the agent↔response channel, turns *up* the channel, then
turns *right* into the partner badge — a rounded-elbow L, in the same visual
language as the product's edges.

> *"Why route it up through the channel between the Agent and the Response
> instead of drawing a straight diagonal to the top-right?"* Two reasons. First,
> a straight diagonal would cross over the Response block and its edge — visual
> collision, and it would imply the call comes *from* the response, which is
> false (it comes from the agent, mid-run). Routing up the existing
> agent↔response channel keeps the spoke in the empty corridor that's already
> there, crossing nothing. Second, the rounded-elbow language *matches the
> product's own edges* — Sim draws connectors as smooth-stepped right-angle
> paths, not diagonals, so a diagonal here would read as "not a Sim wire." The
> hand-rolled path buys a clean route *and* keeps the connector in the product's
> grammar. The `len` is computed exactly (segment lengths minus the corner radii
> plus the arc lengths) so the `PathPulse` dash math travels the true path
> length and the streak neither overshoots nor stalls at the corners.

## Beat 4 — the chain finishes and reverts; the world un-dims

After the return pulse lands and the partner goes green, the run completes
normally: `pulse2` crosses edge 2 into the Response (**8.1 → 8.75s**), `"voice
agents"` resolves into the Data template (**8.75 → 9.1s**), and everything
reverts together over **10.1 → 10.45s** — the Input row, the Messages tag, and
the Response value all dip back to their templates as one. Then the dim releases
over **10.6 → 11.3s**, brightening the badges, entry, pill, and wires back to
full.

> *"Why does the world un-dim *after* the rows revert, not during?"* Because the
> un-dim is the scene's closing statement — "the new tool now permanently
> belongs to this agent, and the ecosystem is whole again" — and it should land
> on a *settled* frame, not on top of a value still dipping. Reverting the rows
> first returns the chain to its neutral template; *then* the lights come back
> up on the full, settled ecosystem. Overlapping the un-dim with the revert
> would stack two changes and muddy both. Sequence, don't stack — the same rule
> every beat in this video follows.
>
> *"Why do the chip, partner badge, and spoke stay after the run, while the run
> values revert?"* This is the **residue** rule, identical to scenes 3–4: the
> *values* of a run are transient (they belong to that one call and revert), but
> the *structure* the scene added is permanent (the world only grows). The agent
> *gained* a tool — that's a lasting change to what it can do, so the chip,
> the partner it points at, and the spoke connecting them all persist to the
> end. Scene 6 opens with exactly this residue at full reveal. If the chip
> reverted with the values, you'd be saying the tool was borrowed for one call,
> which is false — it's installed.

## The values, and where they all trace to

Every value on screen comes from `grounding-v1.md` — nothing is invented in the
scene file:

| surface | value | source |
|---|---|---|
| entry Input (resolved) | `Octave Systems` | grounding: scene-5 editor run input |
| Agent Messages tag | `<start.input>` → `Octave Systems` | `ResolvedTag` on `msgResolve` |
| Agent Model row | `claude-sonnet-4-6` | rig default (the Scout chain) |
| Agent tools | `Search`, `Docs`, **`pricing_intel`** | `CHIP_SEARCH`, `CHIP_DOCS`, `mcpChipDef` |
| partner server | `pricing_intel`, `#6366F1` + MCP glyph | grounding: partner tool; `tool-input.tsx` color |
| Response Data (resolved) | `<scout.content>` → `"voice agents"` | grounding: `Octave Systems → "voice agents"` |
| Response Status | `200` | rig default |
| tool pill (dimmed) | `research_competitor · sim.ai/api/mcp/serve/…` | grounding: your deployed identity |

> *"Why is the resolved input `Octave Systems` here when scene 4 also used
> `Octave Systems` for its Sim-client run?"* They're the same string by design,
> but read carefully — in scene 4 `Octave Systems` was driven *in* by the Sim
> client badge (an inbound call), and here it's typed by *you* in the editor (an
> outbound-demonstrating run). Reusing the input keeps the *resolved tag*
> machinery identical across the boundary while the *origin* differs, which is
> exactly the point being made: same run, different direction. The brief it
> resolves to — `"voice agents"` — is `Octave Systems`'s grounded brief from the
> corpus; it's the honest output of researching that (fictional) company.
>
> *"Why does the partner badge and the chip share the name `pricing_intel`?"*
> Because they're the same thing seen at two scales: the **chip** is how the
> partner's deployed workflow appears *inside your agent* (a tool on the Tools
> row), and the **badge** is that same workflow as it lives *on its own server*
> (top-right). One MCP tool, drawn both as the consumer sees it and as the
> supplier hosts it — which is the whole economy in one object.

## How to think about the whole scene

Walk the decisions in causal order and the scene is just the inbound story, run
backwards and drawn truthfully:

1. *How do I flip the focus from the callers to the agent?* Dim everyone except
   the Agent (0.35 on blocks, 0.55 on wires) → contrast, not camera.
2. *How do I show "your agent can now use their tool"?* A partner badge at the
   **top-right** (the reverse position) + a spoke out of the Agent's *source*
   handle + a `pricing_intel` chip that **grows** the block → the geometry
   encodes the reversed direction; the block gets taller because it honestly
   gained a tool.
3. *How does the tool call read as the same protocol?* Quote `runBeats`
   verbatim, with a long middle → it's the same run, recognizably.
4. *How do I draw "it called out and got a result back"?* A three-surface sync —
   chip ring ↔ pulse out-and-back on the partner spoke ↔ partner blue-then-green
   → one event, three faces, in the product's own state language.
5. *What persists, what reverts?* Values revert (transient); chip, badge, spoke
   stay (residue — the world only grows).
6. *How does it end?* Rows revert, *then* the world un-dims on the settled,
   complete ecosystem → a settled hold scene 6 can inherit and stretch.

Every one of those is a mirror of a choice an earlier scene already made — the
dim-flip from scene 2, the badge+spoke from scene 3, the run grammar from scene
1, the residue from scenes 3–4. The scene's quality is that it *reuses* all of
them pointed the other way, so the flip lands as "oh, it's the same thing
backwards" rather than as a new trick. That recognition is what makes the loop
close, and the closed loop is what makes it an economy.

## Exit state (what scene 6 inherits)

`all five client badges + spokes present (un-dimmed) · partner badge
`pricing_intel` present top-right (reveal 1) · partner spoke drawn · the
`pricing_intel` chip on the Agent's Tools row at reveal 1 (block at its taller
natural height) · tool pill on, un-dimmed · rows reverted to template · world
fully un-dimmed · no camera transform`.

Scene 6 opens on exactly this frame — the **full ecosystem**: five callers left,
the chain center, the partner top-right, the pill above the entry — and only
then begins the video's single camera move (the 7% pull-back) before firing the
bookend run that carries *both* directions at once. Because both scenes render
the same `<EconomyRig/>` and scene 6 simply inherits the partner, chip, and
spoke at full reveal, that boundary is identical down to the pixel.

<!-- ── agent-economy / 06-the-agent-economy.md ── -->

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

<!-- ── agent-economy / CHOREOGRAPHY.md ── -->

# agent-economy — choreography notes

**Verdict:** BEST NARRATION (hype reel 1). **Branch:** `hype/agent-economy`.
**Comp:** `agent-economy-v1` · 78.3s @ 60fps (VO-stretched: 9 / 12.3 / 11.6 /
17.2 / 13.3 / 14.9 per `public/vo/agent-economy-v1/manifest.json`).
**Run economy:** 9 runs — 1 editor baseline, 1 stranger call, 4 compressed
rush calls (the deliberate exception: the COUNT is the content), 1 outbound
flip, 1 bookend carrying both directions. All times below are seconds into
the scene (`t = frame/fps`), read off the actual `interpolate` windows.

## The one idea

Deploy a workflow as an MCP tool and it becomes infrastructure other agents
call; the same protocol lets your agent call theirs. Every scene is one more
caller (or one more direction) on the SAME unmoving Scout chain — the
choreography argues multiplicity, never relayouts.

## The shared machinery (read this first — every scene leans on it)

- `runBeats(t, a, {midDur, hold})` (module-5 `_v3.tsx`) is the canonical run
  grammar. With anchor `a`: `inputMix` dips at `[a, a+0.35]`; `startBlip`
  ring `a+0.25 → a+0.75`; `pulse1` rides edge 1 `[a+0.5, a+1.15]`; `midLive`
  ring on the Agent `a+1.1 → a+1.1+midDur`; `msgMix` resolves `[a+1.05,
  a+1.45]` — the Messages tag fills **the moment pulse1 arrives at the
  block** (cause precedes effect by construction); `pulse2` `[a+1.1+midDur,
  a+1.75+midDur]`; the Response value resolves at `respStart = a + 1.75 +
  midDur` (0.35s dip), then everything reverts together at `respStart +
  0.35 + hold` over 0.35s.
- `mcpCall(t, a)` wraps `runBeats` with the round trip: `spokeIn` pulse
  `[a−0.7, a−0.05]` (the caller's pulse ARRIVES exactly as the Input row
  starts dipping — two surfaces, one event); badge ring goes blue at
  `[a−1.0, a−0.7]` (the badge lights 0.3s BEFORE its pulse departs — intent
  precedes packet); `reply` rides the SAME spoke back at `[respStart+0.55,
  respStart+1.2]`; blue fades as the reply launches; green flashes up over
  0.25s as the reply lands and decays over 0.6s one second later.
- `popIn(frame, fps, delay)` = spring (damping 14, stiffness 160, 0.6s) —
  every badge entrance is this one spring, scale 0.82→1.

## Scene 1: an-agent-you-built (0–9s)

INTENT: you built a real agent — and it runs when YOU run it. Establishes
the run grammar so every later scene can quote it.
CAMERA: static full-frame on the chain. No move — the first scene earns the
frame before anything is allowed to move it.
CHOREOGRAPHY:
- Assembly stagger: entry fades `ease(0.3, 0.9)`, Agent `ease(0.75, 1.35)`,
  Response `ease(1.2, 1.8)` — a strict 0.45s offset, all `EASING.out`.
  Edge 1 draws `[1.0, 1.6]` and edge 2 `[1.45, 2.05]`: each wire starts
  drawing WHILE its downstream block is still fading in, so assembly reads
  as one continuous left→right wave, not three pops then two lines.
- One run: `runBeats(t, 3.6, {hold: 1.0})` → `Vantra Labs` dips into Input
  `[3.6, 3.95]`, startBlip `3.85–4.35`, pulse1 `[4.1, 4.75]`, Agent live
  `4.7–5.4`, `<start.input>` resolves `[4.65, 5.05]` as the pulse lands.
- Tool-call sync: the Search chip rings `[4.95, 5.2]` up / `[5.6, 5.85]`
  down — INSIDE the Agent's live window, 0.25s after the live ring starts.
  The nesting says "the agent, while working, called its tool".
- pulse2 `[5.4, 6.05]`; `"AI infra, Series B"` resolves `[6.05, 6.4]`;
  rows revert together `[7.4, 7.75]`.
HOLDS: 1.8→3.6s assembled-but-idle (1.8s, static — acceptable setup pause);
7.75→9s on the reverted template (1.25s breath before the cut). Both under
the dead-hold cap; only `CanvasDots` texture, no ambient motion.

## Scene 2: deploy-as-a-tool (9–21.3s)

INTENT: ONE change — deploy onto an MCP server — gives the same chain a tool
name and an address. Nothing else may move, so the one change reads.
CAMERA: static. The focus move is done with DIMMING, not framing.
CHOREOGRAPHY — a strict serial cause chain, each event waiting for the last:
- Dim-in `[0.5, 1.1]`: Agent + Response drop to 0.35 effective opacity,
  edges to 0.55 — the entry becomes focal by subtraction.
- Editing ring on the entry `t ∈ [1.2, 2.8)` — the product's "selected"
  language fires BEFORE the morph (0.3s lead): someone selected it, then it
  changed.
- Header morph Start→API `[1.5, 2.3]`, `EASING.inOut` (a transform, not an
  entrance); the crossfade is gated to mix `0.3–0.7` so there is never a
  double-exposed header; the Input row is pixel-identical throughout —
  height constant, zero relayout.
- MCP pill fades+drops in `[3.1, 3.7]`, `EASING.out`, sliding down 14px
  (`top + (1−reveal)*14`) — 0.8s AFTER the morph settles, its own beat.
- Un-dim `[4.6, 5.3]`: the world returns only after the new identity exists.
HOLDS: 5.3→12.3s (≈7s) on the deployed state. This is the VO-stretch hold —
narration reads the pill while it sits. Nothing moves but `CanvasDots`
texture: a DEAD hold by the ambient-motion test, survivable only because the
narration is actively naming what's on screen. Flag: the weakest hold in the
video; a live-dot shimmer on the pill would have earned it.

## Scene 3: a-stranger-calls (21.3–32.9s)

INTENT: an MCP client's tool call is JUST a workflow run — same grammar as
scene 1, different origin. The viewer must recognize the rhyme.
CAMERA: static; the new actor enters at the left edge (off-canvas world made
visible), chain untouched.
CHOREOGRAPHY:
- Claude Desktop badge springs in at `popIn(0.7)`; its spoke draws
  `[1.5, 2.2]` `EASING.out`; the entry's target handle appears at exactly
  `t ≥ 2.2` — the handle materializes the frame the spoke finishes, so the
  wire never points at nothing.
- `mcpCall(t, 3.4)`: badge blue `[2.4, 2.7]` → spoke pulse in `[2.7, 3.35]`
  → `Northwind AI` dips in `[3.4, 3.75]`. Three beats, 0.3–0.7s apart:
  intent → packet → arrival. Then the chain runs verbatim scene-1 grammar
  (pulse1 `[3.9, 4.55]`, live `4.5–5.2`, pulse2 `[5.2, 5.85]`, resolve
  `[5.85, 6.2]`).
- The reply rides the SAME spoke back `[6.4, 7.05]` (reverse dash-offset on
  the identical path — product-true: MCP results return to the client);
  blue fades `[6.4, 6.7]` as the reply launches; green flashes `[6.95, 7.2]`
  as it lands, decays `[8.05, 8.65]`.
- Rows revert `[7.3, 7.65]`; badge + spoke STAY (residue — the world is
  permanently bigger now).
HOLDS: 7.65→11.6s (≈4s) on deployed-state-B. Dead apart from canvas texture;
narration carries it. Borderline at the 3s cap.

## Scene 4: the-rush (32.9–50.1s) — the money shot

INTENT: you published once — five platforms now treat your workflow as
infrastructure. Multiplicity IS the lesson; the choreography must feel like
incoming traffic, not four replays.
CAMERA: static. The density comes from overlap, not movement.
CHOREOGRAPHY:
- Four badges pop in around Claude Desktop at `popIn(0.5 / 0.95 / 1.4 /
  1.85)` — uniform 0.45s stagger (this is ROLL CALL, so even rhythm is
  right); each spoke draws `[pop+0.35, pop+0.95]`, chasing its badge.
- **Accelerating cadence**: run anchors `a = 3.2, 4.8, 6.2, 7.4` — gaps
  1.6 / 1.4 / 1.2s. The compression is the point: by run 3 the viewer feels
  the calls arriving faster than they resolve.
- Per run (compressed grammar): badge blue `[a−0.25, a]`; spoke pulse in
  `[a, a+0.6]`; startBlip `a+0.5–a+0.85`; pulse1 `[a+0.7, a+1.25]`; live
  `a+1.25–a+1.75`; pulse2 `[a+1.75, a+2.3]`; reply back `[a+2.5, a+3.1]`;
  green `[a+3.0, a+3.25]` decaying `[a+3.7, a+4.3]`.
- **De-phased streams**: with 1.2–1.6s gaps against a ~3.1s round trip,
  three runs are airborne at once — e.g. at t≈6.3, Cursor's green is
  decaying, Claude Code's Agent is live, and VS Code's inbound pulse is on
  its spoke. The frame reads as a SYSTEM under load.
- **Chain-swap rows** (`chainSwap`): the rows never revert between runs —
  `Helio Robotics → Quartzline → Parcelio → Lumora Grid` dip-swap value→
  value, each landing at `a+0.55` (Input), `a+1.2` (Messages), `a+2.3`
  (Response), 0.35s dips. The row is continuously busy; the block state
  rings are unioned across runs so overlapping calls share one chain.
- One revert at `[12.0, 12.35]` after the last green decays (11.7).
HOLDS: 12.35→17.2s (≈4.8s) on the settled five-badge frame — the breath
after the payoff, earned. Static apart from canvas texture.

## Scene 5: you-call-theirs (50.1–63.4s)

INTENT: the protocol is symmetric — someone else's deployed agent becomes a
tool chip inside YOURS. The focus must flip from the left edge (inbound) to
the top-right (outbound).
CAMERA: static; the flip is done by inverting the dim — badges + entry +
pill drop to 0.35 `[0.4, 1.0]`, leaving the Agent focal.
CHOREOGRAPHY:
- Partner badge (`pricing_intel`, MCP purple) springs in top-right at
  `popIn(1.2)`; its spoke draws from the Agent's source handle `[1.9, 2.6]`;
  the `pricing_intel` chip grows on the Tools row `[2.8, 3.5]` at exact
  natural width WITH `toolsWrapReveal` opening the wrap line in sync — the
  block grows, never pops. Three entrances, ~0.7s apart, all `EASING.out`.
- One run with a LONG middle: `runBeats(t, 4.6, {midDur: 2.4})` — the
  Agent's live window `5.7–8.1` is stretched to 2.4s because the agent's
  work IS the outbound call, and the call needs room:
  - chip rings `[5.9, 6.15]` (0.2s after live starts) → outbound pulse
    departs `[6.1, 6.8]` → partner blue `[6.0, 6.3]` → return pulse
    `[7.0, 7.7]` → chip ring releases `[7.7, 7.95]` exactly as the pulse
    gets home → partner green `[7.65, 7.9]`, decaying `[8.4, 8.9]`.
    Chip-ring ↔ pulse ↔ partner-ring is a three-surface sync: the same
    event seen on the tool row, the wire, and the remote server.
- pulse2 `[8.1, 8.75]`; `"voice agents"` resolves `[8.75, 9.1]`; revert
  `[10.1, 10.45]`; un-dim `[10.6, 11.3]` — chip, badge, spoke remain
  (residue again).
HOLDS: 11.3→13.3s (2s) on the full ecosystem — short, alive with the fresh
un-dim still settling. Good.

## Scene 6: the-agent-economy (63.4–78.3s) — bookend

INTENT: both directions in ONE traversal — every agent is a tool and a
tool-user. The frame must end balanced and green.
CAMERA: the only camera move in the video — pull back 7% (`s = 1 − 0.07·e`,
`e` over `[0.6, 1.9]`, `EASING.inOut`, scaled about frame center). It exists
to reframe the chain as one node in an ecosystem, and it happens BEFORE the
run so the move never competes with the action.
CHOREOGRAPHY (anchor `a = 2.8`, hand-rolled to interleave both directions):
- Inbound: Claude Code blue `[1.85, 2.15]` → spoke pulse `[2.1, 2.75]` →
  `Drift Harbor` dips `[2.8, 3.15]` → entry stamps green ok at `3.25` →
  pulse1 `[3.3, 3.95]` → Agent live `3.9–5.9`.
- MID-RUN the outbound leg fires INSIDE the live window: chip rings
  `[4.1, 4.35]` → out pulse `[4.3, 5.0]` → partner blue `[4.2, 4.5]` →
  back pulse `[5.2, 5.9]` → partner green `[5.85, 6.1]` AS the Agent stamps
  ok at `5.9` — the remote reply and the local completion are one moment.
- pulse2 `[5.9, 6.55]` → response resolves `[6.55, 6.9]`, stamps ok `6.95`
  → reply rides back out `[7.1, 7.75]` → Claude Code green `[7.7, 7.95]`
  and HOLDS — no decay, no revert. The green-settle is strictly causal
  order (entry 3.25 → agent 5.9 → response 6.95 → caller 7.95): the state
  walks the same path the data did.
HOLDS: ≈7.95→14.9s (≈7s) on the final green frame. Earned (it's the
thesis-image: five callers, the chain, the partner, everything green) but
ambient-dead — the per-element green rings hold statically. The VO is
delivering the closing argument over it, which is what saves it.

## The moves used

- **Run grammar quoting** — scene 1 teaches `runBeats`; scenes 3–6 quote it
  verbatim so "a stranger's call is just a run" is shown, not said.
- **Caller-spoke round trip** — `PathPulse` forward then `reverse` on the
  IDENTICAL path; reply-to-caller is product truth made visible.
- **Two-surface sync** — badge ring ↔ row dip (`spokeIn` ends at `a−0.05`,
  `inputMix` starts at `a`); chip ring ↔ outbound pulse ↔ partner ring.
- **Accelerating cadence** — rush gaps 1.6/1.4/1.2s against a ~3.1s round
  trip ⇒ three calls airborne at once (de-phased streams).
- **Chain-swap rows** — values dip value→value with no template between;
  one revert at the end of the burst.
- **Residue accumulation** — each scene leaves its badge/spoke/chip behind;
  the world only grows.
- **Dim-flip refocus** — focus moves by dimming (0.35) the old actors, not
  by moving the camera.
- **Handle-on-contact** — the target handle appears the frame the spoke
  finishes drawing.
- **Pull-back bookend + causal green settle** — one 7% ease-out reframe,
  then ok-states stamped in data order, ending on a held green frame.

═══════════════════════════════════════════════════════════════════════
# EXEMPLAR: voice-agent
═══════════════════════════════════════════════════════════════════════

<!-- ── voice-agent / 01-the-workflow.md ── -->

# Scene 1 — `the-workflow`  ·  archetype: **assemble**

Source: `../source/scenes/TheWorkflowScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/states.ts` (`S1_THE_WORKFLOW`), `../source/scenes/_anim.ts`,
`../source/layout.ts`, `../source/transcript-data.ts`.

This is the opening scene, and it does exactly one thing: it shows you the
workflow the whole video is about — a normal, product-true Sim chain, except
one block in it places phone calls. Read it as the worked example for "how do I
assemble a workflow left-to-right and plant the one idea that makes it special,
without a word on screen."

---

## What this scene is for

The video's whole thesis is "give an agent a phone and it doesn't just answer —
it *calls*." Before any of that can land, you have to establish the workflow as
an ordinary object: a Start, an agent that pulls the day's appointments, and a
Parallel container that will call each one. The scene's job is to *build that
chain in front of the viewer*, block by block, so that by the end they've read a
left-to-right Sim workflow and understood its shape — and then to plant the one
detail that makes it a *voice* agent: the `<parallel.currentItem>` reference in
the Call block's "To Number" row, the wiring that turns one lane into N calls.

So the rule the scene follows is *one idea per scene*: this scene is "here is the
workflow," full stop. No run, no calls, no panels, no table. The aside band
below stays completely empty. Resist the urge to also fire the run here — that's
scene 2's whole job. This scene assembles and then *rests* on a clean chain.

## What it looks like

The camera is on the top band — closer than neutral, the aside band cropped off
below the frame. Against the canvas dots, a workflow assembles left to right:
**Start** fades in, an edge draws to the right, **Campaign** (an agent block:
`Messages | Confirm appointments`, `Model | claude-sonnet-4.6`) fades in, another
edge draws, then the yellow **Parallel container "Call each"** draws on. Inside
it, an inner **Start pill**, then the lane: **Call** (an AgentPhone block:
`Operation | Create Call`, `To Number | <parallel.currentItem>`) and **Log
outcome** (a Table block: `Operation | Insert Row`, `Table | outcomes`), wired
together. Once the chain is whole, the `<parallel.currentItem>` tag in Call's
"To Number" row glows once and releases. Then the clean chain just sits there.

## The one real decision: render the whole set piece, assemble it with opacity

The scene renders one `<Stage/>` and feeds it the `S1_THE_WORKFLOW` preset
spread with a handful of per-block opacity and edge-progress values:

```tsx
<Stage
  frame={gf}
  state={{
    ...S1_THE_WORKFLOW,            // just { cam: CAM_WORK }
    start: {opacity: startOp},
    campaign: {opacity: campOp},
    container: {opacity: contOp},
    call: {opacity: callOp},
    log: {opacity: logOp},
    edge1: {progress: edge1Draw},
    edge2: {progress: edge2Draw},
    pillE: {progress: pillDraw},
    laneE: {progress: laneDraw},
    tagGlow,
    quiet: q,
  }}
/>
```

Three things to take from this.

**There is one set piece (`<Stage/>`) for the entire video, and every scene
renders all of it.** The aside band — the three call panels and the outcomes
`SimTable` — is *present in this scene's render tree too*; it just renders
nothing because every panel's `visible` defaults to `0` and `tableReveal`
defaults to `0` (see the `Stage` destructure in `_rig.tsx`). This is the same
discipline market-desk's scene 1 follows by rendering the schedule and the
Polymarket block `hidden`: by mounting the whole set piece in both scenes and
only animating visibility, the boundary into scene 2 is identical by
construction. Continuity stops being something you check and becomes something
you can't break.

**Assembly is opacity, not mounting.** Each block's entrance is a single
`opacity` value ramped 0→1; each edge's entrance is a `progress` value ramped
0→1 (which `SimEdgePath` reads to draw the connector on as a growing stroke). No
block is conditionally rendered in or out during the assembly — they're all in
the tree the whole time, fading up in sequence. That matters because a block
that's always mounted can't cause a layout reflow when it "appears."

**The blocks are the real registry blocks, never hand-drawn boxes.** `SimBlock`
is the actual product block component; `ParallelContainer` is a port of the docs
`preview-container-node` (the same rig loops-v1 and growth-machine use). You are
never *designing* a block here — you're configuring the ones that exist, with
their real colors, real glyphs, and real operation labels.

## The camera

```ts
S1_THE_WORKFLOW = { cam: CAM_WORK }
CAM_WORK = { px: CENTER_X (1200), py: AXIS_Y (310.75), s: 0.9 }
```

The camera is a transform of the fixed 2400×1350 stage: `px, py` is the stage
point that lands at the viewport center, `s` is the zoom. Here it's centered on
the workflow axis (`AXIS_Y = 310.75`, the vertical center of the container,
which the whole chain aligns its handles to) at **0.9×**.

> *"Why 0.9 and not the home framing's 0.8?"* Because this scene is *only* about
> the workflow — the aside band doesn't exist yet, so there's no reason to frame
> for it. `CAM_WORK` pushes in on the top band so the chain reads large and the
> empty band below is cropped out of frame entirely. Neutral framing (`CAM_HOME`,
> `s = 0.8`) shows the *whole* stage including the band; that's where scene 2
> pulls back to, *as the band is revealed*. So the 0.9 here isn't arbitrary — it's
> the first half of a camera move that completes in scene 2, and the gap between
> 0.9 and 0.8 is exactly the pull-back that lets the aside band slide into frame
> underneath the fanning chain.

> *"Why is the camera static this whole scene, then?"* Because the *content* is
> moving — eight blocks and edges assembling in sequence. A scene where the
> diagram is doing the work gets a still frame to read that work against; you move
> the frame *between* scenes, not during the ones where the diagram is busy.

## The values, and where they come from

Every on-screen string traces to `_reference/sim` and is staged in `_rig.tsx`'s
`Stage` (the workflow band) and `transcript-data.ts` (the aside content, unused
this scene). For this scene:

| Element | On screen | Source / grounding |
|---|---|---|
| Start | "Start" + start glyph | `BLOCK_COLORS.start = #2FB3FF` (the registry Start trigger) |
| Campaign | "Campaign", agent glyph | agent block, `BLOCK_COLORS.agent = #33C482` = `var(--brand)` (`agent.ts`) |
| Campaign row 1 | `Messages \| Confirm appointments` | authored config label (the campaign's instruction) |
| Campaign row 2 | `Model \| claude-sonnet-4.6` | the landing templates' authored model value (`examples.ts`: `claude-sonnet-4-6`) |
| Container | "Call each", yellow chip, split glyph | Parallel identity from `parallel-config.ts`: `bgColor #FEE12B`, `SplitIcon`, dark glyph (the product's luminance rule) |
| Inner pill | "Start" | the container's inner Start pill (docs preview-container-node) |
| Call | "Call", AgentPhone gradient chip | `agentphone.ts`: `name AgentPhone`, `bgColor linear-gradient(135deg,#1a1a1a,#0a2a14)` |
| Call row 1 | `Operation \| Create Call` | `agentphone.ts` operation label verbatim (`create_call → "Create Call"`) |
| Call row 2 | `To Number \| <parallel.currentItem>` | sub-block `toNumberCall`; the value is the parallel distribution reference (`parallel.mdx`) |
| Log outcome | "Log outcome", Table chip | `table.ts`: `name Table`, `bgColor #10B981` (= `BLOCK_COLORS.table`) |
| Log row 1 | `Operation \| Insert Row` | `table.ts` operation label verbatim (`insert_row → "Insert Row"`) |
| Log row 2 | `Table \| outcomes` | the target table name (authored; matches the aside `SimTable`) |

Two grounding notes worth internalizing, because they're the kind of decision
that separates a real port from a designed-looking fake:

**"To Number" is a declared deviation.** The verbatim sub-block title in
`agentphone.ts` is **"To Phone Number"** (`toNumberCall`). The rig shortens it to
"To Number" on purpose: the full title is wide enough that the value — the
`<parallel.currentItem>` tag, which *is* the beat of this scene — would
ellipsize at the product's native 250-unit block width. So the label is
human-shortened (growth-machine precedent) to keep the load-bearing reference
fully visible. The cost is one string if you ever want it back. Read the comment
in `_rig.tsx` at the `To Number` row — the deviation is declared in the code, not
hidden.

**The Campaign model reads `claude-sonnet-4.6`** where the registry template
writes `claude-sonnet-4-6` (dashes). That's a display nicety — the dotted form is
how the model id reads in running product — and it matches the growth-machine
grounding. Not a real config value invented out of thin air; a real template's
value rendered in its display form.

## The shared timing helpers

The whole scene's timing comes from `mkClock(frame)`, which returns `t` (local
frame in seconds, `frame / FPS`) and `c`, a clamped `interpolate` over local
seconds:

```ts
c(lo, hi, a = 0, b = 1, easing?) = interpolate(t, [lo, hi], [a, b],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing})
```

So `c(0.3, 0.9, 0, 1, EASING.out)` means "ramp 0→1 over 0.3s→0.9s, eased out,
clamped flat before and after." That's the whole vocabulary of the assembly.

There's also `sceneClock("the-workflow", frame)`, which returns `gf` (the
video-global oscillator frame) and `q` (the quiet gate). For this scene `gf` and
`q` are passed through to `<Stage/>` but barely do anything *yet* — there are no
panels to oscillate. They're being threaded in from frame zero anyway, because
every scene must thread them so the mechanism is uniform. (Scene 3 is where they
start earning their keep — see that annotation for the full treatment of the
global clock + quiet gate, the build's signature mechanism.)

## The animation, beat by beat

The assembly alternates **block fade** (`EASING.out`, an entrance) with **edge
draw** (`EASING.inOut`, a transform). That alternation is the rhythm: a block
appears, then the wire reaches out from it to the next position, then the next
block appears at that position. Each edge slightly *overlaps* the block that
follows it, so the wire arrives just as its destination does.

### (a) Start fades in — `startOp = c(0.3, 0.9, 0, 1, EASING.out)`

The Start block's opacity comes up over **0.3s → 0.9s**, eased out.

> *"Why start at 0.3 instead of 0.0?"* A short beat of empty frame before the
> first block appears reads as a deliberate open — the same reason market-desk's
> table waits until 0.2. Starting at 0.0 makes the first frame look like the
> render was already mid-load.
>
> *"Why `EASING.out` on a fade — doesn't easing only matter for things that
> move?"* Across this build, block entrances use `EASING.out` as a convention
> even when they're pure opacity, so that the family of entrances feels uniform.
> The curve is barely visible on a fade, but the consistency is the point: every
> block in the chain arrives with the same easing signature, so they read as one
> family of events rather than a grab-bag.

### (b) Edge 1 draws — `edge1Draw = c(1.0, 1.5, 0, 1, EASING.inOut)`

The Start→Campaign connector's `progress` runs 0→1 over **1.0s → 1.5s**, eased
`inOut`. `SimEdgePath` reads `progress` to draw the stroke on from its source
handle toward its target — a wire growing out to where the next block will land.

> *"Why `EASING.inOut` here and `out` on the blocks?"* Because an edge *drawing
> on* is a transform travelling through space — the stroke head moves from the
> source handle to the target. `inOut` gives it a gentle accelerate-then-
> decelerate so it leaves the handle softly and settles rather than snapping to a
> stop. The project's consistent rule: `out` for entrances, `inOut` for
> transforms and travel, `in` for exits. A drawn-on edge is travel.
>
> *"Why does the edge start at 1.0 — after Start finished at 0.9?"* So the wire
> appears to *grow out of* a block that's already there, not race a block that's
> still fading in. Start lands (0.9), a beat passes, the wire reaches out (1.0).
> Cause before effect, even at a tenth of a second.

### (c) Campaign fades in — `campOp = c(1.4, 2.0, 0, 1, EASING.out)`

Campaign's opacity ramps over **1.4s → 2.0s**. Notice it starts at 1.4, *before*
edge 1 finishes drawing at 1.5 — a hair of overlap so the block arrives as the
wire reaches it, reading as "the wire connected and the next block appeared"
rather than two disjoint events.

### (d) Edge 2 draws — `edge2Draw = c(2.2, 2.7, 0, 1, EASING.inOut)`

Campaign→container connector, **2.2s → 2.7s**. Same 0.2s breath after Campaign
settles (2.0) before the wire departs (2.2).

### (e) The container draws on — `contOp = c(2.6, 3.3, 0, 1, EASING.out)`

The whole Parallel container — chrome, header, inner Start pill — fades over
**2.6s → 3.3s**, a touch slower (0.7s vs. the blocks' 0.6s) because it's a bigger
object carrying more. Again the slight pre-overlap with edge 2 (starts 2.6, edge
finishes 2.7).

### (f) Pill wire draws — `pillDraw = c(3.4, 3.9, 0, 1, EASING.inOut)`

Inside the container, the smooth-step edge from the inner Start pill to the Call
block draws on, **3.4s → 3.9s**. This is the first *inner* edge; the assembly has
crossed into the container and is now wiring up the lane.

### (g) Call fades in — `callOp = c(3.8, 4.4, 0, 1, EASING.out)`

The Call (AgentPhone) block, **3.8s → 4.4s**, overlapping the pill wire's finish
(3.9).

### (h) Lane wire draws — `laneDraw = c(4.6, 5.1, 0, 1, EASING.inOut)`

The Call→Log outcome connector, **4.6s → 5.1s**.

### (i) Log outcome fades in — `logOp = c(5.0, 5.6, 0, 1, EASING.out)`

The final block, **5.0s → 5.6s**, overlapping the lane wire. The chain is whole
at ~5.6s.

> *"The assembly takes ~5.3 seconds — why so unhurried? Couldn't all of this
> happen in two?"* Because this is the establishing shot, and there are *eight*
> sequential events (four blocks, four edges) that each need to be individually
> read. The cadence — roughly 0.5s per element, each overlapping the next by
> ~0.1s — is fast enough to feel alive but slow enough that the eye lands on each
> block and each wire in turn. Compress it to two seconds and the chain assembles
> as one blur; the viewer sees "a workflow appeared" instead of "Start, then a
> wire, then the agent, then a wire, then the container holding a Call and a
> logger." The whole point of an *assemble* archetype is that the structure is
> legible because it's built in front of you.

### (j) The reference beat — `tagGlow = Math.min(c(6.2, 6.6), c(7.4, 8.0, 1, 0))`

After the chain is whole and has settled for a beat, the `<parallel.currentItem>`
tag in Call's "To Number" row glows once and releases. The value is a hand-spelled
up-hold-down: `Math.min` of an up-ramp (`c(6.2, 6.6)`, 0→1 over 0.4s) and a
down-ramp (`c(7.4, 8.0, 1, 0)`, 1→0 over 0.6s). So the glow rises over **6.2→6.6**,
holds **6.6→7.4**, and falls over **7.4→8.0** — on fast, off a little slower,
fully released before the cut.

> *"Why is this its own beat, fired at 6.2 — a full half-second after the chain
> finished at ~5.6?"* Because the assembly and the reference highlight are two
> different ideas, and stacking them would blur both. First the viewer reads the
> whole chain (assembly, ending ~5.6). Then a beat of stillness. *Then* one
> gesture points at the single detail that makes this a voice agent — the
> `<parallel.currentItem>` reference, the wiring that makes one lane become N
> calls. Give each idea its own air; the most common way a scene starts to feel
> amateurish is two animations fighting for the same moment.
>
> *"Why does the glow fall *slower* (0.6s) than it rises (0.4s)?"* A quick rise
> grabs the eye; a slightly slower release lets it linger and feel deliberate
> rather than snapped off. The up-fast/down-slow asymmetry is the house signature
> for a one-shot highlight (the same shape market-desk uses for its selection
> pulse), and it's why the tag reads as "look here — this is the key" rather than
> a flicker.
>
> *"What does the glow actually do?"* `Tag` (from `CanvasBits`) renders the
> reference token `<parallel.currentItem>` with a `glow` prop driving a selection
> tint up and down. It's a *reference being read*, not resolved — it never
> substitutes to an actual phone number, because no real run has happened and no
> real `toNumber` is invented (the truth contract). The glow says "this is the
> wiring," not "here's a value."

### (k) The hold — ~8.0s to the scene end (9.1s)

After the tag releases at 8.0, nothing moves. The clean chain rests for ~1.1s.

> *"Isn't a still hold dead air?"* No — the chain you just built is the thesis
> object, and letting it sit is letting it land. The quiet gate (`q`) is live
> this whole scene, but with no panels yet there's nothing for it to settle, so
> the hold is plain. It's deliberately short — ~1.1s — because there's no live
> state here to sustain tension; it's just a breath on a settled chain before the
> run fires. And because the scene ends on a *settled* state with no animation
> mid-flight, it can be stretched to any length the narration needs without
> freezing a motion halfway. (vo-sync extended it from the authored 9.0s minimum
> to 9.1s — a tenth of a second, absorbed entirely by this hold.)

## How to think about the whole scene

Walk the decisions in order and each one answers a question:

1. *What's the object?* A workflow → render the real `SimBlock` chain and the
   real `ParallelContainer`, never hand-drawn boxes.
2. *How do I show only the workflow?* Render the **one** set piece with the aside
   band defaulting to invisible → continuity is free.
3. *How does a chain arrive?* Assemble left to right, block-fade alternating with
   edge-draw, each overlapping the next → you read eight discrete events, not one
   blur.
4. *Which easing where?* `out` for block entrances, `inOut` for edges drawing on
   (they're travel) → a uniform motion signature.
5. *How do I say "this is a voice agent" without a caption?* Glow the
   `<parallel.currentItem>` reference once → product vocabulary, never words on
   screen.
6. *How should it be framed?* Push in on the workflow band (`CAM_WORK`, 0.9) so
   scene 2 can pull back to home and the aside band slides into frame underneath.
7. *How does it end?* On a settled chain → safe to stretch for narration.

There's no single clever move — the quality is the sum of getting each small
decision right, restraint applied seven times.

## Exit state (what scene 2 inherits)

`chain fully assembled (Start, Campaign, container with its one lane, all edges
drawn) · no run state (no rings, no pulses) · the <parallel.currentItem> tag
released (back to rest by 8.0s) · aside band empty (no panels, no table) · camera
at CAM_WORK (s 0.9), top band framed, aside band cropped below`.

Scene 2 opens on exactly this frame and starts the run: Start blips, a pulse
crosses edge 1, and — critically — the camera *eases back* from `CAM_WORK` to
`CAM_HOME` while the lane fans, revealing the empty aside band. Because both
scenes render the same `<Stage/>` and scene 2's frame-0 state equals this exit
(via the `S2`/`S1` preset lineage), that boundary is identical down to the pixel.

<!-- ── voice-agent / 02-the-run-fires.md ── -->

# Scene 2 — `the-run-fires`  ·  archetype: **run + runtime fan**

Source: `../source/scenes/TheRunFiresScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/states.ts` (`S2_THE_RUN_FIRES`), `../source/scenes/_anim.ts`
(`camMix`), `../source/layout.ts` (`ghostTop`, `ghostHandleY`, `CAM_WORK`,
`CAM_HOME`).

This is the scene where the *one run* begins, and where the video's central
spectacle — the parallel fan — happens for the first time. Scene 1 built an idle
chain. Scene 2 fires it, and the first thing the run does that no ordinary
workflow does is *multiply*: the single lane fans into three live instances.
Read it as the worked example for "how do I start a run, drive it down a chain in
the product's own grammar, and then show a parallel container distributing — all
without lying about how Sim actually works."

---

## What this scene is for

The thesis is "one run, distributed — the parallel turns one lane into three live
calls." This scene has to do two things in sequence: (1) **start the run** and
drive it through the chain — Start fires, control passes to Campaign, Campaign
goes live, control passes into the container — using the product's own run
grammar (blip, pulse, ring); and (2) **fan the lane** — the container's one lane
separates into three instances, which is how a Parallel block distributes work at
runtime. And as the fan opens, the camera pulls back to reveal the (still empty)
aside band where the calls and the outcomes table will live.

The *one idea* is "the run fires and fans." It does not yet show the calls
connecting (scene 3), or any conversation (scene 4). The panels stay unborn; the
table stays absent. This scene is purely the run entering the chain and the lane
multiplying.

## The run grammar — read this before the beats

This is the first scene where a run actually *runs* on screen, so it's worth
stating the rules it obeys, because every later run scene obeys them too:

1. **A `PathPulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a streak of blue light (`#33b4ff`), nothing more — not a value,
   not a record. A wire firing means "control passed from this block to the
   next," full stop.
2. **State is shown in the product's own language** — a blue live ring
   (`highlighted: true` → `SimBlock`'s `COLORS.secondary` ring), an edge heating
   up (`hi` interpolating the wire toward secondary), a pill blip — never a word
   like "RUNNING" stamped on screen.
3. **The fan is a runtime animation, never N static lanes.** The container is
   authored with *one* lane (scene 1). The three instances appear only because
   the *run* is distributing — they're ghost pairs that separate during the run
   and retract when it settles. You never draw three lanes in the layout; you fan
   one.

If you internalize those three, the scene decodes: a blip and a latched ring is a
block firing and staying live, a streak is control passing, and a fan of ghost
pairs is a Parallel container distributing.

## The one set piece, the fan, and the camera move

The scene renders the one `<Stage/>` and feeds it run state plus a `fan`
progress and a `camMix`:

```tsx
<Stage
  frame={gf}
  state={{
    cam: camMix(CAM_WORK, CAM_HOME, camP),
    start: {highlighted: startBlip},
    campaign: {highlighted: campaignLive},
    container: {highlighted: containerLive},
    call: {highlighted: callLive},
    edge1: {hi: edge1Hi}, edge2: {hi: edge2Hi}, pillE: {hi: pillHi},
    pulse1, pulse2, pulsePill, pillBlip,
    fan, tagGlow, quiet: q,
  }}
/>
```

Note how little the scene *lays out*. It computes timing windows and hands them
to `<Stage/>`; the geometry of where the ghost pairs travel to lives entirely in
`layout.ts` (`ghostTop(g, fan)` lerps a ghost pair from "stacked behind the lane"
at `fan=0` to its fanned slot at `fan=1`). The scene says *when*; the layout says
*where*. That division is what keeps continuity free.

**The fan mechanism.** In `_rig.tsx`, `ghostLane("a")` and `ghostLane("b")` each
render a header-only **Call + Log outcome** pair plus their wires, positioned by
`ghostTop(g, fan)`. At `fan = 0` both pairs sit at `GHOST_ANCHOR` — exactly
stacked behind the real lane, invisible (`opacity: fan` = 0). As `fan` rises, pair
"a" lerps to a slot *above* the lane (`GHOST_TOP_A`) and pair "b" to a slot
*below* (`GHOST_TOP_B`), their opacity rising with `fan`. The result on screen:
the one lane appears to split into three, the two new ones sliding out above and
below the original, their pill-wires and lane-wires fanning with them. This is the
loops/growth-machine "instances separate at runtime" precedent ported here.

> *"Why ghost *pairs* and not just three copies of the lane?"* Because the
> instances are runtime artifacts, not authored structure. Drawing three full
> lanes would imply the workflow *has* three lanes, which it doesn't — it has one,
> distributed three ways at run time. The ghosts are header-only (just the block
> chrome, no config rows) precisely to read as "instance" rather than "another
> authored block": they're lighter, they fan out from behind the real lane, and
> they retract back into it when the run settles (scene 6). The real lane stays
> the real lane; the ghosts are its runtime shadows.

## The camera move

```ts
camP = c(4.2, 6.2, 0, 1, EASING.inOut)
cam  = camMix(CAM_WORK, CAM_HOME, camP)
```

`camMix` linearly interpolates the three camera fields (`px`, `py`, `s`) from
`CAM_WORK` (s 0.9, centered on the workflow axis) to `CAM_HOME` (s 0.8, centered
on the whole stage), driven by `camP` which is itself eased `inOut`. So the
camera eases back over **4.2s → 6.2s**, pulling out from the top-band framing to
show the whole stage — including the empty aside band sliding into frame below.

> *"Why does the camera move start at 4.2 — after the fan started at 3.6, not
> with it?"* Because the camera move is a *reveal*, and you want the fan to
> already be opening before you pull back to show it in context. Start them
> together and the eye can't tell whether the lane is fanning or the camera is
> just zooming out. Let the fan start (3.6), get a beat of it opening at the
> closer framing, *then* pull back (4.2) so the viewer reads "the lane fanned, and
> now I'm seeing the whole stage it fanned within." The move is timed *after* the
> event it reveals.
>
> *"Why `EASING.inOut` on the camera?"* Camera moves are the canonical `inOut`
> case in this build — a lens travelling through space wants to accelerate softly
> and decelerate into its destination. A linear camera move reads as mechanical;
> `inOut` reads as a considered push. (Note the *mix* is linear — `camMix` lerps
> the fields — but the *parameter* `camP` is eased, so the eased curve drives the
> whole move.)

## The animation, beat by beat

The run enters as a left-to-right relay: **blip → pulse → ring**, each surface
lighting the frame the pulse reaches it. The `mkClock` helpers are the same as
scene 1 (`t` = local seconds, `c` = clamped eased interpolate).

### (a) Start blips — `startBlip = t >= 0.3 && t < 0.8`

The Start block's selection ring (a brief blue blip) is a plain boolean window:
on from **0.3s to 0.8s**, a ~0.5s flash. It's the run *beginning* — Start fired.

> *"Why a closed window (blips off) when later rings latch open?"* Because Start
> *fires and finishes* — it's a trigger, an instant. It doesn't stay live; it
> kicks the run off and it's done. So its ring is a closed blip. Campaign and the
> container, by contrast, latch on and stay (they're doing work for the rest of
> the run). The difference in window shape *is* the difference in event lifetime:
> instant vs. ongoing.

### (b) Pulse crosses edge 1, Campaign goes live

```ts
pulse1   = c(0.5, 1.2, 0, 1, EASING.inOut)   // streak travels edge 1
edge1Hi  = c(0.9, 1.3)                        // the wire heats up as control passes
campaignLive = t >= 1.15                       // Campaign live ring — LATCHED
```

A `PathPulse` rides edge 1 (Start→Campaign), its progress `0→1` over **0.5→1.2s**,
eased `inOut` (it's travelling — momentum). The edge itself heats over **0.9→1.3**
(`edgeColor` interpolates the wire from `pal.wire` toward `pal.secondary` and the
thickness grows `2.25 → 3.5`), so the wire briefly glows as the streak crosses it.
As the streak lands, Campaign's live ring latches at **t >= 1.15** — no upper
bound, it stays on.

> *"Why does Campaign light at 1.15 while the pulse finishes at 1.2?"* A hair of
> overlap. The streak is decelerating into Campaign's handle over its last
> fraction; lighting the ring at 1.15 means Campaign comes alive *as* the streak
> is absorbed, so "control arrives" and "block goes live" read as one event. A gap
> would read as a pause; the slight overlap reads as cause-into-effect.
>
> *"Why latch Campaign open instead of blipping it like Start?"* Because Campaign
> is the agent that's doing the run's work — pulling appointments, driving the
> calls. It's live for the rest of the run. The latched ring is the run's spine,
> the same freeze-cut-carry discipline browser-agent uses: a live ring that holds
> across cuts says "this is still going." Campaign's ring stays on through scenes
> 2–5 and only releases when the run settles in scene 6.

### (c) Pulse crosses edge 2, the container goes live

```ts
pulse2  = c(1.6, 2.3, 0, 1, EASING.inOut)
edge2Hi = c(2.0, 2.4)
containerLive = t >= 2.25
```

Identical grammar one block down: streak over **1.6→2.3**, edge heat **2.0→2.4**,
container live ring latches at **2.25**. Now control is inside the Parallel
container.

> *"Why the ~0.4s gap between Campaign going live (1.15) and the next pulse
> departing (1.6)?"* So each block-to-block hand-off reads as a discrete step.
> Campaign lights, holds a beat, *then* passes control onward. Cramming the next
> pulse onto the same frame Campaign lit would blur "Campaign is live" into
> "control already left" — the viewer couldn't tell the run paused at Campaign at
> all. The small gap is the run *visiting* each block.

### (d) Inside the container: pill blip and the pulse to Call

```ts
pillBlip  = Math.min(c(2.5, 2.7), c(3.0, 3.3, 1, 0))   // inner Start pill blips
pulsePill = c(2.8, 3.5, 0, 1, EASING.inOut)             // pulse pill → Call
pillHi    = c(3.2, 3.6)                                  // pill-edge heats
callLive  = t >= 3.45                                    // Call live ring — LATCHED
```

The inner Start pill blips (up-hold-down: up **2.5→2.7**, down **3.0→3.3**) — the
container's own start kicking off its instances. Then a pulse rides the pill→Call
edge over **2.8→3.5** (eased), the edge heats **3.2→3.6**, and Call's live ring
latches at **3.45**.

> *"Why does the container have its own inner Start pill that blips?"* Because a
> Parallel container *is* a sub-workflow — it has its own entry. The product draws
> an inner Start pill inside the container, and at runtime that pill is what kicks
> off each instance. Blipping it says "the container's own run started" — the same
> blip grammar as the outer Start, scaled down to the inner scope. It's product-
> true: control entered the container, and the container started its lane.

### (e) The fan — `fan = c(3.6, 5.0, 0, 1, EASING.inOut)`

The headline beat. `fan` ramps **3.6s → 5.0s**, eased `inOut`, driving
`ghostTop`/`ghostHandleY` for both ghost pairs. Over those 1.4 seconds the two
ghost Call+Log pairs separate from behind the real lane — one rising above, one
dropping below — their wires fanning with them, their opacity coming up with
`fan`. The single lane becomes three.

> *"Why does the fan start at 3.6, right as Call goes live at 3.45?"* Because the
> fan *is* the lane going live, distributed. Call lights (3.45) — the instance is
> running — and the fan opens (3.6) as the container spawns the parallel copies.
> They're nearly simultaneous on purpose: the lane coming alive and the lane
> multiplying are one event, "the parallel distributed."
>
> *"Why 1.4 seconds — why not snap it open?"* Because the fan is the scene's
> spectacle and the move that teaches "this is a parallel." A snap would read as a
> cut, not a distribution; the eye wouldn't trace the instances separating from
> the original. 1.4s eased `inOut` lets them *grow apart* — you see two new lanes
> emerge from the one, which is exactly the mental model (one authored lane, fanned
> at runtime). Long enough to read the multiplication, short enough to stay
> energetic.
>
> *"Why `inOut` and not `out`?"* The ghosts are *travelling* from one position to
> another (behind-the-lane → fanned), not entering from nothing — so it's a
> transform, and transforms get `inOut`. They ease out of the stack and settle
> into their slots.

### (f) The tag glows again — `tagGlow = Math.min(c(3.9, 4.3), c(5.4, 6.0, 1, 0))`

While the items distribute, the `<parallel.currentItem>` tag glows once more: up
**3.9→4.3**, hold, down **5.4→6.0**, released before the cut.

> *"Why glow the tag again — it already glowed in scene 1?"* Different purpose.
> In scene 1 the glow *introduced* the reference (this is the wiring). Here it
> glows *as the fan opens*, so it reads as the reference *doing its job*:
> `<parallel.currentItem>` is what makes each instance dial a different number, and
> lighting it exactly while the lane multiplies says "that reference is why one
> lane becomes three." Same token, different sentence — scene 1: "here's the
> wiring"; scene 2: "and here's the wiring working."

### (g) The hold — ~6.2s to 7.5s

After the camera settles at home (6.2) and the tag releases (6.0), the live
fanned chain rests for ~1.3s.

> *"What's holding during this hold — isn't the run mid-flight?"* Yes, and that's
> what makes the hold work. Campaign, container, and Call all have *latched* live
> rings — the frame is alive, the run is in progress. A hold on a live state is
> tense, not dead: the blue rings say "still going, calls are about to connect,"
> which carries the narration. And because the live state is *latched* (rings held,
> not mid-transition) and the fan has fully opened to `fan=1` (the ghosts are at
> rest in their fanned slots), the scene can be cut away at any frame — every
> animated value has settled. The quiet gate (`q`) is live but there are still no
> panels to settle, so the gate's effect is invisible here; it's the *latched
> state*, not the gate, that makes this hold safe.

## How to think about the whole scene

Walk the events in causal order:

1. *What starts a run?* Start fires → a brief selection blip (0.3–0.8), closed
   window because firing is instant.
2. *What does firing do?* Passes control down the wire → a `PathPulse` on edge 1,
   eased `inOut`, the edge heating as it crosses, Campaign latching live as it
   lands.
3. *And onward?* The same grammar to the container (pulse 2, edge 2 heat,
   container latches live).
4. *What does the container do?* Starts its own lane → inner pill blips, pulse to
   Call, Call latches live.
5. *What makes this a parallel?* The lane fans → two ghost pairs separate above
   and below the real lane (3.6–5.0), the `<parallel.currentItem>` tag glowing as
   the items distribute.
6. *How do I show this is one run on a bigger stage?* Pull the camera back
   (4.2–6.2) *after* the fan starts, revealing the empty aside band.
7. *What's the state at the cut?* Live and fanned → latched rings hold, the fan
   rests at `fan=1`, ready for the calls to be born.

Each beat is one link, sequenced not stacked: blip (0.3) → pulse+ring (0.5–2.25)
→ inner pill+Call (2.5–3.45) → fan (3.6–5.0) → camera reveal (4.2–6.2) → hold.
Every idea gets its air before the next begins.

## Exit state (what scene 3 inherits)

`run live (Campaign, container, Call latched-on blue rings) · the fan fully open
(fan = 1; two ghost Call+Log pairs at rest in their fanned slots above and below
the real lane, wires fanned) · the <parallel.currentItem> tag released (by 6.0s)
· all transient pulses/blips absorbed · aside band empty (no panels, no table) ·
camera at CAM_HOME (s 0.8), the whole stage in frame including the empty band
below`.

This is the `S2_THE_RUN_FIRES` preset. Scene 3 spreads `S3_CALLS_CONNECT`, which
*starts from* `...S2_THE_RUN_FIRES` (it inherits all the run state and the fan)
and only adds the panels being born and the table appearing. Because scene 3's
frame-0 state equals this exit and both scenes render the same `<Stage/>`, the
boundary is identical down to the pixel — the live fanned chain carries, and the
only thing that changes after the cut is the aside band coming to life below it.

<!-- ── voice-agent / 03-calls-connect.md ── -->

# Scene 3 — `calls-connect`  ·  archetype: **asides are born**

Source: `../source/scenes/CallsConnectScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx` (`CallPanel`, `Waveform`), `../source/scenes/states.ts`
(`S3_CALLS_CONNECT`), `../source/scenes/_anim.ts` (`sceneClock` — the global clock
+ quiet gate), `../source/layout.ts` (the aside band), `../source/transcript-data.ts`.

This is the scene where the video's distinctive grammar appears: the **call
panels** — chat-bubble aside surfaces, each a live phone conversation — are born
in their own band below the workflow, and the real outcomes `SimTable` appears
waiting to be filled. It's also the scene where the build's signature *mechanism*
— the global oscillator clock plus the quiet gate — first carries weight, because
this is the first scene with continuously-shimmering surfaces (waveforms, pulsing
live dots) that must survive every cut. **Read the mechanism section first; it's
the most transferable thing in this whole build, and it's annotated here because
this is where it starts mattering.**

---

## What this scene is for

Scene 2 fanned the lane into three live instances, but those instances were
abstract — ghost block pairs in the container. This scene makes them *concrete and
alive*: each connected call opens a **call panel** in the aside band — a separate
box with a masked phone number, a pulsing red live dot, the configured greeting
typing in as a chat bubble, and a waveform springing to life. Three panels, born
staggered, de-phased. And at the right, the **outcomes record** appears — the real
`SimTable`, header row only, empty — planting the question "who fills that in?"
that scene 6 answers.

The *one idea* is "each call is a real, live phone conversation — and there's a
record waiting to be filled." The workflow above stays clean and live (its rings
hold) but it's no longer the focus; the focus is the band coming alive. No
conversation *unfolds* yet (that's scene 4); no outcomes land yet (scene 6). This
scene is purely the panels and the table being *born*.

## THE MECHANISM — global clock + quiet gate (read this first)

This is the single most important thing to steal from this build, and this scene
is where it earns its keep. The problem: the aside band carries
**continuously-oscillating surfaces** — waveform bars and pulsing live dots — that
shimmer *across scene cuts*. And scene durations are not fixed: `vo-sync` re-times
each scene in 0.1s steps to fit the narration (this scene was stretched from the
authored 8s minimum to **12.1s**). Any boundary that depends on a periodic
animation's phase would *pop* the instant a duration changed. The fix is two
pieces, both in `_anim.ts` reading `timing.ts`:

**1. The global oscillator frame `gf`.** `timing.ts` defines `SCENE_LIST` with
authored minimums, and `sceneSeconds(name) = max(min, VO_TIMING[name])` — the
*same* numbers `Video.tsx` uses to mount the `Sequence`s. `sceneStartFrames(name)`
sums the effective durations of all prior scenes. Then:

```ts
gf = frame + sceneStartFrames(name)   // a video-GLOBAL clock
```

Every scene passes `frame={gf}` (not the local frame) to `<Stage/>`, and every
oscillator derives from `gf`:

- **Waveform bars** (in `_parts.tsx`): three out-of-phase sines per bar,
  `0.5 + 0.32·sin(gf/9 + i·0.7 + seed·2.1) + 0.18·sin(...) + 0.12·sin(...)`,
  where `seed` (1/2/3 per panel) de-phases the three panels.
- **Live dots** (in `_rig.tsx`): `0.5 + 0.5·sin(gf/9 + i·2.1)` per panel.

Because the phase is anchored to a *video-global* frame, the shimmer is
**continuous through every cut** — no pop, ever, at any VO-retimed duration. And
crucially, `gf` is also correct when a scene is rendered *standalone* (as
`verify-boundaries` does, rendering each scene as its own comp), because
`sceneStartFrames` reconstructs the global offset from the scene name alone.

**2. The quiet gate `q`.** `sceneClock` also returns `q`: it's **0 at both
boundary frames** of the scene, ramping 0→1 over the first 0.5s and 1→0 over the
last 0.5s (plain clamped `interpolate`, no easing). Every oscillating *amplitude*
multiplies by `q`:

- waveform: `speaking={(p.speaking ?? 0) * quiet}` — gates to the flat 6% baseline;
- live dot: `livePulse = 0.5 + 0.5·sin(...) * quiet` — gates to a fixed mid-glow
  of 0.5.

The result: every cut lands on a **settled, pixel-identical frame** —
`verify-boundaries` reads IDENTICAL across the boundary — and the half-second dip
reads as a *natural lull between conversation turns*, not a freeze.

> *"Why can't I just use the local frame for the oscillators?"* Because the local
> frame resets to 0 at every scene start. A waveform on `sin(localFrame/9)` would
> snap back to phase 0 at every cut — a visible jolt. The whole band would
> stutter at every boundary. The global frame keeps the sine's phase continuous
> *through* the cut, so the shimmer flows uninterrupted.
>
> *"Why does the quiet gate exist at all if the phase is already continuous?"*
> Because continuous phase keeps the *waveform shape* matched across a cut, but
> the two scenes still might be rendered with sub-pixel differences, and more
> importantly `verify-boundaries` needs an *exactly identical* last-frame /
> first-frame pair to certify the boundary. By forcing every oscillating
> amplitude to a fixed value (flat waveform, mid-glow dot) exactly at the boundary
> frame, both sides of the cut are *defined* to be identical regardless of phase.
> The gate turns "probably continuous" into "provably identical." And it's free
> visually because a half-second dip in a phone conversation reads as a pause
> between turns — which is exactly what's happening.
>
> *"Why ramp the gate over 0.5s and not snap it?"* A snap to flat would itself be
> a pop. The 0.5s ramp eases the band into and out of its quiet state, so the
> settle reads as the conversation *winding down for a beat* rather than the
> animation being switched off.

**Imitate this literally** whenever a video has any surface that oscillates
across cuts: put scene lengths in one `timing.ts` shared by `Video.tsx` *and* the
scenes; derive every periodic phase from `frame + sceneStartFrames(scene)`; and
multiply every periodic amplitude by a 0.5s-ramp quiet gate.

## The distinctive component — the `CallPanel` (and whether to promote it)

This video introduces a genuinely new surface: the **call panel** (`CallPanel` in
`_parts.tsx`), a live phone-conversation card. It's chat-bubble aside grammar in
the `ChatPanel` lineage, and it's worth teaching carefully because it's the
video's signature object.

Anatomy (top to bottom):

- **Header** (`headerH = 78`): a live dot (14px circle, red `#ff5a5a` while live
  with a glow that pulses with `livePulse`; solid green `#22c55e` with a fixed
  glow once `ended`), the masked destination in mono (`+1 415 ··· 4288`), and a
  `⟨pending⟩` duration pill (a gray skeleton bar — the real duration is never
  invented).
- **Transcript stream** (`flex: 1`, pinned to the bottom): chat turns. **Agent
  turns** are right-aligned green-tinted bubbles (`rgba(47,209,106,0.14)` fill,
  `borderBottomRightRadius: 6` — the speech-bubble tail) carrying the configured
  greeting text. **Human turns** are left-aligned skeleton-bar bubbles (gray
  rounded bars, no words). The newest turn is at the bottom; the stream pins to
  `justifyContent: flex-end`.
- **Waveform footer** (`waveH = 96`): the `Waveform` component — 28 bars whose
  heights animate from the frame-derived triple-sine while `speaking`, flatlining
  to a thin 6% baseline when listening. With the outcome stamp overlaid here once
  the call resolves (scene 6).

**The truth contract baked into the panel** (this is the load-bearing design
decision):

- **Agent turns carry text — and that text is authored config, never run
  output.** The greeting "Hi, this is Acme calling to confirm your appointment for
  tomorrow." is the registry's own `initialGreeting` placeholder language from
  `agentphone.ts` (`"Hi, this is Acme Corp calling about your recent order."`),
  specialized to the appointment-call template. The builder *wrote* this config;
  it's not a transcript of a real call.
- **Human turns carry NO words — they're skeleton bars.** The person's reply is
  *run output*, and run output is never invented. So a human turn renders as gray
  bars whose *widths* are the shape of a reply (`["62%", "40%"]`) — you read "the
  person said something of about this length" without a single fabricated word.
- **The waveform is generated motion, not data.** It's a sine-driven shimmer
  representing "the agent is speaking," declared as motion in the script. It does
  not visualize a real audio signal.
- **The destination is masked** (`+1 415 ··· 4288`) — an authored stand-in, no
  real `toNumber` invented.

> *"Should `CallPanel` be promoted to `src/components/`?"* Not yet, and the reason
> is instructive. It's a strong, reusable surface — but it's currently a *video-
> specific* assembly of more general pieces: the chat-bubble grammar is the
> `ChatPanel` lineage, the skeleton bars are the house "captured run-value"
> language, the green/red state ramp is the product's own. If a *second* video
> needs a live-call surface, that's the moment to lift `CallPanel` up to
> `src/components/` — and at that point the thing to extract is probably the
> `Waveform` + the chat-bubble `TurnRow` as separate primitives, with `CallPanel`
> as a composition. For now it lives in `_parts.tsx` because it's only used here,
> and the rule is: promote on the *second* use, not in anticipation. But flag it
> in your head — the live-conversation panel and especially the truth contract it
> encodes (agent text = config, human reply = skeleton, waveform = motion) is
> exactly the kind of grammar a future "agent that talks" video should steal
> wholesale.

## The aside band layout

The band is owned by `layout.ts` and is *physically separate* from the workflow —
this separation is the whole point of "take 2" (the correction that drove the
rebuild). Three panels (`PANEL_W = 360`, `PANEL_H = 640`, `PANEL_GAP = 34`) on the
left, the `SimTable` (`TABLE_W = 1040`, `TABLE_SCALE = 2`) on the right, with
`BAND_GAP = 86` between. The whole band sits at `BAND_Y = 645` — below the
container's bottom (541.5) with clear air, so **no edge ever crosses between the
workflow and the asides**, and nothing occludes a block at any camera.

> *"Why separate boxes instead of drawing the conversations inside the
> container?"* This is the correction that *is* take 2. An earlier take drew call
> output floating over/inside the workflow, and the director rejected it: the
> workflow layout must stay clean and product-true, and the conversations are
> *asides* — a different surface, in their own band, synced to the workflow by
> *timing only* (a panel is born when its call connects; a table row lands when
> the Log-outcome block blips). No wire ever connects the two bands, because in
> the real product the transcript isn't a node in the graph. The bands are two
> views of one run, not one diagram.

## The values, and where they come from

| Element | On screen | Source |
|---|---|---|
| Panel 1 dest | `+1 415 ··· 4288` | masked stand-in (`transcript-data.ts` `LANES[0].dest`) |
| Panel 2 dest | `+1 628 ··· 1924` | masked stand-in |
| Panel 3 dest | `+1 917 ··· 7706` | masked stand-in |
| Greeting (all panels) | "Hi, this is Acme calling to confirm your appointment for tomorrow." | `agentphone.ts` `initialGreeting` placeholder, specialized to the appointment template |
| Live dot | red `#ff5a5a` pulsing | "call in progress" state color |
| Duration pill | gray skeleton bar | `⟨pending⟩` — real duration never invented |
| Table columns | `to / outcome / status` | the outcomes schema (module-2 lowercase style) |
| Table rows | (none — header only) | rows land only when `Insert Row` runs (scene 6) |

## The animation, beat by beat

`mkClock` gives `t` and `c` as before; `sceneClock` gives `gf` (passed as `frame`)
and `q` (passed as `quiet`).

### (a) Staggered panel births — `BIRTH = [0.5, 1.4, 2.3]`

The three panels are born at **0.5s, 1.4s, 2.3s** — a **0.9s stagger**. Each
panel `i` runs a four-part birth (note all four windows are *relative to that
panel's BIRTH*, so the whole birth gesture slides with the stagger):

```ts
visible    = c(BIRTH[i], BIRTH[i] + 0.6, 0, 1, EASING.out)         // pop-in
turnCount  = 1                                                      // greeting bubble present
lastReveal = c(BIRTH[i] + 0.5, BIRTH[i] + 1.1, 0, 1, EASING.out)   // greeting types in
speaking   = c(BIRTH[i] + 0.7, BIRTH[i] + 1.5, 0, SP[i], EASING.out) // waveform springs up
```

- **Pop-in** (`visible`, 0.6s): the panel fades up (`opacity: vis`) *and* rises
  26px (`translateY((1 - vis) * 26px)` in `_rig.tsx`) — a settle, the house
  birth gesture.
- **Greeting types in** (`lastReveal`, starting 0.5s after birth): the agent's
  first bubble reveals via `bubbleFade(r)` — opacity up and a 12px rise. Because
  `turnCount = 1`, exactly the greeting bubble is present, and `lastReveal` eases
  *it* in.
- **Waveform springs to life** (`speaking`, starting 0.7s after birth): the
  waveform amplitude ramps from 0 to `SP[i]`.

> *"Why a 0.9s stagger between panels — why not all at once?"* Because three
> identical panels popping simultaneously would read as one block of UI, not three
> distinct calls connecting. Staggering them at 0.9s lets each connection register
> as its own event — "this call connected, then this one, then this one" — which is
> what's actually happening (three calls don't connect on the same millisecond).
> 0.9s is slow enough to feel each birth, fast enough that all three are alive
> within ~3 seconds.
>
> *"Why does the waveform start 0.7s after the panel pops, not immediately?"*
> Order of events within a single connection: the panel *appears* (the call
> connected, the surface opened), *then* the greeting starts (the agent began
> speaking), *then* the waveform springs up *under* that greeting (the voice is
> heard). Stacking all three on the same frame would lose the little narrative
> inside each birth. The 0.5s/0.7s offsets sequence "connected → greeting →
> voice."

### (b) The settle amplitudes — `SP = [1, 0.85, 0.7]`

The three waveforms settle to **different** amplitudes — panel 1 loudest (1),
panel 2 mid (0.85), panel 3 quietest (0.7). Combined with the per-panel `seed`
de-phasing the *shape* of each waveform and the `i·2.1` phase offset on each live
dot, the three panels read as three *independent* live calls, not three copies of
one animation.

> *"Why three different loudnesses?"* Because three identical waveforms would
> read as a single looping graphic stamped three times — the eye clocks the
> repetition and the illusion of three live calls collapses. Three amplitudes (and
> three de-phased sine seeds, and three dot phases) make them feel like three
> different conversations happening at three different volumes. The de-phasing
> *is* the liveness. And these exact values (`[1, 0.85, 0.7]`) are carried in the
> `S3_CALLS_CONNECT` preset, so the scene settles to precisely the amplitudes the
> next scene inherits.

### (c) The record appears last — `tableReveal = c(4.6, 5.4, 0, 1, EASING.out)`

The `SimTable` (header row only, zero rows) reveals over **4.6s → 5.4s** with the
same 26px rise as the panels (`translateY((1 - tableReveal) * 26px)`). It appears
*after* all three panels are alive (panel 3 born at 2.3, settled ~3.8).

> *"Why does the empty table come in last, and as its own beat?"* Because it's the
> scene's *closing* statement, not furniture. The panels are the calls; the table
> is the promise — "and every one of these will become a row here." Bringing it in
> after the panels have settled lets it land as the answer to "where do the
> outcomes go?" — an empty record waiting to be filled. Reveal it alongside the
> panels and it'd be lost in the birth flurry; reveal it last and it reads as the
> period at the end of the sentence.
>
> *"Why is it the real `SimTable` and not a styled grid?"* Same reason the
> workflow uses real `SimBlock`s: the outcomes record *is* a Sim table in the real
> product (the Log-outcome block inserts into it), so the surface on screen is the
> actual `SimTable` component fed real columns. It's empty here because **a table
> cannot show a row the run hasn't inserted yet** — the same honesty rule
> market-desk's empty columns follow. The rows land only when `Insert Row` runs,
> in scene 6.

### (d) The hold — ~5.4s to ~11.6s (the 6+ second alive hold)

After the table reveals at 5.4, nothing *new* happens for ~6 seconds — but the
frame is *alive*: three waveforms shimmer on the global clock at amplitudes
1/0.85/0.7, three live dots pulse de-phased, the workflow's rings stay lit above.
This is the build's proof that a 6-second hold can carry.

> *"Six seconds with no new event — isn't that dead air?"* No, and this is the
> whole reason the global clock + quiet gate exists. The hold isn't *static* —
> it's *breathing*. Nothing is focal, but everything is alive: the waveforms ripple,
> the dots pulse, each at its own phase. There's no single thing to look at, which
> is exactly right for "three calls are all live at once" — you're meant to feel
> the *aliveness* of the whole band, not track one event. And it carries the
> narration ("each one opens a live transcript... an empty outcomes table is
> waiting") across its full length. The quiet gate settles it for the cut: the
> last half-second eases the shimmer down to its baseline so the boundary into
> scene 4 is pixel-identical.

## How to think about the whole scene

1. *How do I make the abstract instances concrete?* Born each as a real
   conversation surface → the `CallPanel`, a separate aside box.
2. *Where do the panels live so they don't corrupt the workflow?* Their own band,
   below the container, no edge crossing → the take-2 correction.
3. *How do three calls read as three, not one?* Stagger the births 0.9s, settle to
   three amplitudes (1/0.85/0.7), de-phase the waveform seeds and dot phases →
   liveness *is* de-phasing.
4. *What text is allowed on screen?* Agent greeting = authored config; human reply
   = skeleton bars; duration = ⟨pending⟩; number = masked → the truth contract.
5. *How do I plant the payoff?* Reveal the real empty `SimTable` last → an honest
   waiting record.
6. *How does a 6s hold survive?* Global clock keeps the shimmer continuous; quiet
   gate settles every boundary → a breathing hold, pixel-identical cuts.

## Exit state (what scene 4 inherits)

`workflow live and fanned (rings held, fan = 1) · three call panels alive, each
showing its greeting bubble (turnCount 1), waveforms shimmering at amplitudes
1/0.85/0.7, live dots pulsing de-phased · the outcomes SimTable present, header
only, zero rows · camera at CAM_HOME (s 0.8) · all oscillators on the global clock,
quiet gate settled at the boundary`.

This is the `S3_CALLS_CONNECT` preset. Scenes 4, 5, and 6 all spread
`...S3_CALLS_CONNECT` as their base and modify from it — the panels, the table,
and the run state all carry by construction. Scene 4 changes *only* the camera
(leaning toward panel 1) and the per-panel turn state; the band itself is
inherited whole. Because both scenes render the same `<Stage/>` and the global
clock + quiet gate guarantee the shimmer is continuous and the boundary settled,
the cut is identical down to the pixel.

<!-- ── voice-agent / 04-one-conversation.md ── -->

# Scene 4 — `one-conversation`  ·  archetype: **the mechanism (lean-in)**

Source: `../source/scenes/OneConversationScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx` (the turn loop, the waveform), `../source/scenes/states.ts`
(`S4_ONE_CONVERSATION`), `../source/layout.ts` (`CAM_PANEL1`),
`../source/transcript-data.ts`.

This is the *mechanistic example* scene — the one that picks a single call out of
the three and shows, up close, what "a live conversation" actually means: the
agent speaks, goes quiet while the person answers, and comes back to confirm.
Read it as the worked example for "how do I lean into one instance to teach the
mechanism, and how do I draw a turn-taking conversation honestly — voice and
listening as two surfaces showing one event."

---

## What this scene is for

Scene 3 made three calls alive but kept them all at arm's length — you saw the
*aliveness*, not the *mechanism*. The macro arc of this video is capability-first,
and the standard move after "here's the whole capability" is "here's one
mechanistic example, slowed down." That's this scene. It leans the camera toward
panel 1, dims everything else, and runs **the turn loop** on that one panel: agent
speaks → flatlines (listening) → the human reply rises as skeleton bars → the
waveform springs back for the agent's confirmation line.

The *one idea* is "it speaks, hears the answer, and responds — turn by turn, a
real conversation." It deliberately ignores the other two panels (they dim and
murmur in the background) and the table (off to the side, untouched). One call,
one mechanism, slowed to legibility.

## What it looks like

The camera leans toward panel 1 — pushing in and down-left so panel 1 fills the
lower-left, with the workflow band still visible above (dimmed). Panels 2 and 3
dim and quiet. On panel 1, the conversation advances: it's already mid-greeting
(carried from scene 3). The waveform **flatlines** — the agent stopped speaking.
A **human reply** rises in as a left-aligned skeleton-bar bubble — the person is
answering, but we never hear their words. Then the waveform **springs back up**
*under* a new agent bubble — the confirmation line ("Great — you're all set for 3
PM. We'll see you then.") rising in as the voice returns. The live dot keeps
pulsing throughout.

## The camera-plus-hierarchy move (read this — it's the scene's craft)

The lean isn't just a camera move; it's a camera move and a *hierarchy* move
firing on the same window. This is the key technique:

```ts
camP = c(0.5, 2.2, 0, 1, EASING.inOut)        // camera leans CAM_HOME → CAM_PANEL1
dim  = c(0.7, 1.9)                              // de-focus: workflow + panels 2-3
```

`camMix(CAM_HOME, CAM_PANEL1, camP)` pushes the camera from the home framing
(`s 0.8`, whole stage) to `CAM_PANEL1` (`px: panelX(0) + PANEL_W/2 + 210, py: 880,
s: 1.06`) — leaning toward panel 1 and pushing in to 1.06×. At the *same time*,
`dim` ramps the de-focus: the workflow band's opacity drops (`1 - 0.62*workflowDim`
→ 38% at full dim) and panels 2 and 3 dim (`1 - 0.55*(p.dim)` → 45%).

> *"Why move the camera and the dimming on the same window?"* Because they're one
> gesture: "focus on panel 1." A camera that pushes in *without* dimming the rest
> would still show three equally-bright panels and a bright workflow, fighting the
> focal panel for attention. Dimming *without* a camera move would flatten the
> hierarchy but not give panel 1 the room it needs to be read up close. Doing both
> on the same `inOut` window means the world *recedes* (dims) exactly as the lens
> *approaches* (pushes in) — the eye is pulled to panel 1 by two reinforcing
> cues at once. This is the build's "camera-plus-hierarchy" move, and it's the
> cleanest way to say "look here now" without a single highlight box.
>
> *"Why does the dim start at 0.7, a hair after the camera at 0.5?"* So the move
> *initiates* with the lens (the camera commits first, 0.5) and the world dims
> *into* that commitment (0.7). They finish close together (2.2 vs 1.9). Starting
> the dim slightly later means the viewer reads "we're moving toward panel 1, and
> as we do, everything else falls back" rather than "everything dimmed and then we
> moved" — cause (the lean) leading effect (the recede).
>
> *"Why `CAM_PANEL1.py = 880` and `+210` on px?"* The panel band sits low on the
> stage (`PANEL_Y = 645`, panel center ~965). Framing `py = 880` puts the camera's
> center high in the panel so the panel's header and transcript fill the frame
> rather than its empty footer. The `+210` on px nudges the center rightward off
> panel 1's own center so the workflow edge stays visible above — you're leaning
> *toward* panel 1, not burying everything else off-frame, because the scene still
> wants to remind you the workflow is the thing producing this call.

## The turn loop — the mechanism drawn honestly

The conversation on panel 1 is the scene's content, and it's drawn as a strict
alternation of two surfaces:

```ts
sp0    = 1 - c(3.0, 3.7, 0, 1, EASING.inOut) + c(7.0, 7.8, 0, 1, EASING.inOut)
turn2  = c(4.2, 5.0, 0, 1, EASING.out)    // human reply rises
turn3  = c(7.4, 8.2, 0, 1, EASING.out)    // agent confirmation rises
count0 = t < 4.2 ? 1 : t < 7.4 ? 2 : 3     // how many turns are shown
rev0   = t < 4.2 ? 1 : t < 7.4 ? turn2 : turn3   // reveal of the newest turn
```

Read `sp0` (the panel-1 waveform amplitude) carefully — it's the heart of the
scene. It starts at **1** (carried in from scene 3, mid-greeting), then *subtracts*
a ramp over **3.0→3.7** (falling to 0 — the **flatline**, the agent going quiet),
then *adds* a ramp over **7.0→7.8** (rising back to 1 — the **voice returning**).
So the waveform's life is: speaking (1) → flatlines by 3.7 → silent → springs back
by 7.8.

The turns advance in lockstep with that:

- **Turn 1** (the greeting) is already present (carried, `count0 = 1` until 4.2).
- At **t = 4.2**, `count0` steps to 2 and the **human reply** (turn 2, a skeleton-
  bar bubble) reveals over **4.2→5.0** (`turn2`). This happens *while the waveform
  is flat* (it flatlined at 3.7) — the listening picture.
- At **t = 7.4**, `count0` steps to 3 and the **agent confirmation** (turn 3, the
  authored line) reveals over **7.4→8.2** (`turn3`), *as the waveform springs back*
  (the 7.0→7.8 ramp in `sp0`) — the voice returning under the new bubble.

> *"Why is the flatline-then-human-bars the 'listening' picture — why two surfaces
> for one moment?"* Because "the agent is listening to the person" is one event,
> and it's drawn on two surfaces simultaneously: the **waveform going flat** (the
> agent's voice stopped) *and* the **human bars rising** (the person is now
> speaking). Neither alone says it. The flat waveform alone could mean "nothing is
> happening"; the human bars alone could appear while the agent is still talking.
> Together — voice off, reply rising — they unambiguously say "the agent stopped
> and is hearing the answer." This is the two-surfaces-one-event discipline
> (browser-agent's chip-ring-equals-card-birth, market-desk's synchrony) applied
> to a conversation turn.
>
> *"Why does the human reply have no words?"* The truth contract. The person's
> actual reply is *run output* — what a real human said on a real call — and run
> output is never invented. So the reply is skeleton bars whose widths
> (`["62%", "40%"]` from `LANES[0].humanReplies[0]`) are the *shape* of a reply.
> You read "the person said something about this long" with zero fabricated words.
> The agent's lines, by contrast, *do* carry text — because they're authored
> config (the greeting and confirmation the builder wrote), not a transcript.
>
> *"Why does the voice spring back exactly under the confirmation bubble (both at
> ~7.0–8.2)?"* Same two-surfaces logic, reversed: "the agent responds" is the
> waveform rising (voice on) *and* the confirmation bubble landing (the words).
> Springing the waveform back *as* the bubble reveals says "the agent is speaking
> again, and here's what it's saying." Land the bubble without the waveform and
> the agent would appear to respond mutely; spring the waveform without the bubble
> and it'd speak with no content. The two are timed together (7.0/7.4 starts) so
> they read as one "the agent responded."
>
> *"Why the ~3-second gap between the flatline (3.7) and the voice return (7.0)?"*
> Because that gap *is the listening*. The human reply reveals over 4.2–5.0 inside
> that silence, and then there's a beat of the agent "processing" before it comes
> back. Snapping the agent's response onto the heels of the human reply would read
> as a canned bot; a real conversation has a beat of silence after the person
> speaks. The 3-second flat stretch is the scene letting the listening *land*.

### The background panels — `sp1`, `sp2`

```ts
sp1 = 0.85 - c(0.9, 2.0, 0, 0.85, EASING.inOut)   // panel 2: 0.85 → 0 (goes silent)
sp2 = 0.7  - c(0.9, 2.0, 0, 0.1,  EASING.inOut)   // panel 3: 0.7 → 0.6 (murmurs on)
```

As the lean commits (0.9→2.0, riding the same window as the dim), panel 2's
waveform settles to **0** (it goes quiet) and panel 3's to **0.6** (still
murmuring, just lower). Both are also dimmed to 45%.

> *"Why does panel 2 go fully silent but panel 3 keeps murmuring at 0.6?"* So the
> background isn't *dead*. If both dimmed panels flatlined, the frame would read as
> "two calls ended" — which is wrong, they're still live. Leaving panel 3 murmuring
> at 0.6 behind the dim keeps the world alive: the focus is panel 1, but the other
> calls are still going, just quieter and out of focus. It's the difference
> between "the camera focused on one of three live calls" and "two calls stopped so
> we could look at the third." The first is true; the second is a lie. Panel 2
> going to 0 and panel 3 to 0.6 (rather than both to the same value) also keeps them
> *de-phased* even while dimmed — quieter, not uniform.

## The values, and where they come from

| Element | On screen | Source |
|---|---|---|
| Panel 1 greeting (turn 1) | "Hi, this is Acme calling to confirm your appointment for tomorrow." | `LANES[0].agentLines[0]` (authored config, registry greeting) |
| Panel 1 human reply (turn 2) | skeleton bars `62% / 40%` | `LANES[0].humanReplies[0]` (shape only, no words) |
| Panel 1 confirmation (turn 3) | "Great — you're all set for 3 PM. We'll see you then." | `LANES[0].agentLines[1]` (authored config) |
| Live dot | red, pulsing | "call in progress" (de-phased on the global clock) |
| Panels 2-3 | dimmed, panel 3 murmuring | de-focus per the lean |

All conversation content is from `transcript-data.ts`. Note the confirmation line
is *specific* to lane 0 ("3 PM") — each of the three lanes has its own authored
second line (lane 1 reschedules to Thursday, lane 2 confirms 3 PM), so the three
conversations read as genuinely different even though they share the greeting.

## The animation, beat by beat

`mkClock` gives `t`/`c`; `sceneClock` gives `gf` (the global clock, keeping the
waveforms continuous from scene 3) and `q` (the quiet gate).

1. **0.5–2.2 — the lean.** Camera eases `CAM_HOME → CAM_PANEL1` (`inOut`),
   pushing in to 1.06× toward panel 1.
2. **0.7–1.9 — the de-focus.** Workflow dims to 38%, panels 2–3 dim to 45%;
   panel 2's waveform settles to 0, panel 3's to 0.6 (0.9–2.0).
3. **carried — speaking the greeting.** Panel 1's waveform enters at amplitude 1
   (from `S3`), greeting bubble already present.
4. **3.0–3.7 — the flatline.** `sp0` subtracts to 0: the agent goes quiet.
5. **4.2–5.0 — the human reply rises.** Turn 2 (skeleton bars) reveals while the
   waveform is flat — the listening picture, two surfaces.
6. **7.0–7.8 — the voice returns.** `sp0` adds back to 1.
7. **7.4–8.2 — the confirmation lands.** Turn 3 (the authored line) reveals *as*
   the waveform springs back — the response, two surfaces.
8. **8.2–~13.8 — the hold.** Leaned into panel 1: its waveform shimmers at full
   amplitude on the global clock, its dot pulses, panel 3 murmurs at 0.6 behind
   the dim. The quiet gate dips it at the boundary (reads as the conversation
   pausing).

> *"Why is the hold ~5.6s here, longer than scene 1's?"* Because this hold is on a
> *live* state (panel 1 still talking, dot pulsing, panel 3 murmuring) — a live
> hold is tense, not dead, so it carries narration comfortably. And the scene was
> VO-stretched to 13.8s from the 12s minimum; the extra length is absorbed by this
> live hold, which is safe to stretch because every value has settled to the `S4`
> preset and the only motion is the global-clock shimmer (which the quiet gate
> handles at the boundary).

## How to think about the whole scene

1. *How do I teach the mechanism?* Lean into one instance and slow it down → the
   standard "one mechanistic example" move.
2. *How do I focus without a highlight box?* Camera push + de-focus dim on the
   same window → camera-plus-hierarchy, the world recedes as the lens approaches.
3. *How do I draw "the agent is listening"?* Waveform flatlines *and* human bars
   rise — two surfaces, one event.
4. *How do I draw "the agent responds"?* Waveform springs back *under* the
   authored confirmation bubble — two surfaces, one event.
5. *What words are allowed?* Agent lines = authored config (text); human reply =
   skeleton bars (shape only).
6. *How do I keep the background honest?* Panel 3 murmurs at 0.6 behind the dim —
   the other calls are still live, just out of focus, not stopped.

## Exit state (what scene 5 inherits)

`camera leaned into panel 1 (CAM_PANEL1, s 1.06) · workflow dimmed to 38% · panel
1 showing all 3 turns (greeting, human reply, confirmation), waveform at amplitude
1, dot pulsing · panel 2 dimmed, silent (speaking 0) · panel 3 dimmed, murmuring
(speaking 0.6) · the outcomes SimTable present, still empty · global clock
continuous, quiet gate settled at the boundary`.

This is the `S4_ONE_CONVERSATION` preset. Scene 5 (`three-at-once`) spreads
`...S3_CALLS_CONNECT` as its base but *enters* on this `S4` frame — it pulls the
camera back from `CAM_PANEL1` to `CAM_HOME` and releases the dims (`undim`), so
scene 5's frame-0 must equal this `S4` exit. The cut is identical down to the
pixel; what changes after it is the camera pulling out and the world un-dimming as
all three panels come up to full.

<!-- ── voice-agent / 05-three-at-once.md ── -->

# Scene 5 — `three-at-once`  ·  archetype: **the money shot (de-phased streams)**

Source: `../source/scenes/ThreeAtOnceScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx`, `../source/scenes/states.ts` (`S5_THREE_AT_ONCE`),
`../source/layout.ts` (`CAM_PANEL1`, `CAM_HOME`), `../source/transcript-data.ts`.

This is **the money shot** — the video's thesis frame, the one image the whole
build exists to produce: all three conversations running *at once*, each on its
own pace, three live phone calls shimmering out of sync, while the workflow above
is still just *one run*. Read it as the worked example for "how do I make a
spectacle frame that's actually alive — three independent streams, de-phased — and
how do I prove the spectacle is still honest (it's one run, not three workflows)."

---

## What this scene is for

The macro arc went: capability (the workflow), the run firing and fanning, the
calls connecting, then *one* conversation up close (the mechanism). Now it pulls
back and shows the payoff: **the whole campaign talking at once.** Three live
conversations, each at a different point in its turn loop — one talking, one
listening, one wrapping up — all simultaneous, all de-phased. The thesis line the
scene carries is "this is *still a single run* of the workflow above" — the rings
are still lit, the table still waits, one workflow drove all three.

The *one idea* is "the whole campaign is talking at once — and it's one run." It's
a *hold*-dominated scene: a brief pull-back and un-dim, then a long alive hold
where three independent conversation clocks run in parallel and the global clock
keeps the whole band breathing.

## What it looks like

The camera pulls back from the panel-1 lean to the home framing, and the dims
release — all three panels come up to full brightness. Then the three of them run
their turn loops *independently and out of phase*: panel 1 keeps talking, takes a
breath mid-scene, talks again; panel 2's human reply rises and the agent answers,
then it listens again; panel 3 flatlines, its human reply rises, the agent comes
back on. Three live dots pulse de-phased; three waveforms shimmer at different
amplitudes and seeds; the workflow's rings stay on above; the empty table waits at
the right. No two panels ever change state in the same second.

## The pull-back — `camera + undim on the same window`

```ts
camP  = c(0.4, 2.2, 0, 1, EASING.inOut)   // camera CAM_PANEL1 → CAM_HOME
undim = c(0.5, 1.7, 1, 0)                  // de-focus releases (1 → 0)
```

The inverse of scene 4's lean. `camMix(CAM_PANEL1, CAM_HOME, camP)` pulls the
camera from the panel-1 lean back to home over **0.4→2.2**, and `undim` releases
the de-focus from 1 to 0 over **0.5→1.7** — riding the pull-back, the same
camera-plus-hierarchy move running in reverse. As the camera retreats, the
workflow comes back to full brightness and panels 2–3 un-dim, so all three panels
are equal and bright by the time the camera settles at home.

> *"Why does `undim` finish (1.7) before the camera does (2.2)?"* Because you want
> the panels at full brightness *before* the camera fully settles, so the money
> frame is already established as the camera arrives at it. If the un-dim lagged
> the camera, you'd reach the home framing with the panels still dimming up — the
> thesis frame would assemble *after* you got there. Finishing the un-dim early
> means the camera lands on a frame that's *already* the money shot.
>
> *"Why `c(0.5, 1.7, 1, 0)` — passing 1→0 — instead of easing? It's linear here."*
> Note `undim` has no easing argument: it's a plain linear release, and it's used
> as a *multiplier* (`workflowDim: undim`, `dim: undim`). The camera carries the
> eased feel of the move; the dim just needs to get out of the way proportionally.
> Easing both would double the curve. The pattern: ease the *primary* gesture (the
> camera), let the *coupled* values ride linearly under it.

## The three de-phased conversation clocks (copy these numbers)

This is the scene's craft: three panels, each running an *independent* turn loop,
deliberately offset so no two change in the same second. Here is each, verbatim,
with what it draws:

**Panel 1 — keeps talking, breathes, talks again:**
```ts
sp0 = 1 - c(4.5, 5.3, 0, 1, EASING.inOut) + c(7.5, 8.3, 0, 1, EASING.inOut)   // ends at 1
turnCount: 3  (all turns already present from S4)
```
Starts speaking (1, carried from S4), flatlines over **4.5→5.3** (a breath), springs
back over **7.5→8.3**. Ends at amplitude 1 — still talking.

**Panel 2 — human reply rises, agent answers, listens again:**
```ts
count1 = t < 3.0 ? 1 : 2
rev1   = t < 3.0 ? 1 : c(3.0, 3.8, 0, 1, EASING.out)    // human reply reveals
sp1    = c(5.5, 6.3, 0, 0.9, EASING.inOut) - c(9.0, 9.8, 0, 0.9, EASING.inOut)  // ends 0
```
At **3.0** turn 2 (the human reply) starts revealing (3.0→3.8); the agent answers,
waveform rising to 0.9 over **5.5→6.3**; then it listens again, the waveform
falling back over **9.0→9.8**. Ends at amplitude 0 — listening (S5 leaves it
mid-listen, human bars up).

**Panel 3 — listening, human reply rises, agent comes back:**
```ts
count2 = t < 4.6 ? 1 : 2
rev2   = t < 4.6 ? 1 : c(4.6, 5.4, 0, 1, EASING.out)
sp2    = 0.6 - c(3.8, 4.5, 0, 0.6, EASING.inOut) + c(7.0, 7.8, 0, 0.9, EASING.inOut)  // ends 0.9
```
Starts murmuring at 0.6 (carried from S4), flatlines over **3.8→4.5**; at **4.6**
its human reply rises (4.6→5.4); the agent comes back on over **7.0→7.8** to 0.9.
Ends at amplitude 0.9 — talking.

Lay the events on a timeline and the de-phasing is the whole point:

| ~t | panel 1 | panel 2 | panel 3 |
|---|---|---|---|
| 3.0 | talking | human reply rises | murmuring |
| 3.8–4.5 | talking | (reply revealed) | flatlines |
| 4.6 | talking | listening | human reply rises |
| 4.5–5.3 | **flatlines** | listening | (reply revealed) |
| 5.5–6.3 | silent | **agent answers** | silent |
| 7.0–7.8 | silent | talking | **agent comes back** |
| 7.5–8.3 | **springs back** | talking | talking |
| 9.0–9.8 | talking | **listens again** | talking |

Every state change lands on its *own* beat. No two panels flatline, reveal, or
spring back in the same second.

> *"Why go to all this trouble to stagger three turn loops — wouldn't three copies
> of one loop be simpler and read the same?"* It would be simpler and read
> completely wrong. Three *synchronized* waveforms — all flatlining together, all
> springing back together — would instantly read as one animation stamped three
> times, a screensaver, not three live calls. The de-phasing *is* the spectacle:
> the frame feels alive precisely because at any instant one panel is talking,
> another listening, a third wrapping up, the way three real simultaneous calls
> would be. The viewer can't predict the next change because the three clocks are
> independent — that unpredictability is what sells "these are three different
> conversations." It's the same reason the waveform *shapes* are de-phased by
> `seed` and the dots by `i·2.1`: every layer of the band is offset from every
> other.
>
> *"Why do the panels end at amplitudes 1 / 0 / 0.9?"* Because those are the exact
> values the `S5_THREE_AT_ONCE` preset declares, and scene 6 inherits them. Panel 1
> ends talking (1), panel 2 ends listening (0, human bars up), panel 3 ends talking
> (0.9). Scene 6 then resolves the calls in order 1→2→3, and it needs each panel to
> *enter* at a known state — so scene 5 must *settle* each waveform to its preset
> value before the cut. The de-phasing is free-running in the middle but lands on
> fixed marks at the boundary; that's what makes the cut into the resolution scene
> carry exactly.

## The thesis claim — it's still one run

The workflow band stays *fully visible and live* this whole scene — Campaign,
container, and Call rings still lit (carried from `S3`/`S5`), the camera framed so
the chain is in frame above the panels. That's not incidental; it's the scene's
argument.

> *"Why keep the workflow on screen during the money shot — wouldn't the panels
> alone be cleaner?"* Because the thesis isn't "three phone calls are happening" —
> it's "*one workflow run* is making three phone calls happen." Drop the workflow
> and you've shown three calls with no visible cause; the viewer might think you
> wired up three workflows. Keeping the lit chain above the three live panels makes
> the claim visible: one run (one set of rings) → three conversations (three
> panels). The empty table waiting at the right completes the sentence: one run,
> three calls, and a record still to be filled. The whole frame is the thesis.

## The values, and where they come from

All conversation content is `transcript-data.ts` (`LANES`), same as scene 4 — each
panel's greeting, human-reply shape, and confirmation line. Nothing new is
introduced; this scene re-uses the three lanes' authored content and just runs them
at different phases. The waveform de-phasing comes from the per-panel `seed`
(1/2/3) and the global clock `gf`; the dot de-phasing from `i·2.1`.

## The animation, beat by beat

1. **0.4–2.2 — pull back.** Camera `CAM_PANEL1 → CAM_HOME` (`inOut`).
2. **0.5–1.7 — un-dim.** Workflow and panels 2–3 release to full brightness
   (linear, riding the camera).
3. **3.0–9.8 — the three de-phased clocks** (see the table above). Each panel's
   turn loop runs on its own schedule; no two changes coincide.
4. **9.8–~16.2 — the alive hold.** Three shimmering waveforms at amplitudes
   1 / 0 / 0.9, three pulsing dots, the workflow's rings on above, the empty table
   waiting. ~6.4 seconds of the video's thesis frame, kept breathing by the global
   clock; the quiet gate settles it for the cut.

> *"How does a 6.4-second hold survive on a money shot?"* Same mechanism as scene
> 3's long hold, doing its most important work here. The global clock keeps all
> three waveforms and dots continuously shimmering — the frame is never static even
> though no *turn* is changing. Nothing is focal (that's correct — you're meant to
> take in the whole alive band, not track one event), and the de-phased shimmer
> carries the narration ("all three conversations are running at once... this is
> still a single run") across its full length. The scene was VO-stretched to 16.2s
> from the 14s minimum; the extra 2.2s is absorbed entirely by this hold, which is
> safe to stretch because every value has settled to the `S5` preset by 9.8 and the
> only remaining motion is the gated global-clock shimmer.

## How to think about the whole scene

1. *How do I get from the lean to the money shot?* Reverse the scene-4 move —
   pull back, un-dim on the same window → camera-plus-hierarchy in reverse.
2. *How do I make three live calls read as three, not one loop?* Three independent
   turn clocks, de-phased so no two change in the same second → the de-phasing is
   the spectacle.
3. *How do I make the cut into the resolution scene carry?* Settle each waveform to
   its `S5` preset amplitude (1 / 0 / 0.9) before the boundary → free-running in
   the middle, fixed marks at the edge.
4. *How do I prove it's honest?* Keep the lit workflow and the empty table in frame
   above/beside the panels → one run, three calls, a record still to fill.
5. *How does a 6s thesis hold carry?* Global clock keeps the band breathing; quiet
   gate settles the boundary → alive, not static.

## Exit state (what scene 6 inherits)

`camera at CAM_HOME (s 0.8), full frame · workflow live and bright (rings held,
fan = 1) · panel 1: 3 turns shown, waveform at 1 (talking) · panel 2: 2 turns
shown (human reply revealed), waveform at 0 (listening) · panel 3: 2 turns shown
(human reply revealed), waveform at 0.9 (talking) · three live dots pulsing
de-phased · outcomes SimTable present, still empty (0 rows) · global clock
continuous, quiet gate settled at the boundary`.

This is the `S5_THREE_AT_ONCE` preset. Scene 6 (`outcomes-land`) enters on exactly
this all-live, zero-rows frame and animates the resolution: each call ends in turn,
takes a green stamp, and drops a row into the table. Because scene 6's frame-0 state
equals this exit — three panels at amplitudes 1/0/0.9 with their exact turn counts,
the empty table — and both scenes render the same `<Stage/>`, the boundary is
identical down to the pixel. The money shot freezes for one frame and then begins to
resolve.

<!-- ── voice-agent / 06-outcomes-land.md ── -->

# Scene 6 — `outcomes-land`  ·  archetype: **accumulation (two surfaces, one event ×4)**

Source: `../source/scenes/OutcomesLandScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx` (`OutcomeStamp`), `../source/scenes/states.ts`
(`S6_OUTCOMES_LAND` — note the special Phase-A treatment), `../source/layout.ts`,
`../source/transcript-data.ts` (`TABLE_ROWS_DATA`).

This is the payoff scene — where every call becomes a row you can act on. The
three conversations resolve in turn, and each resolution is drawn as **four
surfaces firing as one event**: the panel stamps, the lane pulses, the Log-outcome
block blips, and a row drops into the real `SimTable`. Read it as the worked
example for "how do I show an accumulation honestly — a run writing records — and
how do I synchronize the maximum number of surfaces on a single event without it
reading as chaos."

---

## What this scene is for

The arc has shown the capability (workflow), the run, the calls connecting, the
mechanism (one conversation), and the money shot (all three at once). The one
thing left is the *consequence*: each call **ends**, and when it does, an outcome
is recorded. This scene resolves the three calls staggered (1→2→3), and each
resolution lands an outcome on two-going-on-four surfaces at once, accumulating
three rows into the table. Then, after the last row lands, the **run settles**:
rings release, wires cool, and the fan retracts back to the single lane —
completed *before* the cut so scene 7 enters on the clean settled chain.

The *one idea* is "every call ends as a row you can act on." It's the most
machinery-dense scene in the video, because resolution is a chain of synchronized
events and you have to draw every link — three times.

## A note on this scene's Phase-A frame

Every other scene's `states.ts` preset is its *settled end-state*, and Phase B
animates *toward* it. This scene is the declared exception. `S6_OUTCOMES_LAND` is
the **mid-state** — the money still: call 1 resolved (row 1 landed), call 2
stamping (row 2 landing), call 3 still live. That preset was the Phase-A static
frame used to compose the scene. But the scene's *true exit* is not its preset —
it's scene 7's *enter* state (all three resolved, fan retracted). So scene 6's
Phase B animates from its **enter** state (all live, 0 rows, inherited from `S5`)
to its **exit** (3 rows, all ✓, settled), and ignores its own preset's mid-state
as an end-point. The script declares this explicitly. It's worth understanding:
the preset here was a *composition aid* (the prettiest mid-frame to design
against), not the boundary contract. The boundary contract is scene 7's enter
state, and Phase B re-verifies every boundary pair against it.

## The resolution grammar — four surfaces, one event

This is the scene's signature, the equation it repeats three times. When a call
resolves, **one event** ("this call ended with this outcome") is drawn on four
surfaces simultaneously:

1. **The panel** — its waveform flatlines, its live dot goes solid green
   (`ended`), and a green ✓ **outcome stamp** lands over the waveform footer
   (`OutcomeStamp`, scale 0.86→1 pop, the config-template label).
2. **The lane** — a pulse crosses the Call→Log-outcome edge (`pulseLane`).
3. **The Log-outcome block** — it blips (a selection ring, `log: {highlighted}`).
4. **The table** — a row drops into the `SimTable` (`rowReveal[i]`).

> *"Four surfaces for one event — isn't that exactly the 'busy' you keep warning
> against?"* No, because they're all saying the *same thing* at the *same instant*,
> which the eye reads as one event, not four. The danger is four *different* events
> stacked in one moment; this is one event *echoed* across four surfaces, which is
> the opposite — it's reinforcement, not clutter. And it's *true*: in the real
> product, a call resolving really does cause the Log-outcome block to run (the
> blip + lane pulse) which really does insert a row (the table) — the panel stamp
> is the conversation-side view of the same event. The four surfaces are four
> *honest views* of one run event: the conversation ended (panel), control reached
> the logger (lane pulse), the logger ran (block blip), a row was written (table).
> Drawing fewer would be drawing *less truth*.
>
> *"How tightly are the four synchronized?"* Within ~0.2s of each other. For call 1:
> the lane pulse fires `c(1.2,1.8)`, the Log blip is the window `[1.7,2.3)`, the
> stamp reveals `c(1.7,2.4)`, the row drops `c(1.8,2.5)`. Stamp and row land **0.1s
> apart** — deliberately near-simultaneous so they read as one landing, with just
> enough offset that the lane pulse (the control reaching the logger) visibly
> *precedes* the row (the write), preserving cause→effect.

## The values, and where they come from

| Element | On screen | Source |
|---|---|---|
| Call 1 outcome stamp | ✓ "confirmed" | `LANES[0].outcome` (config-template label) |
| Call 2 outcome stamp | ✓ "rescheduled" | `LANES[1].outcome` |
| Call 3 outcome stamp | ✓ "confirmed" | `LANES[2].outcome` |
| Table row 1 | `+1 415 ··· 4288 \| confirmed \| completed` | `TABLE_ROWS_DATA[0]` |
| Table row 2 | `+1 628 ··· 1924 \| rescheduled \| completed` | `TABLE_ROWS_DATA[1]` |
| Table row 3 | `+1 917 ··· 7706 \| confirmed \| completed` | `TABLE_ROWS_DATA[2]` |
| Call 2 confirmation line | "No problem — I've moved you to Thursday at 11. You're confirmed." | `LANES[1].agentLines[1]` |
| Call 3 confirmation line | "Perfect — confirmed for 3 PM. Thanks, and have a good day." | `LANES[2].agentLines[1]` |

**The truth contract at its sharpest here.** Note the split in the table's columns:
the `outcome` column shows **config-template labels** (`confirmed` / `rescheduled`
— the words the builder configured), but the `status` column shows **`completed`** —
the registry's own enum value from `agentphone.ts` (`status`: completed /
in-progress / failed). So the table is honest about provenance: `outcome` is what
you *configured* the call to report; `status` is the system's *own* word for "this
call finished." Neither invents a run value. The destinations (`to`) are the same
masked stand-ins from the panels. This is `TABLE_ROWS_DATA`, derived directly from
`LANES`, so the panel and the table can never disagree — two surfaces, one data
source.

> *"Why does the table only ever contain the rows that have landed?"* In `_rig.tsx`,
> `landedRows` filters `TABLE_ROWS_DATA` to only rows where `rowReveal[ri] > 0.01` —
> so the `SimTable` literally *grows* a row at a time as `Insert Row` runs. A table
> cannot show a row the run hasn't inserted yet (the same honesty rule as the empty
> columns in market-desk and the empty table in scene 3). The grid has 1 row after
> call 1 resolves, 2 after call 2, 3 after call 3 — never three blank rows waiting
> to fill in. The rows don't *exist* until they're written.

## The animation, beat by beat

`mkClock` gives `t`/`c`; `sceneClock` gives `gf` (global clock) and `q` (quiet
gate). The three resolutions are spaced **~3.3s apart**.

### Call 1 resolves (~1.5–2.5s)

```ts
sp0    = 1 - c(0.8, 1.5, 0, 1, EASING.inOut)   // flatline
ended0 = t >= 1.6                               // dot goes solid green
out0   = c(1.7, 2.4, 0, 1, EASING.out)          // ✓ stamp pops in
row0   = c(1.8, 2.5, 0, 1, EASING.out)          // row 1 drops into the table
pl1    = c(1.2, 1.8, 0, 1, EASING.inOut)        // lane pulse
logBlip: t ∈ [1.7, 2.3)                          // Log block blips
```

Panel 1 (which entered talking at amplitude 1) flatlines over **0.8→1.5**; the dot
latches solid green at **1.6**; the lane pulse crosses **1.2→1.8**; the Log block
blips **1.7→2.3**; the stamp pops **1.7→2.4**; row 1 drops **1.8→2.5**. The four
surfaces fire within 0.2s of each other.

> *"Why does the flatline (ending 1.5) precede everything else?"* Because the call
> *ending* is what triggers the resolution. The waveform goes flat (the
> conversation stopped), and *that* is the cause of the outcome being recorded. So
> the flatline leads, then the dot turns green (the call is marked done), then the
> logger fires and the row lands. The order is the causality: conversation ends →
> outcome computed → record written.

### Call 2 — speaks first, then resolves (~2.6–5.9s)

```ts
count1 = t < 2.6 ? 2 : 3
turn3b = t < 2.6 ? 1 : c(2.6, 3.4, 0, 1, EASING.out)   // confirmation line reveals
sp1    = c(2.3, 2.9, 0, 1, EASING.inOut) - c(4.3, 4.9, 0, 1, EASING.inOut)  // talks, then flatlines
ended1 = t >= 5.0
out1   = c(5.1, 5.8); row1 = c(5.2, 5.9)
pl2    = c(4.6, 5.2); logBlip: t ∈ [5.1, 5.7)
```

Call 2 *entered listening* (from `S5`, waveform 0, human bars up). So it has to
**speak its confirmation first** before it can resolve: at **2.6** turn 3 (the
"rescheduled to Thursday" line) reveals (2.6→3.4) as the waveform springs up
(2.3→2.9), then flatlines (4.3→4.9), *then* resolves — ended 5.0, stamp 5.1→5.8,
row 5.2→5.9, with its own four-surface sync (lane pulse 4.6→5.2, Log blip
5.1→5.7).

> *"Why does call 2 speak before resolving while call 1 just resolved?"* Because
> they entered in different states. Call 1 entered *talking* (it was mid-sentence),
> so it just finishes and resolves. Call 2 entered *listening* (it had heard the
> reply and not yet responded), so honesty requires it to *give its answer* before
> the call can end — you can't resolve a call the agent hasn't responded on. This
> is the de-phasing from scene 5 paying off: because the three panels were left at
> different points in their loops, their resolutions naturally take different shapes,
> which keeps the three landings from feeling like one repeated animation. The
> de-phasing that was the *spectacle* in scene 5 becomes the *variety* in scene 6.

### Call 3 — talks, lands its line, resolves last (~5.6–9.1s)

```ts
count2 = t < 5.6 ? 2 : 3
turn3c = t < 5.6 ? 1 : c(5.6, 6.4, 0, 1, EASING.out)   // confirmation line
sp2    = 0.9 - c(7.5, 8.1, 0, 0.9, EASING.inOut)        // 0.9 → flatline
ended2 = t >= 8.2
out2   = c(8.3, 9.0); row2 = c(8.4, 9.1)
pl3    = c(7.8, 8.4); logBlip: t ∈ [8.3, 8.9)
```

Call 3 entered talking at 0.9 (from `S5`). Its line lands (5.6→6.4), it keeps
talking, then flatlines (7.5→8.1) and resolves last — ended 8.2, stamp 8.3→9.0,
row 8.4→9.1, four-surface sync (lane pulse 7.8→8.4, Log blip 8.3→8.9).

### The chained lane pulse — one wire, one pulse at a time

```ts
pulseLane = pl1 < 1 ? pl1 : pl2 < 1 ? pl2 : pl3
```

There's *one* lane edge, and three landings. This chain hands the lane to whichever
pulse is currently mid-flight: `pl1` until it completes, then `pl2`, then `pl3`.
The three pulse windows never overlap (1.2–1.8, 4.6–5.2, 7.8–8.4), so the single
lane carries exactly one pulse at a time.

> *"Why one lane and three landings — shouldn't each ghost lane pulse?"* Because
> the *real* lane is what runs the Log-outcome block; the ghosts are runtime
> instances of it. Conceptually each instance's Insert-Row fires, but they're
> drawn as one lane carrying three sequential pulses (the resolutions are
> staggered, never simultaneous), which is cleaner than three ghost lanes each
> pulsing — and it keeps the eye on the one real lane, the one that's actually
> connected to the table by timing. One lane, three pulses, three rows.

### The settle — rings release, wires cool, fan retracts

```ts
campaign: {highlighted: t < 9.7}    // campaign ring releases at 9.7
call:     {highlighted: t < 9.85}   // call ring releases at 9.85
container:{highlighted: t < 10.0}   // container ring releases at 10.0
wireCool = c(9.6, 10.4, 1, 0)        // edge heat fades
fan      = c(10.0, 11.4, 1, 0)       // ghosts retract into the single lane
```

After the last row lands (~9.1), the run settles: the three rings release
**staggered** (campaign 9.7, call 9.85, container 10.0), the wires cool over
**9.6→10.4**, and the fan retracts over **10.0→11.4** — the ghost pairs sliding
back behind the real lane, undoing scene 2's fan. **All of this completes before
the cut** (the scene ends ~12.3s), so scene 7 enters on a fully clean, settled
chain.

> *"Why stagger the ring releases instead of dropping them all at once?"* Because a
> run winds *down* the way it wound *up* — block by block. Snapping all three rings
> off on one frame would read as "someone hit stop"; releasing them ~0.15s apart
> (campaign → call → container) reads as the run *completing*, each block finishing
> its work in turn. The order even mirrors the run: the outer agent settles, then
> the call, then the container that held them.
>
> *"Why must the fan fully retract before the cut?"* Because scene 7 is the
> settled bookend — its enter state is the clean single lane, fan = 0. If the fan
> were still retracting at the cut, scene 7 would open mid-retraction and either
> jump or finish the motion itself, breaking the boundary. Completing the
> retraction by 11.4 (with ~0.9s of hold after) guarantees scene 7 inherits a
> static, finished chain. The settle is *inside* this scene, not split across the
> cut.

### The hold — ~11.4–12.3s

After the fan retracts at 11.4, ~0.9s of hold on the settled, three-rows-full
frame. Effectively no hold — the scene spends its whole length on the resolutions
and settle; the quiet gate dips it at the boundary.

## How to think about the whole scene

1. *What's the payoff?* Each call becomes a recorded row → resolve the three,
   staggered.
2. *How do I draw one resolution?* Four surfaces, one event — panel stamp, lane
   pulse, Log blip, table row, within 0.2s → reinforcement, not clutter.
3. *Why do the three resolutions look different?* Because the panels entered in
   different states (talking / listening / talking) — the scene-5 de-phasing
   becomes scene-6 variety.
4. *Why does the table grow a row at a time?* Because a table can't show a row the
   run hasn't inserted → honest accumulation.
5. *Why split `outcome` (config label) from `status: completed` (registry enum)?*
   Honest provenance — what you configured vs. the system's own word.
6. *How do I hand a clean frame to the bookend?* Settle inside the scene — release
   rings staggered, cool wires, retract the fan — all completed before the cut.

## Exit state (what scene 7 inherits)

`workflow settled and clean (all rings released, wires cool, fan retracted to the
single lane — fan = 0) · three call panels resolved: each waveform flat, dot solid
green, ✓ outcome stamp landed (confirmed / rescheduled / confirmed) · outcomes
SimTable full: three rows (to / outcome / status = completed) · camera at CAM_HOME
(s 0.8) · global clock continuous, quiet gate settled at the boundary`.

This equals scene 7's enter state (the `S7_THE_CAMPAIGN_RAN` preset: fan 0, all
three panels ended with outcomeReveal 1, rowReveal [1,1,1]). Scene 7 opens on
exactly this settled frame and does the quiet retell — one sequential pulse per
table row, the camera easing back ~3%. Because the fan retraction and ring
releases completed *inside* scene 6, this boundary is a clean static handoff,
identical down to the pixel.

<!-- ── voice-agent / 07-the-campaign-ran.md ── -->

# Scene 7 — `the-campaign-ran`  ·  archetype: **settle / bookend (the quiet retell)**

Source: `../source/scenes/TheCampaignRanScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/states.ts` (`S7_THE_CAMPAIGN_RAN`), `../source/layout.ts`
(`CAM_HOME`, `CAM_OUT`), `../source/transcript-data.ts`.

This is the bookend — the settled frame that retells the run without re-running
it. The campaign is over: the chain rests, the three panels sit quiet with their ✓
stamps, the table is full. The scene's one gesture is a *quiet retell* — each
table row takes a single sequential pulse, 1→3, recapping "three calls, three
outcomes" with zero new run energy. Read it as the worked example for "how do I
close a video — settle, recap without repeating, and end on a still that means
something."

---

## What this scene is for

The video ran once. Scene 6 landed the three outcomes and settled the chain. This
scene's job is to *let it land* and *retell it* — to hold the completed state long
enough for the viewer to absorb "that was one run that made three phone calls and
recorded three outcomes," and to gently re-walk the three results so the recap is
felt, not just stated. The macro arc declared **run count: 1** — there is no
second run, no recap run. The retell is done with *highlight pulses on the existing
rows*, not by re-firing anything.

The *one idea* is "one run, three real phone calls, three recorded outcomes." It's
a hold-dominated bookend: a tiny camera ease-back, three sequential row pulses, and
then a long, intentional stillness.

## What it looks like

The settled frame from scene 6: the clean chain at rest (fan retracted, rings off),
three quiet call panels each showing its full transcript and green ✓ stamp, the
outcomes `SimTable` full with three rows. The camera eases back ~3% — a small final
pull-out. Then each table row, in turn, takes one quiet highlight pulse (1→3,
sequential), like a finger running down the recorded results. After the third pulse
fades, nothing moves: the dots are solid green, the waveforms flat, the frame still.

## The settled inheritance — this scene barely animates

The scene spreads `S7_THE_CAMPAIGN_RAN` — the full settled preset — and changes
almost nothing:

```tsx
<Stage
  frame={gf}
  state={{
    ...S7_THE_CAMPAIGN_RAN,   // fan 0, all panels ended+stamped, table full (rows 1,1,1)
    cam: camMix(CAM_HOME, CAM_OUT, camP),
    rowPulse,                 // the only real addition
    quiet: q,
  }}
/>
```

`S7_THE_CAMPAIGN_RAN` already carries the entire end state: `fan: 0`, all three
panels `{ended: true, outcomeReveal: 1, turnCount: 3}`, `tableReveal: 1`,
`rowReveal: [1, 1, 1]`. The scene inherits a finished world. The only things it
*does* are ease the camera back and run the row pulses.

> *"Why is the camera move from `CAM_HOME`, not from `CAM_OUT` where scene 6 left
> off?"* Scene 6 ended at `CAM_HOME` (s 0.8). Scene 7 enters at `CAM_HOME` and eases
> to `CAM_OUT` (s 0.775) — so its frame-0 *is* `CAM_HOME`, matching scene 6's exit
> exactly. The ease-back happens *within* scene 7, starting from the inherited home
> framing. That's why `camMix(CAM_HOME, CAM_OUT, camP)` with `camP` starting at 0:
> frame 0 is pure `CAM_HOME`, and it drifts out from there.

## The camera — the ~3% ease-back

```ts
camP = c(0.4, 2.0, 0, 1, EASING.inOut)
cam  = camMix(CAM_HOME, CAM_OUT, camP)   // s 0.8 → 0.775
```

The camera eases from `CAM_HOME` (s 0.8) to `CAM_OUT` (s 0.775) over **0.4→2.0** —
a ~3% pull-back, barely perceptible.

> *"Why such a tiny camera move — 3% is almost nothing?"* Because a bookend wants a
> *whisper* of a pull-back, not a real move. The slight retreat reads as "stepping
> back to take in the whole finished thing" — the visual equivalent of exhaling at
> the end. A bigger move would feel like a new event; 3% is just enough that the
> frame settles outward, signaling closure, without drawing attention to itself.
> It's the same ~3–6% ease-back every bookend in this series uses (browser-agent's
> scene 7, market-desk's outro) — the house punctuation for "the end."
>
> *"Why `EASING.inOut`?"* It's a camera move — the canonical `inOut` case. Eases
> out of home, settles into the final framing.

## The quiet retell — sequential row pulses

```ts
pulseAt(a) = Math.min(c(a, a+0.3), c(a+0.7, a+1.2, 1, 0))   // up 0.3s, hold, down 0.5s
rowPulse   = [pulseAt(2.4), pulseAt(3.8), pulseAt(5.2)]
```

Each row gets one highlight pulse — an up-hold-down (up over 0.3s, down over 0.5s)
— and they fire **sequentially at 1.4s spacing**: row 1 at **2.4**, row 2 at
**3.8**, row 3 at **5.2**. `rowPulse` is fed to the `SimTable`'s `cellHighlight`
(via `cellHighlight={(_, ri) => rowPulse[landedIdx[ri]]}`), which draws the
product's own row-selection treatment — one row lighting up, then releasing, then
the next.

> *"Why retell with row pulses instead of re-running the workflow?"* Because the
> video already made its point with one run; re-running it would be redundant motion
> and would muddy the "it's *one* run" thesis. The recap energy comes from
> *re-touching the results*, not re-doing the work. A pulse running down the three
> recorded rows says "look — three outcomes, recorded" by pointing at the receipts,
> which is exactly the close the script wants: the run retold *as its record*. This
> is the build's "quiet retell" move — recap with zero re-run.
>
> *"Why 1.4s spacing — and why sequential, not all three at once?"* Sequential
> because the retell is a *walk* down the results — row 1, then 2, then 3, the way
> you'd run your finger down a list confirming each entry. Pulsing all three at once
> would say "here are the results" as one flat statement; pulsing them in turn says
> "this one, and this one, and this one" — three confirmations, matching the three
> calls. 1.4s is slow and calm, the right pace for a closing recap (faster would
> feel anxious, like the run energy from scene 6 hadn't dissipated). Each pulse
> (0.3s up + ~0.4s hold + 0.5s down ≈ 1.2s) fits inside its 1.4s slot, so they don't
> overlap — one row lit at a time, clean.
>
> *"Why does the up-ramp (0.3s) differ from the down-ramp (0.5s)?"* The same
> up-fast/down-slow signature as every one-shot highlight in the build — a quick
> rise grabs the eye, a slower release lets it linger and feel deliberate. It reads
> as a considered touch, not a flicker.

The retell finishes by **6.4s** (row 3's pulse, fired at 5.2, fully down by ~6.4).

## The values, and where they come from

Nothing new on screen — the scene shows the settled state of everything already
established: the three panels with their authored transcripts and config-label ✓
stamps (`LANES[i].outcome`), the full `SimTable` with `TABLE_ROWS_DATA` (to /
outcome / status = completed). The retell pulses don't introduce content; they
re-light existing rows. This is correct for a bookend — a recap shows you what you
already saw, it doesn't add.

## The animation, beat by beat

`mkClock` gives `t`/`c`; `sceneClock` gives `gf` and `q`.

1. **0.4–2.0 — the ease-back.** Camera `CAM_HOME → CAM_OUT` (~3%, `inOut`).
2. **2.4–~3.6 — row 1 pulses.** Up 2.4→2.7, hold, down 3.1→3.6.
3. **3.8–~5.0 — row 2 pulses.** Same shape, offset 1.4s.
4. **5.2–~6.4 — row 3 pulses.** Same shape, offset 1.4s.
5. **6.4–~11.3 — the still hold.** ~4.9 seconds of intentional stillness: dots
   solid green (`ended` kills the pulse — they no longer oscillate), waveforms flat,
   chain at rest, table full. The quiet gate handles the boundary, but there's
   nothing oscillating to settle — the frame is genuinely still.

> *"Isn't a ~5-second still hold dead air, especially as the *last* thing the
> viewer sees?"* No — and this is the one place in the video where the stillness is
> the *meaning*. Every other hold was *alive* (latched rings, shimmering waveforms,
> pulsing dots) because the run was in flight. Here the run is *over*, so the frame
> is genuinely still, and that stillness *is* the message: the campaign is done,
> the work is recorded, there's nothing left running. An alive hold here would lie —
> it would imply the run is still going. The dots being solid green (not pulsing),
> the waveforms flat, the chain dark — these are the picture of "finished." At under
> 5 seconds post-payoff, it reads as the breath the bookend template asks for: a
> moment to let the completed thing sit before the video ends. The VO ("that was one
> run — three phone calls, three conversations, and every outcome recorded") plays
> over this still, and the scene was stretched to 11.3s to fit it; the extra length
> is absorbed entirely by this stillness, which is trivially safe to stretch because
> nothing is moving.
>
> *"Why do the dots stop pulsing here when they pulsed the whole rest of the
> video?"* In `_rig.tsx`, `livePulse = p.ended ? 0 : 0.5 + 0.5·sin(...)` — once a
> panel is `ended`, its live dot drops to a fixed solid green with no oscillation.
> All three panels are `ended` in `S7`, so all three dots are solid. This is
> product-honest: a live dot pulses while the call is *in progress*; a finished call
> shows a steady "done" indicator. The cessation of pulsing is itself information —
> the calls are over.

## How to think about the whole scene

1. *How do I close?* Settle, retell, end on a meaningful still → the bookend shape.
2. *What's already true at the open?* Everything — inherit the full `S7` settled
   preset; the scene barely animates.
3. *How do I recap without repeating?* Sequential row pulses (1.4s spacing) on the
   existing rows → the quiet retell, recap energy with zero re-run.
4. *How do I punctuate the end?* A ~3% camera ease-back → the house "the end"
   whisper.
5. *How do I end on a still that isn't dead?* Let the stillness *mean* "finished" —
   solid (not pulsing) dots, flat waveforms, a run that's genuinely over → stillness
   as the message, not the absence of one.

## Exit state (the end of the video)

`camera at CAM_OUT (s 0.775) · chain clean and at rest (fan 0, no rings) · three
panels quiet, each with its full transcript and solid-green ✓ stamp, dots solid
(not pulsing), waveforms flat · outcomes SimTable full (three rows, status =
completed) · all retell pulses released by 6.4s · a still, settled frame`.

There's no scene 8 to inherit this — it's the last frame of the video. But the
continuity discipline still applies inward: this scene's enter state had to equal
scene 6's exit (which it does, via the shared `S7` preset and the fan/ring settle
completing inside scene 6), so the cut *into* the bookend was identical down to the
pixel. The video ends where it should — on the campaign's recorded result, held
still long enough to land.

<!-- ── voice-agent / CHOREOGRAPHY.md ── -->

# voice-agent — choreography notes

verdict: hype-3 ranking **#3** ("good despite some visual artifacts") —
loved content (the streaming call panels, carried from the hype2 take the
director graded GOOD); the artifacts cost it two places, not the
choreography. This is also the reference implementation of living-motion
pattern 2: **global clock + quiet gate**.
branch: `hype3/voice-agent` · comp: `voice-agent-v2`
duration: 82.3s after vo-sync (authored visual minimum 70s)
run economy: **1 run**, spanning scenes 2→6. Scene 1 assembles; scene 7
holds the settled state and re-pulses the rows (retell, no re-run).
source: `src/videos/voice-agent/` — `timing.ts` (the global clock),
`scenes/_anim.ts` (`mkClock`, `sceneClock`, `camMix`), `scenes/states.ts`
(per-scene end-state presets), `scenes/_rig.tsx` (`<Stage/>`),
`scenes/_parts.tsx` (CallPanel / Waveform / OutcomeStamp).

## The one idea

Give an agent a phone and it CALLS: one workflow run fans into three
live phone conversations and writes every outcome back to a table. Set
piece: top band = product-true chain Start → Campaign (agent) → Parallel
"Call each" (ONE lane: Call (AgentPhone) → Log outcome (Table); ghost
pairs fan at runtime only); bottom band = three call panels + the real
outcomes SimTable, separate boxes, no edge ever crossing bands — sync by
timing only. Cameras: CAM_WORK (s 0.9) → CAM_HOME (s 0.8) → CAM_PANEL1
(s 1.06) → CAM_OUT (s 0.775).

## THE MECHANISM — timing.ts global clock + quiet gate (annotate this first)

This video's aside band carries continuously-oscillating surfaces
(waveform bars, pulsing live dots) ACROSS cuts. Extend-only VO retiming
changes scene lengths in 0.1s steps, which would break any boundary that
depends on a periodic animation's phase. The fix is two pieces, both in
`scenes/_anim.ts` reading `timing.ts`:

1. **Global oscillator frame `gf`.** `timing.ts` exports `SCENE_LIST`
   with authored minimums and `sceneSeconds()` = `max(min,
   VO_TIMING[name])` — the SAME numbers Video.tsx uses to mount
   Sequences. `sceneStartFrames(name)` sums effective prior durations, so
   `gf = localFrame + sceneStartFrames(name)` is a video-global clock
   that is correct in the master comp AND in standalone scene comps
   (verify-boundaries renders scene comps). Every scene passes
   `frame={gf}` to `<Stage/>`; all oscillators derive from it:
   - waveform bars: three out-of-phase sines per bar,
     `0.5 + 0.32·sin(gf/9 + i·0.7 + seed·2.1) + 0.18·sin(gf·1.7/9 −
     i·0.42 + seed) + 0.12·sin(gf·0.6/9 + i·1.3 + seed·3.3)` — `seed`
     (1/2/3 per panel) de-phases the three panels;
   - live dots: `0.5 + 0.5·sin(gf/9 + i·2.1)` per panel.
   Because the phase is global, the shimmer is CONTINUOUS through every
   cut — no pop, ever, at any VO-retimed duration.
2. **Quiet gate `q`.** `sceneClock` also returns `q`: 0 at both boundary
   frames of the scene, ramping 0→1 over the first 0.5s and 1→0 over the
   last 0.5s (plain clamped interpolate, no easing). Every oscillating
   AMPLITUDE multiplies by `q` (`speaking * quiet` into the waveform;
   `0.5 + 0.5·sin(...) * quiet` for the dots — note the dot gates to a
   FIXED mid-glow 0.5, the waveform to its flat 6% baseline). Result:
   every cut lands on a settled, pixel-identical frame
   (verify-boundaries reads IDENTICAL) and the half-second dip reads as
   a natural lull between conversation turns, not a freeze.

Imitate literally: put scene lengths in one `timing.ts` shared by
Video.tsx AND scenes; derive every periodic phase from
`frame + sceneStartFrames(scene)`; multiply every periodic amplitude by
the 0.5s-ramp quiet gate.

Also note `states.ts`: one static end-state preset per scene
(S1…S7), spread into each scene's Stage props — the boundary contract
holds by CONSTRUCTION because scene N animates toward the preset scene
N+1 spreads.

## Scene 1: the-workflow (0–9.1s, authored 9s)

INTENT: a normal Sim workflow — except one block places phone calls.
CAMERA: static CAM_WORK (the top band, closer; aside band off-frame
below).
CHOREOGRAPHY (left→right assembly, block-fade/edge-draw alternation):
- Start `c(0.3,0.9, out)` → edge1 draws `c(1.0,1.5, inOut)` → Campaign
  `c(1.4,2.0, out)` → edge2 `c(2.2,2.7, inOut)` → container
  `c(2.6,3.3, out)` → pill wire `c(3.4,3.9, inOut)` → Call
  `c(3.8,4.4, out)` → lane wire `c(4.6,5.1, inOut)` → Log outcome
  `c(5.0,5.6, out)`. (`c` = clamped interpolate over local seconds.)
- The reference beat: `<parallel.currentItem>` tag in Call's "To Number"
  row glows once, `min(c(6.2,6.6), c(7.4,8.0, 1, 0))` — on 0.4s, hold,
  off 0.6s; fully released before the cut.
HOLDS: 8.0 → 9.1 (~1.1s) on the clean chain. Pattern: quiet gate is live
(passed as `quiet: q`) but no panels exist yet, so the hold is plain —
short enough to read as a breath.

## Scene 2: the-run-fires (9.1–16.6s, authored 7s)

INTENT: one run, distributed — the parallel turns one lane into three
live calls.
CAMERA: `camMix(CAM_WORK, CAM_HOME, c(4.2, 6.2, inOut))` — eases back
WHILE the fan opens, revealing the still-empty aside band (the camera
move is a reveal, timed after the fan starts).
CHOREOGRAPHY (blip → pulse → ring relay, left to right):
- Start blip window `t ∈ [0.3, 0.8)` → `pulse1 = c(0.5,1.2, inOut)` with
  edge1 heat `c(0.9,1.3)` → Campaign live latches 1.15 → `pulse2 =
  c(1.6,2.3, inOut)`, edge2 heat `c(2.0,2.4)` → container live latches
  2.25.
- Inside: pill blip `min(c(2.5,2.7), c(3.0,3.3,1,0))`; `pulsePill =
  c(2.8,3.5, inOut)`; pill-edge heat `c(3.2,3.6)`; Call live latches
  3.45 — each surface lights the frame the pulse reaches it.
- THE FAN: `fan = c(3.6, 5.0, inOut)` — two header-only ghost PAIRS
  (Call + Log outcome) separate above and below the real lane,
  `ghostTop(g, fan)` lerping from behind the lane; their wires fan with
  them. Tag glows while the items distribute: `min(c(3.9,4.3),
  c(5.4,6.0,1,0))` — released before the cut.
HOLDS: 6.2 → 7.5 (~1.3s) on the live fanned chain at home framing.
Quiet gate active; short.

## Scene 3: calls-connect (16.6–28.7s, authored 8s)

INTENT: each call is a real live phone conversation — and a record is
waiting to be filled.
CAMERA: static CAM_HOME.
CHOREOGRAPHY (staggered births, two surfaces):
- Panel births at **0.5 / 1.4 / 2.3** (0.9s stagger). Per panel i:
  pop-in `visible = c(BIRTH, BIRTH+0.6, out)` (opacity + 26px translateY
  rise); greeting bubble types in `lastReveal = c(BIRTH+0.5, BIRTH+1.1,
  out)` (bubbles rise 12px as they reveal); waveform springs to life
  `speaking = c(BIRTH+0.7, BIRTH+1.5, 0, SP[i], out)` with SETTLE
  amplitudes `SP = [1, 0.85, 0.7]` — three different loudnesses = three
  de-phased live calls, matching the S3 preset exactly.
- The record appears LAST: SimTable (header only, zero rows) reveal
  `c(4.6, 5.4, out)` with the same 26px rise — the empty table is the
  scene's closing beat, not furniture.
HOLDS: 5.4 → 12.1 (~6.7s) — ALIVE: three waveforms shimmer on the global
clock at amplitudes 1/0.85/0.7, three live dots pulse de-phased
(`i*2.1` phase offset), workflow rings stay lit. This is the build's
proof that a 6s hold can carry: nothing is focal, everything breathes.
Quiet gate settles it for the cut.

## Scene 4: one-conversation (28.7–42.5s, authored 12s)

INTENT: the mechanism — it speaks, hears the answer, responds; turn by
turn.
CAMERA: `camMix(CAM_HOME, CAM_PANEL1, c(0.5, 2.2, inOut))`; the
de-focus `workflowDim = c(0.7, 1.9)` (workflow band → 38% opacity) and
panel dims ride the SAME window — camera and hierarchy move as one.
CHOREOGRAPHY (the turn loop on panel 1):
- Carried in speaking the greeting (`speaking = 1` from S3).
- The agent flatlines: `sp0 = 1 − c(3.0,3.7,inOut) … `; the human reply
  rises as skeleton bars: turn 2 reveal `c(4.2, 5.0, out)`
  (`turnCount` steps 1→2 at t=4.2) — the waveform going FLAT while the
  bars rise is the "listening" picture, two surfaces one event.
- The agent comes back: `… + c(7.0, 7.8, inOut)` springs the waveform
  back UNDER turn 3's authored confirmation line revealing
  `c(7.4, 8.2, out)` (`turnCount` 2→3 at 7.4) — voice returns as the
  bubble lands.
- Background panels settle to dim amplitudes: `sp1 = 0.85 −
  c(0.9,2.0,0,0.85,inOut)` (to 0), `sp2 = 0.7 − c(0.9,2.0,0,0.1,inOut)`
  (to 0.6), both dimmed 55% — quieter, not dead.
HOLDS: 8.2 → 13.8 (~5.6s) leaned into panel 1 — ALIVE: panel 1's
waveform at full amplitude, dot pulsing, panel 3 still murmuring at 0.6
behind the dim. Quiet gate dips it at the boundary (reads as the
conversation pausing).

## Scene 5: three-at-once (42.5–58.7s, authored 14s) — THE MONEY SHOT

INTENT: the whole campaign is talking at once — and it's still ONE run
of the workflow above.
CAMERA: pull back `camMix(CAM_PANEL1, CAM_HOME, c(0.4, 2.2, inOut))`;
dims release on `undim = c(0.5, 1.7, 1, 0)` riding the move.
CHOREOGRAPHY (three de-phased conversation clocks — copy these numbers):
- Panel 1: keeps talking, takes a breath mid-scene, talks again —
  `sp0 = 1 − c(4.5,5.3,inOut) + c(7.5,8.3,inOut)` (ends 1).
- Panel 2: human reply rises at 3.0 (`turnCount` 1→2, reveal
  `c(3.0,3.8,out)`); agent answers `sp1 = c(5.5,6.3,0,0.9,inOut)`, then
  listens again `− c(9.0,9.8,0,0.9,inOut)` (ends 0 — S5 leaves it
  listening).
- Panel 3: listening at 0.6; flatlines `−c(3.8,4.5)`; its human reply
  rises at 4.6 (reveal `c(4.6,5.4,out)`); agent comes back
  `+ c(7.0,7.8,0,0.9,inOut)` (ends 0.9).
- Every amplitude settles to the S5 preset values so the cut into
  outcomes-land carries exactly. No two panels change state in the same
  second — the de-phasing IS the spectacle.
HOLDS: 9.8 → 16.2 (~6.4s) on the alive frame: three shimmering
waveforms at 1/0/0.9, three pulsing dots, rings on above, empty table
waiting right. The video's thesis frame; the global clock keeps it
breathing for 6+ seconds of narration.

## Scene 6: outcomes-land (58.7–71s, authored 12s)

INTENT: every call ends as a row you can act on — two surfaces, one
event, three times.
CAMERA: static CAM_HOME.
CHOREOGRAPHY (staggered resolutions ~3.3s apart, each a 4-surface sync):
- Call 1: flatline `sp0 = 1 − c(0.8,1.5,inOut)` → dot solid green
  (`ended` latches 1.6) → ✓ stamp `out0 = c(1.7,2.4, out)` (scale
  0.86→1 pop) → row 1 drops `row0 = c(1.8,2.5, out)` — stamp and row
  land 0.1s apart, deliberately near-simultaneous.
- Call 2 SPEAKS FIRST (its authored confirmation line, turn 3 reveal
  `c(2.6,3.4,out)`, waveform `c(2.3,2.9) − c(4.3,4.9)`), THEN resolves:
  ended 5.0, stamp `c(5.1,5.8)`, row `c(5.2,5.9)`.
- Call 3 resolves last: line at 5.6, flatline `0.9 − c(7.5,8.1)`, ended
  8.2, stamp `c(8.3,9.0)`, row `c(8.4,9.1)`.
- The workflow echoes each landing: `pulseLane` fires per landing
  (`c(1.2,1.8) / c(4.6,5.2) / c(7.8,8.4)`, chained `pl1<1 ? pl1 : pl2<1
  ? pl2 : pl3` so the one lane carries one pulse at a time) and the Log
  outcome block blips in three windows `[1.7,2.3) ∪ [5.1,5.7) ∪
  [8.3,8.9)` — panel stamp ↔ lane pulse ↔ Log blip ↔ table row: four
  surfaces, one event.
- Settle inside the scene: rings release staggered (campaign 9.7, call
  9.85, container 10.0), wires cool `c(9.6,10.4,1,0,inOut)`, fan
  retracts `c(10.0,11.4,1,0,inOut)` — COMPLETE before the cut so scene
  7 enters the clean frame.
HOLDS: 11.4 → 12.3 (~0.9s). Quiet gate; effectively no hold — the scene
spends its whole length.
NOTE: this scene ignores its states preset's mid-state (S6 was the
Phase-A money STILL); it animates enter (all live, 0 rows) → exit (3
rows, all ✓), as the script declares.

## Scene 7: the-campaign-ran (71–82.3s, authored 8s)

INTENT: one run, three calls, three recorded outcomes — retold without
re-running.
CAMERA: `camMix(CAM_HOME, CAM_OUT, c(0.4, 2.0, inOut))` (~3% ease-back).
CHOREOGRAPHY: the retell — one quiet highlight pulse per table row,
sequential 1→3 at **1.4s spacing**: `pulseAt(a) = min(c(a, a+0.3),
c(a+0.7, a+1.2, 1, 0))` at a = 2.4 / 3.8 / 5.2, fed to
`cellHighlight` via `rowPulse`. Every pulse absorbs by 6.4.
HOLDS: 6.4 → 11.3 (~4.9s) on the settled bookend. The dots are solid
green (`ended` kills the pulse) and waveforms flat — this hold is
intentionally STILL (the campaign is over); the stillness is the
meaning, and at under 5s post-payoff it reads as the breath the
template asks for.

## The moves used

- **global clock + quiet gate** (every scene — pattern 2 from
  VOICEOVER.md; see THE MECHANISM above). The transferable core of this
  build.
- **de-phased streams** (s3 birth stagger 0.9s + settle amplitudes
  1/0.85/0.7; s5's three independent talk/listen clocks; per-panel seed
  + `i*2.1` dot phase).
- **two-surface sync, scaled to four** (s6: stamp ↔ lane pulse ↔ Log
  blip ↔ row, within 0.2s of each other, three times at ~3.3s spacing).
- **speak/listen hand-off** (s4/s5: waveform flatlines AS skeleton bars
  rise; springs back AS the authored line lands).
- **runtime fan of ghost pairs** (s2: `fan = c(3.6,5.0,inOut)`, wires
  fanning with blocks).
- **blip → pulse → ring relay** (s2's run entry; latching `t >= X`
  rings the frame the pulse arrives).
- **camera-plus-hierarchy moves** (s4: lean-in, workflowDim and panel
  dims on the same window; s5: pull-back with undim riding it).
- **end-state presets (states.ts)** — animate toward the preset the next
  scene spreads; boundaries hold by construction.
- **the quiet retell** (s7: sequential row re-pulses at 1.4s — recap
  energy with zero re-run).
