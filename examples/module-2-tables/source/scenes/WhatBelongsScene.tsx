import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {BELONGS_COLUMNS, BELONGS_ROWS} from "../data";
import {GRID_X, GRID_Y, TITLE_TILE, titleTilePos} from "../layout";

// Cells fill with the things tables hold; each column highlights in turn as it's
// named (status · score · category · output). Continues the anatomy grid.
export const WhatBelongsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Column reveal schedule: each column's cells fade/fill in turn.
	const colStart = (c: number) => (0.4 + c * 1.3) * fps;

	// A cell is "present" once its column's reveal has begun.
	const cellOpacity = (col: number, row: number) => {
		const start = colStart(col) + row * 0.06 * fps;
		return interpolate(frame, [start, start + 0.35 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	// The active column glows briefly as it's named, then settles.
	const colHeaderHighlight = (col: number) => {
		const s = colStart(col);
		return interpolate(frame, [s, s + 0.4 * fps, s + 1.0 * fps], [0, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	};
	const cellHighlight = (col: number) => colHeaderHighlight(col);

	const tp = titleTilePos();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: tp.x, top: tp.y}}>
				<ObjectNode kind="table" label="Table" subtitle="structured datatable" layout="row" width={TITLE_TILE.w + 70} height={TITLE_TILE.h} />
			</div>

			<div style={{position: "absolute", left: GRID_X, top: GRID_Y}}>
				<TableGrid
					columns={BELONGS_COLUMNS}
					rows={BELONGS_ROWS}
					cellOpacity={cellOpacity}
					cellHighlight={cellHighlight}
					colHeaderHighlight={colHeaderHighlight}
				/>
			</div>
		</AbsoluteFill>
	);
};
