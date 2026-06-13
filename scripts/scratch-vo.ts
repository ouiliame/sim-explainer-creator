// Scratch voiceover generator: narration sheet → per-scene ElevenLabs TTS →
// public/vo/<compId>/{NN.mp3, manifest.json}, played by <ScratchVO/>.
//
// The scratch track's job is TIMING: scenes get re-paced against real speech
// rhythm instead of guessed holds. William's recorded VO replaces the files
// 1:1 (same names, same manifest).
//
// Usage:
//   ELEVENLABS_API_KEY=... bun scripts/scratch-vo.ts \
//     --comp module-5-agents-v3 \
//     --sheet src/videos/module-5-agents/narration-sheet-v3.md \
//     [--voice <voiceId>]
//
// Sheet format (templates/narration-sheet.md): scenes as
//   `## N. <scene-name> — M:SS–M:SS`
// The spoken text per scene = the section's "Beat intent:" line (scratch
// rhythm only — beat intents are NOT final narration, and that's fine).

import {mkdirSync, readFileSync, writeFileSync} from "node:fs";

const arg = (name: string, fallback?: string) => {
	const i = process.argv.indexOf(`--${name}`);
	return i > -1 ? process.argv[i + 1] : fallback;
};

const comp = arg("comp");
const sheet = arg("sheet");
const voice = arg("voice", "21m00Tcm4TlvDq8ikWAM"); // ElevenLabs "Rachel"
const key = process.env.ELEVENLABS_API_KEY;

if (!comp || !sheet) {
	console.error("usage: bun scripts/scratch-vo.ts --comp <id> --sheet <narration-sheet.md> [--voice <id>]");
	process.exit(1);
}
if (!key) {
	console.error(
		"ELEVENLABS_API_KEY is not set.\n" +
			"Get a key at https://elevenlabs.io → profile → API keys, then:\n" +
			`  ELEVENLABS_API_KEY=... bun scripts/scratch-vo.ts --comp ${comp} --sheet ${sheet}`,
	);
	process.exit(1);
}

const md = readFileSync(sheet, "utf8");

type Scene = {idx: number; name: string; at: number; text: string};
const scenes: Scene[] = [];

const sections = md.split(/^## /m).slice(1);
for (const section of sections) {
	const header = section.split("\n")[0];
	const m = header.match(/^(\d+)\.\s+(.+?)\s+—\s+(\d+):(\d+)/);
	if (!m) continue;
	const at = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
	const intent = section.match(/\*\*Beat intent:\*\*\s*(.+)/)?.[1];
	if (!intent) continue;
	scenes.push({idx: parseInt(m[1], 10), name: m[2].trim(), at, text: intent.trim()});
}

if (scenes.length === 0) {
	console.error(`No scenes parsed from ${sheet} — expected '## N. name — M:SS–M:SS' headers with '**Beat intent:**' lines.`);
	process.exit(1);
}

const outDir = `public/vo/${comp}`;
mkdirSync(outDir, {recursive: true});

const tts = async (text: string): Promise<ArrayBuffer> => {
	const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
		method: "POST",
		headers: {"xi-api-key": key, "Content-Type": "application/json"},
		body: JSON.stringify({
			text,
			model_id: "eleven_multilingual_v2",
			voice_settings: {stability: 0.5, similarity_boost: 0.7},
		}),
	});
	if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
	return res.arrayBuffer();
};

const manifest: {scenes: {at: number; file: string}[]} = {scenes: []};
for (const s of scenes) {
	const file = `${String(s.idx).padStart(2, "0")}.mp3`;
	process.stdout.write(`scene ${s.idx} (${s.name}) → ${file} … `);
	const audio = await tts(s.text);
	writeFileSync(`${outDir}/${file}`, Buffer.from(audio));
	manifest.scenes.push({at: s.at, file});
	console.log(`${(audio.byteLength / 1024).toFixed(0)}kB`);
}
writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`\nWrote ${scenes.length} clips + manifest to ${outDir}/ — <ScratchVO compId="${comp}"/> will pick them up.`);
