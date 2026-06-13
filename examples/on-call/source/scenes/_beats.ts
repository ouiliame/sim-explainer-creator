import {interpolate} from "remotion";
import type {IncidentStatus} from "../data";

// Shared beat math for on-call-v2 (script-v1.md motion language). Every
// value is frame-derived through these clamped ramps; scenes own their beat
// TIMES, this module owns the SHAPES — so the same flip reads identically
// in the followed run (scene 5) and the cadence (scene 6).

/** Clamped ramp: 0 before t0, 1 after t1 (optionally from→to / eased). */
export const ramp = (
	t: number,
	t0: number,
	t1: number,
	from = 0,
	to = 1,
	easing?: (input: number) => number,
) =>
	interpolate(t, [t0, t1], [from, to], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing,
	});

/** Trapezoid pulse: rises over `up`, holds, releases over `down`. */
export const pulse = (t: number, t0: number, t1: number, up = 0.35, down = 0.6) =>
	Math.min(ramp(t, t0, t0 + up), ramp(t, t1, t1 + down, 1, 0));

// ── The status flip (the table's cell language) ─────────────────────────────
// A flip is a dip-swap of the cell's own enum text (firing → triaged →
// assigned) with the green output tint pulsing at each flip and decaying to
// residue (growth-machine's accepted cell language). T1 = the run's agent
// settles (triaged); T2 = the PagerDuty incident lands (assigned).

const DIP_W = 0.14; // dip half-width (text reaches 0 exactly at T)
const TINT_PEAK = 0.85;
export const TINT_RESIDUE = 0.35;
const TINT_UP = 0.12;
const TINT_DECAY = 1.6;

const tintPulse = (t: number, T: number) => {
	if (t <= T) return 0;
	if (t <= T + TINT_UP) return ramp(t, T, T + TINT_UP, 0, TINT_PEAK);
	return ramp(t, T + TINT_UP, T + TINT_UP + TINT_DECAY, TINT_PEAK, TINT_RESIDUE);
};

export type Flip = {
	status: IncidentStatus;
	/** 0..1 — the status cell's TEXT opacity (dips to 0 at each swap). */
	textOp: number;
	/** 0..1 — green output tint (pulse → residue). */
	tint: number;
};

export const flipAt = (t: number, T1: number, T2: number): Flip => {
	const dip = (T: number) => Math.min(1, Math.abs(t - T) / DIP_W);
	return {
		status: t < T1 ? "firing" : t < T2 ? "triaged" : "assigned",
		textOp: Math.min(dip(T1), dip(T2)),
		// max of the two envelopes is continuous through the second pulse.
		tint: Math.max(tintPulse(t, T1), tintPulse(t, T2)),
	};
};

/** A row that has never flipped. */
export const FLIP_NONE: Flip = {status: "firing", textOp: 1, tint: 0};

/** A row long settled (the residue persists to the final frame). */
export const FLIP_DONE: Flip = {status: "assigned", textOp: 1, tint: TINT_RESIDUE};
