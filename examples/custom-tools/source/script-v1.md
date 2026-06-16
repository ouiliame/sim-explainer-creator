# Custom tools — giving agents new moves (v1) — worktree branch

Registered as `custom-tools-v1` (new composition; nothing overwritten).
No talking-head stitch; the piece opens self-contained on the module-5
chain the audience already knows.

**The one idea:** a custom tool is two parts — a schema the agent reads,
and code that runs when the agent calls it — and once saved it sits on the
agent's table like any built-in tool.

**Macro arc:** capability-first — orient from the known (module-5's Triage
chain and its tool chips, one of which IS a real custom tool), then open
the editor and walk the two-part anatomy, then close the loop back on the
chain. No manufactured problem; the audience already watched a custom tool
fire in module-5.

**Run count:** 2 runs total —
1. Scene 1's compressed replay of the real triage run (with the CRM chip
   ring = the real `customerLookup` call): orients, and proves "a custom
   tool already lives in your world." Without it the anatomy floats.
2. Scene 5's closing settle run: differs from run 1 in exactly the
   dimension the lesson needs — four chips now sit on the table, the model
   reaches for the relevant one (CRM rings; the new Weather chip stays
   quiet), and the chain settles green. Relevance is the model's call;
   closure for the bookend.
Scenes 2–4 run nothing (anatomy on a dimmed world).

**Grounding:** every value on screen from `demo-corpus/get-weather-tool.md`
(docs' authored example + ported editor chrome) or module-5's real run
artifact (`module-5-agents/demo-corpus/triage-run.md`, beaming-polaris,
2026-06-10). Deviations from the live artifact:
- Triage gains a 4th tool chip (**Weather**) in scene 4 — demonstrative of
  the docs' "appears alongside built-in tools"; the live workspace's
  Triage has 3 tools. Marked, reversible.
- Chip name `Weather` condenses `get_weather` (module-5 condensation rule).
- The long fetch-URL code line soft-wraps in the editor (display
  adaptation argued in demo-corpus/get-weather-tool.md).
- Run condensations inherited from module-5 v3 (input "I was charged
  twice", category "billing — double charge").

## Grounding table

| On-screen value | Source |
| --- | --- |
| Chain blocks/rows (Start·Input, Triage·Messages/Model, Slack·#support/Message) | triage-run.md via module-5 `TriageChain` (reused verbatim) |
| Chips Docs / CRM / Search | triage-run.md toolset, module-5 condensed names |
| Run input "I was charged twice" | triage-run.md (condensed, module-5 precedent) |
| Resolved category "billing — double charge" | triage-run.md content (module-5 condensation) |
| CRM chip ring during runs | triage-run.md toolCall 1 (`customerLookup`, real) |
| "Create Agent Tool", "Schema", "Code", "JSON Schema", "Generate", "Available parameters:", "Cancel", "Next", "Back", "Save Tool" | custom-tool-modal.tsx verbatim strings |
| Schema JSON (22 lines) | docs custom-tools.mdx verbatim |
| Code JS (12 logical lines) | docs custom-tools.mdx verbatim |
| `city`, `units` badges | product computes them from the schema (mechanically derived) |
| Param/`{{KEY}}` blue, token colors, selection blue | product code.css / globals.css (both themes) |
| Weather chip (#6366F1, ToolGlyph) | name from docs' `get_weather`; chip grammar = repo CHIP_CRM precedent |
| Tool-call durations / tokens / outputs | NOT shown (no run-record scene) — avoids ⟨pending⟩ values on screen |

## Motion language

Values resolve in rows (`DipSwap`/`ResolvedTag`); wires carry `WirePulse`
only; state via product language (rings/dim/chips). Video-specific
additions, each from the product's own state language:
- **Editor selection** — the product's text-selection color
  (`--selection-dark` #264f78 dark / `--selection-bg` #add6ff light)
  paints behind schema lines / code tokens as the "you are reading this"
  state. No arrows, no boxes, no captions.
- **Tab switch** — the modal's own 1px indicator slides Schema → Code;
  panel height constant (editor pane fixed-height across tabs).
- **Save press** — the primary button dips (brief scale/brightness), the
  panel exits, the chip grows in (module-5 width-growth chip precedent).

## Locked scene list (~49s)

1. **a-tool-in-action** (~10s) — [assemble + run] The Triage chain
   assembles (blocks staggered, edges draw on; Docs/CRM/Search chips
   already on the block). One compressed run: "I was charged twice"
   resolves into Start's Input row → pulse → Triage live ring; while
   live, the CRM chip rings (the real customerLookup call) → pulse →
   "billing — double charge" resolves into Slack's Message tag → hold →
   everything reverts. Chain at template rest by scene end.
   *Beat intent: your agent acts through its tools — you've watched this
   one call customerLookup. Tools aren't a fixed catalog: that one was
   written by someone on this workspace. Here's what writing one is.*
2. **the-schema** (~11s) — [zoom-aside] The world dims (chain to 0.35);
   the Create Agent Tool editor rises center frame, Schema tab active,
   empty editor; the get_weather schema reveals top-to-bottom (fast line
   stagger). Then the selection sweeps: `"name"` line → `"description"`
   line → the two parameter blocks (`city`, then `units`), each a held
   selection-blue wash, previous one releasing. Selections clear; panel
   at rest by scene end.
   *Beat intent: part one is the schema — the only thing the model ever
   reads: what the tool is called, what it does, what it needs. This is
   how the agent knows the tool exists and when to reach for it.*
3. **the-code** (~12s) — [morph-swap (tab switch) + two-surface sync]
   The tab indicator slides to Code; content crossfades at constant
   height: the docs' JS, `Available parameters: city units` badge row
   above the editor (real product UI). Sync beat: the `city` badge
   pulses while `${city}` in the code takes the selection wash — same
   moment, two surfaces; then `units`. Then `{{OPENWEATHER_API_KEY}}`
   takes the wash (it already renders env-var blue). Finally the
   `return { … }` block takes the wash and holds slightly. All washes
   clear; panel at rest by scene end.
   *Beat intent: part two is the code — a JavaScript function body. Your
   schema's parameters just exist as variables; secrets come in as
   `{{KEY}}`; whatever you return is what the agent sees.*
4. **onto-the-table** (~8s) — [aside exit + preview-glance chip beat]
   The Save Tool button dips (press); the panel slides down and fades;
   the world undims. On Triage's tool line a fourth chip — Weather —
   grows in (width-growth, exact line heights) and takes a brief
   selection pulse, then settles. Camera untouched.
   *Beat intent: save it, and it's on the table — for this agent and any
   agent in the workspace. To the block it's just another chip.*
5. **the-agent-decides** (~8s) — [settle / bookend] One final run walks
   the chain: pulse → Triage live, the CRM chip rings briefly (the model
   reaches for what THIS message needs; Weather sits quiet) → pulse →
   blocks settle green in causal order; camera eases back ~7%; hold the
   balanced frame.
   *Beat intent: the model decides when your tool is relevant — same as
   every built-in. And after everything: still just a workflow.*

## Continuity contract

- One set piece: the module-5 Triage chain at module-1/module-5 geometry
  (`layout.ts` re-exports module-5's `blockX`/`CHAIN_Y`/camera helpers).
  The editor panel is an overlay at `layout.ts` `PANEL` geometry; the
  chain never moves.
- Boundary 1→2: chain at template rest (3 chips, no resolutions, no
  rings, camera identity) — identical on both sides; scene 2 dims and
  raises the panel *after* frame 0.
- Boundary 2→3: world dimmed + panel open on Schema tab, all 22 lines
  revealed, selections clear — identical; the tab switch happens inside
  scene 3.
- Boundary 3→4: world dimmed + panel open on Code tab, fully revealed,
  washes clear — identical; the save/exit happens inside scene 4.
- Boundary 4→5: chain at rest with FOUR chips (Weather opacity 1, ring
  0), world undimmed, panel gone, camera identity — identical.
- What the focal block gains: scene 4 only — the Weather chip (kept
  through scene 5).
- All resolutions revert before scene 1 ends; scene 5 ends green-settled
  (video end). No freeze-cuts in this piece. Boundary pairs verified by
  pixel diff (structural zero; LSB noise allowed).
- No sentences on screen; the only words are product UI strings and the
  docs' own schema/code — the narration carries everything else.

## Batch-mode assumptions (director unavailable)

1. **Audience**: has watched through module-5-agents-v3 (knows the Triage
   chain, tool chips, tool calling, the chat-aside model of an agent).
2. **Scope**: custom tools only — MCP, Function-block contrast, the AI
   wand, management/permissions, and Secrets setup are all out (see
   notes.md "Deliberately not taught").
3. **Length**: ~49s, matching the module-5/tables-v2 ballpark for a
   single-capability video.
4. **Set piece**: reuse module-5's TriageChain rather than invent a new
   workflow — series continuity + the only real run artifact containing a
   custom-tool call.
5. **Anatomy example**: the docs' `get_weather` (the product's authored
   example) rather than reconstructing `customerLookup`'s unpublished
   schema/code (which would require inventing on-screen values).
6. **The 4th-chip deviation** (scene 4) is acceptable to demonstrate the
   docs' "appears alongside built-in tools" flow.
7. **No run-record scene**: a real `get_weather` run artifact doesn't
   exist; rather than show ⟨pending⟩ numbers, the record beat is deferred
   to the artifact request.
8. **No VO anchors** were coined by the director for this topic; beat
   intents above are delivery-ready for the narration sheet.
