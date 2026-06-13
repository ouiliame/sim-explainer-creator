# Scene 7 — `the-write-back`  ·  archetype: **THE MONEY SHOT**

Source: `../source/scenes/TheWriteBackScene.tsx`, `../source/data.ts`
(`outboundRows`, `LANDED_ORDER`, `LEADS`), `../source/layout.ts`,
`../source/scenes/_rig.tsx`.

This is the payoff the whole video has been building toward, and the one beat that
makes this take (hype-3) different from its predecessor: the write-back is now
**mechanical**. The run's last block — `Table · Batch Insert Rows ·
<parallel.results>` — fires, and six record rows *land* in the empty table, each a
left→right cell sweep ending in a `sent` status. The empty board from scene 1
becomes a sent campaign, and every cell that fills is a write the workflow actually
performs. It teaches the **row-land cell-sweep + residue-trail** grammar — the
build's richest motion, and the one most worth stealing.

---

## What this scene is for

One idea: **the run writes its own record.** A pulse exits the container, the
Table block takes the live ring, its `<parallel.results>` reference glows (that's
the data being consumed), and then the table fills — six rows insert
top-to-bottom in result order, each row's chrome fading in and its cells sweeping
left to right (company, contact, title, signal, the *different* two-line opener,
then `sent`), each cell flashing green and decaying to a residue. The message
column becomes six distinct openers; the status column becomes a wall of `sent`.

The reason this is *the* shot: it's the moment the abstract ("a workflow that
fills a table") becomes concrete and literal — you watch the table fill, cell by
cell, caused by a block. The empty pane you've been staring at since scene 1 fills
in front of you.

## What it looks like

A bright pulse leaves the container along edge 2 toward the Table block; the wire
heats. The Table block takes a live ring and its `Rows | <parallel.results>`
reference glows and *stays* glowing — the reference is being consumed for the whole
write. Then the rows land, one every 1.25 seconds, top to bottom. For each row:
its chrome (gridlines, row number) fades in, then its six cells fill left to right,
one every 0.16s — `company`, `contact`, `title`, `signal`, then the wide
`message` cell with a distinct two-line opener, then `status` dipping in `sent`.
As each cell fills it flashes green and the green decays away — except the status
column, where a faint green residue *stays*. Mid-cascade, with some rows full and
some still filling, is the money frame. When the last row lands, the Table block
settles green.

## The real decisions

### The rows land in *result* order, not query order — `LANDED_ORDER`

```ts
const START   = 2.0;
const STAGGER = 1.25;
const rowAt = (r) => START + r * STAGGER;   // row r lands at 2.0 + r*1.25
```

Row 0 lands at 2.0s, row 1 at 3.25s, … row 5 at 8.25s. But "row 0" doesn't mean
"the first lead Apollo found." In `data.ts`, `outboundRows` maps over
`LANDED_ORDER = [2, 4, 0, 5, 1, 3]`, so the table's row 0 holds `LEADS[2]`
(Northwind), row 1 holds `LEADS[4]` (Veraxis), and so on. The insert order is the
**scramble completion order from scene 6**, because `Batch Insert Rows` writes
`<parallel.results>`, and a parallel's results come back in completion order, not
query order.

> *"Why bother — wouldn't query order be simpler?"* Because it would be a lie about
> how the product works, and the lie would contradict scene 6. The whole point of
> scene 6 was "result order isn't guaranteed." If the table then filled in Apollo's
> original query order, you'd be silently asserting the opposite. By inserting in
> `LANDED_ORDER` — the exact scramble order scene 6 drew — the write-back is
> consistent with the resolution you just watched, and Northwind (the lane you
> followed, which finished first) is correctly the first row to land. The narrative
> thread, the scramble, and the insert order all agree because they all read from
> the same `LANDED_ORDER`.

### A row that hasn't landed is invisible pane — `rowLand` gates chrome

```ts
const rowLand = (r) => ramp(t, rowAt(r), rowAt(r) + 0.4, EASING.out);
```

`rowLand(r)` ramps a row's chrome opacity from 0 to 1 over 0.4s starting at its
land time. In `_rig.tsx`, `rowOpacity={landAt}` (which is `rowLand`) gates the
*whole row's* gridlines and row number. So before a row's land time, that row is
not "an empty row" — it's invisible pane, exactly as in scene 1. The rows
genuinely *insert*: the row chrome appears (the gridlines draw in) and only then do
its cells fill. This is what makes it read as `Batch Insert Rows` rather than
"text fading into pre-drawn empty rows." The product inserts rows into a pane; so
does this.

### Within a row, cells sweep left→right — `cellAt` + the 0.16s column step

```ts
const COL_STEP = 0.16;
const cellAt = (c, r) => rowAt(r) + 0.15 + c * COL_STEP;
const cellFill = (c, r) => ramp(t, cellAt(c, r), cellAt(c, r) + 0.35, EASING.out);
```

Each cell starts filling 0.15s after its row's chrome, then steps 0.16s per
column. Each cell's fill ramps over 0.35s. So within a row, the cells light up
left to right: company, contact, title, signal, message, status. And the *text*
appears at the second half of the fill — in `_rig.tsx`, `cellTextOpacity` is
`textOp(c,r) = interpolate(fillAt, [0.5, 1], [0, 1])`, so text dips in once the
cell is at least half filled. That's the "type-on / dip-in" feel: the cell
background fills, then the value appears in it.

> *"Why sweep left→right within a row instead of filling the whole row at once?"*
> The left→right sweep mirrors the dataflow geography established in scene 1's
> header (company is the first field, status is the last) and tells a tiny story
> per row: this lead's company, then who the contact is, their title, the signal
> you're reaching out about, the opener you wrote them, and finally — sent. The
> status lands *last*, which is correct: `sent` is the outcome, the last thing that
> becomes true about the row. Filling the row all at once would lose that little
> per-row narrative and the satisfying "…and it's sent" beat at the end of each
> sweep.
>
> *"Why 1.25s between rows but only 0.16s between cells?"* Two grains again. The
> 1.25s row stagger is slow enough that each row reads as a distinct record
> landing — you see six leads, not a blur. The 0.16s cell step is fast enough that
> a row's sweep feels like one fluid fill, not six separate events. Row = a record
> (slow, countable); cell = a field within the record (fast, fluid). The cell step
> (0.16s) is also slightly tighter than scene 1's header stagger (0.22s) because
> here the rows are already landing in a cascade — you don't want the within-row
> sweep competing for attention with the row-to-row rhythm.

### The residue trail — green flashes, decays to a status-only "sent wall"

```ts
const PEAK = 0.7;
const residueOf = (c) => (c === STATUS_COL ? 0.12 : 0);
const cellTint = (c, r) => {
  const up   = ramp(t, cellAt(c, r), cellAt(c, r) + 0.35);   // tracks the fill
  const down = ramp(t, rowAt(r) + 1.6, rowAt(r) + 2.8);      // decay window
  return up * (PEAK - (PEAK - residueOf(c)) * down);
};
```

As each cell fills, a green tint peaks at **0.7** (the product's write-output
tint, `rgba(51,196,130, …)` in `_rig.tsx`), then decays over the row's 1.6→2.8s
window. The decay target is `residueOf(c)`: **0 for every column except status,
which keeps 0.12.** So the green flash washes across the whole row as it writes,
then drains away — leaving a faint permanent green only on the status column.

> *"Why does the green decay at all — why not just leave the cells tinted?"* A
> permanent green wash over every written cell would be loud and would fight the
> text for legibility. The decay says "this cell was just written" as a transient
> event, then returns the cell to neutral so you can read its value. The *flash* is
> the write; the *neutral* is the settled record. This is how the product's own
> output-tint behaves — it's a momentary highlight, not a permanent fill.
>
> *"Then why keep a residue on status — why that column specifically?"* The status
> column is the run's **provenance**. Every other column (company, contact, title,
> signal, message) is content that could in principle have been typed; the `sent`
> status is the thing only the *run* could produce — it's the proof the workflow
> actually sent these leads. Leaving a faint 0.12 green only there builds, over six
> rows, a "sent wall" — a single column of persistent green that reads as "this
> whole campaign was sent by the run." It's the one permanent color in the final
> frame, and it's the color of the run's own output. That residue persists all the
> way to the last frame of the video (scene 8 hard-sets `finalTint(c) = c ===
> STATUS_COL ? 0.12 : 0`).

### The reference glows for the *whole* write — `wbTagGlow`

```ts
const wbTagGlow = 0.9 * Math.min(ramp(t, 1.5, 2.1), 1 - ramp(t, 10.6, 11.4));
```

The Table block's `Rows | <parallel.results>` tag glows from 1.5s (just after the
block goes live at 1.4) and holds glowing until 10.6→11.4, i.e. through the entire
row cascade. Unlike the brief reference glows in scenes 3–5 (which fired and
released as a "look here"), this one *burns for the whole write* — because the
reference is being **consumed continuously** as the block reads every lane's result
out of `<parallel.results>` and inserts it. The glow's duration matches the work's
duration: the reference is live as long as rows are landing.

### The writer settles only after the last cell and the last tint

```ts
const wbOk = t >= 11.6;
```

The Table block flips to green at 11.6s — and that's chosen to be *after*
everything finishes. The last cell fills around `cellAt(5,5) + 0.35` ≈ 8.25 + 0.15
+ 5·0.16 + 0.35 ≈ 9.55s, and the last row's tint decay ends at `rowAt(5) + 2.8` =
11.05s. The writer settles green at 11.6, comfortably after both. The block
doesn't declare "done" until the work it's doing has actually visibly completed —
the green is earned, not early.

## The values, and where they come from

Every cell that fills traces to `LEADS` in `data.ts`, in `LANDED_ORDER`:

| table row | lead (LANDED_ORDER) | company · contact · title · signal · status |
|---|---|---|
| 0 | LEADS[2] Northwind | Northwind · Priya Nair · CTO · Migrated to Postgres · sent |
| 1 | LEADS[4] Veraxis | Veraxis · Lena Voss · Founder · SOC 2 in progress · sent |
| 2 | LEADS[0] Acme Robotics | Acme Robotics · Dana Liu · VP Engineering · Series B · 3 wks ago · sent |
| 3 | LEADS[5] Drift Labs | Drift Labs · Theo Park · Head of Sales · Opened a new region · sent |
| 4 | LEADS[1] Brightwave | Brightwave · Marcus Reed · Head of Growth · Hiring 4 AEs · sent |
| 5 | LEADS[3] Cobalt Health | Cobalt Health · Sam Okafor · VP Product · Launched mobile app · sent |

The `message` column holds six **distinct** two-line openers (the
"different-copy-per-row" behavior of an agent run once per lead) — e.g. Northwind's
"Noticed the Postgres move, Priya — most CTOs hit replication pain at your size…".
These are authored demo stand-ins for the real run output (declared `⟨pending⟩` in
the script — the real agent strings aren't shown). The status is `STATUS_SENT =
"sent"` for every row. The point of six *different* openers is to make the message
column visibly varied, which is the visual signature of "an agent personalized
each one" rather than "a template filled in."

## The animation, beat by beat

- **Trigger:** `pulse2 = ramp(0.5, 1.5, inOut)` exits the container along edge 2;
  edge 2 heats `ramp(0.7, 1.3) * (1 - ramp(11.0, 11.6))` (heats for the write,
  cools at the end); Table block live at 1.4.
- **Reference glow:** `wbTagGlow = 0.9 * min(ramp(1.5, 2.1), 1 - ramp(10.6, 11.4))`
  — burns for the whole write.
- **Row cascade:** row `r` lands at `2.0 + r*1.25`, in `LANDED_ORDER`. Per row:
  chrome fades `ramp(rowAt, rowAt+0.4, out)`; cells sweep `cellAt(c,r) = rowAt +
  0.15 + c*0.16`, each filling over 0.35s; text dips in at fill ≥ 0.5.
- **Residue trail:** per cell, green peaks 0.7 as it fills, decays over `rowAt+1.6
  → rowAt+2.8` to 0 everywhere except status's 0.12 (the sent wall).
- **Settle:** Table block `ok` at 11.6, after the last cell (~9.55) and the last
  tint decay (~11.05).
- **Hold:** `11.6 → 23.6` local on the full table + green chain.

> *"Where's the money frame exactly?"* Mid-cascade — roughly 5–6s in, when the top
> rows are full and tinting down to residue while the bottom rows are still
> sweeping in with their green flashes. That's the frame where you can simultaneously
> see the finished record (top), the act of writing (middle), and the empty pane
> being consumed (bottom). That's the shot the whole video exists to deliver.

## How to think about the whole scene

1. *In what order do rows land?* `LANDED_ORDER` — the scramble/result order from
   scene 6 → consistent with "result order isn't guaranteed," Northwind first.
2. *How does a row insert?* Chrome fades in (gated by `rowLand`), then cells fill →
   it genuinely inserts, like `Batch Insert Rows`, not text into pre-drawn rows.
3. *How does a cell fill?* Background ramps, text dips in at half-fill, left→right
   per row → per-row dataflow story ending in `sent`.
4. *Two grains of timing?* 1.25s rows (records, countable) × 0.16s cells (fields,
   fluid) → six leads, each a smooth sweep.
5. *What's the permanent color?* A 0.12 green residue on status only → the "sent
   wall," the run's provenance, the one color that survives to the final frame.
6. *Why does the reference burn the whole time?* Because `<parallel.results>` is
   consumed continuously → glow duration = work duration.

## Exit state (what scene 8 inherits)

`all six rows landed (rowLand = 1) · all cell text shown · green residue (0.12) on
the status column, zero elsewhere · Table block green (`ok`) · whole chain green ·
table full · camera at CAM_ALL`. Scene 8 opens on this exact full-table frame and
eases the camera back ~5% to CAM_OUT for the outro — every landed value and the
status residue persist unchanged to the final frame.
