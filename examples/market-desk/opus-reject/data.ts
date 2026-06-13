// Authored demo content for market-desk-v1 — see demo-corpus/README.md for
// the full trace. Every on-screen value comes from here. These are
// CLEARLY-AUTHORED DEMO VALUES (plausible prediction markets), NOT a live
// Polymarket feed — the video never claims they are real odds.

import type {SimColumn} from "../../components";

// ── Board columns ────────────────────────────────────────────────────────────
export const BOARD_COLUMNS: SimColumn[] = [
	{name: "question", type: "text"},
	{name: "mkt", type: "number"},
	{name: "est", type: "number"},
	{name: "edge", type: "number"},
];

export const QUESTION_COL = 0;
export const MKT_COL = 1;
export const EST_COL = 2;
export const EDGE_COL = 3;

export type Market = {
	question: string;
	/** Market implied YES probability, % — the base the live tick wobbles around. */
	mkt: number;
	/** The Analyst agent's own probability, %. */
	est: number;
};

/** Row order = board order. The followed instance is row 2 (Starship). */
export const MARKETS: Market[] = [
	{question: "Fed cuts rates in July", mkt: 41, est: 58},
	{question: "GPT-5 ships before October", mkt: 63, est: 67},
	{question: "Starship reaches orbit this quarter", mkt: 72, est: 60},
	{question: "Box office #1 opens above $90M", mkt: 55, est: 52},
	{question: "New AI exec order signed by Q3", mkt: 28, est: 39},
	{question: "Home team wins the division", mkt: 48, est: 51},
];

export const ROW_COUNT = MARKETS.length; // 6
export const FOLLOWED_ROW = 2; // Starship — the camera-traced instance

/** Edge = est − mkt (signed points). */
export const edgeOf = (m: Market) => m.est - m.mkt;

/** |edge| ≥ SIGNAL_THRESHOLD → flag SIGNAL. */
export const SIGNAL_THRESHOLD = 8;
export const isSignal = (m: Market) => Math.abs(edgeOf(m)) >= SIGNAL_THRESHOLD;

/** Signal rows end up on 0, 2, 4 (three of six). */
export const SIGNAL_ROWS = MARKETS.map((m, i) => (isSignal(m) ? i : -1)).filter((i) => i >= 0);

/** Scene-7 finish order for the five non-followed Analysts (scramble —
 *  parallel result order isn't guaranteed, parallel.mdx). Row 2 already
 *  resolved in scene 6. */
export const GHOST_FINISH_ORDER = [4, 0, 5, 1, 3] as const;

/** Signed edge string, e.g. "+17" / "−12" (true minus glyph). */
export const edgeText = (m: Market) => {
	const e = edgeOf(m);
	return (e >= 0 ? "+" : "−") + Math.abs(e);
};

// ── The live tick ────────────────────────────────────────────────────────────
// Each market's displayed mkt % wobbles ±~1.5 pts around its base, as a pure
// deterministic function of the ABSOLUTE frame (so it never jumps at a cut
// and the same frame always renders the same value). Per-row phase + speed
// make the columns shimmer independently — the board reads "alive".
export const liveMkt = (row: number, frame: number): number => {
	const base = MARKETS[row].mkt;
	const phase = row * 1.7;
	const speed = 0.06 + (row % 3) * 0.012;
	const wob = 1.5 * Math.sin(frame * speed + phase) + 0.6 * Math.sin(frame * speed * 2.3 + phase);
	return Math.round(base + wob);
};

// ── Block row values (registry-verbatim; script grounding) ───────────────────
export const SCHED_ROWS = [
	{title: "Run frequency", value: "Daily"},
	{title: "Time", value: "9:00 AM"},
];

export const PULL_ROWS = [{title: "Operation", value: "Get Markets"}];

export const ANALYST_MODEL = "claude-sonnet-4.6";

// The Analyst's Messages reference (resolves to the followed market).
export const CURRENT_ITEM_TAG = "<desk.currentItem>";
export const CURRENT_ITEM_VALUE = MARKETS[FOLLOWED_ROW].question;

// The container's Parallel Items reference (the editor card, scene 3).
export const ITEMS_REF = "<pull.markets>";

// ── The schedule pill caption ────────────────────────────────────────────────
export const SCHED_PHRASE = "At 9:00 AM";
export const NEXT_BEFORE = "Jun 13, 9:00 AM";
export const NEXT_AFTER = "Jun 14, 9:00 AM";
