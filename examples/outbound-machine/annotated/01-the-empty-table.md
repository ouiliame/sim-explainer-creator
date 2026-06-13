# Scene 1 — `the-empty-table`  ·  archetype: **problem visual / table hero**

Source: `../source/scenes/TheEmptyTableScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the opening scene, and like every good opener it does exactly one
thing: it puts the object the whole video is about on screen — an outbound
table — and it shows that table **empty**. Read it as a worked example. Every
decision below is one you'll make again in your own first scene.

---

## What this scene is for

The video's thesis is "an outbound machine is one workflow that fills a table."
So scene 1 has to make the *table* concrete, and — this is the load-bearing
part — it has to show the table with **no rows in it**. That emptiness is the
question you plant in the viewer's head: *who fills this in?* The rest of the
video is the answer, and the last scene is the same table, full.

The rule the scene follows is *one idea per scene*: this scene is "here is the
empty campaign," full stop. No workflow underneath, no run, no motion beyond
the table assembling and one gesture that says "this whole pane is the job."
Resist the urge to also tease the machine here — the machine gets scene 2.

## What it looks like

A six-column table — `company · contact · title · signal · message · status` —
centered and hero-framed. The header row carries the column names; below it is
a six-row pane that is **completely empty**. The pane fades in first, then the
six header cells appear left-to-right, then a single soft selection-tint washes
over the whole empty pane and releases. Then it rests.

## The real decisions

The scene renders the one set piece and almost nothing else:

```tsx
<Stage
  cam={CAM_TABLE}
  tableIn={tableIn}
  colIn={colIn}
  paneSel={paneSel}
  rowLand={NONE}
  apollo={{hidden: true}}
  cont={{hidden: true}}
  wb={{hidden: true}}
  edge1={{progress: 0}}
  edge2={{progress: 0}}
/>
```

Three things to take from this.

**Use `SimTable`, the real product table — never a hand-built grid.** The data
an outbound campaign lives in is a Sim table, so the surface on screen is the
actual `SimTable` component (`_rig.tsx` line 537), fed real columns
(`OUTBOUND_COLUMNS` from `data.ts`) and a row matrix. You are never designing a
table here; you're configuring the one that exists. The column widths come from
`COL_NATIVE_W = [120, 150, 130, 150, 330, 90]` — note the message column is
**330**, more than twice any other, because it has to hold a two-line opener
later. That width is decided in scene 1 and never changes, so the table you see
empty here is dimensionally identical to the table you see full in scene 8.

**The machine is present — just `hidden`.** Apollo, the Enrich container, and
the Table block are all passed `{hidden: true}`; both outer edges are passed
`progress: 0` (drawn to zero length). This is the part people get wrong. The
instinct is "scene 1 is only the table, so render only the table." Don't. There
is *one* set piece (`<Stage/>`) for the entire video, and every scene renders
all of it, turning pieces on and off with state props.

> *"Why render things I can't see?"* Because of the cut into scene 2. Scene 2
> brings the machine in and eases the camera out. If scene 1 didn't render the
> chain at all and scene 2 mounted it fresh, you'd risk a one-frame layout
> shift — the table reflowing as the chain claims space, a flash. By rendering
> the same single set piece in both scenes and only animating visibility +
> camera, the boundary between them is identical by construction. Continuity
> stops being something you check and becomes something you can't break.

**The empty rows are empty *by construction*, not by styling.** Look at how
`rowLand={NONE}` (a function returning `0`) flows through the rig. In `_rig.tsx`,
`rowOpacity={landAt}` gates each row's chrome, and `landAt(r)` is `rowLand(r)`
here — so every row's opacity is zero. An un-landed row is not "an empty row";
it's invisible pane. This matters: the table opens empty because **a row hasn't
been inserted yet**, exactly as the product behaves. The only block that can
write multiple rows is the Table block's `Batch Insert Rows`, and it hasn't run.
You're not faking emptiness; you're honestly depicting a table before its writer
fires.

## The camera

```ts
CAM_TABLE = { px: CENTER_X, py: tableCenter().y, s: 0.86 }
```

`px, py` is the stage point that lands in the center of frame; `s` is the zoom.
Here it's centered on the table at **0.86×**.

> *"Why 0.86 and not 1.0?"* The set piece is large — a 2020-px-wide table over a
> 2684-px-wide chain on a 2960×1640 stage. At 1.0 the table alone would overflow
> a 1920-wide viewport. 0.86 frames the table as the hero — bigger than the
> video's home framing (`CAM_ALL` is `0.62`) — while still fitting. The gap
> between **0.86** here and **0.62** next scene is deliberate: scene 2 *eases
> out* from 0.86 to 0.62, and that pull-back is what makes the machine feel like
> it's *growing in underneath* the board rather than just appearing. So the
> scene-1 zoom isn't arbitrary — it's the first half of a camera move that
> completes in scene 2.

## The values, and where they come from

| column | source | shown in scene 1? |
|---|---|---|
| `company` | header from `OUTBOUND_COLUMNS` | header only |
| `contact` | header | header only |
| `title` | header | header only |
| `signal` | header | header only |
| `message` | header | header only |
| `status` | header | header only |

Every column *name* is authored in `OUTBOUND_COLUMNS` (`data.ts`). No cell value
appears, because no row has landed. The lead content (`Acme Robotics`,
`Priya Nair`, the six openers) all lives in `LEADS` in `data.ts`, but it is
declared demo stand-in for the run artifact (like swe-fleet's PR numbers) and is
**not** referenced until the write-back. In scene 1 the table is a schema with no
data — which is precisely the "campaign that doesn't exist yet."

## The animation, beat by beat

Two helpers do the timing. `ramp(t, t0, t1, easing)` goes 0→1 as the clock `t`
(seconds) crosses `t0`→`t1`, clamped outside. `pulseWindow`-style min-of-two-ramps
goes up, holds, comes back down. That's the whole vocabulary.

### (a) The pane fades in — `tableIn = ramp(t, 0.3, 1.0, EASING.out)`

The table's frame and row-number gutter come up over **0.3s → 1.0s**.

> *"Why start at 0.3 instead of 0.0?"* A short beat of empty frame before
> anything appears reads as a deliberate open. Starting at 0.0 makes the first
> frame feel like the render was already mid-load.
>
> *"Why ~0.7 seconds, why not snappier?"* This is the establishing shot; it gets
> a calm entrance. Later scenes, where things are happening, move faster. Pace is
> a signal — a slow entrance says "settle in and look."
>
> *"Why `EASING.out` on a fade?"* A bare opacity ramp barely needs easing, but
> `EASING.out` lets it arrive softly (decelerating into full) rather than
> snapping to opaque, which reads a touch more composed. It costs nothing and the
> series uses `out` for every entrance, so it's consistent.

### (b) The header assembles left→right — `colIn(c) = ramp(t, 1.1 + c*0.22, 1.65 + c*0.22, EASING.out)`

Each of the six header cells reveals on its own 0.55-second ramp, and each starts
**0.22 seconds after the column to its left**. Column 0 (`company`) reveals over
1.1→1.65s; column 5 (`status`) over 1.1+5·0.22 = 2.2 → 2.75s. The whole header
lands between 1.1 and 2.75.

This is wired through `colOpacity={colIn}` on `SimTable` (`_rig.tsx` line 546),
which the table applies per column. Because the pane chrome already arrived in
step (a), what you see is the **header populating into an already-present
table** — the product's own "columns loading" feel.

> *"Where does 0.22 come from?"* It's chosen, not derived, but chosen against two
> constraints. Too small (say 0.08s) and the six columns arrive almost together,
> reading as one block — you can't feel that there are six distinct fields. Too
> large (say 0.5s) and the header takes three-plus seconds to fill, which is dead
> time before the scene's real gesture. 0.22s is fast enough to feel alive, slow
> enough that your eye walks the columns in turn — and it's slightly tighter than
> scene 7's column step (0.16s) because a header is just names, whereas the
> write-back cells carry content the eye has to read.
>
> *"Why left→right specifically?"* It's the reading direction and it's the
> dataflow direction: `company` is the first thing Apollo finds, `status` is the
> last thing the run writes. The header animates in the order the run will fill
> it, so the geography is taught before any data lands.

### (c) The whole empty pane gets selected, then releases — `paneSel = min(ramp(t, 4.0, 4.7, out), 1 - ramp(t, 6.2, 7.0, in))`

A single soft tint rises over **4.0→4.7s** (a ~0.7s fade-up, `EASING.out`),
holds, and releases over **6.2→7.0s** (`EASING.in`). It is drawn as one overlay
rectangle (`_rig.tsx` lines 554–568) spanning all six columns and all six rows of
pane: a `2px solid var(--selection)` border with an `rgba(37,99,235,0.06)` fill —
the product's exact range-selection treatment.

> *"Why an overlay rectangle and not the table's per-cell highlight?"* Because the
> rows haven't landed — they're invisible pane. There are no cells to highlight.
> The product's range selection, when you marquee-select an empty region, draws
> exactly this: a thin selection border with a faint blue wash over the region.
> So the honest way to say "this whole empty area is the campaign" is to draw the
> product's own empty-region selection over it. With no words, the picture says
> *this whole blank space is the job.*
>
> *"Why those four numbers — 4.0, 4.7, 6.2, 7.0?"* They're the pulse's shape: up
> between 4.0 and 4.7, hold from 4.7 to 6.2 (about 1.5s), down between 6.2 and
> 7.0. Long enough to register as a deliberate gesture, not a flicker.
>
> *"Why does it fire at 4.0 when the header finished at 2.75?"* Because the
> assembly and the selection are two different ideas, and overlapping them would
> blur both. Let the table fully arrive and settle (2.75), hold a beat of
> stillness, *then* make the one selection gesture. Stacking two animations into
> the same moment is the most common way a scene starts to feel busy and
> amateurish — give each idea its own air.

### (d) The hold — ~7.0s to the end (the scene runs to 12.8s after VO)

After the selection releases, nothing moves. The empty board rests.

> *"Isn't five-plus seconds of still frame dead air?"* Partly, yes — and the
> choreography notes flag it as the tail being dead, tolerable only because the
> frame is the thesis (the empty board is *the* image of the problem). There's
> also a structural reason it ends on a settled hold: this tail is where
> narration plays, and the scene must be able to **stretch** to fit however long
> the voiceover runs. A scene that ends on a static, latched state can be
> extended to any length safely, because there's no animation mid-flight to
> freeze. Every hold in this build is "latched-settle" for exactly this reason —
> see the choreography notes' closing lesson: latched holds are *safe* but not
> *alive*; if you have an ambient layer, this is where it would earn its keep.

## How to think about the whole scene

Walk the decisions and you can see a question driving each one:

1. *What's the object?* A table → use the real `SimTable`, fed `OUTBOUND_COLUMNS`.
2. *How do I show only the table?* Render the **one** set piece with the machine
   `hidden` and edges at `progress: 0` → continuity is free.
3. *How does a table arrive?* Pane first, then header column by column → you read
   six fields, not one blob, in dataflow order.
4. *How do I say "this whole blank is the job" without a caption?* The product's
   own empty-region range selection, as an overlay → product vocabulary, never
   words.
5. *Why is it empty?* Because `rowLand` is zero everywhere and rows are only
   *inserted* by the run → an honest planted question.
6. *How should it be framed?* Hero the table at 0.86 so scene 2 can pull back to
   0.62 and the machine grows in underneath.

There's no single clever move — it's restraint applied six times.

## Exit state (what scene 2 inherits)

`table assembled · zero rows (rowLand = 0 everywhere) · selection released by
7.0s · machine hidden · both outer edges at progress 0 · camera at CAM_TABLE
(0.86×)`. Scene 2 opens on exactly this frame and immediately begins easing the
camera from CAM_TABLE to CAM_ALL while the machine fades up underneath. Because
both scenes render the same `<Stage/>`, that boundary is identical down to the
pixel.
