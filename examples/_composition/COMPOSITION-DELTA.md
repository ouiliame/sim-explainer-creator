# Composition — the difference between a wireframe and a scene

Two frames of the same kind of content. One reads as a cheap wireframe; one reads
as the real product, alive and working. The components, colors, and values are not
the problem — **the composition is.** This is the lesson most worth internalizing,
because it's the one that separates "technically correct" from "good."

- `BAD-sparse-wireframe.png` — what to never ship.
- `GOOD-dense-composed.png` — the target.

Open both side by side before you read on.

---

## What makes the bad frame bad

It uses real components and grounded values, and it still looks amateur. Why:

1. **It's lopsided, and most of the frame is dead.** One small card floats mid-left;
   a column of cards is jammed against the right edge; the entire center and
   bottom-right are empty void. Two clusters shoved to opposite margins is not a
   composition — it's two things that happen to be on screen.
2. **The parts aren't connected — no mechanism crosses the frame.** The cards on the
   right just sit in a list. You don't *see* the thing on the left becoming them.
   There's no flow, no derivation, no causality drawn between the regions. A viewer
   can't read "this produces that" because nothing says so.
3. **Stray scaffolding.** Thin marker lines cut through the left card and read as a
   glitch. If a line doesn't carry meaning a viewer can name, it's noise — cut it.
4. **A text island in the void.** A block of mono config text is dumped into empty
   space at the bottom-left, a label to read rather than a thing to look at. Config
   belongs *inside a real block's config rows*, not floating on the canvas.

The sum: the frame is **sparse, unbalanced, disconnected, and littered.** It looks
like a layout that was started and abandoned.

## What makes the good frame good

1. **It's banded and full.** A complete workflow runs across the top of the frame; a
   row of live work fills the bottom; a results surface sits to the side. Every
   region of the frame is populated and deliberate. There is no large dead quadrant.
2. **The whole machine is visible and working at once.** You see the trigger, the
   agent, the *parallel container with three real lanes inside it*, three live phone
   conversations at different stages, and the table they write to — all in one read.
   The frame is a money shot: the system caught mid-run, doing its actual job.
3. **The mechanism connects edge to edge.** Wires run from the workflow into the
   container; the container's lanes correspond to the three call panels below; the
   calls feed the table. Your eye can trace cause → effect across the entire frame.
4. **It's dense with authentic detail.** Real phone numbers, real message text,
   `<parallel.currentItem>`, waveforms, a parallel container with its real header.
   Density that is all *real product*, not filler — that's what makes it read alive.

---

## The discipline (apply this BEFORE you place anything)

Staging is a composition problem, not a "drop the components somewhere" problem.
Decide the frame's structure first:

- **Band the frame.** Most scenes resolve into 2–3 horizontal bands (e.g. the
  workflow chain across the top; the evidence of its work — panels, tables, chat —
  across the bottom). Place every element into a band. A single element floating
  alone in open space is the tell of a wireframe.
- **No dead quadrants.** Mentally quarter the frame. If a quarter is empty void with
  nothing doing work, the composition is unbalanced — either the focal cluster is too
  small (zoom in / scale up) or you're missing the supporting surface that belongs
  there (the table, the inspector, the chat). Fill it with *real work*, never filler.
- **Connect the mechanism across the frame.** If region A produces what region B
  shows, *draw the relationship* — a wire, a fan, a synchronized beat. Disconnected
  clusters read as a mood board. The viewer should be able to trace the causal path
  end to end.
- **Anchor the focal cluster.** One region is the subject of the moment; center or
  band it with weight. Everything else distributes around it for balance (hub-and-
  spoke, symmetric lanes, a banded grid) — never lopsided.
- **Density is real surfaces, not decoration.** Fill the frame by showing *more of the
  real system working* (more lanes mid-run, the table filling, the chat interior, the
  inspector tree) — not by adding boxes. If a region is sparse, the fix is usually
  "show the mechanism there," not "add a graphic."
- **Config lives in blocks; outputs live in surfaces.** Never float a text block of
  settings on the canvas — put it in a real block's config rows. Never float result
  chips — resolve them in a real surface. Loose text/chips on the background are the
  litter that makes a frame look unfinished.
- **Kill every line that isn't load-bearing.** Marker lines, helper guides, dev
  labels, an unlabeled stray shape — if a viewer can't name what it means, delete it.

The test, before you call a scene done: **could this frame be a screenshot of the
real product mid-run?** The good frame could. The bad frame obviously couldn't — and
the gap between them is composition, applied six times over.
