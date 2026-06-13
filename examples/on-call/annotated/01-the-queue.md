# Scene 1 — `the-queue`  ·  archetype: **table-hero assemble**

Source: `../source/scenes/TheQueueScene.tsx`, `../source/data.ts`,
`../source/layout.ts`, `../source/scenes/_rig.tsx`, `../source/scenes/_beats.ts`.

This is the opening scene, and like every good opener it does exactly one thing:
it puts the **problem object** on screen as a concrete thing you can point at.
The problem here is a queue of firing incidents at 3 a.m. Read this scene as the
worked example of "how do I open on the thing the whole video is about, and make
the viewer feel the weight of it without a single word."

---

## What this scene is for

The video's whole story is "six incidents are firing → here's the one workflow
that triages all of them." So the first scene has to make the **firing queue** a
real object — the incidents table — and, this is the load-bearing part, it has
to make you feel that the `status` column is the job. Every row says `firing`.
That column full of `firing` is a question planted in your head ("who clears
these?"), and the rest of the video is the answer: that exact column draining
`firing → triaged → assigned`, row by row, is the spectacle the whole thing
builds toward.

So the rule the scene follows is *one idea per scene*: this scene is "here is the
queue, and it's all on fire," full stop. No workflow, no run, no agent. Those get
their own scenes. The temptation is to start assembling the machine here because
it's exciting — resist it. The machine means nothing until you've felt the
problem it solves.

## What it looks like

A three-column table — `incident · service · status` — hero-framed, filling most
of the frame. Six rows. The `incident` and `service` cells are real titles
(`HTTP 500 /payments` / `payments-api`, and five others); every `status` cell
reads `firing`. The table chrome fades in, the six rows populate top to bottom,
then the entire `status` column takes one collective blue selection-tint pulse —
the column lights up as a unit, holds, releases — and the table sits.

## The one real decision: render the whole set piece, show only the table

The scene renders this and almost nothing else:

```tsx
<Stage
  cam={CAM_TABLE}
  webhook={{opacity: 0}}
  agent={{opacity: 0}}
  terms={[{opacity: 0}, {opacity: 0}, {opacity: 0}]}
  edge1={{progress: 0}}
  fans={[{progress: 0}, {progress: 0}, {progress: 0}]}
  tableIn={tableIn}
  rowReveal={rowReveal}
  statusColHi={colHi}
/>
```

Two things to take from this.

**Use `SimTable`, the real product table — never a hand-built grid.** The
incidents queue is a Sim table (the workspace's own incident surface — the
swe-fleet scoreboard role), so the surface on screen is the actual `SimTable`
component, fed real columns and rows. The columns come from `data.ts`
(`INCIDENT_COLUMNS = incident / service / status`, all `type: "text"`); the rows
come from `incidentRows(statusAt)` with `statusAt` defaulting to `() => "firing"`.
You are never designing a table here; you're configuring the one that exists.

**Notice the entire workflow — webhook, agent, three terminals, both edges — is
present, just at `opacity: 0` / `progress: 0`.** This is the part people get
wrong. The instinct is "scene 1 is only the table, so only render the table."
Don't. There is *one* set piece (`<Stage/>`) for the whole video, and every scene
renders all of it, turning pieces on and off with state props. Here the entire
left-hand machine is rendered but invisible.

> *"Why bother rendering things I can't see — and at a camera framing where
> they're off-screen anyway?"* Because of what happens at the cut into scene 2.
> Scene 2 eases the camera out from the table to the home framing and assembles
> the machine into the revealed space. If scene 1 didn't render the machine at
> all and scene 2 suddenly mounted it, you'd risk a one-frame jump — the table
> reflowing as siblings mount, a layout shift, a flash. By rendering the same
> single set piece in both scenes and only animating visibility and camera, the
> boundary between them is identical by construction. Continuity stops being
> something you check and becomes something you can't break.

## The camera

```ts
cam = CAM_TABLE = {px: TABLE_X + TABLE_W/2, py: TABLE_Y + TABLE_H/2 + 10, s: 1.04}
```

The camera is a transform of the fixed layout: `px, py` is the stage point that
ends up in the center of frame, `s` is the zoom. Here it's centered on the table
(its own center, nudged `+10px` down so the visual mass sits dead-center given
the header) at **1.04×**.

> *"Why 1.04 and not just 1.0?"* The table is the hero of this scene, so it's
> framed a hair larger than neutral — enough that the six rows fill the frame and
> you read the queue as *crowded*, which is the emotional point (it's a lot of
> incidents). The home framing the rest of the video sits at is `CAM_ALL` at
> `0.665` — much wider, because it has to hold the whole machine plus the rail.
> The gap between `1.04` here and `0.665` next scene is deliberate: scene 2 eases
> the camera *out* from `CAM_TABLE` to `CAM_ALL`, and that pull-back is what makes
> the machine feel like it's *growing in beside* the queue rather than just
> appearing. So this scene's zoom isn't arbitrary; it's the first half of a
> camera move that completes in scene 2.

> *"Why is the camera locked — no move — in the opening scene?"* Because the
> problem object deserves a still frame. Nothing is happening *to* the queue yet
> (no run, no fix); it's just *there*, on fire. A static frame says "look at
> this, sit with it." Movement is for when something is happening; stillness is
> for when something *is*.

## The values, and where they come from

All six rows live in `data.ts` (every on-screen value traces to there). These are
declared **authored stand-ins** — no real run artifact exists, so the incident
titles are Sentry-issue-flavored inventions, not real data:

| # | incident | service | status |
|---|---|---|---|
| 1 | TypeError: cart is null | checkout-api | firing |
| 2 | TimeoutError: redis | cache | firing |
| 3 | **HTTP 500 /payments** | **payments-api** | firing |
| 4 | OOMKilled: worker-7 | jobs | firing |
| 5 | QueryTimeout: orders | orders-db | firing |
| 6 | CORSError: /api/auth | web-app | firing |

> *"Why are the incident titles invented rather than real?"* Because there is no
> real run behind this video — it was built without a live workflow to harvest
> real Sentry payloads from. The `⟨pending⟩` rule says: anything run-derived that
> can't be grounded stays a declared stand-in, shaped to look right and named in
> `data.ts` + `demo-corpus/README.md`, never passed off as real. Incident titles
> shaped like real Sentry issues (`TypeError: cart is null`,
> `HTTP 500 /payments`) read as authentic without claiming to be a specific real
> incident. The *column names* and the *status vocabulary*, by contrast, are
> deliberate: `incident / service / status` is plain table design, and
> `firing → triaged → assigned` is the authored lifecycle the whole video flips.

> *"Why is the status vocabulary lowercase plain text, not styled badges?"*
> Because that's the module-2 / swe-fleet status-cell style — a status is just
> the cell's own text, and a flip is a dip-swap of that text. Dressing each
> status as a colored pill would be designing a component the product doesn't
> have. The only color a flipped cell ever gets is the transient green *output
> tint* (scene 5), and that decays to a faint residue — it's a write marker, not
> a badge.

> *"Why is row 3 the one that gets followed later?"* `FOLLOWED_ROW = 2`
> (zero-indexed → display row 3), `HTTP 500 /payments`. It's the third of six —
> roughly central, so when scene 3 highlights it the selection lands in the body
> of the table, not at an edge; and a `500` on a payments API is the most legibly
> *urgent* of the six, which makes it the natural one to follow. The remaining
> five flip in scene 6 in a scrambled order (`CADENCE_ORDER = [4,0,5,1,3]` →
> display rows 5,1,6,2,4) — deliberately *not* top-to-bottom, because real alerts
> arrive in arrival order, not queue order. But that's scene 6's problem; here
> all six just read `firing`.

## The animation, beat by beat

The whole scene is built from two helpers in `_beats.ts`. `ramp(t, t0, t1)` goes
from 0 to 1 as the clock `t` (seconds) crosses `t0`→`t1`, clamped outside — and
it defaults to **linear** (easing is only passed where it matters, which here is
nowhere). `pulse(t, t0, t1, up, down)` rises over `up` seconds starting at `t0`,
holds, then releases over `down` seconds starting at `t1`. That's the whole
vocabulary.

### (a) The table chrome fades in — `tableIn = ramp(t, 0.3, 0.9)`

The entire table's opacity comes up over **0.3s → 0.9s**.

> *"Why start at 0.3 instead of 0.0?"* A short beat of empty frame before anything
> appears reads as a deliberate open. Starting at 0.0 makes the first frame feel
> like the render was already mid-load. (Compare scene 3's webhook blip at `1.2`
> and the market-desk table at `0.2` — every opener holds a beat of stillness
> before the first thing arrives.)

> *"Why ~0.6 seconds — why not snappier?"* This is the establishing shot. It gets
> a calm entrance. And `tableIn` drives the *whole table box's* opacity (the
> `<div>` wrapping `SimTable` in the rig is `opacity: tableIn`), so the chrome —
> grid lines, header, the rounded border — arrives as one piece. The *rows*
> populate separately on top of it (next beat), so you read "a table appeared,
> then filled," the product's own loading feel.

> *"Why no easing curve?"* A fade has no spatial momentum — nothing travels
> through space, only opacity changes — so an ease would be invisible. Easing is
> for things that move; a plain opacity ramp is left linear. This is also why
> `ramp` defaults to linear and the scene never overrides it: there's nothing
> here that travels.

### (b) The six rows populate top to bottom — `rowReveal(r) = ramp(t, 1.0 + 0.3r, 1.5 + 0.3r)`

Each row reveals on its own 0.5-second ramp, and each starts **0.3 seconds after
the one above it**. Row 0 reveals over 1.0→1.5s, row 1 over 1.3→1.8s, down to row
5 over 2.5→3.0s. `rowReveal` is wired into `SimTable` two ways: as `cellOpacity`
(the whole cell fades) and folded into `cellTextOpacity` via the rig's `textOp`
helper (`rev * statusTextOp(r)` — though `statusTextOp` is unused here so it's
just `rev`). Because the chrome came in first (step a), what you see is content
*populating into* an already-present table.

> *"Where does the 0.3s stagger come from?"* It's chosen, not derived — against
> two constraints. Too small (say 0.1s) and the six rows arrive almost together,
> reading as one block; you can't feel that there are six distinct incidents. Too
> large (say 0.8s) and the table takes five-plus seconds to fill, dead time over
> a still camera. 0.3s is fast enough to feel alive, slow enough that your eye
> lands on each incident in turn — and feeling that there are *six* of them, one
> after another, is exactly the weight this scene wants. Once you pick a stagger
> you like, reuse it: this same 0.3s pitch is the table-row cadence, distinct
> from scene 2's ~0.9s block-assembly pitch (blocks are bigger events, so they
> get more air).

### (c) The status column pulses as a unit — `statusColHi = pulse(t, 6.0, 9.0)`

This is the scene's one gesture. The entire `status` column takes a collective
blue selection tint: it rises over **6.0 → 6.35s** (the default `up = 0.35`),
holds, and releases over **9.0 → 9.6s** (the default `down = 0.6`). It's passed
as `statusColHi`, and in the rig that becomes a `cellHi(c, r)` that returns
`colHi` for every cell in `STATUS_COL` (column 2) across all six rows:

```ts
const cellHi = (c, r) => Math.max(rowHi ? rowHi(r) : 0, c === STATUS_COL ? statusColHi : 0)
```

Feeding `SimTable` the same highlight value down a contiguous run of cells makes
it draw the product's **range outline** — one outline around the whole column,
not six separate boxes. `SimTable` does this by suppressing the border edges that
face another highlighted cell (`bw.top = hiAt(ci, ri-1) > 0 ? 0 : 2`), exactly
the product's contiguous-selection behavior. With no words, this says "this
column — all of it — is the thing that matters."

> *"Why those numbers — why does it fire at 6.0 when the rows finished at 3.0?"*
> Because the reveal and the column gesture are two different ideas, and
> overlapping them would blur both. Let the table fully arrive and settle (done
> at 3.0), hold ~3 seconds of stillness, *then* make the one selection gesture.
> The 6.0 anchor is also timed under the narration line "each one needs the same
> first response" — the column lights exactly as the voiceover names what the
> column *is*. Stacking two animations in the same moment is the most common way
> a scene starts to feel busy; giving each idea its own air is the discipline.

> *"Why the whole column and not, say, each cell pulsing in turn?"* Because the
> claim is "all six need the *same* response" — they're one job, not six jobs.
> One collective outline says that. Pulsing them individually would say "six
> separate things," which is the opposite of the point. The column *is* the job;
> highlight it as one object.

> *"Why does it release before the cut (down over 9.0→9.6)?"* So the 1→2 boundary
> is clean. Scene 2 opens on the settled table with no selection, eases the camera
> out, and assembles the machine. If the column highlight were still up at the
> cut, scene 2 would either have to carry it (clutter it doesn't want) or drop it
> (a one-frame pop). Releasing it inside scene 1 means the exit state is "plain
> settled table," which is exactly scene 2's enter state.

### (d) The hold — from ~9.6s to the end of the scene (15.4s)

After the column releases, nothing moves. The all-`firing` queue just sits.

> *"Isn't ~5.8 seconds of dead frame a problem?"* Honestly — yes, a little, and
> the choreography notes flag it. This is the one place to learn from the build's
> *mistake*, not just its craft. The scene's authored visual minimum was 11s, but
> the VO sync stretched it to 15.4s (extend-only: each scene's final length is
> its narration length), and all that extra time pooled at the end as a static
> hold. The honest fix, named in `VOICEOVER.md` and the choreography's
> anti-pattern note, is to *re-pace the beats to span the narrated duration* —
> spread the row stagger and the column pulse across the whole 15.4s instead of
> finishing everything by 9.6 and sitting. If you imitate this scene, do that:
> don't let the slack pool. (The reason it's survivable here: a still all-firing
> table is at least *thematically* tense — the problem is unresolved — so the
> dead air reads as "the weight of the queue" rather than a frozen render. But
> tense-by-luck isn't a technique; re-pacing is.)

## How to think about the whole scene

Walk the decisions in order and you can see a question driving each one:

1. *What's the problem?* A queue of firing incidents → use the real `SimTable`,
   fed the six incident rows.
2. *How do I show only the table?* Render the **one** set piece with the whole
   machine at opacity 0 → continuity into scene 2 is free.
3. *How does a table arrive?* Chrome first (`tableIn`), then rows top-to-bottom
   (`rowReveal`, 0.3s pitch) → you read six incidents, not one blob.
4. *How do I say "this column is the job" without a caption?* One collective
   range-outline pulse on the `status` column → product vocabulary, never words.
5. *How should it be framed?* Hero the table, slightly zoomed (1.04), so scene 2
   can pull back to `CAM_ALL` and the machine grows in beside it.
6. *How do I end?* On a settled, selection-released table → a clean handoff, and
   (the lesson) re-paced so the narrated tail isn't dead air.

There's no single clever move — it's restraint applied five times, with one
honest scar (the pooled end-hold) to learn from.

## Exit state (what scene 2 inherits)

`table assembled (chrome + six rows at reveal 1) · all six status cells `firing`
· status-column selection released (down by 9.6s) · whole workflow rendered at
opacity 0 / edges at progress 0 · record not present (recordIn defaults to 0) ·
camera at CAM_TABLE (1.04×)`.

Scene 2 opens on exactly this frame and immediately starts easing the camera from
`CAM_TABLE` toward `CAM_ALL` while the machine fades up in the revealed space.
Because both scenes render the same `<Stage/>`, that boundary is identical down to
the pixel — the table doesn't move, doesn't resize, doesn't reflow; only the lens
pulls back and the previously-invisible machine becomes visible.
