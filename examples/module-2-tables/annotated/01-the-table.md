# Scene 1 — `the-table`  ·  archetype: **zoom-through → assemble**

Source: `../source/scenes/TheTableV2Scene.tsx`, `../source/scenes/_v2.tsx`,
`../source/layoutV2.ts`, `../source/dataV2.ts`.

The opener. It does one thing: put the `leads` table on screen as a concrete
object, with the `category` column **empty** and every `status` reading
`unprocessed`. That emptiness is the queue — the work waiting — and it's the
question the whole video answers.

---

## What this scene is for

The audience has watched the workflows and agents modules; they know blocks,
edges, runs. The table is the **new object**, so the video orients from the known
world (a workspace of tiles) into the new one (a table). This scene is the
hand-off: it starts on the module-1 workspace's `Table` tile and pushes *through*
it into the table itself.

The one idea: **here is the table** — typed columns over rows, holding real
records, with empty columns waiting. No workflow, no run.

## The zoom-through transition

The scene opens on the `Table` tile (the same `ObjectNode` from the workspace
world) alone at center, then the camera pushes into it and crossfades to the
table:

```ts
const tileIn   = ramp(t, 0.2, 0.8, EASING.out);
const push     = ramp(t, 2.0, 3.2, EASING.inOut);
const tileScale = 1 + push * 3.8;               // the tile scales up toward the lens
const tileOp    = tileIn * (1 - ramp(t, 2.4, 3.0)); // …and fades as we pass through it
const worldIn   = ramp(t, 2.6, 3.4, EASING.out);    // the table world fades up underneath
```

The tile scales up and fades out while the table world fades in beneath it — a
push *through* the object, not a cut to a new one. The crossfade windows overlap
(tile fading 2.4→3.0, world rising 2.6→3.4) so there's never a black frame
between them.

> *"Why zoom through the tile instead of just cutting to the table?"* Because the
> tile *is* the table — the same object at two zoom levels. The push says "the
> thing you knew as a workspace tile, opened up, is this." A hard cut would read
> as two unrelated objects. The continuity of the object across the transition is
> the teaching: the table isn't new to the workspace, it's a tile you've zoomed
> into.

## The assemble — chrome first, then values

Once inside, the table assembles the way the product loads — grid and headers
first, then values row by row:

```ts
const rowTextReveal = (r) => ramp(t, 3.7 + 0.3*r, 4.2 + 0.3*r, EASING.out);
```

The `tableIn` (grid + column headers + type icons) comes up with `worldIn`; then
each row's *values* reveal on its own ramp, `0.3s` after the row above. You read
five distinct records populating into an already-present table.

> *"Why is the category column empty and the status all `unprocessed`?"* Because
> nothing has run yet — and a table can only show what a run produced. The empty
> `category` and the uniform `unprocessed` aren't styled blank; they're the
> authored starting state (`writeMix` is 0, so the cell-content function returns
> `""` for category and `STATUS_BEFORE` for status). This is the **queue**: rows
> that haven't been processed. Keep this honesty — never fill a cell the run
> hasn't written, here or anywhere.

## The set piece, established here

This scene renders the same `<Stage/>` every other scene does, with
`chainOn={false}` (the workflow isn't introduced yet) and the table-centered
camera (`CAM_TABLE`, `s=1.18`). The geometry it lays down — table in the upper
half, table centered and slightly enlarged — is the geometry every scene inherits.
Scenes 1–2 sit at this framing; scene 3 eases the camera out to reveal the chain
below. Establishing the one set piece here is what makes every later boundary free.

> *"Why frame the table at 1.18× rather than neutral?"* The table is the hero of
> the opening, so it's framed a touch large. Neutral (`s=1`, the framing once the
> whole stage is shown) comes in scene 3 when the camera eases out and the
> workflow grows in below. The 1.18 here is the first half of a camera move that
> completes two scenes later — the desk growing around the board, in this
> module's vocabulary.

## Exit state (what scene 2 inherits)

`camera at CAM_TABLE (1.18×) · chain hidden · full table, no selections ·
category empty, status all unprocessed`. Scene 2 opens on exactly this and begins
the selection grammar (highlighting a record, then a field) over the identical
frame.
