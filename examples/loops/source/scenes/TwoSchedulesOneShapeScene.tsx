import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {Camera, CanvasDots, Rig} from "./_rig";

// Scene 7 — two schedules, one shape [settle / bookend]. The scene-5
// morph plays in reverse (yellow → blue, Split → Repeat, the tags dip
// back), landing exactly on scene 1's end state; then the camera eases
// back ~7% and holds the balanced frame for VO.
export const TwoSchedulesOneShapeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	const phase = 1 - c(0.8, 4.2, 0, 1, EASING.inOut);
	const s = 1 - 0.07 * c(4.6, 6.0, 0, 1, EASING.inOut);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Camera px={960} py={540} s={s}>
				<Rig phase={phase} />
			</Camera>
		</AbsoluteFill>
	);
};
