# The Agent Economy — narration v1

DRAFT narration in the house register (clean condensed prose, energetic
pace for the hype cut). Massage the prose under each header, then re-run:

    bun scripts/vo-sync.ts --comp agent-economy-v1 --narration src/videos/agent-economy/narration-v1.md --voice M5lSFiV8wa1aYNbadPOy

Audio and scene timing both update; unchanged scenes are cached. "min Xs"
is the scene's authored visual minimum — leave it unless the visuals change.

## 1. an-agent-you-built — min 9s

This is Scout, an agent built in Sim. It researches a company with its
tools and returns a brief.

## 2. deploy-as-a-tool — min 10s

So far, it runs when you run it. Deployed as an MCP tool, it gets a tool
name on a server URL — the chain itself doesn't change.

## 3. a-stranger-calls — min 11s

Then an agent you've never met calls it from Claude Desktop. The call
lands on the input row, the chain runs, and the brief returns to the
caller.

## 4. the-rush — min 15s

And one caller becomes five. Cursor, Claude Code, VS Code, even another
Sim workspace can add your server — and every call they make is an
ordinary run of your workflow.

## 5. you-call-theirs — min 12s

The protocol also runs the other way. Another team deployed their agent
as a tool, and mid-run, Scout calls their workflow and uses the answer in
its brief.

## 6. the-agent-economy — min 11s

That's the agent economy: your workflow serves agents you've never met,
and your agents use theirs. Every workflow you deploy becomes a tool
other agents can build on.
