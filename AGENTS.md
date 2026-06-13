# Agent guide (Codex / non-Claude agents start here)

This is the **sim-explainer-creator harness** — a cold-boot system for
generating Sim explainer videos with whatever model you are. The authoritative
contract is **`CLAUDE.md`**; read it in full first. Everything in it applies to
you regardless of harness.

The two load-bearing ideas (full rationale in CLAUDE.md):

1. **Port, don't design.** Compose ONLY from `src/components/` (the paved road)
   with values grounded in `_reference/sim`. Never hand-draw a block, panel, or
   chart — inventing surface UI is the #1 failure mode of every model on this
   task. If it doesn't exist in `src/components/`, port it verbatim from the
   product source; never compose from scratch.
2. **Inject, don't scan.** Quality lives in uncompressed context. Work from the
   compiled few-shot pack (the golden scene code + traces + verdicts), not a
   rough scan of the repo — scanning inherits the lossy summary.

Non-negotiables:

- **Bun only** (`bun install`, `bun run dev`, `bun run lint`); CLI is
  `remotionb`, never "fix" it to `remotion`.
- **Five motion primitives**, frame-derived everything, one set piece +
  `layout.ts` continuity, state via product rings (never words), outputs only in
  real surfaces, agent-behavior beats use the `ChatPanel` interior.
- **Verify before declaring done**: `bun scripts/verify-boundaries.ts <comp>`
  (boundaries pixel-identical) and actually LOOK at rendered stills.
- **Never invent on-screen values.** Ground every value in the block registry,
  the docs' authored examples, or a real run artifact; mark gaps ⟨pending⟩ and
  keep them off screen.
- **Narration is the director's register** — load-bearing prose that explains
  what's on screen; never trailer voice, never amputated fragments, never
  "not-X-but-Y" reversals. See `VOICEOVER.md` + the narration skill.

Product truth is the submodule at `_reference/sim`
(`git submodule update --init --depth 1 _reference/sim`). Re-derive
colors/metrics from it every build; the registry wins on conflicts.

The generation *method* (concept → grammar → layout → choreography) is being
reconstructed from agent traces — see CLAUDE.md §"THE ALGORITHM". Until the
skills land, the hard rules above plus the component library are the floor.
