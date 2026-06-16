# Branching — narration v1

DRAFT narration for `branching-v1`. Massage freely — edit the prose under
each header, then re-run:

    bun scripts/vo-sync.ts --comp branching-v1 --narration src/videos/branching/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change.

## 1. a-fork-in-the-flow — min 8s

A workflow doesn't have to be a straight line — it can fork. The fork is one block, and every branch row on it is its own output port.

## 2. the-rule-decides — min 12s

A Condition block picks the branch with a rule. The tag resolves to high, the check passes instantly — no model involved — and the workflow takes the top lane. The bottom lane never runs.

## 3. the-other-path — min 8s

Branches are checked top to bottom, and the first one that's true wins. This ticket matches nothing, so the else branch fires.

## 4. swap-the-decider — min 10s

When the rule is too hard to write — when the decision depends on meaning — you swap in a Router. It takes context, a model, and a set of named routes.

## 5. the-model-decides — min 12s

Now a model makes the choice. The Router reads the ticket, thinks for a moment — that's a real model call — and picks the Support route.

## 6. the-run-record — min 8s

The run's log shows five blocks but only three rows ran. The branch that wasn't taken never executed at all — no log entry, no output.

## 7. still-one-workflow — min 6s

It's still one workflow: use a rule when you can write one, and a model when you can't.
