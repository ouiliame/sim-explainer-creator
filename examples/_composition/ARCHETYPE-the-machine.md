# Archetype: "The Machine" — a workflow being a machine in action

This is the single most reusable composition for a **use-case explainer**, extracted
from `voice-agent` (read its `annotated/` + `source/` for the full build). It is the
frame that makes a viewer feel "this thing is *doing* something real, at scale." If
you're building a use-case and want the machine-in-action money shot, default to this.

Reference frame: `voice-agent` at full run — an outbound-call campaign. But the
template is topic-agnostic; the point is the **three regions and how they sync.**

## The layout — two bands that never touch

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAND — the workflow (simple, product-true, left→right)   │
│     Start → Agent(the campaign) → Parallel container          │
│            "do each"  { ONE inner lane: Act → Log outcome }    │
├──────────────────────────────────────────────────────────────┤
│  BOTTOM BAND — the aside (separate boxes, no edge crosses up)  │
│                                                                │
│   ┌──────┐ ┌──────┐ ┌──────┐            ┌──────────────────┐   │
│   │ act  │ │ act  │ │ act  │            │  STATE TABLE     │   │
│   │ #1   │ │ #2   │ │ #3   │            │  (grows a row    │   │
│   │ live │ │ live │ │ live │            │   per outcome)   │   │
│   └──────┘ └──────┘ └──────┘            └──────────────────┘   │
│   activity visualization (bottom-LEFT)   state (bottom-RIGHT)  │
└──────────────────────────────────────────────────────────────┘
```

- **Top band — the workflow, kept SIMPLE.** Trigger → one Agent block (the "campaign"
  / the thing that decides) → a **Parallel container** holding exactly ONE inner lane
  (the act + a Table write "log outcome"). At runtime the container fans the lane into
  N ghost instances *inside its box* (never overflowing — `CONT_H` derives from the
  fan stack). Product-true, on one axis. Do not make the workflow elaborate; its job
  is to be the legible *cause*, not the spectacle.
- **Bottom-left — the activity visualization.** This is where "something is happening."
  N real surfaces showing the agent's **real-world action** mid-flight — voice-agent
  uses `AgentPhone` call panels (live conversation bubbles + waveform + status stamp),
  **de-phased** so no two change on the same frame (the de-phasing *is* the liveness).
  Swap this surface for your topic's action (see "porting" below).
- **Bottom-right — the state table.** The real `SimTable` of outcomes, which **grows
  one row at a time** as each instance's Log-outcome block writes. It is honest:
  it only ever contains rows that have landed (a table can't show a row no block wrote).

## The load-bearing idea: "N surfaces, one event"

When one instance finishes, **multiple honest views of that single event fire on the
same frame, with no connector lines** — synchrony carries the causality:

1. the activity panel resolves (waveform flatlines, dot goes green, a status stamps),
2. the inner lane pulses (control reaches the Log block),
3. the Log block blips ok (it ran),
4. a row drops into the state table (it wrote).

All four are driven from **one data source** (`LANES` → `TABLE_ROWS_DATA`) so the
panel and the table can never disagree. That single-source discipline is what makes
it read as one machine, not four animations.

## Why it excites

It satisfies the use-case design principles (`docs/design-principles-use-cases.md`) by
construction: the machine is busy (a fan of N), each block is a **higher-level
real-world activity** shown via its real surface (calls, not config rows), and the
whole frame is dense and banded (`COMPOSITION-DELTA.md`) — every region doing work,
the cause (top) and its effects (bottom) visible in one read.

## Porting it to a new topic

Map your topic onto the three slots:

- **The activity (bottom-left surface):** what real-world thing is the agent *doing*,
  many times? Calls → phone panels. Browsing/filling forms → `BrowserSession` +
  cursor. Drafting/sending messages → message-composer cards. Researching → `ChatPanel`
  + evidence trail. Pick the surface that shows the action mid-flight, and de-phase N
  of them. If a real surface doesn't exist yet, that's a component to port — never a
  hand-drawn box.
- **The outcome (bottom-right table):** what does each instance *produce*? One row per
  instance: the subject + the result columns (voice-agent: `to / outcome / status`).
- **The workflow (top):** trigger → the Agent that runs the activity → Parallel
  container with the `Act → Log outcome` lane. Ground every block/field/value in
  `docs/sim-block-schemas.md`.

The test of a good port: at the money shot, **could this be a screenshot of the real
product running that job?** If the bottom-left shows a real action happening N times,
the table is filling from it, and the workflow on top is the honest cause — yes.
