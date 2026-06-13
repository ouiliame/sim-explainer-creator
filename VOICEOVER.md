# Voiceover — how narration sync works (and how to fix a line)

The VO system's contract: **narration text is the source of truth; audio
and scene timing follow it automatically.** You never hand-time anything.
Edit prose → run one command → the audio regenerates and the scenes
re-pace themselves.

## The 60-second version (fixing a narration line)

1. Open the video's narration file: `src/videos/<slug>/narration-v1.md`
   (or `-v2.md` — the suffix matches the take it narrates).
2. Edit the prose under any `## N. <scene-name>` header. Don't touch the
   header itself.
3. Re-sync:

   ```bash
   bun scripts/vo-sync.ts --comp <comp-id> \
     --narration src/videos/<slug>/narration-v1.md \
     --voice M5lSFiV8wa1aYNbadPOy
   ```

4. Re-render: `bunx remotionb render <comp-id> out/mp4/<comp-id>.mp4 --crf=18 --codec=h264`

That's it. Only the scenes whose text changed re-synthesize (per-scene
hash cache keyed on voice+model+settings+text) — untouched scenes keep
their exact existing audio takes.

## The narration file format

```markdown
## 1. a-block-that-holds-blocks — min 9s

Some jobs are a list — same steps, every item. The Loop is a block that
holds blocks: the inside runs once per item.

## 2. what-the-loop-knows — min 8s
…
```

- **Scene names must match the video's `SCENES` array exactly** (see the
  video's `Video*.tsx`). A typo'd name silently gets no audio.
- **`min Ns` is the scene's authored visual minimum** — the duration the
  animation was designed for. It comes from the SCENES array; only change
  it if the visuals change.
- One paragraph per scene, plain prose, spoken style.

### The narration style spec (director, 2026-06-11)

Gold exemplar: `examples/vo/_gold/knowledge-base-og-narration.md` — read
it before writing a line. The register is **clean condensed prose that
explains what the viewer is seeing.** Concretely:

- **Complete sentences with connective tissue** — condensed means zero
  fluff, NOT fragments. "Every time you add a new document, Sim keeps it
  in sync by re-indexing the chunks" — not "Documents in. Chunks synced."
- **The viewer is the subject where possible** ("You probably already
  have…", "your documents", "let's look inside").
- **Name the concepts deliberately** — definition cadence: term → role →
  derived term ("the key unit is the document; a document gets processed
  into smaller pieces called chunks").
- **The why may precede the what** — walking the naive path first ("the
  naïve solution is… but you'd max out context") is encouraged; the
  narration can carry the problem framing the capability-first visuals
  deliberately omit.
- **Calibrated claims** — no comparatives you can't support.
- **No contrastive reversals** ("isn't X — it's Y", "by A, not B") —
  "that's very AI." State the positive fact.
- **NEVER fiction / elliptic / dramatic.** No personification ("the run
  wrote itself down"), no suspense beats ("from out here, it's already
  over"), no aphorisms ("nothing about a run is a mystery"). This is an
  EXPLAINER, not marketing.

Pacing: the voice reads ~1.9 words/sec; a scene stretches if its audio
outruns the visual minimum. Prefer trimming fluff over amputating
sentences — extension is allowed, fragments are not.

## What vo-sync actually does

```
narration-v1.md ──parse──▶ per-scene text
        │ (hash-cached)
        ▼
ElevenLabs TTS ──▶ public/vo/<comp-id>/NN.mp3   (one clip per scene)
        │
        ▼ measure each mp3
scene duration = max(min visual, audio + 0.7s pad)   ← EXTEND-ONLY
        │
        ├──▶ public/vo/<comp-id>/manifest.json   (clip start times — played
        │                                          by <ScratchVO/>, mounted
        │                                          on every master comp)
        └──▶ src/videos/<slug>/vo-timing.ts      (generated durations — the
                                                   Video file's SCENES map
                                                   reads them)
```

**Extend-only is the safety property:** narration can lengthen a scene
(the extra time becomes end-hold, where the boundary state is already
held), but never shrink it below the visual minimum. So re-timing cannot
break boundary continuity — `verify-boundaries` stays green by
construction. If narration consistently runs much shorter than visuals,
that's a per-scene minimum worth revisiting, not a knob.

## Canonical settings (director-approved 2026-06-11)

| Setting | Value | Why |
| --- | --- | --- |
| Voice | `M5lSFiV8wa1aYNbadPOy` | A/B'd against QRG + Rachel |
| Model | `eleven_multilingual_v2` | A/B'd against eleven_v3 — v2's read preferred |
| Output | 192kbps mp3 | highest the API offers |
| stability / style / similarity / speed | 0.4 / 0.7 / 0.9 / 1.07 | expressive but on-pace |
| pad | 0.7s | breath after each scene's line |

All overridable per run (`--voice --model --stability --style
--similarity --speed --pad`); every one participates in the cache hash, so
changing a setting re-synthesizes affected scenes.

**TTS is not deterministic.** Re-synthesizing the same text produces a
*different take*. The cache protects approved takes — but that means:
don't casually change settings on a video whose reads you already like,
and the committed mp3s on the VO branch ARE the approved takes (they
don't regenerate identically from the text).

## Music bed

The track is ALWAYS specified explicitly: the `MUSIC` constant at the top
of `src/Root.tsx` names a file under `public/` (currently
`music/soft-explainer-loop.mp3`), mounted via `<BackgroundMusic src=…/>`
at volume 0.09 under every master comp. To change the music: drop any
mp3 in `public/` and point `MUSIC` at it. (`scripts/gen-music.ts` can
generate candidate tracks via ElevenLabs, but any mp3 works.)

## Wiring a NEW video for VO

1. In its `Video*.tsx`, rename the `SCENES` literal to `BASE_SCENES` and
   derive (the loops pattern):

   ```tsx
   import {VO_TIMING} from "./vo-timing";
   export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
     ...s,
     durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
   }));
   ```

2. Check in a default `vo-timing.ts` (`export const VO_TIMING: Record<string, number> = {};`).
3. Write the narration file (headers from the SCENES array).
4. Run vo-sync. Done — `<ScratchVO/>` and the music bed are already
   mounted on every master comp by `src/Root.tsx`.

Conventions: narration file suffix matches the take (`narration-v2.md`
narrates the v2 take); superseded takes don't get narration; the
ELEVENLABS_API_KEY lives in `.env` (gitignored, never committed).

## Living motion vs freeze-cuts (patterns from the hype3 builds)

Extend-only re-timing changes scene lengths in 0.1s steps, which breaks
any boundary that depends on a periodic animation's phase. Three proven
solutions, in order of preference:

1. **Phase-glide** (zero-to-agent): in the scene's final second, glide the
   oscillator's phase to the next integer so the boundary frame is fixed
   at ANY narrated duration.
2. **Global clock + quiet gate** (voice-agent): drive ambient motion
   (waveforms, live dots) from a video-global clock shared via a
   `timing.ts`, and gate it to settle to exact fixed values on boundary
   frames — continuous shimmer across cuts, pixel-identical boundaries.
3. **End-anchored holds** (testing-debugging): key glow-reverts/settles to
   `durationInFrames` so held states stay lit through narration overrun
   instead of finishing early and sitting dead.

## Gotchas

- Audio starts exactly at each scene cut. No J/L-cuts yet (narration
  leading/trailing picture) — that's a per-scene `offset` field away if
  wanted.
- `vo-timing.ts` is GENERATED — never hand-edit; delete its entries to
  revert a video to authored timing.
- A scene with no narration paragraph simply gets no audio and keeps its
  authored duration — fine for silent beats.
- Per-scene comps (`<id>--NN-<scene>`) render without audio (the VO layer
  mounts on masters only); boundary verification is unaffected.
