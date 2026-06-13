import React from "react";
import {AbsoluteFill, interpolate, interpolateColors} from "remotion";
import {COLORS, usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	ResolvedTag,
	ScheduleGlyphW,
	SimBlock,
	SimEdgePath,
	SimTable,
	Tag,
	WirePulse,
	DipSwap,
	type SimBlockTool,
} from "../../../components";
import {PathPulse} from "../../loops/scenes/_rig";
import {
	CARD_W,
	CHAIN_BLOCK_Y,
	CONT_H,
	CONT_HEADER_H,
	CONT_W,
	CONT_X,
	CONT_Y,
	EDGE1,
	EDGE2,
	ANA_X,
	UPD_X,
	PILL_FONT,
	PILL_H,
	PILL_HANDLE_H,
	PILL_HANDLE_W,
	PILL_LINE_H,
	PILL_W,
	PILL_X,
	PILL_Y,
	SCHED_PILL,
	SCHED_X,
	POLY_X,
	STAGE_H,
	STAGE_W,
	TABLE_X,
	TABLE_Y,
	cameraTo,
	laneEdge,
	laneTop,
	pillEdge,
	type Cam,
	type LaneId,
} from "../layout";
import {
	ANALYST_MODEL,
	BOARD_COLUMNS,
	CURRENT_ITEM_TAG,
	CURRENT_ITEM_VALUE,
	EST_COL,
	EDGE_COL,
	ITEMS_REF,
	SIGNAL_COL,
	NEXT_AFTER,
	NEXT_BEFORE,
	POLY_ROWS,
	SCHED_PHRASE,
	SCHED_ROWS,
	UPDATE_ROWS,
	boardRows,
} from "../data";

// market-desk-v1 set piece (script-v1.md). The `markets` SimTable over
// the desk chain: Schedule → Polymarket → Desk (Parallel container
// holding ONE analyst lane Analyst → Update Board; the four ghost
// instances exist only at runtime fan > 0). All geometry from layout.ts;
// scenes render <Stage/> with state props + cam.

const S = 1.5;
const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

// ── Glyphs (verbatim product icon paths) ─────────────────────────────────────

/** Polymarket mark — apps/sim/components/icons.tsx:6037 (PolymarketIcon),
 *  verbatim path, white fill for the #4C82FB chip. */
export const PolymarketGlyphW: React.FC<{size?: number; color?: string}> = ({
	size = 22,
	color = "#ffffff",
}) => (
	<svg width={size} height={size} viewBox="51 209 123 155">
		<path
			fill={color}
			d="M173.2,363.2L51.1,328.3v-83.7l122.1-34.9V363.2z M161.4,296.2l-89.8,25.6l89.8,25.6L161.4,296.2z M62.9,260.8v51.3l89.8-25.6L62.9,260.8z M161.4,225.3L71.6,251l89.8,25.6L161.4,225.3z"
		/>
	</svg>
);

/** Exa mark — apps/sim/components/icons.tsx:1585 (ExaAIIcon), verbatim
 *  path, white fill for the #1F40ED tool chip. */
export const ExaGlyphW: React.FC<{size?: number; color?: string}> = ({
	size = 14,
	color = "#ffffff",
}) => (
	<svg width={size} height={size} viewBox="0 0 252 304" fill="none">
		<path
			d="M4.82 0.75C5.94 0.75 5.94 0.75 7.09 0.75C7.95 0.75 8.81 0.74 9.69 0.74C10.64 0.74 11.59 0.75 12.57 0.75C13.58 0.75 14.58 0.75 15.62 0.75C19.01 0.74 22.4 0.75 25.79 0.76C28.22 0.76 30.64 0.75 33.06 0.75C38.97 0.75 44.88 0.75 50.79 0.76C57.66 0.77 64.54 0.77 71.41 0.77C83.67 0.77 95.94 0.78 108.2 0.79C120.11 0.81 132.02 0.82 143.93 0.81C144.67 0.81 145.4 0.81 146.16 0.81C146.89 0.81 147.62 0.81 148.38 0.81C161.92 0.81 175.46 0.82 189.01 0.83C193.8 0.83 198.6 0.83 203.4 0.83C209.85 0.83 216.3 0.84 222.75 0.85C225.12 0.85 227.5 0.85 229.87 0.85C233.1 0.85 236.33 0.86 239.55 0.87C240.51 0.86 241.46 0.86 242.44 0.86C248.89 0.89 248.89 0.89 250 2C252.1 17.51 252.1 17.51 247.83 23.73C245.55 26.54 243.02 29.08 240.42 31.59C238.38 33.62 236.64 35.85 234.88 38.13C231.09 42.9 227.24 47.62 223.37 52.33C222.38 53.53 221.4 54.73 220.41 55.94C214.43 63.23 208.44 70.51 202.31 77.69C198.11 82.61 194.1 87.66 190.13 92.76C186.1 97.93 181.88 102.93 177.63 107.91C173.67 112.54 169.84 117.28 166 122C164.5 123.83 163 125.67 161.5 127.5C159.2 130.31 156.91 133.12 154.61 135.93C153.83 136.88 153.05 137.83 152.25 138.81C151.51 139.72 150.78 140.63 150.02 141.56C148.81 143.02 147.58 144.46 146.29 145.85C143.62 148.63 143.62 148.63 143.08 152.29C144.29 155.84 146.41 158.21 148.88 160.94C149.88 162.09 150.89 163.24 151.89 164.39C152.66 165.28 152.66 165.28 153.45 166.18C155.96 169.13 158.32 172.19 160.69 175.25C164.27 179.87 167.99 184.29 171.92 188.61C174.48 191.55 176.86 194.61 179.25 197.69C183.1 202.66 187.07 207.5 191.19 212.25C195.14 216.82 199 221.44 202.75 226.18C206.38 230.72 210.09 235.2 213.79 239.68C217.1 243.7 220.4 247.72 223.69 251.75C226.93 255.73 230.24 259.65 233.56 263.56C238.15 268.96 242.64 274.42 247 280C247.85 280.84 247.85 280.84 248.71 281.7C250.78 285.39 250.31 289.11 250.19 293.25C250.17 294.09 250.16 294.93 250.15 295.8C250.11 297.87 250.06 299.93 250 302C247.72 303.14 246.47 303.13 243.93 303.13C243.08 303.13 242.22 303.14 241.34 303.14C240.39 303.14 239.45 303.14 238.47 303.13C237.47 303.14 236.47 303.14 235.44 303.14C232.06 303.15 228.69 303.15 225.31 303.15C222.9 303.15 220.49 303.15 218.08 303.15C212.2 303.16 206.32 303.17 200.44 303.17C195.66 303.17 190.88 303.17 186.1 303.17C172.57 303.18 159.03 303.19 145.5 303.19C144.77 303.19 144.04 303.19 143.28 303.19C142.55 303.19 141.82 303.19 141.07 303.19C129.21 303.19 117.36 303.19 105.5 303.21C93.34 303.22 81.18 303.23 69.02 303.23C62.19 303.23 55.36 303.23 48.52 303.24C42.1 303.25 35.68 303.25 29.26 303.25C26.89 303.24 24.53 303.25 22.17 303.25C18.95 303.26 15.74 303.26 12.53 303.25C11.58 303.25 10.64 303.26 9.66 303.26C8.81 303.26 7.95 303.25 7.07 303.25C6.32 303.25 5.58 303.25 4.82 303.25C3 303 3 303 1 301C0.75 298.84 0.75 298.84 0.75 296.11C0.74 295.07 0.74 294.02 0.73 292.95C0.74 291.8 0.74 290.65 0.75 289.46C0.74 288.24 0.74 287.02 0.74 285.77C0.73 282.38 0.73 278.99 0.74 275.6C0.74 271.95 0.74 268.3 0.73 264.65C0.72 257.49 0.72 250.34 0.73 243.18C0.73 237.37 0.73 231.55 0.73 225.74C0.73 224.91 0.73 224.09 0.73 223.23C0.73 221.56 0.73 219.88 0.73 218.2C0.72 202.45 0.73 186.7 0.74 170.94C0.75 157.42 0.75 143.89 0.74 130.36C0.73 114.67 0.72 98.97 0.73 83.28C0.73 81.61 0.73 79.93 0.73 78.26C0.73 77.03 0.73 77.03 0.73 75.77C0.74 69.96 0.73 64.15 0.73 58.34C0.72 51.26 0.72 44.19 0.73 37.11C0.74 33.5 0.74 29.88 0.73 26.27C0.73 22.36 0.74 18.45 0.75 14.54C0.74 13.39 0.74 12.24 0.73 11.05C0.74 10.01 0.74 8.97 0.75 7.89C0.75 6.99 0.75 6.09 0.75 5.16C1.08 2.33 1.93 1.15 4.82 0.75ZM39 25C40.5 28.01 41.66 29.99 43.72 32.5C44.26 33.16 44.79 33.81 45.34 34.48C45.91 35.17 46.48 35.85 47.06 36.56C47.65 37.28 48.24 38 48.84 38.73C50.56 40.83 52.28 42.91 54 45C55.5 46.83 57 48.67 58.5 50.5C59.2 51.36 59.91 52.22 60.63 53.11C74.85 70.49 74.85 70.49 81.44 78.94C86.65 85.62 92.04 92.16 97.45 98.7C106.5 109.65 115.41 120.68 124 132C126.94 131.67 127.95 131.05 130.04 128.88C130.75 127.97 131.46 127.06 132.19 126.13C132.98 125.13 133.77 124.12 134.58 123.09C135.38 122.07 136.18 121.05 137 120C138.45 118.2 139.91 116.41 141.38 114.63C142.11 113.72 142.85 112.82 143.61 111.89C146.24 108.71 148.9 105.57 151.56 102.44C155.36 97.97 159.07 93.45 162.71 88.86C167.53 82.84 172.46 76.92 177.37 70.98C181.65 65.78 185.91 60.57 190.16 55.34C193.83 50.84 197.53 46.37 201.3 41.95C209.03 34.26 209.03 34.26 213 25C155.58 25 98.16 25 39 25ZM25 48C25 78.36 25 108.72 25 140C49.42 140 73.84 140 99 140C97.17 135.43 95.23 132.63 92.06 129.06C88.15 124.55 84.35 119.97 80.69 115.25C75.9 109.09 70.96 103.05 65.98 97.04C62.31 92.6 58.69 88.14 55.1 83.63C51.81 79.51 48.48 75.42 45.15 71.34C42.2 67.72 39.27 64.09 36.34 60.45C35.75 59.71 35.16 58.98 34.55 58.22C33.41 56.81 32.27 55.39 31.14 53.96C28.5 50.49 28.5 50.49 25 48ZM25 164C25 194.36 25 224.72 25 256C29.05 252.76 31.89 249.85 34.94 245.81C39.15 240.33 43.47 234.95 47.88 229.63C49.07 228.18 50.26 226.74 51.45 225.3C52.04 224.59 52.63 223.87 53.24 223.14C60.6 214.21 67.86 205.21 74.97 196.08C78.1 192.09 81.33 188.22 84.63 184.38C93.89 174.95 93.89 174.95 99 164C74.58 164 50.16 164 25 164ZM124 172C122.3 173.68 122.3 173.68 120.63 176C119.92 176.91 119.22 177.83 118.5 178.77C118.1 179.28 117.71 179.79 117.3 180.32C114.82 183.51 112.25 186.62 109.69 189.75C105.53 194.85 101.42 199.99 97.38 205.19C93.41 210.27 89.31 215.22 85.12 220.12C81.4 224.48 77.86 228.96 74.34 233.48C69.99 239.05 65.5 244.5 60.99 249.95C57.25 254.48 53.54 259.04 49.89 263.65C46.88 267.4 43.78 271.07 40.69 274.75C38.8 276.8 38.8 276.8 39 279C96.42 279 153.84 279 213 279C211.09 274.23 208.91 271.29 205.56 267.56C201.39 262.81 197.36 258 193.5 253C189.8 248.21 185.97 243.57 182 239C177.55 233.87 173.3 228.62 169.15 223.25C165.88 219.06 162.48 215.01 159 211C154.55 205.88 150.32 200.64 146.16 195.27C142.25 190.25 138.15 185.42 133.97 180.62C131.99 178.33 130.06 176.09 128.34 173.6C127.9 173.07 127.46 172.55 127 172C126.01 172 125.02 172 124 172Z"
			fill={color}
		/>
	</svg>
);

/** Perplexity mark — apps/sim/components/icons.tsx:982 (PerplexityIcon),
 *  verbatim path, white fill for the #20808D tool chip. */
export const PerplexityGlyphW: React.FC<{size?: number; color?: string}> = ({
	size = 14,
	color = "#ffffff",
}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		<path
			d="M19.79 0v7.27H22.5V17.62h-2.93V24l-7.04-6.19v6.15h-1.09v-6.15L4.39 24v-6.46H1.5V7.19h2.88V0l7.05 6.49V.19h1.09v6.49L19.79 0zm-7.26 9.04v7.32l5.95 5.23V14.44l-5.95-5.4zm-1.1-.08l-5.95 5.4v7.24l5.95-5.23V8.97zm8.14 7.58h1.84V8.35H13.46l6.11 5.54v2.66zm-8.98-8.28H2.59v8.2h1.8v-2.58l6.19-5.62zM5.48 2.48v4.71h5.12l-5.11-4.71zm13.22 0l-5.11 4.71h5.12v-4.71z"
			fill={color}
			fillRule="nonzero"
		/>
	</svg>
);

/** Table block glyph — lucide `Table` (block-icons.tsx; module-2's port). */
export const TableGlyphW: React.FC<{size?: number}> = ({size = 22}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 3v18" />
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M3 9h18" />
	</svg>
);

/** Parallel container glyph — lucide SplitIcon (the app's own container
 *  icon, subflows/parallel/parallel-config.ts). Renders DARK on the light
 *  #FEE12B chip per the product's luminance rule (iconClassFor). */
export const SplitGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 24,
	color = "#1c1c1c",
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M16 3h5v5" />
		<path d="M8 3H3v5" />
		<path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
		<path d="m15 9 6-6" />
	</svg>
);

export const PARALLEL_COLOR = "#FEE12B"; // subflows/parallel/parallel-config.ts
export const POLYMARKET_COLOR = "#4C82FB"; // blocks/polymarket.ts bgColor
export const EXA_COLOR = "#1F40ED"; // blocks/exa.ts bgColor
export const PERPLEXITY_COLOR = "#20808D"; // blocks/perplexity.ts bgColor

// ── Shared state grammar (the series' conventions) ──────────────────────────
export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
	hidden?: boolean;
};

export const visOpacity = (v?: BlockVis) =>
	v?.hidden ? 0 : (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

export type EdgeVis = {progress?: number; hi?: number; opacity?: number};

const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

/** Clamped 0..1 ramp over [t0, t1] seconds, optional easing. */
export const ramp = (t: number, t0: number, t1: number, easing?: (n: number) => number) =>
	interpolate(t, [t0, t1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing,
	});

/** Up over [a0,a1], back down over [b0,b1]. */
export const pulseWindow = (t: number, a0: number, a1: number, b0: number, b1: number) =>
	Math.min(ramp(t, a0, a1), 1 - ramp(t, b0, b1));

/** Interpolate the camera between two framings. */
export const camMix = (a: Cam, b: Cam, m: number): Cam => ({
	px: a.px + (b.px - a.px) * m,
	py: a.py + (b.py - a.py) * m,
	s: a.s + (b.s - a.s) * m,
});

// ── Lane state ───────────────────────────────────────────────────────────────
export type LaneState = {
	ana?: BlockVis;
	upd?: BlockVis;
	/** 0..1 — selection ring on the followed Analyst's Exa chip. */
	exaRing?: number;
	/** 0..1 — selection ring on the followed Analyst's Perplexity chip. */
	pplxRing?: number;
	edgeIn?: EdgeVis;
	edgeA?: EdgeVis;
	pulseIn?: number;
	pulseA?: number;
};

export type StageProps = {
	cam: Cam;
	/** 0..1 — whole-world dim toward 0.35 (the editor-card aside). */
	dim?: number;

	// ── table ──
	tableIn?: number;
	rowTextReveal?: (row: number) => number;
	/** 0..1 per row — est/edge/signal fill (text switch at 0.5). */
	fillMix?: (row: number) => number;
	/** 0..1 per row — green output tint on the written cells (1 = full
	 *  pulse; scenes decay it to ~0.35 for the provenance residue). */
	fillTint?: (row: number) => number;
	/** Extra residue on the signal cell of flagged rows (0..1). */
	signalTint?: (row: number) => number;
	/** Product range-selection treatment, 0..1 per cell. */
	cellHi?: (col: number, row: number) => number;

	// ── chain ──
	sched?: BlockVis;
	poly?: BlockVis;
	cont?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	pulse1?: number;
	pulse2?: number;
	pill?: {reveal?: number; swap?: number; dimmed?: number};

	// ── container interior (ONE lane on canvas; fan is runtime only) ──
	/** 0..1 — the runtime fan (0 = single lane, 1 = five instances). */
	fan?: number;
	/** 0..1 — blue blip ring on the inner Start pill. */
	pillBlip?: number;
	lanes?: Partial<Record<LaneId, LaneState>>;
	/** The followed lane's <parallel.currentItem> reference. */
	laneTag?: {glow?: number; resolve?: number};
};

// ── The schedule pill (module-6 deployment marker, schedules-v1 grammar) ────
const SchedulePill: React.FC<{reveal?: number; swap?: number; dimmed?: number}> = ({
	reveal = 1,
	swap = 0,
	dimmed = 0,
}) => {
	if (reveal <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: SCHED_PILL.cx,
				top: SCHED_PILL.y + (1 - reveal) * 14,
				transform: "translateX(-50%)",
				opacity: reveal * (1 - 0.65 * dimmed),
				display: "flex",
				alignItems: "center",
				gap: 12,
				backgroundColor: "#232323",
				border: "1px solid #3d3d3d",
				borderRadius: 999,
				padding: "9px 20px",
				whiteSpace: "nowrap",
			}}
		>
			<div style={{width: 9, height: 9, borderRadius: 99, backgroundColor: "#22c55e"}} />
			<span style={{fontFamily: MONO, fontSize: 20, color: "#cccccc"}}>
				{SCHED_PHRASE}
				{" · Next: "}
				<DipSwap a={NEXT_BEFORE} b={NEXT_AFTER} mix={swap} />
			</span>
		</div>
	);
};

// ── The Desk container (docs preview-container-node port, loops rig) ────────
// vocab-ok: port of the docs' preview-container-node (loops-v1 rig →
// swe-fleet proportions); Phase-A still-review approved this surface.
const DeskContainer: React.FC<{
	vis?: BlockVis;
	pillBlip?: number;
	children?: React.ReactNode;
}> = ({vis, pillBlip = 0, children}) => {
	const pal = usePalette();
	const op = visOpacity(vis);
	if (op <= 0) return null;
	const state = vis?.state ?? "none";
	const ringColor = state === "error" ? "#ef4444" : state === "ok" ? "#22c55e" : COLORS.secondary;
	const showRing = vis?.highlighted || state !== "none";
	const fill = pal.bg === "#1b1b1b" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

	return (
		<div style={{position: "absolute", left: CONT_X, top: CONT_Y, width: CONT_W, height: CONT_H, opacity: op}}>
			{/* Target handle (left, vertical center) */}
			<div
				style={{
					position: "absolute",
					left: -8 * S,
					top: CONT_H / 2 - 10 * S,
					width: 7 * S,
					height: 20 * S,
					backgroundColor: COLORS.wire,
					borderRadius: `${2 * S}px 0 0 ${2 * S}px`,
				}}
			/>
			{/* Source handle (right, vertical center) */}
			<div
				style={{
					position: "absolute",
					right: -8 * S,
					top: CONT_H / 2 - 10 * S,
					width: 7 * S,
					height: 20 * S,
					backgroundColor: COLORS.wire,
					borderRadius: `0 ${2 * S}px ${2 * S}px 0`,
				}}
			/>

			<div
				style={{
					width: "100%",
					height: "100%",
					border: `1px solid ${COLORS.border1}`,
					borderRadius: 8 * S,
					backgroundColor: fill,
					boxSizing: "border-box",
					overflow: "hidden",
				}}
			>
				{/* Header: yellow Split chip + Desk */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 10 * S,
						height: CONT_HEADER_H,
						boxSizing: "border-box",
						padding: `0 ${12 * S}px 0 ${8 * S}px`,
						borderBottom: `1px solid ${COLORS.border1}`,
						backgroundColor: COLORS.surface3,
					}}
				>
					<div
						style={{
							width: 24 * S,
							height: 24 * S,
							borderRadius: 6 * S,
							background: PARALLEL_COLOR,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<SplitGlyph size={16 * S} />
					</div>
					<span style={{fontFamily: FONT, fontWeight: 500, fontSize: 16 * S, color: COLORS.text}}>
						Desk
					</span>
				</div>
			</div>

			{/* Inner Start pill (absolute over the body, like the product) */}
			<div
				style={{
					position: "absolute",
					left: PILL_X - CONT_X,
					top: PILL_Y - CONT_Y,
					width: PILL_W,
					height: PILL_H,
					boxSizing: "border-box",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 8 * S,
					border: `1px solid ${COLORS.border1}`,
					backgroundColor: COLORS.surface2,
				}}
			>
				<span
					style={{
						fontFamily: FONT,
						fontWeight: 500,
						fontSize: PILL_FONT,
						lineHeight: `${PILL_LINE_H}px`,
						color: COLORS.text,
					}}
				>
					Start
				</span>
				<div
					style={{
						position: "absolute",
						right: -8 * S,
						top: PILL_H / 2 - PILL_HANDLE_H / 2,
						width: PILL_HANDLE_W,
						height: PILL_HANDLE_H,
						backgroundColor: COLORS.wire,
						borderRadius: `0 ${2 * S}px ${2 * S}px 0`,
					}}
				/>
				{pillBlip > 0 ? (
					<div
						style={{
							position: "absolute",
							inset: 0,
							borderRadius: 8 * S,
							boxShadow: `inset 0 0 0 ${1.75 * S}px ${COLORS.secondary}`,
							opacity: pillBlip,
						}}
					/>
				) : null}
			</div>

			{children}

			{showRing ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						borderRadius: 8 * S,
						boxShadow: `inset 0 0 0 ${1.75 * S}px ${ringColor}`,
						pointerEvents: "none",
					}}
				/>
			) : null}
		</div>
	);
};

// ── Ghost instance block (runtime fan only; header-only SimBlock) ───────────
const ghostBlock = (
	key: string,
	x: number,
	top: number,
	name: string,
	color: string,
	glyph: React.ReactNode,
	vis: BlockVis | undefined,
	extra: number,
	hideSource: boolean,
) => {
	const op = visOpacity(vis) * extra;
	return op <= 0 ? null : (
		<div key={key} style={{position: "absolute", left: x - CONT_X, top: top - CONT_Y, opacity: op}}>
			<SimBlock
				name={name}
				color={color}
				glyph={glyph}
				hideSourceHandle={hideSource}
				highlighted={vis?.highlighted}
				state={vis?.state}
			/>
		</div>
	);
};

// ── The Stage ────────────────────────────────────────────────────────────────
export const Stage: React.FC<StageProps> = ({
	cam,
	dim = 0,
	tableIn = 1,
	rowTextReveal,
	fillMix,
	fillTint,
	signalTint,
	cellHi,
	sched,
	poly,
	cont,
	edge1,
	edge2,
	pulse1 = 0,
	pulse2 = 0,
	pill,
	fan = 0,
	pillBlip = 0,
	lanes = {},
	laneTag,
}) => {
	const pal = usePalette();
	const worldOp = 1 - 0.65 * dim;
	const camT = cameraTo(cam.px, cam.py, cam.s);

	const mixFor = (r: number) => (fillMix ? fillMix(r) : 0);
	const rows = boardRows(mixFor);
	const textOp = (c: number, r: number) => {
		const reveal = rowTextReveal ? rowTextReveal(r) : 1;
		if (c === EST_COL || c === EDGE_COL || c === SIGNAL_COL) {
			const mix = mixFor(r);
			const dipped = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
			return reveal * dipped;
		}
		return reveal;
	};

	// The followed lane's Messages value — the bare reference (a verb
	// prefix made the tag truncate mid-name on render; the instruction
	// lives in the agent's system prompt, which isn't drawn).
	const tagResolve = laneTag?.resolve ?? 0;
	const anaMessages = (
		<>
			{tagResolve > 0 ? (
				<ResolvedTag
					tag={CURRENT_ITEM_TAG}
					value={CURRENT_ITEM_VALUE}
					glow={laneTag?.glow ?? 0}
					resolve={tagResolve}
				/>
			) : (
				<Tag text={CURRENT_ITEM_TAG} glow={laneTag?.glow ?? 0} />
			)}
		</>
	);

	const midLane = lanes[2];
	const analystTools: SimBlockTool[] = [
		{name: "Exa", color: EXA_COLOR, glyph: <ExaGlyphW size={14} />, ring: midLane?.exaRing ?? 0},
		{
			name: "Perplexity",
			color: PERPLEXITY_COLOR,
			glyph: <PerplexityGlyphW size={14} />,
			ring: midLane?.pplxRing ?? 0,
		},
	];

	// Inner edges for one lane (drawn inside the container's SVG).
	const laneEdges = (lane: LaneId, extra: number) => {
		const st = lanes[lane];
		const eIn = pillEdge(lane, fan);
		const eA = laneEdge(lane, fan);
		return (
			<g key={`edges-${lane}`}>
				<g opacity={(st?.edgeIn?.opacity ?? 1) * extra}>
					<SimEdgePath
						x1={eIn.x1}
						y1={eIn.y1}
						x2={eIn.x2}
						y2={eIn.y2}
						progress={st?.edgeIn?.progress ?? 1}
						color={edgeColor(st?.edgeIn?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (st?.edgeIn?.hi ?? 0)}
					/>
				</g>
				<g opacity={(st?.edgeA?.opacity ?? 1) * extra}>
					<SimEdgePath
						x1={eA.x1}
						y1={eA.y}
						x2={eA.x2}
						y2={eA.y}
						progress={st?.edgeA?.progress ?? 1}
						color={edgeColor(st?.edgeA?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (st?.edgeA?.hi ?? 0)}
					/>
				</g>
				<PathPulse x1={eIn.x1} y1={eIn.y1} x2={eIn.x2} y2={eIn.y2} p={st?.pulseIn ?? 0} />
				<PathPulse x1={eA.x1} y1={eA.y} x2={eA.x2} y2={eA.y} p={st?.pulseA ?? 0} />
			</g>
		);
	};

	const ghostLane = (lane: LaneId) => {
		const st = lanes[lane];
		const top = laneTop(lane, fan);
		return (
			<React.Fragment key={`lane-${lane}`}>
				{ghostBlock(`ana-${lane}`, ANA_X, top, "Analyst", BLOCK_COLORS.agent, <AgentGlyphW size={22} />, st?.ana, fan, false)}
				{ghostBlock(`upd-${lane}`, UPD_X, top, "Update Board", BLOCK_COLORS.table, <TableGlyphW size={22} />, st?.upd, fan, true)}
			</React.Fragment>
		);
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: worldOp,
					transform: `translate(${camT.tx}px, ${camT.ty}px) scale(${cam.s})`,
					transformOrigin: "0 0",
				}}
			>
				{/* ── the markets table ── */}
				{/* The green output tint on written cells is the table's OWN
				    business: `cellTint` renders it inside each grid cell (clipped,
				    pixel-aligned by construction), ramped by the per-row fill pulse
				    and decaying to the provenance residue. We never hand-position an
				    overlay div over the grid — an overlay has to re-derive the cell
				    geometry and drifts the moment the table reflows. The est/edge/
				    signal columns carry the fill; the signal column keeps a touch
				    more (the flagged-signal residue). */}
				{tableIn > 0 ? (
					<div style={{position: "absolute", left: TABLE_X, top: TABLE_Y, opacity: tableIn}}>
						<SimTable
							columns={BOARD_COLUMNS}
							rows={rows}
							cellHighlight={cellHi}
							cellTextOpacity={textOp}
							cellTint={(c, r) => {
								const fill = fillTint ? fillTint(r) : 0;
								const sig = signalTint ? signalTint(r) : 0;
								if (c === SIGNAL_COL && Math.max(fill, sig) > 0)
									return {kind: "output", strength: Math.max(fill, sig)};
								if ((c === EST_COL || c === EDGE_COL) && fill > 0)
									return {kind: "output", strength: fill};
								return null;
							}}
						/>
					</div>
				) : null}

				{/* ── outer wires + pulses ── */}
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
					<g opacity={edge2?.opacity ?? 1}>
						<SimEdgePath
							x1={EDGE2.x1}
							y1={EDGE2.y}
							x2={EDGE2.x2}
							y2={EDGE2.y}
							progress={edge2?.progress ?? 1}
							color={edgeColor(edge2?.hi ?? 0, pal)}
							thickness={2.25 + 1.25 * (edge2?.hi ?? 0)}
						/>
					</g>
				</svg>
				{pulse1 > 0 && pulse1 < 1 ? (
					<WirePulse x1={EDGE1.x1} x2={EDGE1.x2} y={EDGE1.y} p={pulse1} />
				) : null}
				{pulse2 > 0 && pulse2 < 1 ? (
					<WirePulse x1={EDGE2.x1} x2={EDGE2.x2} y={EDGE2.y} p={pulse2} />
				) : null}

				{/* ── the armed-schedule pill ── */}
				{pill ? <SchedulePill {...pill} /> : null}

				{/* ── Schedule ── */}
				{visOpacity(sched) > 0 ? (
					<div style={{position: "absolute", left: SCHED_X, top: CHAIN_BLOCK_Y, opacity: visOpacity(sched)}}>
						<SimBlock
							name="Schedule"
							color={BLOCK_COLORS.schedule}
							glyph={<ScheduleGlyphW size={22} />}
							rows={SCHED_ROWS}
							hideTargetHandle
							highlighted={sched?.highlighted}
							state={sched?.state}
						/>
					</div>
				) : null}

				{/* ── Polymarket (Get Markets) ── */}
				{visOpacity(poly) > 0 ? (
					<div style={{position: "absolute", left: POLY_X, top: CHAIN_BLOCK_Y, opacity: visOpacity(poly)}}>
						<SimBlock
							name="Polymarket"
							color={POLYMARKET_COLOR}
							glyph={<PolymarketGlyphW size={22} />}
							rows={POLY_ROWS}
							highlighted={poly?.highlighted}
							state={poly?.state}
						/>
					</div>
				) : null}

				{/* ── the Desk container + the lane ── */}
				<DeskContainer vis={cont} pillBlip={pillBlip}>
					{/* Inner edges + pulses, clipped to the container box. */}
					<svg
						width={CONT_W}
						height={CONT_H}
						viewBox={`${CONT_X} ${CONT_Y} ${CONT_W} ${CONT_H}`}
						style={{position: "absolute", inset: 0, pointerEvents: "none"}}
					>
						{fan > 0 ? ([0, 1, 3, 4] as LaneId[]).map((l) => laneEdges(l, fan)) : null}
						{laneEdges(2, 1)}
					</svg>

					{/* Ghost instances (RUNTIME fan only: header-only pairs). */}
					{fan > 0 ? ([0, 1, 3, 4] as LaneId[]).map(ghostLane) : null}

					{/* The followed lane (full rows) — the canvas's ONE lane. */}
					<div style={{position: "absolute", left: ANA_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.ana)}}>
						<SimBlock
							name="Analyst"
							color={BLOCK_COLORS.agent}
							glyph={<AgentGlyphW size={22} />}
							rows={[
								{title: "Messages", value: anaMessages},
								{title: "Model", value: ANALYST_MODEL},
							]}
							tools={analystTools}
							highlighted={midLane?.ana?.highlighted}
							state={midLane?.ana?.state}
						/>
					</div>
					<div style={{position: "absolute", left: UPD_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.upd)}}>
						<SimBlock
							name="Update Board"
							color={BLOCK_COLORS.table}
							glyph={<TableGlyphW size={22} />}
							rows={UPDATE_ROWS}
							hideSourceHandle
							highlighted={midLane?.upd?.highlighted}
							state={midLane?.upd?.state}
						/>
					</div>
				</DeskContainer>
			</div>
		</AbsoluteFill>
	);
};

// ── The Desk editor card (scene 3 zoom-aside) ────────────────────────────────
// Labels verbatim from the product's subflow editor: "Parallel Type" /
// "Parallel Each" (use-subflow-editor.ts) and "Parallel Items"
// (subflow-editor.tsx); the items value is the wiring reference.
// Rendered in VIEWPORT space, as a sibling overlay above the dimmed world
// (zoom-aside archetype: overlay over dimmed content, no connector lines).
const CARD_VX = 1290;
const CARD_VY = 300;

// vocab-ok: port of the product's subflow-editor panel (zoom-aside grammar;
// swe-fleet FleetConfigCard precedent — same anatomy, Desk identity).
export const DeskConfigCard: React.FC<{
	opacity: number;
	slide: number; // 0 = in place, 1 = offscreen-right offset
	itemsGlow?: number;
}> = ({opacity, slide, itemsGlow = 0}) => {
	if (opacity <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: CARD_VX + 80 * slide,
				top: CARD_VY,
				width: CARD_W,
				opacity,
				backgroundColor: COLORS.surface1,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: 8 * S,
				boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
				overflow: "hidden",
			}}
		>
			{/* Header — chip + block name, like the panel's title row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 10 * S,
					padding: `${10 * S}px ${14 * S}px`,
					borderBottom: `1px solid ${COLORS.border1}`,
					backgroundColor: COLORS.surface3,
				}}
			>
				<div
					style={{
						width: 24 * S,
						height: 24 * S,
						borderRadius: 6 * S,
						background: PARALLEL_COLOR,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<SplitGlyph size={16 * S} />
				</div>
				<span style={{fontFamily: FONT, fontWeight: 500, fontSize: 16 * S, color: COLORS.text}}>
					Desk
				</span>
			</div>
			<div style={{padding: `${14 * S}px ${14 * S}px ${16 * S}px`}}>
				<div style={{fontFamily: FONT, fontSize: 13 * S, color: COLORS.textTertiary, marginBottom: 8}}>
					Parallel Type
				</div>
				<div
					style={{
						fontFamily: FONT,
						fontSize: 14 * S,
						color: COLORS.text,
						padding: `${8 * S}px ${10 * S}px`,
						border: `1px solid ${COLORS.border1}`,
						borderRadius: 6 * S,
						backgroundColor: COLORS.surface2,
						marginBottom: 14 * S,
					}}
				>
					Parallel Each
				</div>
				<div style={{fontFamily: FONT, fontSize: 13 * S, color: COLORS.textTertiary, marginBottom: 8}}>
					Parallel Items
				</div>
				<div
					style={{
						fontFamily: MONO,
						fontSize: 14 * S,
						padding: `${8 * S}px ${10 * S}px`,
						border: `1px solid ${COLORS.border1}`,
						borderRadius: 6 * S,
						backgroundColor: COLORS.surface2,
					}}
				>
					<Tag text={ITEMS_REF} glow={itemsGlow} />
				</div>
			</div>
		</div>
	);
};
