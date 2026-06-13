# outbound-machine — notes

STATUS: PHASE B COMPLETE — animated, narrated, verified, rendered

Hype 3. Comp `outbound-machine-v1`. Branch `hype3/outbound-machine`.
Built batch-mode under the hype-3 hard constraints (one real workflow,
left→right, real registry blocks, allowed surfaces only, one inner lane,
spectacle = the run). growth-machine (hype-2's one good take) is the
graded exemplar this take rebuilds on stricter truth. Model:
claude-fable-5 (both phases).

## Phase A delivered

- Locked scene list + grounding + assumptions + continuity contract:
  `script-v1.md` (8 scenes, 80s authored, run count 1).
- `layout.ts` — one set piece: the `outbound` SimTable (top band) over
  the chain Apollo → Enrich (Parallel container, ONE inner lane: Data
  Enrichment → Personalize → Instantly) → Table (Batch Insert Rows).
- Static posters (superseded by Phase B scenes; their states live on as
  each scene's enter/exit per the continuity contract).
- `SimTable` extended (shared component): `colWidths` / `wrapCols` /
  `rowOpacity`. Stills reviewed; CAM_LANE fixed to crop on wires.

## Phase B delivered (2026-06-12)

- 8 animated scenes (`scenes/The*.tsx` + `OneLaneOneLeadScene` /
  `WiredByReferenceScene`), each starting/ending on the poster states.
  ONE run spans scenes 4→7 through freeze-cuts. Grammar: WirePulse on
  the outer wires, loops' PathPulse on the curved fan wires,
  ResolvedTag (`<parallel.currentItem>` → `[Northwind]` in scene 4,
  `<enrich.contact>` → `[Priya Nair]` in scene 5 — split into itemTag /
  contactTag so each resolves at its own scene's beat), the runtime
  fan-out/fold, and the row-landing cascade (chrome fades in, cells
  sweep left→right, green pulse decaying to the status residue).
- Rig additions: `colIn` (scene 1's header assembling left→right via
  SimTable's existing colOpacity) and `paneSel` (the product's range
  treatment drawn over the EMPTY pane, since un-landed rows are
  invisible pane). Posters.tsx removed.
- Narration `narration-v1.md` (gold register, calibrated on the 3 gold
  artifacts); vo-sync (voice M5lSFiV8wa1aYNbadPOy, multilingual_v2)
  re-timed 80s → 146.6s extend-only.
- Gates: `bun run lint` clean; `bun scripts/lint-vocabulary.ts
  src/videos/outbound-machine` clean (2 vocab-ok annotations:
  EnrichContainer = docs preview-container-node port, EnrichConfigCard
  = loops ConfigCard aside grammar); `verify-boundaries
  outbound-machine-v1` all 7 pairs IDENTICAL (before AND after VO
  re-timing); 15 key-beat stills rendered and reviewed
  (/tmp/hype3-stills/s*.png).
- Render: /tmp/hype3/outbound.mp4 (1080p, crf 18, h264, with VO +
  music bed).

## The hype-3 truth fix (vs growth-machine)

The table fill is now MECHANICAL: the chain ends in a real Table block
(`table.ts`, #10B981) doing `Batch Insert Rows` of `<parallel.results>`
(the docs' own after-the-parallel aggregation pattern). Therefore the
table opens EMPTY and six record rows LAND during the write-back beat
(scene 7, the money shot) in result order — growth-machine's pre-seeded
queue filled with no block writing it. Every cell that fills on screen
is a write the workflow actually performs.
