import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {AgentChain, CanvasDots} from "./_local";

// Scene 1 — an agent is a workflow. The chain assembles with the docs
// stagger; then the docs hero treatment: the Agent block rings, the rest
// dims. This block is where it thinks.
export const AWorkflowThatReasonsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const reveal = (t0: number, dur = 0.45) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// Hero treatment: agent focal, others recede — then release for scene 2.
	const dim = interpolate(t, [4.3, 5.0, 7.0, 7.8], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const ringOn = t > 4.3 && t < 7.4;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<CanvasDots />
			<AgentChain
				start={{opacity: reveal(0.6), dim}}
				agent={{opacity: reveal(1.1), highlighted: ringOn}}
				response={{opacity: reveal(1.6), dim}}
				edge1={{progress: reveal(1.0, 0.5), opacity: 1 - 0.45 * dim}}
				edge2={{progress: reveal(1.5, 0.5), opacity: 1 - 0.45 * dim}}
			/>
		</AbsoluteFill>
	);
};
