# Loops — narration v1

DRAFT narration (generated, per the director's pilot sanction 2026-06-11).
Massage freely — edit the prose under each header, then re-run:

    bun scripts/vo-sync.ts --comp loops-v1 --narration src/videos/loops/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change.

## 1. a-block-that-holds-blocks — min 9s

Some jobs are a list — the same steps need to run for every item. For that, Sim has the Loop: a block that holds other blocks. Whatever you place inside it runs once per item.

## 2. what-the-loop-knows — min 8s

The loop is configured with a collection to iterate over — three items here, so everything inside will run three times.

## 3. one-at-a-time — min 14s

Watch the current item reference. On the first pass it resolves to x; the same steps run again with y, and then z. A Loop takes the items strictly in order.

## 4. the-results-come-out — min 8s

After the last pass, the loop exits once. Downstream, loop dot results is an array holding every pass's output, in order.

## 5. swap-the-container — min 8s

Now swap the container to Parallel. The steps inside don't change — only the schedule does. References follow the name, so the tags update on their own.

## 6. all-at-once — min 12s

A Parallel block runs one copy of the inside for every item, all at the same time. They finish together, and the same results array comes out.

## 7. two-schedules-one-shape — min 7s

One shape, two schedules: use a Loop when the order matters, and Parallel when it doesn't.
