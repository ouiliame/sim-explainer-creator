# Scene 5 — `the-write`  ·  archetype: **the same run completes (cell-fill write-back)**

Source: `../source/scenes/TheWriteScene.tsx`, `../source/scenes/_v2.tsx`,
`../source/layoutV2.ts`, `../source/dataV2.ts`.

This is the payoff scene — the **write-back**. The agent's result lands back in
the table's empty cells, and the table itself changes. It is the second half of
the freeze-cut run begun in `the-read`, and it carries the single most
imitation-worthy move in the module: **filling cells in the real surface**, never
floating a result chip on top. Study it closely.

---

## What this scene is for

The read selected rows and handed them to the agent. This scene completes the
loop: the agent's output is **written back** into the same table, into the
`category` cells that were empty and the `status` cells that read `unprocessed`.
When it's done, the table is changed — and that change is the only proof the
workflow did anything.

The one idea is **results land back in cells**. The processing itself (what the
agent decided) is not re-shown here — it already resolved as `<table.rows>` last
scene and will be inspected in the record panel next scene. This scene is purely:
the update block goes live, the cells fill, the table keeps its new state.

## Opening inside the held moment

The scene opens on scene 4's exit frame — the freeze — and the first thing it
does is *hold*, then release:

```ts
const classifyLive = t < 1.7;            // the held ring sits a beat, then lets go
const readFade   = 1 - ramp(t, 1.5, 2.1); // the read range releases
const pulse2     = ramp(t, 1.6, 2.25, EASING.inOut); // light crosses edge 2
```

For the first ~1.5s the agent ring stays lit (the held state from the cut),
reading as "still working." Then it releases, the read range fades, and a pulse
crosses the second edge into the Update block. The run is moving from "the agent
finished" to "the result is being written."

> *"Why hold the ring for 1.7s at the top instead of moving immediately?"* Two
> reasons. First, the freeze-cut: the previous scene ended on this exact live
> state, so the new scene must open on it and *can't* jump straight into the
> write or the boundary would tear. Second, the hold reads as the agent doing
> work — a beat of "thinking" before the answer appears. Cutting it shorter would
> make the write feel like it happened before the agent finished.

## The cell-fill write-back — the move to steal

The result appears **inside the table cells**, through two coordinated controls.

First, the cell *content* is a pure function of a per-row write progress
`writeMix(row): 0→1`, evaluated in the `Stage`:

```ts
// _v2.tsx — the table's cell text is computed from writeMix
{text: mix < 0.5 ? "" : lead.category}              // category: empty until the midpoint
{text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER}    // status: unprocessed → qualified
```

Second, the text *opacity* runs a **DipSwap** so the value doesn't hard-cut in:

```ts
const dip = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
// opacity dips to 0 as mix approaches 0.5, the text swaps at 0.5, opacity rises back
```

So in each cell you see the old content (empty, or `unprocessed`) **fade down**,
the new value **swap in** at the midpoint, and **fade up** in its place. It reads
as a write — content being replaced — not a teleport.

The scene drives `writeMix` per row, staggered top to bottom:

```ts
const writeMix = (r) => ramp(t, 2.5 + 0.22*r, 3.0 + 0.22*r); // each row 0.22s after the last
```

> *"Why fill cells instead of flying the result in as a card or chip?"* Because
> an earlier cut did exactly that — little output chips ("billing", "high",
> "done") rode a connector line out of the agent into the table — and it was
> rejected outright: *"these look disgusting."* Outputs must appear **only in
> real surfaces**. A result that matters lands *in the cell it belongs to*, drawn
> by the real grid, tinted by the real selection/tint treatment. The chip was a
> graphic floated over the product; the cell-fill is the product changing. This
> is the single most load-bearing correction in the module — never float an
> output.
>
> *"Why the DipSwap rather than just fading the new value up over the empty
> cell?"* For the `status` column especially: the cell isn't empty, it already
> reads `unprocessed`. You can't fade a value into an occupied cell without a
> moment where two strings overlap. The dip — fade the old out, swap at the
> bottom of the dip, fade the new in — is how you replace text in place cleanly.
> For the empty `category` cells the dip from a blank start is invisible, so the
> same mechanism handles both columns uniformly.

## The written range lights in sync — the same cause→effect move as the read

As the Update block goes live, the written cells light **as one selection range**,
in sync, exactly mirroring the read:

```ts
const updateLive = t >= 2.15 && t < 5.4;
const writeHi = (r) => pulseWindow(t, 2.3 + 0.14*r, 2.65 + 0.14*r, 5.7, 6.4);
const writtenHi = writeRangeHi(writeHi); // only the category + status columns, all rows
```

`writeRangeHi` (in `_v2.tsx`) restricts the highlight to the two written columns
across every row, so `SimTable` draws **one outline** around the written region —
the same "one range = one operation" grammar the read used. The Update block's
ring leads; the range follows; no connector line. The read and the write are
visually the same gesture in mirror image: read lights a range and pulls it into
a reference; write lights a range and pushes values into it.

> *"Why only the `category` and `status` columns, not the whole rows?"* Because
> those are the only cells the Update block writes (`Set category, status =
> 'qualified'`). Lighting the `company`/`industry` cells too would claim the
> write touched them, which is false. The lit range is exactly the write's scope —
> the picture is an honest depiction of what `Update Rows` does.

## The green output residue — `cellTint`, never an overlay

The blue selection range above is the *live* treatment — it marks the write while
it's happening, then releases. What the cell is left wearing afterward is the
green **output tint**, carried by `SimTable`'s `cellTint`:

```ts
// SimTable: the output tint is a product-grade low-alpha cell background
const TINT_BG = { output: "rgba(51,196,130,0.08)" /* green */, input: "rgba(51,180,255,0.07)" /* blue */ };
```

The tint is a property of the **cell**, not a rectangle floated on top — applied
as the cell's `backgroundColor`, the same way the product washes a cell. The
craft is letting the green **decay to residue**: strong as the value lands, then
settling to a faint, persistent wash that says "the workflow touched this" without
competing for attention once the run is over.

> *"Why a cell tint instead of an overlay div with a green glow?"* Because an
> overlay is a graphic *on* the product; a `cellTint` is the product's own cell
> background changing — exactly how Sim itself marks an output cell. It scales,
> scrolls, and clips with the cell because it *is* the cell. The same reason the
> output chip was rejected applies: the signal has to live in the real surface.

## Releasing the run — but keeping the values

When the write finishes, *everything about the run* releases — and one thing
doesn't:

```ts
const updateOk   = t >= 5.4 && t < 6.6;        // Update settles green/ok
// writeHi's down-window (5.7→6.4) releases the lit range
const tagResolve = 1 - ramp(t, 6.2, 6.6);      // <table.rows> reverts to template
const tagGlow    = 1 - ramp(t, 6.2, 6.6);
```

The Update block settles to `ok`, the lit range fades, the resolved tag reverts
to its `<table.rows>` template, the rings go out. The chain returns to idle. But
`writeMix` stays at 1 — **the table keeps its new cell values for the rest of the
video.**

> *"Why release the run but persist the values? Isn't that inconsistent?"* No —
> it's the most important state distinction in the piece. The *run* is transient:
> rings, ranges, pulses, resolved references all belong to "a run is happening"
> and must clear when it ends, or the next scene would look like it's still
> running. The *result* is permanent: a write to a table doesn't un-happen when
> the workflow finishes. Persisting the values is what makes the table the
> **record** — and it's the entire setup for the run-twice no-op in scene 7,
> which only works because these values survived. The released run + persisted
> values is the exit contract; verify the boundary on it.

## The animation, beat by beat

1. **0→1.7s** — held: Classify ring still on (the freeze from scene 4), then off.
2. **1.5→2.1s** — the read range releases.
3. **1.6→2.25s** — pulse crosses edge 2 (Classify → Update).
4. **2.15s** — Update goes live.
5. **2.3→~3.5s** — written range lights, one row at a time (`0.14s` stagger).
6. **2.5→~4.1s** — values dip-swap into the cells (`0.22s` stagger), category
   filled, status flipped to `qualified`.
7. **5.4→6.6s** — Update settles `ok`; range, rings, tag all release.
8. **end** — chain idle, **table filled and holding its new values.**

## Exit state (what scene 6 inherits)

`camera identity · chain idle (no rings, edges drawn, tag reverted to template) ·
no selection · table FILLED — category written, status = qualified, every row`.
Scene 6 opens on this and dims the world to raise the record panel; scene 7 opens
on it and re-fires the query against this filled table. The filled table is the
one thing that persists from here to the end.
