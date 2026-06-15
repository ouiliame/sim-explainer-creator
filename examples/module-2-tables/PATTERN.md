# PATTERN — the table as queue + record (cell-fill write-back)

The distinctive move of the Tables module, in one page. If you only read one
file in this pack, read this one — then go to the scene annotations for how each
piece is built frame by frame.

---

## The move

A **table** is on screen as a concrete object: typed columns over rows, holding
real records. A **workflow** runs against it and does three things, in order:

1. **Reads** rows out of the table (a query selects a range of rows).
2. **Processes** them (an agent classifies, enriches, scores — whatever).
3. **Writes the result back** into the same table's cells (an update fills the
   empty columns and flips a status).

The whole point — the thesis the video is built to land — is the docs line said
verbatim at the close:

> *"the table serves as both the queue the workflow pulls from and the record of
> what it has already done."*

So the table is doing double duty. It is the **queue** (the work waiting — rows
the workflow hasn't touched yet, marked by an empty column and a `status` of
`unprocessed`). And after the run it is the **record** (the same table, now
holding the results, with `status` flipped to `qualified`). One object, two
roles, and the run is the hinge between them.

## Why it's the strongest teaching shape in the set

Because it makes a database operation **mechanical and visible** without a single
word of explanation. You watch rows get selected, watch a reference resolve to
those exact rows, watch values drop into the cells that were empty. The table
*changing* is the proof that the workflow did something — and because a real
table only changes when something writes to it, the animation is honest about
how the product actually works.

It also gives you a free, devastating final beat: **run the same query twice.**
The first run lights up five rows. The second run lights up nothing — because the
first run flipped every `status` to `qualified`, and the filter reads
`status = 'unprocessed'`. The empty result is the entire thesis collapsed into
one shot: the table *remembers*, so the workflow never redoes finished work.

---

## How it's built

### One set piece, camera-only differences

There is exactly **one** stage (`_v2.tsx`'s `<Stage/>`), owned by `layoutV2.ts`:
the `leads` table in the upper half, the read→classify→write chain in the lower
half, at fixed geometry. Every scene renders the whole stage and changes only
**state props + camera**. Scenes 1–2 frame the table centered (`CAM_TABLE`,
`s=1.18`); scene 3 eases the camera to identity so the chain is revealed below;
scene 7 eases back to `0.93` for the final balanced hold. Nothing ever relayouts.
Continuity is a property of the construction, not something you check after.

### The table is the real product grid — never a hand-built div

The surface is `SimTable` — a verbatim static port of Sim's Tables grid (native
metrics ×2, real class strings, real selection treatment). You never *design* a
table; you configure the one that exists. Cell contents are a pure function of
state, so the table can only show what the run has produced.

### Cell-fill write-back: values land *in cells*, never as floating chips

This is the part that cost a rejection. An earlier cut (the legacy
`WriteBackScene`) flew little output **chips** ("billing", "high", "done") out of
the agent on a connector line into the table. It was scrapped — *"these look
disgusting"* (case 18). **Outputs only ever appear in real surfaces.** The fix:
the written values appear **inside the table cells themselves**, via a per-row
`writeMix(row): 0→1` that the `Stage` turns into cell content:

```ts
// _v2.tsx — cell text is a function of the write progress
{text: mix < 0.5 ? "" : lead.category}     // category: empty → value at the midpoint
{text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER}  // status: unprocessed → qualified
```

and a **DipSwap** on the text opacity so the swap isn't a hard cut:

```ts
const dip = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
// text fades out toward mix=0.5, the value swaps in at 0.5, fades back up
```

So you see the cell's old content dim away and the new value rise in its place —
a write, not a teleport.

### The green output tint, and how it decays to residue

The cell **background** carries the "this was just written" signal, through
`SimTable`'s `cellTint(col,row): "input" | "output" | null` — **never an overlay
div**. The tints are product-grade, low-alpha washes:

```ts
const TINT_BG = {
  input:  "rgba(51,180,255,0.07)",   // blue — fed into the workflow
  output: "rgba(51,196,130,0.08)",   // green — written back by the workflow
};
```

The green `output` tint is how a freshly-written cell reads as *output*. The
craft is in letting it **decay to residue**: the tint comes up strong as the
value lands, then settles to a faint, persistent wash — the cell stays subtly
green to mark "the workflow touched this," but it's quiet enough not to compete
once the run is over. (In the v2 run cut the *live* range uses the blue
`cellHighlight` selection range while the run is in flight, then releases; the
green `output` residue is the tint that's left to say "written." Either way the
rule holds: the signal is a `cellTint`/selection treatment on the real cell, not
a colored rectangle floated on top.)

### The cause→effect offset (synchrony, never connector lines)

When the query reads, the block's **live ring comes on** and *in sync* the rows
**light as one selection range** in the table above — but there is **no connector
line** drawn between block and table. The teaching is carried by **synchrony**:
two things happen on the same frame, so your eye binds them as cause and effect.
Same on the write: the Update block goes live and *in sync* the written range
lights while values dip in. The offset is deliberate and small — the ring leads
by a beat, the range follows — so it reads as "the block did this," not "these
animated together by coincidence."

The reference resolution reinforces it: Classify's `Messages` row holds
`<table.rows>`, which **glows** with the lit range, then **resolves** to
`[5 rows]` — pointing at the very rows lit above. The full value lives in the
table; the resolved tag is the truncated stand-in (module-5's truncation rule).

### The range outline (one record, one field)

Feeding `SimTable` the *same* highlight value across a contiguous run of cells
makes it draw the product's **single selection outline** around the whole run —
because `SimTable` suppresses the borders that face another highlighted cell. So
a whole row lit = one outline = "a row is one record"; a whole column lit = one
outline = "a field is one column." This is how the video says "record" and
"field" with zero captions.

### The run-twice no-op

The bookend (scene 7) re-fires the query. The `status` column header **glints**
(the filter reading it), and **no range lights** — every row already reads
`qualified`, so the `status = 'unprocessed'` filter matches nothing. The contrast
with the lit range of the first run is the whole lesson, and it only lands
because the first run's write **persisted**: the table kept its new values across
every subsequent scene (the one thing that survives the run's release).

---

## When to use it

Reach for this shape whenever the topic is **a system that processes a
collection and accumulates state** — a queue worker, a batch job, an enrichment
pipeline, a moderation pass, anything that reads items, does work, and records
the outcome back onto the items. The table is the ideal stage for it because the
table is *simultaneously* the input and the ledger, so a single object carries
the entire story.

Don't reach for it when the work is a one-shot transform (one input → one output,
nothing accumulates) — there's no queue and no record, so the double-duty framing
is a lie. That case wants a plain chain, not a table.

---

## The transferable rule

> **Make the data object the protagonist, and let state changes to it be the only
> proof of work.** Read by lighting a range; process off-screen or in a block;
> write by filling the cells that were empty — in the real surface, via the
> product's own tint/selection treatment, never a floated chip or overlay. Bind
> cause to effect with synchrony, not connector lines. Then run it a second time
> and show it do nothing: a no-op is the cleanest possible proof that the object
> remembers.
