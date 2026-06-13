# Constraint design — convert taste into structure

The harness's central design principle, evidence-backed by the market-desk
Opus↔Fable pair (`examples/market-desk/`, teardown in `market-desk-teardown.md`).

## The claim

The Opus↔Fable quality gap is **not missing knowledge** — it's the base rate of
good choices across thousands of unconstrained micro-decisions. Proof: the two
`script-v1.md` files are near-twins (same concept, arc, run economy,
architecture, even comparable motion density), yet Opus failed on four
independently-disqualifying micro-decisions. Same knowledge, different
per-decision reliability.

Therefore the fix is **not docs or examples** (they add knowledge the model
already has) — it's **removing the decision**. Every degree of freedom you
delete converts a coin-flip into a guarantee. The goal of the component library
is to make the *wrong choice unrepresentable*, not to advise against it.

## The triage: every DOF is either TRUTH or TASTE

- **Product-truth DOF** — there is a provably-correct answer (Sim isn't
  realtime; a written surface needs a write block; a container contains its
  children). **Eliminate these in code. Non-negotiable, and free wins** — a
  fact has no downside to enforcing.
- **Aesthetic-taste DOF** — no single right answer (timing feel, which beat,
  which concept). **Bake good defaults into higher-level primitives; leave the
  irreducible residual to the prompt.** You can't structurally guarantee taste,
  but you can shrink its surface.

Spend constraint effort on truth-DOF first; they're the four market-desk
failures, and they're all eliminable.

## The DOF inventory (market-desk failures → the constraint that kills each)

| Opus failure | The degree of freedom | Truth/Taste | The constraint that makes it unrepresentable |
| --- | --- | --- | --- |
| Fan overflows the `Desk` container, border bisects a child | "how many lanes do I draw + is the container a fixed box?" | TRUTH | `ParallelContainer` takes **one** lane as children + a `fanCount`; it renders exactly one static lane, the fan is an internal bounded animation, and its **height is derived from its contents** (never a free literal). Overflow can't be expressed. |
| Board fills with no `Update Board` block | "is there a write block in the lane?" | TRUTH | `SimTable` cell-fill is driven by an `onWrite={blockRun}` event sourced from a Table block's run beat. **No write block → no write event → the cell cannot fill.** Effect-without-cause is hard to express; a lint backstops it. |
| Odds tick "live" every frame | "should the numbers animate ambiently?" | TRUTH | `SimTable` cell values are **pure functions of discrete write events** — the component exposes no `useCurrentFrame()` value hook. Ambient ticking is unrepresentable. |
| Flat/wrong choreography timing | "every `ramp(start,end)` window, sync offset, hold length" | TASTE | Not fully eliminable. Raise the level: `runBeats(t)` / `assembleStagger()` / `cameraMove()` bake the canonical timing; the agent picks a *start time*, not six windows. Residual ("which beats, what order") stays prompt. |
| Assemble draws every edge, THEN every block — wires hang in empty space (fan especially) | "what time does each block reveal, and separately, what time does each edge draw?" | TRUTH | `chainAssembly(t)` / `fanAssembly(t, m)` return `node(i)` **and** `edge(i)` from one call, with the edge coupled to land on its block. Two independent `ramp()`s — the thing that lets an edge precede its target — are no longer how you express assembly. |
| Written row faked with a colored `<div>` over the table (drifting, mis-aligned, selection-looking) | "where exactly is that cell, and how strong is the green?" | TRUTH (geometry) | `SimTable.cellTint(c,r) → {kind,strength}` paints the tint **inside the cell**, clipped and aligned by construction, decaying to the resting residue. There is no cell geometry left for the agent to re-derive; an overlay div is never the path of least resistance. |

## What "retard-proof component" means concretely

A component **owns its own invariants** so the agent can only assemble, never
violate:

- **Containers size to their contents** and bound their own fan — you cannot
  make one overflow.
- **Surfaces change only on a write event** — no per-frame value access; a fill
  must be bound to a block's run beat (cause required for effect).
- **State is the closed product vocabulary** — rings/dims/tints are enum props,
  not free colors; you cannot invent a surface or a state word.
- **Geometry derives, never literals where it matters** — block heights from
  row counts (measured), lane positions from `layout.ts` helpers; the agent
  can't hand-place into a crop.
- **Choreography is called, not hand-authored** — `runBeats`-style functions
  carry the tuned timing; the agent supplies a start, not a curve.

The test for any new component: *list the ways a weak model could misuse it. If
the misuse is a product-truth violation, redesign the API so it can't compile.
If it's taste, bake a default and document the one knob.*

### The exemplar inherits its own mistakes (show-don't-tell cuts both ways)

The write-tint and the assembly-order failures were both **faithful copies of the
gold's own code**, not inventions. market-desk hand-positioned an overlay div for
the written cell and hand-authored separate node/edge ramps — and because the
imitator copies the exemplar's *code* over the skill's *prose*, it copied the
exact non-retard-proof move, then got the magic offsets and the edge/block order
subtly wrong. **A pattern that's only safe because the gold happened to measure it
right is not a constraint — it's a landmine the next agent steps on.** So when you
harden a primitive, you must also **refactor the exemplar to use it**, or the
annotation teaches one thing while the code demonstrates another and the code
wins. Fixing the component is half the job; making the gold *show* the safe path
is the other half.

## The residual (what stays prompt-level)

Concept selection (which real blocks the topic needs), the scene-list shape
(borrow from a graded exemplar), which beats matter, the narration register.
These are irreducibly taste. Constrain everything you can in code; prompt the
rest — and even there, prompt with *the exemplar's actual code*, not prose
(inject-don't-scan).

## The slogan

**The agent should be able to build a bad video only by building a video that
doesn't run.** Every gap between "renders" and "is a faithful Sim workflow" is
a degree of freedom you haven't closed yet.
