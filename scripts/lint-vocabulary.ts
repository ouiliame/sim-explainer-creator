// Vocabulary lint — the mechanical guard against the Opus-4.8 failure mode
// (case study 17 / references/model-resilience.md): weaker models invent
// surface-scale app UI inside video folders instead of composing the shared
// library. This makes the rule machine-checkable.
//
// Usage: bun scripts/lint-vocabulary.ts [src/videos/<slug>] (default: all)
//
// ADVISORY scanner (exit 1 in --strict only): the reliable gate for this
// failure class is the Phase-A STILL REVIEW (a strong reviewer looking at
// one rendered frame); this script is the cheap pre-filter agents run on
// themselves and reviewers run to get a suspect list.
//
// Flags:
//  1. INVENTED SURFACE — a locally-defined component whose style carries
//     background+border and whose body is surface-sized. Surfaces must be
//     imported from src/components (SimTable, OutputBundle, ChatPanel, …)
//     or be a declared port/aside (annotate the line above the component:
//     `// vocab-ok: <why — port of X / aside grammar Y>`).
//  2. VERTICAL WIRING — SimEdgePath/edge endpoints that run predominantly
//     top-down (|dy| > |dx| over a node gap). Sim flows left→right; trees/
//     hierarchies don't belong on the workflow canvas (case 16).
//  3. TABLE BYPASS — a local component named *Table*/*Grid*/*Row* defining
//     its own cell layout. Use the shared SimTable.
//
// Heuristics, not proofs — `// vocab-ok:` with a reason silences a finding
// and creates a grep-able audit trail.

import {readFileSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";

const root = process.argv[2] ?? "src/videos";

const files: string[] = [];
const walk = (d: string) => {
	for (const e of readdirSync(d)) {
		const p = join(d, e);
		const s = statSync(p);
		if (s.isDirectory()) walk(p);
		else if (/\.(tsx|ts)$/.test(e)) files.push(p);
	}
};
walk(root);

type Finding = {file: string; line: number; rule: string; detail: string};
const findings: Finding[] = [];

const lineOf = (src: string, idx: number) => src.slice(0, idx).split("\n").length;
const okAbove = (src: string, idx: number) => {
	const before = src.slice(Math.max(0, idx - 400), idx);
	return /vocab-ok:/.test(before);
};

for (const f of files) {
	const src = readFileSync(f, "utf8");

	// 1+3: locally-defined components
	const compRe = /(?:export )?const ([A-Z]\w+): React\.FC[^=]*= /g;
	let m: RegExpExecArray | null;
	while ((m = compRe.exec(src))) {
		const name = m[1];
		// body ≈ next 2500 chars (enough to see its style payload)
		const next = src.indexOf(": React.FC", m.index + m[0].length);
		const body = src.slice(m.index, next === -1 ? m.index + 4000 : Math.min(next, m.index + 4000));
		const hasSurfaceStyle =
			/backgroundColor:/.test(body) && /border(?!Radius)/.test(body) && /padding/.test(body);
		// surface-scale = a real panel: sizable body AND renders text content
		const big = body.length > 1100 && /fontSize/.test(body);
		if (hasSurfaceStyle && big && !okAbove(src, m.index)) {
			findings.push({
				file: f,
				line: lineOf(src, m.index),
				rule: "INVENTED-SURFACE",
				detail: `${name} defines a bordered+filled surface locally. Use a shared component (SimTable/OutputBundle/ChatPanel/…) or annotate \`// vocab-ok: <provenance>\`.`,
			});
		}
		if (/(Table|Grid|RowList|ListPanel)$/.test(name) && /display: *"grid"|gridTemplate|<table/.test(body) && !okAbove(src, m.index)) {
			findings.push({
				file: f,
				line: lineOf(src, m.index),
				rule: "TABLE-BYPASS",
				detail: `${name} builds its own table/grid. The shared SimTable is the only sanctioned data grid.`,
			});
		}
	}

	// 2: vertical edges (top-down wiring)
	const edgeRe = /x1=\{([^}]+)\}\s+y1=\{([^}]+)\}\s+x2=\{([^}]+)\}\s+y2=\{([^}]+)\}/g;
	while ((m = edgeRe.exec(src))) {
		// only flag literal-number geometry we can evaluate cheaply
		const nums = m.slice(1, 5).map((s) => Number(s));
		if (nums.some((n) => Number.isNaN(n))) continue;
		const [x1, y1, x2, y2] = nums;
		if (Math.abs(y2 - y1) > Math.abs(x2 - x1) + 40 && !okAbove(src, m.index)) {
			findings.push({
				file: f,
				line: lineOf(src, m.index),
				rule: "VERTICAL-WIRING",
				detail: `edge runs top-down (dy ${Math.round(y2 - y1)} vs dx ${Math.round(x2 - x1)}). Sim flows left→right; hierarchies don't belong on the canvas (case 16).`,
			});
		}
	}
}

const strict = process.argv.includes("--strict");
if (findings.length === 0) {
	console.log(`vocab lint: clean (${files.length} files under ${root}).`);
	process.exit(0);
}
for (const fd of findings) {
	console.log(`${fd.file}:${fd.line} [${fd.rule}] ${fd.detail}`);
}
console.log(`\n${findings.length} finding(s) — review candidates, not verdicts. Annotate sanctioned ports/asides with \`// vocab-ok: <reason>\`.`);
process.exit(strict ? 1 : 0);
