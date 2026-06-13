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
