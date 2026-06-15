# Scene 4 — `the-read`  ·  archetype: **run, freeze-cut**

Source: `../source/scenes/TheReadScene.tsx`, `../source/scenes/_v2.tsx` (the
`Stage` set piece), `../source/layoutV2.ts`, `../source/dataV2.ts`.

This is the first half of the one run the whole video is built around. It is the
**read** — the moment a workflow reaches into the table and pulls rows out as
data. Read it as the canonical "a block acts on the table" scene; every choice
here is the one you'll reuse whenever a block has to be shown *doing something to*
a surface.

---

## What this scene is for

By now the table is on screen and the chain is assembled below it, idle. This
scene starts the run and answers the question the empty `category` column has
been holding open since scene 1: *who fills those in?* The answer begins here —
the **Query Rows** block selects the rows it's allowed to touch, hands them to
the agent, and the agent goes live.

The one idea is **the read**: rows become workflow data. Not the processing, not
the write — just the act of a block selecting a range of the table and a
reference resolving to it. The processing and the write are the next scene.

## The set piece, and what "freeze-cut" means

The scene renders the one shared `<Stage/>` at identity camera (`CAM_ID`) and
turns on exactly the state this beat needs:

```tsx
<Stage
  cam={CAM_ID}
  cellHi={(c, r) => rangeMix(r)}      // the table lights its read range
  query={{highlighted: queryLive}}    // Query block's live ring
  classify={{highlighted: classifyLive}}
  pulse1={pulse1}                     // light crossing edge 1
  tagGlow={tagGlow}                   // <table.rows> glows…
  tagResolve={tagResolve}             // …then resolves to [5 rows]
/>
```

This scene and the next are a **freeze-cut**: a single continuous run, cut in two
across the scene boundary. The run *starts* here and the same run *completes* in
`the-write`. The cut happens mid-run, on a deliberately held live state — and
because both scenes render the same set piece, the last frame of this scene and
the first frame of the next are identical down to the pixel. The boundary isn't a
transition; it's a freeze you cut on.

> *"Why cut a single run in half at all?"* Because read and write are two ideas,
> and the rule is one idea per scene. Splitting the run lets each half breathe —
> the read gets its own beat to land before the write begins — without ever
> implying two separate runs happened. The freeze-cut is how you get scene-level
> clarity out of a continuous mechanical event.

## The cause→effect move: synchrony, not a connector line

The heart of the scene is two things firing together. Watch the timing:

```ts
const queryLive = t >= 0.8 && t < 3.6;                       // ring on at 0.8s
const rangeMix = (r) => ramp(t, 1.1 + 0.14*r, 1.45 + 0.14*r); // rows light from 1.1s
```

The Query block's **live ring** comes on at 0.8s, and just after — 1.1s — the
five rows begin lighting **as one selection range**, sweeping top to bottom. The
block leads by a beat; the table follows. There is **no line drawn** between the
block and the table. The teaching is carried entirely by **synchrony**: the ring
turns on, then the rows light, and your eye binds them as cause and effect
because they happen in the same short window.

> *"Why no connector line from the block to the rows it's reading?"* Because a
> line is a claim about geometry that isn't true — the Query block doesn't have a
> wire to the table; it queries it. A line would also re-introduce exactly the
> floating-graphic look that got an earlier cut rejected. Synchrony says
> "this caused that" without drawing a single false edge. The small lead (ring at
> 0.8, range at 1.1) is what sells direction: cause first, effect second.

## Why the rows light as *one* range and not five boxes

`rangeMix` returns the same value for every row's cells, and `SimTable` draws a
**single outline** around any contiguous run of equally-highlighted cells (it
suppresses the borders that face another highlighted cell). So five lit rows read
as **one selection range** — "these five rows, together, are what the query
returned" — rather than five separate selections.

> *"Why does that matter here?"* Because the query returns a *set*, and the set
> is the thing being handed to the agent. One outline = one result. If each row
> had its own box you'd read "five things were selected"; with one outline you
> read "a result set was selected," which is what `<table.rows>` actually is.

## The reference resolving — the read made literal

The agent block (Classify) has a `Messages` row holding `Classify <table.rows>`.
That `<table.rows>` is a live reference, and it does two things in sequence:

```ts
const tagGlow    = ramp(t, 2.2, 2.7, EASING.out);   // glows with the lit range
const pulse1     = ramp(t, 3.5, 4.15, EASING.inOut); // light crosses edge 1
const tagResolve = ramp(t, 4.1, 4.5);                // resolves to [5 rows]
```

First, while the range is lit above, the tag **glows** (2.2→2.7s) — saying
"this reference points at *those* rows." Then a pulse of light crosses the edge
from Query to Classify (3.5→4.15s), and as it arrives the tag **resolves** from
the template `<table.rows>` to its value `[5 rows]` (4.1→4.5s). The glow connects
the reference to the lit rows; the pulse delivers them; the resolution shows what
arrived.

> *"Why `[5 rows]` and not the actual row data?"* Because the full value is
> already on screen — it's the lit range in the table above. Showing the rows
> twice (once lit, once expanded in the tag) would be redundant and would blow
> out the block. The resolved tag is the **truncated** stand-in; the table holds
> the real value. (This is module-5's truncation rule: when the full value is
> visible elsewhere, the reference collapses to a width-appropriate summary.)
>
> *"Why glow *before* the pulse, then resolve *after* it?"* Because that's the
> actual order of operations: the reference is bound to the rows (glow), the run
> reaches that block (pulse crosses), the reference evaluates (resolve). Animating
> them in causal order is what makes the reference feel computed rather than
> decorative.

## The held state — the 4→5 contract

The scene ends mid-run, and what it ends *on* is a contract the next scene must
open on exactly:

```ts
const classifyLive = t >= 4.05; // comes on and HOLDS through the boundary
```

At the cut: Classify's **live ring is on**, the **five-row range is lit**, the
tag is **resolved to `[5 rows]`**, and both edge pulses are spent. The agent is
working — and we hold it there. The next scene opens on this frozen frame and
lets the ring sit a beat before continuing.

> *"Isn't holding a live, mid-animation state risky for continuity?"* It's the
> opposite — it's the safest possible boundary, *because* it's held. Nothing is
> in flight across the cut: the pulse has finished, the range has finished
> lighting, the tag has finished resolving. Every animated value is at rest at a
> non-trivial position. That's what makes the freeze-cut verifiable like any
> other boundary — render the last frame of scene 4 and the first frame of scene
> 5; they're identical. A boundary cut on something *still moving* couldn't be
> verified that way.

## The animation, beat by beat

Two helpers do all the timing. `ramp(t, t0, t1, easing?)` goes 0→1 as the clock
crosses `t0`→`t1`, clamped. `pulseWindow(...)` (used heavily next scene) goes up,
holds, comes back down. Everything is built from these.

1. **0.8s** — Query's live ring comes on.
2. **1.1→~2.0s** — the five rows light top to bottom (each row `0.14s` after the
   one above) as one selection range.
3. **2.2→2.7s** — `<table.rows>` glows, bound to the lit range.
4. **3.5→4.15s** — a pulse of light crosses edge 1 (Query → Classify).
5. **4.1→4.5s** — the tag resolves to `[5 rows]`.
6. **4.05s →** — Classify's live ring comes on and **holds** to the cut.

> *"Why is the row stagger `0.14s` here when the assemble in scene 1 used a
> slower stagger?"* Because this is a *query selecting* rows, not a table
> *loading* — a selection sweeps fast, like a cursor running down the column.
> The pace is the meaning: a leisurely stagger says "content arriving"; a quick
> one says "a query scanning." Same mechanism, different cadence, different read.

## Exit state (what scene 5 inherits)

`camera identity · Classify live ring ON · five-row range lit · <table.rows>
resolved to [5 rows] · both pulses spent · table still unprocessed (no values
written yet)`. Scene 5 opens on exactly this frame and lets the ring sit a beat
before crossing edge 2 into the write. The held live state **is** the continuity
contract — verified like any boundary pair.
