# Scene 6 — `the-record`  ·  archetype: **record-panel**

Source: `../source/scenes/TheRecordScene.tsx`, `../source/scenes/_v2.tsx`,
`../source/layoutV2.ts`, `../source/dataV2.ts`.

The inspection beat. The run is done; this scene shows that **every read and
write left a record** by raising the run inspector over the dimmed world. It's the
"record" half of "queue and record" made literal — and it sets up the final no-op
by reminding the viewer what the run actually did before scene 7 shows it doing
nothing.

---

## What this scene is for

Scene 5 changed the table; this scene shows the **trace** of that change. The run
inspector rises with the actual query record — the three blocks' durations and
the output tree of what `Query Rows` returned. The point is that the table isn't
just magically different; there's an auditable record of the read and the write.

The one idea: **every read and write leaves a record.** Not a new operation — an
inspection of the one that already happened.

## Dim the world, raise the panel

```ts
const dim     = pulseWindow(t, 0.4, 1.1, 7.5, 8.3); // world dims to 0.35, holds, undims
const panelOp = pulseWindow(t, 0.9, 1.7, 7.4, 8.1); // inspector rises, holds, leaves
const panelY  = RECORD_Y + (1 - ramp(t, 0.9, 1.7, EASING.out)) * 30; // slides up as it enters
```

The whole stage (table + chain) dims toward 0.35 via the `Stage`'s `dim` prop,
and the `OutputBundle` inspector rises into the cleared space, sliding up 30px as
it fades in. At the end both reverse — panel leaves, world undims — so the scene
exits on the same lit, filled stage it entered on.

> *"Why dim the world instead of cutting to a full-screen panel?"* Because the
> table is the protagonist and must stay present — the record is *about* the table
> that's still right there behind it. Dimming to 0.35 (not 0) keeps the context
> visible while pushing focus to the panel, and lets the panel leave back to the
> exact same stage. A hard cut to a panel and back would risk two boundary jumps;
> dimming the one set piece has no boundary at all.

## The record is grounded, not invented

The inspector shows the docs' authored Query Rows record, with one honest set of
substitutions noted in the script's grounding table:

```ts
logs: Table 84ms · Classify 12.2s · Table 111ms
output tree: rows (array, highlighted) → 0 → { id, company: "Acme Co", status: "unprocessed" }
             rowCount: 5
```

The `Table 84ms` and the output tree are the docs' authored bundle verbatim
(`company` adjusted to "Acme Co" to match the on-screen table; `totalCount`
dropped because the table visibly holds exactly 5 rows). The agent and second
table durations (`12.2s`, `111ms`) are borrowed from a real run of the same block
types — a sanctioned stand-in, swappable if the roundtrip is ever run live.

> *"Why does the output show `status: "unprocessed"` when the table now reads
> `qualified`?"* Because this is the record of the **read** — the Query Rows
> output, captured at the moment the workflow pulled the rows, *before* the write.
> At read time those rows were unprocessed. Showing the pre-write value is correct
> and is itself a small teaching: the record is a snapshot of what the read saw,
> not the current table. It quietly reinforces that the write came after.

## The `rows` node gets the highlight

```ts
const rowsHi = pulseWindow(t, 2.9, 3.5, 6.6, 7.2); // the `rows` array node glows
```

Within the output tree, the `rows` array node is the one highlighted — these are
the rows the workflow read, the same rows that lit as the range in scene 4. The
highlight ties the inspector's `rows` back to the lit selection two scenes earlier:
the record of *what the query returned* is the same five rows you watched it
select.

## The set piece

Same `<Stage/>` at identity, `writeMix={() => 1}` so the table behind the dim is
**filled** (the values scene 5 wrote persist), with the chain idle. The inspector
is the only thing layered on top, and it's fully gone by the scene's end. So this
scene neither introduces nor removes any persistent state — it's a transient
overlay over the same filled, idle stage that scenes 5 and 7 share.

## Exit state (what scene 7 inherits)

`camera at identity · world undimmed · panel fully gone · chain idle · table
filled (category written, status all qualified)`. Identical to scene 5's exit and
scene 7's enter — the inspector came and went without changing the underlying
frame. Scene 7 opens on this filled table and re-fires the query against it.
