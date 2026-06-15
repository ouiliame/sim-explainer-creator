# Scene 4 (v1 take) — `inside-the-call` zoom-through  ·  archetype: **freeze-cut continuation + unfold (push-through) + run**

Source: `../source/scenes/InsideTheCallV1Scene.tsx`, `../source/layout.ts`,
`../source/scenes/_local.tsx`. This is the **original** take, superseded by the
accepted expand-beneath cut (`04-inside-the-call.md`). Both ship in the repo
(takes culture); the diff between them is one of the most useful lessons in the
pack — so read this *after* the accepted version, as a "what changed and why."

---

## What this take is for

Same beat intent as the accepted cut: **inside the block, the child runs
end-to-end with the parent's value as its `start.input`.** The only difference is
*how you get inside* — here, the camera pushes **through** the live Workflow
block (the literal unfold, the inverse of scene 2's fold) until the child canvas
resolves at full size underneath. This is the pure form of the video's move: a
fold reversed.

## What it looks like

Opening on scene 3's frozen frame, the camera pushes into the live Workflow block
— the parent world scales up and recedes off the edges of frame, fading out — and
the child canvas (the scene-1 chain, at full size) crossfades in at identity
behind it. Then the child runs the same choreography as the accepted cut, settles
green, and holds.

## The real decisions — the push-through mechanic

```tsx
const z        = c(0.7, 2.9, EASING.inOut);  // camera pushes IN
const parentOp = 1 - c(2.0, 2.8);            // parent fades as it blows past
const childOp  = c(2.2, 3.0);                // child resolves underneath

{parentOp > 0 ? (
  <div style={{ opacity:parentOp, transform: pushTransform(z), transformOrigin:"0 0" }}>
    <ParentChain wf={{highlighted:true}} inputMix={1} iv={{mix:1}} ... />
  </div>
) : null}

{childOp > 0 ? (
  <div style={{ opacity:childOp }}>   {/* child at IDENTITY — no transform */}
    <ChildChain ... />
  </div>
) : null}
```

The mechanic is the exact inverse of scene 2's fold and uses the rig's other
camera function:

- `pushTransform(z)` scales the parent stage up by `PUSH_Z` (5.4×) with the 2-row
  Workflow block's center (`SLOT_BLOCK_CENTER`, y=551) pinned in frame, so as `z`
  goes 0→1 the block grows to fill the screen and everything else flies off the
  edges. The parent is the same `ParentChain` at identity, transformed — never
  re-laid-out.
- The **child renders at identity with no transform at all.** The illusion of
  "the child was always inside the block" comes from crossfading the child in
  (`childOp = c(2.2, 3.0)`) underneath the parent that's blowing past
  (`parentOp = 1 - c(2.0, 2.8)`). At the swap moment the parent is huge and
  fading; the child resolves at normal size. You "arrive" at the child.

> *"Why does the push target `SLOT_BLOCK_CENTER` (y=551) here, but scene 2's fold
> targeted `SLOT_HEADER_CENTER` (y=501)?"* Because by scene 4 the Workflow block
> is the fully-configured 2-row block (162px tall), so its real center is y=551.
> Scene 2 folded into a header-only block (62px, center y=501) because the rows
> hadn't been added yet. The camera always targets the *actual* center of the
> block as it exists at that moment — that's why there are two computed targets in
> `layout.ts`, not one.

## Why this take was superseded

The push-through is the more *spectacular* version of the move — it's the move in
its purest, most literal form, and that's exactly why it was wrong here. Pushing
through the block makes the parent leave the frame entirely. For three to four
seconds the viewer cannot see the parent at all — and the one thing this scene
most needs to teach is that *the parent is still there, parked, waiting* while
the child runs. The zoom-through visually contradicts the concept.

The accepted cut (`04-inside-the-call.md`) keeps the parent on screen and runs the
child in a panel beneath it, so both tiers are visible and the simultaneity reads.
The lesson the pair teaches:

> **The move serves the concept — when the cleanest read of the concept needs the
> move to yield, it yields.** The fold/unfold is the video's signature, but the
> centerpiece's job is to show sequential containment (parent paused while child
> runs), and a literal push-through can't show "paused" if the parent is off
> screen. So the literal unfold survives at the two ends of the video (scene 2's
> fold, scene 6's bookend, where there's nothing to keep on screen), and the
> middle trades it for a containment panel. Recognizing when your signature move
> is fighting your concept — and demoting it — is the senior judgment here.

## The animation, beat by beat

Identical to the accepted cut *from 3.6s onward* — the child's run is the same
choreography (`inputMix = c(3.6,4.0)`, child Agent live 4.9–5.7s, `<agent.content>`
→ `"billing"` by ~6.95s, green settle 7.6/8.0/8.4s, hold). Only the *entry*
differs:

### The push-through entry — `z = c(0.7, 2.9, EASING.inOut)`

A 0.7s hold on the frozen frame (the freeze-cut seam, same as the accepted cut),
then the camera pushes in over **0.7–2.9s** on ease-in-out. The parent fades over
**2.0–2.8s** and the child resolves over **2.2–3.0s** — the crossfade is offset
into the late part of the push, the same trick as every fold in the video:
hold the moving image opaque until it's nearly out, then swap. The ~1.1s before
2.0s is the camera accelerating into the block while the parent is still solid, so
you read "we're diving into *this block*" before the swap.

> *"Why 2.2s for the push (0.7→2.9) vs the panel's 1.4s raise (0.7→2.1)?"* A
> push-through covers more visual distance — the whole frame scales 5.4× — so it
> needs more time to read as a deliberate dive rather than a snap-zoom. The panel
> only slides the parent up 300px and grows a box; less distance, less time. Both
> are ease-in-out because both are camera moves.

## How to think about the whole take

1. *How do I get inside the block?* Push the camera through it (`pushTransform`),
   crossfade the child in underneath → the literal unfold.
2. *Why is this the pure move?* It's scene 2's fold run backwards → the
   containment grammar made fully physical.
3. *Why was it wrong?* It removes the parent from frame, contradicting "the parent
   is parked, waiting" → the concept needed both tiers visible.
4. *What replaced it?* Expand-beneath — same child run, parent kept on screen →
   the move yields to the clearer read.

## Exit state

Same as the accepted cut's exit (`childOp` resolved, child green, held) — but at
**identity full-frame**, with no parent and no panel on screen (the parent blew
past during the push). The v1 scene 5 (`05b-back-with-the-result-v1.md`) opens on
*this* identity child and folds it back into the block; that's why the two takes
need matched scene-5 variants — the held frame they inherit is geometrically
different.
