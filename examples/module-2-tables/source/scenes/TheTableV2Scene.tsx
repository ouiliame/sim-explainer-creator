import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {CAM_TABLE, CENTER_X, CENTER_Y} from "../layoutV2";
import {ramp, Stage} from "./_v2";

// v2 scene 1 — the-table (zoom-through → assemble). The Table tile from the
// module-1 workspace world sits alone at center; the camera pushes into it
// and crossfades to the table world, where the `leads` grid assembles:
// chrome + headers first, then the five rows' values stagger in. category
// stays empty; status reads unprocessed everywhere.
// Exit state == scene 2 enter: CAM_TABLE, full table, no selections.

const TILE_W = 240;
const TILE_H = 200;

export const TheTableV2Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// ── tile world: fade in, then the camera pushes through it ──
	const tileIn = ramp(t, 0.2, 0.8, EASING.out);
	const push = ramp(t, 2.0, 3.2, EASING.inOut);
	const tileScale = 1 + push * 3.8;
	const tileOp = tileIn * (1 - ramp(t, 2.4, 3.0));

	// ── table world fades in under the push (slight settle of the camera) ──
	const worldIn = ramp(t, 2.6, 3.4, EASING.out);
	const camS = CAM_TABLE.s * (0.94 + 0.06 * ramp(t, 2.6, 3.8, EASING.out));

	// Values stagger in row by row.
	const rowTextReveal = (r: number) => ramp(t, 3.7 + 0.3 * r, 4.2 + 0.3 * r, EASING.out);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{worldIn > 0 ? (
				<div style={{position: "absolute", inset: 0, opacity: worldIn}}>
					<Stage
						cam={{...CAM_TABLE, s: camS}}
						chainOn={false}
						rowTextReveal={rowTextReveal}
					/>
				</div>
			) : null}

			{tileOp > 0 ? (
				<div
					style={{
						position: "absolute",
						left: CENTER_X - TILE_W / 2,
						top: CENTER_Y - TILE_H / 2,
						opacity: tileOp,
						transform: `scale(${tileScale})`,
						transformOrigin: "center center",
					}}
				>
					<ObjectNode kind="table" />
				</div>
			) : null}
		</AbsoluteFill>
	);
};
