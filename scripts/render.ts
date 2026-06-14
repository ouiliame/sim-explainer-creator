#!/usr/bin/env bun
// Render a registered composition by id.
//   bun run render <comp-id>          → 1080p draft (crf 18)
//   bun run render <comp-id> --4k     → 4K master  (scale 2, crf 16)
//
// A fresh clone has no compositions until you generate one, so there is no
// hardcoded default — pass the id of the comp you registered in src/Root.tsx.
import {spawnSync} from "node:child_process";

const args = process.argv.slice(2);
const comp = args.find((a) => !a.startsWith("--"));
if (!comp) {
	console.error("usage: bun run render <comp-id> [--4k]   (1080p by default; --4k for a scale=2 master)");
	process.exit(1);
}
const fourK = args.includes("--4k");
const out = `out/${comp}${fourK ? "" : "-1080"}.mp4`;
const flags = fourK ? ["--scale=2", "--crf=16"] : ["--crf=18"];
const r = spawnSync("bunx", ["remotionb", "render", comp, out, ...flags, "--codec=h264"], {stdio: "inherit"});
console.log(r.status === 0 ? `\n✓ ${out}` : `\n✗ render failed (${r.status})`);
process.exit(r.status ?? 1);
