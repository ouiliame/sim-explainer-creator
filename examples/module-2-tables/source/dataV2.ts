// Content for the Tables v2 cut. Nothing here is newly invented — see
// script-v2.md "Grounding note" for the full trace. In short:
//
// - The table is the docs' running `leads` example
//   (~/sim/sim/apps/docs/content/docs/en/tables/using-in-workflows.mdx);
//   companies + industries are this repo's authored demo content (data.ts);
//   `unprocessed` / `qualified` are the docs' verbatim filter/set values;
//   written categories use data.ts's authored segment vocabulary, the same
//   vocabulary as the docs' authored agent output ({ category: "enterprise" }).
// - The chain is TABLE_ROUNDTRIP_WORKFLOW from
//   ~/sim/sim/apps/docs/components/workflow-preview/examples.ts, verbatim.

import type {SimColumn} from "../../components";

export const LEADS_COLUMNS: SimColumn[] = [
	{name: "company", type: "text"},
	{name: "industry", type: "text"},
	{name: "category", type: "text"},
	{name: "status", type: "text"},
];

export const CATEGORY_COL = 2;
export const STATUS_COL = 3;

export const LEADS = [
	{company: "Acme Co", industry: "SaaS", category: "mid-market"},
	{company: "Bluefin", industry: "Fintech", category: "enterprise"},
	{company: "Cortex AI", industry: "AI", category: "startup"},
	{company: "Delta Labs", industry: "Biotech", category: "enterprise"},
	{company: "Evergreen", industry: "Energy", category: "mid-market"},
];

export const STATUS_BEFORE = "unprocessed"; // docs: Filter status = 'unprocessed'
export const STATUS_AFTER = "qualified"; // docs: Set category, status = 'qualified'

// Chain rows — TABLE_ROUNDTRIP_WORKFLOW verbatim.
export const QUERY_ROWS = [
	{title: "Operation", value: "Query Rows"},
	{title: "Filter", value: "status = 'unprocessed'"},
];
export const UPDATE_ROWS = [
	{title: "Operation", value: "Update Rows"},
	{title: "Set", value: "category, status = 'qualified'"},
];
export const CLASSIFY_TAG = "<table.rows>";
/** What the tag resolves to on screen: the docs bundle's `rows: array` +
 *  `rowCount: 5`, collapsed to row width. The full value is the lit range
 *  in the table above (module-5's truncation rule). */
export const CLASSIFY_TAG_VALUE = "[5 rows]";
