// Invented demo content for the Tables module. Kept in one place so the same
// tickets / leads appear consistently across scenes (continuity of content).

import type {CellState, ColumnSpec} from "./scenes/_local";

// ─── V1: anatomy / what-belongs (generic) ───────────────────────────────────
export const ANATOMY_COLUMNS: ColumnSpec[] = [
	{name: "message", type: "text"},
	{name: "score", type: "number"},
	{name: "open?", type: "boolean"},
	{name: "result", type: "JSON"},
];

export const TYPE_CHIPS = ["text", "number", "boolean", "date", "JSON"];

// what-belongs: each column shows the kind of thing tables hold
export const BELONGS_COLUMNS: ColumnSpec[] = [
	{name: "status", type: "text"},
	{name: "score", type: "number"},
	{name: "category", type: "text"},
	{name: "output", type: "JSON"},
];
export const BELONGS_ROWS: CellState[][] = [
	[{text: "open"}, {text: "0.82"}, {text: "billing"}, {text: "{…}"}],
	[{text: "closed"}, {text: "0.41"}, {text: "bug"}, {text: "{…}"}],
	[{text: "open"}, {text: "0.93"}, {text: "feature"}, {text: "{…}"}],
	[{text: "open"}, {text: "0.67"}, {text: "billing"}, {text: "{…}"}],
	[{text: "closed"}, {text: "0.55"}, {text: "bug"}, {text: "{…}"}],
];

// ─── V2: support tickets ─────────────────────────────────────────────────────
export const TICKET_COLUMNS: ColumnSpec[] = [
	{name: "message", type: "text"},
	{name: "category", type: "text"},
	{name: "urgency", type: "text"},
	{name: "status", type: "text"},
];

// message filled, rest empty — the workflow will fill them
export const TICKET_MESSAGES = [
	"Can't reset password",
	"Invoice double-charged",
	"Dark mode request",
	"API returns 500",
	"How do I export?",
];

export const ticketRowsEmpty = (): CellState[][] =>
	TICKET_MESSAGES.map((m) => [{text: m}, {}, {}, {}]);

// fully classified (dashboard / write-back end state)
export const TICKET_FILLED = [
	{category: "auth", urgency: "high", status: "done"},
	{category: "billing", urgency: "high", status: "done"},
	{category: "feature", urgency: "low", status: "done"},
	{category: "bug", urgency: "high", status: "done"},
	{category: "support", urgency: "low", status: "done"},
];
export const ticketRowsFilled = (): CellState[][] =>
	TICKET_MESSAGES.map((m, i) => [
		{text: m},
		{text: TICKET_FILLED[i].category},
		{text: TICKET_FILLED[i].urgency},
		{text: TICKET_FILLED[i].status},
	]);

// the single row read in read-rows / process-row / write-back
export const FOCUS_ROW = 1; // "Invoice double-charged"

// ─── V3: lead qualification (input/output + cascade) ─────────────────────────
export const LEAD_COLUMNS: ColumnSpec[] = [
	{name: "company", type: "text", tone: "input"},
	{name: "industry", type: "text", tone: "input"},
	{name: "description", type: "text", tone: "input"},
	{name: "qualified?", type: "boolean", tone: "output"},
];

export const LEAD_NAMES = ["Acme Co", "Bluefin", "Cortex AI", "Delta Labs", "Evergreen"];
export const LEAD_INDUSTRY = ["SaaS", "Fintech", "AI", "Biotech", "Energy"];
export const LEAD_DESC = ["mid-market", "enterprise", "startup", "enterprise", "mid-market"];
export const LEAD_QUALIFIED = ["yes", "no", "yes", "yes", "no"];

export const leadRows = (filledOutput: boolean): CellState[][] =>
	LEAD_NAMES.map((n, i) => [
		{text: n},
		{text: LEAD_INDUSTRY[i]},
		{text: LEAD_DESC[i]},
		filledOutput ? {text: LEAD_QUALIFIED[i]} : {},
	]);

// cascade: three workflow columns + one input column
export const CASCADE_COLUMNS: ColumnSpec[] = [
	{name: "company", type: "text", tone: "input"},
	{name: "enrich", workflow: true, tone: "output"},
	{name: "qualify", workflow: true, tone: "output"},
	{name: "outreach", workflow: true, tone: "output"},
];
export const CASCADE_FILL = [
	{enrich: "120 emp", qualify: "yes", outreach: "sent"},
	{enrich: "40 emp", qualify: "no", outreach: "—"},
	{enrich: "8 emp", qualify: "yes", outreach: "sent"},
	{enrich: "300 emp", qualify: "yes", outreach: "sent"},
	{enrich: "60 emp", qualify: "no", outreach: "—"},
];
