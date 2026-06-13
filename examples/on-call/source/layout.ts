// Shared layout for on-call-v2. ONE set piece for all scenes: the workflow
// (Sentry Alerts webhook → Triage agent → {Slack, Linear, PagerDuty}) on the
// left, and the rail of real surfaces on the right — the incidents SimTable
// (top) over run 1's record OutputBundle (bottom), as SEPARATE boxes beside
// the workflow (never inside it, never occluding it). Scenes render one
// <Stage/> (scenes/_rig.tsx) and differ only in state props and CAMERA —
// cameraTo transforms of this unchanged geometry. Nothing relayouts, ever.
//
// Geometry sources: blocks = SimBlock at ×1.5 (docs PreviewBlockNode port);
// table = the product's native table-grid ×2 (module-2 derivation); record =
// OutputBundle (docs run-inspector port) at ×1.6 so the rail column-aligns
// with the table (script assumption 8). Agent height MEASURED from a render
// (2 rows + one tool-chip line); other block heights are simBlockHeight()
// exact values.

import {
	SIM_BLOCK_W,
	SIM_HANDLE_Y,
	SIM_TABLE_COL_W,
	SIM_TABLE_HEADER_H,
	SIM_TABLE_ROW_H,
	SIM_TABLE_ROWNUM_W,
	OUTPUT_BUNDLE_W,
	simBlockHeight,
} from "../../components";
import {INCIDENT_COLUMNS, INCIDENTS} from "./data";

const S = 1.5;

// ── Stage ────────────────────────────────────────────────────────────────────
export const STAGE_W = 2860;
export const STAGE_H = 1340;

// ── The right rail (the two real surfaces) ──────────────────────────────────
export const TABLE_SCALE = 2;
export const TABLE_W = (SIM_TABLE_ROWNUM_W + INCIDENT_COLUMNS.length * SIM_TABLE_COL_W) * TABLE_SCALE; // 1040
export const TABLE_H = (SIM_TABLE_HEADER_H + INCIDENTS.length * SIM_TABLE_ROW_H) * TABLE_SCALE; // 500
/** Row pitch incl. border, native ×2 (module-2 derivation: 37px native). */
export const CELL_H = 37 * TABLE_SCALE;

export const RECORD_SCALE = 1.6;
export const RECORD_W = OUTPUT_BUNDLE_W * RECORD_SCALE; // 1024

export const RAIL_X = 1700;
export const TABLE_X = RAIL_X;
export const TABLE_Y = 122;
export const RAIL_GAP = 92;
export const RECORD_X = RAIL_X;
export const RECORD_Y = TABLE_Y + TABLE_H + RAIL_GAP; // 714

// ── The workflow ────────────────────────────────────────────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375

export const WEBHOOK_X = 120;
export const AGENT_X = WEBHOOK_X + BLOCK_W + 140; // 635
export const TERM_X = AGENT_X + BLOCK_W + 160; // 1170

// Block heights (exact-height invariant; AGENT_H measured from a render —
// 2 rows + one tool-chip line).
export const WEBHOOK_H = simBlockHeight(1);
export const TERM_H = simBlockHeight(2);
export const AGENT_H = 215; // measured (growth-machine's identical shape)

/** The workflow's handle axis — webhook/agent/middle-terminal handles align. */
export const AXIS_Y = 670;
export const BLOCKS_Y = AXIS_Y - SIM_HANDLE_Y; // 640

export const TERM_GAP = 104;
/** The terminal stack is centered on the axis (frame balance); the fan
 *  edges smooth-step to each block's own handle. */
const TERM_STACK_H = 3 * TERM_H + 2 * TERM_GAP;
const TERM_TOP = AXIS_Y - TERM_STACK_H / 2;
export const TERM_YS = [
	TERM_TOP, // Slack (top)
	TERM_TOP + TERM_H + TERM_GAP, // Linear (middle)
	TERM_TOP + 2 * (TERM_H + TERM_GAP), // PagerDuty (bottom)
] as const;

// ── Edges ────────────────────────────────────────────────────────────────────
const HANDLE_OUT = 8 * S; // 12

/** Edge 1: webhook source → agent target (straight, on the axis). */
export const EDGE1 = {
	x1: WEBHOOK_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: AGENT_X - HANDLE_OUT,
};

/** Fan edge i: agent source → terminal i target (smooth-step). */
export const fanEdge = (i: 0 | 1 | 2) => ({
	x1: AGENT_X + BLOCK_W + HANDLE_OUT,
	y1: AXIS_Y,
	x2: TERM_X - HANDLE_OUT,
	y2: TERM_YS[i] + SIM_HANDLE_Y,
});

// ── Camera ───────────────────────────────────────────────────────────────────
/** Maps stage point P to the viewport center at scale s (1920×1080 view). */
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: 960 - px * s,
	ty: 540 - py * s,
});

export type Cam = {px: number; py: number; s: number};

/** Linear blend between two camera framings (drive m with EASING.inOut). */
export const camLerp = (a: Cam, b: Cam, m: number): Cam => ({
	px: a.px + (b.px - a.px) * m,
	py: a.py + (b.py - a.py) * m,
	s: a.s + (b.s - a.s) * m,
});

/** The whole set piece — the video's home framing. */
export const CAM_ALL: Cam = {px: 1428, py: AXIS_Y, s: 0.665};
/** Scene 1: the incidents table, hero-framed. */
export const CAM_TABLE: Cam = {px: TABLE_X + TABLE_W / 2, py: TABLE_Y + TABLE_H / 2 + 10, s: 1.04};
/** Scene 4: lean toward the agent + the record. */
export const CAM_READ: Cam = {px: 1480, py: AXIS_Y + 60, s: 0.78};
/** Scene 7 ease-back target. */
export const CAM_OUT: Cam = {px: 1428, py: AXIS_Y, s: 0.638};
