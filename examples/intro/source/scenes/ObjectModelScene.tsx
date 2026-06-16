import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {OBJECT_GRID, TILE} from "../layout";

// Keystone beat: the core object vocabulary fades/pops into the workspace as a
// 3×3 grid of tiles. Each tile carries its own accent color + glyph.
export const ObjectModelScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{OBJECT_GRID.map((o) => {
				const start = o.appearAt * fps;
				const t = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: EASING.out,
				});
				const scale = 0.85 + 0.15 * t;
				return (
					<div
						key={o.kind}
						style={{
							position: "absolute",
							left: o.x,
							top: o.y,
							opacity: t,
							transform: `scale(${scale})`,
							transformOrigin: "center center",
						}}
					>
						<ObjectNode kind={o.kind} width={TILE.w} height={TILE.h} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
