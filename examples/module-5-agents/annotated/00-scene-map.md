# Scene map — Module 5: Agents (v3, capability-first cut)

Six scenes, ~60s. Source: `src/videos/module-5-agents/` (`VideoV3.tsx`,
`scenes/`, `_v3.tsx` for the shared `TriageChain` rig, `layout.ts`,
`demo-corpus/triage-run.md`).

**The one idea:** drop an Agent block into a workflow and now it can *think* —
and thinking is concrete: it makes an LLM call, like spawning a fresh chat with
the model inside your workflow. The Messages param IS that chat's messages.
Not problem→solution; capability, then its anatomy.

**The set piece:** one workflow chain — `Start → Triage → Slack`, module-1
geometry — rendered every scene by `TriageChain`. The middle rung starts as a
keyword router (`Route`) and **morphs in place** into the Agent (`Triage`);
both blocks have exactly two rows so the morph never changes height. Every
on-screen value traces to the real beaming-polaris run in
`demo-corpus/triage-run.md` (toolset Docs/CRM/Search, the "charged twice"
message, tokens 5074/431, tool durations).

**Three runs total:** one quick run in scene 1; ONE continuous run spanning
scenes 2→3 (starts at the morph, freezes at the live ring, the aside opens
inside the frozen moment, the same run completes into Slack); the closing green
run in scene 6.

The full-depth annotations cover the scenes carrying the distinctive pattern:
**02 (add-the-agent)**, **03 (inside-the-agent — the centerpiece)**, and
**04 (the-run-record)**. The other three are below.

---

## 1 — a-normal-workflow (~7s) · archetype: orient-from-the-known

Establishes the world before the agent exists. The chain assembles as a plain,
working workflow: `Start → Route → Slack`, where `Route` is a deterministic
keyword router (`Language: JavaScript`, `Code: msg.includes("refund") ?
"billing"…`). One quick run crosses it — `"I want a refund"` resolves into
Start's Input row via `DipSwap`, a `WirePulse` walks edge 1, the router lights,
the category resolves into Slack's Message row (`<route.result>`), then
everything reverts. This is scenery, not an argument: it orients the viewer
from something they already understand (an if/else router) so that scene 2's
morph reads as "swap this one block." Run choreography is the shared `runBeats`
helper in `_v3.tsx` (input → pulse1 → midLive → pulse2 → resp → revert), driven
by a single start time. Ends on a settled, reverted chain — the exact state
scene 2 inherits.

## 5 — whats-ahead (~8s) · archetype: gift-arrival (names only)

The "you can hand it more" beat. Onto the agent's Tools line, a `Refunds`
workflow-as-tool chip grows in (width-growth, same chip grammar as the real
tools), and the `Skills` row appears on the block (`support-playbook`,
revealed via the `skillsReveal` prop already wired into `TriageChain`). Names
only — no run, no interior. The point is to gesture at procedures/playbooks as
*more of the same surface* (a tool is a tool; a skill is a row), deferring the
actual teaching to later modules. Restraint scene: it would be easy to over-
explain skills here; it stays a labeled arrival.

## 6 — still-a-workflow (~6s) · archetype: recap-loop / settle

The closer. One last run walks the whole chain **green** end-to-end (success
state on every block), the camera eases back to neutral, and it holds. The
thesis lands by return: after the chat interior, the tool calls, the run
record — it's *still just a workflow*, the same `Start → Triage → Slack` you
started with, now with a block that thinks. Ends on a static settled frame
(stretchable to fit the closing narration, like every tail in the project).

---

## Continuity contract (verbatim from the script)

- One chain, module-1 geometry, throughout. The chat panel (sc. 3) and run
  record (sc. 4) are overlays over the **unmoved** chain.
- The 2→3 cut carries LIVE state: input resolved, ring on, tag unresolved — the
  aside resolves the tag in sync with the bubble. Pixel-identical boundary.
- Route→Triage morph keeps equal row counts; tools grow in AFTER the morph
  (width-growth chips, exact line heights) so nothing pops.
- All resolutions revert before scenes 3/1 end; boundary frames show template
  values everywhere except the deliberate held state at 2→3.
- Product state language only. Chat/record contents are the real run's data,
  never captions.
