# Loops (iteration) — narration sheet (v1)

Total runtime: 66s. Scene boundaries are hard cuts at the listed times.
Visuals are authoritative: re-time VO to the picture, not the reverse.
No anchor phrases on file (batch-mode build — none were coined).

## 1. a-block-that-holds-blocks — 0:00–0:09

- **Beat intent:** This is a block that holds blocks — a workflow inside a
  workflow. Whatever you drop inside runs once per item; it has its own
  little start.
- **Key moments:** t=0.5 Start appears · 1.2 wire draws · 1.9 the Loop
  container appears (box + header + inner Start pill) · 3.6 Function 1
  appears INSIDE · 4.7 the container's own exit wire · 5.4 Summary.
- **Room:** 6.1–9.0 holds the finished frame.

## 2. what-the-loop-knows — 0:09–0:17

- **Beat intent:** The loop is told how to iterate — for each item of this
  collection, run the inside once. Three items: the inside will run three
  times.
- **Key moments:** t=0.5 selection ring + world dims · 1.0 editor card in ·
  2.0 "For Each" field glows · 3.4 / 4.4 / 5.4 the items "x", "y", "z"
  glow one by one (count them with VO) · 6.2 card leaves · 7.0 undim.
- **Room:** the item-count beat (3.4–6.0) is paced for "one… two… three".

## 3. one-at-a-time — 0:17–0:31

- **Beat intent:** Same steps, next item. Each pass the inside runs once
  and `<loop.currentItem>` IS the current item — a different value every
  time. A Loop takes them strictly one after another.
- **Key moments:** t=0.5 run starts (Start blips, pulse) · 1.4 container
  live ring (stays on) · 1.8 camera leans in · passes start at 3.2 / 5.8 /
  8.4 — each: pill blips → pulse → Function live → tag resolves to "x" /
  "y" / "z" → settles ok · 11.6 camera returns; ring still on.
- **Room:** 11.0–14.0 (after the third pass) holds for the hand-off line.

## 4. the-results-come-out — 0:31–0:39

- **Beat intent:** After the loop, the per-item context is gone — you
  reference the loop by its name and get every pass's result, in order,
  as one array.
- **Key moments:** t=0.9 container settles green · 1.3 the exit fires
  (one pulse) · 2.0 Summary live · 2.6 `<loop.results>` resolves to
  `["x", "y", "z"]` · 3.4 Summary green · 6.2 everything reverts.
- **Room:** 3.6–6.0 holds the resolved array on screen.

## 5. swap-the-container — 0:39–0:47

- **Beat intent:** Same container idea, same steps inside — one swap and
  only the schedule changes. Downstream you reference it by name, so the
  tag follows.
- **Key moments:** t=0.6 selection ring · 1.4–5.4 the morph: chip blue
  Repeat → yellow Split + name → Parallel first, then the inner tag dips
  to `<parallel.currentItem>`, then Summary dips to Aggregate /
  `merge(<parallel.results>)` · 6.6 ring releases.
- **Room:** 5.5–8.0 holds the Parallel template.

## 6. all-at-once — 0:47–0:59

- **Beat intent:** A Parallel runs an instance per item, all at once —
  independent work in a fraction of the time — and the results still come
  out as one array.
- **Key moments:** t=0.4 run starts · 1.3 container live · 1.8–2.8 the
  block fans into three instances · 3.0 the pill blips ONCE; three pulses
  together · 3.85 all three live simultaneously · 4.15 all three resolve
  "x" "y" "z" at the same moment · 5.3 all settle ok together · 6.5 fan
  merges back · 7.5 container green · 7.8 exit fires · 9.0
  `<parallel.results>` resolves · 10.7 revert.
- **Room:** the simultaneous beat (3.85–5.3) wants one short line; 5.9–6.5
  breathes before the merge.

## 7. two-schedules-one-shape — 0:59–1:06

- **Beat intent:** One shape, two schedules. Loop when order or dependence
  matters; Parallel when items are independent and you want them done now.
- **Key moments:** t=0.8–4.2 the morph plays in reverse, landing on the
  opening Loop frame · 4.6 camera eases back 7%.
- **Room:** 4.2–7.0 is a still frame for the closing line.
