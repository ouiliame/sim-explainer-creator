import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CENTER_X, CENTER_Y} from "../layout";
import {CanvasDots, Fork} from "./_fork";

// Scene 7 — still one workflow [settle / bookend]. The same morph runs in
// reverse — Billing's lane fades (its edge fades, never retracts), the
// grown rows shrink out at exact heights, the header crossfades back —
// landing on the fork scene 1 ended on. Then the camera eases back ~7%
// and the balanced frame holds for the VO.
export const StillOneWorkflowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const phase = interpolate(t, [0.7, 4.0], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const ease = interpolate(t, [3.8, 5.4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const s = 1 - 0.07 * ease;
	const tx = CENTER_X * (1 - s);
	const ty = CENTER_Y * (1 - s);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `translate(${tx}px, ${ty}px) scale(${s})`,
					transformOrigin: "0 0",
				}}
			>
				<Fork phase={phase} />
			</div>
		</AbsoluteFill>
	);
};
