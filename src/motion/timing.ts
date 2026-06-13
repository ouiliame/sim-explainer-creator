// The tuned motion vocabulary — IMPORT these, never re-guess raw ramp windows.
//
// Every constant and helper here is harvested VERBATIM from the market-desk
// build (which ported swe-fleet's choreography beat-for-beat). Those windows
// were authored in a single pass — they are the output of a strong motion
// sense, not of a watch-and-nudge loop, which means they are NOT reliably
// re-derivable by feel. So they live here as a shared primitive: a new video
// composes motion by calling `traverse()`, `chipRing()`, `cellFill()`,
// `scrambleFinish()` etc. with a start time, instead of hand-authoring
// `ramp(t, 2.2, 3.6)` numbers it cannot feel-tune. Smoothness becomes a
// property of these functions. (Provenance: examples/market-desk/source.)
//
// You may still write raw `ramp`/`pulse` for one-off motion — but for the
// common beats (assembly, camera, runs, fills, the parallel money shot) reach
// for the named helpers so the rhythm matches the exemplar by construction.

import {interpolate} from "remotion";
import {EASING} from "../theme";

// ── primitives (clamped) — identical to what the scenes use ──────────────────
/** 0→1 across [t0,t1] seconds, clamped, optional easing. */
export const ramp = (t: number, t0: number, t1: number, easing?: (n: number) => number) =>
	interpolate(t, [t0, t1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing});
/** Up over [a0,a1], hold, back down over [b0,b1]. */
export const pulse = (t: number, a0: number, a1: number, b0: number, b1: number) =>
	Math.min(ramp(t, a0, a1), 1 - ramp(t, b0, b1));

// ── the tuned durations (seconds), harvested from market-desk ────────────────
export const D = {
	blockReveal: 0.6, // a block fades/grows in (EASING.out)
	edgeDraw: 0.6, // an edge draws on (linear)
	assembleGap: 1.0, // element → its edge; ~0.4 more edge → next element
	rowStagger: 0.35, // table rows populate, per-row offset
	rangeStagger: 0.14, // a lit selection range sweeps rows (faster)
	camera: 1.4, // a camera framing change (EASING.inOut; range 1.3–2.1)
	traverse: 0.7, // a WirePulse crosses an edge (EASING.inOut)
	chipAttack: 0.3, // tool-chip / glow ring fade-in (and fade-out)
	chipHold: 0.8, // tool-chip ring hold
	tagResolve: 0.4, // a tag resolves to its value
	cellFill: 0.6, // a table cell fills
	tintDecay: 0.6, // green output tint decays to residue
	selUp: 0.4, // row-selection pulse up
	selHold: 1.2, // row-selection pulse hold
	selDown: 0.4, // row-selection pulse down
	causeEffect: 0.7, // an effect lands this long after its cause (the money-shot offset)
	scrambleGap: 1.4, // spacing between parallel-lane finishes
	settleStep: 0.25, // green causal-settle spacing across a chain
} as const;

/** Output tint decays to this residual strength (1 − 0.65 = 0.35). */
export const RESIDUE = 0.65;

// ── the run-beat grammar (tuned windows baked in) ────────────────────────────

/** A WirePulse crossing an edge, fired at `start`. */
export const traverse = (t: number, start: number) =>
	ramp(t, start, start + D.traverse, EASING.inOut);

/** Edge heat under a crossing pulse: heats in as the pulse enters, cools after it passes. */
export const edgeHeat = (t: number, start: number) =>
	pulse(t, start, start + 0.4, start + D.traverse + 0.7, start + D.traverse + 0.8);

/** A tool-chip ring (or any "fired and released" ring) at `start`: 0.3 attack / 0.8 hold / 0.3 release. */
export const chipRing = (t: number, start: number) =>
	pulse(t, start, start + D.chipAttack, start + D.chipAttack + D.chipHold, start + D.chipAttack + D.chipHold + D.chipAttack);

/** A tag glow (being read) over [start, end] — attack in, release before `end`. */
export const tagGlow = (t: number, start: number, end: number) =>
	pulse(t, start, start + D.chipAttack, end - D.tagResolve, end);

/** A tag resolving to its runtime value at `start`. */
export const tagResolve = (t: number, start: number) => ramp(t, start, start + D.tagResolve);

/** A table cell filling at `start`. */
export const cellFill = (t: number, start: number) => ramp(t, start, start + D.cellFill);

/** A written cell's green tint: pulses with the fill, then decays to the 0.35 residue. */
export const cellTint = (t: number, start: number) =>
	cellFill(t, start) * (1 - RESIDUE * ramp(t, start + 1.1, start + 1.1 + D.tintDecay));

/** A row-selection pulse at `start` (up, hold, down) — "this row is one record". */
export const selectionPulse = (t: number, start: number) =>
	pulse(t, start, start + D.selUp, start + D.selUp + D.selHold, start + D.selUp + D.selHold + D.selDown);

/** A camera ease starting at `start` over `dur` (default tuned), always EASING.inOut. */
export const cameraEase = (t: number, start: number, dur: number = D.camera) =>
	ramp(t, start, start + dur, EASING.inOut);

/** The reveal ramp for the i-th element of a staggered assembly (flow order). */
export const assembleStagger = (t: number, i: number, gap: number = D.assembleGap, t0 = 0) =>
	ramp(t, t0 + i * gap, t0 + i * gap + D.blockReveal, EASING.out);

// ── The assembly grammar: edge and block coupled so a wire can NEVER hang in
//    empty space ────────────────────────────────────────────────────────────
//
// THE RULE this enforces: an edge connects two blocks, so it may not be drawn
// to a block that does not exist yet. The gold's assembly reads "the wire
// extends and the block snaps onto its tip" — the block lands WHILE its
// incoming edge is still drawing toward it. The failure mode (seen when an
// imitator hand-picks separate `edgeDraw`/`assembleStagger` start times) is
// drawing ALL the edges first and ALL the blocks second, so every wire hangs in
// the void for a beat. These helpers couple the two windows in ONE call, so you
// CANNOT express that bug: you get back `node(i)` and `edge(i)` already in the
// right relationship; you only spread them onto the rig.

/** Node↔edge breathing gap in the gold's assembly cadence (s). */
const ASM_GAP = 0.4;
/** One linear-chain period: reveal → gap → edge → gap (≈2.0s; matches the gold). */
const ASM_PERIOD = D.blockReveal + ASM_GAP + D.edgeDraw + ASM_GAP;

/**
 * Flow-order assembly of a LINEAR chain (node0 → edge0 → node1 → edge1 → …).
 * Call once; spread the results. `edge(i)` (the wire node i→i+1) draws after
 * node i settles, and node i+1 lands a gap later AT the wire's tip — the edge
 * leads its destination by construction, and is never left dangling because the
 * block follows within ~`ASM_GAP`s. Use for the chain spine of an assemble scene.
 *
 *   const A = chainAssembly(t);
 *   <Stage start={{opacity: A.node(0)}} edge1={{progress: A.edge(0)}}
 *          classify={{opacity: A.node(1)}} edge2={{progress: A.edge(1)}}
 *          cond={{opacity: A.node(2)}} />
 */
export const chainAssembly = (t: number, {t0 = 0}: {t0?: number} = {}) => {
	const nodeStart = (i: number) => t0 + i * ASM_PERIOD;
	const edgeStart = (i: number) => nodeStart(i) + D.blockReveal + ASM_GAP;
	return {
		node: (i: number) => ramp(t, nodeStart(i), nodeStart(i) + D.blockReveal, EASING.out),
		edge: (i: number) => ramp(t, edgeStart(i), edgeStart(i) + D.edgeDraw),
		nodeStart,
		edgeStart,
		/** When the n-node chain has fully settled (for sequencing what comes next). */
		end: (n: number) => nodeStart(n - 1) + D.blockReveal,
	};
};

/**
 * Assembly of a FAN (one source → m targets, e.g. a Condition's branch handles
 * to m Table blocks). Each lane is its own coupled edge→block pair, staggered by
 * `laneStride` — so the wire for lane i draws and ITS block lands at the tip
 * before the rig ever shows all edges at once. This is the fix for the "three
 * edges drawn into the void, then three blocks" failure: per-lane interleave,
 * never all-edges-then-all-blocks.
 *
 *   const F = fanAssembly(t, BRANCHES.length, {t0: A.end(3) + 0.3});
 *   lanes[i] = { edge: {progress: F.edge(i)}, tbl: {opacity: F.node(i)} };
 */
export const fanAssembly = (
	t: number,
	m: number,
	{t0 = 0, laneStride = 0.5}: {t0?: number; laneStride?: number} = {},
) => {
	const edgeStart = (i: number) => t0 + i * laneStride;
	// The block fades in at the wire's tip while the wire is still ~60% drawn —
	// the wire visibly lands ON the appearing block. It is never drawn alone.
	const nodeStart = (i: number) => edgeStart(i) + D.edgeDraw * 0.6;
	return {
		edge: (i: number) => ramp(t, edgeStart(i), edgeStart(i) + D.edgeDraw),
		node: (i: number) => ramp(t, nodeStart(i), nodeStart(i) + D.blockReveal, EASING.out),
		edgeStart,
		nodeStart,
		end: () => nodeStart(m - 1) + D.blockReveal,
	};
};

/** The reveal ramp for table row r (content populating into the grid). */
export const rowReveal = (t: number, r: number, t0 = 1.1) =>
	ramp(t, t0 + r * D.rowStagger, t0 + r * D.rowStagger + D.blockReveal);

/**
 * The parallel money-shot triplet for a lane finishing at time `f`: the lane
 * settles and pulses at `f`, and its table ROW fills `causeEffect` (0.7s)
 * later — cause then effect, the offset that makes the causality legible.
 */
export const scrambleFinish = (t: number, f: number) => ({
	pulse: ramp(t, f, f + 0.35, EASING.inOut),
	edgeHeat: pulse(t, f, f + 0.2, f + 0.6, f + 0.9),
	rowFill: ramp(t, f + D.causeEffect, f + D.causeEffect + 0.5),
	rowTint: ramp(t, f + D.causeEffect, f + D.causeEffect + 0.5) * (1 - RESIDUE * ramp(t, f + 1.7, f + 2.7)),
});

/** Finish times for n parallel lanes (apply your own scrambled order to the result). */
export const finishTimes = (n: number, start = 0.6, gap: number = D.scrambleGap) =>
	Array.from({length: n}, (_, i) => start + i * gap);

/** A green causal settle across a chain: the ok-ramp for the k-th block (0.25s apart). */
export const settleAt = (t: number, k: number, t0 = 0) => ramp(t, t0 + k * D.settleStep, t0 + k * D.settleStep + 0.2);
