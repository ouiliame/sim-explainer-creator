# Subworkflows — the Workflow block (v1) — subworkflows-v1

Registered as `subworkflows-v1` (greenfield; nothing overwritten). Fully
animated piece; a live-product intercut (picking the child in the real
workflow selector) would slot after scene 2 as a screen recording.

**The one idea:** a whole workflow can be one block inside another — the
parent run parks at the block, the child runs end-to-end with the parent's
value as its `start.input`, and the child's final response comes back as
`<workflow.result>`.

**Macro arc:** outside-in zoom, run inside-out — orient from the known
(the series CLASSIFY chain working on its own canvas), fold it into a
single block in a new parent (containment), then one mechanistic run that
freezes at the block, zooms through it, completes the child inside, and
zooms back out with the result. Close one level up: the parent itself
folds into a block (composition).

**Run count: 3** — (1) compressed editor run in scene 1 (pulses + green
settle, no row resolutions): re-establishes "this is the working workflow
you know" so its reappearance *inside* the block is recognized, and so the
fold reads as packaging a live thing, not an icon; (2) THE run, scenes 3–5
(one single run held across two freeze-cut boundaries): the mechanistic
centerpiece — every resolution in the video belongs to it; (3) one
compressed pulse across the outer chain in scene 6: proves the recursion
claim (the parent now behaves exactly as the child did) — the whole video
replayed as a blip. Each run differs from the previous in exactly the
taught dimension (baseline → call mechanics → composition).

**Grounding:** every value on screen traces to
`demo-corpus/grounding-v1.md` (staging `_reference/sim` @ 5fb37b4ad +
series canon; batch mode — the artifact request was written but unsent).
All block row titles are verbatim staging-registry subBlock titles
(verified per row in the grounding file). ⟨pending⟩ values are off screen.

## Motion language

Values resolve in rows (`DipSwap` / `ResolvedTag`); wires carry `WirePulse`
only; state via product language (rings / 0.35 dim / green ok). One
video-specific move, used three times so it reads as THE move of the
video: **the fold/unfold** — a whole canvas scales down and crossfades
into a single Workflow block footprint (zoom-through run in reverse), and
its inverse, the camera pushing through the block until the child canvas
resolves underneath. Both are camera transforms over `layout.ts` geometry,
never re-layouts. No deployment badge anywhere (current staging app shows
none for a deployed child — grounding file, drift note 3).

## Locked scene list (~57s)

1. **the-workflow-you-know** (~8s) — [assemble + compressed run]
   The series CLASSIFY chain (Start → Agent → Response) assembles on the
   builder canvas: blocks stagger in, edges draw on. One compressed run —
   start blip, pulse, agent live ring, pulse, response blip, blocks settle
   green in causal order — then the green fades back to rest. No row
   resolutions (we know this workflow; scene 4 owns the values).
   *Beat intent: this is the workflow you already built — complete and
   working on its own.*

2. **it-becomes-a-block** (~10s) — [zoom-through (reverse) + assemble]
   The camera eases back; the whole canvas — dots and all — shrinks toward
   a block-sized footprint and crossfades into a single indigo Workflow
   block at the center slot of a new chain. Its rows appear: `Select
   Workflow: classify-message` (brief selection ring — the editing
   moment), then `Input Variable: <start.input>`. The new parent assembles
   around it: Start fades in on the left, Agent on the right (`Messages:
   <workflow.result>` — bare tag; the docs' `Summarize ` prefix truncates
   at row width, KB-v2/webhooks precedent), edges draw on. Hold the
   resting parent.
   *Beat intent: the whole workflow is now ONE step in a bigger flow —
   configuration is just "which workflow, what does it receive".*

3. **the-call-begins** (~7s) — [run → freeze-cut]
   A parent run starts: "I want a refund" dips into Start's `Inputs` row,
   start blip, pulse crosses edge 1; as it lands, the block's
   `<start.input>` tag resolves to "I want a refund" — the handoff is
   visible in the block's own config row. The Workflow block's live ring
   comes on… and HOLDS. Nothing moves past the block. The held live state
   crosses the boundary.
   *Beat intent: the run reaches the block and parks — the block has the
   parent's value, and now it has to go run something.*

4. **inside-the-call** (~14s) — [freeze-cut continuation + zoom-through + run]
   Opens inside the held moment: same frame, then the camera pushes into
   the Workflow block until it fills the frame and the child canvas
   resolves underneath — the chain from scene 1. The handed-off value
   arrives: "I want a refund" dips into the child Start's `Inputs` row
   (this is `start.input`), and the child runs the whole way: pulse, child
   agent live, `Classify <start.input>` resolves to the same message;
   pulse, `<agent.content>` resolves to `"billing"` in the child's
   `Response Data` row. The child blocks settle green in causal order.
   HOLD the completed child — the run is still the parent's one run.
   *Beat intent: inside the block, the child workflow runs end-to-end —
   the value you passed IS its start.input.*

5. **back-with-the-result** (~10s) — [zoom-through (reverse) + run completion]
   The completed child folds back into the block: camera pulls out, the
   child world shrinks into the block footprint, and as it lands the
   block's ring flips live-blue → ok-green (the call returned). The run
   resumes: pulse crosses edge 2, the parent Agent's `<workflow.result>`
   resolves to `"billing"` — the child's final response, now an ordinary
   reference — agent live ring, then the parent settles green in causal
   order. Hold, then resolutions revert and the green fades: the resting
   parent again.
   *Beat intent: the child's final response comes back as the block's
   result; the parent continues with it like any other value.*

6. **workflows-all-the-way-up** (~8s) — [zoom-through (reverse) + settle/bookend]
   The same move, one level up: the camera eases back and the WHOLE parent
   canvas folds into a single indigo Workflow block at the center of a
   header-only outer chain (Start → Workflow → Agent, names only). One
   pulse crosses it — blip on the block (the entire story compressed to a
   beat) — pulse out, and the outer chain holds, balanced and still.
   *Beat intent: a parent is itself a workflow — composition goes all the
   way up; keep each piece small and call it anywhere.*

## Continuity contract

- ONE geometry, owned by `layout.ts`: every chain in the video (child,
  parent, outer) sits at the series blockX/CHAIN_Y positions. Worlds
  differ; the slots never move. The fold/unfold targets the center slot
  (blockX(1)) exactly, computed from layout constants.
- Scene-by-scene boundaries (exit state == enter state, pixel-diff
  verified):
  - 1→2: child canvas at rest (template rows, no rings, camera identity).
  - 2→3: parent at rest (block rows complete, no rings, no resolutions).
  - 3→4: **freeze-cut** — held live state: Start's `Inputs` row =
    "I want a refund" (resolved), block's `Input Variable` = resolved
    value, block ring live-blue, camera identity. Scene 4 opens on this
    exact frame.
  - 4→5: **freeze-cut** — held completed-child state: camera fully pushed
    in (child canvas at identity), child rows resolved ("I want a
    refund" / `"billing"`), all three child blocks ok-green. Scene 5
    opens inside it and pulls out.
  - 5→6: parent at rest again (scene 5 reverts every resolution and ring
    before its end; camera identity).
  - Scene 6 ends on the outer chain at rest — no following boundary.
- The one run never re-runs: scene 4 continues scene 3's run; scene 5
  completes it. (Freeze-cut anti-pattern guarded.)
- All resolutions revert before scene end EXCEPT across the two named
  freeze-cuts above, where the held state is the contract.
- No sentences on screen; short noun labels, row values, and tags only;
  narration carries every word.

## Batch-mode assumptions (in lieu of the director)

1. **Audience**: viewers of module-1 (workflows); module-5/6 helpful but
   not required. The CLASSIFY chain is a known referent. Target ~57s.
2. **Beats + script auto-blessed**: the phase-2/3 gates passed without
   sign-off; the scene list above is the contract built to.
3. **Child = `classify-message`, not the docs' `enrich-lead`**: the docs
   example's child has no authored internals; the no-invention rule forces
   either an empty zoom (teaches nothing) or the staging docs' own running
   example, which is fully authored AND series canon. Swap cost: one row
   value + re-grounding the child canvas (grounding-v1.md, deviation 1).
4. **Registry row titles over canon abbreviations**: `Inputs`,
   `Response Data`, `Status Code` (vs canon `Input`/`Data`/`Status`) per
   the batch directive; the child canvas therefore deviates from prior
   videos' pixels by three title strings. Swap cost: three strings.
5. **Bare `<agent.content>` tag in the child's Response row**: the canon
   JSON template `{ "category": … }` plus the longer registry title
   exceeds the 375px row. Bare-tag-when-the-wrapper-doesn't-fit is the
   KB-v2/webhooks precedent. Consequence: `<workflow.result>` resolves to
   `"billing"` (the response data), keeping the return value identical to
   what the child visibly produced.
6. **No deployment badge / no deployment beat**: current staging app
   renders no badge for a deployed child; deployed-version semantics stay
   in module-6 (notes.md). If the director wants the warn-callout taught,
   it's a new beat, not a row.
7. **Scene 6 outer-chain blocks are header-only** (no config rows): names
   `Start`/`Workflow`/`Agent` only, so nothing un-grounded appears and the
   recursion reads at a glance. The second-level block is named `Workflow`
   (registry/docs-example name), not `Workflow 2` (instance numbering is a
   workspace artifact we can't ground without a live run).
8. **Narration**: per the skill, beat intents only; no VO lines drafted.
