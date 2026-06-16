import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {ObjectNode} from "../../../components";
import {Connector, TableGrid, type ColumnSpec} from "./_local";
import {LEAD_NAMES, LEAD_INDUSTRY, LEAD_DESC, LEAD_QUALIFIED} from "../data";
import {
	CELL_H,
	COL_W,
	GRID_X,
	GRID_Y,
	HEADER_H,
	STAGE_H,
	STAGE_W,
	TITLE_TILE,
	titleTilePos,
} from "../layout";

// Made explicit because the spike found it confusing: left columns are INPUT
// (fed into the workflow), right columns are OUTPUT (results written back).
// Arrows cross the divide for a single focus row.
const FOCUS = 2;
const INPUT_COLS = [0, 1, 2];
const OUTPUT_COL = 3;

export const InputOutputColumnsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Input tint reveals first, then output tint.
	const inputT = interpolate(frame, [0.4 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const outputT = interpolate(frame, [1.4 * fps, 2.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const columns: ColumnSpec[] = [
		{name: "company", type: "text", tone: "input"},
		{name: "industry", type: "text", tone: "input"},
		{name: "description", type: "text", tone: "input"},
		{name: "qualified?", type: "boolean", tone: "output"},
	];
	const rows = LEAD_NAMES.map((n, r) => [
		{text: n},
		{text: LEAD_INDUSTRY[r]},
		{text: LEAD_DESC[r]},
		{text: LEAD_QUALIFIED[r]},
	]);

	// Arrows: each input cell of the focus row → the output cell.
	const arrowT = (i: number) => {
		const s = (2.4 + i * 0.4) * fps;
		return interpolate(frame, [s, s + 0.5 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	};

	const rowYc = GRID_Y + HEADER_H + FOCUS * CELL_H + CELL_H / 2;
	const outCx = GRID_X + OUTPUT_COL * COL_W + COL_W * 0.18;

	const tp = titleTilePos();

	// Divider x between input and output columns
	const dividerX = GRID_X + OUTPUT_COL * COL_W;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: tp.x, top: tp.y}}>
				<ObjectNode kind="table" label="Leads" layout="row" width={TITLE_TILE.w} height={TITLE_TILE.h} />
			</div>

			{/* input / output legends above the column groups */}
			<Legend
				x={GRID_X}
				w={3 * COL_W}
				label="input"
				color={COLORS.secondary}
				y={GRID_Y - 50}
				opacity={inputT}
			/>
			<Legend
				x={dividerX}
				w={COL_W}
				label="output"
				color={COLORS.accent}
				y={GRID_Y - 50}
				opacity={outputT}
			/>

			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{INPUT_COLS.map((c) => {
					const x1 = GRID_X + c * COL_W + COL_W / 2;
					return <Connector key={c} x1={x1} y1={rowYc} x2={outCx} y2={rowYc} t={arrowT(c)} color={COLORS.accent} width={2.5} />;
				})}
			</svg>

			<div style={{position: "absolute", left: GRID_X, top: GRID_Y}}>
				<TableGrid
					columns={columns}
					rows={rows}
					cellOpacity={(_c, r) => (r === FOCUS ? 1 : 0.5)}
				/>
			</div>
		</AbsoluteFill>
	);
};

const Legend: React.FC<{x: number; w: number; label: string; color: string; y: number; opacity: number}> = ({
	x,
	w,
	label,
	color,
	y,
	opacity,
}) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			width: w,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			gap: 8,
			opacity,
		}}
	>
		<span
			style={{
				...TYPE.label,
				fontSize: 22,
				color,
				textTransform: "uppercase",
				letterSpacing: 1.2,
				backgroundColor: color + "1f",
				border: `1px solid ${color}55`,
				borderRadius: RADIUS.sm,
				padding: "3px 16px",
			}}
		>
			{label}
		</span>
		<div style={{width: "70%", height: 3, backgroundColor: color, borderRadius: 2}} />
	</div>
);
