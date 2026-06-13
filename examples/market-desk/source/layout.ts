// Shared layout for the market-desk video (market-desk-v1). ONE set piece
// for every scene: the `markets` SimTable (top) over the desk chain
// Schedule → Polymarket → Desk container (bottom), with the analyst lane
// (Analyst → Update Board) INSIDE the container — drawn as ONE lane; the
// four ghost instances exist only at runtime fan > 0. Scenes render one
// <Stage/> (scenes/_rig.tsx) and differ only in state props and CAMERA —
// cameraTo transforms of this unchanged geometry. Nothing relayouts, ever.
//
// Geometry sources: table metrics = the product's native table-grid ×2
// (module-2 derivation: 37px row pitch incl. border, 36px header);
// blocks = SimBlock at ×1.5 with the series chain pitch (510); container
// anatomy = the docs' preview-container-node port at swe-fleet
// proportions. ANALYST_H is MEASURED from a rendered frame (the craft
// rule: trust the rasterizer) — see scenes/_rig.tsx.

import {SIM_BLOCK_W, SIM_HANDLE_Y, simBlockHeight} from "../../components/SimBlock";

const S = 1.5;

export const STAGE_W = 2400;
export const STAGE_H = 1500;
export const CENTER_X = STAGE_W / 2; // 1200

// ── The markets table (5 columns × 5 rows, native ×2) ───────────────────────
export const TABLE_SCALE = 2;
export const COL_W = 160 * TABLE_SCALE; // 320
export const ROWNUM_W = 40 * TABLE_SCALE; // 80
export const CELL_H = 37 * TABLE_SCALE; // 74 (pitch incl. border)
export const HEADER_H = 36 * TABLE_SCALE; // 72 (incl. container top border)

export const TABLE_COLS = 5;
export const TABLE_ROWS = 5;
export const TABLE_W = ROWNUM_W + TABLE_COLS * COL_W; // 1680
export const TABLE_H = HEADER_H + TABLE_ROWS * CELL_H; // 442

export const TABLE_X = CENTER_X - TABLE_W / 2; // 360
export const TABLE_Y = 150;

export const cellX = (col: number) => TABLE_X + ROWNUM_W + col * COL_W;
export const cellY = (row: number) => TABLE_Y + HEADER_H + row * CELL_H;
export const tableCenter = () => ({x: CENTER_X, y: TABLE_Y + TABLE_H / 2});

// ── The chain: Schedule → Polymarket → Desk container ───────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
export const CHAIN_PITCH = 510;
export const SCHED_X = 128;
export const POLY_X = SCHED_X + CHAIN_PITCH; // 638
export const CONT_X = POLY_X + CHAIN_PITCH; // 1148

// Container box. Width holds the 2-block lane (lead-in 240 for the fan
// wires + 2×375 blocks + 90 gap + 45 right pad) → chain centered on
// CENTER_X by construction (chain spans 128..2273, center 1200.5).
export const CONT_W = 1125; // → right edge 2273
export const CONT_HEADER_H = 40 * S + 1; // 61 (docs header: py-2 + 24 chip)

// Lane block heights. GHOST_H / UPD_H are simBlockHeight() exact values;
// ANALYST_H (Messages + Model + one-line Tools row with the Exa and
// Perplexity chips) is measured from a rendered frame: 208px (same row
// anatomy as swe-fleet's Engineer — 74 content top + 31.5 + 12 + 31.5 +
// 12 + 33 tools line + 12 bottom pad + 1 border ≈ 207 computed, 208
// rasterized).
export const GHOST_H = simBlockHeight(0); // 62
export const ANALYST_H = 208;
export const LANE_GAP = 24; // mid lane ↔ first ghost
export const GHOST_GAP = 22; // ghost ↔ ghost

// Runtime fan stack (top to bottom): ghost · ghost · MID (Analyst
// height) · ghost · ghost — symmetric about the body center. The ghosts
// exist only at fan > 0; the canvas itself holds ONE lane.
const FAN_STACK = 4 * GHOST_H + 2 * GHOST_GAP + 2 * LANE_GAP + ANALYST_H; // 548

const BODY_PAD = 26;
export const CONT_H = CONT_HEADER_H + BODY_PAD + FAN_STACK + BODY_PAD; // 661
export const CONT_Y = 660;
export const AXIS_Y = CONT_Y + CONT_H / 2; // container handle center (990.5)

// Outer blocks: header handles (top + 30) sit on the container's axis.
export const CHAIN_BLOCK_Y = AXIS_Y - SIM_HANDLE_Y;

// ── Inner Start pill (docs: left 16, top 56 native; px-3 py-1.5, 13px) ──────
export const PILL_X = CONT_X + 16 * S; // 1172
export const PILL_Y = CONT_Y + 56 * S; // 744
export const PILL_FONT = 13 * S;
export const PILL_LINE_H = 19.5 * S;
export const PILL_H = PILL_LINE_H + 2 * 6 * S + 2;
export const PILL_W = 90; // "Start" at 19.5px medium + px-3 — verified on render
export const PILL_HANDLE_W = 7 * S;
export const PILL_HANDLE_H = 16 * S;

// ── Lane x geometry (inside the container) ──────────────────────────────────
export const LANE_PITCH = BLOCK_W + 90; // 465
export const ANA_X = CONT_X + 240; // 1388
export const UPD_X = ANA_X + LANE_PITCH; // 1853

// ── Lane y geometry / the runtime fan ───────────────────────────────────────
const BODY_CENTER = CONT_Y + CONT_HEADER_H + BODY_PAD + FAN_STACK / 2; // ~1021
export const MID_TOP = BODY_CENTER - ANALYST_H / 2; // followed lane top

// Ghost instance TARGET tops (fan = 1), symmetric around the mid lane.
const A1_TOP = MID_TOP - LANE_GAP - GHOST_H; // above, inner
const A2_TOP = A1_TOP - GHOST_GAP - GHOST_H; // above, outer
const B1_TOP = MID_TOP + ANALYST_H + LANE_GAP; // below, inner
const B2_TOP = B1_TOP + GHOST_H + GHOST_GAP; // below, outer

// Ghosts emerge from behind the mid lane (anchored at its vertical center).
const GHOST_ANCHOR_TOP = MID_TOP + (ANALYST_H - GHOST_H) / 2;

export type LaneId = 0 | 1 | 2 | 3 | 4; // top → bottom; 2 = followed lane

/** Lane top for a given fan progress (0 = stacked behind mid, 1 = full fan). */
export const laneTop = (lane: LaneId, fan: number) => {
	if (lane === 2) return MID_TOP;
	const target = lane === 0 ? A2_TOP : lane === 1 ? A1_TOP : lane === 3 ? B1_TOP : B2_TOP;
	return GHOST_ANCHOR_TOP + (target - GHOST_ANCHOR_TOP) * fan;
};

/** Handle y (edge axis) of a lane's blocks. */
export const laneHandleY = (lane: LaneId, fan: number) =>
	laneTop(lane, fan) + (lane === 2 ? SIM_HANDLE_Y : GHOST_H / 2 - 1);

// ── Edges ────────────────────────────────────────────────────────────────────
const HANDLE_OUT = 8 * S; // 12

/** Outer edge 1: Schedule → Polymarket (straight, on the axis). */
export const EDGE1 = {
	x1: SCHED_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: POLY_X - HANDLE_OUT,
};

/** Outer edge 2: Polymarket → the container's target handle. */
export const EDGE2 = {
	x1: POLY_X + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: CONT_X - HANDLE_OUT,
};

/** Inner fan edge: pill source → lane's Analyst target (smooth-step). */
export const pillEdge = (lane: LaneId, fan: number) => ({
	x1: PILL_X + PILL_W + HANDLE_OUT,
	y1: PILL_Y + PILL_H / 2,
	x2: ANA_X - HANDLE_OUT,
	y2: laneHandleY(lane, fan),
});

/** Lane edge: Analyst → Update Board, straight. */
export const laneEdge = (lane: LaneId, fan: number) => ({
	x1: ANA_X + BLOCK_W + HANDLE_OUT,
	y: laneHandleY(lane, fan),
	x2: UPD_X - HANDLE_OUT,
});

// ── The schedule pill (armed state above the entry block) ───────────────────
export const SCHED_PILL = {cx: SCHED_X + BLOCK_W / 2, y: CHAIN_BLOCK_Y - 74};

// ── The editor card (scene 3 zoom-aside; Phase B) ───────────────────────────
export const CARD_W = 560;

// ── Camera ───────────────────────────────────────────────────────────────────
/** Maps stage point P to the viewport center at scale s (1920×1080 view). */
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: 960 - px * s,
	ty: 540 - py * s,
});

export type Cam = {px: number; py: number; s: number};

/** Scene 1: the table, hero-framed. */
export const CAM_TABLE: Cam = {px: CENTER_X, py: tableCenter().y, s: 1.1};
/** The whole set piece (table + chain). The video's home framing.
 *  Content bbox: x 128..2273, y 150..1321 → center (1200.5, 735.5). */
export const CAM_ALL: Cam = {px: 1200, py: 735, s: 0.78};
/** Scene 6: the container, fan-framed. */
export const CAM_CONT: Cam = {px: CONT_X + CONT_W / 2, py: 975, s: 1.05};
/** Scene 7: the followed lane. */
export const CAM_LANE: Cam = {px: (ANA_X + UPD_X + BLOCK_W) / 2, py: BODY_CENTER, s: 1.3};
/** Scene 9 ease-back target. */
export const CAM_OUT: Cam = {px: 1200, py: 735, s: 0.735};
