# Grounding — agent-economy v1

Product commit grounded against: `_reference/sim` checkout present at build
time (staging snapshot, 2026-06; `apps/docs/content/docs/en/workflows/
deployment/mcp.mdx` + `apps/docs/content/docs/en/agents/mcp.mdx` both
present).

## Product-source truths (verbatim provenance)

| On-screen thing | Source |
| --- | --- |
| MCP server URL shape `sim.ai/api/mcp/serve/…` | `apps/sim/app/workspace/[workspaceId]/settings/components/workflow-mcp-servers/workflow-mcp-servers.tsx:131` — `${getBaseUrl()}/api/mcp/serve/${serverId}`; docs screenshot `mcp-server-details.png` shows `https://www.sim.ai/api/mcp/serve/<uuid>` |
| Client list + order: Cursor, Claude Code, Claude Desktop, VS Code, Sim | the MCP Client ButtonGroup in `workflow-mcp-servers.tsx` (`McpClientType`), confirmed by `mcp-server-details.png` |
| Tool name `research_competitor` (lowercase + underscores) | naming rule in `workflows/deployment/mcp.mdx` ("Use lowercase letters, numbers, and underscores", e.g. `search_documents`); deploy modal screenshot `mcp-deploy-modal.png` (`example_mcp_workflow`) |
| Deploy modal tabs General/API/MCP/A2A/Chat | `mcp-deploy-modal.png` (off screen — context only) |
| MCP tool chip color `#6366F1` + MCP glyph | `tool-input.tsx:1416` (`mcpTool.bgColor || '#6366F1'`, `McpIcon`); glyph path ported from `apps/sim/components/icons.tsx` `McpIcon` |
| MCP tools appear in the Agent block's Tools dropdown (`web_search_exa` style names) | `agents/mcp.mdx` + `mcp-agent-tools.png` |
| Entry morph Start `#2FB3FF` → API `#2F55FF` | block registry (`starter.ts`, `api_trigger.ts`) — same morph the accepted module-6 v2 ships |
| Agent `#33C482`, Response `#2F55FF` family, wire `#454545` | `src/components/SimBlock.tsx` BLOCK_COLORS, re-checked against registry this build |
| Sim client badge chip `#33C482` + Sim glyph | `blocks/blocks/sim_workspace_event.ts` (`bgColor: '#33C482'`, `SimTriggerIcon`); glyph path ported from `icons.tsx` `SimTriggerIcon` |
| Anthropic mark (Claude Desktop / Claude Code badges) | path ported from `apps/sim/components/icons.tsx` `AnthropicIcon`; chip `#D97757` is Anthropic's brand clay (NOT in product CSS — declared deviation) |
| Cursor mark | ported from `icons.tsx` `CursorIcon`; chip `#000000` (Cursor brand; product renders it `currentColor` on dark) |
| VS Code mark | NOT drawn by the product (text-only button in the client picker); ported the standard VS Code ribbon mark, chip `#007ACC` — declared deviation |
| Green live dot on the address pill | deploy modal's live-version marker (same as module-6 v2) |
| "Workflows execute using the same deployment version as API calls" | `workflows/deployment/mcp.mdx` How It Works — justifies reusing the module-6 run grammar unchanged |

## Demo-corpus inventions (no live workspace — batch mode)

Fictional companies/queries, invented for this video (same status as the
KB video's dummy corpus). None of them are real run outputs:

- Workflow: **Scout** — a competitor-research agent.
  Chain: Start → Agent "Scout" (Model `claude-sonnet-4-6`, Messages
  `Research <start.input>`, tools: Search, Docs) → Response
  (`{ "brief": <scout.content> }`, Status 200).
- Tool name: `research_competitor`. Server: yours. Partner tool:
  `pricing_intel` on a partner team's server (another Sim workspace).
- Inputs used by runs (all fictional companies), with the short brief
  string that resolves inside the Response Data template:
  - editor run: `Vantra Labs` → `"AI infra, Series B"`
  - Claude Desktop: `Northwind AI` → `"agent platform"`
  - Cursor: `Helio Robotics` → `"warehouse robots"`
  - Claude Code: `Quartzline` → `"data tooling"`
  - VS Code: `Parcelio` → `"logistics API"`
  - Sim (another workspace): `Lumora Grid` → `"energy AI"`
  - scene-5 editor run: `Octave Systems` → `"voice agents"`
  - bookend (Claude Code): `Drift Harbor` → `"dev platform"`

## ⟨pending⟩ / off screen

- Real server UUID → elided as `…` in the pill (module-6 precedent).
- Run-record numbers (durations/tokens/cost) → no record-panel scene in
  this cut; nothing shown.
- Live workspace artifacts → `artifact-request.md` written, unsent.
