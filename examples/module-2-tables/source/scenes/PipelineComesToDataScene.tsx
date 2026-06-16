import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {BELONGS_COLUMNS, BELONGS_ROWS} from "../data";
import {COL_W, GRID_Y, ROWNUM_W, TWO_UP_GRID_X} from "../layout";

// Teaser for Video 3: instead of records sliding into a pipeline, the workflow
// icon slides ONTO the table and a column lights up. The pipeline comes to data.
export const PipelineComesToDataScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const TARGET_COL = 3;
	const tileW = 220;
	const tileH = 84;

	// Workflow tile flies from upper-left toward the target column header.
	const targetX = TWO_UP_GRID_X + ROWNUM_W + TARGET_COL * COL_W + (COL_W - tileW) / 2;
	const targetY = GRID_Y - tileH - 14; // docks just above the column header
	const startX = targetX - 520;
	const startY = targetY - 220;

	const p = interpolate(frame, [0.4 * fps, 1.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const tileX = startX + (targetX - startX) * p;
	const tileY = startY + (targetY - startY) * p;

	// Column lights up once the tile lands.
	const colGlow = interpolate(frame, [1.5 * fps, 2.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: TWO_UP_GRID_X, top: GRID_Y}}>
				<TableGrid
					columns={BELONGS_COLUMNS}
					rows={BELONGS_ROWS}
					colHeaderHighlight={(c) => (c === TARGET_COL ? colGlow : 0)}
					cellHighlight={(c) => (c === TARGET_COL ? colGlow : 0)}
					colOpacity={(c) => (c === TARGET_COL ? 1 : interpolate(colGlow, [0, 1], [1, 0.5]))}
				/>
			</div>

			{/* Flying workflow tile */}
			<div style={{position: "absolute", left: tileX, top: tileY}}>
				<ObjectNode kind="workflow" label="Workflow" layout="row" width={tileW} height={tileH} />
			</div>
		</AbsoluteFill>
	);
};
