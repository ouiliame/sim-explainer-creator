# PATTERN — the fork: exactly one branch fires, and *who picks*

The one move this video exists to teach. A workflow doesn't have to be a line.
It can **fork** — split into branches — and on every run **exactly one branch
fires.** The only open question is *who picks the branch*:

- a **Condition** picks by **rule** — no model, same data → same path; or
- a **Router** picks by **model** — it reads the meaning of the text and chooses.

The unpicked branch doesn't error, doesn't skip, doesn't run-and-discard. **It
never happens.** No log, no output, no cost. The whole video is that one fact,
shown from three angles: the fork's anatomy, its two deciders, and the run
record that proves the absence.

---

## The three things to steal

### 1. The two deciders are the *same fork* with one part swapped — and the swap is the lesson

Don't teach Condition and Router as two separate features. Teach them as two
answers to one question — *who picks the branch?* — over an identical fork.
Build them as **two states of one set piece** parameterized by a single number
(`phase`: 0 = Condition, 1 = Router), so swapping one for the other is a
continuous **morph**, not a cut. The morph reads as *editing one block*: header
crossfades (orange Condition `#FF752F`/conditional glyph → green Router
`#28C43F`/connect glyph), new rows (`Context`, `Model`) grow in at their exact
slot heights, branch rows relabel (`If`/`else` → named routes), and lanes glide
2→3. Driving the one `phase` backward replays the whole edit in reverse — so the
closing bookend costs nothing.

> **The rule-vs-model contrast is carried by TIME, not words.** The Condition's
> verdict lands ~0.3s after its tag resolves — instant, no model. The Router
> holds its live ring through a ~1.4s Model-row glow before any route fires — a
> visible beat of thought. Hold every *other* variable constant (camera grammar,
> lane-dim timing, verdict colors) so the *only* salient difference between the
> two runs is the held beat. That asymmetry teaches "one calls a model, the
> other doesn't" with no caption.

### 2. The one-branch-lights money beat — and the unpicked branch goes dark

On a run: the chosen branch row settles **green**, **its own handle fires blue**,
a pulse rides **its** edge to the destination, and the destination runs. Every
*other* lane dims to 0.35 — **at the exact moment the winning port fires, never
earlier.** (Dimming earlier would, in the Router run, leak the model's choice
before the model has decided.) Verdict vocabulary, fixed and wordless: **glow =
being checked · green = matched · 0.35 dim = not matched / not taken.** Never a
word, never a ✗.

Then prove the absence in the **run record**: five blocks on the canvas, **three
rows in the log** (Start · decider · the one chosen agent). The two missing rows
are the beat — hold a long stillness after the third row lands, waiting for a
fourth that never comes. *That* is "the branch not taken never ran."

### 3. Branch-row anatomy — the branch row IS the output port

This is the structural fact the whole video rests on, and it's a faithful port
of the product's `preview-block-node.tsx`:

- A Condition/Router renders its **branches as rows** (label left, value right,
  `-` when empty) — styled exactly like config rows.
- **Each branch row has its OWN source handle** at its right edge, vertically
  centered on the row.
- The **header source handle is suppressed** the instant branches exist:
  `showHeaderSource = !hideSourceHandle && !hasBranches`.
- Branches are checked **top-to-bottom, first true wins**; `else` is the
  fallback.

So the fork is **one block, not a junction**: the split is *configuration inside
the block*, and each branch is a labeled, independently-firing port. Teach it by
lighting **the branch handle before its edge draws** (cause before effect), and
by deriving the handle's Y and its edge's anchor from the **same** row-reveal
math (`simBlockItemCenterY`) so they stay pinned together even while the block
grows during the morph.

---

## How it's built

- **One set piece for all 7 scenes.** `<Fork phase={...} />` with Start →
  decider → destination lanes at fixed geometry (`layout.ts`). The decider
  **never moves** (a declared 15px deviation in favor of continuity). Scenes pass
  state props; nothing relayouts, ever.
- **Content is the docs' own examples, verbatim.** `CONDITION_ROUTE_WORKFLOW`
  (phase 0) and `ROUTER_TRIAGE_WORKFLOW` (phase 1), ×1.5. No invented values:
  the If tag resolves to the docs' own literal `'high'`; where a real payload is
  missing (Run B's non-high value, Run C's ticket text, log durations) the tag
  **glows without substituting** and the value is omitted, not fabricated.
- **The morph is sub-ranges of one `phase`** (`morphCurves`): header → labels →
  rows growing → lanes gliding → third lane arriving. Run forward in the swap
  scene, in reverse in the bookend. Rows grow via `revealStyle` (animate slot
  height, cancel the flex gap) so the block never pops; edges fade, never
  retract.
- **State via product language only:** blue live ring (running), green ok ring
  (done), the row glow/match/dim verdict composition, the active-row background
  for the chosen log row. One justified video-specific addition — verdict
  choreography on decider rows — is a row-scale composition of existing state
  language, not a new primitive.
- **The only cross-boundary carry in the whole video** is the camera lean shared
  by the *paired* Condition runs (scenes 2→3). The lone Router run keeps its own
  lean. Every other boundary frame is fully neutral.

---

## When to use this pattern

Reach for the fork move whenever the topic is **a decision that selects one of
several paths** — routing, triage, conditional branching, escalation, any
"if X do A, else do B" or "classify then dispatch." Use the **two-decider
swap** specifically when the product offers both a rule-based and a model-based
way to make the same choice, and the teaching goal is *when to use which*. The
spine — fork anatomy → rule decider → model decider → run-record proof → bookend
— generalizes to any "one block, two interchangeable strategies" comparison.

**Don't** use it for parallel fan-out (every branch runs), loops, or nested
branching — those are different shapes. This pattern's defining constraint is
*exactly one* branch fires.

---

## The transferable rule

> **Teach a choice as one shape with a swappable decider, and prove the choice
> by what *didn't* happen.** Make the alternatives two states of one set piece so
> the comparison is a continuous morph, not a cut. Carry the "rule vs model"
> distinction in *time* — instant verdict vs held think — not in words. Show the
> winner light and fire from its own port; dim the losers only at the instant the
> winner commits; then let the run record's *missing rows* prove the unpicked
> branch never ran. State is the product's own visual language — glow, green,
> dim, live ring — never a label, never a ✗.
