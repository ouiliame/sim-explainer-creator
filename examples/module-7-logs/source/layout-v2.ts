// Shared geometry for the module-7 v2 take (`module-7-logs-v2`).
//
// ONE set piece for all five scenes: the real beaming-polaris triage chain
// (Start → Triage → BuildRow → LogTicket — see module-5's
// demo-corpus/triage-run.md) rendered as 4 SimBlocks scaled 0.86 as a unit,
// plus the OutputBundle record panel beneath it. The chain starts
// frame-center (scene 1), glides ONCE to the top (scene 2) and never moves
// again; the panel is persistent from scene 2 to the end. Scenes import
// these helpers and never hardcode positions.

import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";
import {OUTPUT_BUNDLE_W} from "../../components/OutputBundle";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// ── The chain (local coordinate space, scaled as a unit) ─────────────────────
export const BLOCK_W = SIM_BLOCK_W; // 375
export const CHAIN_PITCH = 510; // module-1/5 pitch — same world
export const CHAIN_BLOCKS = 4;
export const CHAIN_W = (CHAIN_BLOCKS - 1) * CHAIN_PITCH + BLOCK_W; // 1905
export const CHAIN_SCALE = 0.86; // 4 blocks don't fit at 1× — scale the UNIT

/** Block x inside the chain's local (unscaled) space. */
export const blockLX = (i: 0 | 1 | 2 | 3) => i * CHAIN_PITCH;
export const CHAIN_EDGE_LY = SIM_HANDLE_Y; // 30, local

const HANDLE_OUT = 12;
export const edgeLX1 = (i: 0 | 1 | 2) => blockLX(i) + BLOCK_W + HANDLE_OUT;
export const edgeLX2 = (i: 0 | 1 | 2) => blockLX((i + 1) as 1 | 2 | 3) - HANDLE_OUT;

/** Stage x of the scaled chain wrapper (centered). */
export const CHAIN_LEFT = Math.round((STAGE_W - CHAIN_W * CHAIN_SCALE) / 2); // 141

/** Chain wrapper y: scene 1 frames it center; scenes 2–5 hold it at top.
 *  Scene 2 interpolates glide 0→1 exactly once. */
export const CHAIN_Y_CENTER = 432;
export const CHAIN_Y_TOP = 56;
export const chainY = (glide: number) =>
	CHAIN_Y_CENTER + (CHAIN_Y_TOP - CHAIN_Y_CENTER) * glide;

// ── The record panel (OutputBundle, persistent scenes 2–5) ──────────────────
export const PANEL_SCALE = 1.62;
export const PANEL_W = OUTPUT_BUNDLE_W * PANEL_SCALE; // 1036.8
export const PANEL_X = Math.round((STAGE_W - PANEL_W) / 2); // 442
export const PANEL_Y = 348;
/** Native px — just above the Triage full tree's measured height (≈385,
 *  measured from a rendered frame); pins the panel body so the outline never
 *  pops while trees dip-swap. */
export const PANEL_MIN_BODY_H = 386;

// ── Shared state conventions ────────────────────────────────────────────────
/** Non-focal dim multiplier — BlockVis.dim 1 → opacity 0.35 (docs value). */
export const DIM_FULL = 1;
