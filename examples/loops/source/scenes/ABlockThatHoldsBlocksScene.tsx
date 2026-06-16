import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, Rig} from "./_rig";

// Scene 1 — a block that holds blocks [assemble]. The docs' LOOP_WORKFLOW
// shape assembles in flow order: Start → wire → the Loop container (box,
// header, inner Start pill) → the inner wire → Function 1 INSIDE → the
// container's own exit wire → Summary. Hold the balanced frame.
export const ABlockThatHoldsBlocksScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const c = (lo: number, hi: number, a = 0, b = 1, easing?: (x: number) => number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Rig
				phase={0}
				start={{opacity: c(0.5, 1.1, 0, 1, EASING.out)}}
				edge0={{progress: c(1.2, 1.8, 0, 1, EASING.out)}}
				container={{opacity: c(1.9, 2.7, 0, 1, EASING.out)}}
				edgeIn={{progress: c(2.9, 3.5, 0, 1, EASING.out)}}
				fn={{opacity: c(3.6, 4.3, 0, 1, EASING.out)}}
				edgeExit={{progress: c(4.7, 5.3, 0, 1, EASING.out)}}
				summary={{opacity: c(5.4, 6.1, 0, 1, EASING.out)}}
			/>
		</AbsoluteFill>
	);
};
