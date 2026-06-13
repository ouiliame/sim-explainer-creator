// Boundary verification: renders the last frame of scene N and frame 0 of
// scene N+1 for every adjacent scene pair of a video, pixel-diffs each pair,
// and reports. Structural zero is required; a few dozen pixels at channel
// delta ≤2 (antialias LSB noise from fixed-vs-auto box heights) is a pass.
//
// Usage: bun scripts/verify-boundaries.ts <composition-id> [theme]
//   e.g. bun scripts/verify-boundaries.ts module-5-agents-v3
//        bun scripts/verify-boundaries.ts module-5-agents-v3 light
//
// Scene compositions follow Root.tsx's `<video>--NN-<scene>` convention;
// durations are read from `remotionb compositions`.

import {execSync} from "node:child_process";
import {existsSync, mkdirSync, readFileSync} from "node:fs";
import {PNG} from "pngjs";

const LSB_MAX_DELTA = 2;
const LSB_MAX_COUNT = 200;

const id = process.argv[2];
const theme = process.argv[3] ?? "dark";
if (!id || !["dark", "light"].includes(theme)) {
	console.error("usage: bun scripts/verify-boundaries.ts <composition-id> [dark|light]");
	process.exit(1);
}

const OUT = "out/verify";
mkdirSync(OUT, {recursive: true});

console.log("Listing compositions…");
const listing = execSync("bunx remotionb compositions src/index.ts 2>/dev/null", {
	encoding: "utf8",
});

// Lines look like: `module-5-agents-v3--01-a-normal-workflow  60   1920x1080  420`
type Scene = {comp: string; frames: number};
const scenes: Scene[] = [];
for (const line of listing.split("\n")) {
	const m = line.trim().match(new RegExp(`^(${id}--\\d{2}-\\S+)\\s+(\\d+(?:\\.\\d+)?)\\s+\\S+\\s+(\\d+)`));
	if (m) scenes.push({comp: m[1], frames: parseInt(m[3], 10)});
}
scenes.sort((a, b) => a.comp.localeCompare(b.comp));

if (scenes.length < 2) {
	console.error(`Found ${scenes.length} scene compositions for "${id}" — nothing to verify.`);
	console.error("Lines seen:\n" + listing.split("\n").filter((l) => l.includes(id)).join("\n"));
	process.exit(1);
}
console.log(`${scenes.length} scenes:`);
scenes.forEach((s) => console.log(`  ${s.comp} (${s.frames} frames)`));

const still = (comp: string, frame: number, out: string) => {
	execSync(
		`bunx remotionb still ${comp} ${out} --frame=${frame} --scale=0.5 --props='{"theme":"${theme}"}' >/dev/null 2>&1`,
		{stdio: "inherit", shell: "/bin/bash"},
	);
};

// Decoded in-process with pngjs (cross-platform; the previous sips-based
// BMP conversion was macOS-only). Pixel comparison itself is unchanged:
// per-pixel max channel delta over RGB.
const readPng = (p: string): PNG => PNG.sync.read(readFileSync(p));

let failures = 0;
for (let i = 0; i < scenes.length - 1; i++) {
	const a = scenes[i];
	const b = scenes[i + 1];
	const aPng = `${OUT}/p${i}a.png`;
	const bPng = `${OUT}/p${i}b.png`;
	still(a.comp, a.frames - 1, aPng);
	still(b.comp, 0, bPng);
	if (!existsSync(aPng) || !existsSync(bPng)) {
		console.log(`pair ${i + 1}: RENDER FAILED`);
		failures++;
		continue;
	}
	const A = readPng(aPng);
	const B = readPng(bPng);
	if (A.width !== B.width || A.height !== B.height) {
		console.log(`pair ${i + 1}: SIZE MISMATCH ${A.width}x${A.height} vs ${B.width}x${B.height}`);
		failures++;
		continue;
	}
	let count = 0;
	let maxD = 0;
	let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
	for (let y = 0; y < A.height; y++) {
		for (let x = 0; x < A.width; x++) {
			const k = (y * A.width + x) * 4;
			const d = Math.max(
				Math.abs(A.data[k] - B.data[k]),
				Math.abs(A.data[k + 1] - B.data[k + 1]),
				Math.abs(A.data[k + 2] - B.data[k + 2]),
			);
			if (d > 0) {
				count++;
				if (d > maxD) maxD = d;
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			}
		}
	}
	const label = `${a.comp.split("--")[1]} → ${b.comp.split("--")[1]}`;
	if (count === 0) {
		console.log(`pair ${i + 1} (${label}): IDENTICAL`);
	} else if (maxD <= LSB_MAX_DELTA && count <= LSB_MAX_COUNT) {
		console.log(`pair ${i + 1} (${label}): PASS — ${count}px LSB noise (maxΔ ${maxD})`);
	} else {
		console.log(
			`pair ${i + 1} (${label}): FAIL — ${count}px, maxΔ ${maxD}, bbox x ${minX}-${maxX} y ${minY}-${maxY}`,
		);
		console.log(`  frames: ${aPng} vs ${bPng} — open them, then column-profile the bbox.`);
		failures++;
	}
}

process.exit(failures > 0 ? 1 : 0);
