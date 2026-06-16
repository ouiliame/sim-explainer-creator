# Custom tools — narration sheet (v1)

<!-- Handoff for VO recording. No narration lines drafted — beat intents
only; the words are the director's layer. Built batch-mode: no anchor
phrases were coined for this topic, so every Anchor row is omitted. -->

Total runtime: 49s. Scene boundaries are hard cuts at the listed times.
Visuals are authoritative: re-time VO to the picture, not the reverse.

## 1. a-tool-in-action — 0:00–0:10

- **Beat intent:** your agent acts through its tools — this is the Triage
  workflow you watched in the agents video, and that CRM chip lighting up
  is the customerLookup call. Tools aren't a fixed catalog: that one was
  written by someone on this workspace. This video is what writing one is.
- **Key moments:** t≈0.5–2.0 chain assembles; t≈2.8 "I was charged twice"
  resolves into Start; t≈3.9 Triage live ring; t≈4.3–6.0 CRM chip rings;
  t≈7.0 "billing — double charge" resolves into Slack; t≈8.4 full revert.
- **Room:** t≈8.4–10.0 the chain holds at rest.

## 2. the-schema — 0:10–0:21

- **Beat intent:** part one of a custom tool is the schema — the only
  thing the model ever reads: what the tool is called, what it does, what
  it needs. This is how the agent knows the tool exists and when to reach
  for it. (Setting: workspace settings → the Create Agent Tool editor.)
- **Key moments:** t≈0.3–1.2 world dims, editor rises (Schema tab);
  t≈1.4–2.8 the get_weather schema reveals; selection washes: name
  t≈3.4–5.2, description t≈5.4–7.2, city t≈7.4–9.0, units t≈9.0–10.6.
- **Room:** t≈2.8–3.4 (schema fully visible, nothing highlighted) and
  t≈10.6–11.0.

## 3. the-code — 0:21–0:33

- **Beat intent:** part two is the code — a JavaScript function body that
  runs when the agent calls the tool. The schema's parameters just exist
  as variables (city, units — note the badges and the blue tokens
  agreeing); secrets come in as {{KEY}}; whatever you return is what the
  agent sees as the tool's output.
- **Key moments:** t≈0.6–1.4 tab slides to Code; t≈1.5–2.7 code reveals;
  city badge + ${city} wash in sync t≈3.5–5.3; units t≈5.5–7.1;
  {{OPENWEATHER_API_KEY}} t≈7.7–9.5; the return block t≈9.9–11.7.
- **Room:** t≈2.7–3.5.

## 4. onto-the-table — 0:33–0:41

- **Beat intent:** save it, and it's on the table — for this agent and any
  Agent block in the workspace. To the block, your tool is just another
  chip.
- **Key moments:** t≈0.5–1.1 Save Tool dips; t≈1.3–2.1 editor leaves;
  t≈1.7–2.5 world undims; t≈3.1–4.0 the Weather chip grows onto the tool
  line; t≈4.0–5.5 its selection pulse.
- **Room:** t≈5.5–8.0 the four-chip block holds.

## 5. the-agent-decides — 0:41–0:49

- **Beat intent:** at run time the model decides which tool the message
  needs — this run reaches for the CRM lookup; the new tool sits quiet
  until a message needs it. Same rule as every built-in. And after all of
  it: still just a workflow.
- **Key moments:** t≈1.0 pulse leaves Start; t≈1.7–3.0 Triage live, CRM
  chip rings t≈1.9–3.0; t≈3.0–3.8 blocks settle green in causal order;
  t≈3.2–5.4 camera eases back.
- **Room:** t≈5.4–8.0 the settled green frame holds.
