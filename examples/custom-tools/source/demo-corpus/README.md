# demo-corpus — custom-tools video

What grounds every value on screen, and where it came from.

| File | Grounds | Provenance |
| --- | --- | --- |
| `get-weather-tool.md` | Everything inside the editor panel (schema JSON, code JS, chrome strings) + the Weather chip | docs `tools/custom-tools.mdx` verbatim + product modal/emcn sources |
| `../../module-5-agents/demo-corpus/triage-run.md` | The chain (blocks, rows, chips), the run input, the resolved category, the customerLookup call the CRM chip ring stands for | Real beaming-polaris run, 2026-06-10 |

Demo flows supported:

1. **Opening run replay** (scene 1) — the real triage run compressed:
   input "I was charged twice" → Triage live, CRM chip rings
   (= the real `customerLookup` call) → "billing — double charge"
   resolves into Slack. Same condensations as module-5 v3.
2. **Authoring flow** (scenes 2–4) — Create Agent Tool → Schema tab
   (get_weather) → Code tab → Save Tool. Docs' creation flow, docs'
   authored example.
3. **Closing run** (scene 5) — the chain runs green with four chips on
   the table; only CRM rings (matches the real run's tool choice; the
   new Weather chip staying quiet is the "model decides relevance" beat).

⟨pending⟩ — live artifact request (`templates/artifact-request.md`) for a
run that actually calls `get_weather`: would supply real durations/output
for a future run-record beat. Nothing currently on screen depends on it.
