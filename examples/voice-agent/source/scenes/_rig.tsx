import React from "react";
import {interpolateColors} from "remotion";
import {COLORS, usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	CanvasDots,
	SimBlock,
	SimEdgePath,
	SimTable,
	StartGlyphW,
	Tag,
	simEdgeD,
	type SimCell,
	type SimColumn,
} from "../../../components";
import {
	CALL_X,
	CAMP_X,
	CHAIN_BLOCK_Y,
	CONT_H,
	CONT_HEADER_H,
	CONT_W,
	CONT_X,
	CONT_Y,
	EDGE1,
	EDGE2,
	LANE_HANDLE_Y,
	LANE_TOP,
	LOG_X,
	PANEL_H,
	PANEL_W,
	PANEL_Y,
	PILL_FONT,
	PILL_H,
	PILL_HANDLE_H,
	PILL_HANDLE_W,
	PILL_LINE_H,
	PILL_W,
	PILL_X,
	PILL_Y,
	START_X,
	STAGE_H,
	STAGE_W,
	TABLE_SCALE,
	TABLE_X,
	TABLE_Y,
	cameraTo,
	ghostHandleY,
	ghostTop,
	laneEdge,
	panelX,
	pillEdge,
	type Cam,
	type GhostId,
} from "../layout";
import {LANES, TABLE_ROWS_DATA} from "../transcript-data";
import {AgentPhoneGlyphW, CallPanel, TableGlyphW, type Turn} from "./_parts";

// The whole video is ONE set piece (see ../layout.ts): the product-true
// workflow band (Start → Campaign → Parallel "Call each" with its ONE lane:
// Call → Log outcome) over the aside band (three call panels + the real
// SimTable). Scenes render one <Stage/> and differ only in state props and
// camera. SimBlock renders only real registry blocks; the call panels and
// the table are SEPARATE aside boxes — never inside the container, never
// over a block (case 17 as amended by the hype2 verdicts).

const S = 1.5;

// Parallel container identity — subflows/parallel/parallel-config.ts
// (SplitIcon, #FEE12B, dark glyph per the product's luminance rule).
export const PARALLEL_COLOR = "#FEE12B";
// AgentPhone chip — the registry's own gradient (agentphone.ts bgColor).
export const AGENTPHONE_BG = "linear-gradient(135deg, #1a1a1a 0%, #0a2a14 100%)";

const lucide = (size: number, color: string, paths: string[]) => (
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
		{paths.map((d) => (
			<path key={d} d={d} />
		))}
	</svg>
);

export const SplitGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 24,
	color = "#1c1c1c",
}) =>
	lucide(size, color, [
		"M16 3h5v5",
		"M8 3H3v5",
		"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",
		"m15 9 6-6",
	]);

// ── Shared state types (branching/loops grammar) ────────────────────────────
export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};
export type EdgeVis = {progress?: number; hi?: number; opacity?: number};

export const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));
const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

/** WirePulse's streak language along a smooth-step path (loops device). */
export const PathPulse: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	p: number;
	streak?: number;
}> = ({x1, y1, x2, y2, p, streak = 80}) => {
	if (p <= 0 || p >= 1) return null;
	const {d, len} = simEdgeD(x1, y1, x2, y2);
	const head = p * len;
	const s = Math.min(streak, head);
	if (s <= 0) return null;
	const op = p > 0.82 ? (1 - p) / 0.18 : 1;
	const dash = `${s} ${len + streak}`;
	return (
		<>
			<path
				d={d}
				fill="none"
				stroke="rgba(51,180,255,0.35)"
				strokeWidth={9}
				strokeLinecap="round"
				strokeDasharray={dash}
				strokeDashoffset={s - head}
				opacity={op}
			/>
			<path
				d={d}
				fill="none"
				stroke="#33b4ff"
				strokeWidth={4}
				strokeLinecap="round"
				strokeDasharray={dash}
				strokeDashoffset={s - head}
				opacity={op}
			/>
		</>
	);
};

// ── The Parallel container (docs preview-container-node port ×1.5; loops/
// growth-machine anatomy) at this video's geometry. ─────────────────────────
// vocab-ok: port of apps/docs preview-container-node (the loops-v1 rig) at
// this video's layout.ts geometry — product anatomy, not an invented surface.
const ParallelContainer: React.FC<{
	name: string;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
	dimmed?: number;
	pillBlip?: number;
	children?: React.ReactNode;
}> = ({name, highlighted = false, state = "none", dimmed = 1, pillBlip = 0, children}) => {
	const pal = usePalette();
	const ringColor = state === "error" ? "#ef4444" : state === "ok" ? "#22c55e" : COLORS.secondary;
	const showRing = highlighted || state !== "none";
	const fill = pal.bg === "#1b1b1b" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

	return (
		<div
			style={{
				position: "absolute",
				left: CONT_X,
				top: CONT_Y,
				width: CONT_W,
				height: CONT_H,
				opacity: dimmed,
			}}
		>
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
				{/* Header */}
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
						<SplitGlyph size={16 * S} color="#1c1c1c" />
					</div>
					<span
						style={{
							fontFamily:
								'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
							fontWeight: 500,
							fontSize: 16 * S,
							color: COLORS.text,
							whiteSpace: "nowrap",
						}}
					>
						{name}
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
						fontFamily:
							'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
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

			{/* Children: the inner edges + the ONE lane (+ runtime ghosts) */}
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

// ── Panel + table state ──────────────────────────────────────────────────────
export type PanelState = {
	/** 0..1 — panel birth (popIn). 0 = not born (renders nothing). */
	visible?: number;
	/** How many transcript turns are shown (0..3); lastReveal eases the last. */
	turnCount?: number;
	lastReveal?: number;
	/** Waveform amplitude 0..1 (agent speaking ⇄ listening). */
	speaking?: number;
	ended?: boolean;
	outcomeReveal?: number;
	dim?: number;
};

export type StageState = {
	cam: Cam;
	/** 0..1 — dims the whole workflow band (scene-4 lean-in de-focus). */
	workflowDim?: number;
	start?: BlockVis;
	campaign?: BlockVis;
	container?: BlockVis;
	call?: BlockVis;
	log?: BlockVis;
	/** 0..1 — glow on Call's <parallel.currentItem> reference tag. */
	tagGlow?: number;
	/** 0..1 — the runtime fan: ghost instance pairs separate from the lane. */
	fan?: number;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	pillE?: EdgeVis;
	laneE?: EdgeVis;
	pulse1?: number;
	pulse2?: number;
	pulsePill?: number;
	/** Pulse on the lane edge Call → Log outcome (the insert event). */
	pulseLane?: number;
	pillBlip?: number;
	/** 0..1 boundary quiet gate (scenes/_anim.ts): gates waveform amplitude
	 *  and the dot pulse so every cut lands on a settled frame. */
	quiet?: number;
	/** The aside band. */
	panels?: [PanelState, PanelState, PanelState];
	/** 0..1 — the outcomes SimTable's presence (header-only when no rows). */
	tableReveal?: number;
	/** Per-row landing 0..1 (row absent below 0.01). */
	rowReveal?: [number, number, number];
	/** Per-row quiet re-pulse (bookend retell). */
	rowPulse?: [number, number, number];
};

/** The transcript turn sequence for a lane, cut to `count` turns. */
export const turnsFor = (lane: 0 | 1 | 2, count: number, lastReveal = 1): Turn[] => {
	const L = LANES[lane];
	const seq: Turn[] = [
		{kind: "agent", text: L.agentLines[0]},
		{kind: "human", lines: L.humanReplies[0]},
		{kind: "agent", text: L.agentLines[1]},
	];
	return seq
		.slice(0, Math.max(0, Math.min(seq.length, count)))
		.map((t, i, arr) => (i === arr.length - 1 ? {...t, reveal: lastReveal} : t));
};

// The outcomes table schema (module-2 lowercase style; status = registry enum).
const TABLE_COLUMNS: SimColumn[] = [
	{name: "to", type: "text"},
	{name: "outcome", type: "text"},
	{name: "status", type: "text"},
];

// ── The Stage ────────────────────────────────────────────────────────────────
export const Stage: React.FC<{frame: number; state: StageState}> = ({frame, state}) => {
	const pal = usePalette();
	const {
		cam,
		workflowDim = 0,
		start,
		campaign,
		container,
		call,
		log,
		tagGlow = 0,
		fan = 0,
		edge1,
		edge2,
		pillE,
		laneE,
		pulse1 = 0,
		pulse2 = 0,
		pulsePill = 0,
		pulseLane = 0,
		pillBlip = 0,
		quiet = 1,
		panels = [{}, {}, {}],
		tableReveal = 0,
		rowReveal = [0, 0, 0],
		rowPulse = [0, 0, 0],
	} = state;
	const {tx, ty} = cameraTo(cam.px, cam.py, cam.s);

	// Lane edges at the real lane's axis; ghost edges at theirs.
	const ePill = pillEdge(LANE_HANDLE_Y);
	const eLane = laneEdge(LANE_HANDLE_Y);

	const ghostLane = (g: GhostId) => {
		if (fan <= 0) return null;
		const top = ghostTop(g, fan);
		const hy = ghostHandleY(g, fan);
		const gp = pillEdge(hy);
		const gl = laneEdge(hy);
		return (
			<React.Fragment key={g}>
				<svg
					width={CONT_W}
					height={CONT_H}
					viewBox={`${CONT_X} ${CONT_Y} ${CONT_W} ${CONT_H}`}
					style={{position: "absolute", inset: 0, pointerEvents: "none", opacity: fan}}
				>
					<SimEdgePath x1={gp.x1} y1={gp.y1} x2={gp.x2} y2={gp.y2} color={pal.wire} />
					<SimEdgePath x1={gl.x1} y1={gl.y} x2={gl.x2} y2={gl.y} color={pal.wire} />
				</svg>
				<div style={{position: "absolute", left: CALL_X - CONT_X, top: top - CONT_Y, opacity: fan}}>
					<SimBlock name="Call" color={AGENTPHONE_BG} glyph={<AgentPhoneGlyphW size={30} />} />
				</div>
				<div style={{position: "absolute", left: LOG_X - CONT_X, top: top - CONT_Y, opacity: fan}}>
					<SimBlock
						name="Log outcome"
						color={BLOCK_COLORS.table}
						glyph={<TableGlyphW size={22} />}
						hideSourceHandle
					/>
				</div>
			</React.Fragment>
		);
	};

	// Table rows: only landed rows exist (the grid grows as Insert Row runs).
	const landedRows: SimCell[][] = TABLE_ROWS_DATA.filter((_, ri) => rowReveal[ri] > 0.01).map(
		(r) => r.map((text) => ({text})),
	);
	const landedIdx = TABLE_ROWS_DATA.map((_, ri) => ri).filter((ri) => rowReveal[ri] > 0.01);

	return (
		// Outer, untransformed: the canvas background — scene comps render
		// the Stage standalone (verify-boundaries, stills), so it lives here.
		<div style={{position: "absolute", inset: 0, backgroundColor: pal.bg}}>
		<div
			style={{
				position: "absolute",
				inset: 0,
				transform: `translate(${tx}px, ${ty}px) scale(${cam.s})`,
				transformOrigin: "0 0",
			}}
		>
			<div style={{position: "absolute", left: 0, top: 0, width: STAGE_W, height: STAGE_H}}>
				<CanvasDots />

				{/* ════ TOP BAND — the workflow (product-true, left→right) ════ */}
				<div style={{position: "absolute", inset: 0, opacity: 1 - 0.62 * workflowDim}}>
					{/* Outer edges + pulses (under the blocks) */}
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
						<PathPulse x1={EDGE1.x1} y1={EDGE1.y} x2={EDGE1.x2} y2={EDGE1.y} p={pulse1} />
						<PathPulse x1={EDGE2.x1} y1={EDGE2.y} x2={EDGE2.x2} y2={EDGE2.y} p={pulse2} />
					</svg>

					{/* Start trigger — header-only */}
					<div
						style={{
							position: "absolute",
							left: START_X,
							top: CHAIN_BLOCK_Y,
							opacity: visOpacity(start),
						}}
					>
						<SimBlock
							name="Start"
							color={BLOCK_COLORS.start}
							glyph={<StartGlyphW size={22} />}
							hideTargetHandle
							highlighted={start?.highlighted}
							state={start?.state}
						/>
					</div>

					{/* Campaign agent */}
					<div
						style={{
							position: "absolute",
							left: CAMP_X,
							top: CHAIN_BLOCK_Y,
							opacity: visOpacity(campaign),
						}}
					>
						<SimBlock
							name="Campaign"
							color={BLOCK_COLORS.agent}
							glyph={<AgentGlyphW size={22} />}
							rows={[
								{title: "Messages", value: "Confirm appointments"},
								{title: "Model", value: "claude-sonnet-4.6"},
							]}
							highlighted={campaign?.highlighted}
							state={campaign?.state}
						/>
					</div>

					{/* The Parallel container — ONE lane; ghosts are runtime-only */}
					<ParallelContainer
						name="Call each"
						highlighted={container?.highlighted}
						state={container?.state ?? "none"}
						dimmed={visOpacity(container)}
						pillBlip={pillBlip}
					>
						{/* Ghost instance pairs (under the real lane) */}
						{ghostLane("a")}
						{ghostLane("b")}

						{/* Inner edges + pulses, container-local coordinates */}
						<svg
							width={CONT_W}
							height={CONT_H}
							viewBox={`${CONT_X} ${CONT_Y} ${CONT_W} ${CONT_H}`}
							style={{position: "absolute", inset: 0, pointerEvents: "none"}}
						>
							<g opacity={pillE?.opacity ?? 1}>
								<SimEdgePath
									x1={ePill.x1}
									y1={ePill.y1}
									x2={ePill.x2}
									y2={ePill.y2}
									progress={pillE?.progress ?? 1}
									color={edgeColor(pillE?.hi ?? 0, pal)}
									thickness={2.25 + 1.25 * (pillE?.hi ?? 0)}
								/>
							</g>
							<g opacity={laneE?.opacity ?? 1}>
								<SimEdgePath
									x1={eLane.x1}
									y1={eLane.y}
									x2={eLane.x2}
									y2={eLane.y}
									progress={laneE?.progress ?? 1}
									color={edgeColor(laneE?.hi ?? 0, pal)}
									thickness={2.25 + 1.25 * (laneE?.hi ?? 0)}
								/>
							</g>
							<PathPulse x1={ePill.x1} y1={ePill.y1} x2={ePill.x2} y2={ePill.y2} p={pulsePill} />
							<PathPulse x1={eLane.x1} y1={eLane.y} x2={eLane.x2} y2={eLane.y} p={pulseLane} />
						</svg>

						{/* THE lane: Call (AgentPhone) → Log outcome (Table) */}
						<div
							style={{
								position: "absolute",
								left: CALL_X - CONT_X,
								top: LANE_TOP - CONT_Y,
								opacity: visOpacity(call),
							}}
						>
							<SimBlock
								name="Call"
								color={AGENTPHONE_BG}
								glyph={<AgentPhoneGlyphW size={30} />}
								rows={[
									{title: "Operation", value: "Create Call"},
									{
										// Display-shortened from the verbatim sub-block title
										// "To Phone Number" (declared deviation, script-v1.md):
										// the full title forces the reference tag — the beat —
										// to ellipsize at the product's 250-native block width.
										title: "To Number",
										value: <Tag text="<parallel.currentItem>" glow={tagGlow} />,
									},
								]}
								highlighted={call?.highlighted}
								state={call?.state}
							/>
						</div>
						<div
							style={{
								position: "absolute",
								left: LOG_X - CONT_X,
								top: LANE_TOP - CONT_Y,
								opacity: visOpacity(log),
							}}
						>
							<SimBlock
								name="Log outcome"
								color={BLOCK_COLORS.table}
								glyph={<TableGlyphW size={22} />}
								rows={[
									{title: "Operation", value: "Insert Row"},
									{title: "Table", value: "outcomes"},
								]}
								hideSourceHandle
								highlighted={log?.highlighted}
								state={log?.state}
							/>
						</div>
					</ParallelContainer>
				</div>

				{/* ════ BOTTOM BAND — the asides (separate boxes; case 17 amended) ════ */}
				{([0, 1, 2] as const).map((i) => {
					const p = panels[i];
					const vis = p.visible ?? 0;
					if (vis <= 0) return null;
					// Idle live-dot pulse, frame-derived, de-phased per panel; the
					// quiet gate freezes it at mid-glow exactly on boundary frames.
					const livePulse = p.ended ? 0 : 0.5 + 0.5 * Math.sin(frame / 9 + i * 2.1) * quiet;
					return (
						<div
							key={i}
							style={{
								position: "absolute",
								inset: 0,
								opacity: vis,
								transform: `translateY(${(1 - vis) * 26}px)`,
							}}
						>
							<CallPanel
								x={panelX(i)}
								y={PANEL_Y}
								w={PANEL_W}
								h={PANEL_H}
								dest={LANES[i].dest}
								livePulse={livePulse}
								ended={p.ended}
								turns={turnsFor(i, p.turnCount ?? 0, p.lastReveal ?? 1)}
								frame={frame}
								speaking={(p.speaking ?? 0) * quiet}
								seed={i + 1}
								outcome={
									(p.outcomeReveal ?? 0) > 0
										? {label: LANES[i].outcome, reveal: p.outcomeReveal ?? 0}
										: undefined
								}
								dim={1 - 0.55 * (p.dim ?? 0)}
							/>
						</div>
					);
				})}

				{/* The outcomes record — the REAL SimTable, its own box. */}
				{tableReveal > 0 ? (
					<div
						style={{
							position: "absolute",
							left: TABLE_X,
							top: TABLE_Y,
							opacity: tableReveal,
							transform: `translateY(${(1 - tableReveal) * 26}px)`,
						}}
					>
						<SimTable
							columns={TABLE_COLUMNS}
							rows={landedRows}
							scale={TABLE_SCALE}
							cellOpacity={(_, ri) => rowReveal[landedIdx[ri]] ?? 1}
							cellHighlight={(_, ri) => rowPulse[landedIdx[ri]] ?? 0}
						/>
					</div>
				) : null}
			</div>
		</div>
		</div>
	);
};
