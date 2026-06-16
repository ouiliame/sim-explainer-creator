# module-7-logs v2 — demo corpus

The v2 take (`module-7-logs-v2`) shows **no invented data**. Its single
source of truth is the real beaming-polaris run artifact that already lives
in this repo:

- `src/videos/module-5-agents/demo-corpus/triage-run.md`

Values used (all real, from that file):

| On screen                         | Source line                                  |
| --------------------------------- | -------------------------------------------- |
| Log durations 32ms / 12.2s / 115ms / 111ms | Run log table (Triage 12225ms → "12.2s") |
| content "billing — Alex Johnson charged twice…" | Triage output bundle (module-5's condensation) |
| tokens 5074 / 431                 | Triage output bundle                         |
| toolCalls 375ms·1 account / 457ms·0 results / 540ms·0 results | toolCalls list |
| Run input message                 | "Run input" section (verbatim)               |
| Block configs (message field, Classify prompt, model, tools, support_tickets, `<buildRow.result>`) | "Workflow as built" section |

Noted condensations (described facts, not inventions — see script-v2.md):

- BuildRow's Code row reads `return { message, category, … }` — the corpus
  describes the function as assembling exactly `{ message, category,
  summary, created_at }`; the literal source text is ⟨pending⟩.
- BuildRow's result preview `{ category: "billing", … }` — category value is
  real; `created_at`'s literal is ⟨pending⟩ and never shown.
- ⟨pending⟩: a real *failed* run of this workflow would unlock a
  failure-debug coda. Not built; nothing was invented in its place.
