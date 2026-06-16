// Shared layout for the Subworkflows video. ONE geometry for every world:
// the child canvas (scenes 1, 4), the parent canvas (scenes 2–5) and the
// outer canvas (scene 6) all place their chains at the series blockX /
// CHAIN_Y slots (module-1/5/6/webhooks geometry), so the fold/unfold —
// the video's one move — always targets the same center slot.
//
// The dot grid is a single static background at identity in every scene
// (the universal canvas); only chains transform. That keeps boundaries
// trivially pixel-identical and avoids dots-inside-dots during folds.

import {SIM_BLOCK_W, SIM_HANDLE_Y, simBlockHeight} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// ── The chain slots — identical geometry to module-1/5/6/webhooks ───────────
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

// ── Fold / unfold targets (the center slot, blockX(1)) ──────────────────────
// A "fold" shrinks a whole world (1920×1080 at identity) into a Workflow
// block's footprint; the inverse "push" drives the camera through the block
// until the inner world sits at identity. Both are transforms of unchanged
// layouts (scene-grammar zoom-through), parameterized 0..1.

const SLOT_CX = blockX(1) + BLOCK_W / 2; // 960 — chains are centered

/** Center of the header-only Workflow block (fold target, scenes 2 & 6). */
export const SLOT_HEADER_CENTER = {x: SLOT_CX, y: CHAIN_Y + simBlockHeight(0) / 2};
/** Center of the configured 2-row Workflow block (fold target, scene 5). */
export const SLOT_BLOCK_CENTER = {x: SLOT_CX, y: CHAIN_Y + simBlockHeight(2) / 2};

/** World scale when fully folded: the stage fits the block width. */
export const FOLD_K = BLOCK_W / STAGE_W;

/**
 * Fold transform: p=0 → identity; p=1 → the world, scaled about its center,
 * lands centered on `target`. Apply to a full-stage absolutely-positioned
 * wrapper (transformOrigin "0 0").
 */
export const foldTransform = (target: {x: number; y: number}, p: number): string => {
	const k = 1 + (FOLD_K - 1) * p;
	const cx = CENTER_X + (target.x - CENTER_X) * p;
	const cy = CENTER_Y + (target.y - CENTER_Y) * p;
	return `translate(${cx - k * CENTER_X}px, ${cy - k * CENTER_Y}px) scale(${k})`;
};

/** Camera push: z=0 → identity; z=1 → the 2-row Workflow block fills the
 *  frame (module-1 zoom-into math over the unchanged layout). */
export const PUSH_Z = 5.4;
export const pushTransform = (z: number): string => {
	const s = 1 + (PUSH_Z - 1) * z;
	const tx = (CENTER_X - SLOT_BLOCK_CENTER.x * PUSH_Z) * z;
	const ty = (CENTER_Y - SLOT_BLOCK_CENTER.y * PUSH_Z) * z;
	return `translate(${tx}px, ${ty}px) scale(${s})`;
};

// ── The inside panel (scenes 4–5): the child shown BENEATH the call ─────────
// Director's revision of the original zoom-through: the parent chain glides
// up and HOLDS (the call visibly halted, ring live), while a container panel
// — the loops video's "block that holds blocks" grammar, indigo, headed with
// the Workflow chip + the child's name — expands downward from the Workflow
// block. The child runs inside it at 0.8×. A solid stem from the block's
// bottom edge to the panel header carries the containment ("this panel IS
// that block's inside").

export const RAISE_DY = 300;
export const RAISED_CHAIN_Y = CHAIN_Y - RAISE_DY; // 170

const WF_BLOCK_H = simBlockHeight(2); // the configured 2-row Workflow block
export const STEM_X = blockX(1) + BLOCK_W / 2; // 960
export const STEM_TOP = (raise: number) => CHAIN_Y - RAISE_DY * raise + WF_BLOCK_H;

export const PANEL_W = 1560;
export const PANEL_X = (STAGE_W - PANEL_W) / 2; // 180
export const PANEL_Y = RAISED_CHAIN_Y + WF_BLOCK_H + 48; // stem length 48
export const PANEL_H = 1010 - PANEL_Y;
export const PANEL_HEADER_H = 60;

// Child world placed in the panel body: standard chain geometry, scaled.
export const CHILD_SCALE = 0.8;
const CHILD_CENTER_SRC_Y = CHAIN_Y + simBlockHeight(2) / 2;
const PANEL_BODY_CY = PANEL_Y + PANEL_HEADER_H + (PANEL_H - PANEL_HEADER_H) / 2;
export const CHILD_TX = CENTER_X - CHILD_SCALE * CENTER_X;
export const CHILD_TY = PANEL_BODY_CY - CHILD_SCALE * CHILD_CENTER_SRC_Y;
