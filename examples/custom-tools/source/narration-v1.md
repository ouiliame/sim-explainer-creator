# Custom tools — narration v1

DRAFT narration (generated; brief-and-condensed per the director's spec).
Massage freely — edit the prose under each header, then re-run:

    bun scripts/vo-sync.ts --comp custom-tools-v1 --narration src/videos/custom-tools/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change.

## 1. a-tool-in-action — min 10s

Agents act through tools — and this CRM chip is a custom one: a tool somebody on your team wrote. Let's look at how you'd build it.

## 2. the-schema — min 11s

A custom tool has two parts. The first is the schema — the only part the model ever reads. It gives the tool a name, says what it does, and lists the parameters it needs.

## 3. the-code — min 12s

The second part is the code, which runs every time the agent calls the tool. The parameters arrive as variables, secrets arrive as placeholders, and whatever the code returns is what the agent sees.

## 4. onto-the-table — min 8s

Save the tool, and it lands on the agent's tool line — a chip like any built-in.

## 5. the-agent-decides — min 8s

From there, the model decides which tool each message needs. And the whole thing is still just a workflow — with an agent that now has your tool.
