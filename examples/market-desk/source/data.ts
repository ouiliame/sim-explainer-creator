// Authored demo content for market-desk-v1 — see demo-corpus/README.md
// for the full trace. Every on-screen value comes from here.

import type {SimCell, SimColumn} from "../../components";

export const BOARD_COLUMNS: SimColumn[] = [
	{name: "market", type: "text"},
	{name: "odds", type: "number"},
	{name: "agent_est", type: "number"},
	{name: "edge", type: "number"},
	{name: "signal", type: "text"},
];

export const MARKET_COL = 0;
export const ODDS_COL = 1;
export const EST_COL = 2;
export const EDGE_COL = 3;
export const SIGNAL_COL = 4;

export type Market = {
	market: string;
	odds: string;
	est: string;
	edge: string;
	signal: string; // "watch" when |edge| >= 0.08, else "—"
};

/** Row order = table order. agent_est is the run's authored output;
 *  edge = agent_est − odds (arithmetic, checked); signal = watch iff
 *  |edge| ≥ 0.08. Research framing only — no trade fields exist. */
export const MARKETS: Market[] = [
	{market: "Fed cut by June", odds: "0.32", est: "0.45", edge: "0.13", signal: "watch"},
	{market: "ETH $5k in 2026", odds: "0.41", est: "0.38", edge: "-0.03", signal: "—"},
	{market: "Avatar 3 tops $2B", odds: "0.12", est: "0.11", edge: "-0.01", signal: "—"},
	{market: "GPT-6 ships in 2026", odds: "0.55", est: "0.71", edge: "0.16", signal: "watch"},
	{market: "La Niña by winter", odds: "0.64", est: "0.60", edge: "-0.04", signal: "—"},
];

/** The followed lane prices row 4 (index 3) in scene 7; scene 8's
 *  scramble finish order for the other four instances (docs: parallel
 *  result order not guaranteed). */
export const FOLLOWED_ROW = 3;
export const GHOST_FINISH_ORDER = [1, 4, 0, 2] as const;

/** Which board row each runtime instance prices (lane 0 = top ghost …
 *  lane 4 = bottom ghost; lane 2 = the followed lane → FOLLOWED_ROW).
 *  Consistent with GHOST_FINISH_ORDER: lanes 0,3,1,4 finish rows
 *  1,4,0,2 — the docs' scrambled order, drawn. */
export const ROW_FOR_LANE = [1, 0, FOLLOWED_ROW, 4, 2] as const;

/** Cell matrix for a per-row fill mix (0 = before: est/edge/signal
 *  empty; 1 = after: priced). Text switches at 0.5 — DipSwap semantics;
 *  the dip itself is carried by cellTextOpacity in the rig. */
export const boardRows = (fillMix: (row: number) => number): SimCell[][] =>
	MARKETS.map((m, r) => {
		const mix = fillMix(r);
		const filled = mix >= 0.5;
		return [
			{text: m.market},
			{text: m.odds},
			{text: filled ? m.est : ""},
			{text: filled ? m.edge : ""},
			{text: filled ? m.signal : ""},
		];
	});

// ── Block row values (registry-verbatim titles; script-v1 grounding) ────────
export const SCHED_ROWS = [
	{title: "Run frequency", value: "Hourly"},
	{title: "Minute", value: "0"},
];

export const POLY_ROWS = [
	{title: "Operation", value: "Get Markets"},
	{title: "Sort By", value: "Volume"},
	{title: "Limit", value: "5"},
];

export const UPDATE_ROWS = [
	{title: "Operation", value: "Upsert Row"},
	{title: "Row Data", value: '{"agent_est": 0.71, …}'},
];

export const ANALYST_MODEL = "claude-sonnet-4.6";
export const CURRENT_ITEM_TAG = "<parallel.currentItem>";
export const CURRENT_ITEM_VALUE = "[GPT-6 ships in 2026]";
export const ITEMS_REF = "<polymarket.markets>";

// ── The armed schedule pill (cronstrue phrase + schedule-info format) ───────
export const SCHED_PHRASE = "Every hour";
export const NEXT_BEFORE = "Jun 12, 3:00 PM";
export const NEXT_AFTER = "Jun 12, 4:00 PM";
