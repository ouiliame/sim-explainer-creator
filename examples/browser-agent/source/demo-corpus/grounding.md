# browser-agent — grounding (product truth, staging _reference/sim, 2026-06-11)

Product commit: local `_reference/sim` staging checkout read on 2026-06-11
(the main repo's clone; workflow-preview present = Tier-1 docs truth).

## On-screen elements → sources

| On screen | Source |
| --- | --- |
| Chain shape: Start → agent → Response; row grammar; `<start.input>` in Messages; `{ "key": <ref> }` in Response Data | `apps/docs/components/workflow-preview/examples.ts:1590` (BUILD_AGENT_WORKFLOW) |
| Agent rows Messages / Model, value `claude-sonnet-4-6` | same docs example, verbatim |
| Agent chip color #33C482, start #2FB3FF, response #2F55FF | block registry via `src/components/SimBlock.tsx` BLOCK_COLORS (re-checked) |
| Tools row between rows and chips' wrap behavior | `apps/sim/blocks/blocks/agent.ts:314` (tools subBlock) + SimBlock port |
| Exa chip: name, #1F40ED, lettermark | `apps/sim/blocks/blocks/exa.ts` + `components/icons.tsx:1585` (ExaAIIcon) |
| Firecrawl chip: name, #181C1E, multicolor flame | `apps/sim/blocks/blocks/firecrawl.ts` + `icons.tsx:580` (FirecrawlIcon; multicolor-glyph precedent = Gmail) |
| Browser Use chip: name, #181C1E, white mark | `apps/sim/blocks/blocks/browser_use.ts` + `icons.tsx:2284` (BrowserUseIcon) |
| The agent-with-web-tools framing | firecrawl.ts FirecrawlBlockMeta template "Firecrawl + Exa research stack" ("an agent that uses Exa to find authoritative URLs…, scrapes each with Firecrawl, and produces a structured research brief with citations") |
| Agent-with-tools as the blessed shape | agent.ts longDescription guidance ("Prefer using integrations as tools within the agent block…") |
| The pricing task ("opens the pricing page… collects every plan name and monthly price") | browser_use.ts skill `extract-structured-data-from-site` ("go to the pricing page and collect every plan name and monthly price") + template "Browser Use competitor pricing scraper" |
| The live session viewport | browser_use.ts outputs: `liveUrl` "Embeddable live browser session URL (active during execution)", `shareUrl`, `steps` |
| Search/scrape/act call grammar | firecrawl.ts skill `research-with-search` (Search → Scrape top results → cited brief) |
| `<research.content>` output reference | agent text-output field per module-5 v3 (`<triage.content>`), docs convention `<blockname.field>` |

## Declared deviations

- Agent name "Research", Start input label "Competitor": patterned on docs
  naming ("Score lead" / "Lead"), nouns from registry templates. Not
  doc-verbatim; swappable when a real artifact exists.
- Firecrawl + Browser Use share #181C1E (registry truth) — distinguished
  by glyph only, as in the product.
- No durations, no resolved values anywhere: ⟨pending⟩ real run artifact
  (see artifact-request.md).
