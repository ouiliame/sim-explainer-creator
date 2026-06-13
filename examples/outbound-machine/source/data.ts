// Authored demo content for outbound-machine-v1 — see demo-corpus/README.md
// for the full trace. Every on-screen value comes from here. Block rows are
// registry-verbatim (apps/sim/blocks/blocks/*.ts); lead content is authored
// demo stand-in for the run artifact (declared, like swe-fleet's PR numbers).

import type {SimCell, SimColumn} from "../../components";

export const OUTBOUND_COLUMNS: SimColumn[] = [
	{name: "company", type: "text"},
	{name: "contact", type: "text"},
	{name: "title", type: "text"},
	{name: "signal", type: "text"},
	{name: "message", type: "text"},
	{name: "status", type: "text"},
];

export const COMPANY_COL = 0;
export const CONTACT_COL = 1;
export const TITLE_COL = 2;
export const SIGNAL_COL = 3;
export const MESSAGE_COL = 4;
export const STATUS_COL = 5;

export type Lead = {
	company: string; // ← Apollo (Search Organizations)
	title: string; // ← Apollo
	contact: string; // ← Data Enrichment
	signal: string; // ← Data Enrichment (the reason to reach out)
	message: string; // ← Personalize agent (DIFFERENT per row)
};

/** Apollo result order (the collection the Parallel distributes). Each
 *  message is a distinct authored 2-line opener — the visibly-different-
 *  per-row behavior of an agent run once per lead. Stand-in for the real
 *  run output (⟨pending⟩). */
export const LEADS: Lead[] = [
	{
		company: "Acme Robotics",
		title: "VP Engineering",
		contact: "Dana Liu",
		signal: "Series B · 3 wks ago",
		message: "Congrats on the Series B, Dana — scaling robotics QA fast is brutal. We cut test flake 40% for similar teams.",
	},
	{
		company: "Brightwave",
		title: "Head of Growth",
		contact: "Marcus Reed",
		signal: "Hiring 4 AEs",
		message: "Saw you're hiring four AEs, Marcus. Worth ramping them on warm pipeline instead of cold dials?",
	},
	{
		company: "Northwind",
		title: "CTO",
		contact: "Priya Nair",
		signal: "Migrated to Postgres",
		message: "Noticed the Postgres move, Priya — most CTOs hit replication pain at your size. Happy to share what worked.",
	},
	{
		company: "Cobalt Health",
		title: "VP Product",
		contact: "Sam Okafor",
		signal: "Launched mobile app",
		message: "Your new mobile launch looks sharp, Sam. Curious how you're handling onboarding drop-off post-install?",
	},
	{
		company: "Veraxis",
		title: "Founder",
		contact: "Lena Voss",
		signal: "SOC 2 in progress",
		message: "SOC 2 is a slog, Lena — we got two startups audit-ready in six weeks. Want the checklist?",
	},
	{
		company: "Drift Labs",
		title: "Head of Sales",
		contact: "Theo Park",
		signal: "Opened a new region",
		message: "Expanding into EMEA, Theo? Localizing outbound is where most teams stall — we've mapped it.",
	},
];

export const STATUS_SENT = "sent";

/** Lane completion order (parallel result order isn't guaranteed —
 *  parallel.mdx) = the order of `<parallel.results>` = the order Batch
 *  Insert Rows writes the table. Table row r holds LEADS[LANDED_ORDER[r]].
 *  The followed lane (Northwind, LEADS[2]) finishes first. */
export const LANDED_ORDER = [2, 4, 0, 5, 1, 3] as const;
export const FOLLOWED_LEAD = 2; // LEADS index — Northwind, the mechanistic example

/** Builds the table cell matrix in LANDED (insert) order for a per-cell
 *  fill state. fill(col,row) in 0..1 against TABLE row indices; cell text
 *  appears once fill >= 0.5 (the type-on / dip is carried by
 *  cellTextOpacity in the rig). Whole-row chrome is gated separately by
 *  rowOpacity (a row that hasn't landed is empty pane, not an empty row). */
export const outboundRows = (fill: (col: number, row: number) => number): SimCell[][] =>
	LANDED_ORDER.map((leadIdx, r) => {
		const lead = LEADS[leadIdx];
		const show = (col: number) => fill(col, r) >= 0.5;
		return [
			{text: show(COMPANY_COL) ? lead.company : ""},
			{text: show(CONTACT_COL) ? lead.contact : ""},
			{text: show(TITLE_COL) ? lead.title : ""},
			{text: show(SIGNAL_COL) ? lead.signal : ""},
			{text: show(MESSAGE_COL) ? lead.message : ""},
			{text: show(STATUS_COL) ? STATUS_SENT : ""},
		];
	});

// ── Block row values (registry/docs-verbatim; script grounding) ─────────────
// Apollo — apollo.ts, operation "Search Organizations"
// (apollo_organization_search); employee-range filter from the docs.
export const APOLLO_ROWS = [
	{title: "Operation", value: "Search Organizations"},
	{title: "Employees", value: "50–500"},
];

// Data Enrichment — enrichment.ts. "Build Full Contact" = the registry's
// build-full-contact template; input is the per-instance company.
export const ENRICH_ROWS = [
	{title: "Operation", value: "Build Full Contact"},
	{title: "Input", value: "<parallel.currentItem>"},
];

// Personalize — agent.ts. Messages references the enriched contact; model is
// the landing templates' authored value.
export const PERSONALIZE_MODEL = "claude-sonnet-4.6";
export const CONTACT_TAG = "<enrich.contact>";
export const CONTACT_VALUE = "[Priya Nair]"; // the followed lead's enriched contact

// Instantly — instantly.ts, operation "Create Lead" (instantly_create_lead);
// campaign label authored.
export const INSTANTLY_ROWS = [
	{title: "Operation", value: "Create Lead"},
	{title: "Campaign", value: "Q3 Outbound"},
];

// Table (the write-back block) — table.ts. Operation "Batch Insert Rows"
// (batch_insert_rows) is the registry's one multi-row write; its Rows
// param aggregates `<parallel.results>` — the docs' own canonical
// after-the-parallel pattern (workflows/blocks/parallel.mdx). Row title
// "Rows" abbreviates the registry's "Rows Data (Array of JSON)" for canvas
// legibility (declared divergence). Table name authored: `outbound`.
export const TABLE_NAME = "outbound";
export const RESULTS_REF = "<parallel.results>";
export const WB_OPERATION = "Batch Insert Rows";

// The parallel container's wiring reference (editor card, scene 3).
export const ITEMS_REF = "<apollo.organizations>";

// The followed lane's resolved currentItem (scene 4): Northwind.
export const CURRENT_ITEM_TAG = "<parallel.currentItem>";
export const CURRENT_ITEM_VALUE = "[Northwind]";

// The Data Enrichment provider cascade output (enrichment.ts `provider`
// field; docs example values). Shown as the provider chip that rings when
// the enrichment resolves.
export const PROVIDERS = ["Hunter", "People Data Labs"] as const;
