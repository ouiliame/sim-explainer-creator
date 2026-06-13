# Scene 2 — `the-fleet-takes-shape`  ·  archetype: **assemble + camera ease**

Source: `../source/scenes/FleetTakesShapeScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`.

This is the build scene: the second scene of the video, and the one that turns
"here's a backlog" into "here's the fleet that clears it." It does two things at
once — a camera move and an assembly — but they're the *same* idea (the workflow
growing around the table), so it stays inside the one-idea rule. Read it as the
worked example of how to introduce a whole workflow without overwhelming the
viewer. If you've read the market-desk twin (scene 2, `the-desk-takes-shape`),
this is the same shape — the differences are what's worth your attention: a
three-block lane instead of two, a query feeding the container instead of a
market pull, and a slightly deeper camera move.

---

## What this scene is for

Scene 1 planted a question: a backlog of issues, every row `open`, every PR
cell empty, and a table that can't fill them. This scene answers "who fixes
those?" by assembling the thing that will — the fleet. But it answers it as a
*picture of a workflow*, not a list of features. The point the scene has to land
is **the fleet is one chain**: a clock, a query that pulls the open issues, and
a container holding a single coding lane. Everything is in service of that one
read.

So the rule the scene follows is still *one idea per scene* — the idea here is
"the fleet is this shape." It is deliberately runless: nothing executes, no
status flips, no PR fills, no ring lights. We're introducing the apparatus, not
running it. Resist the urge to also fire the schedule or light a wire "to show
what it does" — that's scenes 5 onward. This scene only builds.

## What it looks like

The camera pulls back. The table — which filled the frame in scene 1 — glides
up to the top of frame and shrinks to its home size, and as the empty space
opens up beneath it, the workflow assembles into that space, left to right, in
the order data flows: a **Schedule** block appears, a wire draws to a **Get
Issues** table block, a wire draws to the **Fleet** container (a yellow Split
chip and an inner Start pill), and inside the container one lane builds — an
inner wire, an **Engineer** agent (with a GitHub tool chip), a wire, a
**GitHub** block, a wire, and a **Mark Done** table block. Then it rests.

## The one real decision: it's all a camera move, not a layout change

The scene renders this:

```tsx
<Stage
  cam={camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut))}
  sched={{opacity: schedIn}}
  query={{opacity: queryIn}}
  cont={{opacity: contIn}}
  edge1={{progress: edge1}}
  edge2={{progress: edge2}}
  lanes={{2: {eng: {opacity: engIn}, gh: {opacity: ghIn}, md: {opacity: mdIn},
             edgeIn: {progress: edgeIn}, edgeA: {progress: edgeA},
             edgeB: {progress: edgeB}}}}
/>
```

Two things to take from this.

**The table does not move. The camera does.** This is the part people get
wrong. The instinct, when you want the table to "go to the top so the chain has
room," is to animate the table's `top` from 150 down to a smaller number — to
*relayout*. Don't. The table's stage coordinates (`TABLE_X = 890`,
`TABLE_Y = 150`) never change in this scene or any other. What changes is the
camera: it eases from `CAM_TABLE` (centered on the table, zoomed to 1.35×) to
`CAM_ALL` (centered on the whole set piece at 0.7×). Because the camera now
frames a taller region of fixed geometry, the table — which lives at the top of
that geometry — *ends up* near the top of frame, smaller. The glide is real,
but it's the viewport moving over a still world, not the table moving.

> *"Why does that distinction matter so much?"* Because it's the rule that makes
> continuity free across the whole video. The set piece is one fixed layout
> (`layout.ts`, a 2820×1500 stage); every scene is a `camMix` over that same
> geometry plus state props. If scenes moved elements around to "make room,"
> every cut would be a potential layout jump, and you'd be hand-checking each
> boundary. By making the only spatial change a camera transform, the table at
> the end of scene 1 and the table at the start of scene 2 are the *same object
> at the same coordinates* — the boundary is identical by construction. Once, in
> `cameraTo`; never again.

**Every block is already present in the layout — this scene just fades them
in.** Schedule, Get Issues, the container, and the inner lane all live at fixed
positions in `layout.ts` and are rendered by the *same* `<Stage/>` scene 1
rendered (where they were gated to zero opacity). Here they come up on opacity
ramps. Nothing mounts mid-video; visibility is animated, never existence. Notice
the gating is literal: every block in the rig is wrapped in `visOpacity(x) > 0 ?
… : null`, so when its opacity ramp still reads 0 the element isn't even in the
tree — but the *layout coordinates it will occupy* are fixed regardless, so when
it does fade in, it fades in exactly where the geometry says it belongs.

## The camera, completed

```ts
cam = camMix(CAM_TABLE, CAM_ALL, ramp(t, 0.3, 2.4, EASING.inOut))
// CAM_TABLE = { px: 1410, py: tableCenter().y, s: 1.35 }
// CAM_ALL   = { px: 1395, py: 740,             s: 0.7  }
```

This is the second half of the move scene 1 set up. Scene 1 deliberately framed
the table large (1.35×) so this scene could pull back to neutral (0.7×), and
that pull-back is what makes the fleet feel like it *grows around* the backlog
rather than appearing beside it. `camMix` linearly interpolates all three camera
fields (`px`, `py`, `s`) by a single mix value; here the mix is
`ramp(t, 0.3, 2.4, EASING.inOut)` — 0 to 1 over **0.3s → 2.4s**, eased in-out.

> *"Why is this pull-back bigger than market-desk's?"* It is — market-desk eased
> 1.1×→0.78× (a 0.32 spread), this eases 1.35×→0.7× (a 0.65 spread, nearly
> double). The reason is the set piece is *bigger*: market-desk's chain is one
> two-block lane in the container; this one's lane is three blocks wide, so the
> Fleet container is wider, the whole stage is 2820 across instead of 2400, and
> home framing has to back further out to fit it. The scene-1 hero zoom was set
> *against* this required home zoom — you pick `CAM_ALL` first (it's derived,
> below) and then choose a scene-1 zoom far enough above it that the pull-back
> registers as a move. A bigger world earns a bigger move.

> *"Why ease this one when scene 1's fades were left linear?"* Because this is a
> *move through space* — the framing travels and the zoom changes — and motion
> through space wants momentum: a gentle start, a glide, a gentle stop.
> `EASING.inOut` (`bezier(0.65, 0, 0.35, 1)`) gives exactly that S-curve. The
> project rule is consistent: `EASING.inOut` for camera moves and transforms,
> `EASING.out` for entrances, plain linear for fades and wire draws (which have
> no spatial momentum to shape). A linear camera pull would start and stop
> abruptly and read as mechanical.

> *"Why start at 0.3 and finish at 2.4 — why those bounds?"* The 0.3s lead-in is
> a held beat on scene 1's exit frame before anything moves, so the cut doesn't
> feel like it yanks the camera the instant the scene starts. The 2.4s landing
> is chosen against the assembly: the first block (Schedule) starts fading in at
> 2.0s, while the camera is still on its last few frames of settling, and
> finishes (2.6s) just after the camera has arrived. So the camera *gets out of
> the way* before the chain becomes the focus — you're never asked to track a
> moving frame *and* read a new block at the same time. (The choreography note
> calls this "a deliberate handoff": camera settles at 2.4, first block lands
> 2.0–2.6.) Too short a move (say ending at 1.0s) and the pull-back feels
> hurried, not a "settle in"; too long (4s+) and you're watching an empty pan.

> *"Why 0.7× for CAM_ALL?"* It's derived, not picked. `CAM_ALL` frames the whole
> content bounding box, and 0.7 is the zoom at which that box — table at the top
> plus the full three-block-wide Fleet container at the bottom (its right edge is
> 2700, with a deliberate 120px stage margin) — fits the 1920×1080 viewport with
> a comfortable margin. The center `(1395, 740)` is the box center, nudged
> slightly right of the table's own center (1410) because the container is the
> heavier element below. This is the video's *home* framing — scenes 3, 4, 5, 8,
> 9 all return to it (9 eases ~6% further out for the bookend) — so it earns
> being the neutral the camera resolves to.

## The values, and why each block is grounded

Every block on screen is a real Sim block fed registry-true content from
`data.ts`. None of it is designed; all of it is configured. The chain, in flow
order:

**Schedule** — `BLOCK_COLORS.schedule = #6366F1`, the indigo schedule chip, with
two rows from `SCHED_ROWS`:

| Run Frequency | Daily |
|---|---|
| Time | 12:00 AM |

The titles are verbatim from the registry (`schedule.ts`); `Daily` / `12:00 AM`
are the configured values that make this a *nightly* clock — the whole "overnight
fleet" premise is this one row. This block has `hideTargetHandle` set, because
it's the *entry* of the chain — nothing flows into a clock.

**Get Issues** — `BLOCK_COLORS.table = #10B981`, the green table block (the same
block type as Mark Done downstream — Sim's one Table block, configured two
different ways), with the lucide Table glyph and two rows from `QUERY_ROWS`:

| Operation | Query Rows |
|---|---|
| Filter | status = 'open' |

`Query Rows` is the registry operation that reads the backlog; `Filter |
status = 'open'` is doing real work — it's *why* only the open issues enter the
fleet, and it's the visual echo of scene 1's `open` status column. The block's
output is the `rows` array, which is what the container will later wire to by
reference (`<getissues.rows>`) — but that wiring is scene 3's job, not this one.

> *"Why is this a Get Issues block and not market-desk's Polymarket pull?"* Same
> structural slot — the chain's middle block is "the thing that fetches the batch
> the container fans over" — but the *source* differs by topic. Market-desk pulls
> external markets from an API block; swe-fleet pulls internal rows from its own
> backlog table with a Table query. The shape of the scene is identical; only the
> grounded block changes. That's the whole point of porting onto the same arc:
> the structure transfers, the product truth is re-derived per topic.

**Fleet** — the Parallel container. Its identity comes from
`parallel-config.ts`: the `SplitGlyph` (lucide SplitIcon) on a
`PARALLEL_COLOR = #FEE12B` chip, drawn *dark* on the light yellow per the
product's luminance rule. Inside its header sits the name `Fleet` (a user-named
block — product-legal); over its body sits the inner **Start** pill, which is
the parallel's own entry point.

**Engineer** — `BLOCK_COLORS.agent = #33C482`, the green agent block. Two rows
plus a tools line:

| Messages | `Fix <parallel.currentItem>` |
|---|---|
| Model | claude-sonnet-4.6 |

with a single tool chip **GitHub** (`GITHUB_COLOR = #181C1E`, the near-black
chip with the verbatim GithubIcon path, white-filled). The `Messages` value is
the verb `Fix ` followed by the reference tag `<parallel.currentItem>` — the
per-instance issue each engineer receives. In this scene the tag renders as a
plain `<Tag>` (no resolved value yet); it only resolves to `[row 3]` in scene 6
once the run fans.

> *"market-desk's twin showed the Messages tag *bare* — why does this one keep
> the `Fix ` verb prefix?"* Because the geometry allows it here. In market-desk
> the agent block's `Messages` row was narrower and a verb prefix truncated the
> tag mid-name on render, so it was shown bare. Here the block is the same
> `SimBlock` but the row fits `Fix <parallel.currentItem>` without clipping, so
> the more natural instruction phrasing is kept. The lesson isn't "always prefix"
> or "never prefix" — it's *trust the rasterizer*: whichever renders clean is
> correct, and you verify by opening the still, not by reasoning about it.

**GitHub** — `GITHUB_COLOR = #181C1E`, the GitHub block, with the verbatim
GithubIcon path and two rows from `GH_ROWS`:

| Operation | Create pull request |
|---|---|
| Repository | acme/api |

`Create pull request` (`github_create_pr`) is the registry operation, and its
`number` output is what later fills the table's PR column. `Repository |
acme/api` uses the landing templates' own GitHub-block row style (`org/repo`).
This is the block that makes "the fleet opens a PR" a *drawn, countable* beat
rather than something hidden inside the agent's tool calls — which is exactly why
GitHub appears twice in the lane (as the Engineer's tool chip *and* as its own
block): the chip is "the agent can reach GitHub," the block is "the PR is a
first-class step in the chain."

**Mark Done** — `BLOCK_COLORS.table = #10B981`, the green table block again, two
rows from `MD_ROWS`:

| Operation | Update Row by ID |
|---|---|
| Row Data | `{"status": "done", …}` |

`Update Row by ID` (`update_row`) is the honest write operation: find the issue's
own row and flip it. The Row Data is shown truncated — and that's fine, because
the full value (`status: done` plus the PR number) lands in the table row it
writes to, which is simultaneously on screen in every run scene. This block has
`hideSourceHandle` set: it's the *end* of the lane, nothing flows out of it.

> *"Why show the full row content on every block in a runless scene — isn't that
> a lot of text to read?"* Because the rows are what make each block a *specific*
> block instead of a generic box. "Schedule" is just a word; "Schedule · Run
> Frequency Daily · Time 12:00 AM" is a nightly clock you understand. "Mark Done"
> is a label; "Mark Done · Update Row by ID · `{status: done}`" is a write you
> can see. The narration will name each block as it lands, and the row underneath
> is the proof of what the word means. This is the assembly scene; it's the one
> place the viewer is *supposed* to read the configuration, because every later
> scene assumes they already did.

> *"`{"status": "done", …}` is written here — isn't that a value the run hasn't
> produced?"* No, and the distinction is the same honesty rule as scene 1. The
> `{"status": "done", …}` in Mark Done is an *authored example of the JSON shape*
> — it's showing you what the block *writes*, structurally, not a live result.
> The board's status column is still `open` on every row in this scene, and the
> PR column is still empty, because no run has happened. Nothing on screen is a
> value a run produced, because no run has produced anything yet. The block
> configs describe what *will* happen; the table shows what *has* happened, which
> here is nothing.

## Why ONE lane, not the fan

The container holds a single coding lane — Engineer → GitHub → Mark Done — and
only one. The five-wide fan (one engineer per issue) does not exist in this
scene. It doesn't exist in the layout as drawn content at all: the rig gates the
four ghost lanes behind `fan > 0` (`{fan > 0 ? […].map(ghostLane) : null}`), and
`fan = 0` here, so `laneTop(2, fan)` places the one followed lane and nothing
else is on canvas. The four ghosts only emerge at runtime in scene 6.

> *"Why hide the fan here? Isn't 'five concurrent engineers' the whole point?"*
> It is the point — *later*. The fan is what the parallel *does when it runs*;
> the lane is what the parallel *is*. This scene teaches the structure, and the
> structure is one lane that the container will replicate. Drawing five lanes now
> would say "there are five hardcoded engineers," which is the wrong mental model
> — the truth is one lane, fanned at runtime over whatever issues the query
> returns. Show the template; let the run show the copies. (This is a literal
> rule from the rejection history — the canvas shows one lane, the fan is runtime
> animation only.)

> *"Why is the followed lane #2 specifically, the middle one?"* Because when the
> fan does open in scene 6, the ghosts emerge symmetrically — two above, two
> below — from behind the followed lane, which sits at the body's vertical center
> (`MID_TOP`, derived so the five-lane stack is balanced about the container's
> middle). Choosing the center lane as the one we follow means the fan opens like
> a hand spreading, evenly, rather than lopsided. That choice is *made here*, in
> the one lane this scene draws, even though its payoff is three scenes away —
> which is the continuity discipline in miniature: the single lane is positioned
> for the fan it will become.

## The animation, beat by beat

One helper does all the timing here. `ramp(t, t0, t1, easing?)` goes from 0 to 1
as the clock `t` (in seconds) crosses `t0`→`t1`, clamped outside that window,
with an optional easing curve. Entrances use `EASING.out`; wires use no easing.
That's the whole vocabulary for this scene — eleven ramps and one camera mix.

### (a) The assembly order *is* data flow

The blocks come in left to right in the order data moves through them, and the
lane inside the container assembles the same way — eleven entrances, alternating
wire then block:

```ts
schedIn = ramp(t, 2.0,  2.6,  EASING.out)   // Schedule
edge1   = ramp(t, 3.2,  3.8)                // → Get Issues
queryIn = ramp(t, 4.2,  4.8,  EASING.out)   // Get Issues
edge2   = ramp(t, 5.6,  6.2)                // → Fleet container
contIn  = ramp(t, 6.6,  7.4,  EASING.out)   // Fleet container
edgeIn  = ramp(t, 8.4,  9.0)                // inner pill wire
engIn   = ramp(t, 9.0,  9.6,  EASING.out)   // Engineer
edgeA   = ramp(t, 10.6, 11.1)               // lane wire A
ghIn    = ramp(t, 11.1, 11.7, EASING.out)   // GitHub
edgeB   = ramp(t, 12.8, 13.3)               // lane wire B
mdIn    = ramp(t, 13.3, 13.9, EASING.out)   // Mark Done
```

Read the centers: Schedule (~2.3), edge (~3.5), Get Issues (~4.5), edge (~5.9),
container (~7.0), inner wire (~8.7), Engineer (~9.3), lane wire A (~10.9),
GitHub (~11.4), lane wire B (~13.1), Mark Done (~13.6). Block, then the wire
that feeds the next block, then that block — all the way down, twice over: once
for the outer chain (Schedule → Get Issues → container) and once for the inner
lane (pill → Engineer → GitHub → Mark Done).

> *"Why assemble in flow order instead of, say, all the blocks then all the
> wires?"* Because flow order tells a story and the alternatives don't. "Clock →
> query → fleet → read → PR → mark done" is a sentence; the viewer assembles the
> *meaning* of the chain at the same pace they watch it draw. If all the blocks
> popped in and then the wires connected them, you'd read "six boxes" first and
> "a pipeline" second — two reads where flow order gives you one. The wire
> drawing *between* two blocks, in the gap, is the literal claim "this feeds
> that," made visually.

> *"Why does the wire start the *same frame* its destination block does — edgeA
> ends at 11.1 and GitHub starts at 11.1?"* Look at the pattern: each wire's ramp
> *ends* exactly where its destination block's ramp *begins* (edge1 ends 3.8,
> Get Issues starts 4.2 — a tiny 0.4s gap; edgeIn ends 9.0, Engineer starts 9.0
> — flush; edgeA ends 11.1, GitHub starts 11.1 — flush). The wire finishes
> drawing to the empty slot, and the block fades in *as the wire arrives*, so the
> connection reads as "the wire reaches a spot, and a block appears there because
> the wire reached it." Causality, drawn. (The choreography calls this
> wire-then-block alternation: each edge finishes drawing the frame its
> destination block starts fading in.)

> *"Why are entrances eased (`EASING.out`) but wires aren't?"* A block fading and
> settling in is an arrival — `EASING.out` (`bezier(0.16, 1, 0.3, 1)`)
> front-loads the motion so it appears quickly then eases to a stop, the standard
> entrance feel. A wire isn't arriving in space; it's *drawing* — `progress`
> sweeps the path from 0 to 1 (start handle to end handle) at a steady rate, like
> a line being drawn with a pen. Easing a draw would make the pen lurch. Same
> principle as scene 1: ease things that travel, leave linear the things that
> just reveal or draw.

### (b) The cadence: ~1.0–1.4s between elements, and why it's slow

The gap between the *center* of one element and the next runs about 1.0 to 1.4
seconds — Schedule center to edge1 center is ~1.2s, edge1 to Get Issues ~1.0s,
Get Issues to edge2 ~1.4s, edge2 to container ~1.1s, then a ~1.7s reach into the
container before the inner wire, ~0.6s pill-wire to Engineer, ~1.6s to lane wire
A, ~0.5s to GitHub, ~1.7s to lane wire B, ~0.5s to Mark Done. The whole assembly
spans 2.0s to 13.9s — nearly twelve seconds for eleven elements.

> *"Why so slow? An assembly could run at 0.6–0.8s gaps."* Because each element
> here has to be *nameable*. This is the scene where narration introduces the
> fleet's parts — "a clock fires every night, a query pulls the open issues, a
> container holds one coding lane: read, fix, PR, mark done" — and the narration
> needs a beat per noun to land it. At 0.6s gaps the chain assembles in under
> seven seconds and the voiceover is racing to keep up, or the blocks are all on
> screen before they're spoken about. At ~1.2s gaps the assembly *nearly fills
> the narrated window*, which is the other reason it works: this scene's hold is
> short precisely because the build itself carries most of the runtime. The slow
> cadence buys two things at once — clarity for the narration and a scene that
> doesn't die waiting. (The VO-stretched scene runs 18.8s; the 12s build plus a
> ~4.9s hold fits that window.)

> *"The inner-lane pairs are tight — Engineer is 0.6s after its wire, GitHub
> 0.5s, Mark Done 0.5s — why aren't those ~1.2s like the rest?"* Because inside
> the container the wire and its block are a *single* beat, not two. The flush
> wire→block pairs (edgeIn→Engineer, edgeA→GitHub, edgeB→Mark Done) are paced so
> the wire draws and the block lands as one gesture, ~0.6s apart, and then the
> *gap to the next pair* carries the ~1.6s spacing (Engineer to edgeA is 1.6s,
> GitHub to edgeB is 1.7s). So the rhythm isn't even per-element; it's even
> per-*step* — read-fix, PR, mark-done — three steps the narration names, each a
> tight wire+block unit with breathing room between units. The cadence tracks the
> meaning, not a metronome.

### (c) The reach into the container

Notice the largest single gap: the container finishes coming in at 7.4s, but the
inner pill wire doesn't start until 8.4s — a held ~1.0s beat with the container
present and empty before its interior begins to build.

> *"Why pause there?"* Because the container is a context switch — the eye has to
> move *inside* a box and re-scope to a smaller world. Holding a beat on the
> empty container says "now we go in here," and lets the viewer register the
> container as a container (a thing with an interior, with its own Start pill)
> before that interior fills. Building the inner lane the instant the box arrives
> would collapse "here's a container" and "here's what's in it" into one
> unreadable moment. The inner assembly then runs in the same flow order at the
> same per-step cadence — pill wire → Engineer → wire → GitHub → wire → Mark Done
> — a small three-block chain echoing the outer one. Note this reach is a touch
> longer than market-desk's (~1.0s here vs ~0.8s there): the inner lane is
> longer (three blocks, not two), so the "we're going in" beat earns a little
> more air before a longer build.

### (d) The hold — from ~13.9s to the end of the scene

After Mark Done lands at 13.9s, nothing moves. The assembled fleet just rests
(~4.9s of hold in the shipped timing, 13.9→18.8).

> *"Isn't that dead air?"* It's the scene's weakest beat — the choreography note
> flags it as "dead; over cap," same as scene 1's tail. The defense is
> structural: the assembly is twelve seconds of continuous build, so by the time
> it settles, most of the scene's runtime is spent and the hold is comparatively
> short. The hold still earns its place: it's where the narration finishes naming
> the chain (summarizing the lane — "read, fix, PR, mark done"), and — same as
> scene 1 — a scene that ends on a settled, motionless state can be *extended* to
> fit however long the voiceover runs without freezing a motion mid-flight.
> "Ends on a latched settle" is the property that makes the audio step downstream
> painless; every scene in this video has it. If you were to improve this scene,
> the hold is where you'd add a faint ambient (a slow breathing on the container
> outline, say) rather than leaving it ambient-dead — but you would *not* add a
> second idea.

## How to think about the whole scene

Walk the decisions in order and you can see there's a question driving each one:

1. *How do I make room for the chain?* Pull the camera back over fixed geometry
   → the table glides up as a camera move, layout never changes, continuity free.
2. *How do I introduce a whole workflow without overwhelming?* Assemble it one
   element at a time → the viewer builds the chain at the pace they watch it.
3. *In what order?* Flow order — block, feeding wire, next block → the assembly
   *is* the data path; you read a pipeline, not a pile of boxes.
4. *How fast?* ~1.2s gaps between steps, slow enough to name each part → the
   build carries the narration and nearly fills the window, so the hold is short.
5. *How many coding lanes?* One → teach the structure (a lane the container
   replicates), not five hardcoded copies; the fan is the run's job. And it's the
   *center* lane, positioned for the symmetric fan it becomes.
6. *What's in each block?* Registry-true rows from `data.ts` → every block is a
   specific, grounded Sim block (a nightly clock, an open-issue query, a PR, a
   row write), never a designed placeholder.
7. *How does it end?* On a settled, idle fleet → extend-safe for the voiceover.

Every one of those is a small decision, and the quality of the scene is the sum
of getting each small decision right. The camera move and the assembly look like
two ideas, but they're one — *the fleet growing around the backlog* — and the
whole scene is that single move executed with restraint.

## Exit state (what scene 3 inherits)

`table assembled (top of frame) · chain fully assembled and idle · one coding
lane (Engineer → GitHub → Mark Done) · no run, no fills · CAM_ALL`. Scene 3
(`wired-by-reference`) opens on exactly this frame at exactly this framing — it
doesn't move the camera at all, it dims the world to 0.35 and brings up the
editor card (the `<getissues.rows>` reference that wires the query to the
container). Because both scenes render the same set piece at the same camera,
that boundary is identical down to the pixel (`2→3` in the continuity contract:
chain assembled idle, CAM_ALL).
