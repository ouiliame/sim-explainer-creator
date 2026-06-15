# Scene 14 — `relevant-chunks`  ·  archetype: **selection (retrieval)**

Source: `src/videos/knowledge-base/scenes/RelevantChunksScene.tsx`,
`src/videos/knowledge-base/layout.ts`,
`src/components/{ChunkCard,KBContainer,QueryBox}.tsx`,
`src/motion/Highlight.tsx`.

This is the **retrieval moment** — the literal heart of the whole module. The
previous scenes built the machine: a KB full of chunks, a query box, a line
joining them. This scene fires it. Its single job is to show *search* as a
physical act: the query reaches into the grid of chunks and only **a few** of
them light up. Read it as the worked example for "show a selection from many
without a single word" — the entire concept of relevance is carried by which
cards glow and which dim.

---

## What this scene is for

The thesis of the video is "your workflow doesn't need the entire library every
time — it needs the right pages." This is the scene where that sentence becomes
an image. There is a grid of twelve chunks (the library), a query (the task),
and the answer to "which pages?" is shown by **three** chunks glowing while the
other nine fall back.

The rule is *one idea per scene*: this scene is "the query selects the relevant
chunks." It does not move them, reorder them, or send them anywhere — that's the
next two scenes. It just makes the selection. The moment the relevant few are
lit and the rest are dimmed, the scene's work is done.

## What it looks like

The KB sits on the right (`KBContainer`, "Sales", labeled `chunks`), holding a
2-column × 6-row grid of twelve `ChunkCard`s. On the left, a `QueryBox` —
*"Why are sales down in Q4?"* A thin connector line runs from the query across
to the KB. Then three chunks — spread across the grid, not clustered — come up
to full brightness with a soft glow ring, while the other nine fade back to a
dim. The lit three are visibly from **different source documents** (different
stripe colors). Hold on that state.

## The one real decision: relevance is a `Highlight` over a fixed grid

The whole grid is the twelve `KB_CHUNKS` from `layout.ts`, each rendered at a
fixed `kbChunkX(i)`/`kbChunkY(i)`, wrapped in a `Highlight` keyed on whether its
index is in the relevant set:

```tsx
const RELEVANT = new Set(RELEVANT_CHUNK_INDICES); // [1, 6, 10]
...
<Highlight active={RELEVANT.has(i)} delay={0.6} duration={0.8}>
  <ChunkCard width={KB_CHUNK_W} seed={c.seed} lines={c.lines} source={c.source} />
</Highlight>
```

This is the entire mechanism. There is no search animation, no scanning beam, no
particle effect — relevance is expressed purely as **brightness state**: the
matched chunks stay at opacity 1 and gain a glow ring; the unmatched fall to the
`Highlight` default dim of `0.35`.

> *"Why is that enough? Shouldn't search look like something happening?"* The
> temptation is to animate a scan — a sweeping line, a pulse rolling through the
> grid. Resist it. Search in a vector DB isn't a visible left-to-right sweep;
> dramatizing it as one would be *designing* a fiction instead of *porting* the
> truth. What's true is the **outcome**: some chunks come back, most don't. So
> the scene shows the outcome as a state change and lets the simultaneity of the
> selection ("these three, at once, out of twelve") carry the meaning. The
> honest picture is the still result, not an invented process.

Note the glow color. `Highlight`'s default `color` is `COLORS.active`
(`#33c482`, the product's green "ok/done" hue), and this scene uses that
default — relevance here reads as a confirming green, the product's own
"selected/matched" language, never an arbitrary highlight color introduced for
the video.

## The values, and why three chunks spread across the grid

```ts
export const KB_CHUNKS: ChunkSpec[] = [ /* 12 chunks across 6 source docs */ ];
export const RELEVANT_CHUNK_INDICES = [1, 6, 10];
```

The grid is twelve chunks deliberately spanning all six source documents (PDF,
Notion, spreadsheet, markdown, slides, mail). The three relevant indices are
`1, 6, 10` — and the spread is the entire point.

> *"Why 1, 6, 10 — why not the top three (0, 1, 2)?"* Because relevance is
> **not** position. If the winners were the first three cards, the viewer would
> read "it took the top of the list" — the wrong model. By scattering the
> winners through the grid (one near the top, one in the middle, one near the
> bottom), the picture says retrieval *reaches across the whole library and
> picks a best subset* wherever it lives. The `layout.ts` comment says exactly
> this: *"Indices spread across the list so retrieval visibly picks a subset, not
> the top."* And because chunks `1, 6, 10` come from three different source docs
> (different stripe colors), the lit set also says "the answer is assembled from
> multiple sources" — a second true claim delivered for free by the index
> choice.
>
> *"Why three and not, say, the single best one?"* One winner would read as
> "look up the answer." Three reads as "gather the relevant passages" — which is
> what retrieval does, and what sets up the next scenes (reranking three,
> injecting three into context). Three is the smallest number that reads as "a
> few, not one, not all."

## The animation, beat by beat

### (a) The query and connector are already present at scene start

The `QueryBox` and the query→KB line are rendered at full opacity from frame 0 —
they were animated in by the *previous* scene (`query`, scene 13) and this scene
inherits them. No re-entrance.

> *"Why not re-introduce the query here for emphasis?"* Because re-animating an
> element that's already on screen across a cut is exactly the teleport/flash the
> series forbids — the query slid in last scene and must persist unchanged into
> this one. The continuity contract is that scene 13's exit (KB shrunk right,
> twelve chunks faded in, query slid in, line drawn) **equals** this scene's
> enter. The selection is the *only* new event. Keeping everything else static is
> what lets the glow read as the single idea.

### (b) The selection resolves — `Highlight` over 0.6s → 1.4s

Every chunk's `Highlight` shares `delay={0.6} duration={0.8}`, so all twelve
transition together: the three relevant rise to a glow, the nine others sink to
0.35 dim, simultaneously, between 0.6s and 1.4s.

> *"Why move all twelve at the same time instead of lighting the winners one by
> one?"* Because retrieval returns its result as one set, not a sequence. A
> staggered light-up would imply an order or a ranking *at this stage* — but
> ranking is the **next** scene's idea (reranking). Here the claim is flat: "out
> of these twelve, these three match." Simultaneous resolution keeps that claim
> clean and keeps this scene to its one idea. Splitting "which match" from "in
> what order" across two scenes is the *one-idea-per-scene* rule doing real work.
>
> *"Why a 0.6s delay before the selection?"* A short beat where the full grid
> sits un-selected lets the viewer register "twelve chunks, the whole library"
> before three of them are picked. If the selection fired on frame 0 you'd never
> see the unselected state, and the contrast — many → few — is the whole point.
> You need a moment of "many" before the "few."
>
> *"Why dim the rest to 0.35 rather than hide them?"* Hiding the nine would
> destroy the contrast that *is* the lesson — "the right few out of many" only
> reads if the many stay visible, just backgrounded. 0.35 is the series'
> standard not-focal level: present enough to count, dim enough to clearly not be
> the focus. (The next scene pushes them further to 0.18 as they become
> irrelevant — a gradual recede, not a cut.)

### (c) The hold — from ~1.4s to the end

The lit-three / dimmed-nine state rests for the back half of the scene. This is
the image the narration lands its key line on ("it brings back the parts that
seem most useful").

> *"Why hold so long on a static frame in a 4s scene?"* Because this *is* the
> thesis frame of the module — "the right pages, not the whole library" — and it
> earns the dwell. It also hands a clean, settled state to the reranking scene,
> which reads the three lit chunks as its starting point and flies them out. A
> motion still in flight here couldn't be picked up cleanly there.

## How to think about the whole scene

1. *What is search, visually?* A state change over a fixed grid — not an invented
   scanning animation. Port the outcome, not a fiction of the process.
2. *Which chunks win?* Three, scattered across the grid and across source docs →
   "a best subset from the whole library," not "the top of the list."
3. *How do they win?* All twelve resolve at once (3 glow, 9 dim) → "which match,"
   a flat set — order is deliberately the *next* scene's job.
4. *What state language?* The product's green selection glow + 0.35 dim — no
   word like "RELEVANT," no scanning beam, no caption.
5. *What stays still?* The query, the line, every position — all inherited from
   scene 13 unchanged, so the selection is the only thing the eye sees move.

## Exit state (what scene 15 inherits)

`KB on right · three chunks (indices 1, 6, 10) lit green at full opacity · nine
chunks at 0.35 dim · query + connector line present.` The reranking scene opens
on exactly this and immediately flies the three lit chunks out of the grid into a
center stack — so the glow you see here is the same glow that travels there,
fading as the chunks leave retrieval state. Because both scenes read the lit set
from `RELEVANT_CHUNK_INDICES`, that boundary is identical by construction.
