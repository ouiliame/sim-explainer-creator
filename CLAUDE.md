# sim-explainer-creator — the generation harness

This is **not** a video library. It is a cold-boot **harness** whose job is to
make a non-Fable model (Opus, Sonnet, Codex, whatever ships next) generate Sim
explainer videos at the quality a stronger model produced under dense human
refinement. The videos are output; **the harness is the product.**

Bun runtime. Remotion renderer. 1920×1080 @ 60fps.

> Provenance: extracted from `~/projects/sim-explainers` (the original build
> repo — ~60 director-graded videos, the canon). That repo is the DATA; this
> repo is the SYSTEM, rebuilt to be model-portable.

## The two theses this harness is built on

Everything here follows from two findings, learned the hard way:

1. **Port, don't design — collapse the degrees of freedom.** Every rejected
   video was *designed* (invented UI, invented colors, invented demo data).
   Every accepted one was *ported* (the product's own components, the product's
   own example workflows, the product's own state language) with motion as the
   only original layer. Weaker models fail by *inventing surface UI* when handed
   freedom; they succeed when the only move available is *look it up and
   compose*. So the harness's #1 job is to make lookup the path of least
   resistance and invention nearly impossible. The component library
   (`src/components/`) is that paved road. **If you find yourself hand-drawing a
   block, a panel, or a chart — stop. It already exists, or it must be ported
   from `_reference/sim`, never composed from scratch.**

2. **Inject, don't scan — quality lives in *uncompressed* context.** The
   original videos were good because the *entire refinement conversation* stayed
   live in-context: every "no, like this" was present as the agent worked.
   Quality dips the moment that context is compressed into a summary — and a
   thin SKILL full of rules IS that lossy summary. So the unit of knowledge
   transfer here is **the compiled context pack**: the actual golden scene code
   + the actual decision traces + the actual director verdicts, injected whole
   at generation time. An agent that "lands in the repo and does a rough scan"
   under-reads and inherits the compressed version — the exact dip. Preload the
   texture; never make the agent retrieve it.

## How to use this harness (the loop)

1. **Boot with the compiled context pack**, not a repo scan. (Pack assembly:
   `scripts/compile-context.ts` — TODO, see §Algorithm.)
2. **Generate** against a locked visual script, composing ONLY from
   `src/components/` + values grounded in `_reference/sim`.
3. **Verify mechanically**: `bun scripts/verify-boundaries.ts <comp>` (scene
   boundaries pixel-identical) + `bun scripts/lint-vocabulary.ts <path>`
   (invented-UI scanner) + `bun run lint`.
4. **Critique** against the director's recorded taste (the synthetic critic —
   TODO, seeded from `examples/` verdicts + the case studies).
5. **Narrate last** (VO is load-bearing; `VOICEOVER.md`), then render.

## Hard rules (non-negotiable, model-independent)

- **Five motion primitives** (`FadeIn`, `SlideIn`, `Highlight`, `Zoom`,
  `Expand`) or raw `interpolate`/`spring` with theme `EASING` curves. No CSS
  transitions, no Tailwind `animate-*` — they don't render.
- **Frame-derived everything.** Every animated value flows from
  `useCurrentFrame()` through `interpolate()`/`spring()`. No `setTimeout`, no
  `useState` for animation.
- **One set piece per video**, geometry owned by a per-video `layout.ts`; scenes
  differ in *state props*, never re-layout. Continuity becomes structural, not
  audited.
- **Values live in rows, wires carry light.** Inputs/outputs resolve inside
  block rows (`ResolvedTag`/`DipSwap`); the only thing that travels a wire is a
  `WirePulse`. Never attach cargo to a wire.
- **State is the product's language** — blue ring = live/selected, green = ok,
  red/✗ = failed, 0.35 dim = not focal, chip ring = tool called. **Never a
  state word on screen.**
- **Outputs appear only in real surfaces** — the `OutputBundle` inspector tree
  (aside panel), a downstream-row resolution, or the tag dropdown. Never as
  free-floating chips/pills/badges on the canvas. (Borrowed badge tokens don't
  make a new surface real.)
- **Agent behavior requires the chat interior** — any beat whose lesson is the
  agent *deciding / calling a tool / producing output* shows `ChatPanel` beside
  the dimmed block: user message → thinking → tool-call rows synced same-frame
  to the chip rings → result → assistant bubble. Synchrony carries the link;
  never connector lines.
- **Render and actually look.** You cannot judge animation from code. Render
  stills at every beat and every boundary, open them, fix by measuring rendered
  pixels.

## Product truth — `_reference/sim` (git submodule)

The #1 rule needs the product's source. It is a **submodule** at
`_reference/sim` (pinned commit = the product truth you grounded against —
record it in every script). Re-derive colors/metrics from it at the start of
every build; the product drifts.

- Teaching components: `_reference/sim/apps/docs/components/workflow-preview/`
  (authored example workflows in `examples.ts` — canonical demo content).
- Block registry (authoritative colors/titles/outputs):
  `apps/sim/blocks/blocks/*.ts`. The registry wins over docs on conflicts.
- The agents/* docs section + academy live under
  `apps/docs/content/docs/en/`.
- Known drift to carry: Agent chip is `var(--brand-agent)` (#701ffc dark /
  #6f3dfa light), NOT the stale docs green #33C482; Start is `#34B5FF`.

```bash
git submodule update --init --depth 1 _reference/sim   # first checkout
```

## Layout

```
src/
  Root.tsx          # registry — EMPTY until videos are generated
  theme/            # tokens, easings, FPS, seconds() — ported from product CSS
  motion/           # the 5 primitives
  components/       # THE PAVED ROAD — Tier-1 product ports + promoted patterns
  videos/<slug>/    # one folder per generated video (Video.tsx, scenes/, layout.ts, script-v*.md, narration-v*.md, demo-corpus/)
scripts/            # vo-sync, verify-boundaries, lint-vocabulary, gen-music
.agents/skills/     # the generation method (being reconstructed — see below)
examples/           # the compiled few-shot: golden scene source + critiques + traces
_reference/sim/     # product source (submodule)
```

## THE ALGORITHM — under reconstruction (the open work)

The mechanical substrate above is done. The **generation method** — how a cold
agent goes topic → concept flow → scene grammar → layout → choreography →
narration — is being reconstructed by studying the uncompressed agent traces of
the best original builds (`market-desk` #1, `loops`, `module-5`, the KB build)
in the source conversation transcript. Until that lands, treat these as TODO:

- `.agents/skills/new-explainer/` — the pipeline skill (intake → script →
  build → verify → deliver).
- `.agents/skills/sim-explainer-craft/` — the craft rules + scene grammar +
  component library reference + case studies (the rejection history).
- `.agents/skills/narration/` — the gold register + the NEVER list.
- `scripts/compile-context.ts` — assembles the injectable few-shot pack.
- `critic/` — the synthetic director (LLM-judge seeded from recorded verdicts).

The method is mined from traces, not invented. Each piece lands by *showing*
(real golden code + the trace excerpt that produced it), never by *telling*
(abstract rules) — because telling is the lossy summary thesis #2 warns about.

## Conventions

- **Bun only** (`bun install`, `bun run dev`, `bun run lint`). CLI is
  `remotionb`; never "fix" it to `remotion`.
- Tabs for indent. 1920×1080 @ 60fps default.
- Never commit `_reference` contents (it's the submodule) or `out/` (renders).
