# Design principles for USE-CASE explainers — excite and inspire

A use-case explainer's job is to make someone **want to build this.** It has to
**excite and inspire — show the machine in action** — not read as a dry,
mechanistic A→B→C diagram of abstract boxes. This is the opposite register from the
**mechanics / academy** explainers (what-is-a-workflow, data-flow, loops…), which are
deliberately calm and diagrammatic because their job is to teach one concept
cleanly. Don't confuse the two: **mechanics = teach; use-cases = inspire.** This doc
is the use-case register.

---

## 1. Show the machine in action

The money shot is the **system doing a lot at once, visibly alive.** Not "here are
some connected blocks" — "this thing is *doing* something big." The reference reels:

- **agent-economy** — a swarm of requests activating; *volume* as the feeling.
- **voice-agent** — three live phone conversations running in parallel, the outcomes
  table filling underneath. The machine is on a call. Three calls. Right now.
- **outbound-machine / swe-fleet** — a fan of lanes all working at once.

The viewer should *feel* the activity. If the frame is calm and sparse, you've built
a diagram, not an explainer of something worth building.

## 2. Break the linear-chain default

The lazy default is `Start → Agent → Response → done` — a thin line of abstract
blocks. **Resist it.** Reach for shapes that show scale and concurrency:

- **parallel / fan** — N things happening at once (the single biggest upgrade);
- **loops** — the same real work over a whole list;
- **volume** — many requests / items / calls in flight;
- **a cascade** — a trigger that sets off a chain where each step kicks off the next.

Run economy still holds — *one* run is fine — but make it a **wide, busy run** (a fan
of N lanes), not a thin one. One trigger fanning into twenty calls is one run *and*
the machine in action.

## 3. Each block is a higher-level real-world ACTIVITY (especially agents)

A block isn't an abstract "Agent." It's **"Campaign — confirm 200 appointments by
phone."** Frame the topic so every block reads as a real, consequential thing
happening in the world, and then *show that activity*, not just its config row:

- an agent **calling people** → the `AgentPhone` panels with live conversation +
  waveforms;
- an agent **researching the web** → the `ChatPanel` interior with tool calls +
  an evidence trail;
- agents **negotiating / drafting / enriching / triaging — at volume.**

"Send a Slack message" is dry. "Fan out 200 personalized calls and log every
outcome" is alive. Same primitives; the framing and the *shown activity* are the
difference. The agent is an **actor** — show its action.

## 4. Rube Goldberg machines

The most exciting explainers are **cascades**: a trigger sets something in motion, and
each block does something substantial, and the whole produces an impressive
real-world result you watch ripple across the frame. Lean into the "look what this
sets off" feeling. Each block represents a meaty higher-level activity; the wires
carry the cascade from one consequential step to the next.

---

## How this changes the build

- **Concept (skill §1):** pick a topic *framing* and a *shape* that let the machine be
  busy — bias hard toward parallel / fan / volume / cascade. Borrow the arc from the
  nearest **exciting** exemplar (`agent-economy`, `voice-agent`, `outbound-machine`,
  `swe-fleet`), not the calmest one. If your first instinct is a 3-block line, push
  the concept until at least one stage fans or loops over real volume.
- **The money-shot scene:** the system at full activity — many lanes live, surfaces
  filling, the agent's real-world action visible (calls connecting, requests landing,
  rows streaming in). Compose it dense and banded (`examples/_composition/COMPOSITION-DELTA.md`).
- **Block framing (`data.ts`):** name and configure blocks as substantial activities,
  and *show* the activity — `ChatPanel` for an agent deciding, `AgentPhone` for calls,
  the fan for volume — never just a static config row sitting still.

## The line

A use-case explainer should make the viewer think **"I want to build that"** — because
they just watched a machine come alive and do something real, at scale. If it instead
reads as "here is a correct workflow," it's a mechanics video wearing a use-case's
clothes, and it will feel dry no matter how clean it is.
