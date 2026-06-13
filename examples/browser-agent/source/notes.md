# Browser Agent — "The Agent With Hands" — notes

STATUS: delivered — lint clean; verify-boundaries 6/6 IDENTICAL (before AND after VO re-timing); VO synced (7 scenes, 82.4s); stills of every scene + the fold opened and checked; rendered to /tmp/hype-reel/browser-agent.mp4 (h264 crf18, with VO + music); committed locally, NOT pushed.

## Director's mandate (batch mode — no live gates)

Hype-reel showpiece. Prior explainers were called BORING. Subject: the agent
that doesn't just answer — it DOES: drives the web, clicks, scrapes, reads.
In Sim: an Agent block with real browser/web tools executing one multi-step
research task, every tool call streaming evidence back. MONEY SHOT: the
evidence filmstrip filling up beside the chain as the agent works.
Comp id `browser-agent-v1`. Ground every tool in the staging registry —
never invent a tool.

## Impressions / product truth sweep (2026-06-11, _reference/sim staging)

The registry is unexpectedly rich here — this video barely needs invention:

- **The tools are real.** `apps/sim/blocks/blocks/`: `browser_use.ts`
  (Browser Use, #181C1E, "Run browser automation tasks", task/startUrl/
  model/maxSteps, outputs id/success/output/steps/liveUrl/shareUrl),
  `firecrawl.ts` (Firecrawl, #181C1E, "Scrape, search, crawl, map, and
  extract web data"), `exa.ts` (Exa, #1F40ED, "Search with Exa AI"),
  plus tavily/jina/serper/stagehand. Real browser-use is NOT thin —
  Browser Use is a first-class block with a live session URL.
- **The product authors the exact use case.** firecrawl.ts templates:
  *"Firecrawl + Exa research stack — Create an agent that uses Exa to find
  authoritative URLs on a topic, scrapes each with Firecrawl, and produces
  a structured research brief with citations."* And browser_use.ts
  templates: *"Browser Use competitor pricing scraper — navigate competitor
  pricing pages, captures the current plans and prices."* Its skill
  `extract-structured-data-from-site` authors the literal task: *"go to
  the pricing page and collect every plan name and monthly price."*
- **Agent-with-tools is the blessed shape.** agent.ts: "Prefer using
  integrations as tools within the agent block over separate integration
  blocks." Docs BUILD_AGENT_WORKFLOW (examples.ts:1590) draws it:
  Start {Input: Lead} → agent {Messages: Score <start.input>, Model:
  claude-sonnet-4-6} + tool chips → Response {Data: {"score": <agent.score>}}.

## The conceptual job

Viewers know agents that answer (module-5). The step this video teaches:
**an agent's tool calls can act on the live web** — find pages, read them,
and when there's no API at all, drive a real browser like a person — and
**every call comes back as evidence** the rest of the workflow can use.

One idea, one sentence: *give the agent web tools and one prompt, and it
works the web for you — search, read, click — leaving a trail of captured
results.*

## What needs explaining (strong lines)

- The toolbelt is an escalation ladder: Exa finds → Firecrawl reads →
  Browser Use acts. Three chips, three reaches.
- One run, many calls: the agent loops tools inside a single traversal —
  the live ring holds while calls accumulate.
- Evidence is a thing: each call's result is captured, kept, and cited —
  the filmstrip IS `toolCalls` made visible.
- Browser Use is an agent inside the agent: a real session you can watch
  (the block literally outputs a liveUrl).

## Deliberately not taught

Credentials/API keys, Variables(Secrets), allowed domains, max steps,
structured-output schemas, Stagehand, scheduling the run, Slack delivery,
diff-against-last-week, cost/tokens, the run-record panel (module-5 owns
it; a record-panel beat here would dilute the filmstrip's closing frame).

## Friction / risks

- No real run artifact exists (batch mode): no real URLs, plan names,
  prices, brief text. Resolution: ALL captured content renders as the
  house skeleton-line language (ChunkCard precedent) — shapes, never
  words. Values stay ⟨pending⟩ and OFF SCREEN. The narration carries the
  example's meaning.
- Firecrawl + Browser Use chips are both #181C1E (registry truth) — they
  distinguish by glyph (multicolor flame vs white pinwheel mark).
- A browser viewport mid-video is a new surface: kept dark-world, chrome
  minimal (traffic lights + URL pill), and it must FOLD INTO the filmstrip
  slot (zoom-through reverse) so it exits as evidence, not scaffolding.

## Beats (blessed-by-assumption, batch mode)

1. The task exists — assemble the docs-shaped chain.
2. The toolbelt — three chips grow in: find / read / act.
3. The run begins — input read, agent live, first call: Exa finds sources.
4. Reading — Firecrawl captures two pages, rhythm accelerating.
5. Hands — Browser Use opens a real session: navigate, click, capture.
6. The return — evidence pulses in order, the brief reference resolves out.
7. Bookend — chain settles green; the full filmstrip holds the frame.
