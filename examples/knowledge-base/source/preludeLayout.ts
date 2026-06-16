import type {SourceKind} from "../../components";
import {STAGE_H, STAGE_W} from "./layout";

// Shared layout for the problem-exposition prelude (scenes 1-4, played before
// the mechanism section).

export type SourceSpec = {
	kind: SourceKind;
	label: string;
	subtitle?: string;
	x: number;
	y: number;
	size: "sm" | "md" | "lg";
	appearAt: number;
};

// 8 source cards arranged around the screen edges so the KB (placed in the
// center later) has clear breathing room. Top row of 3, two on the sides,
// bottom row of 3.
export const SOURCES: SourceSpec[] = [
	{kind: "notion", label: "Notion", subtitle: "company wiki", x: 160, y: 160, size: "md", appearAt: 0.4},
	{kind: "docs", label: "Google Docs", subtitle: "drafts & briefs", x: 850, y: 160, size: "md", appearAt: 0.7},
	{kind: "pdf", label: "Whitepaper.pdf", subtitle: "research", x: 1440, y: 160, size: "md", appearAt: 1.0},
	{kind: "airtable", label: "Airtable", subtitle: "ops database", x: 60, y: 540, size: "md", appearAt: 2.0},
	{kind: "sheets", label: "Sheets", subtitle: "models & data", x: 1640, y: 540, size: "md", appearAt: 2.3},
	{kind: "slides", label: "Pitch deck", subtitle: "Q4 review", x: 160, y: 880, size: "md", appearAt: 2.6},
	{kind: "gmail", label: "Inbox", subtitle: "customer threads", x: 850, y: 880, size: "md", appearAt: 2.9},
	{kind: "md", label: "README.md", subtitle: "engineering notes", x: 1440, y: 880, size: "md", appearAt: 3.2},
];

export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

// Prompt box (centered — focal element of ContextOverloadScene).
export const PROMPT_W = 780;
export const PROMPT_H = 280;
export const PROMPT_X = CENTER_X - PROMPT_W / 2;
export const PROMPT_Y = CENTER_Y - PROMPT_H / 2;

// Search bar (KF8-9 — transitional "search is the missing move" beat).
export const SEARCH_W = 640;
export const SEARCH_H = 88;
export const SEARCH_X = CENTER_X - SEARCH_W / 2;
export const SEARCH_Y = CENTER_Y - SEARCH_H / 2;

// Knowledge base container (KF10+) — centered, large.
export const PRELUDE_KB_W = 720;
export const PRELUDE_KB_H = 480;
export const PRELUDE_KB_X = CENTER_X - PRELUDE_KB_W / 2;
export const PRELUDE_KB_Y = CENTER_Y - PRELUDE_KB_H / 2;

// Distributed landing targets inside the KB so streamed sources don't stack.
// One target per source — same array order as SOURCES.
const KB_INNER_PAD = 80;
const KB_INNER_X = PRELUDE_KB_X + KB_INNER_PAD;
// Row 0 sits below the KB header; row 1 sits above the bottom search row.
const KB_INNER_Y = PRELUDE_KB_Y + 177;
const KB_INNER_W = PRELUDE_KB_W - 2 * KB_INNER_PAD;
const KB_INNER_H = 86; // 56 chip + 30 gap between row 0 and row 1
const COLS = 4;
const ROWS = 2;
export const KB_LANDING: Array<{x: number; y: number}> = Array.from({length: 8}).map((_, i) => {
	const col = i % COLS;
	const row = Math.floor(i / COLS);
	return {
		x: KB_INNER_X + (col / (COLS - 1)) * KB_INNER_W - 28, // 28 ≈ half landing chip width
		y: KB_INNER_Y + (row / Math.max(1, ROWS - 1)) * KB_INNER_H - 28,
	};
});

// Indices of sources highlighted as "relevant" during the search beat.
export const HIGHLIGHTED_SOURCES = [0, 1, 5]; // Notion, Docs, Pitch deck
