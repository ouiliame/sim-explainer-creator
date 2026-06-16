import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WORKSPACE_GRID} from "../layout-v2";
import {FieldTile} from "./_local";

// Scene 1 — one surface (assemble). The eight workspace objects rise into
// the 4×2 grid one by one; the narration names them as they land.
// Beat intent: this is Sim — one workspace, everything your system uses
// lives in it, with a name.
// Exit state == scene 2 enter: full grid at rest, all tiles opacity 1.
export const OneSurfaceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{WORKSPACE_GRID.map((tile, i) => {
				const start = (0.6 + i * 0.5) * fps;
				const p = interpolate(frame, [start, start + 0.7 * fps], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: EASING.out,
				});
				return (
					<FieldTile
						key={tile.kind}
						kind={tile.kind}
						x={tile.x}
						y={tile.y + (1 - p) * 24}
						opacity={p}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
