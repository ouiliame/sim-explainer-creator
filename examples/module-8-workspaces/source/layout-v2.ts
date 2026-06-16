// Shared geometry for Module 8 v2 — the workspace boundary cut.
// ONE set piece: the workspace panel. It has exactly two homes (centered for
// the bookends, left for the comparison/credential beats) and glides between
// them inside scenes 3 and 6 — never across a cut. Everything that attaches
// to the panel (tile grid, ring-dot anchors, the padlock port, the account
// label) is expressed RELATIVE to the panel x so it rides along for free.

import type {ObjectKind} from "../../components";
import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// ── The workspace panel (the set piece) ─────────────────────────────────────
export const PANEL_W = 1000;
export const PANEL_H = 620;
export const PANEL_Y = 230;
export const PANEL_HOME_X = (STAGE_W - PANEL_W) / 2; // 460 — scenes 1, 2, 6-end
export const PANEL_LEFT_X = 120; // scenes 3, 4, 5

export const WORKSPACE_LABEL = "beaming-polaris"; // real workspace (module-5 artifacts)

// ── Object tiles inside (2×2, relative to panel origin) ─────────────────────
export const TILE_W = 220;
export const TILE_H = 180;
const TILE_GAP = 56;
const GRID_W = 2 * TILE_W + TILE_GAP; // 496
const GRID_OFF_X = (PANEL_W - GRID_W) / 2; // 252
const GRID_OFF_Y = 120;

export const TILES: {kind: ObjectKind; relX: number; relY: number}[] = [
	{kind: "workflow", relX: GRID_OFF_X, relY: GRID_OFF_Y},
	{kind: "table", relX: GRID_OFF_X + TILE_W + TILE_GAP, relY: GRID_OFF_Y},
	{kind: "knowledge", relX: GRID_OFF_X, relY: GRID_OFF_Y + TILE_H + TILE_GAP},
	{kind: "file", relX: GRID_OFF_X + TILE_W + TILE_GAP, relY: GRID_OFF_Y + TILE_H + TILE_GAP},
];

// Tile centers (absolute, given a panel x) — zoom target + reach target.
export const tileCenter = (panelX: number, i: number) => ({
	x: panelX + TILES[i].relX + TILE_W / 2,
	y: PANEL_Y + TILES[i].relY + TILE_H / 2,
});

// ── Members docked on the boundary ring (top edge) ──────────────────────────
export const MEMBER_SIZE = 56;
export const MEMBER_RING_Y = PANEL_Y; // dots straddle the top border
export const MEMBER_REL_X = [660, 760, 860]; // dot centers, relative to panel x

// ── The padlock port on the right edge + the held account label ─────────────
export const PORT_D = 92;
export const PORT_REL_X = PANEL_W; // port center sits ON the right border
export const PORT_Y = PANEL_Y + PANEL_H / 2; // 540
// Account identity settles inside the panel, left of the port.
// Centered in the clear band between the tile grid (ends at rel 748) and the
// port chip (inner edge rel 954) — measured against rendered tile corners.
export const ACCOUNT_REL_X = PANEL_W - 149; // text center, relative to panel x
export const ACCOUNT_Y = PORT_Y;
export const ACCOUNT_TEXT = "waleed@company.com"; // docs displayName example

// ── External services (Gmail / Drive / Calendar), fixed at stage right ──────
export const SERVICE_W = 320;
export const SERVICE_H = 110;
export const SERVICE_X = 1420;
const SERVICE_GAP = 40;
export const SERVICES = ["gmail", "drive", "calendar"] as const;
export type ServiceId = (typeof SERVICES)[number];
const SERVICE_STACK_H = SERVICES.length * SERVICE_H + (SERVICES.length - 1) * SERVICE_GAP;
export const serviceTop = (i: number) => PORT_Y - SERVICE_STACK_H / 2 + i * (SERVICE_H + SERVICE_GAP);
export const serviceCenterY = (i: number) => serviceTop(i) + SERVICE_H / 2;

// ── The other workspace (scene 3 only) ──────────────────────────────────────
export const SECOND_X = 1310;
export const SECOND_Y = 290;
export const SECOND_W = 500;
export const SECOND_H = 500;
export const SECOND_TILE_W = 220;
export const SECOND_TILE_H = 180;
export const SECOND_TILE_X = SECOND_X + (SECOND_W - SECOND_TILE_W) / 2;
export const SECOND_TILE_Y = SECOND_Y + (SECOND_H - SECOND_TILE_H) / 2 + 14;
export const SECOND_MEMBER_X = [SECOND_X + 340, SECOND_X + 410];

// The blocked reach: from the other workflow's left edge toward OUR table
// tile center (panel at LEFT) — stopped dead at our right border.
export const REACH_FROM = {x: SECOND_TILE_X, y: SECOND_TILE_Y + SECOND_TILE_H / 2 + 8};
export const reachTarget = () => tileCenter(PANEL_LEFT_X, 1);
export const REACH_STOP_X = PANEL_LEFT_X + PANEL_W; // our boundary

// ── Scene 5 canvas: CREDENTIAL_SHARE_WORKFLOW at ×1.5 (docs positions) ──────
export const CHAIN_X = 488;
export const CHAIN_Y = 330;
const K = 1.5;
export const CRED_POS = {x: CHAIN_X + 0, y: CHAIN_Y + 100 * K};
export const TARGET_POS = [
	{x: CHAIN_X + 380 * K, y: CHAIN_Y + 0}, // gmail
	{x: CHAIN_X + 380 * K, y: CHAIN_Y + 100 * K}, // drive
	{x: CHAIN_X + 380 * K, y: CHAIN_Y + 200 * K}, // calendar
];
const HANDLE_OUT = 12; // handles protrude 8 native × 1.5
export const CRED_EDGE_FROM = {x: CRED_POS.x + SIM_BLOCK_W + HANDLE_OUT, y: CRED_POS.y + SIM_HANDLE_Y};
export const credEdgeTo = (i: number) => ({x: TARGET_POS[i].x - HANDLE_OUT, y: TARGET_POS[i].y + SIM_HANDLE_Y});

// Camera target for the zoom-through (the Workflow tile, panel at LEFT).
export const ZOOM_TARGET = tileCenter(PANEL_LEFT_X, 0);
export const ZOOM_SCALE = 5;
// Camera transform mapping stage point (px, py) to viewport center at scale s.
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: STAGE_W / 2 - px * s,
	ty: STAGE_H / 2 - py * s,
});
