// Shared positions and sizes used across multiple scenes so each scene's exit
// state matches the next scene's enter state — no visual flip on cut.

import type {DocKind} from "../../components";

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// Scene 2: row of KBs
export const KB_SMALL_W = 400;
export const KB_SMALL_H = 240;
export const KB_ROW_Y = (STAGE_H - KB_SMALL_H) / 2;
// 4 tiles × 400 + 3 gaps × 32 = 1696, centered with 112 margin each side
export const KB_ROW_XS = [112, 544, 976, 1408];
export const FOCAL_KB_INDEX = 1;

// Scene 3 end → Scene 4 → Scene 5 start: enlarged KB centered
export const KB_LARGE_W = 1280;
export const KB_LARGE_H = 800;
export const KB_LARGE_X = (STAGE_W - KB_LARGE_W) / 2;
export const KB_LARGE_Y = (STAGE_H - KB_LARGE_H) / 2;

// Where each doc sits inside the large KB (Scene 4 resting state, Scene 5 entry state).
export const DOC_IN_KB_W = KB_LARGE_W - 48; // 24px padding each side
export const DOC_IN_KB_H = 96;
export const DOC_IN_KB_X = KB_LARGE_X + 24;
// Height of the KB chrome above content: padding (24) + header (~32) + gap (16) + section label (~36)
export const KB_HEADER_REGION = 116;
export const DOC_LIST_TOP = KB_LARGE_Y + KB_HEADER_REGION;
export const DOC_ROW_PITCH = DOC_IN_KB_H + 12;
export const docInKbY = (i: number) => DOC_LIST_TOP + i * DOC_ROW_PITCH;

// Scene 5 end → Scene 6 → Scene 7 start: zoomed-in doc
export const DOC_LARGE_W = 880;
export const DOC_LARGE_H = 96;
export const DOC_LARGE_X = (STAGE_W - DOC_LARGE_W) / 2;
export const DOC_LARGE_Y = 220;

// Chunks layout below the zoomed doc (scenes 6, 7)
export const CHUNK_W = 240;
export const CHUNK_GAP = 32;
export const CHUNK_COUNT = 5;
export const CHUNKS_TOTAL_W = CHUNK_COUNT * CHUNK_W + (CHUNK_COUNT - 1) * CHUNK_GAP;
export const CHUNKS_START_X = (STAGE_W - CHUNKS_TOTAL_W) / 2;
export const CHUNKS_TOP = DOC_LARGE_Y + DOC_LARGE_H + 120;

// Scene 9 onward: KB shrinks and slides right, QueryBox enters on left
// Tall enough to hold 12 chunks in 2 cols × 6 rows.
export const KB_QUERY_W = 700;
export const KB_QUERY_H = 720;
export const KB_QUERY_X = 1120;
export const KB_QUERY_Y = (STAGE_H - KB_QUERY_H) / 2;

export const QUERY_W = 640;
export const QUERY_H = 88;
export const QUERY_X = 160;
export const QUERY_Y = (STAGE_H - QUERY_H) / 2;
export const QUERY_CENTER_Y = QUERY_Y + QUERY_H / 2;

// Chunks inside the KB at QUERY position (scenes 9-11). Layout is 2 cols × 6 rows = 12 chunks.
export const KB_CHUNK_W = 280;
export const KB_CHUNK_H = 56;
export const KB_CHUNK_GAP = 10;
export const KB_CHUNK_COLS = 2;
export const KB_CONTENT_X = KB_QUERY_X + 24;
export const KB_CONTENT_Y = KB_QUERY_Y + KB_HEADER_REGION;
export const kbChunkX = (i: number) =>
	KB_CONTENT_X + (i % KB_CHUNK_COLS) * (KB_CHUNK_W + KB_CHUNK_GAP);
export const kbChunkY = (i: number) =>
	KB_CONTENT_Y + Math.floor(i / KB_CHUNK_COLS) * (KB_CHUNK_H + KB_CHUNK_GAP);

// Scene 11/12: context panel left, agent middle, output right
export const CTX_X = 140;
export const CTX_Y = 200;
export const CTX_W = 520;
export const CTX_H = 680;

// Where chunks land inside the model-context panel — shared between ContextInjection
// (as the travel target) and Output (as the resting absolute positions).
export const CTX_SLOT_X = CTX_X + 16;
export const CTX_SLOT_Y_START = CTX_Y + 60; // padding + title + gap
export const CTX_SLOT_PITCH = KB_CHUNK_H + 8;

export const AGENT_W = 260;
export const AGENT_H = 170;
export const AGENT_X = 830;
export const AGENT_Y = CTX_Y + CTX_H / 2 - AGENT_H / 2;

export const OUT_X = 1220;
export const OUT_Y = 200;
export const OUT_W = 560;
export const OUT_H = 680;

// The list of documents that lives in the focal KB. Used by Documents, ZoomIntoDoc,
// Chunking, Update, ReturnToKB, Query, RelevantChunks, ContextInjection scenes.
export type DocSpec = {kind: DocKind; name: string; connector?: string};

export const DOCS: DocSpec[] = [
	{kind: "pdf", name: "Q3-report.pdf"},
	{kind: "ntn", name: "Strategy notes", connector: "Notion"},
	{kind: "xls", name: "Forecast-2025.xls", connector: "Drive"},
	{kind: "md", name: "onboarding.md"},
	{kind: "slide", name: "Pitch-v4.slide", connector: "Drive"},
	{kind: "mail", name: "Customer thread", connector: "Gmail"},
];

export const FOCAL_DOC_INDEX = 0;
export const FOCAL_DOC = DOCS[FOCAL_DOC_INDEX];

// Chunks in the focal doc — used by Chunking and downstream scenes.
export type ChunkSpec = {seed: number; lines: number; source: DocKind};

export const FOCAL_CHUNKS: ChunkSpec[] = [
	{seed: 1, lines: 3, source: FOCAL_DOC.kind},
	{seed: 2, lines: 4, source: FOCAL_DOC.kind},
	{seed: 3, lines: 3, source: FOCAL_DOC.kind},
	{seed: 4, lines: 4, source: FOCAL_DOC.kind},
	{seed: 5, lines: 3, source: FOCAL_DOC.kind},
];

// 12 chunks spanning all 6 source docs — tells the story that one KB holds many
// pieces and the retriever picks a *best subset* across them, not just the top N.
export const KB_CHUNKS: ChunkSpec[] = [
	{seed: 1, lines: 3, source: "pdf"},
	{seed: 2, lines: 3, source: "ntn"},
	{seed: 3, lines: 3, source: "xls"},
	{seed: 4, lines: 3, source: "md"},
	{seed: 5, lines: 3, source: "pdf"},
	{seed: 6, lines: 3, source: "slide"},
	{seed: 7, lines: 3, source: "mail"},
	{seed: 8, lines: 3, source: "xls"},
	{seed: 9, lines: 3, source: "ntn"},
	{seed: 10, lines: 3, source: "pdf"},
	{seed: 11, lines: 3, source: "slide"},
	{seed: 12, lines: 3, source: "md"},
];

// Indices spread across the list so retrieval visibly picks a subset, not the top.
export const RELEVANT_CHUNK_INDICES = [1, 6, 10];

// Reranking staging area — vertical stack of 3 chunks centered on the stage.
// Used by RerankingScene (destination of fly-out, then reorder) and ContextInjection
// (starting position of the chunks that travel into model context).
export const RERANK_X = (STAGE_W - KB_CHUNK_W) / 2;
export const RERANK_PITCH = KB_CHUNK_H + 22;
const RERANK_TOTAL_H = 3 * KB_CHUNK_H + 2 * (RERANK_PITCH - KB_CHUNK_H);
export const RERANK_Y_TOP = (STAGE_H - RERANK_TOTAL_H) / 2;
export const rerankY = (slot: number) => RERANK_Y_TOP + slot * RERANK_PITCH;

// Final order of the relevant chunks after reranking — KB indices, top-down.
// Initial order (by similarity) is RELEVANT_CHUNK_INDICES = [1, 6, 10];
// reranking promotes the middle hit and demotes the first.
export const RERANKED_INDICES = [6, 10, 1];

// For each chunk in RELEVANT_CHUNK_INDICES (by initial slot), the slot it ends up in
// after reranking. e.g. chunk 1 is at initial slot 0 → ends at slot 2.
export const RERANK_FINAL_SLOTS = RELEVANT_CHUNK_INDICES.map((kbIdx) =>
	RERANKED_INDICES.indexOf(kbIdx),
);
