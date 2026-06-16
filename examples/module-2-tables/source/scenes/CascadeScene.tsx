import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {CASCADE_COLUMNS, CASCADE_FILL, LEAD_NAMES} from "../data";
import {GRID_X, GRID_Y, TITLE_TILE, titleTilePos} from "../layout";

// Three workflow columns: enrich → qualify → outreach. Column 1 fills, which
// unblocks column 2, which unblocks column 3 — a dependency wave across the grid.
const WF_COLS = [1, 2, 3];

export const CascadeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Each column starts after the previous finishes filling all rows.
	const colStart = (c: number) => (0.6 + WF_COLS.indexOf(c) * 1.7) * fps;
	const cellFillT = (col: number, row: number) => {
		const s = colStart(col) + row * 0.18 * fps;
		return interpolate(frame, [s, s + 0.35 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	const rows = LEAD_NAMES.map((n, r) => [
		{text: n},
		cellFillT(1, r) > 0.4 ? {text: CASCADE_FILL[r].enrich} : {},
		cellFillT(2, r) > 0.4 ? {text: CASCADE_FILL[r].qualify} : {},
		cellFillT(3, r) > 0.4 ? {text: CASCADE_FILL[r].outreach} : {},
	]);

	const cellHighlight = (col: number, row: number) => {
		if (!WF_COLS.includes(col)) return 0;
		const s = colStart(col) + row * 0.18 * fps;
		return interpolate(frame, [s, s + 0.3 * fps, s + 0.8 * fps], [0, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	};

	// The active column header glows while it's running.
	const colHeaderHighlight = (col: number) => {
		if (!WF_COLS.includes(col)) return 0;
		const s = colStart(col);
		const e = colStart(col) + (LEAD_NAMES.length * 0.18 + 0.5) * fps;
		return interpolate(frame, [s, s + 0.3 * fps, e, e + 0.3 * fps], [0, 1, 1, 0.15], {
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
					columns={CASCADE_COLUMNS}
					rows={rows}
					cellHighlight={cellHighlight}
					colHeaderHighlight={colHeaderHighlight}
				/>
			</div>
		</AbsoluteFill>
	);
};
