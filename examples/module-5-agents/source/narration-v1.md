# Module 5 — Agents v3 — narration v1

DRAFT narration for `module-5-agents-v3`. Massage freely — edit the prose
under each header, then re-run:

    bun scripts/vo-sync.ts --comp module-5-agents-v3 --narration src/videos/module-5-agents/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change.

## 1. a-normal-workflow — min 7s

Here's a normal workflow: a customer message comes in, a function routes it with a rule, and the result posts to Slack.

## 2. add-the-agent — min 7s

Swap in an Agent block, and now this step can think.

## 3. inside-the-agent — min 24s

Thinking means an LLM call — a fresh chat with Claude, spawned inside your workflow. The Messages row is that chat's first message, with the customer's words filled in. The agent thinks, calls the tools you gave it — the CRM, your docs — writes its reply, and the reply flows on to Slack.

## 4. the-run-record — min 8s

The run records all of it: every step, every tool call it made, and every token it used.

## 5. whats-ahead — min 8s

And you can hand an agent more than tools — whole workflows it can call, and skills that shape how it works. Those are coming up later in the series.

## 6. still-a-workflow — min 6s

And after all of that, it's still just a workflow — blocks, wires, and one step that thinks.
