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
