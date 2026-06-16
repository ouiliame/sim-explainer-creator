// Shared layout for the Tables v2 cut (`module-2-tables-v2`). ONE stage:
// the `leads` SimTable in the upper half, the docs' table-roundtrip chain
// in the lower half. Every scene renders this same geometry; scenes differ
// only in state props and CAMERA (a transform of the unchanged layout).
//
// Table metrics are the product's native table-grid metrics ×2 (see
// layout.ts of the v1 cut for the derivation): row pitch includes the 1px
// border-b (37px native → 74), the header includes its border-b plus the
// container's top border (36 native → 72).

import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// ── The leads table (4 columns × 5 rows) ────────────────────────────────────
export const TABLE_SCALE = 2;
export const COL_W = 160 * TABLE_SCALE; // 320
export const ROWNUM_W = 40 * TABLE_SCALE; // 80
export const CELL_H = 37 * TABLE_SCALE; // 74 (pitch incl. border)
export const HEADER_H = 36 * TABLE_SCALE; // 72 (incl. container top border)

export const TABLE_COLS = 4;
export const TABLE_ROWS = 5;
export const TABLE_W = ROWNUM_W + TABLE_COLS * COL_W; // 1360
export const TABLE_H = HEADER_H + TABLE_ROWS * CELL_H; // 442

export const TABLE_X = (STAGE_W - TABLE_W) / 2; // 280
export const TABLE_Y = 120;

export const cellX = (col: number) => TABLE_X + ROWNUM_W + col * COL_W;
export const cellY = (row: number) => TABLE_Y + HEADER_H + row * CELL_H;
export const tableCenter = () => ({x: CENTER_X, y: TABLE_Y + TABLE_H / 2});

// ── The roundtrip chain (module-1/5 geometry: pitch 510) ────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
export const CHAIN_PITCH = 510;
const CHAIN_W = 2 * CHAIN_PITCH + BLOCK_W; // 1395

export const CHAIN_X = (STAGE_W - CHAIN_W) / 2; // 262.5
export const CHAIN_Y = 700;

export const blockX = (i: 0 | 1 | 2) => CHAIN_X + i * CHAIN_PITCH;
export const CHAIN_EDGE_Y = CHAIN_Y + SIM_HANDLE_Y;

const HANDLE_OUT = 12;
export const edgeX1 = (i: 0 | 1) => blockX(i) + BLOCK_W + HANDLE_OUT;
export const edgeX2 = (i: 0 | 1) => blockX((i + 1) as 1 | 2) - HANDLE_OUT;

// ── Camera ──────────────────────────────────────────────────────────────────
// Maps stage point (px, py) to the viewport center at scale s; apply as
// `translate(tx, ty) scale(s)` with transform-origin 0 0.
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: CENTER_X - px * s,
	ty: CENTER_Y - py * s,
});

/** Scenes 1–2: the table centered and slightly enlarged. */
export const CAM_TABLE = {px: tableCenter().x, py: tableCenter().y, s: 1.18};
/** Scenes 3–6: identity framing (whole stage). */
export const CAM_ID = {px: CENTER_X, py: CENTER_Y, s: 1};
/** Scene 7 ease-back target. */
export const CAM_OUT = {px: CENTER_X, py: CENTER_Y, s: 0.93};

// ── Record panel (scene 6) ──────────────────────────────────────────────────
export const RECORD_SCALE = 1.7;
export const RECORD_X = (STAGE_W - 640 * RECORD_SCALE) / 2;
export const RECORD_Y = 250;
