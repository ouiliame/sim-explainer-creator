import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {TICKET_COLUMNS, ticketRowsEmpty} from "../data";
import {GRID_X, GRID_Y, TITLE_TILE, titleTilePos} from "../layout";

// V2 opener: a table of support tickets settles in — message filled, the rest
// empty for now. This is the object the rest of V2 operates on.
const ROWS = ticketRowsEmpty();

export const TheTableScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const gridT = interpolate(frame, [0.2 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const titleT = interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const tp = titleTilePos();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: tp.x, top: tp.y, opacity: titleT}}>
				<ObjectNode kind="table" label="Support tickets" layout="row" width={TITLE_TILE.w + 110} height={TITLE_TILE.h} />
			</div>

			<div
				style={{
					position: "absolute",
					left: GRID_X,
					top: GRID_Y,
					opacity: gridT,
					transform: `translateY(${(1 - gridT) * 24}px)`,
				}}
			>
				<TableGrid columns={TICKET_COLUMNS} rows={ROWS} />
			</div>
		</AbsoluteFill>
	);
};
