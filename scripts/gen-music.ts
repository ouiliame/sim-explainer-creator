// Background-music bed generator (ElevenLabs music API).
//
// The bed under every video is public/music/soft-explainer-loop.mp3,
// looped by <MusicBed/> at low volume. To replace it, generate candidates
// and audition:
//
//   bun scripts/gen-music.ts --out public/music/soft-explainer-loop.mp3
//   bun scripts/gen-music.ts --prompt "..." --ms 90000 --out /tmp/candidate.mp3
//
// Requires ELEVENLABS_API_KEY in .env. NOTE: generation is not
// deterministic — the committed mp3 IS the approved take; regenerate only
// to replace it on purpose.

import {mkdirSync, writeFileSync} from "node:fs";
import {dirname} from "node:path";

const arg = (name: string, fallback?: string) => {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 ? process.argv[i + 1] : fallback;
};

const DEFAULT_PROMPT =
	"Minimal ambient electronic background bed for a software product " +
	"explainer video. Warm analog synth pads, soft pulsing eighth-note " +
	"arpeggio, gentle tape warmth, no drums until a subtle muted kick " +
	"enters halfway, no melody hooks, no vocals. Calm, focused, modern, " +
	"understated. Must loop seamlessly.";

const prompt = arg("prompt", DEFAULT_PROMPT)!;
const ms = parseInt(arg("ms", "90000")!, 10);
const out = arg("out");
const key = process.env.ELEVENLABS_API_KEY;

if (!out) {
	console.error("usage: bun scripts/gen-music.ts --out <file.mp3> [--prompt <text>] [--ms <length>]");
	process.exit(1);
}
if (!key) {
	console.error("ELEVENLABS_API_KEY is not set (put it in .env at the repo root).");
	process.exit(1);
}

const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {
	method: "POST",
	headers: {"xi-api-key": key, "Content-Type": "application/json"},
	body: JSON.stringify({prompt, music_length_ms: ms}),
});
if (!res.ok) {
	console.error(`ElevenLabs ${res.status}: ${await res.text()}`);
	process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());
mkdirSync(dirname(out), {recursive: true});
writeFileSync(out, buf);
console.log(`Wrote ${out} (${(buf.byteLength / 1024 / 1024).toFixed(1)} MB, ${ms / 1000}s).`);
