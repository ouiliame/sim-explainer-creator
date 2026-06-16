# demo-corpus — subworkflows-v1

The video shows one parent→child call and its values. This folder holds
the provenance for every one of them:

- `grounding-v1.md` — the value→source table (staging docs + registry +
  series canon), the staging commit, drift notes, and the deviations from
  the docs' own example (each one a recorded batch assumption).
- `artifact-request.md` — the live-workspace request, written but UNSENT
  (batch mode). Its unfillable values are ⟨pending⟩ and never on screen.

Demo flow the corpus supports: parent (Start → Workflow → Agent) receives
"I want a refund"; the Workflow block calls the series `classify-message`
workflow; inside, `<start.input>` resolves to the same message and the
child answers `"billing"`; back outside, `<workflow.result>` resolves to
`"billing"` in the parent Agent's Messages row.
