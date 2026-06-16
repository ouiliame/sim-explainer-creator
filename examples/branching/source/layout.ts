// Shared layout for the Branching video. ONE set piece for all 7 scenes:
// Start → decider (Condition ⇄ Router) → destination lanes. Geometry is the
// docs' own examples at ×1.5 — CONDITION_ROUTE_WORKFLOW (examples.ts:235)
// for phase 0 and ROUTER_TRIAGE_WORKFLOW (examples.ts:494) for phase 1 —
// phase-interpolated so scenes 4/7 can morph 2 lanes ⇄ 3 lanes without a
// relayout. Declared deviation: the decider keeps x = 495 (the condition
// example's 330 native) in both phases; the router example authors 320, but
// the decider never moving beats a 15px doc-coordinate difference.

import {
	SIM_BLOCK_W,
	SIM_HANDLE_Y,
	SIM_BLOCK_ROW_H,
	SIM_BLOCK_ROW_GAP,
	SIM_BRANCH_HANDLE_OUT,
	simBlockItemCenterY,
} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

export const BLOCK_W = SIM_BLOCK_W; // 375

// ── X geometry (docs ×1.5, centered as a unit) ──────────────────────────────
const DEC_PITCH = 330 * 1.5; // 495
const DEST_PITCH = 700 * 1.5; // 1050
const FORK_W = DEST_PITCH + BLOCK_W; // 1425

export const START_X = (STAGE_W - FORK_W) / 2; // 247.5
export const DEC_X = START_X + DEC_PITCH;
export const DEST_X = START_X + DEST_PITCH;

// ── Y geometry ───────────────────────────────────────────────────────────────
// The decider (and Start, which the docs keep level with it) NEVER moves.
// DEC_Y centers both phases' bounding boxes within ±5px of stage center.
export const DEC_Y = 470;
export const START_Y = DEC_Y;

// Destination lane tops RELATIVE to DEC_Y, from the docs' coordinates:
// phase 0 (condition example): escalate 0−60 → −90, reply 130−60 → +105.
// phase 1 (router example): sales 0−95 → −142.5, support 95−95 → 0,
// billing 190−95 → +142.5.
const LANE_A = {from: -90, to: -142.5}; // Escalate → Sales
const LANE_B = {from: 105, to: 0}; // Reply → Support
const LANE_C_REL = 142.5; // Billing (router phase only)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Destination block tops for a given lane-glide mix (0 condition, 1 router). */
export const destY = (laneMix: number) => ({
	a: DEC_Y + lerp(LANE_A.from, LANE_A.to, laneMix),
	b: DEC_Y + lerp(LANE_B.from, LANE_B.to, laneMix),
	c: DEC_Y + LANE_C_REL,
});

// ── Handles & edges ──────────────────────────────────────────────────────────
// Header handles protrude 12 (8 native ×1.5); branch handles 24 (16 native).
const HANDLE_OUT = 12;

/** Edge 0: Start's header source → decider's header target (horizontal). */
export const EDGE0 = {
	x1: START_X + BLOCK_W + HANDLE_OUT,
	y: START_Y + SIM_HANDLE_Y,
	x2: DEC_X - HANDLE_OUT,
};

/**
 * Decider content reveals in SimBlock render order (rows then branches) for
 * a given morph state: [Context, Model, branchA, branchB, branchC].
 * rowsReveal drives Context/Model; branchCReveal drives the third route.
 */
export const deciderReveals = (ctxReveal: number, modelReveal: number, branchCReveal: number) => [
	ctxReveal,
	modelReveal,
	1,
	1,
	branchCReveal,
];

/** Absolute Y of branch k's source handle center (k: 0=A, 1=B, 2=C). */
export const branchHandleY = (reveals: number[], k: 0 | 1 | 2) =>
	DEC_Y + simBlockItemCenterY(reveals, 2 + k);

/** Branch edge endpoints for lane k at the current morph state. */
export const branchEdge = (reveals: number[], laneMix: number, k: 0 | 1 | 2) => {
	const dy = destY(laneMix);
	const y2 = (k === 0 ? dy.a : k === 1 ? dy.b : dy.c) + SIM_HANDLE_Y;
	return {
		x1: DEC_X + BLOCK_W + SIM_BRANCH_HANDLE_OUT,
		y1: branchHandleY(reveals, k),
		x2: DEST_X - HANDLE_OUT,
		y2,
	};
};

// Convenience: full-reveal states for each phase.
export const CONDITION_REVEALS = deciderReveals(0, 0, 0);
export const ROUTER_REVEALS = deciderReveals(1, 1, 1);

// ── Camera ───────────────────────────────────────────────────────────────────
// Maps stage point P to the viewport center at scale s:
// transform = translate(tx, ty) scale(s), origin "0 0".
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: CENTER_X - px * s,
	ty: CENTER_Y - py * s,
});

/** The held lean-in framing (scenes 2→3 carry it across the cut; scene 5
 *  reuses it). Centered just below the decider's rows so Start and both/all
 *  destination lanes stay in frame at 1.28×. */
export const LEAN = {px: 930, py: 560, s: 1.28};

// ── Scene 6 — the run-record overlay (over the dimmed, unmoved fork) ────────
export const BUNDLE_SCALE = 1.7;
export const BUNDLE_X = (STAGE_W - 640 * BUNDLE_SCALE) / 2;
export const BUNDLE_Y = 400;

// Re-exported row metrics for scenes that need slot math.
export {SIM_BLOCK_ROW_H, SIM_BLOCK_ROW_GAP};
