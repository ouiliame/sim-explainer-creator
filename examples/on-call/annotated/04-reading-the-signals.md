# Scene 4 — `reading-the-signals`  ·  archetype: **zoom-aside read beats (freeze-cut BOTH ends)**

Source: `../source/scenes/ReadingTheSignalsScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/data.ts`, `../source/scenes/_beats.ts`.

This is the middle act of the followed run, and it has a freeze-cut on *both*
ends — it inherits a live run from scene 3 and hands a live run to scene 5. Its job
is the agent's investigation: three tool reads, each landing in the run record as
it happens. Read this as the worked example for "how do I show an agent doing
several reads in sequence, link each call to its receipt in the record by synchrony
alone, and fill a long beat with honest ambient motion so it never goes dead."

---

## What this scene is for

The agent is live (carried from scene 3). Now it *investigates* — the way an
engineer would: pull the Sentry issue, query the surrounding logs in Datadog,
check the latest commit on GitHub. Each is a tool call, and each is a **read** (the
mandate is strict: this agent reads and creates records, it never edits or fixes).
The scene has to show three reads in sequence and, for each, land the result as a
row in the run record's `toolCalls` array — chip ring ↔ record row, by synchrony.

So the rule is *one idea per scene*: "the agent reads the monitoring stack, and
every read is recorded." It does **not** create anything yet (that's scene 5) and
it doesn't flip the table (also scene 5). The one new grammar element is the
**chip-ring-to-record-row sync** — the read equivalent of scene 3's
alert-to-table-row sync.

## What it looks like

The camera leans in from the home framing toward the agent + record (the two
surfaces this scene is a conversation between). The Triage block's blue live ring
burns the whole time (carried from scene 3). Its own log row lands in the record,
selected, and its duration **counts up** — a number ticking from 0 toward 9.8s,
the only ambient motion. Then three read beats, evenly spaced: the **Sentry** chip
rings and `[0] sentry_issues_get` lands in the record's toolCalls; the **Datadog**
chip rings and `[1] datadog_query_logs` lands; the **GitHub** chip rings and
`[2] github_latest_commit` lands. Each record row that lands also takes a brief
selection highlight. The agent never stops being live.

## The one set piece, leaning in

The scene renders the same `<Stage/>`, carries the live ring, and drives the chip
rings and toolCalls rows:

```tsx
<Stage
  cam={cam}
  webhook={{state: "ok"}}
  agent={{highlighted: true}}
  toolRings={[ring(B[0]), ring(B[1]), ring(B[2])]}
  msgTag={{resolve: 1}}
  recordIn={1}
  logReveals={[1, triageRow, 0, 0, 0]}
  logSelected={1}
  triageDur={triageDur}
  contentReveal={0}
  tokensReveal={0}
  toolCallReveals={[land(B[0]), land(B[1]), land(B[2])]}
  toolCallHi={[hi(B[0]), hi(B[1]), hi(B[2])]}
/>
```

> *"Why `agent={{highlighted: true}}` as a flat boolean with no window?"* Because
> this is the carried freeze-cut state. Scene 3 latched the ring at 7.15 with an
> open-ended boolean; scene 4 re-asserts it as a constant `true` from its own
> frame 0. The ring never goes off in this scene — the agent is working the whole
> time. Re-asserting it as `true` (not re-deriving a window) is what makes the
> 3→4 boundary pixel-identical: the ring is on at scene 3's last frame and on at
> scene 4's first frame, same color, same inset.

> *"Why `msgTag={{resolve: 1}}` with no glow?"* Because the Messages tag is still
> resolved to `HTTP 500 /payments` (carried from scene 3), but it's no longer
> *being read* — the glow has released. Passing `resolve: 1, glow: 0` holds it at
> "resolved, settled" — the value sits in the row showing its faint blue
> provenance residue (the `ResolvedTag`'s `blue` floor of 0.3), without the active
> selection glow. Carried state, held at its settled value.

> *"Why `webhook={{state: "ok"}}`?"* Carried from scene 3 — the webhook ran and
> settled green. Re-assert it or it'd default to no ring and the green would pop
> off on the cut.

## The camera — lean in toward the conversation

```ts
const cam = camLerp(CAM_ALL, CAM_READ, ramp(t, 0.3, 1.7, 0, 1, EASING.inOut));
```

The camera eases from `CAM_ALL` (0.665×) to `CAM_READ` (`px: 1480, py: AXIS_Y+60,
s: 0.78`) over **0.3 → 1.7s**, eased `inOut`. `CAM_READ` is a tighter framing
centered between the agent and the record, nudged down (`+60`) to favor the record.

> *"Why lean in here, when scene 3 held still?"* Because the next ~10 seconds are a
> *conversation between exactly two surfaces*: the agent (whose chips ring) and the
> record (where the reads land). The wider `CAM_ALL` framing has to hold the whole
> machine plus the table; but this scene only cares about agent ↔ record, so
> leaning in makes those two surfaces bigger and the chip-ring-to-record-row sync
> easier to read. The terminals and the table are still in frame (the lean is
> gentle, 0.665→0.78), just de-emphasized by being pushed toward the edges. The
> camera move is *editorial*: it says "watch these two."

> *"Why move the camera between the freeze-cut inherit and the read beats?"* The
> camera settles by 1.7s; the first read beat is at 4.5s. Same discipline as scene
> 2: move the frame *first*, settle it, *then* run the beats against a fixed frame.
> The lean-in happens over the narration's setup line; the reads happen against a
> stationary `CAM_READ`.

## The values, and where they come from

| Surface | Value | Provenance |
|---|---|---|
| Triage log row duration | counts up to `9.8s` | `LOG_DURATIONS.triage` (authored), live-ticked |
| toolCalls `[0]` | `[0] sentry_issues_get` → `412ms · 1 issue` | tool id from `sentry.ts`; value authored |
| toolCalls `[1]` | `[1] datadog_query_logs` → `688ms · 214 lines` | tool id from `datadog.ts`; value authored |
| toolCalls `[2]` | `[2] github_latest_commit` → `295ms · 4f2c1` | tool id from `github.ts`; value authored |

> *"Why are the tool-call KEYS real ids but the VALUES authored?"* Because the ids
> are product truth — `sentry_issues_get`, `datadog_query_logs`,
> `github_latest_commit` are the registries' actual operation ids, and they are all
> **reads** (the mandate's honesty constraint: no edit, no write to the systems
> being read). But the *result summaries* (`412ms · 1 issue`, `214 lines`) are
> run-derived — there's no real run — so they're declared stand-ins in module-7's
> accepted `NNNms · result` format. The shape is honest (a tool call has an id, a
> duration, a one-line result); the specific numbers are plausible inventions, not
> claimed as real.

> *"Why does the GitHub result say `4f2c1` and the Triage content say `deploy
> 4f2c1…`?"* They're the same authored commit hash, threaded through. The GitHub
> read returns commit `4f2c1`; the agent's `content` summary (revealed in scene 5)
> is `payments-api — 500s began with deploy 4f2c1…`. The thread is a nice touch —
> the read the agent did (latest commit) shows up in its diagnosis — but both are
> authored stand-ins, consistent with each other by construction.

## The animation, beat by beat

### (a) The Triage log row lands, selected — `triageRow = ramp(t, 0.8, 1.2)`

Triage's own log row fades into the record over **0.8 → 1.2s**, and `logSelected={1}`
selects it (the `OutputBundle` draws a `rgba(44,44,44,...)` active background behind
row index 1). `logReveals={[1, triageRow, 0, 0, 0]}` — Sentry Alerts (row 0) is
already there from scene 3, Triage (row 1) lands now, the three terminals (rows
2–4) stay at 0.

> *"Why select the Triage row?"* Because the output tree on the right is *Triage's*
> output — its content, tokens, and toolCalls. The selected log row tells you whose
> output you're looking at. In scene 3 nothing was selected (the tree was empty);
> now the tree is about to fill with Triage's reads, so Triage is selected to say
> "this tree belongs to this block." This selection persists through scenes 4 and 5
> (and into the bookend) — the record stays Triage-selected because it stays
> Triage's record.

### (b) The duration counts up — `triageDur = (9.8 * ramp(t, 1.2, 12.5)).toFixed(1) + "s"`

Triage's log-row duration text isn't static — it's a live number ticking from
`0.0s` toward `9.8s` over **1.2 → 12.5s** (11.3 seconds of counting), landing
exactly on 9.8. It's passed as `triageDur`, which `buildLogRows` substitutes for
Triage's static duration *while the agent is still running*.

> *"Why a count-up — isn't a ticking number gimmicky?"* It's the cheapest
> *legitimate* ambient motion for a multi-beat read sequence, and it's *honest*: a
> running block's duration genuinely climbs as it runs. The scene has three read
> beats spread across ~10 seconds with gaps between them; a ticking duration makes
> the whole stretch feel like *elapsed time* — the agent is working, the clock is
> running — instead of a series of disconnected events over a frozen frame. It's
> the difference between "the agent did three reads" and "the agent spent 9.8
> seconds investigating, and here are the three reads it did along the way." The
> count-up turns a sequence into a duration.

> *"Why does it count to exactly 9.8 and stop?"* Because that's Triage's real (well,
> authored) run duration. The `ramp(t, 1.2, 12.5)` clamps at 1 after 12.5s, so the
> number freezes at `9.8s` and holds — the agent's final duration, which is also
> what scene 5 (where the agent settles) and the bookend show. The clamp is what
> makes it safe to hold: after 12.5 the number is locked at its final value, not
> mid-tick, so the end-of-scene hold doesn't freeze a number halfway.

### (c) The three read beats — `B = [4.5, 7.5, 10.5]`, 3.0s pitch

Three reads, evenly spaced 3 seconds apart. Each is a two-surface sync built from
three windows sharing one beat time `b`:

```ts
const ring = (b) => Math.min(ramp(t, b-0.5, b-0.2), ramp(t, b+0.8, b+1.5, 1, 0));
const land = (b) => ramp(t, b, b+0.4);
const hi   = (b) => Math.min(ramp(t, b, b+0.3), ramp(t, b+0.7, b+1.5, 1, 0));
```

For each beat: the **chip ring** rises over `b−0.5 → b−0.2` (a fast 0.3s snap),
holds, releases over `b+0.8 → b+1.5`. The **record row lands** over `b → b+0.4`.
The **row highlight** rises over `b → b+0.3`, releases over `b+0.7 → b+1.5`. The
chips ring in order Sentry, Datadog, GitHub — the order the narration names them.

> *"Why does the chip ring LEAD the record row by 0.5s (ring starts b−0.5, row
> lands at b)?"* Because cause precedes effect: the agent *calls* the tool (the
> chip rings — "the agent chose this tool"), then the *result comes back* (the row
> lands in the record). The call goes out, then the answer returns. 0.5s is enough
> to read the order — chip lights, then result appears — but small enough that the
> two read as one event (a tool call producing a recorded result), not two
> unrelated animations. This is the read-direction analog of scene 3's
> alert-resolves-then-pulse-crosses ordering.

> *"Why 3.0s pitch between the three reads?"* It's paced to the narration: "it
> pulls the Sentry issue, queries the surrounding logs in Datadog, and checks the
> latest commit on GitHub" — three named systems, roughly 3 seconds apart in
> speech. And a read is a *substantial* event (an external call returning data), so
> it earns ~3s of air. Compare the cadence in scene 6, where the same traversal is
> *compressed* to under 2s per run because there the point is multiplicity, not
> legibility. Here each read must be individually readable, so they're spread.

> *"Why does the record row land ON the beat (`ramp(t, b, b+0.4)`) rather than
> with a slight delay like the chip?"* Because the row landing *is* the beat — the
> moment the result arrives. The chip ring is the *lead-in* (call going out, 0.5s
> early); the row landing is the *payoff* (result returns, on the beat). The
> highlight on the row also fires on the beat and releases as the next read
> approaches, so each landed row briefly glows then settles, like a freshly-written
> value.

> *"How does the toolCalls row 'land' in the record?"* `toolCallReveals =
> [land(B[0]), land(B[1]), land(B[2])]` feeds `buildTriageTree`, which sets each
> tool-call node's `reveal`. Because every tree node stays *mounted* at reveal 0
> (height reserved from the moment the record appeared in scene 3), `land` only
> ramps the node's *opacity* — the row fades in at its already-reserved slot.
> Nothing below it shifts. The `toolCalls` parent label fades in with its first
> child (`reveal: toolCallReveals[0]`). This is the no-teleport rule done
> structurally: the panel reserved its full height up front, so rows land as pure
> fades.

> *"Why does the chip ring RELEASE so much later (b+0.8 → b+1.5) than it rose
> (b−0.5 → b−0.2)?"* The ring is a *snap on, slow off* — it rings sharply when the
> call fires (a decisive gesture) and fades out gently as the next read approaches.
> The asymmetry reads as "called! …done." A symmetric ring would feel mechanical;
> the fast-on-slow-off has a natural decay. And the long tail means each ring is
> still faintly up as its record row finishes landing, bracketing the read.

### (d) The hold — from ~12.5s to the end of the scene (22s)

After the count-up lands at 12.5 and the last GitHub ring/row settles (~12), nothing
moves for ~9.5s. The agent's blue ring burns; three chips sit settled; three
toolCalls rows sit in the record.

> *"Nine and a half seconds of hold — isn't that the worst dead stretch in the
> video?"* It is, and the choreography flags it honestly as the longest semi-dead
> stretch. The only thing keeping it readable is the latched live ring (the agent
> is *still running* — the narration is summarizing the reads). The honest fix is
> the same as scenes 1–2: re-pace the read beats and the count-up to span the full
> 22s rather than finishing by 12.5. If you imitate this scene, stretch the three
> reads across the narrated duration (and let the count-up run the whole length).
> The end-anchored hold *pattern* (open-ended `highlighted: true` boolean, count-up
> clamped at its final value) is correct — it survives any narration length and
> hands a clean freeze-cut to scene 5 — but the *amount* of hold here is the scar
> to learn from, not the technique to copy.

## How to think about the whole scene

1. *What's the conversation?* Agent ↔ record → lean the camera in (`CAM_ALL →
   CAM_READ`) to favor those two surfaces.
2. *How do I carry the live run?* Re-assert `highlighted: true` and `state: "ok"`
   and `resolve: 1` from frame 0 → the freeze-cut is pixel-identical.
3. *How do I make a long read feel like elapsed time?* Count Triage's duration up
   to 9.8s → honest, cheap ambient motion.
4. *How do I show three reads, each recorded?* Chip ring (leads 0.5s) ↔ toolCalls
   row (lands on beat) ↔ brief row highlight, three times at 3.0s pitch, in
   narration order → synchrony only, each read individually legible.
5. *How do I end?* On the live ring + count-up clamped at 9.8 → a freeze-cut to
   scene 5 (and, the lesson, re-paced so the tail isn't a 9.5s void).

## Exit state (what scene 5 inherits — a freeze-cut carry)

`Triage live ring ON (still latched blue) · webhook ok · Messages tag resolved
(held) · all three tool chips settled (rings released) · all three toolCalls rows
landed in the record (sentry_issues_get, datadog_query_logs, github_latest_commit)
· Triage log row selected, duration clamped at 9.8s · table still all `firing` ·
camera at CAM_READ (0.78×)`.

This is the second **freeze-cut**: scene 5 opens on this exact frame — the live
agent, the three reads recorded — and the carried state is again **the Triage live
ring** (plus the three landed reads). Scene 5 will *settle* that ring (the agent
finishes), reveal `content` and `tokens` in the tree, fire the three terminals, and
flip row 3 — but its first frame is identical to this last frame. Because both
scenes render the same `<Stage/>` and scene 5 re-derives the live ring as
`highlighted: t < 2.2` (on from its frame 0), the boundary is pixel-identical. The
held live ring is the contract; the run continues. Scene 5 also leans the camera
*back* (`CAM_READ → CAM_ALL`) because the payoff spans the whole frame again.
