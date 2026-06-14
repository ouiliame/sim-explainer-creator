# sim-explainer-creator

A **clone-and-go harness** that lets a capable coding agent (Opus 4.8 / Sonnet /
Codex) generate **Sim explainer videos** — short, diagrammatic, software-explainer
animations — at the quality a human-refined process produced. The videos are the
output; **the harness is the product.** Bun runtime, Remotion renderer, 1920×1080
@ 60fps.

> If you are the agent: read **`CLAUDE.md`** (the contract + hard rules) and then
> **`.agents/skills/new-explainer/SKILL.md`** (the pipeline). Everything below is
> the human/setup view of the same thing.

---

## Setup (one time)

```bash
git clone <this-repo> sim-explainer-creator && cd sim-explainer-creator
bun run setup                 # inits the _reference/sim submodule + bun install
cp .env.example .env          # then paste an ELEVENLABS_API_KEY for voiceover (optional)
bun run lint                  # sanity: eslint + tsc
bun run dev                   # Remotion Studio at localhost:3000
```

- **`_reference/sim`** is a git submodule — the product's own source, and the single
  source of truth for every block color/value/example. `bun run setup` fetches it.
- **Voiceover is optional.** Without `ELEVENLABS_API_KEY`, skip the narration step;
  the video renders silent and the committed music bed still plays.
- **A fresh clone has no videos** — `src/Root.tsx` is empty by design. You generate
  them.

## Make a video

Point the agent at the pipeline and give it a topic:

> Build a Sim explainer video, slug `<slug>`, topic `<one line>`. Follow
> `.agents/skills/new-explainer/SKILL.md` exactly.

The skill walks: concept → locked visual script → statics (`layout`/`data`/`_rig`) →
motion (thin scenes) → register in `src/Root.tsx` → verify → narrate. Then render:

```bash
bun run render <comp-id>        # 1080p draft
bun run render <comp-id> --4k   # 4K master
```

A video is done when it lints, every scene boundary is pixel-identical
(`bun scripts/verify-boundaries.ts <comp-id>`), you've **looked** at a still of every
scene, and it's a faithful runnable Sim workflow.

## The two rules everything follows from

1. **Port, don't design.** Compose from `src/components/` (product-ported) and ground
   every value in `_reference/sim`. If you're hand-drawing a block/panel/chart, stop —
   it exists, or must be ported, never invented.
2. **Inject, don't scan.** Read the annotated golden examples + the schema doc + the
   nearest exemplar *whole, before building.* The texture is the point.

## What's where

| Path | What it is |
|---|---|
| `CLAUDE.md` | the contract + hard rules (the agent reads this first) |
| `HANDOFF.md` | the operator playbook (parallel fleets, gotchas, the review loop) |
| `.agents/skills/new-explainer/` | **the pipeline** — the entry skill |
| `examples/` | the curated few-shot: golden videos taught scene-by-scene (read the nearest-shaped one before building) |
| `examples/_composition/` | composition craft: the wireframe-vs-scene delta + the "Machine" archetype |
| `docs/sim-block-schemas.md` | authoritative per-block config (field ids, options, outputs) — ground here, never invent |
| `docs/market-desk-teardown.md` · `constraint-design.md` · `design-principles-use-cases.md` | the method, truth-vs-taste, and the use-case "excite" register |
| `src/components/` · `src/motion/timing.ts` | the paved road: ported components + the tuned motion vocabulary |

**First hour:** `CLAUDE.md` → `HANDOFF.md` → read `examples/market-desk/` end to end
(annotations + source together) → make a video.

## Conventions

Bun only (`bun install`, `bun run lint`); the CLI is `remotionb`, never "fix" it to
`remotion`. Tabs for indent. Never commit `.env`, `out/`, or `_reference` contents.
