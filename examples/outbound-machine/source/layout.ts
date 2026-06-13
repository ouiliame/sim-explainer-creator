// Shared layout for the outbound-machine video (outbound-machine-v1). ONE
// set piece for all 8 scenes: the `outbound` SimTable (top band, the grid
// pane the run writes into) over the machine chain Apollo → Enrich
// (Parallel container holding the per-lead lane Data Enrichment →
// Personalize → Instantly) → Table (the write-back block), with the lane's
// four fan ghosts INSIDE the container. Scenes render one <Stage/>
// (scenes/_rig.tsx) and differ only in state props and CAMERA — cameraTo
// transforms of this unchanged geometry. Nothing relayouts, ever.
//
// Geometry sources: table metrics = the product's native table-grid ×2
// (module-2 derivation: 37px row pitch incl. border, 36px header), with
// per-column widths (the message column is wide for the 2-line copy — the
// product's columns ARE user-resizable). Blocks = SimBlock at ×1.5 with the
// swe-fleet chain pitch; container anatomy = the docs preview-container-node
// (loops/uc-data-enrichment rig) at machine proportions. Lane block heights
// are simBlockHeight() exact values; ENG_H is MEASURED from a render
// (growth-machine derivation, same blocks).

import {SIM_BLOCK_W, SIM_HANDLE_Y, simBlockHeight} from "../../components/SimBlock";

const S = 1.5;

// ── The outbound table (6 columns × 6 rows of pane, native ×2) ──────────────
export const TABLE_SCALE = 2;
export const ROWNUM_W = 40 * TABLE_SCALE; // 80
export const CELL_H = 37 * TABLE_SCALE; // 74 (pitch incl. border)
export const HEADER_H = 36 * TABLE_SCALE; // 72 (incl. container top border)

// Per-column native widths (×TABLE_SCALE applied by SimTable). Message is
// wide (2-line copy); status narrow; the rest the product default-ish.
export const COL_NATIVE_W = [120, 150, 130, 150, 330, 90]; // company/contact/title/signal/message/status
export const COL_W = COL_NATIVE_W.map((w) => w * TABLE_SCALE); // px in stage space

export const TABLE_COLS = 6;
export const TABLE_ROWS = 6; // pane height in rows; rows LAND into the pane
export const TABLE_W = ROWNUM_W + COL_W.reduce((a, b) => a + b, 0); // 80 + 1940 = 2020
export const TABLE_H = HEADER_H + TABLE_ROWS * CELL_H; // 72 + 444 = 516

// Stage sized so the table (hero) and the 3-element chain (below) both fit.
export const STAGE_W = 2960;
export const STAGE_H = 1640;
export const CENTER_X = STAGE_W / 2; // 1480

export const TABLE_X = CENTER_X - TABLE_W / 2; // 470
export const TABLE_Y = 130;

/** Left edge (stage x) of column `col`'s content. */
export const colX = (col: number) => {
	let x = TABLE_X + ROWNUM_W;
	for (let i = 0; i < col; i++) x += COL_W[i];
	return x;
};
export const cellY = (row: number) => TABLE_Y + HEADER_H + row * CELL_H;
export const tableCenter = () => ({x: CENTER_X, y: TABLE_Y + TABLE_H / 2});

// ── The chain: Apollo → Enrich container → Table ─────────────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375

// Container box. Width holds the 3-block lane (lead-in 240 for the fanned
// pill wires + 3×375 blocks + 2×96 gaps + 45 right pad).
export const LANE_PITCH = BLOCK_W + 96; // 471
export const CONT_HEADER_H = 40 * S + 1; // 61

export const GHOST_H = simBlockHeight(0); // 62
// ENG_H: the followed-lane blocks each have 2 config rows. Data Enrichment
// has a provider tool chip too — measured 215 from a growth-machine render
// (same block, same rows). Personalize/Instantly are simBlockHeight(2).
export const LANE_BLOCK_H = simBlockHeight(2); // 168.5 (2 rows, no tools)
export const ENG_H = 215; // Data Enrichment: 2 rows + provider tools line (measured)
export const LANE_GAP = 26; // mid lane ↔ first ghost
export const GHOST_GAP = 22; // ghost ↔ ghost

// Fan stack (top to bottom): ghost · ghost · MID · ghost · ghost — symmetric
// about the body center.
const FAN_STACK = 4 * GHOST_H + 2 * GHOST_GAP + 2 * LANE_GAP + ENG_H; // 248+44+52+215 = 559

const BODY_PAD = 28;
export const CONT_W = 240 + 3 * BLOCK_W + 2 * 96 + 45 + 32; // lead-in + 3 blocks + 2 gaps + pads = 1634
export const CONT_H = CONT_HEADER_H + BODY_PAD + FAN_STACK + BODY_PAD; // 61 + 28 + 559 + 28 = 676

// Place the chain below the table with a comfortable gap, centered.
export const CONT_Y = TABLE_Y + TABLE_H + 150; // 130 + 516 + 150 = 796
export const AXIS_Y = CONT_Y + CONT_H / 2; // container handle center (1134)

// Chain x: center the whole chain (Apollo + gap + container + gap + Table).
const CHAIN_GAP = 150; // block ↔ container, both sides
const CHAIN_TOTAL_W = 2 * BLOCK_W + 2 * CHAIN_GAP + CONT_W; // 375+150+1634+150+375 = 2684
export const CHAIN_X0 = CENTER_X - CHAIN_TOTAL_W / 2; // 138
export const APOLLO_LEFT = CHAIN_X0; // 138
export const CONT_X = CHAIN_X0 + BLOCK_W + CHAIN_GAP; // 663
export const WB_X = CONT_X + CONT_W + CHAIN_GAP; // 2447 — the Table block

// Outer blocks (Apollo, Table): header handle (top + 30) sits on the axis.
export const CHAIN_BLOCK_Y = AXIS_Y - SIM_HANDLE_Y;
export const WB_H = simBlockHeight(3); // Table block: 3 config rows

// ── Inner Start pill (docs: left 16, top 56 native; px-3 py-1.5, 13px) ──────
export const PILL_X = CONT_X + 16 * S; // CONT_X + 24
export const PILL_Y = CONT_Y + 56 * S; // CONT_Y + 84
export const PILL_FONT = 13 * S;
export const PILL_LINE_H = 19.5 * S;
export const PILL_H = PILL_LINE_H + 2 * 6 * S + 2;
export const PILL_W = 90;
export const PILL_HANDLE_W = 7 * S;
export const PILL_HANDLE_H = 16 * S;

// ── Lane x geometry (inside the container) ──────────────────────────────────
export const ENG_X = CONT_X + 240; // Data Enrichment (903)
export const PERS_X = ENG_X + LANE_PITCH; // Personalize (1374)
export const SEND_X = PERS_X + LANE_PITCH; // Instantly (1845)

// ── Lane y geometry / the fan ───────────────────────────────────────────────
export const BODY_CENTER = CONT_Y + CONT_HEADER_H + BODY_PAD + FAN_STACK / 2;
export const MID_TOP = BODY_CENTER - ENG_H / 2; // followed lane top

const A1_TOP = MID_TOP - LANE_GAP - GHOST_H; // above, inner
const A2_TOP = A1_TOP - GHOST_GAP - GHOST_H; // above, outer
const B1_TOP = MID_TOP + ENG_H + LANE_GAP; // below, inner
const B2_TOP = B1_TOP + GHOST_H + GHOST_GAP; // below, outer

const GHOST_ANCHOR_TOP = MID_TOP + (ENG_H - GHOST_H) / 2;

export type LaneId = 0 | 1 | 2 | 3 | 4; // top → bottom; 2 = followed lane

/** Lane top for a given fan progress (0 = stacked behind mid, 1 = full fan). */
export const laneTop = (lane: LaneId, fan: number) => {
	if (lane === 2) return MID_TOP;
	const target = lane === 0 ? A2_TOP : lane === 1 ? A1_TOP : lane === 3 ? B1_TOP : B2_TOP;
	return GHOST_ANCHOR_TOP + (target - GHOST_ANCHOR_TOP) * fan;
};

/** Handle y (edge axis) of a lane's blocks. The followed lane's blocks
 *  align their header handle (SIM_HANDLE_Y from top); ghosts center. */
export const laneHandleY = (lane: LaneId, fan: number) =>
	laneTop(lane, fan) + (lane === 2 ? SIM_HANDLE_Y : GHOST_H / 2 - 1);

// ── Edges ────────────────────────────────────────────────────────────────────
const HANDLE_OUT = 8 * S; // 12

/** Outer edge 1: Apollo → the container's target handle. */
export const EDGE1 = {
	x1: APOLLO_LEFT + BLOCK_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: CONT_X - HANDLE_OUT,
};

/** Outer edge 2: the container's source handle → the Table block. */
export const EDGE2 = {
	x1: CONT_X + CONT_W + HANDLE_OUT,
	y: AXIS_Y,
	x2: WB_X - HANDLE_OUT,
};

/** Inner fan edge: pill source → lane's first block target (smooth-step). */
export const pillEdge = (lane: LaneId, fan: number) => ({
	x1: PILL_X + PILL_W + HANDLE_OUT,
	y1: PILL_Y + PILL_H / 2,
	x2: ENG_X - HANDLE_OUT,
	y2: laneHandleY(lane, fan),
});

/** Lane edge A (Data Enrichment → Personalize) and B (Personalize → Send). */
export const laneEdgeA = (lane: LaneId, fan: number) => ({
	x1: ENG_X + BLOCK_W + HANDLE_OUT,
	y: laneHandleY(lane, fan),
	x2: PERS_X - HANDLE_OUT,
});
export const laneEdgeB = (lane: LaneId, fan: number) => ({
	x1: PERS_X + BLOCK_W + HANDLE_OUT,
	y: laneHandleY(lane, fan),
	x2: SEND_X - HANDLE_OUT,
});

// ── The editor card (scene 3 zoom-aside) ────────────────────────────────────
export const CARD_W = 580;

// ── Camera ───────────────────────────────────────────────────────────────────
/** Maps stage point P to the viewport center at scale s (1920×1080 view). */
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: 960 - px * s,
	ty: 540 - py * s,
});

export type Cam = {px: number; py: number; s: number};

/** Scene 1: the table, hero-framed. */
export const CAM_TABLE: Cam = {px: CENTER_X, py: tableCenter().y, s: 0.86};
/** The whole set piece (table + chain). The video's home framing. */
export const CAM_ALL: Cam = {px: CENTER_X, py: (TABLE_Y + CONT_Y + CONT_H) / 2 + 30, s: 0.62};
/** Scene 5: the followed lane, leaned-in. px = the container's center (the
 *  container is stage-centered) and s chosen so the frame edges crop the
 *  outer WIRES, never through the Apollo / Table blocks (red-team lesson:
 *  no block cut by the frame). */
export const CAM_LANE: Cam = {px: CENTER_X, py: BODY_CENTER, s: 1.04};
/** Scene 8 ease-back target. */
export const CAM_OUT: Cam = {px: CENTER_X, py: (TABLE_Y + CONT_Y + CONT_H) / 2 + 30, s: 0.59};
