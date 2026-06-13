import React from "react";
import {AbsoluteFill, interpolate, interpolateColors} from "remotion";
import {COLORS, usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DipSwap,
	ResolvedTag,
	ScheduleGlyphW,
	SimBlock,
	SimEdgePath,
	SimTable,
	Tag,
	WirePulse,
	type SimBlockTool,
} from "../../../components";
import {PathPulse} from "../../loops/scenes/_rig";
import {
	CARD_W,
	CELL_H,
	CHAIN_BLOCK_Y,
	COL_W,
	CONT_H,
	CONT_HEADER_H,
	CONT_W,
	CONT_X,
	CONT_Y,
	EDGE1,
	EDGE2,
	ENG_X,
	GH_X,
	MD_X,
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
	QUERY_X,
	STAGE_H,
	STAGE_W,
	TABLE_X,
	TABLE_Y,
	cameraTo,
	cellX,
	cellY,
	laneEdgeA,
	laneEdgeB,
	laneTop,
	pillEdge,
	type Cam,
	type LaneId,
} from "../layout";
import {
	BACKLOG_COLUMNS,
	CURRENT_ITEM_TAG,
	CURRENT_ITEM_VALUE,
	ENG_MODEL,
	GH_ROWS,
	ITEMS_REF,
	MD_ROWS,
	NEXT_AFTER,
	NEXT_BEFORE,
	PR_COL,
	QUERY_ROWS,
	SCHED_PHRASE,
	SCHED_ROWS,
	STATUS_COL,
	backlogRows,
} from "../data";

// swe-fleet-v1 set piece (script-v1.md). The `backlog` SimTable over the
// fleet chain: Schedule → Get Issues → Fleet (Parallel container holding
// the coding lane Engineer → GitHub → Mark Done, ×5 when fanned). All
// geometry from layout.ts; scenes render <Stage/> with state props + cam.

const S = 1.5;
const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

// ── Glyphs ───────────────────────────────────────────────────────────────────

/** GitHub mark — apps/sim/components/icons.tsx:718 (GithubIcon), verbatim
 *  path, white fill for the dark #181C1E chip. */
export const GithubGlyphW: React.FC<{size?: number; color?: string}> = ({
	size = 22,
	color = "#ffffff",
}) => (
	<svg width={size} height={size} viewBox="0 0 26 26">
		<path
			d="M13 0C11.29 0 9.6 0.34 8.03 0.99C6.45 1.64 5.01 2.6 3.81 3.81C1.37 6.25 0 9.55 0 13C0 18.75 3.73 23.62 8.89 25.35C9.54 25.45 9.75 25.05 9.75 24.7V22.5C6.15 23.28 5.38 20.76 5.38 20.76C4.78 19.25 3.94 18.85 3.94 18.85C2.76 18.04 4.03 18.07 4.03 18.07C5.33 18.16 6.02 19.41 6.02 19.41C7.15 21.39 9.06 20.8 9.8 20.49C9.92 19.64 10.26 19.07 10.62 18.75C7.74 18.42 4.71 17.3 4.71 12.35C4.71 10.91 5.2 9.75 6.05 8.83C5.92 8.5 5.46 7.15 6.18 5.4C6.18 5.4 7.27 5.04 9.75 6.72C10.78 6.44 11.9 6.29 13 6.29C14.11 6.29 15.22 6.44 16.25 6.72C18.73 5.04 19.83 5.4 19.83 5.4C20.54 7.15 20.09 8.5 19.95 8.83C20.8 9.75 21.29 10.91 21.29 12.35C21.29 17.32 18.25 18.41 15.35 18.73C15.82 19.14 16.25 19.93 16.25 21.14V24.7C16.25 25.05 16.46 25.47 17.12 25.35C22.28 23.61 26 18.75 26 13C26 11.29 25.66 9.6 25.01 8.03C24.36 6.45 23.4 5.01 22.19 3.81C20.99 2.6 19.55 1.64 17.97 0.99C16.4 0.34 14.71 0 13 0Z"
			fill={color}
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
export const GITHUB_COLOR = "#181C1E"; // blocks/github.ts bgColor

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
	eng?: BlockVis;
	gh?: BlockVis;
	md?: BlockVis;
	/** 0..1 — selection ring on the Engineer's GitHub tool chip. */
	chipRing?: number;
	edgeIn?: EdgeVis;
	edgeA?: EdgeVis;
	edgeB?: EdgeVis;
	pulseIn?: number;
	pulseA?: number;
	pulseB?: number;
};

export type StageProps = {
	cam: Cam;
	/** 0..1 — whole-world dim toward 0.35 (the editor-card aside). */
	dim?: number;

	// ── table ──
	tableIn?: number;
	rowTextReveal?: (row: number) => number;
	/** 0..1 per row — open→done dip + pr fill (text switch at 0.5). */
	flipMix?: (row: number) => number;
	/** 0..1 per row — green output tint on the written cells (1 = full
	 *  pulse; scenes decay it to ~0.35 for the provenance residue). */
	flipTint?: (row: number) => number;
	/** Product range-selection treatment, 0..1 per cell. */
	cellHi?: (col: number, row: number) => number;

	// ── chain ──
	sched?: BlockVis;
	query?: BlockVis;
	cont?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	pulse1?: number;
	pulse2?: number;
	pill?: {reveal?: number; swap?: number; dimmed?: number};

	// ── container interior ──
	/** 0..1 — the fleet fan (0 = single lane, 1 = five lanes). */
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

// ── The Fleet container (docs preview-container-node port, loops rig) ───────
const FleetContainer: React.FC<{
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
				{/* Header: yellow Split chip + Fleet */}
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
						Fleet
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

// ── Lane rendering ───────────────────────────────────────────────────────────

const ghostBlock = (
	key: string,
	x: number,
	top: number,
	name: string,
	color: string,
	glyph: React.ReactNode,
	vis: BlockVis | undefined,
	extra: number,
	hideTarget: boolean,
	hideSource: boolean,
) => {
	const op = visOpacity(vis) * extra;
	return op <= 0 ? null : (
		<div key={key} style={{position: "absolute", left: x - CONT_X, top: top - CONT_Y, opacity: op}}>
			<SimBlock
				name={name}
				color={color}
				glyph={glyph}
				hideTargetHandle={hideTarget}
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
	flipMix,
	flipTint,
	cellHi,
	sched,
	query,
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

	const mixFor = (r: number) => (flipMix ? flipMix(r) : 0);
	const rows = backlogRows(mixFor);
	const textOp = (c: number, r: number) => {
		const reveal = rowTextReveal ? rowTextReveal(r) : 1;
		if (c === STATUS_COL || c === PR_COL) {
			const mix = mixFor(r);
			const dipped = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
			return reveal * dipped;
		}
		return reveal;
	};

	// The followed lane's Messages value.
	const tagResolve = laneTag?.resolve ?? 0;
	const engMessages = (
		<>
			{"Fix "}
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
	const githubChip: SimBlockTool = {
		name: "GitHub",
		color: GITHUB_COLOR,
		glyph: <GithubGlyphW size={14} />,
		ring: midLane?.chipRing ?? 0,
	};

	// Inner edge for one lane (drawn inside the container's SVG).
	const laneEdges = (lane: LaneId, extra: number) => {
		const st = lanes[lane];
		const eIn = pillEdge(lane, fan);
		const eA = laneEdgeA(lane, fan);
		const eB = laneEdgeB(lane, fan);
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
				<g opacity={(st?.edgeB?.opacity ?? 1) * extra}>
					<SimEdgePath
						x1={eB.x1}
						y1={eB.y}
						x2={eB.x2}
						y2={eB.y}
						progress={st?.edgeB?.progress ?? 1}
						color={edgeColor(st?.edgeB?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (st?.edgeB?.hi ?? 0)}
					/>
				</g>
				<PathPulse x1={eIn.x1} y1={eIn.y1} x2={eIn.x2} y2={eIn.y2} p={st?.pulseIn ?? 0} />
				<PathPulse x1={eA.x1} y1={eA.y} x2={eA.x2} y2={eA.y} p={st?.pulseA ?? 0} />
				<PathPulse x1={eB.x1} y1={eB.y} x2={eB.x2} y2={eB.y} p={st?.pulseB ?? 0} />
			</g>
		);
	};

	const ghostLane = (lane: LaneId) => {
		const st = lanes[lane];
		const top = laneTop(lane, fan);
		return (
			<React.Fragment key={`lane-${lane}`}>
				{ghostBlock(`eng-${lane}`, ENG_X, top, "Engineer", BLOCK_COLORS.agent, <AgentGlyphW size={22} />, st?.eng, fan, false, false)}
				{ghostBlock(`gh-${lane}`, GH_X, top, "GitHub", GITHUB_COLOR, <GithubGlyphW size={22} />, st?.gh, fan, false, false)}
				{ghostBlock(`md-${lane}`, MD_X, top, "Mark Done", BLOCK_COLORS.table, <TableGlyphW size={22} />, st?.md, fan, false, true)}
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
				{/* ── the backlog table ── */}
				{tableIn > 0 ? (
					<div style={{position: "absolute", left: TABLE_X, top: TABLE_Y, opacity: tableIn}}>
						<SimTable
							columns={BACKLOG_COLUMNS}
							rows={rows}
							cellHighlight={cellHi}
							cellTextOpacity={textOp}
						/>
					</div>
				) : null}

				{/* Green output tint on written cells (the product's table tint
				    color, rgba(51,196,130) — SimTable's own TINT_BG ramped by
				    the flip pulse, decaying to the provenance residue). */}
				{flipTint
					? rows.map((_, r) => {
							const tint = flipTint(r);
							if (tint <= 0) return null;
							return (
								<div
									key={`tint-${r}`}
									style={{
										position: "absolute",
										left: cellX(STATUS_COL),
										top: cellY(r),
										width: 2 * COL_W,
										height: CELL_H - 2,
										backgroundColor: `rgba(51,196,130,${0.22 * tint})`,
										pointerEvents: "none",
									}}
								/>
							);
						})
					: null}

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

				{/* ── Get Issues (Table query) ── */}
				{visOpacity(query) > 0 ? (
					<div style={{position: "absolute", left: QUERY_X, top: CHAIN_BLOCK_Y, opacity: visOpacity(query)}}>
						<SimBlock
							name="Get Issues"
							color={BLOCK_COLORS.table}
							glyph={<TableGlyphW size={22} />}
							rows={QUERY_ROWS}
							highlighted={query?.highlighted}
							state={query?.state}
						/>
					</div>
				) : null}

				{/* ── the Fleet container + lanes ── */}
				<FleetContainer vis={cont} pillBlip={pillBlip}>
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

					{/* Ghost lanes (compact: header-only triplets). */}
					{fan > 0 ? ([0, 1, 3, 4] as LaneId[]).map(ghostLane) : null}

					{/* The followed lane (full rows). */}
					<div style={{position: "absolute", left: ENG_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.eng)}}>
						<SimBlock
							name="Engineer"
							color={BLOCK_COLORS.agent}
							glyph={<AgentGlyphW size={22} />}
							rows={[
								{title: "Messages", value: engMessages},
								{title: "Model", value: ENG_MODEL},
							]}
							tools={[githubChip]}
							highlighted={midLane?.eng?.highlighted}
							state={midLane?.eng?.state}
						/>
					</div>
					<div style={{position: "absolute", left: GH_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.gh)}}>
						<SimBlock
							name="GitHub"
							color={GITHUB_COLOR}
							glyph={<GithubGlyphW size={22} />}
							rows={GH_ROWS}
							highlighted={midLane?.gh?.highlighted}
							state={midLane?.gh?.state}
						/>
					</div>
					<div style={{position: "absolute", left: MD_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.md)}}>
						<SimBlock
							name="Mark Done"
							color={BLOCK_COLORS.table}
							glyph={<TableGlyphW size={22} />}
							rows={MD_ROWS}
							hideSourceHandle
							highlighted={midLane?.md?.highlighted}
							state={midLane?.md?.state}
						/>
					</div>
				</FleetContainer>
			</div>
		</AbsoluteFill>
	);
};

// ── The editor card (scene 3 zoom-aside; loops ConfigCard grammar) ──────────
// Verbatim editor content: "Parallel Type" (subflow-editor.tsx:128), type
// label "Parallel Each" (use-subflow-editor.ts typeLabels), "Parallel
// Items" (subflow-editor.tsx:159); the items value is the wiring reference.
// Rendered in VIEWPORT space, as a sibling overlay above the dimmed world
// (zoom-aside archetype: overlay over dimmed content, no connector lines).
const CARD_VX = 1290;
const CARD_VY = 300;

export const FleetConfigCard: React.FC<{
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
					Fleet
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
