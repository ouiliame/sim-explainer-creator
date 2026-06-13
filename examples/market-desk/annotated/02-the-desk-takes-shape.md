# Scene 2 — `the-desk-takes-shape`  ·  archetype: **assemble + camera ease**

Source: `../source/scenes/DeskTakesShapeScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the build scene: the second scene of the video, and the one that turns
"here's a table" into "here's a desk." It does two things at once — a camera
move and an assembly — but they're the *same* idea (the desk growing around the
board), so it stays inside the one-idea rule. Read it as the worked example of
how to introduce a whole workflow without overwhelming the viewer.

---

## What this scene is for

Scene 1 planted a question: three empty columns, and a table that can't fill
them. This scene answers "who fills those in?" by assembling the thing that
will — the desk. But it answers it as a *picture of a workflow*, not a list of
features. The point the scene has to land is **the desk is one chain**: a clock,
a market pull, and a container holding a single analyst lane. Everything is in
service of that one read.

So the rule the scene follows is still *one idea per scene* — the idea here is
"the desk is this shape." It is deliberately runless: nothing executes, no
number fills, no cell changes. We're introducing the apparatus, not running it.
Resist the urge to also fire the schedule or light a wire "to show what it does"
— that's scenes 5 onward. This scene only builds.

## What it looks like

The camera pulls back. The table — which filled the frame in scene 1 — glides
up to the top of frame and shrinks to its home size, and as the empty space
opens up beneath it, the workflow assembles into that space, left to right, in
the order data flows: a **Schedule** block appears, a wire draws to a
**Polymarket** block, a wire draws to the **Desk** container (a yellow Split
chip and an inner Start pill), and inside the container one lane builds —
an inner wire, an **Analyst** agent (with Exa and Perplexity tool chips), a wire,
and an **Update Board** table block. Then it rests.

## The one real decision: it's all a camera move, not a layout change

The scene renders this:

```tsx
<Stage
  cam={camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut))}
  sched={{opacity: schedIn}}
  poly={{opacity: polyIn}}
  cont={{opacity: contIn}}
  edge1={{progress: edge1}}
  edge2={{progress: edge2}}
  lanes={{2: {ana: {opacity: anaIn}, upd: {opacity: updIn},
             edgeIn: {progress: edgeIn}, edgeA: {progress: edgeA}}}}
/>
```

Two things to take from this.

**The table does not move. The camera does.** This is the part people get
wrong. The instinct, when you want the table to "go to the top so the chain has
room," is to animate the table's `top` from 150 down to a smaller number — to
*relayout*. Don't. The table's stage coordinates (`TABLE_X = 360`,
`TABLE_Y = 150`) never change in this scene or any other. What changes is the
camera: it eases from `CAM_TABLE` (centered on the table, zoomed to 1.1×) to
`CAM_ALL` (centered on the whole set piece at 0.78×). Because the camera now
frames a taller region of fixed geometry, the table — which lives at the top of
that geometry — *ends up* near the top of frame, smaller. The glide is real,
but it's the viewport moving over a still world, not the table moving.

> *"Why does that distinction matter so much?"* Because it's the rule that makes
> continuity free across the whole video. The set piece is one fixed layout
> (`layout.ts`); every scene is a `camMix` over that same geometry plus state
> props. If scenes moved elements around to "make room," every cut would be a
> potential layout jump, and you'd be hand-checking each boundary. By making the
> only spatial change a camera transform, the table at the end of scene 1 and
> the table at the start of scene 2 are the *same object at the same coordinates*
> — the boundary is identical by construction. Once, in `cameraTo`; never again.

**Every block is already present in the layout — this scene just fades them
in.** Schedule, Polymarket, the container, the inner lane all live at fixed
positions in `layout.ts` and are rendered by the *same* `<Stage/>` scene 1
rendered (where they were `hidden`). Here they come up on opacity ramps. Nothing
mounts mid-video; visibility is animated, never existence.

## The camera, completed

```ts
cam = camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut))
// CAM_TABLE = { px: 1200, py: tableCenter().y, s: 1.1 }
// CAM_ALL   = { px: 1200, py: 735,             s: 0.78 }
```

This is the second half of the move scene 1 set up. Scene 1 deliberately framed
the table a touch large (1.1×) so this scene could pull back to neutral (0.78×),
and that pull-back is what makes the desk feel like it *grows around* the board
rather than appearing beside it. `camMix` linearly interpolates all three camera
fields (`px`, `py`, `s`) by a single mix value; here the mix is
`ramp(t, 0.3, 2.4, EASING.inOut)` — 0 to 1 over **0.3s → 2.4s**, eased in-out.

> *"Why ease this one when scene 1's fades were left linear?"* Because this is a
> *move through space* — the framing travels and the zoom changes — and motion
> through space wants momentum: a gentle start, a glide, a gentle stop.
> `EASING.inOut` (`bezier(0.65, 0, 0.35, 1)`) gives exactly that S-curve. The
> project rule is consistent: `EASING.inOut` for camera moves and transforms,
> `EASING.out` for entrances, plain linear for fades (which have no spatial
> momentum to shape). A linear camera pull would start and stop abruptly and
> read as mechanical.

> *"Why start at 0.3 and finish at 2.4 — why those bounds?"* The 0.3s lead-in is
> a held beat on scene 1's exit frame before anything moves, so the cut doesn't
> feel like it yanks the camera the instant the scene starts. The 2.4s landing
> is chosen against the assembly: the first block (Schedule) starts fading in at
> 2.0s, while the camera is still settling, and finishes after the camera has
> arrived. So the camera *gets out of the way* before the chain becomes the
> focus — you're never asked to track a moving frame *and* read a new block at
> the same time. Too short a move (say ending at 1.0s) and the pull-back feels
> hurried, not a "settle in"; too long (4s+) and you're watching an empty pan.

> *"Why 0.78× for CAM_ALL?"* It's derived, not picked. `CAM_ALL` frames the
> whole content bounding box (`x 128..2273, y 150..1321`, center `(1200.5,
> 735.5)`), and 0.78 is the zoom at which that box fits the 1920×1080 viewport
> with a comfortable margin. This is the video's *home* framing — scenes 3, 4,
> 5, 8 all return to it — so it earns being the neutral the camera resolves to.

## The values, and why each block is grounded

Every block on screen is a real Sim block fed registry-true content from
`data.ts`. None of it is designed; all of it is configured. The chain, in flow
order:

**Schedule** — `BLOCK_COLORS.schedule = #6366F1`, the indigo schedule chip, with
two rows from `SCHED_ROWS`:

| Run frequency | Hourly |
|---|---|
| Minute | 0 |

The titles are verbatim from the registry (`schedule.ts`) — note the lowercase
`frequency`, which is what the registry actually says (the older `swe-fleet`
build wrote `Run Frequency` before the registry-wins tiebreak; it's not copied).
This block has `hideTargetHandle` set, because it's the *entry* of the chain —
nothing flows into a clock.

**Polymarket** — `POLYMARKET_COLOR = #4C82FB`, the blue chip with the verbatim
PolymarketIcon path (white-filled for the chip), three rows from `POLY_ROWS`:

| Operation | Get Markets |
|---|---|
| Sort By | Volume |
| Limit | 5 |

`Get Markets` is the registry's default operation (`get_markets`); `Limit | 5`
is doing real work — it's *why* the board has exactly five rows. The count isn't
a coincidence we drew, it's a configured fact you can see.

**Desk** — the Parallel container. Its identity comes from
`parallel-config.ts`: the `SplitGlyph` (lucide SplitIcon) on a
`PARALLEL_COLOR = #FEE12B` chip, drawn *dark* on the light yellow per the
product's luminance rule. Inside its header sits the name `Desk` (a user-named
block — product-legal); over its body sits the inner **Start** pill, which is
the parallel's own entry point.

**Analyst** — `BLOCK_COLORS.agent = #33C482`, the green agent block. Two rows
plus a tools line:

| Messages | `<parallel.currentItem>` |
|---|---|
| Model | claude-sonnet-4.6 |

with tool chips **Exa** (`#1F40ED`) and **Perplexity** (`#20808D`), each a real
tool integration with its verbatim brand glyph. The `Messages` value is the bare
reference tag `<parallel.currentItem>` — the per-instance market each analyst
receives. (The actual instruction lives in the agent's system prompt, which the
block doesn't draw; a verb prefix here truncated the tag mid-name on render, so
it's shown bare.)

**Update Board** — `BLOCK_COLORS.table = #10B981`, the green table block, two
rows from `UPDATE_ROWS`:

| Operation | Upsert Row |
|---|---|
| Row Data | `{"agent_est": 0.71, …}` |

`Upsert Row` (`upsert_row`) is the honest write operation: refresh-or-insert by
market key. The Row Data is shown truncated — and that's fine, because the full
value lands in the table row it writes to, which is simultaneously on screen.
This block has `hideSourceHandle` set: it's the *end* of the lane, nothing flows
out of it.

> *"Why does the Analyst's Messages already say `0.71` won't appear here, but
> Update Board's Row Data shows `0.71`?"* The `0.71` in Update Board is an
> *authored example value* of the JSON shape — it's showing you what the block
> writes, structurally. It isn't a live result; the run hasn't happened. The
> same honesty rule from scene 1 holds: nothing on screen is a value the run
> produced, because no run has produced anything yet. The board's three columns
> are still empty in this scene for exactly that reason.

> *"Why show the full row content on every block in a runless scene — isn't that
> a lot of text to read?"* Because the rows are what make each block a *specific*
> block instead of a generic box. "Schedule" is just a word; "Schedule · Run
> frequency Hourly · Minute 0" is a clock you understand. The narration will
> name each block as it lands, and the row underneath is the proof of what the
> word means. This is the assembly scene; it's the one place the viewer is
> *supposed* to read the configuration, because every later scene assumes they
> already did.

## Why ONE lane, not the fan

The container holds a single analyst lane — Analyst → Update Board — and only
one. The five-wide fan (one analyst per market) does not exist in this scene. It
doesn't exist in the layout as drawn content at all: `laneTop(2, fan)` with
`fan = 0` is the only lane on canvas; the four ghost instances are gated behind
`fan > 0`, which only happens at runtime in scene 6.

> *"Why hide the fan here? Isn't 'five concurrent analysts' the whole point?"*
> It is the point — *later*. The fan is what the parallel *does when it runs*;
> the lane is what the parallel *is*. This scene teaches the structure, and the
> structure is one lane that the container will replicate. Drawing five lanes
> now would say "there are five hardcoded analysts," which is the wrong mental
> model — the truth is one lane, fanned at runtime over whatever markets come
> back. Show the template; let the run show the copies. (This is a literal rule
> from the rejection history — case study 17, rule 4: the canvas shows one lane,
> the fan is runtime animation only.)

## The animation, beat by beat

One helper does all the timing here. `ramp(t, t0, t1, easing?)` goes from 0 to 1
as the clock `t` (in seconds) crosses `t0`→`t1`, clamped outside that window,
with an optional easing curve. Entrances use `EASING.out`; wires use no easing.
That's the whole vocabulary for this scene — nine ramps and one camera mix.

### (a) The assembly order *is* data flow

The blocks come in left to right in the order data moves through them:

```ts
schedIn = ramp(t, 2.0,  2.6,  EASING.out)   // Schedule
edge1   = ramp(t, 3.0,  3.6)                // → Polymarket
polyIn  = ramp(t, 4.0,  4.6,  EASING.out)   // Polymarket
edge2   = ramp(t, 5.2,  5.8)                // → Desk container
contIn  = ramp(t, 6.2,  7.0,  EASING.out)   // Desk container
edgeIn  = ramp(t, 7.8,  8.4)                // inner pill wire
anaIn   = ramp(t, 8.4,  9.0,  EASING.out)   // Analyst
edgeA   = ramp(t, 9.8,  10.3)               // lane wire
updIn   = ramp(t, 10.3, 10.9, EASING.out)   // Update Board
```

Read the centers: Schedule (~2.3), edge (~3.3), Polymarket (~4.3), edge (~5.5),
container (~6.6), inner wire (~8.1), Analyst (~8.7), lane wire (~10.0), Update
Board (~10.6). Block, then the wire that feeds the next block, then that block —
all the way down. The viewer's eye traces the data path because the *animation*
traces the data path.

> *"Why assemble in flow order instead of, say, all the blocks then all the
> wires?"* Because flow order tells a story and the alternatives don't. "Clock →
> pull → desk → analyst → write-back" is a sentence; the viewer assembles the
> *meaning* of the chain at the same pace they watch it draw. If all three blocks
> popped in and then the wires connected them, you'd read "three boxes" first
> and "a pipeline" second — two reads where flow order gives you one. The wire
> drawing *between* two blocks, in the gap, is the literal claim "this feeds
> that," made visually.

> *"Why are entrances eased (`EASING.out`) but wires aren't?"* A block fading and
> settling in is an arrival — `EASING.out` (`bezier(0.16, 1, 0.3, 1)`) front-loads
> the motion so it appears quickly then eases to a stop, the standard entrance
> feel. A wire isn't arriving in space; it's *drawing* — `progress` sweeps the
> path from 0 to 1 (start handle to end handle) at a steady rate, like a line
> being drawn with a pen. Easing a draw would make the pen lurch. Same principle
> as scene 1: ease things that travel, leave linear the things that just reveal.

### (b) The cadence: ~1.0–1.4s between elements, and why it's slow

The gap between the *center* of one element and the next runs about 1.0 to 1.4
seconds — Schedule center to edge1 center is ~1.0s, edge1 to Polymarket ~1.0s,
Polymarket to edge2 ~1.2s, edge2 to container ~1.1s, then a ~1.5s reach into the
container before the inner wire, and ~0.9–1.4s through the lane. The whole
assembly spans 2.0s to 10.9s — nearly nine seconds for nine elements.

> *"Why so slow? `swe-fleet`'s assembly ran at 0.6–0.8s gaps."* Because each
> element here has to be *nameable*. This is the scene where narration introduces
> the desk's parts — "a clock fires every hour, the Polymarket block pulls the
> markets, a container holds the analyst" — and the narration needs a beat per
> noun to land it. At 0.6s gaps the chain assembles in under five seconds and the
> voiceover is racing to keep up, or the blocks are all on screen before they're
> spoken about. At ~1.2s gaps the assembly *nearly fills the narrated window*,
> which is the other reason it works: this scene's hold is short precisely
> because the build itself carries most of the runtime. The slow cadence buys
> two things at once — clarity for the narration and a scene that doesn't die
> waiting.

> *"How was 1.0–1.4s derived as the bound?"* By the failure modes on either
> side. Too fast (≤0.7s) and the elements blur into one assembly gesture — you
> can't feel the distinct steps, and there's no room to name them. Too slow
> (≥2s) and the gaps become dead air between arrivals; the eye finishes reading
> one block and waits, bored, for the next. 1.0–1.4s is the band where each
> arrival fully registers and the narration can name it, with no idle gap. Once
> you find the band, keep the spacing *roughly even* — the small variations here
> (1.0 to 1.5) track the wire/block alternation, not arbitrary jitter.

### (c) The reach into the container

Notice the largest single gap: the container finishes coming in at 7.0s, but the
inner pill wire doesn't start until 7.8s — a held ~0.8s beat with the container
present and empty before its interior begins to build.

> *"Why pause there?"* Because the container is a context switch — the eye has
> to move *inside* a box and re-scope to a smaller world. Holding a beat on the
> empty container says "now we go in here," and lets the viewer register the
> container as a container (a thing with an interior) before that interior fills.
> Building the inner lane the instant the box arrives would collapse "here's a
> container" and "here's what's in it" into one unreadable moment. The inner
> assembly then runs in the same flow order at the same cadence — pill wire →
> Analyst → lane wire → Update Board — a small chain echoing the outer one.

### (d) The hold — from ~10.9s to the end of the scene

After Update Board lands at 10.9s, nothing moves. The assembled desk just rests
(~5.3s of hold in the shipped timing).

> *"Isn't that dead air, like scene 1's tail?"* Less so, and for a structural
> reason. Scene 1's hold was long (~7.4s) because almost nothing happened before
> it; this scene's assembly is nine seconds of continuous build, so by the time
> it settles, most of the scene's runtime is spent and the hold is short. The
> hold still earns its place: it's where the narration finishes naming the chain,
> and — same as scene 1 — a scene that ends on a settled, motionless state can be
> *extended* to fit however long the voiceover runs without freezing a motion
> mid-flight. "Ends on a latched settle" is the property that makes the audio
> step downstream painless; every scene in this video has it.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *How do I make room for the chain?* Pull the camera back over fixed geometry
   → the table glides up as a camera move, layout never changes, continuity free.
2. *How do I introduce a whole workflow without overwhelming?* Assemble it one
   element at a time → the viewer builds the chain at the pace they watch it.
3. *In what order?* Flow order — block, feeding wire, next block → the assembly
   *is* the data path; you read a pipeline, not a pile of boxes.
4. *How fast?* ~1.2s gaps, slow enough to name each part → the build carries the
   narration and nearly fills the window, so the hold can be short.
5. *How many analyst lanes?* One → teach the structure (a lane the container
   replicates), not five hardcoded copies; the fan is the run's job.
6. *What's in each block?* Registry-true rows from `data.ts` → every block is a
   specific, grounded Sim block, never a designed placeholder.
7. *How does it end?* On a settled, idle desk → extend-safe for the voiceover.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. The camera move and the assembly look like
two ideas, but they're one — *the desk growing around the board* — and the whole
scene is that single move executed with restraint.

## Exit state (what scene 3 inherits)

`table assembled (top of frame) · chain fully assembled and idle · one analyst
lane · no run, no fills · CAM_ALL`. Scene 3 (`wired-by-reference`) opens on
exactly this frame at exactly this framing — it doesn't move the camera at all,
it dims the world to 0.35 and brings up the editor card. Because both scenes
render the same set piece at the same camera, that boundary is identical down to
the pixel (`2→3` in the continuity contract: chain assembled idle, CAM_ALL).
