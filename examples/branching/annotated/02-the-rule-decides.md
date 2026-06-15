# Scene 2 — `the-rule-decides`  ·  archetype: **run + camera lean-in + reference-resolution**

Source: `../source/scenes/TheRuleDecidesScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/layout.ts`, `../source/components/SimBlock.tsx`.

This is the first run, and it's the scene that delivers the video's money
beat for the *first* of the two deciders: **a Condition picks the branch by
evaluating a rule, and exactly one branch lights.** Read it as the worked
example for "how do I make a fork *fire* without lying about how it fires" —
because every choice here is a constraint about honesty. Nothing resolves that
the product wouldn't resolve; nothing lights that the run wouldn't light; and
the branch not taken does the most important thing of all — *nothing*.

---

## What this scene is for

Scene 1 built the fork and taught its anatomy. Scene 2 runs it once, with a
Condition deciding, and it has to land three facts in sequence:

1. A Condition evaluates a **rule against a value your blocks already
   produced** — the tag `<start.priority>` resolves *in place* to `'high'`.
2. The verdict is **instant** — the row settles green ~0.3s after the tag
   resolves. There is no thinking beat, because there is no model.
3. **Exactly one branch fires, and the other never happens** — the If port
   lights, the pulse rides the top edge to Escalate, and the bottom lane dims
   to 0.35 at the moment the port commits. Nothing ever travels there.

The discipline of *one idea per scene* is honored even though three things
happen, because they are one causal chain — evaluate → verdict → fire — not
three separate ideas. The scene is "a rule decides, and one branch fires."

## The instant-verdict beat is half of a two-scene lesson

The single most important number in this scene is a *gap*: the If row settles
green **~0.3s** after `<start.priority>` resolves. That tiny gap is
deliberate, and it is only half of a lesson that completes in scene 5. There,
the Router will hold a live ring through a **~1.4s** Model-row glow before any
route fires. The contrast — instant here, a held beat there — *is* the
wordless teaching of "the Condition calls no model; the Router calls one." So
the 0.3s here is not "fast because faster is snappier." It is the floor of a
timing contrast you are setting up for a payoff three scenes away. Don't
shorten it to zero (the verdict needs to read as a *consequence* of the
resolve, which needs a beat of separation) and don't stretch it (any think-
hold here would blur the contrast that makes scene 5 land).

## Reference resolution, done honestly

The tag `<start.priority>` resolves to `'high'` **in place**, and only that
fragment changes — the surrounding `=== 'high'` of the expression stays put.
This is the `ResolvedTag` component doing exactly what the product does: a
reference is a live value, and on a run it substitutes to the thing it points
at, in the row where it lives.

Crucially, `'high'` is **not invented**. It is the literal that appears inside
the docs' own authored expression: `<start.priority> === 'high'`. The
condition is checking *for* `'high'`, so a run where the If branch is taken
must have resolved to `'high'`. Showing it resolve to that value is the only
honest thing the scene can show — there's no fabricated payload anywhere. (Run
B, in scene 3, has the harder problem: there's no doc-authored *non*-high
value, so it shows no resolved value at all and carries the verdict by
choreography alone. The two scenes split the honesty problem cleanly.)

> *"Why resolve the tag at all — why not just glow the row and move on?"*
> Because "a Condition evaluates a rule against values your blocks already
> produced" is abstract until you *see* a reference become a concrete value.
> The resolve is the visual proof that the rule reads real data. Without it the
> viewer can't tell a Condition from a coin flip.

## The camera: a lean that carries across the cut

```ts
const lean = c(1.4, 2.8, 0, 1, EASING.inOut);   // identity → LEAN, then HOLD
```

The camera eases from identity to `LEAN` (`{px:930, py:560, s:1.28}`) over
**1.4 → 2.8s**, framed just below the decider's rows so Start and both lanes
stay in frame at 1.28×, and then it **holds at LEAN through the end of the
scene**. It does not return.

This is the one deliberate cross-boundary carry in the entire video. Scene 3
opens *still leaned in* and only returns to identity at *its* end. Everywhere
else, every scene reverts its own state before it ends and the boundary frame
is fully neutral. Here, the camera framing is the single thread stitched across
the 2→3 cut.

> *"Why carry the camera instead of resetting between the two Condition runs?"*
> Because runs A and B are two evaluations of the *same* fork — same blocks,
> same rule, different payload. Pulling the camera back out and pushing it back
> in between them would say "new thing." Holding the lean says "same machine,
> look again." The two runs read as a matched pair, which is exactly what they
> are: A takes the If branch, B takes the else. The camera continuity is the
> visual claim that they're the same workflow seen twice.
>
> *"Why is the boundary frame still safe if the camera is mid-state?"* Because
> the *blocks* are fully reverted — every resolve, glow, and dim returns to
> template before scene 2 ends (see the revert windows below). The only thing
> carried is the camera transform, which scene 3 reads from the same `LEAN`
> constant and continues. Both scenes render the same `<Fork phase={0}/>`; only
> the camera differs, and it differs continuously.

## The run, beat by beat

One helper, `c(lo, hi, a, b, easing)`, is a clamped `interpolate` over seconds.
Every value is built from it. The pattern throughout is `Math.min(c(rise...),
c(fall..., 1, 0))` — a value that ramps up, holds, then ramps back to zero (the
revert).

### (a) The trigger — `startBlip` (0.6–1.1s), `pulse0 = c(0.9, 1.6)`

Start blips highlighted, and a pulse rides edge 0 from Start to the decider
over **0.9 → 1.6s**. The run enters the fork.

### (b) The decider goes live — `deciderLive` (1.5–4.8s)

A blue "live" ring sits on the Condition while it evaluates. It's the product's
own running-state ring; it holds for the whole evaluation, then hands off to
`deciderOk` (4.8–9.2s, the green done ring).

### (c) The rule evaluates inside the If row

```ts
const ifGlow    = Math.min(c(3.0, 3.4), c(4.4, 4.8, 1, 0));  // row "being checked"
const ifTagGlow = Math.min(c(3.2, 3.6), c(4.0, 4.4, 1, 0));  // the tag lights
const ifResolve = Math.min(c(3.8, 4.2), c(8.8, 9.3, 1, 0));  // <start.priority> → 'high'
const ifMatch   = Math.min(c(4.4, 4.7), c(8.8, 9.4, 1, 0));  // green verdict
```

Read the rising edges in order: the If row glows (being checked, **3.0s**), the
tag lights (**3.2s**), the tag **resolves to `'high'` at 3.8s**, and the row
settles **green at 4.4s** — about **0.3s after the resolve completes at 4.2s**.
That's the instant verdict: resolve, then immediately a verdict, no held beat
in between.

### (d) The branch not checked dims — `elseDim = Math.min(c(4.4, 4.8), ...)`

The `else` row dims to 0.35 starting at **4.4s** — the same instant the If
verdict lands. It was never evaluated (first-true-wins; If matched, so else is
never reached), and the dim says so without a word.

### (e) The port fires and the pulse rides the top edge

```ts
const handleGlow = interpolate(t, [4.8, 5.1, 5.8, 6.2], [0, 1, 1, 0], ...);
const edgeAHi    = Math.min(c(5.0, 5.4), c(8.6, 9.2, 1, 0));
const pulseA     = c(5.0, 5.8, 0, 1, EASING.inOut);
const destALive  = t >= 5.7 && t < 6.5;   // → destAOk 6.5–9.0
```

The **If row's own handle** fires blue at **4.8s** (the moment the verdict is
in), the top edge highlights, a pulse rides it **5.0 → 5.8s**, and Escalate
goes live (5.7s) then ok (6.5s). The port fires *from the row that matched* —
the anatomy from scene 1 paying off: the branch row is the port, and the port
that fires is the one whose rule was true.

### (f) The lane not taken dims — `laneDim = Math.min(c(4.9, 5.5), ...)`

The Reply block and its edge dim to 0.35 starting at **4.9s** — note: *at the
moment the winning port fires*, not earlier.

> *"Why dim the losing lane only when the winner fires, instead of the instant
> the verdict is known?"* This is a unified grammar across all three runs, and
> the reason is scene 5. If the not-taken lanes dimmed *before* the port fired,
> in the Router run that early dim would telegraph the model's choice before
> the model had decided — you'd see Sales and Billing go dark while the Model
> row was still "thinking," which is a lie about when the decision happens. So
> the rule is fixed everywhere: **not-taken lanes dim AT the moment the winning
> port fires.** In every boundary frame, all lanes are at full opacity; the
> asymmetry exists only mid-run. Honesty in scene 5 forces the grammar in scene
> 2.

### (g) The revert — everything returns to template before ~9.5s

Every value above has a falling edge (the `c(8.x, 9.x, 1, 0)` second argument
to `Math.min`): the resolve reverts, the rings release, both dims undim, the
green verdict clears. By scene end the fork is back to its scene-1 template
state. **Only the camera stays leaned.**

## How to think about the whole scene

1. *What does a Condition do?* Evaluates a rule against produced values → the
   tag resolves in place to its doc-literal `'high'`.
2. *How fast?* Instant — verdict 0.3s after resolve, no think-hold. (Half a
   lesson; scene 5 is the other half.)
3. *What fires?* The matched row's own port → pulse on its edge → its agent
   runs. Anatomy from scene 1, paid off.
4. *What about the other branch?* It dims to 0.35 — never checked, never run.
5. *When does the loser dim?* At the moment the winner fires, never earlier —
   the grammar that keeps scene 5 honest.
6. *What carries to scene 3?* Only the camera lean. Blocks fully revert.

## Exit state (what scene 3 inherits)

`fork at phase=0, fully reverted to template (no resolve, no glow, no dim,
no rings) · camera HELD at LEAN`. Scene 3 opens leaned-in on this exact frame
and runs the *other* branch.
