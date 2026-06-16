import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode, WorkflowChain} from "../../../components";
import {SlideIn} from "../../../motion";
import {Connector, TableGrid} from "./_local";
import {BELONGS_COLUMNS, BELONGS_ROWS} from "../data";
import {
	CHAIN_X,
	CHAIN_Y,
	GRID_Y,
	HEADER_H,
	STAGE_H,
	STAGE_W,
	ROWNUM_W,
	TWO_UP_GRID_X,
	COL_W,
} from "../layout";

// Workflows do the work (left); tables keep it inspectable (right). An arrow
// from the chain lands in a single output column of the grid.
export const WorkVsInspectableScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const OUT_COL = 3; // "output" column receives the work

	// Arrow draws from chain → grid output column.
	const lineT = interpolate(frame, [1.2 * fps, 2.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Output column lights up after the arrow lands.
	const colGlow = interpolate(frame, [2.0 * fps, 2.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const lineX1 = CHAIN_X + 200 + 36; // right edge of last chain block
	const lineY1 = CHAIN_Y + 54;
	const lineX2 = TWO_UP_GRID_X + ROWNUM_W + OUT_COL * COL_W + COL_W / 2;
	const lineY2 = GRID_Y + HEADER_H / 2;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<Connector x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} t={lineT} color={COLORS.accent} />
			</svg>

			{/* Workflow chain (the work) */}
			<div style={{position: "absolute", left: CHAIN_X, top: CHAIN_Y}}>
				<SlideIn from="left" distance={60} duration={0.6}>
					<WorkflowChain blocks={[{label: "trigger"}, {label: "agent", tone: "brand"}]} />
				</SlideIn>
			</div>

			{/* Table (inspectable) */}
			<div style={{position: "absolute", left: TWO_UP_GRID_X, top: GRID_Y}}>
				<SlideIn from="right" distance={60} duration={0.6}>
					<TableGrid
						columns={BELONGS_COLUMNS}
						rows={BELONGS_ROWS}
						colHeaderHighlight={(c) => (c === OUT_COL ? colGlow : 0)}
						cellHighlight={(c) => (c === OUT_COL ? colGlow : 0)}
					/>
				</SlideIn>
			</div>

			{/* Table title tile above the grid */}
			<div style={{position: "absolute", left: TWO_UP_GRID_X, top: GRID_Y - 110}}>
				<SlideIn from="right" distance={60} duration={0.6} delay={0.1}>
					<ObjectNode kind="table" label="Table" layout="row" width={260} height={84} />
				</SlideIn>
			</div>
		</AbsoluteFill>
	);
};
