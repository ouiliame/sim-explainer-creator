// Authored demo data for on-call-v2 — ALL run-derived values here are
// AUTHORED STAND-INS, declared per the ⟨pending⟩ rule (no real run artifact
// exists; swe-fleet PR-number / growth-machine opener precedent). Registry
// identities (block names, bgColors, operation labels, subBlock titles,
// tool ids) are PRODUCT TRUTH re-derived 2026-06-12 from _reference/sim —
// see script-v1.md grounding and demo-corpus/README.md.

import type {SimCell, SimColumn} from "../../components";

// ── The incidents table (SimTable, native ×2) ───────────────────────────────

export const INCIDENT_COLUMNS: SimColumn[] = [
	{name: "incident", type: "text"},
	{name: "service", type: "text"},
	{name: "status", type: "text"},
];

export type IncidentStatus = "firing" | "triaged" | "assigned";

/** Authored incident titles/services (Sentry-issue-flavored stand-ins). */
export const INCIDENTS: {incident: string; service: string}[] = [
	{incident: "TypeError: cart is null", service: "checkout-api"},
	{incident: "TimeoutError: redis", service: "cache"},
	{incident: "HTTP 500 /payments", service: "payments-api"},
	{incident: "OOMKilled: worker-7", service: "jobs"},
	{incident: "QueryTimeout: orders", service: "orders-db"},
	{incident: "CORSError: /api/auth", service: "web-app"},
];

/** Row index the followed run (run 1) handles. */
export const FOLLOWED_ROW = 2; // "HTTP 500 /payments"

/** Scramble order in which the remaining rows flip during the cadence
 *  (scene 6): independent alerts, arrival order — rows 5, 1, 6, 2, 4. */
export const CADENCE_ORDER = [4, 0, 5, 1, 3];

export const STATUS_COL = 2;

export const incidentRows = (statusAt: (row: number) => IncidentStatus): SimCell[][] =>
	INCIDENTS.map((it, r) => [
		{text: it.incident},
		{text: it.service},
		{text: statusAt(r)},
	]);

// ── The workflow's row values ───────────────────────────────────────────────

// The generic-webhook docs' own example UUID display (webhooks-video port).
export const WEBHOOK_URL_DISPLAY = "…/trigger/d8abcf0d…";

// Payload reference (generic-webhook docs' root-field example shape).
export const ALERT_TAG = "<sentryalerts.message>";
/** What the tag resolves to in run 1 — row 3's own incident title. */
export const ALERT_VALUE = INCIDENTS[FOLLOWED_ROW].incident;

export const AGENT_MODEL = "claude-sonnet-4-6";

// Terminal block rows (registry operation labels + subBlock titles; the
// channel/team values are authored stand-ins).
export const SLACK_ROWS = [
	{title: "Operation", value: "Send Message"},
	{title: "Channel", value: "#incidents"},
];
export const LINEAR_ROWS = [
	{title: "Operation", value: "Create Issue"},
	{title: "Team", value: "Platform"},
];
export const PAGERDUTY_ROWS = [
	{title: "Operation", value: "Create Incident"},
	{title: "Urgency", value: "High"},
];

// ── Run 1's record (OutputBundle) ───────────────────────────────────────────

/** Log-row durations (authored stand-ins). Execution order. */
export const LOG_DURATIONS = {
	webhook: "18ms",
	triage: "9.8s",
	slack: "412ms",
	linear: "633ms",
	pagerduty: "528ms",
};

/** Triage's output tree values (standard agent outputs: content · tokens ·
 *  toolCalls — agent.ts). toolCalls keys are the registry's REAL tool ids;
 *  durations/result summaries are authored stand-ins in module-7's accepted
 *  `NNNms · result` format. All three are READS. */
export const TRIAGE_CONTENT_SHORT = "payments-api — 500s began with deploy 4f2c1…";
export const TRIAGE_TOKENS = {input: "6204", output: "388"};
export const TOOL_CALLS = [
	{key: "[0] sentry_issues_get", value: "412ms · 1 issue"},
	{key: "[1] datadog_query_logs", value: "688ms · 214 lines"},
	{key: "[2] github_latest_commit", value: "295ms · 4f2c1"},
];
