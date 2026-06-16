import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BoundaryFrame} from "./_local";
import {BOUNDARY_H, BOUNDARY_W, BOUNDARY_X, BOUNDARY_Y} from "../layout";

// Scene 1 — workspace-is-a-boundary.
// A single labeled box draws itself. Establishes the box everything lives in.
export const BoundaryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// The box scales up from its center and fades in.
	const t = interpolate(frame, [0.2 * fps, 1.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const scale = 0.9 + 0.1 * t;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					left: BOUNDARY_X,
					top: BOUNDARY_Y,
					opacity: t,
					transform: `scale(${scale})`,
					transformOrigin: "center center",
				}}
			>
				<BoundaryFrame label="my workspace" width={BOUNDARY_W} height={BOUNDARY_H} />
			</div>
		</AbsoluteFill>
	);
};
