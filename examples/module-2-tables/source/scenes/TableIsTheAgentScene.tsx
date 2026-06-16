import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {CASCADE_COLUMNS, CASCADE_FILL, LEAD_NAMES} from "../data";
import {GRID_H, GRID_W, GRID_X, GRID_Y, TITLE_TILE, titleTilePos} from "../layout";

// Final framing: the whole table pulses as one active control surface — the
// per-row workflow columns glow together. The table is the agent.
const ROWS = LEAD_NAMES.map((n, r) => [
	{text: n},
	{text: CASCADE_FILL[r].enrich},
	{text: CASCADE_FILL[r].qualify},
	{text: CASCADE_FILL[r].outreach},
]);

export const TableIsTheAgentScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// One unified pulse across the whole surface.
	const pulse = interpolate(
		frame,
		[0.6 * fps, 1.4 * fps, 2.4 * fps, 3.4 * fps],
		[0, 1, 0.4, 1],
		{extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut},
	);

	// Gentle settle zoom.
	const zoom = interpolate(frame, [0, 1.2 * fps], [1, 1.04], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const glowHex = Math.round(pulse * 255).toString(16).padStart(2, "0");
	const haloHex = Math.round(pulse * 60).toString(16).padStart(2, "0");

	const tp = titleTilePos();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: tp.x, top: tp.y, opacity: 1}}>
				<ObjectNode kind="table" label="Active table" layout="row" width={TITLE_TILE.w + 60} height={TITLE_TILE.h} />
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
				{/* unified active-surface glow ring around the whole grid */}
				<div
					style={{
						position: "absolute",
						left: -6,
						top: -6,
						width: GRID_W + 12,
						height: GRID_H + 12,
						borderRadius: RADIUS.md,
						boxShadow: `0 0 0 2px ${COLORS.brand}${glowHex}, 0 0 60px ${COLORS.brand}${haloHex}`,
						pointerEvents: "none",
					}}
				/>
				<TableGrid
					columns={CASCADE_COLUMNS}
					rows={ROWS}
					colHeaderHighlight={(c) => (c >= 1 ? pulse : 0)}
				/>
			</div>
		</AbsoluteFill>
	);
};
