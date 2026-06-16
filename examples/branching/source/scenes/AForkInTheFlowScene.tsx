import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {CanvasDots, Fork} from "./_fork";

// Scene 1 — a fork in the flow [assemble]. The docs' condition example
// assembles in preview order; then the new thing, staggered so it lands:
// each branch row's OWN handle lights and its edge draws to its lane.
// One block, two output ports — the split lives in the rows.
export const AForkInTheFlowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.5) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// Brief blue beat on a branch handle: up, hold, down.
	const beat = (t0: number) =>
		interpolate(t, [t0, t0 + 0.3, t0 + 0.7, t0 + 1.0], [0, 1, 1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<Fork
				phase={0}
				start={{opacity: reveal(0.5)}}
				decider={{opacity: reveal(1.2)}}
				destA={{opacity: reveal(2.9)}}
				destB={{opacity: reveal(4.3)}}
				edge0={{progress: reveal(0.9, 0.55)}}
				edgeA={{progress: reveal(2.5, 0.6)}}
				edgeB={{progress: reveal(3.9, 0.6)}}
				branchA={{handleGlow: Math.max(beat(2.2), beat(5.6))}}
				branchB={{handleGlow: Math.max(beat(3.6), beat(6.3))}}
			/>
		</AbsoluteFill>
	);
};
