# Subworkflows — narration v1

DRAFT narration for `subworkflows-v1`. Massage freely — edit the prose
under each header, then re-run:

    bun scripts/vo-sync.ts --comp subworkflows-v1 --narration src/videos/subworkflows/narration-v1.md

Audio and scene timing both update; unchanged scenes are cached. The
"min Xs" is the scene's authored visual minimum — leave it unless the
visuals change. (Scene 4 reflects the redesigned inside-the-call: the
child runs in a panel beneath the halted parent call — no zoom.)

## 1. the-workflow-you-know — min 8s

This is a workflow you've already built: it classifies customer messages, end to end, on its own.

## 2. it-becomes-a-block — min 10s

That whole workflow can fold into a single block inside another one. You pick which workflow it calls and what input it receives — and then you build around it like any other block.

## 3. the-call-begins — min 7s

When the run reaches the Workflow block, it hands over the value — and then it waits for the answer.

## 4. inside-the-call — min 14s

The call holds at the top while the child workflow runs underneath. The value the parent passed in is the child's start input, and the child runs end to end with it — the same way it runs on its own.

## 5. back-with-the-result — min 10s

When the child finishes, its answer comes back as the block's result — and the parent continues with it like any other value.

## 6. workflows-all-the-way-up — min 8s

And the parent can become a block inside something bigger. Keeping workflows small and calling them from each other is how large systems stay manageable.
