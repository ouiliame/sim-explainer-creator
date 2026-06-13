# Artifact request — browser-agent (UNSENT — batch mode, no live workspace)

Written per the new-explainer batch protocol and stored unsent. Every value
this would supply is rendered as ⟨pending⟩ (skeleton lines) in the video.

> **Context:** I'm producing the "Agent With Hands" hype-reel explainer
> (browser/web tools on an agent). I need a canonical demo workflow whose
> real structure and real run output I'll mirror, so the captured-evidence
> filmstrip can show real content instead of skeleton lines.
>
> **Build this workflow** (name it `browser-agent`):
> 1. Start trigger with one input field (the research subject — a
>    competitor name).
> 2. Agent block named `Research`: Messages `Research <start.input>`,
>    Model `claude-sonnet-4-6`, system prompt per the registry's
>    "Firecrawl + Exa research stack" template (find authoritative URLs
>    with Exa, scrape each with Firecrawl, produce a structured research
>    brief with citations; use Browser Use for any page that needs
>    interaction — per its `extract-structured-data-from-site` skill,
>    e.g. "go to the pricing page and collect every plan name and monthly
>    price").
> 3. Tools on the agent: Exa, Firecrawl, Browser Use (real keys).
> 4. Response block: Data `{ "brief": <research.content> }`.
>
> **Then run it once** with a real competitor as input.
>
> **Give me back:**
> 1. The block list exactly as built (names, visible config rows, tool
>    lists as the canvas shows them).
> 2. The agent's full output bundle: content (the brief), model, tokens,
>    and toolCalls — for EACH call: tool name, args (query/url/task),
>    result preview (top search hits; first lines of scraped markdown;
>    Browser Use steps + structured output + shareUrl), duration.
> 3. The run log (block name + duration + status).
> 4. The Browser Use session share URL — I want to see what the live
>    session view showed while it clicked.
> 5. Anything that surprised you (a scrape that failed, a retry, how many
>    steps the browser task took) — surprises are the most teachable data.

## Values currently ⟨pending⟩ (and how they render meanwhile)

| Value | Renders as |
| --- | --- |
| Search result titles/URLs (Exa) | favicon-dot + skeleton-line rows |
| Scraped page text (Firecrawl ×2) | title-bar + paragraph skeleton |
| Pricing page content (Browser Use) | wireframe plan cards, no text |
| Plan names / prices | glow-capture beats only |
| The brief text (`<research.content>`) | tag glows, never substitutes |
| Run durations | omitted everywhere |
