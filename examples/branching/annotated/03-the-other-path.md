# Scene 3 — `the-other-path`  ·  archetype: **run** (inside the held lean-in)

Source: `../source/scenes/TheOtherPathScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/layout.ts`.

This is the second run, and it's the scene that earns the word "fork." Scene 2
showed one branch firing; on its own that could read as "the workflow goes to
Escalate" — a fixed destination. Scene 3 runs the *same fork* with different
data and the *other* branch fires. Two runs, two outcomes, one unchanged
machine: that's what makes it a fork and not a line with a decoration. Read it
as the worked example for "how do I prove a branch is real *both* ways, and
teach evaluation order, when I don't have a value to show."

---

## What this scene is for

It lands two facts the first run couldn't:

1. **Branches are checked top to bottom, and the first true one wins.** The If
   row glows *first* — you watch the evaluation start at the top — and when it
   doesn't match, the glow *moves down* to `else`.
2. **`else` is the fallback, and it fires here.** Different value, different
   path. And — exactly as in scene 2 — **the branch not taken (Escalate's
   lane) simply didn't happen.**

One idea per scene, honored: this is "the other branch is real, and order is
top-to-bottom." It is the mirror of scene 2, deliberately, so the pair reads as
one fork seen twice.

## The honesty problem this scene solves: a verdict with no value

Scene 2 could resolve `<start.priority>` to `'high'` because that literal lives
in the docs' own expression. Scene 3 needs the If branch to *not* match — but
**no doc authors a non-high priority value.** The rule the build follows is
"NO invented demo values." So scene 3 makes a choice worth studying: it shows
**no resolved value at all.** The If row glows (it's being checked) and then
dims (it didn't match) — and the *choreography alone* carries the verdict.

```ts
const ifGlow = Math.min(c(1.7, 2.1), c(2.6, 2.9, 1, 0));   // If is checked first…
const ifDim  = Math.min(c(2.6, 3.0), c(5.8, 6.4, 1, 0));   // …and doesn't match
```

> *"Isn't a glow-then-dim with no value vaguer than scene 2's resolve?"* It is
> less specific, and that's the correct trade. The alternative — inventing a
> value like `'low'` to resolve the tag to — would be a lie: no run produced
> that value, no doc authored it. The build's standing rule is that everything
> on screen traces to product truth, and a fabricated payload breaks it. So the
> scene accepts a slightly more abstract beat (glow → dim = "checked, no
> match") in exchange for never showing a number that didn't happen. When the
> real run B payload arrives (it's logged as a pending artifact in the
> demo-corpus README), the tag can resolve here too. Until then, choreography
> carries it honestly. *Prefer an honest abstraction over a concrete lie.*

## Teaching evaluation order with a moving glow

The whole "top-to-bottom, first-true-wins" lesson is carried by *where the glow
is* over time:

```ts
const elseGlow  = Math.min(c(2.9, 3.3), c(3.6, 4.0, 1, 0));   // glow moves down
const elseMatch = Math.min(c(3.5, 3.8), c(5.8, 6.4, 1, 0));   // else settles green
```

Read the rising edges as a single travelling highlight: If glows at **1.7s**,
dims at **2.6s**, and as it dims the **else glow comes up at 2.9s**, settling
**green at 3.5s**. The blue check *descends* the block — top row first, then
the next — which is the product's real evaluation order made visible. You don't
write "checked top to bottom"; you watch the glow walk down the rows.

> *"Why not glow both rows at once and just settle the matching one?"* Because
> order is the lesson. Glowing both at once says "they're evaluated in
> parallel," which is false and would make `else` look like a peer of `If`
> rather than its fallback. The descending glow is the difference between "two
> options" and "a checked list with a fallback at the bottom." First-true-wins
> only makes sense if you can see the *first* part.

## The port fires, and again the untaken lane does nothing

```ts
const handleGlow = interpolate(t, [3.9, 4.2, 4.9, 5.3], [0, 1, 1, 0], ...);
const edgeBHi = Math.min(c(4.1, 4.5), c(5.8, 6.4, 1, 0));
const pulseB  = c(4.1, 4.9, 0, 1, EASING.inOut);
const destBLive = t >= 4.8 && t < 5.5;   // → destBOk 5.5–6.2
const laneDim = Math.min(c(4.0, 4.6), c(5.9, 6.6, 1, 0));   // Escalate's lane dims
```

The **else row's own handle** fires at **3.9s**, the *bottom* edge highlights,
a pulse rides it to Reply (live 4.8s → ok 5.5s), and **Escalate's lane dims to
0.35 at 4.0s — the moment the else port commits.** Same grammar as scene 2,
mirror-imaged: this time the *top* lane is the one that does nothing. The
symmetry is the point — whichever branch wins, the other goes dark, and which
one wins depends only on the data.

## The camera returns — closing the carried lean

```ts
const back = c(6.4, 7.7, 0, 1, EASING.inOut);   // LEAN → identity
```

Scene 3 opened still leaned in (the carry from scene 2). It eases the camera
back to identity over **6.4 → 7.7s**, *after* the run has fully reverted, so by
scene end the frame is fully neutral: `phase=0` template, identity camera,
nothing carried. The matched pair of runs is over; the camera lets go.

> *"Why does the return happen here and not at the start of scene 4?"* Because
> the lean belonged to *the pair of Condition runs*. Returning it at the end of
> scene 3 closes that unit cleanly, so scene 4 (the swap to the Router) opens on
> a fully neutral frame with nothing inherited — the swap deserves a clean
> stage. Every boundary in the video except 2→3 is fully neutral; scene 3's
> ending restores that invariant.

## How to think about the whole scene

1. *Why a second run at all?* To prove the fork is real both ways — one run
   could be a fixed destination; two outcomes make it a fork.
2. *How do I show a non-match without a value?* Glow → dim, no resolve.
   Choreography over a fabricated payload — honesty over specificity.
3. *How do I teach top-to-bottom order?* A glow that *descends* the rows: If
   first, then else.
4. *What fires?* The else port → bottom edge → Reply. Mirror of scene 2.
5. *What about the other lane?* Escalate dims at the moment else's port fires —
   the unchanging grammar.
6. *What carries out?* Nothing. The camera returns to identity; the pair closes.

## Exit state (what scene 4 inherits)

`fork at phase=0, fully reverted to template · identity camera`. Scene 4 opens
on this neutral frame and begins the morph that turns the Condition into a
Router.
