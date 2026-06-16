import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {TICKET_COLUMNS, ticketRowsFilled} from "../data";
import {GRID_X, GRID_Y, TITLE_TILE, titleTilePos} from "../layout";

// Pull back: the whole table is now filled, every row carrying its workflow
// output. A logs tile labels it as the inspect affordance — the dashboard.
const ROWS = ticketRowsFilled();

export const TableAsDashboardScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Subtle settle-in zoom from slightly tight to full.
	const zoom = interpolate(frame, [0, 1.0 * fps], [1.06, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Each output column glows in turn to read "every result at a glance".
	const colGlow = (c: number) => {
		if (c === 0) return 0;
		const s = (0.8 + (c - 1) * 0.4) * fps;
		return interpolate(frame, [s, s + 0.4 * fps, s + 1.0 * fps], [0, 1, 0.25], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	};

	// logs (inspect) tile fades in
	const logsT = interpolate(frame, [2.6 * fps, 3.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const tp = titleTilePos();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: tp.x, top: tp.y}}>
				<ObjectNode kind="table" label="Support tickets" layout="row" width={TITLE_TILE.w + 110} height={TITLE_TILE.h} />
			</div>

			<div
				style={{
					position: "absolute",
					left: GRID_X,
					top: GRID_Y,
					transform: `scale(${zoom})`,
					transformOrigin: "center center",
				}}
			>
				<TableGrid
					columns={TICKET_COLUMNS}
					rows={ROWS}
					colHeaderHighlight={colGlow}
					cellHighlight={(c) => colGlow(c)}
				/>
			</div>

			{/* logs / inspect affordance tile, bottom-right of the grid */}
			<div
				style={{
					position: "absolute",
					left: tp.x + TITLE_TILE.w + 470,
					top: tp.y,
					opacity: logsT,
					transform: `translateY(${(1 - logsT) * 14}px)`,
				}}
			>
				<ObjectNode kind="logs" label="inspect" layout="row" width={230} height={TITLE_TILE.h} />
			</div>
		</AbsoluteFill>
	);
};
