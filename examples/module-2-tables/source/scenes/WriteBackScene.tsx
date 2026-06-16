import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {AgentNode} from "../../../components";
import {Connector, TableGrid} from "./_local";
import {FOCUS_ROW, TICKET_COLUMNS, TICKET_FILLED, ticketRowsEmpty} from "../data";
import {
	CELL_H,
	GRID_Y,
	HEADER_H,
	STAGE_H,
	STAGE_W,
	TWO_UP_GRID_X,
} from "../layout";

// The structured result flows back into the matching empty cells of the focus
// row; the status cell flips from blank to filled.
export const WriteBackScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const agentX = 120;
	const agentY = STAGE_H / 2 - 90;
	const agentW = 260;
	const agentH = 180;

	// Each output cell fills in turn: category(1) urgency(2) status(3)
	const fillCols = [1, 2, 3];
	const cellFillT = (col: number) => {
		const idx = fillCols.indexOf(col);
		if (idx < 0) return 0;
		const s = (1.2 + idx * 0.7) * fps;
		return interpolate(frame, [s, s + 0.45 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	// Build rows where focus row's output cells appear based on cellFillT.
	const baseRows = ticketRowsEmpty();
	const rows = baseRows.map((row, r) => {
		if (r !== FOCUS_ROW) return row;
		return [
			row[0],
			cellFillT(1) > 0.4 ? {text: TICKET_FILLED[r].category} : {},
			cellFillT(2) > 0.4 ? {text: TICKET_FILLED[r].urgency} : {},
			cellFillT(3) > 0.4 ? {text: TICKET_FILLED[r].status} : {},
		];
	});

	// Connector agent → focus row
	const lineT = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const lineX1 = agentX + agentW;
	const lineY1 = agentY + agentH / 2;
	const lineX2 = TWO_UP_GRID_X;
	const lineY2 = GRID_Y + HEADER_H + FOCUS_ROW * CELL_H + CELL_H / 2;

	const cellHighlight = (col: number, r: number) =>
		r === FOCUS_ROW && fillCols.includes(col) ? cellFillT(col) : 0;
	const cellOpacity = (_c: number, r: number) =>
		r === FOCUS_ROW ? 1 : interpolate(lineT, [0, 1], [1, 0.5]);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<Connector x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} t={lineT} color={COLORS.accent} />
			</svg>

			<div style={{position: "absolute", left: agentX, top: agentY}}>
				<AgentNode label="agent" width={agentW} height={agentH} />
			</div>

			{/* result chips stack under the agent, then hand off to the table */}
			<div
				style={{
					position: "absolute",
					left: agentX + 30,
					top: agentY + agentH + 24,
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					gap: 10,
					opacity:
						interpolate(frame, [0, 0.5 * fps], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) *
						interpolate(frame, [3.6 * fps, 4.4 * fps], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
				}}
			>
				{["billing", "high", "done"].map((v, i) => (
					<span
						key={i}
						style={{
							...TYPE.micro,
							fontSize: 17,
							color: COLORS.accent,
							backgroundColor: COLORS.accentSoft,
							border: `1px solid ${COLORS.accent}55`,
							borderRadius: RADIUS.sm,
							padding: "5px 12px",
						}}
					>
						{v}
					</span>
				))}
			</div>

			<div style={{position: "absolute", left: TWO_UP_GRID_X, top: GRID_Y}}>
				<TableGrid columns={TICKET_COLUMNS} rows={rows} cellHighlight={cellHighlight} cellOpacity={cellOpacity} />
			</div>
		</AbsoluteFill>
	);
};
