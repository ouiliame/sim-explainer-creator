# Scene 4 — `reading-the-pages`  ·  archetype: **tool calls / evidence accumulation**

Source: `../source/scenes/ReadingThePagesScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/script-v1.md` (scene 4).

This is the scene the whole video is built to earn — the one the director
singled out: *"the evidence filmstrip accumulating in sync with each tool
call."* Read it as the worked example of the move at the heart of the piece:
**one tool call = one card births in the rail.** Scene 4 teaches that move
twice in nine seconds, the second time faster, and that's the entire scene.

---

## What this scene is for

The video's thesis is "give an agent web tools and one prompt, and it goes
out and works the web — and every tool call comes back as a captured result
the workflow keeps." The previous scene taught that equation once (the agent's
first move was an Exa search, and a search-results card dropped into the rail
in sync). This scene's job is to **establish that the equation is a pattern,
not a one-off** — to show the agent doing the same thing again, and again, one
call per page worth reading, with the filmstrip growing each time.

So the rule the scene follows is *one idea per scene*: this scene is "the
agent reads pages, and each read is a captured card," full stop. It is not
about *what* the pages say (that content never appears — see below), and it is
not about the browser session (that's scene 5's set piece). It is purely the
**rhythm of accumulation**: ring → card, ring → card.

There's a second, quieter idea folded in, and it's the reason there are *two*
reads here and not one: the repeat. A single read teaches "this is what a read
looks like." The repeat — at a faster tempo — teaches "this is *routine* now;
the agent does this per source." That's why the choreography compresses every
window on the second call: the acceleration is the message.

## What it looks like

The chain (Start → Research → Response) sits where it has all video, the
Research block burning a blue live ring it lit two scenes ago and hasn't
released. Below it, the evidence rail: card 1 (the Exa search results from
scene 3) already at rest in slot 1. Then the Firecrawl chip on the Research
block rings, and a page-capture card drops into slot 2 — a title bar and a
paragraph of skeleton lines drawing in. The chip ring fades, a green capture
ring flashes around the new card and settles. Then it all happens *again*,
faster: the chip rings a second time, card 3 drops into slot 3 (same shape,
different skeleton), captures green. Three cards now sit in the rail. The live
ring still holds. Cut.

## The one real decision: render the whole set piece, carry the held state

Like every scene in this video, scene 4 renders the *single* set piece — one
`<Rig/>` — and passes it state. It builds almost nothing of its own:

```tsx
<Rig
  agent={{highlighted: true}}
  toolsReveal={1}
  chips={{firecrawl: {ring: Math.max(ring1, ring2)}}}
  cards={[{reveal: 1}, card2, card3, {}]}
/>
```

Three things to take from this.

**The `<Rig/>` is the entire world; scenes only pass state.** The chain, the
three tool chips, the four-slot rail — all of it lives in `_rig.tsx` and is
positioned by `layout.ts`. A scene never lays anything out; it hands the rig a
prop bag describing *what state the world is in right now*. That's why
continuity is free: scene 3's last frame and scene 4's first frame are the
same rig in (nearly) the same state, by construction.

**The held live ring is carried in as a prop, not re-lit.** `agent={{highlighted:
true}}` — the Research block is live for the *entire* duration of this scene,
flat true, no animation. It was lit in scene 3 at t=1.6s and it does not release
until scene 6. Scene 4 is one stretch in the middle of that long-held ring, so
the scene's job is to *not touch it* — just declare it on. This is the run-spine:
one blue ring spanning four scenes, every boundary a freeze-cut carrying it.

> *"Why hold a ring across four scene cuts instead of releasing and re-lighting
> per scene?"* Because the live ring means **the run is mid-flight** — the agent
> is still working. If it released between calls, you'd be saying the run
> finished and restarted four times, which is a lie: it's *one* Start→Response
> traversal. The held ring is what makes the four tool calls read as four moves
> inside a single run rather than four separate runs. Releasing it is itself a
> beat — and it's reserved for scene 6, when the agent finally hands back the
> brief.

**Card 1 is passed `{reveal: 1}` — explicitly at rest.** The first slot still
holds the search-results card from scene 3, and the scene declares it fully
revealed (`reveal: 1`), which `popIn` clamps to *exactly* 1 — pixel-static.
The card doesn't re-animate or re-pop on the cut; it's just *there*, the same
as the last frame of scene 3. Slot 4 is `{}` (the empty default, `reveal: 0`),
so it renders nothing — that slot belongs to scene 5's folded browser session.

> *"Why pass `{reveal: 1}` for card 1 instead of just leaving it out?"* Because
> leaving it out (`{}`) means `reveal: 0` — the card would *vanish*. Card 1 must
> persist visibly across the cut (continuity contract: 3→4 carries card 1 at
> rest). The rail only ever grows; a card that has landed never leaves and never
> moves. So every scene from here on must keep re-declaring the cards already in
> the rail as fully present. The filmstrip is cumulative state, re-asserted each
> scene.

## The two-surface sync — the move this whole video exists to show

The director's praise was specifically for **"the evidence filmstrip
accumulating in sync with each tool call."** That sync is the load-bearing
mechanism, so it's worth being precise about how it's built. Every tool call is
*one event shown on two surfaces at once*:

1. **The tool chip rings** on the Research block — the product's own "this tool
   was called" signal, a ring pulse around the chip.
2. **A card births in the rail** — springs into the next open slot and captures.

These are deliberately wired so the chip ring starts *first* and the card birth
follows a beat later, *inside* the ring window. Cause visibly precedes effect,
yet both read as a single gesture. The discipline (the ResolvedTag synchrony
rule from the component library) is: when one thing causes another, show both,
and let the timing make the causation visible — never just one, never
simultaneous.

> *"Why two surfaces? Wouldn't the card alone be enough?"* The card alone tells
> you a card appeared, but not *why*. The chip ring is the product's vocabulary
> for "the agent called this tool" — it ties the new evidence back to a specific
> tool on a specific block. Showing both, in sync, is what makes the viewer
> learn the equation `chip ring = captured result` without a word of narration.
> Drop the ring and the cards look like they're appearing on their own, which
> breaks the honesty rule (nothing changes in a Sim workflow unless something
> causes it).

> *"Why does the same chip ring twice instead of two different chips?"* Both
> reads are **Firecrawl** calls — the registry's read tool. (Exa *finds* the
> pages in scene 3; Firecrawl *reads* them here; Browser Use *acts* in scene 5.)
> The agent calling the same tool twice in a row is the literal truth of the
> task — "scrape each source with Firecrawl" — so the same chip rings twice.
> That's why both rings feed the *same* prop:
> `chips={{firecrawl: {ring: Math.max(ring1, ring2)}}}`. Two ring windows,
> `Math.max`'d so whichever is active drives the chip; between them the ring is
> zero (the chip rests). One chip, two calls.

## The values, and why the captured pages are skeleton lines

Open the rig and you'll find that the page cards (slots 2 and 3) render no
words — a title bar and five paragraph lines, all gray skeleton bars:

```tsx
<PageCard slot={1} vis={cards[1]} seed={4} />
<PageCard slot={2} vis={cards[2]} seed={9} />
```

The bars' widths are *seeded*, not random: `seededPct(seed, i, base, span)`
derives a deterministic width from the card's seed and the row index, so the
same card looks the same on every render (no jitter, no flicker) but two
different cards look like two different pages.

> *"Why no actual page text — wouldn't real text be more convincing?"* Because
> **no real run artifact exists** (this is a batch build, declared in the script's
> assumptions). The honest options are: invent fake page text, or show the
> *shape* of a captured page without inventing its content. The video chooses
> the second — captured content is always the house skeleton-line language
> (inherited from the ChunkCard precedent). The filmstrip shows you that
> evidence *was captured and has structure*, never puts words in the agent's
> mouth. When a real artifact arrives, the swap is four card bodies, no layout
> change.

> *"Why does card 3 take a different `seed` (9) than card 2 (4)?"* So the two
> page captures don't look identical. Same card grammar (title + paragraph),
> different skeleton — which reads as "two different pages, both read the same
> way." If both used the same seed, the repeat would look like a glitch (the
> same card drawn twice) rather than a second, distinct source. The seed is the
> cheapest possible way to say "different page, same shape."

## The card grammar — component selection

Both reads use `PageCard`, which is the Firecrawl-flavored member of a small
card family, all built on one `CardShell`:

- **`CardShell`** — the house card chrome: `surface2` body, `border1` 1px
  border, `r8` radius, a 36px header strip carrying *only* the tool's identity
  chip (a 20px rounded square in the tool's registry color with its glyph). No
  caption, no label — the chip *is* the provenance, because the synced chip
  ring already taught which tool this card came from. The shell also owns the
  two transient overlays: a selection-blue `glow` ("the agent is reading this")
  and a green `pulse` ("just captured").
- **`SearchCard`** (slot 0, scene 3) — Exa chip, three favicon-dot + title/sub
  rows (search results have a list shape).
- **`PageCard`** (slots 1–2, this scene) — Firecrawl chip, a bold title bar
  then five paragraph lines (a page has a document shape).

That the search card and the page card are visibly *different shapes* is
deliberate: a viewer can tell "this is a search result" from "this is a read
page" at a glance, without reading anything. The shape carries the meaning.

> *"Why is the chip the only thing in the header — no source URL, no title?"*
> Because a URL or title would be words, and words are off-screen content here
> (no real artifact). The chip alone is enough provenance: you watched the
> Firecrawl chip ring as this card was born, so you already know it's a
> Firecrawl read. Adding a skeleton "title bar" inside the body (not the header)
> gives the *shape* of a page heading without claiming to know its text.

## The animation, beat by beat

Two helpers do all the timing. `cv(t, lo, hi)` is a clamped interpolate from 0
to 1 as the clock `t` (seconds) crosses `lo`→`hi`, flat outside. `popIn(frame,
fps, delay, dur)` is a spring (damping 14, stiffness 160) that's 0 before
`delay`, springs over `dur` with a slight organic overshoot, then clamps to
*exactly* 1 — so a landed card is pixel-static. Chip rings and capture pulses
are `Math.min(cv(up), cv(down))` pairs: rise, hold, fall.

The scene is the same gesture twice. Walk call 2 in full; call 3 is the same
shape compressed.

### Call 2 — learn the move (the Firecrawl read)

```ts
ring1 = Math.min(cv(t, 0.8, 1.1), cv(t, 2.8, 3.2, 1, 0));
card2 = {
  reveal: popIn(frame, fps, 1.3, 0.7),
  body:   cv(t, 1.5, 2.8),
  pulse:  Math.min(cv(t, 2.1, 2.4), cv(t, 3.3, 3.8, 1, 0)),
};
```

- **The chip rings** — up over **0.8→1.1s** (a fast ~0.3s rise), holds, down
  over **2.8→3.2s**. A ~2.4-second ring: long enough to feel like a call that
  takes a moment, framing the whole birth-and-capture inside it.
- **The card births** — `popIn` at **delay 1.3s, dur 0.7s**. It springs into
  slot 2 with a 26px drop (the shell offsets `top` by `−26·(1−reveal)`), so the
  card *falls into place* rather than fading on. Birth at 1.3s is **0.5s after
  the ring started at 0.8s** — cause (the call) visibly precedes effect (the
  card), both inside the one ring window.

> *"Why birth the card 0.5s into the ring instead of at the same instant?"* So
> the eye reads an order: the chip rings, *then* the card appears *because* of
> it. Simultaneous would read as a coincidence; 0.5s apart reads as causation.
> But it can't be much more than 0.5s either, or the two stop feeling like one
> event. That 0.3–0.5s ring→birth offset is the same in scene 3 and in both
> calls here — a fixed grammar.

- **The body fills** — `body = cv(t, 1.5, 2.8)`, a 1.3-second ramp starting
  0.2s after the shell lands. The shell drops first (chrome), *then* the
  skeleton lines stagger in within it — the same "chrome first, content after"
  read the product's own cards have. (Inside `PageCard`, the title bar reveals
  over the body's first 15–40%, then the five lines stagger at 0.11 offsets —
  so the page draws top to bottom.)

> *"Why separate `body` from `reveal` — why not fill content as the card drops?"*
> Because a card that arrives fully populated reads as a static asset that
> faded in, not as a page being *captured*. Splitting the shell's arrival from
> the content's reveal gives you the product's "result is loading in" feel —
> the structure lands, then fills. It's the same reason scene 1 of the
> market-desk video brings table chrome in before row text.

- **The capture pulse** — `pulse`, green ring up **2.1→2.4s**, down **3.3→3.8s**.
  It brackets the moment the body finishes filling: as the page finishes
  drawing, a green ring flashes around the card and fades. Green is the
  product's "ok / done" color — this card is now a *captured, kept* result.

> *"Why green, and why a transient flash rather than a held state?"* Green is
> the product's done-signal (same family as the agent's green ok-ring). A flash,
> not a hold, because the capture is a *moment* — the instant the read
> completes — after which the card just rests as plain evidence. A permanently
> green card would read as "still doing something." The pulse says "captured!"
> once and lets the card go quiet.

Notice the choreography of the three transients: the ring is releasing
(2.8→3.2) at almost exactly the moment the capture pulse is firing (2.1→2.4 up,
3.3→3.8 down). The call ends as its receipt turns green — ring and pulse
overlap-decay, so "the call finished" and "the evidence is kept" land as one
smooth handoff rather than two separate blinks.

### Call 3 — the move repeats, ~1.6× tempo

```ts
ring2 = Math.min(cv(t, 4.0, 4.25), cv(t, 5.5, 5.85, 1, 0));
card3 = {
  reveal: popIn(frame, fps, 4.3, 0.6),
  body:   cv(t, 4.45, 5.4),
  pulse:  Math.min(cv(t, 4.9, 5.2), cv(t, 6.1, 6.6, 1, 0)),
};
```

Same four parts, every window compressed:

| | Call 2 | Call 3 | change |
|---|---|---|---|
| ring up | 0.8→1.1 (0.3s) | 4.0→4.25 (0.25s) | faster |
| ring total | ~2.4s | ~1.85s | shorter |
| card popIn dur | 0.7s | 0.6s | snappier |
| body ramp | 1.5→2.8 (1.3s) | 4.45→5.4 (0.95s) | ~1.4× faster |
| ring→birth offset | 0.5s | 0.3s | tighter |

The ring→birth offset stays in the 0.3–0.5s grammar; everything else tightens.
The result reads, with no word on screen, as **"routine now."** The first read
was deliberate and a little slow — you're learning the move. The second is
brisk — the agent has done this; it's fluent.

> *"Where does the ~1.6× come from — is it derived?"* It's chosen, not derived,
> but chosen against a feel: too close to call-2's tempo and the repeat reads as
> identical (no momentum); too fast and the second card births before the eye
> has finished reading the first capture. ~1.4–1.6× is the band where the
> repeat is visibly quicker yet still legible as the same gesture. The
> principle is the transferable part: **repetition reads as fluency, and a
> measured acceleration on the repeat reads as momentum.** (Scene 5's three
> plan-captures use the same trick with shrinking gaps.)

> *"Why two reads and not three or four?"* Two is the minimum that makes a
> pattern — one is an instance, two is a rhythm. The script's run economy is
> deliberate: Exa finds (1 call), Firecrawl reads (2 calls — *just enough* to
> establish "per source"), Browser Use acts (1 call). Four cards, four calls,
> no decorative slots. A third Firecrawl read would be padding; it would teach
> nothing the second didn't.

### The hold — ~6.6s to the cut

After card 3's pulse falls out (by 6.6s), nothing moves. The live ring burns,
three cards sit in the rail, ~2.4s of stillness to the boundary.

> *"Isn't that dead air?"* No — the hold carries an *unresolved* state: the live
> ring is still on, which means the run isn't done. A still frame that holds
> tension (the agent is mid-flight, more is coming) is not dead; it's a held
> breath. It's also what lets the scene stretch to fit narration — a scene that
> ends on a settled, animation-free state can be extended to any VO length
> without freezing a motion halfway. (In the shipped cut, VO stretches this
> scene's tail to ~13.6s total.)

## How to think about the whole scene

Walk the decisions and each one answers a question:

1. *What's the move?* A tool call → show it on two surfaces (chip ring +
   card birth), in sync, cause-before-effect.
2. *Which tool, and why twice?* Firecrawl reads pages → the agent reads two
   sources, so the chip rings twice (`Math.max` of two windows on one chip).
3. *How do I show "the same move, now routine"?* Repeat it ~1.6× faster →
   acceleration reads as fluency, no caption needed.
4. *What's in the captured cards?* The *shape* of a page, never its words →
   seeded skeleton lines (no real artifact, stay honest).
5. *How do I keep the run feeling continuous?* Carry the live ring flat-on and
   re-declare card 1 at rest → the rail grows, nothing else changes.
6. *Where does the scene rest?* On a held, unresolved state (ring still on) →
   stretchable for VO, tension preserved into scene 5.

There's no single clever move — the quality is the same gesture rendered twice
with the right tempo lift, on a world that's carried in whole. Restraint, plus
one rhythm done well.

## Exit state (what scene 5 inherits)

`chain present · Research LIVE ring held (carried from scene 3, still on) ·
cards 1–3 at rest in slots 0–2 (search + two page reads, all `reveal: 1`,
pixel-static) · slot 4 empty · all transients (both chip rings, both capture
pulses) released by ~6.6s`. Scene 5 opens on exactly this frame: the Browser
Use chip rings and *holds*, the world dims to 0.35 (except the live Research
ring), and the live-session viewport rises center-frame — to eventually fold
into that empty slot 4 as card 4. Because both scenes render the same `<Rig/>`
with the live ring and cards 1–3 carried, the boundary is identical by
construction.
