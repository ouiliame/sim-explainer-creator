# model-pairs — the same topic, built badly and built well

Four topics each built twice: `pre/` = the hype2 take (claude-opus-4-8,
rejected for visual quality), `post/` = the hype3 take (claude-fable-5
under the still gate, accepted). Same repo, same skills, days apart. The
director's grading was explicit: **the badness is visual — layout,
component choice, framing — not narration.** These pairs are the
calibration set for that distinction.

Full analysis: `.agents/skills/sim-explainer-craft/references/model-resilience.md`.
Verdict history: `examples/HYPE-REEL-VERDICTS.md`.

## The three deltas (measured, not vibes)

A code census across the pairs found the bad and good takes differ on
exactly three axes — and almost nothing else (similar LOC, similar
component counts):

1. **Surface choice.** Every `pre/` invents its display surface —
   voice-agent built `OutcomeTable` (a custom table) while `SimTable` sat
   in the library; recruiter floated a candidate list OVER the canvas;
   inbox drew an email client. Every `post/` shows data in the real
   `SimTable` (4–13 references each; the pres have 0) and keeps asides in
   the established grammar as separate boxes.
2. **Camera discipline.** The pres have ZERO camera definitions
   (voice/recruiter: 0 `CAM_*`/`cameraTo` references) — geometry was
   placed ad hoc per scene, so when content didn't fit, it got cropped,
   cut in two, or stacked into containers. The posts define named camera
   framings over ONE fixed layout (35–59 cam references; recruiter: 90
   named layout constants vs the pre's 30) and move a continuous camera.
3. **Containment honesty.** Pres draw N lanes/panels INSIDE Parallel
   containers (voice stuffed three call panels in one); posts draw ONE
   lane and fan at runtime only.

The exception proves the rule: the Opus market-desk (`pre/`) was already
SimTable-heavy and camera-disciplined (54 cam refs) — and it was the one
hype2 take the director graded closest to good. Quality tracks these
three disciplines, not the model name and not effort.

## How to use this set

When building any video with a data display: read one `pre/` to recognize
the failure shape, then the matching `post/`'s `layout.ts` + `_rig.tsx`
to copy the structure — fixed geometry in layout.ts, named CAM_* framings,
shared surfaces only, one-lane containers. The vocabulary scanner
(`bun scripts/lint-vocabulary.ts`) flags axis 1 mechanically; the Phase-A
still gate (one still per camera framing) catches axes 2–3.
