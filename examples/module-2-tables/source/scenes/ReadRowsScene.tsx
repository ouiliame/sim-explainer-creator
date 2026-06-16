import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {WorkflowChain} from "../../../components";
import {Connector, TableGrid} from "./_local";
import {FOCUS_ROW, TICKET_COLUMNS, TICKET_MESSAGES, ticketRowsEmpty} from "../data";
import {
	CELL_H,
	CHAIN_X,
	CHAIN_Y,
	GRID_Y,
	HEADER_H,
	STAGE_H,
	STAGE_W,
	TWO_UP_GRID_X,
} from "../layout";

// A Table block reads one row from the grid and hands it to the workflow as
// input — the ticket message ghosts into the trigger block.
const ROWS = ticketRowsEmpty();

export const ReadRowsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Focus row highlights.
	const rowGlow = interpolate(frame, [0.4 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// A compact data pill rides the connector line from the focus row into the
	// Table block — same packet-on-wire language as the workflows module.
	const travel = interpolate(frame, [1.2 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	// Absorbed: fades + shrinks just before reaching the block's edge.
	const ghostOp =
		interpolate(frame, [1.1 * fps, 1.35 * fps], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) *
		interpolate(travel, [0.68, 0.9], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
	const ghostScale = interpolate(travel, [0.68, 0.9], [1, 0.6], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Connector line grid → chain
	const lineT = interpolate(frame, [0.9 * fps, 1.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// trigger block glows once the row lands
	const triggerGlow = interpolate(frame, [2.2 * fps, 2.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const lineX2 = TWO_UP_GRID_X;
	const lineY2 = GRID_Y + HEADER_H + FOCUS_ROW * CELL_H + CELL_H / 2;
	const lineX1 = CHAIN_X + 200;
	const lineY1 = CHAIN_Y + 54;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<Connector x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} t={lineT} color={COLORS.secondary} />
			</svg>

			{/* Workflow chain */}
			<div style={{position: "absolute", left: CHAIN_X, top: CHAIN_Y}}>
				<div
					style={{
						boxShadow: `0 0 0 1px ${COLORS.secondary}${Math.round(triggerGlow * 200).toString(16).padStart(2, "0")}, 0 0 36px ${COLORS.secondary}${Math.round(triggerGlow * 90).toString(16).padStart(2, "0")}`,
						borderRadius: RADIUS.sm,
						width: 200,
						height: 108,
					}}
				>
					<WorkflowChain blocks={[{label: "Table block"}]} />
				</div>
			</div>

			{/* Table */}
			<div style={{position: "absolute", left: TWO_UP_GRID_X, top: GRID_Y}}>
				<TableGrid
					columns={TICKET_COLUMNS}
					rows={ROWS}
					cellHighlight={(_c, r) => (r === FOCUS_ROW ? rowGlow : 0)}
					cellOpacity={(_c, r) => (r === FOCUS_ROW ? 1 : interpolate(rowGlow, [0, 1], [1, 0.45]))}
				/>
			</div>

			{/* Data pill riding the wire from the row into the block */}
			{ghostOp > 0 ? (
				<div
					style={{
						position: "absolute",
						left: lineX2 + (lineX1 - lineX2) * travel,
						top: lineY2 + (lineY1 - lineY2) * travel - 21,
						transform: `translateX(-50%) scale(${ghostScale})`,
						transformOrigin: "center center",
						height: 42,
						display: "flex",
						alignItems: "center",
						padding: "0 18px",
						backgroundColor: COLORS.surface2,
						border: `1.5px solid ${COLORS.secondary}`,
						borderRadius: 21,
						boxShadow: `0 0 20px ${COLORS.secondary}44`,
						...TYPE.mono,
						fontSize: 18,
						color: COLORS.secondary,
						whiteSpace: "nowrap",
						opacity: ghostOp,
					}}
				>
					{TICKET_MESSAGES[FOCUS_ROW]}
				</div>
			) : null}
		</AbsoluteFill>
	);
};
