// Shared layout for the Module 8 — Workspaces / Credentials / Permissions video.
// The "boundary box" is the persistent element across the whole runtime, so its
// geometry lives here and every scene reads from it. Adjacent scenes must enter
// where the previous left off — interpolate, never teleport.

import type {ObjectKind} from "../../components";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// ── The boundary box ────────────────────────────────────────────────────────
// A single centered box in the establishing beats. Later beats place two
// boxes side by side; those positions are derived from this one.
export const BOUNDARY_W = 900;
export const BOUNDARY_H = 620;
export const BOUNDARY_X = (STAGE_W - BOUNDARY_W) / 2;
export const BOUNDARY_Y = (STAGE_H - BOUNDARY_H) / 2 + 10;

// ── Inside-the-box object grid (what-lives-inside) ──────────────────────────
// 4 columns × 2 rows of compact tiles, inset within the boundary.
export const INSIDE_TILE_W = 176;
export const INSIDE_TILE_H = 150;
const INSIDE_GAP_X = 28;
const INSIDE_GAP_Y = 28;
const INSIDE_COLS = 4;
const INSIDE_ROWS = 2;
const INSIDE_GRID_W = INSIDE_COLS * INSIDE_TILE_W + (INSIDE_COLS - 1) * INSIDE_GAP_X;
const INSIDE_GRID_H = INSIDE_ROWS * INSIDE_TILE_H + (INSIDE_ROWS - 1) * INSIDE_GAP_Y;
const INSIDE_GRID_X = BOUNDARY_X + (BOUNDARY_W - INSIDE_GRID_W) / 2;
const INSIDE_GRID_Y = BOUNDARY_Y + (BOUNDARY_H - INSIDE_GRID_H) / 2 + 26;

export type InsideKind = ObjectKind | "credential";

export const INSIDE_GRID: {kind: InsideKind; x: number; y: number; appearAt: number}[] = [
	{kind: "workflow", ...insideCell(0, 0), appearAt: 0.3},
	{kind: "table", ...insideCell(1, 0), appearAt: 0.5},
	{kind: "file", ...insideCell(2, 0), appearAt: 0.7},
	{kind: "knowledge", ...insideCell(3, 0), appearAt: 0.9},
	{kind: "tool", ...insideCell(0, 1), appearAt: 1.1},
	{kind: "logs", ...insideCell(1, 1), appearAt: 1.3},
	{kind: "deployment", ...insideCell(2, 1), appearAt: 1.5},
	{kind: "credential", ...insideCell(3, 1), appearAt: 1.7},
];

export const INSIDE_TILE = {w: INSIDE_TILE_W, h: INSIDE_TILE_H};

function insideCell(col: number, row: number) {
	return {
		x: INSIDE_GRID_X + col * (INSIDE_TILE_W + INSIDE_GAP_X),
		y: INSIDE_GRID_Y + row * (INSIDE_TILE_H + INSIDE_GAP_Y),
	};
}

// ── Two-box layout (personal vs team) ───────────────────────────────────────
// Two narrower boxes flanking the stage center.
export const TWO_BOX_W = 720;
export const TWO_BOX_H = 540;
export const TWO_BOX_Y = (STAGE_H - TWO_BOX_H) / 2 + 20;
const TWO_BOX_GAP = 120;
export const TWO_BOX_LEFT_X = (STAGE_W - (TWO_BOX_W * 2 + TWO_BOX_GAP)) / 2;
export const TWO_BOX_RIGHT_X = TWO_BOX_LEFT_X + TWO_BOX_W + TWO_BOX_GAP;

// ── Credentials geometry (Video 2) ──────────────────────────────────────────
// A single box sits left-of-center; external services sit to its right, outside.
export const CRED_BOX_W = 760;
export const CRED_BOX_H = 560;
export const CRED_BOX_X = 200;
export const CRED_BOX_Y = (STAGE_H - CRED_BOX_H) / 2 + 10;

export const SERVICES = ["slack", "google", "api", "db"] as const;
export type ServiceKind = (typeof SERVICES)[number];

// External service nodes stacked on the right.
export const SERVICE_W = 300;
export const SERVICE_H = 96;
export const SERVICE_X = 1340;
const SERVICE_GAP = 36;
const SERVICE_BLOCK_H = SERVICES.length * SERVICE_H + (SERVICES.length - 1) * SERVICE_GAP;
const SERVICE_TOP = (STAGE_H - SERVICE_BLOCK_H) / 2 + 10;
export const serviceY = (i: number) => SERVICE_TOP + i * (SERVICE_H + SERVICE_GAP);

// The gate sits at the boundary edge between box and services.
export const GATE_X = CRED_BOX_X + CRED_BOX_W;
export const GATE_CENTER_Y = STAGE_H / 2 + 10;

// ── Roles ladder (Video 3) ──────────────────────────────────────────────────
export const ROLES = ["read", "write", "admin", "owner"] as const;
export type RoleKind = (typeof ROLES)[number];

export const ROLE_RUNG_W = 760;
export const ROLE_RUNG_H = 120;
const ROLE_RUNG_GAP = 28;
const ROLE_BLOCK_H = ROLES.length * ROLE_RUNG_H + (ROLES.length - 1) * ROLE_RUNG_GAP;
export const ROLE_X = (STAGE_W - ROLE_RUNG_W) / 2;
const ROLE_TOP = (STAGE_H - ROLE_BLOCK_H) / 2 + 10;
// Ladder is drawn bottom-up: read at the bottom, owner at the top.
export const roleRungY = (i: number) => ROLE_TOP + (ROLES.length - 1 - i) * (ROLE_RUNG_H + ROLE_RUNG_GAP);

// ── Checklist recap (Video 3) ───────────────────────────────────────────────
export const CHECKLIST_ITEMS = [
	"Workspace owned",
	"Credentials customer-owned",
	"Deployments live",
	"Rollback path known",
	"Logs accessible",
	"Resources organized",
	"Handoff notes included",
] as const;
