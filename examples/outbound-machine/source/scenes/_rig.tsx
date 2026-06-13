import React from "react";
import {AbsoluteFill, interpolate, interpolateColors} from "remotion";
import {COLORS, usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	ResolvedTag,
	SimBlock,
	SimEdgePath,
	SimTable,
	Tag,
	WirePulse,
	type SimBlockTool,
} from "../../../components";
import {PathPulse} from "../../loops/scenes/_rig";
import {
	ApolloGlyph,
	APOLLO_COLOR,
	EnrichmentGlyph,
	ENRICH_COLOR,
	HunterGlyph,
	HUNTER_COLOR,
	InstantlyGlyph,
	INSTANTLY_COLOR,
	PARALLEL_COLOR,
	SplitGlyph,
	TableGlyph,
	TABLE_COLOR,
} from "./_glyphs";
import {
	APOLLO_LEFT,
	CARD_W,
	CELL_H,
	CHAIN_BLOCK_Y,
	COL_NATIVE_W,
	COL_W,
	CONT_H,
	CONT_HEADER_H,
	CONT_W,
	CONT_X,
	CONT_Y,
	EDGE1,
	EDGE2,
	ENG_X,
	PERS_X,
	PILL_FONT,
	PILL_H,
	PILL_HANDLE_H,
	PILL_HANDLE_W,
	PILL_LINE_H,
	PILL_W,
	PILL_X,
	PILL_Y,
	SEND_X,
	STAGE_H,
	STAGE_W,
	TABLE_SCALE,
	TABLE_X,
	TABLE_Y,
	WB_X,
	cameraTo,
	cellY,
	colX,
	laneEdgeA,
	laneEdgeB,
	laneTop,
	pillEdge,
	type Cam,
	type LaneId,
} from "../layout";
import {
	APOLLO_ROWS,
	CONTACT_TAG,
	CONTACT_VALUE,
	CURRENT_ITEM_TAG,
	CURRENT_ITEM_VALUE,
	ENRICH_ROWS,
	INSTANTLY_ROWS,
	ITEMS_REF,
	MESSAGE_COL,
	OUTBOUND_COLUMNS,
	RESULTS_REF,
	TABLE_NAME,
	WB_OPERATION,
	PERSONALIZE_MODEL,
	outboundRows,
} from "../data";

// outbound-machine-v1 set piece (script-v1.md). The `outbound` SimTable over
// the machine chain: Apollo → Enrich (Parallel container holding the
// per-lead lane Data Enrichment → Personalize → Instantly, ×6 when fanned)
// → Table (Batch Insert Rows — the write-back). All geometry from
// layout.ts; scenes render <Stage/> with state props + cam.

const S = 1.5;
const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

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
	enr?: BlockVis;
	pers?: BlockVis;
	send?: BlockVis;
	/** 0..1 — provider-cascade chip ring on the Data Enrichment block. */
	providerRing?: number;
	edgeIn?: EdgeVis;
	edgeA?: EdgeVis;
	edgeB?: EdgeVis;
	pulseIn?: number;
	pulseA?: number;
	pulseB?: number;
};

export type TagState = {glow?: number; resolve?: number};

export type StageProps = {
	cam: Cam;
	/** 0..1 — whole-world dim toward 0.35 (the editor-card aside). */
	dim?: number;

	// ── table (the grid pane the run writes into) ──
	tableIn?: number;
	/** 0..1 per column — the header assembling left→right (scene 1). */
	colIn?: (col: number) => number;
	/** 0..1 — the product's range-selection treatment over the EMPTY pane
	 *  (scene 1's collective pulse; drawn as an overlay because un-landed
	 *  rows are invisible pane, so per-cell highlights can't carry it). */
	paneSel?: number;
	/** 0..1 per TABLE row (landed order): the record row LANDING — gates the
	 *  row's chrome (number, gridlines). Un-landed rows are empty pane. */
	rowLand?: (row: number) => number;
	/** 0..1 per (col,row): the cell's left→right sweep within a landing row
	 *  (text appears at >=0.5). Defaults to rowLand. */
	cellFill?: (col: number, row: number) => number;
	/** 0..1 per (col,row): green output tint on a written cell (decays to
	 *  residue on the status column — the sent wall). */
	cellTint?: (col: number, row: number) => number;
	/** Product range-selection treatment, 0..1 per cell. */
	cellHi?: (col: number, row: number) => number;

	// ── chain ──
	apollo?: BlockVis;
	cont?: BlockVis;
	wb?: BlockVis; // the Table block (write-back)
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	pulse1?: number;
	pulse2?: number;
	/** 0..1 — glow on the Table block's <parallel.results> Rows tag. */
	wbTagGlow?: number;

	// ── container interior ──
	/** 0..1 — the enrichment fan (0 = single lane, 1 = six lanes). */
	fan?: number;
	/** 0..1 — blip ring on the inner Start pill. */
	pillBlip?: number;
	lanes?: Partial<Record<LaneId, LaneState>>;
	/** `<parallel.currentItem>` on the followed Data Enrichment (scene 4). */
	itemTag?: TagState;
	/** `<enrich.contact>` on the followed Personalize (scene 5). */
	contactTag?: TagState;
};

// ── The Enrich container (docs preview-container-node port, loops rig) ──────
// vocab-ok: port of the docs' preview-container-node (Parallel container
// anatomy — loops/uc-data-enrichment rig grammar), not an invented surface.
const EnrichContainer: React.FC<{
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
				{/* Header: yellow Split chip + Enrich */}
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
						Enrich
					</span>
				</div>
			</div>

			{/* Inner Start pill */}
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

// ── Ghost lane block (compact, header-only) ─────────────────────────────────
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

// Wide columns wrap (the message column). Per-column native widths.
const WRAP_COLS = [MESSAGE_COL];

// ── The Stage ────────────────────────────────────────────────────────────────
export const Stage: React.FC<StageProps> = ({
	cam,
	dim = 0,
	tableIn = 1,
	colIn,
	paneSel = 0,
	rowLand,
	cellFill,
	cellTint,
	cellHi,
	apollo,
	cont,
	wb,
	edge1,
	edge2,
	pulse1 = 0,
	pulse2 = 0,
	wbTagGlow = 0,
	fan = 0,
	pillBlip = 0,
	lanes = {},
	itemTag,
	contactTag,
}) => {
	const pal = usePalette();
	const worldOp = 1 - 0.65 * dim;
	const camT = cameraTo(cam.px, cam.py, cam.s);

	const landAt = (r: number) => (rowLand ? rowLand(r) : 1);
	const fillAt = (c: number, r: number) => (cellFill ? cellFill(c, r) : landAt(r));
	const rows = outboundRows(fillAt);

	// Cell text: type/dip in over the second half of the cell's fill sweep.
	const textOp = (c: number, r: number) =>
		interpolate(fillAt(c, r), [0.5, 1], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	// The followed lane's references (each resolves at its own scene's beat).
	const contactResolve = contactTag?.resolve ?? 0;
	const persMessages = (
		<>
			{"Opener for "}
			{contactResolve > 0 ? (
				<ResolvedTag
					tag={CONTACT_TAG}
					value={CONTACT_VALUE}
					glow={contactTag?.glow ?? 0}
					resolve={contactResolve}
				/>
			) : (
				<Tag text={CONTACT_TAG} glow={contactTag?.glow ?? 0} />
			)}
		</>
	);
	const itemResolve = itemTag?.resolve ?? 0;
	const enrInput =
		itemResolve > 0 ? (
			<ResolvedTag tag={CURRENT_ITEM_TAG} value={CURRENT_ITEM_VALUE} glow={itemTag?.glow ?? 0} resolve={itemResolve} />
		) : (
			<Tag text={CURRENT_ITEM_TAG} glow={itemTag?.glow ?? 0} />
		);

	const midLane = lanes[2];
	const providerChip: SimBlockTool = {
		name: "Hunter",
		color: HUNTER_COLOR,
		glyph: <HunterGlyph size={13} />,
		ring: midLane?.providerRing ?? 0,
	};

	// Inner edges for one lane.
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
				{ghostBlock(`enr-${lane}`, ENG_X, top, "Data Enrichment", ENRICH_COLOR, <EnrichmentGlyph size={22} />, st?.enr, fan, false, false)}
				{ghostBlock(`pers-${lane}`, PERS_X, top, "Personalize", BLOCK_COLORS.agent, <AgentGlyphW size={22} />, st?.pers, fan, false, false)}
				{ghostBlock(`send-${lane}`, SEND_X, top, "Instantly", INSTANTLY_COLOR, <InstantlyGlyph size={22} />, st?.send, fan, false, true)}
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
				{/* ── the outbound table (grid pane; rows LAND during write-back) ── */}
				{tableIn > 0 ? (
					<div style={{position: "absolute", left: TABLE_X, top: TABLE_Y, opacity: tableIn}}>
						<SimTable
							columns={OUTBOUND_COLUMNS}
							rows={rows}
							scale={TABLE_SCALE}
							colWidths={COL_NATIVE_W}
							wrapCols={WRAP_COLS}
							cellHighlight={cellHi}
							cellTextOpacity={textOp}
							rowOpacity={landAt}
							colOpacity={colIn}
						/>
					</div>
				) : null}

				{/* Scene 1's collective selection pulse over the EMPTY pane — the
				    product's range treatment (selection border + tint) drawn as an
				    overlay because un-landed rows are invisible pane. */}
				{paneSel > 0 ? (
					<div
						style={{
							position: "absolute",
							left: colX(0),
							top: cellY(0),
							width: COL_W.reduce((a, b) => a + b, 0),
							height: CELL_H * 6,
							boxSizing: "border-box",
							border: `${2 * TABLE_SCALE}px solid var(--selection)`,
							backgroundColor: "rgba(37,99,235,0.06)",
							opacity: paneSel,
							pointerEvents: "none",
						}}
					/>
				) : null}

				{/* Green output tint on written cells (the product's table tint
				    rgba(51,196,130) ramped by the write pulse, decaying to a
				    residue on the status column — the sent wall). */}
				{cellTint
					? rows.map((_, r) =>
							rows[r].map((__, c) => {
								const tint = cellTint(c, r);
								if (tint <= 0) return null;
								return (
									<div
										key={`tint-${c}-${r}`}
										style={{
											position: "absolute",
											left: colX(c),
											top: cellY(r),
											width: COL_W[c],
											height: CELL_H - 2,
											backgroundColor: `rgba(51,196,130,${0.24 * tint})`,
											pointerEvents: "none",
										}}
									/>
								);
							}),
						)
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

				{/* ── Apollo (find companies) ── */}
				{visOpacity(apollo) > 0 ? (
					<div style={{position: "absolute", left: APOLLO_LEFT, top: CHAIN_BLOCK_Y, opacity: visOpacity(apollo)}}>
						<SimBlock
							name="Apollo"
							color={APOLLO_COLOR}
							glyph={<ApolloGlyph size={22} />}
							rows={APOLLO_ROWS}
							hideTargetHandle
							highlighted={apollo?.highlighted}
							state={apollo?.state}
						/>
					</div>
				) : null}

				{/* ── the Enrich container + lanes ── */}
				<EnrichContainer vis={cont} pillBlip={pillBlip}>
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
					<div style={{position: "absolute", left: ENG_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.enr)}}>
						<SimBlock
							name="Data Enrichment"
							color={ENRICH_COLOR}
							glyph={<EnrichmentGlyph size={22} />}
							rows={[
								{title: "Operation", value: ENRICH_ROWS[0].value},
								{title: "Input", value: enrInput},
							]}
							tools={[providerChip]}
							highlighted={midLane?.enr?.highlighted}
							state={midLane?.enr?.state}
						/>
					</div>
					<div style={{position: "absolute", left: PERS_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.pers)}}>
						<SimBlock
							name="Personalize"
							color={BLOCK_COLORS.agent}
							glyph={<AgentGlyphW size={22} />}
							rows={[
								{title: "Messages", value: persMessages},
								{title: "Model", value: PERSONALIZE_MODEL},
							]}
							highlighted={midLane?.pers?.highlighted}
							state={midLane?.pers?.state}
						/>
					</div>
					<div style={{position: "absolute", left: SEND_X - CONT_X, top: laneTop(2, fan) - CONT_Y, opacity: visOpacity(midLane?.send)}}>
						<SimBlock
							name="Instantly"
							color={INSTANTLY_COLOR}
							glyph={<InstantlyGlyph size={22} />}
							rows={INSTANTLY_ROWS}
							hideSourceHandle
							highlighted={midLane?.send?.highlighted}
							state={midLane?.send?.state}
						/>
					</div>
				</EnrichContainer>

				{/* ── the Table block (write-back) ── */}
				{visOpacity(wb) > 0 ? (
					<div style={{position: "absolute", left: WB_X, top: CHAIN_BLOCK_Y, opacity: visOpacity(wb)}}>
						<SimBlock
							name="Table"
							color={TABLE_COLOR}
							glyph={<TableGlyph size={22} />}
							rows={[
								{title: "Operation", value: WB_OPERATION},
								{title: "Table", value: TABLE_NAME},
								{title: "Rows", value: <Tag text={RESULTS_REF} glow={wbTagGlow} />},
							]}
							hideSourceHandle
							highlighted={wb?.highlighted}
							state={wb?.state}
						/>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

// ── The editor card (scene 3 zoom-aside; loops ConfigCard grammar) ──────────
// vocab-ok: the loops ConfigCard zoom-aside grammar (the product's block
// editor panel for the Parallel container's two fields), a declared aside.
const CARD_VX = 1230;
const CARD_VY = 300;

export const EnrichConfigCard: React.FC<{
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
					Enrich
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
