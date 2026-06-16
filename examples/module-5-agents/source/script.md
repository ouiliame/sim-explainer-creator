# Module 5 — Agents (v2): an agent is a workflow that reasons

Built the sim-explainer-craft way: the visual source is the product's own
teaching layer — `apps/docs/content/docs/en/building-agents/{index,choosing}.mdx`
and the docs' authored examples (`BUILD_AGENT_WORKFLOW`, `LEAD_SCORER_WORKFLOW`
in `apps/docs/components/workflow-preview/examples.ts`). Blocks are `SimBlock`
(docs PreviewBlockNode ×1.5); state language is the docs' (blue live ring,
green ok, 0.35 dim).

Thesis (docs index, line 1): *"An agent is a workflow that reasons and acts…
The Agent block is where the model thinks; the rest of the workflow is what it
acts on and through."* The five "gifts" are the agent block's own real rows
(`block-display-specs.ts`: Messages / Model / Tools / Skills / Memory /
Response Format) — so the set piece literally accumulates its product rows as
the video progresses.

The persistent set piece is the docs' lead-scorer example:
**Start {Input: Lead} → Score lead (Agent) → Response {"score": <agent.score>}**.

## Locked scene list

1. **a-workflow-that-reasons** (~8s) — The chain assembles on the canvas with
   the docs stagger (block, edge, block, edge, block). Then the docs hero
   treatment: the Agent block rings `#33b4ff`, Start/Response dim to 0.35. An
   agent is a workflow; this block is where it thinks.
2. **the-reasoning-step** (~9s) — Camera leans into the Agent block
   (`Messages: Score <start.input>`, `Model: claude-sonnet-4-6`). The tag
   glows, the lead value rides in from Start and is absorbed, the live ring
   holds while it "thinks", then a result dot rides out to Response. Reads,
   decides, returns.
3. **tools-to-act** (~11s) — The Tools row appears with Search + Send Email
   chips (real integration colors: exa `#1F40ED`, gmail light chip). Three
   mini-runs: run 1 the Search chip rings and a spoke fires out-and-back;
   run 2 Send Email rings; run 3 neither lights. The agent chooses per run.
4. **who-decides** (~10s) — A second lane fades in above: the same Gmail as a
   deterministic BLOCK on the path (Start → Gmail → Response). Two runs pulse
   through both lanes: the block lane lights Gmail **every** run; the agent's
   gmail chip lights only when chosen. Same integration — the path decides
   above, the agent decides below.
5. **skills-guidance** (~9s) — The Skills row appears (`lead-scoring-rubric`).
   An ambiguous lead arrives; the skill card expands beside the agent (name +
   description always visible, body only now), its body lines flow into the
   block, the agent settles green. A tool is an action it takes; a skill is
   guidance it reads.
6. **knowledge** (~7s) — A Knowledge chip (`#00B0B0`) joins Tools; a KB tile
   sits below the canvas. The query drops down, two chunks ride back up.
   Grounded in your documents, not just training.
7. **memory** (~7s) — The Memory row appears (`Conversation`). Run 1 deposits
   a value into a memory store tile (`#F64F9E`); run 2's value rides back in
   before the agent answers. Carries one run into the next.
8. **structured-output** (~8s) — The Response Format row appears
   (`{ score, tier, reason }`). The output is now a typed mini-bundle (score
   number / tier string / reason string with the docs' type badges) riding to
   Response, whose Data row tag `<agent.score>` glows. Results later blocks
   can act on.
9. **the-full-agent** (~11s) — Camera pulls back; Enrich (workflow block) and
   Reshape (function) glide in between Start and the agent — the docs' lead
   scorer. A run walks the whole path; on the agent, exactly one tool chip
   rings. Blocks for what must always run; the agent decides the rest.

## Continuity contract

- The chain keeps identical geometry in scenes 1–8 (positions in `layout.ts`);
  scene 2's lean-in is a camera transform, never a re-layout. Scene 9 zooms
  out and *inserts* blocks — existing blocks glide, nothing teleports.
- The Agent block only ever **gains** rows/chips (Tools → Skills → Knowledge
  chip → Memory → Response Format), top-anchored so handles and edges never
  move. Each scene enters with every previously granted row present.
- Scene 4's block lane fades in/out above the unmoved chain.
- All colors from the registry: agent `#33C482`, start `#2FB3FF`, response
  `#2F55FF`, exa `#1F40ED`, hubspot `#FF7A59`, memory `#F64F9E`,
  knowledge `#00B0B0`, workflow `#6366F1`, function `#FF402F`.
- No sentences on screen; narration carries the words.
