# Scene 5 — `the-model-decides`  ·  archetype: **run + camera lean-in**

Source: `../source/scenes/TheModelDecidesScene.tsx`, `../source/scenes/_fork.tsx`,
`../source/layout.ts`.

This is the run that completes the video's central comparison. Scene 2 showed a
Condition picking by rule — instant, no model. Scene 5 runs the Router, picking
by *meaning*, and the difference is carried almost entirely by **time**: the
Router holds a visible beat of thought where the Condition had none. Read it as
the worked example for "how do I show a model making a choice — and how do I
make 'this one calls a model and that one didn't' a thing you *feel* rather than
read."

---

## What this scene is for

It lands the second of the two deciders, and the contrast that is the whole
point of the video:

1. A Router hands the choice to a **model** — there's no field to check, just
   meaning. The Context tag glows (the Router is *reading* the input), the Model
   row glows (the model is *thinking*), and a route settles green.
2. **It takes a model call; the Condition took none.** This is taught by a
   single deliberate fact: the Model row holds its glow for **~1.4s** while the
   live ring stays on — a held beat of thought — where scene 2's verdict landed
   ~0.3s after the resolve. The timing contrast *is* the wordless lesson.
3. **Exactly one route fires; the other two never happen** — same one-branch-
   lights grammar as the Condition runs, now over three lanes.

One idea per scene: "a model decides." The mechanics of swapping in the Router
were scene 4; here it's already a Router, and it simply runs.

## The held beat is the payoff of scene 2's 0.3s

```ts
const ctxTagGlow = Math.min(c(3.0, 3.6), c(4.6, 5.0, 1, 0));   // reading the context
const modelGlow  = Math.min(c(4.6, 5.0), c(6.2, 6.6, 1, 0));   // the model thinks
const routerLive = t >= 1.5 && t < 7.0;                        // live ring HOLDS throughout
```

Follow the clock. The Context row's `<start.input>` tag glows at **3.0s** —
the Router is reading the ticket. Then the **Model row glows from ~4.6 to
~6.6s — about 1.4s of held thought** — and the live ring stays on the whole
time, from 1.5s clear through to 7.0s. Only *after* that held beat does a route
settle green (Support, at 6.2–6.5s). 

Set that against scene 2: there, `<start.priority>` resolved and the verdict
landed **0.3s** later, no hold. Same video, same fork geometry, two decision
beats — one instant, one with a held think. A viewer never hears "the Router
calls a model and the Condition doesn't"; they *watch* one decision take a beat
and the other not, and the asymmetry teaches the cost. This is the single most
important reason the two runs share a camera language, a lane-dim grammar, and a
verdict vocabulary: so that the *only* salient difference is the one that
matters — the held beat. Strip every other variable and the lesson is the
remaining contrast.

> *"Why ~1.4s specifically — why not a quick half-second think?"* Because the
> beat has to be long enough to read as *deliberation*, not as lag. A half-
> second reads as "the verdict took a moment to render." A held ~1.4s, with the
> live ring visibly *sustained* and the Model row lit the whole time, reads as
> "something is happening here that wasn't happening in the Condition." The
> duration is doing semantic work; it's the difference between a render delay
> and a model call.

## Reading the context, honestly, with no substitution

The Context row's `<start.input>` tag **glows but does not resolve.** In scene 2
the tag resolved to `'high'` because that literal lived in the docs' expression.
Here, the raw ticket text the Router would read is a *pending artifact* — no doc
authors it — so the build's "no invented values" rule means the tag lights (to
show it's being read) but never substitutes to fabricated ticket text.

```tsx
ctxTagGlow={ctxTagGlow}   // the tag glows: "being read"
// no `resolve` prop — nothing is substituted
```

> *"Why glow it at all if nothing resolves?"* Because the glow carries a real
> and necessary fact: the model's input is the *context* — it's reading
> `<start.input>`, the ticket. The glow says "this is what the decision is based
> on" without claiming to know the ticket's literal text. When the real run's
> ticket text arrives (logged in the demo-corpus README as a pending artifact),
> the Context tag can `ResolvedTag`-resolve here exactly as the If tag did in
> scene 2. Same discipline as scene 3: glow honestly, never fabricate.

## The verdict, the port, and two lanes going dark

```ts
const supportGlow  = Math.min(c(6.2, 6.5), c(6.8, 7.1, 1, 0));   // route row checked
const supportMatch = Math.min(c(6.6, 6.9), c(9.2, 9.8, 1, 0));   // settles green
const handleGlow = interpolate(t, [7.0, 7.3, 8.0, 8.4], [0, 1, 1, 0], ...);
const edgeBHi  = Math.min(c(7.2, 7.6), c(9.2, 9.8, 1, 0));
const pulseB   = c(7.2, 8.0, 0, 1, EASING.inOut);
const destBLive = t >= 7.9 && t < 8.6;   // → destBOk 8.6–9.5
const laneDim  = Math.min(c(7.2, 7.8), c(9.3, 10.0, 1, 0));   // Sales AND Billing dim
```

After the held think, the **Support route row** settles green at ~6.6s, its
**own handle fires at 7.0s**, a pulse rides the middle edge to the Support agent
(live 7.9s → ok 8.6s), and **both** the Sales and Billing lanes dim to 0.35 at
**7.2s — the moment Support's port commits.** Note `destA={{dim: laneDim}}` and
`destC={{dim: laneDim}}`: two losers this time, not one, because a Router fork
has three lanes. The grammar is identical to the Condition runs — losers dim *at
the moment the winner fires* — which is exactly *why* it had to be that way in
scene 2: dimming earlier here would have shown Sales and Billing go dark while
the model was still thinking, telegraphing a choice the model hadn't made yet.

The chosen route is **Support** (the middle lane). It's the docs' triage framing
and a pending-artifact stand-in for the real run's `selectedRoute`; the build
notes it as such rather than inventing a "winner." The middle lane is also the
balanced choice for a three-lane fork — the pulse rides straight across.

## The camera: a lean that returns this time

```ts
const lean = c(1.4, 2.8, 0, 1, EASING.inOut) - c(9.8, 11.2, 0, 1, EASING.inOut);
```

Unlike scene 2, scene 5's lean is a *self-contained* push-in and pull-out: it
eases to LEAN over 1.4–2.8s, holds through the decision, and returns to identity
over 9.8–11.2s — all within this scene. Nothing is carried across the 5→6
boundary; scene 6 opens on a fully neutral Router template.

> *"Why does scene 2's lean carry but scene 5's doesn't?"* Because scene 2 was
> the first of a *pair* of Condition runs — the carry stitched A and B together.
> Scene 5 is a lone run (there's no second Router run; the build deliberately
> cut a fourth run as a restated outcome). A lone run leans in for its decision
> and pulls back out when it's done. The camera grammar follows the *narrative
> grouping*: paired runs share a lean, a lone run keeps its own.

## How to think about the whole scene

1. *What does a Router do?* Hands the choice to a model → Context glows
   (reading), Model glows (thinking), a route settles green.
2. *How do I show "this one calls a model"?* A held ~1.4s think-beat with the
   live ring sustained — set against scene 2's instant 0.3s verdict. The
   contrast is the lesson.
3. *How do I read context honestly?* Glow the tag (being read); don't
   substitute a ticket text no run produced.
4. *What fires?* Support's route port → middle edge → Support agent. Same
   anatomy, three lanes.
5. *What about the other two routes?* Both dim at the moment Support fires —
   never earlier, or the dim would leak the model's choice.
6. *What carries out?* Nothing — the lean returns within the scene.

## Exit state (what scene 6 inherits)

`fork at phase=1 (Router template), fully reverted (no glow, no dim, no rings) ·
identity camera`. Scene 6 dims this whole fork and raises the run record over
it.
