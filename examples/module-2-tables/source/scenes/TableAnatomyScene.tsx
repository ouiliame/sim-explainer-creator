import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, TYPE} from "../../../theme";
import {ObjectNode} from "../../../components";
import {TableGrid} from "./_local";
import {ANATOMY_COLUMNS} from "../data";
import {CELL_H, GRID_W, GRID_X, GRID_Y, HEADER_H, ROWNUM_W, TITLE_TILE, titleTilePos} from "../layout";

// Keystone definition beat. An empty grid materializes; rows annotate as
// "records", columns as "fields", and a type-chip row reveals under the headers.
const ROWS = ANATOMY_COLUMNS.map(() => ({}));
const BODY = Array.from({length: 5}).map(() => ROWS);

export const TableAnatomyScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Grid expands in
	const gridT = interpolate(frame, [0.2 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Title tile fades in
	const titleT = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// "records" bracket label on the left
	const recordsT = interpolate(frame, [2.4 * fps, 3.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	// "fields" bracket label across the top
	const fieldsT = interpolate(frame, [3.6 * fps, 4.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	// type chips reveal (handled by passing columns w/ type once chipsT crosses)
	const chipsT = interpolate(frame, [5.4 * fps, 6.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const columns = ANATOMY_COLUMNS.map((c) => ({...c, type: chipsT > 0.05 ? c.type : undefined}));

	const tp = titleTilePos();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Title tile */}
			<div style={{position: "absolute", left: tp.x, top: tp.y, opacity: titleT}}>
				<ObjectNode kind="table" label="Table" subtitle="structured datatable" layout="row" width={TITLE_TILE.w + 70} height={TITLE_TILE.h} />
			</div>

			{/* Grid */}
			<div
				style={{
					position: "absolute",
					left: GRID_X,
					top: GRID_Y,
					transform: `scale(${0.94 + 0.06 * gridT})`,
					transformOrigin: "center top",
					opacity: gridT,
				}}
			>
				<TableGrid columns={columns} rows={BODY} cellOpacity={() => 1} />
			</div>

			{/* "records" bracket — spans exactly the 5 body rows */}
			<div
				style={{
					position: "absolute",
					left: GRID_X - 150,
					top: GRID_Y + HEADER_H,
					height: 5 * CELL_H - 2,
					display: "flex",
					alignItems: "center",
					gap: 14,
					opacity: recordsT,
				}}
			>
				<div style={{...TYPE.label, fontSize: 26, color: COLORS.accent, transform: "translateX(8px)"}}>records</div>
				<div style={{width: 3, height: "100%", backgroundColor: COLORS.accent, borderRadius: 2}} />
			</div>

			{/* "fields" bracket — spans exactly the data columns (gutter excluded) */}
			<div
				style={{
					position: "absolute",
					left: GRID_X + ROWNUM_W,
					top: GRID_Y - 56,
					width: GRID_W - ROWNUM_W,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 10,
					opacity: fieldsT,
				}}
			>
				<div style={{...TYPE.label, fontSize: 26, color: COLORS.secondary}}>fields</div>
				<div style={{width: "100%", height: 3, backgroundColor: COLORS.secondary, borderRadius: 2}} />
			</div>
		</AbsoluteFill>
	);
};
