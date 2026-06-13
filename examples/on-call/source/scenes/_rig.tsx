import React from "react";
import {AbsoluteFill, interpolateColors} from "remotion";
import {COLORS, usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	OutputBundle,
	ResolvedTag,
	SimBlock,
	SimEdgePath,
	simEdgeD,
	SimTable,
	SlackGlyphW,
	Tag,
	WebhookGlyphW,
	WirePulse,
	type OutputLogRow,
	type OutputNode,
	type SimBlockTool,
} from "../../../components";
import {
	AGENT_X,
	BLOCKS_Y,
	CELL_H,
	EDGE1,
	RECORD_SCALE,
	RECORD_X,
	RECORD_Y,
	STAGE_H,
	STAGE_W,
	TABLE_SCALE,
	TABLE_X,
	TABLE_Y,
	TERM_X,
	TERM_YS,
	WEBHOOK_X,
	cameraTo,
	fanEdge,
	type Cam,
} from "../layout";
import {
	AGENT_MODEL,
	ALERT_TAG,
	ALERT_VALUE,
	INCIDENT_COLUMNS,
	LINEAR_ROWS,
	LOG_DURATIONS,
	PAGERDUTY_ROWS,
	SLACK_ROWS,
	STATUS_COL,
	TOOL_CALLS,
	TRIAGE_CONTENT_SHORT,
	TRIAGE_TOKENS,
	WEBHOOK_URL_DISPLAY,
	incidentRows,
	type IncidentStatus,
} from "../data";

// on-call-v2 set piece (script-v1.md). ONE real workflow left→right —
// Sentry Alerts (generic webhook) → Triage (agent; Sentry/Datadog/GitHub
// tool chips) → {Slack, Linear, PagerDuty} — beside the right rail of real
// surfaces: the incidents SimTable over run 1's OutputBundle record. The
// rail boxes are SEPARATE asides (established grammar); nothing occludes
// the workflow and nothing lives inside a container (there is none).

const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

// ---------------------------------------------------------------------------
// Brand glyphs, ported verbatim from the product (apps/sim/components/
// icons.tsx) — first ported for the hype-2 take (branch hype/on-call-agent),
// re-used unchanged. White marks on each block's registry bgColor.
// ---------------------------------------------------------------------------

/** SentryIcon — white on the registry #362D59 chip. */
export const SentryGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 -14.5 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M148.37,12.4 C144.04,5.21 136.26,0.82 127.87,0.82 C119.47,0.82 111.7,5.21 107.37,12.4 L73.64,70.17 C126.07,96.34 160.69,148.34 164.62,206.81 L140.94,206.81 C137.02,156.69 106.87,112.4 61.7,90.36 L30.48,144.33 C55.85,155.7 73.68,179.21 77.79,206.7 L23.41,206.7 C22.1,206.61 20.93,205.86 20.29,204.72 C19.65,203.57 19.63,202.18 20.23,201.01 L35.3,175.39 C30.2,171.13 24.36,167.83 18.08,165.65 L3.17,191.28 C0.03,196.66 -0.82,203.07 0.81,209.08 C2.44,215.09 6.41,220.2 11.83,223.26 C15.37,225.25 19.35,226.31 23.41,226.33 L97.88,226.33 C100.7,191.62 85.14,157.97 56.88,137.61 L68.72,117.11 C104.4,141.62 124.47,183.15 121.51,226.33 L184.6,226.33 C187.59,160.9 155.56,98.82 100.5,63.35 L124.43,22.35 C125.54,20.49 127.94,19.87 129.81,20.96 C132.53,22.45 233.81,199.17 235.7,201.22 C236.38,202.44 236.36,203.93 235.64,205.13 C234.92,206.32 233.61,207.04 232.22,207.01 L207.82,207.01 C208.13,213.54 208.13,220.05 207.82,226.54 L232.32,226.54 C238.6,226.58 244.64,224.11 249.09,219.67 C253.54,215.23 256.03,209.2 256,202.91 C256,198.8 254.91,194.77 252.82,191.23 L148.37,12.4 Z"
			fill="#ffffff"
		/>
	</svg>
);

/** DatadogIcon — the dog mark, white on the registry #632CA6 chip. */
export const DatadogGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
		<g fill="#ffffff">
			<path d="M57.71 33.72l1.58 20.1L31.4 58.82 29 38.72l3.98-.556c.648.28 1.11.37 1.85.556 1.2.278 2.59.648 4.63-.463.46-.278 1.48-1.11 1.85-1.67zm-43.07 23.9c-.463-.74-1.3-1.57-2.59-2.59-1.85-1.48-1.2-4.08-.093-5.65 1.4-2.69 8.71-6.21 8.34-10.56-.185-1.57-.37-3.61-1.85-5.09-.93.56 0 1.11 0 1.11s-.648-.74-.926-1.85c-.278-.37-.556-.556-.834-1.11-.185.65-.185 1.3-.185 1.3s-.463-1.2-.556-2.13c-.278.46-.37 1.3-.37 1.3s-.648-1.85-.463-2.87c-.278-.834-1.2-2.59-.926-6.48 1.58 1.11 5.1.834 6.48-1.2.463-.648.74-2.5-.185-6.11-.648-2.32-2.22-5.74-2.87-7.04l-.93.09c.37 1.02 1.02 3.24 1.3 4.35.74 3.24 1.02 4.35.648 5.84-.278 1.3-1.02 2.13-2.96 3.06-1.85.926-4.45-1.4-4.54-1.48-1.85-1.48-3.24-3.9-3.43-5-.185-1.3.74-2.04 1.2-3.06-.648.18-1.4.56-1.4.56s.834-.926 1.95-1.67a9.43 9.43 0 0 0 1.2-.834H10.28s1.11-.648 2.32-1.02H10.93l4.45-1.94c1.4-.556 2.69-.37 3.43.648 1.02 1.4 2.04 2.13 4.17 2.69 1.3-.556 1.76-.926 3.43-1.4 1.48-1.67 2.69-1.85 2.69-1.85s-.834.74-.926 1.58c.834-.648 1.76-1.2 1.76-1.2s-.37.46-.648 1.11l.93.09c1.02-.556 2.13-1.02 2.13-1.02s-.37.37-.74.93c.74 0 2.22 0 2.78.09 3.43.093 4.17-3.61 5.47-4.17 1.67-.556 2.41-.926 5.19 1.85 2.41 2.41 4.26 6.58 3.34 7.5-.74.74-2.32-.278-4.08-2.41-.926-1.11-1.57-2.5-1.94-4.17-.185-1.4-1.2-2.22-1.2-2.22s.648 1.4.65 2.59c0 .648.09 3.06 1.11 4.45-.93.19-.185 1.02-.278 1.11-1.2-1.48-3.9-2.5-4.26-2.87 1.48 1.2 4.82 3.9 6.11 6.48 1.2 2.5.46 4.72 1.11 5.28.19.185 2.59 3.15 3.06 4.72.834 2.69.093 5.47-1.02 7.13l-2.96.463a3.92 3.92 0 0 1-1.11-.371c.185-.37.65-1.3.648-1.48l-.185-.278c-.926 1.3-2.5 2.59-3.8 3.34-1.67.926-3.61.834-4.9.37-3.61-1.11-7.04-3.52-7.78-4.17 0 0 0 .463.09.648a28.07 28.07 0 0 0 5 4.17l-4.26.46 2.04 15.75c-.926.09-1.2.19-2.04.37-.834-3.06-2.5-5-4.35-6.21-1.57-1.02-3.8-1.3-5.93-.834l-.93.19c1.48-.185 3.24.093 5 1.2s3.15 3.98 3.71 5.65c.648 2.22 1.11 4.54-.648 7.04-1.3 1.76-5 2.78-7.97.648.83 1.3 1.85 2.32 3.34 2.5 2.13.28 4.17-.093 5.65-1.48 1.2-1.2 1.85-3.8 1.67-6.58l1.95-.278.65 4.9L62.06 56.7l-2.78-25.19-1.57.278L54.56 0 1.94 6.11l6.48 52.43z" />
			<path d="M39.67 30.06c1.4 1.02 2.59 1.67 3.8 1.58.74-.093 1.48-1.3 1.95-2.41.37-.74.37-1.57-.185-1.85-.278-.093-1.4-.093-2.22 0-1.57.185-3.15.74-3.52 1.02-.556.37-.278 1.3.185 1.67m.37-10.84v.093l.93.19c.37.74.74 1.48 1.48 1.85.185 0 .37-.93.56-.93.65 0 1.2.09 1.3.185v-.556c-.093-.926.19-2.59-1.67-3.52-.74-.37-1.67-.185-2.04.185h.185c.463.19.185.37.09.556-.093.37-.185.46 0 1.11" />
			<path d="M31.7 19.41c.463-.37-2.13-.926-4.17.37-1.48 1.02-1.48 3.15-.093 4.35a1.27 1.27 0 0 1 .37.28c.37-.185.93-.37 1.4-.556.93-.278 1.67-.463 2.32-.556.28-.37.65-.926.56-1.94-.093-1.4-1.2-1.11-.37-1.94m15.1 22.5l-4.45 7.4-5.19-1.57-4.54 6.95.185 2.22 24.83-4.54-1.48-15.47-4.08 8.52z" />
		</g>
	</svg>
);

/** GithubIcon — white on the registry #181C1E chip. */
export const GithubGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M13 0C11.29 0 9.6 0.34 8.03 0.99C6.45 1.64 5.01 2.6 3.81 3.81C1.37 6.25 0 9.55 0 13C0 18.75 3.73 23.62 8.89 25.35C9.54 25.45 9.75 25.05 9.75 24.7V22.5C6.15 23.28 5.38 20.76 5.38 20.76C4.78 19.25 3.94 18.85 3.94 18.85C2.76 18.04 4.03 18.07 4.03 18.07C5.33 18.16 6.02 19.41 6.02 19.41C7.15 21.39 9.06 20.8 9.8 20.49C9.92 19.64 10.26 19.07 10.62 18.75C7.74 18.42 4.71 17.3 4.71 12.35C4.71 10.91 5.2 9.75 6.05 8.83C5.92 8.5 5.46 7.15 6.18 5.4C6.18 5.4 7.27 5.04 9.75 6.72C10.78 6.44 11.9 6.29 13 6.29C14.11 6.29 15.22 6.44 16.25 6.72C18.73 5.04 19.83 5.4 19.83 5.4C20.54 7.15 20.09 8.5 19.95 8.83C20.8 9.75 21.29 10.91 21.29 12.35C21.29 17.32 18.25 18.41 15.35 18.73C15.82 19.14 16.25 19.93 16.25 21.14V24.7C16.25 25.05 16.46 25.47 17.12 25.35C22.28 23.61 26 18.75 26 13C26 11.29 25.66 9.6 25.01 8.03C24.36 6.45 23.4 5.01 22.19 3.81C20.99 2.6 19.55 1.64 17.97 0.99C16.4 0.34 14.71 0 13 0Z"
			fill="#ffffff"
		/>
	</svg>
);

/** LinearIcon — white on the registry #5E6AD2 chip. */
export const LinearGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
		<path d="M1.23 61.52c-.2225-.9485.91-1.55 1.6-.857L39.33 97.18c.6889.69.09 1.82-.857 1.6C20.05 94.45 5.55 79.95 1.23 61.52ZM.00189135 46.89c-.1764375.28.89.56.29.76L52.35 99.71c.2007.2.48.31.76.29 2.37-.1476 4.69-.46 6.96-.9259.76-.157 1.03-1.1.48-1.65L2.58 39.45c-.55186-.5519-1.49-.2863-1.65.48-.465915 2.27-.77832 4.59-.92588465 6.96ZM4.21 29.71c-.16649.37-.8169.81.21 1.1l64.78 64.78c.2894.29.73.37 1.1.21 1.79-.7956 3.52-1.69 5.19-2.68.55-.328.64-1.9.18-1.54L8.44 24.34c-.45409-.4541-1.21-.3689-1.54.18-.99132 1.67-1.89 3.4-2.68 5.19ZM12.66 18.07c-.3701-.3701-.393-.9637-.0443-1.35C21.78 6.46 35.11 0 49.95 0 77.59 0 100 22.41 100 50.05c0 14.84-6.46 28.17-16.72 37.34-.3903.35-.984.33-1.35-.0443L12.66 18.07Z" />
	</svg>
);

/** PagerDutyIcon — white on the registry #06AC38 chip. */
export const PagerDutyGlyphW: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M6.7 59.22H0v-33.65c0-3.45 1.42-5.54 2.6-6.7 2.63-2.58 6.2-2.66 6.78-2.66h10.55c3.77 0 5.93 1.52 7.12 2.8 2.35 2.55 2.37 5.85 2.32 6.73v12.69c0 3.66-1.5 5.83-2.73 6.99-2.55 2.4-5.93 2.45-6.73 2.42H6.7zm13.46-18.1c.36 0 1.37-.103 1.91-.62.41-.387.62-1.08.62-2.1v-13.02c0-.36-.077-1.31-.593-1.86-.5-.516-1.44-.62-2.17-.62h-10.6c-2.63 0-2.63 1.99-2.63 2.66v15.55zM57.3 4.78H64V38.46c0 3.46-1.42 5.54-2.6 6.7-2.63 2.58-6.2 2.66-6.78 2.66H44.07c-3.76 0-5.93-1.52-7.12-2.8-2.35-2.55-2.37-5.85-2.32-6.73V25.62c0-3.66 1.5-5.83 2.73-6.99 2.55-2.4 5.93-2.45 6.73-2.42h13.2zM43.84 22.9c-.36 0-1.37.103-1.91.62-.413.39-.62 1.08-.62 2.1v13.02c0 .36.08 1.32.593 1.86.5.52 1.44.62 2.17.62h10.6c2.66-.026 2.66-2 2.66-2.68V22.9z"
			fill="#ffffff"
		/>
	</svg>
);

// Registry chip identities (bgColor from apps/sim/blocks/blocks/*.ts,
// re-derived 2026-06-12).
export const SENTRY_COLOR = "#362D59";
export const DATADOG_COLOR = "#632CA6";
export const GITHUB_COLOR = "#181C1E";
export const LINEAR_COLOR = "#5E6AD2";
export const PAGERDUTY_COLOR = "#06AC38";

// ── Shared state grammar (the series' conventions) ──────────────────────────
export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};

export const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

export type EdgeVis = {progress?: number; hi?: number; opacity?: number};

const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

// ── The run record's content builders ───────────────────────────────────────

/** The five log rows in execution order. reveal<=0 rows are NOT mounted
 *  (render-nothing-at-zero; the logs column is top-aligned so appending a
 *  row never moves a landed one). `triageDur` overrides Triage's duration
 *  text while the agent is still running (scene 4's count-up). */
export const buildLogRows = (opts: {
	reveals?: [number, number, number, number, number];
	selected?: number; // index of the selected row (-1 = none)
	triageDur?: React.ReactNode;
}): OutputLogRow[] => {
	const {reveals = [1, 1, 1, 1, 1], selected = 1, triageDur} = opts;
	const rows: (OutputLogRow & {_r: number})[] = [
		{
			name: "Sentry Alerts",
			color: BLOCK_COLORS.webhook,
			glyph: <WebhookGlyphW size={11} />,
			duration: LOG_DURATIONS.webhook,
			_r: reveals[0],
		},
		{
			name: "Triage",
			color: BLOCK_COLORS.agent,
			glyph: <AgentGlyphW size={11} />,
			duration: triageDur ?? LOG_DURATIONS.triage,
			_r: reveals[1],
		},
		{
			name: "Slack",
			color: BLOCK_COLORS.slack,
			glyph: <SlackGlyphW size={11} />,
			duration: LOG_DURATIONS.slack,
			_r: reveals[2],
		},
		{
			name: "Linear",
			color: LINEAR_COLOR,
			glyph: <LinearGlyphW size={11} />,
			duration: LOG_DURATIONS.linear,
			_r: reveals[3],
		},
		{
			name: "PagerDuty",
			color: PAGERDUTY_COLOR,
			glyph: <PagerDutyGlyphW size={11} />,
			duration: LOG_DURATIONS.pagerduty,
			_r: reveals[4],
		},
	];
	return rows
		.map((r, i) => ({...r, reveal: r._r, selected: i === selected ? 1 : 0}))
		.filter((r) => (r.reveal ?? 0) > 0);
};

/** Triage's output tree — the agent's REAL output shape (content · tokens ·
 *  toolCalls); the three tool calls land as rows under toolCalls.
 *
 *  Every node stays MOUNTED at reveal 0 (opacity 0): the panel reserves its
 *  final height from the moment the record fades in, so rows land as pure
 *  fades and nothing already on screen ever shifts (no-teleport rule; the
 *  module-7 minBodyH precedent, done structurally). The toolCalls parent
 *  label fades in with its first child. */
export const buildTriageTree = (opts: {
	contentReveal?: number;
	tokensReveal?: number;
	toolCallReveals?: [number, number, number];
	toolCallHi?: [number, number, number];
}): OutputNode[] => {
	const {
		contentReveal = 1,
		tokensReveal = 1,
		toolCallReveals = [1, 1, 1],
		toolCallHi = [0, 0, 0],
	} = opts;
	const calls = TOOL_CALLS.map((c, i) => ({
		key: c.key,
		type: "object" as const,
		value: c.value,
		reveal: toolCallReveals[i],
		highlight: toolCallHi[i],
	}));
	return [
		{key: "content", type: "string", value: TRIAGE_CONTENT_SHORT, reveal: contentReveal},
		{
			key: "tokens",
			type: "object",
			children: [
				{key: "input", type: "number", value: TRIAGE_TOKENS.input},
				{key: "output", type: "number", value: TRIAGE_TOKENS.output},
			],
			reveal: tokensReveal,
		},
		{key: "toolCalls", type: "array", children: calls, reveal: toolCallReveals[0]},
	];
};

// ── Stage props ──────────────────────────────────────────────────────────────
export type StageProps = {
	cam: Cam;
	/** 0..1 — whole-world dim toward 0.35. */
	dim?: number;

	// workflow
	webhook?: BlockVis;
	agent?: BlockVis;
	/** [Slack, Linear, PagerDuty] */
	terms?: [BlockVis, BlockVis, BlockVis];
	edge1?: EdgeVis;
	fans?: [EdgeVis, EdgeVis, EdgeVis];
	/** [Sentry, Datadog, GitHub] chip rings, 0..1. */
	toolRings?: [number, number, number];
	/** [Sentry, Datadog, GitHub] chip width-grow reveals (scene 2). */
	toolChipReveals?: [number, number, number];
	/** 0..1 — the whole Tools line grows in (scene 2; SimBlock toolsReveal). */
	toolsRowReveal?: number;
	/** 0..1 — the chips' second line grows in as GitHub wraps (scene 2). */
	toolsWrapReveal?: number;
	/** The Messages reference: glow 0..1, resolve 0..1 (tag → alert title). */
	msgTag?: {glow?: number; resolve?: number};
	/** 0..1 — WirePulse travel on edge 1 (webhook → agent). */
	pulse1?: number;
	/** 0..1 each — light pulse riding fan edge i (agent → terminal i). */
	fanPulses?: [number, number, number];

	// the incidents table (right rail, top)
	tableIn?: number;
	statusAt?: (row: number) => IncidentStatus;
	/** 0..1 green output tint on a row's status cell (pulse → residue). */
	statusTint?: (row: number) => number;
	/** 0..1 product selection treatment on a whole row. */
	rowHi?: (row: number) => number;
	/** 0..1 — collective selection treatment on the status COLUMN (scene 1). */
	statusColHi?: number;
	/** 0..1 per-row reveal (scene 1 assemble). */
	rowReveal?: (row: number) => number;
	/** 0..1 status-cell TEXT opacity (dip-swaps on flips). */
	statusTextOp?: (row: number) => number;

	// the run record (right rail, bottom)
	recordIn?: number;
	logReveals?: [number, number, number, number, number];
	logSelected?: number;
	/** Override for Triage's duration text (scene 4's count-up). */
	triageDur?: React.ReactNode;
	contentReveal?: number;
	tokensReveal?: number;
	toolCallReveals?: [number, number, number];
	toolCallHi?: [number, number, number];
};

// ── Blocks ───────────────────────────────────────────────────────────────────

const WebhookBlock: React.FC<{vis?: BlockVis}> = ({vis}) => (
	<div style={{position: "absolute", left: WEBHOOK_X, top: BLOCKS_Y, opacity: visOpacity(vis)}}>
		<SimBlock
			name="Sentry Alerts"
			color={BLOCK_COLORS.webhook}
			glyph={<WebhookGlyphW size={22} />}
			rows={[
				{
					title: "Webhook URL",
					value: <span style={{fontFamily: MONO, fontSize: 17}}>{WEBHOOK_URL_DISPLAY}</span>,
				},
			]}
			hideTargetHandle
			highlighted={vis?.highlighted}
			state={vis?.state}
		/>
	</div>
);

const AgentBlock: React.FC<{
	vis?: BlockVis;
	toolRings?: [number, number, number];
	toolChipReveals?: [number, number, number];
	toolsRowReveal?: number;
	toolsWrapReveal?: number;
	msgTag?: {glow?: number; resolve?: number};
}> = ({
	vis,
	toolRings = [0, 0, 0],
	toolChipReveals = [1, 1, 1],
	toolsRowReveal = 1,
	toolsWrapReveal = 1,
	msgTag,
}) => {
	const resolve = msgTag?.resolve ?? 0;
	const glow = msgTag?.glow ?? 0;
	const tools: SimBlockTool[] = [
		{
			name: "Sentry",
			color: SENTRY_COLOR,
			glyph: <SentryGlyphW size={12} />,
			ring: toolRings[0],
			opacity: toolChipReveals[0],
		},
		{
			name: "Datadog",
			color: DATADOG_COLOR,
			glyph: <DatadogGlyphW size={13} />,
			ring: toolRings[1],
			opacity: toolChipReveals[1],
		},
		{
			name: "GitHub",
			color: GITHUB_COLOR,
			glyph: <GithubGlyphW size={13} />,
			ring: toolRings[2],
			opacity: toolChipReveals[2],
		},
	];
	return (
		<div style={{position: "absolute", left: AGENT_X, top: BLOCKS_Y, opacity: visOpacity(vis)}}>
			<SimBlock
				name="Triage"
				color={BLOCK_COLORS.agent}
				glyph={<AgentGlyphW size={22} />}
				rows={[
					{
						title: "Messages",
						value:
							resolve > 0 ? (
								<ResolvedTag tag={ALERT_TAG} value={ALERT_VALUE} glow={glow} resolve={resolve} />
							) : (
								<Tag text={ALERT_TAG} glow={glow} />
							),
					},
					{title: "Model", value: AGENT_MODEL},
				]}
				tools={tools}
				toolsReveal={toolsRowReveal}
				toolsWrapReveal={toolsWrapReveal}
				highlighted={vis?.highlighted}
				state={vis?.state}
			/>
		</div>
	);
};

const TERMS = [
	{name: "Slack", color: BLOCK_COLORS.slack, glyph: <SlackGlyphW size={21} />, rows: SLACK_ROWS},
	{name: "Linear", color: LINEAR_COLOR, glyph: <LinearGlyphW size={21} />, rows: LINEAR_ROWS},
	{name: "PagerDuty", color: PAGERDUTY_COLOR, glyph: <PagerDutyGlyphW size={20} />, rows: PAGERDUTY_ROWS},
] as const;

const TerminalBlock: React.FC<{i: 0 | 1 | 2; vis?: BlockVis}> = ({i, vis}) => {
	const t = TERMS[i];
	return (
		<div style={{position: "absolute", left: TERM_X, top: TERM_YS[i], opacity: visOpacity(vis)}}>
			<SimBlock
				name={t.name}
				color={t.color}
				glyph={t.glyph}
				rows={[...t.rows]}
				hideSourceHandle
				highlighted={vis?.highlighted}
				state={vis?.state}
			/>
		</div>
	);
};

// ── Fan pulse: WirePulse's streak language riding a smooth-step path ────────
// The straight-wire WirePulse can't bend, so the fan edges carry the same
// light (head streak + parametric trail, emerge-at-source / absorb-at-target)
// via dash math on the exact SimEdgePath geometry (simEdgeD).
const FanPulse: React.FC<{i: 0 | 1 | 2; p: number}> = ({i, p}) => {
	if (p <= 0 || p >= 1) return null;
	const e = fanEdge(i);
	const {d, len} = simEdgeD(e.x1, e.y1, e.x2, e.y2);
	const seg = 80;
	const streak = (q: number, opMul: number, key: number) => {
		if (q <= 0 || q >= 1) return null;
		const op = (q > 0.82 ? (1 - q) / 0.18 : 1) * opMul;
		return (
			<path
				key={key}
				d={d}
				fill="none"
				stroke="rgba(51,180,255,0.95)"
				strokeWidth={4}
				strokeLinecap="round"
				strokeDasharray={`${seg} ${len + seg}`}
				strokeDashoffset={seg - q * (len + seg)}
				opacity={op}
			/>
		);
	};
	return (
		<>
			{[1, 2, 3].map((k) => streak(p - k * 0.045, 0.4 * (1 - k / 3), k))}
			{streak(p, 1, 0)}
		</>
	);
};

// ── Table overlay helpers (module-2 derivation: 37px native row pitch incl.
//    border; header 36 incl. the container border) ──────────────────────────
const HEADER_PX = 36 * TABLE_SCALE;
const statusCellX = TABLE_X + (40 + 2 * 160) * TABLE_SCALE;
const STATUS_W = 160 * TABLE_SCALE;
const cellTopY = (row: number) => TABLE_Y + HEADER_PX + row * CELL_H;

// ── The Stage ────────────────────────────────────────────────────────────────
export const Stage: React.FC<StageProps> = ({
	cam,
	dim = 0,
	webhook,
	agent,
	terms = [{}, {}, {}],
	edge1,
	fans = [{}, {}, {}],
	toolRings,
	toolChipReveals,
	toolsRowReveal,
	toolsWrapReveal,
	msgTag,
	pulse1 = 0,
	fanPulses = [0, 0, 0],
	tableIn = 1,
	statusAt = () => "firing",
	statusTint,
	rowHi,
	statusColHi = 0,
	rowReveal,
	statusTextOp,
	recordIn = 0,
	logReveals,
	logSelected,
	triageDur,
	contentReveal,
	tokensReveal,
	toolCallReveals,
	toolCallHi,
}) => {
	const pal = usePalette();
	const worldOp = 1 - 0.65 * dim;
	const camT = cameraTo(cam.px, cam.py, cam.s);

	const rows = incidentRows(statusAt);
	const textOp = (c: number, r: number) => {
		const rev = rowReveal ? rowReveal(r) : 1;
		if (c === STATUS_COL && statusTextOp) return rev * statusTextOp(r);
		return rev;
	};
	const cellHi =
		rowHi || statusColHi > 0
			? (c: number, r: number) =>
					Math.max(rowHi ? rowHi(r) : 0, c === STATUS_COL ? statusColHi : 0)
			: undefined;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, fontFamily: FONT}}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: worldOp,
					transform: `translate(${camT.tx}px, ${camT.ty}px) scale(${cam.s})`,
					transformOrigin: "0 0",
				}}
			>
				{/* ── edges ── */}
				<svg
					width={STAGE_W}
					height={STAGE_H}
					viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
					style={{position: "absolute", inset: 0, pointerEvents: "none"}}
				>
					<g opacity={edge1?.opacity ?? 1}>
						<SimEdgePath
							x1={EDGE1.x1}
							y1={EDGE1.y}
							x2={EDGE1.x2}
							y2={EDGE1.y}
							progress={edge1?.progress ?? 1}
							color={edgeColor(edge1?.hi ?? 0, pal)}
							thickness={2.25 + 1.25 * (edge1?.hi ?? 0)}
						/>
					</g>
					{([0, 1, 2] as const).map((i) => {
						const e = fanEdge(i);
						const v = fans[i];
						return (
							<g key={`fan-${i}`} opacity={v?.opacity ?? 1}>
								<SimEdgePath
									x1={e.x1}
									y1={e.y1}
									x2={e.x2}
									y2={e.y2}
									progress={v?.progress ?? 1}
									color={edgeColor(v?.hi ?? 0, pal)}
									thickness={2.25 + 1.25 * (v?.hi ?? 0)}
								/>
							</g>
						);
					})}
					{([0, 1, 2] as const).map((i) => (
						<FanPulse key={`fanp-${i}`} i={i} p={fanPulses[i]} />
					))}
				</svg>
				<WirePulse x1={EDGE1.x1} x2={EDGE1.x2} y={EDGE1.y} p={pulse1} />

				{/* ── the workflow ── */}
				<WebhookBlock vis={webhook} />
				<AgentBlock
					vis={agent}
					toolRings={toolRings}
					toolChipReveals={toolChipReveals}
					toolsRowReveal={toolsRowReveal}
					toolsWrapReveal={toolsWrapReveal}
					msgTag={msgTag}
				/>
				<TerminalBlock i={0} vis={terms[0]} />
				<TerminalBlock i={1} vis={terms[1]} />
				<TerminalBlock i={2} vis={terms[2]} />

				{/* ── the incidents table (separate aside box, right rail top) ── */}
				{tableIn > 0 ? (
					<div style={{position: "absolute", left: TABLE_X, top: TABLE_Y, opacity: tableIn}}>
						<SimTable
							columns={INCIDENT_COLUMNS}
							rows={rows}
							scale={TABLE_SCALE}
							cellHighlight={cellHi}
							cellOpacity={rowReveal ? (_c, r) => rowReveal(r) : undefined}
							cellTextOpacity={textOp}
						/>
					</div>
				) : null}

				{/* Green output tint on flipped status cells (pulse → residue;
				    growth-machine's accepted cell language). */}
				{statusTint && tableIn > 0
					? rows.map((_, r) => {
							const t = statusTint(r);
							if (t <= 0) return null;
							return (
								<div
									key={`tint-${r}`}
									style={{
										position: "absolute",
										left: statusCellX,
										top: cellTopY(r),
										width: STATUS_W,
										height: CELL_H - 2,
										backgroundColor: `rgba(51,196,130,${0.24 * t})`,
										pointerEvents: "none",
									}}
								/>
							);
						})
					: null}

				{/* ── run 1's record (separate aside box, right rail bottom) ── */}
				{recordIn > 0 ? (
					<div style={{position: "absolute", left: RECORD_X, top: RECORD_Y}}>
						<OutputBundle
							logs={buildLogRows({reveals: logReveals, selected: logSelected, triageDur})}
							values={buildTriageTree({contentReveal, tokensReveal, toolCallReveals, toolCallHi})}
							scale={RECORD_SCALE}
							opacity={recordIn}
						/>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
