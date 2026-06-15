# Scene 2 — `rows-and-fields`  ·  archetype: **selection grammar**

Source: `../source/scenes/RowsAndFieldsScene.tsx`, `../source/scenes/_v2.tsx`,
`../source/layoutV2.ts`, `../source/dataV2.ts`.

A tiny scene that teaches the table's two axes — **a row is a record, a column is
a field** — using nothing but the product's own selection treatment. No captions,
no labels. It also establishes the visual grammar (one lit range = one thing)
that the read and the write will reuse as their core move.

---

## What this scene is for

Before the workflow touches the table, the viewer needs the two readings that
make the rest legible: a **row** is one record (the unit the query returns), and
a **column** is one field (the thing the write fills). This scene says both, in
sequence, with two selections.

The one idea: **the table's two axes** — record (row) then field (column). It's a
vocabulary beat; nothing changes in the data.

## Two selections, in sequence

```ts
const FOCUS_ROW = 1; // Bluefin
const rowHi = pulseWindow(t, 0.6, 1.0, 2.6, 3.1);  // a row selects, holds, releases
const colHi = pulseWindow(t, 3.7, 4.1, 5.8, 6.3);  // then a column selects, holds, releases

const cellHi = (c, r) => Math.max(
  r === FOCUS_ROW ? rowHi : 0,           // whole of row 1
  c === CATEGORY_COL ? colHi : 0,         // whole of the (empty) category column
);
```

First one row (Bluefin) takes a selection across all its cells — up over
0.6→1.0s, hold, release 2.6→3.1s. *Then*, after it's fully released, the empty
`category` column takes a selection — header ring plus its empty cells as one
range. Everything releases before the scene ends.

> *"Why strictly one at a time — row fully released before the column starts?"*
> Because they're two ideas (record, field), and overlapping them would blur both
> into "some cells are highlighted." Sequenced, each gets its own clean read: a
> horizontal selection that says *record*, then a vertical one that says *field*.
> Giving each idea its own air is the difference between a sentence and noise —
> the same restraint the run scenes use when they separate read from write.

## Why the selection draws as one outline (the grammar that powers the run)

Feeding `SimTable` the same highlight value across a contiguous run of cells makes
it draw a **single selection outline** around the whole run — it suppresses the
inner borders that face another highlighted cell. So all of row 1 lit = one
horizontal outline = "this row is one record." The whole `category` column lit =
one vertical outline = "this column is one field."

This is the exact mechanism the read (scene 4) and write (scene 5) lean on: light
a contiguous range with one value and the product draws one box around it. This
scene teaches the grammar in the small, so that when the query lights five rows as
one range, the viewer already reads it as "one result set," and when the update
lights two columns across five rows, they read it as "one written region."

> *"Why select the `category` column specifically, and why while it's empty?"*
> Because `category` is the column the workflow will *fill*. Selecting it empty
> says "this field is work waiting" — the same planted question as the queue. It
> points at the exact cells scene 5 writes into, so the write later lands somewhere
> the viewer has already been shown is waiting.

## The set piece

Same `<Stage/>`, `chainOn={false}`, same `CAM_TABLE` framing as scene 1 — only
`cellHi` differs. The scene changes *nothing* about layout or data; it's purely a
state-prop difference (which cells are highlighted) over the identical frame. That
is the whole continuity story for scenes 1→2→3: same geometry, camera and
highlights only.

## Exit state (what scene 3 inherits)

`camera at CAM_TABLE · chain hidden · all selections released · table unchanged`.
Identical to scene 1's exit except the selections have come and gone. Scene 3
opens on this and begins easing the camera out to reveal the workflow chain below.
