import React from "react";
import {interpolate, interpolateColors} from "remotion";
import {usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DatabaseGlyphW,
	DipSwap,
	ResolvedTag,
	ResponseGlyphW,
	SearchGlyphW,
	SimBlock,
	SimEdgePath,
	simEdgeD,
	StartGlyphW,
	type SimBlockTool,
} from "../../../components";
import {runBeats, type RunBeats} from "../../module-5-agents/scenes/_v3";
import {ApiGlyphW} from "../../module-6-deployment/scenes/_v2";
import {
	BADGE_H,
	BADGE_W,
	BADGE_X,
	badgeTop,
	blockX,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	edgeX1,
	edgeX2,
	PARTNER,
	PARTNER_SPOKE,
	PILL,
	SPOKE_X1,
	SPOKE_X2,
	STAGE_H,
	STAGE_W,
	badgeCenterY,
} from "../layout";

export {runBeats} from "../../module-5-agents/scenes/_v3";
export type {RunBeats} from "../../module-5-agents/scenes/_v3";

// Agent-economy shared rig. ONE set piece for all six scenes: the Scout
// chain (Start → Agent "Scout" → Response), the MCP tool pill above the
// entry, the five client badges (the product's MCP Client picker list,
// product order) with spokes into the entry handle, and the partner server
// top-right with a spoke out of the Agent's source handle. Values resolve
// in rows; wires carry light only. Provenance: see demo-corpus/grounding-v1.md.

const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

// ── Ported brand marks (white/currentColor, from the product or declared) ───

/** Anthropic mark — port of apps/sim/components/icons.tsx AnthropicIcon. */
export const AnthropicMark: React.FC<{size?: number}> = ({size = 20}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" fillRule="evenodd">
		<path d="M13.83 3.52h3.6L24 20h-3.6l-6.57-16.48zm-7.26 0h3.77L16.91 20h-3.67l-1.34-3.46H5.02l-1.34 3.46H0L6.57 3.52zm4.13 9.96L8.45 7.69 6.21 13.48H10.7z" />
	</svg>
);

/** Cursor mark — port of apps/sim/components/icons.tsx CursorIcon. */
export const CursorMark: React.FC<{size?: number}> = ({size = 20}) => (
	<svg width={size} height={size} viewBox="0 0 546 546" fill="#ffffff">
		<path d="m466.38 137.07-206.47-119.2c-6.63-3.83-14.81-3.83-21.44 0l-206.46 119.2c-5.57 3.22-9.01 9.17-9.01 15.62v240.38c0 6.44 3.44 12.4 9.01 15.62l206.47 119.2c6.63 3.83 14.81 3.83 21.44 0l206.47-119.2c5.57-3.22 9.02-9.17 9.02-15.61v-240.37c0-6.44-3.44-12.4-9.01-15.61zm-12.97 25.25-199.32 345.22c-1.35 2.33-4.9 1.38-4.9-1.32v-226.05c0-4.52-2.41-8.69-6.33-10.96l-195.76-113.02c-2.33-1.35-1.38-4.9 1.32-4.9h398.63c5.66 0 9.2 6.14 6.37 11.04h-.009z" />
	</svg>
);

/** VS Code ribbon mark (the product renders this client as text only —
 *  declared deviation in grounding-v1.md). */
export const VSCodeMark: React.FC<{size?: number}> = ({size = 20}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff">
		<path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
	</svg>
);

/** Sim mark — port of apps/sim/components/icons.tsx SimTriggerIcon. */
export const SimMark: React.FC<{size?: number}> = ({size = 18}) => (
	<svg width={size} height={size} viewBox="0 0 222 222" fill="none">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M107.822 93.76C107.822 97.35 106.403 100.792 103.884 103.328L103.523 103.692C101.006 106.236 97.59 107.658 94.02 107.658H13.45C6.02 107.658 0 113.718 0 121.191V208.332C0 215.806 6.02 221.866 13.45 221.866H99.96C107.383 221.866 113.4 215.806 113.4 208.332V126.745C113.4 123.419 114.71 120.228 117.047 117.874C119.377 115.527 122.546 114.207 125.849 114.207H207.777C215.198 114.207 221.214 108.148 221.214 100.674V13.53C221.214 6.06 215.198 0 207.777 0H121.26C113.839 0 107.822 6.06 107.822 13.53V93.76ZM134.078 18.55H194.952C199.289 18.55 202.796 22.09 202.796 26.45V87.76C202.796 92.12 199.289 95.66 194.952 95.66H134.078C129.748 95.66 126.233 92.12 126.233 87.76V26.45C126.233 22.09 129.748 18.55 134.078 18.55Z"
			fill="#ffffff"
		/>
		<path
			d="M207.878 129.57H143.554C135.756 129.57 129.434 135.937 129.434 143.791V207.784C129.434 215.638 135.756 222.005 143.554 222.005H207.878C215.677 222.005 221.999 215.638 221.999 207.784V143.791C221.999 135.937 215.677 129.57 207.878 129.57Z"
			fill="#ffffff"
		/>
	</svg>
);

/** MCP mark — port of apps/sim/components/icons.tsx McpIcon. */
export const McpMark: React.FC<{size?: number}> = ({size = 14}) => (
	<svg width={size} height={size} viewBox="0 0 16 16" fill="none">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14.56 7.88L14.5 7.93L8.7 13.62C8.68 13.64 8.67 13.66 8.66 13.68C8.65 13.7 8.64 13.72 8.64 13.75C8.64 13.77 8.65 13.8 8.66 13.82C8.67 13.84 8.68 13.86 8.7 13.88L8.7 13.88L9.89 15.05C9.99 15.15 10.05 15.29 10.06 15.44C10.06 15.58 10 15.72 9.9 15.83L9.89 15.84C9.78 15.94 9.64 16 9.49 16C9.34 16 9.2 15.94 9.09 15.84L7.9 14.67C7.77 14.55 7.68 14.41 7.61 14.25C7.54 14.09 7.51 13.92 7.51 13.75C7.51 13.58 7.54 13.41 7.61 13.25C7.68 13.1 7.77 12.95 7.9 12.83L13.7 7.14C14.01 6.84 14.19 6.42 14.2 5.98C14.2 5.55 14.04 5.13 13.73 4.81L13.7 4.78L13.67 4.75C13.35 4.44 12.91 4.26 12.47 4.26C12.02 4.26 11.58 4.44 11.26 4.75L6.48 9.44H6.48L6.41 9.5C6.31 9.61 6.16 9.67 6.01 9.67C5.86 9.67 5.72 9.61 5.61 9.5C5.51 9.4 5.45 9.26 5.45 9.12C5.44 8.97 5.5 8.83 5.6 8.73L5.61 8.72L10.46 3.96C11.11 3.32 11.12 2.28 10.49 1.63L10.46 1.6C10.14 1.29 9.7 1.11 9.25 1.11C8.81 1.11 8.37 1.29 8.05 1.6L1.64 7.9C1.53 8 1.38 8.06 1.23 8.06C1.08 8.06 0.94 8 0.83 7.9C0.73 7.79 0.67 7.66 0.67 7.51C0.67 7.36 0.72 7.22 0.82 7.12L0.83 7.11L7.25 0.81C7.79 0.29 8.51 0 9.26 0C10 0 10.72 0.29 11.26 0.81C11.89 1.43 12.19 2.3 12.06 3.17C12.94 3.05 13.83 3.34 14.47 3.96L14.5 3.99C14.76 4.25 14.97 4.54 15.11 4.88C15.25 5.21 15.33 5.56 15.33 5.92C15.34 6.28 15.27 6.64 15.14 6.98C15.01 7.31 14.81 7.62 14.56 7.87M12.87 6.32C12.97 6.22 13.03 6.08 13.03 5.94C13.03 5.79 12.98 5.65 12.88 5.55L12.87 5.54C12.76 5.43 12.61 5.37 12.46 5.37C12.31 5.37 12.17 5.43 12.06 5.54L7.32 10.19C7 10.5 6.56 10.68 6.11 10.68C5.66 10.68 5.23 10.5 4.91 10.19C4.76 10.04 4.63 9.86 4.55 9.66C4.46 9.46 4.42 9.25 4.41 9.03C4.41 8.81 4.45 8.6 4.53 8.4C4.61 8.2 4.73 8.01 4.88 7.86L4.91 7.83L9.66 3.17C9.76 3.07 9.82 2.93 9.82 2.79C9.83 2.64 9.77 2.5 9.67 2.4L9.66 2.39C9.55 2.28 9.41 2.22 9.26 2.22C9.11 2.22 8.96 2.28 8.86 2.39L4.11 7.04C3.85 7.3 3.64 7.6 3.49 7.94C3.35 8.28 3.28 8.64 3.28 9.01C3.28 9.38 3.35 9.74 3.49 10.08C3.64 10.41 3.85 10.72 4.11 10.98C4.65 11.5 5.36 11.79 6.11 11.79C6.86 11.79 7.58 11.5 8.12 10.98L12.87 6.32Z"
			fill="#ffffff"
		/>
	</svg>
);

// ── The product's MCP client list (picker order, top to bottom) ─────────────

export type ClientDef = {name: string; color: string; glyph: React.ReactNode};

export const CLIENTS: ClientDef[] = [
	{name: "Cursor", color: "#000000", glyph: <CursorMark size={19} />},
	{name: "Claude Code", color: "#D97757", glyph: <AnthropicMark size={18} />},
	{name: "Claude Desktop", color: "#D97757", glyph: <AnthropicMark size={18} />},
	{name: "VS Code", color: "#007ACC", glyph: <VSCodeMark size={19} />},
	{name: "Sim", color: "#33C482", glyph: <SimMark size={17} />},
];

export const SLOT_CLAUDE_DESKTOP = 2;
export const SLOT_CURSOR = 0;
export const SLOT_CLAUDE_CODE = 1;
export const SLOT_VSCODE = 3;
export const SLOT_SIM = 4;

// ── Vis helpers (series conventions) ────────────────────────────────────────

export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
	hidden?: boolean;
};

const visOpacity = (v?: BlockVis) =>
	v?.hidden ? 0 : (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

export type EdgeVis = {progress?: number; hi?: number; opacity?: number};

const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

/** One wire in stage coordinates (smooth-step, overflow-visible svg). */
const Wire: React.FC<{x1: number; y1: number; x2: number; y2: number} & EdgeVis> = ({
	x1,
	y1,
	x2,
	y2,
	progress = 1,
	hi = 0,
	opacity = 1,
}) => {
	const pal = usePalette();
	return progress <= 0 || opacity <= 0 ? null : (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, opacity, pointerEvents: "none", overflow: "visible"}}
		>
			<SimEdgePath
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				progress={progress}
				color={edgeColor(hi, pal)}
				thickness={2.25 + 1.25 * hi}
			/>
		</svg>
	);
};

// ── Path geometry for spokes ────────────────────────────────────────────────

/** Caller spoke i: badge right edge → entry target handle. */
export const spokePath = (slot: number) =>
	simEdgeD(SPOKE_X1, badgeCenterY(slot), SPOKE_X2, CHAIN_EDGE_Y);

/**
 * Partner spoke, as data: out of the Agent's source handle, a short hop
 * right into the agent↔response channel, up, then right into the partner
 * badge. Same rounded-elbow language as simEdgeD with the exact length.
 */
export const partnerPath = (): {d: string; len: number} => {
	const {x1, y1, xm, y2, x2} = PARTNER_SPOKE;
	const r = 12;
	const d = `M ${x1} ${y1} L ${xm - r} ${y1} Q ${xm} ${y1} ${xm} ${y1 - r} L ${xm} ${y2 + r} Q ${xm} ${y2} ${xm + r} ${y2} L ${x2} ${y2}`;
	const len = xm - x1 + (y1 - y2) + (x2 - xm) - 4 * r + 2 * 1.55 * r;
	return {d, len};
};

/** Draw-on for the partner spoke (dash-progress on the exact path). */
export const PartnerWire: React.FC<EdgeVis> = ({progress = 1, hi = 0, opacity = 1}) => {
	const pal = usePalette();
	if (progress <= 0 || opacity <= 0) return null;
	const {d, len} = partnerPath();
	return (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, opacity, pointerEvents: "none", overflow: "visible"}}
		>
			<path
				d={d}
				fill="none"
				style={{stroke: edgeColor(hi, pal)}}
				strokeWidth={2.25 + 1.25 * hi}
				strokeDasharray={`${len * progress} 99999`}
				strokeLinecap="round"
			/>
		</svg>
	);
};

// ── PathPulse — WirePulse's light streak on an arbitrary path ───────────────
// Adapted from the branching module's PathPulse; `reverse` plays the reply
// leg (target → source on the same geometry). No cargo, absorbed at ends.

export const PathPulse: React.FC<{
	d: string;
	len: number;
	p: number;
	reverse?: boolean;
	streak?: number;
}> = ({d, len, p, reverse = false, streak = 70}) => {
	if (p <= 0 || p >= 1) return null;
	const op = p > 0.82 ? (1 - p) / 0.18 : 1;
	let dash: string;
	let offset: number;
	if (!reverse) {
		const head = p * len;
		const s = Math.min(streak, head);
		if (s <= 0) return null;
		dash = `${s} ${len + streak}`;
		offset = s - head;
	} else {
		const head = (1 - p) * len; // travels end → start
		const s = Math.min(streak, len - head);
		if (s <= 0) return null;
		dash = `${s} ${len + streak}`;
		offset = -head;
	}
	return (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible"}}
		>
			<path
				d={d}
				fill="none"
				stroke="rgba(51,180,255,0.35)"
				strokeWidth={9}
				strokeLinecap="round"
				strokeDasharray={dash}
				strokeDashoffset={offset}
				opacity={op}
			/>
			<path
				d={d}
				fill="none"
				stroke="#33b4ff"
				strokeWidth={4}
				strokeLinecap="round"
				strokeDasharray={dash}
				strokeDashoffset={offset}
				opacity={op}
			/>
		</svg>
	);
};

// ── Client badge (house grammar mini-card) ──────────────────────────────────

export type BadgeVis = {
	/** popIn 0..1 — render null at 0. */
	reveal?: number;
	/** selection-blue ring: this badge's call is in flight. */
	blue?: number;
	/** green ring: its reply just landed. */
	green?: number;
	dim?: number;
};

export const Badge: React.FC<
	{x: number; y: number; w?: number; name: string; color: string; glyph: React.ReactNode} & BadgeVis
> = ({x, y, w = BADGE_W, name, color, glyph, reveal = 1, blue = 0, green = 0, dim = 0}) => {
	if (reveal <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: w,
				height: BADGE_H,
				transform: `scale(${0.82 + 0.18 * reveal})`,
				transformOrigin: "50% 50%",
				opacity: Math.min(1, reveal * 1.6) * (1 - 0.65 * dim),
				display: "flex",
				alignItems: "center",
				gap: 13,
				padding: "0 14px",
				backgroundColor: "#232323",
				border: "1px solid #3d3d3d",
				borderRadius: 10,
				boxSizing: "border-box",
			}}
		>
			{/* state rings, product language */}
			{blue > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: -2,
						borderRadius: 12,
						boxShadow: `0 0 0 2.5px rgba(51,180,255,${blue})`,
					}}
				/>
			) : null}
			{green > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: -2,
						borderRadius: 12,
						boxShadow: `0 0 0 2.5px rgba(34,197,94,${green})`,
					}}
				/>
			) : null}
			<div
				style={{
					width: 36,
					height: 36,
					borderRadius: 8,
					backgroundColor: color,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flex: "0 0 auto",
					border: color === "#000000" ? "1px solid #3d3d3d" : undefined,
					boxSizing: "border-box",
				}}
			>
				{glyph}
			</div>
			<span
				style={{
					fontSize: 17.5,
					fontWeight: 500,
					color: "#e6e6e6",
					whiteSpace: "nowrap",
				}}
			>
				{name}
			</span>
		</div>
	);
};

// ── The MCP tool pill (deployment identity above the entry) ─────────────────

export const TOOL_NAME = "research_competitor";
export const SERVER_URL = "sim.ai/api/mcp/serve/…"; // UUID ⟨pending⟩ — grounding-v1.md

export const ToolPill: React.FC<{reveal?: number; dimmed?: number}> = ({
	reveal = 1,
	dimmed = 0,
}) => {
	if (reveal <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: PILL.cx,
				top: PILL.y + (1 - reveal) * 14,
				transform: "translateX(-50%)",
				opacity: reveal * (1 - 0.65 * dimmed),
				display: "flex",
				alignItems: "center",
				gap: 13,
				backgroundColor: "#232323",
				border: "1px solid #3d3d3d",
				borderRadius: 14,
				padding: "10px 20px",
				whiteSpace: "nowrap",
			}}
		>
			{/* the deploy modal's "live" marker */}
			<div style={{width: 9, height: 9, borderRadius: 99, backgroundColor: "#22c55e"}} />
			<div style={{display: "flex", flexDirection: "column", gap: 2}}>
				<span style={{fontFamily: MONO, fontSize: 19, color: "#e6e6e6"}}>{TOOL_NAME}</span>
				<span style={{fontFamily: MONO, fontSize: 14, color: "#8d8d8d"}}>{SERVER_URL}</span>
			</div>
		</div>
	);
};

// ── Tool chips on the Agent block ───────────────────────────────────────────

export const CHIP_SEARCH: SimBlockTool = {
	name: "Search",
	color: "#1F40ED",
	glyph: <SearchGlyphW size={14} />,
};
export const CHIP_DOCS: SimBlockTool = {
	name: "Docs",
	color: "#00B0B0",
	glyph: <DatabaseGlyphW size={14} />,
};
/** The flip: someone else's deployed workflow, as an MCP tool chip
 *  (product chip color #6366F1 + McpIcon — tool-input.tsx). */
export const mcpChipDef = (opacity: number, ring: number): SimBlockTool => ({
	name: "pricing_intel",
	color: "#6366F1",
	glyph: <McpMark size={13} />,
	opacity,
	ring,
});

// ── Entry variants (header morphs; the Input row never changes) ─────────────

export type EntryKey = "start" | "api";

const ENTRY_VARIANTS: Record<EntryKey, {name: string; color: string; glyph: React.ReactNode}> = {
	start: {name: "Start", color: BLOCK_COLORS.start, glyph: <StartGlyphW size={22} />},
	api: {name: "API", color: BLOCK_COLORS.api, glyph: <ApiGlyphW size={21} />},
};

// ── The set piece ───────────────────────────────────────────────────────────

export type EconomyRigProps = {
	entry?: BlockVis;
	agent?: BlockVis;
	response?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** Entry header morph Start → API (deploy). */
	entryMix?: number;
	showInHandle?: boolean;
	pill?: {reveal?: number; dimmed?: number};
	/** Client badges by slot (0 Cursor … 4 Sim); absent slot = not present. */
	badges?: Partial<Record<number, BadgeVis>>;
	/** Caller spokes by slot. */
	spokes?: Partial<Record<number, EdgeVis>>;
	/** The partner server (their workspace) + its spoke. */
	partner?: BadgeVis & {spoke?: EdgeVis};
	/** The pricing_intel chip on the Agent's Tools row. */
	mcpChip?: {reveal?: number; ring?: number};
	/** Selection ring on the Search chip ("the agent called its tool"). */
	searchChipRing?: number;
	/** Whether the Agent shows its Tools row at all (on from scene 1). */
	toolsReveal?: number;
	inputResolve?: {text: React.ReactNode; mix: number};
	msgResolve?: {text: React.ReactNode; mix: number};
	respResolve?: {text: React.ReactNode; mix: number};
	tagGlowMsg?: number;
	tagGlowResp?: number;
};

export const EconomyRig: React.FC<EconomyRigProps> = ({
	entry,
	agent,
	response,
	edge1,
	edge2,
	entryMix = 0,
	showInHandle = false,
	pill,
	badges = {},
	spokes = {},
	partner,
	mcpChip,
	searchChipRing = 0,
	toolsReveal = 1,
	inputResolve,
	msgResolve,
	respResolve,
	tagGlowMsg = 0,
	tagGlowResp = 0,
}) => {
	const fromOp = interpolate(entryMix, [0.3, 0.7], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const toOp = interpolate(entryMix, [0.3, 0.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const entryOp = visOpacity(entry);

	const inputValue = inputResolve ? (
		<DipSwap a="Company name" b={inputResolve.text} mix={inputResolve.mix} />
	) : (
		"Company name"
	);

	const entryBlock = (variant: EntryKey, op: number) =>
		op <= 0 ? null : (
			<div style={{position: "absolute", left: blockX(0), top: CHAIN_Y, opacity: entryOp * op}}>
				<SimBlock
					name={ENTRY_VARIANTS[variant].name}
					color={ENTRY_VARIANTS[variant].color}
					glyph={ENTRY_VARIANTS[variant].glyph}
					rows={[{title: "Input", value: inputValue}]}
					hideTargetHandle={!showInHandle}
					highlighted={entry?.highlighted}
					state={entry?.state}
				/>
			</div>
		);

	const tools: SimBlockTool[] = [{...CHIP_SEARCH, ring: searchChipRing}, CHIP_DOCS];
	if (mcpChip && (mcpChip.reveal ?? 0) > 0) {
		tools.push(mcpChipDef(mcpChip.reveal ?? 0, mcpChip.ring ?? 0));
	}

	return (
		<>
			{/* caller spokes (under the badges + blocks) */}
			{Object.entries(spokes).map(([slot, vis]) => {
				const s = Number(slot);
				return (
					<Wire
						key={`spoke-${s}`}
						x1={SPOKE_X1}
						y1={badgeCenterY(s)}
						x2={SPOKE_X2}
						y2={CHAIN_EDGE_Y}
						{...vis}
					/>
				);
			})}
			{partner?.spoke ? <PartnerWire {...partner.spoke} /> : null}
			<Wire x1={edgeX1(0)} y1={CHAIN_EDGE_Y} x2={edgeX2(0)} y2={CHAIN_EDGE_Y} {...edge1} />
			<Wire x1={edgeX1(1)} y1={CHAIN_EDGE_Y} x2={edgeX2(1)} y2={CHAIN_EDGE_Y} {...edge2} />

			{pill ? <ToolPill {...pill} /> : null}

			{/* client badges */}
			{Object.entries(badges).map(([slot, vis]) => {
				const s = Number(slot);
				const def = CLIENTS[s];
				return (
					<Badge
						key={`badge-${s}`}
						x={BADGE_X}
						y={badgeTop(s)}
						name={def.name}
						color={def.color}
						glyph={def.glyph}
						{...vis}
					/>
				);
			})}

			{/* the partner server, top-right */}
			{partner ? (
				<Badge
					x={PARTNER.x}
					y={PARTNER.y}
					w={PARTNER.w}
					name="pricing_intel"
					color="#6366F1"
					glyph={<McpMark size={18} />}
					reveal={partner.reveal}
					blue={partner.blue}
					green={partner.green}
					dim={partner.dim}
				/>
			) : null}

			{entryBlock("start", fromOp)}
			{entryBlock("api", toOp)}

			<div style={{position: "absolute", left: blockX(1), top: CHAIN_Y, opacity: visOpacity(agent)}}>
				<SimBlock
					name="Scout"
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					rows={[
						{title: "Model", value: "claude-sonnet-4-6"},
						{
							title: "Messages",
							value: (
								<>
									{"Research "}
									<ResolvedTag
										tag="<start.input>"
										value={msgResolve?.text ?? ""}
										glow={tagGlowMsg}
										resolve={msgResolve?.mix ?? 0}
									/>
								</>
							),
						},
					]}
					tools={tools}
					toolsReveal={toolsReveal}
					// The pricing_intel chip wraps to a second line; open that
					// line at exact natural height in sync with the chip's
					// width growth (no pop — SimBlock's wrap machinery).
					toolsWrapReveal={mcpChip ? (mcpChip.reveal ?? 0) : 1}
					highlighted={agent?.highlighted}
					state={agent?.state}
				/>
			</div>

			<div
				style={{position: "absolute", left: blockX(2), top: CHAIN_Y, opacity: visOpacity(response)}}
			>
				<SimBlock
					name="Response"
					color={BLOCK_COLORS.response}
					glyph={<ResponseGlyphW size={21} />}
					rows={[
						{
							title: "Data",
							value: (
								<>
									{'{ "brief": '}
									<ResolvedTag
										tag="<scout.content>"
										value={respResolve?.text ?? ""}
										glow={tagGlowResp}
										resolve={respResolve?.mix ?? 0}
									/>
									{" }"}
								</>
							),
						},
						{title: "Status", value: "200"},
					]}
					hideSourceHandle
					highlighted={response?.highlighted}
					state={response?.state}
				/>
			</div>
		</>
	);
};

// ── Choreography ────────────────────────────────────────────────────────────

const c = (t: number, lo: number, hi: number, l2 = 0, h2 = 1) =>
	interpolate(t, [lo, hi], [l2, h2], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

/**
 * A full MCP call: the caller's pulse rides its spoke in, the chain runs
 * (module-5 beat structure), and the reply rides the SAME spoke back to the
 * caller — in MCP the result returns to the client. Badge state: blue while
 * the call is out, a green flash as the reply lands.
 */
export type McpCallBeats = RunBeats & {
	spokeIn: number;
	reply: number;
	badgeBlue: number;
	badgeGreen: number;
};

export const mcpCall = (
	t: number,
	a: number,
	opts: {midDur?: number; hold?: number} = {},
): McpCallBeats => {
	const beats = runBeats(t, a, {hold: 1.1, ...opts});
	const m = opts.midDur ?? 0.7;
	const respStart = a + 1.1 + m + 0.65;
	const replyStart = respStart + 0.55;
	const replyEnd = replyStart + 0.65;
	return {
		...beats,
		spokeIn: c(t, a - 0.7, a - 0.05),
		reply: c(t, replyStart, replyEnd),
		badgeBlue:
			Math.min(c(t, a - 1.0, a - 0.7), c(t, replyStart, replyStart + 0.3, 1, 0)),
		badgeGreen: Math.min(
			c(t, replyEnd - 0.1, replyEnd + 0.15),
			c(t, replyEnd + 1.0, replyEnd + 1.6, 1, 0),
		),
	};
};

/**
 * Rush-mode value chaining: the row dip-swaps from value to value as calls
 * land back to back (no return to template between runs). `times[k]` is the
 * moment value k+1 replaces value k.
 */
export const chainSwap = (
	t: number,
	first: React.ReactNode,
	rest: {at: number; value: React.ReactNode}[],
): React.ReactNode => {
	let node = first;
	for (const {at, value} of rest) {
		node = <DipSwap a={node} b={value} mix={c(t, at, at + 0.35)} />;
	}
	return node;
};

export {c as clamp01};
