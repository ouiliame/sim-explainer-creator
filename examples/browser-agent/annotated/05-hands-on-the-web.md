# Scene 5 — `hands-on-the-web`  ·  archetype: **live set piece** (zoom-aside + zoom-through-reverse exit)

Source: `../source/scenes/HandsOnTheWebScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md` (scene 5), `../CHOREOGRAPHY.md`
(scene 5).

This is the centerpiece of the whole video — the one scene everything else is
built to set up. The first four scenes assemble a chain, hand it a toolbelt,
and watch it search and read pages. This scene is the payoff: a *live browser
session* you can actually watch — a real viewport, a cursor moving and
clicking, a page reacting — and then that whole session folding down into one
more evidence card. Read it as a worked example of the hardest thing this
project does: animate a live product surface honestly, with continuity that
can't break. Every choice below is one you'll make again the first time you
build a set piece of your own.

---

## What this scene is for

The video's thesis is "give an agent web tools and one prompt and it goes out
and works the web — and every tool call comes back as a captured result the
workflow keeps." Scenes 3 and 4 taught the easy half of that: *find* (search)
and *read* (scrape). Both are invisible reaches — a chip rings, a card is born,
done. This scene teaches the hard half: **some pages can't be read, they have
to be *used*** — and that means there is nothing to abstract away. You have to
show hands on the web: a browser, a cursor, a click, a page responding.

So the scene does exactly one idea — *the agent drives a real browser session*
— and it has to make two things land at once without ever feeling like two
ideas:

1. **This is live.** A genuine browser viewport, a cursor that moves and
   clicks, a page that reacts. It reads as a session you're watching, not a
   diagram of one.
2. **This is still one tool call.** Everything you watch is a single Browser
   Use call, and when it finishes it becomes the fourth evidence card in the
   same rail the other three sit in — no different, in the end, from the search
   card or the page cards.

The tension the scene rides is *liveness vs. continuity*. A live session wants
to be a special, cinematic, full-screen moment. The rail discipline wants it to
be one more receipt. The scene's whole craft is being both: it rises center-frame
as a hero, then **folds** back into a rail slot, and the fold is what reconciles
them. Hold onto that — the fold is the scene.

## What it looks like

The Browser Use chip on the agent rings and *holds*. The rest of the world —
Start, Response, the edges, the three cards already in the rail — dims to 0.35.
A browser viewport rises into center frame: dark chrome (traffic lights, a
skeleton URL pill, the Browser Use glyph), a wireframe landing page underneath.
An arrow cursor fades in, eases up to a "Pricing" nav item, clicks (a ripple
rings outward), and the page dip-swaps to a pricing layout — three plan-card
wireframes. The cursor then visits each plan in turn — click, ripple — and on
each, the title-and-price region glows selection-blue and settles green,
keeping a faint green residue. The cursor leaves. Then the entire viewport —
chrome, page, green residues and all — scales and glides down into rail slot 4,
landing as evidence card 4 with the same green capture pulse the other three
cards got. The world undims. The agent's live ring never releases.

## The one real decision: render the live session as the *product's own surface*, then fold it into the rail

The scene renders the one shared set piece (`<Rig/>`) plus one overlay
(`<SessionViewport/>`):

```tsx
<Rig
  start={{dim}}
  agent={{highlighted: true}}
  response={{dim}}
  edge1={{dim}}
  edge2={{dim}}
  toolsReveal={1}
  chips={{browser: {ring: browserRing}}}
  cards={[{reveal: 1, dim}, {reveal: 1, dim}, {reveal: 1, dim}, {hidden: true}]}
/>
<SessionViewport state={viewport} />
```

Three things to take from this.

**The viewport is the product's own surface, not an invention.** Browser Use is
genuinely agentic in Sim — its block outputs a `liveUrl`, documented as
"Embeddable live browser session URL (active during execution)." So the thing
on screen is *that*: the live session URL rendered as a browser. You are not
designing "what a browser agent might look like"; you are showing the surface
the product literally emits. This is the port-don't-design rule applied to the
hardest possible case — a thing that feels custom is still grounded in a real
product output.

**The whole world is still rendered — just dimmed, not removed.** Start,
Response, the edges, and cards 1–3 all stay mounted at `dim` (0.35). This is
the same continuity discipline scene 1 used by keeping the chain `hidden` but
present: the agent keeps its `highlighted: true` live ring through the entire
session, so even while the browser is the hero, *the agent is visibly the actor
behind it.* You're never tempted to read the session as a free-floating thing;
it's tethered to the block that called it.

**Slot 4 is `hidden` on the Rig — because this scene *owns* slot 4.** Look at
the cards array: slots 0–2 are at rest (`reveal: 1, dim`), but slot 3 is
`{hidden: true}`. That's deliberate. The fourth evidence card doesn't exist yet
as a Rig card — it's *being made*, right now, out of the viewport. The viewport
will fold down and *become* slot 4. If the Rig also drew a card there, you'd
have two things in one slot at the fold. So the scene takes the slot away from
the Rig for the duration and hands it back, filled, at the end (scene 6 renders
slot 4 as a normal card again).

> *"Why fold the viewport into the slot instead of just fading the viewport out
> and fading a card in?"* Because a crossfade is a cut in disguise — it says
> "here is a session; now, separately, here is a card about it." The fold says
> something stronger and truer: *the session **is** the card.* The same pixels
> that were the live browser become the receipt. That's the equation the whole
> video is built on — every tool call comes back as a captured result — and the
> set piece is where that equation has to be most convincing, because the live
> session is the call that least *looks* like it could be reduced to a card. Make
> the reduction literal — same pixels, one continuous scale — and the viewer
> believes it without a word.

## How the fold is continuity-by-construction (read this before the timing)

This is the load-bearing geometry of the scene, and it's all in `layout.ts`:

```ts
export const CARD_W = 330;          // a rail slot is 330×200
export const CARD_H = 200;
export const VIEW_SCALE = 2.3;
export const VIEW_W = CARD_W * VIEW_SCALE;   // 759
export const VIEW_H = CARD_H * VIEW_SCALE;   // 460
export const VIEW_RECT = {x: 580.5, y: 552, w: VIEW_W, h: VIEW_H};
```

The viewport is designed at **exactly the rail-slot aspect ratio, scaled up
2.3×.** A slot is 330×200; the viewport is 759×460 — the same 1.65 aspect. That
is the entire trick. Because the big viewport and the small slot are the same
shape, the fold is a **single uniform scale** — every interior element travels
by the same factor, so *nothing reflows.* In `SessionViewport`:

```ts
const fx = interpolate(fold, [0, 1], [VIEW_RECT.x, target.x]);
const fy = interpolate(fold, [0, 1], [VIEW_RECT.y, target.y]);
const k  = interpolate(fold, [0, 1], [1, CARD_W / VIEW_W]);   // 1 → 0.4347…
```

The interior is laid out once at `VIEW_W × VIEW_H` and wrapped in
`transform: scale(${k})` with `transformOrigin: "top left"`; the outer box is
`VIEW_W * k × VIEW_H * k`. At `fold = 0` that's the full viewport at
center-frame; at `fold = 1` it's `759 × 0.4347 = 330` wide, `460 × 0.4347 = 200`
tall, sitting at `slotRect(3)` — pixel-exact on the slot every other scene reads.

> *"Why 2.3× and not, say, 3× or 2×?"* It's chosen against two pressures. Too
> small (say 1.5×) and the hero viewport isn't big enough to feel like a real
> session you're watching — the cursor, the plan cards, the click ripples all
> get cramped and the "liveness" doesn't read. Too big (say 3×) and the
> viewport starts crowding the dimmed chain above it and the rail below, and the
> fold becomes a long dramatic shrink that draws attention to itself as an
> *effect* rather than reading as "filing the result." 2.3× lands the viewport
> at 759×460 — large enough to host a believable cursor-and-click performance,
> small enough to sit cleanly in the reserved center space between chain and
> rail. And critically, **whatever you pick, it must be a clean multiple of the
> slot** — that's non-negotiable, because the aspect-match is what makes the
> fold reflow-free. 2.3 was tuned for size; the *integer-aspect* constraint is
> the real rule.

> *"Why `transformOrigin: top-left` and interpolate `x`/`y` separately, instead
> of scaling about the center?"* Because the landing target is a *specific rect*
> (`slotRect(3)`), not "wherever the center ends up." Driving `x`, `y`, and `k`
> independently lets the fold path end exactly on the slot's top-left corner
> with exactly the slot's dimensions — no trig, no drift. Scaling about center
> would land the viewport centered on the slot's center, which is the same
> place only if your arithmetic is perfect; this way the arithmetic is the
> interpolation and can't be off.

> *"The border radius does something odd —`borderRadius: 8 / Math.max(k, 0.001)`.
> Why divide?"* Because the radius lives *inside* the `scale(k)` transform, so it
> gets multiplied by `k` when rendered. To land at a real 8px radius (the house
> card radius `r8`) after the scale, you pre-divide by `k` so that `8/k × k = 8`.
> At `fold = 0`, `k = 1` and the radius is a plain 8 on the big viewport; at
> `fold = 1` the same machinery keeps it at 8px on the card. Without this the
> card corners would round at ~3.5px and not match the other three cards. The
> `Math.max(k, 0.001)` is just a divide-by-zero guard for the degenerate case.

> *"And the drop-shadow — `boxShadow: fold < 0.5 ? '…' : 'none'`?"* The big
> viewport floats as an overlay above the dimmed world, so it carries a soft
> drop-shadow to read as "lifted." A rail card does *not* float — it sits flush
> in the strip with the other three. So the shadow is switched off at the fold
> midpoint: while it's still mostly an overlay it's lifted; once it's mostly a
> card it's flush. The cut is hidden inside the motion, at the moment your eye
> is tracking the scale, not the shadow.

## The cursor rig — how the hands move

The cursor is the soul of "liveness," so it's worth reading the rig carefully.
It's an SVG arrow (`Cursor`), positioned by `left`/`top` in viewport page
coordinates, and it moves by **eased segments between waypoints** — never a
straight constant-velocity slide. The waypoints, in viewport coords, are:

```
entry (380, 300) → Pricing nav (700, 40) → plan 1 (165, 95)
                 → plan 2 (387, 95) → plan 3 (609, 95)
```

The motion is built from a single helper that the scene defines inline:

```ts
const seg = (lo, hi, a, b) =>
  interpolate(t, [lo, hi], [a, b], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut});
```

`seg` eases one coordinate from `a` to `b` over the time window `lo→hi`, with
`EASING.inOut` (the bezier `0.65, 0, 0.35, 1` — slow out of rest, fast in the
middle, slow into the target). Then `cx` and `cy` are piecewise functions of
`t`, switching which segment is active by time:

```ts
const cx =
  t < 5.6 ? seg(3.4, 4.3, 380, 700)
  : t < 7.6 ? seg(5.6, 6.6, 700, 165)
  : t < 9.2 ? seg(7.6, 8.4, 165, 387)
  : seg(9.2, 9.9, 387, 609);
const cy =
  t < 5.6 ? seg(3.4, 4.3, 300, 40) : t < 7.6 ? seg(5.6, 6.6, 40, 95) : 95;
```

A few things to notice.

**`x` and `y` are eased *together* over the same windows, so the cursor travels
on a curved diagonal, not in an L.** The first move (`3.4→4.3`) eases `x`
380→700 *and* `y` 300→40 simultaneously: the cursor swoops up-and-right to the
nav item in one gesture. If you eased `x` then `y`, the cursor would crawl along
edges like a maze-solver — instantly robotic. Co-eased coordinates read as a
hand.

**After the page swaps, `y` snaps to a constant 95 and only `x` moves.** The
three plan cards are in a row at the same height (`y = 95`), so visiting them is
pure horizontal travel — `cy` returns the literal `95` past `t = 7.6` with no
interpolation. The cursor slides left-to-right across the three plans. This is
correct and intentional: real cursor motion across a row of equal-height targets
*is* mostly horizontal.

> *"Why `EASING.inOut` for the cursor and not `EASING.out`?"* Because the cursor
> both *leaves* a resting target and *arrives* at the next one — it has rest at
> both ends. `EASING.out` (fast-then-slow) is for things entering from nothing,
> where there's no "leaving" to animate. A cursor that's been sitting on the nav
> item and is about to sit on a plan card should accelerate out of stillness and
> decelerate into stillness — that's `inOut`. Using `out` would make every move
> start at full speed, like the cursor was flicked. The project's easing rule is
> exactly this: `inOut` for transforms and moves, `out` for entrances. The
> cursor is a move.

> *"Why are the waypoints in 'viewport page coordinates' (700, 40 etc.) and not
> stage coordinates?"* Because the cursor lives *inside* the viewport's interior,
> which is laid out at `VIEW_W × VIEW_H` and then scaled by `k`. By authoring the
> cursor in interior coordinates, it rides the fold for free — but in this scene
> the cursor has already faded out before the fold begins (more below), so what
> this really buys is simplicity: the cursor's targets are the same numbers as
> the nav item and plan cards it's pointing at, because they're in the same
> coordinate space. The nav `Bar` is drawn near the top-right of page A; the
> cursor's nav target is (700, 40) — the same place, same space.

**The cursor fades, it doesn't teleport, and it leaves *before* the fold:**

```ts
const cursorOp = Math.min(cv(t, 3.2, 3.6), cv(t, 11.6, 12.1, 1, 0));
```

It fades in over 3.2→3.6s and fades out over 11.6→12.1s — and the scene only
renders it while `cursorOp > 0` (`cursor: cursorOp > 0 ? {…} : null`).

> *"Why make the cursor leave at 12.1, before the fold starts at 12.6?"* This is
> a subtle, important beat. If the cursor were still on screen when the viewport
> folded, the fold would read as *the cursor dragging the window into the rail* —
> as if the hands were doing the filing. But the filing isn't a hand gesture;
> it's the *system* recording the result. So the hands finish their work
> (clicking the three plans) and *leave*, and only then — with the session
> sitting there, captured, unattended — does it fold itself away. The half-second
> gap (12.1 → 12.6) is the difference between "the cursor put it away" and "the
> system filed it." That half second is doing real semantic work.

## How a click lands — the ripple and the consequence

A click is two things on screen: a **ripple** (the feedback that a click
happened) and a **consequence** (what the click did) — and the scene is
scrupulous about never letting them be simultaneous.

The ripples are four entries, each a click point with a progress value:

```ts
const ripples = [
  {x: 700, y: 40, p: cv(t, 4.3, 4.75)},   // the Pricing nav click
  {x: 165, y: 95, p: cv(t, 6.7, 7.15)},   // plan 1
  {x: 387, y: 95, p: cv(t, 8.5, 8.95)},   // plan 2
  {x: 609, y: 95, p: cv(t, 10.0, 10.45)}, // plan 3
];
```

Each `p` ramps 0→1 over a ~0.45s window. The viewport renders the ripple as an
expanding, fading ring:

```ts
if (rp.p <= 0 || rp.p >= 1) return null;       // only visible mid-click
const r = 6 + 26 * rp.p;                        // radius grows 6 → 32px
border: `2.5px solid rgba(51, 180, 255, ${0.9 * (1 - rp.p)})`,  // fades as it grows
```

So a click is a 2.5px selection-blue ring that starts at 6px radius and expands
to 32px while fading to nothing — the universal "tap" feedback, in the product's
own selection-blue (`rgba(51,180,255)`). It only exists for that ~0.45s window;
at `p ≤ 0` or `p ≥ 1` it renders nothing, so it never lingers.

> *"Why does the ripple expand *and* fade at the same time?"* Because that's the
> physics your eye already knows from every touchscreen and every macOS click —
> a disturbance radiating out and dissipating. Expanding-only would read as a
> growing circle (a target, a loading state); fading-only would read as a
> blinking dot. The combination — `r` up, opacity `0.9 * (1 - p)` down — is
> unambiguously "a click happened *here*, just now." It's 6px at birth (a
> point, where the cursor tip is) and 32px at death (spread out, gone), so it
> reads as originating exactly under the cursor.

Now the **click-then-consequence ordering.** Watch the first click against the
page swap:

```ts
const page = cv(t, 4.6, 5.4);            // page A → page B (pricing)
// ripple at the nav:  cv(t, 4.3, 4.75)
```

The nav ripple starts at **4.3**; the page begins swapping at **4.6** — a 0.3s
gap. Click first, *then* the page changes. The same ordering holds for the plan
captures: the cursor arrives, the ripple fires, and only after does the
plan's region glow. Cause visibly precedes effect, every time, by about a third
of a second.

> *"Why 0.3s and not simultaneous, or instant?"* Simultaneous reads as
> coincidence — the page just *happened* to change when the cursor was there.
> Instant (0.0s) reads as a hard cut and loses the causal beat. ~0.3s is the
> sweet spot where the eye registers the click as *the cause*: it sees the
> ripple, and a beat later the world responds *to* it. This is the same
> ring=card-birth discipline from scenes 3–4 (cause before effect, both clearly
> one event) applied to the cursor: click before consequence, both clearly one
> event.

## How the page reacts — the dip-swap

The page doesn't cut from landing-page to pricing-page; it **dips through black
and back**, swapping content at the bottom of the dip:

```ts
const pageDip = Math.min(1, Math.abs(page - 0.5) * 4);   // page opacity
const isPricing = page >= 0.5;                            // which layout
// …page area:  opacity: pageDip
```

`page` ramps 0→1 over 4.6→5.4s. `pageDip` is the page-area opacity: it's
`|page − 0.5| × 4` clamped to 1, which is a **V** — full opacity at `page = 0`,
*zero* opacity at `page = 0.5` (the midpoint), full opacity again at `page = 1`.
And `isPricing` flips from the landing wireframe to the pricing layout exactly
at `page = 0.5` — i.e. at the bottom of the dip, when the page is invisible.

> *"Why dip to black instead of crossfading the two pages?"* Two reasons. First,
> a crossfade would briefly show landing-page and pricing-page *superimposed* —
> a muddy double-exposure that no real browser ever produces. A real page
> navigation blanks and repaints; the dip-to-black-and-back is exactly that
> repaint, abstracted. Second, swapping the layout at `pageDip = 0` means **the
> swap is never visible as a swap** — the hard switch from one DOM to another
> happens while the page is at zero opacity, so you never catch the layout
> "popping." You see: page fades down, page fades up, and it's different now.
> That's how navigation feels. The `× 4` makes the dip *fast* (the page is only
> near-invisible for a brief window around the midpoint) so it reads as a snappy
> reload, not a slow dissolve.

The two page layouts are both wireframes, by declared design (no real run
artifact exists). Page A is a landing page — a nav row with a deliberately
brighter "Pricing" `Bar` (op 0.55, `textTertiary`) that is *the cursor's first
target* — plus a centered hero block. Page B is the pricing page: a title bar
and three `PlanCard` wireframes in a row. Nothing on either page is readable
text; it's all seeded skeleton bars. That's the same honesty rule the cards
follow — **the page shows the *shape* of a pricing page, never invented prices**
— justified by the registry's own authored Browser Use task ("go to the pricing
page and collect every plan name and monthly price").

## How a capture lands — blue glow → green settle → kept residue

Each of the three plans gets captured, and a capture is a two-phase event:
**read it** (selection-blue) → **keep it** (green), with the green *never
decaying fully back to zero.* The captures array:

```ts
const captures = [
  { glow:  Math.min(cv(t, 6.8, 7.2),  cv(t, 7.8, 8.2, 1, 0)),
    green: Math.min(cv(t, 7.8, 8.4),  cv(t, 9.4, 10.0, 1, 0.25)) },   // plan 1
  { glow:  Math.min(cv(t, 8.6, 9.0),  cv(t, 9.5, 9.9, 1, 0)),
    green: Math.min(cv(t, 9.5, 10.1), cv(t, 10.9, 11.5, 1, 0.25)) },  // plan 2
  { glow:  Math.min(cv(t, 10.1, 10.5),cv(t, 11.0, 11.4, 1, 0)),
    green: Math.min(cv(t, 11.0, 11.6),cv(t, 12.2, 12.8, 1, 0.25)) },  // plan 3
];
```

Each `glow` is a `Math.min(up, down)` wave — rises over ~0.4s, holds, falls to
zero. Each `green` is also a wave, but its *down* leg interpolates to `0.25`,
not 0 — so after the green settles, a quarter-strength residue stays. The
`PlanCard` renders both over the title+price region:

```ts
backgroundColor: `rgba(51, 180, 255, ${0.16 * capture.glow})`,        // blue read
boxShadow:       `inset 0 0 0 999px rgba(34, 197, 94, ${0.13 * capture.green})`,  // green keep
```

So on plan 1: at ~6.8s the title-and-price region fills selection-blue (*the
agent is reading this region*); at exactly **7.8s** the blue starts releasing
and the green starts rising — the handoff is instantaneous and simultaneous —
and by ~9.4s the green decays not to nothing but to 0.25, a faint permanent
green wash on that region. That residue is the point: **the card keeps showing
*what* was captured.**

> *"Why hand blue off to green at the *same instant* (7.8) rather than letting
> blue fully fade and then bringing green up?"* Because reading-and-keeping is
> one continuous act, not two. If blue fully cleared before green appeared,
> there'd be a gap where the region is neutral — a beat of "nothing captured
> here" between the read and the keep. Crossing them at one instant says: the
> moment it finished reading is the moment it had captured. Blue *becomes*
> green. This is the exact ResolvedTag discipline — the value is being resolved
> in place, and the color *is* the state machine: live-blue → done-green.

> *"Why does the green decay to 0.25 instead of staying full or going to zero?"*
> Going to zero would mean the capture *un-happened* — the region would look
> untouched, and the card would carry no memory of what it grabbed. Staying full
> green would scream "ACTIVE / just now" forever, even minutes later in the
> bookend. 0.25 is *residue* — strong enough that you can always see "these
> three regions are the captured ones," faint enough that it reads as
> settled-history rather than live-action. It's provenance: a quiet, permanent
> mark of *what this evidence is.* And it has to survive the fold (those green
> washes ride down into the card), which is why `SESSION_FINAL` in the rig hard-codes
> exactly `green: 0.25` on all three plan regions — the at-rest card *is* the
> session with its residue.

> *"Why do the three captures accelerate — gaps of 1.8s then 1.5s?"* Same tempo-lift
> idea scenes 3–4 used: the first capture is taught slowly (cursor travels
> `5.6→6.6`, the move is shown in full), and each subsequent one is a touch
> faster — travel windows and gaps both shrink. Repetition reads as *fluency*;
> acceleration reads as *momentum*. By plan 3 the viewer isn't learning the
> gesture anymore, they're watching a competent thing finish a routine. You
> never write "and it does this for each plan" — the shrinking cadence says it.

## The animation, beat by beat

The scene's clock is `t = frame / fps` (seconds into the scene). Two helpers
carry everything: `cv(t, lo, hi, a=0, b=1)` is a clamped interpolate (linear
ramp from `a` to `b` as `t` crosses `lo→hi`), and `popIn(frame, fps, delay, dur)`
is the spring entrance (damping 14 / stiffness 160) that clamps to *exactly* 1
afterward so boundary frames stay pixel-static. `Math.min(cv(up), cv(down))` is
the wave idiom — rise, hold, fall — used for every ring and glow.

### (a) The chip rings up early and *holds* the whole session — `browserRing = Math.min(cv(t, 0.5, 0.9), cv(t, 14.4, 15.0, 1, 0))`

The Browser Use chip on the agent rings up over 0.5→0.9s and does not release
until 14.4→15.0s — a ~14-second held ring, releasing only *after* the fold has
landed (the fold completes at 14.0).

> *"Why hold one ring for fourteen seconds when every other tool call's ring was
> ~2 seconds?"* Because everything you watch — navigate, click, swap, capture
> three plans, fold — is **one Browser Use call.** In scenes 3–4, a call was
> instantaneous from the viewer's side: ring, card, done. Here the call has
> *duration you can see* — that's the whole novelty of a live session. A single
> unbroken ring spanning the entire session is the visual sentence "this is all
> one tool call." If the ring blinked per click, you'd read four calls; one
> continuous ring says one call that happens to take a while. And it releases
> only *after* the fold so that the chip is still lit while the result is being
> filed — the call isn't "done" until the evidence is in the rail.

### (b) The world dims, and undims during the landing — `dim = Math.min(cv(t, 0.9, 1.6), cv(t, 13.6, 14.3, 1, 0))`

Everything that isn't the working agent — Start, Response, edges, cards 1–3 —
dims to 0.35 over 0.9→1.6s, and *undims* over 13.6→14.3s. The agent itself keeps
its live ring and is never dimmed.

> *"Why undim *during* the fold (13.6→14.3) rather than after it (>14.0)?"* The
> fold runs 12.6→14.0. The undim runs 13.6→14.3 — it *overlaps* the back half of
> the fold. That overlap is the beat: as the session glides down into the rail,
> the room lights come back up *around* it. The metaphor is "the agent steps out
> of its focused work and the desk reappears, now with one more receipt on it."
> If you undimmed strictly after the fold, you'd get a dead beat — landed card,
> then a separate lights-up — two events. Overlapping them makes the filing and
> the return-to-normal one continuous motion: the world reassembles *as* the
> evidence lands.

### (c) The viewport rises — `reveal = popIn(frame, fps, 1.4, 0.8)`

The viewport springs in starting at 1.4s over 0.8s, with a 30px upward drop-in
(`top: fy - 30 * (1 - reveal)`) and an opacity ramp (`Math.min(1, reveal * 1.3)`).

> *"Why start the rise at 1.4, after the dim (0.9→1.6) has begun but not
> finished?"* So the rise reads as *caused by* the dim, not concurrent with the
> chip ring. Order of events: chip rings (0.5) → world starts dimming (0.9) →
> viewport rises into the cleared space (1.4). Each is a beat apart, so the
> viewer reads a chain — *the tool is called, the room makes space, the session
> appears* — rather than three things flashing at once. Stacking them on the
> same frame is the fastest way to make a set piece feel busy; staggering by
> half-beats is what makes it feel composed.

> *"Why `popIn` (a spring) for the viewport but plain `cv` ramps for the glows
> and rings?"* Because the viewport is a *physical object entering the frame* —
> a window rising into place — and a spring's slight organic overshoot-and-settle
> is exactly how a surface should arrive. Glows and rings aren't objects, they're
> *states* (something is active / being read), and a state should ramp cleanly,
> not bounce. `popIn` for things that move through space; `cv` for things that
> change intensity. Same division as easing-for-travel-only in scene 1.

### (d) The cursor performs — fades in 3.2→3.6, navigates and clicks, fades out 11.6→12.1

Covered in detail in the cursor and click sections above. The arc, in time:
fade in (3.2) → swoop to nav (3.4→4.3) → click nav (4.3) → page swaps (4.6→5.4)
→ visit plan 1 (5.6→6.6), click (6.7), capture (6.8→) → plan 2 (7.6→8.4), click
(8.5), capture (8.6→) → plan 3 (9.2→9.9), click (10.0), capture (10.1→) → fade
out (11.6→12.1). The hands arrive, work, and leave — and the leaving is what
licenses the fold to read as the system filing the result.

### (e) The fold — `fold = eased interpolate over [12.6, 14.0]`

```ts
const fold = cv(t, 12.6, 14.0) === 0 ? 0 : interpolate(t, [12.6, 14.0], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut,
});
```

The signature move. `fold` eases 0→1 over 12.6→14.0s with `EASING.inOut`, and
that single value drives `fx`, `fy`, and `k` (position and scale) in
`SessionViewport`, plus the shadow cut at 0.5. The whole viewport — chrome,
pricing page, the three green residue washes — uniformly scales and glides from
center-frame onto rail slot 4. Nothing reflows (the aspect-match guarantees it);
the residues ride down intact and *are* the card's content.

> *"Why the `cv(...) === 0 ? 0 : interpolate(...)` shape — why not just the eased
> interpolate?"* It's a guard so the value is *exactly* 0 before 12.6, not a
> floating-point near-zero. Before the fold, the viewport must sit pixel-static
> at `VIEW_RECT` (the boundary from scene 4's continuity isn't at issue here, but
> the held session frame is): an eased interpolate clamped left still returns
> exactly 0 at its left edge, but the explicit `=== 0 ? 0` makes the *intent*
> unmistakable and bulletproofs the at-rest frame against any easing-curve
> rounding. It's the same discipline as `popIn` clamping to exactly 1 — transient
> machinery must land on exact integers at its rest states or boundary frames
> drift.

> *"Why `EASING.inOut` for the fold?"* Because the fold is a *move* of an object
> from one resting place (center overlay) to another (the rail slot) — rest at
> both ends. Slow out of center, travel, slow into the slot. `EASING.out` would
> launch it at full speed (flicked away); `EASING.in` would end at full speed
> (slammed in). `inOut` is the only curve that makes a window glide gracefully
> from A to B, and it matches the project's move-easing rule exactly.

### (f) The land pulse — `landPulse = Math.min(cv(t, 14.0, 14.3), cv(t, 15.0, 15.5, 1, 0))`

The instant the fold lands (14.0), a green capture ring pulses on slot 4 — rises
over 14.0→14.3, holds, releases 15.0→15.5 — drawn as an inset 2.5px green
(`rgba(34,197,94)`) ring on the slot rect, the *same* green capture pulse cards
1–3 got when they were born.

> *"Why give the folded session a capture pulse at all — it already has the green
> residues?"* Because this is the rhyme that closes the scene's argument. Every
> other card announced its birth with one green capture-ring pulse (scene 3,
> scene 4 ×2). The session is the fourth card; it gets the identical pulse at the
> identical moment in its life (the instant it lands in its slot). The residue
> washes say *what* was captured (provenance, permanent); the land pulse says
> *a capture just completed here* (event, transient) — and it's the exact same
> event the other three cards had. With that pulse, the live browser session —
> the call that least looked reducible — is unmistakably just evidence card 4.
> The set piece's whole job is to make that equation undeniable, and the
> borrowed pulse is the last brushstroke.

### (g) The hold — from ~15.5s to the end of the scene

After the land pulse releases (15.5) and the ring releases (15.0), the scene
holds ~4.8s (15.5→20.3 per the VO stretch) on the full assembled state: the
agent's live ring still burning, all four cards in the rail. Nothing moves.

> *"Isn't a 4.8-second still hold dead air right after the payoff?"* It carries
> an *unresolved* state, which is what keeps it alive — the agent's live ring is
> still lit. The run isn't done; the agent has its four pieces of evidence and is
> (about to be) assembling them. So the hold reads as held tension — "it has
> everything it needs; now what?" — which is exactly the question scene 6
> answers. And, as in scene 1, ending on a settled state with no animation
> mid-flight is what lets the scene *stretch* to fit the voiceover safely: the
> only thing in motion (the live ring) is a steady pulse with no start or end to
> freeze. A held, settled tail is what makes the audio step downstream painless.

## How to think about the whole scene

Walk the decisions in order and each one answers a question the previous one
raised:

1. *What is a "live browser session," honestly?* The product's own `liveUrl`
   surface → render a real browser viewport, not a designed one.
2. *How do I make it the hero without abandoning the rail discipline?* Dim the
   world, rise center-frame — but design the viewport at the rail-slot aspect so
   it can fold back in.
3. *How does it read as still being one tool call?* One Browser Use chip ring,
   held ~14s across the entire session → one ring, one call.
4. *How do hands move like hands?* Co-eased `x`/`y` waypoint segments with
   `EASING.inOut` → curved, decelerating travel, never an L-shaped crawl.
5. *How does a click read as a click?* A blue ripple that expands-and-fades at
   the cursor tip, then the consequence ~0.3s later → cause before effect.
6. *How does the page react?* A fast dip-to-black with the layout swapped at the
   invisible midpoint → a repaint, never a muddy crossfade.
7. *How does a capture read?* Blue read → green keep at one instant → a 0.25
   residue that stays → the card remembers what it grabbed.
8. *How does the session become a receipt?* A single uniform fold onto slot 4
   (same pixels), the shadow cut at the midpoint, the world undimming during the
   landing, and the same green land-pulse every other card got → the session
   *is* evidence card 4, proven by construction.

There's no single clever move — the set piece is the sum of eight honest
decisions, each one a small refusal to fake it. The fold is the load-bearing
one, but it only works because the aspect-match was set up in `layout.ts` long
before any motion existed.

## Exit state (what scene 6 inherits)

`agent LIVE ring (never released — carried since scene 3) · world undimmed (back
to full) · four cards in the rail, all at rest and pixel-static · card 4 = the
folded session showing its three 0.25 green residues (the rig's `SESSION_FINAL`)
· no cursor, no viewport overlay, no ripples · Browser Use chip ring released`.
Scene 6 opens on exactly this frame: it re-renders slot 4 as a normal Rig card
(no longer `hidden`) carrying `SESSION_FINAL`, and begins glowing all four cards
in call order as the agent assembles its brief. Because both scenes render the
same set piece and the folded viewport landed pixel-exact on `slotRect(3)`, the
handoff from "viewport-that-became-card-4" to "Rig-card-4" is identical down to
the pixel — the residues are in the same place at the same strength on both
sides of the cut.

## Component-extraction candidate

The director wants the browser + cursor + click visuals replicated as reusable
components. Here's exactly what's reusable, what isn't, and what the components
should look like. Today all of this lives inline in `_rig.tsx` (the
`SessionViewport`, the inner `Cursor`, `PlanCard`, and the ripple loop) and in
`HandsOnTheWebScene.tsx` (the waypoint/segment math, the ripple/capture arrays).
Three components fall out cleanly.

### 1. `<BrowserSession>` — the viewport shell (high reuse)

The chrome and frame are entirely topic-agnostic and should be promoted to
`src/components/` as the canonical "live browser session" surface for any future
video that shows Browser Use (or any web-driving tool).

**Reusable as-is:** the dark chrome bar (traffic lights `#ff5f57 / #febc2e /
#28c840`, the skeleton URL pill, the tool identity chip slot), `surface2` frame
on `border1` at `r8`, the lifted drop-shadow, the page-area dip-swap mechanism,
and — critically — **the fold-to-slot geometry.**

**Proposed props:**
```ts
type BrowserSessionProps = {
  reveal?: number;          // popIn rise + opacity (rig keeps this)
  page: React.ReactNode;    // the page content — caller supplies the wireframe
  toolChip?: {color: string; glyph: React.ReactNode};  // identity chip in chrome
  cursor?: {x: number; y: number; opacity: number} | null;
  ripples?: {x: number; y: number; p: number}[];
  fold?: number;            // 0 = full viewport, 1 = folded into target slot
  foldTarget?: {x: number; y: number; w: number; h: number};  // the slot rect
  viewRect?: {x: number; y: number; w: number; h: number};    // at-rest rect
};
```

**Native metrics to preserve (non-negotiable):**
- **The aspect-match invariant.** `viewRect` must be `foldTarget` scaled by an
  integer-ish factor (here 2.3×) at the *same aspect ratio*. This is the entire
  reason the fold is reflow-free. The component should arguably *enforce* this —
  derive `viewRect` from `foldTarget × scale` so a caller can't accidentally
  break it.
- `CHROME_H = 56`, traffic-light dims (11px circles), URL pill (24px tall, r12,
  max-width 320, `surface1` on `border`), the 28px tool chip (r7, `border1`).
- The fold math verbatim: `fx/fy = interpolate(fold, [0,1], [viewRect, target])`,
  `k = interpolate(fold, [0,1], [1, target.w / viewRect.w])`, `transformOrigin:
  top-left`, `borderRadius: 8 / max(k, 0.001)`, shadow cut at `fold < 0.5`.
- The page dip: `pageDip = min(1, |pageProgress − 0.5| × 4)`, layout swap at the
  midpoint. This is reusable as a small `usePageDip(progress)` hook or a
  `<DipSwap a={…} b={…} progress={…} />` wrapper.

**Stays scene-specific:** the *page contents* (`page A` landing wireframe, `page
B` pricing layout, `PlanCard`) — those are this video's topic. `BrowserSession`
takes `page` as children; the pricing wireframe is the caller's business.

### 2. `<Cursor>` + a waypoint driver (high reuse)

The `Cursor` SVG (the classic arrow: `#fff` fill, `#1b1b1b` 1.4px stroke,
`strokeLinejoin: round`, 26px) is 100% reusable and should move up unchanged.
The *waypoint-segment easing* is the more valuable extraction — right now `cx`/`cy`
are hand-written piecewise ternaries in the scene, which is error-prone to
author. Promote a driver:

```ts
// useCursorPath(t, waypoints) → {x, y}
type Waypoint = {t0: number; t1: number; x: number; y: number};
// each leg eases x AND y together over [t0, t1] with EASING.inOut from the
// previous waypoint; holds at the last reached waypoint between legs.
```

**Native behaviors to preserve:** co-eased `x`/`y` (never sequential), `EASING.inOut`
on every leg (rest at both ends), and a hold (constant) between legs. The driver
should make "the cursor swoops on a diagonal and decelerates into each target"
the default, because that's what makes it read as a hand.

### 3. `useClickRipple` / `<ClickRipple>` (high reuse)

The ripple is a tiny, pure, fully reusable primitive:

```ts
// a click at (x,y) with progress p∈(0,1):
//   radius = 6 + 26*p ; border = 2.5px rgba(51,180,255, 0.9*(1-p)) ; hidden at p≤0||p≥1
```

**Native metrics to preserve:** the 6→32px expansion, the selection-blue
(`rgba(51,180,255)`), the `0.9*(1-p)` fade-with-expansion, and the render-nothing
guard outside `(0,1)`. Pair it with the project convention that the *consequence*
of a click trails the ripple by ~0.3s — that timing offset is a usage rule worth
documenting on the component, not a prop.

### Deliberately NOT extracted

- **The capture two-phase (blue→green→0.25 residue).** This is the
  evidence/provenance language shared with the cards (ResolvedTag lineage), not a
  browser concept. It belongs with the *card* grammar, not `BrowserSession`. If
  anything, factor a shared `useCaptureGlow(t, …)` that both the plan regions and
  the cards call — but keep it out of the viewport component.
- **`PlanCard` and the two page wireframes** — topic-specific (pricing), as above.
- **The held-chip-ring and world-dim orchestration** — those are scene-level
  staging (which blocks dim, how long the ring holds), not viewport behavior.

**Net:** three new primitives — `BrowserSession` (viewport shell + fold +
dip-swap), `Cursor` + `useCursorPath` (the hands), `ClickRipple` (the click) —
would let any future video stage a live browser session by supplying only the
page wireframe and a waypoint list, while the load-bearing invariants (aspect-match
fold, co-eased cursor, expand-and-fade ripple, click-then-consequence offset)
travel with the components instead of being re-derived each time.
