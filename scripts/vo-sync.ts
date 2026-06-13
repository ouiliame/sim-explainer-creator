// VO sync: real narration → per-scene ElevenLabs TTS → re-timed scenes.
//
// The contract that makes narration massage-able: edit the narration file,
// re-run this script, and BOTH the audio and the scene timing update to
// match. Scenes only ever EXTEND (their end-holds grow) — never shrink
// below the authored visual minimum — so boundary states stay identical
// and re-timing can't break continuity.
//
// Usage:
//   bun scripts/vo-sync.ts --comp loops-v1 \
//     --narration src/videos/loops/narration-v1.md [--voice <id>] [--pad 0.7]
//
// Narration file format (one section per scene, in scene order):
//   ## 1. a-block-that-holds-blocks — min 9s
//   <the narration paragraph for that scene — plain prose>
//
// "min 9s" is the scene's authored visual minimum (generated from SCENES;
// edit the prose, not the min). Scene duration = max(min, audio + pad).
//
// Outputs:
//   public/vo/<comp>/NN.mp3        per-scene audio (hash-cached: unchanged
//                                  text is not re-synthesized)
//   public/vo/<comp>/manifest.json [{at, file, ...}] for <ScratchVO/>
//   src/videos/<slug>/vo-timing.ts re-timed durations consumed by Video.tsx
//
// Requires ELEVENLABS_API_KEY (bun auto-loads .env at the repo root).

import {createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {parseBuffer} from "music-metadata";

const arg = (name: string, fallback?: string) => {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 ? process.argv[i + 1] : fallback;
};

const comp = arg("comp");
const narrationPath = arg("narration");
const voice = arg("voice", "21m00Tcm4TlvDq8ikWAM"); // ElevenLabs "Rachel"
const pad = parseFloat(arg("pad", "0.7")!);
// Quality + expressiveness (director, 2026-06-11): highest-bitrate mp3 the
// API offers, lower stability + style exaggeration for a livelier read.
const model = arg("model", "eleven_multilingual_v2")!; // director A/B'd v3 and prefers v2's read
const stability = parseFloat(arg("stability", "0.4")!);
const style = parseFloat(arg("style", "0.7")!);
const similarity = parseFloat(arg("similarity", "0.9")!);
const speed = parseFloat(arg("speed", "1.07")!);
const key = process.env.ELEVENLABS_API_KEY;

if (!comp || !narrationPath) {
	console.error("usage: bun scripts/vo-sync.ts --comp <id> --narration <file.md> [--voice <id>] [--pad <sec>]");
	process.exit(1);
}
if (!key) {
	console.error("ELEVENLABS_API_KEY is not set (put it in .env at the repo root).");
	process.exit(1);
}

// ── Parse the narration file ─────────────────────────────────────────────────
type Scene = {idx: number; name: string; minSec: number; text: string};
const md = readFileSync(narrationPath, "utf8");
const scenes: Scene[] = [];
for (const section of md.split(/^## /m).slice(1)) {
	const lines = section.split("\n");
	const m = lines[0].match(/^(\d+)\.\s+(.+?)\s+—\s+min\s+([\d.]+)s/);
	if (!m) continue;
	const text = lines
		.slice(1)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
	if (!text) continue;
	scenes.push({idx: parseInt(m[1], 10), name: m[2].trim(), minSec: parseFloat(m[3]), text});
}
if (scenes.length === 0) {
	console.error(`No scenes parsed from ${narrationPath} — expected '## N. name — min Xs' headers followed by prose.`);
	process.exit(1);
}

const outDir = `public/vo/${comp}`;
mkdirSync(outDir, {recursive: true});

// Hash cache: skip synthesis when the text (and voice) hasn't changed.
type ManifestEntry = {
	at: number;
	file: string;
	name: string;
	audioSec: number;
	durationSec: number;
	hash: string;
};
const manifestPath = `${outDir}/manifest.json`;
const oldEntries: ManifestEntry[] = existsSync(manifestPath)
	? (JSON.parse(readFileSync(manifestPath, "utf8")).scenes ?? [])
	: [];
const oldByName = new Map(oldEntries.map((e) => [e.name, e]));

const tts = async (text: string): Promise<ArrayBuffer> => {
	const call = async (settings: Record<string, unknown>, modelId: string) =>
		fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_192`, {
			method: "POST",
			headers: {"xi-api-key": key, "Content-Type": "application/json"},
			body: JSON.stringify({text, model_id: modelId, voice_settings: settings}),
		});
	const full = {stability, similarity_boost: similarity, style, use_speaker_boost: true, speed};
	let res = await call(full, model);
	// v3 may reject some settings or the account may lack access — degrade
	// loudly rather than fail.
	if (!res.ok && model === "eleven_v3") {
		const err = await res.text();
		console.warn(`
  [eleven_v3 rejected: ${err.slice(0, 120)}] retrying basic settings…`);
		res = await call({stability, similarity_boost: similarity}, model);
		if (!res.ok) {
			console.warn("  [eleven_v3 unavailable] falling back to eleven_multilingual_v2");
			res = await call(full, "eleven_multilingual_v2");
		}
	}
	if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
	return res.arrayBuffer();
};

const audioDuration = async (buf: Buffer): Promise<number> => {
	const meta = await parseBuffer(buf, "audio/mpeg");
	if (!meta.format.duration) throw new Error("could not read mp3 duration");
	return meta.format.duration;
};

// ── Synthesize (or reuse) and time ───────────────────────────────────────────
const entries: ManifestEntry[] = [];
let cursor = 0;
for (const s of scenes) {
	const file = `${String(s.idx).padStart(2, "0")}.mp3`;
	const hash = createHash("sha256").update(`${voice}::${model}::${stability}::${style}::${similarity}::${speed}::${s.text}`).digest("hex").slice(0, 16);
	const cached = oldByName.get(s.name);
	let audioSec: number;
	if (cached && cached.hash === hash && existsSync(`${outDir}/${file}`)) {
		audioSec = cached.audioSec;
		console.log(`scene ${s.idx} (${s.name}): cached (${audioSec.toFixed(1)}s)`);
	} else {
		process.stdout.write(`scene ${s.idx} (${s.name}): synthesizing … `);
		const audio = Buffer.from(await tts(s.text));
		writeFileSync(`${outDir}/${file}`, audio);
		audioSec = await audioDuration(audio);
		console.log(`${(audio.byteLength / 1024).toFixed(0)}kB, ${audioSec.toFixed(1)}s`);
	}
	const durationSec = Math.max(s.minSec, Math.ceil((audioSec + pad) * 10) / 10);
	entries.push({at: cursor, file, name: s.name, audioSec, durationSec, hash});
	cursor += durationSec;
}

writeFileSync(manifestPath, JSON.stringify({scenes: entries}, null, 2));

// ── Re-timed durations for the Video module ─────────────────────────────────
// The slug is the video folder owning the narration file.
const slug = narrationPath.match(/src\/videos\/([^/]+)\//)?.[1];
if (!slug) {
	console.error(`Cannot derive video slug from ${narrationPath}; expected src/videos/<slug>/…`);
	process.exit(1);
}
const timingPath = `src/videos/${slug}/vo-timing.ts`;
mkdirSync(dirname(timingPath), {recursive: true});
writeFileSync(
	timingPath,
	`// GENERATED by scripts/vo-sync.ts — do not edit by hand.
// Scene durations re-timed to the narration in narration-v1.md
// (max(authored visual minimum, audio + ${pad}s pad)). Re-run vo-sync
// after massaging narration; delete this file's entries to revert to
// authored timing.
export const VO_TIMING: Record<string, number> = {
${entries.map((e) => `\t"${e.name}": ${e.durationSec},`).join("\n")}
};
`,
);

const total = entries.reduce((a, e) => a + e.durationSec, 0);
console.log(`\n${entries.length} scenes, ${total.toFixed(1)}s total (was ${scenes.reduce((a, s) => a + s.minSec, 0)}s).`);
console.log(`Wrote ${manifestPath} and ${timingPath}.`);
for (const e of entries) {
	const stretch = e.durationSec - (scenes.find((s) => s.name === e.name)?.minSec ?? 0);
	if (stretch > 0) console.log(`  ${e.name}: +${stretch.toFixed(1)}s hold (audio ${e.audioSec.toFixed(1)}s)`);
}
