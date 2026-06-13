# Scene 3 — `alert-in`  ·  archetype: **run starts + freeze-cut OUT**

Source: `../source/scenes/AlertInScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`, `../source/scenes/_beats.ts`.

This is where the video's *one followed run* begins. Scenes 1–2 were setup — the
queue exists, the machine is built, nothing has *happened*. Scene 3 fires it: one
alert arrives, the run starts, and Sim starts writing the record. It also teaches
the **grammar** every later run scene reuses, and it ends mid-run on a held live
state it hands across the cut. Read this as the worked example for "how do I start
a run, link an event to its source by synchrony alone, and end a scene *inside* a
run that isn't over."

---

## What this scene is for

The followed run (run 1) spans scenes 3, 4, and 5 across two freeze-cuts. Scene 3
is the *in* phase: an alert lands, the webhook receives it, the agent goes live,
and the run record appears with its first row. The scene has to do three things at
once: show the run *starting*, establish the **two-surface sync** grammar (the
alert resolving in the agent's Messages row *and* its source row in the table
lighting up, with no connector line between them), and set up the **freeze-cut**
— because the run doesn't finish here. Scene 3 must end on a *live* state and carry
it forward.

So the rule is still *one idea per scene* — the idea is "one alert in, the run has
begun and is already being recorded" — but this is the first scene carrying real
run machinery, so it's worth stating the grammar before the beats.

## The run grammar — read this before the beats

Every run scene in this video (3, 4, 5, 6) obeys these rules. They're taught here
first:

1. **A `WirePulse` is the only thing that travels a wire, and it carries no
   cargo.** It's a gradient streak of blue light, nothing more — not a value, not
   a payload. A wire firing means "control passed from this block to the next,"
   full stop.
2. **Values never ride wires. They resolve *in place*, in rows and cells.** When
   the alert is received, the value resolves in the agent's `Messages` row where
   it *lives* — it doesn't detach and fly down a connector.
3. **State is shown in the product's own language** — a blue live ring
   (`#33b4ff`), a green ok ring (`#22c55e`), a chip ring, a row glow, a green cell
   tint — never a word like "RUNNING" stamped on screen.
4. **Block↔surface links are carried by SYNCHRONY ONLY — never connector lines.**
   This is the rule this scene introduces and the whole video leans on. The alert
   resolves in the agent's Messages row *and* its source row in the incidents
   table lights up *at the same keyframe* (1.95). There is no line drawn between
   the agent and the table. The fact that they fire together is what tells you
   they're the same event. The rail surfaces (table, record) are *asides* beside
   the workflow; they're linked to the workflow by timing, not geometry.

> *"Why be this strict — wouldn't a little arrow from the alert to its table row
> read faster?"* It would read faster and lie about the architecture. The
> incidents table is a *separate surface* — the workspace's incident queue — not
> a block the workflow writes to (there's no Table block in this workflow; the
> mandate fixes the three terminals). Drawing a connector from the agent to the
> table would imply a data path the workflow doesn't have. The honest claim is:
> "this alert came from that row" — a *correspondence*, not a wire. Synchrony is
> exactly the right tool for correspondence: two things lighting up on the same
> frame read as the same event without asserting a physical link. The grammar
> isn't decoration; it's the load-bearing claim about how the product is shaped.

## The one set piece, again

The scene renders the same `<Stage/>` as scene 2, now idle-assembled, and drives
the run state. The 2→3 boundary is identical because scene 2 left the chain
assembled at `CAM_ALL` with no run state, and scene 3 opens on exactly that frame
before anything blips. Note again how little the scene file does — it's timing
windows handed to props:

```tsx
<Stage
  cam={CAM_ALL}
  webhook={{highlighted: webhookLive, state: webhookOk ? "ok" : "none"}}
  agent={{highlighted: agentLive}}
  msgTag={{glow, resolve}}
  pulse1={p1}
  rowHi={(r) => (r === FOLLOWED_ROW ? rowHi : 0)}
  recordIn={recordIn}
  logReveals={[log0, 0, 0, 0, 0]}
  logSelected={-1}
  contentReveal={0}
  tokensReveal={0}
  toolCallReveals={[0, 0, 0]}
/>
```

> *"Why pass `contentReveal={0}`, `toolCallReveals={[0,0,0]}` etc. when they're
> not animating?"* Because the record's output tree is built every frame from
> `buildTriageTree`, and those nodes stay *mounted* at reveal 0 (opacity 0) so the
> panel reserves its full height the moment it fades in. If you didn't pass them,
> they'd default to `1` and the whole tree would appear fully populated the instant
> the record arrives — wrong. The record should arrive with only its first *log
> row* (Sentry Alerts), the output tree empty-but-height-reserved. Carried state
> has to be re-asserted every scene, even when it's "stay at zero."

## The camera

```ts
cam = CAM_ALL  // locked, no move
```

There is no camera move in this scene. It sits at the home framing the whole time.

> *"Why no move in the scene where the run starts?"* Because the *content* is
> moving — a blip, a row glow, a tag resolving, a table row lighting, a streak, a
> ring latching, a record fading in. The viewer needs a fixed frame to read that
> motion against. If the frame also moved, you'd have motion-on-motion and the eye
> couldn't tell what's the event and what's the lens. The build's rule of thumb:
> **move the frame between scenes, not during the ones where the diagram itself is
> doing the work.** (Scenes 2, 4, 5, 7 move their cameras *between* run beats;
> scenes 3 and 6, the busiest run scenes, hold still.) And you need the *whole*
> frame here because the two-surface sync spans both sides: the agent is on the
> left, the table row is in the right rail. You can't see "alert ↔ its row" unless
> both are in frame at once.

## The values, and where they come from

| Surface | Value | Provenance |
|---|---|---|
| Webhook block | `Sentry Alerts`, `#10B981`, `Webhook URL` row | registry `generic_webhook.ts`; subBlock title from `triggers/generic/webhook.ts` |
| Webhook URL value | `…/trigger/d8abcf0d…` | the generic-webhook docs' own bestPractices curl UUID |
| Messages tag | `<sentryalerts.message>` | generic-webhook docs' root-field dot-notation example |
| Tag resolves to | `HTTP 500 /payments` | `ALERT_VALUE = INCIDENTS[FOLLOWED_ROW].incident` — row 3's own title |
| Agent | `Triage`, `#33C482` | registry `agent.ts`; module-7's accepted agent name |
| Record log row 0 | `Sentry Alerts · 18ms` | `LOG_DURATIONS.webhook` (authored stand-in) |

> *"Why does the tag resolve to row 3's incident title specifically?"* Because the
> alert *is* row 3. `ALERT_VALUE` is literally `INCIDENTS[FOLLOWED_ROW].incident`
> = `HTTP 500 /payments`. The whole two-surface sync depends on this: the value
> that appears in the agent's Messages row is the *same string* as the table cell
> that lights up. When the narration says "row three, the 500s on the payments
> API," both surfaces are showing row three's identity at once. If the resolved
> value were some other string, the correspondence would be a lie.

> *"Why is the webhook called 'Sentry Alerts' but rendered as a generic Webhook
> block, green, not a Sentry block?"* This is a deliberate, grounded choice. Sentry
> has *no trigger integration* in the registry — there's no `triggers:` block in
> `sentry.ts`. The honest way to draw "Sentry alerts come in" is the generic
> `generic_webhook.ts` block (`#10B981` green, the Webhook lucide glyph),
> *user-named* "Sentry Alerts" — and user naming is product-legal (the swe-fleet
> `Fleet` precedent). The generic block's own bestPractices say to use it exactly
> when an integration lacks a native trigger. So the green webhook block named
> "Sentry Alerts" is more honest than a fake Sentry-trigger block would be.

## The animation, beat by beat

The scene uses `ramp` (linear clamped 0→1) and `pulse` (rise-hold-release) from
`_beats.ts`. Read the beats as one causal chain: the alert lands → the agent reads
it (in sync with its table row) → control passes down the wire → the agent goes
live → the record starts.

### (a) The webhook blips, then settles ok — `webhookLive = t∈[1.2, 1.9)`, `webhookOk = t ≥ 1.9`

The webhook's selection ring (blue) is on from **1.2s to 1.9s** — a 0.7s blip —
then from 1.9s it shows the **green ok ring** (`state: "ok"`). In `SimBlock`, a
`highlighted` block draws the inset ring at `C.ring` (the secondary blue
`#33b4ff`); a `state: "ok"` block draws it at `#22c55e`. So you see the block
flash blue (receiving) then settle green (done).

> *"Why does the blip START at 1.2, not 0?"* A beat of still frame before anything
> fires reads as a deliberate open — the same logic as scene 1's table at 0.3.
> The scene inherits a settled assembled chain; let it sit a moment before the
> alert lands.

> *"Why is the blip so short (0.7s) and then immediately ok?"* Because the webhook
> *ran in 18ms* — it's the fastest block in the run (look at `LOG_DURATIONS`). A
> webhook receiving a payload is near-instantaneous; the blip is short on purpose
> to match. It blips (receiving) and settles green (received) almost at once,
> because that's how fast a webhook actually is. The agent, by contrast, runs for
> 9.8s, so its ring *latches* and stays live across three scenes. Block ring
> duration is a truthful signal of how long each block actually takes.

### (b) The two-surface sync — the scene's one trick

This is the move the whole video reuses. The alert resolving in the agent and its
source row lighting in the table are *one event on two surfaces*, welded by a
shared keyframe at **1.95**:

```ts
const glow = pulse(t, 1.5, 2.3, 0.3, 0.4);   // Messages tag glows
const resolve = ramp(t, 1.95, 2.45);          // tag → "HTTP 500 /payments"
const rowHi = pulse(t, 1.95, 4.2, 0.35, 0.6); // table row 3 selection
```

**The Messages tag.** `glow` rises over 1.5→1.8 (the `up=0.3`), holds, releases
over 2.3→2.7 (the `down=0.4`). While glowing, the `<sentryalerts.message>` tag is
drawn selection-blue (the `Tag` component tints it toward `#33b4ff`). Then
`resolve` ramps 1.95→2.45: the rig swaps the `Tag` for a `ResolvedTag`, which
dip-swaps through its midpoint and lands showing `HTTP 500 /payments` — the
resolved value, carried in tag-blue with a faint blue residue (provenance: "this
came from the reference").

**The table row.** *At the same 1.95*, `rowHi` rises over 1.95→2.3 (`up=0.35`),
holds a long time, releases over 4.2→4.8 (`down=0.6`). It's passed as
`rowHi={(r) => r === FOLLOWED_ROW ? rowHi : 0}` — only row 3. In the rig this
becomes `cellHi` across all three cells of row 3, so `SimTable` draws its range
outline around the *whole row* — one record selected.

> *"Why are the tag resolve and the row highlight both keyed at 1.95?"* Because
> they are the same event: "this alert is row three." The agent reading
> `HTTP 500 /payments` into its Messages row and row three of the table lighting
> up are two views of one fact. Keying them to the same frame is what makes the
> synchrony legible — your eye catches both lighting at once and concludes
> "those go together," with no arrow needed. This is the synchrony-only rule from
> the grammar, made concrete.

> *"Why does the tag GLOW (1.5) slightly before it RESOLVES (1.95)?"* Because a
> reference is first *recognized* (it glows blue — "this is a reference being
> read"), then *resolved* (it dip-swaps to the value). Glow-then-resolve is the
> reference-system's two-step: the tag lights up to say "I'm a `<…>` reference,"
> then becomes the actual value. Firing them on the same frame would lose that
> two-beat reading.

> *"Why does the row highlight hold so much longer (release at 4.2) than the tag?"*
> Because the row highlight has to *survive until the pulse crosses the wire* at
> 6.5 — well, it releases at 4.2, before the pulse. The long hold (1.95 to 4.2,
> ~2.25s) keeps row three selected through the narration line naming it, so the
> viewer has time to find it in the six-row table and connect it to the agent.
> The tag resolve is faster because it's a small in-place swap; the row selection
> is a *pointer* the viewer needs time to follow. Different-lifetime events get
> different windows.

### (c) The pulse crosses edge 1 — `p1 = ramp(t, 6.5, 7.2)`; agent latches live at `7.15`

A `WirePulse` rides edge 1 (webhook → agent), progress `0→1` over **6.5 → 7.2s**.
The streak emerges from the webhook's source handle, travels the wire, and is
absorbed at the agent's target handle. As it lands, the agent's live ring comes on
at **t ≥ 7.15** — and this one has **no upper bound**. It's latched.

> *"Why does the pulse wait until 6.5, ~2 seconds after the alert resolved at
> 2.45?"* Because reading the input and passing control are two beats. The agent's
> Messages row gets the alert (by 2.45), the narration says "the webhook hands the
> message to the agent," *then* the pulse crosses (6.5). The gap is paced to the
> narration; the alert lands, you see it land, *then* it's handed on. (The slack
> between 2.7 and 6.5 is where the row-three highlight is doing its work and the
> narration is naming the alert — it's not dead, it's the sync landing.)

> *"Why does the live ring LATCH (`t >= 7.15`, no off edge) instead of being a
> closed window?"* Because this is the **freeze-cut carry** — the one piece of
> live state the scene exists to hand forward. The webhook fired and finished (it
> went green at 1.9); it's *done*. But the agent is *not* done — it has only just
> gone live, and its actual work (three tool reads in scene 4, then creating three
> records in scene 5) is just beginning. So the agent's ring must not revert. It
> latches on and stays on across two scene boundaries, releasing only in scene 5
> when the agent settles ok. The held blue ring *is* the run's spine — one ring
> spanning three scenes, every boundary a freeze-cut that carries it.

> *"Why does the ring light at 7.15, a hair before the pulse fully lands at 7.2?"*
> The streak is decelerating into the agent's handle over its last fraction;
> lighting the ring at 7.15 means the agent comes alive *as* the streak is
> absorbed, so "control arrives" and "block goes live" read as one event. A hair
> of overlap reads as cause-into-effect; a gap would read as a pause.

### (d) The record fades in — `recordIn = ramp(t, 10.0, 10.7)`; first log row `log0 = ramp(t, 10.5, 10.9)`

The run record (`OutputBundle`) fades in below the table over **10.0 → 10.7s**,
and its first log row — Sentry Alerts · 18ms — lands over **10.5 → 10.9s**, just
after the panel itself appears. The narration here is "Sim starts recording the
run."

> *"Why does the record appear ~3 seconds after the agent went live (7.15)?"* The
> run's events are sequenced, not stacked: control reaches the agent (7.15), the
> agent goes live, *then* — a beat later — Sim's run inspector shows up with the
> first thing it logged. Pacing the record's arrival after the ring keeps the
> chain readable: you don't get the ring and the record at once.

> *"Why does the record's panel (recordIn) lead its first row (log0) by half a
> second?"* Same reserve-then-fill discipline as the agent's Tools row. The panel
> chrome — the Logs column, the Output panel, the border — arrives first
> (`recordIn` drives the whole `OutputBundle` opacity), then the first log row
> fades in on top of it. You read "a record panel appeared, then its first row
> landed," not "a fully-populated record teleported in." And because `buildLogRows`
> *filters out* rows at reveal ≤ 0 (`logReveals = [log0, 0, 0, 0, 0]` → only row 0
> is mounted), the logs column shows exactly one row, top-aligned, with room for
> four more below. The output tree is present but empty (all reveals 0,
> height-reserved).

> *"Why `logSelected={-1}` here when later scenes select the Triage row?"* Because
> the only row present is Sentry Alerts, and there's nothing to select yet — the
> agent hasn't produced output. Scene 4 sets `logSelected={1}` (the Triage row),
> because by then the output tree *is* Triage's output and the selected log row
> tells you whose output you're looking at. Here, no selection: the record is just
> starting.

### (e) The hold — from ~10.9s to the end of the scene (15.4s)

After the first log row lands at 10.9, nothing transient moves for ~4.5s. The
webhook sits green, the agent's blue ring *burns*, row three's highlight has
released, the record shows one row.

> *"Isn't a 4.5s hold dead air?"* Less so than scenes 1–2, and the reason is the
> **latched ring**. A hold on a *settled* state is restful; a hold on a *live*
> state is *tense*. The agent's blue ring says the run is mid-flight — it's still
> working, the reads are coming — so the held frame carries an unresolved question
> ("what's it doing?") that the narration fills. This is also what makes the hold
> safe to *stretch* to any narration length: the held state is an open-ended
> boolean (`agentLive = t >= 7.15` has no off edge), not a motion frozen
> mid-flight. The choreography calls this the **end-anchored hold** pattern — and
> it's strictly better than scenes 1–2's static holds, because the live ring is
> *doing* something (asserting "in progress") even while nothing moves.

## How to think about the whole scene

1. *How does a run start?* The webhook blips and settles ok fast (18ms — short
   blip on purpose) → product ring language, truthful duration.
2. *How do I link the alert to its table row without a wire?* Resolve the tag and
   light the row at the *same keyframe* (1.95) → synchrony only, no connector.
3. *How does control pass?* A `WirePulse` crosses edge 1 (light, no cargo); the
   agent's ring latches on as it lands → control passing, then "still live."
4. *How do I show Sim recording?* The record fades in (panel first, then first log
   row) with the output tree height-reserved but empty → honest "just started."
5. *How do I end inside a run?* On the held live ring — an open-ended boolean →
   the freeze-cut carry, stretchable to any length, tense not dead.

The scene is busier than 1–2 but not cluttered, because each beat is one link and
the links are *sequenced*, not stacked: blip (1.2) → sync resolve+row (1.95) →
pulse (6.5) → live (7.15) → record (10.0). Each idea gets its own air.

## Exit state (what scene 4 inherits — a freeze-cut carry)

`Triage live ring ON (latched blue, carries across the cut) · webhook settled ok
(green ring) · Messages tag resolved to "HTTP 500 /payments" (held resolved) ·
table row 3 highlight released (by 4.8s), all six rows still `firing` · record
present, log row 0 (Sentry Alerts) landed, output tree empty but height-reserved ·
camera at CAM_ALL`.

This is a **freeze-cut**: scene 4 opens on this exact frame — the held live moment,
one log row, the resolved tag — and the carried state is **the Triage live ring**.
Scene 4 does not re-establish that a run is happening; it inherits a run already in
flight and continues it (leaning the camera in toward agent + record, then ringing
the three tool chips as their reads land in the record). Because both scenes render
the same `<Stage/>` and scene 4 passes `agent={{highlighted: true}}` from its own
frame 0, the boundary is identical down to the pixel. The held live ring is the
boundary contract; the run is *one* event, seen across three scenes, and this is
the first cut it survives.
