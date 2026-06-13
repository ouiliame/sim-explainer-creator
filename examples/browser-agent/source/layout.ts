// Shared layout for the browser-agent video ("The Agent With Hands").
// One set piece: the docs-shaped chain (Start → Research → Response, the
// BUILD_AGENT_WORKFLOW pattern at module-5 geometry) above a four-slot
// evidence rail — the filmstrip the run fills up. Scene 5's live-session
// viewport rect and its fold target (rail slot 4) live here too, so the
// fold lands pixel-exact on the slot every scene reads.

import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// ── The chain (same pitch as modules 1/5 so the series reads as one world) ──
export const BLOCK_W = SIM_BLOCK_W; // 375
const CHAIN_PITCH = 510;
const CHAIN_W = 2 * CHAIN_PITCH + BLOCK_W; // 1395

export const CHAIN_X = (STAGE_W - CHAIN_W) / 2; // 262.5
export const CHAIN_Y = 250;

export const blockX = (i: 0 | 1 | 2) => CHAIN_X + i * CHAIN_PITCH;
export const CHAIN_EDGE_Y = CHAIN_Y + SIM_HANDLE_Y;

const HANDLE_OUT = 12;
export const edgeX1 = (i: 0 | 1) => blockX(i) + BLOCK_W + HANDLE_OUT;
export const edgeX2 = (i: 0 | 1) => blockX((i + 1) as 1 | 2) - HANDLE_OUT;

// ── The evidence rail (the filmstrip) ───────────────────────────────────────
export const CARD_W = 330;
export const CARD_H = 200;
export const CARD_GAP = 36;
const RAIL_W = 4 * CARD_W + 3 * CARD_GAP; // 1428
export const RAIL_X = (STAGE_W - RAIL_W) / 2; // 246
export const RAIL_Y = 660;
export const slotX = (i: 0 | 1 | 2 | 3) => RAIL_X + i * (CARD_W + CARD_GAP);
export const slotRect = (i: 0 | 1 | 2 | 3) => ({
	x: slotX(i),
	y: RAIL_Y,
	w: CARD_W,
	h: CARD_H,
});

// ── Scene 5 — the live-session viewport ─────────────────────────────────────
// Same aspect as a rail slot (330×200 ×2.3) so the fold is a uniform scale.
export const VIEW_SCALE = 2.3;
export const VIEW_W = CARD_W * VIEW_SCALE; // 759
export const VIEW_H = CARD_H * VIEW_SCALE; // 460
export const VIEW_RECT = {
	x: (STAGE_W - VIEW_W) / 2, // 580.5
	y: 552,
	w: VIEW_W,
	h: VIEW_H,
};
