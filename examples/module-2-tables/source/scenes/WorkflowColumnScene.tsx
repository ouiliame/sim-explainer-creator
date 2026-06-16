import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid, type ColumnSpec} from "./_local";
import {LEAD_NAMES, LEAD_INDUSTRY, LEAD_DESC, LEAD_QUALIFIED} from "../data";
import {GRID_X, GRID_Y, TITLE_TILE, titleTilePos} from "../layout";

// Keystone V3 beat: one column header transforms into a workflow column; it then
// runs once per row, top to bottom, filling each output cell in turn.
const WF_COL = 3;

export const WorkflowColumnScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Header transforms into a workflow header at ~0.6s.
	const headerSwap = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const columns: ColumnSpec[] = [
		{name: "company", type: "text"},
		{name: "industry", type: "text"},
		{name: "description", type: "text"},
		headerSwap > 0.5
			? {name: "qualify", workflow: true, tone: "output"}
			: {name: "qualified?", type: "boolean"},
	];

	// Per-row run: cells fill top to bottom.
	const rowRunT = (r: number) => {
		const s = (1.8 + r * 0.55) * fps;
		return interpolate(frame, [s, s + 0.4 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	const rows = LEAD_NAMES.map((n, r) => [
		{text: n},
		{text: LEAD_INDUSTRY[r]},
		{text: LEAD_DESC[r]},
		rowRunT(r) > 0.4 ? {text: LEAD_QUALIFIED[r]} : {},
	]);

	const cellHighlight = (c: number, r: number) => {
		if (c !== WF_COL) return 0;
		const s = (1.8 + r * 0.55) * fps;
		return interpolate(frame, [s, s + 0.35 * fps, s + 0.9 * fps], [0, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	};

	const tp = titleTilePos();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: tp.x, top: tp.y}}>
				<ObjectNode kind="table" label="Leads" layout="row" width={TITLE_TILE.w} height={TITLE_TILE.h} />
			</div>

			<div style={{position: "absolute", left: GRID_X, top: GRID_Y}}>
				<TableGrid
					columns={columns}
					rows={rows}
					colHeaderHighlight={(c) => (c === WF_COL ? headerSwap : 0)}
					cellHighlight={cellHighlight}
				/>
			</div>
		</AbsoluteFill>
	);
};
