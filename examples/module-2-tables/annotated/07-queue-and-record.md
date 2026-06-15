# Scene 7 — `queue-and-record`  ·  archetype: **bookend non-run**

Source: `../source/scenes/QueueAndRecordScene.tsx`, `../source/scenes/_v2.tsx`,
`../source/layoutV2.ts`, `../source/dataV2.ts`.

This is the closing scene and the thesis lands here. It does something almost no
explainer scene does on purpose: it **runs the workflow and shows it do
nothing.** That deliberate no-op is the single cleanest proof of the video's
whole argument — the table is both the queue and the record. Read this as the
template for "prove the system remembers."

---

## What this scene is for

The video has been building one closing line, said verbatim from the docs:

> *"the table serves as both the queue the workflow pulls from and the record of
> what it has already done."*

Every prior scene set this up; this scene *demonstrates* it. The same Query Rows
block that lit up five rows in scene 4 fires again — and selects **nothing**,
because scene 5 flipped every row's `status` to `qualified` and the filter reads
`status = 'unprocessed'`. The empty result is the entire thesis in one shot: the
table remembered what was already done, so the workflow doesn't redo it.

The one idea is **the workflow never redoes finished work.** Nothing new is
introduced; the scene is a controlled repeat of the read with the opposite
outcome.

## Why a non-run is the strongest possible final beat

A run that *does* something proves the workflow works. A run that *correctly does
nothing* proves the workflow **remembers** — a strictly stronger and harder claim,
and the one the thesis actually rests on. You can only show "it didn't redo the
work" by re-running it; describing it would be a caption, and captions are
banned. So the scene re-fires the query and lets the empty result speak.

This only works because of a decision made two scenes earlier: the written values
**persisted**. If scene 5 had released its cell values along with its rings, this
scene's query would light up five rows again and the thesis would collapse. The
no-op is the cash-out of the "release the run, keep the values" exit contract.

## The scene, in full

It's the shortest scene in the cut because it reuses everything:

```tsx
<Stage
  cam={cam}                                    // eases back ~7% for the final hold
  writeMix={() => 1}                           // table stays FILLED (the record)
  colHeaderHi={(c) => (c === STATUS_COL ? headerGlint : 0)} // filter reads the status column
  query={{highlighted: queryLive, state: queryOk ? "ok" : "none"}}
/>
```

`writeMix={() => 1}` holds the table in its written state — every `category`
filled, every `status` reading `qualified`. That's the **record**. The query
fires against it.

## The contrast that carries the meaning

The whole scene is legible only against scene 4. Put them side by side:

| | scene 4 (`the-read`) | scene 7 (`queue-and-record`) |
|---|---|---|
| Query ring | comes on | comes on |
| Rows lit | **five-row range lights** | **nothing lights** |
| `status` values | all `unprocessed` | all `qualified` |
| Outcome | rows flow into the workflow | no rows match the filter |

The viewer's eye, primed by scene 4, *expects* the range to light. It doesn't.
That violated expectation is the teaching — and it's why scene 4 had to make the
lit range so emphatic: the empty result is only legible because you remember what
a full result looked like.

```ts
const queryLive = t >= 0.7 && t < 2.9;  // ring on…
const queryOk   = t >= 2.9;             // …then settles green/ok — the run succeeded
// note: there is NO cellHi / rangeMix anywhere. Nothing lights, by omission.
```

> *"How do you animate 'nothing happens' without it reading as a bug?"* By making
> the *run* unmistakably happen — the ring comes on, the filter visibly reads the
> column, the block settles green — while the *result* is visibly empty. The
> success state (`ok`) is critical: it says "the query ran fine, this is the
> correct answer," not "the query failed to find anything." A green settle on an
> empty result reads as "nothing to do, by design." Omitting the ring too would
> read as "the scene forgot to run."

## The status-column glint — the filter reading the record

The one new gesture is a glint on the `status` column header:

```ts
const headerGlint = pulseWindow(t, 1.2, 1.7, 2.4, 2.9);
// colHeaderHi only on STATUS_COL → header outline rings up, holds, releases
```

The filter is `status = 'unprocessed'`, so the thing the query *consults* is the
`status` column. Glinting that header — and nothing else — points at exactly the
column the filter reads, the same column scene 5 wrote `qualified` into. It's the
visual link between "what the filter checks" and "what the last run changed,"
which is precisely why the result is empty.

> *"Why glint the header and not the cells?"* Because the cells aren't being
> selected — that's the whole point, nothing is selected. Glinting the *header*
> says "the filter is reading this column" without implying any row matched. It's
> the act of checking, drawn without a false selection.

## The camera ease-back — settling on the balanced final frame

There's no run after this, so the scene ends on a held frame, and the camera
pulls back slightly to compose it:

```ts
const camM = ramp(t, 3.4, 5.2, EASING.inOut);
const cam  = camMix(CAM_ID, CAM_OUT, camM); // identity → s=0.93
```

After the query settles, the camera eases from identity to `0.93` over ~1.8s and
holds — the filled table sitting above its idle workflow, both fully in frame.

> *"Why pull back at the very end?"* To close on the *whole system* rather than a
> detail. Through the run scenes the camera was at identity, framed for the
> action. The ending isn't about action; it's about the finished relationship —
> table-as-record over the workflow that filled it. Pulling back ~7% lets both
> the table and the chain breathe in one balanced composition, which is the
> image you want to leave on. The ease (`EASING.inOut`) makes it a settle, not a
> zoom — the camera relaxing, not reframing.
>
> *"Why end on a held frame at all?"* Same reason scene 1 ends held: this tail is
> where the closing narration plays, and a settled, motion-free frame can stretch
> to any voiceover length without freezing an animation mid-flight. Ending on a
> live or moving state would make the audio step downstream painful.

## The animation, beat by beat

1. **0.7s** — Query's live ring comes on (the run fires again).
2. **1.2→2.9s** — the `status` header glints (the filter reading the column),
   while **no range lights** — every row already reads `qualified`.
3. **2.9s** — Query settles green/`ok`: the run succeeded, the answer is empty.
4. **3.4→5.2s** — camera eases back from identity to `0.93`.
5. **end** — held: the filled table over its idle workflow, balanced in frame.

## Exit state

There is no following scene — this is the last frame of the video. It rests on
`camera at CAM_OUT (0.93) · Query settled ok · status header released · table
filled (the record) · workflow idle`. The held frame is the closing image and
absorbs the final narration line.
