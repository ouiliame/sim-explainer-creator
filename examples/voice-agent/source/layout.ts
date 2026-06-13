// Shared layout for voice-agent-v2 ("The Voice Agent", take 2 — corrected
// architecture). ONE set piece on a 2400×1350 stage (growth-machine
// precedent: stage > viewport, fixed cameras), two bands that NEVER touch:
//
//   • TOP — the workflow, product-true, left→right on one axis:
//     Start → Campaign (agent) → Parallel container "Call each" holding the
//     ONE inner lane: pill → Call (AgentPhone) → Log outcome (Table).
//     Ghost instance pairs fan INSIDE the container at runtime only.
//
//   • BOTTOM — the aside band, separate boxes beside/below the workflow
//     (case 17 as amended): three call panels (chat-bubble grammar) +
//     the real SimTable of outcomes. No edge ever crosses bands; nothing
//     occludes a block at any camera.
//
// Every rect both sides of a cut reads from here so boundaries are exact.

import {SIM_BLOCK_W, SIM_HANDLE_Y, simBlockHeight} from "../../components/SimBlock";

const S = 1.5;

// ── Stage + camera ───────────────────────────────────────────────────────────
export const STAGE_W = 2400;
export const STAGE_H = 1350;
export const CENTER_X = STAGE_W / 2;

/** Maps stage point P to the 1920×1080 viewport center at scale s. */
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: 960 - px * s,
	ty: 540 - py * s,
});
export type Cam = {px: number; py: number; s: number};

// ── The workflow band ────────────────────────────────────────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
const CHAIN_GAP = 110; // block right edge → next target handle area

// Block heights (exact SimBlock math).
export const CAMPAIGN_H = simBlockHeight(2); // Messages + Model
export const LANE_BLOCK_H = simBlockHeight(2); // Operation + 1 config row
export const GHOST_H = simBlockHeight(0); // header-only runtime instance

// Container: header + padded body holding the lane between two ghost slots.
export const CONT_HEADER_H = 40 * S + 1; // 61 (docs preview-container-node)
const BODY_PAD = 28;
export const LANE_GAP = 26; // lane ↔ ghost
const FAN_STACK = 2 * GHOST_H + 2 * LANE_GAP + LANE_BLOCK_H;

// Inner x: pill lead-in, then Call → Log outcome.
const LANE_LEAD_IN = 240;
const LANE_PITCH_GAP = 96;
export const CONT_W = LANE_LEAD_IN + 2 * BLOCK_W + LANE_PITCH_GAP + 56; // 1142
export const CONT_H = CONT_HEADER_H + 2 * BODY_PAD + FAN_STACK; // 461.5

// Chain x: centered as a unit.
const CHAIN_TOTAL_W = 2 * (BLOCK_W + CHAIN_GAP) + CONT_W; // 2112
export const START_X = (STAGE_W - CHAIN_TOTAL_W) / 2; // 144
export const CAMP_X = START_X + BLOCK_W + CHAIN_GAP; // 629
export const CONT_X = CAMP_X + BLOCK_W + CHAIN_GAP; // 1114

// Chain y: container handles (vertical center) define the axis; outer
// blocks put their header handles on it (loops/growth-machine alignment).
export const CONT_Y = 80;
export const AXIS_Y = CONT_Y + CONT_H / 2; // 310.75
export const CHAIN_BLOCK_Y = AXIS_Y - SIM_HANDLE_Y; // Start + Campaign tops

// ── Inner Start pill (docs: left 16, top 56 native; px-3 py-1.5, 13px) ──────
export const PILL_X = CONT_X + 16 * S;
export const PILL_Y = CONT_Y + 56 * S;
export const PILL_FONT = 13 * S;
export const PILL_LINE_H = 19.5 * S;
export const PILL_H = PILL_LINE_H + 2 * 6 * S + 2;
export const PILL_W = 90;
export const PILL_HANDLE_W = 7 * S;
export const PILL_HANDLE_H = 16 * S;

// ── The lane (inside the container) ─────────────────────────────────────────
export const CALL_X = CONT_X + LANE_LEAD_IN;
export const LOG_X = CALL_X + BLOCK_W + LANE_PITCH_GAP;

const BODY_CENTER = CONT_Y + CONT_HEADER_H + BODY_PAD + FAN_STACK / 2;
export const LANE_TOP = BODY_CENTER - LANE_BLOCK_H / 2;

// Ghost instance targets (runtime fan): one pair above, one below.
const GHOST_TOP_A = LANE_TOP - LANE_GAP - GHOST_H;
const GHOST_TOP_B = LANE_TOP + LANE_BLOCK_H + LANE_GAP;
const GHOST_ANCHOR = LANE_TOP + (LANE_BLOCK_H - GHOST_H) / 2; // stacked behind lane

export type GhostId = "a" | "b";
/** Ghost pair top for fan progress (0 = hidden behind the lane, 1 = fanned). */
export const ghostTop = (g: GhostId, fan: number) => {
	const target = g === "a" ? GHOST_TOP_A : GHOST_TOP_B;
	return GHOST_ANCHOR + (target - GHOST_ANCHOR) * fan;
};
/** Edge axis of a ghost pair (header handle, SIM_HANDLE_Y from top). */
export const ghostHandleY = (g: GhostId, fan: number) => ghostTop(g, fan) + SIM_HANDLE_Y;
export const LANE_HANDLE_Y = LANE_TOP + SIM_HANDLE_Y;

// ── Edges (handles protrude 8 native = 12) ──────────────────────────────────
const HANDLE_OUT = 8 * S;

/** Edge 1: Start → Campaign (straight, on axis). */
export const EDGE1 = {
	x1: START_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: CAMP_X - HANDLE_OUT,
};
/** Edge 2: Campaign → container target handle (straight, on axis). */
export const EDGE2 = {
	x1: CAMP_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: CONT_X - HANDLE_OUT,
};
/** Pill → lane/ghost first block (smooth-step). */
export const pillEdge = (y2: number) => ({
	x1: PILL_X + PILL_W + HANDLE_OUT,
	y1: PILL_Y + PILL_H / 2,
	x2: CALL_X - HANDLE_OUT,
	y2,
});
/** Lane edge: Call → Log outcome (straight at the lane/ghost axis). */
export const laneEdge = (y: number) => ({
	x1: CALL_X + BLOCK_W + HANDLE_OUT,
	y,
	x2: LOG_X - HANDLE_OUT,
});

// ── The aside band (separate boxes — never inside the container) ────────────
export const PANEL_W = 360;
export const PANEL_H = 640;
export const PANEL_GAP = 34;
const PANELS_SPAN = 3 * PANEL_W + 2 * PANEL_GAP; // 1148

export const TABLE_SCALE = 2; // SimTable native ×2 (module-2 derivation)
const TABLE_NATIVE_W = 40 + 3 * 160; // rownum + 3 columns
export const TABLE_W = TABLE_NATIVE_W * TABLE_SCALE; // 1040
const TABLE_NATIVE_H = 34 + 3 * 36; // header + 3 rows
export const TABLE_H = TABLE_NATIVE_H * TABLE_SCALE; // 284

const BAND_GAP = 86; // panels ↔ table
const BAND_SPAN = PANELS_SPAN + BAND_GAP + TABLE_W; // 2274

export const BAND_X = (STAGE_W - BAND_SPAN) / 2; // 63
export const BAND_Y = 645; // container bottom 541.5 + clear air

export const panelX = (i: 0 | 1 | 2) => BAND_X + i * (PANEL_W + PANEL_GAP);
export const PANEL_Y = BAND_Y;

export const TABLE_X = BAND_X + PANELS_SPAN + BAND_GAP; // 1297
export const TABLE_Y = BAND_Y + (PANEL_H - TABLE_H) / 2; // centered on the band

// ── Cameras ──────────────────────────────────────────────────────────────────
/** Home: the whole stage exactly fills the viewport. */
export const CAM_HOME: Cam = {px: CENTER_X, py: STAGE_H / 2, s: 0.8};
/** Scene 1–2 open: the workflow band, closer. */
export const CAM_WORK: Cam = {px: CENTER_X, py: AXIS_Y, s: 0.9};
/** Scene 4: lean toward panel 1 (workflow edge stays in frame above). */
export const CAM_PANEL1: Cam = {px: panelX(0) + PANEL_W / 2 + 210, py: 880, s: 1.06};
/** Scene 7 ease-back target. */
export const CAM_OUT: Cam = {px: CENTER_X, py: STAGE_H / 2, s: 0.775};
