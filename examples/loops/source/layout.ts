// Shared layout for the Loops video. ONE set piece for all 7 scenes:
// Start → container (Loop ⇄ Parallel) holding Function 1 → Summary.
// Geometry is the docs' own LOOP_WORKFLOW / PARALLEL_WORKFLOW (identical
// coordinates: examples.ts:1490/:1540) at ×1.5: Start x0, container x340
// (430 wide), consumer x860, with the outer blocks aligned to the
// container's centered handles so both outer wires are straight (the docs
// author the same alignment: 95 + 20 = 30 + 85).
//
// Declared deviation (script assumption 8): container height is 360 native
// (docs author 430×170 for a 1-row inner block) so three fanned instances
// fit inside during the parallel run without resizing mid-video. The real
// container is user-resizable; the product's own teaching screenshots
// (loop-2.png / parallel-2.png) show these generous proportions.

import {SIM_BLOCK_W, SIM_HANDLE_Y, simBlockHeight} from "../../components/SimBlock";
import {textWidth} from "../../components/measure";

const S = 1.5;

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

export const BLOCK_W = SIM_BLOCK_W; // 375

// ── Container (docs preview-container-node ×1.5) ────────────────────────────
export const CONT_W = 430 * S; // 645
export const CONT_H = 360 * S; // 540 (deviation 8)
// Header: 1px border-top is inside the box; content = py-2 (8) + 24 chip
// = 40 native + 1px border-b.
export const CONT_HEADER_H = 40 * S + 1; // content-box header height

// ── X geometry (docs ×1.5, centered as a unit) ──────────────────────────────
const CONT_PITCH = 340 * S; // 510
const SUM_PITCH = 860 * S; // 1290
const TOTAL_W = SUM_PITCH + BLOCK_W; // 1665

export const START_X = (STAGE_W - TOTAL_W) / 2; // 127.5
export const CONT_X = START_X + CONT_PITCH;
export const SUM_X = START_X + SUM_PITCH;

// ── Y geometry ───────────────────────────────────────────────────────────────
// The workflow axis: the container's centered handles sit on stage center;
// Start and Summary tops are derived so their header handles share it.
export const AXIS_Y = CENTER_Y; // 540
export const CONT_Y = AXIS_Y - CONT_H / 2; // 270
export const START_Y = AXIS_Y - SIM_HANDLE_Y; // 510
export const SUM_Y = AXIS_Y - SIM_HANDLE_Y; // 510

// ── Inner Start pill (docs: left-4 top-[56px]; px-3 py-1.5 text 13 medium) ──
export const PILL_X = CONT_X + 16 * S;
export const PILL_Y = CONT_Y + 56 * S;
export const PILL_FONT = 13 * S; // 19.5
export const PILL_LINE_H = 19.5 * S; // 29.25 (13px at preflight 1.5)
export const PILL_H = PILL_LINE_H + 2 * 6 * S + 2; // text + py-1.5 + borders
export const PILL_W = textWidth("Start", PILL_FONT, "500") + 2 * 12 * S + 2;
// Pill source handle: 7×16 native at right −8 (docs HANDLE_START).
export const PILL_HANDLE_W = 7 * S;
export const PILL_HANDLE_H = 16 * S;

// ── Inner Function instance(s) ───────────────────────────────────────────────
// Middle instance (THE block) centered in the body's fan area; ghosts fan
// to ±FAN_PITCH during the parallel run (scene 6 only).
export const FN_H = simBlockHeight(1); // 118.5
export const FAN_GAP = 16 * S; // 24
export const FAN_PITCH = FN_H + FAN_GAP; // 142.5
export const FN_X = CONT_X + 150 * S; // docs inner x150
export const FN_Y = CONT_Y + 165 * S; // fan-centered (deviation 8)

/** Instance tops for a given fan progress (0 = single block, 1 = full fan). */
export const instY = (fan: number) => ({
	top: FN_Y - FAN_PITCH * fan,
	mid: FN_Y,
	bot: FN_Y + FAN_PITCH * fan,
});

// ── Handles & edges ──────────────────────────────────────────────────────────
// Header/container handles protrude 12 (8 native ×1.5).
const HANDLE_OUT = 8 * S;

/** Edge 0: Start's header source → container target (straight, on axis). */
export const EDGE0 = {
	x1: START_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: CONT_X - HANDLE_OUT,
};

/** Exit edge: container source → Summary target (straight, on axis). */
export const EDGE_EXIT = {
	x1: CONT_X + CONT_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: SUM_X - HANDLE_OUT,
};

/** Inner edge: pill source → instance k's target handle (smooth-step). */
export const innerEdge = (fan: number, k: "top" | "mid" | "bot") => ({
	x1: PILL_X + PILL_W + HANDLE_OUT,
	y1: PILL_Y + PILL_H / 2,
	x2: FN_X - HANDLE_OUT,
	y2: instY(fan)[k] + SIM_HANDLE_Y,
});

// ── Scene 2 — the editor aside (over the dimmed world, right of center) ────
export const CARD_W = 460;
export const CARD_X = STAGE_W - CARD_W - 90;
export const CARD_Y = 300;

// ── Camera ───────────────────────────────────────────────────────────────────
/** Maps stage point P to the viewport center at scale s. */
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: CENTER_X - px * s,
	ty: CENTER_Y - py * s,
});

/** Scene-3 lean-in framing: centered on the container. 1.12× keeps Start
 *  and Summary fully in frame (1665 × 1.12 = 1865 < 1920). */
export const LEAN = {px: CONT_X + CONT_W / 2, py: AXIS_Y, s: 1.12};
