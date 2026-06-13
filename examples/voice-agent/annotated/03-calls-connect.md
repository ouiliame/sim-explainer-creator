# Scene 3 — `calls-connect`  ·  archetype: **asides are born**

Source: `../source/scenes/CallsConnectScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/scenes/_parts.tsx` (`CallPanel`, `Waveform`), `../source/scenes/states.ts`
(`S3_CALLS_CONNECT`), `../source/scenes/_anim.ts` (`sceneClock` — the global clock
+ quiet gate), `../source/layout.ts` (the aside band), `../source/transcript-data.ts`.

This is the scene where the video's distinctive grammar appears: the **call
panels** — chat-bubble aside surfaces, each a live phone conversation — are born
in their own band below the workflow, and the real outcomes `SimTable` appears
waiting to be filled. It's also the scene where the build's signature *mechanism*
— the global oscillator clock plus the quiet gate — first carries weight, because
this is the first scene with continuously-shimmering surfaces (waveforms, pulsing
live dots) that must survive every cut. **Read the mechanism section first; it's
the most transferable thing in this whole build, and it's annotated here because
this is where it starts mattering.**

---

## What this scene is for

Scene 2 fanned the lane into three live instances, but those instances were
abstract — ghost block pairs in the container. This scene makes them *concrete and
alive*: each connected call opens a **call panel** in the aside band — a separate
box with a masked phone number, a pulsing red live dot, the configured greeting
typing in as a chat bubble, and a waveform springing to life. Three panels, born
staggered, de-phased. And at the right, the **outcomes record** appears — the real
`SimTable`, header row only, empty — planting the question "who fills that in?"
that scene 6 answers.

The *one idea* is "each call is a real, live phone conversation — and there's a
record waiting to be filled." The workflow above stays clean and live (its rings
hold) but it's no longer the focus; the focus is the band coming alive. No
conversation *unfolds* yet (that's scene 4); no outcomes land yet (scene 6). This
scene is purely the panels and the table being *born*.

## THE MECHANISM — global clock + quiet gate (read this first)

This is the single most important thing to steal from this build, and this scene
is where it earns its keep. The problem: the aside band carries
**continuously-oscillating surfaces** — waveform bars and pulsing live dots — that
shimmer *across scene cuts*. And scene durations are not fixed: `vo-sync` re-times
each scene in 0.1s steps to fit the narration (this scene was stretched from the
authored 8s minimum to **12.1s**). Any boundary that depends on a periodic
animation's phase would *pop* the instant a duration changed. The fix is two
pieces, both in `_anim.ts` reading `timing.ts`:

**1. The global oscillator frame `gf`.** `timing.ts` defines `SCENE_LIST` with
authored minimums, and `sceneSeconds(name) = max(min, VO_TIMING[name])` — the
*same* numbers `Video.tsx` uses to mount the `Sequence`s. `sceneStartFrames(name)`
sums the effective durations of all prior scenes. Then:

```ts
gf = frame + sceneStartFrames(name)   // a video-GLOBAL clock
```

Every scene passes `frame={gf}` (not the local frame) to `<Stage/>`, and every
oscillator derives from `gf`:

- **Waveform bars** (in `_parts.tsx`): three out-of-phase sines per bar,
  `0.5 + 0.32·sin(gf/9 + i·0.7 + seed·2.1) + 0.18·sin(...) + 0.12·sin(...)`,
  where `seed` (1/2/3 per panel) de-phases the three panels.
- **Live dots** (in `_rig.tsx`): `0.5 + 0.5·sin(gf/9 + i·2.1)` per panel.

Because the phase is anchored to a *video-global* frame, the shimmer is
**continuous through every cut** — no pop, ever, at any VO-retimed duration. And
crucially, `gf` is also correct when a scene is rendered *standalone* (as
`verify-boundaries` does, rendering each scene as its own comp), because
`sceneStartFrames` reconstructs the global offset from the scene name alone.

**2. The quiet gate `q`.** `sceneClock` also returns `q`: it's **0 at both
boundary frames** of the scene, ramping 0→1 over the first 0.5s and 1→0 over the
last 0.5s (plain clamped `interpolate`, no easing). Every oscillating *amplitude*
multiplies by `q`:

- waveform: `speaking={(p.speaking ?? 0) * quiet}` — gates to the flat 6% baseline;
- live dot: `livePulse = 0.5 + 0.5·sin(...) * quiet` — gates to a fixed mid-glow
  of 0.5.

The result: every cut lands on a **settled, pixel-identical frame** —
`verify-boundaries` reads IDENTICAL across the boundary — and the half-second dip
reads as a *natural lull between conversation turns*, not a freeze.

> *"Why can't I just use the local frame for the oscillators?"* Because the local
> frame resets to 0 at every scene start. A waveform on `sin(localFrame/9)` would
> snap back to phase 0 at every cut — a visible jolt. The whole band would
> stutter at every boundary. The global frame keeps the sine's phase continuous
> *through* the cut, so the shimmer flows uninterrupted.
>
> *"Why does the quiet gate exist at all if the phase is already continuous?"*
> Because continuous phase keeps the *waveform shape* matched across a cut, but
> the two scenes still might be rendered with sub-pixel differences, and more
> importantly `verify-boundaries` needs an *exactly identical* last-frame /
> first-frame pair to certify the boundary. By forcing every oscillating
> amplitude to a fixed value (flat waveform, mid-glow dot) exactly at the boundary
> frame, both sides of the cut are *defined* to be identical regardless of phase.
> The gate turns "probably continuous" into "provably identical." And it's free
> visually because a half-second dip in a phone conversation reads as a pause
> between turns — which is exactly what's happening.
>
> *"Why ramp the gate over 0.5s and not snap it?"* A snap to flat would itself be
> a pop. The 0.5s ramp eases the band into and out of its quiet state, so the
> settle reads as the conversation *winding down for a beat* rather than the
> animation being switched off.

**Imitate this literally** whenever a video has any surface that oscillates
across cuts: put scene lengths in one `timing.ts` shared by `Video.tsx` *and* the
scenes; derive every periodic phase from `frame + sceneStartFrames(scene)`; and
multiply every periodic amplitude by a 0.5s-ramp quiet gate.

## The distinctive component — the `CallPanel` (and whether to promote it)

This video introduces a genuinely new surface: the **call panel** (`CallPanel` in
`_parts.tsx`), a live phone-conversation card. It's chat-bubble aside grammar in
the `ChatPanel` lineage, and it's worth teaching carefully because it's the
video's signature object.

Anatomy (top to bottom):

- **Header** (`headerH = 78`): a live dot (14px circle, red `#ff5a5a` while live
  with a glow that pulses with `livePulse`; solid green `#22c55e` with a fixed
  glow once `ended`), the masked destination in mono (`+1 415 ··· 4288`), and a
  `⟨pending⟩` duration pill (a gray skeleton bar — the real duration is never
  invented).
- **Transcript stream** (`flex: 1`, pinned to the bottom): chat turns. **Agent
  turns** are right-aligned green-tinted bubbles (`rgba(47,209,106,0.14)` fill,
  `borderBottomRightRadius: 6` — the speech-bubble tail) carrying the configured
  greeting text. **Human turns** are left-aligned skeleton-bar bubbles (gray
  rounded bars, no words). The newest turn is at the bottom; the stream pins to
  `justifyContent: flex-end`.
- **Waveform footer** (`waveH = 96`): the `Waveform` component — 28 bars whose
  heights animate from the frame-derived triple-sine while `speaking`, flatlining
  to a thin 6% baseline when listening. With the outcome stamp overlaid here once
  the call resolves (scene 6).

**The truth contract baked into the panel** (this is the load-bearing design
decision):

- **Agent turns carry text — and that text is authored config, never run
  output.** The greeting "Hi, this is Acme calling to confirm your appointment for
  tomorrow." is the registry's own `initialGreeting` placeholder language from
  `agentphone.ts` (`"Hi, this is Acme Corp calling about your recent order."`),
  specialized to the appointment-call template. The builder *wrote* this config;
  it's not a transcript of a real call.
- **Human turns carry NO words — they're skeleton bars.** The person's reply is
  *run output*, and run output is never invented. So a human turn renders as gray
  bars whose *widths* are the shape of a reply (`["62%", "40%"]`) — you read "the
  person said something of about this length" without a single fabricated word.
- **The waveform is generated motion, not data.** It's a sine-driven shimmer
  representing "the agent is speaking," declared as motion in the script. It does
  not visualize a real audio signal.
- **The destination is masked** (`+1 415 ··· 4288`) — an authored stand-in, no
  real `toNumber` invented.

> *"Should `CallPanel` be promoted to `src/components/`?"* Not yet, and the reason
> is instructive. It's a strong, reusable surface — but it's currently a *video-
> specific* assembly of more general pieces: the chat-bubble grammar is the
> `ChatPanel` lineage, the skeleton bars are the house "captured run-value"
> language, the green/red state ramp is the product's own. If a *second* video
> needs a live-call surface, that's the moment to lift `CallPanel` up to
> `src/components/` — and at that point the thing to extract is probably the
> `Waveform` + the chat-bubble `TurnRow` as separate primitives, with `CallPanel`
> as a composition. For now it lives in `_parts.tsx` because it's only used here,
> and the rule is: promote on the *second* use, not in anticipation. But flag it
> in your head — the live-conversation panel and especially the truth contract it
> encodes (agent text = config, human reply = skeleton, waveform = motion) is
> exactly the kind of grammar a future "agent that talks" video should steal
> wholesale.

## The aside band layout

The band is owned by `layout.ts` and is *physically separate* from the workflow —
this separation is the whole point of "take 2" (the correction that drove the
rebuild). Three panels (`PANEL_W = 360`, `PANEL_H = 640`, `PANEL_GAP = 34`) on the
left, the `SimTable` (`TABLE_W = 1040`, `TABLE_SCALE = 2`) on the right, with
`BAND_GAP = 86` between. The whole band sits at `BAND_Y = 645` — below the
container's bottom (541.5) with clear air, so **no edge ever crosses between the
workflow and the asides**, and nothing occludes a block at any camera.

> *"Why separate boxes instead of drawing the conversations inside the
> container?"* This is the correction that *is* take 2. An earlier take drew call
> output floating over/inside the workflow, and the director rejected it: the
> workflow layout must stay clean and product-true, and the conversations are
> *asides* — a different surface, in their own band, synced to the workflow by
> *timing only* (a panel is born when its call connects; a table row lands when
> the Log-outcome block blips). No wire ever connects the two bands, because in
> the real product the transcript isn't a node in the graph. The bands are two
> views of one run, not one diagram.

## The values, and where they come from

| Element | On screen | Source |
|---|---|---|
| Panel 1 dest | `+1 415 ··· 4288` | masked stand-in (`transcript-data.ts` `LANES[0].dest`) |
| Panel 2 dest | `+1 628 ··· 1924` | masked stand-in |
| Panel 3 dest | `+1 917 ··· 7706` | masked stand-in |
| Greeting (all panels) | "Hi, this is Acme calling to confirm your appointment for tomorrow." | `agentphone.ts` `initialGreeting` placeholder, specialized to the appointment template |
| Live dot | red `#ff5a5a` pulsing | "call in progress" state color |
| Duration pill | gray skeleton bar | `⟨pending⟩` — real duration never invented |
| Table columns | `to / outcome / status` | the outcomes schema (module-2 lowercase style) |
| Table rows | (none — header only) | rows land only when `Insert Row` runs (scene 6) |

## The animation, beat by beat

`mkClock` gives `t` and `c` as before; `sceneClock` gives `gf` (passed as `frame`)
and `q` (passed as `quiet`).

### (a) Staggered panel births — `BIRTH = [0.5, 1.4, 2.3]`

The three panels are born at **0.5s, 1.4s, 2.3s** — a **0.9s stagger**. Each
panel `i` runs a four-part birth (note all four windows are *relative to that
panel's BIRTH*, so the whole birth gesture slides with the stagger):

```ts
visible    = c(BIRTH[i], BIRTH[i] + 0.6, 0, 1, EASING.out)         // pop-in
turnCount  = 1                                                      // greeting bubble present
lastReveal = c(BIRTH[i] + 0.5, BIRTH[i] + 1.1, 0, 1, EASING.out)   // greeting types in
speaking   = c(BIRTH[i] + 0.7, BIRTH[i] + 1.5, 0, SP[i], EASING.out) // waveform springs up
```

- **Pop-in** (`visible`, 0.6s): the panel fades up (`opacity: vis`) *and* rises
  26px (`translateY((1 - vis) * 26px)` in `_rig.tsx`) — a settle, the house
  birth gesture.
- **Greeting types in** (`lastReveal`, starting 0.5s after birth): the agent's
  first bubble reveals via `bubbleFade(r)` — opacity up and a 12px rise. Because
  `turnCount = 1`, exactly the greeting bubble is present, and `lastReveal` eases
  *it* in.
- **Waveform springs to life** (`speaking`, starting 0.7s after birth): the
  waveform amplitude ramps from 0 to `SP[i]`.

> *"Why a 0.9s stagger between panels — why not all at once?"* Because three
> identical panels popping simultaneously would read as one block of UI, not three
> distinct calls connecting. Staggering them at 0.9s lets each connection register
> as its own event — "this call connected, then this one, then this one" — which is
> what's actually happening (three calls don't connect on the same millisecond).
> 0.9s is slow enough to feel each birth, fast enough that all three are alive
> within ~3 seconds.
>
> *"Why does the waveform start 0.7s after the panel pops, not immediately?"*
> Order of events within a single connection: the panel *appears* (the call
> connected, the surface opened), *then* the greeting starts (the agent began
> speaking), *then* the waveform springs up *under* that greeting (the voice is
> heard). Stacking all three on the same frame would lose the little narrative
> inside each birth. The 0.5s/0.7s offsets sequence "connected → greeting →
> voice."

### (b) The settle amplitudes — `SP = [1, 0.85, 0.7]`

The three waveforms settle to **different** amplitudes — panel 1 loudest (1),
panel 2 mid (0.85), panel 3 quietest (0.7). Combined with the per-panel `seed`
de-phasing the *shape* of each waveform and the `i·2.1` phase offset on each live
dot, the three panels read as three *independent* live calls, not three copies of
one animation.

> *"Why three different loudnesses?"* Because three identical waveforms would
> read as a single looping graphic stamped three times — the eye clocks the
> repetition and the illusion of three live calls collapses. Three amplitudes (and
> three de-phased sine seeds, and three dot phases) make them feel like three
> different conversations happening at three different volumes. The de-phasing
> *is* the liveness. And these exact values (`[1, 0.85, 0.7]`) are carried in the
> `S3_CALLS_CONNECT` preset, so the scene settles to precisely the amplitudes the
> next scene inherits.

### (c) The record appears last — `tableReveal = c(4.6, 5.4, 0, 1, EASING.out)`

The `SimTable` (header row only, zero rows) reveals over **4.6s → 5.4s** with the
same 26px rise as the panels (`translateY((1 - tableReveal) * 26px)`). It appears
*after* all three panels are alive (panel 3 born at 2.3, settled ~3.8).

> *"Why does the empty table come in last, and as its own beat?"* Because it's the
> scene's *closing* statement, not furniture. The panels are the calls; the table
> is the promise — "and every one of these will become a row here." Bringing it in
> after the panels have settled lets it land as the answer to "where do the
> outcomes go?" — an empty record waiting to be filled. Reveal it alongside the
> panels and it'd be lost in the birth flurry; reveal it last and it reads as the
> period at the end of the sentence.
>
> *"Why is it the real `SimTable` and not a styled grid?"* Same reason the
> workflow uses real `SimBlock`s: the outcomes record *is* a Sim table in the real
> product (the Log-outcome block inserts into it), so the surface on screen is the
> actual `SimTable` component fed real columns. It's empty here because **a table
> cannot show a row the run hasn't inserted yet** — the same honesty rule
> market-desk's empty columns follow. The rows land only when `Insert Row` runs,
> in scene 6.

### (d) The hold — ~5.4s to ~11.6s (the 6+ second alive hold)

After the table reveals at 5.4, nothing *new* happens for ~6 seconds — but the
frame is *alive*: three waveforms shimmer on the global clock at amplitudes
1/0.85/0.7, three live dots pulse de-phased, the workflow's rings stay lit above.
This is the build's proof that a 6-second hold can carry.

> *"Six seconds with no new event — isn't that dead air?"* No, and this is the
> whole reason the global clock + quiet gate exists. The hold isn't *static* —
> it's *breathing*. Nothing is focal, but everything is alive: the waveforms ripple,
> the dots pulse, each at its own phase. There's no single thing to look at, which
> is exactly right for "three calls are all live at once" — you're meant to feel
> the *aliveness* of the whole band, not track one event. And it carries the
> narration ("each one opens a live transcript... an empty outcomes table is
> waiting") across its full length. The quiet gate settles it for the cut: the
> last half-second eases the shimmer down to its baseline so the boundary into
> scene 4 is pixel-identical.

## How to think about the whole scene

1. *How do I make the abstract instances concrete?* Born each as a real
   conversation surface → the `CallPanel`, a separate aside box.
2. *Where do the panels live so they don't corrupt the workflow?* Their own band,
   below the container, no edge crossing → the take-2 correction.
3. *How do three calls read as three, not one?* Stagger the births 0.9s, settle to
   three amplitudes (1/0.85/0.7), de-phase the waveform seeds and dot phases →
   liveness *is* de-phasing.
4. *What text is allowed on screen?* Agent greeting = authored config; human reply
   = skeleton bars; duration = ⟨pending⟩; number = masked → the truth contract.
5. *How do I plant the payoff?* Reveal the real empty `SimTable` last → an honest
   waiting record.
6. *How does a 6s hold survive?* Global clock keeps the shimmer continuous; quiet
   gate settles every boundary → a breathing hold, pixel-identical cuts.

## Exit state (what scene 4 inherits)

`workflow live and fanned (rings held, fan = 1) · three call panels alive, each
showing its greeting bubble (turnCount 1), waveforms shimmering at amplitudes
1/0.85/0.7, live dots pulsing de-phased · the outcomes SimTable present, header
only, zero rows · camera at CAM_HOME (s 0.8) · all oscillators on the global clock,
quiet gate settled at the boundary`.

This is the `S3_CALLS_CONNECT` preset. Scenes 4, 5, and 6 all spread
`...S3_CALLS_CONNECT` as their base and modify from it — the panels, the table,
and the run state all carry by construction. Scene 4 changes *only* the camera
(leaning toward panel 1) and the per-panel turn state; the band itself is
inherited whole. Because both scenes render the same `<Stage/>` and the global
clock + quiet gate guarantee the shimmer is continuous and the boundary settled,
the cut is identical down to the pixel.
