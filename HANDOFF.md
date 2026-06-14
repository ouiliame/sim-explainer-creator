# Handing off Sim explainer generation

This repo is a **harness** for generating Sim explainer videos (Remotion + Bun).
The deliverable is *not* any one video — it's the system that lets a capable
coding agent (Opus / Sonnet / Codex / whatever) one-shot a video to ~75–80%,
which a human then tunes the last 20% by reviewing screenshots. If you internalize
one thing: **the harness gets you to "good enough to tune," the human gets it to
"good."** Don't expect the agent to nail it solo; expect it to land in the zone.

---

## 0. Mental model (read before doing anything)

Two rules everything else follows from:

1. **Port, don't design.** Every good video is *composed* from the real product's
   component library (`src/components/`) with values grounded in the real product
   source (`_reference/sim`). Every bad video is *designed* — invented UI, invented
   colors, invented config. The agent's only legitimate moves are **look it up and
   compose**. If it's hand-drawing a block, panel, or chart, it's already wrong.
2. **Inject, don't scan.** Quality lives in *uncompressed* context. Make the agent
   read the actual annotated golden code + the block-schema doc + the nearest
   exemplar **whole, before building** — not "land in the repo and skim." A thin
   summary is the lossy version; the texture is the point.

---

## 1. One-time setup

```bash
git clone <harness-repo> sim-explainer-creator && cd sim-explainer-creator
git submodule update --init --depth 1 _reference/sim   # product truth (the Sim source)
bun install
printf 'ELEVENLABS_API_KEY=sk_...\n' > .env            # for voiceover TTS (gitignored)
bun run lint                                            # sanity (eslint + tsc)
bun run dev                                             # Remotion Studio at :3000
```

- The **background-music bed is committed** (`public/music/soft-explainer-loop.mp3`)
  — no key needed for music. Only the **voiceover** needs `ELEVENLABS_API_KEY`.
- `_reference/sim` is a git submodule and the single source of product truth
  (block registry, colors, example workflows, docs). Re-pin it when the product
  drifts; record the commit you grounded against in each video's script.

---

## 2. Make ONE video (the agent's job)

Point your coding agent at **`.agents/skills/new-explainer/SKILL.md`** and give it a
topic. That skill is the pipeline; it is mandatory and ordered. The shape of a good
task prompt:

> Build a Sim explainer video, slug `<slug>`, topic: `<one line + a starting
> hypothesis of the Sim block shape>`. Follow `.agents/skills/new-explainer/SKILL.md`
> exactly. Read first, no skim: `CLAUDE.md`, `docs/constraint-design.md`,
> `docs/market-desk-teardown.md`, **`docs/sim-block-schemas.md`** (the authoritative
> per-block config — read the entry for every block you put on screen and use only
> real field ids / option values / output names; never invent them), the
> nearest-shaped annotated example under `examples/`, `src/components/`, and
> `src/motion/timing.ts`. Then: concept → lock `script-v1.md` → statics
> (`layout.ts`/`data.ts`/`scenes/_rig.tsx`) → motion (thin scenes) → register in
> `src/Root.tsx` → `bun run lint` → render stills and LOOK → `bun
> scripts/verify-boundaries.ts <slug>`. Narrate LAST and keep it TIGHT (see §4).

What the agent must hold onto while building (the hard rules — they're in `CLAUDE.md`
and the skill's checklist, but enforce them in review):

- **One set piece** (`<Stage/>`) per video; scenes differ only in *state props* +
  camera. Geometry lives in `layout.ts`; nothing relayouts. Continuity is then
  structural, not audited.
- **Compose from `src/components/` only.** A bordered surface defined inside a scene
  is a failure — port it or use the shared component.
- **Every on-screen value grounded** in `docs/sim-block-schemas.md` / the registry;
  unknowables are `⟨pending⟩` and kept off screen.
- **State is the product's visual language** — blue ring = live, green = ok, red ✗ =
  failed, 0.35 dim = not focal, chip ring = tool called. **Never a state word on
  screen.**
- **Outputs only in real surfaces** (the `OutputBundle` tree, a downstream row
  resolution, the chat) — never free-floating chips.
- **Sim is not realtime** — a table/log/board changes *only* when a block writes to
  it. No ambient ticking.
- **Show the mechanism** — every effect has its drawn cause (a row fills ⇒ a Table
  block ran).
- **A container contains its children** — draw ONE lane; fan at runtime; size the box
  so the fan never overflows.
- **Agent-behavior beats use the `ChatPanel` interior** — user msg → thinking →
  tool-call rows synced same-frame to the chip rings → result → answer. Synchrony
  carries the link; no connector lines.
- **Assembly uses the coupled helpers** — `chainAssembly(t)` / `fanAssembly(t,m)`
  from `src/motion/timing.ts`. Never hand-author separate block-reveal and edge-draw
  ramps (an edge must land ON its block, never hang in empty space).
- **A written table cell tints via `SimTable.cellTint={(c,r)=>({kind:"output",
  strength})}`** — never an absolutely-positioned colored `<div>` over the grid.

A video is done when: it lints, every scene boundary pair is pixel-identical
(`verify-boundaries`), a human has LOOKED at a still of every scene, VO + music
play, and it's a faithful runnable Sim workflow (not a vibes animation).

---

## 3. Make MANY in parallel (the fleet)

This is how the launch batch of 20 was produced. One **git worktree per video** so
agents don't collide.

```bash
MAIN=$PWD
mkdir -p ../fleet-worktrees
for i in $(seq 1 N); do
  wt=../fleet-worktrees/run-$i
  git worktree add -q "$wt" -b fleet/run-$i main
  ln -sfn "$MAIN/node_modules" "$wt/node_modules"       # share deps (read-only)
  mkdir -p "$wt/_reference"; ln -sfn "$MAIN/_reference/sim" "$wt/_reference/sim"
  cp "$MAIN/.env" "$wt/.env"                              # carry the key
done
```

Then launch one agent per worktree, each with its own topic, each told: *"your
worktree is already set up — do NOT run `bun install` or touch the submodule."*

**Batch size: ~4–5 concurrent, NOT 10–20.** Heavy concurrent agents trip the API
rate limiter ("Server is temporarily limiting requests"); 20-at-once wiped a whole
fleet. Run waves of 4–5.

**Collect the renders** (filenames are sometimes misnamed — copy by the *actual*
video folder slug, not the filename):

```bash
DEST=~/Desktop/SIM-VIDEOS/batch; mkdir -p "$DEST"
for wt in ../fleet-worktrees/run-*; do
  slug=$(ls "$wt/src/videos" | grep -vE '^(<baseline-folders>)$' | head -1)
  mp4=$(find "$wt/out" -name '*-1080.mp4' | head -1)
  [ -n "$mp4" ] && cp "$mp4" "$DEST/$slug.mp4"
done
```

---

## 4. Narration + audio (do it LAST, keep it TIGHT)

Visuals are the load-bearing layer; audio is subordinate and re-timed to them.

- Write `src/videos/<slug>/narration-v1.md` in the **gold register** (clean condensed
  prose that explains what's on screen — never trailer voice, fragments, or
  "not-X-but-Y" reversals). Calibrate on `examples/vo/_gold/`.
- **Keep it to 1–2 short sentences per scene.** Dense paragraphs balloon runtime to
  ~3× the visual minimum with long dead-air holds. Target ≤ 1.5× — and if `vo-sync`
  reports more, **trim and re-sync**.
- Sync + mount:
  ```bash
  bun scripts/vo-sync.ts --comp <slug> --narration src/videos/<slug>/narration-v1.md \
      --voice M5lSFiV8wa1aYNbadPOy
  # then mount in Video.tsx (or the Root withAudio wrapper):
  #   <ScratchVO compId="<slug>" />
  #   <BackgroundMusic src="music/soft-explainer-loop.mp3" />
  ```

---

## 5. Render

`package.json`'s `render` / `render:1080` scripts are **hardcoded to one comp id**
(`knowledge-base`). Render any other video by id directly:

```bash
bunx remotionb render <slug> out/<slug>-1080.mp4 --crf=18 --codec=h264   # 1080p draft
# 4K master: bunx remotionb render <slug> out/<slug>.mp4 --scale=2 --crf=16
```

Crisp review stills (the cheap default `--scale=0.5` is too low-res to judge):
```bash
bunx remotionb still <slug> out/check.png --frame=<N> --scale=2
```

---

## 6. Gotchas we actually hit (so you don't)

- **Rate limit** at ~10+ concurrent heavy agents → run waves of 4–5.
- **Worktree↔slug mapping**: always name/derive by the real `src/videos/<folder>`,
  not your launch assignment — an off-by-one will have agents finishing the wrong
  video.
- **Narration doubling**: see §4. The single most common "feels slack" complaint.
- **Block colors/config**: read `docs/sim-block-schemas.md` + the registry; don't
  trust memory. (The Agent block is **green `#33c482`** = `var(--brand)`; the purple
  `#6F3DFA` is the **Chat trigger**, a different block. They get conflated.)
- **Schema invention**: the #1 historical error was inventing config field names,
  dropdown values, and operation ids the real product rejects. `docs/sim-block-schemas.md`
  (mirrors what Sim's own copilot is fed) fixes this — make the agent read the per-block
  entry.
- **`bun` + webpack render crash** (`wasm-hash … undefined is not an object`): set
  `output.hashFunction: "sha256"` and `cache: { type: "memory" }` in
  `remotion.config.ts`. Build-config only, no visual change.
- **A dead/throttled agent leaves the build mostly done** — resume it: point a fresh
  agent at the same worktree to finish only the tail (lint → narration → VO →
  render). Don't rebuild from scratch.

---

## 7. The review loop (this is the actual product)

1. Watch the render. Screenshot anything off.
2. Hand the screenshot back to the agent with a one-line correction.
3. Sort the fix:
   - **Truth bug** (wrong field, edge-to-nowhere, container overflow, table ticking)
     → fix it in the *component or schema* so it can't recur. This compounds.
   - **Taste call** (pacing, emphasis, framing, run economy) → your judgment; tune
     the scene. This stays human.
4. Repeat. Each truth-fix shrinks the surface the next agent can get wrong.

---

## 8. Where the knowledge lives

| Path | What it is |
|---|---|
| `.agents/skills/new-explainer/SKILL.md` | the pipeline (the entrypoint) |
| `docs/market-desk-teardown.md` | the algorithm a complete video reveals (4-layer architecture) |
| `docs/constraint-design.md` | truth-vs-taste; why bad design happens; what's been hardened |
| `docs/sim-block-schemas.md` | authoritative per-block config (field ids, options, outputs) |
| `examples/<video>/annotated/` | 7 golden videos taught scene-by-scene — the few-shot (read the nearest-shaped one before building) |
| `examples/<video>/source/` | the actual golden code (layout/data/_rig/scenes) |
| `src/components/` | the paved road — product-ported components; compose, never invent |
| `src/motion/timing.ts` | the tuned motion vocabulary (`chainAssembly`, `fanAssembly`, run-beat helpers) |
| `CLAUDE.md` | the contract + hard rules + product-truth pointers |

Start a new operator on `CLAUDE.md` → this file → one full `examples/` walkthrough
(read `market-desk` end to end: critique-style annotations + source together). That's
the first hour.
