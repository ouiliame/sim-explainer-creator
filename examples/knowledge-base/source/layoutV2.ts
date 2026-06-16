// Shared layout for Knowledge Base v2. The set piece is the docs' own
// SUPPORT_KB_WORKFLOW (Start → Knowledge → Agent) at the SAME canvas
// geometry as module-1/module-5, so the whole series reads as one world.
// Every overlay (KB panel, chat aside, run record) anchors through helpers
// here — scenes never hardcode geometry.

import {SIM_BLOCK_W, SIM_HANDLE_Y} from "../../components/SimBlock";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// ── The chain (all scenes) — identical geometry to module-1/module-5 ───────
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

// ── Scenes 2–4 — the knowledge-base aside above the chain ───────────────────
export const KB_PANEL = {x: 370, y: 64, w: 1180, h: 376};
const KB_PAD = 24;
const KB_HEADER_H = 40;
const KB_HEADER_GAP = 16;

// Content region inside the panel chrome.
export const KB_CONTENT_TOP = KB_PANEL.y + KB_PAD + KB_HEADER_H + KB_HEADER_GAP;

// Document rows: 4 visible (of 17). Centered column in scene 2; they glide
// to the left column in scene 3 to make room for the passages.
export const DOC_W = 440;
export const DOC_H = 56;
export const DOC_PITCH = 68;
export const DOC_X_CENTER = KB_PANEL.x + (KB_PANEL.w - DOC_W) / 2;
export const DOC_X_LEFT = KB_PANEL.x + KB_PAD;
export const docY = (i: number) => KB_CONTENT_TOP + i * DOC_PITCH;
// Interpolated doc-column x (0 = centered, 1 = left).
export const docX = (slide: number) => DOC_X_CENTER + (DOC_X_LEFT - DOC_X_CENTER) * slide;

// Passage (chunk) cards: two per document, beside its row.
export const CHUNK_W = 300;
export const CHUNK_GAP = 16;
const CHUNK_COL_X = DOC_X_LEFT + DOC_W + 36;
export const chunkX = (j: 0 | 1) => CHUNK_COL_X + j * (CHUNK_W + CHUNK_GAP);
export const chunkY = (i: number) => docY(i) + 4;

// ── Scene 5 — the agent's chat aside (left of the Agent block) ──────────────
export const CHAT_PANEL = {x: 640, y: 380, w: 580};

// ── Scene 6 — the run record, centered (module-5 metrics) ───────────────────
export const RECORD_SCALE = 1.7;
export const RECORD_X = (STAGE_W - 640 * RECORD_SCALE) / 2;
export const RECORD_Y = 200;
