// Shared layout for the Agent Economy video. The set piece is the Scout
// chain (Start → Agent "Scout" → Response) at module-1/5/6 block geometry,
// shifted right to open a caller column on the left edge: the product's own
// MCP client list (Cursor, Claude Code, Claude Desktop, VS Code, Sim)
// renders as badges there, each with a smooth-step spoke into the entry's
// target handle. The partner server (the flip direction) sits top-right
// with a spoke out of the Agent's source handle.

import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// ── The chain ───────────────────────────────────────────────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
const CHAIN_PITCH = 480;

export const CHAIN_X = 400;
export const CHAIN_Y = 470;

export const blockX = (i: 0 | 1 | 2) => CHAIN_X + i * CHAIN_PITCH; // 400 880 1360
export const CHAIN_EDGE_Y = CHAIN_Y + SIM_HANDLE_Y; // 500

const HANDLE_OUT = 12;
export const edgeX1 = (i: 0 | 1) => blockX(i) + BLOCK_W + HANDLE_OUT;
export const edgeX2 = (i: 0 | 1) => blockX((i + 1) as 1 | 2) - HANDLE_OUT;

// ── Client badges (the callers' column, left edge) ──────────────────────────
// Slot order is the product's MCP Client picker order, top to bottom:
// 0 Cursor · 1 Claude Code · 2 Claude Desktop · 3 VS Code · 4 Sim.
export const BADGE_W = 230;
export const BADGE_H = 64;
export const BADGE_X = 56;
const BADGE_PITCH = 150;

export const badgeCenterY = (slot: number) => CHAIN_EDGE_Y + (slot - 2) * BADGE_PITCH;
export const badgeTop = (slot: number) => badgeCenterY(slot) - BADGE_H / 2;

// Spokes: badge right edge → the entry's target handle.
export const SPOKE_X1 = BADGE_X + BADGE_W + 6; // 292
export const SPOKE_X2 = blockX(0) - HANDLE_OUT; // 388

// ── The MCP tool pill above the entry ───────────────────────────────────────
export const PILL = {cx: blockX(0) + BLOCK_W / 2, y: CHAIN_Y - 110};

// ── The partner server (their deployed agent), top-right ───────────────────
export const PARTNER = {x: 1500, y: 140, w: 250, h: 64};
// Spoke out of the Agent's source handle: short hop right into the
// agent↔response channel, up, then right into the partner badge.
export const PARTNER_SPOKE = {
	x1: edgeX1(1), // 1267 — the Agent's source handle (shared with edge 2)
	y1: CHAIN_EDGE_Y,
	xm: (blockX(1) + BLOCK_W + blockX(2)) / 2, // 1307.5 — the channel center
	y2: PARTNER.y + PARTNER.h / 2, // 172
	x2: PARTNER.x - 8, // 1492
};

// Camera helper (module-1 convention): maps stage point P to viewport center.
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: CENTER_X - px * s,
	ty: CENTER_Y - py * s,
});
