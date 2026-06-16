// Shared layout for the custom-tools video. The set piece is module-5's
// Triage chain at the SAME geometry (re-exported below) so the two videos
// read as the same world; the only video-specific geometry is the editor
// panel overlay.

import {TOOL_EDITOR_W} from "../../components";

export {
	STAGE_W,
	STAGE_H,
	CENTER_X,
	CENTER_Y,
	BLOCK_W,
	CHAIN_X,
	CHAIN_Y,
	blockX,
	CHAIN_EDGE_Y,
	edgeX1,
	edgeX2,
	cameraTo,
} from "../module-5-agents/layout";

// ── The Create Agent Tool editor (scenes 2–4) ───────────────────────────────
// Native 800 wide, ~668 tall (measured from a render); scaled as a unit and
// centered on the 1920×1080 stage.
export const PANEL_SCALE = 1.4;
export const PANEL_W = TOOL_EDITOR_W * PANEL_SCALE; // 1120
export const PANEL_X = (1920 - PANEL_W) / 2; // 400
export const PANEL_Y = 72;
