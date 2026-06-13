// Shared layout for market-desk-v1. ONE set piece for all 8 scenes: the
// `markets` SimTable (top) over the desk chain Schedule → Pull Markets →
// Desk container (bottom), with the research lane (a single Analyst block
// with three tool chips) and its five fan ghosts INSIDE the container.
// Scenes render one <Stage/> (scenes/_rig.tsx) and differ only in state
// props and CAMERA — cameraTo transforms of this unchanged geometry.
// Nothing relayouts, ever.
//
// Geometry sources: board metrics = the product's native table-grid ×2
// (module-2 / swe-fleet derivation: 37px row pitch incl. border, 36px
// header); blocks = SimBlock at ×1.5 with the chain pitch (510); container
// anatomy = the docs' preview-container-node (loops-v1 / swe-fleet rig) at
// desk proportions. ANALYST_H is MEASURED from a rendered frame (the craft
// rule: trust the rasterizer), see the comment below.

import {SIM_BLOCK_W, SIM_HANDLE_Y, simBlockHeight} from "../../components/SimBlock";
import {ROW_COUNT} from "./data";

const S = 1.5;

export const STAGE_W = 2820;
export const STAGE_H = 1560;
export const CENTER_X = STAGE_W / 2; // 1410

// ── The markets board (4 columns × 6 rows, native ×2) ────────────────────────
export const TABLE_SCALE = 2;
export const COL_W = 160 * TABLE_SCALE; // 320 — but we override per-column below
export const ROWNUM_W = 40 * TABLE_SCALE; // 80
export const CELL_H = 37 * TABLE_SCALE; // 74 (pitch incl. border)
export const HEADER_H = 36 * TABLE_SCALE; // 72

// The `question` column is wide; mkt/est/edge are narrow numeric columns.
// SimTable uses a uniform 160px native column; we keep that for the numeric
// columns and let the question column be wider via a custom width vector the
// rig passes through (SimTable supports a colWidths prop? — no; instead we
// keep uniform 160 and the question text ellipsizes. To keep questions
// legible we render the board at a generous uniform width.)
export const BOARD_COLS = 4;
export const BOARD_ROWS = ROW_COUNT; // 6

// Column widths (native): question wide, the three numeric columns narrow.
export const QCOL_W = 300 * TABLE_SCALE; // 600
export const NCOL_W = 120 * TABLE_SCALE; // 240
export const COL_WIDTHS = [QCOL_W, NCOL_W, NCOL_W, NCOL_W];
export const colLeft = (col: number) => {
	let x = ROWNUM_W;
	for (let i = 0; i < col; i++) x += COL_WIDTHS[i];
	return x;
};

export const TABLE_W = ROWNUM_W + COL_WIDTHS.reduce((a, b) => a + b, 0); // 80+600+720 = 1400
export const TABLE_H = HEADER_H + BOARD_ROWS * CELL_H; // 72 + 6*74 = 516

export const TABLE_X = CENTER_X - TABLE_W / 2; // 710
export const TABLE_Y = 120;

export const cellX = (col: number) => TABLE_X + colLeft(col);
export const cellW = (col: number) => COL_WIDTHS[col];
export const cellY = (row: number) => TABLE_Y + HEADER_H + row * CELL_H;
export const boardCenter = () => ({x: CENTER_X, y: TABLE_Y + TABLE_H / 2});

// ── The chain: Schedule → Pull Markets → Desk container ──────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
export const CHAIN_PITCH = 510;
// Chain centered under the board: total chain width (Schedule → container
// right edge) = 2160; board center = CENTER_X (1410); so SCHED_X places the
// chain span symmetric about the board (330 → 2490).
export const SCHED_X = 330;
export const PULL_X = SCHED_X + CHAIN_PITCH; // 840
export const CONT_X = PULL_X + CHAIN_PITCH; // 1350

// Container box. Width holds the lead-in (for the fanned pill wires) + one
// Analyst block + right pad. Height holds the six-lane fan (derived below).
export const CONT_W = 1140; // → right edge 2310
export const CONT_HEADER_H = 40 * S + 1; // 61

// Lane block heights. GHOST_H = header-only; ANALYST_H = the expanded
// Analyst (Messages + Model + a TWO-LINE Tools row: Exa/Perplexity wrap,
// Serper on line 2). MEASURED from a render at fan-full: ~252px. Generous
// gaps clear the wrap so the expanded lane never overlaps its ghosts.
export const GHOST_H = simBlockHeight(0); // 62
export const ANALYST_H = 252;
export const LANE_GAP = 44; // mid lane ↔ first ghost (clears the chip wrap)
export const GHOST_GAP = 26; // ghost ↔ ghost

// Fan stack (top to bottom): two ghosts above the MID, three below.
// 6 lanes total: ghost·ghost·MID·ghost·ghost·ghost (followed = index 2).
const GHOSTS_ABOVE = 2;
const GHOSTS_BELOW = 3;
const FAN_STACK =
	GHOSTS_ABOVE * GHOST_H +
	(GHOSTS_ABOVE - 1) * GHOST_GAP +
	LANE_GAP +
	ANALYST_H +
	LANE_GAP +
	GHOSTS_BELOW * GHOST_H +
	(GHOSTS_BELOW - 1) * GHOST_GAP;

const BODY_PAD = 26;
export const CONT_H = CONT_HEADER_H + BODY_PAD + FAN_STACK + BODY_PAD;
export const CONT_Y = 690;
export const AXIS_Y = CONT_Y + CONT_H / 2; // container handle center

// Outer blocks: header handles (top + 30) sit on the container's axis.
export const CHAIN_BLOCK_Y = AXIS_Y - SIM_HANDLE_Y;

// ── Inner Start pill (docs: left 16, top 56 native; px-3 py-1.5, 13px) ───────
export const PILL_X = CONT_X + 16 * S; // 1194
export const PILL_Y = CONT_Y + 56 * S; // 824
export const PILL_FONT = 13 * S;
export const PILL_LINE_H = 19.5 * S;
export const PILL_H = PILL_LINE_H + 2 * 6 * S + 2;
export const PILL_W = 90;
export const PILL_HANDLE_W = 7 * S;
export const PILL_HANDLE_H = 16 * S;

// ── Lane x geometry (inside the container) ───────────────────────────────────
export const ANALYST_X = CONT_X + 240; // 1410

// ── Lane y geometry / the fan ────────────────────────────────────────────────
const BODY_CENTER = CONT_Y + CONT_HEADER_H + BODY_PAD + FAN_STACK / 2;
export const MID_TOP = BODY_CENTER - ANALYST_H / 2; // followed lane top

// Six lanes (index 0..5), followed = 2. Symmetric-ish stack.
export type LaneId = 0 | 1 | 2 | 3 | 4 | 5;
export const LANE_IDS: LaneId[] = [0, 1, 2, 3, 4, 5];
export const GHOST_LANES: LaneId[] = [0, 1, 3, 4, 5];

// Target tops at fan = 1.
const A1_TOP = MID_TOP - LANE_GAP - GHOST_H; // lane 1 (above, inner)
const A2_TOP = A1_TOP - GHOST_GAP - GHOST_H; // lane 0 (above, outer)
const B1_TOP = MID_TOP + ANALYST_H + LANE_GAP; // lane 3 (below, inner)
const B2_TOP = B1_TOP + GHOST_H + GHOST_GAP; // lane 4
const B3_TOP = B2_TOP + GHOST_H + GHOST_GAP; // lane 5

const TARGET_TOP: Record<LaneId, number> = {
	0: A2_TOP,
	1: A1_TOP,
	2: MID_TOP,
	3: B1_TOP,
	4: B2_TOP,
	5: B3_TOP,
};

// Ghosts emerge from behind the mid lane (anchored at its vertical center).
const GHOST_ANCHOR_TOP = MID_TOP + (ANALYST_H - GHOST_H) / 2;

/** Lane top for a given fan progress (0 = stacked behind mid, 1 = full fan). */
export const laneTop = (lane: LaneId, fan: number) => {
	if (lane === 2) return MID_TOP;
	return GHOST_ANCHOR_TOP + (TARGET_TOP[lane] - GHOST_ANCHOR_TOP) * fan;
};

/** Handle y (edge axis) of a lane's block. */
export const laneHandleY = (lane: LaneId, fan: number) =>
	laneTop(lane, fan) + (lane === 2 ? SIM_HANDLE_Y : GHOST_H / 2 - 1);

// ── Edges ────────────────────────────────────────────────────────────────────
const HANDLE_OUT = 8 * S; // 12

/** Outer edge 1: Schedule → Pull Markets (straight, on the axis). */
export const EDGE1 = {
	x1: SCHED_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: PULL_X - HANDLE_OUT,
};

/** Outer edge 2: Pull Markets → the container's target handle. */
export const EDGE2 = {
	x1: PULL_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: CONT_X - HANDLE_OUT,
};

/** Inner fan edge: pill source → lane's Analyst target. */
export const pillEdge = (lane: LaneId, fan: number) => ({
	x1: PILL_X + PILL_W + HANDLE_OUT,
	y1: PILL_Y + PILL_H / 2,
	x2: ANALYST_X - HANDLE_OUT,
	y2: laneHandleY(lane, fan),
});

// ── The schedule pill (armed state above the entry block) ────────────────────
export const SCHED_PILL = {cx: SCHED_X + BLOCK_W / 2, y: CHAIN_BLOCK_Y - 74};

// ── The editor card (scene 3 zoom-aside) ─────────────────────────────────────
export const CARD_W = 560;

// ── Camera ───────────────────────────────────────────────────────────────────
/** Maps stage point P to the viewport center at scale s (1920×1080 view). */
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: 960 - px * s,
	ty: 540 - py * s,
});

export type Cam = {px: number; py: number; s: number};

/** Scene 1: the board, hero-framed. */
export const CAM_BOARD: Cam = {px: CENTER_X, py: boardCenter().y, s: 1.18};
/** The whole set piece (board + chain). The video's home framing — centered
 *  on the union of board (top) and the tall Desk container (bottom). */
export const CAM_ALL: Cam = {px: CENTER_X, py: 820, s: 0.64};
/** Scene 5: the container, fan-framed. */
export const CAM_CONT: Cam = {px: CONT_X + CONT_W / 2, py: AXIS_Y, s: 0.92};
/** Scene 6: the followed Analyst lane (lean in on the expanded researcher). */
export const CAM_LANE: Cam = {px: ANALYST_X + BLOCK_W / 2, py: BODY_CENTER, s: 1.55};
/** Scene 8 ease-back target. */
export const CAM_OUT: Cam = {px: CENTER_X, py: 820, s: 0.6};
