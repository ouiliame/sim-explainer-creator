# The Agent With Hands — browser/web tools (v1) — hype-reel

Registered as `browser-agent-v1` (new video, no prior take).
Built batch-mode from the director's mandate (hype reel: the agent that
DOES, not just answers; money shot = the evidence filmstrip filling up).

**The one idea:** Give an agent web tools and one prompt, and it goes out
and works the web for you — it searches for the right pages, reads them,
and where there is no API it drives a real browser, clicking like a person
— and every tool call comes back as a captured result the workflow keeps.

**Macro arc:** capability-first (agents v3 lineage) — the chain is normal,
the toolbelt is the change, ONE long run is the demonstration, the full
filmstrip is the closing frame. No manufactured problem.

**Run count: 1.** A single Start→Response traversal spans scenes 3–6 via
held freeze-cuts (the agent's live ring never releases between calls).
Inside it, four tool calls, each justified by a distinct *reach*:
- Call 1 (Exa, scene 3): FIND — search returns sources.
- Calls 2–3 (Firecrawl, scene 4): READ — two pages captured back-to-back
  (two, not one: the repeat at double tempo is what shows "per result",
  matching the registry skill's "for the most relevant results, use
  Scrape").
- Call 4 (Browser Use, scene 5): ACT — a live session navigates and
  clicks where scraping can't. The set-piece beat.
No second run, no recap run — the scene-7 bookend re-pulses the landed
evidence instead of re-traversing.

**Grounding (product truth, re-derived from staging _reference/sim,
2026-06-11):**
- Chain shape + row grammar = the docs' BUILD_AGENT_WORKFLOW verbatim
  pattern (`apps/docs/components/workflow-preview/examples.ts:1590`):
  Start {Input: <label>} → agent {Messages: <verb> <start.input>, Model:
  claude-sonnet-4-6} with tool chips → Response {Data: {"<key>":
  <agent.field>}}. Ours: Start {Input: Competitor} → Research {Messages:
  Research <start.input>, Model: claude-sonnet-4-6} → Response {Data:
  { "brief": <research.content> }}. All ×1.5 per SimBlock convention.
- The agent's toolset = the registry's own "Firecrawl + Exa research
  stack" template (`apps/sim/blocks/blocks/firecrawl.ts` FirecrawlBlockMeta:
  "an agent that uses Exa to find authoritative URLs on a topic, scrapes
  each with Firecrawl, and produces a structured research brief with
  citations") + Browser Use per its own "competitor pricing scraper"
  template and `extract-structured-data-from-site` skill ("go to the
  pricing page and collect every plan name and monthly price").
- Chip identities from the registry: Exa `#1F40ED` (exa.ts), Firecrawl
  `#181C1E` (firecrawl.ts), Browser Use `#181C1E` (browser_use.ts).
  Glyphs ported from `apps/sim/components/icons.tsx` (ExaAIIcon white,
  FirecrawlIcon multicolor flame — like Gmail's multicolor glyph
  precedent — BrowserUseIcon white).
- Agent-with-tools is the product's preferred shape (agent.ts long
  description: "Prefer using integrations as tools within the agent block
  over separate integration blocks").
- Browser Use is genuinely agentic in the product: subBlocks task /
  startUrl / model / maxSteps; outputs include `steps` and a `liveUrl`
  ("Embeddable live browser session URL (active during execution)") — the
  scene-5 viewport is that surface, not an invention.
- Agent output reference `<research.content>` follows module-5 v3's
  `<triage.content>` (same field the docs use for agent text output).

**Declared deviations + assumptions (batch mode — no live gates):**
1. NO real run artifact exists. Every captured value — search-result
   titles/URLs, page text, plan names, prices, the brief text — is
   ⟨pending: real run artifact⟩ and stays OFF SCREEN. All captured content
   renders as the house skeleton-line language (ChunkCard precedent:
   seeded gray bars), so the filmstrip shows the SHAPE of evidence, never
   invented words. Swap cost when a real artifact arrives: restyle four
   card bodies + one resolve beat, no layout change.
2. Block names "Research" (agent) and Start input label "Competitor" are
   patterned on docs naming ("Score lead" / Input: "Lead") with nouns
   taken from the registry templates ("competitor pricing pages",
   "research brief"). Not doc-verbatim blocks — declared, swappable.
3. `<start.input>` and `<research.content>` glow when read but never
   substitute to a value (branching run-C precedent) — no authored values
   exist to resolve to.
4. The scene-5 pricing page is a wireframe ONLY (three plan-card shapes,
   skeleton lines). Its layout is generic-pricing-page shape, justified by
   the registry's authored task ("go to the pricing page and collect every
   plan name and monthly price"); nothing on it is readable.
5. Card count 4 = call count 4. The filmstrip is `toolCalls` made visible;
   no fifth card, no decorative slots.

**Deliberately not taught:** API keys/credentials, Variables (Secrets),
allowed domains / max steps, structured-output schemas, Stagehand,
scheduling, Slack delivery, run-record panel (module-5/7 own it), cost.

## Motion language

Product state language throughout: blue live ring (running), green ok
ring (done), chip ring (tool called), row glow (being read), 0.35 dim
(not focal). Values resolve in rows; wires carry WirePulse light only.
Two video-specific compositions, both from existing grammar:
- **Evidence cards** (house card grammar: surface2/border1/r8 + 16px tool
  chip + seeded skeleton lines). A card BIRTHS in sync with its chip's
  ring (two surfaces, one event — the ResolvedTag discipline) and drops
  into its fixed rail slot with popIn; a brief green ring pulse marks
  capture; cards then never move again.
- **The live session viewport** (scene 5): dark browser chrome (traffic
  lights + skeleton URL pill), wireframe page, an arrow cursor easing
  between targets with a one-ring click ripple; captured regions glow
  selection-blue then settle green. The viewport exits by FOLDING INTO
  rail slot 4 (zoom-through reverse) — the session becomes its own
  evidence card.

## Locked scene list (~69s visual minimum)

1. **the-task** (~8s) — [assemble]
   Canvas dots on bg, empty. The chain assembles in docs-preview order:
   Start {Input: Competitor} fades in → edge draws → Research (agent
   green, AgentGlyph) with {Messages: Research <start.input>, Model:
   claude-sonnet-4-6} → edge draws → Response {Data: { "brief":
   <research.content> }}. The Messages tag glows once and releases (it's
   a reference). Hold the balanced three-block frame.
   *Beat intent: a normal Sim workflow — one agent between Start and
   Response, told to research whatever comes in.*

2. **the-toolbelt** (~9s) — [preview-glance + smooth growth]
   Blue selection ring on Research (editing). The Tools row grows in at
   exact natural height (toolsReveal), then three chips width-grow in
   sequence — Exa, Firecrawl, Browser Use — each landing with a brief
   chip ring pulse. Selection ring releases; settle.
   *Beat intent: the toolbelt is a reach ladder — one tool that finds
   pages, one that reads them, one that drives a real browser. The agent
   decides when each is worth calling.*

3. **the-run-begins** (~11s) — [run, freeze-cut out]
   Start blips; its Input row glows (read) and releases; WirePulse
   crosses edge 1; live ring on Research; the Messages tag glows — the
   agent reads its orders. First call: the Exa chip rings, and IN SYNC
   evidence card 1 drops into rail slot 1 — a search-results card (three
   favicon-dot + line rows staggering in). Chip ring releases; tag glow
   releases; the LIVE RING HOLDS through the cut.
   *Beat intent: the run starts like any run — but the agent's first move
   is to go out: search the web, and the results come back as a captured
   result it keeps.*

4. **reading-the-pages** (~9s) — [run continuation, freeze-cut both ends]
   Held live ring. The Firecrawl chip rings → card 2 drops into slot 2
   (a page capture: title bar + paragraph skeleton draws in). Ring
   releases, rings AGAIN at ~1.6× tempo → card 3 into slot 3 (same shape,
   different seed + source dot). Live ring holds through the cut.
   *Beat intent: for each source worth reading, the agent pulls the full
   page as clean text — one call per page, the strip growing as it reads.*

5. **hands-on-the-web** (~17s) — [zoom-aside + zoom-through reverse exit]
   The Browser Use chip rings and HOLDS. Start/Response + edges dim to
   0.35 (Research keeps its live ring). The live session viewport rises
   center-frame: chrome bar draws, wireframe page skeleton appears. The
   cursor eases to a nav item — click ripple — the content dip-swaps to a
   pricing layout: three plan-card wireframes. The cursor visits each
   plan card in turn — click ripple — and on each, the title and price
   lines glow selection-blue and settle green (captured). Then the whole
   viewport folds into rail slot 4 (scale+glide, EASING.inOut), landing
   as evidence card 4 with the green capture pulse. World undims; chip
   ring releases. Live ring STILL holds through the cut.
   *Beat intent: some pages can't just be read — they have to be used. The
   browser tool is an agent with hands: a real session you can watch,
   navigating and clicking like a person, and what it finds becomes one
   more captured result.*

6. **the-brief-comes-back** (~9s) — [run completion + reference beat]
   Held live ring, full rail. The four cards glow selection-blue in call
   order, 1→4, while the agent works (assembling the brief from its
   evidence); Research settles ok (green ring); WirePulse crosses edge 2;
   Response rings live; in its Data row the <research.content> tag glows
   inside the JSON template (the template stays; the value is the brief
   the narration describes); Response settles ok. Green rings HOLD
   through the cut (deliberate carried state).
   *Beat intent: everything the agent captured feeds one answer — a
   research brief built from the evidence, handed to the rest of the
   workflow.*

7. **the-evidence-trail** (~7s) — [settle / bookend]
   The settled frame: chain green, filmstrip complete. Camera eases back
   ~6% (EASING.inOut). Each evidence card takes one quiet sequential
   pulse, 1→4 — the trail retold without re-running. Hold the balanced
   frame for VO.
   *Beat intent: one prompt, one run — and a workflow that went out and
   did the work, with the receipts sitting right there.*

## Continuity contract

- **One set piece:** chain (3 SimBlocks at CHAIN_Y) + 4 fixed rail slots
  (RAIL_Y), all owned by `layout.ts`. Scenes pass state props to one
  `<Rig/>`; nothing relayouts. The scene-5 viewport is an overlay whose
  rect and fold-target (slot 4) both come from layout.ts.
- **The held run is the boundary contract.** 1→2: template chain, no
  tools. 2→3: chain + 3 chips at reveal 1 (template). 3→4: agent LIVE
  ring + card 1 at rest — carried. 4→5: live ring + cards 1–3 — carried.
  5→6: live ring + cards 1–4 — carried. 6→7: chain green (start ok,
  research ok, response ok) + full rail — carried. All transient state
  (row glows, chip rings, pulses, viewport, click ripples, card landing
  pulses) reverts/completes before its scene ends. Cards at rest are
  pixel-static (popIn clamps to exactly 1).
- Edges draw on once (scene 1) and never retract. Pulses absorbed before
  destinations. Chip rings release before each boundary EXCEPT none — no
  chip ring is ever held across a cut.
- Verification: `bun run lint`; opened stills at every beat including the
  scene-5 fold midpoint and each card landing;
  `bun scripts/verify-boundaries.ts browser-agent-v1` (structural zero).
- No sentences on screen; narration carries the words. Skeleton lines
  carry all captured content.
