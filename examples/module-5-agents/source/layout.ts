// Shared layout for the Agents module (v2). The set piece is the docs'
// lead-scorer example chain (Start → Score lead → Response) at the same
// geometry as module-1's canvas, so the two videos read as the same world.
// Scene 4 adds a block lane above; scene 9 widens to the 5-block lead scorer
// under a zoomed-out camera.

import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// ── The chain (scenes 1–8), identical geometry to module-1 ──────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
const CHAIN_PITCH = 510;
const CHAIN_W = 2 * CHAIN_PITCH + BLOCK_W;

export const CHAIN_X = (STAGE_W - CHAIN_W) / 2;
export const CHAIN_Y = 470;

export const blockX = (i: 0 | 1 | 2) => CHAIN_X + i * CHAIN_PITCH;
export const CHAIN_EDGE_Y = CHAIN_Y + SIM_HANDLE_Y;

const HANDLE_OUT = 12;
export const edgeX1 = (i: 0 | 1) => blockX(i) + BLOCK_W + HANDLE_OUT;
export const edgeX2 = (i: 0 | 1) => blockX((i + 1) as 1 | 2) - HANDLE_OUT;

// Camera helper (same as module-1): maps stage point P to viewport center.
export const cameraTo = (px: number, py: number, s: number) => ({
	tx: CENTER_X - px * s,
	ty: CENTER_Y - py * s,
});

// ── Scene 4 — the deterministic block lane above the chain ──────────────────
export const LANE_Y = 150;
export const LANE_EDGE_Y = LANE_Y + SIM_HANDLE_Y;

// ── Scene 5 — the skill card beside the agent ───────────────────────────────
export const SKILL_CARD = {x: blockX(1) + BLOCK_W + 70, y: CHAIN_Y + 180, w: 360};

// ── Scenes 6/7 — tiles below the canvas (KB, memory store) ──────────────────
export const BELOW_TILE = {w: 340, h: 96};
export const BELOW_TILE_POS = {x: blockX(1) + (BLOCK_W - BELOW_TILE.w) / 2, y: 850};

// ── Scene 9 — the full lead scorer (5 blocks) under a pulled-back camera ────
// Virtual positions exceed the stage at scale 1; the camera settles at ZOOM9
// around the stage center so everything fits.
export const ZOOM9 = 0.74;
const FINAL5_W = 4 * CHAIN_PITCH + BLOCK_W; // 2415
export const final5X = (i: 0 | 1 | 2 | 3 | 4) => CENTER_X - FINAL5_W / 2 + i * CHAIN_PITCH;
export const final5EdgeX1 = (i: number) => final5X(i as 0) + BLOCK_W + HANDLE_OUT;
export const final5EdgeX2 = (i: number) => final5X((i + 1) as 1) - HANDLE_OUT;
