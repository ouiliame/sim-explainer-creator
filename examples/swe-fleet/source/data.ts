// Authored demo content for swe-fleet-v1 — see demo-corpus/README.md for
// the full trace. Every on-screen value comes from here.

import type {SimCell, SimColumn} from "../../components";

export const BACKLOG_COLUMNS: SimColumn[] = [
	{name: "issue", type: "text"},
	{name: "status", type: "text"},
	{name: "pr", type: "text"},
];

export const ISSUE_COL = 0;
export const STATUS_COL = 1;
export const PR_COL = 2;

export type Issue = {issue: string; pr: string};

/** Row order = table order. PR numbers are assigned in FINISH order
 *  (3, 5, 1, 4, 2 — parallel result order isn't guaranteed; docs). */
export const ISSUES: Issue[] = [
	{issue: "OAuth redirect loop", pr: "#484"},
	{issue: "Webhook null user", pr: "#486"},
	{issue: "CSV export crash", pr: "#482"},
	{issue: "Search debounce", pr: "#485"},
	{issue: "S3 upload retries", pr: "#483"},
];

export const STATUS_BEFORE = "open";
export const STATUS_AFTER = "done";

/** Scene-8 finish order for the four ghost lanes (rows; row 2 = the
 *  followed lane, already done in scene 7). */
export const GHOST_FINISH_ORDER = [4, 0, 3, 1] as const;

/** Builds the table cell matrix for a given per-row flip mix (0 = before,
 *  1 = after; text switches at 0.5 — DipSwap semantics, the dip itself is
 *  carried by cellTextOpacity in the rig). */
export const backlogRows = (flipMix: (row: number) => number): SimCell[][] =>
	ISSUES.map((it, r) => {
		const mix = flipMix(r);
		return [
			{text: it.issue},
			{text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER},
			{text: mix < 0.5 ? "" : it.pr},
		];
	});

// ── Block row values (registry/template-verbatim; script grounding) ─────────
export const SCHED_ROWS = [
	{title: "Run Frequency", value: "Daily"},
	{title: "Time", value: "12:00 AM"},
];

export const QUERY_ROWS = [
	{title: "Operation", value: "Query Rows"},
	{title: "Filter", value: "status = 'open'"},
];

export const GH_ROWS = [
	{title: "Operation", value: "Create pull request"},
	{title: "Repository", value: "acme/api"},
];

export const MD_ROWS = [
	{title: "Operation", value: "Update Row by ID"},
	{title: "Row Data", value: '{"status": "done", …}'},
];

export const ENG_MODEL = "claude-sonnet-4.6";
export const CURRENT_ITEM_TAG = "<parallel.currentItem>";
export const CURRENT_ITEM_VALUE = "[row 3]";
export const ITEMS_REF = "<getissues.rows>";

// ── The armed schedule pill (cronstrue phrase + schedule-info format) ───────
export const SCHED_PHRASE = "At 12:00 AM";
export const NEXT_BEFORE = "Mar 18, 12:00 AM";
export const NEXT_AFTER = "Mar 19, 12:00 AM";
