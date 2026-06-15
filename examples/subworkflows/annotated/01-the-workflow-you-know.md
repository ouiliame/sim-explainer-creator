# Scene 1 — `the-workflow-you-know`  ·  archetype: **assemble + compressed run**

Source: `../source/scenes/TheWorkflowYouKnowScene.tsx`, `../source/scenes/_local.tsx`,
`../source/layout.ts`.

This is the opening scene, and it does one job that the whole rest of the video
depends on: it shows you a workflow **working on its own**, so that when it folds
into a single block in scene 2, you recognize what got packaged. Read it as the
setup for a payoff — every choice here is in service of the fold landing.

---

## What this scene is for

The video's thesis is "a whole workflow can be one block inside another." For
that to mean anything, the viewer has to first hold "a whole workflow" as a
concrete, complete, *running* thing. So scene 1 puts the series CLASSIFY chain
(Start → Agent → Response — the workflow the viewer already knows from module-1)
on the canvas, assembles it, and runs it once end-to-end.

The discipline — *one idea per scene* — is sharp here: this scene establishes
the referent and **nothing else**. No Workflow block, no parent, no fold. And
critically, **no row values resolve.** The run is *compressed*: blips, pulses,
a live ring, blocks settling green — the shape of a run, but not its data.

> *"Why run it but withhold the values?"* Two reasons, both load-bearing. First,
> scene 4 owns the child's values — it's where `<start.input>` and
> `<agent.content>` actually resolve, and showing them here would spend that
> reveal early and make scene 4 redundant. Second, a *compressed* run says "this
> works, you've seen it work" without re-teaching the workflow; the viewer reads
> the gestalt (it lights up, it goes green) and moves on. The full mechanism is
> deferred to where it's the point.

## What it looks like

The three blocks of the CLASSIFY chain stagger in left to right, the two edges
draw on between them, and then one quick run sweeps through: Start blips, a pulse
crosses to the Agent, the Agent shows a live ring, a pulse crosses to the
Response, the Response blips, and the blocks settle green in causal order — then
the green fades back to rest. No values appear in any row.

## The real decisions: render the real chain, run it hollow

The scene renders exactly one thing — `<ChildChain/>` from the rig — and drives
it entirely through `BlockVis` props:

```tsx
<ChildChain
  start={{opacity: reveal(0.4),  highlighted: t >= 2.8 && t < 3.3}}
  agent={{opacity: reveal(0.9),  highlighted: t >= 3.65 && t < 4.35}}
  response={{opacity: reveal(1.4), highlighted: t >= 4.95 && t < 5.45}}
  edge1={{progress: reveal(0.85, 0.4)}}
  edge2={{progress: reveal(1.35, 0.4)}}
/>
<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse(3.05)} />
<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse(4.35)} />
```

The thing to take from this: **the chain is the real `ChildChain` component at
its real `layout.ts` slots, not a one-off drawing for the intro.** It's the same
component that will be re-staged inside the panel in scene 4 and folded into the
block in scene 2. By using the production chain here, scene 1's exit state is
*already* a frame the later scenes can fold — continuity is free, and the fold in
scene 2 is packaging the literal thing you just watched, not a lookalike icon.

Note there are no row resolution props passed (`inputMix` defaults 0, `msg`/`resp`
undefined). The rows render their template placeholders only. The run is hollow
by omission, which is the cleanest way to compress it — you don't suppress
values, you simply don't drive them.

## The values, and where they come from

None resolve on screen this scene — that's the point. The rows show their static
template state (`Inputs: Customer message`, `Messages: Classify <start.input>`,
`Response Data: <agent.content>`, `Status Code: 200`), all verbatim from the
staging CLASSIFY workflow per `grounding-v1.md`. The run values
(`I want a refund`, `"billing"`) are deliberately held for scene 4.

## The animation, beat by beat

Two helpers: `reveal(t0, dur=0.45)` is an `EASING.out` ramp (entrances —
something is arriving, so it eases); `pulse(t0, dur=0.65)` is a *linear* ramp
(a pulse travels a wire at constant speed; easing a wire-pulse looks like it's
braking mid-wire). The split — eased entrances, linear pulses — is the same
discipline the market-desk video applies: easing is for things that arrive and
settle; constant motion is for things in transit.

### (a) The chain assembles — `reveal(0.4)` / `reveal(0.9)` / `reveal(1.4)`, edges `reveal(0.85,0.4)` / `reveal(1.35,0.4)`

Start fades in at 0.4s, Agent at 0.9s, Response at 1.4s — a **0.5s stagger** —
with edge 1 drawing on at 0.85s (just as the Agent it points to begins) and edge
2 at 1.35s. So you read left-to-right causal order: block, its outgoing edge,
the next block.

> *"Why 0.5s between blocks and not the table's 0.35s row stagger?"* Different
> objects, different cadence. A table row is a small thing; five of them at
> 0.35s feels like a list loading. A workflow block is a heavier object and there
> are only three, so a slightly longer 0.5s beat lets each block land as its own
> event. The edges drawing *between* the block reveals (0.85, 1.35) interleave so
> the chain visibly *connects* rather than appearing pre-wired.
>
> *"Why does Start fade at 0.4 instead of 0.0?"* Same reason scene 1 of any video
> opens on a beat of empty frame: starting at 0.0 reads as "the render was
> already mid-load." A short hold says "deliberate open."

### (b) The compressed run — blips, pulses, live ring

The run is three highlight windows and two pulses, choreographed in causal order:

- Start `highlighted` **2.8–3.3s** (a ~0.5s blip — the run touches Start)
- `pulse(3.05)` crosses edge 1 over **3.05–3.70s** — fires *during* Start's blip,
  so the pulse leaves as Start lights, reading as cause→effect
- Agent `highlighted` **3.65–4.35s** — its live ring, lit as the pulse lands
- `pulse(4.35)` crosses edge 2 over **4.35–5.0s** — fires as the Agent's window
  ends
- Response `highlighted` **4.95–5.45s** — lit as that pulse lands

> *"Why do the pulse and the upstream block's blip overlap (3.05 inside 2.8–3.3)
> rather than sequence cleanly?"* Because a run isn't a relay where each step
> finishes before the next starts — the signal *leaves* the block while the block
> is still lit. The small overlap is what makes it read as a single flowing run
> rather than three discrete events. Get this wrong (gap between blip-end and
> pulse-start) and the run looks like it stutters at every block.
>
> *"Why no green-settle props passed (`state`)?"* The script calls for blocks to
> "settle green in causal order, then green fades back to rest." In this hollow
> compressed run the highlight windows carry the run; the scene ends having
> returned every block to its resting (un-highlighted, no-state) form by ~5.45s,
> so the long tail to 8s (or the VO-extended 8.6s) is a clean rest. That settled
> tail is deliberate — see (c).

### (c) The hold — from ~5.45s to scene end

After the Response blip releases, the chain sits at rest. With VO it stretches to
8.6s; the visual minimum is 8s.

> *"Isn't that dead air?"* No — it's the establishing hold, same role as scene
> 1's hold in the market-desk video. The viewer needs a beat to register "this is
> a complete, working workflow" before it gets folded away. And because the scene
> ends on a fully settled state (no motion mid-flight), it can stretch to whatever
> length the narration needs without freezing an animation halfway. A scene that
> ends still is a scene the audio step can extend painlessly.

## How to think about the whole scene

1. *What's the referent?* The CLASSIFY workflow the viewer already knows → render
   the real `ChildChain`, not a stand-in.
2. *How do I say "this works" without re-teaching it?* A compressed run — the
   shape of a run, no values → recognition without redundancy.
3. *Why withhold the values?* Scene 4 owns them → don't spend the reveal early.
4. *How does it need to end?* Settled, at rest, at identity → so scene 2 can fold
   this exact frame and the audio can stretch it.

## Exit state (what scene 2 inherits)

`child chain assembled at its layout.ts slots · no highlights · no resolutions ·
edges full · camera at identity · dots at identity`. This is the resting child
canvas. Scene 2 opens on exactly this frame and begins folding it — the fold is
operating on the literal workflow you just watched run.
