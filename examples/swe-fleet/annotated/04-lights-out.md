# Scene 4 — `lights-out`  ·  archetype: **morph at state level**

Source: `../source/scenes/LightsOutScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the shortest scene in the video — about eight seconds, one gesture.
Read it as the worked example of *restraint*: a scene that does exactly one
thing, says one sentence, and gets out. The lesson here isn't "how to do a lot";
it's "how to know when one move is the whole scene."

---

## What this scene is for

By the end of scene 3 the fleet is fully built and fully wired: the backlog
table up top, the Schedule → Get Issues → Fleet chain below, one reference
(`<getissues.rows>`) connecting the queue to the parallel container. Everything
is *assembled* — but nothing is *running*. The workflow exists; it isn't
deployed.

This scene's whole job is to flip that one bit. It says: **deploy once, and the
fleet runs at midnight whether or not anyone is online.** That's the entire
idea. The Schedule block was always *configured* (scene 2 showed its `Run
Frequency: Daily` / `Time: 12:00 AM` rows), but configured isn't running —
deploying is the act that turns a drawn clock into a live one.

So the rule, again, is *one idea per scene*: this scene is "the workflow gets
deployed, and now it's armed." Full stop. No run happens here — the clock
doesn't *fire* until scene 5 (`midnight`). This scene only **arms** it. Resist
the urge to also show the first run; that's a different idea and it gets its own
scene. This is the calm-before-midnight beat — the lights go out on the office,
the schedule stays lit.

## What it looks like

The whole set piece is on screen at home framing (`CAM_ALL`). A blue editing
ring lands on the **Schedule** block — the leftmost block in the chain. As it
lands, a small pill **rises** into place above that block: a green live dot, then
the text `At 12:00 AM · Next: Mar 18, 12:00 AM`. A beat later the ring releases —
but the pill **stays**. That's it. That residual pill is the scene's entire
output, and it persists for the rest of the video.

## The one real decision: this scene is a state delta, not a build

Look at how little the scene component contains:

```tsx
const editing = t >= 0.6 && t < 2.6;
const pillReveal = ramp(t, 1.5, 2.1, EASING.out);

return (
  <Stage
    cam={CAM_ALL}
    sched={{highlighted: editing}}
    pill={{reveal: pillReveal, swap: 0}}
    lanes={{2: {}}}
  />
);
```

Four props. The camera, one boolean on the Schedule block, one ramp on the pill,
and an empty lane object. Everything else — the table, the outer wires, Get
Issues, the Fleet container, the inner Start pill, the followed lane — is
rendered by `<Stage/>` at its default state, exactly as scene 3 left it. The
scene authors *only the delta*.

This is the **morph at state level** archetype in its purest form. Nothing
enters, nothing assembles, nothing relayouts. The set piece is already there; the
scene changes *one piece of state* (Schedule goes from idle to deployed) and lets
the rest of the frame sit. Compare scene 2 (`the-fleet-takes-shape`), which has
eleven staggered entrances over twelve seconds — that's an *assemble* scene. This
one has zero entrances and one state flip. The archetype tells you how much
machinery the scene needs, and the answer here is almost none.

> *"Why is `lanes={{2: {}}}` there at all if it's empty?"* It's the followed lane
> (lane 2, the center coding lane) declared with no state overrides — which makes
> the Engineer, GitHub, and Mark Done blocks render at their default visibility.
> Leave it out and the inner lane would still draw (the rig always renders lane 2
> from `midLane = lanes[2]`, falling back to defaults), but passing the empty
> object keeps the prop shape identical to the neighboring scenes. Continuity is
> partly a discipline of *not* varying things you don't mean to vary: same set
> piece, same lane declared, only the two things this scene is about changed.

## The camera

```ts
cam = CAM_ALL = { px: 1395, py: 740, s: 0.7 }
```

Static, the whole scene. `CAM_ALL` is the video's home framing — the stage point
`(1395, 740)` (roughly the center of the 2820-wide set piece) held at the
viewport center, zoomed to **0.7×** so the entire fleet — table on top, chain on
the bottom — fits in the 1920-wide frame.

> *"Why no camera move here when almost every other scene has one?"* Because the
> scene's single gesture is small and local — a ring and a pill on one block —
> and the viewer needs to *see the whole fleet* while it happens. The point being
> made is "this one block arms the *whole* thing," which only reads if the whole
> thing is in frame. A push-in onto the Schedule block would say "look at this
> block in isolation," the opposite of the intended meaning. The camera holds
> wide precisely so the armed pill is read in the context of everything it's
> about to drive — the table that will fill in, the container that will fan into
> five engineers. A still camera is a choice, not an absence of one.
>
> *"Why `0.7` specifically?"* It's the framing scenes 2, 3, and 5 also use — the
> home `CAM_ALL`. The set piece is 2820×1500; `0.7` is the zoom at which it sits
> in the 1920×1080 viewport with margin (the `cameraTo` transform puts `(1395,
> 740)·0.7` at the viewport center `(960, 540)`). Reusing the exact same constant
> is what makes the cuts between these scenes seamless: the fleet is
> pixel-for-pixel in the same place across scenes 2→3→4→5. The home framing is a
> shared constant, not re-chosen per scene.

## The two gestures, and why they overlap

There are only two animated things, and their timing is the whole craft of the
scene. Both are built from the same two helpers the rest of the video uses:
`ramp(t, t0, t1, easing?)` (0→1 across `t0`→`t1`, clamped, optionally eased) and
the boolean window.

### (a) The blue editing ring — `editing = t >= 0.6 && t < 2.6`

The Schedule block carries `highlighted: true` for the window **0.6s → 2.6s**,
then drops back to `false`. In the rig, `highlighted` is passed straight to
`<SimBlock highlighted={sched?.highlighted}>`, which draws the product's **blue
selection ring** around the block (`COLORS.secondary`, the same inset box-shadow
the Fleet container's ring uses in scene 3).

> *"Why blue, and why does blue read as 'deploying'?"* Blue is the product's
> *editing / selected* color — it's the ring you see when you've clicked a block
> to act on it. Throughout this video, blue = "a thing is being acted upon by
> you" (scene 3's container ring, this scene's Schedule ring), while green = "a
> thing ran and succeeded" (the `state: "ok"` rings in scenes 7–8) and a
> live-blue ring on a *running* block = "executing now" (the container in scene
> 5, the five Engineers in scene 6). Here we want "you are performing the deploy
> *on* the Schedule block" — an authored act, not a runtime event — so it's the
> editing ring, the same grammar as scene 3's wiring gesture. Deploying is
> something you do *to* the workflow; the ring lands *on* the block to say so.
>
> *"Why a plain boolean instead of a fade like the pill gets?"* The ring is a
> selection state — in the product it snaps on when you click and snaps off when
> you don't. It doesn't fade in. Modeling it as a boolean (on at 0.6, off at 2.6)
> matches that hard-edged product behavior. The pill, by contrast, is a *new
> object appearing*, so it gets a soft entrance. Two different things, two
> different treatments — the ring behaves like the real selection ring, the pill
> behaves like a real object arriving.
>
> *"Why start at 0.6, not 0.0?"* The same reason scene 1 starts its table fade at
> 0.2: a short beat of the settled, un-armed fleet before anything happens reads
> as a deliberate "before." The cut lands on the inherited state from scene 3,
> holds it for a breath, *then* the deploy gesture begins. Opening on motion
> already in progress would make the cut feel like it clipped the start of the
> action.
>
> *"Why the Schedule block and not, say, the container?"* Because deploying is an
> act performed on the *workflow's trigger* — the Schedule block is the clock,
> and arming the clock is what makes the whole graph run on a timer. The ring
> lands on the leftmost block (`SCHED_X = 90`, the head of the chain) because
> that's where the "when does this run" decision lives. Scene 3's ring was on the
> container because that scene was about the *parallel wiring*; this scene's ring
> is on the Schedule because this scene is about the *trigger*. The ring always
> lands on the block whose state the scene is changing.

### (b) The pill rises — `pillReveal = ramp(t, 1.5, 2.1, EASING.out)`

The pill's reveal value ramps 0→1 over **1.5s → 2.1s**, eased with `EASING.out`
(the project's decelerate-to-rest bezier, `Easing.bezier(0.16, 1, 0.3, 1)`).
That single value drives two things at once in the `SchedulePill` component:

```tsx
top: SCHED_PILL.y + (1 - reveal) * 14,
opacity: reveal * (1 - 0.65 * dimmed),
```

So at `reveal = 0` the pill is 14px **below** its resting spot and fully
transparent; as `reveal` climbs to 1 it slides up those 14px and fades in
together. It **rises into place** rather than simply appearing. (`dimmed` is 0
here — there's no aside dimming the world in this scene — so the opacity term is
just `reveal`.)

> *"Why make it rise 14px instead of just fading in?"* A pure opacity fade reads
> as "this label was always here, you just couldn't see it." A rise reads as
> "this came into being just now, *because* of what you just did." The 14px lift
> ties the pill's arrival causally to the deploy gesture — it's the *result* of
> arming, surfacing from the block below it. It's a small distance on purpose:
> enough to register as a deliberate entrance, not so much that it looks like it
> flew in from somewhere. (Compare scene 1's table rows, which don't move at all
> — they *populate* an existing table. There, "already there, filling in" is the
> right read. Here, "newly created" is, so this one moves.)
>
> *"Why `EASING.out` on the rise but no easing on scene 1's fades?"* Because this
> value drives *spatial* motion — the pill travels 14px through space — and
> easing is for things that travel. `EASING.out` (decelerate-to-rest) makes it
> arrive and settle, like it's landing into its slot. Scene 1's table fade was
> pure opacity with no spatial component, so it was left linear; an ease there
> would be invisible. The rule is consistent across the whole project: ease what
> moves, leave flat what only changes opacity.
>
> *"Why 1.5→2.1 — why does the pill start rising a beat after the ring lands?"*
> Sequence is meaning. The ring lands at 0.6; the pill begins at 1.5, ~0.9s
> later. That gap encodes cause and effect: *first* you deploy (ring on the
> block), *then* the armed state appears (pill rises). If they fired together the
> viewer couldn't tell which caused which — it'd read as two simultaneous
> decorations. Staggered, it reads as a sentence: "deploy → now it's armed." The
> pill finishes rising at 2.1, comfortably before the ring releases at 2.6, so
> you see the armed state *while the block is still selected* — the deploy and
> its consequence briefly coexist, which is what seals the causal read. (The
> choreography note puts it exactly: "it appears WHILE the ring is still on
> (cause visibly present), then the ring releases at 2.6 and the pill stays.")

### Where the pill's words come from

The text is `At 12:00 AM · Next: Mar 18, 12:00 AM`, and not one character of it
is free-typed. The pill is built in the rig from two `data.ts` constants and one
component:

```ts
export const SCHED_PHRASE = "At 12:00 AM";       // cronstrue, daily-at-midnight
export const NEXT_BEFORE  = "Mar 18, 12:00 AM";
export const NEXT_AFTER   = "Mar 19, 12:00 AM";
```

```tsx
{SCHED_PHRASE}{" · Next: "}<DipSwap a={NEXT_BEFORE} b={NEXT_AFTER} mix={swap} />
```

> *"Where does 'At 12:00 AM' come from — why not 'Daily' to match the block?"*
> The Schedule block's own rows say `Run Frequency: Daily` and `Time: 12:00 AM`
> (the registry option labels, from `SCHED_ROWS` in `data.ts`). But the
> *deployed pill* is a different surface — it's the product's schedule marker,
> and that marker shows the human-readable expansion of the underlying cron
> expression. The block is configured "Daily at 12:00 AM," which compiles to a
> cron string for midnight every day, and **cronstrue** — the same library the
> product uses to render schedule descriptions — expands that to the phrase
> **"At 12:00 AM."** So the two surfaces agree without being identical: the block
> shows the *setting* (`Daily` / `12:00 AM` as two config rows), the pill shows
> the *compiled schedule* (`At 12:00 AM` as one phrase). Typing "Daily" into the
> pill would be a small lie about which surface this is and how the phrase is
> produced.
>
> *"And the `Next: Mar 18, 12:00 AM`?"* That's the product's schedule-info caption
> format — the next scheduled fire time. The exact timestamp is authored demo
> content (`NEXT_BEFORE`), chosen so that one day later it becomes `Mar 19, 12:00
> AM` (`NEXT_AFTER`) — which is the dip-swap scene 5 performs when the clock
> fires at midnight. The "Mar 18" here exists to be advanced to "Mar 19" then.
> The value is set up in scene 4 precisely so scene 5 has something to change.
> `swap: 0` is passed here to hold the `DipSwap` at its "before" value (`a`) —
> the swap is wired but at rest. (The advance is one *day*, not one hour as a
> daily schedule demands — `Mar 18 → Mar 19` — which is the small correctness
> detail that makes the "fired and instantly re-armed for tomorrow night"
> micro-beat in scene 5 honest.)
>
> *"Why the green dot?"* It's the product's *live / active* indicator —
> `#22c55e`, the same green that means "deployed and listening." It's the visual
> half of "this schedule is now armed": the dot says *live*, the text says *what
> it'll do and when*. No word like "DEPLOYED" or "ACTIVE" appears, because the
> green dot already says it. (Style lesson 2: indicate state with visuals, not
> words.)

### Where the pill sits — `SCHED_PILL`

```ts
export const SCHED_PILL = { cx: SCHED_X + BLOCK_W / 2, y: CHAIN_BLOCK_Y - 74 };
```

The pill is centered horizontally on the Schedule block (`SCHED_X + BLOCK_W/2`,
the block's own midline) and floats `74px` above the block's top
(`CHAIN_BLOCK_Y - 74`), with `translateX(-50%)` doing the centering in the
component.

> *"Why anchor it to the block instead of placing it at a fixed point?"* Because
> the pill *belongs to* the Schedule block — it's that block's deployment marker.
> Deriving its position from `SCHED_X` and `BLOCK_W` means it stays glued to the
> block no matter how the layout shifts; you never hand-place it. The `- 74` lift
> puts it clearly above the block, in the empty canvas over the chain, where
> nothing else competes for that space. It reads as "this block's status badge,"
> hovering just above it.

### (c) The release, and the residue — ring off at 2.6, pill stays forever

At 2.6s the `editing` window closes and the blue ring vanishes. But `pillReveal`
stays clamped at 1 (the `ramp` finished at 2.1 and, having no down-ramp, never
comes back down), so the pill holds at full opacity, in place, for the rest of
the scene — and, because every later scene also passes a `pill` prop, **for the
rest of the video.**

> *"Why does the ring release but the pill persist? Aren't they part of the same
> gesture?"* This is the most important idea in the scene, and it's a distinction
> between *transient* and *carried* state. The ring is **transient** — it's the
> act of deploying, and acts are momentary; you click, it's done, the selection
> goes away. The pill is **carried** — it's the *consequence* of the act, the new
> standing fact that the fleet is now armed. Consequences persist. The whole
> point of the video's spine is that this run is *scheduled* — an overnight fleet
> that runs while you're offline — so the armed state can't be a thing that
> flashes and disappears; it has to become part of the set piece, visible at
> every subsequent boundary. Scene 5 reads the pill and dip-swaps its date when
> the clock fires; scene 9's final morning frame still shows it, reading `Next:
> Mar 19, 12:00 AM`, armed for the next night. If the pill released with the
> ring, the video would have no way to show "and it's *still* scheduled" at the
> end. The release-vs-stay asymmetry *is* the meaning: the action ends, the state
> it created remains.
>
> This is also why the scene is *boundary-safe*. It ends on a settled, latched
> state — ring off, pill at full, nothing mid-flight. Like scene 1's hold, that
> means the scene can be stretched to any length to fit the narration without
> freezing a motion halfway. The armed pill isn't going anywhere; you can sit on
> it as long as the voiceover needs.

### (d) The hold — from ~2.6s to the end (~8.4s as VO-stretched)

After the ring releases, nothing moves for the remaining ~5.8 seconds. The armed
fleet just rests, pill lit, green dot steady.

> *"Isn't ~5.8 seconds of stillness a lot of dead air?"* It's a *latched-settle*
> hold, the same pattern the whole video uses — and the choreography note flags
> it honestly: "Static; the green dot is the only 'live' signal and it doesn't
> blink. Long but tolerable — it's the calm-before-midnight beat and the
> narration is building anticipation." The hold is where the narration lands
> ("deploy once and it runs at midnight whether or not anyone is online…"), and
> the scene rests on the armed state long enough for that line to register — and
> for the *anticipation* to build — before the clock fires next scene. It's
> longer than the ideal ~3s cap, but it's load-bearing here: this is the held
> breath before the run, and the calm is the point. (A slow shimmer on the green
> dot would have carried it better — the same note the scene-9 hold gets — but
> the stillness is defensible as "nothing is happening yet, which is exactly the
> state of a deployed-but-not-yet-fired schedule.")

## Why a scene can be this short — and why that's a strength

The instinct on a short scene is to feel like it's not *enough* — to pad it, to
add a second gesture, to make the ring do a little dance. Don't. The reasons this
scene earns being the shortest in the video:

1. **It has exactly one idea.** "The workflow gets deployed; now it's armed." One
   idea is one scene, and a one-idea scene that takes fifteen seconds is *slow*,
   not thorough. Match the duration to the idea's size.
2. **It inherits a finished frame.** Everything it needs is already on screen from
   scene 3. It has nothing to *build* — no assembly, no entrances. A scene that
   only changes state is intrinsically short, and trying to stretch it means
   inventing motion that doesn't carry meaning (which is scaffolding — style
   lesson 6).
3. **Its job is causal glue, not spectacle.** It's the hinge between "the fleet is
   built" (scenes 1–3) and "the fleet runs" (scenes 5–8). Hinges should be quick
   — they connect two larger things. Lingering here would sap momentum right
   before midnight, which is the part the viewer actually came to see.
4. **Pacing is information.** A short, decisive scene *says* "this is a small,
   decisive act." Deploying a workflow in Sim *is* a single click. The scene's
   brevity mirrors the product truth: arming the fleet is one gesture, so the
   scene is one gesture. If it took fifteen seconds it would imply deploying is
   laborious, which would be a quiet lie about the product.

The discipline of the whole video is variety of beat *shape*: a long assemble, a
zoom-aside, a quick state flip, a multi-scale freeze-cut run, a settled bookend.
The arming scene is the *quick state flip* in that mix — and the mix only reads
as varied if some scenes are genuinely short. A short scene isn't a scene you
failed to fill; it's a scene that knows its size.

## How to think about the whole scene

Walk the decisions in order and the questions driving them are all about
*restraint*:

1. *What changes?* One bit: Schedule goes from idle to deployed → author only the
   delta, render the rest of the set piece at default.
2. *How do I show "you deployed this"?* The product's blue editing ring lands on
   the Schedule block → an act performed *on* the workflow's trigger, in product
   vocabulary.
3. *How do I show "now it's armed"?* A schedule pill rises above the block → a new
   standing object, entering causally after the deploy.
4. *How do I show "armed" without the word?* Green live dot + the cron-derived
   phrase (`At 12:00 AM`) + the next-fire time → state as visuals, every
   character grounded.
5. *What stays, what goes?* The act (ring) is transient and releases at 2.6; the
   consequence (pill) is carried and persists to the final frame → the asymmetry
   *is* the meaning.
6. *How long should it be?* As long as one state flip plus a held breath needs and
   no longer → the shortest scene in the video, on purpose.

There's no clever move here — the quality of the scene is in what it *refuses* to
do. It's the discipline of the whole project applied to its smallest unit.

## Exit state (what scene 5 inherits)

`fleet fully built and idle · Schedule editing-ring released (by 2.6s) · armed
pill present and latched, reading "At 12:00 AM · Next: Mar 18, 12:00 AM" (swap 0)
· camera at CAM_ALL`. Scene 5 (`midnight`) opens on exactly this frame and lights
the Schedule's ring *on its own* (no incoming pulse — the self-fire), then
dip-swaps the pill's `Next:` from `Mar 18` to `Mar 19` — fired and instantly
re-armed for the next night. The pill this scene leaves behind is the object
scene 5 acts on; the `swap: 0` it holds is the slot scene 5 drives to 1. Because
both scenes render the same set piece with the same camera (`CAM_ALL`), that
boundary is identical down to the pixel.
