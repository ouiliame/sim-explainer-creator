# Scene 2 — `deploy-as-a-tool`  ·  archetype: **morph-swap**

Source: `../source/scenes/DeployAsAToolScene.tsx`, `../source/scenes/_rig.tsx`,
`../source/layout.ts`, `../source/demo-corpus/grounding-v1.md`.

This is the hinge of the whole video. Scene 1 showed you a working chain that
runs when *you* run it; every scene after this one is a *caller* arriving. This
scene is the single change that makes that possible — the one move that turns
"an agent you built" into "a tool other agents can call." Read it as the worked
example of a **morph-swap**: a scene that changes the *identity* of an element
already on screen, without moving, rebuilding, or relayout-ing anything.

---

## What this scene is for

The video's spine is "deploy a workflow as an MCP tool and it becomes
infrastructure others call." Scene 1 built the chain. This scene performs the
deploy — and it has to do it as a *transformation of the thing already there*,
not as a new thing arriving. The chain you watched run is the chain that gets
deployed; the viewer must feel that continuity in their gut, because the entire
thesis ("the same agent, now callable") collapses if the deployed thing looks
like a different object.

So the rule the scene follows is *one idea per scene*: this scene is "the chain
acquires a tool identity." Full stop. No call comes in — the first stranger
doesn't arrive until scene 3. No badges, no spokes, no partner server. This
scene only changes what the chain *is*; who calls it is a different idea and
gets its own scene. Resist the urge to also show the first caller here — that's
the most natural place to over-reach, and it would blur the one change this
scene exists to make legible.

## What it looks like

The whole Scout chain is on screen at home framing, exactly as scene 1 left it.
The Agent and Response blocks **dim** to the background; the entry block becomes
the only lit thing. A blue editing ring lands on the entry. As it sits there,
the entry's **header morphs** — the cyan `Start` chip crossfades into the deeper
blue `API` chip, name and glyph and color all swapping together, while the
`Input` row underneath stays *pixel-identical*. A beat after the morph settles,
the **MCP tool pill** fades and rises into place above the entry: a green live
dot, then `research_competitor` on `sim.ai/api/mcp/serve/…` in mono. Then the
world un-dims and the deployed chain rests. The pill stays for the rest of the
video.

## The one real decision: this is a morph, not a build

Look at how little the scene component contains:

```tsx
const dimAmt = dimIn * dimOut;
const ringOn = t >= 1.2 && t < 2.8;
const morph  = interpolate(t, [1.5, 2.3], [0, 1], {..., easing: EASING.inOut});
const pillReveal = interpolate(t, [3.1, 3.7], [0, 1], {..., easing: EASING.out});

return (
  <EconomyRig
    entryMix={morph}
    entry={{highlighted: ringOn}}
    agent={{dim: dimAmt}}
    response={{dim: dimAmt}}
    edge1={{opacity: 1 - 0.45 * dimAmt}}
    edge2={{opacity: 1 - 0.45 * dimAmt}}
    pill={{reveal: pillReveal}}
  />
);
```

Six props, and not one of them mounts a new structural element. The camera is
implicit (the rig sits at home framing — there's no `cam` prop because this
video frames statically and never moves until scene 6). The Agent and Response
get a `dim`. The two edges get an opacity. The entry gets a highlight boolean
and a `morph` value. The pill gets a reveal. Everything else — the chain's
geometry, the entry's `Input` row, the block positions — is rendered by
`EconomyRig` at its default state, *exactly* as scene 1 left it. The scene
authors only the delta.

This is the **morph-swap** archetype, and it's worth being precise about how it
differs from scene 4's *morph-at-state-level* (the armed scene in the
market-desk video). There, a block's *state* flipped (idle → deployed) but the
block stayed the same block. Here the entry block changes *what kind of block it
is*: a `Start` trigger becomes an `API` trigger. The identity itself swaps. The
machinery for that swap lives entirely in the rig — the scene just drives one
`morph` value from 0 to 1 and the rig crossfades two full block variants behind
it.

> *"Why drive the swap with a single `morph` scalar instead of mounting the API
> block and unmounting the Start block?"* Because a mount/unmount is a cut, and
> a cut can't be a *transformation*. The rig renders **both** variants every
> frame and crossfades their opacities against the one scalar:
>
> ```ts
> const fromOp = interpolate(entryMix, [0.3, 0.7], [1, 0], {clamp});
> const toOp   = interpolate(entryMix, [0.3, 0.7], [0, 1], {clamp});
> ...
> {entryBlock("start", fromOp)}
> {entryBlock("api", toOp)}
> ```
>
> Both blocks occupy the *same* `left: blockX(0), top: CHAIN_Y` — they're
> stacked, identical in geometry, differing only in header. As `morph` crosses
> 0.3→0.7 the Start opacity falls 1→0 while the API opacity rises 0→1. The
> viewer sees one header dissolve into another *in place*. That's the whole
> point of a morph: the chain never blinks, never reflows, never loses its
> identity for a frame — it *becomes* something while you watch.

## What stays pixel-identical — and why that's the load-bearing constraint

The entry block has exactly one row, `{title: "Input", value: "Company name"}`,
and both the `start` and `api` variant render that *same row* from the *same*
`inputValue`:

```ts
const entryBlock = (variant, op) => (
  <SimBlock
    name={ENTRY_VARIANTS[variant].name}
    color={ENTRY_VARIANTS[variant].color}
    glyph={ENTRY_VARIANTS[variant].glyph}
    rows={[{title: "Input", value: inputValue}]}   // identical in both
    ...
  />
);
```

Only the `name`, `color`, and `glyph` differ between variants. The row is
shared. This is not incidental — it's the discipline that makes the morph
*read* as a morph rather than a glitch.

> *"Why does the Input row have to be pixel-identical across the swap?"* Because
> the block's **height** is a function of its rows, and if the height changed
> mid-morph the block would grow or shrink — and a block that resizes during a
> crossfade looks broken, not transformed. The morph's entire credibility rests
> on the body staying frozen while only the header dissolves. The choreography
> notes call this out explicitly: "the Input row is pixel-identical throughout —
> height constant, zero relayout." If you ever morph a block and the body
> twitches, you've lost the illusion. The fix is never to animate the height
> back into place; it's to *make the morphed variants share the body* so there's
> nothing to relayout in the first place. Continuity here is a property of the
> data, not of the animation.
>
> *"Why is the crossfade window `0.3–0.7` rather than the full `0–1`?"* So there
> is never a frame where *both* headers are fully opaque (a double-exposed,
> two-named block) or *both* are gone (a headerless block). By the time the old
> header has faded to nothing (`morph = 0.7`) the new one is fully up, and
> neither is visible at partial strength outside that band. The `EASING.inOut`
> on the `morph` scalar means the crossfade accelerates into and decelerates out
> of that middle band — a transform curve, because this *is* a transform, not an
> entrance. (Contrast the pill below, which uses `EASING.out`, the
> arrive-and-settle curve for a new object.)

## The two block identities, and where their values come from

Both variants come from a single `ENTRY_VARIANTS` table in the rig, and every
field of it is grounded — nothing is free-typed.

```ts
const ENTRY_VARIANTS = {
  start: {name: "Start", color: BLOCK_COLORS.start, glyph: <StartGlyphW/>},  // #2FB3FF
  api:   {name: "API",   color: BLOCK_COLORS.api,   glyph: <ApiGlyphW/>},    // #2F55FF
};
```

| field | `start` | `api` | source |
|---|---|---|---|
| name | `Start` | `API` | the two trigger blocks' registry names |
| color | `#2FB3FF` | `#2F55FF` | `BLOCK_COLORS.start` / `.api` (SimBlock, re-checked vs registry) |
| glyph | `StartGlyphW` | `ApiGlyphW` | the ported product block glyphs |

> *"Why does the chain swap its trigger from `Start` to `API` when you deploy as
> MCP — and why is *that* the visual of 'deployed'?"* Because in the product, a
> deployed workflow is reached over an endpoint, not by clicking Run in the
> editor. The `Start` trigger is the *editor* entry — "this is where a manual
> run begins." The `API` trigger is the *deployed* entry — "this chain is now
> reachable by a request from outside." Swapping the header from cyan `Start` to
> deep-blue `API` is the product-true picture of "this stopped being a thing you
> run and became a thing that gets *called*." The grounding traces this exact
> morph to the module-6 deployment build (`Entry morph Start #2FB3FF → API
> #2F55FF` — "the same morph the accepted module-6 v2 ships"). This scene
> *reprises* that morph fast rather than re-teaching it: the audience either has
> module 6 or doesn't need it, and the new information is carried by the pill,
> not the header swap.
>
> *"Why these two blues specifically — won't `#2FB3FF` and `#2F55FF` read as the
> same color mid-crossfade?"* They're close on purpose — both are in the
> trigger-blue family, so the swap reads as "the same *kind* of thing changed
> register," not "a green block became a red block." The deeper, more saturated
> `#2F55FF` of `API` reads as the *committed*, deployed version of the lighter
> editor `Start`. The colors come straight from the block registry
> (`starter.ts`, `api_trigger.ts`); they are not tuned for the animation. If
> they were further apart the morph would read as a *replacement*; being a
> family apart, it reads as a *promotion*.

## The editing ring — and why it fires *before* the morph

```ts
const ringOn = t >= 1.2 && t < 2.8;   // entry={{highlighted: ringOn}}
```

The entry block carries `highlighted: true` for the window **1.2s → 2.8s**, then
drops to `false`. In `SimBlock`, `highlighted` draws the product's blue
selection ring — an inset box-shadow in `COLORS.secondary` (`#33b4ff`), the same
ring the market-desk video uses to mean "you are acting on this block."

> *"Why a plain boolean window instead of a fade?"* The ring is a *selection
> state*. In the product it snaps on when you click a block and snaps off when
> you don't — it doesn't ease in. Modeling it as a boolean (on at 1.2, off at
> 2.8) matches that hard-edged product behavior. The morph and the pill, which
> are *changes happening to* the block, get soft interpolated treatments; the
> ring, which is *you selecting* the block, snaps. Same grammar as every other
> scene in this series and the market-desk one: ease what transforms or arrives,
> snap what is a selection.
>
> *"Why does the ring come on at 1.2 but the morph not start until 1.5 — why the
> 0.3s lead?"* Sequence is meaning. The ring is the *act* ("someone selected
> this block to deploy it"); the morph is the *consequence* ("and now it
> changed"). Firing the ring 0.3s before the morph encodes cause and effect: you
> selected it, *then* it changed. If they started together the viewer couldn't
> tell which drove which — it'd read as two simultaneous decorations. The
> choreography notes name this exact beat: "the product's 'selected' language
> fires BEFORE the morph (0.3s lead): someone selected it, then it changed."
>
> *"Why does the ring release at 2.8, after the morph finishes at 2.3?"* So you
> see the *deployed* (API) header *while the block is still selected* — the act
> and its result briefly coexist (2.3→2.8) before the selection lets go. That
> overlap seals the causal read: the thing you selected is the thing that
> changed. The ring is **transient** (it's the act, and acts are momentary) — it
> releases. The morph and pill are **carried** (they're the new standing facts) —
> they stay. That asymmetry is the same one the market-desk armed scene draws
> between its ring and its pill.

## The MCP pill — the new identity, surfacing

```ts
const pillReveal = interpolate(t, [3.1, 3.7], [0, 1], {clamp, easing: EASING.out});
```

The pill's reveal ramps 0→1 over **3.1s → 3.7s**, eased with `EASING.out`. That
single value drives two things at once in the `ToolPill` component, exactly the
two-in-one the market-desk schedule pill uses:

```tsx
top: PILL.y + (1 - reveal) * 14,
opacity: reveal * (1 - 0.65 * dimmed),
```

So at `reveal = 0` the pill is 14px **below** its resting spot and transparent;
as `reveal` climbs to 1 it slides up those 14px and fades in together. It
**rises into place** rather than simply appearing.

> *"Why make it rise 14px instead of just fading in?"* A pure opacity fade reads
> as "this label was always here, you just couldn't see it." A rise reads as
> "this came into being just now, *because* of what you just did." The 14px lift
> ties the pill's arrival causally to the deploy — it's the *result* of the
> morph, surfacing above the block that just changed. It's a small distance on
> purpose: enough to register as a deliberate entrance, not so much it looks like
> it flew in from off-screen. (The exact same 14px and the same
> `top + (1-reveal)*14` formula as the market-desk armed pill — this is a shared
> idiom across the videos, not a re-invention.)
>
> *"Why `EASING.out` here but `EASING.inOut` on the morph?"* Because the pill
> *travels* — it moves 14px through space — and `EASING.out` (decelerate-to-rest)
> makes it arrive and settle, like it's landing into its slot. The morph isn't a
> spatial entrance; it's a crossfade-in-place, a transform, so it takes the
> transform curve `EASING.inOut`. Ease-to-rest for things that arrive, the
> symmetric transform curve for things that change in place. The rule holds
> across the whole project.
>
> *"Why 3.1 — a beat after the morph settles at 2.3, and after the ring releases
> at 2.8?"* Staggering again. The chain identity changes *first* (morph 1.5→2.3),
> the selection lets go (ring off 2.8), and only *then* does the new public
> identity surface (pill 3.1→3.7). Reading top to bottom in time: deploy →
> selection releases → the tool's name and address appear. Each beat waits for
> the last. The choreography calls the pill "0.8s AFTER the morph settles, its
> own beat" — it gets its own air rather than stacking on the morph, which would
> blur both into one busy moment.

### Where the pill's words come from

Not one character of the pill is free-typed. From the rig:

```ts
export const TOOL_NAME  = "research_competitor";
export const SERVER_URL = "sim.ai/api/mcp/serve/…";   // UUID ⟨pending⟩
```

> *"Where does `research_competitor` come from — why lowercase with an
> underscore?"* It's the MCP tool name for the deployed Scout workflow, and the
> shape follows the product's own naming rule. The grounding cites
> `workflows/deployment/mcp.mdx`: "Use lowercase letters, numbers, and
> underscores" (the doc's own example is `search_documents`). So
> `research_competitor` isn't a label chosen to look techy — it's what a Sim MCP
> tool name *must* look like. Typing `Research Competitor` or `researchTool`
> would be a small lie about how the product names tools. It's rendered in mono
> because it's an identifier, not prose.
>
> *"And `sim.ai/api/mcp/serve/…` — what's the `…`?"* That's the product's MCP
> server URL shape, traced to `workflow-mcp-servers.tsx:131`
> (`${getBaseUrl()}/api/mcp/serve/${serverId}`) and confirmed by the docs
> screenshot. The trailing `…` elides the real server UUID, which is
> ⟨pending⟩ — there's no live workspace in this batch build, and the batch rule
> forbids inventing a fake UUID. So rather than fabricate one, the pill shows the
> *true* path prefix and honestly elides the part it doesn't have. (Module 6 set
> this precedent — elide the UUID as `…` rather than invent it.) The smaller,
> grey mono line is the product's address caption; the larger line is the tool
> name. Two lines, one identity: *what* the tool is called and *where* it lives.
>
> *"Why the green dot?"* It's the deploy modal's *live-version* marker —
> `#22c55e`, the same green that means "deployed and listening" in module 6 and
> in the market-desk armed pill. It's the visual half of "this is now a live
> tool": the dot says *live*, the text says *what it's called and where*. No word
> like `DEPLOYED` or `LIVE` appears, because the green dot already says it (style
> lesson 2: indicate state with visuals, not words).

## The dim — refocusing by subtraction, not by camera

This video never moves its camera until the final scene, so the only way to
direct the eye to the entry is to **dim everything else**. The scene does that
with a windowed product of two ramps:

```ts
const dimIn  = interpolate(t, [0.5, 1.1], [0, 1], {clamp});   // dim comes on
const dimOut = interpolate(t, [4.6, 5.3], [1, 0], {clamp});   // dim lifts
const dimAmt = dimIn * dimOut;
```

`dimAmt` rises 0→1 over 0.5→1.1s, holds at 1, then falls 1→0 over 4.6→5.3s. It's
applied to the Agent and Response blocks (`dim: dimAmt`) and, more gently, to
the two edges (`opacity: 1 - 0.45 * dimAmt`). In the rig's `visOpacity`, a block
at `dim = 1` renders at `1 - 0.65 * 1 = 0.35` opacity — the series' standard
"dimmed but still present" level.

> *"Why dim to 0.35 and not all the way to 0, or hide them?"* Because the Agent
> and Response are still *part of the chain being deployed* — they don't go away,
> they recede. 0.35 keeps them legible as context (you can still see it's a
> three-block chain) while making the entry unambiguously focal. Hiding them
> would say "they left"; dimming them says "look here for a moment." This is the
> series' **dim-flip refocus** move — focus moves by dimming the non-focal
> actors, never by moving the camera. The market-desk video moves its camera to
> refocus; this one can't (static until scene 6), so it subtracts light instead.
> Same goal, different lever.
>
> *"Why only `0.45 * dimAmt` on the edges — why dim them less than the blocks?"*
> The wires are thin; dim them as hard as the blocks (to 0.35) and they nearly
> vanish, which would read as the chain *disconnecting* during the deploy. At
> `1 - 0.45 = 0.55` they stay visibly present — the chain is still wired
> together, just quieted. The blocks carry the dim; the wires only soften.
>
> *"Why does the dim come on at 0.5 but the ring not land until 1.2?"* The dim is
> the *setup* for the focal move — it darkens the stage *before* the action
> begins, so when the ring lands the entry is already the only lit thing and the
> gesture reads instantly. If the ring landed into a fully-lit frame and the dim
> came after, the eye would have to re-find the entry. Dim first, then act.
>
> *"And why does the dim lift (4.6→5.3) only *after* the pill is fully up
> (3.7)?"* Because the world should return only once the new identity *exists*.
> The sequence is: dim the stage → deploy (ring + morph) → surface the identity
> (pill) → *now* bring the world back, with the chain transformed and named.
> Un-dimming earlier would pull focus off the entry before the pill had
> registered. The choreography: "Un-dim `[4.6, 5.3]`: the world returns only
> after the new identity exists."

## The animation, beat by beat

A strict serial cause-chain, each event waiting for the last — this is the
scene's whole craft. Read it as one sentence in time:

1. **0.5→1.1s** — the stage dims. Agent + Response to 0.35, edges to 0.55. The
   entry becomes focal by subtraction.
2. **1.2s** — the blue editing ring lands on the entry. *Someone selected this
   block.* (0.3s lead before the morph.)
3. **1.5→2.3s** — the header morphs `Start` → `API`, crossfading through the
   0.3–0.7 band, `EASING.inOut`. The Input row never moves. *The chain became a
   deployed endpoint.*
4. **2.8s** — the ring releases. The act is done; the API header it left behind
   stays.
5. **3.1→3.7s** — the MCP pill rises 14px and fades in, `EASING.out`. *The tool
   now has a name and an address.*
6. **4.6→5.3s** — the world un-dims. The transformed, named chain returns to
   full presence.
7. **5.3s → end (~7s of hold)** — nothing moves. The deployed state rests.

Every gap between those beats is deliberate, and none of them overlap by
accident. The 0.3s ring-before-morph lead, the 0.5s gap from morph-settle (2.3)
to pill-start (3.1), the wait for the pill before un-dimming — each is a cause
preceding its effect, so the viewer reads a *process*, not a pile of
simultaneous animations. Stacking these would be the fastest way to make the
scene feel busy; spacing them is what makes it read as a clean sequence of
deliberate steps.

### The hold — 5.3s to the end (~7s)

After the world un-dims, nothing moves for roughly seven seconds. The deployed
chain just sits, pill lit.

> *"Seven seconds of stillness is a lot — isn't that dead air?"* It's the
> VO-stretch hold: this scene is stretched to fit its narration line, and the
> narration *reads the pill* while it sits — naming the tool, the address, the
> idea that the chain is now callable. A scene that ends on a settled, latched
> state can be stretched to any length safely, because there's no animation
> mid-flight to interrupt (the same boundary-safety property as the market-desk
> holds). That said — the choreography is honest that this is **the weakest hold
> in the video**: by the ambient-motion test it's a *dead* hold (only
> `CanvasDots` texture moves), survivable *only* because the narration is
> actively naming what's on screen. The note flags the fix: "a live-dot shimmer
> on the pill would have earned it." Take the lesson: a long hold needs either
> active narration over it or a small ambient life on the focal object; this one
> leans entirely on the former, and it's the one hold in the video that's right
> at the edge of working.

## How to think about the whole scene

Walk the decisions in order and there's a question driving each one — and every
answer is "change the *identity*, move *nothing*":

1. *What's the change?* The chain's trigger goes from editor (`Start`) to
   deployed (`API`) → a **morph**, not a build. Render both variants, crossfade
   one scalar.
2. *How do I keep it the same chain?* Share the `Input` row across both variants
   so the body is pixel-identical → the height never moves, so the morph reads
   as a transform, not a glitch.
3. *How do I show "someone deployed this"?* The product's blue editing ring lands
   on the entry, 0.3s before the morph → an act performed *on* the block, cause
   before effect.
4. *How do I show "now it's a tool"?* An MCP pill rises above the entry: green
   live dot + product-shaped tool name + product-true server URL → a new standing
   identity, every character grounded, the UUID honestly elided.
5. *How do I focus the eye with no camera?* Dim everything but the entry to 0.35
   (edges only to 0.55) → refocus by subtraction; un-dim only after the new
   identity exists.
6. *What stays, what goes?* The ring (the act) releases; the API header and the
   pill (the consequences) persist to the final frame → the asymmetry *is* the
   meaning.

There's no clever move here — the quality of the scene is in what it *refuses* to
do. It changes exactly one thing about one block and lets the rest of the frame
hold. A morph-swap that also rebuilt the chain, or moved the camera, or brought
in a caller, would have buried its one idea. Restraint applied six times.

## Exit state (what scene 3 inherits)

`Scout chain at home framing · entry = **API** (morph at 1, latched) · MCP pill
present and latched, reading green-dot · `research_competitor` ·
`sim.ai/api/mcp/serve/…` (mono) · Agent + Response + edges un-dimmed (back to
full by 5.3s) · no badges, no spokes, no partner · rows at template`. This is
the continuity contract's "deployed state A." Scene 3 opens on exactly this
frame and pops in the first client badge (Claude Desktop) at the left edge,
draws its spoke into the entry's now-`API` handle, and runs the chain as a
*caller's* call. Because both scenes render the same `EconomyRig` set piece at
the same static framing, that boundary is identical down to the pixel — and the
deployed identity this scene created is the thing every later scene calls.
