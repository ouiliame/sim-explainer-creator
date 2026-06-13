# Artifact request — agent-economy (UNSENT — batch mode)

> **Context:** I'm producing the Agent Economy explainer (deploy-as-MCP +
> consuming MCP tools) for the Sim series. I need a canonical demo
> workflow whose real structure, real MCP server, and real run output I'll
> mirror in the animation.
>
> **Build this workflow** (name it `scout`):
> 1. Start trigger with one input field: `company` (string).
> 2. Agent block "Scout" — model `claude-sonnet-4-6`, system prompt
>    "Research the company named in the input and produce a short
>    competitive brief", tools: a Knowledge search over any existing KB +
>    Exa web search.
> 3. Response block returning `{ "brief": <scout.content> }`.
>
> **Then:**
> 1. Deploy it, open Deploy → MCP, name the tool `research_competitor`,
>    add it to a server named `scout-tools` (API-key access).
> 2. From Settings → MCP Servers → Details, copy the exact server URL and
>    the client list as rendered.
> 3. Call the tool once from Claude Desktop (or `claude mcp add` +
>    Claude Code) with `company: "any real test value"`.
> 4. Separately: in Settings → MCP Tools, add ANY external MCP server and
>    attach one of its tools to Scout's toolbar; run once so the tool-call
>    appears in the run record.
>
> **Give me back:**
> 1. The block list exactly as built (names, visible config rows, tools).
> 2. The MCP server Details view values (server name, URL, access mode).
> 3. The full output bundle of the MCP-initiated run (content, model,
>    tokens, toolCalls with durations) and the run log.
> 4. The Agent block's Tools row as rendered once the external MCP tool is
>    attached (chip label + glyph).
> 5. Anything surprising (param mapping quirks, latency, auth failures).

Status: UNSENT (no director / live workspace in batch mode). Values this
would fill are off screen or elided in v1; swap cost when it lands: pill
UUID + run-record scene could be added without re-choreography.
