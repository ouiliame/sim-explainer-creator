# The Agent Economy — orientation notes

STATUS: delivered — lint clean, boundaries verified (7/7 structural-zero), stills reviewed, VO synced, 4K render at /tmp/hype-reel/agent-economy.mp4

<!-- Batch-mode build (director mandate: hype reel, "existing explainers
were called BORING"). Every gate below is a written assumption — see
script-v1.md "Batch-mode assumptions". -->

## Impressions

Deploy-as-MCP is the moment a Sim workflow stops being *your* automation
and becomes *infrastructure*: a tool with a URL that any MCP client —
Claude Desktop, Claude Code, Cursor, VS Code, another Sim workspace — can
discover and call. The product draws this beautifully: one server URL
(`/api/mcp/serve/<id>`), a client picker with five named clients, a
ready-to-paste config per client. And the same protocol runs the other
direction: Settings → MCP Tools lets YOUR agents consume someone else's
server — their deployed workflow shows up as a chip in your Agent block's
toolbar. Both directions through one protocol is the 2026 story: every
platform converged on agent-to-agent, and Sim ships both ends of the pipe.

## Feedback / Friction

- Viewers who watched module 6 know "deploy gives the chain an address"
  for HTTP and chat — they don't know the MCP tab exists, or that it makes
  the workflow callable *by other agents* rather than by code.
- "MCP" is jargon; the mechanics (server URL, tool name, parameters from
  the input format) are invisible until you find two different settings
  pages (MCP Servers = serving, MCP Tools = consuming).
- The flip is the part nobody holds in their head: the same workspace can
  be a tool *provider* and a tool *consumer* simultaneously. The two
  settings pages never appear side by side in the product.

## Main conceptual job

> Deploy a workflow as an MCP tool and other agents — anyone's agents —
> can call it like a function; the same protocol lets your agent call
> theirs, so agents compose across team and platform boundaries.

Progressively:

1. A workflow you built is an agent that runs when you run it (known —
   module 5/6).
2. Deploying it onto an MCP server gives it a tool name and a URL.
3. MCP clients you don't control start calling it — each call is just a
   run arriving from outside.
4. Many clients can call it; your workflow is now shared infrastructure.
5. The protocol is symmetric: your Agent block can consume someone else's
   deployed workflow as a tool chip.
6. Both directions at once = the agent economy.

## What needs to be explained

### 1. The workflow becomes a named tool with an address

> *Deploy doesn't change the chain — it puts a tool name and a server URL
> on it.*

Show the module-6 deploy morph (Start → API) plus the MCP pill: tool name
`research_competitor` on the server URL. NOT: the settings pages, modal
walkthroughs, auth headers (screen-rec territory).

### 2. A call from a client is just a run

> *Claude Desktop calling your tool looks exactly like every run you've
> ever watched.*

One badge, one pulse in, the same row resolutions, one pulse back.

### 3. The multiplicity (the money shot)

> *You published once; now five different agents treat your workflow as
> infrastructure.*

The product's own client list — Cursor, Claude Code, Claude Desktop,
VS Code, Sim — as off-canvas callers, calls landing in an accelerating
cadence, each badge lighting as its run lands.

### 4. The flip

> *The same protocol points the other way: their deployed agent becomes a
> chip in YOUR agent's toolbar.*

The Agent block's Tools row grows an MCP chip (`pricing_intel`, purple,
the product's MCP glyph); a run rings the chip and a pulse goes out to
their off-canvas server and back.

### 5. Both directions at once

> *Every agent is both a tool and a tool-user.*

Bookend run: a call arrives from a stranger's client; mid-run your agent
calls a stranger's tool; the reply returns. One traversal, both economies.

## Deliberately not taught

- Settings → MCP Servers / MCP Tools UI mechanics → screen-rec intercut +
  docs (`workflows/deployment/mcp.mdx`, `agents/mcp.mdx`).
- Auth (`X-API-Key`, public vs API-key servers) → docs.
- Per-client config snippets (mcp-remote, claude mcp add) → docs.
- A2A tab, chat deployment → module 6 / future video.
- Parameter mapping details (input format fields → tool parameters) →
  one row carries it implicitly; docs for the rest.

## Real-artifact plan

Batch mode: no live workspace available. `demo-corpus/artifact-request.md`
written but UNSENT; run-record values (durations, tokens, costs) stay off
screen entirely — no OutputBundle scene in this cut. All on-screen values
are demo-corpus inventions (fictional companies) or product-source truths
(URL shape, client list, tool-name conventions, block colors) — see
`demo-corpus/grounding-v1.md`.
