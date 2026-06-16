import React from "react";
import {AbsoluteFill, interpolate} from "remotion";
import {COLORS, usePalette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	ResolvedTag,
	SimBlock,
	SimEdgePath,
	SimTable,
	WirePulse,
	type SimCell,
} from "../../../components";
import {edgeColor} from "../../module-1-workflows/scenes/_local";
import {
	blockX,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	cameraTo,
	edgeX1,
	edgeX2,
	STAGE_H,
	STAGE_W,
	TABLE_X,
	TABLE_Y,
} from "../layoutV2";
import {
	CATEGORY_COL,
	CLASSIFY_TAG,
	CLASSIFY_TAG_VALUE,
	LEADS,
	LEADS_COLUMNS,
	QUERY_ROWS,
	STATUS_AFTER,
	STATUS_BEFORE,
	STATUS_COL,
	UPDATE_ROWS,
} from "../dataV2";

// The ONE set piece of the v2 cut: the `leads` table over the docs'
// table-roundtrip chain (Table Query Rows → Classify → Table Update Rows),
// both at layoutV2 geometry. Scenes render <Stage/> and differ only in
// state props + camera. See script-v2.md for the grounding trace.

/** Table block glyph — lucide `Table`, the product's icon for the table
 *  block (apps/docs/components/workflow-preview/block-icons.tsx). */
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

export type Cam = {px: number; py: number; s: number};

/** Clamped 0..1 ramp over [t0, t1] (seconds), optional easing. */
export const ramp = (t: number, t0: number, t1: number, easing?: (n: number) => number) =>
	interpolate(t, [t0, t1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing,
	});

/** Up at [a0,a1], back down at [b0,b1]. */
export const pulseWindow = (t: number, a0: number, a1: number, b0: number, b1: number) =>
	Math.min(ramp(t, a0, a1), 1 - ramp(t, b0, b1));

/** Interpolate the camera between two framings. */
export const camMix = (a: Cam, b: Cam, m: number): Cam => ({
	px: a.px + (b.px - a.px) * m,
	py: a.py + (b.py - a.py) * m,
	s: a.s + (b.s - a.s) * m,
});

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

export type StageProps = {
	cam?: Cam;
	/** 0..1 — whole-world dim multiplier toward 0.35 (record scene). */
	dim?: number;

	// ── table state ──
	/** 0..1 — the grid (chrome + headers) fading in (scene 1). */
	tableIn?: number;
	/** 0..1 per row — the row's VALUES appearing (scene 1 assemble). */
	rowTextReveal?: (row: number) => number;
	/** 0..1 per row — category fills + status flips (DipSwap inside cells). */
	writeMix?: (row: number) => number;
	/** Product range-selection treatment, 0..1 per cell. */
	cellHi?: (col: number, row: number) => number;
	/** 0..1 per column — header outline glint. */
	colHeaderHi?: (col: number) => number;

	// ── chain state ──
	/** When false the chain is NOT in the tree (scenes 1–2). */
	chainOn?: boolean;
	query?: BlockVis;
	classify?: BlockVis;
	update?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** 0..1 travel — light streaks on the wires. */
	pulse1?: number;
	pulse2?: number;
	/** Classify's <table.rows> reference. */
	tagGlow?: number;
	tagResolve?: number;
};

export const Stage: React.FC<StageProps> = ({
	cam,
	dim = 0,
	tableIn = 1,
	rowTextReveal,
	writeMix,
	cellHi,
	colHeaderHi,
	chainOn = true,
	query,
	classify,
	update,
	edge1,
	edge2,
	pulse1 = 0,
	pulse2 = 0,
	tagGlow = 0,
	tagResolve = 0,
}) => {
	const worldOp = 1 - 0.65 * dim;

	// Cell contents. Category/status dip-swap through writeMix: text switches
	// at mix 0.5 while cellTextOpacity dips to 0 and back (DipSwap semantics).
	const mixFor = (row: number) => (writeMix ? writeMix(row) : 0);
	const rows: SimCell[][] = LEADS.map((lead, r) => {
		const mix = mixFor(r);
		return [
			{text: lead.company},
			{text: lead.industry},
			{text: mix < 0.5 ? "" : lead.category},
			{text: mix < 0.5 ? STATUS_BEFORE : STATUS_AFTER},
		];
	});

	const textOp = (c: number, r: number) => {
		const reveal = rowTextReveal ? rowTextReveal(r) : 1;
		if (c === CATEGORY_COL || c === STATUS_COL) {
			const mix = mixFor(r);
			const dip = mix <= 0 ? 1 : Math.min(1, Math.abs(mix - 0.5) * 4);
			return reveal * dip;
		}
		return reveal;
	};

	const camT = cam ? cameraTo(cam.px, cam.py, cam.s) : null;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: worldOp,
					transform: camT ? `translate(${camT.tx}px, ${camT.ty}px) scale(${cam!.s})` : undefined,
					transformOrigin: "0 0",
				}}
			>
				{/* ── the leads table ── */}
				{tableIn > 0 ? (
					<div style={{position: "absolute", left: TABLE_X, top: TABLE_Y, opacity: tableIn}}>
						<SimTable
							columns={LEADS_COLUMNS}
							rows={rows}
							cellHighlight={cellHi}
							colHeaderHighlight={colHeaderHi}
							cellTextOpacity={textOp}
						/>
					</div>
				) : null}

				{/* ── the roundtrip chain ── */}
				{chainOn ? (
					<>
						<ChainEdge i={0} {...edge1} />
						<ChainEdge i={1} {...edge2} />
						{pulse1 > 0 && pulse1 < 1 ? (
							<WirePulse x1={edgeX1(0)} x2={edgeX2(0)} y={CHAIN_EDGE_Y} p={pulse1} />
						) : null}
						{pulse2 > 0 && pulse2 < 1 ? (
							<WirePulse x1={edgeX1(1)} x2={edgeX2(1)} y={CHAIN_EDGE_Y} p={pulse2} />
						) : null}

						{visOpacity(query) > 0 ? (
							<div
								style={{
									position: "absolute",
									left: blockX(0),
									top: CHAIN_Y,
									opacity: visOpacity(query),
								}}
							>
								<SimBlock
									name="Table"
									color={BLOCK_COLORS.table}
									glyph={<TableGlyphW size={22} />}
									rows={QUERY_ROWS}
									hideTargetHandle
									highlighted={query?.highlighted}
									state={query?.state}
								/>
							</div>
						) : null}

						{visOpacity(classify) > 0 ? (
							<div
								style={{
									position: "absolute",
									left: blockX(1),
									top: CHAIN_Y,
									opacity: visOpacity(classify),
								}}
							>
								<SimBlock
									name="Classify"
									color={BLOCK_COLORS.agent}
									glyph={<AgentGlyphW size={22} />}
									rows={[
										{
											title: "Messages",
											value: (
												<>
													{"Classify "}
													<ResolvedTag
														tag={CLASSIFY_TAG}
														value={CLASSIFY_TAG_VALUE}
														glow={tagGlow}
														resolve={tagResolve}
													/>
												</>
											),
										},
									]}
									highlighted={classify?.highlighted}
									state={classify?.state}
								/>
							</div>
						) : null}

						{visOpacity(update) > 0 ? (
							<div
								style={{
									position: "absolute",
									left: blockX(2),
									top: CHAIN_Y,
									opacity: visOpacity(update),
								}}
							>
								<SimBlock
									name="Table"
									color={BLOCK_COLORS.table}
									glyph={<TableGlyphW size={22} />}
									rows={UPDATE_ROWS}
									hideSourceHandle
									highlighted={update?.highlighted}
									state={update?.state}
								/>
							</div>
						) : null}
					</>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

const ChainEdge: React.FC<{i: 0 | 1} & EdgeVis> = ({i, progress = 1, hi = 0, opacity = 1}) => {
	const pal = usePalette();
	if (progress <= 0 || opacity <= 0) return null;
	return (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
		>
			<SimEdgePath
				x1={edgeX1(i)}
				y1={CHAIN_EDGE_Y}
				x2={edgeX2(i)}
				y2={CHAIN_EDGE_Y}
				progress={progress}
				color={edgeColor(hi, pal)}
				thickness={2.25 + 1.25 * hi}
			/>
		</svg>
	);
};

// ── Shared range helper ─────────────────────────────────────────────────────
/** category + status columns of every row — what the update writes. */
export const writeRangeHi =
	(mixFor: (row: number) => number) => (c: number, r: number) =>
		c === CATEGORY_COL || c === STATUS_COL ? mixFor(r) : 0;
